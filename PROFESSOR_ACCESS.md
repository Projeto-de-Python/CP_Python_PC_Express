# 👨‍🏫 Acesso do Professor - PC Express

## 📋 **Informações para o Professor**

Este documento contém informações sobre como o professor pode acessar e contribuir com o projeto PC-Express.

---

## 🎯 **Sobre o Projeto**

**PC-Express** é um sistema de gerenciamento de inventário desenvolvido pela **Equipe Big 5** como trabalho acadêmico.

### **Equipe Big 5:**
- **Lucca Phelipe Masini** (RM 564121)
- **Luiz Henrique Poss** (RM 562177)
- **Luis Fernando de Oliveira Salgado** (RM 561401)
- **Igor Paixão Sarak** (RM 563726)
- **Bernardo Braga Perobeli** (RM 56246)

---

## 🔑 **Acesso do Professor**

### **Para Adicionar o Professor como Colaborador:**

1. **Entre em contato** com a Equipe Big 5
2. **Forneça** seu username do GitHub
3. **Aguarde** o convite de colaboração
4. **Aceite** o convite no GitHub

### **Permissões que serão concedidas:**
- ✅ **Read**: Visualizar todo o código
- ✅ **Write**: Modificar código e documentação
- ✅ **Admin**: Gerenciar configurações (se necessário)

---

## 📚 **Estrutura do Projeto**

### **Backend (Python/FastAPI):**
```
app/
├── main.py              # Aplicação principal
├── models.py            # Modelos do banco de dados
├── schemas.py           # Schemas Pydantic
├── crud.py              # Operações CRUD
├── auth.py              # Autenticação
├── database.py          # Configuração do banco
└── routers/             # Endpoints da API
    ├── products.py      # Produtos
    ├── sales.py         # Vendas
    ├── suppliers.py     # Fornecedores
    └── insights.py      # Machine Learning
```

### **Frontend (React):**
```
frontend/src/
├── App.jsx              # Aplicação principal
├── components/          # Componentes React
├── services/            # Serviços de API
├── contexts/            # Contextos React
└── utils/               # Utilitários
```

### **Documentação:**
```
├── README.md            # Documentação principal
├── ABOUT.md             # Apresentação acadêmica
├── TERMS_OF_USE.md      # Termos de uso
└── PLAGIARISM_MONITORING.md  # Monitoramento
```

---

## 🚀 **Como Executar o Projeto**

### **Windows:**
```cmd
# Opção 1: Script automático
iniciar.bat

# Opção 2: PowerShell
.\start.ps1
```

### **Linux/Mac:**
```bash
./start.sh
```

### **Manual:**
```bash
# Backend
python -m venv .venv
.venv\Scripts\activate  # Windows
pip install -r requirement.txt
uvicorn app.main:app --reload

# Frontend
cd frontend
npm install
npm run dev
```

---

## 🔍 **Funcionalidades Principais**

### **1. Gerenciamento de Produtos**
- CRUD completo
- Controle de estoque
- Categorização
- Preços e códigos

### **2. Sistema de Vendas**
- Registro de vendas
- Cálculo automático
- Histórico completo
- Relatórios

### **3. Fornecedores**
- Cadastro completo
- Informações de contato
- Histórico de relacionamento

### **4. Machine Learning**
- Previsão de demanda
- Otimização de preços
- Detecção de anomalias
- Otimização de estoque

### **5. Alertas**
- Estoque baixo
- Produtos em falta
- Notificações em tempo real

---

## 📊 **Banco de Dados**

### **Tabelas Principais:**
- **users**: Usuários do sistema
- **products**: Produtos
- **suppliers**: Fornecedores
- **sales**: Vendas
- **sale_items**: Itens de venda
- **stock_movements**: Movimentações de estoque
- **purchase_orders**: Pedidos de compra

### **Tecnologia:**
- **SQLite** para desenvolvimento
- **SQLAlchemy** como ORM
- **Pydantic** para validação

---

## 🎓 **Aspectos Acadêmicos**

### **Conceitos Demonstrados:**
- **Python**: Programação orientada a objetos
- **SQL**: Consultas complexas e relacionamentos
- **FastAPI**: Desenvolvimento de APIs REST
- **React**: Desenvolvimento frontend
- **Machine Learning**: Algoritmos de predição
- **Docker**: Containerização
- **Git**: Controle de versão

### **Boas Práticas:**
- **Clean Code**: Código limpo e documentado
- **SOLID**: Princípios de design
- **DRY**: Don't Repeat Yourself
- **Separation of Concerns**: Separação de responsabilidades
- **Error Handling**: Tratamento de erros
- **Testing**: Testes automatizados

---

## 🔧 **Contribuições do Professor**

### **Áreas de Contribuição:**
- ✅ **Code Review**: Revisão de código
- ✅ **Documentação**: Melhorias na documentação
- ✅ **Funcionalidades**: Novas features
- ✅ **Bug Fixes**: Correções de bugs
- ✅ **Otimizações**: Melhorias de performance
- ✅ **Testes**: Adição de testes

### **Processo de Contribuição:**
1. **Crie uma branch** para sua contribuição
2. **Faça as modificações** necessárias
3. **Teste** as mudanças
4. **Abra um Pull Request**
5. **Aguarde** a revisão da equipe

---

## 📞 **Contato**

### **Para Dúvidas ou Sugestões:**
- **GitHub Issues**: Use o sistema de issues (se habilitado)
- **Email**: Entre em contato com a equipe
- **Reuniões**: Agende reuniões para discussões

### **Para Emergências:**
- **Contato direto** com a Equipe Big 5
- **GitHub**: Use o sistema de notificações

---

## ⚖️ **Termos de Uso**

O professor está autorizado a:
- ✅ **Visualizar** todo o código
- ✅ **Modificar** código e documentação
- ✅ **Contribuir** com melhorias
- ✅ **Usar** para fins acadêmicos
- ✅ **Referenciar** em outros trabalhos

**Restrições:**
- ❌ **Não redistribuir** sem autorização
- ❌ **Não remover** avisos de propriedade
- ❌ **Não usar** comercialmente

---

**© 2024 Equipe Big 5 - Acesso Autorizado para Professor**

**Data de criação**: 2024  
**Última atualização**: 2024  
**Versão**: 1.0
