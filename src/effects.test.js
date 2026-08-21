// src/effects.test.js
import {describe, expect, it, vi, beforeEach, afterEach} from 'vitest';
import {resolvePalette, EFFECT_PALETTES, parseWait} from './effects.js';

describe('Domma.effects - resolvePalette', () => {
  it('returns a named preset palette as an array', () => {
    expect(Array.isArray(resolvePalette('meadow'))).toBe(true);
    expect(resolvePalette('meadow').length).toBeGreaterThan(0);
  });

  it('returns a custom colour array unchanged', () => {
    const custom = ['#111', '#222'];
    expect(resolvePalette(custom)).toEqual(custom);
  });

  it('falls back to rainbow on an unknown name and warns', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    expect(resolvePalette('not-a-palette')).toEqual(EFFECT_PALETTES.rainbow);
    expect(warn).toHaveBeenCalled();
    warn.mockRestore();
  });

  it("resolves 'theme' to a non-empty array (rainbow fallback when CSS vars absent)", () => {
    const result = resolvePalette('theme');
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBeGreaterThan(0);
  });

  it('defines the four sibling-effect palettes', () => {
    for (const name of ['meadow', 'firefly', 'aqua', 'autumn']) {
      expect(EFFECT_PALETTES[name]).toBeDefined();
      expect(EFFECT_PALETTES[name].length).toBeGreaterThan(0);
    }
  });
});

import {butterflies} from './effects.js';

function mockMatchMedia(reduced) {
  window.matchMedia = vi.fn().mockImplementation(query => ({
    matches: reduced,
    media: query,
    addEventListener: () => {},
    removeEventListener: () => {},
    addListener: () => {},
    removeListener: () => {},
    dispatchEvent: () => false
  }));
}

describe('Domma.effects - butterflies guards', () => {
  beforeEach(() => { document.body.innerHTML = ''; });

  it('returns a noop control under prefers-reduced-motion', () => {
    mockMatchMedia(true);
    const ctrl = butterflies(null);
    expect(ctrl).not.toBeNull();
    expect(ctrl.isRunning()).toBe(false);
    expect(typeof ctrl.destroy).toBe('function');
  });

  it('returns null when a container selector matches nothing', () => {
    mockMatchMedia(false);
    const ctrl = butterflies('#nope-not-here');
    expect(ctrl).toBeNull();
  });
});

import {strobe} from './effects.js';
import {resolveStrobePreset, STROBE_PRESETS} from './effects.js';

describe('Domma.effects - strobe presets', () => {
  it('exposes the named lighting presets', () => {
    for (const n of ['club', 'concert', 'police', 'searchlight', 'scanner', 'mood']) {
      expect(STROBE_PRESETS[n]).toBeDefined();
    }
  });

  it('resolves a known preset to its option bundle', () => {
    const club = resolveStrobePreset('club');
    expect(Array.isArray(club.origins)).toBe(true);
    expect(club.motion).toBe('sweep');
  });

  it('falls back to club on an unknown preset and warns', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    expect(resolveStrobePreset('not-a-preset')).toEqual(STROBE_PRESETS.club);
    expect(warn).toHaveBeenCalled();
    warn.mockRestore();
  });
});

describe('Domma.effects - strobe guards', () => {
  beforeEach(() => { document.body.innerHTML = ''; });

  it('returns a noop control under prefers-reduced-motion', () => {
    mockMatchMedia(true);
    const ctrl = strobe(null);
    expect(ctrl.isRunning()).toBe(false);
    expect(typeof ctrl.destroy).toBe('function');
  });

  it('returns null when a container selector matches nothing', () => {
    mockMatchMedia(false);
    expect(strobe('#missing')).toBeNull();
  });
});

import effectsDefault from './effects.js';

describe('Domma.effects - default export', () => {
  it('exposes butterflies and strobe on the default export', () => {
    expect(typeof effectsDefault.butterflies).toBe('function');
    expect(typeof effectsDefault.strobe).toBe('function');
  });
});

describe('Domma.effects - parseWait', () => {
  it('parses seconds', () => {
    expect(parseWait('2s')).toBe(2000);
    expect(parseWait('0.5s')).toBe(500);
  });

  it('parses milliseconds', () => {
    // Regression: 'ms' also ends with 's', so an endsWith('s') test that runs
    // first swallows it and multiplies by 1000 - a '300ms' wait became five
    // minutes. Reported in the v0.25.2 notes and unfixed until v0.33.1.
    expect(parseWait('300ms')).toBe(300);
    expect(parseWait('50ms')).toBe(50);
    expect(parseWait('1500ms')).toBe(1500);
  });

  it('passes a raw number straight through', () => {
    expect(parseWait(750)).toBe(750);
    expect(parseWait(0)).toBe(0);
  });

  it('returns 0 for anything it cannot read', () => {
    expect(parseWait('soon')).toBe(0);
    expect(parseWait('')).toBe(0);
    expect(parseWait(null)).toBe(0);
    expect(parseWait(undefined)).toBe(0);
    expect(parseWait({})).toBe(0);
  });
});
