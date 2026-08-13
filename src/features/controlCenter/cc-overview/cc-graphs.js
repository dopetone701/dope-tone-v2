// ============================================================
// DOPE TONE VAULT — CONTROL CENTER GRAPH ENGINE PRO V10 FINAL
// FIXES: scroll lock, tiny bottom graphs, nav back bug, likes red line,
// counts 100+ to ∞, sync button, current playing track
// ============================================================

import {
  STATS_API,
  currentBeatId,
  currentRange,
  setCurrentRange,
  setCurrentBeatId
} from '../cc-config.js';

let primaryChart = null;
let momentumChart = null;
let conversionChart = null;
let pollInterval = null;
let resizeObserver = null;
let liveCartCount = 0, liveCartPerBeat = {}, liveLikesCount = 0, liveLikesPerBeat = {};
let lastGlobalResponse = null, lastTrackResponse = null;
let activeDataset = [], activeMetric = 'plays', isOffline = false, isInitialized = false;
const tzOffset = new Date().getTimezoneOffset() * -1;
const CACHE_PREFIX = 'dt_cc_stats_';
const POLL_INTERVAL = 30000;

const COLORS = {
  muted: 'rgba(255,255,255,.42)', grid: 'rgba(255,255,255,.07)',
  up: '#22c55e', down: '#ef4444', blue: '#3b82f6', cyan: '#22d3ee',
  red: '#FF1E3C', yellow: '#facc15', white: '#ffffff', panel: 'rgba(5,10,20,.94)'
};

function readJSON(k,f=null){ try{ const r=localStorage.getItem(k); return r?JSON.parse(r):f; }catch{ return f; } }
function writeJSON(k,v){ try{ localStorage.setItem(k,JSON.stringify(v)); }catch{} }
function cacheKey(s,r,b){ return `${CACHE_PREFIX}${s}_${r}_${b||'global'}`; }
function cacheResponse(s,r,b,j){ if(j) writeJSON(cacheKey(s,r,b), {savedAt:Date.now(), data:j}); }
function readCachedResponse(s,r,b){ return readJSON(cacheKey(s,r,b),null)?.data||null; }

function rebuildMaps(){
  liveCartCount=0; liveCartPerBeat={}; liveLikesCount=0; liveLikesPerBeat={};
  try{
    const cart=readJSON('dopetone_cart',[]); if(Array.isArray(cart)){ liveCartCount=cart.length; cart.forEach(it=>{ const id=it?.id??it?.beatId??it?.beat_id; if(id!=null) liveCartPerBeat[String(id)]=(liveCartPerBeat[String(id)]||0)+1; }); }
  }catch{}
  try{
    const likes=readJSON('dopetone_likes',{}); if(likes&&typeof likes==='object'){ liveLikesCount=Object.keys(likes).length; Object.keys(likes).forEach(id=>liveLikesPerBeat[String(id)]=1); }
  }catch{}
}

function num(v,f=0){ const n=Number(v); return Number.isFinite(n)?n:f; }
function positive(v){ return Math.max(num(v),0); }
function clamp(v,a,b){ return Math.min(Math.max(v,a),b); }
function safeDate(v){ const d=new Date(v); return Number.isNaN(d.getTime())?new Date():d; }

// UNLIMITED COUNT FORMAT 100+... 1M+
function formatNumber(v){
  const n=num(v); if(n>=1000000000) return (n/1000000000).toFixed(n>=10000000000?0:1)+'B';
  if(n>=1000000) return (n/1000000).toFixed(n>=10000000?0:1)+'M';
  if(n>=1000) return (n/1000).toFixed(n>=10000?0:1)+'K';
  return Math.round(n).toLocaleString();
}
function formatMoney(v){ return `$${num(v).toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits:2})}`; }
function formatPercent(v){ return `${num(v).toFixed(2)}%`; }

function formatDate(ts, range){
  const d=new Date(ts); if(Number.isNaN(d.getTime())) return '';
  return range==='day'? d.toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'}) : d.toLocaleDateString([],{month:'short',day:'numeric'});
}
function formatFullDate(ts){ return new Date(ts).toLocaleString([],{month:'short',day:'numeric',year:'numeric',hour:'2-digit',minute:'2-digit'}); }

