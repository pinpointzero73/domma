/**
 * A type check for a field's value (`M.types.*`).
 * @callback TypeValidator
 * @param {any} value
 * @returns {boolean}
 */
/**
 * One field of a blueprint. Forms (`F.create`) read further keys from the same object
 * (`label`, `options`, `formConfig`, ...), so any other key is allowed.
 * @typedef {object} FieldDefinition
 * @property {'string'|'number'|'boolean'|'array'|'object'|'date'|'any'|(string & {})} [type] Checked with
 *   `M.types[type]` when the value is not empty; a type with no validator (e.g. a form's `email`) is not checked
 * @property {any} [default] Initial value when the data gives none (otherwise `null`)
 * @property {boolean} [required] `null`, `undefined` and `''` fail
 * @property {number} [min] Minimum, for a number value
 * @property {number} [max] Maximum, for a number value
 * @property {number} [minLength] Minimum length, for a string value
 * @property {number} [maxLength] Maximum length, for a string value
 * @property {RegExp} [pattern] Pattern a string value must match
 * @property {(value: any) => boolean|string|void} [validate] Custom check: `false` fails, a string fails with
 *   that message, anything else passes
 */
/**
 * A blueprint: field name -> definition.
 * @typedef {{[field: string]: FieldDefinition & {[key: string]: any}}} Schema
 */
/**
 * @typedef {object} ValidationResult
 * @property {boolean} valid
 * @property {Array<{field: string, error: string}>} errors
 */
/**
 * @typedef {object} ModelOptions
 * @property {string} [persist] localStorage key (stored as `model:<persist>`); loaded on creation and saved on change
 * @property {boolean} [autoSave=true] Save on every change when `persist` is set
 */
/**
 * @typedef {object} ChangeEvent
 * @property {string} field
 * @property {any} newValue
 * @property {any} oldValue
 * @property {Model} model
 */
/**
 * @callback ChangeCallback
 * @param {ChangeEvent} event
 * @returns {void}
 */
/**
 * @callback FieldChangeCallback
 * @param {any} newValue
 * @param {any} oldValue
 * @param {Model} model
 * @returns {void}
 */
/** @typedef {() => void} UnsubscribeFn */
/**
 * Options for `M.bind()`.
 * @typedef {object} BindingOptions
 * @property {(value: any) => any} [format] Model value -> what the element shows
 * @property {(value: any) => any} [parse] Element value -> what the model stores (two-way only)
 * @property {boolean} [twoWay=false] Write the element's input back to the model
 */
/**
 * A single reactive value (`M.observable()`), from domma-reactive.
 * @template [T=any]
 * @typedef {import('../vendor/domma-reactive.js').Observable<T>} Observable
 */
/**
 * A reactive array (`M.observableArray()`), from domma-reactive.
 * @template [T=any]
 * @typedef {import('../vendor/domma-reactive.js').ObservableArray<T>} ObservableArray
 */
/**
 * @template [T=any]
 * @typedef {import('../vendor/domma-reactive.js').ObservableOptions<T>} ObservableOptions
 */
/**
 * A lazily-evaluated, dependency-tracked derived value (`M.computed()`).
 * @template [T=any]
 * @typedef {object} ComputedRef
 * @property {T} value The same read as `get()`, spelled as a property - the only one a template expression can
 *   use. Assigning hands the value to the derivation's `write` (warns and changes nothing without one).
 * @property {() => T} get Current value, recomputing only if a dependency changed
 * @property {(next: T) => void} set Imperative alias for assigning `.value`
 * @property {() => T} peek Current value without registering a dependency on the caller
 * @property {() => void} dispose Unlink from the dependency graph
 */
/**
 * @template [T=any]
 * @typedef {object} ComputedOptions
 * @property {string} [label] Debug label used in warnings
 * @property {(value: T, computation: import('../vendor/domma-reactive.js').Computation<T>) => void} [onChange] Called with the
 *   new value whenever it changes
 */
