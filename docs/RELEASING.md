# Domma Release Guide

Releases are driven by the **Makefile**. Run `make help` for the current list.

There are no `npm run release*` scripts and no `scripts/release.sh` — they were removed because they
did not work. See [Why the npm scripts went](#why-the-npm-scripts-went) if you are looking for them.

---

## The process

Six steps, in this order. The order matters and is explained below.

```bash
# 1. Bump the version (package.json + package-lock.json only — no commit, no tag)
make bump V=0.38.0

# 2. Write the release notes, by hand:
#      docs/RELEASE_NOTES.md      a new "### v0.38.0 - Title (YYYY-MM-DD)" section at the top
#      public/data/releases.json  a new entry at the head of the array
#
#    Then commit them together with the bump.
git add package.json package-lock.json docs/RELEASE_NOTES.md public/data/releases.json
git commit

# 3. Full production build, committed as the tagged commit
make release-build

# 4. Everything that is cheaper to check now than after publishing
make preflight

# 5. Publish
make release-npm

# 6. Push, tag, and cut the GitHub release
make release-gh
```

Then deploy the site — see [Making it live](#making-it-live).

### Why that order

**The bump is committed with the notes, not on its own.** `npm version` used to make its own commit,
which does not match this repo's history.

**`make release-build` creates the commit the tag points at.** Every `vX.Y.Z` tag in this repo points
at a commit whose message is exactly `Build vX.Y.Z`, and that commit carries the tracked footprint of
a build: `package.json`, `package-lock.json` and `public/download/kickstart-manifest.json`.
`public/dist/` is **gitignored** and deliberately not staged — it ships via npm and the release
assets.

**`preflight` runs after the Build commit, not before.** It checks the version you are about to
publish, so it has to run once that version is what the tree says.

**npm is published before the tag is pushed.** A failed publish must not leave a tag pointing at a
version npm does not have.

### What `make preflight` checks

It refuses to go on if any of these is true, then runs the full suite and all three validators:

| Refuses when | Because |
|---|---|
| The working tree is dirty | You would ship something that is not committed |
| `HEAD` is not `Build vX.Y.Z` | The tag has to point at the Build commit |
| `HEAD` is behind `origin/main` | Releasing from a stale base is how a real tag gets clobbered — it has happened here |
| The tag already exists | The version was not bumped |
| The version is already on npm | npm will refuse it, and will never let you reuse the number |
| No `### vX.Y.Z` in `RELEASE_NOTES.md` | `release-gh` extracts the release body from it |
| `releases.json` does not lead with `vX.Y.Z` | The site's What's New would be wrong |

A bad publish cannot be undone — only deprecated and superseded — so all of this is worth the minute
it takes.

---

## The GitHub Actions workflow

Pushing a `v*` tag also triggers `.github/workflows/release.yml`, which builds and **adds two archives**
to the release: `domma-vX.Y.Z.tar.gz` and `domma-vX.Y.Z-min.tar.gz`.

It composes with `make release-gh` rather than competing with it. `release-gh` creates the release with
the curated notes from `RELEASE_NOTES.md`; the workflow then attaches its archives to that same
release. A finished release carries seven assets:

| From | Assets |
|---|---|
| `make release-gh` | `domma.min.js`, `domma.esm.js`, `domma.css`, `grid.css`, `elements.css` |
| the workflow | `domma-vX.Y.Z.tar.gz`, `domma-vX.Y.Z-min.tar.gz` |

The workflow takes roughly 90 seconds, and `release-gh` calls `gh release create` immediately after
pushing the tag, so `release-gh` gets there first. If it ever loses that race, `gh release create` will
fail with "release already exists" — the fix is to attach the assets and notes to the existing release
rather than re-running the target:

```bash
gh release upload v0.38.0 public/dist/domma.min.js public/dist/domma.esm.js \
    public/dist/domma.css public/dist/grid.css public/dist/elements.css --clobber
```

---

## Making it live

Publishing to npm does **not** update dommajs.org. `public/dist/` is gitignored, so a deploy that
pulls from git carries the new HTML and the *old* bundles unless it rebuilds.

On the server:

```bash
make enliven
```

Which does, in order:

1. **Refuses if the checkout has local changes**, naming them. The one exception is
   `public/download/kickstart-manifest.json`, which is a build artefact that happens to be tracked and
   is therefore dirty after every build; it is discarded and regenerated.
2. `git fetch origin`
3. `git merge --ff-only origin/main` — a server that has diverged is something to look at, not to
   paper over with a merge commit.
4. `npm install` — honours the lock. **This step is not optional.** Rollup *inlines* exactly-pinned
   dependencies from `node_modules`, so a release that moves a pin will otherwise build a bundle
   containing the old package while `package-lock.json` claims the new one.
5. `NODE_ENV=production npm run build`
6. `node scripts/verify-build.mjs`

### `make verify-build`

Step 6 on its own, for checking a deploy you did not run yourself. It fails if:

| Check | Catches |
|---|---|
| Every bundle exists and is not truncated | A build that never ran, or died part-way. `public/dist/` is gitignored, so on a fresh checkout the files are simply absent and the server 404s them |
| `build-info.json` version matches `package.json` | Bundles built from a different checkout — usually a pull that landed *after* the build |
| Every exactly-pinned dependency matches what is installed | The inlining problem above. An exact pin — no `^`, no `~` — is a deliberate statement that this build needs that version and no other |

All three are otherwise silent: the build succeeds, the files look plausible, and the wrong thing is
served.

### jsDelivr

**jsDelivr lags npm by roughly 5–10 minutes** — `domma-js@latest` will serve the previous version until
it catches up. Purge manually at <https://www.jsdelivr.com/tools/purge> if you need it sooner.

---

## Versioning

| Bump | When |
|---|---|
| **Patch** (0.37.0 → 0.37.1) | Bug fixes, no new API |
| **Minor** (0.37.0 → 0.38.0) | New features, backwards compatible |
| **Major** (0.37.0 → 1.0.0) | Breaking changes |

`make bump` refuses anything that is not a plain `X.Y.Z`, and refuses a version that is not higher than
the current one. Pre-release versions (`1.0.0-alpha.1`) are therefore not supported by it; set those by
hand if you ever need one.

---

## Releasing `domma-reactive` alongside

Domma pins [`domma-reactive`](https://www.npmjs.com/package/domma-reactive) **exactly**, and Rollup
inlines it, so a fix there does not reach Domma until it is released and re-pinned:

```bash
cd ../domma-reactive
make bump V=0.4.2 && git commit -am "..." && make preflight && make release-npm && make release-gh

cd ../domma
npm install domma-reactive@0.4.2 --save-exact
npm run build:js        # confirm the fix is actually in the bundle before releasing
```

That repo has its own Makefile with the same shape. It publishes via npm and tags only — no GitHub
release objects.

---

## Checking a release

```bash
gh release list
gh release view v0.38.0
npm view domma-js version --prefer-online
```

---

## Why the npm scripts went

`npm run release:patch` was `npm version patch && bash scripts/release.sh`. Both halves misbehaved:

- **`npm version patch` made its own commit**, which does not match this repo's history — the bump
  belongs in the `Build vX.Y.Z` commit.
- **`release.sh` committed `public/dist/`**, which is gitignored. The Build commit it believed it was
  making was empty and never happened, so the tag landed on whatever commit was already there.
- **It then ran `git pull --rebase`**, which failed outright, because the build had just left
  `public/download/kickstart-manifest.json` unstaged.
- **It force-deleted and re-pushed the remote tag.** On a stale base that silently destroys a real
  release tag, which has happened in this repository.

The Makefile targets are the manual process that works, with the checks that catch each of those.
