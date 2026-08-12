// ===============================
// ARSENAL V2.8 - HASH ONLY FINAL - GO TO BEAT FIXED - META+BUY RESTORED
// ===============================

const STATS_API = "https://all-beats-analytics-api.dopetone701.workers.dev";

const PLAY_SVG = `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5.14v14l11-7-11-7z"/></svg>`;
const PAUSE_SVG = `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M7 5h4v14H7V5zm6 0h4v14h-4V5z"/></svg>`;
const DOTS_SVG = `<svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><circle cx="12" cy="5" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="12" cy="19" r="2"/></svg>`;
const HEART_PATH = `<path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09 C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5 c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>`;
const HEART_SVG = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">${HEART_PATH}</svg>`;
const HEART_FILL = `<svg viewBox="0 0 24 24" fill="#FF1E3C" stroke="#FF1E3C" stroke-width="1.8">${HEART_PATH}</svg>`;

let waveCache = new Map();
let observer = null;
let activeBeats = [];
let currentFilter = "all";
let currentView = localStorage.getItem("dt_arsenal_view") || "list";

// CORE DATA
const getBeats = () => window.__BEATS__ || window.DTStore?.beats || window.store?.beats || [];
const getLikes = () => { try { return JSON.parse(localStorage.getItem("dopetone_likes") || "[]"); } catch { return []; } };
const saveLikes = likes => localStorage.setItem("dopetone_likes", JSON.stringify(likes));
const isSignedIn = () => !!window.currentUser || !!localStorage.getItem("dopetone_user") || !!localStorage.getItem("sb-access-token");
const getMode = beat => {
  const mode = String(beat.monetization_mode || "").toLowerCase();
  if (["free","hybrid","paid"].includes(mode)) return mode;
  return beat.is_free ? "free" : "paid";
};
function fixPrice(v){ let p=Number(v); if(!Number.isFinite(p)) return 29.99; if(p>=1000) p/=100; return Number(p.toFixed(2)); }

// ===============================
// GO TO BEAT - INJECTED FIXED - HASH ONLY
// ===============================
function goToBeat(beat){
  if(!beat?.id) return;
  closeAllMenus();
  location.hash = `beat?id=${encodeURIComponent(beat.id)}`;
}
function buyBeat(beat){
  let cart; try { cart = JSON.parse(localStorage.getItem("dopetone_cart") || "[]"); } catch { cart = []; }
  if(!cart.some(x => String(x.id) === String(beat.id))){
    cart.push({...beat, price: fixPrice(beat.price)});
    localStorage.setItem("dopetone_cart", JSON.stringify(cart));
    window.dispatchEvent(new CustomEvent("cc_cart_updated",{detail:{count:cart.length}}));
    window.Auth?.showToast?.(`Added ${beat.title} to cart`);
  }
  location.hash = `licence?id=${encodeURIComponent(beat.id)}`;
}
function addToCartOnly(beat){
  let cart; try { cart = JSON.parse(localStorage.getItem("dopetone_cart") || "[]"); } catch { cart = []; }
  if(!cart.some(x => String(x.id) === String(beat.id))){
    cart.push({...beat, price: fixPrice(beat.price)});
    localStorage.setItem("dopetone_cart", JSON.stringify(cart));
    window.dispatchEvent(new CustomEvent("cc_cart_updated",{detail:{count:cart.length}}));
    window.Auth?.showToast?.(`Added ${beat.title} to cart`);
  }
}
window.goToBeat = goToBeat;
window.buyBeat = buyBeat;

