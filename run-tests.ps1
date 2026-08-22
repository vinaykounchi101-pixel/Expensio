# run-tests.ps1
# Reads backend/.env and injects the variables as environment variables
# for the current session, then runs Maven tests.
# Usage: .\run-tests.ps1

$envFile = Join-Path $PSScriptRoot "backend\.env"

if (-not (Test-Path $envFile)) {
    Write-Error "backend\.env not found. Copy backend\.env.example to backend\.env and fill in values."
    exit 1
}

# Parse the .env file — skip comments and blank lines
Get-Content $envFile | ForEach-Object {
    $line = $_.Trim()
    if ($line -and $line -notmatch '^\s*#') {
        $parts = $line -split '=', 2
        if ($parts.Length -eq 2) {
            $key   = $parts[0].Trim()
            $value = $parts[1].Trim()
            [System.Environment]::SetEnvironmentVariable($key, $value, 'Process')
            Write-Host "  Set $key"
        }
    }
}

Write-Host ""
Write-Host "Running backend tests with DB_URL=$env:DB_URL ..."
Write-Host ""

Push-Location "$PSScriptRoot\backend"
mvn -B test
$exitCode = $LASTEXITCODE
Pop-Location

exit $exitCode
