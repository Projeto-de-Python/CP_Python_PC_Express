# 🛡️ Configurações de Proteção do Repositório

## 📋 **Configurações Recomendadas no GitHub**

### **1. Settings → General**

- [ ] **Issues**: Desabilitar
- [ ] **Wiki**: Desabilitar
- [ ] **Discussions**: Desabilitar
- [ ] **Projects**: Desabilitar
- [ ] **Packages**: Desabilitar
- [ ] **Allow forking**: Desabilitar (IMPORTANTE!)
- [ ] **Allow cloning**: Manter habilitado (para demonstração)
- [ ] **Allow downloads**: Desabilitar

### **2. Settings → Actions**

- [x] **Actions**: Manter habilitado (apenas para CI/CD)
- [ ] **Fork pull request workflows**: Desabilitar
- [ ] **Workflow permissions**: Read repository contents and packages permissions

### **3. Settings → Security**

- [x] **Dependency graph**: Habilitar
- [x] **Dependabot alerts**: Habilitar
- [x] **Dependabot security updates**: Habilitar
- [x] **Code scanning**: Habilitar (se disponível)

### **4. Settings → Pages**

- [ ] **Pages**: Desabilitar (se não necessário)

### **5. Settings → Collaborators and teams**

- [ ] **Allow merge commits**: Desabilitar
- [ ] **Allow squash merging**: Desabilitar
- [ ] **Allow rebase merging**: Desabilitar
- [ ] **Allow auto-merge**: Desabilitar

### **6. Settings → Danger Zone (IMPORTANTE!)**

- [ ] **Make this repository private**: Considerar após avaliação
- [ ] **Transfer ownership**: Não permitir
- [ ] **Delete this repository**: Não permitir
- [ ] **Archive this repository**: Não permitir

### **7. Settings → Manage access**

- [ ] **Add people**: Apenas Equipe Big 5
- [ ] **Add teams**: Apenas equipe autorizada
- [ ] **Invite collaborators**: Desabilitar
- [ ] **Grant access**: Apenas com autorização expressa

## 🚨 **Avisos de Proteção**

### **Branch Protection Rules**

1. Vá para **Settings → Branches**
2. Clique em **Add rule**
3. Configure:
   - **Branch name pattern**: `main`
   - [x] **Require a pull request before merging**
   - [x] **Require approvals**: 1
   - [x] **Dismiss stale PR approvals when new commits are pushed**
   - [x] **Require review from code owners**
   - [x] **Restrict pushes that create files**
   - [x] **Require status checks to pass before merging**

### **Code Owners**

Crie um arquivo `.github/CODEOWNERS`:

```
# Equipe Big 5 - Proprietários do código
* @[seu-usuario-github]
```

## 📝 **Instruções para Configuração**

1. **Acesse** o repositório no GitHub
2. **Vá para** Settings (configurações)
3. **Configure** cada seção conforme indicado acima
4. **Salve** as configurações

## ⚠️ **Importante**

- Estas configurações **protegem** o repositório contra uso indevido
- **Mantém** o repositório público para demonstração
- **Previne** contribuições não autorizadas
- **Preserva** a propriedade intelectual da Equipe Big 5

---

**Equipe Big 5 - PC Express**
