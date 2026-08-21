# Butterflies & Strobe Effects Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add two new `Domma.effects` - `butterflies()` (canvas particle effect, wander-and-rise with flapping wings) and `strobe()` (flash overlay) - with full showcase, docs, IDE intelligence, and pre-specified domma-cms groundwork.

**Architecture:** `butterflies` clones the existing `tickerTape` canvas-particle lifecycle (full-page vs container, `requestAnimationFrame` loop, standard control object), differing only in three particle functions and defaults. `strobe` is a separate, simpler overlay-div effect driven by `setInterval`. A shared `resolvePalette` (generalised from `resolveTickerPalette`) serves both the new `meadow` palette and three palettes reserved for later sibling effects.

**Tech Stack:** Vanilla ES modules, HTML Canvas 2D, vitest + jsdom for unit tests, manual browser verification for animation. British English throughout.

**Project rule - commits:** Per Darryl's standing rule, **the executor stages changes (`git add`) at each checkpoint but never runs `git commit`**. "Step: Stage" replaces the usual commit step. Do not commit; do not ask to commit.

**Reference source (read before starting):**
- `src/effects.js:2193-2539` - the entire `tickerTape` implementation + `resolveTickerPalette`. Butterflies mirrors its scaffold.
- `src/effects.js:943-957` - `noopControl()`.
- `public/showcase/effects/ticker-tape.html` - the showcase template to clone (note especially its palette-swatch injection at `:561-577`, including the documented sanitiser-bypass option and its rationale comment - reuse that exact approach).
- `docs/superpowers/specs/2026-06-26-butterflies-effect-design.md` - the approved spec.

---

## File Structure

| File | Responsibility | Action |
|---|---|---|
| `src/effects.js` | `resolvePalette` + palettes; `butterflies`; `strobe`; default-export wiring | Modify |
| `src/effects.test.js` | Unit tests for the testable surface | Create |
| `public/showcase/effects/butterflies.html` | Butterflies showcase (ticker-tape clone) | Create |
| `public/showcase/effects/strobe.html` | Strobe showcase (trimmed + safety) | Create |
| `public/showcase/effects/index.html` | Hub cards | Modify |
| `public/showcase/effects/javascript.html` | Overview list + use cases | Modify |
| `public/layouts/config/nav-showcase.json` | Nav entries | Modify |
| `public/sitemap.xml` | URL entries | Modify |
| `public/assets/ide/phpstorm/effects.d.ts` | Type defs | Modify |
| `public/showcase/effects/CLAUDE.md` | Effect-list docs | Modify |
| `src/CLAUDE.md`, `CLAUDE.md` | Effects-reference lines | Modify |

---

## Task 1: Generalise the palette resolver + add new palettes

**Files:**
- Modify: `src/effects.js` (around `:2490-2539`, the `TICKER_PALETTES` / `resolveTickerPalette` block)
- Test: `src/effects.test.js` (create)

- [ ] **Step 1: Write the failing test**

Create `src/effects.test.js`:

```js
// src/effects.test.js
import {describe, expect, it, vi, beforeEach, afterEach} from 'vitest';
import {resolvePalette, EFFECT_PALETTES} from './effects.js';

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
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npx vitest run src/effects.test.js -t resolvePalette`
Expected: FAIL - `resolvePalette` / `EFFECT_PALETTES` are not exported.

- [ ] **Step 3: Implement the refactor**

In `src/effects.js`, replace the `const TICKER_PALETTES = {...}` declaration with an exported, extended map, and rename the resolver. Find:

```js
const TICKER_PALETTES = {
  rainbow:  ['#ef4444', '#f97316', '#facc15', '#22c55e', '#0ea5e9', '#6366f1', '#a855f7', '#ec4899'],
```

Replace the whole `TICKER_PALETTES` object literal with an exported `EFFECT_PALETTES`, adding the four new palettes after `bridal`:

```js
export const EFFECT_PALETTES = {
  rainbow:  ['#ef4444', '#f97316', '#facc15', '#22c55e', '#0ea5e9', '#6366f1', '#a855f7', '#ec4899'],
  festive:  ['#dc2626', '#16a34a', '#fbbf24', '#3b82f6', '#a855f7', '#ec4899'],
  gold:     ['#fbbf24', '#f59e0b', '#fde68a', '#fffbeb', '#d97706', '#fcd34d'],
  silver:   ['#e5e7eb', '#cbd5e1', '#94a3b8', '#f8fafc', '#9ca3af', '#d1d5db'],
  pastel:   ['#fbcfe8', '#bae6fd', '#bbf7d0', '#fef3c7', '#ddd6fe', '#fed7aa'],
  mono:     ['#1f2937', '#4b5563', '#9ca3af', '#d1d5db', '#f3f4f6'],
  sunset:   ['#f43f5e', '#fb923c', '#facc15', '#f59e0b', '#ec4899'],
  ocean:    ['#0ea5e9', '#22d3ee', '#06b6d4', '#3b82f6', '#6366f1'],
  forest:   ['#16a34a', '#65a30d', '#84cc16', '#22c55e', '#15803d'],
  bridal:   ['#ffffff', '#fef3c7', '#fce7f3', '#fbcfe8', '#f9a8d4'],
  meadow:   ['#84cc16', '#a3e635', '#bbf7d0', '#bae6fd', '#fef08a', '#ddd6fe'],
  firefly:  ['#fde68a', '#facc15', '#f59e0b', '#a3e635', '#fef9c3'],
  aqua:     ['#a5f3fc', '#67e8f9', '#22d3ee', '#bae6fd', '#e0f2fe'],
  autumn:   ['#b45309', '#d97706', '#f59e0b', '#ca8a04', '#92400e', '#dc2626']
};
```

Then change `function resolveTickerPalette(spec) { ... }` to an exported declaration named `resolvePalette`, using `EFFECT_PALETTES`, and add a back-compat alias. Replace the whole existing resolver block with:

