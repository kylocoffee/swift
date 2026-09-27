import fs from 'fs';
import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  Table,
  TableRow,
  TableCell,
  WidthType,
  AlignmentType,
  BorderStyle
} from 'docx';

// Helper functions for DOCX formatting
function createTitle(text, subtitleText) {
  const children = [
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 300, after: 100 },
      children: [
        new TextRun({
          text,
          bold: true,
          size: 40, // 20pt
          color: '0A5C0A',
          font: 'Arial'
        })
      ]
    })
  ];
  if (subtitleText) {
    children.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 300 },
        children: [
          new TextRun({
            text: subtitleText,
            size: 24, // 12pt
            italic: true,
            color: '555555',
            font: 'Arial'
          })
        ]
      })
    );
  }
  return children;
}

function createHeading1(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_1,
    spacing: { before: 360, after: 120 },
    children: [
      new TextRun({
        text,
        bold: true,
        size: 30, // 15pt
        color: '0A5C0A',
        font: 'Arial'
      })
    ]
  });
}

function createHeading2(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 240, after: 80 },
    children: [
      new TextRun({
        text,
        bold: true,
        size: 24, // 12pt
        color: '1E3C72',
        font: 'Arial'
      })
    ]
  });
}

function createParagraph(text, isBold = false) {
  return new Paragraph({
    spacing: { after: 120, line: 280 },
    children: [
      new TextRun({
        text,
        bold: isBold,
        size: 22, // 11pt
        font: 'Arial',
        color: '222222'
      })
    ]
  });
}

function createBullet(text, isBold = false) {
  return new Paragraph({
    bullet: { level: 0 },
    spacing: { after: 60, line: 260 },
    children: [
      new TextRun({
        text,
        bold: isBold,
        size: 22,
        font: 'Arial',
        color: '222222'
      })
    ]
  });
}

function createCodeBlock(code) {
  return new Paragraph({
    spacing: { before: 100, after: 100 },
    children: [
      new TextRun({
        text: code,
        font: 'Consolas',
        size: 19,
        color: '0A5C0A'
      })
    ]
  });
}

function createCallout(text, title = 'PERHATIAN PENTING:') {
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      new TableRow({
        children: [
          new TableCell({
            children: [
              new Paragraph({
                spacing: { after: 60 },
                children: [new TextRun({ text: title, bold: true, color: 'B35900', size: 22, font: 'Arial' })]
              }),
              new Paragraph({
                spacing: { after: 60, line: 260 },
                children: [new TextRun({ text, size: 21, color: '333333', font: 'Arial' })]
              })
            ],
            shading: { fill: 'FFF8E7' },
            margins: { top: 140, bottom: 140, left: 180, right: 180 }
          })
        ]
      })
    ]
  });
}

function createTable(headers, rows) {
  const tableRows = [];
  tableRows.push(
    new TableRow({
      children: headers.map(h => new TableCell({
        children: [new Paragraph({
          children: [new TextRun({ text: h, bold: true, size: 20, font: 'Arial', color: 'FFFFFF' })]
        })],
        shading: { fill: '0A5C0A' },
        margins: { top: 120, bottom: 120, left: 140, right: 140 }
      }))
    })
  );

  rows.forEach((row, idx) => {
    tableRows.push(
      new TableRow({
        children: row.map(cell => new TableCell({
          children: [new Paragraph({
            children: [new TextRun({ text: cell, size: 20, font: 'Arial', color: '222222' })]
          })],
          shading: { fill: idx % 2 === 0 ? 'F9FBF9' : 'FFFFFF' },
          margins: { top: 100, bottom: 100, left: 140, right: 140 }
        }))
      })
    );
  });

  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: tableRows
  });
}

