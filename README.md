# 💰 Sistema Financeiro API

Uma API REST simples e bem estruturada para gerenciamento de usuários, construída com Node.js, TypeScript, Express e MySQL.

## 🏗️ Arquitetura

```
src/
├── config/          # Configurações da aplicação
├── controllers/     # Controladores (lógica das rotas)
├── database/        # Conexão e configuração do banco
├── middleware/      # Middlewares customizados
├── models/          # Modelos de dados (futuro)
├── routes/          # Definição das rotas
├── services/        # Lógica de negócio
├── types/           # Tipos TypeScript
└── server.ts        # Ponto de entrada da aplicação
```

## 🚀 Tecnologias

- **Node.js** - Runtime JavaScript
- **TypeScript** - Superset tipado do JavaScript
- **Express** - Framework web
- **MySQL** - Banco de dados relacional
- **Docker** - Containerização do banco de dados

## 📋 Pré-requisitos

- Node.js (v18+)
- Docker e Docker Compose
- npm ou yarn

## 🔧 Instalação

1. **Clone o repositório**
   ```bash
   git clone <url-do-repo>
   cd financeiro
   ```

2. **Instale as dependências**
   ```bash
   npm install
   ```

3. **Configure as variáveis de ambiente**
   ```bash
   # O arquivo .env já existe com as configurações padrão
   # Ajuste conforme necessário
   ```

4. **Inicie o banco de dados**
   ```bash
   docker-compose up -d
   ```

5. **Execute as migrations** (criar tabelas)
   ```bash
   # Execute o script SQL para criar as tabelas
   docker exec -i mysql-db mysql -u euclides -prootpassword financeiro < init.sql
   ```

6. **Inicie o servidor**
   ```bash
   npm run dev
   ```

## 🛠️ Scripts Disponíveis

- `npm run dev` - Executa em modo desenvolvimento com hot reload
- `npm start` - Executa em modo produção
- `npm test` - Executa os testes (a implementar)

## 📚 Endpoints da API

### Health Check
- `GET /health` - Verifica se a API está funcionando

### Usuários
- `GET /api/users` - Lista todos os usuários
- `GET /api/users/:id` - Busca usuário por ID
- `POST /api/users` - Cria novo usuário (com senha criptografada)
- `POST /api/users/login` - Autentica usuário
- `PUT /api/users/:id` - Atualiza usuário (incluindo senha)
- `DELETE /api/users/:id` - Remove usuário

### Exemplos de Uso

**Criar usuário:**
```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{"name": "João Silva", "email": "joao@email.com", "password": "minhasenha123"}'
```

**Login de usuário:**
```bash
curl -X POST http://localhost:3000/api/users/login \
  -H "Content-Type: application/json" \
  -d '{"email": "joao@email.com", "password": "minhasenha123"}'
```

**Listar usuários:**
```bash
curl http://localhost:3000/api/users
```

## 📦 Estrutura de Resposta

Todas as respostas seguem o padrão:

```json
{
  "data": "...",      // Dados solicitados (opcional)
  "message": "...",   // Mensagem descritiva
  "success": true,    // Status da operação
  "error": "..."      // Mensagem de erro (opcional)
}
```

## 🔍 Características da Arquitetura

### ✅ **Separação de Responsabilidades**
- **Controllers**: Gerenciam requisições HTTP
- **Services**: Contêm lógica de negócio
- **Routes**: Definem endpoints e middlewares
- **Middleware**: Validações e tratamento de erros

### ✅ **Tipagem Forte**
- Interfaces TypeScript para todas as entidades
- DTOs para transferência de dados
- Tipos para respostas da API

### ✅ **Tratamento de Erros**
- Middleware global de erro
- Respostas padronizadas
- Logs estruturados

### ✅ **Validações**
- Validação de entrada nos middlewares
- Sanitização de dados
- Feedback claro de erros

### ✅ **Configuração Flexível**
- Variáveis de ambiente
- Configuração centralizada
- Diferentes ambientes (dev/prod)

### ✅ **Segurança**
- Senhas criptografadas com bcrypt (salt rounds: 12)
- Senhas nunca retornadas nas respostas da API
- Validação robusta de entrada de dados
- Hash seguro para armazenamento de senhas

## 🚧 Próximos Passos

- [ ] Implementar autenticação JWT
- [ ] Adicionar testes unitários e de integração
- [ ] Documentação com Swagger
- [ ] Rate limiting
- [ ] Cache com Redis
- [ ] Logs estruturados

## 📄 Licença

Este projeto está sob a licença ISC.
