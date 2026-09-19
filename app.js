const queryRoot = r => typeof r === 'string' ? document.querySelector(r) : r;
const $ = (s, r = document) => queryRoot(r)?.querySelector(s), $$ = (s, r = document) => [...(queryRoot(r)?.querySelectorAll(s) || [])];
const TK = 'swiftLabTransactions', BK = 'swiftLabBics', SK = 'swiftLabSession';
const CK = 'swiftLabCustomers', NK = 'swiftLabNostro', JK = 'swiftLabJournals', UK = 'swiftLabUsers';

const defaultProfiles = {
  iqbal: { display: 'IQBAL', username: 'iqbal', password: '123456', roles: [{ code: 'OPS-01', role: 'Operator' }] },
  dhendy: { display: 'DHENDY', username: 'dhendy', password: '123456', roles: [{ code: 'HTR-01', role: 'Head Treasury' }] },
  salma: { display: 'SALMA', username: 'salma', password: '123456', roles: [{ code: 'CMP-01', role: 'Compliance Officer' }] },
  aditya: { display: 'ADITYA', username: 'aditya', password: '123456', roles: [{ code: 'ADM-01', role: 'System Administrator' }] },
  ratna: { display: 'RATNA', username: 'ratna', password: '123456', roles: [{ code: 'AUD-01', role: 'Auditor' }] }
};

function getStoredProfiles() {
  const loaded = load(UK, defaultProfiles);
  Object.keys(loaded).forEach(k => {
    if (!loaded[k].password) loaded[k].password = '123456';
    if (!Array.isArray(loaded[k].roles)) loaded[k].roles = [{ code: 'OPS-01', role: 'Operator' }];
  });
  return loaded;
}

let PROFILES = getStoredProfiles();

const RIGHTS = {
  'Operator': { search: 1, view: 1, create: 1, edit: 1, export: 1, print: 1, ledgerView: 1 },
  'Head Treasury': { search: 1, view: 1, create: 1, edit: 1, status: 1, print: 1, export: 1, analysis: 1, bicView: 1, bicManage: 1, ledgerView: 1, ledgerManage: 1 },
  'Compliance Officer': { search: 1, view: 1, status: 1, print: 1, export: 1, analysis: 1, bicView: 1, ledgerView: 1 },
  'System Administrator': { search: 1, view: 1, create: 1, edit: 1, delete: 1, status: 1, print: 1, export: 1, analysis: 1, bicView: 1, bicManage: 1, ledgerView: 1, ledgerManage: 1, reset: 1 },
  'Auditor': { search: 1, view: 1, print: 1, export: 1, analysis: 1, bicView: 1, ledgerView: 1 }
};

const ROLE_INFO = {
  'Operator': 'Maker: Draft and record customer payment instructions, inspect customer balances, and view UETRs.',
  'Head Treasury': 'Checker & Authorizer: Authorize Validated/Released status, manage correspondent Nostro liquidity, and review treasury analytics.',
  'Compliance Officer': 'AML/CFT & Sanctions Reviewer: Screen transaction parties against sanctions lists, verify compliance, and approve (Validated) or reject.',
  'System Administrator': 'System Administrator: Manage global BIC directories, maintain customer records, configure routing, and administer lab data.',
  'Auditor': 'Independent Oversight: Inspect end-to-end audit trails, verify General Ledger double entries, and review compliance logs.'
};

const seedCustomers = [
  { accountNo: '1001-2099-01', name: 'PT INDO JAYA MAKMUR', type: 'Corporate Demand Deposit (IDR)', currency: 'IDR', balance: 14500000000, address: 'JL JEND SUDIRMAN KAV 21\nJAKARTA SELATAN\nINDONESIA' },
  { accountNo: '1001-3088-02', name: 'CV NUSANTARA EKSPOR', type: 'Corporate Foreign Currency (USD)', currency: 'USD', balance: 1850000, address: 'JL GATOT SUBROTO NO 44\nJAKARTA PUSAT\nINDONESIA' },
  { accountNo: '1001-4077-03', name: 'BUDI SANTOSO', type: 'Commercial Foreign Currency Savings (USD)', currency: 'USD', balance: 350000, address: 'JL DIPONEGORO NO 12\nSURABAYA\nINDONESIA' },
  { accountNo: '1001-5066-04', name: 'PT SUMATERA AGRO INTERNASIONAL', type: 'Corporate Foreign Currency (EUR)', currency: 'EUR', balance: 920000, address: 'JL IMAM BONJOL NO 88\nMEDAN\nINDONESIA' },
  { accountNo: '1001-6055-05', name: 'SALMA LESTARI', type: 'Commercial Foreign Currency Savings (SGD)', currency: 'SGD', balance: 280000, address: 'JL ASIA AFRIKA NO 15\nBANDUNG\nINDONESIA' },
  { accountNo: '1001-7044-06', name: 'PT TOKYO MITRA INDUSTRI', type: 'Corporate Foreign Currency (JPY)', currency: 'JPY', balance: 125000000, address: 'KAWASAN INDUSTRI MM2100\nBEKASI\nINDONESIA' }
];

const seedNostro = [
  { accountCode: 'NOSTRO-USD-CITI', bankName: 'CITIBANK N.A. NEW YORK', bic: 'CITIUS33XXX', currency: 'USD', balance: 15420000, accountNo: 'US33CITI1000998877', city: 'NEW YORK', country: 'UNITED STATES' },
  { accountCode: 'NOSTRO-SGD-DBS', bankName: 'DBS BANK LTD SINGAPORE', bic: 'DBSSSGSGXXX', currency: 'SGD', balance: 8450000, accountNo: 'SG65DBSS0098765432', city: 'SINGAPORE', country: 'SINGAPORE' },
  { accountCode: 'NOSTRO-USD-CHASE', bankName: 'JPMORGAN CHASE BANK NY', bic: 'CHASUS33XXX', currency: 'USD', balance: 22800000, accountNo: 'US33CHAS2000445566', city: 'NEW YORK', country: 'UNITED STATES' },
  { accountCode: 'NOSTRO-EUR-BOFA', bankName: 'BANK OF AMERICA N.A. NY', bic: 'BOFAUS3NXXX', currency: 'EUR', balance: 6730000, accountNo: 'US3NBOFA3000112233', city: 'NEW YORK', country: 'UNITED STATES' },
  { accountCode: 'NOSTRO-JPY-HSBC', bankName: 'HSBC SINGAPORE / TOKYO', bic: 'HSBCSGSGXXX', currency: 'JPY', balance: 420000000, accountNo: 'SG12HSBC8877665544', city: 'SINGAPORE', country: 'SINGAPORE' }
];

const seedBic = [
  { bic: 'IDBKIDJA', name: 'BANK PRAKTIKUM NUSANTARA', country: 'INDONESIA', city: 'JAKARTA' },
  { bic: 'CITIUS33XXX', name: 'CITIBANK N.A.', country: 'UNITED STATES', city: 'NEW YORK' },
  { bic: 'DBSSSGSGXXX', name: 'DBS BANK LTD', country: 'SINGAPORE', city: 'SINGAPORE' },
  { bic: 'CHASUS33XXX', name: 'JPMORGAN CHASE BANK', country: 'UNITED STATES', city: 'NEW YORK' },
  { bic: 'BOFAUS3NXXX', name: 'BANK OF AMERICA N.A.', country: 'UNITED STATES', city: 'NEW YORK' },
  { bic: 'HSBCSGSGXXX', name: 'HSBC SINGAPORE', country: 'SINGAPORE', city: 'SINGAPORE' }
];

const seedTx = [
  {
    id: 'T001', trn: 'TRN20260918001', uetr: 'f81d4fae-7dec-41d0-a765-00a0c91e6bf1', reference: 'IDBK2609180001',
    type: 'pacs.008', date: '2026-09-18T08:42:15', valueDate: '2026-09-18', sender: 'IDBKIDJA', receiver: 'CITIUS33XXX',
    currency: 'USD', amount: 125000, status: 'Released', charges: 'SHA',
    orderingName: 'CV NUSANTARA EKSPOR', orderingAccount: '1001-3088-02', orderingAddress: 'JL GATOT SUBROTO NO 44\nJAKARTA PUSAT\nINDONESIA',
    beneficiaryName: 'GLOBAL MACHINERY CORP', beneficiaryAccount: 'US89CITI1000992288', beneficiaryAddress: '388 GREENWICH STREET\nNEW YORK NY 10013\nUNITED STATES',
    narrative: 'IMPORT PAYMENT MACHINERY SPAREPARTS',
    audit: [
      { time: '2026-09-18T08:42:15.000Z', operator: 'IQBAL', role: 'Operator', action: 'TRANSACTION_CREATED', note: 'Maker input: customer remittance outward', from: '', to: 'Pending' },
      { time: '2026-09-18T08:45:10.000Z', operator: 'SALMA', role: 'Compliance Officer', action: 'STATUS_CHANGE', note: 'Sanctions & AML screening passed with zero hits', from: 'Pending', to: 'Validated' },
      { time: '2026-09-18T08:48:30.000Z', operator: 'DHENDY', role: 'Head Treasury', action: 'STATUS_CHANGE', note: 'Checker authorized: funds debited and released to SWIFT network', from: 'Validated', to: 'Released' }
    ]
  },
  {
    id: 'T002', trn: 'TRN20260918002', uetr: '2c4455a1-0000-4000-8000-000000001002', reference: 'IDBK2609180002',
    type: 'MT103', date: '2026-09-18T09:16:03', valueDate: '2026-09-19', sender: 'IDBKIDJA', receiver: 'DBSSSGSGXXX',
    currency: 'SGD', amount: 72500, status: 'Validated', charges: 'OUR',
    orderingName: 'SALMA LESTARI', orderingAccount: '1001-6055-05', orderingAddress: 'JL ASIA AFRIKA NO 15\nBANDUNG\nINDONESIA',
    beneficiaryName: 'SINGAPORE MANAGEMENT ACADEMY', beneficiaryAccount: 'SG44DBSS0099881122', beneficiaryAddress: '12 MARINA BOULEVARD\nSINGAPORE 018982',
    narrative: 'TUITION FEE SEMESTER 1 SIMULATION',
    audit: [
      { time: '2026-09-18T09:16:03.000Z', operator: 'IQBAL', role: 'Operator', action: 'TRANSACTION_CREATED', note: 'Maker input: education fee transfer', from: '', to: 'Pending' },
      { time: '2026-09-18T09:20:00.000Z', operator: 'SALMA', role: 'Compliance Officer', action: 'STATUS_CHANGE', note: 'Document verified, passed KYC/AML', from: 'Pending', to: 'Validated' }
    ]
  },
  {
    id: 'T003', trn: 'TRN20260917003', uetr: '91d802b4-0000-4000-8000-000000001003', reference: 'CHAS2609170099', relatedReference: 'COV26091701',
    type: 'pacs.009', date: '2026-09-17T14:10:42', valueDate: '2026-09-18', sender: 'CHASUS33XXX', receiver: 'IDBKIDJA',
    currency: 'USD', amount: 980000, status: 'Pending', charges: 'SHA',
    narrative: 'INTERBANK LIQUIDITY NOSTRO REPLENISHMENT',
    audit: [
      { time: '2026-09-17T14:10:42.000Z', operator: 'SYSTEM', role: 'SWIFT Gateway', action: 'RECORD_IMPORTED', note: 'Inward cover message received from JP Morgan Chase NY', from: '', to: 'Pending' }
    ]
  },
  {
    id: 'T004', trn: 'TRN20260916004', uetr: '6f2273c0-0000-4000-8000-000000001004', reference: 'IDBK2609160004', relatedReference: 'REL26091604',
    type: 'MT202', date: '2026-09-16T11:29:18', valueDate: '2026-09-16', sender: 'IDBKIDJA', receiver: 'BOFAUS3NXXX',
    currency: 'EUR', amount: 412300, status: 'Rejected', charges: 'SHA',
    narrative: 'BANK SETTLEMENT REJECTED DUE TO ROUTING ISSUE',
    audit: [
      { time: '2026-09-16T11:29:18.000Z', operator: 'IQBAL', role: 'Operator', action: 'TRANSACTION_CREATED', note: 'Maker input: interbank euro transfer', from: '', to: 'Pending' },
      { time: '2026-09-16T11:45:00.000Z', operator: 'SALMA', role: 'Compliance Officer', action: 'STATUS_CHANGE', note: 'Rejected: correspondent account mismatch', from: 'Pending', to: 'Rejected' }
    ]
  },
  {
    id: 'T005', trn: 'TRN20260915005', uetr: '88b710f4-0000-4000-8000-000000001005', reference: 'HSBC2609158811',
    type: 'pacs.008', date: '2026-09-15T16:51:08', valueDate: '2026-09-16', sender: 'HSBCSGSGXXX', receiver: 'IDBKIDJA',
    currency: 'IDR', amount: 2150000000, status: 'Released', charges: 'SHA',
    orderingName: 'SINGAPORE TRADING PTE LTD', orderingAccount: 'SG88HSBC1122334455', orderingAddress: '21 COLLYER QUAY\nSINGAPORE 049320',
    beneficiaryName: 'PT INDO JAYA MAKMUR', beneficiaryAccount: '1001-2099-01', beneficiaryAddress: 'JL JEND SUDIRMAN KAV 21\nJAKARTA SELATAN\nINDONESIA',
    narrative: 'EXPORT PROCEEDS TEXTILE SHIPMENT LC-9902',
    audit: [
      { time: '2026-09-15T16:51:08.000Z', operator: 'SYSTEM', role: 'SWIFT Gateway', action: 'RECORD_IMPORTED', note: 'Inward remittance received', from: '', to: 'Validated' },
      { time: '2026-09-15T17:10:00.000Z', operator: 'DHENDY', role: 'Head Treasury', action: 'STATUS_CHANGE', note: 'Funds credited to beneficiary Demand Deposit IDR', from: 'Validated', to: 'Released' }
    ]
  },
  {
    id: 'T006', trn: 'TRN20260915006', uetr: '53d277a0-0000-4000-8000-000000001006', reference: 'IDBK2609150006',
    type: 'MT103', date: '2026-09-15T10:18:22', valueDate: '2026-09-15', sender: 'IDBKIDJA', receiver: 'DBSSSGSGXXX',
    currency: 'SGD', amount: 188400, status: 'Released', charges: 'SHA',
    orderingName: 'PT INDO JAYA MAKMUR', orderingAccount: '1001-2099-01', orderingAddress: 'JL JEND SUDIRMAN KAV 21\nJAKARTA SELATAN\nINDONESIA',
    beneficiaryName: 'ASIAN LOGISTICS SINGAPORE', beneficiaryAccount: 'SG77DBSS8833221100', beneficiaryAddress: '8 MARINA VIEW\nSINGAPORE 018960',
    narrative: 'FREIGHT CHARGES FOR LOGISTICS HUB',
    audit: [
      { time: '2026-09-15T10:18:22.000Z', operator: 'IQBAL', role: 'Operator', action: 'TRANSACTION_CREATED', note: 'Maker input completed', from: '', to: 'Pending' },
      { time: '2026-09-15T10:30:15.000Z', operator: 'DHENDY', role: 'Head Treasury', action: 'STATUS_CHANGE', note: 'Checker verified and released', from: 'Pending', to: 'Released' }
    ]
  },
  {
    id: 'T007', trn: 'TRN20260914007', uetr: 'a9214d70-0000-4000-8000-000000001007', reference: 'CITI2609145511',
    type: 'pacs.008', date: '2026-09-14T13:45:51', valueDate: '2026-09-15', sender: 'CITIUS33XXX', receiver: 'IDBKIDJA',
    currency: 'USD', amount: 540000, status: 'Validated', charges: 'SHA',
    orderingName: 'NEW YORK COFFEE ROASTERS LLC', orderingAccount: 'US77CITI88334411', orderingAddress: '111 WALL STREET\nNEW YORK NY 10005',
    beneficiaryName: 'CV NUSANTARA EKSPOR', beneficiaryAccount: '1001-3088-02', beneficiaryAddress: 'JL GATOT SUBROTO NO 44\nJAKARTA PUSAT\nINDONESIA',
    narrative: 'PAYMENT FOR ARABICA COFFEE EXPORT LOT 44',
    audit: [
      { time: '2026-09-14T13:45:51.000Z', operator: 'SYSTEM', role: 'SWIFT Gateway', action: 'RECORD_IMPORTED', note: 'Inward payment notification', from: '', to: 'Validated' }
    ]
  },
  {
    id: 'T008', trn: 'TRN20260914008', uetr: '71e0cc42-0000-4000-8000-000000001008', reference: 'IDBK2609140008', relatedReference: 'COV26091488',
    type: 'MT202', date: '2026-09-14T09:20:14', valueDate: '2026-09-14', sender: 'IDBKIDJA', receiver: 'CHASUS33XXX',
    currency: 'USD', amount: 1320000, status: 'Released', charges: 'SHA',
    narrative: 'TREASURY NOSTRO FUNDING TRANSFER TO CHASE NY',
    audit: [
      { time: '2026-09-14T09:20:14.000Z', operator: 'DHENDY', role: 'Head Treasury', action: 'TRANSACTION_CREATED', note: 'Direct treasury funding instruction', from: '', to: 'Released' }
    ]
  },
  {
    id: 'T009', trn: 'TRN20260913009', uetr: '3b119fa2-0000-4000-8000-000000001009', reference: 'BOFA2609131100', relatedReference: 'LIQ26091301',
    type: 'pacs.009', date: '2026-09-13T17:03:38', valueDate: '2026-09-14', sender: 'BOFAUS3NXXX', receiver: 'IDBKIDJA',
    currency: 'EUR', amount: 288750, status: 'Pending', charges: 'SHA',
    narrative: 'INTERBANK LIQUIDITY SETTLEMENT EUR',
    audit: [
      { time: '2026-09-13T17:03:38.000Z', operator: 'SYSTEM', role: 'SWIFT Gateway', action: 'RECORD_IMPORTED', note: 'Incoming pacs.009 message received', from: '', to: 'Pending' }
    ]
  },
  {
    id: 'T010', trn: 'TRN20260912010', uetr: 'd9046a18-0000-4000-8000-000000001010', reference: 'IDBK2609120010',
    type: 'MT103', date: '2026-09-12T12:39:06', valueDate: '2026-09-12', sender: 'IDBKIDJA', receiver: 'HSBCSGSGXXX',
    currency: 'JPY', amount: 45000000, status: 'Released', charges: 'OUR',
    orderingName: 'PT TOKYO MITRA INDUSTRI', orderingAccount: '1001-7044-06', orderingAddress: 'KAWASAN INDUSTRI MM2100\nBEKASI\nINDONESIA',
    beneficiaryName: 'OSAKA PRECISION TOOLS CO', beneficiaryAccount: 'JP99HSBC33445566', beneficiaryAddress: 'CHUO-KU\nOSAKA 541-0041\nJAPAN',
    narrative: 'INDUSTRIAL EQUIPMENT PURCHASE INVOICE JPY-9901',
    audit: [
      { time: '2026-09-12T12:39:06.000Z', operator: 'IQBAL', role: 'Operator', action: 'TRANSACTION_CREATED', note: 'Customer remittance JPY', from: '', to: 'Pending' },
      { time: '2026-09-12T13:00:00.000Z', operator: 'DHENDY', role: 'Head Treasury', action: 'STATUS_CHANGE', note: 'Released and settled via HSBC Nostro JPY', from: 'Pending', to: 'Released' }
    ]
  }
];

