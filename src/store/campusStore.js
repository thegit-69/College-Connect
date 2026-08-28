import { create } from 'zustand'
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
} from '../services/campusData'
import { calculateOverallAttendance } from '../services/smartAttendanceService'
import {
  seedCampusDatabaseToFirestore,
  subscribeToCampusCollections,
  saveStudentProfileDoc,
  updateSubjectAttendanceDoc,
  submitAssignmentDoc,
  createRequestDoc,
  createComplaintDoc,
  createMoodLogDoc,
  INITIAL_MOOD_LOGS,
} from '../services/firestoreCampusService'

const useCampusStore = create((set, get) => ({
  studentProfile: INITIAL_STUDENT_PROFILE,
  subjects: INITIAL_SUBJECTS,
  timetable: INITIAL_TIMETABLE,
  assignments: INITIAL_ASSIGNMENTS,
  announcements: INITIAL_ANNOUNCEMENTS,
  complaints: INITIAL_COMPLAINTS,
  requests: INITIAL_REQUESTS,
  certificates: INITIAL_CERTIFICATES,
  recommendations: INITIAL_AI_RECOMMENDATIONS,
  moodLogs: INITIAL_MOOD_LOGS,
  isSidebarCollapsed: false,
  isProfileModalOpen: false,
  isMoodModalOpen: false,
  isFirestoreReady: false,
  isSeeding: false,
  aiChatMessages: [
    {
      id: 'msg-1',
      sender: 'ai',
      text: '👋 Hello! I am your AI Campus Advisor & Wellbeing Companion powered by Groq LLaMA 3.3. How are you feeling today? Ask me anything about your attendance, subjects, exam stress, or timetable!',
      time: 'Just now',
    },
  ],

  // Initialize Firestore listeners & auto-seed if empty
  initFirestore: async () => {
    try {
      set({ isSeeding: true })
      // 1. Seed database with real documents if empty
      await seedCampusDatabaseToFirestore(false)
      set({ isSeeding: false, isFirestoreReady: true })

      // 2. Set up realtime listeners
      const unsubscribe = subscribeToCampusCollections({
        onStudentUpdate: (data) => {
          set((state) => ({
            studentProfile: { ...state.studentProfile, ...data },
          }))
        },
        onSubjectsUpdate: (list) => {
          const { overallPercent } = calculateOverallAttendance(list)
          set((state) => ({
            subjects: list,
            studentProfile: {
              ...state.studentProfile,
              overallAttendance: overallPercent,
            },
          }))
        },
        onTimetableUpdate: (map) => {
          set({ timetable: map })
        },
        onAssignmentsUpdate: (list) => {
          set({ assignments: list })
        },
        onAnnouncementsUpdate: (list) => {
          set({ announcements: list })
        },
        onComplaintsUpdate: (list) => {
          set({ complaints: list })
        },
        onRequestsUpdate: (list) => {
          set({ requests: list })
        },
        onCertificatesUpdate: (list) => {
          set({ certificates: list })
        },
        onRecommendationsUpdate: (list) => {
          set({ recommendations: list })
        },
        onMoodUpdate: (list) => {
          // Sort mood logs newest first
          const sorted = [...list].sort((a, b) => new Date(b.date || b.createdAt) - new Date(a.date || a.createdAt))
          set({ moodLogs: sorted })
        },
      })

      return unsubscribe
    } catch (error) {
      console.error('Firestore init error in campusStore:', error)
      set({ isSeeding: false })
    }
  },

  // Actions
  toggleSidebarCollapse: () =>
    set((state) => ({ isSidebarCollapsed: !state.isSidebarCollapsed })),

  setProfileModalOpen: (open) =>
    set({ isProfileModalOpen: open }),

  setMoodModalOpen: (open) =>
    set({ isMoodModalOpen: open }),

  addMoodLog: async (moodData) => {
    set((state) => ({
      moodLogs: [moodData, ...state.moodLogs],
    }))

    try {
      await createMoodLogDoc(moodData)
    } catch (err) {
      console.warn('Failed to persist mood log to Firestore:', err)
    }
  },

  updateStudentProfile: async (updates) => {
    const updated = { ...get().studentProfile, ...updates }
    set({ studentProfile: updated })
    try {
      await saveStudentProfileDoc(updated)
    } catch (err) {
      console.warn('Failed to persist student profile update:', err)
    }
  },

  setSubjects: (subjects) => {
    const { overallPercent } = calculateOverallAttendance(subjects)
    set((state) => ({
      subjects,
      studentProfile: {
        ...state.studentProfile,
        overallAttendance: overallPercent,
      },
    }))
  },

  markAttendance: async (subjectId, type = 'present') => {
    let updatedSub = null
    const updatedSubjects = get().subjects.map((sub) => {
      if (sub.id === subjectId) {
        const attended = type === 'present' ? sub.attended + 1 : sub.attended
        const total = sub.total + 1
        updatedSub = { ...sub, attended, total }
        return updatedSub
      }
      return sub
    })

    const { overallPercent } = calculateOverallAttendance(updatedSubjects)
    set((state) => ({
      subjects: updatedSubjects,
      studentProfile: {
        ...state.studentProfile,
        overallAttendance: overallPercent,
      },
    }))

    if (updatedSub) {
      try {
        await updateSubjectAttendanceDoc(subjectId, updatedSub.attended, updatedSub.total)
      } catch (err) {
        console.warn('Failed to persist attendance update to Firestore:', err)
      }
    }
  },

  submitAssignment: async (assignmentId) => {
    set((state) => ({
      assignments: state.assignments.map((asg) =>
        asg.id === assignmentId
          ? {
              ...asg,
              status: 'Submitted',
              submittedDate: new Date().toISOString().split('T')[0],
            }
          : asg
      ),
    }))

    try {
      await submitAssignmentDoc(assignmentId)
    } catch (err) {
      console.warn('Failed to persist assignment submission to Firestore:', err)
    }
  },

  addComplaint: async (complaint) => {
    set((state) => ({
      complaints: [complaint, ...state.complaints],
    }))

    try {
      await createComplaintDoc(complaint)
    } catch (err) {
      console.warn('Failed to persist complaint to Firestore:', err)
    }
  },

  addRequest: async (request) => {
    set((state) => ({
      requests: [request, ...state.requests],
    }))

    try {
      await createRequestDoc(request)
    } catch (err) {
      console.warn('Failed to persist request to Firestore:', err)
    }
  },

  addAiMessage: (msg) =>
    set((state) => ({
      aiChatMessages: [...state.aiChatMessages, msg],
    })),

  clearAiChat: () =>
    set({
      aiChatMessages: [
        {
          id: 'msg-init',
          sender: 'ai',
          text: 'Chat history cleared. How can I assist you with your campus life and wellbeing today?',
          time: 'Just now',
        },
      ],
    }),
}))

export default useCampusStore
