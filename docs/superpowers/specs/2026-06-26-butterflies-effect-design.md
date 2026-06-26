# Butterflies Effect — Design Spec

**Date:** 2026-06-26
**Status:** Draft — awaiting user review
**Author:** Darryl Waterhouse (with Claude)

## 1. Summary

Add a new canvas particle effect, `Domma.effects.butterflies()`, modelled on the
existing `tickerTape`/`twinkle` effects, plus a separate non-particle effect,
`Domma.effects.strobe()`. Both ship with full showcase pages, documentation, IDE
intelligence, and pre-specified domma-cms integration groundwork so the eventual
CMS wiring is mechanical.

Butterflies wander and rise with procedurally drawn flapping wings. Strobe is a
full-screen/contained colour flash with a reduced-motion guard.

Three further effects — **fireflies**, **bubbles**, **autumn leaves** — are
explicitly **out of scope for this spec** but are enabled by it: they reuse the
same particle scaffold and shared palette resolver introduced here, and will each
get their own spec → plan → implementation cycle as fast follow-ons.

## 2. Goals & non-goals

**Goals**
- `butterflies(selector|null, options)` — faithful to the established canvas-effect
  contract (full-page vs container, control object, palette system, reduced-motion).
- `strobe(selector|null, options)` — flash overlay with its own simpler architecture.
- Generalise `resolveTickerPalette` → `resolvePalette` (back-compat alias retained),
  adding palettes the sibling effects will need (`meadow`, `firefly`, `aqua`, `autumn`).
- Complete the project's "new effect" deliverable set (showcase, docs, IDE, sitemap, nav).
- Pre-specify domma-cms integration so groundwork is complete ahead of that work.

**Non-goals**
- Building fireflies/bubbles/autumn leaves (separate cycles).
- Performing the actual domma-cms code changes (this spec makes them trivial; it
  does not execute them). See §8 — these are documented, ready-to-apply snippets.
- Emoji/image-based rendering (rejected in brainstorming in favour of procedural wings).

## 3. Architecture

All canvas effects in `src/effects.js` share one lifecycle (cloned from `tickerTape`):
full-page (`null` selector → fixed canvas on `document.body`) vs container mode
(`absolute` canvas, host forced to `position:relative` if static), `ResizeObserver`
in container mode + `window resize` in full-page mode, a `requestAnimationFrame`
loop, and the standard control object
`{ pause, resume, stop, restart, destroy, isRunning, isPaused }`.

```
src/effects.js
  ├─ butterflies(selector, options)        ← particle scaffold (tickerTape clone)
  │     • createButterfly(w, h, fromEdge)   — spawn at bottom / lower sides
  │     • updateButterfly(b, w, h)          — WANDER + RISE physics (default impl, tweakable)
  │     • drawButterfly(ctx, b)             — two mirrored wing polygons; spread = sin(flapPhase)
  ├─ strobe(selector, options)             ← NOT particles: one overlay div, interval toggle
  ├─ resolvePalette(spec)                  ← generalised from resolveTickerPalette
  └─ resolveTickerPalette = resolvePalette ← back-compat alias
```

The default export object gains `butterflies` and `strobe`.

## 4. `butterflies(selector, options)`

### Options

| Option | Type | Default | Description |
|---|---|---|---|
| `palette` | `string \| string[]` | `'meadow'` | named palette or custom colour array (shared resolver) |
| `density` | `number` | `18` | target butterflies on screen (continuous mode) |
| `speed` | `number` | `1` | global speed multiplier |
| `wander` | `number` | `1` | steering erraticness (higher = sharper, more frequent turns) |
| `riseSpeed` | `number` | `0.4` | upward drift bias |
| `flapSpeed` | `number` | `1` | wingbeat rate multiplier |
| `minSize` | `number` | `14` | minimum wingspan (px) |
| `maxSize` | `number` | `26` | maximum wingspan (px) |
| `twoTone` | `boolean` | `true` | upper/lower wing use two palette colours |
| `burst` | `boolean` | `false` | release one batch, then settle (no respawn) |
| `burstCount` | `number` | `40` | butterflies released in burst mode |
| `zIndex` | `number` | `1` | canvas stacking order |
| `respectMotionPreference` | `boolean` | `true` | honour `prefers-reduced-motion` |

Returns the standard control object (or `noopControl()` under reduced motion;
`null` if a container selector matches nothing — matching `tickerTape`).

### Particle model (the "soul")

Each butterfly carries: `x, y, vx, vy, heading, wanderTimer, flapPhase, flapSpeed,
size, colourUpper, colourLower, alpha, alive`.