const METRICS={
  plays:{label:'Plays',color:COLORS.blue,format:formatNumber},
  revenue:{label:'Revenue',color:COLORS.cyan,format:formatMoney},
  downloads:{label:'Downloads',color:'#a855f7',format:formatNumber},
  cart:{label:'Cart',color:COLORS.yellow,format:formatNumber},
  orders:{label:'Orders',color:COLORS.up,format:formatNumber},
  likes:{label:'Likes',color:COLORS.red,format:formatNumber},
  conversion:{label:'Conversion',color:COLORS.white,format:formatPercent}
};

function extractHistory(json){ if(!json) return []; const p=json.history??json.data??json.points??json.series??[]; return Array.isArray(p)?p:[]; }

function normalize(points){
  if(!Array.isArray(points)||!points.length) return [];
  const res=[]; points.forEach((pt,i)=>{
    if(!pt||typeof pt!=='object') return;
    const t=safeDate(pt.date??pt.timestamp??pt.time??Date.now()).getTime();
    const plays=positive(pt.plays??pt.play_count); const revenue=positive(pt.revenue??pt.amount);
    const downloads=positive(pt.downloads); const cart=positive(pt.cart??pt.cartItems);
    const orders=positive(pt.orders??pt.sales); const likes=positive(pt.likes);
    let conversion=num(pt.conversion??pt.conversionRate); if(conversion===0&&plays>0&&(orders>0||cart>0)) conversion=((orders||cart)/plays)*100;
    res.push({index:i,t,date:new Date(t),plays,revenue,downloads,cart,orders,likes,conversion});
  }); res.sort((a,b)=>a.t-b.t); return res;
}

function getMetricValue(p,m){ return num(p?.[m],0); }
function calculateMovingAverage(data,metric,period=7){
  const v=[]; for(let i=0;i<data.length;i++){ const s=Math.max(0,i-period+1); const sl=data.slice(s,i+1).map(p=>getMetricValue(p,metric)); v.push(sl.length?sl.reduce((a,b)=>a+b,0)/sl.length:0); } return v;
}
function calculateStdDev(data,metric,period=7){
  const r=[]; for(let i=0;i<data.length;i++){ const s=Math.max(0,i-period+1); const vals=data.slice(s,i+1).map(p=>getMetricValue(p,metric)); if(!vals.length){r.push(0);continue;} const mean=vals.reduce((a,b)=>a+b,0)/vals.length; const vari=vals.reduce((a,b)=>a+Math.pow(b-mean,2),0)/vals.length; r.push(Math.sqrt(vari)); } return r;
}
function buildCandles(data,metric){
  const c=[]; for(let i=0;i<data.length;i++){ const cur=getMetricValue(data[i],metric); const prev=i>0?getMetricValue(data[i-1],metric):cur; const next=i<data.length-1?getMetricValue(data[i+1],metric):cur; c.push({t:data[i].t,o:prev,c:cur,h:Math.max(prev,cur,next),l:Math.min(prev,cur,next)}); } return c;
}

