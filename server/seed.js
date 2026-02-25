const axios = require('axios');

const API_URL = 'http://localhost:8080';

// Mock Users
const USERS = {
  ADMIN: { name: 'Super Admin', email: 'admin@jobportal.com', password: 'Password@123', accountType: 'ADMIN' },
  EMPLOYER: { name: 'Tech Corp HR', email: 'hr@techcorp.com', password: 'Password@123', accountType: 'EMPLOYER' },
  APPLICANT: { name: 'John Doe', email: 'john@example.com', password: 'Password@123', accountType: 'APPLICANT' }
};

// Mock Jobs
const JOBS = [
  {
    jobTitle: "Senior Software Engineer",
    company: "Tech Corp",
    about: "We are building the future of cloud computing.",
    experience: "5+ Years",
    jobType: "Full-time",
    location: "Remote",
    packageOffered: 1500000,
    description: "Looking for a seasoned backend engineer with strong Java and Spring Boot experience.",
    skillsRequired: ["Java", "Spring Boot", "Microservices", "Docker"],
    jobStatus: "ACTIVE"
  },
  {
    jobTitle: "Frontend Developer",
    company: "Tech Corp",
    about: "Leading e-commerce platform.",
    experience: "Fresher",
    jobType: "Full-time",
    location: "New York, USA",
    packageOffered: 900000,
    description: "Build beautiful UIs using React and Next.js.",
    skillsRequired: ["React", "JavaScript", "Tailwind CSS"],
    jobStatus: "ACTIVE"
  },
  {
    jobTitle: "Data Scientist",
    company: "Tech Corp",
    about: "AI-driven analytics startup.",
    experience: "3+ Years",
    jobType: "Contract",
    location: "London, UK",
    packageOffered: 2000000,
    description: "Analyze large datasets and build predictive models.",
    skillsRequired: ["Python", "Machine Learning", "SQL", "Pandas"],
    jobStatus: "ACTIVE"
  },
  {
    jobTitle: "UI/UX Designer",
    company: "Tech Corp",
    about: "Award-winning design studio.",
    experience: "Mid Level",
    jobType: "Full-time",
    location: "Berlin, Germany",
    packageOffered: 1200000,
    description: "Create user-centric designs and wireframes.",
    skillsRequired: ["Figma", "Prototyping", "User Research"],
    jobStatus: "ACTIVE"
  },
  {
    jobTitle: "DevOps Engineer",
    company: "Tech Corp",
    about: "Infrastructure as Code pioneers.",
    experience: "4+ Years",
    jobType: "Full-time",
    location: "Remote",
    packageOffered: 1800000,
    description: "Manage AWS infrastructure and CI/CD pipelines.",
    skillsRequired: ["AWS", "Kubernetes", "Terraform", "Jenkins"],
    jobStatus: "ACTIVE"
  },
  {
    jobTitle: "Product Manager",
    company: "Tech Corp",
    about: "Fast-growing FinTech.",
    experience: "Executive",
    jobType: "Full-time",
    location: "San Francisco, USA",
    packageOffered: 2500000,
    description: "Lead product strategy from ideation to launch.",
    skillsRequired: ["Agile", "Roadmapping", "Stakeholder Management"],
    jobStatus: "ACTIVE"
  },
  {
    jobTitle: "Mobile App Developer",
    company: "Tech Corp",
    about: "Top 10 app on the App Store.",
    experience: "2+ Years",
    jobType: "Full-time",
    location: "Toronto, Canada",
    packageOffered: 1100000,
    description: "Develop seamless iOS and Android applications.",
    skillsRequired: ["React Native", "Swift", "Kotlin"],
    jobStatus: "ACTIVE"
  },
  {
    jobTitle: "Security Analyst",
    company: "Tech Corp",
    about: "Global cybersecurity firm.",
    experience: "Mid Level",
    jobType: "Full-time",
    location: "Remote",
    packageOffered: 1300000,
    description: "Identify and mitigate security risks in enterprise systems.",
    skillsRequired: ["Penetration Testing", "Network Security", "Auth"],
    jobStatus: "ACTIVE"
  },
  {
    jobTitle: "Full Stack Developer",
    company: "Tech Corp",
    about: "Innovative healthcare software solutions.",
    experience: "3+ Years",
    jobType: "Full-time",
    location: "Austin, TX",
    packageOffered: 1400000,
    description: "End-to-end development using Node.js and React.",
    skillsRequired: ["Node.js", "React", "MongoDB", "Express"],
    jobStatus: "ACTIVE"
  },
  {
    jobTitle: "Cloud Architect",
    company: "Tech Corp",
    about: "Enterprise cloud migration experts.",
    experience: "8+ Years",
    jobType: "Full-time",
    location: "Seattle, WA",
    packageOffered: 2200000,
    description: "Design scalable and secure cloud architectures.",
    skillsRequired: ["Azure", "AWS", "System Design"],
    jobStatus: "ACTIVE"
  },
  {
    jobTitle: "Software Engineer Intern",
    company: "Tech Corp",
    about: "Learn and grow with our engineering team.",
    experience: "Fresher",
    jobType: "Internship",
    location: "Remote",
    packageOffered: 400000,
    description: "Assist in developing core product features.",
    skillsRequired: ["Java", "SQL", "Git"],
    jobStatus: "ACTIVE"
  },
  {
    jobTitle: "Database Administrator",
    company: "Tech Corp",
    about: "Managing petabytes of data.",
    experience: "5+ Years",
    jobType: "Full-time",
    location: "Chicago, IL",
    packageOffered: 1600000,
    description: "Optimize and maintain complex database systems.",
    skillsRequired: ["PostgreSQL", "MongoDB", "Redis", "Tuning"],
    jobStatus: "ACTIVE"
  },
  {
    jobTitle: "QA Automation Engineer",
    company: "Tech Corp",
    about: "Ensuring zero-bug releases.",
    experience: "3+ Years",
    jobType: "Full-time",
    location: "Remote",
    packageOffered: 1000000,
    description: "Build robust automated test frameworks.",
    skillsRequired: ["Selenium", "Cypress", "Python"],
    jobStatus: "ACTIVE"
  },
  {
    jobTitle: "Blockchain Developer",
    company: "Tech Corp",
    about: "Next-gen Web3 applications.",
    experience: "Mid Level",
    jobType: "Contract",
    location: "Miami, FL",
    packageOffered: 1900000,
    description: "Develop smart contracts and decentralized apps.",
    skillsRequired: ["Solidity", "Ethereum", "Web3.js"],
    jobStatus: "ACTIVE"
  },
  {
    jobTitle: "Technical Writer",
    company: "Tech Corp",
    about: "Making complex systems easy to understand.",
    experience: "2+ Years",
    jobType: "Part-time",
    location: "Remote",
    packageOffered: 700000,
    description: "Create clear, concise API documentation and user guides.",
    skillsRequired: ["Documentation", "Markdown", "API Design"],
    jobStatus: "ACTIVE"
  }
];

