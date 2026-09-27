import { ApiError } from '../utils/apiError.js';

/**
 * 404 Route Not Found Middleware
 * Intercepts unmapped API requests and passes an ApiError.notFound to the error handler.
 */
export const notFound = (req, res, next) => {
  const error = ApiError.notFound(`Cannot find endpoint: [${req.method}] ${req.originalUrl}`);
  next(error);
};
