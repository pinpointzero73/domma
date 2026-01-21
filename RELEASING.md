# Domma Release Guide

## Quick Start

```bash
# For patch releases (0.9.18 → 0.9.19)
npm run release:patch

# For minor releases (0.9.18 → 0.10.0)
npm run release:minor

# For major releases (0.9.18 → 1.0.0)
npm run release:major
```

## What Happens Automatically

When you run a release command:

1. ✅ Updates version in `package.json`
2. ✅ Builds the project (`npm run build`)
3. ✅ Commits build files
4. ✅ Creates git tag (e.g., `v1.0.0`)
5. ✅ Pushes to GitHub
6. ✅ Creates GitHub release with built files
7. ✅ Makes it available on jsDelivr

## jsDelivr URLs

After release, your library is available at:

### Specific Version
```html
<script src="https://cdn.jsdelivr.net/gh/pinpointzero73/domma@1.0.0/dist/domma.min.js"></script>
```

### Latest Release
```html
<script src="https://cdn.jsdelivr.net/gh/pinpointzero73/domma@latest/dist/domma.min.js"></script>
```

### All Files Available
- `/dist/domma.min.js` - Main bundle
- `/dist/domma.esm.js` - ESM version
- `/dist/domma.css` - Base styles
- `/dist/grid.css` - Grid system
- `/dist/elements.css` - UI components

## Manual Release

If you need more control:

```bash
# 1. Update version manually
npm version 1.2.3

# 2. Run release script
npm run release
```

## Semantic Versioning Guide

- **Patch** (0.9.18 → 0.9.19): Bug fixes, minor tweaks
- **Minor** (0.9.18 → 0.10.0): New features, backwards compatible
- **Major** (0.9.18 → 1.0.0): Breaking changes

## Pre-release Versions

For alpha/beta releases:

```bash
# Update version to 1.0.0-alpha.1
npm version 1.0.0-alpha.1

# Run release
npm run release
```

## Troubleshooting

### jsDelivr Not Updating

- jsDelivr caches for ~7 days by default
- New releases appear within 5-10 minutes
- Purge cache manually: https://www.jsdelivr.com/tools/purge

### Tag Already Exists

```bash
# Delete local tag
git tag -d v1.0.0

# Delete remote tag
git push origin :refs/tags/v1.0.0

# Try release again
npm run release
```

## First-Time Setup

✅ Already configured for GitHub user: **pinpointzero73**

Your repository URL is set to: `git+https://github.com/pinpointzero73/domma.git`

## Checking Releases

```bash
# List all releases
gh release list

# View specific release
gh release view v1.0.0
```
