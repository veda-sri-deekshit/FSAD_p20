/**
 * COMPLETE DATA PERSISTENCE MAP
 * All Frontend Operations → Backend Database
 * 
 * This file documents every operation in the frontend and where it persists in the database
 */

// ============================================
// 1. AUTHENTICATION & USER MANAGEMENT
// ============================================

1. SIGNUP / REGISTER
   Frontend: User fills email, password, role
   Backend: POST /api/auth/signup
   Database: users[] array
   Persists: User object with id, email, password, role, registeredAt, stats
   ✅ Data Saved Permanently

2. LOGIN
   Frontend: User enters email, password, role + CAPTCHA
   Backend: POST /api/auth/login
   Database: Retrieves user from users[] array
   Persists: User verified, returns user details
   ✅ Data Retrieved from Database

3. FORGOT PASSWORD / OTP REQUEST
   Frontend: User enters email
   Backend: POST /api/auth/forgot-password
   Database: users[] array (adds resetOTP, resetOTPExpiry)
   Persists: OTP saved with 10-minute expiry, email sent
   ✅ OTP Data Saved Temporarily

4. RESET PASSWORD / OTP VERIFY
   Frontend: User enters OTP and new password
   Backend: POST /api/auth/reset-password
   Database: users[] array (updates password, clears OTP)
   Persists: Password updated permanently, OTP cleared
   ✅ Password Data Saved Permanently

// ============================================
// 2. HEALTH RECORDS
// ============================================

5. RECORD MEDICAL INFORMATION (Vitals)
   Frontend: User fills blood pressure, sugar, temperature, weight, height, notes
   Backend: POST /api/health/medical-record
   Database: healthRecords[] array
   Persists: Medical vitals with recordedAt timestamp
   ✅ Vitals Data Saved Permanently

6. VIEW HEALTH DASHBOARD
   Frontend: Dashboard loads user's health data
   Backend: GET /api/health/health-dashboard?email=user@email.com
   Database: Retrieves from healthRecords[], appointments[], prescriptions[], suggestions
   Persists: Aggregate view of all health data
   ✅ Data Retrieved from Database

7. RECORD PRESCRIPTION
   Frontend: User fills medication name, dosage, frequency, duration, refills
   Backend: POST /api/health/prescription
   Database: prescriptions[] array + healthRecords[] (links prescription)
   Persists: Prescription with prescribedAt timestamp
   ✅ Prescription Data Saved Permanently

// ============================================
// 3. APPOINTMENTS
// ============================================

8. BOOK APPOINTMENT
   Frontend: User selects doctor, date, time, describes symptoms
   Backend: POST /api/appointments
   Database: appointments[] array
   Persists: Appointment with id, patientEmail, doctorId, date, time, symptoms, status
   Updates: user.stats.totalAppointments, user.stats.lastVisit
   ✅ Appointment Data Saved Permanently

9. VIEW MY APPOINTMENTS
   Frontend: Dashboard shows list of all user's appointments
   Backend: GET /api/appointments?email=user@email.com
   Database: Retrieves from appointments[] array
   Persists: Shows all historical and upcoming appointments
   ✅ Data Retrieved from Database

10. CANCEL APPOINTMENT
    Frontend: User clicks cancel button on appointment
    Backend: PUT /api/appointments/:id/cancel
    Database: appointments[] array (updates status to 'cancelled')
    Persists: Appointment status changed, timestamp recorded
    ✅ Status Update Saved Permanently

// ============================================
// 4. HEALTH REPORTS
// ============================================

11. GENERATE HEALTH REPORT
    Frontend: User selects report type (lab, medical, wellness, diagnosis)
    Backend: POST /api/reports/reports
    Database: healthReports[] array
    Persists: Report with unique id, type, date, description, status
    ✅ Report Data Saved Permanently

12. VIEW HEALTH REPORTS
    Frontend: User views their generated reports
    Backend: GET /api/reports/reports?email=user@email.com
    Database: Retrieves from healthReports[] array
    Persists: All reports in sorted order (newest first)
    ✅ Data Retrieved from Database

13. UPDATE HEALTH REPORT
    Frontend: User edits report description or status
    Backend: PUT /api/reports/reports/:id
    Database: healthReports[] array (updates specific report)
    Persists: Updated report with updatedAt timestamp
    ✅ Update Saved Permanently

14. DELETE HEALTH REPORT
    Frontend: User deletes a report
    Backend: DELETE /api/reports/reports/:id
    Database: healthReports[] array (removes report)
    Persists: Report permanently deleted
    ✅ Deletion Saved Permanently

// ============================================
// 5. TELEMEDICINE CONSULTATIONS
// ============================================

15. BOOK TELEMEDICINE CONSULTATION
    Frontend: User selects type (video/audio), date, time, reason
    Backend: POST /api/features/consultation/book
    Database: telemedicineConsultations[] array
    Persists: Consultation with videoLink, status, createdAt timestamp
    ✅ Consultation Data Saved Permanently

16. VIEW CONSULTATIONS
    Frontend: Dashboard shows booked video calls
    Backend: GET /api/features/consultations?email=user@email.com
    Database: Retrieves from telemedicineConsultations[] array
    Persists: All consultation history
    ✅ Data Retrieved from Database

