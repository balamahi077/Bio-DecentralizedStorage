@echo off
echo ========================================
echo Starting Bio-DecentralizedStorage
echo Development Environment
echo ========================================
echo.

REM Start MongoDB (if not running as service)
echo Starting MongoDB...
start "MongoDB" mongod

REM Wait a bit for MongoDB to start
timeout /t 3 /nobreak >nul

REM Start Backend
echo Starting Backend Server...
start "Backend" cmd /k "cd backend && npm run dev"

REM Wait for backend to start
timeout /t 5 /nobreak >nul

REM Start Frontend
echo Starting Frontend...
start "Frontend" cmd /k "cd web && npm run dev"

echo.
echo ========================================
echo All services started!
echo ========================================
echo.
echo Backend:  http://localhost:3000
echo Frontend: http://localhost:5173
echo.
echo Make sure Raspberry Pi server is running:
echo   ssh pi@raspberrypi.local
echo   python3 face_server.py
echo.
echo Press any key to stop all services...
pause >nul

REM Stop all services
taskkill /FI "WindowTitle eq Backend*" /T /F
taskkill /FI "WindowTitle eq Frontend*" /T /F
taskkill /FI "WindowTitle eq MongoDB*" /T /F

echo All services stopped.
