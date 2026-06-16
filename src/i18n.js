const STORAGE_KEY = 'sqx-lang';

export const translations = {
  es: {
    // ── nav / shared ──────────────────────────────────────────────────────
    nav_comunidad:    'Comunidad',
    nav_fundador:     'Fundador',
    nav_competicion:  'Competición',
    nav_cta:          'Ver Ranking en Vivo',
    broker_label:     'Broker',
    back_home:        'Volver al inicio',

    // ── landing: hero ────────────────────────────────────────────────────
    hero_eyebrow:      'Comunidad SQX Traders',
    hero_h1_pre:       'El trading algorítmico se demuestra con',
    hero_h1_accent:    'datos',
    hero_h1_post:      ', no con promesas',
    hero_lead:         'Una comunidad de traders cuantitativos que comparte estrategias, código y resultados auditados en cuentas reales. Sin atajos ni fórmulas mágicas — solo backtesting riguroso y seguimiento transparente, operación a operación.',
    hero_cta_primary:  'Ver Clasificación en Vivo →',
    hero_cta_secondary:'Conoce la comunidad',

    // ── landing: live widget ─────────────────────────────────────────────
    lw_static_label1: 'Competición',
    lw_static_value1: 'Ronda 2 · En curso',
    lw_static_label2: 'Actualización',
    lw_static_value2: 'Cada hora',
    lw_leader_label:  'Líder actual',
    lw_score_label:   'Score R/DD',
    lw_ends_label:    'Termina en',
    lw_finished:      'Finalizada',

    // ── landing: about ───────────────────────────────────────────────────
    about_tag:   'Fundador',
    about_role:  'Fundador de SQX Traders · Estrategias Ganadoras de Trading',
    about_bio1:  'Más de una década desarrollando, auditando y operando estrategias de trading algorítmico con StrategyQuant. Fundador de la comunidad SQX Traders, donde decenas de traders comparten código, backtests y resultados verificados en cuentas reales.',
    about_bio2:  'Track record auditado públicamente. Sin atajos ni fórmulas mágicas: estrategia, datos y acompañamiento real en cada paso del camino.',
    about_link:  'Más sobre Miguel en estrategiasganadoras.com →',

    // ── landing: community ───────────────────────────────────────────────
    community_tag:  'La comunidad',
    community_h2:   'Qué es SQX Traders',
    community_desc: 'Un espacio donde el trading algorítmico se comparte en abierto: estrategias, código, métricas y resultados — buenos y malos — a la vista de todos.',
    feat1_title: 'Comunidad de traders algorítmicos',
    feat1_desc:  'Decenas de traders comparten estrategias, código StrategyQuant y aprendizaje continuo en un espacio abierto, sin egos ni resultados maquillados.',
    feat2_title: 'Competiciones en vivo',
    feat2_desc:  'Retos periódicos con cuentas reales y demo, mismas reglas para todos, ranking público actualizado cada hora con métricas auditadas.',
    feat3_title: 'Transparencia total',
    feat3_desc:  'Cada operación, cada drawdown y cada resultado queda registrado y accesible públicamente. Sin filtros ni selección de resultados.',

    // ── landing: competition teaser ─────────────────────────────────────
    competition_tag:  'Reto en curso',
    competition_h2:   'La competición SQX-Traders',
    competition_desc: 'Varios participantes operando bajo las mismas reglas, mismo punto de partida y la misma cuenta auditada. El ranking se calcula directamente desde el histórico de MetaTrader.',
    comp_live_badge:        'En vivo · Datos auditados',
    comp_stat_participants: 'Participantes',
    comp_stat_qualified:    'Clasificados',
    comp_stat_trades:       'Operaciones',
    comp_cta:               'Ver clasificación completa →',

    // ── landing: footer ──────────────────────────────────────────────────
    footer_tagline:     'Comunidad fundada por Miguel Jiménez · Estrategias Ganadoras de Trading',
    footer_link_ranking:'Clasificación en vivo',

    // ── ranking page ─────────────────────────────────────────────────────
    loading_text: 'Cargando clasificación…',
    error_title:  'Error al cargar la clasificación',
    live_badge:   'En vivo',

    countdown_next_label: 'Próxima actualización',
    countdown_end_label:  'Fin de competición',
    countdown_updating:   'Actualizando…',
    countdown_no_end:     'Sin fecha fin',
    countdown_finished:   'Finalizada',

    section_podium: 'Pódium',
    section_open_trades: 'Operaciones Abiertas',
    section_table:  'Clasificación completa',
    open_trades_empty: 'No hay operaciones abiertas en este momento.',

    th_participant: 'Participante',
    th_equity:      'Equity',
    th_profit:      'Profit $',
    th_symbol:      'Símbolo',
    th_opened:      'Apertura',
    th_lots:        'Lotes',
    th_swap:        'Swap',
    th_commission:  'Comisión',
    th_total:       'Total',
    th_pf:          'P.F.',
    th_win:         'Win %',
    th_maxdd:       'Max DD $',
    th_score:       'Score R/DD',
    th_trades:      'Trades',
    th_status:      'Estado',

    podium_profit:      'Profit',
    podium_pf:          'P.F.',
    podium_win:         'Win %',
    podium_trades:      'Trades',
    podium_score_label: 'Score R/DD',

    pending_banner_strong: 'Pendientes de clasificar',
    pending_banner_text:   (min) => `— Necesitan al menos ${min} operaciones para entrar en el ranking oficial.`,
    badge_official:  'Oficial',
    badge_pending:   'Pendiente',
    score_floor_label: 'DD mín.',

    formula_metrics_label: 'Métricas:',
    formula_score:  (floor) => `Score R/DD = Rentabilidad% ÷ max(MaxDD%, ${floor}%)`,
    formula_pf:     'P.F. = Ganancias brutas ÷ Pérdidas brutas',
    formula_profit: 'Profit = profit + swap + comisión',
    formula_account_label: 'Cuenta:',
  },

  en: {
    nav_comunidad:    'Community',
    nav_fundador:     'Founder',
    nav_competicion:  'Competition',
    nav_cta:          'View Live Ranking',
    broker_label:     'Broker',
    back_home:        'Back to home',

    hero_eyebrow:      'SQX Traders Community',
    hero_h1_pre:       'Algorithmic trading is proven with',
    hero_h1_accent:    'data',
    hero_h1_post:      ', not promises',
    hero_lead:         'A community of quantitative traders sharing strategies, code and audited results on real accounts. No shortcuts, no magic formulas — just rigorous backtesting and transparent tracking, trade by trade.',
    hero_cta_primary:  'View Live Ranking →',
    hero_cta_secondary:'Discover the community',

    lw_static_label1: 'Competition',
    lw_static_value1: 'Round 2 · Ongoing',
    lw_static_label2: 'Updates',
    lw_static_value2: 'Every hour',
    lw_leader_label:  'Current leader',
    lw_score_label:   'R/DD Score',
    lw_ends_label:    'Ends in',
    lw_finished:      'Finished',

    about_tag:   'Founder',
    about_role:  'Founder of SQX Traders · Estrategias Ganadoras de Trading',
    about_bio1:  'Over a decade developing, auditing and trading algorithmic strategies with StrategyQuant. Founder of the SQX Traders community, where dozens of traders share code, backtests and verified results on real accounts.',
    about_bio2:  'Publicly audited track record. No shortcuts or magic formulas: just strategy, data and real support every step of the way.',
    about_link:  'More about Miguel at estrategiasganadoras.com →',

    community_tag:  'The community',
    community_h2:   'What is SQX Traders',
    community_desc: 'A space where algorithmic trading is shared openly: strategies, code, metrics and results — good and bad — visible to everyone.',
    feat1_title: 'Algorithmic traders community',
    feat1_desc:  'Dozens of traders share strategies, StrategyQuant code and continuous learning in an open space, with no egos or polished results.',
    feat2_title: 'Live competitions',
    feat2_desc:  'Periodic challenges on real and demo accounts, same rules for everyone, public ranking updated hourly with audited metrics.',
    feat3_title: 'Total transparency',
    feat3_desc:  'Every trade, every drawdown and every result is logged and publicly accessible. No filters, no cherry-picked results.',

    competition_tag:  'Ongoing challenge',
    competition_h2:   'The SQX-Traders competition',
    competition_desc: 'Multiple participants trading under the same rules, the same starting point and the same audited account. The ranking is calculated directly from the MetaTrader history.',
    comp_live_badge:        'Live · Audited data',
    comp_stat_participants: 'Participants',
    comp_stat_qualified:    'Qualified',
    comp_stat_trades:       'Trades',
    comp_cta:               'View full ranking →',

    footer_tagline:     'Community founded by Miguel Jiménez · Estrategias Ganadoras de Trading',
    footer_link_ranking:'Live ranking',

    loading_text: 'Loading ranking…',
    error_title:  'Error loading the ranking',
    live_badge:   'Live',

    countdown_next_label: 'Next update',
    countdown_end_label:  'Competition ends',
    countdown_updating:   'Updating…',
    countdown_no_end:     'No end date',
    countdown_finished:   'Finished',

    section_podium: 'Podium',
    section_open_trades: 'Open Trades',
    section_table:  'Full ranking',
    open_trades_empty: 'No open trades right now.',

    th_participant: 'Participant',
    th_equity:      'Equity',
    th_profit:      'Profit $',
    th_symbol:      'Symbol',
    th_opened:      'Opened',
    th_lots:        'Lots',
    th_swap:        'Swap',
    th_commission:  'Commission',
    th_total:       'Total',
    th_pf:          'P.F.',
    th_win:         'Win %',
    th_maxdd:       'Max DD $',
    th_score:       'R/DD Score',
    th_trades:      'Trades',
    th_status:      'Status',

    podium_profit:      'Profit',
    podium_pf:          'P.F.',
    podium_win:         'Win %',
    podium_trades:      'Trades',
    podium_score_label: 'R/DD Score',

    pending_banner_strong: 'Awaiting qualification',
    pending_banner_text:   (min) => `— Need at least ${min} trades to enter the official ranking.`,
    badge_official:  'Official',
    badge_pending:   'Pending',
    score_floor_label: 'Min. DD',

    formula_metrics_label: 'Metrics:',
    formula_score:  (floor) => `R/DD Score = Return% ÷ max(MaxDD%, ${floor}%)`,
    formula_pf:     'P.F. = Gross profit ÷ Gross loss',
    formula_profit: 'Profit = profit + swap + commission',
    formula_account_label: 'Account:',
  },
};

export function getStoredLang() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved === 'es' || saved === 'en') return saved;
  return (navigator.language || '').toLowerCase().startsWith('en') ? 'en' : 'es';
}

export function setStoredLang(lang) {
  localStorage.setItem(STORAGE_KEY, lang);
}

export function localeFor(lang) {
  return lang === 'en' ? 'en-US' : 'es-ES';
}

export function t(lang, key, ...args) {
  const dict = translations[lang] || translations.es;
  const entry = dict[key] ?? translations.es[key] ?? key;
  return typeof entry === 'function' ? entry(...args) : entry;
}
