#!/usr/bin/env node
/**
 * Phase 3: the old showcase stylesheet's demo rules, for the showcase plugin.
 *
 * public/showcase/css/domma-showcase.css styled both the old pages' layout and
 * their demos. The CMS has its own layout, so only the demo rules move: a
 * selector is kept when every class in it is one the demos use (in demo.html,
 * or in markup their demo.js writes) and at least one of those is not Domma's
 * own - so nothing here can restyle Domma's cards, buttons or grid site-wide.
 * Keyframes come along when a kept rule names them.
 *
 * Writes site/plugins/domma-showcase/public/demos.css, and reports how much of
 * the old sheet that is.
 *
 * Usage: node scripts/site-migrate/demo-styles.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import postcss from 'postcss';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const OLD = path.join(ROOT, 'public', 'showcase', 'css', 'domma-showcase.css');
const DEMOS = path.join(ROOT, 'site', 'plugins', 'domma-showcase', 'public', 'demos');
const OUT = path.join(ROOT, 'site', 'plugins', 'domma-showcase', 'public', 'demos.css');
const DIST = path.join(ROOT, 'public', 'dist');

const walk = (dir) => (!fs.existsSync(dir) ? [] : fs.readdirSync(dir, {withFileTypes: true})
    .flatMap(e => (e.isDirectory() ? walk(path.join(dir, e.name)) : [path.join(dir, e.name)])));

// Classes the demos use: class="…" in their markup and class names in their scripts' strings.
const used = new Set();
for (const f of walk(DEMOS)) {
    if (!/\.(html|js)$/.test(f)) continue;
    const src = fs.readFileSync(f, 'utf8');
    for (const m of src.matchAll(/class(?:Name)?\s*=\s*["'`]([^"'`]+)["'`]/g)) m[1].split(/\s+/).forEach(c => c && !c.includes('$') && used.add(c));
    for (const m of src.matchAll(/(?:addClass|removeClass|toggleClass|classList\.(?:add|remove|toggle))\(\s*["'`]([^"'`]+)["'`]/g)) m[1].split(/\s+/).forEach(c => used.add(c));
}

// Classes built in a binding ('models-status-' + status): any class with that prefix counts.
const prefixes = new Set();
for (const f of walk(DEMOS)) {
    if (!/\.(html|js)$/.test(f)) continue;
    for (const m of fs.readFileSync(f, 'utf8').matchAll(/['"`]([a-z][\w-]*-)['"`]\s*\+/g)) prefixes.add(m[1]);
}
const isUsed = (c) => used.has(c) || [...prefixes].some(p => c.startsWith(p));

// Domma's own classes - never restyled from here.
const domma = new Set();
for (const f of ['domma.css', 'grid.css', 'elements.css']) {
    const p = path.join(DIST, f);
    if (fs.existsSync(p)) for (const m of fs.readFileSync(p, 'utf8').matchAll(/\.([A-Za-z][\w-]*)/g)) domma.add(m[1]);
}

const classesOf = (sel) => [...sel.matchAll(/\.([A-Za-z][\w-]*)/g)].map(m => m[1]);
const keep = (sel) => {
    const cls = classesOf(sel);
    return cls.length > 0 && cls.every(isUsed) && cls.some(c => !domma.has(c));
};

const root = postcss.parse(fs.readFileSync(OLD, 'utf8'));
const animations = new Set();
let kept = 0;
let total = 0;
root.walkRules(rule => {
    if (rule.parent?.type === 'atrule' && /keyframes/i.test(rule.parent.name)) return;
    total++;
    const sels = rule.selectors.filter(keep);
    if (!sels.length) { rule.remove(); return; }
    rule.selectors = sels;
    kept++;
    rule.walkDecls(/^animation(-name)?$/, d => d.value.split(/[\s,]+/).forEach(v => animations.add(v)));
});
root.walkAtRules(/keyframes$/i, at => { if (!animations.has(at.params.trim())) at.remove(); });
root.walkAtRules(at => { if (!/keyframes$/i.test(at.name) && !at.nodes?.length) at.remove(); });
root.walkComments(c => c.remove());

const header = `/* Domma Showcase - demo styles carried over from public/showcase/css/domma-showcase.css
 * by scripts/site-migrate/demo-styles.mjs: only rules for classes the demos use. Do not edit;
 * re-run the script, or move a rule into a demo's own demo.css. */\n`;
fs.writeFileSync(OUT, header + root.toString().replace(/\n{3,}/g, '\n\n').trim() + '\n');
console.log(`${used.size} classes used by demos; kept ${kept} of ${total} rules -> ${path.relative(ROOT, OUT)} (${fs.statSync(OUT).size} bytes)`);
