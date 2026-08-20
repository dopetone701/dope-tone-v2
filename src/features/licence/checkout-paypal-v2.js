// src/features/licence/checkout-paypal-v2.js - WORKING - BTN FIXED - OPENS CART MODAL IN SITE - NO REDIRECT
const PAYPAL_WORKER_URL = 'https://pay-pal-api.dopetone701.workers.dev';
const PROMO_API = 'https://emails-api.dopetone701.workers.dev';

const calcPro = (b) => Number((Number(b) * 49 / 19).toFixed(2));
const calcExclusive = (b) => Number((Number(b) * 199 / 19).toFixed(2));
let isCheckingOut = false;

const safeParse = (k,f)=>{ try{ const v=localStorage.getItem(k); return v?JSON.parse(v):f }catch{ return f } };
const safeStringify = (k,v)=>{ try{ localStorage.setItem(k, JSON.stringify(v)); return true; }catch{ return false; } };

function proToast(msg, type='info'){
  let el=document.getElementById('dt-pro-toast');
  if(!el){ el=document.createElement('div'); el.id='dt-pro-toast'; el.style.cssText=`position:fixed;bottom:28px;left:50%;transform:translateX(-50%);background:#0A1931;color:#FFFFFF;padding:14px 22px;border-radius:14px;z-index:9999999;font:600 13px/1.2 system-ui;border:1px solid rgba(255,255,255,0.1);box-shadow:0 10px 30px rgba(0,0,0,.6);max-width:90vw;`; document.body.appendChild(el); }
  el.style.borderColor = type==='error' ? '#FF1E3C' : type==='ok' ? '#1E90FF' : 'rgba(255,255,255,0.1)';
  el.textContent=msg; el.style.display='block'; el.style.opacity='1';
  clearTimeout(el._t); el._t=setTimeout(()=>{ el.style.opacity='0'; setTimeout(()=>el.style.display='none',300); },4000);
}

if(!document.getElementById('dt-checkout-paypal-style')){
  const s=document.createElement('style'); s.id='dt-checkout-paypal-style';
  s.textContent=`
    @keyframes dt-spin{0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}}
    .dt-gear{display:inline-block;animation:dt-spin .8s linear infinite;margin-left:8px}
    #checkoutBtn.is-loading, #goCheck.is-loading{opacity:.65!important;cursor:wait!important;pointer-events:none!important}
  `;
  document.head.appendChild(s);
}

