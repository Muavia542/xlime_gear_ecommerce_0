# XLIME GEAR — Hostinger Production Deployment

This project is intentionally split into two Node applications:

```text
xlimegear.com      -> frontend/  (Next.js)
api.xlimegear.com  -> backend/   (Express API)
Hostinger MySQL    -> database
```

## A. Confirm your plan
Use Hostinger's Node.js Web App deployment if the client's plan includes managed Node.js apps. Otherwise use a VPS or upgrade the plan.

## B. Create production MySQL database
In hPanel:
1. Databases -> MySQL Databases
2. Create a database and a dedicated database user
3. Save database name, user, password and host
4. Never use MySQL root credentials in the application

Production `DATABASE_URL` format:
```env
DATABASE_URL=mysql://DB_USER:URL_ENCODED_PASSWORD@DB_HOST:3306/DB_NAME
```
If the password contains `@`, `:`, `/`, `#`, `%` or other URL-reserved characters, URL-encode it.

## C. Backend app (`api.xlimegear.com`)
Upload/deploy the **`backend/` folder as its own Node.js app**.

Recommended Node version: 22 or 24.

Environment variables:
```env
NODE_ENV=production
PORT=4000
FRONTEND_ORIGIN=https://xlimegear.com
DATABASE_URL=mysql://...
JWT_SECRET=<unique long random secret>
JWT_EXPIRES_IN=7d
COOKIE_SECURE=true
UPLOAD_PROVIDER=cloudinary
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
```

Recommended build command:
```text
npm run build:hostinger
```
This generates Prisma, applies pending migrations and compiles TypeScript.

Start command:
```text
npm start
```

Do **not** automatically run `db:seed` on every production deploy. The seed is for first-time QA/demo bootstrap. Production catalogue/content should be managed from the Admin V2 interface after initial setup.

## D. Frontend app (`xlimegear.com`)
Upload/deploy the **`frontend/` folder as a separate Next.js app**.

Environment variables:
```env
NEXT_PUBLIC_API_URL=https://api.xlimegear.com/api
SERVER_API_URL=https://api.xlimegear.com/api
NEXT_PUBLIC_SITE_URL=https://xlimegear.com
NEXT_PUBLIC_CONTACT_WHATSAPP=447510926711
NEXT_PUBLIC_CONTACT_EMAIL=info@xlimegear.com
```

Build command:
```text
npm run build
```
Start command:
```text
npm start
```

## E. Domain/DNS
- Root domain / `www`: frontend Next.js app
- `api.xlimegear.com`: backend Express app
- Force HTTPS
- Keep `FRONTEND_ORIGIN` exactly aligned with the public frontend origin

## F. First production admin
Do not expose the QA demo account/password publicly.
Preferred process:
1. Deploy schema/migrations
2. Create/rotate the first production admin using a controlled one-time process
3. Assign Super Admin membership
4. Remove/disable any demo account
5. Store credentials in a password manager

If you initially seed production for convenience, immediately change the seeded Admin password and remove the demo customer/sample records before launch.

## G. Production uploads
Use `UPLOAD_PROVIDER=cloudinary` for product/admin media. Local filesystem upload mode is suitable for local QA, but object storage/CDN is the safer production default for redeployments and scaling.

## H. SEO launch checklist
After deployment:
1. Confirm `https://xlimegear.com/robots.txt`
2. Confirm `https://xlimegear.com/sitemap.xml`
3. Add the site to Google Search Console
4. Submit sitemap
5. Inspect homepage, one category, one subcategory and one product URL
6. Validate structured data with Google's Rich Results Test
7. Use real descriptive product names/descriptions/image alt text; never generate fake ratings/reviews/prices
8. Keep admin/cart/checkout/account URLs noindex

## I. Performance launch checklist
- Use compressed WebP/AVIF-capable source images and avoid oversized uploads
- Use Cloudinary/CDN for user-uploaded media
- Keep hero media dimensions reasonable
- Test PageSpeed Insights on production, not only localhost
- Measure mobile and desktop separately
- Re-test after adding analytics/chat/marketing scripts because third-party scripts can materially change performance

## J. Security launch checklist
- Rotate `JWT_SECRET` and all production passwords
- `COOKIE_SECURE=true`
- HTTPS only
- Do not upload `.env` into Git
- Enable Hostinger backups
- Keep Node/npm dependencies patched
- Review Admin Audit Log
- Restrict admin users to required permissions
- Back up database before migrations
- Keep Cloudinary/API secrets server-side only
- Periodically run dependency/security review and restore testing

No deployment can be guaranteed immune to every cyberattack; this project uses layered controls and should be maintained as a live production system.
