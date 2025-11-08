#!/usr/bin/env pwsh
# Script de teste automatizado para Rate Limiters

param(
    [string]$BaseUrl = "http://localhost:3000",
    [switch]$Verbose
)

$ErrorActionPreference = "Continue"

Write-Host "`n🧪 ===== TESTE DE RATE LIMITERS =====" -ForegroundColor Cyan
Write-Host "URL Base: $BaseUrl`n" -ForegroundColor Yellow

# Função auxiliar para fazer requisições
function Test-Endpoint {
    param(
        [string]$Method,
        [string]$Path,
        [object]$Body,
        [hashtable]$Headers = @{"Content-Type"="application/json"},
        [int]$ExpectedStatus = 200
    )
    
    try {
        $params = @{
            Method = $Method
            Uri = "$BaseUrl$Path"
            Headers = $Headers
            UseBasicParsing = $true
            ErrorAction = 'Stop'
        }
        
        if ($Body) {
            $params.Body = ($Body | ConvertTo-Json)
        }
        
        $response = Invoke-WebRequest @params
        
        return @{
            Success = $true
            StatusCode = $response.StatusCode
            Content = $response.Content | ConvertFrom-Json
            Headers = $response.Headers
        }
    } catch {
        $statusCode = $_.Exception.Response.StatusCode.value__
        return @{
            Success = $false
            StatusCode = $statusCode
            Error = $_.ErrorDetails.Message
        }
    }
}

# ====================
# TESTE 1: AUTH LIMITER (Login)
# ====================
Write-Host "`n📝 TESTE 1: Auth Limiter (5 tentativas de login)" -ForegroundColor Magenta
Write-Host "─────────────────────────────────────────────────" -ForegroundColor Gray

$loginAttempts = 0
$loginBlocked = $false

for ($i = 1; $i -le 6; $i++) {
    $result = Test-Endpoint -Method POST -Path "/api/users/login" -Body @{
        email = "test@test.com"
        password = "wrongpass"
    }
    
    if ($result.StatusCode -eq 429) {
        Write-Host "  ✅ Tentativa $i - BLOQUEADO (429)" -ForegroundColor Green
        $loginBlocked = $true
        break
    } else {
        Write-Host "  ⏺️  Tentativa $i - Permitido ($($result.StatusCode))" -ForegroundColor Yellow
        $loginAttempts++
    }
    
    Start-Sleep -Milliseconds 500
}

if ($loginBlocked -and $loginAttempts -eq 5) {
    Write-Host "  🎉 AUTH LIMITER: PASSOU (bloqueou após 5 tentativas)" -ForegroundColor Green
} else {
    Write-Host "  ❌ AUTH LIMITER: FALHOU (deveria bloquear após 5)" -ForegroundColor Red
}

# ====================
# TESTE 2: REGISTER LIMITER
# ====================
Write-Host "`n📝 TESTE 2: Register Limiter (3 registros por hora)" -ForegroundColor Magenta
Write-Host "─────────────────────────────────────────────────" -ForegroundColor Gray

$registerAttempts = 0
$registerBlocked = $false

for ($i = 1; $i -le 4; $i++) {
    $result = Test-Endpoint -Method POST -Path "/api/users/register" -Body @{
        name = "Test User $i"
        email = "testuser$i$(Get-Random)@test.com"
        password = "senha123"
    }
    
    if ($result.StatusCode -eq 429) {
        Write-Host "  ✅ Registro $i - BLOQUEADO (429)" -ForegroundColor Green
        $registerBlocked = $true
        break
    } elseif ($result.StatusCode -eq 201) {
        Write-Host "  ⏺️  Registro $i - Criado com sucesso" -ForegroundColor Yellow
        $registerAttempts++
    } else {
        Write-Host "  ⚠️  Registro $i - Status $($result.StatusCode)" -ForegroundColor Yellow
    }
    
    Start-Sleep -Milliseconds 500
}

if ($registerBlocked -and $registerAttempts -eq 3) {
    Write-Host "  🎉 REGISTER LIMITER: PASSOU (bloqueou após 3 registros)" -ForegroundColor Green
} else {
    Write-Host "  ❌ REGISTER LIMITER: FALHOU" -ForegroundColor Red
}