async function seed() {
  try {
    console.log('🌱 Starting Database Seeding...');
    let employerToken = '';

    // 1. Create Employer & Applicant (via public register endpoint)
    for (const type of ['EMPLOYER', 'APPLICANT']) {
      const user = USERS[type];
      try {
        await axios.post(`${API_URL}/users/register`, user);
        console.log(`✅ Registered ${type}: ${user.email}`);
      } catch (e) {
        if (e.response?.data?.errorMessage === 'USER_FOUND') {
          console.log(`⚠️ ${type} already exists: ${user.email}`);
        } else {
          console.error(`❌ Failed to register ${type}:`, e.response?.data || e.message);
        }
      }
    }

    // 2. Login as Employer to get Token
    try {
      const loginRes = await axios.post(`${API_URL}/users/login`, {
        email: USERS.EMPLOYER.email,
        password: USERS.EMPLOYER.password
      });
      employerToken = loginRes.data.token;
      console.log('🔑 Logged in as Employer, got token.');
    } catch (e) {
      console.error('❌ Employer Login Failed:', e.response?.data || e.message);
      return;
    }

    // 3. Create Jobs
    const headers = { Authorization: `Bearer ${employerToken}` };
    let jobsCreated = 0;

    for (const job of JOBS) {
      try {
        await axios.post(`${API_URL}/jobs/post`, job, { headers });
        console.log(`✅ Posted Job: ${job.jobTitle}`);
        jobsCreated++;
      } catch (e) {
        console.error(`❌ Failed to post job ${job.jobTitle}:`, e.response?.data || e.message);
      }
    }
    console.log(`🎉 Successfully created ${jobsCreated} jobs.`);

    // 4. Admin creation - to do this via API securely, we either need an existing admin token
    // or we'll register the Admin directly if the backend allows accountType on register.
    try {
      await axios.post(`${API_URL}/users/register`, USERS.ADMIN);
      console.log(`✅ Registered ADMIN: ${USERS.ADMIN.email}`);
    } catch (e) {
        if (e.response?.data?.errorMessage === 'USER_FOUND') {
            console.log(`⚠️ ADMIN already exists: ${USERS.ADMIN.email}`);
        } else {
          console.error(`❌ Could not register ADMIN via standard endpoint. You may need to create it manually or via the create-admin endpoint if you already have an admin token.`);
        }
    }

    console.log('🏁 Seeding Complete!');

  } catch (err) {
    console.error('Fatal Error:', err);
  }
}

seed();
