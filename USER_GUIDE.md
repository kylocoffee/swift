# SWIFT Network & Core Banking Laboratory Simulator
## Comprehensive User Guide & Standard Operating Procedures (SOP)
**Designed for Banking, Finance, and International Trade Practicum Students**

---

## 1. Executive Overview & Educational Purpose

The **SWIFT Network & Core Banking Laboratory Simulator** is an educational platform architected to simulate real-world international cross-border payment operations, interbank messaging, correspondent banking relationships, and double-entry core banking accounting.

Students and trainees interact with the exact interfaces, operational controls, and security workflows utilized across global corporate banks:
- **Four-Eyes Principle (Maker-Checker Oversight)**: Strict separation of duties preventing fraud and errors by requiring different operators to draft and authorize transactions.
- **Correspondent Banking & Nostro/Vostro Accounting**: Mechanics of moving money internationally across foreign correspondent accounts without physical currency crossing borders.
- **SWIFT Messaging Standards**: Parallel support for legacy **SWIFT FIN (MT103, MT202)** and contemporary **ISO 20022 XML (`pacs.008`, `pacs.009`)**.
- **Unique End-to-End Transaction Reference (UETR)**: Real-time tracking of payments across the global financial value chain using RFC 4122 UUID v4 identifiers.
- **Core Banking General Ledger (GL)**: Instantaneous, automated double-entry journal postings upon transaction release.
- **Anti-Money Laundering (AML) & Sanctions Screening**: Pre-validation of ordering and beneficiary parties against international sanction watchlists.

---

## 2. System Access & Multi-Stage Authentication

To replicate Tier-1 commercial banking terminal security, access requires a three-tier authentication procedure.

```
[ Stage 1: Terminal Login ] ➔ [ Stage 2: Hardware Token / USB PKI ] ➔ [ Stage 3: Operator Role Select ]
```

### Stage 1: Terminal Login
Upon opening the application, the terminal authentication screen is presented:
- **Account**: `student01`
- **Password**: `swiftlab`
- **Access Key**: `LAB-2026`
- Click **LOGIN TO SWIFT NETWORK** to proceed.

### Stage 2: Hardware Security Token (PKI / USB HSM Simulation)
Commercial banking systems require physical cryptographic hardware tokens (e.g., Gemalto or YubiKey HSM tokens) for non-repudiation:
1. Click **CONNECT USB TOKEN** to simulate inserting the cryptographic device.
2. Observe the hardware state transition: `TOKEN CONNECTED (READY)`.
3. Input the Token PIN: `123456`.
4. Click **VALIDATE &amp; PROCEED**.

### Stage 3: Operator Identity & Role-Based Access Control (RBAC)
Enter the operator's operational profile and password (`123456`):

| Username | Full Name | Operator Code | Assigned Role | Functional Scope |
|---|---|---|---|---|
| `iqbal` | M. Iqbal | `OPS-01` | **Operator (Maker)** | Input/Draft new payment instructions, track UETR, print payment advice. |
| `dhendy` | Dhendy Pratama | `HTR-01` | **Head Treasury (Checker)** | Authorize payments, change status to **Released**, execute Core Banking GL postings, export messages. |
| `salma` | Salma Nur | `CMP-01` | **Compliance Officer** | AML/Sanctions screening, approve to **Validated** or set to **Rejected**. |
| `aditya` | Aditya Wardhana | `ADM-01` | **System Administrator** | Master data CRUD, BIC directory management, system reset, transaction deletion. |
| `ratna` | Ratna Sari | `AUD-01` | **Internal Auditor** | Read-only inspection of transactions, UETR audit trails, and General Ledger journals. |

---

## 3. Core Banking & SWIFT Lab Modules

### 3.1. Navigation Bar Overview
Once authenticated, the main navigation bar provides access to the six core operational modules:
1. **MATRIX**: Real-time access control matrix and overview of role privileges.
2. **SEARCH**: Search, filter, inspect, edit, track, and manage all payment instructions.
3. **NEW TRANSACTION**: (Maker Only) Form to record outward customer or bank transfers.
4. **CORE LEDGER**: Customer account balances, Nostro correspondent balances, and General Ledger double-entry journals.
5. **BIC DIRECTORY**: Master ISO 9362 Business Identifier Codes directory.
6. **PAYMENT ADVICE**: Official bank debit/credit advice vouchers with dual signatures.
7. **ANALYSIS**: Currency volumes, transaction status breakdowns, and administrative reset.

---

## 4. Standard Operating Procedures (SOP) & Workflows

