// Pre-seeded & Mock Campus Data for Campus Connect

export const INITIAL_STUDENT_PROFILE = {
  id: 'STU-2024-8842',
  name: 'Alex Johnson',
  email: 'alex.johnson@campus.edu',
  rollNo: '21CS042',
  department: 'Computer Science & Engineering',
  branch: 'CSE',
  semester: 6,
  section: 'A',
  batch: '2022 - 2026',
  cgpa: 8.42,
  currentSgpa: 8.65,
  overallAttendance: 81.5,
  riskLevel: 'LOW',
  mentor: {
    name: 'Dr. Sarah Mitchell',
    designation: 'Associate Professor, Dept. of CSE',
    email: 'sarah.mitchell@campus.edu',
    cabin: 'Tech Block 3, Room 402'
  },
  skills: ['Python', 'React', 'Data Structures', 'Machine Learning', 'SQL'],
  interests: ['AI/ML', 'Web Dev', 'Hackathons', 'Cloud', 'Cybersecurity']
}

export const INITIAL_SUBJECTS = [
  {
    id: 'CS601',
    code: 'CS601',
    name: 'Artificial Intelligence & Machine Learning',
    faculty: 'Dr. Sarah Mitchell',
    credits: 4,
    attended: 28,
    total: 32,
    internalMarks: 24, // out of 25
    color: 'from-blue-500 to-indigo-600',
    schedule: 'Mon, Wed, Fri (10:00 AM)',
    syllabus: [
      { unit: 'Unit 1', title: 'Search Algorithms & Heuristics', completed: true },
      { unit: 'Unit 2', title: 'Knowledge Representation & Logic', completed: true },
      { unit: 'Unit 3', title: 'Supervised Learning (Regression & Classification)', completed: true },
      { unit: 'Unit 4', title: 'Neural Networks & Deep Learning', completed: false },
      { unit: 'Unit 5', title: 'Reinforcement Learning & Ethics', completed: false }
    ],
    resources: [
      { name: 'Lecture 1-12 Notes (PDF)', size: '4.2 MB', url: '#' },
      { name: 'Lab 4 - Neural Net PyTorch Notebook', size: '1.8 MB', url: '#' }
    ]
  },
  {
    id: 'CS602',
    code: 'CS602',
    name: 'Database Management Systems & NoSQL',
    faculty: 'Prof. Rajesh Sharma',
    credits: 4,
    attended: 25,
    total: 30,
    internalMarks: 22,
    color: 'from-emerald-500 to-teal-600',
    schedule: 'Tue, Thu (09:00 AM)',
    syllabus: [
      { unit: 'Unit 1', title: 'Relational Model & Relational Algebra', completed: true },
      { unit: 'Unit 2', title: 'Advanced SQL & Normalization', completed: true },
      { unit: 'Unit 3', title: 'Transaction Processing & Concurrency', completed: true },
      { unit: 'Unit 4', title: 'NoSQL Databases (MongoDB, Cassandra)', completed: false },
      { unit: 'Unit 5', title: 'Distributed Databases & Indexing', completed: false }
    ],
    resources: [
      { name: 'Normalization Cheat Sheet (PDF)', size: '2.1 MB', url: '#' },
      { name: 'MongoDB Aggregation Pipeline Guide', size: '3.4 MB', url: '#' }
    ]
  },
  {
    id: 'CS603',
    code: 'CS603',
    name: 'Computer Networks & Security',
    faculty: 'Dr. Alan Turing Jr.',
    credits: 3,
    attended: 20,
    total: 28,
    internalMarks: 18,
    color: 'from-purple-500 to-pink-600',
    schedule: 'Mon, Wed (02:00 PM)',
    syllabus: [
      { unit: 'Unit 1', title: 'OSI & TCP/IP Protocol Stack', completed: true },
      { unit: 'Unit 2', title: 'Data Link Layer & Flow Control', completed: true },
      { unit: 'Unit 3', title: 'Routing Algorithms (OSPF, BGP)', completed: true },
      { unit: 'Unit 4', title: 'Transport Layer & TCP Congestion Control', completed: false },
      { unit: 'Unit 5', title: 'Network Security & Cryptography', completed: false }
    ],
    resources: [
      { name: 'Wireshark Packet Analysis Lab Guide', size: '5.1 MB', url: '#' },
      { name: 'Subnetting Practical Workbook', size: '1.5 MB', url: '#' }
    ]
  },
  {
    id: 'CS604',
    code: 'CS604',
    name: 'Cloud Computing & DevOps',
    faculty: 'Prof. Priya Varma',
    credits: 3,
    attended: 24,
    total: 26,
    internalMarks: 23,
    color: 'from-amber-500 to-orange-600',
    schedule: 'Tue, Fri (11:15 AM)',
    syllabus: [
      { unit: 'Unit 1', title: 'Cloud Architecture & Service Models', completed: true },
      { unit: 'Unit 2', title: 'Virtualization & Containerization (Docker)', completed: true },
      { unit: 'Unit 3', title: 'Container Orchestration (Kubernetes)', completed: true },
      { unit: 'Unit 4', title: 'CI/CD Pipelines with GitHub Actions', completed: false },
      { unit: 'Unit 5', title: 'Serverless & Cloud Security', completed: false }
    ],
    resources: [
      { name: 'Docker & K8s Hands-on Handbook', size: '6.3 MB', url: '#' }
    ]
  },
  {
    id: 'CS605',
    code: 'CS605',
    name: 'Compiler Design & Automata',
    faculty: 'Dr. Vikram Seth',
    credits: 3,
    attended: 18,
    total: 26,
    internalMarks: 16,
    color: 'from-rose-500 to-red-600',
    schedule: 'Thu, Fri (03:00 PM)',
    syllabus: [
      { unit: 'Unit 1', title: 'Lexical Analysis & Regular Expressions', completed: true },
      { unit: 'Unit 2', title: 'Syntax Analysis & Parsing (LL, LR)', completed: true },
      { unit: 'Unit 3', title: 'Syntax Directed Translation & Type Checking', completed: false },
      { unit: 'Unit 4', title: 'Intermediate Code Generation', completed: false },
      { unit: 'Unit 5', title: 'Code Optimization & Target Code Gen', completed: false }
    ],
    resources: [
      { name: 'Lex & Yacc Guide for Beginners', size: '3.8 MB', url: '#' }
    ]
  }
]