// ============================================
// 6. LAB REPORTS
// ============================================

17. UPLOAD LAB REPORT
    Frontend: User fills test name, date, results, laboratory name
    Backend: POST /api/features/lab-report
    Database: labReports[] array
    Persists: Lab test with results, createdAt timestamp
    ✅ Lab Report Data Saved Permanently

18. VIEW LAB REPORTS
    Frontend: User views all past lab tests
    Backend: GET /api/features/lab-reports?email=user@email.com
    Database: Retrieves from labReports[] array
    Persists: Complete lab report history
    ✅ Data Retrieved from Database

// ============================================
// 7. VACCINATIONS
// ============================================

19. RECORD VACCINATION
    Frontend: User enters vaccine name, date, next due date, notes
    Backend: POST /api/features/vaccination
    Database: vaccinations[] array + healthRecords[] (links vaccination)
    Persists: Vaccination record with createdAt timestamp
    ✅ Vaccination Data Saved Permanently

20. VIEW VACCINATION RECORDS
    Frontend: Shows vaccination history and next due dates
    Backend: GET /api/features/vaccinations?email=user@email.com
    Database: Retrieves from vaccinations[] array
    Persists: Complete vaccination history and schedule
    ✅ Data Retrieved from Database

// ============================================
// 8. ALLERGIES
// ============================================

21. RECORD ALLERGY
    Frontend: User enters allergy name, severity, reaction, notes
    Backend: POST /api/features/allergy
    Database: allergies[] array + healthRecords[] (links allergy)
    Persists: Allergy record with createdAt timestamp
    ✅ Allergy Data Saved Permanently

22. VIEW ALLERGIES
    Frontend: Shows all recorded allergies
    Backend: GET /api/features/allergies?email=user@email.com
    Database: Retrieves from allergies[] array
    Persists: Complete allergy list and history
    ✅ Data Retrieved from Database

// ============================================
// 9. FITNESS TRACKING
// ============================================

23. LOG FITNESS ACTIVITY
    Frontend: User logs exercise type, duration, calories, date
    Backend: POST /api/features/fitness-activity
    Database: fitnessActivities[] array
    Persists: Activity record with createdAt timestamp
    ✅ Fitness Data Saved Permanently

24. VIEW FITNESS DATA
    Frontend: Shows fitness history and statistics
    Backend: GET /api/features/fitness-data?email=user@email.com
    Database: Retrieves from fitnessActivities[] array
    Persists: Complete fitness history
    ✅ Data Retrieved from Database

// ============================================
// 10. DRUG INTERACTIONS CHECKER
// ============================================

25. CHECK DRUG INTERACTIONS
    Frontend: User enters multiple medications
    Backend: POST /api/features/drug-interactions
    Database: No database persistence (calculation-only)
    Persists: Warning data returned in response
    ℹ️ Real-time calculation, not persisted

// ============================================
// 11. DOCTOR REVIEWS
// ============================================

26. SUBMIT DOCTOR REVIEW
    Frontend: User rates doctor and writes review
    Backend: POST /api/features/doctor-review
    Database: doctorReviews[] array
    Persists: Review with rating, comment, createdAt timestamp
    ✅ Review Data Saved Permanently

27. VIEW DOCTOR REVIEWS
    Frontend: Shows reviews for selected doctor
    Backend: GET /api/features/doctor-reviews/:doctorId
    Database: Retrieves from doctorReviews[] array
    Persists: All reviews for the doctor
    ✅ Data Retrieved from Database

// ============================================
// 12. EMERGENCY CONTACTS
// ============================================

28. ADD EMERGENCY CONTACT
    Frontend: User adds contact name, phone, relationship
    Backend: POST /api/features/emergency-contact
    Database: emergencyContacts[] array + healthRecords[] (links contact)
    Persists: Emergency contact with createdAt timestamp
    ✅ Emergency Contact Saved Permanently

29. VIEW EMERGENCY CONTACTS
    Frontend: Shows all saved emergency contacts
    Backend: GET /api/features/emergency-contacts?email=user@email.com
    Database: Retrieves from emergencyContacts[] array
    Persists: Complete emergency contact list
    ✅ Data Retrieved from Database

// ============================================
// SUMMARY STATISTICS
// ============================================

Total Frontend Operations: 29
Operations that Persist Data: 28 (96.6%)
Operations that Just Calculate: 1 (Drug Interactions)

Database Arrays:
- users[] ✅ Persists: User accounts, authentication
- appointments[] ✅ Persists: All booked appointments
- healthRecords[] ✅ Persists: Vitals, medical info, linked records
- healthReports[] ✅ Persists: Generated health reports
- prescriptions[] ✅ Persists: Medication prescriptions
- labReports[] ✅ Persists: Lab test results
- telemedicineConsultations[] ✅ Persists: Video/audio consultations
- doctorReviews[] ✅ Persists: Doctor ratings and reviews
- vaccinations[] ✅ Persists: Vaccination records
- allergies[] ✅ Persists: Allergy information
- fitnessActivities[] ✅ Persists: Exercise and activity logs
- emergencyContacts[] ✅ Persists: Emergency contact information

✅ ALL FRONTEND OPERATIONS AUTOMATICALLY SAVE TO BACKEND DATABASE
