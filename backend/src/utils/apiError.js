import { HttpStatusCodes } from '../constants/httpStatusCodes.js';

/**
 * Operational Custom API Error Class
 * Distinguishes trusted operational errors from unhandled programmer bugs.
 */
export class ApiError extends Error {
  /**
   * @param {number} statusCode - HTTP status code
   * @param {string} message - Error description
   * @param {Array|Object} [errors=[]] - Detailed validation or field-level errors
   * @param {string} [stack=''] - Optional stack trace override
   */
  constructor(
    statusCode = HttpStatusCodes.INTERNAL_SERVER_ERROR,
    message = 'Something went wrong',
    errors = [],
    stack = ''
  ) {
    super(message);
    this.statusCode = statusCode;
    this.data = null;
    this.success = false;
    this.errors = Array.isArray(errors) ? errors : [errors];
    this.isOperational = true;

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }

  // Factory methods for clean controller ergonomics
  static badRequest(message = 'Bad Request', errors = []) {
    return new ApiError(HttpStatusCodes.BAD_REQUEST, message, errors);
  }

  static unauthorized(message = 'Unauthorized access', errors = []) {
    return new ApiError(HttpStatusCodes.UNAUTHORIZED, message, errors);
  }

  static forbidden(message = 'Forbidden access', errors = []) {
    return new ApiError(HttpStatusCodes.FORBIDDEN, message, errors);
  }

  static notFound(message = 'Resource not found', errors = []) {
    return new ApiError(HttpStatusCodes.NOT_FOUND, message, errors);
  }

  static conflict(message = 'Resource already exists', errors = []) {
    return new ApiError(HttpStatusCodes.CONFLICT, message, errors);
  }

  static unprocessableEntity(message = 'Unprocessable Entity', errors = []) {
    return new ApiError(HttpStatusCodes.UNPROCESSABLE_ENTITY, message, errors);
  }

  static tooManyRequests(message = 'Too many requests', errors = []) {
    return new ApiError(HttpStatusCodes.TOO_MANY_REQUESTS, message, errors);
  }

  static internal(message = 'Internal server error', errors = []) {
    return new ApiError(HttpStatusCodes.INTERNAL_SERVER_ERROR, message, errors);
  }
}
