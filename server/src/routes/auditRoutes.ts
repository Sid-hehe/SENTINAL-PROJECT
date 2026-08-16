import { Router } from 'express';
import { getAuditLogs } from '../controllers/auditController.js';
import { authenticateUser, requireRole } from '../middleware/auth.js';

const router = Router();

// Admin only
router.use(authenticateUser, requireRole(['ADMIN']));

router.get('/', getAuditLogs);

export default router;
