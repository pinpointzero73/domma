---
title: Butterflies Effect
description: "A canvas effect where procedurally drawn butterflies wander and rise with flapping wings - full-page or container-scoped, with theme-aware palettes."
layout: with-sidebar
status: published
sortOrder: 50
---

[hero title="Butterflies Effect" tagline="A canvas effect where procedurally drawn butterflies wander and rise with flapping wings - full-page or container-scoped, with theme-aware palettes." align="center"][/hero]

## Domma.effects.butterflies()

Releases procedurally drawn butterflies that drift up through a container - or the entire viewport - as if crossing a meadow on a spring afternoon. Each one wanders along a gently bobbing path, beats its wings, and slips away off the top edge. Pass `null` for a full-page overlay, or a selector for a scoped effect. Colours can follow the active theme or any of the built-in palettes.

```javascript
// Full-page overlay using the default meadow palette
const flutter = Domma.effects.butterflies(null);

// Container-scoped, pastel palette, denser swarm
Domma.effects.butterflies('#hero', { palette: 'pastel', density: 24 });

// One-shot release - a burst of butterflies that winds down naturally
Domma.effects.butterflies('#card', { burst: true, burstCount: 30 });

// Control methods
flutter.pause();
flutter.resume();
flutter.stop();
flutter.restart();
flutter.destroy();
```

### Options

[table striped="true"]
| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `palette` | `string \| string[]` | `'meadow'` | Named palette or custom colour array. `'theme'` reads CSS variables from the current Domma theme. |
| `density` | `number` | `18` | Average number of butterflies on screen at any moment |
| `speed` | `number` | `1` | Overall flight-speed multiplier |
| `wander` | `number` | `1` | How much each butterfly meanders from a straight path |
| `riseSpeed` | `number` | `0.4` | Upward drift multiplier (higher = quicker rise) |
| `flapSpeed` | `number` | `1` | Wing-flap rate multiplier |
| `minSize` | `number` | `14` | Smallest butterfly wingspan in pixels |
| `maxSize` | `number` | `26` | Largest butterfly wingspan in pixels |
| `twoTone` | `boolean` | `true` | Give each butterfly two palette colours - one for the upper wings, one for the lower |
| `burst` | `boolean` | `false` | If true, releases a single batch and stops respawning |
| `burstCount` | `number` | `40` | Butterflies emitted when `burst: true` |
| `zIndex` | `number` | `1` | Canvas stacking order |
| `respectMotionPreference` | `boolean` | `true` | Honour `prefers-reduced-motion` OS setting |
[/table]

### Built-in Palettes

Pass any of these names as the `palette` option - or supply your own array of colour strings.

[showcase-demo id="showcase/effects/butterflies/built-in-palettes" title="Built-in Palettes" /]

## How It Works

Each butterfly spawns just off the bottom edge - or low on the left and right sides - and is given a random colour from the chosen palette, a wingspan between `minSize` and `maxSize`, and a starting heading.

Every so often it picks a fresh heading that is biased gently upward, then eases toward it rather than snapping across. That gradual turning is what gives the flight its characteristic bob and wander: the butterfly is always chasing a target direction it never quite settles on. The `wander` option widens how far those targets stray from straight up, while `riseSpeed` controls how strongly the upward bias pulls.

The wings are drawn fresh each frame. A running `flapPhase` is advanced by `flapSpeed`, and `Math.sin(flapPhase)` drives the wing spread - wide open at the top of the beat, folded at the bottom - so the flap reads as a continuous, lifelike motion rather than a two-frame toggle.

As a butterfly drifts past the top of the canvas it fades and is retired. In continuous mode a replacement spawns from below to keep the swarm at roughly `density` members; in `burst` mode no replacements are made, so the flutter thins out and ends on its own.

## Demo: Theme / Meadow Palette

The default `meadow` palette gives soft spring greens and skies. Press Start to release a wandering swarm into the container below.

[showcase-demo id="showcase/effects/butterflies/demo-theme-meadow-palette" title="Demo: Theme / Meadow Palette" /]

```javascript
const flutter = Domma.effects.butterflies('#butterfly-container', {
  palette: 'meadow',   // soft spring greens and skies
  density: 18,
  speed: 1
});
```

## Demo: Choose a Palette

Click a palette to swap colours instantly.

[showcase-demo id="showcase/effects/butterflies/demo-choose-a-palette" title="Demo: Choose a Palette" /]

## Demo: Tune the Flight

Adjust the controls and click **Apply**.

[showcase-demo id="showcase/effects/butterflies/demo-tune-the-flight" title="Demo: Tune the Flight" /]

## Demo: One-Shot Release

In burst mode, a single flutter of butterflies is released and the effect winds down naturally - perfect for confirmation moments (form submission, achievement unlocked, sale completed).

[showcase-demo id="showcase/effects/butterflies/demo-one-shot-release" title="Demo: One-Shot Release" /]

```javascript
Domma.effects.butterflies('#card', {
  burst: true,
  burstCount: 30,
  palette: 'pastel',
  speed: 1.2
});
```

## Demo: Full-Page Overlay

Pass `null` as the selector to release butterflies across the whole viewport. They drift behind page content via `pointer-events: none`.

[showcase-demo id="showcase/effects/butterflies/demo-full-page-overlay" title="Demo: Full-Page Overlay" /]

```javascript
Domma.effects.butterflies(null, {
  palette: 'rainbow',
  density: 24,
  zIndex: 9999
});
```

## Use Cases

- **Success & celebration moments** - fire a one-shot `burst` on form submission, checkout completion, or an achievement unlock.
- **Ambient hero backdrops** - a low-density continuous swarm behind a landing-page headline adds life without distraction.
- **Empty-state & onboarding delight** - soften a blank dashboard or welcome screen with a gentle flutter.
- **Seasonal & spring theming** - pair the `meadow` or `pastel` palette with seasonal campaigns and promotions.
