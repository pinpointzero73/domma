# Domma Development Makefile
# Makes local development builds easier with proper environment settings

.PHONY: help build build-dev build-prod dev prod garage garage-prod docs miniapps clean

# Default target
help:
	@echo "Domma Development Build Commands"
	@echo "================================="
	@echo ""
	@echo "Main Builds:"
	@echo "  make dev            - Full development build (everything in dev mode)"
	@echo "  make prod           - Full production build (everything in prod mode)"
	@echo "  make build          - Alias for 'make prod'"
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
	@echo "Utilities:"
	@echo "  make clean          - Clean dist and build artifacts"
	@echo "  make watch-garage   - Watch garage app for changes (requires nodemon)"
	@echo ""

# Full builds
dev:
	@echo "🔧 Building everything in DEVELOPMENT mode..."
	@echo ""
	NODE_ENV=development npm run build
	@echo ""
	@echo "✅ Development build complete!"
	@echo "   - Console.log statements preserved"
	@echo "   - API URL: http://localhost:3000/api"
	@echo "   - Source maps enabled"

prod:
	@echo "🚀 Building everything in PRODUCTION mode..."
	@echo ""
	NODE_ENV=production npm run build
	@echo ""
	@echo "✅ Production build complete!"
	@echo "   - Console.log statements stripped"
	@echo "   - API URL: /api"
	@echo "   - Minified and optimized"

build: prod

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
	NODE_ENV=development npm run build:miniapp:docs

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
