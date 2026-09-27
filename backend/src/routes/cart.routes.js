import { Router } from 'express';
import { CartController } from '../controllers/cart.controller.js';
import { protect } from '../middlewares/auth.middleware.js';

const router = Router();

// All cart operations require authentication
router.use(protect);

router.get('/', CartController.getCart);
router.post('/items', CartController.addToCart);
router.put('/items/:itemId', CartController.updateCartItem);
router.delete('/items/:itemId', CartController.removeItem);
router.delete('/', CartController.clearCart);
router.post('/sync', CartController.syncGuestCart);

export default router;
