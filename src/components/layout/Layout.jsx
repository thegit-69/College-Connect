import { Outlet, Link } from 'react-router-dom'
import { HiOutlineAcademicCap } from 'react-icons/hi2'
import { IoLogInOutline } from 'react-icons/io5'
import Footer from './Footer'
import useAuthStore from '../../store/authStore'

export default function Layout() {
  const { isAuthenticated, user } = useAuthStore()

  return (
    <div className="min-h-screen flex flex-col bg-[#fafafa] text-gray-900">
      {/* Public Clean Minimal Header */}
      <header className="sticky top-0 z-30 bg-white/85 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 bg-black text-white rounded-lg flex items-center justify-center shadow-xs group-hover:bg-primary-600 transition-colors">
              <HiOutlineAcademicCap className="text-lg" />
            </div>
            <span className="text-sm font-bold text-gray-950 tracking-tight font-display">
              Campus Connect
            </span>
          </Link>

          <nav className="flex items-center gap-4">
            <Link to="/events" className="text-xs font-semibold text-gray-600 hover:text-black transition-colors">
              Events
            </Link>
            <Link to="/my-tickets" className="text-xs font-semibold text-gray-600 hover:text-black transition-colors">
              My Tickets
            </Link>
            {isAuthenticated ? (
              <Link
                to="/dashboard"
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-black text-white text-xs font-semibold rounded-full hover:bg-gray-800 transition-all shadow-xs"
              >
                <span>Dashboard</span>
              </Link>
            ) : (
              <Link
                to="/login"
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-black text-white text-xs font-semibold rounded-full hover:bg-gray-800 transition-all shadow-xs"
              >
                <IoLogInOutline size={15} />
                <span>Sign In</span>
              </Link>
            )}
          </nav>
        </div>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <Footer />
    </div>
  )
}
