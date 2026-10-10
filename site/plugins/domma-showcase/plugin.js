/**
 * Domma Showcase - live demos with their source, for dommajs.org.
 *
 * A demo is a folder of files under public/demos/<id>/: demo.html (markup,
 * using domma-reactive bindings rather than inline handlers), and optionally
 * demo.js (an ES module exporting mount(root) -> teardown) and demo.css.
 * Demos are code: they live in git and are reviewed as code.
 *
 *   [showcase-demo id="elements/card/basic-card" title="Basic card" /]
 *
 * The shortcode leaves a placeholder; the markdown:afterParse transform swaps
 * it for the demo AFTER the page is sanitised, because demos need markup the
 * page sanitiser strips (canvas, svg, role, tabindex, aria-*). They are
 * trusted the way theme files are - files in git, never user input - and never
 * carry on* handlers or inline scripts. Beside each demo, tabs show the same
 * files' source, so the code shown cannot drift from the code that runs.
 *
 * public/showcase.js mounts the demos on the page, isolates failures, and adds
 * the right-click menu (copy HTML / JS, reset, open on its own).
 *
 * GET /api/plugins/domma-showcase/demo?id=… is one demo on a page of its own.
 */
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const DEMOS = path.join(HERE, 'public', 'demos');
const VERSION = JSON.parse(fs.readFileSync(path.join(HERE, 'plugin.json'), 'utf8')).version;
const ID_RE = /^[a-z0-9][a-z0-9-]*(?:\/[a-z0-9][a-z0-9-]*){1,6}$/;

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const read = (dir, name) => { try { return fs.readFileSync(path.join(dir, name), 'utf8'); } catch { return null; } };

/** A demo's files, or null for an unknown or malformed id. */
export function readDemo(id) {
    if (!ID_RE.test(String(id || ''))) return null;
    const dir = path.join(DEMOS, id);
    if (!dir.startsWith(DEMOS + path.sep)) return null;
    const html = read(dir, 'demo.html');
    if (html === null) return null;
    const js = read(dir, 'demo.js');
    const css = read(dir, 'demo.css');
    const mtime = Math.max(...['demo.html', 'demo.js', 'demo.css'].map(f => { try { return fs.statSync(path.join(dir, f)).mtimeMs; } catch { return 0; } }));
    return {id, html, js, css, v: `${VERSION}-${Math.round(mtime).toString(36)}`};
}

/**
 * The opt-in Domma bundles a demo's script needs, which the CMS does not load on
 * every page: the tools (editor, page and theme rollers, schema builder) - a copy
 * in public/vendor/ from Domma's build - and the flags, which the CMS serves.
 */
const BUNDLES = [
    ['tools', /\bE\.(editor|pageRoller|schemaBuilder|themeRoller|printToPdf)\b|\bDomma\.(tools|themeRoller|pageRoller|editor)\b/],
    ['flags', /\bFL\.|\bDomma\.flags\b/],
];
const needs = (js) => BUNDLES.filter(([, re]) => js && re.test(js)).map(([name]) => name);

/** The source tabs beside a demo. */
function sourceTabs(demo) {
    const tabs = [['HTML', 'html', demo.html], ['JS', 'javascript', demo.js], ['CSS', 'css', demo.css]].filter(t => t[2] && t[2].trim());
    if (!tabs.length) return '';
    return `<div class="tabs showcase-demo-code">
<div class="tab-list" role="tablist">${tabs.map(([label], i) => `<button type="button" class="tab-item${i ? '' : ' active'}" role="tab">${label}</button>`).join('')}</div>
${tabs.map(([, lang, src], i) => `<div class="tab-panel${i ? '' : ' active'}" role="tabpanel"><pre><code class="language-${lang}">${esc(src.trim())}</code></pre></div>`).join('\n')}
</div>`;
}

