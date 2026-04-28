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

async function verifyPersistence() {
  console.log("=== VERIFICATION: Record another vital reading ===");
  const vital2Response = await makeRequest("POST", "/api/health/medical-record", {
    patientEmail: "patient@test.com",
    bloodPressure: "130/85",
    bloodSugar: "115"
  });
  console.log(`Status: ${vital2Response.status}`);
  console.log(`Response:`, vital2Response.body);

  console.log("\n=== VERIFICATION: Check dashboard again to confirm data persists ===");
  const dashboardResponse = await makeRequest("GET", "/api/health/health-dashboard?email=patient@test.com");
  console.log(`Status: ${dashboardResponse.status}`);
  const dashboardData = JSON.parse(dashboardResponse.body);
  console.log(`Patient Email: ${dashboardData.data.healthRecord.patientEmail}`);
  console.log(`Blood Pressure: ${dashboardData.data.healthRecord.medicalInfo.bloodPressure}`);
  console.log(`Blood Sugar: ${dashboardData.data.healthRecord.medicalInfo.bloodSugar}`);
  console.log(`Last recorded at: ${dashboardData.data.healthRecord.medicalInfo.recordedAt}`);
  console.log(`Full Response:`, dashboardResponse.body);
}

verifyPersistence().catch(console.error);
