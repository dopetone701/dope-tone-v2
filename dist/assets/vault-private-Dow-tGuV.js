const p="https://vault-orders-api.dopetone701.workers.dev",m={free:{mp3:!0,wav:!1,stems:!1,label:"FREE",includes:["MP3 (tagged)"],streams:"No streaming",rights:"Tagged • Non-profit • Practice only • No monetization"},basic:{mp3:!0,wav:!0,stems:!1,label:"BASIC",includes:["MP3","WAV","No stems"],streams:"5,000 streams",rights:"Commercial use • Limited use • MP3 + WAV delivery"},pro:{mp3:!0,wav:!0,stems:!0,label:"PRO",includes:["MP3","WAV","STEMS"],streams:"50,000 streams",rights:"Monetization • Advanced use • Trackout included"},exclusive:{mp3:!0,wav:!0,stems:!0,label:"EXCLUSIVE",includes:["MP3","WAV","STEMS"],streams:"Unlimited streams",rights:"Full ownership • Beat removed from store • Commercial rights • Resale rights"}};function f(o){const s=(o||"basic").toLowerCase();return s.includes("exclusive")?m.exclusive:s.includes("pro")?m.pro:s.includes("free")?m.free:m.basic}function x(o,s){const i=new Blob([s],{type:"text/plain"}),n=URL.createObjectURL(i),d=document.createElement("a");d.href=n,d.download=o,d.click(),setTimeout(()=>URL.revokeObjectURL(n),1e3)}function h(){return`
  <style>
  :root{--navy:#0A1931;--void:#050A14;--card:#111c36;--card2:#0a122a;--red:#FF1E3C;--blue:#1E90FF;--white:#FFFFFF;--muted:#9CA3AF;--border:rgba(255,255,255,0.1)}
.vault-wrap{max-width:900px;margin:0 auto;padding:24px;min-height:80vh}
.vault-head{background:linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.02));border:1px solid var(--border);border-radius:20px;padding:22px;margin-bottom:16px;backdrop-filter:blur(20px)}
.vault-card{background:var(--card);border:1px solid var(--border);border-radius:20px;padding:20px;margin:14px 0}
.v-btn{display:inline-flex;padding:11px 14px;border-radius:12px;text-decoration:none;font-weight:700;font-size:12px;margin:6px 6px 0 0;border:0;cursor:pointer}
.v-btn-mp3{background:var(--white);color:#000}
.v-btn-wav{background:var(--blue);color:#fff;box-shadow:0 0 15px rgba(30,144,255,0.3)}
.v-btn-stems{background:var(--red);color:#fff;box-shadow:0 0 20px rgba(255,30,60,0.5)}
.v-btn-doc{background:var(--card2);color:var(--muted);border:1px solid var(--border)}
.v-badge{font-size:10px;padding:4px 10px;border-radius:99px;background:rgba(255,30,60,0.12);color:var(--red);border:1px solid rgba(255,30,60,0.25);font-weight:800}
.v-muted{color:var(--muted);font-size:12px;line-height:1.6}
  </style>
  <div class="vault-wrap" style="background:radial-gradient(ellipse at top, #0A1931 0%, #050A14 70%)">
    <div class="vault-head">
      <h1>🔒 Your Private Vault</h1>
      <div id="status" class="v-muted">Verifying licence -...</div>
    </div>
    <div id="downloads"></div>
  </div>`}async function w(){const o=window.location.hash.split("?")[1]||"",i=new URLSearchParams(o||location.search).get("session_id")||localStorage.getItem("dopetone_last_session_id"),n=document.getElementById("status"),d=document.getElementById("downloads");if(!i){n.textContent="No session_id. Open from #/licence/success?session_id=...";return}try{const r=await(await fetch(p+"/api/orders/status?session_id="+encodeURIComponent(i))).json();if(r.status!=="paid"){n.textContent="Status: "+r.status;return}const v=r.customer_email||"",g=new Date().toLocaleString();n.innerHTML="✅ Paid - $"+(r.total_cents/100).toFixed(2)+" - "+r.downloads.length+' beats unlocked - <span style="color:#FF1E3C"></span><br><small>'+v+" • "+g+"</small>",r.downloads.forEach(t=>{const a=f(t.license_type),c=document.createElement("div");c.className="vault-card",c.innerHTML='<div style="display:flex;justify-content:space-between;align-items:center"><b style="color:#fff">'+t.beat_title+'</b> <span class="v-badge">'+t.license_type.toUpperCase()+" • $"+(t.amount/100).toFixed(2)+'</span></div><div class="v-muted" style="margin:10px 0"><b style="color:#fff">INCLUDES:</b> '+a.includes.join(" • ")+'<br><b style="color:#fff">STREAMS:</b> '+a.streams+'<br><b style="color:#fff">RIGHTS:</b> '+a.rights+'</div><div id="btns-'+t.beat_id+'"></div>',d.appendChild(c);const l=c.querySelector("#btns-"+t.beat_id);if(a.mp3){const e=document.createElement("a");e.className="v-btn v-btn-mp3",e.href=p+t.links.mp3,e.textContent="MP3 Private Link",l.appendChild(e)}if(a.wav){const e=document.createElement("a");e.className="v-btn v-btn-wav",e.href=p+t.links.wav,e.textContent="WAV Private Link",l.appendChild(e)}if(a.stems){const e=document.createElement("a");e.className="v-btn v-btn-stems",e.href=p+t.links.stems,e.textContent="STEMS Private Link",l.appendChild(e)}const u=document.createElement("button");u.className="v-btn v-btn-doc",u.textContent="📄 Licence",u.onclick=()=>{const e=`DOPE TONE MUSIC - OFFICIAL LICENCE - SAME AS LICENCE POPUP
Beat: `+t.beat_title+`
Licence: `+t.license_type.toUpperCase()+`
Buyer: `+v+`
Order: `+i+`
Date: `+g+`
Amount: $`+(t.amount/100).toFixed(2)+`

INCLUDES: `+a.includes.join(", ")+`
STREAMS: `+a.streams+`
RIGHTS: `+a.rights+`

This matches licence popup info exactly.
Credit: Prod. By Dope Tone
`;x(t.beat_title+"_"+t.license_type+"_Licence.txt",e)},l.appendChild(u)})}catch(b){n.textContent="Error: "+b.message}}export{w as init,h as render};
