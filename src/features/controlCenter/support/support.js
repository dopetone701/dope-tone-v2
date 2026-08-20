// src/features/controlCenter/support/support.js
// SUPPORT V2 FINAL - STICKY HEADER + CENTERED MODAL ABOVE PLAYER - FIFO
const API = "https://support-tickets-api.dopetone701.workers.dev";
const EMAILS_API = "https://emails-api.dopetone701.workers.dev";
let tickets = [];
let activeTab = 'active';

export async function mountSupport(container){
  container.innerHTML = `
  <div id="supportRoot" style="height:calc(100dvh - 150px); display:flex; flex-direction:column; overflow:hidden; background:#080808; border:1px solid #1e1e1e; border-radius:16px; margin-top:8px">
    <div style="position:sticky; top:0; z-index:30; background:#080808; flex-shrink:0; border-bottom:1px solid #1a1a1a">
      <div id="ticketHeader" style="display:flex; justify-content:space-between; align-items:center; padding:16px 20px 10px 20px">
        <h1 style="color:#fff; font-size:20px; font-weight:900; margin:0; letter-spacing:.5px">SUPPORT <span id="ticketCount" style="color:#666; font-weight:400">(0)</span></h1>
        <button id="ticketRefreshBtn" style="background:#1a1a1a; border:1px solid #2a2a2a; color:#aaa; padding:6px 12px; border-radius:99px; font-size:11px; cursor:pointer">Refresh</button>
      </div>
      <div style="padding:0 20px 12px 20px; display:flex; gap:8px">
        <button id="tab-active" onclick="switchTab('active')" style="padding:7px 14px;border-radius:99px;border:1px solid #222;background:#fff;color:#000;font-weight:800;font-size:12px">INBOX</button>
        <button id="tab-resolved" onclick="switchTab('resolved')" style="padding:7px 14px;border-radius:99px;border:1px solid #1a1a1a;background:#111;color:#666;font-weight:700;font-size:12px">RESOLVED</button>
      </div>
    </div>
    <div id="supportWrap" style="flex:1; overflow:auto; -webkit-overflow-scrolling:touch">
      <div id="ticketList" style="min-height:300px"></div>
    </div>
  `;
  document.getElementById('ticketRefreshBtn')?.addEventListener('click', load);
  await load();
}
export async function renderSupportPage(c){ return mountSupport(c); }
export async function initTickets(){ await mountSupport(document.getElementById('cc-main-page')); }

window.switchTab = async (tab)=>{
  activeTab = tab;
  const a = document.getElementById('tab-active'), r = document.getElementById('tab-resolved');
  if(a&&r){
    a.style.background = tab==='active'?'#fff':'#111'; a.style.color = tab==='active'?'#000':'#666';
    r.style.background = tab==='resolved'?'#fff':'#111'; r.style.color = tab==='resolved'?'#000':'#666';
  }
  await load();
};

async function load(){
  try{
    const res = await fetch(`${API}/api/tickets/list?status=${activeTab}&t=${Date.now()}`);
    const data = await res.json();
    tickets = (data.tickets||[]).sort((a,b)=> new Date(a.created_at)-new Date(b.created_at));
  }catch(e){ tickets = []; }
  render();
}

