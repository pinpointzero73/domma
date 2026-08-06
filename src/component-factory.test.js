// src/component-factory.test.js
import {beforeEach, describe, expect, it, vi} from 'vitest';
import Domma from './index.js';

/** Allow the render pipeline (template promise + reactive flush + update) to settle. */
const settle = () => new Promise(resolve => setTimeout(resolve, 0));

let seq = 0;
const uniqueTag = (base) => `${base}-${++seq}`;

describe('Domma component-factory - dependency-tracked rendering', () => {

    beforeEach(() => {
        document.body.replaceChildren();
    });

    /** Mount a component definition and return its element once rendered. */
    async function mount(tag, definition, attrs = {}) {
        Domma.component(tag, definition);
        const el = document.createElement(tag);
        for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, v);
        document.body.appendChild(el);
        await settle();
        return el;
    }

    const textOf = (el) => el.shadowRoot.querySelector('.dm-component-root').textContent;

    it('surgically updates a text binding when its model field changes', async () => {
        const tag = uniqueTag('c-text');
        const el = await mount(tag, {
            template: '<p>Count: {{count}}</p>',
            data() { return {count: 0}; }
        });

        expect(textOf(el)).toContain('Count: 0');

        el._model.set('count', 7);
        await settle();
        expect(textOf(el)).toContain('Count: 7');
    });

    it('updates a computed binding when its dependency changes', async () => {
        const tag = uniqueTag('c-computed');
        const el = await mount(tag, {
            template: '<p>{{count}} / {{doubled}}</p>',
            data() { return {count: 2}; },
            computed: {
                doubled() { return this.data.count * 2; }
            }
        });

        expect(textOf(el)).toContain('2 / 4');

        el._model.set('count', 5);
        await settle();
        expect(textOf(el)).toContain('5 / 10');
    });

    it('does NOT re-evaluate a computed when an unrelated field changes', async () => {
        const tag = uniqueTag('c-isolated');
        const doubledBody = vi.fn(function () { return this.data.count * 2; });

        const el = await mount(tag, {
            template: '<p>{{doubled}} {{other}}</p>',
            data() { return {count: 1, other: 'a'}; },
            computed: {doubled: doubledBody}
        });

        const callsAfterMount = doubledBody.mock.calls.length;

        el._model.set('other', 'b');
        await settle();

        // 'other' is not read by doubled() — the old implementation re-ran
        // every computed on every change; this one must not.
        expect(doubledBody.mock.calls.length).toBe(callsAfterMount);
        expect(textOf(el)).toContain('b');

        el._model.set('count', 4);
        await settle();
        expect(doubledBody.mock.calls.length).toBeGreaterThan(callsAfterMount);
        expect(textOf(el)).toContain('8');
    });

    it('re-renders when a structural computed flips', async () => {
        const tag = uniqueTag('c-structural');
        const el = await mount(tag, {
            template: '{{#if high}}<span class="hi">HIGH</span>{{/if}}<b>{{n}}</b>',
            data() { return {n: 1}; },
            computed: {
                high() { return this.data.n > 10; }
            }
        });

        expect(el.shadowRoot.querySelector('.hi')).toBeNull();

        el._model.set('n', 50);
        await settle();
        expect(el.shadowRoot.querySelector('.hi')).not.toBeNull();

        el._model.set('n', 2);
        await settle();
        expect(el.shadowRoot.querySelector('.hi')).toBeNull();
    });

    it('coalesces a burst of writes into one re-render', async () => {
        const tag = uniqueTag('c-burst');
        const onUpdated = vi.fn();

        const el = await mount(tag, {
            template: '{{#if flag}}<i>on</i>{{/if}}<p>{{a}}{{b}}</p>',
            data() { return {a: 0, b: 0, flag: false}; },
            onUpdated
        });

        onUpdated.mockClear();
        el._model.set({a: 1, b: 2, flag: true});
        await settle();

        expect(onUpdated).toHaveBeenCalledTimes(1);
        expect(el.shadowRoot.querySelector('i')).not.toBeNull();
        expect(textOf(el)).toContain('12');
    });

    it('memoises a computed shared by several other computeds', async () => {
        const tag = uniqueTag('c-shared');
        const baseBody = vi.fn(function () { return this.data.n + 1; });

        const el = await mount(tag, {
            template: '<p>{{left}} {{right}}</p>',
            data() { return {n: 1}; },
            computed: {
                base:  baseBody,
                left()  { return this.base * 2; },
                right() { return this.base * 3; }
            }
        });

        baseBody.mockClear();
        el._model.set('n', 2);
        await settle();

        // left and right both read base — it must evaluate once, not twice.
        expect(baseBody).toHaveBeenCalledTimes(1);
        expect(textOf(el)).toContain('6 9');
    });

    it('refreshes computeds that read props when an attribute changes', async () => {
        const tag = uniqueTag('c-props');
        const el = await mount(tag, {
            template: '<p>{{shout}}</p>',
            props: {label: {type: 'string', default: 'hi'}},
            data() { return {}; },
            computed: {
                shout() { return String(this.props.label).toUpperCase(); }
            }
        }, {label: 'hello'});

        expect(textOf(el)).toContain('HELLO');

        el.setAttribute('label', 'bye');
        await settle();
        expect(textOf(el)).toContain('BYE');
    });

    it('disposes reactive work on disconnect', async () => {
        const tag = uniqueTag('c-dispose');
        const el = await mount(tag, {
            template: '<p>{{v}}</p>',
            data() { return {v: 1}; }
        });

        expect(el._effects.length).toBeGreaterThan(0);
        el.remove();
        await settle();

        expect(el._effects).toHaveLength(0);
        expect(el._computeds.size).toBe(0);
    });

    it('writing through this.data routes via the model', async () => {
        const tag = uniqueTag('c-writethrough');
        const el = await mount(tag, {
            template: '<p>{{count}}</p>',
            data() { return {count: 0}; },
            methods: {
                bump() { this.data.count = this.data.count + 1; }
            }
        });

        el._ctx().bump();
        await settle();

        expect(el._model.get('count')).toBe(1);
        expect(textOf(el)).toContain('1');
    });
});

