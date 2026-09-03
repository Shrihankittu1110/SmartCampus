import User from '../models/User.js';
import Institution from '../models/Institution.js';
import Department from '../models/Department.js';
import Course from '../models/Course.js';
import Subject from '../models/Subject.js';
import Attendance from '../models/Attendance.js';
import Assignment from '../models/Assignment.js';
import AssignmentSubmission from '../models/AssignmentSubmission.js';
import StudentRequest from '../models/StudentRequest.js';
import Event from '../models/Event.js';
import Company from '../models/Company.js';
import JobDrive from '../models/JobDrive.js';
import PlacementApplication from '../models/PlacementApplication.js';
import PlacementOutcome from '../models/PlacementOutcome.js';
import Grade from '../models/Grade.js';
import Notification from '../models/Notification.js';
import { ROLES, ATTENDANCE_THRESHOLDS } from '../config/constants.js';
import { successResponse } from '../utils/apiResponse.js';

export const getDashboardStats = async (req, res, next) => {
  try {
    const { role } = req.user;
    const institutionId = req.user.institutionId;

    if (role === ROLES.SUPER_ADMIN) {
      const [
        totalInstitutions,
        totalUsers,
        totalStudents,
        totalFaculty,
        totalCollegesActive,
        activeDrives,
      ] = await Promise.all([
        Institution.countDocuments(),
        User.countDocuments(),
        User.countDocuments({ role: ROLES.STUDENT }),
        User.countDocuments({ role: ROLES.FACULTY }),
        Institution.countDocuments({ isActive: true }),
        JobDrive.countDocuments({ status: 'PUBLISHED' }),
      ]);

      return successResponse(res, 200, 'Super Admin metrics fetched', {
        totalInstitutions,
        totalUsers,
        totalStudents,
        totalFaculty,
        totalCollegesActive,
        activeDrives,
      });
    }

    if (role === ROLES.COLLEGE_ADMIN) {
      const [
        totalStudents,
        totalFaculty,
        totalDepartments,
        totalCourses,
        totalAssignments,
        pendingRequests,
        upcomingEvents,
        totalCompanies,
        totalPlaced,
      ] = await Promise.all([
        User.countDocuments({ institutionId, role: ROLES.STUDENT, isActive: true }),
        User.countDocuments({ institutionId, role: ROLES.FACULTY, isActive: true }),
        Department.countDocuments({ institutionId, isActive: true }),
        Course.countDocuments({ institutionId, isActive: true }),
        Assignment.countDocuments({ institutionId }),
        StudentRequest.countDocuments({ institutionId, status: 'PENDING' }),
        Event.countDocuments({ institutionId, startDate: { $gte: new Date() }, isActive: true }),
        Company.countDocuments({ institutionId, isActive: true }),
        PlacementOutcome.countDocuments({ institutionId, outcome: 'ACCEPTED' }),
      ]);

      return successResponse(res, 200, 'College Admin metrics fetched', {
        totalStudents,
        totalFaculty,
        totalDepartments,
        totalCourses,
        totalAssignments,
        pendingRequests,
        upcomingEvents,
        totalCompanies,
        totalPlaced,
      });
    }

    if (role === ROLES.FACULTY) {
      const [assignedSubjects, assignmentsCreated, pendingGrading] = await Promise.all([
        Subject.find({ institutionId, facultyIds: req.user._id, isActive: true }),
        Assignment.countDocuments({ facultyId: req.user._id }),
        AssignmentSubmission.countDocuments({
          status: { $in: ['SUBMITTED', 'RESUBMITTED'] },
          assignmentId: {
            $in: (await Assignment.find({ facultyId: req.user._id }).select('_id')).map((a) => a._id),
          },
        }),
      ]);

      return successResponse(res, 200, 'Faculty metrics fetched', {
        assignedSubjectsCount: assignedSubjects.length,
        assignedSubjects,
        assignmentsCreated,
        pendingGrading,
      });
    }

    if (role === ROLES.STUDENT) {
      const [
        attendanceRecords,
        pendingAssignments,
        recentGrades,
        pendingRequests,
        activeDrives,
        unreadNotifications,
      ] = await Promise.all([
        Attendance.find({ studentId: req.user._id }),
        Assignment.find({
          institutionId,
          departmentId: req.user.departmentId,
          dueDate: { $gte: new Date() },
        }),
        Grade.find({ studentId: req.user._id }).populate('subjectId', 'name code').limit(5),
        StudentRequest.countDocuments({ studentId: req.user._id, status: 'PENDING' }),
        JobDrive.countDocuments({ institutionId, status: 'PUBLISHED' }),
        Notification.countDocuments({ userId: req.user._id, isRead: false }),
      ]);

      const totalClasses = attendanceRecords.length;
      const presentClasses = attendanceRecords.filter((a) => a.status === 'PRESENT').length;
      const attendancePercentage =
        totalClasses > 0 ? Math.round((presentClasses / totalClasses) * 100) : 100;

      return successResponse(res, 200, 'Student metrics fetched', {
        attendancePercentage,
        attendanceStatus:
          attendancePercentage >= ATTENDANCE_THRESHOLDS.SAFE
            ? 'Safe'
            : attendancePercentage >= ATTENDANCE_THRESHOLDS.WARNING
            ? 'Warning'
            : 'Critical',
        upcomingAssignmentsCount: pendingAssignments.length,
        recentGrades,
        pendingRequestsCount: pendingRequests,
        placementOpportunitiesCount: activeDrives,
        unreadNotificationsCount: unreadNotifications,
      });
    }

    if (role === ROLES.PLACEMENT_OFFICER) {
      const [
        companiesCount,
        activeDrivesCount,
        applicationsCount,
        shortlistedCount,
        selectedCount,
      ] = await Promise.all([
        Company.countDocuments({ institutionId, isActive: true }),
        JobDrive.countDocuments({ institutionId, status: 'PUBLISHED' }),
        PlacementApplication.countDocuments({ institutionId }),
        PlacementApplication.countDocuments({ institutionId, status: 'SHORTLISTED' }),
        PlacementOutcome.countDocuments({ institutionId, outcome: 'ACCEPTED' }),
      ]);

      return successResponse(res, 200, 'Placement Officer metrics fetched', {
        companiesCount,
        activeDrivesCount,
        applicationsCount,
        shortlistedCount,
        selectedCount,
      });
    }

    return successResponse(res, 200, 'Dashboard statistics fetched', {});
  } catch (err) {
    next(err);
  }
};
