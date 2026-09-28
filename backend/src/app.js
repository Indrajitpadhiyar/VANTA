import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import { corsOptions } from './config/cors.config.js';
import { requestLogger } from './middlewares/requestLogger.middleware.js';
import { notFound } from './middlewares/notFound.middleware.js';
import { errorHandler } from './middlewares/error.middleware.js';
import v1Routes from './routes/index.js';

/**
 * Initialize Express Application
 */
const app = express();

// Security HTTP headers
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  })
);

// Cross-Origin Resource Sharing
app.use(cors(corsOptions));

// HTTP response compression
app.use(compression());

// Body Parsers
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Custom latency & HTTP access logger
app.use(requestLogger);

// Root informational endpoint
app.get('/', (req, res) => {
  res.status(200).json({
    name: 'VANTA Fashion Storefront API',
    version: '1.0.0',
    status: 'online',
    endpoints: {
      documentation: '/api/v1/health',
      v1: '/api/v1',
    },
  });
});

// Mount V1 API Routes
app.use('/api/v1', v1Routes);

// 404 Route Not Found Middleware
app.use(notFound);

// Centralized Global Error Handler Middleware
app.use(errorHandler);

export default app;
