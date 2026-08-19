// src/pages/beat-page.js - V7 BUY = LICENCE POPUP

const PLAY_SVG = `<svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20"><path d="M8 5.14v13.72L19 12 8 5.14z"/></svg>`;
const PAUSE_SVG = `<svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20"><path d="M7 5h4v14H7V5zm6 0h4v14h-4V5z"/></svg>`;
const HEART_SVG = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" width="18" height="18"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>`;
const HEART_FILL = `<svg viewBox="0 0 24 24" fill="#FF1E3C" stroke="#FF1E3C" stroke-width="1.8" width="18" height="18"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>`;
const SHARE_SVG = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" width="18" height="18"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="M8.6 13.5l6.8 4M15.4 6.5l-6.8 4"/></svg>`;
const DOTS_SVG = `<svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><circle cx="12" cy="5" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="12" cy="19" r="2"/></svg>`;

function escapeHTML(s){ return String(s??'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#039;'); }
function fixPrice(v){ let p=Number(v); if(!Number.isFinite(p)) return 29.99; if(p>=1000) p/=100; return Number(p.toFixed(2)); }

function getId(){
  const hash = location.hash || '';
  const queryPart = hash.split('?')[1] || '';
  const params = new URLSearchParams(queryPart);
  let id = params.get('id');
  if(id) return decodeURIComponent(id);
  const searchParams = new URLSearchParams(location.search);
  id = searchParams.get('id');
  return id? decodeURIComponent(id) : null;
}

function getGlobalBeats(){ return window.__BEATS__ || window.DTStore?.beats || window.store?.beats || []; }
const STATS_API = 'https://dopetone-stats.dopetone701.workers.dev';
let playedBeats = new Set();
function logBeatEvent(id, type){ if(!id) return; fetch(`${STATS_API}/api/stats/event`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({beatId:parseInt(id),eventType:type}),keepalive:true}).catch(()=>{}) }

function getLikes(){ try{ return JSON.parse(localStorage.getItem("dopetone_likes")||'{}') }catch{ return {} } }
function saveLikes(m){ try{ localStorage.setItem("dopetone_likes", JSON.stringify(m)); localStorage.setItem('dopetone_likes_count', String(Object.keys(m).length)); }catch{} }
function isLiked(id){ if(id==null) return false; const m=getLikes(); const s=String(id).trim(); return!!(m[s]||m[Number(s)]); }
function toggleLike(id){
  const m=getLikes(); const k=String(id).trim(); const n=Number(k);
  const now=!(m[k]||m[n]);
  if(now){ m[k]=Date.now(); m[n]=Date.now(); }
  else{ Object.keys(m).forEach(x=>{ if(String(x).trim()===k||Number(x)===n) delete m[x] }); }
  saveLikes(m); return now;
}
async function getTrueStats(id){
  try{
    const r = await fetch(`${STATS_API}/api/stats/track/${id}`);
    if(r.ok){ const j=await r.json(); return j; }
  }catch{}
  try{
    const r2 = await fetch(`${STATS_API}/api/stats/${id}`);
    if(r2.ok) return await r2.json();
  }catch{}
  return null;
}

async function getDominantColor(imgUrl){
  return new Promise(resolve=>{
    const img=new Image();
    img.crossOrigin="anonymous";
    img.src=imgUrl;
    img.onload=()=>{
      try{
        const canvas=document.createElement("canvas");
        const ctx=canvas.getContext("2d",{willReadFrequently:true});
        canvas.width=64; canvas.height=64;
        ctx.drawImage(img,0,0,64,64);
        const data=ctx.getImageData(0,0,64,64).data;
        let r=0,g=0,b=0,count=0;
        for(let i=0;i<data.length;i+=4*4){
          const rr=data[i], gg=data[i+1], bb=data[i+2];
          const bright=rr+gg+bb;
          if(bright<30 || bright>700) continue;
          r+=rr; g+=gg; b+=bb; count++;
        }
        if(count===0){ resolve({r:10,g:25,b:49}); return; }
        r=Math.round(r/count); g=Math.round(g/count); b=Math.round(b/count);
        resolve({r,g,b});
      }catch{ resolve({r:10,g:25,b:49}); }
    };
    img.onerror=()=>resolve({r:10,g:25,b:49});
    setTimeout(()=>resolve({r:10,g:25,b:49}),2000);
  });
}

