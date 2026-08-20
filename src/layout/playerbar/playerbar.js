// ============================================================
// DOPE TONE VAULT PLAYER
// PRO SINGLETON / SPA SAFE / OFFLINE CACHE / AUTO NEXT
// ============================================================

import { initLiquidEq } from './mini-eq.js';

const LS_QUEUE = 'dt_queue_v3';
const LS_INDEX = 'dt_index_v3';
const LS_LIKES = 'dopetone_likes';
const STATS_API = 'https://dopetone-stats.dopetone701.workers.dev';
let playedBeats = new Set();
function logBeatEvent(id, type){ if(!id) return; const a=getAnon(); fetch(`${STATS_API}/api/stats/event`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({beatId:parseInt(id),eventType:type, anon_id:a, user_key:a, user_id:a})}).catch(()=>{}) }

const AUDIO_CACHE = 'dt-audio-v1';

let audio = null;
let booted = false;
let listenersAttached = false;
let currentObjectURL = null;
let preloading = new Map();
let skipLock = false;


// ============================================================
// HELPERS
// ============================================================

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

const getSrc = t =>
  t?.mp3_url ||
  t?.audio ||
  t?.audio_url ||
  '';



  function getAnon(){ let a=localStorage.getItem('dt_anon_id'); if(!a){a='anon_'+Math.random().toString(36).slice(2)+Date.now(); localStorage.setItem('dt_anon_id',a);} return a; }

// ============================================================
// AUDIO CACHE
// ============================================================

async function getCache(){
  if(!('caches' in window)) return null;

  try{
    return await caches.open(AUDIO_CACHE);
  }catch{
    return null;
  }
}


async function hasCached(src){

  if(!src) return false;

  const cache = await getCache();
  if(!cache) return false;

  try{
    return !!(await cache.match(src));
  }catch{
    return false;
  }
}


async function cacheTrack(track){

  const src = getSrc(track);
  if(!src) return false;

  if(preloading.has(src)){
    return preloading.get(src);
  }

  const job = (async()=>{

    try{

      const cache = await getCache();

      if(!cache){
        return false;
      }

      const existing = await cache.match(src);

      if(existing){
        return true;
      }

      // Fetch the complete audio file.
      const response = await fetch(src, {
        mode:'cors',
        credentials:'omit',
        cache:'no-store'
      });

      if(!response.ok){
        throw new Error(`Audio HTTP ${response.status}`);
      }

      await cache.put(src, response.clone());

      return true;

    }catch(err){

      console.warn('[PLAYER] Cache failed:', err);

      return false;

    }finally{

      preloading.delete(src);

    }

  })();

  preloading.set(src, job);

  return job;
}


async function getPlayableSource(track){
  const src = getSrc(track);
  if(!src) return '';
  // online -> use src directly, cache in background
  try{
    const r = await fetch(src, { method:'HEAD', mode:'cors', cache:'no-store' });
    if(r.ok){ cacheTrack(track); return src; }
  }catch{}
  // offline -> blob from cache
  try{
    const cache = await getCache();
    const cached = await cache?.match(src);
    if(cached) return URL.createObjectURL(await cached.blob());
  }catch{}
  return src;
}



// ============================================================
// PREFETCH NEXT TRACK
// ============================================================

function preloadAround(index){

  const queue = window.DTPlayer?.queue || [];

  const current = queue[index];
  const next = queue[(index + 1) % queue.length];

  if(current) cacheTrack(current);

  if(next && next !== current){

    // Give current audio priority.
    setTimeout(()=>{
      cacheTrack(next);
    }, 500);

  }

}


// ============================================================
// PLAYER ENGINE
// ============================================================

export function initPlayerEngine(){

  // NEVER CREATE AUDIO TWICE
  if(window.__DT_AUDIO__){

    audio = window.__DT_AUDIO__;

    if(!booted){
      bootPlayerListeners();
    }

    // RESTORE LOCKED TRACK FROM CC
    const locked = localStorage.getItem('dt_cc_locked_track');
    if(locked) window.currentBeatId = locked;

    return audio;
  }

  audio = new Audio();

  audio.crossOrigin = 'anonymous';
  audio.preload = 'auto';
  audio.playsInline = true;

  window.__DT_AUDIO__ = audio;
  window.__DOPE_TONE_AUDIO__ = audio;

  booted = true;

  bootPlayerListeners();

  // RESTORE LOCKED TRACK ON BOOT
  const locked = localStorage.getItem('dt_cc_locked_track');
  const lockedTitle = localStorage.getItem('dt_cc_locked_title');
  if(locked){
    window.currentBeatId = locked;
    console.log('[PLAYER] Restored locked track', locked, lockedTitle);
  }

  // RESTORE NOW PLAYING
  try{
    const np = JSON.parse(localStorage.getItem('dt_now_playing')||'null');
    if(np?.id) window.currentBeatId = np.id;
  }catch{}

  return audio;
}



