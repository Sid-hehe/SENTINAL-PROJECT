import { Router } from 'express';
import authRoutes from './authRoutes.js';
import scamRoutes from './scamRoutes.js';
import reportRoutes from './reportRoutes.js';
import sessionRoutes from './sessionRoutes.js';
import dashboardRoutes from './dashboardRoutes.js';
import userRoutes from './userRoutes.js';
import auditRoutes from './auditRoutes.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/scams', scamRoutes);
router.use('/reports', reportRoutes);
router.use('/sessions', sessionRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/users', userRoutes);
router.use('/audit-logs', auditRoutes);

export default router;
