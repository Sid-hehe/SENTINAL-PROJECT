@echo off
setlocal
title Sentinel - Behavioral Fraud Intelligence Platform

echo =======================================================================
echo    SENTINEL - BEHAVIORAL FRAUD INTELLIGENCE PLATFORM
echo =======================================================================
echo.

:: Check Node.js installation
where node >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Node.js is not found in your PATH.
    echo Please install Node.js v18 or higher from https://nodejs.org
    pause
    exit /b 1
)

:: Navigate to script directory
cd /d "%~dp0"

:: Check if node_modules exist
if not exist "node_modules" (
    echo [INFO] Installing root dependencies...
    call npm install
)

if not exist "server\node_modules" (
    echo [INFO] Installing server dependencies...
    call npm install --prefix server
)

if not exist "client\node_modules" (
    echo [INFO] Installing client dependencies...
    call npm install --prefix client
)

:: Check if server database exists, if not migrate and seed
if not exist "server\prisma\dev.db" (
    echo [INFO] Initializing demo database...
    call npm run db:migrate --prefix server
    call npm run db:seed --prefix server
)

echo.
echo =======================================================================
echo    Starting Sentinel Platform [Server + Client]
echo.
echo    - Frontend UI:  http://localhost:5173
echo    - Backend API:  http://localhost:5000/api
echo.
echo    Demo Accounts:
echo      * Admin:   admin@sentinel.demo   / SentinelDemo123!
echo      * Analyst: analyst@sentinel.demo / SentinelDemo123!
echo      * User:    user@sentinel.demo    / SentinelDemo123!
echo =======================================================================
echo.

call npm run dev

pause
