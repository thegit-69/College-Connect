import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
} from 'firebase/firestore'
import { db } from './firebase'
import {
  INITIAL_STUDENT_PROFILE,
  INITIAL_SUBJECTS,
  INITIAL_TIMETABLE,
  INITIAL_ASSIGNMENTS,
  INITIAL_ANNOUNCEMENTS,
  INITIAL_COMPLAINTS,
  INITIAL_REQUESTS,
  INITIAL_CERTIFICATES,
  INITIAL_AI_RECOMMENDATIONS,
} from './campusData'

// Collection constants
export const COLLECTIONS = {
  STUDENTS: 'students',
  SUBJECTS: 'subjects',
  TIMETABLE: 'timetable',
  ASSIGNMENTS: 'assignments',
  ANNOUNCEMENTS: 'announcements',
  COMPLAINTS: 'complaints',
  REQUESTS: 'requests',
  CERTIFICATES: 'certificates',
  RECOMMENDATIONS: 'recommendations',
  EVENTS: 'events',
  MOOD_LOGS: 'mood_logs',
}

const DEFAULT_STUDENT_DOC_ID = 'default_student'

export const INITIAL_MOOD_LOGS = [
  {
    id: 'mood-2026-08-27',
    date: '2026-08-27',
    level: 4,
    label: 'Good',
    emoji: '😊',
    tags: ['Coding', 'Good Sleep', 'Productive'],
    note: 'Finished my DBMS assignment early and had a great mentoring session with Dr. Sarah.',
    aiAdvice: 'Great momentum! Keep pacing yourself with short breaks between coding blocks.',
    createdAt: new Date('2026-08-27T09:00:00Z'),
  },
  {
    id: 'mood-2026-08-26',
    date: '2026-08-26',
    level: 3,
    label: 'Okay',
    emoji: '😐',
    tags: ['Exams', 'Lecture Pace'],
    note: 'Compiler design lecture was a bit heavy today, need to review lexical analysis notes.',
    aiAdvice: 'Compiler automata can feel abstract at first. Break down syntax trees one step at a time!',
    createdAt: new Date('2026-08-26T09:00:00Z'),
  },
  {
    id: 'mood-2026-08-25',
    date: '2026-08-25',
    level: 5,
    label: 'Excellent',
    emoji: '🤩',
    tags: ['Hackathon', 'Team Spirit'],
    note: 'Won 1st prize in the GenAI Hackathon! Team worked super well together.',
    aiAdvice: 'Huge congratulations! Celebrate this milestone and document your project insights.',
    createdAt: new Date('2026-08-25T09:00:00Z'),
  },
]

/**
 * Seed Firestore with initial Campus Connect mock data if collections are empty
 */
