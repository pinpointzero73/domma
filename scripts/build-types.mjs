#!/usr/bin/env node
/**
 * Generate the TypeScript declarations from the JSDoc in src/.
 *
 *   node scripts/build-types.mjs              -> assets/types/generated/
 *   node scripts/build-types.mjs --out DIR    -> DIR (used by check-types.mjs)
 *
 * domma-reactive is bundled into Domma, not a dependency of it, so its own
 * declarations are copied in as generated/vendor/domma-reactive.d.ts and the
 * generated files point at that copy rather than at the package.
 *
 * tsc comes from node_modules when it is installed (npm ci), otherwise from
 * npx at the exact version pinned in package.json, so a checkout whose
 * node_modules predates the typescript devDependency still builds.
 */
import {spawnSync} from 'node:child_process';
import {createRequire} from 'node:module';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DEFAULT_OUT = path.join(ROOT, 'assets', 'types', 'generated');

/** The command that runs tsc: [command, ...leading args]. */
export function tscCommand() {
    const pkg = JSON.parse(fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8'));
    const version = pkg.devDependencies?.typescript;
    try {
        const require = createRequire(path.join(ROOT, 'package.json'));
        const tsc = require.resolve('typescript/bin/tsc');
        const installed = require('typescript/package.json').version;
        if (!version || installed === version) return [process.execPath, tsc];
    } catch {
        // not installed - fall through to npx
    }
    if (!version) throw new Error('typescript is not in package.json devDependencies');
    return ['npx', '-y', '-p', `typescript@${version}`, 'tsc'];
}

/** Run tsc with the given arguments from the repo root; true when it succeeded. */
export function runTsc(args) {
    const [cmd, ...lead] = tscCommand();
    const res = spawnSync(cmd, [...lead, ...args], {cwd: ROOT, stdio: 'inherit'});
    return res.status === 0;
}

/** Every .d.ts file under `dir`, sorted. */
export function listDeclarations(dir) {
    if (!fs.existsSync(dir)) return [];
    return fs.readdirSync(dir, {recursive: true})
        .filter(f => f.endsWith('.d.ts'))
        .map(f => f.split(path.sep).join('/'))
        .sort();
}

/** Bundled packages whose declarations travel with ours: specifier -> declaration file. */
const VENDORED = {'domma-reactive': 'node_modules/domma-reactive/dist/domma-reactive.d.ts'};

/** Copy the vendored declarations into `out` and point the generated files at them. */
function vendor(out) {
    const vendorDir = path.join(out, 'vendor');
    fs.mkdirSync(vendorDir, {recursive: true});
    for (const [name, file] of Object.entries(VENDORED)) {
        const pkg = JSON.parse(fs.readFileSync(path.join(ROOT, 'node_modules', name, 'package.json'), 'utf8'));
        const source = fs.readFileSync(path.join(ROOT, file), 'utf8')
            // Domma does not put the package on window, so no UMD global
            .replace(/^export as namespace \w+;\n/m, '');
        fs.writeFileSync(path.join(vendorDir, `${name}.d.ts`),
            `// ${name}@${pkg.version} declarations, copied by scripts/build-types.mjs - bundled into Domma.\n${source}`);
    }
    for (const rel of listDeclarations(out)) {
        if (rel.startsWith('vendor/')) continue;
        const file = path.join(out, rel);
        let text = fs.readFileSync(file, 'utf8');
        let changed = false;
        for (const name of Object.keys(VENDORED)) {
            let target = path.relative(path.dirname(file), path.join(vendorDir, `${name}.js`)).split(path.sep).join('/');
            if (!target.startsWith('.')) target = `./${target}`;
            const next = text.replace(new RegExp(`(from |import\\()(['"])${name}\\2`, 'g'), `$1$2${target}$2`);
            if (next !== text) { text = next; changed = true; }
        }
        if (changed) fs.writeFileSync(file, text);
    }
}

/** Write fresh declarations into `out` (emptied first). */
export function buildTypes(out = DEFAULT_OUT) {
    fs.rmSync(out, {recursive: true, force: true});
    if (!runTsc(['-p', 'tsconfig.types.json', '--outDir', out])) throw new Error('tsc failed to generate the declarations');
    vendor(out);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
    const i = process.argv.indexOf('--out');
    const out = i > 0 ? path.resolve(process.argv[i + 1]) : DEFAULT_OUT;
    try {
        buildTypes(out);
    } catch (err) {
        console.error(err.message);
        process.exit(1);
    }
    console.log(`Types written to ${path.relative(ROOT, out) || out}`);
}
