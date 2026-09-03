# CampusFlow — Smart College Management Platform (MERN)

CampusFlow is a production-ready, multi-tenant smart college management platform built with the **MERN** stack (MongoDB, Express.js, React.js, Node.js). It provides role-based workspaces for **Super Admin**, **College Admin**, **Faculty**, **Student**, and **Placement Officer** with strict tenant isolation, real-time academic workflows, automated eligibility evaluation, and an intelligent AI study assistance suite.

---

## 🚀 Key Features & Architectural Modules

### 1. Multi-Tenancy & Role-Based Access Control (RBAC)
- **5 User Roles**:
  - `SUPER_ADMIN`: Global tenant registration, system settings, platform-wide analytics, and audit logs.
  - `COLLEGE_ADMIN`: Tenant-scoped administration (departments, courses, faculty, students, attendance reports, student requests).
  - `FACULTY`: Course assignment, 1-click interactive attendance manager, coursework publishing, submission grading with revision workflows, and AI student performance summaries.
  - `STUDENT`: Attendance standing (Safe, Warning, Critical) with detention indicators, coursework submissions with revision history, academic transcripts, campus requests, placement applications, and AI Study Assistant.
  - `PLACEMENT_OFFICER`: Corporate recruiter directory, job drives with rule-based eligibility engines, candidate funnels, interview stages, and placement analytics.
- **Strict Tenant Isolation**: Multi-tenancy enforced at the database query level via `institutionId` filtering, preventing Insecure Direct Object Reference (IDOR).
- **Security**: JWT Access (15m) + Refresh Token rotation (7d), bcrypt password hashing, rate limiting (`express-rate-limit`), Helmet HTTP headers, CORS, and centralized error handling.

### 2. Interactive Attendance Manager
- Daily lecture tracking with 1-click **Mark All Present** / **Mark All Absent** and individual status toggles (`PRESENT`, `ABSENT`, `LATE`, `EXCUSED`).
- Automatic student notifications whenever attendance drops below the 75% safe threshold.
- CSV export for institutional attendance records.

### 3. Coursework & Submission Lifecycle
- Faculty publish assignments with problem specifications, maximum marks, due dates, and reference attachments.
- Students upload solution files with automatic late detection.
- Complete versioning and audit history for resubmitted files.
- Faculty grading drawer with marks input, qualitative feedback, and optional resubmission requests.

### 4. Career Services & Rule-Based Placement Engine
- Job drives configured with strict criteria: Minimum CGPA, maximum backlogs, and allowed degree departments.
- **Server-side Eligibility Engine**: Real-time evaluation prevents non-eligible candidates from submitting applications while displaying transparent rationales.
- Multi-stage recruitment tracking: Applied -> Shortlisted -> Interview Rounds (online/offline with meeting links) -> Placement Offer.
- Analytics charts with average package, highest CTC, and departmental hiring breakdown.
- Placement CSV report export.

### 5. AI Academic & Study Assistant Suite
- **Student Performance Summarizer**: Synthesizes a student's real database records (attendance rate, assignment marks, exam scores) to generate strengths, intervention areas, and actionable recommendations.
- **Weak Subject Detection**: Analyzes subject marks (<65%) and attendance deficits (<75%) with transparent data explanations.
- **7-Day Revision Planner**: Generates personalized daily study schedules, daily checkpoints, and topic priorities based on target exam date and daily available hours.
- **Curated Learning Resources**: Verified university courseware and tutorials (MIT OCW, Stanford, NPTEL, OSTEP).
- **Zero-Config Fallback**: Supports Google Gemini / OpenAI via `AI_API_KEY`, with an intelligent deterministic rule-engine fallback so AI features work reliably even without an external API key.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 18, Vite, Tailwind CSS, Lucide React, Recharts, Axios, React Router v6 |
| **Backend** | Node.js, Express.js, Mongoose, JWT, bcryptjs, Multer, Nodemailer, express-rate-limit |
| **Database** | MongoDB / MongoDB Atlas (with automatic in-memory fallback for standalone runs) |
| **Testing** | Jest, Supertest |