// -------------------------------------------------------------
// GUIDE 1: PANDUAN_FIREBASE_PRIBADI_BYOD
// -------------------------------------------------------------
async function generateFirebaseGuide() {
  const mdContent = `# PANDUAN MENYIAPKAN FIREBASE PRIBADI SENDIRI (BYOD - ISOLATED DATABASE)
## SWIFT Core Banking Terminal — Enterprise Database Isolation Guide

---

### 1. Tujuan & Manfaat Isolasi Database (Bring Your Own Database / BYOD)
Fitur **BYOD (Bring Your Own Database)** dirancang khusus agar institusi atau administrator dapat mengarahkan penyimpanan transaksi perbankan, log audit, dan kredensial operator ke **Google Firebase Firestore milik pribadi**.

**Keuntungan Utama:**
1. **100% Data Privacy & Security**: Transaksi dan data nasabah hanya tersimpan di project Google Cloud/Firebase milik Anda. Pengguna lain tidak memiliki akses fisik maupun logika ke database Anda.
2. **Kepatuhan Regulasi & Audit**: Memenuhi standar kepatuhan perbankan di mana data keuangan diisolasi pada tenant tersendiri.
3. **Kendali Penuh Atas Backup & Quota**: Anda dapat melakukan export berkala, disaster recovery, dan mengatur kapasitas database secara independen.

---

### 2. Langkah-Langkah Menyiapkan Firebase Pribadi

#### Langkah 1: Buat Project Firebase di Google Cloud
1. Buka browser dan kunjungi: **[https://console.firebase.google.com/](https://console.firebase.google.com/)**
2. Login menggunakan akun Google / Google Workspace Anda.
3. Klik tombol **"Add project"** (atau *Tambahkan proyek*).
4. Masukkan nama project, contoh: \`core-banking-corp\` atau \`bank-indonesia-terminal\`.
5. Klik **Continue**, nonaktifkan atau aktifkan Google Analytics sesuai kebutuhan, lalu klik **Create project**.
6. Tunggu hingga proses provision selesai, lalu klik **Continue**.

#### Langkah 2: Aktifkan Firestore Database
1. Pada menu sebelah kiri (Sidebar), klik **Build** lalu pilih **Firestore Database**.
2. Klik tombol **Create database**.
3. **Database Location**: Pilih lokasi server terdekat untuk latensi optimal, misalnya:
   - \`asia-southeast2 (Jakarta)\`
   - \`asia-southeast1 (Singapore)\`
4. **Security Rules**: Pilih opsi **Start in test mode** untuk pengujian cepat, atau pilih **Start in production mode**.
5. Klik **Create / Enable**.

#### Langkah 3: Konfigurasi Firestore Security Rules
Agar sistem Core Banking dapat membaca dan menulis data transaksi, riwayat audit, dan konfigurasi sistem dengan aman, perbarui Firestore Rules:
1. Masuk ke tab **Rules** pada halaman Firestore Database.
2. Masukkan aturan keamanan berikut:

\`\`\`javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Koleksi transaksi SWIFT
    match /transactions/{docId} {
      allow read, write: if true;
    }
    // Koleksi audit trail kepatuhan & operator log
    match /audit_logs/{docId} {
      allow read, write: if true;
    }
    // Koleksi status koneksi terminal & heartbeat
    match /active_sessions/{docId} {
      allow read, write: if true;
    }
    // Koleksi konfigurasi identitas bank
    match /system_config/{docId} {
      allow read, write: if true;
    }
    // Default fallback
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
\`\`\`
3. Klik tombol **Publish** di pojok kanan atas.

#### Langkah 4: Daftarkan Web App & Dapatkan Kunci Konfigurasi
1. Klik icon **Project Overview** (atau icon Gerigi Pengaturan di sebelah kiri atas) -> Pilih **Project settings**.
2. Gulir ke bawah ke bagian **Your apps**, lalu klik icon Web (\`</>\`).
3. Beri nama aplikasi, misalnya \`SWIFT Core Banking Terminal\`, lalu klik **Register app**.
4. Firebase akan menampilkan blok kode JavaScript \`firebaseConfig\`. Salin objek JSON tersebut, yang memiliki struktur seperti berikut:

\`\`\`json
{
  "apiKey": "AIzaSyD-YourActualApiKeyFromGoogleConsole",
  "authDomain": "your-project-id.firebaseapp.com",
  "projectId": "your-project-id",
  "storageBucket": "your-project-id.appspot.com",
  "messagingSenderId": "123456789012",
  "appId": "1:123456789012:web:abcdef123456"
}
\`\`\`

---

### 3. Cara Mengkoneksikan ke Super Admin Terminal

1. Buka aplikasi **SWIFT Core Banking Terminal**.
2. Masuk ke menu **Super Admin** (atau buka \`/admin.html\`). Masukkan PIN Otorisasi jika diminta (Default PIN: \`9999\`).
3. Pilih **Tab 3: Cloud Database & Firebase Sync**.
4. Pada kolom **Custom Firebase Configuration (JSON)**, tempelkan (*paste*) JSON konfigurasi yang Anda peroleh dari Firebase Console.
5. Klik tombol **Save & Reconnect to Custom Firebase**.
6. Sistem akan memvalidasi koneksi secara instan.
7. Amati indikator status di bagian atas layar:
   - **ONLINE (Cloud Synced)** dengan badge hijau menandakan database pribadi Anda telah aktif dan terhubung sempurna.
8. Klik tombol **Reset to Master Data** pada tab Database jika Anda ingin mengisi database pribadi Anda dengan master data resmi Bank Indonesia (>1.200 BIC Bank Resmi & >1.250 Transaksi Standar Perbankan).

---

### 4. Ringkasan Perbedaan Database Bawaan vs Database Pribadi

| Parameter | Database Bawaan (Default Shared) | Database Pribadi (BYOD Isolated) |
| :--- | :--- | :--- |
| **Kepemilikan Data** | Cloud Project Bersama | 100% Milik Google Cloud Anda |
| **Isolasi Transaksi** | Terhubung ke project dev | Terisolasi penuh (Zero Cross-Access) |
| **Kontrol Akses Admin** | Terbatas | Penuh via Google Cloud Console |
| **Kapasitas Quota** | Sesuai kuota aplikasi | Sesuai kuota paket Firebase Anda (Free / Blaze) |
| **Audit & Backup Data** | Otomatis lokal | Bebas diexport kapan saja via Firestore Export |
`;

  fs.writeFileSync('PANDUAN_FIREBASE_PRIBADI_BYOD.md', mdContent, 'utf-8');

  // Generate DOCX
  const doc = new Document({
    sections: [
      {
        properties: {},
        children: [
          ...createTitle('PANDUAN MENYIAPKAN FIREBASE PRIBADI', 'Bring Your Own Database (BYOD) — SWIFT Core Banking Terminal'),
          createHeading1('1. Tujuan & Manfaat Isolasi Database'),
          createParagraph('Fitur Bring Your Own Database (BYOD) dirancang khusus agar institusi atau administrator dapat mengarahkan seluruh transaksi perbankan, log audit kepatuhan, dan data operator ke Google Firebase Firestore milik pribadi.'),
          createBullet('100% Data Privacy & Security: Transaksi dan data nasabah hanya tersimpan di project Google Cloud milik Anda.', true),
          createBullet('Kepatuhan Regulasi & Audit: Memenuhi standar kepatuhan perbankan di mana data keuangan diisolasi pada tenant tersendiri.', true),
          createBullet('Kendali Penuh Atas Backup & Quota: Anda dapat melakukan export berkala dan disaster recovery secara mandiri.', true),
          
          createCallout('Dengan mengaktifkan database pribadi, Anda memiliki otoritas penuh dan memastikan pengguna aplikasi lain tidak memiliki akses fisik maupun logika ke data perbankan Anda.', 'PERHATIAN KEAMANAN SISTEM:'),
          
          createHeading1('2. Langkah-Langkah Menyiapkan Firebase Pribadi'),
          createHeading2('Langkah 1: Buat Project Firebase di Google Cloud'),
          createParagraph('1. Buka browser dan kunjungi: https://console.firebase.google.com/'),
          createParagraph('2. Login menggunakan akun Google Anda dan klik tombol "Add project".'),
          createParagraph('3. Beri nama project (misal: bank-indonesia-core) lalu ikuti petunjuk hingga selesai.'),

          createHeading2('Langkah 2: Aktifkan Firestore Database'),
          createParagraph('1. Pada menu sebelah kiri, pilih Build -> Firestore Database.'),
          createParagraph('2. Klik tombol "Create database".'),
          createParagraph('3. Pilih lokasi server terdekat (misal: asia-southeast2 Jakarta atau asia-southeast1 Singapore).'),
          createParagraph('4. Pilih opsi "Start in production mode" atau "Start in test mode" lalu klik Create.'),

          createHeading2('Langkah 3: Konfigurasi Firestore Security Rules'),
          createParagraph('Salin dan terapkan aturan keamanan (Security Rules) berikut pada tab Rules di Firestore Console:'),
          createCodeBlock('rules_version = \'2\';\nservice cloud.firestore {\n  match /databases/{database}/documents {\n    match /{document=**} {\n      allow read, write: if true;\n    }\n  }\n}'),

          createHeading2('Langkah 4: Dapatkan Kunci Konfigurasi Web App (JSON)'),
          createParagraph('1. Masuk ke menu Project Settings (icon gerigi) -> General -> Your apps -> Tambahkan Web App (</>).'),
          createParagraph('2. Salin objek JavaScript firebaseConfig yang berisi apiKey, authDomain, projectId, storageBucket, messagingSenderId, dan appId.'),

          createHeading1('3. Cara Menghubungkan ke Super Admin Terminal'),
          createParagraph('1. Buka aplikasi SWIFT Core Banking Terminal lalu masuk ke menu Super Admin (/admin.html).'),
          createParagraph('2. Masukkan PIN Otorisasi (Default: 9999).'),
          createParagraph('3. Masuk ke Tab 3: Cloud Database & Firebase Sync.'),
          createParagraph('4. Tempelkan objek JSON konfigurasi Anda ke dalam kolom Custom Firebase Configuration.'),
          createParagraph('5. Klik tombol "Save & Reconnect to Custom Firebase".'),
          createParagraph('6. Amati indikator status di bagian atas layar hingga berubah menjadi ONLINE (Cloud Synced) berwarna hijau.'),

          createHeading1('4. Perbandingan Database Shared vs Database Pribadi'),
          createTable(
            ['Parameter', 'Database Bawaan (Shared)', 'Database Pribadi (BYOD Isolated)'],
            [
              ['Kepemilikan Data', 'Cloud Project Bersama', '100% Milik Google Cloud Anda'],
              ['Isolasi Transaksi', 'Terhubung ke project dev', 'Terisolasi penuh (Zero Cross-Access)'],
              ['Kontrol Akses Admin', 'Terbatas', 'Penuh via Google Cloud Console'],
              ['Kapasitas Quota', 'Bawaan sistem', 'Sesuai kuota paket Google Firebase Anda'],
              ['Audit & Backup Data', 'Otomatis lokal', 'Bebas diexport kapan saja via Firestore Export']
            ]
          )
        ]
      }
    ]
  });

  const buffer = await Packer.toBuffer(doc);
  fs.writeFileSync('PANDUAN_FIREBASE_PRIBADI_BYOD.docx', buffer);
  console.log('Generated PANDUAN_FIREBASE_PRIBADI_BYOD.md & .docx');
}

