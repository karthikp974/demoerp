# Forked from KIET ERP

This folder (`c:\wftinst`) is a **separate copy** of the College ERP codebase for **WFT Institutions** demo.

| | KIET ERP (`c:\erp`) | WFT Institutions (`c:\wftinst`) |
|--|---------------------|----------------------------------|
| Campuses | KIET, KIEK, KIEW + shared/isolated groups | **One campus: WFT** |
| Database | `college_erp` | **`wft_erp`** |
| Docker ports | 5173 / 4000 / 5432 / 6379 | **5174 / 4001 / 5433 / 6380** |
| Owner login | `kar974` | **`wftowner`** |
| Seed | KIET catalog + merge | WFT-only catalog |

Changes here **do not affect** `c:\erp`.

To refresh from KIET ERP later (careful — manual merge):

```powershell
robocopy c:\erp c:\wftinst /E /XD node_modules .git dist .claude /XF .env
# Then re-apply WFT seed, docker-compose, branding, and cursor rules.
```
