import { User } from '../models/User.model.js';
import { ApiError } from '../utils/apiError.js';
import { generateToken } from '../utils/token.util.js';

/**
 * Authentication & Identity Business Logic Service
 */
export const AuthService = {
  /**
   * Register a new user
   * @param {Object} userData - { name, email, password, role }
   */
  registerUser: async ({ name, email, password, role = 'customer' }) => {
    const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
    if (existingUser) {
      throw ApiError.conflict('An account with this email address already exists.');
    }

    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password,
      role: role === 'admin' ? 'admin' : 'customer',
    });

    const token = generateToken({ id: user._id, role: user.role });

    return {
      user: user.toJSON(),
      token,
    };
  },

  /**
   * Login user and issue JWT
   * @param {Object} credentials - { email, password }
   */
  loginUser: async ({ email, password }) => {
    const user = await User.findOne({ email: email.toLowerCase().trim() }).select('+password');

    if (!user) {
      throw ApiError.unauthorized('Invalid email or password credentials.');
    }

    if (!user.isActive) {
      throw ApiError.forbidden('This account has been deactivated. Please contact support.');
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      throw ApiError.unauthorized('Invalid email or password credentials.');
    }

    const token = generateToken({ id: user._id, role: user.role });

    return {
      user: user.toJSON(),
      token,
    };
  },

  /**
   * Google OAuth Login / Register
   * @param {Object} googleData - { email, name, avatar, googleId }
   */
  googleLogin: async ({ email, name, avatar, googleId }) => {
    if (!email) {
      throw ApiError.badRequest('Email is required for Google authentication.');
    }

    const normalizedEmail = email.toLowerCase().trim();
    let user = await User.findOne({ email: normalizedEmail });

    if (user) {
      if (!user.isActive) {
        throw ApiError.forbidden('This account has been deactivated. Please contact support.');
      }

      // Link googleId or update avatar if not set
      let modified = false;
      if (!user.googleId && googleId) {
        user.googleId = googleId;
        user.authProvider = 'google';
        modified = true;
      }
      if (avatar && (!user.avatar?.url || user.avatar.url.includes('unsplash.com'))) {
        user.avatar = { url: avatar, public_id: null };
        modified = true;
      }
      if (modified) await user.save();
    } else {
      // Create new user account authenticated via Google
      const randomPassword = `G_${Math.random().toString(36).slice(-8)}_${Date.now()}`;
      user = await User.create({
        name: name ? name.trim() : normalizedEmail.split('@')[0],
        email: normalizedEmail,
        password: randomPassword,
        role: 'customer',
        authProvider: 'google',
        googleId: googleId || null,
        avatar: {
          url: avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
          public_id: null,
        },
      });
    }

    const token = generateToken({ id: user._id, role: user.role });

    return {
      user: user.toJSON(),
      token,
    };
  },

  /**
   * Fetch authenticated user profile
   * @param {string} userId
   */
  getUserProfile: async (userId) => {
    const user = await User.findById(userId);
    if (!user) {
      throw ApiError.notFound('User profile not found.');
    }
    return user.toJSON();
  },

  /**
   * Update user profile information
   * @param {string} userId
   * @param {Object} updateData - { name, phoneNumber, avatar }
   */
  updateProfile: async (userId, { name, phoneNumber, avatar }) => {
    const user = await User.findById(userId);
    if (!user) {
      throw ApiError.notFound('User not found.');
    }

    if (name) user.name = name.trim();
    if (phoneNumber !== undefined) user.phoneNumber = phoneNumber;
    if (avatar) user.avatar = avatar;

    await user.save();
    return user.toJSON();
  },

  /**
   * Change user password securely
   * @param {string} userId
   * @param {string} currentPassword
   * @param {string} newPassword
   */
  changePassword: async (userId, currentPassword, newPassword) => {
    const user = await User.findById(userId).select('+password');
    if (!user) {
      throw ApiError.notFound('User not found.');
    }

    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      throw ApiError.badRequest('Current password is incorrect.');
    }

    user.password = newPassword;
    await user.save();

    return { message: 'Password updated successfully.' };
  },
};
