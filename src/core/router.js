// ===============================
// 🔥 DOPE TONE V2 - ROUTER V8 FINAL - CC RIGHT DASH + QUEUE RESTORE
// ===============================

const PAGE_MAP = {
  '/': 'home',
  '/home': 'home', 'home': 'home',
  '/vault': 'vault', 'vault': 'vault',
  '/beats': 'beats', 'beats': 'beats',
  '/beat': 'beat', 'beat': 'beat',
  '/playlists': 'playlists', 'playlists': 'playlists',
  '/playlist': 'playlists', 'playlist': 'playlists',
  '/cart': 'cart', 'cart': 'cart',
  '/arsenal': 'arsenal', 'arsenal': 'arsenal',
  '/cc': 'cc', 'cc': 'cc',
  '/cc/overview': 'cc', 'cc/overview': 'cc',
  '/cc/beats': 'cc', 'cc/beats': 'cc',
  '/cc/audiences': 'cc', 'cc/audiences': 'cc',
  '/cc/tickets': 'cc', 'cc/tickets': 'cc',
  '/cc/dropzone': 'cc', 'cc/dropzone': 'cc',
  '/cc/settings': 'cc', 'cc/settings': 'cc',
};

export const Router = {
  init() {
    window.addEventListener('hashchange', () => this.resolve());
    document.body.addEventListener('click', (e) => {
      const a = e.target.closest('a[data-link], a[href^="/"], a[href^="#/"]');
      if (!a) return;
      const href = a.getAttribute('href');
      if (!href) return;
      if (href.startsWith('http://') || href.startsWith('https://')) return;
      if (href.startsWith('mailto:') || href.startsWith('tel:')) return;
      e.preventDefault();
      const clean = href.replace(/^#\/?/, '').replace(/^\//, '').replace(/\/$/, '').split('?')[0].split('#')[0];
      window.location.hash = clean || 'home';
    });
    this.resolve();
  },

  async resolve() {
    let raw = (window.location.hash || '').replace(/^#\/?/, '').split('?')[0].replace(/\/$/, '');
    if (!raw || raw === 'index.html' || raw === 'public' || raw === '/') raw = 'home';
    const path = '/' + raw.replace(/^\/+/, '').toLowerCase();

    console.log('%c ROUTING -> ' + path, 'background:#FF1E3C;color:white;padding:2px 8px;border-radius:4px');
    const view = document.getElementById('app-view');
    if (!view) return;

    // === CC - RIGHT DASH + MIDDLE CONTENT ===
    if (path.startsWith('/cc')) {
      try {
        const { mountCC } = await import('../features/controlCenter/cc-router-v2.js');
        await mountCC(path, view);
      } catch (err) {
        console.error('CC fail', err);
        view.innerHTML = `<div style="padding:40px;color:#FF4D6D">CC Error: ${err.message}</div>`;
      }
      return;
    } else {
      // NOT CC - RESTORE QUEUE IMMEDIATELY - THIS FIXES STUCK CC DASH
      try {
        const rightEl = document.getElementById('right-sidebar');
        if (rightEl && rightEl.innerHTML.includes('CONTROL CENTER')) {
          const { restoreQueue } = await import('../features/controlCenter/cc-router-v2.js');
          restoreQueue();
        }
        // Also clear CC flag
        if (localStorage.getItem('dt_cc_open')) {
          localStorage.removeItem('dt_cc_open');
        }
        // Uncollapse left if needed
        const leftEl = document.getElementById('left-sidebar');
        if (leftEl && path!== '/cc' &&!path.startsWith('/cc/')) {
          // keep left as user left it, don't force open
        }
      } catch {}
    }

    // Normal pages
    view.innerHTML = `<div style="padding:40px;color:#666;font-family:Orbitron">Loading ${path}...</div>`;

    setTimeout(async () => {
      try {
        if (path === '/' || path === '/home') {
          const { renderHome, initHome } = await import('../pages/home.js');
          view.innerHTML = renderHome();
          if (initHome) await initHome();
          return;
        }
        if (path === '/vault') {
          const m = await import('../pages/vault-page.js');
          view.innerHTML = m.renderVaultPage();
          if (m.initVaultPage) await m.initVaultPage();
          window.scrollTo(0, 0);
          return;
        }
        if (path === '/beats' || path.startsWith('/beats/')) {
          const m = await import('../features/beats/beats.js');
          view.innerHTML = m.renderBeatsPage();
          if (m.initBeatsPage) await m.initBeatsPage();
          return;
        }
        if (path === '/beat') {
          const m = await import('../pages/beat-page.js');
          view.innerHTML = m.renderBeatPage();
          if (m.initBeatPage) await m.initBeatPage();
          return;
        }
        if (path === '/playlists' || path === '/playlist') {
          const m = await import('../pages/playlist-page.js');
          view.innerHTML = m.renderPlaylistPage();
          if (m.initPlaylistPage) await m.initPlaylistPage();
          return;
        }
        if (path === '/cart') {
          const m = await import('../features/cart/cart.js');
          view.innerHTML = await m.renderCart();
          if (m.initCart) await m.initCart();
          return;
        }
        if (path === '/arsenal') {
          try {
            const m = await import('../pages/arsenal-page.js');
            view.innerHTML = m.renderArsenalPage();
            if (m.initArsenalPage) await m.initArsenalPage();
          } catch {
            view.innerHTML = `<div style="padding:100px;text-align:center;color:#fff"><h1>ARSENAL</h1><p>Coming soon</p><a href="#/beats" style="color:#FF1E3C">Go to Beats</a></div>`;
          }
          return;
        }
        // 404
        view.innerHTML = `
          <div style="min-height:60vh;display:flex;flex-direction:column;align-items:center;justify-content:center;background:#050A14;color:#fff;padding:40px">
            <h1 style="font-family:Orbitron;color:#FF1E3C">404</h1>
            <p>${path} not found</p>
            <a href="#/vault" data-link style="margin-top:20px;padding:12px 24px;background:#FF1E3C;color:#fff;border-radius:8px;text-decoration:none">Go Vault</a>
          </div>`;
      } catch (err) {
        console.error('Render error', path, err);
        view.innerHTML = `<div style="padding:40px;color:#FF4D6D"><h3>Error in ${path}</h3><p>${err.message}</p><a href="#/home" style="color:#1E90FF">Go Home</a></div>`;
      }
    }, 60);
  }
};

export function renderRoute(path) {
  if (path) {
    const clean = String(path).replace(/^#\/?/, '').replace(/^\//, '').split('?')[0].split('#')[0];
    window.location.hash = clean || 'home';
  } else {
    Router.resolve();
  }
}
export function navigate(path) { renderRoute(path); }
export function initRouter() { return Router.init(); }
window.navigate = navigate;
window.navigateTo = navigate;
window.renderRoute = renderRoute;
window.Router = Router;
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => Router.init(), { once: true });
} else {
  Router.init();
}


