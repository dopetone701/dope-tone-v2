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
          <svg viewBox="0 0 24 24"><path d="M3 3v18h18"/><path d="M7 14l3-3 3 3 5-5"/></svg>
          Overview
        </button>
        <button data-cc="beats">
          <svg viewBox="0 0 24 24"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>
          Beats
        </button>
        <button data-cc="audiences">
          <svg viewBox="0 0 24 24"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
          Audiences
        </button>
        <button data-cc="tickets">
          <svg viewBox="0 0 24 24"><path d="M15 5v2"/><path d="M15 11v2"/><path d="M15 17v2"/><path d="M5 5a2 2 0 0 0-2 2v3a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H5z"/></svg>
          Support
        </button>
        <button data-cc="dropzone">
          <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M2 12h20"/><path d="M12 2a15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
          Drop Zone
        </button>
        <div class="cc-sep"></div>
        <div class="cc-label">SYSTEM</div>
        <button data-cc="settings">
          <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0.33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83l.06-.06A1.65 0 0 0 9 15a1.65 0 0 0-1-1.51V13a2 2 0 0 1 4 0v.49c.45.27.86.64 1 1.51z"/></svg>
          Settings
        </button>
        <button onclick="location.hash='#/'" style="color:#FF7A7A">
          <svg viewBox="0 0 24 24"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
          Exit CC
        </button>
      </nav>
    </aside>
    <div id="cc-main">
      <div id="cc-topbar">
        <h1><span class="live"></span> <span id="cc-page-title">Overview</span> <span style="font-size:11px;color:#6B7280;font-weight:600;margin-left:8px" id="cc-page-sub">Live • D1 Synced</span></h1>
        <div class="cc-top-actions">
          <input id="cc-search" placeholder="Search beats, fans, tickets...">
          <button id="cc-exit" style="height:36px;padding:0 14px;border-radius:999px;background:#FF1E3C;color:#fff;border:none;font-weight:800;font-size:11px;letter-spacing:.8px;cursor:pointer">EXIT</button>
        </div>
      </div>
      <div class="cc-stats-strip" id="cc-stats-strip">
        <div class="cc-stat"><h3><span style="width:6px;height:6px;background:#FF1E3C;border-radius:50%;box-shadow:0 0 8px #FF1E3C;display:inline-block"></span>Total Plays <span class="cc-change">+0%</span></h3><p id="cc-totalPlays">0</p><canvas id="cc-playsSpark"></canvas></div>
        <div class="cc-stat"><h3>Downloads <span class="cc-change">+0%</span></h3><p id="cc-totalDownloads">0</p><canvas id="cc-downloadsSpark"></canvas></div>
        <div class="cc-stat"><h3>Cart Adds <span class="cc-change">+0%</span></h3><p id="cc-cartItems">0</p><canvas id="cc-cartSpark"></canvas></div>
        <div class="cc-stat"><h3>Total Likes <span class="cc-change">+0%</span></h3><p id="cc-totalLikes">0</p><canvas id="cc-likesSpark"></canvas></div>
        <div class="cc-stat"><h3>Orders <span class="cc-change">+0%</span></h3><p id="cc-totalOrders">0</p><canvas id="cc-ordersSpark"></canvas></div>
        <div class="cc-stat"><h3>Revenue <span class="cc-change">+0%</span></h3><p id="cc-totalRevenue">$0</p><canvas id="cc-revenueSpark"></canvas></div>
      </div>
      <div id="cc-page"></div>
    </div>
  `;

  const mainContent = mainRow.querySelector('#main-content') || mainRow;
  mainContent.innerHTML = '';
  mainContent.appendChild(root);
  document.getElementById('cc-exit').onclick = () => location.hash = '#/';
  return root;
}

export function unmountControlCenterShell(){
  document.getElementById('cc-root')?.remove();
  document.getElementById('cc-dashboard-style')?.remove();
  document.getElementById('left-sidebar')?.classList.remove('hidden');
  document.getElementById('right-sidebar')?.classList.remove('hidden');
}
