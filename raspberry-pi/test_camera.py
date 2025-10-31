#!/usr/bin/env python3
"""
Quick camera test script for Raspberry Pi
Run this to diagnose camera issues
"""

import cv2
import sys
import os

print("\n" + "="*50)
print("📸 Camera Diagnostic Test")
print("="*50 + "\n")

# Test 1: Check if video device exists
print("Test 1: Checking for video devices...")
video_devices = []
for i in range(5):
    device_path = f'/dev/video{i}'
    if os.path.exists(device_path):
        video_devices.append(device_path)
        print(f"  ✅ Found: {device_path}")

if not video_devices:
    print("  ❌ No video devices found!")
    print("\n💡 Solutions:")
    print("  1. Check if camera is physically connected")
    print("  2. Enable camera: sudo raspi-config → Interface Options → Camera")
    print("  3. For USB camera: sudo apt-get install v4l-utils")
    print("  4. Check permissions: ls -l /dev/video*")
    sys.exit(1)

print(f"\n✅ Found {len(video_devices)} video device(s)\n")

# Test 2: Try to open camera
print("Test 2: Attempting to open camera...")
camera = cv2.VideoCapture(0)

if not camera.isOpened():
    print("  ❌ ERROR: Cannot open camera device")
    print("\n💡 Solutions:")
    print("  1. Check permissions: sudo chmod 666 /dev/video0")
    print("  2. Add user to video group: sudo usermod -a -G video $USER")
    print("  3. Reboot: sudo reboot")
    sys.exit(1)

print("  ✅ Camera opened successfully\n")

# Test 3: Try to read frame
print("Test 3: Attempting to capture frame...")
ret, frame = camera.read()

if not ret or frame is None:
    print("  ❌ ERROR: Cannot read frame from camera")
    camera.release()
    sys.exit(1)

height, width = frame.shape[:2]
channels = frame.shape[2] if len(frame.shape) > 2 else 1

print(f"  ✅ Frame captured successfully!")
print(f"     Resolution: {width}x{height}")
print(f"     Channels: {channels}")
print(f"     Data type: {frame.dtype}")
print(f"     Frame size: {frame.nbytes} bytes\n")

# Test 4: Multiple frame capture
print("Test 4: Testing continuous capture (5 frames)...")
success_count = 0
for i in range(5):
    ret, frame = camera.read()
    if ret:
        success_count += 1
        print(f"  ✅ Frame {i+1}/5 captured")
    else:
        print(f"  ❌ Frame {i+1}/5 failed")

print(f"\n  Success rate: {success_count}/5 frames\n")

camera.release()

# Summary
print("="*50)
print("📊 SUMMARY")
print("="*50)
print(f"✅ Video devices found: {len(video_devices)}")
print(f"✅ Camera accessible: Yes")
print(f"✅ Frame capture: {success_count}/5 successful")
print(f"✅ Resolution: {width}x{height}")

if success_count == 5:
    print("\n🎉 Camera is working perfectly!")
    print("\n🚀 Next steps:")
    print("  1. Start the face server: python3 face_server.py")
    print("  2. Test health endpoint: curl http://localhost:5000/health")
    print("  3. Register a user from the web app")
else:
    print("\n⚠️  Camera is partially working but unstable")
    print("\n💡 Try:")
    print("  1. Reconnect the camera")
    print("  2. Reboot the Raspberry Pi")
    print("  3. Check camera cable/USB connection")

print("\n" + "="*50 + "\n")
