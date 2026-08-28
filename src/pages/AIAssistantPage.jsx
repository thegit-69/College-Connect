import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { IoSparkles, IoSendOutline, IoTrashOutline } from 'react-icons/io5'
import useCampusStore from '../store/campusStore'
import useAuthStore from '../store/authStore'

const QUICK_PROMPTS = [
  'What is my overall attendance?',
  'Which subjects have shortage?',
  'When is my next assignment due?',
  'What is my current CGPA?',
  'Show today\'s timetable',
]

function buildResponse(message, studentProfile, subjects, assignments, timetable) {
  const lower = message.toLowerCase()

  if (lower.includes('attendance') || lower.includes('shortage')) {
    const short = subjects.filter(
      (s) => s.total > 0 && (s.attended / s.total) * 100 < 75
    )
    return short.length > 0
      ? `Your overall attendance is **${studentProfile.overallAttendance}%**.\n\nSubjects with shortage (< 75%):\n${short
          .map((s) => `• **${s.code}** — ${((s.attended / s.total) * 100).toFixed(1)}% (${s.attended}/${s.total})`)
          .join('\n')}`
      : `Great news! Your overall attendance is **${studentProfile.overallAttendance}%** — all subjects are above 75%! 🎉`
  }

  if (lower.includes('cgpa') || lower.includes('gpa') || lower.includes('grade')) {
    return `Your current **CGPA** is **${studentProfile.cgpa}** and last semester **SGPA** was **${studentProfile.currentSgpa}**. Keep it up! 📈`
  }

  if (lower.includes('assignment') || lower.includes('due')) {
    const pending = assignments.filter((a) => a.status === 'Pending')
    return pending.length > 0
      ? `You have **${pending.length} pending assignments**:\n${pending
          .map((a) => `• **${a.title}** — Due: ${a.dueDate}`)
          .join('\n')}`
      : `You have no pending assignments right now. All submissions are up to date! ✅`
  }

  if (lower.includes('timetable') || lower.includes('today') || lower.includes('schedule')) {
    const day = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][new Date().getDay()]
    const classes = timetable[day] || []
    return classes.length > 0
      ? `**${day}'s Schedule:**\n${classes
          .map((c) => `• ${c.time} — **${c.subject}** (${c.room})`)
          .join('\n')}`
      : `No classes scheduled for today (${day}).`
  }

  if (lower.includes('mentor') || lower.includes('hod') || lower.includes('professor')) {
    return `Your academic mentor is **${studentProfile.mentor.name}** (${studentProfile.mentor.designation}).\nCabin: **${studentProfile.mentor.cabin}**\nEmail: ${studentProfile.mentor.email}`
  }

  if (lower.includes('hello') || lower.includes('hi') || lower.includes('hey')) {
    return `Hello, ${studentProfile.name.split(' ')[0]}! 👋 I'm your Campus AI Assistant. You can ask me about your attendance, CGPA, assignments, schedule, or anything campus-related.`
  }

  return `I'm here to help with campus queries! You can ask about:\n• **Attendance** — current percentage & shortages\n• **Academics** — CGPA, SGPA, subjects\n• **Assignments** — pending, due dates\n• **Timetable** — today's or weekly schedule\n• **Mentor** — contact info & cabin\n\nTry asking: *"What is my attendance?"*`
}

export default function AIAssistantPage() {
  const { studentProfile, subjects, assignments, timetable, aiChatMessages, addAiMessage, clearAiChat } = useCampusStore()
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [aiChatMessages, isTyping])

  const sendMessage = (text) => {
    const msg = text || input.trim()
    if (!msg) return
    setInput('')

    const userMsg = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text: msg,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }
    addAiMessage(userMsg)
    setIsTyping(true)

    setTimeout(() => {
      const aiReply = buildResponse(msg, studentProfile, subjects, assignments, timetable)
      addAiMessage({
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: aiReply,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      })
      setIsTyping(false)
    }, 900 + Math.random() * 600)
  }

  const renderText = (text) => {
    // Simple bold markdown renderer
    return text.split('\n').map((line, i) => (
      <p key={i} className={i > 0 ? 'mt-1' : ''}>
        {line.split(/(\*\*[^*]+\*\*)/).map((part, j) =>
          part.startsWith('**') && part.endsWith('**') ? (
            <strong key={j}>{part.slice(2, -2)}</strong>
          ) : (
            part
          )
        )}
      </p>
    ))
  }

  return (
    <div className="max-w-2xl mx-auto flex flex-col h-[calc(100vh-120px)]">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <IoSparkles className="text-amber-400" />
            AI Campus Advisor
          </h1>
          <p className="text-gray-500 text-sm mt-0.5">Ask anything about your academics or campus</p>
        </div>
        <button
          onClick={clearAiChat}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-gray-500 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <IoTrashOutline size={13} />
          Clear
        </button>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto bg-gray-50 rounded-xl border border-gray-200 p-4 space-y-3 mb-3">
        {aiChatMessages.map((msg) => (
          <motion.div
            key={msg.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                msg.sender === 'user'
                  ? 'bg-black text-white rounded-br-sm'
                  : 'bg-white text-gray-800 border border-gray-200 shadow-xs rounded-bl-sm'
              }`}
            >
              {msg.sender === 'ai' && (
                <div className="flex items-center gap-1 mb-1">
                  <IoSparkles size={11} className="text-amber-400" />
                  <span className="text-[10px] text-gray-400 font-semibold">Campus AI</span>
                </div>
              )}
              <div className="text-[13px]">{renderText(msg.text)}</div>
              <p className="text-[10px] mt-1 opacity-50 text-right">{msg.time}</p>
            </div>
          </motion.div>
        ))}

        {/* Typing indicator */}
        <AnimatePresence>
          {isTyping && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex justify-start"
            >
              <div className="bg-white border border-gray-200 rounded-2xl px-4 py-3 text-sm text-gray-400 flex items-center gap-1">
                <span className="animate-bounce">●</span>
                <span className="animate-bounce delay-100">●</span>
                <span className="animate-bounce delay-200">●</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div ref={bottomRef} />
      </div>

      {/* Quick Prompts */}
      <div className="flex gap-2 mb-3 overflow-x-auto pb-1">
        {QUICK_PROMPTS.map((p) => (
          <button
            key={p}
            onClick={() => sendMessage(p)}
            className="flex-shrink-0 text-[11px] px-3 py-1.5 bg-white border border-gray-200 text-gray-600 rounded-full hover:border-gray-400 hover:text-gray-900 transition-colors"
          >
            {p}
          </button>
        ))}
      </div>

      {/* Input */}
      <div className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
          placeholder="Ask about attendance, schedule, assignments…"
          className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-black placeholder-gray-400"
        />
        <button
          onClick={() => sendMessage()}
          disabled={!input.trim()}
          className="px-4 py-2.5 bg-black text-white rounded-xl hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          <IoSendOutline size={16} />
        </button>
      </div>
    </div>
  )
}
