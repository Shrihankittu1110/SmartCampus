import Notification from '../models/Notification.js';
import { logger } from './logger.js';
import { emitToUser } from '../services/socketService.js';

export const sendNotification = async ({
  userId,
  institutionId,
  title,
  message,
  type = 'SYSTEM',
  relatedEntity = null,
}) => {
  try {
    const notif = await Notification.create({
      userId,
      institutionId,
      title,
      message,
      type,
      relatedEntity,
    });

    // Real-time WebSocket Push Notification
    emitToUser(userId, 'NOTIFICATION', {
      _id: notif._id,
      title,
      message,
      type,
      relatedEntity,
      isRead: false,
      createdAt: notif.createdAt,
    });
  } catch (err) {
    logger.error('Failed to dispatch notification:', err.message);
  }
};
