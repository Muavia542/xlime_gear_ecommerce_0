# Security Operations Notes

XLIME GEAR uses defence-in-depth rather than claiming immunity from every attack.

## Implemented controls
- HTTP-only JWT session cookie; `Secure` in production; SameSite protection.
- Admin RBAC/permission checks enforced in Express, not only hidden in the UI.
- Production fail-closed behaviour for admin accounts without active AdminMembership.
- Helmet security headers and production HSTS/CSP configuration.
- Exact CORS allow-list and Origin/Sec-Fetch checks on unsafe requests.
- Global, authentication and public-form rate limits.
- Zod validation, body limits and parameter constraints.
- bcrypt password hashing.
- Image upload MIME, extension/size and magic-byte checks.
- Generic 500 responses; protected endpoints use private/no-store caching.
- Inventory/admin changes generate audit records where implemented.
- Secrets are environment variables; `.env` files are excluded from the release ZIP.

## Production owner responsibilities
- Rotate JWT/database/Cloudinary/admin credentials before launch.
- Force HTTPS and use `COOKIE_SECURE=true`.
- Keep Node/npm/OS packages patched and review Hostinger vulnerability findings.
- Back up MySQL before migrations and test restore procedures.
- Use least-privilege admin roles and remove demo accounts/data.
- Monitor logs/audit records and periodically perform application security testing.
- Re-test after adding payment, analytics, chat, email or other third-party integrations.

No application can honestly be guaranteed secure against every future vulnerability or cyberattack.
