#!/bin/bash
# Domma Release Script - Publishes to npm and creates a GitHub/jsDelivr release

set -e

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Get version from package.json
VERSION=$(node -p "require('./package.json').version")

echo -e "${BLUE}🚀 Preparing Domma release v${VERSION}${NC}\n"

# 1. Build the project
echo -e "${YELLOW}📦 Building project...${NC}"
npm run build

# 2. Commit dist files if needed
if [[ -n $(git status -s public/dist/) ]]; then
  echo -e "${YELLOW}📝 Committing build files...${NC}"
  git add public/dist/
  git commit -m "Build v${VERSION}" || echo "No changes to commit"
fi

# 3. Create git tag (delete existing remote tag first if it exists)
echo -e "${YELLOW}🏷️  Tagging v${VERSION}...${NC}"
git tag -a "v${VERSION}" -m "Release v${VERSION}" 2>/dev/null || {
  echo -e "${YELLOW}   Local tag already exists, reusing${NC}"
}
# Force-push tag in case a previous run pushed a stale one
git push origin ":refs/tags/v${VERSION}" 2>/dev/null || true
git push origin "v${VERSION}"

# 4. Push main branch
echo -e "${YELLOW}⬆️  Pushing to GitHub...${NC}"
git push origin main

# 5. Publish to npm
echo -e "${YELLOW}📦 Publishing to npm...${NC}"
npm publish --access public
echo -e "${GREEN}   npm publish complete${NC}"

# 6. Create GitHub release
echo -e "${YELLOW}📋 Creating GitHub release...${NC}"
gh release create "v${VERSION}" \
  --title "Domma v${VERSION}" \
  --generate-notes \
  public/dist/domma.min.js \
  public/dist/domma.esm.js \
  public/dist/domma.css \
  public/dist/grid.css \
  public/dist/elements.css \
  2>/dev/null || echo -e "${YELLOW}   GitHub release already exists, skipping${NC}"

echo -e "\n${GREEN}✅ Release complete!${NC}\n"
echo -e "${BLUE}📦 Your release is now available:${NC}"
echo -e "   npm:      https://www.npmjs.com/package/domma-js/v/${VERSION}"
echo -e "   GitHub:   https://github.com/pinpointzero73/domma/releases/tag/v${VERSION}"
echo -e "   jsDelivr: https://cdn.jsdelivr.net/npm/domma-js@${VERSION}/public/dist/domma.min.js"
echo -e "   jsDelivr (latest): https://cdn.jsdelivr.net/npm/domma-js@latest/public/dist/domma.min.js"
echo -e "\n${YELLOW}⚠️  jsDelivr may take 5-10 minutes to update @latest${NC}\n"
