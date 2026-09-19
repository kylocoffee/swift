// Message-copy workflow; all records and permissions remain browser-local.
function ensureMessageData(t){
  if(!t.uetr){t.uetr=PaymentMessages.uuid.test(t.trn)?t.trn.toLowerCase():crypto.randomUUID();persist();}
  return t;
}
tx.forEach(ensureMessageData);
const paymentInputs=[['reference','SENDER REFERENCE (:20:)',16],['uetr','UETR (READ ONLY)',36],['orderingName','ORDERING CUSTOMER (:50K:)',35],['orderingAccount','ORDERING ACCOUNT',34],['orderingAddress','ORDERING ADDRESS',107],['beneficiaryName','BENEFICIARY CUSTOMER (:59:)',35],['beneficiaryAccount','BENEFICIARY ACCOUNT',34],['beneficiaryAddress','BENEFICIARY ADDRESS',107],['relatedReference','RELATED REFERENCE (:21: / MT202)',16]];
$('.modal-grid',$('#txForm')).insertAdjacentHTML('beforeend',paymentInputs.map(([id,label,max])=>`<label><b>${label}</b>${id.endsWith('Address')?`<textarea id="pay-${id}" rows="3" maxlength="${max}" placeholder="Up to 3 lines, 35 characters each"></textarea>`:`<input id="pay-${id}" maxlength="${max}" ${id==='uetr'?'readonly':''}>`}</label>`).join('')+'<label><b>DETAILS OF CHARGES (:71A:)</b><select id="pay-charges"><option>SHA</option><option>OUR</option><option>BEN</option></select></label><div class="wide message-help">SHA: shared charges · OUR: sender pays · BEN: beneficiary pays. Customer fields are required for MT103/pacs.008. Use fictional data for practical exercises.</div><div id="messageErrors" class="wide message-errors hidden" role="alert"></div>');
function fillMessageFields(t){
  if(t)ensureMessageData(t);
  for(const [id] of paymentInputs)$('#pay-'+id).value=t?.[id]||(id==='reference'?t?.id||'':id==='uetr'?crypto.randomUUID():'');
  $('#pay-charges').value=t?.charges||'SHA';$('#messageErrors').classList.add('hidden');
  $('#status').disabled=true;$('#status').title='Change status through UPDATE STATUS with an approval note';
}
function readMessageFields(old,item){
  const values=Object.fromEntries(paymentInputs.map(([id])=>[id,$('#pay-'+id).value.trim()]));
  values.reference=values.reference||item.id;
  values.uetr=old?.uetr||values.uetr;values.charges=$('#pay-charges').value;
  values.status=old?.status||'Pending';return values;
}
function showMessageErrors(issues){$('#messageErrors').innerHTML='<b>PLEASE REPAIR THE FOLLOWING FIELDS</b><ul>'+issues.map(x=>'<li>'+esc(x)+'</li>').join('')+'</ul>';$('#messageErrors').classList.remove('hidden');$('#messageErrors').scrollIntoView({block:'nearest'});}
function renderMessageControls(t){
  const problems=PaymentMessages.checks(t),unique=!tx.some(x=>x.id!==t.id&&x.uetr===t.uetr),routing=[t.sender,t.receiver].every(b=>bics.some(x=>x.bic===b));
  const checks=[['LOCAL FIELD CHECKS',problems.length?problems.length+' issue(s) — open DOWNLOAD to inspect':'Basic checks passed; no network validation',!problems.length],['UETR',unique&&PaymentMessages.uuid.test(t.uetr)?'UUID v4; unique in local records':'Duplicate or invalid UETR',unique&&PaymentMessages.uuid.test(t.uetr)],['LOCAL BIC DIRECTORY',routing?'Both BICs found in local directory':'One or more BICs not in local directory',routing],['NETWORK / SANCTIONS','Not connected; no external screening performed',false]];
  $('.audit-wrap',$('#trackingContent')).insertAdjacentHTML('beforebegin','<section class="validation-wrap"><h3 class="tracking-section-title">Message controls</h3><div class="validation-grid">'+checks.map(([title,detail,ok])=>`<div class="validation-item ${ok?'':'warning'}"><b>${title}</b>${esc(detail)}</div>`).join('')+'</div></section>');
  $('.tracking-number').innerHTML='UETR: <b>'+esc(t.uetr)+'</b><br>Search reference: '+esc(t.trn);
  const summary=$$('.tracking-summary>div');summary[9].querySelector('strong').textContent=t.charges||'Not provided';
  // A local release state alone is not evidence of beneficiary credit.
  summary[7].querySelector('strong').textContent='Not confirmed';
  summary[5].querySelector('strong').textContent='Illustrative timeline';
  summary[8].querySelector('small').textContent='Illustrative fee estimate';
  $$('.flow-card').at(-1).querySelector('p:last-child').textContent=t.status==='Released'?'Local release recorded; beneficiary credit not confirmed':'Awaiting local processing';
}
$('#exportForm').insertAdjacentHTML('afterbegin','<p class="message-help">TRAINING MESSAGE COPY · No network delivery or payment confirmation.</p>');
$('#exportFormat').closest('label').insertAdjacentHTML('afterend','<label class="output-label"><b>OUTPUT</b><select id="messageOutput"><option value="copy">Message copy — TXT (Header + Text)</option><option value="html">Message copy — HTML (printable)</option><option value="raw">Raw FIN — technical training file</option></select></label>');
$('#exportHelp').insertAdjacentHTML('afterend','<div id="exportValidation" class="message-errors" role="status"></div><div id="messagePreview" aria-label="Message preview"></div><button type="button" id="printMessage" class="pill secondary">PRINT / SAVE PDF</button>');
function selectedMessage(){return tx.find(x=>x.id===currentTrackingId);}
function selectedFormat(t){return $('#exportFormat').value==='original'?t.type:$('#exportFormat').value;}
function exportProblems(t,format){return ['MT103','MT202','pacs.008','pacs.009'].includes(format)?PaymentMessages.checks(t,format):[];}
function updateMessagePreview(){
  const t=selectedMessage();if(!t)return;ensureMessageData(t);const format=selectedFormat(t),isMT=['MT103','MT202'].includes(format),issues=exportProblems(t,format),output=$('#messageOutput');
  output.disabled=!isMT;$('#exportUetr').textContent=t.uetr;
  $('#exportValidation').innerHTML=issues.length?'<b>REPAIR REQUIRED — COPY REMAINS AVAILABLE</b><ul>'+issues.map(x=>'<li>'+esc(x)+'</li>').join('')+'</ul>':'Basic local checks only. No SWIFT network or scheme certification.';
  $('#exportHelp').textContent=isMT?'The message copy includes labelled fields. Raw FIN is available only after local field checks pass. Missing information remains visibly marked.':exportDescriptions[$('#exportFormat').value]||'Training XML — not XSD-certified.';
  $('#messagePreview').innerHTML=isMT?PaymentMessages.copyHTML(t,format,bics):'<pre>'+esc(messageFile(t,format).body)+'</pre>';
  $('#printMessage').classList.toggle('hidden',!isMT||!can('print'));
  $('#exportForm button[type="submit"]').disabled=issues.length>0&&(!isMT||output.value==='raw');
}
let exportReturnId=null;
function openMessageDownload(){
  if(!can('export'))return denied();const t=selectedMessage();if(!t)return note('TRANSACTION NOT FOUND');
  exportReturnId=t.id;
  $('#exportFormat').value=({'pacs.008':'MT103','pacs.009':'MT202'})[t.type]||'original';
  $('#messageOutput').value='copy';
  $('#uetrDialog').close();
  $('#exportDialog').showModal();$('#exportDialog').scrollTop=0;
  try{updateMessagePreview();}catch(error){
    console.error('Message preview failed',error);
    $('#messagePreview').textContent='Preview unavailable for this record. Close this window to return to UETR tracking.';
    $('#exportValidation').textContent='Unable to prepare this message. Please check the transaction data.';
    $('#exportForm button[type="submit"]').disabled=true;
  }
}
function closeMessageDownload(){if($('#exportDialog').open)$('#exportDialog').close();}
function closeTrackingView(){exportReturnId=null;closeMessageDownload();$('#uetrDialog').close();currentTrackingId=null;}
$('#downloadMessage').onclick=openMessageDownload;
$$('[data-close-export]').forEach(button=>button.onclick=closeMessageDownload);
$('#exportDialog').addEventListener('cancel',e=>{e.preventDefault();closeMessageDownload();});
$('#closeTracking').onclick=$('#trackingBack').onclick=closeTrackingView;
$('#uetrDialog').addEventListener('cancel',e=>{e.preventDefault();closeTrackingView();});
$('#exportFormat').onchange=$('#messageOutput').onchange=updateMessagePreview;
$('#exportForm').onsubmit=e=>{
  e.preventDefault();if(!can('export'))return denied();const t=selectedMessage();if(!t)return;
  const format=selectedFormat(t),isMT=['MT103','MT202'].includes(format),output=$('#messageOutput').value,issues=exportProblems(t,format);
  if(issues.length&&(!isMT||output==='raw')){updateMessagePreview();return note('REPAIR MESSAGE FIELDS FIRST');}
  let file;
  if(isMT&&output==='raw')file={name:t.id+'-'+format+'-training.fin',mime:'text/plain;charset=utf-8',body:PaymentMessages.raw(t,format)};
  else if(isMT&&output==='html')file={name:t.id+'-'+format+'-copy.html',mime:'text/html;charset=utf-8',body:'<!doctype html><html lang="en"><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>'+esc(format)+' Training Copy</title><style>'+copyPrintStyle+'</style><body>'+PaymentMessages.copyHTML(t,format,bics)+'</body></html>'};
  else file=messageFile(t,format);
  saveDownload(file);audit(t,'MESSAGE_EXPORTED',format+' / '+(isMT?output:'data')+' / '+issues.length+' local issue(s)');persist();note('MESSAGE COPY DOWNLOADED');
};
const copyPrintStyle='body{font:14px Arial,sans-serif;color:#111;max-width:850px;margin:30px auto;padding:20px}.copy-masthead{display:flex;justify-content:space-between;border-bottom:3px solid;padding-bottom:14px}.copy-notice{font-size:11px;border:1px solid;padding:9px}h3{background:#eee;padding:9px;border-bottom:1px solid;font-size:16px}dl{display:grid;grid-template-columns:170px 1fr;gap:8px}dt{font-weight:bold}dd{margin:0;overflow-wrap:anywhere}.message-field{padding:10px 0;border-bottom:1px solid #ddd;break-inside:avoid}pre{white-space:pre-wrap;overflow-wrap:anywhere;font:13px monospace;margin:8px 0}footer{margin-top:24px;font-size:11px;border-top:1px solid;padding-top:12px}@media(max-width:500px){dl{grid-template-columns:1fr}}@media print{body{margin:0}h3{break-after:avoid}}';
$('#printMessage').onclick=()=>{if(!can('print'))return denied();document.body.classList.add('message-print');setTimeout(()=>window.print(),540);};
window.addEventListener('afterprint',()=>document.body.classList.remove('message-print'));
$('#exportDialog').addEventListener('close',()=>{
  const id=exportReturnId;exportReturnId=null;
  const t=tx.find(x=>x.id===id);
  if(t&&can('view')){openTracking(t);$('#downloadMessage').focus();}
});
// Do not allow status changes to bypass the same basic message checks.
const previousStatusSubmit=$('#statusForm').onsubmit;
$('#statusForm').onsubmit=e=>{const t=tx.find(x=>x.id===$('#statusTxId').value);if(!can('status')){e.preventDefault();return denied();}if(!$('#statusNote').value.trim()){e.preventDefault();return note('APPROVAL NOTE REQUIRED');}if(t&&['Validated','Released'].includes($('#newStatus').value)){ensureMessageData(t);if(PaymentMessages.checks(t).length){e.preventDefault();return note('REPAIR MESSAGE FIELDS BEFORE VALIDATION / RELEASE');}}previousStatusSubmit(e);};
