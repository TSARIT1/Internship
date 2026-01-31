$ErrorActionPreference = "Stop"
$baseUrl = "http://localhost:8080/api/auth"

# Generate random user
$rnd = Get-Random -Minimum 1000 -Maximum 9999
$username = "TestUser$rnd"
$email = "test$rnd@example.com"
$password = "Password@123"

Write-Host "=========================================="
Write-Host "TESTING AUTH FLOW FOR: $username / $email"
Write-Host "=========================================="

# 1. Register User
$regBody = @{
    username = $username
    email = $email
    password = $password
    phone = "1234567890"
    course = "Test Course"
} | ConvertTo-Json

Write-Host "`n[1] Registering User..."
try {
    $res = Invoke-RestMethod -Uri "$baseUrl/register" -Method Post -Body $regBody -ContentType "application/json"
    Write-Host "SUCCESS: $($res)" -ForegroundColor Green
} catch {
    Write-Host "FAILED: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "Check if server is running on localhost:8080"
    exit 1
}

# 2. Login with EMAIL (Client sends email in 'username' field usually)
$loginEmailBody = @{
    username = $email
    password = $password
} | ConvertTo-Json

Write-Host "`n[2] Login with EMAIL as username..."
try {
    $res = Invoke-RestMethod -Uri "$baseUrl/login" -Method Post -Body $loginEmailBody -ContentType "application/json"
    Write-Host "SUCCESS: Login OK" -ForegroundColor Green
} catch {
    Write-Host "FAILED: $($_.Exception.Message)" -ForegroundColor Red
    try { Write-Host "Response: $($_.Exception.Response.GetResponseStream())" } catch {}
}

# 3. Login with REAL USERNAME
$loginUserBody = @{
    username = $username
    password = $password
} | ConvertTo-Json

Write-Host "`n[3] Login with USERNAME..."
try {
    $res = Invoke-RestMethod -Uri "$baseUrl/login" -Method Post -Body $loginUserBody -ContentType "application/json"
    Write-Host "SUCCESS: Login OK" -ForegroundColor Green
} catch {
    Write-Host "FAILED: $($_.Exception.Message)" -ForegroundColor Red
}

# 4. Test Duplicate Registration (Strict Check)
Write-Host "`n[4] Test Duplicate Email Registration..."
try {
    Invoke-RestMethod -Uri "$baseUrl/register" -Method Post -Body $regBody -ContentType "application/json"
    Write-Host "FAILED: Server accepted duplicate user!" -ForegroundColor Red
} catch {
    $isBadRequest = $_.Exception.Response.StatusCode -eq [System.Net.HttpStatusCode]::BadRequest
    if ($isBadRequest) {
        Write-Host "SUCCESS: Server rejected duplicate (400 Bad Request)" -ForegroundColor Green
    } else {
        Write-Host "FAILED: Expected 400 but got $($_.Exception.Response.StatusCode)" -ForegroundColor Red
    }
}
