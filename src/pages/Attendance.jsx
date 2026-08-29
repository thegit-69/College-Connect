import { useState, useEffect, useRef, useCallback } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  IoScanOutline,
  IoCheckmarkCircle,
  IoVideocamOutline,
  IoVideocamOffOutline,
  IoSearchOutline,
  IoArrowBack,
  IoPeopleOutline,
  IoPersonAddOutline,
  IoCloseOutline,
  IoSparkles,
} from 'react-icons/io5'
import Button from '../components/ui/Button'
import useAuthStore from '../store/authStore'
import {
  fetchEventById,
  fetchRegistrations,
  markAttendance as markAttendanceInFirestore,
  registerForEvent,
} from '../services/eventService'
import { APPROVAL_STATUS } from '../utils/constants'
import { doc, updateDoc, serverTimestamp, collection, addDoc } from 'firebase/firestore'
import { db } from '../services/firebase'
import toast from 'react-hot-toast'

const SCAN_COOLDOWN_MS = 2500

const SAMPLE_DEMO_ATTENDEES = [
  { name: 'Alex Johnson', email: 'alex.j@campus.edu', rollNo: '21CS042' },
  { name: 'Aarav Mehta', email: 'aarav.m@campus.edu', rollNo: '21CS001' },
  { name: 'Ananya Sharma', email: 'ananya.s@campus.edu', rollNo: '21CS002' },
  { name: 'Arjun Patel', email: 'arjun.p@campus.edu', rollNo: '21CS003' },
  { name: 'Pooja Mishra', email: 'pooja.m@campus.edu', rollNo: '21CS015' },
]