export const seedCampusDatabaseToFirestore = async (force = false) => {
  try {
    console.log('[Firestore] Checking if campus database requires seeding...')

    // Check students collection
    const studentDocRef = doc(db, COLLECTIONS.STUDENTS, DEFAULT_STUDENT_DOC_ID)
    const studentSnap = await getDoc(studentDocRef)

    if (!studentSnap.exists() || force) {
      console.log('[Firestore] Seeding default student profile...')
      await setDoc(studentDocRef, {
        ...INITIAL_STUDENT_PROFILE,
        updatedAt: serverTimestamp(),
      })
    }

    // Seed Subjects
    const subjectsSnap = await getDocs(collection(db, COLLECTIONS.SUBJECTS))
    if (subjectsSnap.empty || force) {
      console.log('[Firestore] Seeding subjects...')
      for (const subject of INITIAL_SUBJECTS) {
        await setDoc(doc(db, COLLECTIONS.SUBJECTS, subject.id), {
          ...subject,
          updatedAt: serverTimestamp(),
        })
      }
    }

    // Seed Timetable
    const timetableSnap = await getDocs(collection(db, COLLECTIONS.TIMETABLE))
    if (timetableSnap.empty || force) {
      console.log('[Firestore] Seeding timetable...')
      for (const [day, slots] of Object.entries(INITIAL_TIMETABLE)) {
        await setDoc(doc(db, COLLECTIONS.TIMETABLE, day), {
          day,
          slots,
          updatedAt: serverTimestamp(),
        })
      }
    }

    // Seed Assignments
    const assignmentsSnap = await getDocs(collection(db, COLLECTIONS.ASSIGNMENTS))
    if (assignmentsSnap.empty || force) {
      console.log('[Firestore] Seeding assignments...')
      for (const asg of INITIAL_ASSIGNMENTS) {
        await setDoc(doc(db, COLLECTIONS.ASSIGNMENTS, asg.id), {
          ...asg,
          createdAt: serverTimestamp(),
        })
      }
    }

    // Seed Announcements
    const announcementsSnap = await getDocs(collection(db, COLLECTIONS.ANNOUNCEMENTS))
    if (announcementsSnap.empty || force) {
      console.log('[Firestore] Seeding announcements...')
      for (const ann of INITIAL_ANNOUNCEMENTS) {
        await setDoc(doc(db, COLLECTIONS.ANNOUNCEMENTS, ann.id), {
          ...ann,
          createdAt: serverTimestamp(),
        })
      }
    }

    // Seed Complaints
    const complaintsSnap = await getDocs(collection(db, COLLECTIONS.COMPLAINTS))
    if (complaintsSnap.empty || force) {
      console.log('[Firestore] Seeding complaints...')
      for (const comp of INITIAL_COMPLAINTS) {
        await setDoc(doc(db, COLLECTIONS.COMPLAINTS, comp.id), {
          ...comp,
          createdAt: serverTimestamp(),
        })
      }
    }

    // Seed Requests
    const requestsSnap = await getDocs(collection(db, COLLECTIONS.REQUESTS))
    if (requestsSnap.empty || force) {
      console.log('[Firestore] Seeding requests...')
      for (const req of INITIAL_REQUESTS) {
        await setDoc(doc(db, COLLECTIONS.REQUESTS, req.id), {
          ...req,
          createdAt: serverTimestamp(),
        })
      }
    }

    // Seed Certificates
    const certificatesSnap = await getDocs(collection(db, COLLECTIONS.CERTIFICATES))
    if (certificatesSnap.empty || force) {
      console.log('[Firestore] Seeding certificates...')
      for (const cert of INITIAL_CERTIFICATES) {
        await setDoc(doc(db, COLLECTIONS.CERTIFICATES, cert.id), {
          ...cert,
          createdAt: serverTimestamp(),
        })
      }
    }

    // Seed Recommendations
    const recSnap = await getDocs(collection(db, COLLECTIONS.RECOMMENDATIONS))
    if (recSnap.empty || force) {
      console.log('[Firestore] Seeding AI recommendations...')
      for (const rec of INITIAL_AI_RECOMMENDATIONS) {
        await setDoc(doc(db, COLLECTIONS.RECOMMENDATIONS, rec.id), {
          ...rec,
          createdAt: serverTimestamp(),
        })
      }
    }

    // Seed Mood Logs
    const moodSnap = await getDocs(collection(db, COLLECTIONS.MOOD_LOGS))
    if (moodSnap.empty || force) {
      console.log('[Firestore] Seeding mood logs...')
      for (const mood of INITIAL_MOOD_LOGS) {
        await setDoc(doc(db, COLLECTIONS.MOOD_LOGS, mood.id), {
          ...mood,
          createdAt: serverTimestamp(),
        })
      }
    }

    // Seed sample approved events if events collection is empty
    const eventsSnap = await getDocs(collection(db, COLLECTIONS.EVENTS))
    if (eventsSnap.empty || force) {
      console.log('[Firestore] Seeding initial campus events...')
      const sampleEvents = [
        {
          id: 'event-genai-2026',
          title: 'GenAI & Autonomous Agents Hackathon 2026',
          description: 'Build cutting-edge multi-agent systems and full-stack generative AI solutions in 36 hours. Exciting prizes, cloud credits, and industry mentorship.',
          category: 'Hackathon',
          date: '2026-09-18',
          time: '09:00 AM - 06:00 PM',
          venue: 'Campus Main Auditorium & Tech Labs',
          organizer: 'Dept. of Computer Science & GDG Campus',
          capacity: 250,
          registeredCount: 84,
          price: 0,
          approvalStatus: 'approved',
          image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=80',
          speakers: ['Dr. Sarah Mitchell (AI Lead)', 'Arun Sundar (Google Cloud Architect)'],
          createdAt: serverTimestamp(),
        },
        {
          id: 'event-cloud-summit',
          title: 'Cloud Native & Kubernetes Mastery Bootcamp',
          description: 'Hands-on intensive masterclass on microservices orchestration, Docker containerization, and automated CI/CD pipelines.',
          category: 'Workshop',
          date: '2026-09-25',
          time: '10:00 AM - 04:00 PM',
          venue: 'Tech Block 3, Seminar Hall A',
          organizer: 'Cloud Computing Center of Excellence',
          capacity: 120,
          registeredCount: 65,
          price: 0,
          approvalStatus: 'approved',
          image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=800&q=80',
          speakers: ['Prof. Priya Varma (DevOps Lead)'],
          createdAt: serverTimestamp(),
        },
        {
          id: 'event-cultural-fest',
          title: 'Syonara Annual Cultural & Tech Gala',
          description: 'The premier annual cultural festival featuring battle of bands, hack sprints, gaming tournaments, and guest artist performances.',
          category: 'Fest',
          date: '2026-10-08',
          time: '04:00 PM - 10:00 PM',
          venue: 'Open Air Amphitheatre',
          organizer: 'Student Council & Cultural Club',
          capacity: 1200,
          registeredCount: 420,
          price: 0,
          approvalStatus: 'approved',
          image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=800&q=80',
          speakers: ['Student Cultural Leads'],
          createdAt: serverTimestamp(),
        },
      ]

      for (const ev of sampleEvents) {
        await setDoc(doc(db, COLLECTIONS.EVENTS, ev.id), ev)
      }
    }

    console.log('[Firestore] Campus database seeding verified and complete.')
    return true
  } catch (error) {
    console.error('[Firestore] Seeding error:', error)
    return false
  }
}

