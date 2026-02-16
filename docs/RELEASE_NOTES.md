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