export const INITIAL_TIMETABLE = {
  Monday: [
    { time: '09:00 - 10:00 AM', subject: 'DBMS & NoSQL', code: 'CS602', room: 'LH-301', faculty: 'Prof. Rajesh Sharma' },
    { time: '10:00 - 11:00 AM', subject: 'AI & Machine Learning', code: 'CS601', room: 'LH-301', faculty: 'Dr. Sarah Mitchell' },
    { time: '11:15 - 12:15 PM', subject: 'Cloud & DevOps Lab', code: 'CS604L', room: 'Lab 4', faculty: 'Prof. Priya Varma' },
    { time: '02:00 - 03:00 PM', subject: 'Computer Networks', code: 'CS603', room: 'LH-302', faculty: 'Dr. Alan Turing Jr.' },
    { time: '03:00 - 04:00 PM', subject: 'Library / Project Mentorship', code: 'PROJ', room: 'Seminar Hall B', faculty: 'Dr. Sarah Mitchell' }
  ],
  Tuesday: [
    { time: '09:00 - 10:00 AM', subject: 'DBMS & NoSQL', code: 'CS602', room: 'LH-301', faculty: 'Prof. Rajesh Sharma' },
    { time: '10:00 - 11:00 AM', subject: 'Compiler Design', code: 'CS605', room: 'LH-304', faculty: 'Dr. Vikram Seth' },
    { time: '11:15 - 12:15 PM', subject: 'Cloud Computing', code: 'CS604', room: 'LH-301', faculty: 'Prof. Priya Varma' },
    { time: '01:30 - 03:30 PM', subject: 'AI & ML Lab', code: 'CS601L', room: 'AI Research Lab', faculty: 'Dr. Sarah Mitchell' }
  ],
  Wednesday: [
    { time: '10:00 - 11:00 AM', subject: 'AI & Machine Learning', code: 'CS601', room: 'LH-301', faculty: 'Dr. Sarah Mitchell' },
    { time: '11:15 - 12:15 PM', subject: 'Compiler Design', code: 'CS605', room: 'LH-304', faculty: 'Dr. Vikram Seth' },
    { time: '02:00 - 03:00 PM', subject: 'Computer Networks', code: 'CS603', room: 'LH-302', faculty: 'Dr. Alan Turing Jr.' },
    { time: '03:00 - 04:30 PM', subject: 'Campus Club / Hackathon Prep', code: 'EXT', room: 'Auditorium 2', faculty: 'Student Council' }
  ],
  Thursday: [
    { time: '09:00 - 10:00 AM', subject: 'DBMS & NoSQL', code: 'CS602', room: 'LH-301', faculty: 'Prof. Rajesh Sharma' },
    { time: '10:00 - 11:00 AM', subject: 'Cloud Computing', code: 'CS604', room: 'LH-301', faculty: 'Prof. Priya Varma' },
    { time: '01:30 - 03:30 PM', subject: 'DBMS Lab (SQL & MongoDB)', code: 'CS602L', room: 'Lab 2', faculty: 'Prof. Rajesh Sharma' },
    { time: '03:30 - 04:30 PM', subject: 'Compiler Design', code: 'CS605', room: 'LH-304', faculty: 'Dr. Vikram Seth' }
  ],
  Friday: [
    { time: '10:00 - 11:00 AM', subject: 'AI & Machine Learning', code: 'CS601', room: 'LH-301', faculty: 'Dr. Sarah Mitchell' },
    { time: '11:15 - 12:15 PM', subject: 'Cloud Computing', code: 'CS604', room: 'LH-301', faculty: 'Prof. Priya Varma' },
    { time: '02:00 - 03:00 PM', subject: 'Computer Networks', code: 'CS603', room: 'LH-302', faculty: 'Dr. Alan Turing Jr.' },
    { time: '03:00 - 04:00 PM', subject: 'Compiler Design', code: 'CS605', room: 'LH-304', faculty: 'Dr. Vikram Seth' }
  ]
}

