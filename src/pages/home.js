import { store } from '../core/store.js';
import { initBeatsArsenal, renderWave } from '../features/home/arsenal.js';

export function renderHome(){
  return `
    <section class="hero-v2">
      <div class="hero-v2-content">
        <h1 class="hero-title glass-title"><span class="top-line">DOPE TONE</span><span class="bottom-line">VAULT</span></h1>
        <p class="hero-subtext">Premium Sound Arsenal</p>
        <div class="hero-buttons">
          <a href="#/beats" class="cta-btn primary">Explore Beats</a>
          <button class="cta-btn secondary">Sample Packs</button>
        </div>
        
      </div>
    </section>


    <style>
    .hero-v2{height:70vh;min-height:500px;width:100%;background:linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url('public/images/studio.jpg') center/cover no-repeat;display:flex;align-items:center;justify-content:center;text-align:center;border-radius:22px;overflow:hidden;margin-bottom:28px;position:relative}
    .hero-v2::before{content:"";position:absolute;inset:0;background:rgba(0,0,20,0.5);z-index:1}
    .hero-v2-content{position:relative;z-index:2;padding:24px}
    .hero-title{font-family:'Orbitron',sans-serif;text-transform:uppercase;margin:0}
    .top-line,.bottom-line{display:block;font-size:clamp(36px,8vw,82px);letter-spacing:6px;background-image:linear-gradient(90deg,#4da6ff,#fff,#ff4d94), url('public/images/metal.jpg');background-size:cover;-webkit-background-clip:text;-webkit-text-fill-color:transparent}
    .bottom-line{width:60%;margin:8px auto 0}
    .glass-title{display:inline-block;padding:14px 32px;border-radius:18px;background:rgba(10,15,30,0.25);backdrop-filter:blur(8px);border:1px solid rgba(255,255,255,0.15)}
    .hero-subtext{margin-top:18px;color:#a5f3fc;letter-spacing:2px}

    #homeSmartWrap{display:grid;grid-template-columns:1fr;gap:26px;width:100%;box-sizing:border-box;padding:0 4px}
    #homeSmartWrap.side-by-side{grid-template-columns:1fr 410px;gap:26px;align-items:start}
    .arsenal-full{background:rgba(18,24,58,0.78);border:1px solid rgba(255,255,255,0.07);border-radius:22px;padding:24px 22px 20px 22px;backdrop-filter:blur(18px);box-sizing:border-box}
    .wave-list{display:flex;flex-direction:column;gap:12px;margin-top:18px}

    .ntg-shell{display:grid;grid-template-columns:1fr 400px;gap:22px;width:100%;align-items:start;box-sizing:border-box}
    .ntg-card{background:rgba(18,24,58,0.92);border:1px solid rgba(255,255,255,0.07);border-radius:20px;padding:22px 20px 18px 20px;backdrop-filter:blur(18px);box-sizing:border-box;min-width:0;overflow:visible;max-height:none}
    .ntg-head{display:flex;justify-content:space-between;align-items:center;margin-bottom:18px;padding-bottom:14px;border-bottom:1px solid rgba(255,255,255,0.07)}
    .ntg-head h3{font-family:'Orbitron',sans-serif;font-size:13px;letter-spacing:1.2px;color:#e9ecff;margin:0;display:flex;gap:10px;align-items:center}
    .ntg-dot{width:7px;height:7px;background:#00f0ff;border-radius:50%;box-shadow:0 0 8px #00f0ff}
    .ntg-dot.red{background:#ff2a2a;box-shadow:0 0 8px #ff2a2a}
    .trending-grid-v2{display:grid;grid-template-columns:repeat(2,1fr);gap:16px;overflow:visible;max-height:none}
    #dtDropsWrap{display:flex;flex-direction:column;gap:12px;max-height:400px;overflow-y:auto;padding:2px}
    #dtChatList{height:300px;overflow-y:auto;padding:14px;display:flex;flex-direction:column;gap:10px;background:#000;border-radius:12px}
    .ntg-input{display:flex;gap:12px;margin-top:16px}
    #noticeBoardInput{flex:1;background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.1);border-radius:99px;padding:12px 18px;color:#fff;outline:none}
    #noticeBoardSend{width:44px;height:44px;border-radius:50%;background:#FF1E3C;border:none;color:#fff;display:grid;place-items:center;cursor:pointer}
    #homeSmartWrap.side-by-side .ntg-shell{grid-template-columns:1fr;gap:20px}
    @media(max-width:1200px){#homeSmartWrap.side-by-side{grid-template-columns:1fr} .ntg-shell{grid-template-columns:1fr}}
    </style>

    <div id="featuredMount"></div>
    <div id="latestMount"></div>

    <div id="homeSmartWrap">
      <div class="arsenal-full">
        <div id="pillsMount"></div>
        <div id="waveList" class="wave-list"></div>
      </div>

      <div class="ntg-shell">
        <div class="ntg-card">
          <div class="ntg-head"><h3><span class="ntg-dot"></span> TRENDING</h3><span style="font-size:11px;color:rgba(255,255,255,0.5)">Live</span></div>
          <div id="trendingGrid" class="trending-grid-v2"></div>
        </div>
        <div class="ntg-card">
          <div class="ntg-head"><h3><span class="ntg-dot red"></span> NOTICE BOARD</h3><span style="font-size:11px;color:#22c55e">● LIVE</span></div>
          <div id="dtDropsWrap"></div>
          <div id="dtChatWrap" style="margin-top:14px;background:#0a0a0a;border:1px solid #1e1e2e;border-radius:14px;overflow:hidden"><div style="padding:10px 14px;border-bottom:1px solid #1e1e2e;font-size:10px;font-weight:800;letter-spacing:.6px;color:#fff">LIVE CHAT • Dope Tone Creators</div><div id="dtChatList"></div></div>
          <div id="dtRecommendWrap"></div>
          <div class="ntg-input"><input id="noticeBoardInput" placeholder="Try: I need EDM 145 bpm Cm"><button id="noticeBoardSend">→</button></div>
        </div>
      </div>
    </div>
  `;
}

export function initHome(){
  const beats = store?.getBeats?.() || window.__BEATS__ || [];
  setTimeout(async ()=>{
    try{ const { renderFeatured } = await import('../features/home/featured.js'); await renderFeatured(); }catch{}
    try{ const { renderLatest } = await import('../features/home/latest.v2.js'); await renderLatest(); }catch{}
    try{ renderWave(12); initBeatsArsenal(); }catch{}
    try{ const { renderTrending } = await import('../features/home/trending-pro-v2.js'); renderTrending(); }catch{}
    try{ window.initNoticeBoard && window.initNoticeBoard(); }catch{}

    const wrap = document.getElementById('homeSmartWrap');
    const check = ()=>{
      const l = document.getElementById('left-sidebar'), r = document.getElementById('right-sidebar');
      const lc = l?.classList.contains('collapsed'), rc = r?.classList.contains('collapsed') || r?.style.display==='none';
      if(lc && rc) wrap?.classList.add('side-by-side'); else wrap?.classList.remove('side-by-side');
    };
    check();
    try{
      new MutationObserver(check).observe(document.getElementById('left-sidebar'), {attributes:true});
      new MutationObserver(check).observe(document.getElementById('right-sidebar'), {attributes:true, attributeFilter:['class','style']});
    }catch{}
    setInterval(check, 1000);
  }, 100);
}
