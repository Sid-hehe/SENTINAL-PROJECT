import { Router } from 'express';
import { getUsers, updateUser, deleteUser } from '../controllers/userController.js';
import { authenticateUser, requireRole } from '../middleware/auth.js';

const router = Router();

// Admin only
router.use(authenticateUser, requireRole(['ADMIN']));

router.get('/', getUsers);
router.patch('/:id', updateUser);
router.delete('/:id', deleteUser);

export default router;
