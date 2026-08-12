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

function licenceData(beat){
  const b=priceFor(beat,'basic'), pro=priceFor(beat,'pro'), exc=priceFor(beat,'exclusive');
  return [
    {id:"free", name:"FREE", price:0, badge:"Free Tagged", features:["MP3 Tagged","Non-profit use only","Must credit DopeTone","No streaming monetization","1 Music Video non-profit"], not:["WAV","Stems","Untagged"]},
    {id:"basic", name:"BASIC", price:b, badge:"Most Popular Starter", features:["MP3 Untagged",`Distribute up to 5k streams`,`1 Music Video monetized`,`Radio: No`,`Must credit DopeTone`], not:["WAV","Stems"]},
    {id:"pro", name:"PRO", price:pro, badge:"Best Value", features:["MP3 + WAV Untagged","Distribute up to 100k streams","Unlimited Music Videos","YouTube monetization OK","Radio: 1 station","Trackout on request"], not:["Stems"]},
    {id:"exclusive", name:"EXCLUSIVE", price:exc, badge:"Full Ownership", features:["MP3 + WAV + STEMS","Unlimited Distribution","Unlimited Videos & Radio","Full Ownership - Beat removed","Exclusive Rights Contract","No credit required"], not:[]},
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

  function render(){
    const l = licences.find(x=>x.id===current);
    if(!viewAll){
      modal.classList.remove("wide");
      document.getElementById("licTitle").textContent=`${l.name} Licence - ${beat.title||'Beat'}`;
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
              <button class="lic-btn red" id="useBtn">Use ${l.name} • ${l.price===0?'FREE':'$'+l.price.toFixed(2)}</button>
            </div>
          </div>
          <div class="lic-foot"><span>Secure • Instant • Contract included</span><span>${beat.genre||''} • ${beat.bpm||''} BPM</span></div>
        </div>`;
      document.getElementById("viewAllBtn").onclick=()=>{ viewAll=true; render(); };
      document.getElementById("useBtn").onclick=()=> confirm();
    } else {
      modal.classList.add("wide");
      document.getElementById("licTitle").textContent=`Choose Licence - ${beat.title||'Beat'}`;
      body.innerHTML=`
        <div class="lic-grid">
          ${licences.map(x=>`
            <div class="lic-card ${x.id===current?'active':''}" data-lic="${x.id}">
              <div class="lic-badge">${x.badge}</div>
              <div class="lic-name">${x.name}</div>
              <div class="lic-price">${x.price===0?'FREE':'$'+x.price.toFixed(2)}</div>
              <div class="lic-list">${x.features.map(f=>`<div class="ok">✓ ${esc(f)}</div>`).join('')}${x.not.map(f=>`<div class="no">✕ ${esc(f)}</div>`).join('')}</div>
              <button class="lic-select">${x.id===current?'Selected':'Select '+x.name}</button>
            </div>`).join('')}
        </div>
        <div class="lic-foot">
          <button class="lic-btn ghost" id="backSingle">← Back to ${current.toUpperCase()}</button>
          <button class="lic-btn red" id="confirmAll">Continue • $${priceFor(beat,current).toFixed(2)}</button>
        </div>`;
      body.querySelectorAll("[data-lic]").forEach(c=>{
        c.onclick=()=>{ current=c.dataset.lic; render(); };
      });
      document.getElementById("backSingle").onclick=()=>{ viewAll=false; render(); };
      document.getElementById("confirmAll").onclick=()=> confirm();
    }
  }

  function confirm(){
    const p=priceFor(beat,current);
    if(onSelect) onSelect(current,p);
    const cart=JSON.parse(localStorage.getItem("dopetone_cart")||"[]");
    const idx=cart.findIndex(b=>String(b.id)===String(beat.id));
    if(idx>=0){ cart[idx].selected_licence=current; cart[idx].price=p; localStorage.setItem("dopetone_cart",JSON.stringify(cart)); window.dispatchEvent(new CustomEvent("cc_cart_updated",{detail:{count:cart.length}})); }
    overlay.remove();
  }

  render();
  overlay.onclick=e=>{ if(e.target.id==="licOverlay") overlay.remove(); };
  document.getElementById("licClose").onclick=()=> overlay.remove();
}

export function renderLicence(){ return `<div id="licMount"></div>`; }
export async function initLicence(){}
window.openLicencePopup=openLicencePopup;
