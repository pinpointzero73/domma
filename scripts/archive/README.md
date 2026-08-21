# Archived one-off scripts

These are **spent, single-use** migration/patch scripts. They have already been
run and their changes are baked into the source tree. They are kept here for
reference/history only - none are part of any build or release flow.

| Script | Purpose | Status |
|--------|---------|--------|
| `apply-xss-fix.sh` | Patched XSS sanitisation into `src/dom.js` | Applied - sanitisation now lives in `src/dom.js` |
| `apply-elements-xss-fix.sh` | Patched XSS sanitisation into `src/elements.js` | Applied - sanitisation now lives in `src/elements.js` |
| `add-csp-meta-tags.sh` | Injected CSP `<meta>` tags into public HTML | Applied (one-shot) |
| `fix-code-blocks.cjs` | Fixed `<pre>` indentation in showcase HTML | Applied (one-shot) |

Do not wire these into `package.json` or the build. If a similar migration is
needed in future, copy one out as a starting point rather than running it in place.
