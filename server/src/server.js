import dotenv from 'dotenv';
dotenv.config();

import http from 'http';
import app from './app.js';
import { connectDB } from './config/db.js';
import { logger } from './utils/logger.js';
import { initSocket } from './services/socketService.js';
import User from './models/User.js';
import { seedDatabase } from './seed/seed.js';

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();

    // Ensure demo accounts are always present (e.g. fresh DB or MongoMemoryServer fallback)
    try {
      const userCount = await User.countDocuments();
      if (userCount === 0) {
        logger.info('No users detected in database. Automatically seeding demo data...');
        await seedDatabase();
        logger.info('Database auto-seeded successfully with demo accounts.');
      }
    } catch (seedErr) {
      logger.warn(`Auto-seed check failed or skipped: ${seedErr.message}`);
    }

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
