// pages/footer.js - V10 NO GAP + MINI SCREEN FIX
export function renderFooter(){
  if(document.getElementById('dt-footer')) return;
  if(document.getElementById('dt-footer-css')) document.getElementById('dt-footer-css').remove();

  const style = document.createElement('style');
  style.id='dt-footer-css';
  style.textContent=`
  #app-view{padding-bottom:0!important; overflow-x:hidden!important}
  #playerMount, #global-player, .dt-player, #player-bar{
    position:fixed!important; bottom:0; left:0; right:0; height:72px!important;
    z-index:100!important; background:rgba(10,10,20,0.98)!important;
    border-top:1px solid rgba(255,255,255,0.08)!important;
  }

  .dt-footer{
    position:relative; width:100%; max-width:1280px;
    margin:40px auto 100px auto; /* lift higher - 100px = ~28px gap above player */
    background: linear-gradient(180deg, #0c1228 0%, #070a14 100%);
    border:1px solid rgba(255,255,255,0.07); border-radius:20px;
    padding:22px 28px 12px; box-sizing:border-box; z-index:5;
  }
  .dt-footer-main{display:grid;grid-template-columns:200px 1fr 200px;gap:24px;align-items:start}
  .dt-footer-left h2{font-size:16px;font-weight:900;letter-spacing:2.8px;margin:0 0 6px;background:linear-gradient(90deg,#00f0ff,#7c3aed,#ff3b7a);-webkit-background-clip:text;-webkit-text-fill-color:transparent}
  .dt-footer-left p{font-size:11px;color:rgba(255,255,255,0.48);margin:0 0 12px;line-height:1.5;max-width:190px}
  .footer-socials{display:flex;gap:7px}
  .footer-socials a{width:28px;height:28px;background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.08);border-radius:8px;display:grid;place-items:center;color:#fff;text-decoration:none}
  .footer-socials a svg{width:14px;height:14px;fill:currentColor}
  .dt-footer-nav{display:flex;justify-content:center;gap:28px}
  .dt-footer-nav .col{display:flex;flex-direction:column;gap:5px;min-width:60px}
  .dt-footer-nav .col span{font-size:9px;letter-spacing:1.8px;text-transform:uppercase;color:#fff;font-weight:700;margin-bottom:3px}
  .dt-footer-nav .col a{font-size:11px;color:rgba(255,255,255,0.52);text-decoration:none;line-height:1.3}
  .dt-footer-right{display:flex;flex-direction:column;gap:8px;align-items:flex-start;min-width:0;max-width:100%}
  .dt-footer-right > span{font-size:9px;letter-spacing:1.8px;text-transform:uppercase;color:#fff;font-weight:700;white-space:nowrap}
  .vault-join{display:flex;align-items:center;width:100%;max-width:190px;background:rgba(0,0,0,0.35);border:1px solid rgba(255,255,255,0.1);border-radius:99px;padding:3px;box-sizing:border-box}
  .vault-join input{flex:1;background:transparent;border:0;color:#fff;padding:6px 10px;outline:none;font-size:11px;min-width:0;width:100%}
  .vault-join button{width:24px;height:24px;min-width:24px;background:#fff;color:#000;border:0;border-radius:50%;font-weight:900;font-size:11px;cursor:pointer;flex-shrink:0}
  .pay-row{display:flex;gap:5px;margin-top:2px;flex-wrap:wrap;max-width:100%}
  .pay{width:32px;height:20px;background:#fff;border-radius:4px;display:flex;align-items:center;justify-content:center;padding:2px 3px}
  .pay img{width:100%;height:100%;object-fit:contain}
  
  /* LENOVO MINI SCREEN FIX - 1024 to 1366 */
  @media(max-width:1366px){
    .dt-footer-main{grid-template-columns:170px 1fr 170px;gap:16px}
    .dt-footer-nav{gap:18px}
    .dt-footer-nav .col{min-width:50px}
    .dt-footer-right{max-width:170px}
    .vault-join{max-width:165px}
  }
  @media(max-width:1100px){
    .dt-footer{width:calc(100% - 16px)!important;max-width:calc(100% - 16px)!important;margin:20px auto 0 auto!important;padding:18px 18px 10px!important}
    .dt-footer-main{grid-template-columns:1fr!important;gap:0!important}
    .dt-footer-left{padding:0 0 14px 0;display:flex;flex-direction:column;align-items:center;text-align:center;border-bottom:1px solid rgba(255,255,255,0.06)}
    .dt-footer-left p{max-width:260px;text-align:center}
    .dt-footer-nav{display:grid!important;grid-template-columns:repeat(4,1fr)!important;gap:1px!important;background:rgba(255,255,255,0.06)!important;padding:0!important;margin-top:0!important}
    .dt-footer-nav .col{background:rgba(12,18,40,0.95);padding:14px 12px;align-items:center;text-align:center}
    .dt-footer-right{padding:16px 0 0 0;align-items:center!important;max-width:100%!important;background:transparent!important}
    .dt-footer-right > span{text-align:center!important;white-space:normal!important}
    .vault-join{max-width:280px!important;width:100%!important}
    .pay-row{justify-content:center!important}
  }
  @media(max-width:600px){
    .dt-footer-nav{grid-template-columns:1fr 1fr!important}
  }


   /* ================= FOOTER BOTTOM ================= */

.dt-footer-bottom{
    width:100%;
    display:flex;
    align-items:center;
    justify-content:space-between;
    margin-top:14px;
    padding-top:10px;
    border-top:1px solid rgba(255,255,255,.08);
    position:relative;
}

.dt-footer-bottom small{
    margin:0;
    font-size:8px;
    color:rgba(255,255,255,.35);
    line-height:1;
}

/* Left */
.dt-footer-bottom small:first-child{
    flex:1;
    text-align:left;
}

/* Center */
.dt-footer-bottom .dna{
    position:absolute;
    left:50%;
    transform:translateX(-50%);
    margin:0;
    font-size:8px;
    font-weight:700;
    letter-spacing:2px;
    color:#00eaff;
    white-space:nowrap;
    pointer-events:none;
}

/* Right */
.dt-footer-bottom small:last-child{
    flex:1;
    text-align:right;
}

/* Mobile */
@media (max-width:768px){

    .dt-footer-bottom{
        flex-direction:column;
        gap:6px;
        text-align:center;
    }

    .dt-footer-bottom .dna{
        position:static;
        transform:none;
        order:2;
    }

    .dt-footer-bottom small:first-child{
        text-align:center;
        flex:none;
    }

    .dt-footer-bottom small:last-child{
        text-align:center;
        flex:none;
    }

}


  `;
  document.head.appendChild(style);

  const footerHTML = `
<footer id="dt-footer" class="dt-footer">
  <div class="dt-footer-main">
    <div class="dt-footer-left">
      <h2>DOPE TONE</h2>
      <p>Premium beats • Future sound • Industry vibes</p>
      <div class="footer-socials">
        <a href="https://instagram.com/dopetone701" target="_blank"><svg viewBox="0 0 24 24"><path d="M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2m-.2 2A3.6 3.6 0 0 0 4 7.6v8.8C4 18.39 5.61 20 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6C20 5.61 18.39 4 16.4 4H7.6m9.65 1.5a1.25 1.25 0 0 1 1.25 1.25A1.25 0 0 1 17.25 8 1.25 0 0 1 16 6.75a1.25 0 0 1 1.25-1.25M12 7a5 5 0 0 1 5 5 5 5 0 0 1-5 5 0 0 1-5-5 5 5 0 0 1 5-5m0 2a3 3 0 0 0-3 3 3 3 0 0 0 3 3 0 0 0 3-3 3 3 0 0 0-3-3z"/></svg></a>
        <a href="https://www.youtube.com/channel/UCKddIkawOD4w_79Hc4zDw7Q" target="_blank"><svg viewBox="0 0 24 24"><path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/></svg></a>
        <a href="https://www.tiktok.com/@dopetonevault" target="_blank"><svg viewBox="0 0 24 24"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/></svg></a>
      </div>
    </div>
    <div class="dt-footer-nav">
      <div class="col"><span>Explore</span><a href="/">Beats</a><a href="/">Samples</a><a href="/">Trending</a></div>
      <div class="col"><span>Support</span><a href="./help.html#faqSection">Help</a><a href="./help.html#ticketSection">Ticket</a><a href="./help.html#licenseSection">License</a></div>
      <div class="col"><span>Legal</span><a href="./help.html#termsSection">Terms</a><a href="./help.html#privacySection">Privacy</a><a href="./help.html#faqSection">FAQ</a></div>
      <div class="col"><span>Vault</span><a href="./dt-about.html">About</a><a href="./dt-about.html#contact-vault">Contact</a><a href="https://instagram.com/dopetone701" target="_blank">IG</a></div>
    </div>
    <div class="dt-footer-right">
      <span>STAY IN VAULT</span>
      <div class="vault-join"><input id="vault-email" placeholder="Email"><button id="vault-join-btn">→</button></div>
      <div id="vault-terms" style="display:none; align-items:center; gap:6px; margin-top:6px; font-size:9px; color:#fff;"><input type="checkbox" id="vault-agree-check" style="width:11px; height:11px;"><label for="vault-agree-check">I agree to Terms</label></div>
      <div class="pay-row">
        <div style="background:#fff;color:#1A1F71;font-weight:900;font-size:9px;padding:4px 6px;border-radius:4px;min-width:32px;text-align:center">VISA</div>
        <div class="pay"><img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg"></div>
        <div class="pay pay-pp" style="background:#FFC439"><img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg"></div>
        <div class="pay"><img src="https://upload.wikimedia.org/wikipedia/commons/b/b0/Apple_Pay_logo.svg"></div>
      </div>
    </div>
    </div> <!-- .dt-footer-main -->

  <div class="dt-footer-bottom"><small>© 2026 DOPE TONE VAULT</small><small class="dna">SOUND • FUTURE • CULTURE</small><small>Dubai • Worldwide</small></div>
</footer>`;

  const view = document.getElementById('app-view');
  if(view) view.insertAdjacentHTML('beforeend', footerHTML);
  else document.body.insertAdjacentHTML('beforeend', footerHTML);
}
