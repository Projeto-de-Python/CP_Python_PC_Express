# 🎯 Regras de Desenvolvimento - PC Express

## 📋 **OBRIGATÓRIO: Siga estas regras em TODOS os códigos**

### 🐍 **Python - Regras Obrigatórias**

#### **Formatação**

- ✅ **SEMPRE** use Black com `line-length=100`
- ✅ **SEMPRE** organize imports com isort (`profile=black`)
- ✅ **SEMPRE** use type hints em funções públicas
- ✅ **SEMPRE** siga PEP 8 com exceções do Black
- ❌ **NUNCA** deixe linhas com mais de 100 caracteres

#### **Comandos**

```bash
# Formatar código
python -m black app/ scripts/ --line-length 100

# Organizar imports
python -m isort app/ scripts/ --profile black

# Verificar formatação
python -m black --check app/ scripts/ --line-length 100
```

### 🟨 **JavaScript/React - Regras Obrigatórias**

#### **Formatação**

- ✅ **SEMPRE** use Prettier com configuração do projeto
- ✅ **SEMPRE** use ESLint com regras do projeto
- ✅ **SEMPRE** quebre componentes grandes em componentes menores
- ✅ **SEMPRE** use PropTypes para validação
- ❌ **NUNCA** deixe arquivos com mais de 200 linhas

#### **Estrutura de Componentes**

- ✅ **SEMPRE** separe styled-components em arquivo separado (`.js`)
- ✅ **SEMPRE** crie componentes pequenos e focados
- ✅ **SEMPRE** use hooks apropriados
- ✅ **SEMPRE** implemente PropTypes corretamente

#### **Comandos**

```bash
# Formatar código
npm run format

# Corrigir linting
npm run lint:fix

# Verificar tudo
npm run lint:all
```

### 📁 **Estrutura de Arquivos**

#### **Componentes React**

```
components/
├── ComponentName/
│   ├── ComponentName.jsx          # Componente principal
│   ├── ComponentNameStyles.js     # Styled components
│   ├── ComponentName.test.jsx     # Testes (opcional)
│   └── index.js                   # Export
```

#### **Python**

```
app/
├── routers/                       # Endpoints da API
├── models.py                      # Modelos do banco
├── schemas.py                     # Schemas Pydantic
├── crud.py                        # Operações CRUD
└── services/                      # Lógica de negócio
```

### 🔧 **Configurações**

#### **Arquivos de Configuração**

- `.cursorrules` - Regras para Cursor AI
- `.vscode/settings.json` - Configurações do VS Code
- `pyproject.toml` - Configuração Black/isort
- `frontend/.prettierrc` - Configuração Prettier
- `frontend/eslint.config.js` - Configuração ESLint

### ✅ **Validação de Qualidade**

#### **Script de Validação**

```bash
python scripts/validate_code_quality.py
```

Este script verifica:

- ✅ Formatação Python (Black + isort)
- ✅ Formatação JavaScript (Prettier + ESLint)
- ✅ Tamanhos de arquivos
- ✅ Estrutura do projeto

### 🚀 **Comandos Rápidos**

#### **Formatação Completa**

```bash
# Python
python -m black app/ scripts/ --line-length 100
python -m isort app/ scripts/ --profile black

# JavaScript
cd frontend
npm run format
npm run lint:fix
```

#### **Verificação Completa**

```bash
# Validar tudo
python scripts/validate_code_quality.py

# Verificar Python
python -m black --check app/ scripts/ --line-length 100
python -m isort --check-only app/ scripts/ --profile black

# Verificar JavaScript
cd frontend
npm run format:check
npm run lint
```

### 📝 **Exemplos de Boas Práticas**

#### **Python - Função Bem Formatada**

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

#### **React - Componente Bem Estruturado**

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

### ⚠️ **IMPORTANTE**

- ❌ **NUNCA** ignore essas regras
- ✅ **SEMPRE** formate o código antes de finalizar
- ✅ **SEMPRE** mantenha consistência com o projeto existente
- ✅ **SEMPRE** teste se as regras estão sendo seguidas

### 🎯 **Para Cursor AI**

O arquivo `.cursorrules` contém todas essas regras em formato que o Cursor AI entende.
**SEMPRE** siga essas regras ao programar!

---

**Lembre-se**: Código limpo e bem formatado é mais fácil de manter, debugar e colaborar! 🚀
