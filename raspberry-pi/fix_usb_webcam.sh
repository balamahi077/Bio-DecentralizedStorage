#!/bin/bash
# Fix USB Webcam on Raspberry Pi

echo "=========================================="
echo "USB Webcam Diagnostic & Fix"
echo "=========================================="
echo ""

# Step 1: Check if video devices exist
echo "Step 1: Checking for video devices..."
if ls /dev/video* 1> /dev/null 2>&1; then
    echo "✅ Video devices found:"
    ls -l /dev/video*
else
    echo "❌ No video devices found!"
    echo ""
    echo "Solutions:"
    echo "1. Unplug and replug the USB webcam"
    echo "2. Try a different USB port"
    echo "3. Check if webcam works on another device"
    exit 1
fi

echo ""

# Step 2: Check permissions
echo "Step 2: Checking permissions..."
CURRENT_USER=$(whoami)
if groups $CURRENT_USER | grep -q video; then
    echo "✅ User '$CURRENT_USER' is in 'video' group"
else
    echo "⚠️  User '$CURRENT_USER' is NOT in 'video' group"
    echo "Adding user to video group..."
    sudo usermod -a -G video $CURRENT_USER
    echo "✅ User added to video group"
    echo "⚠️  You need to LOGOUT and LOGIN again for this to take effect!"
fi

echo ""

# Step 3: Fix permissions on video device
echo "Step 3: Setting permissions on /dev/video0..."
sudo chmod 666 /dev/video0
echo "✅ Permissions set"

echo ""

# Step 4: Install required packages
echo "Step 4: Checking required packages..."
if ! dpkg -l | grep -q v4l-utils; then
    echo "Installing v4l-utils..."
    sudo apt-get update
    sudo apt-get install -y v4l-utils
else
    echo "✅ v4l-utils already installed"
fi

echo ""

# Step 5: Test webcam with v4l2
echo "Step 5: Testing webcam with v4l2-ctl..."
v4l2-ctl --list-devices

echo ""
echo "Webcam capabilities:"
v4l2-ctl -d /dev/video0 --all

echo ""

# Step 6: Test with Python OpenCV
echo "Step 6: Testing with Python OpenCV..."
python3 << 'EOF'
import cv2
import sys

print("Attempting to open camera...")
camera = cv2.VideoCapture(0)

if not camera.isOpened():
    print("❌ ERROR: Cannot open camera")
    sys.exit(1)

print("✅ Camera opened successfully!")

ret, frame = camera.read()
if ret:
    height, width = frame.shape[:2]
    print(f"✅ Frame captured: {width}x{height}")
    print(f"✅ USB Webcam is working!")
else:
    print("❌ ERROR: Cannot read frame")
    sys.exit(1)

camera.release()
EOF

echo ""
echo "=========================================="
echo "✅ USB Webcam Setup Complete!"
echo "=========================================="
echo ""
echo "Next steps:"
echo "1. Start the face server: python3 face_server.py"
echo "2. Test health: curl http://localhost:5000/health"
echo ""
