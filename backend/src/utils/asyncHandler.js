/**
 * Async Handler Wrapper
 * Eliminates boilerplate try/catch blocks across Express route controllers
 * and automatically forwards errors to the centralized error middleware.
 *
 * @param {Function} requestHandler - Async route handler (req, res, next)
 * @returns {Function} Express middleware handler
 */
export const asyncHandler = (requestHandler) => {
  return (req, res, next) => {
    Promise.resolve(requestHandler(req, res, next)).catch((err) => next(err));
  };
};