export async function createPaypalCheckout(e){
  if(e){ e.preventDefault(); e.stopPropagation(); e.stopImmediatePropagation(); }
  if(isCheckingOut){ console.log('already checking out'); return; }

  // If cart modal function exists (we are on cart page), use it - opens in site
  if(window.DT_openCartPaypalModal){
    console.log('Triggering cart modal in-site');
    window.DT_openCartPaypalModal();
    return;
  }
  const goCheck = document.getElementById('goCheck');
  if(goCheck && window.location.hash.includes('cart')){
    console.log('Clicking goCheck in cart');
    goCheck.click();
    return;
  }

  // If on licence/beat page - add to cart then open cart modal in site
  let licences = safeParse('dopetone_licences', {});
  let cart = safeParse('dopetone_cart', []);
  
  // If cart exists, go to cart page where modal lives
  if(cart.length>0){
    location.hash='#/cart';
    setTimeout(()=>{
      if(window.DT_openCartPaypalModal) window.DT_openCartPaypalModal();
      else document.getElementById('goCheck')?.click();
    }, 800);
    return;
  }

  // No cart - need to handle licence selection from current page
  let beatsToCheckout = cart.filter(b => licences[String(b.id)] || licences[b.id]);
  if(beatsToCheckout.length===0){
    proToast('Select a licence first - add to cart','error');
    return;
  }

  let activePromoObj = safeParse('dopetone_active_promo', null);
  let activePromoCode = activePromoObj?.code || document.getElementById('promoInput')?.value?.toUpperCase() || '';
  let discountMult=1, promoValid=null, targetBeatId=activePromoObj?.beat_id||null;

  if(activePromoCode){
    try{
      const r=await fetch(`${PROMO_API}/api/promo/validate`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({code:activePromoCode})});
      const d=await r.json();
      if(d.valid){ promoValid=d; discountMult=(100-d.discount)/100; targetBeatId=d.locked_beat_id||targetBeatId||d.beat_id||null; }
      else { activePromoCode=''; localStorage.removeItem('dopetone_active_promo'); }
    }catch{}
  }

  let licencesToSend={};
  beatsToCheckout.forEach(b=>{
  const lic=licences[String(b.id)]||licences[b.id]; if(!lic) return;
  let price=Number(lic.price)||0;
  const base=Number(b.price)||Number(b.basic_price)||19;
  if(lic.name==='Pro') price=calcPro(base);
  if(lic.name==='Exclusive') price=calcExclusive(base);
  if(lic.name==='Basic' && !lic.price) price=base;
  if(lic.name==='FREE'||price<=0) return;
  if(targetBeatId && String(b.id)===String(targetBeatId) && promoValid) price=Number((price*discountMult).toFixed(2));
  // KEEP STABLE ID - title will be refreshed by backend from D1
  licencesToSend[b.id]={name:lic.name, price, title:b.title||`Beat ${b.id}`, is_promo_target: String(b.id)===String(targetBeatId), stable_id: parseInt(b.id)};
});


  if(!Object.keys(licencesToSend).length){ proToast('No paid licences','error'); return; }

  isCheckingOut=true;
  const btn = document.getElementById('checkoutBtn');
  const orig = btn ? btn.innerHTML : '';
  if(btn){ btn.disabled=true; btn.classList.add('is-loading'); btn.innerHTML=`Opening Vault Checkout <span class="dt-gear">⚙️</span>`; }

  const pendingPayload={ timestamp:Date.now(), beats:beatsToCheckout, licences:licencesToSend, promo_code:activePromoCode||null, promo_beat_id:targetBeatId, discount_applied:promoValid?.discount||0, user_id:localStorage.getItem('dopetone_user_id')||'anonymous' };
  safeStringify('dopetone_pending_checkout', pendingPayload);

  try{
    const res=await fetch(`${PAYPAL_WORKER_URL}/create-paypal-order`,{
      method:'POST',headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ licences:licencesToSend, cart:beatsToCheckout, mode:'sdk', promo_code:activePromoCode||null, promo_beat_id:targetBeatId, user_id:pendingPayload.user_id })
    });
    const data=await res.json();
    if(!res.ok) throw new Error(data.error||'Worker error');

    const orderId = data.id || data.orderID || data.orderId;
    if(!orderId){
      // If backend still returns url, extract token but DO NOT REDIRECT
      if(data.url){
        const u=new URL(data.url);
        const token=u.searchParams.get('token');
        if(token){
          proToast('Opening PayPal in vault...','ok');
          location.hash='#/cart';
          setTimeout(()=>{ window.DT_openCartPaypalModal?.() || document.getElementById('goCheck')?.click(); }, 800);
          if(btn){ btn.disabled=false; btn.classList.remove('is-loading'); btn.innerHTML=orig; }
          isCheckingOut=false;
          return;
        }
      }
      throw new Error('No order ID from backend - check worker is in sdk mode');
    }

    if(activePromoCode) localStorage.setItem('dopetone_pending_promo_use', activePromoCode);
    
    // SUCCESS - now open cart modal in site with this orderId
    if(btn){ btn.disabled=false; btn.classList.remove('is-loading'); btn.innerHTML=orig; }
    isCheckingOut=false;

    // If cart modal already loaded, open it directly
    if(window.DT_openCartPaypalModal || document.getElementById('dt-paypal-modal')){
      if(window.DT_openCartPaypalModal) window.DT_openCartPaypalModal();
      else {
        const modal=document.getElementById('dt-paypal-modal');
        if(modal) modal.classList.add('is-open');
      }
      // Store orderId for cart to use
      window.__DT_LAST_PAYPAL_ORDER__ = orderId;
      window.dispatchEvent(new CustomEvent('dt_open_paypal_modal', {detail:{orderId}}));
    } else {
      // Go to cart where your modal lives - stays in site
      location.hash='#/cart';
      window.__DT_LAST_PAYPAL_ORDER__ = orderId;
      setTimeout(()=>{
        if(window.DT_openCartPaypalModal) window.DT_openCartPaypalModal();
        else document.getElementById('goCheck')?.click();
      }, 900);
    }

  }catch(err){
    proToast(`Checkout failed: ${err.message}`,'error');
    if(btn){ btn.disabled=false; btn.classList.remove('is-loading'); btn.innerHTML=orig||'Checkout'; }
    isCheckingOut=false;
  }
}

export function setupCheckout(){
  if(window.__dt_checkout_paypal_setup) return;
  window.__dt_checkout_paypal_setup=true;
  console.log('PayPal V2 setup - btn fixed');

  // Bind to BOTH buttons - checkoutBtn (licence) and goCheck (cart)
  const bindBtn = (id)=>{
    const el=document.getElementById(id);
    if(!el || el.dataset.paypalBound) return;
    el.dataset.paypalBound='1';
    el.addEventListener('click', createPaypalCheckout, {capture:true});
    console.log(`Bound ${id}`);
  };

  // Immediate bind
  bindBtn('checkoutBtn');
  bindBtn('goCheck');

  // Delegate for dynamically created buttons
  document.addEventListener('click', (e)=>{
    const btn = e.target.closest('#checkoutBtn, #goCheck');
    if(!btn) return;
    // If it's goCheck, let cart.js handle it first (it has its own modal)
    if(btn.id==='goCheck' && window.DT_openCartPaypalModal && window.location.hash.includes('cart')){
      return; // cart.js already handles it
    }
    if(btn.id==='checkoutBtn'){
      e.preventDefault();
      e.stopPropagation();
      createPaypalCheckout(e);
    }
  }, true);

  // Watch for cart mount (cart.js renders goCheck later)
  const observer = new MutationObserver(()=>{
    bindBtn('checkoutBtn');
    bindBtn('goCheck');
  });
  observer.observe(document.body, {childList:true, subtree:true});
}

window.createPaypalCheckout = createPaypalCheckout;
window.createStripeCheckout = createPaypalCheckout;
window.setupCheckout = setupCheckout;
export const createStripeCheckout = createPaypalCheckout;

if(document.readyState === 'loading'){ document.addEventListener('DOMContentLoaded', setupCheckout, {once:true}); }
else { setupCheckout(); }

// Auto setup every time hash changes (for cart page)
window.addEventListener('hashchange', ()=>{ setTimeout(setupCheckout, 300); });

