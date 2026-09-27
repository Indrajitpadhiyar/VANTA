import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller.js';
import { protect } from '../middlewares/auth.middleware.js';
import { rateLimiter } from '../middlewares/rateLimiter.middleware.js';

const router = Router();

// Protect sensitive authentication routes from brute force
const authLimiter = rateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: 'Too many authentication attempts. Please try again after 15 minutes.',
});

router.post('/register', authLimiter, AuthController.register);
router.post('/login', authLimiter, AuthController.login);
router.post('/google', authLimiter, AuthController.googleLogin);

router.use(protect); // Guard following routes with JWT
router.get('/me', AuthController.getMe);
router.put('/profile', AuthController.updateProfile);
router.put('/change-password', AuthController.changePassword);

export default router;
