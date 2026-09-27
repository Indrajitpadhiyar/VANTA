import jwt from 'jsonwebtoken';
import { envConfig } from '../config/env.config.js';

/**
 * JWT Utility Functions for Authentication & Authorization
 */

/**
 * Generate Access Token
 * @param {Object} payload - User identification payload
 * @param {string} [expiresIn] - Expiration window override
 * @returns {string} Signed JWT string
 */
export const generateToken = (payload, expiresIn = envConfig.JWT_EXPIRES_IN) => {
  return jwt.sign(payload, envConfig.JWT_SECRET, {
    expiresIn,
  });
};

/**
 * Verify JWT Token
 * @param {string} token - Raw JWT token
 * @returns {Object} Decoded payload
 */
export const verifyToken = (token) => {
  return jwt.verify(token, envConfig.JWT_SECRET);
};
