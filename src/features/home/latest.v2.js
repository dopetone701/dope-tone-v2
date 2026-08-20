// src/features/latest/latest.v2.js - HASH + D1 FIXED
import { store } from '../../core/store.js';

const MAX = 10;
let isDragging = false;
const PLAY = `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5.14v14l11-7-11-7z"/></svg>`;
const PAUSE = `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>`;

const STATS_API="https://dopetone-stats.dopetone701.workers.dev";
const trackEvent=(id,type)=>{if(!id)return;fetch(`${STATS_API}/api/stats/event`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({beatId:parseInt(id),eventType:type}),keepalive:true}).catch(()=>{})};

function goToBeat(beat){
  if(!beat?.id) return;
  location.hash = `#/beat?id=${encodeURIComponent(beat.id)}`;
}
function goToBeatsList(){
  location.hash = `#/beats`;
}
window.goToBeat = goToBeat;

export async function renderLatest(){
  const wrap = document.getElementById('latestWrap');
  const mount = document.getElementById('latestMount');
  if(!mount) { console.error('[LATEST] mount missing'); return; }

  const beats = store?.getBeats?.() || window.__BEATS__ || window.DTStore?.beats || [];
  if(!beats.length){ setTimeout(renderLatest,500); return; }

  const latest = [...beats].sort((a,b)=>{
    const da = a.created_at? new Date(a.created_at).getTime():0;
    const db = b.created_at? new Date(b.created_at).getTime():0;
    return (db-da)||b.id-a.id;
  }).slice(0,MAX);

  if(wrap) wrap.classList.add('rp-active');
  mount.innerHTML = '';
  mount.className = '';
  mount.style.display = 'block';

  const scroller = document.createElement('div');
  scroller.className = 'rp-scroll';

  latest.forEach((beat, i)=>{
    const card = document.createElement('div');
    card.className = 'rp-card';
    card.dataset.beatId = String(beat.id);
    card.innerHTML = `
      <div class="rp-cover">
        <img src="${beat.cover_url||beat.cover||'public/images/logo.png'}" loading="lazy" draggable="false">
        <button class="rp-playbtn" data-id="${beat.id}" type="button">
          <span class="rp-icon">${PLAY}</span>
        </button>
        <div class="rp-eq"><span></span><span></span></div>
      </div>
      <div class="rp-title">${beat.title||'Untitled'}</div>
    `;

    const btn = card.querySelector('.rp-playbtn');
    btn.onclick = (e)=>{
      e.stopPropagation();
      e.preventDefault();
      if(isDragging) return;
      const curId = String(window.__CURRENT_BEAT__?.id||'');
      const curList = window.__CURRENT_LIST__||'';
      const isSame = curId === String(beat.id) && curList === 'latest';
      if(isSame){
        try{
          if(window.DTPlayer?.toggle){ window.DTPlayer.toggle(); return; }
          if(window.DTPlayer?.pause && window.DTPlayer?.play){
            const audio = window.DTPlayer.audio || window.__DT_AUDIO__ || document.querySelector('audio');
            if(audio?.paused){ window.DTPlayer.play?.(); audio.play().catch(()=>{}); } else { window.DTPlayer.pause?.(); audio.pause(); }
            return;
          }
          const a = window.__DT_AUDIO__ || window.DTPlayer?.audio || document.querySelector('audio');
          if(a){ if(a.paused){ a.play().catch(()=>{}); } else { a.pause(); } }
        }catch(err){ console.error('[LATEST] toggle error', err); }
        return;
      }
      window.__CURRENT_LIST__ = 'latest';
      window.__CURRENT_BEATS__ = latest;
      window.__CURRENT_INDEX__ = i;
      window.__CURRENT_BEAT__ = beat;
      localStorage.setItem('dt_list_v2','latest');
      localStorage.setItem('dt_index_v2', String(i));
      localStorage.setItem('dt_queue_v2', JSON.stringify(latest));
      trackEvent(beat.id,"play");
      if(window.DTPlayer?.setQueue){ window.DTPlayer.setQueue(latest, i, true); }
      else if(window.DTPlayTrack){ window.DTPlayTrack(beat, true); }
      document.dispatchEvent(new CustomEvent('dt:listSwitch', {detail:{listId:'latest'}}));
    };

    const titleEl = card.querySelector(".rp-title");
    if(titleEl){
      titleEl.style.cursor="pointer";
      titleEl.onclick = e=>{ e.stopPropagation(); if(!isDragging) goToBeat(beat); };
    }
    card.addEventListener('dblclick', e=>{
      if(e.target.closest('.rp-playbtn')) return;
      e.preventDefault(); if(!isDragging) goToBeat(beat);
    });
    card.querySelector(".rp-cover").addEventListener('click', e=>{
      if(e.target.closest('.rp-playbtn')) return;
      if(isDragging) return;
      goToBeat(beat);
    });

    scroller.appendChild(card);
  });

  const more = document.createElement('div');
  more.className = 'rp-card more-card';
  more.innerHTML = `<div class="rp-cover more-cover"><div class="more-grid"><div class="more-dot"></div><div class="more-dot"></div><div class="more-dot"></div><div class="more-dot"></div><div class="more-dot"></div><div class="more-dot"></div></div></div><div class="rp-title">View All</div>`;
  more.onclick = ()=> goToBeatsList();
  scroller.appendChild(more);

  mount.appendChild(scroller);
  syncLatest();
  initDrag(mount);
  bindAudioReset();
}

