/**
 * Add Canonical Tags
 * Inserts <link rel="canonical"> after <title> in every public HTML page.
 * Skips template fragments and files that already have a canonical tag.
 * Safe to re-run - idempotent.
 */

import { readdirSync, readFileSync, statSync, writeFileSync } from 'fs';
import { dirname, join, relative } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir   = join(__dirname, '..');
const publicDir = join(rootDir, 'public');

const BASE_URL = 'https://dommajs.org';

// ── Skip rules (same as sitemap, minus test files - canonical tags do no harm
//   on test pages but the sitemap shouldn't list them) ────────────────────────

const FRAGMENT_DIRS = [
    'layouts/templates',
];

const FRAGMENT_FILES = [
    'template.html',
];

// ── URL computation ───────────────────────────────────────────────────────────

const toUrl = (relPath) => {
    if (relPath === 'index.html') return `${BASE_URL}/`;
    if (relPath.endsWith('/index.html')) {
        return `${BASE_URL}/${relPath.replace('/index.html', '/')}`;
    }
    return `${BASE_URL}/${relPath}`;
};

// ── File walker ───────────────────────────────────────────────────────────────

const collectHtmlFiles = (dir, results = []) => {
    for (const entry of readdirSync(dir)) {
        const full = join(dir, entry);
        const rel  = relative(publicDir, full);
        const stat = statSync(full);

        if (stat.isDirectory()) {
            if (FRAGMENT_DIRS.some(p => (rel + '/').includes(p + '/'))) continue;
            collectHtmlFiles(full, results);
        } else if (entry.endsWith('.html')) {
            if (FRAGMENT_FILES.includes(entry)) continue;
            if (FRAGMENT_DIRS.some(p => rel.includes(p + '/'))) continue;
            results.push(rel);
        }
    }
    return results;
};

// ── Injection ─────────────────────────────────────────────────────────────────

let injected = 0;
let skipped  = 0;

const files = collectHtmlFiles(publicDir);

for (const rel of files) {
    const full    = join(publicDir, rel);
    const content = readFileSync(full, 'utf8');

    // Already has a canonical tag - skip
    if (/rel=["']canonical["']/i.test(content)) {
        skipped++;
        continue;
    }

    // Must have a </title> to anchor the insertion
    if (!content.includes('</title>')) {
        console.warn(`  ⚠ No </title> in ${rel} - skipping`);
        skipped++;
        continue;
    }

    const canonicalUrl = toUrl(rel);
    const tag = `<link rel="canonical" href="${canonicalUrl}">`;

    const updated = content.replace('</title>', `</title>\n    ${tag}`);
    writeFileSync(full, updated, 'utf8');
    injected++;
}

console.log(`✓ Canonical tags added`);
console.log(`  Injected: ${injected}`);
console.log(`  Skipped:  ${skipped} (already had tag or no </title>)`);
