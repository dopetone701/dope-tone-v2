// src/features/controlCenter/beats/audience/audience-page.js
// UI ONLY - injects into V2, keeps your logic 100%
import { initEmails } from './cc-emails.js';
import './vault-emails.js'; // auto injects Email button - logic untouched

export async function renderAudiencePage(container) {
  container.innerHTML = `
  <div id="audienceRoot" class="audience-v2">
    <style>
      .audience-v2 { padding: 20px; color: #e8e8e8; }
      .audience-v2 .page-head { display:flex; justify-content:space-between; align-items:center; margin-bottom:18px }
      .audience-v2 .page-head h1 { font-size:22px; font-weight:900; letter-spacing:1px; margin:0; color:#fff }
      .audience-v2 .filter-bar { display:flex; gap:8px; flex-wrap:wrap; align-items:center; background:#0f0f0f; border:1px solid #1e1e1e; border-radius:99px; padding:8px 12px; margin-bottom:16px; width:fit-content }
      .audience-v2 .filter-pill { background:#1a1a1a; border:1px solid #2a2a2a; color:#888; padding:6px 12px; border-radius:99px; font-size:11px; font-weight:700; cursor:pointer }
      .audience-v2 .filter-pill.active { background:#fff; color:#000; border-color:#fff }
      .audience-v2 .filter-pill span { opacity:.6; margin-left:4px }
      .audience-v2 .table-card { background:#0f0f0f; border:1px solid #1e1e1e; border-radius:16px; overflow:hidden }
      .audience-v2 .dt-table { width:100%; border-collapse:collapse }
      .audience-v2 .dt-table th { text-align:left; font-size:10px; letter-spacing:1px; color:#555; padding:14px 16px; border-bottom:1px solid #1e1e1e }
      .audience-v2 .dt-table td { padding:12px 16px; border-bottom:1px solid #121212; font-size:13px }
      .audience-v2 .empty-state { text-align:center; padding:40px; color:#555 }
      .audience-v2 .head-actions { display:flex; gap:8px }
      .audience-v2 .btn-ghost { background:#1a1a1a; border:1px solid #2a2a2a; color:#aaa; padding:7px 12px; border-radius:99px; font-size:11px; cursor:pointer }
    </style>

    <div class="page-head">
      <h1>AUDIENCE <span id="emailCount">(0)</span></h1>
      <div class="head-actions">
        <button id="copyAudienceBtn" class="btn-ghost"><i class="fa-solid fa-copy"></i> Copy</button>
        <button id="exportBtn" class="btn-ghost"><i class="fa-solid fa-download"></i> CSV</button>
      </div>
    </div>

    <div id="proFilterBar" class="filter-bar">
      <button class="filter-pill active" data-filter="all">ALL <span id="c_all">0</span></button>
      <button class="filter-pill" data-filter="account">ACCOUNT <span id="c_acc">0</span></button>
      <button class="filter-pill" data-filter="newsletter">NEWS <span id="c_news">0</span></button>
      <button class="filter-pill" data-filter="subscription">SUB <span id="c_sub">0</span></button>
      <button class="filter-pill" data-filter="never_subscribed">COLD <span id="c_never">0</span></button>
      <button class="filter-pill" data-filter="vip">VIP <span id="c_vip">0</span></button>
      <button class="filter-pill" data-filter="warm">WARM <span id="c_warm">0</span></button>
    </div>

    <div class="table-card">
      <table class="dt-table">
        <thead><tr><th>Email</th><th>Tags</th><th>Date</th><th></th></tr></thead>
        <tbody id="emailTableBody"><tr><td colspan="4" class="empty-state">Loading vault...</td></tr></tbody>
      </table>
    </div>
  `;

  // Your logic - 100% untouched
  await initEmails();
}

