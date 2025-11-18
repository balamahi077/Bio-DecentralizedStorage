# 🏗️ System Architecture - Face Recognition Authentication

## 📊 High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        USER'S BROWSER                           │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │              Frontend (Vite + TypeScript)                │   │
│  │  • Landing Page  • Login Page  • Register Page          │   │
│  │  • App Page (IPFS Storage)  • Auth Service              │   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                              ↕ HTTP/HTTPS
┌─────────────────────────────────────────────────────────────────┐
│                    Backend API Server                           │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │           Express.js + TypeScript                        │   │
│  │  • Authentication Routes  • JWT Generation              │   │
│  │  • User Management  • Protected Routes                  │   │
│  └─────────────────────────────────────────────────────────┘   │
│                              ↕                                  │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                    MongoDB Database                      │   │
│  │  • User Collection  • Face Encodings  • Sessions        │   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                              ↕ HTTP
┌─────────────────────────────────────────────────────────────────┐
│                    Raspberry Pi Server                          │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │              Flask + Python                              │   │
│  │  • Face Detection  • Face Encoding  • Verification      │   │
│  └─────────────────────────────────────────────────────────┘   │
│                              ↕                                  │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │            Raspberry Pi Camera Module                    │   │
│  │  • Image Capture  • Real-time Processing                │   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🔄 Data Flow Diagrams

### Registration Flow

```
┌──────────┐
│  User    │
└────┬─────┘
     │ 1. Enter username & email
     ↓
┌──────────────┐
│  Frontend    │
└──────┬───────┘
       │ 2. POST /api/auth/register
       ↓
┌──────────────┐
│   Backend    │
└──────┬───────┘
       │ 3. Create user in MongoDB
       ↓
┌──────────────┐
│   MongoDB    │ User: { username, email, faceEncodings: [] }
└──────────────┘
       │
       │ 4. Return userId
       ↓
┌──────────────┐
│  Frontend    │ Show face capture interface
└──────┬───────┘
       │ 5. User clicks "Capture Face" (3 times)
       ↓
┌──────────────┐
│  Frontend    │
└──────┬───────┘
       │ 6. POST /api/auth/register/capture-face
       │    { userId, angleNumber: 1/2/3 }
       ↓
┌──────────────┐
│   Backend    │
└──────┬───────┘
       │ 7. POST /capture to Raspberry Pi
       ↓
┌──────────────┐
│ Raspberry Pi │
└──────┬───────┘
       │ 8. Capture image from camera
       │ 9. Detect face (OpenCV)
       │ 10. Generate 128-d encoding
       ↓
┌──────────────┐
│   Backend    │
└──────┬───────┘
       │ 11. Store encoding in MongoDB
       ↓
┌──────────────┐
│   MongoDB    │ User: { faceEncodings: [[...], [...], [...]] }
└──────────────┘
       │
       │ 12. Repeat for 3 angles
       ↓
┌──────────────┐
│  Frontend    │ Registration Complete!
└──────────────┘
```

### Login Flow

```
┌──────────┐
│  User    │
└────┬─────┘
     │ 1. Enter username
     ↓
┌──────────────┐
│  Frontend    │
└──────┬───────┘
       │ 2. POST /api/auth/login { username }
       ↓
┌──────────────┐
│   Backend    │
└──────┬───────┘
       │ 3. Find user in MongoDB
       ↓
┌──────────────┐
│   MongoDB    │ Return: { faceEncodings: [[...], [...], [...]] }
└──────┬───────┘
       │ 4. Send encodings to Raspberry Pi
       ↓
┌──────────────┐
│ Raspberry Pi │
└──────┬───────┘
       │ 5. Capture current face
       │ 6. Generate encoding
       │ 7. Compare with stored encodings
       │ 8. Calculate confidence score
       ↓
┌──────────────┐
│   Backend    │
└──────┬───────┘
       │ 9. If match: Generate JWT token
       ↓
┌──────────────┐
│  Frontend    │ Store token, redirect to landing page
└──────────────┘
```

---

## 🗄️ Database Schema

### User Collection (MongoDB)

```javascript
{
  _id: ObjectId("..."),
  username: "john",
  email: "john@example.com",
  passwordHash: null,  // Optional
  faceEncodings: [
    [0.123, -0.456, 0.789, ...],  // 128 numbers (Angle 1)
    [0.234, -0.567, 0.890, ...],  // 128 numbers (Angle 2)
    [0.345, -0.678, 0.901, ...]   // 128 numbers (Angle 3)
  ],
  faceImagePaths: [
    "/home/pi/face_data/user_id/face_angle_1_20231023_120000.jpg",
    "/home/pi/face_data/user_id/face_angle_2_20231023_120005.jpg",
    "/home/pi/face_data/user_id/face_angle_3_20231023_120010.jpg"
  ],
  registrationComplete: true,
  createdAt: ISODate("2023-10-23T12:00:00Z"),
  lastLogin: ISODate("2023-10-23T14:30:00Z")
}
```

---

## 🔐 Authentication Flow

### JWT Token Structure

```javascript
{
  // Header
  "alg": "HS256",
  "typ": "JWT",
  
  // Payload
  "userId": "user_mongodb_id",
  "username": "john",
  "email": "john@example.com",
  "iat": 1698067200,  // Issued at
  "exp": 1698153600   // Expires in 24 hours
}
```

### Token Storage

```
Browser localStorage:
├── authToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
├── username: "john"
└── email: "john@example.com"
```

---

## 🎯 Component Interactions

### Frontend Components

