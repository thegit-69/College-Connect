import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  IoRibbonOutline,
  IoDownloadOutline,
  IoShieldCheckmarkOutline,
  IoCheckmarkCircle,
} from 'react-icons/io5'
import useCampusStore from '../store/campusStore'
import toast from 'react-hot-toast'

const BADGE_COLORS = {
  gold: 'from-amber-400 to-yellow-500',
  blue: 'from-blue-500 to-indigo-600',
  emerald: 'from-emerald-500 to-teal-600',
  silver: 'from-gray-400 to-gray-500',
}

export default function CertificatesPage() {
  const { certificates } = useCampusStore()
  const [filter, setFilter] = useState('All')

  const categories = ['All', ...new Set(certificates.map((c) => c.category))]
  const filtered =
    filter === 'All' ? certificates : certificates.filter((c) => c.category === filter)

  const handleDownload = (cert) => {
    toast.success(`Downloading "${cert.title}" certificate…`)
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <IoRibbonOutline />
          Certificate Vault
        </h1>
        <p className="text-gray-500 mt-1 text-sm">
          Your verified academic and achievement certificates
        </p>
      </div>

      {/* Category Filter */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
              filter === cat
                ? 'bg-black text-white border-black'
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
            className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow"
          >
            {/* Colored top stripe */}
            <div
              className={`h-1.5 w-full bg-gradient-to-r ${BADGE_COLORS[cert.badgeColor] || BADGE_COLORS.blue}`}
            />

            <div className="p-5">
              {/* Category + Verified */}
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                  {cert.category}
                </span>
                {cert.verified && (
                  <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600">
                    <IoShieldCheckmarkOutline size={12} />
                    Blockchain Verified
                  </span>
                )}
              </div>

              {/* Title */}
              <h3 className="text-sm font-bold text-gray-900 leading-snug mb-1">
                {cert.title}
              </h3>
              <p className="text-xs text-gray-500 mb-3 leading-relaxed">{cert.description}</p>

              {/* Issuer & Date */}
              <div className="grid grid-cols-2 gap-2 text-[11px] text-gray-500 mb-4">
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-0.5">Issued by</p>
                  <p className="text-gray-700">{cert.issuer}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-0.5">Date</p>
                  <p className="text-gray-700">{cert.issuedDate}</p>
                </div>
              </div>

              {/* Signatories */}
              <div className="flex gap-3 mb-4">
                {cert.signatories.map((sig) => (
                  <div key={sig.name} className="text-[10px] leading-tight">
                    <p className="font-bold text-gray-700">{sig.name}</p>
                    <p className="text-gray-400">{sig.title}</p>
                  </div>
                ))}
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                <div>
                  <p className="text-[10px] text-gray-400">Cert No.</p>
                  <p className="text-[11px] font-mono font-bold text-gray-600">{cert.certNumber}</p>
                </div>
                <button
                  onClick={() => handleDownload(cert)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-900 text-white text-xs font-semibold rounded-lg hover:bg-gray-700 transition-colors"
                >
                  <IoDownloadOutline size={13} />
                  Download
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16 text-gray-400 text-sm bg-white border border-gray-200 rounded-xl">
          <IoRibbonOutline size={32} className="mx-auto mb-3 opacity-50" />
          No certificates in this category
        </div>
      )}
    </div>
  )
}
