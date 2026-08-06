// ===============================
// ARSENAL V2 - FIXED COVER CENTER + HEART
// ===============================
const STATS_API = "https://all-beats-analytics-api.dopetone701.workers.dev";

const PLAY_SVG = `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5.14v14l11-7-11-7z"/></svg>`;
const DOWNLOAD_SVG = `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/></svg>`;
const DOLLAR_SVG = `<span style="font-weight:900;font-size:16px">$</span>`;
const HEART_SVG = `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>`;
const HEART_FILL = `<svg viewBox="0 0 24 24" width="18" height="18" fill="#ff2040" stroke="#ff2040" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>`;

let waveCache = new Map();
let observer = null;
let activeBeatsRef = [];

(function inject(){
  if(document.getElementById('arsenal-final-fix')) document.getElementById('arsenal-final-fix').remove();
  const s=document.createElement('style');
  s.id='arsenal-final-fix';
  s.textContent=`
    .arsenal-inner{padding:8px 10px!important;}
    .view-toggle{display:flex;justify-content:flex-start;align-items:center;gap:12px;margin-bottom:8px!important;padding:0 2px!important;}
    .toggle-fixed{display:flex;align-items:center;gap:12px;flex:1;min-width:0}
    .arsenal-bar-title{font-size:14px!important;font-weight:900!important;letter-spacing:1px!important;margin:0!important;white-space:nowrap}
    .pills-scroll{display:flex;gap:6px;overflow-x:auto;scrollbar-width:none;flex:1;min-width:0}
    .pills-scroll::-webkit-scrollbar{display:none}
    .pill{padding:5px 12px;border-radius:20px;background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.08);color:#8a94b8;font-size:11px;font-weight:600;white-space:nowrap;cursor:pointer;transition:.2s}
    .pill.active,.pill:hover{background:#fff;color:#000;border-color:#fff}
    #waveList{display:flex;flex-direction:column;gap:6px!important;}
    .wave-row{display:flex!important;align-items:center!important;gap:8px!important;padding:7px 8px!important;background:rgba(18,24,58,0.9)!important;border:1px solid rgba(255,255,255,0.06)!important;border-radius:10px!important;min-height:56px!important;width:100%!important}
    .wave-left{flex:0 0 42px!important;width:42px!important;height:42px!important;display:flex!important;align-items:center!important;justify-content:center!important}
    /* COVER FIX - LOCKED CENTER NO BLUR */
    .wave-cover-wrap{width:42px!important;height:42px!important;min-width:42px!important;min-height:42px!important;border-radius:7px!important;overflow:hidden!important;position:relative!important;background:#0a0e2a!important;display:block!important;flex-shrink:0!important;isolation:isolate!important}
    .wave-cover-wrap img{position:absolute!important;top:50%!important;left:50%!important;width:100%!important;height:100%!important;min-width:100%!important;min-height:100%!important;object-fit:cover!important;object-position:50% 50%!important;transform:translate(-50%,-50%)!important;display:block!important;filter:none!important;image-rendering:-webkit-optimize-contrast!important}
    .wave-play{position:absolute!important;inset:0!important;z-index:2!important;display:flex!important;align-items:center!important;justify-content:center!important;background:rgba(0,0,0,0.25)!important;border:0!important;color:#fff!important}
    .wave-info{flex:0 0 105px!important;min-width:0!important}
    .wave-title{font-size:12px!important;font-weight:600!important;color:#fff!important;white-space:nowrap!important;overflow:hidden!important;text-overflow:ellipsis!important;line-height:1.1!important}
    .wave-meta{font-size:10px!important;color:#6e7aa0!important;white-space:nowrap!important;overflow:hidden!important;text-overflow:ellipsis!important}
    .wave-bar{flex:1 1 0%!important;min-width:0!important;width:100%!important;height:36px!important;margin-left:2px!important;display:block!important}
    .wave-bar wave{width:100%!important;display:block!important}
    .wave-bar canvas{width:100%!important}
    .wave-actions{display:flex!important;align-items:center!important;gap:6px!important;flex:0 0 auto!important}
    .wave-heat{width:30px!important;height:30px!important;border-radius:8px!important;border:1px solid rgba(255,255,255,0.08)!important;background:rgba(255,255,255,0.04)!important;color:#8a94b8!important;display:flex!important;align-items:center!important;justify-content:center!important;cursor:pointer!important;transition:.2s!important}
    .wave-heat:hover{border-color:rgba(255,32,64,0.5)!important;color:#ff2040!important;background:rgba(255,32,64,0.08)!important}
    .wave-heat.is-liked{background:rgba(255,32,64,0.15)!important;border-color:rgba(255,32,64,0.5)!important;color:#ff2040!important}
    .wave-heat.pop{transform:scale(1.25)}
    .wave-price{display:flex!important;gap:4px!important;align-items:center!important;font-size:11px!important}
    .old-price{color:#5a658a!important;text-decoration:line-through!important;font-size:9px!important}
    .new-price{color:#fff!important;font-weight:700!important}
    .wave-download{width:30px!important;height:30px!important;border-radius:8px!important;border:1px solid rgba(255,255,255,0.08)!important;background:rgba(255,255,255,0.05)!important;color:#fff!important;display:flex!important;align-items:center!important;justify-content:center!important;cursor:pointer!important}
  `;
  document.head.appendChild(s);
})();

