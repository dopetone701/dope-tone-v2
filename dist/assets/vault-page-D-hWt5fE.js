import{c as O,a as A}from"./menu-armburger-_TdSpV46.js";import{s as D}from"./index-TnrgF3pn.js";const C="https://dopetone-stats.dopetone701.workers.dev",u=(r,g)=>{r&&fetch(`${C}/api/stats/event`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({beatId:parseInt(r),eventType:g}),keepalive:!0}).catch(()=>{})};function P(r){const g=localStorage.getItem("dopetone_likes");let a;try{a=JSON.parse(g||"{}")}catch{a={}}const p=String(r);if(Array.isArray(a)){let o=a.map(String);const v=o.includes(p);return o=v?o.filter(b=>b!==p):[...o,p],localStorage.setItem("dopetone_likes",JSON.stringify(o)),v||u(r,"like"),!v}else{const o=a&&typeof a=="object"?a:{};return o[p]?(delete o[p],localStorage.setItem("dopetone_likes",JSON.stringify(o)),!1):(o[p]=Date.now(),localStorage.setItem("dopetone_likes",JSON.stringify(o)),u(r,"like"),!0)}}function N(){return`
    <div id="vaultMount"></div>
    <link rel="stylesheet" href="/src/pages/vault-page.css" />
  `}async function T(){var y,S,k,w,E,_;const r=document.getElementById("vaultMount");if(!r)return;if(!document.getElementById("vault-dna-css")){const e=document.createElement("link");e.id="vault-dna-css",e.rel="stylesheet",e.href="/src/pages/vault-page.css",document.head.appendChild(e)}if(!document.getElementById("vault-menu-fix")){const e=document.createElement("style");e.id="vault-menu-fix",e.textContent=`
   .yt-music-grid,.vault-section,.yt-track { overflow: visible!important; }
   .yt-track { position: relative; z-index: 1; }
   .yt-track:has(.pyramid-menu.active) { z-index: 9999!important; }
   .dt-dots-wrap,.pyramid-dots-wrap { overflow: visible!important; position: relative; }
   .pyramid-menu.dt-row-menu { position: fixed!important; z-index: 99999!important; }
    `,document.head.appendChild(e)}const g=new URL("/images",import.meta.url).href,a=e=>`${g}/${e}`;function p(){var t,i,n;const e=window.__BEATS__||((t=window.DTStore)==null?void 0:t.beats)||((n=(i=D)==null?void 0:i.getBeats)==null?void 0:n.call(i))||[];return e!=null&&e.length?[...e].map(s=>({...s,cover:s.cover_url||s.cover||s.image||a("studio.jpg"),title:s.title||s.name||"Untitled"})):[]}let o=p();if(!o.length){r.innerHTML='<div style="padding:40px;text-align:center;color:#888">Loading real arsenal...</div>';let e=0;const t=setInterval(()=>{o=p(),(o.length||e>20)&&(clearInterval(t),o.length&&T()),e++},300);return}const v=[...o].sort((e,t)=>{const i=e.created_at?new Date(e.created_at).getTime():0;return(t.created_at?new Date(t.created_at).getTime():0)-i||t.id-e.id}).slice(0,20),b=Array.from({length:12},(e,t)=>({id:t+1,name:`${["Kick","808","Vocal Chop","Loop","One-Shot","Hihat"][t%6]} #${t+1}`,price:[1,2,3,4][t%4],type:["One-Shot","Loop"][t%2]}));r.innerHTML=`
    <div class="vault-root">
      <div class="vault-header"><h1 class="vault-title-only">VAULT</h1></div>
      <div class="vault-tabs">
        <div class="vault-tab active" data-tab="beats" id="tabBeats">
          <div class="tab-bg-stack"><div class="tab-bg-card card-3"></div><div class="tab-bg-card card-2"></div><div class="tab-bg-card card-1"><img src="${a("studio.jpg")}" onerror="this.onerror=null;this.src='${a("vault-image.png")}'" alt="Beats" /></div></div>
          <div class="tab-content"><div class="tab-title">BEATS</div><div class="tab-sub">Arsenal • ${o.length}</div></div>
        </div>
        <div class="vault-tab" data-tab="packs" id="tabPacks">
          <div class="tab-bg-stack"><div class="tab-bg-card card-3"></div><div class="tab-bg-card card-2"></div><div class="tab-bg-card card-1"><img src="${a("blackout.png")}" onerror="this.onerror=null;this.src='${a("metal.jpg")}'" alt="Packs" /><span class="tab-lock">🔒</span></div></div>
          <div class="tab-content"><div class="tab-title">PACKS</div><div class="tab-sub">Blackout • Void</div></div>
        </div>
        <div class="vault-tab" data-tab="samples" id="tabSamples">
          <div class="tab-bg-stack"><div class="tab-bg-card card-3"></div><div class="tab-bg-card card-2"></div><div class="tab-bg-card card-1"><img src="${a("beats-wav-bg.png")}" onerror="this.onerror=null;this.src='${a("metal.jpg")}'" alt="Samples" /><span class="tab-lock">🔒</span></div></div>
          <div class="tab-content"><div class="tab-title">SAMPLES</div><div class="tab-sub">$1-$4 Express</div></div>
        </div>
        <div class="vault-tab" data-tab="free" id="tabFree">
          <div class="tab-bg-stack"><div class="tab-bg-card card-3"></div><div class="tab-bg-card card-2"></div><div class="tab-bg-card card-1"><img src="${a("vault-image.png")}" onerror="this.onerror=null;this.src='${a("studio.jpg")}'" alt="Free Tools" /></div></div>
          <div class="tab-content"><div class="tab-title">FREE TOOLS</div><div class="tab-sub">Free beats • Art</div></div>
        </div>
      </div>

      <div class="vault-section" id="beatsSection">
        <div class="section-head"><h2>Continue Listening • Beats</h2><button class="view-all-btn" id="viewAllBeats">View All Arsenal →</button></div>
        <div class="yt-music-grid">
          ${v.map(e=>`
            <div class="yt-track" data-beat-id="${e.id??""}">
              <img src="${e.cover||e.cover_url||a("studio.jpg")}" onerror="this.onerror=null;this.src='${a("studio.jpg")}'" alt="${e.title||"Beat"}" loading="lazy" />
              <div class="yt-meta">
                <div class="yt-title">"${e.title||"Untitled"}"${e.bpm?` • BPM ${e.bpm}`:""}</div>
                <div class="yt-artist">${e.artist||e.producer||"DOPE TONE"}</div>
              </div>
              <div class="yt-menu">⋮</div>
            </div>
          `).join("")}
        </div>
      </div>

      <div class="vault-section" id="packsSection" style="display:none">
        <div class="section-head"><h2>Packs • Preview</h2><span class="coming-badge">COMING SOON 🔥</span></div>
        <div class="packs-preview-grid">
          <div class="pack-preview-card"><img src="${a("blackout.png")}" onerror="this.onerror=null;this.src='${a("metal.jpg")}'" alt="Blackout Series" loading="lazy" /><div class="pack-overlay"><div class="pack-lock">BLACKOUT SERIES<br><small>3 Packs • Ambient Pop / Cinematic / Trap</small><br><span>LOCKED</span></div></div><div class="pack-info"><div class="pack-title">BLACKOUT SERIES</div><div class="pack-sub">DT-001 • DT-002 • DT-003</div></div></div>
          <div class="pack-preview-card"><img src="${a("void.webp")}" onerror="this.onerror=null;this.src='${a("blackhole.webp")}'" alt="Void Series" loading="lazy" /><div class="pack-overlay"><div class="pack-lock">VOID SERIES<br><small>Same art • New name</small><br><span>LOCKED</span></div></div><div class="pack-info"><div class="pack-title">VOID SERIES</div><div class="pack-sub">VOID EDITION</div></div></div>
          <div class="pack-preview-card"><img src="${a("blackhole.webp")}" onerror="this.onerror=null;this.src='${a("studio.jpg")}'" alt="Black Hole" loading="lazy" /><div class="pack-overlay"><div class="pack-lock">BLACK HOLE<br><small>DARK DRILL • DT-004</small><br><span>NEW</span></div></div><div class="pack-info"><div class="pack-title">BLACK HOLE • DARK DRILL</div><div class="pack-sub">DT-004</div></div></div>
        </div>
      </div>

      <div class="vault-section" id="samplesSection" style="display:none">
        <div class="section-head"><h2>Samples • $1-$4 Express</h2><span class="coming-badge">FADED • LOCKED</span></div>
        <div class="samples-grid">
          ${b.map(e=>`
            <div class="sample-card is-locked">
              <img src="${a("beats-wav-bg.png")}" onerror="this.onerror=null;this.src='${a("metal.jpg")}'" alt="${e.name}" loading="lazy" />
              <div class="sample-body"><div class="sample-title">${e.name}</div><div class="sample-sub">$${e.price} • ${e.type}</div></div>
              <div class="sample-lock">COMING SOON<br><small>$${e.price}</small></div>
            </div>
          `).join("")}
        </div>
      </div>

      <div class="vault-section" id="freeSection" style="display:none">
        <div class="section-head"><h2>Free Tools</h2></div>
        <div class="free-tools-list">
          <div class="free-tool is-open"><div class="free-tool-info"><span>Free Beats</span><br><small>Open catalog • 20+ free</small></div><button class="free-tool-action action-open" id="openFreeBeats">Open →</button></div>
          <div class="free-tool is-locked"><div class="free-tool-info"><span>Free Samples</span><br><small>One-shots & loops</small></div><button class="free-tool-action action-soon">Soon</button></div>
          <div class="free-tool is-locked"><div class="free-tool-info"><span>Cover Art</span><br><small>Free generator</small></div><button class="free-tool-action action-soon">Soon</button></div>
          <div class="free-tool is-locked"><div class="free-tool-info"><span>Infographics</span><br><small>Promo kits</small></div><button class="free-tool-action action-soon">Soon</button></div>
        </div>
      </div>
    </div>
  `;function h(){const e=(location.hash||"").toLowerCase();return e.includes("tab=samples")?"samples":e.includes("tab=packs")?"packs":e.includes("tab=free")||e.includes("free-tools")?"free":"beats"}function m(e){document.querySelectorAll(".vault-tab").forEach(s=>s.classList.remove("active"));const i=document.querySelector(`[data-tab="${e}"]`);i&&i.classList.add("active");const n={beats:document.getElementById("beatsSection"),packs:document.getElementById("packsSection"),samples:document.getElementById("samplesSection"),free:document.getElementById("freeSection")};Object.keys(n).forEach(s=>{n[s]&&(n[s].style.display=s===e?"block":"none")})}(y=document.getElementById("tabBeats"))==null||y.addEventListener("click",()=>{m("beats"),location.hash!=="#/vault?tab=beats"&&(location.hash="#/vault?tab=beats")}),(S=document.getElementById("tabPacks"))==null||S.addEventListener("click",()=>{m("packs"),location.hash="#/vault?tab=packs"}),(k=document.getElementById("tabSamples"))==null||k.addEventListener("click",()=>{m("samples"),location.hash="#/vault?tab=samples"}),(w=document.getElementById("tabFree"))==null||w.addEventListener("click",()=>{m("free"),location.hash="#/vault?tab=free"}),(E=document.getElementById("viewAllBeats"))==null||E.addEventListener("click",()=>{location.hash="#/beats"}),(_=document.getElementById("openFreeBeats"))==null||_.addEventListener("click",()=>{location.hash="#/beats"});const $=h();m($),setTimeout(()=>m(h()),100),window._vaultHashListener||(window._vaultHashListener=!0,window.addEventListener("hashchange",()=>{var n;const e=(location.hash||"").toLowerCase();if(!e.includes("vault"))return;let t="beats";e.includes("tab=samples")?t="samples":e.includes("tab=packs")?t="packs":e.includes("tab=free")&&(t="free");const i={beats:document.getElementById("beatsSection"),packs:document.getElementById("packsSection"),samples:document.getElementById("samplesSection"),free:document.getElementById("freeSection")};i.beats&&(document.querySelectorAll(".vault-tab").forEach(s=>s.classList.remove("active")),(n=document.querySelector(`[data-tab="${t}"]`))==null||n.classList.add("active"),Object.keys(i).forEach(s=>{i[s]&&(i[s].style.display=s===t?"block":"none")}))}));function f(e){e!=null&&e.id&&(A(),location.hash=`#/beat?id=${encodeURIComponent(e.id)}`)}function B(e,t){var i,n;if(window.__CURRENT_BEAT__=e,window.__CURRENT_LIST__="vault",window.__CURRENT_INDEX__=t,window.__CURRENT_BEATS__=v,localStorage.setItem("dt_list_v2","vault"),localStorage.setItem("dt_index_v2",String(t)),localStorage.setItem("dt_queue_v2",JSON.stringify(v)),u(e.id,"play"),(i=window.DTPlayer)!=null&&i.setQueue)window.DTPlayer.setQueue(v,t,!0);else if((n=window.globalPlayer)!=null&&n.play)window.globalPlayer.play(t,v,"vault");else if(window.DTPlayTrack)window.DTPlayTrack(e,!0);else{const s=document.querySelector("audio")||window.__DT_AUDIO__;s&&(s.src=e.mp3_url||e.audio_url,s.play().catch(()=>{}))}}document.querySelectorAll(".yt-track").forEach((e,t)=>{const i=v[t];if(!i)return;e.addEventListener("click",()=>{B(i,t)}),e.addEventListener("dblclick",s=>{s.preventDefault(),s.stopPropagation(),f(i)});const n=e.querySelector(".yt-menu");if(n){const I=O(i,{goto:l=>{f(l)},playlist:l=>{try{const c=JSON.parse(localStorage.getItem("dopetone_playlists")||"[]");let d=c.find(L=>L.name==="My Playlist");d||(d={id:Date.now(),name:"My Playlist",beats:[]},c.push(d)),d.beats.includes(String(l.id))||d.beats.push(String(l.id)),localStorage.setItem("dopetone_playlists",JSON.stringify(c))}catch{}},like:l=>{P(l.id)},share:l=>{var d;const c=`${location.origin}/#/beat?id=${encodeURIComponent(l.id)}`;(d=navigator.clipboard)==null||d.writeText(c),u(l.id,"share")},download:l=>{u(l.id,"download")},cart:l=>{let c=JSON.parse(localStorage.getItem("dopetone_cart")||"[]");c.some(d=>String(d.id)===String(l.id))||(c.push(l),localStorage.setItem("dopetone_cart",JSON.stringify(c)),window.dispatchEvent(new CustomEvent("cc_cart_updated",{detail:{count:c.length}})),u(l.id,"cart"))},buy:l=>{let c=JSON.parse(localStorage.getItem("dopetone_cart")||"[]");c.some(d=>String(d.id)===String(l.id))||(c.push(l),localStorage.setItem("dopetone_cart",JSON.stringify(c)),u(l.id,"cart")),location.hash=`#/licence?id=${encodeURIComponent(l.id)}`}});n.replaceWith(I),I.addEventListener("click",l=>l.stopPropagation())}}),window._vaultSearchBound||(window._vaultSearchBound=!0,window.addEventListener("search:query",e=>{const t=e.detail,i=(typeof t=="string"?t:(t==null?void 0:t.query)||(t==null?void 0:t.raw)||"").toLowerCase().trim();i.length>0&&location.hash.includes("vault")&&(location.hash="#/beats",localStorage.setItem("dt_last_search",typeof t=="string"?t:(t==null?void 0:t.raw)||i))})),document.documentElement.style.overflowX="hidden",document.body.style.overflowX="hidden"}const M={renderVaultPage:N,initVaultPage:T};export{M as default,T as initVaultPage,N as renderVaultPage};
