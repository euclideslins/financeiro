# 🧪 Guia de Testes - Rate Limiter

## 📋 Pré-requisitos

1. Servidor rodando: `npm run dev`
2. Ferramenta de teste HTTP instalada (escolha uma):
   - **PowerShell** (já instalado)
   - **Thunder Client** (extensão VS Code)
   - **Postman**
   - **cURL**

---

## 🔥 Teste 1: Login Limiter (5 tentativas em 15min)

### PowerShell:
```powershell
# Fazer 6 requisições de login para testar o limite
1..6 | ForEach-Object {
    Write-Host "`n=== Tentativa $_ ===" -ForegroundColor Cyan
    $response = Invoke-WebRequest -Method POST `
        -Uri "http://localhost:3000/api/users/login" `
        -Headers @{"Content-Type"="application/json"} `
        -Body '{"email":"test@test.com","password":"wrong"}' `
        -UseBasicParsing -ErrorAction SilentlyContinue
    
    if ($response) {
        Write-Host "Status: $($response.StatusCode)" -ForegroundColor Green
        $response.Content
    } else {
        Write-Host "Rate limited!" -ForegroundColor Red
    }
    Start-Sleep -Seconds 1
}
```

**Resultado esperado**:
- Tentativas 1-5: Status 401 (Unauthorized) ou 200
- Tentativa 6: Status 429 (Too Many Requests) com mensagem "Too many login attempts"

---

## 🆕 Teste 2: Register Limiter (3 registros em 1 hora)

### PowerShell:
```powershell
# Fazer 4 registros para testar o limite
1..4 | ForEach-Object {
    Write-Host "`n=== Registro $_ ===" -ForegroundColor Cyan
    $body = @{
        name = "Test User $_"
        email = "test$_@test.com"
        password = "senha123"
    } | ConvertTo-Json
    
    try {
        $response = Invoke-RestMethod -Method POST `
            -Uri "http://localhost:3000/api/users/register" `
            -Headers @{"Content-Type"="application/json"} `
            -Body $body
        
        Write-Host "✅ Sucesso: $($response.message)" -ForegroundColor Green
    } catch {
        Write-Host "❌ Erro: $($_.Exception.Response.StatusCode)" -ForegroundColor Red
        Write-Host $_.ErrorDetails.Message
    }
    Start-Sleep -Seconds 1
}
```

**Resultado esperado**:
- Registros 1-3: Status 201 (Created)
- Registro 4: Status 429 com "Too many accounts created"

---

## ✍️ Teste 3: Write Limiter (30 escritas em 15min)

### PowerShell (precisa de token):
```powershell
# Primeiro, faça login e pegue o token
$login = Invoke-RestMethod -Method POST `
    -Uri "http://localhost:3000/api/users/login" `
    -Headers @{"Content-Type"="application/json"} `
    -Body '{"email":"euclides@example.com","password":"banana"}'

$token = $login.data.token
Write-Host "Token: $token`n" -ForegroundColor Yellow

# Tentar criar 31 usuários (como admin)
1..31 | ForEach-Object {
    Write-Host "Criando usuário $_ de 31..." -ForegroundColor Cyan
    
    $body = @{
        name = "Admin User $_"
        email = "admin$_@test.com"
        password = "senha123"
    } | ConvertTo-Json
    
    try {
        $response = Invoke-RestMethod -Method POST `
            -Uri "http://localhost:3000/api/users" `
            -Headers @{
                "Content-Type"="application/json"
                "Authorization"="Bearer $token"
            } `
            -Body $body
        
        Write-Host "✅ Criado: $($response.data.email)" -ForegroundColor Green
    } catch {
        Write-Host "❌ Rate limit atingido na tentativa $_!" -ForegroundColor Red
        break
    }
}
```

**Resultado esperado**:
- Usuários 1-30: Status 201
- Usuário 31: Status 429 com "Too many write operations"

---

## 📊 Teste 4: API Limiter Geral (100 requests em 15min)

### PowerShell:
```powershell
# Fazer 105 requisições GET
$token = "seu-token-aqui"  # Pegar do login

1..105 | ForEach-Object {
    if ($_ % 10 -eq 0) {
        Write-Host "Requisição $_/105..." -ForegroundColor Cyan
    }
    
    try {
        $response = Invoke-RestMethod -Method GET `
            -Uri "http://localhost:3000/api/users" `
            -Headers @{"Authorization"="Bearer $token"}
        
        if ($_ -eq 105) {
            Write-Host "❌ Deveria ter bloqueado!" -ForegroundColor Red
        }
    } catch {
        Write-Host "✅ Bloqueado na requisição $_!" -ForegroundColor Green
        break
    }
}
```

**Resultado esperado**:
- Requisições 1-100: Status 200
- Requisição 101+: Status 429

---

## ✅ Teste 5: Health Check (SEM limite)

### PowerShell:
```powershell
# Fazer 200 requisições ao health check (deve funcionar todas)
1..200 | ForEach-Object {
    $response = Invoke-RestMethod -Uri "http://localhost:3000/health"
    if ($_ % 50 -eq 0) {
        Write-Host "✅ Health check $_ funcionou (sem rate limit)" -ForegroundColor Green
    }
}
Write-Host "`n🎉 Health check nunca foi bloqueado!" -ForegroundColor Yellow
```

**Resultado esperado**:
- Todas as 200 requisições: Status 200 (nunca bloqueia)

---

## 🔍 Verificar Headers de Rate Limit

Ao fazer uma requisição, verifique os headers:

```powershell
$response = Invoke-WebRequest -Uri "http://localhost:3000/api/users/login" `
    -Method POST `
    -Headers @{"Content-Type"="application/json"} `
    -Body '{"email":"test@test.com","password":"pass"}' `
    -UseBasicParsing -ErrorAction SilentlyContinue

# Ver headers de rate limit
$response.Headers['RateLimit-Limit']       # Limite total
$response.Headers['RateLimit-Remaining']   # Requisições restantes
$response.Headers['RateLimit-Reset']       # Quando reseta (timestamp)
```

---

## 🧹 Resetar Limites (Para Testes)

Os limiters são **por IP**. Para resetar durante testes:

1. **Esperar o tempo** (15 min / 1 hora)
2. **Reiniciar o servidor** (`Ctrl+C` e `npm run dev`)
3. **Usar IPs diferentes** (proxy/VPN)
4. **Limpar store** (se configurar Redis como store)

---

## 🎯 Resumo dos Limites

| Rota | Limite | Janela | Propósito |
|------|--------|--------|-----------|
| `POST /api/users/login` | 5 req | 15 min | Anti brute force |
| `POST /api/users/register` | 3 req | 1 hora | Anti spam de contas |
| `POST/PUT/DELETE /api/users/*` | 30 req | 15 min | Proteção de escrita |
| `GET /api/*` (geral) | 100 req | 15 min | Uso normal |
| `GET /health` | ∞ | - | Monitoramento |

---

## 🐛 Troubleshooting

**Problema**: "Cannot find module 'express-rate-limit'"
```powershell
npm install express-rate-limit
```

**Problema**: Rate limit não funciona
- Verificar se o servidor reiniciou após criar `rate-limiter.ts`
- Checar se os imports estão corretos em `user.routes.ts`

**Problema**: Limite muito baixo para desenvolvimento
- Ajustar valores em `src/middleware/rate-limiter.ts`:
  ```typescript
  max: 1000, // Aumentar temporariamente
  ```
