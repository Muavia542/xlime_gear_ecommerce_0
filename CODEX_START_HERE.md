# CODEX — START HERE

This repository is the corrected XLIME GEAR production handoff.

Before changing UI, read:
- `docs/APPROVED_UI_REFERENCE.html`
- `docs/FRONTEND_FIDELITY_MAP.md`
- `docs/CODEX_FINALIZATION_BRIEF.md`
- `docs/ADMIN_V2_ARCHITECTURE.md`

**Do not redesign the public storefront.** Refine the Next.js implementation until it matches the approved V6 HTML while preserving real Express/Prisma/MySQL behavior and the full Operations Hub V2 feature set.

Recommended first commands on Windows CMD:
```cmd
UPDATE_EXISTING_DATABASE_V2.bat
npm run dev
```

Release gates:
```cmd
npm run qa:static
npm run typecheck
npm run build
```
