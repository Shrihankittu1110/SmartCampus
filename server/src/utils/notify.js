import Notification from '../models/Notification.js';
import { logger } from './logger.js';

export const sendNotification = async ({
  userId,
  institutionId,
  title,
  message,
  type = 'SYSTEM',
  relatedEntity = null,
}) => {
  try {
    await Notification.create({
      userId,
      institutionId,
      title,
      message,
      type,
      relatedEntity,
    });
  } catch (err) {
    logger.error('Failed to dispatch notification:', err.message);
  }
};
