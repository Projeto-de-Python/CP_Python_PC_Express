@echo off
echo ========================================
echo    PC-Express - Parando Servidores
echo ========================================
echo.

echo 🛑 Parando servidores...

REM Parar processos Python (uvicorn) - apenas os que usam a porta 8000
echo Parando Backend (Python/uvicorn)...
for /f "tokens=5" %%i in ('netstat -ano ^| findstr ":8000"') do (
    echo   Finalizando processo PID: %%i
    taskkill /PID %%i /F >nul 2>&1
)

REM Parar processos Node.js (vite) - apenas os que usam a porta 5173
echo Parando Frontend (Node.js/vite)...
for /f "tokens=5" %%i in ('netstat -ano ^| findstr ":5173"') do (
    echo   Finalizando processo PID: %%i
    taskkill /PID %%i /F >nul 2>&1
)

REM Parar processos Python específicos do PC-Express (uvicorn)
echo Parando processos uvicorn específicos...
for /f "tokens=2" %%i in ('tasklist /FI "IMAGENAME eq python.exe" /FO CSV ^| findstr /C:"uvicorn"') do (
    echo   Finalizando processo uvicorn: %%i
    taskkill /PID %%i /F >nul 2>&1
)

REM Parar processos Node.js específicos do PC-Express (vite)
echo Parando processos vite específicos...
for /f "tokens=2" %%i in ('tasklist /FI "IMAGENAME eq node.exe" /FO CSV ^| findstr /C:"vite"') do (
    echo   Finalizando processo vite: %%i
    taskkill /PID %%i /F >nul 2>&1
)

REM Parar processos que contenham "app.main" (específico do PC-Express)
echo Parando processos FastAPI específicos...
for /f "tokens=2" %%i in ('wmic process where "commandline like '%%app.main%%'" get processid /format:csv ^| findstr /R "[0-9]"') do (
    echo   Finalizando processo FastAPI: %%i
    taskkill /PID %%i /F >nul 2>&1
)

REM Parar processos que contenham "PC-Express" no diretório de trabalho
echo Parando processos do diretório PC-Express...
for /f "tokens=2" %%i in ('wmic process where "commandline like '%%PC-Express%%'" get processid /format:csv ^| findstr /R "[0-9]"') do (
    echo   Finalizando processo PC-Express: %%i
    taskkill /PID %%i /F >nul 2>&1
)

REM Parar janelas especificas se existirem
taskkill /FI "WINDOWTITLE eq PC-Express Backend*" /F >nul 2>&1
taskkill /FI "WINDOWTITLE eq PC-Express Frontend*" /F >nul 2>&1

echo.
echo ✅ Servidores PC-Express parados!
echo ℹ️  Outros processos Python/Node.js do sistema foram preservados.
echo.
pause
