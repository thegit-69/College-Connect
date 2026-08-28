import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  IoHeartOutline,
  IoSparkles,
  IoCalendarOutline,
  IoWaterOutline,
  IoPlayOutline,
  IoPauseOutline,
  IoCallOutline,
  IoShieldCheckmarkOutline,
  IoFlameOutline,
  IoLeafOutline,
} from 'react-icons/io5'
import { HiOutlineSparkles, HiOutlineHeart } from 'react-icons/hi2'
import useCampusStore from '../store/campusStore'
import useAuthStore from '../store/authStore'
import { MOOD_LEVELS } from '../services/groqAiService'

const SOUNDSCAPES = [
  { id: 'rain', name: 'Gentle Rain', emoji: '🌧️', desc: 'Calming rain on campus rooftops', freq: 280 },
  { id: 'waves', name: 'Ocean Waves', emoji: '🌊', desc: 'Rhythmic rolling sea breeze', freq: 220 },
  { id: 'forest', name: 'Pine Forest', emoji: '🌲', desc: 'Rustling leaves and gentle wind', freq: 350 },
  { id: 'whitenoise', name: 'Study Lo-Fi Focus', emoji: '☕', desc: 'Deep concentration brown noise', freq: 160 },
]

export default function WellnessPage() {
  const { user } = useAuthStore()
  const { moodLogs, setMoodModalOpen } = useCampusStore()
  const [activeTab, setActiveTab] = useState('breathing') // 'breathing' | 'grounding' | 'sounds' | 'helplines'

  // Breathing state
  const [isBreathingActive, setIsBreathingActive] = useState(false)
  const [breathPhase, setBreathPhase] = useState('Inhale') // Inhale (4s) -> Hold (4s) -> Exhale (4s) -> Hold (4s)
  const [breathTimer, setBreathTimer] = useState(4)

  // Grounding technique step
  const [groundingStep, setGroundingStep] = useState(0)

  // Web Audio Synth for ambient sound generator
  const [playingSound, setPlayingSound] = useState(null)
  const [audioCtx, setAudioCtx] = useState(null)
  const [oscillatorNode, setOscillatorNode] = useState(null)

  // Box Breathing cycle
  useEffect(() => {
    let interval = null
    if (isBreathingActive) {
      interval = setInterval(() => {
        setBreathTimer((prev) => {
          if (prev <= 1) {
            setBreathPhase((current) => {
              if (current === 'Inhale') return 'Hold'
              if (current === 'Hold') return 'Exhale'
              if (current === 'Exhale') return 'Rest'
              return 'Inhale'
            })
            return 4
          }
          return prev - 1
        })
      }, 1000)
    } else {
      setBreathPhase('Inhale')
      setBreathTimer(4)
    }

    return () => clearInterval(interval)
  }, [isBreathingActive])

  // Simple Synthesizer Audio Generator for ambient sounds (zero external file dependency)
  const toggleSound = (sound) => {
    if (playingSound === sound.id) {
      if (oscillatorNode) {
        try {
          oscillatorNode.stop()
        } catch (e) {}
      }
      setPlayingSound(null)
      return
    }

    if (oscillatorNode) {
      try {
        oscillatorNode.stop()
      } catch (e) {}
    }

    const ctx = audioCtx || new (window.AudioContext || window.webkitAudioContext)()
    if (!audioCtx) setAudioCtx(ctx)

    // Generate gentle soothing ambient pink/brown tone
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = 'sine'
    osc.frequency.setValueAtTime(sound.freq, ctx.currentTime)

    gain.gain.setValueAtTime(0.04, ctx.currentTime)
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.start()

    setOscillatorNode(osc)
    setPlayingSound(sound.id)
  }

  // Cleanup audio on unmount
  useEffect(() => {
    return () => {
      if (oscillatorNode) {
        try {
          oscillatorNode.stop()
        } catch (e) {}
      }
    }
  }, [oscillatorNode])

  const groundingSteps = [
    { num: '5', title: 'Look Around You', instruction: 'Name 5 things you can see right now (e.g., your laptop, water bottle, window, desk light, hands).' },
    { num: '4', title: 'Physical Touch', instruction: 'Touch 4 distinct textures around you (e.g., your cotton shirt, the smooth tabletop, your keyboard, cool metal).' },
    { num: '3', title: 'Listen Closely', instruction: 'Listen for 3 distinct sounds (e.g., distant AC hum, footsteps, bird outside, your own steady breath).' },
    { num: '2', title: 'Notice Scents', instruction: 'Identify 2 things you can smell (e.g., coffee, fresh breeze, book paper).' },
    { num: '1', title: 'Taste / Emotion', instruction: 'Take one deep breath and notice 1 positive affirmation: "I am safe, capable, and doing my best."' },
  ]

  const latestMood = moodLogs && moodLogs.length > 0 ? moodLogs[0] : null

  return (
    <div className="max-w-5xl mx-auto space-y-6 font-sans">
      {/* Top Banner */}
      <div className="relative bg-gradient-to-r from-teal-900 via-emerald-900 to-gray-950 rounded-3xl p-6 sm:p-8 text-white overflow-hidden shadow-lg border border-teal-800/50">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-[10px] font-extrabold uppercase tracking-wider text-teal-200 border border-white/15">
              <HiOutlineHeart className="text-pink-300" />
              <span>Campus Mental Health & Wellness Sanctuary</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold font-display tracking-tight text-white">
              Mindfulness & Wellbeing Hub
            </h1>
            <p className="text-xs sm:text-sm text-teal-100/90 leading-relaxed">
              De-stress, log your daily emotional state, practice guided breathing, and access 24/7 student counseling resources.
            </p>
          </div>

          {/* Quick Check-in Card */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
            {latestMood ? (
              <div className="p-3.5 bg-white/15 backdrop-blur-md rounded-2xl border border-white/20 text-center">
                <span className="text-[10px] text-teal-200 font-semibold block uppercase">Today's Mood</span>
                <p className="text-lg font-extrabold text-white mt-0.5">
                  {latestMood.emoji} {latestMood.label}
                </p>
              </div>
            ) : null}

            <button
              onClick={() => setMoodModalOpen(true)}
              className="px-5 py-3.5 bg-white text-teal-950 hover:bg-teal-50 font-bold text-xs rounded-2xl shadow-lg transition-all hover:scale-[1.02] active:scale-95 font-display flex items-center justify-center gap-2"
            >
              <IoHeartOutline className="text-pink-600 text-sm" />
              <span>{latestMood ? 'Update Mood' : 'Log Daily Mood'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex gap-2 overflow-x-auto pb-1 border-b border-gray-200">
        {[
          { id: 'breathing', label: '🌬️ Guided Box Breathing' },
          { id: 'grounding', label: '🧘 5-4-3-2-1 Anxiety Relief' },
          { id: 'sounds', label: '🎧 Focus Soundscapes' },
          { id: 'journal', label: '📊 Mood Journey & Reflections' },
          { id: 'helplines', label: '📞 24/7 Crisis Support' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === tab.id
                ? 'bg-black text-white shadow-xs'
                : 'bg-white text-gray-600 hover:text-black hover:bg-gray-100 border border-gray-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB 1: GUIDED BREATHING */}
      {activeTab === 'breathing' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 bg-white rounded-3xl border border-gray-200 p-8 flex flex-col items-center justify-center text-center shadow-xs min-h-[380px]">
            <div className="relative flex items-center justify-center w-56 h-56 my-4">
              {/* Animated Expanding Breathing Circle */}
              <motion.div
                animate={{
                  scale: isBreathingActive
                    ? breathPhase === 'Inhale'
                      ? 1.35
                      : breathPhase === 'Hold' || breathPhase === 'Rest'
                      ? 1.35
                      : 0.8
                    : 1,
                }}
                transition={{ duration: 4, ease: 'easeInOut' }}
                className="w-40 h-40 rounded-full bg-gradient-to-tr from-teal-400 to-emerald-500/80 shadow-2xl opacity-80 flex items-center justify-center text-white"
              />

              <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-950 pointer-events-none">
                <span className="text-xs font-bold uppercase tracking-widest text-teal-800">
                  {isBreathingActive ? breathPhase : 'Ready'}
                </span>
                <span className="text-4xl font-extrabold font-display my-1">
                  {isBreathingActive ? breathTimer : '4s'}
                </span>
                <span className="text-[10px] text-gray-600 font-medium">
                  {breathPhase === 'Inhale' ? 'Breathe In Deeply' : breathPhase === 'Hold' ? 'Hold Gently' : breathPhase === 'Exhale' ? 'Release Slowly' : 'Rest'}
                </span>
              </div>
            </div>

            <div className="mt-4 flex items-center gap-3">
              <button
                onClick={() => setIsBreathingActive(!isBreathingActive)}
                className={`px-6 py-3 rounded-2xl font-bold text-xs shadow-sm transition-all ${
                  isBreathingActive
                    ? 'bg-red-50 text-red-700 border border-red-200 hover:bg-red-100'
                    : 'bg-black text-white hover:bg-gray-800'
                }`}
              >
                {isBreathingActive ? 'Pause Exercise' : 'Start 4-4-4 Box Breathing'}
              </button>
            </div>
          </div>

          <div className="bg-[#fafafa] rounded-3xl border border-gray-200 p-6 space-y-4">
            <h3 className="text-sm font-bold text-gray-950 font-display flex items-center gap-2">
              <IoLeafOutline className="text-emerald-600" />
              <span>The Science of Box Breathing</span>
            </h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Box Breathing (used by Navy SEALs and athletes) activates the parasympathetic nervous system, lowering heart rate and acute cortisol levels in under 2 minutes.
            </p>
            <div className="space-y-2 text-xs text-gray-700 pt-2 border-t border-gray-200">
              <p>• <strong>Inhale (4s):</strong> Fill lungs through nose.</p>
              <p>• <strong>Hold (4s):</strong> Retain breath gently.</p>
              <p>• <strong>Exhale (4s):</strong> Smooth exhale through mouth.</p>
              <p>• <strong>Rest (4s):</strong> Lungs empty before next cycle.</p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: GROUNDING TECHNIQUE */}
      {activeTab === 'grounding' && (
        <div className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-8 space-y-6 shadow-xs">
          <div className="text-center max-w-xl mx-auto space-y-1">
            <span className="text-[10px] font-extrabold uppercase tracking-wider px-3 py-1 bg-amber-50 text-amber-800 border border-amber-200 rounded-full">
              Instant Panic & Anxiety Relief
            </span>
            <h2 className="text-xl font-bold font-display text-gray-950">
              5-4-3-2-1 Sensory Grounding Technique
            </h2>
            <p className="text-xs text-gray-500">
              Follow these 5 sensory steps to bring your awareness back to the present moment during study stress.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
            {groundingSteps.map((step, idx) => {
              const isCurrent = groundingStep === idx
              return (
                <div
                  key={idx}
                  onClick={() => setGroundingStep(idx)}
                  className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
                    isCurrent
                      ? 'border-black bg-gray-950 text-white shadow-md scale-102'
                      : 'border-gray-200 bg-gray-50 hover:bg-gray-100 text-gray-800'
                  }`}
                >
                  <div>
                    <div className={`w-8 h-8 rounded-xl font-extrabold text-sm flex items-center justify-center mb-2 ${
                      isCurrent ? 'bg-white text-black' : 'bg-gray-200 text-gray-700'
                    }`}>
                      {step.num}
                    </div>
                    <h4 className="text-xs font-bold">{step.title}</h4>
                    <p className={`text-[11px] mt-1 leading-relaxed ${isCurrent ? 'text-gray-300' : 'text-gray-500'}`}>
                      {step.instruction}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>

          <div className="flex justify-between items-center pt-2">
            <button
              disabled={groundingStep === 0}
              onClick={() => setGroundingStep((prev) => Math.max(0, prev - 1))}
              className="px-4 py-2 text-xs font-semibold rounded-xl border border-gray-200 disabled:opacity-30"
            >
              Previous Step
            </button>
            <button
              onClick={() => setGroundingStep((prev) => (prev + 1) % groundingSteps.length)}
              className="px-5 py-2 text-xs font-bold rounded-xl bg-black text-white hover:bg-gray-800"
            >
              {groundingStep === groundingSteps.length - 1 ? 'Finish & Ground' : 'Next Step →'}
            </button>
          </div>
        </div>
      )}

      {/* TAB 3: FOCUS SOUNDSCAPES */}
      {activeTab === 'sounds' && (
        <div className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-8 space-y-6 shadow-xs">
          <div>
            <h2 className="text-lg font-bold font-display text-gray-950">
              Ambient Focus & Relaxation Soundscapes
            </h2>
            <p className="text-xs text-gray-500">
              Harmonic sound frequencies generated directly in your browser to mask campus noise during deep study.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {SOUNDSCAPES.map((sound) => {
              const isPlaying = playingSound === sound.id
              return (
                <div
                  key={sound.id}
                  className={`p-5 rounded-2xl border transition-all ${
                    isPlaying
                      ? 'border-emerald-500 bg-emerald-50/50 shadow-sm'
                      : 'border-gray-200 bg-gray-50/80 hover:bg-gray-100'
                  }`}
                >
                  <div className="text-3xl mb-2">{sound.emoji}</div>
                  <h4 className="text-sm font-bold text-gray-950">{sound.name}</h4>
                  <p className="text-xs text-gray-500 mt-1">{sound.desc}</p>

                  <button
                    onClick={() => toggleSound(sound)}
                    className={`mt-4 w-full py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                      isPlaying
                        ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                        : 'bg-black text-white hover:bg-gray-800'
                    }`}
                  >
                    {isPlaying ? <IoPauseOutline size={16} /> : <IoPlayOutline size={16} />}
                    <span>{isPlaying ? 'Playing Tone' : 'Play Soundscape'}</span>
                  </button>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* TAB 4: MOOD LOGS & AI REFLECTIONS */}
      {activeTab === 'journal' && (
        <div className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-8 space-y-6 shadow-xs">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold font-display text-gray-950">
                Your Mood History & AI Reflections
              </h2>
              <p className="text-xs text-gray-500">
                Daily emotional check-ins synced to Cloud Firestore.
              </p>
            </div>
            <button
              onClick={() => setMoodModalOpen(true)}
              className="px-4 py-2 bg-black text-white rounded-xl text-xs font-bold hover:bg-gray-800 transition-colors"
            >
              + New Entry
            </button>
          </div>

          <div className="space-y-3">
            {moodLogs.map((log) => (
              <div
                key={log.id}
                className="p-4 rounded-2xl bg-gray-50/90 border border-gray-200 flex flex-col sm:flex-row items-start justify-between gap-4"
              >
                <div className="flex items-start gap-3">
                  <div className="text-3xl p-2 bg-white rounded-2xl border border-gray-200 shadow-xs">
                    {log.emoji}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-gray-950">{log.label} (Level {log.level}/5)</span>
                      <span className="text-[10px] text-gray-400 font-mono">{log.date}</span>
                    </div>
                    {log.note && (
                      <p className="text-xs text-gray-700 mt-1 italic font-medium">"{log.note}"</p>
                    )}
                    {log.tags && log.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {log.tags.map((t) => (
                          <span key={t} className="text-[9px] px-2 py-0.5 rounded-md bg-white border border-gray-200 text-gray-600 font-semibold">
                            {t}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {log.aiAdvice && (
                  <div className="sm:max-w-xs p-3 bg-emerald-50/80 border border-emerald-200/80 rounded-xl text-xs text-emerald-950 space-y-1">
                    <div className="flex items-center gap-1 font-bold text-emerald-800 text-[10px]">
                      <IoSparkles className="text-amber-500" />
                      <span>Groq AI Guidance</span>
                    </div>
                    <p className="leading-tight text-[11px]">{log.aiAdvice}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: CRISIS & COUNSELING HELPLINES */}
      {activeTab === 'helplines' && (
        <div className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-8 space-y-6 shadow-xs">
          <div>
            <h2 className="text-lg font-bold font-display text-gray-950">
              Emergency & Campus Support Directory
            </h2>
            <p className="text-xs text-gray-500">
              You are never alone. Confidential, 24/7 support is available at your fingertips.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-5 rounded-2xl bg-rose-50/70 border border-rose-200 space-y-3">
              <div className="flex items-center gap-2 text-rose-800 font-bold text-sm">
                <IoCallOutline className="text-lg" />
                <span>Tele-MANAS National Mental Health Helpline</span>
              </div>
              <p className="text-xs text-rose-900 leading-relaxed">
                24/7 Toll-Free, confidential crisis counseling support across all states and regional languages.
              </p>
              <div className="flex items-center gap-2 pt-1">
                <a
                  href="tel:14416"
                  className="px-4 py-2 bg-rose-600 text-white rounded-xl text-xs font-bold hover:bg-rose-700 transition-colors shadow-xs"
                >
                  Dial 14416 (Toll-Free)
                </a>
                <span className="text-xs text-rose-700 font-mono">or 1800-891-4416</span>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-teal-50/70 border border-teal-200 space-y-3">
              <div className="flex items-center gap-2 text-teal-900 font-bold text-sm">
                <IoShieldCheckmarkOutline className="text-lg text-teal-600" />
                <span>Campus Student Wellbeing Cell</span>
              </div>
              <p className="text-xs text-teal-900 leading-relaxed">
                On-campus certified psychological counselors located in Student Center Block A, Room 104.
              </p>
              <div className="flex items-center gap-2 pt-1">
                <a
                  href="tel:080-2441-9922"
                  className="px-4 py-2 bg-teal-800 text-white rounded-xl text-xs font-bold hover:bg-teal-900 transition-colors shadow-xs"
                >
                  Call Campus Clinic (Ext 4401)
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