function syncLatest(){
  const curId = String(window.__CURRENT_BEAT__?.id||'');
  const curList = window.__CURRENT_LIST__||'';
  const audio = window.__DT_AUDIO__ || window.DTPlayer?.audio || document.querySelector('audio');
  const playing = audio && !audio.paused;
  const shouldActive = curList === 'latest';

  document.querySelectorAll('#latestMount .rp-card').forEach(card=>{
    const id = String(card.dataset.beatId||'');
    const active = shouldActive && id === curId;
    const btn = card.querySelector('.rp-playbtn');
    const icon = btn?.querySelector('.rp-icon');
    const eq = card.querySelector('.rp-eq');
    if(icon) icon.innerHTML = active && playing? PAUSE : PLAY;
    card.classList.toggle('is-active', active);
    card.classList.toggle('is-playing', active && playing);
    if(eq) eq.style.display = active && playing? 'flex':'none';
    if(btn) btn.classList.toggle('rp-active', active);
  });
}

function bindAudioReset(){
  const audio = window.__DT_AUDIO__ || window.DTPlayer?.audio || document.querySelector('audio');
  if(!audio || audio._latestBound) return;
  audio._latestBound = true;
  audio.addEventListener('play', syncLatest);
  audio.addEventListener('pause', syncLatest);
  audio.addEventListener('ended', ()=>{
    document.querySelectorAll('#latestMount .rp-card .rp-icon').forEach(ic=> ic.innerHTML = PLAY);
    document.querySelectorAll('#latestMount .rp-card').forEach(c=>{
      c.classList.remove('is-playing');
      const eq=c.querySelector('.rp-eq'); if(eq) eq.style.display='none';
    });
  });
}

function initDrag(container){
  let isDown=false, startX=0, left=0;
  const getScroll = ()=> container.scrollLeft;
  container.addEventListener('mousedown', e=>{
    if(e.target.closest('.rp-playbtn')) return;
    isDown=true; isDragging=false;
    startX=e.pageX; left=getScroll();
    container.classList.add('is-dragging');
  });
  window.addEventListener('mouseup', ()=>{
    if(!isDown) return;
    isDown=false; container.classList.remove('is-dragging');
    setTimeout(()=>{ isDragging=false; },80);
  });
  window.addEventListener('mousemove', e=>{
    if(!isDown) return;
    const walk=e.pageX-startX;
    if(Math.abs(walk)>5) isDragging=true;
    if(isDragging) container.scrollLeft = left - walk;
  });
}

document.addEventListener('playerPlay', ()=>setTimeout(syncLatest,30));
document.addEventListener('playerPause', ()=>setTimeout(syncLatest,30));
document.addEventListener('trackChange', ()=>setTimeout(syncLatest,30));
document.addEventListener('dt:listSwitch', ()=>setTimeout(syncLatest,30));
