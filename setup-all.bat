@echo off
echo ========================================
echo Bio-DecentralizedStorage Setup Script
echo Face Recognition Authentication System
echo ========================================
echo.

REM Check Node.js
echo [1/5] Checking Node.js installation...
node --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Node.js is not installed!
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)
echo ✓ Node.js is installed

REM Check MongoDB
echo.
echo [2/5] Checking MongoDB installation...
mongod --version >nul 2>&1
if errorlevel 1 (
    echo WARNING: MongoDB is not installed or not in PATH
    echo Please install MongoDB from https://www.mongodb.com/try/download/community
    echo.
)

REM Setup Backend
echo.
echo [3/5] Setting up Backend...
cd backend
if not exist node_modules (
    echo Installing backend dependencies...
    call npm install
) else (
    echo Backend dependencies already installed
)

if not exist .env (
    echo Creating .env file...
    copy .env.example .env
    echo Please edit backend\.env with your configuration!
) else (
    echo .env file already exists
)
cd ..

REM Setup Frontend
echo.
echo [4/5] Setting up Frontend...
cd web
if not exist node_modules (
    echo Installing frontend dependencies...
    call npm install
) else (
    echo Frontend dependencies already installed
)

if not exist .env (
    echo Creating .env file...
    echo VITE_API_URL=http://localhost:3000/api/auth > .env
    echo VITE_PINATA_JWT=your_pinata_jwt_token >> .env
    echo Please edit web\.env with your configuration!
) else (
    echo .env file already exists
)
cd ..

REM Instructions
echo.
echo [5/5] Setup Complete!
echo ========================================
echo.
echo NEXT STEPS:
echo.
echo 1. Configure Backend:
echo    - Edit backend\.env with your settings
echo    - Set RASPBERRY_PI_URL to your Pi's IP
echo    - Change JWT_SECRET to a secure value
echo.
echo 2. Start MongoDB:
echo    - Run: mongod
echo.
echo 3. Start Backend:
echo    - cd backend
echo    - npm run dev
echo.
echo 4. Setup Raspberry Pi:
echo    - Transfer raspberry-pi folder to your Pi
echo    - Run: ./setup.sh
echo    - Start: python3 face_server.py
echo.
echo 5. Start Frontend:
echo    - cd web
echo    - npm run dev
echo.
echo 6. Open browser: http://localhost:5173
echo.
echo For detailed instructions, see FACE_RECOGNITION_SETUP.md
echo ========================================
echo.
pause