### 4.1. Workflow A: Outward Customer Remittance (End-to-End Maker-Checker)

```
[ Operator (Maker) ]          [ Compliance Officer ]          [ Head Treasury (Checker) ]
  • Inputs Pacs.008/MT103       • Reviews Sanctions Lists       • Validates Balance & Nostro
  • Customer Balance Verified   • Sets status to 'Validated'    • Authorizes & Sets 'Released'
  • Status: 'Pending'                                           • Core Banking Posts GL Debits/Credits
```

#### Step 1: Drafting the Instruction (Maker - `iqbal`)
1. Log in as `iqbal` with role **Operator**.
2. Click **NEW TRANSACTION** in the top navigation bar.
3. Fill out the mandatory transaction parameters:
   - **Message Standard**: Select `pacs.008` (ISO 20022 Customer Transfer) or `MT103` (FIN Customer Transfer).
   - **Sender BIC**: `IDBKIDJA` (Bank Praktikum Nusantara, Jakarta).
   - **Receiver BIC**: Select destination bank (e.g., `CITIUS33XXX` for Citibank New York).
   - **Currency**: `USD`.
   - **Nominal Amount**: e.g., `50000.00`.
   - **Value Date**: Set settlement value date (defaults to current date).
   - **Ordering Customer (Debtor)**: Select corporate client (e.g., `PT INDO EXPORT TAMA`, Acc: `1001-8821-001`).
   - **Beneficiary Customer (Creditor)**: Input recipient name (e.g., `SIEMENS AG`) and IBAN/Account (e.g., `DE89370400440532013000`).
   - **Remittance Info / Field 70**: Narrative description of the economic background (e.g., `INVOICE INV-2026-0988 FOR INDUSTRIAL MACHINERY`).
   - **Charge Code**: Select `SHA` (Shared), `OUR` (Debtor pays all), or `BEN` (Creditor pays all).
4. Click **SUBMIT TRANSACTION**.
   - *Core Banking Balance Check*: The system automatically verifies whether the selected customer possesses sufficient effective balance. If balance is deficient, an alert is prompted.
5. The transaction is recorded under **Pending** status with an automatically minted **UETR (UUID v4)** and **TRN**.

#### Step 2: Compliance & Sanctions Screening (Compliance - `salma`)
1. Log in as `salma` with role **Compliance Officer**.
2. Navigate to **SEARCH**. Locate the pending transaction using the TRN or customer name.
3. Click the action menu (**•••**) on the transaction row and select **UPDATE STATUS**.
4. Verify the ordering party, beneficiary, and destination country against anti-money laundering and sanctions criteria.
5. Select **Validated** in the New Status dropdown, input an audit verification note (e.g., `Screened against OFAC and UN lists; no adverse hits`), and click **SAVE STATUS**.
6. The status transitions to **Validated**.

#### Step 3: Treasury Authorization & Execution (Checker - `dhendy`)
1. Log in as `dhendy` with role **Head Treasury**.
2. Navigate to **SEARCH**, locate the **Validated** transaction, click **•••**, and select **UPDATE STATUS**.
3. Choose **Released** from the dropdown, enter an authorization note (e.g., `Authorized for SWIFT network release and debit execution`), and click **SAVE STATUS**.
4. **Automatic Core Banking Settlement**: Upon changing status to `Released`, the application's accounting engine automatically triggers:
   - **Debiting** customer account `1001-8821-001` for $50,000.00 (+ transmission fee if applicable).
   - **Crediting** Nostro account `NOSTRO-USD-CITI` at Citibank New York.
   - Creating synchronous, balanced **Double-Entry General Ledger (GL)** journal entries.
5. The transaction is now permanently finalized and released to the simulated SWIFT Network.

---

### 4.2. Workflow B: Core Banking System (CBS) & General Ledger Management

Navigate to **CORE LEDGER** in the top navigation bar to access the bank's core accounting, liquidity management, and balance sheet validation tools across five specialized tabs:

#### Tab 1: Customer Accounts Register & Rekening Koran (Bank Statement)
- **Customer Register**: View corporate and retail customer demand deposit (Giro) and foreign currency savings accounts. Each account card displays account number, currency, customer legal name, account category, available effective balance, and registered address.
- **📄 REKENING KORAN (Official Bank Statement)**:
  - Click **📄 REKENING KORAN** on any customer card to open the comprehensive, chronologically sorted bank statement.
  - Displays: Opening balance, total credit mutations (+), total debit mutations (-), and final closing balance.
  - Lists every individual transaction leg: Timestamp, reference/TRN, narrative description, debit/credit amount, and running balance.
  - **Export CSV**: Download the statement as a `.csv` spreadsheet for cash flow analysis and bank reconciliation practice.
  - **Print Statement**: Generate a printer-ready official bank statement with institutional headers, official notes, and Head of Treasury signature blocks.
