import './landing.css';
import { brandMark } from './brand.js';
import { t, getStoredLang, localeFor } from './i18n.js';
import { controlsHtml, bindControls } from './controls.js';

const JSON_URL = import.meta.env.VITE_JSON_URL || null;
const TRACKRECORD_URL = import.meta.env.VITE_TRACKRECORD_URL || null;

let currentLang = getStoredLang();
let lastData    = null;

// ── live widget data (best-effort, falls back to static copy) ────────────────
async function fetchJson(url) {
  if (!url) return null;
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

async function fetchCompetitionSummary() {
  const data = await fetchJson(JSON_URL);
  const track = data?.founder_trackrecord || await fetchJson(TRACKRECORD_URL);
  return data || track ? { ...(data || {}), founder_trackrecord: track || data?.founder_trackrecord } : null;
}

function formatCountdown(targetMs, lang) {
  const diff = targetMs - Date.now();
  if (diff <= 0) return t(lang, 'lw_finished');
  const d = Math.floor(diff / 86400000);
  const h = Math.floor((diff % 86400000) / 3600000);
  return `${d}d ${h}h`;
}

const fmtMetric = (value, lang, suffix = '') => {
  if (value == null || !isFinite(Number(value))) return '—';
  const n = Number(value);
  const sign = n > 0 ? '+' : '';
  return `${sign}${n.toLocaleString(localeFor(lang), { minimumFractionDigits: 2, maximumFractionDigits: 2 })}${suffix}`;
};

function trackPointValue(point) {
  if (typeof point === 'number') return point;
  if (point && typeof point === 'object') return Number(point.value ?? point.equity ?? point.balance ?? point.return_pct);
  return NaN;
}

function trackDateLabel(point, lang) {
  const raw = point && typeof point === 'object' ? (point.date || point.time || point.timestamp) : null;
  if (!raw) return '';
  return new Date(raw).toLocaleDateString(localeFor(lang), { day: '2-digit', month: 'short', year: 'numeric' });
}

function trackRecordChart(points, lang) {
  const values = (Array.isArray(points) ? points : [])
    .map(trackPointValue)
    .filter(v => isFinite(v));

  if (values.length < 2) {
    return `<div class="track-chart-empty">${t(lang, 'track_chart_pending')}</div>`;
  }

  const width = 640;
  const height = 240;
  const padX = 18;
  const padY = 20;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const coords = values.map((v, i) => {
    const x = padX + (i / (values.length - 1)) * (width - padX * 2);
    const y = height - padY - ((v - min) / range) * (height - padY * 2);
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(' ');
  const area = `${padX},${height - padY} ${coords} ${width - padX},${height - padY}`;
  const last = values.at(-1);
  const firstLabel = trackDateLabel(points[0], lang);
  const lastLabel = trackDateLabel(points.at(-1), lang);

  return `
    <div class="track-chart">
      <svg viewBox="0 0 ${width} ${height}" role="img" aria-label="${t(lang, 'track_chart_aria')}">
        <polygon points="${area}" class="track-area"></polygon>
        <polyline points="${coords}" class="track-line"></polyline>
      </svg>
      <div class="track-chart-meta">
        <span>${firstLabel}</span>
        <strong>${fmtMetric(last, lang)}</strong>
        <span>${lastLabel}</span>
      </div>
    </div>`;
}

function trackRecordHtml(track, lang) {
  const url = track?.url || 'https://www.darwinex.com/invest/PDCL';
  const ticker = track?.ticker || 'PDCL';
  const provider = track?.provider || 'Darwinex Zero';
  const updated = track?.updated_at
    ? new Date(track.updated_at).toLocaleString(localeFor(lang), { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })
    : t(lang, 'track_updated_pending');

  return `
    <div class="track-card">
      <div class="track-head">
        <div>
          <div class="track-kicker">${provider}</div>
          <h3>${ticker}</h3>
          <p>${t(lang, 'track_subtitle')}</p>
        </div>
        <a href="${url}" target="_blank" rel="noopener" class="track-link">${t(lang, 'track_link')}</a>
      </div>
      ${track?.image_url ? `
        <div class="track-image">
          <img src="${track.image_url}" alt="${t(lang, 'track_chart_aria')}" loading="lazy" />
        </div>` : trackRecordChart(track?.equity_curve, lang)}
      <div class="track-metrics">
        <div>
          <span>${t(lang, 'track_return')}</span>
          <strong>${fmtMetric(track?.return_pct, lang, '%')}</strong>
        </div>
        <div>
          <span>${t(lang, 'track_drawdown')}</span>
          <strong>${fmtMetric(track?.drawdown_pct, lang, '%')}</strong>
        </div>
        <div>
          <span>${t(lang, 'track_years')}</span>
          <strong>${track?.track_record_years != null ? Number(track.track_record_years).toLocaleString(localeFor(lang), { maximumFractionDigits: 1 }) : '—'}</strong>
        </div>
        <div>
          <span>${t(lang, 'track_updated')}</span>
          <strong>${updated}</strong>
        </div>
      </div>
    </div>`;
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
      ${trackRecordHtml(data?.founder_trackrecord, lang)}
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
