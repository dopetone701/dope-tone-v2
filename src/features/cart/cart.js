// src/features/cart/cart.js - FINAL FIXED V7 - TRUE BASIC PRICING + COLOR ADOPTION

const PLAY_SVG = `<svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20"><path d="M8 5.14v13.72L19 12 8 5.14z"/></svg>`;
const PAUSE_SVG = `<svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20"><path d="M7 5h4v14H7V5zm6 0h4v14h-4V5z"/></svg>`;

const IMAGE_BASE = new URL("../../../public/images", import.meta.url).href;
const img = (p) => `${IMAGE_BASE}/${p}`;

const esc = s => String(s??'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#039;');
const fix = v => { let p=Number(v); if(!Number.isFinite(p)) return 29.99; if(p>=1000) p/=100; return Number(p.toFixed(2)); };

const LICENCES = ["free","basic","pro","exclusive"];

function getCart(){ try{return JSON.parse(localStorage.getItem("dopetone_cart")||"[]")}catch{return []} }
function saveCart(c){ localStorage.setItem("dopetone_cart", JSON.stringify(c)); window.dispatchEvent(new CustomEvent("cc_cart_updated",{detail:{count:c.length}})); }
function getBeats(){ return window.__BEATS__ || window.DTStore?.beats || []; }

// TRUE PRICING - BASIC IS TRUTH
function getBasicPrice(beat){
  // this is the real track price
  const raw = beat.price?? beat.base_price?? beat.basic_price?? 29.99;
  return fix(raw);
}
function licencePrice(beat, lic){
  lic = String(lic).toLowerCase();
  const basic = getBasicPrice(beat); // <-- TRUE PRICE FROM D1
  if(lic==="free") return 0;
  if(lic==="basic") return basic;
  if(lic==="pro") return fix(basic * 2.2); // PRO = BASIC * 2.2
  if(lic==="exclusive") return fix(Math.max(basic * 10, 149)); // EXCLUSIVE = BASIC * 10
  return basic;
}

// DOMINANT COLOR - RESTORED
async function getDominantColor(url){
  return new Promise(resolve=>{
    const im=new Image(); im.crossOrigin="anonymous"; im.src=url;
    im.onload=()=>{
      try{
        const canvas=document.createElement("canvas"), ctx=canvas.getContext("2d",{willReadFrequently:true});
        canvas.width=64; canvas.height=64; ctx.drawImage(im,0,0,64,64);
        const data=ctx.getImageData(0,0,64,64).data;
        let r=0,g=0,b=0,n=0;
        for(let i=0;i<data.length;i+=16){
          const rr=data[i], gg=data[i+1], bb=data[i+2], bright=rr+gg+bb;
          if(bright<30||bright>700) continue;
          r+=rr; g+=gg; b+=bb; n++;
        }
        if(!n) return resolve({r:14,g:28,b:56});
        resolve({r:Math.round(r/n), g:Math.round(g/n), b:Math.round(b/n)});
      }catch{ resolve({r:14,g:28,b:56}); }
    };
    im.onerror=()=>resolve({r:14,g:28,b:56});
    setTimeout(()=>resolve({r:14,g:28,b:56}),1500);
  });
}

export async function renderCart(){
  if(!document.getElementById("cart-css")){
    const l=document.createElement("link"); l.id="cart-css"; l.rel="stylesheet"; l.href="/src/features/cart/cart.css";
    document.head.appendChild(l);
  }
  return `<div id="cartMount"></div>`;
}

