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
| Showcase | 92 | Each page: prose + ~20 live demos (`.demo-area`) each followed by its code (`.code-block`). The heart of the site. |
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
| `features.json` | The **Modules** collection, shown with `display="block"` (done in phase 2). `carousel-slides.json` is not carried over: its carousel was commented out. |
| API reference tables in the showcase | An **API reference** collection (module, name, signature, description, since, example) shown as `[collection display="table"]` - so the public right-click menu gives readers filter, search, sort, group-by and export on the reference for free. |
| Site search (`search-index.json`) | Core site search. |
| Sitemap, robots, canonical tags | Core SEO. |
| Bundle and kickstart builders | Files served by the showcase plugin; the page around them is a normal page. |

## The showcase: how a demo works

The 92 showcase pages hold about 1,300 demos. Each needs three things to survive the move: the markup, the
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
with the live page, then runs on the rest (all 92).

## Order of work

Each phase ends with a check before the next starts.

0. **Inventory and address map.** A script lists every page, its new address, and anything dropped.
   Old addresses (`/showcase/elements/card/index.html` and `/showcase/elements/card/`) map to new ones
   (`/showcase/elements/card`). *Check: every current page has a row.*

   **Done 2026-10-10.** `node scripts/site-migrate/address-map.mjs --check` writes
   `docs/plans/dommajs-address-map.csv` (for review) and `.json` (for the phase 7 import):
   132 pages and 249 old addresses - 102 pages kept, 13 merged into cms.dommajs.org, 17 dropped
   (examples, mini-apps); 157 addresses need a 301, 15 are gone (410), 77 need nothing because
   Domma CMS serves `/a/b/` as `/a/b` (and a rule between them would point at itself). Every
   sitemap address has a row. Two CMS docs pages, *Configuration* and *Media*, have no page on
   cms.dommajs.org yet - phase 6 writes them; until then they redirect to `/features`. The
   showcase is 92 pages, not 67: the 25 single pages under `effects/`, `models/`, `forms/` and
   `config/` count too. My Garage redirects to its Domma CMS Tool page.
1. **The site.** Create `dommajs` in the fleet on dcm, previewed at **dommajs.sites.dommajs.org**. Theme to
   match the current look; navbar, footer and showcase menus; Showcase project. *Check: the skeleton
   renders on desktop and mobile.*
   **Done 2026-10-10.** The site is `dommajs` in the fleet (port 4111), previewed at
   https://dommajs.sites.dommajs.org - the fleet's wildcard address, so no vhost or certificate is
   needed until cut-over (next.dommajs.org is dropped). `scripts/site-migrate/menus.mjs` converts
   the old nav files to `main` (navbar), `footer` (four columns) and `showcase` menus through the
   address map; `scripts/site-migrate/apply-site.mjs <site-dir>` applies them with the theme
   (charcoal-dark, Roboto, light/dark switcher) and the Showcase project (`/showcase`), and is
   safe to re-run. Checked on desktop and mobile: renders, no console errors.

   **Correction (phase 2):** there is no sidebar gap. On the old site every layout's navbar was
   the dropdown menu (`nav-showcase.json`; `nav-public.json` was unused), and showcase pages'
   sidebars were generated from the page's own sections - which is what the CMS's *With Sidebar*
   layout already does. So `main` is now the dropdown menu and there is no separate showcase menu.

2. **Prose pages.** Home, about, FAQ, quickstart, privacy, cookies - converted and tidied, heroes as
   blocks. *Check: side by side with the live site.*
   **Done 2026-10-10.** Home, about, FAQ, QuickStart (hub, SPA, MPA), privacy and cookies are
   rewritten as Markdown with shortcodes in `scripts/site-migrate/pages/` and installed by
   `apply-site.mjs`, along with `blocks/` (the `module-tile` block), `media/` (the logo),
   `custom.css` (site styles - the CMS reads it at boot, so restart after changing it) and
   `collections/` (a **Modules** collection: the 21 module tiles on the home page, grouped Core /
   Data / UI / Tools, reusable by the showcase index). Each page was checked in a browser on desktop
   and phone: renders, no unrendered shortcodes, no console errors. Facts brought up to date: the
   bundle is about 175 KB gzipped (not ~260 KB), 14 themes each light and dark, and the scaffolds'
   real layout (`frontend/pages/`, views with `templateUrl`). The home page's slide carousel was
   commented out on the live site, so there is no Slides collection. The SPA QuickStart's live
   router demo becomes a `[showcase-demo]` in phase 3; for now it links to the Router showcase.
   **For review:** the privacy and cookie pages are carried over with only the passages about
   accounts, the privacy dashboard and the removed API taken out, and Google Fonts and jsDelivr
   named as the third parties the new site loads; the legal wording is otherwise unchanged and
   should be checked against what the new site actually does (CMS analytics, consent banner).

