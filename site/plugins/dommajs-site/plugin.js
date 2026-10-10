/**
 * dommajs.org site - this site's own layout and home page pieces.
 *
 *   [dommajs-hero /]      the home page's hero: the logo beside the name, the
 *                         typed tagline, and the module tiles grouped Core /
 *                         Data / UI / Tools, read from the Modules collection.
 *                         Hovering a tile types its summary into the tagline.
 *   [dommajs-cms-band /]  the Domma CMS band: a typed headline, four counters,
 *                         the calls to action. Its figures are attributes:
 *                         shortcodes, themes, plugins, steps.
 *
 * Both leave a placeholder that the markdown:afterParse transform swaps for
 * the markup AFTER the page is sanitised, because the logo is an inline SVG
 * (which the sanitiser strips). The markup is ours, built from escaped data.
 * public/site.js does the motion; public/site.css the look.
 */
import fs from 'node:fs';
import path from 'node:path';

const esc = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const GROUPS = ['Core', 'Data', 'UI', 'Tools'];

const LOGO = `<svg class="djs-hero-logo" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" width="120" height="120" aria-hidden="true">
<path d="M12 8 L12 40" stroke="currentColor" stroke-width="4" stroke-linecap="round"/>
<path d="M12 8 L24 8" stroke="currentColor" stroke-width="4" stroke-linecap="round"/>
<path d="M12 40 L24 40" stroke="currentColor" stroke-width="4" stroke-linecap="round"/>
<path d="M24 8 L36 16" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M36 16 L36 32" stroke="currentColor" stroke-width="4" stroke-linecap="round"/>
<path d="M36 32 L24 40" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
<circle cx="24" cy="24" r="3" fill="currentColor"/>
</svg>`;

/** The Modules collection's entries, in order (none when it cannot be read). */
function modules() {
    try {
        const rows = JSON.parse(fs.readFileSync(path.resolve('content', 'collections', 'modules', 'data.json'), 'utf8'));
        return rows.map(r => r.data || {}).filter(m => m.name && m.url).sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
    } catch {
        return [];
    }
}

function hero() {
    const all = modules();
    const groups = GROUPS.map(g => [g, all.filter(m => m.group === g)]).filter(([, items]) => items.length);
    const tiles = groups.map(([g, items]) => `<div class="djs-feature-group">
<span class="djs-feature-group-label">${esc(g)}</span>
<div class="djs-feature-group-items">${items.map(m => `<a class="djs-feature" href="${esc(m.url)}" data-tagline="${esc(m.summary || '')}"><span class="djs-feature-icon" data-icon="${esc(m.icon || 'box')}" data-icon-size="40"></span><span class="djs-feature-label">${esc(m.name)}</span></a>`).join('')}</div>
</div>`).join('\n');
    return `<section class="djs-hero bg-ambient-float-blobs">
<div class="djs-hero-grid">
<div>
<div class="djs-hero-brand">${LOGO}<h1 class="djs-hero-name">DommaJS</h1></div>
<p class="djs-backronym"><strong>D</strong>ynamic <strong>O</strong>bject <strong>M</strong>anipulation &amp; <strong>M</strong>odeling <strong>A</strong>PI</p>
</div>
<div>
<p class="djs-tagline" id="djs-tagline" aria-live="polite">A lightweight, zero-dependency JavaScript framework.</p>
<div class="djs-hero-cta"><a href="/showcase" class="djs-cta">Explore the Showcase <span class="djs-cta-arrow" aria-hidden="true">&rarr;</span></a></div>
</div>
</div>
<div class="djs-features">
${tiles}
</div>
</section>`;
}

function cmsBand(attrs) {
    const n = (v, d) => (Number.isFinite(parseInt(v, 10)) ? parseInt(v, 10) : d);
    const stats = [
        [n(attrs.shortcodes, 30), 0, 'Built-in shortcodes'],
        [n(attrs.themes, 37), 0, 'Themes with live preview'],
        [n(attrs.plugins, 2), 0, 'Free plugins included'],
        [n(attrs.steps, 0), 60, 'Build steps'],
    ];
    return `<section class="djs-cms-band bg-ambient-float-blobs" id="djs-cms-band" aria-labelledby="djs-cms-band-headline">
<div class="djs-cms-band-inner">
<h2 class="djs-cms-band-headline" id="djs-cms-band-headline">Want Domma JS power in a CMS?</h2>
<p class="djs-cms-band-subhead">Meet <strong>Domma CMS</strong> - the CMS that actually delivers.</p>
<p class="djs-cms-band-lead">Markdown-first, files or MongoDB, ${stats[1][0]} themes, zero build step. This site runs on it.</p>
<div class="djs-cms-band-stats">
${stats.map(([to, from, label]) => `<div class="djs-cms-stat"><span class="djs-cms-stat-number" data-from="${from}" data-target="${to}">${to}</span><span class="djs-cms-stat-label">${esc(label)}</span></div>`).join('\n')}
</div>
<div class="djs-cms-band-cta">
<a href="https://cms.dommajs.org/" class="btn btn-primary btn-lg glow-primary" target="_blank" rel="noopener">Get Started Free &rarr;</a>
<a href="https://cms.dommajs.org/features" class="btn btn-outline btn-lg" id="djs-cms-band-cta-secondary" target="_blank" rel="noopener">See Features</a>
</div>
<p class="djs-cms-band-tagline">Built on Domma <span class="sep">&middot;</span> Self-hosted <span class="sep">&middot;</span> Free to try</p>
</div>
</section>`;
}

const SLOT_RE = /<div class="djs-slot" data-djs="(hero|cms-band)"((?: data-[a-z]+="[^"]*")*)><\/div>/g;

export default async function dommajsSite(fastify, options) {
    const {registerShortcode, registerTransform} = options.hooks;

    registerShortcode('dommajs-hero', () => '<div class="djs-slot" data-djs="hero"></div>');
    registerShortcode('dommajs-cms-band', (attrStr, _body, ctx) => {
        const a = ctx.parseShortcodeAttrs(attrStr);
        const data = ['shortcodes', 'themes', 'plugins', 'steps']
            .filter(k => a[k] != null).map(k => ` data-${k}="${esc(a[k])}"`).join('');
        return `<div class="djs-slot" data-djs="cms-band"${data}></div>`;
    });

    registerTransform('markdown:afterParse', (html) => {
        if (typeof html !== 'string' || !html.includes('djs-slot')) return html;
        return html.replace(SLOT_RE, (_m, kind, dataStr) => {
            if (kind === 'hero') return hero();
            const attrs = Object.fromEntries([...dataStr.matchAll(/data-([a-z]+)="([^"]*)"/g)].map(m => [m[1], m[2]]));
            return cmsBand(attrs);
        });
    });
}