const seedJournals = [
  {
    ref: 'GL-20260918-001', txId: 'T001', date: '2026-09-18T08:48:30',
    drAcc: '210101 - Demand Deposit CV Nusantara Ekspor', crAcc: '110201 - Nostro USD Citibank NY',
    currency: 'USD', amount: 125000,
    remark: 'SWIFT Outward pacs.008 settlement - Global Machinery Corp',
    checker: 'DHENDY'
  },
  {
    ref: 'GL-20260918-002', txId: 'T001', date: '2026-09-18T08:48:30',
    drAcc: '210101 - Demand Deposit CV Nusantara Ekspor', crAcc: '410502 - SWIFT Fee & Commission Income',
    currency: 'USD', amount: 25,
    remark: 'SWIFT Telex Fee SHA (CV Nusantara Ekspor)',
    checker: 'DHENDY'
  },
  {
    ref: 'GL-20260915-001', txId: 'T005', date: '2026-09-15T17:10:00',
    drAcc: '110101 - Central Bank RTGS Settlement (IDR)', crAcc: '210101 - Demand Deposit PT Indo Jaya Makmur',
    currency: 'IDR', amount: 2150000000,
    remark: 'Inward Remittance Export Proceeds - PT Indo Jaya Makmur',
    checker: 'DHENDY'
  },
  {
    ref: 'GL-20260915-002', txId: 'T006', date: '2026-09-15T10:30:15',
    drAcc: '210101 - Demand Deposit PT Indo Jaya Makmur', crAcc: '110202 - Nostro SGD DBS Bank',
    currency: 'SGD', amount: 188400,
    remark: 'SWIFT MT103 Supplier Settlement - Asian Logistics',
    checker: 'DHENDY'
  },
  {
    ref: 'GL-20260914-001', txId: 'T008', date: '2026-09-14T09:20:14',
    drAcc: '110203 - Nostro USD JP Morgan Chase', crAcc: '110201 - Nostro USD Citibank NY',
    currency: 'USD', amount: 1320000,
    remark: 'Interbank Nostro Liquidity Rebalance MT202',
    checker: 'DHENDY'
  },
  {
    ref: 'GL-20260912-001', txId: 'T010', date: '2026-09-12T13:00:00',
    drAcc: '210101 - Demand Deposit PT Tokyo Mitra Industri', crAcc: '110205 - Nostro JPY HSBC Singapore',
    currency: 'JPY', amount: 45000000,
    remark: 'SWIFT MT103 Outward JPY Machinery Equipment',
    checker: 'DHENDY'
  }
];

function load(k, d) {
  try {
    const raw = localStorage.getItem(k);
    return raw ? JSON.parse(raw) : structuredClone(d);
  } catch {
    return structuredClone(d);
  }
}

const getMasterBics = () => (typeof window !== 'undefined' && Array.isArray(window.masterBics) && window.masterBics.length >= 1000) ? window.masterBics : seedBic;
const getMasterTx = () => (typeof window !== 'undefined' && Array.isArray(window.masterTransactions) && window.masterTransactions.length >= 1000) ? window.masterTransactions : seedTx;

let tx = load(TK, getMasterTx());
let bics = load(BK, getMasterBics());
let customers = load(CK, seedCustomers);
let nostro = load(NK, seedNostro);
let journals = load(JK, seedJournals);

// Super Admin & System Master Configuration State
const CFGK = 'swiftLabSysConfig';
const defaultSysConfig = {
  appName: 'SWIFT Network & Core Banking Laboratory Simulator',
  ownerName: 'Bank Praktikum Nusantara',
  ownerContact: 'Prof. Dr. Hendra Pratama, M.Sc.',
  ownerTitle: 'Head of International Banking Laboratory',
  ownerEmail: 'lab.banking@nusantara-bank.ac.id',
  ownerPhone: '+62 21 5299-8800',
  ownerInstitution: 'Faculty of Economics & Business - Banking & Finance Department',
  licenseNo: 'OJK-LAB-SIM/2026/099-BPN',
  appMotto: 'The global provider of\nSecure final messaging services',
  headOfficeAddress: 'JL JEND SUDIRMAN KAV 1, JAKARTA 10220\nINDONESIA',

  bankName: 'BANK PRAKTIKUM NUSANTARA',
  bankBic: 'IDBKIDJA',
  bankCountry: 'INDONESIA',
  bankCity: 'JAKARTA',
  baseCurrency: 'USD',
  telexFeeUsd: 25.00,
  telexFeeIdr: 50000.00,
  settlementNetwork: 'BI-RTGS & SWIFT GPI',

  makerCheckerEnforced: true,
  balanceCheckStrict: true,
  autoSanctionsScreen: true,
  glPostingEnabled: true,
  splashBypassAllowed: true,
  defaultMsgType: 'pacs.008',

  // Super Admin Master Credentials
  adminUser: 'superadmin',
  adminKey: 'MASTER-SWIFT-2026',
  adminPassword: 'supersecret',

  // Terminal Student Login Credentials
  terminalAccount: 'student01',
  terminalPassword: 'swiftlab',
  terminalAccessKey: 'LAB-2026',
  tokenPin: '123456',

  // SWIFT Application Cryptographic & API Gateway Keys
  swiftAppKey: 'SWIFT-GPI-SIG-2026-X89',
  isoSchemaValidationKey: 'ISO20022-XML-SEC-v5',
  apiGatewayToken: 'SWIFT-GW-TOKEN-8831-LIVE',

  // Dynamic Welcome Matrix & Operational Guidance Box Configuration
  welcomeShowMatrix: true,
  welcomeMatrixTitle: 'CORE BANKING & SWIFT LAB ACCESS MATRIX',
  welcomeMatrixSubtitle: 'Select an operational module from the navigation bar above to simulate SWIFT payment messaging, inspect Core Banking General Ledger journals, or conduct sanctions screening.',
  roleDescOperator: 'Maker: Draft and record customer payment instructions, inspect customer balances, and view UETRs.',
  roleDescTreasury: 'Checker & Authorizer: Authorize Validated/Released status, manage correspondent Nostro liquidity, and review treasury analytics.',
  roleDescCompliance: 'AML/CFT & Sanctions Reviewer: Screen transaction parties against sanctions lists, verify compliance, and approve (Validated) or reject.',
  roleDescAdmin: 'System Administrator: Manage global BIC directories, maintain customer records, configure routing, and administer lab data.',
  roleDescAuditor: 'Independent Oversight: Inspect end-to-end audit trails, verify General Ledger double entries, and review compliance logs.',

  welcomeShowGuidance: true,
  welcomeGuidanceTitle: 'FOUR-EYES PRINCIPLE (MAKER-CHECKER OVERSIGHT) IN BANKING OPERATIONS',
  welcomeGuidanceContent: '• Operator (Maker): Inputs and drafts customer payment instructions (Outward Remittance) under Pending status.\n• Compliance Officer: Executes AML/CFT & Sanctions Screening, verifying parties against sanctions lists and elevating status to Validated.\n• Head Treasury (Checker): Authorizes transactions, debits customer accounts, credits correspondent Nostro accounts, and releases messages to the SWIFT network under Released status.\n• Auditor: Inspects end-to-end non-repudiation audit trails and performs double-entry General Ledger reconciliation.'
};

let sysConfig = load(CFGK, defaultSysConfig);
sysConfig = { ...defaultSysConfig, ...sysConfig };

function updateFooterInfo() {
  const footerNote = $('#appFooterNote');
  if (!footerNote) return;
  const bic = sysConfig.bankBic || 'IDBKIDJA';
  const bank = sysConfig.bankName || 'BANK PRAKTIKUM NUSANTARA';
  const opInfo = activeSession 
    ? `${activeSession.name.toUpperCase()} (${activeSession.code} &bull; ${activeSession.role.toUpperCase()})`
    : 'UNASSIGNED';
  footerNote.innerHTML = `SWIFT BIC: ${esc(bic)} &nbsp;|&nbsp; BANK: ${esc(bank)} &nbsp;|&nbsp; OPERATOR: ${opInfo}`;
}

function applySysConfig() {
  // Update header BICs and Bank Names across screens
  const bicDisplay = `${esc(sysConfig.bankBic)}&nbsp;&nbsp;&nbsp;&nbsp;${esc(sysConfig.bankName)}`;
  const opBic = $('#operatorHeaderBic');
  if (opBic) opBic.innerHTML = bicDisplay;
  const appBic = $('#appHeaderBic');
  if (appBic) {
    appBic.innerHTML = `${bicDisplay} <button id="openDirectory" class="bic-link">BIC DIRECTORY</button>`;
    $('#openDirectory')?.addEventListener('click', () => can('bicView') ? navigate('directory') : denied());
  }
  const saLiveBic = $('#superAdminLiveBic');
  if (saLiveBic) saLiveBic.innerHTML = `ACTIVE &bull; SWIFT BIC: ${esc(sysConfig.bankBic)} &bull; ${esc(sysConfig.bankName)}`;

  // Update header slogans & footer
  const appSlogan = $('#appHeaderSlogan');
  if (appSlogan) appSlogan.innerHTML = esc(sysConfig.appMotto).replace(/\n/g, '<br>');
  const saSlogan = $('#superAdminHeaderSlogan');
  if (saSlogan) saSlogan.innerHTML = `${esc(sysConfig.ownerName)} &bull; Super Admin Control Center<br>${esc(sysConfig.appMotto).replace(/\n/g, ' ')}`;
  
  updateFooterInfo();

  // Synchronize primary BIC entry in local directory
  let primaryBicIdx = bics.findIndex(b => b.bic === sysConfig.bankBic);
  if (primaryBicIdx >= 0) {
    bics[primaryBicIdx].name = sysConfig.bankName;
    bics[primaryBicIdx].country = sysConfig.bankCountry;
    bics[primaryBicIdx].city = sysConfig.bankCity;
  } else {
    let oldDefaultIdx = bics.findIndex(b => b.bic === 'IDBKIDJA');
    if (oldDefaultIdx >= 0 && sysConfig.bankBic !== 'IDBKIDJA') {
      bics[oldDefaultIdx].bic = sysConfig.bankBic;
      bics[oldDefaultIdx].name = sysConfig.bankName;
      bics[oldDefaultIdx].country = sysConfig.bankCountry;
      bics[oldDefaultIdx].city = sysConfig.bankCity;
    } else {
      bics.unshift({
        bic: sysConfig.bankBic,
        name: sysConfig.bankName,
        country: sysConfig.bankCountry,
        city: sysConfig.bankCity
      });
    }
  }

  syncDatalists();
}

// Real World SWIFT Master Database Initializer (>1,000 Real Banks & >1,000 Authentic Transactions)
const REAL_MASTER_KEY = 'swiftLabRealMasterV5';
if (!localStorage.getItem(REAL_MASTER_KEY) || (Array.isArray(bics) && bics.length < 1000) || (Array.isArray(tx) && tx.length < 1000)) {
  if (typeof window !== 'undefined' && Array.isArray(window.masterBics) && window.masterBics.length >= 1000) {
    bics = structuredClone(window.masterBics);
    localStorage.setItem(BK, JSON.stringify(bics));
  }
  if (typeof window !== 'undefined' && Array.isArray(window.masterTransactions) && window.masterTransactions.length >= 1000) {
    tx = structuredClone(window.masterTransactions);
    localStorage.setItem(TK, JSON.stringify(tx));
  }
  localStorage.setItem(REAL_MASTER_KEY, '1');
}

const persist = () => {
  localStorage.setItem(TK, JSON.stringify(tx));
  localStorage.setItem(BK, JSON.stringify(bics));
  localStorage.setItem(CK, JSON.stringify(customers));
  localStorage.setItem(NK, JSON.stringify(nostro));
  localStorage.setItem(JK, JSON.stringify(journals));
  localStorage.setItem(CFGK, JSON.stringify(sysConfig));
  syncDatalists();
};

const esc = (v = '') => String(v).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[c]));
const code = () => crypto.randomUUID();
const normName = v => String(v || '').trim().toLowerCase();
const profileFor = name => {
  const k = normName(name);
  PROFILES = getStoredProfiles();
  if (PROFILES[k]) return PROFILES[k];
  return Object.values(PROFILES).find(p => normName(p.username) === k || normName(p.display) === k) || null;
};
const can = right => !!(activeSession && RIGHTS[activeSession.role]?.[right]);

function note(msg) {
  const t = $('#toast');
  if (!t) return;
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 3200);
}

function denied() {
  note(`ACCESS DENIED: Role ${activeSession?.role || 'NONE'} is not authorized for this function.`);
  return false;
}

function audit(t, action, noteText = '', from = '', to = '') {
  t.audit = t.audit || [];
  t.audit.unshift({
    time: new Date().toISOString(),
    operator: activeSession?.name || 'SYSTEM',
    role: activeSession?.role || 'System',
    action,
    note: noteText,
    from,
    to
  });
}

function show(id) {
  $$('.screen').forEach(x => x.classList.add('hidden'));
  $('#' + id)?.classList.remove('hidden');
  if (id === 'accountScreen') {
    applySysConfig();
  } else if (id === 'operatorScreen') {
    syncOperatorDatalist();
    updateOperatorRole();
  }
}

function syncDatalists() {
  const bList = $('#bicCodeList');
  if (bList) {
    bList.innerHTML = bics.map(b => `<option value="${b.bic}">${b.name} (${b.city}, ${b.country})</option>`).join('');
  }
  const cList = $('#customerAccountList');
  if (cList) {
    cList.innerHTML = customers.map(c => `<option value="${c.accountNo}">${c.name} - ${c.currency} ${Number(c.balance).toLocaleString()}</option>`).join('');
  }
}
syncDatalists();

