/**
 * Domma Downloads - the dommajs.org downloads page.
 *
 *   [domma-downloads /]   the whole page body: Kickstart (a project scaffold,
 *                         zipped in the browser), the core library, the preset
 *                         packages, the CSS, and the custom bundle builder
 *
 * Everything offered comes from the latest Domma release on GitHub, fetched
 * into data/ by lib/release.js when the site starts and every six hours - so a
 * Domma release reaches this page by itself. Custom bundles are built here from
 * that release's source (lib/builder.js) and kept, one build per selection.
 *
 * Routes (under /api/plugins/domma-downloads):
 *   GET  /info              the release: version, modules, css, presets, files, themes
 *   GET  /file?p=<path>     a file of the release: dist/..., or download/... (Kickstart)
 *   POST /build {modules}   build (or reuse) a custom bundle -> {url, modules, cached}
 *   GET  /bundle?b=<id>     a built bundle's zip
 *
 * The page markup is public/template.html, swapped in after the page is
 * sanitised (as the showcase does) because it carries form controls and
 * bindings; public/downloads.js drives it with domma-reactive.
 */
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {Releases} from './lib/release.js';
import {Builder} from './lib/builder.js';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const DATA = path.join(HERE, 'data');
const VERSION = JSON.parse(fs.readFileSync(path.join(HERE, 'plugin.json'), 'utf8')).version;
const SYNC_EVERY = 6 * 60 * 60 * 1000;
const BUILDS_PER_HOUR = 10;     // new (not cached) builds per visitor

const esc = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/** The files a release offers by name on the page, with their sizes. */
function fileList(rel) {
    const dist = path.join(rel.dir, 'public', 'dist');
    const size = (f) => { try { return fs.statSync(path.join(dist, f)).size; } catch { return 0; } };
    const entry = (file, extra = {}) => ({file, path: `dist/${file}`, size: size(file), ...extra});
    const archives = fs.existsSync(path.join(dist, 'archives'))
        ? fs.readdirSync(path.join(dist, 'archives')).filter(f => f.endsWith('.tar.gz')).map(f => entry(`archives/${f}`)) : [];
    return {
        core: ['domma.min.js', 'domma.esm.js'].map(f => entry(f)),
        css: ['domma.css', 'grid.css', 'elements.css', 'themes/domma-themes.css'].map(f => entry(f)),
        extras: ['domma-tools.min.js', 'domma-tools.css', 'domma-flags.min.js', 'domma-syntax.min.js', 'syntax.css'].map(f => entry(f)).filter(f => f.size),
        presets: ['minimal', 'essentials', 'data-focused', 'no-ui'].map(p => entry(`domma-${p}.min.js`, {preset: p})).filter(f => f.size),
        archives
    };
}

/** Theme ids, read from the release's theme stylesheet. */
function themes(rel) {
    try {
        const css = fs.readFileSync(path.join(rel.dir, 'public', 'dist', 'themes', 'domma-themes.css'), 'utf8');
        return [...new Set([...css.matchAll(/\.dm-theme-([a-z0-9-]+)/g)].map(m => m[1]))].sort();
    } catch {
        return ['charcoal-dark'];
    }
}

/** A path inside the release that may be served, or null. */
function servable(rel, p) {
    const rel2 = String(p || '').replace(/^\/+/, '');
    const map = {dist: path.join(rel.dir, 'public', 'dist'), download: path.join(rel.dir, 'public', 'download')};
    const [root, ...rest] = rel2.split('/');
    if (!map[root] || !rest.length) return null;
    const file = path.resolve(map[root], rest.join('/'));
    if (!file.startsWith(map[root] + path.sep)) return null;
    if (root === 'download' && !/^(kickstart-files\/|kickstart-manifest\.json$)/.test(rest.join('/'))) return null;
    return fs.existsSync(file) && fs.statSync(file).isFile() ? file : null;
}

const TYPES = {'.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.json': 'application/json; charset=utf-8',
    '.md': 'text/markdown; charset=utf-8', '.html': 'text/html; charset=utf-8', '.gz': 'application/gzip', '.zip': 'application/zip',
    '.svg': 'image/svg+xml', '.png': 'image/png', '.ico': 'image/x-icon'};