- **+ DEPOSIT**: Click **+ DEPOSIT** on any account card to simulate an over-the-counter cash deposit or inbound clearing credit. This immediately credits the customer's balance and records a balanced debit to Branch Cash Vault (`100101`).
- **Open New Customer Account**: Authorized operators can click **OPEN NEW CUSTOMER ACCOUNT** to register a new client with bespoke currency, initial balance, and CIF address details.

#### Tab 2: Bank Nostro Accounts (Overseas Correspondent Liquidity)
- Monitor Bank Praktikum Nusantara's foreign currency liquidity pools held across international correspondent banks:
  - `NOS-USD-01`: Citibank N.A., New York ($ USD)
  - `NOS-SGD-01`: DBS Bank Ltd, Singapore (S$ SGD)
  - `NOS-USD-02`: JPMorgan Chase Bank, New York ($ USD)
  - `NOS-EUR-01`: Bank of America N.A., New York (€ EUR)
  - `NOS-JPY-01`: The Hongkong and Shanghai Banking Corp, Tokyo/Singapore (¥ JPY)
- **Inject Liquidity**: Treasury managers can inject reserve capital into Nostro accounts to fund large outbound remittance batches or interbank settlement obligations.

#### Tab 3: General Ledger (GL) & Financial Reporting
- Inspect the immutable double-entry journal log.
- Every transaction displays: Reference number, timestamp, Transaction ID / UETR, Debit Account (Dr.), Credit Account (Cr.), Currency, Amount, Audit Remarks, and Authorizing Officer.
- **Export Journal (CSV)**: Click **EXPORT JOURNAL (CSV)** to generate spreadsheet reports for accounting, auditing, and regulatory compliance reporting.

#### Tab 4: Chart of Accounts (COA) & Trial Balance (Neraca Saldo)
- **Double-Entry Equilibrium Verification**: Verifies that the fundamental accounting equation holds true across all banking operations:
  $$\sum \text{Debits} = \sum \text{Credits}$$
- Shows each master ledger account code, descriptive name, classification (Asset, Liability, Equity, Revenue, Expense), normal balance position (Dr/Cr), period debit mutations, period credit mutations, and final balance.
- Visual badge dynamically indicates whether the general ledger is in perfect equilibrium (`✓ DOUBLE-ENTRY EQUILIBRIUM VERIFIED (DR = CR)`) or if an out-of-balance discrepancy has occurred.

#### Tab 5: Treasury FX Board & Foreign Currency Calculator
- **Papan Kurs Valuta Asing (TT Counter Rates)**: Real-time board showing Bank Buys (Kurs Beli), Bank Sells (Kurs Jual), Middle Rate (Kurs Tengah BI), and spread for major currency pairs:
  - `USD / IDR`, `EUR / IDR`, `SGD / IDR`, `JPY / IDR`
  - Cross Rates: `EUR / USD`, `USD / SGD`
- **Interactive FX Converter**: Real-time currency calculator allowing students to calculate exchange amounts, customer debit equivalents, and remittance settlement amounts.

#### ⚡ EXECUTE END OF DAY (EOD) BATCH PROCESSING
Click the red **⚡ EXECUTE END OF DAY (EOD)** button in the top header of CORE LEDGER to trigger the core banking daily cut-off wizard:
- **Phase 1 (Transaction Cut-off)**: Inspects pending, validated, and released SWIFT transactions. Rolls over uncompleted instructions to the next business date.
- **Phase 2 (Automated Daily Interest Accrual)**: Automatically calculates daily deposit interest (standard 1.50% p.a. / 365) across all customer accounts.
- **Phase 3 (Ledger Balance Verification)**: Audits the double-entry integrity of the General Ledger prior to closing the books.
- **Phase 4 (Business Date Rollover)**: Advances the core banking system date to the next business day and posts interest expense journals (`Dr 510101`, `Cr 210101`).

---

### 4.3. Workflow C: Inspecting UETR Tracking & Technical Message Exports

