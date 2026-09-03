import Department from '../models/Department.js';
import User from '../models/User.js';
import Course from '../models/Course.js';
import Subject from '../models/Subject.js';
import { ROLES } from '../config/constants.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';
import { logActivity } from '../utils/auditLogger.js';

export const createDepartment = async (req, res, next) => {
  try {
    const institutionId = req.user.role === ROLES.SUPER_ADMIN ? req.body.institutionId : req.user.institutionId;
    const { name, code, description, headOfDepartment } = req.body;

    const existing = await Department.findOne({ institutionId, code: code.toUpperCase() });
    if (existing) {
      return errorResponse(res, 409, 'Department code already exists in this institution.');
    }

    const dept = await Department.create({
      name,
      code: code.toUpperCase(),
      description,
      headOfDepartment,
      institutionId,
    });

    await logActivity({
      userId: req.user._id,
      institutionId,
      action: 'DEPARTMENT_CREATED',
      entity: 'Department',
      entityId: dept._id.toString(),
      metadata: { name: dept.name, code: dept.code },
      req,
    });

    return successResponse(res, 201, 'Department created successfully', dept);
  } catch (err) {
    next(err);
  }
};

export const getDepartments = async (req, res, next) => {
  try {
    const institutionId = req.user.role === ROLES.SUPER_ADMIN ? (req.query.institutionId || req.user.institutionId) : req.user.institutionId;
    const query = {};
    if (institutionId) {
      query.institutionId = institutionId;
    }

    if (req.query.search) {
      query.$or = [
        { name: { $regex: req.query.search, $options: 'i' } },
        { code: { $regex: req.query.search, $options: 'i' } },
      ];
    }

    const departments = await Department.find(query)
      .populate('headOfDepartment', 'name email phone')
      .sort({ name: 1 });

    return successResponse(res, 200, 'Departments fetched successfully', departments);
  } catch (err) {
    next(err);
  }
};

export const getDepartmentById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const dept = await Department.findById(id).populate('headOfDepartment', 'name email phone');

    if (!dept) {
      return errorResponse(res, 404, 'Department not found');
    }

    if (
      req.user.role !== ROLES.SUPER_ADMIN &&
      dept.institutionId.toString() !== req.user.institutionId?.toString()
    ) {
      return errorResponse(res, 403, 'Forbidden');
    }

    // Include statistics
    const [studentCount, facultyCount, courseCount, subjectCount] = await Promise.all([
      User.countDocuments({ departmentId: id, role: ROLES.STUDENT, isActive: true }),
      User.countDocuments({ departmentId: id, role: ROLES.FACULTY, isActive: true }),
      Course.countDocuments({ departmentId: id, isActive: true }),
      Subject.countDocuments({ departmentId: id, isActive: true }),
    ]);

    return successResponse(res, 200, 'Department details fetched', {
      department: dept,
      stats: {
        studentCount,
        facultyCount,
        courseCount,
        subjectCount,
      },
    });
  } catch (err) {
    next(err);
  }
};

export const updateDepartment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const dept = await Department.findById(id);
    if (!dept) {
      return errorResponse(res, 404, 'Department not found');
    }

    if (
      req.user.role !== ROLES.SUPER_ADMIN &&
      dept.institutionId.toString() !== req.user.institutionId?.toString()
    ) {
      return errorResponse(res, 403, 'Forbidden');
    }

    const updated = await Department.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    await logActivity({
      userId: req.user._id,
      institutionId: dept.institutionId,
      action: 'DEPARTMENT_UPDATED',
      entity: 'Department',
      entityId: dept._id.toString(),
      req,
    });

    return successResponse(res, 200, 'Department updated successfully', updated);
  } catch (err) {
    next(err);
  }
};

export const deleteDepartment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const dept = await Department.findById(id);
    if (!dept) {
      return errorResponse(res, 404, 'Department not found');
    }

    if (
      req.user.role !== ROLES.SUPER_ADMIN &&
      dept.institutionId.toString() !== req.user.institutionId?.toString()
    ) {
      return errorResponse(res, 403, 'Forbidden');
    }

    dept.isActive = false;
    await dept.save();

    await logActivity({
      userId: req.user._id,
      institutionId: dept.institutionId,
      action: 'DEPARTMENT_DEACTIVATED',
      entity: 'Department',
      entityId: dept._id.toString(),
      req,
    });

    return successResponse(res, 200, 'Department deactivated successfully', dept);
  } catch (err) {
    next(err);
  }
};
