import express from 'express';
import { registerUser, loginUser, createStaff, getUsers } from '../controllers/authController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/staff', protect, admin, createStaff);
router.get('/users', protect, admin, getUsers);

export default router;
