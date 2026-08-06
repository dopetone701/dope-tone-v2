export async function renderRoute(path='/'){
  const view = document.getElementById('app-view');
  if(!view) return;
  const clean = (path.split('?')[0] || '/').toLowerCase();

  if(clean === '/' || clean === '/index.html' || clean === '/home' || clean === ''){
    try{
      // HOME IS IN PAGES - NOT FEATURES
      const { renderHome, initHome } = await import('../pages/home.js');
      view.innerHTML = renderHome();
      if(initHome) await initHome();
      console.log('[ROUTER] HOME from pages/ loaded');
    }catch(e){
      console.error('home.js error', e);
      view.innerHTML = `<div style="padding:30px;color:#fff">HOME ERROR: ${e.message}<pre style="font-size:10px;color:#888">${e.stack}</pre></div>`;
    }
    return;
  }

  if(clean.startsWith('/beats')){
    const mod = await import('../features/home/arsenal.js');
    view.innerHTML = mod.renderBeatsArsenal();
    if(mod.initBeatsArsenal) mod.initBeatsArsenal();
    if(mod.renderWave) setTimeout(()=>mod.renderWave(100), 50);
    return;
  }

  if(clean.startsWith('/cart')){
    const mod = await import('../features/cart/cart.js');
    view.innerHTML = await mod.renderCart();
    if(mod.initCart) mod.initCart();
    return;
  }

  view.innerHTML = `<div style='padding:40px'><h1>${clean}</h1></div>`;
}

export function navigate(p){ history.pushState({}, '', p); renderRoute(p); }
window.navigateTo = navigate;
window.renderRoute = renderRoute;
window.addEventListener('popstate', ()=> renderRoute(location.pathname));
