# 🤖 Contexto do Projeto - Sistema Financeiro com Análise IA

## 📋 Visão Geral

Sistema de gerenciamento financeiro pessoal que coleta transações do usuário e utiliza **LLM (Large Language Model)** local para análise inteligente de gastos, sugestões de economia e criação de planos de quitação de dívidas.

---

## 🎯 Objetivo Principal

**Coletar dados financeiros → Processar com IA → Gerar insights acionáveis**

O sistema deve:
1. Registrar todas as transações financeiras (receitas, despesas, transferências)
2. Calcular saldos em tempo real
3. Agregar dados por categorias e períodos
4. Enviar dados estruturados para um LLM (Ollama/llama3.2)
5. Retornar análises inteligentes: padrões de gastos, alertas, recomendações
6. Criar planos personalizados de quitação de dívidas

---

## 🏗️ Arquitetura Atual

### Stack Tecnológico
- **Backend:** Node.js 18+ com TypeScript (CommonJS)
- **Framework:** Express.js 5.x
- **Banco de Dados:** MySQL 8.0 (via Docker)
- **Cache:** Redis 7.2
- **Autenticação:** JWT (expira em 12h)
- **Segurança:** bcrypt (12 rounds), Rate Limiters
- **Testes:** Jest 30.x (~80% cobertura)
- **LLM:** Ollama local (llama3.2) - a ser implementado

### Estrutura de Camadas
```
┌─────────────────────────┐
│  Routes (HTTP)          │ ← Rate limiters, Auth, Validations
├─────────────────────────┤
│  Controllers            │ ← Orquestração de requests
├─────────────────────────┤
│  Services               │ ← Lógica de negócio
├─────────────────────────┤
│  Database (MySQL)       │ ← Pool de conexões
│  Cache (Redis)          │ ← TTL: 1h (users), 7 dias (análises)
└─────────────────────────┘
```

---

## 📊 Modelo de Dados Implementado

### Tabelas Existentes

**1. users**
- Campos: id, name, email, password_hash, created_at, updated_at, deleted_at
- Autenticação via JWT
- Soft delete

**2. accounts** (contas bancárias)
- Tipos: wallet, current, savings
- Campos: id, user_id, name, type, currency_code, opening_balance_cents
- Relacionamento: 1 user → N accounts

**3. categories** (categorias de gastos)
- Tipos: expense, income
- Suporta hierarquia (parent_id)
- Campos: id, user_id, parent_id, name, kind
- Constraint: nome único por usuário/parent

### Tabelas a Implementar (para IA)

**4. transactions** (⚠️ CRÍTICO - sem isso, IA não funciona)
- Tipos: income, expense, transfer_in, transfer_out
- Campos essenciais: amount_cents, description, merchant, transaction_date
- Campos para IA: is_essential, is_recurring, ai_tags (JSON)
- Relacionamentos: user_id, account_id, category_id

**5. debts** (dívidas para planejamento)
- Campos: total_amount_cents, paid_amount_cents, interest_rate, monthly_payment_cents
- Status: active, paid, renegotiated

**6. ai_analyses** (histórico de análises)
- Tipos: monthly_summary, debt_plan, savings_tips, spending_alert
- Campos: summary_text (TEXT), insights (JSON), recommendations (JSON)
- Metadata: model_used, tokens_used, processing_time_ms

---

## 🔌 Endpoints Implementados

### Autenticação
- `POST /api/users/register` - Registro (limit: 3/hora)
- `POST /api/users/login` - Login (limit: 5/5min)

### Usuários
- `GET /api/users` - Listar (auth + cache 1h)
- `GET /api/users/:id` - Buscar por ID
- `PUT /api/users/:id` - Atualizar (auth)
- `DELETE /api/users/:id` - Deletar (soft delete)

### Categorias
- `GET /api/categories/user/:user_id` - Listar por usuário
- `POST /api/categories` - Criar (auth + validação)
- `PUT /api/categories/:id` - Atualizar
- `DELETE /api/categories/:id` - Soft delete

### Contas
- `GET /api/accounts` - Listar contas
- `POST /api/accounts/create/:userId` - Criar conta
- `PUT /api/accounts/:id` - Atualizar nome

⚠️ **Faltando:** Endpoints de transações, saldo, análise IA

---

## 🤖 Fluxo de Análise IA (Planejado)

