"""
Mock Raspberry Pi Face Recognition Server
Simulates face capture and verification for local development
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import random
import time
import os
import json

app = Flask(__name__)
CORS(app)

# Store face encodings in memory (simulated)
face_database = {}

@app.route('/health', methods=['GET'])
def health():
    """Health check endpoint"""
    return jsonify({
        'status': 'ok',
        'camera': 'mock_camera_ready',
        'message': 'Mock Raspberry Pi server running'
    })

@app.route('/capture', methods=['POST'])
def capture_face():
    """
    Simulate capturing a face image and generating encoding
    Expected: { userId, angleNumber }
    """
    try:
        data = request.json
        user_id = data.get('userId')
        angle_number = data.get('angleNumber')
        
        if not user_id or not angle_number:
            return jsonify({
                'success': False,
                'error': 'userId and angleNumber are required'
            }), 400
        
        # Simulate camera capture delay
        time.sleep(0.5)
        
        # Generate mock face encoding (128-dimensional vector)
        mock_encoding = [random.random() for _ in range(128)]
        
        # Generate mock image path
        image_path = f'/mock/faces/{user_id}/angle_{angle_number}.jpg'
        
        # Store in mock database
        if user_id not in face_database:
            face_database[user_id] = []
        face_database[user_id].append({
            'angle': angle_number,
            'encoding': mock_encoding,
            'path': image_path
        })
        
        print(f"✅ Captured face for user {user_id}, angle {angle_number}")
        
        return jsonify({
            'success': True,
            'imagePath': image_path,
            'faceEncoding': mock_encoding,
            'message': f'Face captured successfully (angle {angle_number})'
        })
        
    except Exception as e:
        print(f"❌ Error capturing face: {str(e)}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/verify', methods=['POST'])
def verify_face():
    """
    Simulate face verification
    Expected: { userId, storedEncodings }
    """
    try:
        data = request.json
        user_id = data.get('userId')
        stored_encodings = data.get('storedEncodings', [])
        
        if not user_id:
            return jsonify({
                'match': False,
                'error': 'userId is required'
            }), 400
        
        # Simulate camera capture delay
        time.sleep(0.5)
        
        # Simulate face verification (always succeed with high confidence)
        # In real implementation, this would compare captured face with stored encodings
        match = True
        confidence = random.uniform(0.85, 0.98)  # High confidence match
        
        print(f"✅ Face verified for user {user_id} - Match: {match}, Confidence: {confidence:.2%}")
        
        return jsonify({
            'match': match,
            'confidence': confidence,
            'message': 'Face verified successfully'
        })
        
    except Exception as e:
        print(f"❌ Error verifying face: {str(e)}")
        return jsonify({
            'match': False,
            'error': str(e)
        }), 500

@app.route('/status', methods=['GET'])
def status():
    """Get server status and statistics"""
    return jsonify({
        'status': 'running',
        'type': 'mock_server',
        'users_registered': len(face_database),
        'total_captures': sum(len(encodings) for encodings in face_database.values())
    })

if __name__ == '__main__':
    print("=" * 50)
    print("🎭 Mock Raspberry Pi Face Recognition Server")
    print("=" * 50)
    print("Running on: http://localhost:5000")
    print("This is a MOCK server for development")
    print("No actual camera or face recognition")
    print("=" * 50)
    print()
    
    app.run(host='0.0.0.0', port=5000, debug=True)
