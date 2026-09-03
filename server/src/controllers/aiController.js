import User from '../models/User.js';
import Attendance from '../models/Attendance.js';
import AssignmentSubmission from '../models/AssignmentSubmission.js';
import Grade from '../models/Grade.js';
import Subject from '../models/Subject.js';
import { ROLES } from '../config/constants.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';
import {
  generateStudentPerformanceSummary,
  detectWeakSubjects,
  generateStudyPlan,
  getLearningResources,
} from '../services/aiService.js';

export const getPerformanceSummary = async (req, res, next) => {
  try {
    const studentId = req.body.studentId || (req.user.role === ROLES.STUDENT ? req.user._id : null);
    if (!studentId) {
      return errorResponse(res, 400, 'Student ID is required');
    }

    const student = await User.findById(studentId);
    if (!student) {
      return errorResponse(res, 404, 'Student not found');
    }

    // Tenant check
    if (
      req.user.role !== ROLES.SUPER_ADMIN &&
      student.institutionId?.toString() !== req.user.institutionId?.toString()
    ) {
      return errorResponse(res, 403, 'Forbidden: Cannot access student from another institution');
    }

    const [attendanceRecords, assignmentSubmissions, grades] = await Promise.all([
      Attendance.find({ studentId }),
      AssignmentSubmission.find({ studentId }),
      Grade.find({ studentId }).populate('subjectId', 'name code'),
    ]);

    const summary = await generateStudentPerformanceSummary({
      userId: req.user._id,
      institutionId: student.institutionId,
      student,
      attendanceRecords,
      assignmentSubmissions,
      grades,
    });

    return successResponse(res, 200, 'AI Student Performance Summary generated', summary);
  } catch (err) {
    next(err);
  }
};

export const getWeakSubjects = async (req, res, next) => {
  try {
    const studentId = req.params.studentId || (req.user.role === ROLES.STUDENT ? req.user._id : null);
    if (!studentId) {
      return errorResponse(res, 400, 'Student ID is required');
    }

    const student = await User.findById(studentId);
    if (!student) {
      return errorResponse(res, 404, 'Student not found');
    }

    const subjects = await Subject.find({
      institutionId: student.institutionId,
      departmentId: student.departmentId,
      semester: student.currentSemester || 1,
      isActive: true,
    });

    const [grades, attendanceRecords, submissions] = await Promise.all([
      Grade.find({ studentId }),
      Attendance.find({ studentId }),
      AssignmentSubmission.find({ studentId }),
    ]);

    const result = await detectWeakSubjects({
      userId: req.user._id,
      institutionId: student.institutionId,
      student,
      subjects,
      grades,
      attendanceRecords,
      submissions,
    });

    return successResponse(res, 200, 'Weak subject analysis completed', result);
  } catch (err) {
    next(err);
  }
};

export const createStudyPlan = async (req, res, next) => {
  try {
    const { subjectName, topics, examDate, availableHoursPerDay, currentPerformance } = req.body;

    if (!subjectName || !examDate) {
      return errorResponse(res, 400, 'Subject name and exam date are required.');
    }

    const plan = await generateStudyPlan({
      userId: req.user._id,
      institutionId: req.user.institutionId,
      subjectName,
      topics,
      examDate,
      availableHoursPerDay: Number(availableHoursPerDay) || 3,
      currentPerformance: Number(currentPerformance) || 60,
    });

    return successResponse(res, 200, 'AI Study & Revision Plan generated', plan);
  } catch (err) {
    next(err);
  }
};

export const getRecommendations = async (req, res, next) => {
  try {
    const { subjectName, topic } = req.query;

    const resources = await getLearningResources({
      userId: req.user._id,
      institutionId: req.user.institutionId,
      subjectName: subjectName || 'Computer Science',
      topic,
    });

    return successResponse(res, 200, 'Learning resources retrieved', resources);
  } catch (err) {
    next(err);
  }
};