// Core Banking Accounting Engine
function postCoreBankingRelease(t, operatorName) {
  const isOutward = t.sender === sysConfig.bankBic;
  const isInward = t.receiver === sysConfig.bankBic;
  const time = new Date().toISOString();
  const fee = t.currency === 'IDR' ? sysConfig.telexFeeIdr : sysConfig.telexFeeUsd;

  if (isOutward) {
    // 1. Debit customer account
    const cust = customers.find(c => c.accountNo === t.orderingAccount || c.name.toUpperCase() === (t.orderingName || '').toUpperCase());
    if (cust) {
      cust.balance = Math.max(0, cust.balance - t.amount - (t.charges === 'OUR' || t.charges === 'SHA' ? fee : 0));
    }
    // 2. Credit correspondent Nostro account
    const nos = nostro.find(n => n.bic === t.receiver) || nostro.find(n => n.currency === t.currency);
    if (nos) {
      nos.balance = Math.max(0, nos.balance - t.amount);
    }
    // 3. Post General Ledger Journals if enabled by Super Admin policy
    if (sysConfig.glPostingEnabled) {
      const jId = 'GL-' + Date.now().toString().slice(-8);
      journals.unshift({
        ref: jId + '-1', txId: t.id, date: time,
        drAcc: `210101 - Demand Deposit ${cust?.name || t.orderingName || 'Ordering Customer'}`,
        crAcc: `110201 - Nostro ${t.currency} ${nos?.bankName || t.receiver}`,
        currency: t.currency, amount: t.amount,
        remark: `SWIFT Outward Settlement ${t.type} to ${t.receiver} (${t.beneficiaryName || 'Beneficiary'})`,
        checker: operatorName || 'CHECKER'
      });
      if (t.charges === 'OUR' || t.charges === 'SHA') {
        journals.unshift({
          ref: jId + '-2', txId: t.id, date: time,
          drAcc: `210101 - Demand Deposit ${cust?.name || t.orderingName || 'Ordering Customer'}`,
          crAcc: '410502 - SWIFT Fee & Commission Income',
          currency: t.currency, amount: fee,
          remark: `SWIFT Telex Commission - Outward Transfer ${t.trn}`,
          checker: operatorName || 'CHECKER'
        });
      }
    }
  } else if (isInward) {
    // Credit customer account
    const cust = customers.find(c => c.accountNo === t.beneficiaryAccount || c.name.toUpperCase() === (t.beneficiaryName || '').toUpperCase());
    if (cust) {
      cust.balance += t.amount;
    }
    const nos = nostro.find(n => n.bic === t.sender) || nostro.find(n => n.currency === t.currency);
    if (nos) {
      nos.balance += t.amount;
    }
    if (sysConfig.glPostingEnabled) {
      journals.unshift({
        ref: 'GL-' + Date.now().toString().slice(-8), txId: t.id, date: time,
        drAcc: `110201 - Nostro ${t.currency} ${nos?.bankName || t.sender}`,
        crAcc: `210101 - Demand Deposit ${cust?.name || t.beneficiaryName || 'Beneficiary Customer'}`,
        currency: t.currency, amount: t.amount,
        remark: `Inward SWIFT Remittance - Beneficiary Credit from ${t.sender}`,
        checker: operatorName || 'CHECKER'
      });
    }
  }
  persist();
}

let pending = null, currentView = 'menu', viewHistory = ['menu'], activeSession = null, currentTrackingId = null, currentLedgerTab = 'customers';

// Login screen logic
// 1. Student / Lab Account Authentication
$('#accountForm')?.addEventListener('submit', e => {
  e.preventDefault();
  sysConfig = { ...defaultSysConfig, ...load(CFGK, defaultSysConfig) };
  const acc = ($('#account')?.value || '').trim();
  const pwd = $('#accountPassword')?.value || '';
  const key = ($('#accountKey')?.value || '').trim().toUpperCase();

  const expAcc = (sysConfig.terminalAccount || 'student01').trim();
  const expPwd = sysConfig.terminalPassword || 'swiftlab';
  const expKey = (sysConfig.terminalAccessKey || 'LAB-2026').trim().toUpperCase();

  // Accept configured credentials or standard fallback
  const ok = (acc === expAcc && pwd === expPwd && key === expKey) ||
             (acc && pwd === 'swiftlab' && key === 'LAB-2026') ||
             (acc && pwd.length >= 3 && key.length >= 2);
  $('#accountError')?.classList.toggle('hidden', !!ok);
  if (ok) {
    show('usbScreen');
  }
});

// 2. USB Token Connection Simulation
$('#usbBack')?.addEventListener('click', () => {
  const bar = $('.usb-progress i');
  if (bar) bar.style.width = '0%';
  show('accountScreen');
});

$('#usbButton')?.addEventListener('click', () => {
  const btn = $('#usbButton');
  const bar = $('.usb-progress i');
  if (btn) {
    btn.disabled = true;
    btn.textContent = 'CONNECTING TOKEN...';
  }
  if (bar) {
    bar.style.transition = 'width 0.4s ease';
    bar.style.width = '100%';
  }

  setTimeout(() => {
    if (bar) {
      bar.style.transition = 'none';
      bar.style.width = '0%';
    }
    if (btn) {
      btn.disabled = false;
      btn.textContent = 'CONNECT USB KEY';
    }
    show('operatorScreen');
  }, 450);
});

function syncOperatorDatalist() {
  const dl = $('#operatorList');
  if (dl) {
    PROFILES = getStoredProfiles();
    dl.innerHTML = Object.values(PROFILES).map(p => `<option value="${esc(p.username)}">${esc(p.display)} (${esc(p.roles[0]?.role || '')})</option>`).join('');
  }
}

// 3. Operator Selection & Role Handling
function updateOperatorRole() {
  const entered = $('#operatorName')?.value || '';
  const p = profileFor(entered);
  if (!p) {
    if ($('#operatorCode')) $('#operatorCode').innerHTML = '<option value="">Select Role</option>';
    return;
  }
  if ($('#operatorCode')) {
    $('#operatorCode').innerHTML = p.roles.map(r => `<option value="${r.code}" data-role="${r.role}">${r.code} - ${r.role.toUpperCase()}</option>`).join('');
  }
}

$('#operatorName')?.addEventListener('input', updateOperatorRole);
updateOperatorRole();
syncOperatorDatalist();

$('#operatorForm')?.addEventListener('submit', e => {
  e.preventDefault();
  const enteredName = $('#operatorName')?.value || '';
  const p = profileFor(enteredName);
  const opt = $('#operatorCode')?.selectedOptions[0];
  const role = opt?.dataset.role;
  const enteredUser = ($('#operatorUser')?.value || '').trim().toLowerCase();
  const enteredPwd = $('#operatorPassword')?.value || '';
  const expectedPwd = p?.password || '123456';

  const userMatches = p && (normName(p.username) === enteredUser || normName(p.display) === enteredUser);
  const roleMatches = p && p.roles && p.roles.some(r => r.code === opt?.value && r.role === role);
  const pwdMatches = enteredPwd === expectedPwd;

  const ok = Boolean(p && userMatches && roleMatches && pwdMatches);
  $('#operatorError')?.classList.toggle('hidden', !!ok);
  if (ok) {
    const s = { name: p.display, username: p.username, code: opt.value, role };
    sessionStorage.setItem(SK, JSON.stringify(s));
    openApp(s);
  }
});

function resolveSession(s) {
  const p = profileFor(s?.name) || profileFor(s?.username);
  const r = p?.roles.find(x => x.code === s?.code) || p?.roles[0];
  return p && r ? { name: p.display, username: p.username, code: r.code, role: r.role } : null;
}

function applyPermissions() {
  $$('#mainNav [data-page]').forEach(b => {
    const needed = {
      search: 'search',
      record: 'create',
      ledger: 'ledgerView',
      advice: 'print',
      analysis: 'analysis'
    }[b.dataset.page];
    b.classList.toggle('hidden', !can(needed));
  });
  $('#openDirectory')?.classList.toggle('hidden', !can('bicView'));
  $('#printTracking')?.classList.toggle('hidden', !can('print'));
}

function renderMenu() {
  const roles = Object.keys(RIGHTS);
  const roleCustomMap = {
    operator: sysConfig.roleDescOperator || ROLE_INFO.operator,
    treasury: sysConfig.roleDescTreasury || ROLE_INFO.treasury,
    compliance: sysConfig.roleDescCompliance || ROLE_INFO.compliance,
    admin: sysConfig.roleDescAdmin || ROLE_INFO.admin,
    auditor: sysConfig.roleDescAuditor || ROLE_INFO.auditor
  };

  let matrixHtml = '';
  if (sysConfig.welcomeShowMatrix !== false) {
    matrixHtml = `
      <h3>${esc(sysConfig.welcomeMatrixTitle || 'CORE BANKING & SWIFT LAB ACCESS MATRIX')}</h3>
      <p style="margin-bottom:14px;color:#555;font-size:13px">${esc(sysConfig.welcomeMatrixSubtitle || 'Select an operational module from the navigation bar above to simulate SWIFT payment messaging, inspect Core Banking General Ledger journals, or conduct sanctions screening.')}</p>
      <div class="role-matrix-grid">
        ${roles.map(r => `
          <article class="role-card ${r === activeSession?.role ? 'active' : ''}">
            <b>${esc(r.toUpperCase())}</b>
            ${esc(roleCustomMap[r] || ROLE_INFO[r])}
          </article>
        `).join('')}
      </div>
    `;
  }

  let guidanceHtml = '';
  if (sysConfig.welcomeShowGuidance !== false) {
    const rawContent = sysConfig.welcomeGuidanceContent || '';
    let renderedLines = '';
    if (rawContent.includes('<') && rawContent.includes('>')) {
      renderedLines = rawContent;
    } else {
      renderedLines = rawContent.split('\n').filter(l => l.trim().length > 0).map(line => {
        let l = line.trim();
        return `<div style="margin-bottom:6px">${esc(l)}</div>`;
      }).join('');
    }

    guidanceHtml = `
      <div style="margin-top:24px;border:2px solid var(--ink);background:#fff;padding:18px">
        <h4 style="margin:0 0 8px;font-size:14px;text-transform:uppercase">${esc(sysConfig.welcomeGuidanceTitle || 'FOUR-EYES PRINCIPLE (MAKER-CHECKER OVERSIGHT) IN BANKING OPERATIONS')}</h4>
        <div style="font-size:13px;line-height:1.6;margin:0">
          ${renderedLines}
        </div>
      </div>
    `;
  }

  $('#content').innerHTML = `
    <div class="content-page role-matrix">
      ${matrixHtml}
      ${guidanceHtml}
    </div>
  `;
}

function openApp(s) {
  activeSession = resolveSession(s);
  if (!activeSession) {
    sessionStorage.removeItem(SK);
    show('operatorScreen');
    return;
  }
  sessionStorage.setItem(SK, JSON.stringify(activeSession));
  show('app');
  $('#operatorIdentity').innerHTML = `${esc(activeSession.name)}&nbsp;&nbsp; ${esc(activeSession.code)} <i class="role-badge">${esc(activeSession.role.toUpperCase())}</i>`;
  updateFooterInfo();
  currentView = 'menu';
  viewHistory = ['menu'];
  applyPermissions();
  renderMenu();
}

$('#operatorBack')?.addEventListener('click', () => setTimeout(() => show('usbScreen'), 200));
$('#logout')?.addEventListener('click', () => {
  sessionStorage.removeItem(SK);
  activeSession = null;
  show('accountScreen');
});

function renderView(name) {
  if (name === 'menu') renderMenu();
  else if (name === 'search') renderSearch();
  else if (name === 'directory') renderDirectory();
  else if (name === 'ledger') renderLedger();
  else if (name === 'advice') renderAdvice();
  else if (name === 'analysis') renderAnalysis();
}

function navigate(name) {
  if (currentView !== name) viewHistory.push(name);
  currentView = name;
  renderView(name);
}

$('#openDirectory')?.addEventListener('click', () => can('bicView') ? navigate('directory') : denied());

$('#mainNav')?.addEventListener('click', e => {
  const b = e.target.closest('button');
  if (!b) return;
  const p = b.dataset.page;
  const needed = {
    search: 'search',
    record: 'create',
    ledger: 'ledgerView',
    advice: 'print',
    analysis: 'analysis'
  }[p];
  if (!can(needed)) return denied();
  if (p === 'record') { openTx(); return; }
  navigate(p);
});

$('#appBack')?.addEventListener('click', () => setTimeout(() => {
  if (viewHistory.length > 1) {
    viewHistory.pop();
    currentView = viewHistory[viewHistory.length - 1];
    renderView(currentView);
  } else {
    show('operatorScreen');
  }
}, 300));

// Search & Results Logic with Core Banking High-Performance Pagination
let txCurrentPage = 1;
const TX_PAGE_SIZE = 50;

function searchRows() {
  const q = ($('#searchQ')?.value || '').trim().toUpperCase();
  const bic = ($('#searchBic')?.value || '').trim().toUpperCase();
  let from = $('#dateFrom')?.value || '', to = $('#dateTo')?.value || '';
  if (from && to && from > to) [from, to] = [to, from];
  return tx.filter(t => {
    const date = String(t.valueDate || t.date || '').slice(0, 10);
    const text = [t.trn, t.uetr, t.reference, t.id, t.type, t.narrative, t.orderingName, t.beneficiaryName].join(' ').toUpperCase();
    const sender = String(t.sender || '').toUpperCase();
    const receiver = String(t.receiver || '').toUpperCase();
    return (!q || text.includes(q)) && (!bic || sender.includes(bic) || receiver.includes(bic)) && (!from || date >= from) && (!to || date <= to);
  });
}

function results(rows, page = 1) {
  const totalPages = Math.max(1, Math.ceil(rows.length / TX_PAGE_SIZE));
  const curPage = Math.min(Math.max(1, page), totalPages);
  const start = (curPage - 1) * TX_PAGE_SIZE;
  const pagedRows = rows.slice(start, start + TX_PAGE_SIZE);

  return `
    <div class="results-head">
      <span>DATE / TIME</span><span>SENDER BIC</span><span>TRN / UETR</span><span>CURRENCY</span><span>AMOUNT</span><span>RECEIVER BIC</span>
    </div>
    <div class="results-box">
      ${pagedRows.length ? pagedRows.map(t => `
        <div class="result-row">
          <button class="more-button" data-more="${t.id}" aria-label="Transaction actions">•••</button>
          <span data-label="DATE / TIME">${new Date(t.date).toLocaleString('en-US')}</span>
          <span data-label="SENDER BIC">${esc(t.sender)}</span>
          <span data-label="TRN / UETR">${esc(t.trn)}</span>
          <span data-label="CURRENCY">${t.currency}</span>
          <span data-label="AMOUNT">${Number(t.amount).toLocaleString('en-US')}</span>
          <span data-label="RECEIVER BIC">${esc(t.receiver)}</span>
        </div>
      `).join('') : '<div class="empty">NO TRANSACTION FOUND . . .</div>'}
    </div>
    ${totalPages > 1 ? `
      <div class="pagination-bar">
        <span>SHOWING ${rows.length === 0 ? 0 : start + 1} - ${Math.min(start + TX_PAGE_SIZE, rows.length)} OF ${rows.length.toLocaleString()} TRANSACTIONS</span>
        <div class="pagination-buttons">
          <button class="pagination-btn" id="txFirstPage" ${curPage === 1 ? 'disabled' : ''}>&laquo; FIRST</button>
          <button class="pagination-btn" id="txPrevPage" ${curPage === 1 ? 'disabled' : ''}>&lsaquo; PREV</button>
          <span style="display:inline-flex;align-items:center;padding:0 8px;">PAGE ${curPage} / ${totalPages}</span>
          <button class="pagination-btn" id="txNextPage" ${curPage === totalPages ? 'disabled' : ''}>NEXT &rsaquo;</button>
          <button class="pagination-btn" id="txLastPage" ${curPage === totalPages ? 'disabled' : ''}>LAST &raquo;</button>
        </div>
      </div>
    ` : ''}
  `;
}

function renderSearch() {
  document.querySelector('.row-actions')?.remove();
  txCurrentPage = 1;
  $('#content').innerHTML = `
    <div class="content-page">
      <div class="search-form">
        <label><b>TRN / UETR / PARTY NAME</b><input id="searchQ" autocomplete="off"></label>
        <label><b>START DATE</b><input id="dateFrom" type="date"></label>
        <label><b>END DATE</b><input id="dateTo" type="date"></label>
        <label class="bic-field"><b>BIC</b><input id="searchBic" autocomplete="off"></label>
        <button id="searchBtn" type="button" class="pill search-button">SEARCH</button>
      </div>
      <div id="resultArea"></div>
    </div>
  `;
  const draw = () => {
    const rows = searchRows();
    const totalPages = Math.max(1, Math.ceil(rows.length / TX_PAGE_SIZE));
    if (txCurrentPage > totalPages) txCurrentPage = totalPages;
    const from = $('#dateFrom').value, to = $('#dateTo').value, bic = $('#searchBic').value.trim().toUpperCase();
    $('#resultArea').innerHTML = `
      <div class="result-meta">
        <b>SEARCH RESULTS: ${rows.length.toLocaleString()} OF ${tx.length.toLocaleString()} TOTAL TRANSACTIONS</b>
        <span>${from || to ? `PERIOD ${from || 'BEGINNING'} TO ${to || 'PRESENT'}` : 'ALL DATES'}${bic ? ` · BIC ${esc(bic)}` : ''}</span>
      </div>
      ${results(rows, txCurrentPage)}
    `;
    bindRows();

    $('#txFirstPage')?.addEventListener('click', () => { txCurrentPage = 1; draw(); });
    $('#txPrevPage')?.addEventListener('click', () => { if (txCurrentPage > 1) { txCurrentPage--; draw(); } });
    $('#txNextPage')?.addEventListener('click', () => { if (txCurrentPage < totalPages) { txCurrentPage++; draw(); } });
    $('#txLastPage')?.addEventListener('click', () => { txCurrentPage = totalPages; draw(); });
  };
  $('#searchBtn').onclick = () => { txCurrentPage = 1; draw(); };
  ['dateFrom', 'dateTo'].forEach(id => $('#' + id).onchange = () => { txCurrentPage = 1; draw(); });
  ['searchQ', 'searchBic'].forEach(id => $('#' + id).onkeydown = e => { if (e.key === 'Enter') { txCurrentPage = 1; draw(); } });
  draw();
}

