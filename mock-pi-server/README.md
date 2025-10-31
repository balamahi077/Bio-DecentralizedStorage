# Mock Raspberry Pi Server

This is a mock server that simulates the Raspberry Pi face recognition server for local development.

## Setup

```bash
# Install dependencies
pip install -r requirements.txt

# Run the server
python server.py
```

## Features

- ✅ Simulates face capture (no actual camera needed)
- ✅ Generates mock face encodings
- ✅ Always returns successful verification (for testing)
- ✅ Runs on http://localhost:5000

## Endpoints

- `GET /health` - Health check
- `POST /capture` - Capture face image
- `POST /verify` - Verify face
- `GET /status` - Server status

## Note

This is for **development only**. Replace with actual Raspberry Pi server in production.
