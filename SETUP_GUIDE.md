# 🚀 Bio-DecentralizedStorage - Complete Setup Guide

## 📋 Prerequisites

- ✅ Windows PC with Node.js and MongoDB installed
- ✅ Raspberry Pi with USB webcam
- ✅ Both devices on the same network

---

## 🎯 Quick Start (3 Steps)

### Step 1: Start Raspberry Pi Face Server

**SSH into your Raspberry Pi:**

```bash
cd ~/Bio-DecentralizedStorage/raspberry-pi
python3 face_server.py
```

**Expected output:**
```
✅ Camera initialized successfully
🚀 Starting Flask server...
 * Running on http://10.254.8.14:5000
```

**Keep this terminal running!**

---

### Step 2: Configure Backend

**On your PC, update the Raspberry Pi IP in backend/.env:**

```bash
cd d:\change\Bio-DecentralizedStorage\backend
```

**Edit `.env` file and set:**
```
RASPBERRY_PI_URL=http://10.254.8.14:5000
```

*(Replace `10.254.8.14` with your actual Raspberry Pi IP)*

---

### Step 3: Start Backend and Frontend

**Terminal 1 - Backend:**
```bash
cd d:\change\Bio-DecentralizedStorage\backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd d:\change\Bio-DecentralizedStorage\web
npm run dev
```

---

## ✅ Verify Setup

### Test 1: Raspberry Pi Health
```
http://10.254.8.14:5000/health
```
Expected: `{"status":"ok","camera":"connected"}`

### Test 2: Backend Health
```
http://localhost:3000/api/auth/health
```
Expected: `{"status":"ok","raspberryPi":"ok","camera":"connected"}`

### Test 3: Frontend
```
http://localhost:5173
```
Should show the landing page.

---

## 👤 Register Your First User

1. Open: `http://localhost:5173`
2. Click **"Register New Account"**
3. Enter username and email
4. Click **"Next: Capture Face"**
5. Look at camera → Click **"Capture Face"** (3 times for different angles)
6. Click **"Complete Registration"**

---

## 🔧 Troubleshooting

### Issue: Backend can't reach Raspberry Pi

**Check firewall on Raspberry Pi:**
```bash
sudo ufw status
# If active:
sudo ufw disable
```

**Verify Raspberry Pi is reachable:**
```bash
# From PC:
ping 10.254.8.14
Test-NetConnection -ComputerName 10.254.8.14 -Port 5000
```

### Issue: Camera not working on Raspberry Pi

**Test camera:**
```bash
python3 -c "import cv2; c=cv2.VideoCapture(0); print('✅ Works' if c.isOpened() else '❌ Failed'); c.release()"
```

**Fix permissions:**
```bash
sudo chmod 666 /dev/video0
sudo usermod -a -G video $USER
```

### Issue: Port 3000 already in use

**Kill the process:**
```bash
netstat -ano | findstr :3000
taskkill /F /PID <PID>
```

---

## 📁 Project Structure

```
Bio-DecentralizedStorage/
├── backend/           # Node.js/Express API
├── web/              # React frontend
├── contracts/        # Blockchain smart contracts
├── raspberry-pi/     # Face recognition server
└── mock-pi-server/   # Mock server for testing
```

---

## 🎉 Success Checklist

- [ ] Raspberry Pi face server running
- [ ] Backend shows: `🥧 Raspberry Pi URL: http://10.254.8.14:5000`
- [ ] Frontend accessible at `http://localhost:5173`
- [ ] Health check shows all services connected
- [ ] Successfully registered a test user
- [ ] Successfully logged in with face recognition

---

## 🚨 Common Errors

### 500 Error on Face Capture

**Cause:** Backend can't reach Raspberry Pi

**Fix:**
1. Check Raspberry Pi face server is running
2. Disable firewall: `sudo ufw disable`
3. Verify IP in backend/.env is correct
4. Restart backend

### EADDRINUSE Error

**Cause:** Port already in use

**Fix:**
```bash
netstat -ano | findstr :3000
taskkill /F /PID <PID>
npm run dev
```

### Camera Disconnected

**Cause:** USB webcam not detected

**Fix:**
```bash
ls -l /dev/video*
sudo chmod 666 /dev/video0
```

---

## 📞 Need Help?

1. Check Raspberry Pi terminal for errors
2. Check backend terminal for connection errors
3. Verify all services are running
4. Test each endpoint individually

---

**Once all services are running, you're ready to use face recognition authentication!** 🎊
