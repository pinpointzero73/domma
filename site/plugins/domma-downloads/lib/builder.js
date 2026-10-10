/**
 * Custom Domma bundles, built on the server from the offered release's source.
 *
 * A build is the release's own recipe with a "custom" preset: its
 * scripts/generate-bundles.js writes the entry (from a copy of its
 * bundle-metadata.json with the preset added), and rollup builds it with the
 * plugins its rollup.config.js uses for the preset bundles - node-resolve, the
 * Domma plugin, replace (version, date, commit) and terser. The result - a UMD
 * and an ES module build, the CSS those modules need and a README - is zipped
 * and kept, so a selection is built once per release.
 *
 * The build tools are not in the site: the first build for a release installs
 * the exact versions its package.json names (rollup, the three plugins,
 * domma-reactive) into data/builder/<hash>/, shared by every release that
 * names the same versions. One build runs at a time.
 */
import crypto from 'node:crypto';
import fs from 'node:fs';
import fsp from 'node:fs/promises';
import path from 'node:path';
import {execFile} from 'node:child_process';
import {promisify} from 'node:util';
import {pathToFileURL} from 'node:url';

const run = promisify(execFile);
const TOOLS = ['rollup', '@rollup/plugin-node-resolve', '@rollup/plugin-replace', '@rollup/plugin-terser', 'domma-reactive'];
const NPM = path.join(path.dirname(process.execPath), 'npm');

export class Builder {
    constructor(dataDir, releases, log = console) {
        this.dataDir = dataDir;
        this.releases = releases;
        this.log = log;
        this.queue = Promise.resolve();
        this.pending = new Map();   // build key -> promise
    }

    /** The release's bundle metadata: modules (with dependencies), css and presets. */
    metadata(rel = this.releases.current()) {
        if (!rel) return null;
        return JSON.parse(fs.readFileSync(path.join(rel.dir, 'src', 'bundle-metadata.json'), 'utf8'));
    }

    /** The modules asked for plus everything they depend on, in the metadata's order. */
    resolve(selected, meta) {
        const want = new Set();
        const add = (key) => {
            if (!meta.modules[key] || want.has(key)) return;
            want.add(key);
            for (const dep of meta.modules[key].dependencies || []) add(dep);
        };
        for (const key of selected) add(key);
        return Object.keys(meta.modules).filter(k => want.has(k));
    }

    /** Where a resolved selection's zip lives for a release. */
    zipPath(rel, modules) {
        const key = `${rel.version}:${modules.join('+')}`;
        const out = path.join(this.dataDir, 'builds', rel.version, crypto.createHash('sha1').update(key).digest('hex').slice(0, 16));
        return {out, zip: path.join(out, `domma-custom-${rel.version}.zip`), key};
    }

    /** True when this (resolved) selection is already built for the offered release. */
    isBuilt(modules) {
        const rel = this.releases.current();
        return !!rel && modules.length > 0 && fs.existsSync(this.zipPath(rel, modules).zip);
    }

    /** The zip for a selection - built now, or the one already built. Resolves {file, name, modules}. */
    build(selected) {
        const rel = this.releases.current();
        if (!rel) return Promise.reject(Object.assign(new Error('No release is ready yet'), {status: 503}));
        const meta = this.metadata(rel);
        const modules = this.resolve(selected, meta);
        if (!modules.length) return Promise.reject(Object.assign(new Error('Choose at least one module'), {status: 400}));
        const {out, zip, key} = this.zipPath(rel, modules);
        if (fs.existsSync(zip)) return Promise.resolve({file: zip, name: path.basename(zip), modules, cached: true, sizes: readSizes(out)});
        if (!this.pending.has(key)) {
            const job = this.queue.then(() => this._build(rel, meta, modules, out, zip)).finally(() => this.pending.delete(key));
            this.queue = job.catch(() => {});
            this.pending.set(key, job);
        }
        return this.pending.get(key);
    }

