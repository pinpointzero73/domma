/**
 * Check that what was just built is what the repository says it should be.
 *
 * Every failure below is silent without this. A build succeeds, the files look
 * plausible, and the wrong thing gets served:
 *
 *   * Rollup INLINES exactly-pinned dependencies at build time, reading them
 *     from node_modules. Bump the pin, skip the install, and the build happily
 *     produces a bundle containing the old package while package-lock.json
 *     claims the new one. Nothing errors. This is the one that prompted the
 *     script: v0.37.0 moved domma-reactive 0.4.0 → 0.4.1, and a deploy that
 *     only pulled and built would have shipped 0.4.0 with no sign of it.
 *
 *   * build-info.json carries the version the bundles were built from. If it
 *     disagrees with package.json, the build predates the checkout - usually a
 *     pull that landed after the build rather than before it.
 *
 *   * public/dist/ is gitignored, so on a fresh or cleaned checkout the
 *     bundles simply are not there. A web server serves 404s for them and the
 *     pages look broken in a way the HTML cannot explain.
 *
 * Exits non-zero on the first problem, so it can gate a deploy.
 *
 *   node scripts/verify-build.mjs
 */

import {existsSync, readFileSync, statSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import path from 'node:path';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (file) => JSON.parse(readFileSync(path.join(ROOT, file), 'utf8'));

const problems = [];
const notes = [];

const pkg = read('package.json');

// ── 1. The bundles exist, and are not empty shells ───────────────────────────
//
// Sizes are floors an order of magnitude below the real thing, not targets:
// they catch "absent" and "truncated", and will not need revising every release.
const ARTEFACTS = [
    ['public/dist/domma.min.js', 100_000],
    ['public/dist/domma.esm.js', 100_000],
    ['public/dist/domma.css', 10_000],
    ['public/dist/grid.css', 1_000],
    ['public/dist/elements.css', 10_000]
];

for (const [file, floor] of ARTEFACTS) {
    const full = path.join(ROOT, file);
    if (!existsSync(full)) {
        problems.push(`${file} is missing - the build did not run, or ran into an error`);
        continue;
    }
    const {size} = statSync(full);
    if (size < floor) {
        problems.push(`${file} is only ${size} bytes, expected at least ${floor} - truncated build`);
    }
}

// ── 2. The build matches this checkout ───────────────────────────────────────
const INFO = 'public/dist/build-info.json';
if (!existsSync(path.join(ROOT, INFO))) {
    problems.push(`${INFO} is missing - the build did not complete`);
} else {
    const info = read(INFO);
    if (info.version !== pkg.version) {
        problems.push(
            `${INFO} says ${info.version} but package.json says ${pkg.version} - ` +
            'the bundles were built from a different checkout. Rebuild.'
        );
    } else {
        notes.push(`built from ${info.version}${info.commit ? ` (${info.commit})` : ''}`);
    }
}

// ── 3. Exactly-pinned dependencies are the ones installed ────────────────────
//
// An exact pin - no ^, no ~ - is a deliberate statement that this build needs
// that version and no other. Those are the ones Rollup inlines, so a mismatch
// ends up inside the shipped bundle rather than beside it.
const EXACT = /^\d+\.\d+\.\d+$/;
const declared = {...pkg.dependencies, ...pkg.devDependencies};

for (const [name, spec] of Object.entries(declared)) {
    if (!EXACT.test(spec)) continue;

    const manifest = path.join(ROOT, 'node_modules', name, 'package.json');
    if (!existsSync(manifest)) {
        problems.push(`${name} is pinned at ${spec} but is not installed - run 'npm install'`);
        continue;
    }

    const installed = JSON.parse(readFileSync(manifest, 'utf8')).version;
    if (installed !== spec) {
        problems.push(
            `${name}: pinned at ${spec}, installed ${installed}. Rollup inlines this at build ` +
            `time, so the bundle contains ${installed}. Run 'npm install' and rebuild.`
        );
    } else {
        notes.push(`${name} ${installed} matches its pin`);
    }
}

// ── Report ───────────────────────────────────────────────────────────────────
if (problems.length) {
    console.error('\n  verify-build: the build is NOT safe to serve\n');
    for (const problem of problems) console.error(`    ✗ ${problem}`);
    console.error('');
    process.exit(1);
}

console.log('');
for (const note of notes) console.log(`    ✓ ${note}`);
console.log(`    ✓ ${ARTEFACTS.length} bundles present and non-trivial`);
console.log('\n  verify-build: this build matches the checkout\n');
