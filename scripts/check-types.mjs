#!/usr/bin/env node
/**
 * npm run check:types - the gate for the generated declarations.
 *
 *  1. Regenerates the declarations into a temp dir and fails if they differ
 *     from the committed assets/types/generated/ (someone edited the JSDoc in
 *     src/ without running `npm run build:types`, or edited the output by hand).
 *  2. Type-checks tests/types/ (a user's module and a classic script) against
 *     the published entry with `tsc --noEmit --strict`, resolving 'domma-js'
 *     through package.json "exports" the way a user's project does.
 */
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {buildTypes, listDeclarations, runTsc} from './build-types.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const COMMITTED = path.join(ROOT, 'assets', 'types', 'generated');

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'domma-types-'));
let failed = false;
try {
    const fresh = path.join(tmp, 'generated');
    buildTypes(fresh);

    const want = listDeclarations(fresh);
    const have = listDeclarations(COMMITTED);
    const missing = want.filter(f => !have.includes(f));
    const extra = have.filter(f => !want.includes(f));
    const changed = want.filter(f => have.includes(f)
        && fs.readFileSync(path.join(fresh, f), 'utf8') !== fs.readFileSync(path.join(COMMITTED, f), 'utf8'));

    if (missing.length || extra.length || changed.length) {
        failed = true;
        console.error('\nassets/types/generated/ is out of date with the JSDoc in src/:');
        for (const f of missing) console.error(`  missing  ${f}`);
        for (const f of extra) console.error(`  stale    ${f}`);
        for (const f of changed) {
            const a = fs.readFileSync(path.join(COMMITTED, f), 'utf8').split('\n');
            const b = fs.readFileSync(path.join(fresh, f), 'utf8').split('\n');
            const at = a.findIndex((line, i) => line !== b[i]);
            console.error(`  changed  ${f} (first difference at line ${at + 1})`);
        }
        console.error('\nRun `npm run build:types` and commit the result. Edit the JSDoc in src/, never the output.\n');
    } else {
        console.log(`Generated declarations are current (${want.length} files).`);
    }

    if (runTsc(['-p', path.join('tests', 'types', 'tsconfig.json')])) {
        console.log('tests/types type-check against the published declarations.');
    } else {
        failed = true;
        console.error('\ntests/types does not type-check against assets/types/index.d.ts (see above).\n');
    }
} catch (err) {
    failed = true;
    console.error(err.message);
} finally {
    fs.rmSync(tmp, {recursive: true, force: true});
}
if (failed) process.exit(1);
