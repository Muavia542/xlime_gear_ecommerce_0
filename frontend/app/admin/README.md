# Admin module
This folder is intentionally separate and named `admin`.
Routes:
- `/admin` Dashboard
- `/admin/products` Product CRUD
- `/admin/orders` Order status management
- `/admin/team-orders` Team order lead management
- `/admin/custom-kits` Custom kit request management
- `/admin/users` Customer list
All operational APIs are independently protected by backend `requireAdmin` middleware; frontend route hiding is not treated as security.
