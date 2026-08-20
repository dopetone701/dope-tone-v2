import{_ as H}from"./index-DpDIV0ue.js";const A='<svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20"><path d="M8 5.14v13.72L19 12 8 5.14z"/></svg>',q='<svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20"><path d="M7 5h4v14H7V5zm6 0h4v14h-4V5z"/></svg>',V='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" width="18" height="18"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>',z='<svg viewBox="0 0 24 24" fill="#FF1E3C" stroke="#FF1E3C" stroke-width="1.8" width="18" height="18"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>',Q='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" width="18" height="18"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="M8.6 13.5l6.8 4M15.4 6.5l-6.8 4"/></svg>',X='<svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><circle cx="12" cy="5" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="12" cy="19" r="2"/></svg>';function r(i){return String(i??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#039;")}function G(i){let e=Number(i);return Number.isFinite(e)?(e>=1e3&&(e/=100),Number(e.toFixed(2))):29.99}function Z(){const e=(location.hash||"").split("?")[1]||"";let t=new URLSearchParams(e).get("id");return t?decodeURIComponent(t):(t=new URLSearchParams(location.search).get("id"),t?decodeURIComponent(t):null)}function M(){var i,e;return window.__BEATS__||((i=window.DTStore)==null?void 0:i.beats)||((e=window.store)==null?void 0:e.beats)||[]}const D="https://dopetone-stats.dopetone701.workers.dev";let J=new Set;function W(i,e){i&&fetch(`${D}/api/stats/event`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({beatId:parseInt(i),eventType:e}),keepalive:!0}).catch(()=>{})}function U(){try{return JSON.parse(localStorage.getItem("dopetone_likes")||"{}")}catch{return{}}}function tt(i){try{localStorage.setItem("dopetone_likes",JSON.stringify(i)),localStorage.setItem("dopetone_likes_count",String(Object.keys(i).length))}catch{}}function et(i){if(i==null)return!1;const e=U(),s=String(i).trim();return!!(e[s]||e[Number(s)])}function nt(i){const e=U(),s=String(i).trim(),t=Number(s),l=!(e[s]||e[t]);return l?(e[s]=Date.now(),e[t]=Date.now()):Object.keys(e).forEach(u=>{(String(u).trim()===s||Number(u)===t)&&delete e[u]}),tt(e),l}async function it(i){try{const e=await fetch(`${D}/api/stats/track/${i}`);if(e.ok)return await e.json()}catch{}try{const e=await fetch(`${D}/api/stats/${i}`);if(e.ok)return await e.json()}catch{}return null}async function at(i){return new Promise(e=>{const s=new Image;s.crossOrigin="anonymous",s.src=i,s.onload=()=>{try{const t=document.createElement("canvas"),l=t.getContext("2d",{willReadFrequently:!0});t.width=64,t.height=64,l.drawImage(s,0,0,64,64);const u=l.getImageData(0,0,64,64).data;let m=0,C=0,B=0,w=0;for(let k=0;k<u.length;k+=4*4){const I=u[k],T=u[k+1],v=u[k+2],x=I+T+v;x<30||x>700||(m+=I,C+=T,B+=v,w++)}if(w===0){e({r:10,g:25,b:49});return}m=Math.round(m/w),C=Math.round(C/w),B=Math.round(B/w),e({r:m,g:C,b:B})}catch{e({r:10,g:25,b:49})}},s.onerror=()=>e({r:10,g:25,b:49}),setTimeout(()=>e({r:10,g:25,b:49}),2e3)})}function ot(i){if(!i)return"paid";const e=String(i.monetization_mode||"").toLowerCase().trim();return["free","hybrid","paid"].includes(e)?e:i.is_free===!0||Number(i.is_free)===1?"free":i.has_free_tagged===!0||Number(i.has_free_tagged)===1?"hybrid":"paid"}function st(){return'<div id="beatMount"></div><link rel="stylesheet" href="/src/pages/beat-page.css" />'}async function rt(){const i=Z(),e=document.getElementById("beatMount");if(e){if(!document.getElementById("beat-page-css")){const s=document.createElement("link");s.id="beat-page-css",s.rel="stylesheet",s.href="/src/pages/beat-page.css",document.head.appendChild(s)}if(!i){e.innerHTML=`<div style="padding:60px;color:#fff">
      <h3>No ID Found</h3>
      <p>URL: ${r(location.hash)}</p>
      <button onclick="location.hash='#/beats'" style="margin-top:12px;padding:8px 16px;background:#FF1E3C;color:white;border:none;border-radius:8px">Go Beats</button>
    </div>`;return}e.innerHTML=`<div class="beat-page-root"><div class="beat-bg-dominant" style="background:#050A14"></div><div class="beat-bg-gradient"></div><div class="beat-content"><div style="padding:80px;text-align:center;color:#8a94b8">Loading ${r(i)}...</div></div></div>`;try{let N=function(a){const n=document.getElementById("bigPlay"),o=document.getElementById("coverBox");n&&(n.innerHTML=a?q:A),o&&o.classList.toggle("is-playing",a)},Y=function(){var d,c,p;const a=document.querySelector("audio")||window.__DT_AUDIO__;if(String((d=window.__CURRENT_BEAT__)==null?void 0:d.id)===String(t.id)&&a&&!a.paused)a.pause(),(c=window.globalPlayer)!=null&&c.pause&&window.globalPlayer.pause();else{J.has(String(t.id))||(W(t.id,"play"),J.add(String(t.id)));const b=M();let g=b.findIndex(S=>String(S.id)===String(t.id));g===-1&&(b.unshift(t),g=0,window.__BEATS__=b),(p=window.globalPlayer)!=null&&p.play&&window.globalPlayer.play(g,b,"beat-page")}},K=function(a){var d,c,p,b;const n=M(),o=n.findIndex(g=>String(g.id)===String(a.id));o>=0?(c=(d=window.globalPlayer)==null?void 0:d.play)==null||c.call(d,o,n,"similar"):(n.unshift(a),window.__BEATS__=n,(b=(p=window.globalPlayer)==null?void 0:p.play)==null||b.call(p,0,n,"similar"))},R=function(){const a=document.getElementById("similarList");a&&(a.innerHTML="",v.forEach((n,o)=>{var S,y;const d=String((S=window.__CURRENT_BEAT__)==null?void 0:S.id)===String(n.id)&&!(((y=document.querySelector("audio"))==null?void 0:y.paused)??!0),c=document.createElement("div");c.className=`beat-sim-row ${d?"is-playing":""}`,c.innerHTML=`
          <div class="beat-sim-index">${o+1}</div>
          <div class="beat-sim-cover"><img src="${r(n.cover_url||"images/studio.jpg")}" loading="lazy"></div>
          <div class="beat-sim-info">
            <div class="beat-sim-title">${r(n.title)}</div>
            <div class="beat-sim-sub">${r(n.genre)} • ${n.bpm} BPM • ${r(n.key||"")}</div>
          </div>
          <div style="display:flex;align-items:center;gap:6px;justify-content:end;position:relative">
            <button class="beat-sim-play" data-play>${d?q:A}</button>
            <button class="beat-sim-dots" data-dots>${X}</button>
            <div class="dt-row-menu">
              <button data-act="goto">🎧 Go to beat</button>
              <button data-act="cart">🛒 Add to cart</button>
              <button data-act="buy">Buy • $${G(n.price).toFixed(2)}</button>
              <button data-act="share">🔗 Share</button>
            </div>
          </div>
        `,c.onclick=f=>{var P,$,E;if(f.target.closest("[data-play],[data-dots],.dt-row-menu"))return;const h=String((P=window.__CURRENT_BEAT__)==null?void 0:P.id),_=document.querySelector("audio")||window.__DT_AUDIO__;h===String(n.id)&&_&&!_.paused?(_.pause(),(E=($=window.globalPlayer)==null?void 0:$.pause)==null||E.call($)):K(n)};const p=c.querySelector("[data-play]");p.onclick=f=>{f.stopPropagation(),c.click()};const b=c.querySelector("[data-dots]"),g=c.querySelector(".dt-row-menu");b.onclick=f=>{f.stopPropagation();const h=g.classList.contains("active");document.querySelectorAll(".dt-row-menu.active").forEach(_=>_.classList.remove("active")),h||g.classList.add("active")},g.onclick=async f=>{var _,P;f.stopPropagation();const h=(_=f.target.closest("button"))==null?void 0:_.dataset.act;if(h){if(g.classList.remove("active"),h==="goto"){location.hash=`#/beat?id=${encodeURIComponent(n.id)}`,window.scrollTo({top:0,behavior:"smooth"});return}if((h==="cart"||h==="buy")&&(await H(()=>import("./licence-DE4FtziN.js"),[])).openLicencePopup(n,n.selected_licence||"basic"),h==="share"){const $=`${location.origin}/#/beat?id=${encodeURIComponent(n.id)}`;(P=navigator.clipboard)==null||P.writeText($).then(()=>{var E,j;return(j=(E=window.Auth)==null?void 0:E.showToast)==null?void 0:j.call(E,"Link copied")})}}},a.appendChild(c)}))};const t=await(await fetch(`https://creation-system-api.dopetone701.workers.dev/api/beat?id=${encodeURIComponent(i)}`)).json();if(t.error)throw new Error("Beat not found");let l=null;try{l=await it(t.id)}catch{}l&&(t.play_count=l.plays??l.play_count??l.playCount??t.play_count,t.like_count=l.likes??l.like_count??l.likeCount??t.like_count);const u=await at(t.cover_url),m=`${u.r},${u.g},${u.b}`,B=ot(t)==="free",w=et(t.id),k=G(t.price),I=(t.long_description||t.description_body||t.description||`${t.title} is a ${t.mood||""} ${t.genre} beat at ${t.bpm} BPM in ${t.key}. Produced by Dope Tone in Dubai.`).trim(),T=M();let v=T.filter(a=>String(a.id)!==String(t.id)&&(String(a.genre).toLowerCase()===String(t.genre).toLowerCase()||String(a.mood).toLowerCase()===String(t.mood).toLowerCase())).slice(0,8);if(v.length<6){const a=T.filter(n=>String(n.id)!==String(t.id)&&!v.some(o=>String(o.id)===String(n.id))).slice(0,8-v.length);v=[...v,...a]}window.__CURRENT_BEAT__=t;const x=`${location.origin}/#/beat?id=${encodeURIComponent(t.id)}`;e.innerHTML=`
      <div class="beat-page-root">
        <div class="beat-bg-dominant" style="background: radial-gradient(120% 120% at 20% 10%, rgba(${m},0.85) 0%, rgba(${m},0.55) 25%, rgba(${m},0.25) 50%, transparent 75%), linear-gradient(to bottom, rgba(${m},0.45), #050A14 70%)"></div>
        <div class="beat-bg-gradient"></div>
        <div class="beat-content">
          <div class="beat-back-row">
            <button class="beat-back-btn" onclick="location.hash='#/beats'">← Back</button>
          </div>

          <div class="beat-hero">
            <div class="beat-cover-box" id="coverBox">
              <img src="${r(t.cover_url)}" alt="${r(t.title)}" crossorigin="anonymous" />
            </div>
            <div class="beat-hero-info">
              <div class="beat-type-label">Beat • ${r(t.type||"Single")}</div>
              <h1 class="beat-title">${r(t.title)}</h1>
              <div class="beat-meta-row">
                <div class="beat-artist-chip">
                  <img src="${r(t.cover_url)}" alt="" />
                  <span>${r(t.artist||"DopeTone")}</span>
                </div>
                <div class="beat-dot"></div>
                <div class="beat-meta-text">${r(t.genre)} • ${t.bpm} BPM • ${r(t.key)}</div>
              </div>
              <div class="beat-stats-mini">
                <span>${t.play_count||0} plays</span><span>•</span><span>${t.like_count||0} likes</span><span>•</span><span>${new Date(t.created_at).getFullYear()||2026}</span>
              </div>
            </div>
          </div>

          <div class="beat-actions-bar">
            <button class="beat-play-big" id="bigPlay">${A}</button>
            <button class="beat-action-icon ${w?"is-liked":""}" id="likeBtn">${w?z:V}</button>
            <button class="beat-action-icon" id="shareBtn2" data-share-url="${r(x)}" title="Share">${Q}</button>
            ${B?`
              <button class="beat-buy-btn is-free" id="downloadBtn">⬇ FREE DOWNLOAD</button>
              <button class="beat-cart-btn" id="cartBtn">Add to Cart - FREE</button>
            `:`
              <button class="beat-buy-btn" id="buyBtn">Buy $${k.toFixed(2)}</button>
              <button class="beat-cart-btn" id="cartBtn">Add to Cart</button>
            `}
          </div>

          <div class="beat-desc-card">
            <div class="beat-desc-label">About this beat • Track Details & Metadata</div>
            <div class="beat-desc-text">${r(I)}</div>
            <div class="beat-desc-tags">
              <span class="beat-tag">${r(t.genre)}</span>
              <span class="beat-tag">${t.bpm} BPM</span>
              <span class="beat-tag">${r(t.key)}</span>
              <span class="beat-tag">${r(t.mood||"Vibe")}</span>
              ${(t.tags_parsed||[]).slice(0,4).map(a=>`<span class="beat-tag">#${r(a)}</span>`).join("")}
            </div>
          </div>

          <div class="beat-similar-section">
            <div class="beat-section-head">
              <div class="beat-section-title">More like ${r(t.title)}</div>
              <button class="beat-back-btn" style="height:30px;font-size:12px" onclick="location.hash='#/beats'">Show all</button>
            </div>
            <div class="beat-sim-list" id="similarList"></div>
          </div>
        </div>
      </div>
    `,document.getElementById("bigPlay").onclick=Y,document.addEventListener("playerPlay",()=>{var n;const a=String((n=window.__CURRENT_BEAT__)==null?void 0:n.id)===String(t.id);N(a),R()}),document.addEventListener("playerPause",()=>{N(!1),R()}),document.getElementById("likeBtn").onclick=a=>{const n=a.currentTarget,o=nt(t.id);n.classList.toggle("is-liked",o),n.innerHTML=o?z:V;const d=U(),c=Object.keys(d).length;window.dispatchEvent(new CustomEvent("cc_like_updated",{detail:{beat_id:t.id,beatId:t.id,liked:o,count:c,perBeat:d}})),window.dispatchEvent(new CustomEvent("cc_player_like_sync",{detail:{total:c,beat_id:t.id,beatId:t.id,liked:o}})),window.dispatchEvent(new CustomEvent("cc_like_change",{detail:{beat_id:t.id,liked:o}})),W(t.id,"like")},document.getElementById("shareBtn2").onclick=a=>{const n=a.currentTarget.dataset.shareUrl||x;navigator.clipboard?navigator.clipboard.writeText(n).then(()=>{var o,d;return(d=(o=window.Auth)==null?void 0:o.showToast)==null?void 0:d.call(o,"Link copied")}):window.prompt("Copy link:",n)};async function O(){(await H(()=>import("./licence-DE4FtziN.js"),[])).openLicencePopup(t,t.selected_licence||"basic")}document.getElementById("cartBtn").onclick=()=>O();const F=document.getElementById("buyBtn");F&&(F.onclick=()=>O());const L=document.getElementById("downloadBtn");L&&(L.onclick=async()=>{var n,o,d;const a=((n=window.Auth)==null?void 0:n.user)||JSON.parse(localStorage.getItem("dopetone_user")||"null");if(!a){(d=(o=window.Auth)==null?void 0:o.openModal)==null||d.call(o,!1);return}L.textContent="Downloading...";try{const c=a.id||a.user_id,p=`https://ai-api.dopetone701.workers.dev/api/secure-download/${t.id}?uid=${encodeURIComponent(c)}`,g=await(await fetch(p,{headers:{"x-user-id":String(c)}})).blob(),S=URL.createObjectURL(g),y=document.createElement("a");y.href=S,y.download=`${t.title.replace(/[^a-z0-9]/gi,"_")}_DopeTone.mp3`,document.body.appendChild(y),y.click(),setTimeout(()=>{URL.revokeObjectURL(S),y.remove()},2e3),L.textContent="✓ Downloaded",setTimeout(()=>{L.textContent="⬇ FREE DOWNLOAD"},2e3)}catch{L.textContent="Retry"}}),R(),document.addEventListener("click",a=>{a.target.closest("[data-dots]")||document.querySelectorAll(".dt-row-menu.active").forEach(n=>n.classList.remove("active"))})}catch(s){e.innerHTML=`<div style="padding:40px;color:#fff">Error: ${r(s.message)}</div>`}}}const dt={renderBeatPage:st,initBeatPage:rt};export{dt as default,rt as initBeatPage,st as renderBeatPage};