export const INITIAL_ASSIGNMENTS = [
  {
    id: 'ASG-101',
    subjectId: 'CS601',
    subjectName: 'Artificial Intelligence & Machine Learning',
    title: 'Supervised Learning Classifier with Scikit-Learn',
    dueDate: '2026-09-05',
    maxMarks: 20,
    status: 'Pending', // 'Submitted' | 'Graded' | 'Pending'
    description: 'Implement a Random Forest & SVM pipeline on the Kaggle churn dataset with cross-validation and ROC curve analysis.',
    submittedDate: null,
    score: null
  },
  {
    id: 'ASG-102',
    subjectId: 'CS602',
    subjectName: 'Database Management Systems & NoSQL',
    title: 'E-Commerce Schema Design & Indexing Optimization',
    dueDate: '2026-09-02',
    maxMarks: 25,
    status: 'Submitted',
    description: 'Provide normalized 3NF schema diagrams, PostgreSQL queries with EXPLAIN ANALYZE, and MongoDB replica setup.',
    submittedDate: '2026-08-27',
    score: null
  },
  {
    id: 'ASG-103',
    subjectId: 'CS604',
    subjectName: 'Cloud Computing & DevOps',
    title: 'Multi-Stage Docker & GitHub Actions CI/CD Pipeline',
    dueDate: '2026-08-25',
    maxMarks: 20,
    status: 'Graded',
    description: 'Build a containerized Node.js service with automated unit tests and Docker Hub deployment on tag push.',
    submittedDate: '2026-08-24',
    score: 19
  },
  {
    id: 'ASG-104',
    subjectId: 'CS605',
    subjectName: 'Compiler Design & Automata',
    title: 'Lexical Analyzer & Recursive Descent Parser in C/C++',
    dueDate: '2026-09-10',
    maxMarks: 30,
    status: 'Pending',
    description: 'Construct a token scanner for arithmetic expressions supporting operator precedence and error recovery.',
    submittedDate: null,
    score: null
  }
]

