import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { connectDatabase } from './config/database'
import authRoutes from './routes/auth'

// Load environment variables
dotenv.config()

const app = express()
const PORT = process.env.PORT || 3000
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173'

// Middleware
app.use(cors({
  origin: FRONTEND_URL,
  credentials: true
}))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Request logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`)
  next()
})

// Routes
app.use('/api/auth', authRoutes)

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Bio-DecentralizedStorage Backend API',
    version: '1.0.0',
    endpoints: {
      health: '/api/auth/health',
      register: '/api/auth/register',
      captureFace: '/api/auth/register/capture-face',
      login: '/api/auth/login',
      profile: '/api/auth/profile'
    }
  })
})

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' })
})

// Error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err)
  res.status(500).json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  })
})

// Start server
async function startServer() {
  try {
    // Connect to database
    await connectDatabase()
    
    // Start listening
    app.listen(PORT, () => {
      console.log(`\n🚀 Backend server running on http://localhost:${PORT}`)
      console.log(`📡 Frontend URL: ${FRONTEND_URL}`)
      console.log(`🥧 Raspberry Pi URL: ${process.env.RASPBERRY_PI_URL || 'Not configured'}`)
      console.log(`\n✅ Server is ready!\n`)
    })
  } catch (error) {
    console.error('Failed to start server:', error)
    process.exit(1)
  }
}

startServer()
