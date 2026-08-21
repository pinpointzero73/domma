---
name: domma-kickstart
description: How the browser-side Kickstart Builder on the Downloads page works — the build:kickstart-files pipeline, kickstart-manifest.json, the JSZip/FileSaver assembler, file classification, and the {{placeholder}} template substitutions. Use when working on public/download/, scripts/build-kickstart-files.js, or the kickstart templates.
---

# Browser-Side Kickstart Builder (`public/download/`)

The Downloads page hosts a browser-side zip assembler powered by JSZip + FileSaver.js.

**How it works:**
1. `npm run build:kickstart-files` (`scripts/build-kickstart-files.js`) copies template files and dist assets to `public/download/kickstart-files/` and writes `public/download/kickstart-manifest.json`
2. The browser loads the manifest, lets the user configure their project (mode, name, theme, pages, AI files), then fetches the selected files, applies `{{placeholder}}` substitution in-memory, and triggers a `.zip` download — no server needed

**Build artefacts** (both gitignored, regenerated on every build — never edit by hand):
- `public/download/kickstart-files/` — raw template and dist files served statically
- `public/download/kickstart-manifest.json` — file index with category/group/required metadata

**Key files:**
- `scripts/build-kickstart-files.js` — build script (classifies files as `core`, `page`, `view`, `ai`, `config`, `dist`)
- `public/download/kickstart-builder.js` — browser UI (uses DOMPurify for innerHTML, JSZip for zipping, FileSaver for download)

**Template variable substitutions** (applied to all non-binary files at download time):
- `{{projectName}}` — user's chosen project name
- `{{year}}` — current year
- `{{theme}}` — chosen theme (e.g. `charcoal-dark`)
- `{{includeThemeSelector}}` — `"true"` or `"false"`
