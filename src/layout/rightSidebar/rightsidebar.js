export function initRight(force = false){
  const isCC = (location.hash||'').startsWith('#/cc/');
  if(isCC &&!force) return; // Don't render queue when CC is open - unless forced
  const el=document.getElementById('right-sidebar');
  if(!el) return;

  // Reset CC styles - THIS FIXES OVERPOWERING
  el.style.width = '';
  el.style.minWidth = '';
  el.style.maxWidth = '';
  el.style.background = '';
  el.style.borderLeft = '';
  el.style.zIndex = '';
  el.style.display = '';

  el.innerHTML=`
  <style id="queue-eq-style">
    @keyframes qeq1 { 0%,100%{height:4px} 50%{height:12px} }
    @keyframes qeq2 { 0%,100%{height:10px} 50%{height:3px} }
    @keyframes qeq3 { 0%,100%{height:6px} 50%{height:14px} }
  .queue-eq { display:flex; gap:2px; align-items:end; width:16px; height:14px; }
  .queue-eq span{ width:3px; background:#FF1E3C; border-radius:99px; display:block; }
  .queue-eq span:nth-child(1){ animation: qeq1 0.6s infinite ease-in-out; }
  .queue-eq span:nth-child(2){ animation: qeq2 0.6s infinite ease-in-out 0.2s; }
  .queue-eq span:nth-child(3){ animation: qeq3 0.6s infinite ease-in-out 0.4s; }
  .queue-item{ display:flex; align-items:center; gap:10px; padding:8px; border-radius:8px; cursor:pointer; margin-bottom:4px; transition: all.2s; border:1px solid transparent; }
  .queue-item:hover{ background: rgba(255,255,255,0.06); }
  .queue-item.is-active{ background: rgba(255,30,60,0.12)!important; border-color: rgba(255,30,60,0.25)!important; }
  .queue-item.is-active.q-title{ color:#fff!important; font-weight:700!important; }
  </style>
  <div style="display:flex;flex-direction:column;height:100%;padding:0">
    <div style="padding:16px 16px 12px;display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid rgba(255,255,255,0.08)">
      <h3 style="margin:0;font-size:14px;font-weight:800;letter-spacing:0.5px">QUEUE</h3>
      <span id="queueCount" style="font-size:11px;color:#9CA3AF;background:rgba(255,255,255,0.08);padding:3px 8px;border-radius:99px">0 tracks</span>
    </div>
    <div id="rightNow" style="padding:14px 16px;border-bottom:1px solid rgba(255,255,255,0.06);display:none">
      <div style="font-size:10px;letter-spacing:1px;color:#FF1E3C;font-weight:800;margin-bottom:8px">NOW PLAYING</div>
      <div style="display:flex;gap:10px">
        <img id="qCover" src="" style="width:48px;height:48px;border-radius:8px;object-fit:cover">
        <div style="min-width:0;flex:1">
          <div id="qTitle" style="color:white;font-weight:700;font-size:13px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis"></div>
          <div id="qMeta" style="color:#9CA3AF;font-size:11px;margin-top:2px"></div>
        </div>
        <div id="qEq" class="queue-eq" style="display:none"><span></span><span></span><span></span></div>
      </div>
    </div>
    <div id="rightContent" style="flex:1;overflow-y:auto;padding:8px">
      <div style="color:#9CA3AF;font-size:13px;padding:20px;text-align:center">No queue - play a beat</div>
    </div>
  </div>`;

  function getCurrentId(){
    return String(window.__CURRENT_BEAT__?.id || window.DTPlayer?.queue?.[window.DTPlayer?.index]?.id || '');
  }

  function renderQueue(){
    const q=window.DTPlayer?.queue||[];
    const currentId = getCurrentId();
    const idx = window.DTPlayer?.index?? 0;
    const listEl=document.getElementById('rightContent');
    const countEl=document.getElementById('queueCount');
    if(!listEl) return;
    if(countEl) countEl.textContent=`${q.length} tracks`;

    if(!q.length){
      listEl.innerHTML=`<div style="color:#9CA3AF;font-size:13px;padding:20px;text-align:center">No queue</div>`;
      return;
    }

    listEl.innerHTML=q.map((t,i)=>{
      const isActive = String(t.id) === currentId || (!currentId && i === idx);
      const isPlaying = isActive && window.__DT_AUDIO__ &&!window.__DT_AUDIO__.paused;
      return `
      <div data-queue-idx="${i}" data-beat-id="${t.id}" class="queue-item ${isActive?'is-active':''}">
        <img src="${t.cover_url||t.cover||'public/images/logo.png'}" style="width:36px;height:36px;border-radius:6px;object-fit:cover">
        <div style="min-width:0;flex:1">
          <div class="q-title" style="color:${isActive?'#fff':'#E5E7EB'};font-size:12px;font-weight:${isActive?'700':'500'};white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${t.title||'Untitled'}</div>
          <div style="color:#9CA3AF;font-size:10px">${t.genre||''} ${t.bpm?'• '+t.bpm+' BPM':''}</div>
        </div>
        ${isActive? `<div class="queue-eq" style="display:${isPlaying?'flex':'none'}"><span></span><span></span></div>` : ''}
      </div>`;
    }).join('');

    const activeEl = listEl.querySelector('.queue-item.is-active');
    if(activeEl){
      activeEl.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }

    listEl.querySelectorAll('[data-queue-idx]').forEach(div=>{
      div.onclick=()=>{
        const i=parseInt(div.dataset.queueIdx);
        window.DTPlayer.index=i;
        window.__CURRENT_INDEX__ = i;
        localStorage.setItem('dt_index_v2', String(i));
        const track = window.DTPlayer.queue[i];
        if(window.DTPlayTrack) window.DTPlayTrack(track, true);
      };
    });
  }

  function updateNowPlaying(t){
    const nowEl=document.getElementById('rightNow');
    if(!nowEl ||!t) return;
    nowEl.style.display='block';
    document.getElementById('qCover').src = t.cover_url||t.cover||'public/images/logo.png';
    document.getElementById('qTitle').textContent = t.title||'No track';
    document.getElementById('qMeta').textContent = `${t.genre||''} ${t.bpm?'• '+t.bpm+' BPM':''}`.trim();
    const eq = document.getElementById('qEq');
    if(eq){
      const playing = window.__DT_AUDIO__ &&!window.__DT_AUDIO__.paused;
      eq.style.display = playing? 'flex' : 'none';
    }
  }

  window.syncQueueToSection = function(list, listId, activeIndex = 0){
    if(!list?.length) return;
    const currentId = getCurrentId();
    let keepIdx = activeIndex;
    if(currentId){
      const found = list.findIndex(b=> String(b.id) === currentId);
      if(found!== -1) keepIdx = found;
    }
    window.__CURRENT_LIST__ = listId;
    window.__CURRENT_BEATS__ = list;
    if(window.DTPlayer){
      window.DTPlayer.queue = list;
      window.DTPlayer.index = keepIdx;
      localStorage.setItem('dt_queue_v2', JSON.stringify(list));
      localStorage.setItem('dt_index_v2', String(keepIdx));
    }
    renderQueue();
  };

  document.addEventListener('playerPlay', e => {
    const idx = e.detail?.index?? window.__CURRENT_INDEX__?? 0;
    if(window.DTPlayer) window.DTPlayer.index = idx;
    window.__CURRENT_INDEX__ = idx;
    localStorage.setItem('dt_index_v2', String(idx));
    if(window.__CURRENT_BEAT__) updateNowPlaying(window.__CURRENT_BEAT__);
    renderQueue();
  });

  document.addEventListener('playerPause', () => {
    renderQueue();
    const eq = document.getElementById('qEq');
    if(eq) eq.style.display = 'none';
  });

  const origPlayTrack = window.DTPlayTrack;
  window.DTPlayTrack = function(t, shouldPlay){
    if(origPlayTrack) origPlayTrack(t, shouldPlay);
    window.__CURRENT_BEAT__ = t;
    updateNowPlaying(t);
    renderQueue();
  };

  if(window.DTPlayer){
    const origSetQueue = window.DTPlayer.setQueue.bind(window.DTPlayer);
    window.DTPlayer.setQueue = function(list, i=0, play=true){
      origSetQueue(list, i, play);
      renderQueue();
    };
  }

  const audio = window.__DT_AUDIO__;
  if(audio){
    audio.addEventListener('play', renderQueue);
    audio.addEventListener('pause', renderQueue);
  }

  renderQueue();
  if(window.__CURRENT_BEAT__) updateNowPlaying(window.__CURRENT_BEAT__);
  window.__renderQueue = renderQueue;
}
window.initRight = initRight;