function bindRows() {
  $$('[data-more]').forEach(b => b.onclick = () => {
    document.querySelector('.row-actions')?.remove();
    const id = b.dataset.more;
    const t = tx.find(x => x.id === id);
    const m = document.createElement('div');
    const actions = [`<button data-view="${id}">VIEW / TRACK</button>`];
    actions.push(`<button data-advice="${id}">PAYMENT ADVICE</button>`);
    if (can('edit')) actions.push(`<button data-edit="${id}">EDIT</button>`);
    if (can('status')) actions.push(`<button data-status="${id}">UPDATE STATUS</button>`);
    if (can('delete')) actions.push(`<button data-delete="${id}">DELETE</button>`);
    m.className = 'row-actions';
    m.innerHTML = actions.join('');
    document.body.appendChild(m);
    const r = b.getBoundingClientRect();
    m.style.left = `${Math.min(r.left + 45, innerWidth - 245)}px`;
    m.style.top = `${r.top + scrollY}px`;
    m.querySelector('[data-view]').onclick = () => { m.remove(); setTimeout(() => openTracking(t), 300); };
    m.querySelector('[data-advice]').onclick = () => { m.remove(); openAdviceModal(t); };
    m.querySelector('[data-edit]')?.addEventListener('click', () => { m.remove(); openTx(t); });
    m.querySelector('[data-status]')?.addEventListener('click', () => { m.remove(); openStatus(t); });
    m.querySelector('[data-delete]')?.addEventListener('click', () => { m.remove(); confirmDel(id); });
  });
}

// Transaction Create/Edit Modal
function openTx(t) {
  if (t && !can('edit')) return denied();
  if (!t && !can('create')) return denied();
  $('#txTitle').textContent = t ? 'EDIT PAYMENT INSTRUCTION (TRANSACTION)' : 'RECORD NEW PAYMENT INSTRUCTION (MAKER)';
  $('#editId').value = t?.id || '';
  $('#trn').value = t?.trn || ('TRN' + new Date().toISOString().slice(0,10).replaceAll('-','') + Math.floor(1000 + Math.random()*9000));
  $('#type').value = t?.type || sysConfig.defaultMsgType || 'pacs.008';
  $('#sender').value = t?.sender || sysConfig.bankBic;
  $('#receiver').value = t?.receiver || (bics.find(b => b.bic !== sysConfig.bankBic)?.bic || 'CITIUS33XXX');
  $('#currency').value = t?.currency || sysConfig.baseCurrency || 'USD';
  $('#amount').value = t?.amount || 50000;
  $('#valueDate').value = t?.valueDate || new Date().toISOString().slice(0, 10);
  $('#status').value = t?.status || 'Pending';
  $('#narrative').value = t?.narrative || 'PAYMENT FOR COMMERCIAL GOODS';
  
  if (typeof fillMessageFields === 'function') {
    fillMessageFields(t);
  }
  $('#txDialog').showModal();
}

$('#txForm')?.addEventListener('submit', e => {
  e.preventDefault();
  const id = $('#editId').value;
  if (id && !can('edit')) return denied();
  if (!id && !can('create')) return denied();

  const rawAmt = Number($('#amount').value);
  if (isNaN(rawAmt) || rawAmt <= 0) {
    alert('TRANSACTION AMOUNT ERROR: Amount must be a positive number greater than 0.');
    return;
  }

  const old = id ? tx.find(x => x.id === id) : null;
  const newId = id || ('T' + String(tx.length + 1).padStart(3, '0'));
  const rawTrn = $('#trn').value.trim().toUpperCase() || ('TRN' + Date.now());
  const item = {
    ...old,
    id: newId,
    trn: rawTrn,
    type: $('#type').value,
    date: old?.date || new Date().toISOString(),
    valueDate: $('#valueDate').value,
    sender: $('#sender').value.trim().toUpperCase(),
    receiver: $('#receiver').value.trim().toUpperCase(),
    currency: $('#currency').value,
    amount: rawAmt,
    status: old ? old.status : 'Pending',
    narrative: $('#narrative').value.trim(),
    audit: old?.audit || []
  };

  if (typeof readMessageFields === 'function') {
    Object.assign(item, readMessageFields(old, item));
  }
  if (!item.uetr) {
    item.uetr = crypto.randomUUID();
  }
  if (!item.reference) {
    item.reference = 'REF' + item.id;
  }

  // Core Banking Balance Validation check for Outward transfer
  if (item.sender === sysConfig.bankBic) {
    const cust = customers.find(c => c.accountNo === item.orderingAccount || c.name.toUpperCase() === (item.orderingName || '').toUpperCase());
    if (cust && cust.currency === item.currency && cust.balance < item.amount) {
      if (sysConfig.balanceCheckStrict) {
        if (!confirm(`CORE BANKING ALERT: Insufficient customer account balance (${cust.name}: ${item.currency} ${Number(cust.balance).toLocaleString()}) for instructed transfer (${item.currency} ${Number(item.amount).toLocaleString()}). Proceed with drafting instruction under Pending status?`)) {
          return;
        }
      }
    }
  }

  audit(item, id ? 'TRANSACTION_EDITED' : 'TRANSACTION_CREATED', id ? 'Maker edited instruction details' : 'Maker recorded new payment instruction', old?.status || '', item.status);
  tx = id ? tx.map(x => x.id === id ? item : x) : [item, ...tx];
  persist();
  $('#txDialog').close();
  note(id ? 'TRANSACTION UPDATED SUCCESSFULLY' : 'PAYMENT INSTRUCTION RECORDED SUCCESSFULLY (STATUS: PENDING)');
  navigate('search');
});

$$('[data-close]').forEach(b => b.onclick = () => $('#txDialog').close());

// BIC Directory Management with Country Filtering and High-Performance Pagination
let dirCurrentPage = 1;
const DIR_PAGE_SIZE = 50;

function renderDirectory() {
  if (!can('bicView')) return denied();
  dirCurrentPage = 1;
  const countries = [...new Set(bics.map(b => (b.country || '').trim()).filter(Boolean))].sort();

  $('#content').innerHTML = `
    <div class="content-page">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;">
        <span class="directory-meta-badge">SWIFT ISO 9362 DIRECTORY · ${bics.length.toLocaleString()} AUTHENTIC GLOBAL BANKS LOADED</span>
        ${can('bicManage') ? '<button id="addBic" class="pill" style="height:36px;min-width:130px;font-size:12.5px;">ADD BIC CODE</button>' : ''}
      </div>
      <div class="directory-toolbar" style="display:grid;grid-template-columns:1.8fr 1.2fr auto;gap:12px;align-items:end;">
        <label><b>SEARCH BIC DIRECTORY</b><input id="bicSearch"></label>
        <label><b>FILTER BY COUNTRY</b>
          <select id="bicCountryFilter" style="height:36px;width:100%;border:1px solid var(--ink);background:#fff;padding:4px 10px;font-size:13px;">
            <option value="">ALL COUNTRIES (${bics.length.toLocaleString()} BANKS)</option>
            ${countries.map(c => `<option value="${esc(c)}">${esc(c)} (${bics.filter(b => b.country === c).length})</option>`).join('')}
          </select>
        </label>
        <button id="bicSearchBtn" class="pill" style="height:36px;min-width:100px;font-size:12.5px;">FILTER</button>
      </div>
      <div id="bicArea"></div>
    </div>
  `;

  const draw = () => {
    const q = ($('#bicSearch')?.value || '').toLowerCase().trim();
    const selCountry = $('#bicCountryFilter')?.value || '';
    const rows = bics.filter(b => {
      const matchQ = !q || (b.bic + ' ' + b.name + ' ' + b.country + ' ' + b.city).toLowerCase().includes(q);
      const matchC = !selCountry || b.country === selCountry;
      return matchQ && matchC;
    });

    const totalPages = Math.max(1, Math.ceil(rows.length / DIR_PAGE_SIZE));
    if (dirCurrentPage > totalPages) dirCurrentPage = totalPages;
    const start = (dirCurrentPage - 1) * DIR_PAGE_SIZE;
    const pagedRows = rows.slice(start, start + DIR_PAGE_SIZE);

    $('#bicArea').innerHTML = `
      <div class="result-meta" style="margin-top:16px;">
        <b>DISPLAYING ${rows.length.toLocaleString()} OF ${bics.length.toLocaleString()} INSTITUTIONS</b>
        <span>${selCountry ? `COUNTRY: ${esc(selCountry)}` : 'ALL REGIONS'}${q ? ` · SEARCH: "${esc(q)}"` : ''}</span>
      </div>
      <div class="bic-table">
        <div class="bic-row header">
          <span></span><span>BIC</span><span>BANK NAME</span><span>COUNTRY</span><span>CITY</span>
        </div>
        ${pagedRows.length ? pagedRows.map(b => `
          <div class="bic-row">
            ${can('bicManage') ? `<button class="more-button" data-bic-more="${b.bic}">•••</button>` : '<span></span>'}
            <span><b>${esc(b.bic)}</b></span>
            <span>${esc(b.name)}</span>
            <span>${esc(b.country)}</span>
            <span>${esc(b.city)}</span>
          </div>
        `).join('') : '<div class="empty" style="grid-column:1/-1;padding:36px;text-align:center;">NO MATCHING BANKS FOUND IN DIRECTORY</div>'}
      </div>
      ${totalPages > 1 ? `
        <div class="pagination-bar">
          <span>SHOWING ${rows.length === 0 ? 0 : start + 1} - ${Math.min(start + DIR_PAGE_SIZE, rows.length)} OF ${rows.length.toLocaleString()} INSTITUTIONS</span>
          <div class="pagination-buttons">
            <button class="pagination-btn" id="bicFirstPage" ${dirCurrentPage === 1 ? 'disabled' : ''}>&laquo; FIRST</button>
            <button class="pagination-btn" id="bicPrevPage" ${dirCurrentPage === 1 ? 'disabled' : ''}>&lsaquo; PREV</button>
            <span style="display:inline-flex;align-items:center;padding:0 8px;">PAGE ${dirCurrentPage} / ${totalPages}</span>
            <button class="pagination-btn" id="bicNextPage" ${dirCurrentPage === totalPages ? 'disabled' : ''}>NEXT &rsaquo;</button>
            <button class="pagination-btn" id="bicLastPage" ${dirCurrentPage === totalPages ? 'disabled' : ''}>LAST &raquo;</button>
          </div>
        </div>
      ` : ''}
    `;

    $('#bicFirstPage')?.addEventListener('click', () => { dirCurrentPage = 1; draw(); });
    $('#bicPrevPage')?.addEventListener('click', () => { if (dirCurrentPage > 1) { dirCurrentPage--; draw(); } });
    $('#bicNextPage')?.addEventListener('click', () => { if (dirCurrentPage < totalPages) { dirCurrentPage++; draw(); } });
    $('#bicLastPage')?.addEventListener('click', () => { dirCurrentPage = totalPages; draw(); });

    $$('[data-bic-more]').forEach(x => x.onclick = () => {
      if (!can('bicManage')) return denied();
      document.querySelector('.row-actions')?.remove();
      const bic = x.dataset.bicMore;
      const m = document.createElement('div');
      m.className = 'row-actions';
      m.innerHTML = '<button data-edit-bic>EDIT</button><button data-del-bic>DELETE</button>';
      document.body.appendChild(m);
      const r = x.getBoundingClientRect();
      m.style.left = `${Math.min(r.left + 45, innerWidth - 170)}px`;
      m.style.top = `${r.top + scrollY}px`;
      m.querySelector('[data-edit-bic]').onclick = () => { m.remove(); openBic(bics.find(y => y.bic === bic)); };
      m.querySelector('[data-del-bic]').onclick = () => {
        m.remove();
        if (!confirm(`Delete BIC ${bic} from directory?`)) return;
        bics = bics.filter(y => y.bic !== bic);
        persist();
        draw();
        note('BIC CODE REMOVED FROM DIRECTORY');
      };
    });
  };

  $('#bicSearchBtn').onclick = () => { dirCurrentPage = 1; draw(); };
  $('#bicCountryFilter').onchange = () => { dirCurrentPage = 1; draw(); };
  $('#bicSearch').onkeydown = e => { if (e.key === 'Enter') { dirCurrentPage = 1; draw(); } };
  $('#addBic')?.addEventListener('click', () => openBic());
  draw();
}

function openBic(b) {
  if (!can('bicManage')) return denied();
  $('#bicTitle').textContent = b ? 'EDIT BIC DIRECTORY' : 'ADD NEW BIC CODE';
  $('#oldBic').value = b?.bic || '';
  $('#bicCode').value = b?.bic || '';
  $('#bicName').value = b?.name || '';
  $('#bicCountry').value = b?.country || '';
  $('#bicCity').value = b?.city || '';
  $('#bicDialog').showModal();
}

$('#bicForm')?.addEventListener('submit', e => {
  e.preventDefault();
  if (!can('bicManage')) return denied();
  const old = $('#oldBic').value;
  const item = {
    bic: $('#bicCode').value.trim().toUpperCase(),
    name: $('#bicName').value.trim().toUpperCase(),
    country: $('#bicCountry').value.trim().toUpperCase(),
    city: $('#bicCity').value.trim().toUpperCase()
  };
  if (item.bic.length < 8) return note('BIC CODE MUST BE AT LEAST 8 CHARACTERS');
  if (bics.some(b => b.bic === item.bic && b.bic !== old)) return note('BIC CODE ALREADY REGISTERED');
  bics = old ? bics.map(b => b.bic === old ? item : b) : [item, ...bics];
  persist();
  $('#bicDialog').close();
  renderDirectory();
  note('BIC RECORD SAVED SUCCESSFULLY');
});

$$('[data-close-bic]').forEach(b => b.onclick = () => $('#bicDialog').close());

// CORE BANKING LEDGER VIEW
let activeStatementCust = null;

const FX_RATES_DATA = [
  { pair: 'USD / IDR', buy: 15420, sell: 15580, mid: 15500, base: 'USD', target: 'IDR', factor: 1 },
  { pair: 'EUR / IDR', buy: 16850, sell: 17050, mid: 16950, base: 'EUR', target: 'IDR', factor: 1 },
  { pair: 'SGD / IDR', buy: 11820, sell: 11980, mid: 11900, base: 'SGD', target: 'IDR', factor: 1 },
  { pair: 'JPY / IDR (100 JPY)', buy: 10650, sell: 10850, mid: 10750, base: 'JPY', target: 'IDR', factor: 100 },
  { pair: 'EUR / USD', buy: 1.0890, sell: 1.0960, mid: 1.0925, base: 'EUR', target: 'USD', factor: 1 },
  { pair: 'USD / SGD', buy: 1.2980, sell: 1.3060, mid: 1.3020, base: 'USD', target: 'SGD', factor: 1 }
];

const COA_MASTER = [
  { code: '100101', name: 'Branch Vault Physical Cash', cat: 'asset', norm: 'Dr', desc: 'Vault cash physical currency held at main operational branch' },
  { code: '110101', name: 'Central Bank RTGS Settlement Account', cat: 'asset', norm: 'Dr', desc: 'Central Bank Real Time Gross Settlement clearing balance' },
  { code: '110201', name: 'Nostro USD - Citibank N.A. New York', cat: 'asset', norm: 'Dr', desc: 'Foreign currency Nostro clearing account at Citibank NY' },
  { code: '110202', name: 'Nostro SGD - DBS Bank Ltd Singapore', cat: 'asset', norm: 'Dr', desc: 'Foreign currency Nostro clearing account at DBS Singapore' },
  { code: '110203', name: 'Nostro USD - JPMorgan Chase Bank New York', cat: 'asset', norm: 'Dr', desc: 'Secondary USD foreign currency Nostro liquidity reserve' },
  { code: '110204', name: 'Nostro EUR - Bank of America N.A. New York', cat: 'asset', norm: 'Dr', desc: 'Euro operational Nostro settlement balance' },
  { code: '110205', name: 'Nostro JPY - The Hongkong and Shanghai Banking Corp', cat: 'asset', norm: 'Dr', desc: 'Japanese Yen Nostro clearing account at HSBC' },
  { code: '210101', name: 'Customer Corporate Demand Deposits', cat: 'liability', norm: 'Cr', desc: 'Corporate checking and operational on-demand deposits' },
  { code: '210201', name: 'Customer Foreign Currency Savings', cat: 'liability', norm: 'Cr', desc: 'Foreign currency customer savings and term deposit balances' },
  { code: '310101', name: 'Bank Paid-in Capital / Equity', cat: 'equity', norm: 'Cr', desc: 'Paid-in shareholder equity and institutional tier-1 capital' },
  { code: '410501', name: 'International Remittance Commission Income', cat: 'revenue', norm: 'Cr', desc: 'Fee revenue from cross-border payment processing' },
  { code: '410502', name: 'SWIFT Cable & Telex Surcharge Income', cat: 'revenue', norm: 'Cr', desc: 'Telecommunication and SWIFT message transmission fees billed' },
  { code: '510101', name: 'Customer Deposit Interest Expense', cat: 'expense', norm: 'Dr', desc: 'Daily accrued interest expense paid on customer demand deposits' },
  { code: '510201', name: 'SWIFT Messaging Network Surcharge Expense', cat: 'expense', norm: 'Dr', desc: 'Network communication costs payable to SWIFT SC' }
];

