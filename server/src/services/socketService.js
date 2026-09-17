import { Server } from 'socket.io';
import { verifyAccessToken } from '../utils/tokenUtils.js';
import { logger } from '../utils/logger.js';

let io = null;

export const initSocket = (httpServer) => {
  const allowedOrigins = process.env.CLIENT_URL
    ? process.env.CLIENT_URL.split(',').map((u) => u.trim().replace(/\/$/, ''))
    : ['http://localhost:5173', 'https://smart-campus-azure.vercel.app'];

  io = new Server(httpServer, {
    cors: {
      origin: (origin, callback) => {
        if (!origin) return callback(null, true);
        const cleanOrigin = origin.replace(/\/$/, '');
        if (
          allowedOrigins.includes('*') ||
          allowedOrigins.includes(cleanOrigin) ||
          cleanOrigin.endsWith('.vercel.app') ||
          cleanOrigin.includes('localhost') ||
          cleanOrigin.includes('127.0.0.1')
        ) {
          return callback(null, true);
        }
        return callback(null, origin);
      },
      methods: ['GET', 'POST'],
      credentials: true,
    },
    pingTimeout: 60000,
  });

  // Socket Authentication Middleware
  io.use((socket, next) => {
    try {
      const token =
        socket.handshake.auth?.token ||
        socket.handshake.headers?.authorization?.replace('Bearer ', '') ||
        socket.handshake.query?.token;

      if (!token) {
        return next(new Error('Authentication token required'));
      }

      const decoded = verifyAccessToken(token);
      socket.user = decoded;
      next();
    } catch (err) {
      logger.warn(`Socket authentication failed: ${err.message}`);
      next(new Error('Invalid or expired socket token'));
    }
  });

  io.on('connection', (socket) => {
    const user = socket.user;
    logger.info(`WebSocket connected: ${user.name} (${user.role}, ID: ${user.id})`);

    // Join personal user room
    socket.join(`user_${user.id}`);

    // Join institution-scoped room
    if (user.institutionId) {
      const instId = typeof user.institutionId === 'object' ? user.institutionId._id : user.institutionId;
      socket.join(`institution_${instId}`);
    }

    // Join role room
    if (user.role) {
      socket.join(`role_${user.role}`);
    }

    socket.emit('CONNECTED', {
      message: 'Connected to CampusFlow Real-Time Stream',
      user: { id: user.id, role: user.role },
      timestamp: new Date().toISOString(),
    });

    socket.on('disconnect', (reason) => {
      logger.info(`WebSocket disconnected: ${user.name} (${reason})`);
    });
  });

  return io;
};

export const getIO = () => {
  return io;
};

/**
 * Emit event to a specific user
 */
export const emitToUser = (userId, event, data) => {
  if (!io) return;
  const uid = userId?._id ? userId._id.toString() : userId.toString();
  io.to(`user_${uid}`).emit(event, {
    ...data,
    timestamp: new Date().toISOString(),
  });
};

/**
 * Emit event to all users in an institution
 */
export const emitToInstitution = (institutionId, event, data) => {
  if (!io) return;
  const instId = institutionId?._id ? institutionId._id.toString() : institutionId.toString();
  io.to(`institution_${instId}`).emit(event, {
    ...data,
    timestamp: new Date().toISOString(),
  });
};

/**
 * Emit event to all users of a specific role
 */
export const emitToRole = (role, event, data) => {
  if (!io) return;
  io.to(`role_${role}`).emit(event, {
    ...data,
    timestamp: new Date().toISOString(),
  });
};

/**
 * Broadcast event globally
 */
export const emitBroadcast = (event, data) => {
  if (!io) return;
  io.emit(event, {
    ...data,
    timestamp: new Date().toISOString(),
  });
};
