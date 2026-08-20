// drope-zone/notice.js - V12 - MAP TOGGLE + SMOOTH CHAT + OFFLINE PILE + PINNED NAME
import { STATS_API, MAIN_API, allBeats } from '../cc-config.js';
const DROP_API = "https://dt-drop-zone-api.dopetone701.workers.dev";
let selectedBeats = []; window.selectedBeats = selectedBeats;
let noticeHistoryLoading = false; let selectedReplyUser = null;
let realMap = null; let mapMarkers = {}; let allUsersCache = {};
let mapCollapsed = localStorage.getItem('dz_map_collapsed') === '1';

export async function mountDropZone(container){
  container.innerHTML = `
  <div id="dzRoot" style="height:calc(100dvh - 120px); overflow:auto; padding:24px; display:flex; flex-direction:column; gap:20px; background:radial-gradient(ellipse at top, #0A1931 0%, #050A14 70%);">
    <div style="display:flex; justify-content:space-between; align-items:center; flex-shrink:0">
      <h1 style="color:#FFFFFF; font-size:22px; font-weight:900; letter-spacing:1px; margin:0">DROP <span style="background:linear-gradient(180deg, #8B0000 0%, #FF1E3C 50%, #FF6B6B 100%); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text">ZONE</span> <span id="postCount" style="color:#9CA3AF; font-weight:400; font-size:12px">(0)</span></h1>
      <div style="display:flex; gap:12px; align-items:center; font-size:10px; color:#9CA3AF"><span>LIVE <b id="dzStatLive" style="color:#1E90FF">0</b></span><span>NEW <b id="dzStatNew" style="color:#FF1E3C">0</b></span><span id="dzUnread" style="display:none; background:#FF1E3C; color:#fff; padding:2px 8px; border-radius:99px; font-weight:800"></span></div>
    </div>

    <!-- PROMOTE CHAMBER TOP -->
    <div style="background:#0A1931; border:1px solid rgba(255,255,255,0.1); border-radius:16px; overflow:hidden; display:grid; grid-template-columns: 1.35fr 0.65fr; flex-shrink:0">
      <div style="padding:20px; border-right:1px solid rgba(255,255,255,0.1)">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:14px"><div style="font-size:10px; letter-spacing:1.2px; font-weight:800; color:#FFFFFF">PROMOTE <span style="color:#FF1E3C">CHAMBER</span> • ENGINE</div><span id="dzLiveLoc" style="font-size:10px; color:#1E90FF; background:rgba(30,144,255,0.1); border:1px solid rgba(30,144,255,0.2); padding:4px 10px; border-radius:99px">Dubai, UAE</span></div>
        <textarea id="noticeText" placeholder="Drop announcement..." style="width:100%; min-height:88px; background:#050A14; border:1px solid rgba(255,255,255,0.1); border-radius:12px; padding:14px; color:#FFFFFF; font-size:13px; resize:none; outline:none; box-sizing:border-box"></textarea>
        <div style="margin-top:12px; display:flex; gap:8px; flex-wrap:wrap; align-items:center">
          <input id="noticeFile" type="file" accept="image/*,video/*" style="display:none"><button onclick="document.getElementById('noticeFile').click()" style="background:#050A14; border:1px solid rgba(255,255,255,0.1); color:#9CA3AF; padding:8px 14px; border-radius:99px; font-size:11px; cursor:pointer">+ Media</button>
          <button id="promoteBtn" style="background:#FF1E3C; border:1px solid #FF1E3C; color:#FFFFFF; padding:10px 18px; border-radius:99px; font-size:11px; font-weight:900; cursor:pointer; box-shadow:0 0 20px rgba(255,30,60,0.5)">★ PROMOTE BEATS <span id="selectedCount" style="background:#FFFFFF; color:#FF1E3C; padding:2px 7px; border-radius:99px; margin-left:8px">0/4</span></button>
          <span id="fileInfo" style="font-size:10px; color:#9CA3AF"></span><span id="dzLiveCity" style="font-size:10px; color:#9CA3AF; margin-left:auto"></span>
        </div>
        <div id="noticePreview" style="display:none; margin-top:12px"><img id="noticeImgPreview" style="display:none; max-width:100%; border-radius:10px"><video id="noticeVidPreview" style="display:none; max-width:100%; border-radius:10px" controls></video></div>
        <div id="promotePicker" style="display:none; margin-top:14px; background:#050A14; border:1px solid rgba(255,255,255,0.1); border-radius:12px; padding:12px"><input id="beatSearch" placeholder="Search beats..." style="width:100%; background:#0A1931; border:1px solid rgba(255,255,255,0.1); color:#FFFFFF; padding:10px 12px; border-radius:10px; font-size:12px; margin-bottom:10px; box-sizing:border-box"><div id="beatList" style="display:grid; grid-template-columns:repeat(4,1fr); gap:8px; max-height:260px; overflow:auto"></div></div>
        <div id="promotePreview" style="margin-top:12px"></div><div id="noxPreviewArea" style="margin-top:12px"></div>
        <div style="margin-top:16px; display:grid; grid-template-columns:1fr 1fr; gap:10px"><button id="noticePreviewBtn" style="background:#050A14; border:1px solid rgba(255,255,255,0.1); color:#9CA3AF; padding:12px; border-radius:99px; font-size:11px; font-weight:700; cursor:pointer">PREVIEW</button><button id="noticePostBtn" style="background:#FFFFFF; border:1px solid #FFFFFF; color:#0A1931; padding:12px; border-radius:99px; font-size:11px; font-weight:900; cursor:pointer">POST DROP →</button></div>
        <select id="noticeType" style="display:none"><option value="text">TEXT</option><option value="image">IMAGE</option><option value="video">VIDEO</option><option value="promotion">PROMO</option></select><input id="noticeAutoDelete" type="checkbox" style="display:none">
      </div>
      <div style="background:#050A14; display:flex; flex-direction:column; overflow:hidden"><div style="padding:14px 18px; border-bottom:1px solid rgba(255,255,255,0.1); display:flex; justify-content:space-between"><span style="font-size:10px; font-weight:800; color:#FFFFFF">RECENT <span style="color:#FF1E3C">POSTED</span></span><button onclick="window.ccReloadDrops()" style="background:none; border:none; color:#9CA3AF; font-size:10px; cursor:pointer">Reload</button></div><div id="noticeHistoryList" style="flex:1; overflow:auto; padding:12px; min-height:320px"></div></div>
    </div>

    <!-- DIVE - MAP + CHAT -->
    <div style="background:#0A1931; border:1px solid rgba(255,255,255,0.1); border-radius:16px; overflow:hidden; flex-shrink:0">
      <div style="padding:14px 18px; border-bottom:1px solid rgba(255,255,255,0.1); display:flex; justify-content:space-between; align-items:center">
        <span style="font-size:10px; font-weight:800; color:#FFFFFF">LIVE <span style="color:#1E90FF">DIVE</span> • WIDE MAP</span>
        <div style="display:flex; gap:10px; align-items:center"><span id="dzCount" style="font-size:10px; color:#9CA3AF"></span><button id="dzMapToggle" style="background:#FFFFFF; color:#0A1931; border:none; padding:6px 12px; border-radius:99px; font-size:10px; font-weight:800; cursor:pointer">${mapCollapsed?'OPEN MAP':'CLOSE MAP'}</button></div>
      </div>
      <div id="dzMapWrap" style="display:${mapCollapsed?'none':'block'}"><div id="dzRealMap" style="width:100%; height:360px; background:#050A14"></div></div>
      <div style="display:grid; grid-template-columns:1fr 1fr; gap:1px; background:rgba(255,255,255,0.1)">
        <div style="background:#050A14; display:flex; flex-direction:column; height:480px">
          <div style="padding:12px 16px; border-bottom:1px solid rgba(255,255,255,0.1); display:flex; justify-content:space-between; align-items:center"><span style="font-size:10px; font-weight:800; color:#FFFFFF">GRID CHAT • FAN LIST</span><div style="display:flex; gap:6px"><button id="dzMarkRead" style="background:#0A1931; border:1px solid rgba(255,255,255,0.1); color:#9CA3AF; padding:5px 10px; border-radius:99px; font-size:9px; cursor:pointer">READ ALL</button><button id="dzClearAll" style="background:#0A1931; border:1px solid rgba(255,255,255,0.1); color:#9CA3AF; padding:5px 10px; border-radius:99px; font-size:9px; cursor:pointer">CLEAR</button></div></div>
          <div id="dzPillsWrap" style="flex:1; overflow:auto; padding:12px; display:flex; flex-direction:column; gap:8px; scroll-behavior:smooth"></div>
        </div>
        <div style="background:#050A14; display:flex; flex-direction:column; height:480px">
          <div id="dzThreadHeader" style="padding:12px 16px; border-bottom:1px solid rgba(255,255,255,0.1); background:#0A1931; position:sticky; top:0; z-index:5; display:none"></div>
          <div id="dzThreadWrap" style="flex:1; overflow:auto; padding:12px; display:flex; flex-direction:column; gap:10px; scroll-behavior:smooth"></div>
          <div style="padding:10px; border-top:1px solid rgba(255,255,255,0.1); display:flex; gap:8px; background:#0A1931"><input id="dzReplyInput" placeholder="Select fan pill to reply..." style="flex:1; background:#050A14; border:1px solid rgba(255,255,255,0.1); color:#FFFFFF; padding:10px 14px; border-radius:99px; font-size:12px; outline:none"><button id="dzReplyBtn" style="background:#FF1E3C; color:#FFFFFF; border:none; width:40px; height:40px; border-radius:50%; cursor:pointer; font-weight:900; box-shadow:0 0 20px rgba(255,30,60,0.5)">→</button></div>
        </div>
      </div>
    </div>
  </div>
  `;
  if(!document.getElementById('leaflet-css')){ const l=document.createElement('link'); l.id='leaflet-css'; l.rel='stylesheet'; l.href='https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'; document.head.appendChild(l); const s=document.createElement('script'); s.src='https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'; document.head.appendChild(s); }

  // MAP TOGGLE LOGIC
  const toggleBtn = document.getElementById('dzMapToggle');
  const mapWrap = document.getElementById('dzMapWrap');
  toggleBtn.onclick = () => {
    mapCollapsed =!mapCollapsed;
    localStorage.setItem('dz_map_collapsed', mapCollapsed?'1':'0');
    mapWrap.style.display = mapCollapsed?'none':'block';
    toggleBtn.textContent = mapCollapsed?'OPEN MAP':'CLOSE MAP';
    if(!mapCollapsed && realMap){ setTimeout(()=>{ realMap.invalidateSize(); }, 200); }
    if(!mapCollapsed &&!realMap){ initRealMap(); }
  };

  await initNotices();
  if(!mapCollapsed){ initRealMap(); }
}
export async function renderDropZonePage(c){ return mountDropZone(c); }

