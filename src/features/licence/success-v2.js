// features/licence/success-v2.js - SHELL COMPONENT VERSION OF YOUR SUCCESS.HTML - LOGIC KEPT
const PAYPAL_WORKER_URL = 'https://pay-pal-api.dopetone701.workers.dev';
const STATS_API = 'https://dopetone-stats.dopetone701.workers.dev';

const safeParse = (k,f)=>{ try{ const v=localStorage.getItem(k); return v?JSON.parse(v):f }catch{ return f } };
const shippedKey = (sid) => "dopetone_shipped_" + sid;

async function clearAllLocalHistory(sid, beatIds = []){
  try{
    const anon_id = localStorage.getItem('dopetone_anon_id') || 'anon';
    const userObj = safeParse('dopetone_user', null) || safeParse('user', null);
    const user_id = userObj?.id || localStorage.getItem('dopetone_user_id') || anon_id;
    const cartIds = safeParse("dopetone_cart", []).map(b=>parseInt(b.id)).filter(Boolean);
    const histIds = safeParse("dopetone_history", []).map(h=>parseInt(h.beat_id)).filter(Boolean);
    const passedIds = (beatIds||[]).map(n=>parseInt(n)).filter(Boolean);
    const allIds = [...new Set([...cartIds, ...histIds, ...passedIds])];
    if(allIds.length){
      await fetch(`${STATS_API}/api/stats/untrack`, {
        method:'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ beat_ids: allIds, event_type:'checkout', user_id, anon_id })
      }).catch(()=>{});
    }
  }catch(e){}
  localStorage.setItem("dopetone_history", "[]");
  localStorage.removeItem('dopetone_cart');
  localStorage.removeItem('dopetone_licences');
  localStorage.removeItem('dopetone_pending_checkout');
  localStorage.setItem('dopetone_cart_count', '0');
  try{
    window.dispatchEvent(new CustomEvent('cc_cart_removed', { detail:{ beat_ids: beatIds } }));
    window.dispatchEvent(new CustomEvent('cc_checkout_completed', { detail:{ beat_ids: beatIds } }));
    window.dispatchEvent(new Event('storage'));
  }catch{}
}

async function verifyViaWorker(sid){
  const url = `${PAYPAL_WORKER_URL}/capture-paypal-order?session_id=${encodeURIComponent(sid)}`;
  const res = await fetch(url);
  if(!res.ok){ const t=await res.text(); throw new Error(`PayPal ${res.status}: ${t.slice(0,200)}`); }
  return await res.json();
}

export function render(){
  return `
  <div style="min-height:80vh;display:flex;align-items:center;justify-content:center;background:#0a0a0a;padding:20px">
    <div style="background:#151515;border:1px solid #2a2a2a;border-radius:20px;padding:32px;max-width:420px;width:90%;text-align:center;box-shadow:0 20px 60px rgba(0,0,0,.6)">
      <div style="width:56px;height:56px;background:#00ffc6;border-radius:14px;display:flex;align-items:center;justify-content:center;margin:0 auto 16px;font-size:28px">✅</div>
      <h1 id="sTitle" style="margin:0 0 6px;font-size:22px;color:#fff">Verifying Payment</h1>
      <p id="sSub" style="color:#888;font-size:13px">Please wait...</p>
      <div id="sAmount" style="font-size:26px;font-weight:800;margin:18px 0;color:#fff">...</div>
      <div id="sDetails" style="text-align:left;background:#111;border:1px solid #222;border-radius:12px;padding:14px;font-size:13px;line-height:1.6;display:none;margin-top:16px;color:#ddd"></div>
      <div style="display:flex;gap:10px;margin-top:20px">
        <a id="enterVaultBtn" href="#/licence/vault" style="flex:1;padding:12px;border-radius:12px;text-decoration:none;font-weight:700;font-size:13px;text-align:center;background:linear-gradient(135deg,#8b5cf6,#00ffc6);color:#000">Enter Vault</a>
        <a href="#/beats" style="flex:1;padding:12px;border-radius:12px;text-decoration:none;font-weight:700;font-size:13px;text-align:center;background:#222;color:#fff;border:1px solid #333">More Beats</a>
      </div>
      <div id="sStatus" style="margin-top:14px;font-size:12px;padding:8px;border-radius:8px;background:rgba(255,200,0,.1);color:#ffcc00">Initializing...</div>
    </div>
  </div>`;
}

