/**
 * Contrast-pair validator
 *
 * Resolves every rule's text colour against the background it will actually sit
 * on, once per theme, and fails on any pair that drops below WCAG AA.
 *
 * Why this exists, when validate-theme-contrast.js already runs: that check is
 * structural. It looks for a FIXED background inheriting a THEMED text colour,
 * which is one way to go wrong. It cannot see the other way, where both sides
 * are themed and the two simply resolve to the same value.
 *
 * That is not hypothetical. v0.41.0 fixed four rules of exactly that shape, and
 * this check would have caught all four the day they were written:
 *
 *   · `.navbar-dark` painted the bar `--dm-background` and its brand
 *     `--dm-text-inverse`. Both are the theme's darkest slate in every dark
 *     theme, so the brand rendered at 1.00 - the same colour as the bar.
 *   · `.card-primary .card-body` took `--dm-primary-text`, the foreground for
 *     text on a primary FILL, while sitting on the card surface. 1.19.
 *   · `.navbar-link.active` took `--dm-primary`, a mid-tone in the silver,
 *     charcoal and lemon families. 1.72.
 *   · `.navbar-dark .navbar-dropdown-item` took a fixed grey on a `--dm-surface`
 *     panel. 2.56, and 1.00 on hover.
 *
 * Every one of them names two theme-aware variables and reads as correct.
 *
 * The hard part is knowing which background a rule's text lands on, since CSS
 * says nothing about the DOM. `backgroundFor()` below documents the heuristic
 * and its limits; anything it cannot establish with confidence is skipped
 * rather than guessed at, so a miss is silence and never a wrong accusation.
 *
 * Usage:
 *   node scripts/validate-contrast-pairs.js
 *   node scripts/validate-contrast-pairs.js --strict
 *   node scripts/validate-contrast-pairs.js --update-baseline
 *   npm run validate:contrast
 *
 * Exits 1 on any new finding, so it can gate a build.
 */

import {existsSync, readFileSync, writeFileSync} from 'fs';
import {join} from 'path';

const ROOT = process.cwd();
const BASELINE = join(ROOT, 'scripts/validate-contrast-pairs.baseline.json');

/** Built output only - source and dist together would double-count every variable. */
const VAR_SOURCES = ['public/dist/domma.css', 'public/dist/elements.css'];
const THEME_SOURCE = 'public/dist/themes/domma-themes.css';
const RULE_SOURCES = ['public/dist/elements.css', 'public/dist/domma.css'];

/** WCAG AA for body text. Large text is 3.0, but we cannot tell them apart here. */
const AA = 4.5;

// ---------------------------------------------------------------------------
// Colour resolution
// ---------------------------------------------------------------------------

const NAMED = {
    transparent: [0, 0, 0, 0],
    white: [255, 255, 255, 1],
    black: [0, 0, 0, 1],
    red: [255, 0, 0, 1],
    inherit: null,
    currentcolor: null,
    unset: null,
    initial: null
};

function parseHex(h) {
    h = h.slice(1);
    if (h.length === 3) h = [...h].map(c => c + c).join('');
    if (h.length === 4) h = [...h].map(c => c + c).join('');
    if (h.length === 6) return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16), 1];
    if (h.length === 8) return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16), parseInt(h.slice(6, 8), 16) / 255];
    return null;
}

/** Split on top-level commas, so nested `var(a, b)` survives intact. */
function splitArgs(s) {
    const out = [];
    let depth = 0, buf = '';
    for (const ch of s) {
        if (ch === '(') depth++;
        if (ch === ')') depth--;
        if (ch === ',' && depth === 0) {
            out.push(buf.trim());
            buf = '';
            continue;
        }
        buf += ch;
    }
    if (buf.trim()) out.push(buf.trim());
    return out;
}

function fnArgs(expr, name) {
    const open = expr.toLowerCase().indexOf(name + '(');
    if (open === -1) return null;
    let depth = 0, i = open + name.length;
    for (; i < expr.length; i++) {
        if (expr[i] === '(') depth++;
        else if (expr[i] === ')') {
            depth--;
            if (!depth) break;
        }
    }
    return expr.slice(open + name.length + 1, i);
}

/**
 * Resolve a CSS colour expression to [r, g, b, a], or null when it cannot be
 * resolved - an undefined variable with no fallback, `currentColor`, a gradient.
 * Null means "say nothing", never "assume something".
 */
