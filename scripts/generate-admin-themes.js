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
// Finishes - foundational + chrome tokens. `tintStyle` controls status -light
// tints (solid pale for sharp, translucent for smooth). `accentText` is the
// lightened accent used for on-dark active/selection text on the smooth finish.
// ---------------------------------------------------------------------------
export const FINISHES = {
  smooth: {
    colorScheme: 'dark',
    tintStyle: 'alpha',
    useAccentOnDark: true,
    foundation: {
      /*
       * The surface ramp is DARK, not mid-grey, and that is load-bearing.
       *
       * It used to run #586170 / #646d7c / #6c7686 - a mid-grey that stepped
       * LIGHTER as it rose. With near-white text that is the wrong direction:
       * every step up reduced contrast rather than adding depth, and the ramp
       * ran out of room. `--dm-text` on `--dm-surface-raised` came to 4.35,
       * below the 4.5 AA needs, making these the only themes of the 33 where
       * ordinary body text failed - every other theme manages 8.40 or better.
       * `--dm-text-muted` was 2.39, which is not readable by any measure.
       *
       * Darkening the whole ramp by 40% keeps the blue-grey character and the
       * relative steps between levels, while restoring the headroom: text 8.88,
       * secondary 6.53, muted 4.88 on `--dm-surface-raised`. A lighter ramp
       * cannot carry both near-white body text and a dimmer muted tone at AA -
       * one of the two has to give, and it should not be legibility.
       *
       * Check with `npm run validate:contrast` after touching any of these.
       */
      'background': '#353a43', 'background-alt': '#2f343c',
      'surface': '#3c414a', 'surface-raised': '#414750', 'surface-overlay': '#414750',
      'text': '#f7f9fb', 'text-secondary': '#d2d8e0', 'text-muted': '#b3bcc8',
      'text-disabled': '#8a93a1', 'text-inverse': '#1f2733',
      'border': '#434852', 'border-light': '#373d45', 'border-dark': '#494f59',
      'hover-bg': 'rgba(255, 255, 255, 0.07)', 'active-bg': 'rgba(255, 255, 255, 0.10)',
      'disabled-opacity': '0.4',
      'sidebar-bg': '#292e36', 'sidebar-text': '#d2d8e0', 'sidebar-border': '#232830',
      'navbar-bg': '#2f343c', 'navbar-text': '#f7f9fb', 'navbar-border': '#373d45',
      'table-header-bg': '#32373f', 'table-stripe-bg': 'rgba(255, 255, 255, 0.03)',
      'table-hover-bg': 'rgba(255, 255, 255, 0.07)',
      'modal-backdrop': 'rgba(0, 0, 0, 0.6)',
      'tooltip-bg': '#1f2733', 'tooltip-text': '#ffffff',
      'scrollbar-track': '#2f343c', 'scrollbar-thumb': '#494f59', 'scrollbar-thumb-hover': '#5a616c',
      'code-bg': '#292e36', 'code-text': '#ffd9a8', 'progress-bg': '#32373f'
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
  },
  slate: {
    colorScheme: 'dark',
    tintStyle: 'alpha',
    useAccentOnDark: true,
    foundation: {
      'background': '#252c37', 'background-alt': '#1e242f',
      'surface': '#2e3644', 'surface-raised': '#353e4e', 'surface-overlay': '#353e4e',
      'text': '#ffffff', 'text-secondary': '#dbe2eb', 'text-muted': '#a8b8cc',
      'text-disabled': '#7d8c9e', 'text-inverse': '#0f172a',
      'border': '#445166', 'border-light': '#384355', 'border-dark': '#55637a',
      'hover-bg': 'rgba(255, 255, 255, 0.08)', 'active-bg': 'rgba(255, 255, 255, 0.12)',
      'disabled-opacity': '0.45',
      'sidebar-bg': '#1a202a', 'sidebar-text': '#dbe2eb', 'sidebar-border': '#151922',
      'navbar-bg': '#1e242f', 'navbar-text': '#ffffff', 'navbar-border': '#2d3746',
      'table-header-bg': '#222833', 'table-stripe-bg': 'rgba(255, 255, 255, 0.03)',
      'table-hover-bg': 'rgba(255, 255, 255, 0.07)',
      'modal-backdrop': 'rgba(0, 0, 0, 0.65)',
      'tooltip-bg': '#151922', 'tooltip-text': '#ffffff',
      'scrollbar-track': '#1e242f', 'scrollbar-thumb': '#445166', 'scrollbar-thumb-hover': '#55637a',
      'code-bg': '#1a202a', 'code-text': '#ffd9a8', 'progress-bg': '#222833'
    }
  }
};

// ---------------------------------------------------------------------------
// Accents - the --dm-primary family. `onDark` is a lightened variant used for
// active/selection text on the smooth finish so it stays legible.
// ---------------------------------------------------------------------------
export const ACCENTS = {
  steel:  { primary: '#3b76bc', hover: '#356bab', active: '#2d5c95', dark: '#274e7d', rgb: '59, 118, 188',  onDark: '#7fb0e0' },
  indigo: { primary: '#5b63a8', hover: '#4f5694', active: '#444a80', dark: '#3a3f6e', rgb: '91, 99, 168',   onDark: '#9aa0d4' },
  teal:   { primary: '#2a8178', hover: '#287d75', active: '#226b64', dark: '#1d564f', rgb: '42, 129, 120',  onDark: '#66c2b8' }
};

// ---------------------------------------------------------------------------
// Status colours - shared across the whole family.
// ---------------------------------------------------------------------------
const STATUS = {
  success: { base: '#2e8b50', hover: '#287d49', active: '#226b3f', dark: '#1c5733', rgb: '46, 139, 80',  solidLight: '#e3f3e8', text: '#ffffff', hoverText: '#ffffff' },
  danger:  { base: '#c0432f', hover: '#a93a29', active: '#933223', dark: '#742719', rgb: '192, 67, 47',  solidLight: '#fbe6e1', text: '#ffffff', hoverText: '#ffffff' },
  warning: { base: '#8a6d1f', hover: '#79601b', active: '#675217', dark: '#4e3e11', rgb: '138, 109, 31', solidLight: '#fbf0d6', text: '#ffffff', hoverText: '#ffffff' },
  info:    { base: '#2f6fb0', hover: '#296199', active: '#235485', dark: '#1a3f64', rgb: '47, 111, 176', solidLight: '#e1ecf7', text: '#ffffff', hoverText: '#ffffff' }
};

const FINISH_LABEL = { smooth: 'Smooth', sharp: 'Sharp', slate: 'Slate' };
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

/** Component-specific tokens - identical structure to charcoal-dark.css, all var-referencing. */
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
  const selectedBg = `rgba(${a.rgb}, ${f.colorScheme === 'dark' ? '0.22' : '0.12'})`;

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
    'secondary-light': f.colorScheme === 'dark' ? 'rgba(255, 255, 255, 0.10)' : '#eef1f6',
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
 * GENERATED by scripts/generate-admin-themes.js - do not edit by hand.
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
