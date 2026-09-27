import mongoose from 'mongoose';
import { ApiResponse } from '../utils/apiResponse.js';
import { HttpStatusCodes } from '../constants/httpStatusCodes.js';

export const HealthController = {
  check: (req, res) => {
    const memoryUsage = process.memoryUsage();

    const healthData = {
      status: 'healthy',
      uptime: `${Math.floor(process.uptime())}s`,
      timestamp: new Date().toISOString(),
      services: {
        database: {
          status: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
          readyState: mongoose.connection.readyState,
        },
      },
      system: {
        nodeVersion: process.version,
        platform: process.platform,
        memoryRssMb: Math.round((memoryUsage.rss / 1024 / 1024) * 100) / 100,
        heapUsedMb: Math.round((memoryUsage.heapUsed / 1024 / 1024) * 100) / 100,
      },
    };

    res.status(HttpStatusCodes.OK).json(
      ApiResponse.success(healthData, 'System is operational and healthy.')
    );
  },
};
