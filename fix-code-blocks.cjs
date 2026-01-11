#!/usr/bin/env node
/**
 * Fix code-block indentation in showcase HTML files
 *
 * Problem: <pre> tags preserve whitespace, causing excessive indentation
 * Solution: Move content to start immediately after opening <pre> tag
 */

const fs = require('fs');
const path = require('path');

// Recursively find all HTML files
function findHTMLFiles(dir, fileList = []) {
    const files = fs.readdirSync(dir);

    files.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);

        if (stat.isDirectory()) {
            findHTMLFiles(filePath, fileList);
        } else if (file.endsWith('.html') && !file.endsWith('.min.html')) {
            fileList.push(filePath);
        }
    });

    return fileList;
}

const showcaseDir = '/home/darryl/src/js/domma/public/showcase';
const files = findHTMLFiles(showcaseDir);

console.log(`Found ${files.length} HTML files to process\n`);

let totalFixed = 0;
let filesModified = 0;

files.forEach(file => {
    const content = fs.readFileSync(file, 'utf8');
    let modified = content;
    let fileFixCount = 0;

    // Pattern 1: <pre class="code-block ...">\nCONTENT (newline after opening tag)
    // This matches files where there's a newline immediately after <pre>
    modified = modified.replace(
        /(<pre class="code-block[^"]*"[^>]*>)\n([\s\S]*?)<\/pre>/g,
        (match, openTag, content) => {
            // Remove trailing empty lines
            const lines = content.split('\n');
            while (lines.length > 0 && lines[lines.length - 1].trim() === '') {
                lines.pop();
            }

            const fixedContent = lines.join('\n');

            fileFixCount++;

            // Return with content starting immediately after open tag (no newline)
            return openTag + fixedContent + '</pre>';
        }
    );

    // Also fix pattern without newline but with leading spaces on first line
    modified = modified.replace(
        /(<pre class="code-block[^"]*"[^>]*>)([ \t]+)([\s\S]*?)<\/pre>/g,
        (match, openTag, leadingSpaces, content) => {
            // Check if this is actually just leading spaces (not already fixed)
            if (!content.startsWith('\n')) {
                // Split content into lines
                const lines = (leadingSpaces + content).split('\n');

                // Detect common leading whitespace
                const nonEmptyLines = lines.filter(l => l.trim() !== '');
                if (nonEmptyLines.length === 0) return match;

                const minIndent = Math.min(...nonEmptyLines.map(line => {
                    const match = line.match(/^[ \t]*/);
                    return match ? match[0].length : 0;
                }));

                // Remove common leading whitespace
                const fixedLines = lines.map(line => {
                    if (line.trim() === '') return '';
                    return line.substring(minIndent);
                });

                // Remove trailing empty lines
                while (fixedLines.length > 0 && fixedLines[fixedLines.length - 1].trim() === '') {
                    fixedLines.pop();
                }

                fileFixCount++;
                return openTag + fixedLines.join('\n') + '</pre>';
            }
            return match;
        }
    );

    if (fileFixCount > 0) {
        fs.writeFileSync(file, modified, 'utf8');
        filesModified++;
        totalFixed += fileFixCount;
        console.log(`✓ ${path.relative('/home/darryl/src/js/domma', file)} - Fixed ${fileFixCount} code-block(s)`);
    }
});

console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
console.log(`✓ Complete: Fixed ${totalFixed} code-blocks in ${filesModified} files`);
