# Domma 1.0

### Changed

- **The API is stable.** From 1.0, a change that breaks working code needs a new major version: patch releases fix bugs, minor releases add features. 1.0.0 contains no code changes from 0.60.0. It marks the end of the road-to-1.0 work, done in 0.54 to 0.60:
  - **0.54:** globals and `noConflict`, imports that are safe in Node, packaging.
  - **0.55:** one set of conventions (`open`/`close`, `destroy()`, `E.get`, `dm:` events, one instance per call with `all()`), and each web component is a thin wrapper over its `E.*` component.
  - **0.56:** dropzone, range slider, command palette, split pane, virtual list, i18n and focus trap.
  - **0.57:** focus trapping in modals, slideovers, dialogs and popovers, and type declarations generated from the source.
  - **0.58:** the deprecated forms removed.
  - **0.59 / 0.60:** the type catalogue.
- **The docs describe the current API.** The README and Components guide still described the timeline alias and the array-shaped factory results as working; both were removed in 0.58.

<!-- website -->

<p>Domma 1.0 is the stable release. The API was settled in 0.54 to 0.60: one set of conventions across every component, web components that wrap the same code, seven new components, type declarations generated from the source and a type catalogue for tools. From now on, a breaking change needs a new major version. There are no code changes from 0.60.0.</p>
