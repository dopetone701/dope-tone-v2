// src/core/menu-armburger.js - FIXED - ALL EXPORTS - D1 SAFE + LICENCE POPUP
export function initArmburger(){
  const btn=document.getElementById("armburgerBtn");
  const menu=document.getElementById("armburgerMenu");
  if(!btn||!menu) return;
  btn.onclick=e=>{e.stopPropagation();menu.classList.toggle("active");};
  document.addEventListener("click",e=>{
    if(!e.target.closest("#armburgerMenu")&&!e.target.closest("#armburgerBtn")) menu.classList.remove("active");
  });
}

export function closeAllMenus(){
  document.querySelectorAll(".dt-row-menu.active,.pyramid-menu.active").forEach(m=>m.classList.remove("active"));
  document.querySelectorAll(".wave-row,.yt-track").forEach(r=>r.style.zIndex="1");
  document.getElementById("menuOverlay")?.classList.remove("active");
}

export function openMenuOverlay(){
  document.getElementById("menuOverlay")?.classList.add("active");
}

function getLikesIdsSafe(){
  try{
    const raw = localStorage.getItem("dopetone_likes");
    if(!raw) return [];
    const d = JSON.parse(raw);
    if(Array.isArray(d)) return d.map(String);
    if(d && typeof d === 'object') return Object.keys(d).map(String);
    return [];
  }catch{return [];}
}
function isLikedSafe(id){
  return getLikesIdsSafe().includes(String(id));
}

export function createDotsMenu(beat, handlers){
  const mode=String(beat.monetization_mode||beat.monetizationMode||"paid").toLowerCase();
  const liked=isLikedSafe(beat.id);
  const price=Number(beat.price>=1000?beat.price/100:beat.price||29.99).toFixed(2);
  const wrap=document.createElement("div");
  wrap.className="dt-dots-wrap pyramid-dots-wrap";
  wrap.innerHTML=`
    <button class="wave-dots pyramid-dots" type="button"><svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><circle cx="12" cy="5" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="12" cy="19" r="2"/></svg></button>
    <div class="pyramid-menu dt-row-menu">
      <button data-act="goto"><span>🎧</span> Go to beat</button>
      <button data-act="playlist"><span>➕</span> Add to playlist</button>
      <button data-act="like"><span>${liked?'❤️':'🤍'}</span> ${liked?'Unlike':'Like beat'}</button>
      <button data-act="share"><span>🔗</span> Share beat</button>
      ${mode!=="paid"?`<button data-act="download"><span>⬇️</span> Download</button>`:""}
      <button data-act="cart"><span>🛒</span> Add to cart</button>
      <button data-act="buy" class="dt-menu-buy"><span>💳</span> Buy • $${price}</button>
    </div>`;
  const btn=wrap.querySelector(".wave-dots");
  const menu=wrap.querySelector(".pyramid-menu");
  btn.onclick=e=>{
    e.stopPropagation();
    const was=menu.classList.contains("active");
    closeAllMenus();
    if(!was){
      menu.classList.add("active");
      wrap.closest(".wave-row,.yt-track,.pyramid-card")?.style&&(wrap.closest(".wave-row,.yt-track,.pyramid-card").style.zIndex="9999");
      openMenuOverlay();
      requestAnimationFrame(()=>{
        const r=menu.getBoundingClientRect();
        if(r.right>window.innerWidth-12){menu.style.left="auto";menu.style.right="0";menu.style.transform="none";}
        if(r.left<12){menu.style.left="0";menu.style.right="auto";menu.style.transform="none";}
        if(r.bottom>window.innerHeight-20){menu.style.top="auto";menu.style.bottom="38px";}
      });
    }
  };
  menu.onclick=async e=>{
    e.stopPropagation();
    const act=e.target.closest("button")?.dataset.act;
    if(!act) return;
    closeAllMenus();

    // BUY & CART = LICENCE POPUP
    if(act==="buy" || act==="cart"){
      const mod = await import("../features/licence/licence.js");
      mod.openLicencePopup(beat, beat.selected_licence||'basic');
      return;
    }

    handlers?.[act]?.(beat);
  };
  return wrap;
}
document.addEventListener("click",e=>{ if(!e.target.closest(".dt-dots-wrap")&&!e.target.closest(".pyramid-dots-wrap")) closeAllMenus(); });
