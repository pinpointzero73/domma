#!/usr/bin/env node
/**
 * Phase 0 of docs/plans/2026-10-10-dommajs-site-on-domma-cms.md: every address
 * dommajs.org answers today, and where it goes on the Domma CMS site.
 *
 * Reads public/ (every page), public/sitemap.xml (what search engines know) and
 * the list of sections already removed, and writes:
 *   docs/plans/dommajs-address-map.csv   - one row per old address, for review
 *   docs/plans/dommajs-address-map.json  - the same rows, for the redirect import (phase 7)
 *
 * Actions:
 *   keep    - the page moves to the new site at `new`
 *   merge   - the content joins a page on domma-cms.com; the old address redirects there
 *   drop    - not carried over; redirects to `new` when there is a sensible home, else 410
 *   removed - already gone (2026-10-10); 410, or a redirect where something replaced it
 *
 * status: 301 (needs a redirect rule), 410 (gone), 200 (the CMS serves it as is - /a/b/ is /a/b)
 *
 * Usage: node scripts/site-migrate/address-map.mjs [--check]
 *   --check  exit 1 if any sitemap address has no row (the phase 0 check)
 */
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const PUBLIC = path.join(ROOT, 'public');
const OUT = path.join(ROOT, 'docs', 'plans');
const CMS = 'https://domma-cms.com';   // cms.dommajs.org redirects there

