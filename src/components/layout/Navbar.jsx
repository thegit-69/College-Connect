import { Link } from 'react-router-dom'
import {
  IoMenuOutline,
  IoNotificationsOutline,
  IoSparkles,
  IoLogInOutline
} from 'react-icons/io5'
import { HiOutlineAcademicCap } from 'react-icons/hi2'
import useAuthStore from '../../store/authStore'
import useCampusStore from '../../store/campusStore'
import ProfileModal from '../profile/ProfileModal'

export default function Navbar({ onToggleSidebar }) {
  const { user, isAuthenticated } = useAuthStore()
  const { studentProfile, isProfileModalOpen, setProfileModalOpen } = useCampusStore()

  return (
    <>
      <header className="sticky top-0 z-30 bg-white/85 backdrop-blur-md border-b border-gray-200 transition-colors">
        <div className="px-4 sm:px-6">
          <div className="flex items-center justify-between h-14">
            {/* LHS: Sidebar Toggle & Campus Connect Minimal Branding */}
            <div className="flex items-center gap-3">
              <button
                onClick={onToggleSidebar}
                className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-900 transition-colors focus:outline-none focus:ring-1 focus:ring-black"
                aria-label="Toggle Sidebar"
              >
                <IoMenuOutline size={22} />
              </button>

              {/* Brand Logo & Name */}
              <Link to="/dashboard" className="flex items-center gap-2.5 group">
                <div className="w-8 h-8 bg-black text-white rounded-lg flex items-center justify-center shadow-xs group-hover:bg-primary-600 transition-colors">
                  <HiOutlineAcademicCap className="text-lg" />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-gray-950 tracking-tight">
                    Campus Connect
                  </span>
                  <span className="hidden sm:inline-block text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 bg-gray-100 text-gray-700 border border-gray-200 rounded-md">
                    Portal
                  </span>
                </div>
              </Link>
            </div>

            {/* RHS: Minimal Vercel-style Actions & Profile */}
            <div className="flex items-center gap-2">
              {/* Quick AI Assistant Shortcut */}
              <Link
                to="/dashboard/ai-assistant"
                className="flex items-center gap-1.5 px-3 py-1 bg-black text-white hover:bg-gray-800 rounded-full text-xs font-semibold transition-all shadow-xs group"
              >
                <IoSparkles className="text-amber-300 group-hover:rotate-12 transition-transform text-xs" />
                <span>Ask AI</span>
              </Link>

              {/* Notifications */}
              <Link
                to="/dashboard/notifications"
                className="relative p-1.5 rounded-lg text-gray-600 hover:bg-gray-100 hover:text-black transition-colors"
                aria-label="Notifications"
              >
                <IoNotificationsOutline size={19} />
                <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-primary-600 rounded-full" />
              </Link>

              {/* Sign In Button OR Profile Trigger */}
              {isAuthenticated ? (
                <button
                  onClick={() => setProfileModalOpen(true)}
                  className="flex items-center gap-2 pl-1.5 pr-2.5 py-1 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-full transition-all text-left"
                  aria-label="Open Profile Modal"
                >
                  <div className="w-6 h-6 rounded-full bg-black text-white flex items-center justify-center text-[10px] font-bold shadow-xs overflow-hidden">
                    {user?.photoURL ? (
                      <img src={user.photoURL} alt="Avatar" className="w-full h-full object-cover" />
                    ) : (
                      <span>{studentProfile.name.split(' ').map((n) => n[0]).join('')}</span>
                    )}
                  </div>

                  <div className="hidden sm:flex flex-col">
                    <span className="text-xs font-bold text-gray-900 leading-none">
                      {user?.displayName || studentProfile.name.split(' ')[0]}
                    </span>
                  </div>
                </button>
              ) : (
                <Link
                  to="/login"
                  className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-900 border border-gray-200 rounded-full text-xs font-semibold transition-colors"
                >
                  <IoLogInOutline size={15} />
                  <span>Sign In</span>
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Profile ID Modal */}
      <ProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setProfileModalOpen(false)}
      />
    </>
  )
}
