import { db } from '../database.js';

// ============ TELEMEDICINE/CONSULTATION BOOKING ============
export const bookConsultation = (req, res) => {
  try {
    const { patientEmail, doctorId, date, time, type, reason } = req.body;

    if (!patientEmail || !doctorId || !date || !time || !type) {
      return res.status(400).json({
        success: false,
        error: 'All fields are required'
      });
    }

    const consultation = db.bookConsultation(patientEmail, {
      doctorId,
      date,
      time,
      type, // 'video' or 'audio'
      reason
    });

    console.log(`✅ Consultation booked for: ${patientEmail}`);

    res.status(201).json({
      success: true,
      message: 'Consultation scheduled successfully',
      data: consultation
    });
  } catch (error) {
    console.error('Book consultation error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to book consultation'
    });
  }
};

export const getConsultations = (req, res) => {
  try {
    const { email } = req.query;
    const result = email ? db.getConsultations(email) : db.telemedicineConsultations;

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Get consultations error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch consultations'
    });
  }
};

// ============ LAB REPORTS MANAGEMENT ============
export const uploadLabReport = (req, res) => {
  try {
    const { patientEmail, testName, testDate, results, laboratorName, notes } = req.body;

    if (!patientEmail || !testName || !testDate) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields'
      });
    }

    const report = db.addLabReport(patientEmail, {
      testName,
      testDate,
      results,
      laboratorName,
      notes
    });

    console.log(`✅ Lab report uploaded for: ${patientEmail}`);

    res.status(201).json({
      success: true,
      message: 'Lab report uploaded successfully',
      data: report
    });
  } catch (error) {
    console.error('Upload lab report error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to upload lab report'
    });
  }
};

export const getLabReports = (req, res) => {
  try {
    const { email } = req.query;
    const result = email ? db.getLabReports(email) : db.labReports;

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Get lab reports error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch lab reports'
    });
  }
};

// Drug Interactions Checker
export const checkDrugInteractions = (req, res) => {
  try {
    const { medications } = req.body;

    if (!medications || !Array.isArray(medications)) {
      return res.status(400).json({
        success: false,
        error: 'Medications array is required'
      });
    }

    const interactions = {
      aspirin: ['ibuprofen', 'warfarin', 'clopidogrel'],
      metformin: ['alcohol', 'contrast dye'],
      lisinopril: ['potassium supplements', 'NSAIDs'],
      metoprolol: ['verapamil', 'diltiazem'],
      warfarin: ['aspirin', 'NSAIDs', 'cranberry'],
      ibuprofen: ['aspirin', 'naproxen', 'warfarin'],
      sertraline: ['tramadol', 'MAOIs', 'NSAIDs'],
      omeprazole: ['clopidogrel', 'ketoconazole'],
      levothyroxine: ['calcium', 'iron', 'acid reflux medications']
    };

    const foundInteractions = [];
    for (let i = 0; i < medications.length; i++) {
      for (let j = i + 1; j < medications.length; j++) {
        const med1 = medications[i].toLowerCase();
        const med2 = medications[j].toLowerCase();

        if (interactions[med1] && interactions[med1].some(m => m.toLowerCase() === med2)) {
          foundInteractions.push({
            drug1: medications[i],
            drug2: medications[j],
            severity: 'moderate',
            warning: `Potential interaction between ${medications[i]} and ${medications[j]}`
          });
        }
      }
    }

    res.json({
      success: true,
      data: {
        interactions: foundInteractions,
        totalMedications: medications.length,
        hasInteractions: foundInteractions.length > 0
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to check drug interactions'
    });
  }
};

// ============ DOCTOR RATINGS AND REVIEWS ============
export const addDoctorReview = (req, res) => {
  try {
    const { patientEmail, doctorId, rating, comment } = req.body;

    if (!patientEmail || !doctorId || !rating || !comment) {
      return res.status(400).json({
        success: false,
        error: 'All fields are required'
      });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        error: 'Rating must be between 1 and 5'
      });
    }

    const review = db.addDoctorReview(patientEmail, {
      doctorId: parseInt(doctorId),
      rating: parseInt(rating),
      comment
    });

    console.log(`✅ Review added for doctor ${doctorId}`);

    res.status(201).json({
      success: true,
      message: 'Review submitted successfully',
      data: review
    });
  } catch (error) {
    console.error('Add doctor review error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to submit review'
    });
  }
};

