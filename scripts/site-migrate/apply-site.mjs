#!/usr/bin/env node
/**
 * Phase 1 of docs/plans/2026-10-10-dommajs-site-on-domma-cms.md: set a fresh
 * Domma CMS site up as dommajs.org - the look, the menus and the Showcase
 * project. Safe to run again: it only writes what differs.
 *
 *   - config/theme.json   charcoal-dark, Roboto, a light/dark switcher (the old site's look)
 *   - config/menus/       main and footer, from scripts/site-migrate/out/menus
 *                         (run menus.mjs first); main -> navbar, footer -> footer-primary
 *   - projects collection a Showcase project rooted at /showcase
 *   - content/pages/      every page under scripts/site-migrate/pages/ (phase 2 on), same path
 *   - content/blocks/     every block under scripts/site-migrate/blocks/
 *   - content/media/      every file under scripts/site-migrate/media/
 *   - content/custom.css  scripts/site-migrate/custom.css (site-wide styles)
 *   - plugins/<name>/     every site plugin under site/plugins/ (the showcase), enabled
 *   - collections         scripts/site-migrate/collections/<slug>/: schema.json always; data.json
 *                         only when the site has none yet (or with --reseed), so entries edited
 *                         in the admin are not overwritten
 *
 * The site reads these at boot: restart it afterwards (its manager restarts a
 * site when its process is ended).
 *
 * Usage: node scripts/site-migrate/apply-site.mjs <site-dir> [--dry] [--reseed]
 */
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const MENUS = path.join(ROOT, 'scripts', 'site-migrate', 'out', 'menus');
const [siteArg] = process.argv.slice(2).filter(a => !a.startsWith('--'));
const DRY = process.argv.includes('--dry');
const RESEED = process.argv.includes('--reseed');
if (!siteArg) { console.error('Usage: apply-site.mjs <site-dir> [--dry]'); process.exit(1); }
const SITE = path.resolve(siteArg);
if (!fs.existsSync(path.join(SITE, 'config', 'site.json'))) { console.error(`Not a Domma CMS site: ${SITE}`); process.exit(1); }

const readJson = (p) => JSON.parse(fs.readFileSync(p, 'utf8'));
const changes = [];
/** Write JSON atomically, only when it changed. */
function write(p, value) {
    const text = JSON.stringify(value, null, 2) + '\n';
    if (fs.existsSync(p) && fs.readFileSync(p, 'utf8') === text) return;
    changes.push(path.relative(SITE, p));
    if (DRY) return;
    fs.mkdirSync(path.dirname(p), {recursive: true});
    const tmp = `${p}.${process.pid}.tmp`;
    fs.writeFileSync(tmp, text);
    fs.renameSync(tmp, p);
}

// ---- Theme: the old site's look -------------------------------------------
const themeFile = path.join(SITE, 'config', 'theme.json');
const theme = readJson(themeFile);
write(themeFile, {
    ...theme,
    theme: 'charcoal-dark',
    font: {...(theme.font || {}), family: 'Roboto'},
    switcher: {...(theme.switcher || {}), enabled: true, themes: ['charcoal-dark', 'charcoal-light']},
});

// ---- Menus ------------------------------------------------------------------
if (!fs.existsSync(path.join(MENUS, 'main.json'))) { console.error('No converted menus: run scripts/site-migrate/menus.mjs first'); process.exit(1); }
for (const slug of ['main', 'footer']) {
    const menu = readJson(path.join(MENUS, `${slug}.json`));
    const target = path.join(SITE, 'config', 'menus', `${slug}.json`);
    // Keep the site's own timestamps on a menu it already has, so a re-run is a no-op.
    if (fs.existsSync(target)) menu.meta = {...menu.meta, createdAt: readJson(target).meta?.createdAt ?? menu.meta.createdAt, updatedAt: readJson(target).meta?.updatedAt ?? menu.meta.updatedAt};
    write(target, menu);
}
const locFile = path.join(SITE, 'config', 'menu-locations.json');
write(locFile, {...readJson(locFile), navbar: 'main', 'footer-primary': 'footer'});

