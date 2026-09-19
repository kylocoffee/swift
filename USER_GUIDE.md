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

Navigate to **CORE LEDGER** to inspect banking books and liquidity:

#### Tab 1: Customer Accounts Register
- View corporate and retail customer demand deposit (Giro) and foreign currency accounts.
- **Deposit Funds**: Click **+ DEPOSIT FUNDS** on any account card to simulate an over-the-counter cash deposit or inbound clearing credit. This immediately credits the customer's balance and records a debit to Branch Cash Vault (`100101`).
- **Open New Customer Account**: Authorized operators can click **OPEN NEW CUSTOMER ACCOUNT** to register a new client with bespoke currency, initial balance, and CIF address details.

#### Tab 2: Bank Nostro Accounts
- Monitor Bank Praktikum Nusantara's foreign currency liquidity pools held across international correspondent banks:
  - `NOSTRO-USD-CITI`: Citibank N.A., New York ($ USD)
  - `NOSTRO-EUR-DB`: Deutsche Bank AG, Frankfurt (€ EUR)
  - `NOSTRO-SGD-DBS`: DBS Bank Ltd, Singapore (S$ SGD)
  - `NOSTRO-JPY-MUFG`: MUFG Bank Ltd, Tokyo (¥ JPY)
- **Inject Liquidity**: Treasury managers can inject reserve capital into Nostro accounts to fund large outbound remittance batches.

#### Tab 3: General Ledger (GL) & Financial Reporting
- Inspect the immutable double-entry journal log.
- Every transaction displays: Reference number, timestamp, Transaction ID / UETR, Debit Account (Dr.), Credit Account (Cr.), Currency, Amount, Audit Remarks, and Authorizing Officer.
- **Export Journal (CSV)**: Click **EXPORT JOURNAL (CSV)** to generate spreadsheet reports for accounting and external audit exercises.

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

## 6. Financial Controls & Accounting Reference

### Core Banking Double-Entry Rule Matrix for Outward Transfers:

| Transaction Leg | Account Debited (Dr.) | Account Credited (Cr.) | Economic Interpretation |
|---|---|---|---|
| **Principal Outward Transfer** | Customer Demand Deposit (`210101`) | Correspondent Nostro Account (`110201`) | Customer's deposit is reduced; Bank's foreign correspondent reserve balance is decreased to settle the beneficiary. |
| **SWIFT Transmission Fee (OUR/SHA)** | Customer Demand Deposit (`210101`) | Fee &amp; Commission Income (`410201`) | Bank recognizes non-interest telex income for SWIFT network processing. |
| **Inbound Cash Deposit** | Branch Vault Cash (`100101`) | Customer Demand Deposit (`210101`) | Physical cash enters bank vaults; customer's book balance is elevated. |
| **Nostro Liquidity Injection** | Correspondent Nostro Account (`110201`) | Interbank FX Liquidity (`100201`) | Treasury injects working balances into foreign correspondent accounts. |

---

## 7. Laboratory Practicum Assignments for Students

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

---
*Bank Praktikum Nusantara Core Banking & SWIFT Network Simulator — Academic Edition 2026*
