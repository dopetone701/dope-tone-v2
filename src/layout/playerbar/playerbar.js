// ============================================================
// DOPE TONE VAULT PLAYER - V2.9 PRO FIXED
// FIX: pause stutter + lock screen + youtube buffer + rate lock
// ============================================================
import { initLiquidEq } from './mini-eq.js';

const LS_QUEUE = 'dt_queue_v3';
const LS_INDEX = 'dt_index_v3';
const LS_LIKES = 'dopetone_likes';
const STATS_API = 'https://dopetone-stats.dopetone701.workers.dev';
const AUDIO_CACHE = 'dt-audio-v1';

let audio = null;
let booted = false;
let listenersAttached = false;
let currentObjectURL = null;
let preloading = new Map();
let playedBeats = new Set();
let isUserPausing = false;
let lastPauseTime = 0;

function getAnon(){ let a=localStorage.getItem('dt_anon_id'); if(!a){a='anon_'+Math.random().toString(36).slice(2)+Date.now(); localStorage.setItem('dt_anon_id',a);} return a; }
function logBeatEvent(id, type){ if(!id) return; const a=getAnon(); fetch(`${STATS_API}/api/stats/event`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({beatId:parseInt(id),eventType:type, anon_id:a, user_key:a, user_id:a})}).catch(()=>{}) }

const fmt = s => {
  if(!s || isNaN(s)) return '0:00';
  const m = Math.floor(s / 60);
  const sc = Math.floor(s % 60);
  return `${m}:${String(sc).padStart(2,'0')}`;
};

const getLikes = () => { try{ return JSON.parse(localStorage.getItem(LS_LIKES)||'{}') }catch{ return {} } };
const saveLikes = m => { try{ localStorage.setItem(LS_LIKES, JSON.stringify(m)); localStorage.setItem('dopetone_likes_count', String(Object.keys(m).length)); }catch{} };
const isLiked = id => { if(id==null) return false; const m=getLikes(); const s=String(id).trim(); return!!(m[s]||m[Number(s)]); };
const toggleLike = id => {
  const m=getLikes(); const k=String(id).trim(); const n=Number(k);
  const now=!(m[k]||m[n]);
  if(now){ m[k]=Date.now(); m[n]=Date.now(); }
  else{ Object.keys(m).forEach(x=>{ if(String(x).trim()===k||Number(x)===n) delete m[x] }); }
  saveLikes(m); return now;
};
const getSrc = t => t?.mp3_url || t?.audio || t?.audio_url || '';

// CACHE
async function getCache(){ try{ return await caches.open(AUDIO_CACHE); }catch{ return null; } }
async function cacheTrack(track){
  const src = getSrc(track); if(!src || preloading.has(src)) return preloading.get(src) || false;
  const job = (async()=>{
    try{
      const cache = await getCache(); if(!cache) return false;
      if(await cache.match(src)) return true;
      const res = await fetch(src, {mode:'cors', cache:'no-store'});
      if(!res.ok) throw new Error(res.status);
      await cache.put(src, res.clone());
      return true;
    }catch{ return false; }finally{ preloading.delete(src); }
  })();
  preloading.set(src, job); return job;
}
async function getPlayableSource(track){
  const src = getSrc(track); if(!src) return '';
  // Try network first, but don't block playback
  cacheTrack(track); // bg download like YouTube
  return src;
}
function preloadAround(index){
  const queue = window.DTPlayer?.queue || [];
  if(!queue.length) return;
  const next = queue[(index + 1) % queue.length];
  const next2 = queue[(index + 2) % queue.length];
  if(next) setTimeout(()=>cacheTrack(next), 600);
  if(next2) setTimeout(()=>cacheTrack(next2), 2500);
}

// ENGINE - SINGLETON LOCK
export function initPlayerEngine(){
  if(window.__DT_AUDIO__){ audio = window.__DT_AUDIO__; if(!booted) bootPlayerListeners(); return audio; }
  audio = new Audio();
  audio.crossOrigin = 'anonymous';
  audio.preload = 'auto';
  audio.playsInline = true;
  audio.loop = false;
  audio.playbackRate = 1.0;
  audio.preservesPitch = true;
  window.__DT_AUDIO__ = audio;
  window.__DOPE_TONE_AUDIO__ = audio;
  booted = true;
  bootPlayerListeners();
  return audio;
}

