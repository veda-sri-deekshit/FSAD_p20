import React, { useState, useEffect } from 'react';
import './App.css';
import ConnectionTest from './ConnectionTest';

const API_BASE_URL = 'http://localhost:5002/api';

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [userRole, setUserRole] = useState(null);
  const [userEmail, setUserEmail] = useState('');

  // Home Component
  const Home = () => (
    <>
      <nav className="navbar">
        <div className="nav-container">
          <div className="logo">
            <h2>🩺 MediCare Virtual</h2>
          </div>
          <div className="nav-links">
            <a href="#features">Features</a>
            <a href="#about">About</a>
            <button
              onClick={() => setCurrentPage('connection-test')}
              className="test-btn"
              title="Test backend connection"
            >
              🔍 Test
            </button>
            <button
              onClick={() => setCurrentPage('signup')}
              className="signup-btn"
            >
              Sign Up
            </button>
            <button
              onClick={() => setCurrentPage('login')}
              className="login-btn"
            >
              Sign In
            </button>
          </div>
        </div>
      </nav>

      <section className="hero">
        <div className="hero-container">
          <div className="hero-content">
            <h1>Virtual Healthcare at Your Fingertips</h1>
            <p>
              Connect with healthcare professionals from the comfort of your home.
              Book appointments, receive consultations, and manage your health records seamlessly.
            </p>
            <div className="hero-buttons">
              <button onClick={() => setCurrentPage('login')} className="btn btn-primary">
                Sign In
              </button>
              <button onClick={() => setCurrentPage('signup')} className="btn btn-secondary">
                Create Account
              </button>
            </div>
          </div>

          <div className="hero-image">
            <div className="medical-illustration">
              <div className="illustration-item doctor">👨‍⚕️</div>
              <div className="illustration-item patient">👤</div>
              <div className="illustration-item pharmacy">💊</div>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="features">
        <div className="container">
          <h2>Our Healthcare Services</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">👨‍⚕️</div>
              <h3>Patient Portal</h3>
              <p>
                Book appointments, access medical records, and receive virtual consultations with healthcare professionals.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🩺</div>
              <h3>Doctor Dashboard</h3>
              <p>
                Conduct consultations, manage patient records, and provide e-prescriptions securely.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">💊</div>
              <h3>Pharmacist Panel</h3>
              <p>
                Manage prescriptions, track orders, and provide medication information to patients.
              </p>
            </div>
          </div>
        </div>
      </section>

      <footer>
        <div className="container">
          <p>&copy; 2025 MediCare Virtual. All rights reserved.</p>
          <p>End-to-end encrypted healthcare portal</p>
        </div>
      </footer>
    </>
  );

  // Signup Component
  const Signup = () => {
    const [formData, setFormData] = useState({
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
      role: 'patient',
      phone: '',
      licenseNumber: '',
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [passwordStrength, setPasswordStrength] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const calculatePasswordStrength = (pwd) => {
      if (!pwd) return '';
      
      let strength = 0;
      if (pwd.length >= 6) strength++;
      if (pwd.length >= 8) strength++;
      if (/[A-Z]/.test(pwd)) strength++;
      if (/[a-z]/.test(pwd)) strength++;
      if (/[0-9]/.test(pwd)) strength++;
      if (/[^A-Za-z0-9]/.test(pwd)) strength++;

      if (strength <= 2) return 'weak';
      if (strength <= 4) return 'medium';
      return 'strong';
    };

    const handleInputChange = (e) => {
      const { name, value } = e.target;
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));

      if (name === 'password') {
        setPasswordStrength(calculatePasswordStrength(value));
      }
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      setError('');
      setLoading(true);

      if (formData.password.length < 6) {
        setError('Password must be at least 6 characters long');
        setLoading(false);
        return;
      }

      if (formData.password !== formData.confirmPassword) {
        setError('❌ Passwords do not match');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`${API_BASE_URL}/auth/signup`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            password: formData.password,
            role: formData.role,
            phone: formData.phone,
            licenseNumber: formData.licenseNumber,
          }),
        });

        const result = await response.json();

        if (result.success) {
          setUserRole(formData.role);
          setUserEmail(formData.email);
          setCurrentPage('dashboard');
        } else {
          setError(result.error || 'Signup failed. Please try again.');
        }
      } catch (err) {
        setError('Error during signup: ' + err.message);
      } finally {
        setLoading(false);
      }
    };

    return (
      <div className="signup-container">
        <div className="signup-header">
          <h1>🩺 MediCare Virtual</h1>
          <p>Create your account to access healthcare services</p>
        </div>

        <div className="signup-card">
          <h2>Create Account</h2>
          
          {error && <div className="alert alert-error">{error}</div>}

          <form className="signup-form" onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="firstName">First Name</label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  placeholder="John"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="lastName">Last Name</label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  placeholder="Doe"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="your.email@example.com"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="phone">Phone Number</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                placeholder="+1 (555) 123-4567"
                value={formData.phone}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="role">Account Type</label>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleInputChange}
              >
                <option value="patient">Patient</option>
                <option value="doctor">Doctor</option>
                <option value="pharmacist">Pharmacist</option>
              </select>
            </div>

            {(formData.role === 'doctor' || formData.role === 'pharmacist') && (
              <div className="form-group">
                <label htmlFor="licenseNumber">License Number</label>
                <input
                  type="text"
                  id="licenseNumber"
                  name="licenseNumber"
                  placeholder="Your professional license number"
                  value={formData.licenseNumber}
                  onChange={handleInputChange}
                  required
                />
              </div>
            )}

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <div className="password-input-wrapper">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    name="password"
                    placeholder="Create a strong password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                  />
                  <button
                    type="button"
                    className="password-toggle-btn"
                    onClick={() => setShowPassword(!showPassword)}
                    title={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? '👁️' : '👁️‍🗨️'}
                  </button>
                </div>
                {formData.password && (
                  <div className={`password-strength strength-${passwordStrength}`}>
                    <span className="strength-bar"></span>
                    <span className="strength-text">
                      {passwordStrength === 'weak' && '⚠️ Weak password'}
                      {passwordStrength === 'medium' && '✓ Medium strength'}
                      {passwordStrength === 'strong' && '✅ Strong password'}
                    </span>
                  </div>
                )}
              </div>
              <div className="form-group">
                <label htmlFor="confirmPassword">Confirm Password</label>
                <div className="password-input-wrapper">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    id="confirmPassword"
                    name="confirmPassword"
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    required
                    className={formData.confirmPassword && formData.password === formData.confirmPassword ? 'password-match' : formData.confirmPassword ? 'password-mismatch' : ''}
                  />
                  <button
                    type="button"
                    className="password-toggle-btn"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    title={showConfirmPassword ? 'Hide password' : 'Show password'}
                  >
                    {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
                  </button>
                </div>
                {formData.confirmPassword && (
                  <div className={`password-check ${formData.password === formData.confirmPassword ? 'match' : 'mismatch'}`}>
                    {formData.password === formData.confirmPassword ? '✅ Passwords match' : '❌ Passwords do not match'}
                  </div>
                )}
              </div>
            </div>

            <button type="submit" className="submit-btn" disabled={loading || !formData.password || formData.password !== formData.confirmPassword}>
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          <div className="auth-footer">
            <p>Already have an account? <span className="auth-link" onClick={() => setCurrentPage('login')}>Sign in here</span></p>
            <p className="encryption-note">🔒 End-to-end encrypted</p>
          </div>
        </div>

        <button onClick={() => setCurrentPage('home')} className="back-btn">← Back to Home</button>
      </div>
    );
  };

  // Forgot Password Component
  const ForgotPassword = ({ onClose }) => {
    const [forgotEmail, setForgotEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [step, setStep] = useState('email'); // 'email' or 'otp'
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [devOtp, setDevOtp] = useState(''); // For displaying OTP in development
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleForgotPasswordSubmit = async (e) => {
      e.preventDefault();
      setError('');
      setMessage('');
      setDevOtp('');
      setLoading(true);

      try {
        const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email: forgotEmail }),
        });

        const result = await response.json();

        if (result.success) {
          // If OTP is in response (development mode), display it
          if (result.otp) {
            setDevOtp(result.otp);
            setMessage(`✅ OTP for testing: ${result.otp} (Check email or use this code)`);
          } else {
            setMessage('✅ OTP has been sent to your registered email! Please check your inbox.');
          }
          setStep('otp');
        } else {
          setError(result.error || 'Failed to send OTP');
        }
      } catch (err) {
        setError('Error: ' + err.message);
      } finally {
        setLoading(false);
      }
    };

    const handleResetPasswordSubmit = async (e) => {
      e.preventDefault();
      setError('');
      setMessage('');

      if (newPassword !== confirmPassword) {
        setError('Passwords do not match');
        return;
      }

      if (newPassword.length < 6) {
        setError('Password must be at least 6 characters long');
        return;
      }

      if (!otp || otp.length !== 6) {
        setError('Please enter a valid 6-digit OTP');
        return;
      }

      setLoading(true);

      try {
        const response = await fetch(`${API_BASE_URL}/auth/reset-password`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: forgotEmail,
            otp: otp,
            newPassword: newPassword,
          }),
        });

        const result = await response.json();

        if (result.success) {
          setMessage('✅ Password has been reset successfully!');
          setTimeout(() => {
            onClose();
          }, 2000);
        } else {
          setError(result.error || 'Failed to reset password');
        }
      } catch (err) {
        setError('Error: ' + err.message);
      } finally {
        setLoading(false);
      }
    };

    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <button className="modal-close" onClick={onClose}>×</button>

          <div className="forgot-password-container">
            <h2>🔐 Reset Your Password</h2>

            {error && <div className="alert alert-error">{error}</div>}
            {message && <div className="alert alert-success">{message}</div>}

            {step === 'email' ? (
              <form onSubmit={handleForgotPasswordSubmit}>
                <div className="form-group">
                  <label htmlFor="forgotEmail">Email Address</label>
                  <input
                    type="email"
                    id="forgotEmail"
                    placeholder="Enter your registered email"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    required
                  />
                </div>
                <p className="form-help-text">📧 We'll send an OTP to your registered email</p>
                <button type="submit" className="submit-btn" disabled={loading}>
                  {loading ? 'Sending OTP...' : 'Send OTP'}
                </button>
              </form>
            ) : (
              <form onSubmit={handleResetPasswordSubmit}>
                <div className="form-group">
                  <label htmlFor="otp">Enter OTP</label>
                  <input
                    type="text"
                    id="otp"
                    placeholder={devOtp ? `Use: ${devOtp}` : "Enter 6-digit OTP from email"}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    maxLength="6"
                    required
                  />
                  <small style={{color: '#718096', marginTop: '0.25rem'}}>
                    {devOtp ? `📝 Or copy this code: ${devOtp}` : '6-digit OTP from your email (Valid for 10 minutes)'}
                  </small>
                </div>
                
                <div className="form-group">
                  <label htmlFor="newPassword">New Password</label>
                  <div className="password-input-wrapper">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      id="newPassword"
                      placeholder="Enter new password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      className="password-toggle-btn"
                      onClick={() => setShowPassword(!showPassword)}
                      title={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? '👁️' : '👁️‍🗨️'}
                    </button>
                  </div>
                </div>
                
                <div className="form-group">
                  <label htmlFor="confirmPassword">Confirm Password</label>
                  <div className="password-input-wrapper">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      id="confirmPassword"
                      placeholder="Confirm new password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      className={confirmPassword && newPassword === confirmPassword ? 'password-match' : confirmPassword ? 'password-mismatch' : ''}
                    />
                    <button
                      type="button"
                      className="password-toggle-btn"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      title={showConfirmPassword ? 'Hide password' : 'Show password'}
                    >
                      {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
                    </button>
                  </div>
                  {confirmPassword && (
                    <div className={`password-check ${newPassword === confirmPassword ? 'match' : 'mismatch'}`}>
                      {newPassword === confirmPassword ? '✅ Passwords match' : '❌ Passwords do not match'}
                    </div>
                  )}
                </div>
                
                <button type="submit" className="submit-btn" disabled={loading || newPassword !== confirmPassword || otp.length !== 6}>
                  {loading ? 'Resetting Password...' : 'Reset Password'}
                </button>
                
                <p style={{textAlign: 'center', marginTop: '1rem', color: '#718096', fontSize: '0.9rem'}}>
                  Didn't receive the OTP? <span className="auth-link" onClick={() => {setStep('email'); setOtp(''); setError(''); setMessage(''); setDevOtp('');}}>Try again</span>
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Login Component
  const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [selectedRole, setSelectedRole] = useState('patient');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showForgotPassword, setShowForgotPassword] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    
    // CAPTCHA states
    const [captcha, setCaptcha] = useState({ word: '', userInput: '' });
    const [captchaError, setCaptchaError] = useState('');

    // Common word list for CAPTCHA
    const wordList = [
      'SECURE', 'HEALTH', 'PATIENT', 'DOCTOR', 'VACCINE', 'MEDICINE',
      'HOSPITAL', 'CARDIAC', 'THERAPY', 'WELLNESS', 'MEDICAL', 'CLINIC',
      'VITALS', 'HEALING', 'IMMUNE', 'DIGITAL', 'MOBILE', 'ONLINE',
      'PROTECT', 'URGENT', 'CONSULT', 'PHARMACY', 'SURGERY', 'SCIENCE',
      'TRUSTED', 'VERIFIED', 'ADVANCE', 'EXPERT', 'RELIEF', 'COMFORT'
    ];

    // Generate Word CAPTCHA
    const generateCaptcha = () => {
      const randomWord = wordList[Math.floor(Math.random() * wordList.length)];
      setCaptcha({ word: randomWord, userInput: '' });
      setCaptchaError('');
    };

    // Initialize CAPTCHA on component mount
    React.useEffect(() => {
      generateCaptcha();
    }, []);

    // Validate CAPTCHA
    const validateCaptcha = () => {
      const userWord = captcha.userInput.toUpperCase().trim();
      
      if (!userWord) {
        setCaptchaError('Please enter the word from the security image');
        return false;
      }
      
      if (userWord !== captcha.word) {
        setCaptchaError('Incorrect word. Please try again.');
        generateCaptcha();
        return false;
      }
      
      setCaptchaError('');
      return true;
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      setError('');

      // Validate CAPTCHA first
      if (!validateCaptcha()) {
        return;
      }

      setLoading(true);

      try {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email,
            password,
            role: selectedRole,
            captchaToken: captcha.userInput,
          }),
        });

        const result = await response.json();

        if (result.success) {
          setUserRole(selectedRole);
          setUserEmail(email);
          setCurrentPage('dashboard');
        } else {
          setError(result.error || 'Login failed. Please check your credentials.');
          generateCaptcha();
        }
      } catch (err) {
        setError('Error during login: ' + err.message);
        generateCaptcha();
      } finally {
        setLoading(false);
      }
    };

    return (
      <div className="login-container">
        <div className="login-header">
          <h1>🩺 MediCare Virtual</h1>
          <p>Sign in to access your healthcare portal</p>
        </div>

        <div className="login-card">
          <h2>Welcome Back</h2>

          {error && <div className="alert alert-error">{error}</div>}

          <form className="login-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <div className="password-input-wrapper">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="password-toggle-btn"
                  onClick={() => setShowPassword(!showPassword)}
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
            </div>

            <div className="forgot-password-link">
              <span 
                className="auth-link" 
                onClick={() => setShowForgotPassword(true)}
                title="Click to reset your password"
              >
                🔑 Forgot Password?
              </span>
            </div>

            <div className="captcha-section">
              <label className="captcha-label">🔒 Security Verification</label>
              <div className="captcha-question">
                <p className="captcha-instruction">Type the word shown below:</p>
                <div className="captcha-word-display">
                  {captcha.word}
                </div>
              </div>
              <input
                type="text"
                className="captcha-input"
                placeholder="Enter the word above"
                value={captcha.userInput}
                onChange={(e) => {
                  setCaptcha({ ...captcha, userInput: e.target.value });
                  setCaptchaError('');
                }}
                autoComplete="off"
              />
              {captchaError && <div className="captcha-error">{captchaError}</div>}
              <button
                type="button"
                className="refresh-captcha-btn"
                onClick={generateCaptcha}
                title="Generate new security word"
              >
                🔄 New Word
              </button>
            </div>

            <div className="role-switcher">
              <p>
                Sign in as:{' '}
                <span
                  className={`role-option ${selectedRole === 'patient' ? 'active' : ''}`}
                  onClick={() => setSelectedRole('patient')}
                >
                  Patient
                </span>{' '}
                |{' '}
                <span
                  className={`role-option ${selectedRole === 'doctor' ? 'active' : ''}`}
                  onClick={() => setSelectedRole('doctor')}
                >
                  Doctor
                </span>{' '}
                |{' '}
                <span
                  className={`role-option ${selectedRole === 'pharmacist' ? 'active' : ''}`}
                  onClick={() => setSelectedRole('pharmacist')}
                >
                  Pharmacist
                </span>
              </p>
            </div>

            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign In as ' + selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1)}
            </button>
          </form>

          <div className="auth-footer">
            <p>Don't have an account? <span className="auth-link" onClick={() => setCurrentPage('signup')}>Create one here</span></p>
            <p className="encryption-note">🔒 End-to-end encrypted</p>
          </div>
        </div>

        <button onClick={() => setCurrentPage('home')} className="back-btn">
          ← Back to Home
        </button>

        {showForgotPassword && (
          <ForgotPassword onClose={() => setShowForgotPassword(false)} />
        )}
      </div>
    );
  };

  // Book Appointment Component
  const BookAppointment = () => {
    const [doctors, setDoctors] = useState([]);
    const [selectedDoctor, setSelectedDoctor] = useState(null);
    const [formData, setFormData] = useState({
      date: '',
      time: '',
      symptoms: '',
    });
    const [availableSlots, setAvailableSlots] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
      fetchDoctors();
    }, []);

    const fetchDoctors = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/doctors`);
        const data = await response.json();
        if (data.success && data.data) {
          setDoctors(data.data);
        } else {
          console.warn("Doctors fetch failed or returned no data:", data);
          setDoctors([]);
        }
      } catch (error) {
        console.error("Error fetching doctors:", error);
        alert("Note: Could not load doctors from backend. Using offline mode.");
        setDoctors([]);
      }
    };

    const fetchAvailableSlots = async (doctorId, date) => {
      try {
        const response = await fetch(
          `${API_BASE_URL}/appointments/available-slots?doctorId=${doctorId}&date=${date}`
        );
        const result = await response.json();
        // Backend now returns a simple array of strings as per request
        if (Array.isArray(result)) {
          setAvailableSlots(result);
        } else if (result.success && result.data) {
          setAvailableSlots(result.data.availableSlots || []);
        } else {
          setAvailableSlots([]);
        }
      } catch (err) {
        console.error("Error fetching slots:", err);
        setError('Failed to load available slots');
      }
    };

    const handleDoctorSelect = (doctor) => {
      setSelectedDoctor(doctor);
      setFormData({ date: '', time: '', symptoms: '' });
      setAvailableSlots([]);
      setError('');
      setSuccess('');
    };

    const handleDateChange = (e) => {
      const date = e.target.value;
      setFormData({ ...formData, date, time: '' });
      if (selectedDoctor && date) {
        fetchAvailableSlots(selectedDoctor.id, date);
      }
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      setLoading(true);
      setError('');
      setSuccess('');

      try {
        const response = await fetch(`${API_BASE_URL}/appointments`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            patientName: 'Patient User',
            patientEmail: userEmail,
            doctorId: selectedDoctor.id,
            appointmentDate: formData.date,
            appointmentTime: formData.time,
            symptoms: formData.symptoms,
          }),
        });

        const result = await response.json();

        if (result.success) {
          setSuccess('Appointment booked successfully! ✓');
          setSelectedDoctor(null);
          setFormData({ date: '', time: '', symptoms: '' });
          setAvailableSlots([]);
          setTimeout(() => {
            setCurrentPage('my-appointments');
          }, 2000);
        } else {
          setError(result.error || 'Failed to book appointment');
        }
      } catch (err) {
        setError('Error booking appointment: ' + err.message);
      } finally {
        setLoading(false);
      }
    };

    return (
      <div className="appointment-container">
        <nav className="dashboard-nav">
          <div className="nav-brand">
            <h2>🩺 MediCare Virtual</h2>
          </div>
          <div className="nav-actions">
            <button onClick={() => setCurrentPage('dashboard')} className="logout-btn">
              Back to Dashboard
            </button>
          </div>
        </nav>

        <div className="appointment-content">
          <header className="appointment-header">
            <h1>📅 Book an Appointment</h1>
            <p>Select a doctor and schedule your consultation</p>
          </header>

          {error && <div className="alert alert-error">{error}</div>}
          {success && <div className="alert alert-success">{success}</div>}

          {!selectedDoctor ? (
            <div className="doctors-list">
              <h2>Available Doctors</h2>
              <div className="doctors-grid">
                {doctors.map((doctor) => (
                  <div key={doctor.id} className="doctor-card">
                    <div className="doctor-icon">👨‍⚕️</div>
                    <h3>{doctor.name}</h3>
                    <p className="specialty">{doctor.specialty}</p>
                    <button
                      className="select-doctor-btn"
                      onClick={() => handleDoctorSelect(doctor)}
                    >
                      Select Doctor
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <form className="appointment-form" onSubmit={handleSubmit}>
              <div className="selected-doctor">
                <button
                  type="button"
                  className="back-doctor-btn"
                  onClick={() => handleDoctorSelect(null)}
                >
                  ← Back to Doctors
                </button>
                <h2>Dr. {selectedDoctor.name}</h2>
                <p>{selectedDoctor.specialty}</p>
              </div>

              <div className="form-group">
                <label htmlFor="date">Select Date</label>
                <input
                  type="date"
                  id="date"
                  value={formData.date}
                  onChange={handleDateChange}
                  min={new Date().toISOString().split('T')[0]}
                  required
                />
              </div>

              {availableSlots.length > 0 && (
                <div className="form-group">
                  <label htmlFor="time">Select Time</label>
                  <select
                    id="time"
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    required
                  >
                    <option value="">Choose a time slot</option>
                    {availableSlots.map((slot) => (
                      <option key={slot} value={slot}>
                        {slot}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="form-group">
                <label htmlFor="symptoms">Describe Your Symptoms</label>
                <textarea
                  id="symptoms"
                  placeholder="Describe your health concerns..."
                  value={formData.symptoms}
                  onChange={(e) => setFormData({ ...formData, symptoms: e.target.value })}
                  rows="4"
                  required
                />
              </div>

              <button
                type="submit"
                className="submit-btn"
                disabled={loading || !formData.date || !formData.time || !formData.symptoms}
              >
                {loading ? 'Booking...' : 'Confirm Appointment'}
              </button>
            </form>
          )}
        </div>
      </div>
    );
  };

  // View Appointments Component
  const ViewAppointments = () => {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
      fetchAppointments();
    }, []);

    const fetchAppointments = async () => {
      if (!userEmail) return;
      try {
        setLoading(true);
        const response = await fetch(`${API_BASE_URL}/appointments?email=${userEmail}`);
        const result = await response.json();
        if (result.success) {
         setAppointments(result.data || result.appointments || []);
          setError('');
        } else {
          setError(result.error || 'Failed to load appointments');
        }
      } catch (err) {
        setError('Connection error: could not reach the server');
      } finally {
        setLoading(false);
      }
    };

    const handleCancel = async (appointmentId) => {
      if (!window.confirm('Are you sure you want to cancel this appointment?')) return;

      try {
        const response = await fetch(`${API_BASE_URL}/appointments/${appointmentId}/cancel`, {
          method: 'PUT',
        });
        const result = await response.json();
        if (result.success) {
          fetchAppointments();
        }
      } catch (err) {
        setError('Failed to cancel appointment');
      }
    };

    return (
      <div className="appointments-container">
        <nav className="dashboard-nav">
          <div className="nav-brand">
            <h2>🩺 MediCare Virtual</h2>
          </div>
          <div className="nav-actions">
            <button onClick={() => setCurrentPage('dashboard')} className="logout-btn">
              Back to Dashboard
            </button>
          </div>
        </nav>

        <div className="appointments-content">
          <header className="appointments-header">
            <h1>📋 Your Appointments</h1>
            <p>View and manage your scheduled consultations</p>
          </header>

          {error && <div className="alert alert-error">{error}</div>}

          {loading ? (
            <div className="loading">Loading appointments...</div>
          ) : appointments.length === 0 ? (
            <div className="no-appointments">
              <p>No appointments scheduled yet</p>
              <button
                className="btn btn-primary"
                onClick={() => setCurrentPage('book-appointment')}
              >
                Book Your First Appointment
              </button>
            </div>
          ) : (
            <div className="appointments-list">
              {appointments.map((appointment) => (
                <div key={appointment.id} className="appointment-item">
                  <div className="appointment-info">
                    <h3>Dr. {appointment.doctorName}</h3>
                    <p className="date-time">
                      📅 {appointment.date} at {appointment.time}
                    </p>
                    <p className="symptoms">
                      <strong>Symptoms:</strong> {appointment.symptoms}
                    </p>
                    <span className={`status status-${appointment.status}`}>
                      {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                    </span>
                  </div>
                  {appointment.status !== 'cancelled' && (
                    <button
                      className="cancel-btn"
                      onClick={() => handleCancel(appointment.id)}
                    >
                      Cancel
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}

          <div className="action-buttons" style={{ marginTop: '30px' }}>
            <button
              className="btn btn-primary"
              onClick={() => setCurrentPage('book-appointment')}
            >
              Book New Appointment
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Doctor Appointments Management Component
  const DoctorAppointments = () => {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [filterStatus, setFilterStatus] = useState('pending');

    useEffect(() => {
      fetchAppointments();
    }, [filterStatus]);

    const fetchAppointments = async () => {
      try {
        setLoading(true);
        console.log("📡 Fetching appointments for doctor:", userEmail);
        const response = await fetch(`${API_BASE_URL}/appointments`);
        const result = await response.json();
        console.log("📥 Server responded with:", result);
        if (result.success) {
 const filtered = result.data.filter(apt =>
  filterStatus === 'all' || apt.status === filterStatus
);

setAppointments(filtered);
}
      } catch (err) {
        console.error("❌ Fetch error:", err);
        setError('Failed to load appointments');
      } finally {
        setLoading(false);
      }
    };

    const handleAccept = async (appointmentId) => {
      try {
        const response = await fetch(`${API_BASE_URL}/appointments/${appointmentId}/accept`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
        });
        const result = await response.json();
        if (result.success) {
          setSuccess('✅ Appointment accepted!');
          fetchAppointments();
          setTimeout(() => setSuccess(''), 3000);
          
          // Send message to patient
          const apt = appointments.find(a => a.id === appointmentId);
          if (apt) {
            await fetch(`${API_BASE_URL}/messages`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                fromEmail: userEmail,
                toEmail: apt.patientEmail,
                subject: `Appointment Confirmed - ${apt.appointmentDate} at ${apt.appointmentTime}`,
                message: `Your appointment on ${apt.appointmentDate} at ${apt.appointmentTime} has been confirmed. Please arrive 5 minutes early.`,
                appointmentId: appointmentId,
                type: 'appointment-confirmed'
              }),
            });
          }
        }
      } catch (err) {
        setError('Failed to accept appointment');
      }
    };

    const handleReject = async (appointmentId) => {
      const reason = window.prompt('Please provide a reason for rejection:');
      if (!reason) return;

      try {
        const response = await fetch(`${API_BASE_URL}/appointments/${appointmentId}/reject`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ reason }),
        });
        const result = await response.json();
        if (result.success) {
          setSuccess('❌ Appointment rejected');
          fetchAppointments();
          setTimeout(() => setSuccess(''), 3000);
          
          // Send rejection message to patient
          const apt = appointments.find(a => a.id === appointmentId);
          if (apt) {
            await fetch(`${API_BASE_URL}/messages`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                fromEmail: userEmail,
                toEmail: apt.patientEmail,
                subject: `Appointment Not Available - ${apt.appointmentDate}`,
                message: `Unfortunately, your appointment request for ${apt.appointmentDate} at ${apt.appointmentTime} cannot be accepted. Reason: ${reason}. Please try booking another time slot.`,
                appointmentId: appointmentId,
                type: 'appointment-rejected'
              }),
            });
          }
        }
      } catch (err) {
        setError('Failed to reject appointment');
      }
    };

    return (
      <div className="doctor-appointments-container">
        <nav className="dashboard-nav">
          <div className="nav-brand">
            <h2>🩺 MediCare Virtual</h2>
          </div>
          <div className="nav-actions">
            <button onClick={() => setCurrentPage('dashboard')} className="logout-btn">
              Back to Dashboard
            </button>
          </div>
        </nav>

        <div className="appointments-content">
          <header className="appointments-header">
            <h1>📅 Appointment Requests</h1>
            <p>Review and respond to patient appointment requests</p>
          </header>

          {error && <div className="alert alert-error">{error}</div>}
          {success && <div className="alert alert-success">{success}</div>}

          <div className="filter-buttons">
            <button 
              className={`filter-btn ${filterStatus === 'pending' ? 'active' : ''}`}
              onClick={() => setFilterStatus('pending')}
            >
              ⏳ Pending ({appointments.filter(a => a.status === 'pending').length})
            </button>
            <button 
              className={`filter-btn ${filterStatus === 'accepted' ? 'active' : ''}`}
              onClick={() => setFilterStatus('accepted')}
            >
              ✅ Accepted ({appointments.filter(a => a.status === 'accepted').length})
            </button>
            <button 
              className={`filter-btn ${filterStatus === 'all' ? 'active' : ''}`}
              onClick={() => setFilterStatus('all')}
            >
              📋 All
            </button>
          </div>

          {loading ? (
            <div className="loading">Loading appointments...</div>
          ) : appointments.length === 0 ? (
            <div className="no-data">
              <p>No {filterStatus === 'all' ? ' ' : filterStatus + ' '}appointments found</p>
            </div>
          ) : (
            <div className="appointments-list">
              {appointments.map(apt => (
                <div key={apt.id} className={`appointment-card appointment-${apt.status}`}>
                  <div className="appointment-header">
                    <h3>Patient: {apt.patientEmail}</h3>
                    <span className={`status-badge ${apt.status}`}>{apt.status.toUpperCase()}</span>
                  </div>
                  <div className="appointment-details">
                    <p><strong>📅 Date:</strong> {apt.appointmentDate}</p>
                    <p><strong>⏰ Time:</strong> {apt.appointmentTime}</p>
                    {apt.symptoms && <p><strong>🏥 Symptoms:</strong> {apt.symptoms}</p>}
                    {apt.notes && <p><strong>📝 Notes:</strong> {apt.notes}</p>}
                  </div>
                  {apt.status === 'pending' && (
                    <div className="appointment-actions">
                      <button 
                        className="accept-btn"
                        onClick={() => handleAccept(apt.id)}
                      >
                        ✅ Accept
                      </button>
                      <button 
                        className="reject-btn"
                        onClick={() => handleReject(apt.id)}
                      >
                        ❌ Reject
                      </button>
                    </div>
                  )}
                  {apt.status === 'accepted' && (
                    <div className="appointment-status">
                      <p>✅ This appointment has been confirmed</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  // Messaging Component
  const DoctorMessaging = () => {
    const [messages, setMessages] = useState([]);
    const [conversation, setConversation] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [newMessage, setNewMessage] = useState('');
    const [messageSubject, setMessageSubject] = useState('');
    const [viewMode, setViewMode] = useState('inbox'); // 'inbox' or 'compose'

    useEffect(() => {
      fetchMessages();
    }, []);

    const fetchMessages = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_BASE_URL}/messages?email=${userEmail}`);
        const result = await response.json();
        if (result.success) {
          setMessages(result.data);
        }
      } catch (err) {
        setError('Failed to load messages');
      } finally {
        setLoading(false);
      }
    };

    const handleSelectPatient = async (patientEmail) => {
      try {
        setSelectedPatient(patientEmail);
        const response = await fetch(`${API_BASE_URL}/messages/conversation?email1=${userEmail}&email2=${patientEmail}`);
        const result = await response.json();
        if (result.success) {
          setConversation(result.data);
        }
      } catch (err) {
        setError('Failed to load conversation');
      }
    };

    const handleSendMessage = async (e) => {
      e.preventDefault();
      if (!newMessage.trim()) return;

      try {
        const response = await fetch(`${API_BASE_URL}/messages`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            fromEmail: userEmail,
            toEmail: selectedPatient || userEmail,
            subject: messageSubject || 'No subject',
            message: newMessage,
            type: 'appointment-related'
          }),
        });

        const result = await response.json();
        if (result.success) {
          setSuccess('✅ Message sent!');
          setNewMessage('');
          setMessageSubject('');
          fetchMessages();
          setTimeout(() => setSuccess(''), 3000);
          if (selectedPatient) {
            handleSelectPatient(selectedPatient);
          }
        }
      } catch (err) {
        setError('Failed to send message');
      }
    };

    const uniquePatients = [...new Set(messages.map(m => m.fromEmail))];

    return (
      <div className="messaging-container">
        <nav className="dashboard-nav">
          <div className="nav-brand">
            <h2>🩺 MediCare Virtual</h2>
          </div>
          <div className="nav-actions">
            <button onClick={() => setCurrentPage('dashboard')} className="logout-btn">
              Back to Dashboard
            </button>
          </div>
        </nav>

        <div className="messaging-content">
          <header className="messaging-header">
            <h1>💬 Patient Messages</h1>
            <p>Communicate with your patients</p>
          </header>

          {error && <div className="alert alert-error">{error}</div>}
          {success && <div className="alert alert-success">{success}</div>}

          <div className="messaging-layout">
            <div className="patients-list">
              <h3>👥 Patients</h3>
              <div className="mode-buttons">
                <button 
                  className={`mode-btn ${viewMode === 'inbox' ? 'active' : ''}`}
                  onClick={() => { setViewMode('inbox'); setSelectedPatient(null); }}
                >
                  📥 Inbox
                </button>
                <button 
                  className={`mode-btn ${viewMode === 'compose' ? 'active' : ''}`}
                  onClick={() => setViewMode('compose')}
                >
                  ✏️ New Message
                </button>
              </div>
              
              {viewMode === 'inbox' && (
                <div className="patient-items">
                  {uniquePatients.length === 0 ? (
                    <p className="no-data">No messages yet</p>
                  ) : (
                    uniquePatients.map(patientEmail => (
                      <button
                        key={patientEmail}
                        className={`patient-item ${selectedPatient === patientEmail ? 'active' : ''}`}
                        onClick={() => handleSelectPatient(patientEmail)}
                      >
                        <span className="patient-email">{patientEmail}</span>
                        <span className="message-count">
                          {messages.filter(m => m.fromEmail === patientEmail && !m.isRead).length > 0 && 
                            `(${messages.filter(m => m.fromEmail === patientEmail && !m.isRead).length})`}
                        </span>
                      </button>
                    ))
                  )}
                </div>
              )}
            </div>

            <div className="message-panel">
              {viewMode === 'compose' ? (
                <div className="compose-form">
                  <h3>✍️ Compose Message</h3>
                  <form onSubmit={handleSendMessage}>
                    <div className="form-group">
                      <label htmlFor="patientSelect">Select Patient</label>
                      <select
                        id="patientSelect"
                        value={selectedPatient || ''}
                        onChange={(e) => setSelectedPatient(e.target.value)}
                        required
                      >
                        <option value="">-- Select a patient --</option>
                        {uniquePatients.map(email => (
                          <option key={email} value={email}>{email}</option>
                        ))}
                      </select>
                    </div>
                    <div className="form-group">
                      <label htmlFor="messageSubject">Subject</label>
                      <input
                        type="text"
                        id="messageSubject"
                        value={messageSubject}
                        onChange={(e) => setMessageSubject(e.target.value)}
                        placeholder="Message subject (optional)"
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="messageText">Message</label>
                      <textarea
                        id="messageText"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type your message..."
                        rows="6"
                        required
                      />
                    </div>
                    <button type="submit" className="send-btn">📤 Send Message</button>
                  </form>
                </div>
              ) : selectedPatient ? (
                <div className="conversation-view">
                  <h3>💬 Conversation with {selectedPatient}</h3>
                  <div className="messages-view">
                    {conversation.length === 0 ? (
                      <p className="no-data">No messages in this conversation yet</p>
                    ) : (
                      conversation.map(msg => (
                        <div key={msg.id} className={`message ${msg.fromEmail === userEmail ? 'sent' : 'received'}`}>
                          <div className="message-content">
                            {msg.subject && <p className="message-subject"><strong>{msg.subject}</strong></p>}
                            <p className="message-text">{msg.message}</p>
                          </div>
                          <span className="message-time">{new Date(msg.timestamp).toLocaleString()}</span>
                        </div>
                      ))
                    )}
                  </div>
                  
                  <form onSubmit={handleSendMessage} className="reply-form">
                    <div className="form-group">
                      <textarea
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type your reply..."
                        rows="3"
                        required
                      />
                    </div>
                    <button type="submit" className="send-btn">📤 Send</button>
                  </form>
                </div>
              ) : (
                <div className="empty-state">
                  <p>👈 Select a patient to view conversation</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Dashboard Component
  const Dashboard = () => {
    const getDashboardContent = () => {
      switch (userRole) {
        case 'doctor':
          return {
            title: 'Doctor Dashboard',
            features: [
              'Conduct virtual consultations',
              'Manage patient records',
              'Provide e-prescriptions',
              'View appointment schedule',
            ],
          };
        case 'pharmacist':
          return {
            title: 'Pharmacist Panel',
            features: [
              'Manage prescriptions',
              'Track medication orders',
              'Provide medication information',
              'Coordinate with doctors',
            ],
          };
        default:
          return {
            title: 'Patient Portal',
            features: [
              'Book appointments',
              'Access medical records',
              'Receive virtual consultations',
              'View prescription history',
            ],
          };
      }
    };

    const content = getDashboardContent();

    return (
      <div className="dashboard-container">
        <nav className="dashboard-nav">
          <div className="nav-brand">
            <h2>🩺 MediCare Virtual</h2>
          </div>
          <div className="nav-actions">
            <span className="user-role">Logged in as: {userRole}</span>
            <button onClick={() => {
              setCurrentPage('home');
              setUserRole(null);
              setUserEmail('');
            }} className="logout-btn">
              Logout
            </button>
          </div>
        </nav>

        <div className="dashboard-content">
          <header className="dashboard-header">
            <h1>{content.title}</h1>
            <p>Welcome to your healthcare portal</p>
          </header>

          <div className="dashboard-grid">
            {content.features.map((feature, index) => {
              const getFeaturePage = (f) => {
                const map = {
                  'Book appointments': 'book-appointment',
                  'Access medical records': 'health-dashboard',
                  'Receive virtual consultations': 'telemedicine',
                  'View prescription history': 'health-dashboard',
                  'Conduct virtual consultations': 'doctor-appointments',
                  'Manage patient records': 'doctor-appointments',
                  'Provide e-prescriptions': 'doctor-appointments',
                  'View appointment schedule': 'doctor-appointments',
                  'Manage prescriptions': 'dashboard',
                  'Track medication orders': 'dashboard'
                };
                return map[f] || 'dashboard';
              };

              return (
                <div key={index} className="dashboard-card">
                  <div className="card-icon">{index + 1}</div>
                  <h3>{feature}</h3>
                  <button 
                    className="card-action-btn"
                    onClick={() => setCurrentPage(getFeaturePage(feature))}
                  >
                    Access
                  </button>
                </div>
              );
            })}
          </div>

          <div className="quick-actions">
            <h2>Quick Actions</h2>
            <div className="action-buttons">
              {userRole === 'doctor' && (
                <>
                  <button
                    className="action-btn primary"
                    onClick={() => setCurrentPage('doctor-appointments')}
                  >
                    📅 Review Appointments
                  </button>
                  <button
                    className="action-btn secondary"
                    onClick={() => setCurrentPage('doctor-messages')}
                  >
                    💬 Patient Messages
                  </button>
                  <button
                    className="action-btn secondary"
                    onClick={() => setCurrentPage('my-appointments')}
                  >
                    View My Schedule
                  </button>
                </>
              )}
              {userRole === 'patient' && (
                <>
                  <button
                    className="action-btn primary"
                    onClick={() => setCurrentPage('book-appointment')}
                  >
                    Schedule Appointment
                  </button>
                  <button
                    className="action-btn secondary"
                    onClick={() => setCurrentPage('my-appointments')}
                  >
                    View My Appointments
                  </button>
                  <button
                    className="action-btn secondary"
                    onClick={() => setCurrentPage('health-dashboard')}
                  >
                    Health Dashboard
                  </button>
                  <button
                    className="action-btn secondary"
                    onClick={() => setCurrentPage('record-medical')}
                  >
                    Record Vitals
                  </button>
                  <button
                    className="action-btn secondary"
                    onClick={() => setCurrentPage('record-prescription')}
                  >
                    Add Medication
                  </button>
                  <button
                    className="action-btn secondary"
                    onClick={() => setCurrentPage('telemedicine')}
                  >
                    Video Consultation
                  </button>
                  <button
                    className="action-btn secondary"
                    onClick={() => setCurrentPage('lab-reports')}
                  >
                    Lab Reports
                  </button>
                  <button
                    className="action-btn secondary"
                    onClick={() => setCurrentPage('drug-interactions')}
                  >
                    Check Drug Interactions
                  </button>
                  <button
                    className="action-btn secondary"
                    onClick={() => setCurrentPage('vaccinations')}
                  >
                    Vaccination Records
                  </button>
                  <button
                    className="action-btn secondary"
                    onClick={() => setCurrentPage('allergies')}
                  >
                    Allergy Tracker
                  </button>
                  <button
                    className="action-btn secondary"
                    onClick={() => setCurrentPage('fitness')}
                  >
                    Fitness Tracker
                  </button>
                  <button
                    className="action-btn secondary"
                    onClick={() => setCurrentPage('emergency-contacts')}
                  >
                    Emergency Contacts
                  </button>
                </>
              )}
              <button className="action-btn secondary">Medical Records</button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Record Medical Information Component
  const RecordMedicalInfo = () => {
    const [formData, setFormData] = useState({
      bloodPressure: '',
      bloodSugar: '',
      temperature: '',
      weight: '',
      height: '',
      notes: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleInputChange = (e) => {
      const { name, value } = e.target;
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      setLoading(true);
      setError('');
      setSuccess('');

      try {
        const response = await fetch(`${API_BASE_URL}/health/medical-record`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            patientEmail: userEmail,
            ...formData
          }),
        });

        const result = await response.json();

        if (result.success) {
          setSuccess('Medical information recorded successfully! ✓');
          setFormData({
            bloodPressure: '',
            bloodSugar: '',
            temperature: '',
            weight: '',
            height: '',
            notes: '',
          });
          setTimeout(() => {
            setCurrentPage('dashboard');
          }, 2000);
        } else {
          setError(result.error || 'Failed to record medical information');
        }
      } catch (err) {
        setError('Error recording medical information: ' + err.message);
      } finally {
        setLoading(false);
      }
    };

    return (
      <div className="medical-record-container">
        <nav className="dashboard-nav">
          <div className="nav-brand">
            <h2>🩺 MediCare Virtual</h2>
          </div>
          <div className="nav-actions">
            <button onClick={() => setCurrentPage('dashboard')} className="logout-btn">
              Back to Dashboard
            </button>
          </div>
        </nav>

        <div className="medical-content">
          <header className="medical-header">
            <h1>📊 Record Medical Information</h1>
            <p>Enter your vital signs and health information</p>
          </header>

          {error && <div className="alert alert-error">{error}</div>}
          {success && <div className="alert alert-success">{success}</div>}

          <form className="medical-form" onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="bloodPressure">Blood Pressure (mmHg)</label>
                <input
                  type="text"
                  id="bloodPressure"
                  name="bloodPressure"
                  placeholder="e.g., 120/80"
                  value={formData.bloodPressure}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="bloodSugar">Blood Sugar (mg/dL)</label>
                <input
                  type="number"
                  id="bloodSugar"
                  name="bloodSugar"
                  placeholder="e.g., 100"
                  value={formData.bloodSugar}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="temperature">Temperature (°F)</label>
                <input
                  type="number"
                  id="temperature"
                  name="temperature"
                  step="0.1"
                  placeholder="e.g., 98.6"
                  value={formData.temperature}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="weight">Weight (lbs)</label>
                <input
                  type="number"
                  id="weight"
                  name="weight"
                  placeholder="e.g., 165"
                  value={formData.weight}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="height">Height (inches)</label>
                <input
                  type="number"
                  id="height"
                  name="height"
                  placeholder="e.g., 70"
                  value={formData.height}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="notes">Additional Notes</label>
              <textarea
                id="notes"
                name="notes"
                placeholder="Any additional health observations..."
                value={formData.notes}
                onChange={handleInputChange}
                rows="4"
              />
            </div>

            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? 'Recording...' : 'Record Information'}
            </button>
          </form>
        </div>
      </div>
    );
  };

  // Record Prescription Component
  const RecordPrescription = () => {
    const [formData, setFormData] = useState({
      medication: '',
      dosage: '',
      frequency: '',
      duration: '',
      refillsRemaining: '3',
      doctorId: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleInputChange = (e) => {
      const { name, value } = e.target;
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      setLoading(true);
      setError('');
      setSuccess('');

      if (!formData.medication) {
        setError('Please enter medication name');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`${API_BASE_URL}/health/prescription`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            patientEmail: userEmail,
            ...formData,
            refillsRemaining: parseInt(formData.refillsRemaining)
          }),
        });

        const result = await response.json();

        if (result.success) {
          setSuccess('Prescription recorded successfully! ✓');
          setFormData({
            medication: '',
            dosage: '',
            frequency: '',
            duration: '',
            refillsRemaining: '3',
            doctorId: '',
          });
          setTimeout(() => {
            setCurrentPage('dashboard');
          }, 2000);
        } else {
          setError(result.error || 'Failed to record prescription');
        }
      } catch (err) {
        setError('Error recording prescription: ' + err.message);
      } finally {
        setLoading(false);
      }
    };

    return (
      <div className="prescription-container">
        <nav className="dashboard-nav">
          <div className="nav-brand">
            <h2>🩺 MediCare Virtual</h2>
          </div>
          <div className="nav-actions">
            <button onClick={() => setCurrentPage('dashboard')} className="logout-btn">
              Back to Dashboard
            </button>
          </div>
        </nav>

        <div className="prescription-content">
          <header className="prescription-header">
            <h1>💊 Record Prescription</h1>
            <p>Enter your medication and dosage information</p>
          </header>

          {error && <div className="alert alert-error">{error}</div>}
          {success && <div className="alert alert-success">{success}</div>}

          <form className="prescription-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="medication">Medication Name *</label>
              <input
                type="text"
                id="medication"
                name="medication"
                placeholder="e.g., Aspirin, Metformin"
                value={formData.medication}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="dosage">Dosage</label>
                <input
                  type="text"
                  id="dosage"
                  name="dosage"
                  placeholder="e.g., 500mg, 10ml"
                  value={formData.dosage}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="frequency">Frequency</label>
                <input
                  type="text"
                  id="frequency"
                  name="frequency"
                  placeholder="e.g., Once daily, Twice daily"
                  value={formData.frequency}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="duration">Duration</label>
                <input
                  type="text"
                  id="duration"
                  name="duration"
                  placeholder="e.g., 30 days, 3 months"
                  value={formData.duration}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="refillsRemaining">Refills Remaining</label>
                <input
                  type="number"
                  id="refillsRemaining"
                  name="refillsRemaining"
                  min="0"
                  value={formData.refillsRemaining}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? 'Recording...' : 'Record Prescription'}
            </button>
          </form>
        </div>
      </div>
    );
  };

  // Telemedicine Component
  const Telemedicine = () => {
    const [consultations, setConsultations] = useState([]);
    const [formData, setFormData] = useState({ date: '', time: '', type: 'video', reason: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleSubmit = async (e) => {
      e.preventDefault();
      setLoading(true);
      setError('');
      setSuccess('');

      try {
        const response = await fetch(`${API_BASE_URL}/features/consultation/book`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ patientEmail: userEmail, doctorId: 1, ...formData })
        });

        const result = await response.json();
        if (result.success) {
          setSuccess('Consultation booked! Video link: ' + result.data.videoLink);
          setFormData({ date: '', time: '', type: 'video', reason: '' });
        } else {
          setError(result.error || 'Failed to book consultation');
        }
      } catch (err) {
        setError('Error: ' + err.message);
      } finally {
        setLoading(false);
      }
    };

    return (
      <div className="feature-container">
        <nav className="dashboard-nav">
          <div className="nav-brand"><h2>🩺 MediCare Virtual</h2></div>
          <div className="nav-actions">
            <button onClick={() => setCurrentPage('dashboard')} className="logout-btn">Back</button>
          </div>
        </nav>
        <div className="feature-content">
          <header className="feature-header">
            <h1>📹 Telemedicine Consultation</h1>
            <p>Book a video or audio consultation with doctors</p>
          </header>
          {error && <div className="alert alert-error">{error}</div>}
          {success && <div className="alert alert-success">{success}</div>}
          <form onSubmit={handleSubmit} className="feature-form">
            <div className="form-row">
              <div className="form-group">
                <label>Consultation Type</label>
                <select value={formData.type} onChange={(e) => setFormData({...formData, type: e.target.value})}>
                  <option value="video">Video Call</option>
                  <option value="audio">Audio Call</option>
                </select>
              </div>
              <div className="form-group">
                <label>Date</label>
                <input type="date" value={formData.date} onChange={(e) => setFormData({...formData, date: e.target.value})} required />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Time</label>
                <input type="time" value={formData.time} onChange={(e) => setFormData({...formData, time: e.target.value})} required />
              </div>
              <div className="form-group">
                <label>Reason for Visit</label>
                <input type="text" value={formData.reason} onChange={(e) => setFormData({...formData, reason: e.target.value})} placeholder="Describe your concern" />
              </div>
            </div>
            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? 'Booking...' : 'Book Consultation'}
            </button>
          </form>
        </div>
      </div>
    );
  };

  // Lab Reports Component
  const LabReports = () => {
    const [reports, setReports] = useState([]);
    const [formData, setFormData] = useState({ testName: '', testDate: '', results: '', laboratorName: '', notes: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
      fetchReports();
    }, []);

    const fetchReports = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/features/lab-reports?email=${userEmail}`);
        const result = await response.json();
        if (result.success) setReports(result.data);
      } catch (err) {
        setError('Failed to load reports');
      }
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      setLoading(true);
      setError('');

      try {
        const response = await fetch(`${API_BASE_URL}/features/lab-report`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ patientEmail: userEmail, ...formData })
        });

        const result = await response.json();
        if (result.success) {
          fetchReports();
          setFormData({ testName: '', testDate: '', results: '', laboratorName: '', notes: '' });
        }
      } catch (err) {
        setError('Error: ' + err.message);
      } finally {
        setLoading(false);
      }
    };

    return (
      <div className="feature-container">
        <nav className="dashboard-nav">
          <div className="nav-brand"><h2>🩺 MediCare Virtual</h2></div>
          <div className="nav-actions">
            <button onClick={() => setCurrentPage('dashboard')} className="logout-btn">Back</button>
          </div>
        </nav>
        <div className="feature-content">
          <header className="feature-header">
            <h1>🔬 Lab Reports</h1>
            <p>Upload and manage your test results</p>
          </header>
          {error && <div className="alert alert-error">{error}</div>}
          <form onSubmit={handleSubmit} className="feature-form">
            <div className="form-row">
              <div className="form-group">
                <label>Test Name</label>
                <input type="text" value={formData.testName} onChange={(e) => setFormData({...formData, testName: e.target.value})} required />
              </div>
              <div className="form-group">
                <label>Test Date</label>
                <input type="date" value={formData.testDate} onChange={(e) => setFormData({...formData, testDate: e.target.value})} required />
              </div>
            </div>
            <div className="form-group">
              <label>Results</label>
              <textarea value={formData.results} onChange={(e) => setFormData({...formData, results: e.target.value})} rows="3" placeholder="Enter test results" />
            </div>
            <div className="form-group">
              <label>Laboratory Name</label>
              <input type="text" value={formData.laboratorName} onChange={(e) => setFormData({...formData, laboratorName: e.target.value})} />
            </div>
            <button type="submit" className="submit-btn" disabled={loading}>{loading ? 'Uploading...' : 'Upload Report'}</button>
          </form>
          <div className="reports-list">
            <h3>Your Reports</h3>
            {reports.map(report => (
              <div key={report.id} className="report-item">
                <h4>{report.testName}</h4>
                <p><strong>Date:</strong> {report.testDate}</p>
                <p><strong>Lab:</strong> {report.laboratorName}</p>
                <p><strong>Results:</strong> {report.results}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // Drug Interactions Checker
  const DrugInteractions = () => {
    const [medications, setMedications] = useState('');
    const [interactions, setInteractions] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleCheck = async (e) => {
      e.preventDefault();
      const medList = medications.split(',').map(m => m.trim()).filter(m => m);
      
      if (medList.length < 2) {
        setError('Please enter at least 2 medications');
        return;
      }

      setLoading(true);
      setError('');

      try {
        const response = await fetch(`${API_BASE_URL}/features/drug-interactions`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ medications: medList })
        });

        const result = await response.json();
        setInteractions(result.data);
      } catch (err) {
        setError('Error: ' + err.message);
      } finally {
        setLoading(false);
      }
    };

    return (
      <div className="feature-container">
        <nav className="dashboard-nav">
          <div className="nav-brand"><h2>🩺 MediCare Virtual</h2></div>
          <div className="nav-actions">
            <button onClick={() => setCurrentPage('dashboard')} className="logout-btn">Back</button>
          </div>
        </nav>
        <div className="feature-content">
          <header className="feature-header">
            <h1>⚠️ Drug Interactions Checker</h1>
            <p>Check for potential medication interactions</p>
          </header>
          {error && <div className="alert alert-error">{error}</div>}
          <form onSubmit={handleCheck} className="feature-form">
            <div className="form-group">
              <label>Enter Medications (comma-separated)</label>
              <textarea value={medications} onChange={(e) => setMedications(e.target.value)} 
                placeholder="e.g., Aspirin, Metformin, Warfarin" rows="3" />
            </div>
            <button type="submit" className="submit-btn" disabled={loading}>{loading ? 'Checking...' : 'Check Interactions'}</button>
          </form>
          {interactions && (
            <div className="interaction-results">
              <h3>Results: {interactions.totalMedications} medications analyzed</h3>
              {interactions.hasInteractions ? (
                <div className="interactions-list">
                  {interactions.interactions.map((inter, idx) => (
                    <div key={idx} className="interaction-alert">
                      <strong>⚠️ {inter.drug1} + {inter.drug2}</strong>
                      <p>{inter.warning}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p style={{color: '#38a169'}}>✅ No significant interactions found!</p>
              )}
            </div>
          )}
        </div>
      </div>
    );
  };

  // Vaccinations Component
  const VaccinationRecords = () => {
    const [vaccinations, setVaccinations] = useState([]);
    const [formData, setFormData] = useState({ vaccineName: '', date: '', nextDue: '', notes: '' });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
      fetchVaccinations();
    }, []);

    const fetchVaccinations = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/features/vaccinations?email=${userEmail}`);
        const result = await response.json();
        if (result.success) setVaccinations(result.data);
      } catch (err) {
        console.error('Error');
      }
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      setLoading(true);

      try {
        const response = await fetch(`${API_BASE_URL}/features/vaccination`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ patientEmail: userEmail, ...formData })
        });

        if ((await response.json()).success) {
          fetchVaccinations();
          setFormData({ vaccineName: '', date: '', nextDue: '', notes: '' });
        }
      } catch (err) {
        console.error('Error');
      } finally {
        setLoading(false);
      }
    };

    return (
      <div className="feature-container">
        <nav className="dashboard-nav">
          <div className="nav-brand"><h2>🩺 MediCare Virtual</h2></div>
          <div className="nav-actions">
            <button onClick={() => setCurrentPage('dashboard')} className="logout-btn">Back</button>
          </div>
        </nav>
        <div className="feature-content">
          <header className="feature-header">
            <h1>💉 Vaccination Records</h1>
            <p>Track your immunizations and boosters</p>
          </header>
          <form onSubmit={handleSubmit} className="feature-form">
            <div className="form-row">
              <div className="form-group">
                <label>Vaccine Name</label>
                <input type="text" value={formData.vaccineName} onChange={(e) => setFormData({...formData, vaccineName: e.target.value})} required />
              </div>
              <div className="form-group">
                <label>Date Given</label>
                <input type="date" value={formData.date} onChange={(e) => setFormData({...formData, date: e.target.value})} required />
              </div>
            </div>
            <div className="form-group">
              <label>Next Due Date</label>
              <input type="date" value={formData.nextDue} onChange={(e) => setFormData({...formData, nextDue: e.target.value})} />
            </div>
            <button type="submit" className="submit-btn" disabled={loading}>{loading ? 'Recording...' : 'Record Vaccination'}</button>
          </form>
          <div className="vac-list">
            <h3>Your Vaccinations</h3>
            {vaccinations.map(vac => (
              <div key={vac.id} className="vac-item">
                <h4>💉 {vac.vaccineName}</h4>
                <p><strong>Date:</strong> {vac.date}</p>
                {vac.nextDue && <p><strong>Next Due:</strong> {vac.nextDue}</p>}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // Allergies Component
  const AllergyTracker = () => {
    const [allergies, setAllergies] = useState([]);
    const [formData, setFormData] = useState({ allergyName: '', severity: 'moderate', reaction: '', notes: '' });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
      fetchAllergies();
    }, []);

    const fetchAllergies = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/features/allergies?email=${userEmail}`);
        const result = await response.json();
        if (result.success) setAllergies(result.data);
      } catch (err) {
        console.error('Error');
      }
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      setLoading(true);

      try {
        const response = await fetch(`${API_BASE_URL}/features/allergy`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ patientEmail: userEmail, ...formData })
        });

        if ((await response.json()).success) {
          fetchAllergies();
          setFormData({ allergyName: '', severity: 'moderate', reaction: '', notes: '' });
        }
      } catch (err) {
        console.error('Error');
      } finally {
        setLoading(false);
      }
    };

    return (
      <div className="feature-container">
        <nav className="dashboard-nav">
          <div className="nav-brand"><h2>🩺 MediCare Virtual</h2></div>
          <div className="nav-actions">
            <button onClick={() => setCurrentPage('dashboard')} className="logout-btn">Back</button>
          </div>
        </nav>
        <div className="feature-content">
          <header className="feature-header">
            <h1>🚨 Allergy Tracker</h1>
            <p>Manage and track your allergies</p>
          </header>
          <form onSubmit={handleSubmit} className="feature-form">
            <div className="form-row">
              <div className="form-group">
                <label>Allergy Name</label>
                <input type="text" value={formData.allergyName} onChange={(e) => setFormData({...formData, allergyName: e.target.value})} required />
              </div>
              <div className="form-group">
                <label>Severity</label>
                <select value={formData.severity} onChange={(e) => setFormData({...formData, severity: e.target.value})}>
                  <option value="mild">Mild</option>
                  <option value="moderate">Moderate</option>
                  <option value="severe">Severe</option>
                </select>
              </div>
            </div>
            <div className="form-group">
              <label>Reaction</label>
              <input type="text" value={formData.reaction} onChange={(e) => setFormData({...formData, reaction: e.target.value})} placeholder="Describe reaction" />
            </div>
            <button type="submit" className="submit-btn" disabled={loading}>{loading ? 'Recording...' : 'Record Allergy'}</button>
          </form>
          <div className="allergy-list">
            <h3>Your Allergies</h3>
            {allergies.map(allergy => (
              <div key={allergy.id} className={`allergy-item severity-${allergy.severity}`}>
                <h4>🚨 {allergy.allergyName}</h4>
                <p><strong>Severity:</strong> {allergy.severity}</p>
                {allergy.reaction && <p><strong>Reaction:</strong> {allergy.reaction}</p>}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // Fitness Tracker Component
  const FitnessTracker = () => {
    const [activities, setActivities] = useState([]);
    const [formData, setFormData] = useState({ activityType: 'running', duration: '', calories: '', date: '', notes: '' });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
      fetchActivities();
    }, []);

    const fetchActivities = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/features/fitness-data?email=${userEmail}`);
        const result = await response.json();
        if (result.success) setActivities(result.data);
      } catch (err) {
        console.error('Error');
      }
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      setLoading(true);

      try {
        const response = await fetch(`${API_BASE_URL}/features/fitness-activity`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ patientEmail: userEmail, ...formData })
        });

        if ((await response.json()).success) {
          fetchActivities();
          setFormData({ activityType: 'running', duration: '', calories: '', date: '', notes: '' });
        }
      } catch (err) {
        console.error('Error');
      } finally {
        setLoading(false);
      }
    };

    return (
      <div className="feature-container">
        <nav className="dashboard-nav">
          <div className="nav-brand"><h2>🩺 MediCare Virtual</h2></div>
          <div className="nav-actions">
            <button onClick={() => setCurrentPage('dashboard')} className="logout-btn">Back</button>
          </div>
        </nav>
        <div className="feature-content">
          <header className="feature-header">
            <h1>🏃 Fitness Tracker</h1>
            <p>Log your workouts and wellness activities</p>
          </header>
          <form onSubmit={handleSubmit} className="feature-form">
            <div className="form-row">
              <div className="form-group">
                <label>Activity Type</label>
                <select value={formData.activityType} onChange={(e) => setFormData({...formData, activityType: e.target.value})}>
                  <option value="running">Running</option>
                  <option value="walking">Walking</option>
                  <option value="gym">Gym</option>
                  <option value="yoga">Yoga</option>
                  <option value="cycling">Cycling</option>
                  <option value="swimming">Swimming</option>
                </select>
              </div>
              <div className="form-group">
                <label>Duration (minutes)</label>
                <input type="number" value={formData.duration} onChange={(e) => setFormData({...formData, duration: e.target.value})} required />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Calories Burned</label>
                <input type="number" value={formData.calories} onChange={(e) => setFormData({...formData, calories: e.target.value})} />
              </div>
              <div className="form-group">
                <label>Date</label>
                <input type="date" value={formData.date} onChange={(e) => setFormData({...formData, date: e.target.value})} />
              </div>
            </div>
            <button type="submit" className="submit-btn" disabled={loading}>{loading ? 'Logging...' : 'Log Activity'}</button>
          </form>
          <div className="activity-list">
            <h3>Recent Activities</h3>
            {activities.map(activity => (
              <div key={activity.id} className="activity-item">
                <h4>{activity.activityType.toUpperCase()}</h4>
                <p><strong>Duration:</strong> {activity.duration} min | <strong>Calories:</strong> {activity.calories}</p>
                <p><strong>Date:</strong> {activity.date}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // Emergency Contacts Component
  const EmergencyContacts = () => {
    const [contacts, setContacts] = useState([]);
    const [formData, setFormData] = useState({ name: '', relationship: '', phone: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
      fetchContacts();
    }, []);

    const fetchContacts = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/features/emergency-contacts?email=${userEmail}`);
        const result = await response.json();
        if (result.success) setContacts(result.data);
      } catch (err) {
        setError('Failed to load contacts');
      }
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      setLoading(true);
      setError('');

      try {
        const response = await fetch(`${API_BASE_URL}/features/emergency-contact`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ patientEmail: userEmail, ...formData })
        });

        if ((await response.json()).success) {
          fetchContacts();
          setFormData({ name: '', relationship: '', phone: '' });
        }
      } catch (err) {
        setError('Error: ' + err.message);
      } finally {
        setLoading(false);
      }
    };

    const triggerAlert = async () => {
      try {
        await fetch(`${API_BASE_URL}/features/emergency-alert`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ patientEmail: userEmail, message: 'Medical Emergency!' })
        });
        alert('Emergency alert sent to all contacts!');
      } catch (err) {
        alert('Error sending alert');
      }
    };

    return (
      <div className="feature-container">
        <nav className="dashboard-nav">
          <div className="nav-brand"><h2>🩺 MediCare Virtual</h2></div>
          <div className="nav-actions">
            <button onClick={() => setCurrentPage('dashboard')} className="logout-btn">Back</button>
          </div>
        </nav>
        <div className="feature-content">
          <header className="feature-header">
            <h1>🆘 Emergency Contacts</h1>
            <p>Manage emergency contacts for urgent situations</p>
          </header>
          {error && <div className="alert alert-error">{error}</div>}
          <div className="emergency-alert-section">
            <button onClick={triggerAlert} className="emergency-btn">🚨 TRIGGER EMERGENCY ALERT</button>
          </div>
          <form onSubmit={handleSubmit} className="feature-form">
            <div className="form-row">
              <div className="form-group">
                <label>Name</label>
                <input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required />
              </div>
              <div className="form-group">
                <label>Relationship</label>
                <input type="text" value={formData.relationship} onChange={(e) => setFormData({...formData, relationship: e.target.value})} placeholder="e.g., Sister, Friend" />
              </div>
            </div>
            <div className="form-group">
              <label>Phone Number</label>
              <input type="tel" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} required />
            </div>
            <button type="submit" className="submit-btn" disabled={loading}>{loading ? 'Adding...' : 'Add Contact'}</button>
          </form>
          <div className="contacts-list">
            <h3>Your Emergency Contacts</h3>
            {contacts.map(contact => (
              <div key={contact.id} className="contact-item">
                <h4>{contact.name}</h4>
                <p><strong>Relationship:</strong> {contact.relationship}</p>
                <p><strong>Phone:</strong> {contact.phone}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // Health Dashboard Component
  const HealthDashboard = () => {
    const [healthData, setHealthData] = useState(null);
    const [suggestions, setSuggestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
      fetchHealthData();
    }, []);

    const fetchHealthData = async () => {
      try {
        const response = await fetch(
          `${API_BASE_URL}/health/health-dashboard?email=${userEmail}`
        );
        const result = await response.json();
        if (result.success) {
          setHealthData(result.data.healthData);
          setSuggestions(result.data.suggestions);
        }
      } catch (err) {
        setError('Failed to load health data');
      } finally {
        setLoading(false);
      }
    };

    return (
      <div className="health-dashboard-container">
        <nav className="dashboard-nav">
          <div className="nav-brand">
            <h2>🩺 MediCare Virtual</h2>
          </div>
          <div className="nav-actions">
            <button onClick={() => setCurrentPage('dashboard')} className="logout-btn">
              Back to Dashboard
            </button>
          </div>
        </nav>

        <div className="health-content">
          <header className="health-header">
            <h1>📊 Health Dashboard</h1>
            <p>Your complete health overview and personalized suggestions</p>
          </header>

          {error && <div className="alert alert-error">{error}</div>}

          {loading ? (
            <div className="loading">Loading health data...</div>
          ) : (
            <>
              {/* Appointments Summary */}
              <div className="health-section">
                <h2>📅 Appointment History</h2>
                {healthData?.appointments?.length > 0 ? (
                  <div className="appointments-summary">
                    {healthData.appointments.map((apt) => (
                      <div key={apt.id} className="summary-card">
                        <div className="summary-header">
                          <h3>{apt.doctorName}</h3>
                          <span className={`status status-${apt.status}`}>{apt.status}</span>
                        </div>
                        <p><strong>Date:</strong> {apt.date} at {apt.time}</p>
                        <p><strong>Symptoms:</strong> {apt.symptoms}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="empty-message">No appointments yet</p>
                )}
              </div>

              {/* Prescriptions Summary */}
              <div className="health-section">
                <h2>💊 Medications</h2>
                {healthData?.prescriptions?.length > 0 ? (
                  <div className="prescriptions-summary">
                    {healthData.prescriptions.map((rx) => (
                      <div key={rx.id} className="summary-card">
                        <div className="summary-header">
                          <h3>{rx.medication}</h3>
                          <span className="refills">Refills: {rx.refillsRemaining}</span>
                        </div>
                        <p><strong>Dosage:</strong> {rx.dosage}</p>
                        <p><strong>Frequency:</strong> {rx.frequency}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="empty-message">No prescriptions recorded</p>
                )}
              </div>

              {/* Health Suggestions */}
              <div className="health-section">
                <h2>💡 Health Suggestions</h2>
                {suggestions.length > 0 ? (
                  <div className="suggestions-list">
                    {suggestions.map((suggestion, idx) => (
                      <div key={idx} className={`suggestion-card priority-${suggestion.priority}`}>
                        <div className="suggestion-icon">
                          {suggestion.type === 'symptom-based' && '🩺'}
                          {suggestion.type === 'prescription-refill' && '💊'}
                          {suggestion.type === 'doctor-recommendation' && '👨‍⚕️'}
                          {suggestion.type === 'preventive' && '✅'}
                          {suggestion.type === 'lifestyle' && '🏃'}
                        </div>
                        <div className="suggestion-content">
                          {suggestion.symptom && <h4>Symptom: {suggestion.symptom}</h4>}
                          {suggestion.medication && <h4>Medication: {suggestion.medication}</h4>}
                          <p>{suggestion.suggestion}</p>
                        </div>
                        <span className={`priority-badge ${suggestion.priority}`}>
                          {suggestion.priority.toUpperCase()}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="empty-message">No suggestions at the moment</p>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    );
  };

  // Render current page
  const renderPage = () => {
    switch (currentPage) {
      case 'login':
        return <Login />;
      case 'signup':
        return <Signup />;
      case 'dashboard':
        return <Dashboard />;
      case 'book-appointment':
        return <BookAppointment />;
      case 'my-appointments':
        return <ViewAppointments />;
      case 'doctor-appointments':
        return <DoctorAppointments />;
      case 'doctor-messages':
        return <DoctorMessaging />;
      case 'health-dashboard':
        return <HealthDashboard />;
      case 'record-medical':
        return <RecordMedicalInfo />;
      case 'record-prescription':
        return <RecordPrescription />;
      case 'telemedicine':
        return <Telemedicine />;
      case 'lab-reports':
        return <LabReports />;
      case 'drug-interactions':
        return <DrugInteractions />;
      case 'vaccinations':
        return <VaccinationRecords />;
      case 'allergies':
        return <AllergyTracker />;
      case 'fitness':
        return <FitnessTracker />;
      case 'emergency-contacts':
        return <EmergencyContacts />;
      case 'connection-test':
        return <ConnectionTest />;
      default:
        return <Home />;
    }
  };

  return <div className="App">{renderPage()}</div>;
}

export default App;
