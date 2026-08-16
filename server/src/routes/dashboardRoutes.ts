import { Router } from 'express';
import {
  getDashboardStats,
  getDashboardTrends,
  getModelHealth,
  toggleModelHealth,
} from '../controllers/dashboardController.js';
import { authenticateUser, requireRole } from '../middleware/auth.js';

const router = Router();

// Protected for Analysts and Admins
router.use(authenticateUser, requireRole(['ANALYST', 'ADMIN']));

router.get('/stats', getDashboardStats);
router.get('/trends', getDashboardTrends);
router.get('/model-health', getModelHealth);
router.post('/model-health/toggle', toggleModelHealth);

export default router;