1. In **SEARCH**, click **•••** on any transaction and select **VIEW / TRACK**.
2. The dynamic SWIFT Tracker modal appears, displaying:
   - **Tracker Lifecycle Bar**: Visual progression through *Transmitted*, *Sanctions Screening*, *Correspondent Clearing*, and *Credited to Beneficiary*.
   - **Message Inspection Tab**: Rendered view of SWIFT FIN tags (`:20:`, `:23B:`, `:32A:`, `:50K:`, `:59:`, `:70:`, `:71A:`) or ISO 20022 XML tags (`<Dbtr>`, `<Cdtr>`, `<IntrBkSttlmAmt>`, etc.).
   - **Audit Trail Tab**: Complete non-repudiation log recording every state transition, operator name, timestamp, and notes.
3. Click **EXPORT / DOWNLOAD MESSAGE** to retrieve technical files:
   - **MT103 / MT202**: Authentic SWIFT FIN text format with transmission headers.
   - **pacs.008 / pacs.009**: Standards-compliant ISO 20022 XML document.
   - **JSON Audit Record**: Complete system telemetry and audit history.
   - **CSV Summary**: Single-row transactional record.

---

### 4.4. Workflow D: Printing Official Payment Advice

1. Navigate to **PAYMENT ADVICE** in the top navigation bar (or click **PAYMENT ADVICE** from the row actions).
2. Select the desired transaction from the dropdown selector.
3. The official **Bank Praktikum Nusantara Payment Advice &amp; Settlement Receipt** is rendered:
   - Institutional Header with BIC `IDBKIDJA`.
   - Debit Advice / Credit Advice designation.
   - TRN, UETR, Value Date, and Charges breakdown.
   - Ordering and Beneficiary customer information.
   - Principal remittance, SWIFT telex fee, and net settlement total.
   - Dual Maker (`Prepared By`) and Checker (`Authorized By`) signature blocks.
4. Click **PRINT ADVICE** to generate a clean, printer-friendly PDF or hard copy.

---

## 5. Master Data: BIC Directory Management

Under the **BIC DIRECTORY** module:
- Search through global financial institution identifiers by BIC code, institution name, country, or city.
- Users with administrative credentials (`aditya` - System Administrator) can:
  - Click **ADD BIC CODE** to onboard a new correspondent bank.
  - Click **•••** on any BIC row to **EDIT** or **DELETE** records.

---

## 6. Super Admin & Master Configuration Console

The **Super Admin Console** provides instructors, laboratory directors, and system administrators with granular, real-time control over the simulator's institutional identity, SWIFT routing configuration, compliance policies, and complete data persistence.

```
+-----------------------------------------------------------------------------------------+
|                              SUPER ADMIN CONTROL CENTER                                 |
+---------------------+---------------------+---------------------+-----------------------+
| 1. Owner & Org Info | 2. Bank & SWIFT BIC | 3. Policy Controls  | 4. Backup & Reset     |
+---------------------+---------------------+---------------------+-----------------------+
| • Institution Name  | • Bank Name         | • Four-Eyes (Maker- | • Export JSON State   |
| • Lab Supervisor    | • SWIFT BIC Code    |   Checker Enforce)  | • Restore JSON State  |
| • Contact Email/Tel | • Base Currency     | • Strict Balance    | • Factory Baseline    |
| • Registered Office | • Telex Fees        | • Auto Sanctions    |   Erase & Reset       |
| • Simulator License | • Clearing Network  | • GL Auto-Posting   | • One-Click App Login |
+---------------------+---------------------+---------------------+-----------------------+
```

### 6.1. Independent Super Admin Access (`admin.html`) & Academic Security Isolation

Untuk menjaga integritas laboratorium praktikum dan mencegah mahasiswa mengubah konfigurasi kepemilikan, nama bank, BIC, atau aturan saldo, **Super Admin telah dipisahkan secara fisik menjadi file mandiri (`admin.html`)**.

> **Catatan Keamanan Mahasiswa**: File `index.html` murni hanya berisi antarmuka terminal perbankan mahasiswa. Tidak ada tombol, modal, link, maupun skrip Super Admin di dalam `index.html`. Mahasiswa yang memeriksa source code `index.html` tidak akan menemukan form login admin maupun master key.

#### Cara Mengakses Portal Super Admin (Khusus Dosen / Instruktur):
1. **URL Mandiri Khusus Admin**: Buka `http://<host>:3000/admin` atau `http://<host>:3000/admin.html` langsung di browser Anda.
2. **Kredensial Master Super Admin**:
   - **Admin Identifier**: `superadmin` *(atau `admin`)*
   - **Master Access Key**: `MASTER-SWIFT-2026` *(atau `LAB-2026`)*
   - **Administrative Password**: `supersecret` *(atau `123456`)*