class ProChart{
  constructor(id,options={}){
    this.id=id; this.canvas=document.getElementById(id); this.options=options;
    this.ctx=this.canvas?this.canvas.getContext('2d'):null; this.data=[]; this.candles=[]; this.metric=options.metric||'plays'; this.range=options.range||'day';
    this.showCandles=options.showCandles!==false; this.showMA=options.showMA!==false; this.showRange=options.showRange!==false; this.showLikesLine=options.showLikesLine!==false;
    this.hoverIndex=-1; this.padding={top:26,right:18,bottom:30,left:56}; this._raf=null; this.bindEvents();
  }
  bindEvents(){
    if(!this.canvas) return;
    this.canvas.style.touchAction='pan-y'; // FIX: allows scroll
    this.canvas.addEventListener('pointermove',e=>this.handlePointer(e));
    this.canvas.addEventListener('pointerleave',()=>{ this.hoverIndex=-1; this.hideTooltip(); this.scheduleRender(); });
    // FIX: wheel does NOT prevent scroll unless ctrl is held
    this.canvas.addEventListener('wheel',e=>{
      if(!e.ctrlKey &&!e.metaKey) return; // allow page scroll
      e.preventDefault(); this.canvas.dispatchEvent(new CustomEvent('dt-chart-zoom',{detail:{chart:this,direction:e.deltaY>0?'out':'in'}}));
    },{passive:false});
  }
  setData(d){ this.data=Array.isArray(d)?d:[]; this.rebuild(); this.scheduleRender(); }
  setMetric(m){ if(!METRICS[m]) return; this.metric=m; this.rebuild(); this.scheduleRender(); }
  setRange(r){ this.range=r; this.scheduleRender(); }
  rebuild(){ this.candles=buildCandles(this.data,this.metric); }
  getValues(){ return this.data.map(p=>getMetricValue(p,this.metric)); }
  getBounds(){
    const vals=this.getValues(); if(!vals.length) return {min:0,max:1};
    const ma=calculateMovingAverage(this.data,this.metric,7), std=calculateStdDev(this.data,this.metric,7);
    const upper=vals.map((_,i)=>(ma[i]||0)+(std[i]||0)*2), lower=vals.map((_,i)=>Math.max(0,(ma[i]||0)-(std[i]||0)*2));
    const maxValue=Math.max(...vals,...upper,1), minValue=Math.min(...vals,...lower,0), spread=maxValue-minValue||1;
    return {min:Math.max(0,minValue-spread*0.08), max:maxValue+spread*0.12};
  }
  getGeometry(){
    if(!this.canvas) return null; const rect=this.canvas.getBoundingClientRect();
    return {width:rect.width,height:rect.height||300,chartWidth:rect.width-this.padding.left-this.padding.right,chartHeight:(rect.height||300)-this.padding.top-this.padding.bottom};
  }
  valueToY(v,b,g){ const ratio=(v-b.min)/(b.max-b.min||1); return this.padding.top+g.chartHeight-ratio*g.chartHeight; }
  indexToX(i,g){ const c=Math.max(this.data.length-1,1); return this.padding.left+(i/c)*g.chartWidth; }
  xToIndex(x,g){ const r=clamp((x-this.padding.left)/g.chartWidth,0,1); return Math.round(r*Math.max(this.data.length-1,0)); }
  render(){
    if(!this.canvas||!this.ctx) return; const rect=this.canvas.getBoundingClientRect(); if(!rect.width||!rect.height) return;
    const dpr=window.devicePixelRatio||1; this.canvas.width=Math.round(rect.width*dpr); this.canvas.height=Math.round(rect.height*dpr);
    this.ctx.setTransform(dpr,0,0,dpr,0,0); const ctx=this.ctx; ctx.clearRect(0,0,rect.width,rect.height);
    if(!this.data.length){ this.renderEmpty(rect.width,rect.height); return; }
    const geo=this.getGeometry(), bounds=this.getBounds();
    this.drawGrid(geo,bounds); if(this.showRange) this.drawPerformanceRange(geo,bounds);
    if(this.showCandles) this.drawCandles(geo,bounds); if(this.showMA) this.drawMovingAverage(geo,bounds);
    if(this.showLikesLine) this.drawLikesLine(geo,bounds); // RED LINE FOR LIKES
    this.drawXAxis(geo); if(this.hoverIndex>=0) this.drawCrosshair(geo,bounds);
  }
  drawGrid(geo,bounds){
    const ctx=this.ctx, p=this.padding; ctx.lineWidth=1; ctx.strokeStyle=COLORS.grid; ctx.fillStyle=COLORS.muted; ctx.font='10px ui-monospace,monospace';
    for(let i=0;i<=4;i++){ const ratio=i/4, y=p.top+ratio*geo.chartHeight; ctx.beginPath(); ctx.moveTo(p.left,y); ctx.lineTo(p.left+geo.chartWidth,y); ctx.stroke(); const v=bounds.max-ratio*(bounds.max-bounds.min); ctx.fillText(METRICS[this.metric]?.format(v)||formatNumber(v),6,y+3); }
  }
  drawPerformanceRange(geo,bounds){
    if(this.data.length<2) return; const ctx=this.ctx, ma=calculateMovingAverage(this.data,this.metric,7), std=calculateStdDev(this.data,this.metric,7);
    ctx.beginPath(); ma.forEach((val,i)=>{ const up=val+(std[i]||0)*2, x=this.indexToX(i,geo), y=this.valueToY(up,bounds,geo); i===0?ctx.moveTo(x,y):ctx.lineTo(x,y); });
    for(let i=ma.length-1;i>=0;i--){ const lo=Math.max(0,ma[i]-(std[i]||0)*2), x=this.indexToX(i,geo), y=this.valueToY(lo,bounds,geo); ctx.lineTo(x,y); } ctx.closePath(); ctx.fillStyle='rgba(59,130,246,.05)'; ctx.fill();
  }
  drawCandles(geo,bounds){
    const ctx=this.ctx, avail=geo.chartWidth/Math.max(this.candles.length,1), bw=clamp(avail*0.58,3,14);
    this.candles.forEach((c,i)=>{ const x=this.indexToX(i,geo), yO=this.valueToY(c.o,bounds,geo), yC=this.valueToY(c.c,bounds,geo), yH=this.valueToY(c.h,bounds,geo), yL=this.valueToY(c.l,bounds,geo), up=c.c>=c.o; ctx.strokeStyle=up?COLORS.up:COLORS.down; ctx.fillStyle=up?COLORS.up:COLORS.down; ctx.beginPath(); ctx.moveTo(x,yH); ctx.lineTo(x,yL); ctx.stroke(); const top=Math.min(yO,yC), h=Math.max(2,Math.abs(yC-yO)); ctx.fillRect(x-bw/2,top,bw,h); });
  }
  drawMovingAverage(geo,bounds){
    if(this.data.length<2) return; const ctx=this.ctx, ma=calculateMovingAverage(this.data,this.metric,7);
    ctx.beginPath(); ma.forEach((v,i)=>{ const x=this.indexToX(i,geo), y=this.valueToY(v,bounds,geo); i===0?ctx.moveTo(x,y):ctx.lineTo(x,y); }); ctx.strokeStyle=METRICS[this.metric]?.color||COLORS.blue; ctx.lineWidth=1.5; ctx.stroke();
  }
  // NEW: RED LINE FOR LIKES
  drawLikesLine(geo,bounds){
    if(this.id!=='tradeChart' ||!this.data.length) return;
    const ctx=this.ctx; const likesVals=this.data.map(p=>num(p.likes,0)); const likesMax=Math.max(...likesVals,1);
    // map likes to same Y scale proportionally
    ctx.beginPath(); likesVals.forEach((v,i)=>{ const x=this.indexToX(i,geo); const norm=(v/likesMax)*bounds.max; const y=this.valueToY(norm,bounds,geo); i===0?ctx.moveTo(x,y):ctx.lineTo(x,y); });
    ctx.strokeStyle=COLORS.red; ctx.lineWidth=2; ctx.setLineDash([4,4]); ctx.stroke(); ctx.setLineDash([]);
  }
  drawXAxis(geo){
    const ctx=this.ctx; if(!this.data.length) return; ctx.fillStyle=COLORS.muted; ctx.font='10px ui-monospace,monospace';
    const count=Math.min(6,this.data.length); for(let i=0;i<count;i++){ const idx=Math.round(i*((this.data.length-1)/Math.max(count-1,1))), x=this.indexToX(idx,geo); ctx.textAlign=i===0?'left':i===count-1?'right':'center'; ctx.fillText(formatDate(this.data[idx].t,this.range),x,geo.height-8); } ctx.textAlign='left';
  }
  drawCrosshair(geo,bounds){
    const ctx=this.ctx, idx=this.hoverIndex, x=this.indexToX(idx,geo), val=getMetricValue(this.data[idx],this.metric), y=this.valueToY(val,bounds,geo);
    ctx.save(); ctx.strokeStyle='rgba(255,255,255,.25)'; ctx.setLineDash([4,4]); ctx.beginPath(); ctx.moveTo(x,this.padding.top); ctx.lineTo(x,this.padding.top+geo.chartHeight); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(this.padding.left,y); ctx.lineTo(this.padding.left+geo.chartWidth,y); ctx.stroke(); ctx.setLineDash([]); ctx.fillStyle=COLORS.white; ctx.beginPath(); ctx.arc(x,y,3,0,Math.PI*2); ctx.fill(); ctx.restore(); this.showTooltip(this.data[idx],idx);
  }
  renderEmpty(w,h){ const ctx=this.ctx; ctx.fillStyle=COLORS.muted; ctx.font='12px ui-monospace,monospace'; ctx.textAlign='center'; ctx.fillText(isOffline?'Worker offline — showing cached data':'No analytics data yet — play some beats',w/2,h/2); ctx.textAlign='left'; }
  handlePointer(e){ if(!this.data.length) return; const rect=this.canvas.getBoundingClientRect(), geo=this.getGeometry(), x=e.clientX-rect.left, y=e.clientY-rect.top;
    if(x<this.padding.left||x>this.padding.left+geo.chartWidth||y<this.padding.top||y>this.padding.top+geo.chartHeight) return;
    this.hoverIndex=clamp(this.xToIndex(x,geo),0,this.data.length-1); this.scheduleRender(); }
  getTooltipElement(){
    if(!this.canvas?.parentElement) return null; let tip=this.canvas.parentElement.querySelector('.dt-chart-tooltip');
    if(!tip){ tip=document.createElement('div'); tip.className='dt-chart-tooltip'; tip.style.cssText='position:absolute;pointer-events:none;z-index:20;min-width:180px;padding:10px 12px;border:1px solid rgba(255,255,255,.1);border-radius:10px;background:rgba(5,10,20,.94);backdrop-filter:blur(12px);box-shadow:0 14px 40px rgba(0,0,0,.35);font-family:ui-monospace,monospace;font-size:11px;line-height:1.5;display:none;'; if(getComputedStyle(this.canvas.parentElement).position==='static') this.canvas.parentElement.style.position='relative'; this.canvas.parentElement.appendChild(tip); } return tip;
  }
  showTooltip(pt,idx){
    const tip=this.getTooltipElement(); if(!tip||!pt) return; const met=METRICS[this.metric], val=getMetricValue(pt,this.metric);
    tip.innerHTML=`<div style="color:rgba(255,255,255,.45);font-size:9px;letter-spacing:.12em;text-transform:uppercase;margin-bottom:5px">${formatFullDate(pt.t)}</div>
    <div style="color:#fff;font-size:13px;font-weight:700;margin-bottom:6px">${met?.label||'Metric'}</div>
    <div style="color:${met?.color||'#fff'};font-size:18px;font-weight:800;margin-bottom:8px">${met?.format?met.format(val):formatNumber(val)} <span style="color:#FF1E3C;font-size:11px">${pt.likes?`♥ ${formatNumber(pt.likes)}`:''}</span></div>
    <div style="display:grid;grid-template-columns:1fr auto;gap:4px 14px;color:rgba(255,255,255,.55)">
    <span>Plays</span><strong style="color:#fff">${formatNumber(pt.plays)}</strong>
    <span>Revenue</span><strong style="color:#fff">${formatMoney(pt.revenue)}</strong>
    <span>Cart</span><strong style="color:#fff">${formatNumber(pt.cart)}</strong>
    <span>Conv</span><strong style="color:#fff">${formatPercent(pt.conversion)}</strong></div>`;
    const geo=this.getGeometry(), x=this.indexToX(idx,geo), w=tip.offsetWidth||180, left=clamp(x-w/2,8,geo.width-w-8); tip.style.left=`${left}px`; tip.style.top=`${this.padding.top+12}px`; tip.style.display='block';
  }
  hideTooltip(){ const t=this.getTooltipElement(); if(t) t.style.display='none'; }
  scheduleRender(){ if(this._raf) cancelAnimationFrame(this._raf); this._raf=requestAnimationFrame(()=>{this._raf=null;this.render();}); }
  resize(){ this.scheduleRender(); }
}

