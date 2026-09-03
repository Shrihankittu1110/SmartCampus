import Institution from '../models/Institution.js';
import { ROLES } from '../config/constants.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';
import { logActivity } from '../utils/auditLogger.js';

export const createInstitution = async (req, res, next) => {
  try {
    const institution = await Institution.create(req.body);

    await logActivity({
      userId: req.user._id,
      institutionId: institution._id,
      action: 'INSTITUTION_CREATED',
      entity: 'Institution',
      entityId: institution._id.toString(),
      metadata: { name: institution.name, code: institution.code },
      req,
    });

    return successResponse(res, 201, 'Institution created successfully', institution);
  } catch (err) {
    next(err);
  }
};

export const getInstitutions = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, search = '', isActive } = req.query;
    const query = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { code: { $regex: search, $options: 'i' } },
      ];
    }

    if (isActive !== undefined) {
      query.isActive = isActive === 'true';
    }

    const skip = (Number(page) - 1) * Number(limit);
    const [institutions, total] = await Promise.all([
      Institution.find(query).skip(skip).limit(Number(limit)).sort({ createdAt: -1 }),
      Institution.countDocuments(query),
    ]);

    return successResponse(res, 200, 'Institutions fetched successfully', institutions, {
      page: Number(page),
      limit: Number(limit),
      total,
      totalPages: Math.ceil(total / Number(limit)),
    });
  } catch (err) {
    next(err);
  }
};

export const getInstitutionById = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Tenant check for non-superadmin
    if (req.user.role !== ROLES.SUPER_ADMIN && req.user.institutionId?.toString() !== id) {
      return errorResponse(res, 403, 'Forbidden: You cannot access another institution.');
    }

    const institution = await Institution.findById(id);
    if (!institution) {
      return errorResponse(res, 404, 'Institution not found');
    }

    return successResponse(res, 200, 'Institution details fetched', institution);
  } catch (err) {
    next(err);
  }
};

export const updateInstitution = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (req.user.role !== ROLES.SUPER_ADMIN && req.user.institutionId?.toString() !== id) {
      return errorResponse(res, 403, 'Forbidden: You cannot modify another institution.');
    }

    const updated = await Institution.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updated) {
      return errorResponse(res, 404, 'Institution not found');
    }

    await logActivity({
      userId: req.user._id,
      institutionId: updated._id,
      action: 'INSTITUTION_UPDATED',
      entity: 'Institution',
      entityId: updated._id.toString(),
      req,
    });

    return successResponse(res, 200, 'Institution updated successfully', updated);
  } catch (err) {
    next(err);
  }
};

export const deleteInstitution = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updated = await Institution.findByIdAndUpdate(id, { isActive: false }, { new: true });
    if (!updated) {
      return errorResponse(res, 404, 'Institution not found');
    }

    await logActivity({
      userId: req.user._id,
      institutionId: updated._id,
      action: 'INSTITUTION_DEACTIVATED',
      entity: 'Institution',
      entityId: updated._id.toString(),
      req,
    });

    return successResponse(res, 200, 'Institution deactivated successfully', updated);
  } catch (err) {
    next(err);
  }
};
