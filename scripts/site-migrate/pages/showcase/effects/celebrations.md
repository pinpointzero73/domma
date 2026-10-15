---
title: Celebrations
description: "Seasonal celebrations for any site - Christmas, Halloween, Valentine's, Guy Fawkes and the four patron saints' days - from the domma-celebrate package."
layout: with-sidebar
status: published
sortOrder: 50
---

[hero title="Celebrations" tagline="Year-round seasonal effects - fourteen celebrations, each with traits you can switch off or thin out." align="center"][/hero]

## Preview

In season, a sparkle disc on every page of this site turns the day's celebration on and off. Here you can run any of them, any day. Pick one, set how much of it you want, and switch individual traits off - Santa's sleigh, the steam train, the witches. Changes apply straight away.

[showcase-demo id="showcase/effects/celebrations/preview-every-celebration" title="Preview every celebration" /]

## The package

Celebrations are their own package, `domma-celebrate`, so a site with no Domma in it can use them. Domma ships the build at `dist/celebrate/`.

### Manual control

```javascript
import {Celebrations} from './dist/celebrate/domma-celebrate.esm.js';

const celebrations = new Celebrations({
    theme: 'christmas',     // or 'auto' for today's, if any
    intensity: 'medium',    // 'light', 'medium' or 'heavy'
    enabled: true
});

// false when there is nothing to show - no celebration in season, or a visitor
// who asked for reduced motion. It never throws.
await celebrations.init();

await celebrations.setTheme('halloween');
celebrations.setIntensity('heavy');
celebrations.pause();
celebrations.start();
celebrations.destroy();
```

### Turning individual traits off

A theme is not one switch. You may want the snow and the trees but not a steam train crossing your header:

```javascript
const celebrations = new Celebrations({
    theme: 'christmas',
    traits: {
        train: false,   // no steam train
        elf: false,     // no elves
        tree: 0.5,      // half as many trees
        firework: 2     // twice as many fireworks
    }
});

celebrations.setTrait('sleigh', false);
celebrations.setTraits({robin: false, wreath: 0.5});
celebrations.getTraits();   // what this theme can switch
```

`false` is off and a number is a density multiplier - `0` is off, `1` is untouched, `2` is twice as many. The panel in the preview is built from `getTraits()`.

### The celebrations

[table striped="true"]
| Theme | Draws | Dates |
| --- | --- | --- |
| `winter` | Snow, frosted pines, drifts, icicles and stars | Dec-Feb, after specific holidays |
| `make-it-rain` | Falling water and ground splashes | Manual only |
| `chinese-new-year` | A Chinese dragon, lanterns, fireworks, confetti and a sparkler greeting | Seven days from Chinese New Year |
| `new-year` | Confetti, streamers, fireworks, balloons, a midnight clock | 31 Dec - 2 Jan |
| `easter` | Blossom, eggs, a bunny, flowers, butterflies | Tuesday before Easter - Easter Monday |
| `summer-garden` | Petals, flowers, butterflies, bees, ladybirds | 1 Jun - 31 Aug (UK summer) |
| `christmas` | Snowflakes, Santa's sleigh, reindeer, trees, wreaths, robins, toy trains, elves | 1 Dec - 30 Dec |
| `halloween` | Pumpkins, bats, ghosts, witches, gravestones, spiders | 26-31 Oct |
| `valentines` | Hearts, rose petals, cupid, love letters | 9-14 Feb |
| `guy-fawkes` | Fireworks, bonfires, rockets, Catherine wheels, Roman candles | 1-5 Nov |
| `st-patricks` | Shamrocks, gold coins, leprechauns, pots of gold, rainbows | 12-17 Mar |
| `st-andrews` | Thistles, the saltire, a bagpiper, heather | 25-30 Nov |
| `st-davids` | Daffodils, leeks, the Welsh dragon, flags | 24 Feb - 1 Mar |
| `st-georges` | Rose petals, knights, dragons, the St George flag | 18-23 Apr |
[/table]

### Intensity

- **light** - fewer particles, subtle, easiest on the processor
- **medium** - balanced; the default
- **heavy** - every particle and decoration

### Without Domma

The same package works on any site from one script tag - it mounts the canvas and a control disc of its own, and remembers whether the visitor turned it off:

```html
<script src="domma-celebrate.min.js" data-celebrate></script>
```

`npm install domma-celebrate`.

### Automatic detection

With `theme: 'auto'` it reads today's date, finds the celebration in season and starts it - or does nothing (`getCurrentTheme()` is `null`) when there is none.

Custom sparkler messages use `message`, with `sparkler: {style: "cursive", colour: "silver", year: 2027}`. Choose `graduation`, `birthday`, `anniversary` or `greeting`, or replace a holiday greeting. `autumn` adds leaves, acorns and mushrooms. Banknotes use `money-rain`; weather uses `make-it-rain`.
