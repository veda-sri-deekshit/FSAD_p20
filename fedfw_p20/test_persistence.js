import http from "http";

async function makeRequest(method, path, body = null, headers = {}) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: "localhost",
      port: 5000,
      path: path,
      method: method,
      headers: {
        "Content-Type": "application/json",
        ...headers
      }
    };

    const req = http.request(options, (res) => {
      let data = "";
      res.on("data", (chunk) => {
        data += chunk;
      });
      res.on("end", () => {
        resolve({
          status: res.statusCode,
          headers: res.headers,
          body: data
        });
      });
    });

    req.on("error", reject);
    if (body) {
      req.write(JSON.stringify(body));
    }
    req.end();
  });
}

async function testDataPersistence() {
  console.log("=== STEP 1: Login as patient@test.com ===");
  const loginResponse = await makeRequest("POST", "/api/auth/login", {
    email: "patient@test.com",
    password: "password123",
    role: "patient"
  });
  console.log(`Status: ${loginResponse.status}`);
  console.log(`Response:`, loginResponse.body);
  
  let token = null;
  try {
    const loginData = JSON.parse(loginResponse.body);
    token = loginData.token;
    console.log(`Token: ${token}`);
  } catch (e) {
    console.log("Failed to parse login response");
  }

  console.log("\n=== STEP 2: Record Vitals ===");
  const vitalHeaders = token ? { Authorization: `Bearer ${token}` } : {};
  const vitalResponse = await makeRequest("POST", "/api/health/medical-record", {
    patientEmail: "patient@test.com",
    bloodPressure: "120/80",
    bloodSugar: "100"
  }, vitalHeaders);
  console.log(`Status: ${vitalResponse.status}`);
  console.log(`Response:`, vitalResponse.body);

  console.log("\n=== STEP 3: Verify Data in Dashboard ===");
  const dashboardResponse = await makeRequest("GET", "/api/health/health-dashboard?email=patient@test.com", null, vitalHeaders);
  console.log(`Status: ${dashboardResponse.status}`);
  console.log(`Response:`, dashboardResponse.body);
}

testDataPersistence().catch(console.error);
