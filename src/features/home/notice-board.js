// ===============================
// NOTICE BOARD V5 PRO - FULL LENGTH - D1 LIVE + AI PRO + DROPS + CHAT
// ===============================
const DROP_API = "https://dt-drop-zone-api.dopetone701.workers.dev";
const AI_API_URL = "https://ai-api.dopetone701.workers.dev";

let activeBeat = null, activeBeatsList = [], lastChatIds = new Set(), dropsHash = '', chatVisible = false, chatActiveUntil = 0, lastSentContent='', lastSentTime=0, isSending=false;
const TTL = 60*60*1000;
const isExpired = (t) => Date.now() - new Date(t||Date.now()).getTime() > TTL;
const ttlLeft = (t) => Math.max(0, TTL - (Date.now() - new Date(t||Date.now()).getTime()));
const hideUserOnly = (el) => { if(!el ||!el.parentElement) return; el.style.transition='all.4s ease'; el.style.opacity='0'; el.style.transform='translateY(-10px)'; setTimeout(()=>el.remove(),400); };
window._dropsCache = window._dropsCache || []; window._aiDropsCache = [];

function getRealUser(){
  try{
    let u=JSON.parse(localStorage.getItem('dope_user')||'null');
    const email=u?.email||localStorage.getItem('dt_email')||'';
    const name=u?.name||'Fan';
    let uid=localStorage.getItem('dt_uid');
    if(!uid){uid='uid_'+Date.now(); localStorage.setItem('dt_uid',uid);}
    return {name,email,uid};
  }catch{ return {name:'Fan',email:'',uid:localStorage.getItem('dt_uid')||'anon'}; }
}
function escapeHtml(s){ return (s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }

let proAIReady = false; let proModules = {};
async function loadProAI(){
  if(proAIReady) return proModules;
  try{
    const [intentMod, beatMod, greetMod, respMod, memMod] = await Promise.all([
      import('./ai-replies/intent-detector-pro.js'),
      import('./ai-replies/beat-engine-pro.js'),
      import('./ai-replies/greetings-pro.js'),
      import('./ai-replies/response-builder-pro.js'),
      import('./ai-replies/memory-engine-pro.js').catch(()=>null)
    ]);
    proModules = {
      detectIntent: intentMod?.detectIntentPro || null,
      findBeats: beatMod?.findBeatsPro || null,
      greet: greetMod?.getGreetingPro || null,
      buildResponse: respMod?.buildResponsePro || null,
      memory: memMod || null
    };
    proAIReady = true;
    console.log('[AI PRO] loaded');
    return proModules;
  }catch(e){
    console.warn('[AI PRO] failed, fallback', e);
    return null;
  }
}

function buildLayout(){
  const feed = document.getElementById('noticeBoardFeed');
  const drops = document.getElementById('dtDropsWrap');
  const chatWrap = document.getElementById('dtChatWrap');
  const chatList = document.getElementById('dtChatList');
  const recommend = document.getElementById('dtRecommendWrap');
  const input = document.getElementById('noticeBoardInput');
  const send = document.getElementById('noticeBoardSend');
  if(!feed ||!drops) return;

  if(!input ||!send) return;

  if(send.dataset.bound) return;
  send.dataset.bound='1';

  const handleSend = async ()=>{
    if(isSending) return;
    const txt = input.value.trim();
    if(!txt) return;
    const now = Date.now();
    if(txt===lastSentContent && now-lastSentTime<3000) return;
    if(!txt) return;
    lastSentContent=txt; lastSentTime=now; isSending=true;
    input.value='';
    await handleUserMessage(txt);
    isSending=false;
  };
  send.addEventListener('click', handleSend);
  input.addEventListener('keydown', e=>{
    if(e.key==='Enter'){ e.preventDefault(); handleSend(); }
  });
}

async function fetchDrops(){
  try{
    const res = await fetch(`${DROP_API}/api/drops`);
    const data = await res.json();
    const drops = data.drops || data || [];
    const hash = JSON.stringify(drops.map(d=>d.id+d.created_at));
    if(hash===dropsHash) return;
    dropsHash=hash;
    window._dropsCache = drops.filter(d=>!isExpired(d.created_at));
    renderDrops();
  }catch(e){ console.log('drops fetch fail', e); }
}

function renderDrops(){
  const wrap = document.getElementById('dtDropsWrap');
  if(!wrap) return;
  const all = [...(window._dropsCache||[]),...(window._aiDropsCache||[])].sort((a,b)=>new Date(b.created_at)-new Date(a.created_at));
  if(!all.length){
    wrap.innerHTML=`<div style="padding:20px;text-align:center;color:#6b7280;font-size:12px">No drops yet - be first!</div>`;
    return;
  }
  wrap.innerHTML = all.map(d=>{
    const left = ttlLeft(d.created_at);
    const mins = Math.floor(left/60000);
    const isUser = d.type==='user' || d.is_user;
    return `
    <div class="dt-drop ${isUser?'user-drop':''}" data-id="${d.id}" style="background:${isUser?'rgba(13,59,255,0.08)':'rgba(255,255,255,0.04)'};border:1px solid ${isUser?'rgba(13,59,255,0.18)':'rgba(255,255,255,0.06)'};border-radius:12px;padding:10px;position:relative;transition:all.3s">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px">
        <span style="font-size:10px;font-weight:800;letter-spacing:.5px;color:${isUser?'#0d3bff':'#9ca3af'}">${escapeHtml(d.username||d.user||'Creator')}</span>
        <span style="font-size:9px;color:#6b7280">${mins}m left</span>
      </div>
      <div style="font-size:12px;color:#e5e7eb;line-height:1.4">${escapeHtml(d.content||d.message||'')}</div>
      ${d.beat_id?`<div style="margin-top:6px;font-size:10px;color:#0d3bff">🎵 Beat #${d.beat_id}</div>`:''}
    </div>`;
  }).join('');

  // expire check
  setTimeout(()=>{
    document.querySelectorAll('.dt-drop').forEach(el=>{
      const id = el.dataset.id;
      const drop = all.find(x=>String(x.id)===String(id));
      if(drop && isExpired(drop.created_at)) hideUserOnly(el);
    });
  }, 1000);
}

async function handleUserMessage(text){
  const {name,email,uid} = getRealUser();
  const chatList = document.getElementById('dtChatList');
  const chatWrap = document.getElementById('dtChatWrap');
  const dropsWrap = document.getElementById('dtDropsWrap');

  // show chat
  showChat();

  // add user message to chat
  appendChat({content:text, user:name, is_me:true, created_at:new Date().toISOString()});

  // save to D1
  try{
    await fetch(`${DROP_API}/api/drops`, {
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({content:text, username:name, email, uid, type:'user', beat_id:activeBeat?.id||null})
    });
  }catch{}

  // AI PRO reply
  try{
    const pro = await loadProAI();
    let reply = null;
    if(pro && pro.detectIntent){
      const intent = await pro.detectIntent(text);
      const beats = window.__BEATS__ || window.DTStore?.beats || [];
      let found = [];
      if(pro.findBeats){
        found = await pro.findBeats(text, beats, intent);
      }
      if(pro.buildResponse){
        reply = await pro.buildResponse(text, intent, found, {name});
      }
      activeBeatsList = found;
      activeBeat = found[0]||null;
      renderRecommendations(found, reply);
    }

    // fallback simple AI
    if(!reply){
      reply = `Got it "${text}" - I found ${activeBeatsList.length} beats for you. Check below!`;
    }

    appendChat({content:reply, user:'Dope Tone AI', is_ai:true, created_at:new Date().toISOString()});

    // save AI drop
    const aiDrop = {id:'ai_'+Date.now(), content:reply, username:'Dope Tone AI', created_at:new Date().toISOString(), type:'ai'};
    window._aiDropsCache = [aiDrop,...(window._aiDropsCache||[])].slice(0,20);
    renderDrops();

  }catch(e){
    console.error('AI error', e);
    appendChat({content:`I'm here! Tell me genre, bpm, or mood you need.`, user:'Dope Tone AI', is_ai:true});
  }
}

function appendChat(msg){
  const list = document.getElementById('dtChatList');
  if(!list) return;
  const isMe = msg.is_me;
  const div = document.createElement('div');
  div.style.cssText=`display:flex;${isMe?'justify-content:flex-end':'justify-content:flex-start'}`;
  div.innerHTML=`
    <div style="max-width:78%;background:${isMe?'#0d3bff':'#1e1e2e'};color:#fff;padding:8px 12px;border-radius:${isMe?'16px 16px 2px 16px':'16px 16px 16px 2px'};font-size:12px;line-height:1.4;box-shadow:0 2px 8px rgba(0,0,0,0.2)">
      ${escapeHtml(msg.content)}
    </div>`;
  list.appendChild(div);
  list.scrollTop = list.scrollHeight;
  chatVisible=true;
  chatActiveUntil=Date.now()+120000;
}

function showChat(){
  const wrap = document.getElementById('dtChatWrap');
  if(!wrap) return;
  if(wrap.style.maxHeight && wrap.style.maxHeight!=='0px') return;
  wrap.style.maxHeight='420px';
  wrap.style.opacity='1';
  wrap.style.transform='translateY(0)';
  wrap.style.pointerEvents='auto';
  chatVisible=true;
}

function hideChat(){
  const wrap = document.getElementById('dtChatWrap');
  if(!wrap) return;
  if(Date.now()<chatActiveUntil) return;
  wrap.style.maxHeight='0';
  wrap.style.opacity='0';
  wrap.style.transform='translateY(-10px)';
  wrap.style.pointerEvents='none';
  chatVisible=false;
}

function renderRecommendations(beats, aiText){
  const wrap = document.getElementById('dtRecommendWrap');
  if(!wrap) return;
  if(!beats ||!beats.length){
    wrap.style.display='none';
    return;
  }
  wrap.style.display='block';
  wrap.innerHTML=`
    <div style="background:rgba(13,59,255,0.06);border:1px solid rgba(13,59,255,0.12);border-radius:12px;padding:10px">
      <div style="font-size:10px;font-weight:800;letter-spacing:.5px;color:#0d3bff;margin-bottom:8px">RECOMMENDED FOR YOU • ${beats.length}</div>
      <div style="display:flex;flex-direction:column;gap:8px">
        ${beats.slice(0,4).map(b=>`
          <div class="ai-beat-row" data-id="${b.id}" style="display:flex;align-items:center;gap:10px;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.06);border-radius:10px;padding:8px;cursor:pointer">
            <img src="${b.cover_url||b.image||'images/studio.jpg'}" style="width:36px;height:36px;border-radius:6px;object-fit:cover" />
            <div style="flex:1;min-width:0">
              <div style="font-size:11px;font-weight:700;color:#fff;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${escapeHtml(b.title)}</div>
              <div style="font-size:10px;color:#9ca3af">${b.genre||''} • ${b.bpm||''} BPM</div>
            </div>
            <button class="ai-opt-btn" style="background:#0d3bff;border:none;color:#fff;width:28px;height:28px;border-radius:50%;display:grid;place-items:center;font-size:12px">▶</button>
          </div>
        `).join('')}
      </div>
    </div>`;

  wrap.querySelectorAll('.ai-beat-row').forEach(row=>{
    row.addEventListener('click', ()=>{
      const id=row.dataset.id;
      const beat = beats.find(x=>String(x.id)===String(id));
      if(beat && window.globalPlayer){
        const idx = beats.indexOf(beat);
        window.globalPlayer.play(idx, beats, 'ai-recommend');
      }
    });
  });
}

// ===== INIT =====
function initNoticeBoard(){
  buildLayout();
  fetchDrops();
  setInterval(fetchDrops, 5000);
  setInterval(()=>{
    if(!chatVisible) return;
    if(Date.now()>chatActiveUntil) hideChat();
  }, 1000);

  // expire sweeper
  setInterval(()=>{
    if(isExpired) renderDrops();
  }, 30000);
}

// auto boot
if(document.readyState==='loading'){
  document.addEventListener('DOMContentLoaded', initNoticeBoard);
}else{
  initNoticeBoard();
}

// expose
window.initNoticeBoard = initNoticeBoard;
window.renderDrops = renderDrops;

export { initNoticeBoard, fetchDrops, renderDrops };


export function initNoticeBoard(){
  try{
    const feed = document.getElementById('noticeBoardFeed');
    const drops = document.getElementById('dtDropsWrap');
    if(!drops) return;
    // force build
    if(typeof buildLayout === 'function') buildLayout();
    if(typeof fetchDrops === 'function') fetchDrops();
    console.log('[NOTICE] wired');
  }catch(e){ console.error('notice init fail', e); }
}
window.initNoticeBoard = initNoticeBoard;

