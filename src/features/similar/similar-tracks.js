// ============================================================
// DOPE TONE — SIMILAR VYBS — D1 CONNECTED + DRAG FIX
// ============================================================
import { store } from '../../core/store.js';

const MAX = 10;
const FALLBACK_COVER = '/public/images/placeholder-cover.webp';
const STATS_API="https://dopetone-stats.dopetone701.workers.dev";
const trackEvent=(id,type)=>{if(!id)return;fetch(`${STATS_API}/api/stats/event`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({beatId:parseInt(id),eventType:type}),keepalive:true}).catch(()=>{})};

const PLAY_SVG = `<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M8 5.14v14l11-7-11-7z"/></svg>`;
const PAUSE_SVG = `<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>`;

function escapeHTML(value) {
  return String(value?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;');
}
function cleanCoverValue(value) {
  if (value === undefined || value === null) return '';
  let raw = String(value).trim();
  if (!raw) return '';
  raw = raw.replace(/^["']|["']$/g, '');
  return raw.trim();
}
function normalizeCover(value) {
  let raw = cleanCoverValue(value);
  if (!raw) return '';
  if (raw.startsWith('http://')||raw.startsWith('https://')||raw.startsWith('data:')||raw.startsWith('blob:')) return raw;
  if (raw.startsWith('/')) return raw;
  if (raw.startsWith('./')) raw = raw.substring(2);
  if (raw.startsWith('public/')) return '/' + raw;
  if (raw.startsWith('src/')) return '/' + raw;
  if (raw.startsWith('images/')) return '/public/' + raw;
  if (raw.startsWith('covers/')) return '/public/' + raw;
  if (raw.includes('storage/v1/')||raw.includes('/object/public/')||raw.includes('/object/sign/')) return '/' + raw.replace(/^\/+/, '');
  if (raw.includes('/')) return '/' + raw.replace(/^\/+/, '');
  return '/public/covers/' + encodeURIComponent(raw);
}
function getCoverCandidates(beat) {
  if (!beat) return [FALLBACK_COVER];
  const possible = [beat.cover_url, beat.coverUrl, beat.cover, beat.cover_image, beat.coverImage, beat.artwork_url, beat.artworkUrl, beat.artwork, beat.artwork_image, beat.image_url, beat.imageUrl, beat.image, beat.thumbnail_url, beat.thumbnailUrl, beat.thumbnail, beat.photo_url, beat.photo, beat.img_url, beat.img, beat.preview_image, beat.previewImage, beat.cover_path, beat.coverPath, beat.artwork_path, beat.artworkPath, beat.cover_filename, beat.filename];
  const candidates = [];
  possible.forEach(value => {
    const normalized = normalizeCover(value);
    if (normalized &&!candidates.includes(normalized)) candidates.push(normalized);
  });
  if (!candidates.includes(FALLBACK_COVER)) candidates.push(FALLBACK_COVER);
  return candidates;
}
function resolveCover(beat) {
  const candidates = getCoverCandidates(beat);
  return candidates[0] || FALLBACK_COVER;
}
function scoreSimilar(target, candidate, stats) {
  if (!candidate) return -1;
  let score = 0;
  const tg = String(target?.genre || '').toLowerCase().trim();
  const cg = String(candidate?.genre || '').toLowerCase().trim();
  if (tg && cg) { if (tg === cg) score += 40; else if (tg.includes(cg) || cg.includes(tg)) score += 20; }
  const targetKey = String(target?.key || '').toLowerCase().trim();
  const candidateKey = String(candidate?.key || '').toLowerCase().trim();
  if (targetKey && candidateKey && targetKey === candidateKey) score += 18;
  const targetMood = String(target?.mood || '').toLowerCase().trim();
  const candidateMood = String(candidate?.mood || '').toLowerCase().trim();
  if (targetMood && candidateMood && targetMood === candidateMood) score += 15;
  const bpmDiff = Math.abs((Number(candidate?.bpm) || 0) - (Number(stats?.avgBpm) || 140));
  if (bpmDiff <= 3) score += 22; else if (bpmDiff <= 7) score += 14; else if (bpmDiff <= 15) score += 6;
  if (Array.isArray(target?.tags) && Array.isArray(candidate?.tags)) {
    const targetTags = target.tags.map(tag => String(tag).toLowerCase().trim());
    const candidateTags = candidate.tags.map(tag => String(tag).toLowerCase().trim());
    const overlap = targetTags.filter(tag => candidateTags.includes(tag)).length;
    score += overlap * 6;
  }
  return score + Math.random() * 2;
}
function getSimilarBeats(seedBeats) {
  const all = store?.getBeats?.() || window.__BEATS__ || window.DTStore?.beats || [];
  if (!Array.isArray(all) ||!all.length ||!Array.isArray(seedBeats) ||!seedBeats.length) return [];
  const seedIds = new Set(seedBeats.map(beat => String(beat?.id || '')));
  const avgBpm = seedBeats.reduce((sum, beat) => sum + (Number(beat?.bpm) || 140), 0) / seedBeats.length || 140;
  const seedMeta = seedBeats[0] || {};
  const stats = { avgBpm };
  return all.filter(beat => beat && beat.id &&!seedIds.has(String(beat.id))).map(beat => ({ beat, score: scoreSimilar(seedMeta, beat, stats) })).filter(item => item.score > 0).sort((a, b) => b.score - a.score).slice(0, MAX).map(item => item.beat);
}
function setupCoverImage(img) {
  if (!img) return;
  let candidates = [];
  try { candidates = JSON.parse(img.dataset.coverCandidates || '[]'); } catch { candidates = []; }
  candidates = Array.isArray(candidates)? candidates.filter(Boolean) : [];
  if (!candidates.length) candidates = [FALLBACK_COVER];
  let index = 0; let finished = false;
  const tryNext = () => {
    if (finished) return; index++;
    if (index >= candidates.length) { finished = true; img.onerror = null; if (img.getAttribute('src')!== FALLBACK_COVER) img.src = FALLBACK_COVER; return; }
    const next = candidates[index]; if (!next) { tryNext(); return; }
    img.dataset.coverIndex = String(index); img.src = next;
  };
  img.onerror = () => { tryNext(); };
  img.onload = () => { finished = true; img.onerror = null; const button = img.parentElement?.querySelector('.st-play'); if (button) button.style.background = 'linear-gradient(145deg,#FF1E3C,#B90025)'; };
  img.src = candidates[0] || FALLBACK_COVER;
}
function setDefaultPlayColor(img) {
  const button = img?.parentElement?.querySelector('.st-play'); if (!button) return;
  button.style.background = 'linear-gradient(145deg,#FF1E3C,#B90025)';
}

export function renderSimilarTracks(seedBeats, mountId = 'similarMount') {
  const mount = document.getElementById(mountId);
  if (!mount) return;
  const similar = getSimilarBeats(seedBeats);
  mount.innerHTML = `
    <div class="similar-wrap">
      <div class="similar-head">SIMILAR VYBS</div>
      <div class="similar-scroll" id="similarScroll" aria-label="Similar tracks">
        ${similar.map((beat, index) => {
          const cover = resolveCover(beat);
          const title = escapeHTML(beat?.title || 'Untitled');
          const candidates = escapeHTML(JSON.stringify(getCoverCandidates(beat)));
          return `<div class="st-card" data-idx="${index}" data-id="${escapeHTML(beat.id)}" tabindex="0" role="button" aria-label="Play ${title}"><div class="st-cover"><img src="${escapeHTML(cover)}" data-cover-index="0" data-cover-candidates="${candidates}" alt="" draggable="false" loading="lazy" decoding="async"><button class="st-play" type="button" data-id="${escapeHTML(beat.id)}" aria-label="Play ${title}"><span class="st-icon">${PLAY_SVG}</span></button><div class="st-eq"><span></span><span></span></div></div><div class="st-title">${title}</div></div>`;
        }).join('')}
        <div class="st-card more-card" id="similarMore" tabindex="0" role="button" aria-label="View all beats"><div class="st-cover more-cover"><div class="more-grid" aria-hidden="true"><i></i><i></i><i></i></div></div><div class="st-title">View All</div></div>
      </div>
    </div>
  `;

  const scroller = mount.querySelector('#similarScroll');
  if (!scroller) return;
  let isDown = false; let isDragging = false; let startX = 0; let startY = 0; let startScroll = 0; let lastX = 0; let lastTime = 0; let velocity = 0; let animationFrame = null; let lockDirection = null;
  const killMomentum = () => { if (animationFrame) { cancelAnimationFrame(animationFrame); animationFrame = null; } velocity = 0; };
  const momentum = () => { if (Math.abs(velocity) < 0.15) { animationFrame = null; return; } scroller.scrollLeft += velocity; velocity *= 0.94; animationFrame = requestAnimationFrame(momentum); };
  const pointerDown = event => {
    if (event.button!== undefined && event.button!== 0) return;
    if (event.target.closest('.st-play')) return;
    isDown = true; isDragging = false; lockDirection = null; killMomentum();
    startX = event.clientX; startY = event.clientY; lastX = event.clientX; startScroll = scroller.scrollLeft; lastTime = performance.now(); scroller.classList.add('dragging');
  };
  const pointerMove = event => {
    if (!isDown) return;
    const dx = event.clientX - startX; const dy = event.clientY - startY;
    if (!lockDirection) { if (Math.abs(dx) < 5 && Math.abs(dy) < 5) return; if (Math.abs(dy) > Math.abs(dx)) { lockDirection = 'y'; isDown = false; scroller.classList.remove('dragging'); return; } lockDirection = 'x'; }
    if (lockDirection === 'y') return;
    if (Math.abs(dx) > 5) isDragging = true;
    const now = performance.now(); const delta = event.clientX - lastX; const deltaTime = Math.max(8, now - lastTime);
    velocity = (-delta / deltaTime) * 18; velocity = Math.max(-35, Math.min(35, velocity));
    scroller.scrollLeft = startScroll - dx; lastX = event.clientX; lastTime = now;
  };
  const pointerUp = () => { if (!isDown &&!isDragging) { scroller.classList.remove('dragging'); return; } isDown = false; scroller.classList.remove('dragging'); if (Math.abs(velocity) > 0.8) { animationFrame = requestAnimationFrame(momentum); } setTimeout(() => { isDragging = false; }, 80); };
  scroller.addEventListener('pointerdown', pointerDown); scroller.addEventListener('pointermove', pointerMove); scroller.addEventListener('pointerup', pointerUp); scroller.addEventListener('pointercancel', pointerUp); scroller.addEventListener('pointerleave', pointerUp);

  mount.querySelectorAll('.st-cover img').forEach(img => { setDefaultPlayColor(img); setupCoverImage(img); });

  const sync = () => {
    const currentId = String(window.__CURRENT_BEAT__?.id || '');
    const currentList = window.__CURRENT_LIST__ || '';
    const audio = window.__DT_AUDIO__ || window.DTPlayer?.audio || document.querySelector('audio');
    const playing =!!audio &&!audio.paused;
    mount.querySelectorAll('.st-card:not(.more-card)').forEach(card => {
      const id = String(card.dataset.id || '');
      const active = currentList === 'similar' && id === currentId;
      const isPlaying = active && playing;
      card.classList.toggle('is-active', active); card.classList.toggle('is-playing', isPlaying);
      const icon = card.querySelector('.st-icon'); if (icon) icon.innerHTML = isPlaying? PAUSE_SVG : PLAY_SVG;
    });
  };
  sync(); document.addEventListener('trackChange', sync); document.addEventListener('playerPlay', sync); document.addEventListener('playerPause', sync); document.addEventListener('dt:listSwitch', sync);

  const playBeat = beat => {
    if (!beat) return;
    const id = String(beat.id || '');
    const currentId = String(window.__CURRENT_BEAT__?.id || '');
    const audio = window.__DT_AUDIO__ || window.DTPlayer?.audio || document.querySelector('audio');
    const sameTrack = currentId === id && window.__CURRENT_LIST__ === 'similar';
    if (sameTrack && audio) {
      if (audio.paused) { if (typeof window.DTPlayer?.play === 'function') window.DTPlayer.play(); else audio.play().catch(() => {}); }
      else { if (typeof window.DTPlayer?.pause === 'function') window.DTPlayer.pause(); else audio.pause(); }
      sync(); return;
    }
    trackEvent(beat.id,"play");
    window.__CURRENT_LIST__ = 'similar'; window.__CURRENT_BEATS__ = similar;
    const index = similar.findIndex(item => String(item?.id) === id);
    window.__CURRENT_INDEX__ = index >= 0? index : 0; window.__CURRENT_BEAT__ = beat;
    localStorage.setItem('dt_list_v2', 'similar'); localStorage.setItem('dt_index_v2', String(window.__CURRENT_INDEX__)); localStorage.setItem('dt_queue_v2', JSON.stringify(similar));
    if (typeof window.DTPlayer?.setQueue === 'function') window.DTPlayer.setQueue(similar, window.__CURRENT_INDEX__, true);
    else if (typeof window.DTPlayTrack === 'function') window.DTPlayTrack(beat, true);
    else if (typeof window.DTPlayer?.playTrack === 'function') window.DTPlayer.playTrack(beat, true);
    document.dispatchEvent(new CustomEvent('dt:listSwitch', { detail: { listId: 'similar' } })); sync();
  };

   // CARD EVENTS - CLICK CARD = GO TO BEAT, PLAY BTN = PLAY
  function goToBeat(beat){
    if(!beat?.id) return;
    location.hash = `#/beat?id=${encodeURIComponent(beat.id)}`;
    window.scrollTo({top:0, behavior:'smooth'});
  }

  mount.querySelectorAll('.st-card:not(.more-card)').forEach(card => {
    const index = Number(card.dataset.idx);
    const beat = similar[index];
    if (!beat) return;

    const playButton = card.querySelector('.st-play');
    if (playButton) {
      playButton.addEventListener('pointerdown', event => { event.stopPropagation(); });
      playButton.addEventListener('click', event => {
        event.preventDefault();
        event.stopPropagation();
        if (isDragging) return;
        playBeat(beat); // play button still plays
      });
    }

    card.addEventListener('click', event => {
      if (isDragging) return;
      if (event.target.closest('.st-play')) return;
      goToBeat(beat); // CARD CLICK = GO TO BEAT
    });

    card.addEventListener('keydown', event => {
      if (event.key!== 'Enter' && event.key!== ' ') return;
      event.preventDefault();
      goToBeat(beat);
    });
  });

  const more = mount.querySelector('#similarMore');
  if (more) {
    const goBeats = () => { if (typeof window.navigateTo === 'function') window.navigateTo('/beats'); else location.hash = '#/beats'; };
    more.addEventListener('click', event => { if (isDragging) return; event.preventDefault(); goBeats(); });
    more.addEventListener('keydown', event => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); goBeats(); } });
  }
}
