#!/usr/bin/env node
/**
 * Phase 8: the links inside showcase demos, pointed at the new addresses.
 *
 * Demos were lifted from the old pages with their markup as it was, so a link
 * like href="../card/" was written for /showcase/hero/ - on the new site the
 * same text resolves under /showcase/elements/hero and finds nothing. Each
 * relative (or old root-relative) href is resolved against the demo's OLD page
 * address and looked up in docs/plans/dommajs-address-map.json; a hit becomes
 * the new address. Code samples (<pre>, <code>, <textarea>) are left alone, and
 * so is anything the map does not know (reported). Running it again changes
 * nothing.
 *
 * Usage: node scripts/site-migrate/demo-links.mjs [--dry]
 */
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const DEMOS = path.join(ROOT, 'site', 'plugins', 'domma-showcase', 'public', 'demos');
const DRY = process.argv.includes('--dry');
const rows = JSON.parse(fs.readFileSync(path.join(ROOT, 'docs', 'plans', 'dommajs-address-map.json'), 'utf8'));

const byOld = new Map(rows.map(r => [r.old, r]));
// The new page -> the old page's address (its "/x/" form), to resolve relative links from.
const oldOf = new Map();
for (const r of rows) if (r.new && !/^https?:/.test(r.new) && r.old.endsWith('/') && !oldOf.has(r.new)) oldOf.set(r.new, r.old);
const newPages = new Set(rows.filter(r => r.new && !/^https?:/.test(r.new)).map(r => r.new));

function lookup(oldPath) {
    for (const p of [oldPath, oldPath.endsWith('/') ? `${oldPath}index.html` : `${oldPath}/`, oldPath.replace(/index\.html$/, '')]) {
        const r = byOld.get(p);
        if (r) return r;
    }
    return null;
}

const walk = (d) => fs.readdirSync(d, {withFileTypes: true}).flatMap(e => e.isDirectory() ? walk(path.join(d, e.name)) : e.name === 'demo.html' ? [path.join(d, e.name)] : []);
let changedFiles = 0;
let changedLinks = 0;
const unknown = new Set();
for (const file of walk(DEMOS)) {
    // demos/showcase/elements/hero/<slug>/demo.html -> the page /showcase/elements/hero
    const pagePath = `/${path.relative(DEMOS, path.dirname(path.dirname(file))).split(path.sep).join('/')}`;
    const oldBase = oldOf.get(pagePath);
    if (!oldBase) continue;
    const src = fs.readFileSync(file, 'utf8');
    // Leave code samples as written: split them out, fix the rest, put them back.
    const parts = src.split(/(<(?:pre|code|textarea)\b[\s\S]*?<\/(?:pre|code|textarea)>)/i);
    let n = 0;
    const out = parts.map((part, i) => (i % 2 ? part : part.replace(/(\shref=")([^"]+)(")/g, (m, a, href, b) => {
        if (/^(https?:|mailto:|tel:|#|javascript:|data:|\$\{|\{\{)/.test(href)) return m;
        const u = new URL(href, `https://old${oldBase}`);
        if (newPages.has(u.pathname) && !byOld.has(u.pathname)) return m;      // already a new address
        const row = lookup(u.pathname);
        if (!row || row.status === 410 || !row.new) { if (!href.startsWith('/')) unknown.add(`${href} (in ${path.relative(DEMOS, file)})`); return m; }
        const to = row.new + (u.hash || '');
        if (to === href) return m;
        n++;
        return `${a}${to}${b}`;
    }))).join('');
    if (n) {
        changedFiles++;
        changedLinks += n;
        if (!DRY) fs.writeFileSync(file, out);
    }
}
console.log(`${DRY ? 'Would change' : 'Changed'} ${changedLinks} links in ${changedFiles} demos.`);
if (unknown.size) console.log(`Not in the map (left as they are):\n  ${[...unknown].sort().join('\n  ')}`);
