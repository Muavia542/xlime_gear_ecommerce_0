# XLIME GEAR — Production QA Checklist

## 1. Build gate
- [ ] `npm run qa:static` passes
- [ ] `npm run typecheck` passes
- [ ] `npm run build` passes
- [ ] No credentials/secrets are committed into source
- [ ] Production `.env` values are configured only in hosting environment
- [ ] `npm audit --audit-level=high` reviewed for root, frontend and backend; no unresolved high/critical issue is accepted without documented mitigation

## 2. Storefront
- [ ] Homepage server-renders categories/products when API is available
- [ ] Hero carousel auto-advances and manual controls work
- [ ] Dark/light mode readable on all sections
- [ ] Official XLIME logo is crisp in both themes
- [ ] Contact details: WhatsApp, email, website/Instagram are correct
- [ ] Sports, Gym & Active, Leather and Fashion are present
- [ ] No football boot / football ball catalogue products are seeded
- [ ] Sports leggings and sports bras are visible
- [ ] No public pricing appears while `showPublicPrices=false`
- [ ] Quick View opens the clicked product
- [ ] Quick View gallery switches images
- [ ] Product page opens the same product
- [ ] Product page gallery works
- [ ] Add to Bag persists in MySQL
- [ ] Cart quantity/remove persist after refresh
- [ ] Checkout/request flow creates an order and clears the cart
- [ ] Team Order form creates a request
- [ ] Custom Kit form creates a request

## 2A. Approved HTML visual fidelity
Compare the live Next.js storefront with `docs/APPROVED_UI_REFERENCE.html` at desktop/tablet/mobile:
- [ ] Same homepage section order and hierarchy
- [ ] Five-slide campaign hero matches approved height/crop/copy/arrows/progress direction
- [ ] Sticky header, logo sizing, professional icons and mega menu match the approved visual language
- [ ] Contact strip matches the approved desktop/mobile arrangement
- [ ] Main-category cards + sports-discovery rail are present
- [ ] New & Trending tabs use horizontal merchandising rail behavior
- [ ] New Arrival, Leather/Fashion and Gym/Custom campaign compositions are present
- [ ] Sports, Gym and Leather/Fashion product rails are present
- [ ] Interactive Custom Kit Studio is present
- [ ] Best Sellers, Team Order CTA and Build Your XLIME Bag are present
- [ ] Footer column structure and contact prominence match approved reference
- [ ] Shop/PDP/Cart/Checkout/Custom Kit/Team Order/Account visual rhythm remains consistent with approved HTML
- [ ] No generic-template redesign has replaced the approved compositions

## 3. Programmatic SEO / On-page SEO
- [ ] `/robots.txt` returns expected rules
- [ ] `/sitemap.xml` includes homepage, shop, category, subcategory and product URLs
- [ ] `/shop/sports` has unique title, H1, description and canonical
- [ ] `/shop/sports/football-kits` has unique metadata/canonical and product list
- [ ] `/product/<slug>` has unique metadata/canonical
- [ ] Product page outputs Product + Breadcrumb JSON-LD
- [ ] Category/subcategory pages output Breadcrumb/ItemList JSON-LD as applicable
- [ ] Organization JSON-LD appears globally
- [ ] No fake ratings/reviews/offers are emitted
- [ ] Product images have descriptive alt text
- [ ] Admin/account/cart/checkout/login/register/order-confirmation pages are noindex
- [ ] Internal category links use crawlable URLs rather than only query-string filters
- [ ] Google Search Console accepts sitemap after production launch

## 4. Responsive UX
Test at minimum:
- [ ] 360x800 phone
- [ ] 390x844 phone
- [ ] 768x1024 tablet
- [ ] 1024x768 tablet/landscape
- [ ] 1366x768 laptop
- [ ] 1440x900 desktop
- [ ] 1920x1080 desktop

Check:
- [ ] No horizontal page overflow
- [ ] Touch targets are usable
- [ ] Admin sidebar becomes off-canvas on tablet/mobile
- [ ] Admin tables become mobile cards where configured
- [ ] Navigation/search/action buttons remain reachable
- [ ] Modals do not exceed viewport

## 5. Admin authentication / RBAC
- [ ] Non-admin `/admin` access redirects to login
- [ ] Customer cannot call admin endpoints directly
- [ ] Super Admin can access all modules
- [ ] Catalog Manager cannot manage Admin Users/Settings
- [ ] Operations Manager can manage Orders/Team Orders/Custom Kits/Quotes
- [ ] Disabled admin membership is rejected
- [ ] Logout clears session

