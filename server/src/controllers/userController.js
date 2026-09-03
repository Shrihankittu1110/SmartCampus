import User from '../models/User.js';
import { ROLES } from '../config/constants.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';
import { logActivity } from '../utils/auditLogger.js';
import { generateStudentsCSV } from '../services/exportService.js';

export const createUser = async (req, res, next) => {
  try {
    const { name, email, password, role, departmentId, rollNumber, employeeId, cgpa, backlogs, currentSemester, phone } = req.body;

    // Prevent privilege escalation
    if (req.user.role === ROLES.COLLEGE_ADMIN) {
      if (role === ROLES.SUPER_ADMIN || role === ROLES.COLLEGE_ADMIN) {
        return errorResponse(res, 403, 'College admins cannot create admin accounts.');
      }
    }

    const targetInstitutionId = req.user.role === ROLES.SUPER_ADMIN ? req.body.institutionId : req.user.institutionId;

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return errorResponse(res, 409, 'User with this email already exists.');
    }

    const newUser = await User.create({
      name,
      email: email.toLowerCase(),
      password: password || 'CampusFlow@123',
      role,
      institutionId: targetInstitutionId,
      departmentId,
      rollNumber,
      employeeId,
      cgpa: Number(cgpa) || 0,
      backlogs: Number(backlogs) || 0,
      currentSemester: Number(currentSemester) || 1,
      phone,
      isEmailVerified: true, // Admin-created users are verified
    });

    await logActivity({
      userId: req.user._id,
      institutionId: targetInstitutionId,
      action: 'USER_CREATED_BY_ADMIN',
      entity: 'User',
      entityId: newUser._id.toString(),
      metadata: { role: newUser.role, email: newUser.email },
      req,
    });

    return successResponse(res, 201, 'User created successfully', newUser);
  } catch (err) {
    next(err);
  }
};

export const getUsers = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 10,
      search = '',
      role,
      departmentId,
      isActive,
      institutionId,
    } = req.query;

    const query = {};

    // Multi-tenant filter
    if (req.user.role !== ROLES.SUPER_ADMIN) {
      query.institutionId = req.user.institutionId;
    } else if (institutionId) {
      query.institutionId = institutionId;
    }

    if (role) {
      query.role = role;
    }

    if (departmentId) {
      query.departmentId = departmentId;
    }

    if (isActive !== undefined) {
      query.isActive = isActive === 'true';
    }

    if (req.query.currentSemester) {
      query.currentSemester = Number(req.query.currentSemester);
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { rollNumber: { $regex: search, $options: 'i' } },
        { employeeId: { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);
    const [users, total] = await Promise.all([
      User.find(query)
        .populate('institutionId', 'name code')
        .populate('departmentId', 'name code')
        .skip(skip)
        .limit(Number(limit))
        .sort({ createdAt: -1 }),
      User.countDocuments(query),
    ]);

    return successResponse(res, 200, 'Users fetched successfully', users, {
      page: Number(page),
      limit: Number(limit),
      total,
      totalPages: Math.ceil(total / Number(limit)),
    });
  } catch (err) {
    next(err);
  }
};

export const getUserById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id)
      .populate('institutionId', 'name code')
      .populate('departmentId', 'name code');

    if (!user) {
      return errorResponse(res, 404, 'User not found');
    }

    // Tenant check
    if (
      req.user.role !== ROLES.SUPER_ADMIN &&
      user.institutionId?._id?.toString() !== req.user.institutionId?.toString()
    ) {
      return errorResponse(res, 403, 'Forbidden: You cannot view users of another institution.');
    }

    return successResponse(res, 200, 'User details fetched', user);
  } catch (err) {
    next(err);
  }
};

export const updateUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const target = await User.findById(id);
    if (!target) {
      return errorResponse(res, 404, 'User not found');
    }

    if (
      req.user.role !== ROLES.SUPER_ADMIN &&
      target.institutionId?.toString() !== req.user.institutionId?.toString()
    ) {
      return errorResponse(res, 403, 'Forbidden: You cannot edit users of another institution.');
    }

    // Privilege escalation prevention
    if (req.user.role === ROLES.COLLEGE_ADMIN) {
      if (req.body.role === ROLES.SUPER_ADMIN || req.body.role === ROLES.COLLEGE_ADMIN) {
        delete req.body.role;
      }
    }

    // Do not update password directly through this endpoint
    delete req.body.password;

    const updated = await User.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    })
      .populate('institutionId', 'name code')
      .populate('departmentId', 'name code');

    await logActivity({
      userId: req.user._id,
      institutionId: target.institutionId,
      action: 'USER_UPDATED',
      entity: 'User',
      entityId: target._id.toString(),
      req,
    });

    return successResponse(res, 200, 'User updated successfully', updated);
  } catch (err) {
    next(err);
  }
};

export const toggleUserStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) {
      return errorResponse(res, 404, 'User not found');
    }

    if (
      req.user.role !== ROLES.SUPER_ADMIN &&
      user.institutionId?.toString() !== req.user.institutionId?.toString()
    ) {
      return errorResponse(res, 403, 'Forbidden');
    }

    user.isActive = !user.isActive;
    await user.save({ validateBeforeSave: false });

    await logActivity({
      userId: req.user._id,
      institutionId: user.institutionId,
      action: user.isActive ? 'USER_ACTIVATED' : 'USER_DEACTIVATED',
      entity: 'User',
      entityId: user._id.toString(),
      req,
    });

    return successResponse(
      res,
      200,
      `User ${user.isActive ? 'activated' : 'deactivated'} successfully`,
      user
    );
  } catch (err) {
    next(err);
  }
};

export const exportUsers = async (req, res, next) => {
  try {
    const query = { role: ROLES.STUDENT };
    if (req.user.role !== ROLES.SUPER_ADMIN) {
      query.institutionId = req.user.institutionId;
    }
    if (req.query.departmentId) {
      query.departmentId = req.query.departmentId;
    }

    const students = await User.find(query)
      .populate('departmentId', 'name')
      .sort({ name: 1 });

    const csvData = generateStudentsCSV(students);
    res.header('Content-Type', 'text/csv');
    res.attachment(`students-${Date.now()}.csv`);
    return res.send(csvData);
  } catch (err) {
    next(err);
  }
};
