import Groq from 'groq-sdk'

const PRIMARY_MODEL = 'openai/gpt-oss-20b'
const FALLBACK_MODEL = 'qwen/qwen3.8-27b'

/**
 * Vercel Serverless Function: /api/chat
 * Securely proxies chat requests to Groq using server-side GROQ_API_KEY
 */
export default async function handler(req, res) {
  // 1. Only allow HTTP POST requests
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST'])
    return res.status(405).json({
      error: `Method ${req.method} Not Allowed. Please use POST.`,
    })
  }

  // 2. Retrieve GROQ_API_KEY from environment variables
  const apiKey = process.env.GROQ_API_KEY
  if (!apiKey || apiKey.trim() === '') {
    console.error('Server Configuration Error: GROQ_API_KEY is not defined in server environment.')
    return res.status(500).json({
      error: 'GROQ_API_KEY is not configured in server environment variables.',
    })
  }

  try {
    // 3. Extract payload from request body
    const { message, messages, systemPrompt, prompt, model } = req.body || {}

    let chatMessages = []

    if (Array.isArray(messages) && messages.length > 0) {
      chatMessages = messages
    } else if (typeof message === 'string' && message.trim()) {
      chatMessages = [
        ...(systemPrompt ? [{ role: 'system', content: systemPrompt }] : []),
        { role: 'user', content: message.trim() },
      ]
    } else if (typeof prompt === 'string' && prompt.trim()) {
      chatMessages = [{ role: 'user', content: prompt.trim() }]
    } else {
      return res.status(400).json({
        error: 'Bad Request: "message", "prompt", or a "messages" array is required.',
      })
    }

    // 4. Initialize Groq SDK client
    const groq = new Groq({ apiKey })

    // 5. Try primary model, fallback if unavailable/rate-limited
    const modelsToAttempt = model ? [model] : [PRIMARY_MODEL, FALLBACK_MODEL]
    let lastError = null
    let completion = null
    let usedModel = PRIMARY_MODEL

    for (const currentModel of modelsToAttempt) {
      try {
        completion = await groq.chat.completions.create({
          model: currentModel,
          messages: chatMessages,
          temperature: 0.7,
          max_tokens: 800,
        })
        usedModel = currentModel
        break
      } catch (err) {
        lastError = err
        console.warn(`Groq model ${currentModel} failed, trying fallback:`, err.message)
      }
    }

    if (!completion) {
      throw lastError || new Error('All configured Groq models failed to respond.')
    }

    const reply = completion.choices?.[0]?.message?.content || ''

    return res.status(200).json({
      reply,
      content: reply,
      usage: completion.usage,
      model: usedModel,
    })
  } catch (error) {
    console.error('Groq Serverless Handler Error:', error)
    return res.status(500).json({
      error: error.message || 'An error occurred while communicating with Groq API.',
    })
  }
}
