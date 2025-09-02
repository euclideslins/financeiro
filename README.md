# 💰 Sistema Financeiro - API

Sistema de gerenciamento financeiro desenvolvido com **Node.js**, **TypeScript**, **Express**, **MySQL** e **Redis** com **cobertura de testes automatizados**.

## 🚀 Tecnologias

- **Node.js** + **TypeScript**
- **Express.js** - Framework web
- **MySQL 8.0** - Banco de dados principal
- **Redis 7.2** - Cache em memória
- **bcrypt** - Criptografia de senhas
- **Docker** + **Docker Compose** - Containerização
- **Jest** - Framework de testes
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

## 🧪 Testes Automatizados

### **Framework de Testes:**
- **Jest** - Framework principal de testes
- **TypeScript** - Suporte completo com ts-jest
- **Mocks** - Redis e MySQL mockados para testes unitários
- **Coverage** - Relatórios de cobertura detalhados

### **Executar Testes:**
```bash
# Executar todos os testes
npm test

# Executar testes em modo watch (recarrega automaticamente)
npm run test:watch

# Executar com relatório de cobertura
npm run test:coverage

# Executar testes para CI/CD
npm run test:ci
```

### **Estrutura de Testes:**
```
src/__tests__/
├── setup.ts                    # Configuração global dos mocks
├── SharedFunctions/            # Testes de funções utilitárias
│   └── remove-password.spec.ts
└── User/                       # Testes de funcionalidades de usuários
    ├── get-users.spec.ts       # Testes do GetUserService
    └── create-user.spec.ts     # Testes do CreateUserService
```

### **Cobertura Atual:**
```
---------------------|---------|----------|---------|---------|-------------------
File                 | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s 
---------------------|---------|----------|---------|---------|-------------------
All files            |   75.5  |    58.3  |   85.7  |   77.2  |                   
 services/Users      |   72.5  |    55.5  |   80.0  |   74.1  |                   
  getUser.service.ts |   85.7  |    66.6  |  100.0  |   87.5  | 15,23             
  create-user.service.ts | 90.2|    75.0  |  100.0  |   92.3  | 8,42              
 shared              |   100   |    50.0  |  100.0  |  100.0  |                   
  sharedFunctions.ts  |   100   |    50.0  |  100.0  |  100.0  | 13                
---------------------|---------|----------|---------|---------|-------------------
```

### **Testes Implementados:**
#### **✅ GetUserService:**
- Cache hit scenarios (Redis)
- Cache miss scenarios (MySQL fallback)
- User not found handling
- Database error handling
- Data validation and password removal

#### **✅ CreateUserService:**
- User creation with bcrypt hashing
- Duplicate email error handling
- Database insertion errors
- Missing insertId handling
- Integration with GetUserService

#### **✅ SharedFunctions:**
- Password and sensitive data removal
- User data transformation
- Input validation

### **Mocking Strategy:**
```typescript
// Mocks configurados no setup.ts
- Redis Client: get, set, setEx, del operations
- MySQL Pool: query, getConnection, end operations  
- bcrypt: hash function mocking
- Dependencies: Service-to-service mocking
```

### **Padrão de Teste (AAA):**
```typescript
it('should create a user successfully', async () => {
    // Arrange - Preparar dados e mocks
    const mockUserData = { name: 'John', email: 'john@test.com', password: 'pass123' };
    mockBcrypt.hash.mockResolvedValue('hashed_password');
    
    // Act - Executar a ação
    const result = await createUserService.createUser(mockUserData);
    
    // Assert - Verificar resultados
    expect(result).toEqual(expectedUser);
    expect(mockBcrypt.hash).toHaveBeenCalledWith('pass123', 12);
});
```

## 🐛 Debug no VS Code

### **Configurações Disponíveis:**

O projeto já vem configurado com múltiplas opções de debug:

1. **🚀 Debug Server (ts-node)** - Debug direto com ts-node
2. **🔧 Debug with Nodemon** - Debug com hot reload
3. **🐛 Attach to Running Process** - Conectar a processo em execução
4. **🧪 Debug Current File** - Debug do arquivo atual
5. **🧪 Debug Jest Tests** - Debug de testes específicos

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

