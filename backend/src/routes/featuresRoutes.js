import express from 'express';
import {
  bookConsultation,
  getConsultations,
  uploadLabReport,
  getLabReports,
  checkDrugInteractions,
  addDoctorReview,
  getDoctorReviews,
  recordVaccination,
  getVaccinations,
  recordAllergy,
  getAllergies,
  logFitnessActivity,
  getFitnessData,
  addEmergencyContact,
  getEmergencyContacts,
  triggerEmergencyAlert
} from '../controllers/featuresController.js';

const router = express.Router();

// Telemedicine
router.post('/consultation/book', bookConsultation);
router.get('/consultations', getConsultations);

// Lab Reports
router.post('/lab-report', uploadLabReport);
router.get('/lab-reports', getLabReports);

// Drug Interactions
router.post('/drug-interactions', checkDrugInteractions);

// Doctor Reviews
router.post('/review', addDoctorReview);
router.get('/reviews', getDoctorReviews);

// Vaccinations
router.post('/vaccination', recordVaccination);
router.get('/vaccinations', getVaccinations);

// Allergies
router.post('/allergy', recordAllergy);
router.get('/allergies', getAllergies);

// Fitness & Wellness
router.post('/fitness-activity', logFitnessActivity);
router.get('/fitness-data', getFitnessData);

// Emergency Contacts
router.post('/emergency-contact', addEmergencyContact);
router.get('/emergency-contacts', getEmergencyContacts);
router.post('/emergency-alert', triggerEmergencyAlert);

export default router;
