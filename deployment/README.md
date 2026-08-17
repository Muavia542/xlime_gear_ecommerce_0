# Hostinger upload packages

The repository intentionally keeps `frontend/` and `backend/` separate. On Windows, run:

```powershell
powershell -ExecutionPolicy Bypass -File .\deployment\CREATE_HOSTINGER_PACKAGES.ps1
```

It creates:

- `deployment/packages/XLIME_FRONTEND_HOSTINGER.zip`
- `deployment/packages/XLIME_BACKEND_HOSTINGER.zip`

The script excludes `node_modules`, `.next`, `dist`, `.env`, `.env.local`, coverage and logs. Configure production secrets in Hostinger Environment Variables instead of putting them inside ZIP files.

Read `docs/HOSTINGER_DEPLOYMENT.md` before deployment.