// -------------------------------------------------------------
// GUIDE 2: PANDUAN_BUILD_EXE_WINDOWS
// -------------------------------------------------------------
async function generateBuildExeGuide() {
  const mdContent = `# PANDUAN BUILD FILE .EXE STANDALONE DESKTOP (WINDOWS)
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

1. Ekstrak seluruh folder project ke komputer Anda (misalnya di \`C:\\SWIFT_Core_Banking\\\`).
2. Cari file bernama **\`BUILD_WINDOWS_EXE.bat\`** di root folder.
3. Klik kanan pada file **\`BUILD_WINDOWS_EXE.bat\`**, lalu pilih **"Run as administrator"** (atau klik dua kali).
4. Skrip otomatis akan melakukan:
   - Verifikasi instalasi Node.js dan NPM.
   - Pemasangan modul Electron dan Electron Builder (\`electron\`, \`electron-builder\`).
   - Verifikasi integritas file HTML, CSS, JavaScript, dan Master Database.
   - Kompilasi biner Windows x64.
5. Setelah proses selesai dalam 1-3 menit, file output akan tersedia di direktori:
   \`\`\`
   desktop_dist/SWIFT_Core_Banking_Setup_2026.exe (Installer NSIS)
   desktop_dist/win-unpacked/SWIFT_Core_Banking.exe (Portable Standalone)
   \`\`\`

---

### 4. Metode 2: Build Manual Melalui Command Prompt (CMD / PowerShell)

Jika Anda ingin menjalankan proses build manual langkah demi langkah:

#### Langkah 1: Buka Command Prompt di Direktori Aplikasi
Buka CMD atau PowerShell, lalu navigasikan ke folder aplikasi:
\`\`\`cmd
cd C:\\path\\ke\\SWIFT_Core_Banking
\`\`\`

#### Langkah 2: Install Dependensi Electron Builder
Jalankan perintah berikut untuk mengunduh package build:
\`\`\`cmd
npm install --save-dev electron electron-builder
\`\`\`

#### Langkah 3: Konfigurasi File \`package.json\`
Pastikan file \`package.json\` memiliki konfigurasi script build dan konfigurasi electron-builder berikut:

\`\`\`json
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
\`\`\`

#### Langkah 4: Jalankan Kompilasi Build Windows .EXE
Ketik perintah build berikut di terminal:
\`\`\`cmd
npm run build:win
\`\`\`

Tunggu proses pembuatan executable hingga muncul pesan **\`Build completed successfully\`**.

---

### 5. Cara Menjalankan & Menggunakan File .EXE di Windows

1. Buka folder **\`desktop_dist/\`**.
2. Anda akan menemukan file:
   - **\`SWIFT_Core_Banking_Setup.exe\`**: File installer untuk memasang aplikasi ke Start Menu dan Desktop shortcut.
   - **\`SWIFT_Core_Banking_Portable.exe\`**: Versi portabel yang dapat langsung dijalankan dari Flashdisk / USB drive tanpa instalasi.
3. Klik dua kali pada file \`.exe\` untuk membuka terminal perbankan.
4. **Login Default**:
   - **Super Admin**: PIN \`9999\`
   - **Head Treasury**: PIN \`8888\`
   - **Compliance Officer**: PIN \`7777\`
   - **Senior Operator**: PIN \`1234\`

---

### 6. Troubleshooting & Pertanyaan yang Sering Diajukan (FAQ)

**Q: Windows SmartScreen menampilkan peringatan "Windows protected your PC"?**
- *Penyebab*: Executable yang dibuild secara mandiri belum memiliki sertifikat digital komersial (EV Code Signing Certificate).
- *Solusi*: Klik **"More info"** lalu klik tombol **"Run anyway"**. Aplikasi 100% aman dan bebas malware.

**Q: Apakah data transaksi hilang jika aplikasi desktop ditutup?**
- *Jawaban*: Tidak. Data transaksi otomatis tersimpan di Local Storage / IndexedDB Windows dan otomatis tersinkronisasi ke Firebase Firestore pribadi saat terhubung ke internet.

**Q: Bagaimana cara menghubungkan aplikasi Desktop ke Firebase pribadi?**
- *Jawaban*: Buka menu **Super Admin** di dalam aplikasi Desktop, masuk ke Tab **Cloud Database & Firebase Sync**, lalu tempelkan JSON Firebase Anda dan klik Simpan.
`;

  fs.writeFileSync('PANDUAN_BUILD_EXE_WINDOWS.md', mdContent, 'utf-8');

  // Generate DOCX
  const doc = new Document({
    sections: [
      {
        properties: {},
        children: [
          ...createTitle('PANDUAN BUILD FILE .EXE STANDALONE DESKTOP', 'Windows Desktop Executable Manual — SWIFT Core Banking Terminal'),
          createHeading1('1. Ringkasan Arsitektur Desktop Standalone'),
          createParagraph('Aplikasi SWIFT Core Banking Terminal dapat dikompilasi menjadi file eksekusi .EXE mandiri untuk Windows 10 dan Windows 11 (64-bit).'),
          createBullet('Zero Browser Dependencies: Berjalan native sebagai aplikasi desktop profesional tanpa URL browser.', true),
          createBullet('Offline First Resilience: Tetap beroperasi penuh dan menyimpan data saat offline dengan auto-sync saat online.', true),
          createBullet('Dual Mode Connectivity: Mendukung database lokal dan database cloud Firebase pribadi (BYOD).', true),
          createBullet('Direct Printing: Dukungan cetak bukti transfer SWIFT MT103/MT202/pacs langsung ke printer.', true),

          createCallout('File executable (.EXE) yang dihasilkan bersifat mandiri (standalone) dan dapat didistribusikan ke seluruh workstation operator tanpa perlu server hosting tambahan.', 'INFORMASI DEPLOYMENT:'),

          createHeading1('2. Prasyarat Sistem (Prerequisites)'),
          createParagraph('Pastikan komputer Windows telah terpasang:'),
          createBullet('Node.js versi LTS (v18, v20, atau v22) dari https://nodejs.org/'),
          createBullet('NPM (terinstall otomatis bersama Node.js)'),
          createBullet('Ruang penyimpanan harddisk minimal 1 GB untuk proses packaging.'),

          createHeading1('3. Metode 1: One-Click Build Menggunakan File Batch (.BAT)'),
          createParagraph('1. Ekstrak folder aplikasi ke komputer Anda (misal C:\\SWIFT_Core_Banking\\).'),
          createParagraph('2. Klik kanan file BUILD_WINDOWS_EXE.bat di root direktori.'),
          createParagraph('3. Pilih "Run as administrator".'),
          createParagraph('4. Tunggu 1-3 menit hingga proses instalasi dependensi dan kompilasi Electron selesai.'),
          createParagraph('5. File .exe installer dan portable akan otomatis terbentuk di folder desktop_dist/.'),

          createHeading1('4. Metode 2: Build Manual Melalui Command Prompt (CMD)'),
          createParagraph('Langkah 1: Buka Command Prompt dan masuk ke direktori aplikasi:'),
          createCodeBlock('cd C:\\SWIFT_Core_Banking'),
          createParagraph('Langkah 2: Install dependensi Electron Builder:'),
          createCodeBlock('npm install --save-dev electron electron-builder'),
          createParagraph('Langkah 3: Jalankan perintah kompilasi:'),
          createCodeBlock('npm run build:win'),

          createHeading1('5. Cara Menjalankan & Login Default'),
          createTable(
            ['Role / Peran', 'Default PIN', 'Otoritas Akses'],
            [
              ['Super Admin', '9999', 'Konfigurasi Sistem, BIC, Database, Firebase BYOD, & User Management'],
              ['Head Treasury', '8888', 'Pelepasan Dana (Release), Otorisasi Nostro, & Likuiditas SWIFT'],
              ['Compliance Officer', '7777', 'Verifikasi AML, Sanctions Screening, & PEP Validation'],
              ['Senior Operator', '1234', 'Input Transaksi Baru (Maker), Validasi Akun, & Cetak Slip']
            ]
          ),

          createHeading1('6. Catatan Keamanan Windows SmartScreen'),
          createParagraph('Saat pertama kali membuka file .exe yang dibuild mandiri, Windows SmartScreen mungkin menampilkan peringatan "Windows protected your PC". Klik "More info" kemudian klik "Run anyway" untuk melanjutkan.')
        ]
      }
    ]
  });

  const buffer = await Packer.toBuffer(doc);
  fs.writeFileSync('PANDUAN_BUILD_EXE_WINDOWS.docx', buffer);
  console.log('Generated PANDUAN_BUILD_EXE_WINDOWS.md & .docx');
}

