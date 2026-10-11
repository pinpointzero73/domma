/**
 * The changelog: the site's Releases collection, kept current from the releases themselves.
 *
 * Every Domma release writes its website summary into public/data/releases.json
 * (scripts/promote-release-notes.mjs), and the release's source - which lib/release.js
 * already fetches - carries that file. After each sync, the versions the collection
 * lacks are added; entries already there are never touched, so a correction made in
 * the admin stays. scripts/site-migrate/releases.mjs seeds a new site with the same rule.
 */
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';

export const RELEASES_SLUG = 'releases';

/**
 * The entry a releases.json row becomes. Rows without a version (the early "Jan 21"
 * notes) take `fallbackSequence`, which sorts them below every release.
 */
export function releaseEntry(r, fallbackSequence = 0) {
    const semver = /^v?\d+\.\d+\.\d+$/.test(r.year || '');
    const version = semver ? String(r.year).replace(/^v?/, 'v') : String(r.year || '');
    const [maj, min, pat] = semver ? version.slice(1).split('.').map(n => parseInt(n, 10)) : [];
    const id = crypto.createHash('sha1').update(`domma-release:${version}`).digest('hex');
    const day = /^\d{4}-\d{2}-\d{2}$/.test(r.date || '') ? r.date : /^\d{4}-\d{2}$/.test(r.date || '') ? `${r.date}-01` : '2026-01-01';
    const at = `${day}T00:00:00.000Z`;
    return {
        id: `${id.slice(0, 8)}-${id.slice(8, 12)}-${id.slice(12, 16)}-${id.slice(16, 20)}-${id.slice(20, 32)}`,
        data: {version, title: r.title || version, summary: r.description || '', date: day, sequence: semver ? maj * 1e6 + min * 1e3 + pat : fallbackSequence},
        meta: {createdAt: at, updatedAt: at, createdBy: null, source: 'admin'}
    };
}

/**
 * Add the release's versions the collection lacks. `store` is {list(), create(data)} -
 * the CMS collections service in the plugin, a stub in tests. Resolves the versions added.
 */
export async function importChangelog(rel, store) {
    const file = path.join(rel.dir, 'public', 'data', 'releases.json');
    if (!fs.existsSync(file)) return [];
    const {releases = []} = JSON.parse(fs.readFileSync(file, 'utf8'));
    const have = new Set((await store.list()).map(e => e.data?.version));
    const added = [];
    // Oldest first, so createdAt order matches release order too.
    for (const r of releases.filter(r => /^v?\d+\.\d+\.\d+$/.test(r.year || '')).reverse()) {
        const {data} = releaseEntry(r);
        if (have.has(data.version)) continue;
        await store.create(data);
        have.add(data.version);
        added.push(data.version);
    }
    return added;
}
