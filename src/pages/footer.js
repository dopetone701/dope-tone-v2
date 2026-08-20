// src/pages/footer.js - V15 RESPECTFUL FULL - INNER SCROLL ONLY - SURGICAL TERMS FIX
const VAULT_API = "https://emails-api.dopetone701.workers.dev";
let vaultStep = 'email';
let tempEmail = '';
let tempName = '';
let isTyping = false;

function typeWord(input, word, cb) {
  let i = 0; input.value = '';
  const interval = setInterval(() => { input.value += word[i]; i++; if (i >= word.length) { clearInterval(interval); if (cb) cb(); } }, 120);
}
function wipe(input, btn, cb) {
  btn.animate([{transform:'translateX(0)'},{transform:'translateX(-60px)'},{transform:'translateX(0)'}], {duration:400});
  input.animate([{opacity:1, transform:'translateX(0)'},{opacity:0, transform:'translateX(-15px)'}], {duration:180}).onfinish = () => {
    input.value = ''; input.animate([{opacity:0, transform:'translateX(15px)'},{opacity:1, transform:'translateX(0)'}], {duration:180}); cb();
  };
}
async function sendVaultToBackend(email, name){
  try{
    const res = await fetch(`${VAULT_API}/api/emails/subscribe`, {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({ email, name, source: 'footer_vault' })
    });
    const data = await res.json();
    console.log('[Vault] Saved:', data);
    window.dispatchEvent(new CustomEvent('cc_dashboard_refresh'));
    const existing = JSON.parse(localStorage.getItem('dt_newsletter_cache') || '[]');
    existing.unshift({email, name, date: new Date().toISOString(), source: 'footer_vault'});
    localStorage.setItem('dt_newsletter_cache', JSON.stringify(existing.slice(0,100)));
    localStorage.setItem('dt_vault_user', JSON.stringify({email, name}));
  }catch(err){ console.error('[Vault] Failed:', err); }
}

// === SURGICAL FIX START ===
function injectTermsFloatBar(fromVault = false){
  if(document.getElementById('dt-terms-float')) return;
  const isFromVault = fromVault || sessionStorage.getItem('vault_terms_flow') === '1';
  const bar = document.createElement('div');
  bar.id = 'dt-terms-float';
  bar.innerHTML = `
    <div style="position:fixed;bottom:86px;left:0;right:0;z-index:99999;background:#0A0E1A;border-top:1px solid rgba(255,255,255,0.12);padding:14px 20px;display:flex;justify-content:space-between;align-items:center;gap:16px;transform:translateY(100%);transition:transform.35s cubic-bezier(.16,1,.3,1);backdrop-filter:blur(12px);">
      <span style="color:#fff;font-size:12px;letter-spacing:.3px;">${isFromVault? 'Agree to Terms to continue vault signup' : 'Terms of Use'}</span>
      <div style="display:flex;gap:8px;flex-shrink:0;">
        ${isFromVault? `<button id="dt-decline-terms" style="background:transparent;border:1px solid #333;color:#fff;padding:9px 18px;border-radius:8px;font-size:12px;cursor:pointer;">Decline</button>` : ``}
        <button id="dt-agree-terms" style="background:#fff;color:#000;padding:9px 20px;border-radius:8px;font-size:12px;font-weight:800;cursor:pointer;border:none;">${isFromVault? 'Agree & Continue' : 'Agree'}</button>
      </div>
    </div>
  `;
  document.body.appendChild(bar);
  setTimeout(()=>{ bar.firstElementChild.style.transform='translateY(0)'; },100);

  document.getElementById('dt-agree-terms').onclick = () => {
    localStorage.setItem('dt_terms_accepted','true');
    bar.firstElementChild.style.transform='translateY(100%)';
    setTimeout(()=>{
      bar.remove();
      if(isFromVault){
        sessionStorage.removeItem('vault_terms_flow');
        history.back();
        setTimeout(()=>{
          const app=document.getElementById('app-view');
          if(app) app.scrollTo({top:app.scrollHeight, behavior:'smooth'});
          setTimeout(()=>{
            const check=document.getElementById('vault-agree-check');
            if(check &&!check.checked){
              check.checked=true;
              check.dispatchEvent(new Event('change'));
            }
          },750);
        },400);
      }
    },350);
  };

  const decline = document.getElementById('dt-decline-terms');
  if(decline){
    decline.onclick = () => {
      bar.firstElementChild.style.transform='translateY(100%)';
      setTimeout(()=>{ bar.remove(); sessionStorage.removeItem('vault_terms_flow'); history.back(); },350);
    };
  }
}
// === SURGICAL FIX END ===