# ====================
# TESTE 3: HEALTH CHECK (sem limite)
# ====================
Write-Host "`n📝 TESTE 3: Health Check (sem rate limit)" -ForegroundColor Magenta
Write-Host "─────────────────────────────────────────────────" -ForegroundColor Gray

$healthChecks = 0
$healthBlocked = $false

for ($i = 1; $i -le 150; $i++) {
    $result = Test-Endpoint -Method GET -Path "/health"
    
    if ($result.StatusCode -eq 429) {
        Write-Host "  ❌ Health check bloqueado na requisição $i" -ForegroundColor Red
        $healthBlocked = $true
        break
    } else {
        $healthChecks++
    }
    
    if ($i % 50 -eq 0) {
        Write-Host "  ⏺️  $healthChecks requisições ao /health - OK" -ForegroundColor Yellow
    }
}

if (-not $healthBlocked -and $healthChecks -eq 150) {
    Write-Host "  🎉 HEALTH CHECK: PASSOU (nunca bloqueou)" -ForegroundColor Green
} else {
    Write-Host "  ❌ HEALTH CHECK: FALHOU (não deveria bloquear)" -ForegroundColor Red
}

# ====================
# TESTE 4: API LIMITER (100 requests)
# ====================
Write-Host "`n📝 TESTE 4: API Limiter Geral (100 requisições)" -ForegroundColor Magenta
Write-Host "─────────────────────────────────────────────────" -ForegroundColor Gray
Write-Host "  ℹ️  Tentando fazer login para pegar token..." -ForegroundColor Cyan

# Fazer login para pegar token
$loginResult = Test-Endpoint -Method POST -Path "/api/users/login" -Body @{
    email = "euclides@example.com"
    password = "banana"
}

if ($loginResult.Success -and $loginResult.Content.data.token) {
    $token = $loginResult.Content.data.token
    Write-Host "  ✅ Token obtido com sucesso" -ForegroundColor Green
    
    $apiRequests = 0
    $apiBlocked = $false
    
    # Fazer 105 requisições GET
    for ($i = 1; $i -le 105; $i++) {
        $result = Test-Endpoint -Method GET -Path "/api/users" -Headers @{
            "Authorization" = "Bearer $token"
            "Content-Type" = "application/json"
        }
        
        if ($result.StatusCode -eq 429) {
            Write-Host "  ✅ API bloqueada na requisição $i (esperado: ~100-101)" -ForegroundColor Green
            $apiBlocked = $true
            break
        } else {
            $apiRequests++
        }
        
        if ($i % 25 -eq 0) {
            Write-Host "  ⏺️  $apiRequests requisições GET - OK" -ForegroundColor Yellow
        }
    }
    
    if ($apiBlocked -and $apiRequests -ge 95 -and $apiRequests -le 105) {
        Write-Host "  🎉 API LIMITER: PASSOU (bloqueou próximo de 100)" -ForegroundColor Green
    } else {
        Write-Host "  ⚠️  API LIMITER: Bloqueou após $apiRequests requisições" -ForegroundColor Yellow
    }
} else {
    Write-Host "  ⚠️  Não foi possível fazer login para testar API limiter" -ForegroundColor Yellow
    Write-Host "  ℹ️  Certifique-se que existe usuário: euclides@example.com / senha: banana" -ForegroundColor Cyan
}

# ====================
# RESUMO
# ====================
Write-Host "`n📊 ===== RESUMO DOS TESTES =====" -ForegroundColor Cyan
Write-Host "─────────────────────────────────────────────────" -ForegroundColor Gray
Write-Host "  Auth Limiter (login):        5 tentativas permitidas" -ForegroundColor White
Write-Host "  Register Limiter:            3 registros permitidos" -ForegroundColor White
Write-Host "  Health Check:                Ilimitado" -ForegroundColor White
Write-Host "  API Limiter Geral:           ~100 requisições permitidas" -ForegroundColor White
Write-Host "`n✅ Testes concluídos!`n" -ForegroundColor Green

Write-Host "💡 Dica: Reinicie o servidor para resetar os limiters" -ForegroundColor Yellow
Write-Host "   ou espere o tempo da janela (15min / 1 hora)`n" -ForegroundColor Yellow