function getMode(beat){
  if(!beat) return "paid";
  const m=String(beat.monetization_mode||"").toLowerCase().trim();
  if(["free","hybrid","paid"].includes(m)) return m;
  if(beat.is_free===true || Number(beat.is_free)===1) return "free";
  if(beat.has_free_tagged===true || Number(beat.has_free_tagged)===1) return "hybrid";
  return "paid";
}

export function renderBeatPage(){
  return `<div id="beatMount"></div><link rel="stylesheet" href="/src/pages/beat-page.css" />`;
}

export async function initBeatPage(){
  const id=getId();
  const mount=document.getElementById("beatMount");
  if(!mount) return;

  if(!document.getElementById("beat-page-css")){
    const link=document.createElement("link");
    link.id="beat-page-css";
    link.rel="stylesheet";
    link.href="/src/pages/beat-page.css";
    document.head.appendChild(link);
  }

  if(!id){
    mount.innerHTML=`<div style="padding:60px;color:#fff">
      <h3>No ID Found</h3>
      <p>URL: ${escapeHTML(location.hash)}</p>
      <button onclick="location.hash='#/beats'" style="margin-top:12px;padding:8px 16px;background:#FF1E3C;color:white;border:none;border-radius:8px">Go Beats</button>
    </div>`;
    return;
  }

  mount.innerHTML=`<div class="beat-page-root"><div class="beat-bg-dominant" style="background:#050A14"></div><div class="beat-bg-gradient"></div><div class="beat-content"><div style="padding:80px;text-align:center;color:#8a94b8">Loading ${escapeHTML(id)}...</div></div></div>`;

  try{
    const res=await fetch(`https://creation-system-api.dopetone701.workers.dev/api/beat?id=${encodeURIComponent(id)}`);
    const beat=await res.json();
    if(beat.error) throw new Error("Beat not found");

    let trueStats = null;
    try{ trueStats = await getTrueStats(beat.id); }catch{}
    if(trueStats){
      beat.play_count = trueStats.plays?? trueStats.play_count?? trueStats.playCount?? beat.play_count;
      beat.like_count = trueStats.likes?? trueStats.like_count?? trueStats.likeCount?? beat.like_count;
    }
    const domColor=await getDominantColor(beat.cover_url);
    const rgb=`${domColor.r},${domColor.g},${domColor.b}`;

    const mode=getMode(beat);
    const isFree = mode==="free";
    const liked=isLiked(beat.id);
    const price=fixPrice(beat.price);
    const singleParagraph = (beat.long_description || beat.description_body || beat.description || `${beat.title} is a ${beat.mood||''} ${beat.genre} beat at ${beat.bpm} BPM in ${beat.key}. Produced by Dope Tone in Dubai.`).trim();

    const allBeats=getGlobalBeats();
    let similar=allBeats.filter(b=>String(b.id)!==String(beat.id) && (String(b.genre).toLowerCase()===String(beat.genre).toLowerCase() || String(b.mood).toLowerCase()===String(beat.mood).toLowerCase())).slice(0,8);
    if(similar.length<6){
      const extra=allBeats.filter(b=>String(b.id)!==String(beat.id) &&!similar.some(s=>String(s.id)===String(b.id))).slice(0,8-similar.length);
      similar=[...similar,...extra];
    }

    window.__CURRENT_BEAT__=beat;
    const shareUrl = `${location.origin}/#/beat?id=${encodeURIComponent(beat.id)}`;

    mount.innerHTML=`
      <div class="beat-page-root">
        <div class="beat-bg-dominant" style="background: radial-gradient(120% 120% at 20% 10%, rgba(${rgb},0.85) 0%, rgba(${rgb},0.55) 25%, rgba(${rgb},0.25) 50%, transparent 75%), linear-gradient(to bottom, rgba(${rgb},0.45), #050A14 70%)"></div>
        <div class="beat-bg-gradient"></div>
        <div class="beat-content">
          <div class="beat-back-row">
            <button class="beat-back-btn" onclick="location.hash='#/beats'">← Back</button>
          </div>

          <div class="beat-hero">
            <div class="beat-cover-box" id="coverBox">
              <img src="${escapeHTML(beat.cover_url)}" alt="${escapeHTML(beat.title)}" crossorigin="anonymous" />
            </div>
            <div class="beat-hero-info">
              <div class="beat-type-label">Beat • ${escapeHTML(beat.type||'Single')}</div>
              <h1 class="beat-title">${escapeHTML(beat.title)}</h1>
              <div class="beat-meta-row">
                <div class="beat-artist-chip">
                  <img src="${escapeHTML(beat.cover_url)}" alt="" />
                  <span>${escapeHTML(beat.artist||'DopeTone')}</span>
                </div>
                <div class="beat-dot"></div>
                <div class="beat-meta-text">${escapeHTML(beat.genre)} • ${beat.bpm} BPM • ${escapeHTML(beat.key)}</div>
              </div>
              <div class="beat-stats-mini">
                <span>${beat.play_count||0} plays</span><span>•</span><span>${beat.like_count||0} likes</span><span>•</span><span>${new Date(beat.created_at).getFullYear()||2026}</span>
              </div>
            </div>
          </div>

          <div class="beat-actions-bar">
            <button class="beat-play-big" id="bigPlay">${PLAY_SVG}</button>
            <button class="beat-action-icon ${liked?'is-liked':''}" id="likeBtn">${liked?HEART_FILL:HEART_SVG}</button>
            <button class="beat-action-icon" id="shareBtn2" data-share-url="${escapeHTML(shareUrl)}" title="Share">${SHARE_SVG}</button>
            ${isFree? `
              <button class="beat-buy-btn is-free" id="downloadBtn">⬇ FREE DOWNLOAD</button>
              <button class="beat-cart-btn" id="cartBtn">Add to Cart - FREE</button>
            ` : `
              <button class="beat-buy-btn" id="buyBtn">Buy $${price.toFixed(2)}</button>
              <button class="beat-cart-btn" id="cartBtn">Add to Cart</button>
            `}
          </div>

          <div class="beat-desc-card">
            <div class="beat-desc-label">About this beat • Track Details & Metadata</div>
            <div class="beat-desc-text">${escapeHTML(singleParagraph)}</div>
            <div class="beat-desc-tags">
              <span class="beat-tag">${escapeHTML(beat.genre)}</span>
              <span class="beat-tag">${beat.bpm} BPM</span>
              <span class="beat-tag">${escapeHTML(beat.key)}</span>
              <span class="beat-tag">${escapeHTML(beat.mood||'Vibe')}</span>
              ${ (beat.tags_parsed||[]).slice(0,4).map(t=>`<span class="beat-tag">#${escapeHTML(t)}</span>`).join('') }
            </div>
          </div>

          <div class="beat-similar-section">
            <div class="beat-section-head">
              <div class="beat-section-title">More like ${escapeHTML(beat.title)}</div>
              <button class="beat-back-btn" style="height:30px;font-size:12px" onclick="location.hash='#/beats'">Show all</button>
            </div>
            <div class="beat-sim-list" id="similarList"></div>
          </div>
        </div>
      </div>
    `;

    function updatePlayIcons(isPlaying){
      const big=document.getElementById("bigPlay");
      const coverBox=document.getElementById("coverBox");
      if(big) big.innerHTML=isPlaying?PAUSE_SVG:PLAY_SVG;
      if(coverBox) coverBox.classList.toggle("is-playing", isPlaying);
    }

    function togglePlay(){
      const audioEl=document.querySelector("audio") || window.__DT_AUDIO__;
      const isCurrent=String(window.__CURRENT_BEAT__?.id)===String(beat.id);
      const isPlaying=isCurrent && audioEl &&!audioEl.paused;
      if(isPlaying){
        audioEl.pause(); if(window.globalPlayer?.pause) window.globalPlayer.pause();
      } else {
        if(!playedBeats.has(String(beat.id))){ logBeatEvent(beat.id, 'play'); playedBeats.add(String(beat.id)); }
        const all=getGlobalBeats();
        let idx=all.findIndex(b=>String(b.id)===String(beat.id));
        if(idx===-1){ all.unshift(beat); idx=0; window.__BEATS__=all; }
        if(window.globalPlayer?.play) window.globalPlayer.play(idx, all, "beat-page");
      }
    }

    document.getElementById("bigPlay").onclick=togglePlay;

    document.addEventListener("playerPlay", ()=>{
      const isThis = String(window.__CURRENT_BEAT__?.id)===String(beat.id);
      updatePlayIcons(isThis);
      renderSimilar();
    });
    document.addEventListener("playerPause", ()=>{
      updatePlayIcons(false);
      renderSimilar();
    });

    document.getElementById("likeBtn").onclick=(e)=>{
      const btn=e.currentTarget;
      const liked = toggleLike(beat.id);
      btn.classList.toggle("is-liked", liked);
      btn.innerHTML=liked?HEART_FILL:HEART_SVG;
      const map=getLikes();
      const total=Object.keys(map).length;
      window.dispatchEvent(new CustomEvent('cc_like_updated',{detail:{beat_id:beat.id, beatId:beat.id, liked, count:total, perBeat:map}}));
      window.dispatchEvent(new CustomEvent('cc_player_like_sync',{detail:{total, beat_id:beat.id, beatId:beat.id, liked}}));
      window.dispatchEvent(new CustomEvent('cc_like_change',{detail:{beat_id:beat.id, liked}}));
      logBeatEvent(beat.id, 'like');
    };

    document.getElementById("shareBtn2").onclick=(e)=>{
      const url = e.currentTarget.dataset.shareUrl || shareUrl;
      if(navigator.clipboard) navigator.clipboard.writeText(url).then(()=>window.Auth?.showToast?.("Link copied"));
      else window.prompt("Copy link:", url);
    };

    // BUY + CART = LICENCE POPUP
    async function openLicence(){
      const mod = await import("../features/licence/licence.js");
      mod.openLicencePopup(beat, beat.selected_licence||'basic');
    }

    document.getElementById("cartBtn").onclick=()=> openLicence();
    const buyBtn=document.getElementById("buyBtn");
    if(buyBtn) buyBtn.onclick=()=> openLicence();

    const dlBtn=document.getElementById("downloadBtn");
    if(dlBtn){
      dlBtn.onclick=async()=>{
        const user=window.Auth?.user || JSON.parse(localStorage.getItem("dopetone_user")||"null");
        if(!user){ window.Auth?.openModal?.(false); return; }
        dlBtn.textContent="Downloading...";
        try{
          const uid=user.id||user.user_id;
          const url=`https://ai-api.dopetone701.workers.dev/api/secure-download/${beat.id}?uid=${encodeURIComponent(uid)}`;
          const res=await fetch(url,{headers:{"x-user-id":String(uid)}});
          const blob=await res.blob();
          const blobUrl=URL.createObjectURL(blob);
          const a=document.createElement("a"); a.href=blobUrl; a.download=`${beat.title.replace(/[^a-z0-9]/gi,"_")}_DopeTone.mp3`; document.body.appendChild(a); a.click();
          setTimeout(()=>{URL.revokeObjectURL(blobUrl); a.remove();},2000);
          dlBtn.textContent="✓ Downloaded";
          setTimeout(()=>{dlBtn.textContent="⬇ FREE DOWNLOAD";},2000);
        }catch(e){ dlBtn.textContent="Retry"; }
      };
    }

    function playSimilarBeat(targetBeat){
      const all=getGlobalBeats();
      const idx=all.findIndex(x=>String(x.id)===String(targetBeat.id));
      if(idx>=0) window.globalPlayer?.play?.(idx, all, "similar");
      else { all.unshift(targetBeat); window.__BEATS__=all; window.globalPlayer?.play?.(0, all, "similar"); }
    }

    function renderSimilar(){
      const list=document.getElementById("similarList");
      if(!list) return;
      list.innerHTML="";
      similar.forEach((b, i)=>{
        const isCurrentPlaying = String(window.__CURRENT_BEAT__?.id)===String(b.id) &&!(document.querySelector("audio")?.paused?? true);
        const row=document.createElement("div");
        row.className=`beat-sim-row ${isCurrentPlaying?'is-playing':''}`;
        row.innerHTML=`
          <div class="beat-sim-index">${i+1}</div>
          <div class="beat-sim-cover"><img src="${escapeHTML(b.cover_url||'images/studio.jpg')}" loading="lazy"></div>
          <div class="beat-sim-info">
            <div class="beat-sim-title">${escapeHTML(b.title)}</div>
            <div class="beat-sim-sub">${escapeHTML(b.genre)} • ${b.bpm} BPM • ${escapeHTML(b.key||'')}</div>
          </div>
          <div style="display:flex;align-items:center;gap:6px;justify-content:end;position:relative">
            <button class="beat-sim-play" data-play>${isCurrentPlaying?PAUSE_SVG:PLAY_SVG}</button>
            <button class="beat-sim-dots" data-dots>${DOTS_SVG}</button>
            <div class="dt-row-menu">
              <button data-act="goto">🎧 Go to beat</button>
              <button data-act="cart">🛒 Add to cart</button>
              <button data-act="buy">Buy • $${fixPrice(b.price).toFixed(2)}</button>
              <button data-act="share">🔗 Share</button>
            </div>
          </div>
        `;
        row.onclick=(e)=>{
          if(e.target.closest("[data-play],[data-dots],.dt-row-menu")) return;
          const currId = String(window.__CURRENT_BEAT__?.id);
          const audioEl = document.querySelector("audio") || window.__DT_AUDIO__;
          if(currId===String(b.id) && audioEl &&!audioEl.paused){ audioEl.pause(); window.globalPlayer?.pause?.(); }
          else playSimilarBeat(b);
        };
        const playBtn=row.querySelector("[data-play]");
        playBtn.onclick=(e)=>{ e.stopPropagation(); row.click(); };

        const dots=row.querySelector("[data-dots]");
        const menu=row.querySelector(".dt-row-menu");
        dots.onclick=(e)=>{
          e.stopPropagation();
          const was=menu.classList.contains("active");
          document.querySelectorAll(".dt-row-menu.active").forEach(m=>m.classList.remove("active"));
          if(!was) menu.classList.add("active");
        };
        menu.onclick=async (e)=>{
          e.stopPropagation();
          const act=e.target.closest("button")?.dataset.act;
          if(!act) return;
          menu.classList.remove("active");
         if(act==="goto"){
            location.hash=`#/beat?id=${encodeURIComponent(b.id)}`;
            window.scrollTo({top:0, behavior:"smooth"});
            return;
          }
          if(act==="cart" || act==="buy"){
            const mod = await import("../features/licence/licence.js");
            mod.openLicencePopup(b, b.selected_licence||'basic');
          }
          if(act==="share"){
            const url=`${location.origin}/#/beat?id=${encodeURIComponent(b.id)}`;
            navigator.clipboard?.writeText(url).then(()=>window.Auth?.showToast?.("Link copied"));
          }
        };
        list.appendChild(row);
      });
    }
    renderSimilar();

    document.addEventListener("click",(e)=>{
      if(!e.target.closest("[data-dots]")) document.querySelectorAll(".dt-row-menu.active").forEach(m=>m.classList.remove("active"));
    });

  }catch(err){
    mount.innerHTML=`<div style="padding:40px;color:#fff">Error: ${escapeHTML(err.message)}</div>`;
  }
}

export default { renderBeatPage, initBeatPage };
