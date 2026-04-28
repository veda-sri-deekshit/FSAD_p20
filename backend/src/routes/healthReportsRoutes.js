import express from 'express';
import {
  generateHealthReport,
  getUserHealthReports,
  getHealthReportById,
  getReportsByType,
  updateHealthReport,
  deleteHealthReport,
  getHealthReportSummary
} from '../controllers/healthReportsController.js';

const router = express.Router();

// Generate new health report
router.post('/reports', generateHealthReport);

// Get all health reports for a user
router.get('/reports', getUserHealthReports);

// Get health report by ID
router.get('/reports/:reportId', getHealthReportById);

// Get reports by type
router.get('/reports-by-type', getReportsByType);

// Get health report summary
router.get('/summary', getHealthReportSummary);

// Update health report
router.put('/reports/:reportId', updateHealthReport);

// Delete health report
router.delete('/reports/:reportId', deleteHealthReport);

export default router;
