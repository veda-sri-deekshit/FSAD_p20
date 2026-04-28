# Backend Testing Guide - MediCare Virtual

## ✅ Quick Verification Steps

### 1. **Check Backend Server Status**
```bash
# Backend should be running on port 5000
curl http://localhost:5000

# Check if admin dashboard loads
curl http://localhost:5000/admin
```

### 2. **Test API Endpoints**
```bash
# Test Dashboard Stats
curl http://localhost:5000/api/admin/stats

# Test Users Endpoint
curl http://localhost:5000/api/admin/users

# Test Appointments
curl http://localhost:5000/api/admin/appointments
```

### 3. **Frontend Network Requests (Browser Console)**

Open **http://localhost:5174** in Chrome and press **F12** to open Developer Tools:

#### Go to **Network** tab:
1. Login to the app
2. Try booking an appointment
3. Look for network requests (should see green ✅ 200 status)
4. Check XHR/Fetch requests

#### Expected Network Requests:
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `POST /api/appointments` - Book appointment
- `GET /api/doctors` - Get doctor list
- `GET /api/health/health-dashboard` - Get health data

#### Network Request should show:
```
Status: 200 OK
Time: < 100ms
Response: JSON data
```

### 4. **Check React-Backend Connection in Console**

Open **Console** tab in DevTools and paste this:

```javascript
// Test backend connection
fetch('http://localhost:5000/api/admin/stats')
  .then(r => r.json())
  .then(d => console.log('✅ Backend Connected!', d))
  .catch(e => console.log('❌ Backend Error:', e))
```

### 5. **Test Authentication Flow**

Open Console and run:

```javascript
// Sign up test
fetch('http://localhost:5000/api/auth/signup', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'test@example.com',
    password: 'Test123456',
    role: 'patient'
  })
})
.then(r => r.json())
.then(d => console.log('Signup Response:', d))
```

### 6. **Monitor Real-Time API Calls**

1. Open DevTools → Network tab
2. Filter by "XHR" (XMLHttpRequest)
3. Perform actions in app:
   - Fill signup form → Watch POST request
   - Login → Watch auth request
   - Click buttons → Watch API calls

### 7. **Check Backend Logs**

Look at the **Terminal** where backend is running:
- Should see requests logged with timestamps
- Format: `GET /api/admin/stats 200 - 5.234 ms`
- Errors will show in red

---

## 🔗 How React Connects to Backend

Your React app at **http://localhost:5174** connects to backend at **http://localhost:5000** by:

1. **API URL in Code**: 
   - File: `src/App.jsx`
   - Line: `const API_BASE_URL = 'http://localhost:5000/api';`

2. **Example API Call**:
   ```javascript
   fetch(`${API_BASE_URL}/auth/login`, {
     method: 'POST',
     headers: { 'Content-Type': 'application/json' },
     body: JSON.stringify({ email, password })
   })
   ```

3. **CORS** (Cross-Origin):
   - Backend has `import cors from 'cors';`
   - This allows React (5174) to call Backend (5000)

---

## 🛠️ Troubleshooting

### ❌ Connection Refused
```
Error: Cannot read property of undefined
Status: 0 or Connection Error
```
**Solution**: Make sure backend is running on port 5000

### ❌ CORS Error
```
Access to XMLHttpRequest blocked by CORS policy
```
**Solution**: CORS is already enabled in your backend

### ❌ 404 Route Not Found
```
GET /api/some-endpoint 404
```
**Solution**: Check endpoint name in apiRoutes.js

### ❌ 500 Internal Server Error
```
Status: 500
```
**Solution**: Check backend console for error message

---

## 📊 Verification Checklist

- [ ] Backend server running on localhost:5000
- [ ] Admin dashboard loads at http://localhost:5000
- [ ] React app running on localhost:5174
- [ ] Network requests show 200 status
- [ ] Console has no CORS errors
- [ ] Backend logs show incoming requests
- [ ] Can login and stay logged in
- [ ] Can create appointments
- [ ] Can view health records

---

## 🚀 Complete Test Workflow

1. **Start both servers**:
   ```bash
   # Terminal 1 - Backend
   cd backend
   npm start
   
   # Terminal 2 - Frontend
   cd fedfw_p20
   npm run dev
   ```

2. **Open in browser**: http://localhost:5174

3. **Open DevTools**: Press F12

4. **Go to Network tab**: Clear all

5. **Sign up**: 
   - Email: test123@example.com
   - Password: Test@12345
   - Role: Patient

6. **Watch Network tab**: Should see these requests:
   - POST /api/auth/signup ✅ 200
   - POST /api/auth/login ✅ 200

7. **Check Console**: Should have no red error messages

8. **Test Feature**: Click "Book Appointment"
   - Should see POST /api/appointments ✅ 200
   - Should get success message

9. **Verify Admin Dashboard**: Go to http://localhost:5000
   - Should see stats updating
   - Should see your new user

---

## 📝 API Response Examples

### Successful Login
```json
{
  "success": true,
  "message": "Login successful",
  "user": {
    "email": "test123@example.com",
    "role": "patient"
  }
}
```

### Successful Appointment Book
```json
{
  "success": true,
  "message": "Appointment booked successfully",
  "appointment": {
    "id": 101,
    "patientEmail": "test123@example.com",
    "doctorId": 1,
    "appointmentDate": "2026-04-15",
    "status": "pending"
  }
}
```

### Backend Stats
```json
{
  "success": true,
  "data": {
    "totalUsers": 5,
    "totalAppointments": 8,
    "totalHealthRecords": 3,
    "doctorCount": 5
  }
}
```
