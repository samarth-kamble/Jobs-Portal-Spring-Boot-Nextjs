const axios = require('axios');

const API_URL = 'http://localhost:8080';

async function testEndDateConfig() {
  try {
    // 1. Register an employer token
    console.log("Registering a new employer...");
    const email = `test.hr.${Date.now()}@techcorp.com`;
    const registerRes = await axios.post(`${API_URL}/users/register`, {
      name: "Test Employer",
      email: email,
      password: "Password123!",
      accountType: "EMPLOYER"
    });

    // Attempt Login
    const loginRes = await axios.post(`${API_URL}/users/login`, {
      email: email,
      password: "Password123!"
    });
    const employerId = loginRes.data.profile?.id || loginRes.data.id || registerRes.data.id;
    const token = loginRes.data.jwt;
    console.log(`Logged in. Employer ID: ${employerId}`);

    const config = {
        headers: { Authorization: `Bearer ${token}` }
    };

    // 2. Post a job with a future end date
    console.log("Posting job with FUTURE end date...");
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 30); // 30 days from now

    await axios.post(`${API_URL}/jobs/post`, {
        jobTitle: "Future Developer",
        company: "Tech Corp",
        experience: "Mid Level",
        jobType: "Full Time",
        location: "Remote",
        packageOffered: 20,
        skillsRequired: ["Java", "React"],
        about: "Future job",
        description: "description",
        postedBy: employerId,
        jobStatus: "ACTIVE",
        endDate: futureDate.toISOString()
    }, config);

    // 3. Post a job with a past end date
    console.log("Posting job with PAST end date...");
    const pastDate = new Date();
    pastDate.setDate(pastDate.getDate() - 10); // 10 days ago

    await axios.post(`${API_URL}/jobs/post`, {
        jobTitle: "Expired Developer",
        company: "Tech Corp",
        experience: "Mid Level",
        jobType: "Full Time",
        location: "Remote",
        packageOffered: 20,
        skillsRequired: ["Java", "React"],
        about: "Expired job",
        description: "description",
        postedBy: employerId,
        jobStatus: "ACTIVE",
        endDate: pastDate.toISOString()
    }, config);

    console.log("Jobs posted successfully.");

    // 4. Fetch all jobs and verify filtering
    console.log("Fetching all jobs...");
    const jobsRes = await axios.get(`${API_URL}/jobs/get-all`);
    const jobs = jobsRes.data;

    console.log(`Total active/valid jobs returned: ${jobs.length}`);

    const futureJob = jobs.find(j => j.jobTitle === "Future Developer");
    const expiredJob = jobs.find(j => j.jobTitle === "Expired Developer");

    if (futureJob) {
        console.log("✅ SUCCESS: Future job is visible in the list.");
    } else {
        console.error("❌ ERROR: Future job is missing.");
    }

    if (!expiredJob) {
        console.log("✅ SUCCESS: Expired job is correctly HIDDEN from the list.");
    } else {
        console.error("❌ ERROR: Expired job is still visible!");
    }

  } catch (error) {
    console.error("Test failed:", error?.response?.data || error.message);
  }
}

testEndDateConfig();
