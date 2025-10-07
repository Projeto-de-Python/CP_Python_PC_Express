@echo off
echo 🔍 Validando qualidade do código...
echo.

python code-quality/scripts/validate_code_quality.py

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ✅ Validação passou!
) else (
    echo.
    echo ❌ Validação falhou!
    exit /b 1
)
