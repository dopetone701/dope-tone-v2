const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/vault-page-D-hWt5fE.js","assets/menu-armburger-_TdSpV46.js","assets/playlist-page-CCFdw2es.js","assets/license-help-DUnZdZNx.js","assets/licence-DE4FtziN.js"])))=>i.map(i=>d[i]);
var Kt=a=>{throw TypeError(a)};var zt=(a,t,e)=>t.has(a)||Kt("Cannot "+e);var n=(a,t,e)=>(zt(a,t,"read from private field"),e?e.call(a):t.get(a)),Z=(a,t,e)=>t.has(a)?Kt("Cannot add the same private member more than once"):t instanceof WeakSet?t.add(a):t.set(a,e),M=(a,t,e,o)=>(zt(a,t,"write to private field"),o?o.call(a,e):t.set(a,e),e),u=(a,t,e)=>(zt(a,t,"access private method"),e);(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))o(i);new MutationObserver(i=>{for(const r of i)if(r.type==="childList")for(const d of r.addedNodes)d.tagName==="LINK"&&d.rel==="modulepreload"&&o(d)}).observe(document,{childList:!0,subtree:!0});function e(i){const r={};return i.integrity&&(r.integrity=i.integrity),i.referrerPolicy&&(r.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?r.credentials="include":i.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function o(i){if(i.ep)return;i.ep=!0;const r=e(i);fetch(i.href,r)}})();const X={player:{current:null,queue:[],index:0,isPlaying:!1},beats:[],filteredBeats:[],loaded:!1,overview:{},set(a){Object.assign(this,a),window.dispatchEvent(new CustomEvent("store:change",{detail:a}))},setPlayer(a){Object.assign(this.player,a),window.dispatchEvent(new CustomEvent("player:change",{detail:this.player}))}};window.DTStore=X;window.store=X;const Ne="modulepreload",Ue=function(a){return"/"+a},te={},$=function(t,e,o){let i=Promise.resolve();if(e&&e.length>0){document.getElementsByTagName("link");const d=document.querySelector("meta[property=csp-nonce]"),p=(d==null?void 0:d.nonce)||(d==null?void 0:d.getAttribute("nonce"));i=Promise.allSettled(e.map(c=>{if(c=Ue(c),c in te)return;te[c]=!0;const h=c.endsWith(".css"),f=h?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${c}"]${f}`))return;const w=document.createElement("link");if(w.rel=h?"stylesheet":Ne,h||(w.as="script"),w.crossOrigin="",w.href=c,p&&w.setAttribute("nonce",p),document.head.appendChild(w),h)return new Promise((g,x)=>{w.addEventListener("load",g),w.addEventListener("error",()=>x(new Error(`Unable to preload CSS for ${c}`)))})}))}function r(d){const p=new Event("vite:preloadError",{cancelable:!0});if(p.payload=d,window.dispatchEvent(p),!p.defaultPrevented)throw d}return i.then(d=>{for(const p of d||[])p.status==="rejected"&&r(p.reason);return t().catch(r)})},Rt={init(){window.addEventListener("hashchange",()=>this.resolve()),document.body.addEventListener("click",a=>{const t=a.target.closest('a[data-link], a[href^="/"], a[href^="#/"]');if(!t)return;const e=t.getAttribute("href");if(!e||e.startsWith("http")||e.startsWith("mailto:")||e.startsWith("tel:"))return;a.preventDefault();const o=e.replace(/^#\/?/,"").replace(/^\//,"").replace(/\/$/,"").split("?")[0].split("#")[0];window.location.hash=o||"home"}),this.resolve()},async resolve(){let t=(window.location.hash||"").replace(/^#\/?/,"").split("?")[0].replace(/\/$/,"");(!t||t==="index.html"||t==="public"||t==="/")&&(t="home");const e="/"+t.replace(/^\/+/,"").toLowerCase();console.log("%c ROUTING -> "+e,"background:#FF1E3C;color:white;padding:2px 8px;border-radius:4px");const o=document.getElementById("app-view");if(o){if(e.startsWith("/cc")){try{const{mountCC:i}=await $(async()=>{const{mountCC:r}=await import("./cc-router-v2-CWmNNBPY.js");return{mountCC:r}},[]);await i(e,o)}catch(i){console.error("CC error",i),o.innerHTML=`<div style="padding:40px;color:#FF4D6D;background:#0A1931">CC Error: ${i.message}<pre style="font-size:11px">${i.stack||""}</pre></div>`}return}o.innerHTML=`<div style="padding:40px;color:#9CA3AF;font-family:system-ui;background:radial-gradient(ellipse at top,#0A1931 0%,#050A14 70%);min-height:60vh">Loading ${e}...</div>`,setTimeout(async()=>{try{if(e==="/"||e==="/home"){const{renderHome:i,initHome:r}=await $(async()=>{const{renderHome:d,initHome:p}=await import("./home-BadYY8Bg.js");return{renderHome:d,initHome:p}},[]);o.innerHTML=i(),r&&await r();return}if(e==="/vault"){const i=await $(()=>import("./vault-page-D-hWt5fE.js"),__vite__mapDeps([0,1]));o.innerHTML=i.renderVaultPage(),i.initVaultPage&&await i.initVaultPage();return}if(e==="/licence/success"||e.startsWith("/licence/success")){const i=await $(()=>import("./success-v2-0uvsqpe2.js"),[]);o.innerHTML=i.render(),i.init&&await i.init(),window.scrollTo(0,0);return}if(e==="/licence/cancel"||e.startsWith("/licence/cancel")){const i=await $(()=>import("./cancel-v2-eqjGg3BI.js"),[]);o.innerHTML=i.render(),i.init&&await i.init(),window.scrollTo(0,0);return}if(e==="/licence/vault"||e.startsWith("/licence/vault")||e==="/vault-private"){const i=await $(()=>import("./vault-private-Dow-tGuV.js"),[]);o.innerHTML=i.render(),i.init&&await i.init(),window.scrollTo(0,0);return}if(e==="/cart"||e==="/licence"||e==="/checkout"){const i=await $(()=>import("./cart-Bg2gmjaZ.js"),[]);o.innerHTML=await i.renderCart(),i.initCart&&await i.initCart();try{const r=await $(()=>import("./checkout-paypal-v2-iHEAoieI.js"),[]);r.setupCheckout&&r.setupCheckout()}catch{}window.scrollTo(0,0);return}if(e==="/beats"||e.startsWith("/beats/")){const i=await $(()=>import("./beats-BggrnDy-.js"),[]);o.innerHTML=i.renderBeatsPage(),i.initBeatsPage&&await i.initBeatsPage();return}if(e==="/beat"){const i=await $(()=>import("./beat-page-CdCDDAZD.js"),[]);o.innerHTML=i.renderBeatPage(),i.initBeatPage&&await i.initBeatPage();return}if(e==="/playlists"||e==="/playlist"){const i=await $(()=>import("./playlist-page-CCFdw2es.js"),__vite__mapDeps([2,1]));o.innerHTML=i.renderPlaylistPage(),i.initPlaylistPage&&await i.initPlaylistPage();return}if(e==="/arsenal"){const i=await $(()=>import("./arsenal-Dtq-3bJu.js"),[]);o.innerHTML=i.renderBeatsArsenal?i.renderBeatsArsenal():i.renderArsenal?i.renderArsenal():"<div>Arsenal</div>",i.initBeatsArsenal&&await i.initBeatsArsenal(),i.initArsenal&&await i.initArsenal(),window.scrollTo(0,0);return}if(e==="/about"||e==="/dt-about"){const i=await $(()=>import("./dt-about-C_jLVnp9.js"),[]);o.innerHTML=i.renderDtAbout?i.renderDtAbout():i.render?i.render():"",i.initDtAbout&&await i.initDtAbout(),i.init&&await i.init(),window.scrollTo(0,0);return}if(e==="/help"||e==="/terms"||e==="/privacy"){const i=await $(()=>import("./help-page-BKpNFTmx.js"),[]);o.innerHTML=i.renderHelp?i.renderHelp():i.render?i.render():"",i.initHelp&&await i.initHelp(),i.init&&await i.init(),setTimeout(()=>{var r,d;e==="/terms"&&((r=document.getElementById("termsSection"))==null||r.scrollIntoView({behavior:"smooth"})),e==="/privacy"&&((d=document.getElementById("privacySection"))==null||d.scrollIntoView({behavior:"smooth"}))},300),window.scrollTo(0,0);return}if(e==="/faq"){const i=await $(()=>import("./faq-CR5JC4wa.js"),[]);o.innerHTML=i.renderFaq?i.renderFaq():i.render?i.render():"",i.initFaq&&await i.initFaq(),i.init&&await i.init(),window.scrollTo(0,0);return}if(e==="/license"||e==="/license-help"||e==="/licence-help"){try{const i=await $(()=>import("./license-help-DUnZdZNx.js"),__vite__mapDeps([3,4]));o.innerHTML=i.render?i.render():"",i.init&&await i.init()}catch{const i=await $(()=>import("./licence-DE4FtziN.js"),[]);o.innerHTML=i.renderLicence?i.renderLicence():i.render?i.render():"",i.initLicence&&await i.initLicence(),i.init&&await i.init()}window.scrollTo(0,0);return}if(e==="/tickets"){const i=await $(()=>import("./tickets-19F68z4X.js"),[]);o.innerHTML=i.renderTickets?i.renderTickets():i.render?i.render():"",i.initTickets&&await i.initTickets(),i.init&&await i.init(),window.scrollTo(0,0);return}if(e==="/checkout-info"){o.innerHTML='<div style="min-height:60vh;display:flex;flex-direction:column;align-items:center;justify-content:center;background:#050A14;color:#fff;padding:40px"><h1 style="font-family:Orbitron;color:#FF1E3C">CHECKOUT INFO</h1><p style="color:#6B7280;margin-top:10px">Coming Soon</p></div>';return}o.innerHTML=`<div style="min-height:60vh;display:flex;flex-direction:column;align-items:center;justify-content:center;background:#050A14;color:#fff;padding:40px"><h1 style="font-family:Orbitron;color:#FF1E3C">404</h1><p>${e} not found</p></div>`}catch(i){console.error("Render error",e,i),o.innerHTML=`<div style="padding:40px;color:#FF4D6D;background:#0A1931"><h3>Error in ${e}</h3><p>${i.message}</p><pre style="font-size:11px;opacity:.7">${i.stack||""}</pre></div>`}},60)}}};function he(a){if(a){const t=String(a).replace(/^#\/?/,"").replace(/^\//,"").split("?")[0].split("#")[0];window.location.hash=t||"home"}else Rt.resolve()}function ge(a){he(a)}window.navigate=ge;window.navigateTo=ge;window.renderRoute=he;window.Router=Rt;document.readyState==="loading"?document.addEventListener("DOMContentLoaded",()=>Rt.init(),{once:!0}):Rt.init();const qe="https://api.dopetonevault.com",me="https://dopetone-stats.dopetone701.workers.dev",ze="https://track-price-api.dopetone701.workers.dev";function Ve(a,t){if((t==null?void 0:t.price)!=null){const o=Number(t.price);return o>100?o/100:o}if(a==null)return 29.99;const e=Number(a);return isNaN(e)?29.99:e>100?e/100:e}async function $e(){try{const[a,t,e]=await Promise.all([fetch(`${qe}/api/beats`),fetch(`${me}/api/stats/top`).catch(()=>({json:()=>[]})),fetch(`${ze}/api/monetization/all`).catch(()=>({json:()=>[]}))]);if(!a.ok)throw new Error("Failed to fetch beats");const o=await a.json();let i={};try{const d=await t.json();Array.isArray(d)&&d.forEach(p=>{i[p.id]=p})}catch{}let r={};try{const d=await e.json();Array.isArray(d)&&d.forEach(p=>{r[String(p.id)]={mode:(p.monetization_mode||"paid").toLowerCase(),price:p.price}})}catch{}return o.map(d=>{var w,g,x;const p=r[String(d.id)],c=d.monetization_mode||"paid",h=p?p.mode:c.toLowerCase(),f=h==="free_tagged"||h==="tagged"?"hybrid":h;return{id:String(d.id),title:d.title,genre:d.genre||"Trap",bpm:d.bpm||140,cover:d.cover_url,cover_url:d.cover_url,mp3_url:d.mp3_url,audio:d.mp3_url,price:Ve(d.price,p),monetization_mode:f,is_free:f==="free"?1:0,has_free_tagged:f==="hybrid"?1:0,play_count:((w=i[d.id])==null?void 0:w.play_count)||d.play_count||0,download_count:((g=i[d.id])==null?void 0:g.download_count)||0,like_count:((x=i[d.id])==null?void 0:x.like_count)||0,created_at:d.created_at}})}catch(a){return console.warn("Using mock beats - workers offline",a),[{id:"1",title:"Midnight Vault",genre:"Trap",bpm:140,cover_url:"https://picsum.photos/seed/1/300",mp3_url:"https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",price:29.99,monetization_mode:"paid",play_count:1200,created_at:new Date().toISOString()},{id:"2",title:"Dope Red",genre:"Drill",bpm:144,cover_url:"https://picsum.photos/seed/2/300",mp3_url:"https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",price:0,is_free:1,monetization_mode:"free",play_count:800,created_at:new Date().toISOString()},{id:"3",title:"Navy Dreams",genre:"R&B",bpm:92,cover_url:"https://picsum.photos/seed/3/300",mp3_url:"https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",price:49.99,monetization_mode:"paid",play_count:600,created_at:new Date().toISOString()},{id:"4",title:"Chrome Heart",genre:"Afro",bpm:110,cover_url:"https://picsum.photos/seed/4/300",mp3_url:"https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",price:29.99,monetization_mode:"hybrid",play_count:400,created_at:new Date().toISOString()},{id:"5",title:"Deep Void",genre:"Trap",bpm:150,cover_url:"https://picsum.photos/seed/5/300",mp3_url:"https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",price:19.99,monetization_mode:"paid",play_count:300,created_at:new Date().toISOString()}]}}async function je(){try{const t=await(await fetch(`${me}/api/stats/global?range=day`)).json();return{totalPlays:t.totalPlays||0,totalLikes:t.totalLikes||0}}catch{return{totalPlays:0,totalLikes:0}}}function He(){var Y,E,m,F,J;const a=document.getElementById("topbar");if(!a)return;(Y=document.getElementById("sidebar-overlay"))==null||Y.removeAttribute("style"),(E=document.getElementById("sidebar-overlay"))==null||E.classList.remove("active"),(m=document.getElementById("navOverlay"))==null||m.classList.remove("active"),(F=document.getElementById("navPanel"))==null||F.classList.remove("active"),(J=document.getElementById("main-row"))==null||J.classList.remove("sidebar-open"),document.body.classList.remove("panel-open","menu-open","sidebar-drawer-open"),a.innerHTML=`
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
  `;const t=document.getElementById("left-sidebar"),e=document.getElementById("right-sidebar"),o=document.getElementById("main-row");let i=document.getElementById("sidebar-overlay");i?i.removeAttribute("style"):(i=document.createElement("div"),i.id="sidebar-overlay",document.body.appendChild(i));const r=()=>{t==null||t.classList.remove("open"),i==null||i.classList.remove("active"),o==null||o.classList.remove("sidebar-open"),document.body.classList.remove("sidebar-drawer-open")},d=()=>{t==null||t.classList.add("open"),i==null||i.classList.add("active"),o==null||o.classList.add("sidebar-open"),document.body.classList.add("sidebar-drawer-open")};document.getElementById("leftToggle").onclick=()=>{window.innerWidth<=1024?t.classList.contains("open")?r():d():(t.classList.toggle("collapsed"),localStorage.setItem("dt_left",t.classList.contains("collapsed")),window.dispatchEvent(new CustomEvent("leftCollapsed",{detail:t.classList.contains("collapsed")})))},document.getElementById("rightToggle").onclick=()=>{window.innerWidth>1024&&e&&(e.classList.toggle("collapsed"),localStorage.setItem("dt_right",e.classList.contains("collapsed")))},i.onclick=r;const p=document.getElementById("navOverlay"),c=document.getElementById("navPanel"),h=document.getElementById("menuToggle"),f=document.getElementById("panelCloseBtn"),w=()=>{var y;c==null||c.classList.add("active"),p==null||p.classList.add("active"),document.body.classList.add("panel-open"),(y=document.getElementById("userPanel"))==null||y.classList.remove("active")},g=()=>{c==null||c.classList.remove("active"),p==null||p.classList.remove("active"),document.body.classList.remove("panel-open")};h&&(h.onclick=w),f&&(f.onclick=g),p&&(p.onclick=g);const x=()=>window.Auth;document.getElementById("loginBtn").onclick=y=>{var b;y.preventDefault(),y.stopPropagation(),(b=x())==null||b.openModal(!1)},document.getElementById("signupBtn").onclick=y=>{var b;y.preventDefault(),y.stopPropagation(),(b=x())==null||b.openModal(!0)},document.getElementById("accountBtn").onclick=y=>{var b;y.preventDefault(),y.stopPropagation(),g(),(b=document.getElementById("userPanel"))==null||b.classList.toggle("active")},document.getElementById("cartBtn").onclick=y=>{var b;y.preventDefault(),y.stopPropagation(),(b=document.getElementById("userPanel"))==null||b.classList.remove("active"),g(),location.hash="#/cart"},document.getElementById("mobileCartBtn").onclick=y=>{var b;y.preventDefault(),y.stopPropagation(),(b=document.getElementById("userPanel"))==null||b.classList.remove("active"),g(),location.hash="#/cart"},document.getElementById("mobileProfileBtn").onclick=y=>{var S,R;y.preventDefault(),y.stopPropagation(),g(),((S=document.getElementById("authGuest"))==null?void 0:S.style.display)!=="none"?(R=x())==null||R.openModal(!1):setTimeout(()=>{var O;return(O=document.getElementById("userPanel"))==null?void 0:O.classList.add("active")},250)},document.addEventListener("click",y=>{const b=document.getElementById("userPanel"),S=document.getElementById("accountBtn"),R=document.getElementById("cartBtn");b&&!b.contains(y.target)&&!S.contains(y.target)&&!(R!=null&&R.contains(y.target))&&b.classList.remove("active")});const v=document.getElementById("globalSearch"),I=document.getElementById("searchPanel"),L=document.getElementById("recentList"),z=document.getElementById("suggestList");if(v){let y=!1;v.value="",v.value.includes("@")&&(v.value="");const b=()=>{try{return JSON.parse(localStorage.getItem("dt_recent_searches")||"[]")}catch{return[]}},S=A=>{if(!A||A.includes("@")||A.length<2)return;let P=b().filter(N=>N.toLowerCase()!==A.toLowerCase());P.unshift(A),P=P.slice(0,2),localStorage.setItem("dt_recent_searches",JSON.stringify(P))},R=()=>{const A=b(),P=window.__BEATS__||[],N=[...new Set(P.map(D=>D.genre).filter(Boolean))].slice(0,1),Q=[...new Set(P.map(D=>D.mood).filter(Boolean))].slice(0,1);L.innerHTML=A.length?A.map(D=>`
        <button class="search-suggest-btn" data-term="${D.replace(/"/g,"&quot;")}" style="width:100%; text-align:left; padding:8px 10px; border-radius:8px; border:0; background:transparent; color:#E5E7EB; cursor:pointer; font-size:12px;">🕘 ${D}</button>
      `).join(""):'<div style="padding:6px 10px; color:#6B7280; font-size:11px;">No recent searches</div>',z.innerHTML=`
        ${N.map(D=>`<button class="search-suggest-btn" data-term="${D}" style="width:100%; text-align:left; padding:8px 10px; border-radius:8px; border:0; background:transparent; color:#9CA3AF; cursor:pointer; font-size:12px;">🎧 ${D}</button>`).join("")}
        ${Q.map(D=>`<button class="search-suggest-btn" data-term="${D}" style="width:100%; text-align:left; padding:8px 10px; border-radius:8px; border:0; background:transparent; color:#9CA3AF; cursor:pointer; font-size:12px;">💿 ${D}</button>`).join("")}
        <button class="search-suggest-btn" data-term="140 BPM" style="width:100%; text-align:left; padding:8px 10px; border-radius:8px; border:0; background:transparent; color:#9CA3AF; cursor:pointer; font-size:12px;">⏱ 140 BPM</button>
      `,L.querySelectorAll(".search-suggest-btn").forEach(D=>D.onclick=()=>O(D.dataset.term)),z.querySelectorAll(".search-suggest-btn").forEach(D=>D.onclick=()=>O(D.dataset.term))},O=A=>{v.value=A,V({target:v}),I.style.display="none"},V=A=>{var D,at,nt,rt,it;const P=A.target.value.trim();if(P.includes("@")){A.target.value="";return}const N=P.toLowerCase();N.length>0&&!y&&(y=!0,location.hash.includes("beats")||(location.hash="#/beats")),N.length===0&&(y=!1),localStorage.setItem("dt_last_search",P),N.length>=2&&S(P);const Q={query:N,raw:P,bpm:(D=N.match(/(\d{2,3})\s*bpm/))!=null&&D[1]||(at=N.match(/\b(\d{2,3})\b/))!=null&&at[1]?parseInt(((nt=N.match(/(\d{2,3})\s*bpm/))==null?void 0:nt[1])||((rt=N.match(/\b(\d{2,3})\b/))==null?void 0:rt[1])):null,key:(((it=P.match(/\b([A-G][#b]?\s*(?:maj|min|minor|major|m)?)\b/i))==null?void 0:it[0])||"").toLowerCase()};window.dispatchEvent(new CustomEvent("search:query",{detail:Q}))};v.addEventListener("input",V),v.addEventListener("focus",()=>{v.value.includes("@")&&(v.value=""),R(),I.style.display="block",v.value.trim()&&!y&&(location.hash.includes("beats")||(location.hash="#/beats"))}),v.addEventListener("blur",()=>{setTimeout(()=>I.style.display="none",180)}),v.addEventListener("keydown",A=>{A.key==="Enter"&&(A.preventDefault(),I.style.display="none",v.blur(),V({target:v}))})}document.querySelectorAll("[data-route]").forEach(y=>{y.addEventListener("click",b=>{b.preventDefault();const S=y.getAttribute("data-route"),R=S==="/"?"#/":`#/${S.replace(/^\//,"")}`;location.hash=R,g()})});const _=()=>{var b,S;const y=document.getElementById("rightToggle");y&&(y.style.display=window.innerWidth<=1024?"none":"flex"),window.innerWidth>1024&&(r(),(b=document.getElementById("navPanel"))==null||b.classList.remove("active"),(S=document.getElementById("navOverlay"))==null||S.classList.remove("active"),document.body.classList.remove("panel-open"))};_(),window.addEventListener("resize",_);function H(){const y=(location.hash.replace("#/","")||"/").split("?")[0];document.querySelectorAll(".nav-links-v2 a").forEach(b=>{b.classList.toggle("active",b.dataset.route===y||y===""&&b.dataset.route==="/")})}window.addEventListener("hashchange",H),H(),localStorage.getItem("dt_left")==="true"&&window.innerWidth>1024&&t.classList.add("collapsed"),localStorage.getItem("dt_right")==="true"&&e&&e.classList.add("collapsed"),window.setAuthState=(y,b)=>{const S=document.getElementById("authGuest"),R=document.getElementById("authUser");if(!S||!R)return;if(S.style.display=y?"none":"flex",R.style.display=y?"flex":"none",y&&b){const V=document.getElementById("userAvatar"),A=document.getElementById("mobileProfileAvatar"),P=document.getElementById("mobileProfileName"),N=document.getElementById("mobileProfileSub");V&&b.avatar&&(V.src=b.avatar),A&&b.avatar&&(A.src=b.avatar),P&&(P.textContent=b.name||"User"),N&&(N.textContent=b.sub||"Pro Member")}const O=()=>{var D;const V=localStorage.getItem("dopetone_user"),A=V?JSON.parse(V):null,P=document.getElementById("authGuest"),N=document.getElementById("authUser");if(!P||!N)return;if(A){P.style.display="none",N.style.display="flex";const at=A.avatar||"public/images/default-user.png",nt=A.username||A.email.split("@")[0],rt=document.getElementById("userAvatar"),it=document.getElementById("mobileProfileAvatar"),mt=document.getElementById("mobileProfileName"),Xt=document.getElementById("mobileProfileSub");rt&&(rt.src=at),it&&(it.src=at),mt&&(mt.textContent=nt),Xt&&(Xt.textContent=A.email);const qt=document.getElementById("controlCenterBtn");if(qt){const ft=(A.email||"").toLowerCase()==="dopetone701@gmail.com"||A.role==="admin";qt.style.display=ft?"flex":"none",qt.onclick=vt=>{var yt,Qt,Zt;if(vt.preventDefault(),vt.stopPropagation(),!ft){alert("Admin only");return}(yt=document.getElementById("userPanel"))==null||yt.classList.remove("active"),(Qt=document.getElementById("navPanel"))==null||Qt.classList.remove("active"),(Zt=document.getElementById("navOverlay"))==null||Zt.classList.remove("active"),document.body.classList.remove("panel-open"),location.hash="#/cc/overview"}}try{const ft=localStorage.getItem("dopetone_user_id"),vt=JSON.parse(localStorage.getItem(ft?`dopetone_cart_${ft}`:"dopetone_cart")||localStorage.getItem("dopetone_cart")||"[]");document.querySelectorAll(".cart-count").forEach(yt=>{yt.textContent=vt.length,yt.style.display=vt.length>0?"flex":"none"})}catch{}}else P.style.display="flex",N.style.display="none";const Q=document.createElement("input");Q.type="file",Q.accept="image/*",Q.style.display="none",document.body.appendChild(Q),(D=document.getElementById("accountBtn"))==null||D.addEventListener("dblclick",()=>Q.click()),Q.onchange=()=>{const at=Q.files[0];if(!at)return;const nt=new FileReader;nt.onload=rt=>{const it=rt.target.result;document.getElementById("userAvatar").src=it;const mt=JSON.parse(localStorage.getItem("dopetone_user")||"{}");mt.avatar=it,localStorage.setItem("dopetone_user",JSON.stringify(mt))},nt.readAsDataURL(at)}};O(),window.addEventListener("storage",O),window.addEventListener("auth:changed",O),window.addEventListener("cartUpdated",O),setInterval(O,1e3),window.setAuthState=(V,A)=>{O()}}}document.querySelectorAll("[data-route]").forEach(a=>{a.addEventListener("click",t=>{var o,i;t.preventDefault();const e=a.getAttribute("data-route");location.hash=e.startsWith("vault")?`#/${e}`:`#/${e}`,(o=document.getElementById("navPanel"))==null||o.classList.remove("active"),(i=document.getElementById("navOverlay"))==null||i.classList.remove("active"),document.body.classList.remove("panel-open")})});function Je(){const a=document.getElementById("left-sidebar");if(!a)return;a.innerHTML=`
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
          <img src="/public/images/logo.png" alt="DT" style="width:88%;height:88%;object-fit:contain;filter:drop-shadow(0 2px 8px rgba(0,0,0,0.8));position:relative;z-index:1" onerror="this.onerror=null;this.src='/images/logo.png'">
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

          <!-- ALL HASH ONLY - FIXED -->
          <a class="nav active" href="#/home" data-link data-route="/home" style="display:flex;align-items:center;gap:14px;padding:12px 14px;border-radius:12px;color:#FFFFFF;text-decoration:none;position:relative;z-index:2;border:1px solid transparent">
            <span style="width:22px;height:22px;display:grid;place-items:center;flex-shrink:0"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="1.8"><path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1V9.5z"/></svg></span>
            <span class="label hide-when-collapsed" style="font-size:13.5px;font-weight:600">Home</span>
          </a>
          <a class="nav" href="#/beats" data-link data-route="/beats" style="display:flex;align-items:center;gap:14px;padding:12px 14px;border-radius:12px;color:#9CA3AF;text-decoration:none;position:relative;z-index:2;border:1px solid transparent"><span style="width:22px;height:22px;display:grid;place-items:center"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg></span><span class="label hide-when-collapsed" style="font-size:13.5px">Beats Arsenal</span></a>
          <a class="nav" href="#/vault" data-link data-route="/vault" style="display:flex;align-items:center;gap:14px;padding:12px 14px;border-radius:12px;color:#9CA3AF;text-decoration:none;position:relative;z-index:2;border:1px solid transparent"><span style="width:22px;height:22px;display:grid;place-items:center"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg></span><span class="label hide-when-collapsed" style="font-size:13.5px">Vault</span></a>
          <a class="nav" href="#/playlists" data-link data-route="/playlists" style="display:flex;align-items:center;gap:14px;padding:12px 14px;border-radius:12px;color:#9CA3AF;text-decoration:none;position:relative;z-index:2;border:1px solid transparent"><span style="width:22px;height:22px;display:grid;place-items:center"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg></span><span class="label hide-when-collapsed" style="font-size:13.5px">Playlists</span></a>
          <a class="nav" href="#/cart" data-link data-route="/cart" style="display:flex;align-items:center;gap:14px;padding:12px 14px;border-radius:12px;color:#9CA3AF;text-decoration:none;position:relative;z-index:2;border:1px solid transparent"><span style="width:22px;height:22px;display:grid;place-items:center"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.5 3h2l2.4 12.4A2 2 0 0 0 8.86 17H19.5a2 2 0 0 0 1.96-1.57L22 8H6.5"/></svg></span><span class="label hide-when-collapsed" style="font-size:13.5px">Cart</span></a>

        


               <!-- CC ADMIN ONLY -->
        <div id="adminCCSection" style="display:none; margin-top:18px; padding-top:18px; border-top:1px solid rgba(255,255,255,0.08);">
          <div class="hide-when-collapsed" style="font-size:10px;letter-spacing:1.6px;color:rgba(255,30,60,0.6);font-weight:700;padding:0 12px 12px 12px;">ADMIN</div>
          <a class="nav" href="#/cc/overview" data-link data-route="/cc/overview" style="display:flex;align-items:center;gap:14px;padding:12px 14px;border-radius:12px;color:#FF1E3C;text-decoration:none;border:1px solid rgba(9, 4, 32, 0.25);background:rgba(255,30,60,0.08)"><span style="width:22px;display:grid;place-items:center">⚡</span><span class="label hide-when-collapsed" style="font-size:13.5px;font-weight:800">Control Center</span></a>
        </div>
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
  </div>
  
  `;var t=a.querySelector("#nav-selector"),e=a.querySelector("#nav-selector-bar"),o=a.querySelectorAll(".nav");function i(g){!g||!t||!e||requestAnimationFrame(()=>{var x=g.offsetTop,v=g.offsetHeight,I=24;t.style.height=v+"px",t.style.transform="translateY("+x+"px)",e.style.transform="translateY("+(x+(v-I)/2)+"px)";for(var L=0;L<o.length;L++){o[L].style.color="#9CA3AF",o[L].style.fontWeight="500";var z=o[L].querySelector("svg");z&&z.setAttribute("stroke","#9CA3AF")}g.style.color="#FFFFFF",g.style.fontWeight="700";var _=g.querySelector("svg");_&&_.setAttribute("stroke","white")})}function r(){var g=(window.location.hash||"").replace(/^#\/?/,"").split("?")[0]||"home",x="/"+g.replace(/^\/+/,"").toLowerCase(),v=null;o.forEach(I=>{var L=(I.getAttribute("data-route")||"").toLowerCase();L===x||x==="/"&&L==="/home"?(I.classList.add("active"),v=I):I.classList.remove("active")}),v&&(i(v),setTimeout(()=>i(v),10))}var d=a.querySelector(".nav.active");d&&i(d),r();for(var p=0;p<o.length;p++)(function(g){g.addEventListener("click",function(x){var z;x.preventDefault();const I=(g.getAttribute("data-route")||g.getAttribute("href")||"/home").replace(/^#\/?/,"").replace(/^\//,"").split("?")[0].split("#")[0];window.location.hash=I||"home";for(var L=0;L<o.length;L++)o[L].classList.remove("active");if(g.classList.add("active"),i(g),window.innerWidth<=1024){a.classList.remove("open");const _=document.getElementById("sidebar-overlay");_&&(_.style.opacity="0",_.style.pointerEvents="none"),(z=document.getElementById("main-row"))==null||z.classList.remove("sidebar-open"),document.body.classList.remove("sidebar-drawer-open")}})})(o[p]);window.addEventListener("resize",function(){var g=a.querySelector(".nav.active");g&&i(g)});var c=a.querySelector(".left-collapse-btn"),h='<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 18l-6-6 6-6"/></svg>',f='<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18l6-6-6-6"/></svg>';if(c){localStorage.getItem("dt_left")==="true"&&window.innerWidth>1024&&a.classList.add("collapsed"),c.innerHTML=a.classList.contains("collapsed")?f:h;const x=a.querySelector(".left-head");x&&(x.style.justifyContent=a.classList.contains("collapsed")?"center":"space-between"),c.onclick=function(){var v=a.classList.toggle("collapsed");c.innerHTML=v?f:h;var I=a.querySelector(".left-head");I&&(I.style.justifyContent=v?"center":"space-between"),document.dispatchEvent(new CustomEvent("leftCollapsed",{detail:v})),localStorage.setItem("dt_left",v),setTimeout(function(){var L=a.querySelector(".nav.active");L&&i(L)},310)}}window.addEventListener("hashchange",()=>{r()}),document.addEventListener("leftCollapsed",()=>{var g=a.querySelector(".nav.active");g&&(t.style.transition="none",e.style.transition="none",i(g),setTimeout(()=>{t.style.transition="transform.35s cubic-bezier(.16,1,.3,1), height.2s ease",e.style.transition="transform.35s cubic-bezier(.16,1,.3,1)"},50))});function w(){try{const g=localStorage.getItem("dopetone_user"),x=g?JSON.parse(g):null;((x==null?void 0:x.email)||"").toLowerCase()==="dopetone701@gmail.com"&&(document.getElementById("adminCCSection").style.display="block")}catch{}}w(),setTimeout(w,500)}function fe(a=!1){if((location.hash||"").startsWith("#/cc/")&&!a)return;const e=document.getElementById("right-sidebar");if(!e)return;e.style.width="",e.style.minWidth="",e.style.maxWidth="",e.style.background="",e.style.borderLeft="",e.style.zIndex="",e.style.display="",e.innerHTML=`
  <style id="queue-eq-style">
    @keyframes qeq1 { 0%,100%{height:4px} 50%{height:12px} }
    @keyframes qeq2 { 0%,100%{height:10px} 50%{height:3px} }
    @keyframes qeq3 { 0%,100%{height:6px} 50%{height:14px} }
  .queue-eq { display:flex; gap:2px; align-items:end; width:16px; height:14px; }
  .queue-eq span{ width:3px; background:#FF1E3C; border-radius:99px; display:block; }
  .queue-eq span:nth-child(1){ animation: qeq1 0.6s infinite ease-in-out; }
  .queue-eq span:nth-child(2){ animation: qeq2 0.6s infinite ease-in-out 0.2s; }
  .queue-eq span:nth-child(3){ animation: qeq3 0.6s infinite ease-in-out 0.4s; }
  .queue-item{ display:flex; align-items:center; gap:10px; padding:8px; border-radius:8px; cursor:pointer; margin-bottom:4px; transition: all.2s; border:1px solid transparent; }
  .queue-item:hover{ background: rgba(255,255,255,0.06); }
  .queue-item.is-active{ background: rgba(255,30,60,0.12)!important; border-color: rgba(255,30,60,0.25)!important; }
  .queue-item.is-active.q-title{ color:#fff!important; font-weight:700!important; }
  </style>
  <div style="display:flex;flex-direction:column;height:100%;padding:0">
    <div style="padding:16px 16px 12px;display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid rgba(255,255,255,0.08)">
      <h3 style="margin:0;font-size:14px;font-weight:800;letter-spacing:0.5px">QUEUE</h3>
      <span id="queueCount" style="font-size:11px;color:#9CA3AF;background:rgba(255,255,255,0.08);padding:3px 8px;border-radius:99px">0 tracks</span>
    </div>
    <div id="rightNow" style="padding:14px 16px;border-bottom:1px solid rgba(255,255,255,0.06);display:none">
      <div style="font-size:10px;letter-spacing:1px;color:#FF1E3C;font-weight:800;margin-bottom:8px">NOW PLAYING</div>
      <div style="display:flex;gap:10px">
        <img id="qCover" src="" style="width:48px;height:48px;border-radius:8px;object-fit:cover">
        <div style="min-width:0;flex:1">
          <div id="qTitle" style="color:white;font-weight:700;font-size:13px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis"></div>
          <div id="qMeta" style="color:#9CA3AF;font-size:11px;margin-top:2px"></div>
        </div>
        <div id="qEq" class="queue-eq" style="display:none"><span></span><span></span><span></span></div>
      </div>
    </div>
    <div id="rightContent" style="flex:1;overflow-y:auto;padding:8px">
      <div style="color:#9CA3AF;font-size:13px;padding:20px;text-align:center">No queue - play a beat</div>
    </div>
  </div>`;function o(){var c,h,f,w,g;return String(((c=window.__CURRENT_BEAT__)==null?void 0:c.id)||((g=(w=(h=window.DTPlayer)==null?void 0:h.queue)==null?void 0:w[(f=window.DTPlayer)==null?void 0:f.index])==null?void 0:g.id)||"")}function i(){var v,I;const c=((v=window.DTPlayer)==null?void 0:v.queue)||[],h=o(),f=((I=window.DTPlayer)==null?void 0:I.index)??0,w=document.getElementById("rightContent"),g=document.getElementById("queueCount");if(!w)return;if(g&&(g.textContent=`${c.length} tracks`),!c.length){w.innerHTML='<div style="color:#9CA3AF;font-size:13px;padding:20px;text-align:center">No queue</div>';return}w.innerHTML=c.map((L,z)=>{const _=String(L.id)===h||!h&&z===f,H=_&&window.__DT_AUDIO__&&!window.__DT_AUDIO__.paused;return`
      <div data-queue-idx="${z}" data-beat-id="${L.id}" class="queue-item ${_?"is-active":""}">
        <img src="${L.cover_url||L.cover||"public/images/logo.png"}" style="width:36px;height:36px;border-radius:6px;object-fit:cover">
        <div style="min-width:0;flex:1">
          <div class="q-title" style="color:${_?"#fff":"#E5E7EB"};font-size:12px;font-weight:${_?"700":"500"};white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${L.title||"Untitled"}</div>
          <div style="color:#9CA3AF;font-size:10px">${L.genre||""} ${L.bpm?"• "+L.bpm+" BPM":""}</div>
        </div>
        ${_?`<div class="queue-eq" style="display:${H?"flex":"none"}"><span></span><span></span></div>`:""}
      </div>`}).join("");const x=w.querySelector(".queue-item.is-active");x&&x.scrollIntoView({block:"nearest",behavior:"smooth"}),w.querySelectorAll("[data-queue-idx]").forEach(L=>{L.onclick=()=>{const z=parseInt(L.dataset.queueIdx);window.DTPlayer.index=z,window.__CURRENT_INDEX__=z,localStorage.setItem("dt_index_v2",String(z));const _=window.DTPlayer.queue[z];window.DTPlayTrack&&window.DTPlayTrack(_,!0)}})}function r(c){const h=document.getElementById("rightNow");if(!h||!c)return;h.style.display="block",document.getElementById("qCover").src=c.cover_url||c.cover||"public/images/logo.png",document.getElementById("qTitle").textContent=c.title||"No track",document.getElementById("qMeta").textContent=`${c.genre||""} ${c.bpm?"• "+c.bpm+" BPM":""}`.trim();const f=document.getElementById("qEq");if(f){const w=window.__DT_AUDIO__&&!window.__DT_AUDIO__.paused;f.style.display=w?"flex":"none"}}window.syncQueueToSection=function(c,h,f=0){if(!(c!=null&&c.length))return;const w=o();let g=f;if(w){const x=c.findIndex(v=>String(v.id)===w);x!==-1&&(g=x)}window.__CURRENT_LIST__=h,window.__CURRENT_BEATS__=c,window.DTPlayer&&(window.DTPlayer.queue=c,window.DTPlayer.index=g,localStorage.setItem("dt_queue_v2",JSON.stringify(c)),localStorage.setItem("dt_index_v2",String(g))),i()},document.addEventListener("playerPlay",c=>{var f;const h=((f=c.detail)==null?void 0:f.index)??window.__CURRENT_INDEX__??0;window.DTPlayer&&(window.DTPlayer.index=h),window.__CURRENT_INDEX__=h,localStorage.setItem("dt_index_v2",String(h)),window.__CURRENT_BEAT__&&r(window.__CURRENT_BEAT__),i()}),document.addEventListener("playerPause",()=>{i();const c=document.getElementById("qEq");c&&(c.style.display="none")});const d=window.DTPlayTrack;if(window.DTPlayTrack=function(c,h){d&&d(c,h),window.__CURRENT_BEAT__=c,r(c),i()},window.DTPlayer){const c=window.DTPlayer.setQueue.bind(window.DTPlayer);window.DTPlayer.setQueue=function(h,f=0,w=!0){c(h,f,w),i()}}const p=window.__DT_AUDIO__;p&&(p.addEventListener("play",i),p.addEventListener("pause",i)),i(),window.__CURRENT_BEAT__&&r(window.__CURRENT_BEAT__),window.__renderQueue=i}window.initRight=fe;function We(){if(window.__EQ_INIT__)return;window.__EQ_INIT__=!0;let a=null,t=null,e=null,o=null,i=null,r=null;const d=60;let p=new Array(d).fill(0),c=new Array(d).fill(0),h=0;const f=()=>window.__DT_AUDIO__||null;function w(){return i=document.getElementById("liquidEq"),i?(r=i.getContext("2d"),i.width=58,i.height=58,!0):!1}function g(){const _=f();if(!(!_||t))try{t=new(window.AudioContext||window.webkitAudioContext),a=t.createAnalyser(),a.fftSize=4096,a.smoothingTimeConstant=0,e=t.createMediaElementSource(_),e.connect(a),a.connect(t.destination),o=new Uint8Array(a.frequencyBinCount)}catch{}}function x(){const _=[],E=t.sampleRate/2,m=E/o.length;for(let F=0;F<d;F++){const J=F/d,y=Math.pow(J,1.15),b=15*Math.pow(2e4/15,y),S=15*Math.pow(2e4/15,Math.pow((F+1)/d,1.15)),R=Math.max(1,Math.floor(b/m)),O=Math.min(Math.floor(S/m),o.length-1);_.push([R,O])}return _}function v(_){return _<10?.9:_>=15&&_<=35?1.7:_>=12&&_<=40?1.35:1}function I(_,H){const Y=Math.max(0,1-H*2);return _>=15&&_<=35?3*Y:_>=12&&_<=40?1.5*Y:0}function L(){const F=54/(d-1),J=10+h*12,y=r.createLinearGradient(2,29,56,29);y.addColorStop(0,"rgba(80,180,255,0)"),y.addColorStop(.5,"rgba(120,200,255,1)"),y.addColorStop(1,"rgba(80,180,255,0)"),r.shadowBlur=J,r.shadowColor="rgba(45,150,255,1)",r.strokeStyle=y,r.lineCap="round",r.lineWidth=2.5+h*1.5,r.beginPath(),r.moveTo(2,29),r.lineTo(56,29),r.stroke(),r.shadowBlur=0;const b=r.createLinearGradient(0,58,0,0);b.addColorStop(0,"rgba(26,77,255,1)"),b.addColorStop(.5,"rgba(45,99,255,0.8)"),b.addColorStop(1,"rgba(255,45,58,0.6)"),r.fillStyle=b,r.shadowBlur=12+h*12,r.shadowColor="rgba(45,99,255,0.8)",r.beginPath(),r.moveTo(2,29);for(let S=0;S<d-1;S++){const R=2+S*F,O=29-p[S]*.9,V=2+(S+1)*F,A=29-p[S+1]*.9,P=(R+V)/2,N=(O+A)/2;r.quadraticCurveTo(R,O,P,N)}r.lineTo(56,29),r.closePath(),r.fill(),r.save(),r.translate(0,58),r.scale(1,-1),r.globalAlpha=.35+h*.1,r.beginPath(),r.moveTo(2,29);for(let S=0;S<d-1;S++){const R=2+S*F,O=29-p[S]*.9,V=2+(S+1)*F,A=29-p[S+1]*.9,P=(R+V)/2,N=(O+A)/2;r.quadraticCurveTo(R,O,P,N)}r.lineTo(56,29),r.closePath(),r.fill(),r.restore(),r.shadowBlur=0}function z(){if(requestAnimationFrame(z),!r)return;const _=f();if(_&&!_.paused&&!t&&g(),r.clearRect(0,0,58,58),!_||_.paused||!a||!o){for(let E=0;E<d;E++){const m=I(E,0);p[E]=Math.max(m,p[E]*.85)}c=c.map(E=>E*.95),h*=.9,L();return}t.state==="suspended"&&t.resume(),a.getByteFrequencyData(o);let H=0;for(let E=0;E<o.length;E++)H+=o[E];h=h*.8+H/o.length/255*.2;const Y=x();for(let E=0;E<d;E++){let m=0;for(let A=Y[E][0];A<=Y[E][1];A++)m=Math.max(m,o[A]);const F=m/255;c[E]=c[E]*.995+F*.005;let J=.05+h*.01;E<10?J=.085+h*.02:E>=15&&E<=35&&(J=.025+h*.005);const b=Math.max(0,F-c[E]*(1.3-h*.3))*v(E),S=I(E,h),R=58+h*25,O=b>J?(b-J)*R:S;let V=.87-h*.15;if(E<10?V=.78-h*.13:E>=15&&E<=35&&(V=.77+h*.05),O>p[E]){const A=1-h*.2;p[E]=p[E]*(1-A)+O*A}else p[E]=Math.max(S,p[E]*V+O*(1-V))}L()}w(),z()}const ee="dt_queue_v3",bt="dt_index_v3",ve="dopetone_likes",ye="https://dopetone-stats.dopetone701.workers.dev";let ae=new Set;function Ye(a,t){if(!a)return;const e=be();fetch(`${ye}/api/stats/event`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({beatId:parseInt(a),eventType:t,anon_id:e,user_key:e,user_id:e})}).catch(()=>{})}const Ge="dt-audio-v1";let k=null,ie=!1,oe=!1,ct=null,Tt=new Map,Vt=!1;const ne=a=>{if(!a||isNaN(a))return"0:00";const t=Math.floor(a/60),e=Math.floor(a%60);return`${t}:${String(e).padStart(2,"0")}`},Yt=()=>{try{return JSON.parse(localStorage.getItem(ve)||"{}")}catch{return{}}},Xe=a=>{try{localStorage.setItem(ve,JSON.stringify(a)),localStorage.setItem("dopetone_likes_count",String(Object.keys(a).length))}catch{}},Qe=a=>{if(a==null)return!1;const t=Yt(),e=String(a).trim();return!!(t[e]||t[Number(e)])},Ze=a=>{const t=Yt(),e=String(a).trim(),o=Number(e),i=!(t[e]||t[o]);return i?(t[e]=Date.now(),t[o]=Date.now()):Object.keys(t).forEach(r=>{(String(r).trim()===e||Number(r)===o)&&delete t[r]}),Xe(t),i},Nt=a=>(a==null?void 0:a.mp3_url)||(a==null?void 0:a.audio)||(a==null?void 0:a.audio_url)||"";function be(){let a=localStorage.getItem("dt_anon_id");return a||(a="anon_"+Math.random().toString(36).slice(2)+Date.now(),localStorage.setItem("dt_anon_id",a)),a}async function Gt(){if(!("caches"in window))return null;try{return await caches.open(Ge)}catch{return null}}async function Ke(a){if(!a)return!1;const t=await Gt();if(!t)return!1;try{return!!await t.match(a)}catch{return!1}}async function Et(a){const t=Nt(a);if(!t)return!1;if(Tt.has(t))return Tt.get(t);const e=(async()=>{try{const o=await Gt();if(!o)return!1;if(await o.match(t))return!0;const r=await fetch(t,{mode:"cors",credentials:"omit",cache:"no-store"});if(!r.ok)throw new Error(`Audio HTTP ${r.status}`);return await o.put(t,r.clone()),!0}catch(o){return console.warn("[PLAYER] Cache failed:",o),!1}finally{Tt.delete(t)}})();return Tt.set(t,e),e}async function we(a){const t=Nt(a);if(!t)return"";try{if((await fetch(t,{method:"HEAD",mode:"cors",cache:"no-store"})).ok)return Et(a),t}catch{}try{const e=await Gt(),o=await(e==null?void 0:e.match(t));if(o)return URL.createObjectURL(await o.blob())}catch{}return t}function _t(a){var i;const t=((i=window.DTPlayer)==null?void 0:i.queue)||[],e=t[a],o=t[(a+1)%t.length];e&&Et(e),o&&o!==e&&setTimeout(()=>{Et(o)},500)}function Ut(){if(window.__DT_AUDIO__){k=window.__DT_AUDIO__,ie||re();const e=localStorage.getItem("dt_cc_locked_track");return e&&(window.currentBeatId=e),k}k=new Audio,k.crossOrigin="anonymous",k.preload="auto",k.playsInline=!0,window.__DT_AUDIO__=k,window.__DOPE_TONE_AUDIO__=k,ie=!0,re();const a=localStorage.getItem("dt_cc_locked_track"),t=localStorage.getItem("dt_cc_locked_title");a&&(window.currentBeatId=a,console.log("[PLAYER] Restored locked track",a,t));try{const e=JSON.parse(localStorage.getItem("dt_now_playing")||"null");e!=null&&e.id&&(window.currentBeatId=e.id)}catch{}return k}function re(){if(!(oe||!k)){if(oe=!0,document.addEventListener("keydown",a=>{var e,o,i;if(a.code!=="Space"&&a.key!==" ")return;const t=(o=(e=document.activeElement)==null?void 0:e.tagName)==null?void 0:o.toLowerCase();t==="input"||t==="textarea"||(i=document.activeElement)!=null&&i.isContentEditable||(a.preventDefault(),j.toggle())}),document.addEventListener("visibilitychange",()=>{!document.hidden&&window.__SHOULD_PLAY__&&k.paused&&k.play().catch(()=>{})}),"mediaSession"in navigator)try{navigator.mediaSession.setActionHandler("play",()=>k.play().catch(()=>{})),navigator.mediaSession.setActionHandler("pause",()=>k.pause()),navigator.mediaSession.setActionHandler("nexttrack",()=>j.next()),navigator.mediaSession.setActionHandler("previoustrack",()=>j.prev())}catch{}k.addEventListener("play",()=>{var e,o,i,r;window.__SHOULD_PLAY__=!0,document.body.classList.add("playing"),se(!0);const a=(e=window.__CURRENT_BEAT__)==null?void 0:e.id,t=((o=window.__CURRENT_BEAT__)==null?void 0:o.title)||"";window.currentBeatId=a||null,window.__CURRENT_ID__=a||null,a&&(localStorage.setItem("dt_now_playing",JSON.stringify({id:a,title:t})),localStorage.getItem("dt_cc_follow_player")==="1"&&(localStorage.setItem("dt_cc_locked_track",String(a)),t&&localStorage.setItem("dt_cc_locked_title",t)),document.dispatchEvent(new CustomEvent("dt-track-play",{detail:{id:a,beatId:a,title:t}})),document.dispatchEvent(new CustomEvent("dt-play",{detail:{id:a,beatId:a,title:t}}))),a&&!ae.has(String(a))&&(Ye(a,"play"),ae.add(String(a))),document.dispatchEvent(new CustomEvent("playerPlay",{detail:{index:j.index,listId:window.__CURRENT_LIST__,beatId:(i=window.__CURRENT_BEAT__)==null?void 0:i.id,title:(r=window.__CURRENT_BEAT__)==null?void 0:r.title}}))}),k.addEventListener("pause",()=>{document.hidden||(window.__SHOULD_PLAY__=!1,document.body.classList.remove("playing"),se(!1),document.dispatchEvent(new CustomEvent("playerPause")))}),k.addEventListener("timeupdate",()=>{const a=k.duration?k.currentTime/k.duration*100:0,t=document.getElementById("gpBar");t&&(t.style.width=a+"%");const e=document.getElementById("gpCurrent");e&&(e.textContent=ne(k.currentTime))}),k.addEventListener("loadedmetadata",()=>{const a=document.getElementById("gpDuration");a&&(a.textContent=ne(k.duration))}),k.addEventListener("ended",async()=>{if(!Vt){Vt=!0;try{await j.next()}finally{setTimeout(()=>{Vt=!1},300)}}}),k.addEventListener("error",async()=>{console.warn("[PLAYER] Audio error");const a=window.__CURRENT_BEAT__;if(a){await Ke(Nt(a))||await Et(a);const e=await we(a);if(e){if(ct)try{URL.revokeObjectURL(ct)}catch{}ct=e,k.src=e,k.play().catch(()=>{setTimeout(()=>j.next(),1e3)});return}}setTimeout(()=>{j.next()},1e3)})}}function se(a){document.querySelectorAll(".play-icon").forEach(t=>{t.style.display=a?"none":"block"}),document.querySelectorAll(".pause-icon").forEach(t=>{t.style.display=a?"block":"none"})}function xe(a,t=(e=>(e=window.__CURRENT_BEAT__)==null?void 0:e.id)()){var p,c;if(t==null)return a;(p=document.getElementById("loveTrackBtn"))==null||p.classList.toggle("active",a),(c=document.getElementById("loveTrackBtn"))==null||c.classList.toggle("liked",a),document.querySelectorAll(".love-heart").forEach(h=>{h.textContent=a?"♥":"♡"});const o=document.querySelector("#loveTrackBtn .love-text")||document.querySelector(".love-text");o&&(o.textContent=a?"LOVED":"LOVE IT");const i=Yt(),r=Object.keys(i).length;window.dispatchEvent(new CustomEvent("cc_like_updated",{detail:{beat_id:t,beatId:t,liked:a,count:r,perBeat:i}})),window.dispatchEvent(new CustomEvent("cc_player_like_sync",{detail:{total:r,beat_id:t,beatId:t,liked:a}})),window.dispatchEvent(new CustomEvent("cc_like_change",{detail:{beat_id:t,liked:a}}));const d=document.getElementById("totalLikes");return d&&(d.textContent=String(r)),a}const j={queue:JSON.parse(localStorage.getItem(ee)||"[]"),index:parseInt(localStorage.getItem(bt)||"0")||0,setQueue(a,t=0,e=!0){!Array.isArray(a)||!a.length||(this.queue=a,this.index=Math.max(0,Math.min(t,a.length-1)),window.__CURRENT_LIST__=window.__CURRENT_LIST__||"featured",window.__CURRENT_INDEX__=this.index,window.__CURRENT_BEATS__=a,localStorage.setItem(ee,JSON.stringify(a)),localStorage.setItem(bt,String(this.index)),_t(this.index),e?ut(a[this.index],!0):a[this.index]&&ut(a[this.index],!1))},async next(){if(!this.queue.length)return;this.index=(this.index+1)%this.queue.length,window.__CURRENT_INDEX__=this.index,localStorage.setItem(bt,String(this.index));const a=this.queue[this.index];await Et(a),ut(a,!0),_t(this.index)},prev(){if(this.queue.length){if(k&&k.currentTime>3){k.currentTime=0;return}this.index=(this.index-1+this.queue.length)%this.queue.length,window.__CURRENT_INDEX__=this.index,localStorage.setItem(bt,String(this.index)),ut(this.queue[this.index],!0),_t(this.index)}},toggle(){if(k){if(!k.src&&this.queue.length){ut(this.queue[this.index],!0);return}k.paused?k.play().catch(()=>{}):k.pause()}}};window.DTPlayer=j;window.globalPlayer={play:(a,t,e)=>{!Array.isArray(t)||!t.length||(window.__CURRENT_LIST__=e,j.setQueue(t,a,!0))}};window.player=window.globalPlayer;function ta(){Ut();const a=document.getElementById("player-bar");if(!a||a.dataset.mounted)return;a.dataset.mounted="1",a.innerHTML=`

  <div id="globalPlayerUI" class="global-player">

    <div class="gp-left">

      <img
        id="gpCover"
        src="public/images/logo.png"
        alt=""
      >

      <div class="gp-text">

        <div id="gpTitle">
          No track
        </div>

        <div style="font-size:11px;color:#9CA3AF">
          Dope Tone Vault
        </div>

      </div>

    </div>


    <div class="gp-center">

      <div class="gp-controls">

        <button
          data-action="prev"
          class="player-btn"
          title="Prev"
        >
          <svg width="20" height="20"
            viewBox="0 0 24 24"
            fill="currentColor">
            <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z"/>
          </svg>
        </button>


        <button
          data-action="toggle"
          class="player-btn"
          id="gpPlay"
          title="Play"
        >

          <svg
            class="play-icon"
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="currentColor">
            <path d="M8 5v14l11-7z"/>
          </svg>

          <svg
            class="pause-icon"
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="currentColor"
            style="display:none">
            <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
          </svg>

        </button>


        <button
          data-action="next"
          class="player-btn"
          title="Next"
        >
          <svg width="20" height="20"
            viewBox="0 0 24 24"
            fill="currentColor">
            <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z"/>
          </svg>
        </button>

      </div>


      <div class="gp-progress-wrap">

        <span id="gpCurrent">
          0:00
        </span>

        <div
          id="gpProgress"
          data-action="seek"
          style="
            flex:1;
            height:6px;
            background:rgba(255,255,255,0.15);
            border-radius:99px;
            position:relative;
            cursor:pointer;
            overflow:hidden
          "
        >

          <div
            id="gpBar"
            style="
              height:100%;
              width:0%;
              background:#22d3ee;
              border-radius:99px;
              pointer-events:none
            "
          ></div>

        </div>

        <span id="gpDuration">
          0:00
        </span>

      </div>

    </div>


    <div class="gp-right">

      <button
        data-action="like"
        id="loveTrackBtn"
        class="love-track-btn"
      >

        <span class="love-text">
          LOVE IT
        </span>

        <span class="love-heart">
          ♡
        </span>

      </button>

      <div class="wave-card">
        <canvas
          id="liquidEq"
          width="58"
          height="58"
        ></canvas>
      </div>

    </div>

  </div>

  `,a.addEventListener("click",d=>{const p=d.target.closest("[data-action]");if(!p)return;const c=p.dataset.action;if(c!=="seek"&&(c==="toggle"&&j.toggle(),c==="next"&&j.next(),c==="prev"&&j.prev(),c==="like")){const h=window.__CURRENT_BEAT__;if(!h)return;const f=Ze(h.id);xe(f,h.id);const w=be();fetch(`${ye}/api/stats/event`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({beatId:parseInt(h.id),eventType:f?"like":"like_remove",anon_id:w,user_key:w,user_id:w})}).catch(()=>{}),window.dispatchEvent(new CustomEvent("dt-like-changed",{detail:{beatId:h.id,action:f?"like":"like_remove"}}));let g=JSON.parse(localStorage.getItem("dt_liked_v1")||"[]"),x=JSON.parse(localStorage.getItem("dt_vault_v1")||"[]"),v=x.find(I=>I.isLiked);v||(v={id:"dt_liked_playlist",name:"Liked",isLiked:!0,beats:[]},x.unshift(v)),f?(!g.includes(String(h.id))&&!g.includes(Number(h.id))&&g.push(h.id),v.beats.some(I=>String(I.id)===String(h.id))||v.beats.unshift(h)):(g=g.filter(I=>String(I)!==String(h.id)),v.beats=v.beats.filter(I=>String(I.id)!==String(h.id))),localStorage.setItem("dt_liked_v1",JSON.stringify(g)),localStorage.setItem("dt_liked_ids",JSON.stringify(g)),localStorage.setItem("dt_vault_v1",JSON.stringify(x)),window.dispatchEvent(new Event("dt_vault_updated")),window.dispatchEvent(new Event("playlistsUpdated"))}});const t=a.querySelector("#gpProgress"),e=a.querySelector("#gpBar");let o=!1;e&&(e.style.pointerEvents="none");function i(d){var f,w,g,x;const p=t.getBoundingClientRect(),h=((d.clientX??((w=(f=d.changedTouches)==null?void 0:f[0])==null?void 0:w.clientX)??((x=(g=d.touches)==null?void 0:g[0])==null?void 0:x.clientX)??0)-p.left)/p.width;return Math.max(0,Math.min(.999,h))}function r(d){const p=window.__DT_AUDIO__||k;if(!(p!=null&&p.duration)||isNaN(p.duration)||p.duration===0)return;d.preventDefault(),d.stopPropagation();const c=i(d);p.currentTime=c*p.duration,e&&(e.style.width=c*100+"%")}if(t&&(t.addEventListener("click",r),t.addEventListener("mousedown",d=>{o=!0,r(d)}),window.addEventListener("mousemove",d=>{o&&r(d)}),window.addEventListener("mouseup",()=>{o=!1}),t.addEventListener("touchstart",d=>{o=!0,r(d)},{passive:!1}),t.addEventListener("touchmove",d=>{o&&r(d)},{passive:!1}),t.addEventListener("touchend",d=>{o&&(r(d),o=!1)},{passive:!1})),setTimeout(()=>{try{We()}catch{}},700),j.queue.length&&j.queue[j.index]){const d=j.queue[j.index];window.__CURRENT_BEAT__=d,_e(d),_t(j.index)}}async function ut(a,t=!0){var r,d,p;if(!a)return;const e=window.__DT_AUDIO__||k||Ut();if(!e)return;const o=Nt(a);if(!o)return;if((d=(r=window.DTPlayer)==null?void 0:r.queue)!=null&&d.length){const c=window.DTPlayer.queue.findIndex(h=>String(h.id)===String(a.id));c!==-1&&(window.DTPlayer.index=c,window.__CURRENT_INDEX__=c,localStorage.setItem(bt,String(c)))}if(window.__CURRENT_BEAT__=a,window.__SHOULD_PLAY__=t,window.currentBeatId=a.id,window.__CURRENT_ID__=a.id,localStorage.setItem("dt_now_playing",JSON.stringify({id:a.id,title:a.title,cover:a.cover_url||a.cover||""})),localStorage.getItem("dt_cc_follow_player")==="1"&&(localStorage.setItem("dt_cc_locked_track",String(a.id)),localStorage.setItem("dt_cc_locked_title",a.title||"")),document.dispatchEvent(new CustomEvent("dt-track-play",{detail:{id:a.id,beatId:a.id,title:a.title}})),document.dispatchEvent(new CustomEvent("dt-play",{detail:{id:a.id,beatId:a.id,title:a.title}})),document.dispatchEvent(new CustomEvent("cc_track_changed",{detail:{id:a.id,title:a.title}})),_e(a),window.__CURRENT_SRC__===o&&e.src){t&&e.paused&&e.play().catch(()=>{});return}window.__CURRENT_SRC__=o;const i=await we(a);if(i){if(window.__CURRENT_BEAT__!==a){if(i.startsWith("blob:"))try{URL.revokeObjectURL(i)}catch{}return}if(ct){try{URL.revokeObjectURL(ct)}catch{}ct=null}if(i.startsWith("blob:")&&(ct=i),e.src=i,e.load(),t)try{await e.play()}catch(c){console.warn("[PLAYER] Play blocked:",c)}_t(((p=window.DTPlayer)==null?void 0:p.index)||0)}}function _e(a){const t=a.cover_url||a.cover||"public/images/logo.png",e=document.getElementById("gpCover");e&&(e.src=t);const o=document.getElementById("gpTitle");if(o&&(o.textContent=a.title||"No track"),"mediaSession"in navigator)try{navigator.mediaSession.metadata=new MediaMetadata({title:a.title||"Dope Tone",artist:"Dope Tone",artwork:[{src:t,sizes:"512x512",type:"image/png"}]})}catch{}xe(Qe(a.id))}window.DTPlayTrack=ut;Ut();const ea="https://emails-api.dopetone701.workers.dev";let pt="email",le="",kt="",ht=!1;function de(a,t,e){let o=0;a.value="";const i=setInterval(()=>{a.value+=t[o],o++,o>=t.length&&(clearInterval(i),e&&e())},120)}function ce(a,t,e){t.animate([{transform:"translateX(0)"},{transform:"translateX(-60px)"},{transform:"translateX(0)"}],{duration:400}),a.animate([{opacity:1,transform:"translateX(0)"},{opacity:0,transform:"translateX(-15px)"}],{duration:180}).onfinish=()=>{a.value="",a.animate([{opacity:0,transform:"translateX(15px)"},{opacity:1,transform:"translateX(0)"}],{duration:180}),e()}}async function aa(a,t){try{const o=await(await fetch(`${ea}/api/emails/subscribe`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email:a,name:t,source:"footer_vault"})})).json();console.log("[Vault] Saved:",o),window.dispatchEvent(new CustomEvent("cc_dashboard_refresh"));const i=JSON.parse(localStorage.getItem("dt_newsletter_cache")||"[]");i.unshift({email:a,name:t,date:new Date().toISOString(),source:"footer_vault"}),localStorage.setItem("dt_newsletter_cache",JSON.stringify(i.slice(0,100))),localStorage.setItem("dt_vault_user",JSON.stringify({email:a,name:t}))}catch(e){console.error("[Vault] Failed:",e)}}function It(a=!1){if(document.getElementById("dt-terms-float"))return;const t=a||sessionStorage.getItem("vault_terms_flow")==="1",e=document.createElement("div");e.id="dt-terms-float",e.innerHTML=`
    <div style="position:fixed;bottom:86px;left:0;right:0;z-index:99999;background:#0A0E1A;border-top:1px solid rgba(255,255,255,0.12);padding:14px 20px;display:flex;justify-content:space-between;align-items:center;gap:16px;transform:translateY(100%);transition:transform.35s cubic-bezier(.16,1,.3,1);backdrop-filter:blur(12px);">
      <span style="color:#fff;font-size:12px;letter-spacing:.3px;">${t?"Agree to Terms to continue vault signup":"Terms of Use"}</span>
      <div style="display:flex;gap:8px;flex-shrink:0;">
        ${t?'<button id="dt-decline-terms" style="background:transparent;border:1px solid #333;color:#fff;padding:9px 18px;border-radius:8px;font-size:12px;cursor:pointer;">Decline</button>':""}
        <button id="dt-agree-terms" style="background:#fff;color:#000;padding:9px 20px;border-radius:8px;font-size:12px;font-weight:800;cursor:pointer;border:none;">${t?"Agree & Continue":"Agree"}</button>
      </div>
    </div>
  `,document.body.appendChild(e),setTimeout(()=>{e.firstElementChild.style.transform="translateY(0)"},100),document.getElementById("dt-agree-terms").onclick=()=>{localStorage.setItem("dt_terms_accepted","true"),e.firstElementChild.style.transform="translateY(100%)",setTimeout(()=>{e.remove(),t&&(sessionStorage.removeItem("vault_terms_flow"),history.back(),setTimeout(()=>{const i=document.getElementById("app-view");i&&i.scrollTo({top:i.scrollHeight,behavior:"smooth"}),setTimeout(()=>{const r=document.getElementById("vault-agree-check");r&&!r.checked&&(r.checked=!0,r.dispatchEvent(new Event("change")))},750)},400))},350)};const o=document.getElementById("dt-decline-terms");o&&(o.onclick=()=>{e.firstElementChild.style.transform="translateY(100%)",setTimeout(()=>{e.remove(),sessionStorage.removeItem("vault_terms_flow"),history.back()},350)})}function pe(){const a=document.getElementById("vault-email");if(!a)return;const t=a.nextElementSibling,e=document.querySelector(".dt-footer-right > span"),o=document.getElementById("vault-terms"),i=document.getElementById("vault-agree-check"),r=a.value.trim();if(pt==="email"){if(!r.includes("@")){a.style.border="1px solid #ff2d78",a.animate([{transform:"translateX(-4px)"},{transform:"translateX(4px)"},{transform:"translateX(0)"}],{duration:250});return}le=r.toLowerCase(),ce(a,t,()=>{pt="name",e.textContent="Input your full name",a.type="text",a.value="",a.placeholder="Full name",a.style.border=""})}else if(pt==="name"){if(r.length<2){a.style.border="1px solid #ff2d78";return}kt=r,ce(a,t,()=>{pt="terms",e.textContent="By continuing you agree to our terms",e.style.fontSize="10px",e.style.opacity="0.6",a.value="",a.placeholder="Check box to agree",a.type="text",a.disabled=!0,o.style.display="flex",t.style.opacity="0.3",t.style.pointerEvents="none";const d=localStorage.getItem("dt_terms_accepted")==="true";i.checked=d,d&&(ht=!0,a.disabled=!1,a.value="",de(a,"AGREE",()=>{t.style.opacity="1",t.style.pointerEvents="auto",ht=!1})),i.onchange=()=>{i.checked&&!ht?(ht=!0,a.disabled=!1,a.value="",de(a,"AGREE",()=>{t.style.opacity="1",t.style.pointerEvents="auto",ht=!1})):i.checked||(a.value="",t.style.opacity="0.3",t.style.pointerEvents="none")}})}else pt==="terms"&&(aa(le,kt),o.style.display="none",e.innerHTML=`${kt} • IN VAULT`,e.style.fontSize="12px",e.style.opacity="1",e.style.textTransform="uppercase",a.value="",a.placeholder=`Bingo! Welcome ${kt.split(" ")[0]} 🔥`,a.style.border="1px solid #00ff9d",a.disabled=!0,t.style.opacity="0.3",t.style.pointerEvents="none",pt="done")}function ia(){const a=()=>{const t=document.getElementById("app-view");if(!t||document.getElementById("dt-footer"))return;const e=JSON.parse(localStorage.getItem("dt_vault_user")||"null"),o=e?`${e.name} • IN VAULT`:"STAY IN VAULT",i=e?`Welcome back ${e.name.split(" ")[0]} 🔥`:"Email",r=!!e,d=`
<footer id="dt-footer" class="dt-footer" style="margin-bottom:0!important;padding-bottom:0!important;">
  <div class="dt-footer-main">
    <div class="dt-footer-left">
      <h2>DOPE TONE</h2>
      <p>Premium beats • Future sound • Industry vibes</p>
      <div class="footer-socials">
        <a href="https://instagram.com/dopetone701" target="_blank" rel="noopener" aria-label="Instagram">
          <svg viewBox="0 0 24 24"><path fill="currentColor" d="M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2Zm-.2 2A3.6 3.6 0 0 0 4 7.6v8.8C4 18.39 5.61 20 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6C20 5.61 18.39 4 16.4 4H7.6Zm9.65 1.5a1.25 1.25 0 1 1 0 2.5 1.25 1.25 0 0 1 0-2.5ZM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm0 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z"/></svg>
        </a>
        <a href="https://www.youtube.com/channel/UCKddIkawOD4w_79Hc4zDw7Q" target="_blank" rel="noopener" aria-label="YouTube">
          <svg viewBox="0 0 24 24"><path fill="currentColor" d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.196-.488-8.55-4.385-8.816ZM9 16V8l8 3.993L9 16Z"/></svg>
        </a>
        <a href="https://www.tiktok.com/@dopetonevault" target="_blank" rel="noopener" aria-label="TikTok">
          <svg viewBox="0 0 24 24"><path fill="currentColor" d="M12.525.02h3.91c.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07Z"/></svg>
        </a>
      </div>
    </div>

    <div class="dt-footer-nav">
      <div class="col"><span>Explore</span><a href="#/beats" data-link>Beats</a><a href="#/vault" data-link>Samples</a><a href="#/beats" data-link>Trending</a></div>
      <div class="col"><span>Support</span><a href="#/help" data-link>Help</a><a href="#/help" data-link data-scroll="ticketSection">Message</a><a href="#/help" data-link data-scroll="licenseSection">License</a></div>
      <div class="col"><span>Legal</span><a href="#/terms" data-link>Terms</a><a href="#/privacy" data-link>Privacy</a><a href="#/help" data-link data-scroll="faqSection">FAQ</a></div>
      <div class="col"><span>Vault</span><a href="#/about" data-link>About</a><a href="#/about" data-link>Contact</a><a href="https://instagram.com/dopetone701" target="_blank">IG</a></div>
    </div>

    <div class="dt-footer-right">
      <span style="${r?"font-size:12px;opacity:1;text-transform:uppercase;":""}">${o}</span>
           <form class="vault-join" autocomplete="on" onsubmit="return false;" data-form-type="newsletter">
        <input id="vault-email" type="email" name="newsletter-email" autocomplete="email" inputmode="email" data-form-type="other" placeholder="${i}" ${r?'disabled style="border:1px solid #00ff9d"':""}>
        <button id="vault-join-btn" type="button" ${r?'style="opacity:0.3;pointer-events:none"':""}>→</button>
      </form>

      <div id="vault-terms" style="display:none; align-items:center; gap:6px; margin-top:8px; font-size:10px; color:#fff;">
        <input type="checkbox" id="vault-agree-check" style="width:12px; height:12px; accent-color:#fff;">
        <label for="vault-agree-check" style="cursor:pointer;">I agree to <a href="#/terms" data-link id="vault-terms-link" style="text-decoration:underline;color:#fff;text-underline-offset:3px;font-weight:600;">Terms</a></label>
      </div>
      <div class="pay-row" style="margin-top:14px;">
        <div style="background:#fff;color:#1A1F71;font-weight:900;font-size:9px;padding:5px 7px;border-radius:4px;min-width:36px;text-align:center;letter-spacing:.3px;">VISA</div>
        <div class="pay"><img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard"></div>
        <div class="pay pay-pp" style="background:#FFC439"><img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" alt="PayPal"></div>
        <div class="pay"><img src="https://upload.wikimedia.org/wikipedia/commons/b/b0/Apple_Pay_logo.svg" alt="Apple Pay"></div>
      </div>
    </div>
  </div>
  <div class="dt-footer-bottom" style="margin-bottom:0!important;">
    <small>© 2026 DOPE TONE VAULT</small>
    <small class="dna">SOUND • FUTURE • CULTURE</small>
    <small>Dubai • Worldwide</small>
  </div>
</footer>
`;t.insertAdjacentHTML("beforeend",d);const p=document.getElementById("vault-email"),c=document.getElementById("vault-join-btn");c&&!r&&(c.onclick=pe),p&&!r&&(p.addEventListener("keypress",f=>{f.key==="Enter"&&!ht&&pe()}),p.addEventListener("input",()=>{p.style.border=""}));const h=document.getElementById("vault-terms-link");if(h&&h.addEventListener("click",f=>{f.preventDefault(),sessionStorage.setItem("vault_terms_flow","1"),window.location.hash="#/terms",setTimeout(()=>It(!0),500)}),t.querySelectorAll("a[data-scroll]").forEach(f=>{f.addEventListener("click",()=>{const w=f.getAttribute("data-scroll");setTimeout(()=>{const g=document.getElementById(w);g&&g.scrollIntoView({behavior:"smooth",block:"start"})},350)})}),window.location.hash.includes("terms")){const f=sessionStorage.getItem("vault_terms_flow")==="1";setTimeout(()=>It(f),600)}};if(a(),!window.__DT_FOOTER_OBSERVER__){const t=document.getElementById("app-view");if(t){const e=new MutationObserver(()=>{if(document.getElementById("dt-footer")||a(),window.location.hash.includes("terms")){const o=sessionStorage.getItem("vault_terms_flow")==="1";It(o)}});e.observe(t,{childList:!0,subtree:!1}),window.__DT_FOOTER_OBSERVER__=e}}window.addEventListener("hashchange",()=>{if(window.location.hash.includes("terms")){const t=sessionStorage.getItem("vault_terms_flow")==="1";setTimeout(()=>It(t),400)}else{const t=document.getElementById("dt-terms-float");t&&t.remove(),sessionStorage.removeItem("vault_terms_flow")}})}function Ee(){if(document.getElementById("authModal"))return;const a=`
  <!-- USER PANEL - PRO GLASS -->
  <div id="userPanel" class="account-panel dt-user-panel" aria-hidden="true">
    <div class="up-head">
      <div class="up-avatar-wrap" id="upAvatarWrap">
        <img id="panelAvatar" src="/public/images/default-user.png" alt="">
        <span class="up-edit-pen">
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>
        </span>
      </div>
      <div class="up-meta">
        <strong id="panelName">Guest</strong>
        <span id="panelEmail">Not logged in</span>
        <span class="up-badge">VAULT MEMBER</span>
      </div>
    </div>

    <div class="account-actions">
      <button id="controlCenterBtn" style="display:none" data-action="control">
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <path d="M4 6h16"/>
    <path d="M4 12h16"/>
    <path d="M4 18h16"/>
    <circle cx="9" cy="6" r="2"/>
    <circle cx="15" cy="12" r="2"/>
    <circle cx="10" cy="18" r="2"/>
  </svg>
  Control Center
</button>


      <button data-action="playlists">
        <svg viewBox="0 0 24 24"><path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/></svg>
        My Playlists
      </button>

      <button data-action="liked">
        <svg viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
        Favourite
      </button>

      <button data-action="purchased">
        <svg viewBox="0 0 24 24"><path d="M9 8h6M9 12h6M9 16h6"/><path d="M4 20V6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v14l-4-2-4 2-4-2-4 2z"/></svg>
        Purchased
      </button>

      <button data-action="lyrics">
        <svg viewBox="0 0 24 24"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>
        Lyrics
      </button>

      <button id="accountSettingsBtn" data-action="settings">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
  <circle cx="12" cy="12" r="3"></circle>
  <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1.08 1.55V21a2 2 0 0 1-4 0v-.09a1.65 1.65 0 0 0-1.08-1.55 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.6 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.6a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9c.2.6.77 1 1.4 1H21a2 2 0 0 1 0 4h-.2c-.63 0-1.2.4-1.4 1Z"></path>
</svg>

        Account Settings
      </button>

      <button id="logoutAction" class="logout">
        <svg viewBox="0 0 24 24"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
        Logout
      </button>
    </div>
  </div>

  <!-- AUTH MODAL -->
  <div id="authModal" class="auth-modal" aria-hidden="true">
    <div class="auth-overlay" data-close="auth"></div>
    <div class="auth-box" id="authBox" data-mode="login">
      <button id="authCloseBtn" class="auth-close">✕</button>
      <div class="auth-head">
        <h2 id="authTitle">Welcome Back</h2>
        <p id="authSubtitle">Login to your vault</p>
      </div>
      <form id="authForm" class="auth-form">
        <div class="auth-group" id="usernameGroup" style="display:none">
          <label>Username</label>
          <input id="authUsername" placeholder="letters only" autocomplete="username">
        </div>
        <div class="auth-group">
          <label>Gmail Address</label>
          <input id="authEmail" type="email" placeholder="you@gmail.com" required autocomplete="email">
        </div>
        <div class="auth-group">
          <label>Password</label>
          <div class="input-eye-wrap">
            <input id="authPassword" type="password" placeholder="••••••••" required autocomplete="current-password">
            <button type="button" id="togglePassword" class="eye-btn" tabindex="-1">👁</button>
          </div>
        </div>
        <div id="signupAvatarWrap" class="avatar-row" style="display:none">
          <div id="avatarPreview" class="avatar-preview"><img src="/public/images/default-user.png"></div>
          <label class="file-btn"><input id="avatarInput" type="file" accept="image/*" hidden><span>Choose Avatar</span></label>
        </div>
        <div id="authError" class="auth-error" style="display:none"></div>
        <button id="authSubmit" type="submit" class="btn-primary">Continue</button>
        <button type="button" id="forgotPasswordBtn" class="link-btn">Forgot password?</button>
      </form>
      <div class="auth-switch"><span id="switchAuthText">Don't have an account?</span> <button id="switchAuthBtn" type="button">Sign Up</button></div>
    </div>
  </div>

  <div id="otpModal" class="auth-modal" aria-hidden="true">
    <div class="auth-overlay" data-close="otp"></div>
    <div class="auth-box">
      <button id="otpCloseBtn" class="auth-close">✕</button>
      <h2>Check your email</h2><p>Code sent to <b id="otpEmail"></b></p>
      <div class="otp-grid"><input class="otp-digit" maxlength="1"><input class="otp-digit" maxlength="1"><input class="otp-digit" maxlength="1"><input class="otp-digit" maxlength="1"><input class="otp-digit" maxlength="1"><input class="otp-digit" maxlength="1"></div>
      <div id="otpError" class="auth-error" style="display:none"></div>
      <div class="otp-foot"><span id="otpCountdown">5:00</span><button id="otpResendBtn" class="link-btn">Resend code</button></div>
      <button id="otpVerifyBtn" class="btn-primary" disabled>Verify Code</button>
    </div>
  </div>

  <div id="resetPasswordModal" class="auth-modal" aria-hidden="true">
    <div class="auth-overlay" data-close="reset"></div>
    <div class="auth-box">
      <button id="resetCloseBtn" class="auth-close">✕</button>
      <h2>Reset Password</h2><p id="resetEmail"></p>
      <form id="resetPasswordForm" class="auth-form">
        <div class="auth-group"><label>New Password</label><div class="input-eye-wrap"><input id="newPassword" type="password" required><button type="button" id="toggleNewPassword" class="eye-btn">👁</button></div></div>
        <div class="auth-group"><label>Confirm</label><div class="input-eye-wrap"><input id="confirmNewPassword" type="password" required><button type="button" id="toggleConfirmPassword" class="eye-btn">👁</button></div></div>
        <div id="resetError" class="auth-error" style="display:none"></div>
        <button id="resetSubmitBtn" type="submit" class="btn-primary">Reset Password</button>
      </form>
    </div>
  </div>

  <!-- ACCOUNT SETTINGS MODAL - LIKE SIGNIN -->
  <div id="settingsModal" class="auth-modal" aria-hidden="true">
    <div class="auth-overlay" data-close="settings"></div>
    <div class="auth-box" style="max-width:460px">
      <button id="closeSettings" class="auth-close">✕</button>
      <div class="auth-head"><h2>Account Settings</h2><p>Edit your profile & security</p></div>
      <div class="auth-form">
        <div class="settings-avatar-row">
          <div class="settings-avatar-wrap" id="settingsAvatarWrap">
            <img id="settingsAvatarPreview" src="/public/images/default-user.png">
            <span class="up-edit-pen" style="width:22px;height:22px"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/></svg></span>
          </div>
          <button id="changeAvatarBtn" type="button" class="file-btn" style="padding:8px 14px"><span>Change Photo</span></button>
        </div>
        <div class="auth-group"><label>Display Name</label><input id="settingsName" type="text" placeholder="Your name"></div>
        <div class="auth-group"><label>Email</label><input id="settingsEmail" type="email" disabled style="opacity:.6"></div>
        <hr style="border:none;border-top:1px solid rgba(255,255,255,.08);margin:14px 0">
        <div class="auth-group"><label>New Password</label><div class="input-eye-wrap"><input id="settingsPass" type="password" placeholder="Leave blank to keep"><button type="button" class="eye-btn" data-eye="settingsPass">👁</button></div></div>
        <div class="auth-group"><label>Confirm Password</label><input id="settingsPass2" type="password" placeholder="Confirm new password"></div>
        <div id="settingsError" class="auth-error" style="display:none"></div>
        <button id="saveSettingsBtn" class="btn-primary">Save Changes</button>
      </div>
    </div>
  </div>

  <div id="logoutModal" class="auth-modal small" aria-hidden="true"><div class="auth-overlay" data-close="logout"></div><div class="auth-box"><h3>Logout?</h3><p>Save your vault first.</p><div style="display:flex;gap:10px;margin-top:14px"><button id="logoutCancelBtn" class="btn-ghost">Cancel</button><button id="logoutConfirmBtn" class="btn-red">Logout</button></div></div></div>

  <div id="cropModal" class="auth-modal" aria-hidden="true">
    <div class="auth-overlay" data-close="crop"></div>
    <div class="auth-box" style="max-width:520px;padding:20px">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px">
        <h3 style="margin:0;color:#fff">Crop Avatar</h3>
        <button id="cancelCrop" class="auth-close" type="button" style="position:static">✕</button>
      </div>
      <div style="background:#050A14;border-radius:16px;overflow:hidden;border:1px solid rgba(255,255,255,.1);max-height:60vh">
        <img id="cropImage" style="max-width:100%;display:block;max-height:60vh">
      </div>
      <div style="display:flex;gap:10px;margin-top:16px">
        <button id="chooseDifferentBtn" class="btn-ghost" type="button">Choose Different</button>
        <button id="saveCrop" class="btn-primary" type="button" style="flex:1;margin:0">Save</button>
      </div>
      <input id="changeAvatarInput" type="file" accept="image/*" hidden>
    </div>
  </div>

  <div id="authToast"><span id="authToastText"></span></div>
  <input type="file" id="avatarFileInput" accept="image/*" hidden>
  `,t=document.createElement("div");t.id="authModalsContainer",t.innerHTML=a,document.body.appendChild(t),document.querySelectorAll(".auth-overlay[data-close]").forEach(e=>{e.addEventListener("click",()=>{var i,r,d,p,c,h;const o=e.dataset.close;o==="auth"&&((i=document.getElementById("authModal"))==null||i.classList.remove("active")),o==="otp"&&((r=document.getElementById("otpModal"))==null||r.classList.remove("active")),o==="reset"&&((d=document.getElementById("resetPasswordModal"))==null||d.classList.remove("active")),o==="logout"&&((p=document.getElementById("logoutModal"))==null||p.classList.remove("active")),o==="crop"&&((c=document.getElementById("cropModal"))==null||c.classList.remove("active")),o==="settings"&&((h=document.getElementById("settingsModal"))==null||h.classList.remove("active")),document.querySelector(".auth-modal.active")||(document.body.style.overflow="")})})}const U={ADMIN_EMAIL:"dopetone701@gmail.com",API_URL:"https://api.dopetonevault.com",DEFAULT_AVATAR:"public/images/default-user.png",STORAGE_KEYS:["dopetone_cart","dopetone_playlists","dopetone_liked_beats","dopetone_licences"],OTP_TIMEOUT:300},$t="https://dopetone-stats.dopetone701.workers.dev",B=a=>document.getElementById(a);var T,q,W,tt,l,St,C,et,At,s,jt,Se,Lt,Ct,st,Bt,Ae,gt,K,Pt,Te,Ft,ke,Ie,Le,wt,Ot,lt,Ht,Ce,Be,Pe,xt,Fe,Dt,Oe,Jt,Mt,De,Me,Re,dt,ot,Wt,G;class oa{constructor(){Z(this,s);Z(this,T,null);Z(this,q,!1);Z(this,W,null);Z(this,tt,U.DEFAULT_AVATAR);Z(this,l,{});Z(this,St,!1);Z(this,C,{email:"",timer:null,seconds:U.OTP_TIMEOUT,username:"",password:""});Z(this,et,!1);Z(this,At,null);sessionStorage.getItem("just_logged_out")&&(sessionStorage.removeItem("just_logged_out"),u(this,s,Re).call(this)),this.init()}async init(){await u(this,s,Se).call(this),u(this,s,Lt).call(this),u(this,s,Te).call(this),u(this,s,Ct).call(this),u(this,s,Ae).call(this),console.log("✅ Auth V7 ready")}getUserStorage(t){const e=u(this,s,Bt).call(this);return localStorage.getItem(e?`${t}_${e}`:t)||localStorage.getItem(t)||"[]"}setUserStorage(t,e){const o=u(this,s,Bt).call(this);o?localStorage.setItem(`${t}_${o}`,e):localStorage.setItem(t,e),clearTimeout(n(this,At)),M(this,At,setTimeout(()=>this.syncToCloud(),800))}async syncToCloud(){var o,i,r;const t=u(this,s,Bt).call(this);if(!t||!n(this,T)&&!t.startsWith("anon_"))return;const e={user_id:((o=n(this,T))==null?void 0:o.id)||t,anon_id:u(this,s,st).call(this),cart:JSON.parse(this.getUserStorage("dopetone_cart")),playlists:JSON.parse(this.getUserStorage("dopetone_playlists")),likes:JSON.parse(this.getUserStorage("dopetone_liked_beats")),licences:JSON.parse(this.getUserStorage("dopetone_licences")),avatar:((i=n(this,T))==null?void 0:i.avatar)||null,settings:{theme:localStorage.getItem("dopetone_theme"),volume:localStorage.getItem("dopetone_volume")}};try{await fetch(`${U.API_URL}/api/user/sync`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(e)})}catch{}try{(r=n(this,T))!=null&&r.id&&await fetch(`${$t}/api/user/cart-sync`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({user_key:String(n(this,T).id),beats:e.cart.map(d=>({id:d.id||d.beat_id,licence:d.selected_licence||"basic"}))}),keepalive:!0})}catch{}}async loadFromCloud(){if(n(this,T))try{const e=await(await fetch(`${U.API_URL}/api/user/${n(this,T).id}/data`)).json();if(!e)return;U.STORAGE_KEYS.forEach(o=>{const i=o==="dopetone_liked_beats"?"likes":o==="dopetone_licences"?"licences":o.replace("dopetone_","");e[i]!==void 0&&this.setUserStorage(o,JSON.stringify(e[i]||[]))}),e.avatar&&(n(this,T).avatar=e.avatar,M(this,tt,e.avatar),localStorage.setItem("dopetone_user",JSON.stringify(n(this,T))),document.querySelectorAll("[data-user-avatar],#userAvatar,#panelAvatar,.header-avatar").forEach(o=>o.src=e.avatar)),this.updateCartCount()}catch(t){console.warn("Cloud load failed",t)}}openModal(t=!1){n(this,l).authModal||u(this,s,Lt).call(this),M(this,q,t),u(this,s,Pt).call(this),u(this,s,gt).call(this,n(this,l).authModal),setTimeout(()=>{var e;return(e=n(this,l).authEmail)==null?void 0:e.focus()},80)}closeModal(){var t;u(this,s,K).call(this,n(this,l).authModal),(t=n(this,l).authForm)==null||t.reset(),u(this,s,Wt).call(this)}togglePanel(){const t=B("accountPanel");if(t&&(t.classList.toggle("active"),t.classList.contains("active")&&n(this,T))){const e=n(this,T).avatar||U.DEFAULT_AVATAR,o=n(this,T).username||n(this,T).email.split("@")[0];B("panelAvatar")&&(B("panelAvatar").src=e),B("panelName")&&(B("panelName").textContent=o),B("panelEmail")&&(B("panelEmail").textContent=n(this,T).email)}}logout(){u(this,s,gt).call(this,n(this,l).logoutModal)}updateCartCount(){const t=JSON.parse(this.getUserStorage("dopetone_cart"));document.querySelectorAll(".cart-count").forEach(e=>{e.textContent=t.length,e.style.display=t.length>0?"flex":"none"})}}T=new WeakMap,q=new WeakMap,W=new WeakMap,tt=new WeakMap,l=new WeakMap,St=new WeakMap,C=new WeakMap,et=new WeakMap,At=new WeakMap,s=new WeakSet,jt=async function(t,e,o){if(t)try{await fetch(`${$t}/api/user/upsert`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({id:String(t),email:e||"",display_name:o||""}),keepalive:!0});const i=JSON.parse(this.getUserStorage("dopetone_cart")||"[]");i.length&&await fetch(`${$t}/api/user/cart-sync`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({user_key:String(t),beats:i.map(r=>({id:r.id,licence:r.selected_licence||"basic"}))}),keepalive:!0}).catch(()=>{})}catch(i){console.warn("D1 user sync failed",i)}},Se=function(){return new Promise(t=>{const e=()=>(B("accountBtn")||B("loginBtn")||B("userAvatar"))&&B("authModal")&&B("authForm");if(e())return t();const o=new MutationObserver(()=>{e()&&(o.disconnect(),t())});o.observe(document.body,{childList:!0,subtree:!0}),setTimeout(()=>{o.disconnect(),t()},4e3)})},Lt=function(){["authModal","authForm","authTitle","authSubtitle","authUsername","authEmail","authPassword","authSubmit","authError","authCloseBtn","switchAuthBtn","switchAuthText","signupAvatarWrap","avatarInput","avatarPreview","accountPanel","panelName","panelEmail","panelAvatar","logoutAction","authToast","authToastText","cropModal","cropImage","saveCrop","cancelCrop","changeAvatarInput","usernameGroup","forgotPasswordBtn","authBox","controlCenterBtn","togglePassword","otpModal","otpEmail","otpInputs","otpVerifyBtn","otpResendBtn","otpError","otpCloseBtn","otpCountdown","otpBackBtn","logoutModal","logoutCancelBtn","logoutConfirmBtn","resetPasswordModal","resetEmail","newPassword","confirmNewPassword","resetSubmitBtn","resetError","resetCloseBtn","toggleNewPassword","toggleConfirmPassword","resetPasswordForm"].forEach(t=>n(this,l)[t]=B(t))},Ct=function(){let t=localStorage.getItem("dt_anon_id");t||(t="anon_"+crypto.randomUUID(),localStorage.setItem("dt_anon_id",t),localStorage.setItem("dt_anon_created",Date.now().toString()),fetch(`${U.API_URL}/api/anon/init`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({anon_id:t,device_id:navigator.userAgent})}).catch(()=>{}));const e=parseInt(localStorage.getItem("dt_anon_created")||"0");if(e&&Date.now()-e>30*24*60*60*1e3)return localStorage.removeItem("dt_anon_id"),localStorage.removeItem("dt_anon_created"),localStorage.removeItem("dopetone_cart"),localStorage.removeItem("dopetone_liked_beats"),u(this,s,Ct).call(this)},st=function(){let t=localStorage.getItem("dt_anon_id");return t||(u(this,s,Ct).call(this),t=localStorage.getItem("dt_anon_id")),t},Bt=function(){var t;return localStorage.getItem("dopetone_user_id")||((t=n(this,T))==null?void 0:t.id)||u(this,s,st).call(this)},Ae=function(){try{const t=localStorage.getItem("dopetone_user");t&&(M(this,T,JSON.parse(t)),localStorage.setItem("dopetone_user_id",n(this,T).id),this.loadFromCloud())}catch{}u(this,s,dt).call(this)},gt=function(t){t&&(t.classList.add("active"),t.setAttribute("aria-hidden","false"),document.body.style.overflow="hidden")},K=function(t){t&&(t.classList.remove("active"),t.setAttribute("aria-hidden","true"),document.querySelector(".modal.active,.auth-modal.active")||(document.body.style.overflow=""))},Pt=function(){const{authTitle:t,authSubtitle:e,usernameGroup:o,signupAvatarWrap:i,forgotPasswordBtn:r,switchAuthText:d,switchAuthBtn:p,authBox:c,avatarPreview:h}=n(this,l);if(!t||!n(this,l).authSubtitle){u(this,s,Lt).call(this);return}if(t.textContent=n(this,q)?"Create Account":"Welcome Back",n(this,l).authSubtitle.textContent=n(this,q)?"Join the vault":"Login to your vault",h){const f=h.querySelector("img");f&&(f.src=n(this,tt)||U.DEFAULT_AVATAR)}o&&(o.style.display=n(this,q)?"flex":"none",n(this,l).authUsername&&(n(this,l).authUsername.required=n(this,q))),i&&(i.style.display=n(this,q)?"flex":"none"),r&&(r.style.display=n(this,q)?"none":"block"),d&&(d.textContent=n(this,q)?"Already have an account?":"Don't have an account?"),p&&(p.textContent=n(this,q)?"Login":"Sign Up"),c&&c.setAttribute("data-mode",n(this,q)?"signup":"login")},Te=function(){var t,e,o,i,r,d,p,c,h,f,w,g,x,v,I,L,z,_,H,Y,E;n(this,St)||(M(this,St,!0),document.addEventListener("click",m=>{var J,y,b;if(m.target.closest("#loginBtn,#mobileLoginBtn")){m.preventDefault(),this.openModal(!1),(J=B("mobileNav"))==null||J.classList.remove("active");return}if(m.target.closest("#signupBtn,#mobileSignupBtn")){m.preventDefault(),this.openModal(!0),(y=B("mobileNav"))==null||y.classList.remove("active");return}if(m.target.closest("#accountBtn,#userAvatar,.avatar-btn,#authUser")){m.preventDefault(),n(this,T)?this.togglePanel():this.openModal(!1);return}const F=B("accountPanel");if(F!=null&&F.classList.contains("active")&&!F.contains(m.target)&&!m.target.closest("#accountBtn")&&!m.target.closest("#authUser")&&F.classList.remove("active"),m.target.closest("#controlCenterBtn")){m.preventDefault(),m.stopPropagation(),(b=document.getElementById("userPanel"))==null||b.classList.remove("active"),location.hash="#/cc/overview";return}if(m.target.closest('[data-action="playlists"]')&&(location.href="playlists.html"),m.target.closest('[data-action="liked"]')&&(location.href="playlists.html?tab=liked_playlist"),m.target.closest("#logoutAction")&&this.logout(),m.target.classList.contains("auth-overlay")){const S=m.target.dataset.close;S==="auth"&&this.closeModal(),S==="otp"&&u(this,s,lt).call(this),S==="reset"&&u(this,s,xt).call(this),S==="logout"&&u(this,s,K).call(this,n(this,l).logoutModal),S==="crop"&&u(this,s,Mt).call(this)}},!0),(t=B("chooseDifferentBtn"))==null||t.addEventListener("click",()=>{var m;return(m=B("changeAvatarInput"))==null?void 0:m.click()}),(e=n(this,l).authCloseBtn)==null||e.addEventListener("click",()=>this.closeModal()),(o=n(this,l).otpCloseBtn)==null||o.addEventListener("click",()=>u(this,s,lt).call(this)),(i=n(this,l).otpBackBtn)==null||i.addEventListener("click",()=>{u(this,s,lt).call(this),this.openModal(n(this,q))}),(r=n(this,l).authModal)==null||r.addEventListener("click",m=>{m.target===n(this,l).authModal&&this.closeModal()}),(d=n(this,l).authForm)==null||d.addEventListener("submit",m=>u(this,s,ke).call(this,m)),(p=n(this,l).switchAuthBtn)==null||p.addEventListener("click",()=>{M(this,q,!n(this,q)),u(this,s,Pt).call(this),u(this,s,Wt).call(this)}),(c=n(this,l).forgotPasswordBtn)==null||c.addEventListener("click",()=>u(this,s,Oe).call(this)),(h=n(this,l).togglePassword)==null||h.addEventListener("click",m=>{m.preventDefault(),u(this,s,Ft).call(this,n(this,l).authPassword,m.currentTarget)}),(f=n(this,l).avatarInput)==null||f.addEventListener("change",m=>m.target.files[0]&&u(this,s,Jt).call(this,m.target.files[0])),(w=n(this,l).changeAvatarInput)==null||w.addEventListener("change",m=>m.target.files[0]&&u(this,s,Jt).call(this,m.target.files[0])),(g=n(this,l).cancelCrop)==null||g.addEventListener("click",m=>{m.preventDefault(),u(this,s,Mt).call(this)}),(x=n(this,l).saveCrop)==null||x.addEventListener("click",m=>{m.preventDefault(),u(this,s,De).call(this)}),(v=n(this,l).otpVerifyBtn)==null||v.addEventListener("click",()=>u(this,s,Ce).call(this)),(I=n(this,l).otpResendBtn)==null||I.addEventListener("click",()=>u(this,s,Be).call(this)),(L=n(this,l).logoutCancelBtn)==null||L.addEventListener("click",()=>u(this,s,K).call(this,n(this,l).logoutModal)),(z=n(this,l).logoutConfirmBtn)==null||z.addEventListener("click",()=>u(this,s,Me).call(this)),(_=n(this,l).resetCloseBtn)==null||_.addEventListener("click",()=>u(this,s,xt).call(this)),(H=n(this,l).resetPasswordForm)==null||H.addEventListener("submit",m=>u(this,s,Fe).call(this,m)),(Y=n(this,l).toggleNewPassword)==null||Y.addEventListener("click",m=>{m.preventDefault(),u(this,s,Ft).call(this,n(this,l).newPassword,m.currentTarget)}),(E=n(this,l).toggleConfirmPassword)==null||E.addEventListener("click",m=>{m.preventDefault(),u(this,s,Ft).call(this,n(this,l).confirmNewPassword,m.currentTarget)}),document.addEventListener("keydown",m=>{var F;m.key==="Escape"&&(this.closeModal(),u(this,s,lt).call(this),u(this,s,xt).call(this),u(this,s,K).call(this,n(this,l).logoutModal),(F=B("accountPanel"))==null||F.classList.remove("active"))}),u(this,s,Le).call(this))},Ft=function(t,e){if(!t||!e)return;const o=t.type==="password";t.type=o?"text":"password";const i=e.querySelector("i");i?(i.classList.toggle("fa-eye",!o),i.classList.toggle("fa-eye-slash",o)):e.textContent=o?"🙈":"👁"},ke=async function(t){var r,d,p;t.preventDefault();const e=((r=n(this,l).authUsername)==null?void 0:r.value.trim())||"",o=((d=n(this,l).authEmail)==null?void 0:d.value.trim())||"",i=((p=n(this,l).authPassword)==null?void 0:p.value.trim())||"";if(!o.toLowerCase().endsWith("@gmail.com"))return u(this,s,ot).call(this,"Only Gmail allowed");if(n(this,q)&&!/^[A-Za-z]+(?: [A-Za-z]+)?$/.test(e))return u(this,s,ot).call(this,"Username: letters only, one space allowed");n(this,l).authSubmit.disabled=!0,n(this,l).authSubmit.textContent="Please wait...";try{if(n(this,q)){const c=await fetch(`${U.API_URL}/api/auth/send-signup-code`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email:o,password:i,confirmPassword:i,username:e,anon_id:u(this,s,st).call(this)})}),h=await c.json();if(!c.ok)throw new Error(h.error);M(this,C,{...n(this,C),email:o,username:e,password:i}),this.closeModal(),u(this,s,Ot).call(this,o)}else{const c=await fetch(`${U.API_URL}/api/auth/login`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email:o,password:i})}),h=await c.json();if(!c.ok)throw new Error(h.error);h.requiresOTP?(n(this,C).password=i,this.closeModal(),u(this,s,Ot).call(this,o)):u(this,s,Ie).call(this,h.user)}}catch(c){c.message.includes("already have an account")?(u(this,s,ot).call(this,"Account exists, login instead"),M(this,q,!1),u(this,s,Pt).call(this)):u(this,s,ot).call(this,c.message)}finally{n(this,l).authSubmit.disabled=!1,n(this,l).authSubmit.textContent="Continue"}},Ie=function(t){M(this,T,t),localStorage.setItem("dopetone_user",JSON.stringify(t)),localStorage.setItem("dopetone_user_id",t.id),localStorage.setItem("dopetone_user_email",t.email||""),u(this,s,jt).call(this,t.id,t.email,t.username||t.display_name);const e=u(this,s,st).call(this);e&&(["dopetone_cart","dopetone_playlists","dopetone_liked_beats","dopetone_licences"].forEach(o=>{const i=localStorage.getItem(`${o}_${e}`)||localStorage.getItem(o);i&&localStorage.setItem(`${o}_${t.id}`,i)}),this.syncToCloud()),u(this,s,dt).call(this),u(this,s,G).call(this,`Welcome ${t.username}`),this.closeModal(),this.loadFromCloud(),window.dispatchEvent(new Event("auth:changed")),window.dispatchEvent(new CustomEvent("cartUpdated",{detail:{beatId:null,action:"add"}}))},Le=function(){const t=document.querySelectorAll(".otp-digit");t.forEach((e,o)=>{e.addEventListener("input",i=>{if(!/^[0-9]$/.test(i.target.value)){i.target.value="";return}i.target.classList.add("filled"),i.target.value&&o<5&&t[o+1].focus(),u(this,s,wt).call(this)}),e.addEventListener("keydown",i=>{i.key==="Backspace"&&!i.target.value&&o>0&&(t[o-1].focus(),t[o-1].value="",t[o-1].classList.remove("filled"),u(this,s,wt).call(this))}),e.addEventListener("paste",i=>{i.preventDefault();const r=i.clipboardData.getData("text").slice(0,6);/^\d+$/.test(r)&&(r.split("").forEach((d,p)=>{t[p]&&(t[p].value=d,t[p].classList.add("filled"))}),u(this,s,wt).call(this),t[Math.min(r.length-1,5)].focus())})})},wt=function(){const t=[...document.querySelectorAll(".otp-digit")].map(e=>e.value).join("");return n(this,l).otpVerifyBtn&&(n(this,l).otpVerifyBtn.disabled=t.length!==6),t.length===6?t:null},Ot=function(t){n(this,C).email=t,n(this,l).otpEmail&&(n(this,l).otpEmail.textContent=t),n(this,l).otpError&&(n(this,l).otpError.style.display="none"),document.querySelectorAll(".otp-digit").forEach(e=>{e.value="",e.classList.remove("filled","error")}),u(this,s,gt).call(this,n(this,l).otpModal),setTimeout(()=>{var e;return(e=document.querySelector(".otp-digit"))==null?void 0:e.focus()},100),u(this,s,Ht).call(this)},lt=function(){u(this,s,K).call(this,n(this,l).otpModal),clearInterval(n(this,C).timer),M(this,et,!1)},Ht=function(){n(this,C).seconds=U.OTP_TIMEOUT,n(this,l).otpResendBtn&&(n(this,l).otpResendBtn.disabled=!0),clearInterval(n(this,C).timer),n(this,C).timer=setInterval(()=>{n(this,C).seconds--;const t=Math.floor(n(this,C).seconds/60),e=n(this,C).seconds%60;n(this,l).otpCountdown&&(n(this,l).otpCountdown.textContent=`${t}:${String(e).padStart(2,"0")}`),n(this,C).seconds<=0&&(clearInterval(n(this,C).timer),n(this,l).otpResendBtn&&(n(this,l).otpResendBtn.disabled=!1),n(this,l).otpCountdown&&(n(this,l).otpCountdown.textContent="Expired"))},1e3)},Ce=async function(){const t=u(this,s,wt).call(this);if(t){n(this,l).otpVerifyBtn&&(n(this,l).otpVerifyBtn.disabled=!0,n(this,l).otpVerifyBtn.textContent="Verifying..."),n(this,l).otpError&&(n(this,l).otpError.style.display="none");try{if(n(this,et)){const d=await fetch(`${U.API_URL}/api/auth/verify-reset-otp`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email:n(this,C).email,code:t})}),p=await d.json();if(!d.ok)throw new Error(p.error);u(this,s,lt).call(this),u(this,s,Pe).call(this,n(this,C).email);return}const e=n(this,q)?"/api/auth/verify-signup":"/api/auth/verify-login-otp",o=n(this,q)?{email:n(this,C).email,code:t,username:n(this,C).username,password:n(this,C).password,avatar:n(this,tt),anon_id:u(this,s,st).call(this)}:{email:n(this,C).email,code:t},i=await fetch(`${U.API_URL}${e}`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(o)}),r=await i.json();if(!i.ok)throw new Error(r.error);M(this,T,r.user),localStorage.setItem("dopetone_user",JSON.stringify(r.user)),localStorage.setItem("dopetone_user_id",r.user.id),localStorage.setItem("dopetone_user_email",r.user.email||""),u(this,s,jt).call(this,r.user.id,r.user.email,r.user.username),u(this,s,dt).call(this),u(this,s,G).call(this,`Welcome ${r.user.username}`),u(this,s,lt).call(this),this.closeModal(),this.syncToCloud()}catch(e){n(this,l).otpError&&(n(this,l).otpError.textContent=e.message,n(this,l).otpError.style.display="block"),document.querySelectorAll(".otp-digit").forEach(o=>{o.classList.add("error"),o.value="",o.classList.remove("filled")})}finally{n(this,l).otpVerifyBtn&&(n(this,l).otpVerifyBtn.disabled=!1,n(this,l).otpVerifyBtn.textContent="Verify Code")}window.dispatchEvent(new Event("auth:changed"))}},Be=async function(){n(this,l).otpResendBtn&&(n(this,l).otpResendBtn.disabled=!0,n(this,l).otpResendBtn.textContent="Sending...");try{let t,e;n(this,et)?(t="/api/auth/forgot-password",e={email:n(this,C).email}):(t=n(this,q)?"/api/auth/send-signup-code":"/api/auth/login",e=n(this,q)?{email:n(this,C).email,password:n(this,C).password,confirmPassword:n(this,C).password,username:n(this,C).username,anon_id:u(this,s,st).call(this)}:{email:n(this,C).email,password:n(this,C).password});const o=await fetch(`${U.API_URL}${t}`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(e)}),i=await o.json();if(!o.ok)throw new Error(i.error||"Failed");u(this,s,G).call(this,"Code resent"),u(this,s,Ht).call(this)}catch(t){n(this,l).otpError&&(n(this,l).otpError.textContent=t.message,n(this,l).otpError.style.display="block")}finally{n(this,l).otpResendBtn&&(n(this,l).otpResendBtn.textContent="Resend code")}},Pe=function(t){n(this,l).resetEmail&&(n(this,l).resetEmail.textContent=t),n(this,l).resetError&&(n(this,l).resetError.style.display="none"),n(this,l).newPassword&&(n(this,l).newPassword.value=""),n(this,l).confirmNewPassword&&(n(this,l).confirmNewPassword.value=""),u(this,s,gt).call(this,n(this,l).resetPasswordModal)},xt=function(){u(this,s,K).call(this,n(this,l).resetPasswordModal),M(this,et,!1)},Fe=async function(t){var i,r;t.preventDefault();const e=(i=n(this,l).newPassword)==null?void 0:i.value.trim(),o=(r=n(this,l).confirmNewPassword)==null?void 0:r.value.trim();if(e.length<6)return u(this,s,Dt).call(this,"At least 6 chars");if(e!==o)return u(this,s,Dt).call(this,"Mismatch");n(this,l).resetSubmitBtn&&(n(this,l).resetSubmitBtn.disabled=!0,n(this,l).resetSubmitBtn.textContent="Resetting...");try{const d=await fetch(`${U.API_URL}/api/auth/reset-password`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email:n(this,C).email,password:e})}),p=await d.json();if(!d.ok)throw new Error(p.error);M(this,T,p.user),localStorage.setItem("dopetone_user",JSON.stringify(p.user)),localStorage.setItem("dopetone_user_id",p.user.id),u(this,s,dt).call(this),u(this,s,G).call(this,"Password reset!"),u(this,s,xt).call(this),M(this,et,!1)}catch(d){u(this,s,Dt).call(this,d.message)}finally{n(this,l).resetSubmitBtn&&(n(this,l).resetSubmitBtn.disabled=!1,n(this,l).resetSubmitBtn.textContent="Reset Password")}},Dt=function(t){n(this,l).resetError&&(n(this,l).resetError.textContent=t,n(this,l).resetError.style.display="block")},Oe=async function(){var e;const t=(e=n(this,l).authEmail)==null?void 0:e.value.trim();if(!t)return u(this,s,ot).call(this,"Enter email");if(!t.toLowerCase().endsWith("@gmail.com"))return u(this,s,ot).call(this,"Valid Gmail required");try{const o=await fetch(`${U.API_URL}/api/auth/forgot-password`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email:t})}),i=await o.json();if(!o.ok)throw new Error(i.error);M(this,et,!0),n(this,C).email=t,this.closeModal(),u(this,s,Ot).call(this,t),u(this,s,G).call(this,"Reset code sent")}catch(o){u(this,s,ot).call(this,o.message)}},Jt=function(t){if(!t||!t.type.startsWith("image/"))return u(this,s,G).call(this,"Only images");if(t.size>5*1024*1024)return u(this,s,G).call(this,"Max 5MB");const e=new FileReader;e.onload=()=>{if(!(!n(this,l).cropImage||!n(this,l).cropModal)){if(n(this,l).cropImage.src=e.result,u(this,s,gt).call(this,n(this,l).cropModal),n(this,W)){try{n(this,W).destroy()}catch{}M(this,W,null)}n(this,l).cropImage.onload=()=>{const o=()=>{if(!window.Cropper){setTimeout(o,100);return}if(n(this,W))try{n(this,W).destroy()}catch{}M(this,W,new Cropper(n(this,l).cropImage,{aspectRatio:1,viewMode:1,dragMode:"move",autoCropArea:.9,background:!1,guides:!1,center:!0}))};o()}}},e.readAsDataURL(t),n(this,l).avatarInput&&(n(this,l).avatarInput.value=""),n(this,l).changeAvatarInput&&(n(this,l).changeAvatarInput.value="")},Mt=function(){if(u(this,s,K).call(this,n(this,l).cropModal),n(this,W)){try{n(this,W).destroy()}catch{}M(this,W,null)}n(this,l).cropImage&&(n(this,l).cropImage.src="")},De=async function(){if(!n(this,W))return u(this,s,G).call(this,"No image");const t=n(this,l).saveCrop;t&&(t.disabled=!0,t.textContent="Uploading...");try{const e=n(this,W).getCroppedCanvas({width:512,height:512,imageSmoothingEnabled:!0,imageSmoothingQuality:"high"}),o=e.toDataURL("image/jpeg",.85);M(this,tt,o),n(this,l).avatarPreview&&(n(this,l).avatarPreview.innerHTML=`<img src="${o}" style="width:100%;height:100%;border-radius:50%;object-fit:cover;">`),n(this,T)&&document.querySelectorAll("#userAvatar,#panelAvatar,[data-user-avatar]").forEach(c=>c.src=o);const i=await new Promise(c=>e.toBlob(c,"image/jpeg",.85)),r=new FormData;r.append("file",i,`avatar-${Date.now()}.jpg`),r.append("folder","avatars");let d=null;try{const h=await(await fetch(`${U.API_URL}/api/upload`,{method:"POST",body:r})).json();h.success&&h.url&&(d=h.url)}catch{}const p=d||o;M(this,tt,p),n(this,T)?(n(this,T).avatar=p,localStorage.setItem("dopetone_user",JSON.stringify(n(this,T))),fetch(`${U.API_URL}/api/auth/update-avatar`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email:n(this,T).email,avatar:p})}).catch(()=>{}),this.syncToCloud(),u(this,s,dt).call(this),u(this,s,G).call(this,"Avatar updated!")):u(this,s,G).call(this,"Avatar ready"),u(this,s,Mt).call(this)}catch(e){u(this,s,G).call(this,"Failed: "+e.message)}finally{t&&(t.disabled=!1,t.textContent="Save & Update Instantly")}},Me=async function(){var t;u(this,s,K).call(this,n(this,l).logoutModal),await this.syncToCloud(),localStorage.removeItem("dopetone_user"),localStorage.removeItem("dopetone_user_id"),M(this,T,null),M(this,tt,U.DEFAULT_AVATAR),(t=B("accountPanel"))==null||t.classList.remove("active"),u(this,s,dt).call(this),u(this,s,G).call(this,"Logged out"),window.dispatchEvent(new CustomEvent("auth:logout")),sessionStorage.setItem("just_logged_out","1"),setTimeout(()=>location.href=location.pathname,600)},Re=function(){localStorage.removeItem("dopetone_user"),localStorage.removeItem("dopetone_user_id"),sessionStorage.clear()},dt=function(){var p,c,h,f,w,g;const t=localStorage.getItem("dopetone_user");M(this,T,t?JSON.parse(t):null);const e=!!n(this,T),o=((p=n(this,T))==null?void 0:p.email)===U.ADMIN_EMAIL;document.body.classList.toggle("logged-in",e),document.body.classList.toggle("is-admin",o&&e);const i=((c=n(this,T))==null?void 0:c.avatar)||U.DEFAULT_AVATAR,r=((h=n(this,T))==null?void 0:h.username)||((w=(f=n(this,T))==null?void 0:f.email)==null?void 0:w.split("@")[0])||"Guest";Object.entries({authGuest:e?"none":"flex",authUser:e?"flex":"none",controlCenterBtn:o?"flex":"none"}).forEach(([x,v])=>{const I=B(x);I&&(I.style.display=v)}),["userAvatar","panelAvatar","mobileProfileAvatar"].forEach(x=>{const v=B(x);v&&(v.src=e?i:U.DEFAULT_AVATAR,v.onerror=()=>v.src=U.DEFAULT_AVATAR)}),B("panelName")&&(B("panelName").textContent=r),B("panelEmail")&&(B("panelEmail").textContent=((g=n(this,T))==null?void 0:g.email)||""),B("mobileProfileName")&&(B("mobileProfileName").textContent=e?r:"Guest"),B("mobileProfileSub")&&(B("mobileProfileSub").textContent=e?n(this,T).email:"Tap to sign in"),this.updateCartCount()},ot=function(t){if(!n(this,l).authError)return alert(t);n(this,l).authError.textContent=t,n(this,l).authError.style.display="block"},Wt=function(){n(this,l).authError&&(n(this,l).authError.style.display="none")},G=function(t){const e=n(this,l).authToast;e&&(n(this,l).authToastText&&(n(this,l).authToastText.textContent=t),e.classList.add("active"),setTimeout(()=>e.classList.remove("active"),2200))};window.Auth||(window.Auth=new oa);window.initAuth=()=>{var a;return(a=window.Auth)==null?void 0:a.init()};window.refreshCartUI=()=>{var a;(a=window.Auth)==null||a.updateCartCount(),window.dispatchEvent(new Event("cartUpdated"))};window.getCurrentUserId=()=>{var a,t;return((t=(a=window.Auth)==null?void 0:a._user)==null?void 0:t.id)||localStorage.getItem("dopetone_user_id")||localStorage.getItem("dt_anon_id")||"anonymous"};Ee();window.DTStore=X;console.log("%c DOPE TONE V2 - HASH ONLY ","background:#FF1E3C;color:white;padding:6px 12px;border-radius:8px;font-weight:900");async function ue(){console.log("[V2 APP] Booting...");try{Ee()}catch(o){console.error("auth modals",o)}try{Ut(),ta()}catch(o){console.error(o)}try{He(),Je(),fe()}catch(o){console.error(o)}const a=document.getElementById("left-sidebar"),t=document.getElementById("right-sidebar");let e=document.getElementById("sidebar-overlay");e||(e=document.createElement("div"),e.id="sidebar-overlay",e.style.cssText="position:fixed;inset:0;z-index:10001;background:rgba(5,10,20,.6);backdrop-filter:blur(10px);opacity:0;pointer-events:none;transition:.3s;",document.body.appendChild(e)),window.innerWidth>1024?(localStorage.getItem("dt_left_collapsed")==="true"&&(a==null||a.classList.add("collapsed")),localStorage.getItem("dt_right_collapsed")==="true"&&(t==null||t.classList.add("collapsed"))):t&&(t.style.display="none"),window.toggleLeft=()=>{var o;if(a){if(window.innerWidth<=1024){const i=a.classList.toggle("open");e.classList.toggle("active",i),e.style.opacity=i?"1":"0",e.style.pointerEvents=i?"auto":"none",(o=document.getElementById("main-row"))==null||o.classList.toggle("sidebar-open",i),document.body.classList.toggle("sidebar-drawer-open",i);return}a.classList.toggle("collapsed"),localStorage.setItem("dt_left_collapsed",a.classList.contains("collapsed"))}},window.toggleRight=()=>{!t||window.innerWidth<=1024||(t.classList.toggle("collapsed"),localStorage.setItem("dt_right_collapsed",t.classList.contains("collapsed")))},window.closeLeft=()=>{var o;a==null||a.classList.remove("open"),e==null||e.classList.remove("active"),e&&(e.style.opacity="0",e.style.pointerEvents="none"),(o=document.getElementById("main-row"))==null||o.classList.remove("sidebar-open"),document.body.classList.remove("sidebar-drawer-open")},e.addEventListener("click",window.closeLeft);try{const[o,i]=await Promise.all([$e(),je().catch(()=>({}))]);X.beats=Array.isArray(o)?o:[],X.filteredBeats=X.beats,X.loaded=!0,X.overview=i||{},window.__BEATS__=X.beats,console.log("[V2 APP] beats loaded:",X.beats.length)}catch(o){console.error(o),X.beats=[],X.filteredBeats=[],X.loaded=!0}document.documentElement.classList.add("loaded");try{ia()}catch{}window.addEventListener("hashchange",()=>{var o;return(o=window.closeLeft)==null?void 0:o.call(window)}),console.log("%c DOPE TONE V2 READY ","background:#E2FF54;color:#050505;padding:6px 12px;border-radius:8px;font-weight:900")}document.readyState==="loading"?document.addEventListener("DOMContentLoaded",ue,{once:!0}):ue();export{$ as _,X as s};
