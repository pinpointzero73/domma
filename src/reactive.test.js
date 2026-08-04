// src/reactive.test.js
import {describe, expect, it, vi} from 'vitest';
import Domma from './index.js';

const M = Domma.models;

/** Let the batched microtask flush run. */
const tick = () => new Promise(resolve => setTimeout(resolve, 0));

describe('Domma reactive - dependency tracking', () => {

    it('computed evaluates lazily and caches until a dependency changes', () => {
        const model = M.create({price: {}, qty: {}}, {price: 10, qty: 3});
        const body = vi.fn(() => model.get('price') * model.get('qty'));
        const total = M.computed(body);

        expect(body).not.toHaveBeenCalled();      // lazy: not run until read

        expect(total.get()).toBe(30);
        expect(total.get()).toBe(30);
        expect(body).toHaveBeenCalledTimes(1);    // cached

        model.set('qty', 4);
        expect(total.get()).toBe(40);
        expect(body).toHaveBeenCalledTimes(2);
    });

    it('computed does not re-run when an untouched field changes', () => {
        const model = M.create({a: {}, b: {}}, {a: 1, b: 1});
        const body = vi.fn(() => model.get('a') * 2);
        const derived = M.computed(body);

        derived.get();
        expect(body).toHaveBeenCalledTimes(1);

        model.set('b', 99);              // 'b' was never read
        derived.get();
        expect(body).toHaveBeenCalledTimes(1);
    });

    it('effect re-runs when a dependency changes', async () => {
        const model = M.create({count: {}}, {count: 0});
        const seen = [];

        M.effect(() => seen.push(model.get('count')));
        expect(seen).toEqual([0]);       // runs immediately

        model.set('count', 1);
        await tick();
        expect(seen).toEqual([0, 1]);
    });

    it('batches a burst of writes into a single effect run', async () => {
        const model = M.create({a: {}, b: {}, c: {}}, {a: 0, b: 0, c: 0});
        const body = vi.fn(() => {
            model.get('a'); model.get('b'); model.get('c');
        });

        M.effect(body);
        expect(body).toHaveBeenCalledTimes(1);

        model.set({a: 1, b: 2, c: 3});   // three field notifications
        await tick();
        expect(body).toHaveBeenCalledTimes(2);   // one flush, not three
    });

    it('re-collects dependencies so untaken branches stop triggering', async () => {
        const model = M.create({mode: {}, x: {}, y: {}}, {mode: 'x', x: 1, y: 1});
        const body = vi.fn(() => (model.get('mode') === 'x' ? model.get('x') : model.get('y')));

        M.effect(body);
        expect(body).toHaveBeenCalledTimes(1);

        model.set('y', 50);              // 'y' not read on the taken branch
        await tick();
        expect(body).toHaveBeenCalledTimes(1);

        model.set('mode', 'y');          // now the branch flips
        await tick();
        expect(body).toHaveBeenCalledTimes(2);

        model.set('y', 51);              // 'y' is now a real dependency
        await tick();
        expect(body).toHaveBeenCalledTimes(3);

        model.set('x', 99);              // 'x' no longer read
        await tick();
        expect(body).toHaveBeenCalledTimes(3);
    });

    it('stops propagation when a computed recomputes to an equal value', async () => {
        const model = M.create({n: {}}, {n: 2});
        const isEven = M.computed(() => model.get('n') % 2 === 0);
        const downstream = vi.fn(() => isEven.get());

        M.effect(downstream);
        expect(downstream).toHaveBeenCalledTimes(1);

        model.set('n', 4);               // still even → derived value unchanged
        await tick();
        expect(downstream).toHaveBeenCalledTimes(1);

        model.set('n', 5);               // now odd → propagates
        await tick();
        expect(downstream).toHaveBeenCalledTimes(2);
    });

    it('propagates through chained computeds', async () => {
        const model = M.create({n: {}}, {n: 1});
        const doubled = M.computed(() => model.get('n') * 2);
        const quadrupled = M.computed(() => doubled.get() * 2);

        const seen = [];
        M.effect(() => seen.push(quadrupled.get()));
        expect(seen).toEqual([4]);

        model.set('n', 3);
        await tick();
        expect(seen).toEqual([4, 12]);
    });

    it('settles a diamond dependency without a stale read', async () => {
        // D reads A directly and via B — B must settle before D's final value.
        const model = M.create({a: {}}, {a: 1});
        const b = M.computed(() => model.get('a') + 10);
        const seen = [];

        M.effect(() => seen.push(`${model.get('a')}:${b.get()}`));
        expect(seen).toEqual(['1:11']);

        model.set('a', 2);
        await tick();
        expect(seen).toEqual(['1:11', '2:12']);
    });

    it('stop function detaches an effect', async () => {
        const model = M.create({v: {}}, {v: 0});
        const body = vi.fn(() => model.get('v'));

        const stop = M.effect(body);
        expect(body).toHaveBeenCalledTimes(1);

        stop();
        model.set('v', 1);
        await tick();
        expect(body).toHaveBeenCalledTimes(1);
    });

    it('untracked reads do not create dependencies', async () => {
        const model = M.create({tracked: {}, hidden: {}}, {tracked: 0, hidden: 0});
        const body = vi.fn(() => {
            model.get('tracked');
            M.untracked(() => model.get('hidden'));
        });

        M.effect(body);
        model.set('hidden', 99);
        await tick();
        expect(body).toHaveBeenCalledTimes(1);

        model.set('tracked', 1);
        await tick();
        expect(body).toHaveBeenCalledTimes(2);
    });

    it('M.flush settles pending work synchronously', () => {
        const model = M.create({v: {}}, {v: 0});
        const seen = [];

        M.effect(() => seen.push(model.get('v')));
        model.set('v', 7);

        expect(seen).toEqual([0]);   // not yet flushed
        M.flush();
        expect(seen).toEqual([0, 7]);
    });

    it('tracked() proxy tracks reads and routes writes through validation', async () => {
        const model = M.create({count: {type: 'number', min: 0}}, {count: 1});
        const state = model.tracked();
        const seen = [];

        M.effect(() => seen.push(state.count));
        expect(seen).toEqual([1]);

        state.count = 5;                       // write-through
        expect(model.get('count')).toBe(5);
        await tick();
        expect(seen).toEqual([1, 5]);

        expect(() => { state.count = -1; }).toThrow();   // validation preserved
    });

    it('does not notify when a write sets an equal value', async () => {
        const model = M.create({v: {}}, {v: 5});
        const body = vi.fn(() => model.get('v'));

        M.effect(body);
        model.set('v', 5);
        await tick();
        expect(body).toHaveBeenCalledTimes(1);
    });

    it('leaves onChange semantics synchronous and per-field', () => {
        const model = M.create({a: {}, b: {}}, {a: 0, b: 0});
        const calls = [];

        model.onChange(({field, newValue}) => calls.push([field, newValue]));
        model.set({a: 1, b: 2});

        // Unchanged from before: synchronous, one call per field.
        expect(calls).toEqual([['a', 1], ['b', 2]]);
    });

    it('destroying a model detaches its dependents', async () => {
        const model = M.create({v: {}}, {v: 0});
        const body = vi.fn(() => model.get('v'));

        M.effect(body);
        model.destroy();
        model.set('v', 1);
        await tick();
        expect(body).toHaveBeenCalledTimes(1);
    });
});
