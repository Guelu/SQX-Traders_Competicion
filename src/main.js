import './style.css';
import mockData from './mock-data.json';
import { brandMark } from './brand.js';
import { t, getStoredLang, localeFor } from './i18n.js';
import { controlsHtml, bindControls } from './controls.js';

const JSON_URL = import.meta.env.VITE_JSON_URL || null;

let currentLang = getStoredLang();
let lastData    = null;

async function loadData() {
  if (JSON_URL) {
    const res = await fetch(JSON_URL);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
  }
  return mockData;
}

// ── formatters ────────────────────────────────────────────────────────────────
const es2  = (v, lang) => Math.abs(v).toLocaleString(localeFor(lang), { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const fmtProfit  = (v, lang) => v >= 0 ? `+$${es2(v, lang)}` : `-$${es2(v, lang)}`;
const fmtScore   = (v, lang) => isFinite(v) ? v.toLocaleString(localeFor(lang), { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '—';
const fmtPF      = (v, lang) => (v == null || !isFinite(v)) ? '—' : v.toLocaleString(localeFor(lang), { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const fmtWin     = (v) => `${v.toFixed(1)}%`;

function dateFmt(d, lang) {
  return new Date(d + 'T12:00:00').toLocaleDateString(localeFor(lang), { day:'2-digit', month:'short', year:'numeric' });
}

// ── countdowns ────────────────────────────────────────────────────────────────
function formatCountdown(targetMs) {
  const diff = targetMs - Date.now();
  if (diff <= 0) return null;
  const s   = Math.floor(diff / 1000);
  const d   = Math.floor(s / 86400);
  const h   = Math.floor((s % 86400) / 3600);
  const m   = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  if (d > 0) return `${d}d ${h}h ${m}m`;
  if (h > 0) return `${h}h ${m}m ${sec}s`;
  return `${m}m ${sec}s`;
}

let _countdownTimer = null;

function startCountdowns(nextUpdateIso, endDate, lang) {
  if (_countdownTimer) clearInterval(_countdownTimer);

  const nextUpdateMs = new Date(nextUpdateIso).getTime();
  const endMs = endDate ? new Date(`${endDate}T23:59:59Z`).getTime() : null;

  function tick() {
    const nextEl = document.getElementById('cd-next');
    const endEl  = document.getElementById('cd-end');
    if (nextEl) nextEl.textContent = formatCountdown(nextUpdateMs) || t(lang, 'countdown_updating');
    if (endEl)  endEl.textContent  = endMs ? (formatCountdown(endMs) || t(lang, 'countdown_finished')) : t(lang, 'countdown_no_end');
  }
  tick();
  _countdownTimer = setInterval(tick, 1000);
}

// ── auto-refresh (a la hora en punto + 30s) ─────────────────────────────────
function msUntilNextRefresh() {
  const now  = new Date();
  const next = new Date(now);
  next.setMinutes(0, 30, 0);
  if (next <= now) next.setHours(next.getHours() + 1);
  return next - now;
}

function scheduleNextRefresh() {
  setTimeout(async () => {
    try {
      const data = await loadData();
      lastData = data;
      render(data, currentLang);
    } catch (err) {
      console.error('[refresh] failed:', err);
    }
    scheduleNextRefresh();
  }, msUntilNextRefresh());
}

// ── sparkline ─────────────────────────────────────────────────────────────────
function buildSparkSVG(curve, profit, w, h) {
  if (!curve || curve.length < 2) return '';
  const PAD = 3;
  const min = Math.min(...curve), max = Math.max(...curve);
  const range = max - min || 1;
  const xs = curve.map((_, i) => PAD + (i / (curve.length - 1)) * (w - PAD * 2));
  const ys = curve.map(v => h - PAD - ((v - min) / range) * (h - PAD * 2));
  const pts = xs.map((x, i) => `${x.toFixed(1)},${ys[i].toFixed(1)}`).join(' ');
  const y0 = h - PAD - ((0 - min) / range) * (h - PAD * 2);
  const showZero = min < 0 && max > 0;
  const cls = profit > 0 ? 'pos' : profit < 0 ? 'neg' : 'flat';
  return `<svg class="spark-wrap ${cls}" viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg" style="width:${w}px;height:${h}px">
    ${showZero ? `<line class="spark-zero" x1="${PAD}" y1="${y0.toFixed(1)}" x2="${w-PAD}" y2="${y0.toFixed(1)}"/>` : ''}
    <polyline points="${pts}"/>
  </svg>`;
}

function sparkline(curve, profit) {
  const svg = buildSparkSVG(curve, profit, 90, 36);
  return svg
    ? `<td class="spark-cell">${svg}</td>`
    : '<td class="spark-cell">—</td>';
}

// ── podium card ───────────────────────────────────────────────────────────────
function buildPodiumCard(r, position, lang) {
  if (!r) return `<div class="podium-slot podium-${position} podium-empty"></div>`;

  const medals    = { 1: '🥇', 2: '🥈', 3: '🥉' };
  const profitCls = r.profit >= 0 ? 'pos' : 'neg';
  const pfCls     = (r.profit_factor != null && isFinite(r.profit_factor))
                    ? (r.profit_factor >= 1 ? 'pos' : 'neg') : '';
  const comments  = (r.comments || []).join(', ');

  const sparkW = position === 1 ? 200 : 160;
  const sparkH = position === 1 ? 56 : 44;
  const sparkSvg = buildSparkSVG(r.equity_curve, r.profit, sparkW, sparkH);

  return `
    <div class="podium-slot podium-${position}">
      <div class="podium-card">
        <div class="podium-medal">${medals[position]}</div>
        <div class="podium-name">${r.participant_name}</div>
        <div class="podium-comment">${comments}</div>
        <div class="podium-score ${r.score_rdd >= 0 ? 'pos' : 'neg'}">${fmtScore(r.score_rdd, lang)}</div>
        <div class="podium-score-label">${t(lang, 'podium_score_label')}</div>
        ${sparkSvg ? `<div class="podium-spark">${sparkSvg}</div>` : ''}
        <div class="podium-metrics">
          <div class="podium-metric">
            <span class="pm-label">${t(lang, 'podium_profit')}</span>
            <span class="pm-value ${profitCls}">${fmtProfit(r.profit, lang)}</span>
          </div>
          <div class="podium-metric">
            <span class="pm-label">${t(lang, 'podium_pf')}</span>
            <span class="pm-value ${pfCls}">${fmtPF(r.profit_factor, lang)}</span>
          </div>
          <div class="podium-metric">
            <span class="pm-label">${t(lang, 'podium_win')}</span>
            <span class="pm-value">${fmtWin(r.win_rate)}</span>
          </div>
          <div class="podium-metric">
            <span class="pm-label">${t(lang, 'podium_trades')}</span>
            <span class="pm-value">${r.trades}</span>
          </div>
        </div>
      </div>
      <div class="podium-base podium-base-${position}">
        <span class="podium-pos">${position}º</span>
      </div>
    </div>`;
}

// ── table row (from rank 4 onwards) ──────────────────────────────────────────
function buildRow(r, lang) {
  const profitCls = r.profit >= 0 ? 'pos' : 'neg';
  const scoreCls  = r.score_rdd >= 0 ? 'pos' : 'neg';
  const maxDdCls  = r.max_drawdown < 0 ? 'neg' : 'neutral';
  const pfCls     = (r.profit_factor != null && isFinite(r.profit_factor))
                    ? (r.profit_factor >= 1 ? 'pos' : 'neg') : '';
  const comments  = (r.comments || []).join(', ');

  const scoreHtml = r.score_floor_applied
    ? `<div class="score-wrap"><span class="${scoreCls} mono">${fmtScore(r.score_rdd, lang)}</span><span class="score-floor">${t(lang, 'score_floor_label')}</span></div>`
    : `<span class="${scoreCls} mono">${fmtScore(r.score_rdd, lang)}</span>`;

  const badge = r.official
    ? `<span class="badge oficial">${t(lang, 'badge_official')}</span>`
    : `<span class="badge pendiente">${t(lang, 'badge_pending')}</span>`;

  const rankLabel = r.rank ? `#${r.rank}` : '—';

  return `
    <tr>
      <td>
        <div class="rank-cell">
          <span class="rank-badge">${rankLabel}</span>
          <div>
            <div class="name-main">${r.participant_name}</div>
            <div class="name-sub">${comments}</div>
          </div>
        </div>
      </td>
      ${sparkline(r.equity_curve, r.profit)}
      <td class="right ${profitCls}">${fmtProfit(r.profit, lang)}</td>
      <td class="right ${pfCls} mono">${fmtPF(r.profit_factor, lang)}</td>
      <td class="right mono">${fmtWin(r.win_rate)}</td>
      <td class="right ${maxDdCls} mono">${r.max_drawdown != null ? fmtProfit(r.max_drawdown, lang) : '—'}</td>
      <td class="right">${scoreHtml}</td>
      <td class="right mono">${r.trades}</td>
      <td>${badge}</td>
    </tr>`;
}

// ── loading / error screens ─────────────────────────────────────────────────
function renderLoading(lang) {
  document.getElementById('app').innerHTML = `
    <div class="loading-screen">
      <div class="spinner"></div>
      <p>${t(lang, 'loading_text')}</p>
    </div>`;
}

function renderError(err, lang) {
  document.getElementById('app').innerHTML = `
    <div class="error-screen">
      <strong>${t(lang, 'error_title')}</strong>
      <p>${err.message}</p>
    </div>`;
}

// ── render ────────────────────────────────────────────────────────────────────
function render(data, lang) {
  currentLang = lang;
  document.documentElement.lang = lang;
  const { competition: c, rankings, summary: s } = data;

  const endLabel  = c.end_date ? dateFmt(c.end_date, lang) : '—';
  const official  = rankings.filter(r => r.official);
  const unofficial= rankings.filter(r => !r.official);

  // Podium: top 3 oficial (positions 1, 2, 3)
  const p1 = official.find(r => r.rank === 1);
  const p2 = official.find(r => r.rank === 2);
  const p3 = official.find(r => r.rank === 3);

  // Table: official rank 4+ and unofficial
  const tableOfficial   = official.filter(r => r.rank > 3);
  const hasTableContent = tableOfficial.length > 0 || unofficial.length > 0;

  const thead = `
    <thead><tr>
      <th>${t(lang, 'th_participant')}</th>
      <th>${t(lang, 'th_equity')}</th>
      <th class="right">${t(lang, 'th_profit')}</th>
      <th class="right">${t(lang, 'th_pf')}</th>
      <th class="right">${t(lang, 'th_win')}</th>
      <th class="right">${t(lang, 'th_maxdd')}</th>
      <th class="right">${t(lang, 'th_score')}</th>
      <th class="right">${t(lang, 'th_trades')}</th>
      <th>${t(lang, 'th_status')}</th>
    </tr></thead>`;

  document.getElementById('app').innerHTML = `

    <header class="site-header">
      <div class="header-inner">
        ${brandMark('/index.html')}

        <div class="header-center">
          <div class="header-title">${c.name}</div>
          <div class="header-meta">
            ${dateFmt(c.start_date, lang)} → ${endLabel}
            &nbsp;·&nbsp; ${c.platform} · ${c.server}
            &nbsp;·&nbsp; ${t(lang, 'broker_label')}: ${c.broker}
          </div>
        </div>

        <div class="header-right">
          <div class="live-badge">
            <span class="dot"></span>
            ${t(lang, 'live_badge')}
          </div>
          ${controlsHtml(lang)}
        </div>
      </div>
    </header>

    <div class="page">

      <div class="countdown-bar">
        <div class="countdown-item">
          <span class="countdown-icon">🔄</span>
          <span class="countdown-label">${t(lang, 'countdown_next_label')}</span>
          <span class="countdown-value" id="cd-next">--</span>
        </div>
        <div class="countdown-sep"></div>
        <div class="countdown-item">
          <span class="countdown-icon">🏁</span>
          <span class="countdown-label">${t(lang, 'countdown_end_label')}</span>
          <span class="countdown-value" id="cd-end">--</span>
        </div>
      </div>

      ${(p1 || p2 || p3) ? `
      <div class="section-hd"><h2>${t(lang, 'section_podium')}</h2></div>
      <div class="podium-wrap">
        ${buildPodiumCard(p2, 2, lang)}
        ${buildPodiumCard(p1, 1, lang)}
        ${buildPodiumCard(p3, 3, lang)}
      </div>` : ''}

      ${hasTableContent ? `
      <div class="section-hd" style="margin-top:32px"><h2>${t(lang, 'section_table')}</h2></div>
      <div class="table-card">
        <div class="table-scroll">
          <table>
            ${thead}
            <tbody>${tableOfficial.map(r => buildRow(r, lang)).join('')}</tbody>
          </table>
        </div>

        ${unofficial.length ? `
          <div class="pending-banner">
            ⏳ <strong>${t(lang, 'pending_banner_strong')}</strong>
            ${t(lang, 'pending_banner_text', c.min_trades)}
          </div>
          <div class="table-scroll">
            <table><tbody>${unofficial.map(r => buildRow(r, lang)).join('')}</tbody></table>
          </div>` : ''}
      </div>` : ''}

      <div class="formula-box">
        <strong>${t(lang, 'formula_metrics_label')}</strong>
        &nbsp;<code>${t(lang, 'formula_score', c.score_dd_floor_pct)}</code>
        &nbsp;·&nbsp;<code>${t(lang, 'formula_pf')}</code>
        &nbsp;·&nbsp;<code>${t(lang, 'formula_profit')}</code>
        &nbsp;·&nbsp; ${t(lang, 'formula_account_label')} <strong>${c.account_name}</strong> · ${c.platform} · ${c.server}
      </div>

    </div>`;

  startCountdowns(data.next_update_at, c.end_date, lang);
  bindControls((newLang) => {
    if (lastData) render(lastData, newLang);
  });
}

// ── boot ──────────────────────────────────────────────────────────────────────
renderLoading(currentLang);

loadData()
  .then(data => {
    lastData = data;
    render(data, currentLang);
    if (JSON_URL) scheduleNextRefresh();
  })
  .catch(err => renderError(err, currentLang));
