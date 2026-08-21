import { store } from '../core/store.js';

export function renderHome(){
  return `
    <section class="hero-v2">
      <div class="hero-v2-content">
        <h1 class="hero-title glass-title">
          <span class="top-line">DOPE TONE</span>
          <span class="bottom-line">VAULT</span>
        </h1>
        <p class="hero-subtext">Premium Sound Arsenal</p>
        <div class="hero-buttons">
          <a href="#/beats" class="cta-btn primary">Explore Beats</a>
          <button class="cta-btn secondary">Sample Packs</button>
        </div>
      </div>
    </section>

    <div id="featuredMount"></div>

    <div class="dt-section-title">LATEST DROPS</div>
    <div id="latestMount"></div>

    <div id="homeSmartWrap">
      <div class="arsenal-full">
        <div class="dt-section-title">BEATS ARSENAL</div>
        <div id="pillsMount"></div>
        <div id="waveList" class="wave-list"></div>
      </div>

      <div class="ntg-shell">
        <div class="ntg-card">
          <div class="ntg-head">
            <h3><span class="ntg-dot"></span> TRENDING</h3>
            <span style="font-size:11px;color:rgba(255,255,255,0.5)">Live</span>
          </div>
          <div id="trendingGrid" class="trending-grid-v2"></div>
        </div>

        <div class="ntg-card">
          <div class="ntg-head">
            <h3><span class="ntg-dot red"></span> NOTICE BOARD</h3>
            <span style="font-size:11px;color:#22c55e">● LIVE</span>
          </div>
          <div id="dtDropsWrap"></div>
          <div id="dtChatWrap" style="margin-top:14px;background:#0a0a0a;border:1px solid #1e1e2e;border-radius:14px;overflow:hidden">
            <div style="padding:10px 14px;border-bottom:1px solid #1e1e2e;font-size:10px;font-weight:800;letter-spacing:.6px;color:#fff">LIVE CHAT • Dope Tone Creators</div>
            <div id="dtChatList"></div>
          </div>
          <div id="dtRecommendWrap"></div>
          <div class="ntg-input">
            <input id="noticeBoardInput" placeholder="Try: I need EDM 145 bpm Cm">
            <button id="noticeBoardSend">→</button>
          </div>
        </div>
      </div>
    </div>
  `;
}

async function waitForBeats(timeout = 10000) {
  const start = Date.now();
  while (Date.now() - start < timeout) {
    const b = store?.getBeats?.() || window.__BEATS__ || window.DTStore?.beats || window.store?.beats || [];
    if (b && b.length >= 10) {
      window.__BEATS__ = b;
      if (window.DTStore) window.DTStore.beats = b;
      window.store = window.store || {};
      window.store.beats = b;
      window.dispatchEvent(new CustomEvent("dt_beats_loaded", { detail: { beats: b } }));
      return b;
    }
    await new Promise(r => setTimeout(r, 120));
  }
  return store?.getBeats?.() || window.__BEATS__ || [];
}

