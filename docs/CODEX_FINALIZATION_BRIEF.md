# Codex Finalization Brief — XLIME GEAR

## Goal
Take the corrected production package from roughly feature-complete/QA-ready state to final release quality without redesigning the approved storefront or removing Operations Hub V2 features.

## Read first
1. `docs/APPROVED_UI_REFERENCE.html` — public storefront source of truth.
2. `docs/FRONTEND_FIDELITY_MAP.md` — HTML-to-Next mapping.
3. `docs/ADMIN_V2_ARCHITECTURE.md` — Operations Hub design/feature intent.
4. `docs/QA_CHECKLIST.md` — release QA.
5. `docs/SEO_PERFORMANCE_SECURITY.md` — SEO/performance/security requirements.
6. `docs/HOSTINGER_DEPLOYMENT.md` — deployment contract.

## Non-negotiable client constraints
- No public pricing by default.
- No football boots or football/ball products.
- Preserve Sports, Gym & Active, Leather and Fashion categories.
- Preserve leggings/bras and multi-sport teamwear.
- Official logo only.
- Preserve WhatsApp + email + Instagram visibility.
- Public UI follows approved V6 HTML rather than a new generic template.

## Operations Hub V2 must remain
- Command Center
- Products/editor
- Categories/subcategories
- Collections
- Inventory + transaction history
- Media Library
- Orders/detail
- Team Orders CRM/detail
- Custom Kit workflow/detail/revisions/assets
- Quotes/builder/detail
- Customers/detail/notes
- Team Accounts
- Announcement Banner
- Campaigns
- Performance/Product/Request analytics
- Notifications
- Audit Log
- Admin RBAC users/roles/permissions
- Store Settings

## First local command after extracting
If this is an upgrade over the earlier local XLIME database:
```cmd
UPDATE_EXISTING_DATABASE_V2.bat
```
Then:
```cmd
npm run dev
```

## Finalization priorities
### P0 — do before client release
- Run `npm run db:update` successfully on a clean V1 database and on an already-upgraded V2 database (idempotence check).
- Run `npm run typecheck` and `npm run build`.
- Test all Admin sidebar/Quick Add/search links for 404s.
- Run admin authentication and RBAC tests using more than one role.
- Test product create/edit/duplicate/archive, image metadata and stock adjustments against MySQL persistence.
- Test order request, team order and custom kit submission from storefront → admin.
- Test quote workflow and status changes.
- Test light/dark themes at desktop/tablet/mobile breakpoints.
- Compare public pages to `APPROVED_UI_REFERENCE.html`; fix only fidelity/responsive defects, not redesigns.

### P1 — polish
- Replace any remaining remote placeholder images with final client-owned/approved assets where available.
- Tune `next/image` sizes/quality after PageSpeed/Lighthouse measurements.
- Add loading skeletons/empty states where real network latency exposes abrupt UI.
- Verify focus states, keyboard navigation and reduced-motion behavior.
- Review all user-facing copy for concise UK-market wording.
- Complete production Cloudinary configuration and media cleanup workflow.

### P2 — post-launch enhancements
- Real email/WhatsApp notification providers.
- PDF quote generation.
- Full customer/team portal permissions.
- Advanced analytics instrumentation based on consented production events.
- Optional public pricing/payment only if client explicitly enables it.

## Security rules
- Never run `npm audit fix --force` blindly.
- Never commit `.env`, database passwords, JWT secrets or Cloudinary secrets.
- Production seed requires explicit `SEED_ADMIN_EMAIL` and `SEED_ADMIN_PASSWORD`.
- Keep admin API authorization server-side; do not rely on hidden UI controls.
- Keep validation, rate limits, origin checks, HTTP-only cookies, Helmet and audit logging in place.

## SEO rules
- Preserve canonical metadata and programmatic category/subcategory routes.
- Do not fabricate Product reviews, ratings, prices or availability.
- Keep admin/account/cart/checkout/order-confirmation pages noindex.
- Verify sitemap and robots against production domain.
- Keep descriptive alt text on every product/category/hero image.

## Definition of Done
A release is done only when:
- migrations apply cleanly,
- MySQL persistence survives restart,
- typecheck/build pass,
- no broken route in storefront/admin,
- responsive visual QA passes,
- approved HTML fidelity is accepted,
- P0 security/SEO QA passes,
- production secrets are rotated and injected only through Hostinger environment settings.
