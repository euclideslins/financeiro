# 💰 Sistema Financeiro - API

Sistema de gerenciamento financeiro desenvolvido com **Node.js**, **TypeScript**, **Express** e **MySQL**.

## 🚀 Tecnologias

- **Node.js** + **TypeScript**
- **Express.js** - Framework web
- **MySQL** - Banco de dados
- **bcrypt** - Criptografia de senhas
- **Docker** - Containerização
- **VS Code** - Debug configurado

## 📋 Pré-requisitos

- **Node.js** 18+
- **Docker** e **Docker Compose**
- **VS Code** (recomendado para debug)

## 🛠️ Instalação

```bash
# Clone o repositório
git clone <url-do-repositorio>
cd financeiro

# Instale as dependências
npm install

# Configure as variáveis de ambiente
cp .env.example .env

# Inicie o banco de dados
npm run docker:up

# Execute as migrations
npm run db:init

# Inicie o servidor de desenvolvimento
npm run dev
```

## 🐛 Debug no VS Code

### **Configurações Disponíveis:**

O projeto já vem configurado com múltiplas opções de debug:

1. **🚀 Debug Server (ts-node)** - Debug direto com ts-node
2. **🔧 Debug with Nodemon** - Debug com hot reload
3. **🐛 Attach to Running Process** - Conectar a processo em execução
4. **🧪 Debug Current File** - Debug do arquivo atual

### **Como usar o debugger:**

1. **Pressione `F5`** ou vá em `Run and Debug` (Ctrl+Shift+D)
2. **Selecione** a configuração desejada
3. **Coloque breakpoints** clicando na margem esquerda das linhas
4. **Inicie o debug** clicando no botão play

### **Comandos úteis:**
- **F5**: Continuar execução
- **F10**: Step Over (próxima linha)
- **F11**: Step Into (entrar na função)
- **Shift+F11**: Step Out (sair da função)
- **Ctrl+Shift+F5**: Restart

### **Scripts de debug:**
```bash
# Debug com nodemon (hot reload)
npm run dev:debug

# Debug normal
npm run dev
```

## 🔐 Sistema de Autenticação

### **Funcionalidades de Segurança:**

- ✅ **Senhas criptografadas** com bcrypt (salt rounds: 12)
- ✅ **Middleware de autenticação** por token
- ✅ **Validação robusta** de entrada de dados
- ✅ **Senhas nunca expostas** nas respostas da API

### **Endpoints de Autenticação:**

#### **📝 Registrar Usuário**
```http
POST /api/users
Content-Type: application/json

{
  "name": "João Silva",
  "email": "joao@email.com",
  "password": "minhasenha123"
}
```

**Resposta:**
```json
{
  "success": true,
  "message": "User created successfully",
  "data": {
    "id": 1,
    "name": "João Silva",
    "email": "joao@email.com",
    "created_at": "2025-09-01T10:00:00.000Z",
    "updated_at": "2025-09-01T10:00:00.000Z"
  }
}
```

#### **🔑 Login**
```http
POST /api/users/login
Content-Type: application/json

{
  "email": "joao@email.com",
  "password": "minhasenha123"
}
```

**Resposta de Sucesso:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": 1,
      "name": "João Silva",
      "email": "joao@email.com"
    },
    "token": "jwt-token-aqui"
  }
}
```

**Resposta de Erro:**
```json
{
  "success": false,
  "message": "Invalid credentials",
  "error": "Email or password incorrect"
}
```

### **Rotas Protegidas:**

As seguintes rotas requerem **autenticação por token**:

- `GET /api/users` - Listar usuários
- `GET /api/users/:id` - Buscar usuário por ID
- `POST /api/users` - Criar usuário (requer token)
- `PUT /api/users/:id` - Atualizar usuário
- `DELETE /api/users/:id` - Deletar usuário

### **Como usar autenticação:**

```http
GET /api/users
Authorization: Bearer seu-jwt-token-aqui
```

### **Validações de Senha:**

- ✅ **Mínimo 6 caracteres**
- ✅ **Campo obrigatório**
- ✅ **Hash automático** no cadastro/atualização

## 📚 API Endpoints

### **👤 Usuários**

| Método | Endpoint | Descrição | Auth | Validação |
|--------|----------|-----------|------|-----------|
| `GET` | `/api/users` | Listar usuários | ✅ | - |
| `GET` | `/api/users/:id` | Buscar por ID | ✅ | - |
| `POST` | `/api/users` | Criar usuário | ✅ | `validateCreateUser` |
| `POST` | `/api/users/login` | Login | ❌ | - |
| `PUT` | `/api/users/:id` | Atualizar | ✅ | `validateUpdateUser` |
| `DELETE` | `/api/users/:id` | Deletar | ✅ | - |

### **🏥 Health Check**

```http
GET /health
```

**Resposta:**
```json
{
  "status": "OK",
  "timestamp": "2025-09-01T10:00:00.000Z",
  "uptime": 123.456
}
```

## 🗄️ Banco de Dados

### **Scripts úteis:**

```bash
# Subir o banco
npm run docker:up

# Logs do banco
npm run docker:logs

# Parar o banco
npm run docker:down

# Executar migrations
npm run db:init
```

### **Estrutura da tabela users:**

```sql
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

## 🔧 Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev              # Servidor com hot reload
npm run dev:debug        # Servidor com debug habilitado
npm start               # Servidor de produção

# Build
npm run build           # Compilar TypeScript

# Docker
npm run docker:up       # Subir containers
npm run docker:down     # Parar containers  
npm run docker:logs     # Ver logs dos containers

# Banco de dados
npm run db:init         # Executar migrations
```

## 📁 Estrutura do Projeto

```
src/
├── controllers/        # Controllers da API
├── services/          # Regras de negócio
├── routes/            # Definição das rotas
├── middleware/        # Middlewares personalizados
├── database/          # Configuração do banco
├── config/            # Configurações gerais
├── types/             # Interfaces TypeScript
└── server.ts          # Arquivo principal

.vscode/               # Configurações do VS Code
├── launch.json        # Configurações de debug
├── settings.json      # Configurações do workspace
└── tasks.json         # Tasks automatizadas
```

## 🚀 Exemplo de Uso Completo

```bash
# 1. Criar um usuário
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "João Silva",
    "email": "joao@email.com",
    "password": "minhasenha123"
  }'

# 2. Fazer login
curl -X POST http://localhost:3000/api/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "joao@email.com",
    "password": "minhasenha123"
  }'

# 3. Listar usuários (com token)
curl -X GET http://localhost:3000/api/users \
  -H "Authorization: Bearer seu-jwt-token-aqui"
```

## 🔒 Segurança

- **Senhas criptografadas** com bcrypt
- **Validação de entrada** em todos os endpoints
- **Middleware de autenticação** configurado
- **Variáveis de ambiente** para dados sensíveis
- **Headers de segurança** configurados
- **Rate limiting** (recomendado implementar)

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/nova-funcionalidade`)
3. Commit suas mudanças (`git commit -am 'Add nova funcionalidade'`)
4. Push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença ISC.