// ============================================================
// LISTENERS
// ============================================================

function bootPlayerListeners(){

  if(listenersAttached || !audio) return;

  listenersAttached = true;

   document.addEventListener('keydown', (e)=>{
    if(e.code!=='Space' && e.key!==' ') return;
    const t=document.activeElement?.tagName?.toLowerCase();
    if(t==='input'||t==='textarea'||document.activeElement?.isContentEditable) return;
    e.preventDefault(); DTPlayer.toggle();
  });



  // ----------------------------------------------------------
  // VISIBILITY
  // ----------------------------------------------------------

  document.addEventListener('visibilitychange', ()=>{

    if(!document.hidden &&
       window.__SHOULD_PLAY__ &&
       audio.paused){

      audio.play().catch(()=>{});

    }

  });


  // ----------------------------------------------------------
  // MEDIA SESSION
  // ----------------------------------------------------------

  if('mediaSession' in navigator){

    try{

      navigator.mediaSession.setActionHandler(
        'play',
        ()=>audio.play().catch(()=>{})
      );

      navigator.mediaSession.setActionHandler(
        'pause',
        ()=>audio.pause()
      );

      navigator.mediaSession.setActionHandler(
        'nexttrack',
        ()=>DTPlayer.next()
      );

      navigator.mediaSession.setActionHandler(
        'previoustrack',
        ()=>DTPlayer.prev()
      );

    }catch{}

  }


  // ----------------------------------------------------------
  // PLAY
  // ----------------------------------------------------------

 audio.addEventListener('play', ()=>{

    window.__SHOULD_PLAY__ = true;

    document.body.classList.add('playing');

    syncPlayIcons(true);

    const beatId = window.__CURRENT_BEAT__?.id;
    const beatTitle = window.__CURRENT_BEAT__?.title || '';
    
    // CC PERFECT SYNC - DO NOT REMOVE
    window.currentBeatId = beatId || null;
    window.__CURRENT_ID__ = beatId || null;
    
    if(beatId){
      localStorage.setItem('dt_now_playing', JSON.stringify({id:beatId, title:beatTitle}));
      
      // Update locked track if follow is ON
      if(localStorage.getItem('dt_cc_follow_player')==='1'){
        localStorage.setItem('dt_cc_locked_track', String(beatId));
        if(beatTitle) localStorage.setItem('dt_cc_locked_title', beatTitle);
      }

      // CC EVENTS
      document.dispatchEvent(new CustomEvent('dt-track-play', {detail:{id:beatId, beatId:beatId, title:beatTitle}}));
      document.dispatchEvent(new CustomEvent('dt-play', {detail:{id:beatId, beatId:beatId, title:beatTitle}}));
    }

    if(beatId &&!playedBeats.has(String(beatId))){
      logBeatEvent(beatId, 'play');
      playedBeats.add(String(beatId));
    }

    document.dispatchEvent(
      new CustomEvent('playerPlay',{
        detail:{
          index:DTPlayer.index,
          listId:window.__CURRENT_LIST__,
          beatId:window.__CURRENT_BEAT__?.id,
          title:window.__CURRENT_BEAT__?.title
        }
      })
    );

  });



  // ----------------------------------------------------------
  // PAUSE
  // ----------------------------------------------------------

  audio.addEventListener('pause', ()=>{

    if(document.hidden) return;

    window.__SHOULD_PLAY__ = false;

    document.body.classList.remove('playing');

    syncPlayIcons(false);

    document.dispatchEvent(
      new CustomEvent('playerPause')
    );

  });


  // ----------------------------------------------------------
  // TIME UPDATE
  // ----------------------------------------------------------

  audio.addEventListener('timeupdate', ()=>{

    const pct =
      audio.duration
        ? (audio.currentTime / audio.duration) * 100
        : 0;

    const bar = document.getElementById('gpBar');

    if(bar){
      bar.style.width = pct + '%';
    }

    const current = document.getElementById('gpCurrent');

    if(current){
      current.textContent = fmt(audio.currentTime);
    }

  });


  // ----------------------------------------------------------
  // METADATA
  // ----------------------------------------------------------

  audio.addEventListener('loadedmetadata', ()=>{

    const duration =
      document.getElementById('gpDuration');

    if(duration){
      duration.textContent = fmt(audio.duration);
    }

  });


  // ----------------------------------------------------------
  // AUTO NEXT
  // ----------------------------------------------------------

  audio.addEventListener('ended', async ()=>{

    if(skipLock) return;

    skipLock = true;

    try{

      await DTPlayer.next();

    }finally{

      setTimeout(()=>{
        skipLock = false;
      },300);

    }

  });


  // ----------------------------------------------------------
  // ERROR
  // ----------------------------------------------------------

  audio.addEventListener('error', async ()=>{

    console.warn('[PLAYER] Audio error');

    const current = window.__CURRENT_BEAT__;

    if(current){

      const cached = await hasCached(getSrc(current));

      if(!cached){

        await cacheTrack(current);

      }

      const cachedSource =
        await getPlayableSource(current);

      if(cachedSource){

        if(currentObjectURL){
          try{
            URL.revokeObjectURL(currentObjectURL);
          }catch{}
        }

        currentObjectURL = cachedSource;

        audio.src = cachedSource;

        audio.play().catch(()=>{
          setTimeout(()=>DTPlayer.next(),1000);
        });

        return;

      }

    }

    setTimeout(()=>{
      DTPlayer.next();
    },1000);

  });

}


