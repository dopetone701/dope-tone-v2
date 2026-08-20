const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/cc-create-modal-C-98--jd.js","assets/cc-config-B-Q2_xur.js","assets/cc-edit-modal-C6aQFo8A.js","assets/index-Bm9mePCq.js","assets/index-arbpgsvz.css"])))=>i.map(i=>d[i]);
import{_ as y}from"./index-Bm9mePCq.js";import{d as c,B as h,e as w,f as b}from"./cc-config-B-Q2_xur.js";let s=30,a=[],r=null;async function C(t){t&&(t.innerHTML=`
    <div id="beatsPageRoot" style="height:calc(100vh - 88px);display:flex;flex-direction:column;overflow:hidden">
      <div id="beatsStickyHeader" style="position:sticky;top:0;z-index:50;flex-shrink:0;background:#080C16;border:1px solid rgba(255,255,255,.08);border-radius:12px 12px 0 0;padding:12px 16px;display:flex;justify-content:space-between;align-items:center;gap:12px">
        <div style="display:flex;align-items:center;gap:10px">
          <h2 style="color:#fff;margin:0;font-size:15px;font-weight:900;letter-spacing:.6px">BEATS VAULT</h2>
          <span id="ccBeatsCount" style="background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.12);padding:4px 10px;border-radius:20px;font-size:10px;color:#9CA3AF;font-weight:800">0 beats</span>
        </div>
        <div style="display:flex;gap:8px;align-items:center">
          <div style="position:relative;display:flex;align-items:center">
            <span style="position:absolute;left:10px;display:grid;place-items:center;pointer-events:none">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6B7280" stroke-width="2"><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/></svg>
            </span>
            <input id="beatsSearch" placeholder="Search title, artist, genre, mood..." autocomplete="off" style="width:320px;height:38px;padding:0 12px 0 34px;border-radius:10px;background:#0A0E1A;border:1px solid rgba(255,255,255,.12);color:#fff;outline:none;font-size:13px;font-family:inherit" />
          </div>
          <button id="ccCreateBeatBtn" style="height:38px;padding:0 18px;border-radius:10px;background:#FF1E3C;color:#fff;border:none;font-weight:900;font-size:11px;letter-spacing:.7px;cursor:pointer;display:flex;align-items:center;gap:7px;white-space:nowrap">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>
            CREATE
          </button>
        </div>
      </div>
      <div id="beatsScrollWrap" style="flex:1;overflow-y:auto;overflow-x:hidden;background:#050A14;border:1px solid rgba(255,255,255,.08);border-top:none;border-radius:0 0 12px 12px;position:relative">
        <table style="width:100%;border-collapse:collapse">
          <thead style="position:sticky;top:0;z-index:20;background:#0A0E1A;backdrop-filter:blur(12px);border-bottom:1px solid rgba(255,255,255,.08)">
            <tr style="font-size:9px;color:#6B7280;letter-spacing:.9px;font-weight:700">
              <th style="padding:12px 16px;text-align:left">BEAT</th>
              <th style="padding:12px 8px;text-align:left">PLAYS</th>
              <th style="padding:12px 8px;text-align:left">DL</th>
              <th style="padding:12px 8px;text-align:left">LIKES</th>
              <th style="padding:12px 8px;text-align:left">CART</th>
              <th style="padding:12px 8px;text-align:left">REV</th>
              <th style="padding:12px 16px;text-align:right">ACTIONS</th>
            </tr>
          </thead>
          <tbody id="beatsTableBody"></tbody>
        </table>
        <div id="beatsLazyLoader" style="padding:18px;text-align:center;color:#6B7280;font-size:11px;letter-spacing:.6px;display:none">
          <div style="display:inline-flex;align-items:center;gap:8px"><span style="width:14px;height:14px;border:2px solid rgba(255,255,255,.12);border-top-color:#FF1E3C;border-radius:50%;display:inline-block;animation:spin 1s linear infinite"></span> Loading more beats...</div>
        </div>
        <style>@keyframes spin{to{transform:rotate(360deg)}}</style>
      </div>
    </div>
  `,await m())}async function m(){const t=document.getElementById("beatsSearch"),i=document.getElementById("searchBar"),o=B(n=>{const d=n.toLowerCase().trim();a=d?c.filter(l=>(l.title||"").toLowerCase().includes(d)||(l.artist||"").toLowerCase().includes(d)||(l.genre||"").toLowerCase().includes(d)||(l.tags||"").toLowerCase().includes(d)||(l.mood||"").toLowerCase().includes(d)):c,s=30,x(a.slice(0,s))},150);t&&t.addEventListener("input",n=>o(n.target.value)),i&&i.addEventListener("input",n=>{t&&(t.value=n.target.value),o(n.target.value)});const e=document.getElementById("beatsScrollWrap");e&&e.addEventListener("scroll",()=>{e.scrollTop+e.clientHeight>=e.scrollHeight-250&&s<a.length&&(s+=30,x(a.slice(0,s)))});const p=document.getElementById("ccCreateBeatBtn");p&&(p.onclick=async n=>{var l;n.preventDefault(),n.stopPropagation();try{const f=await y(()=>import("./cc-create-modal-C-98--jd.js"),__vite__mapDeps([0,1]));if(f.openCreateBeatModal){f.openCreateBeatModal();return}if((l=f.default)!=null&&l.openCreateBeatModal){f.default.openCreateBeatModal();return}}catch(f){console.warn("[Create Modal Import]",f)}if(window.openCreateBeatModal){window.openCreateBeatModal();return}if(window.ccOpenCreate){window.ccOpenCreate();return}if(window.openCreateModal){window.openCreateModal();return}window.dispatchEvent(new CustomEvent("cc_create_beat"));const d=document.getElementById("createBeatModal")||document.getElementById("createModal")||document.getElementById("uploadModal");d&&(d.classList.add("active"),d.style.display="flex",document.body.classList.add("modal-open"))});try{const n=await y(()=>import("./cc-create-modal-C-98--jd.js"),__vite__mapDeps([0,1]));n.init&&n.init()}catch{}await v()}async function v(){try{const t=await fetch(`${h}/beats`,{cache:"no-store"});if(!t.ok)throw new Error(`HTTP ${t.status}`);const i=await t.json(),o=Array.isArray(i)?i:i.beats||i.data||[];w(o),a=o,s=30,b(o),x(o.slice(0,s));const e=document.getElementById("ccBeatsCount");e&&(e.textContent=`${o.length} beats`)}catch(t){console.error("[Beats]",t);const i=document.getElementById("beatsTableBody");i&&(i.innerHTML=`<tr><td colspan="7" style="padding:32px;text-align:center;color:#ff5555;font-size:13px">Failed: ${t.message}<br><small style="color:#6B7280">${h}/beats</small></td></tr>`)}}function x(t){const i=document.getElementById("beatsTableBody");if(!i)return;if(!t||!t.length){i.innerHTML='<tr><td colspan="7" style="padding:32px;text-align:center;color:#6B7280;font-size:13px">No beats found — Click CREATE</td></tr>';return}const o=document.getElementById("beatsLazyLoader");o&&(o.style.display=a.length>t.length?"block":"none",a.length>t.length&&(o.innerHTML=`<div style="display:inline-flex;align-items:center;gap:8px"><span style="width:14px;height:14px;border:2px solid rgba(255,255,255,.12);border-top-color:#FF1E3C;border-radius:50%;display:inline-block;animation:spin 1s linear infinite"></span> Showing ${t.length} of ${a.length} — scroll to load more</div>`)),i.innerHTML=t.map(e=>{const p=e.monetization_mode==="free",n=parseFloat(e.real_revenue||0),d=p?"FREE":n>0?`$${n.toFixed(2)}`:`$${((e.download_count||0)*(e.price||0)).toFixed(2)}`,l=r===String(e.id),f=e.cover_url||e.cover||"images/logo.png";return`
      <tr data-beat-id="${e.id}" style="border-bottom:1px solid rgba(255,255,255,.05);transition:background.15s">
        <td style="padding:12px 16px">
          <div style="display:flex;gap:10px;align-items:center">
            <div style="position:relative;width:36px;height:36px;flex-shrink:0">
              <img src="${f}" style="width:36px;height:36px;border-radius:8px;object-fit:cover;border:1px solid rgba(255,255,255,.08);display:block" loading="lazy" onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzYiIGhlaWdodD0iMzYiIHZpZXdCb3g9IjAgMCAzNiAzNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMzYiIGhlaWdodD0iMzYiIHJ4PSI4IiBmaWxsPSIjOGI1Y2Y2Ii8+PHRleHQgeD0iMTgiIHk9IjIxIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSJ3aGl0ZSIgZm9udC1zaXplPSIxMiIgZm9udC13ZWlnaHQ9IjcwMCI+RFQ8L3RleHQ+PC9zdmc+'" />
              ${l?'<div style="position:absolute;inset:0;background:rgba(255,30,60,.75);border-radius:8px;display:grid;place-items:center"><svg width="12" height="12" viewBox="0 0 24 24" fill="#fff"><rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/></svg></div>':""}
            </div>
            <div style="min-width:0">
              <div style="color:#fff;font-size:13px;font-weight:700;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:220px">${u(e.title)}</div>
              <div style="font-size:11px;color:#6B7280;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:220px">${u(e.artist||"DopeTone")} • ${e.bpm||"-"} BPM • ${e.key||""}</div>
            </div>
          </div>
        </td>
        <td style="color:#9CA3AF;font-size:12px;font-weight:600;padding:12px 8px">${e.play_count??e.plays??0}</td>
        <td style="color:#9CA3AF;font-size:12px;padding:12px 8px">${e.download_count??e.downloads??0}</td>
        <td style="color:#9CA3AF;font-size:12px;padding:12px 8px">${e.like_count??e.likes??0}</td>
        <td style="color:#9CA3AF;font-size:12px;padding:12px 8px">${e.cart_count??0}</td>
        <td style="padding:12px 8px;font-size:12px;font-weight:800;${p?"color:#60A5FA":"color:#10b981"}">${d}</td>
        <td style="padding:12px 16px">
          <div style="display:flex;gap:6px;justify-content:flex-end;align-items:center">
            <button onclick="window.ccTogglePlay('${e.id}')" data-play-id="${e.id}" title="${l?"Pause":"Play"}" style="width:32px;height:32px;border-radius:8px;border:1px solid ${l?"#FF1E3C":"rgba(255,255,255,.12)"};background:${l?"#FF1E3C":"#111"};color:#fff;cursor:pointer;display:grid;place-items:center;transition:all.15s">
              ${l?'<svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16" rx="1.2"/><rect x="14" y="4" width="4" height="16" rx="1.2"/></svg>':'<svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5.14v14l11-7-11-7z"/></svg>'}
            </button>
            <button onclick="window.ccEditBeat('${e.id}')" title="Edit beat" style="width:32px;height:32px;border-radius:8px;border:none;background:#8b5cf6;color:#fff;cursor:pointer;display:grid;place-items:center">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
            </button>
            <button onclick="window.ccDeleteBeat('${e.id}')" title="Delete" style="width:32px;height:32px;border-radius:8px;border:none;background:#ff3b3b;color:#fff;cursor:pointer;display:grid;place-items:center">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
            </button>
          </div>
        </td>
      </tr>`}).join("")}function u(t){return(t||"").toString().replace(/[&<>"']/g,i=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[i])}window.ccPlayBeat=t=>{const i=c.findIndex(e=>String(e.id)===String(t));if(i===-1)return;const o=c[i];window.__CURRENT_LIST__="cc-beats",window.DTPlayer&&window.DTPlayer.setQueue?window.DTPlayer.setQueue(c,i,!0):window.globalPlayer&&window.globalPlayer.play?window.globalPlayer.play(i,c,"cc-beats"):window.DTPlayTrack&&window.DTPlayTrack(o,!0)};window.ccTogglePlay=t=>{const i=window.__DT_AUDIO__||window.__DOPE_TONE_AUDIO__,o=window.__CURRENT_BEAT__;if(o&&String(o.id)===String(t)&&i&&!i.paused){i.pause();return}if(o&&String(o.id)===String(t)&&i&&i.paused){i.play().catch(()=>{});return}window.ccPlayBeat(t)};window.ccDeleteBeat=async t=>{const i=c.find(o=>String(o.id)===String(t));if(confirm(`Delete "${(i==null?void 0:i.title)||t}" forever?`))try{const o=await fetch(`${h}/beats/${t}`,{method:"DELETE"});if(!o.ok)throw new Error(await o.text());const e=c.filter(d=>String(d.id)!==String(t));w(e),a=a.filter(d=>String(d.id)!==String(t));const p=(a.length?a:e).slice(0,s);x(p);const n=document.getElementById("ccBeatsCount");n&&(n.textContent=`${e.length} beats`)}catch(o){alert("Delete failed: "+o.message)}};window.ccEditBeat=async t=>{const i=c.find(e=>String(e.id)===String(t));if(!i){alert("Beat not loaded yet");return}try{const e=await y(()=>import("./cc-edit-modal-C6aQFo8A.js"),__vite__mapDeps([2,1,3,4]));if(e.openEditModal){e.openEditModal(i);return}}catch(e){console.warn("edit import failed",e)}if(window.openEditModalDirect){window.openEditModalDirect(i);return}window.dispatchEvent(new CustomEvent("cc_edit_beat",{detail:t}));const o=document.getElementById("editModal");o&&(o.style.display="flex",o.classList.add("active"),document.body.classList.add("modal-open"))};async function I(){const t=c;a=t,s=30,x(t.slice(0,s))}function g(t,i){const o=document.querySelector(`[data-play-id="${t}"]`);o&&(i?(o.style.background="#FF1E3C",o.style.borderColor="#FF1E3C",o.innerHTML='<svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16" rx="1.2"/><rect x="14" y="4" width="4" height="16" rx="1.2"/></svg>'):(o.style.background="#111",o.style.borderColor="rgba(255,255,255,.12)",o.innerHTML='<svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5.14v14l11-7-11-7z"/></svg>'))}function B(t,i){let o;return(...e)=>{clearTimeout(o),o=setTimeout(()=>t(...e),i)}}window.addEventListener("cc_dashboard_refresh",async()=>{await v()});window.addEventListener("cc_beats_loaded",t=>{a=t.detail||c,s=30,x(a.slice(0,s))});window.addEventListener("playerPlay",t=>{var o,e,p;const i=((o=t.detail)==null?void 0:o.beatId)||((e=t.detail)==null?void 0:e.id)||((p=window.__CURRENT_BEAT__)==null?void 0:p.id);i&&(r&&g(r,!1),r=String(i),g(i,!0))});window.addEventListener("playerPause",()=>{r&&(g(r,!1),r=null)});window.addEventListener("player:play",t=>{var o,e;const i=((o=t.detail)==null?void 0:o.beatId)||((e=t.detail)==null?void 0:e.id);i&&(r&&g(r,!1),r=String(i),g(i,!0))});window.addEventListener("player:pause",()=>{r&&(g(r,!1),r=null)});document.addEventListener("playerPlay",t=>{var o,e;const i=((o=t.detail)==null?void 0:o.beatId)||((e=window.__CURRENT_BEAT__)==null?void 0:e.id);i&&(r&&g(r,!1),r=String(i),g(i,!0))});document.addEventListener("playerPause",()=>{r&&(g(r,!1),r=null)});export{m as initBeatsTable,C as mount,I as refreshBeatsTable,x as renderBeatsTable,g as updatePlayButtonInTable};
