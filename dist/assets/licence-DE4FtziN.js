const p=e=>String(e??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#039;"),h=e=>{let d=Number(e);return Number.isFinite(d)?(d>=1e3&&(d/=100),Number(d.toFixed(2))):29.99},P=e=>h((e==null?void 0:e.price)??(e==null?void 0:e.base_price)??29.99),u=(e,d)=>{const n=P(e);return d==="free"?0:d==="basic"?n:d==="pro"?h(n*2.2):d==="exclusive"?h(Math.max(n*10,149)):n},B="https://dopetone-stats.dopetone701.workers.dev",M=(e,d)=>{e&&fetch(`${B}/api/stats/event`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({beatId:parseInt(e),eventType:d}),keepalive:!0}).catch(()=>{})};function g(e){const d=u(e,"basic"),n=u(e,"pro"),a=u(e,"exclusive");return[{id:"free",name:"FREE",price:0,badge:"FREE TAGGED",features:["MP3 Tagged","Non-profit use only","Must credit DopeTone","No streaming monetization","1 Music Video non-profit"],not:["WAV","Stems","Untagged"]},{id:"basic",name:"BASIC",price:d,badge:"MOST POPULAR STARTER",features:["MP3 Untagged","Distribute up to 5k streams","1 Music Video monetized","Radio: No","Must credit DopeTone"],not:["WAV","Stems"]},{id:"pro",name:"PRO",price:n,badge:"BEST VALUE",features:["MP3 + WAV Untagged","Distribute up to 100k streams","Unlimited Music Videos","YouTube monetization OK","Radio: 1 station","Trackout on request"],not:["Stems"]},{id:"exclusive",name:"EXCLUSIVE",price:a,badge:"FULL OWNERSHIP",features:["MP3 + WAV + STEMS","Unlimited Distribution","Unlimited Videos & Radio","Full Ownership - Beat removed","Exclusive Rights Contract","No credit required"],not:[]}]}function E(e,d="basic",n=null){var w;(w=document.getElementById("licOverlay"))==null||w.remove();const a=g(e);let c=d,f=!1;const S=document.createElement("div");S.innerHTML=`
    <div class="lic-overlay" id="licOverlay">
      <div class="lic-modal" id="licModal">
        <div class="lic-top">
          <div><h2 id="licTitle"></h2><p>Basic is true price • Pro x2.2 • Exclusive x10 • Auto-synced</p></div>
          <button class="lic-close" id="licClose">✕</button>
        </div>
        <div id="licBody"></div>
      </div>
    </div>`,document.body.appendChild(S.firstElementChild);const l=document.getElementById("licOverlay"),T=document.getElementById("licModal"),v=document.getElementById("licBody"),y=typeof n=="function";function b(i){const t=u(e,i);let o;try{o=JSON.parse(localStorage.getItem("dopetone_cart")||"[]")}catch{o=[]}const r=o.findIndex(C=>String(C.id)===String(e.id));r>=0?(o[r].selected_licence=i,o[r].price=t,o[r].licence=i):(o.push({...e,selected_licence:i,licence:i,price:t,added_at:Date.now()}),M(e.id,"cart")),localStorage.setItem("dopetone_cart",JSON.stringify(o));let s={};try{s=JSON.parse(localStorage.getItem("dopetone_licences")||"{}")}catch{}return s[e.id]={name:i.toUpperCase(),price:t},s[String(e.id)]={name:i.toUpperCase(),price:t},localStorage.setItem("dopetone_licences",JSON.stringify(s)),window.dispatchEvent(new CustomEvent("cc_cart_updated",{detail:{count:o.length}})),n&&n(i,t),t}function k(i){b(i),l.remove(),setTimeout(()=>{window.DT_openCartPaypalModal?window.DT_openCartPaypalModal():window.createPaypalCheckout?window.createPaypalCheckout():(location.hash="#/cart",setTimeout(()=>{var t,o;return((t=window.DT_openCartPaypalModal)==null?void 0:t.call(window))||((o=document.getElementById("goCheck"))==null?void 0:o.click())},800))},150)}function m(){const i=a.find(t=>t.id===c);if(f)T.classList.add("wide"),document.getElementById("licTitle").textContent=`Choose Licence - ${e.title||"My Own"}`,v.innerHTML=`
        <div class="lic-grid">
          ${a.map(t=>{const o=t.id===c,r=o?"Selected ✓":`Select ${t.name}`;return`
            <div class="lic-card ${o?"active":""}" data-lic="${t.id}">
              <div class="lic-badge">${t.badge}</div>
              <div class="lic-name">${t.name}</div>
              <div class="lic-price">${t.price===0?"FREE":"$"+t.price.toFixed(2)}</div>
              <div class="lic-list">${t.features.map(s=>`<div class="ok">✓ ${p(s)}</div>`).join("")}${t.not.map(s=>`<div class="no">✕ ${p(s)}</div>`).join("")}</div>
              <button class="lic-select" data-add="${t.id}">${r}</button>
            </div>`}).join("")}
        </div>
        <div class="lic-foot">
          <button class="lic-btn ghost" id="backSingle">← Back</button>
          <button class="lic-btn red" id="confirmAll">Checkout • $${u(e,c).toFixed(2)}</button>
        </div>`,v.querySelectorAll("[data-lic]").forEach(t=>{t.onclick=()=>{c=t.dataset.lic,m()}}),v.querySelectorAll("[data-add]").forEach(t=>{t.onclick=o=>{o.stopPropagation(),c=t.dataset.add,m()}}),document.getElementById("backSingle").onclick=()=>{f=!1,m()},document.getElementById("confirmAll").onclick=()=>{y?(b(c),l.remove()):k(c)};else{T.classList.remove("wide"),document.getElementById("licTitle").textContent=`Choose Licence - ${e.title||"My Own"}`;const t=y?`Use ${i.name} • ${i.price===0?"FREE":"$"+i.price.toFixed(2)}`:`Checkout • ${i.price===0?"FREE":"$"+i.price.toFixed(2)}`;v.innerHTML=`
        <div class="lic-single">
          <div class="lic-card active">
            <div class="lic-badge">${i.badge}</div>
            <div class="lic-name">${i.name}</div>
            <div class="lic-price">${i.price===0?"FREE":"$"+i.price.toFixed(2)}</div>
            <div class="lic-list">
              ${i.features.map(o=>`<div class="ok">✓ ${p(o)}</div>`).join("")}
              ${i.not.map(o=>`<div class="no">✕ ${p(o)}</div>`).join("")}
            </div>
            <div class="lic-actions">
              <button class="lic-btn ghost" id="viewAllBtn">View All Licences</button>
              <button class="lic-btn red" id="useBtn">${t}</button>
            </div>
          </div>
          <div class="lic-foot"><span>Secure • Instant • Contract included</span><span>${e.genre||""} • ${e.bpm||""} BPM</span></div>
        </div>`,document.getElementById("viewAllBtn").onclick=()=>{f=!0,m()},document.getElementById("useBtn").onclick=()=>{y?(b(c),l.remove()):k(c)}}}m(),l.onclick=i=>{i.target.id==="licOverlay"&&l.remove()},document.getElementById("licClose").onclick=()=>l.remove()}const N=g({price:29.99});function $(e={title:"Dope Tone Beat",price:29.99,genre:"Trap",bpm:140}){const d=g(e);return`
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
    <p class="muted">Basic $${d[1].price} • Pro $${d[2].price} • Exclusive $${d[3].price}</p>
    <table>
      <thead><tr><th>FEATURE</th>${d.map(n=>`<th>${n.name}<br><small>${n.price===0?"FREE":"$"+n.price}</small></th>`).join("")}</tr></thead>
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
      ${d.map(n=>`
        <div style="padding:14px;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.08);border-radius:12px">
          <div style="font-size:10px;letter-spacing:.12em;color:#00FFC6">${n.badge}</div>
          <div style="font-weight:800;margin:4px 0">${n.name} - ${n.price===0?"FREE":"$"+n.price}</div>
          <div style="font-size:11px;opacity:.8;line-height:1.5">${n.features.map(a=>`✓ ${p(a)}`).join("<br>")}<br>${n.not.map(a=>`✕ ${p(a)}`).join("<br>")}</div>
        </div>
      `).join("")}
    </div>

    <div style="margin-top:24px;padding:16px;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.06);border-radius:12px">
      <h3 style="font-size:14px;margin-bottom:8px">What You CANNOT Do</h3>
      <p class="muted" style="font-size:12px;line-height:1.6">No resale of beat as-is, no re-licensing, no sharing STEMS/WAV files. Free beats cannot be used commercially. Chargebacks = license revoked automatically. All licenses bound to one artist / one project, non-transferable.</p>
    </div>
  </div>
</div>
`}async function x(){window.scrollTo(0,0)}const A=$,I=x,F=$,L=x;window.openLicencePopup=E;window.openLicensePopup=E;const O={openLicencePopup:E,renderLicence:$,initLicence:x,renderLicense:A,initLicense:I,render:F,init:L,licenceData:g,priceFor:u};export{N as LICENSES,O as default,P as getBasic,L as init,x as initLicence,I as initLicense,g as licenceData,E as openLicencePopup,u as priceFor,F as render,$ as renderLicence,A as renderLicense};