function joinVault() {
  const input = document.getElementById('vault-email');
  if(!input) return;
  const btn = input.nextElementSibling;
  const label = document.querySelector('.dt-footer-right > span');
  const termsBox = document.getElementById('vault-terms');
  const check = document.getElementById('vault-agree-check');
  const val = input.value.trim();
  if (vaultStep === 'email') {
    if (!val.includes('@')) {
      input.style.border = '1px solid #ff2d78';
      input.animate([{transform:'translateX(-4px)'},{transform:'translateX(4px)'},{transform:'translateX(0)'}], {duration:250});
      return;
    }
    tempEmail = val.toLowerCase();
    wipe(input, btn, () => {
      vaultStep = 'name';
      label.textContent = 'Input your full name';
      input.type = 'text';
      input.value = '';
      input.placeholder = 'Full name';
      input.style.border = '';
    });
  } else if (vaultStep === 'name') {
    if (val.length < 2) { input.style.border = '1px solid #ff2d78'; return; }
    tempName = val;
    wipe(input, btn, () => {
      vaultStep = 'terms';
      label.textContent = 'By continuing you agree to our terms';
      label.style.fontSize = '10px'; label.style.opacity = '0.6';
      input.value = ''; input.placeholder = 'Check box to agree'; input.type = 'text'; input.disabled = true;
      termsBox.style.display = 'flex';
      btn.style.opacity = '0.3'; btn.style.pointerEvents = 'none';
      // SURGICAL: AUTO CHECK IF ALREADY AGREED
      const alreadyAgreed = localStorage.getItem('dt_terms_accepted') === 'true';
      check.checked = alreadyAgreed;
      if(alreadyAgreed){
        isTyping = true; input.disabled = false; input.value = '';
        typeWord(input, 'AGREE', () => { btn.style.opacity = '1'; btn.style.pointerEvents = 'auto'; isTyping = false; });
      }
      check.onchange = () => {
        if (check.checked &&!isTyping) {
          isTyping = true;
          input.disabled = false; input.value = '';
          typeWord(input, 'AGREE', () => {
            btn.style.opacity = '1'; btn.style.pointerEvents = 'auto'; isTyping = false;
          });
        } else if (!check.checked) {
          input.value = ''; btn.style.opacity = '0.3'; btn.style.pointerEvents = 'none';
        }
      };
    });
  } else if (vaultStep === 'terms') {
    sendVaultToBackend(tempEmail, tempName);
    termsBox.style.display = 'none';
    label.innerHTML = `${tempName} • IN VAULT`;
    label.style.fontSize = '12px'; label.style.opacity = '1'; label.style.textTransform = 'uppercase';
    input.value = ''; input.placeholder = `Bingo! Welcome ${tempName.split(' ')[0]} 🔥`;
    input.style.border = '1px solid #00ff9d'; input.disabled = true;
    btn.style.opacity = '0.3'; btn.style.pointerEvents = 'none';
    vaultStep = 'done';
  }
}