/**
 * Real-time subscription to all Campus Connect Firestore collections
 */
export const subscribeToCampusCollections = (callbacks) => {
  const unsubscribers = []

  try {
    // 1. Student Profile
    const studentRef = doc(db, COLLECTIONS.STUDENTS, DEFAULT_STUDENT_DOC_ID)
    const unsubStudent = onSnapshot(studentRef, (docSnap) => {
      if (docSnap.exists() && callbacks.onStudentUpdate) {
        callbacks.onStudentUpdate(docSnap.data())
      }
    }, (err) => console.warn('Student profile listen error:', err.message))
    unsubscribers.push(unsubStudent)

    // 2. Subjects
    const subjectsRef = collection(db, COLLECTIONS.SUBJECTS)
    const unsubSubjects = onSnapshot(subjectsRef, (snap) => {
      if (!snap.empty && callbacks.onSubjectsUpdate) {
        const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }))
        callbacks.onSubjectsUpdate(list)
      }
    }, (err) => console.warn('Subjects listen error:', err.message))
    unsubscribers.push(unsubSubjects)

    // 3. Timetable
    const timetableRef = collection(db, COLLECTIONS.TIMETABLE)
    const unsubTimetable = onSnapshot(timetableRef, (snap) => {
      if (!snap.empty && callbacks.onTimetableUpdate) {
        const map = {}
        snap.docs.forEach((d) => {
          const data = d.data()
          map[d.id] = data.slots || []
        })
        callbacks.onTimetableUpdate(map)
      }
    }, (err) => console.warn('Timetable listen error:', err.message))
    unsubscribers.push(unsubTimetable)

    // 4. Assignments
    const asgRef = collection(db, COLLECTIONS.ASSIGNMENTS)
    const unsubAssignments = onSnapshot(asgRef, (snap) => {
      if (!snap.empty && callbacks.onAssignmentsUpdate) {
        const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }))
        callbacks.onAssignmentsUpdate(list)
      }
    }, (err) => console.warn('Assignments listen error:', err.message))
    unsubscribers.push(unsubAssignments)

    // 5. Announcements
    const annRef = collection(db, COLLECTIONS.ANNOUNCEMENTS)
    const unsubAnnouncements = onSnapshot(annRef, (snap) => {
      if (!snap.empty && callbacks.onAnnouncementsUpdate) {
        const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }))
        callbacks.onAnnouncementsUpdate(list)
      }
    }, (err) => console.warn('Announcements listen error:', err.message))
    unsubscribers.push(unsubAnnouncements)

    // 6. Complaints
    const compRef = collection(db, COLLECTIONS.COMPLAINTS)
    const unsubComplaints = onSnapshot(compRef, (snap) => {
      if (!snap.empty && callbacks.onComplaintsUpdate) {
        const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }))
        callbacks.onComplaintsUpdate(list)
      }
    }, (err) => console.warn('Complaints listen error:', err.message))
    unsubscribers.push(unsubComplaints)

    // 7. Requests
    const reqRef = collection(db, COLLECTIONS.REQUESTS)
    const unsubRequests = onSnapshot(reqRef, (snap) => {
      if (!snap.empty && callbacks.onRequestsUpdate) {
        const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }))
        callbacks.onRequestsUpdate(list)
      }
    }, (err) => console.warn('Requests listen error:', err.message))
    unsubscribers.push(unsubRequests)

    // 8. Certificates
    const certRef = collection(db, COLLECTIONS.CERTIFICATES)
    const unsubCertificates = onSnapshot(certRef, (snap) => {
      if (!snap.empty && callbacks.onCertificatesUpdate) {
        const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }))
        callbacks.onCertificatesUpdate(list)
      }
    }, (err) => console.warn('Certificates listen error:', err.message))
    unsubscribers.push(unsubCertificates)

    // 9. Recommendations
    const recRef = collection(db, COLLECTIONS.RECOMMENDATIONS)
    const unsubRecs = onSnapshot(recRef, (snap) => {
      if (!snap.empty && callbacks.onRecommendationsUpdate) {
        const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }))
        callbacks.onRecommendationsUpdate(list)
      }
    }, (err) => console.warn('Recommendations listen error:', err.message))
    unsubscribers.push(unsubRecs)

    // 10. Mood Logs
    const moodRef = collection(db, COLLECTIONS.MOOD_LOGS)
    const unsubMood = onSnapshot(moodRef, (snap) => {
      if (!snap.empty && callbacks.onMoodUpdate) {
        const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }))
        callbacks.onMoodUpdate(list)
      }
    }, (err) => console.warn('Mood listen error:', err.message))
    unsubscribers.push(unsubMood)

  } catch (error) {
    console.error('Error setting up Firestore subscriptions:', error)
  }

  return () => {
    unsubscribers.forEach((unsub) => {
      if (typeof unsub === 'function') unsub()
    })
  }
}

