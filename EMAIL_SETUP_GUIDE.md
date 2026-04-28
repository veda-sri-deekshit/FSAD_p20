# 📧 Email Setup Guide for Forgot Password Feature

## Overview
The forgot password feature now sends **OTP (One-Time Password)** to the user's registered email address. The email service is configured with **Nodemailer**.

---

## ✅ Quick Setup (Gmail)

### Step 1: Enable 2-Factor Authentication
1. Go to [Google Account Security](https://myaccount.google.com/security)
2. Look for "2-Step Verification" and enable it
3. Complete the verification process

### Step 2: Generate App Password
1. Go to [Google Account App Passwords](https://myaccount.google.com/apppasswords)
2. Select "Mail" and "Windows Computer" (or your device)
3. Google will generate a 16-character password
4. Copy the password

### Step 3: Configure Backend
1. Open `backend/.env`
2. Add or uncomment these lines:
   ```
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASSWORD=your-16-char-app-password
   ```
3. Replace with your actual Gmail and the generated App Password
4. Save the file

### Step 4: Restart Backend
```bash
cd backend
npm run dev
```

---

## 🧪 Testing Password Reset

### Test Users (Auto-Created)
```
Patient:
  Email: patient@test.com
  Password: Patient@123

Doctor:
  Email: doctor@test.com
  Password: Doctor@123
```

### Test Steps
1. **Open the app**: http://localhost:5173
2. **Click "Sign In"** button
3. **In the login form**, click **"🔑 Forgot Password?"** link
4. **Enter email**: `patient@test.com`
5. **Click "Send OTP"**
6. **Check Terminal Output**: The OTP will be displayed in the backend terminal (for testing)
7. **Enter OTP** in the modal (6 digits)
8. **Enter New Password** (minimum 6 characters)
9. **Confirm Password**
10. **Click "Reset Password"**

---

## 📨 What Happens

### When User Requests Password Reset:
1. User enters their registered email
2. Backend generates a **6-digit OTP**
3. OTP is sent to their email with a **professional HTML template**
4. OTP is **valid for 10 minutes only**
5. User must enter OTP + new password to reset

### Email Template Includes:
- ✅ Professional branding (MediCare Virtual)
- ✅ Clear OTP display
- ✅ Expiry time (10 minutes)
- ✅ Security warning
- ✅ Support information

---

## 🔧 Alternative Email Services

### Using Outlook/Hotmail
```env
EMAIL_USER=your-email@outlook.com
EMAIL_PASSWORD=your-password
```

### Using Custom SMTP
Update `backend/src/utils/emailService.js`:
```javascript
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});
```

---

## 🐛 Troubleshooting

### Issue: "Email not sending"
❌ **Solution**: 
- Check EMAIL_USER and EMAIL_PASSWORD in .env
- For Gmail, ensure App Password (not regular password)
- Check terminal for error messages

### Issue: "User not found"
❌ **Solution**:
- Make sure you're using a registered email
- Try with test users: `patient@test.com` or `doctor@test.com`
- Or sign up with a new email first, then test forgot password

### Issue: "Invalid or expired OTP"
❌ **Solution**:
- OTP is valid for only 10 minutes
- Make sure you're entering the correct OTP from email
- OTP must be exactly 6 digits

### Issue: "Email not received"
❌ **Solution**:
- Check spam/junk folder
- Wait a few seconds (email sending takes time)
- Check backend terminal for errors
- Verify EMAIL_USER is correct

---

## 🔒 Security Notes

### Current Implementation (Development):
- OTP is displayed in terminal for testing
- Passwords are NOT hashed (for demo purposes)

### Production Recommendations:
1. **Remove OTP from terminal output**
2. **Hash passwords** using bcryptjs
3. **Use SSL/TLS** for email
4. **Implement rate limiting** on OTP requests
5. **Add email verification** on signup
6. **Store OTP in database** with encryption
7. **Add captcha** to prevent abuse

---

## 📋 API Endpoints

### Request Password Reset
```
POST /api/auth/forgot-password
Content-Type: application/json

{
  "email": "patient@test.com"
}

Response:
{
  "success": true,
  "message": "✅ OTP has been sent to your email",
  "email": "patient@test.com"
}
```

### Reset Password with OTP
```
POST /api/auth/reset-password
Content-Type: application/json

{
  "email": "patient@test.com",
  "otp": "123456",
  "newPassword": "NewPassword@123"
}

Response:
{
  "success": true,
  "message": "✅ Password reset successfully!"
}
```

---

## 📞 Need Help?

If email setup doesn't work:
1. Check the error message in backend terminal
2. Verify .env file has correct EMAIL_USER and EMAIL_PASSWORD
3. Ensure 2FA is enabled on Gmail
4. Use an App Password (not regular password)
5. Test with the provided test users first

---

**All set! Your forgot password feature is now ready to send emails! 🎉**
