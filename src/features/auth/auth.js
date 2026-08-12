// ========================================
// 🔥 AUTH MANAGER v5.0 - VAULT V2 LEVEL - FIXED
// Backend: Cloudflare D1 + R2 - Frontend: V2 Clean
// ========================================

const CONFIG = {
  ADMIN_EMAIL: 'dopetone701@gmail.com',
API_URL: 'https://api.dopetonevault.com',
  DEFAULT_AVATAR: 'public/images/default-user.png',
  STORAGE_KEYS: ['dopetone_cart','dopetone_playlists','dopetone_liked_beats','dopetone_licences'],
  OTP_TIMEOUT: 300,
};

const $ = (id) => document.getElementById(id);
const getCartRaw = () => {
  try { return JSON.parse(localStorage.getItem('dopetone_cart')||'[]') } catch { return [] }
};

class AuthManagerV2 {
  #user = null;
  #isSignup = false;
  #cropper = null;
  #avatarData = CONFIG.DEFAULT_AVATAR;
  #els = {};
  #bound = false;
  #otp = { email:'', timer:null, seconds: CONFIG.OTP_TIMEOUT, username:'', password:'' };
  #isResetFlow = false;
  #syncTimeout = null;

  constructor(){
    if(sessionStorage.getItem('just_logged_out')){
      sessionStorage.removeItem('just_logged_out');
      this.#clearAll();
    }
    this.init();
  }

  // ---- INIT V2 ----
  async init(){
    await this.#waitForNavbar();
    this.#cache();
    this.#bindOnce();
    this.#loadSession();
    console.log("✅ Auth V2 ready");
  }

