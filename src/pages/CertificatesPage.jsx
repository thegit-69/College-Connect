import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  IoRibbonOutline,
  IoDownloadOutline,
  IoShieldCheckmarkOutline,
  IoEyeOutline,
  IoCloseOutline,
  IoPrintOutline,
} from 'react-icons/io5'
import useCampusStore from '../store/campusStore'
import { generateAndDownloadCertificate } from '../utils/certificateGenerator'
import toast from 'react-hot-toast'

const BADGE_COLORS = {
  gold: 'from-amber-400 to-yellow-500',
  blue: 'from-blue-500 to-indigo-600',
  emerald: 'from-emerald-500 to-teal-600',
  silver: 'from-gray-400 to-gray-500',
}

export default function CertificatesPage() {
  const { certificates, studentProfile } = useCampusStore()
  const [filter, setFilter] = useState('All')
  const [previewCert, setPreviewCert] = useState(null)
  const [downloadingId, setDownloadingId] = useState(null)

  const categories = ['All', ...new Set(certificates.map((c) => c.category))]
  const filtered =
    filter === 'All' ? certificates : certificates.filter((c) => c.category === filter)

  const handleDownload = async (cert) => {
    setDownloadingId(cert.id)
    try {
      await generateAndDownloadCertificate(cert, studentProfile)
      toast.success(`Downloaded "${cert.title}" certificate!`)
    } catch (error) {
      console.error('Certificate download error:', error)
      toast.error('Failed to generate certificate.')
    } finally {
      setDownloadingId(null)
    }
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2 font-display">
            <IoRibbonOutline className="text-amber-500" />
            Certificate Vault
          </h1>
          <p className="text-gray-500 mt-1 text-sm">
            Download and view your official academic & co-curricular achievement credentials.
          </p>
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`flex-shrink-0 px-4 py-2 rounded-xl text-xs font-bold border transition-all ${
              filter === cat
                ? 'bg-black text-white border-black shadow-xs'
                : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Certificate Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filtered.map((cert, i) => (
          <motion.div
            key={cert.id}
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.08 }}
            className="bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-md transition-shadow flex flex-col justify-between"
          >
            {/* Colored top stripe */}
            <div
              className={`h-2 w-full bg-gradient-to-r ${BADGE_COLORS[cert.badgeColor] || BADGE_COLORS.blue}`}
            />

            <div className="p-6 flex-1 flex flex-col justify-between">
              <div>
                {/* Category + Official Credential */}
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider bg-gray-100 px-2 py-0.5 rounded-md">
                    {cert.category}
                  </span>
                  {cert.verified && (
                    <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                      <IoShieldCheckmarkOutline size={12} />
                      Official Credential
                    </span>
                  )}
                </div>

                {/* Title */}
                <h3 className="text-base font-bold text-gray-950 leading-snug mb-1 font-display">
                  {cert.title}
                </h3>
                <p className="text-xs text-gray-500 mb-4 leading-relaxed">{cert.description}</p>

                {/* Issuer & Date */}
                <div className="grid grid-cols-2 gap-2 text-xs text-gray-600 mb-4 p-3 bg-gray-50 rounded-xl border border-gray-100">
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Issued by</p>
                    <p className="text-gray-900 font-semibold truncate">{cert.issuer}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Issue Date</p>
                    <p className="text-gray-900 font-semibold">{cert.issuedDate}</p>
                  </div>
                </div>

                {/* Signatories */}
                <div className="flex gap-4 mb-4 text-xs">
                  {cert.signatories.map((sig) => (
                    <div key={sig.name} className="text-[11px] leading-tight">
                      <p className="font-bold text-gray-800">{sig.name}</p>
                      <p className="text-gray-400 text-[10px]">{sig.title}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions Footer */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-2">
                <div>
                  <p className="text-[10px] text-gray-400 font-semibold">Cert ID</p>
                  <p className="text-[11px] font-mono font-bold text-gray-700">{cert.certNumber}</p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setPreviewCert(cert)}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
                  >
                    <IoEyeOutline size={14} />
                    <span>Preview</span>
                  </button>

                  <button
                    onClick={() => handleDownload(cert)}
                    disabled={downloadingId === cert.id}
                    className="flex items-center gap-1.5 px-4 py-1.5 bg-black hover:bg-gray-800 text-white text-xs font-bold rounded-xl transition-all shadow-xs disabled:opacity-60"
                  >
                    <IoDownloadOutline size={14} />
                    <span>{downloadingId === cert.id ? 'Generating...' : 'Download'}</span>
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16 text-gray-400 text-sm bg-white border border-gray-200 rounded-2xl">
          <IoRibbonOutline size={36} className="mx-auto mb-3 opacity-40" />
          No certificates found in this category
        </div>
      )}

      {/* Certificate Preview Modal */}
      <AnimatePresence>
        {previewCert && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setPreviewCert(null)}
              className="fixed inset-0 bg-black/70 backdrop-blur-xs"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 16 }}
              className="relative w-full max-w-2xl bg-white rounded-3xl border border-gray-200 shadow-2xl overflow-hidden z-10 text-gray-900 p-6 sm:p-8"
            >
              <button
                onClick={() => setPreviewCert(null)}
                className="absolute top-5 right-5 p-2 rounded-full text-gray-400 hover:text-gray-900 hover:bg-gray-100 transition-colors"
              >
                <IoCloseOutline size={20} />
              </button>

              {/* Certificate Template Preview */}
              <div className="border-4 border-gray-900 p-6 sm:p-8 rounded-2xl bg-gradient-to-b from-amber-50/30 via-white to-amber-50/20 text-center relative overflow-hidden">
                <div className="absolute top-2 left-2 right-2 bottom-2 border border-amber-600/40 rounded-xl pointer-events-none" />

                <p className="text-[10px] font-bold tracking-widest text-gray-400 uppercase">
                  Campus Connect University of Technology
                </p>
                <h2 className="text-2xl sm:text-3xl font-black font-display text-gray-950 mt-2">
                  CERTIFICATE OF ACHIEVEMENT
                </h2>
                <p className="text-xs text-gray-500 italic mt-1">This is proudly presented to</p>

                <h3 className="text-xl sm:text-2xl font-extrabold text-blue-900 font-display mt-3">
                  {(studentProfile.name || previewCert.studentName || 'Alex Johnson').toUpperCase()}
                </h3>
                <p className="text-xs text-gray-600 font-medium">
                  Roll No: {studentProfile.rollNo || '21CS042'} • {studentProfile.department}
                </p>

                <div className="my-4 max-w-md mx-auto">
                  <p className="text-xs text-gray-500">for meritorious performance and accomplishment in</p>
                  <p className="text-sm font-bold text-gray-950 mt-1">{previewCert.title}</p>
                  <p className="text-xs text-gray-600 mt-1">{previewCert.description}</p>
                </div>

                {/* Signatures & Seal */}
                <div className="grid grid-cols-3 gap-2 items-center pt-6 mt-4 border-t border-gray-200 text-xs">
                  <div className="text-left">
                    <p className="font-bold text-gray-800">{previewCert.signatories?.[0]?.name}</p>
                    <p className="text-[10px] text-gray-400">{previewCert.signatories?.[0]?.title}</p>
                  </div>

                  <div className="w-16 h-16 mx-auto rounded-full bg-amber-100 border-2 border-amber-500 flex flex-col items-center justify-center text-[8px] font-extrabold text-amber-900 uppercase">
                    <span>Official</span>
                    <span>Seal</span>
                  </div>

                  <div className="text-right">
                    <p className="font-bold text-gray-800">{previewCert.signatories?.[1]?.name}</p>
                    <p className="text-[10px] text-gray-400">{previewCert.signatories?.[1]?.title}</p>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-[10px] text-gray-400">
                  <span>No: {previewCert.certNumber}</span>
                  <span>Issued: {previewCert.issuedDate}</span>
                </div>
              </div>

              {/* Modal Actions */}
              <div className="flex items-center justify-end gap-3 mt-6">
                <button
                  onClick={() => setPreviewCert(null)}
                  className="px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
                >
                  Close
                </button>
                <button
                  onClick={() => handleDownload(previewCert)}
                  className="inline-flex items-center gap-2 px-6 py-2.5 bg-black hover:bg-gray-800 text-white text-xs font-bold rounded-xl shadow-xs transition-all"
                >
                  <IoDownloadOutline size={15} />
                  <span>Download Certificate Image</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
