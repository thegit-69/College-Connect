import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import {
  IoCalendarOutline,
  IoPeopleOutline,
  IoHourglassOutline,
  IoCheckmarkCircleOutline,
  IoSchoolOutline,
  IoCheckboxOutline,
  IoMegaphoneOutline,
  IoArrowForward,
  IoSparklesOutline,
} from 'react-icons/io5'
import StatsCard from '../components/ui/StatsCard'
import useAuthStore from '../store/authStore'
import useCampusStore from '../store/campusStore'
import { fetchMyProposals } from '../services/eventService'
import { APPROVAL_STATUS } from '../utils/constants'
import { formatDate } from '../utils/helpers'
import toast from 'react-hot-toast'

const QUICK_LINKS = [
  { label: 'Academics', path: '/dashboard/academics', icon: <IoSchoolOutline />, color: 'bg-blue-50 text-blue-600' },
  { label: 'Attendance', path: '/dashboard/attendance', icon: <IoCheckboxOutline />, color: 'bg-emerald-50 text-emerald-600' },
  { label: 'AI Advisor', path: '/dashboard/ai-assistant', icon: <IoSparklesOutline />, color: 'bg-amber-50 text-amber-600' },
  { label: 'Complaints', path: '/dashboard/complaints', icon: <IoMegaphoneOutline />, color: 'bg-purple-50 text-purple-600' },
]

