import Enrollment from '../models/Enrollment.js';
import { ROLES } from '../config/constants.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';

export const enrollStudent = async (req, res, next) => {
  try {
    const institutionId = req.user.role === ROLES.SUPER_ADMIN ? req.body.institutionId : req.user.institutionId;
    const { studentId, courseId, academicYear, semester } = req.body;

    const existing = await Enrollment.findOne({ studentId, courseId, semester, academicYear });
    if (existing) {
      return errorResponse(res, 409, 'Student is already enrolled in this course for this semester.');
    }

    const enrollment = await Enrollment.create({
      studentId,
      courseId,
      institutionId,
      academicYear,
      semester,
    });

    return successResponse(res, 201, 'Student enrolled successfully', enrollment);
  } catch (err) {
    next(err);
  }
};

export const getEnrollments = async (req, res, next) => {
  try {
    const institutionId = req.user.role === ROLES.SUPER_ADMIN ? (req.query.institutionId || req.user.institutionId) : req.user.institutionId;
    const query = {};
    if (institutionId) query.institutionId = institutionId;
    if (req.query.courseId) query.courseId = req.query.courseId;
    if (req.query.semester) query.semester = Number(req.query.semester);
    if (req.query.studentId) query.studentId = req.query.studentId;

    const enrollments = await Enrollment.find(query)
      .populate('studentId', 'name rollNumber email cgpa')
      .populate('courseId', 'name code');

    return successResponse(res, 200, 'Enrollments fetched successfully', enrollments);
  } catch (err) {
    next(err);
  }
};

export const getMyEnrollments = async (req, res, next) => {
  try {
    const enrollments = await Enrollment.find({ studentId: req.user._id })
      .populate('courseId', 'name code departmentId totalSemesters')
      .sort({ semester: -1 });

    return successResponse(res, 200, 'My enrollments fetched', enrollments);
  } catch (err) {
    next(err);
  }
};