export function renderFooter(){
  const mountFooter = () => {
    const view = document.getElementById('app-view');
    if(!view) return;
    if(document.getElementById('dt-footer')) return;

    const saved = JSON.parse(localStorage.getItem('dt_vault_user') || 'null');
    const initialLabel = saved? `${saved.name} • IN VAULT` : 'STAY IN VAULT';
    const initialPlaceholder = saved? `Welcome back ${saved.name.split(' ')[0]} 🔥` : 'Email';
    const isSubscribed =!!saved;

    const footerHTML = `
<footer id="dt-footer" class="dt-footer" style="margin-bottom:0!important;padding-bottom:0!important;">
  <div class="dt-footer-main">
    <div class="dt-footer-left">
      <h2>DOPE TONE</h2>
      <p>Premium beats • Future sound • Industry vibes</p>
      <div class="footer-socials">
        <a href="https://instagram.com/dopetone701" target="_blank" rel="noopener" aria-label="Instagram">
          <svg viewBox="0 0 24 24"><path fill="currentColor" d="M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2Zm-.2 2A3.6 3.6 0 0 0 4 7.6v8.8C4 18.39 5.61 20 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6C20 5.61 18.39 4 16.4 4H7.6Zm9.65 1.5a1.25 1.25 0 1 1 0 2.5 1.25 1.25 0 0 1 0-2.5ZM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm0 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z"/></svg>
        </a>
        <a href="https://www.youtube.com/channel/UCKddIkawOD4w_79Hc4zDw7Q" target="_blank" rel="noopener" aria-label="YouTube">
          <svg viewBox="0 0 24 24"><path fill="currentColor" d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.196-.488-8.55-4.385-8.816ZM9 16V8l8 3.993L9 16Z"/></svg>
        </a>
        <a href="https://www.tiktok.com/@dopetonevault" target="_blank" rel="noopener" aria-label="TikTok">
          <svg viewBox="0 0 24 24"><path fill="currentColor" d="M12.525.02h3.91c.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07Z"/></svg>
        </a>
      </div>
    </div>

    <div class="dt-footer-nav">
      <div class="col"><span>Explore</span><a href="#/beats" data-link>Beats</a><a href="#/vault" data-link>Samples</a><a href="#/beats" data-link>Trending</a></div>
      <div class="col"><span>Support</span><a href="#/help" data-link>Help</a><a href="#/help" data-link data-scroll="ticketSection">Message</a><a href="#/help" data-link data-scroll="licenseSection">License</a></div>
      <div class="col"><span>Legal</span><a href="#/terms" data-link>Terms</a><a href="#/privacy" data-link>Privacy</a><a href="#/help" data-link data-scroll="faqSection">FAQ</a></div>
      <div class="col"><span>Vault</span><a href="#/about" data-link>About</a><a href="#/about" data-link>Contact</a><a href="https://instagram.com/dopetone701" target="_blank">IG</a></div>
    </div>

    <div class="dt-footer-right">
      <span style="${isSubscribed?'font-size:12px;opacity:1;text-transform:uppercase;':''}">${initialLabel}</span>
           <form class="vault-join" autocomplete="on" onsubmit="return false;" data-form-type="newsletter">
        <input id="vault-email" type="email" name="newsletter-email" autocomplete="email" inputmode="email" data-form-type="other" placeholder="${initialPlaceholder}" ${isSubscribed?'disabled style="border:1px solid #00ff9d"':''}>
        <button id="vault-join-btn" type="button" ${isSubscribed?'style="opacity:0.3;pointer-events:none"':''}>→</button>
      </form>

      <div id="vault-terms" style="display:none; align-items:center; gap:6px; margin-top:8px; font-size:10px; color:#fff;">
        <input type="checkbox" id="vault-agree-check" style="width:12px; height:12px; accent-color:#fff;">
        <label for="vault-agree-check" style="cursor:pointer;">I agree to <a href="#/terms" data-link id="vault-terms-link" style="text-decoration:underline;color:#fff;text-underline-offset:3px;font-weight:600;">Terms</a></label>
      </div>
      <div class="pay-row" style="margin-top:14px;">
        <div style="background:#fff;color:#1A1F71;font-weight:900;font-size:9px;padding:5px 7px;border-radius:4px;min-width:36px;text-align:center;letter-spacing:.3px;">VISA</div>
        <div class="pay"><img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard"></div>
        <div class="pay pay-pp" style="background:#FFC439"><img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" alt="PayPal"></div>
        <div class="pay"><img src="https://upload.wikimedia.org/wikipedia/commons/b/b0/Apple_Pay_logo.svg" alt="Apple Pay"></div>
      </div>
    </div>
  </div>
  <div class="dt-footer-bottom" style="margin-bottom:0!important;">
    <small>© 2026 DOPE TONE VAULT</small>
    <small class="dna">SOUND • FUTURE • CULTURE</small>
    <small>Dubai • Worldwide</small>
  </div>
</footer>
`;
    view.insertAdjacentHTML('beforeend', footerHTML);

    const input = document.getElementById('vault-email');
    const btn = document.getElementById('vault-join-btn');
    if(btn &&!isSubscribed) btn.onclick = joinVault;
    if(input &&!isSubscribed) {
      input.addEventListener('keypress', e => { if (e.key === 'Enter' &&!isTyping) joinVault(); });
      input.addEventListener('input', () => { input.style.border = ''; });
    }

    const termsLink = document.getElementById('vault-terms-link');
    if(termsLink){
      termsLink.addEventListener('click', (e)=>{
        e.preventDefault();
        sessionStorage.setItem('vault_terms_flow','1');
        window.location.hash = '#/terms';
        setTimeout(()=>injectTermsFloatBar(true), 500);
      });
    }

    view.querySelectorAll('a[data-scroll]').forEach(link=>{
      link.addEventListener('click', ()=>{
        const targetId = link.getAttribute('data-scroll');
        setTimeout(()=>{
          const target = document.getElementById(targetId);
          if(target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        },350);
      });
    });

    if(window.location.hash.includes('terms')){
      const isVaultFlow = sessionStorage.getItem('vault_terms_flow') === '1';
      setTimeout(()=>injectTermsFloatBar(isVaultFlow), 600);
    }
  };

  mountFooter();

  if(!window.__DT_FOOTER_OBSERVER__){
    const app = document.getElementById('app-view');
    if(app){
      const observer = new MutationObserver(()=>{
        if(!document.getElementById('dt-footer')) mountFooter();
        if(window.location.hash.includes('terms')){
          const isVaultFlow = sessionStorage.getItem('vault_terms_flow') === '1';
          injectTermsFloatBar(isVaultFlow);
        }
      });
      observer.observe(app, {childList:true, subtree:false});
      window.__DT_FOOTER_OBSERVER__ = observer;
    }
  }

  window.addEventListener('hashchange', ()=>{
    if(window.location.hash.includes('terms')){
      const isVaultFlow = sessionStorage.getItem('vault_terms_flow') === '1';
      setTimeout(()=>injectTermsFloatBar(isVaultFlow), 400);
    }else{
      const float = document.getElementById('dt-terms-float');
      if(float) float.remove();
      sessionStorage.removeItem('vault_terms_flow');
    }
  });
}

