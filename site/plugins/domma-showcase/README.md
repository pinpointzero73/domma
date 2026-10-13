# Domma Showcase

The maintained source for the live showcase at dommajs.org. This plugin owns
both the live demos and the presentation of the surrounding documentation.

## Content and presentation

- `public/demos/`: authored HTML, JavaScript and optional CSS for each demo.
- `public/presentation.js` and `presentation.css`: topic cards, feature grids,
  method references, code toolbars, and syntax colours on every `/showcase` page.
- `public/showcase.js`: isolated demo mounting, reset, syntax loading, clipboard
  actions and the code/demo context menus. Code created in modals is enhanced too;
  editable code fields retain their own controls.
- `public/reference-catalogue.js`: page summaries and method descriptions generated
  from maintained Markdown and framework source comments.
- `scripts/site-migrate/pages/showcase/` in the repository: maintained page content.
  A running site's frontmatter and admin edits must be preserved when applying it.

## Updating

From the repository root:

```sh
node scripts/site-migrate/showcase-catalogue.mjs
node scripts/site-migrate/demo-styles.mjs
node scripts/site-migrate/stamp-showcase-assets.mjs
```

The last command hashes the styles, script and module dependencies so a change to
a helper or reference catalogue is picked up by existing browser caches.

`recover-showcase-content.mjs` documents and repairs the controls and results split
by the migration. `showcase.mjs --restore-layouts` restores missing layout frames;
it does not cover prose, reference lists or code usability. Hand-edited demos and
pages are listed in `hand-upgraded.txt` and protected from forced regeneration.

## Reviewing a sweep

Review every maintained page, including content below the opening viewport:

- Method lists have grouped names and descriptions; feature lists have cards.
- Topic headings remain usable from the page contents navigation.
- Every read-only code box has a visible Copy button and a code context menu.
- Recognised code languages have syntax colours that work in light and dark themes.
- Copy writes the source only, preserving whitespace and excluding toolbar labels.
- Controls update their own examples and results, including after a demo reset.
- Desktop and phone layouts contain wide samples and tables without widening the page.

Checking only for JavaScript errors or missing grid wrappers is insufficient.
