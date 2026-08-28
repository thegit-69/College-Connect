import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  IoMegaphoneOutline,
  IoAddCircleOutline,
  IoCheckmarkCircle,
  IoTimeOutline,
  IoChevronDownOutline,
  IoShieldCheckmarkOutline,
} from 'react-icons/io5'
import useCampusStore from '../store/campusStore'
import toast from 'react-hot-toast'

const CATEGORIES = [
  'IT & Wi-Fi',
  'Infrastructure',
  'Mess & Food',
  'Transportation',
  'Hostel & Facilities',
  'Academic Concern',
  'Safety & Security',
  'Other',
]

const URGENCY_STYLES = {
  High: 'bg-red-50 text-red-600 border-red-200',
  Medium: 'bg-amber-50 text-amber-700 border-amber-200',
  Low: 'bg-gray-50 text-gray-600 border-gray-200',
}

const STATUS_STYLES = {
  Submitted: 'bg-blue-50 text-blue-700 border-blue-200',
  'Under Review': 'bg-amber-50 text-amber-700 border-amber-200',
  'In Progress': 'bg-purple-50 text-purple-700 border-purple-200',
  Resolved: 'bg-emerald-50 text-emerald-700 border-emerald-200',
}

export default function ComplaintsPage() {
  const { complaints, addComplaint } = useCampusStore()
  const [showForm, setShowForm] = useState(false)
  const [expandedId, setExpandedId] = useState(null)
  const [form, setForm] = useState({
    title: '',
    category: CATEGORIES[0],
    description: '',
    location: '',
    urgency: 'Medium',
    isAnonymous: false,
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.title.trim() || !form.description.trim()) {
      toast.error('Please fill in all required fields')
      return
    }
    addComplaint({
      id: `CMP-${Date.now()}`,
      ...form,
      status: 'Submitted',
      studentName: form.isAnonymous ? 'Anonymous Student' : 'Alex Johnson',
      studentRoll: form.isAnonymous ? 'Hidden' : '21CS042',
      submittedAt: new Date().toISOString(),
      timeline: [
        { status: 'Submitted', date: new Date().toLocaleDateString(), note: 'Grievance ticket created' },
      ],
      adminResponse: '',
    })
    setForm({ title: '', category: CATEGORIES[0], description: '', location: '', urgency: 'Medium', isAnonymous: false })
    setShowForm(false)
    toast.success('Complaint submitted!')
  }

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Smart Complaints</h1>
          <p className="text-gray-500 mt-1 text-sm">
            Submit campus grievances and track their resolution
          </p>
        </div>
        <button
          onClick={() => setShowForm((v) => !v)}
          className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-xl text-sm font-semibold hover:bg-gray-800 transition-colors"
        >
          <IoAddCircleOutline size={16} />
          File Complaint
        </button>
      </div>

      {/* Form */}
      <AnimatePresence>
        {showForm && (
          <motion.form
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            onSubmit={handleSubmit}
            className="bg-white border border-gray-200 rounded-xl p-5 mb-5 overflow-hidden"
          >
            <p className="text-sm font-bold text-gray-900 mb-4">File a Complaint</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                  Title *
                </label>
                <input
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="Brief title of your grievance"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                  Category
                </label>
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-black"
                >
                  {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                  Urgency
                </label>
                <div className="flex gap-2">
                  {['Low', 'Medium', 'High'].map((u) => (
                    <button
                      key={u}
                      type="button"
                      onClick={() => setForm({ ...form, urgency: u })}
                      className={`flex-1 py-1.5 text-xs font-bold rounded-lg border transition-all ${
                        form.urgency === u
                          ? URGENCY_STYLES[u]
                          : 'bg-white text-gray-400 border-gray-200'
                      }`}
                    >
                      {u}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                  Location
                </label>
                <input
                  value={form.location}
                  onChange={(e) => setForm({ ...form, location: e.target.value })}
                  placeholder="Block, Room, Area…"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                  Description *
                </label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Detailed description of the issue…"
                  rows={3}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-black resize-none"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.isAnonymous}
                    onChange={(e) => setForm({ ...form, isAnonymous: e.target.checked })}
                    className="w-4 h-4 rounded border-gray-300"
                  />
                  <div>
                    <span className="text-sm font-medium text-gray-700">Submit anonymously</span>
                    <p className="text-[11px] text-gray-400">Your name and roll number will be hidden from the reviewer</p>
                  </div>
                </label>
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-black text-white text-sm font-semibold rounded-lg hover:bg-gray-800 transition-colors"
              >
                Submit
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      {/* Complaint list */}
      <div className="space-y-3">
        {complaints.length === 0 && (
          <div className="text-center py-16 text-gray-400 text-sm bg-white border border-gray-200 rounded-xl">
            <IoMegaphoneOutline size={32} className="mx-auto mb-3 opacity-50" />
            No complaints submitted yet
          </div>
        )}
        {complaints.map((c, i) => (
          <motion.div
            key={c.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-sm transition-shadow"
          >
            <button
              className="w-full text-left p-5"
              onClick={() => setExpandedId(expandedId === c.id ? null : c.id)}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                        STATUS_STYLES[c.status] || 'bg-gray-100 text-gray-600 border-gray-200'
                      }`}
                    >
                      {c.status}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                        URGENCY_STYLES[c.urgency] || ''
                      }`}
                    >
                      {c.urgency}
                    </span>
                    <span className="text-[10px] text-gray-400">{c.category}</span>
                    {c.isAnonymous && (
                      <span className="text-[10px] text-gray-400 flex items-center gap-0.5">
                        <IoShieldCheckmarkOutline size={10} /> Anonymous
                      </span>
                    )}
                  </div>
                  <p className="text-sm font-bold text-gray-900">{c.title}</p>
                  <p className="text-[11px] text-gray-400 mt-0.5">
                    {c.id} · {new Date(c.submittedAt).toLocaleDateString()}
                  </p>
                </div>
                <IoChevronDownOutline
                  size={16}
                  className={`text-gray-400 flex-shrink-0 transition-transform ${
                    expandedId === c.id ? 'rotate-180' : ''
                  }`}
                />
              </div>
            </button>

            {/* Expanded */}
            <AnimatePresence>
              {expandedId === c.id && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="border-t border-gray-100 px-5 py-4 bg-gray-50 space-y-3"
                >
                  <p className="text-xs text-gray-700">{c.description}</p>

                  {/* Timeline */}
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Timeline</p>
                    <div className="space-y-2">
                      {c.timeline.map((t, j) => (
                        <div key={j} className="flex items-start gap-2 text-xs">
                          <IoCheckmarkCircle size={14} className="text-emerald-500 mt-0.5 flex-shrink-0" />
                          <div>
                            <span className="font-semibold text-gray-700">{t.status}</span>
                            <span className="text-gray-400"> · {t.date}</span>
                            {t.note && <p className="text-gray-500 mt-0.5">{t.note}</p>}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {c.adminResponse && (
                    <div className="bg-white border border-gray-200 rounded-lg px-3 py-2.5 text-xs text-gray-600">
                      <span className="font-semibold text-gray-500">Admin Response: </span>
                      {c.adminResponse}
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
