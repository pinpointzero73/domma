# Domma Development Makefile
# Makes local development builds easier with proper environment settings

.PHONY: help build build-dev build-prod prod core css dev garage garage-prod docs miniapps \
        clean kill-ports watch-garage rebuild-after-core enliven verify-build \
        test validate check bump release-build preflight release-npm release-gh

VERSION := $(shell node -e "process.stdout.write(require('./package.json').version)")

# Default target
help:
	@echo "Domma Development Build Commands"
	@echo "================================="
	@echo ""
	@echo "Development Workflow:"
	@echo "  make dev            - Start dev server with watch/live reload"
	@echo "  make build-dev      - Build everything once (development mode)"
	@echo "  make build-prod     - Build everything once (production mode)"
	@echo ""
	@echo "MiniApps:"
	@echo "  make garage         - Build garage app (development mode)"
	@echo "  make garage-prod    - Build garage app (production mode)"
	@echo "  make docs           - Build docs app (development mode)"
	@echo "  make miniapps       - Build all miniapps (development mode)"
	@echo ""
	@echo "Core Domma:"
	@echo "  make core           - Build Domma core only (domma.min.js)"
	@echo "  make css            - Build CSS only"
	@echo ""
	@echo "Checks:"
	@echo "  make test           - Full suite (includes the 86-page showcase harness)"
	@echo "  make validate       - Dead classes, theme contrast, Domma conventions"
	@echo "  make check          - test + validate"
	@echo ""
	@echo "Release  (v$(VERSION) - run in this order):"
	@echo "  make bump V=X.Y.Z   - Set the version in package.json + package-lock.json"
	@echo "  <write release notes> docs/RELEASE_NOTES.md + public/data/releases.json,"
	@echo "                        then commit those and the bump"
	@echo "  make release-build  - Full build, then commit it as 'Build vX.Y.Z'"
	@echo "  make preflight      - Tree clean, not behind origin, unreleased, green"
	@echo "  make release-npm    - Publish to npmjs.com"
	@echo "  make release-gh     - Push main, tag vX.Y.Z, GitHub release + assets"
	@echo ""
	@echo "  The tag must point at the 'Build vX.Y.Z' commit - that is the repo's"
	@echo "  convention and release-build is what creates it. Full guide:"
	@echo "  docs/RELEASING.md"
	@echo ""
	@echo "Deploy (on the server):"
	@echo "  make enliven        - Fast-forward, install, production build, verify"
	@echo "  make verify-build   - Check the built bundles match this checkout"
	@echo ""
	@echo "Utilities:"
	@echo "  make clean          - Clean dist and build artifacts"
	@echo "  make kill-ports     - Kill processes on ports 3000, 3001, 3010"
	@echo "                        (or specify: make kill-ports PORTS=\"8080 9000\")"
	@echo "  make watch-garage   - Watch garage app for changes (requires nodemon)"
	@echo ""

# Development server (watch mode with live reload)
dev:
	@echo "🔥 Starting development server..."
	@echo "   - Live reload enabled"
	@echo "   - Console.log preserved"
	@echo "   - API: http://localhost:3000/api"
	@echo ""
	npm run dev

# Full builds
build-dev:
	@echo "🔧 Building everything in DEVELOPMENT mode..."
	@echo ""
	NODE_ENV=development npm run build
	@echo ""
	@echo "✅ Development build complete!"
	@echo "   - Console.log statements preserved"
	@echo "   - API URL: http://localhost:3000/api"
	@echo "   - Source maps enabled"

build-prod:
	@echo "🚀 Building everything in PRODUCTION mode..."
	@echo ""
	NODE_ENV=production npm run build
	@echo ""
	@echo "✅ Production build complete!"
	@echo "   - Console.log statements stripped"
	@echo "   - API URL: /api"
	@echo "   - Minified and optimized"

# Legacy aliases
build: build-prod
prod: build-prod

# Core Domma
core:
	NODE_ENV=development rollup -c

css:
	npm run build:css

# MiniApps - Development mode (keeps console.log, uses localhost API)
garage:
	NODE_ENV=development npm run build:miniapp:garage

garage-prod:
	NODE_ENV=production npm run build:miniapp:garage

docs:
	NODE_ENV=development node scripts/build-miniapp.js docs

miniapps:
	NODE_ENV=development npm run build:miniapps