```js
/**
 * Resolve a palette specifier into an array of CSS colour strings.
 * - Named keys ('meadow', 'rainbow', …) → preset palette.
 * - 'theme' → reads CSS custom properties from the active Domma theme.
 * - Array → returned as-is.
 *
 * @param {string|string[]} spec
 * @returns {string[]}
 */
export function resolvePalette(spec) {
  if (Array.isArray(spec) && spec.length > 0) {
    return spec;
  }
  if (typeof spec === 'string' && EFFECT_PALETTES[spec]) {
    return EFFECT_PALETTES[spec];
  }
  if (spec === 'theme' || !spec) {
    const root = document.documentElement;
    const styles = getComputedStyle(root);
    const vars = ['--dm-primary', '--dm-secondary', '--dm-success', '--dm-warning', '--dm-danger', '--dm-info'];
    const resolved = vars
      .map(name => styles.getPropertyValue(name).trim())
      .filter(value => value && value !== 'transparent');
    if (resolved.length > 0) return resolved;
    return EFFECT_PALETTES.rainbow;
  }
  console.warn(`[Domma.effects] Unknown palette '${spec}', using rainbow.`);
  return EFFECT_PALETTES.rainbow;
}

// Back-compat alias - tickerTape still calls resolveTickerPalette internally.
const resolveTickerPalette = resolvePalette;
```

Note: `tickerTape` at `src/effects.js:2236` calls `resolveTickerPalette(opts.palette)` - leave that call site unchanged; the alias keeps it working.

- [ ] **Step 4: Run the test to verify it passes**

Run: `npx vitest run src/effects.test.js -t resolvePalette`
Expected: PASS (5 tests).

- [ ] **Step 5: Stage**

```bash
git add src/effects.js src/effects.test.js
```

---

## Task 2: `butterflies()` - guard paths (TDD)

**Files:**
- Modify: `src/effects.js` (add `butterflies` after `tickerTape`, before the palette block)
- Test: `src/effects.test.js`

- [ ] **Step 1: Write the failing tests**

Append to `src/effects.test.js`:

```js
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
```

- [ ] **Step 2: Run to verify it fails**

Run: `npx vitest run src/effects.test.js -t "butterflies guards"`
Expected: FAIL - `butterflies` is not exported.

- [ ] **Step 3: Add the `butterflies` function**

In `src/effects.js`, immediately AFTER the closing brace of `tickerTape` (just before the `// ── Ticker tape palette resolution ──` comment at `:2490`), insert the full function below:

