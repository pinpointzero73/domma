/**
 * Dead-class validator
 *
 * Finds `class="…"` tokens in HTML that resolve to no CSS rule anywhere.
 *
 * Why this exists: a class name that Domma does not define is invisible. The
 * markup looks right, nothing throws, no test fails — the element simply
 * renders unstyled. Three separate bugs shipped this way:
 *
 *   · `.form-control` was used on the Reactivity showcase and in the kickstart
 *     templates. Domma's classes are `.form-input` and `.form-select`, so every
 *     input rendered as a raw browser control, ignoring the theme entirely.
 *   · `.col-md-*` was used in 13 files. Domma's grid defines `.col-1`…`.col-12`
 *     with no responsive variant, so those layouts silently collapsed.
 *   · `.table-responsive` was used in 14 places and defined nowhere, so wide
 *     tables overflowed instead of scrolling.
 *
 * The kickstart templates alone carried 143 dead class usages across 14 files —
 * every scaffolded project rendered unstyled on first load.
 *
 * The repository carries a known backlog, so this runs as a RATCHET rather than
 * a clean gate: `validate-classes.baseline.json` records the count per file, and
 * the check fails only when a file gets worse or a new offender appears. Fixing
 * a file and lowering its baseline is always welcome; raising one should be a
 * conscious act.
 *
 * Usage:
 *   node scripts/validate-classes.js                    # ratchet against baseline
 *   node scripts/validate-classes.js --strict           # fail on ANY finding
 *   node scripts/validate-classes.js --update-baseline  # accept current state
 *   node scripts/validate-classes.js public/showcase    # explicit targets
 *   npm run validate:classes
 */

import {readFileSync, readdirSync, statSync, writeFileSync, existsSync} from 'fs';
import {join, relative, extname} from 'path';

const ROOT = process.cwd();
const BASELINE = join(ROOT, 'scripts/validate-classes.baseline.json');

/** Directories scanned when no target is given on the command line. */
const DEFAULT_TARGETS = ['public', 'templates'];

/** Never scanned: build output, dependencies, and generated copies. */
const SKIP_DIRS = new Set([
    'node_modules', '.git', 'dist', 'kickstart-files', 'archive', 'coverage'
]);

/**
 * Class prefixes that are legitimately not CSS.
 * `language-*` is a syntax-highlighter hook, not a style.
 */
const NOT_STYLE = [/^language-/, /^dm-theme-/];

/** Recursively collect files with one of the given extensions. */
function walk(dir, exts, out = []) {
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
        if (stat.isDirectory()) walk(path, exts, out);
        else if (exts.includes(extname(path))) out.push(path);
    }
    return out;
}

/** Every class selector appearing anywhere in a blob of CSS. */
function definedClasses(css) {
    return new Set([...css.matchAll(/\.(-?[_a-zA-Z][\w-]*)/g)].map(m => m[1]));
}

/**
 * Class tokens used by a document, skipping template placeholders — a
 * `{{theme}}` substitution is resolved at scaffold time, not by CSS.
 */
