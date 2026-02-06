$Url = "http://localhost:8080/api/courses"

try {
    $Response = Invoke-RestMethod -Uri $Url -Method Get
    Write-Host "Success! Count: $($Response.Count)" -ForegroundColor Green
    if ($Response.Count -gt 0) {
        Write-Host "First Course: $($Response[0].name)"
    } else {
        Write-Host "Response is empty array." -ForegroundColor Yellow
    }
} catch {
    Write-Host "Failed to fetch courses." -ForegroundColor Red
    Write-Host $_.Exception.Message
}
