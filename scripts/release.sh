#!/bin/bash
# Domma Release Script - Creates GitHub release and makes it available on jsDelivr

set -e

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
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

# 3. Create git tag
echo -e "${YELLOW}🏷️  Creating git tag v${VERSION}...${NC}"
git tag -a "v${VERSION}" -m "Release v${VERSION}" || echo "Tag already exists"

# 4. Push changes and tag
echo -e "${YELLOW}⬆️  Pushing to GitHub...${NC}"
git push origin main
git push origin "v${VERSION}"

# 5. Create GitHub release
echo -e "${YELLOW}📋 Creating GitHub release...${NC}"
gh release create "v${VERSION}" \
  --title "Domma v${VERSION}" \
  --generate-notes \
  public/dist/domma.min.js \
  public/dist/domma.esm.js \
  public/dist/domma.css \
  public/dist/grid.css \
  public/dist/elements.css

echo -e "\n${GREEN}✅ Release complete!${NC}\n"
echo -e "${BLUE}📦 Your release is now available:${NC}"
echo -e "   GitHub: https://github.com/pinpointzero73/domma/releases/tag/v${VERSION}"
echo -e "   jsDelivr: https://cdn.jsdelivr.net/gh/pinpointzero73/domma@${VERSION}/dist/domma.min.js"
echo -e "   jsDelivr (latest): https://cdn.jsdelivr.net/gh/pinpointzero73/domma@latest/dist/domma.min.js"
echo -e "\n${YELLOW}⚠️  jsDelivr may take 5-10 minutes to update @latest${NC}\n"
