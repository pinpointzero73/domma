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

# Corporate Presence and High-Visibility Admin Slate

**Domma adds five new themes: the executive Corporate suite and the high-visibility Admin Slate trio.** Corporate brings an authoritative, polished aesthetic for business dashboards, portals, and executive reporting. Admin Slate completes the Admin theme matrix with a balanced mid-tone finish engineered for daylight readability and extended administrative workflows.

🏢 **Corporate theme suite**

*   `corporate-light` pairs an alabaster background (`#f8fafc`) and crisp card surfaces (`#ffffff`) with deep slate typography (`#0f172a`) and executive navy blue accents (`#1e40af`).

*   `corporate-dark` delivers an obsidian sapphire canvas (`#0b0f19`) and elevated dark surfaces (`#151c2c`) with high-contrast text (`#f8fafc`) and cobalt blue highlights (`#2563eb`), with WCAG AA-tuned danger and hover tokens.

*   Both variants meet strict WCAG AAA and AA contrast targets across all core controls, tables, badges, and modals.

🛡️ **Admin Slate mid-tone themes**

*   Expands the Admin theme matrix from 2×3 to a full 3×3 matrix across three finishes: Smooth (pastel), Slate (balanced mid-tone), and Sharp (deep charcoal).

*   Three new variants — `admin-slate-steel`, `admin-slate-indigo`, and `admin-slate-teal` — offer crisp mid-tone container borders and distinctive header contrasts without the glare of pure white or the eye fatigue of heavy dark modes.

*   Generated cleanly via `scripts/generate-admin-themes.js` with comprehensive contrast validation.

🎨 **Showcase and tooling**

*   Total theme count grows from 33 to 38. `M.theme.listBases()` includes `corporate` and `admin-slate`.

*   Theme Roller, Kickstart builder, layout switcher dots, and TypeScript declarations (`ThemeVariant`, `AdminTheme`) fully support all new themes.

*   The interactive theme showcase features a dedicated Corporate card pair and an expanded 3×3 Admin theme matrix builder.

<!-- website -->
<p><strong>Five new themes arrive in Domma: Corporate (light and dark) and Admin Slate (steel, indigo, teal).</strong> Corporate introduces an executive navy aesthetic tailored for business dashboards and reporting, while Admin Slate expands the administrative theme matrix to 3&times;3 with a balanced mid-tone finish designed for high visibility and long work sessions.</p>
<p><strong>Full tooling support:</strong> all five themes are integrated into the Theme Roller, Kickstart builder, TypeScript declarations, and showcase previews with verified WCAG contrast compliance.</p>
