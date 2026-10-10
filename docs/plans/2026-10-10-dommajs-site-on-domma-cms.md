# Rebuild dommajs.org on Domma CMS

Date: 2026-10-10. Status: agreed, not started.

dommajs.org is a hand-built static site (`public/`, served by Apache straight from this checkout). Domma JS
is the building blocks Domma CMS is made of, so the site that presents Domma JS should be a Domma CMS site:
the content moves, the hand-made plumbing (layouts JSON, search index, sitemap, nav files) is replaced by
what the CMS already does, and the site itself becomes the best demonstration of both.

## Decisions

| Question | Decision |
|---|---|
| Which Domma the showcase runs | **Release in step.** The site runs the Domma that ships with Domma CMS. A Domma release is followed by a CMS release that carries it, then a fleet roll; only then does the showcase show it. One copy of Domma per page. |
| Examples (`/examples/`) | **Dropped.** The showcase covers the same ground. |
| Mini-apps | **Not on the new site.** Domma Docs and Invoicing are built and live on Domma CMS already. |
| CMS docs (`/cms/`, 13 pages) | **Move to cms.dommajs.org** (already a Domma CMS site), merged with what is there, and redirected. |
| Blog, feedback, login, admin, address, nexus, garage | Already removed (2026-10-10); their API backend is gone. |
| Behaviour in demos | **domma-reactive bindings** (`data-bind-*`, `data-on-*`, `data-model`, `data-each`, components), not inline scripts or `on*` attributes: the CMS sanitiser strips those, and bindings work under `script-src 'self'`. |

## What exists today (after the removals)

| Section | Pages | Notes |
|---|---|---|
| Home, about, FAQ, quickstart (3), privacy, cookies, changelog | ~9 | Prose and marketing. Changelog renders `data/releases.json`. |
| Showcase | 67 | Each page: prose + ~20 live demos (`.demo-area`) each followed by its code (`.code-block`). The heart of the site. |
| CMS docs | 13 | Domma CMS documentation - belongs on cms.dommajs.org. |
| Download | 10 | Bundle builder and kickstart builder (small JS apps) plus the files they hand out. |
| Data | - | `releases.json`, `features.json`, `carousel-slides.json`, `search-index.json`. |
| Layout plumbing | - | `layouts/config/*.json` (nav, footers, presets), `layouts/js/layout.js`. All replaced by CMS menus and layouts. |

## Where things go

| Today | In Domma CMS |
|---|---|
| Prose pages | Pages (`content/pages/*.md`), converted from HTML to Markdown and tidied. Hero and feature sections become blocks (`cta-banner`, `feature-card` style) rather than page HTML. |
| Top nav, footers | Menus in the `navbar`, `footer-primary`, `footer-legal` slots. |
| Showcase sidebar (`nav-showcase.json`) | A `showcase` menu, bound to the showcase pages through a Showcase **project**, so it shows only there. |
| Showcase pages | Pages of prose plus `[showcase-demo]` shortcodes (see below). |
| Changelog (`releases.json`) | A **Releases** collection, shown with `[collection display="timeline"]`. The release script adds an entry through the CMS API instead of rewriting a JSON file. |
| `features.json`, `carousel-slides.json` | **Features** and **Slides** collections, shown with `display="block"` / `display="carousel"`. |
| API reference tables in the showcase | An **API reference** collection (module, name, signature, description, since, example) shown as `[collection display="table"]` - so the public right-click menu gives readers filter, search, sort, group-by and export on the reference for free. |
| Site search (`search-index.json`) | Core site search. |
| Sitemap, robots, canonical tags | Core SEO. |
| Bundle and kickstart builders | Files served by the showcase plugin; the page around them is a normal page. |

## The showcase: how a demo works

The 67 showcase pages hold about 1,300 demos. Each needs three things to survive the move: the markup, the
behaviour, and the code shown beside it - and the code shown must be the code that runs.

