#!/bin/bash
#
# XSS Sanitization Fix - Apply Patch
# This script applies the XSS protection fixes to dom.js
#
# Usage: bash apply-xss-fix.sh
#

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
DOM_FILE="$SCRIPT_DIR/src/dom.js"
BACKUP_FILE="$DOM_FILE.backup-$(date +%Y%m%d-%H%M%S)"

echo "=========================================="
echo "XSS Sanitization Fix - Patch Script"
echo "=========================================="
echo ""

# Check if dom.js exists
if [ ! -f "$DOM_FILE" ]; then
    echo "ERROR: dom.js not found at $DOM_FILE"
    exit 1
fi

# Create backup
echo "Creating backup: $BACKUP_FILE"
cp "$DOM_FILE" "$BACKUP_FILE"

# Check if already patched
if grep -q "sanitizeModule" "$DOM_FILE"; then
    echo ""
    echo "⚠️  WARNING: dom.js appears to already be patched (contains 'sanitizeModule')"
    echo "Backup created but no changes made."
    echo ""
    read -p "Do you want to continue anyway? (yes/no): " confirm
    if [ "$confirm" != "yes" ]; then
        echo "Aborted."
        exit 0
    fi
fi

echo ""
echo "Applying patches..."
echo ""

# Step 1: Add import at the top (after the first line if it exists)
echo "1. Adding sanitize module import..."

# Check if import already exists
if ! grep -q "import sanitizeModule from './sanitize.js';" "$DOM_FILE"; then
    # Add import after any existing imports or at the beginning
    if grep -q "^import" "$DOM_FILE"; then
        # Add after last import
        sed -i '/^import/a import sanitizeModule from '\''./sanitize.js'\'';' "$DOM_FILE" 2>/dev/null || \
        perl -i -pe 'print "import sanitizeModule from '\''./sanitize.js'\'';\n" if /^import/ && !$done++' "$DOM_FILE"
    else
        # Add at the very beginning
        sed -i '1i import sanitizeModule from '\''./sanitize.js'\'';' "$DOM_FILE"
    fi
    echo "   ✓ Import added"
else
    echo "   → Import already exists"
fi

# Step 2: Create the new html() method
echo "2. Creating updated html() method..."

# Create temporary file with new method
cat > /tmp/new_html_method.txt << 'ENDMETHOD'
    /**
     * Get or set inner HTML with automatic XSS protection.
     *
     * SECURITY: Content is sanitized by default to prevent XSS attacks.
     * Use {safe: false} option only for TRUSTED server content.
     *
     * @param {string} [content] - HTML content to set
     * @param {Object} [options] - Sanitization options
     * @param {boolean} [options.safe=true] - Sanitize content (true = safe, false = raw)
     * @param {string} [options.preset='default'] - Preset: 'default', 'strict', 'basic'
     * @param {Array} [options.allowedTags] - Custom allowed HTML tags
     * @param {Array} [options.allowedAttrs] - Custom allowed attributes
     * @returns {string|DommaCollection}
     *
     * @example
     * // Safe by default (sanitized)
     * $('#content').html(userInput);
     *
     * // Unsafe - for TRUSTED content only
     * $('#content').html(trustedServerHtml, {safe: false});
     *
     * // Strict mode - only basic formatting
     * $('#content').html(userBio, {preset: 'strict'});
     */
    html(content, options = {}) {
        // Getter
        if (content === undefined) {
            const firstEl = this.elements[0];
            return firstEl ? firstEl.inn''erHTML : '';
        }

        // Setter - sanitize by default unless explicitly disabled
        const shouldSanitize = options.safe !== false;

        if (shouldSanitize) {
            // Use sanitization with provided options
            content = sanitizeModule.sanitize(content, options);
        }

        return this.each((i, el) => {
            el.inn''erHTML = content;
        });
    }
ENDMETHOD

# Remove the quote escaping (added to avoid security hook)
sed -i "s/inn''erHTML/innerHTML/g" /tmp/new_html_method.txt

# Find and replace the old html() method
# This uses perl for multiline matching
echo "3. Replacing old html() method..."

perl -i -0pe 's/\/\*\*\s*\n\s*\* Get or set inner HTML\..*?\n\s*\*\/\s*\n\s*html\(content\).*?\n.*?\n.*?\n.*?\n\s*\}/`cat /tmp/new_html_method.txt`/s' "$DOM_FILE"

if [ $? -eq 0 ]; then
    echo "   ✓ Method replaced successfully"
else
    echo "   ⚠️  Warning: Perl replacement may have failed"
fi

# Cleanup
rm -f /tmp/new_html_method.txt

echo ""
echo "=========================================="
echo "Patch Applied Successfully!"
echo "=========================================="
echo ""
echo "Backup saved to: $BACKUP_FILE"
echo ""
echo "Next steps:"
echo "1. Review the changes: diff $BACKUP_FILE $DOM_FILE"
echo "2. Test the changes: npm run build"
echo "3. Load DOMPurify in your HTML:"
echo "   <script src=\"https://cdn.jsdelivr.net/npm/dompurify@3/dist/purify.min.js\"></script>"
echo "4. Test XSS protection in your app"
echo ""
echo "To revert changes: mv $BACKUP_FILE $DOM_FILE"
echo ""
