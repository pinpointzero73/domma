#!/usr/bin/env node
/**
 * Phase 3: the old showcase's demo styles, for the showcase plugin.
 *
 * The old pages were styled by public/showcase/css/domma-showcase.css (shared)
 * and by each page's own <style> blocks. Both styled the old layout as well as
 * the demos; the CMS has its own layout, so only demo rules move: a selector is
 * kept when every class in it is one the demos use (in demo.html, in markup
 * their demo.js writes, or built in a binding - 'models-status-' + status) and
 * at least one is not Domma's own, so nothing here restyles Domma's components.
 *
 * Writes site/plugins/domma-showcase/public/styles/:
 *   shared.css          from the shared sheet
 *   <page>.css          a page's own rules, scoped to that page's demos - the
 *                       old pages defined the same class differently, so they
 *                       must not meet
 * The plugin links shared.css and the page's own file only on pages with demos.
 *
 * Usage: node scripts/site-migrate/demo-styles.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import postcss from 'postcss';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const OLD = path.join(ROOT, 'public', 'showcase');
const DEMOS = path.join(ROOT, 'site', 'plugins', 'domma-showcase', 'public', 'demos');
const OUT = path.join(ROOT, 'site', 'plugins', 'domma-showcase', 'public', 'styles');
const DIST = path.join(ROOT, 'public', 'dist');

const walk = (dir) => (!fs.existsSync(dir) ? [] : fs.readdirSync(dir, {withFileTypes: true})
    .flatMap(e => (e.isDirectory() ? walk(path.join(dir, e.name)) : [path.join(dir, e.name)])));

// Classes the demos use.
const used = new Set();
const prefixes = new Set();
for (const f of walk(DEMOS)) {
    if (!/\.(html|js)$/.test(f)) continue;
    const src = fs.readFileSync(f, 'utf8');
    for (const m of src.matchAll(/class(?:Name)?\s*=\s*["'`]([^"'`]+)["'`]/g)) m[1].split(/\s+/).forEach(c => c && !c.includes('$') && used.add(c));
    for (const m of src.matchAll(/(?:addClass|removeClass|toggleClass|classList\.(?:add|remove|toggle))\(\s*["'`]([^"'`]+)["'`]/g)) m[1].split(/\s+/).forEach(c => used.add(c));
    for (const m of src.matchAll(/['"`]([a-z][\w-]*-)['"`]\s*\+/g)) prefixes.add(m[1]);
}
const isUsed = (c) => used.has(c) || [...prefixes].some(p => c.startsWith(p));
// Every word the demos' code and markup contain - an animation the script sets inline
// (style.animation = 'rocket-launch 1s') keeps its @keyframes.
const demoWords = new Set(walk(DEMOS).filter(f => /\.(html|js)$/.test(f))
    .flatMap(f => fs.readFileSync(f, 'utf8').match(/[\w-]+/g) || []));

// Domma's own classes - never restyled from here.
const domma = new Set();
for (const f of ['domma.css', 'grid.css', 'elements.css']) {
    const p = path.join(DIST, f);
    if (fs.existsSync(p)) for (const m of fs.readFileSync(p, 'utf8').matchAll(/\.([A-Za-z][\w-]*)/g)) domma.add(m[1]);
}
const classesOf = (sel) => [...sel.matchAll(/\.([A-Za-z][\w-]*)/g)].map(m => m[1]);
const keep = (sel) => { const cls = classesOf(sel); return cls.length > 0 && cls.every(isUsed) && cls.some(c => !domma.has(c)); };

/**
 * CSS a page's script injected rather than wrote in a <style> block:
 * `style.textContent = \`…\``, `$('<style>…</style>')` and `$('<style>').text(name)`
 * with `const name = \`…\``.
 */
function injected(html) {
    const scripts = [...html.matchAll(/<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/g)].map(m => m[1]).join('\n');
    const out = [...scripts.matchAll(/textContent\s*=\s*`([^`]*)`/g)].map(m => m[1]);
    out.push(...[...scripts.matchAll(/\$\(\s*'<style>([\s\S]*?)<\/style>'\s*\)/g)].map(m => m[1]));
    for (const [, name] of scripts.matchAll(/\$\(\s*'<style>'\s*\)\s*\.text\(\s*(\w+)\s*\)/g)) {
        const def = new RegExp(`(?:const|let|var)\\s+${name}\\s*=\\s*\`([^\`]*)\``).exec(scripts);
        if (def) out.push(def[1]);
    }
    return out.filter(c => /[{:]/.test(c) && !c.includes('${'));
}

/** Only the demo rules of a stylesheet; `scope` prefixes every selector kept. */
function filter(css, scope = '') {
    const root = postcss.parse(css);
    const animations = new Set();
    let kept = 0;
    root.walkRules(rule => {
        if (rule.parent?.type === 'atrule' && /keyframes/i.test(rule.parent.name)) return;
        const sels = rule.selectors.filter(keep);
        if (!sels.length) { rule.remove(); return; }
        rule.selectors = scope ? sels.map(x => `${scope} ${x}`) : sels;
        kept++;
        rule.walkDecls(/^animation(-name)?$/, d => d.value.split(/[\s,]+/).forEach(v => animations.add(v)));
    });
    root.walkAtRules(/keyframes$/i, at => { if (!animations.has(at.params.trim()) && !demoWords.has(at.params.trim())) at.remove(); });
    root.walkAtRules(at => { if (!/keyframes$/i.test(at.name) && !at.nodes?.length) at.remove(); });
    root.walkComments(c => c.remove());
    return {css: root.toString().replace(/\n{3,}/g, '\n\n').trim(), kept};
}

const HEADER = (from) => `/* Domma Showcase - demo styles from ${from}, by scripts/site-migrate/demo-styles.mjs:
 * only rules for classes the demos use. Do not edit - re-run the script, or move a rule
 * into a demo's own demo.css. */\n`;

fs.rmSync(OUT, {recursive: true, force: true});
fs.mkdirSync(OUT, {recursive: true});
const shared = filter(fs.readFileSync(path.join(OLD, 'css', 'domma-showcase.css'), 'utf8'));
fs.writeFileSync(path.join(OUT, 'shared.css'), HEADER('public/showcase/css/domma-showcase.css') + shared.css + '\n');
let pages = 0;
let kept = shared.kept;
for (const f of walk(OLD).filter(x => x.endsWith('.html') && !x.includes(`${path.sep}css${path.sep}`))) {
    const page = path.relative(OLD, f).replace(/\/index\.html$/, '').replace(/\.html$/, '');
    const html = fs.readFileSync(f, 'utf8');
    const css = [...html.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/g)].map(m => m[1]).concat(injected(html)).join('\n');
    if (!css.trim() || page === 'index') continue;
    let out;
    try { out = filter(css, `.showcase-demo[data-demo^="showcase/${page}/"]`); } catch (err) { console.warn(`${page}: its <style> did not parse (${err.message}) - skipped`); continue; }
    if (!out.kept) continue;
    const file = path.join(OUT, `${page}.css`);
    fs.mkdirSync(path.dirname(file), {recursive: true});
    fs.writeFileSync(file, HEADER(`public/showcase/${page}`) + out.css + '\n');
    pages++;
    kept += out.kept;
}
const size = walk(OUT).reduce((n, f) => n + fs.statSync(f).size, 0);
console.log(`${used.size} classes used by demos; ${kept} rules kept: shared.css (${shared.kept}) + ${pages} page files, ${Math.round(size / 1024)} KB in all`);
