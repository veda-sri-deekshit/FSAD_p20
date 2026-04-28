import { db } from '../database.js';

// Get user health dashboard - Retrieves all health data and suggestions
export const getHealthDashboard = (req, res) => {
  try {
    const { email } = req.query;

    if (!email) {
      return res.status(400).json({
        success: false,
        error: 'Email is required'
      });
    }

    const healthRecord = db.getHealthRecord(email);
    const suggestions = db.generateHealthSuggestions(email);
    const appointments = db.getAppointmentsByUser(email);
    const prescriptions = db.getPrescriptionsByUser(email);

    res.status(200).json({
      success: true,
      data: {
        healthRecord: healthRecord || { patientEmail: email, medicalInfo: {}, prescriptions: [] },
        appointments,
        prescriptions,
        suggestions
      }
    });
  } catch (error) {
    console.error('Health dashboard error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch health dashboard'
    });
  }
};

// Record medical information - Saves vitals to database
export const recordMedicalInfo = (req, res) => {
  try {
    const { patientEmail, bloodPressure, bloodSugar, temperature, weight, height, notes } = req.body;

    if (!patientEmail) {
      return res.status(400).json({
        success: false,
        error: 'Patient email is required'
      });
    }

    const medicalInfo = {
      bloodPressure: bloodPressure || '',
      bloodSugar: bloodSugar || '',
      temperature: temperature || '',
      weight: weight || '',
      height: height || '',
      notes: notes || '',
      recordedAt: new Date().toISOString()
    };

    const savedRecord = db.addHealthRecord(patientEmail, medicalInfo);

    console.log(`✅ Medical info recorded for: ${patientEmail}`);

    res.status(201).json({
      success: true,
      message: 'Medical information recorded successfully',
      data: savedRecord
    });
  } catch (error) {
    console.error('Medical record error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to record medical information'
    });
  }
};

// Record prescription - Saves medication to database
export const recordPrescription = (req, res) => {
  try {
    // Accept both 'medication' and 'medicationName' for flexibility
    const { patientEmail, medication, medicationName, dosage, frequency, duration, refillsRemaining, doctorId, instructions } = req.body;
    
    const medName = medicationName || medication;

    if (!patientEmail || !medName) {
      return res.status(400).json({
        success: false,
        error: 'Patient email and medication name are required'
      });
    }

    const prescription = {
      medicationName: medName,
      dosage: dosage || '',
      frequency: frequency || '',
      duration: duration || '',
      refillsRemaining: refillsRemaining || 3,
      doctorId: doctorId || '',
      instructions: instructions || '',
      prescribedAt: new Date().toISOString()
    };

    const savedPrescription = db.addPrescription(patientEmail, prescription);

    console.log(`✅ Prescription added for: ${patientEmail}`);

    res.status(201).json({
      success: true,
      message: 'Prescription recorded successfully',
      data: savedPrescription
    });
  } catch (error) {
    console.error('Prescription error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to record prescription'
    });
  }
};

// Get health suggestions
export const getHealthSuggestions = (req, res) => {
  try {
    const { email } = req.query;

    if (!email) {
      return res.status(400).json({
        success: false,
        error: 'Email is required'
      });
    }

    const suggestions = db.generateHealthSuggestions(email);

    res.status(200).json({
      success: true,
      data: suggestions
    });
  } catch (error) {
    console.error('Health suggestions error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch health suggestions'
    });
  }
};

// Get analytics dashboard (admin)
export const getAnalytics = (req, res) => {
  try {
    const analytics = getAnalyticsDashboard();

    res.status(200).json({
      success: true,
      data: analytics
    });
  } catch (error) {
    console.error('Analytics error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch analytics'
    });
  }
};
