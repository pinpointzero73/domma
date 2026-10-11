#!/usr/bin/env node
/**
 * Phases 7 and 9's check: every address the old site had (docs/plans/dommajs-address-map.json)
 * answers as the map says - 200 where it is kept as is, one 301 to an address that answers 200,
 * 410 where it is gone. Nothing is followed twice: a second redirect is a failure (a chain).
 *
 * Usage: node scripts/site-migrate/crawl-old.mjs [--base=https://dommajs.sites.dommajs.org]
 */
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const BASE = (process.argv.find(a => a.startsWith('--base='))?.slice(7) || 'https://dommajs.sites.dommajs.org').replace(/\/$/, '');
const rows = JSON.parse(fs.readFileSync(path.join(ROOT, 'docs', 'plans', 'dommajs-address-map.json'), 'utf8'));
// The CMS owns these: its admin and API answer there, whatever the old site had.
const CMS_OWNED = /^\/(admin|api)(\/|$)/;

const head = async (url) => {
    const res = await fetch(url, {redirect: 'manual', headers: {'User-Agent': 'dommajs-crawl-check'}});
    return {status: res.status, location: res.headers.get('location')};
};
const abs = (loc, from) => new URL(loc, from).href;

const problems = [];
let checked = 0;
const queue = [...rows];
async function worker() {
    for (let row; (row = queue.shift());) {
        if (CMS_OWNED.test(row.old)) continue;
        const url = BASE + row.old;
        try {
            const first = await head(url);
            checked++;
            if (row.status === 410) {
                if (first.status !== 410) problems.push(`${row.old}: ${first.status}, expected 410`);
                continue;
            }
            if (first.status === 200) {
                if (row.status !== 200) problems.push(`${row.old}: 200, expected a 301 to ${row.new}`);
                continue;
            }
            if (![301, 308].includes(first.status) || !first.location) { problems.push(`${row.old}: ${first.status}`); continue; }
            const target = abs(first.location, url);
            const want = /^https?:/.test(row.new) ? row.new : BASE + row.new;
            if (row.status === 301 && target.replace(/\/$/, '') !== want.replace(/\/$/, '')) problems.push(`${row.old}: goes to ${target}, map says ${want}`);
            const second = await head(target);
            if (second.status !== 200) problems.push(`${row.old} -> ${target}: ${second.status}${second.location ? ` -> ${second.location} (a chain)` : ''}`);
        } catch (err) {
            problems.push(`${row.old}: ${err.message}`);
        }
    }
}
await Promise.all(Array.from({length: 6}, worker));
console.log(`${checked} addresses checked on ${BASE}: ${problems.length ? `${problems.length} problems` : 'all as the map says'}`);
for (const p of problems.sort()) console.log(`  ${p}`);
process.exitCode = problems.length ? 1 : 0;