/**
 * A writable computed: where a write should land.
 * @template T
 * @typedef {object} WritableComputedDefinition
 * @property {() => T} read
 * @property {(next: T) => void} write
 */
/**
 * @typedef {object} EffectOptions
 * @property {string} [label] Debug label used in warnings
 */
/**
 * Options for `M.applyBindings()`.
 * @typedef {object} ApplyBindingsOptions
 * @property {Record<string, (...args: any[]) => any>} [methods] Handlers for `data-on-*`. Looked up only when the
 *   data has no such key.
 * @property {import('../vendor/domma-reactive.js').RenderFn} [render] Template renderer for `data-each` item bodies.
 *   Defaults to `utils.render`.
 * @property {string} [template] A name for this subtree, used in warnings
 */
/**
 * One activated binding record, from domma-reactive. `deps` are the names its expression reads.
 * @typedef {import('../vendor/domma-reactive.js').Binding} ActiveBinding
 */
/**
 * What `M.applyBindings()` returns; call `dispose()` when the markup is done with.
 * @typedef {import('../vendor/domma-reactive.js').BindingsHandle} BindingHandle
 */
/**
 * A binding kind for `M.registerBinding()`. Only `update` is required.
 * @typedef {import('../vendor/domma-reactive.js').BindingHandler} BindingHandler
 */
/**
 * A named store (`M.store()`).
 * @typedef {object} Store
 * @property {Record<string, any>} state The current state (replaced, never mutated, by setState)
 * @property {Set<(state: Record<string, any>, oldState: Record<string, any>) => void>} listeners
 * @property {() => Record<string, any>} getState Get a copy of the current state
 * @property {(updates: Record<string, any>) => void} setState Merge partial updates and notify
 * @property {(listener: (state: Record<string, any>, oldState: Record<string, any>) => void) => () => boolean} subscribe
 *   Subscribe to state changes; returns the unsubscribe function
 * @property {(newState?: Record<string, any>) => void} reset Reset to the initial state, or to `newState`
 *   (listeners receive `{}` as the old state)
 */
/**
 * @typedef {object} TypeValidators
 * @property {TypeValidator} string
 * @property {TypeValidator} number Not NaN
 * @property {TypeValidator} boolean
 * @property {TypeValidator} array
 * @property {TypeValidator} object A non-null, non-array object
 * @property {TypeValidator} date A valid `Date`, or ISO-8601 date / date-time text
 * @property {TypeValidator} any
 */
/**
 * Reactive Model Class
 */
