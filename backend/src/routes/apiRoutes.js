import express from 'express';
import { getHealth, getWelcome } from '../controllers/healthController.js';
import appointmentRoutes from './appointmentRoutes.js';
import authRoutes from './authRoutes.js';
import healthRecordsRoutes from './healthRecordsRoutes.js';
import healthReportsRoutes from './healthReportsRoutes.js';
import featuresRoutes from './featuresRoutes.js';
import messagesRoutes from './messagesRoutes.js';

const router = express.Router();

router.get('/health', getHealth);
router.get('/', getWelcome);

// Auth routes
router.use('/auth', authRoutes);

// Health records routes
router.use('/health', healthRecordsRoutes);

// Health reports routes
router.use('/reports', healthReportsRoutes);

// Features routes (telemedicine, lab reports, etc.)
router.use('/features', featuresRoutes);

// Messages routes
router.use('/', messagesRoutes);

// Appointment routes
router.use('/', appointmentRoutes);

export default router;
