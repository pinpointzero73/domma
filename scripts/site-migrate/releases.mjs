#!/usr/bin/env node
/**
 * Phase 4: the Releases collection's starting entries, from public/data/releases.json
 * (the changelog the old site rendered). Writes scripts/site-migrate/collections/releases/data.json;
 * apply-site.mjs installs it on a site that has none yet.
 *
 * After that the site keeps itself current: the domma-downloads plugin reads each new
 * release's own releases.json and adds the versions the collection lacks - the same entry rule,
 * site/plugins/domma-downloads/lib/changelog.js.
 *
 * Usage: node scripts/site-migrate/releases.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {releaseEntry} from '../../site/plugins/domma-downloads/lib/changelog.js';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const SOURCE = path.join(ROOT, 'public', 'data', 'releases.json');
const OUT = path.join(ROOT, 'scripts', 'site-migrate', 'collections', 'releases', 'data.json');

const {releases} = JSON.parse(fs.readFileSync(SOURCE, 'utf8'));
// The few early rows without a version ("Jan 21", "v0.9.x") are the oldest: they sort below every release.
const entries = releases.map((r, i) => releaseEntry(r, releases.length - i));
fs.mkdirSync(path.dirname(OUT), {recursive: true});
fs.writeFileSync(OUT, `${JSON.stringify(entries, null, 2)}\n`);
console.log(`${entries.length} releases -> ${path.relative(ROOT, OUT)}`);
