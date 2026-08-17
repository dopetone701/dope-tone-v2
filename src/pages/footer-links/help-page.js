// src/pages/footer-links/help-page.js - V12.1 - FIXED CHOP - URL WIRED - NO CSS IMPORT - NO BLOCK
// CSS loaded via index.html <link href="/src/pages/footer-links/help.css">

const TICKETS_API = "https://support-tickets-api.dopetone701.workers.dev";
const EMAILS_API = "https://emails-api.dopetone701.workers.dev";

const IMG_LOGO = new URL('/public/images/logo.png', window.location.origin).href;

export function renderHelp() {
  return `
<div class="wrap" style="min-width:0; overflow-wrap:anywhere;">
  <div class="topbar" style="min-width:0;">
    <a href="#/home" data-link class="logo-link" style="min-width:0;">
      <img src="${IMG_LOGO}" alt="logo" style="width:36px;height:36px;object-fit:contain;flex-shrink:0;">
      <span style="overflow-wrap:anywhere;">DOPE TONE</span>
    </a>
    <a href="#/home" data-link class="back-btn">Back to Home</a>
  </div>

  <div class="hero" id="help" style="min-width:0; overflow-wrap:anywhere;">
    <small>VAULT SUPPORT</small>
    <h1>How can we help?</h1>
    <p>Delivery, licenses, payments, vault access. Search below - 90% answers are instant.</p>
    <div class="search" style="min-width:0;"><input id="searchInput" placeholder="Search beats, licenses, orders, vault..." style="width:100%; min-width:0;"></div>
  </div>

  <div class="grid3" style="min-width:0;">
    <div class="card" data-scroll="faqSection" style="min-width:0;"><span class="badge badge-blue">HELP</span><h3>Help Center</h3><p>How vault delivery works</p></div>
    <div class="card" data-scroll="ticketSection" style="min-width:0;"><span class="badge badge-red">MESSAGE</span><h3>Send Message</h3><p>Order issue, wrong file, payment</p></div>
    <div class="card" data-scroll="licenseSection" style="min-width:0;"><span class="badge badge-blue">LICENSE</span><h3>License Info</h3><p>Free / Basic / Pro / Exclusive</p></div>
  </div>

  <div class="split" style="min-width:0;">
    <div class="panel" id="faqSection" style="min-width:0; overflow-wrap:anywhere;">
      <h2>FAQ - Quick Answers</h2>
      <div class="acc" style="min-width:0;"><h4 style="min-width:0; overflow-wrap:anywhere;">Where is my beat after payment? <span class="plus">+</span></h4><div class="ans" style="display:none; overflow-wrap:anywhere;">After Stripe success you are redirected to vault with session_id. We save dopetone_last_session_id in localStorage. Check /licence/vault - your files are there with signed R2 URLs.</div></div>
      <div class="acc" style="min-width:0;"><h4 style="min-width:0; overflow-wrap:anywhere;">Why session_id is required? <span class="plus">+</span></h4><div class="ans" style="display:none; overflow-wrap:anywhere;">Only buyer with session_id can fetch R2 signed URLs. No account needed. Session proves payment - no login required.</div></div>
      <div class="acc" style="min-width:0;"><h4 style="min-width:0; overflow-wrap:anywhere;">Payment & currency <span class="plus">+</span></h4><div class="ans" style="display:none; overflow-wrap:anywhere;">Stripe + PayPal. USD base, AED converted auto. PayPal modal is instant checkout - no cart redirect.</div></div>
      <div class="acc" style="min-width:0;"><h4 style="min-width:0; overflow-wrap:anywhere;">Refund policy? <span class="plus">+</span></h4><div class="ans" style="display:none; overflow-wrap:anywhere;">Digital product - no refund after download. If file corrupt / wrong, we replace in 12h via WhatsApp +971524082460.</div></div>
    </div>

    <div class="panel" id="ticketSection" style="min-width:0; overflow-wrap:anywhere;">
      <h2>Send Message</h2>
      <p class="muted">Fastest: WhatsApp +971524082460</p>
      <div class="form" style="min-width:0;">
        <label>NAME</label><input id="tName" placeholder="Your name" style="width:100%; min-width:0;">
        <label>EMAIL</label><input id="tEmail" placeholder="you@email.com" style="width:100%; min-width:0;">
        <label>ORDER ID</label><input id="tOrder" placeholder="Order ID (optional)" style="width:100%; min-width:0;">
        <label>CATEGORY</label>
        <select id="tCat" style="width:100%; min-width:0;"><option>Order / Delivery</option><option>License Question</option><option>Payment Issue</option><option>File / Stems Issue</option><option>Custom Beat</option><option>Other</option></select>
        <label>MESSAGE</label><textarea id="tMsg" rows="5" placeholder="Describe issue..." style="width:100%; min-width:0; overflow-wrap:anywhere;"></textarea>
        <button class="btn" id="sendTicket">SEND MESSAGE</button>
        <p class="muted" id="ticketStatus" style="margin-top:10px;display:none; overflow-wrap:anywhere;"></p>
      </div>
    </div>
  </div>

  <div class="panel" id="licenseSection" style="margin-top:14px; min-width:0; overflow-x:auto;">
    <h2>License Comparison</h2>
    <div style="overflow-x:auto; -webkit-overflow-scrolling:touch; min-width:0;">
      <table style="min-width:500px;"><thead><tr><th>FEATURE</th><th>FREE</th><th>BASIC $29</th><th>PRO</th><th>EXCLUSIVE</th></tr></thead>
      <tbody>
        <tr><td>MP3</td><td>Tagged</td><td>Untagged</td><td>Yes</td><td>Yes</td></tr>
        <tr><td>WAV</td><td>No</td><td>Yes</td><td>Yes</td><td>Yes</td></tr>
        <tr><td>STEMS</td><td>No</td><td>No</td><td>Yes</td><td>Yes</td></tr>
      </tbody></table>
    </div>
  </div>

  <div class="panel" id="termsSection" style="margin-top:14px; min-width:0; overflow-wrap:anywhere;"><h2>Terms of Use - DOPE TONE VAULT</h2><p class="muted" style="overflow-wrap:anywhere;">Dubai, UAE - May 2026 - All beats are non-exclusive until Exclusive sold. Digital delivery via R2 vault.</p></div>
  <div class="panel" id="privacySection" style="margin-top:14px; min-width:0; overflow-wrap:anywhere;"><h2>Privacy Policy</h2><p class="muted" style="overflow-wrap:anywhere;">Contact: creators@dopetonevault.com - We only store session_id + email for delivery. No account needed.</p></div>
</div>
`;
}