// ─────────────────────────────────────────────────────────────────────────────
// onUpdated is a component lifecycle hook — "your data changed" — not a
// notification that a template binding repainted. It must fire for every
// component whose model data changes, including one that renders imperatively
// from the hook itself and therefore compiles to zero bindings.
//
// Regression: 8961c64 wired onUpdated exclusively to the per-binding effects,
// so a mustache-free template silently stopped updating (v0.30.0 → v0.31.0).
// ─────────────────────────────────────────────────────────────────────────────

describe('Domma component-factory - onUpdated lifecycle hook', () => {

    beforeEach(() => {
        document.body.replaceChildren();
    });

    async function mount(tag, definition, attrs = {}) {
        Domma.component(tag, definition);
        const el = document.createElement(tag);
        for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, v);
        document.body.appendChild(el);
        await settle();
        return el;
    }

    const textOf = (el) => el.shadowRoot.querySelector('.dm-component-root').textContent;

    it('fires for a component whose template has no bindings', async () => {
        const tag = uniqueTag('c-nobindings');
        const onUpdated = vi.fn();

        const el = await mount(tag, {
            // No {{ }} anywhere — compiles to zero bindings, exactly like the
            // todo/notes/contacts/markdown examples, which paint imperatively.
            template: '<ul class="list"></ul>',
            data() { return {items: []}; },
            onUpdated
        });

        expect(el._bindings.bindings).toHaveLength(0);

        // The initial paint is not an update — the watcher's priming run, which
        // exists only to collect dependencies, must not notify.
        expect(onUpdated).not.toHaveBeenCalled();

        onUpdated.mockClear();
        el._model.set('items', ['one']);
        await settle();

        expect(onUpdated).toHaveBeenCalledTimes(1);
    });

    it('fires exactly once per flush when several bound fields change together', async () => {
        const tag = uniqueTag('c-onceperflush');
        const onUpdated = vi.fn();

        const el = await mount(tag, {
            // Three bindings plus an unbound field: the watcher and every
            // binding effect must collapse into a single notification.
            template: '<p>{{a}}</p><p>{{b}}</p><p>{{sum}}</p>',
            data() { return {a: 0, b: 0, hidden: 0}; },
            computed: {
                sum() { return this.data.a + this.data.b; }
            },
            onUpdated
        });

        expect(el._bindings.bindings.length).toBeGreaterThan(1);

        onUpdated.mockClear();
        el._model.set({a: 1, b: 2, hidden: 3});
        await settle();

        expect(onUpdated).toHaveBeenCalledTimes(1);
        expect(textOf(el)).toContain('3');
    });

    it('fires only after the DOM already reflects the change', async () => {
        const tag = uniqueTag('c-afterdom');
        const seen = [];

        const el = await mount(tag, {
            template: '<p class="v">{{v}}</p>',
            data() { return {v: 'before'}; },
            onUpdated() {
                seen.push(this.root.querySelector('.v').textContent);
            }
        });

        seen.length = 0;
        el._model.set('v', 'after');
        await settle();

        // The hook is documented as post-update: code inside it reads the
        // painted DOM (the examples measure and decorate what was rendered).
        expect(seen).toEqual(['after']);
    });

    it('does not fire once the element has been disconnected', async () => {
        const tag = uniqueTag('c-disconnected');
        const onUpdated = vi.fn();

        const el = await mount(tag, {
            template: '<div class="static">nothing bound here</div>',
            data() { return {v: 1}; },
            onUpdated
        });

        // The whole-model watcher is the only reactive work a mustache-free
        // component has, and it must be owned by _effects so disconnect
        // disposes it alongside the binding effects.
        expect(el._effects.length).toBeGreaterThan(0);

        el.remove();
        await settle();
        expect(el._effects).toHaveLength(0);

        onUpdated.mockClear();
        el._model.set('v', 2);
        await settle();

        expect(onUpdated).not.toHaveBeenCalled();
    });

    it('fires for a field no template binds', async () => {
        const tag = uniqueTag('c-unbound');
        const onUpdated = vi.fn();

        const el = await mount(tag, {
            template: '<p>{{shown}}</p>',
            data() { return {shown: 'x', hidden: 0}; },
            onUpdated
        });

        onUpdated.mockClear();
        el._model.set('hidden', 99);
        await settle();

        // Deliberate: onUpdated means "the data changed", not "a binding
        // repainted". This restores the pre-8961c64 contract.
        expect(onUpdated).toHaveBeenCalledTimes(1);
        expect(textOf(el)).toContain('x');
    });

    it('is not wired at all when the component declares no onUpdated', async () => {
        const tag = uniqueTag('c-nohook');
        const el = await mount(tag, {
            template: '<p>{{a}}</p><p>{{b}}</p><p>{{c}}</p>',
            data() { return {a: 1, b: 2, c: 3}; }
        });

        // Three bindings, three effects — and no whole-model watcher. Tracking
        // every field to call a hook that does not exist would undo the
        // fine-grained win for the commonest component shape.
        expect(el._bindings.bindings).toHaveLength(3);
        expect(el._effects).toHaveLength(3);
    });
});

