# 🎓 Campus Connect — Project Handoff & Architecture Guide

> **Repository**: [github.com/thegit-69/College-Connect.git](https://github.com/thegit-69/College-Connect.git)  
> **Status**: **Phase 1 & Phase 2 Completed & Built Cleanly (Zero Errors)**  
> **Active Branch**: `main`  
> **Dev Server**: `npm run dev` (Runs on Vite, port `5173` / `5174`)  
> **Build Command**: `npm run build` (Verified: 767 modules transformed, production build passes)

---

## 📌 Executive Summary

**Campus Connect** is an all-in-one digital campus management and student life ecosystem that unites:
1. **Academics & Schedule** (Timetable, Subject syllabus tracking, Assignment tracker & submissions)
2. **Attendance Management** (Faculty manual roll-call with Present/Absent marking & batch actions)
3. **AI Campus Advisor** (Conversational assistant with student context & query handling)
4. **AI Recommendations** (Personalized opportunities, hackathons, and academic clinics)
5. **Student Services & E-Governance** (Requests for OD, Medical, Bonafide, and Complaints redressal)
6. **Certificate Vault** (Verified digital certificates with category filtering & download)
7. **Events Hub** (The complete `clg_events` portal with discovery, ticket booking, QR generation, organizer management, and super-admin approvals)

---

## 🛠️ Tech Stack & Design System

- **Framework**: React 18 (Vite)
- **Routing**: React Router DOM v6
- **State Management**: Zustand (`authStore.js`, `eventStore.js`, `campusStore.js`)
- **Backend & Auth**: Firebase Auth & Cloud Firestore (Project: `college-connect-ad363`)
- **Styling**: Tailwind CSS + Vanilla CSS utilities
- **Icons**: `react-icons` (Ionicons 5, Heroicons 2) & `lucide-react`
- **Animations**: `framer-motion`
- **Notifications**: `react-hot-toast`
- **Design Aesthetic**: **Vercel Light Theme** (`#fafafa` canvas, `#ffffff` card surfaces, `#e5e7eb` minimal borders, monochrome typography with subtle accent status badges, collapsible sidebar).

---

## 📂 Project Architecture & Directory Layout

```
d:\clg_events\
├── public/                 # Static assets, logos, favicon
├── src/
│   ├── components/
│   │   ├── layout/
│   │   │   ├── DashboardLayout.jsx   # Shell with collapsible sidebar & top navbar
│   │   │   ├── Layout.jsx            # Public shell (Navbar + Footer)
│   │   │   ├── Navbar.jsx            # Minimal header with Logo, Ask AI, and ID Modal trigger
│   │   │   ├── Sidebar.jsx           # Collapsible grouped navigation (Academics, AI, Services, Events)
│   │   │   └── Footer.jsx            # Global footer
│   │   ├── profile/
│   │   │   └── ProfileModal.jsx      # Digital Student ID Card overlay
│   │   ├── ui/
│   │   │   ├── Badge.jsx             # Minimalist status badges
│   │   │   ├── Button.jsx            # Vercel-style buttons
│   │   │   ├── StatsCard.jsx         # KPI overview cards
│   │   │   ├── Modal.jsx             # Generic modal dialog
│   │   │   └── SearchBar.jsx         # Debounced search bar
│   ├── pages/
│   │   ├── Home.jsx                  # Public landing page
│   │   ├── Events.jsx                # Explore campus events
│   │   ├── EventDetail.jsx           # Event specs & registration modal
│   │   ├── MyTickets.jsx             # Student ticket wallet & QR passes
│   │   ├── Dashboard.jsx             # Student Companion Home (greeting, KPI stats, timetable, proposals)
│   │   ├── AcademicsPage.jsx         # Timetable (by day), Subjects (syllabus & progress), Assignments
│   │   ├── AttendancePage.jsx        # Teacher Present/Absent attendance marking interface
│   │   ├── AIAssistantPage.jsx       # Real-time intelligent campus chatbot
│   │   ├── RecommendationsPage.jsx   # Personalized hackathons & opportunities
│   │   ├── RequestsPage.jsx          # E-Governance requests (OD, Bonafide, Medical Leave)
│   │   ├── ComplaintsPage.jsx        # Grievance portal with anonymous mode & timeline
│   │   ├── CertificatesPage.jsx      # Digital Certificate Vault
│   │   ├── ManageEvents.jsx          # Organizer event management & attendee lists
│   │   ├── CreateEvent.jsx           # Multi-step event proposal wizard
│   │   ├── AdminReview.jsx           # Super Admin approval console
│   │   ├── Notifications.jsx         # Campus notifications feed
│   │   └── NotFound.jsx              # 404 page
│   ├── services/
│   │   ├── firebase.js               # Firebase app, auth, & firestore initializers
│   │   ├── authService.js            # Sign in, Sign out, role checks
│   │   ├── eventService.js           # Firestore event CRUD & registrations
│   │   ├── campusData.js             # Initial mock data for student profiles, subjects, timetable
│   │   └── smartAttendanceService.js # Math helpers for attendance calculation
│   ├── store/
│   │   ├── authStore.js              # User auth state & role permissions
│   │   ├── eventStore.js             # Event list and active filters
│   │   └── campusStore.js            # Global store for student data, requests, complaints, chat
│   ├── utils/
│   │   ├── constants.js              # Categories, roles, statuses
│   │   └── helpers.js                # Date, string, and formatting helpers
│   ├── App.jsx                       # Route provider & top-level layout routing
│   └── main.jsx                      # Entrypoint
```

---

## 🚦 Current Status & Completed Routes

| Route | Page Component | Feature Details | Status |
|---|---|---|---|
| `/` | `Home.jsx` | Public landing page with hero banner & active events | ✅ Complete |
| `/events` | `Events.jsx` | Event discovery with category filter and search | ✅ Complete |
| `/events/:id` | `EventDetail.jsx` | Event details, venue, faculty, registration form | ✅ Complete |
| `/my-tickets` | `MyTickets.jsx` | Booked tickets with downloadable passes | ✅ Complete |
| `/dashboard` | `Dashboard.jsx` | Overview with CGPA, attendance gauge, quick links, announcements, event proposals | ✅ Complete |
| `/dashboard/academics` | `AcademicsPage.jsx` | 3 Tabs: Weekly Timetable (Mon-Fri), Course syllabus tracker, Assignments tracker | ✅ Complete |
| `/dashboard/attendance` | `AttendancePage.jsx` | Teacher roll-call view: 21 students roster, P/A toggles, bulk mark, submit flow | ✅ Complete |
| `/dashboard/ai-assistant` | `AIAssistantPage.jsx` | Intelligent assistant querying attendance, CGPA, mentor, schedule, & assignments | ✅ Complete |
| `/dashboard/recommendations`| `RecommendationsPage.jsx` | AI opportunity cards with match scores and category badges | ✅ Complete |
| `/dashboard/requests` | `RequestsPage.jsx` | On-Duty, Bonafide, Medical Leave applications with approval tracking | ✅ Complete |
| `/dashboard/complaints` | `ComplaintsPage.jsx` | Grievance ticket filing with urgency tags, anonymous toggle, & live timeline | ✅ Complete |
| `/dashboard/certificates` | `CertificatesPage.jsx` | Verified credentials vault with category filter & download simulation | ✅ Complete |
| `/dashboard/events` | `ManageEvents.jsx` | Organizer event manager, live attendee count, export data | ✅ Complete |
| `/dashboard/create` | `CreateEvent.jsx` | New event submission with image upload & speaker fields | ✅ Complete |
| `/dashboard/admin/review` | `AdminReview.jsx` | Super Admin moderation dashboard to approve/reject events | ✅ Complete |

---

## 🔄 User Directives & Adjustments Made

1. **Vercel Light Theme**: Implemented throughout the app with sleek borders, `#fafafa` background, clean monochrome styling, and high contrast.
2. **Collapsible Sidebar**: Desktop collapse toggle (icons-only mode with tooltips) + Mobile drawer overlay.
3. **Attendance Simplification**: Replaced automated QR/geofence Smart Attendance with a clean teacher interface to mark **Present (P) / Absent (A)**.
4. **Gate Pass Removal**: Removed gate pass applications from requests (kept OD, Medical Leave, Bonafide, etc.).
5. **Student Risk Detection Removal**: Removed the risk advisor module from the navigation per user preference.

---

## 🚀 Remaining Features & Next Phases (Handoff Backlog)

Here are the suggested phases and features for the incoming developer to build or expand:

### Phase 3: Firebase Firestore Live Synchronization
- [ ] **Firestore Collections**:
  - Migrate local Zustand seed data (`campusData.js`) to live Firestore collections:
    - `students` (`rollNo`, `cgpa`, `department`, `semester`, `mentor`)
    - `attendance_sessions` (`subjectId`, `date`, `presentRolls[]`, `absentRolls[]`, `facultyId`)
    - `academic_assignments` (`subjectId`, `title`, `dueDate`, `maxMarks`, `submissions[]`)
    - `student_requests` (`type`, `purpose`, `dates`, `status`, `reviewerId`)
    - `grievances` (`title`, `category`, `description`, `status`, `timeline[]`)
- [ ] **Real-time Listeners**: Use Firestore `onSnapshot` for instant sync across students and teachers when attendance or complaints status changes.

### Phase 4: Real AI Integration with Gemini API
- [ ] **Gemini API Integration**: Replace the mock rule-based NLP in `src/pages/AIAssistantPage.jsx` with direct Google Gemini 1.5 Flash API calls using `@google/genai` SDK.
- [ ] **Letter & OD Drafter**: Add a feature in the AI assistant to auto-draft formal On-Duty application letters or leave emails with one click.
- [ ] **Dynamic Recommendations**: Generate dynamic recommendations based on student's actual grades, attendance weaknesses, and resume keywords.

### Phase 5: PDF Export & Dynamic QR Codes
- [ ] **Certificate PDF Generator**: Integrate `html2pdf.js` or `@react-pdf/renderer` in `CertificatesPage.jsx` to export high-resolution, print-ready certificates with college crest and signatures.
- [ ] **Dynamic QR Tickets**: Use `qrcode.react` to generate verifiable QR codes for event tickets (`MyTickets.jsx`) and verified certificates.
- [ ] **Public Verification Route**: Create `/verify-certificate/:certId` to allow external employers or universities to scan/verify a certificate's authenticity.

### Phase 6: Faculty & Admin Dedicated Interfaces
- [ ] **Role-Based Views**:
  - Add role switcher or permission gates for Student, Faculty, and HOD/Admin.
  - Faculty portal for creating assignments, grading submitted files, and publishing internal assessment marks.
  - Admin/Warden portal for reviewing complaints and approving student requests.

### Phase 7: Real-Time Push Notifications & Polish
- [ ] **Firebase Cloud Messaging (FCM)**: Send push alerts when a request is approved, an assignment deadline is near, or a complaint status updates.
- [ ] **Dark Mode Toggle** (Optional): Add full theme switcher in `Navbar.jsx` supporting both Vercel Light and Dark themes.

---

## ⚙️ How to Run Locally

1. **Clone & Install Dependencies**:
   ```bash
   git clone https://github.com/thegit-69/College-Connect.git
   cd College-Connect
   npm install
   ```

2. **Environment Variables**:
   Create a `.env` file in the root with your Firebase credentials:
   ```env
   VITE_FIREBASE_API_KEY=AIzaSyD7qPU6OUvTLwL_q3hYpxd9PJQmLJqDtdM
   VITE_FIREBASE_AUTH_DOMAIN=college-connect-ad363.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=college-connect-ad363
   VITE_FIREBASE_STORAGE_BUCKET=college-connect-ad363.firebasestorage.app
   VITE_FIREBASE_MESSAGING_SENDER_ID=511580303980
   VITE_FIREBASE_APP_ID=1:511580303980:web:113e95da4b8bed67465e49
   ```

3. **Start Development Server**:
   ```bash
   npm run dev
   ```

4. **Verify Production Build**:
   ```bash
   npm run build
   ```

---

*Handoff document prepared for the College-Connect engineering team.*
