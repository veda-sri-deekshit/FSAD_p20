// Appointment Controller - Uses updated database functions
import { db } from '../database.js';

// Get all available doctors
export const getDoctors = (req, res) => {
  try {
    res.json({
      success: true,
      data: db.doctors,
    });
  } catch (error) {
    console.error('Get doctors error:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// Get doctor by ID with available slots
export const getDoctorById = (req, res) => {
  try {
    const { doctorId } = req.params;
    const doctor = db.getDoctorById(parseInt(doctorId));

    if (!doctor) {
      return res.status(404).json({
        success: false,
        error: 'Doctor not found',
      });
    }

    res.json({
      success: true,
      data: doctor,
    });
  } catch (error) {
    console.error('Get doctor by ID error:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// Book an appointment - Saves to database
export const bookAppointment = (req, res) => {
  try {
    const { patientEmail, doctorId, appointmentDate, appointmentTime, symptoms, notes } = req.body;

    // Validation
    if (!patientEmail || !doctorId || !appointmentDate || !appointmentTime) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: patientEmail, doctorId, appointmentDate, appointmentTime',
      });
    }

    const doctor = db.getDoctorById(parseInt(doctorId));
    if (!doctor) {
      return res.status(404).json({
        success: false,
        error: 'Doctor not found',
      });
    }

    // Check if slot is available
    const existingAppointment = db.appointments.find(
      (apt) => apt.doctorId === parseInt(doctorId) && 
               apt.appointmentDate === appointmentDate && 
               apt.appointmentTime === appointmentTime &&
               apt.status !== 'cancelled'
    );

    if (existingAppointment) {
      return res.status(409).json({
        success: false,
        error: 'This time slot is already booked',
      });
    }

    // Create and save appointment using database function
    const appointment = db.addAppointment({
      patientEmail,
      doctorId: parseInt(doctorId),
      doctorName: doctor.name,
      appointmentDate,
      appointmentTime,
      symptoms: symptoms || '',
      notes: notes || ''
    });

    console.log(`✅ Appointment booked: ${patientEmail} with Doctor ${doctor.name}`);

    res.status(201).json({
      success: true,
      message: 'Appointment booked successfully',
      data: appointment,
    });
  } catch (error) {
    console.error('Book appointment error:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// Get all appointments (for a patient or all)
export const getAppointments = (req, res) => {
  try {
    const { email } = req.query;

    let result;
    if (email) {
      result = db.getAppointmentsByUser(email);
      console.log(`Retrieved ${result.length} appointments for ${email}`);
    } else {
      result = db.appointments;
    }

    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error('Get appointments error:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// Get appointment by ID
export const getAppointmentById = (req, res) => {
  try {
    const { appointmentId } = req.params;
    const appointment = db.appointments.find((apt) => apt.id === parseInt(appointmentId));

    if (!appointment) {
      return res.status(404).json({
        success: false,
        error: 'Appointment not found',
      });
    }

    res.json({
      success: true,
      data: appointment,
    });
  } catch (error) {
    console.error('Get appointment by ID error:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// Cancel appointment
export const cancelAppointment = (req, res) => {
  try {
    const { appointmentId } = req.params;
    const appointment = db.updateAppointmentStatus(parseInt(appointmentId), 'cancelled');

    if (!appointment) {
      return res.status(404).json({
        success: false,
        error: 'Appointment not found',
      });
    }

    console.log(`✅ Appointment ${appointmentId} cancelled`);

    res.json({
      success: true,
      message: 'Appointment cancelled successfully',
      data: appointment,
    });
  } catch (error) {
    console.error('Cancel appointment error:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// Get available time slots for a specific doctor and date
export const getAvailableSlots = (req, res) => {
  try {
    const { doctorId, date } = req.query;

    if (!doctorId || !date) {
      return res.status(400).json({
        success: false,
        error: 'doctorId and date are required',
      });
    }

    const doctor = db.getDoctorById(parseInt(doctorId));
    if (!doctor) {
      return res.status(404).json({
        success: false,
        error: 'Doctor not found',
      });
    }

    // Get booked slots for this doctor on this date
    const bookedSlots = db.appointments
      .filter((apt) => apt.doctorId === parseInt(doctorId) && 
                       apt.appointmentDate === date && 
                       apt.status !== 'cancelled')
      .map((apt) => apt.appointmentTime);

    // Filter available slots
    const availableSlots = doctor.availableSlots.filter((slot) => !bookedSlots.includes(slot));

    res.json({
      success: true,
      data: {
        doctorId: parseInt(doctorId),
        date,
        availableSlots,
      },
    });
  } catch (error) {
    console.error('Get available slots error:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// Get pending appointments for a doctor
export const getDoctorAppointments = (req, res) => {
  try {
    const { doctorEmail } = req.query;

    if (!doctorEmail) {
      return res.status(400).json({
        success: false,
        error: 'doctorEmail is required',
      });
    }

    // Get all appointments for this doctor (via their email matching doctor name or id)
    const appointments = db.appointments.filter(apt => {
      // Filter by pending or accepted status
      return (apt.status === 'pending' || apt.status === 'accepted');
    });

    res.json({
      success: true,
      data: appointments,
    });
  } catch (error) {
    console.error('Get doctor appointments error:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// Accept appointment (doctor)
export const acceptAppointment = (req, res) => {
  try {
    const { appointmentId } = req.params;

    const appointment = db.updateAppointmentStatus(parseInt(appointmentId), 'accepted');

    if (!appointment) {
      return res.status(404).json({
        success: false,
        error: 'Appointment not found',
      });
    }

    console.log(`✅ Appointment ${appointmentId} accepted by doctor`);

    res.json({
      success: true,
      message: 'Appointment accepted successfully',
      data: appointment,
    });
  } catch (error) {
    console.error('Accept appointment error:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// Reject/decline appointment (doctor)
export const rejectAppointment = (req, res) => {
  try {
    const { appointmentId } = req.params;
    const { reason } = req.body;

    const appointment = db.updateAppointmentStatus(parseInt(appointmentId), 'rejected');

    if (!appointment) {
      return res.status(404).json({
        success: false,
        error: 'Appointment not found',
      });
    }

    // Store rejection reason
    if (appointment) {
      appointment.rejectionReason = reason || 'No reason provided';
    }

    console.log(`❌ Appointment ${appointmentId} rejected by doctor`);

    res.json({
      success: true,
      message: 'Appointment rejected',
      data: appointment,
    });
  } catch (error) {
    console.error('Reject appointment error:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};
