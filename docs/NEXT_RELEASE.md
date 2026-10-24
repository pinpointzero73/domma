# Safer escaping, Node imports, noConflict and a quieter install

### Security

- Escape `"` and `'` everywhere Domma escapes text. The old helpers left quotes alone, so a prompt's prefilled value, a modal button id or a schema-builder field name could close its attribute and add a script handler.
- Sanitise card `content` and `setContent()` as `$().html()` does. The check called a misspelt function, so card HTML went in raw. Like `.html()`, this removes buttons, inputs, SVG and `data-*` attributes (so `data-icon` too), and escapes everything when DOMPurify is not loaded; pass `{safe: false}` for trusted markup.
- Escape progression priorities and treeview icon and colour values.

### Fixes

- Import Domma in Node (SSR, Astro, plain vitest) without `HTMLElement is not defined`.
- Router: uses its own modules rather than `window.$`/`M`/`_`/`I`, so it works with `globals: false` or after `noConflict()`; a template that fails to load no longer stops all later navigation; `destroy()` removes its listener; params are decoded; `#/search?q=x` matches `/search` and gives `to.query`; a blocked navigation puts the previous address back; `next('/login')` redirects.
- HTTP: 204, `head()` and empty or non-JSON responses resolve instead of throwing; `FormData`, `Blob` and other raw bodies are sent as they are; falsy bodies are sent; `delete()` sends no body unless given one; new `timeout` option; errors carry `status` and `body`.
- HTTP now sends cookies to the same origin only (`credentials: 'same-origin'`). Pass `credentials: 'include'` for a cross-origin API that needs them.
- Auth keeps the token through a network error or a 5xx; only a 401/403 signs the user out.
- `Component.on()`/`off()` work, Popover and Sortable included; the `timeline()` deprecation warning shows once and can be silenced.

### New

- `Domma.noConflict()` hands `$` and `_` back to jQuery or Lodash; `noConflict(true)` hands back every short alias (`window.Domma` stays).
- `window.DommaOptions` (set before Domma loads): `globals: true | 'safe' | false`, `cloak`, `theme`, `purifyWarning`, `deprecationWarnings`.
- `Domma.isDomma(value)`.

### Packaging

- No install script: the interactive `postinstall` prompt is gone (`npx domma setup-ai` does the same).
- No runtime dependencies: the unused `@fastify/cors` is removed.
- Sourcemaps ship beside the bundles, and `package.json` has an `exports` map (every existing deep path still resolves).
- Types match the real named exports and declare `DommaOptions`.

<!-- website -->

<p>Quote-safe escaping everywhere, sanitised card content, Node-safe imports, <code>Domma.noConflict()</code>, router and HTTP fixes, and an install that runs no scripts.</p>
