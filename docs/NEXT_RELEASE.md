# Added: a type catalogue for editors and tools

### Added

- **A type catalogue for tools that cannot run TypeScript.** `assets/types/catalogue.json` (`domma-js/types/catalogue.json`) lists every component `$.setup()` can create, its factory and its options: each option's kind (boolean, number, string, the values of an enum, ...) and its doc line, read from the generated declarations. `npm run build:types` writes it and `npm run check:types` fails when it is stale. Domma CMS's page editor uses it to check a page's config.

### Fixed

- **`$.setup()` gives `cookieConsent`, `notification` and `alarm` their options.** They were called with the selector in place of the options, so a config's options for them were dropped.
- **Setup config types say what works.** `initial` and event `text` / `html` / `attr` values take numbers and booleans (they are converted to text), and a `form` component's options are typed as `FormSetupOptions` - its own options plus `schema` and `data`.

<!-- website -->

<p>This release ships a JSON catalogue of every component's options, made from the generated types, so editors and other tools can check a configuration without running TypeScript.</p>
