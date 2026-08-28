const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions'
const PRIMARY_MODEL = 'openai/gpt-oss-120b'
const FALLBACK_MODELS = ['openai/gpt-oss-20b', 'qwen/qwen3.8-27b']

export const MOOD_LEVELS = [
  { level: 1, label: 'Very Bad', emoji: '😫', color: 'from-rose-500 to-red-600', description: 'Overwhelmed, exhausted, or down' },
  { level: 2, label: 'Bad', emoji: '🙁', color: 'from-orange-500 to-amber-600', description: 'Stressed, anxious, or struggling' },
  { level: 3, label: 'Okay', emoji: '😐', color: 'from-yellow-400 to-amber-500', description: 'Neutral, getting through the day' },
  { level: 4, label: 'Good', emoji: '😊', color: 'from-teal-400 to-emerald-500', description: 'Productive, calm, and positive' },
  { level: 5, label: 'Excellent', emoji: '🤩', color: 'from-blue-500 to-indigo-600', description: 'Energized, motivated, and thriving' },
]

/**
 * Construct system instructions for Groq with rich real-time student and campus context
 */
function buildSystemPrompt(studentProfile, subjects, assignments, timetable, moodHistory = []) {
  const currentDay = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][new Date().getDay()]
  const todayClasses = timetable?.[currentDay] || []
  
  const shortageSubjects = (subjects || []).filter(
    (s) => s.total > 0 && (s.attended / s.total) * 100 < 75
  )
  
  const pendingAssignments = (assignments || []).filter((a) => a.status === 'Pending')
  
  const latestMood = moodHistory && moodHistory.length > 0 ? moodHistory[0] : null
  const moodInfo = latestMood
    ? `Today's Logged Mood: ${latestMood.emoji} ${latestMood.label} (Level ${latestMood.level}/5). Reflection Note: "${latestMood.note || 'None'}". Stress Factors: ${latestMood.tags?.join(', ') || 'None'}.`
    : 'Mood not logged yet today.'

  return `You are "Campus AI Advisor & Wellbeing Companion", an intelligent, empathetic, and highly resourceful AI assistant integrated into the Campus Connect portal for university students.

=== CURRENT STUDENT PROFILE & CONTEXT ===
- Name: ${studentProfile?.name || 'Alex Johnson'} (Roll: ${studentProfile?.rollNo || '21CS042'})
- Department: ${studentProfile?.department || 'Computer Science & Engineering'} (Semester ${studentProfile?.semester || 6}, Section ${studentProfile?.section || 'A'})
- Academic Metrics: CGPA ${studentProfile?.cgpa || 8.42}, Overall Attendance: ${studentProfile?.overallAttendance || 81.5}%
- Faculty Mentor: ${studentProfile?.mentor?.name || 'Dr. Sarah Mitchell'} (${studentProfile?.mentor?.designation || 'Associate Professor'}, Cabin: ${studentProfile?.mentor?.cabin || 'Tech Block 3, Room 402'}, Email: ${studentProfile?.mentor?.email || 'sarah.mitchell@campus.edu'})
- Current Day & Date: ${currentDay}, ${new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
- Today's Classes: ${todayClasses.length > 0 ? todayClasses.map(c => `${c.time}: ${c.subject} (${c.room})`).join('; ') : 'No classes today'}
- Subjects With Attendance Shortage (<75%): ${shortageSubjects.length > 0 ? shortageSubjects.map(s => `${s.name} (${s.code}): ${((s.attended / s.total) * 100).toFixed(1)}% (${s.attended}/${s.total})`).join(', ') : 'None, all subjects are ≥ 75%'}
- Pending Assignments: ${pendingAssignments.length > 0 ? pendingAssignments.map(a => `${a.title} (Due: ${a.dueDate})`).join(', ') : 'None pending'}
- Student Wellness & Mental State: ${moodInfo}

=== BEHAVIOR & GUIDELINES ===
1. You have direct access to their actual timetable, attendance, mentor, CGPA, assignments, and mental health logs above. Answer student questions specifically and accurately using their real data.
2. Tone: Warm, encouraging, concise, highly knowledgeable, and empathetic. Use clean markdown formatting (bullet points, bold text).
3. Mental Health & Wellbeing:
   - If the student expresses anxiety, exam stress, burnout, sadness, or feeling overwhelmed, respond with genuine warmth, validation, practical coping strategies (like 4-7-8 breathing, time blocking, or taking short breaks), and remind them they are supported.
   - If appropriate, suggest campus wellness resources or counselor support without being alarmist.
4. Keep responses crisp and actionable. Avoid unnecessarily long lectures unless requested.`
}

/**
 * Call Groq API with conversation history and live student context
 */
export const askGroqChatbot = async ({
  messages,
  studentProfile,
  subjects,
  assignments,
  timetable,
  moodHistory = [],
}) => {
  const apiKey = import.meta.env.VITE_GROQ_API_KEY
  if (!apiKey || apiKey.trim() === '') {
    throw new Error('Groq API Key is missing. Please set VITE_GROQ_API_KEY in your .env file.')
  }

  const systemPrompt = buildSystemPrompt(studentProfile, subjects, assignments, timetable, moodHistory)

  const formattedMessages = [
    { role: 'system', content: systemPrompt },
    ...messages.map((m) => ({
      role: m.sender === 'user' ? 'user' : 'assistant',
      content: m.text,
    })),
  ]

  const modelsToTry = [PRIMARY_MODEL, ...FALLBACK_MODELS]
  let lastError = null

  for (const model of modelsToTry) {
    try {
      const response = await fetch(GROQ_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model,
          messages: formattedMessages,
          temperature: 0.7,
          max_tokens: 850,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        return data.choices?.[0]?.message?.content || 'I am here to support you with your campus queries.'
      } else {
        const errJson = await response.json().catch(() => ({}))
        lastError = new Error(errJson.error?.message || `Groq error on model ${model} (${response.status})`)
        console.warn(`Model ${model} failed, trying next fallback...`, errJson)
      }
    } catch (err) {
      lastError = err
      console.warn(`Model ${model} network error, trying next fallback...`, err)
    }
  }

  throw lastError || new Error('All Groq models failed to respond.')
}

/**
 * Get an instant personalized AI wellness affirmation & coping advice based on mood
 */
export const getGroqMoodReflection = async (moodLevel, tags = [], note = '') => {
  const apiKey = import.meta.env.VITE_GROQ_API_KEY
  if (!apiKey) return null

  const mood = MOOD_LEVELS.find((m) => m.level === moodLevel) || MOOD_LEVELS[2]

  const prompt = `A college student just logged their daily mood as: ${mood.emoji} ${mood.label} (Level ${mood.level} of 5).
Tags selected: ${tags.join(', ') || 'General'}.
Student note: "${note || 'None'}".

Provide a warm, uplifting, 2-3 sentence personalized encouragement and one gentle mindfulness/academic micro-tip for their day. Keep it supportive and genuine.`

  const modelsToTry = [PRIMARY_MODEL, ...FALLBACK_MODELS]

  for (const model of modelsToTry) {
    try {
      const response = await fetch(GROQ_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model,
          messages: [{ role: 'user', content: prompt }],
          temperature: 0.8,
          max_tokens: 200,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        return data.choices?.[0]?.message?.content
      }
    } catch (e) {
      console.warn(`Mood reflection error on model ${model}:`, e)
    }
  }

  return null
}
