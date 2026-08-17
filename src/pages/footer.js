// src/pages/footer.js - V12.1 FOOTER - FIXED LINKS FOR V9.5 ROUTER + PERSISTENT - SAMPLES=VAULT, LICENSE/MESSAGE/FAQ=HELP
export function renderFooter(){

  const mountFooter = () => {

    const view = document.getElementById('app-view');
    if(!view) return;

    // Footer already exists in the current view
    if(document.getElementById('dt-footer')) return;

    const footerHTML = `
<footer id="dt-footer" class="dt-footer">

  <div class="dt-footer-main">

    <div class="dt-footer-left">
      <h2>DOPE TONE</h2>
      <p>Premium beats • Future sound • Industry vibes</p>
      <div class="footer-socials">
        <a href="https://instagram.com/dopetone701" target="_blank" rel="noopener">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2Zm-.2 2A3.6 3.6 0 0 0 4 7.6v8.8C4 18.39 5.61 20 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6C20 5.61 18.39 4 16.4 4H7.6Zm9.65 1.5a1.25 1.25 0 1 1 0 2.5 1.25 1.25 0 0 1 0-2.5ZM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm0 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z"/></svg>
        </a>
        <a href="https://www.youtube.com/channel/UCKddIkawOD4w_79Hc4zDw7Q" target="_blank" rel="noopener">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.196-.488-8.55-4.385-8.816ZM9 16V8l8 3.993L9 16Z"/></svg>
        </a>
        <a href="https://www.tiktok.com/@dopetonevault" target="_blank" rel="noopener">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12.525.02h3.91c.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07Z"/></svg>
        </a>
      </div>
    </div>

    <div class="dt-footer-nav">

      <div class="col">
        <span>Explore</span>
        <a href="#/beats" data-link>Beats</a>
        <a href="#/vault" data-link>Samples</a>
        <a href="#/beats" data-link>Trending</a>
      </div>

      <div class="col">
        <span>Support</span>
        <a href="#/help" data-link>Help</a>
        <a href="#/help" data-link data-scroll="ticketSection">Message</a>
        <a href="#/help" data-link data-scroll="licenseSection">License</a>
      </div>

      <div class="col">
        <span>Legal</span>
        <a href="#/terms" data-link>Terms</a>
        <a href="#/privacy" data-link>Privacy</a>
        <a href="#/help" data-link data-scroll="faqSection">FAQ</a>
      </div>

      <div class="col">
        <span>Vault</span>
        <a href="#/about" data-link>About</a>
        <a href="#/about" data-link>Contact</a>
        <a href="https://instagram.com/dopetone701" target="_blank" rel="noopener">IG</a>
      </div>

    </div>

    <div class="dt-footer-right">
      <span>STAY IN VAULT</span>
      <div class="vault-join">
        <input id="vault-email" placeholder="Email">
        <button id="vault-join-btn">→</button>
      </div>
      <div id="vault-terms" style="display:none; align-items:center; gap:6px; margin-top:6px; font-size:9px; color:#fff;">
        <input type="checkbox" id="vault-agree-check" style="width:11px; height:11px;">
        <label for="vault-agree-check">I agree to Terms</label>
      </div>
      <div class="pay-row">
        <div style="background:#fff;color:#1A1F71;font-weight:900;font-size:9px;padding:4px 6px;border-radius:4px;min-width:32px;text-align:center">VISA</div>
        <div class="pay"><img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard"></div>
        <div class="pay pay-pp" style="background:#FFC439"><img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" alt="PayPal"></div>
        <div class="pay"><img src="https://upload.wikimedia.org/wikipedia/commons/b/b0/Apple_Pay_logo.svg" alt="Apple Pay"></div>
      </div>
    </div>

  </div>

  <div class="dt-footer-bottom">
    <small>© 2026 DOPE TONE VAULT</small>
    <small class="dna">SOUND • FUTURE • CULTURE</small>
    <small>Dubai • Worldwide</small>
  </div>

</footer>
`;

    view.insertAdjacentHTML('beforeend', footerHTML);

    // AUTO SCROLL FOR HELP SECTIONS - LICENSE/MESSAGE/FAQ -> HELP PAGE
    view.querySelectorAll('a[data-scroll]').forEach(link => {
      link.addEventListener('click', (e) => {
        const targetId = link.getAttribute('data-scroll');
        setTimeout(() => {
          const target = document.getElementById(targetId);
          if(target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 300);
      });
    });
  };

  // INITIAL FOOTER
  mountFooter();

  // PERSISTENT FOOTER WATCHER - KEEPS FOOTER AFTER ROUTER RE-RENDERS #app-view
  if(!window.__DT_FOOTER_OBSERVER__){
    const app = document.getElementById('app-view');
    if(app){
      const observer = new MutationObserver(() => {
        if(!document.getElementById('dt-footer')){
          mountFooter();
        }
      });
      observer.observe(app, {
        childList:true,
        subtree:false
      });
      window.__DT_FOOTER_OBSERVER__ = observer;
    }
  }
}
