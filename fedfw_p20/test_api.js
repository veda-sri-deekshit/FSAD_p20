const http = require('http');

function makeRequest(method, path, body = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 5000,
      path: path,
      method: method,
      headers: {
        'Content-Type': 'application/json'
      }
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        resolve({ statusCode: res.statusCode, body: data });
      });
    });

    req.on('error', reject);
    if (body) req.write(body);
    req.end();
  });
}

async function runTests() {
  console.log('\n📡 API ENDPOINT TEST SUITE\n');
  console.log('='.repeat(50));
  
  // Test 1: Signup
  console.log('\nTEST 1: SIGNUP');
  console.log('Endpoint: POST /api/auth/signup');
  const signup = JSON.stringify({email:"test@test.com",password:"Test@123",role:"patient"});
  try {
    const r1 = await makeRequest('POST', '/api/auth/signup', signup);
    console.log('Status Code: ' + r1.statusCode);
    console.log('Response: ' + JSON.stringify(JSON.parse(r1.body), null, 2));
  } catch(e) {
    console.log('Error: ' + e.message);
  }
  
  // Test 2: User Profile
  console.log('\nTEST 2: USER PROFILE');
  console.log('Endpoint: GET /api/user/profile?email=patient@test.com');
  try {
    const r2 = await makeRequest('GET', '/api/user/profile?email=patient@test.com');
    console.log('Status Code: ' + r2.statusCode);
    console.log('Response: ' + JSON.stringify(JSON.parse(r2.body), null, 2));
  } catch(e) {
    console.log('Error: ' + e.message);
  }
  
  // Test 3: Appointments
  console.log('\nTEST 3: APPOINTMENTS');
  console.log('Endpoint: GET /api/appointments?email=patient@test.com');
  try {
    const r3 = await makeRequest('GET', '/api/appointments?email=patient@test.com');
    console.log('Status Code: ' + r3.statusCode);
    console.log('Response: ' + JSON.stringify(JSON.parse(r3.body), null, 2));
  } catch(e) {
    console.log('Error: ' + e.message);
  }
  
  // Test 4: Health Dashboard
  console.log('\nTEST 4: HEALTH DASHBOARD');
  console.log('Endpoint: GET /api/health/health-dashboard?email=patient@test.com');
  try {
    const r4 = await makeRequest('GET', '/api/health/health-dashboard?email=patient@test.com');
    console.log('Status Code: ' + r4.statusCode);
    console.log('Response: ' + JSON.stringify(JSON.parse(r4.body), null, 2));
  } catch(e) {
    console.log('Error: ' + e.message);
  }
  
  console.log('\n' + '='.repeat(50));
  console.log('Test suite complete!');
}

runTests().catch(console.error);
