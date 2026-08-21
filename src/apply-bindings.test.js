// src/apply-bindings.test.js
//
// Coverage for M.applyBindings / M.registerBinding / M.registerHelper - the
// Tier 4 exposure of domma-reactive's binding layer.
//
// These drive real events and assert on the DOM rather than asserting that a
// call returned something. Both bugs this surface has already had - a
// `data-model` write hitting a throwaway snapshot, and `data-on-*` resolving no
// handler - were invisible to any test that only checked the initial render.

import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest';
import Domma from './index.js';

const M = Domma.models;

/** Build an element tree without innerHTML. */
const make = (tag, attrs = {}, text = '') => {
    const el = document.createElement(tag);
    for (const [key, value] of Object.entries(attrs)) el.setAttribute(key, value);
    if (text) el.textContent = text;
    return el;
};

/** Put a subtree in the document and return the root wrapper. */
const mount = (...children) => {
    const box = make('div');
    for (const child of children) box.appendChild(child);
    document.body.appendChild(box);
    return box;
};

/** Type into a control the way a user does, so the binding's listener fires. */
const type = (input, value) => {
    input.value = value;
    input.dispatchEvent(new Event('input', {bubbles: true}));
    M.flush();
};

describe('M.applyBindings', () => {

    const handles = [];

    /** Apply, remembering the handle so it is always disposed. */
    const apply = (data, root, options) => {
        const handle = M.applyBindings(data, root, options);
        handles.push(handle);
        return handle;
    };

    beforeEach(() => {
        document.body.replaceChildren();
    });

    afterEach(() => {
        while (handles.length) handles.pop().dispose();
    });

    // ── Root resolution ──────────────────────────────────────────────────────

    it('accepts a selector, an element and a Domma collection', () => {
        const model = M.create({title: {}}, {title: 'Live'});

        const byString = mount(make('p', {'data-bind-text': 'title'}));
        byString.id = 'root-a';
        apply(model, '#root-a');
        expect(byString.firstChild.textContent).toBe('Live');

        const byElement = mount(make('p', {'data-bind-text': 'title'}));
        apply(model, byElement);
        expect(byElement.firstChild.textContent).toBe('Live');

        const byCollection = mount(make('p', {'data-bind-text': 'title'}));
        byCollection.id = 'root-c';
        apply(model, Domma('#root-c'));
        expect(byCollection.firstChild.textContent).toBe('Live');
    });

    it('throws a named error when the root matches nothing', () => {
        const model = M.create({title: {}}, {title: 'x'});
        expect(() => M.applyBindings(model, '#not-here'))
            .toThrow(/no element found for selector "#not-here"/);
    });

    // ── Reading through a Model ──────────────────────────────────────────────

    it('renders from a Model and re-renders when a field changes', () => {
        const root = mount(make('p', {'data-bind-text': 'title'}, 'rendered by the server'));
        const model = M.create({title: {}}, {title: 'Live'});

        apply(model, root);
        expect(root.firstChild.textContent).toBe('Live');

        model.set('title', 'Changed');
        M.flush();
        expect(root.firstChild.textContent).toBe('Changed');
    });

    it('toggles data-if and keeps the same node across the toggle', () => {
        const target = make('p', {'data-if': 'showHelp'}, 'Help text.');
        const root = mount(target);
        const model = M.create({showHelp: {}}, {showHelp: true});

        apply(model, root);
        expect(root.contains(target)).toBe(true);

        model.set('showHelp', false);
        M.flush();
        expect(root.contains(target)).toBe(false);

        model.set('showHelp', true);
        M.flush();
        // The SAME node, not a re-render - this is what applyBindings promises
        // and what compile() cannot do.
        expect(root.contains(target)).toBe(true);
        expect(root.querySelector('p')).toBe(target);
    });

    // ── Writing back through a Model ─────────────────────────────────────────
    //
    // The regression that matters. A read-only snapshot passes the render
    // assertions above and silently drops every write.

    it('data-model writes back through the model, not into a snapshot', () => {
        const input = make('input', {'data-model': 'query'});
        const echo = make('span', {'data-bind-text': 'query'});
        const root = mount(input, echo);
        const model = M.create({query: {}}, {query: 'start'});

        apply(model, root);
        expect(input.value).toBe('start');

        type(input, 'typed');

        expect(model.get('query')).toBe('typed');
        // A second binding on the same field proves the write propagated
        // rather than merely leaving the keystrokes on screen.
        expect(echo.textContent).toBe('typed');
    });

    it('a data-model write runs the model change notification', () => {
        const input = make('input', {'data-model': 'query'});
        const root = mount(input);
        const model = M.create({query: {}}, {query: ''});
        const seen = [];

        model.onChange(({field, newValue}) => seen.push([field, newValue]));

        apply(model, root);
        type(input, 'abc');

        expect(seen).toEqual([['query', 'abc']]);
    });

    // A KNOWN LIMITATION, pinned so it is a documented constraint rather than a
    // latent surprise - and so that fixing it fails here and forces the docs to
    // move with it.
    //
    // Writing a nested path mutates the object in place. The field's observable
    // holds the same reference, so it never fires: the model is not notified and
    // no other binding on that path updates. M.bind()'s `parse` remains the
    // working idiom because it clones and replaces the whole field value.
    // See docs/Bindings.md.
    it('a nested data-model write lands but does NOT notify the model', () => {
        const input = make('input', {'data-model': 'profile.city'});
        const echo = make('span', {'data-bind-text': 'profile.city'});
        const root = mount(input, echo);

        const model = M.create({profile: {}}, {profile: {city: 'London', zip: 'E1'}});
        const changed = [];
        model.onChange((change) => changed.push(change.field));

        apply(model, root);
        expect(input.value).toBe('London');

        type(input, 'Leeds');

        // The write reaches the object…
        expect(model.get('profile')).toEqual({city: 'Leeds', zip: 'E1'});
        // …but nothing was told about it.
        expect(changed).toEqual([]);
        expect(echo.textContent).toBe('London');
    });

    // ── Event handlers ───────────────────────────────────────────────────────

    it('resolves data-on-* from options.methods', () => {
        const button = make('button', {'data-on-click': 'save'}, 'Save');
        const root = mount(button);
        const model = M.create({title: {}}, {title: 'x'});
        const save = vi.fn();

        apply(model, root, {methods: {save}});
        button.dispatchEvent(new Event('click', {bubbles: true}));

        expect(save).toHaveBeenCalledTimes(1);
    });

    it('a method can write to the model it was given', () => {
        const button = make('button', {'data-on-click': 'bump'}, '+');
        const output = make('span', {'data-bind-text': 'count'});
        const root = mount(button, output);
        const model = M.create({count: {}}, {count: 0});

        apply(model, root, {
            methods: {bump: () => model.set('count', model.get('count') + 1)}
        });

        button.dispatchEvent(new Event('click', {bubbles: true}));
        M.flush();
        expect(output.textContent).toBe('1');
    });

    // The real-page configuration: bindings AND handlers together, so every
    // read and write goes through the merge proxy rather than straight to the
    // tracked view. Without this, the proxy's `set` trap is never exercised.
    it('data-model still writes through when methods are also supplied', () => {
        const input = make('input', {'data-model': 'query'});
        const echo = make('span', {'data-bind-text': 'query'});
        const button = make('button', {'data-on-click': 'clear'}, 'Clear');
        const root = mount(input, echo, button);
        const model = M.create({query: {}}, {query: ''});

        apply(model, root, {methods: {clear: () => model.set('query', '')}});

        type(input, 'typed');
        expect(model.get('query')).toBe('typed');
        expect(echo.textContent).toBe('typed');

        button.dispatchEvent(new Event('click', {bubbles: true}));
        M.flush();
        expect(model.get('query')).toBe('');
        expect(input.value).toBe('');
    });

    it('a data field of the same name wins over a method', () => {
        const root = mount(make('p', {'data-bind-text': 'label'}));
        const model = M.create({label: {}}, {label: 'from data'});

        apply(model, root, {methods: {label: () => 'from methods'}});
        expect(root.firstChild.textContent).toBe('from data');
    });

    // ── Keyed lists ──────────────────────────────────────────────────────────

    it('reconciles a keyed list and preserves surviving nodes', () => {
        const list = make('ul', {'data-each': 'rows key=id'});
        list.appendChild(make('li', {'data-bind-text': 'name'}, 'template row'));
        const root = mount(list);

        const model = M.create({rows: {}}, {
            rows: [{id: 1, name: 'Ada'}, {id: 2, name: 'Grace'}, {id: 3, name: 'Alan'}]
        });

        apply(model, root);
        expect([...list.children].map((li) => li.textContent))
            .toEqual(['Ada', 'Grace', 'Alan']);

        // Hold the actual node, then remove the row in front of it.
        const graceNode = list.children[1];

        model.set('rows', [{id: 2, name: 'Grace'}, {id: 3, name: 'Alan'}]);
        M.flush();

        expect([...list.children].map((li) => li.textContent)).toEqual(['Grace', 'Alan']);
        // Node identity, measured - not "the text is still right".
        expect(list.children[0]).toBe(graceNode);
    });

    // Inside a list a bare name resolves against the ITEM - there is no scope
    // chain - so a row reaches the handler that owns it through $parent. This
    // is the pattern the docs and the showcase both teach.
    it('a row calls a root method with $parent.method($data)', () => {
        const list = make('ul', {'data-each': 'rows key=id'});
        const row = make('li');
        row.appendChild(make('span', {'data-bind-text': 'label'}));
        row.appendChild(make('button', {'data-on-click': '$parent.drop($data)'}, '×'));
        list.appendChild(row);
        const root = mount(list);

        const model = M.create({rows: {}}, {
            rows: [{id: 1, label: 'First'}, {id: 2, label: 'Second'}]
        });

        apply(model, root, {
            methods: {
                drop: (item) => model.set('rows', model.get('rows').filter((r) => r.id !== item.id))
            }
        });

        expect(list.children.length).toBe(2);

        list.children[0].querySelector('button').dispatchEvent(new Event('click', {bubbles: true}));
        M.flush();

        expect([...list.children].map((li) => li.querySelector('span').textContent))
            .toEqual(['Second']);
    });

    it('a bare handler name inside a list does not resolve, and says so', () => {
        const list = make('ul', {'data-each': 'rows key=id'});
        const row = make('li');
        row.appendChild(make('button', {'data-on-click': 'drop'}, '×'));
        list.appendChild(row);
        const root = mount(list);

        const model = M.create({rows: {}}, {rows: [{id: 1}]});
        const drop = vi.fn();
        const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});

        apply(model, root, {methods: {drop}});
        list.children[0].querySelector('button').dispatchEvent(new Event('click', {bubbles: true}));

        expect(drop).not.toHaveBeenCalled();
        expect(warn.mock.calls.flat().join('\n')).toMatch(/did not resolve to a function/);

        warn.mockRestore();
    });

    // ── Lifecycle ────────────────────────────────────────────────────────────

    it('dispose stops updates and removes the bound marker', () => {
        const target = make('p', {'data-bind-text': 'title'});
        const root = mount(target);
        const model = M.create({title: {}}, {title: 'first'});

        const handle = M.applyBindings(model, root);
        expect(target.hasAttribute('data-dm-bound')).toBe(true);

        handle.dispose();
        expect(target.hasAttribute('data-dm-bound')).toBe(false);

        model.set('title', 'second');
        M.flush();
        expect(target.textContent).toBe('first');
    });

    it('applying twice over the same region does not double-bind', () => {
        const input = make('input', {'data-model': 'query'});
        const root = mount(input);
        const model = M.create({query: {}}, {query: ''});
        const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});

        apply(model, root);
        apply(model, root);

        type(input, 'once');
        expect(model.get('query')).toBe('once');

        warn.mockRestore();
    });

    // A data-each body is a TEMPLATE - lifted out, compiled, cloned per item -
    // so mustache is substituted there and must not draw the "does not
    // interpolate {{ }}" warning that applies to the rest of the page.
    //
    // This also pins the domma-reactive pin: the warning was a false positive
    // in 0.4.0, and a downgrade would fail this test rather than quietly
    // reintroduce advice that tells authors to replace working markup.
    it('renders mustache inside a data-each without warning', () => {
        const list = make('ul', {'data-each': 'rows key=id'});
        list.appendChild(make('li', {}, '{{name}} ({{id}})'));
        const root = mount(list);

        const model = M.create({rows: {}}, {
            rows: [{id: 1, name: 'Ada'}, {id: 2, name: 'Grace'}]
        });

        const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});

        apply(model, root);

        expect([...list.children].map((li) => li.textContent)).toEqual(['Ada (1)', 'Grace (2)']);
        expect(warn).not.toHaveBeenCalled();

        warn.mockRestore();
    });

    // ── Ancestor context names ───────────────────────────────────────────────
    //
    // $parents and $parentContext arrive with the domma-reactive pin rather
    // than with any Domma code, which is exactly why they are pinned HERE: a
    // downgrade, or a re-pin that loses them, fails this test rather than
    // silently removing two names the Bindings guide tells people to use.

    it('resolves $parents and $parentContext through a nested list', () => {
        const list = make('ul', {'data-each': 'teams key=id'});
        list.appendChild(make('li', {}, '{{#each members key=id}}' +
            '[{{name}}|{{$parents[0].name}}|{{$parents[1].season}}|{{$parentContext.$index}}]' +
            '{{/each}}'));
        const root = mount(list);

        const model = M.create({season: {}, teams: {}}, {
            season: 'summer',
            teams: [
                {id: 1, name: 'Red', members: [{id: 11, name: 'Ada'}]},
                {id: 2, name: 'Blue', members: [{id: 21, name: 'Alan'}, {id: 22, name: 'Grace'}]}
            ]
        });

        apply(model, root);

        expect([...list.children].map((li) => li.textContent)).toEqual([
            // $parents[0] is the team, which $parent already reached.
            // $parents[1] is the root, which nothing else can reach.
            // $parentContext.$index is the TEAM's position - a fact about the
            // member that appears nowhere in the member.
            '[Ada|Red|summer|0]',
            '[Alan|Blue|summer|1][Grace|Blue|summer|1]'
        ]);
    });

    // A list inside a list is {{#each}}. A second data-each is left exactly as
    // written - its body renders ONCE against the outer item - and looks close
    // enough to working to survive review, so it has to say so out loud.
    it('warns rather than silently doing nothing for a nested data-each', () => {
        const outer = make('ul', {'data-each': 'teams key=id'});
        const item = make('li');
        const inner = make('ol', {'data-each': 'members key=id'});
        inner.appendChild(make('li', {}, '{{name}}'));
        item.appendChild(inner);
        outer.appendChild(item);
        const root = mount(outer);

        const model = M.create({teams: {}}, {
            teams: [{id: 1, members: [{id: 11, name: 'Ada'}]}]
        });

        const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});

        apply(model, root);

        expect(warn).toHaveBeenCalled();
        const said = warn.mock.calls.map((args) => String(args[0])).join(' ');
        expect(said).toContain('data-each="members key=id"');
        expect(said).toContain('{{#each members key=id}}');

        warn.mockRestore();
    });

    // ── Plain objects ────────────────────────────────────────────────────────

    it('accepts a plain object, with observables read through .value', () => {
        const heading = make('p', {'data-bind-text': 'count.value'});
        const root = mount(heading);
        const count = M.observable(2);

        apply({count}, root);
        expect(heading.textContent).toBe('2');

        count.value = 7;
        M.flush();
        expect(heading.textContent).toBe('7');
    });
});

