import app from './app.js';
import { envConfig } from './config/env.config.js';
import { connectDB, disconnectDB } from './config/db.config.js';
import { logger } from './utils/logger.js';

// Catch uncaught synchronous exceptions before process startup
process.on('uncaughtException', (err) => {
  logger.error('CRITICAL: UNCAUGHT EXCEPTION! Shutting down server immediately...', err.stack);
  process.exit(1);
});

let server;

const startServer = async () => {
  try {
    // 1. Establish resilient connection to MongoDB Atlas
    await connectDB();

    // 2. Start HTTP listener
    const PORT = envConfig.PORT || 4000;
    server = app.listen(PORT, () => {
      logger.success(`=======================================================`);
      logger.success(`🚀 VANTA Backend Server running on port ${PORT}`);
      logger.info(`🌐 Environment: [${envConfig.NODE_ENV}]`);
      logger.info(`🔗 Base URL:    http://localhost:${PORT}/api/v1`);
      logger.info(`🩺 Health:      http://localhost:${PORT}/api/v1/health`);
      logger.success(`=======================================================`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error.message);
    process.exit(1);
  }
};

// Graceful Shutdown Coordinator
const gracefulShutdown = async (signal) => {
  logger.warn(`Received ${signal}. Initiating graceful termination sequence...`);

  if (server) {
    server.close(async () => {
      logger.info('HTTP server closed. Releasing active database connections...');
      await disconnectDB();
      logger.success('Graceful shutdown completed successfully. Process exiting.');
      process.exit(0);
    });

    // Enforce shutdown timeout in case connections remain hung
    setTimeout(() => {
      logger.error('Forced shutdown invoked: Active connections timed out.');
      process.exit(1);
    }, 10000);
  } else {
    process.exit(0);
  }
};

// Listen for termination signals
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Catch unhandled asynchronous promise rejections
process.on('unhandledRejection', (err) => {
  logger.error('CRITICAL: UNHANDLED PROMISE REJECTION! Commencing graceful exit...', err);
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
});

// Launch server
startServer();
