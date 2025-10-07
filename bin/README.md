# 📁 Scripts Organizados - PC-Express

Esta pasta contém todos os scripts auxiliares do projeto, organizados por funcionalidade.

## 📂 Estrutura

```
bin/
├── start/          Scripts de inicialização e parada
├── test/           Scripts de teste e validação de instalação
├── quality/        Scripts de validação de qualidade de código
└── deploy/         Scripts de deploy e produção
```

---

## 🚀 `/start` - Inicialização e Controle

Scripts para iniciar e parar o sistema.

### Windows

#### `start.bat`
Script de inicialização simplificado para Windows.

**Uso:**
```cmd
bin\start\start.bat
```

**Características:**
- ✅ Verificação de dependências
- ✅ Configuração automática do ambiente
- ✅ Inicialização de backend e frontend
- ✅ Abertura automática do navegador

---

#### `start.ps1`
Script avançado PowerShell com monitoramento e auto-reinicialização.

**Uso:**
```powershell
# Inicialização normal
bin\start\start.ps1

# Sem abrir navegador
bin\start\start.ps1 -SkipBrowser

# Com debug verbose
bin\start\start.ps1 -Debug

# Forçar reinicialização
bin\start\start.ps1 -Force
```

**Características:**
- ✅ Monitoramento contínuo de saúde dos servidores
- ✅ Auto-reinicialização até 5 tentativas
- ✅ Verificação de recursos do sistema
- ✅ Otimizações de memória
- ✅ Logs detalhados com timestamps

---

#### `stop.bat`
Para todos os servidores PC-Express em execução.

**Uso:**
```cmd
bin\start\stop.bat
```

**Características:**
- ✅ Para processos nas portas 8000 e 5173
- ✅ Para processos específicos do PC-Express
- ✅ Preserva outros processos Python/Node.js do sistema

---

## 🧪 `/test` - Testes de Instalação

Scripts para validar se o ambiente está configurado corretamente.

### `test-installation.bat` (Windows)

Testa todos os pré-requisitos e dependências no Windows.

**Uso:**
```cmd
bin\test\test-installation.bat
```

**Testes realizados:**
- ✅ Verificação de Python 3.8+
- ✅ Verificação de Node.js 16+
- ✅ Verificação de npm
- ✅ Verificação de arquivos essenciais
- ✅ Teste de importação Python
- ✅ Teste de execução Node.js
- ✅ Verificação de Docker (opcional)

---

### `test-installation.sh` (Linux/Mac)

Versão Linux/Mac do script de teste de instalação.

**Uso:**
```bash
chmod +x bin/test/test-installation.sh
./bin/test/test-installation.sh
```

**Características:**
- ✅ Mesmos testes da versão Windows
- ✅ Output colorido com status
- ✅ Contador de testes aprovados/reprovados

---

## 🔍 `/quality` - Validação de Qualidade

Scripts para validar a qualidade do código.

### `validate.bat` (Windows)

Executa validação de qualidade de código no Windows.

**Uso:**
```cmd
bin\quality\validate.bat
```

**Validações:**
- ✅ Estrutura de código
- ✅ Boas práticas
- ✅ Hooks React
- ✅ Padrões de projeto

---

### `validate.sh` (Linux/Mac)

Versão Linux/Mac do validador de qualidade.

**Uso:**
```bash
chmod +x bin/quality/validate.sh
./bin/quality/validate.sh
```

---

## 🐳 `/deploy` - Deploy e Produção

Scripts para deploy em produção.

### `deploy-portainer.sh`

Script de deploy usando Docker e Portainer.

**Uso:**
```bash
chmod +x bin/deploy/deploy-portainer.sh
./bin/deploy/deploy-portainer.sh
```

**Características:**
- ✅ Verificação de Docker e docker-compose
- ✅ Construção de imagens Docker
- ✅ Criação automática de arquivo .env
- ✅ Inicialização de serviços
- ✅ Instruções de gerenciamento

**Requisitos:**
- Docker instalado
- docker-compose instalado

---

## 📝 Notas Importantes

### Scripts Principais na Raiz

Para facilitar o uso, o script principal permanece na raiz do projeto:

- **`iniciar.bat`** - Script de inicialização principal (recomendado)
  - Mais completo e documentado
  - Mostra progresso em etapas
  - Inclui menu de ajuda (`iniciar.bat --help`)

### Diferenças entre Scripts de Inicialização

| Script | Plataforma | Nível | Características |
|--------|-----------|-------|-----------------|
| `iniciar.bat` (raiz) | Windows | ⭐⭐⭐ Recomendado | Completo, documentado, etapas claras |
| `bin/start/start.bat` | Windows | ⭐⭐ Alternativa | Simples e direto |
| `bin/start/start.ps1` | PowerShell | ⭐⭐⭐ Avançado | Monitoramento, auto-restart, debug |

### Quando Usar Cada Script

**Use `iniciar.bat` (raiz)** se:
- É a primeira vez usando o sistema
- Quer ver o progresso detalhado
- Precisa de mensagens de ajuda claras

**Use `bin/start/start.bat`** se:
- Já conhece o sistema
- Quer inicialização rápida e simples

**Use `bin/start/start.ps1`** se:
- Precisa de monitoramento contínuo
- Quer auto-reinicialização em caso de falhas
- Está depurando problemas

---

## 🛠️ Solução de Problemas

### Script não executa

**Windows:**
```cmd
# Verifique se está no diretório correto
cd C:\caminho\para\CP_Python_PC_Express

# Execute com caminho relativo
bin\start\start.bat
```

**PowerShell com Restrições:**
```powershell
# Liberar execução temporariamente
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser

# Ou use o .bat ao invés do .ps1
```

### Permissões Linux/Mac

```bash
# Dar permissão de execução
chmod +x bin/test/test-installation.sh
chmod +x bin/quality/validate.sh
chmod +x bin/deploy/deploy-portainer.sh

# Executar
./bin/test/test-installation.sh
```

---

## 📚 Mais Informações

- **Documentação Completa:** `README.md` (raiz)
- **Início Rápido:** `INICIO_RAPIDO.md`
- **Machine Learning:** `ML_IMPLEMENTATION.md`
- **Deploy Docker:** `PORTAINER-DEPLOY.md`

---

**Equipe Big 5** - Sistema PC-Express 🚀

