#!/usr/bin/env python3
"""
USB Webcam Fix and Test Script for Raspberry Pi
Run this to diagnose and fix USB webcam issues
"""

import cv2
import os
import sys
import subprocess

print("\n" + "="*50)
print("🔧 USB Webcam Fix & Test")
print("="*50 + "\n")

# Step 1: Check video devices
print("Step 1: Checking for video devices...")
video_devices = []
for i in range(5):
    device = f'/dev/video{i}'
    if os.path.exists(device):
        video_devices.append(device)
        print(f"  ✅ Found: {device}")

if not video_devices:
    print("  ❌ No video devices found!")
    print("\n💡 Solutions:")
    print("  1. Unplug and replug the USB webcam")
    print("  2. Try a different USB port")
    print("  3. Run: lsusb (to see if USB device is detected)")
    print("  4. Check dmesg for errors: dmesg | grep -i video")
    sys.exit(1)

print(f"\n✅ Found {len(video_devices)} video device(s)\n")

# Step 2: Check permissions
print("Step 2: Checking permissions on /dev/video0...")
try:
    stat_info = os.stat('/dev/video0')
    print(f"  Current permissions: {oct(stat_info.st_mode)[-3:]}")
    
    # Try to fix permissions
    print("  Attempting to fix permissions...")
    result = subprocess.run(['sudo', 'chmod', '666', '/dev/video0'], 
                          capture_output=True, text=True)
    if result.returncode == 0:
        print("  ✅ Permissions fixed")
    else:
        print("  ⚠️  Could not change permissions (may need sudo)")
except Exception as e:
    print(f"  ⚠️  Permission check failed: {e}")

print()

# Step 3: Try different camera indices
print("Step 3: Testing camera access...")
camera = None
working_index = None

for index in range(5):
    print(f"  Testing /dev/video{index}...")
    test_cam = cv2.VideoCapture(index)
    
    if test_cam.isOpened():
        ret, frame = test_cam.read()
        if ret and frame is not None:
            print(f"  ✅ Camera {index} works!")
            if working_index is None:
                working_index = index
                camera = test_cam
            else:
                test_cam.release()
        else:
            print(f"  ⚠️  Camera {index} opens but can't read frames")
            test_cam.release()
    else:
        test_cam.release()

if camera is None or working_index is None:
    print("\n❌ No working camera found!")
    print("\n💡 Try these commands on Raspberry Pi:")
    print("  sudo apt-get update")
    print("  sudo apt-get install v4l-utils")
    print("  v4l2-ctl --list-devices")
    print("  sudo usermod -a -G video $USER")
    print("  # Then logout and login again")
    sys.exit(1)

print(f"\n✅ Working camera found at index {working_index}\n")

# Step 4: Test frame capture
print("Step 4: Testing frame capture...")
ret, frame = camera.read()

if ret and frame is not None:
    height, width = frame.shape[:2]
    channels = frame.shape[2] if len(frame.shape) > 2 else 1
    
    print(f"  ✅ Frame captured successfully!")
    print(f"     Resolution: {width}x{height}")
    print(f"     Channels: {channels}")
    print(f"     Data type: {frame.dtype}")
else:
    print("  ❌ Failed to capture frame")
    camera.release()
    sys.exit(1)

# Step 5: Test continuous capture
print("\nStep 5: Testing continuous capture (5 frames)...")
success = 0
for i in range(5):
    ret, frame = camera.read()
    if ret:
        success += 1
        print(f"  ✅ Frame {i+1}/5")
    else:
        print(f"  ❌ Frame {i+1}/5 failed")

camera.release()

# Summary
print("\n" + "="*50)
print("📊 SUMMARY")
print("="*50)
print(f"✅ Video devices found: {len(video_devices)}")
print(f"✅ Working camera index: {working_index}")
print(f"✅ Resolution: {width}x{height}")
print(f"✅ Successful captures: {success}/5")

if success == 5:
    print("\n🎉 USB Webcam is working perfectly!")
    print("\n🚀 Next steps:")
    print("  1. Update face_server.py if needed:")
    print(f"     CAMERA_INDEX = {working_index}")
    print("  2. Start face server: python3 face_server.py")
    print("  3. Test: curl http://localhost:5000/health")
else:
    print("\n⚠️  Camera is unstable")
    print("\n💡 Try:")
    print("  1. Use a different USB port")
    print("  2. Use a powered USB hub")
    print("  3. Check power supply (webcam may need more power)")

print("\n" + "="*50 + "\n")
