# XLIME GEAR — FINAL IMPLEMENTATION TODO

Status Legend:
- [ ] NOT STARTED
- [~] IN PROGRESS
- [x] PASS
- [!] BLOCKED / NEEDS REVIEW

## P0 CART UX
- [x] 01 Audit current CartContext
- [x] 02 Audit FloatingCartButton
- [x] 03 Audit CartDrawer
- [x] 04 Audit SiteFrame mounting
- [x] 05 Remove desktop floating-cart CSS hide rule
- [x] 06 ProductCard successful add opens CartDrawer
- [x] 07 QuickView successful add closes modal and opens CartDrawer
- [x] 08 PDP successful add opens CartDrawer
- [x] 09 BagBuilder opens drawer once after batch add
- [x] 10 Header bag still manually opens drawer
- [x] 11 Empty cart hides floating button
- [x] 12 Drawer open hides floating button
- [x] 13 Closing drawer restores floating button if cart has items
- [x] 14 /cart hides floating button
- [x] 15 /checkout hides floating button
- [x] 16 Desktop 1440 cart runtime test
- [x] 17 Tablet 1024 cart runtime test
- [x] 18 Tablet 768 cart runtime test
- [x] 19 Mobile 390 cart runtime test
- [x] 20 Mobile 375 cart runtime test

## P0 VARIANTS
- [x] 21 Audit ProductVariant Prisma model
- [x] 22 Public product API includes active variants
- [x] 23 Frontend Product type includes variants
- [x] 24 Remove regex sizes as primary source of truth
- [x] 25 Required variant selection enforced
- [x] 26 Out-of-stock variants disabled
- [x] 27 Backend validates variant ownership
- [x] 28 Backend validates active variant
- [x] 29 Backend validates variant stock
- [x] 30 Backend derives size/color from DB, not client
- [x] 31 Different variants remain separate cart lines
- [x] 32 Same product + same variant increments quantity

## P1 CART API
- [x] 33 Add Zod validation for cart add
- [x] 34 Add Zod validation for cart quantity update
- [x] 35 Quantity min 1 max 99
- [x] 36 Customisation object bounded
- [x] 37 Reject invalid variantId
- [x] 38 Preserve cart rate limiter

## P1 PASSWORD RESET
- [x] 39 Audit existing auth routes
- [x] 40 Audit existing auth service
- [x] 41 Audit existing JWT middleware
- [x] 42 Audit existing email provider
- [x] 43 Add Forgot Password UI
- [x] 44 Add forgot-password backend route
- [x] 45 Add reset-password backend route
- [x] 46 Add secure hashed reset token storage
- [x] 47 Add token expiry
- [x] 48 Add one-time token behavior
- [x] 49 Add generic anti-enumeration response
- [x] 50 Add sessionVersion
- [x] 51 JWT includes session version
- [x] 52 Old sessions invalid after password reset
- [x] 53 Forgot password rate limiter
- [x] 54 Reset password rate limiter
- [x] 55 Add/reset auth validation
- [x] 56 Add reset password UI
- [x] 57 Confirm email provider configuration requirements

## P2 POLISH / AUDIT
- [x] 58 Audit dead Wishlist heart
- [x] 59 Remove dead Wishlist if not implementing now
- [x] 60 Audit footer Delivery link
- [x] 61 Audit footer Returns link
- [x] 62 Audit footer Size Guide link
- [x] 63 Audit footer FAQs link
- [x] 64 Audit newsletter mailto behavior
- [x] 65 Audit production db:update + seed coupling

## QA / RELEASE
- [x] 66 npm run typecheck
- [x] 67 npm run qa:static
- [x] 68 npm run build
- [x] 69 Browser console check
- [x] 70 Database reset NOT performed
- [x] 71 Database reseed NOT performed
- [x] 72 Admin Quick Add regression check
- [x] 73 Pricing regression check
- [x] 74 Final implementation report
