/**
 * Standard Application Response Messages
 * @readonly
 */
export const ResponseMessages = Object.freeze({
  SUCCESS: 'Operation completed successfully.',
  CREATED: 'Resource created successfully.',
  UPDATED: 'Resource updated successfully.',
  DELETED: 'Resource deleted successfully.',
  NOT_FOUND: 'Requested resource was not found.',
  UNAUTHORIZED: 'Authentication required or invalid credentials.',
  FORBIDDEN: 'Access denied: You do not have permissions for this resource.',
  VALIDATION_ERROR: 'Validation failed for the submitted data.',
  CONFLICT: 'Resource conflict or duplicate entry detected.',
  INTERNAL_ERROR: 'An unexpected internal error occurred. Please try again later.',
  RATE_LIMIT_EXCEEDED: 'Too many requests, please slow down and try again later.',
  INVALID_ID: 'The provided resource ID is malformed or invalid.',
});
