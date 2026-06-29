/**
 * Domma Admin Theme Generator
 * Single source of truth for the Admin theme family.
 * 2 finishes (smooth, sharp) x 3 accents (steel, indigo, teal) = 6 themes.
 *
 * Run directly to (re)write the six CSS files into public/assets/themes/.
 */

import { writeFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = join(__dirname, '..');
const themesDir = join(rootDir, 'public/assets/themes');

// ---------------------------------------------------------------------------
// Finishes — foundational + chrome tokens. `tintStyle` controls status -light
// tints (solid pale for sharp, translucent for smooth). `accentText` is the
// lightened accent used for on-dark active/selection text on the smooth finish.
// ---------------------------------------------------------------------------
export const FINISHES = {
  smooth: {
    colorScheme: 'dark',
    tintStyle: 'alpha',
    useAccentOnDark: true,
    foundation: {
      'background': '#586170', 'background-alt': '#4f5764',
      'surface': '#646d7c', 'surface-raised': '#6c7686', 'surface-overlay': '#6c7686',
      'text': '#f7f9fb', 'text-secondary': '#d2d8e0', 'text-muted': '#b3bcc8',
      'text-disabled': '#8a93a1', 'text-inverse': '#1f2733',
      'border': '#6f7888', 'border-light': '#5c6573', 'border-dark': '#7a8494',
      'hover-bg': 'rgba(255, 255, 255, 0.07)', 'active-bg': 'rgba(255, 255, 255, 0.10)',
      'disabled-opacity': '0.4',
      'sidebar-bg': '#454d5a', 'sidebar-text': '#d2d8e0', 'sidebar-border': '#3b424d',
      'navbar-bg': '#4f5764', 'navbar-text': '#f7f9fb', 'navbar-border': '#5c6573',
      'table-header-bg': '#535b69', 'table-stripe-bg': 'rgba(255, 255, 255, 0.03)',
      'table-hover-bg': 'rgba(255, 255, 255, 0.07)',
      'modal-backdrop': 'rgba(0, 0, 0, 0.6)',
      'tooltip-bg': '#1f2733', 'tooltip-text': '#ffffff',
      'scrollbar-track': '#4f5764', 'scrollbar-thumb': '#7a8494', 'scrollbar-thumb-hover': '#8b95a5',
      'code-bg': '#454d5a', 'code-text': '#ffd9a8', 'progress-bg': '#535b69'
    }
  },
  sharp: {
    colorScheme: 'light',
    tintStyle: 'solid',
    useAccentOnDark: false,
    foundation: {
      'background': '#eef1f6', 'background-alt': '#e6ebf3',
      'surface': '#fbfcfe', 'surface-raised': '#ffffff', 'surface-overlay': '#ffffff',
      'text': '#1f2733', 'text-secondary': '#5a6677', 'text-muted': '#8893a3',
      'text-disabled': '#aab2bd', 'text-inverse': '#ffffff',
      'border': '#e4e8ef', 'border-light': '#eef1f6', 'border-dark': '#d5dbe5',
      'hover-bg': 'rgba(15, 23, 42, 0.04)', 'active-bg': 'rgba(15, 23, 42, 0.07)',
      'disabled-opacity': '0.5',
      'sidebar-bg': '#283242', 'sidebar-text': '#c4cdda', 'sidebar-border': '#1f2733',
      'navbar-bg': '#fbfcfe', 'navbar-text': '#1f2733', 'navbar-border': '#dde2ea',
      'table-header-bg': '#f0f3f8', 'table-stripe-bg': '#f7f9fc',
      'table-hover-bg': '#eef4fb',
      'modal-backdrop': 'rgba(15, 23, 42, 0.45)',
      'tooltip-bg': '#283242', 'tooltip-text': '#ffffff',
      'scrollbar-track': '#eef1f6', 'scrollbar-thumb': '#c4cdda', 'scrollbar-thumb-hover': '#aab6c6',
      'code-bg': '#f0f3f8', 'code-text': '#b3325a', 'progress-bg': '#e4e8ef'
    }
  }
};

// ---------------------------------------------------------------------------
// Accents — the --dm-primary family. `onDark` is a lightened variant used for
// active/selection text on the smooth finish so it stays legible.
// ---------------------------------------------------------------------------
export const ACCENTS = {
  steel:  { primary: '#3b76bc', hover: '#356bab', active: '#2d5c95', dark: '#274e7d', rgb: '59, 118, 188',  onDark: '#7fb0e0' },
  indigo: { primary: '#5b63a8', hover: '#4f5694', active: '#444a80', dark: '#3a3f6e', rgb: '91, 99, 168',   onDark: '#9aa0d4' },
  teal:   { primary: '#2a8178', hover: '#287d75', active: '#226b64', dark: '#1d564f', rgb: '42, 129, 120',  onDark: '#66c2b8' }
};

// ---------------------------------------------------------------------------
// Status colours — shared across the whole family.
// ---------------------------------------------------------------------------
const STATUS = {
  success: { base: '#2e8b50', hover: '#287d49', active: '#226b3f', dark: '#1c5733', rgb: '46, 139, 80',  solidLight: '#e3f3e8', text: '#ffffff', hoverText: '#ffffff' },
  danger:  { base: '#c0432f', hover: '#a93a29', active: '#933223', dark: '#742719', rgb: '192, 67, 47',  solidLight: '#fbe6e1', text: '#ffffff', hoverText: '#ffffff' },
  warning: { base: '#8a6d1f', hover: '#79601b', active: '#675217', dark: '#4e3e11', rgb: '138, 109, 31', solidLight: '#fbf0d6', text: '#ffffff', hoverText: '#ffffff' },
  info:    { base: '#2f6fb0', hover: '#296199', active: '#235485', dark: '#1a3f64', rgb: '47, 111, 176', solidLight: '#e1ecf7', text: '#ffffff', hoverText: '#ffffff' }
};

const FINISH_LABEL = { smooth: 'Smooth', sharp: 'Sharp' };
const ACCENT_LABEL = { steel: 'Steel Blue', indigo: 'Indigo', teal: 'Teal' };

/** Render `  --dm-<key>: <value>;` lines from an object whose keys omit the prefix. */
function vars(map) {
  return Object.entries(map)
    .map(([k, v]) => `    --dm-${k}: ${v};`)
    .join('\n');
}

function statusBlock(tintStyle) {
  let out = '';
  for (const [name, s] of Object.entries(STATUS)) {
    const light = tintStyle === 'solid' ? s.solidLight : `rgba(${s.rgb}, 0.15)`;
    out += vars({
      [`${name}`]: s.base,
      [`${name}-hover`]: s.hover,
      [`${name}-active`]: s.active,
      [`${name}-light`]: light,
      [`${name}-dark`]: s.dark,
      [`${name}-text`]: s.text,
      [`${name}-hover-text`]: s.hoverText
    }) + '\n';
  }
  return out.trimEnd();
}

/** Component-specific tokens — identical structure to charcoal-dark.css, all var-referencing. */
function componentBlock() {
  return vars({
    'card-bg': 'var(--dm-surface)',
    'card-border': 'var(--dm-border)',
    'card-shadow': 'var(--dm-shadow-md)',
    'card-header-bg': 'var(--dm-background-alt)',
    'input-bg': 'var(--dm-surface)',
    'input-border': 'var(--dm-border-dark)',
    'input-text': 'var(--dm-text)',
    'input-placeholder': 'var(--dm-text-muted)',
    'input-focus-border': 'var(--dm-primary)',
    'input-disabled-bg': 'var(--dm-background-alt)',
    'btn-text': 'var(--dm-text)',
    'btn-bg': 'var(--dm-surface)',
    'btn-border': 'var(--dm-border-dark)',
    'table-bg': 'transparent',
    'table-border': 'var(--dm-border)',
    'table-header-text': 'var(--dm-text)',
    'table-selected-bg': 'var(--dm-selected-bg)',
    'modal-bg': 'var(--dm-surface)',
    'modal-border': 'var(--dm-border)',
    'modal-shadow': 'var(--dm-shadow-xl)',
    'dropdown-bg': 'var(--dm-surface-raised)',
    'dropdown-border': 'var(--dm-border)',
    'dropdown-shadow': 'var(--dm-shadow-lg)',
    'dropdown-item-hover': 'var(--dm-hover-bg)',
    'dropdown-item-active': 'var(--dm-selected-bg)',
    'toast-bg': 'var(--dm-surface)',
    'toast-border': 'var(--dm-border)',
    'toast-shadow': 'var(--dm-shadow-lg)',
    'sidebar-item-hover': 'var(--dm-hover-bg)',
    'sidebar-item-active': 'var(--dm-selected-bg)',
    'tab-border': 'var(--dm-border)',
    'tab-hover-bg': 'var(--dm-hover-bg)',
    'accordion-bg': 'var(--dm-surface)',
    'accordion-border': 'var(--dm-border)',
    'accordion-header-bg': 'var(--dm-background-alt)',
    'accordion-header-hover': 'var(--dm-hover-bg)',
    'badge-bg': 'var(--dm-secondary)',
    'badge-text': 'var(--dm-text-inverse)',
    'code-border': 'var(--dm-border)'
  });
}

/**
 * Build the full CSS rule string for one Admin theme.
 * @param {'smooth'|'sharp'} finishKey
 * @param {'steel'|'indigo'|'teal'} accentKey
 * @returns {string}
 */
export function buildThemeCss(finishKey, accentKey) {
  const f = FINISHES[finishKey];
  const a = ACCENTS[accentKey];
  if (!f || !a) throw new Error(`Unknown finish/accent: ${finishKey}/${accentKey}`);

  const activeText = f.useAccentOnDark ? a.onDark : a.primary;
  const selectedBg = `rgba(${a.rgb}, ${finishKey === 'smooth' ? '0.22' : '0.12'})`;

  const primaryBlock = vars({
    'primary': a.primary,
    'primary-hover': a.hover,
    'primary-active': a.active,
    'primary-light': `rgba(${a.rgb}, 0.14)`,
    'primary-dark': a.dark,
    'primary-text': '#ffffff',
    'primary-hover-text': '#ffffff',
    'focus-ring': `0 0 0 3px rgba(${a.rgb}, 0.35)`,
    'border-focus': a.primary,
    'secondary': '#5f6f7a',
    'secondary-hover': '#52606b',
    'secondary-active': '#46535d',
    'secondary-light': finishKey === 'smooth' ? 'rgba(255, 255, 255, 0.10)' : '#eef1f6',
    'secondary-dark': '#3d4a52',
    'secondary-text': '#ffffff',
    'secondary-hover-text': '#ffffff',
    'selected-bg': selectedBg,
    'tab-active-border': a.primary,
    'tab-active-text': activeText,
    'progress-bar': a.primary,
    'accent-1': '#78909c',
    'accent-2': '#607d8b',
    'accent-3': '#455a64',
    'accent-4': '#263238'
  });

  const header =
`/**
 * Domma Admin ${FINISH_LABEL[finishKey]} · ${ACCENT_LABEL[accentKey]}
 * GENERATED by scripts/generate-admin-themes.js — do not edit by hand.
 */

.dm-theme-admin-${finishKey}-${accentKey} {
    color-scheme: ${f.colorScheme};

`;

  return header +
    vars(f.foundation) + '\n\n' +
    primaryBlock + '\n\n' +
    statusBlock(f.tintStyle) + '\n\n' +
    componentBlock() + '\n}\n';
}

/** Write all six files. */
function main() {
  let count = 0;
  for (const finishKey of Object.keys(FINISHES)) {
    for (const accentKey of Object.keys(ACCENTS)) {
      const file = join(themesDir, `admin-${finishKey}-${accentKey}.css`);
      writeFileSync(file, buildThemeCss(finishKey, accentKey), 'utf8');
      console.log(`  ✓ admin-${finishKey}-${accentKey}.css`);
      count++;
    }
  }
  console.log(`Generated ${count} Admin theme files.`);
}

// Run when invoked directly (not when imported by tests).
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main();
}
