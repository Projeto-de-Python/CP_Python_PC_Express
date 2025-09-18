# 🚀 PC-Express - Sistema de Gerenciamento de Inventário

<div align="center">

## 🚨 **AVISO DE PROPRIEDADE INTELECTUAL** 🚨

**Este projeto é propriedade da Equipe Big 5**
**Desenvolvido como trabalho acadêmico**
**NÃO COPIAR PARA TRABALHOS ACADÊMICOS**

---

</div>

Um sistema completo de gerenciamento de inventário desenvolvido com FastAPI (backend) e React (frontend), oferecendo uma interface moderna e intuitiva para controle de estoque, fornecedores, alertas e insights de negócio com **Machine Learning**.

## ⚖️ **Direitos Autorais e Uso**

### 📋 **Propriedade Intelectual:**

- **Código**: © 2024 Equipe Big 5
- **Documentação**: © 2024 Equipe Big 5
- **Conceitos**: © 2024 Equipe Big 5
- **Apresentação**: © 2024 Equipe Big 5

### ✅ **Uso Permitido:**

- ✅ Estudo e aprendizado pessoal
- ✅ Referência acadêmica (com citação adequada)
- ✅ Inspiração para projetos próprios
- ✅ Demonstração de conceitos

### ❌ **Uso Proibido:**

- ❌ **Cópia integral** para trabalhos acadêmicos
- ❌ **Plágio** de código ou documentação
- ❌ **Fork** para fins acadêmicos sem citação
- ❌ **Uso comercial** sem autorização
- ❌ **Apresentação** como trabalho próprio

### 📚 **Para Estudantes:**

Se você é estudante e quer usar este projeto como referência:

1. **CITE adequadamente** a fonte original
2. **NÃO copie** código diretamente
3. **Use apenas como inspiração** para seu próprio projeto
4. **Desenvolva sua própria implementação** baseada nos conceitos
5. **Mencione** que foi inspirado no PC-Express da Equipe Big 5

---

## 📚 **[Apresentação para o Professor](ABOUT.md)**

_Clique aqui para ver a apresentação didática focada em Python + SQL, com exemplos práticos e diagramas visuais._

## ⚡ **Início Rápido**

### **Para Novos Usuários:**

#### 🖥️ **Windows (Recomendado):**

```cmd
iniciar.bat
```

#### 🖥️ **Windows (PowerShell):**

```powershell
.\start.ps1
```

#### 🐧 **Linux / 🍎 Mac:**

```bash
./start.sh
```

### **Se der erro de permissão no PowerShell:**

```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
.\start.ps1
```

### **O que os scripts fazem automaticamente:**

- ✅ Verifica dependências (Python, Node.js)
- ✅ Instala se necessário (com instruções)
- ✅ Configura ambiente (venv, dependências, banco)
- ✅ Inicia servidores (backend + frontend)
- ✅ Abre navegador na página de login
- ✅ **Auto-reinicialização** se servidores pararem
- ✅ **Monitoramento contínuo** de recursos
- ✅ **Otimizações de performance** integradas

### **📋 Pré-requisitos:**

