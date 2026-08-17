# XLIME GEAR — Production Project / Operations Hub V2

Full-stack XLIME GEAR commerce + B2B teamwear operations application.

## Stack
- **Frontend:** Next.js 16 App Router, React 19, TypeScript, Tailwind CSS 4
- **Backend:** Node.js 22/24 + Express 5 + TypeScript
- **Database:** MySQL 8 + Prisma ORM 7
- **Auth:** bcrypt password hashing + HTTP-only JWT cookie
- **Admin:** separate `/admin` Operations Hub with RBAC
- **Uploads:** local QA storage + Cloudinary-ready production configuration

## Design source of truth
The production storefront is aligned to **`docs/APPROVED_UI_REFERENCE.html`** (XLIME Client Revision V6: no public pricing, multi-sport). The HTML reference is intentionally kept in the project for pixel/structure QA and future Codex refinement.

## What is included
### Storefront
- Responsive dark/light experience
- Sports, Gym & Active, Leather and Fashion catalogue
- No football boots/football balls in the seeded catalogue
- Public prices disabled by default
- Product galleries, quick view, cart, checkout/request flow
- Custom Kit request flow and Team Order request flow
- Official XLIME branding and contact details

### XLIME Operations Hub V2
- Command Center with operational KPIs, request pipeline and action centre
- Product catalogue with full editor, SEO fields, image manager, duplicate/archive
- Categories + subcategories
- Collections
- Inventory metrics, adjustments and transaction history
- Orders + order detail/timeline
- Team Orders CRM with board/table workflow and notes
- Custom Kit workflow with request detail and stage management
- Quotes & approvals + quote builder
- Customers + notes + customer detail
- Team Accounts
- Announcement Banner
- Campaigns
- Performance, Product and Request analytics
- Notifications centre
- Audit Log
- Admin roles/permissions
- Store Settings
- Media Library

## SEO/performance baseline
- Server-rendered homepage/shop/category/product content
- Dynamic product/category/subcategory metadata and canonicals
- Programmatic category + subcategory landing URLs
- `robots.ts`, `sitemap.ts`, web manifest
- Product, Organization, Breadcrumb and ItemList structured data without fabricated ratings/prices
- `next/font` font optimisation
- Next Image for key public visuals, AVIF/WebP output and responsive sizes
- Private/admin/cart/checkout pages marked noindex
- Compression and security headers

## Security baseline
- Admin authentication + role/permission checks on the API
- HTTP-only cookies, SameSite, production Secure cookie option
- bcrypt password hashing
- Helmet, CORS allow-list, Origin checks
- General and authentication rate limiting
- Zod validation
- Request body/parameter limits
- Restricted image MIME/type/size uploads
- No-stack generic production errors
- Audit trail for sensitive admin actions
- `Cache-Control: no-store` for session/admin responses

> Security is defence-in-depth. No web application can truthfully guarantee protection from every possible cyberattack. Production security still requires secret rotation, updates, monitoring, backups, TLS and periodic testing.

## First local run
Read **`docs/LOCAL_SETUP_WINDOWS.md`**.

### Recommended on Windows CMD
After MySQL is ready, run the included one-click setup:
```cmd
SETUP_LOCAL_WINDOWS.bat
```
Then:
```cmd
npm run dev
```

Manual CMD equivalent:
```cmd
copy /Y backend\.env.example backend\.env
copy /Y frontend\.env.example frontend\.env.local
npm install
npm run install:all
cd backend
npm run db:generate
npm run db:deploy
npm run db:seed
cd ..
npm run dev
```

URLs:
- Storefront: `http://localhost:3000`
- Admin: `http://localhost:3000/admin`
- API health: `http://localhost:4000/api/health`

Local QA admin after seed:
- Email: `admin@xlimegear.local`
- Password: `Admin12345!`

**Never use the demo password in production.**

## Existing V1 database upgrade
The migration `202608120002_admin_v2` is additive. **Do not drop or reset the existing database.**

Recommended Windows CMD command:
```cmd
UPDATE_EXISTING_DATABASE_V2.bat
```
Or from the project root:
```cmd
npm run db:update
```
This generates Prisma Client, applies V2 migrations, and upserts the V2 QA data in the correct order.
This adds Operations Hub V2 tables/fields and QA records without intentionally deleting orders/users.

## QA
```powershell
npm run qa:static
npm run typecheck
npm run build
```
Then follow `docs/QA_CHECKLIST.md` for end-to-end browser/database testing.

## Production deployment
Read `docs/HOSTINGER_DEPLOYMENT.md` before uploading.
