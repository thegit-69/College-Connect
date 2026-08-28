import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { HiOutlineAcademicCap } from 'react-icons/hi2'
import {
  IoShieldCheckmarkOutline,
  IoArrowBackOutline,
} from 'react-icons/io5'
import toast from 'react-hot-toast'
import useAuthStore from '../store/authStore'
import useCampusStore from '../store/campusStore'
import { signInWithGoogle, getUserRole } from '../services/authService'
import heroBg from '../assets/hero-mountains.jpg'

export default function LoginPage() {
  const navigate = useNavigate()
  const { setUser } = useAuthStore()
  const { studentProfile, updateStudentProfile } = useCampusStore()
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
        toast.success(`Welcome back, ${firebaseUser.displayName || 'Student'}!`)
        navigate('/dashboard')
      }
    } catch (err) {
      console.error('Google Sign-In Failed:', err)
      if (err.code === 'auth/popup-closed-by-user') {
        toast.error('Sign-in cancelled.')
      } else {
        toast.error(err.message || 'Authentication failed. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-gray-950 font-sans p-4 sm:p-6">
      {/* Immersive Studio Ghibli Nature Backdrop */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-1000 scale-105 filter brightness-[0.85] contrast-[1.05]"
        style={{ backgroundImage: `url(${heroBg})` }}
      />

      {/* Atmospheric Scrim */}
      <div className="absolute inset-0 bg-gradient-to-t from-gray-950/85 via-gray-900/40 to-black/50 backdrop-blur-[2px]" />

      {/* Top Floating Back Link */}
      <div className="absolute top-5 left-5 sm:top-8 sm:left-8 z-20">
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 hover:bg-white text-gray-900 text-xs font-semibold backdrop-blur-md border border-white/60 shadow-lg transition-all hover:scale-[1.02] active:scale-95"
        >
          <IoArrowBackOutline size={16} />
          <span>Back to Home</span>
        </Link>
      </div>

      {/* Central Glassmorphic Card */}
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="relative z-10 w-full max-w-md mx-auto bg-white/90 dark:bg-gray-950/85 backdrop-blur-xl rounded-3xl border border-white/60 dark:border-gray-800 shadow-2xl shadow-black/40 p-7 sm:p-9 text-gray-900 dark:text-white"
      >
        {/* Brand Header */}
        <div className="text-center space-y-2 mb-7">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-black text-white shadow-xl mb-1 ring-4 ring-white/50 dark:ring-gray-800">
            <HiOutlineAcademicCap className="text-3xl" />
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold font-display tracking-tight text-gray-950 dark:text-white">
            Campus Connect
          </h1>
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 max-w-xs mx-auto">
            Sign in with your Google account to access your academics, timetable, attendance, and AI advisor.
          </p>
        </div>

        {/* ONLY GOOGLE SIGN-IN */}
        <div className="space-y-4">
          <motion.button
            whileHover={{ scale: 1.015 }}
            whileTap={{ scale: 0.985 }}
            disabled={loading}
            onClick={handleGoogleSignIn}
            className="w-full flex items-center justify-center gap-3.5 py-3.5 px-4 bg-white hover:bg-gray-50 text-gray-900 font-bold text-sm rounded-2xl border-2 border-gray-200 dark:border-gray-700 shadow-md hover:shadow-lg transition-all focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white disabled:opacity-60"
          >
            {/* Google SVG Icon */}
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.66v3.05h3.87c2.26-2.09 3.67-5.17 3.67-9.15z"
              />
              <path
                fill="#34A853"
                d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.87-3.05c-1.08.72-2.45 1.16-4.06 1.16-3.13 0-5.78-2.11-6.73-4.96H1.26v3.15C3.27 21.36 7.34 24 12 24z"
              />
              <path
                fill="#FBBC05"
                d="M5.27 14.24c-.25-.72-.38-1.49-.38-2.24s.13-1.52.38-2.24V6.61H1.26C.46 8.23 0 10.06 0 12s.46 3.77 1.26 5.39l4.01-3.15z"
              />
              <path
                fill="#EA4335"
                d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.27 2.64 1.26 6.61l4.01 3.15c.95-2.85 3.6-4.96 6.73-4.96z"
              />
            </svg>

            <span>
              {loading ? 'Authenticating with Google...' : 'Continue with Google'}
            </span>
          </motion.button>
        </div>

        {/* Footer Note */}
        <div className="mt-8 text-center pt-4 border-t border-gray-200 dark:border-gray-800">
          <p className="text-[11px] text-gray-500 dark:text-gray-400 flex items-center justify-center gap-1.5">
            <IoShieldCheckmarkOutline className="text-emerald-500 text-sm" />
            <span>Secure authentication powered by Firebase Auth</span>
          </p>
        </div>
      </motion.div>
    </div>
  )
}
