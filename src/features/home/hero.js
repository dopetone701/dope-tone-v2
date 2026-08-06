// src/features/home/hero.js - DOPE TONE VAULT HERO V2
export function renderHero(){
  if(!document.getElementById('hero-v2-css')){
    const style = document.createElement('style');
    style.id = 'hero-v2-css';
    style.textContent = `
      .hero-v2{
        height:90vh; min-height:620px; width:100%;
        background: linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url('/public/images/studio.jpg') center/cover no-repeat;
        display:flex; align-items:center; justify-content:center; text-align:center;
        position:relative; border-radius:14px; overflow:hidden; margin-bottom:12px;
        border:1px solid rgba(255,255,255,0.08);
      }
      .hero-v2::before{content:"";position:absolute;inset:0;background:rgba(0,0,20,0.6);z-index:1}
      .hero-v2-content{position:relative;z-index:2;padding:20px}
      .hero-title{font-family:'Orbitron',sans-serif;text-transform:uppercase;margin:0}
      .top-line,.bottom-line{
        display:block; font-size:clamp(36px,8vw,85px); letter-spacing:6px;
        background-image: linear-gradient(90deg,#4da6ff,#ffffff,#ff4d94), url('/public/images/metal.jpg');
        background-size:cover; background-position:center; background-blend-mode:overlay;
        -webkit-background-clip:text; -webkit-text-fill-color:transparent;
        background-clip:text;
        text-shadow:0 2px 2px rgba(0,0,0,0.6),0 6px 18px rgba(0,0,0,0.9);
      }
      .bottom-line{width:60%;margin:10px auto 0}
      .glass-title{display:inline-block;padding:12px 28px;border-radius:14px;background:rgba(10,15,30,0.25);backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);border:1px solid rgba(255,255,255,0.15);box-shadow:0 8px 30px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.15)}
      .hero-subtext{font-size:1.1rem;letter-spacing:2px;font-weight:600;background:linear-gradient(90deg,#8fd3ff,#c084fc,#6ee7ff);-webkit-background-clip:text;-webkit-text-fill-color:transparent;text-shadow:0 0 8px rgba(120,200,255,0.4);margin-top:18px;animation:shimmer 6s linear infinite;background-size:200% auto}
      @keyframes shimmer{0%{background-position:-200% center}100%{background-position:200% center}}
      .hero-buttons{margin-top:30px;display:flex;gap:12px;justify-content:center;flex-wrap:wrap}
      .cta-btn{padding:12px 26px;border-radius:999px;font-size:0.95rem;font-weight:600;letter-spacing:1px;position:relative;overflow:hidden;isolation:isolate;border:1px solid rgba(165,243,252,0.5);background:transparent;color:#a5f3fc;cursor:pointer;transition:0.3s;text-decoration:none}
      .cta-btn.primary:hover{background:rgba(255,60,60,0.12);border-color:#ff4d4d;box-shadow:0 0 15px rgba(255,60,60,0.5);transform:translateY(-1px) scale(1)}
      .cta-btn.secondary:hover{background:rgba(165,243,252,0.1);border-color:#6ee7ff;box-shadow:0 0 15px rgba(110,231,255,0.4);transform:translateY(-1px) scale(1)}
      @media(max-width:768px){
        .hero-v2{height:auto!important;min-height:0!important;padding:40px 0 16px 0!important;background-position: center top!important;margin-bottom:4px!important}
      }
    `;
    document.head.appendChild(style);
  }

  return `
    <section class="hero-v2">
      <div class="hero-v2-content">
        <h1 class="hero-title glass-title">
          <span class="top-line">DOPE TONE</span>
          <span class="bottom-line">VAULT</span>
        </h1>
        <p class="hero-subtext">Premium Sound Arsenal For Next-Level Creators</p>
        <div class="hero-buttons">
          <a href="/beats" data-link class="cta-btn primary">Explore Beats</a>
          <button class="cta-btn secondary" onclick="window.navigateTo('/packs')">Sample Packs</button>
        </div>
      </div>
    </section>
  `;
}
