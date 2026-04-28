import express from 'express';
import { 
  getDashboardStats, 
  getAnalytics, 
  getAllUsers, 
  getAllAppointments,
  getAllHealthRecords,
  getDoctorsList,
  getSystemHealth 
} from '../controllers/adminController.js';

import {
  acceptAppointment,
  rejectAppointment
} from '../controllers/appointmentController.js';

const router = express.Router();

// Admin API endpoints
router.get('/stats', getDashboardStats);
router.get('/analytics', getAnalytics);
router.get('/users', getAllUsers);
router.get('/appointments', getAllAppointments);
router.get('/health-records', getAllHealthRecords);
router.get('/doctors', getDoctorsList);
router.get('/system-health', getSystemHealth);

// Admin appointment actions
router.put('/appointments/:appointmentId/accept', acceptAppointment);
router.put('/appointments/:appointmentId/reject', rejectAppointment);

export default router;
