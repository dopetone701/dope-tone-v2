// src/features/cart/cart.js - V8.7 PRO LIGHT - SINGLE D1 CALL + CACHE
const PLAY_SVG = `<svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20"><path d="M8 5.14v13.72L19 12 8 5.14z"/></svg>`;
const PAUSE_SVG = `<svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20"><path d="M7 5h4v14H7V5zm6 0h4v14h-4V5z"/></svg>`;

const IMAGE_BASE = new URL("../../../public/images", import.meta.url).href;
const img = (p) => `${IMAGE_BASE}/${p}`;

const STATS_API="https://dopetone-stats.dopetone701.workers.dev";
const PAYPAL_WORKER_URL = 'https://pay-pal-api.dopetone701.workers.dev';
const PROMO_API = 'https://emails-api.dopetone701.workers.dev';
const trackEvent=(id,type)=>{if(!id)return;fetch(`${STATS_API}/api/stats/event`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({beatId:parseInt(id),eventType:type}),keepalive:true}).catch(()=>{})};

const esc = s => String(s??'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#039;');
const fixRaw = v => { let p=Number(v); if(!Number.isFinite(p)) return 9.00; if(p>=1000) p/=100; return Number(p.toFixed(2)); };
const fix = v => { let p=Number(v); if(!Number.isFinite(p)) return 9.00; return Number(p.toFixed(2)); };
const LICENCES = ["free","basic","pro","exclusive"];

function getCart(){ try{return JSON.parse(localStorage.getItem("dopetone_cart")||"[]")}catch{return []} }
function saveCart(c){ localStorage.setItem("dopetone_cart", JSON.stringify(c)); window.dispatchEvent(new CustomEvent("cc_cart_updated",{detail:{count:c.length}})); }
function getBeats(){ return window.__BEATS__ || window.DTStore?.beats || []; }
function getBasicPrice(beat){ const raw = beat.price?? beat.base_price?? beat.basic_price?? 9.00; return fixRaw(raw); }
function licencePrice(beat, lic){
  lic = String(lic).toLowerCase();
  const basic = getBasicPrice(beat);
  if(lic==="free") return 0;
  if(lic==="basic") return fix(basic);
  if(lic==="pro") return fix(basic * 2.2);
  if(lic==="exclusive") return fix(Math.max(basic * 10, 149));
  return fix(basic);
}
const safeParse = (k,f)=>{ try{ const v=localStorage.getItem(k); return v?JSON.parse(v):f }catch{ return f } };
const safeStringify = (k,v)=>{ try{ localStorage.setItem(k, JSON.stringify(v)); return true; }catch{ return false; } };

// LIGHT CACHE - single call only
const priceCache = new Map();
async function fetchTruePriceFromD1(id){
  const sid = String(id);
  if(priceCache.has(sid)) return priceCache.get(sid);
  // 1 call only - D1 god
  try{
    const r = await fetch(`${PAYPAL_WORKER_URL}/beat?id=${encodeURIComponent(sid)}`, {cache:'no-store'});
    if(r.ok){
      const d = await r.json();
      const beat = d.beat || d.data || d;
      if(beat && (beat.price || beat.basic_price)){
        priceCache.set(sid, beat);
        return beat;
      }
    }
  }catch{}
  // fallback to live beats (no network)
  const fb = getBeats().find(b=> String(b.id)===sid);
  if(fb){ priceCache.set(sid, fb); return fb; }
  return null;
}

