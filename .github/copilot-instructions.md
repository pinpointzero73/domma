# Domma repository instructions

## Commands

- Use Node.js 24 or newer (`package.json` specifies `>=24`) and install with `npm install`.
- `npm run build` builds all distribution artefacts: bundles, metadata, themes, CSS, preset archives, Kickstart files, and miniapps.
- `npm run build:js` rebuilds Rollup JavaScript bundles; `npm run build:css` rebuilds CSS from `src/css/`.
- `npm test` runs Vitest in watch mode. Run the full suite once with `npx vitest run`.
- Run one test file with `npx vitest run src/models.test.js`; target an individual test with `npx vitest run src/models.test.js -t "test name"`.
- `npm run validate` runs the CSS-class, theme-contrast, contrast-pair, Domma-convention, and site-contrast validators. These are ratchets: do not update a baseline merely to suppress a new regression.
- `npm run validate:showcase` runs the jsdom showcase harness. It requires current JavaScript bundles (`npm run build:js`) when framework code has changed.

There is no separate lint script. Do not start a development server: one is normally already running.

## Architecture

- Domma is an ESM JavaScript framework. `src/index.js` is the full public entry point: it assembles modules into `Domma`, exposes aliases (`$`, `_`, `M`, `D`, `S`, `A`, `F`, `H`, `E`, `I`, `T`, `R`, `B`), and installs them on `window` in browsers.
- Core implementation lives in `src/`. `src/dom.js`, `utils.js`, `dates.js`, `models.js`, `elements.js`, `tables.js`, `forms.js`, and the supporting modules define the framework; neighbouring `*.test.js` files are the unit/integration tests and run in jsdom.
- `rollup.config.js` produces the full UMD/ESM bundles, tools, syntax, flags, editor extensions, and preset bundles. Preset entry points are generated/maintained in `src/bundles/`. `public/dist/` is generated and ignored; edit source modules and build scripts, not bundle output.
- CSS sources are `src/css/domma.css`, `grid.css`, and `elements.css`; the build writes their counterparts to `public/dist/`. Theme sources are copied/generated separately. Public pages must load CSS in order: base, grid, elements, then themes.
- `public/` is the static documentation/site/showcase. The showcase harness executes every showcase page against the built bundle, so framework changes that affect browser behaviour must keep relevant demos error-free.
- `templates/kickstart/` and `templates/kickstart-spa/` are published scaffold sources. `scripts/build-kickstart-files.js` copies them plus distribution assets into ignored `public/download/kickstart-files/` and generates `public/download/kickstart-manifest.json`; never hand-edit those generated outputs.
- `domma-reactive` and `domma-celebrate` are published npm dependencies. Changes to sibling checkouts do not affect this repository; release a dependency and update its `package.json` version instead.

## Repository conventions

- Prefer Domma APIs in framework-owned browser code and showcase material: `$()` for DOM/events, `_` for utilities, `D()` for dates, `S` for storage, `H` for HTTP, `M`/blueprints for reactive data and forms, `E` for UI components, and `I` for icons. The convention validator flags direct `document.querySelector`, `addEventListener`, `new Date()`, `fetch()`, and `localStorage` in applicable pages.
- Use external `templateUrl` files for non-trivial router/component views; keep inline templates to very small snippets. Pair reusable sections with router `partials`.
- When adding or changing a public API, update its documentation, showcase example, and PHPStorm code-intelligence definitions under `public/assets/ide/phpstorm/`. Add new public pages to `public/sitemap.xml`.
- Build CSS before class/theme validators because they inspect `public/dist/*.css`. Validator baselines are intentional technical-debt records; lower them only when a finding is fixed.
- Use British English in new code comments and documentation.
- Consult the closest distributed `CLAUDE.md` before changing `src/`, a showcase subtree, bundles, or Kickstart templates; those files contain area-specific contracts.
