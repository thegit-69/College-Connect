import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  IoPersonOutline,
  IoCheckmarkCircle,
  IoCloseCircle,
  IoCalendarOutline,
  IoBookOutline,
  IoDownloadOutline,
  IoRefreshOutline,
} from 'react-icons/io5'
import useCampusStore from '../store/campusStore'

// Mock student roster per subject
const STUDENT_ROSTER = [
  { rollNo: '21CS001', name: 'Aarav Mehta' },
  { rollNo: '21CS002', name: 'Ananya Sharma' },
  { rollNo: '21CS003', name: 'Arjun Patel' },
  { rollNo: '21CS004', name: 'Bhavna Iyer' },
  { rollNo: '21CS005', name: 'Chirag Verma' },
  { rollNo: '21CS006', name: 'Deepika Nair' },
  { rollNo: '21CS007', name: 'Gaurav Singh' },
  { rollNo: '21CS008', name: 'Harsha Reddy' },
  { rollNo: '21CS009', name: 'Ishita Gupta' },
  { rollNo: '21CS010', name: 'Jay Joshi' },
  { rollNo: '21CS011', name: 'Kavya Rao' },
  { rollNo: '21CS012', name: 'Lokesh Kumar' },
  { rollNo: '21CS013', name: 'Meera Bhat' },
  { rollNo: '21CS014', name: 'Nikhil Thomas' },
  { rollNo: '21CS015', name: 'Pooja Mishra' },
  { rollNo: '21CS016', name: 'Rahul Desai' },
  { rollNo: '21CS017', name: 'Sakshi Jain' },
  { rollNo: '21CS018', name: 'Tejas Kulkarni' },
  { rollNo: '21CS019', name: 'Usha Menon' },
  { rollNo: '21CS020', name: 'Vivek Pillai' },
  { rollNo: '21CS042', name: 'Alex Johnson' },
]

