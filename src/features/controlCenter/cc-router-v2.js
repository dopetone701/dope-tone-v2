// CC V9.2 - PURE SVG ICONS - X = CLOSE DASH, QUEUE COMES IN
export async function mountCC(fullPath, viewEl){
  const route = (fullPath.replace('#/cc/','').replace('/cc/','').replace('/cc','').replace(/^\//,'') || 'overview').split('?')[0];
  const rightEl = document.getElementById('right-sidebar');
  if(!rightEl ||!viewEl) return;

  const leftEl = document.getElementById('left-sidebar');
  if(leftEl) leftEl.classList.add('collapsed');

  if(!window.__queueBackupHTML && rightEl.innerHTML &&!rightEl.innerHTML.includes('CONTROL CENTER')){
    window.__queueBackupHTML = rightEl.innerHTML;
  }

  rightEl.classList.remove('collapsed');
  rightEl.style.width = 'var(--right-w, 280px)';
  rightEl.style.minWidth = 'var(--right-w, 280px)';
  rightEl.style.maxWidth = 'var(--right-w, 280px)';
  rightEl.style.background = 'var(--navy)';
  rightEl.style.borderLeft = '1px solid var(--border)';
  rightEl.style.transform = 'translateX(0)';
  rightEl.style.transition = 'transform.18s cubic-bezier(.16,1,.3,1)';

  rightEl.innerHTML = `
    <div style="height:64px; padding:0 16px; display:flex; align-items:center; justify-content:space-between; border-bottom:1px solid var(--border);">
      <b style="color:var(--white); font-size:11px; font-weight:900; letter-spacing:1.2px;">CONTROL <span style="color:var(--red)">CENTER</span></b>
      <button id="ccCloseRight" style="width:28px;height:28px;border-radius:8px;border:1px solid var(--border);background:rgba(255,255,255,.06);color:var(--white);cursor:pointer;display:grid;place-items:center">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6L6 18"/><path d="M6 6l12 12"/></svg>
      </button>
    </div>
    <nav style="padding:12px 8px; display:flex; flex-direction:column; gap:2px;">
      <button data-cc="overview" class="cc-item ${route==='overview'?'active':''}">
        <span style="width:20px;height:20px;display:grid;place-items:center"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3v18h18"/><path d="M7 14l3-3 3 3 5-5"/></svg></span>
        Overview
      </button>
      <button data-cc="beats" class="cc-item ${route==='beats'?'active':''}">
        <span style="width:20px;height:20px;display:grid;place-items:center"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg></span>
        Beats
      </button>
      <button data-cc="audiences" class="cc-item ${route==='audiences'?'active':''}">
        <span style="width:20px;height:20px;display:grid;place-items:center"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg></span>
        Audiences
      </button>
      <button data-cc="tickets" class="cc-item ${route==='tickets'?'active':''}">
        <span style="width:20px;height:20px;display:grid;place-items:center"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg></span>
        Support
      </button>
      <button data-cc="dropzone" class="cc-item ${route==='dropzone'?'active':''}">
        <span style="width:20px;height:20px;display:grid;place-items:center"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg></span>
        Drop Zone
      </button>
      <div style="height:1px;background:var(--border);margin:10px 8px"></div>
      <div style="font-size:9px;letter-spacing:1.4px;color:var(--muted);font-weight:700;padding:6px 12px">SYSTEM</div>
      <button data-cc="settings" class="cc-item ${route==='settings'?'active':''}">
        <span style="width:20px;height:20px;display:grid;place-items:center"><svg width="18" height="18" viewBox="0 0 24 24" fill="none"
     stroke="currentColor" stroke-width="1.8"
     stroke-linecap="round" stroke-linejoin="round"
     aria-hidden="true">
  <circle cx="12" cy="12" r="3"></circle>
  <path d="M19.43 15.34a1.7 1.7 0 0 0 .34 1.88l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.7 1.7 0 0 0-1.88-.34 1.7 1.7 0 0 0-1.03 1.56V21.5a2 2 0 1 1-4 0v-.23a1.7 1.7 0 0 0-1.03-1.56 1.7 1.7 0 0 0-1.88.34l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.7 1.7 0 0 0 .34-1.88 1.7 1.7 0 0 0-1.56-1.03H2.5a2 2 0 1 1 0-4h.23a1.7 1.7 0 0 0 1.56-1.03 1.7 1.7 0 0 0-.34-1.88l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.7 1.7 0 0 0 1.88.34h.01a1.7 1.7 0 0 0 1.02-1.56V2.5a2 2 0 1 1 4 0v.23a1.7 1.7 0 0 0 1.03 1.56 1.7 1.7 0 0 0 1.88-.34l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.7 1.7 0 0 0-.34 1.88v.01a1.7 1.7 0 0 0 1.56 1.02h.23a2 2 0 1 1 0 4h-.23a1.7 1.7 0 0 0-1.56 1.03z"></path>
</svg>
</span>
        Settings
      </button>
    </nav>
    <style>
 .cc-item{ width:100%; display:flex; gap:12px; align-items:center; padding:11px 14px; border-radius:12px; border:1px solid transparent; background:transparent; color:var(--muted); font-size:13px; font-weight:600; cursor:pointer; text-align:left; }
 .cc-item:hover{ background:rgba(255,255,255,.06); color:var(--white); }
 .cc-item.active{ background:rgba(255,255,255,.08); color:var(--white); border-color:var(--border); }
 .cc-item.active svg{ stroke:var(--white); }
    </style>
  `;

  viewEl.innerHTML = `<div id="cc-main-page" style="min-height:80vh; padding:24px;"></div>`;
  rightEl.querySelectorAll('[data-cc]').forEach(btn=> btn.onclick = () => location.hash = `#/cc/${btn.dataset.cc}`);

  rightEl.querySelector('#ccCloseRight').onclick = () => {
    closeCCDashToQueue();
  };

  try{
    const pageEl = viewEl.querySelector('#cc-main-page');
    const mod = await import(`./pages/${route}.js`).catch(()=>null);
    if(mod?.mount) await mod.mount(pageEl);
    else if(mod?.default) await mod.default(pageEl);
    else pageEl.innerHTML = `<h2 style="color:#fff">${route.toUpperCase()}</h2>`;
  }catch{}

  localStorage.setItem('dt_cc_open','true');
  window.__ccMiddleOpen = true;
}

function closeCCDashToQueue(){
  const rightEl = document.getElementById('right-sidebar');
  if(!rightEl) return;
  rightEl.style.transform = 'translateX(100%)';
  setTimeout(()=>{
    rightEl.style.width = '';
    rightEl.style.minWidth = '';
    rightEl.style.maxWidth = '';
    rightEl.style.background = '';
    rightEl.style.borderLeft = '';
    if(window.initRight){
      window.initRight(true);
    } else if(window.__queueBackupHTML){
      rightEl.innerHTML = window.__queueBackupHTML;
    }
    setTimeout(()=>{
      if(!document.getElementById('backToCCBtn')){
        const back = document.createElement('button');
        back.id='backToCCBtn';
        back.innerHTML = `<span style="display:inline-grid;place-items:center"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg></span> Back to CC Dash`;
        back.style.cssText = 'margin:10px; width:calc(100% - 20px); padding:10px; border-radius:10px; border:1px solid #FF1E3C; background:#FF1E3C; color:#fff; cursor:pointer; font-weight:800; font-size:11px; letter-spacing:.5px; display:flex; align-items:center; justify-content:center; gap:6px;';
        back.onclick = () => {
          location.hash = location.hash.startsWith('#/cc/')? location.hash : '#/cc/overview';
        };
        rightEl.prepend(back);
      }
      rightEl.style.transform = 'translateX(0)';
    }, 30);
  }, 180);
}

export function restoreQueue(){
  const rightEl = document.getElementById('right-sidebar');
  if(!rightEl) return;
  localStorage.removeItem('dt_cc_open');
  window.__ccMiddleOpen = false;
  rightEl.style.transform = 'translateX(0)';
  rightEl.style.width = '';
  rightEl.style.minWidth = '';
  rightEl.style.maxWidth = '';
  rightEl.style.background = '';
  rightEl.style.borderLeft = '';
  if(window.initRight) window.initRight(true);
}

export function checkCCMode(){
  const isCC = (location.hash||'').startsWith('#/cc/');
  if(!isCC && window.__ccMiddleOpen){
    window.__ccMiddleOpen = false;
  }
  if(!isCC && localStorage.getItem('dt_cc_open')){
    if(!window.__ccMiddleOpen){
      restoreQueue();
    }
  }
}
window.addEventListener('hashchange', checkCCMode);