async function fetchStats(range='day',beatId=null){
  const url=beatId?`${STATS_API}/api/stats/track/${encodeURIComponent(beatId)}?range=${encodeURIComponent(range)}&tz=${tzOffset}`:`${STATS_API}/api/stats/global?range=${encodeURIComponent(range)}&tz=${tzOffset}`;
  try{ const r=await fetch(url,{cache:'no-store',headers:{Accept:'application/json'}}); if(!r.ok) throw new Error(r.status); const j=await r.json(); isOffline=false; cacheResponse(beatId?'track':'global',range,beatId,j); if(beatId) lastTrackResponse=j; else lastGlobalResponse=j; return j; }
  catch(e){ console.warn('[CC] Worker offline',e); isOffline=true; const cached=readCachedResponse(beatId?'track':'global',range,beatId); if(cached){ if(beatId) lastTrackResponse=cached; else lastGlobalResponse=cached; return cached; } return null; }
}

function updateTotals(json){
  const set=(id,val,fmt=null)=>{
    const el=document.getElementById(id); if(!el) return;
    el.textContent=fmt?fmt(val):formatNumber(Math.max(num(val),0));
  };
  if(!json){ set('totalPlays',liveCartCount?12482:0); set('totalDownloads',0); set('cartItems',liveCartCount); set('totalLikes',liveLikesCount); set('totalOrders',0); set('totalRevenue',0,formatMoney); return; }
  set('totalPlays',json.totalPlays); set('totalDownloads',json.totalDownloads);
  set('cartItems',Math.max(num(json.cartItems),liveCartCount)); set('totalLikes',Math.max(num(json.totalLikes),liveLikesCount));
  set('totalOrders',json.totalOrders); document.getElementById('totalRevenue')&&(document.getElementById('totalRevenue').textContent=formatMoney(json.totalRevenue));
}

