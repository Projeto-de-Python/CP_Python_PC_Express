# 🔧 Code Quality Tools - PC Express

## 📁 **Estrutura da Ferramenta de Qualidade de Código**

Esta pasta contém todas as ferramentas, configurações e documentação para garantir a qualidade do código no projeto PC Express.

## 📂 **Estrutura de Pastas**

```
code-quality/
├── 📁 config/           # Configurações de linting e formatação
├── 📁 docs/             # Documentação completa
├── 📁 examples/         # Exemplos de código e refatoração
├── 📁 scripts/          # Scripts de validação e automação
└── 📄 README.md         # Este arquivo
```

## 🚀 **Início Rápido**

### **Validação Completa:**

```bash
# Windows
code-quality/scripts/validate.bat

# Linux/Mac
./code-quality/scripts/validate.sh

# Python direto
python code-quality/scripts/validate_code_quality.py
```

### **Configuração Automática:**

```bash
python code-quality/scripts/setup_auto_validation.py
```

## 📋 **Ferramentas Disponíveis**

### **🔍 Validação de Código**

- **`validate_code_quality.py`** - Validador principal com análise inteligente
- **`cursor_auto_fix.py`** - Correção automática para Cursor AI
- **`cursor_validation_flow.py`** - Demonstração do fluxo de validação

### **⚙️ Configuração**

- **`setup_auto_validation.py`** - Configuração automática de validação
- **`validate.bat`** / **`validate.sh`** - Atalhos para validação rápida

### **📚 Documentação**

- **`DEVELOPMENT_RULES.md`** - Regras de desenvolvimento
- **`VALIDATION_GUIDE.md`** - Guia de validação
- **`INTELLIGENT_HOOKS_ANALYSIS.md`** - Análise inteligente de hooks
- **`CURSOR_AI_BEHAVIOR.md`** - Comportamento do Cursor AI

### **🎯 Exemplos**

- **`hooks_refactoring_examples.md`** - Exemplos de refatoração de hooks
- **`complex_hook_example.jsx`** - Exemplo de hook complexo aceitável

## 🎯 **Funcionalidades Principais**

### **✅ Validação Inteligente**

- **Análise de complexidade** baseada em score real
- **Limites flexíveis** para diferentes tipos de hooks
- **Warnings vs Erros** baseados em severidade
- **Contexto considerado** para cada tipo de código

### **🤖 Integração com Cursor AI**

- **Regras automáticas** para o Cursor AI
- **Validação contínua** em cada código gerado
- **Correção automática** quando possível
- **Sugestões inteligentes** de melhoria

### **🔧 Ferramentas de Formatação**

- **Black** para Python (line-length=100)
- **isort** para organização de imports
- **Prettier** para JavaScript/React
- **ESLint** para linting JavaScript

## 📊 **Análise de Hooks Inteligente**

### **Limites Flexíveis:**

- **useEffect**: < 50 linhas (sempre aceito), 50-100 (warning se complexo), > 100 (erro se muito complexo)
- **useCallback/useMemo**: < 30 linhas (sempre aceito), > 30 (erro se muito complexo)
- **Dependências**: < 5 (sempre aceito), 5-8 (warning), > 8 (erro)
- **Quantidade**: < 8 hooks (sempre aceito), 8-12 (warning), > 12 (erro)

### **Score de Complexidade:**

- **0.0 - 0.4**: Baixa complexidade (aceito mesmo se grande)
- **0.4 - 0.7**: Média complexidade (warning se grande)
- **0.7 - 1.0**: Alta complexidade (erro se grande)

## 🎉 **Benefícios**

### **✅ Para o Desenvolvedor:**

- **Código sempre válido** - Nunca recebe código com problemas
- **Formatação consistente** - Sempre bem formatado
- **Estrutura adequada** - Arquivos organizados
- **Qualidade garantida** - Padrões mantidos

### **✅ Para o Cursor AI:**

- **Regras claras** sobre complexidade de hooks
- **Sugestões automáticas** de refatoração
- **Validação contínua** da qualidade
- **Padrões consistentes** em todo o projeto

### **✅ Para o Projeto:**

- **Qualidade mantida** sem quebrar funcionalidade
- **Padrões flexíveis** que se adaptam ao contexto
- **Análise inteligente** que considera o todo
- **Validação realista** e prática

## 🚀 **Próximos Passos**

1. **Execute a validação:** `code-quality/scripts/validate.bat`
2. **Configure automação:** `python code-quality/scripts/setup_auto_validation.py`
3. **Leia a documentação:** `code-quality/docs/`
4. **Veja os exemplos:** `code-quality/examples/`
5. **Mantenha qualidade:** Use as ferramentas regularmente

## 📚 **Documentação Completa**

- **[DEVELOPMENT_RULES.md](docs/DEVELOPMENT_RULES.md)** - Regras detalhadas de desenvolvimento
- **[VALIDATION_GUIDE.md](docs/VALIDATION_GUIDE.md)** - Guia completo de validação
- **[INTELLIGENT_HOOKS_ANALYSIS.md](docs/INTELLIGENT_HOOKS_ANALYSIS.md)** - Análise inteligente de hooks
- **[CURSOR_AI_BEHAVIOR.md](docs/CURSOR_AI_BEHAVIOR.md)** - Comportamento do Cursor AI

## 🎯 **Exemplos Práticos**

- **[hooks_refactoring_examples.md](examples/hooks_refactoring_examples.md)** - Como refatorar hooks
- **[complex_hook_example.jsx](examples/complex_hook_example.jsx)** - Hook complexo aceitável

---

**🎯 Code Quality Tools = Código Sempre Perfeito!**

**🧠 Análise Inteligente + Validação Automática = Qualidade Garantida!**

**✅ Ferramenta Completa e Organizada!**
