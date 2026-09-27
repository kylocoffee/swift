@echo off
title SWIFT Core Banking - Electron Desktop App
echo Starting SWIFT Core Banking in Electron Desktop Mode...

where node >nul 2>nul
if %errorlevel% neq 0 (
    echo Node.js not detected. Launching via Windows Native Desktop Mode...
    start msedge.exe --app=https://ais-pre-cziemyevayr6fdj57tk5yg-387963826963.asia-southeast1.run.app --window-size=1280,850
    exit /b 0
)

cd /d "%~dp0..\electron" 2>nul || cd /d "%~dp0electron" 2>nul
if not exist "node_modules\electron" (
    echo Installing Electron runtime (first time only)...
    call npm install
)

call npm start
