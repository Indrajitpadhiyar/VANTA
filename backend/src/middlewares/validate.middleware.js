import { ApiError } from '../utils/apiError.js';

/**
 * Higher-order schema validation middleware
 * Validates request payload properties against declarative validation rules.
 * 
 * @param {Function} validatorFn - Function receiving req returning array of error messages
 */
export const validate = (validatorFn) => {
  return (req, res, next) => {
    const errors = validatorFn(req);
    if (errors && errors.length > 0) {
      return next(ApiError.unprocessableEntity('Validation failed', errors));
    }
    next();
  };
};

/**
 * Common regex patterns & validator helpers
 */
export const ValidationRules = {
  isEmail: (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return typeof email === 'string' && emailRegex.test(email.trim());
  },
  isMongoId: (id) => {
    return typeof id === 'string' && /^[0-9a-fA-F]{24}$/.test(id);
  },
  isStrongPassword: (pwd) => {
    return typeof pwd === 'string' && pwd.length >= 6;
  },
};
