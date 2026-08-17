# XLIME GEAR Operations Hub V2 — Release Notes

## Admin UX
- Replaced the basic dark admin UI with a layered, readable Operations Hub design system.
- Added professional grouped navigation, global search, Quick Add, notification drawer, theme toggle and profile menu using Lucide icons.
- Added responsive off-canvas navigation and mobile record cards.
- Official client-provided XLIME logo is preserved in `docs/OFFICIAL_XLIME_LOGO_RECEIVED.png` and production-ready dark/light derivatives are used in the interface.

## New Admin modules
Command Center, Collections, Inventory, Media Library, Order Details, Team Order CRM, Custom Kit workflow, Quotes, Customer intelligence, Team Accounts, Announcement Banner, Campaigns, three analytics areas, Notifications, Audit Log, Admin Users/RBAC and Store Settings.

## SEO / performance
- Server-rendered public catalogue content
- Programmatic category + subcategory URLs
- Dynamic metadata/canonical tags
- Structured data
- Dynamic sitemap/robots
- noindex private pages
- next/font + Next Image optimisation
- AVIF/WebP configuration

## Backend/security
- Additive MySQL/Prisma V2 migration
- Permission-based Admin middleware
- Inventory transaction trail
- Notifications and audit events
- Helmet/CORS/Origin/rate limit/body limits
- Hardened uploads
- Protected response cache controls

## Upgrade note
Existing V1 local users/orders can be kept. Run `npm run db:deploy` to apply the additive V2 migration, then `npm run db:seed` for the QA/Admin V2 bootstrap data.

## Final QA refinements
- Universal admin search with Ctrl/Cmd+K across products, orders, customers, team orders, custom kits and quotes.
- Quick Add shortcuts for products, quotes, team orders and custom kits.
- Functional Admin-user creation with role assignment and production fail-closed membership checks.
- Custom Kit asset and design-revision/version management.
- Announcement Banner scheduling (start/end date/time).
- Store Settings now enforce the global public-pricing switch at the public API boundary and expose official brand/contact/default SEO configuration.
- Windows helper included to create separate clean Hostinger frontend/backend upload ZIPs.


## Corrected Storefront Fidelity Release
- `docs/APPROVED_UI_REFERENCE.html` is now the explicit storefront design source of truth.
- Imported the approved V6 visual system into `frontend/app/storefront-approved.css`.
- Rebuilt the public header, mega menu, five-slide hero, contact strip, product merchandising rails, custom-kit studio, best-seller rail, team-order CTA, bag builder and footer around the approved HTML structure.
- Reworked Shop, PDP, Cart, Checkout, Custom Kits, Team Orders, Account and Confirmation pages toward the approved HTML layout while keeping real API/MySQL behavior.
- Added official XLIME logo variants and retained the client-received logo reference.
- Added `UPDATE_EXISTING_DATABASE_V2.bat` and `npm run db:update` so V2 migrations cannot be accidentally skipped after Prisma generation.
- Fixed Next Image quality 82 configuration, explicit Turbopack root and smooth-scroll route warning.
- Removed prefilled QA credentials from the public login form. Production seeding now requires explicit `SEED_ADMIN_EMAIL` and `SEED_ADMIN_PASSWORD` if `NODE_ENV=production`.
