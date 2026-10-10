#!/usr/bin/env node
/**
 * Phase 1 of docs/plans/2026-10-10-dommajs-site-on-domma-cms.md: the old site's
 * navigation, as Domma CMS menus.
 *
 * Reads public/layouts/config/{nav-public,nav-showcase,footer-landing}.json and
 * writes config/menus/<slug>.json files for the new site into
 * scripts/site-migrate/out/menus/, plus menu-locations.json. Every link goes
 * through the phase 0 address map (docs/plans/dommajs-address-map.json):
 * dropped pages are left out, merged ones point at cms.dommajs.org, and kept
 * ones get their new address. `{divider: true}` becomes a separator.
 *
 * Usage: node scripts/site-migrate/menus.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const CONFIG = path.join(ROOT, 'public', 'layouts', 'config');
const OUT = path.join(ROOT, 'scripts', 'site-migrate', 'out', 'menus');
const map = new Map(JSON.parse(fs.readFileSync(path.join(ROOT, 'docs', 'plans', 'dommajs-address-map.json'), 'utf8')).map(r => [r.old, r]));

const read = (name) => JSON.parse(fs.readFileSync(path.join(CONFIG, name), 'utf8'));
const dropped = [];

/** An old relative link ('showcase/index.html#x') to its new address, or null when the page is gone. */
function newUrl(url) {
    if (!url || url === '#' || /^(https?:|mailto:)/.test(url)) return url || '';
    const [p, hash] = url.split('#');
    const old = `/${p.replace(/^(\.\.\/)+|^\.?\//, '')}`;
    const row = map.get(old) || map.get(old.endsWith('/') ? `${old}index.html` : `${old}/index.html`);
    if (!row) throw new Error(`No address-map row for "${url}"`);
    if (row.status === 410 || ['drop', 'removed'].includes(row.action)) { dropped.push(url); return null; }
    return row.new + (hash ? `#${hash}` : '');
}

/** One old nav item to a CMS menu item (or null). Sub-items stay under `items`. */
function item(it) {
    if (it.divider) return {type: 'separator'};
    // The cookie banner's "settings" link becomes the cookie policy page; other '#' placeholders
    // (Terms of Service, which never existed) are left out.
    if (it.url === '#') {
        if (it.attributes?.['data-cookie-consent-open']) return {text: 'Cookie policy', url: '/cookie-policy'};
        dropped.push(`${it.text} (#)`);
        return null;
    }
    // The CMS docs moved to cms.dommajs.org: one link there instead of a group of off-site links.
    if (it.text === 'CMS' && Array.isArray(it.items)) return {text: 'Domma CMS', url: 'https://cms.dommajs.org/features'};
    const out = {text: it.text};
    if (it.url !== undefined) {
        const u = newUrl(it.url);
        if (u === null) return null;
        out.url = u;
    } else {
        out.url = '';
    }
    if (it.icon) out.icon = it.icon;
    if (Array.isArray(it.items)) {
        out.items = tidy(it.items.map(item).filter(Boolean));
        if (!out.items.length && !out.url) return null;
    }
    return out;
}

/** No separator first, last or twice in a row. */
function tidy(items) {
    const out = [];
    for (const it of items) {
        if (it.type === 'separator' && (!out.length || out.at(-1).type === 'separator')) continue;
        out.push(it);
    }
    while (out.at(-1)?.type === 'separator') out.pop();
    return out;
}

const now = new Date().toISOString();
const menu = (slug, name, description, items, extra = {}) => ({
    slug, name, description, ...extra,
    items: tidy(items.map(item).filter(Boolean)),
    meta: {createdAt: now, updatedAt: now, bundled: false, presetOwner: null, project: null},
});

const navPublic = read('nav-public.json');
const navShowcase = read('nav-showcase.json');
const footer = read('footer-landing.json');

// The footer's link columns become one menu each: a group per column.
const footerGroups = (footer.columns || footer.sections || []).map(c => ({text: c.title, links: c.links || []}))
    .map(g => ({text: g.text, items: g.links}));

const menus = [
    menu('main', 'Main navigation', 'From the old site\'s nav-public.json', navPublic.items, {variant: 'dark', position: 'sticky'}),
    menu('showcase', 'Showcase', 'The showcase sidebar, from nav-showcase.json. Bound to the Showcase project.', navShowcase.items, {orientation: 'vertical', side: 'left'}),
    menu('footer', 'Footer', 'From footer-landing.json', footerGroups),
];

fs.mkdirSync(OUT, {recursive: true});
for (const m of menus) fs.writeFileSync(path.join(OUT, `${m.slug}.json`), JSON.stringify(m, null, 2) + '\n');
fs.writeFileSync(path.join(OUT, 'menu-locations.json'), JSON.stringify({navbar: 'main', 'footer-primary': 'footer'}, null, 2) + '\n');

const count = (items) => items.reduce((n, i) => n + (i.type === 'separator' ? 0 : 1) + (i.items ? count(i.items) : 0), 0);
for (const m of menus) console.log(`${m.slug}: ${count(m.items)} links`);
console.log(`left out (dropped pages): ${dropped.length ? [...new Set(dropped)].join(', ') : 'none'}`);
