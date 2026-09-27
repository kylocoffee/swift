@echo off
:: SWIFT Core Banking & GPI Enterprise Terminal - Native Windows Desktop Launcher
:: Always connects to the live cloud system for automatic real-time updates.
title SWIFT Core Banking Terminal
set "APP_URL=https://ais-pre-cziemyevayr6fdj57tk5yg-387963826963.asia-southeast1.run.app"

start msedge.exe --app=%APP_URL% --window-size=1280,850 --enable-features=OverlayScrollbar
if %errorlevel% neq 0 (
    start chrome.exe --app=%APP_URL% --window-size=1280,850
)
if %errorlevel% neq 0 (
    start "" "%APP_URL%"
)
exit