// ==========================================
// CRUD Document Operations
// ==========================================

export const saveStudentProfileDoc = async (profileData) => {
  const docRef = doc(db, COLLECTIONS.STUDENTS, DEFAULT_STUDENT_DOC_ID)
  await setDoc(docRef, { ...profileData, updatedAt: serverTimestamp() }, { merge: true })
}

export const updateSubjectAttendanceDoc = async (subjectId, attended, total) => {
  const docRef = doc(db, COLLECTIONS.SUBJECTS, subjectId)
  await updateDoc(docRef, {
    attended,
    total,
    updatedAt: serverTimestamp(),
  })
}

export const submitAssignmentDoc = async (assignmentId) => {
  const docRef = doc(db, COLLECTIONS.ASSIGNMENTS, assignmentId)
  await updateDoc(docRef, {
    status: 'Submitted',
    submittedDate: new Date().toISOString().split('T')[0],
    submittedAt: serverTimestamp(),
  })
}

export const createRequestDoc = async (requestData) => {
  const customId = requestData.id || `REQ-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`
  const docRef = doc(db, COLLECTIONS.REQUESTS, customId)
  const fullData = {
    ...requestData,
    id: customId,
    appliedAt: requestData.appliedAt || new Date().toISOString().split('T')[0],
    createdAt: serverTimestamp(),
  }
  await setDoc(docRef, fullData)
  return customId
}

export const createComplaintDoc = async (complaintData) => {
  const customId = complaintData.id || `CMP-${new Date().getFullYear()}-${String(Math.floor(1 + Math.random() * 999)).padStart(3, '0')}`
  const docRef = doc(db, COLLECTIONS.COMPLAINTS, customId)
  const fullData = {
    ...complaintData,
    id: customId,
    submittedAt: complaintData.submittedAt || new Date().toISOString(),
    createdAt: serverTimestamp(),
  }
  await setDoc(docRef, fullData)
  return customId
}

export const createMoodLogDoc = async (moodData) => {
  const customId = moodData.id || `mood-${new Date().toISOString().split('T')[0]}-${Date.now()}`
  const docRef = doc(db, COLLECTIONS.MOOD_LOGS, customId)
  const fullData = {
    ...moodData,
    id: customId,
    date: moodData.date || new Date().toISOString().split('T')[0],
    createdAt: serverTimestamp(),
  }
  await setDoc(docRef, fullData)
  return customId
}

export const updateRequestStatusDoc = async (requestId, status, reviewer, comments) => {
  const docRef = doc(db, COLLECTIONS.REQUESTS, requestId)
  await updateDoc(docRef, {
    status,
    reviewer: reviewer || 'Academic Office',
    comments: comments || '',
    reviewedAt: serverTimestamp(),
  })
}

export const updateComplaintStatusDoc = async (complaintId, status, adminResponse) => {
  const docRef = doc(db, COLLECTIONS.COMPLAINTS, complaintId)
  await updateDoc(docRef, {
    status,
    adminResponse: adminResponse || '',
    updatedAt: serverTimestamp(),
  })
}
