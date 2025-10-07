#!/bin/bash

# Script de deploy para Portainer
# PC Express - Sistema de Gerenciamento de Estoque

set -e

# Cores para output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

echo "🚀 Deploy do PC Express para Portainer"
echo "======================================"
echo

# Verificar se Docker está instalado
if ! command -v docker &> /dev/null; then
    echo "❌ Docker não encontrado. Instale o Docker primeiro."
    exit 1
fi

# Verificar se docker-compose está instalado
if ! command -v docker-compose &> /dev/null; then
    echo "❌ docker-compose não encontrado. Instale o docker-compose primeiro."
    exit 1
fi

print_status "Verificando arquivos necessários..."

# Verificar se os arquivos existem
required_files=(
    "docker-compose.yml"
    "Dockerfile.backend"
    "Dockerfile.frontend"
    "requirement.txt"
    "frontend/package.json"
)

for file in "${required_files[@]}"; do
    if [ ! -f "$file" ]; then
        echo "❌ Arquivo $file não encontrado"
        exit 1
    fi
done

print_success "Todos os arquivos necessários encontrados"

# Criar arquivo .env se não existir
if [ ! -f ".env" ]; then
    print_status "Criando arquivo .env..."
    cat > .env << EOF
# Configurações do PC Express para Produção
SECRET_KEY=$(openssl rand -hex 32)
DATABASE_URL=sqlite:///./data/inventory.db
DEBUG=False
API_URL=http://localhost:8000
FRONTEND_URL=http://localhost:5173
EOF
    print_success "Arquivo .env criado"
fi

print_status "Construindo imagens Docker..."

# Construir imagens
docker-compose build

print_success "Imagens construídas com sucesso"

print_status "Iniciando serviços..."

# Iniciar serviços
docker-compose up -d

print_success "Serviços iniciados com sucesso"

echo
echo "======================================"
print_success "Deploy concluído com sucesso!"
echo "======================================"
echo
echo "🌐 Acesse:"
echo "   Frontend: http://localhost:5173"
echo "   Backend:  http://localhost:8000"
echo "   API Docs: http://localhost:8000/docs"
echo
echo "📊 Para ver logs:"
echo "   docker-compose logs -f"
echo
echo "🛑 Para parar:"
echo "   docker-compose down"
echo
echo "🔄 Para atualizar:"
echo "   docker-compose pull && docker-compose up -d"
echo
