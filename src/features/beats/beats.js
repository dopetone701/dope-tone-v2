// ============================================================
// DOPE TONE VAULT V2.5 — FULL LENGTH — PRO VIEW SYSTEM
// FIXED CART ONLY - REST UNTOUCHED
// ============================================================

import {
  renderGridView,
  renderListViewShow
} from "./beats-grid.js";

import {
  store
} from "../../core/store.js";

console.log(
  "🔥 DOPE TONE VAULT V2.5 — FULL"
);

const STATS_API =
  "https://dopetone-stats.dopetone701.workers.dev";

const DOWNLOAD_API =
  "https://ai-api.dopetone701.workers.dev";

const CHUNK_SIZE = 24;
const LIST_CHUNK = 20;

const PLAY_SVG = `
<svg viewBox="0 0 24 24" fill="currentColor">
  <path d="M8 5.14v13.72L19 12 8 5.14z"/>
</svg>
`;

const PAUSE_SVG = `
<svg viewBox="0 0 24 24" fill="currentColor">
  <path d="M7 5h4v14H7V5zm6 0h4v14h-4V5z"/>
</svg>
`;

const DOTS_SVG = `
<svg
  viewBox="0 0 24 24"
  fill="currentColor"
  width="18"
  height="18"
>
  <circle cx="12" cy="5" r="2"/>
  <circle cx="12" cy="12" r="2"/>
  <circle cx="12" cy="19" r="2"/>
</svg>
`;

const HEART_PATH = `
M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5
2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09
C13.09 3.81 14.76 3 16.5 3
19.58 3 22 5.42 22 8.5
c0 3.78-3.4 6.86-8.55 11.54L12 21.35z
`;

const HEART_SVG = `
<svg
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  stroke-width="1.8"
>
  <path d="${HEART_PATH}"/>
</svg>
`;

const HEART_FILL = `
<svg
  viewBox="0 0 24 24"
  fill="#FF1E3C"
  stroke="#FF1E3C"
  stroke-width="1.8"
>
  <path d="${HEART_PATH}"/>
</svg>
`;

let allBeats = [];
let filteredBeats = [];
let currentFilter = "all";
let currentSearch = "";
let currentView =
  localStorage.getItem("dt_arsenal_view") ||
  "list";
let gridRendered = 0;
let listRendered = 0;
let gridObserver = null;
let waveObserver = null;
let listObserver = null;
const waveCache = new Map();
let initialized = false;
let genreDropdown = null;

function getGlobalBeats() {
  const b =
    window.__BEATS__ ||
    window.DTStore?.beats ||
    window.store?.beats ||
    store?.getBeats?.() ||
    [];
  return Array.isArray(b)? b : [];
}

function normalizeBeat(raw) {
  if (!raw) return null;
  return {
   ...raw,
    id: raw.id,
    title: raw.title || raw.name || "Untitled",
    cover_url: raw.cover_url || raw.cover || raw.image || "images/studio.jpg",
    mp3_url: raw.mp3_url || raw.audio || raw.audio_url || "",
    genre: raw.genre || "Unknown",
    bpm: raw.bpm || 140,
    key: raw.key || "",
    mood: raw.mood || "",
    price: fixPrice(raw.price),
    monetization_mode: getMode(raw)
  };
}

function fixPrice(v) {
  let p = Number(v);
  if (!Number.isFinite(p)) return 29.99;
  if (p >= 1000) p /= 100;
  return Number(p.toFixed(2));
}

function getMode(beat) {
  if (!beat) return "paid";
  const m = String(beat.monetization_mode || beat.monetizationMode || "").toLowerCase().trim();
  if (["free","hybrid","paid"].includes(m)) return m;
  if (beat.is_free === true || Number(beat.is_free) === 1) return "free";
  if (beat.has_free_tagged === true || Number(beat.has_free_tagged) === 1) return "hybrid";
  return "paid";
}

function getLikes() {
  try { return JSON.parse(localStorage.getItem("dopetone_likes") || "[]"); } catch { return []; }
}
function saveLikes(likes) {
  localStorage.setItem("dopetone_likes", JSON.stringify(likes));
}
function isLiked(id) { return getLikes().includes(String(id)); }

function getCurrentUser() {
  try {
    return (
      window.Auth?.user ||
      window.currentUser ||
      JSON.parse(localStorage.getItem("dopetone_user") || "null")
    );
  } catch { return null; }
}

function requireAuth() {
  const user = getCurrentUser();
  if (user) return user;
  if (window.Auth?.openModal) window.Auth.openModal(false);
  else document.getElementById("authModal")?.classList.add("active");
  document.body.style.overflow = "hidden";
  window.Auth?.showToast?.("Sign in to continue");
  return null;
}

function trackEvent(id, type) {
  fetch(`${STATS_API}/api/stats/event`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ beat_id: Number(id), event_type: type }),
    keepalive: true
  }).catch(() => {});
}

