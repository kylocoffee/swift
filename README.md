# SWIFT Network & Core Banking Laboratory Simulator

A high-fidelity corporate banking and SWIFT payment messaging simulator developed for Banking, Finance, and International Trade practicum training. The application simulates the end-to-end lifecycle of cross-border financial transactions, correspondent banking settlement, and double-entry Core Banking System (CBS) accounting.

For a comprehensive walkthrough and standard operating procedures, please consult [**USER_GUIDE.md**](./USER_GUIDE.md).

---

## Key Capabilities & Banking Architecture

1. **Multi-Stage Banking Terminal Authentication**:
   - **Terminal Access**: Initial authentication screen mimicking institutional financial terminals.
   - **Hardware Security Token (PKI / USB HSM Simulation)**: Cryptographic device insertion and PIN verification for non-repudiation.
   - **Role-Based Access Control (RBAC)**: Enforcing the **Four-Eyes Principle (Maker-Checker Oversight)** across banking departments.

2. **SWIFT Messaging Engine (Dual Standard)**:
   - **ISO 20022 XML Messaging**: Modern `pacs.008.001.08` (Customer Credit Transfer) and `pacs.009.001.08` (Financial Institution Transfer).
   - **SWIFT FIN Legacy Messaging**: Full `MT103` (Single Customer Credit Transfer) and `MT202` (General Financial Institution Transfer) tagged blocks.
   - **RFC 4122 UUID v4 UETR**: Automatic generation and validation of Unique End-to-End Transaction References.

3. **Core Banking System (CBS) & General Ledger Engine**:
   - **Customer Account Management**: Real-time balance validation, deposit simulation, and account opening CRUD.
   - **Nostro Correspondent Liquidity**: Multi-currency nostro account balances held across international financial centers (USD, EUR, SGD, JPY).
   - **Automated Double-Entry Postings**: Instantaneous ledger balancing upon payment release (Debit Customer Demand Deposits, Credit Correspondent Nostro).
   - **Financial Reporting**: One-click CSV export of double-entry General Ledger records.

4. **Compliance & Sanctions Screening Simulation**:
   - Real-time pre-validation of counterparties and narratives against anti-money laundering (AML) and international sanctions lists.
   - Immutable state transitions from `Pending` &rarr; `Validated` &rarr; `Released` or `Rejected`.

5. **Official Banking Documents & Payment Advice**:
   - Institutional **Payment Advice & Settlement Receipt** vouchers formatted with Bank Praktikum Nusantara headers, breakdown of principal, telex fees, and dual Maker/Checker signature blocks.
   - Browser-optimized print and PDF rendering.

6. **Technical Message Export**:
   - Raw FIN text downloads, ISO 20022 XML exports, single-row CSV records, and comprehensive JSON telemetry dumps.

---

## Demonstration Credentials & Operator Profiles

### Initial Terminal Access
- **Account**: `student01`
- **Password**: `swiftlab`
- **Access Key**: `LAB-2026`

### Hardware Security Token PIN
- **Token PIN**: `123456`

### Operational Roles (Password for all operators: `123456`)

| Operator / Username | Code | Role | Operational Privileges |
|---|---|---|---|
| `iqbal` | `OPS-01` | **Operator (Maker)** | Input/Draft new outward payments, track UETR, print payment advice. |
| `dhendy` | `HTR-01` | **Head Treasury (Checker)** | Authorize transactions, change status to **Released**, execute Core Banking GL postings, export messages. |
| `salma` | `CMP-01` | **Compliance Officer** | Review transactions, execute AML/Sanctions screening, elevate status to **Validated** or **Rejected**. |
| `aditya` | `ADM-01` | **System Administrator** | Full CRUD for BIC directory, delete transaction records, reset simulation data. |
| `ratna` | `AUD-01` | **Internal Auditor** | Read-only inspection of transactions, UETR audit trails, and General Ledger journals. |

---

## Running the Application Locally

The application runs directly in modern web browsers with zero external runtime dependencies:
1. Clone or extract the project directory.
2. Open `index.html` in any modern web browser (Chrome, Edge, Safari, Firefox).
3. All assets (CSS, JS) are linked relatively and persist transactional data dynamically via browser `localStorage`.
4. Automated test suite can be verified via:
   ```bash
   node tests/messages.test.cjs
   ```

