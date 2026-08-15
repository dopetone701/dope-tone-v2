// ============================================================
// CC GRAPH V16 FINAL - INSTANT CART/LIKE, LOCKED TRACK, MONTHLY REV
// 6 cards sync real per-track, graph intervals correct, instant updates
// ============================================================
import { STATS_API, currentBeatId, currentRange, setCurrentRange, setCurrentBeatId } from '../cc-config.js';

let primaryChart=null, momentumChart=null, conversionChart=null;
let pollInterval=null, resizeObserver=null;
let liveCartCount=0, liveLikesCount=0;
let activeDataset=[], activeMetric='plays', isInitialized=false;
let followPlayerEnabled = localStorage.getItem('dt_cc_follow_player')==='1';
let currentPlayingId = localStorage.getItem('dt_cc_locked_track') || null;
let currentPlayingTitle = localStorage.getItem('dt_cc_locked_title') || '';
let lastGlobalResponse=null, lastTrackResponse=null;
let lockedTrackMode =!!currentPlayingId;
const tzOffset=new Date().getTimezoneOffset()*-1;
const CACHE_PREFIX='dt_cc_stats_';
const POLL_INTERVAL=15000;

function readJSON(k,f=null){ try{ return JSON.parse(localStorage.getItem(k))||f }catch{ return f } }
function writeJSON(k,v){ try{ localStorage.setItem(k,JSON.stringify(v)) }catch{} }
function cacheKey(s,r,b){ return `${CACHE_PREFIX}${s}_${r}_${b||'global'}`; }
function cacheResponse(s,r,b,j){ if(j) writeJSON(cacheKey(s,r,b),{savedAt:Date.now(),data:j}); }
function readCachedResponse(s,r,b){ return readJSON(cacheKey(s,r,b),null)?.data||null; }


function rebuildMaps(){
  try{
    const uid = localStorage.getItem('dopetone_user_id') || localStorage.getItem('dt_anon_id') || 'anonymous';
    const keys = [`dopetone_cart_${uid}`, 'dopetone_cart', `dopetone_cart_${localStorage.getItem('dt_anon_id')}`];
    let cart = [];
    for(const k of keys){ try{ const v=JSON.parse(localStorage.getItem(k)||'[]'); if(v.length){ cart=v; break; } }catch{} }
    liveCartCount = Array.isArray(cart)?cart.length:0;
  }catch{ liveCartCount=0; }
  try{ const likes=readJSON('dopetone_liked_beats',[]); liveLikesCount=Array.isArray(likes)?likes.length:0; }catch{ liveLikesCount=0; }
}

