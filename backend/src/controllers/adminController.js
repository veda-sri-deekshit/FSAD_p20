import { db } from '../database.js';

export const getDashboardStats = (req, res) => {
  const totalUsers = db.users.length;
  const totalAppointments = db.appointments.length;
  const totalHealthRecords = db.healthRecords.length;
  const doctorCount = db.doctors.length;
  
  const patientCount = db.users.filter(u => u.role === 'patient').length;
  const doctorCountByRole = db.users.filter(u => u.role === 'doctor').length;
  const pharmacistCount = db.users.filter(u => u.role === 'pharmacist').length;

  const appointmentStats = {
    completed: db.appointments.filter(a => a.status === 'completed').length,
    pending: db.appointments.filter(a => a.status === 'pending').length,
    cancelled: db.appointments.filter(a => a.status === 'cancelled').length,
  };

  res.json({
    success: true,
    data: {
      totalUsers,
      patientCount,
      doctorCountByRole,
      pharmacistCount,
      totalAppointments,
      appointmentStats,
      totalHealthRecords,
      doctorCount,
      systemUptime: process.uptime(),
      timestamp: new Date().toISOString()
    }
  });
};

export const getAnalytics = (req, res) => {
  const dailyAppointments = {};
  db.appointments.forEach(apt => {
    const date = apt.appointmentDate;
    dailyAppointments[date] = (dailyAppointments[date] || 0) + 1;
  });

  const topDoctors = {};
  db.appointments.forEach(apt => {
    topDoctors[apt.doctorId] = (topDoctors[apt.doctorId] || 0) + 1;
  });

  const topSymptoms = {};
  db.healthRecords.forEach(record => {
    if (record.symptoms) {
      record.symptoms.forEach(symptom => {
        topSymptoms[symptom] = (topSymptoms[symptom] || 0) + 1;
      });
    }
  });

  res.json({
    success: true,
    data: {
      dailyAppointments,
      topDoctors,
      topSymptoms,
      userGrowth: db.users.length,
      appointmentTrend: db.appointments.length
    }
  });
};

export const getAllUsers = (req, res) => {
  const users = db.users.map(u => ({
    id: u.id,
    email: u.email,
    role: u.role,
    registeredAt: u.registeredAt || 'N/A',
    stats: u.stats || {}
  }));

  res.json({
    success: true,
    data: {
      totalCount: users.length,
      users
    }
  });
};

export const getAllAppointments = (req, res) => {
  const appointments = db.appointments.map(apt => ({
    id: apt.id,
    patientEmail: apt.patientEmail,
    doctorId: apt.doctorId,
    appointmentDate: apt.appointmentDate,
    appointmentTime: apt.appointmentTime,
    status: apt.status,
    symptoms: apt.symptoms,
    notes: apt.notes,
    rejectionReason: apt.rejectionReason
  }));

  res.json({
    success: true,
    data: {
      totalCount: appointments.length,
      appointments
    }
  });
};

export const getAllHealthRecords = (req, res) => {
  const records = db.healthRecords.map(record => ({
    patientEmail: record.patientEmail,
    medicalInfo: record.medicalInfo || {},
    prescriptions: record.prescriptions || [],
    recordCount: (record.medicalInfo ? 1 : 0) + (record.prescriptions ? record.prescriptions.length : 0)
  }));

  res.json({
    success: true,
    data: {
      totalCount: records.length,
      records
    }
  });
};

export const getDoctorsList = (req, res) => {
  const doctors = db.doctors.map(doc => ({
    id: doc.id,
    name: doc.name,
    specialty: doc.specialty,
    availableSlots: doc.availableSlots || [],
    appointmentCount: db.appointments.filter(a => a.doctorId === doc.id).length
  }));

  res.json({
    success: true,
    data: {
      totalCount: doctors.length,
      doctors
    }
  });
};

export const getSystemHealth = (req, res) => {
  const memoryUsage = process.memoryUsage();
  
  res.json({
    success: true,
    data: {
      uptime: Math.floor(process.uptime()),
      memory: {
        heapUsed: Math.round(memoryUsage.heapUsed / 1024 / 1024) + ' MB',
        heapTotal: Math.round(memoryUsage.heapTotal / 1024 / 1024) + ' MB',
        rss: Math.round(memoryUsage.rss / 1024 / 1024) + ' MB'
      },
      timestamp: new Date().toISOString(),
      nodeVersion: process.version,
      platform: process.platform
    }
  });
};
