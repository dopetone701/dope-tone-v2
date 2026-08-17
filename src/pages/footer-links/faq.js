// src/pages/footer-links/faq.js - V9.5 - ONLY FAQ - ROUTER READY
import './help.css';

export function renderFaq() {
  return `
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
  `;
}

export function initFaq() {
  const accordions = document.querySelectorAll('#faqSection.acc');
  const search = document.getElementById('searchInput');
  if (!accordions.length) {
    console.warn('[faq] no accordions found');
    return;
  }

  accordions.forEach(function(acc) {
    const header = acc.querySelector('h4');
    if (!header) return;
    header.style.cursor = 'pointer';
    header.onclick = function() {
      const isOpen = acc.classList.contains('open');
      document.querySelectorAll('#faqSection.acc').forEach(function(x) {
        x.classList.remove('open');
        const ans = x.querySelector('.ans');
        if (ans) ans.style.display = 'none';
        const p = x.querySelector('.plus');
        if (p) p.textContent = '+';
      });
      if (!isOpen) {
        acc.classList.add('open');
        const ans = acc.querySelector('.ans');
        if (ans) ans.style.display = 'block';
        const p = acc.querySelector('.plus');
        if (p) p.textContent = '−';
      }
    };
  });

  if (!search) return;

  search.oninput = function(e) {
    const q = e.target.value.toLowerCase().trim();
    accordions.forEach(function(acc) {
      const text = acc.textContent.toLowerCase();
      const match =!q || text.includes(q);
      acc.style.display = match? '' : 'none';
      if (q && match) {
        acc.classList.add('open');
        const ans = acc.querySelector('.ans');
        if (ans) ans.style.display = 'block';
        const plus = acc.querySelector('.plus');
        if (plus) plus.textContent = '−';
      } else if (!q) {
        acc.classList.remove('open');
        const ans = acc.querySelector('.ans');
        if (ans) ans.style.display = 'none';
        const plus = acc.querySelector('.plus');
        if (plus) plus.textContent = '+';
      }
    });
  };
}

// compatibility for your router V9.5
export const initFAQ = initFaq;
export const render = renderFaq;
export const init = initFaq;
export default { renderFaq, initFaq, initFAQ, render, init };
