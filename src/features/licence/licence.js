// src/features/licence/licence.js - V12 - FULL WORKING - ONE FILE - LIVE SERVER 5500 SAFE - PAYPAL-V2 INSTANT
const esc = s => String(s??'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#039;');
const fix = v => { let p=Number(v); if(!Number.isFinite(p)) return 29.99; if(p>=1000) p/=100; return Number(p.toFixed(2)); };
const getBasic = b => fix(b?.price?? b?.base_price?? 29.99);
const priceFor = (beat, lic) => {
  const b=getBasic(beat);
  if(lic==="free") return 0;
  if(lic==="basic") return b;
  if(lic==="pro") return fix(b*2.2);
  if(lic==="exclusive") return fix(Math.max(b*10,149));
  return b;
};

const STATS_API="https://dopetone-stats.dopetone701.workers.dev";
const trackEvent=(id,type)=>{if(!id)return;fetch(`${STATS_API}/api/stats/event`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({beatId:parseInt(id),eventType:type}),keepalive:true}).catch(()=>{})};

function licenceData(beat){
  const b=priceFor(beat,'basic'), pro=priceFor(beat,'pro'), exc=priceFor(beat,'exclusive');
  return [
    {id:"free", name:"FREE", price:0, badge:"FREE TAGGED", features:["MP3 Tagged","Non-profit use only","Must credit DopeTone","No streaming monetization","1 Music Video non-profit"], not:["WAV","Stems","Untagged"]},
    {id:"basic", name:"BASIC", price:b, badge:"MOST POPULAR STARTER", features:["MP3 Untagged",`Distribute up to 5k streams`,`1 Music Video monetized`,`Radio: No`,`Must credit DopeTone`], not:["WAV","Stems"]},
    {id:"pro", name:"PRO", price:pro, badge:"BEST VALUE", features:["MP3 + WAV Untagged","Distribute up to 100k streams","Unlimited Music Videos","YouTube monetization OK","Radio: 1 station","Trackout on request"], not:["Stems"]},
    {id:"exclusive", name:"EXCLUSIVE", price:exc, badge:"FULL OWNERSHIP", features:["MP3 + WAV + STEMS","Unlimited Distribution","Unlimited Videos & Radio","Full Ownership - Beat removed","Exclusive Rights Contract","No credit required"], not:[]},
  ];
}

