// src/core/similar-logic.js - FULL CLONE OF LATEST.V2.JS with similar logic
import { store } from './store.js';

const MAX = 10;
let isDragging = false;
const PLAY = `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5.14v14l11-7-11-7z"/></svg>`;
const PAUSE = `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>`;

function getSimilarBeats(seedBeats, limit = 10){
  const all = store?.getBeats?.() || window.__BEATS__ || window.DTStore?.beats || [];
  if(!all.length || !seedBeats?.length) return [];
  const seedIds = new Set(seedBeats.map(b=>String(b.id)));
  const genres = [...new Set(seedBeats.map(b=>String(b.genre||"").toLowerCase()))];
  const moods = [...new Set(seedBeats.map(b=>b.mood).filter(Boolean))];
  const avgBpm = seedBeats.reduce((s,b)=>s+(Number(b.bpm)||140),0)/seedBeats.length;
  const keys = [...new Set(seedBeats.map(b=>b.key).filter(Boolean))];

  return all.filter(b=>!seedIds.has(String(b.id))).map(b=>{
    let score=0;
    if(genres.includes(String(b.genre||"").toLowerCase())) score+=30;
    if(keys.includes(b.key)) score+=20;
    if(moods.includes(b.mood)) score+=15;
    const d = Math.abs((Number(b.bpm)||140)-avgBpm);
    if(d<=5) score+=25; else if(d<=10) score+=15; else if(d<=20) score+=5;
    score+=Math.random()*4;
    return {b,score};
  }).sort((a,b)=>b.score-a.score).slice(0,limit).map(x=>x.b);
}

export async function renderSimilar(seedBeats, mountId="similarMount"){
  const wrap = document.getElementById('similarWrap');
  const mount = document.getElementById(mountId);
  if(!mount) { console.error('[SIMILAR] mount missing'); return; }

  const all = getSimilarBeats(seedBeats, MAX);
  console.log('[SIMILAR] beats', all.length);

  if(wrap) wrap.classList.add('rp-active');
  mount.innerHTML = '';
  mount.className = '';
  mount.style.display = 'block';

  const scroller = document.createElement('div');
  scroller.className = 'rp-scroll';

  all.forEach((beat, i)=>{
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
      console.log('[SIMILAR CLICK]', beat.title, 'id', beat.id);

      if(isDragging) return;

      const curId = String(window.__CURRENT_BEAT__?.id||'');
      const curList = window.__CURRENT_LIST__||'';
      const isSame = curId === String(beat.id) && curList === 'similar';

      if(isSame){
        try{
          if(window.DTPlayer?.toggle){
            window.DTPlayer.toggle(); return;
          }
          if(window.DTPlayer?.pause && window.DTPlayer?.play){
            const audio = window.DTPlayer.audio || window.__DT_AUDIO__ || document.querySelector('audio');
            if(audio?.paused){
              window.DTPlayer.play?.();
              audio.play().catch(err=>console.error('play err',err));
            } else {
              window.DTPlayer.pause?.();
              audio.pause();
            }
            return;
          }
          const a = window.__DT_AUDIO__ || window.DTPlayer?.audio || document.querySelector('audio');
          if(a){
            if(a.paused){ a.play().catch(e=>console.error(e)); } else { a.pause(); }
          }
        }catch(err){ console.error('[SIMILAR] toggle error', err); }
        return;
      }

      // NEW TRACK
      window.__CURRENT_LIST__ = 'similar';
      window.__CURRENT_BEATS__ = all;
      window.__CURRENT_INDEX__ = i;
      window.__CURRENT_BEAT__ = beat;
      localStorage.setItem('dt_list_v2','similar');
      localStorage.setItem('dt_index_v2', String(i));
      localStorage.setItem('dt_queue_v2', JSON.stringify(all));

      if(window.DTPlayer?.setQueue){
        window.DTPlayer.setQueue(all, i, true);
      } else if(window.DTPlayTrack){
        window.DTPlayTrack(beat, true);
      }
      document.dispatchEvent(new CustomEvent('dt:listSwitch', {detail:{listId:'similar'}}));
    };

    scroller.appendChild(card);
  });

  mount.appendChild(scroller);
  syncSimilar();
  initDrag(mount);
  bindAudioReset();
}

function syncSimilar(){
  const curId = String(window.__CURRENT_BEAT__?.id||'');
  const curList = window.__CURRENT_LIST__||'';
  const audio = window.__DT_AUDIO__ || window.DTPlayer?.audio || document.querySelector('audio');
  const playing = audio && !audio.paused;
  const shouldActive = curList === 'similar';

  document.querySelectorAll('#similarMount .rp-card').forEach(card=>{
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
  if(!audio || audio._similarBound) return;
  audio._similarBound = true;
  audio.addEventListener('play', syncSimilar);
  audio.addEventListener('pause', syncSimilar);
  audio.addEventListener('ended', ()=>{
    document.querySelectorAll('#similarMount .rp-card .rp-icon').forEach(ic=> ic.innerHTML = PLAY);
    document.querySelectorAll('#similarMount .rp-card').forEach(c=>{
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

document.addEventListener('playerPlay', ()=>setTimeout(syncSimilar,30));
document.addEventListener('playerPause', ()=>setTimeout(syncSimilar,30));
document.addEventListener('trackChange', ()=>setTimeout(syncSimilar,30));
document.addEventListener('dt:listSwitch', ()=>setTimeout(syncSimilar,30));

