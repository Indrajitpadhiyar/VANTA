import mongoose from 'mongoose';
import { envConfig } from './env.config.js';
import { logger } from '../utils/logger.js';

/**
 * Enterprise Resilient MongoDB Connection Handler
 */
export const connectDB = async () => {
  try {
    const connOptions = {
      dbName: envConfig.DB_NAME,
      serverSelectionTimeoutMS: 8000,
      socketTimeoutMS: 45000,
      maxPoolSize: 20,
      minPoolSize: 5,
    };

    mongoose.connection.on('connected', () => {
      logger.success(`MongoDB Connected successfully to DB: [${envConfig.DB_NAME}]`);
    });

    mongoose.connection.on('error', (err) => {
      logger.error('MongoDB connection error:', err.message);
    });

    mongoose.connection.on('disconnected', () => {
      logger.warn('MongoDB disconnected. Reconnection will be attempted automatically.');
    });

    const conn = await mongoose.connect(envConfig.MONGODB_URI, connOptions);
    logger.info(`MongoDB Host: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    logger.error('Initial MongoDB connection failure:', error.message);
    // In production we may retry or fail fast
    if (envConfig.isProduction) {
      process.exit(1);
    }
  }
};

export const disconnectDB = async () => {
  try {
    await mongoose.connection.close();
    logger.info('MongoDB connection closed gracefully.');
  } catch (error) {
    logger.error('Error during MongoDB disconnection:', error.message);
  }
};
