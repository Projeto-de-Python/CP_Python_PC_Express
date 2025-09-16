#!/bin/bash
echo "Validando codigo..."
python code-quality/scripts/validate_code_quality.py

if [ $? -ne 0 ]; then
    echo ""
    echo "Validacao falhou!"
    exit 1
fi

echo ""
echo "Validacao passou!"