// ============================================================
// CART - DNA TRUE - ONLY FIXED PART
// ============================================================
function getCart() {
  try { return JSON.parse(localStorage.getItem("dopetone_cart") || "[]"); } catch { return []; }
}
function saveCart(cart) {
  localStorage.setItem("dopetone_cart", JSON.stringify(cart));
  updateCartUI();
}
function updateCartUI() {
  const count = getCart().length;
  document.querySelectorAll(".cart-count,#cartItems").forEach(el => el.textContent = String(count));
  window.dispatchEvent(new CustomEvent("cc_cart_updated", { detail: { count } }));
}
function addToCartOnly(beat) {
  let cart = getCart();
  if (!cart.some(item => String(item.id) === String(beat.id))) {
    cart.push({...beat, price: fixPrice(beat.price) });
    saveCart(cart);
    trackEvent(beat.id, "cart");
    window.Auth?.showToast?.(`Added ${beat.title} to cart`);
  } else {
    window.Auth?.showToast?.("Already in cart");
  }
}
function buyBeat(beat) {
  addToCartOnly(beat);
  window.location.href = `licence-page.html?id=${encodeURIComponent(beat.id)}`;
}
function goToBeat(beat) {
  if (!beat?.id) return;
  closeAllMenus();
  const id = encodeURIComponent(beat.id);
  if (window.navigate) window.navigate(`/beat?id=${id}`);
  else location.hash = `#/beat?id=${id}`;
}

const activeDownloads = new Set();
async function downloadBeat(beat, button) {
  const user = requireAuth();
  if (!user) return;
  const id = String(beat.id);
  if (activeDownloads.has(id)) return;
  activeDownloads.add(id);
  const original = button?.innerHTML || "";
  try {
    if (button) { button.disabled = true; button.innerHTML = `<span class="dt-spinner"></span>`; }
    trackEvent(beat.id, "download");
    const userId = user.id || user.user_id;
    const url = `${DOWNLOAD_API}/api/secure-download/${beat.id}?uid=${encodeURIComponent(userId)}`;
    const res = await fetch(url, { method: "GET", headers: { "x-user-id": String(userId) }, cache: "no-store" });
    if (!res.ok) throw new Error(res.status);
    const blob = await res.blob();
    const blobURL = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = blobURL;
    link.download = `${String(beat.title).replace(/[^a-z0-9]/gi, "_")}_DopeTone.mp3`;
    document.body.appendChild(link);
    link.click();
    setTimeout(() => { URL.revokeObjectURL(blobURL); link.remove(); }, 2000);
    if (button) {
      button.innerHTML = "✓";
      setTimeout(() => { button.innerHTML = original; button.disabled = false; activeDownloads.delete(id); }, 1800);
    } else { activeDownloads.delete(id); }
  } catch (e) {
    console.error(e);
    if (button) { button.innerHTML = "Retry"; button.disabled = false; }
    activeDownloads.delete(id);
  }
}

function playBeat(beat, index, list) {
  if (!window.globalPlayer?.play) return;
  window.__CURRENT_BEAT__ = beat;
  window.__CURRENT_LIST__ = "beats-v2";
  window.globalPlayer.play(index, list, "beats-v2");
}

function destroyWaves() {
  if (waveObserver) { waveObserver.disconnect(); waveObserver = null; }
  waveCache.forEach(wave => { try { wave.destroy(); } catch {} });
  waveCache.clear();
}

function ensureWave(row, beat) {
  if (!row || row.dataset.waveReady === "1" ||!beat?.mp3_url) return;
  const container = row.querySelector(".wave-bar");
  if (!container) return;
  const WS = window.WaveSurfer || (typeof WaveSurfer!== "undefined"? WaveSurfer : null);
  if (!WS?.create) return;
  row.dataset.waveReady = "1";
  container.innerHTML = "";
  try {
    const wave = WS.create({
      container,
      waveColor: "rgba(255,255,255,.18)",
      progressColor: "#FF1E3C",
      cursorColor: "transparent",
      cursorWidth: 0,
      height: 42,
      barWidth: 2,
      barGap: 3,
      barRadius: 2,
      normalize: true,
      interact: false,
      partialRender: true,
      hideScrollbar: true
    });
    wave.load(beat.mp3_url);
    wave.on("ready", () => {
      if (String(window.__CURRENT_BEAT__?.id) === String(beat.id)) {
        const audio = document.querySelector("audio") || window.__DT_AUDIO__;
        if (audio?.duration) { try { wave.seekTo(audio.currentTime / audio.duration); } catch {} }
      }
    });
    wave.on("error", () => { row.dataset.waveReady = "0"; waveCache.delete(String(beat.id)); });
    row.__wave = wave;
    waveCache.set(String(beat.id), wave);
  } catch { row.dataset.waveReady = "0"; }
}

function closeAllMenus() {
  document.querySelectorAll(".dt-row-menu.active").forEach(menu => menu.classList.remove("active"));
  document.querySelectorAll(".wave-row").forEach(row => row.style.zIndex = "1");
}

document.addEventListener("click", e => {
  if (!e.target.closest(".dt-dots-wrap")) closeAllMenus();
});

