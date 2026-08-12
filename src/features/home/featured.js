// ===============================
// FEATURED - FIXED FOR DTPlayer - FULL FILE V2.9 HASH ONLY
// ===============================
const PLAY_SVG = `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5.14v14l11-7-11-7z"/></svg>`;
const PAUSE_SVG = `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>`;
const STATS_API = "https://dopetone-stats.dopetone701.workers.dev";

const getMode = b => {
  const m = (b.monetization_mode||b.monetizationMode||'').toLowerCase();
  if(['free','hybrid','paid'].includes(m)) return m;
  if(b.is_free==1) return 'free';
  return 'paid';
};
const fixPrice = p => { let n=Number(p??29.99); if(n>=1000) n/=100; return Number(n.toFixed(2)); };
const getPriceHTML = b => getMode(b)==='free'? `<span class="free-dna">FREE</span>` : `<span class="old">$49</span><span class="new">$${fixPrice(b.price).toFixed(2)}</span>`;
const getBuyLabel = b => getMode(b)==='free'? 'Free Download' : 'Buy';
function getFeaturedBeats(a){
  if(!a?.length) return [];
  let marked=a.filter(b=>b.is_featured==1); if(marked.length>=5) return marked.slice(0,10);
  return [...a].sort(()=>0.5-Math.random()).slice(0,10);
}

// INJECTED - GO TO BEAT HASH ONLY
function goToBeat(beat){
  if(!beat?.id) return;
  location.hash = `beat?id=${encodeURIComponent(beat.id)}`;
}
function buyBeatGo(beat){
  let cart=JSON.parse(localStorage.getItem("dopetone_cart")||"[]");
  if(!cart.find(x=>String(x.id)===String(beat.id))){ cart.push({...beat, price: fixPrice(beat.price)}); localStorage.setItem("dopetone_cart",JSON.stringify(cart)); window.dispatchEvent(new CustomEvent("cc_cart_updated",{detail:{count:cart.length}})); }
  location.hash = `licence?id=${encodeURIComponent(beat.id)}`;
}
window.goToBeat = goToBeat;

if (!window.__FEATURED_EVENTS__) {
  window.__FEATURED_EVENTS__ = true;
  document.addEventListener("playerPlay", e => window.__featuredPlayHandler?.(e));
  document.addEventListener("playerPause", () => window.__featuredPauseHandler?.());
}

const activeDownloads = new Set();
async function trackDownload(beat){
  try{ fetch(`${STATS_API}/api/stats/track/${beat.id}/download`, {method:'POST', keepalive:true}).catch(()=>{}); }catch{}
}
async function proDownload(beat, btn){
  if(activeDownloads.has(String(beat.id))) return;
  activeDownloads.add(String(beat.id));
  const orig=btn.innerHTML; btn.disabled=true; btn.innerHTML=`Downloading...`;
  try{
    await trackDownload(beat);
    const blob=await (await fetch(beat.mp3_url||beat.audio_url)).blob();
    const u=URL.createObjectURL(blob); const a=document.createElement('a'); a.href=u; a.download=`${beat.title}.mp3`; a.click();
    setTimeout(()=>URL.revokeObjectURL(u),2000); btn.innerHTML=`✓ Downloaded`;
    setTimeout(()=>{btn.innerHTML=orig; btn.disabled=false; activeDownloads.delete(String(beat.id));},2000);
  }catch{ btn.innerHTML=`Failed`; btn.disabled=false; activeDownloads.delete(String(beat.id)); }
}

