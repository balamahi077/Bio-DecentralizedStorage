import express, { Request, Response } from 'express'
import axios from 'axios'
import jwt from 'jsonwebtoken'
import User from '../models/User'

const router = express.Router()

const RASPBERRY_PI_URL = process.env.RASPBERRY_PI_URL || 'http://10.254.8.14:5000'
const JWT_SECRET = process.env.JWT_SECRET || 'default-secret-change-this'

// Health check
router.get('/health', async (req: Request, res: Response) => {
  try {
    // Check Raspberry Pi connection with longer timeout
    const piResponse = await axios.get(`${RASPBERRY_PI_URL}/health`, { 
      timeout: 10000,
      validateStatus: () => true  // Accept any status code
    })
    
    res.json({
      status: 'ok',
      backend: 'connected',
      raspberryPi: piResponse.data.status,
      camera: piResponse.data.camera
    })
  } catch (error: any) {
    console.error('Health check error:', error.message)
    res.json({
      status: 'partial',
      backend: 'connected',
      raspberryPi: 'disconnected',
      error: `Cannot reach Raspberry Pi: ${error.message}`
    })
  }
})

// Register - Step 1: Create user account
router.post('/register', async (req: Request, res: Response) => {
  try {
    const { username, email } = req.body
    
    // Validation
    if (!username || !email) {
      return res.status(400).json({ error: 'Username and email are required' })
    }
    
    if (username.length < 3 || username.length > 30) {
      return res.status(400).json({ error: 'Username must be 3-30 characters' })
    }
    
    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ username }, { email }]
    })
    
    if (existingUser) {
      return res.status(400).json({
        error: existingUser.username === username
          ? 'Username already taken'
          : 'Email already registered'
      })
    }
    
    // Create new user (without face data yet)
    const user = new User({
      username,
      email,
      faceEncodings: [],
      faceImagePaths: [],
      registrationComplete: false
    })
    
    await user.save()
    
    res.json({
      success: true,
      userId: user._id,
      message: 'User created successfully. Now capture face images.'
    })
    
  } catch (error: any) {
    console.error('Registration error:', error)
    res.status(500).json({ error: 'Registration failed. Please try again.' })
  }
})

// Register - Step 2: Capture face image (called 3 times for different angles)
router.post('/register/capture-face', async (req: Request, res: Response) => {
  try {
    const { userId, angleNumber } = req.body
    
    if (!userId || !angleNumber) {
      return res.status(400).json({ error: 'userId and angleNumber are required' })
    }
    
    // Find user
    const user = await User.findById(userId)
    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }
    
    // Check if already captured 3 angles
    if (user.faceEncodings.length >= 3) {
      return res.status(400).json({ error: 'Already captured 3 face angles' })
    }
    
    console.log(`📸 Requesting Raspberry Pi to capture face angle ${angleNumber} for user ${user.username}`)
    
    // Request Raspberry Pi to capture and encode face
    const piResponse = await axios.post(
      `${RASPBERRY_PI_URL}/capture`,
      { userId: userId.toString(), angleNumber },
      { timeout: 30000 }
    )
    
    if (!piResponse.data.success) {
      return res.status(400).json({
        error: piResponse.data.error || 'Face capture failed'
      })
    }
    
    const { imagePath, faceEncoding } = piResponse.data
    
    // Update user with face data
    user.faceEncodings.push(faceEncoding)
    user.faceImagePaths.push(imagePath)
    
    // Mark registration complete if 3 angles captured
    if (user.faceEncodings.length === 3) {
      user.registrationComplete = true
    }
    
    await user.save()
    
    res.json({
      success: true,
      message: `Face angle ${angleNumber} captured successfully`,
      capturedAngles: user.faceEncodings.length,
      registrationComplete: user.registrationComplete
    })
    
  } catch (error: any) {
    console.error('Face capture error:', error)
    
    if (error.code === 'ECONNREFUSED') {
      return res.status(503).json({
        error: 'Cannot connect to Raspberry Pi. Please check if it is running.'
      })
    }
    
    res.status(500).json({
      error: error.response?.data?.error || 'Face capture failed. Please try again.'
    })
  }
})

// Login - Verify face and authenticate
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { username } = req.body
    
    if (!username) {
      return res.status(400).json({ error: 'Username is required' })
    }
    
    // Find user
    const user = await User.findOne({ username })
    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }
    
    // Check if registration is complete
    if (!user.registrationComplete || user.faceEncodings.length === 0) {
      return res.status(400).json({
        error: 'Face registration not complete. Please complete registration first.'
      })
    }
    
    console.log(`🔐 Verifying face for user ${username}`)
    
    // Request Raspberry Pi to capture current face and verify
    const piResponse = await axios.post(
      `${RASPBERRY_PI_URL}/verify`,
      {
        userId: user._id?.toString(),
        storedEncodings: user.faceEncodings
      },
      { timeout: 30000 }
    )
    
    const { match, confidence, message } = piResponse.data
    
    if (!match) {
      return res.status(401).json({
        error: 'Face verification failed. Face does not match.',
        confidence: confidence ? (confidence * 100).toFixed(1) + '%' : 'N/A'
      })
    }
    
    // Face verified! Generate JWT token
    const token = jwt.sign(
      {
        userId: user._id,
        username: user.username,
        email: user.email
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    )
    
    // Update last login
    user.lastLogin = new Date()
    await user.save()
    
    res.json({
      success: true,
      token,
      user: {
        username: user.username,
        email: user.email,
        lastLogin: user.lastLogin
      },
      confidence: confidence ? (confidence * 100).toFixed(1) + '%' : 'N/A',
      message: 'Login successful! Face verified.'
    })
    
  } catch (error: any) {
    console.error('Login error:', error)
    
    if (error.code === 'ECONNREFUSED') {
      return res.status(503).json({
        error: 'Cannot connect to Raspberry Pi. Please check if it is running.'
      })
    }
    
    res.status(500).json({
      error: error.response?.data?.error || 'Login failed. Please try again.'
    })
  }
})

// Verify JWT token (middleware for protected routes)
export function verifyToken(req: any, res: Response, next: any) {
  const token = req.headers.authorization?.split(' ')[1]
  
  if (!token) {
    return res.status(401).json({ error: 'No token provided' })
  }
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET)
    req.user = decoded
    next()
  } catch (error) {
    res.status(401).json({ error: 'Invalid or expired token' })
  }
}

// Get user profile (protected route)
router.get('/profile', verifyToken, async (req: any, res: Response) => {
  try {
    const user = await User.findById(req.user.userId).select('-faceEncodings -passwordHash')
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }
    
    res.json({
      username: user.username,
      email: user.email,
      registrationComplete: user.registrationComplete,
      capturedAngles: user.faceEncodings.length,
      createdAt: user.createdAt,
      lastLogin: user.lastLogin
    })
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch profile' })
  }
})

export default router
