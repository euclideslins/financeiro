#  Sistema Financeiro - API

API REST para gerenciamento financeiro construída com Node.js, TypeScript, Express, MySQL e Redis.

##  Tecnologias

- Node.js 18+ com TypeScript
- Express.js 5.x
- MySQL 8.0 (via Docker)
- Redis 7.2 (cache)
- bcrypt (hash de senhas, 12 rounds)
- JWT (autenticação, expira em 12h)
- Jest (testes unitários)
- Docker Compose

##  Instalação Rápida

``````powershell
# 1. Instalar dependências
npm install

# 2. Configurar ambiente
copy .env.sample .env
# Edite .env com suas credenciais

# 3. Subir infraestrutura (MySQL + Redis)
npm run docker:up

# 4. Criar tabelas
npm run db:init

# 5. Iniciar servidor
npm run dev
``````

Servidor estará em: http://localhost:3000

##  Variáveis de Ambiente

Variáveis obrigatórias em `.env`:

``````env
PORT=3000
DB_HOST=localhost
DB_USER=euclides
DB_PASSWORD=rootpassword
DB_NAME=financeiro
DB_PORT=3306
REDIS_HOST=localhost
REDIS_PORT=6379
JWT_SECRET=seu_secret_super_seguro_aqui
JWT_EXPIRES_IN=12h
NODE_ENV=development
``````

##  Endpoints da API

### Usuários

| Método | Endpoint | Descrição | Auth | Rate Limit |
|--------|----------|-----------|------|------------|
| POST | `/api/users/register` | Registrar novo usuário |  | 3/hora |
| POST | `/api/users/login` | Login |  | 5/5min |
| GET | `/api/users` | Listar usuários |  | 100/15min |
| GET | `/api/users/:id` | Buscar usuário |  | 100/15min |
| POST | `/api/users` | Criar usuário (admin) |  | 30/15min |
| PUT | `/api/users/:id` | Atualizar usuário |  | 30/15min |
| DELETE | `/api/users/:id` | Deletar usuário |  | 30/15min |

### Categorias

| Método | Endpoint | Descrição | Auth | Rate Limit |
|--------|----------|-----------|------|------------|
| GET | `/api/categories/user/:user_id` | Listar categorias do usuário |  | 100/15min |
| GET | `/api/categories/:id` | Buscar categoria |  | 100/15min |
| POST | `/api/categories` | Criar categoria |  | 30/15min |
| PUT | `/api/categories/:id` | Atualizar categoria |  | 30/15min |
| DELETE | `/api/categories/:id` | Deletar categoria |  | 30/15min |

### Contas

| Método | Endpoint | Descrição | Auth |
|--------|----------|-----------|------|
| POST | `/api/accounts/create/:userId` | Criar conta |  |
| GET | `/api/accounts` | Listar contas |  |
| GET | `/api/accounts/:id` | Buscar conta |  |
| PUT | `/api/accounts/:id` | Atualizar conta |  |

### Health Check

``````http
GET /health
``````

Resposta:
``````json
{
  "status": "OK",
  "timestamp": "2025-11-13T10:00:00.000Z",
  "uptime": 123.456
}
``````

##  Rate Limiters (Proteção Anti-Abuso)

Sistema de proteção com 4 limitadores específicos por tipo de operação.

### Limitadores Configurados

| Nome | Rotas Protegidas | Limite | Janela | Propósito |
|------|------------------|--------|---------|-----------|
| **authLimiter** | `POST /api/users/login` | 5 req | 5 min | Anti brute-force em login |
| **registerLimiter** | `POST /api/users/register` | 3 req | 1 hora | Prevenir spam de contas |
| **apiLimiter** | GET (leitura geral) | 100 req | 15 min | Uso normal da API |
| **writeLimiter** | POST/PUT/DELETE (escrita) | 30 req | 15 min | Operações de modificação |

### Detalhes de Implementação

**Arquivo:** `src/middleware/rate-limiter.ts`

``````typescript
import rateLimit from 'express-rate-limit';

// Login - 5 tentativas por 5 minutos
export const authLimiter = rateLimit({
    windowMs: 5 * 60 * 1000,      // 5 minutos
    max: 5,                        // 5 requisições
    skipSuccessfulRequests: true,  // Só conta tentativas falhadas
    message: {
        success: false,
        message: 'Too many login attempts, please try again later',
        error: 'Rate limit exceeded'
    }
});

// Registro - 3 contas por hora
export const registerLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,  // 1 hora
    max: 3,
    message: {
        success: false,
        message: 'Too many accounts created, please try again later',
        error: 'Rate limit exceeded'
    }
});

// Leituras - 100 por 15 minutos
export const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    skip: (req) => req.path === '/health',  // Health não tem limite
    message: {
        success: false,
        message: 'Too many requests, please try again later',
        error: 'Rate limit exceeded'
    }
});

