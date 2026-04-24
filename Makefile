# Domma Development Makefile
# Makes local development builds easier with proper environment settings

.PHONY: help build build-dev build-prod dev garage garage-prod docs miniapps clean kill-ports release-gh release-npm

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
	@echo "  make docs           - Build docs app (development mode)"Ó
	@echo "  make miniapps       - Build all miniapps (development mode)"
	@echo ""
	@echo "Core Domma:"
	@echo "  make core           - Build Domma core only (domma.min.js)"
	@echo "  make css            - Build CSS only"
	@echo ""
	@echo "Release:"
	@echo "  make release-gh     - Build, tag, and publish a GitHub release"
	@echo "  make release-npm    - Build and publish to npmjs.com"
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

# Release to GitHub
release-gh: build-prod
	@echo ""
	@echo "🏷️  Releasing v$(VERSION) to GitHub..."
	@echo ""
	@git tag -a v$(VERSION) -m "Release v$(VERSION)" 2>/dev/null || echo "   Tag v$(VERSION) already exists — skipping tag creation"
	@git push origin v$(VERSION)
	@awk '/^### v$(VERSION)/{p=1} p && /^### v[0-9]/ && !/^### v$(VERSION)/{p=0} p' docs/RELEASE_NOTES.md > /tmp/domma-release-notes.md
	@gh release create v$(VERSION) \
		--title "Domma v$(VERSION)" \
		--notes-file /tmp/domma-release-notes.md
	@rm -f /tmp/domma-release-notes.md
	@echo ""
	@echo "✅ GitHub release v$(VERSION) published!"
	@echo "   https://github.com/pinpointzero73/domma/releases/tag/v$(VERSION)"
	@echo ""

# Release to npm
release-npm: build-prod
	@echo ""
	@echo "📦 Publishing domma-js@$(VERSION) to npm..."
	@echo ""
	@npm publish
	@echo ""
	@echo "✅ Published domma-js@$(VERSION) to npm!"
	@echo "   https://www.npmjs.com/package/domma-js"
	@echo ""

# Making Live
enliven:
	@echo ""
	@echo "📦 Now stashing, pulling and building!"
	@echo ""
	git stash && git pull && make build
	@echo ""
	@echo "✅ We are live!"
	@echo ""