function usedClasses(html) {
    const used = new Set();
    // The attribute must be exactly `class`, not the tail of another one.
    // Without the boundary this also matched `data-bind-class="urgent && 'on'"`
    // and read a binding EXPRESSION as a list of class names, reporting `&&`
    // and `'on'` as undefined classes.
    for (const match of html.matchAll(/(?:^|[\s"'])class="([^"]*)"/g)) {
        // A class attribute built by a JS template literal is computed at
        // runtime — `class="badge ${ok ? 'a' : 'b'}"` — so its tokens cannot be
        // checked statically. Skip the whole attribute rather than tokenising
        // the expression into nonsense.
        if (match[1].includes('${')) continue;
        for (const token of match[1].split(/\s+/)) {
            if (!token || token.includes('{{') || token.includes('}}')) continue;
            used.add(token);
        }
    }
    return used;
}

function main() {
    const argv = process.argv.slice(2);
    const strict = argv.includes('--strict');
    const update = argv.includes('--update-baseline');
    const targets = argv.filter(a => !a.startsWith('--'));
    const roots = targets.length ? targets : DEFAULT_TARGETS;

    // Global stylesheets: the built bundles plus any hand-written CSS that is
    // not a build artefact.
    const globalCss = [
        ...walk(join(ROOT, 'public/dist'), ['.css']),
        ...walk(join(ROOT, 'public/showcase/css'), ['.css']),
        ...roots.flatMap(r => walk(join(ROOT, r), ['.css']))
    ];

    const seen = new Set();
    let globalBlob = '';
    for (const file of globalCss) {
        if (seen.has(file)) continue;
        seen.add(file);
        globalBlob += readFileSync(file, 'utf8');
    }
    const globalDefined = definedClasses(globalBlob);

    const htmlFiles = roots.flatMap(r => walk(join(ROOT, r), ['.html']));
    const failures = [];
    let usages = 0;

    for (const file of htmlFiles) {
        const html = readFileSync(file, 'utf8');

        // A page may define its own classes in an inline <style>, and a
        // component may define them in a Domma.component() `style:` string.
        // Both are real definitions; missing either produces false positives.
        const inline = [...html.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/g)].map(m => m[1]).join('');
        const componentStyles = [...html.matchAll(/style\s*:\s*`([\s\S]*?)`/g)].map(m => m[1]).join('');
        const localDefined = definedClasses(inline + componentStyles);

        const missing = [...usedClasses(html)]
            .filter(c => !globalDefined.has(c) && !localDefined.has(c))
            .filter(c => !NOT_STYLE.some(rx => rx.test(c)))
            .sort();

        usages += missing.length;
        if (missing.length) failures.push([relative(ROOT, file), missing]);
    }

    const current = Object.fromEntries(failures.map(([f, m]) => [f, m.length]));

    if (update) {
        writeFileSync(BASELINE, JSON.stringify(current, null, 2) + '\n');
        console.log(`baseline updated — ${usages} usage(s) across ${failures.length} file(s)`);
        return 0;
    }

    if (!failures.length) {
        console.log(`✓ no dead classes — ${htmlFiles.length} HTML files, ${globalDefined.size} classes defined`);
        return 0;
    }

    if (!strict && existsSync(BASELINE)) {
        const baseline = JSON.parse(readFileSync(BASELINE, 'utf8'));
        const worse = failures.filter(([f, m]) => m.length > (baseline[f] ?? 0));

        if (!worse.length) {
            const fixed = Object.keys(baseline).filter(f => !current[f]).length;
            console.log(`✓ no new dead classes — ${usages} known, unchanged` +
                (fixed ? ` (${fixed} file(s) now clean; run --update-baseline)` : ''));
            return 0;
        }

        console.error(`✗ ${worse.length} file(s) gained undefined class usages:\n`);
        for (const [file, missing] of worse) {
            const was = baseline[file] ?? 0;
            console.error(`  ${file}  (${was} → ${missing.length})`);
            console.error(`      ${missing.join(', ')}\n`);
        }
        console.error('These render as unstyled markup. Domma uses Tailwind-style utilities —');
        console.error('flex, justify-center, items-center, mr-2, form-input, btn-outline —');
        console.error('not their Bootstrap spellings.');
        return 1;
    }

    console.error(`✗ ${usages} undefined class usage(s) in ${failures.length} file(s):\n`);
    for (const [file, missing] of failures) {
        console.error(`  ${file}`);
        console.error(`      ${missing.join(', ')}\n`);
    }
    console.error('These render as unstyled markup. Check the class against Domma\'s CSS:');
    console.error('Domma uses Tailwind-style utilities — flex, justify-center, items-center,');
    console.error('mr-2, form-input, form-select, btn-outline — not their Bootstrap spellings.');
    return 1;
}

process.exit(main());
