// src/core/router.js - V9.4 - FIXED 404 - KEEPS cart V8 modal + checkout-paypal-v2.js ONLY - NO checkout.js
const PAGE_MAP = {
  '/': 'home', '/home': 'home', 'home': 'home',
  '/vault': 'vault', 'vault': 'vault',
  '/beats': 'beats', 'beats': 'beats',
  '/beat': 'beat', 'beat': 'beat',
  '/cart': 'cart', 'cart': 'cart',
  '/licence': 'cart', 'licence': 'cart',
  '/licence/success': 'success', 'licence/success': 'success',
  '/licence/cancel': 'cancel', 'licence/cancel': 'cancel',
  '/licence/vault': 'vault-private', 'licence/vault': 'vault-private',
  '/checkout': 'cart', 'checkout': 'cart',
  '/arsenal': 'arsenal', 'arsenal': 'arsenal',
  '/cc': 'cc', 'cc': 'cc',
};

export const Router = {
  init() {
    window.addEventListener('hashchange', () => this.resolve());
    document.body.addEventListener('click', (e) => {
      const a = e.target.closest('a[data-link], a[href^="/"], a[href^="#/"]');
      if (!a) return;
      const href = a.getAttribute('href');
      if (!href) return;
      if (href.startsWith('http')) return;
      if (href.startsWith('mailto:') || href.startsWith('tel:')) return;
      e.preventDefault();
      const clean = href.replace(/^#\/?/, '').replace(/^\//, '').replace(/\/$/, '').split('?')[0].split('#')[0];
      window.location.hash = clean || 'home';
    });
    this.resolve();
  },
  async resolve() {
    let rawFull = (window.location.hash || '').replace(/^#\/?/, '');
    let raw = rawFull.split('?')[0].replace(/\/$/, '');
    if (!raw || raw === 'index.html' || raw === 'public' || raw === '/') raw = 'home';
    const path = '/' + raw.replace(/^\/+/, '').toLowerCase();
    console.log('%c ROUTING -> ' + path + ' | full=' + rawFull, 'background:#FF1E3C;color:white;padding:2px 8px;border-radius:4px');
    const view = document.getElementById('app-view');
    if (!view) return;

    if (path.startsWith('/cc')) {
      try {
        const { mountCC } = await import('../features/controlCenter/cc-router-v2.js');
        await mountCC(path, view);
      } catch (err) {
        view.innerHTML = `<div style="padding:40px;color:#FF4D6D">CC Error: ${err.message}</div>`;
      }
      return;
    }

    view.innerHTML = `<div style="padding:40px;color:#9CA3AF;font-family:system-ui;background:radial-gradient(ellipse at top,#0A1931 0%,#050A14 70%);min-height:60vh">Loading ${path}...</div>`;

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
          return;
        }
        if (path === '/licence/success' || path.startsWith('/licence/success')) {
          const m = await import('../features/licence/success-v2.js');
          view.innerHTML = m.render();
          if (m.init) await m.init();
          window.scrollTo(0,0);
          return;
        }
        if (path === '/licence/cancel' || path.startsWith('/licence/cancel')) {
          const m = await import('../features/licence/cancel-v2.js');
          view.innerHTML = m.render();
          if (m.init) await m.init();
          window.scrollTo(0,0);
          return;
        }
        if (path === '/licence/vault' || path.startsWith('/licence/vault') || path === '/vault-private') {
          try {
            const m = await import('../features/licence/vault-private-v2.js');
            view.innerHTML = m.render();
            if (m.init) await m.init();
          } catch {
            const m = await import('../features/licence/vault-private.js');
            view.innerHTML = m.render();
            if (m.init) await m.init();
          }
          window.scrollTo(0,0);
          return;
        }
        // CART - KEEPS YOUR V8 MODAL - NO checkout.js 404 ANYMORE
        if (path === '/cart' || path === '/licence' || path === '/checkout') {
          const cartMod = await import('../features/cart/cart.js');
          view.innerHTML = await cartMod.renderCart();
          if (cartMod.initCart) await cartMod.initCart();
          // ONLY paypal-v2 - does not try to load cart/checkout.js or licence/checkout.js
          try {
            const paypalV2 = await import('../features/licence/checkout-paypal-v2.js');
            if (paypalV2.setupCheckout) paypalV2.setupCheckout();
          } catch (e) { console.log('paypal-v2 load error', e.message); }
          window.scrollTo(0,0);
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
        if (path === '/arsenal') {
          const m = await import('../pages/arsenal-page.js');
          view.innerHTML = m.renderArsenalPage();
          if (m.initArsenalPage) await m.initArsenalPage();
          return;
        }
        view.innerHTML = `<div style="min-height:60vh;display:flex;flex-direction:column;align-items:center;justify-content:center;background:#050A14;color:#fff;padding:40px"><h1 style="font-family:Orbitron;color:#FF1E3C">404</h1><p>${path} not found</p></div>`;
      } catch (err) {
        console.error('Render error', path, err);
        view.innerHTML = `<div style="padding:40px;color:#FF4D6D;background:#0A1931"><h3>Error in ${path}</h3><p>${err.message}</p></div>`;
      }
    }, 60);
  }
};

export function renderRoute(path) {
  if (path) {
    const clean = String(path).replace(/^#\/?/, '').replace(/^\//, '').split('?')[0].split('#')[0];
    window.location.hash = clean || 'home';
  } else Router.resolve();
}
export function navigate(path) { renderRoute(path); }
export function initRouter() { return Router.init(); }
window.navigate = navigate;
window.navigateTo = navigate;
window.renderRoute = renderRoute;
window.Router = Router;
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => Router.init(), { once: true });
} else Router.init();
