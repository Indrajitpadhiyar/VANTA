import { Router } from 'express';
import { SettingController } from '../controllers/setting.controller.js';
import { protect, authorize } from '../middlewares/auth.middleware.js';

const router = Router();

// Public: fetch setting
router.get('/:key', SettingController.getSetting);

// Protected (Admin only): update setting
router.put('/:key', protect, authorize('admin'), SettingController.updateSetting);

export default router;
