try {
    $hackathons = Invoke-RestMethod -Uri "http://localhost:8080/api/hackathons" -Method Get
    Write-Host "Total Hackathons: $($hackathons.Count)"
} catch {
    Write-Host "Failed to fetch hackathons: $_"
}
