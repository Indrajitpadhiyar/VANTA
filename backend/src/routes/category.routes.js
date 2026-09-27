import { Router } from 'express';
import { CategoryController } from '../controllers/category.controller.js';
import { protect, authorize } from '../middlewares/auth.middleware.js';

const router = Router();

// Public routes
router.get('/', CategoryController.getCategories);
router.get('/:id', CategoryController.getCategory);

// Admin-only management routes
router.post('/', protect, authorize('admin'), CategoryController.createCategory);
router.put('/:id', protect, authorize('admin'), CategoryController.updateCategory);
router.delete('/:id', protect, authorize('admin'), CategoryController.deleteCategory);

export default router;
