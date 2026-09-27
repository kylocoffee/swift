const { app, BrowserWindow, Menu, shell, ipcMain } = require('electron');
const path = require('path');

// Live Production Cloud URL (Auto-Updates in real-time)
const LIVE_APP_URL = 'https://ais-pre-cziemyevayr6fdj57tk5yg-387963826963.asia-southeast1.run.app';
const ADMIN_URL = 'https://ais-pre-cziemyevayr6fdj57tk5yg-387963826963.asia-southeast1.run.app/admin.html';

let mainWindow = null;

function createMainWindow() {
  mainWindow = new BrowserWindow({
    width: 1366,
    height: 860,
    minWidth: 1024,
    minHeight: 700,
    title: 'SWIFT Core Banking & GPI Enterprise Terminal',
    icon: path.join(__dirname, 'icon.png'),
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
            <h2>Gagal Menghubungkan ke CBS Host Online</h2>
            <p>Aplikasi tidak dapat terhubung ke server cloud SWIFT (${errorDescription}). Pastikan koneksi internet Anda aktif untuk memuat sistem dan pembaruan otomatis terbaru.</p>
            <button onclick="window.location.href='${LIVE_APP_URL}'">COBA HUBUNGKAN LAGI (RELOAD)</button>
          </div>
        </body>
      </html>
    `);
  });

  // Native Application Menu
  const template = [
    {
      label: 'Sistem CBS',
      submenu: [
        {
          label: 'Muat Ulang / Auto-Sync (Ctrl+R)',
          accelerator: 'CmdOrCtrl+R',
          click: () => mainWindow.loadURL(LIVE_APP_URL)
        },
        {
          label: 'Buka Portal Super Admin',
          accelerator: 'CmdOrCtrl+Shift+A',
          click: () => mainWindow.loadURL(ADMIN_URL)
        },
        { type: 'separator' },
        {
          label: 'Cetak Dokumen / Voucher (Ctrl+P)',
          accelerator: 'CmdOrCtrl+P',
          click: () => mainWindow.webContents.print()
        },
        { type: 'separator' },
        {
          label: 'Keluar',
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
      label: 'Tampilan',
      submenu: [
        { label: 'Zoom In', role: 'zoomIn' },
        { label: 'Zoom Out', role: 'zoomOut' },
        { label: 'Reset Zoom', role: 'resetZoom' },
        { type: 'separator' },
        { label: 'Toggle Fullscreen', role: 'togglefullscreen' },
        {
          label: 'Developer Tools (Debug)',
          accelerator: 'F12',
          click: () => mainWindow.webContents.toggleDevTools()
        }
      ]
    },
    {
      label: 'Bantuan',
      submenu: [
        {
          label: 'Buka di Browser Eksternal',
          click: () => shell.openExternal(LIVE_APP_URL)
        },
        {
          label: 'Tentang SWIFT Core Banking Terminal',
          click: () => {
            const { dialog } = require('electron');
            dialog.showMessageBox(mainWindow, {
              type: 'info',
              title: 'Tentang SWIFT Core Banking Terminal',
              message: 'SWIFT Core Banking & GPI Enterprise Terminal',
              detail: 'Versi: 1.0.0 (Electron Desktop Runtime)\nArsitektur: Live Cloud Auto-Update\nStandar: SWIFT FIN (MT103/MT202) & ISO 20022 (pacs.008/pacs.009)\nLisensi: Training & Operational Simulation'
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
  if (process.platform !== 'darwin') app.quit();
});
