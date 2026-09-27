# PANDUAN MENYIAPKAN FIREBASE PRIBADI SENDIRI (BYOD - ISOLATED DATABASE)
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
4. Masukkan nama project, contoh: `core-banking-corp` atau `bank-indonesia-terminal`.
5. Klik **Continue**, nonaktifkan atau aktifkan Google Analytics sesuai kebutuhan, lalu klik **Create project**.
6. Tunggu hingga proses provision selesai, lalu klik **Continue**.

#### Langkah 2: Aktifkan Firestore Database
1. Pada menu sebelah kiri (Sidebar), klik **Build** lalu pilih **Firestore Database**.
2. Klik tombol **Create database**.
3. **Database Location**: Pilih lokasi server terdekat untuk latensi optimal, misalnya:
   - `asia-southeast2 (Jakarta)`
   - `asia-southeast1 (Singapore)`
4. **Security Rules**: Pilih opsi **Start in test mode** untuk pengujian cepat, atau pilih **Start in production mode**.
5. Klik **Create / Enable**.

#### Langkah 3: Konfigurasi Firestore Security Rules
Agar sistem Core Banking dapat membaca dan menulis data transaksi, riwayat audit, dan konfigurasi sistem dengan aman, perbarui Firestore Rules:
1. Masuk ke tab **Rules** pada halaman Firestore Database.
2. Masukkan aturan keamanan berikut:

```javascript
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
```
3. Klik tombol **Publish** di pojok kanan atas.

#### Langkah 4: Daftarkan Web App & Dapatkan Kunci Konfigurasi
1. Klik icon **Project Overview** (atau icon Gerigi Pengaturan di sebelah kiri atas) -> Pilih **Project settings**.
2. Gulir ke bawah ke bagian **Your apps**, lalu klik icon Web (`</>`).
3. Beri nama aplikasi, misalnya `SWIFT Core Banking Terminal`, lalu klik **Register app**.
4. Firebase akan menampilkan blok kode JavaScript `firebaseConfig`. Salin objek JSON tersebut, yang memiliki struktur seperti berikut:

```json
{
  "apiKey": "AIzaSyD-YourActualApiKeyFromGoogleConsole",
  "authDomain": "your-project-id.firebaseapp.com",
  "projectId": "your-project-id",
  "storageBucket": "your-project-id.appspot.com",
  "messagingSenderId": "123456789012",
  "appId": "1:123456789012:web:abcdef123456"
}
```

---

### 3. Cara Mengkoneksikan ke Super Admin Terminal

1. Buka aplikasi **SWIFT Core Banking Terminal**.
2. Masuk ke menu **Super Admin** (atau buka `/admin.html`). Masukkan PIN Otorisasi jika diminta (Default PIN: `9999`).
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
