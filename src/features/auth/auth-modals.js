export function injectAuthModals(){
  if(document.getElementById('authModal')) return;

  const html = `
  <!-- USER PANEL - PRO GLASS -->
  <div id="userPanel" class="account-panel dt-user-panel" aria-hidden="true">
    <div class="up-head">
      <div class="up-avatar-wrap" id="upAvatarWrap">
        <img id="panelAvatar" src="/public/images/default-user.png" alt="">
        <span class="up-edit-pen">
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>
        </span>
      </div>
      <div class="up-meta">
        <strong id="panelName">Guest</strong>
        <span id="panelEmail">Not logged in</span>
        <span class="up-badge">VAULT MEMBER</span>
      </div>
    </div>

    <div class="account-actions">
      <button id="controlCenterBtn" style="display:none" data-action="control">
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <path d="M4 6h16"/>
    <path d="M4 12h16"/>
    <path d="M4 18h16"/>
    <circle cx="9" cy="6" r="2"/>
    <circle cx="15" cy="12" r="2"/>
    <circle cx="10" cy="18" r="2"/>
  </svg>
  Control Center
</button>


      <button data-action="playlists">
        <svg viewBox="0 0 24 24"><path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/></svg>
        My Playlists
      </button>

      <button data-action="liked">
        <svg viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
        Favourite
      </button>

      <button data-action="purchased">
        <svg viewBox="0 0 24 24"><path d="M9 8h6M9 12h6M9 16h6"/><path d="M4 20V6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v14l-4-2-4 2-4-2-4 2z"/></svg>
        Purchased
      </button>

      <button data-action="lyrics">
        <svg viewBox="0 0 24 24"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>
        Lyrics
      </button>

      <button id="accountSettingsBtn" data-action="settings">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
  <circle cx="12" cy="12" r="3"></circle>
  <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1.08 1.55V21a2 2 0 0 1-4 0v-.09a1.65 1.65 0 0 0-1.08-1.55 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.6 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.6a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9c.2.6.77 1 1.4 1H21a2 2 0 0 1 0 4h-.2c-.63 0-1.2.4-1.4 1Z"></path>
</svg>

        Account Settings
      </button>

      <button id="logoutAction" class="logout">
        <svg viewBox="0 0 24 24"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
        Logout
      </button>
    </div>
  </div>

  <!-- AUTH MODAL -->
  <div id="authModal" class="auth-modal" aria-hidden="true">
    <div class="auth-overlay" data-close="auth"></div>
    <div class="auth-box" id="authBox" data-mode="login">
      <button id="authCloseBtn" class="auth-close">✕</button>
      <div class="auth-head">
        <h2 id="authTitle">Welcome Back</h2>
        <p id="authSubtitle">Login to your vault</p>
      </div>
      <form id="authForm" class="auth-form">
        <div class="auth-group" id="usernameGroup" style="display:none">
          <label>Username</label>
          <input id="authUsername" placeholder="letters only" autocomplete="username">
        </div>
        <div class="auth-group">
          <label>Gmail Address</label>
          <input id="authEmail" type="email" placeholder="you@gmail.com" required autocomplete="email">
        </div>
        <div class="auth-group">
          <label>Password</label>
          <div class="input-eye-wrap">
            <input id="authPassword" type="password" placeholder="••••••••" required autocomplete="current-password">
            <button type="button" id="togglePassword" class="eye-btn" tabindex="-1">👁</button>
          </div>
        </div>
        <div id="signupAvatarWrap" class="avatar-row" style="display:none">
          <div id="avatarPreview" class="avatar-preview"><img src="/public/images/default-user.png"></div>
          <label class="file-btn"><input id="avatarInput" type="file" accept="image/*" hidden><span>Choose Avatar</span></label>
        </div>
        <div id="authError" class="auth-error" style="display:none"></div>
        <button id="authSubmit" type="submit" class="btn-primary">Continue</button>
        <button type="button" id="forgotPasswordBtn" class="link-btn">Forgot password?</button>
      </form>
      <div class="auth-switch"><span id="switchAuthText">Don't have an account?</span> <button id="switchAuthBtn" type="button">Sign Up</button></div>
    </div>
  </div>

  <div id="otpModal" class="auth-modal" aria-hidden="true">
    <div class="auth-overlay" data-close="otp"></div>
    <div class="auth-box">
      <button id="otpCloseBtn" class="auth-close">✕</button>
      <h2>Check your email</h2><p>Code sent to <b id="otpEmail"></b></p>
      <div class="otp-grid"><input class="otp-digit" maxlength="1"><input class="otp-digit" maxlength="1"><input class="otp-digit" maxlength="1"><input class="otp-digit" maxlength="1"><input class="otp-digit" maxlength="1"><input class="otp-digit" maxlength="1"></div>
      <div id="otpError" class="auth-error" style="display:none"></div>
      <div class="otp-foot"><span id="otpCountdown">5:00</span><button id="otpResendBtn" class="link-btn">Resend code</button></div>
      <button id="otpVerifyBtn" class="btn-primary" disabled>Verify Code</button>
    </div>
  </div>

  <div id="resetPasswordModal" class="auth-modal" aria-hidden="true">
    <div class="auth-overlay" data-close="reset"></div>
    <div class="auth-box">
      <button id="resetCloseBtn" class="auth-close">✕</button>
      <h2>Reset Password</h2><p id="resetEmail"></p>
      <form id="resetPasswordForm" class="auth-form">
        <div class="auth-group"><label>New Password</label><div class="input-eye-wrap"><input id="newPassword" type="password" required><button type="button" id="toggleNewPassword" class="eye-btn">👁</button></div></div>
        <div class="auth-group"><label>Confirm</label><div class="input-eye-wrap"><input id="confirmNewPassword" type="password" required><button type="button" id="toggleConfirmPassword" class="eye-btn">👁</button></div></div>
        <div id="resetError" class="auth-error" style="display:none"></div>
        <button id="resetSubmitBtn" type="submit" class="btn-primary">Reset Password</button>
      </form>
    </div>
  </div>

  <!-- ACCOUNT SETTINGS MODAL - LIKE SIGNIN -->
  <div id="settingsModal" class="auth-modal" aria-hidden="true">
    <div class="auth-overlay" data-close="settings"></div>
    <div class="auth-box" style="max-width:460px">
      <button id="closeSettings" class="auth-close">✕</button>
      <div class="auth-head"><h2>Account Settings</h2><p>Edit your profile & security</p></div>
      <div class="auth-form">
        <div class="settings-avatar-row">
          <div class="settings-avatar-wrap" id="settingsAvatarWrap">
            <img id="settingsAvatarPreview" src="/public/images/default-user.png">
            <span class="up-edit-pen" style="width:22px;height:22px"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/></svg></span>
          </div>
          <button id="changeAvatarBtn" type="button" class="file-btn" style="padding:8px 14px"><span>Change Photo</span></button>
        </div>
        <div class="auth-group"><label>Display Name</label><input id="settingsName" type="text" placeholder="Your name"></div>
        <div class="auth-group"><label>Email</label><input id="settingsEmail" type="email" disabled style="opacity:.6"></div>
        <hr style="border:none;border-top:1px solid rgba(255,255,255,.08);margin:14px 0">
        <div class="auth-group"><label>New Password</label><div class="input-eye-wrap"><input id="settingsPass" type="password" placeholder="Leave blank to keep"><button type="button" class="eye-btn" data-eye="settingsPass">👁</button></div></div>
        <div class="auth-group"><label>Confirm Password</label><input id="settingsPass2" type="password" placeholder="Confirm new password"></div>
        <div id="settingsError" class="auth-error" style="display:none"></div>
        <button id="saveSettingsBtn" class="btn-primary">Save Changes</button>
      </div>
    </div>
  </div>

  <div id="logoutModal" class="auth-modal small" aria-hidden="true"><div class="auth-overlay" data-close="logout"></div><div class="auth-box"><h3>Logout?</h3><p>Save your vault first.</p><div style="display:flex;gap:10px;margin-top:14px"><button id="logoutCancelBtn" class="btn-ghost">Cancel</button><button id="logoutConfirmBtn" class="btn-red">Logout</button></div></div></div>

  <div id="cropModal" class="auth-modal" aria-hidden="true">
    <div class="auth-overlay" data-close="crop"></div>
    <div class="auth-box" style="max-width:520px;padding:20px">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px">
        <h3 style="margin:0;color:#fff">Crop Avatar</h3>
        <button id="cancelCrop" class="auth-close" type="button" style="position:static">✕</button>
      </div>
      <div style="background:#050A14;border-radius:16px;overflow:hidden;border:1px solid rgba(255,255,255,.1);max-height:60vh">
        <img id="cropImage" style="max-width:100%;display:block;max-height:60vh">
      </div>
      <div style="display:flex;gap:10px;margin-top:16px">
        <button id="chooseDifferentBtn" class="btn-ghost" type="button">Choose Different</button>
        <button id="saveCrop" class="btn-primary" type="button" style="flex:1;margin:0">Save</button>
      </div>
      <input id="changeAvatarInput" type="file" accept="image/*" hidden>
    </div>
  </div>

  <div id="authToast"><span id="authToastText"></span></div>
  <input type="file" id="avatarFileInput" accept="image/*" hidden>
  `;

  const c=document.createElement('div'); 
  c.id='authModalsContainer'; 
  c.innerHTML=html; 
  document.body.appendChild(c);

  // close overlays
  document.querySelectorAll('.auth-overlay[data-close]').forEach(ov=>{
    ov.addEventListener('click',()=>{
      const t=ov.dataset.close;
      if(t==='auth') document.getElementById('authModal')?.classList.remove('active');
      if(t==='otp') document.getElementById('otpModal')?.classList.remove('active');
      if(t==='reset') document.getElementById('resetPasswordModal')?.classList.remove('active');
      if(t==='logout') document.getElementById('logoutModal')?.classList.remove('active');
      if(t==='crop') document.getElementById('cropModal')?.classList.remove('active');
      if(t==='settings') document.getElementById('settingsModal')?.classList.remove('active');
      if(!document.querySelector('.auth-modal.active')) document.body.style.overflow='';
    });
  });
}

