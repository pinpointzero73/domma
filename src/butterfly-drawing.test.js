import {describe, it, expect} from 'vitest';
import {drawIllustratedButterfly} from './butterfly-drawing.js';

function canvas() {
  let depth = 0;
  const calls = [];
  const ctx = new Proxy({globalAlpha: 0.6}, {get(target, key) {
    if (key in target) return target[key];
    if (key === 'createLinearGradient') return () => ({addColorStop() {}});
    return (...args) => {
      for (const value of args) if (typeof value === 'number') expect(Number.isFinite(value)).toBe(true);
      if (key === 'save') depth++;
      if (key === 'restore') {depth--; expect(depth).toBeGreaterThanOrEqual(0);}
      calls.push([key, ...args]);
    };
  }});
  return {ctx, calls, depth: () => depth};
}
describe('illustrated butterflies', () => {
  for (const draw of [drawIllustratedButterfly]) {
    it(`${draw.name} preserves the particle and balances finite canvas geometry`, () => {
      const c = canvas(); const p = {x: 100, y: 100, size: 30, opacity: 0.8, alpha: 0.8, time: 600, vx: -1};
      const before = structuredClone(p); draw(c.ctx, p, 600);
      expect(c.calls.length).toBeGreaterThan(0); expect(c.depth()).toBe(0); expect(p).toEqual(before);
    });
    it.each([0, NaN, -1])(`${draw.name} ignores invalid size %s`, size => {
      const c = canvas(); draw(c.ctx, {x: 10, y: 10, size}, 500); expect(c.calls).toEqual([]);
    });
  }
});
