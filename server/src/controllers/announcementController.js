import Announcement from '../models/Announcement.js';
import User from '../models/User.js';
import { ROLES } from '../config/constants.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';
import { logActivity } from '../utils/auditLogger.js';
import { sendNotification } from '../utils/notify.js';

export const createAnnouncement = async (req, res, next) => {
  try {
    const institutionId = req.user.role === ROLES.SUPER_ADMIN ? req.body.institutionId : req.user.institutionId;
    const { title, content, targetRoles, departmentId, targetCourse, priority, expiryDate } = req.body;

    const announcement = await Announcement.create({
      title,
      content,
      author: req.user._id,
      institutionId,
      departmentId: departmentId || null,
      targetCourse: targetCourse || null,
      targetRoles: targetRoles || ['STUDENT', 'FACULTY'],
      priority: priority || 'MEDIUM',
      expiryDate: expiryDate ? new Date(expiryDate) : null,
    });

    await logActivity({
      userId: req.user._id,
      institutionId,
      action: 'ANNOUNCEMENT_CREATED',
      entity: 'Announcement',
      entityId: announcement._id.toString(),
      metadata: { title: announcement.title, priority: announcement.priority },
      req,
    });

    // Notify targeted users
    const query = { institutionId, isActive: true };
    if (targetRoles && targetRoles.length > 0) {
      query.role = { $in: targetRoles };
    }
    if (departmentId) {
      query.departmentId = departmentId;
    }

    const targetedUsers = await User.find(query).select('_id');
    for (const u of targetedUsers.slice(0, 100)) {
      // Broadcast up to 100 top users
      await sendNotification({
        userId: u._id,
        institutionId,
        title: `Announcement: ${announcement.title}`,
        message: announcement.content.slice(0, 150),
        type: 'ANNOUNCEMENT',
        relatedEntity: { entityType: 'Announcement', entityId: announcement._id.toString() },
      });
    }

    return successResponse(res, 201, 'Announcement created successfully', announcement);
  } catch (err) {
    next(err);
  }
};

export const getAnnouncements = async (req, res, next) => {
  try {
    const institutionId = req.user.role === ROLES.SUPER_ADMIN ? (req.query.institutionId || req.user.institutionId) : req.user.institutionId;
    const query = {};
    if (institutionId) query.institutionId = institutionId;

    if (req.user.role !== ROLES.SUPER_ADMIN && req.user.role !== ROLES.COLLEGE_ADMIN) {
      query.targetRoles = req.user.role;
    }

    if (req.query.departmentId) {
      query.$or = [{ departmentId: req.query.departmentId }, { departmentId: null }];
    }

    const announcements = await Announcement.find(query)
      .populate('author', 'name role')
      .populate('departmentId', 'name code')
      .sort({ publishDate: -1 });

    return successResponse(res, 200, 'Announcements fetched successfully', announcements);
  } catch (err) {
    next(err);
  }
};

export const deleteAnnouncement = async (req, res, next) => {
  try {
    const { id } = req.params;
    const announcement = await Announcement.findByIdAndDelete(id);
    if (!announcement) return errorResponse(res, 404, 'Announcement not found');
    return successResponse(res, 200, 'Announcement deleted', announcement);
  } catch (err) {
    next(err);
  }
};
