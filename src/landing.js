import './landing.css';
import { brandMark } from './brand.js';
import { t, getStoredLang, localeFor } from './i18n.js';
import { controlsHtml, bindControls } from './controls.js';

const JSON_URL = import.meta.env.VITE_JSON_URL || null;

let currentLang = getStoredLang();
let lastData    = null;

// ── live widget data (best-effort, falls back to static copy) ────────────────
async function fetchCompetitionSummary() {
  if (!JSON_URL) return null;
  try {
    const res = await fetch(JSON_URL);
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

function formatCountdown(targetMs, lang) {
  const diff = targetMs - Date.now();
  if (diff <= 0) return t(lang, 'lw_finished');
  const d = Math.floor(diff / 86400000);
  const h = Math.floor((diff % 86400000) / 3600000);
  return `${d}d ${h}h`;
}

function liveWidgetHtml(data, lang) {
  if (!data) {
    return `
      <div class="live-widget">
        <div class="lw-cell">
          <div class="lw-label">${t(lang, 'lw_static_label1')}</div>
          <div class="lw-value">${t(lang, 'lw_static_value1')}</div>
        </div>
        <div class="lw-cell">
          <div class="lw-label">${t(lang, 'lw_static_label2')}</div>
          <div class="lw-value">${t(lang, 'lw_static_value2')}</div>
        </div>
      </div>`;
  }
  const leader = data.summary?.leader || '—';
  const best   = data.summary?.best_score;
  const endMs  = data.competition?.end_date ? new Date(`${data.competition.end_date}T23:59:59Z`).getTime() : null;
  return `
    <div class="live-widget">
      <div class="lw-cell">
        <div class="lw-label">${t(lang, 'lw_leader_label')}</div>
        <div class="lw-value accent">🥇 ${leader}</div>
      </div>
      <div class="lw-cell">
        <div class="lw-label">${t(lang, 'lw_score_label')}</div>
        <div class="lw-value">${best != null ? best.toFixed(4) : '—'}</div>
      </div>
      <div class="lw-cell">
        <div class="lw-label">${t(lang, 'lw_ends_label')}</div>
        <div class="lw-value">${endMs ? formatCountdown(endMs, lang) : '—'}</div>
      </div>
    </div>`;
}

function compCardHtml(data, lang) {
  const c = data?.competition;
  const s = data?.summary;
  const dateFmt = (d) => d ? new Date(`${d}T12:00:00`).toLocaleDateString(localeFor(lang), { day: '2-digit', month: 'short', year: 'numeric' }) : '—';

  return `
    <div class="comp-card">
      <div class="eyebrow"><span class="dot"></span> ${t(lang, 'comp_live_badge')}</div>
      <h2>${c?.name || 'Competición SQX-Traders — Ronda 2'}</h2>
      <div class="comp-meta">
        ${c ? `${dateFmt(c.start_date)} → ${dateFmt(c.end_date)} · ${c.platform} · ${c.server} · ${t(lang, 'broker_label')}: ${c.broker}` : 'Darwinex-Demo'}
      </div>
      <div class="comp-stats">
        <div>
          <div class="comp-stat-value">${s?.total_participants ?? '—'}</div>
          <div class="comp-stat-label">${t(lang, 'comp_stat_participants')}</div>
        </div>
        <div>
          <div class="comp-stat-value">${s?.official_participants ?? '—'}</div>
          <div class="comp-stat-label">${t(lang, 'comp_stat_qualified')}</div>
        </div>
        <div>
          <div class="comp-stat-value">${s?.total_trades ?? '—'}</div>
          <div class="comp-stat-label">${t(lang, 'comp_stat_trades')}</div>
        </div>
      </div>
      <a href="/ranking.html" class="btn btn-primary">${t(lang, 'comp_cta')}</a>
    </div>`;
}

function renderLoading() {
  document.getElementById('app').innerHTML = `
    <div class="loading-screen">
      <div class="spinner"></div>
    </div>`;
}

function render(data, lang) {
  currentLang = lang;
  document.documentElement.lang = lang;

  document.getElementById('app').innerHTML = `

    <nav class="nav">
      <div class="nav-inner">
        ${brandMark()}
        <div class="nav-links">
          <a href="#comunidad">${t(lang, 'nav_comunidad')}</a>
          <a href="#miguel">${t(lang, 'nav_fundador')}</a>
          <a href="#competicion">${t(lang, 'nav_competicion')}</a>
          <a href="/ranking.html" class="nav-cta">${t(lang, 'nav_cta')}</a>
          ${controlsHtml(lang)}
        </div>
      </div>
    </nav>

    <header class="hero">
      <div class="eyebrow"><span class="dot"></span> ${t(lang, 'hero_eyebrow')}</div>
      <h1>${t(lang, 'hero_h1_pre')} <span class="accent">${t(lang, 'hero_h1_accent')}</span>${t(lang, 'hero_h1_post')}</h1>
      <p class="lead">${t(lang, 'hero_lead')}</p>
      <div class="hero-ctas">
        <a href="/ranking.html" class="btn btn-primary">${t(lang, 'hero_cta_primary')}</a>
        <a href="#comunidad" class="btn btn-ghost">${t(lang, 'hero_cta_secondary')}</a>
      </div>
      ${liveWidgetHtml(data, lang)}
    </header>

    <section class="section alt" id="miguel">
      <div class="section-tag">${t(lang, 'about_tag')}</div>
      <h2>Miguel Jiménez</h2>
      <div class="about-grid" style="margin-top: 40px;">
        <div class="about-photo">
          <img src="/miguel-jimenez.jpg" alt="Miguel Jiménez, fundador de SQX Traders" />
        </div>
        <div>
          <div class="about-name">Miguel Jiménez</div>
          <div class="about-role">${t(lang, 'about_role')}</div>
          <p class="about-bio">${t(lang, 'about_bio1')}</p>
          <p class="about-bio">${t(lang, 'about_bio2')}</p>
          <a href="https://estrategiasganadoras.com" target="_blank" rel="noopener" class="about-link">
            ${t(lang, 'about_link')}
          </a>
        </div>
      </div>
    </section>

    <section class="section" id="comunidad">
      <div class="section-tag">${t(lang, 'community_tag')}</div>
      <h2>${t(lang, 'community_h2')}</h2>
      <p class="desc">${t(lang, 'community_desc')}</p>
      <div class="feature-grid">
        <div class="feature-card">
          <div class="feature-icon">👥</div>
          <h3>${t(lang, 'feat1_title')}</h3>
          <p>${t(lang, 'feat1_desc')}</p>
        </div>
        <div class="feature-card">
          <div class="feature-icon">🏆</div>
          <h3>${t(lang, 'feat2_title')}</h3>
          <p>${t(lang, 'feat2_desc')}</p>
        </div>
        <div class="feature-card">
          <div class="feature-icon">📊</div>
          <h3>${t(lang, 'feat3_title')}</h3>
          <p>${t(lang, 'feat3_desc')}</p>
        </div>
      </div>
    </section>

    <section class="section alt" id="competicion">
      <div class="section-tag">${t(lang, 'competition_tag')}</div>
      <h2>${t(lang, 'competition_h2')}</h2>
      <p class="desc">${t(lang, 'competition_desc')}</p>
      ${compCardHtml(data, lang)}
    </section>

    <footer class="footer">
      ${brandMark()}
      <p>${t(lang, 'footer_tagline')}</p>
      <div class="footer-links">
        <a href="/ranking.html">${t(lang, 'footer_link_ranking')}</a>
        <a href="https://estrategiasganadoras.com" target="_blank" rel="noopener">estrategiasganadoras.com</a>
      </div>
    </footer>`;

  bindControls((newLang) => render(lastData, newLang));
}

renderLoading();

fetchCompetitionSummary().then(data => {
  lastData = data;
  render(data, currentLang);
});