// Escritas - 30 por 15 minutos
export const writeLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 30,
    message: {
        success: false,
        message: 'Too many write operations, please try again later',
        error: 'Rate limit exceeded'
    }
});
``````

### Resposta Quando Bloqueado

Status: **HTTP 429 Too Many Requests**

``````json
{
  "success": false,
  "message": "Too many login attempts, please try again later",
  "error": "Rate limit exceeded"
}
``````

**Headers de resposta:**
``````http
RateLimit-Limit: 5
RateLimit-Remaining: 0
RateLimit-Reset: 1699876543
Retry-After: 300
``````

### Como Testar

**Teste manual (PowerShell):**

``````powershell
# Testar limite de login (5 tentativas)
1..6 | ForEach-Object {
    Write-Host "`nTentativa $_" -ForegroundColor Cyan
    try {
        Invoke-RestMethod -Method POST `
            -Uri "http://localhost:3000/api/users/login" `
            -Headers @{"Content-Type"="application/json"} `
            -Body '{"email":"test@test.com","password":"wrong"}'
        Write-Host " Permitido" -ForegroundColor Green
    } catch {
        if ($_.Exception.Response.StatusCode.value__ -eq 429) {
            Write-Host " BLOQUEADO (429)" -ForegroundColor Red
        }
    }
}
``````

**Teste automatizado completo:**

``````powershell
.\test-rate-limiter.ps1
``````

### Rotas SEM Limite

- `GET /health` - Monitoramento sempre disponível

### Resetar Limites (Desenvolvimento)

Os limites são **por endereço IP**. Para resetar:

1. **Reiniciar servidor:** `Ctrl+C`  `npm run dev`
2. **Aguardar janela:** 5min / 15min / 1 hora

##  Exemplos de Uso

### Registrar usuário

``````powershell
$body = @{
    name = "João Silva"
    email = "joao@example.com"
    password = "senha123"
} | ConvertTo-Json

Invoke-RestMethod -Method POST -Uri "http://localhost:3000/api/users/register" `
    -Headers @{"Content-Type"="application/json"} -Body $body
``````

### Login e obter token

``````powershell
$body = @{
    email = "joao@example.com"
    password = "senha123"
} | ConvertTo-Json

$response = Invoke-RestMethod -Method POST -Uri "http://localhost:3000/api/users/login" `
    -Headers @{"Content-Type"="application/json"} -Body $body

$token = $response.data.token
``````

### Criar categoria

``````powershell
$body = @{
    name = "Alimentação"
    kind = "expense"
    parent_id = $null
    user_id = 1
} | ConvertTo-Json

Invoke-RestMethod -Method POST -Uri "http://localhost:3000/api/categories" `
    -Headers @{
        "Authorization" = "Bearer $token"
        "Content-Type" = "application/json"
    } -Body $body
``````

##  Testes

``````powershell
npm test                 # Todos os testes
npm run test:coverage    # Com cobertura
npm run test:watch       # Modo watch
``````

Cobertura atual: **~80%**

##  Validações

### Usuários
- Nome: obrigatório, não vazio
- Email: obrigatório, formato válido
- Senha: mínimo 6 caracteres

### Categorias
- Nome: obrigatório, não vazio
- Kind: deve ser 'expense' ou 'income'
- User ID: obrigatório, deve existir

##  Cache (Redis)

Cache implementado em:
- **GET /api/users** - TTL: 1 hora
- **GET /api/users/:id** - TTL: 1 hora

Invalidação automática em:
- POST, PUT, DELETE de usuários

##  Estrutura do Projeto

``````
src/
 controllers/
 services/
 routes/
 middleware/
    rate-limiter.ts     Rate limiters aqui
    validation.ts
    errorHandler.ts
 config/
 __tests__/
``````

##  Scripts Disponíveis

``````powershell
npm run dev              # Servidor com hot reload
npm run dev:debug        # Debug habilitado
npm start                # Servidor produção
npm run build            # Compilar TypeScript
npm run docker:up        # Subir MySQL + Redis
npm run docker:down      # Parar containers
npm run db:init          # Executar migrations
npm test                 # Todos os testes
npm run test:coverage    # Com cobertura
``````

##  Debug no VS Code

Pressione `F5` e escolha:
- **Debug Server (ts-node)** - Debug direto
- **Debug with Nodemon** - Debug com hot reload

##  Melhorias Futuras

- [ ] Logger estruturado (Winston/Pino)
- [ ] Paginação em listagens
- [ ] Testes E2E
- [ ] OpenAPI/Swagger
- [ ] CI/CD

##  Licença

ISC

---

**Status**: MVP funcional com autenticação, validações, cache e rate limiting 
