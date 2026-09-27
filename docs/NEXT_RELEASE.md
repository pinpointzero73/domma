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

# Installs Without The Dev Server

**Installing domma-js no longer installs a development web server.** `live-server` was listed as an
optional dependency as well as a dev one, so every project that depends on domma-js - every Domma
CMS site among them - pulled it in with about 180 more packages, several of them old and carrying
known vulnerabilities, for a command most of them never run.

📦 **Packaging**

*   `live-server` is now a dev dependency only. The library itself never used it.

*   `npx domma-js serve` still works: it already asks to install `live-server` the first time it is
    needed, and does so on a yes.

<!-- website -->

<p><strong>Installing domma-js no longer installs a development web server.</strong> <code>live-server</code> was an optional dependency, so every project using domma-js pulled it in with about 180 more packages; it is now a dev dependency only, and <code>domma-js serve</code> still offers to install it when first run.</p>