export function initNotices() {
  const postBtn = document.getElementById('noticePostBtn');
  const previewBtn = document.getElementById('noticePreviewBtn');
  const textInput = document.getElementById('noticeText');
  const fileInput = document.getElementById('noticeFile');
  const typeSel = document.getElementById('noticeType');
  const autoDel = document.getElementById('noticeAutoDelete');
  const promoteBtn = document.getElementById('promoteBtn');
  const picker = document.getElementById('promotePicker');
  const beatSearch = document.getElementById('beatSearch');
  const imgPreview = document.getElementById('noticeImgPreview');
  const vidPreview = document.getElementById('noticeVidPreview');
  const noticePreview = document.getElementById('noticePreview');
  if (!postBtn) return;
  if (fileInput) {
    fileInput.onchange = () => {
      const f = fileInput.files[0]; const fileInfo = document.getElementById('fileInfo');
      if (!f) { if (noticePreview) noticePreview.style.display = 'none'; if (fileInfo) fileInfo.textContent = ''; return; }
      if (noticePreview) noticePreview.style.display = 'block';
      if (fileInfo) fileInfo.textContent = `${f.name} (${(f.size/1024/1024).toFixed(2)} MB)`;
      if (f.type.startsWith('image/')) { if (imgPreview) { imgPreview.src = URL.createObjectURL(f); imgPreview.style.display = 'block'; } if (vidPreview) vidPreview.style.display = 'none'; if (typeSel) typeSel.value = 'image'; }
      else if (f.type.startsWith('video/')) { if (vidPreview) { vidPreview.src = URL.createObjectURL(f); vidPreview.style.display = 'block'; } if (imgPreview) imgPreview.style.display = 'none'; if (typeSel) typeSel.value = 'video'; }
    };
  }
  if (promoteBtn) { promoteBtn.onclick = () => { const hidden =!picker || picker.style.display === 'none' ||!picker.style.display; if (picker) picker.style.display = hidden? 'block':'none'; if (hidden) loadBeatsForPicker(); }; }
  if (beatSearch) beatSearch.oninput = debounce(() => loadBeatsForPicker(beatSearch.value), 300);
  if (previewBtn) { previewBtn.onclick = () => { const text = textInput?.value.trim() || ''; const file = fileInput?.files[0]; const area = document.getElementById('noxPreviewArea'); if (!text &&!file &&!selectedBeats.length) return showToast('Nothing to preview', true); let html = '<div style="border:1px solid rgba(255,255,255,0.1);border-radius:12px;padding:12px;background:#050A14;">'; html += '<div style="font-size:10px;color:#FF1E3C;margin-bottom:8px;font-weight:800">PREVIEW</div>'; if (selectedBeats.length) html += renderPromoPreviewHTML(); else if (file?.type.startsWith('image/')) html += `<img src="${URL.createObjectURL(file)}" style="max-width:100%;border-radius:8px">`; else if (file?.type.startsWith('video/')) html += `<video src="${URL.createObjectURL(file)}" style="max-width:100%;border-radius:8px" controls></video>`; if (text) html += `<div style="margin-top:10px;color:#FFFFFF;font-size:13px;white-space:pre-wrap">${escapeHtml(text)}</div>`; html += '</div>'; if (area) area.innerHTML = html; }; }
  if (postBtn) {
    postBtn.onclick = async (e) => {
      e.preventDefault(); const text = textInput?.value.trim() || ''; const file = fileInput?.files[0];
      if (!text &&!file &&!selectedBeats.length) return showToast('Need content', true); if (postBtn.disabled) return;
      postBtn.disabled = true; const orig = postBtn.innerHTML; postBtn.innerHTML = 'POSTING...';
      try {
        let mediaPayload = null;
        if (file) { if (file.size > 50*1024*1024) throw new Error('Max 50MB'); postBtn.innerHTML = 'UPLOADING R2...'; const fd = new FormData(); fd.append('file', file); const upRes = await fetch(`${DROP_API}/api/upload`, { method:'POST', body:fd }); const upData = await upRes.json(); if (!upData.success) throw new Error(upData.error||'R2 fail'); mediaPayload = { type: file.type.startsWith('image/')?'image':'video', url: upData.url }; }
        postBtn.innerHTML = 'SAVING D1...';
        const payload = { type: selectedBeats.length?'promotion':(mediaPayload?mediaPayload.type:(typeSel?.value||'text')), content:text, from:'admin', expiresAt:autoDel?.checked?Date.now()+86400000:null, media:mediaPayload, promotion: selectedBeats.length?{ type:'beats', items:selectedBeats.map(b=>({ id:b.id, title:b.title, cover_url:b.cover_url||b.cover||'', price:b.price, audio_url:b.mp3_url||b.audio||'' })) }:null };
        const res1 = await fetch(`${DROP_API}/api/notices`, { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(payload) }); const data1 = await res1.json().catch(()=>({})); if (!res1.ok||!data1.success) throw new Error(data1.error||`DROP ${res1.status}`);
        try{ await fetch(`${STATS_API}/api/notices`, { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(payload) }); }catch{}
        if (textInput) textInput.value=''; if (fileInput) fileInput.value=''; selectedBeats=[]; window.selectedBeats=selectedBeats; const sc=document.getElementById('selectedCount'); if(sc) sc.textContent='0/4'; if (noticePreview) noticePreview.style.display='none'; const noxArea=document.getElementById('noxPreviewArea'); if(noxArea) noxArea.innerHTML=''; const promoPrev=document.getElementById('promotePreview'); if(promoPrev) promoPrev.innerHTML=''; showToast('POST LIVE ✓'); await loadNoticeHistory(true);
      } catch(err){ showToast(err.message,true); } finally { postBtn.disabled=false; postBtn.innerHTML=orig; }
    };
  }
  loadNoticeHistory(); initChatBoss();
}

