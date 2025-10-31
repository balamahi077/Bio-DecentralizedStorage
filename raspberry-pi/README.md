# 🥧 Raspberry Pi Face Recognition Server

This directory contains the face recognition server that runs on Raspberry Pi.

## 📋 Prerequisites

- Raspberry Pi (3B+ or newer recommended)
- Raspberry Pi Camera Module (v1, v2, or HQ)
- Raspbian OS (Bullseye or newer)
- Python 3.7+

## 🚀 Quick Setup

### 1. Transfer Files to Raspberry Pi

```bash
# From your computer, copy files to Raspberry Pi
scp -r raspberry-pi/* pi@raspberrypi.local:/home/pi/face-recognition/
```

### 2. SSH into Raspberry Pi

```bash
ssh pi@raspberrypi.local
cd /home/pi/face-recognition
```

### 3. Run Setup Script

```bash
chmod +x setup.sh
./setup.sh
```

This will:
- Update system packages
- Install dependencies
- Enable camera interface
- Create storage directories
- Test camera connection

### 4. Start the Server

```bash
python3 face_server.py
```

The server will start on `http://0.0.0.0:5000`

## 🔧 Manual Setup (if script fails)

### Install Dependencies

```bash
# Update system
sudo apt-get update
sudo apt-get upgrade -y

# Install system packages
sudo apt-get install -y python3-pip python3-opencv
sudo apt-get install -y cmake libopenblas-dev liblapack-dev

# Install Python packages
pip3 install flask flask-cors face-recognition opencv-python numpy
```

### Enable Camera

```bash
sudo raspi-config
# Navigate to: Interface Options > Camera > Enable
# Reboot: sudo reboot
```

### Test Camera

```bash
# Test with raspistill
raspistill -o test.jpg

# Test with Python
python3 -c "import cv2; cam = cv2.VideoCapture(0); ret, frame = cam.read(); print('Camera OK' if ret else 'Camera FAILED')"
```

## 📡 API Endpoints

### Health Check
```bash
GET http://raspberrypi.local:5000/health
```

### Capture Face
```bash
POST http://raspberrypi.local:5000/capture
Content-Type: application/json

{
  "userId": "user_id_here",
  "angleNumber": 1
}
```

### Verify Face
```bash
POST http://raspberrypi.local:5000/verify
Content-Type: application/json

{
  "userId": "user_id_here",
  "storedEncodings": [[...], [...], [...]]
}
```

## 🔍 Troubleshooting

### Camera Not Working

```bash
# Check camera is detected
vcgencmd get_camera

# Should show: supported=1 detected=1

# Test camera
raspistill -o test.jpg
```

### Port Already in Use

```bash
# Find process using port 5000
sudo lsof -i :5000

# Kill process
sudo kill -9 <PID>
```

### Permission Denied

```bash
# Add user to video group
sudo usermod -a -G video $USER

# Logout and login again
```

## 🌐 Find Raspberry Pi IP Address

```bash
hostname -I
```

Update this IP in your backend `.env` file:
```
RASPBERRY_PI_URL=http://YOUR_PI_IP:5000
```

## 🔄 Auto-Start on Boot

```bash
# Create systemd service
sudo nano /etc/systemd/system/face-recognition.service
```

Add:
```ini
[Unit]
Description=Face Recognition Server
After=network.target

[Service]
Type=simple
User=pi
WorkingDirectory=/home/pi/face-recognition
ExecStart=/usr/bin/python3 /home/pi/face-recognition/face_server.py
Restart=always

[Install]
WantedBy=multi-user.target
```

Enable and start:
```bash
sudo systemctl enable face-recognition
sudo systemctl start face-recognition
sudo systemctl status face-recognition
```

## 📊 Performance Tips

- Use `FACE_DETECTION_MODEL = 'hog'` for faster detection (default)
- Use `FACE_DETECTION_MODEL = 'cnn'` for more accurate detection (slower)
- Adjust `FACE_MATCH_TOLERANCE` (0.6 default, lower = stricter)
- Ensure good lighting for better accuracy
- Position face 1-2 feet from camera

## 🐛 Debug Mode

View captured images:
```bash
ls -la /home/pi/face_data/
```

Check logs:
```bash
# If running as service
sudo journalctl -u face-recognition -f
```

## 📝 Notes

- Face encodings are 128-dimensional vectors
- Images are stored in `/home/pi/face_data/`
- Verification images saved for debugging
- Server runs on all interfaces (0.0.0.0)
