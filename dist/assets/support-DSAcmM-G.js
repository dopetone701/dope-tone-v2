const c="https://support-tickets-api.dopetone701.workers.dev",v="https://emails-api.dopetone701.workers.dev";let d=[],a="active";async function x(o){var e;o.innerHTML=`
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
  `,(e=document.getElementById("ticketRefreshBtn"))==null||e.addEventListener("click",l),await l()}async function m(o){return x(o)}async function u(){await x(document.getElementById("cc-main-page"))}window.switchTab=async o=>{a=o;const e=document.getElementById("tab-active"),t=document.getElementById("tab-resolved");e&&t&&(e.style.background=o==="active"?"#fff":"#111",e.style.color=o==="active"?"#000":"#666",t.style.background=o==="resolved"?"#fff":"#111",t.style.color=o==="resolved"?"#000":"#666"),await l()};async function l(){try{d=((await(await fetch(`${c}/api/tickets/list?status=${a}&t=${Date.now()}`)).json()).tickets||[]).sort((t,i)=>new Date(t.created_at)-new Date(i.created_at))}catch{d=[]}g()}function g(){const o=document.getElementById("ticketList"),e=document.getElementById("ticketCount");if(o){if(e&&(e.textContent=`(${d.length})`),!d.length){o.innerHTML=`<div style="padding:60px 20px;text-align:center;color:#333">
      <div style="font-size:32px;margin-bottom:10px">${a==="active"?"✅":"📦"}</div>
      <div style="color:#666;font-weight:700">${a==="active"?"Inbox zero - all caught up!":"No resolved tickets yet"}</div>
      <div style="color:#333;font-size:11px;margin-top:6px">${a==="active"?"Everything saved in D1 forever":"Resolved tickets stay in D1 for security"}</div>
    </div>`;return}o.innerHTML=d.map((t,i)=>{const n=Math.floor((Date.now()-new Date(t.created_at))/6e4),r=i===0&&t.status==="open"&&a==="active",p=t.status==="open"?"#facc15":t.status==="replied"?"#00ff88":"#666";return`<div onclick="openTicket('${t.id}')" style="display:flex;gap:12px;padding:14px 20px;border-bottom:1px solid #111;background:${r?"#1a1500":"transparent"};border-left:${r?"3px solid #facc15":"3px solid transparent"};cursor:pointer">
      <div style="font-weight:900;color:${r?"#facc15":"#333"};font-size:12px">#${i+1}${r?" 🔥":""}</div>
      <div style="flex:1;min-width:0">
        <div style="color:#fff;font-size:13px;font-weight:700;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${t.subject||t.category} - ${t.id}</div>
        <div style="color:#666;font-size:11px;margin-top:2px">${t.email} • ${n<60?`${n}m`:Math.floor(n/60)+"h"} • <span style="color:${p}">${(t.status||"open").toUpperCase()}</span></div>
        <div style="color:#888;font-size:12px;margin-top:4px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${(t.message||"").slice(0,80)}</div>
      </div>
      <div style="font-size:10px;color:${n>60?"#ef4444":"#333"};white-space:nowrap">${n<60?n+"m":Math.floor(n/60)+"h"}</div>
    </div>`}).join("")}}window.openTicket=o=>{var n;const e=d.find(r=>r.id===o);if(!e)return;const t=d.findIndex(r=>r.id===o)+1,i=a==="resolved";(n=document.getElementById("tm"))==null||n.remove(),document.body.insertAdjacentHTML("beforeend",`<div id="tm" onclick="if(event.target.id==='tm')this.remove()" style="position:fixed;inset:0 0 80px 0;background:rgba(0,0,0,.88);z-index:100000;display:flex;align-items:center;justify-content:center;padding:16px;">
    <div style="background:#0f0f0f;border:1px solid #222;border-radius:16px;max-width:620px;width:100%;max-height:min(640px, calc(100dvh - 140px));display:flex;flex-direction:column;overflow:hidden;box-shadow:0 20px 80px #000">
      <div style="padding:14px 18px;border-bottom:1px solid #1a1a1a;display:flex;justify-content:space-between;align-items:center;flex-shrink:0;position:sticky;top:0;z-index:2;background:#0f0f0f">
        <div>
          <div style="color:${i?"#666":"#facc15"};font-weight:900;font-size:12px;letter-spacing:0.5px">${i?`ARCHIVED #${e.id}`:`QUEUE #${t} ${t===1?"• NEXT TO SERVE 🔥":""}`}</div>
          <div style="color:#555;font-size:11px;margin-top:2px">${e.category||"Other"} • ${e.order_id||"no-order"}</div>
        </div>
        <button onclick="document.getElementById('tm').remove()" style="background:#1a1a1a;color:#fff;border:0;width:28px;height:28px;border-radius:50%;cursor:pointer">×</button>
      </div>
      <div style="overflow:auto;flex:1;padding:16px">
        <div style="color:#666;font-size:11px">${e.name||""} • ${e.email} • ${new Date(e.created_at).toLocaleString()}</div>
        <div style="color:#fff;font-weight:800;margin:8px 0 10px 0;font-size:14px">${e.subject||""}</div>
        <div style="background:#000;border:1px solid #1a1a1a;border-radius:10px;padding:12px;color:#ccc;font-size:12px;white-space:pre-wrap;line-height:1.6">Category: ${e.category||""}
Order: ${e.order_id||""}
Email: ${e.email}

${e.message||""}</div>
        ${e.reply_message?`<div style="margin-top:12px;background:#0a1a0f;border:1px solid #123a1f;border-radius:10px;padding:10px"><div style="color:#00ff88;font-size:9px;font-weight:800;margin-bottom:4px">YOUR REPLY SENT:</div><div style="color:#ddd;font-size:12px;white-space:pre-wrap">${e.reply_message}</div></div>`:""}
        ${i?"":`<div style="margin-top:14px"><div style="color:#888;font-size:10px;font-weight:700;margin-bottom:6px;letter-spacing:0.5px">REPLY TO CUSTOMER (creators@dopetonevault.com)</div><textarea id="reply-text" placeholder="Type your reply... e.g. Hey, checked your order DT-... here's your fresh link: https://..." style="width:100%;min-height:80px;background:#000;border:1px solid #222;border-radius:10px;padding:10px;color:#fff;font-size:13px;resize:none;outline:none;box-sizing:border-box"></textarea></div>`}
      </div>
      ${i?`<div style="padding:12px 16px;border-top:1px solid #1a1a1a;flex-shrink:0;text-align:center"><button onclick="reopenTicket('${e.id}')" style="padding:9px 16px;background:#111;border:1px solid #222;color:#666;border-radius:99px;font-size:11px;cursor:pointer">Re-open ticket</button></div>`:`
      <div style="padding:12px 16px;border-top:1px solid #1a1a1a;background:#0f0f0f;flex-shrink:0;position:sticky;bottom:0;z-index:2">
        <div style="display:flex;gap:10px">
          <button id="reply-btn" onclick="replyTicket('${e.id}')" style="flex:1;padding:12px;background:#fff;color:#000;border:0;border-radius:99px;font-weight:900;font-size:12px;cursor:pointer">SEND REPLY →</button>
          <button onclick="resolveTicket('${e.id}')" style="flex:1;padding:12px;background:${e.status!=="open"?"#10b981":"#1a1a1a"};color:${e.status!=="open"?"#000":"#555"};border:0;border-radius:99px;font-weight:800;font-size:12px;cursor:${e.status!=="open"?"pointer":"not-allowed"}" ${e.status==="open"?'disabled title="Reply first"':""}>${e.status!=="open"?"RESOLVE & CLEAN ✅":"REPLY FIRST 🔒"}</button>
        </div>
        <div style="margin-top:8px;text-align:center;color:#444;font-size:9px">Reply → email with logo → Resolve = inbox clean, saved in D1 forever</div>
      </div>
      `}
    </div>
  </div>`)};window.replyTicket=async o=>{var r,p,f;const e=d.find(s=>s.id===o);if(!e)return;const t=(p=(r=document.getElementById("reply-text"))==null?void 0:r.value)==null?void 0:p.trim();if(!t)return alert("Write reply first!");const i=document.getElementById("reply-btn"),n=i.innerHTML;i.innerHTML="Sending email...",i.disabled=!0;try{const s=await fetch(`${v}/api/emails/bulk`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({emails:[e.email],name:e.name||e.email.split("@")[0],category:e.category||"Other",orderId:e.order_id||"",ticketId:e.id,subject:`Re: ${e.subject} [${e.id}]`,h2:"Update on your request",p:`${t}

---
Original: ${e.message.slice(0,200)}
Need more? Reply to this email or visit https://dopetonevault.com/help`})}),y=await s.json();if(!s.ok)throw new Error(y.error||"Email failed");await fetch(`${c}/api/tickets/reply`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({id:o,replyMessage:t})}),alert(`✅ Reply sent to ${e.email}
From: creators@dopetonevault.com
Status: REPLIED`),(f=document.getElementById("tm"))==null||f.remove(),await l()}catch(s){alert("Failed: "+s.message),i.innerHTML=n,i.disabled=!1}};window.resolveTicket=async o=>{var i;if(!confirm("Resolve this? It will disappear from INBOX but stay saved in D1 → RESOLVED tab forever."))return;const t=await(await fetch(`${c}/api/tickets/resolve`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({id:o})})).json();if(!t.success){alert(t.error||"Failed");return}(i=document.getElementById("tm"))==null||i.remove(),await l()};window.reopenTicket=async o=>{var e;try{await fetch(`${c}/api/tickets/resolve`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({id:o,action:"reopen"})})}catch{}(e=document.getElementById("tm"))==null||e.remove(),await window.switchTab("active")};window.closeTicket=window.resolveTicket;const b={initTickets:u,loadTickets:l};export{b as default,u as initTickets,l as loadTickets,x as mountSupport,l as refreshTickets,m as renderSupportPage};