describe('M.registerBinding', () => {

    beforeEach(() => {
        document.body.replaceChildren();
    });

    /** The smallest useful handler: read an expression, write it upper-cased. */
    const uppercase = {
        attribute: 'data-uppercase',
        expression: true,
        tracks: true,
        primes: true,
        update({binding, nodes, context}) {
            const value = binding.evaluate(context);
            for (const el of nodes) el.textContent = String(value).toUpperCase();
            return true;
        }
    };

    it('adds a working custom binding', () => {
        M.registerBinding('uppercase', uppercase);

        try {
            const target = make('p', {'data-uppercase': 'name'});
            const root = mount(target);
            const model = M.create({name: {}}, {name: 'ada'});

            const handle = M.applyBindings(model, root);
            expect(target.textContent).toBe('ADA');

            model.set('name', 'grace');
            M.flush();
            expect(target.textContent).toBe('GRACE');

            handle.dispose();
        } finally {
            M.unregisterBinding('uppercase');
        }
    });

    it('unregisterBinding removes it again', () => {
        M.registerBinding('uppercase', uppercase);
        M.unregisterBinding('uppercase');

        const target = make('p', {'data-uppercase': 'name'}, 'untouched');
        const root = mount(target);
        const model = M.create({name: {}}, {name: 'ada'});

        const handle = M.applyBindings(model, root);
        expect(target.textContent).toBe('untouched');
        handle.dispose();
    });
});

describe('M.registerHelper', () => {

    beforeEach(() => {
        document.body.replaceChildren();
    });

    it('makes a function callable from a binding expression', () => {
        M.registerHelper('upper', (s) => String(s).toUpperCase());

        try {
            const target = make('p', {'data-bind-text': 'upper(name)'});
            const root = mount(target);
            const model = M.create({name: {}}, {name: 'ada'});

            const handle = M.applyBindings(model, root);
            expect(target.textContent).toBe('ADA');

            model.set('name', 'grace');
            M.flush();
            expect(target.textContent).toBe('GRACE');

            handle.dispose();
        } finally {
            M.unregisterHelper('upper');
        }
    });
});
