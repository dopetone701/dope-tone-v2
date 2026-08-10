// ===============================
// 🚀 / DOPE TONE ROUTER V3.1 - VAULT ADDED - REFRESH FIXED
// FIX: Cannot GET /beats on 5500 + Vault route
// DNA: Deep Void #050A14, Vault Navy #0A1931, Dope Red #FF1E3C glow 0 0 20px rgba(255,30,60,0.5)
// ===============================

const IS_LIVE_SERVER = location.port === "5500" || location.protocol === "file:" || location.hostname === "127.0.0.1";

// EMERGENCY FIX: If you are on /beats or /beat, redirect to /#/beats instantly
(function fixLiveServerPath(){
  if(!IS_LIVE_SERVER) return;
  const path = location.pathname;
  if(path !== "/" && path !== "/index.html" && path !== "/index.html/"){
    const newHash = path + location.hash.replace(/^#/, "");
    history.replaceState(null, "", "/#" + newHash.replace(/^\/+/, "/"));
  }
  if(location.hash.includes("#/")){
    const cleaned = location.hash.replace(/#\/+/g, "#/").replace(/^#\/#\//, "#/").replace(/^##/, "#");
    if(cleaned !== location.hash){
      history.replaceState(null, "", location.pathname + cleaned);
    }
  }
})();

function getPath(){
  if(IS_LIVE_SERVER){
    let h = location.hash || "#/";
    h = h.replace(/^#/, "");
    h = h.replace(/#\/+/g, "/");
    h = h.replace(/\/+/g, "/");
    if(!h.startsWith("/")) h = "/" + h;
    return h;
  }
  return location.pathname + location.search;
}

export async function renderRoute(path) {
  const view = document.getElementById('app-view');
  if (!view) return;

  if(!path) path = getPath();

  if(path.includes("#/")){
    path = path.substring(path.indexOf("#/")+1);
    if(!path.startsWith("/")) path = "/" + path;
  }

  const [cleanRaw, queryString] = path.split("?");
  const clean = (cleanRaw || '/').toLowerCase().replace(/\/+$/, '') || '/';

  // HOME
  if (clean === '/' || clean === '/index.html' || clean === '/home') {
    try {
      const { renderHome, initHome } = await import('../pages/home.js');
      view.innerHTML = renderHome();
      if (typeof initHome === 'function') await initHome();
    } catch (e) {
      view.innerHTML = `<div class="route-error"><h2>Home failed</h2><p>${e.message}</p></div>`;
    }
    return;
  }

  // VAULT - NEW DNA LOCKED HUB
  if(clean === '/vault' || clean === '/vault/' ){
    try {
      const mod = await import('../pages/vault-page.js');
      view.innerHTML = mod.renderVaultPage();
      if(mod.initVaultPage) await mod.initVaultPage();
      window.scrollTo(0,0);
      console.log('[ROUTER V3.1] VAULT DNA');
    } catch(e) {
      console.error(e);
      view.innerHTML = `<div style="padding:40px;color:#fff"><h2>VAULT ERROR</h2><p>${e.message}</p><pre style="font-size:12px;color:#9CA3AF">${e.stack||''}</pre></div>`;
    }
    return;
  }

  // BEAT PAGE - GLOBAL - /beat?id=123
  if(clean === '/beat'){
    try {
      const mod = await import('../pages/beat-page.js');
      view.innerHTML = mod.renderBeatPage();
      if(mod.initBeatPage) await mod.initBeatPage();
      window.scrollTo(0,0);
      console.log('[ROUTER V3] BEAT PAGE');
    } catch(e) {
      console.error(e);
      view.innerHTML = `<div style="padding:40px;color:#fff"><h2>BEAT ERROR</h2><p>${e.message}</p><pre style="font-size:12px;color:#888">${e.stack||''}</pre></div>`;
    }
    return;
  }

  // BEATS VAULT
  if(clean.startsWith('/beats')){
    try {
      const mod = await import('../features/beats/beats.js');
      view.innerHTML = mod.renderBeatsPage();
      if(mod.initBeatsPage) await mod.initBeatsPage();
      console.log('[ROUTER V3] BEATS');
    } catch(e) {
      console.error(e);
      view.innerHTML = `<div style="padding:40px;color:#fff"><h2>BEATS ERROR</h2><p>${e.message}</p></div>`;
    }
    return;
  }

  // CART
  if (clean === '/cart') {
    try {
      const mod = await import('../features/cart/cart.js');
      view.innerHTML = await mod.renderCart();
      if (mod.initCart) await mod.initCart();
    } catch (e) {
      view.innerHTML = `<div class="route-error"><h2>Cart failed</h2></div>`;
    }
    return;
  }

  // 404
  view.innerHTML = `
    <div style="padding:80px 20px;text-align:center;color:#fff;background:radial-gradient(ellipse at top, #0A1931 0%, #050A14 70%);min-height:60vh">
      <h2 style="font-family:Orbitron;color:#FF1E3C">404 - Not Found</h2>
      <p style="color:#9CA3AF">${clean}</p>
      <a href="javascript:void(0)" onclick="navigate('/')" style="color:#FF1E3C">Back Home</a>
      <br/><br/>
      <a href="javascript:void(0)" onclick="navigate('/vault')" style="color:#1E90FF">Go to Vault</a>
    </div>`;
}

export function navigate(path) {
  if (!path) path = '/';
  if(!path.startsWith("/")) path = "/" + path;

  if(IS_LIVE_SERVER){
    const newHash = "#" + path;
    if(location.hash === newHash){
      renderRoute(path);
    } else {
      location.hash = newHash;
    }
    return;
  }

  history.pushState({}, '', path);
  renderRoute(path);
}

window.navigateTo = navigate;
window.renderRoute = renderRoute;
window.navigate = navigate;

// EVENTS
window.addEventListener('popstate', () => {
  renderRoute(getPath());
});

window.addEventListener('hashchange', () => {
  renderRoute(getPath());
});

// Intercept ALL #/ links
document.addEventListener('click', e => {
  const link = e.target.closest('a[href^="#/"], a[href^="/beats"], a[href^="/beat"], a[href^="/"], a[href^="/vault"]');
  if (!link) return;
  let href = link.getAttribute('href');
  if(!href) return;
  if(href.startsWith("http")) return;
 
  e.preventDefault();
  if(href.startsWith("#/")) href = href.substring(1);
  navigate(href);
});

// INIT
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => renderRoute(getPath()), { once: true });
} else {
  renderRoute(getPath());
}
