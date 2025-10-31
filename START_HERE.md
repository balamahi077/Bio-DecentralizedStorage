# ⚡ START HERE - Face Recognition Setup

## 🎯 Current Status

❌ **Raspberry Pi face server is NOT running**  
✅ Backend is configured correctly  
✅ Frontend is ready  

---

## 🚀 Step-by-Step Instructions

### **STEP 1: Start Raspberry Pi Face Server**

**On your Raspberry Pi (SSH into it):**

```bash
# Navigate to project
cd ~/Bio-DecentralizedStorage/raspberry-pi

# Start face server
python3 face_server.py
```

**You MUST see this output:**
```
🥧 Raspberry Pi Face Recognition Server
✅ Camera initialized successfully
🚀 Starting Flask server...
 * Running on http://10.254.8.14:5000
```

**⚠️ IMPORTANT: Keep this terminal window open!**

---

### **STEP 2: Verify Raspberry Pi is Working**

**From your PC browser, open:**
```
http://10.254.8.14:5000/health
```

**Expected response:**
```json
{
  "status": "ok",
  "camera": "connected",
  "timestamp": "..."
}
```

**If you get an error:**
- Face server is not running → Go back to Step 1
- Firewall blocking → Run on Pi: `sudo ufw disable`
- Wrong IP → Check Pi's IP with: `hostname -I`

---

### **STEP 3: Start Backend**

**On your PC:**

```powershell
cd d:\change\Bio-DecentralizedStorage\backend

# Kill any existing backend process
netstat -ano | findstr :3000
# If you see a PID, kill it:
taskkill /F /PID <PID>

# Start backend
npm run dev
```

**You MUST see:**
```
🥧 Raspberry Pi URL: http://10.254.8.14:5000
✅ Server is ready!
```

---

### **STEP 4: Start Frontend**

**On your PC (new terminal):**

```powershell
cd d:\change\Bio-DecentralizedStorage\web
npm run dev
```

**You MUST see:**
```
➜  Local:   http://localhost:5173/
```

---

### **STEP 5: Test Everything**

**Open these URLs in your browser:**

1. **Raspberry Pi:** http://10.254.8.14:5000/health
   - Should show: `{"status":"ok","camera":"connected"}`

2. **Backend:** http://localhost:3000/api/auth/health
   - Should show: `{"status":"ok","raspberryPi":"ok","camera":"connected"}`

3. **Frontend:** http://localhost:5173
   - Should show: Landing page with "Register" button

**If ALL THREE work, proceed to Step 6!**

---

### **STEP 6: Register a User**

1. Open: http://localhost:5173
2. Click **"Register New Account"**
3. Enter:
   - Username: `test`
   - Email: `test@example.com`
4. Click **"Next: Capture Face"**
5. **Look at the camera** on your Raspberry Pi
6. Click **"Capture Face"** button
7. **Turn head slightly left** → Click **"Capture Face"** again
8. **Turn head slightly right** → Click **"Capture Face"** again
9. Click **"Complete Registration"**

**Success!** You should see: "Registration successful!"

---

## 🔧 Troubleshooting

### ❌ Can't access http://10.254.8.14:5000/health

**Problem:** Raspberry Pi face server not running

**Solution:**
```bash
# On Raspberry Pi:
cd ~/Bio-DecentralizedStorage/raspberry-pi
python3 face_server.py
```

### ❌ Backend shows "raspberryPi":"disconnected"

**Problem:** Backend can't reach Raspberry Pi

**Solution:**
```bash
# On Raspberry Pi, disable firewall:
sudo ufw disable

# Restart face server:
python3 face_server.py
```

### ❌ 500 Error when capturing face

**Problem:** Connection issue between backend and Raspberry Pi

**Solution:**
1. Verify Raspberry Pi face server is running
2. Check http://10.254.8.14:5000/health works
3. Restart backend on PC

### ❌ Camera not working on Raspberry Pi

**Problem:** USB webcam not detected

**Solution:**
```bash
# Check if camera exists:
ls -l /dev/video*

# Fix permissions:
sudo chmod 666 /dev/video0

# Test camera:
python3 -c "import cv2; c=cv2.VideoCapture(0); print('Works!' if c.isOpened() else 'Failed'); c.release()"
```

---

## ✅ Success Checklist

Complete these in order:

- [ ] Raspberry Pi face server running (Step 1)
- [ ] http://10.254.8.14:5000/health shows camera connected (Step 2)
- [ ] Backend running and shows Raspberry Pi URL (Step 3)
- [ ] Frontend running on http://localhost:5173 (Step 4)
- [ ] All three health checks pass (Step 5)
- [ ] Successfully registered a test user (Step 6)

---

## 📞 Still Having Issues?

**Check these logs:**

1. **Raspberry Pi terminal** - Look for camera errors
2. **Backend terminal** - Look for connection errors
3. **Browser console** (F12) - Look for API errors

**Common fixes:**
- Restart Raspberry Pi face server
- Disable firewall on Raspberry Pi: `sudo ufw disable`
- Restart backend on PC
- Clear browser cache

---

**Start with STEP 1 and work through each step in order!** 🚀