export default function Attendance() {
  const { id } = useParams()
  const { user, isSuperAdmin } = useAuthStore()
  const [event, setEvent] = useState(null)
  const [attendees, setAttendees] = useState([])
  const [loading, setLoading] = useState(true)
  const [scanning, setScanning] = useState(false)
  const [manualId, setManualId] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [lastScanned, setLastScanned] = useState(null)
  const [isAddingDemo, setIsAddingDemo] = useState(false)

  const scannerRef = useRef(null)
  const html5QrCodeRef = useRef(null)
  const attendeesRef = useRef([])
  const scannerStartingRef = useRef(false)
  const lastScannedCodeRef = useRef(null)
  const lastScannedTimeRef = useRef(0)

  const attendedCount = attendees.filter((a) => a.attended).length

  useEffect(() => {
    attendeesRef.current = attendees
  }, [attendees])

  // Load event details and registrations
  const loadAttendanceData = useCallback(async () => {
    setLoading(true)
    try {
      const eventDoc = await fetchEventById(id)
      if (!eventDoc) {
        toast.error('Event not found.')
        return
      }

      setEvent(eventDoc)

      const regs = await fetchRegistrations(id)
      const mapped = regs.map((r) => ({
        id: r.id,
        name: r.displayName || r.name || 'Student Attendee',
        email: r.email || 'student@campus.edu',
        uid: r.uid || '',
        attended: r.attended || false,
        time: r.attendedAt?.toDate
          ? r.attendedAt.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          : r.attended ? 'Checked in' : null,
      }))

      setAttendees(mapped)
    } catch (error) {
      console.error('Failed to load registrations:', error)
      toast.error('Failed to load attendees')
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => {
    loadAttendanceData()
  }, [loadAttendanceData])

  // Toggle or Mark attendance in Firestore
  const handleToggleAttendance = useCallback(async (registrationId, currentStatus) => {
    const attendee = attendeesRef.current.find((a) => a.id === registrationId)
    if (!attendee) {
      toast.error('Participant not found')
      return
    }

    const newStatus = !currentStatus
    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

    try {
      const regDocRef = doc(db, 'registrations', registrationId)
      await updateDoc(regDocRef, {
        attended: newStatus,
        attendedAt: newStatus ? serverTimestamp() : null,
      })

      setAttendees((prev) =>
        prev.map((a) =>
          a.id === registrationId ? { ...a, attended: newStatus, time: newStatus ? nowTime : null } : a
        )
      )

      if (newStatus) {
        setLastScanned({ name: attendee.name, time: nowTime })
        toast.success(`✓ ${attendee.name} marked Present!`)
      } else {
        toast('Attendance unmarked', { icon: '↩️' })
      }
    } catch (error) {
      console.error('Mark attendance error:', error)
      toast.error('Failed to update attendance in database')
    }
  }, [])

  // Ref-based callback for QR scanner
  const handleToggleAttendanceRef = useRef(handleToggleAttendance)
  useEffect(() => {
    handleToggleAttendanceRef.current = handleToggleAttendance
  }, [handleToggleAttendance])

  // Process scanned QR value
  const processQrResult = useCallback((decodedText) => {
    if (typeof decodedText !== 'string') return

    let regId = decodedText.trim()
    if (!regId) return

    if (regId.includes('reg/')) regId = regId.split('reg/').pop()
    if (regId.includes('registration/')) regId = regId.split('registration/').pop()

    // Find attendee
    const match = attendeesRef.current.find(
      (a) =>
        a.id === regId ||
        a.email.toLowerCase() === regId.toLowerCase() ||
        a.uid === regId
    )

    if (match) {
      if (match.attended) {
        toast(`Already checked in: ${match.name}`, { icon: 'ℹ️' })
      } else {
        handleToggleAttendanceRef.current(match.id, false)
      }
    } else {
      // Try direct id update
      handleToggleAttendanceRef.current(regId, false)
    }
  }, [])

  // Start Camera QR Scanner
  const startScanner = async () => {
    if (!scannerRef.current || scanning || scannerStartingRef.current) return
    scannerStartingRef.current = true

    try {
      const { Html5Qrcode } = await import('html5-qrcode')

      if (html5QrCodeRef.current) {
        await stopScanner()
      }

      const html5QrCode = new Html5Qrcode('qr-reader')
      html5QrCodeRef.current = html5QrCode

      const qrConfig = {
        fps: 10,
        qrbox: { width: 250, height: 250 },
        aspectRatio: 1.0,
      }

      const onSuccess = (decodedText) => {
        const now = Date.now()
        if (typeof decodedText !== 'string') return

        if (
          decodedText === lastScannedCodeRef.current &&
          now - lastScannedTimeRef.current < SCAN_COOLDOWN_MS
        ) {
          return
        }
        lastScannedCodeRef.current = decodedText
        lastScannedTimeRef.current = now
        processQrResult(decodedText)
      }

      const onFailure = () => {}

      let started = false
      for (const config of [{ facingMode: 'environment' }, { facingMode: 'user' }]) {
        try {
          await html5QrCode.start(config, qrConfig, onSuccess, onFailure)
          started = true
          break
        } catch {
          // try next camera
        }
      }

      if (!started) {
        const cameras = await Html5Qrcode.getCameras()
        if (cameras && cameras.length > 0) {
          await html5QrCode.start(cameras[0].id, qrConfig, onSuccess, onFailure)
        } else {
          throw new Error('No cameras found')
        }
      }

      setScanning(true)
      toast.success('Camera scanner active')
    } catch (error) {
      console.error('Scanner start error:', error)
      toast.error('Could not open camera. Please use manual entry or check permissions.')
      if (html5QrCodeRef.current) {
        try {
          await html5QrCodeRef.current.clear()
        } catch {}
        html5QrCodeRef.current = null
      }
    } finally {
      scannerStartingRef.current = false
    }
  }

  // Stop Camera QR Scanner
  const stopScanner = async () => {
    if (html5QrCodeRef.current) {
      try {
        await html5QrCodeRef.current.stop()
        await html5QrCodeRef.current.clear()
      } catch (e) {}
      html5QrCodeRef.current = null
    }
    setScanning(false)
  }

  useEffect(() => {
    return () => {
      if (html5QrCodeRef.current) {
        html5QrCodeRef.current.stop().catch(() => {})
      }
    }
  }, [])

  // Manual Check-in Search / Submit
  const handleManualEntry = (e) => {
    e?.preventDefault()
    const trimmed = manualId.trim()
    if (!trimmed) return

    const match = attendees.find(
      (a) =>
        a.id.toLowerCase() === trimmed.toLowerCase() ||
        a.email.toLowerCase() === trimmed.toLowerCase() ||
        a.name.toLowerCase().includes(trimmed.toLowerCase())
    )

    if (match) {
      handleToggleAttendance(match.id, match.attended)
    } else {
      toast.error('No matching registered attendee found with that ID or name.')
    }
    setManualId('')
  }

  // Seed Demo Attendees for easy live testing
  const handleSeedDemoAttendees = async () => {
    setIsAddingDemo(true)
    try {
      for (const sample of SAMPLE_DEMO_ATTENDEES) {
        await addDoc(collection(db, 'registrations'), {
          eventId: id,
          displayName: sample.name,
          email: sample.email,
          uid: `demo-${sample.rollNo.toLowerCase()}`,
          attended: false,
          registeredAt: new Date(),
        })
      }
      await loadAttendanceData()
      toast.success('Added 5 demo registered participants!')
    } catch (err) {
      console.error('Error seeding demo attendees:', err)
      toast.error('Failed to add demo attendees')
    } finally {
      setIsAddingDemo(false)
    }
  }

  const filteredAttendees = attendees.filter(
    (a) =>
      a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.id.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="max-w-6xl mx-auto space-y-6 font-sans">
      {/* Top Header with Back Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-gray-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Link
              to="/dashboard/events"
              className="p-1.5 rounded-lg text-gray-500 hover:text-black hover:bg-gray-100 transition-colors"
              title="Back to My Events"
            >
              <IoArrowBack size={18} />
            </Link>
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-md">
              Live Attendance Portal
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-950 font-display">
            {event?.title || 'Event Attendance'}
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            {event?.venue || 'Campus Venue'} • {event?.startDate ? new Date(event.startDate).toDateString() : 'Scheduled'}
          </p>
        </div>

        {/* Progress KPI Card */}
        <div className="flex items-center gap-4 bg-gray-50 p-3 rounded-xl border border-gray-200">
          <div className="text-right">
            <span className="text-[10px] font-bold text-gray-400 uppercase">Check-in Status</span>
            <p className="text-lg font-black text-gray-900 leading-tight">
              {attendedCount} <span className="text-xs font-normal text-gray-500">/ {attendees.length}</span>
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-500 text-white flex items-center justify-center font-bold text-xs shadow-xs">
            {attendees.length > 0 ? `${Math.round((attendedCount / attendees.length) * 100)}%` : '0%'}
          </div>
        </div>
      </div>

      {/* Main 2-Column Responsive Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: QR Scanner & Quick Manual Check-In (5 Cols) */}
        <div className="lg:col-span-5 space-y-5">
          {/* Scanner Card */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl border border-gray-200 p-5 shadow-xs flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-bold text-gray-950 flex items-center gap-2 font-display">
                  <IoScanOutline className="text-emerald-600" />
                  <span>Camera QR Scanner</span>
                </h3>
                <span className="text-[10px] font-semibold text-gray-400">Live 10 FPS</span>
              </div>
              <p className="text-xs text-gray-500 mb-4">
                Scan attendee QR ticket from their smartphone or printed pass.
              </p>

              {/* Viewport */}
              <div
                ref={scannerRef}
                className="relative w-full aspect-square max-w-[280px] mx-auto rounded-2xl overflow-hidden border-2 border-gray-200 bg-gray-950 flex items-center justify-center"
              >
                <div id="qr-reader" className="w-full h-full object-cover" />

                {!scanning && (
                  <div className="absolute inset-0 bg-gray-900/90 flex flex-col items-center justify-center text-center p-4 text-white">
                    <IoVideocamOutline className="text-4xl text-gray-400 mb-2" />
                    <p className="text-xs font-bold">Camera is idle</p>
                    <p className="text-[10px] text-gray-400 mt-1 max-w-[180px]">
                      Click below to activate camera scan
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Scanner Controls */}
            <div className="mt-4 flex flex-col gap-2">
              {!scanning ? (
                <button
                  onClick={startScanner}
                  className="w-full py-2.5 bg-black hover:bg-gray-800 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-xs"
                >
                  <IoVideocamOutline size={16} />
                  <span>Start Camera Scanner</span>
                </button>
              ) : (
                <button
                  onClick={stopScanner}
                  className="w-full py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-xs"
                >
                  <IoVideocamOffOutline size={16} />
                  <span>Stop Scanner</span>
                </button>
              )}

              {/* Last Checked Feedback Pill */}
              <AnimatePresence>
                {lastScanned && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2.5 text-xs text-emerald-900"
                  >
                    <IoCheckmarkCircle className="text-emerald-600 text-lg flex-shrink-0" />
                    <div className="truncate">
                      <p className="font-bold truncate">{lastScanned.name}</p>
                      <p className="text-[10px] text-emerald-700">Checked in at {lastScanned.time}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Quick Manual Entry */}
          <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-xs">
            <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-2">
              Quick ID / Email Check-In
            </h4>
            <form onSubmit={handleManualEntry} className="flex gap-2">
              <input
                type="text"
                value={manualId}
                onChange={(e) => setManualId(e.target.value)}
                placeholder="Enter Registration ID, Name or Email..."
                className="flex-1 text-xs px-3 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-black bg-gray-50"
              />
              <button
                type="submit"
                disabled={!manualId.trim()}
                className="px-4 py-2.5 bg-black hover:bg-gray-800 text-white text-xs font-bold rounded-xl disabled:opacity-40 transition-colors shadow-xs"
              >
                Mark
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: Registered Attendees List (7 Cols) */}
        <div className="lg:col-span-7">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-xs flex flex-col h-full min-h-[500px]"
          >
            {/* List Header & Search */}
            <div className="p-4 sm:p-5 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-gray-50/70">
              <div>
                <h3 className="text-sm font-bold text-gray-950 font-display">
                  Attendee Roster ({filteredAttendees.length})
                </h3>
                <p className="text-[11px] text-gray-500">
                  {attendedCount} verified entries
                </p>
              </div>

              <div className="flex items-center gap-2">
                <div className="relative flex-1 sm:w-52">
                  <IoSearchOutline className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search attendee..."
                    className="w-full text-xs pl-8 pr-3 py-1.5 rounded-lg border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-black"
                  />
                </div>

                {attendees.length === 0 && (
                  <button
                    onClick={handleSeedDemoAttendees}
                    disabled={isAddingDemo}
                    className="flex-shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 bg-black hover:bg-gray-800 text-white text-xs font-bold rounded-lg transition-colors shadow-xs"
                  >
                    <IoPersonAddOutline size={13} />
                    <span>{isAddingDemo ? 'Adding...' : 'Demo Roster'}</span>
                  </button>
                )}
              </div>
            </div>

            {/* List Body */}
            {loading ? (
              <div className="p-12 text-center text-xs text-gray-400">Loading attendees...</div>
            ) : filteredAttendees.length === 0 ? (
              <div className="p-12 text-center space-y-3">
                <IoPeopleOutline className="text-4xl text-gray-300 mx-auto" />
                <p className="text-xs text-gray-500 font-medium">
                  {searchQuery ? 'No attendees match your search query.' : 'No registered participants for this event yet.'}
                </p>
                {attendees.length === 0 && (
                  <button
                    onClick={handleSeedDemoAttendees}
                    disabled={isAddingDemo}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-all shadow-xs"
                  >
                    <IoSparkles />
                    <span>Add Demo Participants for Testing</span>
                  </button>
                )}
              </div>
            ) : (
              <div className="divide-y divide-gray-100 flex-1 overflow-y-auto max-h-[560px]">
                {filteredAttendees.map((attendee) => (
                  <div
                    key={attendee.id}
                    className={`px-4 sm:px-5 py-3.5 flex items-center justify-between gap-3 transition-colors ${
                      attendee.attended ? 'bg-emerald-50/40' : 'hover:bg-gray-50'
                    }`}
                  >
                    {/* Attendee Avatar & Details */}
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center text-xs font-extrabold flex-shrink-0 ${
                          attendee.attended
                            ? 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                            : 'bg-gray-100 text-gray-600 border border-gray-200'
                        }`}
                      >
                        {attendee.attended ? (
                          <IoCheckmarkCircle size={18} />
                        ) : (
                          attendee.name.charAt(0).toUpperCase()
                        )}
                      </div>

                      <div className="min-w-0">
                        <p className="text-xs font-bold text-gray-900 truncate">
                          {attendee.name}
                        </p>
                        <p className="text-[10px] text-gray-400 truncate">
                          {attendee.email} • ID: <span className="font-mono">{attendee.id.slice(0, 8)}</span>
                        </p>
                      </div>
                    </div>

                    {/* Attendance Status & Toggle Action */}
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {attendee.attended ? (
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 border border-emerald-200">
                            ✓ {attendee.time || 'Present'}
                          </span>
                          <button
                            onClick={() => handleToggleAttendance(attendee.id, true)}
                            className="p-1 rounded-md text-gray-400 hover:text-red-600 hover:bg-gray-100 text-[10px] transition-colors"
                            title="Unmark Attendance"
                          >
                            <IoCloseOutline size={16} />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleToggleAttendance(attendee.id, false)}
                          className="px-3.5 py-1.5 bg-black hover:bg-gray-800 text-white rounded-lg text-xs font-bold transition-all shadow-2xs"
                        >
                          Check In
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  )
}
