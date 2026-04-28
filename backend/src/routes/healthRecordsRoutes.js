import express from 'express';
import {
  getHealthDashboard,
  recordMedicalInfo,
  recordPrescription,
  getHealthSuggestions,
  getAnalytics
} from '../controllers/healthRecordsController.js';

const router = express.Router();

// Health records routes
router.get('/health-dashboard', getHealthDashboard);
router.get('/suggestions', getHealthSuggestions);
router.post('/medical-record', recordMedicalInfo);
router.post('/prescription', recordPrescription);

// Admin analytics
router.get('/analytics', getAnalytics);

export default router;
