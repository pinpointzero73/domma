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
 * --restore-layouts restores missing layout frames in existing demos without regenerating their code.
 */
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {JSDOM} from 'jsdom';
import * as acorn from 'acorn';
import postcss from 'postcss';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const OLD = path.join(ROOT, 'public', 'showcase');
const PAGES_OUT = path.join(ROOT, 'scripts', 'site-migrate', 'pages', 'showcase');
const DEMOS_OUT = path.join(ROOT, 'site', 'plugins', 'domma-showcase', 'public', 'demos', 'showcase');
// Pictures the old pages used by a relative path, copied here and pointed at.
const ASSETS_OUT = path.join(ROOT, 'site', 'plugins', 'domma-showcase', 'public', 'assets');
const ASSETS_URL = '/plugins/domma-showcase/public/assets';
const FORCE = process.argv.includes('--force');
const RESTORE_LAYOUTS = process.argv.includes('--restore-layouts');
// Upgraded by hand since conversion: never regenerated, even with --force.
const HAND = new Set(fs.readFileSync(path.join(path.dirname(fileURLToPath(import.meta.url)), 'hand-upgraded.txt'), 'utf8')
    .split('\n').map(l => l.trim()).filter(l => l && !l.startsWith('#')));
const DRY = process.argv.includes('--dry');
const pagesArg = process.argv.slice(2).filter(a => !a.startsWith('--'));

/** Scripts every old page loaded; anything else is reported. */
const STANDARD_SCRIPTS = /purify\.min\.js|domma\.min\.js|domma-syntax\.min\.js|layouts\/js\//;
/**
 * Statements that only re-did page set-up the CMS already does: icon and syntax
 * scans (guarded or not), theme start-up, Domma.init, start-up logging.
 */
