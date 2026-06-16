export const LOGO_SVG = `
  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M50 2 L93 26 V74 L50 98 L7 74 V26 Z" fill="#f97316"/>
    <rect x="24" y="50" width="9" height="22" fill="#0a0a0a"/>
    <rect x="40" y="38" width="9" height="34" fill="#0a0a0a"/>
    <rect x="56" y="56" width="9" height="16" fill="#0a0a0a"/>
    <rect x="72" y="30" width="9" height="42" fill="#0a0a0a"/>
    <path d="M28 48 L44 36 L60 54 L76 28" stroke="#0a0a0a" stroke-width="4" stroke-linecap="round" fill="none"/>
  </svg>`;

export function brandMark(href = '/') {
  return `<a href="${href}" class="brand">${LOGO_SVG}<span>SQX TRADERS</span></a>`;
}
