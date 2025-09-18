@echo off
echo ========================================
echo 🔍 PC-Express - Monitor de Plagio
echo ========================================
echo.
echo Iniciando monitoramento de plágio...
echo.

REM Verificar se Python está instalado
python --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Python não encontrado!
    echo 📥 Instale Python 3.8+ de: https://www.python.org/downloads/
    pause
    exit /b 1
)

REM Verificar se requests está instalado
python -c "import requests" >nul 2>&1
if errorlevel 1 (
    echo 📦 Instalando dependências...
    pip install requests
)

REM Executar monitoramento
echo 🚀 Executando monitoramento...
python scripts/monitor_plagiarism.py

echo.
echo ========================================
echo ✅ Monitoramento concluído!
echo 📁 Verifique a pasta 'reports' para os resultados
echo ========================================
pause
