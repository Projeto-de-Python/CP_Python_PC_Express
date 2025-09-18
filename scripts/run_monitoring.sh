#!/bin/bash

echo "========================================"
echo "🔍 PC-Express - Monitor de Plágio"
echo "========================================"
echo ""
echo "Iniciando monitoramento de plágio..."
echo ""

# Verificar se Python está instalado
if ! command -v python3 &> /dev/null; then
    echo "❌ Python3 não encontrado!"
    echo "📥 Instale Python 3.8+ de: https://www.python.org/downloads/"
    exit 1
fi

# Verificar se requests está instalado
if ! python3 -c "import requests" &> /dev/null; then
    echo "📦 Instalando dependências..."
    pip3 install requests
fi

# Executar monitoramento
echo "🚀 Executando monitoramento..."
python3 scripts/monitor_plagiarism.py

echo ""
echo "========================================"
echo "✅ Monitoramento concluído!"
echo "📁 Verifique a pasta 'reports' para os resultados"
echo "========================================"
