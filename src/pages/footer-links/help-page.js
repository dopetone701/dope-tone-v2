// src/pages/footer-links/help-page.js - V13.3 FINAL - SYNCED TO DT-ABOUT WORKING PATH - /public/ - GAP FIXED
const TICKETS_API = "https://support-tickets-api.dopetone701.workers.dev";
const EMAILS_API = "https://emails-api.dopetone701.workers.dev";
const IMG_LOGO = new URL('/public/images/logo.png', window.location.origin).href;
const IMG_BOSS = new URL('/public/images/dt-boss.png', window.location.origin).href;
const IMG_BOSS_LOGO = new URL('/public/images/dt-boss-logo.png', window.location.origin).href;
const IMG_FALLBACK = new URL('/public/images/default-user.png', window.location.origin).href;
const AUDIO_TAG = new URL('/public/audio/dt-pro-tag.wav', window.location.origin).href;

export function renderHelp() {
  return `
<div class="wrap" style="min-width:0; overflow-wrap:anywhere;">
  <div class="topbar" style="min-width:0; margin-bottom:16px;">
    <a href="#/home" data-link class="logo-link" style="display:flex;align-items:center;gap:10px;text-decoration:none;">
      <img src="${IMG_LOGO}" alt="logo" style="width:36px;height:36px;object-fit:contain;" onerror="this.style.display='none'">
      <span style="color:#fff;font-weight:600;">DOPE TONE</span>
    </a>
    <a href="#/home" data-link class="back-btn">Back to Home</a>
  </div>

  <div class="hero" id="help" style="min-width:0; overflow-wrap:anywhere; margin-bottom:28px; padding-bottom:28px;">
    <small>VAULT SUPPORT</small>
    <h1>How can we help?</h1>
    <p>Delivery, licenses, payments, vault access. Search below - 90% answers are instant.</p>
    <div class="search" style="margin-top:16px;"><input id="searchInput" placeholder="Search beats, licenses, orders, vault..."></div>
  </div>

  <div class="grid3" style="min-width:0; margin-bottom:28px;">
    <div class="card" data-scroll="faqSection"><span class="badge badge-blue">HELP</span><h3>Help Center</h3><p>How vault delivery works</p></div>
    <div class="card" data-scroll="ticketSection"><span class="badge badge-red">MESSAGE</span><h3>Send Message</h3><p>Order issue, wrong file, payment</p></div>
    <div class="card" data-scroll="licenseSection"><span class="badge badge-blue">LICENSE</span><h3>License Info</h3><p>Free / Basic / Pro / Exclusive</p></div>
  </div>

  <div class="split" style="min-width:0; margin-top:28px; gap:24px;">
    <div class="panel" id="faqSection">
      <h2>FAQ - Quick Answers</h2>
      <div class="acc"><h4>Where is my beat after payment? <span class="plus">+</span></h4><div class="ans" style="display:none">After Stripe/PayPal success you are redirected to <code>/licence/vault?session_id=cs_xxx</code>. We save <code>dopetone_last_session_id</code> in localStorage. Your files live in R2 Vault with signed URLs valid 24h. No account needed. If you closed tab, email us session_id or order ID.</div></div>
      <div class="acc"><h4>Why session_id is required? <span class="plus">+</span></h4><div class="ans" style="display:none">Only buyer with valid Stripe session_id can fetch R2 signed URLs. This prevents link sharing. Session proves payment - no login system needed for instant delivery.</div></div>
      <div class="acc"><h4>Payment & currency <span class="plus">+</span></h4><div class="ans" style="display:none">Stripe + PayPal Checkout V2. Base USD. AED auto-converted via Stripe FX. Apple Pay / Google Pay supported via Stripe. PayPal modal is instant - we call PayPal API with cart total.</div></div>
      <div class="acc"><h4>Refund policy? <span class="plus">+</span></h4><div class="ans" style="display:none">Digital product - no refund after download / signed URL generated. Exception: if file is corrupt, wrong beat delivered, duplicate charge. We replace in 12h via WhatsApp +971524082460. Chargebacks = license revoked automatically.</div></div>
      <div class="acc"><h4>How long do I have to download? <span class="plus">+</span></h4><div class="ans" style="display:none">Vault link valid 7 days, signed URLs 24h each. After 7 days email us to re-generate. Keep backup. Exclusive buyers get lifetime re-download.</div></div>
      <div class="acc"><h4>Do I need to credit Dope Tone? <span class="plus">+</span></h4><div class="ans" style="display:none">Free: Must credit "Prod. by Dope Tone". Basic/Pro: Must credit "Prod. by Dope Tone" in title/description. Exclusive: No credit required - you own it, beat removed from site.</div></div>
    </div>

    <div class="panel" id="ticketSection">
      <h2>Send Message</h2>
      <p class="muted">Fastest: WhatsApp +971 52 408 2460 - reply in 1h</p>
      <div class="form">
        <label>NAME</label><input id="tName" placeholder="Your name">
        <label>EMAIL</label><input id="tEmail" placeholder="you@email.com">
        <label>ORDER ID / SESSION ID</label><input id="tOrder" placeholder="cs_xxx or Order ID (optional)">
        <label>CATEGORY</label>
        <select id="tCat"><option>Order / Delivery</option><option>License Question</option><option>Payment Issue</option><option>File / Stems Issue</option><option>Custom Beat</option><option>Other</option></select>
        <label>MESSAGE</label><textarea id="tMsg" rows="5" placeholder="Describe issue, include beat title..."></textarea>
        <button class="btn" id="sendTicket">SEND MESSAGE</button>
        <p class="muted" id="ticketStatus" style="margin-top:10px;display:none"></p>
      </div>
    </div>
  </div>

   <div class="panel" id="licenseSection" style="margin-top:28px; min-width:0;">
    <h2>License Comparison</h2>
    <p class="muted">Basic = true price • Pro x2.2 • Exclusive x10 (min $149) • Instant PDF contract</p>
    <div class="licence-table-wrap">
      <table class="licence-table">
        <thead>
          <tr>
            <th>FEATURE</th>
            <th><span class="th-free">FREE</span><small>$0 Tagged</small></th>
            <th><span class="th-basic">BASIC</span><small>Starter</small></th>
            <th><span class="th-pro">PRO</span><small>Best Value</small></th>
            <th><span class="th-ex">EXCLUSIVE</span><small>Full Own</small></th>
          </tr>
        </thead>
        <tbody>
          <tr><td>Files</td><td>MP3 Tagged</td><td>MP3 320kbps</td><td>MP3 + WAV</td><td>MP3+WAV+STEMS</td></tr>
          <tr><td>Quality</td><td>128kbps</td><td>320kbps Untagged</td><td>WAV 24-bit</td><td>WAV + Trackout</td></tr>
          <tr><td>Streams</td><td>0 - Practice only</td><td>5,000</td><td>100,000</td><td>Unlimited</td></tr>
          <tr><td>Videos</td><td>1 Non-profit</td><td>1 Monetized</td><td>Unlimited</td><td>Unlimited</td></tr>
          <tr><td>Monetize</td><td>❌ No</td><td>✅ Limited</td><td>✅ Yes</td><td>✅ 100% You</td></tr>
          <tr><td>Radio</td><td>No</td><td>No</td><td>1 Station</td><td>Unlimited</td></tr>
          <tr><td>Term</td><td>1 Year</td><td>3 Years</td><td>10 Years</td><td>Lifetime</td></tr>
          <tr><td>Credit</td><td>Required</td><td>Required</td><td>Required</td><td>Optional</td></tr>
          <tr><td>Rights</td><td>Non-excl</td><td>Non-excl</td><td>Non-excl</td><td>Full Ownership</td></tr>
        </tbody>
      </table>
    </div>
    <div class="licence-cards">
      <div class="lic-card free"><div class="lic-head"><strong>FREE</strong><span>$0 Tagged</span></div><ul><li>MP3 Tagged 128kbps</li><li>Non-profit only</li><li>No monetization</li><li>Credit required</li><li>1 Year</li></ul></div>
      <div class="lic-card basic"><div class="lic-head"><strong>BASIC</strong><span>Starter - Most use</span></div><ul><li>MP3 320kbps Untagged</li><li>5k streams, 1 video</li><li>Monetized limited</li><li>3 Years, credit req</li><li>PDF contract instant</li></ul></div>
      <div class="lic-card pro"><div class="lic-head"><strong>PRO</strong><span>Best Value - Recommended</span></div><ul><li>MP3 + WAV 24-bit</li><li>100k streams, unlimited videos</li><li>YouTube/Spotify OK</li><li>10 Years, radio 1 station</li><li>Trackout on request</li></ul></div>
      <div class="lic-card ex"><div class="lic-head"><strong>EXCLUSIVE</strong><span>Full Ownership - Beat removed</span></div><ul><li>MP3 + WAV + STEMS + Trackout</li><li>Unlimited everything</li><li>Lifetime ownership</li><li>No credit required</li><li>Exclusive contract + removed from Vault</li></ul></div>
    </div>
    <div style="margin-top:14px;padding:12px;background:rgba(255,30,60,0.06);border:1px solid rgba(255,30,60,0.15);border-radius:10px;font-size:12px;line-height:1.6;overflow-wrap:anywhere;">
      <strong style="color:#FF1E3C;">Cannot:</strong> Resell beat as-is, share STEMS/WAV, re-license. Free = no commercial. Chargeback = license revoked. All licenses single artist/project.
    </div>
  </div>

  <div class="panel" id="termsSection" style="margin-top:28px">
    <h2>Terms of Use - DOPE TONE VAULT</h2>
    <p class="muted" style="margin-bottom:18px;">Dubai, UAE - Effective May 10, 2026 - Version 2.2</p>
    <h3 style="font-size:14px;margin:18px 0 8px;color:#fff;">1. Acceptance</h3>
    <p style="font-size:13px;line-height:1.7;color:#9AA6C0;margin-bottom:12px;">By accessing dopetonevault.com, purchasing or downloading any product, you agree to these Terms. Dope Tone Vault is operated by Emma Prince Don Fitchner, sole proprietor, Dubai, UAE. If you do not agree, do not use Vault.</p>
    <h3 style="font-size:14px;margin:18px 0 8px;color:#fff;">2. Products & Delivery</h3>
    <p style="font-size:13px;line-height:1.7;color:#9AA6C0;margin-bottom:12px;">All products are digital. Beats delivered via R2 Vault signed URLs after Stripe/PayPal session verification. No physical shipment. Delivery is instant but requires valid session_id. Vault links valid 7 days, signed URLs 24h. Exclusive buyers get lifetime re-download via email request. You are responsible for backing up files after download.</p>
    <h3 style="font-size:14px;margin:18px 0 8px;color:#fff;">3. Licensing</h3>
    <p style="font-size:13px;line-height:1.7;color:#9AA6C0;margin-bottom:12px;">Every beat sale is a license, not ownership, except Exclusive. License type (Free/Basic/Pro/Exclusive) determines your rights as per comparison table above. All licenses are non-transferable, single artist/project. You cannot sub-license, resell beat as-is, or share STEMS. Free beats: non-profit, must credit, no monetization. Basic: 5k streams limit. Pro: 100k streams, trackout on request. Exclusive: full ownership transferred, beat removed from store, unlimited rights. Credit required for all except Exclusive.</p>
    <h3 style="font-size:14px;margin:18px 0 8px;color:#fff;">4. Payments & Refunds</h3>
    <p style="font-size:13px;line-height:1.7;color:#9AA6C0;margin-bottom:12px;">Payments via Stripe (cards, Apple Pay, Google Pay) and PayPal V2. USD base, AED converted at Stripe FX rate. No refund after download or signed URL generation. Exceptions: corrupt file, wrong file delivered, duplicate charge - we replace or refund within 12h if reported via WhatsApp +971524082460 with session_id. Chargeback or PayPal dispute without contacting us first = immediate license revocation + blacklist from Vault.</p>
    <h3 style="font-size:14px;margin:18px 0 8px;color:#fff;">5. Prohibited Uses</h3>
    <p style="font-size:13px;line-height:1.7;color:#9AA6C0;margin-bottom:12px;">You may NOT: (a) Resell beat as-is on BeatStars/Airbit etc (b) Claim you produced beat (except Exclusive where credit optional) (c) Use beat in hate, pornographic, defamatory content (d) Share WAV/STEMS with other producers (e) Use Free license commercially. Violation = license terminated, DMCA takedown, legal action under UAE law.</p>
    <h3 style="font-size:14px;margin:18px 0 8px;color:#fff;">6. Intellectual Property</h3>
    <p style="font-size:13px;line-height:1.7;color:#9AA6C0;margin-bottom:12px;">All beats, artwork, tags, vault UI, dt-about page content © 2023-2026 Dope Tone Vault. Samples used in beats are cleared or royalty-free. You receive license to create derivative works (songs) but not ownership of underlying beat (except Exclusive). Dope Tone retains right to showcase your song using our beat for promotion unless Exclusive.</p>
    <h3 style="font-size:14px;margin:18px 0 8px;color:#fff;">7. Limitation & Governing Law</h3>
    <p style="font-size:13px;line-height:1.7;color:#9AA6C0;margin-bottom:12px;">Vault provided as-is. Max liability = amount you paid. Not liable for lost profits, missed releases. Governing law: Dubai, UAE, DIFC Courts. Disputes first via email creators@dopetonevault.com - we resolve in 48h. Continued use after Terms update = acceptance. Questions: creators@dopetonevault.com / +971524082460.</p>
  </div>

  <div class="panel" id="privacySection" style="margin-top:28px">
    <h2>Privacy Policy - Dope Tone Vault</h2>
    <p class="muted" style="margin-bottom:18px;">Effective May 10, 2026 - We respect your privacy. Minimal data, maximum security.</p>
    <h3 style="font-size:14px;margin:18px 0 8px;color:#fff;">1. What We Collect</h3>
    <p style="font-size:13px;line-height:1.7;color:#9AA6C0;margin-bottom:12px;"><strong style="color:#fff;">No account needed.</strong> We collect: (a) Email you enter at checkout or contact form (b) Stripe session_id / PayPal order_id for delivery verification (c) IP + user-agent for fraud prevention (Cloudflare) (d) Cart items stored in localStorage <code>dopetone_cart</code> and <code>dopetone_licences</code> - stays in your browser. We do NOT collect: passwords, full card numbers (Stripe handles), address unless you provide for custom beat.</p>
    <h3 style="font-size:14px;margin:18px 0 8px;color:#fff;">2. How We Use</h3>
    <p style="font-size:13px;line-height:1.7;color:#9AA6C0;margin-bottom:12px;">Email used only for: delivery of vault link, license PDF, support reply, and if you opt-in, new drop alerts (max 2/month). Session_id used to generate R2 signed URLs. We never sell data. Support tickets stored in Cloudflare Workers KV via support-tickets-api. Emails sent via emails-api worker. No third-party marketing.</p>
    <h3 style="font-size:14px;margin:18px 0 8px;color:#fff;">3. Cookies & Local Storage</h3>
    <p style="font-size:13px;line-height:1.7;color:#9AA6C0;margin-bottom:12px;">We use localStorage only: <code>dopetone_cart</code> (your cart), <code>dopetone_licences</code> (selected license per beat), <code>dopetone_last_session_id</code> (last payment). No tracking cookies, no Facebook Pixel unless you consent in future. Cloudflare sets __cf_bm for bot protection. You can clear localStorage anytime - you will lose cart but not purchased files (email us session_id to restore).</p>
    <h3 style="font-size:14px;margin:18px 0 8px;color:#fff;">4. Third Parties</h3>
    <p style="font-size:13px;line-height:1.7;color:#9AA6C0;margin-bottom:12px;">Payments: Stripe Inc. and PayPal Inc. handle all card data - we never see full card. Hosting: Cloudflare Pages + R2 Storage (files), Cloudflare Workers (APIs). Analytics: Cloudflare Web Analytics (privacy-first, no cookies). Support: WhatsApp if you message us. All third parties GDPR/CCPA compliant.</p>
    <h3 style="font-size:14px;margin:18px 0 8px;color:#fff;">5. Your Rights</h3>
    <p style="font-size:13px;line-height:1.7;color:#9AA6C0;margin-bottom:12px;">You can: request copy of your data (email + session_ids), request deletion (we delete tickets + email logs, but Stripe retains transaction logs for 7 years per UAE law), opt-out of new drop emails via unsubscribe link. Exclusive buyers: your beat is removed from store, we keep record of transfer for legal proof. Contact: creators@dopetonevault.com with subject "Privacy Request". Reply in 48h.</p>
    <h3 style="font-size:14px;margin:18px 0 8px;color:#fff;">6. Security & Contact</h3>
    <p style="font-size:13px;line-height:1.7;color:#9AA6C0;margin-bottom:12px;">R2 files are private, served via presigned URLs expiring in 24h. Workers APIs are rate-limited. We use HTTPS everywhere. No password database to hack because no accounts. If you believe data leaked, email creators@dopetonevault.com immediately + WhatsApp +971524082460. Data controller: Emma Prince Don Fitchner, Dubai, UAE.</p>
  </div>
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
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
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
      if (statusEl) { statusEl.style.display = 'block'; statusEl.style.color = '#ef4444'; statusEl.textContent = 'Please fill name, email and your message.'; }
      return;
    }
    sendBtn.disabled = true; sendBtn.textContent = 'SENDING...';
    if (statusEl) { statusEl.style.display = 'block'; statusEl.style.color = '#888'; statusEl.textContent = 'Sending your message...'; }
    try {
      const res = await fetch(TICKETS_API + "/api/tickets/create", {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name, username: name, email: email, subject: category + " - Order " + (orderId || 'no-id'), message: "Category: " + category + "\nOrder: " + orderId + "\nEmail: " + email + "\n\n" + message, priority: 'Medium', status: 'open', source: 'help_page' })
      });
      const data = await res.json();
      if (!res.ok ||!data.success) throw new Error('Failed');
      const ticketId = data.id || '';
      try {
        await fetch(EMAILS_API + "/api/emails/bulk", {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ emails: [email], name: name, category: category, orderId: orderId, ticketId: ticketId })
        });
      } catch (e) { console.log('Email failed but ticket saved', e); }
      if (statusEl) { statusEl.style.color = '#10b981'; statusEl.innerHTML = categoryMessages[category] + "<br><span style='font-size:11px;color:#666'>Email sent to " + email + "</span>"; }
      if (nameEl) nameEl.value = ''; if (emailEl) emailEl.value = ''; if (orderEl) orderEl.value = ''; if (msgEl) msgEl.value = ''; if (catEl) catEl.selectedIndex = 0;
    } catch (err) {
      console.log(err);
      if (statusEl) { statusEl.style.color = '#ef4444'; statusEl.textContent = 'Could not send - WhatsApp +971524082460'; }
    } finally { sendBtn.disabled = false; sendBtn.textContent = 'SEND MESSAGE'; }
  };
}

export const render = renderHelp;
export const init = initHelp;
export default { renderHelp, initHelp, render, init };
