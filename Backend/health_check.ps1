$baseUrl = "http://localhost:8080/api"

Write-Host "--- Final System Health Check ---" -ForegroundColor Cyan

# Check Courses
try {
    $courses = Invoke-RestMethod -Uri "$baseUrl/courses" -Method Get
    if ($courses.Count -ge 0) {
        Write-Host "[OK] Backend Reacahble (Courses Endpoint). Found $($courses.Count) courses." -ForegroundColor Green
    }
} catch {
    Write-Host "[FAIL] Could not fetch courses: $($_.Exception.Message)" -ForegroundColor Red
}

# Check Users (Admin only usually, but allowed by our security config for now? Let's see)
try {
    # Note: /api/auth/users might be secured, might get 403 if not logged in.
    # But checking if we get a response (even 403) means server is up.
    $response = Invoke-WebRequest -Uri "$baseUrl/auth/users" -Method Get -ErrorAction SilentlyContinue
    $status = $response.StatusCode
    if ($status -eq 200 -or $status -eq 403 -or $status -eq 401) {
         Write-Host "[OK] Auth Endpoint Alive (Status: $status)" -ForegroundColor Green
    } else {
         Write-Host "[WARN] Auth Endpoint Status: $status" -ForegroundColor Yellow
    }
} catch {
     Write-Host "[FAIL] Auth Endpoint unreachable." -ForegroundColor Red
}

# Check Env File
if (Test-Path "..\Frontend\.env") {
    Write-Host "[OK] Frontend .env file exists." -ForegroundColor Green
} else {
    Write-Host "[FAIL] Frontend .env file MISSING." -ForegroundColor Red
}

Write-Host "`nSystem Check Complete."
