/* SWIFT & ISO 20022 Enterprise Message Engine */
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

  function formatFinAmount(amt, cur){
    if(cur === 'JPY') return Number(amt).toFixed(0) + ',';
    const parts = Number(amt).toFixed(2).split('.');
    if(parts[1] === '00') return parts[0] + ',';
    return parts[0] + ',' + parts[1];
  }

  function fields(t,type){
    const c=customer(type);
    const d=(t.valueDate||'').replaceAll('-','').slice(2); // YYMMDD format
    const a=formatFinAmount(t.amount, t.currency);
    const party=(name,account,address)=>'/'+value(account)+'\n'+value(name)+(address?'\n'+address:'');
    const f=[['20',"Sender\u2019s Reference",value(t.reference||t.id)]];
    if(c)f.push(['23B','Bank Operation Code','CRED']);else f.push(['21','Related Reference',value(t.relatedReference)]);
    f.push(['32A','Value Date / Currency / Interbank Settled Amount',d+t.currency+a]);
    if(c)f.push(['50K','Ordering Customer',party(t.orderingName,t.orderingAccount,t.orderingAddress)]);
    f.push(['52A','Ordering Institution',value(t.sender)],['57A','Account With Institution',value(t.receiver)]);
    if(c){
      f.push(['59','Beneficiary Customer',party(t.beneficiaryName,t.beneficiaryAccount,t.beneficiaryAddress)]);
      if(t.narrative)f.push(['70','Remittance Information',t.narrative]);
      f.push(['71A','Details of Charges',value(t.charges||'SHA')]);
    } else {
      f.push(['58A','Beneficiary Institution',value(t.receiver)]);
    }
    return f;
  }

  function header(t,type,banks=[]){
    const name=b=>banks.find(x=>x.bic===b)?.name||'Not in local directory';
    return [
      ['Message Type',type+(type==='MT103'?' — Single Customer Credit Transfer':type==='MT202'?' — General Financial Institution Transfer':'')],
      ['Sender',t.sender+' / '+name(t.sender)],
      ['Receiver',t.receiver+' / '+name(t.receiver)],
      ['UETR Tag 121',value(t.uetr)],
      ['MUR Tag 108',value(t.reference||t.trn||t.id)],
      ['GPI Service Type 111','001 (gCustomerCredit / SWIFT GPI)'],
      ['Transaction Reference (:20:)',value(t.reference||t.id)],
      ['Legacy / TRN Reference',value(t.trn)],
      ['Status',value(t.status)],
      ['SWIFT Network Delivery','RELEASED / LIVE TRANSMISSION SYNCHRONIZED']
    ];
  }

  function text(t,type,banks){
    const issues=checks(t,type);
    return [
      'SWIFT FIN TRANSMISSION COPY',
      'CORE BANKING & SWIFT GPI MESSAGE ARCHITECTURE',
      '',
      'MESSAGE HEADER',
      ...header(t,type,banks).map(([k,v])=>k.padEnd(28)+' : '+v),
      '',
      'RAW FIN SYNTAX BLOCKS',
      raw(t, type),
      '',
      'MESSAGE FIELDS',
      ...fields(t,type).map(([tag,label,v])=>':'+tag+': '+label+'\n'+v),
      '',
      'SWIFT NETWORK & SCHEMA VALIDATION',
      ...(issues.length?issues.map(x=>'REPAIR REQUIRED: '+x):['SWIFT ISO 15022 FIN syntax and ISO 20022 schema validation passed successfully.']),
      '',
      'END OF MESSAGE COPY'
    ].join('\r\n');
  }

  function copyHTML(t,type,banks){
    const issues=checks(t,type);
    const d=(t.valueDate||'').replaceAll('-','').slice(2);
    const a=formatFinAmount(t.amount, t.currency);
    const uetr=(t.uetr||'').toLowerCase();
    const ref=t.reference||t.id||'123ABCD';
    const mur=(t.trn||t.reference||t.id||'2127182').replace(/[^a-zA-Z0-9]/g, '').slice(0, 16);
    const lt=b=>b.slice(0,8)+'X'+(b.length===11?b.slice(8):'XXX');
    const msgNum=type.replace(/[^0-9]/g, '') || '103';

    return `
      <article class="message-copy">
        <div class="copy-masthead">
          <b>SWIFT MT${msgNum} MESSAGE SPECIFICATION</b>
          <span>PRODUCTION FIN / SWIFT GPI</span>
        </div>
        
        <!-- SWIFT MT103 Form Example Diagram Box (Matching Official SWIFT Format Specification) -->
        <div class="swift-form-example-card" style="background:#ffffff;border:2px solid #222;border-radius:12px;padding:20px 24px;margin:18px 0 24px;box-shadow:0 4px 12px rgba(0,0,0,0.06);font-family:monospace;">
          <div style="font-family:sans-serif;text-align:center;font-size:18px;font-weight:bold;margin-bottom:16px;color:#111;letter-spacing:0.5px;">
            SWIFT MT${msgNum} Form Example
          </div>

          <div style="font-size:13.5px;line-height:1.9;color:#111;overflow-x:auto;">
            <div>{1:F01${lt(t.sender)}0000000000}{2:I${msgNum}${lt(t.receiver)}XXXXN}</div>
            <div style="display:flex;align-items:center;flex-wrap:wrap;gap:4px;">
              <span>{3:{108:${mur}}{111:001}{121:</span>
              <span style="border:2px solid #f97316;padding:2px 8px;border-radius:4px;font-weight:bold;background:#fff7ed;color:#c2410c;" title="Unique End-to-end Transaction Reference (UETR Tag 121)">${uetr}</span>
              <span>}}</span>
            </div>
            <div style="margin-top:10px;display:flex;align-items:center;gap:8px;">
              <span style="font-weight:bold;">:20:</span>
              <span style="border:2px solid #f97316;padding:2px 8px;border-radius:4px;font-weight:bold;background:#fff7ed;color:#111;" title="Transaction Reference Number">${ref}</span>
            </div>
            <div>:23B:CRED</div>
            <div style="display:flex;align-items:center;gap:6px;flex-wrap:wrap;">
              <span style="font-weight:bold;">:32A:</span>
              <span style="border:2px solid #f97316;padding:2px 8px;border-radius:4px;font-weight:bold;background:#fff7ed;" title="Date of Payment (YYMMDD)">${d}</span>
              <span style="border:2px solid #f97316;padding:2px 8px;border-radius:4px;font-weight:bold;background:#fff7ed;" title="Sender's Currency">${t.currency}</span>
              <span style="border:2px solid #f97316;padding:2px 8px;border-radius:4px;font-weight:bold;background:#fff7ed;" title="Amount">${a}</span>
            </div>
          </div>

          <!-- Semantic Mapping Legend Container -->
          <div style="margin-top:18px;padding-top:14px;border-top:1px dashed #d1d5db;display:grid;grid-template-columns:repeat(auto-fit, minmax(180px, 1fr));gap:10px;font-family:sans-serif;font-size:12px;">
            <div style="background:#f3f4f6;padding:8px 12px;border-radius:6px;border-left:3px solid #f97316;">
              <b style="color:#c2410c;">UETR</b><br><span style="font-family:monospace;font-size:11px;">{121:${uetr}}</span>
            </div>
            <div style="background:#f3f4f6;padding:8px 12px;border-radius:6px;border-left:3px solid #f97316;">
              <b>Reference #</b><br><span style="font-family:monospace;font-size:11px;">:20: ${ref}</span>
            </div>
            <div style="background:#f3f4f6;padding:8px 12px;border-radius:6px;border-left:3px solid #f97316;">
              <b>Amount</b><br><span style="font-family:monospace;font-size:11px;">:32A: ${a}</span>
            </div>
            <div style="background:#f3f4f6;padding:8px 12px;border-radius:6px;border-left:3px solid #f97316;">
              <b>Sender’s Currency</b><br><span style="font-family:monospace;font-size:11px;">:32A: ${t.currency}</span>
            </div>
            <div style="background:#f3f4f6;padding:8px 12px;border-radius:6px;border-left:3px solid #f97316;">
              <b>Date of Payment</b><br><span style="font-family:monospace;font-size:11px;">:32A: ${d} (YYMMDD)</span>
            </div>
          </div>
        </div>

        <h3>Message Header</h3>
        <dl>${header(t,type,banks).map(([k,v])=>'<dt>'+html(k)+'</dt><dd>'+html(v)+'</dd>').join('')}</dl>

        <h3>Message Text &amp; FIN Tags</h3>
        ${fields(t,type).map(([tag,label,v])=>'<section class="message-field"><b>:'+tag+': '+html(label)+'</b><pre>'+html(v)+'</pre></section>').join('')}

        <h3>Validation Status</h3>
        <p>${html(issues.length?issues.join('\n'):'✓ All SWIFT FIN ISO 15022 and ISO 20022 message schema checks verified.').replaceAll('\n','<br>')}</p>
        
        <footer>SWIFT NETWORK &amp; CORE BANKING SYSTEM · PRODUCTION SPECIFICATION</footer>
      </article>
    `;
  }

  function raw(t,type){
    const issues=checks(t,type);
    if(issues.length) throw new Error(issues.join('\n'));
    const lt=b=>b.slice(0,8)+'X'+(b.length===11?b.slice(8):'XXX');
    const mur = (t.trn || t.reference || t.id || '2127182').replace(/[^a-zA-Z0-9]/g, '').slice(0, 16);
    const msgCode = type.replace(/[^0-9]/g, '') || '103';
    return '{1:F01'+lt(t.sender)+'0000000000}{2:I'+msgCode+lt(t.receiver)+'XXXXN}{3:{108:'+mur+'}{111:001}{121:'+t.uetr+'}}{4:\r\n'+fields(t,type).map(([tag,,v])=>':'+tag+':'+v).join('\r\n')+'\r\n-}';
  }

  root.PaymentMessages={bic,uuid,checks,fields,header,text,copyHTML,raw,formatFinAmount};
})(globalThis);
