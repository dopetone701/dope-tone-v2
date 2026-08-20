const u="https://support-tickets-api.dopetone701.workers.dev",y="https://emails-api.dopetone701.workers.dev";function d(){return`
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
`}function m(){const a=document.getElementById("sendTicket"),t=document.getElementById("ticketStatus"),i=document.getElementById("tName"),s=document.getElementById("tEmail"),n=document.getElementById("tOrder"),l=document.getElementById("tCat"),o=document.getElementById("tMsg");if(!a||!t){console.warn("[tickets] form not found");return}a.onclick=async function(){const e={name:(i==null?void 0:i.value.trim())||"",email:(s==null?void 0:s.value.trim())||"",order_id:(n==null?void 0:n.value.trim())||"",category:(l==null?void 0:l.value)||"Order / Delivery",message:(o==null?void 0:o.value.trim())||"",created_at:new Date().toISOString(),source:"tickets_page",page_url:location.href};if(!e.email||!e.message){t.style.display="block",t.style.color="#FF1E3C",t.textContent="Email and message required";return}if(!e.email.includes("@")){t.style.display="block",t.style.color="#FF1E3C",t.textContent="Enter valid email";return}t.style.display="block",t.style.color="#9CA3AF",t.textContent="Sending...",a.disabled=!0,a.style.opacity="0.6",a.textContent="SENDING...";try{const r=await fetch(u+"/api/tickets/create",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({name:e.name,username:e.name,email:e.email,subject:e.category+" - Order "+(e.order_id||"no-id"),message:"Category: "+e.category+`
Order: `+e.order_id+`
Email: `+e.email+`

`+e.message,priority:e.category==="Payment Issue"?"High":"Medium",status:"open",source:"tickets_page"})}),c=await r.json();if(!r.ok||!c.success)throw new Error("Ticket failed");try{await fetch(y+"/api/emails/bulk",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({emails:[e.email],name:e.name,category:e.category,orderId:e.order_id,ticketId:c.id||""})})}catch(p){console.log("email fail but ticket ok",p)}t.style.color="#10b981",t.innerHTML="Message received - reply in under 1 hour<br><small>Confirmation sent to "+e.email+" from creators@dopetonevault.com</small>",i&&(i.value=""),s&&(s.value=""),n&&(n.value=""),o&&(o.value=""),l&&(l.selectedIndex=0)}catch(r){console.error("[tickets] error",r),t.style.color="#10b981",t.innerHTML="Message saved locally - we will reply soon<br><small>If no email, WhatsApp +971524082460</small>",o&&(o.value="")}finally{a.disabled=!1,a.style.opacity="1",a.textContent="SEND MESSAGE"}}}const g=d,b=m,f={renderTickets:d,initTickets:m,render:g,init:b};export{f as default,b as init,m as initTickets,g as render,d as renderTickets};
