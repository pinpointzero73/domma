/**
 * Set the package version in package.json and package-lock.json.
 *
 * Both files are edited TEXTUALLY - no parse-and-reserialise. package.json is
 * hand-formatted, and package-lock.json is 9,500 lines that do not round-trip
 * through JSON.stringify, so reserialising either would bury the one line that
 * matters under a diff nobody can review.
 *
 *   node scripts/bump.mjs 0.38.0
 *
 * The lock carries the version TWICE - once at the root and once in the entry
 * for the package itself (`packages[""]`). Both must move together or `npm ci`
 * reinstalls the old number. This asserts it found exactly two, because
 * silently bumping one of them produces a lockfile that disagrees with its own
 * manifest and an install that is wrong in a way nothing reports.
 *
 * Refuses a version that is not plain semver, or that is not higher than the
 * current one: npm will not let you republish or reuse a version number, so a
 * typo downwards cannot be corrected, only deprecated and superseded.
 *
 * This does NOT commit. The bump belongs in a commit whose message says what
 * the release contains, and a script cannot write that.
 */

import {readFileSync, writeFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import path from 'node:path';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const PKG = path.join(ROOT, 'package.json');
const LOCK = path.join(ROOT, 'package-lock.json');

const SEMVER = /^(\d+)\.(\d+)\.(\d+)$/;

const fail = (message) => {
    console.error(`\n  bump: ${message}\n`);
    process.exit(1);
};

const next = process.argv[2];
if (!next) fail('no version given - usage: node scripts/bump.mjs X.Y.Z');
if (!SEMVER.test(next)) fail(`"${next}" is not a plain X.Y.Z version`);

const pkgSource = readFileSync(PKG, 'utf8');
const current = JSON.parse(pkgSource).version;

if (current === next) fail(`already at ${next}`);

const weight = (v) => {
    const [major, minor, patch] = v.match(SEMVER).slice(1, 4).map(Number);
    return major * 1e6 + minor * 1e3 + patch;
};
if (weight(next) <= weight(current)) {
    fail(`${next} is not higher than the current ${current} - npm will not let you reuse a version number`);
}

const quoted = current.replace(/\./g, '\\.');

// ── package.json: the one top-level "version" field ──────────────────────────
const field = new RegExp(`^(\\s*"version":\\s*)"${quoted}"`, 'm');
if (!field.test(pkgSource)) fail(`could not find "version": "${current}" in package.json`);
writeFileSync(PKG, pkgSource.replace(field, `$1"${next}"`));

// ── package-lock.json: the root and packages[""] ─────────────────────────────
//
// Scoped to the head of the file so a dependency that happens to sit at the
// same version number is never rewritten. Both targets are within the first
// dozen lines; the count assertion below is what actually guarantees it.
const lockSource = readFileSync(LOCK, 'utf8');
const SPLIT = 20;
const lines = lockSource.split('\n');
const head = lines.slice(0, SPLIT).join('\n');
const tail = lines.slice(SPLIT).join('\n');

const all = new RegExp(`("version":\\s*)"${quoted}"`, 'g');
const found = (head.match(all) || []).length;
if (found !== 2) {
    fail(
        `expected 2 "version": "${current}" entries in the head of package-lock.json, found ${found}. ` +
        'Bump it by hand and check why the shape changed.'
    );
}

writeFileSync(LOCK, `${head.replace(all, `$1"${next}"`)}\n${tail}`);

console.log(`\n  ${current} → ${next}  (package.json, package-lock.json)\n`);