```
main.ts (Entry Point)
├── renderLandingPage()
│   ├── If authenticated: Show username + logout
│   └── If not: Show login/register buttons
│
├── renderLoginPage()
│   ├── Username input
│   ├── Face verification button
│   └── Status messages
│
├── renderRegisterPage()
│   ├── Step 1: User info form
│   └── Step 2: Face capture (3 angles)
│
└── renderAppPage() [Protected]
    ├── Wallet connection
    ├── IPFS upload
    └── File management
```

### Backend Routes

```
/api/auth
├── GET  /health              → Check system status
├── POST /register            → Create user account
├── POST /register/capture-face → Capture face angle
├── POST /login               → Verify face & login
└── GET  /profile [Protected] → Get user profile
```

### Raspberry Pi Endpoints

```
Flask Server (Port 5000)
├── GET  /health        → Camera status
├── POST /capture       → Capture & encode face
├── POST /verify        → Verify face match
└── GET  /test-camera   → Test camera
```

---

## 🔬 Face Recognition Process

### Face Encoding Generation

```
1. Camera captures image (640x480)
   ↓
2. Convert BGR to RGB
   ↓
3. Detect face locations (HOG/CNN)
   ↓
4. Extract face region
   ↓
5. Generate 128-dimensional encoding
   ↓
6. Return encoding as array
```

### Face Verification

```
1. Capture current face
   ↓
2. Generate encoding
   ↓
3. Compare with stored encodings (3 angles)
   ↓
4. Calculate distances
   ↓
5. Find best match
   ↓
6. Check if distance < tolerance (0.6)
   ↓
7. Return match result + confidence
```

---

## 🌐 Network Communication

### HTTP Requests

```
Frontend → Backend:
├── POST /api/auth/register
├── POST /api/auth/register/capture-face
├── POST /api/auth/login
└── GET  /api/auth/profile (with JWT header)

Backend → Raspberry Pi:
├── POST /capture
└── POST /verify

Backend → MongoDB:
├── Create user
├── Update user (add face encodings)
├── Find user
└── Update last login
```

---

## 📦 Technology Stack Details

### Frontend Stack
```
Vite 7.x
├── TypeScript 5.x
├── Custom CSS
├── TailwindCSS 4.x
└── Ethers.js 6.x (for blockchain)
```

### Backend Stack
```
Node.js 18+
├── Express.js 4.x
├── TypeScript 5.x
├── Mongoose 8.x (MongoDB ODM)
├── jsonwebtoken 9.x
├── bcryptjs 2.x
├── axios 1.x
└── cors 2.x
```

### Raspberry Pi Stack
```
Python 3.7+
├── Flask 3.x
├── face_recognition 1.3.x
├── OpenCV 4.x
├── NumPy 1.24.x
└── Pillow 10.x
```

---

## 🔄 State Management

### Frontend State

```javascript
// Global state
let currentAccount = ''  // MetaMask wallet
let signer = null        // Ethers signer

// localStorage
{
  authToken: 'JWT token',
  username: 'john',
  email: 'john@example.com'
}
```

### Backend State

```javascript
// In-memory (per request)
- JWT payload (decoded)
- User session data

// Persistent (MongoDB)
- User records
- Face encodings
- Login history
```

---

## 🛡️ Security Layers

```
┌─────────────────────────────────────┐
│  Layer 1: HTTPS/TLS Encryption      │
├─────────────────────────────────────┤
│  Layer 2: JWT Token Authentication  │
├─────────────────────────────────────┤
│  Layer 3: Face Biometric Verification│
├─────────────────────────────────────┤
│  Layer 4: MongoDB Access Control    │
├─────────────────────────────────────┤
│  Layer 5: Local Face Processing     │
└─────────────────────────────────────┘
```

---

## 📊 Performance Metrics

### Response Times
```
Registration:
├── Create user: ~100ms
├── Face capture (per angle): ~2-3s
└── Total registration: ~10-15s

Login:
├── User lookup: ~50ms
├── Face verification: ~2-3s
└── JWT generation: ~10ms

Protected Routes:
├── JWT verification: ~5ms
└── Database query: ~50ms
```

### Resource Usage
```
Backend:
├── RAM: ~100MB
├── CPU: ~5% idle, ~20% active
└── Storage: ~10MB (code)

Raspberry Pi:
├── RAM: ~200MB
├── CPU: ~30% during capture
└── Storage: ~500MB (face data)

MongoDB:
├── RAM: ~100MB
├── Storage: ~50MB per 1000 users
└── Connections: 1-10 concurrent
```

---

## 🔧 Configuration Files

### Backend Config
```
backend/
├── .env              → Environment variables
├── tsconfig.json     → TypeScript config
└── package.json      → Dependencies
```

### Frontend Config
```
web/
├── .env              → API URL, Pinata JWT
├── vite.config.ts    → Vite configuration
├── tsconfig.json     → TypeScript config
└── package.json      → Dependencies
```

### Raspberry Pi Config
```
raspberry-pi/
├── face_server.py    → Main config at top
└── requirements.txt  → Python packages
```

---

## 🎯 Deployment Architecture

### Development
```
Localhost:
├── Frontend: http://localhost:5173
├── Backend: http://localhost:3000
├── MongoDB: mongodb://localhost:27017
└── Raspberry Pi: http://192.168.1.100:5000
```

### Production (Recommended)
```
Cloud:
├── Frontend: Vercel/Netlify (CDN)
├── Backend: Railway/Heroku/AWS
├── MongoDB: MongoDB Atlas (cloud)
└── Raspberry Pi: Home network + VPN/ngrok
```

---

This architecture provides a **secure, scalable, and maintainable** face recognition authentication system! 🎉
