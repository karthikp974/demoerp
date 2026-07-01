# WFT Institutions — Demo ERP

**Separate project from KIET ERP (`C:\erp`).** Same codebase shape, different institution:

- **One campus:** `WFT` — WFT Institutions  
- **One database:** no KIET/KIEK shared groups, no KIEW isolation  
- **Demo portal** for WorkflowTech product demos  

## Ports (each folder has its own — do not overlap)

| Service  | WFT (`C:\WFT-Institutions`) | unierp (other folder) | KIET (`C:\erp`) |
|----------|----------------------------|------------------------|-----------------|
| Frontend | **5176**                   | **5174** (reserved)    | 5173            |
| Backend  | **4002**                   | **4001** (reserved)    | 4000            |
| Postgres | **5435**                   | **5433** (reserved)    | 5432            |
| Redis    | **6382**                   | **6380** (reserved)    | 6379            |

Open WFT at **http://localhost:5176**

## Git (separate from KIET ERP)

This folder has its **own git repo** — not linked to `c:\erp` / kieterp.

```bash
cd C:\WFT-Institutions
git status
```

**New GitHub repo (one-time):**

```bash
# On GitHub: create empty repo e.g. wftinst-erp
git remote add origin https://github.com/YOUR_USER/wftinst-erp.git
git push -u origin main
```

## Docker (separate stack)

Project name **`wftinst`** — containers/volumes never clash with KIET `college-erp-*`.

**One command bootstrap (Windows):**

```powershell
cd C:\WFT-Institutions
.\scripts\docker-bootstrap.ps1
```

**Or manual:**

```bash
cd C:\WFT-Institutions
copy .env.example .env
docker compose up -d --build
docker compose exec backend sh -c "cd apps/backend && npx prisma migrate deploy && npx ts-node --transpile-only prisma/seed.ts"
```

Open **http://localhost:5176**

## Quick start (Docker)

```bash
cd C:\WFT-Institutions
copy .env.example .env
docker compose up -d
docker compose exec backend sh -c "cd apps/backend && npx prisma migrate deploy && npx ts-node --transpile-only prisma/seed.ts"
```

Open **http://localhost:5176**

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
# Postgres on 5435 + Redis on 6382, or adjust .env
npm run prisma:migrate
npm run dev
# Frontend http://localhost:5173 — set FRONTEND_PORT in .env if needed
```

## Notes

- **Do not mix** with KIET ERP database or `.env`.  
- KIET-specific seed, catalog rules, and branding were removed or replaced for WFT.  
- Shared-group code paths remain in the engine but seed uses **campus-owned** programs only.

# demoerp