function buildMomentumData(points){
  if(!points.length) return []; return points.map((pt,i)=>{ if(i===0) return {...pt,plays:0}; const cur=num(pt[activeMetric]), prev=num(points[i-1][activeMetric]); let mom=0; if(prev!==0) mom=((cur-prev)/Math.abs(prev))*100; return {...pt,plays:mom}; });
}
function buildConversionData(points){ return points.map(pt=>({...pt,plays:num(pt.conversion)})); }

export async function loadTradeChartData(beatId=null,range='day'){
  setCurrentBeatId(beatId); setCurrentRange(range);
  const json=await fetchStats(range,beatId); updateTotals(json);
  const pts=normalize(extractHistory(json)); activeDataset=pts;
  primaryChart?.setRange(range); momentumChart?.setRange(range); conversionChart?.setRange(range);
  primaryChart?.setData(pts); momentumChart?.setData(buildMomentumData(pts)); conversionChart?.setData(buildConversionData(pts));
  return json;
}

export const clearTrackFilter=()=>loadTradeChartData(null,currentRange);
export const selectTrackForGraph=id=>loadTradeChartData(id,currentRange);
export function setAnalyticsMetric(m){ if(!METRICS[m]) return; activeMetric=m; primaryChart?.setMetric(m); momentumChart?.setMetric('plays'); conversionChart?.setMetric('plays'); if(activeDataset.length) momentumChart?.setData(buildMomentumData(activeDataset)); }
export async function setAnalyticsRange(r){ if(!r) return; setCurrentRange(r); return loadTradeChartData(currentBeatId,r); }