```js
/**
 * Butterflies effect - procedurally drawn butterflies wander and rise with
 * flapping wings. Pass `null` (or omit the selector) for a full-page fixed
 * overlay, or a selector to scope them inside a container.
 *
 * @param {string|Element|NodeList|HTMLElement[]|null} selector
 * @param {Object} options
 * @param {string|string[]} [options.palette='meadow']
 * @param {number} [options.density=18] - Target butterflies on screen at once
 * @param {number} [options.speed=1] - Global speed multiplier
 * @param {number} [options.wander=1] - Steering erraticness
 * @param {number} [options.riseSpeed=0.4] - Upward drift bias
 * @param {number} [options.flapSpeed=1] - Wingbeat rate multiplier
 * @param {number} [options.minSize=14] - Minimum wingspan in pixels
 * @param {number} [options.maxSize=26] - Maximum wingspan in pixels
 * @param {boolean} [options.twoTone=true] - Use two palette colours per butterfly
 * @param {boolean} [options.burst=false] - Release one batch then settle
 * @param {number} [options.burstCount=40] - Butterflies released in burst mode
 * @param {number} [options.zIndex=1]
 * @param {boolean} [options.respectMotionPreference=true]
 *
 * @example
 * Domma.effects.butterflies(null);                       // full-page meadow
 * Domma.effects.butterflies('#hero', { palette: 'pastel', density: 24 });
 * Domma.effects.butterflies('#card', { burst: true, burstCount: 30 });
 */
export function butterflies(selector, options = {}) {
  const defaults = {
    palette: 'meadow',
    density: 18,
    speed: 1,
    wander: 1,
    riseSpeed: 0.4,
    flapSpeed: 1,
    minSize: 14,
    maxSize: 26,
    twoTone: true,
    burst: false,
    burstCount: 40,
    zIndex: 1,
    respectMotionPreference: true
  };

  const opts = { ...defaults, ...options };

  if (opts.respectMotionPreference &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    console.log('[Domma.effects.butterflies] Disabled due to prefers-reduced-motion');
    return noopControl();
  }

  const isFullPage = !selector || selector === 'body' || selector === document.body;

  let containers = [];
  if (!isFullPage) {
    if (typeof selector === 'string') {
      containers = Array.from(document.querySelectorAll(selector));
    } else if (selector instanceof Element) {
      containers = [selector];
    } else if (selector instanceof NodeList || Array.isArray(selector)) {
      containers = Array.from(selector);
    }
    if (containers.length === 0) {
      console.warn('[Domma.effects.butterflies] No elements found for selector:', selector);
      return null;
    }
  }

  const colours = resolvePalette(opts.palette);

  let running = false;
  let paused = false;
  let animationFrame = null;
  const instanceId = `domma-butterflies-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  const canvases = [];
  let resizeObserver = null;

  // ── Particle (butterfly) ──────────────────────────────────────────────────

  function createButterfly(w, h) {
    const size = opts.minSize + Math.random() * (opts.maxSize - opts.minSize);
    const edge = Math.random();
    let x, y;
    if (edge < 0.6) { x = Math.random() * w; y = h + size; }                 // bottom
    else if (edge < 0.8) { x = -size; y = h * (0.4 + Math.random() * 0.6); } // lower-left
    else { x = w + size; y = h * (0.4 + Math.random() * 0.6); }              // lower-right
    const heading = -Math.PI / 2 + (Math.random() - 0.5) * 1.2;              // roughly upward
    const upper = colours[Math.floor(Math.random() * colours.length)];
    const lower = opts.twoTone ? colours[Math.floor(Math.random() * colours.length)] : upper;
    return {
      x, y, heading,
      targetHeading: heading,
      speed: 0.6 + Math.random() * 0.8,
      wanderTimer: Math.random() * 60,
      flapPhase: Math.random() * Math.PI * 2,
      flapSpeed: (0.18 + Math.random() * 0.12) * opts.flapSpeed,
      size,
      colourUpper: upper,
      colourLower: lower,
      alpha: 1,
      alive: true
    };
  }

  // DEFAULT flight core - Darryl will tweak these constants.
  function updateButterfly(b, w, h) {
    b.wanderTimer -= 1;
    if (b.wanderTimer <= 0) {
      b.targetHeading = -Math.PI / 2 + (Math.random() - 0.5) * (1.4 * opts.wander);
      b.wanderTimer = 30 + Math.random() * (60 / Math.max(0.2, opts.wander));
    }
    let diff = b.targetHeading - b.heading;
    while (diff > Math.PI) diff -= Math.PI * 2;
    while (diff < -Math.PI) diff += Math.PI * 2;
    b.heading += diff * 0.05 * opts.wander;

    const v = b.speed * opts.speed;
    b.x += Math.cos(b.heading) * v + Math.sin(b.flapPhase) * 0.3;
    b.y += Math.sin(b.heading) * v - opts.riseSpeed * opts.speed;
    b.flapPhase += b.flapSpeed;

    if (b.y + b.size < 0 || b.x < -b.size * 3 || b.x > w + b.size * 3) {
      b.alive = false;
    }
  }

  function drawButterfly(ctx, b) {
    const spread = Math.abs(Math.sin(b.flapPhase));     // 0 = edge-on, 1 = open
    const wingW = (b.size * (0.25 + spread * 0.75)) / 2;
    const wingH = b.size * 0.6;
    ctx.save();
    ctx.globalAlpha = b.alpha;
    ctx.translate(b.x, b.y);
    ctx.rotate(b.heading + Math.PI / 2);
    ctx.fillStyle = b.colourUpper;
    ctx.beginPath();
    ctx.ellipse(-wingW, -wingH * 0.3, wingW, wingH * 0.6, 0, 0, Math.PI * 2);
    ctx.ellipse(wingW, -wingH * 0.3, wingW, wingH * 0.6, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = b.colourLower;
    ctx.beginPath();
    ctx.ellipse(-wingW * 0.85, wingH * 0.35, wingW * 0.8, wingH * 0.5, 0, 0, Math.PI * 2);
    ctx.ellipse(wingW * 0.85, wingH * 0.35, wingW * 0.8, wingH * 0.5, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = 'rgba(40,30,30,0.8)';
    ctx.lineWidth = Math.max(1, b.size * 0.06);
    ctx.beginPath();
    ctx.moveTo(0, -wingH * 0.7);
    ctx.lineTo(0, wingH * 0.7);
    ctx.stroke();
    ctx.restore();
  }

  // ── Canvas setup (mirrors tickerTape) ─────────────────────────────────────

  function createCanvas(container, isFixed) {
    const canvas = document.createElement('canvas');
    canvas.id = instanceId + (canvases.length > 0 ? `-${canvases.length}` : '');
    canvas.setAttribute('data-domma-effect', 'butterflies');
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = opts.zIndex;

    if (isFixed) {
      canvas.style.position = 'fixed';
      canvas.style.top = '0';
      canvas.style.left = '0';
      canvas.style.width = '100%';
      canvas.style.height = '100%';
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      document.body.appendChild(canvas);
    } else {
      if (window.getComputedStyle(container).position === 'static') {
        container.style.position = 'relative';
      }
      canvas.style.position = 'absolute';
      canvas.style.top = '0';
      canvas.style.left = '0';
      canvas.style.width = '100%';
      canvas.style.height = '100%';
      canvas.width = container.offsetWidth || container.getBoundingClientRect().width;
      canvas.height = container.offsetHeight || container.getBoundingClientRect().height;
      container.appendChild(canvas);
    }

    const ctx = canvas.getContext('2d');
    return { canvas, ctx, particles: [], container, burstFired: false };
  }

  function seedParticles(entry) {
    entry.particles = [];
    if (opts.burst) {
      for (let i = 0; i < opts.burstCount; i++) {
        entry.particles.push(createButterfly(entry.canvas.width, entry.canvas.height));
      }
      entry.burstFired = true;
    } else {
      const initial = Math.floor(opts.density * 0.5);
      for (let i = 0; i < initial; i++) {
        entry.particles.push(createButterfly(entry.canvas.width, entry.canvas.height));
      }
    }
  }

  function resizeCanvas(entry) {
    if (entry.isFixed) {
      entry.canvas.width = window.innerWidth;
      entry.canvas.height = window.innerHeight;
    } else {
      const rect = entry.container.getBoundingClientRect();
      entry.canvas.width = rect.width || entry.container.offsetWidth;
      entry.canvas.height = rect.height || entry.container.offsetHeight;
    }
  }

  // ── Initialise ────────────────────────────────────────────────────────────

  if (isFullPage) {
    const entry = createCanvas(document.body, true);
    entry.isFixed = true;
    seedParticles(entry);
    canvases.push(entry);
    const onWindowResize = () => canvases.forEach(e => resizeCanvas(e));
    window.addEventListener('resize', onWindowResize);
    canvases[0]._resizeHandler = onWindowResize;
  } else {
    containers.forEach(container => {
      const entry = createCanvas(container, false);
      entry.isFixed = false;
      seedParticles(entry);
      canvases.push(entry);
    });
    if (typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver(() => canvases.forEach(e => resizeCanvas(e)));
      containers.forEach(c => resizeObserver.observe(c));
    }
  }

  // ── Animation loop ────────────────────────────────────────────────────────

  function animate() {
    if (!running || paused) return;
    canvases.forEach(entry => {
      const { canvas, ctx, particles } = entry;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        updateButterfly(p, canvas.width, canvas.height);
        if (p.alive) {
          drawButterfly(ctx, p);
        } else {
          particles.splice(i, 1);
        }
      }
      if (!opts.burst) {
        while (particles.length < opts.density && Math.random() < 0.3) {
          particles.push(createButterfly(canvas.width, canvas.height));
        }
      }
    });
    animationFrame = requestAnimationFrame(animate);
  }

  function startAnimation() {
    if (running) return;
    running = true;
    paused = false;
    animate();
  }

  startAnimation();
  console.log(`[Domma.effects.butterflies] Initialised (${isFullPage ? 'full-page' : 'container'} mode, palette: ${Array.isArray(opts.palette) ? 'custom' : opts.palette})`);

  return {
    pause() {
      if (!running || paused) return;
      paused = true;
      if (animationFrame) { cancelAnimationFrame(animationFrame); animationFrame = null; }
    },
    resume() {
      if (!running || !paused) return;
      paused = false;
      animate();
    },
    stop() {
      running = false;
      paused = false;
      if (animationFrame) { cancelAnimationFrame(animationFrame); animationFrame = null; }
    },
    restart() {
      this.stop();
      canvases.forEach(e => seedParticles(e));
      startAnimation();
    },
    destroy() {
      this.stop();
      if (isFullPage && canvases[0]?._resizeHandler) {
        window.removeEventListener('resize', canvases[0]._resizeHandler);
      }
      if (resizeObserver) { resizeObserver.disconnect(); resizeObserver = null; }
      canvases.forEach(({ canvas }) => {
        if (canvas && canvas.parentNode) canvas.parentNode.removeChild(canvas);
      });
      canvases.length = 0;
    },
    isRunning() { return running && !paused; },
    isPaused() { return running && paused; }
  };
}
```

- [ ] **Step 4: Run to verify it passes**

Run: `npx vitest run src/effects.test.js -t "butterflies guards"`
Expected: PASS (2 tests). The reduced-motion test returns before any canvas; the missing-selector test returns `null` before any canvas. Neither touches `getContext`.

- [ ] **Step 5: Stage**

```bash
git add src/effects.js src/effects.test.js
```

---

## Task 3: `strobe()` (TDD - fully testable)

**Files:**
- Modify: `src/effects.js` (add `strobe` after `butterflies`)
- Test: `src/effects.test.js`

- [ ] **Step 1: Write the failing tests**

Append to `src/effects.test.js`:

```js
import {strobe} from './effects.js';

