// Message-copy workflow; all records and permissions remain browser-local.
function ensureMessageData(t){
  if(!t.uetr || !PaymentMessages.uuid.test(t.uetr)){
    t.uetr = crypto.randomUUID();
    persist();
  }
  return t;
}
tx.forEach(ensureMessageData);

const paymentInputs = [
  ['reference','SENDER REFERENCE (:20:)',16],
  ['uetr','UETR (READ ONLY / AUTO UUID v4)',36],
  ['orderingName','ORDERING CUSTOMER (:50K:)',35],
  ['orderingAccount','ORDERING ACCOUNT',34],
  ['orderingAddress','ORDERING ADDRESS',107],
  ['beneficiaryName','BENEFICIARY CUSTOMER (:59:)',35],
  ['beneficiaryAccount','BENEFICIARY ACCOUNT',34],
  ['beneficiaryAddress','BENEFICIARY ADDRESS',107],
  ['relatedReference','RELATED REFERENCE (:21: / MT202)',16]
];

// Insert customer quick-fill and SWIFT fields into transaction form
const modalGrid = $('.modal-grid', $('#txForm'));
if (modalGrid) {
  modalGrid.insertAdjacentHTML('beforeend', `
    <div class="wide" style="background:#f9f8f4;border:2px solid var(--ink);padding:12px;margin:8px 0">
      <b style="display:block;font-size:13px;margin-bottom:6px">CORE BANKING: SELECT ORDERING CUSTOMER ACCOUNT</b>
      <select id="custQuickFill" style="width:100%;height:38px;border:1px solid #333;background:#fff;padding:0 8px;font-size:13px;font-weight:bold">
        <option value="">-- SELECT ORDERING ACCOUNT (BANK PRAKTIKUM NUSANTARA) --</option>
      </select>
      <div id="custBalanceInfo" style="font-size:12px;margin-top:6px;font-weight:bold;color:#0a5c0a"></div>
    </div>
  ` + paymentInputs.map(([id, label, max]) => `
    <label>
      <b>${label}</b>
      ${id.endsWith('Address') ? `<textarea id="pay-${id}" rows="3" maxlength="${max}" placeholder="Up to 3 lines, 35 chars each"></textarea>` : `<input id="pay-${id}" maxlength="${max}" ${id==='uetr'?'readonly':''}>`}
    </label>
  `).join('') + `
    <label>
      <b>DETAILS OF CHARGES (:71A:)</b>
      <select id="pay-charges">
        <option value="SHA">SHA — Shared Charges (Standard Banking Split)</option>
        <option value="OUR">OUR — Sender Pays All (Ordering Customer Bears Fees)</option>
        <option value="BEN">BEN — Beneficiary Pays All (Deducted from Proceeds)</option>
      </select>
    </label>
    <div class="wide message-help">SHA: Split between ordering &amp; beneficiary banks · OUR: Remitter bears all correspondent fees · BEN: Beneficiary pays. Full ordering &amp; beneficiary party data is mandatory for MT103 and pacs.008 customer credit transfers.</div>
    <div id="messageErrors" class="wide message-errors hidden" role="alert"></div>
  `);
}