// ── Fine-grained bindings ─────────────────────────────────────────────────────
//
// These tests used to live in src/template-compiler.test.js. The compiler moved
// to the domma-reactive package, but these did not go with it: they mount real
// components and assert on shadow DOM, `_model` and the `onUpdated` hook, so
// they exercise component-factory.js — the compiler is only the machinery
// underneath. The package has its own tests driving `compile()` directly.
//
// What they protect is the integration: that the factory wires one effect per
// binding, so a structural change re-renders its own block and leaves every
// other node — and any user state living on it — untouched.

describe('Domma component-factory - fine-grained updates', () => {

    beforeEach(() => {
        document.body.replaceChildren();
    });

    async function mount(tag, definition) {
        Domma.component(tag, definition);
        const el = document.createElement(tag);
        document.body.appendChild(el);
        await settle();
        return el;
    }

    const root = (el) => el.shadowRoot.querySelector('.dm-component-root');

    it('preserves DOM identity outside a block when the block flips', async () => {
        const el = await mount(uniqueTag('c-t3'), {
            template: '<p id="keep">{{label}}</p>{{#if open}}<span id="panel">P</span>{{/if}}',
            data() { return {label: 'hello', open: false}; }
        });

        const keepBefore = root(el).querySelector('#keep');
        expect(root(el).querySelector('#panel')).toBeNull();

        el._model.set('open', true);
        await settle();

        // The block rendered...
        expect(root(el).querySelector('#panel')).not.toBeNull();
        // ...and the untouched paragraph is the SAME node, not a re-created one.
        // Under the old full-re-render strategy this assertion fails.
        expect(root(el).querySelector('#keep')).toBe(keepBefore);
    });

    it('keeps focus and user input across a structural change', async () => {
        const el = await mount(uniqueTag('c-t3'), {
            template: '<input id="field"><b>{{n}}</b>{{#if big}}<i id="flag">big</i>{{/if}}',
            data() { return {n: 1, big: false}; }
        });

        const input = root(el).querySelector('#field');
        input.value = 'typed by the user';

        el._model.set('big', true);
        await settle();

        expect(root(el).querySelector('#flag')).not.toBeNull();
        // A full re-render would have destroyed this input and its value.
        expect(root(el).querySelector('#field').value).toBe('typed by the user');
    });

    it('updates a dynamic attribute without touching the rest of the DOM', async () => {
        const el = await mount(uniqueTag('c-t3'), {
            template: '<div id="box" class="card {{tone}}"><p id="body">{{text}}</p></div>',
            data() { return {tone: 'is-quiet', text: 'hi'}; }
        });

        const box = root(el).querySelector('#box');
        const body = root(el).querySelector('#body');
        expect(box.getAttribute('class')).toBe('card is-quiet');

        el._model.set('tone', 'is-loud');
        await settle();

        expect(box.getAttribute('class')).toBe('card is-loud');
        expect(root(el).querySelector('#box')).toBe(box);
        expect(root(el).querySelector('#body')).toBe(body);
    });

    it('re-renders an each block when its collection changes', async () => {
        const el = await mount(uniqueTag('c-t3'), {
            template: '<ul>{{#each items}}<li>{{.}}</li>{{/each}}</ul><p id="keep">static</p>',
            data() { return {items: ['a']}; }
        });

        const keep = root(el).querySelector('#keep');
        expect(root(el).querySelectorAll('li')).toHaveLength(1);

        el._model.set('items', ['a', 'b', 'c']);
        await settle();

        expect(root(el).querySelectorAll('li')).toHaveLength(3);
        expect(root(el).textContent).toContain('c');
        expect(root(el).querySelector('#keep')).toBe(keep);
    });

    it('updates a text binding nested inside a rendered block', async () => {
        const el = await mount(uniqueTag('c-t3'), {
            template: '{{#if shown}}<b id="inner">{{name}}</b>{{/if}}',
            data() { return {shown: true, name: 'alice'}; }
        });

        expect(root(el).textContent).toContain('alice');

        el._model.set('name', 'bob');
        await settle();
        expect(root(el).textContent).toContain('bob');
    });

    it('binds text inside a block that was initially hidden', async () => {
        const el = await mount(uniqueTag('c-t3'), {
            template: '{{#if shown}}<b>{{name}}</b>{{/if}}',
            data() { return {shown: false, name: 'alice'}; }
        });

        expect(root(el).textContent).not.toContain('alice');

        el._model.set('shown', true);
        await settle();
        expect(root(el).textContent).toContain('alice');

        // The nested binding must be live now that its block exists
        el._model.set('name', 'bob');
        await settle();
        expect(root(el).textContent).toContain('bob');
    });

    it('does not touch a block whose condition did not change', async () => {
        const onUpdated = vi.fn();
        const el = await mount(uniqueTag('c-t3'), {
            template: '{{#if open}}<span id="panel">P</span>{{/if}}<b>{{n}}</b>',
            data() { return {open: true, n: 1}; },
            onUpdated
        });

        const panel = root(el).querySelector('#panel');

        el._model.set('n', 2);
        await settle();

        expect(root(el).textContent).toContain('2');
        // Changing 'n' must not re-render the {{#if open}} region
        expect(root(el).querySelector('#panel')).toBe(panel);
        expect(onUpdated).toHaveBeenCalledTimes(1);
    });

    it('renders a triple-stache region as markup and updates it', async () => {
        const el = await mount(uniqueTag('c-t3'), {
            template: '<div>{{{markup}}}</div>',
            data() { return {markup: '<em id="a">one</em>'}; }
        });

        expect(root(el).querySelector('#a')).not.toBeNull();

        el._model.set('markup', '<strong id="b">two</strong>');
        await settle();
        expect(root(el).querySelector('#b')).not.toBeNull();
        expect(root(el).querySelector('#a')).toBeNull();
    });
});

