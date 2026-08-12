import { createDotsMenu, closeAllMenus as closeAllShared, openMenuOverlay as openOverlayShared } from "../core/menu-armburger.js";
import { renderSimilarTracks } from "../features/similar/similar-tracks.js";

// ============================================================
// DOPE TONE PLAYLIST — PYRAMID VAULT V6 PRO FINAL
// • SVG hearts lower, pro menu order, overlay, pro delete, native share
// ============================================================

export function renderPlaylistPage(){
  return `
    <div id="playlistMount"></div>

    <!-- CREATE / RENAME MODAL -->
    <div id="pyramidModal" class="pyramid-modal">
      <div class="pyramid-modal-backdrop"></div>
      <div class="pyramid-modal-card">
        <div class="pm-head">
          <h3 id="pmTitle">Create Vault</h3>
          <button class="pm-close" id="pmClose">✕</button>
        </div>
        <p class="pm-sub" id="pmSub">Name your pyramid vault</p>
        <input id="pmInput" class="pm-input" placeholder="e.g. Late Night Vibes" maxlength="22" />
        <div class="pm-error" id="pmError"></div>
        <div class="pm-actions">
          <button class="pm-btn pm-cancel" id="pmCancel">Cancel</button>
          <button class="pm-btn pm-create" id="pmConfirm">Create Vault</button>
        </div>
        <div class="pm-limit"><span id="pmLimitText">0/3 vaults used</span></div>
      </div>
    </div>

    <!-- DELETE PRO MODAL -->
    <div id="deleteModal" class="pyramid-modal">
      <div class="pyramid-modal-backdrop" id="delBackdrop"></div>
      <div class="pyramid-modal-card del-card">
        <div class="del-icon">🗑️</div>
        <h3 id="delTitle">Delete Vault?</h3>
        <p class="pm-sub" id="delSub">This will permanently delete all tracks in this vault.</p>
        <p class="del-type-hint">Type <b id="delNameHint"></b> to confirm</p>
        <input id="delInput" class="pm-input del-input" placeholder="Type vault name" />
        <div class="pm-error" id="delError"></div>
        <div class="pm-actions">
          <button class="pm-btn pm-cancel" id="delCancel">Cancel</button>
          <button class="pm-btn del-confirm" id="delConfirm">Delete Vault</button>
        </div>
      </div>
    </div>

    <!-- SHARE WIDGET MODAL -->
    <div id="shareModal" class="pyramid-modal">
      <div class="pyramid-modal-backdrop" id="shareBackdrop"></div>
      <div class="pyramid-modal-card share-card">
        <div class="pm-head"><h3>Share Playlist</h3><button class="pm-close" id="shareClose">✕</button></div>
        <div class="share-link-box"><input id="shareLink" class="pm-input" readonly /><button class="pm-btn pm-create small" id="copyLink">Copy</button></div>
        <div class="share-grid">
          <button class="share-opt" data-share="whatsapp">WhatsApp</button>
          <button class="share-opt" data-share="twitter">X / Twitter</button>
          <button class="share-opt" data-share="native">More •••</button>
        </div>
        <div class="pm-sub" id="shareCount"></div>
      </div>
    </div>

    <!-- ADD TRACKS MODAL - CHECKMARK UP TO 10 -->
<div id="addTrackModal" class="pyramid-modal">
  <div class="pyramid-modal-backdrop" id="addTrackBackdrop"></div>
  <div class="pyramid-modal-card add-card">
    <div class="pm-head"><h3 id="addTitle">Add Tracks</h3><button class="pm-close" id="addClose">✕</button></div>
    <p class="pm-sub" id="addSub">Select up to 10 beats • Tap to check</p>
    <div class="add-search-wrap"><input id="addSearch" class="pm-input" placeholder="Search beats..." /></div>
    <div id="addList" class="add-list"></div>
    <div class="pm-actions">
      <span id="addCount" class="add-count">0 / 10 selected</span>
      <button class="pm-btn pm-cancel" id="addCancel">Cancel</button>
      <button class="pm-btn pm-create" id="addConfirm">Add Selected</button>
    </div>
    <button class="add-more-btn" id="addMore">+ Add More from Arsenal →</button>
  </div>
</div>

<!-- LIKE TO ADD PRO POPUP -->
<div id="likePopup" class="pyramid-modal">
  <div class="pyramid-modal-backdrop" id="likeBackdrop"></div>
  <div class="pyramid-modal-card like-card">
    <div class="like-emoji">💿❤️</div>
    <h3>Like more vybs 😊</h3>
    <p class="pm-sub">Go to Arsenal and hit the heart on any beat. It will instantly appear in your vaults.</p>
    <div class="pm-actions"><button class="pm-btn pm-cancel" id="likeCancel">Later</button><button class="pm-btn pm-create" id="likeGo">Go to Arsenal →</button></div>
  </div>
</div>


    <link rel="stylesheet" href="/src/pages/playlist-page.css" />
    <link rel="stylesheet" href="/src/features/similar/similar-tracks.css" />

  `;
}

