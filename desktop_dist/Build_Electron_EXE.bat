@echo off
setlocal enabledelayedexpansion
title SWIFT Core Banking - Electron Native .EXE Builder

echo =========================================================================
echo    SWIFT CORE BANKING & GPI ENTERPRISE - ELECTRON .EXE COMPILER
echo    Builds a Native Windows Desktop .EXE that Auto-Updates Online
echo =========================================================================
echo.

where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is required to build with Electron.
    echo Please install Node.js from https://nodejs.org
    echo.
    echo In the meantime, you can run SWIFT_Core_Banking_Terminal.bat directly!
    pause
    exit /b 1
)

echo [1/3] Navigating to Electron project directory...
cd /d "%~dp0..\electron" 2>nul || cd /d "%~dp0electron" 2>nul || (
    echo Creating local electron workspace...
    mkdir electron 2>nul
    cd electron
)

echo [2/3] Installing Electron and Electron-Builder...
call npm install --save-dev electron electron-builder

echo [3/3] Compiling standalone Windows .EXE via Electron-Builder...
call npx --yes electron-builder --win portable --x64

if exist "dist\SWIFT_Core_Banking_Terminal_Portable.exe" (
    echo.
    echo =========================================================================
    echo  SUCCESS: Native Electron Executable has been generated!
    echo  File: electron\dist\SWIFT_Core_Banking_Terminal_Portable.exe
    echo  Status: Standalone Windows .EXE Ready. Always stays updated online!
    echo =========================================================================
    copy "dist\SWIFT_Core_Banking_Terminal_Portable.exe" "..\SWIFT_Core_Banking_Terminal.exe" >nul 2>nul
) else (
    echo.
    echo [INFO] Portable build finished. Please check the "dist" folder inside electron directory.
)

echo.
pause