export function openLicencePopup(beat, selected="basic", onSelect=null){
  document.getElementById("licOverlay")?.remove();
  const licences=licenceData(beat);
  let current=selected;
  let viewAll=false;

  const wrap=document.createElement("div");
  wrap.innerHTML=`
    <div class="lic-overlay" id="licOverlay">
      <div class="lic-modal" id="licModal">
        <div class="lic-top">
          <div><h2 id="licTitle"></h2><p>Basic is true price • Pro x2.2 • Exclusive x10 • Auto-synced</p></div>
          <button class="lic-close" id="licClose">✕</button>
        </div>
        <div id="licBody"></div>
      </div>
    </div>`;
  document.body.appendChild(wrap.firstElementChild);
  const overlay=document.getElementById("licOverlay"), modal=document.getElementById("licModal"), body=document.getElementById("licBody");
  const isCartContext = typeof onSelect === 'function';

  function addToCartAndStay(lic){
    const p=priceFor(beat,lic);
    let cart; try{ cart=JSON.parse(localStorage.getItem("dopetone_cart")||"[]"); }catch{ cart=[]; }
    const idx=cart.findIndex(b=>String(b.id)===String(beat.id));
    if(idx>=0){ cart[idx].selected_licence=lic; cart[idx].price=p; cart[idx].licence=lic; }
    else { cart.push({...beat, selected_licence:lic, licence:lic, price:p, added_at:Date.now()}); trackEvent(beat.id,"cart"); }
    localStorage.setItem("dopetone_cart",JSON.stringify(cart));
    let licencesStore={}; try{ licencesStore=JSON.parse(localStorage.getItem("dopetone_licences")||"{}"); }catch{}
    licencesStore[beat.id]={name:lic.toUpperCase(), price:p};
    licencesStore[String(beat.id)]={name:lic.toUpperCase(), price:p};
    localStorage.setItem("dopetone_licences", JSON.stringify(licencesStore));
    window.dispatchEvent(new CustomEvent("cc_cart_updated",{detail:{count:cart.length}}));
    if(onSelect) onSelect(lic,p);
    return p;
  }

  function checkoutNow(lic){
    const p=addToCartAndStay(lic);
    overlay.remove();
    setTimeout(()=>{
      if(window.DT_openCartPaypalModal){
        window.DT_openCartPaypalModal();
      } else if(window.createPaypalCheckout){
        window.createPaypalCheckout();
      } else {
        location.hash='#/cart';
        setTimeout(()=> window.DT_openCartPaypalModal?.() || document.getElementById('goCheck')?.click(), 800);
      }
    }, 150);
  }

  function render(){
    const l = licences.find(x=>x.id===current);
   
    if(!viewAll){
      modal.classList.remove("wide");
      document.getElementById("licTitle").textContent=`Choose Licence - ${beat.title||'My Own'}`;
      const btnLabel = isCartContext ? `Use ${l.name} • ${l.price===0?'FREE':'$'+l.price.toFixed(2)}` : `Checkout • ${l.price===0?'FREE':'$'+l.price.toFixed(2)}`;
      body.innerHTML=`
        <div class="lic-single">
          <div class="lic-card active">
            <div class="lic-badge">${l.badge}</div>
            <div class="lic-name">${l.name}</div>
            <div class="lic-price">${l.price===0?'FREE':'$'+l.price.toFixed(2)}</div>
            <div class="lic-list">
              ${l.features.map(f=>`<div class="ok">✓ ${esc(f)}</div>`).join('')}
              ${l.not.map(f=>`<div class="no">✕ ${esc(f)}</div>`).join('')}
            </div>
            <div class="lic-actions">
              <button class="lic-btn ghost" id="viewAllBtn">View All Licences</button>
              <button class="lic-btn red" id="useBtn">${btnLabel}</button>
            </div>
          </div>
          <div class="lic-foot"><span>Secure • Instant • Contract included</span><span>${beat.genre||''} • ${beat.bpm||''} BPM</span></div>
        </div>`;
      document.getElementById("viewAllBtn").onclick=()=>{ viewAll=true; render(); };
      document.getElementById("useBtn").onclick=()=>{
        if(isCartContext){ addToCartAndStay(current); overlay.remove(); }
        else { checkoutNow(current); }
      };
    } else {
      modal.classList.add("wide");
      document.getElementById("licTitle").textContent=`Choose Licence - ${beat.title||'My Own'}`;
     
      body.innerHTML=`
        <div class="lic-grid">
          ${licences.map(x=>{
            const isSel = x.id===current;
            const label = isSel ? 'Selected ✓' : `Select ${x.name}`;
            return `
            <div class="lic-card ${isSel?'active':''}" data-lic="${x.id}">
              <div class="lic-badge">${x.badge}</div>
              <div class="lic-name">${x.name}</div>
              <div class="lic-price">${x.price===0?'FREE':'$'+x.price.toFixed(2)}</div>
              <div class="lic-list">${x.features.map(f=>`<div class="ok">✓ ${esc(f)}</div>`).join('')}${x.not.map(f=>`<div class="no">✕ ${esc(f)}</div>`).join('')}</div>
              <button class="lic-select" data-add="${x.id}">${label}</button>
            </div>`}).join('')}
        </div>
        <div class="lic-foot">
          <button class="lic-btn ghost" id="backSingle">← Back</button>
          <button class="lic-btn red" id="confirmAll">Checkout • $${priceFor(beat,current).toFixed(2)}</button>
        </div>`;

      body.querySelectorAll("[data-lic]").forEach(c=>{
        c.onclick=()=>{ current=c.dataset.lic; render(); };
      });
      body.querySelectorAll("[data-add]").forEach(b=>{
        b.onclick=(e)=>{
          e.stopPropagation();
          const lic=b.dataset.add;
          current=lic;
          render();
        };
      });

      document.getElementById("backSingle").onclick=()=>{ viewAll=false; render(); };
      document.getElementById("confirmAll").onclick=()=>{
        if(isCartContext){ addToCartAndStay(current); overlay.remove(); }
        else { checkoutNow(current); }
      };
    }
  }

  render();
  overlay.onclick=e=>{ if(e.target.id==="licOverlay") overlay.remove(); };
  document.getElementById("licClose").onclick=()=> overlay.remove();
}

// EXPORTS FOR FOOTER LINKS
export { licenceData, priceFor, getBasic };
export const LICENSES = licenceData({price:29.99, title:'Default'});

