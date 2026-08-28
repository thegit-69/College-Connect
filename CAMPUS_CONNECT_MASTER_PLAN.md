# 🎓 Campus Connect: Master Platform Roadmap & Specifications

> **Platform**: **Campus Connect** — Intelligent Digital Campus Management & Student Services Ecosystem  
> **Backend**: Cloud Firestore & Firebase Auth (Hybrid with instant offline resilience)  
> **Frontend**: React + Tailwind CSS (Primary `#3770FF`, Dark `#0f172a`, Glassmorphism, Responsive)  
> **Integrated Base**: Seamlessly embeds the existing `clg_events` module into the unified campus ecosystem.

---

## 📌 Problem Statement & Core Value Proposition
- **The Challenge**: Colleges operate fragmented, disconnected systems for attendance, academics, events, grievances, certificates, gate passes, and student services. This results in delays, paper trails, communication gaps, and lack of early visibility into struggling students.
- **The Solution**: **Campus Connect** unites all academic life, student services, event hubs, and AI-driven intelligence under a single modern web application.

---

## 🧭 Complete Feature Matrix & Modules

### Module 1: Student Companion Dashboard
* **Profile Header**: Student ID card preview with Roll No, Branch (CSE/IT/ECE/etc.), Semester, Section, CGPA, and Mentor Info.
* **Attendance Health Gauge**: Live circular aggregate attendance percentage with color-coded status badge (🟢 Safe / 🟡 Borderline / 🔴 Shortage).
* **Today's Classes & Timetable Snippet**: Real-time view of current and upcoming lectures, venue, and faculty.
* **Announcements Carousel**: Instant campus circulars, exam notifications, and emergency notices.
* **Academic Streak & Activity KPI**: Tracks lecture streaks, assignment milestones, and event participation.
* **Quick Actions Desk**: Instant shortcuts to apply for Leave/OD, Gate Pass, Report Grievance, or Ask AI Assistant.

---

### Module 2: Academics & Timetable
* **Course Catalog**: Semester subjects with credits, course codes, assigned professors, syllabus tracking (unit completion checkboxes), and downloadable lecture notes/resources.
* **Interactive Weekly Timetable**: Day-by-day interactive schedule (Mon-Fri) highlighting active lectures and classroom numbers.
* **Assignment Submissions Tracker**: Deadlines countdown, status badges (*Pending / Submitted / Graded*), max marks, and instant submission simulation.
* **SGPA & CGPA Projection Planner**: Interactive grade calculator allowing students to simulate target semester grades and project overall CGPA.

---

### Module 3: Smart Attendance & Bunk Predictor
* **Subject-Wise Metrics**: Attended vs. total classes breakdown for every registered course.
* **75% Smart Bunk & Shortage Predictor**:
  - *Safe Zone*: Shows exact number of classes a student can safely skip while staying $\ge 75\%$.
  - *Shortage Alert*: Shows exact number of consecutive classes a student **must attend** to escape shortage.
  - *Target Threshold Slider*: Allows adjusting targets between 65%, 75%, 80%, and 85%.
* **Live Session Check-In Simulator**: Instant 4-digit session PIN verification, QR check-in, and Geofenced campus validation.
* **Attendance History & OD Linking**: Automatically links approved On-Duty (OD) requests with subject attendance records.

---

### Module 4: AI Campus Assistant (Campus Brain)
* **24/7 Intelligent Chatbot**: Conversational AI powered by Google Gemini API (with robust built-in campus NLP engine for offline reliability).
* **Official Application / Email Drafter**: One-click generation of formal On-Duty (OD) letters, leave emails, fee extension letters, and event sponsorship pitches.
* **Academic Regulations Expert**: Answers queries regarding attendance criteria, condonation rules, evaluation patterns, and revaluation procedures.
* **Personalized Study & Exam Tips**: Provides subject revision strategies and schedule optimization.
* **Speech Synthesis & Quick Prompts**: Text-to-speech audio playback and instant quick-prompt chips.

---

### Module 5: Student Early-Warning & Risk Detection
* **Multi-Factor Risk Scoring Algorithm**:
  - Attendance Factor (40% Weightage)
  - Internal Assessment & Marks Factor (30% Weightage)
  - Assignment Delinquency Factor (20% Weightage)
  - Campus Activity & Engagement (10% Weightage)
* **Risk Levels**: **LOW (0-25)** 🟢 | **MODERATE (26-50)** 🟡 | **HIGH (51-75)** 🟠 | **CRITICAL (76-100)** 🔴
* **Risk Dimension Radar Breakdown**: Visual meter highlighting specific weak areas.
* **AI Recovery Roadmap**: Step-by-step prioritized recovery plan with specific target dates (e.g. *Attend next 6 Compiler Design classes, submit pending AI assignment, meet class advisor*).
* **Advisor / Mentor Oversight Panel**: Faculty view to monitor at-risk students before final exams.

