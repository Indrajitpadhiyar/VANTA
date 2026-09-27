import multer from 'multer';
import { ApiError } from '../utils/apiError.js';

/**
 * Multer Memory Storage Configuration
 * Stores files temporarily in memory buffers for direct streaming to Cloudinary.
 */
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/avif'];

  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      ApiError.badRequest(
        `Invalid file type '${file.mimetype}'. Only JPG, PNG, WEBP, and AVIF image formats are supported.`
      ),
      false
    );
  }
};

export const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB max file size
    files: 5,                  // max 5 files per request
  },
  fileFilter,
});
