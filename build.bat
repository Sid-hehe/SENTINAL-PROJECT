@echo off
setlocal enabledelayedexpansion
title Sentinel - Build Platform

cd /d "%~dp0"

echo =======================================================================
echo    🛠️  BUILDING SENTINEL (SERVER + CLIENT)
echo =======================================================================
echo.

call npm run build

if %errorlevel% equ 0 (
    echo.
    echo =======================================================================
    echo    ✅ BUILD SUCCESSFUL!
    echo =======================================================================
) else (
    echo.
    echo =======================================================================
    echo    ❌ BUILD FAILED!
    echo =======================================================================
)

pause
