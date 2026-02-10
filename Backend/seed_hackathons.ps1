$headers = @{ "Content-Type" = "application/json" }
$body1 = @{
    title = "Code the Future 2024"
    date = "March 15-16, 2024"
    time = "10:00 AM - 10:00 AM (24 Hours)"
    description = "Join 500+ developers in the ultimate coding showdown. Build, innovate, and network."
    prizePool = "INR 1,00,000"
    status = "Upcoming"
    mode = "Online"
} | ConvertTo-Json

$body2 = @{
    title = "AI Innovation Challenge"
    date = "April 20, 2024"
    time = "9:00 AM - 6:00 PM"
    description = "Solve real-world problems using Artificial Intelligence and Machine Learning."
    prizePool = "INR 50,000"
    status = "Registration Open"
    mode = "Hybrid"
} | ConvertTo-Json

try {
    $r1 = Invoke-RestMethod -Uri "http://localhost:8080/api/hackathons" -Method Post -Headers $headers -Body $body1
    Write-Host "Inserted: $($r1.title)"
    $r2 = Invoke-RestMethod -Uri "http://localhost:8080/api/hackathons" -Method Post -Headers $headers -Body $body2
    Write-Host "Inserted: $($r2.title)"
} catch {
    Write-Host "Failed to seed hackathons: $_"
}

# Verify
try {
    $hackathons = Invoke-RestMethod -Uri "http://localhost:8080/api/hackathons" -Method Get
    Write-Host "Total Hackathons: $($hackathons.Count)"
} catch {
    Write-Host "Failed to fetch hackathons: $_"
}
