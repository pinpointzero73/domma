#!/usr/bin/env node
/**
 * Phase 1 of docs/plans/2026-10-10-dommajs-site-on-domma-cms.md: the old site's
 * navigation, as Domma CMS menus.
 *
 * Reads public/layouts/config/{nav-public,nav-showcase,footer-landing}.json and
 * writes config/menus/<slug>.json files (main, footer) for the new site into
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
    if (it.type === 'theme-switcher') return it;
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

// An icon for every item of the main menu, by its label (Domma's icon set). Items missing
// here are listed when the script runs, so a new page is noticed.
const ICONS = {
    'Home': 'home', 'QuickStart': 'rocket', 'Overview': 'compass', 'SPA': 'window', 'MPA': 'layers',
    'Kickstart Builder': 'package', 'Core': 'cpu', 'Config': 'settings', 'DOM': 'dollar-sign', 'Utils': 'tool',
    'Storage': 'save', 'HTTP': 'globe', 'Router': 'map', 'Components': 'component', 'Integrations': 'link',
    'Data': 'database', 'Blueprints': 'file-code', 'Dates': 'calendar', 'Models': 'box', 'Reactivity': 'zap',
    'Bindings': 'link-2', 'Tables': 'columns', 'UI': 'layout', 'Alarm': 'bell', 'Back to Top': 'arrow-up',
    'Cookie Consent': 'shield-check', 'Desktop Notification': 'notification', 'Loader': 'spinner',
    'Skeleton': 'list', 'Timer': 'stopwatch', 'Toast': 'message-square', 'Grid': 'grid',
    'Accessibility & Text': 'type', 'Icons': 'image', 'Flags': 'flag', 'Themes': 'palette', 'Forms': 'document-text',
    'Elements': 'grid', 'Accordion': 'chevrons-down', 'Autocomplete': 'search', 'Avatar': 'user', 'Badge': 'badge',
    'Breadcrumbs': 'chevrons-right', 'Button Group': 'sliders', 'Card': 'square', 'Carousel': 'images',
    'Chooser': 'check-square', 'Context Menu': 'mouse-pointer', 'Dialog': 'message-circle', 'Dropdown': 'chevron-down',
    'Editor': 'edit', 'Footer': 'panel-bottom', 'Hero': 'panel-top', 'List Group': 'list-bullet', 'Modal': 'window',
    'Navbar': 'menu', 'Pillbox': 'tags', 'Popover': 'chat', 'Progression': 'trending-up', 'Signature': 'feather',
    'Sidebar': 'sidebar', 'Slideover': 'panel-right', 'Sortable': 'grip-vertical', 'Tabs': 'folder', 'Timeline': 'git-branch',
    'Tooltip': 'info', 'TreeView': 'tree', 'Effects': 'sparkles', 'Ambient': 'cloud', 'Animations': 'play-circle',
    'Filters': 'filter', 'Fireworks': 'party-popper', 'Glow': 'sun', 'Gradients': 'droplets', 'Shadows': 'moon',
    'JavaScript': 'code', 'Breathe': 'activity', 'Counter': 'hash', 'Pulse': 'heartbeat', 'Reveal': 'eye',
    'Ripple': 'droplet', 'Scramble': 'type', 'Shake': 'move', 'Scribe': 'edit-3', 'Twinkle': 'star',
    'Ticker Tape': 'gift', 'Butterflies': 'feather', 'Strobe': 'lightning', 'Celebrations': 'party-popper',
    'Tools': 'tool', 'Theme Roller': 'palette', 'Page Roller': 'layout', 'Schema Builder': 'database',
    'Form Generation': 'document-add', 'Print to PDF': 'printer', 'API Reference': 'book-open',
    'Domma CMS': 'external-link', 'Resources': 'book', 'Download': 'download', 'About Us': 'info',
    'FAQs': 'help-circle', 'Privacy Policy': 'shield', 'Cookie policy': 'shield-check',
};
const noIcon = new Set();
function addIcons(items) {
    for (const it of items) {
        if (it.type) continue;
        if (!it.icon) { if (ICONS[it.text]) it.icon = ICONS[it.text]; else noIcon.add(it.text); }
        if (it.items) addIcons(it.items);
    }
    return items;
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

// Every layout on the old site used nav-showcase.json as its navbar (dropdowns); nav-public.json
// was not used by any of them. Showcase pages' sidebars were their own contents (headings), which
// the CMS's With Sidebar layout already does - so there is no separate showcase menu.
void navPublic;
// The theme switcher sits in the main menu (a rail on the right), after the links.
// Home first: the rail has no brand link of its own to click.
navShowcase.items = [{text: 'Home', url: '/', icon: 'home'}, ...navShowcase.items, {type: 'theme-switcher'}];
const menus = [
    menu('main', 'Main navigation', 'The old site\'s navbar (nav-showcase.json), as dropdowns', navShowcase.items, {variant: 'dark', position: 'static', orientation: 'vertical', side: 'right', highlight: {hover: 'darken', active: 'darken'}}),
    menu('footer', 'Footer', 'From footer-landing.json', footerGroups),
];

// Celebrations was one of the dropped examples; it is a showcase page now, under Effects.
const effectsMenu = menus[0].items.find(i => i.text === 'Effects');
if (effectsMenu && !effectsMenu.items.some(i => i.text === 'Celebrations')) effectsMenu.items.push({text: 'Celebrations', url: '/showcase/effects/celebrations'});
// ...and its own entry straight after Effects as well.
const effectsAt = menus[0].items.indexOf(effectsMenu);
if (effectsAt >= 0 && !menus[0].items.some(i => i.text === 'Celebrations')) menus[0].items.splice(effectsAt + 1, 0, {text: 'Celebrations', url: '/showcase/effects/celebrations'});
addIcons(menus[0].items);

fs.mkdirSync(OUT, {recursive: true});
for (const m of menus) fs.writeFileSync(path.join(OUT, `${m.slug}.json`), JSON.stringify(m, null, 2) + '\n');
fs.writeFileSync(path.join(OUT, 'menu-locations.json'), JSON.stringify({navbar: 'main', 'footer-primary': 'footer'}, null, 2) + '\n');

const count = (items) => items.reduce((n, i) => n + (i.type === 'separator' || i.type === 'theme-switcher' ? 0 : 1) + (i.items ? count(i.items) : 0), 0);
for (const m of menus) console.log(`${m.slug}: ${count(m.items)} links`);
if (noIcon.size) console.log(`main items with no icon: ${[...noIcon].join(', ')}`);
console.log(`left out (dropped pages): ${dropped.length ? [...new Set(dropped)].join(', ') : 'none'}`);
