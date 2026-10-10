#!/usr/bin/env node
/**
 * Phase 3 of docs/plans/2026-10-10-dommajs-site-on-domma-cms.md: convert old
 * showcase pages into Domma CMS pages plus demo folders.
 *
 * For each page (a path under public/showcase, e.g. `elements/card`):
 *   - the hero becomes the page's [hero]; each `section[data-section]` an H2
 *     (the With Sidebar layout lists them); each `h4.category-title` an H3;
 *     prose becomes Markdown; `pre.code-block` a fenced block;
 *   - each `.demo-area` becomes a demo folder under the showcase plugin -
 *     site/plugins/domma-showcase/public/demos/<page>/<slug>/demo.html - and a
 *     `[showcase-demo id title /]` line where it stood;
 *   - the page's inline script is split into top-level statements, and each
 *     one goes to the demo whose markup holds the ids it uses (plus anything
 *     a statement it depends on declared), as that demo's demo.js
 *     (`export function mount(root) { … }`).
 *
 * What it cannot place, it reports rather than guesses: statements that touch
 * no demo, demos whose markup carries on* handlers, and scripts loaded from
 * elsewhere. The report is the hand-conversion work list - where a demo is
 * upgraded to bindings.
 *
 * It never overwrites a demo folder or page that already exists (those have
 * been worked on by hand); --force does.
 *
 * Usage: node scripts/site-migrate/showcase.mjs <page> [<page> …] [--force] [--dry]
 */
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {JSDOM} from 'jsdom';
import * as acorn from 'acorn';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const OLD = path.join(ROOT, 'public', 'showcase');
const PAGES_OUT = path.join(ROOT, 'scripts', 'site-migrate', 'pages', 'showcase');
const DEMOS_OUT = path.join(ROOT, 'site', 'plugins', 'domma-showcase', 'public', 'demos', 'showcase');
const FORCE = process.argv.includes('--force');
const DRY = process.argv.includes('--dry');
const pagesArg = process.argv.slice(2).filter(a => !a.startsWith('--'));

/** Scripts every old page loaded; anything else is reported. */
const STANDARD_SCRIPTS = /purify\.min\.js|domma\.min\.js|domma-syntax\.min\.js|layouts\/js\//;
/** Statements that only re-did page set-up the CMS already does. */
const NOOP = /^\s*(I\.scan\(\)|Domma\.icons\.scan\(\)|Domma\.syntax\.scan\(\))\s*;?\s*$/;

/** Classes that mark a demo on the old pages (the rest are found by what the script touches). */
const DEMO_CLASS = /\b(demo-area|[a-z]+-try-section|try-section-style|demo-container|component-demo|effect-demo|forms-demo|bind-demo|tree-demo|tabs-demo-area|timer-demo-area)\b/;
const slugify = (s) => String(s).toLowerCase()
    .replace(/^(example|step|demo)\s*\d+\s*[:.-]\s*/i, '')
    .replace(/&/g, ' and ').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 48) || 'demo';
const text = (el) => el.textContent.replace(/\s+/g, ' ').trim();

// ---- HTML -> Markdown (the prose between demos) ---------------------------

function inline(node) {
    let out = '';
    for (const n of node.childNodes) {
        if (n.nodeType === 3) { out += n.textContent.replace(/\s+/g, ' '); continue; }
        if (n.nodeType !== 1) continue;
        const t = n.tagName.toLowerCase();
        const inner = inline(n);
        if (t === 'code') out += '`' + n.textContent + '`';
        else if (t === 'strong' || t === 'b') out += inner.trim() ? `**${inner.trim()}**` : '';
        else if (t === 'em' || t === 'i') out += inner.trim() ? `*${inner.trim()}*` : '';
        else if (t === 'a') out += `[${inner.trim()}](${newHref(n.getAttribute('href') || '')})`;
        else if (t === 'br') out += '  \n';
        else if (n.getAttribute('data-icon')) out += `[icon name="${n.getAttribute('data-icon')}" /]`;
        else out += inner;
    }
    return out;
}