// ============================================================
// UI SYNC
// ============================================================

function syncPlayIcons(playing){

  document
    .querySelectorAll('.play-icon')
    .forEach(el=>{
      el.style.display = playing ? 'none' : 'block';
    });

  document
    .querySelectorAll('.pause-icon')
    .forEach(el=>{
      el.style.display = playing ? 'block' : 'none';
    });

}


function syncHearts(liked, beatId = window.__CURRENT_BEAT__?.id){
  if(beatId==null) return liked;
  document.getElementById('loveTrackBtn')?.classList.toggle('active',liked);
  document.getElementById('loveTrackBtn')?.classList.toggle('liked',liked);
  document.querySelectorAll('.love-heart').forEach(h=>{ h.textContent = liked ? '♥' : '♡'; });
  const text = document.querySelector('#loveTrackBtn .love-text') || document.querySelector('.love-text');
  if(text) text.textContent = liked ? 'LOVED' : 'LOVE IT';
  const map=getLikes();
  const total=Object.keys(map).length;
  window.dispatchEvent(new CustomEvent('cc_like_updated',{detail:{beat_id:beatId, beatId, liked, count:total, perBeat:map}}));
  window.dispatchEvent(new CustomEvent('cc_player_like_sync',{detail:{total, beat_id:beatId, beatId, liked}}));
  window.dispatchEvent(new CustomEvent('cc_like_change',{detail:{beat_id:beatId, liked}}));
  const totalEl=document.getElementById('totalLikes'); if(totalEl) totalEl.textContent=String(total);
  return liked;
}



// ============================================================
// PLAYER
// ============================================================

export const DTPlayer = {

  queue: JSON.parse(
    localStorage.getItem(LS_QUEUE) || '[]'
  ),

  index:
    parseInt(
      localStorage.getItem(LS_INDEX) || '0'
    ) || 0,


  setQueue(list,i=0,play=true){

    if(!Array.isArray(list) || !list.length) return;

    this.queue = list;
    this.index = Math.max(
      0,
      Math.min(i,list.length-1)
    );

    window.__CURRENT_LIST__ =
      window.__CURRENT_LIST__ || 'featured';

    window.__CURRENT_INDEX__ = this.index;

    window.__CURRENT_BEATS__ = list;

    localStorage.setItem(
      LS_QUEUE,
      JSON.stringify(list)
    );

    localStorage.setItem(
      LS_INDEX,
      String(this.index)
    );

    preloadAround(this.index);

    if(play){

      playTrack(
        list[this.index],
        true
      );

    }else if(list[this.index]){

      playTrack(
        list[this.index],
        false
      );

    }

  },


  async next(){

    if(!this.queue.length) return;

    this.index =
      (this.index + 1) %
      this.queue.length;

    window.__CURRENT_INDEX__ =
      this.index;

    localStorage.setItem(
      LS_INDEX,
      String(this.index)
    );

    const next =
      this.queue[this.index];

    // Make sure next track is ready.
    await cacheTrack(next);

    playTrack(next,true);

    preloadAround(this.index);

  },


  prev(){

    if(!this.queue.length) return;

    if(
      audio &&
      audio.currentTime > 3
    ){

      audio.currentTime = 0;

      return;

    }

    this.index =
      (this.index - 1 + this.queue.length) %
      this.queue.length;

    window.__CURRENT_INDEX__ =
      this.index;

    localStorage.setItem(
      LS_INDEX,
      String(this.index)
    );

    playTrack(
      this.queue[this.index],
      true
    );

    preloadAround(this.index);

  },


  toggle(){

    if(!audio) return;

    if(
      !audio.src &&
      this.queue.length
    ){

      playTrack(
        this.queue[this.index],
        true
      );

      return;

    }

    if(audio.paused){

      audio.play().catch(()=>{});

    }else{

      audio.pause();

    }

  }

};


