import { Router } from 'express';
import { register, login, logout, getMe } from '../controllers/authController.js';
import { authenticateUser } from '../middleware/auth.js';
import { authRateLimiter } from '../middleware/rateLimit.js';

const router = Router();

router.post('/register', authRateLimiter, register);
router.post('/login', authRateLimiter, login);
router.post('/logout', logout);
router.get('/me', authenticateUser, getMe);

export default router;
