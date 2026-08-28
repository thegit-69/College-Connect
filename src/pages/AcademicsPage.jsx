import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  IoCalendarOutline,
  IoTimeOutline,
  IoLocationOutline,
  IoPersonOutline,
  IoBookOutline,
  IoDocumentTextOutline,
  IoCheckmarkCircleOutline,
  IoEllipseOutline,
} from 'react-icons/io5'
import useCampusStore from '../store/campusStore'

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']

export default function AcademicsPage() {
  const { subjects, timetable, assignments, submitAssignment } = useCampusStore()
  const [activeTab, setActiveTab] = useState('timetable')
  const today = DAYS[Math.min(new Date().getDay() - 1, 4)] || 'Monday'
  const [selectedDay, setSelectedDay] = useState(today)

  const pendingCount = assignments.filter((a) => a.status === 'Pending').length

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Academics & Schedule</h1>
        <p className="text-gray-500 mt-1 text-sm">
          Your timetable, subjects, and assignment tracker
        </p>
      </div>

      {/* Tab Bar */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-xl mb-6 w-fit">
        {['timetable', 'subjects', 'assignments'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${
              activeTab === tab
                ? 'bg-white shadow-sm text-gray-900'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab}
            {tab === 'assignments' && pendingCount > 0 && (
              <span className="ml-1.5 bg-red-500 text-white text-[9px] px-1.5 py-0.5 rounded-full">
                {pendingCount}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Timetable Tab */}
      {activeTab === 'timetable' && (
        <div>
          {/* Day Selector */}
          <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
            {DAYS.map((day) => (
              <button
                key={day}
                onClick={() => setSelectedDay(day)}
                className={`flex-shrink-0 px-4 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                  selectedDay === day
                    ? 'bg-black text-white border-black'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'
                }`}
              >
                {day.slice(0, 3)}
              </button>
            ))}
          </div>

          {/* Classes */}
          <div className="space-y-2.5">
            {(timetable[selectedDay] || []).map((cls, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-white border border-gray-200 rounded-xl p-4 flex items-start gap-4 hover:shadow-sm transition-shadow"
              >
                <div className="min-w-[90px] text-right">
                  <p className="text-[11px] text-gray-500 font-mono leading-tight">{cls.time}</p>
                </div>
                <div className="w-px h-full min-h-[40px] bg-gray-200 self-stretch" />
                <div className="flex-1">
                  <p className="text-sm font-bold text-gray-900">{cls.subject}</p>
                  <div className="flex flex-wrap gap-3 mt-1">
                    <span className="text-[11px] text-gray-500 flex items-center gap-1">
                      <IoPersonOutline size={11} /> {cls.faculty}
                    </span>
                    <span className="text-[11px] text-gray-500 flex items-center gap-1">
                      <IoLocationOutline size={11} /> {cls.room}
                    </span>
                  </div>
                </div>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 bg-gray-100 text-gray-500 rounded-md">
                  {cls.code}
                </span>
              </motion.div>
            ))}
            {!(timetable[selectedDay]?.length) && (
              <div className="text-center py-14 text-gray-400 text-sm">
                No classes scheduled for {selectedDay}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Subjects Tab */}
      {activeTab === 'subjects' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {subjects.map((sub, i) => {
            const pct = sub.total > 0 ? ((sub.attended / sub.total) * 100).toFixed(1) : 100
            const isShort = pct < 75
            return (
              <motion.div
                key={sub.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07 }}
                className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-sm transition-shadow"
              >
                {/* Top */}
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <p className="text-[10px] font-mono text-gray-400">{sub.code}</p>
                    <p className="text-sm font-bold text-gray-900 leading-snug">{sub.name}</p>
                    <p className="text-[11px] text-gray-500 mt-0.5">{sub.faculty}</p>
                  </div>
                  <span
                    className={`text-xs font-bold px-2 py-0.5 rounded-md ${
                      isShort
                        ? 'bg-red-50 text-red-600 border border-red-200'
                        : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    }`}
                  >
                    {pct}%
                  </span>
                </div>

                {/* Progress bar */}
                <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden mb-3">
                  <div
                    className={`h-full rounded-full transition-all ${
                      isShort ? 'bg-red-400' : Number(pct) >= 85 ? 'bg-emerald-500' : 'bg-blue-500'
                    }`}
                    style={{ width: `${Math.min(100, pct)}%` }}
                  />
                </div>

                {/* Stats row */}
                <div className="flex items-center justify-between text-[11px] text-gray-500">
                  <span>{sub.attended}/{sub.total} classes attended</span>
                  <span>{sub.credits} Credits</span>
                </div>

                {/* Syllabus */}
                <div className="mt-3 pt-3 border-t border-gray-100 space-y-1">
                  {sub.syllabus.slice(0, 3).map((unit) => (
                    <div key={unit.unit} className="flex items-center gap-2 text-[11px]">
                      {unit.completed ? (
                        <IoCheckmarkCircleOutline size={12} className="text-emerald-500 flex-shrink-0" />
                      ) : (
                        <IoEllipseOutline size={12} className="text-gray-300 flex-shrink-0" />
                      )}
                      <span className={unit.completed ? 'text-gray-500 line-through' : 'text-gray-700'}>
                        {unit.title}
                      </span>
                    </div>
                  ))}
                  {sub.syllabus.length > 3 && (
                    <p className="text-[10px] text-gray-400 pl-4">
                      +{sub.syllabus.length - 3} more units
                    </p>
                  )}
                </div>
              </motion.div>
            )
          })}
        </div>
      )}

      {/* Assignments Tab */}
      {activeTab === 'assignments' && (
        <div className="space-y-3">
          {assignments.map((asg, i) => {
            const overdue = new Date(asg.dueDate) < new Date() && asg.status === 'Pending'
            return (
              <motion.div
                key={asg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-sm transition-shadow"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-mono text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded">
                        {asg.subjectId}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                          asg.status === 'Graded'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : asg.status === 'Submitted'
                            ? 'bg-blue-50 text-blue-700 border-blue-200'
                            : overdue
                            ? 'bg-red-50 text-red-600 border-red-200'
                            : 'bg-amber-50 text-amber-700 border-amber-200'
                        }`}
                      >
                        {overdue ? 'Overdue' : asg.status}
                      </span>
                    </div>
                    <p className="text-sm font-bold text-gray-900">{asg.title}</p>
                    <p className="text-xs text-gray-500 mt-1">{asg.description}</p>
                    <div className="flex gap-4 mt-2 text-[11px] text-gray-400">
                      <span className="flex items-center gap-1">
                        <IoCalendarOutline size={11} />
                        Due: {asg.dueDate}
                      </span>
                      <span>Max: {asg.maxMarks} marks</span>
                      {asg.score !== null && (
                        <span className="font-bold text-emerald-600">
                          Score: {asg.score}/{asg.maxMarks}
                        </span>
                      )}
                    </div>
                  </div>
                  {asg.status === 'Pending' && (
                    <button
                      onClick={() => submitAssignment(asg.id)}
                      className="flex-shrink-0 px-3 py-1.5 bg-black text-white text-xs font-semibold rounded-lg hover:bg-gray-800 transition-colors"
                    >
                      Submit
                    </button>
                  )}
                </div>
              </motion.div>
            )
          })}
        </div>
      )}
    </div>
  )
}
