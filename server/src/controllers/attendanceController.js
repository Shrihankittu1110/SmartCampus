import Attendance from '../models/Attendance.js';
import Subject from '../models/Subject.js';
import User from '../models/User.js';
import Institution from '../models/Institution.js';
import { ROLES, ATTENDANCE_STATUS, ATTENDANCE_THRESHOLDS } from '../config/constants.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';
import { logActivity } from '../utils/auditLogger.js';
import { sendNotification } from '../utils/notify.js';
import { generateAttendanceCSV } from '../services/exportService.js';

export const markAttendance = async (req, res, next) => {
  try {
    const { subjectId, date, records } = req.body;
    const institutionId = req.user.institutionId;

    const subject = await Subject.findById(subjectId);
    if (!subject) {
      return errorResponse(res, 404, 'Subject not found');
    }

    // Verify faculty assignment if role is FACULTY
    if (req.user.role === ROLES.FACULTY) {
      const isAssigned = subject.facultyIds.some(
        (id) => id.toString() === req.user._id.toString()
      );
      if (!isAssigned) {
        return errorResponse(res, 403, 'You are not assigned to teach this subject.');
      }
    }

    const attendanceDate = new Date(date);
    attendanceDate.setHours(0, 0, 0, 0);

    const bulkOps = records.map((record) => ({
      updateOne: {
        filter: {
          studentId: record.studentId,
          subjectId,
          date: attendanceDate,
        },
        update: {
          $set: {
            status: record.status || ATTENDANCE_STATUS.PRESENT,
            remarks: record.remarks || '',
            facultyId: req.user._id,
            institutionId,
            courseId: subject.courseId,
          },
        },
        upsert: true,
      },
    }));

    await Attendance.bulkWrite(bulkOps);

    await logActivity({
      userId: req.user._id,
      institutionId,
      action: 'ATTENDANCE_RECORDED',
      entity: 'Attendance',
      entityId: subjectId,
      metadata: { subject: subject.name, date: attendanceDate, count: records.length },
      req,
    });

    // Asynchronously check for any students in this batch whose attendance dropped into warning/critical
    for (const record of records) {
      if (record.status === ATTENDANCE_STATUS.ABSENT) {
        const studentHistory = await Attendance.find({
          studentId: record.studentId,
          subjectId,
        });
        const total = studentHistory.length;
        const present = studentHistory.filter((a) => a.status === ATTENDANCE_STATUS.PRESENT).length;
        const pct = total > 0 ? (present / total) * 100 : 100;

        if (pct < ATTENDANCE_THRESHOLDS.SAFE) {
          await sendNotification({
            userId: record.studentId,
            institutionId,
            title: 'Attendance Warning Alert',
            message: `Your attendance in ${subject.name} has fallen to ${Math.round(pct)}% (below ${ATTENDANCE_THRESHOLDS.SAFE}%). Please attend forthcoming classes to prevent detention.`,
            type: 'ATTENDANCE_WARNING',
            relatedEntity: { entityType: 'Subject', entityId: subjectId },
          });
        }
      }
    }

    return successResponse(res, 200, `Attendance marked successfully for ${records.length} students.`);
  } catch (err) {
    next(err);
  }
};

export const getSubjectAttendanceForDate = async (req, res, next) => {
  try {
    const { subjectId } = req.params;
    const { date } = req.query;

    if (!date) {
      return errorResponse(res, 400, 'Date parameter is required.');
    }

    const attendanceDate = new Date(date);
    attendanceDate.setHours(0, 0, 0, 0);

    const records = await Attendance.find({
      subjectId,
      date: attendanceDate,
    }).populate('studentId', 'name rollNumber email profileImage');

    return successResponse(res, 200, 'Attendance records fetched', records);
  } catch (err) {
    next(err);
  }
};