function bootPlayerListeners(){
  if(listenersAttached ||!audio) return;
  listenersAttached = true;

  // Space toggle
  document.addEventListener('keydown', (e)=>{
    if(e.code!=='Space' && e.key!==' ') return;
    const t=document.activeElement?.tagName?.toLowerCase();
    if(t==='input'||t==='textarea'||document.activeElement?.isContentEditable) return;
    e.preventDefault(); DTPlayer.toggle();
  });

  // FIX 1: LOCK SCREEN - DO NOT PAUSE ON HIDDEN
  document.addEventListener('visibilitychange', ()=>{
    // Never pause when user locks phone, only resume if we were playing
    if(!document.hidden && window.__SHOULD_PLAY__ && audio.paused &&!isUserPausing){
      audio.play().catch(()=>{});
    }
  });

  // Media Session for lock screen
  if('mediaSession' in navigator){
    try{
      navigator.mediaSession.setActionHandler('play', ()=>{ isUserPausing=false; audio.play().catch(()=>{}) });
      navigator.mediaSession.setActionHandler('pause', ()=>{ isUserPausing=true; audio.pause(); });
      navigator.mediaSession.setActionHandler('nexttrack', ()=>DTPlayer.next());
      navigator.mediaSession.setActionHandler('previoustrack', ()=>DTPlayer.prev());
    }catch{}
  }

  // FIX 2: PAUSE STUTTER - debounce
  audio.addEventListener('play', ()=>{
    // prevent chunk loop if pause < 300ms ago
    if(Date.now() - lastPauseTime < 300 && isUserPausing) return;
    window.__SHOULD_PLAY__ = true;
    isUserPausing = false;
    document.body.classList.add('playing');
    syncPlayIcons(true);
    const beatId = window.__CURRENT_BEAT__?.id;
    const beatTitle = window.__CURRENT_BEAT__?.title || '';
    window.currentBeatId = beatId || null;
    window.__CURRENT_ID__ = beatId || null;
    if(beatId){
      localStorage.setItem('dt_now_playing', JSON.stringify({id:beatId, title:beatTitle}));
      if(localStorage.getItem('dt_cc_follow_player')==='1'){
        localStorage.setItem('dt_cc_locked_track', String(beatId));
        localStorage.setItem('dt_cc_locked_title', beatTitle);
      }
      document.dispatchEvent(new CustomEvent('dt-track-play', {detail:{id:beatId, beatId, title:beatTitle}}));
    }
    if(beatId &&!playedBeats.has(String(beatId))){ logBeatEvent(beatId, 'play'); playedBeats.add(String(beatId)); }
    document.dispatchEvent(new CustomEvent('playerPlay',{detail:{index:DTPlayer.index, listId:window.__CURRENT_LIST__, beatId, title:beatTitle}}));
  });

  audio.addEventListener('pause', ()=>{
    // FIX: don't ignore hidden, but track user intent
    if(audio.ended) return;
    lastPauseTime = Date.now();
    // if pause is within 1s of play, it's a browser stutter, ignore
    if(audio.currentTime < 0.5) return;
    window.__SHOULD_PLAY__ = false;
    document.body.classList.remove('playing');
    syncPlayIcons(false);
    document.dispatchEvent(new CustomEvent('playerPause'));
  });

  // FIX 3: YOUTUBE BUFFER BAR + SMOOTH PROGRESS - rAF ONLY
  let rafId = null;
  const loop = ()=>{
    if(!audio || audio.paused){ rafId=null; return; }
    // LOCK RATE - stops amateur fast/slow bug when page loads
    if(audio.playbackRate!== 1.0) audio.playbackRate = 1.0;

    const pct = audio.duration? (audio.currentTime / audio.duration) * 100 : 0;
    const bar = document.getElementById('gpBar');
    const buf = document.getElementById('gpBuffer');
    const cur = document.getElementById('gpCurrent');
    if(bar) bar.style.width = pct + '%';
    if(cur) cur.textContent = fmt(audio.currentTime);
    // YouTube grey buffer
    if(buf && audio.buffered.length){
      try{
        const bufferedEnd = audio.buffered.end(audio.buffered.length-1);
        const bufPct = (bufferedEnd / audio.duration) * 100;
        buf.style.width = bufPct + '%';
      }catch{}
    }
    rafId = requestAnimationFrame(loop);
  };
  audio.addEventListener('play', ()=>{ if(!rafId) rafId = requestAnimationFrame(loop); });
  audio.addEventListener('pause', ()=>{ if(rafId){ cancelAnimationFrame(rafId); rafId=null; } });
  audio.addEventListener('ended', ()=>{ if(rafId){ cancelAnimationFrame(rafId); rafId=null; } });

  audio.addEventListener('loadedmetadata', ()=>{
    const d = document.getElementById('gpDuration');
    if(d) d.textContent = fmt(audio.duration);
  });

  audio.addEventListener('ended', ()=> DTPlayer.next());
  audio.addEventListener('error', ()=> setTimeout(()=>DTPlayer.next(), 800));
}

