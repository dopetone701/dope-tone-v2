function d(){return`
<div class="wrap">
  <div class="topbar">
    <a href="#/home" data-link class="logo-link">
      <img src="/images/logo.png" alt="logo">
      <span>DOPE TONE</span>
    </a>
    <a href="#/home" data-link class="back-btn">← Back to Home</a>
  </div>

  <div class="hero" id="faqHero">
    <small>VAULT SUPPORT • FAQ</small>
    <h1>FAQ — Quick Answers</h1>
    <p>Delivery, licenses, payments, vault access. Search below — 90% answers are instant.</p>
    <div class="search"><input id="searchInput" placeholder="Search beats, licenses, orders, vault, stems..."></div>
  </div>

  <div class="panel" id="faqSection">
    <div class="acc"><h4>Where is my beat after payment? <span class="plus">+</span></h4><div class="ans" style="display:none">After Stripe success you are redirected to <b>/licence/vault?session_id=...</b> We also save localStorage dopetone_last_session_id. Your private links are via R2 signed URLs.</div></div>
    <div class="acc"><h4>Why session_id is required? <span class="plus">+</span></h4><div class="ans" style="display:none">To avoid public links. Only buyer with Stripe session_id can fetch files. No account needed.</div></div>
    <div class="acc"><h4>How licenses work in code? <span class="plus">+</span></h4><div class="ans" style="display:none">Free = tagged MP3 only, Basic = MP3+WAV 5k streams, Pro = WAV+STEMS 50k, Exclusive = unlimited + ownership + removed from store.</div></div>
    <div class="acc"><h4>Payment & currency <span class="plus">+</span></h4><div class="ans" style="display:none">Stripe + PayPal via checkout-paypal-v2.js. USD base, AED converted. Dubai GST+4.</div></div>
    <div class="acc"><h4>Refund policy? <span class="plus">+</span></h4><div class="ans" style="display:none">Digital product — no refund after download. If corrupt/wrong file, we replace within 12h via ticket verified by vault-orders-api logs.</div></div>
    <div class="acc"><h4>Custom beats? <span class="plus">+</span></h4><div class="ans" style="display:none">Yes — send message category Custom. BPM, key, mood, type_beat. Delivery 48-72h WAV+STEMS.</div></div>
  </div>

  <p class="muted" style="text-align:center;margin-top:28px;letter-spacing:.18em;font-size:10px">SOUND • FUTURE • CULTURE • DOPE TONE VAULT</p>
</div>
  `}function c(){const l=document.querySelectorAll("#faqSection.acc"),r=document.getElementById("searchInput");if(!l.length){console.warn("[faq] no accordions found");return}l.forEach(function(i){const e=i.querySelector("h4");e&&(e.style.cursor="pointer",e.onclick=function(){const s=i.classList.contains("open");if(document.querySelectorAll("#faqSection.acc").forEach(function(n){n.classList.remove("open");const t=n.querySelector(".ans");t&&(t.style.display="none");const a=n.querySelector(".plus");a&&(a.textContent="+")}),!s){i.classList.add("open");const n=i.querySelector(".ans");n&&(n.style.display="block");const t=i.querySelector(".plus");t&&(t.textContent="−")}})}),r&&(r.oninput=function(i){const e=i.target.value.toLowerCase().trim();l.forEach(function(s){const n=s.textContent.toLowerCase(),t=!e||n.includes(e);if(s.style.display=t?"":"none",e&&t){s.classList.add("open");const a=s.querySelector(".ans");a&&(a.style.display="block");const o=s.querySelector(".plus");o&&(o.textContent="−")}else if(!e){s.classList.remove("open");const a=s.querySelector(".ans");a&&(a.style.display="none");const o=s.querySelector(".plus");o&&(o.textContent="+")}})})}const p=c,u=d,y=c,v={renderFaq:d,initFaq:c,initFAQ:p,render:u,init:y};export{v as default,y as init,p as initFAQ,c as initFaq,u as render,d as renderFaq};
