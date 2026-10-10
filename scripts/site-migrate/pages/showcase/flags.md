---
title: Domma Flags
description: "Domma Flags - nation flags as crisp inline SVG, keyed by ISO code, with rectangular, rounded, square and circular shapes."
layout: with-sidebar
status: published
sortOrder: 50
---

[hero title="Domma Flags" tagline="Nation flags as crisp, scalable inline SVG - keyed by ISO code, themable into rectangular, rounded, square or circular shapes. An opt-in module. Click any flag to copy." align="center"][/hero]

## One flag, four shapes

[showcase-demo id="showcase/flags/one-flag-four-shapes" title="One flag, four shapes" /]

[showcase-demo id="showcase/flags/one-flag-four-shapes-2" title="One flag, four shapes" /]

## Usage

### HTML data attributes

```html
<!-- after domma.min.js -->
<script src="dist/domma-flags.min.js"></script>

<span data-flag="gb"></span>
<span data-flag="jp" data-flag-shape="circle"
      data-flag-size="48" data-flag-border></span>

<script>FL.scan();</script>
```

### JavaScript API

```javascript
// Render an SVG element
const svg = FL.render('fr', { size: 48, shape: 'rounded' });
document.body.appendChild(svg);

// Inject into a target
FL.inject('#country', 'de', { shape: 'circle', border: true });

// Search & list
FL.search('united');     // ['gb', 'us', 'ae']
FL.list('europe');       // ['gb', 'fr', 'de', ...]
FL.name('br');           // 'Brazil'

// Register your own / override
FL.register('eu', { name: 'European Union', region: 'europe',
    bg: '#003399',
    overlays: [{ type: 'star', cx: 30, cy: 20, r: 4, fill: '#FFCC00' }] });
```

## Tutorial: a country picker

[showcase-demo id="showcase/flags/tutorial-a-country-picker" title="Tutorial: a country picker" /]
