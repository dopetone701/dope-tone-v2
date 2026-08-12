// CC V9.1 - X = CLOSE DASH, QUEUE COMES IN, MIDDLE STAYS CC
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
  rightEl.style.transition = 'transform.25s ease';

  rightEl.innerHTML = `
    <div style="height:64px; padding:0 16px; display:flex; align-items:center; justify-content:space-between; border-bottom:1px solid var(--border);">
      <b style="color:var(--white); font-size:11px; font-weight:900; letter-spacing:1.2px;">CONTROL <span style="color:var(--red)">CENTER</span></b>
      <button id="ccCloseRight" style="width:28px;height:28px;border-radius:8px;border:1px solid var(--border);background:rgba(255,255,255,.06);color:var(--white);cursor:pointer">✕</button>
    </div>
    <nav style="padding:12px 8px; display:flex; flex-direction:column; gap:2px;">
      <button data-cc="overview" class="cc-item ${route==='overview'?'active':''}"><span>📊</span> Overview</button>
      <button data-cc="beats" class="cc-item ${route==='beats'?'active':''}"><span>🎵</span> Beats</button>
      <button data-cc="audiences" class="cc-item ${route==='audiences'?'active':''}"><span>👥</span> Audiences</button>
      <button data-cc="tickets" class="cc-item ${route==='tickets'?'active':''}"><span>🎫</span> Support</button>
      <button data-cc="dropzone" class="cc-item ${route==='dropzone'?'active':''}"><span>📡</span> Drop Zone</button>
    </nav>
    <style>
  .cc-item{ width:100%; display:flex; gap:12px; padding:11px 14px; border-radius:14px; border:1px solid transparent; background:transparent; color:var(--muted); font-size:13px; font-weight:600; cursor:pointer; }
  .cc-item:hover{ background:rgba(255,255,255,.06); color:var(--white); }
  .cc-item.active{ background:rgba(255,255,255,.08); color:var(--white); border-color:var(--border); }
    </style>
  `;

  viewEl.innerHTML = `<div id="cc-main-page" style="min-height:80vh; padding:24px;"></div>`;
  rightEl.querySelectorAll('[data-cc]').forEach(btn=> btn.onclick = () => location.hash = `#/cc/${btn.dataset.cc}`);

  // X = CLOSE DASH, QUEUE COMES IN, MIDDLE STAYS CC
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
    // Clear CC dash styles
    rightEl.style.width = '';
    rightEl.style.minWidth = '';
    rightEl.style.maxWidth = '';
    rightEl.style.background = '';
    rightEl.style.borderLeft = '';
    // Force queue render
    if(window.initRight){
      window.initRight(true);
    } else if(window.__queueBackupHTML){
      rightEl.innerHTML = window.__queueBackupHTML;
    }
    // Inject Back to CC button at top of queue
    setTimeout(()=>{
      const back = document.createElement('button');
      back.textContent = '⚡ Back to CC Dash';
      back.style.cssText = 'margin:10px; width:calc(100% - 20px); padding:10px; border-radius:10px; border:1px solid #FF1E3C; background:#FF1E3C; color:#fff; cursor:pointer; font-weight:800; font-size:11px; letter-spacing:.5px;';
      back.onclick = () => {
        location.hash = location.hash.startsWith('#/cc/')? location.hash : '#/cc/overview';
      };
      rightEl.prepend(back);
      rightEl.style.transform = 'translateX(0)';
    }, 30);
  }, 200);
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
    // Left nav clicked away - fully close CC middle too (router will load vault)
    // Keep middle as vault/beats, queue is already there
    window.__ccMiddleOpen = false;
  }
  if(!isCC && localStorage.getItem('dt_cc_open')){
    // If hash not CC and user navigated via left menu, restore queue
    if(!window.__ccMiddleOpen){
      restoreQueue();
    }
  }
}
window.addEventListener('hashchange', checkCCMode);
