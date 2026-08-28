import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  IoSparkles,
  IoSendOutline,
  IoTrashOutline,
  IoHeartOutline,
  IoHappyOutline,
  IoSchoolOutline,
  IoTimeOutline,
} from 'react-icons/io5'
import useCampusStore from '../store/campusStore'
import useAuthStore from '../store/authStore'
import { askGroqChatbot } from '../services/groqAiService'
import toast from 'react-hot-toast'

const QUICK_PROMPTS = [
  { label: '📊 Check Attendance Shortage', text: 'Which of my subjects currently have an attendance shortage below 75%?' },
  { label: '🧘 Exam Stress Relief', text: 'I am feeling overwhelmed with upcoming exams. Can you give me a 5-minute grounding strategy?' },
  { label: '📅 Today\'s Class Timetable', text: 'What is my class timetable and lecture schedule for today?' },
  { label: '📝 Pending Assignments', text: 'What assignments are due soon and what should I prioritize?' },
  { label: '👩‍🏫 Mentor Cabin Details', text: 'Who is my faculty mentor and how can I contact them?' },
  { label: '💡 Study Motivation', text: 'Give me a quick productivity boost and advice on how to study effectively today.' },
]

export default function AIAssistantPage() {
  const { user } = useAuthStore()
  const {
    studentProfile,
    subjects,
    assignments,
    timetable,
    moodLogs,
    aiChatMessages,
    addAiMessage,
    clearAiChat,
    setMoodModalOpen,
  } = useCampusStore()

  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [aiChatMessages, isTyping])

  const latestMood = moodLogs && moodLogs.length > 0 ? moodLogs[0] : null

  const handleSend = async (textToSend) => {
    const queryText = (textToSend || input).trim()
    if (!queryText || isTyping) return

    setInput('')

    const userMessage = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text: queryText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }

    const updatedHistory = [...aiChatMessages, userMessage]
    addAiMessage(userMessage)
    setIsTyping(true)

    try {
      // Call Groq API with live campus student context
      const aiResponse = await askGroqChatbot({
        messages: updatedHistory,
        studentProfile,
        subjects,
        assignments,
        timetable,
        moodHistory: moodLogs,
      })

      addAiMessage({
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: aiResponse,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      })
    } catch (error) {
      console.error('Groq AI error:', error)
      toast.error('AI response error: ' + error.message)
      addAiMessage({
        id: `ai-err-${Date.now()}`,
        sender: 'ai',
        text: `⚠️ I encountered a temporary connection issue while querying Groq. Please try again in a moment. (Error: ${error.message})`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      })
    } finally {
      setIsTyping(false)
    }
  }

  const renderFormattedMarkdown = (content) => {
    return content.split('\n').map((line, idx) => {
      // Handle list items
      if (line.startsWith('• ') || line.startsWith('- ') || line.startsWith('* ')) {
        const itemText = line.substring(2)
        return (
          <li key={idx} className="ml-4 list-disc text-[13px] my-0.5">
            {formatBold(itemText)}
          </li>
        )
      }
      return (
        <p key={idx} className={idx > 0 ? 'mt-1.5 text-[13px]' : 'text-[13px]'}>
          {formatBold(line)}
        </p>
      )
    })
  }

  const formatBold = (str) => {
    return str.split(/(\*\*[^*]+\*\*)/).map((part, index) =>
      part.startsWith('**') && part.endsWith('**') ? (
        <strong key={index} className="font-bold text-gray-950 dark:text-white">
          {part.slice(2, -2)}
        </strong>
      ) : (
        part
      )
    )
  }

  return (
    <div className="max-w-3xl mx-auto flex flex-col h-[calc(100vh-100px)] space-y-3 font-sans">
      {/* Header with Groq LLaMA 3.3 Badge & Mood Pill */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-gray-200 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 via-orange-500 to-indigo-600 text-white flex items-center justify-center shadow-xs">
            <IoSparkles size={20} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-bold text-gray-950 font-display">
                Campus AI & Wellbeing Advisor
              </h1>
              <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 bg-orange-100 text-orange-800 border border-orange-200 rounded-md">
                Groq AI High-Speed
              </span>
            </div>
            <p className="text-xs text-gray-500">
              Live intelligence with your timetable, attendance, & mental wellness support.
            </p>
          </div>
        </div>

        {/* Mood Check-In Quick Pill */}
        <div className="flex items-center gap-2">
          {latestMood ? (
            <button
              onClick={() => setMoodModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-full text-xs font-semibold transition-colors"
            >
              <span>{latestMood.emoji}</span>
              <span>Mood: {latestMood.label}</span>
            </button>
          ) : (
            <button
              onClick={() => setMoodModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-pink-50 hover:bg-pink-100 text-pink-700 border border-pink-200 rounded-full text-xs font-semibold transition-colors"
            >
              <IoHeartOutline />
              <span>Log Today's Mood</span>
            </button>
          )}

          <button
            onClick={clearAiChat}
            className="p-2 text-gray-400 hover:text-red-600 hover:bg-gray-100 rounded-lg transition-colors"
            title="Clear Chat History"
          >
            <IoTrashOutline size={16} />
          </button>
        </div>
      </div>

      {/* Chat Messages Container */}
      <div className="flex-1 overflow-y-auto bg-gray-50/80 rounded-2xl border border-gray-200 p-4 sm:p-5 space-y-4 shadow-inner">
        {aiChatMessages.map((msg) => (
          <motion.div
            key={msg.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] sm:max-w-[80%] px-4 py-3 rounded-2xl text-xs sm:text-sm leading-relaxed shadow-xs ${
                msg.sender === 'user'
                  ? 'bg-gray-950 text-white rounded-br-xs'
                  : 'bg-white text-gray-800 border border-gray-200/90 rounded-bl-xs'
              }`}
            >
              {msg.sender === 'ai' && (
                <div className="flex items-center justify-between gap-2 mb-1.5 pb-1 border-b border-gray-100">
                  <div className="flex items-center gap-1 text-amber-600 font-bold text-[10px]">
                    <IoSparkles size={11} />
                    <span>Campus Advisor</span>
                  </div>
                  <span className="text-[9px] text-gray-400 font-mono">Realtime Groq</span>
                </div>
              )}

              <div className="text-gray-800 leading-relaxed">
                {renderFormattedMarkdown(msg.text)}
              </div>

              <p
                className={`text-[9px] mt-1.5 text-right ${
                  msg.sender === 'user' ? 'text-gray-400' : 'text-gray-400'
                }`}
              >
                {msg.time}
              </p>
            </div>
          </motion.div>
        ))}

        {/* Typing indicator */}
        <AnimatePresence>
          {isTyping && (
            <motion.div
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex justify-start"
            >
              <div className="bg-white border border-gray-200 rounded-2xl px-4 py-3 text-xs text-gray-500 flex items-center gap-2 shadow-xs">
                <IoSparkles className="text-amber-500 animate-spin" />
                <span>Groq AI is analyzing your campus context...</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div ref={bottomRef} />
      </div>

      {/* Quick Prompts Carousel */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
        {QUICK_PROMPTS.map((qp, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(qp.text)}
            className="flex-shrink-0 text-xs px-3 py-1.5 bg-white border border-gray-200 text-gray-700 hover:border-gray-900 hover:text-black rounded-full transition-all shadow-2xs font-medium whitespace-nowrap"
          >
            {qp.label}
          </button>
        ))}
      </div>

      {/* Input Box */}
      <div className="flex items-center gap-2 bg-white p-1.5 rounded-2xl border border-gray-200 shadow-xs focus-within:ring-2 focus-within:ring-black">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Ask Groq about your attendance, exam stress, timetable, or mentor..."
          className="flex-1 px-3 py-2 text-xs sm:text-sm text-gray-900 bg-transparent focus:outline-none placeholder:text-gray-400"
        />
        <button
          onClick={() => handleSend()}
          disabled={!input.trim() || isTyping}
          className="p-2.5 bg-black hover:bg-gray-800 text-white rounded-xl disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-xs"
        >
          <IoSendOutline size={16} />
        </button>
      </div>
    </div>
  )
}
