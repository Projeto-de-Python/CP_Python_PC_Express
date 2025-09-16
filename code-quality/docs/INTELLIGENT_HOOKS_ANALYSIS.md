# 🧠 Análise Inteligente de Hooks - PC Express

## 🎯 **Nova Abordagem: Análise Flexível e Inteligente**

O validador agora usa uma análise inteligente que considera não apenas o tamanho dos hooks, mas também sua complexidade real e justificativa.

## 🔍 **Como Funciona a Análise Inteligente**

### **1. 📊 Score de Complexidade**

O validador calcula um **score de complexidade** (0.0 a 1.0) baseado em:

- **Proporção de linhas significativas** vs comentários/espaços
- **Número de operações** (await, setState, if, for, etc.)
- **Densidade de lógica** real no código

### **2. 🎯 Limites Flexíveis**

#### **useEffect:**

- **< 50 linhas**: ✅ Sempre aceito
- **50-100 linhas**: ⚠️ Warning se complexidade > 0.6
- **> 100 linhas**: ❌ Erro se complexidade > 0.7, ⚠️ Warning se < 0.7

#### **useCallback/useMemo:**

- **< 30 linhas**: ✅ Sempre aceito
- **> 30 linhas**: ❌ Erro se complexidade > 0.8, ⚠️ Warning se < 0.8

#### **Dependências:**

- **< 5 dependências**: ✅ Sempre aceito
- **5-8 dependências**: ⚠️ Warning
- **> 8 dependências**: ❌ Erro

#### **Quantidade de Hooks:**

- **< 8 hooks**: ✅ Sempre aceito
- **8-12 hooks**: ⚠️ Warning
- **> 12 hooks**: ❌ Erro

## 📋 **Exemplos de Análise**

### **✅ Hook Grande mas Aceitável**

```jsx
// ✅ ACEITÁVEL: 120 linhas mas baixa complexidade
const useDataProcessor = data => {
  return useMemo(() => {
    // 120 linhas de código, mas:
    // - Muitos comentários explicativos
    // - Espaçamento para legibilidade
    // - Lógica simples e linear
    // - Score de complexidade: 0.4 (baixo)

    if (!data) return null;

    // Fase 1: Limpeza
    const cleaned = data.filter(item => item.isValid);

    // Fase 2: Transformação
    const transformed = cleaned.map(item => ({
      ...item,
      processedAt: new Date().toISOString(),
    }));

    // Fase 3: Ordenação
    const sorted = transformed.sort((a, b) => a.name.localeCompare(b.name));

    return sorted;
  }, [data]);
};
```

**Validador detecta:**

- ⚠️ Hook grande (120 linhas) mas com baixa complexidade - pode ser aceitável

### **❌ Hook Grande e Complexo**

```jsx
// ❌ PROBLEMA: 80 linhas mas alta complexidade
const useComplexLogic = (data) => {
  return useMemo(() => {
    // 80 linhas de código complexo:
    // - Muitas operações aninhadas
    // - Lógica condicional complexa
    // - Múltiplas responsabilidades
    // - Score de complexidade: 0.8 (alto)

    const result = [];
    for (let i = 0; i < data.length; i++) {
      const item = data[i];
      if (item.type === 'A') {
        if (item.status === 'active') {
          if (item.priority > 5) {
            const processed = await processItem(item);
            if (processed.success) {
              result.push(processed.data);
            }
          }
        }
      } else if (item.type === 'B') {
        // Mais lógica complexa...
      }
    }
    return result;
  }, [data]);
};
```

**Validador detecta:**

- ❌ Hook muito complexo (80 linhas, score: 0.8) - considere quebrar em múltiplos hooks

### **⚠️ Hook com Muitas Dependências**

```jsx
// ⚠️ WARNING: Muitas dependências
useEffect(() => {
  // Lógica do efeito
}, [dep1, dep2, dep3, dep4, dep5, dep6]); // 6 dependências
```

**Validador detecta:**

- ⚠️ useEffect com muitas dependências (6) - considere simplificar