async function loadBeatsForPicker(q=''){
  const beatList=document.getElementById('beatList'); if(!beatList) return; let beats=allBeats;
  if(!beats||!beats.length){ try{ const res=await fetch(`${MAIN_API}/beats?t=${Date.now()}`); if(res.ok){ const j=await res.json(); beats=j.beats||j.products||j||[]; } }catch{ beatList.innerHTML='<div style="color:#9CA3AF;font-size:11px;padding:10px">Failed</div>'; return; } }
  const filtered=beats.filter(b=>!q||(b.title||'').toLowerCase().includes(q.toLowerCase())).slice(0,24);
  beatList.innerHTML=filtered.map(b=>`<div class="beat-pick" data-id="${b.id}" style="border:1px solid ${selectedBeats.find(x=>String(x.id)===String(b.id))?'#FF1E3C':'rgba(255,255,255,0.1)'};border-radius:10px;padding:6px;cursor:pointer;background:${selectedBeats.find(x=>String(x.id)===String(b.id))?'rgba(255,30,60,0.15)':'#0A1931'};position:relative">${selectedBeats.find(x=>String(x.id)===String(b.id))?'<div style="position:absolute;top:4px;right:4px;background:#FF1E3C;color:#fff;width:18px;height:18px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:10px">✓</div>':''}<img src="${b.cover_url||b.cover||''}" style="width:100%;height:70px;object-fit:cover;border-radius:6px"><div style="font-size:10px;margin-top:4px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;color:#FFFFFF">${escapeHtml(b.title||'Untitled')}</div></div>`).join('');
  document.querySelectorAll('.beat-pick').forEach(el=>{ el.onclick=()=>{ const id=el.dataset.id; const beat=filtered.find(b=>String(b.id)===String(id)); if(!beat) return; const idx=selectedBeats.findIndex(x=>String(x.id)===String(id)); if(idx>-1) selectedBeats.splice(idx,1); else { if(selectedBeats.length>=4) return showToast('Max 4',true); selectedBeats.push(beat); } window.selectedBeats=selectedBeats; const sc=document.getElementById('selectedCount'); if(sc) sc.textContent=`${selectedBeats.length}/4`; loadBeatsForPicker(q); renderPromoPreview(); }; });
}
function renderPromoPreview(){
  const el=document.getElementById('promotePreview'); if(!el) return; if(!selectedBeats.length){ el.innerHTML=''; return; }
  const [main,...rest]=selectedBeats; el.innerHTML=`<div style="border:1px solid #FF1E3C;border-radius:12px;padding:10px;background:rgba(255,30,60,0.08);display:flex;gap:10px"><img src="${main.cover_url||main.cover||''}" style="width:80px;height:80px;object-fit:cover;border-radius:10px;border:1px solid rgba(255,255,255,0.1)"><div style="flex:1"><div style="font-size:10px;color:#FF1E3C;font-weight:800">MAIN DROP • ${selectedBeats.length} BEATS</div><div style="font-size:13px;color:#FFFFFF;font-weight:700;margin:4px 0">${escapeHtml(main.title||'')}</div><div style="display:flex;gap:4px;margin-top:6px;flex-wrap:wrap">${rest.map(b=>`<img src="${b.cover_url||b.cover||''}" style="width:32px;height:32px;border-radius:6px;border:1px solid rgba(255,255,255,0.1)">`).join('')}</div></div><button onclick="window.ccClearPromo()" style="background:#050A14;border:1px solid rgba(255,255,255,0.1);color:#9CA3AF;width:28px;height:28px;border-radius:50%;cursor:pointer">✕</button></div>`;
}
function renderPromoPreviewHTML(){ if(!selectedBeats.length) return ''; const [main,...rest]=selectedBeats; return `<div class="promo-wrap" data-mode="big" style="border:1px solid rgba(255,255,255,0.1);border-radius:12px;overflow:hidden;background:#050A14;margin-top:10px"><div style="display:flex;justify-content:space-between;padding:8px 10px;background:#0A1931;border-bottom:1px solid rgba(255,255,255,0.1)"><span style="font-size:10px;color:#FF1E3C;font-weight:800">${selectedBeats.length} BEATS</span><button onclick="window.togglePreviewCover(this)" style="background:#050A14;border:1px solid rgba(255,255,255,0.1);color:#FFFFFF;border-radius:20px;padding:3px 8px;font-size:10px">Grid View</button></div><div class="covers-big" style="padding:10px;display:flex;gap:10px"><img src="${main.cover_url||main.cover||''}" style="width:100px;height:100px;border-radius:10px;object-fit:cover"><div><div style="color:#FFFFFF;font-weight:700">${escapeHtml(main.title||'')}</div><div style="display:flex;gap:4px;margin-top:8px">${rest.map(b=>`<img src="${b.cover_url||b.cover||''}" style="width:36px;height:36px;border-radius:6px">`).join('')}</div></div></div><div class="covers-grid" style="display:none;padding:10px;grid-template-columns:repeat(3,1fr);gap:6px">${selectedBeats.map(b=>`<img src="${b.cover_url||b.cover||''}" style="width:100%;aspect-ratio:1;border-radius:8px">`).join('')}</div></div>`; }
window.togglePreviewCover=(btn)=>{ const wrap=btn.closest('.promo-wrap'); const big=wrap.querySelector('.covers-big'); const grid=wrap.querySelector('.covers-grid'); const isBig=wrap.dataset.mode==='big'; if(isBig){ big.style.display='none'; grid.style.display='grid'; wrap.dataset.mode='grid'; btn.textContent='Big View'; } else { big.style.display='flex'; grid.style.display='none'; wrap.dataset.mode='big'; btn.textContent='Grid View'; } };
async function loadNoticeHistory(force=false){ if(noticeHistoryLoading&&!force) return; noticeHistoryLoading=true; const listEl=document.getElementById('noticeHistoryList'); const countEl=document.getElementById('postCount'); if(!listEl){ noticeHistoryLoading=false; return; } try{ const res=await fetch(`${DROP_API}/api/notices?t=${Date.now()}`); if(!res.ok) throw new Error(`API ${res.status}`); const notices=await res.json(); if(countEl) countEl.textContent=`(${notices.length})`; if(!Array.isArray(notices)||!notices.length){ listEl.innerHTML='<div style="color:#9CA3AF;font-size:11px;text-align:center;padding:30px">No drops yet</div>'; return; } listEl.innerHTML=notices.map(n=>{ const time=new Date(n.timestamp||n.created_at||Date.now()).toLocaleString('en-US',{month:'short',day:'numeric',hour:'2-digit',minute:'2-digit'}); const exp=n.expiresAt?`<span style="background:rgba(245,158,11,0.15);color:#f59e0b;padding:2px 6px;border-radius:10px;font-size:9px">24H</span>`:`<span style="background:rgba(255,255,255,0.06);color:#9CA3AF;padding:2px 6px;border-radius:10px;font-size:9px">PERMA</span>`; const promo=n.type==='promotion'?`<span style="background:rgba(255,30,60,0.15);color:#FF1E3C;padding:2px 6px;border-radius:10px;font-size:9px">PROMO ${n.promotion?.items?.length||0}</span>`:''; const preview=n.promotion?.items?.[0]?`<img src="${n.promotion.items[0].cover_url}" style="width:32px;height:32px;border-radius:6px;margin-top:6px;border:1px solid rgba(255,255,255,0.1)">`:''; return `<div style="padding:10px;margin-bottom:8px;background:#0A1931;border:1px solid rgba(255,255,255,0.1);border-radius:10px;display:flex;justify-content:space-between;gap:10px"><div style="flex:1;min-width:0"><div style="display:flex;gap:6px;align-items:center;margin-bottom:4px;flex-wrap:wrap"><span style="font-size:10px;color:#9CA3AF">${time}</span>${exp}${promo}</div><div style="font-size:12px;color:#FFFFFF;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${escapeHtml((n.content||'').slice(0,80))}</div>${preview}</div><button onclick="window.deleteNotice('${n.id}')" style="width:26px;height:26px;border-radius:50%;background:#050A14;border:1px solid rgba(255,255,255,0.1);color:#9CA3AF;cursor:pointer">X</button></div>`; }).join(''); }catch(e){ if(!force) listEl.innerHTML=`<div style="color:#FF1E3C;font-size:11px;text-align:center;padding:20px">Failed: ${escapeHtml(e.message)}</div>`; } finally{ noticeHistoryLoading=false; } }
window.deleteNotice=async function(id){ if(!confirm('Delete?')) return; await fetch(`${DROP_API}/api/notices/${id}`, {method:'DELETE'}); showToast('Deleted'); await loadNoticeHistory(true); };
window.ccClearPromo=function(){ selectedBeats=[]; window.selectedBeats=selectedBeats; const sc=document.getElementById('selectedCount'); if(sc) sc.textContent='0/4'; const el=document.getElementById('promotePreview'); if(el) el.innerHTML=''; loadBeatsForPicker(); };
window.ccReloadDrops=()=>loadNoticeHistory(true);
function showToast(msg,err=false){ let t=document.getElementById('noxToast'); if(!t){ t=document.createElement('div'); t.id='noxToast'; t.style.cssText='position:fixed;top:20px;right:20px;padding:12px 18px;border-radius:8px;font-weight:700;z-index:99999;font-size:12px'; document.body.appendChild(t); } t.style.background=err?'#FF1E3C':'#FFFFFF'; t.style.color=err?'#FFFFFF':'#0A1931'; t.textContent=msg; t.style.display='block'; setTimeout(()=>t.style.display='none',2500); }
function debounce(fn,wait){ let t; return (...a)=>{ clearTimeout(t); t=setTimeout(()=>fn(...a),wait); }; }
function escapeHtml(s){ return (s||'').toString().replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }

