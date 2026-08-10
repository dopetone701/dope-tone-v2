// ===============================
// 🔥 DOPE TONE V2 - APP BOOT
// GLOBAL SHELL + DATA + LAYOUT
// ===============================

import { store } from './store.js';
import { renderRoute, navigate } from './router.js';
import {
  getBeats,
  getStatsOverview
} from '../features/api.js';

import { initTopbar } from '../layout/topbar/topbar.js';
import { initLeft } from '../layout/leftSidebar/leftSidebar.js';
import { initRight } from '../layout/rightSidebar/rightSidebar.js';
import {
  initPlayerBar,
  initPlayerEngine
} from '../layout/playerBar/playerBar.js';

import { renderFooter } from '../pages/footer.js';


// ==========================================
// 🌍 GLOBALS
// ==========================================

window.navigateTo = navigate;
window.DTStore = store;

console.log(
  '%c DOPE TONE V2 - PRO SHELL ',
  'background:#FF1E3C;color:white;padding:6px 12px;border-radius:8px;font-weight:900'
);


// ==========================================
// 🚀 BOOT
// ==========================================

async function boot() {

  console.log('[V2 APP] Booting...');


  // ========================================
  // 1. GLOBAL PLAYER
  // ========================================

  try {
    initPlayerEngine();
    initPlayerBar();
  } catch (e) {
    console.error('[V2 APP] Player failed:', e);
  }


  // ========================================
  // 2. GLOBAL LAYOUT
  // ========================================

  try {
    initTopbar();
    initLeft();
    initRight();
  } catch (e) {
    console.error('[V2 APP] Layout failed:', e);
  }


  // ========================================
  // 3. SIDEBAR SYSTEM
  // ========================================

  const left =
    document.getElementById('left-sidebar');

  const right =
    document.getElementById('right-sidebar');

  let overlay =
    document.getElementById('sidebar-overlay');


  // Create mobile overlay once
  if (!overlay) {

    overlay =
      document.createElement('div');

    overlay.id =
      'sidebar-overlay';

    overlay.style.cssText = `
      position:fixed;
      inset:0;
      z-index:10001;
      background:rgba(5,10,20,.6);
      backdrop-filter:blur(10px);
      opacity:0;
      pointer-events:none;
      transition:.3s;
    `;

    document.body.appendChild(overlay);
  }


  // ========================================
  // DESKTOP / MOBILE STATE
  // ========================================

  if (window.innerWidth > 1024) {

    if (
      localStorage.getItem(
        'dt_left_collapsed'
      ) === 'true'
    ) {
      left?.classList.add('collapsed');
    }

    if (
      localStorage.getItem(
        'dt_right_collapsed'
      ) === 'true'
    ) {
      right?.classList.add('collapsed');
    }

  } else {

    if (right) {
      right.style.display = 'none';
    }

  }


  // ========================================
  // LEFT SIDEBAR
  // ========================================

  window.toggleLeft = () => {

    if (!left) return;


    // MOBILE
    if (window.innerWidth <= 1024) {

      const isOpen =
        left.classList.toggle('open');

      overlay.classList.toggle(
        'active',
        isOpen
      );

      overlay.style.opacity =
        isOpen ? '1' : '0';

      overlay.style.pointerEvents =
        isOpen ? 'auto' : 'none';

      document
        .getElementById('main-row')
        ?.classList.toggle(
          'sidebar-open',
          isOpen
        );

      document.body.classList.toggle(
        'sidebar-drawer-open',
        isOpen
      );

      return;
    }


    // DESKTOP
    left.classList.toggle('collapsed');

    localStorage.setItem(
      'dt_left_collapsed',
      left.classList.contains('collapsed')
    );
  };


  // ========================================
  // RIGHT SIDEBAR
  // ========================================

  window.toggleRight = () => {

    if (
      !right ||
      window.innerWidth <= 1024
    ) return;

    right.classList.toggle('collapsed');

    localStorage.setItem(
      'dt_right_collapsed',
      right.classList.contains('collapsed')
    );
  };


  // ========================================
  // CLOSE LEFT
  // ========================================

  window.closeLeft = () => {

    left?.classList.remove('open');

    overlay?.classList.remove('active');

    if (overlay) {

      overlay.style.opacity = '0';

      overlay.style.pointerEvents =
        'none';
    }

    document
      .getElementById('main-row')
      ?.classList.remove(
        'sidebar-open'
      );

    document.body.classList.remove(
      'sidebar-drawer-open'
    );
  };


  overlay.addEventListener(
    'click',
    window.closeLeft
  );


  // ========================================
  // 4. LOAD DATA FIRST
  // ========================================

  try {

    const [
      beats,
      overview
    ] = await Promise.all([

      getBeats(),

      getStatsOverview()
        .catch(() => ({}))

    ]);


    // STORE
    store.beats =
      Array.isArray(beats)
        ? beats
        : [];

    store.filteredBeats =
      store.beats;

    store.loaded =
      true;

    store.overview =
      overview || {};


    // GLOBAL BEATS
    window.__BEATS__ =
      store.beats;

    window.DTStore.beats =
      store.beats;


    console.log(
      '[V2 APP] beats loaded:',
      store.beats.length
    );

  } catch (e) {

    console.error(
      '[V2 APP] beats load failed:',
      e
    );

    store.beats = [];
    store.filteredBeats = [];
    store.loaded = true;
  }


  // ========================================
  // 5. INITIAL ROUTE
  // ========================================

  try {

    await renderRoute(
      location.pathname
    );

  } catch (e) {

    console.error(
      '[V2 APP] route failed:',
      e
    );
  }


  // ========================================
  // PAGE READY
  // ========================================

  document.documentElement
    .classList
    .add('loaded');


  // ========================================
  // 6. FOOTER
  // ========================================

  try {

    renderFooter();

  } catch (e) {

    console.error(
      '[V2 APP] footer failed:',
      e
    );
  }


  // ========================================
  // 7. BROWSER NAVIGATION
  // ========================================

  window.addEventListener(
    'popstate',
    async () => {

      await renderRoute(
        location.pathname
      );

      window.closeLeft?.();
    }
  );


  // ========================================
  // 8. INTERNAL SPA LINKS
  // ========================================

  document.addEventListener(
    'click',
    e => {

      const a =
        e.target.closest(
          'a[data-link]'
        );

      if (!a) return;

      const href =
        a.getAttribute('href');

      if (!href) return;

      // Don't hijack external links
      if (
        href.startsWith('http://') ||
        href.startsWith('https://')
      ) {
        return;
      }

      e.preventDefault();

      navigate(href);

      if (
        window.innerWidth <= 1024
      ) {
        window.closeLeft?.();
      }
    }
  );


  console.log(
    '%c DOPE TONE V2 READY ',
    'background:#E2FF54;color:#050505;padding:6px 12px;border-radius:8px;font-weight:900'
  );
}


// ==========================================
// 🏁 START
// ==========================================

if (
  document.readyState === 'loading'
) {

  document.addEventListener(
    'DOMContentLoaded',
    boot,
    { once:true }
  );

} else {

  boot();

}
