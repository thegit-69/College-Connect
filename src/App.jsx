import { useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import Layout from './components/layout/Layout'
import DashboardLayout from './components/layout/DashboardLayout'
import ProtectedRoute from './components/auth/ProtectedRoute'

// Public pages
import Home from './pages/Home'
import Events from './pages/Events'
import EventDetail from './pages/EventDetail'
import MyTickets from './pages/MyTickets'
import LoginPage from './pages/LoginPage'
import NotFound from './pages/NotFound'

// Dashboard pages (original)
import Dashboard from './pages/Dashboard'
import ManageEvents from './pages/ManageEvents'
import CreateEvent from './pages/CreateEvent'
import Notifications from './pages/Notifications'
import AdminReview from './pages/AdminReview'
import EventAttendance from './pages/Attendance'

// Campus Connect feature pages
import AcademicsPage from './pages/AcademicsPage'
import AttendancePage from './pages/AttendancePage'
import AIAssistantPage from './pages/AIAssistantPage'
import RecommendationsPage from './pages/RecommendationsPage'
import RequestsPage from './pages/RequestsPage'
import ComplaintsPage from './pages/ComplaintsPage'
import CertificatesPage from './pages/CertificatesPage'
import WellnessPage from './pages/WellnessPage'

import useAuthStore from './store/authStore'
import useEventStore from './store/eventStore'
import useCampusStore from './store/campusStore'
import { getUserRole, onAuthChange } from './services/authService'
import { fetchApprovedEvents } from './services/eventService'

function App() {
  const { setUser, setLoading } = useAuthStore()
  const { setEvents } = useEventStore()
  const { initFirestore } = useCampusStore()

  // Initialize Firestore collections & realtime listeners
  useEffect(() => {
    let unsubscribeFirestore = null
    const startSync = async () => {
      unsubscribeFirestore = await initFirestore()
    }
    startSync()

    return () => {
      if (typeof unsubscribeFirestore === 'function') {
        unsubscribeFirestore()
      }
    }
  }, [initFirestore])

  // Listen for Firebase auth state changes
  useEffect(() => {
    const unsubscribe = onAuthChange((firebaseUser) => {
      if (firebaseUser) {
        setUser({
          uid: firebaseUser.uid,
          displayName: firebaseUser.displayName,
          email: firebaseUser.email,
          photoURL: firebaseUser.photoURL,
          role: getUserRole(firebaseUser.email),
        })
      } else {
        setUser(null)
      }
    })
    return () => unsubscribe()
  }, [setUser, setLoading])

  // Load events from Firestore on mount
  useEffect(() => {
    const loadEvents = async () => {
      try {
        const events = await fetchApprovedEvents()
        setEvents(events)
      } catch (error) {
        console.warn('Approved events fetch failed:', error.message)
        setEvents([])
      }
    }
    loadEvents()
  }, [setEvents])

  return (
    <BrowserRouter>
      <Toaster position="top-right" />
      <Routes>
        {/* 1. Standalone Single-Screen Aesthetic Landing Page */}
        <Route path="/" element={<Home />} />

        {/* 2. Standalone Login Page */}
        <Route path="/login" element={<LoginPage />} />

        {/* 3. Public Event browsing routes with minimal header/footer */}
        <Route element={<Layout />}>
          <Route path="/events" element={<Events />} />
          <Route path="/events/:id" element={<EventDetail />} />
          <Route path="/my-tickets" element={<MyTickets />} />
          <Route path="*" element={<NotFound />} />
        </Route>

        {/* 4. Protected Dashboard routes - accessible ONLY after login */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<Dashboard />} />

            {/* Events Hub (clg_events integration) */}
            <Route path="events" element={<ManageEvents />} />
            <Route path="create" element={<CreateEvent />} />
            <Route path="events/:id/attendance" element={<EventAttendance />} />
            <Route path="notifications" element={<Notifications />} />
            <Route path="admin/review" element={<AdminReview />} />

            {/* Academics & Campus */}
            <Route path="academics" element={<AcademicsPage />} />
            <Route path="attendance" element={<AttendancePage />} />

            {/* AI Intelligence & Mental Wellness */}
            <Route path="ai-assistant" element={<AIAssistantPage />} />
            <Route path="wellness" element={<WellnessPage />} />
            <Route path="recommendations" element={<RecommendationsPage />} />

            {/* Student Services */}
            <Route path="requests" element={<RequestsPage />} />
            <Route path="complaints" element={<ComplaintsPage />} />
            <Route path="certificates" element={<CertificatesPage />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