describe('Domma.effects - strobe', () => {
  beforeEach(() => { document.body.innerHTML = ''; vi.useFakeTimers(); });
  afterEach(() => { vi.useRealTimers(); });

  it('returns a noop control under prefers-reduced-motion', () => {
    mockMatchMedia(true);
    const ctrl = strobe(null);
    expect(ctrl.isRunning()).toBe(false);
    expect(document.querySelector('[data-domma-effect="strobe"]')).toBeNull();
  });

  it('creates a full-page overlay and exposes the control object', () => {
    mockMatchMedia(false);
    const ctrl = strobe(null, { hz: 2 });
    const overlay = document.querySelector('[data-domma-effect="strobe"]');
    expect(overlay).not.toBeNull();
    expect(overlay.style.position).toBe('fixed');
    expect(ctrl.isRunning()).toBe(true);
    ctrl.destroy();
    expect(document.querySelector('[data-domma-effect="strobe"]')).toBeNull();
  });

  it('warns when hz exceeds 5 but does not clamp', () => {
    mockMatchMedia(false);
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const ctrl = strobe(null, { hz: 12 });
    expect(warn).toHaveBeenCalled();
    expect(ctrl.isRunning()).toBe(true);   // not disabled - flexibility by design
    ctrl.destroy();
    warn.mockRestore();
  });

  it('returns null when a container selector matches nothing', () => {
    mockMatchMedia(false);
    expect(strobe('#missing')).toBeNull();
  });
});
```

- [ ] **Step 2: Run to verify it fails**

Run: `npx vitest run src/effects.test.js -t strobe`
Expected: FAIL - `strobe` is not exported.

- [ ] **Step 3: Implement `strobe`**

In `src/effects.js`, immediately after the `butterflies` function's closing brace, insert:

```js
/**
 * Strobe effect - a full-page or container overlay whose background flashes
 * between colours on a timed interval. Pass `null` for a fixed full-page
 * overlay, or a selector for a container-scoped flash.
 *
 * Safety: disabled entirely under prefers-reduced-motion. Frequency is NOT
 * clamped (caller's responsibility) but a console warning fires above 5 Hz,
 * since rapid flashing can trigger photosensitive seizures.
 *
 * @param {string|Element|null} selector
 * @param {Object} options
 * @param {string[]} [options.colours=['#ffffff','transparent']] - Colours cycled each flash
 * @param {number} [options.hz=2] - Flashes per second (uncapped; warns above 5)
 * @param {number|null} [options.duration=null] - Auto-stop after N ms
 * @param {number} [options.opacity=1]
 * @param {number} [options.zIndex=9999]
 * @param {boolean} [options.respectMotionPreference=true]
 *
 * @example
 * const s = Domma.effects.strobe(null, { hz: 3, colours: ['#fff', '#000'] });
 * s.stop();
 */
export function strobe(selector, options = {}) {
  const defaults = {
    colours: ['#ffffff', 'transparent'],
    hz: 2,
    duration: null,
    opacity: 1,
    zIndex: 9999,
    respectMotionPreference: true
  };
  const opts = { ...defaults, ...options };

  if (opts.respectMotionPreference &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    console.log('[Domma.effects.strobe] Disabled due to prefers-reduced-motion');
    return noopControl();
  }

  if (opts.hz > 5) {
    console.warn(`[Domma.effects.strobe] hz=${opts.hz} exceeds 5Hz - rapid flashing can trigger photosensitive seizures.`);
  }

  const isFullPage = !selector || selector === 'body' || selector === document.body;
  let host = null;
  if (!isFullPage) {
    host = typeof selector === 'string'
      ? document.querySelector(selector)
      : (selector instanceof Element ? selector : null);
    if (!host) {
      console.warn('[Domma.effects.strobe] No element found for selector:', selector);
      return null;
    }
  }

  const overlay = document.createElement('div');
  overlay.setAttribute('data-domma-effect', 'strobe');
  overlay.style.pointerEvents = 'none';
  overlay.style.zIndex = opts.zIndex;
  overlay.style.opacity = opts.opacity;
  overlay.style.background = 'transparent';
  if (isFullPage) {
    overlay.style.position = 'fixed';
    overlay.style.inset = '0';
    document.body.appendChild(overlay);
  } else {
    if (window.getComputedStyle(host).position === 'static') {
      host.style.position = 'relative';
    }
    overlay.style.position = 'absolute';
    overlay.style.inset = '0';
    host.appendChild(overlay);
  }

  const period = 1000 / Math.max(0.1, opts.hz);
  let running = false;
  let paused = false;
  let intervalId = null;
  let stopTimer = null;
  let idx = 0;

  function tick() {
    overlay.style.background = opts.colours[idx % opts.colours.length];
    idx += 1;
  }

  function startLoop() {
    running = true;
    paused = false;
    intervalId = setInterval(tick, period);
    if (opts.duration) {
      stopTimer = setTimeout(() => api.stop(), opts.duration);
    }
  }

  const api = {
    pause() {
      if (!running || paused) return;
      paused = true;
      if (intervalId) { clearInterval(intervalId); intervalId = null; }
    },
    resume() {
      if (!running || !paused) return;
      paused = false;
      intervalId = setInterval(tick, period);
    },
    stop() {
      running = false;
      paused = false;
      if (intervalId) { clearInterval(intervalId); intervalId = null; }
      if (stopTimer) { clearTimeout(stopTimer); stopTimer = null; }
      overlay.style.background = 'transparent';
    },
    restart() {
      this.stop();
      idx = 0;
      startLoop();
    },
    destroy() {
      this.stop();
      if (overlay.parentNode) overlay.parentNode.removeChild(overlay);
    },
    isRunning() { return running && !paused; },
    isPaused() { return running && paused; }
  };

  startLoop();
  return api;
}
```

- [ ] **Step 4: Run to verify it passes**

Run: `npx vitest run src/effects.test.js -t strobe`
Expected: PASS (4 tests).

- [ ] **Step 5: Stage**

```bash
git add src/effects.js src/effects.test.js
```

---

## Task 4: Wire both into the default export

**Files:**
- Modify: `src/effects.js` (the `export default { … }` at `:2542-2553`)

- [ ] **Step 1: Write the failing test**

Append to `src/effects.test.js`:

```js
import effectsDefault from './effects.js';

