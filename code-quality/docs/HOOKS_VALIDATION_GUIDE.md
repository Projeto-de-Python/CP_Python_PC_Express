# 🪝 Guia de Validação de Hooks - PC Express

## 🎯 **Nova Funcionalidade: Análise de Complexidade de Hooks**

O validador agora inclui uma análise específica para hooks React, garantindo que eles sejam simples, focados e bem estruturados.

## 🔍 **O que é Analisado**

### **1. 📏 Tamanho dos Hooks**

- **useEffect, useCallback, useMemo**: Máximo 15 linhas
- **Hooks muito longos**: Sugestão de quebra em funções menores

### **2. 🔢 Quantidade de Hooks**

- **Máximo 8 hooks** por componente
- **Muitos hooks**: Sugestão de quebra em componentes menores

### **3. 🎯 Complexidade do useEffect**

- **Muitas dependências** (>5): Sugestão de simplificação
- **Múltiplas operações**: Sugestão de quebra em múltiplos useEffect
- **Lógica complexa**: Sugestão de extração para funções

### **4. 🧩 Padrões Detectados**

- **useState, useEffect, useCallback, useMemo**
- **useContext, useReducer, useRef**
- **Hooks customizados**

## 📋 **Exemplos de Problemas Detectados**

### **❌ Hook Muito Longo**

```jsx
// ❌ PROBLEMA: useEffect com 25 linhas
useEffect(() => {
  // 25 linhas de código complexo...
  const fetchData = async () => {
    // Muitas operações...
  };
  fetchData();
}, [dependency1, dependency2, dependency3, dependency4, dependency5, dependency6]);
```

**Validador detecta:**

- ❌ useEffect muito longo (25 linhas)
- ❌ useEffect com muitas dependências (6)
- 💡 Sugestão: Quebrar em funções menores ou extrair lógica

### **❌ Muitos Hooks no Componente**

```jsx
// ❌ PROBLEMA: 12 hooks no mesmo componente
const ComplexComponent = () => {
  const [state1, setState1] = useState();
  const [state2, setState2] = useState();
  const [state3, setState3] = useState();
  // ... 9 hooks adicionais
};
```

**Validador detecta:**

- ❌ Muitos hooks (12) - considere quebrar em componentes menores
- 💡 Sugestão: Extrair lógica para hooks customizados ou componentes menores

## ✅ **Como Corrigir Problemas**

### **1. 🔧 Quebrar Hooks Longos**

#### **Antes (❌ Ruim):**

```jsx
useEffect(() => {
  const fetchData = async () => {
    setLoading(true);
    const product = await api.getProduct(id);
    const categories = await api.getCategories();
    const suppliers = await api.getSuppliers();
    setProduct(product);
    setCategories(categories);
    setSuppliers(suppliers);
    setLoading(false);
  };
  fetchData();
}, [id]);
```

#### **Depois (✅ Bom):**

```jsx
// Hook customizado para dados do produto
const useProductData = id => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      const data = await api.getProduct(id);
      setProduct(data);
      setLoading(false);
    };
    fetchProduct();
  }, [id]);

  return { product, loading };
};

// Hook customizado para dados de referência
const useReferenceData = () => {
  const [categories, setCategories] = useState([]);
  const [suppliers, setSuppliers] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const [cats, supps] = await Promise.all([api.getCategories(), api.getSuppliers()]);
      setCategories(cats);
      setSuppliers(supps);
    };
    fetchData();
  }, []);

  return { categories, suppliers };
};
```

### **2. 🔧 Simplificar Dependências**

#### **Antes (❌ Ruim):**

```jsx
useEffect(() => {
  // Lógica complexa
}, [dep1, dep2, dep3, dep4, dep5, dep6]);
```

#### **Depois (✅ Bom):**

```jsx
// Quebrar em múltiplos useEffect
useEffect(() => {
  // Lógica relacionada a dep1, dep2
}, [dep1, dep2]);

useEffect(() => {
  // Lógica relacionada a dep3, dep4
}, [dep3, dep4]);

useEffect(() => {
  // Lógica relacionada a dep5, dep6
}, [dep5, dep6]);
```

### **3. 🔧 Extrair Lógica Complexa**

#### **Antes (❌ Ruim):**

```jsx
useEffect(() => {
  const complexLogic = async () => {
    // 20 linhas de lógica complexa
  };
  complexLogic();
}, [dependency]);
```

#### **Depois (✅ Bom):**

```jsx
// Função auxiliar
const processComplexData = async data => {
  // Lógica complexa extraída
};

// Hook simples
useEffect(() => {
  processComplexData(dependency);
}, [dependency]);
```

## 🚀 **Comandos de Validação**

### **Validação Completa (Inclui Hooks):**

```bash
.\validate.bat
```

### **Validação Específica de Hooks:**

```bash
python scripts/validate_code_quality.py
```

### **Correção Automática:**

```bash
npm run fix:all
```

## 📊 **Relatório de Validação**

### **Exemplo de Saída:**

```
🪝 Verificando complexidade de hooks...
❌ Hooks complexos encontrados:
  - frontend/src/components/ProductForm.jsx: useEffect muito longo (25 linhas) na linha 45
  - frontend/src/components/UserDashboard.jsx: Muitos hooks (12) - considere quebrar em componentes menores
  - frontend/src/components/OrderForm.jsx: useEffect com muitas dependências (6) na linha 32

💡 Sugestões de melhoria:
  - frontend/src/components/ProductForm.jsx: Quebrar useEffect em funções menores ou extrair lógica
  - frontend/src/components/UserDashboard.jsx: Extrair lógica para hooks customizados ou componentes menores
  - frontend/src/components/OrderForm.jsx: Simplificar dependências ou quebrar em múltiplos useEffect
```

## 🎯 **Regras Configuradas**

### **No arquivo `.cursorrules`:**

```markdown
### Regras para Hooks

- SEMPRE mantenha hooks simples e focados
- NUNCA crie hooks com mais de 15 linhas
- NUNCA use mais de 8 hooks no mesmo componente
- SEMPRE quebre hooks complexos em funções menores
- SEMPRE extraia lógica complexa para hooks customizados
- NUNCA use useEffect com muitas dependências (>5)
- SEMPRE separe múltiplas operações em useEffect diferentes
```

## 🎉 **Benefícios**

### **✅ Para o Código:**

- **Hooks mais simples** e fáceis de entender
- **Melhor performance** com dependências otimizadas
- **Menos bugs** com lógica separada
- **Mais reutilizável** com hooks customizados

### **✅ Para o Desenvolvedor:**

- **Debugging mais fácil** com hooks focados
- **Testes mais simples** com responsabilidades claras
- **Manutenção mais fácil** com código organizado
- **Produtividade maior** com padrões consistentes

### **✅ Para o Cursor AI:**

- **Regras claras** sobre complexidade de hooks
- **Sugestões automáticas** de refatoração
- **Validação contínua** da qualidade
- **Padrões consistentes** em todo o projeto

## 🚀 **Próximos Passos**

1. **Execute a validação:** `.\validate.bat`
2. **Analise os problemas** de hooks encontrados
3. **Refatore conforme sugestões** do validador
4. **Use os exemplos** em `examples/hooks_refactoring_examples.md`
5. **Mantenha hooks simples** e focados

---

**🎯 Hooks simples e focados = Código React melhor!**

**🤖 Cursor AI + Validação de Hooks = Componentes perfeitos!**
