// cc-beats-table.js V12.3 FINAL - STICKY HEADER - LAZY LOAD - PURE SVG - PLAYER LINKED - ORIGINAL WORKING
import {
  BEATS_API,
  allBeats,
  setAllBeats,
  setFilteredBeats,
  currentTrack,
  isPlaying
} from '../cc-config.js';

let visibleCount = 30;
let filteredList = [];
let currentPlayingId = null;

export async function mount(el){
  if(!el) return;
  el.innerHTML = `
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
  `;
  await initBeatsTable();
}

export async function initBeatsTable(){
  const searchInput=document.getElementById('beatsSearch');
  const topSearch=document.getElementById('searchBar');

  const handleSearch=debounce((q)=>{
    const query=q.toLowerCase().trim();
    filteredList=query? allBeats.filter(b =>
      (b.title||'').toLowerCase().includes(query) ||
      (b.artist||'').toLowerCase().includes(query) ||
      (b.genre||'').toLowerCase().includes(query) ||
      (b.tags||'').toLowerCase().includes(query) ||
      (b.mood||'').toLowerCase().includes(query)
    ) : allBeats;
    visibleCount=30;
    renderBeatsTable(filteredList.slice(0, visibleCount));
    setFilteredBeats(filteredList);
  }, 150);

  if(searchInput) searchInput.addEventListener('input', e=>handleSearch(e.target.value));
  if(topSearch) topSearch.addEventListener('input', e=>{
    if(searchInput) searchInput.value=e.target.value;
    handleSearch(e.target.value);
  });

  const scrollWrap=document.getElementById('beatsScrollWrap');
  if(scrollWrap){
    scrollWrap.addEventListener('scroll', ()=>{
      const nearBottom = scrollWrap.scrollTop + scrollWrap.clientHeight >= scrollWrap.scrollHeight - 250;
      if(nearBottom && visibleCount < filteredList.length){
        visibleCount+=30;
        renderBeatsTable(filteredList.slice(0, visibleCount));
      }
    });
  }

  const createBtn=document.getElementById('ccCreateBeatBtn');
  if(createBtn){
    createBtn.onclick=async(e)=>{
      e.preventDefault();
      e.stopPropagation();
      try{
        const mod=await import('./cc-create-modal.js');
        if(mod.openCreateBeatModal){ mod.openCreateBeatModal(); return; }
        if(mod.default?.openCreateBeatModal){ mod.default.openCreateBeatModal(); return; }
      }catch(err){ console.warn('[Create Modal Import]', err); }
      if(window.openCreateBeatModal){ window.openCreateBeatModal(); return; }
      if(window.ccOpenCreate){ window.ccOpenCreate(); return; }
      if(window.openCreateModal){ window.openCreateModal(); return; }
      window.dispatchEvent(new CustomEvent('cc_create_beat'));
      const m=document.getElementById('createBeatModal')||document.getElementById('createModal')||document.getElementById('uploadModal');
      if(m){ m.classList.add('active'); m.style.display='flex'; document.body.classList.add('modal-open'); }
    };
  }

  try{ const cMod=await import('./cc-create-modal.js'); if(cMod.init) cMod.init(); }catch{}

  await loadBeats();
}

async function loadBeats(){
  try{
    const res=await fetch(`${BEATS_API}/beats`,{cache:'no-store'});
    if(!res.ok) throw new Error(`HTTP ${res.status}`);
    const data=await res.json();
    const list=Array.isArray(data)?data:(data.beats||data.data||[]);
    setAllBeats(list);
    filteredList=list;
    visibleCount=30;
    setFilteredBeats(list);
    renderBeatsTable(list.slice(0, visibleCount));
    const countEl=document.getElementById('ccBeatsCount');
    if(countEl) countEl.textContent=`${list.length} beats`;
  }catch(err){
    console.error('[Beats]', err);
    const tbody=document.getElementById('beatsTableBody');
    if(tbody) tbody.innerHTML=`<tr><td colspan="7" style="padding:32px;text-align:center;color:#ff5555;font-size:13px">Failed: ${err.message}<br><small style="color:#6B7280">${BEATS_API}/beats</small></td></tr>`;
  }
}

