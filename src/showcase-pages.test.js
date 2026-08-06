// src/showcase-pages.test.js
//
// Loads every page under public/showcase/ into a fresh jsdom window against the
// BUILT bundle, runs its scripts in document order, and asserts that the page
// rendered and logged nothing.
//
// Why this exists
// ---------------
// There was no browser-level coverage of showcase pages at all. The unit suite
// exercises src/ modules in isolation and cannot see a page that renders wrong,
// so the failure mode is invisible: no error in the terminal, no failing test,
// just a page that is broken for every visitor. The same blind spot let the
// v0.30.0 modal regression and the onUpdated bug both survive a green suite.
//
// It was written as the prerequisite for the showcase conventions sweep — 191
// Domma-convention violations across 54 pages, recorded in
// docs/superpowers/specs/2026-08-04-showcase-conventions-sweep-findings.md.
// Rewriting 191 call sites without a harness is precisely how a green suite and
// a broken site coexist.
//
// Its first run found THIRTEEN pages already broken, before a single line of the
// sweep was written — including a `Domma.init()` call that threw and killed the
// whole of one page's demo, `$('#x')[0]` returning undefined on a collection
// that documented the opposite, two components handed the wrong element type,
// four missing icons, a page emitting six deprecation warnings about itself, and
// two invalid theme names. All are fixed, so the baseline below is EMPTY and
// this behaves as a clean gate until something regresses.
//
// How a page is loaded
// -------------------
// jsdom executes inline scripts but will not fetch external ones unless
// `resources: 'usable'`, which would mean real network requests. So every
// external CLASSIC script is rewritten into an inline one, in place. That
// matters more than it sounds: it preserves the browser's execution order —
// domma.min.js first, page code after — and a page whose code runs before Domma
// exists is not the page under test.
//
// What is NOT executed, and why that is stated rather than hidden:
//   * EXTERNAL `type="module"` scripts. jsdom has no ES module support. In
//     practice this is layouts/js/layout.js on 83 pages — the navbar, footer and
//     theme chrome, not the page's own logic.
//   * INLINE module scripts that actually import something (2 pages). An inline
//     module with no import or export is run, wrapped in an async IIFE to keep
//     its scope and its top-level await — otherwise those pages pass on markup
//     alone while none of their logic executes.
//     `skipped` records every genuine skip.
//   * Anything served from a CDN. DOMPurify is substituted from the npm package,
//     exactly as src/examples.test.js does.
//
// Ratchet
// -------
// Modelled on scripts/validate-classes.js: `showcase-pages.baseline.json`
// records findings that are known and accepted, and a page fails only when it
// gains one that is NOT recorded. The baseline is currently empty — every page
// is clean — so any finding at all is a failure. Keep it that way: adding an
// entry should be a conscious act with a reason, not a way to make a red run
// green.
//
//   npm test                                  ratchet against the baseline
//   SHOWCASE_STRICT=1 npx vitest run src/showcase-pages.test.js    every finding
//   SHOWCASE_BASELINE=1 npx vitest run src/showcase-pages.test.js  rewrite it
//
// NOTE: runs against public/dist/domma.min.js, a gitignored build artefact.
// Run `npm run build:js` after changing src/ or this tests the old code.

import {beforeAll, describe, expect, it} from 'vitest';
import {JSDOM, VirtualConsole} from 'jsdom';
import createDOMPurify from 'dompurify';
import {existsSync, readFileSync, readdirSync, statSync, writeFileSync} from 'fs';
import path from 'path';

const ROOT     = process.cwd();
const PUBLIC   = path.join(ROOT, 'public');
const SHOWCASE = path.join(PUBLIC, 'showcase');
const BUNDLE   = path.join(PUBLIC, 'dist/domma.min.js');
const BASELINE = path.join(ROOT, 'scripts/showcase-pages.baseline.json');

const STRICT        = process.env.SHOWCASE_STRICT === '1';
const WRITE_BASELINE = process.env.SHOWCASE_BASELINE === '1';

const BUNDLE_MISSING = [
    'public/dist/domma.min.js is missing.',
    '',
    'These specs verify the BUILT bundle, not src/. Without it there is nothing',
    'to test, and skipping would let a broken build ship unnoticed.',
    '',
    'Run:  npm run build:js'
].join('\n');

/** Settle time after parse: template fetches and the first reactive flush. */
const SETTLE_MS = 60;

/** Text that should never survive into rendered output. */
const SUSPICIOUS = ['[object Object]', 'NaN%', 'undefinedundefined'];

