// SINGLE SOURCE OF TRUTH - DOPE TONE VAULT PLAYER - FIXED SEEK + AUTO-NEXT
import { initLiquidEq } from './mini-eq.js';

let audio = null;
const LS_QUEUE = 'dt_queue_v2';
const LS_INDEX = 'dt_index_v2';
const LS_LIKES = 'dopetone_likes';

const fmt = s => { if(!s||isNaN(s)) return '0:00'; let m=Math.floor(s/60),sc=Math.floor(s%60); return m+':'+String(sc).padStart(2,'0'); };
const getLikes = () => { try{return JSON.parse(localStorage.getItem(LS_LIKES)||'{}')}catch{return{}} };
const saveLikes = m => localStorage.setItem(LS_LIKES, JSON.stringify(m));
const isLiked = id => { const m=getLikes(); return!!m[String(id)] ||!!m[Number(id)]; };
const toggleLike = id => {
  const m=getLikes(); const k=String(id); const now=!m[k];
  if(now) m[k]=Date.now(); else { delete m[k]; delete m[Number(k)]; }
  saveLikes(m); return now;
};

export function initPlayerEngine(){
  if(window.__DT_AUDIO__) { audio=window.__DT_AUDIO__; return audio; }
  audio=new Audio();
  audio.crossOrigin='anonymous';
  audio.preload='auto';
  audio.playsInline=true;
  window.__DT_AUDIO__=audio;
  window.__DOPE_TONE_AUDIO__ = audio; // alias for featured

  document.addEventListener('visibilitychange', ()=>{
    if(!document.hidden && window.__SHOULD_PLAY__) audio.play().catch(()=>{});
  });

  if('mediaSession' in navigator){
    navigator.mediaSession.setActionHandler('play', ()=>audio.play());
    navigator.mediaSession.setActionHandler('pause', ()=>audio.pause());
    navigator.mediaSession.setActionHandler('nexttrack', ()=>DTPlayer.next());
    navigator.mediaSession.setActionHandler('previoustrack', ()=>DTPlayer.prev());
  }

  audio.addEventListener('play', ()=>{
    window.__SHOULD_PLAY__=true;
    document.body.classList.add('playing');
    syncPlayIcons(true);
    document.dispatchEvent(new CustomEvent("playerPlay", { detail: { index: DTPlayer.index, listId: window.__CURRENT_LIST__ } }));
  });
  audio.addEventListener('pause', ()=>{
    if(document.hidden) return;
    window.__SHOULD_PLAY__=false;
    document.body.classList.remove('playing');
    syncPlayIcons(false);
    document.dispatchEvent(new CustomEvent("playerPause"));
  });
  audio.addEventListener('timeupdate', ()=>{
    const pct=audio.duration?(audio.currentTime/audio.duration)*100:0;
    const bar=document.getElementById('gpBar'); if(bar) bar.style.width=pct+'%';
    const cur=document.getElementById('gpCurrent'); if(cur) cur.textContent=fmt(audio.currentTime);
  });
  audio.addEventListener('loadedmetadata', ()=>{
    const d=document.getElementById('gpDuration'); if(d) d.textContent=fmt(audio.duration);
  });
  // AUTO-NEXT - FIXED
  audio.addEventListener('ended', ()=>{
    console.log('[PLAYER] Track ended, auto-next');
    DTPlayer.next();
  });

  audio.addEventListener('error', (e)=>{
    console.error('[PLAYER] Audio error', e);
    // auto-skip broken file after 1s
    setTimeout(()=> DTPlayer.next(), 1000);
  });

  return audio;
}

function syncPlayIcons(playing){
  document.querySelectorAll('.play-icon').forEach(el=>el.style.display=playing?'none':'block');
  document.querySelectorAll('.pause-icon').forEach(el=>el.style.display=playing?'block':'none');
}
function syncHearts(liked){
  document.getElementById('loveTrackBtn')?.classList.toggle('active', liked);
  document.querySelectorAll('.love-heart').forEach(h=>h.textContent=liked?'♥':'♡');
  const lt=document.querySelector('.love-text'); if(lt) lt.textContent=liked?'LOVED':'LOVE IT';
}