const getLikes = ()=>{ try{ return JSON.parse(localStorage.getItem('dopetone_likes')||'[]'); }catch{return[];} };
const toggleLike = (beat)=>{
  let likes=getLikes(); const sid=String(beat.id);
  const liked=likes.includes(sid);
  if(liked) likes=likes.filter(x=>x!==sid); else { likes.push(sid); try{ fetch(`${STATS_API}/api/stats/event`, {method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({beat_id:parseInt(beat.id), event_type:'like'})}); }catch{} }
  localStorage.setItem('dopetone_likes', JSON.stringify(likes)); return!liked;
};
const isSignedIn = ()=>!!window.currentUser ||!!localStorage.getItem('dopetone_user') ||!!localStorage.getItem('sb-access-token');
const getMode=(b)=>{ let m=(b.monetization_mode||'').toLowerCase(); if(['free','hybrid','paid'].includes(m)) return m; if(b.is_free) return 'free'; return 'paid'; };
const getPriceHTML=(b)=>{ const mode=getMode(b); if(mode==='free') return `<span class="new-price">FREE</span>`; return `<span class="old-price">$49</span><span class="new-price">$${b.price||29.99}</span>`; };
async function triggerDownload(beat){ const res=await fetch(`${STATS_API}/api/download?id=${beat.id}`); const blob=await res.blob(); const url=URL.createObjectURL(blob); const a=document.createElement('a'); a.href=url; a.download=`${beat.title}.mp3`; document.body.appendChild(a); a.click(); setTimeout(()=>{URL.revokeObjectURL(url); a.remove();},1000); }
const handleDownload=(beat)=>{ if(getMode(beat)==='paid') return; if(!isSignedIn()){ alert('Login'); return; } triggerDownload(beat); };
const handleBuy=(beat)=>{ if(getMode(beat)==='free'){ handleDownload(beat); return; } let cart=JSON.parse(localStorage.getItem("dopetone_cart")||"[]"); if(!cart.find(x=>String(x.id)===String(beat.id))){ cart.push(beat); localStorage.setItem("dopetone_cart", JSON.stringify(cart)); } location.href=`licence-page.html?id=${beat.id}`; };

