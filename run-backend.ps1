# run-backend.ps1
# Reads backend/.env, injects as env vars, then starts the Spring Boot server.
# Usage: .\run-backend.ps1

$envFile = Join-Path $PSScriptRoot "backend\.env"

if (-not (Test-Path $envFile)) {
    Write-Error "backend\.env not found."
    exit 1
}

Get-Content $envFile | ForEach-Object {
    $line = $_.Trim()
    if ($line -and $line -notmatch '^\s*#') {
        $parts = $line -split '=', 2
        if ($parts.Length -eq 2) {
            $key   = $parts[0].Trim()
            $value = $parts[1].Trim()
            [System.Environment]::SetEnvironmentVariable($key, $value, 'Process')
        }
    }
}

Write-Host "Starting backend with DB_URL=$env:DB_URL ..."
Push-Location "$PSScriptRoot\backend"
mvn spring-boot:run
Pop-Location
