import mongoose from 'mongoose';
import dns from 'dns';
import { logger } from '../utils/logger.js';

try {
  dns.setServers(['8.8.8.8', '8.8.4.4']);
} catch (e) {}

let mongoMemoryServer = null;

export const connectDB = async () => {
  const uri = process.env.MONGODB_URI;

  try {
    if (uri && !uri.includes('memory')) {
      logger.info(`Attempting connection to MongoDB at: ${uri.replace(/\/\/.*@/, '//***@')}`);
      await mongoose.connect(uri, {
        serverSelectionTimeoutMS: 10000,
      });
      logger.info('Connected to MongoDB successfully.');
      return;
    }
  } catch (err) {
    logger.warn(`Failed to connect to configured MongoDB URI (${err.message}). Falling back to in-memory MongoDB...`);
  }

  // Fallback to MongoMemoryServer for standalone out-of-the-box run
  try {
    const { MongoMemoryServer } = await import('mongodb-memory-server');
    mongoMemoryServer = await MongoMemoryServer.create();
    const memoryUri = mongoMemoryServer.getUri();
    await mongoose.connect(memoryUri);
    logger.info(`Connected to in-memory MongoDB at: ${memoryUri}`);
  } catch (memoryErr) {
    logger.error('Failed to start in-memory MongoDB instance:', memoryErr.message);
    throw memoryErr;
  }
};

export const disconnectDB = async () => {
  await mongoose.disconnect();
  if (mongoMemoryServer) {
    await mongoMemoryServer.stop();
  }
};
