export function initLeft(){
  const el = document.getElementById('left-sidebar');
  if(!el) return;

  el.innerHTML = `
  <style>
    #left-sidebar{ transition: width.32s cubic-bezier(.16,1,.3,1); }
    #left-sidebar.collapsed{ width:72px!important; }
    #left-sidebar.collapsed.hide-when-collapsed{ display:none!important; }
    #left-sidebar.collapsed.sidebar-inner{ padding:20px 8px 16px 8px!important; align-items:center; }
    #left-sidebar.collapsed #left-nav-list{ width:100%; align-items:center; }
    #left-sidebar.collapsed.nav{ justify-content:center; padding:12px!important; gap:0!important; width:48px; height:48px; }
    #left-sidebar.collapsed.nav.label{ display:none; }
    #left-sidebar.collapsed.left-head{ justify-content:center!important; padding:0 8px!important; }
    #left-sidebar.collapsed.left-head > div:first-child{ flex:0!important; }
    #left-sidebar.collapsed #nav-selector{ left:4px!important; right:4px!important; }
  </style>
  <div class="left-inner" style="display:flex;flex-direction:column;height:100%;background:linear-gradient(180deg, #0F2446 0%, #0A1931 70%, #050A14 100%);">
    <div class="left-head" style="height:68px;display:flex;align-items:center;justify-content:space-between;padding:0 16px;border-bottom:1px solid rgba(255,255,255,0.08);flex-shrink:0;background:linear-gradient(180deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%);">
      <div style="display:flex;align-items:center;gap:12px;overflow:hidden;flex:1;min-width:0">
        <div style="width:40px;height:40px;border-radius:12px;background:linear-gradient(180deg, #0F2446 0%, #0A1931 60%, #050A14 100%);border:1px solid rgba(229,231,235,0.15);display:grid;place-items:center;box-shadow:inset 0 1px 0 rgba(255,255,255,0.15), 0 4px 16px rgba(0,0,0,0.5), 0 0 24px rgba(30,144,255,0.12);flex-shrink:0;overflow:hidden;position:relative">
          <img src="public/images/logo.png" alt="DT" style="width:88%;height:88%;object-fit:contain;filter:drop-shadow(0 2px 8px rgba(0,0,0,0.8));position:relative;z-index:1" onerror="this.onerror=null;this.src='images/logo.png'">
          <div style="position:absolute;inset:0;background:radial-gradient(ellipse at 30% 20%, rgba(255,255,255,0.15) 0%, transparent 60%);pointer-events:none"></div>
        </div>
        <div class="hide-when-collapsed" style="overflow:hidden">
          <div style="font-weight:900;font-size:13px;letter-spacing:1.2px;line-height:1;color:#FFFFFF;white-space:nowrap">DOPE TONE</div>
          <div style="font-size:9px;letter-spacing:2.2px;color:#9CA3AF;font-weight:700;white-space:nowrap;margin-top:2px">VAULT • STUDIO</div>
        </div>
      </div>
      <button class="collapse-btn left-collapse-btn" style="width:28px;height:28px;border-radius:8px;border:1px solid rgba(229,231,235,0.12);background:linear-gradient(180deg, rgba(255,255,255,0.08), rgba(255,255,255,0.03));color:#E5E7EB;display:grid;place-items:center;cursor:pointer;flex-shrink:0;box-shadow:inset 0 1px 0 rgba(255,255,255,0.12), 0 2px 8px rgba(0,0,0,0.3);margin-left:12px">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 18l-6-6 6-6"/></svg>
      </button>
    </div>

    <div class="sidebar-inner" style="flex:1;overflow-y:auto;overflow-x:hidden;padding:28px 10px 16px 10px;display:flex;flex-direction:column;gap:24px">
      <div style="width:100%">
        <div class="hide-when-collapsed" style="font-size:10px;letter-spacing:1.6px;color:rgba(229,231,235,0.45);font-weight:700;padding:0 12px 12px 12px;">MENU</div>
        <nav id="left-nav-list" style="display:flex;flex-direction:column;gap:6px;position:relative;margin-top:4px">
          <div id="nav-selector" style="position:absolute;left:0;right:0;top:0;height:46px;background:linear-gradient(90deg, rgba(255,30,60,0.18) 0%, rgba(255,30,60,0.06) 100%);border:1px solid rgba(255,30,60,0.25);border-radius:12px;transition:transform.35s cubic-bezier(.16,1,.3,1), height.2s ease;pointer-events:none;z-index:0;box-shadow:inset 0 1px 0 rgba(255,255,255,0.1), 0 0 24px rgba(255,30,60,0.18)"></div>
          <div id="nav-selector-bar" style="position:absolute;left:0;top:0;width:3px;height:24px;background:#FF1E3C;border-radius:0 3px 3px 0;box-shadow:0 0 12px #FF1E3C, 0 0 24px rgba(255,30,60,0.5);transition:transform.35s cubic-bezier(.16,1,.3,1);pointer-events:none;z-index:1"></div>

          <a class="nav active" href="/" data-link data-route="/" style="display:flex;align-items:center;gap:14px;padding:12px 14px;border-radius:12px;color:#FFFFFF;text-decoration:none;position:relative;z-index:2;border:1px solid transparent">
            <span style="width:22px;height:22px;display:grid;place-items:center;flex-shrink:0"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="1.8"><path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1V9.5z"/></svg></span>
            <span class="label hide-when-collapsed" style="font-size:13.5px;font-weight:600">Home</span>
          </a>
          <a class="nav" href="/beats" data-link data-route="/beats" style="display:flex;align-items:center;gap:14px;padding:12px 14px;border-radius:12px;color:#9CA3AF;text-decoration:none;position:relative;z-index:2;border:1px solid transparent"><span style="width:22px;height:22px;display:grid;place-items:center"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg></span><span class="label hide-when-collapsed" style="font-size:13.5px">Beats Arsenal</span></a>
          <a class="nav" href="/vault" data-link data-route="/vault" style="display:flex;align-items:center;gap:14px;padding:12px 14px;border-radius:12px;color:#9CA3AF;text-decoration:none;position:relative;z-index:2;border:1px solid transparent"><span style="width:22px;height:22px;display:grid;place-items:center"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg></span><span class="label hide-when-collapsed" style="font-size:13.5px">Vault</span></a>
          <a class="nav" href="/playlists" data-link data-route="/playlists" style="display:flex;align-items:center;gap:14px;padding:12px 14px;border-radius:12px;color:#9CA3AF;text-decoration:none;position:relative;z-index:2;border:1px solid transparent"><span style="width:22px;height:22px;display:grid;place-items:center"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg></span><span class="label hide-when-collapsed" style="font-size:13.5px">Playlists</span></a>
          <a class="nav" href="/licence" data-link data-route="/licence" style="display:flex;align-items:center;gap:14px;padding:12px 14px;border-radius:12px;color:#9CA3AF;text-decoration:none;position:relative;z-index:2;border:1px solid transparent"><span style="width:22px;height:22px;display:grid;place-items:center"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg></span><span class="label hide-when-collapsed" style="font-size:13.5px">Licence</span></a>
        </nav>
      </div>
      <div class="hide-when-collapsed" style="width:100%">
        <div style="font-size:10px;letter-spacing:1.5px;color:rgba(255,255,255,0.35);font-weight:700;padding:0 12px 10px 12px;">STUDIO</div>
        <div style="background:linear-gradient(180deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%);border:1px solid rgba(229,231,235,0.08);border-radius:14px;padding:14px;position:relative;overflow:hidden;box-shadow:inset 0 1px 0 rgba(255,255,255,0.08), 0 8px 24px rgba(0,0,0,0.4)"><div style="position:absolute;top:-30px;right:-20px;width:100px;height:100px;background:radial-gradient(circle, rgba(255,30,60,0.18) 0%, rgba(30,144,255,0.12) 40%, transparent 70%);pointer-events:none"></div><div style="font-size:12px;font-weight:800;color:#FFFFFF;margin-bottom:4px;position:relative">Producer Plan</div><div style="font-size:11px;color:#9CA3AF;margin-bottom:12px;position:relative">Unlimited WAV + Stems</div><div style="height:4px;background:#050A14;border-radius:10px;overflow:hidden;box-shadow:inset 0 1px 3px rgba(0,0,0,0.6);border:1px solid rgba(255,255,255,0.06)"><div style="width:72%;height:100%;background:linear-gradient(90deg, #8B0000 0%, #FF1E3C 50%, #FF6B6B 100%);box-shadow:0 0 12px rgba(255,30,60,0.5)"></div></div></div>
      </div>
    </div>

    <div style="padding:12px;border-top:1px solid rgba(255,255,255,0.08);display:flex;align-items:center;gap:12px;flex-shrink:0;background:linear-gradient(180deg, rgba(255,255,255,0.02), rgba(0,0,0,0.2))" class="hide-when-collapsed">
      <div style="width:34px;height:34px;border-radius:50%;background:linear-gradient(180deg, #60B5FF 0%, #1E90FF 50%, #0A1931 100%);border:1px solid rgba(229,231,235,0.18);display:grid;place-items:center;color:white;font-weight:800;font-size:12px;box-shadow:inset 0 1px 0 rgba(255,255,255,0.25), 0 4px 12px rgba(0,0,0,0.4)">E</div>
      <div style="overflow:hidden;flex:1"><div style="font-size:12px;font-weight:700;color:#FFFFFF;white-space:nowrap">Emma Prince</div><div style="font-size:10px;color:#9CA3AF">Pro • 124 beats</div></div>
    </div>
  </div>`;

  var selector = el.querySelector('#nav-selector');
  var bar = el.querySelector('#nav-selector-bar');
  var navs = el.querySelectorAll('.nav');

  function moveTo(activeEl){
    if(!activeEl ||!selector ||!bar) return;
    var top = activeEl.offsetTop;
    var h = activeEl.offsetHeight;
    var barH = 24;
    selector.style.height = h + 'px';
    selector.style.transform = 'translateY('+ top +'px)';
    bar.style.transform = 'translateY('+ (top + (h - barH) / 2) +'px)';
    for(var k=0;k<navs.length;k++){
      navs[k].style.color='#9CA3AF';
      navs[k].style.fontWeight='500';
      var svg = navs[k].querySelector('svg');
      if(svg) svg.setAttribute('stroke', '#9CA3AF');
    }
    activeEl.style.color='#FFFFFF';
    activeEl.style.fontWeight='700';
    var activeSvg = activeEl.querySelector('svg');
    if(activeSvg) activeSvg.setAttribute('stroke', 'white');
  }

  var active = el.querySelector('.nav.active');
  if(active) moveTo(active);

  for(var j=0;j<navs.length;j++){
    (function(n){
      n.addEventListener('click', function(e){
        e.preventDefault();
        const path = n.getAttribute('data-route') || n.getAttribute('href');
        for(var k=0;k<navs.length;k++) navs[k].classList.remove('active');
        n.classList.add('active');
        moveTo(n);
        window.history.pushState({}, '', path);
        window.dispatchEvent(new CustomEvent('route:change',{detail:path}));
        if(window.innerWidth <= 1024){
          el.classList.remove('open');
          const ov = document.getElementById('sidebar-overlay');
          if(ov){ ov.style.opacity='0'; ov.style.pointerEvents='none'; }
          document.getElementById('main-row')?.classList.remove('sidebar-open');
        }
      });
    })(navs[j]);
  }

  window.addEventListener('resize', function(){
    var a = el.querySelector('.nav.active');
    if(a) moveTo(a);
  });

  var btn = el.querySelector('.left-collapse-btn');
  var iconLeft = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 18l-6-6 6-6"/></svg>';
  var iconRight = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18l6-6-6-6"/></svg>';

  if(btn){
    // restore state
    const isCollapsed = localStorage.getItem('dt_left') === 'true';
    if(isCollapsed && window.innerWidth > 1024) el.classList.add('collapsed');
    btn.innerHTML = el.classList.contains('collapsed')? iconRight : iconLeft;
    const head = el.querySelector('.left-head');
    if(head) head.style.justifyContent = el.classList.contains('collapsed')? 'center' : 'space-between';

    btn.onclick = function(){
      var collapsed = el.classList.toggle('collapsed');
      btn.innerHTML = collapsed? iconRight : iconLeft;
      var head = el.querySelector('.left-head');
      if(head) head.style.justifyContent = collapsed? 'center' : 'space-between';
      document.dispatchEvent(new CustomEvent('leftCollapsed', {detail: collapsed}));
      localStorage.setItem('dt_left', collapsed);
      setTimeout(function(){
        var a = el.querySelector('.nav.active');
        if(a) moveTo(a);
      }, 310);
    };
  }

  window.addEventListener('popstate', () => {
    const path = window.location.pathname;
    navs.forEach(n => {
      const route = n.getAttribute('data-route');
      if(route === path){ n.classList.add('active'); moveTo(n); }
      else n.classList.remove('active');
    });
  });
}
