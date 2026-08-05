/**
 * Theme-contrast validator
 *
 * Finds CSS rules that paint a background from a variable no theme redefines,
 * without also setting a text colour.
 *
 * Why this exists: Domma's colour variables come in two kinds, and they look
 * identical at the call site.
 *
 *   · Semantic — `--dm-surface`, `--dm-text`, `--dm-border`, `--dm-hover-bg`.
 *     Every theme block redefines these, so they flip with the theme.
 *   · Palette — `--dm-gray-100`, `--dm-slate-200`, `--dm-white`. Defined once.
 *     They are fixed swatches and stay put whatever the theme.
 *
 * A rule that sets `background: var(--dm-gray-100)` and no `color` inherits its
 * text from `--dm-text`, which DOES flip. Under a dark theme that leaves light
 * text on a permanently light background — unreadable, with nothing to see in
 * the markup and no test to fail.
 *
 * Eighteen rules shipped this way, including `.models-method-item`,
 * `.tables-method-item` and `.utils-method-item` — the method chips on three
 * showcases were illegible in dark mode.
 *
 * The fix is either a semantic variable for the background, or an explicit
 * `color` alongside the fixed one.
 *
 * Usage:
 *   node scripts/validate-theme-contrast.js
 *   node scripts/validate-theme-contrast.js src/css public/showcase/css
 *   npm run validate:theme
 *
 * Exits 1 on any finding, so it can gate a build.
 */

import {readFileSync, readdirSync, statSync, writeFileSync, existsSync} from 'fs';
import {join, relative, extname} from 'path';

const ROOT = process.cwd();
const BASELINE = join(ROOT, 'scripts/validate-theme-contrast.baseline.json');

/** Sources scanned when no target is given. Source CSS, not build output. */
const DEFAULT_TARGETS = ['src/css', 'public/showcase/css'];

/**
 * Where variable definitions are read from. A variable counts as theme-aware
 * if it is defined more than once anywhere here — once for light, once for
 * dark, or once per theme block.
 */
const DEFINITION_SOURCES = [
    'public/dist/domma.css',
    'public/dist/elements.css',
    'public/dist/themes/domma-themes.css'
];

const SKIP_DIRS = new Set(['node_modules', '.git', 'dist', 'coverage']);

/**
 * A rule is exempt when its fixed background is deliberate:
 *
 *  · Already theme-scoped — a rule under `.dm-theme-dark` or `[data-mode="dark"]`
 *    is explicitly handling that theme, so a fixed colour is the whole point.
 *  · A named swatch utility — `.bg-white`, `.bg-gray-100`. The class name
 *    declares the colour; making it follow the theme would defeat it.
 */
