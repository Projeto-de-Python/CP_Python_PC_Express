@echo off
REM PC-Express - Inicializador Ultra Simples
REM Para usuários com problemas de permissão

title PC-Express - Inicializador

echo.
echo ========================================
echo    PC-Express - Inicializador Simples
echo ========================================
echo.

REM Verificar Python
echo Verificando Python...
python --version >nul 2>&1
if errorlevel 1 (
    echo.
    echo ERRO: Python nao encontrado!
    echo.
    echo SOLUCAO:
    echo 1. Baixe Python de: https://www.python.org/downloads/
    echo 2. Durante a instalacao, marque "Add Python to PATH"
    echo 3. Reinicie o terminal e tente novamente
    echo.
    pause
    exit /b 1
)

REM Verificar Node.js
echo Verificando Node.js...
node --version >nul 2>&1
if errorlevel 1 (
    echo.
    echo ERRO: Node.js nao encontrado!
    echo.
    echo SOLUCAO:
    echo 1. Baixe Node.js de: https://nodejs.org/
    echo 2. Instale e reinicie o terminal
    echo 3. Tente novamente
    echo.
    pause
    exit /b 1
)

echo OK: Dependencias encontradas!
echo.

REM Configurar ambiente
echo Configurando ambiente...
if not exist ".venv" (
    echo Criando ambiente virtual Python...
    python -m venv .venv
)

echo Instalando dependencias Python...
.venv\Scripts\python.exe -m pip install --upgrade pip >nul 2>&1
.venv\Scripts\python.exe -m pip install -r requirement.txt --no-input >nul 2>&1

if not exist "inventory.db" (
    echo Configurando banco de dados...
    .venv\Scripts\python.exe scripts/setup_db.py >nul 2>&1
)

if not exist "frontend\node_modules" (
    echo Instalando dependencias Node.js...
    cd frontend
    npm install >nul 2>&1
    cd ..
)

echo.
echo ========================================
echo    Iniciando PC-Express...
echo ========================================
echo.

REM Parar processos existentes
echo Parando processos existentes...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":8000" 2^>nul') do taskkill /F /PID %%a >nul 2>&1
for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":5173" 2^>nul') do taskkill /F /PID %%a >nul 2>&1

REM Iniciar servidores
echo Iniciando Backend...
start "PC-Express Backend" /min cmd /c ".venv\Scripts\python.exe -m uvicorn app.main:app --host 0.0.0.0 --port 8000 && pause"

echo Iniciando Frontend...
start "PC-Express Frontend" /min cmd /c "cd frontend && npm run dev && pause"

echo Aguardando servidores iniciarem...
timeout /t 8 /nobreak >nul

echo Abrindo navegador...
start http://localhost:5173/login

echo.
echo ========================================
echo    PC-Express Iniciado com Sucesso!
echo ========================================
echo.
echo Sistema: http://localhost:5173
echo Login:   http://localhost:5173/login
echo.
echo Credenciais:
echo Email: admin@pc-express.com
echo Senha: admin123
echo.
echo Os servidores estao rodando em janelas minimizadas.
echo Para parar, feche as janelas "PC-Express Backend" e "PC-Express Frontend"
echo.
echo Pressione qualquer tecla para fechar...
pause >nul