function render(){
  const list = document.getElementById('ticketList');
  const count = document.getElementById('ticketCount');
  if(!list) return;
  if(count) count.textContent = `(${tickets.length})`;
  if(!tickets.length){
    list.innerHTML=`<div style="padding:60px 20px;text-align:center;color:#333">
      <div style="font-size:32px;margin-bottom:10px">${activeTab==='active'?'✅':'📦'}</div>
      <div style="color:#666;font-weight:700">${activeTab==='active'?'Inbox zero - all caught up!':'No resolved tickets yet'}</div>
      <div style="color:#333;font-size:11px;margin-top:6px">${activeTab==='active'?'Everything saved in D1 forever':'Resolved tickets stay in D1 for security'}</div>
    </div>`;
    return;
  }
  list.innerHTML = tickets.map((t,i)=>{
    const mins = Math.floor((Date.now()-new Date(t.created_at))/60000);
    const isNext = i===0 && t.status==='open' && activeTab==='active';
    const statusColor = t.status==='open' ? '#facc15' : t.status==='replied' ? '#00ff88' : '#666';
    return `<div onclick="openTicket('${t.id}')" style="display:flex;gap:12px;padding:14px 20px;border-bottom:1px solid #111;background:${isNext?'#1a1500':'transparent'};border-left:${isNext?'3px solid #facc15':'3px solid transparent'};cursor:pointer">
      <div style="font-weight:900;color:${isNext?'#facc15':'#333'};font-size:12px">#${i+1}${isNext?' 🔥':''}</div>
      <div style="flex:1;min-width:0">
        <div style="color:#fff;font-size:13px;font-weight:700;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${t.subject || t.category} - ${t.id}</div>
        <div style="color:#666;font-size:11px;margin-top:2px">${t.email} • ${mins<60?`${mins}m`:Math.floor(mins/60)+'h'} • <span style="color:${statusColor}">${(t.status||'open').toUpperCase()}</span></div>
        <div style="color:#888;font-size:12px;margin-top:4px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${(t.message||'').slice(0,80)}</div>
      </div>
      <div style="font-size:10px;color:${mins>60?'#ef4444':'#333'};white-space:nowrap">${mins<60?mins+'m':Math.floor(mins/60)+'h'}</div>
    </div>`;
  }).join('');
}