const num=(v,f=0)=>{ const n=Number(v); return Number.isFinite(n)?n:f; };
const formatNumber=v=>{ const n=num(v); if(n>=1e9)return(n/1e9).toFixed(1)+'B'; if(n>=1e6)return(n/1e6).toFixed(1)+'M'; if(n>=1e3)return(n/1e3).toFixed(1)+'K'; return Math.round(n).toString(); };
const formatMoney=v=>`$${num(v).toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits:2})}`;
const formatPercent=v=>`${num(v).toFixed(2)}%`;
const formatDate=(ts,r)=>{ const d=new Date(ts); if(r==='hour'||r==='day') return d.toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'}); if(r==='week') return d.toLocaleDateString([],{weekday:'short'}); if(r==='month') return d.toLocaleDateString([],{month:'short',day:'numeric'}); return d.toLocaleDateString([],{month:'short',day:'numeric'}); };
const METRICS={ plays:{label:'Plays',color:'#3b82f6',format:formatNumber}, likes:{label:'Likes',color:'#FF1E3C',format:formatNumber}, cart:{label:'Cart',color:'#facc15',format:formatNumber}, downloads:{label:'Downloads',color:'#a855f7',format:formatNumber}, orders:{label:'Orders',color:'#22c55e',format:formatNumber}, revenue:{label:'Revenue',color:'#22d3ee',format:formatMoney} };
const extractHistory=j=>{ if(!j) return []; const p=j.history??j.data??[]; return Array.isArray(p)?p:[]; };
const normalize=pts=>{ if(!Array.isArray(pts)||!pts.length) return []; return pts.map(pt=>({ t:new Date(pt.date??pt.timestamp??Date.now()).getTime(), plays:num(pt.plays??pt.play_count), revenue:num(pt.revenue), downloads:num(pt.downloads), cart:num(pt.cart), orders:num(pt.orders), likes:num(pt.likes), conversion:num(pt.conversion) })).sort((a,b)=>a.t-b.t); };
const getMetricValue=(p,m)=>num(p?.[m],0);
function getMockHistory(r='day'){ const now=Date.now(); let steps=24,gap=3600000; if(r==='hour'){steps=24;gap=3600000;}else if(r==='day'){steps=24;gap=3600000;}else if(r==='week'){steps=7;gap=86400000;}else if(r==='month'){steps=30;gap=86400000;}else if(r==='year'){steps=12;gap=30*86400000;}else{steps=30;gap=86400000;} const arr=[]; for(let i=steps-1;i>=0;i--){ const t=now-i*gap; arr.push({date:new Date(t).toISOString(), plays:Math.floor(5+Math.random()*40), revenue:0, downloads:Math.floor(Math.random()*3), cart:Math.floor(Math.random()*2), orders:0, likes:Math.floor(Math.random()*5)});} return arr; }

class ProChartApex{
  constructor(id,opts={}){ this.id=id; this.el=document.getElementById(id); this.metric=opts.metric||'plays'; this.range=opts.range||'day'; this.data=[]; this.apex=null; }
  setData(d){ this.data=d||[]; this.render(); } setMetric(m){ if(!METRICS[m]) return; this.metric=m; this.render(); } setRange(r){ this.range=r; this.render(); }
  render(){
    if(!this.el||typeof ApexCharts==='undefined') return;
    const wd=this.data.length?this.data:normalize(getMockHistory(this.range)); const met=METRICS[this.metric]; const labels=wd.map(p=>formatDate(p.t,this.range));
    const vals=wd.map(p=>getMetricValue(p,this.metric)); const likes=wd.map(p=>num(p.likes)); const cart=wd.map(p=>num(p.cart)); const isMain=this.id==='tradeChart';
    const opts={ chart:{type:'area',height:isMain?400:160,background:'transparent',toolbar:{show:false},zoom:{enabled:false},fontFamily:'Poppins'}, theme:{mode:'dark'}, stroke:{curve:'smooth',width:isMain?[3,2,2]:[2.5],dashArray:isMain?[0,6,0]:[0]}, colors:isMain?[met.color,'#FF1E3C','#facc15']:[met.color], fill:{type:'gradient',gradient:{shade:'dark',type:'vertical',opacityFrom:0.35,opacityTo:0}}, grid:{borderColor:'rgba(255,255,255,0.07)',strokeDashArray:4}, xaxis:{categories:labels,labels:{style:{colors:'#9CA3AF',fontSize:'10px'}},axisBorder:{show:false},axisTicks:{show:false}}, yaxis:{labels:{style:{colors:'#9CA3AF'},formatter:v=>met.format(v)}}, dataLabels:{enabled:false}, legend:{show:isMain,position:'top',horizontalAlign:'right',labels:{colors:'#9CA3AF'}}, tooltip:{theme:'dark',shared:true,y:{formatter:(v,{seriesIndex})=>{ if(seriesIndex===1) return `♥ ${formatNumber(v)}`; if(seriesIndex===2) return `🛒 ${formatNumber(v)}`; return met.format(v);}}}, series:isMain?[{name:met.label,data:vals},{name:'Likes',data:likes},{name:'Cart',data:cart}]:[{name:met.label,data:vals}] };
    if(this.apex) this.apex.updateOptions(opts); else { this.el.innerHTML=''; this.apex=new ApexCharts(this.el,opts); this.apex.render(); }
  } resize(){ try{this.apex?.updateOptions({},false,false);}catch{} }
}

async function fetchStats(range='day',beatId=null){
  const VALID=['hour','day','week','month','year','all']; let r=String(range||'day').toLowerCase(); let b=beatId?String(beatId):null; if(b&&VALID.includes(b.toLowerCase())){r=b;b=null;} if(!VALID.includes(r)) r='day';
  const url=b? `${STATS_API}/api/stats/track/${encodeURIComponent(b)}?range=${encodeURIComponent(r)}&tz=${tzOffset}` : `${STATS_API}/api/stats/global?range=${encodeURIComponent(r)}&tz=${tzOffset}`;
  try{
    const res=await fetch(url,{cache:'no-store',headers:{Accept:'application/json'}});
    if(!res.ok) throw new Error();
    const j=await res.json();
    if(b) lastTrackResponse=j; else lastGlobalResponse=j;
    cacheResponse(b?'track':'global',r,b,j); return j;
  }catch(e){
    const cached=readCachedResponse(b?'track':'global',r,b);
    if(cached) return cached;
    return {totalPlays:0,totalLikes:0,cartItems:0,totalDownloads:0,totalOrders:0,totalRevenue:0,monthRevenue:0,weekRevenue:0,history:getMockHistory(r)};
  }
}

function calcTotalsFromHistory(json, beatId){
  const history = extractHistory(json);
  const pts = normalize(history);
  if(!pts.length){
    return {
      plays: num(json.totalPlays??0),
      likes: num(json.totalLikes??0),
      cart: num(json.cartItems??0),
      downloads: num(json.totalDownloads??0),
      orders: num(json.totalOrders??0),
      revenue: num(json.monthRevenue??json.totalRevenue??0),
      weekRev: num(json.weekRevenue??0)
    };
  }
  const last = pts[pts.length-1];
  const everPlays = num(json.totalPlays?? last.plays);
  const everLikes = num(json.totalLikes?? last.likes);
  const everDownloads = num(json.totalDownloads?? last.downloads);
  const everOrders = num(json.totalOrders?? last.orders);

  let liveCart = 0;
  if(beatId){
    try{
      const uid=localStorage.getItem('dopetone_user_id')||localStorage.getItem('dt_anon_id');
      const cart=JSON.parse(localStorage.getItem(`dopetone_cart_${uid}`)||localStorage.getItem('dopetone_cart')||'[]');
      const inMyCart = cart.some(id=>String(id)===String(beatId) || (typeof id==='object' && String(id.id||id.beat_id)===String(beatId)));
      liveCart = inMyCart? 1 : num(json.cartItems??0);
    }catch{ liveCart=num(json.cartItems??0); }
   } else {
    // GLOBAL MODE: Use D1 active_carts count, not local
    liveCart = num(json.cartItems ?? liveCartCount);
  }


  const revMode=localStorage.getItem('dt_revenue_mode')||'month';
  let rev=0; if(revMode==='week') rev=num(json.weekRevenue??0); else if(revMode==='all') rev=num(json.totalRevenue??0); else rev=num(json.monthRevenue??0);
  if(everOrders===0) rev=0;

  return {plays:everPlays, likes:everLikes, cart:liveCart, downloads:everDownloads, orders:everOrders, revenue:rev, weekRev:num(json.weekRevenue??0)};
}

function updateTotals(json, isTrack=false){
  const set=(id,val,fmt,sub)=>{ const el=document.getElementById(id); if(el){ el.textContent=fmt?fmt(val):formatNumber(val); el.classList.add('updated'); setTimeout(()=>el.classList.remove('updated'),150); } const subEl=document.getElementById(id+'Sub'); if(subEl&&sub) subEl.textContent=sub; };
  if(!json){ set('totalPlays',0); set('totalLikes',0); set('cartItems',0); set('totalDownloads',0); set('totalOrders',0); set('totalRevenue',0,formatMoney); return; }

  const beatId = isTrack? (currentPlayingId||currentBeatId) : null;
  const totals = calcTotalsFromHistory(json, beatId);

  if(isTrack||lockedTrackMode){
    set('totalPlays', totals.plays, null, `ever plays #${beatId}`);
    set('totalLikes', totals.likes, null, `ever ♥ #${beatId}`);
    set('cartItems', totals.cart, null, totals.cart>0?`in cart now`:`not in cart`);
    set('totalDownloads', totals.downloads, null, `ever ⬇ #${beatId}`);
    set('totalOrders', totals.orders, null, `ever orders`);
    set('totalRevenue', totals.revenue, formatMoney, `${localStorage.getItem('dt_revenue_mode')||'month'} rev`);
    document.querySelectorAll('[data-cc-mode]').forEach(el=>{ el.textContent=`TRACK: ${currentPlayingTitle||beatId}`.slice(0,35); el.style.color='#FF1E3C'; });
    document.body.classList.add('cc-track-mode');
  } 
  
  else {
       set('totalPlays', totals.plays||json.totalPlays||0, null, 'global plays');
    set('totalLikes', num(json.totalLikes ?? liveLikesCount), null, 'global likes');
    set('cartItems', num(json.cartItems ?? liveCartCount), null, 'global cart');
set('totalDownloads', totals.downloads||json.totalDownloads||0, null, 'global downloads');
    set('totalOrders', totals.orders||json.totalOrders||0, null, 'global orders');
    set('totalRevenue', totals.revenue, formatMoney, `${localStorage.getItem('dt_revenue_mode')||'month'} revenue`);
    document.querySelectorAll('[data-cc-mode]').forEach(el=>{ el.textContent='GLOBAL'; el.style.color='#9CA3AF'; });
    document.body.classList.remove('cc-track-mode');
  }
}

function buildMomentum(p){ return p.map((pt,i)=>{ if(i===0) return {...pt,plays:0}; const cur=num(pt[activeMetric]), prev=num(p[i-1][activeMetric]); return {...pt,plays:prev?((cur-prev)/Math.abs(prev))*100:0}; }); }
function buildConversion(p){ return p.map(pt=>({...pt,plays:num(pt.conversion)})); }

export async function loadTradeChartData(beatId=null,range='day'){
  if(lockedTrackMode &&!beatId) beatId = currentPlayingId;
  setCurrentBeatId(beatId); setCurrentRange(range);
  const json=await fetchStats(range, beatId);
  updateTotals(json,!!beatId);
  const pts=normalize(extractHistory(json)); activeDataset=pts;
  primaryChart?.setRange(range); momentumChart?.setRange(range); conversionChart?.setRange(range);
  primaryChart?.setData(pts); momentumChart?.setData(buildMomentum(pts)); conversionChart?.setData(buildConversion(pts));
  document.querySelectorAll('[data-range]').forEach(b=>b.classList.toggle('active', b.dataset.range===range));
  return json;
}

export const clearTrackFilter=()=>{
  lockedTrackMode=false; currentPlayingId=null; currentPlayingTitle=''; localStorage.removeItem('dt_cc_locked_track'); localStorage.removeItem('dt_cc_locked_title');
  setFollowPlayer(false); loadTradeChartData(null,currentRange);
};
export const selectTrackForGraph=(id,title='')=>{
  lockedTrackMode=true; currentPlayingId=String(id); currentPlayingTitle=title||currentPlayingTitle||''; localStorage.setItem('dt_cc_locked_track', String(id)); if(title) localStorage.setItem('dt_cc_locked_title', title);
  setFollowPlayer(true); loadTradeChartData(id,currentRange);
};
export function setAnalyticsMetric(m){ if(!METRICS[m]) return; activeMetric=m; primaryChart?.setMetric(m); if(activeDataset.length) momentumChart?.setData(buildMomentum(activeDataset)); document.querySelectorAll('[data-metric]').forEach(b=>b.classList.toggle('active', b.dataset.metric===m)); }
export async function setAnalyticsRange(r){ if(!r) return; setCurrentRange(r); const bId=lockedTrackMode? currentPlayingId : null; return loadTradeChartData(bId, r); }
function getCurrentPlayingBeat(){ try{ const np=JSON.parse(localStorage.getItem('dt_now_playing')||'null'); return window.currentBeatId||np?.id||window.__CURRENT_BEAT__?.id||null; }catch{ return window.currentBeatId||null; } }
function getCurrentPlayingTitle(){ try{ const np=JSON.parse(localStorage.getItem('dt_now_playing')||'null'); return np?.title||window.__CURRENT_BEAT__?.title||''; }catch{ return ''; } }

function setFollowPlayer(on){
  followPlayerEnabled=on; localStorage.setItem('dt_cc_follow_player', on?'1':'0');
  const btn=document.getElementById('ccFollowPlayerBtn'); if(btn){ btn.textContent=`Follow: ${on?'ON':'OFF'}`; btn.style.background=on?'#FF1E3C':'rgba(255,255,255,.08)'; }
  if(on){
    const playing=getCurrentPlayingBeat(); const title=getCurrentPlayingTitle();
    if(playing){ currentPlayingId=String(playing); currentPlayingTitle=title; lockedTrackMode=true; localStorage.setItem('dt_cc_locked_track', String(playing)); localStorage.setItem('dt_cc_locked_title', title); loadTradeChartData(playing, currentRange); }
  }
}

function setupInstantListeners(){
  const onTrackChange = (id, title='')=>{
    if(!id) return;
    const newId=String(id);
    if(newId===currentPlayingId &&!title) return;
    currentPlayingId=newId; if(title) currentPlayingTitle=title;
    localStorage.setItem('dt_cc_locked_track', newId);
    if(title) localStorage.setItem('dt_cc_locked_title', title);
    if(followPlayerEnabled || lockedTrackMode){
      lockedTrackMode=true;
      loadTradeChartData(newId, currentRange);
    }
  };

  // INSTANT CART
  const instantCartUpdate = async (beatId, action='add')=>{
    rebuildMaps();
    const bid = beatId || currentPlayingId;
    const cartEl=document.getElementById('cartItems');
    if(cartEl){
      let cur=parseInt(cartEl.textContent)||0;
      if(action==='add') cur=cur+1; else cur=Math.max(0,cur-1);
      if(lockedTrackMode && bid===currentPlayingId){
        cartEl.textContent= action==='add'? '1' : '0';
        const sub=document.getElementById('cartItemsSub'); if(sub) sub.textContent= action==='add'? 'in cart now' : 'not in cart';
           } else if(!lockedTrackMode){
        // GLOBAL: bump live instantly, then fetch will correct
        let cur=parseInt(cartEl.textContent)||0;
        cartEl.textContent=String(action==='add'? cur+1 : Math.max(0,cur-1));
      }

      cartEl.classList.add('updated'); setTimeout(()=>cartEl.classList.remove('updated'),300);
    }
    setTimeout(async()=>{
      const j=await fetchStats(currentRange, lockedTrackMode? bid : null);
      updateTotals(j, lockedTrackMode);
      const pts=normalize(extractHistory(j)); activeDataset=pts; primaryChart?.setData(pts);
    }, 400);
  };

  // INSTANT LIKE - SINGLE TRACK FIX
  const instantLikeUpdate = async (beatId, action='like')=>{
    rebuildMaps();
    const bid = beatId || currentPlayingId;
    const likeEl=document.getElementById('totalLikes');
    if(likeEl){
      if(lockedTrackMode && bid===currentPlayingId){
        let cur=parseInt(likeEl.textContent)||0;
        if(action==='like') cur=cur+1; else cur=Math.max(0,cur-1);
        likeEl.textContent=String(cur);
        const sub=document.getElementById('totalLikesSub'); if(sub) sub.textContent=`ever ♥ #${bid}`;
      } else if(!lockedTrackMode){
        likeEl.textContent=String(liveLikesCount);
      }
      likeEl.classList.add('updated'); setTimeout(()=>likeEl.classList.remove('updated'),300);
    }
    setTimeout(async()=>{
      const j=await fetchStats(currentRange, lockedTrackMode? bid : null);
      updateTotals(j, lockedTrackMode);
      const pts=normalize(extractHistory(j)); activeDataset=pts; momentumChart?.setData(buildMomentum(pts));
    }, 400);
  };

  window.addEventListener('cartUpdated', (e)=>{
    const beatId=e.detail?.beatId||e.detail?.id||currentPlayingId;
    const action=e.detail?.action||'add';
    instantCartUpdate(beatId, action);
  });

  window.addEventListener('dt-like-changed', (e)=>{
    const beatId=e.detail?.beatId||e.detail?.id||currentPlayingId;
    const action=e.detail?.action||'like';
    instantLikeUpdate(beatId, action);
  });

  window.addEventListener('dt-track-play', (e)=> onTrackChange(e.detail?.id||e.detail?.beatId, e.detail?.title||''));
  window.addEventListener('dt-play', (e)=> onTrackChange(e.detail?.id||e.detail?.beatId, e.detail?.title||''));
  window.addEventListener('cc_track_changed', (e)=> onTrackChange(e.detail?.id, e.detail?.title||''));
  window.addEventListener('playerPlay', (e)=> onTrackChange(e.detail?.beatId, e.detail?.title||''));

  let lastPolledId = currentPlayingId;
  setInterval(()=>{
    const playing=getCurrentPlayingBeat(); const title=getCurrentPlayingTitle();
    if(playing && String(playing)!==String(lastPolledId)){
      lastPolledId=String(playing);
      onTrackChange(playing, title);
    }
  }, 1000);

   window.addEventListener('cc:cartLive', (e)=>{
    instantCartUpdate(e.detail?.beatId, e.detail?.action||'add');
  });
  // REALTIME POLL FIX - was 15s, make 1.5s for 6 cards
  if(pollInterval) clearInterval(pollInterval);
  pollInterval = setInterval(async()=>{
    const bId = lockedTrackMode ? currentPlayingId : null;
    const j = await fetchStats(currentRange, bId);
    updateTotals(j, !!bId);
    const pts = normalize(extractHistory(j)); activeDataset=pts;
    primaryChart?.setData(pts); momentumChart?.setData(buildMomentum(pts)); conversionChart?.setData(buildConversion(pts));
  }, 1500);

}

export async function syncTopTracksFromD1(){
  let tracks=readJSON('dopetone_vault_tracks')||readJSON('dt_beats')||[]; if(!tracks.length){ alert('No tracks'); return; }
  tracks.sort((a,b)=>(num(b.plays)+num(b.likes)*10)-(num(a.plays)+num(a.likes)*10)); const top=tracks.slice(0,20); writeJSON('dt_cc_top_tracks',top); document.dispatchEvent(new CustomEvent('dt-top-tracks-synced',{detail:{tracks:top}})); return top;
}

function buildRangeBar(){
  const root=document.getElementById('cc-main-page')||document.getElementById('cc-dashboard-root'); if(!root||document.getElementById('ccRangeBar')) return;
  const bar=document.createElement('div'); bar.id='ccRangeBar'; bar.style.cssText='display:flex;gap:6px;margin:12px 0;flex-wrap:wrap;align-items:center';
  bar.innerHTML=`
    <div style="display:flex;gap:4px;background:rgba(255,255,255,.06);padding:4px;border-radius:10px">
      ${['hour','day','week','month','year','all'].map(r=>`<button data-range="${r}" style="padding:6px 12px;border-radius:8px;background:transparent;color:#9CA3AF;border:none;font-weight:700;font-size:11px;cursor:pointer">${r.toUpperCase()}</button>`).join('')}
    </div>
    <div style="display:flex;gap:4px;background:rgba(255,255,255,.06);padding:4px;border-radius:10px">
      ${Object.keys(METRICS).map(m=>`<button data-metric="${m}" style="padding:6px 10px;border-radius:8px;background:transparent;color:#9CA3AF;border:none;font-weight:700;font-size:10px;cursor:pointer">${m.toUpperCase()}</button>`).join('')}
    </div>
    <button id="ccGlobalBtn" style="margin-left:auto;padding:8px 14px;border-radius:8px;background:rgba(255,255,255,.1);color:#fff;border:none;font-weight:800;font-size:11px">GLOBAL</button>
    <button id="ccFollowPlayerBtn" style="padding:8px 12px;border-radius:8px;background:${followPlayerEnabled?'#FF1E3C':'rgba(255,255,255,.08)'};color:#fff;border:1px solid rgba(255,255,255,.12);font-weight:800;font-size:11px">Follow: ${followPlayerEnabled?'ON':'OFF'}</button>
    <button id="ccClearRevenueBtn" style="padding:8px 10px;border-radius:8px;background:rgba(255,0,0,.15);color:#ff6b6b;border:1px solid rgba(255,0,0,.3);font-size:10px">Clear Rev</button>
    <span data-cc-mode style="font-size:11px;color:${lockedTrackMode?'#FF1E3C':'#9CA3AF'};margin-left:4px;padding:6px 10px;background:rgba(255,255,255,.06);border-radius:8px;max-width:200px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-weight:700">${lockedTrackMode?`TRACK: ${currentPlayingTitle||currentPlayingId}`:'GLOBAL'}</span>
  `;
  root.prepend(bar);
  bar.querySelectorAll('[data-range]').forEach(b=>b.onclick=()=>setAnalyticsRange(b.dataset.range));
  bar.querySelectorAll('[data-metric]').forEach(b=>b.onclick=()=>setAnalyticsMetric(b.dataset.metric));
  bar.querySelector('#ccGlobalBtn').onclick=()=>clearTrackFilter();
  bar.querySelector('#ccFollowPlayerBtn').onclick=()=>setFollowPlayer(!followPlayerEnabled);
  bar.querySelector('#ccClearRevenueBtn').onclick=async()=>{ if(!confirm('Clear test revenue? Resets to $0')) return; localStorage.setItem('dt_revenue_mode','month'); try{ await fetch(`${STATS_API}/api/stats/clear-revenue`,{method:'POST'});}catch{} location.reload(); };
  const style=document.createElement('style'); style.textContent=`[data-range].active,[data-metric].active{background:#fff!important;color:#000!important}.cc-track-mode #tradeChart{box-shadow:0 0 0 1px rgba(255,30,60,.4)}`; document.head.appendChild(style);
}

export async function initCharts(){
  if(isInitialized) destroyCharts(); isInitialized=true; rebuildMaps();
  for(let i=0;i<30;i++){ const c=document.getElementById('tradeChart'); if(c&&c.offsetWidth>100) break; await new Promise(r=>setTimeout(r,100)); }
  primaryChart=new ProChartApex('tradeChart',{metric:activeMetric,range:currentRange||'day'});
  momentumChart=new ProChartApex('momentumChart',{metric:'plays',range:currentRange||'day'});
  conversionChart=new ProChartApex('conversionChart',{metric:'plays',range:currentRange||'day'});
  buildRangeBar(); setupInstantListeners();
  const initialBeat = lockedTrackMode? currentPlayingId : (followPlayerEnabled? getCurrentPlayingBeat() : null);
  if(initialBeat){ currentPlayingId=String(initialBeat); currentPlayingTitle=getCurrentPlayingTitle(); }
  await loadTradeChartData(initialBeat, currentRange||'day');
  if(pollInterval) clearInterval(pollInterval);
  pollInterval=setInterval(async()=>{
    const bId=lockedTrackMode? currentPlayingId : null;
    const j=await fetchStats(currentRange, bId);
    updateTotals(j,!!bId);
    const pts=normalize(extractHistory(j)); activeDataset=pts;
    primaryChart?.setData(pts); momentumChart?.setData(buildMomentum(pts)); conversionChart?.setData(buildConversion(pts));
  }, POLL_INTERVAL);
  setFollowPlayer(followPlayerEnabled);
}

export function destroyCharts(){ if(pollInterval) clearInterval(pollInterval); if(resizeObserver) resizeObserver.disconnect(); try{primaryChart?.apex?.destroy();momentumChart?.apex?.destroy();conversionChart?.apex?.destroy();}catch{} primaryChart=momentumChart=conversionChart=null; isInitialized=false; }
export function getAnalyticsState(){ return {initialized:isInitialized,metric:activeMetric,range:currentRange,points:activeDataset.length,follow:followPlayerEnabled,locked:lockedTrackMode,playing:currentPlayingId,title:currentPlayingTitle}; }