`updateButterfly` (default implementation — Darryl will tweak constants):
1. Decrement `wanderTimer`; when it expires, pick a new target heading (biased
   upward by `riseSpeed`) and reset the timer (interval scaled by `wander`).
2. Ease `heading` toward the target (turn sharpness scaled by `wander`).
3. Derive `vx`/`vy` from `heading` + `speed`, with an upward `riseSpeed` bias and a
   small vertical bob.
4. Advance `flapPhase += flapSpeed`.
5. Spawn from the bottom edge and lower sides; mark dead when drifting off the top
   (or once `alpha <= 0.01` if a fade is applied near the top).

`drawButterfly`: translate to `(x,y)`, rotate to `heading`, draw two mirrored wing
polygons whose horizontal spread = `Math.sin(flapPhase)` (spread → 0 reads as
edge-on wingbeat), thin body line down the centre. `twoTone` paints upper/lower
wings with `colourUpper`/`colourLower`.

### Showcase demos (mirror ticker-tape's five-demo arc)

1. **Theme/meadow palette** — scoped container, start/pause/resume/restart/destroy + status badge.
2. **Palette picker** — swap palettes live (`meadow`, `pastel`, `rainbow`, `sunset`, custom).
3. **Tune the flight** — sliders: density, speed, wander, riseSpeed, flapSpeed.
4. **One-shot release** — `burst: true` ("release a flutter" for success moments).
5. **Full-page overlay** — `null` selector ambient mode.

Plus a short **"How It Works"** + **"Use Cases"** section (release-on-success,
ambient hero, empty-state delight) — raising the bar above current effect pages,
which lack an explicit walkthrough section.

## 5. `strobe(selector, options)`

Not a particle effect. Creates a single positioned overlay element (fixed for
full-page, absolute for container) whose `background` toggles on an interval.

### Options

