# 🚀 Guia Rápido de Scripts - PC-Express

Este guia fornece uma referência rápida de todos os scripts disponíveis no projeto.

## 📌 Como Usar

### ⭐ Para Iniciar o Sistema

**Opção Principal (Recomendada):**
```cmd
iniciar.bat
```

**Alternativas:**
```cmd
REM Inicialização simples
bin\start\start.bat

REM PowerShell avançado (com monitoramento)
bin\start\start.ps1

REM Ver todas as opções
iniciar.bat --help
```

### 🛑 Para Parar o Sistema

```cmd
bin\start\stop.bat
```

### 🧪 Para Testar a Instalação

```cmd
REM Windows
bin\test\test-installation.bat

REM Linux/Mac
./bin/test/test-installation.sh
```

### 🔍 Para Validar Qualidade do Código

```cmd
REM Windows
bin\quality\validate.bat

REM Linux/Mac
./bin/quality/validate.sh
```

### 🐳 Para Deploy com Docker

```bash
./bin/deploy/deploy-portainer.sh
```

---

## 📂 Estrutura Completa

```
CP_Python_PC_Express/
│
├── iniciar.bat                    ⭐ SCRIPT PRINCIPAL
│
└── bin/                           📁 Scripts organizados
    ├── start/                     🚀 Inicialização
    │   ├── start.bat
    │   ├── start.ps1
    │   └── stop.bat
    │
    ├── test/                      🧪 Testes
    │   ├── test-installation.bat
    │   └── test-installation.sh
    │
    ├── quality/                   🔍 Qualidade
    │   ├── validate.bat
    │   └── validate.sh
    │
    └── deploy/                    🐳 Deploy
        └── deploy-portainer.sh
```

---

## 🎯 Fluxo de Trabalho Típico

### Primeira Vez Usando o Sistema

1. **Testar Instalação:**
   ```cmd
   bin\test\test-installation.bat
   ```

2. **Iniciar Sistema:**
   ```cmd
   iniciar.bat
   ```

3. **Acessar no Navegador:**
   - Sistema: http://localhost:5173
   - Login: http://localhost:5173/login
   - API Docs: http://localhost:8000/docs

4. **Fazer Login:**
   - Email: `admin@pc-express.com`
   - Senha: `admin123`

### Desenvolvimento Diário

1. **Iniciar:**
   ```cmd
   iniciar.bat
   ```

2. **Trabalhar no código...**

3. **Validar Qualidade:**
   ```cmd
   bin\quality\validate.bat
   ```

4. **Parar:**
   ```cmd
   bin\start\stop.bat
   ```

---

## 💡 Dicas e Truques

### Script Principal vs Alternativas

| Script | Quando Usar |
|--------|-------------|
| `iniciar.bat` | Uso geral, primeira vez, documentação clara |
| `bin\start\start.bat` | Já conhece o sistema, quer rapidez |
| `bin\start\start.ps1` | Precisa de monitoramento e auto-restart |

### Opções do PowerShell

```powershell
# Modo debug (mostra logs detalhados)
bin\start\start.ps1 -Debug

# Não abre navegador automaticamente
bin\start\start.ps1 -SkipBrowser

# Força reinicialização (para processos existentes)
bin\start\start.ps1 -Force

# Combinação de opções
bin\start\start.ps1 -Debug -SkipBrowser
```

### Ver Ajuda

```cmd
REM Ajuda completa do script principal
iniciar.bat --help

REM Ou
iniciar.bat -h
iniciar.bat /?
```

---

## 🔧 Solução de Problemas

### "Script não encontrado"

**Problema:** Sistema não encontra os scripts

**Solução:**
```cmd
REM Verifique se está no diretório correto
cd C:\caminho\para\CP_Python_PC_Express

REM Liste os arquivos para confirmar
dir

REM Execute com caminho relativo
bin\start\start.bat
```

### "Permissão negada" no PowerShell

**Problema:** PowerShell bloqueia execução de scripts

**Solução:**
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### "Porta já em uso"

**Problema:** Portas 8000 ou 5173 já estão em uso

**Solução:**
```cmd
REM Para todos os processos PC-Express
bin\start\stop.bat

REM Ou força reinicialização
bin\start\start.ps1 -Force
```

### Scripts não têm permissão (Linux/Mac)

**Problema:** Scripts não podem ser executados

**Solução:**
```bash
# Dar permissão de execução
chmod +x bin/start/*.sh
chmod +x bin/test/*.sh
chmod +x bin/quality/*.sh
chmod +x bin/deploy/*.sh

# Executar
./bin/start/start.sh
```

---

## 📚 Documentação Adicional

- **Documentação Completa:** [README.md](README.md)
- **Guia de Scripts:** [bin/README.md](bin/README.md)
- **Início Rápido:** [INICIO_RAPIDO.md](INICIO_RAPIDO.md)
- **Machine Learning:** [ML_IMPLEMENTATION.md](ML_IMPLEMENTATION.md)
- **Deploy Docker:** [PORTAINER-DEPLOY.md](PORTAINER-DEPLOY.md)

---

## ❓ FAQ

### Qual script devo usar para iniciar?

**Use `iniciar.bat`** - É o script principal, mais completo e documentado.

### Qual a diferença entre iniciar.bat e bin\start\start.bat?

- **`iniciar.bat`** - Script principal na raiz, mais completo, com etapas claras e menu de ajuda
- **`bin\start\start.bat`** - Versão alternativa mais simples, mesmo resultado final

### Preciso sempre usar o caminho completo (bin\start\...)?

Sim, agora que os scripts estão organizados em pastas, você precisa incluir o caminho. A única exceção é o `iniciar.bat` que está na raiz.

### Posso criar atalhos?

Sim! Você pode criar atalhos do Windows/Linux para:
- `iniciar.bat` (na raiz)
- `bin\start\stop.bat`

### Os scripts antigos ainda funcionam?

Não, os scripts foram reorganizados. Use os novos caminhos:
- ❌ `start.bat` → ✅ `bin\start\start.bat` ou `iniciar.bat`
- ❌ `stop.bat` → ✅ `bin\start\stop.bat`
- ❌ `validate.bat` → ✅ `bin\quality\validate.bat`

---

**Desenvolvido pela Equipe Big 5** 🚀

Para mais ajuda, consulte a documentação completa em [README.md](README.md)

