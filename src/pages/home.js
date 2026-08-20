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
    <div id="latestMount"></div>

    <div id="homeSmartWrap">
      <div class="arsenal-full">
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
  // Remove duplicate injectors that cause overflow fight
  // Keep only one canonical id
  const old1 = document.getElementById("dt-injected");
  const old2 = document.getElementById("dt-arsenal-fix");
  // Don't remove yet, let arsenal.js handle it, but ensure containment CSS exists immediately
  if (!document.getElementById("dt-home-containment-fix")) {
    const s = document.createElement("style");
    s.id = "dt-home-containment-fix";
    s.textContent = `
      #homeSmartWrap{width:100%!important;max-width:100%!important;box-sizing:border-box!important;overflow:hidden!important}
      #homeSmartWrap .arsenal-full{width:100%!important;max-width:100%!important;overflow:hidden!important;box-sizing:border-box!important}
      #pillsMount{max-width:100%!important;overflow:hidden!important;box-sizing:border-box!important}
      .dt-pills-scroll,#dtPillsScroll{max-width:100%!important;overflow-x:auto!important;overflow-y:hidden!important}
      #waveList{width:100%!important;max-width:100%!important;box-sizing:border-box!important;overflow:hidden!important;display:flex!important;flex-direction:column!important;gap:12px!important}
      .wave-row{width:100%!important;max-width:100%!important;box-sizing:border-box!important;overflow:hidden!important}
      .wave-bar{flex:1 1 0!important;min-width:0!important;overflow:hidden!important}
    `;
    document.head.appendChild(s);
  }
}

export async function initHome(){
  // 1. FIX OVERFLOW: Inject containment CSS BEFORE any wave render
  // This makes deep reload look like image 3/4, not image 1/2
  ensureHomeStyles();

  // 2. FIX EMPTY ON RELOAD: Wait for beats like VAULT does
  const beats = await waitForBeats();
  
  if (!beats.length) {
    console.warn("[HOME] no beats after 10s, retry on dt_beats_loaded");
    window.addEventListener("dt_beats_loaded", () => initHome(), { once: true });
    return;
  }

  // 3. Render in correct order: arsenal FIRST (injects its CSS + pills + wave)
  // This was renderWave before initBeatsArsenal -> caused overflow
  try{
    const { initBeatsArsenal } = await import('../features/home/arsenal.js');
    // initBeatsArsenal now does: injectStyles -> injectPills -> renderWave
    initBeatsArsenal();
  }catch(e){ console.warn('arsenal', e) }

  try{ 
    const { renderFeatured } = await import('../features/home/featured.js'); 
    await renderFeatured(); 
  }catch(e){ console.warn('featured', e) }

  try{ 
    const { renderLatest } = await import('../features/home/latest.v2.js'); 
    await renderLatest(); 
  }catch(e){ console.warn('latest', e) }

  try{ 
    const { renderTrending } = await import('../features/home/trending-pro-v2.js'); 
    // renderTrending now has fallback to local beats if STATS_API fails
    renderTrending(); 
  }catch(e){ console.warn('trending', e) }

  try{ 
    window.initNoticeBoard && window.initNoticeBoard(); 
  }catch(e){ console.warn('noticeboard', e) }

  // 4. Sidebar collapse watcher (your original)
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

  // 5. Re-init if beats arrive late (stats cold start)
  window.addEventListener("dt_beats_loaded", () => {
    // Only re-render if containers still empty
    const wave = document.getElementById("waveList");
    if (wave && !wave.children.length) {
      import('../features/home/arsenal.js').then(m => {
        m.renderWave?.(10);
        m.initBeatsArsenal?.();
      });
    }
  }, { once: true });
}