```
1. Usuário registra transações
   ↓
2. Sistema agrega dados:
   - Gastos por categoria
   - Transações recorrentes
   - Cálculo de saldo
   ↓
3. Service formata dados em prompt estruturado
   ↓
4. LLM Service (Ollama) recebe:
   {
     "renda_mensal": 5000,
     "gastos_por_categoria": [
       {"Alimentação": 1200},
       {"Transporte": 800}
     ],
     "dividas": [...]
   }
   ↓
5. LLM retorna análise:
   {
     "summary": "Seus gastos com alimentação...",
     "insights": [...],
     "recommendations": [
       "Reduza gastos com delivery em 30%",
       "Priorize dívida X pelo método avalanche"
     ]
   }
   ↓
6. Sistema salva em ai_analyses e retorna via API
```

---

## 🔐 Segurança Implementada

### Rate Limiters
- **authLimiter:** 5 tentativas/5min (login)
- **registerLimiter:** 3 registros/hora
- **apiLimiter:** 100 req/15min (leitura)
- **writeLimiter:** 30 req/15min (escrita)

### Autenticação
- JWT armazenado no header: `Authorization: Bearer <token>`
- Middleware: `AuthenticationTokenMiddleware`
- Rotas protegidas: users, categories, accounts

### Validações
- Email: formato válido
- Senha: mínimo 6 caracteres
- Nomes: não vazios
- Category kind: 'expense' | 'income'

---

## 📦 Dependências Principais

```json
{
  "dependencies": {
    "express": "^5.1.0",
    "mysql2": "^3.14.3",
    "redis": "^5.8.2",
    "bcrypt": "^6.0.0",
    "jsonwebtoken": "^9.0.2",
    "express-rate-limit": "^8.2.1",
    "dotenv": "^17.2.1",
    "cors": "^2.8.5",
    "morgan": "^1.10.1"
  },
  "devDependencies": {
    "typescript": "^5.9.2",
    "ts-node": "^10.9.2",
    "jest": "^30.1.2",
    "ts-jest": "^29.4.1"
  }
}
```

⚠️ **Faltando para IA:** axios (comunicação com Ollama)

---

## 🗂️ Estrutura de Pastas

```
src/
├── config/
│   ├── database.ts        # Pool MySQL
│   ├── redis.ts           # Cliente Redis
│   └── jwt.ts             # Config JWT
├── controllers/
│   ├── UserController.ts
│   ├── category-controller.ts
│   └── accounts-controller.ts
├── services/
│   ├── Users/
│   │   ├── create-user.service.ts
│   │   ├── getUser.service.ts
│   │   ├── updateUser.service.ts
│   │   └── deleteUser.service.ts
│   ├── Category/          # CRUD completo
│   ├── Accounts/          # Parcial (falta saldo)
│   └── Authentication/
├── middleware/
│   ├── authentication-token.middleware.ts
│   ├── rate-limiter.ts
│   ├── validation.ts
│   └── errorHandler.ts
├── routes/
│   ├── user.routes.ts
│   ├── category.routes.ts
│   └── account.routes.ts
├── types/
│   ├── User.ts
│   ├── Category.ts
│   └── Account.ts
├── shared/
│   ├── sharedFunctions.ts  # removePassword, cache utils
│   └── errors/
│       └── AppError.ts     # Custom errors
├── __tests__/
│   ├── setup.ts
│   ├── User/
│   └── SharedFunctions/
└── server.ts
```

**A criar para IA:**
```
src/services/
├── Transactions/       # CRUD de transações
├── Analytics/          # Agregação de dados
└── AI/
    ├── llm.service.ts         # Comunicação Ollama
    ├── prompts.ts             # Templates de prompts
    ├── analyze-spending.service.ts
    └── debt-plan.service.ts
```

---

## 🚀 Comandos Disponíveis

```powershell
# Desenvolvimento
npm run dev              # Servidor com hot reload
npm run dev:debug        # Debug com breakpoints

# Build
npm run build            # Compila TypeScript → dist/
npm start                # Executa build compilado

# Docker
npm run docker:up        # MySQL + Redis (detached)
npm run docker:down      # Para containers
npm run docker:logs      # Logs em tempo real

# Database
npm run db:init          # Executa init.sql

# Testes
npm test                 # Todos os testes
npm run test:coverage    # Com relatório de cobertura
npm run test:watch       # Modo watch
```

---

## ⚙️ Variáveis de Ambiente (.env)

```env
# Servidor
PORT=3000
NODE_ENV=development

# MySQL
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=euclides
DB_PASSWORD=rootpassword
DB_NAME=financeiro

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# JWT
JWT_SECRET=seu_secret_super_seguro_aqui
JWT_EXPIRES_IN=12h

# IA (a adicionar)
OLLAMA_URL=http://localhost:11434
LLM_MODEL=llama3.2
```

---

## 🎯 Estado Atual vs. Objetivo