Setelah login di `admin.html`, instruktur dapat mengedit seluruh konfigurasi sistem. Hasil simpanan otomatis tersinkronisasi ke simulator mahasiswa melalui browser database storage (`localStorage`). Terdapat juga tombol shortcut `OPEN STUDENT SIMULATOR ↗` di dalam admin console untuk membuka aplikasi mahasiswa di tab baru.

---

### 6.2. Tab 1: Application Owner & Institution Profile

This tab allows universities, colleges, and training academies to rebrand and customize the simulator's legal ownership and institutional metadata:

| Field Label | Parameter Key | Description & Educational Purpose |
|---|---|---|
| **Application Display Title** | `appName` | The overarching simulator name displayed across the browser tab and system banners. |
| **Owner / Organization Name** | `ownerName` | The university, banking faculty, or corporate entity that operates this laboratory. |
| **Lead Contact Person / Supervisor**| `ownerContact` | The responsible professor, laboratory manager, or head of practicum. |
| **Academic Title / Designation** | `ownerTitle` | Official title (e.g., *Head of International Banking Laboratory*). |
| **Official Contact Email** | `ownerEmail` | Administrative contact address for student inquiries. |
| **Telephone / Extension** | `ownerPhone` | Laboratory landline or extension number. |
| **Department / Institution** | `ownerInstitution` | The faculty or department name appearing on official Payment Advices. |
| **Simulation License / Registry No.**| `licenseNo` | Academic simulation certification or regulatory sandbox code. |
| **Application Banner Motto** | `appMotto` | The corporate tagline displayed on the SWIFT network header bar. |
| **Registered Operational Address** | `headOfficeAddress` | Physical address printed on official SWIFT MT/ISO payment advices. |

---

### 6.3. Tab 2: Bank Identity & SWIFT Network Routing

Students can simulate operating *any* global commercial bank by altering the institution's primary routing credentials in this tab:

| Field Label | Technical ISO Standard | Description |
|---|---|---|
| **Primary Bank Name** | Universal Interbank Identity | The commercial bank simulated in the lab (e.g., `BANK PRAKTIKUM NUSANTARA`, `BANK CENTRAL ASIA`, `JPMORGAN CHASE`). |
| **Primary SWIFT BIC Code** | **ISO 9362** (8 or 11 characters) | The unique Business Identifier Code for routing international messages. Format: 4-letter bank code + 2-letter country code + 2-character location code + optional 3-character branch code (e.g., `IDBKIDJA`, `CITIUS33XXX`, `BNPAIDJA`). |
| **Country of Domicile** | ISO 3166-1 alpha-2 / Full Name | Jurisdiction governing the bank's regulatory and clearing oversight (e.g., `INDONESIA`, `UNITED STATES`). |
| **Head Office City** | Location Registry | Primary clearing and settlement center (e.g., `JAKARTA`, `NEW YORK`, `LONDON`). |
| **Base Operating Currency** | ISO 4217 Currency Code | Default currency for reporting and interbank settlements (`USD`, `IDR`, `EUR`, `SGD`, `JPY`, `GBP`). |
| **Standard Telex/SWIFT Fee (USD)**| Non-Interest Commission | Default fee charged to customer accounts for Outward USD transfers under OUR/SHA terms. |
| **Standard Telex/SWIFT Fee (IDR)**| Non-Interest Commission | Default fee charged for Outward IDR RTGS remittances. |
| **Settlement & Clearing Network** | Clearing Rails | The domestic/regional RTGS rail utilized (e.g., `BI-RTGS & SWIFT GPI`, `FEDWIRE & CHIPS`, `TARGET2`). |

> **Real-Time Dynamic Propagation**: Saving changes immediately updates the navigation bar, operator headers, transaction forms, default sender values, and official PDF/printable payment advice sheets without requiring a database migration.

---

### 6.4. Tab 3: System Features & Operational Governance Policies

This tab governs the educational strictness and automated controls of the simulator:

1. **Four-Eyes Principle (Strict Maker-Checker Enforcement)**:
   - When enabled, the system strictly forbids the operator who drafted a payment (`Maker`) from authorizing and moving it to `Released` status.
   - Authorizing requires logging in as a distinct `Checker` (e.g., `dhendy` / Head Treasury or `salma` / Senior Checker).
2. **Strict Customer Account Balance Validation**:
   - When enabled, the system verifies available customer balances in real-time. If an outward transfer exceeds available funds, a core banking overdraft alert is displayed.
3. **Automated AML & Sanctions Screening Simulation**:
   - Validates counterparties against simulated OFAC/FATF watchlists.