// === PAYPAL MODAL ===
let isCheckingOut = false;
let paypalSdkLoaded = false;
let cachedClientId = '';
function proToast(msg, type='info'){
  let el=document.getElementById('dt-pro-toast');
  if(!el){ el=document.createElement('div'); el.id='dt-pro-toast'; el.style.cssText=`position:fixed;bottom:28px;left:50%;transform:translateX(-50%);background:#0A1931;color:#FFFFFF;padding:14px 22px;border-radius:14px;z-index:9999999;font:600 13px/1.2 system-ui;border:1px solid rgba(255,255,255,0.1);box-shadow:0 10px 30px rgba(0,0,0,.6);max-width:90vw;`; document.body.appendChild(el); }
  el.style.borderColor = type==='error'?'#FF1E3C' : type==='ok'?'#1E90FF' : 'rgba(255,255,255,0.1)';
  el.textContent=msg; el.style.display='block'; el.style.opacity='1'; clearTimeout(el._t); el._t=setTimeout(()=>{ el.style.opacity='0'; setTimeout(()=>el.style.display='none',300); },4000);
}
function ensureStyle(){
  if(document.getElementById('dt-cart-paypal-style')) return;
  const s=document.createElement('style'); s.id='dt-cart-paypal-style';
  s.textContent=`#dt-paypal-modal{position:fixed;inset:0;z-index:9999998;display:none}#dt-paypal-modal.is-open{display:flex;align-items:center;justify-content:center}#dt-paypal-backdrop{position:absolute;inset:0;background:rgba(5,10,20,0.92);backdrop-filter:blur(12px)}#dt-paypal-sheet{position:relative;width:92%;max-width:520px;background:linear-gradient(180deg,#0A1931 0%,#050A14 100%);border:1px solid rgba(255,255,255,0.1);border-radius:20px;padding:22px;box-shadow:0 20px 60px rgba(0,0,0,.8);max-height:90vh;overflow-y:auto}#dt-paypal-sheet h3{margin:0 0 8px;font:700 18px/1.2 system-ui;color:#FFFFFF}#dt-paypal-items{border:1px solid rgba(255,255,255,0.1);border-radius:12px;padding:10px 12px;margin-bottom:14px;background:#0a122a}#dt-paypal-items div{display:flex;justify-content:space-between;font:600 12px system-ui;color:#E5E7EB;padding:6px 0;border-bottom:1px dashed rgba(255,255,255,0.1)}#dt-paypal-items div:last-child{border:none}#dt-paypal-close{position:absolute;top:12px;right:12px;background:rgba(255,255,255,0.08);border:1px solid rgba(255,255,255,0.1);color:#9CA3AF;width:30px;height:30px;border-radius:50%;cursor:pointer}#paypal-button-container{min-height:50px;margin-bottom:10px}#paypal-card-container{min-height:50px}`;
  document.head.appendChild(s);
}
function ensureModal(){
  ensureStyle();
  if(document.getElementById('dt-paypal-modal')) return document.getElementById('dt-paypal-modal');
  const m=document.createElement('div'); m.id='dt-paypal-modal';
  m.innerHTML=`<div id="dt-paypal-backdrop"></div><div id="dt-paypal-sheet"><button id="dt-paypal-close">✕</button><h3>Checkout</h3><div style="font:500 12px/1.4 system-ui;color:#9CA3AF;margin-bottom:14px">Secure PayPal</div><div id="dt-paypal-items"></div><div id="dt-paypal-loader" style="text-align:center;padding:20px;color:#9CA3AF;font:600 12px system-ui">Loading secure payment...</div><div id="paypal-button-container"></div><div id="paypal-card-container"></div></div>`;
  document.body.appendChild(m);
  m.querySelector('#dt-paypal-backdrop').onclick=closeModal;
  m.querySelector('#dt-paypal-close').onclick=closeModal;
  return m;
}
function closeModal(){ const m=document.getElementById('dt-paypal-modal'); if(m){ m.classList.remove('is-open'); const a=document.getElementById('paypal-button-container'); if(a) a.innerHTML=''; const b=document.getElementById('paypal-card-container'); if(b) b.innerHTML=''; } isCheckingOut=false; }
async function loadSdk(){
  if(paypalSdkLoaded && window.paypal) return true;
  if(!cachedClientId){ try{ const r=await fetch(`${PAYPAL_WORKER_URL}/paypal-client-id`); const d=await r.json(); cachedClientId=d.clientId||d.client_id||''; if(!cachedClientId || cachedClientId.length<20) throw new Error('bad'); }catch{ proToast('PayPal config error','error'); return false; } }
  return new Promise((res,rej)=>{ document.querySelectorAll('script[src*="paypal.com/sdk/js"]').forEach(s=>s.remove()); const s=document.createElement('script'); s.src=`https://www.paypal.com/sdk/js?client-id=${cachedClientId}&currency=USD&intent=capture&components=buttons&enable-funding=card`; s.onload=()=>{ paypalSdkLoaded=true; res(true); }; s.onerror=rej; document.head.appendChild(s); });
}
async function getDominantColor(url){ return new Promise(resolve=>{ const im=new Image(); im.crossOrigin="anonymous"; im.src=url; im.onload=()=>{ try{ const canvas=document.createElement("canvas"), ctx=canvas.getContext("2d",{willReadFrequently:true}); canvas.width=64; canvas.height=64; ctx.drawImage(im,0,0,64,64); const data=ctx.getImageData(0,0,64,64).data; let r=0,g=0,b=0,n=0; for(let i=0;i<data.length;i+=16){ const rr=data[i], gg=data[i+1], bb=data[i+2], bright=rr+gg+bb; if(bright<30||bright>700) continue; r+=rr; g+=gg; b+=bb; n++; } if(!n) return resolve({r:14,g:28,b:56}); resolve({r:Math.round(r/n), g:Math.round(g/n), b:Math.round(b/n)}); }catch{ resolve({r:14,g:28,b:56}); } }; im.onerror=()=>resolve({r:14,g:28,b:56}); setTimeout(()=>resolve({r:14,g:28,b:56}),1500); }); }
export async function renderCart(){ if(!document.getElementById("cart-css")){ const l=document.createElement("link"); l.id="cart-css"; l.rel="stylesheet"; l.href="/src/features/cart/cart.css"; document.head.appendChild(l); } return `<div id="cartMount"></div>`; }
export async function initCart(){
  const mount=document.getElementById("cartMount"); if(!mount) return;
  function syncPlayIcons(){ const audio=document.querySelector("audio")||window.__DT_AUDIO__; const idx=window.__CURRENT_INDEX__; const all=getBeats(); document.querySelectorAll(".c-card").forEach(card=>{ const id=card.dataset.id; const playing = all[idx] && String(all[idx].id)===String(id) && audio &&!audio.paused; card.classList.toggle("playing",!!playing); const btn=card.querySelector(".c-play"); if(btn) btn.innerHTML = playing? PAUSE_SVG : PLAY_SVG; }); }
  async function checkoutWithPaypal(){
    if(isCheckingOut) return;
    let cart = getCart();
    if(!cart.length){ proToast("Cart empty","error"); return; }
    // LIGHT: parallel fetch, 1 call per beat, cached
    const freshList = await Promise.all(cart.map(b=> fetchTruePriceFromD1(b.id)));
    freshList.forEach((trueBeat,i)=>{ if(trueBeat && trueBeat.price){ cart[i].price = trueBeat.price; cart[i].basic_price = trueBeat.basic_price||trueBeat.base_price||trueBeat.price; } });
    saveCart(cart);

    let licences = {}; let hasPaid = false;
    cart.forEach(b=>{ const lic = (b.selected_licence||'basic').toLowerCase(); const price = licencePrice(b, lic); if(price>0) hasPaid=true; licences[String(b.id)] = { name: lic.toUpperCase(), price, title: b.title||`Beat ${b.id}` }; licences[b.id] = { name: lic.toUpperCase(), price, title: b.title||`Beat ${b.id}` }; });
    if(!hasPaid){ proToast("Free beats don't need checkout","ok"); return; }
    let activePromoObj = safeParse('dopetone_active_promo', null); let activePromoCode = activePromoObj?.code || document.getElementById('promoInput')?.value?.toUpperCase() || ''; let discountMult = 1; let promoValid = null; let targetBeatId = activePromoObj?.beat_id || null;
    if(activePromoCode){ try{ const r=await fetch(`${PROMO_API}/api/promo/validate`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({code:activePromoCode})}); const d=await r.json(); if(d.valid){ promoValid=d; discountMult=(100-d.discount)/100; targetBeatId=d.locked_beat_id || targetBeatId || d.beat_id || null; } else { activePromoCode=''; localStorage.removeItem('dopetone_active_promo'); } }catch{} }
    let licencesToSend = {}; cart.forEach(b=>{ const lic = licences[String(b.id)] || licences[b.id]; if(!lic || lic.price<=0) return; let finalPrice = Number(lic.price); const isTarget = targetBeatId && String(b.id)===String(targetBeatId); if(isTarget && promoValid){ finalPrice = Number((finalPrice * discountMult).toFixed(2)); } licencesToSend[b.id] = {...lic, price: finalPrice, is_promo_target: isTarget}; });
    if(!Object.keys(licencesToSend).length){ proToast("No paid licences","error"); return; }
    const pendingPayload = { timestamp: Date.now(), beats: cart, licences: licencesToSend, promo_code: activePromoCode||null, promo_beat_id: targetBeatId, discount_applied: promoValid?.discount||0, user_id: localStorage.getItem("dopetone_user_id")||"anonymous" };
    safeStringify("dopetone_pending_checkout", pendingPayload);
    let history = safeParse("dopetone_history", []); cart.forEach(b=>{ const lic = licencesToSend[b.id]; if(!lic) return; if(!history.find(h=> String(h.beat_id)===String(b.id) && h.license_type===lic.name)){ history.push({ beat_id: parseInt(b.id), beat_title: b.title||'', license_type: lic.name, amount: Math.round(Number(lic.price)*100), timestamp: Date.now(), user_id: pendingPayload.user_id, promo_code: activePromoCode||null }); } });
    safeStringify("dopetone_history", history); safeStringify("dopetone_licences", licencesToSend);
    isCheckingOut=true; const modal=ensureModal(); const itemsEl=document.getElementById('dt-paypal-items'); let total=0; let html=''; Object.values(licencesToSend).forEach(l=>{ total+=Number(l.price); html+=`<div><span>${esc(l.title)} • ${l.name}${l.is_promo_target?` (${promoValid.discount}% OFF)`:''}</span><span>$${Number(l.price).toFixed(2)}</span></div>`; }); html+=`<div style="color:#FF1E3C;font-weight:800"><span>Total</span><span>$${total.toFixed(2)}${activePromoCode?` • ${activePromoCode}`:''}</span></div>`; itemsEl.innerHTML=html; modal.classList.add('is-open'); document.getElementById('dt-paypal-loader').style.display='block'; document.getElementById('paypal-button-container').innerHTML=''; document.getElementById('paypal-card-container').innerHTML='';
    try{
      const sdkOk = await loadSdk(); if(!sdkOk) throw new Error('SDK failed'); document.getElementById('dt-paypal-loader').style.display='none'; const customerEmail = localStorage.getItem("dopetone_user_email")||"";
      window.paypal.Buttons({ fundingSource: window.paypal.FUNDING.PAYPAL, style:{ layout:'vertical', color:'white', shape:'pill', label:'paypal', height:45, tagline:false }, createOrder: async ()=>{ const res=await fetch(`${PAYPAL_WORKER_URL}/create-paypal-order`,{ method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ licences: licencesToSend, cart, user_id: pendingPayload.user_id, email: customerEmail, mode:'sdk', intent:'CAPTURE' }) }); const data=await res.json(); if(!res.ok) throw new Error(data.error||'Failed'); return data.id || data.orderID; }, onApprove: async (data)=>{ proToast("Payment approved...","ok"); try{ await fetch(`${PAYPAL_WORKER_URL}/capture-paypal-order`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({ orderID:data.orderID })}); }catch{} localStorage.removeItem('dopetone_cart'); closeModal(); location.hash=`#/licence/success?orderID=${data.orderID}`; }, onError:(err)=>{ proToast(`PayPal: ${err?.message||err}`,"error"); isCheckingOut=false; }, onCancel:()=>{ closeModal(); } }).render('#paypal-button-container');
      window.paypal.Buttons({ fundingSource: window.paypal.FUNDING.CARD, style:{ layout:'vertical', color:'black', shape:'pill', label:'pay', height:45 }, createOrder: async ()=>{ const res=await fetch(`${PAYPAL_WORKER_URL}/create-paypal-order`,{ method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ licences: licencesToSend, cart, user_id: pendingPayload.user_id, email: customerEmail, mode:'sdk' }) }); const data=await res.json(); return data.id || data.orderID; }, onApprove: async (data)=>{ proToast("Card approved...","ok"); try{ await fetch(`${PAYPAL_WORKER_URL}/capture-paypal-order`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({ orderID:data.orderID })}); }catch{} localStorage.removeItem('dopetone_cart'); closeModal(); location.hash=`#/licence/success?orderID=${data.orderID}`; }, onError:(err)=>{ proToast(`Card: ${err?.message||err}`,"error"); isCheckingOut=false; }, onCancel:()=>{ closeModal(); } }).render('#paypal-card-container');
    }catch(err){ proToast(`Checkout failed: ${err.message}`,"error"); closeModal(); }
  }

  window.DT_openCartPaypalModal = checkoutWithPaypal;
  window.DT_cart_checkout = checkoutWithPaypal;

  function updateSummary(){
    const cur=getCart();
    let total=0; cur.forEach(b=>{ total+=licencePrice(b,b.selected_licence||'basic'); });
    const h1=document.querySelector(".cart-head h1"); if(h1) h1.innerHTML=`Cart <span>${cur.length} beats</span>`;
    const sum=document.getElementById("cartSummary"); if(!sum) return;
    sum.innerHTML=`<div class="sum-box"><h3>Order Summary</h3><div class="sum-row"><span>Beats (${cur.length})</span><span>$${total.toFixed(2)}</span></div><div class="sum-row"><span>Fees</span><span style="color:#2ECC71">$0.00</span></div><div class="sum-div"></div><div class="sum-row big"><span>Total</span><span>$${total.toFixed(2)}</span></div><button class="sum-check" id="goCheck">Checkout • $${total.toFixed(2)}</button><div class="sum-safe">🔒 Secure PayPal • Instant Delivery</div></div>`;
    document.getElementById("goCheck").onclick=()=>{ if(total===0){ location.hash="#/beats"; return; } cur.forEach(b=> trackEvent(b.id,"checkout")); checkoutWithPaypal(); };
  }
  function drawEmpty(){ mount.innerHTML=`<div class="cart-root"><div class="cart-bg"></div><div class="cart-wrap empty"><img src="${img("cart-empty.png")}" class="empty-img" alt="empty" /><h2>Your Cart Is Empty</h2><p>Add some fire. Beats you add will live here.</p><button class="btn-red" onclick="location.hash='#/beats'">Browse Beats</button></div></div>`; }
  function drawList(){
    const cart=getCart();
    if(cart.length===0){ drawEmpty(); return; }
    mount.innerHTML=`<div class="cart-root"><div class="cart-bg"></div><div class="cart-wrap"><div class="cart-head"><h1>Cart <span>${cart.length} beats</span></h1><button id="clearCart" class="btn-ghost">Clear all</button></div><div style="background:#111c36;border:1px solid rgba(255,255,255,.1);border-radius:12px;padding:12px;display:flex;gap:8px;margin-bottom:12px"><input id="promoInput" placeholder="Promo code - 1 track only" style="flex:1;background:#050A14;border:1px solid #222;color:#fff;padding:10px;border-radius:8px" /><button id="applyPromoBtn" style="padding:10px 16px;border-radius:8px;background:#1a1a1a;color:#fff;border:1px solid #333;cursor:pointer;font-weight:700">Apply</button><div id="promoStatus" style="font-size:12px;color:#888;align-self:center"></div></div><div class="cart-list" id="cartList"></div><div class="cart-summary" id="cartSummary"></div></div></div>`;
    const list=document.getElementById("cartList"); const promoInput=document.getElementById('promoInput'); const promoStatus=document.getElementById('promoStatus'); const applyBtn=document.getElementById('applyPromoBtn');
    const hashQuery = window.location.hash.split('?')[1]||''; const q=new URLSearchParams(hashQuery||location.search); const armedId=q.get('id'); const armedPromo=(q.get('promo')||q.get('code')||'').toUpperCase();
    if(armedPromo){ promoInput.value=armedPromo; localStorage.setItem('dopetone_active_promo', JSON.stringify({code:armedPromo, beat_id:armedId||localStorage.getItem('dopetone_armed_beat')})); if(armedId) localStorage.setItem('dopetone_armed_beat', armedId); } else { const obj=safeParse('dopetone_active_promo',null); if(obj?.code) promoInput.value=obj.code; }
    async function validatePromo(code){ if(!code){ promoStatus.textContent=''; return null; } try{ const r=await fetch(`${PROMO_API}/api/promo/validate`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({code})}); const d=await r.json(); if(d.valid){ promoStatus.textContent=`🔥 ${code} - ${d.discount}% OFF on 1 track`; promoStatus.style.color='#1E90FF'; return d; } else { promoStatus.textContent=`Invalid: ${d.error}`; promoStatus.style.color='#FF1E3C'; return null; } }catch{ promoStatus.textContent='Check failed'; return null; } }
    if(promoInput.value) validatePromo(promoInput.value.toUpperCase());
    applyBtn.onclick=async()=>{ const code=promoInput.value.trim().toUpperCase(); if(!code){ promoStatus.textContent='Enter code'; return; } const d=await validatePromo(code); if(d){ localStorage.setItem('dopetone_active_promo', JSON.stringify({code, beat_id: d.locked_beat_id||d.beat_id})); proToast(`Promo ${code} armed`,"ok"); } };
    cart.forEach(beat=>{
      if(!beat.selected_licence) beat.selected_licence="basic";
      const curPrice = licencePrice(beat, beat.selected_licence);
      const basic = getBasicPrice(beat);
      const card=document.createElement("div"); card.className="c-card"; card.dataset.id=beat.id;
      card.innerHTML=`<div class="c-card-bg" id="bg-${beat.id}"></div><div class="c-inner"><div class="c-cover" data-play><img src="${esc(beat.cover_url||'/images/studio.jpg')}" crossorigin="anonymous" /><div class="c-play">${PLAY_SVG}</div></div><div class="c-info"><div class="c-topline"><div class="c-title">${esc(beat.title)}</div><button class="c-x" data-remove>✕</button></div><div class="c-meta">${esc(beat.genre||'Genre')} • ${beat.bpm||'--'} BPM • ${esc(beat.key||'--')} • Basic $${basic.toFixed(2)}</div><div class="c-pills">${LICENCES.map(l=>{ const p=licencePrice(beat,l); return `<button class="c-pill ${beat.selected_licence===l?'on':''}" data-lic="${l}">${l.toUpperCase()} <i>${l==='free'?'FREE':'$'+p.toFixed(2)}</i></button>`}).join('')}</div><div class="c-bottom"><div class="c-price" data-price>$${curPrice.toFixed(2)}</div><button class="c-lic" data-licview>View Licence</button></div></div></div>`;
      getDominantColor(beat.cover_url).then(col=>{ const bg=card.querySelector(".c-card-bg"); if(bg){ bg.style.background = `radial-gradient(130% 130% at 15% 0%, rgba(${col.r},${col.g},${col.b},0.85) 0%, rgba(${col.r},${col.g},${col.b},0.45) 30%, rgba(${col.r},${col.g},${col.b},0.18) 55%, rgba(10,16,32,0.96) 82%)`; } card.style.borderColor = `rgba(${col.r},${col.g},${col.b},0.32)`; });
      card.querySelector("[data-play]").onclick=()=>{ const all=getBeats(); let idx=all.findIndex(b=>String(b.id)===String(beat.id)); if(idx===-1){ all.unshift(beat); window.__BEATS__=all; idx=0; } const audio=document.querySelector("audio")||window.__DT_AUDIO__; const isPlaying = all[window.__CURRENT_INDEX__] && String(all[window.__CURRENT_INDEX__].id)===String(beat.id) && audio &&!audio.paused; if(isPlaying){ audio.pause(); window.globalPlayer?.pause?.(); } else { window.globalPlayer?.play?.(idx, all, "cart"); trackEvent(beat.id,"play"); } };
      card.querySelector("[data-remove]").onclick=()=>{ const newCart=getCart().filter(b=>String(b.id)!==String(beat.id)); saveCart(newCart); card.style.transition="all.18s"; card.style.transform="scale(.97)"; card.style.opacity="0"; setTimeout(()=>{ card.remove(); if(getCart().length===0) drawEmpty(); else updateSummary(); },180); };
      card.querySelectorAll("[data-lic]").forEach(pill=>{
        pill.onclick=async()=>{
          const newLic=pill.dataset.lic;
          pill.innerHTML = `${newLic.toUpperCase()} <i>⏳</i>`;
          const trueBeat = await fetchTruePriceFromD1(beat.id);
          const allCart=getCart(); const item=allCart.find(b=>String(b.id)===String(beat.id)); if(!item) return;
          if(trueBeat && trueBeat.price){ item.price = trueBeat.price; item.basic_price = trueBeat.basic_price||trueBeat.base_price||trueBeat.price; }
          item.selected_licence=newLic; saveCart(allCart);
          const fb = trueBeat || item;
          card.querySelectorAll(".c-pill").forEach(p=>{ const l=p.dataset.lic; p.classList.toggle("on", l===newLic); p.innerHTML = `${l.toUpperCase()} <i>${l==='free'?'FREE':'$'+licencePrice(fb,l).toFixed(2)}</i>`; });
          card.querySelector("[data-price]").textContent=`$${licencePrice(fb,newLic).toFixed(2)}`;
          card.querySelector(".c-meta").textContent=`${fb.genre||'Genre'} • ${fb.bpm||'--'} BPM • ${fb.key||'--'} • Basic $${getBasicPrice(fb).toFixed(2)}`;
          updateSummary();
        };
      });
      card.querySelector("[data-licview]").onclick=async()=>{
        const mod = await import("../licence/licence.js");
        const trueBeat = await fetchTruePriceFromD1(beat.id);
        const freshCart = getCart(); const freshItem = freshCart.find(b=>String(b.id)===String(beat.id)); const currentLic = (freshItem?.selected_licence || beat.selected_licence || 'basic').toLowerCase();
        mod.openLicencePopup(trueBeat||beat, currentLic, (newLic)=>{ const fb = trueBeat || beat; const fc=getCart(); const it=fc.find(b=>String(b.id)===String(beat.id)); if(it){ it.selected_licence=newLic; if(fb.price) it.price=fb.price; saveCart(fc); } card.querySelectorAll(".c-pill").forEach(p=>{ const l=p.dataset.lic; p.classList.toggle("on", l===newLic); p.innerHTML=`${l.toUpperCase()} <i>${l==='free'?'FREE':'$'+licencePrice(fb,l).toFixed(2)}</i>`; }); card.querySelector("[data-price]").textContent=`$${licencePrice(fb,newLic).toFixed(2)}`; updateSummary(); });
      };
      list.appendChild(card);
    });
    updateSummary(); syncPlayIcons();
    document.getElementById("clearCart").onclick=()=>{ if(confirm("Clear cart?")){ saveCart([]); drawEmpty(); } };
  }
  drawList();
  document.addEventListener("playerPlay", syncPlayIcons);
  document.addEventListener("playerPause", syncPlayIcons);
}
