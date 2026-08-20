export function initTopbar(){
  const el = document.getElementById('topbar');
  if(!el) return;

   document.getElementById('sidebar-overlay')?.removeAttribute('style');
  document.getElementById('sidebar-overlay')?.classList.remove('active');
  document.getElementById('navOverlay')?.classList.remove('active');
  document.getElementById('navPanel')?.classList.remove('active');
  document.getElementById('main-row')?.classList.remove('sidebar-open');
  document.body.classList.remove('panel-open','menu-open','sidebar-drawer-open');


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



  .nav-icon-btn.cart-desktop{
      width:40px; height:40px; border-radius:12px; position:relative;
      background:linear-gradient(180deg, rgba(255,255,255,0.08), rgba(255,255,255,0.03));
      border:1px solid rgba(255,255,255,0.12); display:grid; place-items:center; cursor:pointer;
    }
   .avatar-btn{
      width:40px; height:40px; border-radius:50%; padding:0; overflow:hidden; position:relative;
      border:2px solid transparent;
      background:linear-gradient(#0A1931,#0A1931) padding-box, linear-gradient(135deg,#FF1E3C,#60B5FF) border-box;
      cursor:pointer; box-shadow:0 4px 16px rgba(0,0,0,0.5);
    }
   
   .avatar-btn:hover::after{ opacity:1; }
   .cart-count{
      position:absolute; top:-6px; right:-6px; min-width:19px; height:19px;
      background:#FF1E3C; color:#fff; font-size:10px; font-weight:900;
      border-radius:999px; display:grid; place-items:center; border:1.5px solid #0A1931;
    }
    /* PRO DROPDOWN */
    #userPanel{
      position:absolute; top:58px; right:0; width:300px; z-index:9999;
      background:linear-gradient(180deg, rgba(15,36,70,0.97), rgba(5,10,20,0.98));
      backdrop-filter:blur(20px); border:1px solid rgba(255,255,255,0.12);
      border-radius:18px; padding:12px; box-shadow:0 20px 60px rgba(0,0,0,.7);
      opacity:0; transform:translateY(-8px) scale(.98); pointer-events:none; transition:.25s;
    }
    #userPanel.active{ opacity:1; transform:none; pointer-events:auto; }
    #userPanel button,#userPanel a{
      width:100%; padding:11px 12px; border-radius:12px; border:1px solid transparent;
      background:rgba(255,255,255,.05); color:#E5E7EB; display:flex; gap:10px; cursor:pointer; margin-bottom:6px;
    }
    #userPanel button:hover{ background:rgba(255,255,255,.1); color:#fff; }

    body #sidebar-overlay#sidebar-overlay{ z-index:44!important; }
body #sidebar-overlay.active{ z-index:44!important; }
body #left-sidebar#left-sidebar{ z-index:50!important; }
body #left-sidebar.open{ z-index:50!important; }


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
  <a href="#/beats" data-route="beats">Beats</a>
  <a href="#/vault?tab=samples" data-route="vault?tab=samples">Samples</a>
  <a href="#/vault?tab=packs" data-route="vault?tab=packs">Packs</a>
  <a href="#/vault?tab=free" data-route="vault?tab=free">Free Tools</a>
</nav>


    </div>

       <div class="top-center" style="position:relative;">
      <!-- TRAP CHROME PASSWORD MANAGER -->
      <input type="text" style="display:none!important" autocomplete="username">
      <input type="password" style="display:none!important" autocomplete="new-password">

      <input id="globalSearch"
        type="search"
        name="dt-beats-search-xyz"
        autocomplete="dt-do-not-autofill"
        data-form-type="search"
        data-lpignore="true"
        data-1p-ignore="true"
        data-bwignore="true"
        readonly
        onfocus="this.removeAttribute('readonly')"
        spellcheck="false"
        placeholder="Search beats..." />

      <div id="searchPanel" style="display:none; position:absolute; top:44px; left:0; right:0; width:320px; background:linear-gradient(180deg,#0F2446 0%,#050A14 100%); border:1px solid rgba(255,255,255,0.12); border-radius:14px; padding:8px; z-index:99999; box-shadow:0 20px 60px rgba(0,0,0,0.8); backdrop-filter:blur(20px);">
        <div style="font-size:10px; letter-spacing:1.5px; color:#6B7280; padding:6px 8px; font-weight:700;">RECENT SEARCHES</div>
        <div id="recentList"></div>
        <div style="height:1px; background:rgba(255,255,255,0.08); margin:8px 0;"></div>
        <div style="font-size:10px; letter-spacing:1.5px; color:#6B7280; padding:6px 8px; font-weight:700;">SUGGESTED</div>
        <div id="suggestList"></div>
      </div>
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
      <a href="#/beats" data-route="beats">Beats</a>