4. **Automated Core Banking GL Journal Postings**:
   - Automatically debits customer demand deposits (`210101`), credits foreign correspondent Nostro accounts (`110201`), and posts fee income (`410502`) into the General Ledger upon transaction release.
5. **Fast Splash Screen / Instant Proceed**:
   - Enables bypassing the intro splash screen immediately by clicking anywhere or pressing `Enter`/`Space`.
6. **Default SWIFT Message Standard**:
   - Selects whether the drafting dialog defaults to modern **ISO 20022 XML (`pacs.008`)** or legacy **SWIFT FIN (`MT103`)**.

---

### 6.5. Tab 4: Master Data Backup, Restore & Factory Baseline Reset

To facilitate repeatable semester practicums across student cohorts, the Super Admin console includes complete data portability:

- **Export Full Simulation State (`JSON`)**:
  Downloads a single, structured `.json` file containing all system configurations, registered bank BICs, active customer accounts with current balances, correspondent Nostro balances, transaction histories with complete UETR audit trails, and double-entry General Ledger journals.
- **Restore / Import Laboratory State**:
  Uploads a previously saved `.json` file to restore the exact laboratory state (useful for grading student assignments or loading pre-configured case study scenarios).
- **Reset Simulator to Factory Baseline**:
  Erases all student edits, resets customer balances and Nostro accounts to their default baseline, clears custom transactions, and restores default Bank Praktikum Nusantara configuration.

---

## 7. Financial Controls & Accounting Reference

### 7.1. Core Banking Double-Entry Rule Matrix for Outward Transfers:

| Transaction Leg | Account Debited (Dr.) | Account Credited (Cr.) | Economic Interpretation |
|---|---|---|---|
| **Principal Outward Transfer** | Customer Demand Deposit (`210101`) | Correspondent Nostro Account (`110201`) | Customer's deposit is reduced; Bank's foreign correspondent reserve balance is decreased to settle the beneficiary. |
| **SWIFT Transmission Fee (OUR/SHA)** | Customer Demand Deposit (`210101`) | Fee &amp; Commission Income (`410502`) | Bank recognizes non-interest telex income for SWIFT network processing. |
| **Inbound Cash Deposit** | Branch Vault Cash (`100101`) | Customer Demand Deposit (`210101`) | Physical cash enters bank vaults; customer's book balance is elevated. |
| **Nostro Liquidity Injection** | Correspondent Nostro Account (`110201`) | Interbank FX Liquidity (`100201`) | Treasury injects working balances into foreign correspondent accounts. |
| **End of Day Daily Interest Accrual** | Interest Expense (`510101`) | Customer Demand Deposit (`210101`) | Bank records daily interest expense owed to deposit account holders. |

---

### 7.2. Master Chart of Accounts (COA) Directory

Standard banking chart of accounts implemented in the simulator:

| Code | Account Name | Classification | Normal Balance | Operational Function |
|---|---|---|:---:|---|
| `100101` | Branch Vault Cash (Kas Fisik Khasanah Cabang) | **Asset** | `Dr` | Physical banknotes stored in branch vaults for over-the-counter deposits and withdrawals. |
| `110101` | Central Bank RTGS Settlement (Giro Bank Indonesia) | **Asset** | `Dr` | Bank reserve balance held at central bank for domestic interbank gross settlements. |
| `110201` | Nostro USD - Citibank N.A. New York | **Asset** | `Dr` | Primary foreign currency operating account in New York for USD clearing. |
| `110202` | Nostro SGD - DBS Bank Ltd Singapore | **Asset** | `Dr` | Regional Southeast Asian clearing balance in Singapore. |
| `110203` | Nostro USD - JPMorgan Chase Bank NY | **Asset** | `Dr` | Secondary liquidity and reserve USD buffer account. |
| `110204` | Nostro EUR - Bank of America N.A. NY | **Asset** | `Dr` | Euro currency operational liquidity pool. |
| `110205` | Nostro JPY - The Hongkong and Shanghai Banking Corp | **Asset** | `Dr` | Japanese Yen clearing balance at HSBC Tokyo/Singapore. |
| `210101` | Customer Demand Deposits (Giro Nasabah Korporasi) | **Liability** | `Cr` | Commercial checking deposits owed to corporate customers, withdrawable on demand. |
| `210201` | Customer Foreign Currency Savings (Tabungan Valas) | **Liability** | `Cr` | Multi-currency savings balances owned by individual and institutional clients. |
| `310101` | Paid-in Capital / Equity (Modal Disetor Bank) | **Equity** | `Cr` | Founder and shareholder equity capital providing systemic solvency. |
| `410501` | International Remittance Commission Income | **Revenue** | `Cr` | Fee income earned from cross-border remittance spreads and handling. |
| `410502` | SWIFT Cable & Telex Surcharge Income | **Revenue** | `Cr` | Fixed communication surcharge billed to remitting customers. |
| `510101` | Customer Deposit Interest Expense (Beban Bunga) | **Expense** | `Dr` | Daily interest costs accrued and paid out on customer balances. |
| `510201` | SWIFT Messaging Network Surcharge Expense | **Expense** | `Dr` | Network traffic fees payable to S.W.I.F.T. SCRL for messaging services. |

