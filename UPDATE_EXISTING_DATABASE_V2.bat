@echo off
setlocal
cd /d %~dp0

echo ============================================================
echo  XLIME GEAR - Apply V2 Database and QA Seed
 echo ============================================================

if not exist backend\.env (
  echo Creating backend\.env from example...
  copy /Y backend\.env.example backend\.env >nul
)
if not exist frontend\.env.local (
  echo Creating frontend\.env.local from example...
  copy /Y frontend\.env.example frontend\.env.local >nul
)

echo.
echo [1/4] Verifying DATABASE_URL...
findstr /B "DATABASE_URL=" backend\.env
if errorlevel 1 goto :missing_env

echo.
echo [2/4] Generating Prisma Client...
pushd backend
set NODE_ENV=development
call npm run db:generate
if errorlevel 1 goto :error_pop

echo.
echo [3/4] Applying additive V2 migrations - existing data is preserved...
call npm run db:deploy
if errorlevel 1 goto :error_pop

echo.
echo [4/4] Seeding/upserting V2 roles, settings and QA records...
call npm run db:seed
if errorlevel 1 goto :error_pop
popd

echo.
echo ============================================================
echo  V2 database update complete.
echo  Start the app with: npm run dev
 echo ============================================================
pause
exit /b 0

:missing_env
echo ERROR: DATABASE_URL is missing from backend\.env
pause
exit /b 1

:error_pop
popd
:error
echo.
echo ERROR: V2 update failed. Do NOT reset the database.
echo Check MySQL is running and DATABASE_URL is correct.
pause
exit /b 1
