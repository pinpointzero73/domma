/** Warm ivory/graphite admin palettes. Reuse the admin component token contract. */
import {FINISHES, renderAdminTheme} from './generate-admin-themes.js';

const LIGHT = {
    'background': '#f5f1e9', 'background-alt': '#ece6dc',
    'surface': '#fffdf8', 'surface-raised': '#ece6dc', 'surface-overlay': '#fffdf8',
    'text': '#282d30', 'text-secondary': '#505553', 'text-muted': '#68665f',
    'text-disabled': '#918b82', 'text-inverse': '#ffffff',
    'border': '#c9c1b5', 'border-light': '#e0d9ce', 'border-dark': '#aaa194',
    'hover-bg': 'rgba(52, 84, 106, 0.07)', 'active-bg': 'rgba(52, 84, 106, 0.12)',
    'sidebar-bg': '#2f3336', 'sidebar-text': '#f2eee7', 'sidebar-border': '#24282b',
    'sidebar-text-muted': '#c3bfb7', 'sidebar-header-bg': '#24282b',
    'navbar-bg': '#fffdf8', 'navbar-text': '#282d30', 'navbar-border': '#c9c1b5',
    'table-header-bg': '#e9e2d7', 'table-stripe-bg': '#f6f2eb', 'table-hover-bg': '#e6ecee',
    'modal-backdrop': 'rgba(40, 45, 48, 0.45)', 'tooltip-bg': '#282d30', 'tooltip-text': '#fffdf8',
    'scrollbar-track': '#f5f1e9', 'scrollbar-thumb': '#b3aa9d', 'scrollbar-thumb-hover': '#8b8173',
    'code-bg': '#ece6dc', 'code-text': '#614b32', 'progress-bg': '#e0d9ce'
};
const DARK = {
    'background': '#242526', 'background-alt': '#1e2021',
    'surface': '#2e2e2d', 'surface-raised': '#393633', 'surface-overlay': '#393633',
    'text': '#f5f0e7', 'text-secondary': '#d8d1c5', 'text-muted': '#b9b2a8',
    'text-disabled': '#827c73', 'text-inverse': '#242526',
    'border': '#615b52', 'border-light': '#49453f', 'border-dark': '#80776b',
    'hover-bg': 'rgba(143, 183, 210, 0.10)', 'active-bg': 'rgba(143, 183, 210, 0.16)',
    'sidebar-bg': '#1e2021', 'sidebar-text': '#e5ded2', 'sidebar-border': '#17191a',
    'sidebar-text-muted': '#b9b2a8', 'sidebar-header-bg': '#17191a',
    'navbar-bg': '#292a2b', 'navbar-text': '#f5f0e7', 'navbar-border': '#615b52',
    'table-header-bg': '#242526', 'table-stripe-bg': 'rgba(245, 240, 231, 0.03)', 'table-hover-bg': 'rgba(143, 183, 210, 0.10)',
    'modal-backdrop': 'rgba(0, 0, 0, 0.65)', 'tooltip-bg': '#f5f0e7', 'tooltip-text': '#242526',
    'scrollbar-track': '#242526', 'scrollbar-thumb': '#615b52', 'scrollbar-thumb-hover': '#80776b',
    'code-bg': '#242526', 'code-text': '#d8b98b', 'progress-bg': '#49453f'
};
const INK = {primary: '#34546a', hover: '#294455', active: '#203643', dark: '#203643', rgb: '52, 84, 106', onDark: '#8fb7d2'};
const INK_DARK = {primary: '#8fb7d2', hover: '#aac8dc', active: '#bfd7e7', dark: '#608aa6', rgb: '143, 183, 210', onDark: '#8fb7d2'};

export function buildAtelierCss(mode) {
    if (!['light', 'dark'].includes(mode)) throw new Error(`Unknown Atelier mode: ${mode}`);
    const dark = mode === 'dark';
    const finish = {...FINISHES[dark ? 'smooth' : 'sharp'], foundation: dark ? DARK : LIGHT};
    return renderAdminTheme(finish, dark ? INK_DARK : INK, `admin-atelier-${mode}`, `Admin Atelier ${dark ? 'Dark' : 'Light'}`, {
        'primary-text': dark ? '#1d2a32' : '#ffffff', 'primary-hover-text': dark ? '#1d2a32' : '#ffffff',
        'secondary': '#806344', 'secondary-hover': '#6e5337', 'secondary-active': '#5c442d', 'secondary-dark': '#5c442d',
        'secondary-light': dark ? 'rgba(216, 185, 139, 0.15)' : '#eee1ce',
        'accent-1': dark ? '#d8b98b' : '#806344', 'accent-2': dark ? '#b9b2a8' : '#68665f',
        'accent-3': dark ? '#8fb7d2' : '#34546a', 'accent-4': dark ? '#e5ded2' : '#282d30',
        ...(dark ? {
            'success': '#8bc89f', 'success-hover': '#a4d5b4', 'success-active': '#69b684', 'success-text': '#172b1f', 'success-hover-text': '#172b1f',
            'danger': '#ef9a88', 'danger-hover': '#f5b09f', 'danger-active': '#d98270', 'danger-text': '#35201b', 'danger-hover-text': '#35201b',
            'warning': '#d8b96b', 'warning-hover': '#e6cb89', 'warning-active': '#c3a352', 'warning-text': '#302715', 'warning-hover-text': '#302715',
            'info': '#8fb7d2', 'info-hover': '#aac8dc', 'info-active': '#7ca3be', 'info-text': '#1d2a32', 'info-hover-text': '#1d2a32'
        } : {}),
        'badge-text': 'var(--dm-secondary-text)',
        'radius-sm': '4px', 'radius-md': '6px', 'radius-lg': '10px', 'radius-xl': '14px',
        'shadow-sm': `0 1px 3px rgba(24, 22, 18, ${dark ? '0.2' : '0.06'})`,
        'shadow-md': `0 4px 12px rgba(24, 22, 18, ${dark ? '0.25' : '0.07'})`,
        'shadow-lg': `0 8px 24px rgba(24, 22, 18, ${dark ? '0.3' : '0.10'})`,
        'shadow-xl': `0 16px 40px rgba(24, 22, 18, ${dark ? '0.4' : '0.14'})`
    });
}
