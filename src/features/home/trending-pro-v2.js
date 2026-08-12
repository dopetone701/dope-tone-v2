let queue = [];
let queueIndex = 0;
let isPlayingGlobal = false;
let activeBeatId = null;
let currentId = null;

let _onPlayerPlay = null;
let _onPlayerPause = null;
let _onPlayerEnded = null;

// INJECTED - GO TO BEAT HASH ONLY
function goToBeat(beat){
  if(!beat?.id) return;
  location.hash = `beat?id=${encodeURIComponent(beat.id)}`;
}
function buyBeatGo(beat){
  let cart; try{ cart=JSON.parse(localStorage.getItem("dopetone_cart")||"[]"); }catch{ cart=[]; }
  if(!cart.some(x=>String(x.id)===String(beat.id))){
    cart.push(beat); localStorage.setItem("dopetone_cart",JSON.stringify(cart));
    window.dispatchEvent(new CustomEvent("cc_cart_updated",{detail:{count:cart.length}}));
  }
  location.hash = `licence?id=${encodeURIComponent(beat.id)}`;
}
window.goToBeat = goToBeat;

export function renderTrending(){
  const grid = document.getElementById('trendingGrid');
  if(!grid) return;
  const beats = window.__BEATS__ || window.DTStore?.beats || window.store?.beats || [];
  if(!beats.length) return;

  if(window.__trendingSwap__) clearTimeout(window.__trendingSwap__);
  if(window.__trendingAdmire__) clearTimeout(window.__trendingAdmire__);

  if(_onPlayerPlay) document.removeEventListener('playerPlay', _onPlayerPlay);
  if(_onPlayerPause) document.removeEventListener('playerPause', _onPlayerPause);
  if(_onPlayerEnded) document.removeEventListener('playerEnded', _onPlayerEnded);

  queue = beats.slice(0,10);
  const display = queue.slice(0,4);

  if(!document.getElementById('spotifyTrendCSS')){
    const s=document.createElement('style');
    s.id='spotifyTrendCSS';
    s.textContent=`
.trending-grid-v2{display:grid;grid-template-columns:repeat(2,1fr);gap:12px;align-items:start;width:100%;max-height:none!important;overflow:visible!important}
.spotify-card{background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.06);border-radius:14px;padding:10px;cursor:pointer;position:relative;transition:transform.2s ease, border-color.2s ease, opacity.35s ease;min-width:0;overflow:hidden}
.spotify-card.playing{border-color:#4da6ff;background:rgba(77,166,255,0.08)}
.spotify-card:hover{transform:translateY(-2px);border-color:rgba(77,166,255,0.18)}
.spotify-card.swap-out{opacity:0;transform:scale(.92) translateY(8px)}
.spotify-card.swap-in{animation:swapIn.35s ease forwards}
@keyframes swapIn{from{opacity:0;transform:scale(.92) translateY(8px)} to{opacity:1;transform:scale(1) translateY(0)}}
.spotify-cover-wrap{position:relative;width:100%;aspect-ratio:1/1;border-radius:10px;overflow:hidden;background:#0e1220}
.spotify-cover-wrap img{width:100%;height:100%;object-fit:cover;display:block;transition:transform.6s ease}
.spotify-card:hover.spotify-cover-wrap img{transform:scale(1.06)}
.spotify-play{position:absolute;right:8px;bottom:8px;width:42px;height:42px;border-radius:50%;background:linear-gradient(135deg,#4da6ff,#ff4d94);color:#fff;border:none;display:grid;place-items:center;cursor:pointer;box-shadow:0 6px 16px rgba(0,0,0,0.5);opacity:0;transform:translateY(8px) scale(.92);transition:.22s;z-index:2}
.spotify-card:hover.spotify-play{opacity:1;transform:translateY(0) scale(1)}
.spotify-card.playing.spotify-play{opacity:1;transform:translateY(0) scale(1)}
.spotify-play svg{width:18px;height:18px;fill:#fff}
.eq-wrap{position:absolute;left:8px;bottom:8px;display:flex;gap:2px;align-items:end;background:rgba(0,0,0,0.6);backdrop-filter:blur(6px);padding:4px 6px;border-radius:99px;opacity:0;transform:translateY(6px);transition:.2s;z-index:2}
.spotify-card.playing.eq-wrap{opacity:1;transform:translateY(0)}
.eq-bar{width:3px;background:linear-gradient(180deg,#4da6ff,#ff4d94);border-radius:99px;animation:eq 0.8s infinite ease-in-out}
.eq-bar:nth-child(1){height:10px;animation-delay:0s}
.eq-bar:nth-child(2){height:14px;animation-delay:0.15s}
.eq-bar:nth-child(3){height:8px;animation-delay:0.3s}
@keyframes eq{0%,100%{transform:scaleY(0.6)}50%{transform:scaleY(1)}}
.spotify-meta{padding:10px 2px 0 2px;display:flex;justify-content:space-between;align-items:flex-end;gap:8px;min-width:0}
.spotify-left{flex:1;min-width:0}
.spotify-title{color:#fff;font-size:13px;font-weight:700;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;line-height:1.2}
.spotify-sub{color:rgba(255,255,255,0.45);font-size:11px;margin-top:3px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.spotify-right{text-align:right;flex-shrink:0}
.spotify-price{font-family:'Orbitron',sans-serif;font-size:12px;font-weight:800;color:#fff;background:rgba(255,255,255,0.08);border:1px solid rgba(255,255,255,0.1);padding:4px 8px;border-radius:99px;line-height:1}
.spotify-price.free{background:linear-gradient(135deg,#4da6ff,#ff4d94);border:none;color:#fff}
#homeSmartWrap, #homeSmartWrap.side-by-side,.ntg-shell,.ntg-card{overflow:visible!important;max-height:none!important;min-height:0!important}
#homeSmartWrap.side-by-side.ntg-card{display:block!important;height:auto!important}
`;
    document.head.appendChild(s);
  }

  const getPrice = (b)=>{
    if(b.is_free==1 || (b.monetization_mode||'').toLowerCase()==='free') return 'FREE';
    return b.price? `$${b.price}` : (b.display_price? `$${b.display_price}` : '$9');
  };

  grid.classList.add('trending-grid-v2');
  grid.innerHTML = display.map((b)=>{
    const price = getPrice(b);
    const realIdx = queue.findIndex(x=>String(x.id)===String(b.id));
    return `
    <div class="spotify-card" data-id="${b.id}" data-queue="${realIdx}">
      <div class="spotify-cover-wrap">
        <img src="${b.cover || b.cover_url || b.image || 'public/images/default.jpg'}" loading="lazy" onerror="this.onerror=null;this.src='public/images/default.jpg'">
        <button class="spotify-play"><svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg></button>
        <div class="eq-wrap"><div class="eq-bar"></div><div class="eq-bar"></div><div class="eq-bar"></div></div>
      </div>
      <div class="spotify-meta">
        <div class="spotify-left">
          <div class="spotify-title">${b.title || 'Untitled'}</div>
          <div class="spotify-sub">${b.genre||'Trap'} • ${b.bpm||'--'} BPM</div>
        </div>
        <div class="spotify-right"><div class="spotify-price ${price==='FREE'?'free':''}">${price}</div></div>
      </div>
    </div>`;
  }).join('');

  let isHovering = false;
  let recentlySwapped = new Map();
  let shuffleBag = [];

  const shuffle = (arr) => {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
    return a;
  };
  const getVisibleIds = () => new Set([...grid.querySelectorAll(".spotify-card")].map(c => String(c.dataset.id)));
  const refillBag = () => {
    const visibleIds = getVisibleIds();
    const candidates = queue.filter(b =>!visibleIds.has(String(b.id)) && String(b.id)!== String(activeBeatId));
    shuffleBag = shuffle(candidates.length? candidates : queue.filter(b => String(b.id)!== String(activeBeatId)));
  };
  refillBag();
  const preload = (src) => new Promise(resolve => { const img = new Image(); img.src = src; img.onload = img.onerror = () => resolve(); });
  const getCardToSwap = () => {
    const now = Date.now();
    const cards = [...grid.querySelectorAll(".spotify-card")];
    const eligible = cards.filter(card => { if (card.classList.contains("playing")) return false; return (now - (recentlySwapped.get(card) || 0)) > 7000; });
    if (eligible.length) return eligible[Math.floor(Math.random() * eligible.length)];
    return cards.filter(c =>!c.classList.contains("playing")).sort((a,b)=>(recentlySwapped.get(a)||0)-(recentlySwapped.get(b)||0))[0];
  };
  const getNextBeat = () => {
    const visibleIds = getVisibleIds();
    let attempts = 0;
    while (attempts < 2) {
      while (shuffleBag.length) { const candidate = shuffleBag.pop(); if (!visibleIds.has(String(candidate.id)) && String(candidate.id)!== String(activeBeatId)) return candidate; }
      refillBag(); attempts++;
    }
    return null;
  };
  const swapOne = async () => {
    if (isHovering) { scheduleNext(); return; }
    if (queue.length <= display.length) { scheduleNext(); return; }
    const card = getCardToSwap(); if (!card) { scheduleNext(); return; }
    const beat = getNextBeat(); if (!beat) { scheduleNext(); return; }
    const img = card.querySelector("img"); const title = card.querySelector(".spotify-title"); const sub = card.querySelector(".spotify-sub"); const priceEl = card.querySelector(".spotify-price");
    const src = beat.cover || beat.cover_url || beat.image || "public/images/default.jpg";
    card.classList.add("swap-out"); await new Promise(r => setTimeout(r, 220)); await preload(src);
    const price = getPrice(beat); const realIdx = queue.findIndex(b => String(b.id) === String(beat.id));
    card.dataset.id = beat.id; card.dataset.queue = realIdx; img.src = src; title.textContent = beat.title || "Untitled"; sub.textContent = `${beat.genre || "Trap"} • ${beat.bpm || "--"} BPM`; priceEl.textContent = price; priceEl.className = `spotify-price ${price === "FREE"? "free" : ""}`; recentlySwapped.set(card, Date.now());
    card.classList.remove("swap-out"); card.classList.add("swap-in"); setTimeout(() => card.classList.remove("swap-in"), 350); scheduleNext();
  };
  const scheduleNext = () => { window.__trendingSwap__ = setTimeout(swapOne, 3200 + Math.random() * 800); };
  grid.onmouseenter = () => (isHovering = true); grid.onmouseleave = () => (isHovering = false);
  window.__trendingAdmire__ = setTimeout(() => scheduleNext(), 5000);

  grid.querySelectorAll('.spotify-card').forEach(card=>{
    const btn=card.querySelector('.spotify-play');
    const playAction = (e) => {
      e.preventDefault(); e.stopPropagation();
      const id = card.dataset.id;
      const qIndex = queue.findIndex(b => String(b.id) === String(id));
      if (qIndex === -1) return;
      if (String(currentId) === String(id) && window.globalPlayer) {
        if (window.globalPlayer.isPlaying) window.globalPlayer.pause(); else window.globalPlayer.resume?.() || window.globalPlayer.play(qIndex, queue, "trending");
        return;
      }
      currentId = id; activeBeatId = id; queueIndex = qIndex;
      window.globalPlayer?.play(qIndex, queue, "trending");
    };
    btn.onclick = playAction;
    // FIXED - CARD CLICK = GO TO BEAT, PLAY BTN = PLAY ONLY
    card.onclick = (e) => {
      if (e.target.closest(".spotify-play")) return;
      const beat = queue.find(b=> String(b.id) === String(card.dataset.id));
      if(beat) goToBeat(beat);
    };
    card.ondblclick = e=>{ e.preventDefault(); const beat = queue.find(b=> String(b.id) === String(card.dataset.id)); if(beat) goToBeat(beat); };
    const titleEl = card.querySelector(".spotify-title");
    if(titleEl){ titleEl.style.cursor="pointer"; titleEl.onclick = e=>{ e.stopPropagation(); const beat = queue.find(b=> String(b.id) === String(card.dataset.id)); if(beat) goToBeat(beat); }; }
  });

  _onPlayerPlay = (e) => {
    const {index,listId}=e.detail||{}; if(listId!=="trending") return;
    const beat=queue[index]; if(!beat) return;
    activeBeatId=beat.id; currentId=beat.id; queueIndex=index; isPlayingGlobal=true;
    grid.querySelectorAll(".spotify-card").forEach(c=>{
      const isActive=String(c.dataset.id)===String(activeBeatId);
      c.classList.toggle("playing", isActive);
      c.querySelector('.spotify-play').innerHTML=isActive? `<svg viewBox="0 0 24 24" width="18" height="18"><path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/></svg>` : `<svg viewBox="0 0 24 24" width="18" height="18"><path d="M8 5v14l11-7z"/></svg>`;
    });
  };
  _onPlayerPause = () => {
    isPlayingGlobal=false;
    grid.querySelectorAll(".spotify-card").forEach(c=>{
      c.querySelector('.spotify-play').innerHTML=`<svg viewBox="0 0 24 24" width="18" height="18"><path d="M8 5v14l11-7z"/></svg>`;
    });
  };
  _onPlayerEnded = () => {
    if (!queue.length) return;
    queueIndex = (queueIndex+1) % queue.length;
    const next = queue[queueIndex]; if (!next) return;
    activeBeatId = next.id; currentId = next.id;
    window.globalPlayer?.play(queueIndex, queue, "trending");
  };
  document.addEventListener("playerPlay", _onPlayerPlay);
  document.addEventListener("playerPause", _onPlayerPause);
  document.addEventListener("playerEnded", _onPlayerEnded);
}
