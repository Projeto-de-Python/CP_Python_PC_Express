# 🚀 Guia de Inicialização Rápida - PCexpress

## 📋 Visão Geral

Este guia mostra como inicializar o sistema PCexpress de forma simples e automatizada, mesmo em computadores que nunca viram o projeto antes.

## 🎯 Scripts Disponíveis

### 1. **start.bat** ⭐ **RECOMENDADO**
Script batch simples e funcional que automatiza toda a inicialização.

### 2. **Configuração Manual**
Passos manuais para configuração avançada (opcional).

## 🚀 Como Usar

### **Opção 1: CMD (Recomendado)**
```cmd
# Execução básica
.\start.bat
```

### **Opção 2: Duplo Clique**
- Clique duas vezes em `start.bat`
- O script será executado automaticamente

### **Opção 3: Configuração Manual**
Siga os passos manuais descritos no README.md

## 🔧 O que o Script Faz

### **1. Verificações Automáticas**
- ✅ Verifica se Python 3.8+ está instalado
- ✅ Verifica se Node.js 16+ está instalado
- ✅ Verifica se as portas 8000 e 5173 estão livres

### **2. Configuração do Ambiente**
- 📦 Cria ambiente virtual Python (se não existir)
- 🔧 Ativa o ambiente virtual
- 📥 Instala dependências Python (FastAPI, SQLAlchemy, etc.)
- 🗄️ Configura banco de dados SQLite
- 📥 Instala dependências Node.js (React, Vite, etc.)

### **3. Inicialização dos Servidores**
- 🚀 Inicia servidor backend (FastAPI) na porta 8000
- 🎨 Inicia servidor frontend (React) na porta 5173
- ⏳ Aguarda ambos os servidores estarem prontos

### **4. Interface Amigável**
- 🎨 Output colorido e organizado
- 📊 Progresso em tempo real
- ❌ Tratamento de erros detalhado
- 💡 Sugestões de solução

## 🌐 URLs de Acesso

Após a inicialização bem-sucedida:

- **Frontend:** http://localhost:5173
- **Backend:** http://localhost:8000
- **API Docs:** http://localhost:8000/docs

## 🔐 Credenciais Padrão

- **Email:** admin@pc-express.com
- **Senha:** admin123

## ⚙️ Parâmetros Disponíveis

O script `start.bat` é simples e não requer parâmetros. Ele detecta automaticamente:
- ✅ Se Python e Node.js estão instalados
- ✅ Se as dependências já estão instaladas
- ✅ Se o banco de dados já está configurado

Para reinstalar tudo, simplesmente delete as pastas `.venv` e `frontend/node_modules` e execute novamente.

## 🛠️ Solução de Problemas

### **Erro: "Python não encontrado"**
```bash
# Baixar e instalar Python 3.8+
# https://www.python.org/downloads/
```

### **Erro: "Node.js não encontrado"**
```bash
# Baixar e instalar Node.js 16+
# https://nodejs.org/
```

### **Erro: "Porta já em uso"**
O script tenta liberar automaticamente, mas se persistir:
```powershell
# Parar processos nas portas
netstat -ano | findstr :8000
netstat -ano | findstr :5173
# Usar o PID para parar o processo
taskkill /PID <PID> /F
```

### **Erro: "Execution Policy"**
```powershell
# Executar como administrador
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### **Erro: "Dependências não instalam"**
```cmd
# Delete as pastas e execute novamente
rmdir /s /q .venv
rmdir /s /q frontend\node_modules
.\start.bat
```

## 📱 Primeira Execução vs. Execuções Subsequentes

### **Primeira Execução**
- ⏱️ Tempo: 5-10 minutos
- 📦 Instala todas as dependências
- 🗄️ Configura banco de dados
- 👤 Cria usuário admin

### **Execuções Subsequentes**
- ⏱️ Tempo: 30-60 segundos
- ✅ Reutiliza dependências instaladas
- 🚀 Inicia servidores diretamente

## 🔄 Reinicialização

### **Parar Servidores**
- Pressione `Ctrl+C` no terminal
- Ou feche o terminal

### **Reiniciar**
```cmd
.\start.bat
```

## 📊 Logs e Debug

### **Ver Logs dos Servidores**
Os logs aparecem em tempo real no terminal.

### **Verificar Status**
```powershell
# Verificar se as portas estão ativas
netstat -an | findstr :8000
netstat -an | findstr :5173
```

### **Verificar Processos**
```powershell
# Ver processos Python e Node.js
Get-Process | Where-Object {$_.ProcessName -like "*python*" -or $_.ProcessName -like "*node*"}
```

## 🎯 Exemplo de Execução Completa

```cmd
C:\Users\Usuario\PCexpress> .\start.bat

========================================
   PCexpress - Inicializacao Rapida
========================================

Verificando Python...
OK: Python encontrado

Verificando Node.js...
OK: Node.js encontrado

Configurando ambiente Python...
Ativando ambiente virtual...
OK: Dependencias Python ja instaladas

Configurando banco de dados...
OK: Banco ja configurado

Configurando frontend...
OK: Dependencias Node.js ja instaladas

========================================
   Iniciando Servidores
========================================

Iniciando backend...
Iniciando frontend...

========================================
   PCexpress Inicializado!
========================================

URLs de Acesso:
  Frontend: http://localhost:5173
  Backend:  http://localhost:8000
  API Docs: http://localhost:8000/docs

Credenciais:
  Email: admin@pc-express.com
  Senha: admin123

Os servidores estao rodando em janelas separadas.
Feche as janelas para parar os servidores.

Pressione qualquer tecla para continuar. . .
```

## 🎉 Pronto!

Agora você tem um sistema de inicialização completo e automatizado que funciona em qualquer máquina Windows! 

**Para distribuir o projeto, basta incluir:**
- `start.bat` (script principal)
- `INICIALIZACAO.md` (documentação)
- Todo o código do projeto

**O usuário final só precisa:**
1. Instalar Python 3.8+ e Node.js 16+
2. Executar `.\start.bat`
3. Acessar http://localhost:5173

**Simples assim!** 🚀