export const INITIAL_ANNOUNCEMENTS = [
  {
    id: 'ANN-01',
    title: 'Mid-Semester Examination Schedule Announced',
    category: 'Academics',
    date: 'Aug 28, 2026',
    urgency: 'Important',
    content: 'Mid-term examinations for 6th-semester B.Tech students will commence from September 21, 2026. Hall tickets will be available in the Requests portal.'
  },
  {
    id: 'ANN-02',
    title: 'Campus Hackathon 2026 Registration Open',
    category: 'Events',
    date: 'Aug 26, 2026',
    urgency: 'Highlight',
    content: '36-Hour National Flagship Hackathon registrations are live in the Events Hub with prizes up to ₹1,50,000.'
  },
  {
    id: 'ANN-03',
    title: 'Hostel Maintenance & Wi-Fi Upgrade Notice',
    category: 'Campus Facilities',
    date: 'Aug 25, 2026',
    urgency: 'Notice',
    content: 'Wi-Fi access points in Tech Block 3 and Block B hostel are being upgraded to Wi-Fi 6 on Saturday.'
  }
]

export const INITIAL_COMPLAINTS = [
  {
    id: 'CMP-2026-001',
    title: 'High-speed Wi-Fi dropping frequently in Tech Block 3 Lab',
    category: 'IT & Wi-Fi',
    description: 'The access points in Tech Block 3 Room 402 and Lab 4 have high packet loss during afternoon laboratory sessions.',
    status: 'In Progress', // 'Submitted' | 'Under Review' | 'In Progress' | 'Resolved'
    urgency: 'Medium',
    isAnonymous: false,
    studentName: 'Alex Johnson',
    studentRoll: '21CS042',
    submittedAt: '2026-08-24T14:30:00Z',
    location: 'Tech Block 3, 4th Floor',
    timeline: [
      { status: 'Submitted', date: 'Aug 24, 2026', note: 'Grievance ticket created' },
      { status: 'Under Review', date: 'Aug 25, 2026', note: 'Assigned to Campus Network Operations team' },
      { status: 'In Progress', date: 'Aug 26, 2026', note: 'Cisco AP firmware update and cable diagnostics underway' }
    ],
    adminResponse: 'Network team has replaced the faulty switch in rack 4B. Verification will be completed by Aug 29.'
  },
  {
    id: 'CMP-2026-002',
    title: 'Air conditioning malfunction in Main Seminar Hall B',
    category: 'Infrastructure',
    description: 'Two split AC units are leaking water and causing excessive humidity during club events.',
    status: 'Resolved',
    urgency: 'Low',
    isAnonymous: true,
    studentName: 'Anonymous Student',
    studentRoll: 'Hidden',
    submittedAt: '2026-08-18T09:15:00Z',
    location: 'Main Seminar Hall B',
    timeline: [
      { status: 'Submitted', date: 'Aug 18, 2026', note: 'Ticket logged' },
      { status: 'Resolved', date: 'Aug 20, 2026', note: 'Facility maintenance serviced and unclogged condensate pipes' }
    ],
    adminResponse: 'Maintenance team serviced all units and checked coolant levels.'
  },
  {
    id: 'CMP-2026-003',
    title: 'Mess food quality inspection requested for Block B Dining',
    category: 'Mess & Food',
    description: 'Dinner served on Wednesday evening had cold dishes and inadequate drinking water dispensers.',
    status: 'Under Review',
    urgency: 'High',
    isAnonymous: false,
    studentName: 'Alex Johnson',
    studentRoll: '21CS042',
    submittedAt: '2026-08-26T21:00:00Z',
    location: 'Hostel Block B Mess',
    timeline: [
      { status: 'Submitted', date: 'Aug 26, 2026', note: 'Grievance submitted' },
      { status: 'Under Review', date: 'Aug 27, 2026', note: 'Hostel Warden & Food Committee notified for surprise audit' }
    ],
    adminResponse: 'Food committee has scheduled a surprise quality inspection on Friday.'
  }
]