3. **Showcase plugin and converter.** Build both, run the 3 pilots, review, fix, then all 67 pages. Hand-
   convert the flagged demos to bindings. *Check: every demo mounts with no console error, and the
   converter report is empty.* Port the existing showcase page harness (`src/showcase-pages.test.js`,
   which loads every page against the built bundle and asserts it rendered and logged nothing; its
   baseline is empty) so it runs against the new site's pages, with the same empty baseline.
   **Pilots done 2026-10-10** (`elements/card`, `elements/tabs`, `models`: 40 demos). What exists:
   - `site/plugins/domma-showcase/` - the plugin (installed and enabled by `apply-site.mjs`). The
     `[showcase-demo]` shortcode leaves a placeholder; a `markdown:afterParse` transform swaps in the
     demo after sanitising, with HTML/JS/CSS source tabs read from the same files. `showcase.js`
     mounts each demo (`mount(root) -> teardown`), isolates failures, and adds the right-click menu
     (copy HTML / JS, reset, open on its own - `/api/plugins/domma-showcase/demo?id=…`).
   - `scripts/site-migrate/showcase.mjs <page…>` - the converter. Demos are found by class *and* by
     what the page script touches; the script is split per demo with acorn (declarations follow
     their users); markup is re-indented by depth. It never overwrites a demo or page that exists.
   - `scripts/site-migrate/demo-styles.mjs` - 19 of the old sheet's 305 rules, the ones for classes
     the demos use (including classes built in bindings), never Domma's own.

   **Upgrading as we go** is part of the conversion. Automatic: the `E.` alias, toasts instead of
   `alert()`, selectors scoped to the demo, `<li>` tabs as buttons with tab roles, typed buttons.
   By hand, for every demo the converter flags (page-wide listeners, event subscriptions, timers,
   HTML built from strings): bindings (`data-model`, `data-bind-*`, `data-each`, `data-on-*`), a
   teardown for anything that outlives the demo, skeletons instead of "Loading…", British spelling
   and £. Each upgraded demo is driven in a headless browser before it counts as done. Patterns
   that work: bind a Model through `model.tracked()`; put list-row handlers on the data object
   (`$root.edit($data)`); show `set()`'s thrown validation message rather than binding straight to
   a validated field.

   **Found and fixed in Domma CMS (1.6.9):** the *With Sidebar* layout had never worked (empty
   contents, content squeezed to 10px). It now lists the page's sections, keeps its column, sticks
   below the navbar and marks the section being read - the "floating" upgrade of the old fixed
   sidebar. **Domma follow-up:** in domma-reactive, `options.methods` are not reachable from inside
   a `data-each` row (`edit($data)` "did not resolve to a function"); they should be.

   **Done 2026-10-10 - all 91 pages, 770 demos.** `node scripts/site-migrate/check-site.cjs --reset`
   (the browser check: every page under `pages/`, every demo mounts, no console error, and every
   demo reset through its right-click menu tears down and mounts again) passes with nothing to
   report. The jsdom harness was not ported: a real browser against the real site checks more.
   - The converter learned, page by page: shared helpers and data copied into every demo that uses
     them; adjacent blocks merged into one demo; a demo whose element the script targets keeps it;
     helpers, components and custom bindings follow the markup that uses them; `getElementById`
     and bare id strings count; `window.x = function` becomes a local function; relative pictures
     are copied into the plugin, placeholder-service ones become SVG files; CSS the old pages
     injected from script is kept (`demo-styles.mjs`). What it cannot place is dead code or the old
     page's own furniture (a section accordion, a breakpoint badge, a clock with no markup).
   - Hand upgrades are listed in `scripts/site-migrate/hand-upgraded.txt`, which `--force` never
     overwrites: teardowns for every interval, subscription, page-wide effect and listener; 25
     demos moved from HTML strings to bindings (3 kept on purpose - see the commit); bugs fixed on
     the way (a dozen, from never-working buttons to page-wide lookups).
   - The showcase index (`/showcase`) is drawn from the Modules collection, which now covers every
     showcase page (`[dommajs-modules /]`); the home page and its CMS band are rebuilt to match the
     old one (`[dommajs-hero /]`, `[dommajs-cms-band /]`) in the `dommajs-site` plugin, which also
     gives every hero its blobs and the page its stars, and brings back the seasonal celebrations
     disc. Celebrations is a showcase page now (the example page was the only one worth keeping).
   - Layout (asked for): the main menu is a vertical rail on the right with an icon on every item,
     Home first and the theme switcher last (Domma CMS 1.6.11's new menu item); the contents list
     is on the left; heroes run the full width at half the old height.
   - `apply-site.mjs` writes the theme and menus only for a new site (`--theme`, `--menus` to force)
     and `--reseed` refuses when the site's entries are not the ones last installed - so nothing
     edited in the admin is overwritten.

   **Domma bugs found:** factory modals (`E.createModal` / `E.showModal`) showed their HTML as text
   and drew no buttons - fixed in domma PR #32 (not yet released; the showcase's form-in-a-modal demo
   uses `F.modal` meanwhile, and the other seven factory-modal demos will work once it is). Also
   `Domma.component()` throws if a name is registered twice (a demo reset does that); the showcase
   script skips the repeat for now - Domma could do it itself.

