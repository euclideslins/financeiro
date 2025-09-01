# 💰 Sistema Financeiro - API

Sistema de gerenciamento financeiro desenvolvido com **Node.js**, **TypeScript**, **Express**, **MySQL** e **Redis**.

## 🚀 Tecnologias

- **Node.js** + **TypeScript**
- **Express.js** - Framework web
- **MySQL 8.0** - Banco de dados principal
- **Redis 7.2** - Cache em memória
- **bcrypt** - Criptografia de senhas
- **Docker** + **Docker Compose** - Containerização
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

# Inicie os serviços (MySQL + Redis)
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
- ✅ **Cache inteligente** com Redis

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

## 🚀 Sistema de Cache com Redis

### **Funcionalidades do Cache:**

- ✅ **Cache automático** de consultas de usuários
- ✅ **Cache hit logging** para monitoramento
- ✅ **Invalidação inteligente** de cache
- ✅ **Performance otimizada** para consultas frequentes

### **Como funciona:**

1. **Primeira consulta**: Busca no MySQL e salva no Redis
2. **Consultas subsequentes**: Retorna direto do Redis (muito mais rápido)
3. **Cache keys**: 
   - `users:all` - Lista de todos os usuários
   - `users:{id}` - Usuário específico por ID

### **Logs de Cache:**
```bash
✅ Redis cache hit  # Quando encontra dados no cache
```

### **Benefícios:**
- **📈 Performance**: Consultas até 100x mais rápidas
- **🔄 Menos carga no MySQL**: Reduz consultas no banco principal
- **⚡ Resposta instantânea**: Cache em memória

## 📚 API Endpoints

### **👤 Usuários**

| Método | Endpoint | Descrição | Auth | Cache | Validação |
|--------|----------|-----------|------|-------|-----------|
| `GET` | `/api/users` | Listar usuários | ✅ | ✅ | - |
| `GET` | `/api/users/:id` | Buscar por ID | ✅ | ✅ | - |
| `POST` | `/api/users` | Criar usuário | ✅ | ❌ | `validateCreateUser` |
| `POST` | `/api/users/login` | Login | ❌ | ❌ | - |
| `PUT` | `/api/users/:id` | Atualizar | ✅ | ❌ | `validateUpdateUser` |
| `DELETE` | `/api/users/:id` | Deletar | ✅ | ❌ | - |

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

### **Serviços Containerizados:**

- **MySQL 8.0**: Banco principal na porta `3306`
- **Redis 7.2**: Cache em memória na porta `6379`

### **Scripts úteis:**

```bash
# Subir todos os serviços (MySQL + Redis)
npm run docker:up

# Logs dos serviços
npm run docker:logs

# Parar todos os serviços
npm run docker:down

# Executar migrations no MySQL
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

### **Configuração do Redis:**

```yaml
# docker-compose.yaml
redis:
  image: redis:7.2
  container_name: redis-db
  restart: always
  ports:
    - "6379:6379"
  volumes:
    - redis_data:/data
  command: ["redis-server", "--appendonly", "yes"]
```

## 🏗️ Arquitetura do Sistema

### **Padrão de Arquitetura:**

```
📊 Client Request
    ↓
🛡️ Middleware (Auth/Validation)
    ↓
🎯 Controller (Route Handler)
    ↓
⚡ Cache Check (Redis)
    ↓ (se não houver cache)
🔧 Service (Business Logic)
    ↓
🗄️ Database (MySQL)
    ↓
💾 Cache Set (Redis)
    ↓
📤 Response
```

### **Camadas da Aplicação:**

- **🛡️ Middleware**: Autenticação, validação, tratamento de erros
- **🎯 Controllers**: Manipulação de requests/responses
- **🔧 Services**: Regras de negócio e lógica
- **📊 Shared Functions**: Utilitários reutilizáveis
- **🗄️ Database**: Conexão e queries MySQL
- **⚡ Cache**: Sistema Redis para performance

## 🔧 Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev              # Servidor com hot reload
npm run dev:debug        # Servidor com debug habilitado
npm start               # Servidor de produção

# Build
npm run build           # Compilar TypeScript

# Docker
npm run docker:up       # Subir containers (MySQL + Redis)
npm run docker:down     # Parar containers  
npm run docker:logs     # Ver logs dos containers

# Banco de dados
npm run db:init         # Executar migrations
```