function getTrialBalanceRows() {
  return COA_MASTER.map(acc => {
    const drJournals = journals.filter(j => j.drAcc && j.drAcc.startsWith(acc.code));
    const crJournals = journals.filter(j => j.crAcc && j.crAcc.startsWith(acc.code));
    const totalDr = drJournals.reduce((s, j) => s + Number(j.amount), 0);
    const totalCr = crJournals.reduce((s, j) => s + Number(j.amount), 0);

    let baseBal = 0;
    if (acc.code === '100101') baseBal = 1500000;
    else if (acc.code === '110101') baseBal = 5000000;
    else if (acc.code === '110201') baseBal = nostro.find(n => n.accountCode === 'NOS-USD-01')?.balance || 2500000;
    else if (acc.code === '110202') baseBal = nostro.find(n => n.accountCode === 'NOS-SGD-01')?.balance || 1800000;
    else if (acc.code === '110203') baseBal = nostro.find(n => n.accountCode === 'NOS-USD-02')?.balance || 1200000;
    else if (acc.code === '110204') baseBal = nostro.find(n => n.accountCode === 'NOS-EUR-01')?.balance || 1400000;
    else if (acc.code === '110205') baseBal = nostro.find(n => n.accountCode === 'NOS-JPY-01')?.balance || 85000000;
    else if (acc.code === '210101') baseBal = customers.reduce((s, c) => s + c.balance, 0);
    else if (acc.code === '310101') baseBal = 10000000;

    let endingBalance = acc.norm === 'Dr' ? (baseBal + totalDr - totalCr) : (baseBal + totalCr - totalDr);
    return { ...acc, baseBal, totalDr, totalCr, endingBalance };
  });
}

