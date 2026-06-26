// src/effects.test.js
import {describe, expect, it, vi, beforeEach, afterEach} from 'vitest';
import {resolvePalette, EFFECT_PALETTES} from './effects.js';

describe('Domma.effects — resolvePalette', () => {
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

describe('Domma.effects — butterflies guards', () => {
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

describe('Domma.effects — strobe presets', () => {
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

describe('Domma.effects — strobe guards', () => {
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

describe('Domma.effects — default export', () => {
  it('exposes butterflies and strobe on the default export', () => {
    expect(typeof effectsDefault.butterflies).toBe('function');
    expect(typeof effectsDefault.strobe).toBe('function');
  });
});
