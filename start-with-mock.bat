@echo off
echo ========================================
echo Starting Bio-DecentralizedStorage
echo WITH MOCK RASPBERRY PI SERVER
echo ========================================
echo.

REM Kill any existing processes on ports 3000 and 5000
echo Cleaning up existing processes...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3000 ^| findstr LISTENING') do taskkill /F /PID %%a 2>nul
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :5000 ^| findstr LISTENING') do taskkill /F /PID %%a 2>nul
timeout /t 2 /nobreak >nul

REM Start Mock Raspberry Pi Server
echo Starting Mock Raspberry Pi Server...
start "Mock-Pi-Server" cmd /k "cd mock-pi-server && python server.py"

REM Wait for mock server to start
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
echo Mock Pi Server: http://localhost:5000
echo Backend:        http://localhost:3000
echo Frontend:       http://localhost:5173
echo.
echo MongoDB: Running as Windows Service
echo.
echo Press any key to stop all services...
pause >nul

REM Stop all services
taskkill /FI "WindowTitle eq Backend*" /T /F
taskkill /FI "WindowTitle eq Frontend*" /T /F
taskkill /FI "WindowTitle eq Mock-Pi-Server*" /T /F

echo All services stopped.
