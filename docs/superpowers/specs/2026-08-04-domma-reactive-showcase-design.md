# Domma Reactive Showcase — Design

**Date:** 2026-08-04
**Status:** Approved for planning

## Goal

Make it discoverable that Domma's reactive core is *also* available as a standalone package, without
implying it has left Domma. Reactivity is and remains innate to the Domma suite; `domma-reactive` is
an additional door in, for people who want just that piece.

Delivered as: a new **Reactive** section in the showcase nav (badged New), a showcase page, a
tutorial, the two primitives exposed on Domma's own namespace, and a What's New entry.

## Background

`domma-reactive@0.1.0` was published on 2026-08-04 as part of the M1 extraction (Domma v0.31.0). The
package is inlined into `domma.min.js` by Rollup, so consumers install nothing extra — but nothing on
the site says the package exists, and the showcase never mentions `observable()` or
`observableArray()`.

Two constraints surfaced during investigation and shape the whole design:

1. **`observable()` and `observableArray()` are unreachable from Domma.** `Domma.models.computed` works;
   `Domma.models.observable`, `Domma.reactive` and `window.DommaReactive` are all `undefined`.
   `src/models.js` imports `observable` for internal use only. A showcase page served from Domma's site
   therefore cannot demonstrate the package's headline primitives on `domma.min.js` alone.
2. **`"badge"` in `nav-showcase.json` renders nowhere.** `Domma.elements.navbar()` builds items as
   `${iconHTML}${item.text}` with no badge support. Badges *are* honoured by `sidebar.js:147`, but only
   via `loadPrependNav`, which requires `type: "grouped"`; `nav-showcase.json` is `type: "dropdowns"`
   and no preset uses it as `prependNav`. All eight existing `"badge": "New"` entries — Blueprints,
   Router, Components, Integrations, Flags, both QuickStarts, and the current Reactivity entry — have
   never been visible.

## Decisions

| Decision | Choice | Rationale |
|---|---|---|
| Where the showcase lives | A section under Domma's site | Inherits the layout system, themes and components; one site to maintain. The standalone story lives on npm/GitHub where package-shoppers land. |
| Relationship to `showcase/models/reactivity.html` | Two pages, clean split | The existing page teaches reactivity *the Domma way* and keeps that job unchanged. The new page is about the *package*. Reciprocal banners stop anyone landing on the wrong one. |
| How live demos get `observable()` | Expose on Domma **and** show the standalone form | Matches the framing that reactivity is innate. Demos run on plain `domma.min.js`; each is shown twice so the "innate *and* separate" story is the page's spine, not a footnote. |
| Navbar badges | Build properly in `elements.js` | The alternative — painting the badge from the layout system — leaves the component still unable to do it and the other eight badges invisible. |
| Changelog backfill | v0.31.0 onward only | v0.26–v0.30 stay unrecorded by choice. |

## Scope

### Part 1 — Navbar badge support *(prerequisite)*

`Domma.elements.navbar()` gains support for `item.badge`.

Four render points in `src/elements.js`, all inside `_renderItems`:

| Line | Element | Needed for |
|---|---|---|
| `:5853` | dropdown toggle, depth 0 | **the menu header badge** — the primary ask |
| `:5859` | nested submenu toggle | consistency |
| `:5870` | top-level link | consistency |
| `:5875` | dropdown item | the eight existing dead badges |

Rendered as `<span class="navbar-item-badge">…</span>` after the label and before the caret.

**Open implementation decision:** `item.text` is currently interpolated raw. Escaping the badge but
not the label is inconsistent; escaping neither leaves new code unsafe. Recommendation: escape the
badge, and note the pre-existing `item.text` behaviour as out of scope rather than silently
diverging.

Also required, per project convention for element changes:
- `src/css/elements.css` — `.navbar-item-badge`, theme-aware, legible on the dark navbar variant
- Tests in `src/elements.test.js`
- `docs/API.md` — navbar item options
- `public/showcase/elements/navbar/` — demonstrate the option
- `public/assets/ide/phpstorm/elements.d.ts`

**Expected side effect:** the eight existing badges become visible. Review them at that point and
prune any that are no longer new.

### Part 2 — Expose the primitives on Domma

`src/models.js` re-exports `observable` and `observableArray` on the models namespace as
`M.observable` / `M.observableArray`. The import already exists for internal use; `observableArray`
must be added to it.

- Tests pinning both exports and their basic behaviour through `M`
- `docs/API.md`, `docs/Reactivity.md`
- Alias tables in `CLAUDE.md` and `src/CLAUDE.md`
- `public/assets/ide/phpstorm/` model typings