export class Model {
    /**
     * @param {Schema} schema Field definitions
     * @param {Record<string, any>} [data={}] Initial data values
     * @param {ModelOptions} [options={}]
     */
    constructor(schema: Schema, data?: Record<string, any>, options?: ModelOptions);
    /** @private */
    private _schema;
    /** @private */
    private _initialData;
    /** @private */
    private _bindings;
    /**
     * @type {Set<ChangeCallback>}
     * @private
     */
    private _changeCallbacks;
    /**
     * @type {Map<string, Set<FieldChangeCallback>>}
     * @private
     */
    private _fieldCallbacks;
    /**
     * @type {Map<string, Observable<any>>}
     * @private
     */
    private _fields;
    /**
     * @type {Record<string, any>|null}
     * @private
     */
    private _trackedView;
    /**
     * @type {string|null}
     * @private
     */
    private _persistKey;
    /** @private */
    private _autoSave;
    /**
     * Read a field, or the whole data object when called with no argument.
     *
     * Reads performed inside a computed or effect are tracked, so the caller is
     * re-run when that field changes. Reading the whole object tracks every
     * field currently present - the conservative choice, since the reader could
     * touch any of them.
     *
     * @overload
     * @returns {Record<string, any>} Every field
     */
    get(): Record<string, any>;
    /**
     * @overload
     * @param {string} field
     * @returns {any} The field's value (`undefined` for an unknown field)
     */
    get(field: string): any;
    /**
     * Get (creating if absent) the observable backing a field.
     *
     * Fields not declared in the schema are created on first write, matching
     * the previous behaviour where _data accepted any key.
     *
     * @param {string} name
     * @returns {Observable<any>}
     * @private
     */
    private _field;
    /**
     * Plain-object view of every field, read WITHOUT tracking.
     *
     * Used by toJSON(), persistence and validation - render-time and
     * serialisation reads must not register dependencies.
     *
     * @returns {Record<string, any>}
     * @private
     */
    private _snapshot;
    /**
     * A read-tracked, write-through view of the model's data.
     *
     * Property reads register a dependency; property writes are routed through
     * set(), so validation, change notification and persistence all still run.
     *
     *   const state = model.tracked();
     *   M.effect(() => console.log(state.count));   // re-runs when count changes
     *   state.count = 5;                            // validated + notified
     *
     * @returns {Record<string, any>}
     */
    tracked(): Record<string, any>;
    /**
     * @overload
     * @param {string} field
     * @param {any} value
     * @returns {this}
     */
    set(field: string, value: any): this;
    /**
     * @overload
     * @param {Record<string, any>} data Several fields at once
     * @returns {this}
     */
    set(data: Record<string, any>): this;
    /**
     * @param {string} field
     * @param {any} value
     * @private
     */
    private _setField;
    /**
     * @param {string} field
     * @param {any} value
     * @returns {{valid: boolean, error?: string}}
     * @private
     */
    private _validateField;
    /**
     * Validate all fields
     * @returns {ValidationResult}
     */
    validate(): ValidationResult;
    /**
     * Get model data as a plain object (untracked)
     * @returns {Record<string, any>}
     */
    toJSON(): Record<string, any>;
    /**
     * Subscribe to changes.
     *
     *   onChange(cb)          - every field; cb receives {field, newValue, oldValue, model}
     *   onChange(field, cb)   - one field only; cb receives the same change object
     *
     * For positional arguments (newValue, oldValue, model), use onFieldChange().
     *
     * @overload
     * @param {ChangeCallback} callback
     * @returns {UnsubscribeFn}
     */
    onChange(callback: ChangeCallback): UnsubscribeFn;
    /**
     * @overload
     * @param {string} field
     * @param {ChangeCallback} callback
     * @returns {UnsubscribeFn}
     */
    onChange(field: string, callback: ChangeCallback): UnsubscribeFn;
    /**
     * Subscribe to one field's changes, with positional arguments (newValue, oldValue, model)
     * @param {string} field
     * @param {FieldChangeCallback} callback
     * @returns {UnsubscribeFn} Unsubscribe function
     */
    onFieldChange(field: string, callback: FieldChangeCallback): UnsubscribeFn;
    /**
     * @private
     */
    private _notifyChange;
    /**
     * @private
     */
    private _updateBindings;
    /**
     * @param {string} field
     * @param {Binding} binding
     * @private
     */
    private _addBinding;
    /**
     * @param {string} field
     * @param {Binding} binding
     * @private
     */
    private _removeBinding;
    /**
     * Reset every field to its initial value
     * @param {boolean} [clearStorage=false] Also clear the persisted copy
     * @returns {this}
     */
    reset(clearStorage?: boolean): this;
    /**
     * Destroy model and clean up: drops every listener, binding and observable
     * @param {boolean} [clearStorage=false] Also clear the persisted copy
     * @returns {void}
     */
    destroy(clearStorage?: boolean): void;
    /**
     * Manually save model to localStorage
     * @returns {boolean} - True if successful
     */
    save(): boolean;
    /**
     * Manually load model from localStorage
     * @returns {boolean} - True if data was loaded
     */
    load(): boolean;
    /**
     * Clear persisted data from localStorage
     * @returns {boolean} - True if successful
     */
    clearStorage(): boolean;
    /**
     * Get the persistence key
     * @returns {string|null}
     */
    getPersistKey(): string | null;
    /**
     * Check if model is persisted
     * @returns {boolean}
     */
    isPersisted(): boolean;
    /**
     * Save model data to localStorage
     * @returns {boolean}
     * @private
     */
    private _saveToStorage;
    /**
     * Load model data from localStorage
     * @returns {boolean} - True if data was loaded
     * @private
     */
    private _loadFromStorage;
}
export namespace models {
    export let _events: Map<string, Set<(data: any) => void>>;
    /**
     * Subscribe to an event
     * @param {string} event
     * @param {(data: any) => void} callback
     * @returns {UnsubscribeFn}
     */
    export function subscribe(event: string, callback: (data: any) => void): UnsubscribeFn;
    /**
     * Alias for subscribe
     * @param {string} event
     * @param {(data: any) => void} callback
     * @returns {UnsubscribeFn}
     */
    export function on(event: string, callback: (data: any) => void): UnsubscribeFn;
    /**
     * Unsubscribe from an event
     * @param {string} event
     * @param {(data: any) => void} callback
     * @returns {void}
     */
    export function unsubscribe(event: string, callback: (data: any) => void): void;
    /**
     * Alias for unsubscribe
     * @param {string} event
     * @param {(data: any) => void} callback
     * @returns {void}
     */
    export function off(event: string, callback: (data: any) => void): void;
    /**
     * Publish an event
     * @param {string} event
     * @param {any} [data]
     * @returns {void}
     */
    export function publish(event: string, data?: any): void;
    /**
     * Alias for publish
     * @param {string} event
     * @param {any} [data]
     * @returns {void}
     */
    export function emit(event: string, data?: any): void;
    /**
     * Subscribe to an event once
     * @param {string} event
     * @param {(data: any) => void} callback
     * @returns {UnsubscribeFn}
     */
    export function once(event: string, callback: (data: any) => void): UnsubscribeFn;
    /**
     * Clear one event's listeners, or every event's
     * @param {string} [event]
     * @returns {void}
     */
    export function clear(event?: string): void;
    /**
     * Create a new reactive model
     * @param {Schema} schema - Field definitions
     * @param {Record<string, any>} [initialData={}] - Initial data values
     * @param {ModelOptions} [options={}] - Options (persist, autoSave)
     * @returns {Model}
     */
    export function create(schema: Schema, initialData?: Record<string, any>, options?: ModelOptions): Model;
    /**
     * Extend a blueprint with additional fields
     * @param {...Schema} blueprints - Blueprints to merge (left-to-right)
     * @returns {Schema} - A new merged blueprint
     */
    export function extend(...blueprints: Schema[]): Schema;
    /**
     * Pick specific fields from a blueprint
     * @template {Schema} S
     * @template {keyof S & string} K
     * @param {S} blueprint - Source blueprint
     * @param {K[]} fields - Array of field names to pick
     * @returns {Pick<S, K>} - New blueprint with only specified fields
     */
    export function pick<S extends Schema, K extends keyof S & string>(blueprint: S, fields: K[]): Pick<S, K>;
    /**
     * Omit specific fields from a blueprint
     * @template {Schema} S
     * @template {keyof S & string} K
     * @param {S} blueprint - Source blueprint
     * @param {K[]} fields - Array of field names to omit
     * @returns {Omit<S, K>} - New blueprint without specified fields
     */
    export function omit<S extends Schema, K extends keyof S & string>(blueprint: S, fields: K[]): Omit<S, K>;
    export { observable };
    export { observableArray };
    /**
     * Create a lazily-evaluated derived value that tracks whatever it reads.
     *
     * The body is not run until `.get()` is called, and afterwards the cached
     * value is reused until one of the fields it read actually changes.
     *
     *   const model = M.create(blueprint, {price: 10, qty: 3});
     *   const total = M.computed(() => model.get('price') * model.get('qty'));
     *   total.get();                 // 30 - evaluated now
     *   total.get();                 // 30 - cached, body not re-run
     *   model.set('qty', 4);
     *   total.get();                 // 40 - re-evaluated on demand
     *
     * The body must be synchronous: tracking stops at the first `await`.
     *
     * A computed is read-only unless you say where a write should land:
     *
     *   const celsius = M.observable(100);
     *   const fahrenheit = M.computed({
     *       read:  () => celsius.value * 9 / 5 + 32,
     *       write: (f) => { celsius.value = (f - 32) * 5 / 9; }
     *   });
     *   fahrenheit.value = 32;       // celsius.value === 0
     *
     * That is what lets `data-model` bind a derived value. Assigning to one
     * with no `write` warns and changes nothing, rather than storing into the
     * read cache where the next recompute would silently drop it.
     *
     * @template [T=any]
     * @overload
     * @param {() => T} fn Derivation (read-only).
     * @param {ComputedOptions<T>} [options]
     * @returns {ComputedRef<T>}
     */
    export function computed<T = any>(fn: () => T, options?: ComputedOptions<T>): ComputedRef<T>;
    /**
     * @template [T=any]
     * @overload
     * @param {WritableComputedDefinition<T>} fn {read, write}: a writable computed.
     * @param {ComputedOptions<T>} [options]
     * @returns {ComputedRef<T>}
     */
    export function computed<T = any>(fn: WritableComputedDefinition<T>, options?: ComputedOptions<T>): ComputedRef<T>;
    /**
     * Run a function now, and again whenever any field it read changes.
     *
     * Dependencies are re-collected on every run, so an effect whose branches
     * change stops listening to the branch it no longer takes.
     *
     *   const stop = M.effect(() => {
     *       $('#total').text(model.get('price') * model.get('qty'));
     *   });
     *   stop();   // unsubscribe
     *
     * Re-runs are batched: a burst of writes in the same tick produces a single
     * run on the next microtask, not one per write.
     *
     * @param {() => unknown} fn          Synchronous body.
     * @param {EffectOptions} [options]
     * @returns {UnsubscribeFn} Call to stop the effect.
     */
    export function effect(fn: () => unknown, options?: EffectOptions): UnsubscribeFn;
    /**
     * Read values without registering them as dependencies of the enclosing
     * computed or effect.
     *
     * @template T
     * @param {() => T} fn
     * @returns {T}
     */
    export function untracked<T>(fn: () => T): T;
    /**
     * Settle all pending reactive work immediately rather than waiting for the
     * microtask flush. Mainly useful in tests and when code must observe a
     * derived value synchronously after a write.
     * @returns {void}
     */
    export function flush(): void;
    export let types: TypeValidators;
    /**
     * Bind a model field to DOM element(s): the element shows the field, and with `twoWay` writes back to it
     * @param {Model} model
     * @param {string} field
     * @param {string|HTMLElement} selector Selector (every match is bound) or element
     * @param {BindingOptions} [options]
     * @returns {UnsubscribeFn} Unbind function
     */
    export function bind(model: Model, field: string, selector: string | HTMLElement, options?: BindingOptions): UnsubscribeFn;
    /**
     * Bring markup that already exists to life.
     *
     * `M.bind()` wires ONE field to ONE element. This activates every binding
     * attribute under a root at once, and is the counterpart to the template
     * bindings a `Domma.component()` already gets: a component owns its markup
     * and renders it, a server-rendered page owns its markup and wants
     * behaviour added to it.
     *
     *   <div id="app">
     *     <h1 data-bind-text="title">Rendered by the server</h1>
     *     <input data-model="query">
     *     <p data-if="showHelp">Help text.</p>
     *     <button data-on-click="save">Save</button>
     *     <ul data-each="rows key=id">
     *       <li data-bind-text="name">template row</li>
     *     </ul>
     *   </div>
     *
     *   const model = M.create(blueprint, {title: 'Live', query: '', rows: []});
     *   const handle = M.applyBindings(model, '#app', {
     *       methods: { save() { H.post('/api/save', model.toJSON()); } }
     *   });
     *
     * Pass a Model and every binding reads and writes through it - `data-model`
     * lands in the model, with validation and change notification, and any
     * other binding on that field updates. A plain object works too, but only
     * the parts of it that are observable will be reactive.
     *
     * `{{ }}` is deliberately NOT interpolated in markup that already exists;
     * `data-bind-text` is the supported spelling. The one exception is the
     * contents of a `data-each`, which are a template rather than rendered
     * output. See docs/Bindings.md.
     *
     * Applying twice over the same region is safe: elements already bound are
     * skipped, with one warning naming the root.
     *
     * @param {Model|Record<string, any>} data A Model, or a plain object.
     * @param {string|Element|import('./dom.js').DommaCollection|ArrayLike<Element>} root Selector, element or
     *                                         collection (its first element).
     * @param {ApplyBindingsOptions} [options] `methods` (handlers for `data-on-*`),
     *                                         `render` (template renderer for list
     *                                         items - defaults to `utils.render`, so
     *                                         `{{ }}` inside a `data-each` behaves as
     *                                         it does everywhere else in Domma) and
     *                                         `template` (a name used in warnings).
     * @returns {BindingHandle}
     * @throws {TypeError} When no element is found for `root`.
     */
    export function applyBindings(data: Model | Record<string, any>, root: string | Element | import("./dom.js").DommaCollection | ArrayLike<Element>, options?: ApplyBindingsOptions): BindingHandle;
    /**
     * Add a binding kind, usable as `data-<name>` wherever bindings are.
     *
     * Not a side door: every built-in - text, attr, raw, if, event, bind,
     * model - is registered through this same function, so a custom binding can
     * do anything a built-in can.
     *
     *   M.registerBinding('uppercase', {
     *       attribute: 'data-uppercase',
     *       expression: true,   // parse the attribute value
     *       tracks: true,       // re-run when what it reads changes
     *       primes: true,       // run once after the first paint
     *       update({binding, nodes, context}) {
     *           const value = binding.evaluate(context);
     *           for (const el of nodes) el.textContent = String(value).toUpperCase();
     *           return true;
     *       }
     *   });
     *   // <p data-uppercase="name"></p>
     *
     * `update` receives every node the binding owns at once, not one per call,
     * so a handler that re-renders a region does so once however many regions
     * it owns.
     *
     * @template {BindingHandler} H
     * @param {string} name    The binding kind, which becomes `binding.kind`.
     * @param {H} handler `{attribute|attributePrefix, expression, tracks,
     *                         region, capturesBody, primes, update, attach,
     *                         detach}` - see docs/Bindings.md.
     * @returns {H} The handler
     */
    export function registerBinding<H extends BindingHandler>(name: string, handler: H): H;
    /**
     * Remove a binding kind added with registerBinding().
     *
     * @param {string} name
     * @returns {boolean} whether anything was removed
     */
    export function unregisterBinding(name: string): boolean;
    /**
     * Add an extender, callable as `M.observable(x).extend({name: value})`.
     *
     * `rateLimit`, `throttle` and `notify` are registered through this same
     * function, so an extender you add is not a second-class citizen - the
     * built-ins have no privileged path.
     *
     *   M.registerExtender('trace', (control, label) => {
     *       control.intercept((next) => (value) => {
     *           console.log(label, value);
     *           next(value);
     *       });
     *   });
     *
     *   const count = M.observable(0).extend({trace: 'count'});
     *
     * The control surface an extender is handed has exactly two powers:
     * `setEquals(fn)` replaces the change gate, and `intercept(wrap)` wraps the
     * announcement. Neither can touch the stored value, which is what keeps the
     * guarantee that a write always lands immediately - even under a rate
     * limit, where only the notification waits.
     *
     * @template {import('../vendor/domma-reactive.js').Extender} F
     * @param {string}   name
     * @param {F} fn `(control, value) => void`
     * @returns {F} The extender
     */
    export function registerExtender<F extends import("../vendor/domma-reactive.js").Extender>(name: string, fn: F): F;
    /**
     * Remove an extender added with registerExtender().
     * The built-ins are refused.
     *
     * @param {string} name
     * @returns {boolean} whether anything was removed
     */
    export function unregisterExtender(name: string): boolean;
    /**
     * Add a function callable from a binding expression.
     *
     * Expressions cannot call methods on your data - `{{total.get()}}` will not
     * parse - because arbitrary calls are how an expression language turns into
     * an execution surface. A registered helper is the supported way to shape a
     * value in the markup:
     *
     *   M.registerHelper('upper', (s) => String(s).toUpperCase());
     *   // <p data-bind-text="upper(name)"></p>
     *
     * Helpers are shared by every binding and every component template.
     *
     * @template {(...args: any[]) => unknown} F
     * @param {string}   name
     * @param {F} fn   Pure, synchronous.
     * @returns {F} The helper
     */
    export function registerHelper<F extends (...args: any[]) => unknown>(name: string, fn: F): F;
    /**
     * Remove a helper added with registerHelper().
     *
     * @param {string} name
     * @returns {boolean} whether anything was removed
     */
    export function unregisterHelper(name: string): boolean;
    export let _stores: Map<string, Store>;
    /**
     * Get or create a named store (`initialState` is used only when it is created)
     * @param {string} name
     * @param {Record<string, any>} [initialState={}]
     * @returns {Store}
     */
    export function store(name: string, initialState?: Record<string, any>): Store;
    /**
     * Get an existing store
     * @param {string} name
     * @returns {Store|undefined}
     */
    export function getStore(name: string): Store | undefined;
    /**
     * Remove a store
     * @param {string} name
     * @returns {void}
     */
    export function removeStore(name: string): void;
}
/**
 * A type check for a field's value (`M.types.*`).
 */
