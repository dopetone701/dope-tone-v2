// vault-private-v2.js - MATCHES CURRENT LICENCE 100% - DNA
const VAULT_API = 'https://vault-orders-api.dopetone701.workers.dev';
const PROMO_API = 'https://emails-api.dopetone701.workers.dev';

// SAME RULES AS YOUR CURRENT LICENCE.JS - SOLID
const RULES = {
  free: {
    mp3:true, wav:false, stems:false,
    label:'FREE', includes:['MP3 (tagged)'],
    streams:'No streaming',
    rights:'Tagged • Non-profit • Practice only • No monetization'
  },
  basic: {
    mp3:true, wav:true, stems:false,
    label:'BASIC', includes:['MP3','WAV','No stems'],
    streams:'5,000 streams',
    rights:'Commercial use • Limited use • MP3 + WAV delivery'
  },
  pro: {
    mp3:true, wav:true, stems:true,
    label:'PRO', includes:['MP3','WAV','STEMS'],
    streams:'50,000 streams',
    rights:'Monetization • Advanced use • Trackout included'
  },
  exclusive: {
    mp3:true, wav:true, stems:true,
    label:'EXCLUSIVE', includes:['MP3','WAV','STEMS'],
    streams:'Unlimited streams',
    rights:'Full ownership • Beat removed from store • Commercial rights • Resale rights'
  }
};

function getRule(type){
  const t=(type||'basic').toLowerCase();
  if(t.includes('exclusive')) return RULES.exclusive;
  if(t.includes('pro')) return RULES.pro;
  if(t.includes('free')) return RULES.free;
  return RULES.basic;
}
function dlText(name, txt){
  const b=new Blob([txt],{type:'text/plain'}); const u=URL.createObjectURL(b);
  const a=document.createElement('a'); a.href=u; a.download=name; a.click(); setTimeout(()=>URL.revokeObjectURL(u),1000);
}

export function render(){
  return `
  <style>
  :root{--navy:#0A1931;--void:#050A14;--card:#111c36;--card2:#0a122a;--red:#FF1E3C;--blue:#1E90FF;--white:#FFFFFF;--muted:#9CA3AF;--border:rgba(255,255,255,0.1)}
.vault-wrap{max-width:900px;margin:0 auto;padding:24px;min-height:80vh}
.vault-head{background:linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.02));border:1px solid var(--border);border-radius:20px;padding:22px;margin-bottom:16px;backdrop-filter:blur(20px)}
.vault-card{background:var(--card);border:1px solid var(--border);border-radius:20px;padding:20px;margin:14px 0}
.v-btn{display:inline-flex;padding:11px 14px;border-radius:12px;text-decoration:none;font-weight:700;font-size:12px;margin:6px 6px 0 0;border:0;cursor:pointer}
.v-btn-mp3{background:var(--white);color:#000}
.v-btn-wav{background:var(--blue);color:#fff;box-shadow:0 0 15px rgba(30,144,255,0.3)}
.v-btn-stems{background:var(--red);color:#fff;box-shadow:0 0 20px rgba(255,30,60,0.5)}
.v-btn-doc{background:var(--card2);color:var(--muted);border:1px solid var(--border)}
.v-badge{font-size:10px;padding:4px 10px;border-radius:99px;background:rgba(255,30,60,0.12);color:var(--red);border:1px solid rgba(255,30,60,0.25);font-weight:800}
.v-muted{color:var(--muted);font-size:12px;line-height:1.6}
  </style>
  <div class="vault-wrap" style="background:radial-gradient(ellipse at top, #0A1931 0%, #050A14 70%)">
    <div class="vault-head">
      <h1>🔒 Your Private Vault</h1>
      <div id="status" class="v-muted">Verifying licence -...</div>
    </div>
    <div id="downloads"></div>
  </div>`;
}

export async function init(){
  const hashQuery = window.location.hash.split('?')[1] || '';
  const params = new URLSearchParams(hashQuery || location.search);
  const sid = params.get('session_id') || localStorage.getItem('dopetone_last_session_id');
  const statusEl = document.getElementById('status');
  const downloadsEl = document.getElementById('downloads');

  if(!sid){ statusEl.textContent='No session_id. Open from #/licence/success?session_id=...'; return; }

  try{
    const r = await fetch(VAULT_API+'/api/orders/status?session_id='+encodeURIComponent(sid));
    const data = await r.json();
    if(data.status!=='paid'){ statusEl.textContent='Status: '+data.status; return; }
    const email=data.customer_email||''; const date=new Date().toLocaleString();
    statusEl.innerHTML='✅ Paid - $'+(data.total_cents/100).toFixed(2)+' - '+data.downloads.length+' beats unlocked - <span style="color:#FF1E3C"></span><br><small>'+email+' • '+date+'</small>';

    data.downloads.forEach(d=>{
      const rule=getRule(d.license_type);
      const card=document.createElement('div'); card.className='vault-card';
      card.innerHTML = '<div style="display:flex;justify-content:space-between;align-items:center"><b style="color:#fff">'+d.beat_title+'</b> <span class="v-badge">'+d.license_type.toUpperCase()+' • $'+(d.amount/100).toFixed(2)+'</span></div>' +
      '<div class="v-muted" style="margin:10px 0"><b style="color:#fff">INCLUDES:</b> '+rule.includes.join(' • ')+'<br><b style="color:#fff">STREAMS:</b> '+rule.streams+'<br><b style="color:#fff">RIGHTS:</b> '+rule.rights+'</div>' +
      '<div id="btns-'+d.beat_id+'"></div>';
      downloadsEl.appendChild(card);
      const btnWrap=card.querySelector('#btns-'+d.beat_id);

      if(rule.mp3){ const a=document.createElement('a'); a.className='v-btn v-btn-mp3'; a.href=VAULT_API+d.links.mp3; a.textContent='MP3 Private Link'; btnWrap.appendChild(a); }
      if(rule.wav){ const a=document.createElement('a'); a.className='v-btn v-btn-wav'; a.href=VAULT_API+d.links.wav; a.textContent='WAV Private Link'; btnWrap.appendChild(a); }
      if(rule.stems){ const a=document.createElement('a'); a.className='v-btn v-btn-stems'; a.href=VAULT_API+d.links.stems; a.textContent='STEMS Private Link'; btnWrap.appendChild(a); }

      const lic=document.createElement('button'); lic.className='v-btn v-btn-doc'; lic.textContent='📄 Licence';
      lic.onclick=()=>{
        const txt='DOPE TONE MUSIC - OFFICIAL LICENCE - SAME AS LICENCE POPUP\nBeat: '+d.beat_title+'\nLicence: '+d.license_type.toUpperCase()+'\nBuyer: '+email+'\nOrder: '+sid+'\nDate: '+date+'\nAmount: $'+(d.amount/100).toFixed(2)+'\n\nINCLUDES: '+rule.includes.join(', ')+'\nSTREAMS: '+rule.streams+'\nRIGHTS: '+rule.rights+'\n\nThis matches licence popup info exactly.\nCredit: Prod. By Dope Tone\n';
        dlText(d.beat_title+'_'+d.license_type+'_Licence.txt', txt);
      };
      btnWrap.appendChild(lic);
    });
  }catch(e){ statusEl.textContent='Error: '+e.message; }
}
