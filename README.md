<div align="center">

# 💼 Job Portal

### A full-stack job portal built with **Spring Boot** & **Next.js**

[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-4.0.1-6DB33F?style=for-the-badge&logo=springboot&logoColor=white)](https://spring.io/projects/spring-boot)
[![Next.js](https://img.shields.io/badge/Next.js-16.1.6-000000?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Java](https://img.shields.io/badge/Java-17-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white)](https://openjdk.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)

---

A modern, full-featured **Job Portal** that connects employers with job seekers.  
Employers can post jobs, manage applicants, schedule interviews, and leverage **AI-powered resume analysis** (Google Gemini).  
Job seekers can search for jobs, build profiles, upload resumes, and track applications — all in a beautiful, responsive UI.

[Features](#-features) · [Tech Stack](#-tech-stack) · [Getting Started](#-getting-started) · [API Endpoints](#-api-endpoints) · [Contributing](#-contributing)

</div>

---

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [API Endpoints](#-api-endpoints)
- [Screenshots](#-screenshots)
- [Contributing](#-contributing)
- [License](#-license)

---

## ✨ Features

<table>
<tr>
<td width="50%">

### 🔐 Authentication & Security

- JWT-based auth with **access & refresh tokens**
- Email **OTP verification** on signup
- Secure password reset flow
- Role-based access control — **Applicant · Employer · Admin**

</td>
<td width="50%">

### 👤 User Profiles

- Profile picture upload
- Skills, work experience & certifications
- Resume / CV upload and storage
- Save jobs for later

</td>
</tr>
<tr>
<td>

### 💼 Job Management

- Rich text job descriptions (**Tiptap editor**)
- Filter & search by title, location, type, experience, salary
- Job status — Active / Draft / Closed
- Configurable job expiry dates

</td>
<td>

### 🤖 AI Resume Analysis

- **Google Gemini AI** integration
- Automated match-score generation
- AI-generated candidate-fit explanation
- Skills gap analysis (required vs. candidate)

</td>
</tr>
<tr>
<td>

### 📊 Employer Dashboard

- Analytics on posted jobs
- Applicant tracking — Applied → Interviewing → Offered → Rejected
- Interview scheduling with date/time picker
- Paginated & filterable applicant lists

</td>
<td>

### 🔍 Talent Search

- Search candidates across the platform
- Filter by skills, experience & location
- Sort by relevance

</td>
</tr>
<tr>
<td>

### 🔔 Notifications

- In-app notification system
- Real-time status change alerts

</td>
<td>

### 🛠️ Admin Panel

- User management dashboard
- Job listing oversight
- Admin creation controls
- Platform-wide settings

</td>
</tr>
</table>

### 🎨 UI / UX

- Fully **responsive** — mobile + desktop
- **Dark / Light mode** with persistence
- Component library built on **Radix UI + shadcn/ui**
- Smooth animations & modern glassmorphism effects

---

## 🛠️ Tech Stack

### Frontend

| Technology | Version | Purpose |
| :--- | :---: | :--- |
| [Next.js](https://nextjs.org/) | `16.1.6` | React framework · App Router · SSR |
| [React](https://react.dev/) | `19.2.3` | UI library |
| [TypeScript](https://www.typescriptlang.org/) | `5` | Type-safe JavaScript |
| [Tailwind CSS](https://tailwindcss.com/) | `4` | Utility-first styling |
| [Redux Toolkit](https://redux-toolkit.js.org/) | `2.x` | Global state management |
| [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/) | `7.x` / `4.x` | Form handling & validation |
| [Radix UI / shadcn/ui](https://ui.shadcn.com/) | — | Accessible component library |
| [Tiptap](https://tiptap.dev/) | `3.x` | Rich text editor |
| [Recharts](https://recharts.org/) | `2.15` | Data visualization |
| [Axios](https://axios-http.com/) | `1.x` | HTTP client |
| [Sonner](https://sonner.emilkowal.dev/) | `2.x` | Toast notifications |
| [next-themes](https://github.com/pacocoursey/next-themes) | `0.4` | Dark / Light mode |

### Backend

| Technology | Version | Purpose |
| :--- | :---: | :--- |
| [Spring Boot](https://spring.io/projects/spring-boot) | `4.0.1` | Java REST API framework |
| [Java](https://openjdk.org/) | `17` | Programming language |
| [MongoDB Atlas](https://www.mongodb.com/atlas) | — | NoSQL cloud database |
| [Spring Security](https://spring.io/projects/spring-security) | — | Authentication & authorization |
| [jjwt](https://github.com/jwtk/jjwt) | `0.11.5` | JWT token handling |
| [Spring Mail](https://docs.spring.io/spring-boot/reference/io/email.html) | — | Email OTP delivery |
| [Google Gemini AI](https://ai.google.dev/) | `1.0.0` | AI-powered resume analysis |
| [Apache PDFBox](https://pdfbox.apache.org/) | `2.0.29` | PDF / CV text extraction |
| [Lombok](https://projectlombok.org/) | — | Boilerplate reduction |
| [Bean Validation](https://beanvalidation.org/) | — | Request validation |

---

## 📁 Project Structure

```
job-portal/
│
├── client/                          # ── Next.js Frontend ──────────────────
│   ├── app/
│   │   ├── (auth)/                  # Login & Signup pages
│   │   │   ├── login/
│   │   │   └── signup/
│   │   ├── (routes)/                # Main application pages
│   │   │   ├── about/
│   │   │   ├── admin/               # Admin panel (layout + sub-pages)
│   │   │   │   ├── add-admin/
│   │   │   │   ├── jobs/
│   │   │   │   ├── settings/
│   │   │   │   └── users/
│   │   │   ├── apply-job/[id]/
│   │   │   ├── find-jobs/
│   │   │   ├── find-talent/
│   │   │   ├── jhistory/            # Application history
│   │   │   ├── jobs/[id]/
│   │   │   ├── post-job/
│   │   │   ├── posted-jobs/[jobId]/
│   │   │   └── profile/
│   │   └── employer/                # Employer dashboard
│   │       ├── applicants/
│   │       ├── dashboard/
│   │       └── jobs/[jobId]/
│   ├── components/ui/               # shadcn/ui components
│   ├── hooks/                       # Custom React hooks
│   ├── lib/                         # Utility functions
│   └── modules/                     # Feature modules
│       ├── auth/
│       ├── job/
│       ├── employer/
│       ├── profile/
│       ├── landing/
│       ├── admin/
│       ├── notifications/
│       └── redux/                   # Redux store & slices
│
└── server/                          # ── Spring Boot Backend ───────────────
    └── src/main/java/com/jobportal/
        ├── api/                     # REST Controllers
        │   ├── AdminAPI.java
        │   ├── JobAPI.java
        │   ├── NotificationAPI.java
        │   ├── ProfileAPI.java
        │   └── UserAPI.java
        ├── dto/                     # Data Transfer Objects
        ├── entity/                  # MongoDB Documents
        │   ├── Applicant.java
        │   ├── Job.java
        │   ├── Notification.java
        │   ├── OTP.java
        │   ├── Profile.java
        │   └── User.java
        ├── exception/               # Custom exceptions
        ├── repository/              # MongoDB Repositories
        ├── security/                # JWT & Spring Security
        │   ├── ApplicationConfig.java
        │   ├── JwtAuthenticationFilter.java
        │   └── JwtService.java
        ├── service/                 # Business logic
        │   ├── AIService.java
        │   ├── CVParserService.java
        │   ├── JobServiceImpl.java
        │   ├── ProfileServiceImpl.java
        │   └── UserServiceImpl.java
        └── utility/                 # Helpers & seed data
```

---

## 🚀 Getting Started

### Prerequisites

| Tool | Version |
| :--- | :--- |
| Java | 17+ |
| Node.js (or Bun) | 18+ |
| MongoDB | Local or Atlas |
| Maven | Included via `mvnw` |

### 1. Clone the Repository

```bash
git clone https://github.com/samarth-kamble/Jobs-Portal-Spring-Boot-Nextjs.git
cd Jobs-Portal-Spring-Boot-Nextjs
```

### 2. Backend Setup

```bash
cd server

# Configure environment variables (see below)
# Edit src/main/resources/application.properties

# Run with Maven wrapper
./mvnw spring-boot:run
```

> The backend starts on **http://localhost:8080**

### 3. Frontend Setup

```bash
cd client

# Install dependencies
npm install    # or: bun install

# Start development server
npm run dev    # or: bun dev
```

> The frontend starts on **http://localhost:3000**

---

## 🔑 Environment Variables

### Backend — `server/src/main/resources/application.properties`

```properties
# MongoDB
spring.mongodb.uri=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<database>

# Email (SMTP) — for OTP
spring.mail.host=smtp.gmail.com
spring.mail.port=587
spring.mail.username=your-email@gmail.com
spring.mail.password=your-app-password
spring.mail.properties.mail.smtp.auth=true
spring.mail.properties.mail.smtp.starttls.enable=true

# Google Gemini AI
gemini.api.key=your-gemini-api-key
```

### Frontend — `client/.env`

```env
NEXT_PUBLIC_API_URL=http://localhost:8080
```

---

## 📡 API Endpoints

### Authentication — `/users`

| Method | Endpoint | Description |
| :---: | :--- | :--- |
| `POST` | `/users/register` | Register a new user |
| `POST` | `/users/login` | Login & receive JWT tokens |
| `POST` | `/users/change-pass` | Change password |
| `POST` | `/users/send-otp/{email}` | Send OTP to email |
| `GET` | `/users/verify-otp/{email}/{otp}` | Verify OTP |
| `POST` | `/users/refresh-token` | Refresh access token |

### Jobs — `/jobs`

| Method | Endpoint | Description |
| :---: | :--- | :--- |
| `POST` | `/jobs/post` | Create a new job posting |
| `GET` | `/jobs/get-all` | Get all job listings |
| `GET` | `/jobs/get/{id}` | Get job by ID |
| `POST` | `/jobs/apply/{id}` | Apply to a job |
| `GET` | `/jobs/posted-by/{id}` | Get jobs posted by employer |
| `POST` | `/jobs/change-app-status` | Update application status |
| `POST` | `/jobs/analyze-resume/{jobId}/{applicantId}` | AI resume analysis |
| `GET` | `/jobs/{id}/applicants/filter` | Filter applicants (paginated) |
| `GET` | `/jobs/employer/{employerId}/applicants` | Get employer's applicants |

### Profiles — `/profiles`

| Method | Endpoint | Description |
| :---: | :--- | :--- |
| `GET` | `/profiles/get/{id}` | Get user profile |
| `PUT` | `/profiles/update` | Update user profile |

### Notifications — `/notifications`

| Method | Endpoint | Description |
| :---: | :--- | :--- |
| `GET` | `/notifications/{userId}` | Get user notifications |

### Admin — `/admin`

| Method | Endpoint | Description |
| :---: | :--- | :--- |
| `GET` | `/admin/users` | Get all users |
| `GET` | `/admin/jobs` | Get all jobs |
| `POST` | `/admin/add-admin` | Create admin user |

---

## 📸 Screenshots

> _Coming soon_

---

## 🤝 Contributing

Contributions are welcome! Follow these steps:

1. **Fork** the repository
2. **Create** a feature branch — `git checkout -b feature/amazing-feature`
3. **Commit** your changes — `git commit -m 'Add amazing feature'`
4. **Push** to the branch — `git push origin feature/amazing-feature`
5. **Open** a Pull Request

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

<div align="center">

**Built with ❤️ by [Samarth Kamble](https://github.com/samarth-kamble)**

⭐ Star this repo if you found it helpful!

</div>