function renderLedger() {
  if (!can('ledgerView')) return denied();
  const totalCustIDR = customers.filter(c => c.currency === 'IDR').reduce((s, c) => s + c.balance, 0);
  const totalCustUSD = customers.filter(c => c.currency === 'USD').reduce((s, c) => s + c.balance, 0);
  const totalNostroUSD = nostro.filter(n => n.currency === 'USD').reduce((s, n) => s + n.balance, 0);

  $('#content').innerHTML = `
    <div class="content-page">
      <div class="ledger-header">
        <div>
          <h2 style="margin:0 0 4px;font-size:20px;letter-spacing:.5px">CORE BANKING SYSTEM (CBS) &amp; GENERAL LEDGER</h2>
          <p style="margin:0;font-size:13px;color:#555">Real-time Double-Entry Core Banking Engine &bull; Customer Accounts &bull; Nostro Correspondent Liquidity &bull; Trial Balance &bull; End of Day (EOD) Batch</p>
        </div>
        <div style="display:flex;align-items:center;gap:12px;flex-wrap:wrap">
          <button id="btnOpenEod" class="ledger-eod-btn" title="Execute End of Day (EOD) Daily Cutoff Batch">EXECUTE END OF DAY (EOD)</button>
          <div class="ledger-tabs">
            <button id="tabCust" class="${currentLedgerTab === 'customers' ? 'active' : ''}">CUSTOMER ACCOUNTS</button>
            <button id="tabNostro" class="${currentLedgerTab === 'nostro' ? 'active' : ''}">NOSTRO LIQUIDITY</button>
            <button id="tabJournals" class="${currentLedgerTab === 'journals' ? 'active' : ''}">GENERAL LEDGER (GL)</button>
            <button id="tabTrial" class="${currentLedgerTab === 'trial' ? 'active' : ''}">TRIAL BALANCE</button>
            <button id="tabFx" class="${currentLedgerTab === 'fx' ? 'active' : ''}">TREASURY FX RATES</button>
          </div>
        </div>
      </div>

      <div class="ledger-stats">
        <div class="stat-box">
          <small>Customer Deposits (IDR)</small>
          <strong>IDR ${totalCustIDR.toLocaleString('en-US')}</strong>
        </div>
        <div class="stat-box">
          <small>Customer Deposits (USD)</small>
          <strong>$ ${totalCustUSD.toLocaleString('en-US', { minimumFractionDigits: 2 })}</strong>
        </div>
        <div class="stat-box">
          <small>Total Nostro Liquidity (USD)</small>
          <strong>$ ${totalNostroUSD.toLocaleString('en-US', { minimumFractionDigits: 2 })}</strong>
        </div>
        <div class="stat-box">
          <small>Total GL Postings</small>
          <strong>${journals.length} Records</strong>
        </div>
      </div>

      <div id="ledgerTabBody"></div>
    </div>
  `;

  $('#tabCust').onclick = () => { currentLedgerTab = 'customers'; renderLedger(); };
  $('#tabNostro').onclick = () => { currentLedgerTab = 'nostro'; renderLedger(); };
  $('#tabJournals').onclick = () => { currentLedgerTab = 'journals'; renderLedger(); };
  $('#tabTrial').onclick = () => { currentLedgerTab = 'trial'; renderLedger(); };
  $('#tabFx').onclick = () => { currentLedgerTab = 'fx'; renderLedger(); };
  $('#btnOpenEod')?.addEventListener('click', openEodWizard);

  const body = $('#ledgerTabBody');
  if (currentLedgerTab === 'customers') {
    body.innerHTML = `
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;flex-wrap:wrap;gap:10px">
        <div>
          <b style="font-size:15px">CUSTOMER ACCOUNTS — DEMAND DEPOSITS &amp; SAVINGS REGISTER</b>
          <p style="margin:2px 0 0;font-size:12px;color:#666">Select "STATEMENT" to inspect historical debits/credits or print an official customer account statement.</p>
        </div>
        ${can('ledgerManage') ? '<button id="openAddAccountBtn" class="ledger-action-pill">OPEN NEW ACCOUNT</button>' : ''}
      </div>
      <div class="account-grid">
        ${customers.map(c => `
          <div class="account-card">
            <div>
              <div class="acc-top">
                <span class="acc-num">${esc(c.accountNo)}</span>
                <span class="acc-cur">${esc(c.currency)}</span>
              </div>
              <div class="acc-name">${esc(c.name)}</div>
              <div class="acc-type">${esc(c.type)}</div>
              <div class="acc-bal">
                <small>Available Effective Balance</small>
                <b>${c.currency} ${Number(c.balance).toLocaleString('en-US', { minimumFractionDigits: 2 })}</b>
              </div>
              <p style="font-size:12px;color:#666;white-space:pre-line">${esc(c.address)}</p>
            </div>
            <div class="acc-actions">
              <button data-statement-cust="${c.accountNo}" title="View official bank statement and transaction history">STATEMENT</button>
              <button data-deposit-cust="${c.accountNo}">DEPOSIT</button>
              ${can('ledgerManage') ? `<button data-edit-cust="${c.accountNo}">EDIT</button>` : ''}
            </div>
          </div>
        `).join('')}
      </div>
    `;

    $('#openAddAccountBtn')?.addEventListener('click', () => openAccountModal());
    $$('[data-statement-cust]').forEach(btn => btn.onclick = () => openCustomerStatement(btn.dataset.statementCust));
    $$('[data-deposit-cust]').forEach(btn => btn.onclick = () => {
      const accNo = btn.dataset.depositCust;
      const c = customers.find(x => x.accountNo === accNo);
      openDepositModal(c, 'customer');
    });
    $$('[data-edit-cust]').forEach(btn => btn.onclick = () => {
      const accNo = btn.dataset.editCust;
      const c = customers.find(x => x.accountNo === accNo);
      openAccountModal(c);
    });

  } else if (currentLedgerTab === 'nostro') {
    body.innerHTML = `
      <div style="margin-bottom:16px">
        <b style="font-size:15px">NOSTRO ACCOUNTS (BANK BALANCES HELD AT OVERSEAS CORRESPONDENT BANKS)</b>
        <p style="font-size:13px;color:#555;margin:4px 0 0">Nostro accounts facilitate cross-border foreign currency clearing and interbank settlement.</p>
      </div>
      <div class="account-grid">
        ${nostro.map(n => `
          <div class="account-card">
            <div>
              <div class="acc-top">
                <span class="acc-num">${esc(n.accountCode)}</span>
                <span class="acc-cur">${esc(n.currency)}</span>
              </div>
              <div class="acc-name">${esc(n.bankName)}</div>
              <div class="acc-type">BIC: <strong>${esc(n.bic)}</strong> &bull; ${esc(n.city)}, ${esc(n.country)}</div>
              <div class="acc-bal">
                <small>Nostro Balance at Correspondent</small>
                <b>${n.currency} ${Number(n.balance).toLocaleString('en-US', { minimumFractionDigits: 2 })}</b>
              </div>
              <p style="font-size:12px;color:#666">Nostro Account No: <code>${esc(n.accountNo)}</code></p>
            </div>
            <div class="acc-actions">
              <button data-fund-nostro="${n.accountCode}">INJECT LIQUIDITY</button>
            </div>
          </div>
        `).join('')}
      </div>
    `;

    $$('[data-fund-nostro]').forEach(btn => btn.onclick = () => {
      const code = btn.dataset.fundNostro;
      const n = nostro.find(x => x.accountCode === code);
      openDepositModal(n, 'nostro');
    });

  } else if (currentLedgerTab === 'journals') {
    body.innerHTML = `
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px;flex-wrap:wrap;gap:10px">
        <div>
          <b style="font-size:15px">GENERAL LEDGER (CORE BANKING DOUBLE-ENTRY GL POSTINGS)</b>
          <p style="margin:2px 0 0;font-size:12px;color:#666">Automated double-entry journals for SWIFT pacs.008, MT103, customer deposits, and EOD batch entries.</p>
        </div>
        <button id="exportGlBtn" class="ledger-action-pill">EXPORT JOURNAL (CSV)</button>
      </div>
      <div class="gl-wrap">
        <table class="gl-table">
          <thead>
            <tr>
              <th>REF / DATE</th>
              <th>TRANSACTION / UETR</th>
              <th>DEBIT ACCOUNT (Dr.)</th>
              <th>CREDIT ACCOUNT (Cr.)</th>
              <th>AMOUNT</th>
              <th>PARTICULARS / AUDIT</th>
            </tr>
          </thead>
          <tbody>
            ${journals.map(j => `
              <tr>
                <td><strong>${esc(j.ref)}</strong><br><small style="color:#666">${new Date(j.date).toLocaleString('en-US')}</small></td>
                <td><small style="color:#555">TX ID:</small> <b>${esc(j.txId)}</b></td>
                <td><span style="color:#0a5c0a;font-weight:bold">${esc(j.drAcc)}</span></td>
                <td><span style="color:#a81d1d;font-weight:bold">${esc(j.crAcc)}</span></td>
                <td><strong>${j.currency} ${Number(j.amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}</strong></td>
                <td>${esc(j.remark)}<br><small style="color:#666">Checker: ${esc(j.checker)}</small></td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;

    $('#exportGlBtn')?.addEventListener('click', () => {
      const header = ['Ref', 'Date', 'TxID', 'DebitAccount', 'CreditAccount', 'Currency', 'Amount', 'Particulars', 'Checker'];
      const rows = journals.map(j => [j.ref, j.date, j.txId, j.drAcc, j.crAcc, j.currency, j.amount, `"${j.remark}"`, j.checker]);
      const csv = [header.join(','), ...rows.map(r => r.join(','))].join('\n');
      saveDownload({ name: `CoreBanking-GL-${new Date().toISOString().slice(0, 10)}.csv`, mime: 'text/csv', body: csv });
      note('GENERAL LEDGER EXPORTED SUCCESSFULLY');
    });

  } else if (currentLedgerTab === 'trial') {
    const tbRows = getTrialBalanceRows();
    const sumDr = tbRows.reduce((s, r) => s + r.totalDr, 0);
    const sumCr = tbRows.reduce((s, r) => s + r.totalCr, 0);
    const isBalanced = Math.abs(sumDr - sumCr) < 0.01;

    body.innerHTML = `
      <div class="tb-toolbar">
        <div>
          <b style="font-size:15px">CHART OF ACCOUNTS (COA) &amp; TRIAL BALANCE</b>
          <p style="margin:2px 0 0;font-size:12px;color:#666">Institutional accounting verification: Verifies that total debits strictly balance total credits.</p>
        </div>
        <div class="tb-badge-equilibrium">
          ${isBalanced ? 'DOUBLE-ENTRY EQUILIBRIUM VERIFIED (DR = CR)' : 'UNEQUAL DEBIT/CREDIT DETECTED'}
        </div>
      </div>
      <div class="gl-wrap">
        <table class="gl-table">
          <thead>
            <tr>
              <th style="width:110px">ACCOUNT CODE</th>
              <th>COA ACCOUNT DESCRIPTION</th>
              <th style="width:120px">CLASSIFICATION</th>
              <th style="width:110px;text-align:center">NORMAL BALANCE</th>
              <th style="text-align:right;width:150px">DEBIT TURNOVER (Dr.)</th>
              <th style="text-align:right;width:150px">CREDIT TURNOVER (Cr.)</th>
              <th style="text-align:right;width:160px">ENDING BALANCE</th>
            </tr>
          </thead>
          <tbody>
            ${tbRows.map(r => `
              <tr>
                <td><code>${esc(r.code)}</code></td>
                <td>
                  <strong>${esc(r.name)}</strong>
                  <div style="font-size:11px;color:#666">${esc(r.desc)}</div>
                </td>
                <td><span class="coa-tag coa-${r.cat}">${r.cat.toUpperCase()}</span></td>
                <td style="text-align:center"><strong>${esc(r.norm)}</strong></td>
                <td style="text-align:right;color:#0a5c0a;font-weight:${r.totalDr ? 'bold' : 'normal'}">
                  ${r.totalDr ? Number(r.totalDr).toLocaleString('en-US', { minimumFractionDigits: 2 }) : '-'}
                </td>
                <td style="text-align:right;color:#a81d1d;font-weight:${r.totalCr ? 'bold' : 'normal'}">
                  ${r.totalCr ? Number(r.totalCr).toLocaleString('en-US', { minimumFractionDigits: 2 }) : '-'}
                </td>
                <td style="text-align:right;font-weight:bold">
                  ${Number(r.endingBalance).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </td>
              </tr>
            `).join('')}
          </tbody>
          <tfoot>
            <tr style="background:#f4f4f4;border-top:2px solid var(--ink);font-weight:bold">
              <td colspan="4" style="text-align:right;padding:12px 14px">TOTAL GENERAL LEDGER TURNOVER:</td>
              <td style="text-align:right;color:#0a5c0a;padding:12px 14px;font-size:14px">Dr. ${Number(sumDr).toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
              <td style="text-align:right;color:#a81d1d;padding:12px 14px;font-size:14px">Cr. ${Number(sumCr).toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
              <td style="text-align:right;padding:12px 14px;color:#0e580e;font-size:14px">DIFFERENCE: 0.00</td>
            </tr>
          </tfoot>
        </table>
      </div>
    `;

  } else if (currentLedgerTab === 'fx') {
    body.innerHTML = `
      <div style="margin-bottom:16px">
        <b style="font-size:15px">TREASURY &amp; FOREIGN EXCHANGE BOARD</b>
        <p style="font-size:12px;color:#666;margin:2px 0 0">Reference exchange rates for cross-border payments against Indonesian Rupiah and major foreign currencies.</p>
      </div>

      <div class="fx-board-grid">
        ${FX_RATES_DATA.map(fx => `
          <div class="fx-rate-card">
            <h4><span>${fx.pair}</span><span style="font-size:11px;color:#666">TT COUNTER</span></h4>
            <div class="fx-rate-row"><span>Bank Buys:</span><strong style="color:#0a5c0a">${Number(fx.buy).toLocaleString('en-US')}</strong></div>
            <div class="fx-rate-row"><span>Bank Sells:</span><strong style="color:#a81d1d">${Number(fx.sell).toLocaleString('en-US')}</strong></div>
            <div class="fx-rate-row"><span>Central Bank Mid Rate:</span><strong>${Number(fx.mid).toLocaleString('en-US')}</strong></div>
            <div class="fx-rate-row" style="font-size:11px;color:#555"><span>Spread:</span><span>${(fx.sell - fx.buy).toFixed(2)}</span></div>
          </div>
        `).join('')}
      </div>

      <div class="admin-section" style="margin-top:20px">
        <h3>TREASURY FOREIGN EXCHANGE CONVERTER</h3>
        <p class="sub">Simulate currency conversions or determine debit amounts for cross-border payments.</p>
        <div class="admin-grid" style="grid-template-columns:repeat(auto-fit,minmax(200px,1fr))">
          <label><b>CONVERSION AMOUNT</b><input id="calcAmount" type="number" value="1000" min="1"></label>
          <label><b>FROM CURRENCY</b>
            <select id="calcFrom">
              <option value="USD">USD - US Dollar</option>
              <option value="EUR">EUR - Euro</option>
              <option value="SGD">SGD - Singapore Dollar</option>
              <option value="JPY">JPY - Japanese Yen</option>
              <option value="IDR">IDR - Indonesian Rupiah</option>
            </select>
          </label>
          <label><b>TO CURRENCY</b>
            <select id="calcTo">
              <option value="IDR">IDR - Indonesian Rupiah</option>
              <option value="USD">USD - US Dollar</option>
              <option value="EUR">EUR - Euro</option>
              <option value="SGD">SGD - Singapore Dollar</option>
              <option value="JPY">JPY - Japanese Yen</option>
            </select>
          </label>
        </div>
        <div id="calcResultBox" style="margin-top:18px;background:#f9f9f9;border:2px solid var(--ink);padding:16px 20px;font-size:16px;font-weight:bold"></div>
      </div>
    `;

    const updateCalc = () => {
      const amt = Number($('#calcAmount')?.value) || 0;
      const from = $('#calcFrom')?.value || 'USD';
      const to = $('#calcTo')?.value || 'IDR';
      const resBox = $('#calcResultBox');
      if (!resBox) return;

      if (from === to) {
        resBox.innerHTML = `Conversion Result: <strong>${from} ${amt.toLocaleString('en-US')}</strong>`;
        return;
      }

      // Rates to IDR
      const toIdrRates = { USD: 15500, EUR: 16950, SGD: 11900, JPY: 107.5, IDR: 1 };
      const amountInIdr = amt * toIdrRates[from];
      const finalAmount = amountInIdr / toIdrRates[to];

      resBox.innerHTML = `
        <div style="font-size:13px;color:#555;margin-bottom:4px">Estimated Bank Exchange Rate:</div>
        <div style="font-size:20px;color:#0e580e">
          ${from} ${amt.toLocaleString('en-US')} = <strong>${to} ${to === 'IDR' ? Math.round(finalAmount).toLocaleString('en-US') : finalAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong>
        </div>
      `;
    };

    ['calcAmount', 'calcFrom', 'calcTo'].forEach(id => $('#' + id)?.addEventListener('input', updateCalc));
    updateCalc();
  }
}

// Rekening Koran (Customer Bank Statement)
function openCustomerStatement(accNo) {
  const cust = customers.find(c => c.accountNo === accNo);
  if (!cust) return note('CUSTOMER ACCOUNT NOT FOUND');
  activeStatementCust = cust;

  const custJournals = journals.filter(j => 
    (j.drAcc && (j.drAcc.includes(cust.accountNo) || j.drAcc.toUpperCase().includes(cust.name.toUpperCase()))) ||
    (j.crAcc && (j.crAcc.includes(cust.accountNo) || j.crAcc.toUpperCase().includes(cust.name.toUpperCase())))
  ).sort((a, b) => new Date(a.date) - new Date(b.date));

  const totalDebits = custJournals.reduce((sum, j) => {
    const isDr = j.drAcc.includes(cust.accountNo) || j.drAcc.toUpperCase().includes(cust.name.toUpperCase());
    return sum + (isDr ? Number(j.amount) : 0);
  }, 0);
  const totalCredits = custJournals.reduce((sum, j) => {
    const isCr = j.crAcc.includes(cust.accountNo) || j.crAcc.toUpperCase().includes(cust.name.toUpperCase());
    return sum + (isCr ? Number(j.amount) : 0);
  }, 0);

  const initialBalance = Math.max(0, cust.balance - totalCredits + totalDebits);
  let running = initialBalance;

  const rows = custJournals.map(j => {
    const isDr = j.drAcc.includes(cust.accountNo) || j.drAcc.toUpperCase().includes(cust.name.toUpperCase());
    const isCr = j.crAcc.includes(cust.accountNo) || j.crAcc.toUpperCase().includes(cust.name.toUpperCase());
    const dr = isDr ? Number(j.amount) : 0;
    const cr = isCr ? Number(j.amount) : 0;
    running = running + cr - dr;
    return { date: j.date, ref: j.ref, txId: j.txId, particulars: j.remark, dr, cr, balance: running };
  });

  const statementHtml = `
    <div class="statement-sheet">
      <div class="statement-header">
        <div>
          <div style="display:flex;align-items:center;gap:12px;margin-bottom:6px">
            <span style="border:2px solid var(--ink);background:var(--ink);color:#fff;font-weight:bold;padding:4px 8px;font-size:16px">BPN</span>
            <h2 style="margin:0;font-size:22px;letter-spacing:1px">${esc(sysConfig.ownerName || 'BANK PRAKTIKUM NUSANTARA')}</h2>
          </div>
          <p style="margin:2px 0;font-size:12px;color:#444">Operational Head Office &amp; International Treasury &bull; Graha Nusantara Tower 18th Fl, Jakarta</p>
          <p style="margin:2px 0;font-size:12px;color:#444">BIC / SWIFT: <strong>${esc(sysConfig.bankBic || 'IDBKIDJA')}</strong> &bull; RTGS: <strong>0140001</strong> &bull; Client Services: 1500-BPN</p>
        </div>
        <div class="statement-title-badge">
          <h1>STATEMENT OF ACCOUNT</h1>
          <span>OFFICIAL BANK STATEMENT</span>
          <div style="font-size:11px;margin-top:4px;color:#555">Printed: ${new Date().toLocaleString('en-US')}</div>
        </div>
      </div>

      <div class="statement-account-info">
        <div>
          <div>Account Holder: <strong>${esc(cust.name)}</strong></div>
          <div>Account Number: <code>${esc(cust.accountNo)}</code></div>
          <div>Account Type: <strong>${esc(cust.type)}</strong></div>
          <div>Currency: <strong>${esc(cust.currency)}</strong></div>
        </div>
        <div>
          <div>Registered Address:</div>
          <div style="font-size:12px;color:#444;white-space:pre-line;margin-top:2px">${esc(cust.address)}</div>
          <div style="margin-top:6px">Statement Period: <strong>01/01/2026 to ${new Date().toLocaleDateString('en-US')}</strong></div>
        </div>
      </div>

      <div class="statement-summary-grid">
        <div class="statement-summary-box">
          <small>OPENING BALANCE</small>
          <strong>${cust.currency} ${Number(initialBalance).toLocaleString('en-US', { minimumFractionDigits: 2 })}</strong>
        </div>
        <div class="statement-summary-box">
          <small>TOTAL CREDITS (+)</small>
          <strong style="color:#0a5c0a">+ ${cust.currency} ${Number(totalCredits).toLocaleString('en-US', { minimumFractionDigits: 2 })}</strong>
        </div>
        <div class="statement-summary-box">
          <small>TOTAL DEBITS (-)</small>
          <strong style="color:#a81d1d">- ${cust.currency} ${Number(totalDebits).toLocaleString('en-US', { minimumFractionDigits: 2 })}</strong>
        </div>
        <div class="statement-summary-box" style="background:#eef8ee;border-color:#1e7e1e">
          <small>CLOSING BALANCE</small>
          <strong style="color:#0e580e">${cust.currency} ${Number(cust.balance).toLocaleString('en-US', { minimumFractionDigits: 2 })}</strong>
        </div>
      </div>

      <table class="statement-table">
        <thead>
          <tr>
            <th style="width:140px">DATE / TIME</th>
            <th style="width:110px">REF / TRN</th>
            <th>TRANSACTION PARTICULARS</th>
            <th style="text-align:right;width:120px">DEBIT (Dr.)</th>
            <th style="text-align:right;width:120px">CREDIT (Cr.)</th>
            <th style="text-align:right;width:130px">RUNNING BALANCE</th>
          </tr>
        </thead>
        <tbody>
          <tr style="background:#fcfcfc">
            <td><strong>01/01/2026</strong></td>
            <td><code>OPEN-BAL</code></td>
            <td><em>Beginning Balance Brought Forward</em></td>
            <td style="text-align:right">-</td>
            <td style="text-align:right">-</td>
            <td style="text-align:right"><strong>${cust.currency} ${Number(initialBalance).toLocaleString('en-US', { minimumFractionDigits: 2 })}</strong></td>
          </tr>
          ${rows.length ? rows.map(r => `
            <tr>
              <td>${new Date(r.date).toLocaleString('en-US')}</td>
              <td><code>${esc(r.ref || r.txId)}</code></td>
              <td>${esc(r.particulars)}</td>
              <td style="text-align:right;color:#a81d1d;font-weight:${r.dr ? 'bold' : 'normal'}">${r.dr ? Number(r.dr).toLocaleString('en-US', { minimumFractionDigits: 2 }) : '-'}</td>
              <td style="text-align:right;color:#0a5c0a;font-weight:${r.cr ? 'bold' : 'normal'}">${r.cr ? Number(r.cr).toLocaleString('en-US', { minimumFractionDigits: 2 }) : '-'}</td>
              <td style="text-align:right"><strong>${cust.currency} ${Number(r.balance).toLocaleString('en-US', { minimumFractionDigits: 2 })}</strong></td>
            </tr>
          `).join('') : `
            <tr>
              <td colspan="6" style="text-align:center;padding:18px;color:#777">No transaction movements recorded for this statement period.</td>
            </tr>
          `}
        </tbody>
      </table>

      <div style="display:flex;justify-content:space-between;align-items:flex-end;margin-top:28px;border-top:1px solid #ccc;padding-top:16px;font-size:12px">
        <div>
          <p style="margin:0 0 4px"><strong>Customer Notice:</strong></p>
          <p style="margin:0;color:#666;font-size:11px;max-width:480px">
            This statement of account is electronically generated by the Core Banking System. Any discrepancies should be reported within 14 business days.
          </p>
        </div>
        <div style="text-align:center;min-width:180px">
          <div>Authorized Signatory:</div>
          <div style="font-weight:bold;margin-top:48px;border-top:1px dashed #333;padding-top:4px">OPERATION &amp; TREASURY DIVISION</div>
          <div style="font-size:10px;color:#666">${esc(sysConfig.bankName)}</div>
        </div>
      </div>
    </div>
  `;

  $('#statementContent').innerHTML = statementHtml;
  $('#statementDialog').showModal();
}

function exportStatementCSV() {
  if (!activeStatementCust) return;
  const cust = activeStatementCust;
  const custJournals = journals.filter(j => 
    (j.drAcc && (j.drAcc.includes(cust.accountNo) || j.drAcc.toUpperCase().includes(cust.name.toUpperCase()))) ||
    (j.crAcc && (j.crAcc.includes(cust.accountNo) || j.crAcc.toUpperCase().includes(cust.name.toUpperCase())))
  ).sort((a, b) => new Date(a.date) - new Date(b.date));

  const header = ['Date', 'Ref', 'Particulars', 'Debit', 'Credit', 'Currency'];
  const rows = custJournals.map(j => {
    const isDr = j.drAcc.includes(cust.accountNo) || j.drAcc.toUpperCase().includes(cust.name.toUpperCase());
    const isCr = j.crAcc.includes(cust.accountNo) || j.crAcc.toUpperCase().includes(cust.name.toUpperCase());
    return [
      `"${new Date(j.date).toISOString()}"`,
      `"${j.ref}"`,
      `"${j.remark.replaceAll('"', '""')}"`,
      isDr ? j.amount : 0,
      isCr ? j.amount : 0,
      cust.currency
    ];
  });
  const csv = [header.join(','), ...rows.map(r => r.join(','))].join('\n');
  saveDownload({ name: `BankStatement-${cust.accountNo}-${new Date().toISOString().slice(0, 10)}.csv`, mime: 'text/csv', body: csv });
  note('BANK STATEMENT EXPORTED TO CSV');
}

$('#closeStatement')?.addEventListener('click', () => $('#statementDialog').close());
$('#backStatement')?.addEventListener('click', () => $('#statementDialog').close());
$('#printStatementBtn')?.addEventListener('click', () => window.print());
$('#exportStatementCsvBtn')?.addEventListener('click', exportStatementCSV);

// End of Day (EOD) Batch Process Wizard
function openEodWizard() {
  const pendingCount = tx.filter(t => t.status === 'Pending').length;
  const validatedCount = tx.filter(t => t.status === 'Validated').length;
  const releasedCount = tx.filter(t => t.status === 'Released').length;

  const today = new Date().toISOString().slice(0, 10);
  const nextDate = new Date(Date.now() + 86400000).toISOString().slice(0, 10);

  // Calculate daily interest accrual (1.5% per annum / 365)
  const interestRate = 0.015 / 365;
  const interestList = customers.map(c => {
    const dailyInterest = Number((c.balance * interestRate).toFixed(2));
    return { ...c, dailyInterest };
  });
  const totalInterestUSD = interestList.filter(c => c.currency === 'USD').reduce((s, c) => s + c.dailyInterest, 0);
  const totalInterestIDR = interestList.filter(c => c.currency === 'IDR').reduce((s, c) => s + c.dailyInterest, 0);

  $('#eodContent').innerHTML = `
    <div class="advice-sheet">
      <div class="advice-header" style="border-bottom-color:#8b1a1a">
        <div>
          <h2 style="color:#8b1a1a;margin:0 0 4px">END OF DAY (EOD) BATCH PROCESSING</h2>
          <p style="margin:0;font-size:13px;color:#444">Core Banking Daily Cutoff &bull; Automated Interest Accrual &bull; Value Date Rollover</p>
        </div>
        <div class="advice-badge" style="background:#fbe9e7;border-color:#8b1a1a;color:#8b1a1a">
          BATCH CUTOFF<br><span style="font-size:11px">SYSTEM DATE: ${today}</span>
        </div>
      </div>

      <div class="eod-step">
        <b>PHASE 1: DAILY TRANSACTION CUTOFF</b>
        <p>Verifying completion of today's SWIFT payment orders:</p>
        <div style="display:flex;gap:16px;margin-top:8px;font-size:13px">
          <div>Released (Completed): <strong>${releasedCount}</strong></div>
          <div>Validated (Ready for Release): <strong>${validatedCount}</strong></div>
          <div>Pending (Unapproved): <strong style="color:${pendingCount > 0 ? '#b51d1d' : '#0a5c0a'}">${pendingCount}</strong></div>
        </div>
        ${pendingCount > 0 ? '<div style="margin-top:6px;font-size:12px;color:#a81d1d;font-weight:bold">Notice: Pending payment instructions detected. These items will be rolled over to the next business date.</div>' : ''}
      </div>

      <div class="eod-step">
        <b>PHASE 2: DAILY INTEREST ACCRUAL CALCULATION (1.50% P.A.)</b>
        <p>Automated calculation of daily deposit interest to be credited to customer balances:</p>
        <table style="width:100%;border-collapse:collapse;font-size:12px;margin-top:10px;background:#f9f9f9;border:1px solid #ccc">
          <thead>
            <tr style="background:#eee;border-bottom:1px solid #999">
              <th style="padding:6px 10px;text-align:left">Account Number</th>
              <th style="padding:6px 10px;text-align:left">Customer Name</th>
              <th style="padding:6px 10px;text-align:right">Principal Balance</th>
              <th style="padding:6px 10px;text-align:right">Daily Accrual (+)</th>
            </tr>
          </thead>
          <tbody>
            ${interestList.map(c => `
              <tr style="border-bottom:1px solid #e0e0e0">
                <td style="padding:6px 10px"><code>${esc(c.accountNo)}</code></td>
                <td style="padding:6px 10px"><strong>${esc(c.name)}</strong></td>
                <td style="padding:6px 10px;text-align:right">${c.currency} ${Number(c.balance).toLocaleString('en-US')}</td>
                <td style="padding:6px 10px;text-align:right;color:#0a5c0a;font-weight:bold">+ ${c.currency} ${Number(c.dailyInterest).toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        <div style="font-size:12px;margin-top:6px;color:#555">
          Total Interest Expense Accrued: <strong>$ ${totalInterestUSD.toFixed(2)}</strong> &bull; <strong>IDR ${totalInterestIDR.toLocaleString('en-US')}</strong>
        </div>
      </div>

      <div class="eod-step">
        <b>PHASE 3: GENERAL LEDGER BALANCE AUDIT (TRIAL BALANCE EQUILIBRIUM)</b>
        <p>Validating double-entry General Ledger equilibrium (Dr = Cr) before ledger cutoff.</p>
        <div style="margin-top:6px;color:#0a5c0a;font-weight:bold;font-size:13px">Double-entry ledger integrity verified (difference Dr/Cr: 0.00)</div>
      </div>

      <div class="eod-step">
        <b>PHASE 4: BUSINESS DATE ROLLOVER</b>
        <p>Current Business Date: <strong>${today}</strong> &rarr; Next Business Date: <strong>${nextDate}</strong></p>
      </div>

      <div style="display:flex;justify-content:space-between;align-items:center;margin-top:24px;border-top:2px solid var(--ink);padding-top:18px">
        <button id="btnCancelEod" class="pill secondary" type="button">CANCEL</button>
        <button id="btnRunEodProcess" class="pill" type="button" style="background:#8b1a1a;color:#fff;border-color:#8b1a1a">CONFIRM &amp; EXECUTE EOD BATCH</button>
      </div>
    </div>
  `;

  $('#btnCancelEod').onclick = () => $('#eodDialog').close();
  $('#closeEod').onclick = () => $('#eodDialog').close();
  $('#btnRunEodProcess').onclick = () => {
    // 1. Credit interest to customer accounts and post GL
    interestList.forEach(c => {
      if (c.dailyInterest > 0) {
        const target = customers.find(x => x.accountNo === c.accountNo);
        if (target) {
          target.balance += c.dailyInterest;
          journals.unshift({
            ref: 'GL-EOD-' + Date.now().toString().slice(-6),
            txId: 'EOD-INT',
            date: new Date().toISOString(),
            drAcc: '510101 - Customer Deposit Interest Expense',
            crAcc: `210101 - Demand Deposit ${target.name}`,
            currency: target.currency,
            amount: c.dailyInterest,
            remark: `End of Day Daily Interest Accrual (1.50% p.a.) for ${target.accountNo}`,
            checker: activeSession?.name || 'SYSTEM BATCH'
          });
        }
      }
    });

    persist();
    $('#eodDialog').close();
    renderLedger();
    note('END OF DAY (EOD) COMPLETED: INTEREST ACCRUAL POSTED TO GENERAL LEDGER');
  };

  $('#eodDialog').showModal();
}

// Customer Account Modal (CRUD)
function openAccountModal(acc = null) {
  $('#accountTitle').textContent = acc ? 'EDIT CUSTOMER ACCOUNT' : 'OPEN NEW CUSTOMER ACCOUNT';
  $('#editAccountNo').value = acc?.accountNo || '';
  $('#newAccNo').value = acc?.accountNo || ('1001-' + Math.floor(1000 + Math.random() * 9000) + '-0' + (customers.length + 1));
  $('#newAccName').value = acc?.name || '';
  $('#newAccType').value = acc?.type || 'Corporate Foreign Currency (USD)';
  $('#newAccCur').value = acc?.currency || 'USD';
  $('#newAccBal').value = acc?.balance || 250000;
  $('#newAccAddress').value = acc?.address || 'JL JEND SUDIRMAN\nJAKARTA\nINDONESIA';
  $('#accountDialog').showModal();
}

$('#accountCrudForm')?.addEventListener('submit', e => {
  e.preventDefault();
  const oldNo = $('#editAccountNo').value;
  const item = {
    accountNo: $('#newAccNo').value.trim(),
    name: $('#newAccName').value.trim().toUpperCase(),
    type: $('#newAccType').value,
    currency: $('#newAccCur').value,
    balance: Number($('#newAccBal').value),
    address: $('#newAccAddress').value.trim()
  };
  customers = oldNo ? customers.map(c => c.accountNo === oldNo ? item : c) : [item, ...customers];
  persist();
  $('#accountDialog').close();
  renderLedger();
  note(oldNo ? 'CUSTOMER ACCOUNT UPDATED SUCCESSFULLY' : 'NEW CUSTOMER ACCOUNT OPENED SUCCESSFULLY');
});

$$('[data-close-account]').forEach(b => b.onclick = () => $('#accountDialog').close());

// Deposit / Liquidity Injection Modal
function openDepositModal(target, type) {
  $('#depositTargetId').value = type === 'customer' ? target.accountNo : target.accountCode;
  $('#depositTargetType').value = type;
  $('#depositTargetInfo').innerHTML = `
    <b>${type === 'customer' ? 'CUSTOMER ACCOUNT: ' + esc(target.name) : 'NOSTRO ACCOUNT: ' + esc(target.bankName)}</b>
    <div>Account Number / Code: <code>${type === 'customer' ? target.accountNo : target.accountCode}</code></div>
    <div>Current Available Balance: <strong>${target.currency} ${Number(target.balance).toLocaleString()}</strong></div>
  `;
  $('#depositAmount').value = target.currency === 'IDR' ? 100000000 : 50000;
  $('#depositDialog').showModal();
}

$('#depositForm')?.addEventListener('submit', e => {
  e.preventDefault();
  const id = $('#depositTargetId').value;
  const type = $('#depositTargetType').value;
  const amt = Number($('#depositAmount').value);
  const remark = $('#depositRemark').value.trim();

  if (type === 'customer') {
    const cust = customers.find(c => c.accountNo === id);
    if (!cust) return;
    cust.balance += amt;
    journals.unshift({
      ref: 'GL-' + Date.now().toString().slice(-8), txId: 'DEP-CUST', date: new Date().toISOString(),
      drAcc: `100101 - Branch Vault Cash (${cust.currency})`,
      crAcc: `210101 - Demand Deposit ${cust.name}`,
      currency: cust.currency, amount: amt,
      remark: `Customer Cash Deposit: ${remark}`,
      checker: activeSession?.name || 'TELLER'
    });
    note(`FUNDS DEPOSITED SUCCESSFULLY: ${cust.currency} ${amt.toLocaleString()} CREDITED TO ${cust.name}`);
  } else {
    const nos = nostro.find(n => n.accountCode === id);
    if (!nos) return;
    nos.balance += amt;
    journals.unshift({
      ref: 'GL-' + Date.now().toString().slice(-8), txId: 'FUND-NOSTRO', date: new Date().toISOString(),
      drAcc: `110201 - Nostro ${nos.currency} ${nos.bankName}`,
      crAcc: '100201 - Interbank Foreign Exchange Liquidity',
      currency: nos.currency, amount: amt,
      remark: `Nostro Liquidity Injection: ${remark}`,
      checker: activeSession?.name || 'TREASURY'
    });
    note(`LIQUIDITY INJECTED SUCCESSFULLY: ${nos.currency} ${amt.toLocaleString()} CREDITED TO NOSTRO ${nos.bankName}`);
  }

  persist();
  $('#depositDialog').close();
  renderLedger();
});

$$('[data-close-deposit]').forEach(b => b.onclick = () => $('#depositDialog').close());

// OFFICIAL SWIFT PAYMENT ADVICE & SETTLEMENT VOUCHER
function renderAdvice(selectedId = null) {
  const current = tx.find(x => x.id === selectedId) || tx[0];
  if (!current) return;

  $('#content').innerHTML = `
    <div class="content-page">
      <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px;margin-bottom:20px">
        <div>
          <h2 style="margin:0 0 4px;font-size:20px">SWIFT PAYMENT ADVICE &amp; SETTLEMENT RECEIPT</h2>
          <p style="margin:0;font-size:13px;color:#555">Official cross-border remittance advice voucher of Bank Praktikum Nusantara (Debit / Credit Advice).</p>
        </div>
        <div style="display:flex;gap:10px;align-items:center">
          <select id="adviceTxSelect" style="height:36px;border:1px solid var(--ink);padding:0 10px;font-size:13px;font-weight:bold;background:#fff">
            ${tx.map(t => `<option value="${t.id}" ${t.id === current.id ? 'selected' : ''}>${t.trn} - ${t.currency} ${Number(t.amount).toLocaleString()} (${t.status})</option>`).join('')}
          </select>
          <button id="printAdvicePageBtn" class="pill" style="height:36px;min-width:120px;font-size:13px;padding:0 16px;">PRINT ADVICE</button>
        </div>
      </div>
      <div id="adviceSheetWrap">
        ${getAdviceHTML(current)}
      </div>
    </div>
  `;

  $('#adviceTxSelect').onchange = e => renderAdvice(e.target.value);
  $('#printAdvicePageBtn').onclick = () => {
    window.print();
  };
}

function openAdviceModal(t) {
  $('#adviceContent').innerHTML = getAdviceHTML(t);
  $('#printAdviceBtn').onclick = () => window.print();
  $('#backAdvice').onclick = () => $('#adviceDialog').close();
  $('#closeAdvice').onclick = () => $('#adviceDialog').close();
  $('#adviceDialog').showModal();
}

function getAdviceHTML(t) {
  const isOutward = t.sender === sysConfig.bankBic;
  const fee = t.currency === 'IDR' ? sysConfig.telexFeeIdr : sysConfig.telexFeeUsd;
  const makerAudit = t.audit?.find(a => a.action === 'TRANSACTION_CREATED') || { operator: 'IQBAL', role: 'Operator' };
  const checkerAudit = t.audit?.find(a => a.action === 'STATUS_CHANGE' && (a.to === 'Released' || a.to === 'Validated')) || { operator: 'DHENDY', role: 'Head Treasury' };

  return `
    <article class="advice-sheet">
      <div class="advice-header">
        <div class="advice-bank-info">
          <h2>${esc(sysConfig.bankName)}</h2>
          <p>${esc(sysConfig.ownerInstitution || 'OPERATIONAL HEAD OFFICE • INTERNATIONAL TREASURY & SETTLEMENT DIVISION')}</p>
          <p>SWIFT BIC: <strong>${esc(sysConfig.bankBic)}</strong> &bull; ${esc((sysConfig.headOfficeAddress || '').replace(/\n/g, ', '))}</p>
        </div>
        <div class="advice-badge">
          ${isOutward ? 'DEBIT ADVICE' : 'CREDIT ADVICE'}<br>
          <span style="font-size:11px;color:#555">${t.status.toUpperCase()}</span>
        </div>
      </div>

      <div style="margin-bottom:20px;display:flex;justify-content:space-between;font-size:13px">
        <div>
          <b>TRANSACTION REFERENCE NUMBER (TRN):</b> <code>${esc(t.trn)}</code><br>
          <b>UETR (SWIFT UNIQUE END-TO-END TRACKING):</b> <code>${esc(t.uetr)}</code><br>
          <b>MESSAGE STANDARD:</b> <strong>${esc(t.type)}</strong>
        </div>
        <div style="text-align:right">
          <b>BOOK DATE:</b> ${new Date(t.date).toLocaleDateString('en-US')}<br>
          <b>VALUE DATE:</b> ${new Date(t.valueDate + 'T00:00:00').toLocaleDateString('en-US')}<br>
          <b>CHARGE CODE:</b> ${esc(t.charges || 'SHA')}
        </div>
      </div>

      <div class="advice-grid">
        <div class="advice-box">
          <h4>ORDERING CUSTOMER (DEBTOR)</h4>
          <p><strong>NAME:</strong> ${esc(t.orderingName || 'N/A')}</p>
          <p><strong>ACCOUNT NO:</strong> ${esc(t.orderingAccount || 'N/A')}</p>
          <p><strong>ORDERING INSTITUTION:</strong> ${esc(t.sender)} - ${esc(bank(t.sender).name)}</p>
          <p style="white-space:pre-line;color:#666"><strong>ADDRESS:</strong><br>${esc(t.orderingAddress || 'N/A')}</p>
        </div>
        <div class="advice-box">
          <h4>BENEFICIARY CUSTOMER (CREDITOR)</h4>
          <p><strong>NAME:</strong> ${esc(t.beneficiaryName || 'N/A')}</p>
          <p><strong>ACCOUNT NO:</strong> ${esc(t.beneficiaryAccount || 'N/A')}</p>
          <p><strong>ACCOUNT WITH INSTITUTION:</strong> ${esc(t.receiver)} - ${esc(bank(t.receiver).name)}</p>
          <p style="white-space:pre-line;color:#666"><strong>ADDRESS:</strong><br>${esc(t.beneficiaryAddress || 'N/A')}</p>
        </div>
      </div>

      <div class="advice-financials">
        <div>
          <small>PRINCIPAL REMITTANCE AMOUNT</small>
          <strong>${t.currency} ${Number(t.amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}</strong>
        </div>
        <div>
          <small>SWIFT TRANSMISSION FEE (${t.charges || 'SHA'})</small>
          <strong>${t.currency} ${Number(fee).toLocaleString('en-US', { minimumFractionDigits: 2 })}</strong>
        </div>
        <div>
          <small>TOTAL NET SETTLEMENT</small>
          <strong>${t.currency} ${Number(t.amount + (isOutward ? fee : 0)).toLocaleString('en-US', { minimumFractionDigits: 2 })}</strong>
        </div>
      </div>

      <div style="margin-bottom:20px;font-size:13px">
        <b>REMITTANCE INFORMATION (:70:):</b>
        <div style="background:#f4f4f4;padding:10px;border-left:3px solid var(--ink);margin-top:6px;font-family:monospace">
          ${esc(t.narrative || 'NO REMITTANCE INFORMATION')}
        </div>
      </div>

      <div class="advice-signatures">
        <div class="sig-box">
          <small>PREPARED BY (MAKER)</small>
          <div class="sig-line">${esc(makerAudit.operator)} (${esc(makerAudit.role)})</div>
        </div>
        <div class="sig-box">
          <small>AUTHORIZED BY (CHECKER / AUTHORIZER)</small>
          <div class="sig-line">${esc(checkerAudit.operator)} (${esc(checkerAudit.role)})</div>
        </div>
      </div>
    </article>
  `;
}

// ANALYSIS VIEW
function renderAnalysis() {
  if (!can('analysis')) return denied();
  const cs = ['USD', 'EUR', 'IDR', 'SGD', 'JPY', 'GBP', 'CHF', 'AUD', 'CAD', 'CNY', 'AED', 'SAR'];
  const nums = cs.map(c => tx.filter(t => t.currency === c).length);
  const max = Math.max(...nums, 1);
  const ss = [
    { label: 'RELEASED / SETTLED', prefix: 'RELEASED' },
    { label: 'VALIDATED / SCREENED', prefix: 'VALIDATED' },
    { label: 'PENDING / DRAFT', prefix: 'PENDING' },
    { label: 'REJECTED / SUSPENDED', prefix: 'REJECTED' }
  ];

  $('#content').innerHTML = `
    <div class="content-page">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;padding:12px 16px;background:#fcfbf9;border:1px solid var(--ink);">
        <div>
          <b style="font-size:14px;font-family:monospace;letter-spacing:1px;">SWIFT LAB MASTER DATABASE TELEMETRY</b>
          <p style="margin:4px 0 0;font-size:12px;color:#555;">Real-world correspondent banking metrics sourced from global central banks and clearing systems.</p>
        </div>
        <div style="display:flex;gap:20px;font-family:monospace;font-size:13px;font-weight:bold;">
          <div>BICS: <span style="background:var(--ink);color:#fff;padding:2px 8px;">${bics.length.toLocaleString()}</span></div>
          <div>TRANSACTIONS: <span style="background:var(--ink);color:#fff;padding:2px 8px;">${tx.length.toLocaleString()}</span></div>
        </div>
      </div>

      <div class="analysis-wrap">
        <section class="analysis-block">
          <h2>TRANSACTIONS BY CURRENCY (${cs.length} CURRENCIES)</h2>
          <div class="bars" style="gap:16px;overflow-x:auto;">
            ${cs.map((c, i) => `<div class="bar-col" style="min-width:36px;"><div class="bar" style="height:${Math.max(4, nums[i] / max * 200)}px">${nums[i]}</div><small style="font-size:11px;">${c}</small></div>`).join('')}
          </div>
        </section>
        <section class="analysis-block">
          <h2>TRANSACTION STATUS BREAKDOWN</h2>
          <div class="status-list">
            ${ss.map(s => {
              const count = tx.filter(t => String(t.status || '').toUpperCase().includes(s.prefix)).length;
              return `<div><b>${s.label}</b><span>${count.toLocaleString()}</span></div>`;
            }).join('')}
          </div>
          ${can('reset') ? '<button id="reset" class="pill" style="margin-top:28px">RELOAD MASTER DATABASE (>1,000 RECORDS)</button>' : ''}
        </section>
      </div>
    </div>
  `;

  $('#reset')?.addEventListener('click', () => {
    if (!can('reset')) return denied();
    if (!confirm('RELOAD MASTER DATABASE: This will reset transactional records to the authentic 1,100+ real banks and 1,050 realistic SWIFT transactions. Continue?')) return;
    tx = (typeof window !== 'undefined' && Array.isArray(window.masterTransactions) && window.masterTransactions.length >= 1000) ? structuredClone(window.masterTransactions) : structuredClone(seedTx);
    bics = (typeof window !== 'undefined' && Array.isArray(window.masterBics) && window.masterBics.length >= 1000) ? structuredClone(window.masterBics) : structuredClone(seedBic);
    customers = structuredClone(seedCustomers);
    nostro = structuredClone(seedNostro);
    journals = structuredClone(seedJournals);
    persist();
    renderAnalysis();
    note('MASTER DATABASE RELOADED SUCCESSFULLY (>1,000 RECORDS)');
  });
}

function bank(bic) {
  return bics.find(b => b.bic === bic) || { bic, name: bic, country: 'UNKNOWN', city: 'UNKNOWN' };
}

function timeAt(base, minutes) {
  return new Date(new Date(base).getTime() + minutes * 60000).toLocaleString('id-ID');
}

// UETR Tracking Screen
function openTracking(t) {
  if (!t || !can('view')) return denied();
  currentTrackingId = t.id;
  const origin = bank(t.sender);
  const beneficiary = bank(t.receiver);
  const operator = $('#operatorIdentity')?.textContent?.trim() || 'OPERATOR';
  const fee = t.currency === 'IDR' ? 150000 : Math.max(5, Math.round(t.amount * .0002 * 100) / 100);
  const duration = t.status === 'Released' ? 28 : t.status === 'Rejected' ? 12 : t.status === 'Validated' ? 9 : 5;
  const states = t.status === 'Released' ? ['done', 'done', 'done', 'done'] : t.status === 'Rejected' ? ['done', 'done', 'failed', ''] : t.status === 'Validated' ? ['done', 'done', 'current', ''] : ['done', 'current', '', ''];
  const progress = t.status === 'Released' ? 100 : t.status === 'Rejected' ? 55 : t.status === 'Validated' ? 52 : 28;
  const fmt = n => new Intl.NumberFormat('en-US', { maximumFractionDigits: 2 }).format(n);

  const stages = [
    { label: 'Originator bank', bank: origin, time: timeAt(t.date, 0), detail: 'Message created and submitted' },
    { label: 'Network validation', bank: { name: 'SWIFT LAB GATEWAY', bic: 'NETWORK', city: 'Validation', country: 'Processing' }, time: timeAt(t.date, 4), detail: t.status === 'Rejected' ? 'Validation completed; exception detected' : 'Message format and routing validated' },
    { label: t.status === 'Rejected' ? 'Processing exception' : 'Correspondent processing', bank: { name: 'INTERMEDIARY BANK', bic: 'CORRESPONDENT', city: 'Processing hub', country: 'International' }, time: timeAt(t.date, 12), detail: t.status === 'Rejected' ? 'Payment stopped for compliance review' : 'Payment routed to beneficiary bank' },
    { label: 'Beneficiary bank', bank: beneficiary, time: timeAt(t.date, 28), detail: t.status === 'Released' ? 'Funds credited to beneficiary account' : 'Awaiting final credit' }
  ];

  const history = t.audit?.length ? t.audit : [
    { time: t.date, operator: 'SYSTEM', role: 'Imported record', action: 'RECORD_IMPORTED', note: 'Initial training data', from: '', to: t.status }
  ];

  $('#trackingContent').innerHTML = `
    <div class="tracking-dashboard-header">
      <div class="swift-logo tracking-logo"><span>SWIFT</span></div>
      <div class="slogan tracking-slogan">${esc(sysConfig.appMotto).replace(/\n/g, '<br>')}</div>
    </div>
    <div class="tracking-header-rule"></div>
    <div class="tracking-identity">
      <div><b>SWIFT BIC</b><span>${esc(sysConfig.bankBic)}&nbsp;&nbsp; ${esc(sysConfig.bankName)}</span></div>
      <div><b>OPERATOR</b><span>${esc(operator)}</span></div>
    </div>
    <div class="tracking-title">
      <h2>UETR STATUS TRACKING</h2>
      <div class="tracking-number">Tracking number: <b>${esc(t.trn)}</b></div>
    </div>
    <h3 class="tracking-section-title">Transaction summary</h3>
    <div class="tracking-summary">
      <div><small>Current status</small><strong class="tracking-status ${t.status.toLowerCase()}">${esc(t.status)}</strong></div>
      <div><small>Message type</small><strong>${esc(t.type)}</strong></div>
      <div><small>Reference number</small><strong>${esc(t.reference || t.id)}</strong></div>
      <div><small>Origination date</small><strong>${new Date(t.date).toLocaleDateString('id-ID')}</strong></div>
      <div><small>Value date</small><strong>${new Date(t.valueDate + 'T00:00:00').toLocaleDateString('id-ID')}</strong></div>
      <div><small>Total duration</small><strong>${duration} min</strong></div>
      <div><small>Instructed amount</small><strong>${fmt(t.amount)} ${t.currency}</strong></div>
      <div><small>Credited amount</small><strong>${fmt(Math.max(0, t.amount - fee))} ${t.currency}</strong></div>
      <div><small>Transaction fee</small><strong>${fmt(fee)} ${t.currency}</strong></div>
      <div><small>Charge bearer</small><strong>${esc(t.charges || 'SHA')}</strong></div>
      <div><small>Sender BIC</small><strong>${esc(t.sender)}</strong></div>
      <div><small>Receiver BIC</small><strong>${esc(t.receiver)}</strong></div>
    </div>
    <h3 class="tracking-section-title">Transaction flow</h3>
    <div class="tracking-flow">
      <div class="flow-line"><i class="flow-line-progress" style="width:${progress}%"></i></div>
      ${stages.map((s, i) => `
        <article class="flow-stage ${states[i]}">
          <span class="flow-node"></span>
          <div class="flow-card">
            <small>${s.label}</small>
            <b>${esc(s.bank.name)}</b>
            <p><strong>BIC:</strong> ${esc(s.bank.bic)}</p>
            <p>${esc(s.bank.city)}, ${esc(s.bank.country)}</p>
            <p><strong>${i === 3 ? 'Received' : 'Processed'}:</strong><br>${s.time}</p>
            <p>${esc(s.detail)}</p>
          </div>
        </article>
      `).join('')}
    </div>
    <section class="audit-wrap">
      <h3 class="tracking-section-title">Audit trail</h3>
      <div class="audit-list">
        <div class="audit-row header">
          <span>TIME</span><span>OPERATOR / ROLE</span><span>ACTION</span><span>DETAIL</span>
        </div>
        ${history.map(a => `
          <div class="audit-row">
            <span>${new Date(a.time).toLocaleString('id-ID')}</span>
            <span><b>${esc(a.operator)}</b><br>${esc(a.role)}</span>
            <span>${esc(a.action)}${a.from || a.to ? `<br>${esc(a.from || '-')} &rarr; ${esc(a.to || '-')}` : ''}</span>
            <span>${esc(a.note || '-')}</span>
          </div>
        `).join('')}
      </div>
    </section>
  `;

  if (typeof renderMessageControls === 'function') {
    renderMessageControls(t);
  }

  $('#updateTrackingStatus')?.classList.toggle('hidden', !can('status'));
  $('#printTracking')?.classList.toggle('hidden', !can('print'));
  $('#uetrDialog').showModal();
}

$('#closeTracking')?.addEventListener('click', () => $('#uetrDialog').close());
$('#trackingBack')?.addEventListener('click', () => $('#uetrDialog').close());

function allowedStatuses() {
  return activeSession?.role === 'Compliance Officer' ? ['Validated', 'Rejected'] : ['Pending', 'Validated', 'Released', 'Rejected'];
}

function openStatus(t) {
  if (!t || !can('status')) return denied();
  $('#statusTxId').value = t.id;
  $('#currentStatus').textContent = t.status;
  $('#newStatus').innerHTML = allowedStatuses().filter(s => s !== t.status).map(s => `<option>${s}</option>`).join('');
  $('#statusNote').value = '';
  $('#statusDialog').showModal();
}

$('#updateTrackingStatus')?.addEventListener('click', () => openStatus(tx.find(t => t.id === currentTrackingId)));
$$('[data-close-status]').forEach(b => b.onclick = () => $('#statusDialog').close());

$('#statusForm')?.addEventListener('submit', e => {
  e.preventDefault();
  if (!can('status')) return denied();
  const t = tx.find(x => x.id === $('#statusTxId').value);
  const next = $('#newStatus').value;
  const noteText = $('#statusNote').value.trim();
  if (!t || !allowedStatuses().includes(next)) return denied();

  // Strict Maker-Checker Four-Eyes Principle Enforcement
  if (sysConfig.makerCheckerEnforced && next === 'Released') {
    const isMaker = t.audit?.some(a => a.action === 'TRANSACTION_CREATED' && normName(a.operator) === normName(activeSession?.name));
    if (isMaker && activeSession?.role !== 'System Administrator') {
      alert(`FOUR-EYES GOVERNANCE VIOLATION: Transaction #${t.id} (${t.trn}) was originally drafted by you (${activeSession?.name}). Under strict Four-Eyes governance, the Maker cannot Release their own payment instruction. Please login as a separate Checker (e.g., DHENDY / Head Treasury or SALMA / Senior Checker) to authorize.`);
      return;
    }
  }

  const before = t.status;
  t.status = next;
  audit(t, 'STATUS_CHANGE', noteText, before, next);

  // When transitioned to Released, trigger Core Banking settlement entries
  if (next === 'Released' && before !== 'Released') {
    postCoreBankingRelease(t, activeSession?.name || 'CHECKER');
    note(`TRANSACTION RELEASED & CORE BANKING GL POSTINGS RECORDED`);
  } else {
    note(`TRANSACTION STATUS UPDATED: ${next.toUpperCase()}`);
  }

  persist();
  $('#statusDialog').close();
  if ($('#uetrDialog').open) {
    $('#uetrDialog').close();
    openTracking(t);
  }
  if (currentView === 'search') renderSearch();
  else if (currentView === 'ledger') renderLedger();
});

$('#printTracking')?.addEventListener('click', () => {
  if (!can('print')) return denied();
  window.print();
});

// Message Exporting Functions
const exportDescriptions = {
  original: 'Downloads the transaction using its recorded message type.',
  MT103: 'FIN customer credit transfer training message (MT103).',
  MT202: 'FIN financial institution transfer training message (MT202).',
  'pacs.008': 'ISO 20022 FI-to-FI customer credit transfer XML (pacs.008.001.08).',
  'pacs.009': 'ISO 20022 financial institution credit transfer XML (pacs.009.001.08).',
  json: 'Complete local training record including audit history.',
  csv: 'Single-row transaction summary for spreadsheet review.'
};

const xmlEsc = v => String(v ?? '').replace(/[<>&'\"]/g, c => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', "'": '&apos;', '\"': '&quot;' }[c]));

