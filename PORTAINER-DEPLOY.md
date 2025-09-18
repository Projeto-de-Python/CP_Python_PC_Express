# 🚀 Deploy no Portainer - PC Express

## 📋 **Pré-requisitos**

- VPS com Docker instalado
- Portainer configurado
- Acesso ao Portainer via web

## 🎯 **Opção 1: Deploy via Git (Recomendado)**

### **1. No Portainer:**

1. Vá em **"Stacks"** > **"Add stack"**
2. Escolha **"Repository"**
3. Configure:
   - **Repository URL:** `https://github.com/seu-usuario/seu-repo`
   - **Compose path:** `docker-compose.yml`
   - **Branch:** `main`
   - **Name:** `pc-express`

### **2. Variáveis de Ambiente:**

```env
SECRET_KEY=seu-secret-key-super-seguro-aqui
DATABASE_URL=sqlite:///./data/inventory.db
DEBUG=False
API_URL=http://localhost:8000
FRONTEND_URL=http://localhost:5173
```

### **3. Deploy:**

- Clique em **"Deploy the stack"**
- Aguarde o build e inicialização

## 🎯 **Opção 2: Deploy Manual**

### **1. No Portainer:**

1. Vá em **"Stacks"** > **"Add stack"**
2. Escolha **"Web editor"**
3. Cole o conteúdo do `docker-compose.yml`

### **2. Configure as variáveis de ambiente**

### **3. Deploy**

## 🎯 **Opção 3: Deploy via SSH**

### **1. Conecte na VPS:**

```bash
ssh usuario@seu-servidor.com
```

### **2. Clone o repositório:**

```bash
git clone https://github.com/seu-usuario/seu-repo.git
cd CP_Python_PC_Express
```

### **3. Execute o deploy:**

```bash
chmod +x deploy-portainer.sh
./deploy-portainer.sh
```

## 🔧 **Configuração para Produção**

### **1. Domínio Personalizado:**

```yaml
# No docker-compose.yml, adicione:
services:
  nginx:
    image: nginx:alpine
    ports:
      - '80:80'
      - '443:443'
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
      - ./ssl:/etc/nginx/ssl:ro
```

### **2. SSL/HTTPS:**

```bash
# Instale certbot
sudo apt install certbot

# Gere certificado
sudo certbot certonly --standalone -d seu-dominio.com

# Copie certificados para o projeto
sudo cp /etc/letsencrypt/live/seu-dominio.com/fullchain.pem ./ssl/
sudo cp /etc/letsencrypt/live/seu-dominio.com/privkey.pem ./ssl/
```

### **3. Backup Automático:**

```yaml
# Adicione ao docker-compose.yml:
services:
  backup:
    image: alpine:latest
    volumes:
      - app_data:/data
      - ./backups:/backups
    command: |
      sh -c "
        while true; do
          tar -czf /backups/backup-$(date +%Y%m%d-%H%M%S).tar.gz /data
          find /backups -name 'backup-*.tar.gz' -mtime +7 -delete
          sleep 86400
        done
      "
```

## 📊 **Monitoramento**

### **1. Logs:**

```bash
# Ver logs em tempo real
docker-compose logs -f

# Ver logs de um serviço específico
docker-compose logs -f backend
docker-compose logs -f frontend
```

### **2. Status dos Serviços:**

```bash
# Ver status
docker-compose ps

# Ver uso de recursos
docker stats
```

### **3. Health Checks:**

- Backend: `http://seu-servidor:8000/health`
- Frontend: `http://seu-servidor:5173`

## 🔄 **Atualizações**

### **1. Atualizar Código:**

```bash
# Via Git
git pull origin main
docker-compose build
docker-compose up -d

# Via Portainer
# Vá em Stacks > pc-express > Editor
# Atualize o YAML e clique em "Update the stack"
```

### **2. Rollback:**

```bash
# Voltar para versão anterior
docker-compose down
docker-compose up -d
```

## 🛡️ **Segurança**

### **1. Firewall:**

```bash
# Abrir apenas portas necessárias
sudo ufw allow 80
sudo ufw allow 443
sudo ufw allow 22
sudo ufw enable
```

### **2. Variáveis de Ambiente:**

- Use `SECRET_KEY` forte
- Configure `DEBUG=False`
- Use banco de dados externo se necessário

### **3. Backup:**

```bash
# Backup manual
docker-compose exec backend tar -czf /tmp/backup.tar.gz /app/data
docker cp $(docker-compose ps -q backend):/tmp/backup.tar.gz ./backup-$(date +%Y%m%d).tar.gz
```

## 🚨 **Solução de Problemas**

### **1. Serviço não inicia:**

```bash
# Ver logs
docker-compose logs backend

# Verificar recursos
docker stats

# Reiniciar serviço
docker-compose restart backend
```

### **2. Porta já em uso:**

```bash
# Verificar portas
sudo netstat -tulpn | grep :8000

# Parar outros serviços
sudo systemctl stop apache2  # ou nginx
```

### **3. Erro de permissão:**

```bash
# Corrigir permissões
sudo chown -R $USER:$USER .
chmod +x deploy-portainer.sh
```

## 📞 **Suporte**

- **Logs:** `docker-compose logs -f`
- **Status:** `docker-compose ps`
- **Recursos:** `docker stats`
- **Shell:** `docker-compose exec backend bash`

---

**PC Express** - Agora rodando na nuvem! ☁️🚀
