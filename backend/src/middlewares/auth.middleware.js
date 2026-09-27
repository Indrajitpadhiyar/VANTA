import { ApiError } from '../utils/apiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { verifyToken } from '../utils/token.util.js';
import { User } from '../models/User.model.js';

/**
 * Authentication Protection Middleware
 * Verifies Bearer JWT token from Authorization header and injects authenticated user into req.user
 */
export const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }

  if (!token) {
    throw ApiError.unauthorized('Authentication required. No token provided.');
  }

  try {
    const decoded = verifyToken(token);
    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      throw ApiError.unauthorized('User associated with this token no longer exists.');
    }

    if (!user.isActive) {
      throw ApiError.forbidden('Your account has been deactivated. Please contact support.');
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      throw ApiError.unauthorized('Invalid authorization token.');
    }
    if (error.name === 'TokenExpiredError') {
      throw ApiError.unauthorized('Authorization token has expired. Please sign in again.');
    }
    throw error;
  }
});

/**
 * Role-Based Access Control (RBAC) Middleware
 * @param  {...string} roles - Permitted roles (e.g. 'admin', 'customer', 'moderator')
 */
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(ApiError.unauthorized('Authentication required before authorization check.'));
    }

    if (!roles.includes(req.user.role)) {
      return next(
        ApiError.forbidden(
          `Access forbidden: User role '${req.user.role}' lacks permissions for this operation.`
        )
      );
    }

    next();
  };
};

/**
 * Optional Authentication Middleware
 * Injects req.user if a valid token is provided; otherwise proceeds as guest without throwing.
 */
export const optionalAuth = asyncHandler(async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (token) {
    try {
      const decoded = verifyToken(token);
      const user = await User.findById(decoded.id).select('-password');
      if (user && user.isActive) {
        req.user = user;
      }
    } catch {
      // Proceed unauthenticated for optional endpoints
      req.user = null;
    }
  }

  next();
});