export function renderLicence(beat = {title:'Dope Tone Beat', price:29.99, genre:'Trap', bpm:140}){
  const licences = licenceData(beat);
  return `
<div class="wrap">
  <div class="topbar">
    <a href="#/home" data-link class="logo-link">
      <img src="/images/logo.png" alt="logo" onerror="this.style.display='none'">
      <span>DOPE TONE</span>
    </a>
    <a href="#/help" data-link class="back-btn">← Back to Help</a>
  </div>

  <div class="hero" id="licenseHero">
    <small>VAULT • LICENSE</small>
    <h1>License Info</h1>
    <p>Basic is true price • Pro x2.2 • Exclusive x10 • Auto-synced with checkout. Pro standard like BeatStars adapted for Vault.</p>
    <div style="margin-top:16px;display:flex;gap:8px;flex-wrap:wrap">
      <a href="#/beats" data-link style="padding:10px 18px;background:#FF1E3C;color:#fff;border-radius:100px;text-decoration:none;font-size:13px;font-weight:700">Explore Beats</a>
      <a href="#/cart" data-link style="padding:10px 18px;background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.1);color:#fff;border-radius:100px;text-decoration:none;font-size:13px">View Cart</a>
    </div>
  </div>

  <div class="panel" id="licenseSection">
    <h2>License Comparison — Dope Tone Vault (Pro Standard)</h2>
    <p class="muted">Basic $${licences[1].price} • Pro $${licences[2].price} • Exclusive $${licences[3].price}</p>
    <table>
      <thead><tr><th>FEATURE</th>${licences.map(l=>`<th>${l.name}<br><small>${l.price===0?'FREE':'$'+l.price}</small></th>`).join('')}</tr></thead>
      <tbody>
        <tr><td>Files</td><td>MP3 Tagged</td><td>MP3 Untagged</td><td>MP3 + WAV</td><td>MP3 + WAV + STEMS</td></tr>
        <tr><td>Streams</td><td>0</td><td>5,000</td><td>100,000</td><td>Unlimited</td></tr>
        <tr><td>Videos</td><td>Non-profit</td><td>1 monetized</td><td>Unlimited</td><td>Unlimited</td></tr>
        <tr><td>Radio</td><td>No</td><td>No</td><td>1 station</td><td>Unlimited</td></tr>
        <tr><td>Monetization</td><td>No</td><td>Yes limited</td><td>YouTube/Spotify OK</td><td>100% you</td></tr>
        <tr><td>Rights</td><td>Practice + Credit</td><td>Non-exclusive lease</td><td>10 years</td><td>Full ownership - Beat removed</td></tr>
        <tr><td>Credit</td><td>Required</td><td>Prod. by Dope Tone</td><td>Prod. by Dope Tone</td><td>Optional</td></tr>
      </tbody>
    </table>

    <div style="margin-top:20px;display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:12px">
      ${licences.map(l=>`
        <div style="padding:14px;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.08);border-radius:12px">
          <div style="font-size:10px;letter-spacing:.12em;color:#00FFC6">${l.badge}</div>
          <div style="font-weight:800;margin:4px 0">${l.name} - ${l.price===0?'FREE':'$'+l.price}</div>
          <div style="font-size:11px;opacity:.8;line-height:1.5">${l.features.map(f=>`✓ ${esc(f)}`).join('<br>')}<br>${l.not.map(f=>`✕ ${esc(f)}`).join('<br>')}</div>
        </div>
      `).join('')}
    </div>

    <div style="margin-top:24px;padding:16px;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.06);border-radius:12px">
      <h3 style="font-size:14px;margin-bottom:8px">What You CANNOT Do</h3>
      <p class="muted" style="font-size:12px;line-height:1.6">No resale of beat as-is, no re-licensing, no sharing STEMS/WAV files. Free beats cannot be used commercially. Chargebacks = license revoked automatically. All licenses bound to one artist / one project, non-transferable.</p>
    </div>
  </div>
</div>
`;
}

export async function initLicence(){
  window.scrollTo(0,0);
}

export const renderLicense = renderLicence;
export const initLicense = initLicence;
export const render = renderLicence;
export const init = initLicence;

window.openLicencePopup = openLicencePopup;
window.openLicensePopup = openLicencePopup;
export default { openLicencePopup, renderLicence, initLicence, renderLicense, initLicense, render, init, licenceData, priceFor };

