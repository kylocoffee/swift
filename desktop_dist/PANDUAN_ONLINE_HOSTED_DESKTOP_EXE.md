# PANDUAN LENGKAP: METODE ONLINE HOSTED DESKTOP (.EXE)
### *SWIFT Core Banking & GPI Enterprise Terminal*
**Distribusi 1 Kali Saja — Otomatis Terupdate Selamanya Tanpa Perlu Kirim Ulang File .EXE**

---

## 1. Konsep & Keunggulan Metode "Online Hosted Desktop"

Metode **Online Hosted Desktop** adalah arsitektur paling efisien dan praktis dalam implementasi perangkat lunak perbankan dan laboratorium simulasi modern:

- **Cukup Kirim File `.exe` Satu Kali Saja**: Anda hanya perlu membagikan file `SWIFT_Core_Banking_Terminal.exe` sekali saja ke seluruh mahasiswa, peserta pelatihan, atau staf operator (misal via Google Drive, WhatsApp Group, Flashdisk, atau Shared Folder Lab).
- **Otomatis Terupdate Secara Real-Time**: Ketika instruktur/developer melakukan pembaruan di server cloud (misal penambahan mata uang baru, perbaikan validasi SWIFT MT103/ISO 20022, pembaruan direktori BIC, atau update tampilan):
  - Seluruh pengguna yang membuka file `.exe` mereka akan **langsung otomatis menikmati pembaruan terbaru detik itu juga**.
  - Pengguna **TIDAK PERLU** mengunduh file `.exe` baru atau melakukan instalasi ulang.
- **Tampilan Native Standalone yang Terisolasi**: Aplikasi berjalan di jendela desktop khusus tanpa gangguan bilah alamat URL, tombol navigasi peramban, atau ekstensi pihak ketiga.
- **Dukungan Menu & Tombol Pintas Native**:
  - `Ctrl + R` : Memuat ulang & sinkronisasi instan dengan Central CBS Host.
  - `Ctrl + P` : Mencetak bukti transfer (*Payment Advice*) atau voucher mutasi buku besar GL.
  - `F11` : Mode Layar Penuh (*Full-Screen Bank Terminal Mode*).
  - `F12` : Developer Tools / Debug Console.

---

## 2. Cara Membuat / Meng-compile File `.EXE` (Untuk Dosen / Administrator)

Terdapat 2 opsi praktis untuk membuat file executable yang siap dibagikan:

### Opsi A: Menggunakan Electron Builder (Paling Populer & Lengkap)
1. Pastikan komputer Anda memiliki **Node.js** (unduh gratis di [nodejs.org](https://nodejs.org) jika belum ada).
2. Unduh atau buka berkas **`Build_Electron_EXE.bat`** (tersedia di folder `desktop_dist/` atau tombol di menu aplikasi).
3. Klik ganda pada **`Build_Electron_EXE.bat`**.
4. Script akan otomatis mengunduh komponen Electron dan meng-compile file:
   $$\text{Lokasi Hasil: } \texttt{electron/dist/SWIFT\_Core\_Banking\_Terminal\_Portable.exe}$$
5. File `.exe` ini bersifat *Portable* (tanpa perlu install) dan siap Anda bagikan ke semua pengguna.

### Opsi B: Menggunakan Native C# Compiler Bawaan Windows (Tanpa Perlu Pasang Node.js)
1. Buka folder `desktop_dist/` lalu klik ganda pada **`Build_Native_Windows_EXE.bat`**.
2. Script ini memanfaatkan compiler resmi bawaan Microsoft Windows (`csc.exe`).
3. Dalam 2 detik, file **`SWIFT_Core_Banking_Terminal.exe`** langsung tercipta di folder yang sama.
4. File `.exe` ini berukuran sangat kecil (< 50 KB) dan siap langsung dibagikan.

---

## 3. Cara Membagikan File `.EXE` Kepada Pengguna / Mahasiswa

Setelah file `SWIFT_Core_Banking_Terminal.exe` (atau `SWIFT_Core_Banking_Terminal_Portable.exe`) selesai dibuat:

1. **Upload ke Cloud Storage / Bagikan Langsung**:
   - Unggah file `.exe` ke Google Drive / OneDrive kampus / Shared Folder Lab Komputer, atau kirimkan langsung via Flashdisk / Email / WhatsApp Web.
2. **Instruksi untuk Pengguna / Mahasiswa**:
   - Minta pengguna untuk menyimpan file `.exe` tersebut di folder mana saja (misal di folder **Desktop** atau **Documents**).
   - Pengguna dapat membuat shortcut atau menyematkan (*Pin to Taskbar / Pin to Start Menu*) agar mudah diakses kapan saja.

---

## 4. Cara Penggunaan Bagi Pengguna Akhir (Operator / Mahasiswa)

Bagi pengguna akhir, langkah penggunaannya sangat sederhana:

1. **Buka Aplikasi**:
   - Cukup **klik ganda (Double-Click)** pada file `SWIFT_Core_Banking_Terminal.exe`.
2. **Koneksi Otomatis**:
   - Aplikasi akan langsung membuka jendela desktop resmi *SWIFT Core Banking System* dan secara otomatis menghubungkan terminal ke Central Cloud Host.
   - Status sinkronisasi di kanan atas akan menampilkan:  
     `🟢 CBS HOST & SWIFT: SYNCHRONIZED`
3. **Login & Operasional Transaksi**:
   - Pilih peran pengguna (Maker, Checker, Compliance, Auditor, atau Super Admin).
   - Masukkan PIN / Token Keamanan Otorisasi.
   - Lakukan perekaman pesan pembayaran SWIFT MT103/MT202 atau ISO 20022 pacs.008, otorisasi transaksi *4-Eyes Principle*, pencetakan voucher *Payment Advice*, serta inspeksi buku besar General Ledger (Nostro & Customer Balance).
4. **Menerima Update Otomatis**:
   - Jika admin/dosen mengumumkan ada pembaruan transaksi baru atau update fitur, pengguna cukup menekan tombol `Ctrl + R` (atau menutup dan membuka kembali file `.exe`).
   - Sistem langsung otomatis diperbarui tanpa perlu mengunduh apa pun lagi!

---

## 5. Pertanyaan yang Sering Diajukan (FAQ)

- **Q: Apakah pengguna harus menginstal Node.js di laptop mereka?**  
  *A: Tidak perlu.* File `.exe` yang sudah di-compile bersifat *standalone* dan dapat langsung dijalankan di semua komputer Windows (Windows 10, Windows 11) tanpa syarat software tambahan.
- **Q: Apa yang terjadi jika koneksi internet terputus saat aplikasi dibuka?**  
  *A: Aplikasi dilengkapi sistem fail-safe cache offline buffer.* Layar akan memberi tahu status koneksi dan menyediakan tombol *Reconnect* otomatis begitu internet kembali terhubung.
- **Q: Apakah data transaksi yang dimasukkan satu pengguna akan tersimpan di cloud?**  
  *A: Ya.* Seluruh mutasi rekening nasabah, pool likuiditas Nostro, jurnal akuntansi GL, dan audit log transaksi tersinkronisasi secara real-time antar workstation melalui Central Cloud Host Firestore.