# Clean
clean:
	rm -rf public/dist/*.js public/dist/*.css public/dist/*.map
	rm -rf public/miniapps/*/dist/*.js
	@echo "✓ Cleaned build artifacts"

# Watch mode (requires nodemon: npm install -g nodemon)
watch-garage:
	@echo "Watching garage app for changes..."
	@nodemon -w public/miniapps/garage/src -e js -x "make garage"

# Quick rebuild after Domma core changes
rebuild-after-core: core garage
	@echo "✓ Rebuilt Domma core and garage app"

# Kill processes on development ports
# Usage: make kill-ports PORTS="3000 3001 3010"
kill-ports:
	@PORTS_TO_KILL="$(if $(PORTS),$(PORTS),3000 3001 3010)"; \
	echo "🔪 Killing processes on ports: $$PORTS_TO_KILL"; \
	for port in $$PORTS_TO_KILL; do \
		lsof -ti:$$port | xargs -r kill -9 2>/dev/null || true; \
	done; \
	echo "✅ Ports cleared"

# ── Checks ───────────────────────────────────────────────────────────────────

test:
	npx vitest run

validate:
	npm run validate

check: test validate

# ── Release ──────────────────────────────────────────────────────────────────
#
# These targets are the whole release process. The `npm run release:patch`
# scripts and scripts/release.sh were REMOVED, not merely deprecated, because
# they could not work:
#
#   * `npm version patch` made its own commit, which does not match this
#     repo's history - the version bump belongs in the `Build vX.Y.Z` commit.
#   * release.sh committed `public/dist/`, which is GITIGNORED, so the Build
#     commit it believed it was making was empty and never happened.
#   * release.sh then `git pull --rebase`d, which failed outright because the
#     build had just left `public/download/kickstart-manifest.json` unstaged.
#   * release.sh force-deleted and re-pushed the remote tag - on a stale base
#     that silently destroys a real release tag. It has happened here.
#
# See docs/RELEASING.md. Full sequence:
#   make bump V=X.Y.Z → write notes → commit → make release-build
#   → make preflight → make release-npm → make release-gh

# Bump only. Commit it yourself, with the release notes, in a message that says
# what the release contains.
bump:
	@test -n "$(V)" || { echo ""; echo "  usage: make bump V=X.Y.Z"; echo ""; exit 1; }
	node scripts/bump.mjs $(V)
	@echo "  Next: write docs/RELEASE_NOTES.md + public/data/releases.json, then"
	@echo "  commit those together with the bump."
	@echo ""

# The full build, then the commit the tag will point at.
#
# `public/dist/` is gitignored and ships via npm and the GitHub release assets,
# so it is deliberately NOT staged here. The three files below are the entire
# tracked footprint of a build, and `Build vX.Y.Z` is the exact message the tag
# convention expects.
release-build: build-prod
	@git add package.json package-lock.json public/download/kickstart-manifest.json
	@git diff --cached --quiet \
		&& { echo ""; echo "  release-build: nothing to commit - did you run 'make bump' first?"; echo ""; exit 1; } \
		|| git commit -m "Build v$(VERSION)"
	@echo ""
	@echo "  Committed Build v$(VERSION). Next: make preflight"
	@echo ""

# Everything cheaper to learn now than after publishing. npm will not let you
# republish a version number, so a bad publish is permanent.
preflight:
	@git diff --quiet && git diff --cached --quiet \
		|| { echo ""; echo "  preflight: working tree is dirty - commit or stash first"; echo ""; exit 1; }
	@test "$$(git log -1 --pretty=%s)" = "Build v$(VERSION)" \
		|| { echo ""; echo "  preflight: HEAD is \"$$(git log -1 --pretty=%s)\", expected \"Build v$(VERSION)\""; \
		     echo "  The tag must point at the Build commit. Run 'make release-build'."; echo ""; exit 1; }
	@git fetch --quiet origin
	@git merge-base --is-ancestor origin/main HEAD \
		|| { echo ""; echo "  preflight: HEAD is BEHIND origin/main - fast-forward before releasing"; \
		     echo "  local  $$(git rev-parse --short HEAD)"; \
		     echo "  remote $$(git rev-parse --short origin/main)"; echo ""; \
		     echo "  Releasing from a stale base is how a real tag gets clobbered."; echo ""; exit 1; }
	@git rev-parse -q --verify "refs/tags/v$(VERSION)" >/dev/null \
		&& { echo ""; echo "  preflight: tag v$(VERSION) already exists - bump the version first"; echo ""; exit 1; } \
		|| true
	@npm view domma-js@$(VERSION) version >/dev/null 2>&1 \
		&& { echo ""; echo "  preflight: $(VERSION) is already published - npm will refuse it"; echo ""; exit 1; } \
		|| true
	@grep -q "^### v$(VERSION) " docs/RELEASE_NOTES.md \
		|| { echo ""; echo "  preflight: no '### v$(VERSION)' entry in docs/RELEASE_NOTES.md"; echo ""; exit 1; }
	@node -e "const r=require('./public/data/releases.json').releases; \
		if (r[0].year !== 'v$(VERSION)') { \
			console.error('\n  preflight: public/data/releases.json leads with ' + r[0].year + ', expected v$(VERSION)\n'); \
			process.exit(1); \
		}"
	$(MAKE) check
	@echo ""
	@echo "  preflight: clean, on Build v$(VERSION), not behind origin, unreleased,"
	@echo "             notes present, tests and validators green"
	@echo ""

# Publish first, tag second: a failed publish must not leave a tag pointing at
# a version npm does not have.
release-npm:
	@echo ""
	@echo "📦 Publishing domma-js@$(VERSION) to npm..."
	@echo ""
	npm publish --access public
	@echo ""
	@echo "✅ Published domma-js@$(VERSION)"
	@echo "   https://www.npmjs.com/package/domma-js"
	@echo "   jsDelivr lags npm by roughly 5-10 minutes."
	@echo ""

# Push, tag, and cut the GitHub release with the dist assets attached. The
# assets matter: public/dist/ is gitignored, so the release page and npm are
# the only places those built files exist.
release-gh:
	@echo ""
	@echo "🏷️  Releasing v$(VERSION) to GitHub..."
	@echo ""
	git push origin main
	git tag -a v$(VERSION) -m "Release v$(VERSION)"
	git push origin v$(VERSION)
	@awk '/^### v$(VERSION) /{p=1} p && /^### v[0-9]/ && !/^### v$(VERSION) /{p=0} p' \
		docs/RELEASE_NOTES.md > /tmp/domma-release-notes.md
	@test -s /tmp/domma-release-notes.md \
		|| { echo "  release-gh: extracted empty notes for v$(VERSION) - check docs/RELEASE_NOTES.md"; exit 1; }
	gh release create v$(VERSION) \
		--title "Domma v$(VERSION)" \
		--notes-file /tmp/domma-release-notes.md \
		public/dist/domma.min.js \
		public/dist/domma.esm.js \
		public/dist/domma.css \
		public/dist/grid.css \
		public/dist/elements.css
	@rm -f /tmp/domma-release-notes.md
	@echo ""
	@echo "✅ GitHub release v$(VERSION) published"
	@echo "   https://github.com/pinpointzero73/domma/releases/tag/v$(VERSION)"
	@echo ""
	@echo "   The site still needs deploying - 'make enliven' on the server."
	@echo ""

# ── Deploy ───────────────────────────────────────────────────────────────────

# Take a checkout from "behind" to "serving the current release".
#
# This used to be `git stash && git pull && make build`, which had three ways
# to go quietly wrong on a server:
#
#   * `git stash` with no `pop`. Anything modified was parked in the stash list
#     for ever. Since the build regenerates the TRACKED
#     public/download/kickstart-manifest.json, the tree was dirty after every
#     run and the next run stashed it - the list grows, and a genuinely
#     diverged checkout is hidden rather than reported.
#   * `git pull` merges, so a diverged server gets a merge commit instead of a
#     refusal.
#   * No install step. Rollup INLINES exactly-pinned dependencies from
#     node_modules, so a release that moves a pin builds a bundle containing
#     the OLD package while package-lock.json claims the new one. Silent.
#
# Now: refuse on anything unexpected, fast-forward only, install to the lock,
# build, and check what was actually produced.
enliven:
	@echo ""
	@echo "🚀 Making live…"
	@echo ""
	@# The manifest is a build artefact that happens to be tracked, so it is the
	@# one modification that is expected here. Anything else is a local change
	@# somebody made on the server, and losing it silently is not this target's
	@# decision to make.
	@DIRTY=$$(git status --porcelain --untracked-files=no \
		| grep -v '^ M public/download/kickstart-manifest\.json$$' || true); \
	if [ -n "$$DIRTY" ]; then \
		echo "  enliven: this checkout has local changes:"; echo ""; \
		echo "$$DIRTY" | sed 's/^/    /'; echo ""; \
		echo "  Commit, stash or discard them yourself - refusing to guess."; echo ""; \
		exit 1; \
	fi
	@git checkout -- public/download/kickstart-manifest.json 2>/dev/null || true
	@echo "→ Fetching"
	git fetch origin
	@# --ff-only: a server that has diverged is a problem to look at, not to
	@# paper over with a merge commit.
	@echo "→ Fast-forwarding"
	git merge --ff-only origin/main
	@echo "→ Installing to the lock"
	npm install
	@echo "→ Building (production)"
	NODE_ENV=production npm run build
	@echo "→ Verifying"
	@node scripts/verify-build.mjs
	@echo "✅ Live - v$$(node -p "require('./package.json').version")"
	@echo ""
	@echo "   jsDelivr lags npm by roughly 5-10 minutes."
	@echo ""

# What enliven runs last. Safe to run on its own to check a deploy.
verify-build:
	@node scripts/verify-build.mjs