**A `domma-showcase` plugin** (in this repo's site, not the marketplace) owns the demos:

- Each demo is a folder of files, `demos/<page>/<demo>/`: `demo.html` (markup, using bindings), `demo.js`
  (optional: the model and any setup, as an ES module exporting `mount(root)`), `demo.css` (optional).
  Demos are code, so they live in git and are reviewed as code, not as collection entries.
- `[showcase-demo id="elements/card/basic" /]` renders the demo area, then tabs of its HTML / JS / CSS
  source read from the same files (escaped and highlighted), so the code shown cannot drift from what runs.
- The plugin's page script loads only the `demo.js` modules for demos on that page, calls
  `mount(root)` for each, and isolates failures: one broken demo logs a warning and shows "This demo did
  not load", the rest of the page works (the same rule domma-reactive follows for bindings).
- **Reactive first**: `demo.js` builds its state with `M.observable` / `M.computed` and calls
  `M.applyBindings(model, root)`; markup uses `data-bind-*`, `data-on-click`, `data-model`, `data-each`,
  `data-component`. Demos that show imperative APIs (`$`, `E.*`, `H.*`) still do it inside `mount`.
- **Context menus** (authored, Content > Context Menus), bound to the Showcase project:
  - on a demo: *Copy HTML*, *Copy JS*, *Reset demo* (re-runs `mount`), *Open on its own* (a bare page with
    just that demo, handy for linking and for the CMS `[demo]` shortcode), *Report a problem* (a mailto
    with the demo id);
  - on a code block: *Copy*, *Copy as a page* (wrapped in a minimal HTML document with the Domma tags).
  These are built from the fixed action vocabulary plus one plugin-registered action if needed - never
  stored script.

**The converter** (`scripts/site-migrate/showcase.mjs`) does the bulk work: for each showcase page it reads
the HTML, writes prose sections to Markdown, and for each `.demo-area` + following `.code-block` pair writes
a demo folder and a `[showcase-demo]` line. Inline `<script>` blocks and `onclick` attributes are moved into
`demo.js` and flagged in a report for hand conversion to bindings. It runs on 3 pilot pages first
(`elements/card`, `elements/tabs`, `models` - static, interactive and reactive), is reviewed side by side
with the live page, then runs on the rest.

## Order of work

Each phase ends with a check before the next starts.

0. **Inventory and address map.** A script lists every page, its new address, and anything dropped.
   Old addresses (`/showcase/elements/card/index.html` and `/showcase/elements/card/`) map to new ones
   (`/showcase/elements/card`). *Check: every current page has a row.*
1. **The site.** Create `dommajs-site` in the fleet on dcm, previewed at **next.dommajs.org**. Theme to
   match the current look; navbar, footer and showcase menus; Showcase project. *Check: the skeleton
   renders on desktop and mobile.*
2. **Prose pages.** Home, about, FAQ, quickstart, privacy, cookies - converted and tidied, heroes as
   blocks. *Check: side by side with the live site.*
3. **Showcase plugin and converter.** Build both, run the 3 pilots, review, fix, then all 67 pages. Hand-
   convert the flagged demos to bindings. *Check: every demo mounts with no console error, and the
   converter report is empty.* Port the existing showcase page harness (`src/showcase-pages.test.js`,
   which loads every page against the built bundle and asserts it rendered and logged nothing; its
   baseline is empty) so it runs against the new site's pages, with the same empty baseline.
4. **Collections.** Releases (imported from `releases.json`), Features, Slides, API reference.
   Change `scripts/release*` so a release adds its changelog entry through the CMS API (a project-scoped
   API token). *Check: the changelog page matches today's; a dry-run release writes one entry.*
5. **Downloads.** The two builders as plugin files; the files they serve come from the Domma release
   (npm package or the build output), copied into the plugin by the release step. *Check: a bundle and a
   kickstart download and open.*
6. **CMS docs.** Merge the 13 pages into cms.dommajs.org; redirect each old address there. *Check: no
   page lost, every redirect answers 301.*
7. **SEO and redirects.** Redirect rules for every old address (from the phase 0 map), titles and
   descriptions, sitemap, search. *Check: a crawl of the old sitemap gets 200 or one 301 for every URL.*
8. **Review** on next.dommajs.org.
9. **Cut-over.** Point the dommajs.org vhost at the manager like the other fleet sites (as
   `sites.dommajs.org` already is). Keep `public/` and the old vhost file for a quick switch back; remove
   them after a few weeks without problems. *Check: the phase 7 crawl again, on the live domain.*

## Release in step

`docs/RELEASING.md` gains the second half of a Domma release:

1. Domma release as today (npm publish).
2. In domma-cms: bump `domma-js` to the new version, note it under `[Unreleased]`, cut a CMS patch release.
3. Roll the CMS to the fleet (`make fleet-update VERSION=…` in the manager). dommajs.org updates with it.
4. New showcase pages or demos for the release land in the same window, so a feature is documented on the
   day it can be used.

A showcase page for a feature newer than the CMS's Domma is saved as a **draft** until step 3.

## Risks

- **Demos that assume a whole page to themselves** (global listeners, `document.body` changes, fixed
  overlays). The converter flags these; `mount` gets a `teardown` for *Reset demo*.
- **Sanitiser vs demo markup.** Demo HTML is inserted by the plugin after sanitising the page, from files
  in git, so it is trusted the way theme files are; it still never contains `on*` handlers or inline
  scripts (bindings instead), which keeps CSP strict.
- **SEO.** 95 addresses change form. Every one gets a redirect from the phase 0 map before cut-over.
- **Performance.** Only the demo modules a page uses are loaded; the page is cached by the CMS response
  cache like any other.
- **Version gaps.** If a CMS release lags a Domma release, the showcase is briefly behind npm. That is the
  price of one Domma per page, and is why step 2 of release-in-step is done the same day.

## Not in scope

- Mini-apps (Domma Docs and Invoicing live on Domma CMS already).
- Examples.
- A blog, accounts, feedback form (removed with their backend).
