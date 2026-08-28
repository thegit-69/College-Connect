import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import {
  HiOutlineAcademicCap,
  HiOutlineSparkles,
  HiOutlineArrowRight,
} from 'react-icons/hi2'
import {
  IoCloseOutline,
  IoShieldCheckmarkOutline,
  IoStatsChartOutline,
  IoRibbonOutline,
  IoDocumentTextOutline,
  IoCalendarOutline,
} from 'react-icons/io5'
import useAuthStore from '../store/authStore'
import useCampusStore from '../store/campusStore'
import { signInWithGoogle, getUserRole } from '../services/authService'
import toast from 'react-hot-toast'
import heroBg from '../assets/hero-mountains.jpg'

export default function Home() {
  const navigate = useNavigate()
  const { isAuthenticated, setUser } = useAuthStore()
  const { studentProfile, updateStudentProfile } = useCampusStore()
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleGoogleSignIn = async () => {
    setLoading(true)
    try {
      const firebaseUser = await signInWithGoogle()
      if (firebaseUser) {
        const userObj = {
          uid: firebaseUser.uid,
          displayName: firebaseUser.displayName || 'Alex Johnson',
          email: firebaseUser.email,
          photoURL: firebaseUser.photoURL,
          role: getUserRole(firebaseUser.email),
        }
        setUser(userObj)
        updateStudentProfile({
          name: firebaseUser.displayName || studentProfile.name,
          email: firebaseUser.email || studentProfile.email,
        })
        toast.success(`Welcome to Campus Connect, ${firebaseUser.displayName || 'Student'}!`)
        setIsLoginModalOpen(false)
        navigate('/dashboard')
      }
    } catch (err) {
      console.error('Google Sign-In Error:', err)
      if (err.code === 'auth/popup-closed-by-user') {
        toast.error('Sign-in cancelled.')
      } else {
        toast.error(err.message || 'Authentication failed. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  const highlights = [
    { label: 'Smart Attendance Roll-Call', icon: <IoStatsChartOutline className="text-emerald-400" /> },
    { label: 'AI Campus Advisor', icon: <HiOutlineSparkles className="text-amber-400" /> },
    { label: 'Academics & Timetable', icon: <IoCalendarOutline className="text-blue-400" /> },
    { label: 'Verified Certificate Vault', icon: <IoRibbonOutline className="text-purple-400" /> },
    { label: 'Paperless OD & E-Governance', icon: <IoDocumentTextOutline className="text-rose-400" /> },
  ]

  return (
    <div className="relative h-screen w-screen overflow-hidden flex flex-col justify-between bg-gray-950 font-sans select-none">
      {/* 1. Fullscreen Breathtaking Mountain Meadow Backdrop */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-1000 scale-100 filter brightness-[0.88] contrast-[1.04]"
        style={{ backgroundImage: `url(${heroBg})` }}
      />

      {/* Atmospheric Soft Dark Scrim */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-950/70 via-black/35 to-gray-950/85 backdrop-blur-[0.5px]" />

      {/* 2. Minimal Floating Header */}
      <header className="relative z-20 w-full max-w-7xl mx-auto px-6 sm:px-10 py-6 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-white/90 text-gray-950 flex items-center justify-center shadow-lg backdrop-blur-md">
            <HiOutlineAcademicCap className="text-2xl" />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-black tracking-tight text-white font-display leading-tight">
              Campus Connect
            </span>
            <span className="text-[10px] text-gray-300 font-medium tracking-wide">
              Digital Campus Operating System
            </span>
          </div>
        </div>

        {/* Action Button */}
        <div>
          {isAuthenticated ? (
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-gray-950 hover:bg-gray-100 font-extrabold text-xs rounded-full shadow-lg transition-all hover:scale-[1.03] active:scale-95 font-display"
            >
              <span>Dashboard</span>
              <HiOutlineArrowRight size={14} />
            </Link>
          ) : (
            <button
              onClick={() => setIsLoginModalOpen(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/90 hover:bg-white text-gray-950 font-bold text-xs rounded-full shadow-lg backdrop-blur-md border border-white/60 transition-all hover:scale-[1.03] active:scale-95"
            >
              {/* Google Mini Icon */}
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.66v3.05h3.87c2.26-2.09 3.67-5.17 3.67-9.15z" />
                <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.87-3.05c-1.08.72-2.45 1.16-4.06 1.16-3.13 0-5.78-2.11-6.73-4.96H1.26v3.15C3.27 21.36 7.34 24 12 24z" />
                <path fill="#FBBC05" d="M5.27 14.24c-.25-.72-.38-1.49-.38-2.24s.13-1.52.38-2.24V6.61H1.26C.46 8.23 0 10.06 0 12s.46 3.77 1.26 5.39l4.01-3.15z" />
                <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.27 2.64 1.26 6.61l4.01 3.15c.95-2.85 3.6-4.96 6.73-4.96z" />
              </svg>
              <span>Sign In with Google</span>
            </button>
          )}
        </div>
      </header>

      {/* 3. Central Hero Section (Single Viewport) */}
      <main className="relative z-10 w-full max-w-5xl mx-auto px-6 sm:px-8 text-center text-white my-auto">
        {/* Pill Tag */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/15 backdrop-blur-md border border-white/25 text-xs font-semibold tracking-wide mb-6 shadow-md"
        >
          <HiOutlineSparkles className="text-amber-300" />
          <span>Unified Academic & Student Life Ecosystem</span>
        </motion.div>

        {/* Big Aesthetic Typography Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl sm:text-6xl md:text-7xl font-black font-display tracking-tight leading-[1.08] drop-shadow-lg max-w-4xl mx-auto"
        >
          Where Campus Life Meets <br />
          <span className="bg-gradient-to-r from-emerald-200 via-teal-100 to-amber-200 bg-clip-text text-transparent">
            Simplicity & Intelligence.
          </span>
        </motion.h1>

        {/* Concise Project Description */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-6 text-sm sm:text-base md:text-lg text-gray-100/90 max-w-2xl mx-auto font-normal leading-relaxed drop-shadow"
        >
          Campus Connect brings real-time academic scheduling, faculty roll-call attendance, 24/7 AI advisory, verified digital credentials, and campus events into one single, effortless interface.
        </motion.p>

        {/* Primary CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-8 flex items-center justify-center gap-4"
        >
          {isAuthenticated ? (
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-2.5 px-8 py-4 bg-white text-gray-950 hover:bg-gray-100 font-black text-sm rounded-2xl shadow-2xl transition-all hover:scale-[1.03] active:scale-95 font-display"
            >
              <span>Enter Student Dashboard</span>
              <HiOutlineArrowRight size={18} />
            </Link>
          ) : (
            <button
              onClick={() => setIsLoginModalOpen(true)}
              className="inline-flex items-center gap-3 px-8 py-4 bg-white text-gray-950 hover:bg-gray-50 font-black text-sm rounded-2xl shadow-2xl transition-all hover:scale-[1.03] active:scale-95 font-display"
            >
              {/* Google Colored Icon */}
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.66v3.05h3.87c2.26-2.09 3.67-5.17 3.67-9.15z" />
                <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.87-3.05c-1.08.72-2.45 1.16-4.06 1.16-3.13 0-5.78-2.11-6.73-4.96H1.26v3.15C3.27 21.36 7.34 24 12 24z" />
                <path fill="#FBBC05" d="M5.27 14.24c-.25-.72-.38-1.49-.38-2.24s.13-1.52.38-2.24V6.61H1.26C.46 8.23 0 10.06 0 12s.46 3.77 1.26 5.39l4.01-3.15z" />
                <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.27 2.64 1.26 6.61l4.01 3.15c.95-2.85 3.6-4.96 6.73-4.96z" />
              </svg>
              <span>Continue with Google</span>
            </button>
          )}
        </motion.div>

        {/* Feature Pills Strip */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-2.5 sm:gap-3"
        >
          {highlights.map((h, i) => (
            <div
              key={i}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 hover:bg-white/15 backdrop-blur-md border border-white/15 text-xs text-white/90 font-medium transition-all shadow-xs"
            >
              <span className="text-sm">{h.icon}</span>
              <span>{h.label}</span>
            </div>
          ))}
        </motion.div>
      </main>

      {/* 4. Minimal Footer Strip */}
      <footer className="relative z-20 w-full max-w-7xl mx-auto px-6 sm:px-10 py-5 flex items-center justify-between text-[11px] text-gray-300">
        <p>© 2026 Campus Connect • Intelligent Digital Platform</p>
        <p className="flex items-center gap-1.5">
          <IoShieldCheckmarkOutline className="text-emerald-400" />
          <span>Real-time Cloud Firestore & Firebase Auth</span>
        </p>
      </footer>

      {/* 5. Clean Login Modal — ONLY GOOGLE OPTION */}
      <AnimatePresence>
        {isLoginModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !loading && setIsLoginModalOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            />

            {/* Modal Surface */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 16 }}
              className="relative w-full max-w-md bg-white/95 dark:bg-gray-950/95 backdrop-blur-2xl rounded-3xl border border-white/60 dark:border-gray-800 shadow-2xl p-7 sm:p-9 z-10 text-gray-900 dark:text-white"
            >
              {/* Close Button */}
              <button
                onClick={() => !loading && setIsLoginModalOpen(false)}
                className="absolute top-5 right-5 p-1.5 rounded-full text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <IoCloseOutline size={20} />
              </button>

              {/* Modal Header */}
              <div className="text-center space-y-2 mb-7">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-black text-white shadow-xl mb-1 ring-4 ring-white/50 dark:ring-gray-800">
                  <HiOutlineAcademicCap className="text-3xl" />
                </div>
                <h3 className="text-2xl font-extrabold font-display tracking-tight text-gray-950 dark:text-white">
                  Sign In to Campus Connect
                </h3>
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 max-w-xs mx-auto">
                  Access your academics, attendance roll-call, and AI advisor with your Google account.
                </p>
              </div>

              {/* ONLY GOOGLE OPTION */}
              <div className="space-y-4">
                <button
                  type="button"
                  disabled={loading}
                  onClick={handleGoogleSignIn}
                  className="w-full flex items-center justify-center gap-3.5 py-3.5 px-4 bg-white hover:bg-gray-50 text-gray-900 font-bold text-sm rounded-2xl border-2 border-gray-200 dark:border-gray-700 shadow-md hover:shadow-lg transition-all focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white disabled:opacity-60 font-display"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.66v3.05h3.87c2.26-2.09 3.67-5.17 3.67-9.15z" />
                    <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.87-3.05c-1.08.72-2.45 1.16-4.06 1.16-3.13 0-5.78-2.11-6.73-4.96H1.26v3.15C3.27 21.36 7.34 24 12 24z" />
                    <path fill="#FBBC05" d="M5.27 14.24c-.25-.72-.38-1.49-.38-2.24s.13-1.52.38-2.24V6.61H1.26C.46 8.23 0 10.06 0 12s.46 3.77 1.26 5.39l4.01-3.15z" />
                    <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.27 2.64 1.26 6.61l4.01 3.15c.95-2.85 3.6-4.96 6.73-4.96z" />
                  </svg>
                  <span>{loading ? 'Connecting with Google...' : 'Continue with Google'}</span>
                </button>
              </div>

              {/* Security Badge */}
              <div className="mt-7 pt-4 border-t border-gray-100 dark:border-gray-800 text-center">
                <p className="text-[11px] text-gray-500 dark:text-gray-400 flex items-center justify-center gap-1.5">
                  <IoShieldCheckmarkOutline className="text-emerald-500" />
                  <span>Secure Firebase Authentication</span>
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
