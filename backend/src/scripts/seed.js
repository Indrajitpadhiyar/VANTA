import { connectDB, disconnectDB } from '../config/db.config.js';
import { User } from '../models/User.model.js';
import { logger } from '../utils/logger.js';

/**
 * Seeder script to initialize default administrative credentials.
 * Hardcoded dummy products, categories, and reviews have been removed.
 */
const seedDatabase = async () => {
  try {
    logger.info('Starting seeder script...');
    await connectDB();

    // Ensure default Administrator exists
    const existingAdmin = await User.findOne({ email: 'admin@vanta.com' });
    if (!existingAdmin) {
      logger.info('Creating default Administrator account...');
      const adminUser = await User.create({
        name: 'VANTA Administrator',
        email: 'admin@vanta.com',
        password: 'Admin@123456',
        role: 'admin',
        phoneNumber: '+91 9876543210',
        avatar: {
          url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
        },
      });
      logger.success(`Created admin account [${adminUser.email}]`);
    } else {
      logger.info('Administrator account [admin@vanta.com] already exists.');
    }

    logger.success('Seeder completed successfully.');
    await disconnectDB();
    process.exit(0);
  } catch (error) {
    logger.error('Error during seeder execution:', error.stack);
    await disconnectDB();
    process.exit(1);
  }
};

seedDatabase();
