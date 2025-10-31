#!/bin/bash

# Raspberry Pi Face Recognition Setup Script
# Run this on your Raspberry Pi

echo "=================================="
echo "Raspberry Pi Face Recognition Setup"
echo "=================================="
echo ""

# Update system
echo "📦 Updating system packages..."
sudo apt-get update
sudo apt-get upgrade -y

# Install system dependencies
echo "📦 Installing system dependencies..."
sudo apt-get install -y python3-pip python3-opencv
sudo apt-get install -y cmake libopenblas-dev liblapack-dev
sudo apt-get install -y libatlas-base-dev gfortran

# Install Python packages
echo "🐍 Installing Python packages..."
pip3 install --upgrade pip
pip3 install -r requirements.txt

# Enable camera
echo "📷 Checking camera configuration..."
if ! grep -q "start_x=1" /boot/config.txt; then
    echo "Enabling camera interface..."
    sudo raspi-config nonint do_camera 0
fi

# Create storage directory
echo "📁 Creating storage directory..."
mkdir -p /home/pi/face_data

# Test camera
echo "🧪 Testing camera..."
python3 -c "import cv2; cam = cv2.VideoCapture(0); ret, _ = cam.read(); cam.release(); print('✅ Camera test:', 'PASSED' if ret else 'FAILED')"

echo ""
echo "=================================="
echo "✅ Setup complete!"
echo "=================================="
echo ""
echo "To start the face recognition server, run:"
echo "  python3 face_server.py"
echo ""
echo "The server will be available at:"
echo "  http://$(hostname -I | awk '{print $1}'):5000"
echo ""