export type TypeValidator = (value: any) => boolean;
/**
 * One field of a blueprint. Forms (`F.create`) read further keys from the same object
 * (`label`, `options`, `formConfig`, ...), so any other key is allowed.
 */
export type FieldDefinition = {
    /**
     * Checked with
     * `M.types[type]` when the value is not empty; a type with no validator (e.g. a form's `email`) is not checked
     */
    type?: "string" | "number" | "boolean" | "array" | "object" | "date" | "any" | (string & {});
    /**
     * Initial value when the data gives none (otherwise `null`)
     */
    default?: any;
    /**
     * `null`, `undefined` and `''` fail
     */
    required?: boolean;
    /**
     * Minimum, for a number value
     */
    min?: number;
    /**
     * Maximum, for a number value
     */
    max?: number;
    /**
     * Minimum length, for a string value
     */
    minLength?: number;
    /**
     * Maximum length, for a string value
     */
    maxLength?: number;
    /**
     * Pattern a string value must match
     */
    pattern?: RegExp;
    /**
     * Custom check: `false` fails, a string fails with
     * that message, anything else passes
     */
    validate?: (value: any) => boolean | string | void;
};
/**
 * A blueprint: field name -> definition.
 */
export type Schema = {
    [field: string]: FieldDefinition & {
        [key: string]: any;
    };
};
export type ValidationResult = {
    valid: boolean;
    errors: Array<{
        field: string;
        error: string;
    }>;
};
export type ModelOptions = {
    /**
     * localStorage key (stored as `model:<persist>`); loaded on creation and saved on change
     */
    persist?: string;
    /**
     * Save on every change when `persist` is set
     */
    autoSave?: boolean;
};
export type ChangeEvent = {
    field: string;
    newValue: any;
    oldValue: any;
    model: Model;
};
export type ChangeCallback = (event: ChangeEvent) => void;
export type FieldChangeCallback = (newValue: any, oldValue: any, model: Model) => void;
export type UnsubscribeFn = () => void;
/**
 * Options for `M.bind()`.
 */