function createDotsMenu(beat) {
  const mode = getMode(beat);
  const liked = isLiked(beat.id);
  const wrap = document.createElement("div");
  wrap.className = "dt-dots-wrap";
  wrap.innerHTML = `
    <button class="wave-dots" type="button">${DOTS_SVG}</button>
    <div class="dt-row-menu">
      <button data-act="goto">🎧 Go to beat</button>
      <button data-act="playlist">➕ Add to playlist</button>
      <button data-act="like">${liked? "❤️ Unlike" : "🤍 Like beat"}</button>
      <button data-act="share">🔗 Share beat</button>
      ${mode!== "paid"? `<button data-act="download">⬇️ Download</button>` : ""}
      <button data-act="cart">🛒 Add to cart</button>
      <button data-act="buy" class="dt-menu-buy">Buy • $${fixPrice(beat.price).toFixed(2)}</button>
    </div>
  `;
  const btn = wrap.querySelector(".wave-dots");
  const menu = wrap.querySelector(".dt-row-menu");
  btn.onclick = e => {
    e.stopPropagation();
    const was = menu.classList.contains("active");
    closeAllMenus();
    if (!was) { menu.classList.add("active"); wrap.closest(".wave-row").style.zIndex = "999"; }
  };
  menu.onclick = e => {
    e.stopPropagation();
    const act = e.target.closest("button")?.dataset.act;
    if (!act) return;
    closeAllMenus();
    if (act === "goto") { goToBeat(beat); return; }
    if (act === "playlist") {
      const pls = JSON.parse(localStorage.getItem("dopetone_playlists") || "[]");
      let my = pls.find(p => p.name === "My Playlist");
      if (!my) { my = { id: Date.now(), name: "My Playlist", beats: [] }; pls.push(my); }
      if (!my.beats.includes(String(beat.id))) my.beats.push(String(beat.id));
      localStorage.setItem("dopetone_playlists", JSON.stringify(pls));
      window.Auth?.showToast?.("Added to playlist");
    }
    if (act === "like") {
      let likes = getLikes();
      const id = String(beat.id);
      const cl = likes.includes(id);
      likes = cl? likes.filter(x => x!== id) : [...likes, id];
      if (!cl) trackEvent(beat.id, "like");
      saveLikes(likes);
      const row = document.querySelector(`.wave-row[data-beat-id="${beat.id}"]`);
      if (row) {
        const h = row.querySelector(".wave-heat");
        if (h) { h.classList.toggle("is-liked",!cl); h.innerHTML =!cl? HEART_FILL : HEART_SVG; }
      }
    }
    if (act === "share") {
      const url = `${location.origin}/beat.html?id=${beat.id}`;
      if (navigator.share) navigator.share({ title: beat.title, url }).catch(() => {});
      else if (navigator.clipboard) navigator.clipboard.writeText(url).then(() => window.Auth?.showToast?.("Link copied"));
      trackEvent(beat.id, "share");
    }
    if (act === "download") downloadBeat(beat);
    if (act === "cart") addToCartOnly(beat);
    if (act === "buy") buyBeat(beat);
  };
  return wrap;
}

function createListRow(beat, index, list) {
  const mode = getMode(beat);
  const liked = isLiked(beat.id);
  const price = fixPrice(beat.price);
  const row = document.createElement("div");
  row.className = "wave-row";
  row.dataset.beatId = String(beat.id);
  row.dataset.mode = mode;
  row.innerHTML = `
    <div class="wave-left">
      <div class="wave-cover-wrap">
        <img src="${escapeHTML(beat.cover_url)}" loading="lazy" alt="">
        <button class="wave-play" type="button">${PLAY_SVG}</button>
      </div>
    </div>
    <div class="wave-info">
      <div class="wave-title">${escapeHTML(beat.title)}</div>
      <div class="wave-meta">${escapeHTML(String(beat.bpm))} BPM • ${escapeHTML(beat.genre)}${beat.key? ` • ${escapeHTML(beat.key)}` : ""}</div>
    </div>
    <div class="wave-bar"></div>
    <div class="wave-actions">
      <button class="wave-heat ${liked? "is-liked" : ""}" type="button">${liked? HEART_FILL : HEART_SVG}</button>
      <button class="wave-buy ${mode === "free"? "is-free" : "is-paid"}" type="button">${mode === "free"? "FREE" : `$${price.toFixed(2)}`}</button>
    </div>
  `;
  const dotsMenu = createDotsMenu(beat);
  row.querySelector(".wave-actions").appendChild(dotsMenu);
  const playBtn = row.querySelector(".wave-play");
  playBtn.onclick = e => {
    e.stopPropagation();
    ensureWave(row, beat);
    const isCurrent = window.__CURRENT_BEAT__ && String(window.__CURRENT_BEAT__.id) === String(beat.id);
    const audio = document.querySelector("audio") || window.__DT_AUDIO__;
    if (isCurrent && audio &&!audio.paused) { audio.pause(); if (window.globalPlayer?.pause) window.globalPlayer.pause(); return; }
    playBeat(beat, index, list);
  };
  row.onclick = e => {
    if (e.target.closest(".wave-play,.wave-heat,.wave-buy,.wave-bar,.dt-dots-wrap")) return;
    playBtn.click();
  };
  row.ondblclick = e => {
    if (e.target.closest(".wave-play,.wave-heat,.wave-buy,.wave-bar,.dt-dots-wrap")) return;
    e.preventDefault(); e.stopPropagation();
    goToBeat(beat);
  };
  row.querySelector(".wave-heat").onclick = e => {
    e.stopPropagation();
    let likes = getLikes();
    const id = String(beat.id);
    const cl = likes.includes(id);
    likes = cl? likes.filter(x => x!== id) : [...likes, id];
    if (!cl) trackEvent(beat.id, "like");
    saveLikes(likes);
    const b = e.currentTarget;
    b.classList.toggle("is-liked",!cl);
    b.innerHTML =!cl? HEART_FILL : HEART_SVG;
  };
  row.querySelector(".wave-buy").onclick = e => {
    e.stopPropagation();
    mode === "free"? downloadBeat(beat, e.currentTarget) : buyBeat(beat);
  };
  return row;
}