function ensureHomeStyles() {
  if (!document.getElementById("dt-home-containment-fix")) {
    const s = document.createElement("style");
    s.id = "dt-home-containment-fix";
    s.textContent = `
      #homeSmartWrap{width:100%!important;max-width:100%!important;box-sizing:border-box!important;overflow:hidden!important;padding-bottom:160px!important;margin-bottom:0!important}
      #homeSmartWrap .arsenal-full{width:100%!important;max-width:100%!important;overflow:hidden!important;box-sizing:border-box!important}
      #pillsMount{max-width:100%!important;overflow:hidden!important;box-sizing:border-box!important}
      .dt-pills-scroll,#dtPillsScroll{max-width:100%!important;overflow-x:auto!important;overflow-y:hidden!important}
      #waveList{width:100%!important;max-width:100%!important;box-sizing:border-box!important;overflow:hidden!important;display:flex!important;flex-direction:column!important;gap:12px!important}
      .wave-row{width:100%!important;max-width:100%!important;box-sizing:border-box!important;overflow:hidden!important}
      .wave-bar{flex:1 1 0!important;min-width:0!important;overflow:hidden!important}
      /* GLOBAL PLAYER CLEARANCE */
      body{padding-bottom:90px!important}
      .global-player,#globalPlayerUI{margin-bottom:0!important}
      /* TITLE STYLE */
      .dt-section-title{
        font-family:'Orbitron',sans-serif;font-size:18px;font-weight:800;letter-spacing:2px;color:#fff;margin:32px 0 16px 0;padding-left:4px;display:flex;align-items:center;gap:10px;
      }
      .dt-section-title::before{
        content:"";width:3px;height:18px;background:linear-gradient(180deg,#60B5FF,#FF1E3C);border-radius:999px;display:inline-block;
      }
    `;
    document.head.appendChild(s);
  }

  // NUKER - runs after featured.js injects its styles
  if (!document.getElementById("dt-featured-nuke")) {
    const n = document.createElement("style");
    n.id = "dt-featured-nuke";
    n.textContent = `
      /* KILL NEON UNDERLINE - FEATURED DROPS */
      #featuredMount .section-title::after,
      .featured-section .section-title::after,
      #featuredMount .section-title-wrap::after,
      .featured-section .section-title-wrap::after,
      #featuredMount [class*="section-title"]::after,
      .featured-section [class*="section-title"]::after{
        display:none !important;
        content:none !important;
        width:0 !important;
        height:0 !important;
        background:none !important;
        box-shadow:none !important;
        opacity:0 !important;
      }
      /* Make featured title SAME as others */
      #featuredMount .section-title,
      .featured-section .section-title{
        all:unset !important;
        font-family:'Orbitron',sans-serif !important;
        font-size:18px !important;
        font-weight:800 !important;
        letter-spacing:2px !important;
        color:#fff !important;
        margin:32px 0 16px 4px !important;
        display:flex !important;
        align-items:center !important;
        gap:10px !important;
      }
      #featuredMount .section-title::before,
      .featured-section .section-title::before{
        content:"" !important;
        width:3px !important;
        height:18px !important;
        background:linear-gradient(180deg,#60B5FF,#FF1E3C) !important;
        border-radius:999px !important;
        display:inline-block !important;
      }
    `;
    document.head.appendChild(n);
  }
}

export async function initHome(){
  ensureHomeStyles();

  // re-inject nuke after 1s to beat late-loaded featured CSS
  setTimeout(ensureHomeStyles, 1000);

  const beats = await waitForBeats();
  if (!beats.length) {
    window.addEventListener("dt_beats_loaded", () => initHome(), { once: true });
    return;
  }

  try{
    const { initBeatsArsenal } = await import('../features/home/arsenal.js');
    initBeatsArsenal();
  }catch(e){}

  try{
    const { renderFeatured } = await import('../features/home/featured.js');
    await renderFeatured();
    setTimeout(ensureHomeStyles, 300); // nuke again after featured renders
  }catch(e){}

  try{
    const { renderLatest } = await import('../features/home/latest.v2.js');
    await renderLatest();
  }catch(e){}

  try{
    const { renderTrending } = await import('../features/home/trending-pro-v2.js');
    renderTrending();
  }catch(e){}

  try{ window.initNoticeBoard && window.initNoticeBoard(); }catch(e){}

  const wrap = document.getElementById('homeSmartWrap');
  const check = ()=>{
    const l = document.getElementById('left-sidebar');
    const r = document.getElementById('right-sidebar');
    const lc = l?.classList.contains('collapsed');
    const rc = r?.classList.contains('collapsed') || r?.style.display==='none';
    if(lc && rc) wrap?.classList.add('side-by-side');
    else wrap?.classList.remove('side-by-side');
  };
  check();
  try{
    const left = document.getElementById('left-sidebar');
    const right = document.getElementById('right-sidebar');
    if(left) new MutationObserver(check).observe(left, {attributes:true});
    if(right) new MutationObserver(check).observe(right, {attributes:true, attributeFilter:['class','style']});
  }catch{}

  window.addEventListener("dt_beats_loaded", () => {
    const wave = document.getElementById("waveList");
    if (wave && !wave.children.length) {
      import('../features/home/arsenal.js').then(m => {
        m.renderWave?.(10);
        m.initBeatsArsenal?.();
      });
    }
  }, { once: true });
}