## 6. Command Center
- [ ] Active Products correct
- [ ] Open Requests correct
- [ ] Team Orders correct
- [ ] Custom Kits correct
- [ ] Quotes Pending correct
- [ ] Low Stock/action centre responds to DB state
- [ ] Recent Orders load
- [ ] Top Product Interest loads
- [ ] Request pipeline counts load

## 7. Products
- [ ] Search/filter works
- [ ] Create product
- [ ] Edit product
- [ ] Duplicate product
- [ ] Archive product
- [ ] Add image URL
- [ ] Upload image
- [ ] Descriptive alt text saved
- [ ] Set cover image
- [ ] Delete gallery image
- [ ] SEO title/description saved
- [ ] Sport/gender/customisable fields persist
- [ ] Archived product disappears from public catalogue

## 8. Categories / Collections
- [ ] Create/edit category
- [ ] Add/edit subcategories
- [ ] Category SEO fields persist
- [ ] Delete protection prevents destructive category deletion when products are assigned
- [ ] Create/edit/delete collection
- [ ] Collection-product assignment persists

## 9. Inventory
- [ ] Metrics show total/in-stock/low/critical/out-of-stock
- [ ] Quick adjustment changes product stock
- [ ] Reason and note are persisted
- [ ] Inventory transaction history shows old/change/new values
- [ ] Stock change generates Audit Log entry

## 10. Orders
- [ ] Search/filter works
- [ ] Order detail loads customer/address/items
- [ ] Status changes persist
- [ ] Timeline reflects status
- [ ] Order update is audited

## 11. Team Orders
- [ ] Board and table views work
- [ ] Request detail loads
- [ ] Stage changes persist
- [ ] Internal notes persist
- [ ] Quote link/value is visible when available
- [ ] Audit/notification behaviour works

## 12. Custom Kits
- [ ] Board columns load correctly
- [ ] Request detail shows team/colour/player data
- [ ] Stage changes persist
- [ ] Add/delete design assets persists
- [ ] Create design revision/version history persists
- [ ] Audit trail records stage changes

## 13. Quotes
- [ ] Quote builder creates quote/items
- [ ] Totals calculate correctly
- [ ] Draft -> Sent -> Approved status works
- [ ] Quote detail loads
- [ ] Quote events are audited

## 14. Customers / Team Accounts
- [ ] Customer list/detail loads
- [ ] Customer notes persist
- [ ] Team account create/edit persists
- [ ] Email/phone/organisation search is usable

## 15. Marketing / Content
- [ ] Announcement banner enable/disable
- [ ] Dismissibility toggle
- [ ] Text/CTA/background/text colour persist
- [ ] Start/end scheduling persists and controls storefront visibility
- [ ] Public storefront reflects banner
- [ ] Campaign create/edit/status works

## 16. Analytics
- [ ] Performance date range changes values
- [ ] Quote conversion calculation behaves with zero and non-zero quote counts
- [ ] Product insight metrics load
- [ ] Request insight sports/colours/team-size aggregation loads

## 17. System
- [ ] Notification unread count works
- [ ] Mark one/read all works
- [ ] Audit search/action/entity filters work
- [ ] Create Admin user works with strong-password validation
- [ ] Admin Users role assignment persists
- [ ] Disabled Admin membership is blocked in production
- [ ] Store Settings persist
- [ ] Public price setting is enforced by the public product API
- [ ] Brand/contact/default SEO settings persist
- [ ] Media Library upload/create/delete record works

## 18. Database persistence proof
1. Create a product, order and team-order note.
2. Stop frontend/backend.
3. Restart both.
4. Confirm all records still exist.
5. Verify with Prisma Studio or MySQL CLI.

## 19. Security smoke tests
- [ ] 401 on protected endpoint without session
- [ ] 403 for customer hitting admin endpoint
- [ ] 403 for disallowed Origin on state-changing request
- [ ] Login brute-force test triggers auth rate limit
- [ ] Oversized JSON body is rejected
- [ ] Non-image / oversized upload is rejected
- [ ] Unexpected fields fail Zod validation where schema is strict
- [ ] Admin response headers are no-store/private
- [ ] Error responses do not expose stack traces

## 20. Production performance
Run PageSpeed Insights after Hostinger deployment:
- [ ] Mobile Core Web Vitals reviewed
- [ ] Desktop Core Web Vitals reviewed
- [ ] Hero LCP image optimised
- [ ] No major CLS from images/fonts
- [ ] Third-party scripts measured separately
- [ ] Images/CDN checked

Performance is environment/content dependent; use real production measurements as the release gate rather than promising a fixed score in advance.
