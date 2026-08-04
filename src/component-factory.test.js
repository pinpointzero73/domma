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
