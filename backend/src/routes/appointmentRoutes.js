import express from 'express';
import {
  getDoctors,
  getDoctorById,
  bookAppointment,
  getAppointments,
  getAppointmentById,
  cancelAppointment,
  getAvailableSlots,
  getDoctorAppointments,
  acceptAppointment,
  rejectAppointment,
} from '../controllers/appointmentController.js';

const router = express.Router();

// Doctor routes
router.get('/doctors', getDoctors);
router.get('/doctors/:doctorId', getDoctorById);

// Appointment routes
router.post('/appointments', bookAppointment);
router.get('/appointments', getAppointments);
router.get('/appointments/available-slots', getAvailableSlots);
router.get('/appointments/:appointmentId', getAppointmentById);
router.put('/appointments/:appointmentId/cancel', cancelAppointment);

// Doctor appointment management routes
router.get('/doctor/appointments', getDoctorAppointments);
router.put('/appointments/:appointmentId/accept', acceptAppointment);
router.put('/appointments/:appointmentId/reject', rejectAppointment);

// Available slots route
router.get('/slots/available', getAvailableSlots);

export default router;