function isDeliberate(selector, variable) {
    if (/\.dm-theme-[\w-]+\s|\[data-mode=/.test(selector)) return true;
    const swatch = variable.replace(/^--dm-/, '');
    return new RegExp(`\\b(bg|background)-${swatch}\\b`).test(selector);
}

function walk(dir, out = []) {
    let entries;
    try {
        entries = readdirSync(dir);
    } catch {
        return out;
    }
    for (const entry of entries) {
        if (SKIP_DIRS.has(entry)) continue;
        const path = join(dir, entry);
        const stat = statSync(path);
        if (stat.isDirectory()) walk(path, out);
        else if (extname(path) === '.css') out.push(path);
    }
    return out;
}

/** Map every `--dm-*` variable to how many times it is defined. */
function countDefinitions() {
    const counts = new Map();
    // Built output ONLY. Reading source and dist together double-counts every
    // variable — src/css/domma.css and public/dist/domma.css are the same
    // definition — which makes single-definition palette variables look
    // theme-aware and blinds the whole check.
    for (const abs of DEFINITION_SOURCES.map(r => join(ROOT, r))) {
        let css;
        try {
            css = readFileSync(abs, 'utf8');
        } catch {
            continue;   // not built yet; the caller is warned below
        }
        for (const match of css.matchAll(/(--dm-[\w-]+)\s*:/g)) {
            counts.set(match[1], (counts.get(match[1]) || 0) + 1);
        }
    }
    return counts;
}

/** Crude but sufficient rule splitter: selector text plus declaration body. */
function* rules(css) {
    for (const match of css.matchAll(/([^{}]+)\{([^{}]*)\}/g)) {
        const selector = match[1].trim().split('\n').pop().trim();
        yield {selector, body: match[2], index: match.index};
    }
}

function lineOf(css, index) {
    return css.slice(0, index).split('\n').length;
}

function main() {
    const argv = process.argv.slice(2);
    const strict = argv.includes('--strict');
    const update = argv.includes('--update-baseline');
    const targets = argv.filter(a => !a.startsWith('--'));
    const roots = targets.length ? targets : DEFAULT_TARGETS;

    const counts = countDefinitions();
    if (!counts.size) {
        console.error('✗ no variable definitions found — run `npm run build:css` first');
        return 1;
    }

    const files = roots.flatMap(r => walk(join(ROOT, r)));
    const findings = [];

    for (const file of files) {
        const css = readFileSync(file, 'utf8');
        for (const {selector, body, index} of rules(css)) {
            // Must not match a custom property DEFINITION: `--dm-background:`
            // ends in "background" and would otherwise look like the property.
            const bg = body.match(/(?:^|[\s;{])background(?:-color)?\s*:\s*var\((--dm-[\w-]+)\)/);
            if (!bg) continue;

            // A rule that sets its own colour is fine whatever the background.
            if (/(?:^|[\s;])color\s*:/.test(body)) continue;

            const variable = bg[1];
            if (isDeliberate(selector, variable)) continue;

            const defs = counts.get(variable) || 0;
            if (defs > 1) continue;   // theme-aware; flips with --dm-text

            findings.push({
                file: relative(ROOT, file),
                line: lineOf(css, index),
                selector,
                variable,
                defs
            });
        }
    }

    // This is a heuristic: a range track or a switch knob has a background and
    // no text, so a missing `color` is harmless there and indistinguishable
    // statically from a chip whose label goes invisible. Known findings are
    // therefore baselined; the check fails on NEW ones.
    const key = f => `${f.file}  ${f.selector}`;
    const current = findings.map(key).sort();

    if (update) {
        writeFileSync(BASELINE, JSON.stringify(current, null, 2) + '\n');
        console.log(`baseline updated — ${current.length} known finding(s)`);
        return 0;
    }

    if (!findings.length) {
        console.log(`✓ no theme-contrast risks — ${files.length} stylesheet(s) checked`);
        return 0;
    }

    if (!strict && existsSync(BASELINE)) {
        const known = new Set(JSON.parse(readFileSync(BASELINE, 'utf8')));
        const fresh = findings.filter(f => !known.has(key(f)));
        if (!fresh.length) {
            const fixed = [...known].filter(k => !current.includes(k)).length;
            console.log(`✓ no new theme-contrast risks — ${findings.length} known` +
                (fixed ? ` (${fixed} now resolved; run --update-baseline)` : ''));
            return 0;
        }
        findings.length = 0;
        findings.push(...fresh);
    }

    console.error(`✗ ${findings.length} rule(s) paint a fixed background but inherit a themed text colour:\n`);
    for (const f of findings) {
        const how = f.defs === 0 ? 'undefined' : 'defined once, never per theme';
        console.error(`  ${f.file}:${f.line}  ${f.selector}`);
        console.error(`      background: var(${f.variable})   (${how})`);
        console.error('      …with no `color`, so the text follows --dm-text and the background does not.\n');
    }
    console.error('Fix by using a semantic background (--dm-surface, --dm-hover-bg, --dm-active-bg),');
    console.error('or by setting an explicit `color` next to the fixed one.');
    return 1;
}

process.exit(main());