## 📁 Estrutura do Projeto

```
src/
├── controllers/        # Controllers da API
│   └── UserController.ts
├── services/          # Regras de negócio
│   └── Users/
│       ├── getUser.service.ts
│       ├── createUser.service.ts
│       ├── updateUser.service.ts
│       └── deleteUser.service.ts
├── routes/            # Definição das rotas
│   └── user.routes.ts
├── middleware/        # Middlewares personalizados
│   ├── Authentication/
│   ├── validation/
│   └── errorHandler.ts
├── shared/            # Funções utilitárias
│   └── sharedFunctions.ts
├── database/          # Configuração do banco
│   └── connection.ts
├── config/            # Configurações gerais
│   ├── database.ts
│   └── redis.ts
├── types/             # Interfaces TypeScript
│   └── User.ts
└── server.ts          # Arquivo principal

.vscode/               # Configurações do VS Code
├── launch.json        # Configurações de debug
├── settings.json      # Configurações do workspace
└── tasks.json         # Tasks automatizadas

docker-compose.yaml    # Orquestração dos containers
init.sql              # Scripts de inicialização do banco
```

## 🚀 Exemplo de Uso Completo

```bash
# 1. Subir os serviços
npm run docker:up

# 2. Criar um usuário
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "João Silva",
    "email": "joao@email.com",
    "password": "minhasenha123"
  }'

# 3. Fazer login
curl -X POST http://localhost:3000/api/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "joao@email.com",
    "password": "minhasenha123"
  }'

# 4. Listar usuários (primeira vez: MySQL)
curl -X GET http://localhost:3000/api/users \
  -H "Authorization: Bearer seu-jwt-token-aqui"

# 5. Listar usuários novamente (segunda vez: Redis cache ⚡)
curl -X GET http://localhost:3000/api/users \
  -H "Authorization: Bearer seu-jwt-token-aqui"
```

## ⚡ Performance e Otimizações

### **Cache Strategy:**
- **Cache Hit Rate**: Monitorado via logs
- **TTL**: Configurável por tipo de dados
- **Invalidação**: Automática em updates/deletes

### **Database Optimization:**
- **Connection Pooling**: MySQL configurado
- **Indexes**: Otimizados para consultas frequentes
- **Query Optimization**: Prepared statements

### **Memory Management:**
- **Redis**: Persistência com AOF (Append Only File)
- **Connection Pooling**: Reutilização de conexões
- **Garbage Collection**: Node.js otimizado

## 🔒 Segurança

- **Senhas criptografadas** com bcrypt (salt rounds: 12)
- **Validação de entrada** em todos os endpoints
- **Middleware de autenticação** configurado
- **Variáveis de ambiente** para dados sensíveis
- **Headers de segurança** configurados
- **Cache seguro** - senhas nunca em cache
- **SQL Injection**: Proteção com prepared statements

## 🔍 Monitoramento

### **Logs Estruturados:**
```bash
✅ Database connected successfully
✅ Redis connected successfully  
✅ Redis cache hit
🚀 Server running on port 3000
```

### **Health Checks:**
- Database connectivity
- Redis connectivity
- Server uptime
- Memory usage

## 📈 Escalabilidade

### **Atual (Pequena/Média escala):**
- ✅ Arquitetura em camadas
- ✅ Cache Redis implementado
- ✅ Connection pooling
- ✅ TypeScript type safety

### **Próximos passos (Grande escala):**
- 🔄 Rate limiting
- 🔄 Microserviços
- 🔄 Load balancer
- 🔄 Monitoring (Prometheus/Grafana)

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/nova-funcionalidade`)
3. Commit suas mudanças (`git commit -am 'Add nova funcionalidade'`)
4. Push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença ISC.

---

### 📊 **Status do Projeto**

- ✅ **CRUD Completo** - Usuários
- ✅ **Autenticação** - Login/Register
- ✅ **Cache Redis** - Performance otimizada
- ✅ **Debug VS Code** - Ambiente de desenvolvimento
- ✅ **Docker** - Containerização completa
- ✅ **TypeScript** - Type safety
- 🔄 **JWT** - Em desenvolvimento
- 🔄 **Testes** - Planejado
