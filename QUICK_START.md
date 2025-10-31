# ⚡ Quick Start Guide - Face Recognition Auth

## 🚀 Get Started in 5 Minutes

### Prerequisites
- ✅ Node.js 18+ installed
- ✅ MongoDB installed
- ✅ Raspberry Pi with camera (for face recognition)

---

## 📦 Installation

### 1. Setup Backend (2 minutes)
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your Raspberry Pi IP
```

### 2. Setup Frontend (1 minute)
```bash
cd web
npm install
```

### 3. Setup Raspberry Pi (2 minutes)
```bash
# On your Pi
cd /home/pi/face-recognition
chmod +x setup.sh
./setup.sh
```

---

## 🎬 Start Services

### Terminal 1: MongoDB
```bash
mongod
```

### Terminal 2: Backend
```bash
cd backend
npm run dev
```

### Terminal 3: Raspberry Pi
```bash
# SSH into Pi
python3 face_server.py
```

### Terminal 4: Frontend
```bash
cd web
npm run dev
```

**Or use the automated script (Windows):**
```bash
start-dev.bat
```

---

## 🌐 Access the App

Open browser: **http://localhost:5173**

---

## 👤 Register Your First User

1. Click **"Register New Account"**
2. Enter username: `john`
3. Enter email: `john@example.com`
4. Click **"Next: Capture Face"**
5. Look at camera → Click **"Capture Face"** (Angle 1)
6. Turn left → Click **"Capture Face"** (Angle 2)
7. Turn right → Click **"Capture Face"** (Angle 3)
8. Click **"Complete Registration"**

---

## 🔐 Login

1. Click **"Login with Face"**
2. Enter username: `john`
3. Click **"Verify Face & Login"**
4. Look at camera
5. ✅ Logged in! Username shown in top-right

---

## 🎯 Access the App

1. Click **"Get Started"**
2. Connect MetaMask wallet
3. Upload files to IPFS
4. Enjoy decentralized storage!

---

## 🔧 Configuration

### Backend `.env`
```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/bio-storage
JWT_SECRET=change-this-to-secure-random-string
RASPBERRY_PI_URL=http://192.168.1.100:5000
FRONTEND_URL=http://localhost:5173
```

### Frontend `.env`
```env
VITE_API_URL=http://localhost:3000/api/auth
VITE_PINATA_JWT=your_pinata_jwt_token
```

---

## 🐛 Quick Troubleshooting

### Backend won't start
```bash
# Check MongoDB
mongosh

# Check port
netstat -ano | findstr :3000
```

### Can't connect to Raspberry Pi
```bash
# Find Pi IP
hostname -I  # On Pi

# Test connection
curl http://PI_IP:5000/health
```

### Face detection fails
- Check lighting (bright room)
- Position face 1-2 feet from camera
- Remove glasses/hat
- Enable camera: `sudo raspi-config`

---

## 📊 System Status

Check if everything is running:

```bash
# Backend health
curl http://localhost:3000/api/auth/health

# Raspberry Pi health
curl http://PI_IP:5000/health

# MongoDB
mongosh
use bio-storage
db.users.find()
```

---

## 🎓 Learn More

- **Full Setup Guide:** `FACE_RECOGNITION_SETUP.md`
- **Features:** `AUTHENTICATION_FEATURES.md`
- **Implementation:** `IMPLEMENTATION_SUMMARY.md`
- **Raspberry Pi:** `raspberry-pi/README.md`

---

## 🆘 Need Help?

1. Check the troubleshooting section above
2. Read `FACE_RECOGNITION_SETUP.md`
3. Review server logs
4. Open an issue on GitHub

---

## ✅ Checklist

Before you start:
- [ ] Node.js installed
- [ ] MongoDB installed and running
- [ ] Raspberry Pi setup complete
- [ ] Camera enabled on Pi
- [ ] `.env` files configured
- [ ] All dependencies installed

Ready to go:
- [ ] Backend running on port 3000
- [ ] Frontend running on port 5173
- [ ] Raspberry Pi server running on port 5000
- [ ] MongoDB connected
- [ ] Browser open to localhost:5173

---

**That's it! You're ready to use face recognition authentication! 🎉**

For detailed instructions, see `FACE_RECOGNITION_SETUP.md`