export function renderBeatsTable(beats){
  const tbody=document.getElementById('beatsTableBody');
  if(!tbody) return;
  if(!beats||!beats.length){
    tbody.innerHTML=`<tr><td colspan="7" style="padding:32px;text-align:center;color:#6B7280;font-size:13px">No beats found — Click CREATE</td></tr>`;
    return;
  }

  const loader=document.getElementById('beatsLazyLoader');
  if(loader){
    loader.style.display = filteredList.length > beats.length? 'block' : 'none';
    if(filteredList.length > beats.length){
      loader.innerHTML=`<div style="display:inline-flex;align-items:center;gap:8px"><span style="width:14px;height:14px;border:2px solid rgba(255,255,255,.12);border-top-color:#FF1E3C;border-radius:50%;display:inline-block;animation:spin 1s linear infinite"></span> Showing ${beats.length} of ${filteredList.length} — scroll to load more</div>`;
    }
  }

  tbody.innerHTML=beats.map(beat=>{
    const isFree=beat.monetization_mode==='free';
    const realRev=parseFloat(beat.real_revenue||0);
    const revenue=isFree?'FREE':(realRev>0?`$${realRev.toFixed(2)}`:`$${((beat.download_count||0)*(beat.price||0)).toFixed(2)}`);
    const isPlayingNow=currentPlayingId===String(beat.id);
    const cover=beat.cover_url||beat.cover||'images/logo.png';
    return `
      <tr data-beat-id="${beat.id}" style="border-bottom:1px solid rgba(255,255,255,.05);transition:background.15s">
        <td style="padding:12px 16px">
          <div style="display:flex;gap:10px;align-items:center">
            <div style="position:relative;width:36px;height:36px;flex-shrink:0">
              <img src="${cover}" style="width:36px;height:36px;border-radius:8px;object-fit:cover;border:1px solid rgba(255,255,255,.08);display:block" loading="lazy" onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzYiIGhlaWdodD0iMzYiIHZpZXdCb3g9IjAgMCAzNiAzNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMzYiIGhlaWdodD0iMzYiIHJ4PSI4IiBmaWxsPSIjOGI1Y2Y2Ii8+PHRleHQgeD0iMTgiIHk9IjIxIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSJ3aGl0ZSIgZm9udC1zaXplPSIxMiIgZm9udC13ZWlnaHQ9IjcwMCI+RFQ8L3RleHQ+PC9zdmc+'" />
              ${isPlayingNow?`<div style="position:absolute;inset:0;background:rgba(255,30,60,.75);border-radius:8px;display:grid;place-items:center"><svg width="12" height="12" viewBox="0 0 24 24" fill="#fff"><rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/></svg></div>`:``}
            </div>
            <div style="min-width:0">
              <div style="color:#fff;font-size:13px;font-weight:700;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:220px">${escapeHtml(beat.title)}</div>
              <div style="font-size:11px;color:#6B7280;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:220px">${escapeHtml(beat.artist||'DopeTone')} • ${beat.bpm||'-'} BPM • ${beat.key||''}</div>
            </div>
          </div>
        </td>
        <td style="color:#9CA3AF;font-size:12px;font-weight:600;padding:12px 8px">${beat.play_count??beat.plays??0}</td>
        <td style="color:#9CA3AF;font-size:12px;padding:12px 8px">${beat.download_count??beat.downloads??0}</td>
        <td style="color:#9CA3AF;font-size:12px;padding:12px 8px">${beat.like_count??beat.likes??0}</td>
        <td style="color:#9CA3AF;font-size:12px;padding:12px 8px">${beat.cart_count??0}</td>
        <td style="padding:12px 8px;font-size:12px;font-weight:800;${isFree?'color:#60A5FA':'color:#10b981'}">${revenue}</td>
        <td style="padding:12px 16px">
          <div style="display:flex;gap:6px;justify-content:flex-end;align-items:center">
            <button onclick="window.ccTogglePlay('${beat.id}')" data-play-id="${beat.id}" title="${isPlayingNow?'Pause':'Play'}" style="width:32px;height:32px;border-radius:8px;border:1px solid ${isPlayingNow?'#FF1E3C':'rgba(255,255,255,.12)'};background:${isPlayingNow?'#FF1E3C':'#111'};color:#fff;cursor:pointer;display:grid;place-items:center;transition:all.15s">
              ${isPlayingNow
              ? `<svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16" rx="1.2"/><rect x="14" y="4" width="4" height="16" rx="1.2"/></svg>`
                : `<svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5.14v14l11-7-11-7z"/></svg>`
              }
            </button>
            <button onclick="window.ccEditBeat('${beat.id}')" title="Edit beat" style="width:32px;height:32px;border-radius:8px;border:none;background:#8b5cf6;color:#fff;cursor:pointer;display:grid;place-items:center">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
            </button>
            <button onclick="window.ccDeleteBeat('${beat.id}')" title="Delete" style="width:32px;height:32px;border-radius:8px;border:none;background:#ff3b3b;color:#fff;cursor:pointer;display:grid;place-items:center">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
            </button>
          </div>
        </td>
      </tr>`;
  }).join('');
}

function escapeHtml(s){ return (s||'').toString().replace(/[&<>"']/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }

// PLAYER - USES YOUR V2 SINGLETON - ORIGINAL WORKING
window.ccPlayBeat = (id) => {
  const idx = allBeats.findIndex(b => String(b.id) === String(id));
  if(idx === -1) return;
  const beat = allBeats[idx];
  window.__CURRENT_LIST__ = 'cc-beats';
  if(window.DTPlayer && window.DTPlayer.setQueue){
    window.DTPlayer.setQueue(allBeats, idx, true);
  } else if(window.globalPlayer && window.globalPlayer.play){
    window.globalPlayer.play(idx, allBeats, 'cc-beats');
  } else if(window.DTPlayTrack){
    window.DTPlayTrack(beat, true);
  }
};

window.ccTogglePlay = (id) => {
  const audio = window.__DT_AUDIO__ || window.__DOPE_TONE_AUDIO__;
  const cur = window.__CURRENT_BEAT__;
  if(cur && String(cur.id) === String(id) && audio &&!audio.paused){
    audio.pause();
    return;
  }
  if(cur && String(cur.id) === String(id) && audio && audio.paused){
    audio.play().catch(()=>{});
    return;
  }
  window.ccPlayBeat(id);
};

// DELETE - FIXED ONLY - DOES NOT OPEN EDIT
window.ccDeleteBeat = async (id) => {
  const beat = allBeats.find(b=>String(b.id)===String(id));
  if(!confirm(`Delete "${beat?.title||id}" forever?`)) return;
  try{
    const res = await fetch(`${BEATS_API}/beats/${id}`, {method:'DELETE'});
    if(!res.ok) throw new Error(await res.text());
    const newAll = allBeats.filter(b=>String(b.id)!==String(id));
    setAllBeats(newAll);
    filteredList = filteredList.filter(b=>String(b.id)!==String(id));
    const toShow = (filteredList.length? filteredList : newAll).slice(0, visibleCount);
    renderBeatsTable(toShow);
    const countEl=document.getElementById('ccBeatsCount');
    if(countEl) countEl.textContent=`${newAll.length} beats`;
  }catch(err){ alert('Delete failed: '+err.message); }
};

// EDIT - LINKED TO V19 MODAL
window.ccEditBeat=async(id)=>{
  const beat=allBeats.find(b=>String(b.id)===String(id));
  if(!beat){ alert('Beat not loaded yet'); return; }
  try{
    const mod=await import('./cc-edit-modal.js');
    if(mod.openEditModal){ mod.openEditModal(beat); return; }
  }catch(err){ console.warn('edit import failed', err); }
  if(window.openEditModalDirect){ window.openEditModalDirect(beat); return; }
  window.dispatchEvent(new CustomEvent('cc_edit_beat',{detail:id}));
  const m=document.getElementById('editModal');
  if(m){ m.style.display='flex'; m.classList.add('active'); document.body.classList.add('modal-open'); }
};

export async function refreshBeatsTable(){
  const list=allBeats; filteredList=list; visibleCount=30;
  renderBeatsTable(list.slice(0, visibleCount));
}

export function updatePlayButtonInTable(id, playing){
  const btn=document.querySelector(`[data-play-id="${id}"]`);
  if(!btn) return;
  if(playing){
    btn.style.background='#FF1E3C'; btn.style.borderColor='#FF1E3C';
    btn.innerHTML=`<svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16" rx="1.2"/><rect x="14" y="4" width="4" height="16" rx="1.2"/></svg>`;
  }else{
    btn.style.background='#111'; btn.style.borderColor='rgba(255,255,255,.12)';
    btn.innerHTML=`<svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5.14v14l11-7-11-7z"/></svg>`;
  }
}

