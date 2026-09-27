const { app, BrowserWindow, Menu, shell, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');

// Live Production Cloud URL (Auto-Updates in real-time)
const LIVE_APP_URL = 'https://ais-pre-cziemyevayr6fdj57tk5yg-387963826963.asia-southeast1.run.app';
const ADMIN_URL = 'https://ais-pre-cziemyevayr6fdj57tk5yg-387963826963.asia-southeast1.run.app/admin.html';

// Resolve custom icon if provided (.ico or .png)
function getAppIcon() {
  const icoCandidate = path.join(__dirname, 'icon.ico');
  const pngCandidate = path.join(__dirname, 'icon.png');
  if (fs.existsSync(icoCandidate)) return icoCandidate;
  if (fs.existsSync(pngCandidate)) return pngCandidate;
  return undefined;
}

let mainWindow = null;

function createMainWindow() {
  mainWindow = new BrowserWindow({
    width: 1366,
    height: 860,
    minWidth: 1024,
    minHeight: 700,
    title: 'SWIFT Core Banking Terminal',
    icon: getAppIcon(),
    backgroundColor: '#f6f4f1',
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: true,
      preload: path.join(__dirname, 'preload.js')
    }
  });

  mainWindow.maximize();

  // Load the live cloud URL for real-time auto-updates
  mainWindow.loadURL(LIVE_APP_URL);

  // Handle failure / offline gracefully
  mainWindow.webContents.on('did-fail-load', (event, errorCode, errorDescription) => {
    mainWindow.loadURL(`data:text/html;charset=utf-8,
      <html>
        <head>
          <title>SWIFT CBS Host Connection Error</title>
          <style>
            body { font-family: Arial, sans-serif; background: %23f6f4f1; color: %23111; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; text-align: center; }
            .card { background: white; border: 2px solid %23111; padding: 40px; max-width: 540px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
            h2 { margin: 0 0 12px; font-size: 24px; color: %23c92020; }
            p { font-size: 14px; color: %23555; line-height: 1.5; margin-bottom: 24px; }
            button { background: %23050505; color: white; border: none; padding: 12px 28px; font-size: 14px; font-weight: bold; border-radius: 999px; cursor: pointer; }
            button:hover { background: %23333; }
          </style>
        </head>
        <body>
          <div class="card">
            <h2>Connection Error to CBS Host</h2>
            <p>The terminal cannot connect to the SWIFT Host (${errorDescription}). Please check your network connection and reload.</p>
            <button onclick="window.location.href='${LIVE_APP_URL}'">RETRY CONNECTION</button>
          </div>
        </body>
      </html>
    `);
  });

  // Native Application Menu
  const template = [
    {
      label: 'System CBS',
      submenu: [
        {
          label: 'Reload / Auto-Sync (Ctrl+R)',
          accelerator: 'CmdOrCtrl+R',
          click: () => mainWindow.loadURL(LIVE_APP_URL)
        },
        {
          label: 'Open Super Admin Console',
          accelerator: 'CmdOrCtrl+Shift+A',
          click: () => mainWindow.loadURL(ADMIN_URL)
        },
        { type: 'separator' },
        {
          label: 'Print Document / Voucher (Ctrl+P)',
          accelerator: 'CmdOrCtrl+P',
          click: () => mainWindow.webContents.print()
        },
        { type: 'separator' },
        {
          label: 'Exit',
          accelerator: 'Alt+F4',
          click: () => app.quit()
        }
      ]
    },
    {
      label: 'Edit',
      submenu: [
        { label: 'Undo', role: 'undo' },
        { label: 'Redo', role: 'redo' },
        { type: 'separator' },
        { label: 'Cut', role: 'cut' },
        { label: 'Copy', role: 'copy' },
        { label: 'Paste', role: 'paste' },
        { label: 'Select All', role: 'selectAll' }
      ]
    },
    {
      label: 'View',
      submenu: [
        { label: 'Zoom In', role: 'zoomIn' },
        { label: 'Zoom Out', role: 'zoomOut' },
        { label: 'Reset Zoom', role: 'resetZoom' },
        { type: 'separator' },
        { label: 'Toggle Fullscreen', role: 'togglefullscreen' },
        {
          label: 'Developer Tools',
          accelerator: 'F12',
          click: () => mainWindow.webContents.toggleDevTools()
        }
      ]
    },
    {
      label: 'Help',
      submenu: [
        {
          label: 'Open in External Browser',
          click: () => shell.openExternal(LIVE_APP_URL)
        },
        {
          label: 'About SWIFT Core Banking Terminal',
          click: () => {
            const { dialog } = require('electron');
            dialog.showMessageBox(mainWindow, {
              type: 'info',
              title: 'About SWIFT Core Banking Terminal',
              message: 'SWIFT Core Banking & Financial Messaging Platform',
              detail: 'Version: 1.0.0 (Native Desktop Runtime)\nArchitecture: Continuous Cloud Host Replication\nStandards: SWIFT FIN (MT103/MT202) & ISO 20022 (pacs.008/pacs.009)\nEdition: Enterprise Production Terminal'
            });
          }
        }
      ]
    }
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(() => {
  createMainWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createMainWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