export default function Dashboard() {
  const { user } = useAuthStore()
  const { studentProfile, subjects, announcements } = useCampusStore()
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadMyEvents = async () => {
      if (!user?.uid) {
        setEvents([])
        setLoading(false)
        return
      }
      setLoading(true)
      try {
        const myEvents = await fetchMyProposals(user.uid)
        setEvents(myEvents)
      } catch (error) {
        console.error('Failed to load dashboard events:', error)
        toast.error('Failed to load dashboard data')
      } finally {
        setLoading(false)
      }
    }
    loadMyEvents()
  }, [user?.uid])

  const totalEvents = events.length
  const totalRegistrations = useMemo(
    () => events.reduce((acc, e) => acc + (e.registeredCount || 0), 0),
    [events]
  )
  const pendingEvents = events.filter(
    (e) => e.approvalStatus === APPROVAL_STATUS.PENDING
  ).length
  const approvedEvents = events.filter(
    (e) => e.approvalStatus === APPROVAL_STATUS.APPROVED
  ).length

  // Attendance status for subjects
  const shortageSubjects = subjects.filter(
    (s) => s.total > 0 && (s.attended / s.total) * 100 < 75
  )

  const getApprovalBadgeStyles = (status) => {
    if (status === APPROVAL_STATUS.APPROVED) return 'bg-emerald-50 text-emerald-600'
    if (status === APPROVAL_STATUS.REJECTED) return 'bg-red-50 text-red-600'
    return 'bg-amber-50 text-amber-600'
  }

  const dayOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][new Date().getDay()]

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Welcome Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-start justify-between"
      >
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 17 ? 'afternoon' : 'evening'},{' '}
            {user?.displayName?.split(' ')[0] || studentProfile.name.split(' ')[0]}! 👋
          </h1>
          <p className="text-gray-500 mt-1 text-sm">
            {dayOfWeek} · {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            {shortageSubjects.length > 0 && (
              <span className="ml-2 text-red-500 font-semibold">
                ⚠️ {shortageSubjects.length} subject{shortageSubjects.length > 1 ? 's' : ''} below 75% attendance
              </span>
            )}
          </p>
        </div>
        <div className="hidden sm:flex items-center gap-3 text-sm">
          <div className="text-right">
            <p className="text-xs text-gray-400">Overall Attendance</p>
            <p className={`text-2xl font-extrabold ${studentProfile.overallAttendance >= 75 ? 'text-emerald-600' : 'text-red-500'}`}>
              {studentProfile.overallAttendance}%
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-400">CGPA</p>
            <p className="text-2xl font-extrabold text-gray-900">{studentProfile.cgpa}</p>
          </div>
        </div>
      </motion.div>

      {/* Quick Links */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {QUICK_LINKS.map((ql, i) => (
          <motion.div
            key={ql.label}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
          >
            <Link
              to={ql.path}
              className="flex flex-col items-center justify-center gap-2 py-4 bg-white border border-gray-200 rounded-xl hover:shadow-sm hover:border-gray-300 transition-all group"
            >
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-lg ${ql.color}`}>
                {ql.icon}
              </div>
              <span className="text-xs font-semibold text-gray-700 group-hover:text-gray-900">{ql.label}</span>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Stats Row - Event stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard icon={<IoCalendarOutline />} label="My Events" value={loading ? '—' : totalEvents} color="primary" />
        <StatsCard icon={<IoPeopleOutline />} label="Registrations" value={loading ? '—' : totalRegistrations} color="green" />
        <StatsCard icon={<IoHourglassOutline />} label="Pending" value={loading ? '—' : pendingEvents} color="purple" />
        <StatsCard icon={<IoCheckmarkCircleOutline />} label="Approved" value={loading ? '—' : approvedEvents} color="orange" />
      </div>

      {/* Two column: Announcements + Attendance Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Announcements */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white border border-gray-200 rounded-xl overflow-hidden"
        >
          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-sm font-bold text-gray-900">Announcements</h2>
          </div>
          <div className="divide-y divide-gray-100">
            {announcements.map((ann) => (
              <div key={ann.id} className="px-5 py-3.5">
                <div className="flex items-start gap-2.5">
                  <span
                    className={`mt-0.5 text-[9px] font-bold px-1.5 py-0.5 rounded flex-shrink-0 ${
                      ann.urgency === 'Important'
                        ? 'bg-red-50 text-red-600'
                        : ann.urgency === 'Highlight'
                        ? 'bg-amber-50 text-amber-700'
                        : 'bg-gray-100 text-gray-500'
                    }`}
                  >
                    {ann.urgency}
                  </span>
                  <div>
                    <p className="text-xs font-semibold text-gray-900">{ann.title}</p>
                    <p className="text-[11px] text-gray-400 mt-0.5">{ann.date} · {ann.category}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Attendance Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.28 }}
          className="bg-white border border-gray-200 rounded-xl overflow-hidden"
        >
          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-sm font-bold text-gray-900">Attendance Overview</h2>
            <Link to="/dashboard/attendance" className="text-xs text-gray-400 hover:text-gray-800 flex items-center gap-1">
              View <IoArrowForward size={11} />
            </Link>
          </div>
          <div className="divide-y divide-gray-100">
            {subjects.map((sub) => {
              const pct = sub.total > 0 ? ((sub.attended / sub.total) * 100).toFixed(1) : 100
              const isShort = Number(pct) < 75
              return (
                <div key={sub.id} className="px-5 py-3 flex items-center gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-gray-800 truncate">{sub.code}</p>
                    <div className="h-1 bg-gray-100 rounded-full mt-1.5 overflow-hidden">
                      <div
                        className={`h-full rounded-full ${isShort ? 'bg-red-400' : Number(pct) >= 85 ? 'bg-emerald-500' : 'bg-blue-400'}`}
                        style={{ width: `${Math.min(100, pct)}%` }}
                      />
                    </div>
                  </div>
                  <span className={`text-xs font-bold flex-shrink-0 ${isShort ? 'text-red-500' : 'text-gray-700'}`}>
                    {pct}%
                  </span>
                </div>
              )
            })}
          </div>
        </motion.div>
      </div>

      {/* Recent Event Proposals */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        className="bg-white rounded-xl border border-gray-200 overflow-hidden"
      >
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-sm font-bold text-gray-900">My Event Proposals</h2>
          <Link to="/dashboard/events" className="text-xs text-gray-400 hover:text-gray-800 flex items-center gap-1">
            View all <IoArrowForward size={11} />
          </Link>
        </div>
        {loading ? (
          <div className="p-8 text-center text-sm text-gray-400">Loading…</div>
        ) : events.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-sm text-gray-400">No proposals yet</p>
            <Link
              to="/dashboard/create"
              className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-black hover:underline"
            >
              Create your first event <IoArrowForward size={11} />
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[560px]">
              <thead>
                <tr className="bg-gray-50">
                  {['Event', 'Type', 'Approval', 'Date'].map((h) => (
                    <th key={h} className="text-left px-5 py-2.5 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {events.slice(0, 5).map((event) => (
                  <tr key={event.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-3.5">
                      <p className="font-semibold text-gray-900 text-xs">{event.title}</p>
                      <p className="text-[11px] text-gray-400">{event.organizer}</p>
                    </td>
                    <td className="px-5 py-3.5 text-xs text-gray-600">{event.type}</td>
                    <td className="px-5 py-3.5">
                      <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold ${getApprovalBadgeStyles(event.approvalStatus)}`}>
                        {(event.approvalStatus || APPROVAL_STATUS.PENDING).toUpperCase()}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-xs text-gray-600">{formatDate(event.startDate)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>
    </div>
  )
}
