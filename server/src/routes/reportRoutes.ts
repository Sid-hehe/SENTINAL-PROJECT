import { Router } from 'express';
import {
  submitReport,
  getReports,
  getReportById,
  updateReportStatus,
} from '../controllers/reportController.js';
import { authenticateUser, requireRole } from '../middleware/auth.js';

const router = Router();

// Public submission
router.post('/', submitReport);

// Analyst & Admin routes
router.get('/', authenticateUser, requireRole(['ANALYST', 'ADMIN']), getReports);
router.get('/:id', authenticateUser, requireRole(['ANALYST', 'ADMIN']), getReportById);
router.patch('/:id', authenticateUser, requireRole(['ANALYST', 'ADMIN']), updateReportStatus);

export default router;