export function renderFeatured(){
  const root = document.getElementById("featuredTrack") || document.getElementById("featuredMount");
  const allBeats = window.DTStore?.beats || window.__BEATS__ || [];
  if(!root) return;
  if(!allBeats.length){ setTimeout(renderFeatured,500); return; }
  const beats=getFeaturedBeats(allBeats);
  if(!beats.length) return;

  let current=Math.floor(beats.length/2), cards=[];

  if(!document.getElementById('feat-v2-title')){
    const d=document.createElement('div'); d.id='feat-v2-title';
    d.innerHTML=`<div class="section-title-wrap-fixed"><h2 class="section-title v2-title">🔥 Featured Drops</h2></div>`;
    root.parentElement.insertBefore(d, root);
  }

  root.classList.add('featured-container');
  root.innerHTML="";
  const frag=document.createDocumentFragment();

  beats.forEach((beat,i)=>{
    const card=document.createElement("div"); card.className="featured-card";
    card.dataset.beatId = beat.id;
    card.innerHTML=`
      <div class="f-cover-wrap">
        <img src="${beat.cover_url||'/public/images/studio.jpg'}" loading="lazy">
        <button class="f-play" type="button"><span class="f-icon">${PLAY_SVG}</span></button>
      </div>
      <div class="f-content">
        <div class="f-title">${beat.title}</div>
        <div class="f-meta">#${beat.genre||'Trap'} • ${beat.bpm||140} BPM</div>
        <div class="f-price">${getPriceHTML(beat)}</div>
        <button class="f-buy ${getMode(beat)==='free'?'is-free':''}" type="button">${getBuyLabel(beat)}</button>
      </div>`;

    const playBtn=card.querySelector(".f-play");
    const buyBtn=card.querySelector(".f-buy");

    playBtn.addEventListener('click', e => {
      e.preventDefault(); e.stopPropagation(); e.stopImmediatePropagation();
      const audio = window.__DT_AUDIO__ || window.__DOPE_TONE_AUDIO__;
      const player = window.DTPlayer || window.globalPlayer;
      if (!audio ||!player){ console.error('[FEATURED] No player found'); return; }
      const currentId = String(window.__CURRENT_BEAT__?.id || '');
      if (String(beat.id) === currentId) {
        if (audio.paused) audio.play().catch(()=>{});
        else audio.pause();
        return;
      }
      if(window.DTPlayer?.setQueue){ DTPlayer.setQueue(beats, i, true); }
      else if(window.DTPlayTrack){ window.DTPlayTrack(beat, true); }
      window.__CURRENT_LIST__ = "featured";
      window.__CURRENT_INDEX__ = i;
      window.__CURRENT_BEATS__ = beats;
      animateTo(i);
    });

    buyBtn.onclick = async e=>{
      e.stopPropagation();
      if(getMode(beat)==='free'){ await proDownload(beat, buyBtn); return; }
      buyBeatGo(beat);
    };

    // FIXED - CLICK CARD = GO TO BEAT, PLAY BTN ONLY PLAYS
    card.addEventListener('click', e=>{
      if(e.target.closest(".f-play,.f-buy")) return;
      // Single click = animate, Double click = go to beat
      animateTo(i);
    });
    card.addEventListener('dblclick', e=>{
      if(e.target.closest(".f-play,.f-buy")) return;
      e.preventDefault(); goToBeat(beat);
    });
    // Title click = go to beat
    const titleEl = card.querySelector(".f-title");
    if(titleEl){
      titleEl.style.cursor="pointer";
      titleEl.onclick = e=>{ e.stopPropagation(); goToBeat(beat); };
    }

    frag.appendChild(card); cards.push(card);
  });
  root.appendChild(frag);

  function getOffset(i){ let d=i-current; if(d>beats.length/2)d-=beats.length; if(d<-beats.length/2)d+=beats.length; return d; }
  function update(){
    cards.forEach((c,i)=>{
      const o=getOffset(i);
      c.style.transform=`translate(-50%,-50%) translateX(${o*110}%) scale(${1-Math.abs(o)*0.18})`;
      c.style.opacity=Math.max(0.25,1-Math.abs(o)*0.45);
      c.style.zIndex=10-Math.abs(Math.round(o));
    });
  }
  function getCurrentId(){ return String(window.__CURRENT_BEAT__?.id || ''); }
  function syncUI(){
    const audio = window.__DT_AUDIO__ || window.__DOPE_TONE_AUDIO__;
    const playing = audio &&!audio.paused;
    const currentId = getCurrentId();
    cards.forEach((c,i)=>{
      const beat = beats[i];
      const ic=c.querySelector(".f-icon");
      const isActive = String(beat.id) === currentId;
      const showPause = isActive && playing;
      ic.innerHTML = showPause? PAUSE_SVG : PLAY_SVG;
      c.classList.toggle("is-active", isActive);
      c.classList.toggle("is-playing", showPause);
      let eq = c.querySelector('.f-eq');
      if(!eq){
        eq = document.createElement('div');
        eq.className='f-eq';
        eq.style.cssText='position:absolute;bottom:8px;right:8px;display:none;gap:2px;align-items:end;z-index:31;';
        eq.innerHTML = '<span style="width:3px;height:8px;background:#22d3ee;display:block;border-radius:99px;animation:qeq1 0.6s infinite"></span><span style="width:3px;height:8px;background:#22d3ee;display:block;border-radius:99px;animation:qeq2 0.6s infinite 0.2s"></span>';
        c.querySelector('.f-cover-wrap').appendChild(eq);
      }
      eq.style.display = showPause? 'flex' : 'none';
    });
  }
  function animateTo(t){
    const s=current, len=beats.length; let d=t-s; if(d>len/2)d-=len; if(d<-len/2)d+=len;
    const dur=380, st=performance.now();
    const tick=now=>{
      const p=Math.min((now-st)/dur,1); const e=1-Math.pow(1-p,3);
      current=s+d*e; update();
      if(p<1) requestAnimationFrame(tick); else {current=(t+len)%len; update(); syncUI();}
    }; requestAnimationFrame(tick);
  }

  window.__featuredPlayHandler = e => {
    const newId = String(window.__CURRENT_BEAT__?.id || '');
    if(!newId) return;
    const idxInFeatured = beats.findIndex(b=> String(b.id)===newId);
    if(idxInFeatured!== -1){ current = idxInFeatured; update(); }
    syncUI();
  };
  window.__featuredPauseHandler = () => syncUI();

  const audio = window.__DT_AUDIO__ || window.__DOPE_TONE_AUDIO__;
  if(audio &&!audio.__featuredBound){
    audio.__featuredBound=true;
    audio.addEventListener('play', () => {
      document.dispatchEvent(new CustomEvent("playerPlay", { detail: { index: window.__CURRENT_INDEX__, listId: window.__CURRENT_LIST__ } }));
    });
    audio.addEventListener('pause', () => document.dispatchEvent(new CustomEvent("playerPause")));
    audio.addEventListener('ended', () => document.dispatchEvent(new CustomEvent("playerPause")));
  }

  if(window.syncQueueToSection){
    window.syncQueueToSection(beats, "featured", Math.floor(beats.length/2));
  } else {
    if(window.DTPlayer &&!window.DTPlayer.queue.length){
      window.DTPlayer.queue = beats;
      window.DTPlayer.index = Math.floor(beats.length/2);
      localStorage.setItem('dt_queue_v2', JSON.stringify(beats));
      window.__CURRENT_LIST__ = "featured";
      window.__CURRENT_BEATS__ = beats;
    }
  }

  update(); syncUI();
}