export function initHelp() {
  const categoryMessages = {
    "Order / Delivery": "Got it! Checking your order delivery. Update in email in under 1 hour.",
    "License Question": "License question received! Team will email you details shortly.",
    "Payment Issue": "Payment issue noted! Looking into it now.",
    "File / Stems Issue": "File issue received! Fresh link coming to email soon.",
    "Custom Beat": "Custom beat request! Love it. Replying with next steps.",
    "Other": "Message sent! Reply in under 1 hour."
  };

  document.querySelectorAll('.acc h4').forEach(function(header) {
    header.style.cursor = 'pointer';
    header.onclick = function() {
      const acc = header.parentElement;
      const wasOpen = acc.classList.contains('open');
      document.querySelectorAll('.acc').forEach(function(a) {
        a.classList.remove('open');
        const ans = a.querySelector('.ans');
        if (ans) ans.style.display = 'none';
        const plus = a.querySelector('.plus');
        if (plus) plus.textContent = '+';
      });
      if (!wasOpen) {
        acc.classList.add('open');
        const ans = acc.querySelector('.ans');
        if (ans) ans.style.display = 'block';
        const plus = header.querySelector('.plus');
        if (plus) plus.textContent = 'x';
      }
    };
  });

  document.querySelectorAll('[data-scroll]').forEach(function(card) {
    card.style.cursor = 'pointer';
    card.onclick = function() {
      const target = document.getElementById(card.dataset.scroll);
      if (target) target.scrollIntoView({ behavior: 'smooth' });
    };
  });

  const searchInput = document.getElementById('searchInput');
  if (searchInput) {
    searchInput.oninput = function(e) {
      const q = e.target.value.toLowerCase();
      document.querySelectorAll('.acc, #licenseSection, #termsSection, #privacySection').forEach(function(el) {
        const txt = el.textContent.toLowerCase();
        el.style.display = txt.includes(q) || q === ''? '' : 'none';
      });
    };
  }

  const sendBtn = document.getElementById('sendTicket');
  if (!sendBtn) return;

  sendBtn.textContent = 'SEND MESSAGE';
  sendBtn.onclick = async function() {
    const nameEl = document.getElementById('tName');
    const emailEl = document.getElementById('tEmail');
    const orderEl = document.getElementById('tOrder');
    const catEl = document.getElementById('tCat');
    const msgEl = document.getElementById('tMsg');
    const statusEl = document.getElementById('ticketStatus');

    const name = nameEl? nameEl.value.trim() : '';
    const email = emailEl? emailEl.value.trim() : '';
    const orderId = orderEl? orderEl.value.trim() : '';
    const category = catEl? catEl.value : 'Other';
    const message = msgEl? msgEl.value.trim() : '';

    if (!name ||!email ||!message) {
      if (statusEl) {
        statusEl.style.display = 'block';
        statusEl.style.color = '#ef4444';
        statusEl.textContent = 'Please fill name, email and your message.';
      }
      return;
    }

    sendBtn.disabled = true;
    sendBtn.textContent = 'SENDING...';
    if (statusEl) {
      statusEl.style.display = 'block';
      statusEl.style.color = '#888';
      statusEl.textContent = 'Sending your message...';
    }

    try {
      const res = await fetch(TICKETS_API + "/api/tickets/create", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name,
          username: name,
          email: email,
          subject: category + " - Order " + (orderId || 'no-id'),
          message: "Category: " + category + "\nOrder: " + orderId + "\nEmail: " + email + "\n\n" + message,
          priority: 'Medium',
          status: 'open',
          source: 'help_page'
        })
      });

      const data = await res.json();
      if (!res.ok ||!data.success) throw new Error('Failed');
      const ticketId = data.id || '';

      try {
        await fetch(EMAILS_API + "/api/emails/bulk", {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            emails: [email],
            name: name,
            category: category,
            orderId: orderId,
            ticketId: ticketId
          })
        });
      } catch (e) {
        console.log('Email failed but ticket saved', e);
      }

      if (statusEl) {
        statusEl.style.color = '#10b981';
        statusEl.innerHTML = categoryMessages[category] + "<br><span style='font-size:11px;color:#666'>Email sent to " + email + "</span>";
      }

      if (nameEl) nameEl.value = '';
      if (emailEl) emailEl.value = '';
      if (orderEl) orderEl.value = '';
      if (msgEl) msgEl.value = '';
      if (catEl) catEl.selectedIndex = 0;

    } catch (err) {
      console.log(err);
      if (statusEl) {
        statusEl.style.color = '#ef4444';
        statusEl.textContent = 'Could not send - WhatsApp +971524082460';
      }
    } finally {
      sendBtn.disabled = false;
      sendBtn.textContent = 'SEND MESSAGE';
    }
  };
}

export const render = renderHelp;
export const init = initHelp;
export default { renderHelp, initHelp, render, init };
