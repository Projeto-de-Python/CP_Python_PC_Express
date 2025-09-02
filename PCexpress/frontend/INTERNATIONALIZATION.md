# Internacionalização (i18n) - PC Express

Este documento descreve como a funcionalidade de internacionalização foi implementada no projeto PC Express.

## Funcionalidades Implementadas

### 1. Suporte a Múltiplos Idiomas
- **Português (pt)**: Idioma nativo brasileiro
- **Inglês (en)**: Idioma padrão do sistema

### 2. Componentes de Interface
- **Seletor de Idioma**: Dropdown na barra de navegação superior
- **Configurações**: Diálogo de configurações com opção de idioma
- **Persistência**: Preferência de idioma salva no localStorage

### 3. Traduções Implementadas

#### Componentes Principais
- **Layout**: Menu de navegação, botões, diálogos
- **Autenticação**: Login e Registro
- **Dashboard**: Títulos e labels
- **Produtos**: Formulários e tabelas
- **Fornecedores**: Interface de gerenciamento
- **Pedidos de Compra**: Status e ações
- **Análises**: Gráficos e métricas
- **Alertas**: Notificações do sistema
- **Reposição Automática**: Configurações

## Como Usar

### Para o Usuário Final
1. **Alterar Idioma**: Clique no seletor de idioma na barra superior
2. **Configurações**: Acesse o menu do usuário → Configurações
3. **Persistência**: A escolha é automaticamente salva

### Para Desenvolvedores

#### Adicionar Novas Traduções

1. **Editar arquivos de tradução**:
   ```bash
   frontend/src/locales/en.json  # Inglês
   frontend/src/locales/pt.json  # Português
   ```

2. **Estrutura de traduções**:
   ```json
   {
     "common": {
       "key": "value"
     },
     "component": {
       "key": "value"
     }
   }
   ```

3. **Usar em componentes**:
   ```jsx
   import { useTranslation } from 'react-i18next';
   
   const MyComponent = () => {
     const { t } = useTranslation();
     
     return <div>{t('common.key')}</div>;
   };
   ```

#### Adicionar Novo Idioma

1. **Criar arquivo de tradução**:
   ```bash
   frontend/src/locales/es.json  # Exemplo: Espanhol
   ```

2. **Atualizar configuração**:
   ```javascript
   // frontend/src/i18n.js
   import esTranslations from './locales/es.json';
   
   const resources = {
     en: { translation: enTranslations },
     pt: { translation: ptTranslations },
     es: { translation: esTranslations }  // Novo idioma
   };
   ```

3. **Adicionar opção no seletor**:
   ```jsx
   <MenuItem value="es">{t('common.spanish')}</MenuItem>
   ```

## Estrutura de Arquivos

```
frontend/src/
├── i18n.js                    # Configuração principal
├── contexts/
│   └── LanguageContext.jsx    # Contexto de idioma
└── locales/
    ├── en.json               # Traduções em inglês
    └── pt.json               # Traduções em português
```

## Dependências

- `react-i18next`: Biblioteca principal para React
- `i18next`: Core da biblioteca de internacionalização
- `i18next-browser-languagedetector`: Detecção automática de idioma

## Melhores Práticas

1. **Organização**: Agrupar traduções por contexto/componente
2. **Chaves**: Usar nomes descritivos e hierárquicos
3. **Interpolação**: Usar variáveis para textos dinâmicos
4. **Pluralização**: Implementar quando necessário
5. **Testes**: Verificar traduções em ambos os idiomas

## Exemplo de Uso Avançado

```jsx
// Interpolação com variáveis
const message = t('welcome.user', { name: userName });

// Pluralização
const items = t('items.count', { count: itemCount });

// Tradução condicional
const status = t(`status.${orderStatus}`);
```

## Manutenção

- **Revisão Regular**: Verificar consistência entre idiomas
- **Novos Recursos**: Sempre adicionar traduções para novos componentes
- **Testes**: Validar interface em diferentes idiomas
- **Documentação**: Manter este guia atualizado