4. **Collections.** Releases (imported from `releases.json`) and API reference (Modules is done).
   Change `scripts/release*` so a release adds its changelog entry through the CMS API (a project-scoped
   API token). *Check: the changelog page matches today's; a dry-run release writes one entry.*
   **Releases done 2026-10-11 (without a token or a release-script change).** The release already
   writes its website summary into `public/data/releases.json`, and that file ships in the tagged source
   the `domma-downloads` plugin fetches anyway. After each sync the plugin adds the versions the
   Releases collection lacks (`lib/changelog.js`); it never touches an existing entry, so admin
   corrections stay. `scripts/site-migrate/releases.mjs` seeds the collection (82 entries, the early
   undated notes included) with the same rule. `/changelog` is `[collection display="timeline"]` with
   the version as the marker, as before. Checked: seeded without v0.51.9, the plugin added it on start.
   **API reference done 2026-10-11.** 741 entries (call, module, description, signature, example,
   showcase page), generated by `scripts/site-migrate/api-reference.mjs` from the IDE declarations in
   `public/assets/ide/phpstorm/` (the only complete list of public calls), with examples from
   `docs/API.md` where it has one (113). `/showcase/reference` shows them as a searchable, sortable,
   exportable table above the old cheat sheet. No `since` field: nothing records when a call arrived.
   Re-run the script after a release that changes the declarations, then `apply-site --reseed`.
