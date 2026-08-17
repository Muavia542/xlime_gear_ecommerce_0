# SEO, Performance & Security Implementation Notes

## SEO implemented
- Global metadata and canonical baseline
- Programmatic category and subcategory pages
- Dynamic product metadata
- Product/Organization/Breadcrumb/ItemList JSON-LD
- `robots.ts`
- dynamic `sitemap.ts`
- noindex for private/transactional/admin routes
- descriptive image alt fields stored in MySQL/admin UI
- internal links to indexable category/subcategory URLs
- server-rendered catalogue data for key public pages

Because public pricing is intentionally disabled, Product structured data does not invent Offer/price/availability/review values. If pricing is enabled later, add accurate Offer properties from the database.

## Performance implemented
- Next.js server rendering for homepage/shop/product/category pages
- `next/font` rather than runtime Google Fonts CSS
- Next Image for primary public images
- AVIF/WebP image output configuration
- responsive `sizes`
- hero first image priority, later slides lazy by default
- compression
- ISR/revalidation for public API-backed SEO pages
- no heavy chart library required for the current admin analytics UI

## Security implemented
- HTTP-only cookie authentication
- bcrypt password hashing
- admin role + permission middleware
- CORS allow-list + Origin guard
- Helmet headers/HSTS in production
- rate limiting + stricter auth limiting
- request body/field limits
- Zod validation
- restricted upload MIME/type/size
- generic server errors
- audit logging
- notification/audit workflow
- no-store cache headers for protected responses

Security is an ongoing process, not a one-time guarantee. Rotate production secrets, patch dependencies, monitor logs, maintain backups and retest after every material integration.