function debounce(func, wait){ let t; return (...a)=>{ clearTimeout(t); t=setTimeout(()=>func(...a),wait); }; }

window.addEventListener('cc_dashboard_refresh', async()=>{ await loadBeats(); });
window.addEventListener('cc_beats_loaded', (e)=>{ filteredList=e.detail||allBeats; visibleCount=30; renderBeatsTable(filteredList.slice(0, visibleCount)); });

// PLAYER EVENTS - ORIGINAL WORKING - BOTH NAMES
window.addEventListener('playerPlay', (e)=>{ const id=e.detail?.beatId||e.detail?.id||window.__CURRENT_BEAT__?.id; if(id){ if(currentPlayingId) updatePlayButtonInTable(currentPlayingId,false); currentPlayingId=String(id); updatePlayButtonInTable(id,true); } });
window.addEventListener('playerPause', ()=>{ if(currentPlayingId){ updatePlayButtonInTable(currentPlayingId,false); currentPlayingId=null; } });
window.addEventListener('player:play', (e)=>{ const id=e.detail?.beatId||e.detail?.id; if(id){ if(currentPlayingId) updatePlayButtonInTable(currentPlayingId,false); currentPlayingId=String(id); updatePlayButtonInTable(id,true); } });
window.addEventListener('player:pause', ()=>{ if(currentPlayingId){ updatePlayButtonInTable(currentPlayingId,false); currentPlayingId=null; } });
document.addEventListener('playerPlay', (e)=>{ const id=e.detail?.beatId||window.__CURRENT_BEAT__?.id; if(id){ if(currentPlayingId) updatePlayButtonInTable(currentPlayingId,false); currentPlayingId=String(id); updatePlayButtonInTable(id,true); } });
document.addEventListener('playerPause', ()=>{ if(currentPlayingId){ updatePlayButtonInTable(currentPlayingId,false); currentPlayingId=null; } });