function ensureWave(row, beat){
  const id=String(beat.id); const container=row.querySelector(`#wave-${id}`); if(!container||!beat.mp3_url) return;
  if(waveCache.has(id)&&row.dataset.done==='1') return; if(container.children.length===0) row.dataset.done='0'; if(row.dataset.done==='1') return; row.dataset.done='1';
  const WS=window.WaveSurfer|| (typeof WaveSurfer !== 'undefined'?WaveSurfer:null);
  if(!WS||!WS.create){ row.dataset.done='0'; return; }
  try{
    container.innerHTML="";
    const wave=WS.create({ container, waveColor:"rgba(120,130,255,0.28)", progressColor:"#ff2040", cursorWidth:0, height:36, barWidth:0, normalize:true, interact:true, partialRender:false });
    wave.load(beat.mp3_url);
    wave.on('error',()=>{ row.dataset.done='0'; waveCache.delete(id); });
    row.__wave=wave; waveCache.set(id,wave);
  }catch{ row.dataset.done='0'; }
}

export async function renderWave(limit=10){
  const container=document.getElementById("waveList"); if(!container) return;
  waveCache.forEach(w=>{ try{w.destroy()}catch{} }); waveCache.clear(); if(observer){ observer.disconnect(); observer=null; }
  const beats=window.__BEATS__||window.DTStore?.beats||[]; if(!beats.length){ container.innerHTML=`<div style="padding:12px;color:#9CA3AF;font-size:12px">No beats</div>`; return; }
  let list=beats.slice(0, limit||10); activeBeatsRef=[...list]; container.innerHTML="";
  list.forEach((beat, index)=>{
    const mode=getMode(beat); const liked=getLikes().includes(String(beat.id));
    const row=document.createElement("div"); row.className="wave-row"; row.dataset.beatId=beat.id;
row.innerHTML=`<div class="wave-left"><div class="wave-cover-wrap"><img src="${beat.cover_url||''}" loading="eager" decoding="sync" style="width:100%;height:100%;object-fit:cover;object-position:center center;display:block"><button class="wave-play">${PLAY_SVG}</button></div></div><div class="wave-info"><div class="wave-title">${beat.title}</div><div class="wave-meta">${beat.bpm||'--'} BPM • ${beat.genre||''}</div></div><div class="wave-bar" id="wave-${beat.id}"></div><div class="wave-actions"><button class="wave-heat ${liked?'is-liked':''}">${liked?HEART_FILL:HEART_SVG}</button><div class="wave-price">${getPriceHTML(beat)}</div><button class="wave-download">${mode==='paid'?DOLLAR_SVG:DOWNLOAD_SVG}</button></div>`;
    container.appendChild(row);
    row.querySelector('.wave-play').onclick=(e)=>{ e.stopPropagation(); ensureWave(row,beat); window.__CURRENT_BEAT__=beat; const idx=activeBeatsRef.findIndex(b=>String(b.id)===String(beat.id)); if(window.globalPlayer?.play) window.globalPlayer.play(idx>=0?idx:index, activeBeatsRef, 'wave'); };
    row.querySelector('.wave-heat').onclick=(e)=>{ e.stopPropagation(); const now=toggleLike(beat); e.currentTarget.classList.toggle('is-liked',now); e.currentTarget.innerHTML=now?HEART_FILL:HEART_SVG; e.currentTarget.classList.add('pop'); setTimeout(()=>e.currentTarget.classList.remove('pop'),250); };
    row.querySelector('.wave-price').onclick=(e)=>{ e.stopPropagation(); handleBuy(beat); };
    row.querySelector('.wave-download').onclick=(e)=>{ e.stopPropagation(); if(mode==='paid') handleBuy(beat); else handleDownload(beat); };
    row.addEventListener('click',(e)=>{ if(e.target.closest('.wave-heat,.wave-price,.wave-download,.wave-bar')) return; row.querySelector('.wave-play').click(); });
  });
  observer=new IntersectionObserver((entries)=>{ entries.forEach(en=>{ if(en.isIntersecting){ const r=en.target; const b=activeBeatsRef.find(x=>String(x.id)===String(r.dataset.beatId)); if(b) ensureWave(r,b); observer.unobserve(r); } }); }, {rootMargin:"300px"});
  container.querySelectorAll('.wave-row').forEach(r=>observer.observe(r));
  injectPills();
}

