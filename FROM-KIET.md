# Forked from KIET ERP

This folder (`C:\WFT-Institutions`) is a **separate copy** of the College ERP codebase for **WFT Institutions** demo.

| | KIET ERP (`C:\erp`) | WFT Institutions (`C:\WFT-Institutions`) |
|--|---------------------|----------------------------------|
| Campuses | KIET, KIEK, KIEW + shared/isolated groups | **One campus: WFT** |
| Database | `college_erp` | **`wft_erp`** |
| Docker ports | 5173 / 4000 / 5432 / 6379 | **5176 / 4002 / 5435 / 6382** (not unierp 5174/4001) |
| Owner login | `kar974` | **`wftowner`** |
| Seed | KIET catalog + merge | WFT-only catalog |

Changes here **do not affect** `c:\erp`.

To refresh from KIET ERP later (careful — manual merge):

```powershell
robocopy c:\erp c:\wftinst /E /XD node_modules .git dist .claude /XF .env
# Then re-apply WFT seed, docker-compose, branding, and cursor rules.
```