### ✅ Implementado
- [x] Autenticação JWT
- [x] CRUD de usuários (com cache)
- [x] CRUD de categorias (completo)
- [x] CRUD básico de contas
- [x] Rate limiters (4 tipos)
- [x] Validações de entrada
- [x] Error handling estruturado
- [x] Testes unitários (Users, SharedFunctions)
- [x] Soft delete
- [x] Docker Compose (MySQL + Redis)

### ⚠️ Em Desenvolvimento (Prioridade)
- [ ] **Tabela transactions** (CRÍTICO)
- [ ] CRUD de transações
- [ ] Cálculo de saldo real
- [ ] Agregação de dados para IA
- [ ] Tabela debts
- [ ] Tabela ai_analyses

### 🔮 Futuro (Análise IA)
- [ ] Instalar e configurar Ollama
- [ ] LLM Service (comunicação HTTP)
- [ ] Prompts estruturados
- [ ] Serviço de análise mensal
- [ ] Serviço de plano de dívidas
- [ ] Endpoints de IA
- [ ] Histórico de análises
- [ ] Testes de integração IA

---

## 🐛 Problemas Conhecidos

1. **Accounts sem rate limiters** - Rotas desprotegidas
2. **Saldo não calculado** - Apenas opening_balance (estático)
3. **Console.log em produção** - Falta logger estruturado (Winston/Pino)
4. **Sem paginação** - Listagens podem ficar lentas
5. **Cache parcial** - Só Users tem cache, Categories e Accounts não

---

## 📚 Regras de Negócio

### Transações
- amount_cents deve ser > 0
- transaction_date não pode ser futura
- Tipos: income (+), expense (-), transfer (dupla)
- Soft delete (mantém histórico)

### Saldo
- Calculado dinamicamente: `opening_balance + SUM(income) - SUM(expense)`
- Cache Redis (TTL: 1h)
- Invalidado em toda mutation de transactions

### Categorias
- Nome único por (user_id, parent_id)
- Soft delete em cascata (subcategorias)

### Análise IA
- Mínimo 10 transações para análise válida
- Cache de análises: 7 dias (dados históricos)
- Fallback se LLM offline: retorna análise básica SQL

---

## 🧪 Estratégia de Testes

### Unitários (Jest)
- Mockar pool (mysql2) e redisClient
- Testar services isoladamente
- Cobertura atual: ~80%
- Meta: >85% com Transactions

### Integração
- Testar fluxo completo: route → controller → service → DB
- Mockar apenas LLM (axios)
- Validar fallbacks de erro

### E2E
- Criar usuário real
- Inserir 30+ transações
- Chamar endpoints de IA
- Validar formato de resposta

---

## 🔄 Padrões de Código

### Services
```typescript
export class XxxService {
  private db: Pool;
  
  constructor() {
    this.db = pool;
  }
  
  async method(): Promise<ReturnType> {
    try {
      const [rows] = await this.db.query('...');
      await redisClient.setEx('key', TTL, data);
      return result;
    } catch (error) {
      console.error('Error:', error);
      throw new Error('Failed to ...');
    }
  }
}
```

### Controllers
```typescript
method = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const result = await this.service.method();
    const response: ApiResponse<typeof result> = {
      data: result,
      message: 'Success',
      success: true
    };
    res.status(200).json(response);
  } catch (error) {
    next(error); // Delegado para errorHandler
  }
}
```

---

## 🎓 Conceitos Chave para IA

### Prompts Estruturados
```typescript
const prompt = `
Analise os dados financeiros de ${month}:

**Resumo:**
- Receitas: R$ ${income}
- Despesas: R$ ${expense}
- Saldo: R$ ${balance}

**Gastos por Categoria:**
${categories.map(c => `- ${c.name}: R$ ${c.amount}`).join('\n')}

Forneça:
1. Resumo geral do mês
2. Categorias que mais consomem orçamento
3. Sugestões de economia
4. Alertas importantes
`;
```

### Métricas Importantes
- **Taxa de Poupança:** `(income - expense) / income * 100`
- **Gasto Essencial:** Aluguel, alimentação, saúde
- **Gasto Supérfluo:** Lazer, streaming, delivery
- **Recorrência:** Mesmo valor/dia por 3+ meses

### Estratégias de Dívida
- **Snowball:** Quitar menores primeiro (psicológico)
- **Avalanche:** Quitar maiores juros primeiro (matemático)
- **Custom:** Mix baseado em perfil do usuário

---

## 📖 Referências

- **Documentação API:** README.md
- **Testes:** src/__tests__/
- **Schema DB:** init.sql
- **Rate Limiters:** test-rate-limiter.md
- **Ollama Docs:** https://ollama.com/docs

---

**Última Atualização:** 16/11/2025
**Versão do Documento:** 1.0
**Status do Projeto:** MVP Básico (sem IA ainda)
