const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/arsenal-BzEVrKLs.js","assets/index-Bm9mePCq.js","assets/index-arbpgsvz.css","assets/featured-ByiAxw_8.js","assets/latest.v2-R7GgHnGq.js"])))=>i.map(i=>d[i]);
import{_ as s,s as c}from"./index-Bm9mePCq.js";function h(){return`
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
  `}async function m(r=1e4){var o,t,e,a,n,l;const i=Date.now();for(;Date.now()-i<r;){const d=((t=(o=c)==null?void 0:o.getBeats)==null?void 0:t.call(o))||window.__BEATS__||((e=window.DTStore)==null?void 0:e.beats)||((a=window.store)==null?void 0:a.beats)||[];if(d&&d.length>=10)return window.__BEATS__=d,window.DTStore&&(window.DTStore.beats=d),window.store=window.store||{},window.store.beats=d,window.dispatchEvent(new CustomEvent("dt_beats_loaded",{detail:{beats:d}})),d;await new Promise(p=>setTimeout(p,120))}return((l=(n=c)==null?void 0:n.getBeats)==null?void 0:l.call(n))||window.__BEATS__||[]}function w(){if(document.getElementById("dt-injected"),document.getElementById("dt-arsenal-fix"),!document.getElementById("dt-home-containment-fix")){const r=document.createElement("style");r.id="dt-home-containment-fix",r.textContent=`
      #homeSmartWrap{width:100%!important;max-width:100%!important;box-sizing:border-box!important;overflow:hidden!important}
      #homeSmartWrap .arsenal-full{width:100%!important;max-width:100%!important;overflow:hidden!important;box-sizing:border-box!important}
      #pillsMount{max-width:100%!important;overflow:hidden!important;box-sizing:border-box!important}
      .dt-pills-scroll,#dtPillsScroll{max-width:100%!important;overflow-x:auto!important;overflow-y:hidden!important}
      #waveList{width:100%!important;max-width:100%!important;box-sizing:border-box!important;overflow:hidden!important;display:flex!important;flex-direction:column!important;gap:12px!important}
      .wave-row{width:100%!important;max-width:100%!important;box-sizing:border-box!important;overflow:hidden!important}
      .wave-bar{flex:1 1 0!important;min-width:0!important;overflow:hidden!important}
    `,document.head.appendChild(r)}}async function v(){if(w(),!(await m()).length){console.warn("[HOME] no beats after 10s, retry on dt_beats_loaded"),window.addEventListener("dt_beats_loaded",()=>v(),{once:!0});return}try{const{initBeatsArsenal:t}=await s(async()=>{const{initBeatsArsenal:e}=await import("./arsenal-BzEVrKLs.js");return{initBeatsArsenal:e}},__vite__mapDeps([0,1,2]));t()}catch(t){console.warn("arsenal",t)}try{const{renderFeatured:t}=await s(async()=>{const{renderFeatured:e}=await import("./featured-ByiAxw_8.js");return{renderFeatured:e}},__vite__mapDeps([3,1,2]));await t()}catch(t){console.warn("featured",t)}try{const{renderLatest:t}=await s(async()=>{const{renderLatest:e}=await import("./latest.v2-R7GgHnGq.js");return{renderLatest:e}},__vite__mapDeps([4,1,2]));await t()}catch(t){console.warn("latest",t)}try{const{renderTrending:t}=await s(async()=>{const{renderTrending:e}=await import("./trending-pro-v2-jWmvWszV.js");return{renderTrending:e}},[]);t()}catch(t){console.warn("trending",t)}try{window.initNoticeBoard&&window.initNoticeBoard()}catch(t){console.warn("noticeboard",t)}const i=document.getElementById("homeSmartWrap"),o=()=>{const t=document.getElementById("left-sidebar"),e=document.getElementById("right-sidebar"),a=t==null?void 0:t.classList.contains("collapsed"),n=(e==null?void 0:e.classList.contains("collapsed"))||(e==null?void 0:e.style.display)==="none";a&&n?i==null||i.classList.add("side-by-side"):i==null||i.classList.remove("side-by-side")};o();try{const t=document.getElementById("left-sidebar"),e=document.getElementById("right-sidebar");t&&new MutationObserver(o).observe(t,{attributes:!0}),e&&new MutationObserver(o).observe(e,{attributes:!0,attributeFilter:["class","style"]})}catch{}window.addEventListener("dt_beats_loaded",()=>{const t=document.getElementById("waveList");t&&!t.children.length&&s(()=>import("./arsenal-BzEVrKLs.js"),__vite__mapDeps([0,1,2])).then(e=>{var a,n;(a=e.renderWave)==null||a.call(e,10),(n=e.initBeatsArsenal)==null||n.call(e)})},{once:!0})}export{v as initHome,h as renderHome};
