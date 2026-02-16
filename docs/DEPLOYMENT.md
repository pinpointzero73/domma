# Deployment Guide

This document explains how Domma's build and deployment process works.

## Overview

As of v0.12.1, `public/dist/` is **no longer tracked in Git**. This eliminates the need to stash build artifacts before deploying and keeps the repository clean.

## Build Process

### Local Development

```bash
# Development build (preserves console.log, uses localhost API)
make build-dev

# Production build (strips console.log, uses /api)
make build-prod

# Watch mode with live reload
make dev
```

### What Gets Built

The build process generates:
- `public/dist/*.js` - JavaScript bundles (ESM and UMD formats)
- `public/dist/*.css` - CSS stylesheets
- `public/dist/themes/` - Theme files
- `public/dist/bundles/` - Bundled variants
- `public/dist/archives/` - Distribution archives

All of these files are now in `.gitignore` and generated on-demand.

## Deployment Options

### Option 1: Manual Deployment (Current Workflow)

```bash
# Deploy to production server
make enliven
```

This command:
1. ~~Stashes changes~~ (no longer needed!)
2. Pulls latest from Git
3. Runs production build
4. Server is live with fresh builds

**Note:** No more stashing required since dist files aren't tracked!

### Option 2: GitHub Actions (Automated)

Two workflows are configured:

#### CI Builds (`.github/workflows/ci.yml`)
- Runs on every push to `main` or `develop`
- Verifies builds work correctly
- Tests on Node 18.x and 20.x
- Uploads build artifacts for inspection

#### Release Builds (`.github/workflows/release.yml`)
- Triggers when you push a version tag (e.g., `v0.12.2`)
- Builds production bundles
- Creates GitHub Release with:
  - Complete archive (`domma-vX.Y.Z.tar.gz`)
  - Minified archive (`domma-vX.Y.Z-min.tar.gz`)
  - Individual files (domma.min.js, domma.esm.js, CSS files)

**To create a release:**
```bash
git tag v0.12.2
git push origin v0.12.2
```

GitHub Actions will automatically build and publish the release.

### Option 3: Netlify (Auto-Deploy from Git)

Connect your GitHub repo to Netlify. Configuration is already in `netlify.toml`:

- **Build command:** `npm run build`
- **Publish directory:** `public`
- **Auto-deploys** on every push to main

Features:
- Automatic HTTPS
- CDN distribution
- Preview deployments for PRs
- Custom domain support

### Option 4: Vercel (Auto-Deploy from Git)

Connect your GitHub repo to Vercel. Configuration is in `vercel.json`:

- **Build command:** `npm run build`
- **Output directory:** `public`
- **Auto-deploys** on every push to main

Features:
- Edge network distribution
- Automatic HTTPS
- Preview deployments
- Analytics

## Distribution Files

Users can get Domma files from:

1. **GitHub Releases** - Download archives from release page
2. **npm** (future) - `npm install domma`
3. **CDN** (future) - jsDelivr, unpkg automatically serve from GitHub releases
4. **Direct download** - From your production site

## What Changed?

### Before (v0.12.0 and earlier)
```bash
# Had to stash dist files every time
git stash
git pull
npm run build
# dist files were tracked in Git
```

Problems:
- ✗ Repo bloated with binary/minified files
- ✗ Had to stash before pulling
- ✗ Merge conflicts in generated files
- ✗ Noisy diffs in PRs

### After (v0.12.1+)
```bash
# Just pull and build
git pull
npm run build
# dist files generated locally, not tracked
```

Benefits:
- ✓ Clean Git history
- ✓ No more stashing
- ✓ No merge conflicts in builds
- ✓ Smaller repo size
- ✓ Cleaner PRs

## Server Requirements

Your production server only needs:
- Node.js 18+ and npm
- Git
- Build runs on deploy

No need to pre-build or commit dist files.

## FAQ

### Q: How do users download Domma now?

**A:** Three ways:
1. Download from GitHub Releases (automatically created when you tag)
2. Clone and build locally: `git clone ... && npm install && npm run build`
3. From your production site (after deployment builds it)

### Q: Will CDNs like jsDelivr still work?

**A:** Yes! When you create a GitHub Release with the tag, jsDelivr and unpkg automatically serve those files:
```html
<!-- These will work after you create a release -->
<script src="https://cdn.jsdelivr.net/gh/yourusername/domma@v0.12.2/public/dist/domma.min.js"></script>
```

### Q: What if the build fails during deployment?

**A:** The GitHub Actions CI workflow (runs on every push) catches build failures before they reach production. If something breaks, you'll see it in the PR.

### Q: Can I still commit dist files if I want?

**A:** Yes, but not recommended. Remove `public/dist/` from `.gitignore` if you really need to track builds in Git.

## Next Steps

Consider:
1. **Set up npm publishing** - Automated via GitHub Actions on release
2. **Configure CDN** - Already works via jsDelivr/unpkg after releases
3. **Enable automatic deployments** - Connect to Netlify or Vercel for zero-config hosting

---

**Summary:** No more stashing! Just `git pull && make build` and you're live. 🚀