function injectPills(){
  const mount=document.getElementById('pillsMount'); if(!mount) return;
  const beats=window.__BEATS__||[]; const genres=[...new Set(beats.map(b=>b.genre).filter(Boolean))].slice(0,8);
  const all=['All',...genres];
  mount.innerHTML=all.map((g,i)=>`<button class="pill ${i===0?'active':''}" data-g="${g.toLowerCase()}">${g}</button>`).join('');
  mount.querySelectorAll('.pill').forEach(p=>{
    p.onclick=()=>{
      mount.querySelectorAll('.pill').forEach(x=>x.classList.remove('active')); p.classList.add('active');
      const g=p.dataset.g; if(g==='all'){ window.__BEATS_FILTERED__=null; renderWave(); return; }
      window.__BEATS_FILTERED__=(window.__BEATS__||[]).filter(b=>(b.genre||'').toLowerCase().includes(g));
      const filtered=window.__BEATS_FILTERED__; const container=document.getElementById("waveList"); if(!container) return;
      activeBeatsRef=[...filtered]; container.innerHTML=""; filtered.slice(0,20).forEach((beat,idx)=>{
        const mode=getMode(beat); const liked=getLikes().includes(String(beat.id));
        const row=document.createElement("div"); row.className="wave-row"; row.dataset.beatId=beat.id;
        row.innerHTML=`<div class="wave-left"><div class="wave-cover-wrap"><img src="${beat.cover_url||''}" loading="eager" decoding="sync"><button class="wave-play">${PLAY_SVG}</button></div></div><div class="wave-info"><div class="wave-title">${beat.title}</div><div class="wave-meta">${beat.bpm} BPM • ${beat.genre}</div></div><div class="wave-bar" id="wave-${beat.id}"></div><div class="wave-actions"><button class="wave-heat ${liked?'is-liked':''}">${liked?HEART_FILL:HEART_SVG}</button><div class="wave-price">${getPriceHTML(beat)}</div><button class="wave-download">${mode==='paid'?DOLLAR_SVG:DOWNLOAD_SVG}</button></div>`;
        container.appendChild(row); ensureWave(row,beat);
        row.querySelector('.wave-play').onclick=(e)=>{ e.stopPropagation(); ensureWave(row,beat); window.__CURRENT_BEAT__=beat; if(window.globalPlayer?.play) window.globalPlayer.play(idx, filtered, 'wave'); };
      });
    };
  });
}

export function renderBeatsArsenal(){ return `<div class="arsenal-inner"><div class="view-toggle"><div class="toggle-fixed"><h2 class="arsenal-bar-title">ARSENAL</h2><div class="pills-scroll" id="pillsMount"></div></div></div><div id="waveList" class="wave-list"></div></div>`; }
export function initBeatsArsenal(){ renderWave(); }
window.renderWave=renderWave;

(function(){
  const getAudio=()=>document.querySelector('audio')||window.__DT_AUDIO__;
  setInterval(()=>{
    const a=getAudio(); if(!a||!a.duration||a.paused) return;
    const p=a.currentTime/a.duration; const cur=window.__CURRENT_BEAT__?.id; if(!cur) return;
    document.querySelectorAll('.wave-row').forEach(r=>{ const w=r.__wave; if(!w) return; if(String(r.dataset.beatId)===String(cur)) w.seekTo(p); else w.seekTo(0); });
  }, 50);
  document.addEventListener('click',(e)=>{
    const bar=e.target.closest('.wave-bar'); if(!bar) return;
    const rect=bar.getBoundingClientRect(); const pr=(e.clientX-rect.left)/rect.width; const a=getAudio(); if(a&&a.duration) a.currentTime=pr*a.duration;
  });
})();
