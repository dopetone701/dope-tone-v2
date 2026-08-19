export function mountControlCenterShell(){
  const mainRow = document.getElementById('main-row');
  const left = document.getElementById('left-sidebar');
  const right = document.getElementById('right-sidebar');
  if(!mainRow) return;

  left?.classList.add('hidden'); right?.classList.add('hidden'); right?.classList.add('collapsed');

  let root = document.getElementById('cc-root');
  if(root) return root;

  if(!document.getElementById('cc-dashboard-style')){
    const link = document.createElement('link');
    link.id='cc-dashboard-style'; link.rel='stylesheet'; link.href='/styles/cc-dashboard.css';
    document.head.appendChild(link);
  }

  root = document.createElement('div');
  root.id='cc-root';
  root.innerHTML = `
    <aside id="cc-sidebar">
      <div class="cc-logo">
        <img src="public/images/logo.png" onerror="this.src='images/logo.png'">
        <div><b>DOPE TONE <span style="color:#FF1E3C">VAULT</span></b><i>CONTROL • OS</i></div>
      </div>
      <nav class="cc-nav">
        <button data-cc="overview" class="active">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3v18h18"/><path d="M7 14l3-3 3 3 5-5"/></svg>
          Overview
        </button>
        <button data-cc="beats">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>
          Beats
        </button>
        <button data-cc="audiences">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
          Audiences
        </button>
        <button data-cc="tickets">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
          Support
        </button>
        <button data-cc="dropzone">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
          Drop Zone
        </button>
        <div class="cc-sep"></div>
        <div class="cc-label">SYSTEM</div>
        <button data-cc="settings">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09a1.65 1.65 0 0 0 1.51-1 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 0 0 0-1.51 1z"/></svg>
          Settings
        </button>
        <button onclick="location.hash='#/'" style="color:#FF7A7A">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
          Exit CC
        </button>
      </nav>
    </aside>
    <div id="cc-main">
      <div id="cc-topbar">
        <h1><span class="live"></span> <span id="cc-page-title">CONTROL CENTER PRO</span> <span style="font-size:11px;color:#6B7280;font-weight:600;margin-left:8px" id="cc-page-sub">LIVE • D1 SYNCED • ${new Date().toLocaleDateString('en-GB',{day:'2-digit',month:'short',year:'numeric'})}</span></h1>
        <div class="cc-top-actions">
          <div style="display:flex;gap:6px">
            <button data-range="24H" style="height:32px;padding:0 10px;border-radius:8px;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.08);color:#9CA3AF;font-size:11px;font-weight:700;cursor:pointer">24H</button>
            <button data-range="7D" class="active" style="height:32px;padding:0 10px;border-radius:8px;background:#fff;color:#000;border:none;font-size:11px;font-weight:800;cursor:pointer">7D</button>
            <button data-range="30D" style="height:32px;padding:0 10px;border-radius:8px;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.08);color:#9CA3AF;font-size:11px;font-weight:700;cursor:pointer">30D</button>
            <button data-range="90D" style="height:32px;padding:0 10px;border-radius:8px;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.08);color:#9CA3AF;font-size:11px;font-weight:700;cursor:pointer">90D</button>
            <button data-range="1Y" style="height:32px;padding:0 10px;border-radius:8px;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.08);color:#9CA3AF;font-size:11px;font-weight:700;cursor:pointer">1Y</button>
            <button data-range="ALL" style="height:32px;padding:0 10px;border-radius:8px;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.08);color:#9CA3AF;font-size:11px;font-weight:700;cursor:pointer">ALL</button>
          </div>
          <input id="cc-search" placeholder="Search beats, fans..." style="height:32px">
          <button id="cc-export" style="height:32px;padding:0 12px;border-radius:8px;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.1);color:#fff;font-size:11px;font-weight:700;cursor:pointer">EXPORT</button>
          <button id="cc-exit" style="height:32px;padding:0 14px;border-radius:999px;background:#FF1E3C;color:#fff;border:none;font-weight:800;font-size:11px;letter-spacing:.8px;cursor:pointer">EXIT</button>
        </div>
      </div>

      <div class="cc-stats-strip" id="cc-stats-strip" style="display:grid;grid-template-columns:repeat(6,1fr);gap:10px;padding:12px 16px">
        <div class="cc-stat" style="background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.08);border-radius:12px;padding:12px"><h3 style="font-size:9px;color:#6B7280;letter-spacing:.8px"><span style="width:6px;height:6px;background:#FF1E3C;border-radius:50%;box-shadow:0 0 8px #FF1E3C;display:inline-block"></span> PLAYS <span id="playsChange" class="cc-change">+0%</span></h3><p id="totalPlays" style="font-size:18px;font-weight:800;color:#fff;margin:6px 0">0</p></div>
        <div class="cc-stat" style="background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.08);border-radius:12px;padding:12px"><h3 style="font-size:9px;color:#6B7280">DOWNLOADS <span id="downloadsChange" class="cc-change">+0%</span></h3><p id="totalDownloads" style="font-size:18px;font-weight:800;color:#fff;margin:6px 0">0</p></div>
        <div class="cc-stat" style="background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.08);border-radius:12px;padding:12px"><h3 style="font-size:9px;color:#6B7280">CART <span id="cartsChange" class="cc-change">+0%</span></h3><p id="cartItems" style="font-size:18px;font-weight:800;color:#fff;margin:6px 0">0</p></div>
        <div class="cc-stat" style="background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.08);border-radius:12px;padding:12px"><h3 style="font-size:9px;color:#6B7280">LIKES <span id="likesChange" class="cc-change">+0%</span></h3><p id="totalLikes" style="font-size:18px;font-weight:800;color:#fff;margin:6px 0">0</p></div>
        <div class="cc-stat" style="background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.08);border-radius:12px;padding:12px"><h3 style="font-size:9px;color:#6B7280">ORDERS <span id="ordersChange" class="cc-change">+0%</span></h3><p id="totalOrders" style="font-size:18px;font-weight:800;color:#fff;margin:6px 0">0</p></div>
        <div class="cc-stat" style="background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.08);border-radius:12px;padding:12px"><h3 style="font-size:9px;color:#6B7280">REVENUE <span id="revenueChange" class="cc-change">+0%</span></h3><p id="totalRevenue" style="font-size:18px;font-weight:800;color:#fff;margin:6px 0">$0</p></div>
      </div>

      <!-- PRO CHART SYSTEM — REPLACES OLD GRAPH -->
      <div id="cc-page" style="padding:12px 16px 24px">
        <div id="cc-chart-toolbar" style="display:flex;justify-content:space-between;align-items:center;padding:10px 12px;background:#0A0E1A;border:1px solid rgba(255,255,255,.08);border-bottom:none;border-radius:12px 12px 0 0">
          <div style="display:flex;gap:8px"><button data-metric="revenue" class="active" style="padding:6px 12px;border-radius:8px;background:#fff;color:#000;font-size:11px;font-weight:800;border:none;cursor:pointer">REVENUE</button><button data-metric="plays" style="padding:6px 12px;border-radius:8px;background:transparent;color:#9CA3AF;border:1px solid rgba(255,255,255,.1);font-size:11px;font-weight:700;cursor:pointer">PLAYS</button><button data-metric="orders" style="padding:6px 12px;border-radius:8px;background:transparent;color:#9CA3AF;border:1px solid rgba(255,255,255,.1);font-size:11px;font-weight:700;cursor:pointer">SALES</button><button data-metric="cart" style="padding:6px 12px;border-radius:8px;background:transparent;color:#9CA3AF;border:1px solid rgba(255,255,255,.1);font-size:11px;font-weight:700;cursor:pointer">CART</button></div>
          <div style="display:flex;gap:14px;font-size:11px;color:#9CA3AF"><label style="display:flex;gap:6px;align-items:center"><input data-layer="trend" type="checkbox" checked> Trend</label><label style="display:flex;gap:6px;align-items:center"><input data-layer="ma7" type="checkbox"> MA7</label><label style="display:flex;gap:6px;align-items:center"><input data-layer="range" type="checkbox" checked> Range</label><label style="display:flex;gap:6px;align-items:center"><input data-layer="events" type="checkbox" checked> Events</label><button id="clearTrackFilter" style="display:none;padding:4px 8px;border-radius:6px;background:#FF1E3C;color:#fff;border:none;font-size:10px;font-weight:700;cursor:pointer">CLEAR TRACK</button></div>
        </div>
        <div id="cc-chart-wrap" style="background:#050A14;border:1px solid rgba(255,255,255,.08);border-radius:0 0 12px 12px;overflow:hidden">
          <canvas id="tradeChart" style="width:100%;height:380px;display:block"></canvas>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:1px;background:rgba(255,255,255,.06)">
            <div style="background:#050A14;padding:8px 0"><div style="font-size:9px;color:#6B7280;padding:0 12px 6px;letter-spacing:.8px">MOMENTUM / ENGAGEMENT (RSI-LIKE)</div><canvas id="momentumChart" style="width:100%;height:90px;display:block"></canvas></div>
            <div style="background:#050A14;padding:8px 0"><div style="font-size:9px;color:#6B7280;padding:0 12px 6px;letter-spacing:.8px">CONVERSION RATE</div><canvas id="conversionChart" style="width:100%;height:90px;display:block"></canvas></div>
          </div>
        <div id="cc-graphBeatName" style="font-size:11px;color:#6B7280;margin-top:8px;font-family:monospace"></div>
      </div>
    </div>
  `;

  const mainContent = mainRow.querySelector('#main-content') || mainRow;
  mainContent.innerHTML = '';
  mainContent.appendChild(root);
  document.getElementById('cc-exit').onclick = () => location.hash = '#/';
  document.getElementById('cc-export')?.addEventListener('click', ()=>{
    const data = localStorage.getItem('cc_last_export') || 'no data';
    const blob = new Blob([JSON.stringify({ export: new Date().toISOString(), data }, null, 2)], {type:'application/json'});
    const url=URL.createObjectURL(blob); const a=document.createElement('a'); a.href=url; a.download=`dope-tone-cc-${Date.now()}.json`; a.click();
  });
  return root;
}

export function unmountControlCenterShell(){
  document.getElementById('cc-root')?.remove();
  document.getElementById('cc-dashboard-style')?.remove();
  document.getElementById('left-sidebar')?.classList.remove('hidden');
  document.getElementById('right-sidebar')?.classList.remove('hidden');
}
