import fetch from 'node-fetch';

const API_BASE_URL = 'http://localhost:5000/api';
const testEmail = 'persistence-test@test.com';
const testPassword = 'TestPass@123';

const tests = [];

// Test 1: Signup (creates new user in database)
const testSignup = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: testEmail,
        password: testPassword,
        role: 'patient'
      })
    });
    const data = await response.json();
    tests.push({
      name: '1. Signup - Create User',
      status: data.success ? '✅ PASS' : '❌ FAIL',
      details: data.success ? `User created: ${testEmail}` : data.error
    });
  } catch (err) {
    tests.push({
      name: '1. Signup - Create User',
      status: '❌ ERROR',
      details: err.message
    });
  }
};

// Test 2: Login (retrieve saved user)
const testLogin = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: testEmail,
        password: testPassword,
        role: 'patient'
      })
    });
    const data = await response.json();
    tests.push({
      name: '2. Login - Retrieve Saved User',
      status: data.success ? '✅ PASS' : '❌ FAIL',
      details: data.success ? `Login successful for ${testEmail}` : data.error
    });
  } catch (err) {
    tests.push({
      name: '2. Login - Retrieve Saved User',
      status: '❌ ERROR',
      details: err.message
    });
  }
};

// Test 3: Record Medical Information
const testMedicalInfo = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/health/medical-record`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        patientEmail: testEmail,
        bloodPressure: '125/85',
        bloodSugar: 105,
        temperature: 98.6,
        weight: 170,
        height: 72,
        notes: 'Regular checkup'
      })
    });
    const data = await response.json();
    tests.push({
      name: '3. Medical Records - Save Vitals',
      status: data.success ? '✅ PASS' : '❌ FAIL',
      details: data.success ? 'Vitals saved to database' : data.error
    });
  } catch (err) {
    tests.push({
      name: '3. Medical Records - Save Vitals',
      status: '❌ ERROR',
      details: err.message
    });
  }
};

// Test 4: Retrieve Saved Medical Information
const testGetHealthDashboard = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/health/health-dashboard?email=${testEmail}`);
    const data = await response.json();
    const hasSavedData = data.data?.healthRecord?.medicalInfo?.bloodPressure === '125/85';
    tests.push({
      name: '4. Health Dashboard - Retrieve Saved Data',
      status: hasSavedData ? '✅ PASS' : '❌ FAIL',
      details: hasSavedData ? 'Medical data persisted in database' : 'Data not found in database'
    });
  } catch (err) {
    tests.push({
      name: '4. Health Dashboard - Retrieve Saved Data',
      status: '❌ ERROR',
      details: err.message
    });
  }
};

// Test 5: Book Appointment
const testBookAppointment = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/appointments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        patientEmail: testEmail,
        doctorId: 1,
        appointmentDate: '2026-04-15',
        appointmentTime: '10:00',
        symptoms: 'Headache, Fever',
        notes: 'Test appointment'
      })
    });
    const data = await response.json();
    tests.push({
      name: '5. Appointments - Book Appointment',
      status: data.success ? '✅ PASS' : '❌ FAIL',
      details: data.success ? 'Appointment saved to database' : data.error
    });
  } catch (err) {
    tests.push({
      name: '5. Appointments - Book Appointment',
      status: '❌ ERROR',
      details: err.message
    });
  }
};

// Test 6: Retrieve Saved Appointments
const testGetAppointments = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/appointments?email=${testEmail}`);
    const data = await response.json();
    const hasSavedAppointment = data.data?.length > 0;
    tests.push({
      name: '6. Appointments - Retrieve Saved Appointments',
      status: hasSavedAppointment ? '✅ PASS' : '❌ FAIL',
      details: hasSavedAppointment ? `${data.data.length} appointment(s) found in database` : 'No appointments found'
    });
  } catch (err) {
    tests.push({
      name: '6. Appointments - Retrieve Saved Appointments',
      status: '❌ ERROR',
      details: err.message
    });
  }
};

// Test 7: Record Prescription
const testPrescription = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/health/prescription`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        patientEmail: testEmail,
        medication: 'Aspirin',
        dosage: '500mg',
        frequency: 'Twice daily',
        duration: '7 days',
        refillsRemaining: 2
      })
    });
    const data = await response.json();
    tests.push({
      name: '7. Prescriptions - Save Prescription',
      status: data.success ? '✅ PASS' : '❌ FAIL',
      details: data.success ? 'Prescription saved to database' : data.error
    });
  } catch (err) {
    tests.push({
      name: '7. Prescriptions - Save Prescription',
      status: '❌ ERROR',
      details: err.message
    });
  }
};

// Test 8: Generate Health Report
const testHealthReport = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/reports/reports`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        patientEmail: testEmail,
        reportType: 'medical',
        description: 'Monthly health check report',
        reportDate: '2026-04-08'
      })
    });
    const data = await response.json();
    tests.push({
      name: '8. Health Reports - Generate Report',
      status: data.success ? '✅ PASS' : '❌ FAIL',
      details: data.success ? 'Health report saved to database' : data.error
    });
  } catch (err) {
    tests.push({
      name: '8. Health Reports - Generate Report',
      status: '❌ ERROR',
      details: err.message
    });
  }
};

// Run all tests
const runTests = async () => {
  console.log('\n🔧 BACKEND DATA PERSISTENCE TEST SUITE\n');
  console.log('Testing if all frontend operations save data to backend database...\n');

  await testSignup();
  await testLogin();
  await testMedicalInfo();
  await testGetHealthDashboard();
  await testBookAppointment();
  await testGetAppointments();
  await testPrescription();
  await testHealthReport();

  // Print results
  console.log('📊 TEST RESULTS:\n');
  tests.forEach((test, idx) => {
    console.log(`${test.status} - ${test.name}`);
    console.log(`   └─ ${test.details}\n`);
  });

  const passedTests = tests.filter(t => t.status.includes('✅')).length;
  console.log(`\n📈 Summary: ${passedTests}/${tests.length} tests passed\n`);
};

runTests();
