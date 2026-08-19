// src/features/beats/gridView.js - V6.2 - TRUE DNA + CART COUNT FIX - D1 ONLY
export function renderGridView(beats, deps = {}){
  const grid = document.getElementById("gridContainer");
  const list = document.getElementById("waveList");
  const sentinel = document.getElementById("beatsListSentinel");
  if(!grid) return;

  if(list){ list.style.display="none"; list.hidden=true; }
  if(sentinel) sentinel.style.display="none";

  grid.hidden=false;
  grid.style.display="grid";
// NEW - 3 cards on mobile
const isMobile = window.innerWidth <= 768;
grid.style.gridTemplateColumns = isMobile 
  ? "repeat(3, 1fr)" 
  : "repeat(auto-fill, minmax(210px, 1fr))";
grid.style.gap = isMobile ? "8px" : "18px";
  grid.style.gap="18px";
  grid.innerHTML="";

  const { downloadBeat = ()=>{}, buyBeat = ()=>{} } = deps;
  const PLAY_SVG = `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5.14v14l11-7-11-7z"/></svg>`;
  const PAUSE_SVG = `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M7 5h4v14H7V5zm6 0h4v14h-4V5z"/></svg>`;
  const DOTS_SVG = `<svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><circle cx="12" cy="5" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="12" cy="19" r="2"/></svg>`;

  function goToBeat(beat){
    if(!beat?.id) return;
    location.hash = `#/beat?id=${encodeURIComponent(beat.id)}`;
  }

  // ===== DNA CART - FIXED =====
  function getCart(){ try{return JSON.parse(localStorage.getItem("dopetone_cart")||"[]")}catch{return []} }
  function saveCart(c){
    localStorage.setItem("dopetone_cart", JSON.stringify(c));
    const count = c.length;
    document.querySelectorAll(".cart-count,#cartItems").forEach(el => el.textContent = String(count));
    window.dispatchEvent(new CustomEvent("cc_cart_updated", {detail:{count}}));
  }
  function fixPrice(v){
    let p = Number(v);
    if(!Number.isFinite(p)) return 29.99;
    if(p >= 1000) p/=100;
    return Number(p.toFixed(2));
  }

  const frag = document.createDocumentFragment();
  beats.forEach((beat,i)=>{
    const mode = String(beat.monetization_mode||"paid").toLowerCase();
    const isCurrent = window.__CURRENT_BEAT__ && String(window.__CURRENT_BEAT__.id)===String(beat.id);
    const audio = document.querySelector("audio") || window.__DT_AUDIO__;
    const isPlaying = isCurrent && audio &&!audio.paused;

    const card = document.createElement("div");
    card.className="featured-card arsenal-grid-card";
    card.dataset.beatId = String(beat.id);
    card.style.position="relative";
    card.style.top="auto";
    card.style.left="auto";
    card.style.transform="none";
    card.style.width="100%";
    card.style.opacity="1";
    card.style.cursor="pointer";
    if(isCurrent) card.classList.add("is-active","is-playing");

    card.innerHTML=`
      <div class="f-cover-wrap">
        <img src="${beat.cover_url}" loading="lazy">
        <button class="f-play">${isPlaying?PAUSE_SVG:PLAY_SVG}</button>
        <div class="dt-dots-wrap" style="position:absolute;top:8px;right:8px;z-index:3">
          <button class="wave-dots" type="button" style="width:32px;height:32px;border-radius:8px;border:1px solid rgba(255,255,255,.12);background:rgba(0,0,0,.55);color:#fff;display:grid;place-items:center;cursor:pointer;backdrop-filter:blur(6px)">${DOTS_SVG}</button>
          <div class="dt-row-menu" style="right:0;top:36px">
            <button data-act="goto">🎧 Go to beat</button>
            <button data-act="cart">🛒 Add to cart</button>
            <button data-act="buy">Buy • $${Number(beat.price||29).toFixed(2)}</button>
            <button data-act="share">🔗 Share</button>
          </div>
        </div>
      </div>
      <div class="f-content">
        <div class="f-title">${beat.title}</div>
        <div class="f-meta">${beat.genre} • ${beat.bpm} BPM</div>
        <div class="f-price">$${Number(beat.price||29).toFixed(2)}</div>
        <button class="f-buy ${mode==='free'?'is-free':''}">${mode==='free'?'Free Download':'Buy'}</button>
      </div>`;

    card.onclick = (e)=>{
      if(e.target.closest(".f-play,.f-buy,.dt-dots-wrap,.dt-row-menu")) return;
      goToBeat(beat);
    };

    const playBtn = card.querySelector(".f-play");
    playBtn.onclick=e=>{
      e.stopPropagation();
      const current = window.__CURRENT_BEAT__ && String(window.__CURRENT_BEAT__.id)===String(beat.id);
      const aud = document.querySelector("audio") || window.__DT_AUDIO__;
      if(current && aud &&!aud.paused){
        aud.pause();
        if(window.globalPlayer?.pause) window.globalPlayer.pause();
        playBtn.innerHTML = PLAY_SVG;
        card.classList.remove("is-playing");
        return;
      }
      window.__CURRENT_BEAT__=beat;
      if(window.globalPlayer?.play) window.globalPlayer.play(i,beats,"beats-v2");
    };

    card.querySelector(".f-buy").onclick=e=>{
      e.stopPropagation();
      mode==='free'?downloadBeat(beat,e.currentTarget):buyBeat(beat);
    };

    const dotsWrap = card.querySelector(".dt-dots-wrap");
    const dotsBtn = dotsWrap.querySelector(".wave-dots");
    const menu = dotsWrap.querySelector(".dt-row-menu");

    dotsBtn.onclick=e=>{
      e.stopPropagation();
      const was = menu.classList.contains("active");
      document.querySelectorAll(".dt-row-menu.active").forEach(m=>m.classList.remove("active"));
      if(!was) menu.classList.add("active");
    };

    menu.onclick=e=>{
      e.stopPropagation();
      const act = e.target.closest("button")?.dataset.act;
      if(!act) return;
      menu.classList.remove("active");
      if(act==="goto") goToBeat(beat);
      if(act==="cart"){
        let cart=getCart();
        if(!cart.some(c=>String(c.id)===String(beat.id))){
          cart.push({...beat, price: fixPrice(beat.price)});
          saveCart(cart);
          window.Auth?.showToast?.(`Added ${beat.title} to cart`);
          fetch("https://dopetone-stats.dopetone701.workers.dev/api/stats/event",{
            method:"POST",
            headers:{"Content-Type":"application/json"},
            body: JSON.stringify({beatId: Number(beat.id), eventType: "cart"}),
            keepalive:true
          }).catch(()=>{});
        } else {
          window.Auth?.showToast?.("Already in cart");
        }
      }
      if(act==="buy") buyBeat(beat);
      if(act==="share"){
        const url=`${location.origin}/#/beat?id=${encodeURIComponent(beat.id)}`;
        navigator.clipboard?.writeText(url).then(()=>window.Auth?.showToast?.("Link copied"));
      }
    };

    frag.appendChild(card);
  });
  grid.appendChild(frag);

  document.addEventListener("click", e=>{
    if(!e.target.closest(".dt-dots-wrap")) document.querySelectorAll(".dt-row-menu.active").forEach(m=>m.classList.remove("active"));
  });

  if(!grid.dataset.syncBound){
    grid.dataset.syncBound="1";
    document.addEventListener("playerPlay", e=>{
      const {index, listId} = e.detail||{};
      if(listId!=="beats-v2") return;
      grid.querySelectorAll(".f-play").forEach(b=>b.innerHTML=PLAY_SVG);
      grid.querySelectorAll(".arsenal-grid-card").forEach(c=>c.classList.remove("is-playing","is-active"));
      const activeBeat = beats[index];
      if(!activeBeat) return;
      const activeCard = grid.querySelector(`.arsenal-grid-card[data-beat-id="${activeBeat.id}"]`);
      if(activeCard){
        activeCard.classList.add("is-playing","is-active");
        const btn=activeCard.querySelector(".f-play");
        if(btn) btn.innerHTML=PAUSE_SVG;
      }
    });
    document.addEventListener("playerPause", ()=>{
      grid.querySelectorAll(".f-play").forEach(b=>b.innerHTML=PLAY_SVG);
      grid.querySelectorAll(".arsenal-grid-card").forEach(c=>c.classList.remove("is-playing"));
    });
    document.addEventListener("playerEnded", ()=>{
      grid.querySelectorAll(".f-play").forEach(b=>b.innerHTML=PLAY_SVG);
      grid.querySelectorAll(".arsenal-grid-card").forEach(c=>c.classList.remove("is-playing","is-active"));
    });
  }
}

export function renderListViewShow(){
  const grid=document.getElementById("gridContainer");
  const list=document.getElementById("waveList");
  const sentinel=document.getElementById("beatsListSentinel");
  if(grid){ grid.style.display="none"; grid.hidden=true; }
  if(list){ list.style.display="flex"; list.hidden=false; }
  if(sentinel) sentinel.style.display="block";
}