function initRealMap(){
  setTimeout(()=>{
    const el=document.getElementById('dzRealMap'); if(!el) return;
    if(typeof L==='undefined'){ el.innerHTML='<div style="height:100%;display:flex;align-items:center;justify-content:center;color:#9CA3AF;font-size:11px">Loading map...</div>'; setTimeout(()=>initRealMap(),1000); return; }
    if(realMap){ realMap.invalidateSize(); return; }
    realMap=L.map('dzRealMap',{zoomControl:false,attributionControl:false,minZoom:2}).setView([25.2769,55.2962],2);
    const sat=L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',{maxZoom:19});
    const labels=L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}',{maxZoom:19});
    const dark=L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',{maxZoom:18});
    let mode='sat'; sat.addTo(realMap); labels.addTo(realMap);
    const btn=document.createElement('button'); btn.innerHTML='🌙 DARK'; btn.style.cssText='position:absolute;top:12px;right:12px;z-index:1000;background:#FFFFFF;color:#0A1931;border:none;padding:6px 12px;border-radius:99px;font-size:10px;font-weight:800;cursor:pointer'; el.style.position='relative'; el.appendChild(btn);
    btn.onclick=()=>{ if(mode==='sat'){ realMap.removeLayer(sat); realMap.removeLayer(labels); dark.addTo(realMap); btn.innerHTML='🛰 SAT'; mode='dark'; } else { realMap.removeLayer(dark); sat.addTo(realMap); labels.addTo(realMap); btn.innerHTML='🌙 DARK'; mode='sat'; } };
    const setHQ=(lat,lon,city,country)=>{ const hqIcon=L.divIcon({className:'',html:'<div style="width:18px;height:18px;background:#FF1E3C;border-radius:50%;border:3px solid #FFFFFF;box-shadow:0 0 20px rgba(255,30,60,0.8)"></div>',iconSize:[18,18],iconAnchor:[9,9]}); L.marker([lat,lon],{icon:hqIcon}).addTo(realMap).bindPopup(`<b>HQ</b><br>${city}`); const locEl=document.getElementById('dzLiveLoc'); if(locEl) locEl.textContent=city+', '+country; const cityEl=document.getElementById('dzLiveCity'); if(cityEl) cityEl.textContent=lat.toFixed(4)+', '+lon.toFixed(4); realMap.setView([lat,lon],3); };
    fetch('https://ipapi.co/json/').then(r=>r.json()).then(d=>setHQ(d.latitude||25.276987,d.longitude||55.296249,d.city||'Dubai',d.country_name||'UAE')).catch(()=>setHQ(25.276987,55.296249,'Dubai','UAE'));
  },800);
}
function updateRealMap(presence){
  if(!realMap||typeof L==='undefined') return; Object.values(mapMarkers).forEach(m=>{ try{ realMap.removeLayer(m); }catch{} }); mapMarkers={};
  presence.forEach((p,i)=>{
    let lat=p.lat||p.latitude|| (20+Math.sin(i)*20); let lon=p.lon||p.longitude|| (0+Math.cos(i)*40);
    const locText = `${p.city||''} ${p.country||''}`.trim() || `${lat.toFixed(2)},${lon.toFixed(2)}`;
    const icon=L.divIcon({className:'',html:`<div style="position:relative"><div style="width:12px;height:12px;background:#1E90FF;border-radius:50%;border:2px solid #FFFFFF;box-shadow:0 0 12px #1E90FF"></div><div style="position:absolute;top:16px;left:50%;transform:translateX(-50%);font-size:8px;color:#FFFFFF;background:#0A1931;padding:2px 6px;border-radius:99px;white-space:nowrap;font-weight:800;border:1px solid rgba(255,255,255,0.1)">📍 ${escapeHtml((p.user_name||'Fan').slice(0,8))}</div></div>`,iconSize:[12,12],iconAnchor:[6,6]});
    const m=L.marker([lat,lon],{icon}).addTo(realMap); m.bindPopup(`<b>${escapeHtml(p.user_name||'Fan')}</b><br>${escapeHtml(locText)}<br>${lat.toFixed(4)},${lon.toFixed(4)}`); m.on('click',()=>window.selectUser&&window.selectUser(p.user_id,p.user_name)); mapMarkers[p.user_id]=m;
  });
}
function initChatBoss(){
  const pillsWrap=document.getElementById('dzPillsWrap'); const threadWrap=document.getElementById('dzThreadWrap'); const threadHeader=document.getElementById('dzThreadHeader'); const btn=document.getElementById('dzReplyBtn'); const input=document.getElementById('dzReplyInput'); const count=document.getElementById('dzCount'); if(!pillsWrap||!threadWrap||!btn||!input) return;
  let lastChatHash='',lastPresenceHash='',isLoadingCC=false;

  window.selectUser=(uid,name)=>{
    selectedReplyUser={uid,name};
    input.placeholder=`Creators to ${name}...`;
    input.focus();
    // PIN NAME ON TOP IMMEDIATELY
    if(threadHeader){
      threadHeader.style.display='flex';
      threadHeader.innerHTML=`<div style="flex:1"><div style="font-size:13px;color:#FFFFFF;font-weight:900">${escapeHtml(name)} <span id="dzHeaderStatus" style="font-size:10px; color:#9CA3AF; font-weight:400"></span></div><div id="dzHeaderLoc" style="font-size:10px;color:#1E90FF;margin-top:2px">📍 locating...</div></div><div style="display:flex;gap:6px"><button id="deleteThreadBtn" data-uid="${uid}" data-name="${escapeHtml(name)}" style="background:#FF1E3C;border:none;color:#fff;padding:6px 10px;border-radius:99px;font-size:9px;font-weight:800;cursor:pointer">DELETE CHAT</button><button id="closeThreadBtn" style="background:#050A14;border:1px solid rgba(255,255,255,0.1);color:#9CA3AF;padding:6px 10px;border-radius:99px;font-size:10px;cursor:pointer">X</button></div>`;
    }
    loadCC(true);
  };

  window.deleteChatForUser=async(uid,name)=>{ if(!confirm(`Delete ALL chat with ${name}?`)) return; const res=await fetch(`${DROP_API}/api/chat?t=${Date.now()}`).then(r=>r.json()); const toDel=res.filter(c=>c.user_id===uid||c.reply_to_user_id===uid); for(let m of toDel) await fetch(`${DROP_API}/api/chat/${m.id}`,{method:'DELETE'}); showToast(`Deleted ${name}`); if(selectedReplyUser?.uid===uid){ selectedReplyUser=null; if(threadHeader) threadHeader.style.display='none'; threadWrap.innerHTML='<div style="height:100%;display:flex;align-items:center;justify-content:center;color:#9CA3AF;font-size:11px">Select fan</div>'; } lastChatHash=''; loadCC(true); };

  if(!window._dzClickBound){ window._dzClickBound=true; document.addEventListener('click',(e)=>{ const pill=e.target.closest('.fan-pill'); if(pill&&pillsWrap.contains(pill)){ e.stopPropagation(); selectUser(pill.dataset.uid,pill.dataset.name); return; } if(e.target.closest('#closeThreadBtn')){ e.stopPropagation(); selectedReplyUser=null; if(threadHeader) threadHeader.style.display='none'; threadWrap.innerHTML='<div style="height:100%;display:flex;align-items:center;justify-content:center;color:#9CA3AF;font-size:11px;text-align:center">Select fan from grid<br><span style="font-size:10px;color:#1E90FF">Offline pile works</span></div>'; input.placeholder='Select fan pill...'; return; } if(e.target.closest('#deleteThreadBtn')){ e.stopPropagation(); const b=e.target.closest('#deleteThreadBtn'); deleteChatForUser(b.dataset.uid,b.dataset.name); return; } if(e.target.closest('.del-msg-btn')){ e.stopPropagation(); const id=e.target.closest('.del-msg-btn').dataset.id; if(confirm('Delete message?')) fetch(`${DROP_API}/api/chat/${id}`,{method:'DELETE'}).then(()=>{ lastChatHash=''; loadCC(true); }); } }); }

  const markBtn=document.getElementById('dzMarkRead'); if(markBtn&&!markBtn._bound){ markBtn._bound=true; markBtn.onclick=(e)=>{ e.stopPropagation(); Object.values(allUsersCache).forEach(u=>u.unread=0); localStorage.setItem('dz_read_all',String(Date.now())); const unreadEl=document.getElementById('dzUnread'); if(unreadEl) unreadEl.style.display='none'; const statNew=document.getElementById('dzStatNew'); if(statNew) statNew.textContent='0'; loadCC(true); showToast('All read ✓'); }; }
  const clearBtn=document.getElementById('dzClearAll'); if(clearBtn&&!clearBtn._bound){ clearBtn._bound=true; clearBtn.onclick=async(e)=>{ e.stopPropagation(); if(!confirm('Clear ALL chats?')) return; clearBtn.textContent='...'; try{ const all=await fetch(`${DROP_API}/api/chat?t=${Date.now()}`).then(r=>r.json()); for(let m of all) await fetch(`${DROP_API}/api/chat/${m.id}`,{method:'DELETE'}); showToast('Cleared ✓'); lastChatHash=''; selectedReplyUser=null; if(threadHeader) threadHeader.style.display='none'; loadCC(true); }catch(err){ showToast(err.message,true); } finally{ clearBtn.innerHTML='CLEAR'; } }; }

  async function loadCC(force=false){
    if(isLoadingCC) return; isLoadingCC=true;
    try{
      const [chats,presence]=await Promise.all([fetch(`${DROP_API}/api/chat?t=${Date.now()}`).then(r=>r.json()),fetch(`${DROP_API}/api/presence?t=${Date.now()}`).then(r=>r.json()).catch(()=>[])]);
      const chatHash=JSON.stringify(chats.map(c=>c.id)); const presHash=JSON.stringify(presence.map(p=>p.user_id));
      if(!force&&chatHash===lastChatHash&&presHash===lastPresenceHash){ isLoadingCC=false; return; } lastChatHash=chatHash; lastPresenceHash=presHash;
      const liveMap=new Map(presence.map(p=>[p.user_id,{...p,online:true}])); const users={};
      // BUILD FROM CHATS FIRST - OFFLINE FANS INCLUDED
      chats.forEach(c=>{
        if(!c.user_id||c.user_id==='admin') return;
        if(!users[c.user_id]){
          const pres=liveMap.get(c.user_id);
          users[c.user_id]={uid:c.user_id,name:c.user_name||'Fan',count:0,online:!!pres,lastMsg:'',lastTime:0,unread:0,city:pres?.city||c.city||'',country:pres?.country||c.country||'',lat:pres?.latitude||pres?.lat||c.lat||c.latitude,lon:pres?.longitude||pres?.lon||c.lon||c.longitude};
        }
        users[c.user_id].count++; users[c.user_id].name=c.user_name||users[c.user_id].name; users[c.user_id].lastMsg=c.message; users[c.user_id].lastTime=new Date(c.created_at).getTime(); if(!c.is_admin) users[c.user_id].unread++;
        if(!users[c.user_id].city&&c.city) users[c.user_id].city=c.city;
      });
      // MARK READ LOGIC
      chats.forEach(c=>{ if(c.is_admin&&c.reply_to_user_id&&users[c.reply_to_user_id]){ const fanMsgs=chats.filter(x=>x.user_id===c.reply_to_user_id&&!x.is_admin).sort((a,b)=>new Date(b.created_at)-new Date(a.created_at)); const lastFan=fanMsgs[0]; if(lastFan&&new Date(c.created_at).getTime()>new Date(lastFan.created_at).getTime()){ users[c.reply_to_user_id].unread=0; } } });
      // ALSO ADD LIVE PRESENCE USERS WITH NO CHAT YET
      presence.forEach(p=>{ if(!users[p.user_id]){ users[p.user_id]={uid:p.user_id,name:p.user_name||'Fan',count:0,online:true,lastMsg:'LIVE now - no msgs yet',lastTime:Date.now(),unread:0,city:p.city||'',country:p.country||'',lat:p.latitude||p.lat,lon:p.longitude||p.lon}; } else { users[p.user_id].online=true; users[p.user_id].city=users[p.user_id].city||p.city||''; users[p.user_id].country=users[p.user_id].country||p.country||''; users[p.user_id].lat=users[p.user_id].lat||p.latitude||p.lat; users[p.user_id].lon=users[p.user_id].lon||p.longitude||p.lon; } });

      allUsersCache=users; const totalUnread=Object.values(users).reduce((s,u)=>s+u.unread,0);
      if(count) count.textContent=`${Object.keys(users).length} fans • ${presence.length} LIVE • ${totalUnread} NEW • offline pile enabled`;
      const unreadEl=document.getElementById('dzUnread'); if(unreadEl){ unreadEl.textContent=`${totalUnread} NEW`; unreadEl.style.display=totalUnread>0?'block':'none'; }
      const statLive=document.getElementById('dzStatLive'); if(statLive) statLive.textContent=presence.length; const statNew=document.getElementById('dzStatNew'); if(statNew) statNew.textContent=totalUnread;
      const sorted=Object.values(users).sort((a,b)=>{ if(b.unread!==a.unread) return b.unread-a.unread; if((b.online?1:0)!==(a.online?1:0)) return (b.online?1:0)-(a.online?1:0); return b.lastTime-a.lastTime; });

      pillsWrap.innerHTML=sorted.length?sorted.map(u=>{
        const loc = [u.city,u.country].filter(Boolean).join(', ') || (u.lat?`${u.lat.toFixed(1)},${u.lon.toFixed(1)}`:'offline');
        return `<div data-uid="${u.uid}" data-name="${escapeHtml(u.name)}" class="fan-pill" style="background:${selectedReplyUser?.uid===u.uid?'#FF1E3C':'#0A1931'};border:1px solid ${u.unread>0?'#FF1E3C':(selectedReplyUser?.uid===u.uid?'#FF1E3C':'rgba(255,255,255,0.1)')};border-radius:12px;padding:10px 12px;display:flex;align-items:center;gap:10px;cursor:pointer;flex-shrink:0;${u.unread>0?'box-shadow:0 0 15px rgba(255,30,60,0.3)':''}">
          <div style="position:relative"><div style="width:36px;height:36px;border-radius:50%;background:${selectedReplyUser?.uid===u.uid?'#FFFFFF':'#050A14'};display:flex;align-items:center;justify-content:center;color:${selectedReplyUser?.uid===u.uid?'#0A1931':'#FFFFFF'};font-weight:900;font-size:12px;border:1px solid ${u.online?'#1E90FF':'rgba(255,255,255,0.1)'}">${escapeHtml(u.name[0]?.toUpperCase()||'F')}</div><div style="position:absolute;bottom:-2px;right:-2px;width:10px;height:10px;border-radius:50%;background:${u.online?'#1E90FF':'#555'};border:2px solid #0A1931"></div>${u.unread>0?`<div style="position:absolute;top:-6px;left:-6px;background:#FF1E3C;color:#fff;font-size:8px;font-weight:900;padding:2px 5px;border-radius:99px;border:1px solid #0A1931">${u.unread}</div>`:''}</div>
          <div style="flex:1;min-width:0"><div style="font-size:12px;color:#FFFFFF;font-weight:700">${escapeHtml(u.name)}</div><div style="font-size:9px;color:#1E90FF;background:rgba(30,144,255,0.12);padding:2px 6px;border-radius:99px;display:inline-block;margin-top:2px">📍 ${escapeHtml(loc.slice(0,30))}</div><div style="font-size:9px;color:#9CA3AF;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:160px;margin-top:3px">${escapeHtml(u.lastMsg||'No msg')} • ${u.online?'LIVE':'offline'}</div></div></div>`;
      }).join(''):`<div style="color:#9CA3AF;font-size:11px;padding:20px;text-align:center;border:1px dashed rgba(255,255,255,0.1);border-radius:12px">No fans yet</div>`;

      // UPDATE HEADER LOCATION + STATUS
      if(selectedReplyUser){
        const uInfo = users[selectedReplyUser.uid];
        const thread=chats.filter(c=>c.user_id===selectedReplyUser.uid||c.reply_to_user_id===selectedReplyUser.uid).sort((a,b)=>new Date(a.created_at)-new Date(b.created_at));
        const visibleThread=thread.slice(-50); // LATEST PILE

        if(threadHeader && uInfo){
          threadHeader.style.display='flex';
          const isLive = liveMap.has(selectedReplyUser.uid) || uInfo.online;
          const uLoc = [uInfo.city,uInfo.country].filter(Boolean).join(', ') + (uInfo.lat?` • ${uInfo.lat.toFixed(4)},${uInfo.lon.toFixed(4)}`:'');
          const statusEl = document.getElementById('dzHeaderStatus');
          const locEl = document.getElementById('dzHeaderLoc');
          // update header
          threadHeader.innerHTML=`<div style="flex:1"><div style="font-size:13px;color:#FFFFFF;font-weight:900">${escapeHtml(selectedReplyUser.name)} <span style="font-size:10px; color:${isLive?'#1E90FF':'#9CA3AF'}; font-weight:400">${isLive?'• LIVE NOW':'• offline - pile still works'}</span></div><div style="font-size:10px;color:#1E90FF;margin-top:2px">📍 ${escapeHtml(uLoc)||'locating...'} • ${uInfo.count} msgs</div></div><div style="display:flex;gap:6px"><button id="deleteThreadBtn" data-uid="${selectedReplyUser.uid}" data-name="${escapeHtml(selectedReplyUser.name)}" style="background:#FF1E3C;border:none;color:#fff;padding:6px 10px;border-radius:99px;font-size:9px;font-weight:800;cursor:pointer">DELETE</button><button id="closeThreadBtn" style="background:#050A14;border:1px solid rgba(255,255,255,0.1);color:#9CA3AF;padding:6px 10px;border-radius:99px;font-size:10px;cursor:pointer">X</button></div>`;
        }

        threadWrap.innerHTML = visibleThread.length?`<div style="font-size:8px;color:#9CA3AF;text-align:center;padding:6px;background:rgba(255,255,255,0.04);border-radius:99px;letter-spacing:1px">LATEST ${visibleThread.length} • PILE UP • OFFLINE SUPPORTED</div><div style="display:flex;flex-direction:column;gap:10px;margin-top:10px">${visibleThread.map(c=>{ const isCreator=c.is_admin==1||c.user_id==='admin'; return `<div style="display:flex;gap:8px;align-items:flex-end;${isCreator?'':'flex-direction:row-reverse'};flex-shrink:0"><div style="width:24px;height:24px;border-radius:50%;background:${isCreator?'#FF1E3C':'#FFFFFF'};display:flex;align-items:center;justify-content:center;color:${isCreator?'#FFFFFF':'#0A1931'};font-size:7px;font-weight:900;flex-shrink:0">${isCreator?'CR':escapeHtml((c.user_name||'F')[0].toUpperCase())}</div><div style="max-width:72%;padding:10px 12px;border-radius:${isCreator?'14px 14px 2px 14px':'14px 14px 14px 2px'};font-size:12px;background:${isCreator?'#0A1931':'#FFFFFF'};border:1px solid ${isCreator?'rgba(255,255,255,0.1)':'#E5E7EB'};color:${isCreator?'#FFFFFF':'#0A1931'};line-height:1.4"><div style="white-space:pre-wrap;word-break:break-word">${escapeHtml(c.message)}</div><div style="display:flex;justify-content:space-between;margin-top:4px"><span style="font-size:8px;color:#9CA3AF">${new Date(c.created_at).toLocaleTimeString()} ${c.city?`• ${c.city}`:''}</span><button data-id="${c.id}" class="del-msg-btn" style="background:none;border:none;color:#9CA3AF;cursor:pointer;font-size:10px">DEL</button></div></div></div>`; }).join('')}</div>`:`<div style="color:#9CA3AF;font-size:11px;text-align:center;padding:30px">No messages yet - start chat even if offline<br><span style="font-size:10px;color:#1E90FF">Messages will pile up</span></div>`;

        // SMOOTH SCROLL TO LATEST
        requestAnimationFrame(()=>{ threadWrap.scrollTo({top:threadWrap.scrollHeight, behavior:'smooth'}); });
      } else {
        if(!selectedReplyUser && threadHeader){ threadHeader.style.display='none'; }
        if(!selectedReplyUser){
          threadWrap.innerHTML=`<div style="height:100%;display:flex;align-items:center;justify-content:center;color:#9CA3AF;font-size:11px;text-align:center;flex-direction:column;gap:8px"><div>Select fan pill<br><span style="font-size:10px;color:#1E90FF">Name appears on top • pile works offline</span></div></div>`;
        }
      }
      updateRealMap([...liveMap.values(),...Object.values(users).filter(u=>u.lat&&!liveMap.has(u.uid))]);
    }catch(e){ console.error(e); } finally{ isLoadingCC=false; }
  }
  btn.onclick=async()=>{ const m=input.value.trim(); if(!m) return; if(!selectedReplyUser) return showToast('Select fan first',true); btn.disabled=true; try{ await fetch(`${DROP_API}/api/chat`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({user_name:'Dope Tone Creators',user_id:'admin',email:'creators@dopetone.com',message:m,is_admin:1,reply_to_user_id:selectedReplyUser.uid,reply_to_name:selectedReplyUser.name})}); input.value=''; showToast(`To ${selectedReplyUser.name}`); lastChatHash=''; loadCC(true); }catch(err){ showToast(err.message,true); } finally{ btn.disabled=false; } };
  input.onkeydown=e=>{ if(e.key==='Enter') btn.click(); }; loadCC(true); setInterval(()=>loadCC(false),2500);
}
export { loadNoticeHistory };
