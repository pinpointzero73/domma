---
title: Ticker Tape Effect
description: "A canvas-based ticker-tape parade. Curled paper strips catch the light, sway, tumble, and fade - full-page or container-scoped, with theme-aware palettes."
layout: with-sidebar
status: published
sortOrder: 50
---

[hero title="Ticker Tape Effect" tagline="A canvas-based ticker-tape parade. Curled paper strips catch the light, sway, tumble, and fade - full-page or container-scoped, with theme-aware palettes." align="center"][/hero]

## Domma.effects.tickerTape()

Drops thin coloured rectangles from the top of a container - or the entire viewport - as if released from a stack of windows during a ticker-tape parade. Each strip falls, sways gently from side to side, rotates as it tumbles, and fades to nothing before reaching the bottom. Pass `null` for a full-page overlay, or a selector for a scoped effect.

```javascript
// Full-page overlay using current theme colours
const ticker = Domma.effects.tickerTape(null);

// Container-scoped, festive palette, slower fall
Domma.effects.tickerTape('#celebration', {
  palette: 'festive',
  density: 60,
  speed: 0.7
});

// One-shot burst - strips arrive and the effect ends naturally
Domma.effects.tickerTape('#stage', {
  burst: true,
  burstCount: 200,
  palette: 'gold'
});

// Control methods
ticker.pause();
ticker.resume();
ticker.stop();
ticker.restart();
ticker.destroy();
```

### Options

[table striped="true"]
| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `palette` | `string \| string[]` | `'theme'` | Named palette or custom colour array. `'theme'` reads CSS variables from the current Domma theme. |
| `density` | `number` | `50` | Average number of strips on screen at any moment |
| `speed` | `number` | `1` | Fall-speed multiplier (lower = slower drift) |
| `sway` | `number` | `60` | Horizontal sway amplitude in pixels |
| `rotationSpeed` | `number` | `6` | Maximum rotation in degrees per frame |
| `minWidth` / `maxWidth` | `number` | `5` / `9` | Strip width range in pixels |
| `minHeight` / `maxHeight` | `number` | `12` / `22` | Strip height range in pixels |
| `fadeStart` | `number` | `0.55` | Fraction of the fall (0-1) at which fade begins |
| `burst` | `boolean` | `false` | If true, drops a single batch and stops respawning |
| `burstCount` | `number` | `150` | Strips emitted when `burst: true` |
| `zIndex` | `number` | `1` | Canvas stacking order |
| `respectMotionPreference` | `boolean` | `true` | Honour `prefers-reduced-motion` OS setting |
[/table]

### Built-in Palettes

Pass any of these names as the `palette` option - or supply your own array of colour strings.

[showcase-demo id="showcase/effects/ticker-tape/built-in-palettes" title="Built-in Palettes" /]

## Demo: Theme-Aware Palette

The default palette resolves the active theme's CSS variables, so the same call produces different colours under different themes. Try switching the theme variant in the toolbar above.

[showcase-demo id="showcase/effects/ticker-tape/demo-theme-aware-palette" title="Demo: Theme-Aware Palette" /]

```javascript
const ticker = Domma.effects.tickerTape('#tape-container', {
  palette: 'theme',   // pull from --dm-primary, --dm-success, etc.
  density: 50,
  speed: 1
});
```

## Demo: Choose a Palette

Click a palette to swap colours instantly.

[showcase-demo id="showcase/effects/ticker-tape/demo-choose-a-palette" title="Demo: Choose a Palette" /]

## Demo: Tune the Physics

Adjust the controls and click **Apply**.

[showcase-demo id="showcase/effects/ticker-tape/demo-tune-the-physics" title="Demo: Tune the Physics" /]

## Demo: One-Shot Burst

In burst mode, a single batch of strips is released and the effect winds down naturally - perfect for confirmation moments (form submission, achievement unlocked, sale completed).

[showcase-demo id="showcase/effects/ticker-tape/demo-one-shot-burst" title="Demo: One-Shot Burst" /]

```javascript
Domma.effects.tickerTape('#stage', {
  burst: true,
  burstCount: 200,
  palette: 'gold',
  speed: 1.4
});
```

## Demo: Full-Page Overlay

Pass `null` as the selector to drop tape across the whole viewport. Pieces sit behind page content via `pointer-events: none`.

[showcase-demo id="showcase/effects/ticker-tape/demo-full-page-overlay" title="Demo: Full-Page Overlay" /]

```javascript
Domma.effects.tickerTape(null, {
  palette: 'rainbow',
  density: 80,
  zIndex: 9999
});
```
