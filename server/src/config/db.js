import mongoose from 'mongoose';
import dns from 'dns';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { logger } from '../utils/logger.js';

try {
  dns.setServers(['8.8.8.8', '8.8.4.4']);
} catch (e) {}

let mongoMemoryServer = null;

export const connectDB = async () => {
  if (mongoose.connection.readyState === 1) {
    return;
  }

  const uri = process.env.MONGODB_URI;
  const isTest = process.env.NODE_ENV === 'test';

  try {
    if (uri && !uri.includes('memory')) {
      logger.info(`Attempting connection to MongoDB at: ${uri.replace(/\/\/.*@/, '//***@')}`);
      await mongoose.connect(uri, {
        serverSelectionTimeoutMS: isTest ? 3500 : 10000,
      });
      logger.info('Connected to MongoDB successfully.');
      return;
    }
  } catch (err) {
    logger.warn(`Failed to connect to configured MongoDB URI (${err.message}). Falling back to in-memory MongoDB...`);
  }

  // Fallback to MongoMemoryServer for standalone/offline runs and tests
  try {
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