---

## 8. Panduan Khusus Orang Awam: Cara Mudah Memahami &amp; Menggunakan Core Banking System

Bagi Anda yang baru pertama kali mempelajari dunia perbankan atau sistem Core Banking (CBS), bagian ini merangkum seluruh konsep penting dalam bahasa yang sangat mudah dimengerti:

### 8.1. Konsep Dasar yang Perlu Anda Ketahui:
1. **Mengapa Saldo Rekening Nasabah Bernilai KREDIT?**
   - Dalam perbankan, uang nasabah bukanlah kekayaan milik bank. Uang tersebut adalah titipan nasabah yang merupakan **utang/kewajiban (liabilitas)** bagi bank.
   - Karena itu, saat nasabah menyetor uang, bank mencatatnya di kolom **KREDIT (Cr.)** karena kewajiban bank bertambah.
   - Sebaliknya, saat nasabah mentransfer uang keluar, saldo berkurang dicatat di kolom **DEBIT (Dr.)** karena kewajiban bank berkurang.
2. **Apa itu Rekening Nostro?**
   - Kata *Nostro* berasal dari bahasa Latin yang berarti *"Milik Kami"*.
   - Rekening Nostro adalah rekening bank kita di bank luar negeri (misalnya Bank Praktikum Nusantara membuka rekening Dollar di Citibank New York).
   - Melalui rekening inilah transfer internasional diselesaikan tanpa perlu mengirim uang fisik antarnegara.
3. **Apa itu Rekening Koran (Bank Statement)?**
   - Rekening koran adalah ringkasan resmi seluruh mutasi uang (masuk dan keluar) pada suatu rekening selama periode tertentu.
   - Perusahaan menggunakannya untuk mencocokkan catatan pembukuan internal mereka dengan catatan resmi bank (rekonsiliasi bank).
4. **Apa itu Neraca Saldo (Trial Balance)?**
   - Laporan untuk mengecek apakah pembukuan bank sudah benar atau ada kesalahan hitung.
   - Prinsip mutlak perbankan: **Total Semua Debit (Dr.) HARUS TEPAT SAMA dengan Total Semua Kredit (Cr.)**. Jika ada selisih sekecil apapun (misal 1 rupiah atau 1 sen), sistem akan memberi peringatan bahaya.
5. **Apa itu Tutup Buku Harian (End of Day / EOD)?**
   - Setiap sore setelah jam kerja kantor selesai, bank melakukan tutup buku.
   - Tujuannya: mengunci seluruh transaksi hari ini, menghitung bunga harian untuk nasabah, dan memajukan tanggal buku perbankan ke hari berikutnya.

---

### 8.2. Tutorial Langkah-demi-Langkah Praktik Nyata:

```
[ Buka Akun Nasabah ] ➔ [ Setor Modal Awal ] ➔ [ Input Transfer SWIFT ] ➔ [ Skrining & Otorisasi ] ➔ [ Cek Jurnal GL ] ➔ [ Cetak Rekening Koran ] ➔ [ Tutup Buku EOD ]
```

1. **Langkah 1: Masuk ke Simulator**
   - Klik di sembarang tempat pada layar pembuka (splash screen).
   - Masukkan ID: `student01`, Password: `swiftlab`, Key: `LAB-2026`.
   - Klik **CONNECT USB KEY** (mensimulasikan token fisik USB perbankan).
   - Pilih operator `iqbal` (Operator/Maker), masukkan password `123456`, lalu klik **LOGIN**.
2. **Langkah 2: Memeriksa Rekening & Cetak Rekening Koran**
   - Klik menu **CORE LEDGER** &rarr; tab **CUSTOMER ACCOUNTS**.
   - Cari nasabah `PT INDO EXPORT TAMA`.
   - Klik tombol **📄 REKENING KORAN**.
   - Anda akan melihat ringkasan saldo awal, mutasi masuk/keluar, dan saldo akhir. Klik **PRINT STATEMENT** untuk mencetak dokumen berstandar perbankan, atau **EXPORT CSV** untuk mengunduh ke Excel.
