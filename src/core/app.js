import { store } from './store.js';
import { renderRoute, navigate } from './router.js';
import { getBeats, getStatsOverview } from '../features/api.js';
import { initTopbar } from '../layout/topbar/topbar.js';
import { initLeft } from '../layout/leftSidebar/leftSidebar.js';
import { initRight } from '../layout/rightSidebar/rightSidebar.js';
import { initPlayerBar, initPlayerEngine } from '../layout/playerBar/playerBar.js';
import { renderFooter } from '../pages/footer.js';

window.navigateTo = navigate;
window.DTStore = store;

console.log('%c DOPE TONE V2 - PRO SHELL ','background:#FF1E3C;color:white;padding:6px 12px;border-radius:8px;font-weight:900');

async function boot(){
  initPlayerEngine();
  initTopbar();
  initLeft();
  initRight();
  initPlayerBar();

  const left = document.getElementById('left-sidebar');
  const right = document.getElementById('right-sidebar');
  let overlay = document.getElementById('sidebar-overlay');
  if(!overlay){
    overlay = document.createElement('div');
    overlay.id = 'sidebar-overlay';
    overlay.style.cssText='position:fixed;inset:0;z-index:10001;background:rgba(5,10,20,0.6);backdrop-filter:blur(10px);opacity:0;pointer-events:none;transition:.3s;';
    document.body.appendChild(overlay);
  }

  if(window.innerWidth > 1024){
    if(localStorage.getItem('dt_left_collapsed') === 'true') left?.classList.add('collapsed');
    if(localStorage.getItem('dt_right_collapsed') === 'true') right?.classList.add('collapsed');
  } else {
    if(right) right.style.display='none';
  }

  window.toggleLeft = () => {
    if(!left) return;
    if(window.innerWidth <= 1024){
      const isOpen = left.classList.toggle('open');
      overlay.classList.toggle('active', isOpen);
      overlay.style.opacity=isOpen?'1':'0';
      overlay.style.pointerEvents=isOpen?'auto':'none';
      document.getElementById('main-row')?.classList.toggle('sidebar-open', isOpen);
      document.body.classList.toggle('sidebar-drawer-open', isOpen);
    } else {
      left.classList.toggle('collapsed');
      localStorage.setItem('dt_left_collapsed', left.classList.contains('collapsed'));
    }
  };
  window.toggleRight = () => {
    if(!right || window.innerWidth <= 1024) return;
    right.classList.toggle('collapsed');
    localStorage.setItem('dt_right_collapsed', right.classList.contains('collapsed'));
  };
  window.closeLeft = () => {
    left?.classList.remove('open');
    overlay?.classList.remove('active');
    if(overlay){ overlay.style.opacity='0'; overlay.style.pointerEvents='none'; }
    document.getElementById('main-row')?.classList.remove('sidebar-open');
    document.body.classList.remove('sidebar-drawer-open');
  };
  overlay.addEventListener('click', window.closeLeft);

  // 4. DATA FIRST
  try{
    const [beats, overview] = await Promise.all([ getBeats(), getStatsOverview().catch(()=>({})) ]);
    store.beats = beats;
    store.filteredBeats = beats;
    store.loaded = true;
    store.overview = overview;
    window.__BEATS__ = beats;
    window.DTStore.beats = beats;
    console.log('[V2 APP] beats loaded', beats.length);
  }catch(e){
    console.error('[V2 APP] beats load failed', e);
    store.loaded = true;
  }

  // 5. ROUTE
  await renderRoute(location.pathname);
  document.documentElement.classList.add('loaded');

  // 6. FOOTER - ONCE, AFTER ROUTE, OUTSIDE #app-view
  try{ renderFooter(); }catch(e){ console.log('footer err', e); }

  window.addEventListener('popstate', ()=>{ renderRoute(location.pathname); window.closeLeft(); });
  document.addEventListener('click', e=>{
    const a = e.target.closest('a[data-link]');
    if(a){ e.preventDefault(); navigate(a.getAttribute('href')); if(window.innerWidth <= 1024) window.closeLeft(); }
  });
}

document.addEventListener('DOMContentLoaded', boot);