    async _tools(rel) {
        const pkg = JSON.parse(await fsp.readFile(path.join(rel.dir, 'package.json'), 'utf8'));
        const all = {...(pkg.dependencies || {}), ...(pkg.devDependencies || {})};
        const deps = Object.fromEntries(TOOLS.map(name => [name, all[name]]).filter(([, v]) => v));
        const hash = crypto.createHash('sha1').update(JSON.stringify(deps)).digest('hex').slice(0, 12);
        const dir = path.join(this.dataDir, 'builder', hash);
        if (!fs.existsSync(path.join(dir, '.complete'))) {
            await fsp.mkdir(dir, {recursive: true});
            await fsp.writeFile(path.join(dir, 'package.json'), JSON.stringify({private: true, type: 'module', dependencies: deps}, null, 2));
            this.log.info?.(`[domma-downloads] installing the build tools for Domma ${rel.version}`);
            await run(NPM, ['install', '--no-audit', '--no-fund', '--ignore-scripts', '--omit=dev'], {cwd: dir, timeout: 300000});
            await fsp.writeFile(path.join(dir, '.complete'), new Date().toISOString());
        }
        // The release's source resolves `domma-reactive` from its own node_modules.
        const link = path.join(rel.dir, 'node_modules');
        if (!fs.existsSync(link)) await fsp.symlink(path.join(dir, 'node_modules'), link, 'dir');
        return dir;
    }

