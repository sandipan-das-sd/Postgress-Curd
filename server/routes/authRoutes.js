import express from 'express';
import { register, login, getMe, logout } from '../controller/authController.js';
import { protect } from '../middlewires/authMiddleware.js';

const router = express.Router();

// Public routes
router.post('/register', register);
router.post('/login', login);

// Protected routes (require authentication)
router.get('/me', protect, getMe);
router.post('/logout', protect, logout);

export default router;