/** Old relative links ('../modal/', 'index.html#x') to new site addresses. */
let currentPage = '';
function newHref(href) {
    if (!href || /^(https?:|mailto:|#)/.test(href)) return href;
    const base = new URL(`https://x/showcase/${currentPage}/`);
    const u = new URL(href, base);
    return u.pathname.replace(/\/index\.html$/, '').replace(/\.html$/, '').replace(/\/$/, '') + u.hash || '/';
}

function list(el, depth = 0) {
    const ordered = el.tagName === 'OL';
    return [...el.children].filter(li => li.tagName === 'LI').map((li, i) => {
        const nested = [...li.children].filter(c => c.tagName === 'UL' || c.tagName === 'OL');
        const clone = li.cloneNode(true);
        clone.querySelectorAll('ul, ol').forEach(x => x.remove());
        const line = `${'  '.repeat(depth)}${ordered ? `${i + 1}.` : '-'} ${inline(clone).trim()}`;
        return [line, ...nested.map(n => list(n, depth + 1))].join('\n');
    }).join('\n');
}

function table(el) {
    const rows = [...el.querySelectorAll('tr')].map(tr => [...tr.children].map(c => inline(c).trim().replace(/\|/g, '\\|')));
    if (!rows.length) return '';
    const w = Math.max(...rows.map(r => r.length));
    const line = (r) => `| ${[...r, ...Array(w - r.length).fill('')].join(' | ')} |`;
    return ['[table striped="true"]', line(rows[0]), line(Array(w).fill('---')), ...rows.slice(1).map(line), '[/table]'].join('\n');
}

// ---- the page -------------------------------------------------------------

function convertPage(page) {
    currentPage = page;
    const file = fs.existsSync(path.join(OLD, page, 'index.html')) ? path.join(OLD, page, 'index.html') : path.join(OLD, `${page}.html`);
    const doc = new JSDOM(fs.readFileSync(file, 'utf8')).window.document;
    const report = {page, demos: 0, unplaced: [], handlers: [], externalScripts: [], skipped: [], upgrade: []};

    const title = text(doc.querySelector('.hero-title') || doc.querySelector('h1') || doc.querySelector('title'));
    const tagline = text(doc.querySelector('.hero-subtitle') || {textContent: ''});
    const description = doc.querySelector('meta[name="description"]')?.getAttribute('content') || tagline;

    const md = [];
    const demos = [];      // {id, slug, el, title}
    let lastHeading = title;
    const usedSlugs = new Set();

    function demo(el) {
        // A heading at the top of the demo names it ("Try It - Event Console").
        const head = el.firstElementChild && /^H[2-5]$/.test(el.firstElementChild.tagName) ? el.firstElementChild : null;
        if (head) { lastHeading = text(head).replace(/^try it\s*[-:]\s*/i, ''); head.remove(); }
        let slug = slugify(lastHeading);
        for (let n = 2; usedSlugs.has(slug); n++) slug = `${slugify(lastHeading)}-${n}`;
        usedSlugs.add(slug);
        const id = `showcase/${page}/${slug}`;
        demos.push({id, slug, el, title: lastHeading});
        md.push(`[showcase-demo id="${id}" title="${lastHeading.replace(/"/g, '\'')}" /]`);
        el.querySelectorAll('*').forEach(x => {
            for (const a of [...x.attributes]) if (/^on/i.test(a.name)) report.handlers.push(`${slug}: ${x.tagName.toLowerCase()} ${a.name}`);
        });
    }

    function block(el) {
        const t = el.tagName.toLowerCase();
        const cls = el.className || '';
        if (DEMO_CLASS.test(cls) || touched(el)) return demo(el);
        if (t === 'h4' || t === 'h3' || t === 'h5') { lastHeading = text(el); md.push(`### ${inline(el).trim()}`); return; }
        if (t === 'h2' || t === 'h1') return;   // the section's own title - already written
        if (t === 'pre') {
            const lang = (/language-([a-z]+)/.exec(cls + ' ' + (el.querySelector('code')?.className || '')) || [])[1] || '';
            const fixed = lang === 'javascript' && /^\s*</.test(el.textContent) ? 'html' : lang;
            md.push('```' + fixed + '\n' + el.textContent.replace(/^\n+|\s+$/g, '') + '\n```');
            return;
        }
        if (t === 'p') { const s = inline(el).trim(); if (s) md.push(s); return; }
        if (t === 'ul' || t === 'ol') { md.push(list(el)); return; }
        if (t === 'table') { md.push(table(el)); return; }
        if (t === 'blockquote' || /\b(alert|callout|note|tip)\b/.test(cls)) {
            if (el.querySelector('.demo-area')) return [...el.children].forEach(block);
            md.push('> ' + inline(el).trim().replace(/\n/g, '\n> '));
            return;
        }
        if (t === 'script' || t === 'style') return;
        // A wrapper: walk into it.
        if (el.children.length) return [...el.children].forEach(block);
        const s = inline(el).trim();
        if (s) md.push(s);
    }

    // What the page's script touches: a block holding any of these is live, so it is a demo.
    const scriptText = [...doc.querySelectorAll('script:not([src])')].map(x => x.textContent).join('\n');
    const touchedIds = new Set([...scriptText.matchAll(/['"`]#([A-Za-z][\w-]*)/g)].map(m => m[1]));
    const touchedClasses = new Set([...scriptText.matchAll(/['"`]\.([A-Za-z][\w-]*)['"`]/g)].map(m => m[1]));
    function touched(el) {
        if (el.tagName === 'PRE' || el.tagName === 'SCRIPT') return false;
        for (const id of touchedIds) if (el.id === id || el.querySelector(`#${CSS.escape(id)}`)) return true;
        for (const c of touchedClasses) if (el.classList.contains(c) || el.querySelector(`.${CSS.escape(c)}`)) return true;
        return false;
    }

    const sections = [...doc.querySelectorAll('section[data-section]')];
    for (const section of sections) {
        const heading = section.dataset.section === 'Overview' ? 'Overview' : text(section.querySelector('.card-header h2, .card-header h1, h2') || {textContent: section.dataset.section});
        md.push(`## ${heading}`);
        lastHeading = heading;
        const body = section.querySelector('.card-body') || section;
        [...body.children].forEach(block);
    }

    // ---- the script, statement by statement --------------------------------
    for (const s of doc.querySelectorAll('script[src]')) {
        if (!STANDARD_SCRIPTS.test(s.getAttribute('src'))) report.externalScripts.push(s.getAttribute('src'));
    }
    const code = [...doc.querySelectorAll('script:not([src])')].map(s => s.textContent).join('\n');
    const perDemo = new Map(demos.map(d => [d.id, []]));
    if (code.trim()) {
        let ast;
        try { ast = acorn.parse(code, {ecmaVersion: 'latest', sourceType: 'module'}); } catch (err) { report.unplaced.push(`script did not parse: ${err.message}`); }
        let body = ast?.body || [];
        // $(() => { … }) / Domma.ready(…) / DOMContentLoaded wrappers: the statements inside.
        const unwrap = (st) => {
            const call = st.type === 'ExpressionStatement' && st.expression.type === 'CallExpression' ? st.expression : null;
            const fn = call?.arguments.find(a => a.type === 'ArrowFunctionExpression' || a.type === 'FunctionExpression');
            if (fn && fn.body.type === 'BlockStatement' && (call.arguments.length === 1 || /DOMContentLoaded/.test(code.slice(call.start, call.end).slice(0, 80)))) return fn.body.body;
            return [st];
        };
        body = body.flatMap(unwrap);
        // Each statement with its source (leading comments included), the ids/classes it
        // touches and the names it declares; then place them, repeating until nothing
        // moves - a declaration goes where its name is used, even when it comes first.
        const stmts = [];
        let prevEnd = body[0]?.start ?? 0;
        body.forEach((st, index) => {
            const src = code.slice(prevEnd, st.end).replace(/^\s*\n/, '');
            prevEnd = st.end;
            if (NOOP.test(code.slice(st.start, st.end))) return;
            const declares = [];
            if (st.type === 'VariableDeclaration') for (const d of st.declarations) if (d.id.type === 'Identifier') declares.push(d.id.name);
            if (st.type === 'FunctionDeclaration' && st.id) declares.push(st.id.name);
            stmts.push({index, src, declares, owner: null,
                ids: [...src.matchAll(/['"`]#([A-Za-z][\w-]*)/g)].map(m => m[1]),
                classes: [...src.matchAll(/['"`]\.([A-Za-z][\w-]*)['"`]/g)].map(m => m[1]),
                words: new Set([...src.matchAll(/\b([A-Za-z_$][\w$]*)\b/g)].map(m => m[1]))});
        });
        for (const x of stmts) {
            const has = (d, sel) => d.el.matches(sel) || d.el.querySelector(sel);
            x.owner = demos.find(d => x.ids.some(id => has(d, `#${CSS.escape(id)}`)))
                || demos.find(d => x.classes.some(c => has(d, `.${CSS.escape(c)}`))) || null;
        }
        for (let moved = true; moved;) {
            moved = false;
            for (const x of stmts) {
                if (x.owner) continue;
                // Uses a name a placed statement declared -> same demo.
                const fromDecl = stmts.find(y => y.owner && y.declares.some(n => x.words.has(n)));
                // Declares a name a placed statement uses -> that demo.
                const fromUse = x.declares.length && stmts.find(y => y.owner && x.declares.some(n => y.words.has(n)));
                const o = fromDecl?.owner || fromUse?.owner;
                if (o) { x.owner = o; moved = true; }
            }
        }
        for (const x of stmts.sort((a, b) => a.index - b.index)) {
            if (x.owner) perDemo.get(x.owner.id).push(x.src);
            else report.unplaced.push(x.src.trim().split('\n').find(l => l.trim() && !l.trim().startsWith('//'))?.trim().slice(0, 100) || '');
        }
    }

    // ---- write -------------------------------------------------------------
    const pageFile = path.join(PAGES_OUT, `${page}.md`);
    const front = ['---', `title: ${title}`, `description: ${JSON.stringify(description)}`, 'layout: with-sidebar', 'status: published', 'sortOrder: 50', '---', ''];
    const hero = `[hero title="${title.replace(/"/g, '\'')}" tagline="${tagline.replace(/"/g, '\'')}" align="center"][/hero]\n`;
    const markdown = front.join('\n') + '\n' + hero + '\n' + md.join('\n\n').replace(/\n{3,}/g, '\n\n') + '\n';
    const writes = [];
    if (FORCE || !fs.existsSync(pageFile)) writes.push([pageFile, markdown]); else report.skipped.push(path.relative(ROOT, pageFile));
    for (const d of demos) {
        const dir = path.join(DEMOS_OUT, page, d.slug);
        if (!FORCE && fs.existsSync(dir)) { report.skipped.push(path.relative(ROOT, dir)); continue; }
        const html = d.el.innerHTML.replace(/^\n+|\s+$/g, '');
        writes.push([path.join(dir, 'demo.html'), reindent(upgradeHtml(html)) + '\n']);
        const js = perDemo.get(d.id);
        if (js.length) {
            const body = upgrade(dedent(js.join('\n')));
            for (const [re, why] of NEEDS_HAND) if (re.test(body)) report.upgrade.push(`${d.slug}: ${why}`);
            writes.push([path.join(dir, 'demo.js'), `/**\n * ${d.title} - from public/showcase/${page}.\n */\nexport function mount(root) {\n${indent(body, '    ')}\n}\n`]);
        }
    }
    report.demos = demos.length;
    if (!DRY) for (const [f, content] of writes) { fs.mkdirSync(path.dirname(f), {recursive: true}); fs.writeFileSync(f, content); }
    return report;
}

/**
 * The automatic part of the upgrade: the short alias, a toast instead of alert(),
 * and selectors found inside the demo rather than the whole page.
 */
function upgrade(js) {
    return js
        .replace(/\bDomma\.elements\./g, 'E.')
        .replace(/(^|[^.\w])alert\(/g, '$1E.toast(')
        .replace(/\$\((['"])#([A-Za-z][\w-]*)\1\)/g, '$(root).find(\'#$2\')')
        .replace(/\bE\.([a-zA-Z]+)\((['"])#([A-Za-z][\w-]*)\2/g, 'E.$1(root.querySelector(\'#$3\')');
}

/**
 * The automatic part of the markup upgrade: tabs built from <li> items become
 * buttons with tab roles (keyboard- and screen-reader-friendly), and buttons
 * get an explicit type.
 */
function upgradeHtml(html) {
    return html
        .replace(/<ul(\s+[^>]*class="[^"]*\btab-list\b[^"]*"[^>]*)>([\s\S]*?)<\/ul>/g, (_m, attrs, inner) =>
            `<div${attrs} role="tablist">${inner.replace(/<li(\s+[^>]*class="[^"]*\btab-item\b[^"]*"[^>]*)>([\s\S]*?)<\/li>/g, '<button type="button"$1 role="tab">$2</button>')}</div>`)
        .replace(/<div(\s+[^>]*class="[^"]*\btab-panel\b[^"]*")(?![^>]*role=)/g, '<div$1 role="tabpanel"')
        .replace(/<button(?![^>]*\btype=)/g, '<button type="button"');
}

/** What needs a hand upgrade: anything that outlives the demo, or builds HTML from data. */
const NEEDS_HAND = [
    [/\$\(\s*document\s*\)|document\.addEventListener|window\.addEventListener|\$\(\s*window\s*\)/, 'listens on the whole page - needs a teardown'],
    [/\bM\.(on|subscribe)\(/, 'subscribes to events - needs a teardown'],
    [/\bsetInterval\(|\bsetTimeout\(/, 'uses a timer - clear it in the teardown'],
    [/\.innerHTML\s*=|\.html\(\s*`|\.append\(\s*`|\.prepend\(\s*`/, 'builds HTML from a string - prefer bindings (data-each, data-bind-text)'],
];

const VOID = new Set(['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'source', 'track', 'wbr']);
/** Re-indent markup by tag depth (four spaces), ignoring how the old page happened to indent it. */
function reindent(html) {
    let depth = 0;
    const out = [];
    for (const raw of html.split('\n')) {
        const line = raw.trim();
        if (!line) { if (out.length && out.at(-1) !== '') out.push(''); continue; }
        const opens = [...line.matchAll(/<([a-zA-Z][\w-]*)\b[^>]*?(\/?)>/g)].filter(m => !m[2] && !VOID.has(m[1].toLowerCase())).length;
        const closes = (line.match(/<\/[a-zA-Z][\w-]*\s*>/g) || []).length;
        const leadingCloses = (line.match(/^(?:<\/[a-zA-Z][\w-]*\s*>\s*)+/) || [''])[0].match(/<\//g)?.length || 0;
        depth = Math.max(0, depth - leadingCloses);
        out.push('    '.repeat(depth) + line);
        depth = Math.max(0, depth + opens - (closes - leadingCloses));
    }
    return out.join('\n').replace(/\n{3,}/g, '\n\n').trim();
}

function dedent(s) {
    const lines = s.split('\n');
    // innerHTML's first line starts straight after the parent's tag, with no indent of its
    // own: measure the indent on the rest, and leave the first line as it is.
    const rest = lines[0].match(/^ */)[0].length === 0 ? lines.slice(1) : lines;
    const min = Math.min(...rest.filter(l => l.trim()).map(l => l.match(/^ */)[0].length));
    const cut = Number.isFinite(min) ? min : 0;
    return lines.map((l, i) => (i === 0 && rest !== lines ? l : l.slice(Math.min(cut, l.match(/^ */)[0].length)))).join('\n');
}
const indent = (s, pad) => s.split('\n').map(l => (l.trim() ? pad + l : l)).join('\n');
const CSS = {escape: (s) => String(s).replace(/([^\w-])/g, '\\$1')};

let failed = 0;
for (const page of pagesArg) {
    try {
        const r = convertPage(page.replace(/^\/?showcase\//, '').replace(/\/$/, ''));
        console.log(`\n${r.page}: ${r.demos} demos`);
        if (r.unplaced.length) console.log(`  unplaced script (${r.unplaced.length}):\n    ${r.unplaced.join('\n    ')}`);
        if (r.upgrade.length) console.log(`  needs a hand upgrade (${r.upgrade.length}):\n    ${r.upgrade.join('\n    ')}`);
        if (r.handlers.length) console.log(`  inline handlers (${r.handlers.length}):\n    ${r.handlers.join('\n    ')}`);
        if (r.externalScripts.length) console.log(`  other scripts: ${r.externalScripts.join(', ')}`);
        if (r.skipped.length) console.log(`  kept (already there): ${r.skipped.length}`);
    } catch (err) {
        failed++;
        console.error(`${page}: FAILED - ${err.message}`);
    }
}
if (!pagesArg.length) console.error('Usage: showcase.mjs <page> [<page> …] [--force] [--dry]');
process.exit(failed ? 1 : 0);
