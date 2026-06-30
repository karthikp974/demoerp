#!/usr/bin/env sh
set -e
cd "$(dirname "$0")/.."

if [ ! -f .env ]; then
  cp .env.example .env
  echo "Created .env from .env.example — review secrets before production."
fi

docker compose up -d --build
docker compose exec backend sh -c "cd apps/backend && npx prisma migrate deploy"
docker compose exec backend sh -c "cd apps/backend && npx ts-node --transpile-only prisma/seed.ts"

echo ""
echo "WFT Institutions is up:"
echo "  Frontend  http://localhost:5174"
echo "  Backend   http://localhost:4001/api/health"
echo "  Admin     admin / Admin@12345"
echo "  Owner     wftowner / WftDemo@123  (/ops)"
