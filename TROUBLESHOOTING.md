# 🔧 Troubleshooting - PC Express

Guia completo de soluções para problemas comuns.

---

## 🚨 Problema Mais Comum

### ⚠️ Senha Incorreta Após Clonar o Projeto

**Sintomas:**
- Login falha com "senha incorreta"
- Usando credenciais corretas: `admin@pc-express.com / admin123`
- Acabou de clonar o projeto do GitHub

**Causa:**
O arquivo `inventory.db` (banco de dados SQLite) **não é versionado no Git** por questões de segurança. Quando você clona o projeto, não existe banco de dados nem usuário admin.

**Por que isso acontece?**
```
.gitignore contém:
├── *.db
├── *.sqlite*
└── inventory.db
```

**Solução Automática (Recomendada):**

```cmd
# Windows
iniciar.bat

# Linux/Mac
./bin/start/start.sh
```

O script detecta automaticamente que o banco não existe e executa:
1. Criação das tabelas
2. Criação do usuário admin
3. Seed de dados iniciais (produtos, fornecedores, etc.)

**Solução Manual:**

```cmd
# 1. Ative o ambiente virtual
# Windows:
.venv\Scripts\activate
# Linux/Mac:
source .venv/bin/activate

# 2. Execute o setup do banco
python scripts/setup_db.py

# 3. Verifique se o arquivo foi criado
# Windows:
dir inventory.db
# Linux/Mac:
ls -l inventory.db

# 4. Inicie o sistema
iniciar.bat  # Windows
./bin/start/start.sh  # Linux/Mac
```

**O que o setup_db.py faz:**
- ✅ Cria todas as tabelas do banco
- ✅ Cria usuário admin com senha hasheada
- ✅ Cria 3 fornecedores de exemplo
- ✅ Cria 25 produtos de exemplo
- ✅ Mostra as credenciais de login

**Verificação:**

```cmd
# Após executar, você deve ver:
🎉 Database setup completed successfully!

📋 Default login credentials:
Email: admin@pc-express.com
Password: admin123
```

---

## 🔐 Problemas de Autenticação

### Login não funciona mesmo após criar o banco

**Possíveis causas:**

1. **Banco corrompido**
   ```cmd
   # Delete e recrie
   del inventory.db  # Windows
   rm inventory.db   # Linux/Mac
   python scripts/setup_db.py
   ```

2. **Cache do navegador**
   ```
   - Pressione Ctrl + Shift + Del
   - Limpe cache e cookies do localhost
   - Tente novamente
   ```

3. **Backend não está rodando**
   ```cmd
   # Verifique se está na porta 8000
   # Windows:
   netstat -ano | findstr :8000
   # Linux/Mac:
   lsof -i :8000
   ```

### Token expirado

**Sintoma:** Sessão expira constantemente

**Solução:**
- Token JWT expira após 30 minutos (padrão)
- Faça login novamente
- Se quiser mudar, edite `app/auth.py`:
  ```python
  ACCESS_TOKEN_EXPIRE_MINUTES = 30  # Altere para o tempo desejado
  ```

---

## 🐍 Problemas com Python

### Python não encontrado

**Sintoma:**
```
'python' is not recognized as an internal or external command
```

**Solução:**

1. **Instale Python 3.8+**
   - Download: https://www.python.org/downloads/
   - ⚠️ **IMPORTANTE:** Marque "Add Python to PATH" durante instalação

2. **Verifique instalação**
   ```cmd
   python --version
   # Deve mostrar: Python 3.8.x ou superior
   ```

3. **Se ainda não funcionar**
   - Reinicie o terminal
   - Ou adicione manualmente ao PATH

### Erro ao criar ambiente virtual

**Sintoma:**
```
Error: Unable to create process using '.venv\Scripts\python.exe'
```

**Solução:**
```cmd
# Delete o ambiente virtual
rmdir /s /q .venv  # Windows
rm -rf .venv       # Linux/Mac

# Recrie
python -m venv .venv
```

### Dependências não instalam

**Sintoma:**
```
ERROR: Could not install packages due to an OSError
```

**Solução:**

1. **Atualize pip**
   ```cmd
   .venv\Scripts\python.exe -m pip install --upgrade pip
   ```

2. **Instale novamente**
   ```cmd
   .venv\Scripts\python.exe -m pip install -r requirement.txt
   ```

3. **Se persistir (Windows)**
   ```cmd
   # Execute como Administrador
   .venv\Scripts\python.exe -m pip install -r requirement.txt --user
   ```

---

## 📦 Problemas com Node.js

### Node.js não encontrado

**Sintoma:**
```
'node' is not recognized as an internal or external command
```

**Solução:**

1. **Instale Node.js 16+**
   - Download: https://nodejs.org/
   - Escolha a versão LTS (recomendada)

2. **Verifique instalação**
   ```cmd
   node --version
   npm --version
   ```

3. **Reinicie o terminal**

### Erro ao instalar dependências do frontend

**Sintoma:**
```
npm ERR! code ENOENT
npm ERR! syscall open
```

**Solução:**

1. **Limpe cache do npm**
   ```cmd
   npm cache clean --force
   ```

2. **Delete node_modules**
   ```cmd
   cd frontend
   rmdir /s /q node_modules  # Windows
   rm -rf node_modules       # Linux/Mac
   ```

3. **Reinstale**
   ```cmd
   npm install
   ```

### Vite não inicia

**Sintoma:**
```
Error: Cannot find module 'vite'
```

**Solução:**
```cmd
cd frontend
npm install vite --save-dev
npm run dev
```

---

## 🌐 Problemas de Porta