5. **Downloads.** The two builders as plugin files; the files they serve come from the Domma release
   (npm package or the build output), copied into the plugin by the release step. *Check: a bundle and a
   kickstart download and open.*
   **Done 2026-10-11 (differently, and better).** No release-step change was needed: every Domma
   release already attaches its whole `dist` to GitHub, and the repository is public. The
   `domma-downloads` site plugin fetches the latest release itself - on start, every six hours, ten
   minutes after a failure - into its `data/` (the source at the tag, the dist unpacked into it, and
   the release's own `scripts/build-kickstart-files.js` run over them), and keeps two releases.
   The page (`/download`, `[domma-downloads /]`) offers Kickstart (zipped in the browser from the
   release's manifest), the core library, presets, CSS and extras with real sizes, and a **custom
   bundle builder that really builds**: the release's generator and rollup set-up on the server,
   the exact tool versions it names installed once, the result zipped with its CSS and a README and
   cached per selection (one build at a time; ten new builds an hour per visitor). All bindings.
   Note: Domma's `bundle-metadata.json` sizes are years stale (it says Essentials is ~180 KB; it is
   611 KB), so the page shows built sizes, never estimates - the metadata wants refreshing in Domma.
6. **CMS docs.** Merge the 13 pages into cms.dommajs.org; redirect each old address there. *Check: no
   page lost, every redirect answers 301.*
   **Done 2026-10-11.** The 13 old pages were checked against cms.dommajs.org and the current engine:
   most of what they said is out of date (roles, file paths, config keys, Pro set-up, API shapes) and
   was left behind. What is still true and was missing went into features/forms, collections, admin,
   users-and-security, components-blocks, page-editor and marketplace; two new pages,
   features/configuration and features/media, replace the old Configuration and Media; the features
   hub links both. `/cms/plugins/` now goes to /features/marketplace (cms.dommajs.org's /plugins is
   itself a redirect to /tools). Content changes are in the dcms-domma-cms-site repo. The redirects
   themselves answer once dommajs.org is cut over (phase 7 imports the map). Not carried over: a short
   contact-form tutorial and an Actions tutorial would fill the only gaps the old Tutorials page showed.
7. **SEO and redirects.** Redirect rules for every old address (from the phase 0 map), titles and
   descriptions, sitemap, search. *Check: a crawl of the old sitemap gets 200 or one 301 for every URL.*
   **Done 2026-10-11.** `scripts/site-migrate/redirects.mjs <site>` turns every 301 and 410 row of the
   map into an SEO > Redirects rule (168), each checked by the engine's own `checkRule()`; existing rules
   are kept and a re-run adds nothing. `/admin/` and `/api/` cannot be redirected - the CMS owns them.
   `scripts/site-migrate/crawl-old.mjs [--base=…]` is the check: all 245 old addresses answer as the map
   says (200, one 301 to a 200, or 410), no chains. Every page has a title and a description (none
   duplicated, none over 165 characters); the sitemap lists all 103 pages and each answers 200; site
   search finds them. **For cut-over (phase 9):** set Site Settings > Site URL to `https://dommajs.org` -
   until then the sitemap and robots.txt name the host that was asked, over http - then re-run
   `crawl-old.mjs --base=https://dommajs.org`.
8. **Review** on dommajs.sites.dommajs.org.
   **Pre-review done 2026-10-11** (the review itself is the owner's): `check-site.cjs --reset` - 103 pages,
   770 demos, all clean; `check-links.mjs --external` - every link resolves (npm answers bots 403);
   demo links re-pointed (`demo-links.mjs`, 128 links), five wrong or empty prose links fixed; one `h1`
   per page except demos that show heroes; the home hero fixed on phones. The changelog's centred
   timeline needs domma PR #35 (released, re-pinned and rolled) to stack on phones. Found, not fixed
   (Scribe is in hand elsewhere): character-mode Scribe draws each letter as an inline-block, so text
   wraps mid-word - the dommajs tagline works round it in its own CSS.
9. **Cut-over.** Point the dommajs.org vhost at the manager like the other fleet sites (as
   `sites.dommajs.org` already is). Keep `public/` and the old vhost file for a quick switch back; remove
   them after a few weeks without problems. *Check: the phase 7 crawl again, on the live domain.*
   **Done 2026-10-12.** The manager's dommajs site has `dommajs.org` and `www.dommajs.org` (primary
   `dommajs.org`; `dommajs.sites.dommajs.org` kept); its Site URL is `https://dommajs.org`. The vhost
   (`/etc/apache2/sites-enabled/dommajs.org.conf` - a file of its own, not a link to sites-available)
   proxies to the manager on 127.0.0.1:8192, keeps `.well-known`, awstats and cgi-bin on Apache, sends
   http, www and mail to `https://dommajs.org`, and keeps the webmail/admin redirects. The old one is
   `dommajs.org.conf.bak-pre-cms-20261012` beside it (switch back: copy it over and reload);
   `public/` is untouched. Checked on the live domain: all 245 old addresses as the map says, all 103
   sitemap pages 200, key pages and their demos clean in a browser. **Remove after a few weeks without
   problems:** the backup vhost and the old static site in `public/` (and the `/api` proxy to :3000 that
   only the sites-available copy still names).

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
