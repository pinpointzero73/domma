#!/usr/bin/env node
/**
 * Phase 7: the old site's addresses as the new site's redirects.
 *
 * Every 301 and 410 row of docs/plans/dommajs-address-map.json becomes a rule in
 * the site's content/seo/redirects.json - the file the CMS's SEO > Redirects
 * screen edits, so after this they are the admin's like any other rule. Each one
 * goes through the engine's own checkRule() (the site's copy of
 * admin/js/lib/seo-redirects.js), which refuses duplicates, loops and anything
 * that redirects to itself. Rules already on the site are kept, and a map row
 * whose address already has a rule is left alone (reported), so running it again
 * changes nothing.
 *
 * The CMS reads redirects.json at start: restart the site afterwards.
 *
 * Usage: node scripts/site-migrate/redirects.mjs <site-dir> [--dry]
 */
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath, pathToFileURL} from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const MAP = path.join(ROOT, 'docs', 'plans', 'dommajs-address-map.json');
const [siteArg] = process.argv.slice(2).filter(a => !a.startsWith('--'));
const DRY = process.argv.includes('--dry');
if (!siteArg) { console.error('Usage: redirects.mjs <site-dir> [--dry]'); process.exit(1); }
const SITE = path.resolve(siteArg);

const {checkRule, MAX_RULES} = await import(pathToFileURL(path.join(SITE, 'admin', 'js', 'lib', 'seo-redirects.js')).href);
const FILE = path.join(SITE, 'content', 'seo', 'redirects.json');
const current = fs.existsSync(FILE) ? JSON.parse(fs.readFileSync(FILE, 'utf8')) : {rules: []};
const rules = Array.isArray(current.rules) ? [...current.rules] : [];

const rows = JSON.parse(fs.readFileSync(MAP, 'utf8')).filter(r => r.status === 301 || r.status === 410);
const at = new Date().toISOString();
const added = [];
const skipped = [];
const refused = [];
for (const row of rows) {
    const input = {from: row.old, to: row.status === 410 ? '' : row.new, code: row.status, note: `dommajs.org: ${row.note || row.title || ''}`.trim()};
    const {errors, rule} = checkRule(input, rules);
    if (errors.from && /already a redirect/i.test(errors.from)) { skipped.push(row.old); continue; }
    if (Object.keys(errors).length) { refused.push(`${row.old} -> ${row.new || '410'}: ${Object.values(errors).join('; ')}`); continue; }
    const id = crypto.createHash('sha1').update(`dommajs-redirect:${rule.from}`).digest('hex').slice(0, 12);
    rules.push({...rule, id, at});
    added.push(rule.from);
}
if (rules.length > MAX_RULES) { console.error(`That would be ${rules.length} rules; the CMS keeps at most ${MAX_RULES}.`); process.exit(1); }

console.log(`${added.length} added, ${skipped.length} already there, ${refused.length} refused (${rows.length} map rows; ${rules.length} rules in all)`);
for (const r of refused) console.log(`  refused ${r}`);
if (!DRY && added.length) {
    fs.mkdirSync(path.dirname(FILE), {recursive: true});
    const tmp = `${FILE}.${process.pid}.tmp`;
    fs.writeFileSync(tmp, `${JSON.stringify({...current, rules}, null, 2)}\n`);
    fs.renameSync(tmp, FILE);
    console.log(`Wrote ${path.relative(SITE, FILE)} - restart the site.`);
}