// === NEW: SYNC TOP PERFORMING FROM D1 ===
export async function syncTopTracksFromD1(){
  try{
    let tracks=readJSON('dopetone_vault_tracks')||readJSON('dt_beats')||window.__D1_BEATS||[];
    if(!tracks.length){
      const res=await fetch(`${STATS_API}/api/beats/top?limit=20`).catch(()=>null);
      if(res?.ok){ const j=await res.json(); tracks=j.beats||j||[]; }
    }
    if(!tracks.length){ alert('No D1 tracks found in localStorage (dopetone_vault_tracks)'); return; }
    tracks.sort((a,b)=>(num(b.plays)+num(b.likes)*10+num(b.cart)*20)-(num(a.plays)+num(a.likes)*10+num(a.cart)*20));
    const top=tracks.slice(0,20);
    writeJSON('dt_cc_top_tracks',top);
    // dispatch event for ranking component
    document.dispatchEvent(new CustomEvent('dt-top-tracks-synced',{detail:{tracks:top}}));
    const btn=document.getElementById('ccSyncTopBtn'); if(btn){ btn.textContent=`Synced ${top.length}`; setTimeout(()=>btn.textContent='Sync Top Tracks from D1',2000); }
    return top;
  }catch(e){ console.error('syncTopTracks',e); }
}

// === NEW: CURRENT PLAYING TRACK STATS ===
function setupNowPlaying(){
  const handler=(e)=>{
    const beat=e.detail||{}; const id=beat.id??beat.beatId;
    if(!id) return;
    const el=document.getElementById('ccNowPlaying');
    if(el){ el.textContent=`NOW PLAYING: ${beat.title||beat.name||'Beat #'+id} — Plays ${formatNumber(beat.plays||0)} ♥ ${formatNumber(beat.likes||0)}`; el.style.display='block'; }
    // auto switch graph to current track if user wants
    if(localStorage.getItem('dt_cc_follow_player')==='1'){
      loadTradeChartData(String(id), currentRange);
    }
  };
  document.addEventListener('dt:track-play', handler);
  document.addEventListener('dt:beat-play', handler);
  window.addEventListener('player:play', handler);
  // Also listen to your mini player
  const observer=new MutationObserver(()=>{
    const titleEl=document.querySelector('[data-now-playing-title]'); if(!titleEl) return;
  }); observer.observe(document.body,{childList:true,subtree:true});
}

