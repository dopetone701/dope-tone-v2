// src/core/menu-armburger.js - FIXED - SINGLE CART + D1 DISPATCH - NO ROUTE BREAK
const STATS_API = 'https://dopetone-stats.dopetone701.workers.dev';

export function initArmburger(){
  const btn=document.getElementById("armburgerBtn");
  const menu=document.getElementById("armburgerMenu");
  if(!btn||!menu) return;
  btn.onclick=e=>{e.stopPropagation();menu.classList.toggle("active");};
  document.addEventListener("click",e=>{
    if(!e.target.closest("#armburgerMenu")&&!e.target.closest("#armburgerBtn")) menu.classList.remove("active");
  });
}

export function closeAllMenus(){
  document.querySelectorAll(".dt-row-menu.active,.pyramid-menu.active").forEach(m=>m.classList.remove("active"));
  document.querySelectorAll(".wave-row,.yt-track").forEach(r=>r.style.zIndex="1");
  document.getElementById("menuOverlay")?.classList.remove("active");
}

export function openMenuOverlay(){
  document.getElementById("menuOverlay")?.classList.add("active");
}

function getLikesIdsSafe(){
  try{
    const raw = localStorage.getItem("dopetone_likes");
    if(!raw) return [];
    const d = JSON.parse(raw);
    if(Array.isArray(d)) return d.map(String);
    if(d && typeof d === 'object') return Object.keys(d).map(String);
    return [];
  }catch{return [];}
}
function isLikedSafe(id){
  return getLikesIdsSafe().includes(String(id));
}

function getAnon(){
  let a = localStorage.getItem('dt_anon_id') || localStorage.getItem('dopetone_user_id');
  if(!a){
    a='anon_'+Math.random().toString(36).slice(2)+Date.now().toString(36);
    localStorage.setItem('dt_anon_id', a);
  }
  return a;
}

function addToCartBlink(beat){
  try{
    const anon = getAnon();
    const cartKey = `dopetone_cart_${anon}`;
    const fixRaw = v => { let p=Number(v); if(!Number.isFinite(p)) return 9.00; if(p>=1000) p/=100; return Number(p.toFixed(2)); };

    let cart = [];
    try{
      cart = JSON.parse(localStorage.getItem(cartKey) || localStorage.getItem("dopetone_cart") || "[]");
    }catch{ cart = []; }

    const idx = cart.findIndex(b=> String(b.id)===String(beat.id));
    const basicPrice = fixRaw(beat.price?? beat.base_price?? 9.00);
    if(idx>=0){
      cart[idx].selected_licence = cart[idx].selected_licence || 'basic';
    } else {
      cart.push({...beat, selected_licence:'basic', licence:'basic', price: basicPrice, added_at: Date.now()});
    }

    localStorage.setItem(cartKey, JSON.stringify(cart));
    localStorage.setItem("dopetone_cart", JSON.stringify(cart)); // keep legacy for old cart page
    localStorage.setItem("dopetone_cart_count", String(cart.length));
    localStorage.setItem("dt_cart_changed", Date.now().toString());

    // DISPATCH TO CC + CART + PLAYLIST - NO BREAK
    window.dispatchEvent(new CustomEvent("cc:cartLive",{detail:{beatId: beat.id, action:'add', count: cart.length}}));
    window.dispatchEvent(new CustomEvent("cc_cart_updated",{detail:{count:cart.length, beatId: beat.id}}));
    window.dispatchEvent(new CustomEvent("cartUpdated",{detail:{beatId: beat.id, action:'add', count: cart.length}}));
    window.dispatchEvent(new Event('storage'));

    // D1 SINGLE TRUTH - with valid anon, no ghost
    fetch(`${STATS_API}/api/stats/event`,{
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body: JSON.stringify({
        beatId: parseInt(beat.id),
        beat_id: parseInt(beat.id),
        eventType:'cart_add',
        event_type:'cart_add',
        anon_id: anon,
        user_key: anon,
        user_id: anon
      })
    }).catch(()=>{});

    // BLINK 2s toast
    let toast = document.getElementById('dt-cart-blink');
    if(!toast){
      toast = document.createElement('div');
      toast.id = 'dt-cart-blink';
      toast.style.cssText = `position:fixed;bottom:90px;left:50%;transform:translateX(-50%);background:#fff;color:#000;padding:12px 18px;border-radius:99px;font:700 13px system-ui;z-index:9999999;box-shadow:0 10px 30px rgba(0,0,0,.4);transition:all.2s;`;
      document.body.appendChild(toast);
    }
    toast.textContent = `Added ${beat.title||'beat'} to cart ✓`;
    toast.style.opacity='1';
    toast.style.transform='translateX(-50%) translateY(0)';
    clearTimeout(toast._t);
    toast._t = setTimeout(()=>{
      toast.style.opacity='0';
      toast.style.transform='translateX(-50%) translateY(10px)';
    },2000);
  }catch(e){ console.error('cart blink fail', e); }
}