export const getStudentAttendanceSummary = async (req, res, next) => {
  try {
    const studentId = req.params.studentId || req.user._id;

    // Student can only see their own attendance; Faculty & Admin can see any student in their tenant
    if (
      req.user.role === ROLES.STUDENT &&
      studentId.toString() !== req.user._id.toString()
    ) {
      return errorResponse(res, 403, 'Forbidden: You cannot view attendance records of other students.');
    }

    const records = await Attendance.find({ studentId })
      .populate('subjectId', 'name code semester credits')
      .sort({ date: -1 });

    const totalSessions = records.length;
    const presentCount = records.filter((r) => r.status === ATTENDANCE_STATUS.PRESENT).length;
    const absentCount = records.filter((r) => r.status === ATTENDANCE_STATUS.ABSENT).length;
    const lateCount = records.filter((r) => r.status === ATTENDANCE_STATUS.LATE).length;
    const excusedCount = records.filter((r) => r.status === ATTENDANCE_STATUS.EXCUSED).length;

    const overallPercentage =
      totalSessions > 0 ? Math.round((presentCount / totalSessions) * 100) : 100;

    let overallStatus = 'Safe';
    if (overallPercentage < ATTENDANCE_THRESHOLDS.WARNING) {
      overallStatus = 'Critical';
    } else if (overallPercentage < ATTENDANCE_THRESHOLDS.SAFE) {
      overallStatus = 'Warning';
    }

    // Group by subject
    const subjectMap = {};
    records.forEach((r) => {
      const subId = r.subjectId?._id?.toString() || 'unknown';
      if (!subjectMap[subId]) {
        subjectMap[subId] = {
          subject: r.subjectId,
          total: 0,
          present: 0,
          absent: 0,
          late: 0,
          excused: 0,
        };
      }
      subjectMap[subId].total += 1;
      if (r.status === ATTENDANCE_STATUS.PRESENT) subjectMap[subId].present += 1;
      if (r.status === ATTENDANCE_STATUS.ABSENT) subjectMap[subId].absent += 1;
      if (r.status === ATTENDANCE_STATUS.LATE) subjectMap[subId].late += 1;
      if (r.status === ATTENDANCE_STATUS.EXCUSED) subjectMap[subId].excused += 1;
    });

    const subjectBreakdown = Object.values(subjectMap).map((item) => {
      const percentage = item.total > 0 ? Math.round((item.present / item.total) * 100) : 100;
      let status = 'Safe';
      if (percentage < ATTENDANCE_THRESHOLDS.WARNING) status = 'Critical';
      else if (percentage < ATTENDANCE_THRESHOLDS.SAFE) status = 'Warning';

      return {
        subjectId: item.subject?._id,
        subjectCode: item.subject?.code,
        subjectName: item.subject?.name,
        total: item.total,
        present: item.present,
        absent: item.absent,
        late: item.late,
        excused: item.excused,
        percentage,
        status,
      };
    });

    return successResponse(res, 200, 'Student attendance summary fetched', {
      overall: {
        totalSessions,
        presentCount,
        absentCount,
        lateCount,
        excusedCount,
        percentage: overallPercentage,
        status: overallStatus,
      },
      subjectBreakdown,
      recentRecords: records.slice(0, 20),
    });
  } catch (err) {
    next(err);
  }
};

export const getCollegeAttendanceReport = async (req, res, next) => {
  try {
    const institutionId = req.user.role === ROLES.SUPER_ADMIN ? (req.query.institutionId || req.user.institutionId) : req.user.institutionId;
    const { departmentId, courseId, subjectId, startDate, endDate } = req.query;

    const query = { institutionId };

    if (subjectId) query.subjectId = subjectId;
    if (courseId) query.courseId = courseId;
    if (startDate && endDate) {
      query.date = { $gte: new Date(startDate), $lte: new Date(endDate) };
    }

    const records = await Attendance.find(query)
      .populate('studentId', 'name rollNumber email departmentId')
      .populate('subjectId', 'name code')
      .populate('facultyId', 'name')
      .sort({ date: -1 })
      .limit(1000);

    return successResponse(res, 200, 'College attendance report fetched', records);
  } catch (err) {
    next(err);
  }
};

export const exportAttendanceReportCSV = async (req, res, next) => {
  try {
    const institutionId = req.user.role === ROLES.SUPER_ADMIN ? (req.query.institutionId || req.user.institutionId) : req.user.institutionId;
    const { subjectId, startDate, endDate } = req.query;

    const query = { institutionId };
    if (subjectId) query.subjectId = subjectId;
    if (startDate && endDate) {
      query.date = { $gte: new Date(startDate), $lte: new Date(endDate) };
    }

    const records = await Attendance.find(query)
      .populate('studentId', 'name rollNumber')
      .populate('subjectId', 'name code')
      .sort({ date: -1 })
      .limit(2000);

    const csvData = generateAttendanceCSV(records);
    res.header('Content-Type', 'text/csv');
    res.attachment(`attendance-${Date.now()}.csv`);
    return res.send(csvData);
  } catch (err) {
    next(err);
  }
};