function getListContainer() { return document.getElementById("waveList"); }
function getGridContainer() { return document.getElementById("gridContainer"); }
function getPillsContainer() {
  return document.querySelector(".pills-scroll") || document.getElementById("beatsPills") || document.getElementById("pillsMount");
}
function getSearchInput() {
  return document.querySelector(".arsenal-search input") || document.getElementById("beatsSearch");
}

function setViewVisibility(view) {
  const list = getListContainer();
  const grid = getGridContainer();
  if (view === "grid") {
    if (list) {
      list.hidden = true;
      list.style.setProperty("display", "none", "important");
      list.style.setProperty("visibility", "hidden", "important");
      list.style.setProperty("height", "0", "important");
      list.style.setProperty("overflow", "hidden", "important");
    }
    if (grid) {
      grid.hidden = false;
      grid.style.setProperty("display", "grid", "important");
      grid.style.setProperty("visibility", "visible", "important");
      grid.style.removeProperty("height");
      grid.style.removeProperty("overflow");
    }
  } else {
    if (grid) {
      grid.hidden = true;
      grid.style.setProperty("display", "none", "important");
      grid.style.setProperty("visibility", "hidden", "important");
      grid.style.setProperty("height", "0", "important");
      grid.style.setProperty("overflow", "hidden", "important");
    }
    if (list) {
      list.hidden = false;
      list.style.setProperty("display", "flex", "important");
      list.style.setProperty("visibility", "visible", "important");
      list.style.removeProperty("height");
      list.style.removeProperty("overflow");
    }
  }
}

function setupLazyWaves() {
  if (waveObserver) waveObserver.disconnect();
  waveObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const row = entry.target;
      const beat = filteredBeats.find(b => String(b.id) === String(row.dataset.beatId));
      if (beat) ensureWave(row, beat);
      waveObserver.unobserve(row);
    });
  }, { rootMargin: "0px 0px 450px 0px" });
  document.querySelectorAll("#waveList.wave-row:not([data-wave-observed])").forEach(row => {
    row.dataset.waveObserved = "1";
    waveObserver.observe(row);
  });
}

function setupListObserver() {
  let sentinel = document.getElementById("beatsListSentinel");
  if (!sentinel) {
    sentinel = document.createElement("div");
    sentinel.id = "beatsListSentinel";
    sentinel.style.height = "1px";
    getListContainer()?.after(sentinel);
  }
  if (listObserver) listObserver.disconnect();
  listObserver = new IntersectionObserver(entries => {
    if (entries[0]?.isIntersecting) renderList(false);
  }, { rootMargin: "800px" });
  listObserver.observe(sentinel);
}

function renderList(reset = true) {
  const container = getListContainer();
  if (!container) return;
  if (reset) {
    destroyWaves();
    container.innerHTML = "";
    listRendered = 0;
    if (listObserver) { listObserver.disconnect(); listObserver = null; }
  }
  if (!filteredBeats.length) {
    container.innerHTML = `<div class="dt-empty">No beats found.</div>`;
    return;
  }
  const next = filteredBeats.slice(listRendered, listRendered + LIST_CHUNK);
  const frag = document.createDocumentFragment();
  next.forEach((beat, i) => { frag.appendChild(createListRow(beat, listRendered + i, filteredBeats)); });
  container.appendChild(frag);
  listRendered += next.length;
  setupLazyWaves();
  if (listRendered < filteredBeats.length) setupListObserver();
}

function renderGrid(reset = true) {
  const container = getGridContainer();
  if (!container) return;
  if (reset) {
    if (gridObserver) { gridObserver.disconnect(); gridObserver = null; }
    container.innerHTML = "";
    gridRendered = 0;
  }
  if (!filteredBeats.length) {
    container.innerHTML = `<div class="dt-empty">No beats found.</div>`;
    return;
  }
  if (gridRendered >= filteredBeats.length) return;
  const slice = filteredBeats.slice(0, gridRendered + CHUNK_SIZE);
  container.innerHTML = "";
  renderGridView(slice, { downloadBeat, buyBeat, addToCartOnly, goToBeat, isLiked, getLikes, saveLikes });
  gridRendered = slice.length;
  setupGridObserver();
}

function setupGridObserver() {
  const sentinel = document.getElementById("gridSentinel");
  if (!sentinel) return;
  if (gridObserver) gridObserver.disconnect();
  gridObserver = new IntersectionObserver(entries => {
    if (entries[0]?.isIntersecting) renderGrid(false);
  }, { rootMargin: "800px" });
  gridObserver.observe(sentinel);
}

function applyFilters() {
  const q = currentSearch.trim().toLowerCase();
  filteredBeats = allBeats.filter(beat => {
    const genre = String(beat.genre || "").toLowerCase();
    const text = [beat.title, beat.genre, beat.key, beat.mood, beat.bpm, Array.isArray(beat.tags)? beat.tags.join(" ") : beat.tags].map(v => String(v||"").toLowerCase()).join(" ");
    return (!q || text.includes(q)) && (currentFilter === "all" || genre.includes(currentFilter));
  });
  if (currentView === "grid") { setViewVisibility("grid"); renderGrid(true); return; }
  setViewVisibility("list"); renderList(true);
}