window.DTPlayer = DTPlayer;


// ============================================================
// GLOBAL PLAYER COMPATIBILITY
// ============================================================

window.globalPlayer = {

  play:(i,list,listId)=>{

    if(!Array.isArray(list) || !list.length) return;

    window.__CURRENT_LIST__ = listId;

    DTPlayer.setQueue(
      list,
      i,
      true
    );

  }

};

window.player = window.globalPlayer;


// ============================================================
// PLAYER BAR
// ============================================================

export function initPlayerBar(){

  initPlayerEngine();

  const el =
    document.getElementById('player-bar');

  if(!el) return;

  // NEVER REMOUNT EXISTING PLAYER
  if(el.dataset.mounted) return;

  el.dataset.mounted = '1';


  el.innerHTML = `

  <div id="globalPlayerUI" class="global-player">

    <div class="gp-left">

      <img
        id="gpCover"
        src="public/images/logo.png"
        alt=""
      >

      <div class="gp-text">

        <div id="gpTitle">
          No track
        </div>

        <div style="font-size:11px;color:#9CA3AF">
          Dope Tone Vault
        </div>

      </div>

    </div>


    <div class="gp-center">

      <div class="gp-controls">

        <button
          data-action="prev"
          class="player-btn"
          title="Prev"
        >
          <svg width="20" height="20"
            viewBox="0 0 24 24"
            fill="currentColor">
            <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z"/>
          </svg>
        </button>


        <button
          data-action="toggle"
          class="player-btn"
          id="gpPlay"
          title="Play"
        >

          <svg
            class="play-icon"
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="currentColor">
            <path d="M8 5v14l11-7z"/>
          </svg>

          <svg
            class="pause-icon"
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="currentColor"
            style="display:none">
            <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
          </svg>

        </button>


        <button
          data-action="next"
          class="player-btn"
          title="Next"
        >
          <svg width="20" height="20"
            viewBox="0 0 24 24"
            fill="currentColor">
            <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z"/>
          </svg>
        </button>

      </div>


      <div class="gp-progress-wrap">

        <span id="gpCurrent">
          0:00
        </span>

        <div
          id="gpProgress"
          data-action="seek"
          style="
            flex:1;
            height:6px;
            background:rgba(255,255,255,0.15);
            border-radius:99px;
            position:relative;
            cursor:pointer;
            overflow:hidden
          "
        >

          <div
            id="gpBar"
            style="
              height:100%;
              width:0%;
              background:#22d3ee;
              border-radius:99px;
              pointer-events:none
            "
          ></div>

        </div>

        <span id="gpDuration">
          0:00
        </span>

      </div>

    </div>


    <div class="gp-right">

      <button
        data-action="like"
        id="loveTrackBtn"
        class="love-track-btn"
      >

        <span class="love-text">
          LOVE IT
        </span>

        <span class="love-heart">
          ♡
        </span>

      </button>

      <div class="wave-card">
        <canvas
          id="liquidEq"
          width="58"
          height="58"
        ></canvas>
      </div>

    </div>

  </div>

  `;


  // ==========================================================
  // BUTTON EVENTS
  // ==========================================================

  el.addEventListener('click',e=>{

    const btn = e.target.closest('[data-action]');
    if(!btn) return;

    const act = btn.dataset.action;
    if(act === 'seek') return;

    if(act === 'toggle') DTPlayer.toggle();
    if(act === 'next') DTPlayer.next();
    if(act === 'prev') DTPlayer.prev();

    if(act === 'like'){
      const cur = window.__CURRENT_BEAT__;
      if(!cur) return;
      const liked = toggleLike(cur.id);
      syncHearts(liked, cur.id);

      // D1 BLACK HOLE - FIXED WITH ANON
const a=getAnon();
fetch(`${STATS_API}/api/stats/event`,{
  method:'POST',
  headers:{'Content-Type':'application/json'},
  body: JSON.stringify({beatId: parseInt(cur.id), eventType: liked?'like':'like_remove', anon_id:a, user_key:a, user_id:a})
}).catch(()=>{});
window.dispatchEvent(new CustomEvent('dt-like-changed',{detail:{beatId:cur.id, action: liked?'like':'like_remove'}}));


      // vault sync so Liked page updates
      let likedIds = JSON.parse(localStorage.getItem('dt_liked_v1')||'[]');
      let vault = JSON.parse(localStorage.getItem('dt_vault_v1')||'[]');
      let likedPl = vault.find(p=>p.isLiked);
      if(!likedPl){ likedPl = {id:'dt_liked_playlist', name:'Liked', isLiked:true, beats:[]}; vault.unshift(likedPl); }
      if(liked){
        if(!likedIds.includes(String(cur.id)) && !likedIds.includes(Number(cur.id))) likedIds.push(cur.id);
        if(!likedPl.beats.some(b=>String(b.id)===String(cur.id))) likedPl.beats.unshift(cur);
      } else {
        likedIds = likedIds.filter(id=>String(id)!==String(cur.id));
        likedPl.beats = likedPl.beats.filter(b=>String(b.id)!==String(cur.id));
      }
      localStorage.setItem('dt_liked_v1', JSON.stringify(likedIds));
      localStorage.setItem('dt_liked_ids', JSON.stringify(likedIds));
      localStorage.setItem('dt_vault_v1', JSON.stringify(vault));
      window.dispatchEvent(new Event('dt_vault_updated'));
      window.dispatchEvent(new Event('playlistsUpdated'));
    }

  });



  // ==========================================================
  // SEEK
  // ==========================================================

  const progress =
    el.querySelector('#gpProgress');

  const bar =
    el.querySelector('#gpBar');

  let isDragging = false;


  if(bar){
    bar.style.pointerEvents = 'none';
  }


  function getPercent(e){

    const rect =
      progress.getBoundingClientRect();

    const x =
      e.clientX ??
      e.changedTouches?.[0]?.clientX ??
      e.touches?.[0]?.clientX ??
      0;

    const p =
      (x - rect.left) /
      rect.width;

    return Math.max(
      0,
      Math.min(0.999,p)
    );

  }


  function doSeek(e){

    const a =
      window.__DT_AUDIO__ ||
      audio;

    if(
      !a?.duration ||
      isNaN(a.duration) ||
      a.duration === 0
    ) return;

    e.preventDefault();
    e.stopPropagation();

    const p =
      getPercent(e);

    a.currentTime =
      p * a.duration;

    if(bar){
      bar.style.width =
        p * 100 + '%';
    }

  }


  if(progress){

    progress.addEventListener(
      'click',
      doSeek
    );

    progress.addEventListener(
      'mousedown',
      e=>{
        isDragging = true;
        doSeek(e);
      }
    );

    window.addEventListener(
      'mousemove',
      e=>{
        if(isDragging) doSeek(e);
      }
    );

    window.addEventListener(
      'mouseup',
      ()=>{
        isDragging = false;
      }
    );

    progress.addEventListener(
      'touchstart',
      e=>{
        isDragging = true;
        doSeek(e);
      },
      {passive:false}
    );

    progress.addEventListener(
      'touchmove',
      e=>{
        if(isDragging) doSeek(e);
      },
      {passive:false}
    );

    progress.addEventListener(
      'touchend',
      e=>{
        if(isDragging){
          doSeek(e);
          isDragging = false;
        }
      },
      {passive:false}
    );

  }


  // ==========================================================
  // EQ
  // ==========================================================

  setTimeout(()=>{

    try{
      initLiquidEq();
    }catch{}

  },700);


  // ==========================================================
  // RESTORE QUEUE
  // ==========================================================

  if(
    DTPlayer.queue.length &&
    DTPlayer.queue[DTPlayer.index]
  ){

    const track =
      DTPlayer.queue[DTPlayer.index];

    window.__CURRENT_BEAT__ =
      track;

    updatePlayerUI(track);

    preloadAround(DTPlayer.index);

  }

}