// ── data-on-* inside a component template ─────────────────────────────────────
//
// A component's `methods` are attached to the component context, while the data
// a template binds against came from `_mergeData()` — model + props + computed.
// Methods were in neither, so `data-on-click="save"` had nothing to resolve to
// and logged "did not resolve to a function" on every click. Every other binding
// worked; this one silently did nothing, which is why it went unnoticed.
//
// Methods are merged FIRST, so a data field of the same name still wins. That is
// the safer collision: templates mostly render data, and a method quietly
// shadowing a rendered value would be the worse failure.

describe('Domma component-factory - data-on-* reaches methods', () => {
    const settle = () => new Promise(r => setTimeout(r, 30));
    let n = 0;
    const uniqueTag = (p) => `${p}-ev-${++n}`;

    async function mount(tag, definition) {
        Domma.component(tag, definition);
        const el = document.createElement(tag);
        document.body.appendChild(el);
        await settle();
        return el;
    }
    const root = (el) => el.shadowRoot.querySelector('.dm-component-root');

    it('calls a method named by a bare reference', async () => {
        const seen = [];
        const el = await mount(uniqueTag('c'), {
            template: '<button id="go" data-on-click="save">go</button>',
            data() { return {n: 0}; },
            methods: {save() { seen.push('called'); }}
        });

        root(el).querySelector('#go')
            .dispatchEvent(new window.MouseEvent('click', {bubbles: true, composed: true}));
        await settle();

        expect(seen).toEqual(['called']);
    });

    it('runs the method with the component context as `this`, so set() works', async () => {
        const el = await mount(uniqueTag('c'), {
            template: '<b id="out" data-bind-text="count"></b><button id="go" data-on-click="bump"></button>',
            data() { return {count: 3}; },
            methods: {bump() { this.set({count: this.data.count + 1}); }}
        });

        expect(root(el).querySelector('#out').textContent).toBe('3');
        root(el).querySelector('#go')
            .dispatchEvent(new window.MouseEvent('click', {bubbles: true, composed: true}));
        await settle();

        expect(root(el).querySelector('#out').textContent).toBe('4');
    });

    it('lets a data field of the same name win, so a method cannot shadow it', async () => {
        const el = await mount(uniqueTag('c'), {
            template: '<b id="out">{{label}}</b>',
            data() { return {label: 'from data'}; },
            methods: {label() { return 'from method'; }}
        });

        expect(root(el).querySelector('#out').textContent).toBe('from data');
    });
});

