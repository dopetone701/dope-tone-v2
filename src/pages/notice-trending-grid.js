export function renderNoticeTrendingGrid(){
  return `
  <div class="ntg-shell" id="ntgShell">
    <!-- LEFT - TRENDING -->
    <div class="ntg-trend">
      <div class="ntg-head">
        <h3><span class="ntg-dot"></span> TRENDING</h3>
        <span class="ntg-sub">Most played • Live</span>
      </div>
      <div id="trendingGrid" class="trending-grid-v2"></div>
    </div>

    <!-- RIGHT - NOTICE BOARD -->
    <div class="ntg-notice">
      <div class="ntg-head">
        <h3><span class="ntg-dot red"></span> NOTICE BOARD</h3>
        <span class="ntg-sub" style="display:flex;align-items:center;gap:6px">
          <span style="width:6px;height:6px;background:#22c55e;border-radius:50%;box-shadow:0 0 8px #22c55e;display:inline-block"></span> LIVE
        </span>
      </div>
     
      <div id="dtDropsWrap"></div>
      <div id="noticeBoardFeed"></div>
     
      <div id="dtChatWrap">
        <div style="padding:10px 14px;background:#0a0a0f;border-bottom:1px solid #1e1e2e;display:flex;align-items:center;gap:8px">
          <div style="width:6px;height:6px;background:#0d3bff;border-radius:50%;box-shadow:0 0 6px #0d3bff"></div>
          <span style="color:#fff;font-size:10px;font-weight:800;letter-spacing:.6px">LIVE CHAT • Dope Tone Creators</span>
          <span id="dtTypingHead" style="margin-left:auto;font-size:9px;color:#0d3bff;display:none">typing...</span>
        </div>
        <div id="dtChatList"></div>
        <div id="dtTypingIndicator" style="display:none;padding:0 12px 8px"><span style="color:#6d7bff;font-size:11px">● ● ●</span></div>
      </div>

      <div id="dtRecommendWrap"></div>

      <div class="ntg-input-row">
        <input id="noticeBoardInput" placeholder="Try: I need EDM 145 bpm Cm" />
        <button id="noticeBoardSend">→</button>
      </div>
    </div>
  </div>

  <style>
    .ntg-shell{
      display:grid;
      grid-template-columns:1fr 400px;
      gap:24px;
      width:100%;
      align-items:start;
      box-sizing:border-box;
      padding:4px;
      margin-top:24px;
    }
    .ntg-trend,.ntg-notice{
      background: radial-gradient(120% 120% at 0% 0%, rgba(0,240,255,0.06), transparent 55%), rgba(18,24,58,0.92);
      border:1px solid rgba(255,255,255,0.06);
      border-radius:20px;
      padding:22px 20px 20px;
      box-shadow:0 1px 0 rgba(255,255,255,0.06) inset, 0 12px 30px rgba(0,0,0,0.35);
      backdrop-filter:blur(18px);
      min-width:0; overflow:hidden;
      box-sizing:border-box;
    }
    .ntg-head{
      display:flex; justify-content:space-between; align-items:center;
      margin-bottom:18px; padding-bottom:14px;
      border-bottom:1px solid rgba(255,255,255,0.07);
    }
    .ntg-head h3{
      font-family:'Orbitron',sans-serif; font-size:13px; letter-spacing:1.4px;
      color:#e9ecff; margin:0; display:flex; align-items:center; gap:10px;
    }
    .ntg-dot{width:7px;height:7px;background:#00f0ff;border-radius:50%;box-shadow:0 0 8px #00f0ff}
    .ntg-dot.red{background:#ff2a2a;box-shadow:0 0 8px #ff2a2a}
    .ntg-sub{font-size:11px;color:rgba(233,236,255,0.5);letter-spacing:0.3px}
    
    /* TRENDING - PERFECT PADDING */
    .trending-grid-v2{display:grid;grid-template-columns:repeat(2,1fr);gap:16px}
    .trending-card{border-radius:16px;overflow:hidden;aspect-ratio:1/1}
    
    /* DROPS */
    #dtDropsWrap{max-height:420px;overflow-y:auto;display:flex;flex-direction:column;gap:12px;padding:2px}
    #dtDropsWrap::-webkit-scrollbar{width:4px} #dtDropsWrap::-webkit-scrollbar-thumb{background:rgba(255,255,255,0.15);border-radius:99px}
    
    /* CHAT */
    #dtChatList{height:280px;overflow-y:auto;padding:14px;display:flex;flex-direction:column;gap:12px;background:#000;border-radius:0 0 12px 12px}
    #dtChatList::-webkit-scrollbar{display:none}
    #dtChatWrap{margin-top:16px;background:#0a0a0a;border:1px solid #1e1e2e;border-radius:16px;overflow:hidden}
    #dtRecommendWrap{margin-top:14px;display:none;padding-top:2px}

    /* INPUT - PERFECT PADDING */
    .ntg-input-row{display:flex;gap:12px;margin-top:18px;align-items:center}
    #noticeBoardInput{flex:1;background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.1);border-radius:99px;padding:12px 18px;color:#fff;font-size:13px;outline:none;transition:.2s}
    #noticeBoardInput:focus{border-color:rgba(0,240,255,0.3);background:rgba(255,255,255,0.08)}
    #noticeBoardSend{background:#FF1E3C;border:none;width:44px;height:44px;border-radius:50%;color:#fff;cursor:pointer;display:grid;place-items:center;font-weight:900;flex-shrink:0;transition:.2s}
    #noticeBoardSend:hover{transform:scale(1.05);box-shadow:0 0 14px rgba(255,30,60,0.5)}

    @media(max-width:1100px){.ntg-shell{grid-template-columns:1fr;gap:20px;padding:0}}
    @media(max-width:640px){.ntg-trend,.ntg-notice{padding:18px 14px 16px 14px;border-radius:18px} .trending-grid-v2{gap:12px}}
  </style>
  `;
}

export function initNoticeTrendingGrid(){
  const shell = document.getElementById('ntgShell');
  if(shell){
    const ro = new ResizeObserver(()=>{
      const w = shell.getBoundingClientRect().width;
      document.documentElement.style.setProperty('--ntg-w', w+'px');
    });
    ro.observe(shell);
  }
}

