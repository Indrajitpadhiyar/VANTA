import { Router } from 'express';
import { ProductController } from '../controllers/product.controller.js';
import { protect, authorize } from '../middlewares/auth.middleware.js';
import { upload } from '../middlewares/upload.middleware.js';

const router = Router();

// Public routes
router.get('/', ProductController.getProducts);
router.get('/featured', ProductController.getFeatured);
router.get('/categories-summary', ProductController.getCategoriesSummary);
router.get('/related', ProductController.getRelated);
router.get('/:idOrSlug', ProductController.getProduct);

// Admin-only management routes
router.post(
  '/',
  protect,
  authorize('admin'),
  ProductController.createProduct
);

router.put(
  '/:id',
  protect,
  authorize('admin'),
  ProductController.updateProduct
);

router.delete(
  '/:id',
  protect,
  authorize('admin'),
  ProductController.deleteProduct
);

router.post(
  '/upload-image',
  protect,
  authorize('admin'),
  upload.single('image'),
  ProductController.uploadImage
);

export default router;
