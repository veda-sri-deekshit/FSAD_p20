// In-Memory Database with Data Persistence Functions
import { syncMysql } from './mysqlSync.js';

let users = [
  {
    id: 1,
    email: "doctor@test.com",
    password: "password123",
    role: "doctor",
    name: "Dr. Sarah Johnson"
  },
  {
    id: 2,
    email: "2400032601@kluniversity.in",
    password: "password123",
    role: "patient",
    name: "Patient User"
  }
];
let doctors = [
  { id: 1, name: 'Dr. Sarah Johnson', specialty: 'General Physician', availableSlots: ['09:00', '10:00', '11:00', '14:00', '15:00'], isAvailable: true },
  { id: 2, name: 'Dr. Michael Brown', specialty: 'Cardiologist', availableSlots: ['10:00', '11:00', '13:00', '16:00'], isAvailable: true },
  { id: 3, name: 'Dr. Emily Davis', specialty: 'Dermatologist', availableSlots: ['09:30', '11:30', '14:30', '15:30'], isAvailable: true },
  { id: 4, name: 'Dr. James Wilson', specialty: 'Orthopedist', availableSlots: ['08:00', '09:00', '14:00', '16:00'], isAvailable: true },
  { id: 5, name: 'Dr. Lisa Anderson', specialty: 'Pediatrician', availableSlots: ['10:00', '11:00', '12:00', '15:00'], isAvailable: true }
];

let appointments = [];
let healthRecords = [];
let healthReports = [];
let prescriptions = [];
let labReports = [];
let telemedicineConsultations = [];
let doctorReviews = [];
let vaccinations = [];
let allergies = [];
let fitnessActivities = [];
let emergencyContacts = [];

