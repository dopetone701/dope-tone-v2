// ============================================================
// DOPE TONE VAULT — RESPONSIVE GALLERY V3 - FIXED + D1
// ============================================================
import { createDotsMenu, closeAllMenus } from "../core/menu-armburger.js";
import { store } from "../core/store.js";

const STATS_API="https://dopetone-stats.dopetone701.workers.dev";
const trackEvent=(id,type)=>{if(!id)return;fetch(`${STATS_API}/api/stats/event`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({beatId:parseInt(id),eventType:type}),keepalive:true}).catch(()=>{})};

function getLikesSafe(){
  try{
    const raw=localStorage.getItem("dopetone_likes");
    if(!raw) return [];
    const d=JSON.parse(raw);
    if(Array.isArray(d)) return d.map(String);
    if(d && typeof d==='object') return Object.keys(d).map(String);
    return [];
  }catch{return [];}
}
function toggleLikeSafe(id){
  const raw=localStorage.getItem("dopetone_likes");
  let data;
  try{ data=JSON.parse(raw||"{}"); }catch{ data={}; }
  const sid=String(id);
  if(Array.isArray(data)){
    let arr=data.map(String);
    const has=arr.includes(sid);
    arr=has?arr.filter(x=>x!==sid):[...arr,sid];
    localStorage.setItem("dopetone_likes",JSON.stringify(arr));
    if(!has) trackEvent(id,"like");
    return!has;
  } else {
    const obj = (data && typeof data==='object')? data : {};
    if(obj[sid]){ delete obj[sid]; localStorage.setItem("dopetone_likes",JSON.stringify(obj)); return false; }
    else { obj[sid]=Date.now(); localStorage.setItem("dopetone_likes",JSON.stringify(obj)); trackEvent(id,"like"); return true; }
  }
}

export function renderVaultPage(){
  return `
    <div id="vaultMount"></div>
    <link rel="stylesheet" href="/src/pages/vault-page.css" />
  `;
}

