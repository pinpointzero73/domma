<!--
The next release's notes. Write them here as the work lands.

"Cut a release" (Actions tab) moves them into docs/RELEASE_NOTES.md and
public/data/releases.json, stamped with the version and date, and resets this
file. It refuses to run while the title or either section is empty.

  - The line starting "# " is the release title, e.g. "# Readers That Hear Every Change".
  - Between the title and the website marker: the notes, in RELEASE_NOTES.md
    style - a bold lead paragraph, then emoji-headed groups of bullets.
  - After the website marker: the short HTML summary for releases.json -
    one or two <p> elements.

This comment is instructions only and is never copied.
-->

# Built On A Typed Core

**No change in behaviour - Domma is now built against domma-reactive 1.1.0.** The reactive engine
under `M.computed`, `M.effect` and `M.applyBindings` is the same code as in 0.44.3: 1.1.0's only
change is that the standalone package now ships TypeScript declarations.

🧩 **domma-reactive 1.1.0**

*   Domma inlines domma-reactive into its own bundle, so the declarations do not come with it - Domma
    itself ships no TypeScript types. If you use `domma-reactive` directly, installing 1.1.0 gives
    you typed `observable`, `computed` and friends, with a read-only computed refusing assignment at
    compile time.

*   Nothing to change when upgrading.

<!-- website -->

<p><strong>No change in behaviour.</strong> Domma is now built against domma-reactive 1.1.0, whose only change is that the standalone package ships TypeScript declarations. Domma inlines the engine, so its own API is untouched and nothing needs changing when upgrading.</p>