## 🎯 **Regras Atualizadas**

### **No `.cursorrules`:**

```markdown
### Regras para Hooks

- SEMPRE mantenha hooks simples e focados quando possível
- PREFIRA hooks menores, mas aceite hooks grandes se justificados
- NUNCA use mais de 12 hooks no mesmo componente
- SEMPRE quebre hooks complexos em funções menores quando viável
- SEMPRE extraia lógica complexa para hooks customizados quando apropriado
- EVITE useEffect com muitas dependências (>8), mas aceite se necessário
- PREFIRA separar múltiplas operações em useEffect diferentes
- CONSIDERE a complexidade real, não apenas o tamanho
```

## 🚀 **Comandos de Validação**

### **Validação Completa:**

```bash
.\validate.bat
```

### **Saída do Validador:**

```
🪝 Verificando complexidade de hooks...
❌ Hooks com problemas encontrados:
  - frontend/src/components/ComplexComponent.jsx: useEffect muito complexo (150 linhas, score: 0.85) na linha 45

⚠️ Hooks grandes (mas potencialmente aceitáveis):
  - frontend/src/components/DataProcessor.jsx: useEffect grande (120 linhas) mas com baixa complexidade na linha 32
  - frontend/src/components/FormHandler.jsx: useEffect com muitas dependências (7) na linha 28

💡 Sugestões de melhoria:
  - frontend/src/components/ComplexComponent.jsx: Este useEffect é muito complexo - considere quebrar em múltiplos hooks
  - frontend/src/components/FormHandler.jsx: Simplificar dependências ou quebrar em múltiplos useEffect
```

## 🎉 **Benefícios da Análise Inteligente**

### **✅ Flexibilidade:**

- **Aceita hooks grandes** quando justificados
- **Considera complexidade real** vs tamanho
- **Permite casos especiais** (processamento de dados, etc.)

### **✅ Inteligência:**

- **Score de complexidade** baseado em análise real
- **Diferentes limites** para diferentes tipos de hooks
- **Warnings vs Erros** baseados em severidade

### **✅ Praticidade:**

- **Não quebra código** que funciona bem
- **Sugere melhorias** quando apropriado
- **Considera contexto** do projeto

## 📚 **Exemplos de Hooks Aceitáveis**

### **1. Processamento de Dados Pesado**

```jsx
// ✅ ACEITÁVEL: Hook de 200+ linhas para processamento complexo
const useDataProcessor = rawData => {
  return useMemo(() => {
    // Processamento complexo mas justificado
    // - Múltiplas fases de transformação
    // - Validações complexas
    // - Otimizações de performance
    // - Score baixo devido a comentários e estrutura clara
  }, [rawData]);
};
```

### **2. Sincronização com Múltiplas APIs**

```jsx
// ✅ ACEITÁVEL: useEffect grande para sincronização complexa
useEffect(() => {
  // Sincronização com múltiplas APIs
  // - API principal
  // - API de cache
  // - API de analytics
  // - Tratamento de erros
  // - Score baixo devido a estrutura clara
}, [data, config]);
```

### **3. Lógica de Negócio Complexa**

```jsx
// ✅ ACEITÁVEL: useCallback grande para lógica complexa
const handleComplexOperation = useCallback(
  async params => {
    // Lógica de negócio complexa mas bem estruturada
    // - Múltiplas validações
    // - Processamento em etapas
    // - Tratamento de erros
    // - Score baixo devido a organização clara
  },
  [dependencies]
);
```

## 🚀 **Próximos Passos**

1. **Execute a validação:** `.\validate.bat`
2. **Analise os resultados** - erros vs warnings
3. **Refatore apenas** o que realmente precisa
4. **Mantenha hooks grandes** que são justificados
5. **Use a análise inteligente** para tomar decisões

---

**🎯 Análise inteligente = Hooks melhores sem quebrar o que funciona!**

**🧠 Complexidade real > Tamanho do arquivo!**

**✅ Flexibilidade + Inteligência = Validação perfeita!**
