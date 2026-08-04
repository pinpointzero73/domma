// src/template-compiler.test.js
//
// Tier 3: fine-grained bindings. A structural change must re-render only its
// own block — everything else in the component keeps its DOM node identity.

import {beforeEach, describe, expect, it, vi} from 'vitest';
import Domma from './index.js';
import {annotate, scanBlocks} from './template-compiler.js';

const settle = () => new Promise(resolve => setTimeout(resolve, 0));

let seq = 0;
const uniqueTag = (base) => `${base}-t3-${++seq}`;

describe('template-compiler - annotation', () => {

    it('gives adjacent interpolations separate, non-nested anchors', () => {
        const {annotated, bindings} = annotate('<p>{{a}}{{b}}</p>');

        expect(annotated).toContain('<span data-dm-t="0_txt">{{a}}</span>');
        expect(annotated).toContain('<span data-dm-t="1_txt">{{b}}</span>');
        expect(bindings).toHaveLength(2);
    });

    it('binds dynamic attributes, grouping several on one element', () => {
        const {bindings} = annotate('<div class="box {{cls}}" id="{{uid}}">x</div>');
        const attr = bindings.find(b => b.kind === 'attr');

        expect(attr).toBeDefined();
        expect([...attr.deps].sort()).toEqual(['cls', 'uid']);
        expect(attr.parts).toHaveLength(2);
    });

    it('does not bind interpolations inside context-shifting blocks', () => {
        // {{label}} resolves against the item, not the root — binding it to a
        // root field would resolve the wrong value.
        const {bindings} = annotate('{{#each items}}<li>{{label}}</li>{{/each}}{{count}}');

        expect(bindings.some(b => b.kind === 'text' && b.expr === 'label')).toBe(false);
        expect(bindings.some(b => b.kind === 'text' && b.expr === 'count')).toBe(true);
        expect(bindings.find(b => b.kind === 'block').deps).toEqual(new Set(['items']));
    });

    it('treats a triple-stache as its own re-rendered region', () => {
        const {bindings} = annotate('<p>{{{html}}}</p>');
        const raw = bindings.find(b => b.kind === 'raw');

        expect(raw).toBeDefined();
        expect(raw.deps).toEqual(new Set(['html']));
    });

    it('skips helper expressions it cannot resolve', () => {
        const {bindings} = annotate('<p>{{formatDate created}}</p>');
        expect(bindings).toHaveLength(0);
    });

    it('scans nested blocks at every depth', () => {
        const blocks = scanBlocks('{{#if a}}{{#each b}}x{{/each}}{{/if}}');
        expect(blocks.map(b => b.kind).sort()).toEqual(['each', 'if']);
    });

    it('ignores an unmatched closing token instead of throwing', () => {
        expect(() => annotate('{{/if}}<p>{{a}}</p>')).not.toThrow();
    });
});

describe('template-compiler - fine-grained updates in components', () => {

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
        const el = await mount(uniqueTag('c'), {
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
        const el = await mount(uniqueTag('c'), {
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
        const el = await mount(uniqueTag('c'), {
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
        const el = await mount(uniqueTag('c'), {
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
        const el = await mount(uniqueTag('c'), {
            template: '{{#if shown}}<b id="inner">{{name}}</b>{{/if}}',
            data() { return {shown: true, name: 'alice'}; }
        });

        expect(root(el).textContent).toContain('alice');

        el._model.set('name', 'bob');
        await settle();
        expect(root(el).textContent).toContain('bob');
    });

    it('binds text inside a block that was initially hidden', async () => {
        const el = await mount(uniqueTag('c'), {
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
        const el = await mount(uniqueTag('c'), {
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
        const el = await mount(uniqueTag('c'), {
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
