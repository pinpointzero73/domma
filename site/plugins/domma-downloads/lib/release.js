/**
 * The Domma release the downloads page offers, kept in the plugin's data/.
 *
 * Each Domma release is public on GitHub with its built files attached
 * (domma-v<x>.tar.gz - the whole public/dist) and its source at the tag. For a
 * release we have not seen, sync() fetches both into data/releases/<x>/:
 *
 *   src/                 the source at the tag (templates, scripts, src/) ...
 *   src/public/dist/     ... with the release's built files unpacked into it
 *   src/public/download/kickstart-files/ + kickstart-manifest.json
 *                        written by the release's own scripts/build-kickstart-files.js
 *
 * and then points data/current.json at it. The two newest releases are kept;
 * older ones are removed. Nothing is served until a release is complete.
 */
import fs from 'node:fs';
import fsp from 'node:fs/promises';
import path from 'node:path';
import {execFile} from 'node:child_process';
import {promisify} from 'node:util';

const run = promisify(execFile);
const REPO = 'pinpointzero73/domma';
const KEEP = 2;

export class Releases {
    constructor(dataDir, log = console) {
        this.dir = path.join(dataDir, 'releases');
        this.currentFile = path.join(dataDir, 'current.json');
        this.log = log;
        this.syncing = null;
    }

    /** {version, dir} of the release being offered, or null before the first sync. */
    current() {
        try {
            const {version} = JSON.parse(fs.readFileSync(this.currentFile, 'utf8'));
            const dir = path.join(this.dir, version, 'src');
            return fs.existsSync(path.join(dir, '.complete')) ? {version, dir} : null;
        } catch {
            return null;
        }
    }

    /** Fetch the latest release if it is not here yet. One sync at a time. */
    sync() {
        this.syncing ??= this._sync().finally(() => { this.syncing = null; });
        return this.syncing;
    }

    async _sync() {
        const res = await fetch(`https://api.github.com/repos/${REPO}/releases/latest`, {headers: {Accept: 'application/vnd.github+json'}});
        if (!res.ok) throw new Error(`GitHub answered ${res.status} for the latest release`);
        const rel = await res.json();
        const tag = rel.tag_name;
        const version = String(tag).replace(/^v/, '');
        if (!/^\d+\.\d+\.\d+$/.test(version)) throw new Error(`Unexpected release tag "${tag}"`);
        if (this.current()?.version === version) return {version, fetched: false};

        const asset = (rel.assets || []).find(a => a.name === `domma-${tag}.tar.gz`);
        if (!asset) throw new Error(`Release ${tag} has no domma-${tag}.tar.gz`);

        const work = path.join(this.dir, `${version}.incoming`);
        const src = path.join(work, 'src');
        await fsp.rm(work, {recursive: true, force: true});
        await fsp.mkdir(path.join(src, 'public', 'dist'), {recursive: true});

        await this._untar(`https://codeload.github.com/${REPO}/tar.gz/refs/tags/${tag}`, src, 1);
        await this._untar(asset.browser_download_url, path.join(src, 'public', 'dist'), 0);
        // The release's own Kickstart files and manifest, from its templates and dist.
        await run(process.execPath, [path.join(src, 'scripts', 'build-kickstart-files.js')], {cwd: src, timeout: 120000});
        await fsp.writeFile(path.join(src, '.complete'), new Date().toISOString());

        const final = path.join(this.dir, version);
        await fsp.rm(final, {recursive: true, force: true});
        await fsp.rename(work, final);
        await fsp.writeFile(this.currentFile, JSON.stringify({version, fetched: new Date().toISOString()}) + '\n');
        await this._prune(version);
        this.log.info?.(`[domma-downloads] now offering Domma ${version}`);
        return {version, fetched: true};
    }

    /** Download a .tar.gz and unpack it into `dest`, dropping `strip` leading folders. */
    async _untar(url, dest, strip) {
        const res = await fetch(url, {redirect: 'follow'});
        if (!res.ok) throw new Error(`${res.status} fetching ${url}`);
        const file = path.join(dest, '..', `.dl-${process.pid}-${Date.now()}.tar.gz`);
        await fsp.writeFile(file, Buffer.from(await res.arrayBuffer()));
        try {
            await run('tar', ['-xzf', file, '-C', dest, ...(strip ? [`--strip-components=${strip}`] : [])], {timeout: 120000});
        } finally {
            await fsp.rm(file, {force: true});
        }
    }

    async _prune(keepVersion) {
        const entries = (await fsp.readdir(this.dir, {withFileTypes: true}))
            .filter(e => e.isDirectory() && /^\d+\.\d+\.\d+$/.test(e.name))
            .map(e => e.name)
            .sort((a, b) => b.localeCompare(a, undefined, {numeric: true}));
        const keep = new Set([keepVersion, ...entries.slice(0, KEEP)]);
        for (const v of entries) if (!keep.has(v)) await fsp.rm(path.join(this.dir, v), {recursive: true, force: true});
        // Custom bundles built from a release no longer offered go with it.
        const builds = path.join(this.dir, '..', 'builds');
        if (fs.existsSync(builds)) {
            for (const v of await fsp.readdir(builds)) if (!keep.has(v)) await fsp.rm(path.join(builds, v), {recursive: true, force: true});
        }
    }
}
