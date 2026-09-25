/**
 * Move docs/NEXT_RELEASE.md into the two places a release's notes live.
 *
 *   docs/RELEASE_NOTES.md       "### vX.Y.Z - Title (YYYY-MM-DD)", then the notes
 *   public/data/releases.json   {year, title, description, date} at the head
 *
 * Both are written by hand today and have to agree. Writing them from one
 * staged file is what lets "Cut a release" run without a person in the loop
 * for anything but the prose - and it refuses to run without the prose, as
 * `make preflight` refuses a release with no notes entry.
 *
 * NEXT_RELEASE.md is reset to its template afterwards, so the next release
 * starts from an empty page rather than from the last one's notes.
 *
 * With `--print X.Y.Z` it prints that version's RELEASE_NOTES.md section
 * instead, which is what the domma-cms re-pin PR quotes.
 *
 *     node scripts/promote-release-notes.mjs 0.45.0 2026-10-01    # prints the title
 *     node scripts/promote-release-notes.mjs --print 0.45.0
 */

import {readFileSync, writeFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import path from 'node:path';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const NEXT = path.join(ROOT, 'docs/NEXT_RELEASE.md');
const NOTES = path.join(ROOT, 'docs/RELEASE_NOTES.md');
const RELEASES = path.join(ROOT, 'public/data/releases.json');

const MARKER = '<!-- website -->';

const fail = (message) => {
    console.error(`\n  promote-release-notes: ${message}\n`);
    process.exit(1);
};

const escape = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/** A version's section of RELEASE_NOTES.md, heading included. */
function section(source, version) {
    const heading = new RegExp(`^### v${escape(version)} `, 'm');
    const match = heading.exec(source);
    if (!match) return null;
    const rest = source.slice(match.index + match[0].length);
    const next = rest.search(/^### v\d/m);
    return source.slice(match.index, next === -1 ? source.length : match.index + match[0].length + next).trim();
}

if (process.argv[2] === '--print') {
    const found = section(readFileSync(NOTES, 'utf8'), process.argv[3] || '');
    if (!found) fail(`no '### v${process.argv[3]}' section in docs/RELEASE_NOTES.md`);
    console.log(found);
    process.exit(0);
}

const [version, date] = process.argv.slice(2);
if (!/^\d+\.\d+\.\d+$/.test(version || '')) fail('usage: promote-release-notes.mjs X.Y.Z YYYY-MM-DD');
if (!/^\d{4}-\d{2}-\d{2}$/.test(date || '')) fail(`"${date}" is not a YYYY-MM-DD date`);

// ── Read the staged notes ────────────────────────────────────────────────────

const staged = readFileSync(NEXT, 'utf8');
const template = staged.match(/^<!--[\s\S]*?-->\s*/);
const body = staged.slice(template ? template[0].length : 0);

const at = body.indexOf(MARKER);
if (at === -1) fail(`docs/NEXT_RELEASE.md has lost its "${MARKER}" marker`);

const notesPart = body.slice(0, at);
const summary = body.slice(at + MARKER.length).trim();

const titleLine = notesPart.match(/^# (.*)$/m);
const title = titleLine ? titleLine[1].trim() : '';
const notes = titleLine ? notesPart.slice(titleLine.index + titleLine[0].length).trim() : '';

const missing = [
    title === '' && 'a title (the "# " line)',
    notes === '' && 'the notes (between the title and the website marker)',
    summary === '' && 'the website summary (after the marker)'
].filter(Boolean);
if (missing.length > 0) {
    fail(`docs/NEXT_RELEASE.md is missing ${missing.join(', ')} - write the release notes first`);
}

// ── Refuse to write a version twice ──────────────────────────────────────────

const notesSource = readFileSync(NOTES, 'utf8');
if (section(notesSource, version)) fail(`docs/RELEASE_NOTES.md already has a v${version} section`);

const releasesSource = readFileSync(RELEASES, 'utf8');
const releases = JSON.parse(releasesSource);
if (releases.releases.some((r) => r.year === `v${version}`)) {
    fail(`public/data/releases.json already has a v${version} entry`);
}

// ── Write ────────────────────────────────────────────────────────────────────

writeFileSync(NOTES, `### v${version} - ${title} (${date})\n\n${notes}\n\n${notesSource}`);

releases.releases.unshift({year: `v${version}`, title, description: summary, date});
const indent = (releasesSource.match(/\n( +)"/) || [null, '  '])[1];
writeFileSync(RELEASES, `${JSON.stringify(releases, null, indent)}\n`);

writeFileSync(NEXT, `${template ? template[0] : ''}# \n\n${MARKER}\n\n`);

console.error(`\n  v${version} - ${title}: RELEASE_NOTES.md, releases.json; NEXT_RELEASE.md reset\n`);
console.log(title);
