import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env explicitly from backend root
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const requiredEnvVars = ['MONGODB_URI'];

for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    console.warn(`[WARN] Required environment variable "${envVar}" is missing from .env.`);
  }
}

export const envConfig = Object.freeze({
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: parseInt(process.env.PORT, 10) || 4000,
  CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:5173',

  // Database
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017',
  DB_NAME: process.env.DB_NAME || 'vanta_store',

  // JWT
  JWT_SECRET: process.env.JWT_SECRET || 'vanta_default_dev_secret_key_change_in_production',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',

  // Cloudinary
  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME || 'dex6myw4v',
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY || '857314168756135',
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET || 'ZPyNx0-k98NVVvC9fT3bbaBKD_w',
  CLOUDINARY_URL: process.env.CLOUDINARY_URL,

  isProduction: process.env.NODE_ENV === 'production',
  isDevelopment: process.env.NODE_ENV !== 'production',
});
