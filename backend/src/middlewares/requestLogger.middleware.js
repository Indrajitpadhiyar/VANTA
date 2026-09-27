import { logger } from '../utils/logger.js';

/**
 * High-Visibility Request Logger Middleware
 * Tracks HTTP method, route path, status code, and latency in milliseconds.
 */
export const requestLogger = (req, res, next) => {
  const startHrTime = process.hrtime();

  res.on('finish', () => {
    const elapsedHrTime = process.hrtime(startHrTime);
    const elapsedTimeInMs = Math.round((elapsedHrTime[0] * 1000 + elapsedHrTime[1] / 1e6) * 100) / 100;
    
    // Avoid spamming health check logs
    if (req.originalUrl !== '/api/v1/health') {
      logger.http(req.method, req.originalUrl, res.statusCode, elapsedTimeInMs);
    }
  });

  next();
};
