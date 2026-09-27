import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { AuthService } from '../services/auth.service.js';
import { HttpStatusCodes } from '../constants/httpStatusCodes.js';
import { ApiError } from '../utils/apiError.js';
import { ValidationRules } from '../middlewares/validate.middleware.js';

export const AuthController = {
  /**
   * Register new user account
   */
  register: asyncHandler(async (req, res) => {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      throw ApiError.badRequest('Name, email, and password are required.');
    }

    if (!ValidationRules.isEmail(email)) {
      throw ApiError.badRequest('Please provide a valid email address.');
    }

    if (!ValidationRules.isStrongPassword(password)) {
      throw ApiError.badRequest('Password must be at least 6 characters long.');
    }

    const result = await AuthService.registerUser({ name, email, password, role });
    res.status(HttpStatusCodes.CREATED).json(
      ApiResponse.created(result, 'User registered successfully.')
    );
  }),

  /**
   * Login with email and password
   */
  login: asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
      throw ApiError.badRequest('Email and password are required.');
    }

    const result = await AuthService.loginUser({ email, password });
    res.status(HttpStatusCodes.OK).json(
      ApiResponse.success(result, 'Signed in successfully.')
    );
  }),

  /**
   * Google OAuth login / registration
   */
  googleLogin: asyncHandler(async (req, res) => {
    const { email, name, avatar, googleId } = req.body;

    if (!email) {
      throw ApiError.badRequest('Email is required for Google authentication.');
    }

    const result = await AuthService.googleLogin({ email, name, avatar, googleId });
    res.status(HttpStatusCodes.OK).json(
      ApiResponse.success(result, 'Google authentication successful.')
    );
  }),

  /**
   * Get current authenticated user profile
   */
  getMe: asyncHandler(async (req, res) => {
    const profile = await AuthService.getUserProfile(req.user._id);
    res.status(HttpStatusCodes.OK).json(
      ApiResponse.success(profile, 'Profile retrieved successfully.')
    );
  }),

  /**
   * Update profile details
   */
  updateProfile: asyncHandler(async (req, res) => {
    const { name, phoneNumber, avatar } = req.body;
    const updatedUser = await AuthService.updateProfile(req.user._id, {
      name,
      phoneNumber,
      avatar,
    });
    res.status(HttpStatusCodes.OK).json(
      ApiResponse.success(updatedUser, 'Profile updated successfully.')
    );
  }),

  /**
   * Change user password
   */
  changePassword: asyncHandler(async (req, res) => {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      throw ApiError.badRequest('Current password and new password are required.');
    }

    if (!ValidationRules.isStrongPassword(newPassword)) {
      throw ApiError.badRequest('New password must be at least 6 characters long.');
    }

    const result = await AuthService.changePassword(req.user._id, currentPassword, newPassword);
    res.status(HttpStatusCodes.OK).json(
      ApiResponse.success(null, result.message)
    );
  }),
};