    async _build(rel, meta, modules, out, zip) {
        const started = Date.now();
        const tools = await this._tools(rel);
        const id = `custom-${process.pid}-${started}`;
        const work = path.join(this.dataDir, 'tmp', id);
        await fsp.mkdir(path.join(work, 'scripts'), {recursive: true});
        await fsp.mkdir(path.join(work, 'src', 'bundles'), {recursive: true});
        const entry = path.join(rel.dir, 'src', 'bundles', `${id}.js`);
        try {
            // The release's generator, run on a copy of its metadata with the custom preset added.
            const custom = {
                name: 'Custom', description: `Custom bundle: ${modules.join(', ')}`, modules,
                estimatedSize: modules.reduce((n, k) => n + (meta.modules[k].size || 0), 0), useCase: 'Built for you on dommajs.org'
            };
            await fsp.copyFile(path.join(rel.dir, 'scripts', 'generate-bundles.js'), path.join(work, 'scripts', 'generate-bundles.js'));
            await fsp.writeFile(path.join(work, 'src', 'bundle-metadata.json'), JSON.stringify({...meta, presets: {custom}}));
            await run(process.execPath, [path.join(work, 'scripts', 'generate-bundles.js')], {cwd: work, timeout: 60000});
            await fsp.copyFile(path.join(work, 'src', 'bundles', 'custom.js'), entry);

            // Rollup, configured as the release configures its preset bundles.
            const mod = (name) => pathToFileURL(path.join(tools, 'node_modules', ...name.split('/'))).href;
            const pkg = JSON.parse(await fsp.readFile(path.join(rel.dir, 'package.json'), 'utf8'));
            const banner = `/*!\n * Domma v${pkg.version} - custom bundle (${modules.join(', ')})\n * (c) ${new Date().getFullYear()} Darryl Waterhouse & DCBW-IT\n * Built on dommajs.org: ${new Date().toISOString()}\n */`;
            const config = path.join(work, 'rollup.config.mjs');
            await fsp.writeFile(config, `
import resolve from '${mod('@rollup/plugin-node-resolve')}/dist/es/index.js';
import replace from '${mod('@rollup/plugin-replace')}/dist/es/index.js';
import terser from '${mod('@rollup/plugin-terser')}/dist/es/index.js';
import {dommaPlugin} from '${pathToFileURL(path.join(rel.dir, 'src', 'plugins', 'rollup-plugin-domma.js')).href}';
const plugins = [resolve(), dommaPlugin(), replace({preventAssignment: true,
    __BUILD_VERSION__: ${JSON.stringify(JSON.stringify(pkg.version))},
    __BUILD_DATE__: ${JSON.stringify(JSON.stringify(new Date().toISOString().slice(0, 10)))},
    __BUILD_COMMIT__: ${JSON.stringify(JSON.stringify(`v${pkg.version}`))}}), terser()];
const banner = ${JSON.stringify(banner)};
export default {
    input: ${JSON.stringify(entry)},
    output: [
        {file: ${JSON.stringify(path.join(work, 'out', 'domma-custom.min.js'))}, format: 'umd', name: 'Domma', banner, sourcemap: false},
        {file: ${JSON.stringify(path.join(work, 'out', 'domma-custom.esm.js'))}, format: 'es', banner, sourcemap: false}
    ],
    plugins
};
`);
            await run(process.execPath, [path.join(tools, 'node_modules', 'rollup', 'dist', 'bin', 'rollup'), '-c', config, '--silent'],
                {cwd: rel.dir, timeout: 180000});

            // The CSS the chosen modules need, and a README saying what is in the box.
            const css = new Set(modules.flatMap(k => meta.modules[k].cssRequired || []));
            const optional = new Set(modules.flatMap(k => meta.modules[k].cssOptional || []).filter(c => !css.has(c)));
            for (const c of css) {
                const file = meta.css[c]?.file;
                if (!file) continue;
                await fsp.mkdir(path.dirname(path.join(work, 'out', file)), {recursive: true});
                await fsp.copyFile(path.join(rel.dir, 'public', 'dist', file), path.join(work, 'out', file));
            }
            await fsp.writeFile(path.join(work, 'out', 'README.md'), readme(pkg.version, modules, meta, css, optional));

            await fsp.mkdir(out, {recursive: true});
            await fsp.rm(zip, {force: true});
            const sizes = {
                min: (await fsp.stat(path.join(work, 'out', 'domma-custom.min.js'))).size,
                esm: (await fsp.stat(path.join(work, 'out', 'domma-custom.esm.js'))).size
            };
            await fsp.writeFile(path.join(out, 'sizes.json'), JSON.stringify(sizes));
            await run('zip', ['-qr', zip, '.'], {cwd: path.join(work, 'out'), timeout: 60000});
            this.log.info?.(`[domma-downloads] built ${modules.join('+')} for ${rel.version} in ${Date.now() - started} ms`);
            return {file: zip, name: path.basename(zip), modules, cached: false, sizes};
        } finally {
            await fsp.rm(entry, {force: true});
            await fsp.rm(work, {recursive: true, force: true});
        }
    }
}

function readSizes(out) {
    try { return JSON.parse(fs.readFileSync(path.join(out, 'sizes.json'), 'utf8')); } catch { return null; }
}

function readme(version, modules, meta, css, optional) {
    const line = (k) => `- **${meta.modules[k].name}** (\`${k}\`) - ${meta.modules[k].description}`;
    const cssLine = (c) => `- \`${meta.css[c]?.file}\` - ${meta.css[c]?.description || ''}`;
    return `# Domma ${version} - custom bundle

Built on dommajs.org from the Domma ${version} source, with these modules:

${modules.map(line).join('\n')}

## Files

- \`domma-custom.min.js\` - UMD, for a \`<script>\` tag (sets \`window.Domma\` and the short aliases)
- \`domma-custom.esm.js\` - an ES module: \`import Domma from './domma-custom.esm.js'\`
${[...css].map(cssLine).join('\n')}
${optional.size ? `\nAlso useful with these modules (from the full download): ${[...optional].map(c => `\`${meta.css[c]?.file}\``).join(', ')}.\n` : ''}
## Use

\`\`\`html
${[...css].map(c => `<link rel="stylesheet" href="${meta.css[c]?.file}">`).join('\n')}
<script src="domma-custom.min.js"></script>
\`\`\`

Documentation and live examples: https://dommajs.org/showcase
`;
}