export async function initVaultPage(){

  const mount = document.getElementById("vaultMount");
  if(!mount) return;

  if(!document.getElementById("vault-dna-css")){
    const link = document.createElement("link");
    link.id = "vault-dna-css";
    link.rel = "stylesheet";
    link.href = "/src/pages/vault-page.css";
    document.head.appendChild(link);
  }

  if(!document.getElementById("vault-menu-fix")){
    const s=document.createElement("style");
    s.id="vault-menu-fix";
    s.textContent=`
   .yt-music-grid,.vault-section,.yt-track { overflow: visible!important; }
   .yt-track { position: relative; z-index: 1; }
   .yt-track:has(.pyramid-menu.active) { z-index: 9999!important; }
   .dt-dots-wrap,.pyramid-dots-wrap { overflow: visible!important; position: relative; }
   .pyramid-menu.dt-row-menu { position: fixed!important; z-index: 99999!important; }
    `;
    document.head.appendChild(s);
  }

  const IMAGE_BASE = new URL("../../public/images", import.meta.url).href;
  const img = (p) => `${IMAGE_BASE}/${p}`;

  function getRealBeats(){
    const raw = window.__BEATS__ || window.DTStore?.beats || store?.getBeats?.() || [];
    if(!raw?.length) return [];
    return [...raw].map(b=>({...b, cover: b.cover_url||b.cover||b.image||img("studio.jpg"), title: b.title||b.name||"Untitled" }));
  }

  let allBeats = getRealBeats();
  if(!allBeats.length){
    mount.innerHTML=`<div style="padding:40px;text-align:center;color:#888">Loading real arsenal...</div>`;
    let tries=0;
    const iv=setInterval(()=>{
      allBeats=getRealBeats();
      if(allBeats.length||tries>20){ clearInterval(iv); if(allBeats.length) initVaultPage(); }
      tries++;
    },300);
    return;
  }

  const demoBeats = [...allBeats].sort((a,b)=>{
    const da=a.created_at?new Date(a.created_at).getTime():0;
    const db=b.created_at?new Date(b.created_at).getTime():0;
    return (db-da)||b.id-a.id;
  }).slice(0,20);

  const fakeSamples = Array.from({length:12},(_,i)=>({
    id:i+1,
    name:`${["Kick","808","Vocal Chop","Loop","One-Shot","Hihat"][i%6]} #${i+1}`,
    price:[1,2,3,4][i%4],
    type:["One-Shot","Loop"][i%2]
  }));

  mount.innerHTML = `
    <div class="vault-root">
      <div class="vault-header"><h1 class="vault-title-only">VAULT</h1></div>
      <div class="vault-tabs">
        <div class="vault-tab active" data-tab="beats" id="tabBeats">
          <div class="tab-bg-stack"><div class="tab-bg-card card-3"></div><div class="tab-bg-card card-2"></div><div class="tab-bg-card card-1"><img src="${img("studio.jpg")}" onerror="this.onerror=null;this.src='${img("vault-image.png")}'" alt="Beats" /></div></div>
          <div class="tab-content"><div class="tab-title">BEATS</div><div class="tab-sub">Arsenal • ${allBeats.length}</div></div>
        </div>
        <div class="vault-tab" data-tab="packs" id="tabPacks">
          <div class="tab-bg-stack"><div class="tab-bg-card card-3"></div><div class="tab-bg-card card-2"></div><div class="tab-bg-card card-1"><img src="${img("blackout.png")}" onerror="this.onerror=null;this.src='${img("metal.jpg")}'" alt="Packs" /><span class="tab-lock">🔒</span></div></div>
          <div class="tab-content"><div class="tab-title">PACKS</div><div class="tab-sub">Blackout • Void</div></div>
        </div>
        <div class="vault-tab" data-tab="samples" id="tabSamples">
          <div class="tab-bg-stack"><div class="tab-bg-card card-3"></div><div class="tab-bg-card card-2"></div><div class="tab-bg-card card-1"><img src="${img("beats-wav-bg.png")}" onerror="this.onerror=null;this.src='${img("metal.jpg")}'" alt="Samples" /><span class="tab-lock">🔒</span></div></div>
          <div class="tab-content"><div class="tab-title">SAMPLES</div><div class="tab-sub">$1-$4 Express</div></div>
        </div>
        <div class="vault-tab" data-tab="free" id="tabFree">
          <div class="tab-bg-stack"><div class="tab-bg-card card-3"></div><div class="tab-bg-card card-2"></div><div class="tab-bg-card card-1"><img src="${img("vault-image.png")}" onerror="this.onerror=null;this.src='${img("studio.jpg")}'" alt="Free Tools" /></div></div>
          <div class="tab-content"><div class="tab-title">FREE TOOLS</div><div class="tab-sub">Free beats • Art</div></div>
        </div>
      </div>

      <div class="vault-section" id="beatsSection">
        <div class="section-head"><h2>Continue Listening • Beats</h2><button class="view-all-btn" id="viewAllBeats">View All Arsenal →</button></div>
        <div class="yt-music-grid">
          ${demoBeats.map(b=>`
            <div class="yt-track" data-beat-id="${b.id?? ''}">
              <img src="${b.cover || b.cover_url || img("studio.jpg")}" onerror="this.onerror=null;this.src='${img("studio.jpg")}'" alt="${b.title || "Beat"}" loading="lazy" />
              <div class="yt-meta">
                <div class="yt-title">"${b.title || "Untitled"}"${b.bpm? ` • BPM ${b.bpm}` : ""}</div>
                <div class="yt-artist">${b.artist || b.producer || "DOPE TONE"}</div>
              </div>
              <div class="yt-menu">⋮</div>
            </div>
          `).join("")}
        </div>
      </div>

      <div class="vault-section" id="packsSection" style="display:none">
        <div class="section-head"><h2>Packs • Preview</h2><span class="coming-badge">COMING SOON 🔥</span></div>
        <div class="packs-preview-grid">
          <div class="pack-preview-card"><img src="${img("blackout.png")}" onerror="this.onerror=null;this.src='${img("metal.jpg")}'" alt="Blackout Series" loading="lazy" /><div class="pack-overlay"><div class="pack-lock">BLACKOUT SERIES<br><small>3 Packs • Ambient Pop / Cinematic / Trap</small><br><span>LOCKED</span></div></div><div class="pack-info"><div class="pack-title">BLACKOUT SERIES</div><div class="pack-sub">DT-001 • DT-002 • DT-003</div></div></div>
          <div class="pack-preview-card"><img src="${img("void.webp")}" onerror="this.onerror=null;this.src='${img("blackhole.webp")}'" alt="Void Series" loading="lazy" /><div class="pack-overlay"><div class="pack-lock">VOID SERIES<br><small>Same art • New name</small><br><span>LOCKED</span></div></div><div class="pack-info"><div class="pack-title">VOID SERIES</div><div class="pack-sub">VOID EDITION</div></div></div>
          <div class="pack-preview-card"><img src="${img("blackhole.webp")}" onerror="this.onerror=null;this.src='${img("studio.jpg")}'" alt="Black Hole" loading="lazy" /><div class="pack-overlay"><div class="pack-lock">BLACK HOLE<br><small>DARK DRILL • DT-004</small><br><span>NEW</span></div></div><div class="pack-info"><div class="pack-title">BLACK HOLE • DARK DRILL</div><div class="pack-sub">DT-004</div></div></div>
        </div>
      </div>

      <div class="vault-section" id="samplesSection" style="display:none">
        <div class="section-head"><h2>Samples • $1-$4 Express</h2><span class="coming-badge">FADED • LOCKED</span></div>
        <div class="samples-grid">
          ${fakeSamples.map(s=>`
            <div class="sample-card is-locked">
              <img src="${img("beats-wav-bg.png")}" onerror="this.onerror=null;this.src='${img("metal.jpg")}'" alt="${s.name}" loading="lazy" />
              <div class="sample-body"><div class="sample-title">${s.name}</div><div class="sample-sub">$${s.price} • ${s.type}</div></div>
              <div class="sample-lock">COMING SOON<br><small>$${s.price}</small></div>
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
  `;

  function getTabFromHash(){
    const h = (location.hash || "").toLowerCase();
    if(h.includes("tab=samples")) return "samples";
    if(h.includes("tab=packs")) return "packs";
    if(h.includes("tab=free") || h.includes("free-tools")) return "free";
    return "beats";
  }

  function showTab(name){
    const allTabs = document.querySelectorAll(".vault-tab");
    allTabs.forEach(t=>t.classList.remove("active"));
    const targetTab = document.querySelector(`[data-tab="${name}"]`);
    if(targetTab) targetTab.classList.add("active");

    const map = {
      beats: document.getElementById("beatsSection"),
      packs: document.getElementById("packsSection"),
      samples: document.getElementById("samplesSection"),
      free: document.getElementById("freeSection")
    };
    Object.keys(map).forEach(k=>{
      if(map[k]) map[k].style.display = (k===name? "block" : "none");
    });
  }

  document.getElementById("tabBeats")?.addEventListener("click",()=>{ showTab("beats"); if(location.hash!=="#/vault?tab=beats") location.hash="#/vault?tab=beats"; });
  document.getElementById("tabPacks")?.addEventListener("click",()=>{ showTab("packs"); location.hash="#/vault?tab=packs"; });
  document.getElementById("tabSamples")?.addEventListener("click",()=>{ showTab("samples"); location.hash="#/vault?tab=samples"; });
  document.getElementById("tabFree")?.addEventListener("click",()=>{ showTab("free"); location.hash="#/vault?tab=free"; });

  document.getElementById("viewAllBeats")?.addEventListener("click",()=>{ location.hash="#/beats"; });
  document.getElementById("openFreeBeats")?.addEventListener("click",()=>{ location.hash="#/beats"; });

  const initialTab = getTabFromHash();
  showTab(initialTab);
  setTimeout(()=>showTab(getTabFromHash()), 100);

  if(!window._vaultHashListener){
    window._vaultHashListener = true;
    window.addEventListener("hashchange", ()=>{
      const hash = (location.hash || "").toLowerCase();
      if(!hash.includes("vault")) return;
      let t = "beats";
      if(hash.includes("tab=samples")) t="samples";
      else if(hash.includes("tab=packs")) t="packs";
      else if(hash.includes("tab=free")) t="free";

      const secs = {
        beats: document.getElementById("beatsSection"),
        packs: document.getElementById("packsSection"),
        samples: document.getElementById("samplesSection"),
        free: document.getElementById("freeSection")
      };
      if(!secs.beats) return;

      document.querySelectorAll(".vault-tab").forEach(el=>el.classList.remove("active"));
      document.querySelector(`[data-tab="${t}"]`)?.classList.add("active");
      Object.keys(secs).forEach(k=>{ if(secs[k]) secs[k].style.display = k===t? "block" : "none"; });
    });
  }

  function goToBeat(beat){ if(!beat?.id) return; closeAllMenus(); location.hash=`#/beat?id=${encodeURIComponent(beat.id)}`; }
  function playReal(beat, index){
    window.__CURRENT_BEAT__=beat;
    window.__CURRENT_LIST__="vault";
    window.__CURRENT_INDEX__=index;
    window.__CURRENT_BEATS__=demoBeats;
    localStorage.setItem('dt_list_v2','vault');
    localStorage.setItem('dt_index_v2',String(index));
    localStorage.setItem('dt_queue_v2',JSON.stringify(demoBeats));
    trackEvent(beat.id,"play");
    if(window.DTPlayer?.setQueue){ window.DTPlayer.setQueue(demoBeats, index, true); }
    else if(window.globalPlayer?.play){ window.globalPlayer.play(index, demoBeats, "vault"); }
    else if(window.DTPlayTrack){ window.DTPlayTrack(beat, true); }
    else { const audio=document.querySelector("audio")||window.__DT_AUDIO__; if(audio){ audio.src=beat.mp3_url||beat.audio_url; audio.play().catch(()=>{}); } }
  }

  document.querySelectorAll(".yt-track").forEach((element,index)=>{
    const beat = demoBeats[index];
    if(!beat) return;

    element.addEventListener("click",()=>{ playReal(beat, index); });
    element.addEventListener("dblclick",(e)=>{ e.preventDefault(); e.stopPropagation(); goToBeat(beat); });

    const oldMenu = element.querySelector(".yt-menu");
    if(oldMenu){
      const handlers={
        goto:(b)=>{ goToBeat(b); },
        playlist:(b)=>{
          try{
            const pls=JSON.parse(localStorage.getItem("dopetone_playlists")||"[]");
            let my=pls.find(p=>p.name==="My Playlist");
            if(!my){ my={id:Date.now(),name:"My Playlist",beats:[]}; pls.push(my);}
            if(!my.beats.includes(String(b.id))) my.beats.push(String(b.id));
            localStorage.setItem("dopetone_playlists",JSON.stringify(pls));
          }catch{}
        },
        like:(b)=>{ toggleLikeSafe(b.id); },
        share:(b)=>{ const url=`${location.origin}/#/beat?id=${encodeURIComponent(b.id)}`; navigator.clipboard?.writeText(url); trackEvent(b.id,"share"); },
        download:(b)=>{ trackEvent(b.id,"download"); },
        cart:(b)=>{ let cart=JSON.parse(localStorage.getItem("dopetone_cart")||"[]"); if(!cart.some(x=>String(x.id)===String(b.id))){ cart.push(b); localStorage.setItem("dopetone_cart",JSON.stringify(cart)); window.dispatchEvent(new CustomEvent("cc_cart_updated",{detail:{count:cart.length}})); trackEvent(b.id,"cart"); } },
        buy:(b)=>{ let cart=JSON.parse(localStorage.getItem("dopetone_cart")||"[]"); if(!cart.some(x=>String(x.id)===String(b.id))){ cart.push(b); localStorage.setItem("dopetone_cart",JSON.stringify(cart)); trackEvent(b.id,"cart"); } location.hash=`#/licence?id=${encodeURIComponent(b.id)}`; }
      };
      const dots = createDotsMenu(beat, handlers);
      oldMenu.replaceWith(dots);
      dots.addEventListener("click",e=>e.stopPropagation());
    }
  });

  document.documentElement.style.overflowX = "hidden";
  document.body.style.overflowX = "hidden";
}

export default { renderVaultPage, initVaultPage };