---

### Module 6: Smart Complaints & Grievance Redressal
* **Categorized Grievance Filing**: Hostel, Mess & Food, Academics, Infrastructure, IT & Wi-Fi, Anti-Ragging/Harassment, Transport.
* **Confidentiality & Anonymous Toggle**: Option to submit anonymously for sensitive concerns.
* **AI Urgency & Sentiment Tagger**: Automatically assesses urgency (*Critical, High, Medium, Low*) based on issue description.
* **Live Resolution Tracking Board**: Status progression (*Submitted ➔ Under Review ➔ In Progress ➔ Resolved*) with administrative notes and resolution timestamps.
* **Resolution Rating & Feedback**: Student can rate the resolution quality upon completion.

---

### Module 7: Digital Student Services & Requests (E-Governance)
* **Digital Application Hub**:
  - On-Duty (OD) for hackathons, sports, and conferences
  - Medical & Casual Leave
  - Bonafide Certificate requests
  - Hostel Out-pass / Gate Pass
  - Fee & Library No-Dues Clearance
* **QR-Coded Digital Gate Pass**: Generates a verifiable QR pass with unique token for campus security guard inspection upon entry/exit.
* **Multi-Stage Approval Workflow**: Displays real-time reviewer notes and approval history.

---

### Module 8: Digital Certificate Vault & Public Verification
* **Certificate Repository**: Store and view all verified credentials (Hackathon Winner/Participation, Bootcamps, Academic Honors, Dean's List).
* **High-Fidelity PDF Generator**: Downloadable gold-embossed landscape certificates powered by `html2pdf.js` with official seals, signatories, and QR stamps.
* **Public Verification Portal (`/verify-certificate/:certId`)**: Accessible verification page allowing anyone (employers, colleges) to scan QR or enter Certificate ID to verify cryptographic validity.

---

### Module 9: AI Recommendations & Career Roadmaps
* **Smart Event & Hackathon Matching**: Matches student skills (Python, React, etc.), branch, and interests against upcoming campus events with match percentages (e.g. *98% Match*).
* **Career & Skill Roadmaps**: Interactive guided roadmaps for AI/ML, Full Stack Web Dev, Cloud DevOps, Cybersecurity, and Placement Prep.
* **Club & Activity Recommendations**: Recommends campus student chapters (GDG, ACM, Robotics Club, Literary Society).

---

### Module 10: Events Hub (Existing `clg_events` Seamlessly Integrated)
* **Browse Events**: Filter by category (Hackathon, Workshop, Cultural, Sports, Technical, Seminar, Fest), search by title/tags.
* **Event Detail & Registration**: View speaker details, timeline, mode (Offline/Online/Hybrid), register, and generate QR admission tickets.
* **My Tickets**: Student ticket wallet with QR codes and download options.
* **Event Organizer Dashboard**: Create events, manage attendees, export attendee lists, live QR scanner for entry check-in.
* **Super-Admin Event Review**: Review submitted events, approve or reject with feedback.

---

## 🚀 Phase-by-Phase Implementation Roadmap

```
Phase 1: Foundation & Brand Transition
   ├── Update App Branding to "Campus Connect"
   ├── Unified Navbar & Categorized Sidebar Layout
   └── Zustand Store (campusStore.js) & Hybrid Data Architecture

Phase 2: Academic & Attendance Core
   ├── Student Companion Dashboard (/dashboard/student)
   ├── Academics, Syllabus & Timetable Grid (/dashboard/academics)
   └── Smart Attendance & 75% Bunk Predictor (/dashboard/smart-attendance)

Phase 3: Intelligence & Analytics
   ├── AI Campus Assistant & Letter Drafter (/dashboard/ai-assistant)
   └── Student Early-Warning & Risk Detection (/dashboard/risk-detection)

Phase 4: E-Governance & Services
   ├── Smart Complaints & Resolution Board (/dashboard/complaints)
   └── Digital Requests & QR Gate Passes (/dashboard/requests)

Phase 5: Credentials & Recommendations
   ├── Digital Certificate Vault (/dashboard/certificates)
   ├── Public Certificate Verification (/verify-certificate/:certId)
   └── AI Event & Career Recommendations (/dashboard/recommendations)

Phase 6: Integration, Polish & Build Verification
   ├── Seamless Event Integration into Navigation
   ├── Responsive Polish & Aesthetics Review
   └── Full Build Verification (npm run build)
```
