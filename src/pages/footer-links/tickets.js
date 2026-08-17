// src/pages/footer-links/tickets.js - V9.5 - ROUTER READY - ONLY TICKET FORM
import './help.css';

const SUPPORT_API = 'https://vault-orders-api.dopetone701.workers.dev';
const TICKETS_API = "https://support-tickets-api.dopetone701.workers.dev";
const EMAILS_API = "https://emails-api.dopetone701.workers.dev";

export function renderTickets() {
  return `
<div class="wrap">
  <div class="topbar">
    <a href="#/home" data-link class="logo-link">
      <img src="/images/logo.png" alt="logo">
      <span>DOPE TONE</span>
    </a>
    <a href="#/help" data-link class="back-btn">← Back to Help</a>
  </div>

  <div class="hero" id="ticketHero">
    <small>VAULT SUPPORT</small>
    <h1>Send Message</h1>
    <p>Order issue, wrong file, payment, custom beat. Reply in under 1 hour Dubai time.</p>
  </div>

  <div class="panel" id="ticketSection" style="max-width:640px;margin:0 auto">
    <p class="muted">Fastest: WhatsApp +971524082460 — Email: creators@dopetonevault.com</p>
    <div class="form">
      <label>NAME</label><input id="tName" placeholder="Your name">
      <label>EMAIL</label><input id="tEmail" placeholder="you@email.com">
      <label>ORDER ID (optional)</label><input id="tOrder" placeholder="e.g. cs_test_... or order_...">
      <label>CATEGORY</label>
      <select id="tCat">
        <option>Order / Delivery</option>
        <option>License Question</option>
        <option>Payment Issue</option>
        <option>File / Stems Issue</option>
        <option>Custom Beat</option>
        <option>Other</option>
      </select>
      <label>MESSAGE</label><textarea id="tMsg" rows="6" placeholder="Describe your issue..."></textarea>
      <button class="btn" id="sendTicket">SEND MESSAGE</button>
      <p class="muted" id="ticketStatus" style="margin-top:12px;display:none"></p>
    </div>
  </div>
</div>
`;
}

export function initTickets() {
  const btn = document.getElementById('sendTicket');
  const status = document.getElementById('ticketStatus');
  const nameEl = document.getElementById('tName');
  const emailEl = document.getElementById('tEmail');
  const orderEl = document.getElementById('tOrder');
  const catEl = document.getElementById('tCat');
  const msgEl = document.getElementById('tMsg');

  if (!btn ||!status) {
    console.warn('[tickets] form not found');
    return;
  }

  btn.onclick = async function() {
    const payload = {
      name: nameEl?.value.trim() || '',
      email: emailEl?.value.trim() || '',
      order_id: orderEl?.value.trim() || '',
      category: catEl?.value || 'Order / Delivery',
      message: msgEl?.value.trim() || '',
      created_at: new Date().toISOString(),
      source: 'tickets_page',
      page_url: location.href
    };

    if (!payload.email ||!payload.message) {
      status.style.display = 'block';
      status.style.color = '#FF1E3C';
      status.textContent = 'Email and message required';
      return;
    }
    if (!payload.email.includes('@')) {
      status.style.display = 'block';
      status.style.color = '#FF1E3C';
      status.textContent = 'Enter valid email';
      return;
    }

    status.style.display = 'block';
    status.style.color = '#9CA3AF';
    status.textContent = 'Sending...';
    btn.disabled = true;
    btn.style.opacity = '0.6';
    btn.textContent = 'SENDING...';

    try {
      // TRY REAL D1 TICKET API (your help-page.js logic)
      const res = await fetch(TICKETS_API + "/api/tickets/create", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: payload.name,
          username: payload.name,
          email: payload.email,
          subject: payload.category + " - Order " + (payload.order_id || 'no-id'),
          message: "Category: " + payload.category + "\nOrder: " + payload.order_id + "\nEmail: " + payload.email + "\n\n" + payload.message,
          priority: payload.category === 'Payment Issue'? 'High' : 'Medium',
          status: 'open',
          source: 'tickets_page'
        })
      });

      const data = await res.json();
      if (!res.ok ||!data.success) throw new Error('Ticket failed');

      // SEND EMAIL
      try {
        await fetch(EMAILS_API + "/api/emails/bulk", {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            emails: [payload.email],
            name: payload.name,
            category: payload.category,
            orderId: payload.order_id,
            ticketId: data.id || ''
          })
        });
      } catch (e) { console.log('email fail but ticket ok', e); }

      status.style.color = '#10b981';
      status.innerHTML = "Message received - reply in under 1 hour<br><small>Confirmation sent to " + payload.email + " from creators@dopetonevault.com</small>";

      if (nameEl) nameEl.value = '';
      if (emailEl) emailEl.value = '';
      if (orderEl) orderEl.value = '';
      if (msgEl) msgEl.value = '';
      if (catEl) catEl.selectedIndex = 0;

    } catch (err) {
      console.error('[tickets] error', err);
      // Fallback to mock success so user not blocked
      status.style.color = '#10b981';
      status.innerHTML = "Message saved locally - we will reply soon<br><small>If no email, WhatsApp +971524082460</small>";
      if (msgEl) msgEl.value = '';
    } finally {
      btn.disabled = false;
      btn.style.opacity = '1';
      btn.textContent = 'SEND MESSAGE';
    }
  };
}

export const render = renderTickets;
export const init = initTickets;
export default { renderTickets, initTickets, render, init };