/**
 * Containers whose contents are SAMPLE CODE, not rendered output.
 *
 * A showcase about templating legitimately prints `{{name}}` on the page as
 * documentation — `reference/index.html` does exactly that. Scanning it for
 * unresolved bindings finds the thing the page exists to show.
 *
 * `textarea` is in the list for the same reason one step further on: the utils
 * showcase seeds one with `Hello {{name}}! {{#if premium}}(Premium){{/if}}` so
 * the reader can edit a template and watch it render. That is the demo, not a
 * binding that failed.
 */
const SAMPLE_SELECTORS = 'script,style,template,pre,code,noscript,textarea,' +
    '[class*="code"],[class*="example"],[class*="snippet"],[class*="syntax"]';

const tick = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/** Every .html under a directory, sorted, as repo-relative paths. */
function walk(dir, out = []) {
    for (const entry of readdirSync(dir).sort()) {
        const p = path.join(dir, entry);
        if (statSync(p).isDirectory()) walk(p, out);
        else if (p.endsWith('.html')) out.push(p);
    }
    return out;
}

/**
 * Fill in the browser APIs jsdom does not implement.
 *
 * These are gaps in the TEST ENVIRONMENT, not faults in the page. Without them
 * every canvas effect and every scroll-triggered effect reports a failure that
 * says nothing about Domma — and a harness that cries wolf is one people stop
 * reading. The stubs do nothing; they exist so the surrounding page code runs to
 * completion and its real faults surface.
 */
function installBrowserGaps(window) {
    const noop = () => {};
    const context2d = new Proxy({}, {
        get: (_, key) => {
            if (key === 'canvas') return null;
            if (key === 'measureText') return () => ({width: 0});
            if (key === 'getImageData') return () => ({data: new Uint8ClampedArray(4)});
            if (key === 'createLinearGradient' || key === 'createRadialGradient') {
                return () => ({addColorStop: noop});
            }
            return noop;
        },
        set: () => true
    });

    window.HTMLCanvasElement.prototype.getContext = () => context2d;
    window.HTMLCanvasElement.prototype.toDataURL  = () => 'data:image/png;base64,';

    for (const name of ['IntersectionObserver', 'ResizeObserver']) {
        if (typeof window[name] === 'undefined') {
            window[name] = class {
                observe() {} unobserve() {} disconnect() {} takeRecords() { return []; }
            };
        }
    }

    if (typeof window.requestAnimationFrame === 'undefined') {
        window.requestAnimationFrame = (cb) => window.setTimeout(() => cb(Date.now()), 16);
        window.cancelAnimationFrame  = (id) => window.clearTimeout(id);
    }

    if (typeof window.matchMedia === 'undefined') {
        window.matchMedia = (query) => ({
            matches: false, media: query,
            addEventListener: noop, removeEventListener: noop,
            addListener: noop, removeListener: noop
        });
    }
}

/** Resolve a page-relative script src to a file under public/, or null. */
function resolveToFile(pageDir, src) {
    if (/^https?:\/\/|^\/\//i.test(src)) return null;
    const abs = src.startsWith('/') ? path.join(PUBLIC, src.slice(1)) : path.resolve(pageDir, src);
    return existsSync(abs) ? abs : null;
}

/** Rewrite external classic scripts inline, preserving document order. */
function inlineScripts(html, pageDir) {
    const skipped = [];

    const out = html.replace(/<script([^>]*)>([\s\S]*?)<\/script>/g, (whole, attrs, body) => {
        const src      = attrs.match(/\ssrc="([^"]*)"/);
        const isModule = /type\s*=\s*"module"/.test(attrs);

        if (!src) {
            if (!isModule) return whole;                  // inline classic: run as-is

            // An inline module with no import or export is a module by habit,
            // not by necessity — 5 of the 7 in this repository are. Running it
            // is worth doing: without this the page's ENTIRE script never
            // executes, so it passes on markup alone and its logic is untested.
            //
            // Wrapped in an async IIFE to keep two module properties that
            // matter: its own scope, so a top-level `const` cannot collide with
            // another script's, and top-level `await`.
            if (!/^\s*(?:import|export)\s/m.test(body)) {
                return `<script>\n(async function () {\n${body}\n})();\n</script>`;
            }
            skipped.push('inline <script type="module"> with imports');
            return '';
        }
        if (isModule) { skipped.push(`module: ${src[1]}`); return ''; }

        const file = resolveToFile(pageDir, src[1]);
        if (!file) { skipped.push(`not on disk: ${src[1]}`); return ''; }

        return `<script>\n${readFileSync(file, 'utf8')}\n</script>`;
    });

    return {html: out, skipped};
}

