# DOKUMENTASI LENGKAP SWIFT CORE BANKING TERMINAL (ENTERPRISE EDITION 2026)
## Manual Operasional, Konfigurasi Bank Indonesia, Integrasi Firebase BYOD, & Build Desktop .EXE

---

### 1. Profil Sistem & Entitas Utama
- **Institusi Induk**: BANK INDONESIA (Central Bank)
- **SWIFT BIC Utama**: `INDOIDJAXXX` / `INDOIDJA`
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
   - Status awal transaksi: `Pending`.

2. **COMPLIANCE OFFICER / CHECKER 1 (PIN Default: 7777)**
   - Menjalankan skrining otomatis terhadap daftar sanksi internasional (OFAC, UN Sanctions, FATF, PEP).
   - Memverifikasi keabsahan dokumen pendukung (Faktur Komersial, Bill of Lading, LC).
   - Mengubah status transaksi dari `Pending` menjadi `Validated` atau `Rejected`.

3. **HEAD TREASURY / CHECKER 2 & APPROVER (PIN Default: 8888)**
   - Memverifikasi ketersediaan likuiditas pada Rekening Nostro/Vostro valuta asing (USD, EUR, SGD, JPY, GBP, SAR, AUD, IDR).
   - Menyetujui pelepasan dana final (*Fund Release*).
   - Menghasilkan pesan resmi SWIFT MT/MX dan nomor UETR UUIDv4 unik untuk pelacakan SWIFT GPI.
   - Mengubah status transaksi dari `Validated` menjadi `Released`.

4. **SUPER ADMIN (PIN Default: 9999)**
   - Mengatur konfigurasi identitas bank dan BIC sistem.
   - Mengatur koneksi database pribadi Firebase Firestore (BYOD).
   - Manajemen user operator dan reset master database.