function destroyWaves(){ if(observer){ observer.disconnect(); observer=null; } waveCache.forEach(w=>{ try{w.destroy()}catch{}}); waveCache.clear(); }
function ensureWave(row, beat){
  if(!row || row.dataset.waveReady==="1") return;
  if(!beat?.mp3_url) return;
  const container=row.querySelector(".wave-bar"); if(!container) return;
  const WS=window.WaveSurfer || (typeof WaveSurfer!=="undefined"?WaveSurfer:null); if(!WS?.create) return;
  row.dataset.waveReady="1";
  try{
    const wave=WS.create({ container, waveColor:"rgba(255,255,255,.16)", progressColor:"#FF1E3C", cursorWidth:0, height:38, barWidth:2, barGap:2, normalize:true, interact:true, partialRender:true });
    wave.load(beat.mp3_url);
    wave.on("error",()=>{ row.dataset.waveReady="0"; waveCache.delete(String(beat.id)); });
    row.__wave=wave; waveCache.set(String(beat.id),wave);
  }catch{ row.dataset.waveReady="0"; }
}
function closeAllMenus(){ document.querySelectorAll(".dt-row-menu.active").forEach(m=>m.classList.remove("active")); document.querySelectorAll(".wave-row").forEach(r=>r.style.zIndex="1"); }
document.addEventListener("click",e=>{ if(!e.target.closest(".dt-dots-wrap")) closeAllMenus(); });

function createDotsMenu(beat){
  const mode=getMode(beat);
  const liked=getLikes().includes(String(beat.id));
  const wrap=document.createElement("div"); wrap.className="dt-dots-wrap";
  wrap.innerHTML=`
    <button class="wave-dots" type="button">${DOTS_SVG}</button>
    <div class="dt-row-menu">
      <button data-act="goto">🎧 Go to beat</button>
      <button data-act="playlist">➕ Add to playlist</button>
      <button data-act="like">${liked?"❤️ Unlike":"🤍 Like beat"}</button>
      <button data-act="share">🔗 Share beat</button>
      ${mode!=="paid"?`<button data-act="download">⬇️ Download</button>`:""}
      <button data-act="cart">🛒 Add to cart</button>
      <button data-act="buy" class="dt-menu-buy">Buy • $${fixPrice(beat.price).toFixed(2)}</button>
    </div>`;
  const btn=wrap.querySelector(".wave-dots"); const menu=wrap.querySelector(".dt-row-menu");
  btn.onclick=e=>{ e.stopPropagation(); const was=menu.classList.contains("active"); closeAllMenus(); if(!was){ menu.classList.add("active"); wrap.closest(".wave-row").style.zIndex="999"; } };
  menu.onclick=e=>{
    e.stopPropagation(); const act=e.target.closest("button")?.dataset.act; if(!act) return; closeAllMenus();
    if(act==="goto") goToBeat(beat);
    if(act==="playlist"){
      const pls=JSON.parse(localStorage.getItem("dopetone_playlists")||"[]"); let my=pls.find(p=>p.name==="My Playlist");
      if(!my){ my={id:Date.now(),name:"My Playlist",beats:[]}; pls.push(my); }
      if(!my.beats.includes(String(beat.id))) my.beats.push(String(beat.id));
      localStorage.setItem("dopetone_playlists",JSON.stringify(pls)); window.Auth?.showToast?.("Added to playlist");
    }
    if(act==="like"){
      let likes=getLikes(); const id=String(beat.id); const cl=likes.includes(id); likes=cl?likes.filter(x=>x!==id):[...likes,id]; saveLikes(likes);
      const row=document.querySelector(`.wave-row[data-beat-id="${beat.id}"] .wave-heat`); if(row){ row.classList.toggle("is-liked",!cl); row.innerHTML=!cl?HEART_FILL:HEART_SVG; }
    }
    if(act==="share"){
      const url=`${location.origin}/#/beat?id=${encodeURIComponent(beat.id)}`;
      if(navigator.clipboard) navigator.clipboard.writeText(url).then(()=>window.Auth?.showToast?.("Link copied - #/beat?id="));
      else prompt("Copy:",url);
    }
    if(act==="download") downloadBeat(beat);
    if(act==="cart") addToCartOnly(beat);
    if(act==="buy") buyBeat(beat);
  };
  return wrap;
}