---

## 🔑 Pre-Seeded Demo Credentials

The database comes pre-populated with interconnected records for instant evaluation:

| Role | Email | Password | Details |
|---|---|---|---|
| **Super Admin** | `superadmin@campusflow.edu` | `Admin@123` | Global platform administrator |
| **Campus Admin** | `admin@anurag.edu.in` | `Admin@123` | Anurag University Campus Administrator |
| **Faculty (CSE)** | `faculty.cs@anurag.edu.in` | `Faculty@123` | Dr. Alan Turing (DBMS Instructor) |
| **Student (Safe)** | `student1@anurag.edu.in` | `Student@123` | Rahul Sharma (CGPA: 8.8, Roll: 23AUCS001) |
| **Student (Warning)** | `student3@anurag.edu.in` | `Student@123` | Amit Kumar (CGPA: 5.9, Attendance Alert) |
| **Placement Officer** | `placement@anurag.edu.in` | `Placement@123` | Marcus Brody (Dean Placements) |

> *Tip: The Login page features 1-click demo buttons to automatically autofill any of these accounts.*

---

## 🏁 Getting Started

### 1. Prerequisites
- Node.js (v18 or higher)
- npm (v9 or higher)
- MongoDB instance (local mongod or MongoDB Atlas connection string). *If no MongoDB instance is running, an in-memory database will automatically launch in development mode.*

### 2. Installation
Clone the repository and install all dependencies:
```bash
# Install root, server, and client dependencies
cd d:/Smart-CmapusFlow-MERN
npm --prefix server install
npm --prefix client install
```

### 3. Environment Setup
Review the pre-configured `.env` files in `server/.env` and `client/.env`:
- `server/.env`:
  ```env
  PORT=5000
  NODE_ENV=development
  MONGODB_URI=mongodb://localhost:27017/campusflow
  CLIENT_URL=http://localhost:5173
  JWT_ACCESS_SECRET=campusflow_super_secret_access_key_2026_jwt
  JWT_REFRESH_SECRET=campusflow_super_secret_refresh_key_2026_jwt
  ```
- `client/.env`:
  ```env
  VITE_API_URL=/api
  ```

### 4. Database Seeding
Populate the database with realistic sample colleges, departments, users, attendance, coursework, and recruitment drives:
```bash
npm run seed
```

### 5. Running Automated Tests
Execute backend integration tests verifying JWT authentication, token rotation, and RBAC tenant isolation:
```bash
npm --prefix server test
```

### 6. Starting Development Servers
Launch both backend and frontend servers:

**Terminal 1 (Backend API)**:
```bash
cd server
npm run dev
# Server starts on http://localhost:5000
```

**Terminal 2 (Frontend Client)**:
```bash
cd client
npm run dev
# Client starts on http://localhost:5173
```

Open `http://localhost:5173` in your browser to access the CampusFlow platform.

---

## 📂 Project Structure

```
d:/Smart-CmapusFlow-MERN/
├── package.json
├── README.md
├── server/
│   ├── src/
│   │   ├── config/          # Database connection & system constants
│   │   ├── controllers/     # 18 Express controllers
│   │   ├── middleware/      # Auth, RBAC, tenant, upload, error handler
│   │   ├── models/          # 19 Mongoose schemas with compound indexes
│   │   ├── routes/          # REST route declarations
│   │   ├── seed/            # Complete realistic seed script
│   │   ├── services/        # AI, CSV export, eligibility, email services
│   │   └── utils/           # API response helpers, JWT tokens, audit logger
│   └── tests/               # Jest & Supertest automated test suite
└── client/
    ├── src/
    │   ├── components/      # Common UI (Navbar, Sidebar, DataTable, Modal, Badges)
    │   ├── context/         # AuthContext and NotificationContext
    │   ├── layouts/         # DashboardLayout and AuthLayout
    │   ├── pages/           # Role-based dashboards, academic, student, and placement pages
    │   ├── routes/          # ProtectedRoute and AppRoutes
    │   └── services/        # Centralized Axios client & API domain services
    ├── index.html
    └── vite.config.js
```