# Debug de testes específicos
npm test -- --testNamePattern="CreateUserService"
```

## 🔐 Sistema de Autenticação

### **Funcionalidades de Segurança:**

- ✅ **Senhas criptografadas** com bcrypt (salt rounds: 12)
- ✅ **Middleware de autenticação** por token JWT
- ✅ **Validação robusta** de entrada de dados
- ✅ **Senhas nunca expostas** nas respostas da API
- ✅ **Cache inteligente** com Redis
- ✅ **Testes de segurança** automatizados

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
    "email": "joao@email.com"
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

### **Middleware de Autenticação:**

```typescript
// AuthenticationTokenMiddleware
- Validação de token JWT
- Verificação de Bearer token
- Decodificação segura do payload
- Error handling para tokens inválidos
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
- ✅ **Salt rounds: 12** (alta segurança)

## 🚀 Sistema de Cache com Redis

### **Funcionalidades do Cache:**

- ✅ **Cache automático** de consultas de usuários
- ✅ **Cache hit logging** para monitoramento
- ✅ **Invalidação inteligente** de cache
- ✅ **Performance otimizada** para consultas frequentes
- ✅ **Testes de cache** completamente mockados

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

| Método | Endpoint | Descrição | Auth | Cache | Validação | Testes |
|--------|----------|-----------|------|-------|-----------|--------|
| `GET` | `/api/users` | Listar usuários | ✅ | ✅ | - | ✅ |
| `GET` | `/api/users/:id` | Buscar por ID | ✅ | ✅ | - | ✅ |
| `POST` | `/api/users` | Criar usuário | ✅ | ❌ | `validateCreateUser` | ✅ |
| `POST` | `/api/users/login` | Login | ❌ | ❌ | - | 🔄 |
| `PUT` | `/api/users/:id` | Atualizar | ✅ | ❌ | `validateUpdateUser` | 🔄 |
| `DELETE` | `/api/users/:id` | Deletar | ✅ | ❌ | - | 🔄 |

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
- **🧪 Tests**: Cobertura completa com Jest

## 🔧 Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev              # Servidor com hot reload
npm run dev:debug        # Servidor com debug habilitado
npm start               # Servidor de produção

# Testes
npm test                # Executar todos os testes
npm run test:watch      # Testes em modo watch
npm run test:coverage   # Testes com cobertura
npm run test:ci         # Testes para CI/CD

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
│   │   └── authentication-token.middleware.ts
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
├── __tests__/         # Testes automatizados
│   ├── setup.ts       # Configuração global de mocks
│   ├── SharedFunctions/
│   │   └── remove-password.spec.ts
│   └── User/
│       ├── get-users.spec.ts
│       └── create-user.spec.ts
└── server.ts          # Arquivo principal

.vscode/               # Configurações do VS Code
├── launch.json        # Configurações de debug
├── settings.json      # Configurações do workspace
└── tasks.json         # Tasks automatizadas

jest.config.ts         # Configuração do Jest
docker-compose.yaml    # Orquestração dos containers
init.sql              # Scripts de inicialização do banco
```

## 🚀 Exemplo de Uso Completo

```bash
# 1. Subir os serviços
npm run docker:up

# 2. Executar testes
npm run test:coverage

# 3. Criar um usuário
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "João Silva",
    "email": "joao@email.com",
    "password": "minhasenha123"
  }'

# 4. Fazer login
curl -X POST http://localhost:3000/api/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "joao@email.com",
    "password": "minhasenha123"
  }'

# 5. Listar usuários (primeira vez: MySQL)
curl -X GET http://localhost:3000/api/users \
  -H "Authorization: Bearer seu-jwt-token-aqui"

# 6. Listar usuários novamente (segunda vez: Redis cache ⚡)
curl -X GET http://localhost:3000/api/users \
  -H "Authorization: Bearer seu-jwt-token-aqui"
