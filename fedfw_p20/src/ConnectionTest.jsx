import React, { useState, useEffect } from 'react';

const ConnectionTest = () => {
  const [results, setResults] = useState({
    backendStatus: 'Testing...',
    apiConnection: 'Testing...',
    adminDashboard: 'Testing...',
    authEndpoint: 'Testing...',
    appointmentEndpoint: 'Testing...',
    healthEndpoint: 'Testing...',
    doctorsEndpoint: 'Testing...'
  });

  const API_BASE_URL = 'http://localhost:5002/api';
  const BACKEND_URL = 'http://localhost:5002';

  const testBackend = async () => {
    // Test 1: Basic backend connectivity
    try {
      const response = await fetch(BACKEND_URL);
      setResults(prev => ({
        ...prev,
        backendStatus: response.ok ? '✅ Backend Running' : '❌ Backend Error'
      }));
    } catch {
      setResults(prev => ({
        ...prev,
        backendStatus: '❌ Backend Not Responding'
      }));
    }

    // Test 2: Admin API
    try {
      const response = await fetch(`${BACKEND_URL}/api/admin/stats`);
      const data = await response.json();
      setResults(prev => ({
        ...prev,
        apiConnection: response.ok ? `✅ Connected (${data.data?.totalUsers || 0} users)` : '❌ API Error'
      }));
    } catch {
      setResults(prev => ({
        ...prev,
        apiConnection: '❌ Cannot reach API'
      }));
    }

    // Test 3: Admin Dashboard
    try {
      const response = await fetch(`${BACKEND_URL}/admin`);
      setResults(prev => ({
        ...prev,
        adminDashboard: response.ok ? '✅ Dashboard Accessible' : '❌ Dashboard Error'
      }));
    } catch {
      setResults(prev => ({
        ...prev,
        adminDashboard: '❌ Cannot reach Dashboard'
      }));
    }

    // Test 4: Auth Endpoint
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'test@test.com', password: 'test' })
      });
      setResults(prev => ({
        ...prev,
        authEndpoint: response.ok || response.status === 400 ? '✅ Auth Endpoint Working' : '❌ Auth Error'
      }));
    } catch {
      setResults(prev => ({
        ...prev,
        authEndpoint: '❌ Cannot reach Auth'
      }));
    }

    // Test 5: Doctors Endpoint
    try {
      const response = await fetch(`${API_BASE_URL}/doctors`);
      const data = await response.json();
      setResults(prev => ({
        ...prev,
        doctorsEndpoint: response.ok ? `✅ Doctors Loaded (${data.data?.length || 0})` : '❌ Doctors Error'
      }));
    } catch {
      setResults(prev => ({
        ...prev,
        doctorsEndpoint: '❌ Cannot reach Doctors'
      }));
    }

    // Test 6: Appointments Endpoint
    try {
      const response = await fetch(`${API_BASE_URL}/appointments`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });
      setResults(prev => ({
        ...prev,
        appointmentEndpoint: response.status === 200 || response.status === 404 ? '✅ Appointment Endpoint Working' : '❌ Appointment Error'
      }));
    } catch {
      setResults(prev => ({
        ...prev,
        appointmentEndpoint: '❌ Cannot reach Appointments'
      }));
    }

    // Test 7: Health Endpoint
    try {
      const response = await fetch(`${API_BASE_URL}/health/health-dashboard`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });
      setResults(prev => ({
        ...prev,
        healthEndpoint: response.status === 200 || response.status === 400 ? '✅ Health Endpoint Working' : '❌ Health Error'
      }));
    } catch {
      setResults(prev => ({
        ...prev,
        healthEndpoint: '❌ Cannot reach Health'
      }));
    }
  };

  useEffect(() => {
    testBackend();
    const interval = setInterval(testBackend, 5000); // Test every 5 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1>🔍 Backend Connection Test</h1>
        <p>Real-time verification of backend connectivity</p>
      </div>

      <div style={styles.grid}>
        <div style={styles.testCard}>
          <h3>Backend Server</h3>
          <p style={styles.result}>{results.backendStatus}</p>
          <small>http://localhost:5002</small>
        </div>

        <div style={styles.testCard}>
          <h3>API Connection</h3>
          <p style={styles.result}>{results.apiConnection}</p>
          <small>/api/admin/stats</small>
        </div>

        <div style={styles.testCard}>
          <h3>Admin Dashboard</h3>
          <p style={styles.result}>{results.adminDashboard}</p>
          <small>http://localhost:5002/admin</small>
        </div>

        <div style={styles.testCard}>
          <h3>Auth Endpoint</h3>
          <p style={styles.result}>{results.authEndpoint}</p>
          <small>POST /api/auth/login</small>
        </div>

        <div style={styles.testCard}>
          <h3>Doctors Endpoint</h3>
          <p style={styles.result}>{results.doctorsEndpoint}</p>
          <small>GET /api/doctors</small>
        </div>

        <div style={styles.testCard}>
          <h3>Appointments Endpoint</h3>
          <p style={styles.result}>{results.appointmentEndpoint}</p>
          <small>GET /api/appointments</small>
        </div>

        <div style={styles.testCard}>
          <h3>Health Endpoint</h3>
          <p style={styles.result}>{results.healthEndpoint}</p>
          <small>GET /api/health/health-dashboard</small>
        </div>
      </div>

      <div style={styles.instructions}>
        <h3>📋 How to Use This Test:</h3>
        <ul>
          <li>✅ Green = Backend is working and connected</li>
          <li>❌ Red = Something is not working</li>
          <li>Test refreshes every 5 seconds automatically</li>
          <li>Check browser Console (F12) for detailed error messages</li>
          <li>Check backend terminal for server logs</li>
        </ul>
      </div>

      <div style={styles.tips}>
        <h3>💡 Troubleshooting Tips:</h3>
        <ul>
          <li>If "Backend Not Responding": Make sure backend is running with `npm start` in /backend folder</li>
          <li>If API shows error: Check that all routes are properly imported in apiRoutes.js</li>
          <li>If dashboard shows error: Check that public/admin folder exists with index.html</li>
          <li>If endpoints show error: Check backend console (Terminal) for error logs</li>
          <li>Open DevTools (F12) → Network tab to see actual API responses</li>
        </ul>
      </div>

      <button onClick={testBackend} style={styles.button}>
        🔄 Test Now
      </button>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '2rem',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    minHeight: '100vh'
  },
  header: {
    color: 'white',
    textAlign: 'center',
    marginBottom: '2rem'
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '1.5rem',
    marginBottom: '2rem'
  },
  testCard: {
    background: 'white',
    padding: '1.5rem',
    borderRadius: '12px',
    boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
    textAlign: 'center'
  },
  result: {
    fontSize: '1.1rem',
    fontWeight: 'bold',
    margin: '0.5rem 0',
    minHeight: '2em'
  },
  instructions: {
    background: 'white',
    padding: '1.5rem',
    borderRadius: '12px',
    marginBottom: '1rem',
    boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
  },
  tips: {
    background: 'white',
    padding: '1.5rem',
    borderRadius: '12px',
    marginBottom: '1rem',
    boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
  },
  button: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    padding: '1rem 2rem',
    border: 'none',
    borderRadius: '8px',
    fontSize: '1rem',
    fontWeight: 'bold',
    cursor: 'pointer',
    width: '100%',
    transition: 'transform 0.3s ease'
  }
};

export default ConnectionTest;
