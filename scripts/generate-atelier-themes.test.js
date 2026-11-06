import {describe, it, expect} from 'vitest';
import {buildAtelierCss} from './generate-atelier-themes.js';

describe('Admin Atelier', () => {
    for (const mode of ['light', 'dark']) it(`provides legible ${mode} surfaces and controls`, () => {
        const css = buildAtelierCss(mode);
        const tokens = Object.fromEntries([...css.matchAll(/--dm-([\w-]+):\s*([^;]+);/g)].map(m => [m[1], m[2]]));
        const lum = hex => {
            const c = [1, 3, 5].map(i => parseInt(hex.slice(i, i + 2), 16) / 255).map(v => v <= .04045 ? v / 12.92 : ((v + .055) / 1.055) ** 2.4);
            return c[0] * .2126 + c[1] * .7152 + c[2] * .0722;
        };
        const contrast = (a, b) => (Math.max(lum(a), lum(b)) + .05) / (Math.min(lum(a), lum(b)) + .05);
        expect(css).toContain(`.dm-theme-admin-atelier-${mode}`);
        for (const fg of ['text', 'text-secondary', 'text-muted']) for (const bg of ['background', 'surface', 'surface-raised']) expect(contrast(tokens[fg], tokens[bg]), `${fg}/${bg}`).toBeGreaterThanOrEqual(4.5);
        for (const name of ['primary', 'secondary', 'success', 'danger', 'warning', 'info']) expect(contrast(tokens[`${name}-text`], tokens[name]), name).toBeGreaterThanOrEqual(4.5);
        expect(contrast(tokens['sidebar-text-muted'], tokens['sidebar-bg'])).toBeGreaterThanOrEqual(4.5);
        expect(contrast(tokens['tooltip-text'], tokens['tooltip-bg'])).toBeGreaterThanOrEqual(4.5);
    });
});
