import { HttpStatusCodes } from '../constants/httpStatusCodes.js';

/**
 * Standardized API Response Structure
 * Guarantees consistent JSON contracts across all backend endpoints.
 */
export class ApiResponse {
  /**
   * @param {number} statusCode - HTTP status code
   * @param {*} data - Response payload
   * @param {string} message - Human-readable success message
   * @param {Object} [meta=null] - Optional pagination, query, or runtime metadata
   */
  constructor(statusCode = HttpStatusCodes.OK, data = null, message = 'Success', meta = null) {
    this.success = statusCode < 400;
    this.statusCode = statusCode;
    this.message = message;
    this.data = data;
    if (meta) {
      this.meta = meta;
    }
  }

  static success(data = null, message = 'Success', meta = null) {
    return new ApiResponse(HttpStatusCodes.OK, data, message, meta);
  }

  static created(data = null, message = 'Resource created successfully', meta = null) {
    return new ApiResponse(HttpStatusCodes.CREATED, data, message, meta);
  }

  static noContent() {
    return new ApiResponse(HttpStatusCodes.NO_CONTENT, null, 'No Content');
  }
}