export async function init(){
  const hashQuery = window.location.hash.split('?')[1] || '';
  const params = new URLSearchParams(hashQuery || window.location.search);
  const sessionId = params.get('token') || params.get('paypal_order_id') || params.get('session_id') || params.get('order_id') || params.get('orderID') || params.get('orderId');
  const isFree = params.get('free') === '1';

  const titleEl = document.getElementById('sTitle');
  const subEl = document.getElementById('sSub');
  const amountEl = document.getElementById('sAmount');
  const detailsEl = document.getElementById('sDetails');
  const statusEl = document.getElementById('sStatus');
  const enterVaultBtn = document.getElementById('enterVaultBtn');

  window._retryCount = window._retryCount || 0;

  if(isFree){
    titleEl.textContent="Download Ready"; subEl.innerHTML="FREE beat unlocked.<br/>Check your downloads.";
    amountEl.textContent="FREE"; detailsEl.style.display='block'; detailsEl.innerHTML="Your FREE licence is ready.";
    await clearAllLocalHistory('free_'+Date.now(), []);
    statusEl.style.background='rgba(0,255,198,.1)'; statusEl.style.color='#00ffc6'; statusEl.textContent="✅ Cart cleared + D1 cleared";
    enterVaultBtn.href = '#/licence/vault';
    return;
  }
  if(!sessionId){
    statusEl.textContent="No PayPal order ID in URL - if you paid, check email.";
    amountEl.textContent="⚠️ No order"; enterVaultBtn.href = '#/licence/vault'; return;
  }
  if(localStorage.getItem(shippedKey(sessionId))==="1"){
    titleEl.textContent="Already Unlocked"; amountEl.textContent="✅ Saved";
    subEl.innerHTML="This PayPal payment was already processed.<br/>Cart cleared.";
    statusEl.style.background='rgba(0,255,198,.1)'; statusEl.style.color='#00ffc6'; statusEl.textContent="✅ Enter Vault To Download Now";
    enterVaultBtn.href = `#/licence/vault?session_id=${encodeURIComponent(sessionId)}`;
    localStorage.setItem('dopetone_last_session_id', sessionId);
    await clearAllLocalHistory(sessionId, []);
    return;
  }

  const preHistory = safeParse("dopetone_history", []);
  const preLicences = safeParse("dopetone_licences", {});

  async function doVerify(){
    window._retryCount = window._retryCount || 0;
    try{
      statusEl.textContent="Verifying with PayPal...";
      const data = await verifyViaWorker(sessionId);
      const session = data.session || data;
      const purchases = data.purchases || [];
      const isPaid = data.status === 'paid' || session.status === 'paid' || session.status === 'COMPLETED';

      if(isPaid){
        const totalCents = data.total_cents || session.total_cents || 0;
        const dollars = (totalCents/100).toFixed(2);
        const email = data.customer_email || session.customer_email || '';
        const purchasedIds = purchases.map(p=>parseInt(p.beat_id||p.beatId)).filter(Boolean);

        titleEl.textContent="PayPal Verified";
        subEl.innerHTML="PayPal payment confirmed.<br/>Sounds unlocked.";
        amountEl.textContent = totalCents ? `$${dollars} PAID` : `PAID`;
        statusEl.style.background='rgba(0,255,198,.1)'; statusEl.style.color='#00ffc6';

        let html = "<strong>Unlocked:</strong><br/>";
        if(purchases.length){ purchases.forEach(p=> html+=`• ${p.beat_title} - $${Number(p.dollars||p.amount/100||0).toFixed(2)}<br/>`); }
        else if(preHistory.length){ preHistory.forEach(i=>{ if(i.amount) html+=`• ${i.beat_title||'Beat '+i.beat_id} - $${(i.amount/100).toFixed(2)}<br/>`; }); }
        else { Object.values(preLicences).forEach(l=> html+=`• ${l.title||'Beat'} - ${l.name} - $${l.price}<br/>`); }
        if(email) html+=`<br/><small>Receipt: ${email}</small>`;
        detailsEl.innerHTML=html; detailsEl.style.display='block';

        localStorage.setItem(shippedKey(sessionId), "1");
        localStorage.setItem('dopetone_last_session_id', sessionId);
        if(email) localStorage.setItem('dopetone_last_paid_email', email);
        enterVaultBtn.href = `#/licence/vault?session_id=${encodeURIComponent(sessionId)}`;

        try{
          const pendingCheckout = safeParse("dopetone_pending_checkout", {});
          const pendingPromo = localStorage.getItem('dopetone_pending_promo_use') || localStorage.getItem('dopetone_active_promo') || pendingCheckout.promo_code;
          if(pendingPromo){
            fetch('https://emails-api.dopetone701.workers.dev/api/promo/use', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({code: pendingPromo}) }).catch(()=>{});
            localStorage.removeItem('dopetone_active_promo');
            localStorage.removeItem('dopetone_pending_promo_use');
          }
        }catch{}

        await clearAllLocalHistory(sessionId, purchasedIds);
        statusEl.textContent=`✅ Click Enter -  Vault To Townload NOW`;
        return;
      }
      window._retryCount++;
      if (window._retryCount > 15) { statusEl.textContent=`Still pending after 30s. Order: ${sessionId.slice(0,25)}...`; enterVaultBtn.href = `#/licence/vault?session_id=${encodeURIComponent(sessionId)}`; return; }
      amountEl.textContent="Processing..."; statusEl.textContent=`PayPal status: ${session.status || data.status || 'pending'} - retrying (${window._retryCount}/15)...`; setTimeout(doVerify, 2000);
    }catch(e){
      window._retryCount++;
      if (window._retryCount > 15) { statusEl.style.background='rgba(255,60,60,.1)'; statusEl.style.color='#ff6b6b'; statusEl.textContent=`Failed: ${e.message}`; enterVaultBtn.href = `#/licence/vault?session_id=${encodeURIComponent(sessionId)}`; return; }
      statusEl.textContent=`Retrying PayPal... ${e.message} (${window._retryCount}/15)`; setTimeout(doVerify, 2000);
    }
  }
  doVerify();
}
