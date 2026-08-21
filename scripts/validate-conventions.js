/**
 * Domma-conventions validator
 *
 * Finds vanilla JavaScript in pages that should be using Domma.
 *
 * Why this exists: Domma's whole claim is that you do not need these. A
 * showcase that reaches for `document.getElementById` while demonstrating a
 * framework built to replace it teaches the opposite of what it says, and
 * nothing catches it - the page works, so no test fails and no reviewer
 * notices. The survey behind this found 182 such call sites across 42 of the
 * 85 showcase pages.
 *
 *   document.querySelector(…)   →  $(…)
 *   el.addEventListener(…)      →  .on(…)
 *   new Date()                  →  D()
 *   fetch(…)                    →  H.get(…) / H.post(…)
 *   localStorage.…              →  S.get() / S.set()
 *
 * ── What is NOT counted ──────────────────────────────────────────────────────
 *
 * Anything inside `<pre>`, `<code>` or `<textarea>`. Those are displayed source,
 * and a showcase page legitimately prints vanilla JavaScript to contrast it with
 * the Domma form - the utils and DOM showcases both do. Counting them would
 * make the honest teaching material look like the violation.
 *
 * ── Three of these are NOT straight swaps ────────────────────────────────────
 *
 * The tool reports them all the same way, but two of them change behaviour and
 * one changes a type, so a mechanical rewrite is wrong:
 *
 *   · `localStorage` → `S`   S.set() namespaces keys with a `domma:` prefix, so
 *                            a swap writes to a DIFFERENT key. Existing saved
 *                            state is orphaned, not migrated.
 *   · `fetch` → `H`          H.get() resolves to parsed JSON; fetch() resolves
 *                            to a Response. Callers doing `.then(r => r.json())`
 *                            break.
 *   · `new Date()` → `D()`   D() returns a Domma wrapper, not a native Date.
 *                            Anything passing it on to something expecting a
 *                            Date breaks.
 *
 * `document.querySelector` is not a straight swap either: `$()` returns a
 * collection, not an element, so the downstream `.textContent`, `.classList`
 * and `.style` have to become `.text()`, `.addClass()` and `.css()`. Usually
 * that is a simplification - a `forEach` loop collapses into one collection
 * call - but it is a rewrite, not a substitution.
 *
 * ── Ratchet ─────────────────────────────────────────────────────────────────
 *
 * `validate-conventions.baseline.json` records the count per file; the check
 * fails only when a file gets worse or a new offender appears.
 *
 * Usage:
 *   node scripts/validate-conventions.js                    # ratchet
 *   node scripts/validate-conventions.js --strict           # every finding
 *   node scripts/validate-conventions.js --update-baseline  # accept current
 *   node scripts/validate-conventions.js --list public/showcase/themes/index.html
 *   npm run validate:conventions
 */

import {readFileSync, readdirSync, statSync, writeFileSync, existsSync} from 'fs';
import {join, relative, extname} from 'path';

const ROOT = process.cwd();
const BASELINE = join(ROOT, 'scripts/validate-conventions.baseline.json');

/** Scanned when no target is given. */
const DEFAULT_TARGETS = ['public/showcase'];

const SKIP_DIRS = new Set(['node_modules', '.git', 'dist', 'kickstart-files', 'coverage']);

/** Displayed source. Its contents are teaching material, not code that runs. */
const SAMPLE = /<pre[\s\S]*?<\/pre>|<code[\s\S]*?<\/code>|<textarea[\s\S]*?<\/textarea>/gi;

