import ActivityLog from '../models/ActivityLog.js';
import { logger } from './logger.js';

export const logActivity = async ({
  userId,
  institutionId,
  action,
  entity,
  entityId,
  metadata = {},
  req = null,
}) => {
  try {
    const ipAddress = req?.headers['x-forwarded-for'] || req?.socket?.remoteAddress || '127.0.0.1';
    const userAgent = req?.headers['user-agent'] || 'Unknown';

    await ActivityLog.create({
      userId,
      institutionId,
      action,
      entity,
      entityId,
      metadata,
      ipAddress,
      userAgent,
    });
  } catch (err) {
    logger.error('Failed to record activity log:', err.message);
  }
};
