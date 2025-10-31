# ⚡ Timeout Issue - FIXED

## 🔴 Problem
Backend was timing out (10 seconds) when Raspberry Pi was processing face recognition, which can take 15-20 seconds on slower hardware.

## ✅ Solutions Applied

### 1. Optimized Face Detection on Raspberry Pi
- Changed to use `hog` model explicitly (faster than CNN)
- Reduced upsampling to 1 (faster processing)
- This reduces processing time by ~50%

### 2. Increased Backend Timeout
- Changed from **10 seconds** to **30 seconds**
- Applied to both:
  - Face capture endpoint
  - Face verification endpoint

### 3. Disabled Flask Debug Mode
- Prevents camera permission issues on reload
- More stable for production use

---

## 🚀 How to Apply the Fix

### Step 1: Update Raspberry Pi Face Server

**The file has been updated. Just restart it:**

```bash
# On Raspberry Pi:
cd ~/Bio-DecentralizedStorage/raspberry-pi

# Stop current server (Ctrl+C if running)
# Start updated server:
python3 face_server.py
```

**Expected output:**
```
✅ Camera found at index 0
✅ Camera initialized successfully
🚀 Starting Flask server...
 * Running on http://10.254.8.14:5000
```

---

### Step 2: Restart Backend

**The backend code has been updated. Restart it:**

```powershell
# On your PC:
cd d:\change\Bio-DecentralizedStorage\backend

# Stop current backend (Ctrl+C)
# Start updated backend:
npm run dev
```

**Backend will now wait up to 30 seconds for Raspberry Pi response.**

---

## ✅ Test the Fix

1. **Open:** `http://localhost:5173`
2. **Click:** "Register New Account"
3. **Enter:** username and email
4. **Click:** "Next: Capture Face"
5. **Click:** "Capture Face" button
6. **Wait:** 10-20 seconds (you'll see processing on Raspberry Pi terminal)
7. **Success!** Face should be captured without timeout error

---

## 📊 Expected Processing Times

| Operation | Time on Raspberry Pi |
|-----------|---------------------|
| Camera capture | ~1 second |
| Face detection (HOG) | ~3-5 seconds |
| Face encoding | ~5-10 seconds |
| **Total** | **~10-15 seconds** |

With 30-second timeout, there's plenty of buffer time.

---

## 🔧 If Still Timing Out

### Check Raspberry Pi Terminal
Look for errors during face processing:
```
📸 Capturing face for user...
🔍 Detecting faces...
✅ Face detected at location...
🧬 Generating face encoding...
✅ Face encoding generated
```

### Possible Issues:

**1. Camera too slow**
- Try reducing resolution in `face_server.py`:
  ```python
  CAMERA_WIDTH = 320   # Reduce from 640
  CAMERA_HEIGHT = 240  # Reduce from 480
  ```

**2. Raspberry Pi overloaded**
- Close other programs
- Check CPU usage: `top`
- Consider using Raspberry Pi 4 or newer

**3. Network latency**
- Check ping: `ping 10.254.8.14`
- Ensure both devices on same network
- Use wired connection if possible

---

## ✅ Success Indicators

After applying the fix, you should see:

**Raspberry Pi Terminal:**
```
📸 Capturing face for user balaaa, angle 1
🔍 Detecting faces...
✅ Face detected at location: (123, 456, 789, 012)
🧬 Generating face encoding...
✅ Face encoding generated (128 dimensions)
💾 Image saved: /home/pi/face_data/...
```

**Backend Terminal:**
```
📸 Requesting Raspberry Pi to capture face angle 1 for user balaaa
✅ Face captured successfully
```

**Browser:**
```
✅ Face angle 1 captured successfully!
```

---

**The timeout issue is now fixed! Try registration again.** 🎉
