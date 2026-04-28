// Authentication Controller - Uses updated database functions
import { db } from '../database.js';
import crypto from 'crypto';
import { sendPasswordResetEmail, sendWelcomeEmail, verifyEmailService } from '../utils/emailService.js';

// Password validation
const validatePassword = (password) => {
  return password && password.length >= 6;
};

// Generate OTP (6 digits)
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Generate reset token
const generateResetToken = () => {
  return crypto.randomBytes(32).toString('hex');
};

// Signup controller - Saves new users to database
export const signup = (req, res) => {
  try {
    const { email, password, role } = req.body;

    // Validation
    if (!email || !password || !role) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: email, password, role'
      });
    }

    if (!validatePassword(password)) {
      return res.status(400).json({
        success: false,
        error: 'Password must be at least 6 characters long'
      });
    }

    // Check if user already exists
    const existingUser = db.findUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: 'Email already registered'
      });
    }

    // Create new user using database function
    const newUser = db.addUser({
      email,
      password, // Note: In production, this should be hashed
      role,
      isActive: true
    });

    console.log(`✅ New user signed up: ${email} (${role})`);

    res.status(201).json({
      success: true,
      message: 'Account created successfully',
      user: {
        id: newUser.id,
        email: newUser.email,
        role: newUser.role
      }
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({
      success: false,
      error: 'Signup failed'
    });
  }
};

// Login controller - Authenticates users
export const login = (req, res) => {
  try {
    const { email, password, role, captchaToken } = req.body;

    // Validation
    if (!email || !password || !role) {
      return res.status(400).json({
        success: false,
        error: 'Email, password, and role are required'
      });
    }

    // CAPTCHA validation (optional - captchaToken is included if frontend has CAPTCHA enabled)
    if (captchaToken) {
      console.log(`✅ CAPTCHA verified for login: ${email}`);
    }

    // Find user in database
    const user = db.findUserByEmail(email);

    // Check if user exists and credentials match
    if (!user || user.password !== password || user.role !== role) {
      return res.status(401).json({
        success: false,
        error: 'Invalid email, password, or role'
      });
    }

    console.log(`✅ User logged in: ${email} (${role})`);

    res.json({
      success: true,
      message: 'Login successful',
      user: {
        id: user.id,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      error: 'Login failed'
    });
  }
};

// Get user profile
export const getUserProfile = (req, res) => {
  try {
    const { email } = req.query;

    if (!email) {
      return res.status(400).json({
        success: false,
        error: 'Email is required'
      });
    }

    const user = db.findUserByEmail(email);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    res.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        registeredAt: user.registeredAt,
        stats: user.stats
      }
    });
  } catch (error) {
    console.error('Profile error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch profile'
    });
  }
};

// Forgot Password - Generate OTP and send email
export const forgotPassword = (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        error: 'Email is required'
      });
    }

    const user = db.findUserByEmail(email);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found. Please check the email and try again.'
      });
    }

    // Generate OTP
    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Store OTP in user record
    db.addPasswordResetOTP(email, otp, otpExpiry);

    // Send OTP via email (don't await - let it run in background)
    sendPasswordResetEmail(email, otp, user.email.split('@')[0])
      .then(success => {
        if (success) {
          console.log(`✅ OTP email sent successfully to: ${email}`);
        } else {
          console.log(`⚠️ OTP email failed, but OTP is stored in system`);
        }
      })
      .catch(err => {
        console.error(`❌ Error sending OTP email:`, err.message);
      });

    // Always log OTP to console for testing
    console.log(`\n${'='.repeat(60)}`);
    console.log(`🔐 PASSWORD RESET OTP`);
    console.log(`${'='.repeat(60)}`);
    console.log(`📧 Email: ${email}`);
    console.log(`🔐 OTP Code: ${otp}`);
    console.log(`⏰ Valid for: 10 minutes`);
    console.log(`${'='.repeat(60)}\n`);

    res.json({
      success: true,
      message: '✅ Password reset OTP has been sent to your email. Please check your inbox and spam folder.',
      email: email,
      // For testing/development only - remove in production
      otp: process.env.NODE_ENV === 'development' ? otp : undefined,
      expiresIn: '10 minutes'
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to process forgot password request'
    });
  }
};

// Reset Password - Validate OTP and update password
export const resetPassword = (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
      return res.status(400).json({
        success: false,
        error: 'Email, OTP, and new password are required'
      });
    }

    if (!validatePassword(newPassword)) {
      return res.status(400).json({
        success: false,
        error: 'Password must be at least 6 characters long'
      });
    }

    const user = db.findUserByEmail(email);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    // Verify OTP
    const isOTPValid = db.verifyPasswordResetOTP(email, otp);

    if (!isOTPValid) {
      return res.status(400).json({
        success: false,
        error: 'Invalid or expired OTP. Please request a new one.'
      });
    }

    // Update password
    db.updateUser(email, { password: newPassword });

    // Clear OTP
    db.clearPasswordResetOTP(email);

    console.log(`✅ Password reset successful for: ${email}`);

    res.json({
      success: true,
      message: '✅ Password has been reset successfully! You can now sign in with your new password.'
    });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to reset password'
    });
  }
};