describe('Domma.effects - default export', () => {
  it('exposes butterflies and strobe on the default export', () => {
    expect(typeof effectsDefault.butterflies).toBe('function');
    expect(typeof effectsDefault.strobe).toBe('function');
  });
});
```

- [ ] **Step 2: Run to verify it fails**

Run: `npx vitest run src/effects.test.js -t "default export"`
Expected: FAIL - `effectsDefault.butterflies` is undefined.

- [ ] **Step 3: Update the default export**

In `src/effects.js`, change the default export object (currently ending `twinkle, tickerTape`) to:

```js
export default {
  breathe,
  pulse,
  scribe,
  reveal,
  scramble,
  counter,
  ripple,
  shake,
  twinkle,
  tickerTape,
  butterflies,
  strobe
};
```

- [ ] **Step 4: Run the whole effects test file**

Run: `npx vitest run src/effects.test.js`
Expected: PASS (all suites: resolvePalette 5, butterflies guards 2, strobe 4, default export 1 = 12 tests).

- [ ] **Step 5: Stage**

```bash
git add src/effects.js src/effects.test.js
```

---

## Task 5: Build the bundles

**Files:** none edited - regenerates `public/dist/`.

- [ ] **Step 1: Build**

Run: `npm run build`
Expected: completes without error; `public/dist/domma.min.js` and `public/dist/domma.esm.js` updated. (If a full build is slow, `npx rollup -c` regenerates the JS bundles specifically.)

- [ ] **Step 2: Smoke-check the bundle exports the new effects**

Run: `grep -c "butterflies" public/dist/domma.esm.js`
Expected: a non-zero count.

- [ ] **Step 3: Stage**

```bash
git add public/dist
```

---

## Task 6: Butterflies showcase page

**Files:**
- Create: `public/showcase/effects/butterflies.html`

- [ ] **Step 1: Create the page**

Clone `public/showcase/effects/ticker-tape.html` and adapt. The page MUST keep: `<body class="dm-cloaked" data-layout="showcase" data-layout-variant="effects">`; the four dist CSS includes + `../css/domma-showcase.css`; the script order `dompurify → domma.min.js → domma-syntax.min.js → layouts/js/layout.js (module)`; the reduced-motion notice; `respectMotionPreference: false` in every demo; the palette-swatch injection done **exactly as ticker-tape does it** (`ticker-tape.html:561-577` - reuse that helper and the same `html()` option + rationale comment verbatim; the colours are static developer-authored constants); `Domma.icons.scan(document.body)` at the end; British English.

Replace ticker-tape specifics with butterflies. Required sections, in order:

1. **Hero** - title "Butterflies Effect", subtitle describing wander-and-rise flapping butterflies.
2. **See Also** strip - link to `javascript.html`, `ticker-tape.html`, `twinkle.html`, `strobe.html`, plus existing siblings.
3. **Reduced-motion notice** - copy verbatim from ticker-tape.
4. **Overview card** - `Domma.effects.butterflies()` heading; intro prose; quick-start `<pre class="code-block language-javascript">` with the three examples from the JSDoc in Task 2; the Options table (all 13 options from the Task 2 table); a palette preview strip (`#palette-preview`).
5. **How It Works** card (`<section class="card mb-6" data-section="how-it-works">`) - short prose: spawn low/sides → periodically retarget heading (biased upward) → ease toward it → flap wings via `sin(flapPhase)` → drift off the top. This raises the bar above existing effect pages.
6. **Demo 1: Theme/Meadow palette** - `#butterfly-container-1`, start/pause/resume/restart/destroy + status badge.
7. **Demo 2: Palette picker** - `#palette-picker` + `#butterfly-container-2`. Restrict the picker to `theme, meadow, pastel, rainbow, sunset` plus a custom example.
8. **Demo 3: Tune the flight** - sliders `density (5-60), speed (0.2-3), wander (0.2-3), riseSpeed (0-2), flapSpeed (0.2-3)` + Apply/Destroy.
9. **Demo 4: One-shot release** - `burst: true` "Release a flutter" button.
10. **Demo 5: Full-page overlay** - `null` selector, with `beforeunload` cleanup.
11. **Use Cases** card - bulleted: success/celebration moments, ambient hero backdrops, empty-state delight, seasonal/spring theming.

Reuse the entire `<style>` block from ticker-tape unchanged EXCEPT rename `.tape-container*` → `.butterfly-container*` and set its background to a soft daytime gradient, e.g.:

```css
.butterfly-container {
    position: relative;
    min-height: 320px;
    background: linear-gradient(180deg, #dff1ff 0%, #eafbe7 100%);
    border-radius: 12px;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
}
.butterfly-container-label {
    position: relative; z-index: 10;
    color: rgba(30, 50, 40, 0.85);
    font-size: 1.1rem; font-weight: 500; text-align: center;
    pointer-events: none; text-shadow: 0 1px 4px rgba(255,255,255,0.6);
}
```

