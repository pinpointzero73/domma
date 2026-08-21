# Showcase Domma-Conventions Sweep - Survey Findings

**Date:** 2026-08-04
**Status:** Measurement only. Design and plan to follow, after the Reactive showcase ships as v0.32.0.

Recorded so the measurement is not re-derived. The decision taken was: **build a verification harness
first, then sweep in tranches**, and **finish the Reactive showcase work first**.

## Scope

85 HTML files under `public/showcase/`. **191 live violations across 54 pages; 31 pages already clean.**
A further 38 occurrences sit inside displayed `<pre>`/`<code>` samples - a separate editorial question,
since some may be deliberately teaching vanilla-versus-Domma contrast.

| Convention breached | Live count |
|---|---|
| `document.querySelector` / `getElementById` → `$()` | 101 |
| `addEventListener` → `.on()` | 79 |
| `new Date()` → `D()` | 26 |
| `fetch()` → `H.get()` etc. | 12 |
| `localStorage.*` → `S.*` | 11 |

## Concentration

Nine pages hold roughly 135 of the 191, so the first tranche is small and high-value:

| Page | Live |
|---|---|
| `themes/index.html` | 48 |
| `elements/chooser/index.html` | 23 |
| `effects/twinkle.html` | 13 |
| `effects/fireworks.html` | 11 |
| `effects/scramble.html` | 10 |
| `effects/strobe.html` | 9 |
| `effects/butterflies.html` | 7 |
| `effects/counter.html` | 7 |
| `effects/ticker-tape.html` | 7 |

## Three conversions are NOT straight swaps

Only `querySelector → $()` and `addEventListener → .on()` are mechanical - 180 of the 191. The other
eleven each carry a trap:

- **`localStorage` → `S`** - `S.set()` namespaces keys with a `domma:` prefix, so a straight swap writes
  to a *different key*. Any visitor's existing saved state is orphaned, not migrated. Needs either a
  migration read or a deliberate decision to abandon the old key.
- **`fetch` → `H`** - `H.get()` resolves to parsed JSON; `fetch()` resolves to a `Response`. Callers doing
  `.then(r => r.json())` break.
- **`new Date()` → `D()`** - `D()` returns a Domma wrapper, not a native `Date`. Anything passing the
  result onward to something expecting a `Date` breaks.

## The blocking risk

**There is no browser-level test coverage for showcase pages.** The only such harness in the repo is
`src/examples.test.js` (added 2026-08-04), covering five example apps. Sweeping 191 sites across 54
pages without a harness is precisely how the v0.30.0 modal regression and the `onUpdated` bug both
survived a green suite.

The harness should extend the `src/examples.test.js` pattern: load each showcase page into jsdom
against the built bundle, assert a non-trivial render and zero console errors. That converts an
unverifiable sweep into a verifiable one, and keeps paying out afterwards.

## Separate, unresolved: colour literals

Counted but **not** actionable as a single rule. `themes/index.html` alone holds 157 colour literals,
`effects/fireworks.html` 72, `elements/css-customisation/index.html` 46 - but most are demo *content*
(theme swatches, effect palettes, gradient examples) and are correct as literals. Others are page
chrome and are genuine violations, e.g. `themes/index.html:139-144`, where an audit tool's own UI is
hardcoded.

Distinguishing the two needs per-file judgement, not a regex. Treat as a distinct workstream.

**Measurement caveat:** a naive `#[0-9a-fA-F]{3,6}` pattern also matches ID selectors (`$('#add-row')`
- `add` is valid hex). In practice this inflated the counts by one occurrence across the whole
showcase, so the figures above stand, but any future tooling should require the full 3/6/8-digit token
with a negative lookahead for identifier characters.

## Already fixed

`public/showcase/models/reactivity.html` - the `rx-order-summary` component template had a hardcoded
`#cbd5e1` border inside a Shadow DOM template. Moved into the component's `style:` block using
`var(--dm-border)`; `_getStyles()` prepends the theme variables into every shadow root, so it now
follows the light/dark variant. A light-only `var(--dm-warning-bg, #fef3c7)` fallback was also dropped.