function createRow(beat,index,list){
  const mode=getMode(beat); const liked=getLikes().includes(String(beat.id));
  const row=document.createElement("div"); row.className="wave-row"; row.dataset.beatId=beat.id; row.dataset.mode=mode;
  row.innerHTML=`
    <div class="wave-left"><div class="wave-cover-wrap"><img src="${beat.cover_url||''}" loading="lazy" alt=""><button class="wave-play" type="button">${PLAY_SVG}</button></div></div>
    <div class="wave-info"><div class="wave-title">${beat.title||"Untitled"}</div><div class="wave-meta">${beat.bpm||"--"} BPM • ${beat.genre||""} • ${beat.key||""}</div></div>
    <div class="wave-bar"></div>
    <div class="wave-actions"><button class="wave-heat ${liked?"is-liked":""}" type="button">${liked?HEART_FILL:HEART_SVG}</button><button class="wave-buy ${mode==="free"?"is-free":"is-paid"}" type="button">${mode==="free"?"FREE":`$${fixPrice(beat.price).toFixed(2)}`}</button></div>`;
  row.querySelector(".wave-actions").appendChild(createDotsMenu(beat));
  // ROW CLICK = PLAY, DOUBLE CLICK = GO TO BEAT
  row.onclick=e=>{ const t=e.target.closest(".wave-play,.wave-heat,.wave-buy,.wave-bar,.dt-dots-wrap"); if(t) return; row.querySelector(".wave-play").click(); };
  row.ondblclick=e=>{ const t=e.target.closest(".wave-play,.wave-heat,.wave-buy,.wave-bar,.dt-dots-wrap"); if(t) return; e.preventDefault(); goToBeat(beat); };
  row.querySelector(".wave-play").onclick=e=>{
    e.stopPropagation(); ensureWave(row,beat); window.__CURRENT_BEAT__=beat;
    if(window.globalPlayer?.play) window.globalPlayer.play(index,list,"wave");
  };
  row.querySelector(".wave-heat").onclick=e=>{
    e.stopPropagation(); let likes=getLikes(); const id=String(beat.id); const cl=likes.includes(id);
    if(cl) likes=likes.filter(x=>x!==id); else { likes.push(id); fetch(`${STATS_API}/api/stats/event`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({beat_id:Number(beat.id),event_type:"like"})}).catch(()=>{}); }
    saveLikes(likes); const btn=e.currentTarget; btn.classList.toggle("is-liked",!cl); btn.innerHTML=!cl?HEART_FILL:HEART_SVG; btn.classList.add("pop"); setTimeout(()=>btn.classList.remove("pop"),300);
  };
  row.querySelector(".wave-buy").onclick=e=>{ e.stopPropagation(); mode==="paid"?buyBeat(beat):downloadBeat(beat,e.currentTarget); };
  return row;
}

