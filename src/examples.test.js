// src/examples.test.js
//
// Renders every app in public/examples/ against the BUILT bundle
// (public/dist/domma.min.js) inside a fresh jsdom window, the same way a
// browser loads them: <script src="domma.min.js"> then <script src="component.js">.
//
// Why this exists
// ---------------
// The unit suite exercises src/ modules in isolation. It cannot catch bundling
// faults, nor rendering faults - 429 unit tests passed while four of the five
// examples had silently stopped updating after their initial paint (see the
// known gap below). These specs are the cheapest thing that stands in for a
// real user: mount the component, assert it painted, assert nothing was logged
// to the console, and assert the calculator still computes.
//
// The calculator case is the load-bearing one. It drives computed properties
// end to end - through Model, through the reactive graph, through the template
// binding engine, from minified output - which no unit test does.
//
// FIXED REGRESSION - now covered by the interaction specs below
// -------------------------------------------------------------
// Interaction tests for todo, notes, contacts and markdown were once absent on
// purpose: they could not pass. Only calculator/template.html contains {{ }}
// bindings; the other four render their content imperatively from an
// onUpdated() hook (_renderList() / _renderGrid() / markdown's preview +
// stats). But onUpdated was only ever fired by _scheduleUpdate(), called from
// inside the per-binding effects created in _wireBindings()
// (src/component-factory.js). A template with no bindings got no effects, so
// onUpdated never fired at all:
//
//     calculator : 7 bindings compiled -> 7 effects wired   (worked)
//     todo       : 0 bindings compiled -> 0 effects wired   (inert)
//     notes      : 0 -> 0                                   (inert)
//     contacts   : 0 -> 0                                   (inert)
//     markdown   : 0 -> 0                                   (inert)
//
// The symptom was silent - no error was thrown. The model updated correctly
// (adding a to-do did append to the todos array and did persist), but the DOM
// was never told. Calling _renderList() by hand painted the item immediately,
// so the render code was fine; only the trigger was missing.
//
// Introduced by 8961c64 "feat(components): compile templates to fine-grained
// bindings", and shipped in v0.30.0, v0.30.1 and v0.31.0. It was NOT a
// consequence of backing Model with domma-reactive observables - that commit
// (9221536) changed exactly one line of component-factory.js, the import
// source.
//
// Fixed by _wireUpdateWatcher(): one extra effect per component that reads the
// whole model and schedules onUpdated, so the hook fires for any data change
// rather than only for a binding repaint. The four specs below are the
// regression guard - they fail against any bundle built before that fix.
//
// NOTE: these run against public/dist/domma.min.js, a gitignored build
// artefact. Run `npm run build:js` after changing src/ or they test the old
// code.

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
    'to test, and skipping would let a broken build ship unnoticed - the exact',
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

    // The components fetch their templateUrl relative to the page - serve from disk.
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

    // A missing build artefact must FAIL, not skip and not pass vacuously -
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

                    // Rendered CORRECTLY - no unresolved template syntax...
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

    // The four apps below paint imperatively from onUpdated() and compile to
    // zero template bindings. Each spec drives one change and asserts the DOM
    // caught up - the exact thing that silently stopped working in v0.30.0.
    describe('imperative apps repaint after a data change', () => {

        beforeAll(() => {
            if (!existsSync(BUNDLE)) throw new Error(BUNDLE_MISSING);
        });

        it('todo: adding a task appends an <li> to .todo-list', async () => {
            const {window, el, errors, dom} = await mountExample(APPS.find(a => a.dir === 'todo'));

            try {
                const shadow = el.shadowRoot;
                const input  = shadow.querySelector('.new-todo-input');
                expect(input, 'todo has no .new-todo-input').toBeTruthy();

                input.value = 'Write the regression test';
                shadow.querySelector('.add-todo-btn')
                    .dispatchEvent(new window.MouseEvent('click', {bubbles: true, composed: true}));
                await tick(40);

                expect(el._model.get('todos')).toHaveLength(1);

                const items = shadow.querySelectorAll('.todo-list li');
                expect(items.length, 'model gained the task but .todo-list stayed empty').toBe(1);
                expect(items[0].textContent).toContain('Write the regression test');

                expect(errors, `todo logged: ${errors.join(' | ')}`).toEqual([]);
            } finally {
                dom.window.close();
            }
        });

        it('markdown: setting content renders the preview and word count', async () => {
            const {el, errors, dom} = await mountExample(APPS.find(a => a.dir === 'markdown'));

            try {
                const shadow   = el.shadowRoot;
                const textarea = shadow.querySelector('.markdown-input');
                expect(textarea, 'markdown has no .markdown-input').toBeTruthy();

                el._ctx().set({content: '# Heading\n\nTwo more words'});
                await tick(40);

                const preview = shadow.querySelector('.preview-pane-content');
                expect(preview.querySelector('h1'), 'preview never rendered the heading').toBeTruthy();
                expect(preview.querySelector('h1').textContent).toContain('Heading');

                const words = Number(shadow.querySelector('.stat-word-count').textContent);
                expect(words).toBeGreaterThan(0);

                expect(errors, `markdown logged: ${errors.join(' | ')}`).toEqual([]);
            } finally {
                dom.window.close();
            }
        });

        it('notes: setting notes fills .notes-grid', async () => {
            const {el, errors, dom} = await mountExample(APPS.find(a => a.dir === 'notes'));

            try {
                el._ctx().set({
                    notes: [{
                        id:         'n1',
                        title:      'Shopping list',
                        content:    'Milk, bread, coffee',
                        categories: ['Personal'],
                        updated:    Date.now()
                    }]
                });
                await tick(40);

                const grid = el.shadowRoot.querySelector('.notes-grid');
                expect(grid.children.length, 'model gained a note but .notes-grid stayed empty')
                    .toBeGreaterThan(0);
                expect(grid.textContent).toContain('Shopping list');

                expect(errors, `notes logged: ${errors.join(' | ')}`).toEqual([]);
            } finally {
                dom.window.close();
            }
        });

        it('contacts: setting contacts fills .contacts-grid', async () => {
            const {el, errors, dom} = await mountExample(APPS.find(a => a.dir === 'contacts'));

            try {
                el._ctx().set({
                    contacts: [{
                        id:      'c1',
                        name:    'Ada Lovelace',
                        email:   'ada@example.com',
                        mobile:  '07000 000000',
                        title:   'Mathematician',
                        company: 'Analytical Engine Co',
                        groups:  []
                    }]
                });
                await tick(40);

                const grid = el.shadowRoot.querySelector('.contacts-grid');
                expect(grid.children.length, 'model gained a contact but .contacts-grid stayed empty')
                    .toBeGreaterThan(0);
                expect(grid.textContent).toContain('Ada Lovelace');

                expect(errors, `contacts logged: ${errors.join(' | ')}`).toEqual([]);
            } finally {
                dom.window.close();
            }
        });
    });
});
