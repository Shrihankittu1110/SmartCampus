import Course from '../models/Course.js';
import { ROLES } from '../config/constants.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';
import { logActivity } from '../utils/auditLogger.js';

export const createCourse = async (req, res, next) => {
  try {
    const institutionId = req.user.role === ROLES.SUPER_ADMIN ? req.body.institutionId : req.user.institutionId;
    const { name, code, departmentId, duration, totalSemesters, academicYear, description } = req.body;

    const existing = await Course.findOne({ institutionId, code: code.toUpperCase() });
    if (existing) {
      return errorResponse(res, 409, 'Course with this code already exists in this institution.');
    }

    const course = await Course.create({
      name,
      code: code.toUpperCase(),
      departmentId,
      institutionId,
      duration,
      totalSemesters,
      academicYear,
      description,
    });

    await logActivity({
      userId: req.user._id,
      institutionId,
      action: 'COURSE_CREATED',
      entity: 'Course',
      entityId: course._id.toString(),
      metadata: { code: course.code },
      req,
    });

    return successResponse(res, 201, 'Course created successfully', course);
  } catch (err) {
    next(err);
  }
};

export const getCourses = async (req, res, next) => {
  try {
    const institutionId = req.user.role === ROLES.SUPER_ADMIN ? (req.query.institutionId || req.user.institutionId) : req.user.institutionId;
    const query = { isActive: true };
    if (institutionId) query.institutionId = institutionId;
    if (req.query.departmentId) query.departmentId = req.query.departmentId;

    if (req.query.search) {
      query.$or = [
        { name: { $regex: req.query.search, $options: 'i' } },
        { code: { $regex: req.query.search, $options: 'i' } },
      ];
    }

    const courses = await Course.find(query)
      .populate('departmentId', 'name code')
      .sort({ name: 1 });

    return successResponse(res, 200, 'Courses fetched successfully', courses);
  } catch (err) {
    next(err);
  }
};

export const getCourseById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const course = await Course.findById(id).populate('departmentId', 'name code');

    if (!course) {
      return errorResponse(res, 404, 'Course not found');
    }

    if (
      req.user.role !== ROLES.SUPER_ADMIN &&
      course.institutionId.toString() !== req.user.institutionId?.toString()
    ) {
      return errorResponse(res, 403, 'Forbidden');
    }

    return successResponse(res, 200, 'Course details fetched', course);
  } catch (err) {
    next(err);
  }
};

export const updateCourse = async (req, res, next) => {
  try {
    const { id } = req.params;
    const course = await Course.findById(id);
    if (!course) {
      return errorResponse(res, 404, 'Course not found');
    }

    if (
      req.user.role !== ROLES.SUPER_ADMIN &&
      course.institutionId.toString() !== req.user.institutionId?.toString()
    ) {
      return errorResponse(res, 403, 'Forbidden');
    }

    const updated = await Course.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    }).populate('departmentId', 'name code');

    await logActivity({
      userId: req.user._id,
      institutionId: course.institutionId,
      action: 'COURSE_UPDATED',
      entity: 'Course',
      entityId: course._id.toString(),
      req,
    });

    return successResponse(res, 200, 'Course updated successfully', updated);
  } catch (err) {
    next(err);
  }
};

export const deleteCourse = async (req, res, next) => {
  try {
    const { id } = req.params;
    const course = await Course.findById(id);
    if (!course) {
      return errorResponse(res, 404, 'Course not found');
    }

    if (
      req.user.role !== ROLES.SUPER_ADMIN &&
      course.institutionId.toString() !== req.user.institutionId?.toString()
    ) {
      return errorResponse(res, 403, 'Forbidden');
    }

    course.isActive = false;
    await course.save();

    await logActivity({
      userId: req.user._id,
      institutionId: course.institutionId,
      action: 'COURSE_DEACTIVATED',
      entity: 'Course',
      entityId: course._id.toString(),
      req,
    });

    return successResponse(res, 200, 'Course deactivated successfully', course);
  } catch (err) {
    next(err);
  }
};
