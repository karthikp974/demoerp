$ErrorActionPreference = "Stop"
Set-Location (Split-Path $PSScriptRoot -Parent)

if (-not (Test-Path .env)) {
  Copy-Item .env.example .env
  Write-Host "Created .env from .env.example"
}

docker compose up -d --build
docker compose exec backend sh -c "cd apps/backend && npx prisma migrate deploy"
docker compose exec backend sh -c "cd apps/backend && npx ts-node --transpile-only prisma/seed.ts"

Write-Host ""
Write-Host "WFT Institutions is up:"
Write-Host "  Frontend  http://localhost:5176"
Write-Host "  Backend   http://localhost:4002/api/health"
Write-Host "  Admin     admin / Admin@12345"
Write-Host "  Owner     wftowner / WftDemo@123  (/ops)"
