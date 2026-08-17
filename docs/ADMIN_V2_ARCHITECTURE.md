# XLIME Operations Hub V2 — Module Map

## Navigation
**Overview**: Command Center

**Catalog**: Products, Categories, Collections, Inventory, Media Library

**Orders & Requests**: Orders, Team Orders, Custom Kits, Quotes & Approvals

**Customers**: Customers, Team Accounts

**Marketing**: Announcement Banner, Campaigns

**Analytics**: Performance, Product Insights, Request Insights

**System**: Notifications, Audit Log, Admin Users, Store Settings

## Core backend domains
- Product/catalog
- Inventory transactions
- Order operations
- Team Order CRM
- Custom Kit pipeline
- Quote management
- Customer/team account intelligence
- Content/campaign management
- Notifications
- Audit logging
- RBAC permissions
- Media
- Store settings

## RBAC permission keys
- `dashboard.view`
- `products.manage`
- `categories.manage`
- `collections.manage`
- `inventory.manage`
- `orders.manage`
- `teamOrders.manage`
- `customKits.manage`
- `quotes.manage`
- `customers.manage`
- `marketing.manage`
- `analytics.view`
- `audit.view`
- `settings.manage`
- `admins.manage`
- `media.manage`

## Workflow stages
### Team Orders
`NEW_LEAD -> CONTACTED -> REQUIREMENTS -> QUOTE_PREPARATION -> QUOTE_SENT -> APPROVED -> PRODUCTION -> QUALITY_CHECK -> DISPATCHED -> COMPLETED`

### Custom Kits
`NEW -> DESIGN_REVIEW -> AWAITING_ASSETS -> REVISION -> REQUIREMENTS_CONFIRMED -> QUOTED -> APPROVED -> PRODUCTION -> QUALITY_CHECK -> DISPATCHED -> COMPLETED`

## Database evolution
The V2 migration is additive and keeps the original user/product/cart/order/request tables while adding Operations Hub entities such as Collections, Inventory Transactions, Team Accounts, Quotes, Custom Kit Assets/Revisions, Notifications, Campaigns, Media, RBAC and Store Settings.

## Visual source of truth
`docs/ADMIN_V2_VISUAL_REFERENCE.png` is the approved XLIME dashboard direction supplied in the project discussion. V2 follows its compact performance-console character, official lime/graphite identity, professional iconography, responsive desktop/mobile composition and readable light/dark separation. It is a design reference, not a source of deprecated boots/ball catalogue content.
