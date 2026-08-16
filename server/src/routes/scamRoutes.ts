import { Router } from 'express';
import {
  getScams,
  getScamById,
  createScam,
  updateScam,
  deleteScam,
} from '../controllers/scamController.js';
import { authenticateUser, requireRole } from '../middleware/auth.js';

const router = Router();

// Public routes
router.get('/', getScams);
router.get('/:id', getScamById);

// Admin-only routes
router.post('/', authenticateUser, requireRole(['ADMIN']), createScam);
router.patch('/:id', authenticateUser, requireRole(['ADMIN']), updateScam);
router.delete('/:id', authenticateUser, requireRole(['ADMIN']), deleteScam);

export default router;