function syncPlayIcons(playing){
  document.querySelectorAll('.play-icon').forEach(el=>{ el.style.display = playing? 'none' : 'block'; });
  document.querySelectorAll('.pause-icon').forEach(el=>{ el.style.display = playing? 'block' : 'none'; });
}
function syncHearts(liked, beatId = window.__CURRENT_BEAT__?.id){
  if(beatId==null) return liked;
  document.getElementById('loveTrackBtn')?.classList.toggle('active',liked);
  document.getElementById('loveTrackBtn')?.classList.toggle('liked',liked);
  document.querySelectorAll('.love-heart').forEach(h=>{ h.textContent = liked? '♥' : '♡'; });
  const text = document.querySelector('#loveTrackBtn.love-text') || document.querySelector('.love-text');
  if(text) text.textContent = liked? 'LOVED' : 'LOVE IT';
  return liked;
}

export const DTPlayer = {
  queue: JSON.parse(localStorage.getItem(LS_QUEUE) || '[]'),
  index: parseInt(localStorage.getItem(LS_INDEX) || '0') || 0,
  setQueue(list,i=0,play=true){
    if(!Array.isArray(list) ||!list.length) return;
    this.queue = list;
    this.index = Math.max(0, Math.min(i,list.length-1));
    window.__CURRENT_LIST__ = window.__CURRENT_LIST__ || 'featured';
    localStorage.setItem(LS_QUEUE, JSON.stringify(list));
    localStorage.setItem(LS_INDEX, String(this.index));
    preloadAround(this.index);
    if(list[this.index]) playTrack(list[this.index], play);
  },
  async next(){
    if(!this.queue.length) return;
    this.index = (this.index + 1) % this.queue.length;
    localStorage.setItem(LS_INDEX, String(this.index));
    const next = this.queue[this.index];
    await cacheTrack(next);
    playTrack(next,true);
    preloadAround(this.index);
  },
  prev(){
    if(!this.queue.length) return;
    if(audio && audio.currentTime > 3){ audio.currentTime = 0; return; }
    this.index = (this.index - 1 + this.queue.length) % this.queue.length;
    localStorage.setItem(LS_INDEX, String(this.index));
    playTrack(this.queue[this.index], true);
    preloadAround(this.index);
  },
  toggle(){
    if(!audio) return;
    if(!audio.src && this.queue.length){ playTrack(this.queue[this.index], true); return; }
    if(audio.paused){ isUserPausing=false; audio.play().catch(()=>{}); }
    else { isUserPausing=true; audio.pause(); }
  }
};
window.DTPlayer = DTPlayer;
window.globalPlayer = { play:(i,list,listId)=>{ if(!Array.isArray(list) ||!list.length) return; window.__CURRENT_LIST__ = listId; DTPlayer.setQueue(list, i, true); } };
window.player = window.globalPlayer;

