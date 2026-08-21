// src/model-binding.test.js
//
// Regression coverage for model → component synchronisation.
//
// Model.onChange passes a SINGLE object ({field, newValue, oldValue, model}),
// but Autocomplete, Pillbox and Editor destructured it positionally as
// (field, newVal). The guard `field === modelKey` therefore compared an object
// to a string, never matched, and model → component sync silently did nothing.
// These tests fail against that implementation.

import {beforeEach, describe, expect, it} from 'vitest';
import Domma from './index.js';

const M = Domma.models;
const E = Domma.elements;

describe('Model binding - component sync', () => {

    beforeEach(() => {
        document.body.replaceChildren();
    });

    /** Append a fresh element of the given tag and return it. */
    const host = (tag = 'input') => {
        const el = document.createElement(tag);
        document.body.appendChild(el);
        return el;
    };

    it('Autocomplete reflects a model value change', () => {
        const el = host('input');
        const model = M.create({city: {}}, {city: 'London'});

        const ac = E.autocomplete(el, {
            data: ['London', 'Leeds', 'Bristol'],
            model,
            modelKey: 'city'
        });

        model.set('city', 'Bristol');
        expect(ac.getValue()).toBe('Bristol');

        ac.destroy();
    });

    it('Autocomplete does not loop when the model echoes its own value', () => {
        const el = host('input');
        const model = M.create({city: {}}, {city: 'London'});

        const ac = E.autocomplete(el, {
            data: ['London', 'Leeds'],
            model,
            modelKey: 'city'
        });

        // Setting the value the component already holds must be a no-op,
        // not an infinite component → model → component bounce.
        expect(() => model.set('city', 'Leeds')).not.toThrow();
        expect(ac.getValue()).toBe('Leeds');

        ac.destroy();
    });

    it('Autocomplete ignores changes to unrelated model fields', () => {
        const el = host('input');
        const model = M.create({city: {}, other: {}}, {city: 'London', other: 'x'});

        const ac = E.autocomplete(el, {
            data: ['London', 'Leeds'],
            model,
            modelKey: 'city'
        });

        // NOTE: Autocomplete does not seed its value from the model on
        // construction, so push it through the binding first.
        model.set('city', 'Leeds');
        expect(ac.getValue()).toBe('Leeds');

        model.set('other', 'y');
        expect(ac.getValue()).toBe('Leeds');

        ac.destroy();
    });

    it('Pillbox reflects a model array change', () => {
        const el = host('input');
        const model = M.create({tags: {}}, {tags: ['alpha']});

        const pb = E.pillbox(el, {
            data: ['alpha', 'beta', 'gamma'],
            model,
            modelKey: 'tags'
        });

        model.set('tags', ['beta', 'gamma']);
        expect(pb.getValue()).toEqual(['beta', 'gamma']);

        pb.destroy();
    });

    it('unsubscribing after the model is destroyed does not throw', () => {
        const el = host('input');
        const model = M.create({city: {}}, {city: 'London'});

        const ac = E.autocomplete(el, {
            data: ['London'],
            model,
            modelKey: 'city'
        });

        model.destroy();                       // model torn down first
        expect(() => ac.destroy()).not.toThrow();
    });

    it('onFieldChange passes the value positionally', () => {
        const model = M.create({v: {}}, {v: 1});
        const calls = [];

        model.onFieldChange('v', (newValue, oldValue) => calls.push([newValue, oldValue]));
        model.set('v', 2);

        expect(calls).toEqual([[2, 1]]);
    });

    it('onChange(field, cb) subscribes to a single field', () => {
        // Documented in public/showcase/models/CLAUDE.md and used by the
        // contacts example, but previously added the STRING to the callback
        // set - so the callback never fired and the next set() threw
        // "cb is not a function".
        const model = M.create({a: {}, b: {}}, {a: 1, b: 1});
        const seen = [];

        model.onChange('a', (change) => seen.push(change.newValue));

        expect(() => model.set('b', 2)).not.toThrow();
        expect(seen).toEqual([]);

        model.set('a', 9);
        expect(seen).toEqual([9]);
    });

    it('onChange(field, cb) unsubscribe removes only that subscription', () => {
        const model = M.create({a: {}}, {a: 1});
        const seen = [];

        const off = model.onChange('a', (c) => seen.push(c.newValue));
        model.set('a', 2);
        off();
        model.set('a', 3);

        expect(seen).toEqual([2]);
    });

    it('onChange rejects a non-callable subscriber loudly', () => {
        const model = M.create({a: {}}, {a: 1});

        expect(() => model.onChange('a')).toThrow(TypeError);
        expect(() => model.onChange(null)).toThrow(TypeError);
    });

    it('onChange passes a single object, not positional arguments', () => {
        const model = M.create({v: {}}, {v: 1});
        let received;

        model.onChange((...args) => { received = args; });
        model.set('v', 2);

        // This is the shape the four components were getting wrong.
        expect(received).toHaveLength(1);
        expect(received[0]).toMatchObject({field: 'v', newValue: 2, oldValue: 1});
    });
});