// ── data-model inside a component template ────────────────────────────────────
//
// The data → DOM direction always worked. The DOM → data direction did not:
// `_mergeData()` builds a fresh plain object each render, and data-model's
// write-back assigns to `context.$data[key]` — so the value landed on a
// throwaway snapshot and the model never heard about it. The control appeared
// to work, because the user's own keystrokes are what they see.
//
// The merged object is now a Proxy whose writes route through model.set(),
// which is the same write path a lifecycle hook uses — validation and change
// notification included.

describe('Domma component-factory - data-model writes back', () => {
    const settle = () => new Promise(r => setTimeout(r, 30));
    let n = 0;
    const uniqueTag = (p) => `${p}-dm-${++n}`;

    async function mount(tag, definition) {
        Domma.component(tag, definition);
        const el = document.createElement(tag);
        document.body.appendChild(el);
        await settle();
        return el;
    }
    const root = (el) => el.shadowRoot.querySelector('.dm-component-root');

    it('renders the current value into the control', async () => {
        const el = await mount(uniqueTag('c'), {
            template: '<input id="i" data-model="q">',
            data() { return {q: 'start'}; }
        });
        expect(root(el).querySelector('#i').value).toBe('start');
    });

    it('writes a typed value back to the model', async () => {
        const el = await mount(uniqueTag('c'), {
            template: '<input id="i" data-model="q">',
            data() { return {q: 'start'}; }
        });

        const input = root(el).querySelector('#i');
        input.value = 'typed';
        input.dispatchEvent(new window.Event('input', {bubbles: true}));
        await settle();

        expect(el._model.get('q')).toBe('typed');
    });

    it('drives everything else bound to that field', async () => {
        const el = await mount(uniqueTag('c'), {
            template: '<input id="i" data-model="q"><b id="o" data-bind-text="q"></b>',
            data() { return {q: 'start'}; }
        });

        const input = root(el).querySelector('#i');
        input.value = 'onward';
        input.dispatchEvent(new window.Event('input', {bubbles: true}));
        await settle();

        expect(root(el).querySelector('#o').textContent).toBe('onward');
    });

    it('still spreads and enumerates like a plain object', async () => {
        // The renderer spreads the data object, so the Proxy must survive it.
        const el = await mount(uniqueTag('c'), {
            template: '<b id="o">{{a}}-{{b}}</b>',
            data() { return {a: 'x', b: 'y'}; }
        });
        const merged = el._mergeData();
        expect({...merged}.a).toBe('x');
        expect(Object.keys(merged)).toEqual(expect.arrayContaining(['a', 'b']));
        expect(root(el).querySelector('#o').textContent).toBe('x-y');
    });
});
