// src/models.test.js
import {beforeEach, describe, expect, it, vi} from 'vitest';
import Domma from './index.js'; // Assuming index.js exports Domma object

describe('Domma.models - Models Module Tests', () => {

  // Re-ensure basic HTML is present for Domma to function on document.body
  // Models might not strictly need DOM, but good practice for consistency
  beforeEach(() => {
    document.body.innerHTML = '<div id="test"></div>';
  });

  it('Models - create simple model', () => {
    const User = Domma.models.create({
      name: {type: 'string', default: ''},
      age: {type: 'number', default: 0}
    });
    expect(User.get('name')).toBe('');
    expect(User.get('age')).toBe(0);
  });

  it('Models - set and get values', () => {
    const User = Domma.models.create({
      name: {type: 'string'}
    });
    User.set('name', 'Alice');
    expect(User.get('name')).toBe('Alice');
  });

  it('Models - set multiple values', () => {
    const User = Domma.models.create({
      name: {type: 'string'},
      email: {type: 'string'}
    });
    User.set({name: 'Bob', email: 'bob@example.com'});
    expect(User.get('name')).toBe('Bob');
    expect(User.get('email')).toBe('bob@example.com');
  });

  it('Models - toJSON', () => {
    const User = Domma.models.create({
      name: {type: 'string', default: 'Test'}
    });
    const json = User.toJSON();
    expect(json.name).toBe('Test');
    expect(json).toEqual({name: 'Test'}); // More specific
  });

  it('Models - onChange callback', () => {
    const onChangeSpy = vi.fn();
    const User = Domma.models.create({
      name: {type: 'string'}
    });
    User.onChange(onChangeSpy);
    User.set('name', 'Changed');
    expect(onChangeSpy).toHaveBeenCalledTimes(1);
    expect(onChangeSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        field: 'name',
        newValue: 'Changed'
      })
    );
  });

  it('Models - onChange stays silent when a write sets an equal primitive', () => {
    const onChangeSpy = vi.fn();
    const User = Domma.models.create({
      name: {type: 'string'}
    }, {name: 'Alice'});
    User.onChange(onChangeSpy);

    User.set('name', 'Alice');           // no-op write
    expect(onChangeSpy).not.toHaveBeenCalled();

    User.set('name', 'Bob');             // guards against a vacuous assertion
    expect(onChangeSpy).toHaveBeenCalledTimes(1);
  });

  it('Models - onChange stays silent when a write sets a structurally equal value', () => {
    // The gate is isEqual, not !==, so a fresh object or array carrying the
    // same contents must not count as a change.
    const onChangeSpy = vi.fn();
    const Settings = Domma.models.create({
      prefs: {type: 'object'},
      tags: {type: 'array'}
    }, {prefs: {theme: 'dark', size: 2}, tags: ['a', 'b']});
    Settings.onChange(onChangeSpy);

    Settings.set('prefs', {theme: 'dark', size: 2});   // equal, new reference
    Settings.set('tags', ['a', 'b']);                  // equal, new reference
    expect(onChangeSpy).not.toHaveBeenCalled();

    Settings.set('prefs', {theme: 'light', size: 2});  // genuinely different
    expect(onChangeSpy).toHaveBeenCalledTimes(1);
  });

  it('Models - Date fields follow utils.isEqual, not domma-reactive\'s comparator', () => {
    // Domma's utils.isEqual reports ANY two Date instances as equal: it walks
    // own enumerable keys, and a Date has none. Replacing a Date with a
    // completely different Date is therefore not seen as a change - neither by
    // onChange nor by the observable backing the field, because the observables
    // are created with {equals: utils.isEqual}.
    //
    // This is v0.30.1 behaviour, PINNED DELIBERATELY. It is a known latent bug:
    // domma-reactive's own isEqual compares Dates by getTime() and would fire
    // here. Do not "fix" this test to match the package - doing so changes
    // Domma's change-detection semantics for every Date-valued field in every
    // model, and that is a decision to take on purpose, not in passing.
    const onChangeSpy = vi.fn();
    const Event = Domma.models.create({
      at: {type: 'date'}
    }, {at: new Date('2020-01-01T00:00:00Z')});

    const runs = [];
    const stop = Domma.models.effect(() => runs.push(Event.get('at')));
    expect(runs).toHaveLength(1);

    Event.onChange(onChangeSpy);
    Event.set('at', new Date('2031-06-30T12:00:00Z'));   // a genuinely different instant
    Domma.models.flush();

    expect(onChangeSpy).not.toHaveBeenCalled();          // no synchronous notification
    expect(runs).toHaveLength(1);                        // and no reactive notification

    // Guards against a vacuous assertion: utils.isEqual DOES separate a Date
    // from null, so a real change still propagates down both paths.
    Event.set('at', null);
    Domma.models.flush();
    expect(onChangeSpy).toHaveBeenCalledTimes(1);
    expect(runs).toHaveLength(2);

    stop();
  });

  it('Models - validate() does not link the model into a running computation', () => {
    // validate() calls _snapshot() outside untracked(), so _snapshot() must read
    // through peek(). If it read through .value instead, every validate() call
    // inside a computed or effect would silently subscribe that computation to
    // every field on the model.
    const User = Domma.models.create({
      tick: {type: 'number'},
      name: {type: 'string'},
      age: {type: 'number'}
    }, {tick: 0, name: 'Alice', age: 30});

    const body = vi.fn(() => {
      User.get('tick');      // the effect's one intended dependency
      User.validate();
    });

    const stop = Domma.models.effect(body);
    expect(body).toHaveBeenCalledTimes(1);

    User.set('name', 'Bob');           // never read directly by the effect
    User.set('age', 31);
    Domma.models.flush();
    expect(body).toHaveBeenCalledTimes(1);

    // Guard: the effect is genuinely live, it simply is not subscribed to the
    // fields validate() walked.
    User.set('tick', 1);
    Domma.models.flush();
    expect(body).toHaveBeenCalledTimes(2);

    stop();
  });

  it('Models - toJSON() does not link the model into a running computation', () => {
    // Serialisation is not a dependency. component-factory relies on this: a
    // render effect that serialises the model must not thereby subscribe to
    // every field it never displays.
    const User = Domma.models.create({
      tick: {type: 'number'},
      name: {type: 'string'},
      age: {type: 'number'}
    }, {tick: 0, name: 'Alice', age: 30});

    const body = vi.fn(() => {
      User.get('tick');
      User.toJSON();
    });

    const stop = Domma.models.effect(body);
    expect(body).toHaveBeenCalledTimes(1);

    User.set('name', 'Bob');
    User.set('age', 31);
    Domma.models.flush();
    expect(body).toHaveBeenCalledTimes(1);

    User.set('tick', 1);               // guard against a vacuous assertion
    Domma.models.flush();
    expect(body).toHaveBeenCalledTimes(2);

    stop();
  });

  it('Models - tracked() view can be spread', () => {
    // component-factory exposes the tracked proxy as `this.data`, and spreading
    // it is ordinary usage. A proxy with an ownKeys trap but no matching
    // getOwnPropertyDescriptor trap throws on spread, so both are required.
    const User = Domma.models.create({
      name: {type: 'string'},
      age: {type: 'number'}
    }, {name: 'Alice', age: 30});

    const state = User.tracked();

    expect({...state}).toEqual({name: 'Alice', age: 30});
    expect(Object.keys(state)).toEqual(['name', 'age']);

    User.set('age', 31);
    expect({...state}).toEqual({name: 'Alice', age: 31});
  });

  it('Models - validation required should throw error when setting invalid value', () => {
    const User = Domma.models.create({
      name: {type: 'string', required: true}
    });
    expect(() => User.set('name', '')).toThrow('Validation failed for name: Required field is empty');
  });

  it('Models - validation passes', () => {
    const User = Domma.models.create({
      name: {type: 'string', required: true}
    });
    User.set('name', 'Valid Name');
    const validation = User.validate();
    expect(validation.valid).toBe(true);
    expect(validation.errors).toEqual([]); // Expect empty array for no errors
  });

  it('Models - reset to defaults', () => {
    const User = Domma.models.create({
      name: {type: 'string', default: 'Default'}
    });
    User.set('name', 'Changed');
    User.reset();
    expect(User.get('name')).toBe('Default');
  });

  it('Models - tracked() proxy tracks reads and routes writes through validation', () => {
    // Ported from the retired src/reactive.test.js. Read tracking is exercised
    // indirectly by component-factory.test.js, but nothing outside that retired
    // file asserted that a write through the proxy goes via set() - and so
    // still validates, notifies and persists - rather than poking the
    // observable directly.
    const model = Domma.models.create({count: {type: 'number', min: 0}}, {count: 1});
    const state = model.tracked();
    const seen = [];
    const onChangeSpy = vi.fn();

    const stop = Domma.models.effect(() => seen.push(state.count));
    expect(seen).toEqual([1]);

    model.onChange(onChangeSpy);
    state.count = 5;                                  // write-through
    expect(model.get('count')).toBe(5);
    expect(onChangeSpy).toHaveBeenCalledTimes(1);     // routed via set(), so notified
    Domma.models.flush();
    expect(seen).toEqual([1, 5]);

    expect(() => { state.count = -1; }).toThrow();    // validation preserved
    expect(model.get('count')).toBe(5);               // and the write was rejected

    stop();
  });

  it('Models - onChange stays synchronous and per-field across a batch set', () => {
    // Ported from the retired src/reactive.test.js. Nothing else pairs onChange
    // with a batched set(), so nothing else pinned that a batch still produces
    // one synchronous call per field, in field order.
    const model = Domma.models.create({a: {}, b: {}}, {a: 0, b: 0});
    const calls = [];

    model.onChange(({field, newValue}) => calls.push([field, newValue]));
    model.set({a: 1, b: 2});

    expect(calls).toEqual([['a', 1], ['b', 2]]);
  });

  it('Models - destroying a model detaches its dependents', () => {
    // destroy() drops the observables, and the Deps go with them, so a
    // computation still reading the model is detached rather than left
    // subscribed to a corpse. Ported from the retired src/reactive.test.js,
    // which was the only place this teardown path was covered.
    const model = Domma.models.create({v: {}}, {v: 0});
    const body = vi.fn(() => model.get('v'));

    const stop = Domma.models.effect(body);
    expect(body).toHaveBeenCalledTimes(1);

    model.destroy();
    model.set('v', 1);
    Domma.models.flush();
    expect(body).toHaveBeenCalledTimes(1);

    stop();
  });

  it('Models - M.observable holds a value and is tracked', () => {
    const count = Domma.models.observable(2);
    expect(count.value).toBe(2);

    const doubled = Domma.models.computed(() => count.value * 2);
    expect(doubled.get()).toBe(4);

    count.value = 5;
    expect(doubled.get()).toBe(10);
  });

  // M.observable is re-exported from domma-reactive untouched, so it is read
  // through `.value`. M.computed is a facade - get/peek/dispose - and had no
  // `.value` at all, which made the two halves of the same idea disagree about
  // how you read them, and made a computed unreadable from a template
  // expression, where a method cannot be called.
  it('Models - M.computed().value is the same read as get()', () => {
    const count = Domma.models.observable(2);
    const doubled = Domma.models.computed(() => count.value * 2);

    expect(doubled.value).toBe(4);
    expect(doubled.value).toBe(doubled.get());

    count.value = 5;
    expect(doubled.value).toBe(10);

    doubled.dispose();
  });

  it('Models - M.computed().value registers a dependency', async () => {
    const count = Domma.models.observable(1);
    const doubled = Domma.models.computed(() => count.value * 2);

    const seen = [];
    const stop = Domma.models.effect(() => seen.push(doubled.value));

    count.value = 3;
    Domma.models.flush();

    expect(seen).toEqual([2, 6]);
    stop();
    doubled.dispose();
  });

  it('Models - M.observable peek() does not register a dependency', () => {
    const v = Domma.models.observable(1);
    const body = vi.fn(() => v.peek());
    const stop = Domma.models.effect(body);

    v.value = 2;
    Domma.models.flush();
    expect(body).toHaveBeenCalledTimes(1);

    stop();
  });

  it('Models - M.observableArray notifies on push', () => {
    const items = Domma.models.observableArray([]);
    const body = vi.fn(() => items.value.length);
    const stop = Domma.models.effect(body);
    expect(body).toHaveBeenCalledTimes(1);

    items.push('a');
    Domma.models.flush();
    expect(body).toHaveBeenCalledTimes(2);
    expect(items.value).toEqual(['a']);

    stop();
  });

  it('Models - pub/sub subscribe and publish', () => {
    const subscriberSpy = vi.fn();
    Domma.models.subscribe('test-event', subscriberSpy);
    Domma.models.publish('test-event', {message: 'hello'});
    expect(subscriberSpy).toHaveBeenCalledTimes(1);
    expect(subscriberSpy).toHaveBeenCalledWith({message: 'hello'});
  });

  it('Models - pub/sub once', () => {
    const onceSpy = vi.fn();
    Domma.models.once('once-event', onceSpy);
    Domma.models.publish('once-event');
    Domma.models.publish('once-event'); // Should not trigger again
    expect(onceSpy).toHaveBeenCalledTimes(1);
  });

  // ── Surfaced from domma-reactive 0.5.x ──────────────────────────────────────
  //
  // Two things arrived in the package that M did not pass on. `.extend()` works
  // on M.observable already, because that is re-exported untouched - but the
  // registry behind it was unreachable, so a consumer could use the three
  // built-in extenders and never add a fourth. And M.computed is a facade with
  // no setter, so a writable computed constructed through it could be read and
  // not written, which is the half that makes it worth having.

  it('Models - M.observable().extend() layers on behaviour', () => {
    const count = Domma.models.observable(1);
    expect(count.extend({notify: 'always'})).toBe(count);

    const seen = [];
    count.subscribe((v) => seen.push(v));

    count.value = 1;                     // equal - normally silent
    expect(seen).toEqual([1]);
  });

  it('Models - M.registerExtender adds one usable through .extend()', () => {
    const log = [];
    Domma.models.registerExtender('trace', (control, label) => {
      control.intercept((next) => (value) => {
        log.push(`${label}:${value}`);
        next(value);
      });
    });

    try {
      const count = Domma.models.observable(0).extend({trace: 'count'});
      count.value = 5;
      expect(log).toEqual(['count:5']);
    } finally {
      Domma.models.unregisterExtender('trace');
    }
  });

  it('Models - M.unregisterExtender reports whether it removed anything', () => {
    Domma.models.registerExtender('trace', () => {});
    expect(Domma.models.unregisterExtender('trace')).toBe(true);
    expect(Domma.models.unregisterExtender('trace')).toBe(false);
  });

  it('Models - M.computed({read, write}) can be written through', () => {
    const celsius = Domma.models.observable(100);

    const fahrenheit = Domma.models.computed({
      read: () => celsius.value * 9 / 5 + 32,
      write: (f) => { celsius.value = (f - 32) * 5 / 9; }
    });

    expect(fahrenheit.value).toBe(212);

    fahrenheit.value = 32;
    expect(celsius.value).toBe(0);
    expect(fahrenheit.value).toBe(32);
  });

  it('Models - M.computed().set() is the same write', () => {
    const n = Domma.models.observable(1);
    const double = Domma.models.computed({
      read: () => n.value * 2,
      write: (v) => { n.value = v / 2; }
    });

    double.set(10);
    expect(n.value).toBe(5);
  });

  it('Models - writing to a read-only M.computed warns and changes nothing', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const total = Domma.models.computed(() => 7);

    total.value = 99;

    expect(total.value).toBe(7);
    expect(warn).toHaveBeenCalledTimes(1);
    warn.mockRestore();
  });
});
