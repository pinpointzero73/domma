/**
 * Rebuild Sitemap
 * Walks public/ recursively and generates a fresh sitemap.xml based on actual HTML files.
 */

import { readdirSync, statSync, writeFileSync } from 'fs';
import { dirname, join, relative } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir  = join(__dirname, '..');
const publicDir = join(rootDir, 'public');

const BASE_URL   = 'https://dommajs.org';
const TODAY      = new Date().toISOString().slice(0, 10);

// ── Skip rules ────────────────────────────────────────────────────────────────

/** Path segments that identify template fragments — never canonical pages. */
const FRAGMENT_DIRS = [
    'layouts/templates',
];

/** Filenames that are template fragments (matched against basename). */
const FRAGMENT_FILES = [
    'template.html',
];

/** Paths (relative to public/) that are blocked or irrelevant. */
const SKIP_PATHS = [
    'admin/',
    'login/',
];

/** Basenames of pages used purely for testing. */
const TEST_FILES = [
    'test.html',
    'test-api.html',
];

// ── Priority tiers ────────────────────────────────────────────────────────────

const getPriority = (relPath) => {
    // Main landing page
    if (relPath === 'index.html') return '1.0';

    // Top-level hub pages
    const hubs = [
        'showcase/index.html',
        'download/index.html',
        'about/index.html',
        'faq/index.html',
        'blog/index.html',
        'api/index.html',
        'kickstart/index.html',
        'quickstart/index.html',
    ];
    if (hubs.includes(relPath)) return '0.8';

    // Module-level showcase pages (one directory deep inside showcase/)
    if (/^showcase\/[^/]+\/index\.html$/.test(relPath)) return '0.7';

    // Legal / boilerplate
    if (/\/(privacy|terms|cookies|legal)/.test(relPath)) return '0.3';

    // Everything else
    return '0.6';
};

// ── URL computation ───────────────────────────────────────────────────────────

/**
 * Convert a relative file path (from public/) to a canonical URL.
 *   index.html          → https://dommajs.org/
 *   about/index.html    → https://dommajs.org/about/
 *   showcase/dom/index.html → https://dommajs.org/showcase/dom/
 *   faq/index.html      → https://dommajs.org/faq/
 *   blog/post.html      → https://dommajs.org/blog/post.html
 */
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
            // Skip blocked directories
            const relSlash = rel + '/';
            if (SKIP_PATHS.some(p => relSlash.startsWith(p))) continue;
            if (FRAGMENT_DIRS.some(p => relSlash.includes(p + '/'))) continue;

            collectHtmlFiles(full, results);
        } else if (entry.endsWith('.html')) {
            // Skip fragment files
            if (FRAGMENT_FILES.includes(entry)) continue;
            if (TEST_FILES.includes(entry))     continue;

            // Skip paths that are under a fragment directory
            if (FRAGMENT_DIRS.some(p => rel.includes(p + '/'))) continue;

            results.push(rel);
        }
    }
    return results;
};

// ── Build ─────────────────────────────────────────────────────────────────────

const files = collectHtmlFiles(publicDir).sort();

const entries = files.map(rel => {
    const url      = toUrl(rel);
    const priority = getPriority(rel);
    return [
        '  <url>',
        `    <loc>${url}</loc>`,
        `    <lastmod>${TODAY}</lastmod>`,
        `    <priority>${priority}</priority>`,
        '  </url>',
    ].join('\n');
});

const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...entries,
    '</urlset>',
    '',
].join('\n');

const outPath = join(publicDir, 'sitemap.xml');
writeFileSync(outPath, xml, 'utf8');

console.log(`✓ Sitemap rebuilt: ${outPath}`);
console.log(`  URLs: ${files.length}`);
console.log(`  Date: ${TODAY}`);
