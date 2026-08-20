// DOPE TONE LIQUID EQ - SINGLE SOURCE - INVERTED DYNAMICS
export function initLiquidEq(){
  if(window.__EQ_INIT__) return;
  window.__EQ_INIT__ = true;

  let analyser=null, audioCtx=null, source=null, dataArray=null, canvas=null, ctx=null, animId=null;
  const BANDS=60;
  let bars=new Array(BANDS).fill(0);
  let noiseFloor=new Array(BANDS).fill(0);
  let globalEnergy=0;

  const getAudio = ()=> window.__DT_AUDIO__ || null;
  const getCover = ()=> document.getElementById("gpCover");

  function setupCanvas(){
    canvas=document.getElementById("liquidEq"); if(!canvas) return false;
    ctx=canvas.getContext("2d"); canvas.width=58; canvas.height=58; return true;
  }
  function connectAudio(){
    const audio=getAudio(); if(!audio||audioCtx) return;
    try{
      audioCtx=new (window.AudioContext||window.webkitAudioContext)();
      analyser=audioCtx.createAnalyser(); analyser.fftSize=4096; analyser.smoothingTimeConstant=0.0;
      source=audioCtx.createMediaElementSource(audio);
      source.connect(analyser); analyser.connect(audioCtx.destination);
      dataArray=new Uint8Array(analyser.frequencyBinCount);
    }catch(e){}
  }
  function getBuckets(){
    const buckets=[]; const minFreq=15,maxFreq=20000,nyquist=audioCtx.sampleRate/2,binHz=nyquist/dataArray.length;
    for(let i=0;i<BANDS;i++){
      const ratio=i/BANDS, skewed=Math.pow(ratio,1.15);
      const freq=minFreq*Math.pow(maxFreq/minFreq,skewed);
      const nextFreq=minFreq*Math.pow(maxFreq/minFreq,Math.pow((i+1)/BANDS,1.15));
      const startBin=Math.max(1,Math.floor(freq/binHz)), endBin=Math.min(Math.floor(nextFreq/binHz),dataArray.length-1);
      buckets.push([startBin,endBin]);
    } return buckets;
  }
  function getWeight(i){ if(i<10) return 0.9; if(i>=15&&i<=35) return 1.7; if(i>=12&&i<=40) return 1.35; return 1; }
  function getFloor(i,energy){ const busy=Math.max(0,1-energy*2); if(i>=15&&i<=35) return 3*busy; if(i>=12&&i<=40) return 1.5*busy; return 0; }

  function drawBars(){
    const w=58,h=58,centerY=h/2,inset=2,drawWidth=w-inset*2,step=drawWidth/(BANDS-1);
    // neon line
    const glow=10+globalEnergy*12;
    const grad=ctx.createLinearGradient(inset,centerY,w-inset,centerY);
    grad.addColorStop(0,'rgba(80,180,255,0)'); grad.addColorStop(0.5,'rgba(120,200,255,1)'); grad.addColorStop(1,'rgba(80,180,255,0)');
    ctx.shadowBlur=glow; ctx.shadowColor='rgba(45,150,255,1)'; ctx.strokeStyle=grad; ctx.lineCap='round';
    ctx.lineWidth=2.5+globalEnergy*1.5; ctx.beginPath(); ctx.moveTo(inset,centerY); ctx.lineTo(w-inset,centerY); ctx.stroke();
    ctx.shadowBlur=0;

    const g2=ctx.createLinearGradient(0,h,0,0);
    g2.addColorStop(0,'rgba(26,77,255,1)'); g2.addColorStop(0.5,'rgba(45,99,255,0.8)'); g2.addColorStop(1,'rgba(255,45,58,0.6)');
    ctx.fillStyle=g2; ctx.shadowBlur=12+globalEnergy*12; ctx.shadowColor='rgba(45,99,255,0.8)';
    ctx.beginPath(); ctx.moveTo(inset,centerY);
    for(let i=0;i<BANDS-1;i++){
      const x1=inset+i*step,y1=centerY-bars[i]*0.9,x2=inset+(i+1)*step,y2=centerY-bars[i+1]*0.9,cx=(x1+x2)/2,cy=(y1+y2)/2;
      ctx.quadraticCurveTo(x1,y1,cx,cy);
    } ctx.lineTo(w-inset,centerY); ctx.closePath(); ctx.fill();
    ctx.save(); ctx.translate(0,h); ctx.scale(1,-1); ctx.globalAlpha=0.35+globalEnergy*0.1;
    ctx.beginPath(); ctx.moveTo(inset,centerY);
    for(let i=0;i<BANDS-1;i++){
      const x1=inset+i*step,y1=centerY-bars[i]*0.9,x2=inset+(i+1)*step,y2=centerY-bars[i+1]*0.9,cx=(x1+x2)/2,cy=(y1+y2)/2;
      ctx.quadraticCurveTo(x1,y1,cx,cy);
    } ctx.lineTo(w-inset,centerY); ctx.closePath(); ctx.fill(); ctx.restore(); ctx.shadowBlur=0;
  }

  function loop(){
    animId=requestAnimationFrame(loop);
    if(!ctx) return;
    const audio=getAudio();
    if(audio &&!audio.paused &&!audioCtx) connectAudio();
    ctx.clearRect(0,0,58,58);
    if(!audio||audio.paused||!analyser||!dataArray){
      for(let i=0;i<BANDS;i++){ const floor=getFloor(i,0); bars[i]=Math.max(floor,bars[i]*0.85); }
      noiseFloor=noiseFloor.map(v=>v*0.95); globalEnergy*=0.9; drawBars(); return;
    }
    if(audioCtx.state==='suspended') audioCtx.resume();
    analyser.getByteFrequencyData(dataArray);
    let sum=0; for(let i=0;i<dataArray.length;i++) sum+=dataArray[i];
    globalEnergy=globalEnergy*0.8 + (sum/dataArray.length/255)*0.2;
    const buckets=getBuckets();
    for(let i=0;i<BANDS;i++){
      let max=0; for(let j=buckets[i][0];j<=buckets[i][1];j++) max=Math.max(max,dataArray[j]);
      const raw=max/255; noiseFloor[i]=noiseFloor[i]*0.995+raw*0.005;
      let threshold=0.05+globalEnergy*0.01; if(i<10) threshold=0.085+globalEnergy*0.02; else if(i>=15&&i<=35) threshold=0.025+globalEnergy*0.005;
      const gated=Math.max(0,raw-noiseFloor[i]*(1.3-globalEnergy*0.3));
      const boosted=gated*getWeight(i); const floor=getFloor(i,globalEnergy); const gainBoost=58+globalEnergy*25;
      const target=boosted>threshold?(boosted-threshold)*gainBoost:floor;
      let decay=0.87-globalEnergy*0.15; if(i<10) decay=0.78-globalEnergy*0.13; else if(i>=15&&i<=35) decay=0.77+globalEnergy*0.05;
      if(target>bars[i]){ const attack=1.0-globalEnergy*0.2; bars[i]=bars[i]*(1-attack)+target*attack; }
      else{ bars[i]=Math.max(floor,bars[i]*decay+target*(1-decay)); }
    }
    drawBars();
  }

  setupCanvas(); loop();
}
