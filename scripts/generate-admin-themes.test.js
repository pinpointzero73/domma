import { describe, it, expect } from 'vitest';
import { buildThemeCss, FINISHES, ACCENTS } from './generate-admin-themes.js';

describe('generate-admin-themes', () => {
  it('exposes 2 finishes and 3 accents', () => {
    expect(Object.keys(FINISHES).sort()).toEqual(['sharp', 'smooth']);
    expect(Object.keys(ACCENTS).sort()).toEqual(['indigo', 'steel', 'teal']);
  });

  it('emits a correctly scoped rule with the accent primary and finish surface', () => {
    const css = buildThemeCss('sharp', 'steel');
    expect(css).toContain('.dm-theme-admin-sharp-steel {');
    expect(css).toContain('--dm-primary: #3b76bc;');
    expect(css).toContain('--dm-background: #eef1f6;');
    expect(css).toContain('color-scheme: light;');
  });

  it('uses the dark color-scheme and mid-tone surface for the smooth finish', () => {
    const css = buildThemeCss('smooth', 'teal');
    expect(css).toContain('.dm-theme-admin-smooth-teal {');
    expect(css).toContain('--dm-primary: #2a8178;');
    expect(css).toContain('--dm-surface: #646d7c;');
    expect(css).toContain('color-scheme: dark;');
  });

  it('defines the full component-token contract', () => {
    const css = buildThemeCss('sharp', 'indigo');
    ['--dm-card-bg', '--dm-input-bg', '--dm-table-header-bg', '--dm-sidebar-bg',
     '--dm-modal-bg', '--dm-tooltip-bg', '--dm-primary-text', '--dm-focus-ring',
     '--dm-success', '--dm-danger', '--dm-warning', '--dm-info'].forEach(tok => {
      expect(css).toContain(tok);
    });
  });

  it('throws on an unknown finish or accent', () => {
    expect(() => buildThemeCss('bad', 'steel')).toThrow();
    expect(() => buildThemeCss('sharp', 'bad')).toThrow();
  });

  it('uses the lightened onDark accent for active text on the smooth finish', () => {
    const css = buildThemeCss('smooth', 'teal');
    expect(css).toContain('--dm-tab-active-text: #66c2b8;'); // onDark, not primary #2a8178
  });

  it('emits status hover-text tokens', () => {
    const css = buildThemeCss('sharp', 'steel');
    ['--dm-success-hover-text', '--dm-danger-hover-text',
     '--dm-warning-hover-text', '--dm-info-hover-text'].forEach(t => expect(css).toContain(t));
  });
});
