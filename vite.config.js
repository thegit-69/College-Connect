import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [
      react(),
      {
        name: 'vercel-api-dev-middleware',
        configureServer(server) {
          server.middlewares.use('/api/chat', async (req, res) => {
            if (req.method !== 'POST') {
              res.statusCode = 405
              res.setHeader('Content-Type', 'application/json')
              res.end(JSON.stringify({ error: 'Method Not Allowed' }))
              return
            }

            let body = ''
            req.on('data', (chunk) => {
              body += chunk
            })
            req.on('end', async () => {
              try {
                const parsedBody = body ? JSON.parse(body) : {}
                process.env.GROQ_API_KEY =
                  process.env.GROQ_API_KEY || env.GROQ_API_KEY || env.VITE_GROQ_API_KEY

                const { default: handler } = await import('./api/chat.js')
                const mockRes = {
                  setHeader: (key, val) => res.setHeader(key, val),
                  status: (code) => {
                    res.statusCode = code
                    return {
                      json: (data) => {
                        res.setHeader('Content-Type', 'application/json')
                        res.end(JSON.stringify(data))
                      },
                    }
                  },
                }
                const mockReq = {
                  method: req.method,
                  body: parsedBody,
                  headers: req.headers,
                }
                await handler(mockReq, mockRes)
              } catch (err) {
                res.statusCode = 500
                res.setHeader('Content-Type', 'application/json')
                res.end(JSON.stringify({ error: err.message }))
              }
            })
          })
        },
      },
    ],
    resolve: {
      alias: {
        '@': '/src',
      },
    },
  }
})