export default function AttendancePage() {
  const { subjects } = useCampusStore()
  const [selectedSubject, setSelectedSubject] = useState(subjects[0]?.id || '')
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split('T')[0]
  )
  const [attendance, setAttendance] = useState(() =>
    Object.fromEntries(STUDENT_ROSTER.map((s) => [s.rollNo, null]))
  )
  const [submitted, setSubmitted] = useState(false)

  const subject = subjects.find((s) => s.id === selectedSubject)

  const markAll = (status) => {
    setAttendance(Object.fromEntries(STUDENT_ROSTER.map((s) => [s.rollNo, status])))
  }

  const toggle = (rollNo, status) => {
    setAttendance((prev) => ({ ...prev, [rollNo]: prev[rollNo] === status ? null : status }))
  }

  const presentCount = Object.values(attendance).filter((v) => v === 'present').length
  const absentCount = Object.values(attendance).filter((v) => v === 'absent').length
  const unmarkedCount = Object.values(attendance).filter((v) => v === null).length

  const handleSubmit = () => {
    if (unmarkedCount > 0) return
    setSubmitted(true)
    setTimeout(() => setSubmitted(false), 3000)
  }

  const resetAttendance = () => {
    setAttendance(Object.fromEntries(STUDENT_ROSTER.map((s) => [s.rollNo, null])))
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Attendance</h1>
        <p className="text-gray-500 mt-1 text-sm">
          Mark attendance for a session — faculty view
        </p>
      </div>

      {/* Session Controls */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 mb-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Subject */}
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
            <IoBookOutline className="inline mr-1" />
            Subject
          </label>
          <select
            value={selectedSubject}
            onChange={(e) => {
              setSelectedSubject(e.target.value)
              resetAttendance()
            }}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
          >
            {subjects.map((s) => (
              <option key={s.id} value={s.id}>
                {s.code} — {s.name}
              </option>
            ))}
          </select>
        </div>

        {/* Date */}
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
            <IoCalendarOutline className="inline mr-1" />
            Date
          </label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-black"
          />
        </div>
      </div>

      {/* Summary Bar */}
      <div className="bg-white border border-gray-200 rounded-xl px-5 py-3.5 mb-5 flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-5 text-sm">
          <span className="flex items-center gap-1.5 font-semibold text-emerald-600">
            <IoCheckmarkCircle size={16} />
            Present: <strong>{presentCount}</strong>
          </span>
          <span className="flex items-center gap-1.5 font-semibold text-red-500">
            <IoCloseCircle size={16} />
            Absent: <strong>{absentCount}</strong>
          </span>
          <span className="text-gray-400 text-xs">
            {unmarkedCount > 0 ? `${unmarkedCount} unmarked` : 'All marked ✓'}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => markAll('present')}
            className="text-xs px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-lg font-medium transition-colors"
          >
            All Present
          </button>
          <button
            onClick={() => markAll('absent')}
            className="text-xs px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 rounded-lg font-medium transition-colors"
          >
            All Absent
          </button>
          <button
            onClick={resetAttendance}
            className="text-xs px-3 py-1.5 bg-gray-50 hover:bg-gray-100 text-gray-600 border border-gray-200 rounded-lg font-medium transition-colors"
          >
            <IoRefreshOutline className="inline" /> Reset
          </button>
        </div>
      </div>

      {/* Student List */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden mb-5">
        <div className="px-5 py-3 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">
            {subject?.code} — {STUDENT_ROSTER.length} Students — Section A
          </p>
          <p className="text-xs text-gray-400">{new Date(selectedDate).toDateString()}</p>
        </div>

        <div className="divide-y divide-gray-100">
          {STUDENT_ROSTER.map((student, idx) => {
            const status = attendance[student.rollNo]
            return (
              <motion.div
                key={student.rollNo}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: idx * 0.02 }}
                className={`flex items-center justify-between px-5 py-3 transition-colors ${
                  status === 'present'
                    ? 'bg-emerald-50/40'
                    : status === 'absent'
                    ? 'bg-red-50/30'
                    : 'hover:bg-gray-50'
                }`}
              >
                {/* Student Info */}
                <div className="flex items-center gap-3">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                      status === 'present'
                        ? 'bg-emerald-100 text-emerald-700'
                        : status === 'absent'
                        ? 'bg-red-100 text-red-600'
                        : 'bg-gray-100 text-gray-500'
                    }`}
                  >
                    {student.name.split(' ').map((n) => n[0]).join('')}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{student.name}</p>
                    <p className="text-[11px] text-gray-400 font-mono">{student.rollNo}</p>
                  </div>
                </div>

                {/* P / A Toggle Buttons */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggle(student.rollNo, 'present')}
                    className={`px-3 py-1 rounded-lg text-xs font-bold border transition-all ${
                      status === 'present'
                        ? 'bg-emerald-500 text-white border-emerald-500 shadow-sm'
                        : 'bg-white text-gray-500 border-gray-200 hover:border-emerald-400 hover:text-emerald-600'
                    }`}
                  >
                    P
                  </button>
                  <button
                    onClick={() => toggle(student.rollNo, 'absent')}
                    className={`px-3 py-1 rounded-lg text-xs font-bold border transition-all ${
                      status === 'absent'
                        ? 'bg-red-500 text-white border-red-500 shadow-sm'
                        : 'bg-white text-gray-500 border-gray-200 hover:border-red-400 hover:text-red-600'
                    }`}
                  >
                    A
                  </button>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>

      {/* Submit */}
      <div className="flex items-center justify-between">
        <p className="text-xs text-gray-400">
          {unmarkedCount > 0
            ? `⚠️ Mark all students before submitting`
            : '✅ Ready to submit'}
        </p>
        <div className="flex gap-3">
          <button
            className="flex items-center gap-1.5 px-4 py-2 border border-gray-200 text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
          >
            <IoDownloadOutline size={15} />
            Export CSV
          </button>
          <button
            onClick={handleSubmit}
            disabled={unmarkedCount > 0}
            className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all ${
              unmarkedCount > 0
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-black text-white hover:bg-gray-800 shadow-sm'
            }`}
          >
            Submit Attendance
          </button>
        </div>
      </div>

      {/* Success Toast */}
      <AnimatePresence>
        {submitted && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            className="fixed bottom-6 right-6 bg-black text-white px-5 py-3 rounded-xl shadow-xl text-sm font-semibold flex items-center gap-2 z-50"
          >
            <IoCheckmarkCircle className="text-emerald-400" size={18} />
            Attendance saved for {subject?.code}!
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