export type BindingOptions = {
    /**
     * Model value -> what the element shows
     */
    format?: (value: any) => any;
    /**
     * Element value -> what the model stores (two-way only)
     */
    parse?: (value: any) => any;
    /**
     * Write the element's input back to the model
     */
    twoWay?: boolean;
};
/**
 * A single reactive value (`M.observable()`), from domma-reactive.
 */
export type Observable<T = any> = import("../vendor/domma-reactive.js").Observable<T>;
/**
 * A reactive array (`M.observableArray()`), from domma-reactive.
 */
export type ObservableArray<T = any> = import("../vendor/domma-reactive.js").ObservableArray<T>;
export type ObservableOptions<T = any> = import("../vendor/domma-reactive.js").ObservableOptions<T>;
/**
 * A lazily-evaluated, dependency-tracked derived value (`M.computed()`).
 */
export type ComputedRef<T = any> = {
    /**
     * The same read as `get()`, spelled as a property - the only one a template expression can
     * use. Assigning hands the value to the derivation's `write` (warns and changes nothing without one).
     */
    value: T;
    /**
     * Current value, recomputing only if a dependency changed
     */
    get: () => T;
    /**
     * Imperative alias for assigning `.value`
     */
    set: (next: T) => void;
    /**
     * Current value without registering a dependency on the caller
     */
    peek: () => T;
    /**
     * Unlink from the dependency graph
     */
    dispose: () => void;
};
export type ComputedOptions<T = any> = {
    /**
     * Debug label used in warnings
     */
    label?: string;
    /**
     * Called with the
     * new value whenever it changes
     */
    onChange?: (value: T, computation: import("../vendor/domma-reactive.js").Computation<T>) => void;
};
/**
 * A writable computed: where a write should land.
 */
