import dotenv from 'dotenv';
dotenv.config();

import http from 'http';
import app from './app.js';
import { connectDB } from './config/db.js';
import { logger } from './utils/logger.js';
import { initSocket } from './services/socketService.js';

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();
    const httpServer = http.createServer(app);
    initSocket(httpServer);

    httpServer.listen(PORT, () => {
      logger.info(`CampusFlow server running with WebSockets in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
    });
  } catch (err) {
    logger.error('Failed to start server:', err.message);
    process.exit(1);
  }
};

startServer();
