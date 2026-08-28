import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  IoCloseOutline,
  IoSparkles,
  IoHeartOutline,
  IoCheckmarkCircle,
} from 'react-icons/io5'
import useCampusStore from '../../store/campusStore'
import useAuthStore from '../../store/authStore'
import { MOOD_LEVELS, getGroqMoodReflection } from '../../services/groqAiService'
import toast from 'react-hot-toast'

const TAG_OPTIONS = [
  'Exams & Tests',
  'Assignments',
  'Sleep Quality',
  'Coding & Labs',
  'Friends & Social',
  'Health & Energy',
  'Campus Life',
]

export default function MoodCheckInModal({ isOpen, onClose }) {
  const { user } = useAuthStore()
  const { addMoodLog } = useCampusStore()
  const [selectedLevel, setSelectedLevel] = useState(4)
  const [selectedTags, setSelectedTags] = useState(['Campus Life'])
  const [note, setNote] = useState('')
  const [loading, setLoading] = useState(false)
  const [aiReflection, setAiReflection] = useState(null)
  const [submitted, setSubmitted] = useState(false)

  if (!isOpen) return null

  const handleTagToggle = (tag) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag))
    } else {
      setSelectedTags([...selectedTags, tag])
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    const moodObj = MOOD_LEVELS.find((m) => m.level === selectedLevel) || MOOD_LEVELS[2]
    const todayStr = new Date().toISOString().split('T')[0]

    try {
      // 1. Get Groq AI instant reflection
      const reflection = await getGroqMoodReflection(selectedLevel, selectedTags, note)
      setAiReflection(reflection)

      // 2. Save mood log
      const newLog = {
        id: `mood-${todayStr}-${Date.now()}`,
        date: todayStr,
        level: selectedLevel,
        label: moodObj.label,
        emoji: moodObj.emoji,
        tags: selectedTags,
        note: note.trim(),
        aiAdvice: reflection || 'Take time to breathe and nurture your mental wellbeing today.',
        createdAt: new Date().toISOString(),
      }

      await addMoodLog(newLog)
      localStorage.setItem(`campus_mood_checked_${user?.uid || 'guest'}`, todayStr)
      setSubmitted(true)
      toast.success(`Mood logged: ${moodObj.emoji} ${moodObj.label}`)
    } catch (err) {
      console.error('Mood logging error:', err)
      toast.error('Failed to log mood.')
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    setSubmitted(false)
    setAiReflection(null)
    onClose()
  }

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
          className="fixed inset-0 bg-black/60 backdrop-blur-xs"
        />

        {/* Modal Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 16 }}
          className="relative w-full max-w-lg bg-white rounded-3xl border border-gray-200 shadow-2xl overflow-hidden z-10 text-gray-900"
        >
          {/* Header Banner */}
          <div className="relative bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-700 p-6 text-white flex items-start justify-between">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/20 backdrop-blur-md text-[10px] font-bold uppercase tracking-wider mb-1.5">
                <IoHeartOutline className="text-pink-200" />
                <span>Daily Student Check-In</span>
              </div>
              <h2 className="text-xl font-bold font-display">How are you feeling today?</h2>
              <p className="text-xs text-emerald-100 mt-0.5">
                Your wellbeing matters. Checking in helps personalize your AI advisor.
              </p>
            </div>

            <button
              onClick={handleClose}
              className="p-1 rounded-lg bg-white/10 hover:bg-white/20 transition-colors text-white"
            >
              <IoCloseOutline size={20} />
            </button>
          </div>

          <div className="p-6">
            {!submitted ? (
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* 5-Mood Rating Selector */}
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2.5">
                    Select Your Mood (1 to 5)
                  </label>

                  <div className="grid grid-cols-5 gap-2">
                    {MOOD_LEVELS.map((m) => {
                      const isSelected = selectedLevel === m.level
                      return (
                        <button
                          key={m.level}
                          type="button"
                          onClick={() => setSelectedLevel(m.level)}
                          className={`flex flex-col items-center justify-center p-2.5 sm:p-3 rounded-2xl border-2 transition-all group ${
                            isSelected
                              ? 'border-gray-950 bg-gray-950 text-white shadow-md scale-105'
                              : 'border-gray-200 hover:border-gray-300 bg-gray-50 hover:bg-gray-100 text-gray-800'
                          }`}
                        >
                          <span className="text-2xl sm:text-3xl mb-1 group-hover:scale-110 transition-transform">
                            {m.emoji}
                          </span>
                          <span className="text-[10px] font-bold leading-tight truncate">
                            {m.label}
                          </span>
                          <span className="text-[9px] opacity-70">
                            {m.level}/5
                          </span>
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* Tags Selector */}
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                    What is influencing your mood today?
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {TAG_OPTIONS.map((tag) => {
                      const isSelected = selectedTags.includes(tag)
                      return (
                        <button
                          key={tag}
                          type="button"
                          onClick={() => handleTagToggle(tag)}
                          className={`px-3 py-1 text-xs font-semibold rounded-full border transition-colors ${
                            isSelected
                              ? 'bg-black text-white border-black'
                              : 'bg-gray-100 text-gray-600 border-gray-200 hover:bg-gray-200'
                          }`}
                        >
                          {tag}
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* Optional Note / Journal Prompt */}
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                    Quick Thought or Note (Optional)
                  </label>
                  <textarea
                    rows={2}
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Anything on your mind? e.g., Preparing for tomorrow's lab presentation..."
                    className="w-full text-xs p-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-black resize-none bg-gray-50/70 placeholder:text-gray-400"
                  />
                </div>

                {/* Submit Action */}
                <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={handleClose}
                    className="px-4 py-2 text-xs font-semibold text-gray-500 hover:text-gray-900 rounded-xl transition-colors"
                  >
                    Skip for now
                  </button>

                  <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex items-center gap-2 px-6 py-2.5 bg-black hover:bg-gray-800 text-white font-bold text-xs rounded-xl shadow-xs transition-all disabled:opacity-60"
                  >
                    <IoSparkles className="text-amber-300" />
                    <span>{loading ? 'Analyzing with AI...' : 'Save & Get Insights'}</span>
                  </button>
                </div>
              </form>
            ) : (
              /* Post-submission AI Insight Card */
              <div className="space-y-4 text-center py-2">
                <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto text-2xl">
                  <IoCheckmarkCircle />
                </div>

                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-gray-950 font-display">
                    Thank you for checking in, {user?.displayName?.split(' ')[0] || 'Alex'}!
                  </h3>
                  <p className="text-xs text-gray-500">
                    Your mood log has been saved to your campus wellness journey.
                  </p>
                </div>

                {/* Groq AI Reflection Message */}
                {aiReflection && (
                  <div className="p-4 bg-emerald-50/80 border border-emerald-200 rounded-2xl text-left space-y-1.5">
                    <div className="flex items-center gap-1.5 text-emerald-800 text-xs font-bold">
                      <IoSparkles className="text-amber-500" />
                      <span>Groq AI Daily Affirmation</span>
                    </div>
                    <p className="text-xs text-emerald-950 leading-relaxed">
                      {aiReflection}
                    </p>
                  </div>
                )}

                <div className="pt-2">
                  <button
                    onClick={handleClose}
                    className="w-full py-2.5 bg-black hover:bg-gray-800 text-white font-bold text-xs rounded-xl transition-colors shadow-xs"
                  >
                    Continue to Dashboard
                  </button>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
