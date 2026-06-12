# Domma Flags

Nation flags as crisp, scalable **inline SVG**, keyed by ISO 3166-1 alpha-2 code (`gb`, `us`, `fr`…).

Flags are stored as compact descriptors and expanded to SVG **lazily** on first render, then memoised — nothing
touches the DOM until a flag is actually requested. The whole module is a lean ~20 KB.

> **Opt-in module.** Flags are *not* part of the core `domma` bundle. Flags are multi-colour artwork that cannot be
> tinted with `currentColor`, and a full set would significantly bloat the core. Load the separate `domma-flags`
> bundle only where you need it.

## Installation

Load the flags bundle **after** the core Domma bundle:

```html
<script src="dist/domma.min.js"></script>
<script src="dist/domma-flags.min.js"></script>
```

This exposes the **`FL`** global and attaches the registry to `Domma.flags` / `Domma.FL`.

ES modules:

```js
import { flags as FL } from 'domma-js/public/dist/domma-flags.esm.js';
```

## Quick start

```html
<!-- Auto-scan markup -->
<span data-flag="gb"></span>
<span data-flag="jp" data-flag-shape="circle" data-flag-size="48" data-flag-border></span>
<script>FL.scan();</script>
```

```js
// Render an SVG element
const svg = FL.render('fr', { size: 48, shape: 'rounded' });
document.body.appendChild(svg);

// Inject into a target (replaces contents)
FL.inject('#country', 'de', { shape: 'circle', border: true, position: 'replace' });
```

## Shapes

The canonical canvas is **3:2** (`60 × 40`). Four output shapes are supported:

| Shape     | Description                                              |
|-----------|----------------------------------------------------------|
| `rect`    | Default 3:2 rectangle                                    |
| `rounded` | 3:2 with rounded corners                                 |
| `square`  | 1:1, centre-cropped                                      |
| `circle`  | 1:1, clipped to a circle (great for avatars / pickers)   |

```js
FL.render('br', { shape: 'circle', size: 32, border: true });
```

## API

### `FL.render(code, options?) → SVGElement | null`

| Option   | Type                 | Default  | Description                                            |
|----------|----------------------|----------|--------------------------------------------------------|
| `size`   | `number`             | `24`     | Height in px; width follows the 3:2 aspect             |
| `width`  | `number`             | —        | Explicit width override                                |
| `height` | `number`             | —        | Explicit height override                               |
| `shape`  | `string`             | `'rect'` | `rect` \| `rounded` \| `square` \| `circle`            |
| `border` | `boolean \| string`  | `false`  | Hairline border; pass a colour string to customise     |
| `class`  | `string`             | `''`     | Extra CSS classes                                      |
| `title`  | `string`             | name     | Accessible title (defaults to the country name)        |
| `attrs`  | `object`             | `{}`     | Additional SVG attributes                              |

### Other methods

| Method                              | Returns            | Description                                             |
|-------------------------------------|--------------------|---------------------------------------------------------|
| `FL.html(code, options?)`           | `string`           | Flag as an HTML string                                  |
| `FL.inject(target, code, options?)` | `SVGElement\|null` | Insert into a selector/element (`position` option)      |
| `FL.scan(container?)`               | `number`           | Replace `[data-flag]` elements; returns count           |
| `FL.has(code)`                      | `boolean`          | Whether a flag exists                                   |
| `FL.get(code)`                      | `object\|null`     | The flag definition                                     |
| `FL.name(code)`                     | `string\|null`     | Country name for a code                                 |
| `FL.list(region?)`                  | `string[]`         | Codes, optionally filtered by region                    |
| `FL.listRegions()`                  | `object`           | Region metadata (`{ name, description, codes }`)        |
| `FL.count()`                        | `number`           | Total number of flags                                   |
| `FL.search(query)`                  | `string[]`         | Match by code or country name                           |
| `FL.register(code, def)`            | `FL`               | Register or override a flag                              |
| `FL.unregister(code)`               | `boolean`          | Remove a flag                                           |

### `data-*` attributes (for `scan`)

`data-flag`, `data-flag-size`, `data-flag-shape`, `data-flag-class`, `data-flag-border`, `data-flag-title`.

## Regions

Flags are grouped into `europe`, `americas`, `africa`, `asia` and `oceania`. This is a curated starter set covering the
major footballing and world nations; extend it freely at runtime.

```js
FL.list('europe');                 // ['gb', 'fr', 'de', ...]
FL.listRegions().asia.name;        // 'Asia & Middle East'
```

## Registering custom flags

A flag is either **raw SVG** (`svg`) or a **compact descriptor** (`stripes` / `cross` / `bg` + `overlays`) drawn on the
`60 × 40` canvas. Overlay primitives: `rect`, `circle`, `ellipse`, `line`, `path`, `star`, `crescent`, `group`.

```js
// Descriptor — the EU flag
FL.register('eu', {
    name: 'European Union',
    region: 'europe',
    bg: '#003399',
    overlays: [
        { type: 'star', cx: 30, cy: 20, r: 4, fill: '#FFCC00' }
    ]
});

// Raw SVG — full control
FL.register('xx', {
    name: 'Example',
    svg: '<rect width="60" height="40" fill="#000"/><circle cx="30" cy="20" r="10" fill="#fff"/>'
});
```

## A note on emblems

Highly detailed coats of arms and central emblems are **simplified** for clarity at icon scale. If you need a
pixel-accurate rendering of a particular flag, override it with `FL.register(code, { svg })`.

## See also

- Live demo: [`/showcase/flags/`](../public/showcase/flags/index.html)
- [Icons](../public/showcase/icons/index.html) — the monochrome `data-icon` system
