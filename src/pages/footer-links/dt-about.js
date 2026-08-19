// src/pages/footer-links/dt-about.js - V12.1 - FIXED CHOP - URL WIRED - NO CSS IMPORT
const IMG_LOGO = new URL('/public/images/logo.png', window.location.origin).href;
const IMG_BOSS = new URL('/public/images/dt-boss.png', window.location.origin).href;
const IMG_BOSS_LOGO = new URL('/public/images/dt-boss-logo.png', window.location.origin).href;
const IMG_FALLBACK = new URL('/public/images/default-user.png', window.location.origin).href;
const AUDIO_TAG = new URL('/public/audio/dt-pro-tag.wav', window.location.origin).href;
const AUDIO_TAG_ALT = new URL('/audio/dt-pro-tag.wav', window.location.origin).href;

export function renderDtAbout() {
  return `
    <a href="#/home" data-link class="back-home">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
      <span>Home</span>
    </a>

    <main class="dt-about" style="min-width:0; overflow-wrap:anywhere;">
      <section class="hero">
        <div class="logo-wrap" id="logoTrigger" title="Click to play pro tag">
          <img src="${IMG_LOGO}" alt="Dope Tone" class="main-logo" onerror="this.style.display='none'; document.getElementById('logoFallback').style.display='block';">
          <h1 id="logoFallback" class="logo-fallback" style="display:none;">DOPE TONE</h1>
          <div class="logo-pulse"></div>
          <span class="tap-hint">click logo for tag</span>
        </div>
        <p class="hero-label">The Vault</p>
        <h2 class="hero-title">A vault for producers and artists who care about sound.</h2>
        <p class="hero-sub">Dope Tone is a home for valuable sounds. Beats, samples, drum kits and loops — curated to be used, not just stored. Everything lives inside The Vault.</p>
      </section>

      <section class="story">
        <div class="story-grid" style="min-width:0;">
          <div class="story-left" style="min-width:0;">
            <span class="eyebrow">Our Focus</span>
            <h3>Quality over quantity.<br>Sound over noise.</h3>
          </div>
          <div class="story-right" style="min-width:0; overflow-wrap:anywhere;">
            <p>We started with a simple idea — create products we would use ourselves in the studio.</p>
            <p>Dope Tone is still growing. We are opening the vault slowly, making sure every drop is worth your time. Early supporters get first access to all packs and private licences.</p>
            <div class="pill-row">
              <a href="#/beats" data-link class="pill unlocked beats-pill">Beats <span class="outside-text">Explore Beats →</span></a>
              <button class="pill locked" data-msg="Drum Kits — In the vault. Still cooking.">Drum Kits</button>
              <button class="pill locked" data-msg="Sample Packs — Dropping soon.">Samples</button>
              <button class="pill locked" data-msg="Loops — Being curated. Early access soon.">Loops</button>
            </div>
            <div id="pill-toast" class="pill-toast"></div>
          </div>
        </div>
      </section>

      <section class="founder" style="min-width:0;">
        <div class="founder-card" style="min-width:0;">
          <div class="founder-img-wrap" style="flex-shrink:0;">
            <img src="${IMG_BOSS}" alt="Emma Prince Don Fitchner - Founder" style="width:100%;height:100%;object-fit:cover;" onerror="this.src='${IMG_FALLBACK}';">
          </div>
          <div class="founder-info" style="min-width:0; flex:1; overflow-wrap:anywhere;">
            <div style="display:flex; align-items:center; gap:12px; margin-bottom:8px; min-width:0;">
              <img src="${IMG_BOSS_LOGO}" alt="EP Logo" style="width:38px; height:38px; border-radius:50%; object-fit:cover; border:1px solid rgba(255,255,255,0.1); background:#0A1931; flex-shrink:0;" onerror="this.style.display='none'">
              <span class="eyebrow" style="margin:0;">Founder</span>
            </div>
            <h3 style="overflow-wrap:anywhere; word-break:break-word;">Emma Prince Don Fitchner</h3>
            <p class="role">Producer • Artist — Dubai, UAE</p>
            <p class="founder-text">I am a producer and artist based in Dubai. I created Dope Tone to share valuable products with my fellow producers and artists — sounds that are clean, hard-hitting, and ready for records.</p>
            <p class="founder-text">Producing since 2023. Dope Tone is where all my work comes together in one place — The Vault. Every beat is mixed and mastered for instant use.</p>
            <div class="socials" style="min-width:0;">
              <a href="https://www.tiktok.com/@emmaprincedf" target="_blank" class="soc">TikTok</a>
              <a href="https://www.instagram.com/emmaprincedonfitcner" target="_blank" class="soc">Instagram</a>
              <a href="https://youtube.com/@emmaprincedonfichtner6130" target="_blank" class="soc">YouTube</a>
              <a href="https://www.facebook.com/share/1BcWk4HXcG" target="_blank" class="soc">Facebook</a>
            </div>
            <div id="contact-vault" class="contact-vault" style="min-width:0;">
              <span class="eyebrow">Vault Access</span>
              <h3 style="font-size:18px; margin:6px 0 14px;">Contact</h3>
              <div class="contact-grid" style="min-width:0;">
                <a href="mailto:creators@dopetonevault.com" class="contact-item" style="min-width:0; overflow-wrap:anywhere;">
                  <div style="min-width:0;"><span>Email</span><p>creators@dopetonevault.com</p></div>
                </a>
                <a href="https://wa.me/971524082460" target="_blank" class="contact-item" style="min-width:0;">
                  <div style="min-width:0;"><span>WhatsApp</span><p>+971 52 408 2460</p></div>
                </a>
                <a href="tel:+971524082460" class="contact-item" style="min-width:0;">
                  <div style="min-width:0;"><span>Call</span><p>+971 52 408 2460</p></div>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section class="collab">
        <h3>Open to collaborations</h3>
        <p>Artists, producers, vocalists — let's work. Send your idea and we lock in.</p>
        <a href="mailto:creators@dopetonevault.com" class="email-link">creators@dopetonevault.com</a>
      </section>
    </main>

    <audio id="proTag" preload="auto">
      <source src="${AUDIO_TAG}" type="audio/wav">
      <source src="${AUDIO_TAG_ALT}" type="audio/wav">
    </audio>
  `;
}

export function initDtAbout() {
  const logo = document.getElementById('logoTrigger');
  const audio = document.getElementById('proTag');
  let playing = false;
  function playTag(){
    if(!audio) return;
    if(playing){ audio.pause(); audio.currentTime=0; logo?.classList.remove('playing'); playing=false; return; }
    audio.currentTime=0; audio.volume=0.8;
    const p = audio.play();
    if(p) p.then(()=>{ playing=true; logo?.classList.add('playing'); }).catch(()=>{});
  }
  if(logo) {
    const newLogo = logo.cloneNode(true);
    logo.parentNode.replaceChild(newLogo, logo);
    document.getElementById('logoTrigger')?.addEventListener('click', playTag);
  }
  if(audio) {
    audio.addEventListener('ended', ()=>{ playing=false; document.getElementById('logoTrigger')?.classList.remove('playing'); });
  }
  const toast = document.getElementById('pill-toast');
  document.querySelectorAll('.pill.locked').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      const msg = btn.getAttribute('data-msg') || 'In the vault. Still cooking.';
      if(toast){ toast.textContent = msg; toast.classList.add('show'); setTimeout(()=> toast.classList.remove('show'), 3000); }
    });
  });
  window.scrollTo(0,0);
}
export const render = renderDtAbout;
export const init = initDtAbout;
export default { renderDtAbout, initDtAbout, render, init };
