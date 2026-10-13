---
title: Strobe Lighting Effect
description: "Light beams emanate from the corners, sweep across, and brighten where they cross - full-page or container-scoped, with named presets."
layout: with-sidebar
status: published
sortOrder: 50
---

[hero title="Strobe Lighting Effect" tagline="Light beams emanate from the corners, sweep across, and brighten where they cross - full-page or container-scoped, with named presets." align="center"][/hero]

## Domma.effects.strobe()

Renders a canvas of light beams that emanate from the corners of the page - or a container - and sweep or rotate across the space. Where beams overlap, their light adds together and brightens, just like real stage lighting. Pass `null` as the selector for a full-page lighting rig, or a selector to scope it to a single element. Everything is driven by a named `preset`, and any individual option overrides the preset's value. The effect returns a control object so you can pause, resume, stop, restart or destroy it at any time. Under `prefers-reduced-motion` the lighting is disabled entirely.

```javascript
// Full-page club lighting
const lights = Domma.effects.strobe(null);
// A named preset
Domma.effects.strobe('#stage', { preset: 'police' });
// Preset + overrides
Domma.effects.strobe(null, { preset: 'club', flicker: false, colours: ['#ffffff'] });
lights.pause(); lights.resume(); lights.stop(); lights.destroy();
```

### Options

[table striped="true"]
| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `preset` | `string` | `'club'` | Bundle of the options below. One of `club`, `concert`, `police`, `searchlight`, `scanner`, `mood`. Individual options override the preset. |
| `origins` | `string[]` | *preset* | Which corners beams emit from - any of `'tl'`, `'tr'`, `'bl'`, `'br'`. |
| `motion` | `string` | *preset* | `'sweep'` (fan back and forth) or `'rotate'` (full circle). |
| `sweepArc` | `number` | *preset* | Arc, in degrees, that beams fan through in `sweep` mode. |
| `speed` | `number` | *preset* | Sweep / rotation speed multiplier. |
| `beamWidth` | `number` | *preset* | Beam cone width in degrees. |
| `flicker` | `boolean` | *preset* | Blink the beams on and off. |
| `hz` | `number` | *preset* | Flicker rate (flashes per second). Values above **5 Hz** log a console warning but are never clamped - keep it low for safety. |
| `colours` | `string[]` | *preset* | Hex colour strings, assigned one per beam. |
| `intensity` | `number` | *preset* | Overall brightness, `0`-`1`. |
| `duration` | `number \| null` | `null` | Auto-stop after this many milliseconds. `null` runs until stopped manually. |
| `zIndex` | `number` | `9999` | Canvas stacking order. |
| `respectMotionPreference` | `boolean` | `true` | Honour the `prefers-reduced-motion` OS setting. When true and reduced motion is set, the lighting does not run. |
[/table]

## Presets

Each preset bundles a complete lighting look. Start from one, then override any option you like.

[showcase-demo id="showcase/effects/strobe/presets" title="Presets" /]

## Demo: Preset Picker

Click a preset to select it, then press **Start** to light up the stage below. Nothing runs until you press Start.

[showcase-demo id="showcase/effects/strobe/demo-preset-picker" title="Demo: Preset Picker" /]

```javascript
Domma.effects.strobe('#strobe-container-1', {
  preset: 'club'   // the selected preset
});
```

## Demo: Build Your Own

Configure the beams from scratch, then press **Apply**.

[showcase-demo id="showcase/effects/strobe/demo-build-your-own" title="Demo: Build Your Own" /]

With flicker on, setting the Hz above 5 logs a console warning - the value is never clamped, so keep it low for safety.

## Demo: Full-Page

Pass `null` as the selector to light the entire viewport. This affects the **whole page** - it uses the preset selected in the Preset Picker above (or `club` by default), so use the Stop button to end it. It never autoplays and never stops on its own here.

[showcase-demo id="showcase/effects/strobe/demo-full-page" title="Demo: Full-Page" /]

```javascript
const lights = Domma.effects.strobe(null, {
  preset: 'club'
});
// ...later
lights.stop();
```
