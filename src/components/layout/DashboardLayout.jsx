import { useState } from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import Sidebar from './Sidebar'
import Navbar from './Navbar'
import useAuthStore from '../../store/authStore'

export default function DashboardLayout() {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)
  const location = useLocation()
  const { isSuperAdmin } = useAuthStore()

  if (location.pathname.startsWith('/dashboard/admin') && !isSuperAdmin) {
    return <Navigate to="/dashboard" replace />
  }

  return (
    <div className="min-h-screen bg-[#fafafa] flex flex-col antialiased text-gray-900">
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
    </div>
  )
}
