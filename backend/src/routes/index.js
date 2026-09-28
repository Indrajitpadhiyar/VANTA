import { Router } from 'express';
import authRoutes from './auth.routes.js';
import productRoutes from './product.routes.js';
import categoryRoutes from './category.routes.js';
import orderRoutes from './order.routes.js';
import cartRoutes from './cart.routes.js';
import reviewRoutes from './review.routes.js';
import healthRoutes from './health.routes.js';

const router = Router();

/**
 * API Version 1 Router Aggregation & Endpoint Directory
 */
router.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    version: 'v1',
    description: 'VANTA Haute Couture & Streetwear RESTful API',
    endpoints: {
      auth: '/api/v1/auth',
      products: '/api/v1/products',
      categories: '/api/v1/categories',
      orders: '/api/v1/orders',
      cart: '/api/v1/cart',
      reviews: '/api/v1/reviews',
      health: '/api/v1/health',
    },
  });
});
router.use('/auth', authRoutes);
router.use('/products', productRoutes);
router.use('/categories', categoryRoutes);
router.use('/orders', orderRoutes);
router.use('/cart', cartRoutes);
router.use('/reviews', reviewRoutes);
router.use('/health', healthRoutes);

export default router;
