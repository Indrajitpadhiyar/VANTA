import { Router } from 'express';
import { OrderController } from '../controllers/order.controller.js';
import { protect, authorize } from '../middlewares/auth.middleware.js';

const router = Router();

// Order operations require authentication
router.use(protect);

router.post('/', OrderController.createOrder);
router.get('/my-orders', OrderController.getMyOrders);
router.get('/:id', OrderController.getOrderById);
router.put('/:id/pay', OrderController.payOrder);

// Admin-only order fulfillment
router.get('/', authorize('admin'), OrderController.getAllOrders);
router.put('/:id/status', authorize('admin'), OrderController.updateOrderStatus);

export default router;