This is a **new public API**, which makes the release a minor.

### Part 3 — The menu header

New top-level group in `public/layouts/config/nav-showcase.json`, placed after **Data**:

```json
{
  "text": "Reactive",
  "badge": "New",
  "items": [
    { "text": "Domma Reactive", "url": "showcase/reactive/index.html",   "section": "reactive" },
    { "text": "Tutorial",       "url": "showcase/reactive/tutorial.html", "section": "reactive-tutorial" }
  ]
}
```

Depends on Part 1 rendering a badge on the depth-0 dropdown toggle, not only on items.

### Part 4 — The pages

Both use the layout system (`data-layout="showcase" data-layout-variant="subpage"` — the form all 26
existing showcase subpages use), the Domma ecosystem throughout
(`E.*`, `I.scan()`, `T.create()` where a table serves), and live runnable demos rather than static
code blocks.

**`public/showcase/reactive/index.html`**

1. Hero — reactivity is innate to Domma, and available on its own
2. Why it is a separate package — the extraction, briefly, and what it buys
3. Install — npm · CDN · *already in Domma, nothing to install*
4. `observable()` — live demo
5. `observableArray()` — live demo, covering the notifying mutators and why they bypass the equality gate
6. `computed` / `effect` — live demo, including batching
7. `untracked` / `flushSync`
8. Using it inside Domma — `M.observable`, and how it relates to `M.create()` and `model.tracked()`
9. Method reference table
10. Banner → `showcase/models/reactivity.html`

Every demo appears in both forms:

```javascript
const count = M.observable(0);                       // innate
import {observable} from 'domma-reactive';           // standalone
```

**`public/showcase/reactive/tutorial.html`** — one small thing built end to end: a cart total derived
from two observables, then a line-items list on `observableArray`, then batching.

**`public/showcase/models/reactivity.html`** — add the reciprocal banner. No other change.

**`public/sitemap.xml`** — entries for both new pages.

### Part 5 — What's New

`public/data/releases.json` gains **two** entries and one field change. Entry shape follows the
existing records (`year` holds the version string, plus `title`, `description` as HTML, `date`).

- **v0.31.0** — the extraction and the standalone package, linking to the new showcase.
- **v0.32.0** — the `onUpdated` fix, navbar badges, and `M.observable` / `M.observableArray`. Written
  when Part 6 is cut, not before.
- **`latestVersion`** — currently `v0.25.0`, which does not even match the newest entry (`v0.25.2`).
  It ends at **`v0.32.0`**, set as the last step of Part 6 so the navbar pill pulses for the release
  that actually contains this work.

### Part 6 — Release

Parts 1 and 2 both change shipped code. The `onUpdated` fix is also complete but unreleased.

**v0.32.0** (minor — new public API): `onUpdated` fix + navbar badges + `M.observable` /
`M.observableArray`, with the showcase pages riding along.

## Out of scope

- Backfilling changelog entries for v0.26–v0.30
- Merging or restructuring `showcase/models/reactivity.html` beyond the banner
- A separate site or GitHub Pages for `domma-reactive`
- Escaping `item.text` in the navbar (pre-existing; noted, not fixed here)
- The `domma-reactive` undeclared-field limitation in `Model` (tracked separately)

## Testing

- **Part 1:** unit tests for all four render points, including a badge on a depth-0 dropdown toggle;
  assert no badge markup when `item.badge` is absent.
- **Part 2:** tests pinning `M.observable` and `M.observableArray` exist and behave.
- **Parts 3–4:** the existing `src/examples.test.js` harness pattern extends naturally — load the built
  bundle into jsdom, mount each new page's demos, assert they render with zero console errors. At
  minimum, assert the nav config parses and the new group carries its badge.
- Mutation-test every claimed behaviour: apply a change that breaks it, confirm a test fails, restore.
  This has caught real defects repeatedly on this work and is not optional.

## Risks

| Risk | Mitigation |
|---|---|
| Making eight dead badges visible at once looks like noise | Review and prune them as part of Part 1 |
| Two reactivity pages confuse readers | Reciprocal banners, and distinct nav labels ("Reactivity" vs "Domma Reactive") |
| Live demos on the page drift from the package's real API | Demos run the inlined package via `M.*`, so a version bump exercises them |
| `M.observable` implies `M.create()` is deprecated | The page states plainly that models remain the primary idiom; observables are the primitive beneath |
