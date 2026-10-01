import {describe, it, expect} from 'vitest';
import {drawTickerStrip, advanceTickerStrip} from './ticker-tape-drawing.js';
const particle = () => ({x: 20, y: 0, width: 8, height: 20, colour: '#e8bc60', alpha: 1, rotation: 0, rotationSpeed: 0.03, flipPhase: 0, flipSpeed: 0.02, curlPhase: 0, swayPhase: 0.3, swayFreq: 0.01, vx: 0.2, vy: 2, alive: true});
const opts = {sway: 60, fadeStart: 0.55};
describe('ticker tape paper and timing', () => {
    it('follows the same trajectory at 60Hz and 120Hz', () => {
        const a = particle(), b = particle();
        for (let i = 0; i < 60; i++) advanceTickerStrip(a, 500, opts, 1);
        for (let i = 0; i < 120; i++) advanceTickerStrip(b, 500, opts, 0.5);
        for (const key of ['x', 'y', 'rotation', 'flipPhase', 'curlPhase', 'alpha']) expect(a[key]).toBeCloseTo(b[key], 8);
    });
    it('fades and expires at the container bottom', () => {
        const p = particle(); p.y = 75; advanceTickerStrip(p, 100, opts, 0);
        expect(p.alpha).toBeCloseTo(0.25 / 0.45);
        p.y = 105; advanceTickerStrip(p, 100, opts, 0); expect(p.alive).toBe(false);
    });
    it.each([0, Math.PI / 2, Math.PI])('draws finite curved geometry at flip %s', flipPhase => {
        const p = {...particle(), flipPhase}, before = structuredClone(p); let depth = 0; const calls = [];
        const ctx = new Proxy({globalAlpha: 0.6}, {get(target, key) {
            if (key in target) return target[key];
            if (key === 'save') return () => {depth++;};
            if (key === 'restore') return () => {depth--;};
            if (key === 'createLinearGradient') return () => ({addColorStop() {}});
            return (...args) => {for (const arg of args) if (typeof arg === 'number') expect(Number.isFinite(arg)).toBe(true); calls.push(key);};
        }});
        drawTickerStrip(ctx, p); expect(depth).toBe(0); expect(calls).toContain('bezierCurveTo'); expect(calls).toContain('stroke'); expect(p).toEqual(before);
    });
    it.each([0, -1, NaN])('ignores invalid width %s', width => {
        drawTickerStrip({save() {throw new Error('should not draw');}}, {...particle(), width});
    });
});
