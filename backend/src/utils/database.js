// In-memory database for the application
// In production, this would be a real database like MongoDB or PostgreSQL

export const database = {
  users: [],
  appointments: [],
  medicalRecords: [],
  prescriptions: [],
  healthHistory: [],
  userStats: {}
};

// Add a user
export const addUser = (user) => {
  database.users.push(user);
  database.userStats[user.id] = {
    totalAppointments: 0,
    lastVisit: null,
    symptoms: [],
    prescriptions: []
  };
  return user;
};

// Get user by email
export const getUserByEmail = (email) => {
  return database.users.find(u => u.email === email);
};

// Add appointment record
export const addAppointmentRecord = (appointment) => {
  database.appointments.push(appointment);
  
  // Update user stats
  const user = getUserByEmail(appointment.patientEmail);
  if (user && database.userStats[user.id]) {
    database.userStats[user.id].totalAppointments++;
    database.userStats[user.id].lastVisit = appointment.date;
    if (!database.userStats[user.id].symptoms.includes(appointment.symptoms)) {
      database.userStats[user.id].symptoms.push(appointment.symptoms);
    }
  }
  
  return appointment;
};

// Add medical record
export const addMedicalRecord = (record) => {
  database.medicalRecords.push(record);
  return record;
};

// Add prescription record
export const addPrescription = (prescription) => {
  database.prescriptions.push(prescription);
  
  // Update user stats
  const user = getUserByEmail(prescription.patientEmail);
  if (user && database.userStats[user.id]) {
    if (!database.userStats[user.id].prescriptions.includes(prescription.medication)) {
      database.userStats[user.id].prescriptions.push(prescription.medication);
    }
  }
  
  return prescription;
};

// Get user health data
export const getUserHealthData = (email) => {
  const userAppointments = database.appointments.filter(a => a.patientEmail === email);
  const userPrescriptions = database.prescriptions.filter(p => p.patientEmail === email);
  const userRecords = database.medicalRecords.filter(r => r.patientEmail === email);
  
  return {
    appointments: userAppointments,
    prescriptions: userPrescriptions,
    medicalRecords: userRecords,
    stats: database.userStats[email] || {}
  };
};

// Get all appointments (admin view)
export const getAllAppointments = () => {
  return database.appointments;
};

// Get all users (admin view)
export const getAllUsers = () => {
  return database.users;
};

// Generate health suggestions based on symptoms and history
export const generateHealthSuggestions = (email) => {
  const userData = getUserHealthData(email);
  const suggestions = [];
  
  // Symptom-based suggestions
  const symptomSuggestions = {
    'fever': 'Schedule a consultation with a general physician. Stay hydrated and rest.',
    'headache': 'Consider visiting a neurologist if headaches persist. Take regular breaks from screens.',
    'cough': 'Visit a pulmonologist or chest specialist. Avoid smoke and pollutants.',
    'fatigue': 'Check your thyroid levels and vitamin D. Ensure adequate rest and nutrition.',
    'back pain': 'Consult an orthopedic specialist. Practice regular stretching and maintain good posture.',
    'high blood pressure': 'Visit a cardiologist. Reduce salt intake and exercise regularly.',
    'diabetes': 'Consult an endocrinologist. Monitor blood sugar levels and follow a healthy diet.',
    'anxiety': 'Speak with a psychiatrist or counselor. Practice meditation and stress management.',
    'sleep issues': 'Consider sleep study. Maintain regular sleep schedule and avoid screens before bed.',
    'digestion': 'Consult a gastroenterologist. Eat slowly and avoid spicy food.'
  };
  
  // Add symptom-specific suggestions
  if (userData.appointments.length > 0) {
    const recentSymptoms = userData.appointments.slice(-5).map(a => a.symptoms.toLowerCase());
    for (const symptom of recentSymptoms) {
      for (const [key, value] of Object.entries(symptomSuggestions)) {
        if (symptom.includes(key.toLowerCase())) {
          suggestions.push({
            type: 'symptom-based',
            symptom: key,
            suggestion: value,
            priority: 'high'
          });
        }
      }
    }
  }
  
  // Prescription refill reminders
  for (const prescription of userData.prescriptions) {
    if (prescription.refillsRemaining <= 1) {
      suggestions.push({
        type: 'prescription-refill',
        medication: prescription.medication,
        suggestion: `Time to refill ${prescription.medication}. Contact your doctor or pharmacy.`,
        priority: 'high'
      });
    }
  }
  
  // Preventive care suggestions
  if (userData.appointments.length === 1) {
    suggestions.push({
      type: 'preventive',
      suggestion: 'Schedule regular check-ups for preventive care.',
      priority: 'medium'
    });
  }
  
  // Doctor recommendations based on frequency
  const doctorFrequency = {};
  userData.appointments.forEach(a => {
    doctorFrequency[a.doctorId] = (doctorFrequency[a.doctorId] || 0) + 1;
  });
  
  const topDoctor = Object.keys(doctorFrequency).sort((a, b) => doctorFrequency[b] - doctorFrequency[a])[0];
  if (topDoctor) {
    suggestions.push({
      type: 'doctor-recommendation',
      suggestion: `You've had good interactions with this doctor. Consider scheduling a follow-up.`,
      priority: 'medium'
    });
  }
  
  // Lifestyle suggestions based on appointment frequency
  if (userData.appointments.length > 5) {
    suggestions.push({
      type: 'lifestyle',
      suggestion: 'Consider incorporating regular exercise and balanced diet for preventive health.',
      priority: 'low'
    });
  }
  
  return suggestions;
};

// Get analytics dashboard data
export const getAnalyticsDashboard = () => {
  return {
    totalUsers: database.users.length,
    totalAppointments: database.appointments.length,
    totalPrescriptions: database.prescriptions.length,
    topSymptoms: getTopSymptoms(),
    appointmentsByStatus: getAppointmentsByStatus(),
    userGrowth: getUserGrowth()
  };
};

// Get top symptoms from appointments
const getTopSymptoms = () => {
  const symptomCount = {};
  database.appointments.forEach(a => {
    const symptoms = a.symptoms.split(',').map(s => s.trim());
    symptoms.forEach(symptom => {
      symptomCount[symptom] = (symptomCount[symptom] || 0) + 1;
    });
  });
  
  return Object.entries(symptomCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([symptom, count]) => ({ symptom, count }));
};

// Get appointments by status
const getAppointmentsByStatus = () => {
  const statusCount = {
    pending: 0,
    completed: 0,
    cancelled: 0
  };
  
  database.appointments.forEach(a => {
    statusCount[a.status] = (statusCount[a.status] || 0) + 1;
  });
  
  return statusCount;
};

// Get user growth over time
const getUserGrowth = () => {
  const growth = {};
  database.users.forEach(u => {
    const date = new Date(u.createdAt).toLocaleDateString();
    growth[date] = (growth[date] || 0) + 1;
  });
  
  return growth;
};