export const DTPlayer = {
  queue: JSON.parse(localStorage.getItem(LS_QUEUE)||'[]'),
  index: parseInt(localStorage.getItem(LS_INDEX)||'0')||0,
  setQueue(list,i=0,play=true){
    this.queue=list; this.index=i;
    window.__CURRENT_LIST__ = window.__CURRENT_LIST__ || 'featured';
    window.__CURRENT_INDEX__ = i;
    window.__CURRENT_BEATS__ = list;
    localStorage.setItem(LS_QUEUE, JSON.stringify(list));
    localStorage.setItem(LS_INDEX, String(i));
    if(play) playTrack(list[i], true);
    else if(list[i]) playTrack(list[i], false);
  },
  next(){
    if(!this.queue.length) return;
    this.index=(this.index+1)%this.queue.length;
    window.__CURRENT_INDEX__ = this.index;
    localStorage.setItem(LS_INDEX, String(this.index));
    playTrack(this.queue[this.index], true);
  },
  prev(){
    if(!this.queue.length) return;
    if(audio && audio.currentTime>3){ audio.currentTime=0; return; }
    this.index=(this.index-1+this.queue.length)%this.queue.length;
    window.__CURRENT_INDEX__ = this.index;
    localStorage.setItem(LS_INDEX, String(this.index));
    playTrack(this.queue[this.index], true);
  },
  toggle(){
    if(!audio) return;
    if(!audio.src && this.queue.length) playTrack(this.queue[this.index], true);
    else audio.paused?audio.play().catch(()=>{}):audio.pause();
  }
};
window.DTPlayer=DTPlayer;

// ALIAS FOR FEATURED COMPAT
window.globalPlayer = {
  play: (i, list, listId) => {
    window.__CURRENT_LIST__ = listId;
    DTPlayer.setQueue(list, i, true);
  }
};
window.player = window.globalPlayer;