// ---- Showcase project -------------------------------------------------------
const projFile = path.join(SITE, 'content', 'collections', 'projects', 'data.json');
const projects = readJson(projFile);
if (!projects.some(e => e.data?.slug === 'showcase')) {
    const at = new Date().toISOString();
    projects.push({
        id: crypto.randomUUID(),
        data: {
            slug: 'showcase', name: 'Showcase',
            description: 'Every Domma module, live: demos with their code, one page per module.',
            icon: 'layers', rootUrl: '/showcase', sortOrder: 1, enabled: true, createdAt: at, updatedAt: at,
        },
        meta: {createdAt: at, updatedAt: at, createdBy: null, source: 'admin'},
    });
    write(projFile, projects);
}

// ---- Pages ------------------------------------------------------------------
const PAGES = path.join(ROOT, 'scripts', 'site-migrate', 'pages');
function walk(dir, rel = '') {
    if (!fs.existsSync(dir)) return [];
    return fs.readdirSync(dir, {withFileTypes: true}).flatMap(e => {
        const r = rel ? `${rel}/${e.name}` : e.name;
        return e.isDirectory() ? walk(path.join(dir, e.name), r) : (e.name.endsWith('.md') ? [r] : []);
    });
}
/** Copy every file under a source folder to the same path under a site folder, when it differs. */
function mirror(srcDir, destDir, files) {
    for (const rel of files) {
        const buf = fs.readFileSync(path.join(srcDir, rel));
        const target = path.join(destDir, rel);
        if (fs.existsSync(target) && fs.readFileSync(target).equals(buf)) continue;
        changes.push(path.relative(SITE, target));
        if (DRY) continue;
        fs.mkdirSync(path.dirname(target), {recursive: true});
        const tmp = `${target}.${process.pid}.tmp`;
        fs.writeFileSync(tmp, buf);
        fs.renameSync(tmp, target);
    }
}
const allFiles = (dir, rel = '') => (!fs.existsSync(dir) ? [] : fs.readdirSync(dir, {withFileTypes: true}).flatMap(e => {
    const r = rel ? `${rel}/${e.name}` : e.name;
    return e.isDirectory() ? allFiles(path.join(dir, e.name), r) : [r];
}));
const SM = path.join(ROOT, 'scripts', 'site-migrate');
mirror(path.join(SM, 'blocks'), path.join(SITE, 'content', 'blocks'), allFiles(path.join(SM, 'blocks')));
mirror(path.join(SM, 'media'), path.join(SITE, 'content', 'media'), allFiles(path.join(SM, 'media')));
mirror(SM, path.join(SITE, 'content'), ['custom.css']);

// ---- Site plugins (site/plugins/<name>/) - mirrored in, then enabled ------------
const SITE_PLUGINS = path.join(ROOT, 'site', 'plugins');
for (const name of fs.existsSync(SITE_PLUGINS) ? fs.readdirSync(SITE_PLUGINS) : []) {
    mirror(path.join(SITE_PLUGINS, name), path.join(SITE, 'plugins', name), allFiles(path.join(SITE_PLUGINS, name)));
    const pluginsFile = path.join(SITE, 'config', 'plugins.json');
    const plugins = readJson(pluginsFile);
    if (plugins[name]?.enabled !== true) write(pluginsFile, {...plugins, [name]: {...(plugins[name] || {}), enabled: true}});
}
for (const slug of fs.existsSync(path.join(SM, 'collections')) ? fs.readdirSync(path.join(SM, 'collections')) : []) {
    const src = path.join(SM, 'collections', slug);
    const dest = path.join(SITE, 'content', 'collections', slug);
    const files = ['schema.json', ...((RESEED || !fs.existsSync(path.join(dest, 'data.json'))) ? ['data.json'] : [])];
    mirror(src, dest, files.filter(f => fs.existsSync(path.join(src, f))));
}

for (const rel of walk(PAGES)) {
    const text = fs.readFileSync(path.join(PAGES, rel), 'utf8');
    const target = path.join(SITE, 'content', 'pages', rel);
    if (fs.existsSync(target) && fs.readFileSync(target, 'utf8') === text) continue;
    changes.push(path.relative(SITE, target));
    if (DRY) continue;
    fs.mkdirSync(path.dirname(target), {recursive: true});
    const tmp = `${target}.${process.pid}.tmp`;
    fs.writeFileSync(tmp, text);
    fs.renameSync(tmp, target);
}

console.log(changes.length ? `${DRY ? 'Would change' : 'Changed'}: ${changes.join(', ')}` : 'Nothing to change.');