  #waitForNavbar(){
    return new Promise(res=>{
      // FIX 1: Wait for BOTH navbar AND modals
      const ready = () => ($('accountBtn')||$('loginBtn')||$('userAvatar')) && $('authModal') && $('authForm');
      if(ready()) return res();
      const obs = new MutationObserver(()=>{
        if(ready()){ obs.disconnect(); res(); }
      });
      obs.observe(document.body,{childList:true,subtree:true});
      setTimeout(()=>{ obs.disconnect(); res(); },4000);
    });
  }

  #cache(){
    [
      'authModal','authForm','authTitle','authSubtitle','authUsername','authEmail','authPassword','authSubmit','authError','authCloseBtn',
      'switchAuthBtn','switchAuthText','signupAvatarWrap','avatarInput','avatarPreview','accountPanel','panelName','panelEmail','panelAvatar',
      'logoutAction','authToast','authToastText','cropModal','cropImage','saveCrop','cancelCrop','changeAvatarInput','usernameGroup',
      'forgotPasswordBtn','authBox','controlCenterBtn','togglePassword',
      'otpModal','otpEmail','otpInputs','otpVerifyBtn','otpResendBtn','otpError','otpCloseBtn','otpCountdown','otpBackBtn',
      'logoutModal','logoutCancelBtn','logoutConfirmBtn',
      'resetPasswordModal','resetEmail','newPassword','confirmNewPassword','resetSubmitBtn','resetError','resetCloseBtn',
      'toggleNewPassword','toggleConfirmPassword','resetPasswordForm'
    ].forEach(id=> this.#els[id]=$(id));
  }

  // ---- V2 STORAGE - USER SCOPED ----
  #uid(){ return localStorage.getItem('dopetone_user_id') || this.#user?.id || null; }

  getUserStorage(key){
    const uid=this.#uid();
    return localStorage.getItem(uid?`${key}_${uid}`:key) || localStorage.getItem(key) || '[]';
  }

  setUserStorage(key, val){
    const uid=this.#uid();
    if(uid) localStorage.setItem(`${key}_${uid}`, val);
    else localStorage.setItem(key, val);
    clearTimeout(this.#syncTimeout);
    this.#syncTimeout=setTimeout(()=>this.syncToCloud(), 800);
  }

  async syncToCloud(){
    if(!this.#user) return;
    const payload={
      user_id: this.#user.id,
      cart: JSON.parse(this.getUserStorage('dopetone_cart')),
      playlists: JSON.parse(this.getUserStorage('dopetone_playlists')),
      likes: JSON.parse(this.getUserStorage('dopetone_liked_beats')),
      licences: JSON.parse(this.getUserStorage('dopetone_licences')),
      avatar: this.#user.avatar,
      settings:{ theme: localStorage.getItem('dopetone_theme'), volume: localStorage.getItem('dopetone_volume') }
    };
    try{ await fetch(`${CONFIG.API_URL}/api/user/sync`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)}); }catch{}
  }

  async loadFromCloud(){
    if(!this.#user) return;
    try{
      const r=await fetch(`${CONFIG.API_URL}/api/user/${this.#user.id}/data`);
      const d=await r.json();
      if(!d) return;
      CONFIG.STORAGE_KEYS.forEach(k=>{
        const key=k==='dopetone_liked_beats'?'likes':k==='dopetone_licences'?'licences':k.replace('dopetone_','');
        if(d[key]!==undefined) this.setUserStorage(k, JSON.stringify(d[key]||[]));
      });
      if(d.avatar){
        this.#user.avatar=d.avatar; this.#avatarData=d.avatar;
        localStorage.setItem('dopetone_user', JSON.stringify(this.#user));
        document.querySelectorAll('[data-user-avatar],#userAvatar,#panelAvatar,.header-avatar').forEach(img=>img.src=d.avatar);
      }
      this.updateCartCount();
    }catch(e){ console.warn("Cloud load failed",e); }
  }

  #loadSession(){
    try{
      const raw=localStorage.getItem('dopetone_user');
      if(raw){ this.#user=JSON.parse(raw); localStorage.setItem('dopetone_user_id', this.#user.id); this.loadFromCloud(); }
    }catch{}
    this.#syncUI();
  }

  // ---- MODAL SYSTEM V2 ----
  openModal(signup=false){
    // FIX 2: Re-cache if modals injected late
    if(!this.#els.authModal) this.#cache();
    this.#isSignup=signup;
    this.#updateModalUI();
    this.#show(this.#els.authModal);
    setTimeout(()=>this.#els.authEmail?.focus(),80);
  }
  closeModal(){ this.#hide(this.#els.authModal); this.#els.authForm?.reset(); this.#clearError(); }
  #show(el){ if(!el) return; el.classList.add('active'); el.setAttribute('aria-hidden','false'); document.body.style.overflow='hidden'; }
  #hide(el){ if(!el) return; el.classList.remove('active'); el.setAttribute('aria-hidden','true'); if(!document.querySelector('.modal.active,.auth-modal.active')) document.body.style.overflow=''; }

  #updateModalUI(){
    const {authTitle,authSubtitle,authEmail,authPassword,usernameGroup,signupAvatarWrap,forgotPasswordBtn,switchAuthText,switchAuthBtn,authBox,avatarPreview}=this.#els;
    if(!authTitle ||!authSubtitle){ this.#cache(); return; }
    authTitle.textContent=this.#isSignup?'Create Account':'Join the vault';
    if(this.#isSignup){
      authTitle.textContent='Create Account';
      authSubtitle.textContent='Join the vault';
    } else {
      authTitle.textContent='Welcome Back';
      authSubtitle.textContent='Login to your vault';
    }
    if(avatarPreview){
      const im=avatarPreview.querySelector('img');
      if(im) im.src=this.#avatarData||CONFIG.DEFAULT_AVATAR;
    }
    if(usernameGroup){
      usernameGroup.style.display=this.#isSignup?'flex':'none';
      if(this.#els.authUsername) this.#els.authUsername.required=this.#isSignup;
    }
    if(signupAvatarWrap) signupAvatarWrap.style.display=this.#isSignup?'flex':'none';
    if(forgotPasswordBtn) forgotPasswordBtn.style.display=this.#isSignup?'none':'block';
    if(switchAuthText) switchAuthText.textContent=this.#isSignup?'Already have an account?':"Don't have an account?";
    if(switchAuthBtn) switchAuthBtn.textContent=this.#isSignup?'Login':'Sign Up';
    if(authBox) authBox.setAttribute('data-mode',this.#isSignup?'signup':'login');
    if(authEmail){
      const group = authEmail.closest('.auth-group') || authEmail.parentElement;
      if(group) group.style.display='flex';
      authEmail.required=true;
    }
    if(authPassword) authPassword.autocomplete=this.#isSignup?'new-password':'current-password';
  }

  // ---- BIND ONCE V2 ----
  #bindOnce(){
    if(this.#bound) return; this.#bound=true;

    document.addEventListener('click', (e)=>{
      if(e.target.closest('#loginBtn,#mobileLoginBtn')){ e.preventDefault(); this.openModal(false); $('mobileNav')?.classList.remove('active'); return; }
      if(e.target.closest('#signupBtn,#mobileSignupBtn')){ e.preventDefault(); this.openModal(true); $('mobileNav')?.classList.remove('active'); return; }
      if(e.target.closest('#accountBtn,#userAvatar,.avatar-btn,#authUser')){ e.preventDefault(); this.#user? this.togglePanel() : this.openModal(false); return; }
      const panel=$('accountPanel');
      if(panel?.classList.contains('active') &&!panel.contains(e.target) &&!e.target.closest('#accountBtn') &&!e.target.closest('#authUser')) panel.classList.remove('active');
if(e.target.closest('#controlCenterBtn')){ e.preventDefault(); e.stopPropagation(); document.getElementById('userPanel')?.classList.remove('active'); location.hash='#/cc/overview'; return; }
      if(e.target.closest('[data-action="playlists"]')) location.href='playlists.html';
      if(e.target.closest('[data-action="liked"]')) location.href='playlists.html?tab=liked_playlist';
      if(e.target.closest('#logoutAction')) this.logout();
      // FIX 3: Click outside modal to close
      if(e.target.classList.contains('auth-overlay')){
        const t=e.target.dataset.close;
        if(t==='auth') this.closeModal();
        if(t==='otp') this.#closeOtp();
        if(t==='reset') this.#closeReset();
        if(t==='logout') this.#hide(this.#els.logoutModal);
        if(t==='crop') this.#closeCrop();
      }
    }, true);

       $('chooseDifferentBtn')?.addEventListener('click', ()=> $('changeAvatarInput')?.click());
    $('changeAvatarInput')?.addEventListener('change', e=> e.target.files[0] && this.#openCrop(e.target.files[0]));


    this.#els.authCloseBtn?.addEventListener('click',()=>this.closeModal());
    this.#els.otpCloseBtn?.addEventListener('click',()=>this.#closeOtp());
    this.#els.otpBackBtn?.addEventListener('click',()=>{ this.#closeOtp(); this.openModal(this.#isSignup); });
    this.#els.authModal?.addEventListener('click',e=>{ if(e.target===this.#els.authModal) this.closeModal(); });
    this.#els.authForm?.addEventListener('submit',e=>this.#handleAuth(e));
    this.#els.switchAuthBtn?.addEventListener('click',()=>{ this.#isSignup=!this.#isSignup; this.#updateModalUI(); this.#clearError(); });
    this.#els.forgotPasswordBtn?.addEventListener('click',()=>this.#handleForgot());
    this.#els.togglePassword?.addEventListener('click',e=>{ e.preventDefault(); this.#toggleVis(this.#els.authPassword, e.currentTarget); });
    this.#els.avatarInput?.addEventListener('change',e=>e.target.files[0]&&this.#openCrop(e.target.files[0]));
    this.#els.changeAvatarInput?.addEventListener('change',e=>e.target.files[0]&&this.#openCrop(e.target.files[0]));
    this.#els.cancelCrop?.addEventListener('click',e=>{e.preventDefault(); this.#closeCrop();});
    this.#els.saveCrop?.addEventListener('click',e=>{e.preventDefault(); this.#saveCrop();});
    this.#els.otpVerifyBtn?.addEventListener('click',()=>this.#verifyOtp());
    this.#els.otpResendBtn?.addEventListener('click',()=>this.#resendOtp());
    this.#els.logoutCancelBtn?.addEventListener('click',()=>this.#hide(this.#els.logoutModal));
    this.#els.logoutConfirmBtn?.addEventListener('click',()=>this.#confirmLogout());
    this.#els.resetCloseBtn?.addEventListener('click',()=>this.#closeReset());
    this.#els.resetPasswordForm?.addEventListener('submit',e=>this.#handleReset(e));
    this.#els.toggleNewPassword?.addEventListener('click',e=>{e.preventDefault(); this.#toggleVis(this.#els.newPassword,e.currentTarget);});
    this.#els.toggleConfirmPassword?.addEventListener('click',e=>{e.preventDefault(); this.#toggleVis(this.#els.confirmNewPassword,e.currentTarget);});
    document.addEventListener('keydown',e=>{
      if(e.key==='Escape'){ this.closeModal(); this.#closeOtp(); this.#closeReset(); this.#hide(this.#els.logoutModal); $('accountPanel')?.classList.remove('active'); }
    });
    this.#setupOtp();
  }

  // FIX 4: Eye toggle for emoji + font-awesome both
  #toggleVis(input, btn){
    if(!input ||!btn) return;
    const isPass=input.type==='password';
    input.type=isPass?'text':'password';
    const icon=btn.querySelector('i');
    if(icon){
      icon.classList.toggle('fa-eye',!isPass);
      icon.classList.toggle('fa-eye-slash',isPass);
    } else {
      btn.textContent=isPass?'🙈':'👁';
      btn.classList.toggle('active',isPass);
    }
  }

  // ---- AUTH LOGIC ----
  async #handleAuth(e){
    e.preventDefault();
    const username=this.#els.authUsername?.value.trim()||'', email=this.#els.authEmail?.value.trim()||'', password=this.#els.authPassword?.value.trim()||'';
    if(!email.toLowerCase().endsWith('@gmail.com')) return this.#showErr('Only Gmail allowed');
    if(this.#isSignup &&!/^[A-Za-z]+(?: [A-Za-z]+)?$/.test(username)) return this.#showErr('Username: letters only, one space allowed');
    this.#els.authSubmit.disabled=true; this.#els.authSubmit.textContent='Please wait...';
    try{
      if(this.#isSignup){
        const r=await fetch(`${CONFIG.API_URL}/api/auth/send-signup-code`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email,password,confirmPassword:password,username})});
        const d=await r.json(); if(!r.ok) throw new Error(d.error);
        this.#otp={...this.#otp,email,username,password}; this.closeModal(); this.#openOtp(email);
      } else {
        const r=await fetch(`${CONFIG.API_URL}/api/auth/login`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email,password})});
        const d=await r.json(); if(!r.ok) throw new Error(d.error);
        if(d.requiresOTP){ this.#otp.password=password; this.closeModal(); this.#openOtp(email); }
        else { this.#loginSuccess(d.user); }
      }
    }catch(err){
      if(err.message.includes('already have an account')){ this.#showErr('Account exists, login instead'); this.#isSignup=false; this.#updateModalUI(); }
      else this.#showErr(err.message);
    }finally{ this.#els.authSubmit.disabled=false; this.#els.authSubmit.textContent='Continue'; }
  }

  #loginSuccess(user){
    this.#user=user; localStorage.setItem('dopetone_user',JSON.stringify(user)); localStorage.setItem('dopetone_user_id',user.id);
    this.#syncUI(); this.#toast(`Welcome ${user.username}`); this.closeModal(); this.loadFromCloud();
    window.dispatchEvent(new Event('auth:changed'));
  }

  // ---- OTP V2 ----
  #setupOtp(){
    const inputs=document.querySelectorAll('.otp-digit');
    inputs.forEach((inp,idx)=>{
      inp.addEventListener('input',e=>{
        if(!/^[0-9]$/.test(e.target.value)){ e.target.value=''; return; }
        e.target.classList.add('filled'); if(e.target.value && idx<5) inputs[idx+1].focus();
        this.#checkOtp();
      });
      inp.addEventListener('keydown',e=>{ if(e.key==='Backspace'&&!e.target.value&&idx>0){ inputs[idx-1].focus(); inputs[idx-1].value=''; inputs[idx-1].classList.remove('filled'); this.#checkOtp(); }});
      inp.addEventListener('paste',e=>{
        e.preventDefault(); const past=e.clipboardData.getData('text').slice(0,6); if(!/^\d+$/.test(past)) return;
        past.split('').forEach((d,i)=>{ if(inputs[i]){ inputs[i].value=d; inputs[i].classList.add('filled'); }}); this.#checkOtp(); inputs[Math.min(past.length-1,5)].focus();
      });
    });
  }
  #checkOtp(){ const c=[...document.querySelectorAll('.otp-digit')].map(i=>i.value).join(''); if(this.#els.otpVerifyBtn) this.#els.otpVerifyBtn.disabled=c.length!==6; return c.length===6?c:null; }
  #openOtp(email){ this.#otp.email=email; if(this.#els.otpEmail) this.#els.otpEmail.textContent=email; if(this.#els.otpError) this.#els.otpError.style.display='none'; document.querySelectorAll('.otp-digit').forEach(i=>{i.value=''; i.classList.remove('filled','error');}); this.#show(this.#els.otpModal); setTimeout(()=>document.querySelector('.otp-digit')?.focus(),100); this.#startOtpTimer(); }
  #closeOtp(){ this.#hide(this.#els.otpModal); clearInterval(this.#otp.timer); this.#isResetFlow=false; }
  #startOtpTimer(){
    this.#otp.seconds=CONFIG.OTP_TIMEOUT; if(this.#els.otpResendBtn) this.#els.otpResendBtn.disabled=true; clearInterval(this.#otp.timer);
    this.#otp.timer=setInterval(()=>{
      this.#otp.seconds--; const m=Math.floor(this.#otp.seconds/60), s=this.#otp.seconds%60;
      if(this.#els.otpCountdown) this.#els.otpCountdown.textContent=`${m}:${String(s).padStart(2,'0')}`;
      if(this.#otp.seconds<=0){ clearInterval(this.#otp.timer); if(this.#els.otpResendBtn) this.#els.otpResendBtn.disabled=false; if(this.#els.otpCountdown) this.#els.otpCountdown.textContent='Expired'; }
    },1000);
  }
  async #verifyOtp(){
    const code=this.#checkOtp(); if(!code) return;
    if(this.#els.otpVerifyBtn){ this.#els.otpVerifyBtn.disabled=true; this.#els.otpVerifyBtn.textContent='Verifying...'; }
    if(this.#els.otpError) this.#els.otpError.style.display='none';
    try{
      if(this.#isResetFlow){
        const r=await fetch(`${CONFIG.API_URL}/api/auth/verify-reset-otp`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email:this.#otp.email,code})});
        const d=await r.json(); if(!r.ok) throw new Error(d.error);
        this.#closeOtp(); this.#openReset(this.#otp.email); return;
      }
      const endpoint=this.#isSignup?'/api/auth/verify-signup':'/api/auth/verify-login-otp';
      const body=this.#isSignup?{email:this.#otp.email,code,username:this.#otp.username,password:this.#otp.password,avatar:this.#avatarData}:{email:this.#otp.email,code};
      const r=await fetch(`${CONFIG.API_URL}${endpoint}`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)});
      const d=await r.json(); if(!r.ok) throw new Error(d.error);
      this.#user=d.user; localStorage.setItem('dopetone_user',JSON.stringify(d.user)); localStorage.setItem('dopetone_user_id',d.user.id);
      this.#syncUI(); this.#toast(`Welcome ${d.user.username}`); this.#closeOtp(); this.closeModal();
    }catch(err){
      if(this.#els.otpError){ this.#els.otpError.textContent=err.message; this.#els.otpError.style.display='block'; }
      document.querySelectorAll('.otp-digit').forEach(i=>{i.classList.add('error'); i.value=''; i.classList.remove('filled');});
      setTimeout(()=>{document.querySelectorAll('.otp-digit').forEach(i=>i.classList.remove('error')); document.querySelector('.otp-digit')?.focus();},400);
    }finally{ if(this.#els.otpVerifyBtn){ this.#els.otpVerifyBtn.disabled=false; this.#els.otpVerifyBtn.textContent='Verify Code'; } }

    window.dispatchEvent(new Event('auth:changed'));

  }
  async #resendOtp(){
    if(this.#els.otpResendBtn){ this.#els.otpResendBtn.disabled=true; this.#els.otpResendBtn.textContent='Sending...'; }
    try{
      let ep,body;
      if(this.#isResetFlow){ ep='/api/auth/forgot-password'; body={email:this.#otp.email}; }
      else{ ep=this.#isSignup?'/api/auth/send-signup-code':'/api/auth/login'; body=this.#isSignup?{email:this.#otp.email,password:this.#otp.password,confirmPassword:this.#otp.password,username:this.#otp.username}:{email:this.#otp.email,password:this.#otp.password}; }
      const r=await fetch(`${CONFIG.API_URL}${ep}`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)});
      const d=await r.json(); if(!r.ok) throw new Error(d.error||'Failed');
      this.#toast('Code resent'); this.#startOtpTimer();
      document.querySelectorAll('.otp-digit').forEach(i=>{i.value=''; i.classList.remove('filled');}); document.querySelector('.otp-digit')?.focus();
    }catch(err){ if(this.#els.otpError){ this.#els.otpError.textContent=err.message||'Failed to resend'; this.#els.otpError.style.display='block'; } }
    finally{ if(this.#els.otpResendBtn) this.#els.otpResendBtn.textContent='Resend code'; }
  }

  // ---- RESET ----
  #openReset(email){ if(this.#els.resetEmail) this.#els.resetEmail.textContent=email; if(this.#els.resetError) this.#els.resetError.style.display='none'; if(this.#els.newPassword) this.#els.newPassword.value=''; if(this.#els.confirmNewPassword) this.#els.confirmNewPassword.value=''; this.#show(this.#els.resetPasswordModal); setTimeout(()=>this.#els.newPassword?.focus(),100); }
  #closeReset(){ this.#hide(this.#els.resetPasswordModal); this.#isResetFlow=false; }
  async #handleReset(e){
    e.preventDefault();
    const np=this.#els.newPassword?.value.trim(), cp=this.#els.confirmNewPassword?.value.trim();
    if(np.length<6) return this.#showResetErr('At least 6 chars');
    if(np!==cp) return this.#showResetErr('Passwords mismatch');
    if(this.#els.resetSubmitBtn){ this.#els.resetSubmitBtn.disabled=true; this.#els.resetSubmitBtn.textContent='Resetting...'; }
    try{
      const r=await fetch(`${CONFIG.API_URL}/api/auth/reset-password`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email:this.#otp.email,password:np})});
      const d=await r.json(); if(!r.ok) throw new Error(d.error);
      this.#user=d.user; localStorage.setItem('dopetone_user',JSON.stringify(d.user)); localStorage.setItem('dopetone_user_id',d.user.id);
      this.#syncUI(); this.#toast('Password reset!'); this.#closeReset(); this.#isResetFlow=false;
    }catch(err){ this.#showResetErr(err.message); }
    finally{ if(this.#els.resetSubmitBtn){ this.#els.resetSubmitBtn.disabled=false; this.#els.resetSubmitBtn.textContent='Reset Password'; } }
    window.dispatchEvent(new Event('auth:changed'));

  }
  #showResetErr(m){ if(this.#els.resetError){ this.#els.resetError.textContent=m; this.#els.resetError.style.display='block'; } }

  // ---- FORGOT ----
  async #handleForgot(){
    const email=this.#els.authEmail?.value.trim();
    if(!email) { this.#showErr('Enter email first'); return; }
    if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||!email.toLowerCase().endsWith('@gmail.com')) return this.#showErr('Valid Gmail required');
    try{
      const r=await fetch(`${CONFIG.API_URL}/api/auth/forgot-password`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email})});
      const d=await r.json(); if(!r.ok) throw new Error(d.error);
      this.#isResetFlow=true; this.#otp.email=email; this.closeModal(); this.#openOtp(email); this.#toast('Reset code sent');
    }catch(err){ this.#showErr(err.message); }
  }

   // ---- AVATAR CROPPER - INSTANT UPDATE PRO ----
  #openCrop(file){
    if(!file) return;
    if(!file.type.startsWith('image/')){
      this.#toast('Only images allowed'); return;
    }
    if(file.size > 5*1024*1024){
      this.#toast('Max 5MB'); return;
    }
    const fr = new FileReader();
    fr.onload = () => {
      if(!this.#els.cropImage ||!this.#els.cropModal) return;
      this.#els.cropImage.src = fr.result;
      this.#show(this.#els.cropModal);

      // Destroy old cropper
      if(this.#cropper){ try{ this.#cropper.destroy(); }catch{} this.#cropper=null; }

      this.#els.cropImage.onload = () => {
        // Wait for Cropper lib
        const initCrop = () => {
          if(!window.Cropper){
            setTimeout(initCrop, 100);
            return;
          }
          if(this.#cropper){ try{ this.#cropper.destroy(); }catch{} }
          this.#cropper = new Cropper(this.#els.cropImage, {
            aspectRatio: 1,
            viewMode: 1,
            dragMode: 'move',
            autoCropArea: 0.9,
            background: false,
            guides: false,
            center: true,
            highlight: false,
            cropBoxMovable: true,
            cropBoxResizable: true,
            responsive: true,
            restore: false
          });
        };
        initCrop();
      };
    };
    fr.readAsDataURL(file);

    // Clear inputs so same file can be picked again
    if(this.#els.avatarInput) this.#els.avatarInput.value = '';
    if(this.#els.changeAvatarInput) this.#els.changeAvatarInput.value = '';
  }

  #closeCrop(){
    this.#hide(this.#els.cropModal);
    if(this.#cropper){ try{ this.#cropper.destroy(); }catch{} this.#cropper=null; }
    if(this.#els.cropImage) this.#els.cropImage.src = '';
  }

  async #saveCrop(){
    if(!this.#cropper){
      this.#toast('No image to crop'); return;
    }

    const btn = this.#els.saveCrop;
    const origText = btn? btn.textContent : '';
    if(btn){ btn.disabled = true; btn.textContent = 'Uploading...'; }

    try{
      const canvas = this.#cropper.getCroppedCanvas({
        width: 512,
        height: 512,
        imageSmoothingEnabled: true,
        imageSmoothingQuality: 'high'
      });

      if(!canvas){
        throw new Error('Crop failed');
      }

      // Instant preview
      const previewDataUrl = canvas.toDataURL('image/jpeg', 0.85);
      this.#avatarData = previewDataUrl;

      // Update all avatar previews instantly
      if(this.#els.avatarPreview){
        this.#els.avatarPreview.innerHTML = `<img src="${previewDataUrl}" style="width:100%;height:100%;border-radius:50%;object-fit:cover;">`;
      }
      // Update topbar + panel instantly if logged in
      if(this.#user){
        document.querySelectorAll('#userAvatar, #panelAvatar, [data-user-avatar]').forEach(img=>{
          img.src = previewDataUrl;
        });
      }

      // Upload to R2
      const blob = await new Promise(res => canvas.toBlob(res, 'image/jpeg', 0.85));
      const fd = new FormData();
      fd.append('file', blob, `avatar-${Date.now()}.jpg`);
      fd.append('folder', 'avatars');

      let uploadedUrl = null;
      try{
        const r = await fetch(`${CONFIG.API_URL}/api/upload`, { method: 'POST', body: fd });
        const d = await r.json();
        if(d.success && d.url) uploadedUrl = d.url;
      }catch(e){ console.warn('Upload failed, using dataURL', e); }

      const finalAvatar = uploadedUrl || previewDataUrl;
      this.#avatarData = finalAvatar;

      // If user logged in - update DB instantly
      if(this.#user){
        this.#user.avatar = finalAvatar;
        localStorage.setItem('dopetone_user', JSON.stringify(this.#user));

        // Update DB in background
        fetch(`${CONFIG.API_URL}/api/auth/update-avatar`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: this.#user.email, avatar: finalAvatar })
        }).catch(()=>{});

        this.syncToCloud();
        this.#syncUI();
        window.dispatchEvent(new Event('auth:changed'));

        this.#toast('Avatar updated instantly!');
      } else {
        this.#toast('Avatar ready - will save on signup');
      }

      this.#closeCrop();

    }catch(err){
      console.error('Save crop error', err);
      this.#toast('Failed: ' + err.message);
    }finally{
      if(btn){ btn.disabled = false; btn.textContent = origText || 'Save & Update Instantly'; }
    }
  }

  // ---- PANEL & UI ----
  togglePanel(){
    const p=$('accountPanel'); if(!p) return;
    p.classList.toggle('active');
    if(p.classList.contains('active')&&this.#user){
      const av=this.#user.avatar||CONFIG.DEFAULT_AVATAR, name=this.#user.username||this.#user.email.split('@')[0];
      if($('panelAvatar')) $('panelAvatar').src=av;
      if($('panelName')) $('panelName').textContent=name;
      if($('panelEmail')) $('panelEmail').textContent=this.#user.email;
    }
  }
  logout(){ this.#show(this.#els.logoutModal); }
  async #confirmLogout(){
    this.#hide(this.#els.logoutModal); await this.syncToCloud();
    localStorage.removeItem('dopetone_user'); localStorage.removeItem('dopetone_user_id');
    this.#user=null; this.#avatarData=CONFIG.DEFAULT_AVATAR;
    $('accountPanel')?.classList.remove('active'); this.#syncUI(); this.#toast('Logged out');
    window.dispatchEvent(new CustomEvent('auth:logout')); sessionStorage.setItem('just_logged_out','1');
    setTimeout(()=>location.href=location.pathname,600);
  }
  #clearAll(){ localStorage.removeItem('dopetone_user'); localStorage.removeItem('dopetone_user_id'); sessionStorage.clear(); }

  #syncUI(){
    const raw=localStorage.getItem('dopetone_user'); this.#user=raw?JSON.parse(raw):null;
    const logged=!!this.#user, isAdmin=this.#user?.email===CONFIG.ADMIN_EMAIL;
    document.body.classList.toggle('logged-in',logged); document.body.classList.toggle('is-admin',isAdmin&&logged);
    const av=this.#user?.avatar||CONFIG.DEFAULT_AVATAR, name=this.#user?.username||this.#user?.email?.split('@')[0]||'Guest';
    const map={ authGuest:!logged?'flex':'none', authUser: logged?'flex':'none', controlCenterBtn: isAdmin?'flex':'none' };
    Object.entries(map).forEach(([id,v])=>{ const el=$(id); if(el) el.style.display=v; });
    ['userAvatar','panelAvatar','mobileProfileAvatar'].forEach(id=>{ const el=$(id); if(el){ el.src=logged?av:CONFIG.DEFAULT_AVATAR; el.onerror=()=>el.src=CONFIG.DEFAULT_AVATAR; }});
    if($('panelName')) $('panelName').textContent=name;
    if($('panelEmail')) $('panelEmail').textContent=this.#user?.email||'';
    if($('mobileProfileName')) $('mobileProfileName').textContent=logged?name:'Guest';
    if($('mobileProfileSub')) $('mobileProfileSub').textContent=logged?this.#user.email:'Tap to sign in';
    this.updateCartCount();
  }

  updateCartCount(){
    const cart=JSON.parse(this.getUserStorage('dopetone_cart'));
    document.querySelectorAll('.cart-count').forEach(c=>{ c.textContent=cart.length; c.style.display=cart.length>0?'flex':'none'; });
  }
  #showErr(m){ if(!this.#els.authError) return alert(m); this.#els.authError.textContent=m; this.#els.authError.style.display='block'; }
  #clearError(){ if(this.#els.authError) this.#els.authError.style.display='none'; }
  #toast(t){ const el=this.#els.authToast; if(!el) return; if(this.#els.authToastText) this.#els.authToastText.textContent=t; el.classList.add('active'); setTimeout(()=>el.classList.remove('active'),2200); }
}

// BOOT V2 - FIXED ORDER
if(!window.Auth){
  window.Auth = new AuthManagerV2();
}
window.initAuth = () => window.Auth?.init();
window.refreshCartUI = () => { window.Auth?.updateCartCount(); window.dispatchEvent(new Event('cartUpdated')); };
window.getCurrentUserId = () => window.Auth?._user?.id || localStorage.getItem('dopetone_user_id') || 'anonymous';

export { AuthManagerV2 };
