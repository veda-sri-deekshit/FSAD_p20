import express from 'express';
import { signup, login, getUserProfile, forgotPassword, resetPassword } from '../controllers/authController.js';

const router = express.Router();

// Auth routes
router.post('/signup', signup);
router.post('/login', login);
router.get('/profile', getUserProfile);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

export default router;