export const INITIAL_REQUESTS = [
  {
    id: 'REQ-2026-104',
    type: 'On-Duty (OD)',
    purpose: 'Smart India Hackathon 2026 Grand Finale Participation',
    startDate: '2026-09-12',
    endDate: '2026-09-15',
    daysCount: 4,
    status: 'Approved', // 'Pending' | 'Approved' | 'Rejected'
    appliedAt: '2026-08-20',
    reviewer: 'Dr. Sarah Mitchell (HOD CSE)',
    comments: 'Approved. Best of luck for SIH 2026 Finals!',
    attachments: ['SIH_Shortlist_Letter.pdf'],
    token: 'OD-AUTH-99482-VERIFIED',
    qrData: 'CAMPUS-OD-REQ-2026-104-STU21CS042-APPROVED'
  },
  {
    id: 'REQ-2026-105',
    type: 'Hostel Gate Pass',
    purpose: 'Weekend Home Visit',
    startDate: '2026-08-29 05:00 PM',
    endDate: '2026-08-31 08:00 PM',
    daysCount: 2,
    status: 'Approved',
    appliedAt: '2026-08-27',
    reviewer: 'Chief Hostel Warden',
    comments: 'Parent confirmation received via SMS.',
    attachments: [],
    token: 'GP-SEC-77312-VALID',
    qrData: 'GATEPASS-2026-105-VALID-EXIT-29AUG-ENTRY-31AUG'
  },
  {
    id: 'REQ-2026-106',
    type: 'Bonafide Certificate',
    purpose: 'Application for State Higher Education Merit Scholarship',
    startDate: '2026-08-28',
    endDate: '2026-08-28',
    daysCount: 1,
    status: 'Pending',
    appliedAt: '2026-08-28',
    reviewer: 'Academic Registrar Office',
    comments: 'Document under verification by registrar office.',
    attachments: ['Scholarship_Notification.pdf'],
    token: 'REQ-BONAFIDE-PENDING',
    qrData: 'BONAFIDE-REQ-2026-106-PROCESSING'
  }
]