/** Not pages: build output, generated downloads, layout partials. */
const SKIP = [/^dist\//, /^download\/kickstart-files\//, /^layouts\//, /node_modules\//];

/** The 13 Domma CMS docs pages and their home on domma-cms.com. */
const CMS_DOCS = {
    '': '/features',
    'admin-panel': '/features/admin',
    'auth': '/features/users-and-security',
    'blocks': '/features/components-blocks',
    'collections': '/features/collections',
    'configuration': '/features/configuration',
    'data-pro': '/features/collections',
    'forms': '/features/forms',
    'getting-started': '/get-started',
    'media': '/features/media',
    'pages': '/features/page-editor',
    'plugins': '/features/marketplace',   // /plugins itself redirects to /tools; the old page was about building them
    'tutorials': '/tutorials',
};

/** Sections removed on 2026-10-10 with their backend. */
const REMOVED = [
    ['/blog/', '', 'Blog - its posts came from the removed API'],
    ['/feedback/', '', 'Feedback form - posted to the removed API'],
    ['/login/', '', 'Sign-in - the removed API'],
    ['/admin/', '', 'Admin area - the removed API'],
    ['/api/', '', 'Address Lookup API docs'],
    ['/miniapps/address/', '', 'Address Lookup app'],
    ['/miniapps/nexus/', '', 'Nexus app (never launched)'],
    ['/miniapps/garage/', `${CMS}/tools/garage`, 'My Garage - lives on as a Domma CMS Tool'],
];

/** Every page under public/, as posix paths relative to it. */
function pages(dir = PUBLIC, rel = '') {
    const out = [];
    for (const e of fs.readdirSync(dir, {withFileTypes: true})) {
        const r = rel ? `${rel}/${e.name}` : e.name;
        if (SKIP.some(re => re.test(e.isDirectory() ? `${r}/` : r))) continue;
        if (e.isDirectory()) out.push(...pages(path.join(dir, e.name), r));
        else if (e.name.endsWith('.html')) out.push(r);
    }
    return out.sort();
}

const titleOf = (file) => {
    const m = /<title>([^<]*)<\/title>/i.exec(fs.readFileSync(path.join(PUBLIC, file), 'utf8'));
    return m ? m[1].replace(/&amp;/g, '&').replace(/\s+/g, ' ').trim() : '';
};

/** The addresses a file answers to today: /a/b/ and /a/b/index.html, or /a/b.html. */
function oldAddresses(file) {
    if (file === 'index.html') return ['/', '/index.html'];
    if (file.endsWith('/index.html')) {
        const dir = `/${file.slice(0, -'index.html'.length)}`;
        return [dir, `${dir}index.html`];
    }
    return [`/${file}`];
}

/** The address on the new site: no trailing slash, no .html. */
const clean = (file) => (file === 'index.html' ? '/' : `/${file.replace(/(\/index)?\.html$/, '')}`);

function decide(file) {
    const [top, ...rest] = file.split('/');
    if (file === 'examples/celebrations/index.html') return {action: 'keep', new: '/showcase/effects/celebrations', note: 'Now a showcase page'};
    if (top === 'examples') return {action: 'drop', new: '/showcase', note: 'Examples dropped - the showcase covers the same ground'};
    if (top === 'miniapps') {
        if (file === 'miniapps/docs/index.html') return {action: 'drop', new: `${CMS}/tools/docs`, note: 'Domma Docs lives on Domma CMS'};
        if (file === 'miniapps/index.html') return {action: 'drop', new: `${CMS}/tools`, note: 'Mini-apps live on Domma CMS'};
        return {action: 'drop', new: '', note: 'Test page'};
    }
    if (top === 'cms') {
        const key = rest.length > 1 ? rest[0] : '';
        const target = CMS_DOCS[key];
        return target === null
            ? {action: 'merge', new: `${CMS}/features`, note: `New page needed on domma-cms.com for "${key}"; redirect to /features until then`}
            : {action: 'merge', new: `${CMS}${target}`, note: 'Merge into the existing page there'};
    }
    if (top === 'showcase') return {action: 'keep', new: clean(file), note: 'Showcase: prose + [showcase-demo]'};
    if (top === 'download') return {action: 'keep', new: clean(file), note: 'Page; the builders become plugin files'};
    if (top === 'changelog') return {action: 'keep', new: clean(file), note: 'Releases collection'};
    return {action: 'keep', new: clean(file), note: 'Prose page'};
}

const csv = (v) => (/[",\n]/.test(String(v)) ? `"${String(v).replace(/"/g, '""')}"` : String(v));

const rows = [];
for (const file of pages()) {
    const d = decide(file);
    const title = titleOf(file);
    for (const old of oldAddresses(file)) rows.push({old, new: d.new, status: d.new ? 301 : 410, action: d.action, file, title, note: d.note});
}
for (const [dir, target, note] of REMOVED) {
    for (const old of [dir, `${dir}index.html`]) rows.push({old, new: target, status: target ? 301 : 410, action: 'removed', file: '', title: '', note});
}
// Domma CMS serves /a/b/ as /a/b itself (and its redirect rules ignore a trailing slash, so a rule
// from one to the other would point at itself). Those rows need no rule; only the /index.html and
// .html forms do.
const noSlash = (u) => (u.length > 1 ? u.replace(/\/+$/, '') : u);
for (const r of rows) if (r.new && !/^https?:/.test(r.new) && noSlash(r.old) === r.new) { r.status = 200; r.note = `${r.note} (served as is)`; }

// The phase 0 check: every address the sitemap gives search engines has a row.
const sitemap = fs.readFileSync(path.join(PUBLIC, 'sitemap.xml'), 'utf8');
const known = new Set(rows.map(r => r.old));
const missing = [...sitemap.matchAll(/<loc>https:\/\/dommajs\.org([^<]*)<\/loc>/g)].map(m => m[1] || '/').filter(u => !known.has(u));

fs.mkdirSync(OUT, {recursive: true});
const cols = ['old', 'new', 'status', 'action', 'title', 'file', 'note'];
fs.writeFileSync(path.join(OUT, 'dommajs-address-map.csv'), [cols.join(','), ...rows.map(r => cols.map(c => csv(r[c])).join(','))].join('\n') + '\n');
fs.writeFileSync(path.join(OUT, 'dommajs-address-map.json'), JSON.stringify(rows, null, 2) + '\n');

const count = (pred) => rows.filter(pred).length;
const files = new Set(rows.filter(r => r.file).map(r => r.file));
const byAction = {};
for (const f of files) { const a = rows.find(r => r.file === f).action; byAction[a] = (byAction[a] || 0) + 1; }
console.log(`${files.size} pages, ${rows.length} old addresses`);
console.log(`pages by action: ${Object.entries(byAction).map(([a, n]) => `${a} ${n}`).join(', ')}`);
console.log(`redirects 301: ${count(r => r.status === 301)}, gone 410: ${count(r => r.status === 410)}, unchanged: ${count(r => r.status === 200)}`);
console.log(missing.length ? `SITEMAP ADDRESSES WITH NO ROW (${missing.length}): ${missing.join(' ')}` : 'every sitemap address has a row');
if (process.argv.includes('--check') && missing.length) process.exit(1);
