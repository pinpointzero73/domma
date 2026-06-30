### v0.29.1 - Table Re-render Icon & Tooltip Fix (2026-06-30)

🐛 **Bug Fixes**

*   **`Table` icons & tooltips now survive re-renders:** `TableInstance.render()` rebuilds the entire table subtree (`innerHTML`) on every state change — search, sort, pagination, page-size, filter and column toggle all route through it. Consumer cell markup produced by `col.render()` (`data-icon` spans and `data-tooltip` triggers) was only processed after the *initial* render, so action-button icons and tooltip popovers vanished the moment a user paginated, searched or sorted. `render()` now re-scans icons and re-wires tooltips on the rebuilt subtree via a new `_reinitRenderedContent()` step (mirrors `Form._initTooltips`), so table content stays live across every re-render. The icon half completes the long-dormant `_restoreIconsBeforeRebuild()` path, which converted rendered SVGs back to `data-icon` spans but never re-scanned them.

---

### v0.19.7 - Card Accent Variant (2026-03-17)

✨ **Enhancements**

*   **`.card-accent` CSS Classes:** The left-border accent pattern is now a set of five first-class card variant classes instead of an inline style workaround:
    *   `.card-accent` — primary colour left border (`--dm-primary`)
    *   `.card-accent-success` — success green (`--dm-success`)
    *   `.card-accent-danger` — danger red (`--dm-danger`)
    *   `.card-accent-warning` — warning amber (`--dm-warning`)
    *   `.card-accent-info` — info sky (`--dm-info`)
*   **`--dm-card-accent` Theme Variable:** Added to all 26 theme files as a primary-colour alias, enabling per-theme accent customisation and supporting the JS `color: 'accent'` API option.
*   **Showcase:** Dedicated *Card Accent* section added to the Elements showcase; inline `border-left` style on the elements index replaced with the new class.

🧹 **Repo Hygiene**

*   Removed stale backups: `src/css/domma.css.original`, `public/showcase/css/domma.css.original`.
*   Removed stale TODO file: `public/showcase/elements/CSS_CUSTOMISATION_SECTIONS_TODO.md`.
*   Removed empty directories: `public/showcase/js/`, `public/showcase/examples/`.
*   Added `.superpowers/`, `firebase-debug.log`, and `release.json` to `.gitignore`.
*   Fixed `src/CLAUDE.md` file reference: `quick-roller.js` → `page-roller.js`.

---

### v0.19.0 - Unicorn & Dreamy Themes + Codebase Cleanup (2026-03-04)

✨ **New Themes**

*   **Unicorn Light** (`unicorn-light`) — Amethyst purple primary (`#9b59b6`), hot pink secondary (`#e91e90`), white surfaces with faint lavender tint, dark aubergine text (`#2d1b3d`), light purple borders (`#e1bee7`).
*   **Unicorn Dark** (`unicorn-dark`) — Deep purple-black backgrounds (`#1a0e24` / `#241432`), lighter purple primary (`#ce93d8`) and lighter pink secondary (`#f48fb1`) for dark-mode contrast, muted purple borders (`#4a2660`).
*   **Dreamy Light** (`dreamy-light`) — Warm brown primary (`#8d6e63`), dusty rose-brown secondary (`#a1887f`), warm cream surfaces (`#fffdf9` / `#f5f0eb`), dark chocolate text (`#3e2723`), light biscuit borders (`#d7ccc8`).
*   **Dreamy Dark** (`dreamy-dark`) — Dark espresso backgrounds (`#1c1410` / `#2a1f1a`), lighter taupe primary (`#bcaaa4`) for contrast, warm off-white text (`#efebe9`), dark brown borders (`#4e342e`).

🚀 **Enhancements**

*   **Theme Registration (all 6 surfaces):** Both themes registered in `AVAILABLE_THEMES` and `listBases()` in `src/theme.js`; added to `scripts/build-css.js` so they compile into `domma-themes.css`; added `<optgroup>` blocks to the Theme Roller dropdown; added gradient swatch CSS rules and dot buttons to `public/layouts/js/layout.js` (variant count 16 → 20); added to the Kickstart Builder theme selector.

🧹 **Housekeeping**

*   Removed 3 source backup files (`dom.js.backup-*`, `elements.js.backup-xss-*`), 3 celebration theme `.bak` files (superseded), `debug-wizard.html`, `firebase-debug.log`, `coverage/` directory, and `.playwright-mcp/` screenshot cache.

---

### v0.15.0 - Effects Motion Preference Fix (2026-02-14)

🐛 **Bug Fixes**

*   **Effects Motion Preference Override:** Fixed critical issue where `reveal()` and `ripple()` effects were being disabled by CSS media queries even when JavaScript explicitly set `respectMotionPreference: false`. Effects now properly respect the JavaScript override setting.
    *   Added `data-force-animation` attribute to elements when motion preference should be ignored
    *   Updated CSS `@media (prefers-reduced-motion: reduce)` queries to exclude elements with `data-force-animation` using `:not()` selector
    *   Fixed ripple effect to apply attribute to dynamically created ripple elements
    *   Ensures showcase demo pages work correctly regardless of user's system motion preferences

*   **Showcase Effects Pages:** Cleaned up effects showcase pages by removing references to obsolete `overrideMotionPreference` variable
    *   Updated breathe.html, shake.html, and counter.html to use `respectMotionPreference: false` consistently
    *   Fixed 14 remaining references across 3 showcase files

### v0.13.4 - Enhanced Celebrations & Particle Fixes (2026-02-08)

✨ **Features & Enhancements**

*   **Global Celebrations System:**
    *   **Resolved 'Invalid particle values' errors:** Fixed initialization issues across Halloween, Guy Fawkes, Christmas, St. Patrick's, St. George's, St. David's, and St. Andrew's themes by ensuring proper `vx`, `vy`, `static`, `x`, and `y` initializations for all particles.
    *   **Christmas Snow Rendering:** Corrected Christmas snow rendering to appear as distinct snowflakes instead of amorphous blobs.
    *   **Witch's Broomstick Orientation:** Fixed the witch's broomstick orientation in the Halloween theme.
    *   **Halloween Batman Logo:** Implemented a dynamic Batman logo appearing periodically on the moon in the Halloween theme.
    *   **Halloween Fork-Lighting:** Introduced a procedural fork-lighting effect for the Halloween theme.
    *   **Guy Fawkes Fork-Lighting:** Extended the procedural fork-lighting effect to the Guy Fawkes theme.
    *   **Guy Fawkes Catherine Wheel:** Visually overhauled the Catherine Wheel in the Guy Fawkes theme for a more realistic and dynamic effect, including detailed structure, dynamic spark emission, and pulsing glows.

### ✨ Features

*   **New Timeline Component**: Introducing a versatile, data-driven timeline component with multiple layouts (vertical, horizontal, centered), animations, and theming options.
*   **Privacy & Consent Module**: Added a new consent banner that ensures analytics tracking is performed only after obtaining user consent, enhancing user privacy.
*   **Glow CSS Utilities**: Added a new set of `glow-*` CSS utility classes to apply eye-catching text-shadow effects, including hover variants.
*   **New `help-circle` Icon**: A new `help-circle` icon has been added to the UI icon set.

### 🚀 Enhancements

*   **Analytics Update**: The analytics script now respects user privacy by checking for consent before tracking page views.
*   **Theme Improvements**: The `charcoal-light` theme has been updated with darker text for better contrast and improved primary button colors on hover/active states.
*   **Navigation**: Added a "Privacy Policy" link to the main navigation and footer.
*   **CDN Links**: The download page has been updated to use jsDelivr CDN links for artifact downloads.