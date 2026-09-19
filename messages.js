/* Educational message-copy model. No network submission or XSD certification. */
(function(root){
  const bic=/^[A-Z]{4}[A-Z]{2}[A-Z0-9]{2}([A-Z0-9]{3})?$/;
  const uuid=/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  const html=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const value=v=>String(v||'NOT PROVIDED');
  const customer=type=>['MT103','pacs.008'].includes(type);
  function checks(t,type=t.type){
    const issues=[];
    for(const k of ['sender','receiver'])if(!bic.test(t[k]||''))issues.push(k.toUpperCase()+': use a valid 8 or 11 character BIC');
    if(!uuid.test(t.uetr||''))issues.push('UETR: UUID version 4 required');
    if(!Number.isFinite(Number(t.amount))||Number(t.amount)<=0)issues.push('AMOUNT: must be positive');
    if(t.currency==='JPY'&&!Number.isInteger(Number(t.amount)))issues.push('JPY amount must be a whole number');
    if(!/^\d{4}-\d{2}-\d{2}$/.test(t.valueDate||'')||!Number.isFinite(Date.parse(t.valueDate))||new Date(t.valueDate).toISOString().slice(0,10)!==t.valueDate)issues.push('VALUE DATE: a valid calendar date is required');
    if(!/^[A-Z]{3}$/.test(t.currency||''))issues.push('CURRENCY: 3-letter code required');
    const ref=t.reference||t.id;
    if(!ref||ref.length>16||ref.startsWith('/')||ref.endsWith('/')||ref.includes('//'))issues.push('REFERENCE: 1–16 characters; no leading/trailing slash or double slash');
    if(customer(type)){
      for(const k of ['orderingName','orderingAccount','beneficiaryName','beneficiaryAccount'])if(!String(t[k]||'').trim())issues.push(k+': required for a customer transfer');
      if(!['SHA','OUR','BEN'].includes(t.charges))issues.push('CHARGES: select SHA, OUR, or BEN');
    }
    for(const k of ['orderingName','beneficiaryName','orderingAddress','beneficiaryAddress','narrative']){
      const lines=String(t[k]||'').split('\n');const max=k==='narrative'?4:k.endsWith('Address')?3:1;
      if(lines.length>max||lines.some(l=>l.length>35))issues.push(k+': maximum '+max+' line(s), 35 characters each');
    }
    for(const k of ['orderingAccount','beneficiaryAccount'])if(String(t[k]||'').length>34)issues.push(k+': maximum 34 characters');
    for(const k of ['reference','relatedReference','orderingName','beneficiaryName','orderingAccount','beneficiaryAccount'])if(/[\r\n]/.test(t[k]||''))issues.push(k+': must be a single line');
    if(Number(t.amount).toFixed(2).length>15)issues.push('AMOUNT: exceeds the 15-character FIN amount limit');
    for(const k of ['reference','orderingName','orderingAccount','orderingAddress','beneficiaryName','beneficiaryAccount','beneficiaryAddress','narrative','relatedReference'])if(!/^[a-zA-Z0-9/?:().,'+ \r\n-]*$/.test(t[k]||''))issues.push(k+': unsupported FIN character');
    if(type==='MT202'&&!t.relatedReference)issues.push('RELATED REFERENCE (:21:): required for MT202');
    return issues;
  }
  function fields(t,type){
    const c=customer(type),d=(t.valueDate||'').replaceAll('-','').slice(2),a=t.currency==='JPY'?Number(t.amount).toFixed(0)+',':Number(t.amount).toFixed(2).replace('.',',');
    const party=(name,account,address)=>'/'+value(account)+'\n'+value(name)+(address?'\n'+address:'');
    const f=[['20',"Sender\u2019s Reference",value(t.reference||t.id)]];
    if(c)f.push(['23B','Bank Operation Code','CRED']);else f.push(['21','Related Reference',value(t.relatedReference)]);
    f.push(['32A','Value Date / Currency / Interbank Settled Amount',d+t.currency+a]);
    if(c)f.push(['50K','Ordering Customer',party(t.orderingName,t.orderingAccount,t.orderingAddress)]);
    f.push(['52A','Ordering Institution',value(t.sender)],['57A','Account With Institution',value(t.receiver)]);
    if(c){f.push(['59','Beneficiary Customer',party(t.beneficiaryName,t.beneficiaryAccount,t.beneficiaryAddress)]);if(t.narrative)f.push(['70','Remittance Information',t.narrative]);f.push(['71A','Details of Charges',value(t.charges)]);}
    else f.push(['58A','Beneficiary Institution',value(t.receiver)]);
    return f;
  }
  function header(t,type,banks=[]){
    const name=b=>banks.find(x=>x.bic===b)?.name||'Not in local directory';
    return [['Message Type',type+(type==='MT103'?' — Single Customer Credit Transfer':type==='MT202'?' — General Financial Institution Transfer':'')],['Sender',t.sender+' / '+name(t.sender)],['Receiver',t.receiver+' / '+name(t.receiver)],['UETR',value(t.uetr)],['Transaction Reference',value(t.reference||t.id)],['Legacy / Search Reference',value(t.trn)],['Local Status',value(t.status)],['Network Delivery','NOT SENT — TRAINING ENVIRONMENT']];
  }
  function text(t,type,banks){
    const issues=checks(t,type);
    return ['SWIFT NETWORK LAB — MESSAGE COPY','EDUCATIONAL SIMULATION / NOT A PAYMENT CONFIRMATION','','MESSAGE HEADER',...header(t,type,banks).map(([k,v])=>k.padEnd(25)+' : '+v),'','MESSAGE TEXT',...fields(t,type).map(([tag,label,v])=>':'+tag+': '+label+'\n'+v),'','LOCAL VALIDATION',...(issues.length?issues.map(x=>'REPAIR REQUIRED: '+x):['Basic field checks passed. Network and scheme validation not performed.']),'','END OF MESSAGE COPY'].join('\r\n');
  }
  function copyHTML(t,type,banks){
    const issues=checks(t,type);
    return '<article class="message-copy"><div class="copy-masthead"><b>SWIFT NETWORK LAB</b><span>MESSAGE COPY</span></div><p class="copy-notice">EDUCATIONAL SIMULATION — NOT A PAYMENT CONFIRMATION</p><h3>Message Header</h3><dl>'+header(t,type,banks).map(([k,v])=>'<dt>'+html(k)+'</dt><dd>'+html(v)+'</dd>').join('')+'</dl><h3>Message Text</h3>'+fields(t,type).map(([tag,label,v])=>'<section class="message-field"><b>:'+tag+': '+html(label)+'</b><pre>'+html(v)+'</pre></section>').join('')+'<h3>Local Validation</h3><p>'+html(issues.length?issues.join('\n'):'Basic field checks passed. Network and scheme validation not performed.').replaceAll('\n','<br>')+'</p><footer>END OF MESSAGE COPY · TRAINING USE ONLY</footer></article>';
  }
  function raw(t,type){
    const issues=checks(t,type);if(issues.length)throw new Error(issues.join('\n'));
    const lt=b=>b.slice(0,8)+'X'+(b.length===11?b.slice(8):'XXX');
    return '{1:F01'+lt(t.sender)+'0000000000}{2:I'+type.slice(2)+lt(t.receiver)+'N}{3:{121:'+t.uetr+'}}{4:\r\n'+fields(t,type).map(([tag,,v])=>':'+tag+':'+v).join('\r\n')+'\r\n-}';
  }
  root.PaymentMessages={bic,uuid,checks,fields,header,text,copyHTML,raw};
})(globalThis);
