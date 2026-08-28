const CAMPUS_KNOWLEDGE_BASE = [
  {
    keywords: ['attendance', 'bunk', 'shortage', '75', 'criteria', 'minimum attendance'],
    answer: `### 🎓 Campus Attendance Policy & Regulations
1. **Mandatory Minimum Attendance**: You must maintain a minimum of **75% aggregate attendance** and **75% per subject** to be eligible for End-Semester Examinations.
2. **Medical Condonation**: Attendance between **65% and 74%** may be condoned by the Dean of Academics with valid medical documentation or approved On-Duty (OD) certificates.
3. **Severe Shortage (<65%)**: Mandatory course repeat / fast-track summer term.
4. **Current Status**: Check the **Smart Attendance** tab for the live **Bunk & Shortage Predictor** to see exact numbers of classes you can miss or need to attend.`
  },
  {
    keywords: ['od', 'on duty', 'leave', 'gate pass', 'out pass', 'apply'],
    answer: `### 📝 How to Apply for On-Duty (OD) & Campus Passes
1. **On-Duty (OD)**: Submit your request under the **Requests** tab with attached proof (hackathon invitation, sports selection, or conference registration). ODs must be submitted at least 2 days in advance.
2. **Hostel Gate Pass**: Apply via the **Requests** tab -> *Hostel Gate Pass*. Once approved by the Warden, a real-time **QR Gate Pass** is generated for gate security scanning.
3. **Bonafide Certificate**: Applied digitally and ready within 24-48 business hours with verified digital seal.`
  },
  {
    keywords: ['exam', 'midterm', 'grading', 'cgpa', 'sgpa', 'marks', 'internal'],
    answer: `### 📊 Examinations & Evaluation Pattern
- **Internal Assessment (40% Weightage)**:
  - Mid-Term Exams (20 Marks)
  - Assignments & Lab Quizzes (15 Marks)
  - Attendance & Class Participation (5 Marks)
- **End-Semester Examination (60% Weightage)**: Theory & Practical comprehensive evaluation.
- **Grading Scale**: 
  - 90-100: **O** (Grade Point 10)
  - 80-89: **A+** (Grade Point 9)
  - 70-79: **A** (Grade Point 8)
  - 60-69: **B+** (Grade Point 7)`
  },
  {
    keywords: ['complaint', 'grievance', 'hostel', 'wifi', 'mess', 'ragging', 'harassment'],
    answer: `### 🛡️ Smart Grievance & Student Redressal
- All student issues can be submitted in the **Smart Complaints** portal.
- **Anonymous Option**: You can toggle *Submit Anonymously* for sensitive matters (Ragging, Harassment, Mess, or Hostels).
- **Anti-Ragging Helpline**: Toll-Free **1800-180-5522** (24x7 Active).
- Tickets are automatically classified with AI urgency priority (Critical/High/Medium/Low) and tracked on the live resolution board.`
  },
  {
    keywords: ['hackathon', 'event', 'club', 'gdg', 'acm', 'recommendation', 'prizes'],
    answer: `### 🚀 Campus Innovation & Hackathons
- Upcoming flagship: **HackCampus 2026** (36-Hour National Hackathon with prizes up to ₹1,50,000).
- Check the **AI Recommendations** tab for event matches calculated based on your CSE skill profile (AI/ML, Python, Web Dev).
- Earn certified credentials stored forever in your **Certificate Vault**!`
  }
]

export const generateAiCampusResponse = async (userPrompt, chatHistory = []) => {
  const geminiApiKey = import.meta.env.VITE_GEMINI_API_KEY

  if (geminiApiKey) {
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiApiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [
              {
                role: 'user',
                parts: [
                  {
                    text: `You are the friendly, highly knowledgeable AI Campus Assistant for Campus Connect.
Context: Student is Alex Johnson, 6th Sem B.Tech CSE, Roll: 21CS042, CGPA: 8.42, Attendance: 81.5%.
Answer the student's question clearly with helpful formatting, bullet points, and proactive suggestions.

Question: ${userPrompt}`
                  }
                ]
              }
            ]
          })
        }
      )

      if (response.ok) {
        const data = await response.json()
        const reply = data.candidates?.[0]?.content?.parts?.[0]?.text
        if (reply) return reply
      }
    } catch (err) {
      console.warn('Gemini API call failed, falling back to Campus Knowledge Engine:', err)
    }
  }

  const lower = userPrompt.toLowerCase()

  for (const item of CAMPUS_KNOWLEDGE_BASE) {
    if (item.keywords.some((k) => lower.includes(k))) {
      return item.answer
    }
  }

  if (lower.includes('write') || lower.includes('draft') || lower.includes('letter') || lower.includes('mail')) {
    return `### ✉️ Drafted Application / Email

**Subject: Request for On-Duty (OD) Leave for Smart India Hackathon Participation**

Respected Head of Department / Class Advisor,

I am **Alex Johnson** (Roll No: **21CS042**), a 6th-semester student in the Department of Computer Science & Engineering. 

I am pleased to inform you that our project has been shortlisted for the **Smart India Hackathon 2026 Grand Finale** scheduled from **September 12, 2026 to September 15, 2026**.

I kindly request you to grant me **4 days of On-Duty (OD) leave** for the duration of the event. I will ensure that all academic coursework, laboratory assignments, and lecture notes missed during this period are promptly completed.

Thanking you.

Yours sincerely,  
**Alex Johnson**  
Roll No: 21CS042 | Dept. of CSE  
Phone: +91 98765 43210`
  }

  return `### 🤖 Campus AI Assistant Response

Hello Alex! Based on your academic record in **6th Sem B.Tech CSE**:

- **Current Attendance**: **81.5%** (Overall Healthy 🟢, but watch *CS605 Compiler Design* which is at **69.2%**).
- **Current CGPA**: **8.42** | SGPA Projection: **8.65**.
- **Pending Deliverables**: *Supervised Learning Classifier* (Due Sep 05) and *Lexical Analyzer* (Due Sep 10).
- **Recommended Action**: 
  1. Check **Smart Attendance** to see your exact 75% safety buffer.
  2. Visit **AI Recommendations** for upcoming workshops on GenAI and Cloud Computing.
  3. Submit an OD request under **Requests** for your upcoming competitions.

How else can I assist your campus journey today? Feel free to ask about syllabus, timetable, gate passes, or study tips!`
}
