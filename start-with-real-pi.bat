@echo off
echo ========================================
echo Starting Bio-DecentralizedStorage
echo WITH REAL RASPBERRY PI SERVER
echo IP: 10.254.8.14:5000
echo ========================================
echo.

REM Kill any existing processes on port 3000
echo Cleaning up existing backend processes...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3000 ^| findstr LISTENING') do taskkill /F /PID %%a 2>nul
timeout /t 2 /nobreak >nul

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
echo Raspberry Pi:   http://10.254.8.14:5000
echo Backend:        http://localhost:3000
echo Frontend:       http://localhost:5173
echo.
echo MongoDB: Running as Windows Service
echo.
echo IMPORTANT: Make sure camera is connected to Raspberry Pi!
echo.
echo Press any key to stop all services...
pause >nul

REM Stop all services
taskkill /FI "WindowTitle eq Backend*" /T /F
taskkill /FI "WindowTitle eq Frontend*" /T /F

echo All services stopped.
