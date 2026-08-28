import { motion, AnimatePresence } from 'framer-motion'
import {
  IoCloseOutline,
  IoSchoolOutline,
  IoLogOutOutline,
  IoMailOutline,
  IoShieldCheckmarkOutline
} from 'react-icons/io5'
import useAuthStore from '../../store/authStore'
import useCampusStore from '../../store/campusStore'
import Button from '../ui/Button'
import { signInWithGoogle } from '../../services/authService'
import toast from 'react-hot-toast'

export default function ProfileModal({ isOpen, onClose }) {
  const { user, isAuthenticated, isSuperAdmin, setUser, logout } = useAuthStore()
  const { studentProfile, riskEvaluation } = useCampusStore()

  if (!isOpen) return null

  const handleGoogleLogin = async () => {
    try {
      const firebaseUser = await signInWithGoogle()
      if (firebaseUser) {
        setUser({
          uid: firebaseUser.uid,
          displayName: firebaseUser.displayName,
          email: firebaseUser.email,
          photoURL: firebaseUser.photoURL,
          role: firebaseUser.email?.toLowerCase() === import.meta.env.VITE_SUPER_ADMIN_EMAIL?.toLowerCase() ? 'super-admin' : 'student',
        })
        toast.success(`Signed in as ${firebaseUser.displayName || firebaseUser.email}`)
      }
    } catch (err) {
      toast.error('Sign-in failed: ' + (err.message || 'Unknown error'))
    }
  }

  const handleLogout = async () => {
    await logout()
    toast.success('Logged out successfully')
    onClose()
  }

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/40 backdrop-blur-xs"
        />

        {/* Modal Surface (Vercel Light) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 12 }}
          className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden z-10 text-gray-900"
        >
          {/* Header Banner */}
          <div className="relative h-24 bg-gradient-to-r from-gray-950 via-gray-900 to-black p-5 flex justify-between items-start text-white">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                Campus Connect ID Card
              </span>
              <h2 className="text-base font-bold text-white">Student & User Profile</h2>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-colors"
            >
              <IoCloseOutline size={18} />
            </button>
          </div>

          {/* Profile Card Body */}
          <div className="px-6 pb-6 pt-0">
            {/* Avatar & Title */}
            <div className="flex items-end justify-between -mt-10 mb-3">
              <div className="relative">
                <div className="w-20 h-20 rounded-2xl border-4 border-white bg-black text-white flex items-center justify-center text-2xl font-black shadow-md overflow-hidden">
                  {user?.photoURL ? (
                    <img src={user.photoURL} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <span>{studentProfile.name.split(' ').map((n) => n[0]).join('')}</span>
                  )}
                </div>
                <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center text-white text-[10px]">
                  ✓
                </div>
              </div>

              <div className="flex flex-col items-end gap-1">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-gray-100 text-gray-800 border border-gray-200 uppercase tracking-wider">
                  {isSuperAdmin ? 'Super Admin' : 'Student (Verified)'}
                </span>
                <span className="text-xs text-gray-500 font-mono">
                  {studentProfile.rollNo}
                </span>
              </div>
            </div>

            {/* Student Info */}
            <div className="space-y-0.5">
              <h3 className="text-lg font-bold text-gray-950 tracking-tight">
                {user?.displayName || studentProfile.name}
              </h3>
              <p className="text-xs text-gray-500 flex items-center gap-1">
                <IoMailOutline className="text-gray-400" />
                {user?.email || studentProfile.email}
              </p>
              <p className="text-xs text-gray-600 font-medium pt-1">
                {studentProfile.department} • Sem {studentProfile.semester} (Sec {studentProfile.section})
              </p>
            </div>

            {/* Academic KPIs Grid (Vercel minimalist cards) */}
            <div className="grid grid-cols-3 gap-2.5 my-4">
              <div className="p-2.5 bg-gray-50/80 rounded-xl text-center border border-gray-200/80">
                <span className="text-[10px] text-gray-400 font-medium block uppercase tracking-wider">CGPA</span>
                <span className="text-base font-extrabold text-gray-950">
                  {studentProfile.cgpa}
                </span>
              </div>

              <div className="p-2.5 bg-gray-50/80 rounded-xl text-center border border-gray-200/80">
                <span className="text-[10px] text-gray-400 font-medium block uppercase tracking-wider">Attendance</span>
                <span className="text-base font-extrabold text-emerald-600">
                  {studentProfile.overallAttendance}%
                </span>
              </div>

              <div className="p-2.5 bg-gray-50/80 rounded-xl text-center border border-gray-200/80">
                <span className="text-[10px] text-gray-400 font-medium block uppercase tracking-wider">Risk Level</span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 inline-block mt-0.5">
                  {riskEvaluation.tier}
                </span>
              </div>
            </div>

            {/* Academic Advisor Info */}
            <div className="p-3 bg-gray-50/90 border border-gray-200 rounded-xl text-xs space-y-0.5 mb-4">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-gray-900 flex items-center gap-1.5">
                  <IoSchoolOutline className="text-gray-500 text-sm" />
                  Faculty Mentor
                </span>
                <span className="text-gray-500 font-mono text-[11px]">{studentProfile.mentor.cabin}</span>
              </div>
              <p className="text-gray-700 font-medium">
                {studentProfile.mentor.name} ({studentProfile.mentor.designation})
              </p>
            </div>

            {/* Footer Buttons */}
            <div className="flex items-center justify-between pt-3 border-t border-gray-200">
              {isAuthenticated ? (
                <button
                  onClick={handleLogout}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 rounded-lg transition-colors"
                >
                  <IoLogOutOutline size={15} />
                  Sign Out
                </button>
              ) : (
                <button
                  onClick={handleGoogleLogin}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-black hover:bg-gray-800 rounded-lg transition-colors shadow-xs"
                >
                  <IoShieldCheckmarkOutline size={15} />
                  Sign In with Google
                </button>
              )}

              <button
                onClick={onClose}
                className="px-3 py-1.5 text-xs font-medium text-gray-600 hover:text-black hover:bg-gray-100 rounded-lg transition-colors border border-gray-200"
              >
                Close ID Card
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
