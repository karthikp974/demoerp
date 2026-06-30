# WFT Institutions — Demo ERP

**Separate project from KIET ERP (`c:\erp`).** Same codebase shape, different institution:

- **One campus:** `WFT` — WFT Institutions  
- **One database:** no KIET/KIEK shared groups, no KIEW isolation  
- **Demo portal** for WorkflowTech product demos  

## Ports (avoid clash with KIET ERP on same PC)

| Service  | WFT Institutions | KIET ERP (reference) |
|----------|------------------|----------------------|
| Frontend | **5174**         | 5173                 |
| Backend  | **4001**         | 4000                 |
| Postgres | **5433**         | 5432                 |
| Redis    | **6380**         | 6379                 |

## Quick start (Docker)

```bash
cd c:\wftinst
copy .env.example .env
docker compose up -d
docker compose exec backend sh -c "cd apps/backend && npx prisma migrate deploy && npx ts-node --transpile-only prisma/seed.ts"
```

Open **http://localhost:5174**

## Demo logins (after seed)

| Role    | Login ID   | Password        |
|---------|------------|-----------------|
| Admin   | `admin`    | `Admin@12345`   |
| Owner   | `wftowner` | `WftDemo@123`   |
| Teacher | `HTPO001`  | `TeacherDemo@123` |
| Student | roll no    | `StudentDemo@123` |

Owner spectator console: `/ops` (username `wftowner`).

## Local dev (no Docker)

```bash
npm install
# Postgres on 5433 + Redis on 6380, or adjust .env
npm run prisma:migrate
npm run dev
# Frontend http://localhost:5173 — set FRONTEND_PORT in .env if needed
```

## Notes

- **Do not mix** with KIET ERP database or `.env`.  
- KIET-specific seed, catalog rules, and branding were removed or replaced for WFT.  
- Shared-group code paths remain in the engine but seed uses **campus-owned** programs only.