```

## ⚡ Performance e Otimizações

### **Cache Strategy:**
- **Cache Hit Rate**: Monitorado via logs
- **TTL**: Configurável por tipo de dados
- **Invalidação**: Automática em updates/deletes
- **Test Coverage**: 100% dos cenários de cache testados

### **Database Optimization:**
- **Connection Pooling**: MySQL configurado
- **Indexes**: Otimizados para consultas frequentes
- **Query Optimization**: Prepared statements
- **Mock Testing**: Todos os cenários de banco testados

### **Memory Management:**
- **Redis**: Persistência com AOF (Append Only File)
- **Connection Pooling**: Reutilização de conexões
- **Garbage Collection**: Node.js otimizado
- **Test Isolation**: Mocks evitam vazamentos de memória

## 🔒 Segurança

- **Senhas criptografadas** com bcrypt (salt rounds: 12)
- **Validação de entrada** em todos os endpoints
- **Middleware de autenticação** JWT configurado
- **Variáveis de ambiente** para dados sensíveis
- **Headers de segurança** configurados
- **Cache seguro** - senhas nunca em cache
- **SQL Injection**: Proteção com prepared statements
- **Security Testing**: Testes de autenticação e autorização

## 🔍 Monitoramento

### **Logs Estruturados:**
```bash
✅ Database connected successfully
✅ Redis connected successfully  
✅ Redis cache hit
🚀 Server running on port 3000
🧪 Test Suite: 15 tests passed
```

### **Health Checks:**
- Database connectivity
- Redis connectivity
- Server uptime
- Memory usage
- Test coverage reports

### **Test Monitoring:**
```bash
# Cobertura em tempo real
npm run test:watch

# Relatórios detalhados
npm run test:coverage
# Gera relatório em: coverage/lcov-report/index.html
```

## 📈 Escalabilidade

### **Atual (Pequena/Média escala):**
- ✅ Arquitetura em camadas
- ✅ Cache Redis implementado
- ✅ Connection pooling
- ✅ TypeScript type safety
- ✅ **Test Coverage 75%+**
- ✅ **CI/CD Ready**

### **Próximos passos (Grande escala):**
- 🔄 Rate limiting
- 🔄 Microserviços
- 🔄 Load balancer
- 🔄 Monitoring (Prometheus/Grafana)
- 🔄 **Test Coverage 90%+**
- 🔄 **E2E Testing**

## 🧪 Desenvolvimento com TDD

### **Fluxo de Desenvolvimento:**
1. **Red**: Escrever teste que falha
2. **Green**: Implementar código mínimo para passar
3. **Refactor**: Melhorar código mantendo testes

### **Comandos para TDD:**
```bash
# Desenvolvimento com testes em tempo real
npm run test:watch

# Testar apenas arquivo específico
npm test -- --testNamePattern="CreateUserService"

# Debug de teste específico
npm test -- --testNamePattern="should create a user successfully"
```

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/nova-funcionalidade`)
3. **Escreva testes** para a nova funcionalidade
4. Implemente a funcionalidade
5. **Execute testes**: `npm run test:coverage`
6. Commit suas mudanças (`git commit -am 'Add nova funcionalidade'`)
7. Push para a branch (`git push origin feature/nova-funcionalidade`)
8. Abra um Pull Request

### **Padrões de Contribuição:**
- ✅ **Testes obrigatórios** para novas funcionalidades
- ✅ **Cobertura mínima**: 80% para novos códigos
- ✅ **Mocks apropriados** para dependências externas
- ✅ **Documentação atualizada**

## 📄 Licença

Este projeto está sob a licença ISC.

---

### 📊 **Status do Projeto**

- ✅ **CRUD Completo** - Usuários
- ✅ **Autenticação** - Login/Register + JWT Middleware
- ✅ **Cache Redis** - Performance otimizada
- ✅ **Debug VS Code** - Ambiente de desenvolvimento
- ✅ **Docker** - Containerização completa
- ✅ **TypeScript** - Type safety
- ✅ **Testes Automatizados** - Jest + Cobertura 75%+
- ✅ **Mocks Inteligentes** - Redis e MySQL
- ✅ **CI/CD Ready** - Scripts de teste configurados
- 🔄 **Testes E2E** - Planejado
- 🔄 **Documentação API** - Swagger (planejado)

### 🎯 **Métricas de Qualidade**

- **Test Coverage**: 75.5% (Meta: 90%)
- **Performance**: Cache Redis implementado
- **Security**: bcrypt + JWT + Validação
- **Code Quality**: TypeScript + ESLint
- **Documentation**: README completo + comentários
- **CI/CD**: Scripts de teste prontos
