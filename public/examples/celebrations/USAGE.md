# Domma Celebrations - Usage Guide

Year-round visual celebration effects: eight themes that know their own place in the calendar,
drawn on a transparent canvas overlay that never touches your layout.

> **Celebrations are their own package.** They live in
> [`domma-celebrate`](https://github.com/pinpointzero73/domma-celebrate), extracted from this
> repository so that a site with no Domma in it can use the same eight themes. Domma ships the
> build at `dist/celebrate/` and the layout system drives it for you. The package's own README
> is the full reference; this page covers using it from Domma.

---

## Contents

- [Quick Start](#quick-start)
- [Supported Celebrations](#supported-celebrations)
- [Manual Control](#manual-control)
- [Traits: turning individual things off](#traits-turning-individual-things-off)
- [Options](#options)
- [API Reference](#api-reference)
- [Events](#events)
- [Using it without Domma](#using-it-without-domma)
- [Accessibility](#accessibility)
- [Troubleshooting](#troubleshooting)

---

## Quick Start

The layout system handles everything. A preset that declares `celebrations` renders a toggle
disc during a celebration period and nothing at all outside one:

```html
<body data-layout="splash">
  <!-- Your content -->
  <script src="dist/domma.min.js"></script>
  <script type="module" src="layouts/js/layout.js"></script>
</body>
```

```json
// layouts/config/presets.json
{
  "splash": {
    "celebrations": { "toggle": true }
  }
}
```

The visitor's choice - on or off, and at what intensity - is kept in `Domma.storage`, so they
are asked once rather than on every page.

---

## Supported Celebrations

| Celebration | Key | Dates | What you get |
|---|---|---|---|
| 🎄 Christmas | `christmas` | 1 Dec – 1 Jan | Crystalline snowflakes, decorated trees, wreaths, snowmen, a north star, Santa's sleigh with reindeer, a steam train, elves, robins, fireworks |
| 💕 Valentine's Day | `valentines` | 9 – 14 Feb | Hearts, rose petals, kisses, heart garlands, butterflies, envelopes, love letters, Cupid, a heart-shaped moon, a neon sign |
| 🏴󠁧󠁢󠁷󠁬󠁳󠁿 St David's Day | `st-davids` | 24 Feb – 1 Mar | Daffodil petals, daffodils, leeks, daffodil fields, the Welsh dragon, a harp, the flag |
| ☘️ St Patrick's Day | `st-patricks` | 12 – 17 Mar | Clover petals, shamrocks, gold coins, pots of gold, a rainbow, leprechauns, a banshee, a green moon |
| 🏴󠁧󠁢󠁥󠁮󠁧󠁿 St George's Day | `st-georges` | 18 – 23 Apr | Rose petals, Tudor roses, oak leaves, English roses, a knight, a dragon, a castle, shields, the cross |
| 🎃 Halloween | `halloween` | 26 – 31 Oct | Bats, ghosts, pumpkins, spiders, gravestones, jack-o-lanterns, scarecrows, a haunted house, a cauldron, witches, lightning |
| 🎆 Guy Fawkes Night | `guy-fawkes` | 1 – 5 Nov | Embers, sparks, bonfires, guy effigies, Catherine wheels, Roman candles, sparklers, fireworks, rockets, a red moon, lightning |
| 🏴󠁧󠁢󠁳󠁣󠁴󠁿 St Andrew's Day | `st-andrews` | 25 – 30 Nov | Heather petals, thistles, thistle plants, a bagpiper, the saltire, tartan, a Highland scene |

Ask without starting anything:

```js
import { getCurrentTheme, isCelebrationSeason } from './dist/celebrate/domma-celebrate.esm.js';

getCurrentTheme();                        // 'halloween' | null
getCurrentTheme(new Date(2026, 11, 25));  // 'christmas'
isCelebrationSeason();                    // boolean
```

---

## Manual Control

For a page that wants its own controls rather than the layout system's:

```js
import { Celebrations } from './dist/celebrate/domma-celebrate.esm.js';

const celebrations = new Celebrations({
  theme: 'christmas',     // or 'auto' for date detection
  intensity: 'medium',    // 'light' | 'medium' | 'heavy'
  enabled: true
});

// Returns false rather than throwing when there is nothing to show: no
// celebration in season, an unknown theme, or a visitor who has asked for
// reduced motion.
const started = await celebrations.init();

await celebrations.setTheme('halloween');
celebrations.setIntensity('heavy');
celebrations.pause();
celebrations.start();
celebrations.destroy();
```

Scoped to one section rather than the whole page:

```js
new Celebrations({ theme: 'christmas', container: '#hero', zIndex: 2 });
```

---

## Traits: turning individual things off

A theme is not one switch. You may want the snow and the trees but not a steam train crossing
your header. Every theme publishes a manifest of what it draws, and any of it can be switched
off or thinned out:

```js
const celebrations = new Celebrations({
  theme: 'christmas',
  traits: {
    train: false,   // no steam train
    elf: false,     // no elves
    tree: 0.5,      // half as many trees
    firework: 2     // twice as many fireworks
  }
});
```

`false` is off, `true` is on, and a number is a density multiplier - `0` is off, `1` is
untouched, `2` is twice as many. `{ enabled, density }` says both at once.

At runtime:

```js
celebrations.getTraits();
// { train: { label: 'Steam train', enabled: true, density: 1, ... }, ... }

celebrations.setTrait('train', false);
celebrations.setTraits({ elf: false, robin: false });   // one reseed, not two
```

The panel at the top of the [demo page](./index.html) is built from `getTraits()`.

### What each theme lets you switch

| Theme | Traits |
|---|---|
| `christmas` | `snowflake` `tree` `wreath` `snowman` `northStar` `sleigh` `robin` `train` `elf` `firework` |
| `valentines` | `heart` `rosePetal` `sparkle` `lips` `heartGarland` `butterfly` `envelope` `heartMoon` `cupid` `loveLetter` `neonSign` |
| `st-davids` | `daffodilPetal` `daffodil` `springSparkle` `leek` `daffodilField` `twinklingStar` `welshDragon` `flag` `harp` `leekBundle` |
| `st-patricks` | `cloverPetal` `shamrock` `goldCoin` `sparkle` `potOfGold` `twinklingStar` `leprechaun` `rainbow` `banshee` `moon` |
| `st-georges` | `rosePetal` `tudorRose` `oakLeaf` `sparkle` `englishRose` `twinklingStar` `knight` `dragon` `castle` `shield` `stGeorgesCross` |
| `halloween` | `pumpkin` `bat` `ghost` `spider` `gravestone` `jackOLantern` `scarecrow` `twinklingStar` `hauntedHouse` `moon` `witch` `cauldron` `floatingPumpkin` `lightning` |
| `guy-fawkes` | `ember` `spark` `bonfire` `guyEffigy` `catherineWheel` `romanCandle` `sparklerBundle` `firework` `rocket` `burst` `moon` `lightning` |
| `st-andrews` | `heatherPetal` `heather` `saltireSparkle` `thistle` `thistlePlant` `twinklingStar` `bagpiper` `saltireFlag` `tartanPattern` `highlandScene` |

Trait names are theme-specific, so a `traits` object may safely name traits from several themes -
each theme only consults its own.

---

## Options

| Option | Default | What it does |
|---|---|---|
| `theme` | `'auto'` | A theme key, or `'auto'` to pick whatever is in season |
| `intensity` | `'medium'` | `'light'`, `'medium'` or `'heavy'` |
| `enabled` | `true` | Start animating as soon as `init()` finishes |
| `traits` | `{}` | Per-decoration control, [above](#traits-turning-individual-things-off) |
| `container` | `null` | Element or selector to scope the canvas to. Null is a fixed, full-viewport overlay |
| `zIndex` | `999` | Overlay stacking order |
| `canvasId` | `'domma-celebrate-canvas'` | Id given to the canvas element |
| `mobileReduction` | `0.5` | Particle-count multiplier below 768px. `1` disables it |
| `respectMotionPreference` | `true` | Do nothing at all when the visitor has asked for reduced motion |
| `debug` | `false` | Log lifecycle detail. Errors are reported either way |

### Intensity Levels

Each theme defines its own three levels - particle counts, speeds, sizes and decoration counts:

```js
// Christmas, for example
{
  light:  { count: 50,  speedRange: [0.5, 1.5], sizeRange: [1, 3], trees: 3,  wreaths: 2 },
  medium: { count: 150, speedRange: [0.8, 2.5], sizeRange: [1, 4], trees: 6,  wreaths: 3 },
  heavy:  { count: 300, speedRange: [1.0, 3.5], sizeRange: [1, 5], trees: 10, wreaths: 4 }
}
```

---

## API Reference

```js
await celebrations.init();      // resolve the theme, build the canvas, seed particles
celebrations.start();
celebrations.pause();
celebrations.resume();
await celebrations.enable();    // init if needed, then start
celebrations.disable();
await celebrations.toggle();    // → whether it is now running
celebrations.destroy();

celebrations.setIntensity('heavy');
await celebrations.setTheme('valentines');   // reuses the same canvas
celebrations.setTrait('train', false);
celebrations.setTraits({ elf: false, tree: 0.5 });

celebrations.getState();
// { enabled, initialized, theme, intensity, particles, reducedMotion }
celebrations.getTraits();
```

Module functions:

```js
import {
  autoInit, mountControl, readPreferences,
  getThemes, getTheme, getCurrentTheme, isCelebrationSeason, isDateInRange,
  getThemeTraits, registerTheme, unregisterTheme, version
} from './dist/celebrate/domma-celebrate.esm.js';
```

---

## Events

```js
const off = celebrations.on('stateChange', running => console.log(running));
off();
```

| Event | Payload |
|---|---|
| `init` | Theme name |
| `stateChange` | `true` when running, `false` when paused |
| `themeChange` | New theme name |
| `intensityChange` | New intensity |
| `traitChange` | The full resolved trait map |
| `destroy` | Theme name |

A handler that throws is reported and does not stop the others.

---

## Using it without Domma

The package needs nothing from Domma. One script tag is the whole integration:

```html
<script src="domma-celebrate.min.js" data-celebrate></script>
```

That mounts the canvas, a control disc, an intensity selector and a per-trait panel, all with
their own styles, and remembers what the visitor chose.

```bash
npm install domma-celebrate
```

---

## Accessibility

- **Reduced motion is honoured by default.** With `prefers-reduced-motion: reduce` set, `init()`
  returns `false` and no canvas is created at all - not a slower animation, nothing. Pass
  `respectMotionPreference: false` to override, deliberately.
- The canvas is `aria-hidden` and `pointer-events: none`, so it is invisible to assistive
  technology and never intercepts a click.
- Always leave the toggle in place. It is the visitor's way out, and their choice is remembered.

---

## Troubleshooting

**Nothing appears.** Check the date - each theme runs for a short window. Check whether the
visitor has previously turned it off (`domma:celebrations-enabled` in localStorage), and whether
the browser reports `prefers-reduced-motion: reduce`.

**A theme fails to load.** The build is code-split: `dist/celebrate/domma-celebrate.esm.js` is
the engine and each theme is a chunk under `dist/celebrate/chunks/`. If the chunks are missing,
run `npm run copy:celebrate` - or `npm run build`, which includes it.

**Performance.** Drop to `light`, or thin the expensive traits rather than the whole theme:
`{ traits: { firework: 0.3, twinklingStar: 0.5 } }`. Particle counts already halve below 768px.

---

## Licence

`domma-celebrate` is MPL-2.0. Created by Darryl Waterhouse & DCBW-IT.

🎄 Happy celebrating! 🎉
