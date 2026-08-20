import e,{initLicence as l,initLicense as d,init as f,render as t,renderLicence as c,renderLicense as p}from"./licence-DE4FtziN.js";function i(){return c?c():p?p():t?t():e&&typeof e=="string"?e:e&&e.render?e.render():`
<div class="wrap">
  <div class="topbar">
    <a href="#/home" data-link class="logo-link"><img src="/images/logo.png" alt="logo"><span>DOPE TONE</span></a>
    <a href="#/help" data-link class="back-btn">← Back to Help</a>
  </div>
  <div id="licence-mount"></div>
</div>
  `}async function r(){var s,a;try{l&&await l(),d&&await d(),f&&await f(),e&&e.init&&await e.init();const n=document.getElementById("licence-mount");if(n&&n.innerHTML.trim()===""){const o=((s=t)==null?void 0:s())||((a=c)==null?void 0:a())||"";o&&(n.innerHTML=o)}}catch(n){console.error("[license-help] import error",n)}}const L=i,m=r,g=i,H=r,h=i,v=r,k={renderLicense:i,initLicense:r,render:L,init:m};export{k as default,m as init,v as initLicenceHelp,r as initLicense,H as initLicenseHelp,L as render,h as renderLicenceHelp,i as renderLicense,g as renderLicenseHelp};