3. **Langkah 3: Menambah Saldo (+ DEPOSIT)**
   - Jika nasabah butuh dana tambahan, klik **+ DEPOSIT** pada kartu rekening.
   - Masukkan nominal (contoh: `25000`) dan klik **EXECUTE DEPOSIT**. Saldo rekening langsung bertambah dan kas khasanah cabang didebit otomatis.
4. **Langkah 4: Melakukan Transfer Valas SWIFT (Maker)**
   - Klik menu **RECORD** di atas.
   - Pilih pesan `pacs.008` (standar modern ISO 20022).
   - Masukkan Bank Penerima (misal: `CITIUS33XXX`), mata uang `USD`, dan jumlah nominal transfer.
   - Pilih rekening nasabah pengirim. Klik **SUBMIT TRANSACTION**. Transaksi tersimpan dengan status **Pending**.
5. **Langkah 5: Otorisasi Dua Pihak (Maker-Checker)**
   - Logout, lalu login sebagai `salma` (Compliance Officer) dengan password `123456`. Masuk ke menu **SEARCH**, klik menu titik tiga (**•••**) pada transaksi, pilih **UPDATE STATUS** &rarr; **Validated**.
   - Logout, lalu login sebagai `dhendy` (Head Treasury / Checker). Masuk ke menu **SEARCH**, klik **UPDATE STATUS** &rarr; **Released**.
   - **Hasil**: Begitu status diubah menjadi *Released*, Core Banking seketika memotong saldo rekening nasabah, mengurangi saldo cadangan Nostro, dan mencatat jurnal debit/kredit di buku besar!
6. **Langkah 6: Memeriksa Keseimbangan Neraca Saldo (Trial Balance)**
   - Buka **CORE LEDGER** &rarr; klik tab **TRIAL BALANCE (NERACA SALDO)**.
   - Perhatikan badge hijau: `✓ DOUBLE-ENTRY EQUILIBRIUM VERIFIED`. Total mutasi debit dan kredit sama persis tanpa selisih (0.00).
7. **Langkah 7: Menjalankan Tutup Buku Harian (End of Day)**
   - Pada halaman **CORE LEDGER**, klik tombol merah **⚡ EXECUTE END OF DAY (EOD)**.
   - Klik tombol **KONFIRMASI &amp; JALANKAN PROSES EOD**.
   - Sistem secara otomatis menghitung bunga simpanan harian untuk semua nasabah, memposting beban bunga ke buku besar, dan memajukan tanggal pembukuan.

---

## 9. Laboratory Practicum Assignments for Students

### Exercise 1: Commercial Payment Execution
1. As Maker `iqbal`, create a `pacs.008` payment for customer `PT SINAR NIAGA GLOBAL` in the amount of `USD 120,000.00` to `TOYOTA TSUSHO CORP` via receiver `BOTKJPJTXXX`.
2. As Compliance Officer `salma`, review the transaction details and mark it **Validated**.
3. As Head Treasury `dhendy`, authorize and change status to **Released**.
4. Navigate to **CORE LEDGER** and document the resulting journal entries in the General Ledger.

### Exercise 2: Liquidity Deficit Management
1. Attempt to create a payment exceeding customer `PT BERKAH MANDIRI TEKSTIL`'s available IDR balance.
2. Note the system warning dialog.
3. Switch to **CORE LEDGER**, perform a cash deposit into the customer's account to cover the deficit, and successfully execute the remittance.

### Exercise 3: Compliance Sanctions Screening
1. Create a transaction involving a flagged entity or jurisdiction.
2. Log in as `salma`, inspect the narrative, and change status to **Rejected** with an official screening justification.
3. Verify that no debits were recorded in the Core Banking General Ledger.

### Exercise 4: Bank Rebranding & Configuration Exercise (Super Admin)
1. Log in to the Super Admin Console (`admin.html`) using master credentials.
2. In **Tab 2 (Bank Identity)**, update the simulated bank name to your assigned banking case study (e.g. `BANK MANDIRI INTERNATIONAL`) and set BIC to `BMRIIDJA`.
3. Save changes and return to the main application.
4. Verify that the bank name and BIC are updated in the header, payment advice voucher, and transaction drafting forms.
5. In **Tab 4 (Backup & Reset)**, export your completed simulation state as a JSON file for assignment submission.

---
*Bank Praktikum Nusantara Core Banking & SWIFT Network Simulator — Academic Edition 2026*