function setupToggle() {
  const listBtn = document.getElementById("beatsListBtn");
  const gridBtn = document.getElementById("beatsGridBtn");
  if (!listBtn ||!gridBtn) return;
  function activate(view) {
    currentView = view;
    localStorage.setItem("dt_arsenal_view", view);
    listBtn.classList.toggle("active", view === "list");
    gridBtn.classList.toggle("active", view === "grid");
    setViewVisibility(view);
    applyFilters();
  }
  listBtn.onclick = () => activate("list");
  gridBtn.onclick = () => activate("grid");
  listBtn.classList.toggle("active", currentView === "list");
  gridBtn.classList.toggle("active", currentView === "grid");
  setViewVisibility(currentView);
}

function renderPills() {
  const mount = getPillsContainer();
  if (!mount) return;
  const genres = [...new Set(allBeats.map(beat => beat.genre).filter(Boolean))].slice(0,12);
  mount.innerHTML = `
    <div class="dt-header-left">
      <button class="pill filter-btn" id="genreFilterBtn" type="button">Filter ▾</button>
      <div class="dt-pills-divider"></div>
      <div class="dt-pills-scroll" id="dtPillsScroll">
        <button class="pill ${currentFilter === "all"? "active" : ""}" data-filter="all" type="button">All</button>
        ${genres.map(genre => `<button class="pill ${currentFilter === String(genre).toLowerCase()? "active" : ""}" data-filter="${escapeHTML(String(genre).toLowerCase())}" type="button">${escapeHTML(String(genre))}</button>`).join("")}
      </div>
    </div>
    <div class="dt-header-right">
      <div class="dt-view-toggle">
        <button id="beatsListBtn" class="dt-view-btn ${currentView === "list"? "active" : ""}" data-view="list" type="button">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M3 13h2v-2H3v2zm0 4h2v-2H3v2zm0-8h2V7H3v2zm4 4h14v-2H7v2zm0 4h14v-2H7v2zM7 7v2h14V7H7z"/></svg>
        </button>
        <button id="beatsGridBtn" class="dt-view-btn ${currentView === "grid"? "active" : ""}" data-view="grid" type="button">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M3 3h7v7H3V3zm0 11h7v7H3v-7zm11-11h7v7h-7V3zm0 11h7v7h-7v-7z"/></svg>
        </button>
      </div>
    </div>
  `;
  const scroll = mount.querySelector("#dtPillsScroll");
  if (!scroll) return;
  scroll.addEventListener("click", e => {
    const pill = e.target.closest(".pill");
    if (!pill) return;
    if (scroll.dataset.hasDragged === "1") { scroll.dataset.hasDragged = "0"; return; }
    mount.querySelectorAll(".dt-pills-scroll.pill").forEach(p => p.classList.remove("active"));
    pill.classList.add("active");
    currentFilter = pill.dataset.filter || "all";
    applyFilters();
  });
  const filterButton = mount.querySelector("#genreFilterBtn");
  if (filterButton) filterButton.onclick = () => toggleGenreDropdown();
  injectGenreStyles();
  renderGenreDropdown(genres);
  setupToggle();
  setupPillsDragScroll(scroll);
}

function setupPillsDragScroll(list) {
  if (!list) return;
  if (list.dataset.dragInit === "1") return;
  list.dataset.dragInit = "1";
  let isDown=false, startX=0, startScroll=0, moved=false;
  list.addEventListener("wheel", e => {
    if (list.scrollWidth <= list.clientWidth) return;
    const delta = Math.abs(e.deltaY) > Math.abs(e.deltaX)? e.deltaY : e.deltaX;
    if (!delta) return;
    e.preventDefault();
    list.scrollLeft += delta;
  }, { passive:false });
  list.addEventListener("pointerdown", e => {
    if (e.pointerType === "mouse" && e.button!== 0) return;
    isDown=true; moved=false; startX=e.clientX; startScroll=list.scrollLeft; list.dataset.hasDragged="0";
    if (e.pointerType === "mouse") list.classList.add("dragging");
  });
  list.addEventListener("pointermove", e => {
    if (!isDown) return;
    const dx = e.clientX - startX;
    if (Math.abs(dx) > 7) { moved=true; list.dataset.hasDragged="1"; }
    if (moved) list.scrollLeft = startScroll - dx * 1.25;
  });
  list.addEventListener("pointerup", () => {
    if (!isDown) return;
    isDown=false; list.classList.remove("dragging");
    if (moved) { list.dataset.hasDragged="1"; setTimeout(()=>{ list.dataset.hasDragged="0"; },100); }
    else list.dataset.hasDragged="0";
    moved=false;
  });
  list.addEventListener("pointercancel", () => {
    isDown=false; moved=false; list.classList.remove("dragging"); list.dataset.hasDragged="0";
  });
}

