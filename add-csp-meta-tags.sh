#!/bin/bash
#
# Add CSP Meta Tags to HTML Files
# This script adds Content-Security-Policy meta tags to all HTML files
#
# Usage: bash add-csp-meta-tags.sh
#

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PUBLIC_DIR="$SCRIPT_DIR/public"

echo "=========================================="
echo "Adding CSP Meta Tags to HTML Files"
echo "=========================================="
echo ""

# CSP policy that allows:
# - Scripts/styles from self and CDNs (jsdelivr, unpkg, etc.)
# - Inline scripts/styles (needed for Domma components)
# - Data URLs for images
# - HTTPS connections
CSP_TAG='<meta http-equiv="Content-Security-Policy" content="default-src '\''self'\''; script-src '\''self'\'' '\''unsafe-inline'\'' '\''unsafe-eval'\'' https://cdn.jsdelivr.net https://unpkg.com https://cdnjs.cloudflare.com; style-src '\''self'\'' '\''unsafe-inline'\'' https://fonts.googleapis.com https://cdn.jsdelivr.net; font-src '\''self'\'' https://fonts.gstatic.com data:; img-src '\''self'\'' data: https:; connect-src '\''self'\'' https:; frame-src '\''none'\''; object-src '\''none'\'';">'

# Find all HTML files
echo "Searching for HTML files..."
html_files=$(find "$PUBLIC_DIR" -name "*.html" -type f)

count=0
skipped=0

for file in $html_files; do
    # Check if file already has CSP tag
    if grep -q "Content-Security-Policy" "$file"; then
        echo "✓ Skipping (already has CSP): $(basename "$file")"
        ((skipped++))
        continue
    fi

    # Check if file has <head> tag
    if ! grep -q "<head>" "$file"; then
        echo "⊘ Skipping (no <head> tag): $(basename "$file")"
        ((skipped++))
        continue
    fi

    # Add CSP meta tag after <head>
    sed -i "/<head>/a\\    $CSP_TAG" "$file"

    echo "✓ Added CSP: $file"
    ((count++))
done

echo ""
echo "=========================================="
echo "CSP Meta Tags Added Successfully!"
echo "=========================================="
echo ""
echo "Files updated: $count"
echo "Files skipped: $skipped"
echo ""
echo "The CSP policy allows:"
echo "  ✓ Self-hosted resources"
echo "  ✓ Inline scripts/styles (required for Domma)"
echo "  ✓ CDN resources (jsdelivr, unpkg, etc.)"
echo "  ✓ HTTPS connections"
echo "  ✗ Frames/objects (blocked)"
echo ""