- **Python 3.8+** - [Download](https://www.python.org/downloads/)
- **Node.js 16+** - [Download](https://nodejs.org/)

> 💡 **Dica:** Se tiver problemas, consulte o arquivo [INICIO_RAPIDO.md](INICIO_RAPIDO.md) para soluções detalhadas!

### **Credenciais:**

- **Email:** `admin@pc-express.com`
- **Senha:** `admin123`

### **URLs:**

- **Sistema:** http://localhost:5173
- **API:** http://localhost:8000
- **Documentação:** http://localhost:8000/docs

### **Para Parar:**

```cmd
.\stop.bat
```

**O script de parada é inteligente:**

- ✅ Para apenas processos relacionados ao PC-Express
- ✅ Preserva outros aplicativos Python/Node.js do sistema
- ✅ Mostra logs detalhados dos processos finalizados
- ✅ Verifica múltiplas formas de identificação (porta, comando, diretório)

### **Opções Avançadas:**

```powershell
# Com debug (mostra logs detalhados)
.\start.ps1 -Debug

# Sem abrir navegador
.\start.ps1 -SkipBrowser

# Forçar reinicialização
.\start.ps1 -Force
```

## 🎯 **Funcionalidades Principais**

### **📊 Dashboard Interativo**

- Métricas em tempo real (produtos, fornecedores, alertas)
- Gráficos de performance e categorias
- Alertas de estoque baixo
- Produtos em destaque por valor

### **📦 Gerenciamento de Produtos**

- CRUD completo com categorização
- Controle de estoque com níveis mínimos
- Códigos únicos e descrições detalhadas
- Integração com fornecedores

### **🏢 Sistema de Fornecedores**

- Cadastro completo de parceiros comerciais
- Informações de contato e CNPJ
- Histórico de relacionamento

### **📋 Pedidos de Compra**

- Criação e acompanhamento de pedidos
- Status de aprovação e cancelamento
- Integração com fornecedores e produtos

### **⚠️ Alertas Inteligentes**

- Monitoramento automático de estoque baixo
- Notificações em tempo real
- Priorização por criticidade

### **🤖 Machine Learning Avançado**

- **Previsão de Demanda:** Algoritmos de regressão linear com features temporais
- **Otimização de Preços:** Análise de elasticidade de preço
- **Detecção de Anomalias:** Isolation Forest para identificar padrões anômalos
- **Otimização de Estoque:** Cálculo de ponto de reposição e cobertura

### **🔄 Reabastecimento Automático**

- Sugestões inteligentes baseadas em ML
- Cálculo de demanda prevista
- Otimização de níveis de estoque

## 🎨 **Interface e Experiência**

- **Design Moderno:** Interface glassmorphism com gradientes
- **Responsivo:** Funciona perfeitamente em desktop e mobile
- **Temas:** Alternância entre modo claro e escuro
- **Internacionalização:** Português e Inglês com persistência
- **Animações:** Transições suaves e feedback visual

## 🛠️ **Tecnologias**

### **Backend**

- **Framework:** FastAPI
- **ORM:** SQLAlchemy
- **Banco de Dados:** SQLite
- **Autenticação:** JWT com passlib[bcrypt]
- **Validação:** Pydantic
- **Machine Learning:** Scikit-learn, Pandas, NumPy

### **Frontend**

- **Framework:** React 18
- **UI Library:** Material-UI (MUI)
- **Build Tool:** Vite
- **Roteamento:** React Router DOM
- **Gráficos:** Recharts
- **Ícones:** Lucide React
- **Internacionalização:** React-i18next

## 📋 **Pré-requisitos**

- **Python 3.8+** - [Download](https://www.python.org/downloads/)
- **Node.js 16+** - [Download](https://nodejs.org/)

> **💡 Dica:** O script de inicialização verifica automaticamente se estes pré-requisitos estão instalados.

## 🚀 **Instalação e Execução**

### **1. Clone o repositório**

```bash
git clone <url-do-repositorio>
cd CP_Python_PC_Express
```

### **2. Opções de Instalação**

#### **Opção A: Instalação Automática (Recomendado)**

```powershell
# Windows
.\start.ps1

# Linux/Mac
chmod +x start.sh
./start.sh
```

#### **Opção B: Setup Manual**

```bash
# Windows
.\setup.bat

# Linux/Mac
chmod +x setup.sh
./setup.sh
```

#### **Opção C: Docker (Ambiente Isolado)**

```bash
# Instalar e executar com Docker
docker-compose up --build

# Ou apenas backend
docker build -f Dockerfile.backend -t pc-express-backend .
docker run -p 8000:8000 pc-express-backend

# Ou apenas frontend
docker build -f Dockerfile.frontend -t pc-express-frontend .
docker run -p 5173:5173 pc-express-frontend
```

**O script fará automaticamente:**

- ✅ Verificação de pré-requisitos
- ✅ Criação do ambiente virtual Python
- ✅ Instalação de dependências
- ✅ Configuração do banco de dados
- ✅ Inicialização dos servidores
- ✅ Abertura do navegador

### **3. Parâmetros Opcionais**

```powershell
.\start.ps1 -SkipBrowser    # Não abre navegador
.\start.ps1 -Force          # Força reinicialização
```

### **4. Configuração Manual (Opcional)**

Se preferir configurar manualmente:

#### **Backend**

```bash
# Criar ambiente virtual
python -m venv .venv

# Ativar ambiente virtual
.venv\Scripts\activate  # Windows
# source .venv/bin/activate  # Linux/Mac

# Instalar dependências
pip install -r requirement.txt

# Configurar banco
python scripts/setup_db.py
```

#### **Frontend**

```bash
cd frontend
npm install
cd ..
```

## 🔧 **Execução Manual**

### **Terminal 1 - Backend**

```bash
# Ative o ambiente virtual primeiro
.venv\Scripts\activate  # Windows
# source .venv/bin/activate  # Linux/Mac

# Execute o servidor FastAPI
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### **Terminal 2 - Frontend**

```bash
cd frontend
npm run dev
```

## 🤖 **Machine Learning**

### **Como Usar ML:**

1. **Geração de Dados Iniciais** (Opcional)

   - Acesse a aba **Insights**
   - Clique em **"Generate Initial Data (30 days)"**
   - Isso só cria dados se não existirem vendas no sistema

2. **Análise ML de Produtos**

   - Vá para a aba **Products**
   - Clique no ícone **🧠 (Brain)** ao lado de qualquer produto
   - O sistema automaticamente muda para **Insights > 🤖 ML Insights**

3. **Funcionalidades ML:**
   - **📈 Previsão de Demanda:** Demanda para os próximos 30 dias
   - **💰 Otimização de Preços:** Preço ótimo para maximizar receita
   - **⚠️ Detecção de Anomalias:** Identificação de vendas anômalas
   - **📦 Otimização de Estoque:** Recomendações de estoque ótimo

### **Requisitos de Dados:**

- **Mínimo para Previsão:** 14 dias de dados de vendas
- **Mínimo para Preços:** 2 variações de preço diferentes
- **Mínimo para Anomalias:** 7 dias de dados de vendas

## 🚨 **Solução de Problemas**

### **"Execution Policy" no PowerShell:**

```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### **Python não encontrado:**

1. Baixe Python 3.8+ de: https://www.python.org/downloads/
2. **IMPORTANTE:** Marque "Add Python to PATH" durante a instalação
3. Execute o script novamente

### **Node.js não encontrado:**

1. Baixe Node.js 16+ de: https://nodejs.org/
2. Execute o script novamente

### **Porta já em uso:**

```cmd
.\stop.bat
# Ou
.\start.ps1 -Force
```

### **Dependências não instalam:**

```cmd
# Delete as pastas e execute novamente
rmdir /s /q .venv
rmdir /s /q frontend\node_modules
.\start.ps1
```

## 📁 **Estrutura do Projeto**

```
CP_Python_PC_Express/
├── app/                    # Backend FastAPI
│   ├── routers/           # Rotas da API
│   ├── services/          # ML e simulação
│   ├── models.py          # Modelos do banco
│   ├── schemas.py         # Schemas Pydantic
│   ├── auth.py            # Autenticação
│   ├── database.py        # Configuração do banco
│   └── main.py            # Aplicação principal
├── frontend/              # Frontend React
│   ├── src/
│   │   ├── components/    # Componentes React
│   │   ├── services/      # Serviços de API
│   │   ├── contexts/      # Contextos React
│   │   ├── locales/       # Arquivos de tradução
│   │   └── utils/         # Utilitários
│   ├── package.json
│   └── vite.config.js
├── scripts/               # Scripts de configuração
│   ├── setup_db.py        # Configuração inicial
│   └── seed.py            # Dados de exemplo
├── start.ps1              # Script de inicialização
├── stop.bat               # Script para parar
├── requirement.txt        # Dependências Python
└── README.md              # Este arquivo
```

## 🔒 **Segurança e Privacidade**

- **Dados Locais:** Tudo fica no seu SQLite
- **Sem Envio Externo:** Nenhum dado é enviado para APIs externas
- **Processamento Local:** Todos os cálculos ML são feitos localmente
- **Controle Total:** Você tem controle completo sobre os dados

## 📊 **Banco de Dados**

O sistema utiliza SQLite com as seguintes tabelas:

- **users:** Usuários do sistema
- **suppliers:** Fornecedores
- **products:** Produtos
- **stock_movements:** Movimentações de estoque
- **sales:** Vendas
- **sale_items:** Itens de venda
- **purchase_orders:** Pedidos de compra
- **purchase_order_items:** Itens dos pedidos

## 🔧 **Melhorias de Estabilidade (v2.0)**

### **Problemas Resolvidos:**

- ✅ **Navegador duplo** - Corrigido problema de abertura dupla
- ✅ **Crashes inesperados** - Auto-reinicialização até 5 tentativas
- ✅ **Sobrecarga de memória** - Otimizações de Node.js e Python
- ✅ **Timeout de requisições** - Timeout de 10s configurado
- ✅ **Monitoramento inadequado** - Verificação contínua de recursos
- ✅ **Detecção de frontend** - Corrigido problema de detecção IPv6/IPv4
- ✅ **Script de parada** - Parada específica apenas dos processos do PC-Express

### **Otimizações Implementadas:**

- 🚀 **Pool de conexões SQLite** com timeouts e reciclagem
- 🚀 **Limite de memória Node.js** (2GB) para evitar crashes
- 🚀 **Configurações uvicorn otimizadas** com limites de concorrência
- 🚀 **Auto-refresh reduzido** de 30s para 60s no Dashboard
- 🚀 **Monitoramento de recursos** do sistema em tempo real
- 🚀 **Logs detalhados** com timestamps para debug
- 🚀 **Detecção de porta melhorada** - Suporte IPv4 e IPv6
- 🚀 **Parada inteligente** - Preserva outros processos Python/Node.js do sistema

### **Como Usar as Melhorias:**

```powershell
# Uso normal (com todas as melhorias)
.\start.ps1

# Com debug para ver logs detalhados
.\start.ps1 -Debug

# Sem abrir navegador automaticamente
.\start.ps1 -SkipBrowser
```

## 🚀 **Deploy**

### **Desenvolvimento**

O projeto está configurado para desenvolvimento local com hot-reload.

### **Produção**

Para deploy em produção, considere:

- Usar um banco de dados mais robusto (PostgreSQL, MySQL)
- Configurar um servidor web (Nginx, Apache)
- Implementar HTTPS
- Configurar variáveis de ambiente
- Usar um servidor WSGI para o FastAPI

## 🤝 **Contribuição**

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📝 **Licença**

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 👥 **Equipe**

**Integrantes Big 5:**

1. Lucca Phelipe Masini RM 564121
2. Luiz Henrique Poss RM562177
3. Luis Fernando de Oliveira Salgado RM 561401
4. Igor Paixão Sarak RM 563726
5. Bernardo Braga Perobeli RM 56246

## 🎓 **Informações Acadêmicas**

### 📅 **Detalhes do Trabalho:**

- **Data de Desenvolvimento**: 2024
- **Tipo**: Trabalho Acadêmico
- **Apresentação**: Realizada em sala de aula
- **Status**: Concluído e avaliado

### 📚 **Contexto Acadêmico:**

Este projeto foi desenvolvido como trabalho acadêmico para demonstrar:

- Integração de Python com SQL
- Desenvolvimento de APIs REST
- Machine Learning aplicado
- Desenvolvimento Full-Stack
- Boas práticas de programação

### ⚖️ **Aviso Final:**

**Este é um trabalho acadêmico original da Equipe Big 5. Qualquer uso indevido, cópia ou plágio será considerado violação de propriedade intelectual e pode resultar em consequências acadêmicas.**

## 📞 **Suporte**

Para suporte ou dúvidas, entre em contato através dos canais disponibilizados no projeto.

---

**PC-Express** - Transformando o gerenciamento de inventário em uma experiência simples e eficiente! 🚀
