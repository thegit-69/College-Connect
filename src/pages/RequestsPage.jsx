import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  IoDocumentTextOutline,
  IoAddCircleOutline,
  IoCheckmarkCircle,
  IoTimeOutline,
  IoCloseCircleOutline,
  IoChevronDownOutline,
} from 'react-icons/io5'
import useCampusStore from '../store/campusStore'
import toast from 'react-hot-toast'

// Gate pass removed; keep Bonafide, OD, Medical Leave, Hostel Leave
const REQUEST_TYPES = [
  'On-Duty (OD)',
  'Medical Leave',
  'Bonafide Certificate',
  'Hostel Leave',
  'Library Card Request',
  'Duplicate ID Card',
]

const STATUS_STYLES = {
  Approved: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  Pending: 'bg-amber-50 text-amber-700 border-amber-200',
  Rejected: 'bg-red-50 text-red-600 border-red-200',
  Processing: 'bg-blue-50 text-blue-700 border-blue-200',
}

const STATUS_ICONS = {
  Approved: <IoCheckmarkCircle size={14} />,
  Pending: <IoTimeOutline size={14} />,
  Rejected: <IoCloseCircleOutline size={14} />,
}

export default function RequestsPage() {
  const { requests, addRequest } = useCampusStore()

  // Filter out gate passes (user directive)
  const filteredRequests = requests.filter(
    (r) => !r.type?.toLowerCase().includes('gate pass') && !r.type?.toLowerCase().includes('hostel gate')
  )

  const [showForm, setShowForm] = useState(false)
  const [expandedId, setExpandedId] = useState(null)
  const [form, setForm] = useState({
    type: REQUEST_TYPES[0],
    purpose: '',
    startDate: '',
    endDate: '',
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.purpose.trim()) {
      toast.error('Please fill in the purpose')
      return
    }
    addRequest({
      id: `REQ-${Date.now()}`,
      ...form,
      status: 'Pending',
      appliedAt: new Date().toISOString().split('T')[0],
      reviewer: 'Academic Office',
      comments: '',
      attachments: [],
    })
    setForm({ type: REQUEST_TYPES[0], purpose: '', startDate: '', endDate: '' })
    setShowForm(false)
    toast.success('Request submitted successfully!')
  }

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Requests</h1>
          <p className="text-gray-500 mt-1 text-sm">
            Submit and track your campus requests
          </p>
        </div>
        <button
          onClick={() => setShowForm((v) => !v)}
          className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-xl text-sm font-semibold hover:bg-gray-800 transition-colors"
        >
          <IoAddCircleOutline size={16} />
          New Request
        </button>
      </div>

      {/* New Request Form */}
      <AnimatePresence>
        {showForm && (
          <motion.form
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            onSubmit={handleSubmit}
            className="bg-white border border-gray-200 rounded-xl p-5 mb-5 overflow-hidden"
          >
            <p className="text-sm font-bold text-gray-900 mb-4">New Request</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                  Request Type
                </label>
                <select
                  value={form.type}
                  onChange={(e) => setForm({ ...form, type: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-black"
                >
                  {REQUEST_TYPES.map((t) => (
                    <option key={t}>{t}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                  Start Date
                </label>
                <input
                  type="date"
                  value={form.startDate}
                  onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                  End Date
                </label>
                <input
                  type="date"
                  value={form.endDate}
                  onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                  Purpose / Reason
                </label>
                <textarea
                  value={form.purpose}
                  onChange={(e) => setForm({ ...form, purpose: e.target.value })}
                  placeholder="Briefly describe the reason for this request…"
                  rows={3}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-black resize-none"
                />
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-black text-white text-sm font-semibold rounded-lg hover:bg-gray-800 transition-colors"
              >
                Submit Request
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      {/* Request List */}
      <div className="space-y-3">
        {filteredRequests.length === 0 && (
          <div className="text-center py-16 text-gray-400 text-sm bg-white border border-gray-200 rounded-xl">
            <IoDocumentTextOutline size={32} className="mx-auto mb-3 opacity-50" />
            No requests submitted yet
          </div>
        )}
        {filteredRequests.map((req, i) => (
          <motion.div
            key={req.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-sm transition-shadow"
          >
            <button
              className="w-full text-left p-5"
              onClick={() => setExpandedId(expandedId === req.id ? null : req.id)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-bold text-gray-900">{req.type}</p>
                      <span
                        className={`flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                          STATUS_STYLES[req.status] || STATUS_STYLES.Pending
                        }`}
                      >
                        {STATUS_ICONS[req.status]}
                        {req.status}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5">{req.purpose}</p>
                    <p className="text-[11px] text-gray-400 mt-0.5">
                      Applied: {req.appliedAt} · ID: {req.id}
                    </p>
                  </div>
                </div>
                <IoChevronDownOutline
                  size={16}
                  className={`text-gray-400 transition-transform flex-shrink-0 ${
                    expandedId === req.id ? 'rotate-180' : ''
                  }`}
                />
              </div>
            </button>

            {/* Expanded Details */}
            <AnimatePresence>
              {expandedId === req.id && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="border-t border-gray-100 px-5 py-4 bg-gray-50 space-y-2"
                >
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                    {req.startDate && (
                      <div>
                        <p className="text-gray-400 font-semibold uppercase tracking-wide text-[10px]">From</p>
                        <p className="text-gray-700 font-medium">{req.startDate}</p>
                      </div>
                    )}
                    {req.endDate && (
                      <div>
                        <p className="text-gray-400 font-semibold uppercase tracking-wide text-[10px]">To</p>
                        <p className="text-gray-700 font-medium">{req.endDate}</p>
                      </div>
                    )}
                    <div>
                      <p className="text-gray-400 font-semibold uppercase tracking-wide text-[10px]">Reviewer</p>
                      <p className="text-gray-700 font-medium">{req.reviewer || '—'}</p>
                    </div>
                  </div>
                  {req.comments && (
                    <div className="bg-white border border-gray-200 rounded-lg px-3 py-2.5 text-xs text-gray-600">
                      <span className="font-semibold text-gray-500">Remarks: </span>
                      {req.comments}
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
