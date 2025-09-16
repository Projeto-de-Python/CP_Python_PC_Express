# 🤖 Instruções para Cursor AI - PC Express

## 🎯 **REGRAS OBRIGATÓRIAS - Siga SEMPRE**

### **🐍 Python**

- **SEMPRE** use Black com `line-length=100`
- **SEMPRE** organize imports com isort (`profile=black`)
- **SEMPRE** use type hints em funções públicas
- **SEMPRE** quebre arquivos grandes (>300 linhas) em módulos menores
- **SEMPRE** use docstrings para funções complexas

### **🟨 JavaScript/React**

- **SEMPRE** use Prettier para formatação
- **SEMPRE** use ESLint para linting
- **SEMPRE** quebre componentes grandes (>200 linhas) em componentes menores
- **SEMPRE** separe styled-components em arquivo `.js` separado
- **SEMPRE** use PropTypes para validação
- **SEMPRE** use hooks apropriados

### **🪝 Regras para Hooks**

- **SEMPRE** mantenha hooks simples e focados quando possível
- **PREFIRA** hooks menores, mas aceite hooks grandes se justificados
- **NUNCA** use mais de 12 hooks no mesmo componente
- **SEMPRE** quebre hooks complexos em funções menores quando viável
- **SEMPRE** extraia lógica complexa para hooks customizados quando apropriado
- **EVITE** useEffect com muitas dependências (>8), mas aceite se necessário
- **PREFIRA** separar múltiplas operações em useEffect diferentes
- **CONSIDERE** a complexidade real, não apenas o tamanho

### **📁 Estrutura de Arquivos**

- **SEMPRE** mantenha a estrutura modular do projeto
- **SEMPRE** use imports relativos corretos
- **SEMPRE** separe responsabilidades (UI, lógica, estilos)

### **🔧 Comandos de Formatação**

```bash
# Python
python -m black app/ scripts/ --line-length 100
python -m isort app/ scripts/ --profile black

# JavaScript
npm run format
npm run lint:fix
```

### **✅ Validação**

- **SEMPRE** execute `python scripts/validate_code_quality.py` antes de finalizar
- **SEMPRE** verifique se o código está funcionando
- **SEMPRE** mantenha consistência com o projeto existente

### **📝 Exemplos**

#### **Python - Função Bem Formatada:**

```python
from typing import List, Optional
from sqlalchemy.orm import Session
from fastapi import HTTPException

def create_product(
    db: Session,
    data: schemas.ProductCreate,
    user_id: int
) -> models.Product:
    """Create a new product with validation."""
    product = models.Product(**data.model_dump(), user_id=user_id)
    db.add(product)
    try:
        db.commit()
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=409, detail="Product code already exists")
    db.refresh(product)
    return product
```

#### **React - Componente Bem Estruturado:**

```jsx
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Button, TextField } from '@mui/material';
import { StyledContainer, StyledForm } from './ComponentStyles';

const MyComponent = ({ onSubmit, loading }) => {
  const [value, setValue] = useState('');

  const handleSubmit = e => {
    e.preventDefault();
    onSubmit(value);
  };

  return (
    <StyledContainer>
      <StyledForm onSubmit={handleSubmit}>
        <TextField value={value} onChange={e => setValue(e.target.value)} label="Input" />
        <Button type="submit" disabled={loading}>
          Submit
        </Button>
      </StyledForm>
    </StyledContainer>
  );
};

MyComponent.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
};

export default MyComponent;
```

### **⚠️ IMPORTANTE**

- **NUNCA** ignore essas regras
- **SEMPRE** formate o código antes de finalizar
- **SEMPRE** teste se o código está funcionando
- **SEMPRE** mantenha consistência com o projeto existente

### **🚀 Comandos Rápidos**

```bash
# Validar tudo
python scripts/validate_code_quality.py

# Formatar Python
python -m black app/ scripts/ --line-length 100
python -m isort app/ scripts/ --profile black

# Formatar JavaScript
cd frontend
npm run format
npm run lint:fix
```

---

**Lembre-se**: Código limpo e bem formatado é mais fácil de manter, debugar e colaborar! 🚀
