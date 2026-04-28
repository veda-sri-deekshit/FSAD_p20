import nodemailer from 'nodemailer';

// Create transporter for Gmail (you can use any SMTP service)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER || '',
    pass: process.env.EMAIL_PASSWORD || ''
  }
});

// Check if email is configured
const isEmailConfigured = () => {
  return process.env.EMAIL_USER && 
         process.env.EMAIL_USER !== '' && 
         !process.env.EMAIL_USER.includes('your-email') &&
         process.env.EMAIL_PASSWORD && 
         process.env.EMAIL_PASSWORD !== '' &&
         !process.env.EMAIL_PASSWORD.includes('your-app-password');
};

/**
 * Send password reset OTP email
 */
export const sendPasswordResetEmail = async (userEmail, otp, userName = 'User') => {
  // If email not configured, just log and return
  if (!isEmailConfigured()) {
    console.log(`\n⚠️  EMAIL SERVICE NOT CONFIGURED`);
    console.log(`   Email will not be sent. Configure .env with EMAIL_USER and EMAIL_PASSWORD`);
    console.log(`   OTP for ${userEmail}: ${otp}\n`);
    return false;
  }

  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: userEmail,
      subject: '🔐 Your MediCare Password Reset Code',
      html: `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; border-radius: 10px 10px 0 0; text-align: center;">
              <h2 style="color: white; margin: 0;">🩺 MediCare Virtual</h2>
            </div>
            <div style="background: #f7fafc; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #e2e8f0;">
              <p style="color: #2d3748; font-size: 16px;">Hi ${userName},</p>
              <p style="color: #4a5568; font-size: 14px; margin: 20px 0;">We received a request to reset your password. Use the OTP below to proceed:</p>
              <div style="background: white; border: 2px solid #667eea; border-radius: 10px; padding: 20px; text-align: center; margin: 20px 0;">
                <p style="color: #667eea; font-size: 12px; margin: 0 0 10px 0; text-transform: uppercase; letter-spacing: 2px;">Your OTP Code</p>
                <p style="color: #2d3748; font-size: 32px; font-weight: bold; margin: 0; letter-spacing: 5px;">${otp}</p>
              </div>
              <p style="color: #718096; font-size: 13px; margin: 20px 0;">⏰ <strong>This OTP is valid for 10 minutes only.</strong></p>
              <div style="background: #fef5e7; border-left: 4px solid #f39c12; padding: 15px; border-radius: 5px; margin: 20px 0;">
                <p style="color: #7d6608; font-size: 13px; margin: 0;">⚠️ If you did not request a password reset, please ignore this email or contact support.</p>
              </div>
              <p style="color: #718096; font-size: 12px; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0;">Best regards,<br><strong>MediCare Virtual Team</strong></p>
            </div>
            <div style="text-align: center; padding-top: 20px; color: #718096; font-size: 11px;">
              <p>This is an automated email. Please do not reply to this message.</p>
              <p>&copy; 2025 MediCare Virtual. All rights reserved.</p>
            </div>
          </div>`
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ Email sent successfully to ${userEmail}`);
    return true;
  } catch (error) {
    console.error(`❌ Error sending email to ${userEmail}:`);
    console.error(`   ${error.message}`);
    console.log(`\n⚠️  Email failed. Check .env configuration.`);
    console.log(`   EMAIL_USER: ${process.env.EMAIL_USER ? '✓ Set' : '✗ Not set'}`);
    console.log(`   EMAIL_PASSWORD: ${process.env.EMAIL_PASSWORD ? '✓ Set' : '✗ Not set'}\n`);
    return false;
  }
};

/**
 * Send welcome email to new user
 */
export const sendWelcomeEmail = async (userEmail, userName = 'User') => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER || 'noreply@medicare.com',
      to: userEmail,
      subject: '👋 Welcome to MediCare Virtual',
      html: `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;"><div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; border-radius: 10px 10px 0 0; text-align: center;"><h2 style="color: white; margin: 0;">🩺 MediCare Virtual</h2></div><div style="background: #f7fafc; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #e2e8f0;"><p style="color: #2d3748; font-size: 16px;">Hi ${userName},</p><p style="color: #4a5568; font-size: 14px; margin: 20px 0;">Welcome to MediCare Virtual! Your account has been created successfully.</p><p style="color: #4a5568; font-size: 14px; margin: 15px 0;">You can now:</p><ul style="color: #4a5568; font-size: 14px; margin: 15px 0; padding-left: 20px;"><li>📅 Book appointments with healthcare professionals</li><li>📋 Access your medical records</li><li>💬 Consult with doctors online</li><li>💊 Get e-prescriptions</li></ul><div style="margin: 30px 0;"><a href="http://localhost:5173/login" style="background: #667eea; color: white; padding: 12px 30px; border-radius: 25px; text-decoration: none; display: inline-block; font-weight: bold;">Sign In Now</a></div><p style="color: #718096; font-size: 13px; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0;">Best regards,<br><strong>MediCare Virtual Team</strong></p></div></div>`
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ Welcome email sent to ${userEmail}`);
    return true;
  } catch (error) {
    console.error(`❌ Error sending welcome email to ${userEmail}:`, error.message);
    return false;
  }
};

/**
 * Verify transporter connection
 */
export const verifyEmailService = async () => {
  try {
    await transporter.verify();
    console.log('✅ Email service is ready to send messages');
    return true;
  } catch (error) {
    console.error('❌ Email service error:', error.message);
    return false;
  }
};
