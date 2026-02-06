$Headers = @{
    "Content-Type" = "application/json"
}

$BaseUrl = "http://localhost:8080/api/auth"

Write-Host "1. Testing Login (Verify User Exists)..."
$LoginBody = @{
    username = "admin@tsarit.com"
    password = "admin123" 
} | ConvertTo-Json

try {
    $LoginResponse = Invoke-RestMethod -Uri "$BaseUrl/login" -Method Post -Headers $Headers -Body $LoginBody
    Write-Host "   Success! User found." -ForegroundColor Green
} catch {
    Write-Host "   Login Failed. User might not exist or backend is down." -ForegroundColor Red
    Write-Host $_.Exception.Message
    exit
}

Write-Host "`n2. Testing Forgot Password Request..."
$ForgotBody = @{
    email = "admin@tsarit.com"
} | ConvertTo-Json

try {
    $ForgotResponse = Invoke-RestMethod -Uri "$BaseUrl/forgot-password" -Method Post -Headers $Headers -Body $ForgotBody -Verbose
    Write-Host "   Success! Response: $ForgotResponse" -ForegroundColor Green
    Write-Host "   (This means the token was generated and email sending was attempted)" -ForegroundColor Gray
} catch {
    Write-Host "   Request Failed." -ForegroundColor Red
    Write-Host $_.Exception.Response.StatusCode.value__
    Write-Host $_.ErrorDetails.Message
    Write-Host $_.Exception.Message
}