$('#custQuickFill')?.addEventListener('change', e => {
  const accNo = e.target.value;
  if (!accNo || typeof customers === 'undefined') return;
  const c = customers.find(x => x.accountNo === accNo);
  if (!c) return;
  if ($('#pay-orderingName')) $('#pay-orderingName').value = c.name;
  if ($('#pay-orderingAccount')) $('#pay-orderingAccount').value = c.accountNo;
  if ($('#pay-orderingAddress')) $('#pay-orderingAddress').value = c.address;
  if ($('#currency')) $('#currency').value = c.currency;
  if ($('#custBalanceInfo')) {
    $('#custBalanceInfo').textContent = `Available Effective Balance: ${c.currency === 'IDR' ? 'Rp ' + Number(c.balance).toLocaleString('id-ID') : c.currency + ' ' + Number(c.balance).toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
  }
});

function fillMessageFields(t){
  if(t) ensureMessageData(t);
  const qf = $('#custQuickFill');
  if (qf && typeof customers !== 'undefined') {
    qf.innerHTML = '<option value="">-- SELECT ORDERING ACCOUNT (BANK PRAKTIKUM NUSANTARA) --</option>' + customers.map(c => `
      <option value="${c.accountNo}" ${t?.orderingAccount === c.accountNo ? 'selected' : ''}>
        ${c.accountNo} - ${c.name} (${c.currency} ${Number(c.balance).toLocaleString()})
      </option>
    `).join('');
  }
  for(const [id] of paymentInputs){
    const el = $('#pay-' + id);
    if (el) {
      el.value = t?.[id] || (id === 'reference' ? (t?.reference || t?.id || '') : id === 'uetr' ? crypto.randomUUID() : '');
    }
  }
  if ($('#pay-charges')) $('#pay-charges').value = t?.charges || 'SHA';
  $('#messageErrors')?.classList.add('hidden');
  if ($('#status')) {
    $('#status').disabled = true;
    $('#status').title = 'Status can only be reviewed and authorized by a designated Checker via UPDATE STATUS.';
  }
  if (t?.orderingAccount && typeof customers !== 'undefined') {
    const c = customers.find(x => x.accountNo === t.orderingAccount);
    if (c && $('#custBalanceInfo')) {
      $('#custBalanceInfo').textContent = `Available Effective Balance: ${c.currency === 'IDR' ? 'Rp ' + Number(c.balance).toLocaleString('id-ID') : c.currency + ' ' + Number(c.balance).toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
    }
  } else if ($('#custBalanceInfo')) {
    $('#custBalanceInfo').textContent = '';
  }
}

function readMessageFields(old, item){
  const values = Object.fromEntries(paymentInputs.map(([id]) => [id, $('#pay-' + id)?.value?.trim() || '']));
  values.reference = values.reference || item.id;
  values.uetr = old?.uetr || values.uetr || crypto.randomUUID();
  values.charges = $('#pay-charges')?.value || 'SHA';
  values.status = old?.status || 'Pending';
  return values;
}

function showMessageErrors(issues){
  const el = $('#messageErrors');
  if (!el) return;
  el.innerHTML = '<b>SWIFT MESSAGE VALIDATION EXCEPTIONS:</b><ul>' + issues.map(x => '<li>' + esc(x) + '</li>').join('') + '</ul>';
  el.classList.remove('hidden');
  el.scrollIntoView({ block: 'nearest' });
}

function renderMessageControls(t){
  const problems = PaymentMessages.checks(t);
  const unique = !tx.some(x => x.id !== t.id && x.uetr === t.uetr);
  const routing = [t.sender, t.receiver].every(b => bics.some(x => x.bic === b));
  const checks = [
    ['LOCAL FIELD CHECKS', problems.length ? `${problems.length} validation exception(s) detected — inspect copy for details` : 'SWIFT formatting rules validated successfully', !problems.length],
    ['UETR VERIFICATION', unique && PaymentMessages.uuid.test(t.uetr) ? 'UUID v4 syntax valid & unique in ledger' : 'Duplicate or non-RFC compliant UETR', unique && PaymentMessages.uuid.test(t.uetr)],
    ['CORRESPONDENT BIC ROUTING', routing ? 'Sender & Receiver BICs verified in directory' : 'Unrecognized or unregistered BIC routing code', routing],
    ['SANCTIONS & AML CLEARANCE', t.status === 'Rejected' ? 'Rejected: Flagged under Compliance Hold' : t.status === 'Validated' || t.status === 'Released' ? 'Sanctions Screening & KYC: PASSED' : 'Pending Compliance Officer Verification', t.status !== 'Rejected']
  ];

  const wrap = $('.audit-wrap', $('#trackingContent'));
  if (wrap) {
    wrap.insertAdjacentHTML('beforebegin', '<section class="validation-wrap"><h3 class="tracking-section-title">Message Integrity &amp; Compliance Controls</h3><div class="validation-grid">' + checks.map(([title, detail, ok]) => `<div class="validation-item ${ok ? '' : 'warning'}"><b>${title}</b>${esc(detail)}</div>`).join('') + '</div></section>');
  }
  const tNum = $('.tracking-number');
  if (tNum) {
    tNum.innerHTML = 'UETR: <b>' + esc(t.uetr) + '</b><br>TRN Reference: ' + esc(t.trn);
  }
  const summary = $$('.tracking-summary>div');
  if (summary.length >= 10) {
    summary[9].querySelector('strong').textContent = t.charges || 'SHA';
    summary[7].querySelector('strong').textContent = t.status === 'Released' ? 'Settled (Funds Effective)' : 'In Progress';
  }
}

$('#exportForm')?.insertAdjacentHTML('afterbegin', '<p class="message-help">TRAINING MESSAGE COPY · Educational SWIFT Network &amp; Core Banking Simulation.</p>');
const fmtLabel = $('#exportFormat')?.closest('label');
if (fmtLabel) {
  fmtLabel.insertAdjacentHTML('afterend', '<label class="output-label"><b>OUTPUT FORMAT</b><select id="messageOutput"><option value="copy">Message Copy — Plaintext (Header + SWIFT Text)</option><option value="html">Message Copy — HTML (Printable Payment Advice)</option><option value="raw">Raw FIN Format — SWIFT Telex Transmission Syntax</option></select></label>');
}
const expHelp = $('#exportHelp');
if (expHelp) {
  expHelp.insertAdjacentHTML('afterend', '<div id="exportValidation" class="message-errors" role="status"></div><div id="messagePreview" aria-label="Message preview"></div><button type="button" id="printMessage" class="pill secondary">PRINT MESSAGE</button>');
}

function selectedMessage(){ return tx.find(x => x.id === currentTrackingId); }
function selectedFormat(t){ return $('#exportFormat')?.value === 'original' ? t.type : $('#exportFormat')?.value; }
function exportProblems(t, format){ return ['MT103', 'MT202', 'pacs.008', 'pacs.009'].includes(format) ? PaymentMessages.checks(t, format) : []; }

function updateMessagePreview(){
  const t = selectedMessage();
  if(!t) return;
  ensureMessageData(t);
  const format = selectedFormat(t);
  const isMT = ['MT103', 'MT202'].includes(format);
  const issues = exportProblems(t, format);
  const output = $('#messageOutput');
  if (output) output.disabled = !isMT;
  if ($('#exportUetr')) $('#exportUetr').textContent = t.uetr;
  if ($('#exportValidation')) {
    $('#exportValidation').innerHTML = issues.length ? '<b>FIELD VALIDATION EXCEPTIONS:</b><ul>' + issues.map(x => '<li>' + esc(x) + '</li>').join('') + '</ul>' : '<span style="color:#0a5c0a;font-weight:bold">✓ Validated against SWIFT FIN and ISO 20022 specifications.</span>';
  }
  if ($('#exportHelp')) {
    $('#exportHelp').textContent = isMT ? 'Includes standard SWIFT tag syntax (:20:, :32A:, :50K:, :59:, etc.).' : exportDescriptions[$('#exportFormat')?.value] || 'Standard ISO 20022 Business Application Header & Document.';
  }
  if ($('#messagePreview')) {
    $('#messagePreview').innerHTML = isMT ? PaymentMessages.copyHTML(t, format, bics) : '<pre style="max-height:280px;overflow:auto;background:#f5f5f5;padding:12px;font-size:12px">' + esc(messageFile(t, format).body) + '</pre>';
  }
  if ($('#printMessage')) $('#printMessage').classList.toggle('hidden', !isMT || !can('print'));
  const submitBtn = $('#exportForm button[type="submit"]');
  if (submitBtn) submitBtn.disabled = issues.length > 0 && (!isMT || output?.value === 'raw');
}

let exportReturnId = null;
function openMessageDownload(){
  if(!can('export')) return denied();
  const t = selectedMessage();
  if(!t) return note('TRANSACTION RECORD NOT FOUND');
  exportReturnId = t.id;
  if ($('#exportFormat')) {
    $('#exportFormat').value = ({ 'pacs.008': 'MT103', 'pacs.009': 'MT202' })[t.type] || 'original';
  }
  if ($('#messageOutput')) $('#messageOutput').value = 'copy';
  $('#uetrDialog')?.close();
  $('#exportDialog')?.showModal();
  $('#exportDialog').scrollTop = 0;
  try {
    updateMessagePreview();
  } catch(err) {
    console.error('Message preview failed', err);
  }
}

function closeMessageDownload(){ if($('#exportDialog')?.open) $('#exportDialog').close(); }
function closeTrackingView(){ exportReturnId = null; closeMessageDownload(); $('#uetrDialog')?.close(); currentTrackingId = null; }

$('#downloadMessage')?.addEventListener('click', openMessageDownload);
$$('[data-close-export]').forEach(button => button.onclick = closeMessageDownload);
$('#exportDialog')?.addEventListener('cancel', e => { e.preventDefault(); closeMessageDownload(); });
$('#closeTracking')?.addEventListener('click', closeTrackingView);
$('#trackingBack')?.addEventListener('click', closeTrackingView);
$('#uetrDialog')?.addEventListener('cancel', e => { e.preventDefault(); closeTrackingView(); });

$('#exportFormat')?.addEventListener('change', updateMessagePreview);
$('#messageOutput')?.addEventListener('change', updateMessagePreview);

const copyPrintStyle = 'body{font:14px Arial,sans-serif;color:#111;max-width:850px;margin:30px auto;padding:20px}.copy-masthead{display:flex;justify-content:space-between;border-bottom:3px solid;padding-bottom:14px}.copy-notice{font-size:11px;border:1px solid;padding:9px}h3{background:#eee;padding:9px;border-bottom:1px solid;font-size:16px}dl{display:grid;grid-template-columns:170px 1fr;gap:8px}dt{font-weight:bold}dd{margin:0;overflow-wrap:anywhere}.message-field{padding:10px 0;border-bottom:1px solid #ddd;break-inside:avoid}pre{white-space:pre-wrap;overflow-wrap:anywhere;font:13px monospace;margin:8px 0}footer{margin-top:24px;font-size:11px;border-top:1px solid;padding-top:12px}@media(max-width:500px){dl{grid-template-columns:1fr}}@media print{body{margin:0}h3{break-after:avoid}}';

$('#printMessage')?.addEventListener('click', () => {
  if(!can('print')) return denied();
  window.print();
});

$('#exportDialog')?.addEventListener('close', () => {
  const id = exportReturnId;
  exportReturnId = null;
  const t = tx.find(x => x.id === id);
  if(t && can('view')) {
    openTracking(t);
  }
});
