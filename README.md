# SWIFT Network Lab Simulator

Perbaikan dialog: inisialisasi selector formulir dan tombol tutup telah diperbaiki. DOWNLOAD memakai satu dialog aktif; X/CANCEL/Escape kembali ke UETR yang sama. X/BACK/Escape pada UETR kembali ke hasil pencarian. Tombol X tetap terlihat saat menggulir pesan panjang. Untuk transaksi pacs, dialog dimulai dengan salinan MT latihan agar data contoh yang belum lengkap tetap dapat diunduh; format asli tetap tersedia di dropdown.

Regresi browser (`tests/dialogs.browser.cjs` dengan Playwright dan @sparticuz/chromium): login iqbal, empat transaksi, isi file unduhan aktual, satu modal aktif, X/CANCEL/BACK/Escape, dan logout telah lolos pada lebar 1280 px dan 390 px. Versi aset diperbarui agar browser tidak memakai kode dialog lama.

## Message copy dan perbaikan kelengkapan

Alur: SEARCH → tombol titik tiga → VIEW → DOWNLOAD → MT103 → pilih output.
TXT kini berisi Message Header (Sender/Receiver beserta nama bank lokal, UETR, reference, local status) dan Message Text berlabel field. HTML menyediakan salinan rapi untuk disimpan/dicetak. PRINT / SAVE PDF memakai dialog cetak browser; pilih Save as PDF. Raw FIN terpisah dari salinan untuk dibaca.

Masuk sebagai `dhendy`, lalu EDIT untuk mengisi reference, nama/rekening/alamat ordering customer dan beneficiary, serta SHA/OUR/BEN. Untuk MT202 isi related reference. Data lama yang belum memiliki identitas nasabah tetap ditandai NOT PROVIDED; identitas tidak dibuat diam-diam. UETR UUID v4 ditambahkan sekali ke data lama tanpa mengganti search reference. UETR tetap sama saat edit dan download, dan dapat dicari.

Pemeriksaan dasar meliputi BIC, UUID, duplikasi reference/UETR, tanggal kalender, jumlah, karakter dan panjang field, nama/rekening nasabah, serta charges. Salinan draft boleh diunduh dengan penanda masalah; raw FIN dan ekspor XML ditahan saat pemeriksaan gagal. Status Validated/Released juga ditahan sampai data diperbaiki; perubahan status memakai UPDATE STATUS dengan catatan. Tidak ada lagi indikator sanctions/network yang menyatakan lolos tanpa pemeriksaan nyata.

Audit fitur menemukan dan memperbaiki: error JavaScript saat membuka UETR, data nasabah yang belum dapat diinput, indikator validasi statis, UETR contoh non-UUID, ekspor tanpa header, dan role sesi yang tidak dicocokkan kembali dengan operator. CSV diberi perlindungan awal terhadap formula spreadsheet. Audit ekspor diperbarui saat kembali ke tracking.

Batas lingkup: ini aplikasi praktikum lokal; role/password dan audit tersimpan di browser sehingga bukan keamanan produksi. Belum ada maker-checker lintas pengguna, ledger/nostro, jaringan SWIFT, sanctions screening eksternal, ACK/NAK asli, atau validasi XSD/CBPR+ resmi. Released adalah status lokal, bukan konfirmasi dana diterima. Salinan pesan dan raw FIN adalah bahan latihan. Ekspor pacs tetap template pendidikan, bukan konversi MT/MX tersertifikasi.

Referensi pembelajaran field: https://www.bnz.co.nz/assets/bnz/business-banking/help-and-support/SWIFT-MT103.pdf (panduan MT103 2021); UETR: https://www.swift.com/payments/what-unique-end-end-transaction-reference-uetr . Tampilan salinan pesan dapat berbeda antarbank.

Pemeriksaan kode: `node tests/messages.test.cjs`. Buka `index.html` dari paket ZIP untuk menjalankan aplikasi lokal. Semua file CSS dan JS harus tetap dalam folder yang sama.

Simulator edukasi front-end untuk praktikum mahasiswa perbankan. Seluruh data disimpan lokal di browser melalui `localStorage`; aplikasi tidak terhubung dengan SWIFT atau sistem perbankan nyata.

Demo access:

- Account: `student01`
- Password: `swiftlab`
- Key: `LAB-2026`
- Operator password: `123456`

Operator praktikum dan role:

| Operator / Username | Code | Role | Hak utama |
|---|---|---|---|
| `iqbal` | `OPS-01` | Operator | Search, view tracking UETR, download pesan latihan |
| `dhendy` | `HTR-01` | Head Treasury | Create/edit transaksi, update status, export, analysis, print |
| `salma` | `CMP-01` | Compliance Officer | Review, export, serta Validated/Rejected, analysis, print |
| `aditya` | `ADM-01` | System Administrator | CRUD BIC, delete transaksi, reset data, analysis, print |
| `ratna` | `AUD-01` | Auditor | Read-only search, directory, tracking, analysis, print |

Nama operator menentukan dropdown operator code/role secara otomatis. Username harus sama dengan nama operator dan semua operator memakai password praktikum `123456`.

Fitur: dua tahap login, simulasi USB key, role-based access control, CRUD transaksi sesuai kewenangan, status authorization, audit trail UETR, pencarian kombinasi UETR/tanggal/BIC, 20 data transaksi contoh, pelacakan UETR dinamis dengan message controls, download pesan latihan MT103/MT202/ISO 20022 pacs.008/pacs.009/JSON/CSV, CRUD BIC directory khusus administrator, cetak laporan, analisis ringkas, indikator loading pada seluruh tombol, navigasi Back bertingkat, tabel responsif berbentuk kartu pada layar sempit, dan WebMCP tools jika didukung browser. Antarmuka menggunakan tema monokrom dan tata letak yang mengikuti dokumen referensi SWIFT APP PROJECT.
