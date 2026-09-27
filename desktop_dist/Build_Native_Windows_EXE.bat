@echo off
setlocal enabledelayedexpansion
title SWIFT Core Banking - Native Windows EXE Builder

echo =========================================================================
echo    SWIFT CORE BANKING & GPI ENTERPRISE - WINDOWS .EXE COMPILER
echo    Compiles a Standalone Native Executable that Auto-Updates Online
echo =========================================================================
echo.

set "TARGET_URL=https://ais-pre-cziemyevayr6fdj57tk5yg-387963826963.asia-southeast1.run.app"
set "OUT_EXE=SWIFT_Core_Banking_Terminal.exe"
set "CSC_PATH=C:\Windows\Microsoft.NET\Framework64\v4.0.30319\csc.exe"

if not exist "%CSC_PATH%" (
    set "CSC_PATH=C:\Windows\Microsoft.NET\Framework\v4.0.30319\csc.exe"
)

echo [1/3] Generating C# Native Desktop Host Source Code...
(
echo using System;
echo using System.Diagnostics;
echo using System.Drawing;
echo using System.Windows.Forms;
echo using System.Runtime.InteropServices;
echo.
echo namespace SwiftCoreBanking {
echo     public class Program {
echo         [DllImport("user32.dll"^) ]
echo         private static extern bool SetProcessDPIAware(^);
echo.
echo         [STAThread]
echo         public static void Main(string[] args^) {
echo             try { SetProcessDPIAware(^); } catch { }
echo             Application.EnableVisualStyles(^);
echo             Application.SetCompatibleTextRenderingDefault(false^);
echo.
echo             string liveUrl = "%TARGET_URL%";
echo             try {
echo                 ProcessStartInfo psi = new ProcessStartInfo {
echo                     FileName = "msedge.exe",
echo                     Arguments = "--app=" + liveUrl + " --window-size=1280,850 --enable-features=OverlayScrollbar",
echo                     UseShellExecute = true
echo                 };
echo                 Process.Start(psi^);
echo                 return;
echo             } catch { }
echo             try {
echo                 ProcessStartInfo psi = new ProcessStartInfo {
echo                     FileName = "chrome.exe",
echo                     Arguments = "--app=" + liveUrl + " --window-size=1280,850",
echo                     UseShellExecute = true
echo                 };
echo                 Process.Start(psi^);
echo                 return;
echo             } catch { }
echo             Process.Start(liveUrl^);
echo         }
echo     }
echo }
) > _SwiftHost.cs

echo [2/3] Compiling standalone executable via Windows .NET Compiler...
set "ICON_ARG="
if exist "icon.ico" (
    set "ICON_ARG=/win32icon:icon.ico"
    echo [INFO] Custom icon detected: icon.ico
) else if exist "%~dp0icon.ico" (
    set "ICON_ARG=/win32icon:\"%~dp0icon.ico\""
    echo [INFO] Custom icon detected: icon.ico
)

if exist "%CSC_PATH%" (
    "%CSC_PATH%" /target:winexe /out:"%OUT_EXE%" /platform:anycpu %ICON_ARG% _SwiftHost.cs
    if exist "%OUT_EXE%" (
        echo [3/3] SUCCESS: %OUT_EXE% has been created successfully!
        del _SwiftHost.cs
        echo.
        echo =========================================================================
        echo  Executable: %OUT_EXE%
        echo  Target URL: %TARGET_URL%
        echo  Status: Standalone Windows .EXE Ready. Always stays updated online!
        echo =========================================================================
        pause
        exit /b 0
    )
)

echo [FALLBACK] Creating direct Windows App Launcher...
del _SwiftHost.cs
(
echo @echo off
echo start msedge.exe --app=%TARGET_URL% --window-size=1280,850
) > SWIFT_Core_Banking_Terminal.bat
echo Created SWIFT_Core_Banking_Terminal.bat as alternative launcher.
pause