In the script block, define the `palettes` object limited to the butterfly-relevant set:

```js
const palettes = {
  theme:   ['var(--dm-primary)', 'var(--dm-success)', 'var(--dm-warning)', 'var(--dm-danger)', 'var(--dm-info)'],
  meadow:  ['#84cc16', '#a3e635', '#bbf7d0', '#bae6fd', '#fef08a', '#ddd6fe'],
  pastel:  ['#fbcfe8', '#bae6fd', '#bbf7d0', '#fef3c7', '#ddd6fe', '#fed7aa'],
  rainbow: ['#ef4444', '#f97316', '#facc15', '#22c55e', '#0ea5e9', '#6366f1', '#a855f7', '#ec4899'],
  sunset:  ['#f43f5e', '#fb923c', '#facc15', '#f59e0b', '#ec4899']
};
```

Wire all five demos using `Domma.effects.butterflies(...)` mirroring ticker-tape's `ctrl1`…`ctrl5` handlers and the `setStatus` helper (copy that helper verbatim). Demo-3 `applyDemo3()` reads the five sliders into the options object:

```js
ctrl3 = Domma.effects.butterflies('#butterfly-container-3', {
  palette: 'meadow',
  density:   parseInt($('#opt-density').val(), 10),
  speed:     parseFloat($('#opt-speed').val()),
  wander:    parseFloat($('#opt-wander').val()),
  riseSpeed: parseFloat($('#opt-rise').val()),
  flapSpeed: parseFloat($('#opt-flap').val()),
  respectMotionPreference: false
});
```

- [ ] **Step 2: Verify (manual - browser)**

Open `/showcase/effects/butterflies.html` on the running server. Confirm: page loads with header/footer/sidebar (layout system), no console errors, all five demos work (start/pause/resume/restart/destroy, palette swap, sliders+Apply, burst, full-page), butterflies flap and rise, full-page overlay clears on navigation.
**Claude cannot drive a browser - Darryl verifies and reports back.**

- [ ] **Step 3: Stage**

```bash
git add public/showcase/effects/butterflies.html
```

---

## Task 7: Strobe showcase page

**Files:**
- Create: `public/showcase/effects/strobe.html`

- [ ] **Step 1: Create the page**

Start from `butterflies.html`'s shell (same `<head>` includes, `data-layout`, script order, reduced-motion notice, British English) but TRIM - strobe has no palette/particle dimension. Required sections:

1. **Hero** - "Strobe Effect", subtitle noting it flashes the screen/container.
2. **See Also** strip.
3. **Reduced-motion notice** (verbatim).
4. **Photosensitivity warning** - a prominent `<div class="alert alert-danger">` (or the existing warning-callout markup) stating rapid flashing can trigger photosensitive seizures; the demos never autoplay and require a button press.
5. **Overview card** - `Domma.effects.strobe()` heading; prose; quick-start code; Options table (colours, hz, duration, opacity, zIndex, respectMotionPreference).
6. **Demo: Contained flash** - `#strobe-container` with start/pause/resume/stop buttons + status badge; default `hz: 2`.
7. **Demo: Tune it** - controls: `hz (0.5-10 step 0.5)`, two colour `<input type="color">` pickers, optional `duration` number; Apply/Stop. If hz > 5, the console warns (mention this in copy).
8. **Demo: Full-page** - `null` selector behind an explicit "Start Full-Page Strobe" button; `beforeunload` cleanup; a clearly visible Stop button.

No palette swatches needed. Keep `Domma.icons.scan(document.body)` at the end.

- [ ] **Step 2: Verify (manual - browser)**

Open `/showcase/effects/strobe.html`. Confirm layout system present, no console errors, contained + full-page demos start only on button press and stop cleanly, hz>5 logs the warning, reduced-motion (OS setting on) shows the notice and demos noop.
**Darryl verifies in browser.**

- [ ] **Step 3: Stage**

```bash
git add public/showcase/effects/strobe.html
```

---

## Task 8: Effects hub cards (`index.html`)

**Files:**
- Modify: `public/showcase/effects/index.html`

- [ ] **Step 1: Add two hub cards**

After the `ticker-tape.html` card (ends ~`:191`, the `</a>` after its `card-footer`), insert two cards following the exact pattern (icon, title, text, feature bullets, footer code):

```html
    <a href="butterflies.html" class="card card-hover h-full flex flex-col no-underline text-inherit">
      <div class="card-body flex-1">
        <div class="mb-4 text-primary" style="font-size: 2rem;" data-icon="feather"></div>
        <h3 class="card-title">Butterflies</h3>
        <p class="card-text">Procedurally drawn butterflies wander and rise with flapping wings.</p>
        <ul class="list-none p-0 mt-4 feature-list-item-bullet">
          <li>Wander-and-rise flight</li>
          <li>Flapping wings on canvas</li>
          <li>Theme-aware palettes</li>
          <li>Container-scoped or full-page</li>
        </ul>
      </div>
      <div class="card-footer">
        <code>Domma.effects.butterflies(selector, options)</code>
      </div>
    </a>

    <a href="strobe.html" class="card card-hover h-full flex flex-col no-underline text-inherit">
      <div class="card-body flex-1">
        <div class="mb-4 text-primary" style="font-size: 2rem;" data-icon="zap"></div>
        <h3 class="card-title">Strobe</h3>
        <p class="card-text">A timed full-page or container colour flash. Reduced-motion safe.</p>
        <ul class="list-none p-0 mt-4 feature-list-item-bullet">
          <li>Configurable frequency &amp; colours</li>
          <li>Auto-stop duration</li>
          <li>Photosensitivity guard</li>
          <li>Container-scoped or full-page</li>
        </ul>
      </div>
      <div class="card-footer">
        <code>Domma.effects.strobe(selector, options)</code>
      </div>
    </a>
```

Confirm the `data-icon` names exist: run `ls public/assets/icons | grep -E '^(feather|zap)\.svg$'`. If `feather` is absent, substitute an existing nature/wing-like icon (e.g. `wind`) - check `public/assets/icons/` and pick one that exists, per the project rule "check to see if we have one already". If neither a butterfly nor feather icon exists, that is a signal to create one per the icon convention; for this plan, substituting an existing icon is acceptable.