export function createDotsMenu(beat, handlers){
  const mode=String(beat.monetization_mode||beat.monetizationMode||"paid").toLowerCase();
  const liked=isLikedSafe(beat.id);
  const price=Number(beat.price>=1000?beat.price/100:beat.price||9.00).toFixed(2);
  const wrap=document.createElement("div");
  wrap.className="dt-dots-wrap pyramid-dots-wrap";
  wrap.innerHTML=`
    <button class="wave-dots pyramid-dots" type="button"><svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><circle cx="12" cy="5" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="12" cy="19" r="2"/></svg></button>
    <div class="pyramid-menu dt-row-menu">
      <button data-act="goto"><span>🎧</span> Go to beat</button>
      <button data-act="playlist"><span>➕</span> Add to playlist</button>
      <button data-act="like"><span>${liked?'❤️':'🤍'}</span> ${liked?'Unlike':'Like beat'}</button>
      <button data-act="share"><span>🔗</span> Share beat</button>
      ${mode!=="paid"?`<button data-act="download"><span>⬇️</span> Download</button>`:""}
      <button data-act="cart"><span>🛒</span> Add to cart</button>
      <button data-act="buy" class="dt-menu-buy"><span>💳</span> Buy • $${price}</button>
    </div>`;
  const btn=wrap.querySelector(".wave-dots");
  const menu=wrap.querySelector(".pyramid-menu");
  btn.onclick=e=>{
    e.stopPropagation();
    const was=menu.classList.contains("active");
    closeAllMenus();
    if(!was){
      menu.classList.add("active");
      wrap.closest(".wave-row,.yt-track,.pyramid-card")?.style&&(wrap.closest(".wave-row,.yt-track,.pyramid-card").style.zIndex="9999");
      openMenuOverlay();
      requestAnimationFrame(()=>{
        const r=menu.getBoundingClientRect();
        if(r.right>window.innerWidth-12){menu.style.left="auto";menu.style.right="0";menu.style.transform="none";}
        if(r.left<12){menu.style.left="0";menu.style.right="auto";menu.style.transform="none";}
        if(r.bottom>window.innerHeight-20){menu.style.top="auto";menu.style.bottom="38px";}
      });
    }
  };
  menu.onclick=async e=>{
    e.stopPropagation();
    const act=e.target.closest("button")?.dataset.act;
    if(!act) return;
    closeAllMenus();

    // ADD TO CART = BLINK ONLY, NO LICENCE
    if(act==="cart"){
      addToCartBlink(beat);
      return;
    }

    // BUY = LICENCE POPUP
    if(act==="buy"){
      const mod = await import("../features/licence/licence.js");
      mod.openLicencePopup(beat, beat.selected_licence||'basic');
      return;
    }

    handlers?.[act]?.(beat);
  };
  return wrap;
}
document.addEventListener("click",e=>{ if(!e.target.closest(".dt-dots-wrap")&&!e.target.closest(".pyramid-dots-wrap")) closeAllMenus(); });