export function initPlayerBar(){
  initPlayerEngine();
  const el=document.getElementById('player-bar');
  if(!el || el.dataset.mounted) return;
  el.dataset.mounted='1';

  el.innerHTML=`
  <div id="globalPlayerUI" class="global-player">
    <div class="gp-left">
      <img id="gpCover" src="public/images/logo.png" alt="">
      <div class="gp-text">
        <div id="gpTitle">No track</div>
        <div style="font-size:11px;color:#9CA3AF">Dope Tone Vault</div>
      </div>
    </div>
    <div class="gp-center">
      <div class="gp-controls">
        <button data-action="prev" class="player-btn" title="Prev"><svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M6 6h2v12H6zm3.5 6l8.5 6V6z"/></svg></button>
        <button data-action="toggle" class="player-btn" id="gpPlay" title="Play"><svg class="play-icon" width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg><svg class="pause-icon" width="22" height="22" viewBox="0 0 24 24" fill="currentColor" style="display:none"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg></button>
        <button data-action="next" class="player-btn" title="Next"><svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z"/></svg></button>
      </div>
      <div class="gp-progress-wrap"><span id="gpCurrent">0:00</span><div id="gpProgress" data-action="seek" style="flex:1;height:6px;background:rgba(255,255,255,0.15);border-radius:99px;position:relative;cursor:pointer;overflow:hidden"><div id="gpBar" style="height:100%;width:0%;background:#22d3ee;border-radius:99px;pointer-events:none"></div></div><span id="gpDuration">0:00</span></div>
    </div>
    <div class="gp-right">
      <button data-action="like" id="loveTrackBtn" class="love-track-btn"><span class="love-text">LOVE IT</span><span class="love-heart">♡</span></button>
      <div class="wave-card"><canvas id="liquidEq" width="58" height="58"></canvas></div>
    </div>
  </div>`;

  // BUTTONS
  el.addEventListener('click', e=>{
    const btn=e.target.closest('[data-action]');
    if(!btn) return;
    const act=btn.dataset.action;
    if(act==='seek') return; // important - let progress handler handle it
    if(act==='toggle') DTPlayer.toggle();
    if(act==='next') DTPlayer.next();
    if(act==='prev') DTPlayer.prev();
    if(act==='like'){
      const cur=window.__CURRENT_BEAT__; if(!cur) return;
      const liked=toggleLike(cur.id);
      syncHearts(liked);
    }
  });

  // SEEK - YOUR WORKING VERSION - UNTOUCHED
  const progress = el.querySelector('#gpProgress');
  const bar = el.querySelector('#gpBar');
  let isDragging = false;

  if(bar) bar.style.pointerEvents = 'none';

  function getPercent(e){
    const rect = progress.getBoundingClientRect();
    const x = e.clientX?? e.changedTouches?.[0]?.clientX?? e.touches?.[0]?.clientX?? 0;
    let p = (x - rect.left) / rect.width;
    return Math.max(0, Math.min(0.999, p));
  }

  function doSeek(e){
    const a = window.__DT_AUDIO__ || audio;
    if(!a?.duration || isNaN(a.duration) || a.duration===0) return;
    e.preventDefault();
    e.stopPropagation();
    const p = getPercent(e);
    a.currentTime = p * a.duration;
    bar.style.width = (p*100)+'%';
  }

  progress.addEventListener('click', doSeek);
  progress.addEventListener('mousedown', e=>{ isDragging=true; doSeek(e); });
  window.addEventListener('mousemove', e=>{ if(isDragging) doSeek(e); });
  window.addEventListener('mouseup', ()=>{ isDragging=false; });
  progress.addEventListener('touchstart', e=>{ isDragging=true; doSeek(e); }, {passive:false});
  progress.addEventListener('touchmove', e=>{ if(isDragging) doSeek(e); }, {passive:false});
  progress.addEventListener('touchend', e=>{
    if(isDragging){ doSeek(e); isDragging=false; }
  }, {passive:false});

  // EQ FIX - ONLY ADDITION
  setTimeout(()=>{
    try{
      // dynamic import so it doesn't break if file missing
      import('./mini-eq.js').then(m=>{
        if(m.initLiquidEq) m.initLiquidEq();
      }).catch(()=>{});
    }catch{}
  }, 700);

  if(DTPlayer.queue.length){
    playTrack(DTPlayer.queue[DTPlayer.index], false);
  }
}


export function playTrack(t, shouldPlay=true){
  if(!t) return;
  const a=window.__DT_AUDIO__; if(!a) return;
  const src=t.mp3_url||t.audio||t.audio_url;

  // Update current indexes by ID - FIXES active selector
  if(window.DTPlayer?.queue?.length){
    const idx = window.DTPlayer.queue.findIndex(b=> String(b.id)===String(t.id));
    if(idx!== -1){
      window.DTPlayer.index = idx;
      window.__CURRENT_INDEX__ = idx;
      localStorage.setItem(LS_INDEX, String(idx));
    }
  }

  if(a.src!==src) a.src=src;
  if(shouldPlay) a.play().catch(()=>{});
  window.__CURRENT_BEAT__=t;
  window.__SHOULD_PLAY__=shouldPlay;

  const cover=t.cover_url||t.cover||'public/images/logo.png';
  const coverEl=document.getElementById('gpCover'); if(coverEl) coverEl.src=cover;
  const title=document.getElementById('gpTitle'); if(title) title.textContent=t.title||'No track';

  if('mediaSession' in navigator){
    navigator.mediaSession.metadata=new MediaMetadata({ title:t.title, artist:'Dope Tone', artwork:[{src:cover, sizes:'512x512', type:'image/png'}] });
  }
  syncHearts(isLiked(t.id));

  // Trigger UI sync for featured + queue
  document.dispatchEvent(new CustomEvent("playerPlay", { detail: { index: window.__CURRENT_INDEX__, listId: window.__CURRENT_LIST__, beatId: t.id } }));
}
window.DTPlayTrack=playTrack;