<a href="#/vault?tab=samples" data-route="vault?tab=samples">Samples</a>
<a href="#/vault?tab=packs" data-route="vault?tab=packs">Packs</a>
<a href="#/vault?tab=free" data-route="vault?tab=free">Free Tools</a>


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
    document.body.appendChild(overlayShell);
  } else {
    overlayShell.removeAttribute('style');
  }

  const closeMobileDrawer = () => {
    left?.classList.remove('open');
    overlayShell?.classList.remove('active');
    mainRow?.classList.remove('sidebar-open');
    document.body.classList.remove('sidebar-drawer-open');
  };
  const openMobileDrawer = () => {
    left?.classList.add('open');
    overlayShell?.classList.add('active');
    mainRow?.classList.add('sidebar-open');
    document.body.classList.add('sidebar-drawer-open');
  };


    document.getElementById('leftToggle').onclick = () => {
    if(window.innerWidth <= 1024){
      if(left.classList.contains('open')) closeMobileDrawer();
      else openMobileDrawer();
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

    overlayShell.onclick = closeMobileDrawer;



  const navOverlay = document.getElementById('navOverlay');
const navPanel = document.getElementById('navPanel');
const menuToggle = document.getElementById('menuToggle');
const panelClose = document.getElementById('panelCloseBtn');
const openNav = () => { navPanel?.classList.add('active'); navOverlay?.classList.add('active'); document.body.classList.add('panel-open'); document.getElementById('userPanel')?.classList.remove('active'); };
const closeNav = () => { navPanel?.classList.remove('active'); navOverlay?.classList.remove('active'); document.body.classList.remove('panel-open'); };
if(menuToggle) menuToggle.onclick = openNav;
if(panelClose) panelClose.onclick = closeNav;
if(navOverlay) navOverlay.onclick = closeNav;

const getAuth = () => window.Auth;
document.getElementById('loginBtn').onclick = (e) => { e.preventDefault(); e.stopPropagation(); getAuth()?.openModal(false); };
document.getElementById('signupBtn').onclick = (e) => { e.preventDefault(); e.stopPropagation(); getAuth()?.openModal(true); };

// AVATAR ONLY
document.getElementById('accountBtn').onclick = (e) => {
  e.preventDefault(); e.stopPropagation(); closeNav();
  document.getElementById('userPanel')?.classList.toggle('active');
};
// CART ONLY
document.getElementById('cartBtn').onclick = (e) => {
  e.preventDefault(); e.stopPropagation();
  document.getElementById('userPanel')?.classList.remove('active'); closeNav();
  location.hash = '#/cart';
};
document.getElementById('mobileCartBtn').onclick = (e) => {
  e.preventDefault(); e.stopPropagation();
  document.getElementById('userPanel')?.classList.remove('active'); closeNav();
  location.hash = '#/cart';
};
document.getElementById('mobileProfileBtn').onclick = (e) => {
  e.preventDefault(); e.stopPropagation(); closeNav();
  const isGuest = document.getElementById('authGuest')?.style.display!== 'none';
  if(isGuest) getAuth()?.openModal(false);
  else setTimeout(()=>document.getElementById('userPanel')?.classList.add('active'), 250);
};
// close on outside click
document.addEventListener('click', (e)=>{
  const p=document.getElementById('userPanel'), a=document.getElementById('accountBtn'), c=document.getElementById('cartBtn');
  if(p &&!p.contains(e.target) &&!a.contains(e.target) &&!c?.contains(e.target)) p.classList.remove('active');
});


   const searchInput = document.getElementById('globalSearch');
  const searchPanel = document.getElementById('searchPanel');
  const recentList = document.getElementById('recentList');
  const suggestList = document.getElementById('suggestList');

  if(searchInput){
    let hasNavigated = false;

    // KILL EMAIL AUTOFILL ON LOAD
    searchInput.value = '';
    if(searchInput.value.includes('@')) searchInput.value = '';

    const getRecents = () => {
      try{ return JSON.parse(localStorage.getItem('dt_recent_searches')||'[]'); }catch{ return []; }
    };
    const saveRecent = (term) => {
      if(!term || term.includes('@') || term.length < 2) return;
      let recents = getRecents().filter(t => t.toLowerCase()!== term.toLowerCase());
      recents.unshift(term);
      recents = recents.slice(0,2);
      localStorage.setItem('dt_recent_searches', JSON.stringify(recents));
    };

    const renderPanel = () => {
      const recents = getRecents();
      const beats = window.__BEATS__ || [];
      const genres = [...new Set(beats.map(b=>b.genre).filter(Boolean))].slice(0,1);
      const moods = [...new Set(beats.map(b=>b.mood).filter(Boolean))].slice(0,1);

      recentList.innerHTML = recents.length? recents.map(r=>`
        <button class="search-suggest-btn" data-term="${r.replace(/"/g,'&quot;')}" style="width:100%; text-align:left; padding:8px 10px; border-radius:8px; border:0; background:transparent; color:#E5E7EB; cursor:pointer; font-size:12px;">🕘 ${r}</button>
      `).join('') : `<div style="padding:6px 10px; color:#6B7280; font-size:11px;">No recent searches</div>`;

      suggestList.innerHTML = `
        ${genres.map(g=>`<button class="search-suggest-btn" data-term="${g}" style="width:100%; text-align:left; padding:8px 10px; border-radius:8px; border:0; background:transparent; color:#9CA3AF; cursor:pointer; font-size:12px;">🎧 ${g}</button>`).join('')}
        ${moods.map(m=>`<button class="search-suggest-btn" data-term="${m}" style="width:100%; text-align:left; padding:8px 10px; border-radius:8px; border:0; background:transparent; color:#9CA3AF; cursor:pointer; font-size:12px;">💿 ${m}</button>`).join('')}
        <button class="search-suggest-btn" data-term="140 BPM" style="width:100%; text-align:left; padding:8px 10px; border-radius:8px; border:0; background:transparent; color:#9CA3AF; cursor:pointer; font-size:12px;">⏱ 140 BPM</button>
      `;

      recentList.querySelectorAll('.search-suggest-btn').forEach(b=> b.onclick = () => pickSuggest(b.dataset.term));
      suggestList.querySelectorAll('.search-suggest-btn').forEach(b=> b.onclick = () => pickSuggest(b.dataset.term));
    };

    const pickSuggest = (term) => {
      searchInput.value = term;
      doSearch({target: searchInput});
      searchPanel.style.display = 'none';
    };

    const doSearch = (e) => {
      const raw = e.target.value.trim();
      if(raw.includes('@')){ e.target.value=''; return; } // BLOCK EMAIL
      const q = raw.toLowerCase();

      if(q.length > 0 &&!hasNavigated){
        hasNavigated = true;
        if(!location.hash.includes('beats')){
          location.hash = '#/beats';
        }
      }
      if(q.length === 0) hasNavigated = false;

      localStorage.setItem('dt_last_search', raw);
      if(q.length >= 2) saveRecent(raw);

      const searchObj = {
        query: q,
        raw: raw,
        bpm: (q.match(/(\d{2,3})\s*bpm/)?.[1] || q.match(/\b(\d{2,3})\b/)?.[1])? parseInt(q.match(/(\d{2,3})\s*bpm/)?.[1] || q.match(/\b(\d{2,3})\b/)?.[1]) : null,
        key: (raw.match(/\b([A-G][#b]?\s*(?:maj|min|minor|major|m)?)\b/i)?.[0] || '').toLowerCase()
      };

      window.dispatchEvent(new CustomEvent('search:query',{detail: searchObj}));
    };

    searchInput.addEventListener('input', doSearch);
    searchInput.addEventListener('focus', () => {
      if(searchInput.value.includes('@')) searchInput.value = '';
      renderPanel();
      searchPanel.style.display = 'block';
      if(searchInput.value.trim() &&!hasNavigated){
        if(!location.hash.includes('beats')) location.hash = '#/beats';
      }
    });
       searchInput.addEventListener('blur', () => {
      setTimeout(()=> searchPanel.style.display = 'none', 180);
    });
    searchInput.addEventListener('keydown', (e) => {
      if(e.key === 'Enter'){
        e.preventDefault();
        searchPanel.style.display = 'none';
        searchInput.blur();
        doSearch({target: searchInput});
      }
    });

  }



   // SURGICAL HASH ROUTER FIX
  document.querySelectorAll('[data-route]').forEach(a => {
    a.addEventListener('click', (e) => {
      e.preventDefault();
      const route = a.getAttribute('data-route');
      const hash = route === '/'? '#/' : `#/${route.replace(/^\//,'')}`;
      location.hash = hash;
      closeNav();
    });
  });


   const checkMobile = () => {
    const rb = document.getElementById('rightToggle');
    if(rb) rb.style.display = window.innerWidth <= 1024? 'none' : 'flex';
    if(window.innerWidth > 1024){
      closeMobileDrawer();
      document.getElementById('navPanel')?.classList.remove('active');
      document.getElementById('navOverlay')?.classList.remove('active');
      document.body.classList.remove('panel-open');
    }
  };

  checkMobile();
  window.addEventListener('resize', checkMobile);

   function setActiveLink(){
    const cur = (location.hash.replace('#/','')||'/').split('?')[0];
    document.querySelectorAll('.nav-links-v2 a').forEach(link=>{
      link.classList.toggle('active', link.dataset.route===cur || (cur===''&&link.dataset.route==='/'));
    });
  }
  window.addEventListener('hashchange', setActiveLink);
  setActiveLink();


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

     // === SURGICAL FIX - TURN LOGIN TO AVATAR ===
  const refreshTopbarAuth = () => {
    const raw = localStorage.getItem('dopetone_user');
    const user = raw? JSON.parse(raw) : null;
    const guest = document.getElementById('authGuest');
    const userArea = document.getElementById('authUser');
    if(!guest ||!userArea) return;
    if(user){
      guest.style.display = 'none';
      userArea.style.display = 'flex';
      const av = user.avatar || 'public/images/default-user.png';
      const name = user.username || user.email.split('@')[0];
      const el1 = document.getElementById('userAvatar');
      const el2 = document.getElementById('mobileProfileAvatar');
      const el3 = document.getElementById('mobileProfileName');
      const el4 = document.getElementById('mobileProfileSub');
      if(el1) el1.src = av;
      if(el2) el2.src = av;
      if(el3) el3.textContent = name;
      if(el4) el4.textContent = user.email;

           // === CC BUTTON LOGIC - ADMIN ONLY ===
      const ccBtn = document.getElementById('controlCenterBtn');
      if(ccBtn){
        const isAdmin = (user.email||'').toLowerCase() === 'dopetone701@gmail.com' || user.role === 'admin';
        ccBtn.style.display = isAdmin? 'flex' : 'none';
        ccBtn.onclick = (e)=>{
          e.preventDefault();
          e.stopPropagation();
          if(!isAdmin){ alert('Admin only'); return; }
          document.getElementById('userPanel')?.classList.remove('active');
          document.getElementById('navPanel')?.classList.remove('active');
          document.getElementById('navOverlay')?.classList.remove('active');
          document.body.classList.remove('panel-open');
          location.hash = '#/cc/overview';
        };
      }

      // update cart
      try{
        const uid = localStorage.getItem('dopetone_user_id');
        const cart = JSON.parse(localStorage.getItem(uid? `dopetone_cart_${uid}` : 'dopetone_cart') || localStorage.getItem('dopetone_cart') || '[]');
        document.querySelectorAll('.cart-count').forEach(c=>{
          c.textContent = cart.length;
          c.style.display = cart.length>0? 'flex' : 'none';
        });
      }catch{}
    } else {
      guest.style.display = 'flex';
      userArea.style.display = 'none';
    }

     // avatar editable
  const avInput=document.createElement('input'); avInput.type='file'; avInput.accept='image/*'; avInput.style.display='none'; document.body.appendChild(avInput);
  document.getElementById('accountBtn')?.addEventListener('dblclick',()=>avInput.click());
  avInput.onchange=()=>{
    const f=avInput.files[0]; if(!f) return;
    const r=new FileReader(); r.onload=e=>{
      const b64=e.target.result;
      document.getElementById('userAvatar').src=b64;
      const u=JSON.parse(localStorage.getItem('dopetone_user')||'{}'); u.avatar=b64;
      localStorage.setItem('dopetone_user',JSON.stringify(u));
    }; r.readAsDataURL(f);
  };

  };

  // Run now + on every auth change
  refreshTopbarAuth();
  window.addEventListener('storage', refreshTopbarAuth);
  window.addEventListener('auth:changed', refreshTopbarAuth);
  window.addEventListener('cartUpdated', refreshTopbarAuth);
  setInterval(refreshTopbarAuth, 1000); // fallback watcher

  // Override global setAuthState to also use this
  window.setAuthState = (logged, u) => {
    refreshTopbarAuth();
  };

  };
}


 document.querySelectorAll('[data-route]').forEach(a => {
    a.addEventListener('click', (e) => {
      e.preventDefault();
      const route = a.getAttribute('data-route');
      location.hash = route.startsWith('vault') ? `#/${route}` : `#/${route}`;
      document.getElementById('navPanel')?.classList.remove('active');
      document.getElementById('navOverlay')?.classList.remove('active');
      document.body.classList.remove('panel-open');
    });
  });