export type WritableComputedDefinition<T> = {
    read: () => T;
    write: (next: T) => void;
};
export type EffectOptions = {
    /**
     * Debug label used in warnings
     */
    label?: string;
};
/**
 * Options for `M.applyBindings()`.
 */
export type ApplyBindingsOptions = {
    /**
     * Handlers for `data-on-*`. Looked up only when the
     * data has no such key.
     */
    methods?: Record<string, (...args: any[]) => any>;
    /**
     * Template renderer for `data-each` item bodies.
     * Defaults to `utils.render`.
     */
    render?: import("../vendor/domma-reactive.js").RenderFn;
    /**
     * A name for this subtree, used in warnings
     */
    template?: string;
};
/**
 * One activated binding record, from domma-reactive. `deps` are the names its expression reads.
 */
export type ActiveBinding = import("../vendor/domma-reactive.js").Binding;
/**
 * What `M.applyBindings()` returns; call `dispose()` when the markup is done with.
 */
export type BindingHandle = import("../vendor/domma-reactive.js").BindingsHandle;
/**
 * A binding kind for `M.registerBinding()`. Only `update` is required.
 */
export type BindingHandler = import("../vendor/domma-reactive.js").BindingHandler;
/**
 * A named store (`M.store()`).
 */
export type Store = {
    /**
     * The current state (replaced, never mutated, by setState)
     */
    state: Record<string, any>;
    listeners: Set<(state: Record<string, any>, oldState: Record<string, any>) => void>;
    /**
     * Get a copy of the current state
     */
    getState: () => Record<string, any>;
    /**
     * Merge partial updates and notify
     */
    setState: (updates: Record<string, any>) => void;
    /**
     *   Subscribe to state changes; returns the unsubscribe function
     */
    subscribe: (listener: (state: Record<string, any>, oldState: Record<string, any>) => void) => () => boolean;
    /**
     * Reset to the initial state, or to `newState`
     * (listeners receive `{}` as the old state)
     */
    reset: (newState?: Record<string, any>) => void;
};
export type TypeValidators = {
    string: TypeValidator;
    /**
     * Not NaN
     */
    number: TypeValidator;
    boolean: TypeValidator;
    array: TypeValidator;
    /**
     * A non-null, non-array object
     */
    object: TypeValidator;
    /**
     * A valid `Date`, or ISO-8601 date / date-time text
     */
    date: TypeValidator;
    any: TypeValidator;
};
/**
 * The models module (`M`): pub/sub, reactive models, dependency-tracked reactivity, DOM bindings and stores.
 */
export type Models = typeof models;
import { observable } from '../vendor/domma-reactive.js';
import { observableArray } from '../vendor/domma-reactive.js';
