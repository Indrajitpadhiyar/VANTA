import { ApiError } from '../utils/apiError.js';

/**
 * Sliding Window In-Memory Rate Limiter
 * @param {Object} options
 * @param {number} [options.windowMs=900000] - Window duration in ms (default: 15 min)
 * @param {number} [options.max=100] - Max requests permitted in window
 * @param {string} [options.message] - Custom error message
 */
export const rateLimiter = ({
  windowMs = 15 * 60 * 1000,
  max = 100,
  message = 'Too many requests from this IP. Please try again after 15 minutes.',
} = {}) => {
  const ipHits = new Map();

  // Periodic garbage cleanup of expired buckets every 5 minutes
  setInterval(() => {
    const now = Date.now();
    for (const [ip, record] of ipHits.entries()) {
      if (now - record.startTime > windowMs) {
        ipHits.delete(ip);
      }
    }
  }, 5 * 60 * 1000).unref();

  return (req, res, next) => {
    const clientIp =
      req.headers['x-forwarded-for']?.split(',')[0].trim() ||
      req.socket.remoteAddress ||
      'unknown-ip';

    const currentTime = Date.now();
    const record = ipHits.get(clientIp);

    if (!record) {
      ipHits.set(clientIp, { count: 1, startTime: currentTime });
      res.setHeader('X-RateLimit-Limit', max);
      res.setHeader('X-RateLimit-Remaining', max - 1);
      return next();
    }

    // If window expired, reset bucket
    if (currentTime - record.startTime > windowMs) {
      record.count = 1;
      record.startTime = currentTime;
      res.setHeader('X-RateLimit-Limit', max);
      res.setHeader('X-RateLimit-Remaining', max - 1);
      return next();
    }

    record.count += 1;
    res.setHeader('X-RateLimit-Limit', max);
    res.setHeader('X-RateLimit-Remaining', Math.max(0, max - record.count));

    if (record.count > max) {
      return next(ApiError.tooManyRequests(message));
    }

    next();
  };
};