export const INITIAL_CERTIFICATES = [
  {
    id: 'CERT-2026-HACK-091',
    certNumber: 'CAMPUS-2026-CS-0912',
    title: '1st Prize Winner - GenAI & LLM Hackathon 2026',
    category: 'Hackathon & Competitions',
    studentName: 'Alex Johnson',
    rollNo: '21CS042',
    issuedDate: '2026-08-15',
    issuer: 'Google Developer Student Clubs & Dept. of CSE',
    signatories: [
      { name: 'Dr. Sarah Mitchell', title: 'Head of Department, CSE' },
      { name: 'Prof. Kevin Vance', title: 'Dean of Student Affairs' }
    ],
    badgeColor: 'gold',
    description: 'For outstanding innovation and technical excellence in building the autonomous campus multi-agent system.',
    verified: true,
    hash: 'e83f9c2d1b84e7a602394fa9817e0b5c'
  },
  {
    id: 'CERT-2026-DEV-044',
    certNumber: 'CAMPUS-2026-WS-0441',
    title: 'Cloud Native & Kubernetes Mastery Bootcamp',
    category: 'Workshops & Bootcamps',
    studentName: 'Alex Johnson',
    rollNo: '21CS042',
    issuedDate: '2026-07-22',
    issuer: 'Cloud Computing Center of Excellence',
    signatories: [
      { name: 'Prof. Priya Varma', title: 'Cloud CoE Lead' },
      { name: 'Dr. Alan Turing Jr.', title: 'Director of Computing' }
    ],
    badgeColor: 'blue',
    description: 'Successfully completed 30 hours of rigorous hands-on training in Docker, Kubernetes, and Helm deployments.',
    verified: true,
    hash: 'a91b2c4d5e6f7a8b9c0d1e2f3a4b5c6d'
  },
  {
    id: 'CERT-2026-ACAD-012',
    certNumber: 'CAMPUS-2026-HON-0129',
    title: "Dean's Academic Honor List - Semester 5",
    category: 'Academic Excellence',
    studentName: 'Alex Johnson',
    rollNo: '21CS042',
    issuedDate: '2026-06-10',
    issuer: 'Office of Academic Affairs',
    signatories: [
      { name: 'Dr. Robert Chen', title: 'Dean of Academics' },
      { name: 'Dr. Michael Thorne', title: 'Vice Chancellor' }
    ],
    badgeColor: 'emerald',
    description: 'Awarded in recognition of exceptional scholastic achievement and securing SGPA > 8.5.',
    verified: true,
    hash: 'f5e4d3c2b1a09876543210fedcba9876'
  }
]

export const INITIAL_AI_RECOMMENDATIONS = [
  {
    id: 'REC-01',
    title: 'HackCampus 2026: 36-Hour National Flagship Hackathon',
    type: 'Hackathon',
    matchScore: 98,
    matchReason: 'Top match based on your high proficiency in Python, React, and interest in AI/ML.',
    date: 'Sep 18 - 20, 2026',
    mode: 'OFFLINE (Campus Auditorium)',
    tags: ['AI/ML', 'Web Dev', 'Grand Cash Prizes', 'Free Food'],
    actionUrl: '/events',
    urgency: 'Registrations closing in 4 days'
  },
  {
    id: 'REC-02',
    title: 'Masterclass on PyTorch & Generative Multimodal Agents',
    type: 'Workshop',
    matchScore: 94,
    matchReason: 'Directly reinforces your ongoing CS601 course syllabus and upcoming Unit 4 Neural Networks.',
    date: 'Sep 08, 2026',
    mode: 'HYBRID',
    tags: ['Deep Learning', 'PyTorch', 'Certificate', 'Hands-on'],
    actionUrl: '/events',
    urgency: 'Limited to 60 seats'
  },
  {
    id: 'REC-03',
    title: 'Academic Recovery & Boost: Compiler Design Clinic',
    type: 'Academic Support',
    matchScore: 91,
    matchReason: 'Recommended because CS605 (Compiler Design) attendance is at 69.2% (<75%).',
    date: 'Every Saturday (11:00 AM)',
    mode: 'OFFLINE (Room 304)',
    tags: ['Faculty Mentorship', 'Attendance Makeup', 'Doubt Clearing'],
    actionUrl: '/dashboard/smart-attendance',
    urgency: 'Action Recommended'
  },
  {
    id: 'REC-04',
    title: 'Google Developer Group Campus Lead Open Nominations',
    type: 'Leadership & Clubs',
    matchScore: 88,
    matchReason: 'Aligns with your 1st place hackathon achievement and active campus participation.',
    date: 'Deadline: Sep 15, 2026',
    mode: 'CAMPUS',
    tags: ['Community', 'Leadership', 'GDG', 'Networking'],
    actionUrl: '/events',
    urgency: 'Open now'
  }
]
