$ErrorActionPreference = "Stop"
$baseUrl = "http://localhost:8081/api"

# 1. Register a new user
$rnd = Get-Random -Minimum 1000 -Maximum 9999
$username = "Student$rnd"
$email = "student$rnd@example.com"
$password = "pass1234"

Write-Host "Registering User: $username"
$regBody = @{
    username = $username
    email = $email
    password = $password
    phone = "5555555555"
} | ConvertTo-Json

try {
    Invoke-RestMethod -Uri "$baseUrl/auth/register" -Method Post -Body $regBody -ContentType "application/json"
} catch {
    Write-Host "Registration failed: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# 2. Login to get ID (Assuming we need to fetch user details or just login check)
# Since login endpoint currently returns a string or User object, let's parse it.
Write-Host "Logging in..."
$loginBody = @{
    username = $username
    password = $password
} | ConvertTo-Json

$loginRes = Invoke-RestMethod -Uri "$baseUrl/auth/login" -Method Post -Body $loginBody -ContentType "application/json"
# Depending on previous fix, loginRes might be the User object directly.
# Let's inspect it.
# If it's the User object, it has "id".
if ($loginRes.id) {
    $userId = $loginRes.id
    Write-Host "Login Success. User ID: $userId" -ForegroundColor Green
} else {
    Write-Host "Login return format unexpected: $loginRes" -ForegroundColor Yellow
    # Try to fetch user via get all users locally or just assume ID from registration order? 
    # Actually we can't guess ID easily.
    # But wait, my previous fix returned `ResponseEntity.ok(user)`. So it SHOULD work.
    exit 1
}

# 3. Enroll in a course
Write-Host "Enrolling in 'Java Masterclass'..."
$enrollBody = @{
    userId = $userId
    courseName = "Java Masterclass"
    fee = 5000
    discount = 500
    transactionId = "pay_Test123456"
    amountPaid = 4500
} | ConvertTo-Json

try {
    $enrollRes = Invoke-RestMethod -Uri "$baseUrl/enrollments/enroll" -Method Post -Body $enrollBody -ContentType "application/json"
    Write-Host "Enrollment Success: $($enrollRes.id)" -ForegroundColor Green
} catch {
    Write-Host "Enrollment Failed: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# 4. Check My Enrollments
Write-Host "Checking My Enrollments..."
$myEnrollments = Invoke-RestMethod -Uri "$baseUrl/enrollments/my-enrollments/$userId" -Method Get
if ($myEnrollments.Count -gt 0 -and $myEnrollments[0].courseName -eq "Java Masterclass") {
    if ($myEnrollments[0].transactionId -eq "pay_Test123456" -and $myEnrollments[0].amountPaid -eq 4500) {
        Write-Host "Verified: Found enrollment with correct Payment Details." -ForegroundColor Green
    } else {
        Write-Host "Failed: Payment Details mismatch. Got $($myEnrollments[0].transactionId) and $($myEnrollments[0].amountPaid)" -ForegroundColor Red
        exit 1
    }
} else {
    Write-Host "Failed: Enrollment not found in history." -ForegroundColor Red
}

# 5. Check duplicate enrollment
Write-Host "Testing Duplicate Enrollment..."
try {
    Invoke-RestMethod -Uri "$baseUrl/enrollments/enroll" -Method Post -Body $enrollBody -ContentType "application/json"
    Write-Host "Failed: Server allowed duplicate!" -ForegroundColor Red
} catch {
    if ($_.Exception.Response.StatusCode -eq [System.Net.HttpStatusCode]::BadRequest) {
        Write-Host "Success: Duplicate rejected." -ForegroundColor Green
    } else {
         Write-Host "Failed: Unexpected error $($_.Exception.Message)" -ForegroundColor Red
    }
}
