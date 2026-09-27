# PANDUAN BUILD FILE .EXE STANDALONE DESKTOP (WINDOWS)
## SWIFT Core Banking Terminal — Windows Desktop Executable Build Manual

---

### 1. Ringkasan Arsitektur Desktop Standalone
Aplikasi **SWIFT Core Banking Terminal** dapat dibuild menjadi file eksekusi **.EXE mandiri (Standalone Desktop Application)** untuk sistem operasi Windows 10 dan Windows 11 (64-bit).

**Keunggulan Aplikasi Desktop:**
- **Zero Browser Dependencies**: Berjalan sebagai aplikasi native tanpa memerlukan URL browser eksternal.
- **Offline First Resilience**: Dilengkapi mesin penyimpanan lokal (Local Storage & IndexedDB Cache) yang tetap beroperasi penuh saat koneksi internet terputus.
- **Enterprise Tray & Native Menus**: Menyediakan shortcut keyboard profesional, print direct to POS/A4 thermal printer, dan export data aman.
- **Dual Mode Connectivity**: Mendukung sinkronisasi real-time ke Firebase Firestore pribadi saat online.

---

### 2. Prasyarat Sistem (Prerequisites)
Sebelum melakukan proses build, pastikan perangkat komputer Windows Anda telah terinstal:
1. **Node.js**: Versi LTS 18.x, 20.x, atau 22.x ([Download Node.js](https://nodejs.org/))
2. **NPM** (terpaket otomatis bersama Node.js) atau **Bun / Yarn**
3. **Git for Windows** (Opsional)
4. Ruang penyimpanan hard disk minimal **1 GB** untuk dependensi build.

---

### 3. Metode 1: One-Click Build Menggunakan File Batch (.BAT)

Di dalam paket rilis aplikasi telah disediakan skrip otomatisator untuk Windows:

1. Ekstrak seluruh folder project ke komputer Anda (misalnya di `C:\SWIFT_Core_Banking\`).
2. Cari file bernama **`BUILD_WINDOWS_EXE.bat`** di root folder.
3. Klik kanan pada file **`BUILD_WINDOWS_EXE.bat`**, lalu pilih **"Run as administrator"** (atau klik dua kali).
4. Skrip otomatis akan melakukan:
   - Verifikasi instalasi Node.js dan NPM.
   - Pemasangan modul Electron dan Electron Builder (`electron`, `electron-builder`).
   - Verifikasi integritas file HTML, CSS, JavaScript, dan Master Database.
   - Kompilasi biner Windows x64.
5. Setelah proses selesai dalam 1-3 menit, file output akan tersedia di direktori:
   ```
   desktop_dist/SWIFT_Core_Banking_Setup_2026.exe (Installer NSIS)
   desktop_dist/win-unpacked/SWIFT_Core_Banking.exe (Portable Standalone)
   ```

---

### 4. Metode 2: Build Manual Melalui Command Prompt (CMD / PowerShell)

Jika Anda ingin menjalankan proses build manual langkah demi langkah:

#### Langkah 1: Buka Command Prompt di Direktori Aplikasi
Buka CMD atau PowerShell, lalu navigasikan ke folder aplikasi:
```cmd
cd C:\path\ke\SWIFT_Core_Banking
```

#### Langkah 2: Install Dependensi Electron Builder
Jalankan perintah berikut untuk mengunduh package build:
```cmd
npm install --save-dev electron electron-builder
```

#### Langkah 3: Konfigurasi File `package.json`
Pastikan file `package.json` memiliki konfigurasi script build dan konfigurasi electron-builder berikut:

```json
{
  "name": "swift-core-banking-terminal",
  "version": "2026.1.0",
  "description": "SWIFT Core Banking Terminal - Enterprise Edition",
  "main": "electron/main.js",
  "scripts": {
    "start": "node server.js",
    "electron": "electron .",
    "build:win": "electron-builder --win nsis --x64",
    "build:portable": "electron-builder --win portable --x64"
  },
  "build": {
    "appId": "com.bankindonesia.swiftcorebanking",
    "productName": "SWIFT Core Banking Terminal",
    "directories": {
      "output": "desktop_dist"
    },
    "win": {
      "target": ["nsis", "portable"],
      "icon": "electron/icon.ico"
    },
    "nsis": {
      "oneClick": false,
      "allowToChangeInstallationDirectory": true,
      "createDesktopShortcut": true,
      "createStartMenuShortcut": true
    }
  }
}
```

#### Langkah 4: Jalankan Kompilasi Build Windows .EXE
Ketik perintah build berikut di terminal:
```cmd
npm run build:win
```

Tunggu proses pembuatan executable hingga muncul pesan **`Build completed successfully`**.

---

### 5. Cara Menjalankan & Menggunakan File .EXE di Windows

1. Buka folder **`desktop_dist/`**.
2. Anda akan menemukan file:
   - **`SWIFT_Core_Banking_Setup.exe`**: File installer untuk memasang aplikasi ke Start Menu dan Desktop shortcut.
   - **`SWIFT_Core_Banking_Portable.exe`**: Versi portabel yang dapat langsung dijalankan dari Flashdisk / USB drive tanpa instalasi.
3. Klik dua kali pada file `.exe` untuk membuka terminal perbankan.
4. **Login Default**:
   - **Super Admin**: PIN `9999`
   - **Head Treasury**: PIN `8888`
   - **Compliance Officer**: PIN `7777`
   - **Senior Operator**: PIN `1234`

---

### 6. Troubleshooting & Pertanyaan yang Sering Diajukan (FAQ)

**Q: Windows SmartScreen menampilkan peringatan "Windows protected your PC"?**
- *Penyebab*: Executable yang dibuild secara mandiri belum memiliki sertifikat digital komersial (EV Code Signing Certificate).
- *Solusi*: Klik **"More info"** lalu klik tombol **"Run anyway"**. Aplikasi 100% aman dan bebas malware.

**Q: Apakah data transaksi hilang jika aplikasi desktop ditutup?**
- *Jawaban*: Tidak. Data transaksi otomatis tersimpan di Local Storage / IndexedDB Windows dan otomatis tersinkronisasi ke Firebase Firestore pribadi saat terhubung ke internet.

**Q: Bagaimana cara menghubungkan aplikasi Desktop ke Firebase pribadi?**
- *Jawaban*: Buka menu **Super Admin** di dalam aplikasi Desktop, masuk ke Tab **Cloud Database & Firebase Sync**, lalu tempelkan JSON Firebase Anda dan klik Simpan.
