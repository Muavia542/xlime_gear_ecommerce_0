# XLIME GEAR MySQL

Database: MySQL 8.x
ORM: Prisma 7

## Local
Run `mysql-local-setup.sql` as MySQL root, then configure `backend/.env`.

## Migrations
- `202608120001_init` — original XLIME commerce schema
- `202608120002_admin_v2` — additive Operations Hub V2, SEO/inventory/quotes/RBAC/media/settings expansion

Never manually edit production tables after Prisma migrations have been adopted. Back up production before schema deployment.

## Production
Use a dedicated Hostinger MySQL user with only the application database privileges. Do not use the MySQL root account from the Node.js app.