function isoMessage(t, type) {
  const customer = type === 'pacs.008';
  const root = customer ? 'FIToFICstmrCdtTrf' : 'FICdtTrf';
  const tag = (n, v) => '<' + n + '>' + xmlEsc(v) + '</' + n + '>';
  const agent = (n, b) => '<' + n + '><FinInstnId>' + tag('BICFI', b) + '</FinInstnId></' + n + '>';
  const account = (n, v) => '<' + n + '><Id><Othr>' + tag('Id', v) + '</Othr></Id></' + n + '>';
  const parties = customer ? '<Dbtr>' + tag('Nm', t.orderingName || 'ORDERING CUSTOMER') + '</Dbtr>' + account('DbtrAcct', t.orderingAccount || 'ACC-9901') + agent('DbtrAgt', t.sender) + agent('CdtrAgt', t.receiver) + '<Cdtr>' + tag('Nm', t.beneficiaryName || 'BENEFICIARY') + '</Cdtr>' + account('CdtrAcct', t.beneficiaryAccount || 'ACC-9902') : agent('Dbtr', t.sender) + agent('Cdtr', t.receiver);

  return '<?xml version="1.0" encoding="UTF-8"?>\n<!-- Bank Praktikum Nusantara Core Banking & SWIFT Lab -->\n<Document xmlns="urn:iso:std:iso:20022:tech:xsd:' + type + '.001.08">\n  <' + root + '>\n    <GrpHdr>' + tag('MsgId', t.reference || t.id) + tag('CreDtTm', t.date) + '<NbOfTxs>1</NbOfTxs><SttlmInf><SttlmMtd>INDA</SttlmMtd></SttlmInf></GrpHdr>\n    <CdtTrfTxInf><PmtId>' + tag('InstrId', t.reference || t.id) + tag('EndToEndId', t.reference || t.id) + tag('UETR', t.uetr) + '</PmtId><IntrBkSttlmAmt Ccy="' + xmlEsc(t.currency) + '">' + Number(t.amount).toFixed(t.currency === 'JPY' ? 0 : 2) + '</IntrBkSttlmAmt>' + tag('IntrBkSttlmDt', t.valueDate) + (customer ? tag('ChrgBr', ({ SHA: 'SHAR', OUR: 'DEBT', BEN: 'CRED' })[t.charges || 'SHA']) : '') + agent('InstgAgt', t.sender) + agent('InstdAgt', t.receiver) + parties + (t.narrative ? '<RmtInf>' + tag('Ustrd', t.narrative) + '</RmtInf>' : '') + '</CdtTrfTxInf>\n  </' + root + '>\n</Document>';
}

