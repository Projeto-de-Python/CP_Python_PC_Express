@echo off
echo Starting PC-Express...
echo.

REM Activate virtual environment
call .venv\Scripts\activate

REM Start backend
echo Starting backend server...
start "Backend Server" cmd /k "python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000"

REM Wait a moment
timeout /t 3 /nobreak > nul

REM Start frontend
echo Starting frontend server...
cd frontend
start "Frontend Server" cmd /k "npm run dev"

echo.
echo Servers started!
echo Backend: http://localhost:8000
echo Frontend: http://localhost:5173
echo.
pause
