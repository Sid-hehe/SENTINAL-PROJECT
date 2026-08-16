import { Router } from 'express';
import {
  getSessions,
  getSessionById,
  updateSessionStatus,
  getSessionSignals,
  getSessionNotes,
  addSessionNote,
  simulateSession,
  streamSessionEvents,
} from '../controllers/sessionController.js';
import { authenticateUser, requireRole } from '../middleware/auth.js';

const router = Router();

// Protected for Analysts and Admins
router.use(authenticateUser, requireRole(['ANALYST', 'ADMIN']));

router.get('/', getSessions);
router.get('/stream', streamSessionEvents);
router.post('/simulate', simulateSession);
router.get('/:id', getSessionById);
router.patch('/:id/status', updateSessionStatus);

router.get('/:id/signals', getSessionSignals);
router.get('/:id/notes', getSessionNotes);
router.post('/:id/notes', addSessionNote);

export default router;