const SETUP_CALL = String.raw`(?:(?:I\.scan|Domma\.icons\.scan|Domma\.syntax\.scan|DommaSyntax\.\w+|window\.DommaSyntax\.\w+|Domma\.theme\.init|Domma\.init\??\.?|E\.skeleton\.scan|console\.(?:log|info))\s*\([^;]*?\)|\$\.setup\(\s*\{\s*scanIcons:\s*true\s*\}\s*\))`;
/** The old effects pages' reduced-motion notice - the CMS's effects controls do this now. */
const MOTION_NOTICE = /^\s*if\s*\(\s*window\.matchMedia\(\s*['"]\(prefers-reduced-motion: reduce\)['"]\s*\)\.matches\s*\)\s*\{\s*\$\(\s*['"]#motion-notice['"]\s*\)\.show\(\);?\s*\}\s*$/;
const NOOP = new RegExp(String.raw`^\s*(?:${SETUP_CALL}\s*;?\s*)+$|^\s*if\s*\([^)]*(?:Domma\.(?:icons|syntax)|DommaSyntax)[^)]*\)\s*\{?\s*(?:${SETUP_CALL}\s*;?\s*)+\}?\s*$`, 's');

/** Prose: what Markdown can hold. A block made only of these is written as text, not as a demo. */
const PROSE = new Set(['P', 'UL', 'OL', 'LI', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'STRONG', 'B', 'EM', 'I', 'CODE', 'A', 'BR', 'SPAN',
    'TABLE', 'THEAD', 'TBODY', 'TR', 'TH', 'TD', 'BLOCKQUOTE', 'SMALL', 'KBD', 'HR']);
/** Real markup (an element Markdown cannot hold, or a styled span/div) somewhere inside. */
function isVisual(el) {
    for (const x of el.querySelectorAll('*')) {
        if (x.tagName === 'DIV' && x.className && !/^(mb|mt|my|py|p|mx|px)-\d$/.test(x.className.trim())) return true;
        if (!PROSE.has(x.tagName) && x.tagName !== 'DIV') return true;
        if (x.hasAttribute('data-icon') || x.hasAttribute('style')) return true;
    }
    return false;
}

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
    // The outer row/grid is part of the demo. Removing it leaves columns and
    // feature cards stacked even though their own styles are still present.
    const frames = new Set(['row', 'grid', 'flex', 'card']);
    const css = fs.readFileSync(path.join(OLD, 'css', 'domma-showcase.css'), 'utf8')
        + [...doc.querySelectorAll('style')].map(el => el.textContent).join('\n');
    postcss.parse(css).walkRules(rule => {
        if (!rule.nodes.some(decl => decl.type === 'decl' && (decl.prop === 'display' && /^(inline-)?(grid|flex)$/.test(decl.value) || decl.prop === 'grid-template-columns'))) return;
        for (const selector of rule.selector.split(',')) {
            const match = /^\.([\w-]+)$/.exec(selector.trim());
            if (match) frames.add(match[1]);
        }
    });
    const hasFrame = el => [...el.classList].some(name => frames.has(name));
    const report = {page, demos: 0, unplaced: [], handlers: [], externalScripts: [], skipped: [], upgrade: []};

    const title = text(doc.querySelector('.hero-title') || doc.querySelector('h1') || doc.querySelector('title'));
    const tagline = text(doc.querySelector('.hero-subtitle') || {textContent: ''});
    const description = doc.querySelector('meta[name="description"]')?.getAttribute('content') || tagline;

    const md = [];
    const demos = [];      // {id, slug, el, title}
    let lastHeading = title;
    const usedSlugs = new Set();

    /** Inline handlers become data-action markers, wired in the demo's mount() (no inline script). */
    function takeHandlers(el, handlers) {
        [el, ...el.querySelectorAll('*')].forEach(x => {
            for (const a of [...x.attributes]) {
                if (!/^on[a-z]+$/i.test(a.name)) continue;
                const n = handlers.length + 1;
                handlers.push({n, event: a.name.slice(2).toLowerCase(), code: a.value.trim()});
                x.removeAttribute(a.name);
                x.setAttribute('data-action', String(n));
            }
        });
    }

    function demo(el) {
        // A heading at the top of the demo names it ("Try It - Event Console").
        const head = el.firstElementChild && /^H[2-5]$/.test(el.firstElementChild.tagName) ? el.firstElementChild : null;
        // A block straight after a demo, with nothing between and no heading of its own, is more of
        // the same demo (an input, then the buttons that drive it): one demo, not "x" and "x-2".
        const prev = demos.at(-1);
        if (!head && prev && md.at(-1) === prev.placeholder && prev.parent === el.parentElement) {
            if (!prev.parts) {
                const wrap = el.ownerDocument.createElement('div');
                prev.el.before(wrap);
                wrap.append(prev.el);
                prev.parts = [prev.el];
                prev.el = wrap;
            }
            prev.el.append(el);
            prev.parts.push(el);
            takeHandlers(el, prev.handlers);
            return;
        }
        if (head) { lastHeading = text(head).replace(/^try it\s*[-:]\s*/i, ''); head.remove(); }
        let slug = slugify(lastHeading);
        for (let n = 2; usedSlugs.has(slug); n++) slug = `${slugify(lastHeading)}-${n}`;
        usedSlugs.add(slug);
        const id = `showcase/${page}/${slug}`;
        const handlers = [];
        takeHandlers(el, handlers);
        const placeholder = `[showcase-demo id="${id}" title="${lastHeading.replace(/"/g, '\'')}" /]`;
        demos.push({id, slug, el, parent: el.parentElement, title: lastHeading, handlers, placeholder});
        md.push(placeholder);
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
        if (el.id === 'motion-notice' || el.querySelector?.('#motion-notice')) return;   // the CMS's effects controls do this
        // A wrapper of prose (or of prose and code) is walked into; a block of real markup with no
        // code in it is a visual demo even when no script touches it (glow, gradients, the grid).
        if (el.children.length) {
            if (!el.querySelector('pre') && isVisual(el)) return demo(el);
            return [...el.children].forEach(block);
        }
        const s = inline(el).trim();
        if (s) md.push(s);
    }

    // What the page's script touches: a block holding any of these is live, so it is a demo.
    const scriptText = [...doc.querySelectorAll('script:not([src])')].map(x => x.textContent).join('\n');
    const touchedIds = new Set([...scriptText.matchAll(/['"`]#([A-Za-z][\w-]*)/g), ...scriptText.matchAll(/getElementById\(\s*['"`]([A-Za-z][\w-]*)['"`]/g)].map(m => m[1]));
    const touchedClasses = new Set([...scriptText.matchAll(/['"`]\.([A-Za-z][\w-]*)['"`]/g)].map(m => m[1]));
    function touched(el) {
        if (el.tagName === 'PRE' || el.tagName === 'SCRIPT') return false;
        for (const id of touchedIds) if (el.id === id || el.querySelector(`#${CSS.escape(id)}`)) return true;
        for (const c of touchedClasses) if (el.classList.contains(c) || el.querySelector(`.${CSS.escape(c)}`)) return true;
        return false;
    }

    // The page body: every section (a card, with or without data-section) in order, plus anything
    // between them - intros, callouts - as ordinary blocks.
    const isSection = (el) => el.tagName === 'SECTION' && (el.hasAttribute('data-section') || el.classList.contains('card'));
    // Walk the whole body in order: sections wherever they are (some pages put them before <main>),
    // and anything else inside <main> as ordinary blocks. Chrome outside <main> is left out.
    const SKIP_TAGS = new Set(['SCRIPT', 'STYLE', 'NAV', 'HEADER', 'FOOTER', 'NOSCRIPT', 'LINK']);
    const top = [];
    (function collect(parent, inMain) {
        for (const el of parent.children) {
            if (SKIP_TAGS.has(el.tagName) || el.classList.contains('hero')) continue;
            if (isSection(el)) top.push(el);
            else if (el.querySelector('section')) collect(el, inMain || el.tagName === 'MAIN');
            else if (inMain || el.tagName === 'MAIN') top.push(el);
        }
    })(doc.body, false);
    for (const el of top) {
        if (el.classList?.contains('hero') || el.tagName === 'SCRIPT' || el.tagName === 'NAV') continue;
        if (!isSection(el)) { block(el); continue; }
        const head = el.querySelector(':scope > .card-header h1, :scope > .card-header h2, :scope > .card-header h3, :scope > h2');
        const heading = el.dataset.section === 'Overview' ? 'Overview' : text(head || {textContent: el.dataset.section || 'Section'});
        md.push(`## ${heading}`);
        lastHeading = heading;
        const body = el.querySelector(':scope > .card-body') || el;
        [...body.children].filter(c => !c.classList.contains('card-header')).forEach(block);
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
        // Only page-ready wrappers are unwrapped - $(fn), $.ready(fn), Domma.ready(fn),
        // addEventListener('DOMContentLoaded' | 'load', fn) - never an ordinary call that takes a
        // function, such as [...].forEach(fn).
        const READY = /^(\$|jQuery|Domma)\s*\(\s*(async\s*)?(\(|function)|^(\$|Domma)\.ready\s*\(|^(document|window)\.addEventListener\(\s*['"](DOMContentLoaded|load)['"]/;
        const unwrap = (st) => {
            const call = st.type === 'ExpressionStatement' && st.expression.type === 'CallExpression' ? st.expression : null;
            const fn = call?.arguments.find(a => a.type === 'ArrowFunctionExpression' || a.type === 'FunctionExpression');
            if (fn && fn.body.type === 'BlockStatement' && READY.test(code.slice(call.start, call.end))) return fn.body.body.flatMap(unwrap);
            return [st];
        };
        body = body.flatMap(unwrap);
        // Each statement with its source (leading comments included), the ids/classes it
        // touches and the names it declares; then place them, repeating until nothing
        // moves - a declaration goes where its name is used, even when it comes first.
        const stmts = [];
        let prevEnd = body[0]?.start ?? 0;
        body.forEach((st, index) => {
            // Only comments carry over from the gap before a statement - never code (the opening of
            // an unwrapped $(() => { … }) inside another one would otherwise ride along).
            const lead = code.slice(prevEnd, st.start).split('\n').filter(l => /^\s*(\/\/|\/\*|\*)/.test(l)).join('\n');
            const src = (lead ? lead + '\n' : '') + code.slice(st.start, st.end);
            prevEnd = st.end;
            if (NOOP.test(code.slice(st.start, st.end)) || MOTION_NOTICE.test(code.slice(st.start, st.end))) return;
            const declares = [];
            if (st.type === 'VariableDeclaration') for (const d of st.declarations) if (d.id.type === 'Identifier') declares.push(d.id.name);
            if (st.type === 'FunctionDeclaration' && st.id) declares.push(st.id.name);
            // window.copyToClipboard = function … - a page global, called from inline handlers.
            const asg = st.type === 'ExpressionStatement' && st.expression.type === 'AssignmentExpression' ? st.expression : null;
            if (asg && asg.left.type === 'MemberExpression' && asg.left.object.name === 'window' && !asg.left.computed) declares.push(asg.left.property.name);
            stmts.push({index, src, declares, owner: null, fn: st.type === 'FunctionDeclaration' || /^window\.\w+\s*=\s*(?:async\s+)?function/.test(code.slice(st.start, st.end)),
                // Not hex colours ('#facc15'), which look like ids.
                ids: [...src.matchAll(/['"`]#([A-Za-z][\w-]*)/g), ...src.matchAll(/getElementById\(\s*['"`]([A-Za-z][\w-]*)['"`]/g)]
                    .map(m => m[1]).filter(id => !/^(?:[0-9a-f]{3,4}|[0-9a-f]{6}|[0-9a-f]{8})$/i.test(id)),
                classes: [...src.matchAll(/['"`]\.([A-Za-z][\w-]*)['"`]/g)].map(m => m[1]),
                words: new Set([...src.matchAll(/(?<![\w$])([A-Za-z_$][\w$]*)/g)].map(m => m[1]))});
        });
        // The inline handlers' code is the demo's own: the functions it calls follow it there.
        for (const d of demos) for (const h of d.handlers) {
            stmts.push({index: -1, src: null, declares: [], owner: d, pseudo: true, ids: [], classes: [],
                words: new Set([...h.code.matchAll(/(?<![\w$])([A-Za-z_$][\w$]*)/g)].map(m => m[1]))});
        }
        for (const x of stmts) {
            if (x.pseudo) continue;
            const has = (d, sel) => d.el.matches(sel) || d.el.querySelector(sel);
            // Ids built from a string ('#opt-' + name, `#val-${name}`): match on the fixed prefix.
            const prefixes = [...x.src.matchAll(/['"`]#([A-Za-z][\w-]*?)(?:\$\{|['"`]\s*\+)/g)].map(m => m[1]).filter(p => p.length >= 2);
            const attrSels = [...x.src.matchAll(/['"`](\[[\w-]+(?:[~|^$*]?=[^\]]+)?\])['"`]/g)].map(m => m[1]);
            const safe = (d, sel) => { try { return has(d, sel); } catch { return false; } };
            // Bare strings that are a demo element's id ('pos-tl', used as '#' + id) count too.
            const bare = [...x.src.matchAll(/['"]([A-Za-z][\w-]*)['"]/g)].map(m => m[1])
                .filter(id => demos.some(d => safe(d, `#${CSS.escape(id)}`)));
            x.owner = demos.find(d => x.ids.some(id => has(d, `#${CSS.escape(id)}`)))
                || demos.find(d => bare.some(id => has(d, `#${CSS.escape(id)}`)))
                || demos.find(d => attrSels.some(sel => safe(d, sel)))
                || demos.find(d => prefixes.some(p => safe(d, `[id^="${p}"]`)))
                || demos.find(d => x.classes.some(c => has(d, `.${CSS.escape(c)}`))) || null;
            // A helper registered for bindings goes to the demo whose markup calls it.
            const helper = !x.owner && /registerHelper\(\s*['"]([\w$]+)['"]/.exec(x.src);
            if (helper) x.owner = demos.find(d => d.el.outerHTML.includes(`${helper[1]}(`)) || null;
            // So does a component (its tag) or a custom binding (its data-bind-* attribute).
            const component = !x.owner && /Domma\.component\(\s*['"]([\w-]+)['"]/.exec(x.src);
            if (component) x.owner = demos.find(d => d.el.outerHTML.includes(`<${component[1]}`)) || null;
            const binding = !x.owner && /registerBinding\(\s*['"]([\w-]+)['"]/.exec(x.src);
            const bindAttr = binding && (/attribute:\s*['"]([\w-]+)['"]/.exec(x.src)?.[1] || `data-bind-${binding[1]}`);
            if (binding) x.owner = demos.find(d => d.el.outerHTML.includes(bindAttr)) || null;
            x.direct = !!x.owner;
        }
        for (const x of stmts) {
            const component = !x.owner && !x.pseudo && /Domma\.component\(\s*['"]([\w-]+)['"]/.exec(x.src);
            if (!component) continue;
            const user = stmts.find(y => y !== x && y.owner && !y.pseudo && new RegExp(`['"]${component[1]}['"]`).test(y.src));
            if (user) { x.owner = user.owner; x.direct = true; }
        }
        for (let moved = true; moved;) {
            moved = false;
            for (const x of stmts) {
                if (x.owner) continue;
                // Uses a name a placed statement declared -> same demo.
                // Variables first: a shared function is copied to every demo that calls it, so the
                // element or data a statement uses says more about where it belongs.
                // And an element a statement uses ($toggleBtn = $('#audit-toggle')) before data.
                const declOf = (fn, direct) => stmts.find(y => y.owner && !!y.fn === fn && (!direct || y.direct) && y.declares.some(n => x.words.has(n)));
                const fromDecl = declOf(false, true) || declOf(false) || declOf(true);
                // Declares a name a placed statement uses -> that demo.
                const fromUse = x.declares.length && stmts.find(y => y.owner && x.declares.some(n => y.words.has(n)));
                const o = fromDecl?.owner || fromUse?.owner;
                if (o) { x.owner = o; moved = true; }
            }
        }
        // A declaration other demos use too is copied into each of them (and whatever it needs in
        // turn), so every demo stands on its own: helpers and data the old page shared.
        const real = stmts.filter(y => !y.pseudo).sort((a, b) => a.index - b.index);
        // Only what is safe to run twice: functions, and data that touches no element of a demo.
        // (An id no demo has - a link's '#team-callum' - is not an element.)
        const inDemo = (id) => demos.some(d => d.el.matches(`#${CSS.escape(id)}`) || d.el.querySelector(`#${CSS.escape(id)}`));
        const decls = real.filter(y => y.declares.length && (y.fn || (!y.ids.some(inDemo) && !y.classes.length)));
        const copied = new Set();
        for (const d of demos) {
            const mine = new Set(real.filter(y => y.owner === d));
            const words = () => new Set([...mine].flatMap(y => [...y.words]).concat(d.handlers.flatMap(h => [...h.code.matchAll(/(?<![\w$])([A-Za-z_$][\w$]*)/g)].map(m => m[1]))));
            for (let grew = true; grew;) {
                grew = false;
                const w = words();
                for (const y of decls) if (!mine.has(y) && y.declares.some(n => w.has(n))) { mine.add(y); grew = true; }
            }
            for (const y of real) if (mine.has(y) && y.owner !== d) { perDemo.get(d.id).push({index: y.index, src: y.src}); copied.add(y); }
        }
        for (const x of real) {
            if (x.owner) perDemo.get(x.owner.id).push({index: x.index, src: x.src});
            else if (!copied.has(x)) report.unplaced.push(x.src.trim().split('\n').find(l => l.trim() && !l.trim().startsWith('//'))?.trim().slice(0, 100) || '');
        }
    }

    // ---- write -------------------------------------------------------------
    const pageFile = path.join(PAGES_OUT, `${page}.md`);
    const front = ['---', `title: ${title}`, `description: ${JSON.stringify(description)}`, 'layout: with-sidebar', 'status: published', 'sortOrder: 50', '---', ''];
    const hero = `[hero title="${title.replace(/"/g, '\'')}" tagline="${tagline.replace(/"/g, '\'')}" align="center"][/hero]\n`;
    const markdown = front.join('\n') + '\n' + hero + '\n' + md.join('\n\n').replace(/\n{3,}/g, '\n\n') + '\n';
    const writes = [];
    const keepPage = HAND.has(`pages/showcase/${page}.md`) || (!FORCE && fs.existsSync(pageFile));
    if (!keepPage && !RESTORE_LAYOUTS) writes.push([pageFile, markdown]); else report.skipped.push(path.relative(ROOT, pageFile));
    for (const d of demos) {
        const dir = path.join(DEMOS_OUT, page, d.slug);
        if (RESTORE_LAYOUTS) {
            const demoFile = path.join(dir, 'demo.html');
            if (HAND.has(d.id) || d.parts || !hasFrame(d.el) || !fs.existsSync(demoFile)) continue;
            const current = fs.readFileSync(demoFile, 'utf8');
            const fragment = new JSDOM(current).window.document.body;
            // An existing frame (including a hand-written responsive grid) wins.
            if (fragment.children.length === 1 && hasFrame(fragment.firstElementChild)) continue;
            const wrapper = d.el.cloneNode(false);
            wrapper.innerHTML = '\n' + current.trim() + '\n';
            writes.push([demoFile, reindent(normaliseLayoutClasses(wrapper.outerHTML)) + '\n']);
            continue;
        }
        if (HAND.has(`showcase/${page}/${d.slug}`) || (!FORCE && fs.existsSync(dir))) { report.skipped.push(path.relative(ROOT, dir)); continue; }
        // When the script targets the demo element itself (an empty <div id="form-x"> a form is
        // rendered into), the element is part of the demo, not just what is inside it.
        const self = (el) => touchedIds.has(el.id) || (!DEMO_CLASS.test(el.className || '') && [...el.classList].some(c => touchedClasses.has(c)));
        const html = (d.parts || [d.el]).map(el => (self(el) || hasFrame(el) ? el.outerHTML : el.innerHTML).replace(/^\n+|\s+$/g, '')).join('\n');
        writes.push([path.join(dir, 'demo.html'), reindent(upgradeHtml(html)) + '\n']);
        const js = perDemo.get(d.id).sort((a, b) => a.index - b.index).map(x => x.src);
        if (d.handlers.length) {
            js.push('\n// Handlers the old page had inline (onclick=…), wired here.');
            for (const h of d.handlers) {
                const code = h.code.replace(/^return\s+false;?$/, 'event.preventDefault();').replace(/;?\s*return\s+false;?$/, '; event.preventDefault();');
                js.push(`$(root).find('[data-action="${h.n}"]').on('${h.event}', function (event) {\n    ${code}${/[;}]$/.test(code) ? '' : ';'}\n});`);
            }
        }
        if (js.length) {
            const body = upgrade(dedent(js.join('\n')));
            for (const [re, why] of NEEDS_HAND) if (re.test(body)) report.upgrade.push(`${d.slug}: ${why}`);
            writes.push([path.join(dir, 'demo.js'), `/**\n * ${d.title} - from public/showcase/${page}.\n */\nexport function mount(root) {\n${indent(body, '    ')}\n}\n`]);
        }
    }
    // Relative pictures ('img/amara.svg') are copied into the plugin and addressed from the
    // site root; placeholder-service pictures (blocked by the site's CSP, and a third party
    // besides) become a small inline SVG of the same size, colours and text.
    const pageDir = path.dirname(file);
    for (const w of writes) {
        if (!/\.(html|js)$/.test(w[0])) continue;
        w[1] = w[1].replace(/(["'`(])((?:\.\.\/)*(?:img|images|assets)\/[\w./-]+\.(?:svg|png|jpe?g|gif|webp))/g, (m, q, rel) => {
            const src = path.resolve(pageDir, rel);
            if (!src.startsWith(OLD) || !fs.existsSync(src)) return m;
            const out = path.relative(OLD, src);
            if (!DRY) { fs.mkdirSync(path.dirname(path.join(ASSETS_OUT, out)), {recursive: true}); fs.copyFileSync(src, path.join(ASSETS_OUT, out)); }
            return `${q}${ASSETS_URL}/${out}`;
        }).replace(/https?:\/\/via\.placeholder\.com\/(\d+)(?:x(\d+))?(?:\/([0-9a-f]{3,6}))?(?:\/([0-9a-f]{3,6}))?(?:\?text=([\w%+-]*))?/gi, (m, w, h, bg, fg, text) => {
            h = h || w;
            const label = decodeURIComponent((text || '').replace(/\+/g, ' ')).replace(/[<&>]/g, '');
            const size = Math.round(Math.min(h * 0.4, (w / Math.max(label.length, 1)) * 1.6));
            const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}"><rect width="100%" height="100%" fill="#${bg || 'cccccc'}"/>`
                + `<text x="50%" y="50%" dominant-baseline="central" text-anchor="middle" font-family="sans-serif" font-size="${size}" fill="#${fg || '333333'}">${label}</text></svg>\n`;
            const name = `placeholders/${w}x${h}-${bg || 'cccccc'}-${fg || '333333'}${label ? '-' + label.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') : ''}.svg`;
            if (!DRY) { fs.mkdirSync(path.join(ASSETS_OUT, 'placeholders'), {recursive: true}); fs.writeFileSync(path.join(ASSETS_OUT, name), svg); }
            return `${ASSETS_URL}/${name}`;
        });
    }
    report.demos = demos.length;
    if (!DRY) for (const [f, content] of writes) { fs.mkdirSync(path.dirname(f), {recursive: true}); fs.writeFileSync(f, content); }
    return report;
}

/**
 * The automatic part of the upgrade: the short alias, a toast instead of alert(),
 * and selectors found inside the demo rather than the whole page.
 */
function normaliseLayoutClasses(text) {
    return text
        .replace(/\b(sm|md|lg|xl):grid-cols-(\d+)\b/g, 'grid-cols-$1-$2')
        .replace(/\bcol-lg-(\d+)\s+col-md-\d+\b/g, 'col-$1')
        .replace(/\bcol-(?:sm|md|lg|xl)-(\d+)\b/g, 'col-$1');
}

function upgrade(js) {
    return normaliseLayoutClasses(js)
        // A page global the old inline handlers called becomes a function of the demo's own.
        .replace(/^(\s*)window\.(\w+)\s*=\s*(async\s+)?function\s*\(/gm, '$1$3function $2(')
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
    return normaliseLayoutClasses(html)
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
