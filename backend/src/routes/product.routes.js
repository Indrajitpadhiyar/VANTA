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

// Admin authorization middleware with development grace mode
const adminAuth = (req, res, next) => {
  if (req.headers.authorization || (req.cookies && req.cookies.token)) {
    return protect(req, res, () => authorize('admin')(req, res, next));
  }
  if (process.env.NODE_ENV === 'development') {
    return next();
  }
  return protect(req, res, () => authorize('admin')(req, res, next));
};

// Admin-only management routes
router.post(
  '/',
  adminAuth,
  ProductController.createProduct
);

router.put(
  '/:id',
  adminAuth,
  ProductController.updateProduct
);

router.delete(
  '/:id',
  adminAuth,
  ProductController.deleteProduct
);

router.post(
  '/upload-image',
  adminAuth,
  upload.single('image'),
  ProductController.uploadImage
);

router.post(
  '/upload-images',
  adminAuth,
  upload.array('images', 10),
  ProductController.uploadMultipleImages
);

export default router;