| Option | Type | Default | Description |
|---|---|---|---|
| `colours` | `string[]` | `['#ffffff', 'transparent']` | colours cycled each flash |
| `hz` | `number` | `2` | flashes per second — **uncapped** (caller's responsibility); `console.warn` above 5 Hz |
| `duration` | `number \| null` | `null` | auto-stop after N ms (null = until stopped) |
| `opacity` | `number` | `1` | overlay opacity |
| `zIndex` | `number` | `9999` | stacking order |
| `respectMotionPreference` | `boolean` | `true` | reduced motion → `noopControl()` |

Returns the standard control object. **Safety:** disabled entirely under
`prefers-reduced-motion`; frequency is *not* clamped (decision: flexibility over
hard cap), but a non-blocking `console.warn` fires above ~5 Hz. The showcase page
carries a prominent photosensitivity warning callout.

### Showcase

Trimmed relative to butterflies (strobe has no palette/particle dimension):
overview + safety callout, frequency/colour/duration controls, a contained demo,
and a full-page demo behind an explicit "Start" button (never autoplay).

## 6. Shared palette refactor

`resolveTickerPalette(spec)` → renamed `resolvePalette(spec)`; the old name kept as
an alias so nothing breaks. `TICKER_PALETTES` → `EFFECT_PALETTES`, adding:
- `meadow` — soft greens, lilacs, sky, butter-yellow (butterflies default)
- `firefly` — warm ambers/yellow-greens on the dark end (fireflies, later)
- `aqua` — translucent blues/cyans (bubbles, later)
- `autumn` — russet, amber, ochre, brown (autumn leaves, later)

Existing palettes (`theme`, `rainbow`, `festive`, `gold`, `silver`, `pastel`,
`mono`, `sunset`, `ocean`, `forest`, `bridal`) are unchanged.

## 7. Domma-side deliverables

| # | File | Change |
|---|---|---|
| 1 | `src/effects.js` | `butterflies`, `strobe`, palette refactor, default export update |
| 2 | `public/showcase/effects/butterflies.html` | new page (ticker-tape clone + How It Works/Use Cases) |
| 3 | `public/showcase/effects/strobe.html` | new page (trimmed + safety callout) |
| 4 | `public/showcase/effects/index.html` | two hub cards + bullets in "All JS Effects" card |
| 5 | `public/showcase/effects/javascript.html` | overview list + Use Cases entries |
| 6 | `public/layouts/config/nav-showcase.json` | `effects-butterflies`, `effects-strobe` entries |
| 7 | `public/sitemap.xml` | two new `<loc>` entries |
| 8 | `public/assets/ide/phpstorm/effects.d.ts` | `ButterfliesOptions`, `StrobeOptions` interfaces + method sigs |
| 9 | `public/showcase/effects/CLAUDE.md` | File-Structure + Available-Effects lines |
| 10 | `src/CLAUDE.md` + root `CLAUDE.md` | effects-reference lines |

Build: `npm run build` (or the relevant subset) to regenerate `dist/` bundles the
showcase pages and the CMS consume.

## 8. Domma-cms integration readiness (groundwork)

The CMS effects pipeline has four surfaces. This spec pre-specifies each so the
later integration is paste-and-test, not design. **These changes live in the
`domma-cms` repo and are NOT executed by this spec** — they are recorded here so
nothing needs designing when we get there.

### 8.1 Builder registry — `admin/js/lib/effect-defs.js`

Add to the `Celebrations` group (next to `ticker-tape`):

```js
{
    name: 'butterflies',
    label: 'Butterflies',
    category: 'Celebrations',
    description: 'Butterflies wander and rise with flapping wings. Self-closing for full-page; wrapping form for container-scoped.',
    attrs: [
        {name: 'palette',   label: 'Palette', type: 'select', default: 'meadow',
            options: [['meadow','Meadow'],['theme','Theme'],['pastel','Pastel'],['rainbow','Rainbow'],['sunset','Sunset']]},
        {name: 'density',    label: 'Density',          type: 'number', default: 18},
        {name: 'speed',      label: 'Speed multiplier', type: 'number', default: 1, step: 0.1},
        {name: 'wander',     label: 'Wander',           type: 'number', default: 1, step: 0.1},
        {name: 'rise-speed', label: 'Rise speed',       type: 'number', default: 0.4, step: 0.1},
        {name: 'flap-speed', label: 'Flap speed',       type: 'number', default: 1, step: 0.1},
        {name: 'burst',      label: 'Burst mode (one-shot)', type: 'checkbox', default: false},
        {name: 'burst-count',label: 'Burst count',      type: 'number', default: 40},
    ],
    hosts: ['hero'],
    previewable: true,
}
```

Naming rule observed: CMS attrs are **kebab-case**; the runtime maps them to
camelCase Domma options (`rise-speed` → `riseSpeed`, `flap-speed` → `flapSpeed`,
`burst-count` → `burstCount`). The Domma option names in §4 are chosen so this
mapping is purely mechanical.

### 8.2 Shortcode injector — `server/services/markdown.js`

- Add `'butterflies'` to the `ALLOWED` shortcode list (~line 26).
- Add injection producing `.dm-fx-butterflies` with `data-*` attributes, following
  the `ticker-tape` branch (~line 1386): self-closing `[butterflies /]` → full-page
  (`data-mode="page"`); wrapping `[butterflies]…[/butterflies]` → container-scoped.

### 8.3 Published runtime — `public/js/effects.js`

After the `tickerTape` block (~line 251), add a `butterflies` block: guard on
`typeof E.butterflies === 'function'`, scan `.dm-fx-butterflies`, read `data-*`
into `opts` (kebab→camel), call `E.butterflies(null, opts)` for `data-mode="page"`
else `E.butterflies(el, opts)`. Honour the existing `reducedMotion` gate.

### 8.4 Tests — `tests/markdown/effect-injection.test.js`

Add assertions: `[butterflies /]` → `.dm-fx-butterflies` + `data-mode="page"`;
wrapping form → scoped element with mapped data attributes.

### 8.5 Strobe in the CMS — OPEN QUESTION

Strobe's photosensitivity profile makes CMS-injectability questionable. Default
recommendation: **do not** add strobe to `effect-defs.js` (keep it
developer-API-only). Revisit if a content-author use case appears. Flagged for
decision at CMS-integration time, not now.

### 8.6 Cache-busting note

Per project convention, CMS admin changes require bumping `?v=` query strings up
the import chain and syncing to sibling repos. That is a CMS-integration-time
step, recorded here so it is not forgotten.

## 9. Accessibility

- Both effects honour `prefers-reduced-motion` by default (`respectMotionPreference`).
- Showcase demos override it (`respectMotionPreference: false`) per the established
  pattern, and show the standard reduced-motion notice.
- Strobe additionally carries a photosensitivity warning and never autoplays.
- `pointer-events: none` on canvases/overlays so effects never block interaction.

## 10. Testing

- Manual: load each showcase page, exercise every demo (start/pause/resume/restart/
  destroy, palette swap, sliders, burst, full-page), confirm no console errors and
  clean teardown on navigation. (User verifies in browser — Claude cannot drive one.)
- Reduced-motion: toggle OS setting, confirm noop + notice.
- CMS (at integration time): run `tests/markdown/effect-injection.test.js`.

## 11. Open questions

1. **Strobe CMS injectability** (§8.5) — recommend developer-API-only. Decide at
   CMS time.
2. **Default wander/rise constants** — Darryl tunes after the working default lands.
3. **Sibling effects ordering** — fireflies / bubbles / autumn leaves sequence TBD
   in their own specs.
