import { useState, useEffect } from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import Sidebar from './Sidebar'
import Navbar from './Navbar'
import useAuthStore from '../../store/authStore'
import useCampusStore from '../../store/campusStore'
import MoodCheckInModal from '../wellness/MoodCheckInModal'

export default function DashboardLayout() {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)
  const location = useLocation()
  const { user, isSuperAdmin } = useAuthStore()
  const { isMoodModalOpen, setMoodModalOpen } = useCampusStore()

  // Prompt mood check-in if not checked in today on login
  useEffect(() => {
    if (user?.uid) {
      const todayStr = new Date().toISOString().split('T')[0]
      const lastChecked = localStorage.getItem(`campus_mood_checked_${user.uid}`)
      if (lastChecked !== todayStr) {
        const timer = setTimeout(() => {
          setMoodModalOpen(true)
        }, 1200)
        return () => clearTimeout(timer)
      }
    }
  }, [user?.uid, setMoodModalOpen])

  if (location.pathname.startsWith('/dashboard/admin') && !isSuperAdmin) {
    return <Navigate to="/dashboard" replace />
  }

  return (
    <div className="min-h-screen bg-[#fafafa] flex flex-col antialiased text-gray-900 font-sans">
      {/* Top Navbar */}
      <Navbar onToggleSidebar={() => setMobileSidebarOpen((prev) => !prev)} />

      {/* Main Workspace with Collapsible Sidebar */}
      <div className="flex-1 flex overflow-hidden">
        <Sidebar
          isOpen={mobileSidebarOpen}
          onClose={() => setMobileSidebarOpen(false)}
        />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-white/70">
          <Outlet />
        </main>
      </div>

      {/* Daily Student Mood Check-In Modal */}
      <MoodCheckInModal
        isOpen={isMoodModalOpen}
        onClose={() => setMoodModalOpen(false)}
      />
    </div>
  )
}
