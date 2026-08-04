// src/examples.test.js
//
// Renders every app in public/examples/ against the BUILT bundle
// (public/dist/domma.min.js) inside a fresh jsdom window, the same way a
// browser loads them: <script src="domma.min.js"> then <script src="component.js">.
//
// Why this exists
// ---------------
// The unit suite exercises src/ modules in isolation. It cannot catch bundling
// faults, nor rendering faults — 429 unit tests passed while four of the five
// examples had silently stopped updating after their initial paint (see the
// known gap below). These specs are the cheapest thing that stands in for a
// real user: mount the component, assert it painted, assert nothing was logged
// to the console, and assert the calculator still computes.
//
// The calculator case is the load-bearing one. It drives computed properties
// end to end — through Model, through the reactive graph, through the template
// binding engine, from minified output — which no unit test does.
//
// KNOWN GAP — deliberately not covered here
// -----------------------------------------
// Interaction tests for todo, notes, contacts and markdown are ABSENT ON
// PURPOSE. They would fail today, and a red suite is worse than a documented
// gap.
//
// Only calculator/template.html contains {{ }} bindings. The other four render
// their content imperatively from an onUpdated() hook (_renderList() /
// _renderGrid() / markdown's preview + stats). But onUpdated is only ever
// fired by _scheduleUpdate(), which is called from inside the per-binding
// effects created in _wireBindings() (src/component-factory.js). A template
// with no bindings therefore gets no effects, and onUpdated never fires at all:
//
//     calculator : 7 bindings compiled -> 7 effects wired   (works)
//     todo       : 0 bindings compiled -> 0 effects wired   (inert)
//     notes      : 0 -> 0                                   (inert)
//     contacts   : 0 -> 0                                   (inert)
//     markdown   : 0 -> 0                                   (inert)
//
// The symptom is silent — no error is thrown. The model updates correctly
// (adding a to-do does append to the todos array and does persist), but the
// DOM is never told. Calling _renderList() by hand immediately paints the
// item, so the render code is fine; only the trigger is missing.
//
// Introduced by 8961c64 "feat(components): compile templates to fine-grained
// bindings", and shipped in v0.30.0 and v0.30.1. Verified by rebuilding
// bundles either side of it: at its parent a521331 all four behave correctly
// (todo list gains the item, markdown preview renders <h1>, both grids fill);
// at 8961c64 and every commit since, none of them do. It is NOT a consequence
// of backing Model with domma-reactive observables — that commit (9221536)
// changed exactly one line of component-factory.js, the import source.
//
// WHEN THAT IS FIXED, add interaction specs here:
//   todo     — type into .new-todo-input, click .add-todo-btn, expect one
//              <li> in .todo-list
//   markdown — set .markdown-input value + dispatch 'input', expect
//              .preview-pane-content to contain <h1> and .stat-word-count > 0
//   notes    — set({notes: [oneNote]}), expect .notes-grid to have a child
//   contacts — set({contacts: [oneContact]}), expect .contacts-grid to have a
//              child

import {beforeAll, describe, expect, it} from 'vitest';
import {JSDOM, VirtualConsole} from 'jsdom';
import createDOMPurify from 'dompurify';
import {existsSync, readFileSync} from 'fs';
import path from 'path';

const BUNDLE = 'public/dist/domma.min.js';

const BUNDLE_MISSING = [
    `${BUNDLE} is missing.`,
    '',
    'These specs verify the BUILT bundle, not src/. Without it there is nothing',
    'to test, and skipping would let a broken build ship unnoticed — the exact',
    'failure this file exists to catch.',
    '',
    'Run:  npm run build:js'
].join('\n');

const APPS = [
    {dir: 'todo', tag: 'domma-todo'},
    {dir: 'contacts', tag: 'domma-contacts'},
    {dir: 'notes', tag: 'domma-notes'},
    {dir: 'calculator', tag: 'domma-calculator'},
    {dir: 'markdown', tag: 'domma-markdown-editor'}
];

/** Text that should never survive into rendered output. */
const SUSPICIOUS_TOKENS = ['undefined', '[object Object]', 'NaN', 'Error'];

const tick = (ms = 10) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Load one example into its own jsdom window, exactly as its index.html does.
 *
 * @param {{dir: string, tag: string}} app
 * @returns {Promise<{window: Window, el: HTMLElement, errors: string[], dom: JSDOM}>}
 */