### Porta 8000 já em uso (Backend)

**Sintoma:**
```
ERROR: [Errno 10048] error while attempting to bind on address ('0.0.0.0', 8000)
```

**Solução 1 - Parar processo:**
```cmd
# Windows
netstat -ano | findstr :8000
taskkill /F /PID <PID>

# Linux/Mac
lsof -i :8000
kill -9 <PID>
```

**Solução 2 - Usar outra porta:**
```cmd
# Edite a porta no comando
uvicorn app.main:app --host 0.0.0.0 --port 8001
```

### Porta 5173 já em uso (Frontend)

**Sintoma:**
```
Port 5173 is in use, trying another one...
```

**Solução:**
```cmd
# Windows
netstat -ano | findstr :5173
taskkill /F /PID <PID>

# Linux/Mac
lsof -i :5173
kill -9 <PID>
```

---

## 💻 Problemas do PowerShell

### Execution Policy

**Sintoma:**
```
cannot be loaded because running scripts is disabled on this system
```

**Solução:**
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

**Explicação:**
- `RemoteSigned`: Permite scripts locais, requer assinatura para scripts baixados
- `CurrentUser`: Aplica apenas ao usuário atual (não precisa admin)

---

## 🔄 Problemas de CORS

### Erro CORS no navegador

**Sintoma:**
```
Access to XMLHttpRequest has been blocked by CORS policy
```

**Causa:**
Frontend não está rodando via servidor HTTP (aberto como arquivo local)

**Solução:**
- ✅ **SEMPRE** inicie o frontend via `npm run dev`
- ❌ **NUNCA** abra o `index.html` diretamente no navegador

**Por quê?**
```
❌ file:///C:/projeto/frontend/index.html  (não funciona)
✅ http://localhost:5173                   (funciona)
```

---

## 📊 Problemas com Machine Learning

### Dados insuficientes para ML

**Sintoma:**
```
Insufficient data for prediction
```

**Solução:**
```cmd
# Gere dados de exemplo (30 dias)
# No frontend:
1. Vá em Insights
2. Clique em "Generate Initial Data (30 days)"
```

**Ou via script:**
```cmd
.venv\Scripts\activate
python scripts/sales_simulator.py
```

### Modelo ML não treina

**Sintoma:**
Insights ML retornam erros ou valores vazios

**Requisitos mínimos:**
- Previsão de Demanda: 14 dias de vendas
- Otimização de Preços: 2 variações de preço
- Detecção de Anomalias: 7 dias de vendas

**Solução:**
Aguarde acumular mais dados ou use o gerador de dados.

---

## 🗄️ Problemas com Banco de Dados

### Banco corrompido

**Sintoma:**
```
sqlite3.DatabaseError: database disk image is malformed
```

**Solução:**
```cmd
# Backup (se houver dados importantes)
copy inventory.db inventory.db.backup  # Windows
cp inventory.db inventory.db.backup    # Linux/Mac

# Delete e recrie
del inventory.db  # Windows
rm inventory.db   # Linux/Mac

# Recrie o banco
.venv\Scripts\activate
python scripts/setup_db.py
```

### Migrations/Schema desatualizado

**Sintoma:**
Erros sobre colunas ou tabelas não encontradas

**Solução:**
```cmd
# Recrie o banco do zero
del inventory.db
python scripts/setup_db.py
```

> ⚠️ **Aviso:** Isso apaga todos os dados! Faça backup se necessário.

---

## 🔍 Debugging Avançado

### Verificar logs do backend

**Terminal do backend mostra:**
```
INFO:     Started server process
INFO:     Waiting for application startup.
INFO:     Application startup complete.
INFO:     Uvicorn running on http://0.0.0.0:8000
```

**Erro 500:**
Verifique stack trace no terminal do backend

### Verificar logs do frontend

**Console do navegador (F12):**
- Aba Console: Erros JavaScript
- Aba Network: Erros de API (status 401, 500, etc.)

### Modo Debug

**Backend:**
```cmd
uvicorn app.main:app --reload --log-level debug
```

**Frontend:**
```cmd
# Vite já roda em modo dev com hot-reload
npm run dev
```

---

## 🆘 Ainda com Problemas?

### Checklist Completo

1. ✅ Python 3.8+ instalado e no PATH
2. ✅ Node.js 16+ instalado
3. ✅ Ambiente virtual criado (`.venv`)
4. ✅ Dependências Python instaladas
5. ✅ Dependências Node instaladas (`frontend/node_modules`)
6. ✅ Banco de dados criado (`inventory.db` existe)
7. ✅ Backend rodando na porta 8000
8. ✅ Frontend rodando na porta 5173
9. ✅ Nenhum firewall bloqueando portas
10. ✅ Navegador atualizado

### Reset Completo

Se nada funcionar, reset total:

```cmd
# 1. Pare tudo
bin\start\stop.bat

# 2. Delete tudo
rmdir /s /q .venv
rmdir /s /q frontend\node_modules
del inventory.db

# 3. Reinicie
iniciar.bat
```

### Reportar Problema

Se ainda tiver problemas, forneça:
1. Sistema operacional e versão
2. Versão do Python (`python --version`)
3. Versão do Node.js (`node --version`)
4. Mensagem de erro completa
5. Passos para reproduzir

---

**Documentação adicional:**
- [README.md](README.md) - Documentação principal
- [INICIO_RAPIDO.md](INICIO_RAPIDO.md) - Guia de início rápido
- [SCRIPTS.md](SCRIPTS.md) - Documentação dos scripts

**Equipe Big 5** | PC-Express © 2024