function renderGenreDropdown(genres) {
  document.getElementById("dtGenreDropdown")?.remove();
  const dd = document.createElement("div");
  dd.id = "dtGenreDropdown"; dd.className = "dt-genre-dropdown";
  const counts = {};
  allBeats.forEach(beat => { const genre = beat.genre || "Unknown"; counts[genre] = (counts[genre]||0)+1; });
  const labels = [`All (${allBeats.length})`,...genres.map(genre => `${genre} (${counts[genre]||0})`)];
  dd.innerHTML = `
    <div class="dt-genre-head">FILTER BY GENRE</div>
    ${labels.map(label => {
      const val = label.split(" (")[0].toLowerCase();
      return `<button data-g="${escapeHTML(val)}" class="${val===currentFilter?"active":""}">${escapeHTML(label)}</button>`;
    }).join("")}
    <button class="dt-genre-close">Close</button>
  `;
  document.body.appendChild(dd);
  dd.onclick = e => {
    const button = e.target.closest("button[data-g]");
    if (button) {
      currentFilter = button.dataset.g;
      dd.querySelectorAll("button[data-g]").forEach(b=>b.classList.remove("active"));
      button.classList.add("active");
      const mount = getPillsContainer();
      if (mount) {
        mount.querySelectorAll(".pill").forEach(p=>p.classList.remove("active"));
        const active = mount.querySelector(`[data-filter="${CSS.escape(currentFilter)}"]`);
        if (active) active.classList.add("active");
      }
      applyFilters(); dd.classList.remove("open"); return;
    }
    if (e.target.closest(".dt-genre-close")) dd.classList.remove("open");
  };
  genreDropdown = dd;
}
function toggleGenreDropdown() { if (!genreDropdown) return; genreDropdown.classList.toggle("open"); }

function setupSearch() {
  const input = getSearchInput();
  if (!input) return;
  let timeout;
  input.oninput = e => {
    clearTimeout(timeout);
    timeout = setTimeout(() => { currentSearch = e.target.value || ""; applyFilters(); }, 180);
  };
}

function setupPlayerSync() {
  const PLAY = PLAY_SVG; const PAUSE = PAUSE_SVG;
  function setAllToPlay() {
    document.querySelectorAll(".wave-play").forEach(b=>b.innerHTML=PLAY);
    document.querySelectorAll(".wave-row").forEach(r=>r.classList.remove("is-playing","is-active"));
  }
  document.addEventListener("playerPlay", e => {
    const {index, listId} = e.detail || {};
    setAllToPlay();
    if (listId!== "beats-v2" && listId!== "wave") return;
    const rows = document.querySelectorAll(".wave-row");
    if (rows[index]) {
      const row = rows[index];
      const btn = row.querySelector(".wave-play");
      if (btn) btn.innerHTML = PAUSE;
      row.classList.add("is-playing","is-active");
      ensureWave(row, filteredBeats[index]);
    }
  });
  document.addEventListener("playerPause", () => {
    document.querySelectorAll(".wave-play").forEach(b=>b.innerHTML=PLAY);
    document.querySelectorAll(".wave-row").forEach(r=>r.classList.remove("is-playing"));
  });
  document.addEventListener("playerEnded", () => { setAllToPlay(); });
  (function(){
    let ticking=false;
    function getAudio(){ return document.querySelector("audio") || window.__DT_AUDIO__ || document.getElementById("globalAudio"); }
    function syncProgress(){
      ticking=false;
      const audio=getAudio();
      if(!audio||!audio.duration||!window.__CURRENT_BEAT__?.id) return;
      const progress=audio.currentTime/audio.duration;
      if(!isFinite(progress)) return;
      const currentRow=document.querySelector(`.wave-row[data-beat-id="${window.__CURRENT_BEAT__.id}"]`);
      if(!currentRow) return;
      if(currentRow.__wave){ try{ if(currentRow.__wave.seekTo) currentRow.__wave.seekTo(progress); }catch{} }
      const bar=currentRow.querySelector(".wave-bar");
      if(bar) bar.style.setProperty("--progress", `${progress*100}%`);
    }
    function requestSync(){ if(ticking) return; ticking=true; requestAnimationFrame(syncProgress); }
    document.addEventListener("timeupdate", requestSync, true);
    document.addEventListener("seeked", requestSync, true);
    document.addEventListener("play", requestSync, true);
    document.addEventListener("click", e=>{
      const bar=e.target.closest(".wave-bar"); if(!bar) return;
      const row=bar.closest(".wave-row"); if(!row) return;
      if(String(row.dataset.beatId)!==String(window.__CURRENT_BEAT__?.id)) return;
      const audio=getAudio(); if(!audio?.duration) return;
      const rect=bar.getBoundingClientRect();
      const pct=Math.max(0,Math.min(1,(e.clientX-rect.left)/rect.width));
      audio.currentTime=pct*audio.duration;
      if(row.__wave){ try{ row.__wave.seekTo(pct); }catch{} }
      requestSync();
    });
    let rafId=null;
    function loop(){
      const audio=getAudio();
      if(audio &&!audio.paused &&!audio.ended){ syncProgress(); rafId=requestAnimationFrame(loop); }
      else rafId=null;
    }
    document.addEventListener("play", ()=>{ if(!rafId) loop(); }, true);
    document.addEventListener("pause", ()=>{ if(rafId){ cancelAnimationFrame(rafId); rafId=null; } }, true);
  })();
}