/** One demo, as it appears on a page. */
export function renderDemo(id, title = '') {
    const demo = readDemo(id);
    if (!demo) return `<div class="showcase-demo showcase-demo--missing" role="note">Demo not found: <code>${esc(id)}</code></div>`;
    const module = demo.js ? ` data-module="/plugins/domma-showcase/public/demos/${esc(id)}/demo.js?v=${esc(demo.v)}"` : '';
    const need = needs(demo.js);
    const bundles = need.length ? ` data-needs="${need.join(' ')}"` : '';
    const style = demo.css ? `<style>.showcase-demo[data-demo="${esc(id)}"] .showcase-demo-stage { ${demo.css} }</style>` : '';
    return `<figure class="showcase-demo" data-demo="${esc(id)}"${module}${bundles}>${style}
${title ? `<figcaption class="showcase-demo-title">${esc(title)}</figcaption>` : ''}
<div class="showcase-demo-stage">${demo.html}</div>
${sourceTabs(demo)}
</figure>`;
}

/**
 * The demo stylesheets a page needs: the shared one, and its own (scoped to its
 * demos) when the old page had one - found from the first demo's id,
 * showcase/<page>/<demo>. Linked only on pages with demos.
 */
function demoStyles(firstId) {
    const links = [`<link rel="stylesheet" href="/plugins/domma-showcase/public/styles/shared.css?v=${esc(VERSION)}">`];
    const page = String(firstId || '').split('/').slice(1, -1).join('/');
    if (page && fs.existsSync(path.join(HERE, 'public', 'styles', `${page}.css`))) {
        links.push(`<link rel="stylesheet" href="/plugins/domma-showcase/public/styles/${esc(page)}.css?v=${esc(VERSION)}">`);
    }
    return links.join('\n') + '\n';
}

const SLOT_RE = /<div class="showcase-demo-slot" data-showcase-demo="([^"]+)"(?: data-title="([^"]*)")?><\/div>/g;
const unesc = (s) => String(s).replace(/&quot;/g, '"').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');

export default async function dommaShowcase(fastify, options) {
    const {registerShortcode, registerTransform} = options.hooks;

    registerShortcode('showcase-demo', (attrStr, _body, ctx) => {
        const {id = '', title = ''} = ctx.parseShortcodeAttrs(attrStr);
        return `<div class="showcase-demo-slot" data-showcase-demo="${esc(id)}"${title ? ` data-title="${esc(title)}"` : ''}></div>`;
    });

    registerTransform('markdown:afterParse', (html) => {
        if (typeof html !== 'string' || !html.includes('showcase-demo-slot')) return html;
        let first = null;
        const out = html.replace(SLOT_RE, (_m, id, title) => {
            first ??= unesc(id);
            return renderDemo(unesc(id), unesc(title || ''));
        });
        return demoStyles(first) + out;
    });

    // One demo on a page of its own - for linking, and the "Open on its own" menu item.
    fastify.get('/demo', async (request, reply) => {
        const id = String(request.query?.id || '');
        const demo = readDemo(id);
        if (!demo) return reply.code(404).type('text/plain').send('No such demo.');
        let theme = 'charcoal-dark';
        try { theme = JSON.parse(fs.readFileSync(path.resolve('config/theme.json'), 'utf8')).theme || theme; } catch { /* default */ }
        reply.type('text/html; charset=utf-8').send(`<!DOCTYPE html>
<html lang="en-GB">
<head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="robots" content="noindex">
<title>${esc(id)} - Domma Showcase</title>
<link rel="stylesheet" href="/dist/domma/domma.css"><link rel="stylesheet" href="/dist/domma/grid.css">
<link rel="stylesheet" href="/dist/domma/elements.css"><link rel="stylesheet" href="/dist/domma/themes/domma-themes.css">
<link rel="stylesheet" href="/plugins/domma-showcase/public/showcase.css?v=${esc(VERSION)}">
${demoStyles(id)}</head>
<body class="dm-theme-${esc(theme)}">
<main class="container py-5">${renderDemo(id)}</main>
<script src="/dist/domma/domma.min.js"></script>
<script type="module" src="/plugins/domma-showcase/public/showcase.js?v=${esc(VERSION)}"></script>
</body>
</html>`);
    });
}