export default async function dommaDownloads(fastify, options) {
    const {registerShortcode, registerTransform} = options.hooks;
    const log = fastify.log || console;
    const releases = new Releases(DATA, log);
    const builder = new Builder(DATA, releases, log);

    // A failed sync (GitHub unreachable) tries again in ten minutes rather than waiting six hours.
    let retry = null;
    const sync = () => releases.sync().catch(err => {
        log.warn?.(`[domma-downloads] sync failed: ${err.message}`);
        clearTimeout(retry);
        retry = setTimeout(sync, 10 * 60 * 1000);
        retry.unref?.();
    });
    sync();
    const timer = setInterval(sync, SYNC_EVERY);
    timer.unref?.();
    fastify.addHook?.('onClose', async () => { clearInterval(timer); clearTimeout(retry); });

    registerShortcode('domma-downloads', () => '<div class="djs-downloads-slot"></div>');
    registerTransform('markdown:afterParse', (html) => {
        if (typeof html !== 'string' || !html.includes('djs-downloads-slot')) return html;
        const tpl = fs.readFileSync(path.join(HERE, 'public', 'template.html'), 'utf8');
        const assets = `<link rel="stylesheet" href="/plugins/domma-downloads/public/downloads.css?v=${esc(VERSION)}">
<script type="module" src="/plugins/domma-downloads/public/downloads.js?v=${esc(VERSION)}"></script>`;
        return html.replace(/<div class="djs-downloads-slot"><\/div>/, `${assets}\n${tpl}`);
    });

    fastify.get('/info', async (request, reply) => {
        const rel = releases.current();
        if (!rel) return reply.code(503).send({error: 'The release files are still being fetched - try again in a minute.'});
        const meta = builder.metadata(rel);
        reply.header('Cache-Control', 'public, max-age=300');
        return {version: rel.version, modules: meta.modules, css: meta.css, presets: meta.presets, files: fileList(rel), themes: themes(rel)};
    });

    fastify.get('/file', async (request, reply) => {
        const rel = releases.current();
        const file = rel && servable(rel, request.query?.p);
        if (!file) return reply.code(404).type('text/plain').send('No such file.');
        reply.header('Cache-Control', 'public, max-age=3600');
        reply.type(TYPES[path.extname(file)] || 'application/octet-stream');
        if (request.query?.download) reply.header('Content-Disposition', `attachment; filename="${path.basename(file)}"`);
        return reply.send(fs.createReadStream(file));
    });

    const recent = new Map();     // ip -> [timestamps of uncached builds]
    fastify.post('/build', async (request, reply) => {
        const modules = Array.isArray(request.body?.modules) ? request.body.modules.map(String).slice(0, 32) : [];
        const ip = request.ip;
        const now = Date.now();
        const mine = (recent.get(ip) || []).filter(t => now - t < 3600000);
        try {
            // Cached builds are free; only new ones count towards the limit.
            const rel = releases.current();
            const meta = rel && builder.metadata(rel);
            const wanted = meta ? builder.resolve(modules, meta) : [];
            if (mine.length >= BUILDS_PER_HOUR && !builder.isBuilt(wanted)) {
                return reply.code(429).send({error: 'That is a lot of bundles in an hour - try again a little later, or start from a preset.'});
            }
            const result = await builder.build(modules);
            if (!result.cached) { mine.push(now); recent.set(ip, mine); }
            const id = path.relative(path.join(DATA, 'builds'), path.dirname(result.file)).split(path.sep).join('/');
            return {url: `/api/plugins/domma-downloads/bundle?b=${encodeURIComponent(id)}`, modules: result.modules, cached: result.cached, sizes: result.sizes};
        } catch (err) {
            log.warn?.(`[domma-downloads] build failed: ${err.message}`);
            return reply.code(err.status || 500).send({error: err.status ? err.message : 'The build did not finish - please try again.'});
        }
    });

    fastify.get('/bundle', async (request, reply) => {
        const id = String(request.query?.b || '');
        if (!/^\d+\.\d+\.\d+\/[0-9a-f]{16}$/.test(id)) return reply.code(404).type('text/plain').send('No such bundle.');
        const dir = path.join(DATA, 'builds', ...id.split('/'));
        const zip = fs.existsSync(dir) && fs.readdirSync(dir).find(f => f.endsWith('.zip'));
        if (!zip) return reply.code(404).type('text/plain').send('No such bundle.');
        reply.type('application/zip').header('Content-Disposition', `attachment; filename="${zip}"`);
        return reply.send(fs.createReadStream(path.join(dir, zip)));
    });
}
