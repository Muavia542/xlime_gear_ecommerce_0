@echo off
setlocal
cd /d %~dp0
if not exist backend\.env copy backend\.env.example backend\.env
if not exist frontend\.env.local copy frontend\.env.example frontend\.env.local
echo Installing root tools...
call npm install
if errorlevel 1 goto :error
echo Installing frontend and backend dependencies...
call npm run install:all
if errorlevel 1 goto :error
pushd backend
set NODE_ENV=development
echo Generating Prisma Client...
call npm run db:generate
if errorlevel 1 goto :error_pop
echo Applying MySQL migrations...
call npm run db:deploy
if errorlevel 1 goto :error_pop
echo Seeding XLIME demo data...
call npm run db:seed
if errorlevel 1 goto :error_pop
popd
echo.
echo Setup complete. Run START_LOCAL_WINDOWS.bat
pause
exit /b 0
:error_pop
popd
:error
echo Setup failed. Read docs\LOCAL_SETUP_WINDOWS.md and check MySQL is running.
pause
exit /b 1