// ============================================================
// PLAY TRACK
// ============================================================

export async function playTrack(
  track,
  shouldPlay = true
){

  if(!track) return;

  const a =
    window.__DT_AUDIO__ ||
    audio ||
    initPlayerEngine();

  if(!a) return;

  const src =
    getSrc(track);

  if(!src) return;

  // ----------------------------------------------------------
  // UPDATE QUEUE INDEX
  // ----------------------------------------------------------

  if(window.DTPlayer?.queue?.length){

    const idx =
      window.DTPlayer.queue.findIndex(
        b =>
          String(b.id) ===
          String(track.id)
      );

    if(idx !== -1){

      window.DTPlayer.index = idx;

      window.__CURRENT_INDEX__ =
        idx;

      localStorage.setItem(
        LS_INDEX,
        String(idx)
      );

    }

  }

  // ----------------------------------------------------------
  // CURRENT TRACK - CC SYNC PERFECT
  // ----------------------------------------------------------

  window.__CURRENT_BEAT__ =
    track;

  window.__SHOULD_PLAY__ =
    shouldPlay;

  // ---- CC PERFECT COMMS - DO NOT REMOVE ----
  window.currentBeatId = track.id;
  window.__CURRENT_ID__ = track.id;
  localStorage.setItem('dt_now_playing', JSON.stringify({id:track.id, title:track.title, cover:track.cover_url||track.cover||''}));
  // save locked for CC graph V15
  if(localStorage.getItem('dt_cc_follow_player')==='1'){
    localStorage.setItem('dt_cc_locked_track', String(track.id));
    localStorage.setItem('dt_cc_locked_title', track.title||'');
  }
  document.dispatchEvent(new CustomEvent('dt-track-play', {detail:{id:track.id, beatId:track.id, title:track.title}}));
  document.dispatchEvent(new CustomEvent('dt-play', {detail:{id:track.id, beatId:track.id, title:track.title}}));
  document.dispatchEvent(new CustomEvent('cc_track_changed', {detail:{id:track.id, title:track.title}}));

  updatePlayerUI(track);

  // ----------------------------------------------------------
  // SAME TRACK = DON'T RELOAD
  // ----------------------------------------------------------

  if(
    window.__CURRENT_SRC__ === src &&
    a.src
  ){

    if(
      shouldPlay &&
      a.paused
    ){

      a.play().catch(()=>{});

    }

    return;

  }

  window.__CURRENT_SRC__ =
    src;

  // ----------------------------------------------------------
  // LOAD TRACK
  // ----------------------------------------------------------

  const playable =
    await getPlayableSource(track);

  if(!playable) return;

  // If user selected another track while this
  // async request was running, don't overwrite it.
  if(
    window.__CURRENT_BEAT__ !== track
  ){

    if(
      playable.startsWith('blob:')
    ){

      try{
        URL.revokeObjectURL(playable);
      }catch{}

    }

    return;

  }

  if(currentObjectURL){

    try{
      URL.revokeObjectURL(
        currentObjectURL
      );
    }catch{}

    currentObjectURL = null;

  }

  if(playable.startsWith('blob:')){

    currentObjectURL =
      playable;

  }

  a.src =
    playable;

  a.load();

  // ----------------------------------------------------------
  // PLAY
  // ----------------------------------------------------------

  if(shouldPlay){

    try{

      await a.play();

    }catch(err){

      console.warn(
        '[PLAYER] Play blocked:',
        err
      );

    }

  }

  // ----------------------------------------------------------
  // PRELOAD NEXT
  // ----------------------------------------------------------

  preloadAround(
    window.DTPlayer?.index || 0
  );

}



// ============================================================
// PLAYER UI
// ============================================================

function updatePlayerUI(t){

  const cover =
    t.cover_url ||
    t.cover ||
    'public/images/logo.png';

  const coverEl =
    document.getElementById('gpCover');

  if(coverEl){
    coverEl.src = cover;
  }


  const title =
    document.getElementById('gpTitle');

  if(title){
    title.textContent =
      t.title || 'No track';
  }


  if('mediaSession' in navigator){

    try{

      navigator.mediaSession.metadata =
        new MediaMetadata({

          title:
            t.title || 'Dope Tone',

          artist:
            'Dope Tone',

          artwork:[
            {
              src:cover,
              sizes:'512x512',
              type:'image/png'
            }
          ]

        });

    }catch{}

  }


  syncHearts(
    isLiked(t.id)
  );

}


window.DTPlayTrack =
  playTrack;


// ============================================================
// INITIALIZE IMMEDIATELY
// ============================================================

initPlayerEngine();
