// src/features/licence/cancel-v2.js - DNA COMPLIANT - NO BLACK, NO GREEN, ONLY VAULT COLORS
const safeParse = (k,f)=>{ try{ const v=localStorage.getItem(k); return v?JSON.parse(v):f }catch{ return f } };

export function render(){
  return `
  <div style="min-height:80vh;display:flex;align-items:center;justify-content:center;background:radial-gradient(ellipse at top, #0A1931 0%, #050A14 70%);position:relative;padding:20px">
    <div style="background:linear-gradient(180deg, rgba(10,25,49,0.9), rgba(5,10,20,0.9));backdrop-filter:blur(20px);border-radius:20px;padding:38px 30px;width:92%;max-width:430px;text-align:center;border:1px solid rgba(255,255,255,0.1);box-shadow:0 0 40px rgba(255,30,60,0.22);position:relative;z-index:1;color:#FFFFFF;font-family:system-ui">
      <img src="/images/logo.png" style="width:78px;margin-bottom:16px;opacity:.92" onerror="this.style.display='none'" />
      <div style="font-size:56px;margin-bottom:18px;filter:drop-shadow(0 0 10px rgba(255,30,60,.45))">❌</div>
      <div style="font-size:24px;color:#FF1E3C;margin-bottom:10px;font-weight:900;letter-spacing:-0.5px">Payment Cancelled</div>
      <div id="cMsg" style="color:#9CA3AF;margin-bottom:16px;font-size:14px;line-height:1.6">You didn't unlock the vault yet.<br/>Your sound is still waiting.</div>
      <div id="cPreview" style="background:rgba(10,25,49,0.8);border-radius:12px;padding:14px;margin:16px 0;text-align:left;font-size:12.5px;color:#9CA3AF;border:1px solid rgba(255,255,255,0.1);max-height:160px;overflow-y:auto;display:none"></div>
      <div style="display:flex;gap:10px;justify-content:center;flex-wrap:wrap;margin-top:12px">
        <a href="#" id="cRetryBtn" style="padding:12px 20px;border-radius:11px;text-decoration:none;font-weight:800;color:#FFFFFF;background:#FF1E3C;box-shadow:0 0 20px rgba(255,30,60,0.5)">Retry Checkout</a>
        <a href="#/cart" style="padding:12px 20px;border-radius:11px;text-decoration:none;font-weight:800;color:#FFFFFF;background:rgba(255,255,255,0.08);border:1px solid rgba(255,255,255,0.1)">Back to Cart</a>
        <a href="#/vault" style="padding:12px 20px;border-radius:11px;text-decoration:none;font-weight:800;color:#1E90FF;background:rgba(10,25,49,0.6);border:1px solid rgba(30,144,255,0.3)">Vault</a>
      </div>
      <div id="cStatus" style="margin-top:15px;font-size:11.5px;color:#9CA3AF;min-height:16px">Cart preserved - webhook did NOT charge</div>
    </div>
  </div>`;
}

export function init(){
  function loadState(){ return { cart: safeParse("dopetone_cart", []), licences: safeParse("dopetone_licences", {}), pending: safeParse("dopetone_pending_checkout", null), history: safeParse("dopetone_history", []) }; }
  function renderPreview(){
    const { cart, licences } = loadState();
    const el = document.getElementById('cPreview');
    const msg = document.getElementById('cMsg');
    const retry = document.getElementById('cRetryBtn');
    if(!cart.length){ el.style.display='none'; msg.innerHTML="Your cart is empty.<br/>Add heat from the vault."; retry.style.display='none'; document.getElementById('cStatus').textContent="No tracks in cart"; return; }
    let total=0, count=0, html=`<strong style="color:#FFFFFF">${cart.length} tracks saved:</strong><br/><br/>`;
    cart.forEach(b=>{ const lic = licences[String(b.id)] || licences[b.id]; if(!lic){ html+=`• ${b.title||'Beat '+b.id} - <span style="color:#1E90FF">select licence</span><br/>`; } else { total+=Number(lic.price||0); count++; html+=`• ${b.title||'Beat '+b.id} - ${lic.name} - $${Number(lic.price).toFixed(2)}<br/>`; } });
    if(count>0){ html+=`<br/><strong style="color:#FF1E3C">Total: $${total.toFixed(2)} ready</strong>`; msg.innerHTML=`Payment cancelled - no charge.<br/>Your ${count} track${count>1?'s':''} are still waiting.`; } else { html+=`<br/><span style="color:#1E90FF">Select licences to retry</span>`; msg.innerHTML=`Select a licence for your tracks to continue.`; }
    el.innerHTML=html; el.style.display='block';
  }
  document.getElementById('cRetryBtn').addEventListener('click', (e)=>{ e.preventDefault(); location.hash='#/cart'; });
  renderPreview();
}

