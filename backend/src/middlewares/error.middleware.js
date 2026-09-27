import { ApiError } from '../utils/apiError.js';
import { HttpStatusCodes } from '../constants/httpStatusCodes.js';
import { logger } from '../utils/logger.js';
import { envConfig } from '../config/env.config.js';

/**
 * Enterprise Centralized Error Handling Middleware
 * Intercepts all operational and uncaught exceptions and produces a standardized error response.
 */
export const errorHandler = (err, req, res, _next) => {
  let error = err;

  // If error is not an instance of ApiError, transform standard error or Mongoose error into ApiError
  if (!(error instanceof ApiError)) {
    let statusCode = error.statusCode || HttpStatusCodes.INTERNAL_SERVER_ERROR;
    let message = error.message || 'An unexpected error occurred.';
    let errors = [];

    // Mongoose bad ObjectId (CastError)
    if (error.name === 'CastError') {
      message = `Invalid ${error.path}: ${error.value}`;
      statusCode = HttpStatusCodes.BAD_REQUEST;
      error = new ApiError(statusCode, message);
    }
    // Mongoose Duplicate Key Error (E11000)
    else if (error.code === 11000) {
      const field = Object.keys(error.keyValue || {})[0] || 'field';
      message = `Duplicate value for field '${field}'. Please provide an alternative value.`;
      statusCode = HttpStatusCodes.CONFLICT;
      error = new ApiError(statusCode, message);
    }
    // Mongoose Schema Validation Error
    else if (error.name === 'ValidationError') {
      errors = Object.values(error.errors || {}).map((val) => ({
        field: val.path,
        message: val.message,
      }));
      message = 'Validation failed for one or more fields.';
      statusCode = HttpStatusCodes.UNPROCESSABLE_ENTITY;
      error = new ApiError(statusCode, message, errors);
    }
    // JSON parsing syntax error in body
    else if (error instanceof SyntaxError && error.status === 400 && 'body' in error) {
      message = 'Malformed JSON payload provided in request body.';
      statusCode = HttpStatusCodes.BAD_REQUEST;
      error = new ApiError(statusCode, message);
    }
    // Unhandled / Generic Errors
    else {
      error = new ApiError(statusCode, message, errors, err.stack);
    }
  }

  // Log server errors for observability
  if (error.statusCode >= 500) {
    logger.error(`[CRITICAL] 500 Server Error on ${req.method} ${req.originalUrl}:`, error.stack);
  } else {
    logger.warn(`[CLIENT ERROR] ${error.statusCode} on ${req.method} ${req.originalUrl}: ${error.message}`);
  }

  const response = {
    success: false,
    statusCode: error.statusCode,
    message: error.message,
    errors: error.errors?.length ? error.errors : undefined,
    ...(envConfig.isDevelopment && { stack: error.stack }),
  };

  res.status(error.statusCode).json(response);
};
