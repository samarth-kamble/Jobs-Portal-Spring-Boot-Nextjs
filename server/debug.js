const axios = require('axios');
const API_URL = 'http://localhost:8080';
async function run() {
  try {
    const email = `test.hr.${Date.now()}@techcorp.com`;
    const reg = await axios.post(`${API_URL}/users/register`, { name: "Test", email, password: "Password123!", accountType: "EMPLOYER" });
    const login = await axios.post(`${API_URL}/users/login`, { email, password: "Password123!" });
    const token = login.data.jwt;
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const date = new Date(); date.setDate(date.getDate() + 30);
    const res = await axios.post(`${API_URL}/jobs/post`, {
        jobTitle: "Test Job", company: "Test", experience: "Mid", jobType: "Full Time", location: "Remote", packageOffered: 20, skillsRequired: ["Java"], about: "test", description: "test", postedBy: login.data.profile.id || login.data.id || reg.data.id, jobStatus: "ACTIVE", endDate: date.toISOString()
    }, config);
    console.log("Success");
  } catch (e) {
    if (e.response) console.log(e.response.data);
    else console.log(e.message);
  }
}
run();
