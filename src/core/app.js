// ===============================
// 🔥 DOPE TONE V2 - APP BOOT V6 - HASH ONLY FINAL
// ===============================

import { store } from './store.js';
import { Router } from './router.js';
import { getBeats, getStatsOverview } from '../features/api.js';
import { initTopbar } from '../layout/topbar/topbar.js';
import { initLeft } from '../layout/leftSidebar/leftSidebar.js';
import { initRight } from '../layout/rightSidebar/rightSidebar.js';
import { initPlayerBar, initPlayerEngine } from '../layout/playerBar/playerBar.js';
import { renderFooter } from '../pages/footer.js';

import { injectAuthModals } from '../features/auth/auth-modals.js';
injectAuthModals(); // <-- MUST BE BEFORE AUTH IMPORT
import '../features/auth/auth.js';


window.DTStore = store;

console.log('%c DOPE TONE V2 - HASH ONLY ', 'background:#FF1E3C;color:white;padding:6px 12px;border-radius:8px;font-weight:900');

async function boot() {
  console.log('[V2 APP] Booting...');

  // 🔥 INJECT FIRST - KEEPS INDEX.HTML CLEAN
  try { injectAuthModals(); } catch(e){ console.error('auth modals',e); }

  try { initPlayerEngine(); initPlayerBar(); } catch (e) { console.error(e); }
  try { initTopbar(); initLeft(); initRight(); } catch (e) { console.error(e); }

  const left = document.getElementById('left-sidebar');
  const right = document.getElementById('right-sidebar');
  let overlay = document.getElementById('sidebar-overlay');

  if (!overlay) {
    overlay = document.createElement('div');
    overlay.id = 'sidebar-overlay';
    overlay.style.cssText = `position:fixed;inset:0;z-index:10001;background:rgba(5,10,20,.6);backdrop-filter:blur(10px);opacity:0;pointer-events:none;transition:.3s;`;
    document.body.appendChild(overlay);
  }

  if (window.innerWidth > 1024) {
    if (localStorage.getItem('dt_left_collapsed') === 'true') left?.classList.add('collapsed');
    if (localStorage.getItem('dt_right_collapsed') === 'true') right?.classList.add('collapsed');
  } else {
    if (right) right.style.display = 'none';
  }

  window.toggleLeft = () => {
    if (!left) return;
    if (window.innerWidth <= 1024) {
      const isOpen = left.classList.toggle('open');
      overlay.classList.toggle('active', isOpen);
      overlay.style.opacity = isOpen? '1' : '0';
      overlay.style.pointerEvents = isOpen? 'auto' : 'none';
      document.getElementById('main-row')?.classList.toggle('sidebar-open', isOpen);
      document.body.classList.toggle('sidebar-drawer-open', isOpen);
      return;
    }
    left.classList.toggle('collapsed');
    localStorage.setItem('dt_left_collapsed', left.classList.contains('collapsed'));
  };

  window.toggleRight = () => {
    if (!right || window.innerWidth <= 1024) return;
    right.classList.toggle('collapsed');
    localStorage.setItem('dt_right_collapsed', right.classList.contains('collapsed'));
  };

  window.closeLeft = () => {
    left?.classList.remove('open');
    overlay?.classList.remove('active');
    if (overlay) { overlay.style.opacity = '0'; overlay.style.pointerEvents = 'none'; }
    document.getElementById('main-row')?.classList.remove('sidebar-open');
    document.body.classList.remove('sidebar-drawer-open');
  };

  overlay.addEventListener('click', window.closeLeft);

  // Load beats
  try {
    const [beats, overview] = await Promise.all([getBeats(), getStatsOverview().catch(()=>({}))]);
    store.beats = Array.isArray(beats)? beats : [];
    store.filteredBeats = store.beats;
    store.loaded = true;
    store.overview = overview || {};
    window.__BEATS__ = store.beats;
    console.log('[V2 APP] beats loaded:', store.beats.length);
  } catch (e) {
    console.error(e);
    store.beats = []; store.filteredBeats = []; store.loaded = true;
  }

  document.documentElement.classList.add('loaded');

  try { renderFooter(); } catch(e){}

  window.addEventListener('hashchange', () => window.closeLeft?.());

  console.log('%c DOPE TONE V2 READY ', 'background:#E2FF54;color:#050505;padding:6px 12px;border-radius:8px;font-weight:900');
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot, { once: true });
} else {
  boot();
}
