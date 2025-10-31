#!/usr/bin/env python3
"""
Face Recognition Server for Raspberry Pi
Captures face images and performs face verification
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import face_recognition
import cv2
import numpy as np
import os
from datetime import datetime
import json
import time

app = Flask(__name__)
CORS(app)

# Configuration
STORAGE_DIR = '/home/pi/face_data'
os.makedirs(STORAGE_DIR, exist_ok=True)

# Camera configuration
CAMERA_INDEX = 0
CAMERA_WIDTH = 640
CAMERA_HEIGHT = 480

# Face recognition settings
FACE_DETECTION_MODEL = 'hog'  # 'hog' is faster, 'cnn' is more accurate
FACE_MATCH_TOLERANCE = 0.6    # Lower = stricter (0.6 is default)

# Initialize camera
camera = None

def init_camera():
    """Initialize the camera - tries multiple indices"""
    global camera
    
    # Try different camera indices (0, 1, 2)
    for index in [0, 1, 2]:
        try:
            print(f"🔍 Trying camera index {index}...")
            test_camera = cv2.VideoCapture(index)
            
            if test_camera.isOpened():
                # Test if we can actually read a frame
                ret, frame = test_camera.read()
                if ret and frame is not None:
                    print(f"✅ Camera found at index {index}")
                    camera = test_camera
                    camera.set(cv2.CAP_PROP_FRAME_WIDTH, CAMERA_WIDTH)
                    camera.set(cv2.CAP_PROP_FRAME_HEIGHT, CAMERA_HEIGHT)
                    
                    # Warm up camera
                    for _ in range(5):
                        camera.read()
                        time.sleep(0.1)
                    
                    print("✅ Camera initialized successfully")
                    return True
                else:
                    test_camera.release()
            else:
                test_camera.release()
        except Exception as e:
            print(f"⚠️  Camera index {index} failed: {e}")
            continue
    
    print("❌ No working camera found")
    return False

def capture_frame():
    """Capture a frame from camera"""
    global camera
    
    if camera is None or not camera.isOpened():
        init_camera()
    
    # Capture multiple frames and use the last one (better quality)
    for _ in range(3):
        ret, frame = camera.read()
        time.sleep(0.1)
    
    if not ret:
        raise Exception("Failed to capture frame from camera")
    
    return frame

@app.route('/health', methods=['GET'])
def health_check():
    """Check if camera is working"""
    try:
        ret, _ = camera.read() if camera else (False, None)
        
        return jsonify({
            'status': 'ok' if ret else 'error',
            'camera': 'connected' if ret else 'disconnected',
            'timestamp': datetime.now().isoformat()
        })
    except Exception as e:
        return jsonify({
            'status': 'error',
            'camera': 'disconnected',
            'error': str(e)
        }), 500

@app.route('/capture', methods=['POST'])
def capture_face():
    """
    Capture face image and generate encoding
    
    Request body:
    {
        "userId": "user_id_from_mongodb",
        "angleNumber": 1  // 1, 2, or 3
    }
    """
    try:
        data = request.json
        user_id = data.get('userId')
        angle_number = data.get('angleNumber')
        
        if not user_id or not angle_number:
            return jsonify({'error': 'userId and angleNumber are required'}), 400
        
        print(f"\n📸 Capturing face for user {user_id}, angle {angle_number}")
        
        # Capture frame
        frame = capture_frame()
        
        # Convert BGR to RGB (face_recognition uses RGB)
        rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        
        # Detect faces (optimized for speed)
        print("🔍 Detecting faces...")
        face_locations = face_recognition.face_locations(rgb_frame, model='hog', number_of_times_to_upsample=1)
        
        if len(face_locations) == 0:
            return jsonify({
                'success': False,
                'error': 'No face detected. Please position your face in front of the camera.'
            }), 400
        
        if len(face_locations) > 1:
            return jsonify({
                'success': False,
                'error': 'Multiple faces detected. Please ensure only one person is in frame.'
            }), 400
        
        print(f"✅ Face detected at location: {face_locations[0]}")
        
        # Generate face encoding
        print("🧬 Generating face encoding...")
        face_encodings = face_recognition.face_encodings(rgb_frame, face_locations)
        
        if len(face_encodings) == 0:
            return jsonify({
                'success': False,
                'error': 'Could not generate face encoding. Please try again.'
            }), 400
        
        face_encoding = face_encodings[0]
        print(f"✅ Face encoding generated (128 dimensions)")
        
        # Save image
        user_dir = os.path.join(STORAGE_DIR, user_id)
        os.makedirs(user_dir, exist_ok=True)
        
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        image_filename = f'face_angle_{angle_number}_{timestamp}.jpg'
        image_path = os.path.join(user_dir, image_filename)
        
        # Draw rectangle around face for saved image
        top, right, bottom, left = face_locations[0]
        cv2.rectangle(frame, (left, top), (right, bottom), (0, 255, 0), 2)
        
        cv2.imwrite(image_path, frame)
        print(f"💾 Image saved: {image_path}")
        
        return jsonify({
            'success': True,
            'imagePath': image_path,
            'faceEncoding': face_encoding.tolist(),
            'message': f'Face angle {angle_number} captured successfully'
        })
        
    except Exception as e:
        print(f"❌ Error in capture_face: {e}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/verify', methods=['POST'])
def verify_face():
    """
    Verify face against stored encodings
    
    Request body:
    {
        "userId": "user_id_from_mongodb",
        "storedEncodings": [[...], [...], [...]]  // Array of 3 face encodings
    }
    """
    try:
        data = request.json
        user_id = data.get('userId')
        stored_encodings = data.get('storedEncodings')
        
        if not user_id or not stored_encodings:
            return jsonify({'error': 'userId and storedEncodings are required'}), 400
        
        print(f"\n🔐 Verifying face for user {user_id}")
        print(f"📊 Comparing against {len(stored_encodings)} stored encodings")
        
        # Convert stored encodings to numpy arrays
        stored_encodings = [np.array(enc) for enc in stored_encodings]
        
        # Capture current frame
        frame = capture_frame()
        rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        
        # Detect faces
        print("🔍 Detecting faces...")
        face_locations = face_recognition.face_locations(rgb_frame, model=FACE_DETECTION_MODEL)
        
        if len(face_locations) == 0:
            return jsonify({
                'match': False,
                'error': 'No face detected. Please position your face in front of the camera.',
                'confidence': 0.0
            }), 200
        
        if len(face_locations) > 1:
            return jsonify({
                'match': False,
                'error': 'Multiple faces detected. Please ensure only one person is in frame.',
                'confidence': 0.0
            }), 200
        
        print(f"✅ Face detected")
        
        # Generate encoding for current face
        print("🧬 Generating face encoding...")
        current_encodings = face_recognition.face_encodings(rgb_frame, face_locations)
        
        if len(current_encodings) == 0:
            return jsonify({
                'match': False,
                'error': 'Could not generate face encoding. Please try again.',
                'confidence': 0.0
            }), 200
        
        current_encoding = current_encodings[0]
        
        # Compare with stored encodings
        print("🔬 Comparing faces...")
        matches = face_recognition.compare_faces(
            stored_encodings,
            current_encoding,
            tolerance=FACE_MATCH_TOLERANCE
        )
        
        # Calculate face distances (lower = more similar)
        face_distances = face_recognition.face_distance(stored_encodings, current_encoding)
        
        print(f"📏 Face distances: {face_distances}")
        print(f"✓ Matches: {matches}")
        
        # Find best match
        best_match_index = np.argmin(face_distances)
        best_distance = face_distances[best_match_index]
        is_match = matches[best_match_index]
        
        # Calculate confidence (inverse of distance)
        confidence = 1 - best_distance
        
        # Save verification image (for debugging)
        verification_dir = os.path.join(STORAGE_DIR, user_id, 'verifications')
        os.makedirs(verification_dir, exist_ok=True)
        
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        result_text = 'MATCH' if is_match else 'NO_MATCH'
        verification_path = os.path.join(
            verification_dir,
            f'verify_{result_text}_{timestamp}.jpg'
        )
        
        # Draw rectangle and result on image
        top, right, bottom, left = face_locations[0]
        color = (0, 255, 0) if is_match else (0, 0, 255)
        cv2.rectangle(frame, (left, top), (right, bottom), color, 2)
        cv2.putText(
            frame,
            f'{result_text} ({confidence:.2%})',
            (left, top - 10),
            cv2.FONT_HERSHEY_SIMPLEX,
            0.6,
            color,
            2
        )
        cv2.imwrite(verification_path, frame)
        
        print(f"{'✅ MATCH' if is_match else '❌ NO MATCH'} - Confidence: {confidence:.2%}")
        
        return jsonify({
            'match': bool(is_match),
            'confidence': float(confidence),
            'bestMatchIndex': int(best_match_index),
            'allDistances': face_distances.tolist(),
            'message': 'Face verified successfully' if is_match else 'Face does not match',
            'verificationImagePath': verification_path
        })
        
    except Exception as e:
        print(f"❌ Error in verify_face: {e}")
        return jsonify({
            'match': False,
            'error': str(e),
            'confidence': 0.0
        }), 500

@app.route('/test-camera', methods=['GET'])
def test_camera():
    """Test camera by capturing and returning image info"""
    try:
        frame = capture_frame()
        height, width, channels = frame.shape
        
        return jsonify({
            'success': True,
            'resolution': f'{width}x{height}',
            'channels': channels,
            'message': 'Camera is working properly'
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

if __name__ == '__main__':
    print("\n" + "="*50)
    print("🥧 Raspberry Pi Face Recognition Server")
    print("="*50 + "\n")
    
    # Initialize camera
    if init_camera():
        print("🚀 Starting Flask server...\n")
        # Debug mode disabled to prevent camera permission issues on reload
        app.run(host='0.0.0.0', port=5000, debug=False)
    else:
        print("❌ Failed to initialize camera. Please check camera connection.")
        print("Run 'sudo raspi-config' and enable camera interface.")