export const getDoctorReviews = (req, res) => {
  try {
    const { doctorId } = req.query;

    if (!doctorId) {
      return res.status(400).json({
        success: false,
        error: 'Doctor ID is required'
      });
    }

    const doctorRevs = db.getDoctorReviews(parseInt(doctorId));
    const avgRating = doctorRevs.length > 0
      ? (doctorRevs.reduce((sum, r) => sum + r.rating, 0) / doctorRevs.length).toFixed(1)
      : 0;

    res.json({
      success: true,
      data: {
        reviews: doctorRevs,
        averageRating: avgRating,
        totalReviews: doctorRevs.length
      }
    });
  } catch (error) {
    console.error('Get doctor reviews error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch reviews'
    });
  }
};

// ============ VACCINATION RECORDS ============
export const recordVaccination = (req, res) => {
  try {
    const { patientEmail, vaccineName, date, nextDue, notes } = req.body;

    if (!patientEmail || !vaccineName || !date) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields'
      });
    }

    const vaccination = db.recordVaccination(patientEmail, {
      vaccineName,
      date,
      nextDue,
      notes
    });

    console.log(`✅ Vaccination recorded for: ${patientEmail}`);

    res.status(201).json({
      success: true,
      message: 'Vaccination recorded successfully',
      data: vaccination
    });
  } catch (error) {
    console.error('Record vaccination error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to record vaccination'
    });
  }
};

export const getVaccinations = (req, res) => {
  try {
    const { email } = req.query;
    const result = email ? db.getVaccinations(email) : db.vaccinations;

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Get vaccinations error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch vaccinations'
    });
  }
};

// ============ ALLERGY MANAGEMENT ============
export const recordAllergy = (req, res) => {
  try {
    const { patientEmail, allergyName, severity, reaction, notes } = req.body;

    if (!patientEmail || !allergyName || !severity) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields'
      });
    }

    const allergy = db.recordAllergy(patientEmail, {
      allergyName,
      severity, // 'mild', 'moderate', 'severe'
      reaction,
      notes
    });

    console.log(`✅ Allergy recorded for: ${patientEmail}`);

    res.status(201).json({
      success: true,
      message: 'Allergy recorded successfully',
      data: allergy
    });
  } catch (error) {
    console.error('Record allergy error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to record allergy'
    });
  }
};

export const getAllergies = (req, res) => {
  try {
    const { email } = req.query;
    const result = email ? db.getAllergies(email) : db.allergies;

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Get allergies error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch allergies'
    });
  }
};

// ============ FITNESS & WELLNESS TRACKING ============
export const logFitnessActivity = (req, res) => {
  try {
    const { patientEmail, activityType, duration, calories, date, notes } = req.body;

    if (!patientEmail || !activityType || !duration) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields'
      });
    }

    const activity = db.logFitnessActivity(patientEmail, {
      activityType, // 'running', 'walking', 'gym', 'yoga', etc.
      duration,
      calories,
      date: date || new Date().toISOString().split('T')[0],
      notes
    });

    console.log(`✅ Fitness activity logged for: ${patientEmail}`);

    res.status(201).json({
      success: true,
      message: 'Activity logged successfully',
      data: activity
    });
  } catch (error) {
    console.error('Log fitness activity error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to log activity'
    });
  }
};

export const getFitnessData = (req, res) => {
  try {
    const { email } = req.query;
    const result = email ? db.getFitnessData(email) : db.fitnessActivities;

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Get fitness data error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch fitness data'
    });
  }
};

// ============ EMERGENCY CONTACTS ============
export const addEmergencyContact = (req, res) => {
  try {
    const { patientEmail, name, relationship, phone } = req.body;

    if (!patientEmail || !name || !phone) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields'
      });
    }

    const contact = db.addEmergencyContact(patientEmail, {
      name,
      relationship,
      phone
    });

    console.log(`✅ Emergency contact added for: ${patientEmail}`);

    res.status(201).json({
      success: true,
      message: 'Emergency contact added successfully',
      data: contact
    });
  } catch (error) {
    console.error('Add emergency contact error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to add emergency contact'
    });
  }
};

export const getEmergencyContacts = (req, res) => {
  try {
    const { email } = req.query;
    const result = email ? db.getEmergencyContacts(email) : db.emergencyContacts;

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch emergency contacts'
    });
  }
};

export const triggerEmergencyAlert = (req, res) => {
  try {
    const { patientEmail, message } = req.body;

    if (!patientEmail) {
      return res.status(400).json({
        success: false,
        error: 'Patient email is required'
      });
    }

    const contacts = db.getEmergencyContacts(patientEmail);

    console.log(`✅ Emergency alert triggered for: ${patientEmail} - Notifying ${contacts.length} contacts`);

    // In a real application, send SMS/email to all contacts
    res.status(200).json({
      success: true,
      message: 'Emergency alert sent to all contacts',
      data: {
        patientEmail,
        contactsNotified: contacts.length,
        message: message || 'Medical emergency - Patient needs immediate assistance',
        sentAt: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Trigger emergency alert error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to trigger emergency alert'
    });
  }
};
