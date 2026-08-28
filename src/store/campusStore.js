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
  isSidebarCollapsed: false,
  isProfileModalOpen: false,
  aiChatMessages: [
    {
      id: 'msg-1',
      sender: 'ai',
      text: '👋 Hello! I am your AI Campus Advisor. How can I help you today? Ask me about your attendance, timetable, assignments, or academic performance!',
      time: 'Just now',
    },
  ],

  // Actions
  toggleSidebarCollapse: () =>
    set((state) => ({ isSidebarCollapsed: !state.isSidebarCollapsed })),

  setProfileModalOpen: (open) =>
    set({ isProfileModalOpen: open }),

  updateStudentProfile: (updates) =>
    set((state) => ({
      studentProfile: { ...state.studentProfile, ...updates },
    })),

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

  markAttendance: (subjectId, type = 'present') => {
    set((state) => {
      const updatedSubjects = state.subjects.map((sub) => {
        if (sub.id === subjectId) {
          const attended = type === 'present' ? sub.attended + 1 : sub.attended
          const total = sub.total + 1
          return { ...sub, attended, total }
        }
        return sub
      })
      const { overallPercent } = calculateOverallAttendance(updatedSubjects)
      return {
        subjects: updatedSubjects,
        studentProfile: {
          ...state.studentProfile,
          overallAttendance: overallPercent,
        },
      }
    })
  },

  submitAssignment: (assignmentId) => {
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
  },

  addComplaint: (complaint) =>
    set((state) => ({
      complaints: [complaint, ...state.complaints],
    })),

  addRequest: (request) =>
    set((state) => ({
      requests: [request, ...state.requests],
    })),

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
          text: 'Chat history cleared. How can I assist you with your campus life?',
          time: 'Just now',
        },
      ],
    }),
}))

export default useCampusStore