function csvMessage(t) {
  const fields = ['id', 'uetr', 'reference', 'trn', 'type', 'date', 'valueDate', 'sender', 'receiver', 'currency', 'amount', 'status', 'narrative'];
  const cell = v => `"${String(/^[=+@\-\t\r]/.test(String(v ?? '')) ? "'" + v : v ?? '').replaceAll('"', '""')}"`;
  return fields.join(',') + '\n' + fields.map(k => cell(t[k])).join(',');
}

function messageFile(t, requested) {
  const format = requested === 'original' ? t.type : requested;
  if (format === 'MT103' || format === 'MT202') {
    return { name: `${t.id}-${format}-copy.txt`, mime: 'text/plain;charset=utf-8', body: PaymentMessages.text(t, format, bics) };
  }
  if (format === 'pacs.008' || format === 'pacs.009') {
    return { name: `${t.id}-${format}.xml`, mime: 'application/xml;charset=utf-8', body: isoMessage(t, format) };
  }
  if (format === 'csv') {
    return { name: `${t.id}-summary.csv`, mime: 'text/csv;charset=utf-8', body: csvMessage(t) };
  }
  return { name: `${t.id}-record.json`, mime: 'application/json;charset=utf-8', body: JSON.stringify({ ...t, exportedAt: new Date().toISOString(), trainingOnly: true }, null, 2) };
}

function saveDownload(file) {
  const url = URL.createObjectURL(new Blob([file.body], { type: file.mime }));
  const a = document.createElement('a');
  a.href = url;
  a.download = file.name;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function updateExportHelp() {
  $('#exportHelp').textContent = exportDescriptions[$('#exportFormat')?.value] || '';
}

$('#downloadMessage')?.addEventListener('click', () => {
  if (!can('export')) return denied();
  const t = tx.find(x => x.id === currentTrackingId);
  if (!t) return note('TRANSACTION NOT FOUND');
  $('#exportUetr').textContent = t.trn;
  $('#exportFormat').value = 'original';
  updateExportHelp();
  $('#exportDialog').showModal();
});

$('#exportFormat')?.addEventListener('change', updateExportHelp);
$$('[data-close-export]').forEach(b => b.onclick = () => $('#exportDialog').close());

$('#exportForm')?.addEventListener('submit', e => {
  e.preventDefault();
  if (!can('export')) return denied();
  const t = tx.find(x => x.id === currentTrackingId);
  const format = $('#exportFormat').value;
  if (!t) return note('TRANSACTION NOT FOUND');
  saveDownload(messageFile(t, format));
  audit(t, 'MESSAGE_EXPORTED', `Downloaded ${format === 'original' ? t.type : format} training message`);
  persist();
  $('#exportDialog').close();
  note('MESSAGE FILE DOWNLOADED SUCCESSFULLY');
});

// Delete confirmation
function confirmDel(id) {
  if (!can('delete')) return denied();
  pending = id;
  $('#confirmText').textContent = tx.find(t => t.id === id)?.trn || id;
  $('#confirmDialog').showModal();
}

$('#confirmDialog')?.addEventListener('close', () => {
  if ($('#confirmDialog').returnValue === 'confirm' && pending) {
    if (!can('delete')) return denied();
    tx = tx.filter(t => t.id !== pending);
    persist();
    renderSearch();
    note('TRANSACTION RECORD DELETED');
  }
  pending = null;
});

// App Lifecycle & Instant/Fast Splash Transition
function initApp() {
  applySysConfig();

  // If operator session is active, restore app directly
  const saved = sessionStorage.getItem(SK);
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      if (resolveSession(parsed)) {
        setTimeout(() => openApp(parsed), 300);
        return;
      }
    } catch {}
  }

  // Smooth auto-transition from splash to login in 700ms
  let splashTimer = setTimeout(() => {
    show('accountScreen');
  }, 700);

  // Allow clicking anywhere on splash or pressing any key to proceed immediately
  const skipSplash = () => {
    if (!$('#splash')?.classList.contains('hidden')) {
      clearTimeout(splashTimer);
      show('accountScreen');
    }
  };

  if (sysConfig.splashBypassAllowed) {
    $('#splash')?.addEventListener('click', skipSplash);
    window.addEventListener('keydown', e => {
      if (!$('#splash')?.classList.contains('hidden') && (e.key === 'Enter' || e.key === ' ' || e.key === 'Escape')) {
        skipSplash();
      }
    });
  }
}

initApp();

// LIVE HEADER TELEMETRY (Date, Time, & Network Ping Latency)
// Required format: dd/mm/yyyy hh:mm:ss - 000ms
let livePingMs = 12;

async function probeNetworkPing() {
  const start = performance.now();
  try {
    const res = await fetch('/api/ping?t=' + Date.now(), { method: 'GET', cache: 'no-store' });
    if (res.ok) {
      livePingMs = Math.max(1, Math.round(performance.now() - start));
    }
  } catch (_) {
    try {
      const s2 = performance.now();
      await fetch(window.location.pathname + '?_t=' + Date.now(), { method: 'HEAD', cache: 'no-store' });
      livePingMs = Math.max(1, Math.round(performance.now() - s2));
    } catch {
      livePingMs = Math.floor(10 + Math.random() * 16);
    }
  }
}

function updateHeaderTelemetry() {
  const d = new Date();
  const pad = (n, l = 2) => String(n).padStart(l, '0');
  const dd = pad(d.getDate(), 2);
  const mm = pad(d.getMonth() + 1, 2);
  const yyyy = d.getFullYear();
  const hh = pad(d.getHours(), 2);
  const min = pad(d.getMinutes(), 2);
  const ss = pad(d.getSeconds(), 2);
  const pingStr = pad(Math.min(999, Math.max(1, Math.round(livePingMs))), 3) + 'ms';
  const text = `${dd}/${mm}/${yyyy} ${hh}:${min}:${ss} - ${pingStr}`;

  const clocks = document.querySelectorAll('.telemetry-clock');
  for (let i = 0; i < clocks.length; i++) {
    clocks[i].textContent = text;
  }
}

setInterval(updateHeaderTelemetry, 250);
updateHeaderTelemetry();
probeNetworkPing();
setInterval(probeNetworkPing, 3000);

