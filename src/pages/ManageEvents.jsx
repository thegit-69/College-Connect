import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  IoRefreshOutline,
  IoTrashOutline,
  IoCreateOutline,
  IoQrCodeOutline,
  IoAddOutline,
} from 'react-icons/io5'
import Badge from '../components/ui/Badge'
import Button from '../components/ui/Button'
import useAuthStore from '../store/authStore'
import { formatDate } from '../utils/helpers'
import {
  deleteEvent as deleteEventFromFirestore,
  fetchMyProposals,
  resubmitEventProposal,
} from '../services/eventService'
import { APPROVAL_STATUS } from '../utils/constants'
import toast from 'react-hot-toast'

export default function ManageEvents() {
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadMyEvents = async () => {
      if (!user?.uid) {
        setLoading(false)
        setEvents([])
        return
      }

      setLoading(true)
      try {
        const myEvents = await fetchMyProposals(user.uid)
        setEvents(myEvents)
      } catch (error) {
        console.error('Failed to load your proposals:', error)
        toast.error('Failed to load your events')
      } finally {
        setLoading(false)
      }
    }

    loadMyEvents()
  }, [user?.uid])

  const handleDelete = async (id, title) => {
    if (window.confirm(`Delete "${title}"?`)) {
      try {
        await deleteEventFromFirestore(id)
        setEvents((prev) => prev.filter((event) => event.id !== id))
      } catch (e) {
        console.error('Delete event error:', e)
        toast.error('Failed to delete event')
        return
      }
      toast.success('Event deleted')
    }
  }

  const handleResubmit = async (eventId) => {
    try {
      await resubmitEventProposal(eventId)
      setEvents((prev) =>
        prev.map((event) =>
          event.id === eventId
            ? {
              ...event,
              approvalStatus: APPROVAL_STATUS.PENDING,
              rejectionReason: null,
            }
            : event
        )
      )
      toast.success('Proposal resubmitted for admin review')
    } catch (error) {
      console.error('Resubmit error:', error)
      toast.error('Failed to resubmit event')
    }
  }

  const getApprovalLabel = (status) =>
    (status || APPROVAL_STATUS.PENDING).toUpperCase()

  const getApprovalColor = (status) => {
    if (status === APPROVAL_STATUS.APPROVED) return 'green'
    if (status === APPROVAL_STATUS.REJECTED) return 'red'
    return 'yellow'
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-950 font-display">My Campus Events</h1>
          <p className="text-gray-500 text-sm mt-0.5">Manage event approvals, registrations, and live QR attendance check-ins</p>
        </div>
        <button
          onClick={() => navigate('/dashboard/create')}
          className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-black hover:bg-gray-800 text-white rounded-xl text-xs font-bold transition-all shadow-xs"
        >
          <IoAddOutline size={16} />
          <span>Create Event</span>
        </button>
      </div>

      {loading ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-gray-200">
          <p className="text-gray-400 text-sm">Loading your events...</p>
        </div>
      ) : (
        <div className="space-y-4">
          {events.map((event, index) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white border border-gray-200 rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row md:items-center gap-4 shadow-xs"
            >
              {/* Thumbnail */}
              <div className="w-full md:w-36 h-28 md:h-24 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100">
                <img
                  src={event.banner || event.image || 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=80'}
                  alt={event.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-gray-950 text-sm sm:text-base font-display">{event.title}</h3>
                <p className="text-xs text-gray-400 mt-0.5">
                  {event.type} • {formatDate(event.startDate || event.date)}
                </p>
                <div className="flex flex-wrap items-center gap-1.5 mt-2.5">
                  <Badge>{event.status || 'Active'}</Badge>
                  <Badge>{event.mode || 'Offline'}</Badge>
                  <Badge color={getApprovalColor(event.approvalStatus)}>
                    {getApprovalLabel(event.approvalStatus)}
                  </Badge>
                  <span className="text-xs text-gray-500 font-medium ml-1">
                    {event.registeredCount || 0} registered
                  </span>
                </div>
                {event.approvalStatus === APPROVAL_STATUS.REJECTED && (
                  <p className="text-xs text-red-500 mt-2">
                    Rejection reason: {event.rejectionReason || 'No reason provided'}
                  </p>
                )}
              </div>

              {/* Actions */}
              <div className="flex flex-wrap items-center justify-end md:justify-start gap-2 pt-2 md:pt-0 border-t md:border-t-0 border-gray-100">
                {/* Live QR Attendance Tracker Button */}
                <button
                  onClick={() => navigate(`/dashboard/events/${event.id}/attendance`)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-bold transition-colors"
                  title="Live QR Attendance Portal"
                >
                  <IoQrCodeOutline size={15} />
                  <span>QR Attendance</span>
                </button>

                {event.approvalStatus === APPROVAL_STATUS.REJECTED && (
                  <button
                    onClick={() => handleResubmit(event.id)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 rounded-xl text-xs font-bold transition-colors"
                  >
                    <IoRefreshOutline />
                    <span>Resubmit</span>
                  </button>
                )}
                <button
                  onClick={() => navigate(`/events/${event.id}`)}
                  className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl text-xs font-semibold transition-colors"
                >
                  View
                </button>
                <button
                  onClick={() => handleDelete(event.id, event.title)}
                  className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                  title="Delete Event"
                >
                  <IoTrashOutline size={16} />
                </button>
              </div>
            </motion.div>
          ))}

          {events.length === 0 && (
            <div className="text-center py-16 bg-white rounded-2xl border border-gray-200 space-y-3">
              <p className="text-gray-400 text-sm">You haven't created any event proposals yet.</p>
              <button
                onClick={() => navigate('/dashboard/create')}
                className="px-5 py-2.5 bg-black hover:bg-gray-800 text-white rounded-xl text-xs font-bold transition-all shadow-xs"
              >
                Create your first event
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
