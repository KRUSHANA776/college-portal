# 📚 Complete Project Documentation
# Prof. BSS Jr. College Management System

**Version:** 1.0.0  
**Stack:** MERN (MongoDB, Express.js, React 19, Node.js)  
**Developed By:** KSJ Labs  
**College:** Prof. BSS Jr. College, Molgi, Tal. Akkalkuwa, Dist. Nandurbar  
**Date:** February 27, 2026

---

## Table of Contents

1. [What This Project Does (Overview)](#1-what-this-project-does)
2. [Project Structure](#2-project-structure)
3. [Technology Stack](#3-technology-stack)
4. [Installation & Setup](#4-installation--setup)
5. [How Each Page Works](#5-how-each-page-works)
6. [What the Backend Does](#6-what-the-backend-does)
7. [API Reference (Every Endpoint)](#7-api-reference)
8. [Database Models — What Data is Stored](#8-database-models)
9. [Security — How Passwords Are Protected](#9-security)
10. [Default Login Credentials](#10-default-credentials)
11. [Known Issues](#11-known-issues)

---

## 1. What This Project Does

This is a **complete college management web application** built for **Prof. BSS Jr. College**. It has two separate user roles — **Students** and **Faculty/Admin** — each with their own login, dashboard, and features. Here is everything it does:

---

### 🌐 Public Landing Page
When anyone visits the website, they see a **public homepage** that:
- Shows a **hero section** with the college's tagline: *"Empowering The Leaders of Tomorrow"*
- Has two buttons — **"Explore Streams"** (scrolls to courses) and **"Student Portal"** (goes to login)
- If a user is already logged in, the "Student Portal" button changes to **"Go to Dashboard"** automatically
- Shows an **About Section** explaining why to choose Prof. BSS Jr. College with three feature cards:
  - 🔬 **Modern Labs** — Physics, Chemistry, Biology labs for practicals
  - 📚 **Central Library** — Digital libraries, JEE/NEET/CET modules
  - 🏆 **Board Excellence** — 99% pass rate in State Board exams
- Shows an **Academic Streams Section** with three course cards:
  - **Science** — Physics, Chemistry, Math, Biology, Integrated JEE/NEET Coaching
  - **Commerce** — Accountancy, Economics, Math, CA-Foundation Prep
  - **Arts** — Psychology, History, Political Science, CLAT & Liberal Arts
- Shows a **Footer** with:
  - College address: Molgi, Tal. Akkalkuwa, Dist. Nandurbar
  - Email: lpbscolmolgi1999@gmail.com
  - Phone: 123456789
  - Quick links for Admin Login and Student Portal (or Dashboard/Logout if logged in)
  - Copyright: *© 2026 Prof. BSS Jr. College | Designed & Developed by KSJ Labs*

---

### 🔐 Login Page (Dual Login System)
The login page **handles both students and faculty** in one page. It detects the role from the URL:
- `/login?role=student` → Student mode
- `/login?role=teacher` → Faculty mode

**What it does for Students:**
- Students enter their **Roll Number** (e.g. S101) and **Password**
- If credentials are correct, the student is sent to `/student-dashboard`
- New students can **register themselves** by clicking "Register Now"
  - Registration form asks: Full Name, Email, Stream (Science/Commerce/Arts), Roll No, Password, Confirm Password
  - After registration, the account is created and the student is logged in automatically
- If passwords don't match during registration, it shows an error
- After successful login, the form is **cleared automatically** (no stale data)
- If user is already logged in, they are redirected directly to their dashboard

**What it does for Faculty:**
- Faculty enter their **Username** and **Password**
- If credentials are correct, they are sent to `/teacher-dashboard`
- Faculty cannot self-register (accounts must be created by admin)

**Switching between roles:**
- On the student login form, there's a link *"Faculty member? Faculty Login"*
- On the faculty login form, there's a link *"Not a faculty member? Student Login"*
- There's also a **"Back to Home"** button on both forms

---

### 👩‍🎓 Student Dashboard — What Students See & Do
After logging in, a student lands on their personal dashboard. Here is **everything it shows and does**:

#### Welcome Card
- Shows: **Welcome, [Student Name]**
- Shows college name, batch year (e.g. 2025-26)
- Shows Roll No, Standard (e.g. 12th), and Stream

#### Attendance Card
- Shows the student's **attendance percentage** (e.g. 88%)
- Colour-coded badge:
  - 🟢 Green (badge-success) → 85% or above
  - 🟡 Yellow (badge-warning) → 75%–84%
  - 🔴 Red (badge-danger) → below 75%
- Shows status text: *"Good Standing"* or *"Below Requirement"*

#### Aggregate Percentage Card
- Calculates the **total marks across all subjects** divided by maximum possible marks
- Shows percentage (e.g. 88.50%)
- Shows total marks obtained out of total (e.g. 177 / 200)

#### Performance Card
- Shows an overall rating badge based on percentage:
  - 🟢 **Excellent** → 75% and above
  - 🟡 **Good** → 50%–74%
  - 🔴 **Needs Improvement** → below 50%

#### Academic Performance Table (Subject-wise Marks)
Shows a table with every subject the student has marks for:
- **Subject Name**
- **Marks Obtained** (e.g. 92)
- **Total Marks** (always 100)
- **Grade** — calculated as:
  | Score | Grade |
  |-------|-------|
  | ≥ 90  | O     |
  | ≥ 80  | A+    |
  | ≥ 70  | A     |
  | ≥ 60  | B+    |
  | ≥ 50  | B     |
  | ≥ 40  | C     |
  | ≥ 35  | D     |
  | < 35  | F     |

If no marks are uploaded yet, it shows: *"No marks uploaded yet."*

#### Notice Board (Live)
- Fetches all notices from the database in real time
- Shows each notice with:
  - Category badge (Academic, Event, Urgent, Holiday) — each in a different colour
  - Date of posting
  - Notice title
  - Notice content/description
- Shows notice count: *"X New"*

#### Quick Actions — Student Can Print 3 Documents

**1. Bonafide Certificate**
- A printable official document with:
  - College logo
  - College name: *Prof. BSS Jr College*
  - Current date
  - Certificate text: *"This is to certify that [Student Name] bearing Enrollment No. [Roll No] is a regular student..."*
  - Space for Principal's signature

**2. Report Card**
- A printable official report card with:
  - College logo and name
  - Student Name, Roll No, Standard, Stream
  - A full subject-wise marks table with grades
  - Total marks and percentage
  - Pass/Fail result
  - Spaces for Class Teacher and Principal signatures

**3. Attendance Certificate**
- A printable certificate stating:
  - College logo and name
  - Student Name, Enrollment No, Class/Stream
  - Attendance percentage
  - Academic session (batch year)
  - Spaces for Class Teacher and Principal signatures

All three documents open using the browser's **print dialog** automatically.

There is also a **"Back to Home"** button to return to the landing page.

---

### 👨‍🏫 Teacher / Admin Dashboard — What Faculty Can Do
The teacher dashboard is a full **admin management panel**. Here is everything it does:

#### Header Options
- **Go to Website** → Navigate back to the landing page
- **Post Notice** → Opens a modal to post a new notice
- **Add New Student** → Opens a modal to create a new student
- **Change Password** → Opens a modal to change faculty's own password

#### Search & Filter
- A live search bar that filters the student list by:
  - Student name
  - Roll Number
  - Stream (Science, Commerce, Arts)
  - Standard/Class

#### Student Table
Shows all registered students with columns:
- Roll No
- Name
- Standard
- Stream
- Attendance (colour-coded badge)
- **Edit** button (pencil icon)
- **Delete** button (trash icon)

#### Add New Student (Modal Form)
Admin can create a new student by filling:
- Roll Number (unique ID)
- Full Name
- Email Address
- Stream (Science / Commerce / Arts dropdown)
- Standard/Class (e.g. 12th)
- Password (hashed before saving)
- Attendance %
- **Subjects & Marks** — dynamic list where admin can:
  - Click **"+ Add Subject"** to add a new subject row
  - Enter subject name and score for each
  - Click ❌ to remove a subject entry

After submission, the student is saved to the database.

#### Edit Student (Modal Form)
Admin can edit any student's:
- Name
- Email
- Stream
- Standard
- Password (leave blank to keep existing password)
- Attendance
- Marks (add, change, or remove subjects)

The Roll Number cannot be changed when editing.

#### Delete Student
- Admin clicks the trash icon on any student row
- A confirmation popup asks *"Are you sure you want to delete this student?"*
- On confirmation, the student is permanently removed from the database

#### Active Notices Table
Shows all current notices with:
- Date posted
- Category badge
- Notice title
- Delete button (trash icon)

Admin can delete any notice by clicking the trash icon.

#### Post New Notice (Modal Form)
Admin can post a new notice with:
- **Title** — Short heading for the notice
- **Category** — One of: Academic, Event, Urgent, Holiday
- **Content** — Full description of the notice

The notice is saved to the database and immediately visible to all students.

#### Change Faculty Password (Modal Form)
Faculty can change their own account password:
- Enter **Current Password**
- Enter **New Password**
- **Confirm New Password**

If the current password is wrong, it shows an error. If the new passwords don't match, it shows an error. If successful, the new password is saved (hashed) to the database.

#### Toast Notifications
Every action (create, update, delete, error) shows a small **toast message** at the bottom of the screen for 3 seconds, e.g.:
- *"Student created successfully"*
- *"Student updated successfully"*
- *"Student deleted successfully"*
- *"Notice posted successfully"*
- *"Password changed successfully"*

---

### 🔄 How Login State is Maintained
- When a user logs in, their data is saved to **localStorage** under the key `user`
- On page refresh, `App.jsx` reads from localStorage — so the user stays logged in
- On logout (from Header or Footer), localStorage is cleared and the user is sent back to home
- This means users **don't need to log in again** after refreshing the browser

---

### 🧭 Route Protection
- `/student-dashboard` → Only accessible if `user.role === 'student'`. Otherwise redirects to `/login`
- `/teacher-dashboard` → Only accessible if `user.role === 'teacher'`. Otherwise redirects to `/login`
- `/login` → If already logged in, auto-redirects to the correct dashboard

---

## 2. Project Structure

```
college web - Copy/
│
├── client/                         # React Frontend (Vite)
│   ├── public/
│   │   └── logo.png               # College logo used in print templates
│   ├── src/
│   │   ├── components/
│   │   │   └── Header.jsx         # Navigation bar with user info + logout
│   │   ├── pages/
│   │   │   ├── LandingPage.jsx    # Public homepage
│   │   │   ├── LandingPage.css
│   │   │   ├── LoginPage.jsx      # Dual login (student + faculty) + student register
│   │   │   ├── LoginPage.css
│   │   │   ├── StudentDashboard.jsx  # Student's personal portal
│   │   │   ├── StudentDashboard.css
│   │   │   ├── TeacherDashboard.jsx  # Admin panel for managing students + notices
│   │   │   └── TeacherDashboard.css
│   │   ├── App.jsx                # Root component, routing, user state
│   │   ├── App.css
│   │   ├── index.css
│   │   └── main.jsx
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
├── server/                         # Express Backend
│   ├── models/
│   │   ├── Student.js             # Student schema
│   │   ├── Faculty.js             # Faculty schema
│   │   └── Notice.js             # Notice schema
│   ├── routes/
│   │   ├── students.js            # All student API endpoints
│   │   ├── faculty.js             # Faculty login + password endpoints
│   │   └── notices.js            # Notice endpoints
│   ├── server.js                  # Entry point, DB connect, auto-seed
│   ├── .env                       # MONGODB_URI, PORT
│   └── package.json
│
├── TASK_REPORT.md                 # Task tracking
├── UML_DIAGRAMS.md                # UML diagrams (Mermaid)
└── DOCUMENTATION.md               # This file
```

---

## 3. Technology Stack

| Layer    | Technology      | Version    | Role                          |
|----------|-----------------|------------|-------------------------------|
| Frontend | React           | ^19.2.0    | UI components                 |
| Frontend | React Router    | ^7.13.0    | Page routing                  |
| Frontend | Axios           | ^1.13.4    | HTTP calls to backend         |
| Frontend | Vite            | ^7.2.4     | Build tool & dev server       |
| Backend  | Node.js         | —          | Server runtime                |
| Backend  | Express.js      | ^4.18.2    | API framework                 |
| Backend  | Mongoose        | ^8.0.3     | MongoDB ODM                   |
| Backend  | bcryptjs        | ^2.4.3     | Password hashing              |
| Backend  | CORS            | ^2.8.5     | Cross-origin requests         |
| Backend  | dotenv          | ^16.3.1    | Environment variables         |
| Database | MongoDB         | (Atlas)    | Data storage                  |

---

## 4. Installation & Setup

### Prerequisites
- Node.js (v18 or higher)
- A MongoDB URI (MongoDB Atlas or local)
- npm

### Backend Setup
```bash
cd server
npm install
```

Create `server/.env`:
```env
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/college
PORT=5000
```

Run the backend:
```bash
npm run dev      # development (nodemon — auto restarts on changes)
npm start        # production
```

### Frontend Setup
```bash
cd client
npm install
npm run dev
```

App runs at: **http://localhost:5173**  
API runs at: **http://localhost:5000**

> On first run, the server **automatically creates** sample students, an admin account, and sample notices — no manual setup needed.

---

## 5. How Each Page Works

### `main.jsx` — Entry Point
- Renders the entire React app inside `<React.StrictMode>`.
- Mounts to the `#root` div in `index.html`.

### `App.jsx` — Root Component
- Holds the global `user` state using `useState`.
- Reads user from `localStorage` on first load.
- Defines all routes using React Router:

| Route                | Component          | Access               |
|---------------------|--------------------|----------------------|
| `/`                 | LandingPage        | Public               |
| `/login`            | LoginPage          | Public               |
| `/student-dashboard`| StudentDashboard   | Students only        |
| `/teacher-dashboard`| TeacherDashboard   | Faculty only         |

- On logout, clears `user` state and removes from `localStorage`.
- Passes `user` and `onLogout` to `Header`.

### `Header.jsx` — Navigation Bar
- Fixed top navigation showing the college name/branding.
- If `user` is logged in: shows welcome text and **Logout** button.
- If no user: shows nothing or just the brand name.

### `LandingPage.jsx`
- Fully static display page (no API calls).
- Uses `user` prop to show context-aware links (Login vs Dashboard).
- Sections: Hero → About → Courses → Footer.

### `LoginPage.jsx`
- Reads `?role=` from the URL using `useSearchParams`.
- Manages form state: id, name, email, stream, password, confirmPassword.
- On submit, calls the appropriate API (student login, student register, or faculty login).
- Saves login data to state + localStorage.
- Redirects based on role after 800ms delay.

### `StudentDashboard.jsx`
- On mount, fetches student's own latest data from `/api/students/:id`.
- Also fetches notices from `/api/notices`.
- Displays all stats, marks, notices.
- Generates printable Bonafide, Report Card, Attendance Certificate using `window.print()`.

### `TeacherDashboard.jsx`
- On mount, fetches all students and notices simultaneously (`Promise.all`).
- Manages multiple modal states (`showModal`, `showNoticeModal`, `showPasswordModal`).
- Handles student CRUD: create, read (list + search), update, delete.
- Handles notice CRUD: create (post), read, delete.
- Handles faculty password change.
- Live search filters the student list in real time.

---

## 6. What the Backend Does

### `server.js`
1. **Starts an Express server** on `PORT` (default 5000).
2. **Connects to MongoDB** using the URI from `.env`.
3. On successful DB connection, calls **`initializeData()`** which:
   - Creates 3 sample students if no students exist (with hashed passwords).
   - Creates an admin faculty account if none exists (`admin` / `admin123`).
   - Creates 3 sample notices if no notices exist.
4. **Mounts API routes:**
   - `/api/students` → handles all student operations
   - `/api/faculty` → handles faculty login and password change
   - `/api/notices` → handles notice board operations
5. Provides a **health check** endpoint at `GET /api/health`.
6. **Global error handler** catches unhandled errors and returns JSON.

### `routes/students.js`
- `GET /` — Returns all students (password field excluded).
- `GET /:id` — Returns one student by Roll No (password excluded).
- `POST /login` — Verifies Roll No + password using bcrypt, returns student data + role.
- `POST /register` — Student self-registers; hashes password; saves to DB.
- `POST /` — Admin creates a student; hashes password; saves to DB.
- `PUT /:id` — Admin updates student data; if password provided, hashes it.
- `DELETE /:id` — Admin deletes a student by Roll No.

### `routes/faculty.js`
- `POST /login` — Verifies username + password using bcrypt, returns faculty data + role.
- `POST /` — Creates a new faculty account with hashed password.
- `PUT /change-password` — Verifies current password, then hashes and saves new password to DB.

### `routes/notices.js`
- `GET /` — Returns all notices sorted by date (newest first).
- `POST /` — Creates and saves a new notice.
- `DELETE /:id` — Deletes a notice by MongoDB `_id`.

---

## 7. API Reference

**Base URL:** `http://localhost:5000/api`

### Health
| Method | Path       | Description          | Response              |
|--------|------------|----------------------|-----------------------|
| GET    | /health    | Check if server is up | `{status:"OK", ...}` |

### Students
| Method | Path                    | Description                          |
|--------|------------------------|--------------------------------------|
| GET    | /students               | Get all students                     |
| GET    | /students/:id           | Get student by roll no               |
| POST   | /students/login         | Student login                        |
| POST   | /students/register      | Student self-registration            |
| POST   | /students               | Create student (admin)               |
| PUT    | /students/:id           | Update student (admin)               |
| DELETE | /students/:id           | Delete student (admin)               |

**Login body:** `{ "id": "S101", "password": "student123" }`  
**Login response:** `{ "message": "Login successful", "student": {...}, "role": "student" }`

**Register body:**
```json
{ "id": "S104", "name": "New Student", "email": "s@college.edu", "stream": "Science", "password": "mypass" }
```

**Update body (PUT):**
```json
{ "name": "Name", "attendance": 90, "marks": [{ "subject": "Math", "score": 95 }], "stream": "Science", "standard": "12th", "password": "" }
```
> Empty password = keep existing password unchanged

### Faculty
| Method | Path                         | Description              |
|--------|------------------------------|--------------------------|
| POST   | /faculty/login               | Faculty login            |
| POST   | /faculty                     | Create faculty account   |
| PUT    | /faculty/change-password     | Change faculty password  |

**Faculty login body:** `{ "username": "admin", "password": "admin123" }`  
**Change password body:**
```json
{ "username": "admin", "currentPassword": "admin123", "newPassword": "newPass123" }
```

### Notices
| Method | Path             | Description             |
|--------|-----------------|-------------------------|
| GET    | /notices         | Get all notices         |
| POST   | /notices         | Create a notice         |
| DELETE | /notices/:id     | Delete notice by ID     |

**Create notice body:**
```json
{ "title": "Title", "content": "Details here", "category": "Academic" }
```
Category options: `Academic`, `Event`, `Urgent`, `Holiday`

---

## 8. Database Models

### Student Collection (`students`)
```json
{
  "id": "S101",
  "name": "James Wilson",
  "email": "james@college.edu",
  "password": "<bcrypt hash>",
  "attendance": 88,
  "marks": [
    { "subject": "Mathematics", "score": 92 },
    { "subject": "Physics", "score": 85 }
  ],
  "standard": "12th",
  "stream": "Science",
  "batch": "2025-26",
  "createdAt": "2026-02-01T00:00:00Z"
}
```

### Faculty Collection (`faculties`)
```json
{
  "username": "admin",
  "password": "<bcrypt hash>",
  "name": "Faculty Admin",
  "role": "admin",
  "createdAt": "2026-02-01T00:00:00Z"
}
```
`role` can be `"teacher"` or `"admin"`.

### Notice Collection (`notices`)
```json
{
  "title": "Final Examination Schedule",
  "content": "Final exams begin from March 1st.",
  "category": "Academic",
  "date": "2026-02-01T00:00:00Z",
  "postedBy": "Faculty Administration"
}
```
`category` can be `Academic`, `Event`, `Urgent`, or `Holiday`.

---

## 9. Security

| Feature                | How it works                                                      |
|------------------------|-------------------------------------------------------------------|
| Password Hashing       | All passwords stored as **bcrypt hashes** (salt rounds = 10)     |
| Passwords Never Sent   | All API responses exclude password via `.select('-password')`     |
| CORS enabled           | Allows frontend (localhost:5173) to talk to backend               |
| Environment Variables  | MongoDB URI stored in `.env` — never hardcoded                    |
| Client-side Auth Guard | React routes check `user.role` before showing dashboard           |
| ⚠️ No API Auth Middleware | Admin routes like POST/PUT/DELETE `/students` have **no token check** — any client can call them |

> **Important:** JWT token support is installed (`jsonwebtoken` package) but not yet implemented. Until it is, the backend API routes have no server-side authentication protection.

---

## 10. Default Credentials

> ⚠️ **Change these before deploying to production!**

| Role    | Username / Roll No | Password     |
|---------|--------------------|--------------|
| Admin   | `admin`            | `admin123`   |
| Student | `S101`             | `student123` |
| Student | `S102`             | `student123` |
| Student | `S103`             | `student123` |

Sample students:
- **S101** — James Wilson, Science, 88% attendance
- **S102** — Sarah Parker, Commerce, 94% attendance
- **S103** — Michael Brown, Arts, 76% attendance

---

## 11. Known Issues

| # | Issue                                                              | Severity |
|---|--------------------------------------------------------------------|----------|
| 1 | No server-side auth — any user can call admin API endpoints        | HIGH     |
| 2 | `jsonwebtoken` installed but not used                              | Medium   |
| 3 | Missing space before student name in Attendance Certificate text   | Low      |
| 4 | `window.print()` may be blocked in some browser/OS settings        | Low      |

---

## Contact & Credits

| Field      | Info                                     |
|------------|------------------------------------------|
| College    | Prof. BSS Jr. College                    |
| Location   | Molgi, Tal. Akkalkuwa, Dist. Nandurbar   |
| Email      | lpbscolmolgi1999@gmail.com               |
| Phone      | 123456789                                |
| Developer  | KSJ Labs                                 |
| Established| 1999                                     |

---

*© 2026 Prof. BSS Jr. College | All Rights Reserved*
