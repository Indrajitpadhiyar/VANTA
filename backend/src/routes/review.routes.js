import { Router } from 'express';
import { ReviewController } from '../controllers/review.controller.js';
import { protect } from '../middlewares/auth.middleware.js';

const router = Router();

// Public: get reviews for a product
router.get('/product/:productId', ReviewController.getProductReviews);

// Protected: submit or delete a review
router.post('/product/:productId', protect, ReviewController.createReview);
router.delete('/:id', protect, ReviewController.deleteReview);

export default router;
