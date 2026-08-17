# XLIME GEAR — Approved HTML → Next.js Fidelity Map

## Source of truth
`docs/APPROVED_UI_REFERENCE.html` is the approved Client Revision V6 reference (no public pricing, multi-sport). The production storefront should preserve its visual hierarchy, spacing rhythm, navigation model, hero composition, merchandising rails, custom-kit emphasis and responsive behavior.

Do **not** redesign the public storefront into a generic ecommerce grid. Backend/API integration may change the data source, but should not silently change the approved presentation.

## Homepage mapping
| Approved HTML section | Production Next.js implementation |
|---|---|
| Announcement | `components/layout/AnnouncementBanner.tsx` |
| Sticky header + icons | `components/layout/SiteHeader.tsx` |
| Mega menu | `components/layout/SiteHeader.tsx` |
| Five-slide Hero V5 | `components/home/HeroCarousel.tsx` |
| Contact strip | `components/layout/ContactStrip.tsx` |
| Shop by category | `components/home/HomeStorefront.tsx` |
| Sports discovery rail | `components/home/HomeStorefront.tsx` |
| New & Trending tabs/rail | `components/home/HomeStorefront.tsx` |
| New Arrival football-kit feature | `components/home/HomeStorefront.tsx` |
| Leather/Fashion promo mosaic | `components/home/HomeStorefront.tsx` |
| Gym/Custom promo mosaic | `components/home/HomeStorefront.tsx` |
| Sports & Team Uniforms rail | `components/home/HomeStorefront.tsx` |
| Gym & Active rail | `components/home/HomeStorefront.tsx` |
| Leather & Fashion rail | `components/home/HomeStorefront.tsx` |
| Custom Kit Studio | `components/home/HomeStorefront.tsx` |
| Best Sellers | `components/home/HomeStorefront.tsx` |
| Team Order CTA | `components/home/HomeStorefront.tsx` |
| Build Your XLIME Bag | `components/home/HomeStorefront.tsx` |
| Support / Contact | `components/home/HomeStorefront.tsx` |
| Footer | `components/layout/SiteFooter.tsx` |

## Shared visual system
The approved HTML CSS was ported to:
- `frontend/app/storefront-approved.css`

Global application primitives remain in:
- `frontend/app/globals.css`

Admin Operations Hub styles are isolated in:
- `frontend/app/admin/admin.css`

## Core public routes mapped to approved design
- `/` — approved V6 homepage composition
- `/shop` — approved catalogue/sidebar/grid direction
- `/shop/[category]` — programmatic category landing
- `/shop/[category]/[subcategory]` — programmatic subcategory landing
- `/product/[slug]` — approved PDP gallery/options/trust layout
- `/cart` — approved bag layout, no public pricing
- `/checkout` — approved request/checkout layout
- `/custom-kits` — approved interactive kit-studio direction
- `/team-orders` — approved B2B/team-order direction
- `/account` — approved account dashboard direction
- `/order-confirmation/[orderNumber]` — approved confirmation direction

## Client constraints that must remain locked
1. Do not show public prices by default.
2. Do not re-add football boots or football/ball products.
3. Keep Sports, Gym & Active, Leather and Fashion as the four primary product families.
4. Keep sports leggings and sports bras visible.
5. Keep WhatsApp, email, website and Instagram contact paths prominent.
6. Use the official XLIME logo assets from `frontend/public/images/official/`.
7. Preserve custom-team and bulk-order positioning.
8. Do not replace the approved layout with a generic template during refactoring.

## Responsive QA targets
Compare the Next.js storefront against the approved reference at approximately:
- 1440px desktop
- 1024px tablet landscape
- 768px tablet/compact
- 430px mobile
- 390px mobile
- 360px small mobile

The visual QA should compare section order, hero height/crop, text hierarchy, card widths, rail behavior, contact-strip layout, mobile header and overall vertical rhythm.
