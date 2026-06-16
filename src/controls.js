import { toggleTheme } from './theme.js';
import { setStoredLang } from './i18n.js';

export function controlsHtml(lang) {
  return `
    <div class="ui-controls">
      <button class="lang-toggle" id="lang-toggle" type="button" title="ES / EN">
        <span data-lang="es" class="${lang === 'es' ? 'active' : ''}">ES</span>
        <span data-lang="en" class="${lang === 'en' ? 'active' : ''}">EN</span>
      </button>
      <button class="theme-toggle" id="theme-toggle" type="button" aria-label="Toggle theme">
        <span class="icon-light">☀️</span>
        <span class="icon-dark">🌙</span>
      </button>
    </div>`;
}

export function bindControls(onLangChange) {
  const themeBtn = document.getElementById('theme-toggle');
  if (themeBtn) themeBtn.addEventListener('click', () => toggleTheme());

  const langBtn = document.getElementById('lang-toggle');
  if (langBtn) {
    langBtn.addEventListener('click', () => {
      const current = langBtn.querySelector('.active')?.dataset.lang || 'es';
      const next = current === 'es' ? 'en' : 'es';
      setStoredLang(next);
      onLangChange(next);
    });
  }
}
