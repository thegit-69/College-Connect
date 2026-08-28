import { motion } from 'framer-motion'
import { IoCalendarOutline, IoSparklesOutline, IoArrowForward } from 'react-icons/io5'
import { Link } from 'react-router-dom'
import useCampusStore from '../store/campusStore'

const TYPE_COLORS = {
  Hackathon: 'bg-purple-50 text-purple-700 border-purple-200',
  Workshop: 'bg-blue-50 text-blue-700 border-blue-200',
  'Academic Support': 'bg-amber-50 text-amber-700 border-amber-200',
  'Leadership & Clubs': 'bg-emerald-50 text-emerald-700 border-emerald-200',
}

export default function RecommendationsPage() {
  const { recommendations } = useCampusStore()

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <IoSparklesOutline className="text-amber-400" />
          AI Recommendations
        </h1>
        <p className="text-gray-500 mt-1 text-sm">
          Personalised picks based on your skills, academics & interests
        </p>
      </div>

      {/* Cards */}
      <div className="space-y-4">
        {recommendations.map((rec, i) => (
          <motion.div
            key={rec.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-sm transition-shadow"
          >
            <div className="flex items-start justify-between gap-4">
              {/* Match Score */}
              <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-gray-950 text-white flex flex-col items-center justify-center">
                <span className="text-lg font-extrabold leading-none">{rec.matchScore}</span>
                <span className="text-[9px] text-gray-400 font-semibold">MATCH</span>
              </div>

              {/* Content */}
              <div className="flex-1">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                          TYPE_COLORS[rec.type] || 'bg-gray-100 text-gray-600 border-gray-200'
                        }`}
                      >
                        {rec.type}
                      </span>
                      {rec.urgency && (
                        <span className="text-[10px] text-red-600 font-semibold">
                          ⚡ {rec.urgency}
                        </span>
                      )}
                    </div>
                    <h3 className="text-sm font-bold text-gray-900">{rec.title}</h3>
                  </div>
                </div>

                <p className="text-xs text-gray-500 mt-1">{rec.matchReason}</p>

                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center gap-3 text-[11px] text-gray-400">
                    <span className="flex items-center gap-1">
                      <IoCalendarOutline size={11} />
                      {rec.date}
                    </span>
                    <span className="px-1.5 py-0.5 bg-gray-100 rounded text-gray-500">
                      {rec.mode}
                    </span>
                  </div>
                  <Link
                    to={rec.actionUrl}
                    className="flex items-center gap-1 text-xs font-semibold text-black hover:underline"
                  >
                    View <IoArrowForward size={12} />
                  </Link>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 mt-2.5">
                  {rec.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[10px] px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