/** Load one page and collect everything it said. */
async function loadPage(pageFile) {
    const pageDir = path.dirname(pageFile);
    const rel     = path.relative(PUBLIC, pageFile).split(path.sep).join('/');
    const {html, skipped} = inlineScripts(readFileSync(pageFile, 'utf8'), pageDir);

    const findings = [];
    const virtualConsole = new VirtualConsole();
    virtualConsole.on('error', (...a) => findings.push(`console.error: ${a.map(String).join(' ')}`));
    virtualConsole.on('warn',  (...a) => findings.push(`console.warn: ${a.map(String).join(' ')}`));
    virtualConsole.on('jsdomError', (err) => {
        // jsdom's CSS parser chokes on modern at-rules. Noise, not a page fault.
        if (/Could not parse CSS/i.test(err.message)) return;
        findings.push(`error: ${(err.stack || err.message).split('\n')[0]}`);
    });

    const dom = new JSDOM(html, {
        url: `https://dommajs.org/${rel}`,
        runScripts: 'dangerously',
        pretendToBeVisual: true,
        virtualConsole,
        beforeParse(window) {
            window.DOMPurify = createDOMPurify(window);
            installBrowserGaps(window);
            window.fetch = async (url) => {
                const resolved = new window.URL(String(url), window.location.href);
                const file = path.join(PUBLIC, resolved.pathname.replace(/^\//, ''));
                if (!existsSync(file)) {
                    return {ok: false, status: 404, text: async () => '', json: async () => ({})};
                }
                const text = readFileSync(file, 'utf8');
                return {ok: true, status: 200, text: async () => text,
                        json: async () => JSON.parse(text)};
            };
        }
    });

    await tick(SETTLE_MS);

    // Assert against a clone with sample code stripped. Scanning the live body
    // would read the inlined bundle's own source, which contains mustache.
    const clone = dom.window.document.body.cloneNode(true);
    for (const el of clone.querySelectorAll(SAMPLE_SELECTORS)) el.remove();

    const text = (clone.textContent || '').replace(/\s+/g, ' ').trim();
    if (text.length < 200) findings.push(`rendered only ${text.length} chars of visible text`);

    const unresolved = clone.innerHTML.match(/\{\{[^{}]{1,60}\}\}/g);
    if (unresolved) {
        findings.push(`unresolved binding: ${[...new Set(unresolved)].slice(0, 3).join(' ')}`);
    }

    for (const token of SUSPICIOUS) {
        if (text.includes(token)) findings.push(`rendered "${token}"`);
    }

    dom.window.close();
    return {rel, findings, skipped};
}

// ── Specs ─────────────────────────────────────────────────────────────────────

const PAGES = existsSync(SHOWCASE) ? walk(SHOWCASE) : [];

describe('Showcase pages render from the built bundle', () => {

    // A missing artefact must FAIL, not skip and not pass vacuously — that is
    // the failure mode this file exists to prevent elsewhere.
    it('the built bundle is present', () => {
        expect(existsSync(BUNDLE), BUNDLE_MISSING).toBe(true);
    });

    it('there are pages to check', () => {
        expect(PAGES.length, `no .html found under ${SHOWCASE}`).toBeGreaterThan(0);
    });

    describe('each page', () => {
        let baseline = {};
        const collected = {};

        beforeAll(() => {
            if (!existsSync(BUNDLE)) throw new Error(BUNDLE_MISSING);
            if (existsSync(BASELINE)) baseline = JSON.parse(readFileSync(BASELINE, 'utf8'));
        });

        for (const page of PAGES) {
            const rel = path.relative(PUBLIC, page).split(path.sep).join('/');

            it(`${rel} renders and logs nothing`, async () => {
                const {findings} = await loadPage(page);
                collected[rel] = findings;

                if (WRITE_BASELINE) return;

                const known = new Set(STRICT ? [] : (baseline[rel] || []));
                const fresh = findings.filter(f => !known.has(f));

                expect(fresh, fresh.length
                    ? `${rel} gained ${fresh.length} finding(s):\n      ` + fresh.join('\n      ')
                    : '').toEqual([]);
            });
        }

        it('baseline is written when asked, and is otherwise not stale', () => {
            if (WRITE_BASELINE) {
                const next = {};
                for (const [rel, findings] of Object.entries(collected)) {
                    if (findings.length) next[rel] = findings;
                }
                writeFileSync(BASELINE, JSON.stringify(next, null, 2) + '\n');
                return;
            }

            // A baseline entry for a page that is now clean is not a failure —
            // it is progress that nobody recorded. Say so rather than fail.
            const fixed = Object.keys(baseline)
                .filter(rel => collected[rel] && collected[rel].length === 0);
            if (fixed.length) {
                console.log(`\n  ${fixed.length} baselined page(s) are now clean — ` +
                    'run SHOWCASE_BASELINE=1 to record it:\n    ' + fixed.join('\n    '));
            }
            expect(true).toBe(true);
        });
    });
});