- [ ] **Step 2: Add bullets to the "All JS Effects" overview card**

In the same file, the "All JS Effects" card lists effects (~`:208-209`, `<li>twinkle() …</li>`, `<li>tickerTape() …</li>`). Add:

```html
          <li>butterflies() - wandering butterflies</li>
          <li>strobe() - timed colour flash</li>
```

And append to its footer `<code>` (~`:213`): ` .butterflies() .strobe()`.

- [ ] **Step 3: Verify (manual)**

Open `/showcase/effects/` - two new cards render with icons, links resolve.

- [ ] **Step 4: Stage**

```bash
git add public/showcase/effects/index.html
```

---

## Task 9: JS-effects overview page (`javascript.html`)

**Files:**
- Modify: `public/showcase/effects/javascript.html`

- [ ] **Step 1: Add to the Use Cases section**

Find the "Real-World Use Cases" section (`:309`). Add two `h4` + `ul` blocks following the existing pattern:

```html
            <h4 class="font-semibold mb-2">butterflies()</h4>
            <ul class="list-disc ml-6 mb-4">
                <li>Spring/seasonal landing pages and hero backdrops</li>
                <li>Celebration and success moments (burst mode)</li>
                <li>Empty-state and onboarding delight</li>
                <li>Ambient full-page atmosphere</li>
            </ul>

            <h4 class="font-semibold mb-2">strobe()</h4>
            <ul class="list-disc ml-6 mb-4">
                <li>Alert / emphasis moments (used sparingly)</li>
                <li>Game and arcade UI effects</li>
                <li>Photography/scanning simulations</li>
            </ul>
```

If the page has an effects list/table elsewhere mentioning `twinkle`/`tickerTape`, add `butterflies` and `strobe` rows there too (grep the file for `tickerTape` to locate).

- [ ] **Step 2: Verify (manual)**

Open `/showcase/effects/javascript.html` - new use-case blocks render.

- [ ] **Step 3: Stage**

```bash
git add public/showcase/effects/javascript.html
```

---

## Task 10: Navigation config + sitemap

**Files:**
- Modify: `public/layouts/config/nav-showcase.json`
- Modify: `public/sitemap.xml`

- [ ] **Step 1: Add nav entries**

First READ the `ticker-tape` entry in `public/layouts/config/nav-showcase.json` (~`:432-436`) to learn its exact key names (it may use `label` vs `title`). Then, after that entry, add two entries matching the shape exactly, e.g.:

```json
        {
          "title": "Butterflies",
          "url": "showcase/effects/butterflies.html",
          "section": "effects-butterflies"
        },
        {
          "title": "Strobe",
          "url": "showcase/effects/strobe.html",
          "section": "effects-strobe"
        },
```

(Use the SAME keys the ticker-tape entry uses; mind trailing commas.)

- [ ] **Step 2: Add sitemap entries**

READ the `ticker-tape.html` `<url>` block in `public/sitemap.xml` (~`:337-340`) and mirror its exact child-tag set. After it, add:

```xml
    <url>
        <loc>https://dommajs.org/showcase/effects/butterflies.html</loc>
    </url>
    <url>
        <loc>https://dommajs.org/showcase/effects/strobe.html</loc>
    </url>
```

(Include the same `<changefreq>`/`<priority>`/`<lastmod>` siblings if the ticker-tape entry has them.)

- [ ] **Step 3: Verify**

Run: `node -e "JSON.parse(require('fs').readFileSync('public/layouts/config/nav-showcase.json','utf8')); console.log('json ok')"`
Expected: `json ok`. For the sitemap, run `xmllint --noout public/sitemap.xml && echo 'xml ok'` if `xmllint` is available; otherwise eyeball for balanced tags.

- [ ] **Step 4: Stage**

```bash
git add public/layouts/config/nav-showcase.json public/sitemap.xml
```

---

## Task 11: PHPStorm IDE intelligence

**Files:**
- Modify: `public/assets/ide/phpstorm/effects.d.ts`

- [ ] **Step 1: Add the option interfaces**

After the `TickerTapeOptions` interface (ends ~`:198`), add:

```typescript
export interface ButterfliesOptions {
    /** Named palette or custom array of CSS colour strings (default 'meadow') */
    palette?: TickerTapePalette | string | string[];
    /** Target butterflies on screen at once (default 18) */
    density?: number;
    /** Global speed multiplier (default 1) */
    speed?: number;
    /** Steering erraticness (default 1) */
    wander?: number;
    /** Upward drift bias (default 0.4) */
    riseSpeed?: number;
    /** Wingbeat rate multiplier (default 1) */
    flapSpeed?: number;
    /** Minimum wingspan in pixels (default 14) */
    minSize?: number;
    /** Maximum wingspan in pixels (default 26) */
    maxSize?: number;
    /** Use two palette colours per butterfly (default true) */
    twoTone?: boolean;
    /** Release a single batch then settle (default false) */
    burst?: boolean;
    /** Butterflies released in burst mode (default 40) */
    burstCount?: number;
    /** Canvas stacking order (default 1) */
    zIndex?: number;
    /** Honour prefers-reduced-motion OS setting (default true) */
    respectMotionPreference?: boolean;
}

export interface StrobeOptions {
    /** Colours cycled each flash (default ['#ffffff','transparent']) */
    colours?: string[];
    /** Flashes per second - uncapped; warns above 5 (default 2) */
    hz?: number;
    /** Auto-stop after N milliseconds (default null) */
    duration?: number | null;
    /** Overlay opacity (default 1) */
    opacity?: number;
    /** Stacking order (default 9999) */
    zIndex?: number;
    /** Honour prefers-reduced-motion OS setting (default true) */
    respectMotionPreference?: boolean;
}
```

- [ ] **Step 2: Add the method signatures**

On `interface Effects` (after the `tickerTape(...)` line `:220`), add:

```typescript
    butterflies(selector: Selector | null, options?: ButterfliesOptions): EffectControl | null;
    strobe(selector: Selector | null, options?: StrobeOptions): EffectControl | null;
```

- [ ] **Step 3: Verify**