function renderRows(list){
  const container=document.getElementById("waveList"); if(!container) return;
  destroyWaves(); activeBeats=list.slice(0,20); container.innerHTML="";
  if(!activeBeats.length){ container.innerHTML=`<div style="padding:12px;color:#9CA3AF">No beats</div>`; return; }
  const frag=document.createDocumentFragment();
  activeBeats.forEach((beat,i)=>{ frag.appendChild(createRow(beat,i,activeBeats)); });
  container.appendChild(frag); setupLazyWaves();
}
function setupLazyWaves(){
  if(observer) observer.disconnect();
  observer=new IntersectionObserver(entries=>{
    entries.forEach(entry=>{
      if(!entry.isIntersecting) return;
      const row=entry.target; const beat=activeBeats.find(b=>String(b.id)===String(row.dataset.beatId));
      if(beat) ensureWave(row,beat); observer.unobserve(row);
    });
  },{root:null,rootMargin:"0px 0px 450px 0px",threshold:0});
  document.querySelectorAll("#waveList .wave-row").forEach(row=>observer.observe(row));
}
export function renderWave(limit=10){
  const beats=getBeats(); if(!beats.length){ const c=document.getElementById("waveList"); if(c) c.innerHTML=`<div style="padding:12px;color:#9CA3AF">No beats</div>`; return; }
  let list=beats; if(currentFilter!=="all") list=beats.filter(b=>String(b.genre||"").toLowerCase().includes(currentFilter));
  renderRows(list.slice(0,limit||10));
}
function injectPills(){
  const mount=document.getElementById("pillsMount"); if(!mount) return;
  const genres=[...new Set(getBeats().map(b=>b.genre).filter(Boolean))].slice(0,12);
  mount.innerHTML=`
    <button class="pill filter-btn" id="genreFilterBtn" type="button">Filter ▾</button>
    <div class="dt-pills-divider"></div>
    <div class="dt-pills-scroll" id="dtPillsScroll">
      <button class="pill ${currentFilter==="all"?"active":""}" data-g="all" type="button">All</button>
      ${genres.map(g=>`<button class="pill ${currentFilter===g.toLowerCase()?"active":""}" data-g="${String(g).toLowerCase()}" type="button">${g}</button>`).join("")}
    </div>`;
  const scroll=mount.querySelector("#dtPillsScroll"); if(!scroll) return;
  scroll.addEventListener("click",e=>{
    const pill=e.target.closest(".pill"); if(!pill) return;
    if(scroll.dataset.hasDragged==="1"){ scroll.dataset.hasDragged="0"; return; }
    scroll.querySelectorAll(".pill").forEach(p=>p.classList.remove("active")); pill.classList.add("active"); currentFilter=pill.dataset.g; renderWave(20);
  });
  const filterBtn=document.getElementById("genreFilterBtn"); if(filterBtn) filterBtn.onclick=e=>{ e.stopPropagation(); document.getElementById("dtGenreDropdown")?.classList.toggle("open"); };
  if(!document.getElementById("dtGenreDropdown")){
    const dd=document.createElement("div"); dd.id="dtGenreDropdown"; dd.className="dt-genre-dropdown";
    dd.innerHTML=`<div class="dt-genre-head">FILTER BY GENRE</div>${genres.map(g=>`<button data-g="${String(g).toLowerCase()}">${g}</button>`).join("")}<button class="dt-close">Close</button>`;
    dd.onclick=e=>{ const b=e.target.closest("[data-g]"); if(b){ currentFilter=b.dataset.g; mount.querySelectorAll(".dt-pills-scroll .pill").forEach(p=>p.classList.remove("active")); const m=mount.querySelector(`[data-g="${currentFilter}"]`); if(m) m.classList.add("active"); renderWave(20); dd.classList.remove("open"); } if(e.target.closest(".dt-close")) dd.classList.remove("open"); };
    document.body.appendChild(dd);
  }
  injectArsenalStyles(); setupPillsDragScroll(scroll);
}
function setupPillsDragScroll(list){
  if(!list) return; if(list.dataset.dragInit==="1") return; list.dataset.dragInit="1";
  let isDown=false,startX=0,startScroll=0,moved=false;
  list.addEventListener("wheel",e=>{
    if(list.scrollWidth<=list.clientWidth) return; const delta=Math.abs(e.deltaY)>Math.abs(e.deltaX)?e.deltaY:e.deltaX; if(!delta) return; e.preventDefault(); list.scrollLeft+=delta;
  },{passive:false});
  list.addEventListener("pointerdown",e=>{
    if(e.pointerType==="mouse"&&e.button!==0) return; isDown=true; moved=false; startX=e.clientX; startScroll=list.scrollLeft; list.dataset.hasDragged="0"; if(e.pointerType==="mouse") list.classList.add("dragging");
  });
  list.addEventListener("pointermove",e=>{
    if(!isDown) return; const dx=e.clientX-startX; if(Math.abs(dx)>7){ moved=true; list.dataset.hasDragged="1"; } if(moved) list.scrollLeft=startScroll-dx*1.25;
  });
  list.addEventListener("pointerup",()=>{ if(!isDown) return; isDown=false; list.classList.remove("dragging"); if(moved){ list.dataset.hasDragged="1"; setTimeout(()=>{ list.dataset.hasDragged="0"; },80); }else list.dataset.hasDragged="0"; moved=false; });
  list.addEventListener("pointercancel",()=>{ isDown=false; moved=false; list.classList.remove("dragging"); list.dataset.hasDragged="0"; });
  list.querySelectorAll(".pill").forEach(pill=>{ pill.style.pointerEvents="auto"; });
}
function injectArsenalStyles(){
  if(document.getElementById("dt-arsenal-fix")) return;
  const s=document.createElement("style"); s.id="dt-arsenal-fix";
  s.textContent=`
  #pillsMount{display:flex!important;align-items:center!important;gap:10px!important;margin-bottom:22px!important;overflow:visible!important;padding:10px 2px 14px!important;margin-top:4px!important}
  .dt-pills-scroll{display:flex!important;align-items:center!important;gap:8px!important;flex:1!important;min-width:0!important;overflow-x:auto!important;overflow-y:visible!important;scrollbar-width:none!important;cursor:grab!important;padding:6px 0!important;white-space:nowrap!important;touch-action:pan-y!important;user-select:none!important}
  .dt-pills-scroll::-webkit-scrollbar{display:none!important}
  .dt-pills-scroll.dragging{cursor:grabbing!important}
  .dt-pills-scroll .pill{flex:0 0 auto!important;pointer-events:auto!important;cursor:pointer!important}
  .dt-pills-scroll .pill.active{background:#FF1E3C!important;color:#fff!important;border-color:#FF1E3C!important;box-shadow:0 0 12px rgba(255,30,60,.4)!important}
  .dt-pills-divider{width:1px!important;height:20px!important;background:rgba(255,255,255,.08)!important;flex-shrink:0!important}
  .filter-btn{background:rgba(10,25,49,.9)!important;border-color:rgba(255,30,60,.25)!important;color:#fff!important;font-weight:700!important;flex:0 0 auto!important;cursor:pointer!important}
  .arsenal-inner{padding:12px 16px 24px!important;box-sizing:border-box!important}
  #waveList,.wave-list{padding:0 4px!important;display:flex!important;flex-direction:column!important;gap:12px!important}
  .wave-row{width:100%!important;padding:16px 20px!important;min-height:82px!important;gap:18px!important;overflow:visible!important;position:relative!important;z-index:1!important;background:rgba(10,25,49,.92)!important;border:1px solid rgba(255,255,255,.08)!important;border-radius:14px!important}
  .wave-row:has(.dt-row-menu.active){z-index:50!important}
  .wave-left{flex:0 0 46px!important;width:46px!important;height:46px!important}
  .wave-cover-wrap{width:46px!important;height:46px!important;border-radius:8px!important;overflow:hidden!important}
  .wave-info{flex:0 0 145px!important;min-width:0!important;overflow:hidden!important}
  .wave-bar{flex:1 1 0!important;min-width:80px!important;height:38px!important;display:flex!important}
  .wave-actions{margin-left:auto!important;flex-shrink:0!important;display:flex!important;align-items:center!important;gap:8px!important}
  .dt-dots-wrap{position:relative!important;z-index:2!important}
  .wave-dots{width:32px!important;height:32px!important;border-radius:8px!important;border:1px solid rgba(255,255,255,.08)!important;background:rgba(255,255,255,.06)!important;color:rgba(255,255,255,.7)!important;display:grid!important;place-items:center!important;cursor:pointer!important}
  .dt-row-menu{position:absolute!important;right:0!important;top:38px!important;min-width:220px!important;background:#0A1931!important;border:1px solid rgba(255,255,255,.1)!important;border-radius:12px!important;padding:6px!important;display:none!important;flex-direction:column!important;gap:2px!important;z-index:9999!important;box-shadow:0 10px 30px rgba(0,0,0,.7)!important}
  .dt-row-menu.active{display:flex!important}
  .dt-row-menu button{text-align:left!important;padding:10px 12px!important;border-radius:8px!important;border:0!important;background:transparent!important;color:#fff!important;font-size:13px!important;cursor:pointer!important}
  .dt-row-menu button:hover{background:rgba(255,30,60,.12)!important;color:#FF1E3C!important}
  .dt-genre-dropdown{position:fixed!important;right:16px!important;top:80px!important;width:280px!important;max-height:70vh!important;overflow:auto!important;background:#050A14!important;border:1px solid rgba(255,255,255,.1)!important;border-radius:14px!important;padding:8px!important;display:none!important;z-index:999!important}
  .dt-genre-dropdown.open{display:block!important}
  .dt-genre-head{font-size:11px!important;letter-spacing:2px!important;color:#9CA3AF!important;padding:8px!important}
  .dt-genre-dropdown button[data-g]{width:100%!important;text-align:left!important;padding:10px 12px!important;border-radius:8px!important;border:0!important;background:transparent!important;color:#fff!important;cursor:pointer!important}
  .dt-genre-dropdown button[data-g]:hover{background:rgba(255,30,60,.12)!important;color:#FF1E3C!important}
  .dt-close{width:100%!important;margin-top:8px!important;padding:8px!important;border-radius:8px!important;border:1px solid rgba(255,255,255,.1)!important;background:rgba(255,255,255,.06)!important;color:#fff!important;cursor:pointer!important}
  .wave-buy{min-width:86px!important;height:32px!important;padding:0 14px!important;border-radius:8px!important;border:1px solid rgba(255,255,255,.1)!important;background:#fff!important;color:#000!important;font-weight:800!important;font-size:13px!important;cursor:pointer!important}
  .wave-buy.is-free{background:#FF1E3C!important;color:#fff!important;border-color:#FF1E3C!important}
  `;
  document.head.appendChild(s);
}
async function downloadBeat(beat, btn){
  if(!isSignedIn()){ window.Auth?.openModal?.(false); return; }
  if(btn){ btn.disabled=true; const orig=btn.innerHTML; btn.innerHTML="..."; setTimeout(()=>{ btn.innerHTML=orig; btn.disabled=false; },1500); }
  try{
    const r=await fetch(`${STATS_API}/api/download?id=${beat.id}`); if(!r.ok) throw new Error();
    const blob=await r.blob(); const url=URL.createObjectURL(blob);
    const a=document.createElement("a"); a.href=url; a.download=`${beat.title}.mp3`; a.click(); setTimeout(()=>URL.revokeObjectURL(url),1000);
    window.Auth?.showToast?.("Download started");
  }catch(e){ console.error(e); }
}
export function renderBeatsArsenal(){ return `<div class="arsenal-inner"><div class="view-toggle"><div class="toggle-fixed"><h2 class="arsenal-bar-title">ARSENAL</h2><div class="pills-scroll" id="pillsMount"></div></div></div><div id="waveList" class="wave-list"></div></div>`; }
export function initBeatsArsenal(){ injectPills(); renderWave(); injectArsenalStyles(); }
window.renderWave=renderWave;
(function(){
  let ticking=false; const getAudio=()=>document.querySelector("audio")||window.__DT_AUDIO__;
  function sync(){ ticking=false; const a=getAudio(); if(!a||a.paused||!a.duration||!window.__CURRENT_BEAT__?.id) return; const p=a.currentTime/a.duration; document.querySelectorAll(".wave-row").forEach(row=>{ if(String(row.dataset.beatId)!==String(window.__CURRENT_BEAT__.id)) return; const w=row.__wave; if(w) w.seekTo(p); }); }
  function req(){ if(ticking) return; ticking=true; requestAnimationFrame(sync); }
  ["timeupdate","play","pause","seeked"].forEach(ev=>{ document.addEventListener(ev,req,true); });
  document.addEventListener("click",e=>{ const bar=e.target.closest(".wave-bar"); if(!bar) return; const a=getAudio(); if(!a?.duration) return; const r=bar.getBoundingClientRect(); const pr=Math.max(0,Math.min(1,(e.clientX-r.left)/r.width)); a.currentTime=pr*a.duration; req(); });
})();