export async function initPlaylistPage(){
  const mount = document.getElementById("playlistMount");
  if(!mount) return;

  // DETACH ALL MODALS FROM NAV - PORTAL TO BODY
["pyramidModal","deleteModal","shareModal","addTrackModal","likePopup"].forEach(id=>{
  const el=document.getElementById(id);
  if(el) document.body.appendChild(el);
});


  const IMAGE_BASE = new URL("../../public/images", import.meta.url).href;
  const img = (p) => `${IMAGE_BASE}/${p}`;
  const STORAGE_KEY = "dopetone_playlists";
  const LIKES_KEY = "dopetone_likes";
  const LIMIT = 3;

  const HEART_SVG = `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>`;

  const getBeats = () => window.__BEATS__ || window.DTStore?.beats || window.store?.beats || [];
  const getLikesIds = () => { try{return JSON.parse(localStorage.getItem(LIKES_KEY)||"[]").map(String);}catch{return[];} };
  const resolveBeats = (ids) => { const all=getBeats(); return ids.map(id=>all.find(b=>String(b.id)===String(id))).filter(Boolean); };
  let store = (()=>{ try{return JSON.parse(localStorage.getItem(STORAGE_KEY)||"[]");}catch{return[];}})().map(p=>({id:String(p.id),name:p.name,beats:(p.beats||p.tracks||[]).map(String)}));
  const saveStore = () => localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
  const getCover = (ids) => { const f=getBeats().find(b=>String(b.id)===String(ids[0])); return f?.cover_url||f?.cover||img("studio.jpg"); };
  const getBeatById = (id) => getBeats().find(b=>String(b.id)===String(id));

  let activeId=null, modalMode="create", renameTargetId=null, deleteTargetId=null, shareIds=[];

  // MODALS
  const pModal=document.getElementById("pyramidModal"), dModal=document.getElementById("deleteModal"), sModal=document.getElementById("shareModal");
  const pmInput=document.getElementById("pmInput"), pmError=document.getElementById("pmError"), pmTitle=document.getElementById("pmTitle"), pmSub=document.getElementById("pmSub"), pmConfirm=document.getElementById("pmConfirm"), pmLimitText=document.getElementById("pmLimitText");
  const delInput=document.getElementById("delInput"), delError=document.getElementById("delError"), delNameHint=document.getElementById("delNameHint"), delTitle=document.getElementById("delTitle"), delSub=document.getElementById("delSub");
  const shareLink=document.getElementById("shareLink"), shareCount=document.getElementById("shareCount");

  const openCreateModal = () => {
    if(store.length>=LIMIT) return;
    modalMode="create"; renameTargetId=null;
    pmTitle.textContent="Create Vault"; pmSub.textContent="Name your pyramid vault"; pmConfirm.textContent="Create Vault";
    pmLimitText.textContent=`${store.length}/${LIMIT} vaults used`; pmInput.value=""; pmError.textContent=""; pModal.classList.add("open");
    setTimeout(()=>pmInput.focus(),80);
  };
  const openRenameModal = (id) => {
    const p=store.find(x=>x.id===id); if(!p) return;
    modalMode="rename"; renameTargetId=id;
    pmTitle.textContent="Rename Vault"; pmSub.textContent=`Renaming "${p.name}"`; pmConfirm.textContent="Save Name";
    pmInput.value=p.name; pmError.textContent=""; pModal.classList.add("open");
  };
  const closePModal = () => pModal.classList.remove("open");
  document.getElementById("pmClose")?.addEventListener("click", closePModal);
  document.getElementById("pmCancel")?.addEventListener("click", closePModal);
  document.querySelector("#pyramidModal.pyramid-modal-backdrop")?.addEventListener("click", closePModal);
  pmConfirm?.addEventListener("click", ()=>{
    const name=pmInput.value.trim(); if(!name){pmError.textContent="Name required";return;}
    if(modalMode==="create"){
      if(store.find(p=>p.name.toLowerCase()===name.toLowerCase())){pmError.textContent="Name exists";return;}
      store.push({id:"vault_"+Date.now(),name,beats:[]});
    }else{ const t=store.find(p=>p.id===renameTargetId); if(t) t.name=name; }
    saveStore(); closePModal(); renderPyramids();
  });

  const openDeleteModal = (id) => {
    const p=store.find(x=>x.id===id); if(!p) return;
    deleteTargetId=id; delNameHint.textContent=p.name; delTitle.textContent=`Delete "${p.name}"?`;
    delSub.textContent=`This will permanently delete ${p.beats.length} tracks from this vault.`; delInput.value=""; delError.textContent=""; dModal.classList.add("open");
  };
  const closeDModal = () => dModal.classList.remove("open");
  document.getElementById("delCancel")?.addEventListener("click", closeDModal);
  document.getElementById("delBackdrop")?.addEventListener("click", closeDModal);
  document.getElementById("delConfirm")?.addEventListener("click", ()=>{
    const p=store.find(x=>x.id===deleteTargetId); if(!p) return;
    if(delInput.value.trim()!==p.name){delError.textContent=`Type exactly "${p.name}"`;return;}
    store=store.filter(x=>x.id!==deleteTargetId); saveStore(); activeId=null; closeDModal(); renderPyramids();
  });

  const openShareModal = (ids) => {
    shareIds=ids;
    const link=`${location.origin}/playlists?tracks=${ids.join(",")}&vault=${activeId||"shared"}`;
    shareLink.value=link; shareCount.textContent=`${ids.length} tracks • Link works on PC & mobile`;
    sModal.classList.add("open");
  };
  const closeSModal = () => sModal.classList.remove("open");
  document.getElementById("shareClose")?.addEventListener("click", closeSModal);
  document.getElementById("shareBackdrop")?.addEventListener("click", closeSModal);
  document.getElementById("copyLink")?.addEventListener("click", async()=>{
    try{ await navigator.clipboard.writeText(shareLink.value); document.getElementById("copyLink").textContent="Copied!"; setTimeout(()=>document.getElementById("copyLink").textContent="Copy",1200);}catch{ shareLink.select(); document.execCommand("copy"); }
  });
  document.querySelectorAll(".share-opt").forEach(btn=>{
    btn.addEventListener("click", async()=>{
      const link=shareLink.value; const text=`Check my ${activeId==="liked"?"LIKED":""} vault on DOPE TONE: `;
      const type=btn.dataset.share;
      if(type==="native" && navigator.share){
        try{ await navigator.share({title:"DOPE TONE Playlist", text, url:link}); }catch{}
      } else if(type==="whatsapp"){ window.open(`https://wa.me/?text=${encodeURIComponent(text+" "+link)}`,"_blank"); }
      else if(type==="twitter"){ window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(link)}`,"_blank"); }
    });
  });

  // BG LIKE SPOTIFY
  const setDynamicBg = (beat) => {
    const bg=document.getElementById("dynamicBg"); if(!bg||!beat) return;
    const cover=beat.cover_url||beat.cover||""; bg.style.backgroundImage=`url('${cover}')`; bg.style.opacity="1";
  };

  const triggerHearts = () => {
    const container=document.getElementById("heartFallInner"); if(!container) return;
    container.innerHTML="";
    for(let i=0;i<22;i++){
      const h=document.createElement("div"); h.className="falling-heart";
      h.innerHTML=HEART_SVG;
      h.style.left=(2+Math.random()*96)+"%";
      h.style.animationDelay=(Math.random()*1.8)+"s";
      h.style.animationDuration=(3.5+Math.random()*3.2)+"s";
      const size=16+Math.random()*20; h.style.width=size+"px"; h.style.height=size+"px";
      h.style.color=i%3===0?"#FF1E3C":i%3===1?"#FF5A76":"#FF1E3C";
      h.style.opacity=(0.55+Math.random()*0.45).toFixed(2);
      container.appendChild(h);
    }
    setTimeout(()=>container.innerHTML="",7500);
  };

  const closeAllMenus = () => {
  closeAllShared();
  document.getElementById("menuOverlay")?.classList.remove("active");
};
const openMenuOverlay = () => {
  document.getElementById("menuOverlay")?.classList.add("active");
};

  const handleMenuAct = (act,id) => {
    const isLiked=id==="liked"; let beatIds=isLiked?getLikesIds():(store.find(p=>p.id===id)?.beats||[]);
if(act==="add"){ openAddTrackModal(id); }
    if(act==="reshuffle"){
      const shuffled=[...beatIds].sort(()=>Math.random()-0.5);
      if(isLiked) localStorage.setItem(LIKES_KEY, JSON.stringify(shuffled)); else { const p=store.find(x=>x.id===id); if(p) p.beats=shuffled; saveStore(); }
      openPlaylist(id);
    }
    if(act==="share") openShareModal(beatIds);
    if(act==="rename" &&!isLiked) openRenameModal(id);
    if(act==="refill" &&!isLiked){
      if(!confirm("Clear all tracks?")) return;
      const p=store.find(x=>x.id===id); if(p) p.beats=[]; saveStore(); openPlaylist(id);
    }
    if(act==="delete" &&!isLiked) openDeleteModal(id);
  };

  const openPlaylist = (id) => {
  activeId=id;
  document.querySelectorAll(".pyramid-card").forEach(c=>c.classList.toggle("active", c.dataset.id===id));
  let beatIds=id==="liked"?getLikesIds():(store.find(p=>p.id===id)?.beats||[]);
  const beats=resolveBeats(beatIds);
  const list=document.getElementById("childrenList"); if(!list) return;
  if(!beats.length){ list.innerHTML=`<div class="empty-child">No beats yet — like more vybs 😊</div>`; return; }
  const vaultName=id==="liked"?"Liked Songs":store.find(p=>p.id===id)?.name||"";

  list.innerHTML=`<div class="section-head"><h2>${vaultName} • ${beats.length}</h2><div class="child-actions"><button class="view-all-btn" id="playAll">Play All ▶</button></div></div><div class="yt-music-grid" id="ytMusicGridInner"></div>`;
  const grid = document.getElementById("ytMusicGridInner");

  beats.forEach(b=>{
    const row = document.createElement("div");
    row.className="yt-track";
    row.dataset.bid=String(b.id);
    row.innerHTML=`<img src="${b.cover_url||b.cover||''}" loading="lazy"/><div class="yt-meta"><div class="yt-title">"${b.title||"Untitled"}" • BPM ${b.bpm||"--"}</div><div class="yt-artist">${b.genre||""} • DOPE TONE</div></div>`;

   




    // SAME MENU AS ARSENAL - FROM menu-armburger.js
    const dots = createDotsMenu(b, {
      goto: (beat)=>{ const idx=beats.findIndex(x=>String(x.id)===String(beat.id)); window.__CURRENT_BEAT__=beat; setDynamicBg(beat); if(window.globalPlayer?.play) window.globalPlayer.play(idx,beats,"playlist"); window.location.hash=`#/beat?id=${beat.id}`; },
      playlist: ()=> openAddTrackModal(id),
      like: (beat)=>{
        let likes=getLikesIds(); const bid=String(beat.id);
        if(likes.includes(bid)){ likes=likes.filter(x=>x!==bid); } else { likes=[...likes,bid]; }
        localStorage.setItem(LIKES_KEY, JSON.stringify(likes));
        if(activeId==="liked") openPlaylist("liked");
      },
      share: (beat)=> openShareModal([beat.id]),
      download: (beat)=>{ /* your download */ },
      cart: (beat)=>{ /* your cart */ },
      buy: (beat)=>{ /* your buy */ }
    });
    row.appendChild(dots);

    row.addEventListener("click", (e)=>{
      if(e.target.closest(".dt-dots-wrap")) return;
      const beat=getBeatById(row.dataset.bid); if(!beat) return;
      window.__CURRENT_BEAT__=beat; setDynamicBg(beat);
      if(window.globalPlayer?.play){ const idx=beats.findIndex(x=>String(x.id)===String(beat.id)); window.globalPlayer.play(idx,beats,"playlist"); }
    });

    grid.appendChild(row);
  });

  document.getElementById("playAll")?.addEventListener("click", ()=>{ if(beats[0]){ window.__CURRENT_BEAT__=beats[0]; setDynamicBg(beats[0]); window.globalPlayer?.play(0,beats,"playlist"); } });


  
// at bottom of openPlaylist()
const old = document.getElementById("similarMount");
if(old) old.remove();
const box = document.createElement("div");
box.id="similarMount";
list.appendChild(box);
renderSimilarTracks(beats, "similarMount");

};




  const renderPyramids = () => {
    const likedIds=getLikesIds(); const hasLiked=likedIds.length>0; const showPlus=store.length<LIMIT;
       const isFull = store.length >= LIMIT;
    mount.innerHTML=`
      <div class="pyramid-root">
        <div id="dynamicBg" class="dynamic-bg"></div>
        <div id="heartFallInner" class="hearts-inner"></div>
        <div id="menuOverlay" class="menu-overlay"></div>
        <div class="vault-header">
          <h1 class="vault-title-only">PLAYLISTS</h1>
          <div class="header-right">
            <span class="playlist-count ${isFull?'full':''}">${store.length}/${LIMIT} VAULTS</span>
            <button class="hdr-add ${isFull?'disabled':''}" id="hdrAdd" ${isFull?'disabled':''}>${isFull?'Vault Full':'+ New Vault'}</button>
          </div>
        </div>

        <div class="pyramid-mothers">
          ${hasLiked?`<div class="pyramid-card liked-card ${!activeId?'pump-once':''}" data-id="liked">
            <div class="pyramid-dots-wrap"><button class="pyramid-dots">⋮</button><div class="pyramid-menu">
              <button data-act="add"><span class="mi">+</span> Add Track</button>
              <button data-act="reshuffle"><span class="mi">🔀</span> Reshuffle Tracks</button>
              <button data-act="share"><span class="mi">🔗</span> Share Playlist</button>
            </div></div>
            <div class="pyramid-shape-wrap"><div class="pyramid-shape liked-shape"><img src="${getCover(likedIds)}" onerror="this.src='${img("studio.jpg")}'" /><div class="pyramid-heart-core">${HEART_SVG}</div></div></div>
            <div class="pyramid-label"><div class="pyramid-title">LIKED</div><div class="pyramid-sub">${likedIds.length} beats • Auto</div></div>
          </div>`:''}
          ${store.map(p=>`<div class="pyramid-card ${activeId===p.id?'active':''}" data-id="${p.id}">
            <div class="pyramid-dots-wrap"><button class="pyramid-dots">⋮</button><div class="pyramid-menu">
              <button data-act="add"><span class="mi">+</span> Add Track</button>
              <button data-act="reshuffle"><span class="mi">🔀</span> Reshuffle Tracks</button>
              <button data-act="share"><span class="mi">🔗</span> Share Playlist</button>
              <button data-act="rename"><span class="mi">✏️</span> Rename Vault</button>
              <button data-act="refill"><span class="mi">♻️</span> Refill Vault (Clear)</button>
              <button data-act="delete" class="danger"><span class="mi">🗑️</span> Delete "${p.name}"</button>
            </div></div>
            <div class="pyramid-shape-wrap"><div class="pyramid-shape"><img src="${getCover(p.beats)}" onerror="this.src='${img("studio.jpg")}'" /></div></div>
            <div class="pyramid-label"><div class="pyramid-title">${p.name.toUpperCase()}</div><div class="pyramid-sub">${p.beats.length} beats</div></div>
          </div>`).join('')}
          ${showPlus?`<div class="pyramid-card plus-card spotify-plus" id="createPyramid"><div class="pyramid-shape-wrap"><div class="pyramid-shape plus-shape"><div class="spotify-plus-inner"><div class="spotify-plus-icon">+</div></div></div></div><div class="pyramid-label"><div class="pyramid-title plus-text">Create Vault</div><div class="pyramid-sub">${LIMIT-store.length} left</div></div></div>`:''}
        </div>
        <div class="pyramid-children" id="childrenList"></div>
      </div>`;
    if(hasLiked&&!activeId) triggerHearts();
    if(window.__CURRENT_BEAT__) setDynamicBg(window.__CURRENT_BEAT__);
    mount.querySelectorAll(".pyramid-card[data-id]").forEach(c=>{ c.querySelector(".pyramid-shape-wrap")?.addEventListener("click", ()=>openPlaylist(c.dataset.id)); });
    document.getElementById("createPyramid")?.addEventListener("click", openCreateModal);
    document.getElementById("hdrAdd")?.addEventListener("click", openCreateModal);
    document.getElementById("menuOverlay")?.addEventListener("click", closeAllMenus);
    mount.querySelectorAll(".pyramid-card").forEach(card=>{
      const id=card.dataset.id;
card.querySelector(".pyramid-dots")?.addEventListener("click", (e)=>{ 
  e.stopPropagation(); 
  const menu=card.querySelector(".pyramid-menu"); 
  const was=menu.classList.contains("active"); 
  closeAllMenus(); 
  if(!was){ 
    menu.classList.add("active"); 
    openMenuOverlay();
    // AUTO-FLIP LOGIC - fixes your screenshot overflow
    requestAnimationFrame(()=>{
      const r = menu.getBoundingClientRect();
      if(r.right > window.innerWidth - 12){
        menu.style.left = "auto";
        menu.style.right = "0";
        menu.style.transform = "translateX(0)";
      }
      if(r.left < 12){
        menu.style.left = "0";
        menu.style.right = "auto";
        menu.style.transform = "translateX(0)";
      }
      // if first pyramid (LIKED) - force left align so it doesn't go off left
      if(card.dataset.id==="liked"){
        menu.style.left = "0";
        menu.style.right = "auto";
      }
    });
  } 
});
      card.querySelectorAll(".pyramid-menu button[data-act]").forEach(btn=>{ btn.addEventListener("click", (e)=>{ e.stopPropagation(); closeAllMenus(); handleMenuAct(btn.dataset.act,id); }); });
    });
    if(activeId) openPlaylist(activeId); else if(hasLiked) openPlaylist("liked"); else if(store[0]) openPlaylist(store[0].id);
  };

   // ===== ADD TRACKS MODAL LOGIC =====
  const addModal = document.getElementById("addTrackModal");
  const addList = document.getElementById("addList");
  const addSearch = document.getElementById("addSearch");
  const addCount = document.getElementById("addCount");
  const addTitle = document.getElementById("addTitle");
  const likePopup = document.getElementById("likePopup");
  let addTargetId = null;
  let selectedIds = new Set();

  const openAddTrackModal = (vaultId) => {
    addTargetId = vaultId;
    selectedIds.clear();
    const isLiked = vaultId==="liked";
    const vault = isLiked ? {name:"Liked Songs", beats:getLikesIds()} : store.find(p=>p.id===vaultId);
    if(!vault) return;
    addTitle.textContent = `Add to ${vault.name}`;
    addSearch.value="";
    addModal.classList.add("open");
    renderAddList("");
  };
  const closeAddModal = () => addModal.classList.remove("open");
  const openLikePopup = () => likePopup.classList.add("open");
  const closeLikePopup = () => likePopup.classList.remove("open");

  document.getElementById("addClose")?.addEventListener("click", closeAddModal);
  document.getElementById("addCancel")?.addEventListener("click", closeAddModal);
  document.getElementById("addTrackBackdrop")?.addEventListener("click", closeAddModal);
  document.getElementById("likeCancel")?.addEventListener("click", closeLikePopup);
  document.getElementById("likeBackdrop")?.addEventListener("click", closeLikePopup);
  document.getElementById("likeGo")?.addEventListener("click", ()=>{ closeLikePopup(); if(window.navigate) window.navigate("/beats"); });
  document.getElementById("addMore")?.addEventListener("click", ()=>{ closeAddModal(); if(window.navigate) window.navigate("/beats"); });

  addSearch?.addEventListener("input", (e)=> renderAddList(e.target.value.toLowerCase()));

   function renderAddList(filter){
    const allBeats=getBeats();
    const targetBeats = addTargetId==="liked" ? getLikesIds() : (store.find(p=>p.id===addTargetId)?.beats||[]);
    let pool = allBeats.filter(b=> !targetBeats.includes(String(b.id)));
    if(filter) pool = pool.filter(b=> (b.title||"").toLowerCase().includes(filter) || (b.genre||"").toLowerCase().includes(filter));
    pool = pool.slice(0,80);
    addList.innerHTML = pool.map(b=>{
      const sel=selectedIds.has(String(b.id));
      return `<div class="add-row ${sel?'selected':''}" data-bid="${b.id}">
        <div class="add-cover-wrap"><img src="${b.cover_url||b.cover||''}" /><button class="add-play-btn" data-play="${b.id}">▶</button></div>
        <div class="add-meta"><div class="add-t">${b.title||"Untitled"}</div><div class="add-a">${b.bpm||"--"} BPM • ${b.genre||""}</div></div>
        <div class="check ${sel?'on':''}">${sel?'✓':''}</div>
      </div>`;
    }).join('') || `<div class="empty-child">No beats found - try Arsenal</div>`;

    addList.querySelectorAll(".add-row").forEach(row=>{
      row.addEventListener("click", (e)=>{
        if(e.target.closest(".add-play-btn")) return; // don't select when playing
        const id=String(row.dataset.bid);
        if(selectedIds.has(id)) selectedIds.delete(id);
        else{
          if(selectedIds.size>=10){ addCount.textContent=`Max 10 reached • + Add More`; addCount.style.color="#FF1E3C"; setTimeout(()=>{ addCount.style.color=""; addCount.textContent=`${selectedIds.size} / 10 selected`; },1800); return; }
          selectedIds.add(id);
        }
        row.classList.toggle("selected", selectedIds.has(id));
        row.querySelector(".check").classList.toggle("on", selectedIds.has(id));
        row.querySelector(".check").textContent = selectedIds.has(id)?"✓":"";
        addCount.textContent=`${selectedIds.size} / 10 selected`;
      });
    });

       // PLAY IN MODAL - PYRAMID COVER INSTANT UPDATE
    addList.querySelectorAll(".add-play-btn").forEach(btn=>{
      btn.addEventListener("click", (e)=>{
        e.stopPropagation();
        const id=btn.dataset.play;
        const beat=getBeatById(id);
        if(!beat) return;
        const cover = beat.cover_url || beat.cover || '';

        // 1. UPDATE PYRAMID TRIANGLE COVER INSTANTLY
        const pyramidImg = document.querySelector(`.pyramid-card[data-id="${addTargetId}"] .pyramid-shape img`);
        if(pyramidImg){
          pyramidImg.style.transition = "none";
          pyramidImg.src = cover;
          pyramidImg.style.transform = "scale(1.08)";
          setTimeout(()=> pyramidImg.style.transform = "scale(1)", 160);
        }

        // 2. UPDATE BIG BLUR BG TOO
        const bg = document.getElementById("dynamicBg");
        if(bg){
          bg.style.transition = "none";
          bg.style.backgroundImage = `url('${cover}')`;
          bg.style.opacity = "1";
          void bg.offsetWidth;
          bg.style.transition = "opacity .35s ease";
        }
        window.__CURRENT_BEAT__ = beat;

        addList.querySelectorAll(".add-play-btn").forEach(b=>b.textContent="▶");
        btn.textContent="❚❚";

        if(window.globalPlayer?.play){
          const idx=pool.findIndex(x=>String(x.id)===String(id));
          window.globalPlayer.play(idx, pool, "add-modal");
        }
      });
    });


    addCount.textContent=`${selectedIds.size} / 10 selected`;
  }


  document.getElementById("addConfirm")?.addEventListener("click", ()=>{
    if(!selectedIds.size) return;
    const ids = Array.from(selectedIds);
    if(addTargetId==="liked"){
      const current = getLikesIds();
      const merged = [...new Set([...current, ...ids])];
      localStorage.setItem(LIKES_KEY, JSON.stringify(merged));
      window.dispatchEvent(new CustomEvent("dt:beatLiked"));
    }else{
      const p = store.find(x=>x.id===addTargetId);
      if(p){ p.beats = [...new Set([...p.beats, ...ids])]; saveStore(); }
    }
    closeAddModal();
    openPlaylist(addTargetId);
  });

  // expose for menu handler
  window.openAddTrackModal = openAddTrackModal;


  renderPyramids();
}
