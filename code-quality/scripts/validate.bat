@echo off
echo Validando codigo...
python code-quality/scripts/validate_code_quality.py
if %errorlevel% neq 0 (
    echo.
    echo Validacao falhou!
    pause
    exit /b 1
)
echo.
echo Validacao passou!
pause
