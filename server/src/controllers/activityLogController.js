import ActivityLog from '../models/ActivityLog.js';
import { ROLES } from '../config/constants.js';
import { successResponse } from '../utils/apiResponse.js';

export const getActivityLogs = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, action, entity, userId } = req.query;
    const query = {};

    if (req.user.role !== ROLES.SUPER_ADMIN) {
      query.institutionId = req.user.institutionId;
    } else if (req.query.institutionId) {
      query.institutionId = req.query.institutionId;
    }

    if (action) query.action = action;
    if (entity) query.entity = entity;
    if (userId) query.userId = userId;

    const skip = (Number(page) - 1) * Number(limit);
    const [logs, total] = await Promise.all([
      ActivityLog.find(query)
        .populate('userId', 'name email role')
        .skip(skip)
        .limit(Number(limit))
        .sort({ createdAt: -1 }),
      ActivityLog.countDocuments(query),
    ]);

    return successResponse(res, 200, 'Activity logs fetched', logs, {
      page: Number(page),
      limit: Number(limit),
      total,
      totalPages: Math.ceil(total / Number(limit)),
    });
  } catch (err) {
    next(err);
  }
};
