import { store } from '../core/store.js';
import { initBeatsArsenal, renderWave } from '../features/home/arsenal.js';

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

export function initHome(){
  const beats = store?.getBeats?.() || window.__BEATS__ || [];

  setTimeout(async ()=>{
    try{ const { renderFeatured } = await import('../features/home/featured.js'); await renderFeatured(); }catch(e){ console.warn('featured', e) }
    try{ const { renderLatest } = await import('../features/home/latest.v2.js'); await renderLatest(); }catch(e){ console.warn('latest', e) }
try{ renderWave(10); initBeatsArsenal(); }catch(e){ console.warn('arsenal', e) }
    try{ const { renderTrending } = await import('../features/home/trending-pro-v2.js'); renderTrending(); }catch(e){ console.warn('trending', e) }
    try{ window.initNoticeBoard && window.initNoticeBoard(); }catch{}

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
  }, 100);
}
