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
 * API Version 1 Router Aggregation
 */
router.use('/auth', authRoutes);
router.use('/products', productRoutes);
router.use('/categories', categoryRoutes);
router.use('/orders', orderRoutes);
router.use('/cart', cartRoutes);
router.use('/reviews', reviewRoutes);
router.use('/health', healthRoutes);

export default router;