const RULES = [
    ['querySelector',
     /\bdocument\.(?:querySelectorAll|querySelector|getElementById|getElementsByClassName|getElementsByTagName)\b/g,
     '$(…)'],
    // NOT `window.addEventListener`: `$(window)` is an EMPTY collection - window
    // is not a Node, and the constructor has no special case for it - so `.on()`
    // would attach nothing and fail silently. Flagging it would be instructing
    // people to break their page. `$(document)` does work, so document listeners
    // are still counted.
    ['addEventListener', /(?<!\bwindow)\.addEventListener\s*\(/g, '.on(…)'],
    ['new Date()',       /\bnew Date\s*\(/g,          'D()'],
    ['fetch()',          /(?<![.\w])fetch\s*\(/g,     'H.get(…)'],
    ['localStorage',     /\blocalStorage\.\w+/g,      'S.get() / S.set()']
];

function walk(dir, out = []) {
    let entries;
    try {
        entries = readdirSync(dir);
    } catch {
        return out;
    }
    for (const entry of entries.sort()) {
        if (SKIP_DIRS.has(entry)) continue;
        const path = join(dir, entry);
        if (statSync(path).isDirectory()) walk(path, out);
        else if (['.html', '.js'].includes(extname(path))) out.push(path);
    }
    return out;
}

/**
 * Blank out sample containers, preserving offsets so reported line numbers
 * still point at the real line.
 */
function stripSamples(source) {
    return source.replace(SAMPLE, (m) => m.replace(/[^\n]/g, ' '));
}

/** Findings in one file, as {rule, line, text}. */
function scan(source) {
    const live = stripSamples(source);
    const found = [];

    for (const [rule, pattern, instead] of RULES) {
        for (const match of live.matchAll(pattern)) {
            const line = live.slice(0, match.index).split('\n').length;
            found.push({
                rule,
                instead,
                line,
                text: source.split('\n')[line - 1].trim().slice(0, 100)
            });
        }
    }

    return found.sort((a, b) => a.line - b.line);
}

function main() {
    const argv = process.argv.slice(2);
    const strict = argv.includes('--strict');
    const update = argv.includes('--update-baseline');
    const list = argv.includes('--list');
    const targets = argv.filter(a => !a.startsWith('--'));
    const roots = targets.length ? targets : DEFAULT_TARGETS;

    const files = roots.flatMap(r => (statSync(join(ROOT, r)).isDirectory()
        ? walk(join(ROOT, r))
        : [join(ROOT, r)]));

    const perFile = new Map();
    const byRule = new Map(RULES.map(([name]) => [name, 0]));
    let total = 0;

    for (const file of files) {
        const found = scan(readFileSync(file, 'utf8'));
        if (!found.length) continue;
        perFile.set(relative(ROOT, file), found);
        total += found.length;
        for (const f of found) byRule.set(f.rule, byRule.get(f.rule) + 1);
    }

    // --list prints every site, so a sweep has a work list rather than a number.
    if (list) {
        for (const [file, found] of perFile) {
            console.log(`\n${file}  (${found.length})`);
            for (const f of found) {
                console.log(`  ${String(f.line).padStart(5)}  ${f.rule.padEnd(17)} → ${f.instead}`);
                console.log(`         ${f.text}`);
            }
        }
        console.log(`\n${total} site(s) across ${perFile.size} file(s)`);
        return 0;
    }

    const current = Object.fromEntries([...perFile].map(([f, v]) => [f, v.length]));

    if (update) {
        writeFileSync(BASELINE, JSON.stringify(current, null, 2) + '\n');
        console.log(`baseline updated - ${total} site(s) across ${perFile.size} file(s)`);
        return 0;
    }

    if (!total) {
        console.log(`✓ no vanilla-JS call sites - ${files.length} file(s) checked`);
        return 0;
    }

    const summary = [...byRule].filter(([, n]) => n).map(([k, n]) => `${k} ${n}`).join(', ');

    if (!strict && existsSync(BASELINE)) {
        const baseline = JSON.parse(readFileSync(BASELINE, 'utf8'));
        const worse = [...perFile].filter(([f, v]) => v.length > (baseline[f] ?? 0));

        if (!worse.length) {
            const before = Object.values(baseline).reduce((a, b) => a + b, 0);
            const gained = before - total;
            console.log(`✓ no new vanilla JS - ${total} known (${summary})` +
                (gained > 0 ? `, ${gained} fewer than the baseline; run --update-baseline` : ''));
            return 0;
        }

        console.error(`✗ ${worse.length} file(s) gained vanilla-JS call sites:\n`);
        for (const [file, found] of worse) {
            console.error(`  ${file}  (${baseline[file] ?? 0} → ${found.length})`);
            for (const f of found.slice(0, 6)) {
                console.error(`      ${f.line}: ${f.rule} → use ${f.instead}`);
            }
            console.error('');
        }
        console.error('Domma exists so these are unnecessary. See the conversion notes at the');
        console.error('top of this file - localStorage, fetch and Date are NOT straight swaps.');
        return 1;
    }

    console.error(`✗ ${total} vanilla-JS call site(s) in ${perFile.size} file(s): ${summary}\n`);
    for (const [file, found] of perFile) {
        console.error(`  ${file}  (${found.length})`);
    }
    console.error('\nRun with --list to see every site.');
    return 1;
}

process.exit(main());
