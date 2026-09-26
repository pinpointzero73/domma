import { describe, it, expect } from 'vitest';
import { buildThemeCss, FINISHES, ACCENTS } from './generate-admin-themes.js';

describe('generate-admin-themes', () => {
  it('exposes 3 finishes and 3 accents', () => {
    expect(Object.keys(FINISHES).sort()).toEqual(['sharp', 'slate', 'smooth']);
    expect(Object.keys(ACCENTS).sort()).toEqual(['indigo', 'steel', 'teal']);
  });

  it('emits a correctly scoped rule with the accent primary and finish surface', () => {
    const css = buildThemeCss('sharp', 'steel');
    expect(css).toContain('.dm-theme-admin-sharp-steel {');
    expect(css).toContain('--dm-primary: #3b76bc;');
    expect(css).toContain('--dm-background: #eef1f6;');
    expect(css).toContain('color-scheme: light;');
  });

  it('uses the dark color-scheme for the smooth finish', () => {
    const css = buildThemeCss('smooth', 'teal');
    expect(css).toContain('.dm-theme-admin-smooth-teal {');
    expect(css).toContain('--dm-primary: #2a8178;');
    expect(css).toContain('color-scheme: dark;');
  });

  it('emits a correctly scoped rule for slate finish', () => {
    const css = buildThemeCss('slate', 'steel');
    expect(css).toContain('.dm-theme-admin-slate-steel {');
    expect(css).toContain('--dm-primary: #3b76bc;');
    expect(css).toContain('--dm-background: #252c37;');
    expect(css).toContain('color-scheme: dark;');
  });

  /*
   * The smooth and slate ramps must keep text legible on every surface level
   * above the WCAG AA 4.5 bar.
   */
  it('keeps smooth and slate finish text legible on every surface level', () => {
    for (const finish of ['smooth', 'slate']) {
      const css = buildThemeCss(finish, 'teal');
      const tok = (name) => {
        const m = css.match(new RegExp(`--dm-${name}:\\s*(#[0-9a-f]{6})`, 'i'));
        expect(m, `--dm-${name} in ${finish} should be a hex colour`).not.toBeNull();
        return m[1];
      };
      const lin = (c) => (c /= 255) <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
      const lum = (h) => {
        const [r, g, b] = [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
        return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
      };
      const ratio = (a, b) => {
        const [x, y] = [lum(a), lum(b)];
        return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05);
      };

      const text = tok('text');
      const muted = tok('text-muted');

      for (const level of ['background', 'surface', 'surface-raised']) {
        expect(ratio(text, tok(level)), `--dm-text on --dm-${level} in ${finish}`).toBeGreaterThanOrEqual(4.5);
      }
      // Muted is real content, not decoration, so it carries the same bar.
      expect(ratio(muted, tok('surface-raised')), `--dm-text-muted on --dm-surface-raised in ${finish}`)
        .toBeGreaterThanOrEqual(4.5);
    }
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