function resolve(expr, vars, depth = 0) {
    if (expr == null || depth > 12) return null;
    expr = String(expr).trim().replace(/\s*!important$/, '');
    if (!expr) return null;

    const lower = expr.toLowerCase();
    if (lower in NAMED) return NAMED[lower];

    if (expr.startsWith('#')) return parseHex(expr);

    if (/^var\(/i.test(expr)) {
        const args = splitArgs(fnArgs(expr, 'var') ?? '');
        const name = args[0];
        if (name && vars.has(name)) return resolve(vars.get(name), vars, depth + 1);
        return args.length > 1 ? resolve(args.slice(1).join(','), vars, depth + 1) : null;
    }

    if (/^rgba?\(/i.test(expr)) {
        const raw = fnArgs(expr, /^rgba\(/i.test(expr) ? 'rgba' : 'rgb') ?? '';
        const parts = raw.split(/[,\s/]+/).filter(Boolean).map(parseFloat);
        if (parts.length < 3 || parts.some(Number.isNaN)) return null;
        return [parts[0], parts[1], parts[2], parts.length > 3 ? parts[3] : 1];
    }

    // color-mix(in srgb, A p%, B q%) - the only mix form this codebase uses.
    if (/^color-mix\(/i.test(expr)) {
        const args = splitArgs(fnArgs(expr, 'color-mix') ?? '');
        if (args.length < 3) return null;
        const read = a => {
            const m = a.match(/(.*?)\s+(-?[\d.]+)%\s*$/);
            return m ? {colour: m[1].trim(), pct: parseFloat(m[2])} : {colour: a.trim(), pct: null};
        };
        const A = read(args[1]), B = read(args[2]);
        const ca = resolve(A.colour, vars, depth + 1);
        const cb = resolve(B.colour, vars, depth + 1);
        if (!ca || !cb) return null;
        let pa = A.pct, pb = B.pct;
        if (pa == null && pb == null) pa = pb = 50;
        else if (pa == null) pa = 100 - pb;
        else if (pb == null) pb = 100 - pa;
        const total = pa + pb;
        if (!total) return null;
        const wa = pa / total, wb = pb / total;
        // Premultiplied, which is what the spec does and what makes mixing with
        // `transparent` produce a translucent colour rather than a dark one.
        const a = ca[3] * wa + cb[3] * wb;
        if (!a) return [0, 0, 0, 0];
        return [
            (ca[0] * ca[3] * wa + cb[0] * cb[3] * wb) / a,
            (ca[1] * ca[3] * wa + cb[1] * cb[3] * wb) / a,
            (ca[2] * ca[3] * wa + cb[2] * cb[3] * wb) / a,
            a
        ];
    }

    return null;
}

const over = (fg, bg) => [0, 1, 2].map(i => fg[i] * fg[3] + bg[i] * (1 - fg[3]));

function luminance([r, g, b]) {
    const f = [r, g, b].map(v => {
        v /= 255;
        return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * f[0] + 0.7152 * f[1] + 0.0722 * f[2];
}

function contrast(fg, bg) {
    const l1 = luminance(fg), l2 = luminance(bg);
    return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
}

// ---------------------------------------------------------------------------
// Parsing
// ---------------------------------------------------------------------------

function* rules(css) {
    for (const match of css.matchAll(/([^{}]+)\{([^{}]*)\}/g)) {
        const selector = match[1].trim().split('\n').pop().trim();
        yield {selector, body: match[2], index: match.index};
    }
}

const lineOf = (css, i) => css.slice(0, i).split('\n').length;

function declaration(body, prop) {
    // Anchored so `--dm-background:` never matches the `background` property,
    // and so `background-color` is not read as `background`.
    const re = new RegExp(`(?:^|[;{\\s])${prop}\\s*:\\s*([^;}]+)`, 'i');
    const m = body.match(re);
    return m ? m[1].trim() : null;
}

/** `:root` and any non-theme block, as the base beneath every theme. */
function baseVars() {
    const vars = new Map();
    for (const rel of VAR_SOURCES) {
        const abs = join(ROOT, rel);
        if (!existsSync(abs)) continue;
        const css = readFileSync(abs, 'utf8');
        for (const {selector, body} of rules(css)) {
            if (/\.dm-theme-/.test(selector)) continue;
            for (const m of body.matchAll(/(--dm-[\w-]+)\s*:\s*([^;}]+)/g)) {
                vars.set(m[1], m[2].trim());
            }
        }
    }
    return vars;
}

/** One variable map per `.dm-theme-*` block, layered over the base. */
function themeVars(base) {
    const abs = join(ROOT, THEME_SOURCE);
    if (!existsSync(abs)) return new Map();
    const css = readFileSync(abs, 'utf8');
    const themes = new Map();
    for (const {selector, body} of rules(css)) {
        const m = selector.match(/^\.dm-theme-([\w-]+)$/);
        if (!m) continue;
        const vars = new Map(base);
        for (const d of body.matchAll(/(--dm-[\w-]+)\s*:\s*([^;}]+)/g)) {
            vars.set(d[1], d[2].trim());
        }
        themes.set(m[1], vars);
    }
    return themes;
}

const classesIn = sel => [...sel.matchAll(/\.([\w-]+)/g)].map(m => m[1]);

/**
 * State and modifier classes, which say nothing about which component an element
 * belongs to. `.list-group-item.active` is a list-group item; treating `active`
 * as the target name matches it against every other `.active` in the stylesheet.
 */
const STATE = /^(active|open|show|shown|hidden|disabled|selected|checked|current|collapsed|expanded|loading|error|success|is-[\w-]+|has-[\w-]+)$/;

/** The class in a selector that names the component, ignoring state modifiers. */
function componentClass(selector) {
    const named = classesIn(selector).filter(c => !STATE.test(c));
    return named.length ? named[named.length - 1] : null;
}

/**
 * A rule scoped to `[data-mode="dark"]` only ever applies in dark mode, so
 * scoring it against light themes invents a situation that cannot occur. Theme
 * names carry their mode as a suffix; the admin-* set does not, so those are
 * excluded from mode-scoped rules rather than assumed either way.
 */
function themeApplies(selector, themeName) {
    const mode = selector.match(/\[data-mode=["']?(light|dark)["']?\]/);
    if (!mode) return true;
    return themeName.endsWith('-' + mode[1]);
}

/** How many leading dash-separated segments two class names share. */
function sharedPrefix(a, b) {
    const x = a.split('-'), y = b.split('-');
    let n = 0;
    while (n < x.length && n < y.length && x[n] === y[n]) n++;
    return n;
}

/**
 * Which background does this rule's text land on?
 *
 * CSS carries no DOM, so this is a heuristic, and it is deliberately a narrow
 * one. In order:
 *
 *   1. The rule's own background. Certain, so it wins outright.
 *   2. A single-class rule that sets a background, scored by how likely it is
 *      to be the element's actual surface: a class named in this very selector
 *      outranks anything else, and among those, the one sharing the longest
 *      name prefix with the target wins. That last part is what keeps
 *      `.navbar-dark .navbar-dropdown-item` measured against
 *      `.navbar-dropdown-menu` (shares `navbar-dropdown`) rather than against
 *      `.navbar-dark` (shares only `navbar`) - the panel it sits in, not the
 *      bar it hangs from.
 *
 * Anything else returns null and the rule is skipped. The naming convention is
 * what makes this work, so it holds for `navbar-*`, `card-*`, `btn-*` and the
 * rest of the component families, and gives up quietly outside them.
 */
function backgroundFor(selector, body, bgIndex) {
    const targetClass = componentClass(selector);
    if (!targetClass) return null;

    const inSelector = new Set(classesIn(selector));
    let container = null, bestScore = -1;
    for (const [cls, expr] of bgIndex) {
        if (cls === targetClass) continue;
        const score = (inSelector.has(cls) ? 1000 : 0) + sharedPrefix(cls, targetClass) * 10;
        if (score <= 0) continue;                 // unrelated by name and absent here
        if (score > bestScore) {
            bestScore = score;
            container = {expr, from: '.' + cls};
        }
    }

    const own = declaration(body, 'background-color') || declaration(body, 'background');
    if (own && !/gradient|url\(|none/i.test(own)) {
        // Own background first, container beneath it. The order matters: a hover
        // state is very often a translucent wash, and reading it as opaque turns
        // `rgba(255,255,255,.3)` into pure white - a 30% veil scored as though it
        // were the surface. Layering is what makes the alpha mean anything.
        return {layers: [own, container?.expr].filter(Boolean), from: container ? `itself over ${container.from}` : 'itself'};
    }
    return container ? {layers: [container.expr], from: container.from} : null;
}

/**
 * Flatten a layer stack to one opaque colour, bottom layer last. Returns null if
 * the stack never reaches opacity, since we would be inventing the page beneath.
 */
function flatten(layers, vars) {
    const resolved = layers.map(l => resolve(l, vars));
    if (resolved.some(r => !r)) return null;
    let acc = null;
    for (let i = resolved.length - 1; i >= 0; i--) {
        const layer = resolved[i];
        if (acc === null) {
            if (layer[3] < 1) continue;           // still translucent, keep descending
            acc = layer.slice(0, 3);
            continue;
        }
        acc = over(layer, acc);
    }
    return acc;
}

/** Single-class rules that paint a solid background, for the lookup above. */
function backgroundIndex(files) {
    const index = new Map();
    for (const {css} of files) {
        for (const {selector, body} of rules(css)) {
            const m = selector.match(/^\.([\w-]+)$/);
            if (!m) continue;
            const bg = declaration(body, 'background-color') || declaration(body, 'background');
            if (!bg || /gradient|url\(|none/i.test(bg)) continue;
            index.set(m[1], bg);
        }
    }
    return index;
}

// ---------------------------------------------------------------------------

function main() {
    const argv = process.argv.slice(2);
    const strict = argv.includes('--strict');
    const update = argv.includes('--update-baseline');

    const base = baseVars();
    const themes = themeVars(base);
    if (!themes.size) {
        console.error('✗ no theme blocks found - run `npm run build:css` first');
        return 1;
    }

    const files = RULE_SOURCES
        .map(rel => ({rel, abs: join(ROOT, rel)}))
        .filter(f => existsSync(f.abs))
        .map(f => ({...f, css: readFileSync(f.abs, 'utf8')}));

    const bgIndex = backgroundIndex(files);
    const findings = [];

    for (const {rel, css} of files) {
        for (const {selector, body, index} of rules(css)) {
            if (/^(:root|@|\.dm-theme-)/.test(selector)) continue;

            const colourExpr = declaration(body, 'color');
            if (!colourExpr) continue;

            const bg = backgroundFor(selector, body, bgIndex);
            if (!bg) continue;

            let worst = Infinity, worstTheme = null;
            let measured = 0;
            for (const [name, vars] of themes) {
                if (!themeApplies(selector, name)) continue;
                const fg = resolve(colourExpr, vars);
                const solid = flatten(bg.layers, vars);
                if (!fg || !solid) continue;      // unresolvable, or never reaches opacity
                measured++;
                const ratio = contrast(over(fg, solid), solid);
                if (ratio < worst) {
                    worst = ratio;
                    worstTheme = name;
                }
            }

            // A pair we could not resolve in a single theme tells us nothing.
            if (!measured || worst >= AA) continue;

            findings.push({
                file: rel,
                line: lineOf(css, index),
                selector,
                colour: colourExpr,
                background: bg.layers.join("  over  "),
                surface: bg.from,
                ratio: worst,
                theme: worstTheme
            });
        }
    }

    const key = f => `${f.file}  ${f.selector}  ${f.colour}`;
    const current = findings.map(key).sort();

    if (update) {
        writeFileSync(BASELINE, JSON.stringify(current, null, 2) + '\n');
        console.log(`baseline updated - ${current.length} known finding(s)`);
        return 0;
    }

    if (!findings.length) {
        console.log(`✓ no contrast-pair failures - ${themes.size} themes x ${files.length} stylesheet(s)`);
        return 0;
    }

    let report = findings;
    if (!strict && existsSync(BASELINE)) {
        const known = new Set(JSON.parse(readFileSync(BASELINE, 'utf8')));
        const fresh = findings.filter(f => !known.has(key(f)));
        if (!fresh.length) {
            const fixed = [...known].filter(k => !current.includes(k)).length;
            console.log(`✓ no new contrast-pair failures - ${findings.length} known` +
                (fixed ? ` (${fixed} now resolved; run --update-baseline)` : ''));
            return 0;
        }
        report = fresh;
    }

    console.error(`✗ ${report.length} rule(s) put text on a background it cannot be read against:\n`);
    for (const f of report.sort((a, b) => a.ratio - b.ratio)) {
        console.error(`  ${f.file}:${f.line}  ${f.selector}`);
        console.error(`      color:      ${f.colour}`);
        console.error(`      background: ${f.background}   (from ${f.surface})`);
        console.error(`      ${f.ratio.toFixed(2)} on .dm-theme-${f.theme}, against ${AA} for AA\n`);
    }
    console.error('  Both sides may well be theme-aware. That is not enough on its own:');
    console.error('  --dm-text-inverse and --dm-background are the same colour in a dark');
    console.error('  theme, and --dm-primary-text only reads on a --dm-primary fill.\n');
    return 1;
}

process.exit(main());
