# PANDUAN LENGKAP CORE BANKING SYSTEM (CBS)
## Modul Pembelajaran Praktikum Perbankan & Jaringan SWIFT
### Disusun untuk: Mahasiswa, Dosen, Laboratorium Perbankan, dan Orang Awam

---

## DAFTAR ISI

1. [PENDAHULUAN & PENGERTIAN CORE BANKING SYSTEM (CBS)](#1-pendahuluan--pengertian-core-banking-system-cbs)
2. [LOGIKA DEBIT & KREDIT PERBANKAN (MEMBONGKAR KEGELISAHAN ORANG AWAM)](#2-logika-debit--kredit-perbankan)
3. [REKENING NOSTRO: RAHASIA TRANSFER VALUTA ASING KE LUAR NEGERI](#3-rekening-nostro)
4. [BAGAN AKUN PERBANKAN (CHART OF ACCOUNTS / COA)](#4-bagan-akun-perbankan-chart-of-accounts)
5. [NERACA SALDO (TRIAL BALANCE) & HUKUM KESEIMBANGAN AKUNTANSI](#5-neraca-saldo-trial-balance)
6. [REKENING KORAN (BANK STATEMENT) & REKONSILIASI](#6-rekening-koran-bank-statement)
7. [TUTUP BUKU HARIAN (END OF DAY / EOD BATCH PROCESSING)](#7-tutup-buku-harian-end-of-day)
8. [PRINSIP PENGENDALIAN INTERNAL: FOUR-EYES PRINCIPLE (MAKER-CHECKER)](#8-four-eyes-principle)
9. [PANDUAN PRAKTIKUM LANGKAH-DEMI-LANGKAH (STEP-BY-STEP SIMULATION)](#9-panduan-praktikum-langkah-demi-langkah)
10. [PORTAL SUPER ADMIN (KHUSUS INSTRUKTUR / DOSEN)](#10-portal-super-admin)
11. [GLOSARIUM ISTILAH PERBANKAN INTERNASIONAL](#11-glosarium-istilah-perbankan)

---

## 1. PENDAHULUAN & PENGERTIAN CORE BANKING SYSTEM (CBS)

### 1.1. Apa itu Core Banking System?
**Core Banking System (CBS)** adalah sistem teknologi informasi sentral yang menjadi otak, jantung, dan sistem saraf bagi operasional sebuah bank. 

Kata **CORE** merupakan singkatan dari:
> **C**entralized (Tersentralisasi)  
> **O**nline (Terhubung secara langsung)  
> **R**eal-time (Diproses seketika tanpa jeda waktu)  
> **E**lectronic (Berjalan secara digital dan terkomputerisasi)  

Sebelum ada CBS (era perbankan manual 1970–1980-an), setiap kantor cabang bank mencatat tabungan nasabah di buku besar kartu manual (*ledger card*). Nasabah cabang Sudirman tidak bisa mengambil uang di cabang Thamrin karena catatan tabungannya hanya tersimpan di cabang asal.

Dengan adanya **CBS**:
- Seluruh rekening nasabah di semua kantor cabang tersimpan di satu pusat data tunggal.
- Mutasi saldo dan pencatatan buku besar (*General Ledger*) terjadi dalam hitungan detik.
- Bank dapat terhubung secara aman dengan sistem kliring domestik (seperti **BI-RTGS**, **BI-FAST** di Indonesia) dan jaringan internasional (**SWIFT**).

### 1.2. Fungsi Pokok Core Banking System
1. **Master Rekening Nasabah (Customer Accounts)**: Menyimpan profil identitas nasabah (*CIF - Customer Information File*), status rekening, saldo berjalan, dan mata uang rekening (IDR, USD, EUR, SGD, JPY).
2. **Mesin Pembukuan Otomatis (General Ledger Engine)**: Menjaga integritas pembukuan berpasangan (*double-entry bookkeeping*). Setiap rupiah atau dollar yang berpindah wajib memiliki catatan Debit dan Kredit yang berpasangan dan seimbang.
3. **Manajemen Likuiditas Kas & Valas**: Memantau fisik uang kertas di lemari besi cabang (*Vault Cash*) dan saldo rekening nostro di bank koresponden luar negeri.
4. **Pemrosesan Pembayaran (Payment Hub)**: Mengonversi transaksi nasabah menjadi pesan sandi telex SWIFT (MT103/MT202) atau format standar global terbaru ISO 20022 (pacs.008/pacs.009).
5. **Tutup Buku Harian (End of Day / EOD)**: Mengunci buku kas harian, menghitung beban bunga tabungan harian, dan memajukan tanggal valuta pembukuan ke hari kerja berikutnya.

---

## 2. LOGIKA DEBIT & KREDIT PERBANKAN

### *Membongkar Pertanyaan Paling Umum: Mengapa Saat Kita Menabung, Bank Mengirim SMS "KREDIT (+)", Padahal Uang Kita Bertambah?*

Dalam akuntansi dasar pribadi atau bisnis umum:
- **Debit** = Uang masuk / Harta bertambah.
- **Kredit** = Uang keluar / Harta berkurang.

Namun, mengapa saat Anda menerima gaji di bank, notifikasi bertuliskan:  
`"Rekening Anda telah di-KREDIT sebesar Rp 10.000.000"`?

Jawabannya adalah: **Sudut Pandang Pembukuan Bank!**

### 2.1. Sudut Pandang Bank vs Sudut Pandang Nasabah
Di mata bank:
- **Uang yang Anda simpan di rekening BUKANLAH MILIK BANK.**
- Uang tersebut adalah **titipan nasabah** yang sewaktu-waktu bisa ditarik kembali oleh nasabah.
- Dalam struktur akuntansi, titipan pihak lain diklasifikasikan sebagai **KEWAJIBAN / UTANG (LIABILITAS)**.

Sesuai hukum dasar akuntansi internasional:
| Klasifikasi Akun | Jika Bertambah | Jika Berkurang |
|---|:---:|:---:|
| **Aset (Harta Bank)** | **DEBIT (Dr.)** | **KREDIT (Cr.)** |
| **Kewajiban / Liabilitas (Utang Bank)** | **KREDIT (Cr.)** | **DEBIT (Dr.)** |
| **Modal / Ekuitas Bank** | **KREDIT (Cr.)** | **DEBIT (Dr.)** |
| **Pendapatan Bank (Revenue)** | **KREDIT (Cr.)** | **DEBIT (Dr.)** |
| **Beban / Biaya Bank (Expense)** | **DEBIT (Dr.)** | **KREDIT (Cr.)** |

### 2.2. Pembuktian Nyata:
1. **Saat Nasabah Menyetor Uang Tunai ke Bank:**
   - Bank menerima uang fisik tunai &rarr; Kas Cabang (Aset Bank) bertambah &rarr; **DEBIT Kas Fisik (100101)**.
   - Bank berutang lebih banyak kepada nasabah &rarr; Saldo Rekening Giro Nasabah (Kewajiban Bank) bertambah &rarr; **KREDIT Giro Nasabah (210101)**.
   - *Itulah sebabnya rekening nasabah di-KREDIT saat uang bertambah!*

2. **Saat Nasabah Mentransfer Uang Keluar (Remittance Outward):**
   - Kewajiban bank kepada nasabah berkurang &rarr; **DEBIT Giro Nasabah (210101)**.
   - Cadangan uang bank kita di luar negeri berkurang &rarr; **KREDIT Rekening Nostro (110201)**.

---

## 3. REKENING NOSTRO: RAHASIA TRANSFER VALUTA ASING KE LUAR NEGERI

Pernahkah Anda bertanya:  
*"Jika PT INDO EXPORT TAMA di Jakarta mentransfer USD 50,000.00 ke SIEMENS AG di Frankfurt via SWIFT, bagaimana uang itu berpindah? Apakah bank menyewa pesawat untuk membawa koper berisi uang tunai?"*

Tentu tidak. Mekanisme perbankan internasional bekerja melalui **Rekening Nostro**.

### 3.1. Arti Kata Nostro & Vostro
- **Nostro** berasal dari bahasa Latin yang berarti *"Milik Kami"* (*Our account with you*).
  - Contoh: Rekening valuta USD milik **Bank Praktikum Nusantara** yang dibuka dan disimpan di **Citibank N.A. New York**.
  - Bagi bank kita, Nostro adalah **ASET / HARTA KITA DI LUAR NEGERI**.
- **Vostro** berasal dari bahasa Latin yang berarti *"Milik Anda"* (*Your account with us*).
  - Contoh: Rekening milik Citibank New York yang dibuka di kantor pusat Bank Praktikum Nusantara di Jakarta dalam mata uang Rupiah.

### 3.2. Simulasi Jurnal Berpasangan (Double-Entry) Transfer Outward SWIFT
Ketika Operator memasukkan instruksi transfer dan Head Treasury melakukan *Release* atas transaksi pengiriman **USD 50,000.00** dengan biaya telex SWIFT **USD 30.00**, Core Banking System membukukan jurnal otomatis berikut:

| No. Akun | Nama Akun | Posisi | Nominal | Keterangan Operasional |
|---|---|:---:|:---:|---|
| **210101** | Giro PT INDO EXPORT TAMA | **DEBIT (Dr.)** | **$ 50,030.00** | Rekening nasabah dipotong sejumlah pokok transfer ditambah biaya telex. |
| **110201** | Nostro USD di Citibank NY | **KREDIT (Cr.)** | **$ 50,000.00** | Cadangan valas bank kita di New York dikurangi untuk diserahkan ke bank penerima. |
| **410502** | Pendapatan Biaya Telex SWIFT | **KREDIT (Cr.)** | **$ 30.00** | Bank membukukan pendapatan non-bunga atas jasa pengiriman telex. |

**Keseimbangan Akuntansi:**
$$\text{Total Debit } (\$50,030.00) = \text{Total Kredit } (\$50,030.00) \quad \text{[SEIMBANG / BALANCED]}$$

---

## 4. BAGAN AKUN PERBANKAN (CHART OF ACCOUNTS / COA)

Dalam Core Banking System, seluruh transaksi dikelompokkan ke dalam kode rekening buku besar standar:

| Kode Akun | Nama Akun | Kategori | Posisi Normal | Deskripsi Singkat |
|---|---|:---:|:---:|---|
| `100101` | Kas Fisik Khasanah Cabang (Vault Cash) | Aset | Debit | Uang tunai fisik yang disimpan di brankas kantor cabang untuk setoran/penarikan teller. |
| `110101` | Giro Bank Indonesia (RTGS Settlement) | Aset | Debit | Saldo cadangan bank di bank sentral untuk penyelesaian kliring antarbank domestik. |
| `110201` | Nostro USD - Citibank N.A. New York | Aset | Debit | Rekening operasional utama valas Dollar AS di New York. |
| `110202` | Nostro SGD - DBS Bank Ltd Singapore | Aset | Debit | Rekening operasional valas Dollar Singapura untuk wilayah regional Asia Tenggara. |
| `110203` | Nostro USD - JPMorgan Chase Bank NY | Aset | Debit | Rekening cadangan likuiditas sekunder Dollar AS. |
| `110204` | Nostro EUR - Bank of America N.A. NY | Aset | Debit | Rekening penyelesaian valuta Euro (€ EUR). |
| `110205` | Nostro JPY - HSBC Tokyo/Singapore | Aset | Debit | Rekening operasional valuta Yen Jepang (¥ JPY). |
| `210101` | Giro Nasabah Korporasi (Demand Deposits) | Kewajiban | Kredit | Rekening giro simpanan pihak ketiga yang dapat ditarik sewaktu-waktu. |
| `210201` | Tabungan Valas Nasabah (FX Savings) | Kewajiban | Kredit | Simpanan tabungan valas milik perorangan atau badan usaha. |
| `310101` | Modal Disetor Bank (Paid-in Capital) | Ekuitas | Kredit | Modal awal dari pemegang saham yang menjamin solvabilitas dan kesehatan bank. |
| `410501` | Pendapatan Provisi Transfer Remittance | Pendapatan | Kredit | Komisi yang dipungut bank atas jasa transfer valas. |
| `410502` | Pendapatan Biaya Telex SWIFT Surcharge | Pendapatan | Kredit | Biaya komunikasi jaringan telex SWIFT yang dibebankan kepada nasabah pengirim. |
| `510101` | Beban Bunga Simpanan Nasabah | Beban | Debit | Biaya operasional bunga harian yang wajib dibayarkan bank kepada pemilik rekening. |
| `510201` | Beban Jaringan SWIFT Network Traffic | Beban | Debit | Tagihan biaya pengiriman pesan yang wajib disetor ke kantor pusat SWIFT di Belgia. |

---

## 5. NERACA SALDO (TRIAL BALANCE) & HUKUM KESEIMBANGAN AKUNTANSI

### 5.1. Prinsip Mutlak Double-Entry
Salah satu tugas paling krusial dari Core Banking System adalah menjamin bahwa persamaan akuntansi tidak pernah cacat:
$$\sum \text{Seluruh Mutasi Debit} = \sum \text{Seluruh Mutasi Kredit}$$

Jika terjadi selisih walaupun hanya $0.01 (satu sen) atau Rp 1,-, sistem perbankan dinyatakan **Out of Balance**. Dalam kondisi darurat ini, bank tidak diizinkan melakukan tutup buku sebelum selisihnya ditemukan dan diperbaiki (*reconciled*).

### 5.2. Mengakses Neraca Saldo di Simulator:
1. Masuk ke modul **CORE LEDGER**.
2. Klik tab **TRIAL BALANCE (NERACA SALDO)**.
3. Periksa badge status di bagian atas:
   - Jika tertulis `✓ DOUBLE-ENTRY EQUILIBRIUM VERIFIED (DR = CR)` dengan selisih `DIFF: $0.00`, pembukuan bank Anda berada dalam kondisi sempurna.
   - Tabel menampilkan saldo awal, mutasi debit periode berjalan, mutasi kredit periode berjalan, dan saldo akhir setiap akun.

---

## 6. REKENING KORAN (BANK STATEMENT) & REKONSILIASI

### 6.1. Apa itu Rekening Koran?
Rekening koran adalah laporan resmi yang diterbitkan bank kepada pemegang rekening (terutama perusahaan / korporasi) yang merinci:
- Saldo awal pembukaan periode.
- Seluruh mutasi kredit (dana masuk / setoran / penerimaan pembayaran).
- Seluruh mutasi debit (dana keluar / penarikan / biaya transfer).
- Saldo berjalan (*running balance*) setelah setiap transaksi terjadi.
- Saldo akhir buku.

Bagi bagian akuntansi korporasi, rekening koran digunakan untuk proses **Rekonsiliasi Bank**, yaitu mencocokkan buku kas internal perusahaan dengan catatan mutasi bank.

### 6.2. Mengakses & Mencetak Rekening Koran di Simulator:
1. Buka modul **CORE LEDGER** &rarr; tab **CUSTOMER ACCOUNTS**.
2. Pilih nasabah (misalnya `PT INDO EXPORT TAMA` atau `PT SINAR NIAGA GLOBAL`).
3. Klik tombol **📄 REKENING KORAN**.
4. Simulator akan menampilkan dokumen resmi rekening koran:
   - Ringkasan statistik (Saldo Awal, Total Kredit, Total Debit, Saldo Akhir).
   - Tabel kronologis setiap transaksi lengkap dengan tanggal, nomor referensi TRN/UETR, narasi pengiriman (:70:), mutasi debit/kredit, dan saldo berjalan.
   - **Tombol EXPORT CSV**: Untuk mengunduh data mutasi ke format spreadsheet Excel.
   - **Tombol PRINT STATEMENT**: Untuk mencetak dokumen fisik berstandar perbankan lengkap dengan tanda tangan *Head of Treasury & Operations*.

---

## 7. TUTUP BUKU HARIAN (END OF DAY / EOD BATCH PROCESSING)

Setiap sore setelah jam operasional kas tutup, seluruh bank di dunia menjalankan proses **End of Day (EOD)**.

### 7.1. Mengapa Harus Tutup Buku Setiap Hari?
1. **Mengunci Mutasi Hari Berjalan**: Memastikan tidak ada lagi transaksi yang dapat disusupkan secara ilegal pada tanggal hari ini.
2. **Menghitung Bunga Tabungan Harian (Daily Interest Accrual)**:
   Bank menghitung bunga simpanan nasabah menggunakan rumus bunga harian:
   $$\text{Bunga Harian} = \text{Saldo Efektif} \times \frac{\text{Suku Bunga p.a.}}{365}$$
   *Pada simulator ini, bunga simpanan standar dihitung 1.50% per tahun.*
3. **Membuat Jurnal Bunga Otomatis**:
   - **DEBIT Beban Bunga Simpanan (510101)**
   - **KREDIT Giro Nasabah (210101)**
4. **Validasi Neraca Saldo**: Menjalankan audit sistematis untuk memastikan seluruh debit sama dengan kredit.
5. **Roll Over Tanggal Bisnis**: Menggulirkan tanggal valuta sistem ke hari kerja berikutnya (misal dari 19 Sep 2026 ke 20 Sep 2026).

### 7.2. Cara Menjalankan EOD di Simulator:
1. Buka modul **CORE LEDGER**.
2. Di pojok kanan atas, klik tombol merah menyala: **⚡ EXECUTE END OF DAY (EOD)**.
3. Wizard penutupan buku akan menampilkan ringkasan kesiapan (memeriksa transaksi pending, menghitung nominal bunga yang akan dibayarkan, dan mengecek kesetimbangan debit-kredit).
4. Klik tombol **KONFIRMASI & JALANKAN PROSES EOD BATCH**.
5. Sistem akan memproses seluruh akun nasabah dalam hitungan detik, memposting jurnal bunga, dan memajukan tanggal perbankan secara resmi.

---

## 8. PRINSIP PENGENDALIAN INTERNAL: FOUR-EYES PRINCIPLE (MAKER-CHECKER)

Dalam industri perbankan, terdapat aturan ketat: **Tidak seorang pun boleh mengeksekusi transfer uang sendirian.** Ini dinamakan **Four-Eyes Principle** (*Prinsip Empat Mata*):

1. **OPERATOR (MAKER)**:
   - Bertugas menginput instruksi pembayaran dari surat perintah transfer nasabah.
   - Menentukan rekening pengirim, bank koresponden penerima, dan nominal.
   - Status instruksi yang dibuat oleh Maker adalah **Pending**. Maker TIDAK BISA merilis uang ke jaringan SWIFT.

2. **COMPLIANCE OFFICER**:
   - Melakukan skrining anti pencucian uang (*AML - Anti Money Laundering*) dan pendanaan terorisme (*CFT*).
   - Memeriksa apakah nama pengirim, penerima, atau narasi transfer terdapat di daftar sanksi PBB, OFAC, atau daftar terorisme.
   - Jika bersih, Compliance Officer menaikkan status menjadi **Validated**.

3. **HEAD TREASURY (CHECKER / AUTHORIZER)**:
   - Memeriksa kecukupan saldo nasabah dan cadangan likuiditas nostro bank.
   - Melakukan otorisasi akhir (*Approval / Release*).
   - Saat status diubah menjadi **Released**, sistem Core Banking secara instan mendebit rekening nasabah, mengkredit rekening Nostro luar negeri, dan menembakkan pesan telex ke jaringan SWIFT!

4. **AUDITOR**:
   - Bertugas memantau kepatuhan, meninjau jejak audit digital (*non-repudiation log*), dan merekonsiliasi jurnal akuntansi.

---

## 9. PANDUAN PRAKTIKUM LANGKAH-DEMI-LANGKAH (STEP-BY-STEP SIMULATION)

Berikut alur simulasi yang dapat dipraktikkan langsung di simulator:

```
[1. Login Token USB] ➔ [2. Cek Saldo Nasabah] ➔ [3. Setor Dana / Deposit] ➔ 
[4. Input Transfer SWIFT (Maker)] ➔ [5. Skrining Sanksi (Compliance)] ➔ 
[6. Rilis Otorisasi (Checker)] ➔ [7. Verifikasi Jurnal GL & Neraca Saldo] ➔ 
[8. Cetak Rekening Koran] ➔ [9. Eksekusi Tutup Buku Harian (EOD)]
```

### Langkah 1: Login Terminal & Verifikasi Token Fisik USB
1. Buka simulator pada peramban (*browser*).
2. Klik di mana saja pada layar pembuka bertuliskan *"SWIFT SECURE FINANCIAL MESSAGING TERMINAL"*.
3. Pada layar terminal akun, masukkan:
   - **Account ID**: `student01`
   - **Password**: `swiftlab`
   - **Terminal Security Key**: `LAB-2026`
   - Klik **SUBMIT CREDENTIALS**.
4. Pada layar USB Key PKI, klik tombol **CONNECT USB KEY**. Lampu indikator akan berubah menjadi hijau (*CONNECTED*).
5. Pilih operator: **iqbal**, masukkan password: `123456`, lalu klik **LOGIN**.
6. Anda sekarang berada di ruang kerja utama perbankan.

### Langkah 2: Memeriksa Saldo Nasabah
1. Klik menu **CORE LEDGER** pada bilah navigasi atas.
2. Di tab **CUSTOMER ACCOUNTS**, Anda dapat melihat 5 nasabah korporasi:
   - `PT INDO EXPORT TAMA`
   - `PT SINAR NIAGA GLOBAL`
   - `NUSANTARA ENERGY CORP`
   - `BATAVIA AGRO INDUSTRI`
   - `BORNEO MARITIME LOGISTICS`
3. Perhatikan saldo efektif rekening mereka.

### Langkah 3: Melakukan Setoran Tunai (+ DEPOSIT)
1. Jika saldo nasabah menipis, klik tombol **+ DEPOSIT** pada kartu nasabah (misalnya `PT INDO EXPORT TAMA`).
2. Masukkan nominal, contoh: `50000` (USD 50,000.00).
3. Masukkan keterangan: `Setoran kas tunai over-the-counter cabang`.
4. Klik **EXECUTE DEPOSIT**.
5. Saldo nasabah seketika bertambah $50,000.00. Jika Anda membuka tab **GENERAL LEDGER**, sistem otomatis membukukan:
   - Dr. 100101 (Kas Khasanah Cabang) $50,000.00
   - Cr. 210101 (Giro Nasabah) $50,000.00

### Langkah 4: Membuat Instruksi Transfer Valas SWIFT (Maker)
1. Klik menu **RECORD** di bilah navigasi atas.
2. Pilih format pesan: **pacs.008** (standar modern ISO 20022) atau **MT103** (format FIN legacy).
3. Pilih Bank Tujuan (Receiver BIC), misal: `CITIUS33XXX` (Citibank New York).
4. Pilih Mata Uang: `USD`, Jumlah: `25000`.
5. Pilih Rekening Pengirim (Debtor Account): `PT INDO EXPORT TAMA`.
6. Masukkan Narasi (:70:): `PAYMENT FOR MACHINERY SPAREPARTS INV-2026`.
7. Klik **SUBMIT TRANSACTION**. Transaksi berhasil tersimpan dengan status **Pending**. Saldo nasabah belum terpotong karena transaksi belum diotorisasi.

### Langkah 5: Skrining Kepatuhan AML/CFT (Compliance Officer)
1. Klik tombol **LOGOUT** di pojok kanan bawah.
2. Login kembali sebagai operator **salma** (Compliance Officer) dengan password `123456`.
3. Klik menu **SEARCH**. Transaksi yang baru dibuat akan muncul dengan status **Pending**.
4. Klik tombol menu titik tiga (**•••**) di kolom paling kanan transaksi.
5. Klik **UPDATE STATUS** &rarr; ubah menjadi **Validated**.
6. Transaksi kini telah lolos uji kepatuhan dan siap diotorisasi.

### Langkah 6: Otorisasi & Rilis Transfer (Checker / Head Treasury)
1. Klik tombol **LOGOUT**.
2. Login kembali sebagai operator **dhendy** (Head Treasury) dengan password `123456`.
3. Klik menu **SEARCH**.
4. Klik tombol menu titik tiga (**•••**) pada transaksi tersebut &rarr; klik **UPDATE STATUS** &rarr; ubah menjadi **Released**.
5. **Hasil Eksekusi:**
   - Core Banking System langsung memotong saldo rekening PT INDO EXPORT TAMA sebesar $25,030.00 ($25,000 transfer pokok + $30 biaya telex).
   - Cadangan rekening Nostro bank kita di Citibank New York dipotong $25,000.00.
   - Pendapatan telex $30.00 dibukukan.
   - Pesan SWIFT secara resmi dikirimkan ke jaringan internasional.

### Langkah 7: Memeriksa Keseimbangan Neraca Saldo
1. Buka menu **CORE LEDGER** &rarr; tab **TRIAL BALANCE (NERACA SALDO)**.
2. Periksa baris akun `110201` (Nostro USD) dan `210101` (Giro Nasabah).
3. Pastikan total mutasi debit dan kredit tetap sama persis tanpa ada selisih.

### Langkah 8: Memeriksa Rekening Koran & Ekspor Data
1. Buka tab **CUSTOMER ACCOUNTS**.
2. Klik tombol **📄 REKENING KORAN** pada `PT INDO EXPORT TAMA`.
3. Perhatikan mutasi pemotongan dana transfer dan biaya telex yang tercantum rapi lengkap dengan nomor referensi transaksi.
4. Klik **PRINT STATEMENT** untuk melihat format cetak resmi.

### Langkah 9: Menjalankan Tutup Buku Harian (End of Day)
1. Masih di halaman **CORE LEDGER**, klik tombol merah **⚡ EXECUTE END OF DAY (EOD)** di pojok kanan atas.
2. Tinjau statistik penutupan harian.
3. Klik **KONFIRMASI & JALANKAN PROSES EOD BATCH**.
4. Bunga harian otomatis dikreditkan ke seluruh nasabah dan tanggal buku bank maju ke hari berikutnya. Praktikum harian selesai dengan sempurna!

---

## 10. PORTAL SUPER ADMIN & MANAJEMEN KEAMANAN (KHUSUS INSTRUKTUR / DOSEN)

Untuk menjaga integritas laboratorium praktikum dan mencegah manipulasi konfigurasi oleh mahasiswa, hak akses administratif tertinggi (**Super Admin Control Center**) dipisahkan secara fisik ke dalam berkas mandiri: **`admin.html`**.

```
+-------------------------------------------------------------------------------------------------------------------+
|                                     PORTAL KONTROL PUSAT SUPER ADMIN (admin.html)                                 |
+---------------------+---------------------+---------------------+---------------------+---------------------------+
| 1. Lembaga & Pemilik| 2. Identitas Bank   | 3. Kebijakan Sistem | 4. Manajemen User   | 5. Keamanan, Sandi & Kunci|
+---------------------+---------------------+---------------------+---------------------+---------------------------+
| • Nama Universitas  | • Nama Bank         | • Four-Eyes Mandat  | • Tambah Operator   | • Akun ID Super Admin     |
| • Kepala Lab / Dosen| • Kode SWIFT BIC    | • Validasi Saldo    | • Edit / Promosi    | • Master Password Admin   |
| • Kontak & Telepon  | • Mata Uang Pokok   | • Skrining Sanksi   | • Ubah Username/PWD | • Master Authorization Key|
| • Alamat Resmi      | • Biaya Telex USD   | • GL Auto-Posting   | • Hapus Operator    | • Login Mahasiswa Stage 1 |
| • Nomor Lisensi OJK | • Jaringan Kliring  | • Default ISO/MT    | • Cari & Filter     | • PIN Token Hardware USB  |
| • Motto Aplikasi    | • Format Pesan      | • Bypass Intro Fast | • Multi-Role Hak    | • Kunci Kriptografi SWIFT |
+---------------------+---------------------+---------------------+---------------------+---------------------------+
|                                  6. Backup, Restore & Reset Pabrik Baseline Data                                  |
+-------------------------------------------------------------------------------------------------------------------+
```

### 10.1. Akses & Kredensial Masuk Super Admin
- **URL Khusus Super Admin**: Buka `http://localhost:3000/admin.html` (atau `/admin`).
- **Kredensial Bawaan Pabrik (Default)**:
  - **Admin Identifier / Username**: `superadmin`
  - **Master Key**: `MASTER-SWIFT-2026`
  - **Password**: `supersecret`

---

### 10.2. Fitur 1: Profil Lembaga & Pemilik Laboratorium (Tab 1)
Dosen atau pengelola laboratorium dapat menyesuaikan metadata institusi:
- **Nama Aplikasi & Pemilik**: Menampilkan nama fakultas/program studi Anda (misal: *Fakultas Ekonomi dan Bisnis Universitas Indonesia*).
- **Penanggung Jawab / Dosen**: Nama guru besar atau kepala laboratorium.
- **Alamat & Lisensi**: Alamat resmi yang otomatis tercetak pada lembar *Payment Advice Voucher* dan *Rekening Koran*.

---

### 10.3. Fitur 2: Identitas Bank & Routing SWIFT BIC Global (Tab 2)
Mengubah entitas bank yang disimulasikan di kelas:
- **Nama Bank Simulasi**: Ubah menjadi bank nasional atau internasional (misal: *BANK MANDIRI*, *BANK CENTRAL ASIA*, *JPMORGAN CHASE NY*).
- **Kode SWIFT BIC (ISO 9362)**: Wajib 8 atau 11 karakter (contoh: `BMRIIDJA`, `CICAIDJA`, `CITIUS33XXX`).
- **Mata Uang Dasar & Biaya Telex**: Menentukan mata uang pembukuan utama (`USD`, `IDR`, `EUR`, `SGD`, `JPY`) serta besaran biaya telex SWIFT ($0 – $100) yang didebit dari nasabah.

---

### 10.4. Fitur 3: Kebijakan & Aturan Main Simulasi (Tab 3)
- **Four-Eyes Principle (Maker-Checker Enforced)**: Wajib diaktifkan agar mahasiswa belajar pembagian tugas. Mahasiswa Maker dilarang merilis transaksi buatannya sendiri.
- **Pengecekan Saldo Ketat**: Mencegah transfer jika saldo rekening nasabah tidak mencukupi (menghindari overdraft tanpa izin).
- **Skrining Sanksi Otomatis**: Mengharuskan persetujuan dari petugas kepatuhan (*Compliance Officer*).
- **Buku Besar Otomatis**: Menjalankan pendebitan/pengkreditan otomatis saat transaksi disahkan (*Released*).

---

### 10.5. Fitur 4: Manajemen User & Operator Mahasiswa (Tab 4: Tambah, Edit, Promosi & Hapus)
Dosen dapat mengelola seluruh akun mahasiswa yang akan masuk ke simulator:

1. **Menambah Operator Baru (+ CREATE NEW OPERATOR USER)**:
   - Masukkan nama lengkap praktikan (contoh: `RIZKY ANANDA`).
   - Masukkan username login (contoh: `rizky`).
   - Masukkan password (default: `123456`).
   - Pilih peran awal:
     - `Operator (Maker)` - Pembuat draf transaksi nasabah.
     - `Head Treasury (Checker)` - Pejabat otorisasi dan pengelola kas nostro.
     - `Compliance Officer` - Petugas kepatuhan & anti pencucian uang.
     - `System Administrator` - Pengelola data master bank & nasabah.
     - `Auditor` - Pengawas jejak audit independen.
   - Klik **SAVE OPERATOR USER**. Akun baru langsung bisa digunakan untuk login di simulator mahasiswa.

2. **Mengubah Data / Menaikkan Jabatan Mahasiswa (EDIT / PROMOTE)**:
   - Klik tombol **EDIT / PROMOTE** pada baris operator.
   - Dosen dapat menaikkan jabatan mahasiswa (misalnya dari *Operator/Maker* menjadi *Head Treasury/Checker* untuk rotasi tugas praktikum).
   - Dosen dapat mereset atau mengganti password mahasiswa jika lupa kata sandi.

3. **Menghapus Operator (DELETE)**:
   - Klik tombol **DELETE** untuk menghapus akun mahasiswa yang sudah selesai praktikum atau salah dibuat.

---

### 10.6. Fitur 5: Manajemen Akun, Password, dan Kunci Aplikasi (Tab 5)
Super Admin memiliki kendali mutlak atas seluruh kunci pengamanan aplikasi:

```
+---------------------------------------------------------------------------------------------+
|                     PENGATURAN KREDENSIAL SUPER ADMIN, TERMINAL & KUNCI                     |
+---------------------------------------------------------------------------------------------+
| 1. Kredensial Super Admin Console (admin.html):                                             |
|    • Super Admin Username (Bisa diubah dari 'superadmin' ke nama dosen/admin baru)           |
|    • Master Authorization Key (Bisa diubah dari 'MASTER-SWIFT-2026' ke kunci baru)          |
|    • Master Password (Bisa diubah dari 'supersecret' ke kata sandi baru)                    |
|                                                                                             |
| 2. Kredensial Terminal Mahasiswa (Stage 1 & Stage 2):                                       |
|    • Terminal Account ID (Default: 'student01' -> bisa diubah misal: 'kelas-perbankan-a')   |
|    • Terminal Access Security Key (Default: 'LAB-2026' -> bisa diganti per sesi praktikum)  |
|    • Terminal Password (Default: 'swiftlab' -> bisa diganti kata sandi rahasia ujian)       |
|    • Hardware Token PIN (Default: '123456' -> PIN simulasi token USB PKI)                   |
|                                                                                             |
| 3. Kunci Kriptografi & API Gateway:                                                         |
|    • SWIFT GPI PKI Digital Signature Key [⚡ Tombol GENERATE BARU]                          |
|    • ISO 20022 XML Schema Validation Key [⚡ Tombol GENERATE BARU]                          |
|    • Core Banking API Gateway Bearer Token [⚡ Tombol GENERATE BARU]                        |
|                                                                                             |
| 4. Tombol Reset Default:                                                                    |
|    • 'RESET KREDENSIAL & KUNCI DEFAULT' untuk memulihkan seluruh kunci ke setelan awal      |
+---------------------------------------------------------------------------------------------+
```

#### Cara Mengubah Kredensial Super Admin & Mahasiswa:
1. Masuk ke halaman `admin.html`.
2. Buka tab **5. SECURITY, PASSWORDS & KEYS**.
3. Ketikkan Username, Key, atau Password baru pada kolom yang tersedia. Anda dapat menekan tombol **LIHAT** untuk memeriksa kata sandi yang diketik.
4. Klik **SAVE SYSTEM CONFIGURATION** di pojok kanan bawah.
5. Perubahan seketika berlaku untuk seluruh sesi praktikum berikutnya.

---

### 10.7. Fitur 6: Pencadangan, Pemulihan Data & Reset Pabrik (Tab 6)
- **Unduh Backup JSON (DOWNLOAD FULL BACKUP)**: Mengunduh snapshot lengkap seluruh basis data (konfigurasi lab, direktori BIC, saldo nasabah, saldo nostro, mutasi transaksi, akun user, dan buku besar). Sangat berguna bagi dosen untuk mengarsipkan tugas kelas atau membuat paket soal studi kasus.
- **Pulihkan Data (RESTORE BACKUP FILE)**: Mengunggah berkas JSON hasil praktikum sebelumnya untuk diperiksa/dinilai oleh asisten lab atau dosen pengampu.
- **Reset Pabrik (RESET TO FACTORY BASELINE)**: Mengembalikan laboratorium ke kondisi awal standar Bank Praktikum Nusantara (menghapus transaksi latihan mahasiswa dan memulihkan saldo modal awal).

---

### 10.8. Skenario Pembelajaran & Roleplay Kelas:
1. **Sesi 1 - Rotasi Peran (Roleplaying)**: Dosen membagi mahasiswa menjadi 3 kelompok dalam 1 meja: Kelompok A (*Maker*), Kelompok B (*Compliance*), Kelompok C (*Checker*). Transaksi harus diinput oleh Maker, disaring oleh Compliance, dan dirilis oleh Checker.
2. **Sesi 2 - Penanganan Likuiditas Nostro Menipis**: Dosen menyimulasikan rekening nostro di Citibank New York defisit. Mahasiswa bagian Treasury wajib melakukan *Liquidity Injection* sebelum transaksi valas bernilai besar dapat disahkan.
3. **Sesi 3 - Audit Rekonsiliasi & EOD**: Mahasiswa Auditor memeriksa seluruh mutasi rekening koran, memvalidasi Neraca Saldo di tab Trial Balance, dan mengeksekusi penutupan harian (*End of Day*).

---

## 11. GLOSARIUM ISTILAH PERBANKAN INTERNASIONAL

- **BIC (Bank Identifier Code) / SWIFT Code**: Kode unik 8 atau 11 karakter alfanumerik yang mengidentifikasi bank tertentu di seluruh dunia (contoh: `IDBKIDJAXXX`).
- **UETR (Unique End-to-end Transaction Reference)**: Kode pelacak unik 36-karakter standar UUID v4 (contoh: `c3a8b291-7d1e-4c8a-9a02-8f12a3b4c5d6`) yang memungkinkan pelacakan kiriman uang secara real-time dari bank pengirim hingga bank penerima.
- **ISO 20022**: Standar format pesan perbankan modern berbasis XML yang menggantikan format teks telex lama. Contoh: `pacs.008` untuk transfer nasabah, `pacs.009` untuk transfer antarbank.
- **MT (Message Type)**: Standar format telex SWIFT legacy. Contoh: `MT103` (Single Customer Credit Transfer), `MT202` (Financial Institution Transfer).
- **Nostro Account**: Rekening valas bank kita yang disimpan di bank koresponden luar negeri (*Aset Bank*).
- **Vostro Account**: Rekening bank asing yang dibuka di bank kita dalam mata uang domestik (*Kewajiban Bank*).
- **Trial Balance (Neraca Saldo)**: Lembar kerja akuntansi yang memuat daftar saldo seluruh akun buku besar untuk membuktikan bahwa total debit sama dengan total kredit.
- **End of Day (EOD)**: Rangkaian proses otomatis yang dijalankan setiap akhir hari kerja untuk menutup buku kas, membukukan bunga harian, dan menggulirkan tanggal valuta.
- **Four-Eyes Principle**: Prosedur kepatuhan internal di mana minimal dua pasang mata (Maker dan Checker) wajib terlibat dalam menyetujui transaksi keuangan.
- **AML / CFT**: *Anti-Money Laundering* (Pencegahan Pencucian Uang) dan *Combating the Financing of Terrorism* (Pencegahan Pendanaan Terorisme).

---
*Modul Praktikum Laboratorium Perbankan & Core Banking System — Bank Praktikum Nusantara.*