export const db = {
  // Users Management
  users,
  doctors,
  appointments,
  healthRecords,
  healthReports,
  prescriptions,
  labReports,
  telemedicineConsultations,
  doctorReviews,
  vaccinations,
  allergies,
  fitnessActivities,
  emergencyContacts,

  // ============ USER FUNCTIONS ============
  addUser: function(userData) {
    const newUser = {
      ...userData,
      id: users.length + 1,
      registeredAt: new Date(),
      stats: {
        totalAppointments: 0,
        lastVisit: null,
        symptomHistory: []
      }
    };
    users.push(newUser);
    syncMysql.insertUser(newUser);
    console.log(`✅ User created: ${userData.email}`);
    return newUser;
  },

  findUserByEmail: function(email) {
    return users.find(u => u.email === email);
  },

  updateUser: function(email, updates) {
    const user = this.findUserByEmail(email);
    if (user) {
      Object.assign(user, updates);
      syncMysql.updateUser(email, user);
      console.log(`✅ User updated: ${email}`);
    }
    return user;
  },

  // ============ PASSWORD RESET FUNCTIONS ============
  addPasswordResetToken: function(email, token, expiresAt) {
    const user = this.findUserByEmail(email);
    if (user) {
      user.resetToken = token;
      user.resetTokenExpiry = expiresAt;
      console.log(`✅ Reset token added for: ${email}`);
    }
    return user;
  },

  verifyPasswordResetToken: function(email, token) {
    const user = this.findUserByEmail(email);
    if (!user) {
      return false;
    }
    
    // Check if token matches and hasn't expired
    if (user.resetToken === token && user.resetTokenExpiry > new Date()) {
      console.log(`✅ Reset token verified for: ${email}`);
      return true;
    }
    
    console.log(`❌ Invalid or expired reset token for: ${email}`);
    return false;
  },

  clearPasswordResetToken: function(email) {
    const user = this.findUserByEmail(email);
    if (user) {
      user.resetToken = null;
      user.resetTokenExpiry = null;
      console.log(`✅ Reset token cleared for: ${email}`);
    }
    return user;
  },

  // ============ OTP FUNCTIONS ============
  addPasswordResetOTP: function(email, otp, expiresAt) {
    const user = this.findUserByEmail(email);
    if (user) {
      user.resetOTP = otp;
      user.resetOTPExpiry = expiresAt;
      console.log(`✅ Reset OTP added for: ${email}`);
    }
    return user;
  },

  verifyPasswordResetOTP: function(email, otp) {
    const user = this.findUserByEmail(email);
    if (!user) {
      return false;
    }
    
    // Check if OTP matches and hasn't expired
    if (user.resetOTP === otp && user.resetOTPExpiry > new Date()) {
      console.log(`✅ OTP verified for: ${email}`);
      return true;
    }
    
    console.log(`❌ Invalid or expired OTP for: ${email}`);
    return false;
  },

  clearPasswordResetOTP: function(email) {
    const user = this.findUserByEmail(email);
    if (user) {
      user.resetOTP = null;
      user.resetOTPExpiry = null;
      console.log(`✅ Reset OTP cleared for: ${email}`);
    }
    return user;
  },

  // ============ DOCTOR FUNCTIONS ============
  getDoctorById: function(id) {
    return doctors.find(d => d.id === id);
  },

  // ============ APPOINTMENT FUNCTIONS ============
  addAppointment: function(appointmentData) {
    const newAppointment = {
      ...appointmentData,
      id: appointments.length + 1,
      status: appointmentData.status || 'pending',
      createdAt: new Date()
    };
    appointments.push(newAppointment);

    // Update user stats
    const user = this.findUserByEmail(appointmentData.patientEmail);
    if (user) {
      if (!user.stats) user.stats = {};
      user.stats.totalAppointments = (user.stats.totalAppointments || 0) + 1;
      user.stats.lastVisit = new Date();
      if (appointmentData.symptoms) {
        if (!user.stats.symptomHistory) user.stats.symptomHistory = [];
        const symptomArray = typeof appointmentData.symptoms === 'string' 
          ? appointmentData.symptoms.split(',') 
          : [appointmentData.symptoms];
        user.stats.symptomHistory.push(...symptomArray);
      }
    }

    syncMysql.insertAppointment(newAppointment);
    console.log(`✅ Appointment added for: ${appointmentData.patientEmail}`);
    return newAppointment;
  },

  getAppointmentsByUser: function(email) {
    return appointments.filter(a => a.patientEmail === email);
  },

  updateAppointmentStatus: function(appointmentId, status) {
    const appointment = appointments.find(a => a.id === appointmentId);
    if (appointment) {
      appointment.status = status;
      appointment.updatedAt = new Date();
      syncMysql.updateAppointmentStatus(appointmentId, status, appointment.updatedAt);
      console.log(`✅ Appointment ${appointmentId} status updated to: ${status}`);
    }
    return appointment;
  },

  // ============ HEALTH RECORDS FUNCTIONS ============
  addHealthRecord: function(email, medicalInfo) {
    let record = healthRecords.find(r => r.patientEmail === email);
    if (!record) {
      record = {
        patientEmail: email,
        medicalInfo: {},
        prescriptions: [],
        vaccinations: [],
        allergies: [],
        createdAt: new Date()
      };
      healthRecords.push(record);
    }
    record.medicalInfo = { ...record.medicalInfo, ...medicalInfo };
    record.updatedAt = new Date();
    syncMysql.insertHealthRecord(record);
    console.log(`✅ Health record updated for: ${email}`);
    return record;
  },

  getHealthRecord: function(email) {
    return healthRecords.find(r => r.patientEmail === email);
  },

  // ============ PRESCRIPTION FUNCTIONS ============
  addPrescription: function(email, prescriptionData) {
    const newPrescription = {
      ...prescriptionData,
      id: prescriptions.length + 1,
      patientEmail: email,
      createdAt: new Date()
    };
    prescriptions.push(newPrescription);

    // Also add to health record
    let record = this.getHealthRecord(email);
    if (!record) {
      record = this.addHealthRecord(email, {});
    }
    if (!record.prescriptions) record.prescriptions = [];
    record.prescriptions.push(newPrescription);

    syncMysql.insertPrescription(newPrescription);
    console.log(`✅ Prescription added for: ${email}`);
    return newPrescription;
  },

  getPrescriptionsByUser: function(email) {
    return prescriptions.filter(p => p.patientEmail === email);
  },

  // ============ LAB REPORTS FUNCTIONS ============
  addLabReport: function(email, reportData) {
    const newReport = {
      ...reportData,
      id: labReports.length + 1,
      patientEmail: email,
      createdAt: new Date()
    };
    labReports.push(newReport);
    syncMysql.insertLabReport(newReport);
    console.log(`✅ Lab report added for: ${email}`);
    return newReport;
  },

  getLabReports: function(email) {
    return labReports.filter(r => r.patientEmail === email);
  },

  // ============ TELEMEDICINE FUNCTIONS ============
  bookConsultation: function(email, consultationData) {
    const newConsultation = {
      ...consultationData,
      id: telemedicineConsultations.length + 1,
      patientEmail: email,
      videoLink: `https://medicare-video.com/room/${Date.now()}`,
      status: 'scheduled',
      createdAt: new Date()
    };
    telemedicineConsultations.push(newConsultation);
    console.log(`✅ Telemedicine consultation booked for: ${email}`);
    return newConsultation;
  },

  getConsultations: function(email) {
    return telemedicineConsultations.filter(c => c.patientEmail === email);
  },

  // ============ DOCTOR REVIEWS FUNCTIONS ============
  addDoctorReview: function(email, reviewData) {
    const newReview = {
      ...reviewData,
      id: doctorReviews.length + 1,
      patientEmail: email,
      createdAt: new Date()
    };
    doctorReviews.push(newReview);
    console.log(`✅ Doctor review added for: ${email}`);
    return newReview;
  },

  getDoctorReviews: function(doctorId) {
    return doctorReviews.filter(r => r.doctorId === doctorId);
  },

  // ============ VACCINATION FUNCTIONS ============
  recordVaccination: function(email, vaccinationData) {
    const newVaccination = {
      ...vaccinationData,
      id: vaccinations.length + 1,
      patientEmail: email,
      createdAt: new Date()
    };
    vaccinations.push(newVaccination);

    // Add to health record
    let record = this.getHealthRecord(email);
    if (!record) {
      record = this.addHealthRecord(email, {});
    }
    if (!record.vaccinations) record.vaccinations = [];
    record.vaccinations.push(newVaccination);

    console.log(`✅ Vaccination recorded for: ${email}`);
    return newVaccination;
  },

  getVaccinations: function(email) {
    return vaccinations.filter(v => v.patientEmail === email);
  },

  // ============ ALLERGY FUNCTIONS ============
  recordAllergy: function(email, allergyData) {
    const newAllergy = {
      ...allergyData,
      id: allergies.length + 1,
      patientEmail: email,
      createdAt: new Date()
    };
    allergies.push(newAllergy);

    // Add to health record
    let record = this.getHealthRecord(email);
    if (!record) {
      record = this.addHealthRecord(email, {});
    }
    if (!record.allergies) record.allergies = [];
    record.allergies.push(newAllergy);

    console.log(`✅ Allergy recorded for: ${email}`);
    return newAllergy;
  },

  getAllergies: function(email) {
    return allergies.filter(a => a.patientEmail === email);
  },

  // ============ FITNESS FUNCTIONS ============
  logFitnessActivity: function(email, activityData) {
    const newActivity = {
      ...activityData,
      id: fitnessActivities.length + 1,
      patientEmail: email,
      createdAt: new Date()
    };
    fitnessActivities.push(newActivity);
    console.log(`✅ Fitness activity logged for: ${email}`);
    return newActivity;
  },

  getFitnessData: function(email) {
    return fitnessActivities.filter(f => f.patientEmail === email);
  },

  // ============ EMERGENCY CONTACTS FUNCTIONS ============
  addEmergencyContact: function(email, contactData) {
    const newContact = {
      ...contactData,
      id: emergencyContacts.length + 1,
      patientEmail: email,
      createdAt: new Date()
    };
    emergencyContacts.push(newContact);
    console.log(`✅ Emergency contact added for: ${email}`);
    return newContact;
  },

  getEmergencyContacts: function(email) {
    return emergencyContacts.filter(c => c.patientEmail === email);
  },

  // ============ HEALTH SUGGESTIONS FUNCTIONS ============
  generateHealthSuggestions: function(email) {
    const user = this.findUserByEmail(email);
    const health = this.getHealthRecord(email);
    const appointmentsData = this.getAppointmentsByUser(email);

    let suggestions = [];

    // Symptom-based suggestions
    if (health && health.medicalInfo) {
      const mi = health.medicalInfo;

      if (parseInt(mi.bloodSugar) > 140) {
        suggestions.push({
          type: 'warning',
          priority: 'high',
          title: '⚠️ High Blood Sugar',
          description: 'Your recent blood sugar reading is elevated. Consider consulting with an endocrinologist and review your diet.'
        });
      }

      if (mi.bloodPressure && mi.bloodPressure.split('/')[0] > 140) {
        suggestions.push({
          type: 'warning',
          priority: 'high',
          title: '⚠️ High Blood Pressure',
          description: 'Monitor your stress levels and reduce salt intake. Schedule a follow-up appointment.'
        });
      }

      if (parseInt(mi.temperature) > 37.5) {
        suggestions.push({
          type: 'alert',
          priority: 'high',
          title: '🌡️ Elevated Temperature',
          description: 'You may have a fever. Rest and stay hydrated. Seek medical attention if it persists.'
        });
      }
    }

    // Appointment frequency
    if (appointmentsData.length > 5) {
      suggestions.push({
        type: 'info',
        priority: 'medium',
        title: '📅 Regular Check-ups',
        description: 'You are maintaining regular appointments. Keep up with preventive care!'
      });
    }

    // Prescription refills
    const userPrescriptions = this.getPrescriptionsByUser(email);
    userPrescriptions.forEach(p => {
      if (p.refillsRemaining && p.refillsRemaining <= 1) {
        suggestions.push({
          type: 'notice',
          priority: 'high',
          title: '💊 Prescription Due for Refill',
          description: `Your ${p.medicationName} prescription is running low. Contact your doctor soon.`
        });
      }
    });

    // Vaccination suggestions
    const vaccinationsData = this.getVaccinations(email);
    if (vaccinationsData.length === 0) {
      suggestions.push({
        type: 'info',
        priority: 'medium',
        title: '💉 Vaccination Record',
        description: 'No vaccination records found. Visit your doctor for routine immunizations.'
      });
    }

    // Lifestyle suggestions
    if (!this.getFitnessData(email).length) {
      suggestions.push({
        type: 'tip',
        priority: 'low',
        title: '🏃 Stay Active',
        description: 'Try to exercise for at least 30 minutes daily to maintain good health.'
      });
    }

    return suggestions;
  },

  // ============ HEALTH REPORTS FUNCTIONS ============
  addHealthReport: function(reportData) {
    const newReport = {
      ...reportData,
      id: 'report_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
      createdAt: new Date()
    };
    healthReports.push(newReport);
    console.log(`✅ Health report added: ${newReport.reportType} for ${reportData.patientEmail}`);
    return newReport;
  },

  getHealthReportById: function(reportId) {
    return healthReports.find(r => r.id === reportId);
  },

  getHealthReportsByUser: function(email) {
    return healthReports.filter(r => r.patientEmail === email);
  },

  getHealthReportsByType: function(email, type) {
    return healthReports.filter(r => r.patientEmail === email && r.reportType === type);
  },

  updateHealthReport: function(reportId, updates) {
    const report = this.getHealthReportById(reportId);
    if (report) {
      Object.assign(report, updates);
      report.updatedAt = new Date();
      console.log(`✅ Health report updated: ${reportId}`);
    }
    return report;
  },

  deleteHealthReport: function(reportId) {
    const index = healthReports.findIndex(r => r.id === reportId);
    if (index > -1) {
      const report = healthReports[index];
      healthReports.splice(index, 1);
      console.log(`✅ Health report deleted: ${reportId}`);
      return true;
    }
    return false;
  },

  getHealthReportSummary: function(email) {
    const userReports = this.getHealthReportsByUser(email);
    const reportTypes = {};
    const byMonth = {};

    userReports.forEach(report => {
      reportTypes[report.reportType] = (reportTypes[report.reportType] || 0) + 1;
      
      const month = new Date(report.generatedAt).toISOString().substr(0, 7);
      byMonth[month] = (byMonth[month] || 0) + 1;
    });

    return {
      email,
      totalReports: userReports.length,
      reportsByType: reportTypes,
      reportsByMonth: byMonth,
      latestReport: userReports.length > 0 
        ? userReports.sort((a, b) => new Date(b.generatedAt) - new Date(a.generatedAt))[0]
        : null
    };
  },

  // ============ ANALYTICS FUNCTIONS ============
  getAnalyticsDashboard: function() {
    const topSymptoms = {};
    appointments.forEach(apt => {
      if (apt.symptoms) {
        const symptomArray = typeof apt.symptoms === 'string' 
          ? apt.symptoms.split(',') 
          : [apt.symptoms];
        symptomArray.forEach(symptom => {
          topSymptoms[symptom.trim()] = (topSymptoms[symptom.trim()] || 0) + 1;
        });
      }
    });

    const appointmentStatus = {
      completed: appointments.filter(a => a.status === 'completed').length,
      pending: appointments.filter(a => a.status === 'pending').length,
      cancelled: appointments.filter(a => a.status === 'cancelled').length
    };

    return {
      topSymptoms: Object.entries(topSymptoms)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10),
      appointmentTrend: appointments.length,
      userGrowth: users.length,
      appointmentStatus
    };
  }
};
