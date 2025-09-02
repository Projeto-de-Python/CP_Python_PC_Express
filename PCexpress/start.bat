@echo off
echo ========================================
echo    PCexpress - Inicializacao Rapida
echo ========================================
echo.

echo Verificando Python...
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERRO: Python nao encontrado!
    echo Instale Python 3.8+ em: https://www.python.org/downloads/
    pause
    exit /b 1
)
echo OK: Python encontrado

echo.
echo Verificando Node.js...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERRO: Node.js nao encontrado!
    echo Instale Node.js 16+ em: https://nodejs.org/
    pause
    exit /b 1
)
echo OK: Node.js encontrado

echo.
echo Configurando ambiente Python...

if not exist ".venv" (
    echo Criando ambiente virtual...
    python -m venv .venv
)

echo Ativando ambiente virtual...
call .venv\Scripts\activate.bat

if not exist ".venv\Lib\site-packages\fastapi" (
    echo Instalando dependencias Python...
    pip install -r requirement.txt
    echo OK: Dependencias Python instaladas
) else (
    echo OK: Dependencias Python ja instaladas
)

echo.
echo Configurando banco de dados...

if not exist "inventory.db" (
    echo Configurando banco...
    python scripts/setup_db.py
    echo OK: Banco configurado
) else (
    echo OK: Banco ja configurado
)

echo.
echo Configurando frontend...

cd frontend
if not exist "node_modules" (
    echo Instalando dependencias Node.js...
    npm install
    echo OK: Dependencias Node.js instaladas
) else (
    echo OK: Dependencias Node.js ja instaladas
)
cd ..

echo.
echo ========================================
echo    Iniciando Servidores
echo ========================================
echo.

echo Iniciando backend...
start "Backend" cmd /k "call .venv\Scripts\activate.bat && uvicorn app.main:app --reload --host 0.0.0.0 --port 8000"

timeout /t 5 /nobreak >nul

echo Iniciando frontend...
start "Frontend" cmd /k "cd frontend && npm run dev"

timeout /t 10 /nobreak >nul

echo.
echo ========================================
echo    PCexpress Inicializado!
echo ========================================
echo.
echo URLs de Acesso:
echo   Frontend: http://localhost:5173
echo   Backend:  http://localhost:8000
echo   API Docs: http://localhost:8000/docs
echo.
echo Credenciais:
echo   Email: admin@pc-express.com
echo   Senha: admin123
echo.
echo Os servidores estao rodando em janelas separadas.
echo Feche as janelas para parar os servidores.
echo.
pause