function escapeHTML(value){
  return String(value??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#039;");
}

function injectGenreStyles(){
  document.getElementById("dt-injected")?.remove();
  const style=document.createElement("style");
  style.id="dt-injected";
  style.textContent=`
.arsenal-inner{width:100%!important;max-width:100%!important;padding:0!important;margin:0!important;background:#050A14!important;box-sizing:border-box!important;}
.view-toggle{width:100%!important;max-width:100%!important;margin:0!important;padding:0 20px!important;height:52px!important;min-height:52px!important;max-height:52px!important;display:flex!important;align-items:center!important;background:rgba(5,10,20,0.98)!important;border-bottom:1px solid rgba(255,255,255,.07)!important;box-sizing:border-box!important;position:sticky!important;top:0!important;z-index:20!important;backdrop-filter:blur(12px)!important;}
.toggle-fixed{display:flex!important;align-items:center!important;justify-content:space-between!important;gap:16px!important;width:100%!important;max-width:100%!important;height:52px!important;padding:0!important;margin:0!important;box-sizing:border-box!important;}
.arsenal-bar-title{font-family:Orbitron,sans-serif!important;font-size:14px!important;font-weight:800!important;letter-spacing:1.8px!important;color:#FF1E3C!important;margin:0 16px 0 0!important;padding:0!important;line-height:1!important;flex-shrink:0!important;white-space:nowrap!important;}
#pillsMount,.pills-scroll{display:flex!important;align-items:center!important;justify-content:space-between!important;gap:12px!important;flex:1!important;min-width:0!important;width:100%!important;height:36px!important;min-height:36px!important;max-height:36px!important;padding:0!important;margin:0!important;overflow:visible!important;box-sizing:border-box!important;}
.dt-header-left{display:flex!important;align-items:center!important;gap:10px!important;flex:1!important;min-width:0!important;height:36px!important;overflow:hidden!important;}
.dt-pills-scroll{display:flex!important;align-items:center!important;gap:8px!important;flex:1!important;min-width:0!important;width:100%!important;height:32px!important;overflow-x:auto!important;overflow-y:visible!important;scrollbar-width:none!important;cursor:grab!important;padding:0!important;margin:0!important;white-space:nowrap!important;user-select:none!important;touch-action:pan-y!important;}
.dt-pills-scroll::-webkit-scrollbar{display:none!important}
.dt-pills-scroll.dragging{cursor:grabbing!important}
.dt-pills-scroll.pill{flex:0 0 auto!important;height:28px!important;min-height:28px!important;padding:0 14px!important;font-size:12px!important;line-height:28px!important;border-radius:999px!important;white-space:nowrap!important;cursor:pointer!important;pointer-events:auto!important;}
.dt-pills-divider{width:1px!important;height:18px!important;background:rgba(255,255,255,.1)!important;flex-shrink:0!important;}
.dt-header-right{display:flex!important;align-items:center!important;gap:8px!important;flex-shrink:0!important;margin-left:auto!important;height:32px!important;}
.dt-view-toggle{display:flex!important;align-items:center!important;height:32px!important;background:rgba(10,25,49,.9)!important;border:1px solid rgba(255,255,255,.1)!important;border-radius:8px!important;overflow:hidden!important;flex-shrink:0!important;}
.dt-view-btn{width:32px!important;height:32px!important;display:grid!important;place-items:center!important;background:transparent!important;border:0!important;color:#8a94b8!important;cursor:pointer!important;transition:.2s!important;}
.dt-view-btn:hover{background:rgba(255,255,255,.06)!important;color:#fff!important}
.dt-view-btn.active{background:#FF1E3C!important;color:#fff!important;box-shadow:0 0 12px rgba(255,30,60,.4)!important}
.filter-btn{height:28px!important;min-height:28px!important;padding:0 12px!important;font-size:12px!important;background:#0A1931!important;border-color:rgba(255,30,60,.25)!important;color:#fff!important;font-weight:700!important;border-radius:999px!important;}
#waveList, #gridContainer{padding:16px 20px 24px!important;width:100%!important;max-width:100%!important;box-sizing:border-box!important;}
#waveList{display:flex!important;flex-direction:column!important;gap:12px!important;}
.wave-row{width:100%!important;padding:16px 20px!important;min-height:82px!important;gap:18px!important;background:#0A1931!important;border:1px solid rgba(255,255,255,.08)!important;border-radius:14px!important;box-sizing:border-box!important;}
#gridContainer{width:100%!important;box-sizing:border-box!important;grid-template-columns:repeat(auto-fill, minmax(210px, 1fr))!important;gap:18px!important;}
#waveList[hidden]{display:none!important}
#gridContainer[hidden]{display:none!important}
#beatsListSentinel, #gridSentinel{width:100%;height:1px;}
.wave-dots{width:32px;height:32px;border-radius:8px;border:1px solid rgba(255,255,255,.08);background:rgba(255,255,255,.06);color:rgba(255,255,255,.7);display:grid;place-items:center;cursor:pointer;}
.dt-row-menu{position:absolute;right:0;top:38px;min-width:220px;background:#0A1931;border:1px solid rgba(255,255,255,.1);border-radius:12px;padding:6px;display:none;flex-direction:column;gap:2px;z-index:9999;}
.dt-row-menu.active{display:flex}
.dt-row-menu button{text-align:left;padding:10px 12px;border-radius:8px;border:0;background:transparent;color:#fff;font-size:13px;cursor:pointer;}
.dt-row-menu button:hover{background:rgba(255,30,60,.12);color:#FF1E3C}
.dt-genre-dropdown{position:fixed;right:16px;top:80px;width:280px;max-height:70vh;overflow:auto;background:#050A14;border:1px solid rgba(255,255,255,.1);border-radius:14px;padding:8px;display:none;z-index:999;}
.dt-genre-dropdown.open{display:block}
.dt-genre-head{font-family:Orbitron,sans-serif;font-size:11px;letter-spacing:2px;color:#9CA3AF;padding:8px}
.dt-genre-dropdown button[data-g]{width:100%;text-align:left;padding:10px 12px;border-radius:8px;border:0;background:transparent;color:#fff;cursor:pointer;}
.dt-genre-dropdown button[data-g].active,.dt-genre-dropdown button[data-g]:hover{background:rgba(255,30,60,.12);color:#FF1E3C}
.dt-genre-close{width:100%;margin-top:8px;padding:8px;border-radius:8px;border:1px solid rgba(255,255,255,.1);background:rgba(255,255,255,.06);color:#fff;cursor:pointer;}
.wave-buy{min-width:86px;height:32px;padding:0 14px;border-radius:8px;border:1px solid rgba(255,255,255,.1);background:#fff;color:#000;font-weight:800;font-size:13px;cursor:pointer;}
.wave-buy.is-free{background:#FF1E3C;color:#fff;border-color:#FF1E3C}
.dt-empty{padding:24px;color:#9CA3AF;text-align:center;border:1px dashed rgba(255,255,255,.08);border-radius:12px;}
.wave-row.is-active{background:rgba(255,30,60,.08)!important;border-color:rgba(255,30,60,.35)!important;box-shadow:0 0 0 1px rgba(255,30,60,.15) inset,0 4px 20px rgba(0,0,0,.3)!important;}
.wave-row.is-playing.wave-title{color:#FF1E3C!important;}
.wave-row.is-playing.wave-cover-wrap{box-shadow:0 0 0 2px #FF1E3C!important;}
.wave-row.is-playing.wave-play{opacity:1!important;background:rgba(0,0,0,.6)!important;}
.wave-play{transition:.15s!important;}
.wave-row:hover.wave-play{opacity:1!important}
.wave-bar{cursor:pointer!important}
.wave-bar wave{cursor:pointer!important}
.wave-bar{flex:1!important;height:42px!important;min-height:42px!important;cursor:pointer!important;position:relative!important;display:flex!important;align-items:center!important;opacity:.9!important;transition:.2s!important;}
.wave-row.is-playing.wave-bar{opacity:1!important}
.wave-bar::after{content:"";position:absolute;left:0;top:50%;width:var(--progress, 0%);height:2px;background:transparent;pointer-events:none;}
.wave-bar wave{width:100%!important;}
.wave-bar:hover{filter:brightness(1.2)!important}
`;
  document.head.appendChild(style);
}

export function renderBeatsPage() {
  return `
    <div class="arsenal-inner">
      <div class="view-toggle">
        <div class="toggle-fixed">
          <h2 class="arsenal-bar-title">ARSENAL</h2>
          <div class="pills-scroll" id="pillsMount"></div>
        </div>
      </div>
      <div id="waveList" class="wave-list"></div>
      <div id="beatsListSentinel"></div>
      <div id="gridContainer" class="grid-container" hidden></div>
      <div id="gridSentinel"></div>
    </div>
  `;
}

export async function initBeatsPage() {
  if (initialized) { loadBeats(); return; }
  initialized = true;
  await waitForStore();
  loadBeats();
  setupSearch();
  setupPlayerSync();
  injectGenreStyles();
}

function loadBeats() {
  allBeats = getGlobalBeats().map(normalizeBeat).filter(Boolean);
  filteredBeats = [...allBeats];
  renderPills();
  applyFilters();
  updateCartUI();
  injectGenreStyles();
}

async function waitForStore() {
  if (window.store?.loaded || store?.loaded) return;
  await new Promise(resolve => {
    const started = Date.now();
    const timer = setInterval(() => {
      if (window.store?.loaded || store?.loaded || Date.now() - started > 10000) { clearInterval(timer); resolve(); }
    }, 50);
  });
}

(function () {
  let ticking = false;
  function getAudio() { return document.querySelector("audio") || window.__DT_AUDIO__; }
  function sync() {
    ticking = false;
    const audio = getAudio();
    if (!audio || audio.paused ||!audio.duration ||!window.__CURRENT_BEAT__?.id) return;
    const progress = audio.currentTime / audio.duration;
    document.querySelectorAll(".wave-row").forEach(row => {
      if (String(row.dataset.beatId)!== String(window.__CURRENT_BEAT__.id)) return;
      try { row.__wave?.seekTo(progress); } catch {}
    });
  }
  function requestSync() { if (ticking) return; ticking = true; requestAnimationFrame(sync); }
  ["timeupdate","play","pause","seeked"].forEach(event => { document.addEventListener(event, requestSync, true); });
  document.addEventListener("click", e => {
    const bar = e.target.closest(".wave-bar"); if (!bar) return;
    const audio = getAudio(); if (!audio?.duration) return;
    const rect = bar.getBoundingClientRect();
    const progress = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    audio.currentTime = progress * audio.duration;
    requestSync();
  });
})();

window.DopeToneBeatsV2 = {
  render: loadBeats,
  getBeats: () => [...allBeats],
  getFiltered: () => [...filteredBeats]
};

export default { renderBeatsPage, initBeatsPage };