export async function initCart(){
  const mount=document.getElementById("cartMount");
  if(!mount) return;

  function syncPlayIcons(){
    const audio=document.querySelector("audio")||window.__DT_AUDIO__;
    const idx=window.__CURRENT_INDEX__;
    const all=getBeats();
    document.querySelectorAll(".c-card").forEach(card=>{
      const id=card.dataset.id;
      const playing = all[idx] && String(all[idx].id)===String(id) && audio &&!audio.paused;
      card.classList.toggle("playing",!!playing);
      const btn=card.querySelector(".c-play");
      if(btn) btn.innerHTML = playing? PAUSE_SVG : PLAY_SVG;
    });
  }

  function updateSummary(){
    const cur=getCart();
    let total=0; cur.forEach(b=> total+=licencePrice(b, b.selected_licence||'basic'));
    const h1=document.querySelector(".cart-head h1");
    if(h1) h1.innerHTML=`Cart <span>${cur.length} beats</span>`;
    const sum=document.getElementById("cartSummary");
    if(!sum) return;
    sum.innerHTML=`
      <div class="sum-box">
        <h3>Order Summary</h3>
        <div class="sum-row"><span>Beats (${cur.length})</span><span>$${total.toFixed(2)}</span></div>
        <div class="sum-row"><span>Fees</span><span style="color:#2ECC71">$0.00</span></div>
        <div class="sum-div"></div>
        <div class="sum-row big"><span>Total</span><span>$${total.toFixed(2)}</span></div>
        <button class="sum-check" id="goCheck">Checkout • $${total.toFixed(2)}</button>
        <div class="sum-safe">🔒 Secure • Instant Delivery</div>
      </div>`;
    document.getElementById("goCheck").onclick=()=> location.hash = total===0? 'beats' : `licence?id=${cur[0]?.id||''}&lic=${cur[0]?.selected_licence||'basic'}`;
  }

  function drawEmpty(){
    mount.innerHTML=`
      <div class="cart-root">
        <div class="cart-bg"></div>
        <div class="cart-wrap empty">
          <img src="${img("cart-empty.png")}" class="empty-img" alt="empty" />
          <h2>Your Cart Is Empty</h2>
          <p>Add some fire. Beats you add will live here.</p>
          <button class="btn-red" onclick="location.hash='beats'">Browse Beats</button>
        </div>
      </div>`;
  }

  function drawList(){
    const cart=getCart();
    if(cart.length===0){ drawEmpty(); return; }

    mount.innerHTML=`
      <div class="cart-root">
        <div class="cart-bg"></div>
        <div class="cart-wrap">
          <div class="cart-head"><h1>Cart <span>${cart.length} beats</span></h1><button id="clearCart" class="btn-ghost">Clear all</button></div>
          <div class="cart-list" id="cartList"></div>
          <div class="cart-summary" id="cartSummary"></div>
        </div>
      </div>`;

    const list=document.getElementById("cartList");

    cart.forEach(beat=>{
      if(!beat.selected_licence) beat.selected_licence="basic";
      const curPrice = licencePrice(beat, beat.selected_licence);
      const basic = getBasicPrice(beat);

      const card=document.createElement("div");
      card.className="c-card"; card.dataset.id=beat.id;
      card.innerHTML=`
        <div class="c-card-bg" id="bg-${beat.id}"></div>
        <div class="c-inner">
          <div class="c-cover" data-play>
            <img src="${esc(beat.cover_url||'/images/studio.jpg')}" crossorigin="anonymous" />
            <div class="c-play">${PLAY_SVG}</div>
          </div>
          <div class="c-info">
            <div class="c-topline">
              <div class="c-title">${esc(beat.title)}</div>
              <button class="c-x" data-remove>✕</button>
            </div>
            <div class="c-meta">${esc(beat.genre||'Genre')} • ${beat.bpm||'--'} BPM • ${esc(beat.key||'--')} • Basic $${basic.toFixed(2)}</div>
            <div class="c-pills">
              ${LICENCES.map(l=>{
                const p=licencePrice(beat,l);
                return `<button class="c-pill ${beat.selected_licence===l?'on':''}" data-lic="${l}">${l.toUpperCase()} <i>${l==='free'?'FREE':'$'+p.toFixed(2)}</i></button>`
              }).join('')}
            </div>
            <div class="c-bottom">
              <div class="c-price" data-price>$${curPrice.toFixed(2)}</div>
              <button class="c-lic" data-licview>View Licence</button>
            </div>
          </div>
        </div>`;

      // RESTORE COLOR ADOPTION - THIS WAS MISSING
      getDominantColor(beat.cover_url).then(col=>{
        const bg=card.querySelector(".c-card-bg");
        if(bg){
          bg.style.background = `radial-gradient(130% 130% at 15% 0%, rgba(${col.r},${col.g},${col.b},0.85) 0%, rgba(${col.r},${col.g},${col.b},0.45) 30%, rgba(${col.r},${col.g},${col.b},0.18) 55%, rgba(10,16,32,0.96) 82%)`;
        }
        card.style.borderColor = `rgba(${col.r},${col.g},${col.b},0.32)`;
        card.style.boxShadow = `0 0 0 1px rgba(${col.r},${col.g},${col.b},0.12), 0 8px 24px rgba(${col.r},${col.g},${col.b},0.18)`;
      });

      // PLAY TOGGLE FIXED
      card.querySelector("[data-play]").onclick=()=>{
        const all=getBeats();
        let idx=all.findIndex(b=>String(b.id)===String(beat.id));
        if(idx===-1){ all.unshift(beat); window.__BEATS__=all; idx=0; }
        const audio=document.querySelector("audio")||window.__DT_AUDIO__;
        const isPlaying = all[window.__CURRENT_INDEX__] && String(all[window.__CURRENT_INDEX__].id)===String(beat.id) && audio &&!audio.paused;
        if(isPlaying){ audio.pause(); window.globalPlayer?.pause?.(); }
        else { window.globalPlayer?.play?.(idx, all, "cart"); }
      };

      // REMOVE - NO FULL RERENDER
      card.querySelector("[data-remove]").onclick=()=>{
        const newCart=getCart().filter(b=>String(b.id)!==String(beat.id));
        saveCart(newCart);
        card.style.transition="all.18s"; card.style.transform="scale(.97)"; card.style.opacity="0";
        setTimeout(()=>{
          card.remove();
          if(getCart().length===0) drawEmpty(); else updateSummary();
        },180);
      };

      // LICENCE TOGGLE - NO BLINK - UPDATE IN PLACE
      card.querySelectorAll("[data-lic]").forEach(pill=>{
        pill.onclick=()=>{
          const newLic=pill.dataset.lic;
          const allCart=getCart();
          const item=allCart.find(b=>String(b.id)===String(beat.id));
          if(!item) return;
          item.selected_licence=newLic;
          saveCart(allCart);
          // update only this card
          card.querySelectorAll(".c-pill").forEach(p=>p.classList.toggle("on", p.dataset.lic===newLic));
          card.querySelector("[data-price]").textContent=`$${licencePrice(item,newLic).toFixed(2)}`;
          updateSummary();
        };
      });

      card.querySelector("[data-licview]").onclick=async()=>{
  const mod = await import("../licence/licence.js");
  mod.openLicencePopup(beat, beat.selected_licence||'basic', (newLic, newPrice)=>{
    // no blink update
    card.querySelectorAll(".c-pill").forEach(p=>p.classList.toggle("on", p.dataset.lic===newLic));
    card.querySelector("[data-price]").textContent=`$${newPrice.toFixed(2)}`;
    const cur=JSON.parse(localStorage.getItem("dopetone_cart")||"[]");
    const it=cur.find(b=>String(b.id)===String(beat.id));
    if(it){ it.selected_licence=newLic; }
    // update summary
    let total=0; cur.forEach(b=>{
      const basic=Number(b.price)||29.99;
      let pr=basic; if(b.selected_licence==="pro") pr=basic*2.2; if(b.selected_licence==="exclusive") pr=Math.max(basic*10,149); if(b.selected_licence==="free") pr=0;
      total+=pr;
    });
    const sumEl=document.getElementById("cartSummary");
    if(sumEl) sumEl.querySelector(".big span:last-child").textContent=`$${total.toFixed(2)}`;
    const check=document.getElementById("goCheck");
    if(check) check.textContent=`Checkout • $${total.toFixed(2)}`;
  });
};


      list.appendChild(card);
    });

    updateSummary();
    syncPlayIcons();

    document.getElementById("clearCart").onclick=()=>{
      if(confirm("Clear cart?")){ saveCart([]); drawEmpty(); }
    };
  }

  drawList();

  // PLAY LISTENERS
  document.addEventListener("playerPlay", syncPlayIcons);
  document.addEventListener("playerPause", syncPlayIcons);
}
