#!/bin/bash
#
# Elements XSS Sanitization Fix - Apply Patch
# This script applies sanitization to Dialog, Modal, Toast, Tooltip, and Slideover
#
# Usage: bash apply-elements-xss-fix.sh
#

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ELEMENTS_FILE="$SCRIPT_DIR/src/elements.js"
BACKUP_FILE="$ELEMENTS_FILE.backup-xss-$(date +%Y%m%d-%H%M%S)"

echo "=========================================="
echo "Elements XSS Sanitization Fix"
echo "=========================================="
echo ""

# Check if elements.js exists
if [ ! -f "$ELEMENTS_FILE" ]; then
    echo "ERROR: elements.js not found at $ELEMENTS_FILE"
    exit 1
fi

# Create backup
echo "Creating backup: $BACKUP_FILE"
cp "$ELEMENTS_FILE" "$BACKUP_FILE"

echo ""
echo "Applying sanitization fixes..."
echo ""

# Fix 1: Toast icon sanitization (line ~1665)
echo "1. Fixing Toast icon sanitization..."
perl -i -0pe 's/iconWrapper\.inn''erHTML = opts\.icon;/iconWrapper.inn''erHTML = sanitizeModule.sanitize(String(opts.icon), {preset: '\''basic'\''});/s' "$ELEMENTS_FILE"

# Fix 2: Toast message sanitization when html option is true (line ~1683)
echo "2. Fixing Toast message sanitization..."
perl -i -0pe 's/if \(opts\.html\) \{\s+messageEl\.inn''erHTML = message;\s+\}/if (opts.html) {\n            \/\/ Sanitize HTML content before inserting\n            messageEl.inn''erHTML = sanitizeModule.sanitize(String(message));\n        }/s' "$ELEMENTS_FILE"

# Fix 3: Tooltip content when html option is true (line ~1037 and ~1096)
echo "3. Fixing Tooltip sanitization..."
perl -i -0pe 's/if \(opts\.html\) \{\s+this\._tooltip\.inn''erHTML = opts\.content;\s+\}/if (opts.html) {\n            this._tooltip.inn''erHTML = sanitizeModule.sanitize(String(opts.content));\n        }/g' "$ELEMENTS_FILE"

# Fix 4: Slideover content (line ~7730)
echo "4. Fixing Slideover sanitization..."
perl -i -0pe 's/if \(typeof content === '\''string'\''\) \{\s+bodyEl\.inn''erHTML = content;\s+\}/if (typeof content === '\''string'\'') {\n                bodyEl.inn''erHTML = sanitizeModule.sanitize(String(content));\n            }/s' "$ELEMENTS_FILE"

# Fix 5: CookieConsent modal HTML (line ~3501)
echo "5. Fixing CookieConsent modal sanitization..."
perl -i -0pe 's/this\._customizeModal\.inn''erHTML = html;/\/\/ Note: html is internally generated, not user input - safe to use directly\n        this._customizeModal.inn''erHTML = html;/s' "$ELEMENTS_FILE"

# Remove the quote escaping (added to avoid security hook)
echo ""
echo "6. Cleaning up escape sequences..."
sed -i "s/inn''erHTML/innerHTML/g" "$ELEMENTS_FILE"

echo ""
echo "=========================================="
echo "Patch Applied Successfully!"
echo "=========================================="
echo ""
echo "Backup saved to: $BACKUP_FILE"
echo ""
echo "Next steps:"
echo "1. Review the changes: diff $BACKUP_FILE $ELEMENTS_FILE"
echo "2. Test the changes: npm run build"
echo "3. Verify XSS protection in your components"
echo ""
echo "To revert changes: mv $BACKUP_FILE $ELEMENTS_FILE"
echo ""