async function mountExample(app) {
    const dir = path.join('public/examples', app.dir);
    const errors = [];

    const virtualConsole = new VirtualConsole();
    virtualConsole.on('error', (...args) => errors.push(`console.error: ${args.map(String).join(' ')}`));
    virtualConsole.on('warn', (...args) => errors.push(`console.warn: ${args.map(String).join(' ')}`));
    virtualConsole.on('jsdomError', (e) => {
        // jsdom's CSS parser chokes on modern at-rules; that is noise, not an app fault.
        if (/Could not parse CSS/i.test(e.message)) return;
        errors.push(`jsdomError: ${e.stack || e.message}`);
    });

    const dom = new JSDOM('<!doctype html><html><body></body></html>', {
        url: `https://dommajs.org/examples/${app.dir}/`,
        runScripts: 'dangerously',
        pretendToBeVisual: true,
        virtualConsole
    });
    const {window} = dom;

    window.addEventListener('error', (ev) =>
        errors.push(`window.error: ${ev.error?.stack || ev.message}`));
    window.addEventListener('unhandledrejection', (ev) =>
        errors.push(`unhandledrejection: ${ev.reason?.stack || ev.reason}`));

    // Every example page loads DOMPurify from a CDN before the bundle.
    window.DOMPurify = createDOMPurify(window);

    // The components fetch their templateUrl relative to the page — serve from disk.
    window.fetch = async (url) => {
        const resolved = new window.URL(String(url), window.location.href);
        const file = path.join(dir, path.basename(resolved.pathname));
        if (!existsSync(file)) {
            return {ok: false, status: 404, text: async () => '', json: async () => ({})};
        }
        const text = readFileSync(file, 'utf8');
        return {ok: true, status: 200, text: async () => text, json: async () => JSON.parse(text)};
    };

    const runScript = (code) => {
        const script = window.document.createElement('script');
        script.textContent = code;
        window.document.head.appendChild(script);
    };

    runScript(readFileSync(BUNDLE, 'utf8'));
    runScript(readFileSync(path.join(dir, 'component.js'), 'utf8'));

    const el = window.document.createElement(app.tag);
    window.document.body.appendChild(el);

    // Template fetch + compile + first reactive flush are all async.
    for (let i = 0; i < 50; i++) {
        const root = el.shadowRoot?.querySelector('.dm-component-root');
        if (root && root.innerHTML.trim().length > 0) break;
        await tick();
    }

    return {window, el, errors, dom};
}

const rootOf = (el) => el.shadowRoot?.querySelector('.dm-component-root');

describe('Example apps render from the built bundle', () => {

    // A missing build artefact must FAIL, not skip and not pass vacuously —
    // that is the failure mode this whole file exists to prevent elsewhere.
    // This assertion sits outside the beforeAll guard below so the reader sees
    // a real failed test carrying the instructions, not a silently aborted hook.
    it('the built bundle is present', () => {
        expect(existsSync(BUNDLE), BUNDLE_MISSING).toBe(true);
    });

    describe('mounted in jsdom', () => {

        beforeAll(() => {
            if (!existsSync(BUNDLE)) throw new Error(BUNDLE_MISSING);
        });

        for (const app of APPS) {
            it(`renders <${app.tag}> with no console errors`, async () => {
                const {el, errors, dom} = await mountExample(app);

                try {
                    expect(el.shadowRoot).toBeTruthy();

                    const root = rootOf(el);
                    expect(root, `<${app.tag}> never created .dm-component-root`).toBeTruthy();

                    // Rendered something substantial, not an empty shell.
                    const markup = root.innerHTML.replace(/\s+/g, '');
                    expect(markup.length, `<${app.tag}> rendered only ${markup.length} chars`)
                        .toBeGreaterThan(200);

                    // Rendered CORRECTLY — no unresolved template syntax...
                    expect(root.innerHTML.match(/\{\{[^}]*\}\}/g)).toBeNull();

                    // ...and no failure text masquerading as content.
                    const text = root.textContent.replace(/\s+/g, ' ');
                    for (const token of SUSPICIOUS_TOKENS) {
                        expect(text.includes(token), `<${app.tag}> rendered "${token}"`).toBe(false);
                    }

                    expect(errors, `<${app.tag}> logged: ${errors.join(' | ')}`).toEqual([]);
                } finally {
                    dom.window.close();
                }
            });
        }

        it('the calculator computes 7 + 8 = 15', async () => {
            const app = APPS.find(a => a.dir === 'calculator');
            const {window, el, errors, dom} = await mountExample(app);

            try {
                const shadow = el.shadowRoot;
                const click = (selector) => {
                    const button = shadow.querySelector(selector);
                    expect(button, `calculator has no ${selector}`).toBeTruthy();
                    button.dispatchEvent(new window.MouseEvent('click', {bubbles: true, composed: true}));
                };

                click('[data-number="7"]');
                await tick(20);
                click('[data-action="add"]');
                await tick(20);
                click('[data-number="8"]');
                await tick(20);
                click('[data-action="equals"]');
                await tick(40);

                const display = shadow.querySelector('.calculator-current');
                expect(display).toBeTruthy();
                expect(display.textContent.trim()).toBe('15');

                expect(errors, `calculator logged: ${errors.join(' | ')}`).toEqual([]);
            } finally {
                dom.window.close();
            }
        });
    });
});
