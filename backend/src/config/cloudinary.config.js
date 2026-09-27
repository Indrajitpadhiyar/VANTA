import { v2 as cloudinary } from 'cloudinary';
import { envConfig } from './env.config.js';
import { logger } from '../utils/logger.js';

cloudinary.config({
  cloud_name: envConfig.CLOUDINARY_CLOUD_NAME,
  api_key: envConfig.CLOUDINARY_API_KEY,
  api_secret: envConfig.CLOUDINARY_API_SECRET,
  secure: true,
});

logger.info(`Cloudinary configured for cloud_name: [${envConfig.CLOUDINARY_CLOUD_NAME}]`);

export default cloudinary;
