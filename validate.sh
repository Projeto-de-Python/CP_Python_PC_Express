#!/bin/bash
echo "🔍 Validando qualidade do código..."
echo

python code-quality/scripts/validate_code_quality.py

if [ $? -ne 0 ]; then
    echo ""
    echo "❌ Validação falhou!"
    exit 1
fi

echo ""
echo "✅ Validação passou!"
