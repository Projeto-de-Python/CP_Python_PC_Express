# 🪝 Exemplos de Refatoração de Hooks

## ❌ **Hook Complexo (Ruim)**

```jsx
// ❌ RUIM: Hook muito complexo
const ProductForm = ({ productId, onSubmit }) => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({});
  const [validationErrors, setValidationErrors] = useState({});
  const [categories, setCategories] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ❌ useEffect muito complexo com muitas operações
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        // Buscar produto
        const productResponse = await api.get(`/products/${productId}`);
        setProduct(productResponse.data);
        setFormData(productResponse.data);

        // Buscar categorias
        const categoriesResponse = await api.get('/categories');
        setCategories(categoriesResponse.data);

        // Buscar fornecedores
        const suppliersResponse = await api.get('/suppliers');
        setSuppliers(suppliersResponse.data);

        // Validar dados
        const validation = validateProduct(productResponse.data);
        if (!validation.isValid) {
          setValidationErrors(validation.errors);
        }

        // Log para analytics
        analytics.track('product_form_loaded', { productId });
      } catch (err) {
        setError(err.message);
        toast.error('Erro ao carregar dados');
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      fetchData();
    }
  }, [productId]); // ❌ Muitas dependências implícitas

  // ❌ Função muito longa
  const handleSubmit = async e => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Validação
      const validation = validateProduct(formData);
      if (!validation.isValid) {
        setValidationErrors(validation.errors);
        return;
      }

      // Preparar dados
      const submitData = {
        ...formData,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
        categoryId: parseInt(formData.categoryId),
        supplierId: parseInt(formData.supplierId),
      };

      // Enviar
      const response = await api.put(`/products/${productId}`, submitData);

      // Atualizar estado
      setProduct(response.data);
      setFormData(response.data);
      setValidationErrors({});

      // Notificar sucesso
      toast.success('Produto atualizado com sucesso!');
      onSubmit(response.data);

      // Analytics
      analytics.track('product_updated', { productId, data: submitData });
    } catch (err) {
      setError(err.message);
      toast.error('Erro ao atualizar produto');
    } finally {
      setIsSubmitting(false);
    }
  };

  // ... resto do componente
};
```

## ✅ **Hooks Refatorados (Bom)**

### **1. Hook Customizado para Dados do Produto**

```jsx
// ✅ BOM: Hook customizado focado
const useProductData = productId => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!productId) return;

      setLoading(true);
      setError(null);

      try {
        const response = await api.get(`/products/${productId}`);
        setProduct(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  return { product, loading, error, setProduct };
};
```

### **2. Hook Customizado para Dados de Referência**

```jsx
// ✅ BOM: Hook para dados de referência
const useReferenceData = () => {
  const [categories, setCategories] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchReferenceData = async () => {
      setLoading(true);

      try {
        const [categoriesRes, suppliersRes] = await Promise.all([
          api.get('/categories'),
          api.get('/suppliers'),
        ]);

        setCategories(categoriesRes.data);
        setSuppliers(suppliersRes.data);
      } catch (err) {
        console.error('Erro ao carregar dados de referência:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchReferenceData();
  }, []);

  return { categories, suppliers, loading };
};
```

### **3. Hook Customizado para Formulário**

```jsx
// ✅ BOM: Hook para gerenciamento de formulário
const useProductForm = initialData => {
  const [formData, setFormData] = useState(initialData || {});
  const [validationErrors, setValidationErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Limpar erro do campo quando usuário digita
    if (validationErrors[field]) {
      setValidationErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const validateForm = () => {
    const validation = validateProduct(formData);
    setValidationErrors(validation.errors);
    return validation.isValid;
  };

  const resetForm = () => {
    setFormData(initialData || {});
    setValidationErrors({});
  };

  return {
    formData,
    validationErrors,
    isSubmitting,
    setIsSubmitting,
    updateField,
    validateForm,
    resetForm,
  };
};
```

### **4. Hook Customizado para Analytics**

```jsx
// ✅ BOM: Hook para analytics
const useAnalytics = () => {
  const trackEvent = useCallback((eventName, data) => {
    analytics.track(eventName, data);
  }, []);

  return { trackEvent };
};
```

### **5. Componente Refatorado**

```jsx
// ✅ BOM: Componente limpo e focado
const ProductForm = ({ productId, onSubmit }) => {
  const { product, loading, error, setProduct } = useProductData(productId);
  const { categories, suppliers } = useReferenceData();
  const { formData, validationErrors, isSubmitting, setIsSubmitting, updateField, validateForm } =
    useProductForm(product);
  const { trackEvent } = useAnalytics();

  // ✅ useEffect simples e focado
  useEffect(() => {
    if (product) {
      trackEvent('product_form_loaded', { productId });
    }
  }, [product, productId, trackEvent]);

  // ✅ Função simples e focada
  const handleSubmit = async e => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const submitData = prepareSubmitData(formData);
      const response = await api.put(`/products/${productId}`, submitData);

      setProduct(response.data);
      onSubmit(response.data);
      trackEvent('product_updated', { productId, data: submitData });

      toast.success('Produto atualizado com sucesso!');
    } catch (err) {
      toast.error('Erro ao atualizar produto');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;

  return <form onSubmit={handleSubmit}>{/* Campos do formulário */}</form>;
};
```

## 📋 **Regras de Refatoração**

### **✅ O que fazer:**

- **Quebrar hooks complexos** em hooks menores e focados
- **Extrair lógica** para hooks customizados
- **Separar responsabilidades** (dados, formulário, analytics)
- **Usar useEffect simples** com uma responsabilidade cada
- **Criar funções auxiliares** para lógica complexa

### **❌ O que evitar:**

- **Hooks com mais de 15 linhas**
- **useEffect com muitas operações**
- **Muitas dependências** em useEffect
- **Lógica complexa** misturada com apresentação
- **Mais de 8 hooks** no mesmo componente

## 🎯 **Benefícios da Refatoração**

### **✅ Manutenibilidade:**

- Código mais fácil de entender
- Hooks reutilizáveis
- Testes mais simples
- Debugging mais fácil

### **✅ Performance:**

- Re-renders otimizados
- Dependências claras
- Memoização adequada
- Lazy loading possível

### **✅ Qualidade:**

- Código mais limpo
- Responsabilidades claras
- Menos bugs
- Melhor experiência do desenvolvedor

---

**🎯 Lembre-se: Hooks simples e focados = Código melhor!**