Run: `grep -c "butterflies\|strobe\|ButterfliesOptions\|StrobeOptions" public/assets/ide/phpstorm/effects.d.ts`
Expected: ≥ 4.

- [ ] **Step 4: Stage**

```bash
git add public/assets/ide/phpstorm/effects.d.ts
```

---

## Task 12: Documentation (three CLAUDE.md surfaces)

**Files:**
- Modify: `public/showcase/effects/CLAUDE.md`
- Modify: `src/CLAUDE.md`
- Modify: `CLAUDE.md` (root)

- [ ] **Step 1: `public/showcase/effects/CLAUDE.md`**

In the "JavaScript Effects" list, after the `tickerTape()` bullet, add:

```markdown
- **butterflies()** - Canvas-based butterflies that wander and rise with flapping wings (full-page overlay or container-scoped). Theme-aware palettes plus a `meadow` preset; continuous and one-shot burst modes.
- **strobe()** - Timed full-page/container colour flash. Reduced-motion safe; frequency uncapped with a console warning above 5 Hz.
```

In the "File Structure" code block, after `ticker-tape.html`, add:

```
├── butterflies.html    # Butterflies effect showcase
├── strobe.html         # Strobe (colour flash) effect showcase
```

- [ ] **Step 2: `src/CLAUDE.md`**

In the `effects.js` section bullet list (after the `tickerTape` bullet), add:

```markdown
- **butterflies**: `effects.butterflies(selector | null, { palette, density, speed, wander, riseSpeed, flapSpeed, minSize, maxSize, twoTone, burst, burstCount, zIndex, respectMotionPreference })` - Canvas-based butterflies that wander and rise with procedurally flapping wings. Pass `null` for a full-page overlay. Palettes: `meadow` (default), `theme`, `pastel`, `rainbow`, `sunset`, or a custom colour array.
- **strobe**: `effects.strobe(selector | null, { colours, hz, duration, opacity, zIndex, respectMotionPreference })` - Timed colour-flash overlay. Disabled under prefers-reduced-motion; `hz` uncapped with a console warning above 5 Hz.
```

- [ ] **Step 3: Root `CLAUDE.md`**

In the `#### Effects (Domma.effects)` reference list, after the `tickerTape()` entry, add:

```markdown
- **butterflies()** - Canvas-based butterflies that wander and rise with flapping wings
  - Modes: full-page overlay (`null` selector) or container-scoped
  - Palettes: `meadow` (default), `theme`, `pastel`, `rainbow`, `sunset`, or custom array
  - Behaviour: continuous stream or one-shot `burst`
  - Tunable: `density`, `speed`, `wander`, `riseSpeed`, `flapSpeed`, `minSize`/`maxSize`, `twoTone`
- **strobe()** - Timed full-page/container colour-flash overlay
  - Frequency (`hz`) uncapped with a console warning above 5 Hz; disabled under prefers-reduced-motion
  - Options: `colours`, `hz`, `duration`, `opacity`, `zIndex`
```

- [ ] **Step 4: Verify**

Run: `grep -rl "butterflies" public/showcase/effects/CLAUDE.md src/CLAUDE.md CLAUDE.md`
Expected: all three paths listed.

- [ ] **Step 5: Stage**

```bash
git add public/showcase/effects/CLAUDE.md src/CLAUDE.md CLAUDE.md
```

---

## Task 13: Final full-suite verification

- [ ] **Step 1: Run the entire test suite**

Run: `npx vitest run`
Expected: all suites pass, including the new `src/effects.test.js` (12 tests). No regressions elsewhere.

- [ ] **Step 2: Confirm the build is current**

Run: `npm run build`
Expected: clean build.

- [ ] **Step 3: Manual browser pass (Darryl)**

Load both showcase pages on the running server and exercise every demo per Tasks 6 & 7. Confirm no console errors, clean teardown, reduced-motion behaviour. **Claude cannot drive a browser - Darryl confirms.**

- [ ] **Step 4: Final stage**

```bash
git add -A
git status   # review staged set; DO NOT commit (project rule)
```

---

## Appendix A - domma-cms integration (groundwork, NOT executed here)

These changes live in the `domma-cms` repo and are recorded so integration is paste-and-test. Apply only when explicitly doing the CMS integration. Full detail in spec §8.

1. **`admin/js/lib/effect-defs.js`** - add the `butterflies` entry (Celebrations category) exactly as written in spec §8.1 (kebab-case attrs: `rise-speed`, `flap-speed`, `burst-count`). Do **not** add `strobe` (developer-API-only - decided).
2. **`server/services/markdown.js`** - add `'butterflies'` to `ALLOWED` (~`:26`); add an injection branch producing `.dm-fx-butterflies` with `data-*`, mirroring the `ticker-tape` branch (~`:1386`): self-closing → `data-mode="page"`, wrapping → container-scoped.
3. **`public/js/effects.js`** - after the `tickerTape` block (~`:251`), add a `butterflies` block: guard `typeof E.butterflies === 'function'`, scan `.dm-fx-butterflies`, map `data-*` (kebab→camel) into `opts`, call `E.butterflies(null, opts)` for `data-mode="page"` else `E.butterflies(el, opts)`, honouring the existing `reducedMotion` gate.
4. **`tests/markdown/effect-injection.test.js`** - assert `[butterflies /]` → `.dm-fx-butterflies` + `data-mode="page"`, and the wrapping form → scoped element with mapped attrs.
5. **Cache-busting** - bump `?v=` up the admin import chain and sync to sibling repos per project convention.

---

## Self-Review notes

- **Spec coverage:** §3 palettes → Task 1; §4 butterflies → Tasks 2,4,6; §5 strobe → Tasks 3,4,7; §6 refactor → Task 1; §7 deliverables 1-10 → Tasks 1-12; §8 CMS readiness → Appendix A; §9 accessibility → guard tests + showcase notices; §10 testing → Tasks 2,3,13.
- **Type consistency:** option names identical across Task 2 JSDoc, Task 6 sliders, Task 11 `.d.ts`, Task 12 docs (`riseSpeed`/`flapSpeed`/`burstCount`/`twoTone`); CMS kebab-case mapping noted in Appendix A.
- **Commits:** replaced with `git add` staging per project rule; no `git commit` anywhere.