window.openTicket = (id)=>{
  const t = tickets.find(x=>x.id===id);
  if(!t) return;
  const pos = tickets.findIndex(x=>x.id===id)+1;
  const isResolvedTab = activeTab==='resolved';
  document.getElementById('tm')?.remove();
  document.body.insertAdjacentHTML('beforeend', `<div id="tm" onclick="if(event.target.id==='tm')this.remove()" style="position:fixed;inset:0 0 80px 0;background:rgba(0,0,0,.88);z-index:100000;display:flex;align-items:center;justify-content:center;padding:16px;">
    <div style="background:#0f0f0f;border:1px solid #222;border-radius:16px;max-width:620px;width:100%;max-height:min(640px, calc(100dvh - 140px));display:flex;flex-direction:column;overflow:hidden;box-shadow:0 20px 80px #000">
      <div style="padding:14px 18px;border-bottom:1px solid #1a1a1a;display:flex;justify-content:space-between;align-items:center;flex-shrink:0;position:sticky;top:0;z-index:2;background:#0f0f0f">
        <div>
          <div style="color:${isResolvedTab?'#666':'#facc15'};font-weight:900;font-size:12px;letter-spacing:0.5px">${isResolvedTab?`ARCHIVED #${t.id}`:`QUEUE #${pos} ${pos===1?'• NEXT TO SERVE 🔥':''}`}</div>
          <div style="color:#555;font-size:11px;margin-top:2px">${t.category||'Other'} • ${t.order_id||'no-order'}</div>
        </div>
        <button onclick="document.getElementById('tm').remove()" style="background:#1a1a1a;color:#fff;border:0;width:28px;height:28px;border-radius:50%;cursor:pointer">×</button>
      </div>
      <div style="overflow:auto;flex:1;padding:16px">
        <div style="color:#666;font-size:11px">${t.name||''} • ${t.email} • ${new Date(t.created_at).toLocaleString()}</div>
        <div style="color:#fff;font-weight:800;margin:8px 0 10px 0;font-size:14px">${t.subject||''}</div>
        <div style="background:#000;border:1px solid #1a1a1a;border-radius:10px;padding:12px;color:#ccc;font-size:12px;white-space:pre-wrap;line-height:1.6">Category: ${t.category||''}
Order: ${t.order_id||''}
Email: ${t.email}

${t.message||''}</div>
        ${t.reply_message?`<div style="margin-top:12px;background:#0a1a0f;border:1px solid #123a1f;border-radius:10px;padding:10px"><div style="color:#00ff88;font-size:9px;font-weight:800;margin-bottom:4px">YOUR REPLY SENT:</div><div style="color:#ddd;font-size:12px;white-space:pre-wrap">${t.reply_message}</div></div>`:''}
        ${!isResolvedTab?`<div style="margin-top:14px"><div style="color:#888;font-size:10px;font-weight:700;margin-bottom:6px;letter-spacing:0.5px">REPLY TO CUSTOMER (creators@dopetonevault.com)</div><textarea id="reply-text" placeholder="Type your reply... e.g. Hey, checked your order DT-... here's your fresh link: https://..." style="width:100%;min-height:80px;background:#000;border:1px solid #222;border-radius:10px;padding:10px;color:#fff;font-size:13px;resize:none;outline:none;box-sizing:border-box"></textarea></div>`:''}
      </div>
      ${!isResolvedTab?`
      <div style="padding:12px 16px;border-top:1px solid #1a1a1a;background:#0f0f0f;flex-shrink:0;position:sticky;bottom:0;z-index:2">
        <div style="display:flex;gap:10px">
          <button id="reply-btn" onclick="replyTicket('${t.id}')" style="flex:1;padding:12px;background:#fff;color:#000;border:0;border-radius:99px;font-weight:900;font-size:12px;cursor:pointer">SEND REPLY →</button>
          <button onclick="resolveTicket('${t.id}')" style="flex:1;padding:12px;background:${t.status!=='open'?'#10b981':'#1a1a1a'};color:${t.status!=='open'?'#000':'#555'};border:0;border-radius:99px;font-weight:800;font-size:12px;cursor:${t.status!=='open'?'pointer':'not-allowed'}" ${t.status==='open'?'disabled title="Reply first"':''}>${t.status!=='open'?'RESOLVE & CLEAN ✅':'REPLY FIRST 🔒'}</button>
        </div>
        <div style="margin-top:8px;text-align:center;color:#444;font-size:9px">Reply → email with logo → Resolve = inbox clean, saved in D1 forever</div>
      </div>
      `:`<div style="padding:12px 16px;border-top:1px solid #1a1a1a;flex-shrink:0;text-align:center"><button onclick="reopenTicket('${t.id}')" style="padding:9px 16px;background:#111;border:1px solid #222;color:#666;border-radius:99px;font-size:11px;cursor:pointer">Re-open ticket</button></div>`}
    </div>
  </div>`);
};

window.replyTicket = async (id)=>{
  const t = tickets.find(x=>x.id===id);
  if(!t) return;
  const msg = document.getElementById('reply-text')?.value?.trim();
  if(!msg) return alert('Write reply first!');
  const btn = document.getElementById('reply-btn');
  const original = btn.innerHTML;
  btn.innerHTML='Sending email...'; btn.disabled=true;
  try{
    const emailRes = await fetch(`${EMAILS_API}/api/emails/bulk`,{
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body: JSON.stringify({
        emails:[t.email],
        name: t.name || t.email.split('@')[0],
        category: t.category || 'Other',
        orderId: t.order_id || '',
        ticketId: t.id,
        subject: `Re: ${t.subject} [${t.id}]`,
        h2: `Update on your request`,
        p: `${msg}\n\n---\nOriginal: ${t.message.slice(0,200)}\nNeed more? Reply to this email or visit https://dopetonevault.com/help`
      })
    });
    const emailData = await emailRes.json();
    if(!emailRes.ok) throw new Error(emailData.error||'Email failed');
    await fetch(`${API}/api/tickets/reply`,{method:'POST',headers:{'Content-Type':'application/json'},body: JSON.stringify({id, replyMessage: msg})});
    alert(`✅ Reply sent to ${t.email}\nFrom: creators@dopetonevault.com\nStatus: REPLIED`);
    document.getElementById('tm')?.remove();
    await load();
  }catch(e){
    alert('Failed: '+e.message);
    btn.innerHTML=original; btn.disabled=false;
  }
};

window.resolveTicket = async (id)=>{
  if(!confirm('Resolve this? It will disappear from INBOX but stay saved in D1 → RESOLVED tab forever.')) return;
  const res = await fetch(`${API}/api/tickets/resolve`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({id})});
  const d = await res.json();
  if(!d.success){ alert(d.error||'Failed'); return; }
  document.getElementById('tm')?.remove();
  await load();
};

window.reopenTicket = async (id)=>{
  try{ await fetch(`${API}/api/tickets/resolve`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({id, action:'reopen'})}); }catch{}
  document.getElementById('tm')?.remove();
  await window.switchTab('active');
};

window.closeTicket = window.resolveTicket;
export { load as refreshTickets, load as loadTickets };
export default { initTickets, loadTickets: load };

