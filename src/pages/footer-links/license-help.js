// src/pages/footer-links/license-help.js - V9.5 - IMPORTS YOUR REAL LICENCE.JS
// This file just wraps your existing src/features/licence/licence.js so #/license works

// Re-import your already updated master file
import * as LicenceMaster from '../../features/licence/licence.js';

export function renderLicense() {
  // Try every possible export name your licence.js might have
  if (LicenceMaster.renderLicence) return LicenceMaster.renderLicence();
  if (LicenceMaster.renderLicense) return LicenceMaster.renderLicense();
  if (LicenceMaster.render) return LicenceMaster.render();
  if (LicenceMaster.default && typeof LicenceMaster.default === 'string') return LicenceMaster.default;
  if (LicenceMaster.default && LicenceMaster.default.render) return LicenceMaster.default.render();
  
  // Fallback - if your licence.js only has data, show wrapper with your data
  return `
<div class="wrap">
  <div class="topbar">
    <a href="#/home" data-link class="logo-link"><img src="/images/logo.png" alt="logo"><span>DOPE TONE</span></a>
    <a href="#/help" data-link class="back-btn">← Back to Help</a>
  </div>
  <div id="licence-mount"></div>
</div>
  `;
}

export async function initLicense() {
  // Init your master licence logic
  try {
    if (LicenceMaster.initLicence) await LicenceMaster.initLicence();
    if (LicenceMaster.initLicense) await LicenceMaster.initLicense();
    if (LicenceMaster.init) await LicenceMaster.init();
    if (LicenceMaster.default && LicenceMaster.default.init) await LicenceMaster.default.init();

    // If your licence.js mounts itself into #app-view, it will already work
    // If it expects #licence-mount, move it
    const mount = document.getElementById('licence-mount');
    if (mount && mount.innerHTML.trim() === '') {
      // try to re-render inside mount
      const html = LicenceMaster.render?.() || LicenceMaster.renderLicence?.() || '';
      if (html) mount.innerHTML = html;
    }
  } catch (e) {
    console.error('[license-help] import error', e);
  }
}

// Router compatibility - V9.5 expects these names
export const render = renderLicense;
export const init = initLicense;
export const renderLicenseHelp = renderLicense;
export const initLicenseHelp = initLicense;
export const renderLicenceHelp = renderLicense;
export const initLicenceHelp = initLicense;

export default {
  renderLicense,
  initLicense,
  render,
  init
};

