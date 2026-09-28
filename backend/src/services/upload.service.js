import cloudinary from '../config/cloudinary.config.js';
import { ApiError } from '../utils/apiError.js';
import { logger } from '../utils/logger.js';

/**
 * Cloudinary Media Service
 * Handles secure streaming of media buffers and asset lifecycle.
 */
export const UploadService = {
  /**
   * Upload buffer directly to Cloudinary
   * @param {Buffer} buffer - File buffer from Multer
   * @param {string} [folder='vanta_store/products'] - Target folder
   * @returns {Promise<{ url: string, public_id: string }>}
   */
  uploadImageBuffer: (buffer, folder = 'vanta_store/products') => {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder,
          resource_type: 'image',
          transformation: [
            { quality: 'auto:best' },
            { fetch_format: 'auto' },
          ],
        },
        (error, result) => {
          if (error) {
            logger.error('Cloudinary stream upload error:', error.message);
            return reject(ApiError.internal('Failed to upload image to Cloudinary.'));
          }
          resolve({
            url: result.secure_url,
            public_id: result.public_id,
          });
        }
      );

      uploadStream.end(buffer);
    });
  },

  /**
   * Upload base64 or Data URI string directly to Cloudinary
   * @param {string} base64String - Data URL or base64 image
   * @param {string} [folder='vanta_store/products'] - Target folder
   * @returns {Promise<{ url: string, public_id: string }>}
   */
  uploadBase64: async (base64String, folder = 'vanta_store/products') => {
    try {
      const result = await cloudinary.uploader.upload(base64String, {
        folder,
        resource_type: 'image',
        transformation: [
          { quality: 'auto:best' },
          { fetch_format: 'auto' },
        ],
      });
      return {
        url: result.secure_url,
        public_id: result.public_id,
      };
    } catch (error) {
      logger.error('Cloudinary base64 upload error:', error.message);
      throw ApiError.internal('Failed to upload base64 image to Cloudinary.');
    }
  },

  /**
   * Delete image asset from Cloudinary
   * @param {string} publicId
   */
  deleteImage: async (publicId) => {
    if (!publicId) return;
    try {
      await cloudinary.uploader.destroy(publicId);
      logger.info(`Asset deleted from Cloudinary: ${publicId}`);
    } catch (error) {
      logger.warn(`Failed to delete Cloudinary asset [${publicId}]:`, error.message);
    }
  },
};