export function initplayerbar(){
  initPlayerEngine();
  const el = document.getElementById('player-bar');
  if(!el || el.dataset.mounted) return;
  el.dataset.mounted = '1';
  el.innerHTML = `
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
        <button data-action="prev" class="player-btn"><svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M6 6h2v12H6zm3.5 6l8.5 6V6z"/></svg></button>
        <button data-action="toggle" class="player-btn" id="gpPlay">
          <svg class="play-icon" width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
          <svg class="pause-icon" width="22" height="22" viewBox="0 0 24 24" fill="currentColor" style="display:none"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
        </button>
        <button data-action="next" class="player-btn"><svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z"/></svg></button>
      </div>
      <div class="gp-progress-wrap">
        <span id="gpCurrent">0:00</span>
        <div id="gpProgress" data-action="seek" style="flex:1;height:6px;background:rgba(255,255,255,0.15);border-radius:99px;position:relative;cursor:pointer;overflow:hidden">
          <div id="gpBuffer" style="position:absolute;left:0;top:0;height:100%;width:0%;background:rgba(255,255,255,0.25);border-radius:99px;pointer-events:none"></div>
          <div id="gpBar" style="position:absolute;left:0;top:0;height:100%;width:0%;background:#FF1E3C;border-radius:99px;pointer-events:none;z-index:1"></div>
        </div>
        <span id="gpDuration">0:00</span>
      </div>
    </div>
    <div class="gp-right">
      <button data-action="like" id="loveTrackBtn" class="love-track-btn"><span class="love-text">LOVE IT</span><span class="love-heart">♡</span></button>
      <div class="wave-card"><canvas id="liquidEq" width="58" height="58"></canvas></div>
    </div>
  </div>`;

  el.addEventListener('click',e=>{
    const btn = e.target.closest('[data-action]'); if(!btn) return;
    const act = btn.dataset.action; if(act==='seek') return;
    if(act==='toggle') DTPlayer.toggle();
    if(act==='next') DTPlayer.next();
    if(act==='prev') DTPlayer.prev();
    if(act==='like'){
      const cur = window.__CURRENT_BEAT__; if(!cur) return;
      const liked = toggleLike(cur.id); syncHearts(liked, cur.id);
      const a=getAnon();
      fetch(`${STATS_API}/api/stats/event`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({beatId: parseInt(cur.id), eventType: liked?'like':'like_remove', anon_id:a, user_key:a, user_id:a})}).catch(()=>{});
    }
  });

  // SEEK
  const progress = el.querySelector('#gpProgress');
  let isDragging = false;
  function getPercent(e){
    const rect = progress.getBoundingClientRect();
    const x = e.clientX?? e.changedTouches?.[0]?.clientX?? 0;
    return Math.max(0, Math.min(0.999,(x - rect.left) / rect.width));
  }
  function doSeek(e){
    const a = window.__DT_AUDIO__ || audio;
    if(!a?.duration) return;
    e.preventDefault();
    const p = getPercent(e);
    a.currentTime = p * a.duration;
  }
  progress?.addEventListener('click', doSeek);
  progress?.addEventListener('mousedown', e=>{ isDragging=true; doSeek(e); });
  window.addEventListener('mousemove', e=>{ if(isDragging) doSeek(e); });
  window.addEventListener('mouseup', ()=>{ isDragging=false; });
  setTimeout(()=>{ try{ initLiquidEq(); }catch{} },700);
  if(DTPlayer.queue.length && DTPlayer.queue[DTPlayer.index]){
    const track = DTPlayer.queue[DTPlayer.index];
    window.__CURRENT_BEAT__ = track;
    updatePlayerUI(track);
    preloadAround(DTPlayer.index);
  }
}

export async function playTrack(track, shouldPlay = true){
  if(!track) return;
  const a = window.__DT_AUDIO__ || audio || initPlayerEngine();
  const src = getSrc(track); if(!src) return;

  if(window.DTPlayer?.queue?.length){
    const idx = window.DTPlayer.queue.findIndex(b => String(b.id) === String(track.id));
    if(idx!== -1){ window.DTPlayer.index = idx; localStorage.setItem(LS_INDEX, String(idx)); }
  }
  window.__CURRENT_BEAT__ = track;
  window.__SHOULD_PLAY__ = shouldPlay;
  window.currentBeatId = track.id;
  updatePlayerUI(track);

  if(window.__CURRENT_SRC__ === src && a.src){
    if(shouldPlay && a.paused){ isUserPausing=false; a.play().catch(()=>{}); }
    return;
  }
  window.__CURRENT_SRC__ = src;
  const playable = await getPlayableSource(track);
  if(!playable || window.__CURRENT_BEAT__!== track) return;

  if(currentObjectURL){ try{ URL.revokeObjectURL(currentObjectURL); }catch{} currentObjectURL=null; }
  if(playable.startsWith('blob:')) currentObjectURL = playable;

  a.src = playable;
  a.load();
  if(shouldPlay){
    try{ isUserPausing=false; await a.play(); }catch{}
  }
  preloadAround(window.DTPlayer?.index || 0);
}

function updatePlayerUI(t){
  const cover = t.cover_url || t.cover || 'public/images/logo.png';
  const coverEl = document.getElementById('gpCover'); if(coverEl) coverEl.src = cover;
  const title = document.getElementById('gpTitle'); if(title) title.textContent = t.title || 'No track';
  if('mediaSession' in navigator){
    try{ navigator.mediaSession.metadata = new MediaMetadata({title: t.title || 'Dope Tone', artist: 'Dope Tone', artwork:[{src:cover, sizes:'512x512', type:'image/png'}]}); }catch{}
  }
  syncHearts(isLiked(t.id));
}
window.DTPlayTrack = playTrack;
initPlayerEngine();