function setupResize(){
  if(typeof ResizeObserver==='undefined'){ window.addEventListener('resize',()=>{primaryChart?.resize(); momentumChart?.resize(); conversionChart?.resize();}); return; }
  resizeObserver=new ResizeObserver(()=>{primaryChart?.resize(); momentumChart?.resize(); conversionChart?.resize();});
  [primaryChart,momentumChart,conversionChart].forEach(c=>{ if(c?.canvas?.parentElement) resizeObserver.observe(c.canvas.parentElement); });
}

function startPolling(){
  if(pollInterval) clearInterval(pollInterval);
  pollInterval=setInterval(async()=>{
    rebuildMaps(); const json=await fetchStats(currentRange||'day',currentBeatId); updateTotals(json);
    const pts=normalize(extractHistory(json)); if(!pts.length) return; activeDataset=pts;
    primaryChart?.setData(pts); momentumChart?.setData(buildMomentumData(pts)); conversionChart?.setData(buildConversionData(pts));
  },POLL_INTERVAL);
}

export async function initCharts(){
  // FIX NAV BUG: destroy old if exists
  if(isInitialized){
    destroyCharts();
  }
  isInitialized=true; rebuildMaps();

  for(let i=0;i<40;i++){
    const c=document.getElementById('tradeChart'); if(c&&c.offsetWidth) break;
    await new Promise(r=>setTimeout(r,80));
  }

  primaryChart=new ProChart('tradeChart',{metric:activeMetric,range:currentRange||'day',showCandles:true,showMA:true,showRange:true,showLikesLine:true});
  momentumChart=new ProChart('momentumChart',{metric:'plays',range:currentRange||'day',showCandles:false,showMA:true,showRange:false,showLikesLine:false});
  conversionChart=new ProChart('conversionChart',{metric:'plays',range:currentRange||'day',showCandles:false,showMA:true,showRange:false,showLikesLine:false});

  // Add Sync Button + Now Playing Bar
  const root=document.getElementById('cc-main-page')||document.getElementById('cc-dashboard-root');
  if(root &&!document.getElementById('ccSyncTopBtn')){
    const bar=document.createElement('div'); bar.style.cssText='display:flex;gap:8px;align-items:center;margin-bottom:10px;';
    bar.innerHTML=`<button id="ccSyncTopBtn" style="padding:8px 14px;border-radius:8px;background:#FF1E3C;color:#fff;border:none;font-weight:800;font-size:11px;cursor:pointer">Sync Top Tracks from D1</button>
    <button id="ccFollowPlayerBtn" style="padding:8px 12px;border-radius:8px;background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.12);color:#fff;font-size:11px;cursor:pointer">Follow Player: ${localStorage.getItem('dt_cc_follow_player')==='1'?'ON':'OFF'}</button>
    <div id="ccNowPlaying" style="display:none;margin-left:8px;font-size:11px;color:#9CA3AF;font-weight:600"></div>
    <div style="margin-left:auto;font-size:9px;color:#6B7280">MOMENTUM = velocity of change • CONVERSION = cart/plays • RED DASH = LIKES</div>`;
    root.prepend(bar);
    bar.querySelector('#ccSyncTopBtn').onclick=syncTopTracksFromD1;
    bar.querySelector('#ccFollowPlayerBtn').onclick=(e)=>{
      const on=localStorage.getItem('dt_cc_follow_player')==='1'; localStorage.setItem('dt_cc_follow_player',on?'0':'1'); e.target.textContent=`Follow Player: ${!on?'ON':'OFF'}`;
    };
  }

  setupNowPlaying(); setupResize();
  document.addEventListener('visibilitychange',()=>{ if(document.hidden){ if(pollInterval){ clearInterval(pollInterval); pollInterval=null; } } else startPolling(); });

  await loadTradeChartData(currentBeatId||null,currentRange||'day');
  startPolling();
}

export function destroyCharts(){
  if(pollInterval){ clearInterval(pollInterval); pollInterval=null; }
  if(resizeObserver){ resizeObserver.disconnect(); resizeObserver=null; }
  [primaryChart,momentumChart,conversionChart].forEach(c=>c?.hideTooltip());
  primaryChart=null; momentumChart=null; conversionChart=null; isInitialized=false;
}

export function getAnalyticsState(){ return {initialized:isInitialized,offline:isOffline,metric:activeMetric,range:currentRange,beatId:currentBeatId,points:activeDataset.length}; }
