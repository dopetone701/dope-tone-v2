const d=new URL("/public/images/logo.png",window.location.origin).href,p=new URL("/public/images/dt-boss.png",window.location.origin).href,u=new URL("/public/images/dt-boss-logo.png",window.location.origin).href,h=new URL("/public/images/default-user.png",window.location.origin).href,m=new URL("/public/audio/dt-pro-tag.wav",window.location.origin).href,g=new URL("/audio/dt-pro-tag.wav",window.location.origin).href;function l(){return`
    <a href="#/home" data-link class="back-home">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
      <span>Home</span>
    </a>

    <main class="dt-about" style="min-width:0; overflow-wrap:anywhere;">
      <section class="hero">
        <div class="logo-wrap" id="logoTrigger" title="Click to play pro tag">
          <img src="${d}" alt="Dope Tone" class="main-logo" onerror="this.style.display='none'; document.getElementById('logoFallback').style.display='block';">
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
            <img src="${p}" alt="Emma Prince Don Fitchner - Founder" style="width:100%;height:100%;object-fit:cover;" onerror="this.src='${h}';">
          </div>
          <div class="founder-info" style="min-width:0; flex:1; overflow-wrap:anywhere;">
            <div style="display:flex; align-items:center; gap:12px; margin-bottom:8px; min-width:0;">
              <img src="${u}" alt="EP Logo" style="width:38px; height:38px; border-radius:50%; object-fit:cover; border:1px solid rgba(255,255,255,0.1); background:#0A1931; flex-shrink:0;" onerror="this.style.display='none'">
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
      <source src="${m}" type="audio/wav">
      <source src="${g}" type="audio/wav">
    </audio>
  `}function n(){var i;const e=document.getElementById("logoTrigger"),s=document.getElementById("proTag");let o=!1;function r(){if(!s)return;if(o){s.pause(),s.currentTime=0,e==null||e.classList.remove("playing"),o=!1;return}s.currentTime=0,s.volume=.8;const t=s.play();t&&t.then(()=>{o=!0,e==null||e.classList.add("playing")}).catch(()=>{})}if(e){const t=e.cloneNode(!0);e.parentNode.replaceChild(t,e),(i=document.getElementById("logoTrigger"))==null||i.addEventListener("click",r)}s&&s.addEventListener("ended",()=>{var t;o=!1,(t=document.getElementById("logoTrigger"))==null||t.classList.remove("playing")});const a=document.getElementById("pill-toast");document.querySelectorAll(".pill.locked").forEach(t=>{t.addEventListener("click",()=>{const c=t.getAttribute("data-msg")||"In the vault. Still cooking.";a&&(a.textContent=c,a.classList.add("show"),setTimeout(()=>a.classList.remove("show"),3e3))})}),window.scrollTo(0,0)}const w=l,v=n,y={renderDtAbout:l,initDtAbout:n,render:w,init:v};export{y as default,v as init,n as initDtAbout,w as render,l as renderDtAbout};
