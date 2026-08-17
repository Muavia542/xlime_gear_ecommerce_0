# XLIME GEAR — Local Windows Setup

## 1. Requirements
- MySQL 8.x running on port 3306
- Node.js 22.12+ or Node.js 24
- npm

Verify in Command Prompt:
```cmd
mysql --version
node -v
npm -v
```
To inspect the Windows MySQL service, PowerShell can additionally use `Get-Service *mysql*`.

## 2. Local database
If you already created `xlime_gear` and `xlime_app`, skip this step.

Log in as MySQL root:
```cmd
mysql -u root -p
```
Then:
```sql
CREATE DATABASE IF NOT EXISTS xlime_gear CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER IF NOT EXISTS 'xlime_app'@'localhost' IDENTIFIED BY 'XlimeLocal2026';
CREATE USER IF NOT EXISTS 'xlime_app'@'127.0.0.1' IDENTIFIED BY 'XlimeLocal2026';
GRANT ALL PRIVILEGES ON xlime_gear.* TO 'xlime_app'@'localhost';
GRANT ALL PRIVILEGES ON xlime_gear.* TO 'xlime_app'@'127.0.0.1';
FLUSH PRIVILEGES;
EXIT;
```

Connection test:
```cmd
mysql --protocol=TCP -h 127.0.0.1 -P 3306 -u xlime_app -p -D xlime_gear -e "SELECT CURRENT_USER(), DATABASE();"
```
Use the local app password `XlimeLocal2026`.

## 3. Environment files
From **Windows Command Prompt (CMD)** in the project root:
```cmd
copy /Y backend\.env.example backend\.env
copy /Y frontend\.env.example frontend\.env.local
```

PowerShell equivalent, only if you are actually using PowerShell:
```powershell
Copy-Item .\backend\.env.example .\backend\.env -Force
Copy-Item .\frontend\.env.example .\frontend\.env.local -Force
```

Local backend database URL should be:
```env
DATABASE_URL=mysql://xlime_app:XlimeLocal2026@127.0.0.1:3306/xlime_gear
```

## 4. Install packages
```cmd
npm install
npm run install:all
```

## 5. Generate Prisma + apply migrations
```cmd
cd backend
npm run db:generate
npm run db:deploy
```

For a QA database, seed the catalogue/Admin V2 samples:
```cmd
npm run db:seed
```
Then return to root:
```cmd
cd ..
```

## 6. Run
```cmd
npm run dev
```
Open:
- `http://localhost:3000`
- `http://localhost:3000/admin`
- `http://localhost:4000/api/health`

QA Admin:
```text
admin@xlimegear.local
Admin12345!
```

## 7. Prisma Studio (optional)
In another terminal:
```cmd
cd backend
npm run db:studio
```

## 8. Upgrade from the previous XLIME ZIP
Do **not** drop your MySQL database. Keep the existing `xlime_gear` database and use the included updater from the project root:
```cmd
UPDATE_EXISTING_DATABASE_V2.bat
```

Or run:
```cmd
npm run db:update
```

This is the safest route because it forces the required order:
1. Prisma Client generation
2. Additive V2 migrations
3. Seed/upsert V2 roles, settings and local QA records

After it succeeds:
```cmd
npm run dev
```

## 9. Before calling a build production-ready
```cmd
npm run qa:static
npm run typecheck
npm run build
```
Resolve any local dependency/build error before deployment.