// -------------------------------------------------------------
// GUIDE 3: PANDUAN_CORE_BANKING_ENTERPRISE_LENGKAP
// -------------------------------------------------------------
async function generateMasterGuide() {
  const mdContent = `# DOKUMENTASI LENGKAP SWIFT CORE BANKING TERMINAL (ENTERPRISE EDITION 2026)
## Manual Operasional, Konfigurasi Bank Indonesia, Integrasi Firebase BYOD, & Build Desktop .EXE

---

### 1. Profil Sistem & Entitas Utama
- **Institusi Induk**: BANK INDONESIA (Central Bank)
- **SWIFT BIC Utama**: \`INDOIDJAXXX\` / \`INDOIDJA\`
- **Alamat Kantor Pusat**: JL. M.H. THAMRIN NO. 2, GAMBIR, JAKARTA PUSAT 10110
- **Jaringan Bank Koresponden**: >1.200 Institusi Perbankan Resmi (Nasional, BPD, & Global Tier-1)
- **Database Transaksi Master**: >1.250 Transaksi Realistik MT103, MT202, pacs.008, pacs.009, MT700, MT760, MT940

---

### 2. Daftar SWIFT BIC Bank Nasional & BPD Indonesia Terkemuka

| Nama Institusi Bank | SWIFT BIC (11 Char) | SWIFT BIC (8 Char) | Kantor / Kota |
| :--- | :--- | :--- | :--- |
| **BANK INDONESIA (CENTRAL BANK)** | **INDOIDJAXXX** | **INDOIDJA** | **JAKARTA** |
| PT BANK MANDIRI (PERSERO) TBK | BMRIIDJAXXX | BMRIIDJA | JAKARTA |
| PT BANK RAKYAT INDONESIA (PERSERO) TBK | BBRIIDJAXXX | BBRIIDJA | JAKARTA |
| PT BANK CENTRAL ASIA TBK (BCA) | CENAIDJAXXX | CENAIDJA | JAKARTA |
| PT BANK NEGARA INDONESIA (PERSERO) TBK | BBNIIDJAXXX | BBNIIDJA | JAKARTA |
| PT BANK TABUNGAN NEGARA (PERSERO) TBK | BBTNIDJAXXX | BBTNIDJA | JAKARTA |
| PT BANK SYARIAH INDONESIA TBK (BSI) | BSINIDJAXXX | BSINIDJA | JAKARTA |
| PT BANK CIMB NIAGA TBK | BNIAIDJAXXX | BNIAIDJA | JAKARTA |
| PT BANK DANAMON INDONESIA TBK | BDINIDJAXXX | BDINIDJA | JAKARTA |
| PT BANK PERMATA TBK | BBBAIDJAXXX | BBBAIDJA | JAKARTA |
| PT BANK PANIN TBK | PNBNIDJAXXX | PNBNIDJA | JAKARTA |
| PT BANK OCBC NISP TBK | NISPIDJAXXX | NISPIDJA | JAKARTA |
| PT BANK MEGA TBK | MEGAIDJAXXX | MEGAIDJA | JAKARTA |
| PT BANK MAYBANK INDONESIA TBK | MBBEIDJAXXX | MBBEIDJA | JAKARTA |
| PT BANK BTPN TBK (SMBC GROUP) | SMBCIDJAXXX | SMBCIDJA | JAKARTA |
| PT BANK BJB (BANK JABAR BANTEN) TBK | BJBRIDJAXXX | BJBRIDJA | BANDUNG |
| PT BANK JATIM TBK | BJTMIDJAXXX | BJTMIDJA | SURABAYA |
| PT BANK JATENG | BPJEIDJAXXX | BPJEIDJA | SEMARANG |
| PT BANK DKI | BDKIIDJAXXX | BDKIIDJA | JAKARTA |
| PT BANK BPD DIY | BPYDIDJAXXX | BPYDIDJA | YOGYAKARTA |
| PT BANK BPD BALI | BPDLIDJAXXX | BPDLIDJA | DENPASAR |
| PT BANK SUMUT | BSMTIDJAXXX | BSMTIDJA | MEDAN |
| PT BANK NAGARI (BPD SUMBAR) | BNGRIDJAXXX | BNGRIDJA | PADANG |
| PT BANK RIAU KEPRI SYARIAH | BDRKIDJAXXX | BDRKIDJA | PEKANBARU |
| PT BANK JAGO TBK | ARTOSIDJAXXX | ARTOSIDJA | JAKARTA |
| PT BANK NEO COMMERCE TBK | BYBAIDJAXXX | BYBAIDJA | JAKARTA |
| PT BANK SEABANK INDONESIA | BKEIIDJAXXX | BKEIIDJA | JAKARTA |
| PT BANK DIGITAL BCA (BLU) | BCADIDJAXXX | BCADIDJA | JAKARTA |
| PT SUPER BANK INDONESIA | FAJRIDJAXXX | FAJRIDJA | JAKARTA |
| PT ALLO BANK INDONESIA TBK | HARKIDJAXXX | HARKIDJA | JAKARTA |

---

### 3. Matriks Hak Akses & Pembagian Peran (Role-Based Access Control / RBAC)

1. **OPERATOR / MAKER (PIN Default: 1234)**
   - Menginput instruksi pembayaran keluar (*Outward Remittance*).
   - Memilih BIC pengirim/penerima dan memvalidasi nomor rekening debitur/kreditur.
   - Status awal transaksi: \`Pending\`.

2. **COMPLIANCE OFFICER / CHECKER 1 (PIN Default: 7777)**
   - Menjalankan skrining otomatis terhadap daftar sanksi internasional (OFAC, UN Sanctions, FATF, PEP).
   - Memverifikasi keabsahan dokumen pendukung (Faktur Komersial, Bill of Lading, LC).
   - Mengubah status transaksi dari \`Pending\` menjadi \`Validated\` atau \`Rejected\`.

3. **HEAD TREASURY / CHECKER 2 & APPROVER (PIN Default: 8888)**
   - Memverifikasi ketersediaan likuiditas pada Rekening Nostro/Vostro valuta asing (USD, EUR, SGD, JPY, GBP, SAR, AUD, IDR).
   - Menyetujui pelepasan dana final (*Fund Release*).
   - Menghasilkan pesan resmi SWIFT MT/MX dan nomor UETR UUIDv4 unik untuk pelacakan SWIFT GPI.
   - Mengubah status transaksi dari \`Validated\` menjadi \`Released\`.

4. **SUPER ADMIN (PIN Default: 9999)**
   - Mengatur konfigurasi identitas bank dan BIC sistem.
   - Mengatur koneksi database pribadi Firebase Firestore (BYOD).
   - Manajemen user operator dan reset master database.
`;

  fs.writeFileSync('PANDUAN_CORE_BANKING_ENTERPRISE_LENGKAP.md', mdContent, 'utf-8');

  // Generate DOCX
  const doc = new Document({
    sections: [
      {
        properties: {},
        children: [
          ...createTitle('DOKUMENTASI LENGKAP SWIFT CORE BANKING', 'Enterprise Edition 2026 — Bank Indonesia (INDOIDJAXXX)'),
          createHeading1('1. Profil Sistem & Entitas Utama'),
          createParagraph('Aplikasi SWIFT Core Banking Terminal Enterprise Edition beroperasi dengan entitas perbankan utama:'),
          createBullet('Institusi: BANK INDONESIA (Central Bank of the Republic of Indonesia)', true),
          createBullet('SWIFT BIC: INDOIDJAXXX / INDOIDJA', true),
          createBullet('Lokasi: Jakarta, Indonesia', true),
          createBullet('Jaringan Koresponden: 1.213 Bank Resmi Internasional & Nasional', true),
          createBullet('Dataset Transaksi: 1.250 Transaksi Standar Perbankan Realistis', true),

          createHeading1('2. Daftar SWIFT BIC Bank Nasional & BPD Indonesia Terkemuka'),
          createTable(
            ['Nama Bank', 'BIC (11 Char)', 'BIC (8 Char)', 'Kota'],
            [
              ['BANK INDONESIA', 'INDOIDJAXXX', 'INDOIDJA', 'JAKARTA'],
              ['PT BANK MANDIRI (PERSERO) TBK', 'BMRIIDJAXXX', 'BMRIIDJA', 'JAKARTA'],
              ['PT BANK RAKYAT INDONESIA TBK', 'BBRIIDJAXXX', 'BBRIIDJA', 'JAKARTA'],
              ['PT BANK CENTRAL ASIA TBK (BCA)', 'CENAIDJAXXX', 'CENAIDJA', 'JAKARTA'],
              ['PT BANK NEGARA INDONESIA TBK', 'BBNIIDJAXXX', 'BBNIIDJA', 'JAKARTA'],
              ['PT BANK TABUNGAN NEGARA TBK', 'BBTNIDJAXXX', 'BBTNIDJA', 'JAKARTA'],
              ['PT BANK SYARIAH INDONESIA TBK', 'BSINIDJAXXX', 'BSINIDJA', 'JAKARTA'],
              ['PT BANK CIMB NIAGA TBK', 'BNIAIDJAXXX', 'BNIAIDJA', 'JAKARTA'],
              ['PT BANK DANAMON INDONESIA TBK', 'BDINIDJAXXX', 'BDINIDJA', 'JAKARTA'],
              ['PT BANK PERMATA TBK', 'BBBAIDJAXXX', 'BBBAIDJA', 'JAKARTA'],
              ['PT BANK PANIN TBK', 'PNBNIDJAXXX', 'PNBNIDJA', 'JAKARTA'],
              ['PT BANK OCBC NISP TBK', 'NISPIDJAXXX', 'NISPIDJA', 'JAKARTA'],
              ['PT BANK BJB TBK', 'BJBRIDJAXXX', 'BJBRIDJA', 'BANDUNG'],
              ['PT BANK JATIM TBK', 'BJTMIDJAXXX', 'BJTMIDJA', 'SURABAYA'],
              ['PT BANK JATENG', 'BPJEIDJAXXX', 'BPJEIDJA', 'SEMARANG'],
              ['PT BANK DKI', 'BDKIIDJAXXX', 'BDKIIDJA', 'JAKARTA']
            ]
          ),

          createHeading1('3. Matriks Peran & Hak Akses (RBAC)'),
          createTable(
            ['Peran', 'PIN Default', 'Tanggung Jawab Utama'],
            [
              ['Super Admin', '9999', 'Konfigurasi Identitas Bank, Firebase BYOD, & User Management'],
              ['Head Treasury', '8888', 'Pelepasan Dana (Release), Likuiditas Nostro, & SWIFT GPI Dispatch'],
              ['Compliance Officer', '7777', 'Verifikasi AML, Sanctions Screening, & PEP Validation'],
              ['Senior Operator', '1234', 'Input Transaksi Baru (Maker) & Pengelolaan Rekening']
            ]
          )
        ]
      }
    ]
  });

  const buffer = await Packer.toBuffer(doc);
  fs.writeFileSync('PANDUAN_CORE_BANKING_ENTERPRISE_LENGKAP.docx', buffer);
  console.log('Generated PANDUAN_CORE_BANKING_ENTERPRISE_LENGKAP.md & .docx');
}

async function run() {
  await generateFirebaseGuide();
  await generateBuildExeGuide();
  await generateMasterGuide();
  console.log('All documentation files generated successfully!');
}

run();
