export function initTopbar(){
  const el = document.getElementById('topbar');
  if(!el) return;

  document.getElementById('sidebar-overlay')?.classList.remove('active');
  document.getElementById('navOverlay')?.classList.remove('active');
  document.getElementById('navPanel')?.classList.remove('active');
  document.getElementById('main-row')?.classList.remove('sidebar-open');
  document.body.classList.remove('panel-open','menu-open');

  el.innerHTML = `
  <style>
    #topbar{
      position:relative; height:68px;
      background:linear-gradient(180deg, #0F2446 0%, #0A1931 100%);
      border-bottom:1px solid rgba(255,255,255,0.1);
      backdrop-filter:blur(14px); display:flex; align-items:center; z-index:1000; flex-shrink:0;
      box-shadow:inset 0 1px 0 rgba(255,255,255,0.08), 0 10px 40px rgba(0,0,0,0.6);
    }
    #topbar::after{
      content:""; position:absolute; left:0; right:0; bottom:0; height:2px;
      background:linear-gradient(90deg, #0A1931 0%, #FF1E3C 50%, #60B5FF 100%);
      opacity:0.8;
    }
    .top-inner{ width:100%; height:100%; padding:0 14px 0 16px; display:flex; align-items:center; gap:20px; }

    .top-left{ display:flex; align-items:center; gap:14px; flex-shrink:0; }
    .left-toggle{
      width:36px; height:36px; border-radius:10px;
      background:linear-gradient(180deg, rgba(255,255,255,0.08), rgba(255,255,255,0.03));
      border:1px solid rgba(255,255,255,0.1);
      color:#E5E7EB; cursor:pointer; display:grid; place-items:center;
      box-shadow:inset 0 1px 0 rgba(255,255,255,0.1), 0 4px 12px rgba(0,0,0,0.3);
    }

    /* LOGO - PRO STUDIO 3D - NAVY BG */
    .logo-v2{ display:flex; align-items:center; gap:12px; text-decoration:none; flex-shrink:0; }
    .logo-v2 .mark{
      width:42px; height:42px; border-radius:12px;
      background:linear-gradient(180deg, #0F2446 0%, #0A1931 60%, #050A14 100%);
      border:1px solid rgba(229,231,235,0.15);
      display:grid; place-items:center;
      box-shadow:
        inset 0 1px 0 rgba(255,255,255,0.15),
        inset 0 -1px 0 rgba(0,0,0,0.8),
        0 4px 16px rgba(0,0,0,0.5),
        0 0 0 1px rgba(10,25,49,0.8),
        0 0 24px rgba(30,144,255,0.12);
      overflow:hidden; position:relative;
    }
    .logo-v2 .mark::after{
      content:""; position:absolute; inset:0;
      background:radial-gradient(ellipse at 30% 20%, rgba(255,255,255,0.15) 0%, transparent 60%);
      pointer-events:none;
    }
    .logo-v2 .mark img{
      width:86%; height:86%; object-fit:contain;
      filter:drop-shadow(0 2px 8px rgba(0,0,0,0.8)) drop-shadow(0 0 12px rgba(30,144,255,0.3));
      position:relative; z-index:1;
    }
    .logo-v2 .text{ line-height:1; }
    .logo-v2 .text b{
      display:block; font-size:13.5px; font-weight:900; letter-spacing:1.3px; color:#FFFFFF;
      text-shadow:0 1px 0 rgba(0,0,0,0.8), 0 0 20px rgba(255,255,255,0.15);
    }
    .logo-v2 .text b span{ 
      background:linear-gradient(180deg, #8B0000 0%, #FF1E3C 50%, #FF6B6B 100%);
      -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text;
    }
    .logo-v2 .text i{
      display:block; font-style:normal; font-size:9px; letter-spacing:2.2px;
      color:#9CA3AF; font-weight:700; margin-top:2px;
    }

    /* LINKS SEPARATED FROM SEARCH */
    .nav-links-v2{ display:flex; gap:6px; align-items:center; flex-shrink:0; margin-left:6px; }
    .nav-links-v2 a{
      color:#9CA3AF; text-decoration:none; font-size:12.5px; font-weight:600; letter-spacing:0.3px;
      padding:7px 12px; border-radius:10px; transition:all .25s;
      border:1px solid transparent;
      background:transparent;
    }
    .nav-links-v2 a:hover{
      color:#FFFFFF; background:linear-gradient(180deg, rgba(255,255,255,0.08), rgba(255,255,255,0.03));
      border-color:rgba(255,255,255,0.1); box-shadow:inset 0 1px 0 rgba(255,255,255,0.1);
    }

    /* SEARCH SMALLER - PRO INSET */
    .top-center{ flex:0 1 260px; display:flex; justify-content:center; margin-left:auto; }
    #globalSearch{
      width:100%; max-width:260px; height:36px;
      background:linear-gradient(180deg, #050A14 0%, #0A1931 100%);
      border:1px solid rgba(255,255,255,0.1);
      border-radius:999px; padding:0 14px 0 36px; color:#FFFFFF; outline:none;
      font-family:Poppins; font-size:12px;
      box-shadow:inset 0 2px 8px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.06);
      background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='14' height='14' fill='none' stroke='%239CA3AF' stroke-width='1.8' viewBox='0 0 24 24'%3E%3Ccircle cx='11' cy='11' r='6'/%3E%3Cpath d='m21 21-4.3-4.3'/%3E%3C/svg%3E");
      background-repeat:no-repeat; background-position:12px center;
    }
    #globalSearch::placeholder{ color:#6B7280; }
    #globalSearch:focus{
      border-color:rgba(255,30,60,0.4);
      box-shadow:inset 0 2px 8px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,30,60,0.15), 0 0 20px rgba(255,30,60,0.15);
    }

    .auth-buttons{ display:flex; align-items:center; gap:10px; flex-shrink:0; }
    .btn-login{
      padding:7px 14px; border-radius:999px; font-size:11.5px; cursor:pointer;
      background:linear-gradient(180deg, rgba(255,255,255,0.08), rgba(255,255,255,0.03));
      color:#E5E7EB; border:1px solid rgba(255,255,255,0.1); font-weight:600;
      box-shadow:inset 0 1px 0 rgba(255,255,255,0.1);
    }
    .btn-signup{
      padding:7px 16px; border-radius:999px; font-size:11.5px; cursor:pointer; border:none;
      background:#FF1E3C; color:#FFFFFF; font-weight:800; letter-spacing:0.3px;
      box-shadow:0 0 20px rgba(255,30,60,0.5), inset 0 1px 0 rgba(255,255,255,0.2);
    }

    .nav-icon-btn{
      width:36px; height:36px; border-radius:10px;
      border:1px solid rgba(255,255,255,0.08);
      background:linear-gradient(180deg, rgba(255,255,255,0.08), rgba(255,255,255,0.03));
      color:#E5E7EB; cursor:pointer; display:flex; align-items:center; justify-content:center; position:relative;
      box-shadow:inset 0 1px 0 rgba(255,255,255,0.08), 0 4px 12px rgba(0,0,0,0.3);
    }
    .avatar-btn{
      width:36px; height:36px; border-radius:50%; padding:0; overflow:hidden;
      border:1px solid rgba(229,231,235,0.15); background:linear-gradient(180deg,#0F2446,#0A1931);
      cursor:pointer; box-shadow:0 4px 12px rgba(0,0,0,0.4);
    }
    .avatar-btn img{ width:100%; height:100%; object-fit:cover; }
    .cart-count{
      position:absolute; top:-5px; right:-5px; min-width:18px; height:18px; padding:0 4px; border-radius:999px;
      background:#FF1E3C; color:#fff; font-size:10px; font-weight:800; display:flex; align-items:center; justify-content:center;
      box-shadow:0 0 12px rgba(255,30,60,0.6); border:1px solid rgba(255,255,255,0.2);
    }

    /* QUEUE PREMIUM - NO YELLOW - STUDIO PRO 3D */
    .right-toggle-btn{
      height:36px; padding:0 16px; border-radius:999px;
      background:linear-gradient(180deg, #0F2446 0%, #0A1931 100%);
      border:1px solid rgba(229,231,235,0.18);
      color:#FFFFFF; cursor:pointer; font-weight:800; font-size:11px; letter-spacing:1.2px;
      display:flex; align-items:center; gap:8px;
      box-shadow:
        inset 0 1px 0 rgba(255,255,255,0.15),
        inset 0 -1px 0 rgba(0,0,0,0.6),
        0 4px 16px rgba(0,0,0,0.5),
        0 0 0 1px rgba(255,30,60,0.2);
      position:relative; overflow:hidden;
      transition:all .25s;
    }
    .right-toggle-btn::before{
      content:""; position:absolute; left:0; top:0; bottom:0; width:3px;
      background:linear-gradient(180deg, #070b0f 0%, #01070e 50%, #FF1E3C 100%);
      box-shadow:0 0 12px #FF1E3C;
    }
    .right-toggle-btn::after{
      content:""; position:absolute; inset:0;
      background:radial-gradient(ellipse at 30% 0%, rgba(255,255,255,0.12) 0%, transparent 60%);
      pointer-events:none;
    }
    .right-toggle-btn:hover{
      border-color:rgba(255,30,60,0.4);
      box-shadow:inset 0 1px 0 rgba(255,255,255,0.15), 0 6px 20px rgba(0,0,0,0.6), 0 0 24px rgba(255,30,60,0.3);
      transform:translateY(-1px);
    }
    .right-toggle-btn .dot{
      width:7px; height:7px; border-radius:50%;
      background:#FF1E3C; box-shadow:0 0 10px #FF1E3C, 0 0 20px rgba(255,30,60,0.5);
      animation:pulse 2s infinite; flex-shrink:0;
    }
    @keyframes pulse{ 0%,100%{opacity:1; transform:scale(1)} 50%{opacity:0.7; transform:scale(0.9)} }

    .menu-toggle{ display:none; } .mobile-cart{ display:none; }

    #navOverlay.overlay{ position:fixed; inset:0; z-index:9998; background:rgba(5,10,20,0.75); backdrop-filter:blur(8px); opacity:0; pointer-events:none; transition:opacity .3s; }
    #navOverlay.overlay.active{ opacity:1; pointer-events:auto; }
    #navPanel.mobile-panel{ position:fixed; top:0; right:0; z-index:9999; width:min(340px,88vw); height:100dvh; background:linear-gradient(180deg,#0F2446 0%,#050A14 100%); border-left:1px solid rgba(255,255,255,0.08); transform:translateX(100%); transition:transform .32s cubic-bezier(.16,1,.3,1); display:flex; flex-direction:column; align-items:center; padding:72px 24px 24px; gap:24px; overflow-y:auto; box-shadow:-20px 0 60px rgba(0,0,0,0.8); }
    #navPanel.mobile-panel.active{ transform:translateX(0); }
    .panel-close{ position:absolute; top:16px; right:16px; width:36px; height:36px; border-radius:10px; border:1px solid rgba(255,255,255,.1); background:rgba(255,255,255,.06); color:#E5E7EB; font-size:18px; cursor:pointer; display:grid; place-items:center; }
    .panel-logo{ width:80px; height:80px; object-fit:contain; filter:drop-shadow(0 0 20px rgba(255,30,60,0.4)) drop-shadow(0 4px 12px rgba(0,0,0,0.6)); }
    .panel-links{ display:flex; flex-direction:column; gap:18px; width:100%; align-items:center; padding-top:10px; }
    .panel-links a{ color:#9CA3AF; text-decoration:none; font-size:14px; font-weight:600; } .panel-links a:hover{ color:#FFFFFF; }
    .panel-profile{ margin-top:auto; padding-top:20px; border-top:1px solid rgba(255,255,255,.08); width:100%; }
    .panel-profile button{ background:linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0.03)); border:1px solid rgba(255,255,255,0.08); border-radius:14px; color:#fff; cursor:pointer; width:100%; display:flex; align-items:center; gap:12px; padding:12px 14px; text-align:left; box-shadow:inset 0 1px 0 rgba(255,255,255,0.08); }
    .panel-profile img{ width:42px; height:42px; border-radius:50%; object-fit:cover; border:1px solid rgba(229,231,235,0.2); }
    .panel-profile-text strong{ font-size:13px; font-weight:700; display:block; } .panel-profile-text span{ font-size:11px; color:#9CA3AF; }

    @media(max-width:1150px){ .nav-links-v2{ display:none!important; } .top-center{ flex:0 1 200px; max-width:200px; } }
    @media(max-width:768px){ .top-center, .auth-guest, .cart-desktop, .right-toggle-btn{ display:none!important; } .menu-toggle, .mobile-cart{ display:flex!important; } }


    @media(max-width:768px){
  #topbar{ height:56px!important; }
  #topbar .top-inner{
    padding:0 12px!important;
    gap:10px!important;
    justify-content:space-between!important;
  }
  /* hide desktop stuff */
  #topbar .nav-links-v2,
  #topbar .top-center,
  #topbar .auth-guest,
  #topbar .cart-desktop,
  #topbar #rightToggle.right-toggle-btn{
    display:none!important;
  }
  /* left side */
  #topbar .top-left{
    gap:10px!important;
    flex:1!important;
    min-width:0!important;
  }
  #topbar #leftToggle.left-toggle{
    width:36px!important; height:36px!important;
    display:grid!important;
    flex-shrink:0!important;
  }
  #topbar .logo-v2{
    gap:8px!important;
  }
  #topbar .logo-v2 .mark{
    width:36px!important; height:36px!important;
    border-radius:10px!important;
  }
  #topbar .logo-v2 .text b{
    font-size:11px!important;
    letter-spacing:0.8px!important;
    line-height:1.1!important;
  }
  #topbar .logo-v2 .text i{
    font-size:7.5px!important;
    letter-spacing:1.6px!important;
  }
  /* right side - only cart + one hamburger */
  #topbar .auth-buttons{
    gap:8px!important;
    margin-left:auto!important;
  }
  #topbar #mobileCartBtn.mobile-cart{
    display:flex!important;
    width:36px!important; height:36px!important;
  }
  #topbar #menuToggle.menu-toggle{
    display:flex!important;
    width:36px!important; height:36px!important;
  }
  /* fix blurry text - remove double */
  #topbar .logo-v2 .text{
    display:block!important;
  }
}
@media(max-width:768px){
  #topbar .top-inner{ position:relative!important; justify-content:space-between!important; }
  
  /* center logo */
  #topbar .logo-v2{
    position:absolute!important;
    left:50%!important;
    transform:translateX(-50%)!important;
    gap:8px!important;
  }
  #topbar .logo-v2 .text i{ display:none!important; } /* remove VAULT • STUDIO */
  #topbar .logo-v2 .text b{ font-size:12px!important; letter-spacing:1px!important; }

  /* keep hamburger left, cart right */
  #topbar .top-left{ flex:0!important; }
  #topbar .auth-buttons{ margin-left:auto!important; }
}

  </style>

  <div class="top-inner">
    <div class="top-left">
      <button id="leftToggle" class="left-toggle">☰</button>
      <a href="/" class="logo-v2" data-link data-route="/">
        <div class="mark">
          <img src="public/images/logo.png" alt="DT" onerror="this.onerror=null;this.src='images/logo.png';this.onerror=function(){this.src='public/images/dt-boss-logo.png';this.onerror=function(){this.style.display='none'}}">
        </div>
        <div class="text">
          <b>DOPE TONE <span>VAULT</span></b>
          <i>VAULT • STUDIO</i>
        </div>
      </a>
      <nav class="nav-links-v2">
        <a href="#beats" data-route="/beats">Beats</a>
        <a href="#samples" data-route="/samples">Samples</a>
        <a href="#packs" data-route="/packs">Packs</a>
        <a href="#tools" data-route="/tools">Free Tools</a>
      </nav>
    </div>

    <div class="top-center">
      <input id="globalSearch" placeholder="Search beats..." />
    </div>

    <div class="auth-buttons">
      <button type="button" class="nav-icon-btn mobile-cart" id="mobileCartBtn">🛒<span class="cart-count" data-cart-count>0</span></button>
      <div class="auth-guest" id="authGuest" data-auth="guest-area" style="display:flex; gap:8px; align-items:center;">
        <button type="button" id="loginBtn" class="btn-login">Login</button>
        <button type="button" id="signupBtn" class="btn-signup">Sign Up</button>
      </div>
      <div class="auth-user" id="authUser" data-auth="user-area" style="display:none; align-items:center; gap:10px;">
        <button type="button" class="nav-icon-btn cart-desktop" id="cartBtn">🛒<span class="cart-count" data-cart-count>0</span></button>
        <button type="button" class="avatar-btn" id="accountBtn">
          <img id="userAvatar" src="public/images/default-user.png" alt="Account" onerror="this.onerror=null;this.src='images/default-user.png'">
        </button>
      </div>
      <button id="rightToggle" class="right-toggle-btn"><span class="dot"></span> QUEUE</button>
    </div>
  </div>

  <div class="overlay" id="navOverlay"></div>
  <div class="mobile-panel" id="navPanel">
    <button type="button" class="panel-close" id="panelCloseBtn">✕</button>
    <img src="public/images/logo.png" class="panel-logo" alt="Dope Tone" onerror="this.src='images/logo.png'">
    <nav class="panel-links">
      <a href="#beats" data-route="/beats">Beats</a>
      <a href="#samples" data-route="/samples">Samples</a>
      <a href="#packs" data-route="/packs">Packs</a>
      <a href="#tools" data-route="/tools">Free Tools</a>
      <a href="/beats" data-link data-route="/beats">All Beats</a>
      <div class="panel-profile">
        <button type="button" id="mobileProfileBtn">
          <img id="mobileProfileAvatar" src="public/images/default-user.png" alt="">
          <div class="panel-profile-text">
            <strong id="mobileProfileName">Guest</strong>
            <span id="mobileProfileSub">Tap to sign in</span>
          </div>
        </button>
      </div>
    </nav>
  </div>
  `;

  const left = document.getElementById('left-sidebar');
  const right = document.getElementById('right-sidebar');
  const mainRow = document.getElementById('main-row');
  let overlayShell = document.getElementById('sidebar-overlay');
  if(!overlayShell){
    overlayShell = document.createElement('div');
    overlayShell.id = 'sidebar-overlay';
    overlayShell.style.cssText = 'position:fixed;inset:0;z-index:900;background:rgba(5,10,20,0.6);backdrop-filter:blur(6px);opacity:0;pointer-events:none;transition:.3s;';
    document.body.appendChild(overlayShell);
  }

  document.getElementById('leftToggle').onclick = () => {
    if(window.innerWidth <= 1024){
      const isOpen = left.classList.toggle('open');
      overlayShell.style.opacity = isOpen ? '1' : '0';
      overlayShell.style.pointerEvents = isOpen ? 'auto' : 'none';
      mainRow?.classList.toggle('sidebar-open', isOpen);
    } else {
      left.classList.toggle('collapsed');
      localStorage.setItem('dt_left', left.classList.contains('collapsed'));
      window.dispatchEvent(new CustomEvent('leftCollapsed',{detail:left.classList.contains('collapsed')}));
    }
  };

  document.getElementById('rightToggle').onclick = () => {
    if(window.innerWidth > 1024 && right){
      right.classList.toggle('collapsed');
      localStorage.setItem('dt_right', right.classList.contains('collapsed'));
    }
  };

  overlayShell.onclick = () => {
    left.classList.remove('open');
    overlayShell.style.opacity = '0';
    overlayShell.style.pointerEvents = 'none';
    mainRow?.classList.remove('sidebar-open');
  };

  const navOverlay = document.getElementById('navOverlay');
  const navPanel = document.getElementById('navPanel');
  const menuToggle = document.getElementById('menuToggle');
  const panelClose = document.getElementById('panelCloseBtn');
  const openNav = () => { navPanel.classList.add('active'); navOverlay.classList.add('active'); document.body.classList.add('panel-open'); };
  const closeNav = () => { navPanel.classList.remove('active'); navOverlay.classList.remove('active'); document.body.classList.remove('panel-open'); };
  if(menuToggle) menuToggle.onclick = openNav;
  if(panelClose) panelClose.onclick = closeNav;
  if(navOverlay) navOverlay.onclick = closeNav;

  document.getElementById('loginBtn')?.addEventListener('click', () => window.dispatchEvent(new CustomEvent('auth:login')));
  document.getElementById('signupBtn')?.addEventListener('click', () => window.dispatchEvent(new CustomEvent('auth:signup')));
  document.getElementById('accountBtn')?.addEventListener('click', () => window.dispatchEvent(new CustomEvent('auth:account')));
  document.getElementById('mobileProfileBtn')?.addEventListener('click', () => { closeNav(); const isGuest = document.getElementById('authGuest').style.display !== 'none'; window.dispatchEvent(new CustomEvent(isGuest ? 'auth:login' : 'auth:account')); });
  document.getElementById('cartBtn')?.addEventListener('click', () => window.dispatchEvent(new CustomEvent('cart:open')));
  document.getElementById('mobileCartBtn')?.addEventListener('click', () => window.dispatchEvent(new CustomEvent('cart:open')));

  document.getElementById('globalSearch')?.addEventListener('input', e => {
    window.dispatchEvent(new CustomEvent('search:query',{detail:e.target.value.toLowerCase()}));
  });

  document.querySelectorAll('[data-route]').forEach(a => {
    a.addEventListener('click', (e) => {
      e.preventDefault();
      const path = a.getAttribute('data-route');
      window.history.pushState({}, '', path);
      window.dispatchEvent(new CustomEvent('route:change',{detail:path}));
      if(window.innerWidth <= 1024) closeNav();
    });
  });

  const checkMobile = () => {
    const rb = document.getElementById('rightToggle');
    if(rb) rb.style.display = window.innerWidth <= 1024 ? 'none' : 'flex';
    if(window.innerWidth > 1024){
      left.classList.remove('open');
      overlayShell.style.opacity = '0';
      overlayShell.style.pointerEvents = 'none';
      mainRow?.classList.remove('sidebar-open');
      closeNav();
    }
  };
  checkMobile();
  window.addEventListener('resize', checkMobile);

  if(localStorage.getItem('dt_left') === 'true' && window.innerWidth > 1024) left.classList.add('collapsed');
  if(localStorage.getItem('dt_right') === 'true' && right) right.classList.add('collapsed');

  window.setAuthState = (isLoggedIn, user) => {
    const guest = document.getElementById('authGuest');
    const userArea = document.getElementById('authUser');
    if(!guest || !userArea) return;
    guest.style.display = isLoggedIn ? 'none' : 'flex';
    userArea.style.display = isLoggedIn ? 'flex' : 'none';
    if(isLoggedIn && user){
      const av = document.getElementById('userAvatar');
      const mav = document.getElementById('mobileProfileAvatar');
      const mn = document.getElementById('mobileProfileName');
      const ms = document.getElementById('mobileProfileSub');
      if(av && user.avatar) av.src = user.avatar;
      if(mav && user.avatar) mav.src = user.avatar;
      if(mn) mn.textContent = user.name || 'User';
      if(ms) ms.textContent = user.sub || 'Pro Member';
    }
  };
}
