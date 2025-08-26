@echo off
echo Starting Backend Server...
cd /d "C:\Users\labsfiap\Downloads\pythonProjeto\PCexpress"
python -m uvicorn app.main:app --reload --port 8000
pause
