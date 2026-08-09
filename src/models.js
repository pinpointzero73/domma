/**
 * Domma Models Module
 * Pub/Sub events and reactive data binding
 */

import {utils} from './utils.js';
import {storage} from './storage.js';
import {createBindingSource} from './binding-source.js';
import {
    observable,
    observableArray,
    computed as createComputed,
    effect as createEffect,
    untracked as runUntracked,
    flushSync as flushReactive,
    applyBindings as applyDomBindings,
    registerBinding as addBindingKind,
    unregisterBinding as removeBindingKind,
    registerHelper as addExpressionHelper,
    unregisterHelper as removeExpressionHelper,
    registerExtender as addExtender,
    unregisterExtender as removeExtender
} from 'domma-reactive';

/**
 * Domma's deep-equality check, bound to its receiver.
 *
 * utils.isEqual recurses through `this.isEqual`, so handing the bare method to
 * an observable as its comparator would lose the receiver and throw on any
 * nested object or array. Every equality decision in this module goes through
 * this wrapper so the model's change-detection semantics stay exactly those of
 * utils.isEqual — deliberately NOT domma-reactive's own isEqual, which differs
 * for NaN, Dates, class instances, Map/Set/RegExp and typed arrays.
 *
 * @param {*} a
 * @param {*} b
 * @returns {boolean}
 */
const isEqual = (a, b) => utils.isEqual(a, b);

/**
 * Reactive Model Class
 */
class Model {
    constructor(schema, data = {}, options = {}) {
        this._schema = schema;
        this._initialData = {};
        this._bindings = new Map();
        this._changeCallbacks = new Set();
        this._fieldCallbacks = new Map();

        // One observable per field, created up front from the schema and on
        // first write for undeclared fields. Reads via get()/tracked() register
        // against the running computation; writes via _setField() trigger it.
        //
        // utils.isEqual is passed as the equality gate so change detection stays
        // byte-identical to the previous DepMap implementation, which compared
        // with utils.isEqual before notifying.
        /** @type {Map<string, {value: *, peek: Function, set: Function}>} */
        this._fields = new Map();
        this._trackedView = null;

        // Persistence configuration
        this._persistKey = options.persist || null;
        this._autoSave = options.autoSave !== false; // Default true when persist is set

        // Initialise with defaults and provided data
        for (const field in schema) {
            const fieldDef = schema[field];
            const defaultVal = fieldDef.default !== undefined ? fieldDef.default : null;
            const initial = data[field] !== undefined ? data[field] : defaultVal;
            this._fields.set(field, observable(initial, {equals: isEqual}));
            this._initialData[field] = initial;
        }

        // Load from storage if persist key provided (overrides initial data)
        if (this._persistKey) {
            this._loadFromStorage();
        }
    }

    /**
     * Read a field, or the whole data object when called with no argument.
     *
     * Reads performed inside a computed or effect are tracked, so the caller is
     * re-run when that field changes. Reading the whole object tracks every
     * field currently present — the conservative choice, since the reader could
     * touch any of them.
     *
     * @param {string} [field]
     * @returns {*}
     */
    get(field) {
        if (field) {
            const obs = this._fields.get(field);
            return obs ? obs.value : undefined;
        }

        // No argument: tracks every field, as before
        const out = {};
        for (const [key, obs] of this._fields) out[key] = obs.value;
        return out;
    }

    /**
     * Get (creating if absent) the observable backing a field.
     *
     * Fields not declared in the schema are created on first write, matching
     * the previous behaviour where _data accepted any key.
     *
     * @param {string} name
     * @returns {{value: *, peek: Function, set: Function}}
     * @private
     */
    _field(name) {
        let obs = this._fields.get(name);
        if (!obs) {
            obs = observable(null, {equals: isEqual});
            this._fields.set(name, obs);
        }
        return obs;
    }

    /**
     * Plain-object view of every field, read WITHOUT tracking.
     *
     * Used by toJSON(), persistence and validation — render-time and
     * serialisation reads must not register dependencies.
     *
     * @returns {Object}
     * @private
     */
    _snapshot() {
        const out = {};
        for (const [key, obs] of this._fields) out[key] = obs.peek();
        return out;
    }

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
     * @returns {Proxy}
     */
    tracked() {
        if (!this._trackedView) {
            const self = this;
            this._trackedView = new Proxy({}, {
                get(_, key) {
                    if (typeof key !== 'string') return undefined;
                    const obs = self._fields.get(key);
                    return obs ? obs.value : undefined;
                },

                set(_, key, value) {
                    if (typeof key === 'string') self._setField(key, value);
                    return true;
                },

                // Reading .value rather than consulting the Map keeps `'x' in state`
                // a tracked read, as it was under trackingProxy — an `in` check
                // inside a computed stays reactive to that field changing.
                has(_, key) {
                    if (typeof key !== 'string') return false;
                    const obs = self._fields.get(key);
                    if (!obs) return false;
                    obs.value;
                    return true;
                },

                ownKeys() {
                    return [...self._fields.keys()];
                },

                // Required: without it, spreading the proxy ({...state}) throws.
                getOwnPropertyDescriptor() {
                    return {enumerable: true, configurable: true};
                }
            });
        }
        return this._trackedView;
    }

    set(field, value) {
        if (typeof field === 'object') {
            // Batch set
            for (const key in field) {
                this._setField(key, field[key]);
            }
        } else {
            this._setField(field, value);
        }
        return this;
    }

    _setField(field, value) {
        const obs = this._field(field);
        // Captured before the write: the observable holds only the new value
        // afterwards, and oldValue drives both change detection and the
        // arguments handed to onChange/onFieldChange callbacks.
        const oldValue = obs.peek();

        // Validate if schema exists for field
        if (this._schema[field]) {
            const validation = this._validateField(field, value);
            if (!validation.valid) {
                throw new Error(`Validation failed for ${field}: ${validation.error}`);
            }
        }

        const changed = !isEqual(oldValue, value);

        // The observable applies the same comparator, so this triggers its Dep
        // only on a real change — queueing dependent computations for the next
        // microtask flush.
        obs.value = value;

        // Notify if changed
        if (changed) {
            // Synchronous listeners — onChange/onFieldChange semantics and DOM
            // bindings are unchanged.
            this._notifyChange(field, value, oldValue);
            this._updateBindings(field, value);

            // Auto-save to storage if persistence enabled
            if (this._persistKey && this._autoSave) {
                this._saveToStorage();
            }
        }
    }

    _validateField(field, value) {
        const def = this._schema[field];

        if (def.required && (value === null || value === undefined || value === '')) {
            return {valid: false, error: 'Required field is empty'};
        }

        if (value !== null && value !== undefined && def.type) {
            const typeCheck = models.types[def.type];
            if (typeCheck && !typeCheck(value)) {
                return {valid: false, error: `Expected type ${def.type}`};
            }
        }

        if (def.min !== undefined && typeof value === 'number' && value < def.min) {
            return {valid: false, error: `Value must be at least ${def.min}`};
        }

        if (def.max !== undefined && typeof value === 'number' && value > def.max) {
            return {valid: false, error: `Value must be at most ${def.max}`};
        }

        if (def.minLength !== undefined && typeof value === 'string' && value.length < def.minLength) {
            return {valid: false, error: `Length must be at least ${def.minLength}`};
        }

        if (def.maxLength !== undefined && typeof value === 'string' && value.length > def.maxLength) {
            return {valid: false, error: `Length must be at most ${def.maxLength}`};
        }

        if (def.pattern && typeof value === 'string' && !def.pattern.test(value)) {
            return {valid: false, error: 'Value does not match pattern'};
        }

        if (def.validate && typeof def.validate === 'function') {
            const result = def.validate(value);
            if (result === false) {
                return {valid: false, error: 'Custom validation failed'};
            }
            if (typeof result === 'string') {
                return {valid: false, error: result};
            }
        }

        return {valid: true};
    }

    validate() {
        const errors = [];
        const data = this._snapshot();

        for (const field in this._schema) {
            const validation = this._validateField(field, data[field]);
            if (!validation.valid) {
                errors.push({field, error: validation.error});
            }
        }

        return {
            valid: errors.length === 0,
            errors
        };
    }

    toJSON() {
        // Serialisation is not a dependency: untracked so a computation that
        // happens to call toJSON() is not linked to every field.
        return runUntracked(() => this._snapshot());
    }

    /**
     * Subscribe to changes.
     *
     *   onChange(cb)          — every field; cb receives {field, newValue, oldValue, model}
     *   onChange(field, cb)   — one field only; cb receives the same change object
     *
     * For positional arguments (newValue, oldValue, model), use onFieldChange().
     *
     * @param {string|Function} fieldOrCallback
     * @param {Function} [maybeCallback]
     * @returns {Function} Unsubscribe function
     */
    onChange(fieldOrCallback, maybeCallback) {
        // Field-scoped overload
        if (typeof fieldOrCallback === 'string') {
            if (typeof maybeCallback !== 'function') {
                throw new TypeError(
                    `Model.onChange('${fieldOrCallback}', callback) requires a callback function`
                );
            }

            const field = fieldOrCallback;
            const wrapper = (change) => {
                if (change.field === field) maybeCallback(change);
            };

            this._changeCallbacks.add(wrapper);
            return () => this._changeCallbacks.delete(wrapper);
        }

        if (typeof fieldOrCallback !== 'function') {
            throw new TypeError(
                'Model.onChange expects a callback, or (field, callback)'
            );
        }

        this._changeCallbacks.add(fieldOrCallback);
        return () => this._changeCallbacks.delete(fieldOrCallback);
    }

    onFieldChange(field, callback) {
        if (!this._fieldCallbacks.has(field)) {
            this._fieldCallbacks.set(field, new Set());
        }
        this._fieldCallbacks.get(field).add(callback);
        // Optional chaining: destroy() clears _fieldCallbacks, and callers
        // commonly unsubscribe during their own teardown, after the model has
        // already gone.
        return () => this._fieldCallbacks.get(field)?.delete(callback);
    }

    _notifyChange(field, newValue, oldValue) {
        // Notify general callbacks
        for (const cb of this._changeCallbacks) {
            cb({field, newValue, oldValue, model: this});
        }

        // Notify field-specific callbacks
        if (this._fieldCallbacks.has(field)) {
            for (const cb of this._fieldCallbacks.get(field)) {
                cb(newValue, oldValue, this);
            }
        }
    }

    _updateBindings(field, value) {
        if (this._bindings.has(field)) {
            for (const binding of this._bindings.get(field)) {
                binding.update(value);
            }
        }
    }

    _addBinding(field, binding) {
        if (!this._bindings.has(field)) {
            this._bindings.set(field, new Set());
        }
        this._bindings.get(field).add(binding);
    }

    _removeBinding(field, binding) {
        if (this._bindings.has(field)) {
            this._bindings.get(field).delete(binding);
        }
    }

    reset(clearStorage = false) {
        for (const field in this._initialData) {
            this.set(field, utils.cloneDeep(this._initialData[field]));
        }

        if (clearStorage && this._persistKey) {
            this.clearStorage();
        }

        return this;
    }

    destroy(clearStorage = false) {
        if (clearStorage && this._persistKey) {
            this.clearStorage();
        }

        this._changeCallbacks.clear();
        this._fieldCallbacks.clear();
        this._bindings.clear();
        // Dropping the observables drops their Deps with them, detaching every
        // computation that was reading this model.
        this._fields.clear();
        this._trackedView = null;
    }

    // ============================================
    // Persistence Methods
    // ============================================

    /**
     * Manually save model to localStorage
     * @returns {boolean} - True if successful
     */
    save() {
        return this._saveToStorage();
    }

    /**
     * Manually load model from localStorage
     * @returns {boolean} - True if data was loaded
     */
    load() {
        return this._loadFromStorage();
    }

    /**
     * Clear persisted data from localStorage
     * @returns {boolean} - True if successful
     */
    clearStorage() {
        if (!this._persistKey) return false;
        return storage.remove(`model:${this._persistKey}`);
    }

    /**
     * Get the persistence key
     * @returns {string|null}
     */
    getPersistKey() {
        return this._persistKey;
    }

    /**
     * Check if model is persisted
     * @returns {boolean}
     */
    isPersisted() {
        return this._persistKey !== null;
    }

    /**
     * Save model data to localStorage
     * @returns {boolean}
     * @private
     */
    _saveToStorage() {
        if (!this._persistKey) return false;

        try {
            return storage.set(`model:${this._persistKey}`, this._snapshot());
        } catch (e) {
            console.warn('Domma Model: Failed to save to storage', e);
            return false;
        }
    }

    /**
     * Load model data from localStorage
     * @returns {boolean} - True if data was loaded
     * @private
     */
    _loadFromStorage() {
        if (!this._persistKey) return false;

        try {
            const stored = storage.get(`model:${this._persistKey}`);

            if (stored && typeof stored === 'object') {
                // Merge stored data with current (stored takes precedence)
                for (const field in stored) {
                    if (this._schema[field] !== undefined) {
                        this._field(field).value = stored[field];
                    }
                }
                return true;
            }
            return false;
        } catch (e) {
            console.warn('Domma Model: Failed to load from storage', e);
            return false;
        }
    }
}

/**
 * Binding class for DOM elements
 */
class Binding {
    constructor(model, field, element, options = {}) {
        this.model = model;
        this.field = field;
        this.element = element;
        this.options = options;
        this.format = options.format || (v => v);
        this.parse = options.parse || (v => v);
        this.twoWay = options.twoWay || false;
        this._eventHandler = null;

        // Initial update
        this.update(model.get(field));

        // Setup two-way binding
        if (this.twoWay) {
            this._setupTwoWay();
        }
    }

    update(value) {
        const formatted = this.format(value);
        const el = this.element;

        if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
            if (el.type === 'checkbox') {
                el.checked = Boolean(formatted);
            } else if (el.type === 'radio') {
                el.checked = el.value === String(formatted);
            } else {
                el.value = formatted !== null && formatted !== undefined ? formatted : '';
            }
        } else if (el.tagName === 'SELECT') {
            el.value = formatted;
        } else {
            el.textContent = formatted !== null && formatted !== undefined ? formatted : '';
        }
    }

    _setupTwoWay() {
        const el = this.element;
        const eventType = this._getEventType();

        this._eventHandler = (e) => {
            let value;

            if (el.type === 'checkbox') {
                value = el.checked;
            } else if (el.type === 'number' || el.type === 'range') {
                value = el.value === '' ? null : Number(el.value);
            } else {
                value = el.value;
            }

            try {
                this.model.set(this.field, this.parse(value));
            } catch (err) {
                // Validation error - could emit event or handle differently
                console.warn('Binding validation error:', err.message);
            }
        };

        el.addEventListener(eventType, this._eventHandler);
    }

    _getEventType() {
        const el = this.element;
        if (el.tagName === 'SELECT') return 'change';
        if (el.type === 'checkbox' || el.type === 'radio') return 'change';
        return 'input';
    }

    destroy() {
        if (this._eventHandler) {
            const eventType = this._getEventType();
            this.element.removeEventListener(eventType, this._eventHandler);
        }
        this.model._removeBinding(this.field, this);
    }
}

// ── applyBindings support ─────────────────────────────────────────────────────

/**
 * Whatever the caller passed as a root → a single Element.
 *
 * Domma's own components take "a selector, an element, or a collection"
 * everywhere, and an entry point that only accepted one of the three would be
 * the odd one out. domma-reactive itself is stricter on purpose — it is a
 * standalone package with no `$` to lean on — so the normalising happens here.
 *
 * @param {string|Element|Object} root
 * @returns {Element|null}
 */
function resolveRoot(root) {
    if (typeof root === 'string') return document.querySelector(root);
    if (root && root.nodeType === 1) return root;
    // A DommaCollection: numeric indices since v0.36, `elements` before it.
    if (root && typeof root === 'object') {
        const first = root[0] || (Array.isArray(root.elements) ? root.elements[0] : null);
        if (first && first.nodeType === 1) return first;
    }
    return null;
}

/**
 * Whatever the caller passed as data → the object the binding engine resolves
 * expressions against and writes back through.
 *
 * A Model becomes its `tracked()` view, which is what makes a write reach the
 * model with validation, change notification and persistence intact. Handlers
 * arrive separately, because a Model holds data and not behaviour.
 *
 * The layering itself lives in binding-source.js, shared with the component
 * factory — see there for the two silent failure modes it exists to prevent.
 *
 * @param {Object} data      A Model, a binding context, or a plain object.
 * @param {Object} [methods] Event handlers, looked up only when data has no
 *                           such key.
 * @returns {Object}
 */
function bindingSource(data, methods) {
    return createBindingSource(
        data instanceof Model ? data.tracked() : data,
        {fallback: methods}
    );
}

/**
 * Models module
 */
export const models = {
    // ============================================
    // Pub/Sub Event System
    // ============================================

    _events: new Map(),

    subscribe(event, callback) {
        if (!this._events.has(event)) {
            this._events.set(event, new Set());
        }
        this._events.get(event).add(callback);

        // Return unsubscribe function
        return () => this.unsubscribe(event, callback);
    },

    on(event, callback) {
        return this.subscribe(event, callback);
    },

    unsubscribe(event, callback) {
        if (this._events.has(event)) {
            this._events.get(event).delete(callback);
        }
    },

    off(event, callback) {
        this.unsubscribe(event, callback);
    },

    publish(event, data) {
        if (this._events.has(event)) {
            for (const callback of this._events.get(event)) {
                callback(data);
            }
        }
    },

    emit(event, data) {
        this.publish(event, data);
    },

    once(event, callback) {
        const wrapper = (data) => {
            this.unsubscribe(event, wrapper);
            callback(data);
        };
        return this.subscribe(event, wrapper);
    },

    clear(event) {
        if (event) {
            this._events.delete(event);
        } else {
            this._events.clear();
        }
    },

    // ============================================
    // Model Creation
    // ============================================

    /**
     * Create a new reactive model
     * @param {Object} schema - Field definitions
     * @param {Object} [initialData={}] - Initial data values
     * @param {Object} [options={}] - Options (persist, autoSave)
     * @returns {Model}
     */
    create(schema, initialData = {}, options = {}) {
        return new Model(schema, initialData, options);
    },

    /**
     * Extend a blueprint with additional fields
     * @param {...Object} blueprints - Blueprints to merge (left-to-right)
     * @returns {Object} - A new merged blueprint
     */
    extend(...blueprints) {
        const result = {};

        for (const blueprint of blueprints) {
            for (const field in blueprint) {
                if (Object.prototype.hasOwnProperty.call(blueprint, field)) {
                    if (result[field] && utils.isPlainObject(result[field])) {
                        // Deep merge field definitions
                        result[field] = utils.merge(
                            utils.cloneDeep(result[field]),
                            utils.cloneDeep(blueprint[field])
                        );
                    } else {
                        result[field] = utils.cloneDeep(blueprint[field]);
                    }
                }
            }
        }

        return result;
    },

    /**
     * Pick specific fields from a blueprint
     * @param {Object} blueprint - Source blueprint
     * @param {string[]} fields - Array of field names to pick
     * @returns {Object} - New blueprint with only specified fields
     */
    pick(blueprint, fields) {
        const result = {};

        for (const field of fields) {
            if (Object.prototype.hasOwnProperty.call(blueprint, field)) {
                result[field] = utils.cloneDeep(blueprint[field]);
            }
        }

        return result;
    },

    /**
     * Omit specific fields from a blueprint
     * @param {Object} blueprint - Source blueprint
     * @param {string[]} fields - Array of field names to omit
     * @returns {Object} - New blueprint without specified fields
     */
    omit(blueprint, fields) {
        const result = utils.cloneDeep(blueprint);

        for (const field of fields) {
            delete result[field];
        }

        return result;
    },

    // ============================================
    // Dependency-Tracked Reactivity
    // ============================================

    /**
     * A single reactive value. The primitive beneath Models — use `create()`
     * when you want a schema, validation and persistence; use this when you
     * want one tracked value and nothing else.
     *
     *   const count = M.observable(0);
     *   const total = M.computed(() => count.value * 10);
     *   count.value = 3;   // total.get() → 30
     *
     * Also published standalone as `domma-reactive`, where the same function
     * is a bare `observable()` import.
     *
     * @param {*} initial
     * @param {Object}   [options]
     * @param {Function} [options.equals] Change gate. Defaults to
     *   domma-reactive's own deep equality, which differs from `utils.isEqual`
     *   for NaN, Dates, class instances, Map/Set/RegExp and typed arrays. Pass
     *   your own comparator if you need Domma's exact semantics.
     * @returns {{value: *, peek: Function, set: Function}}
     */
    observable,

    /**
     * A reactive array whose in-place mutators notify.
     *
     *   const items = M.observableArray([]);
     *   items.push('a');   // effects reading items.value re-run
     *
     * `push`, `pop`, `shift`, `unshift`, `splice`, `sort`, `reverse`, `fill`
     * and `copyWithin` notify unconditionally — an in-place mutation leaves the
     * array deep-equal to any copy of it, so the equality gate cannot see it.
     * `remove(item)` and `removeAll()` follow the same rule. Wholesale
     * assignment to `.value` is gated, exactly as `observable()` is.
     *
     * @param {Array}  [initial=[]]
     * @param {Object} [options] Same options as observable()
     * @returns {Object}
     */
    observableArray,

    /**
     * Create a lazily-evaluated derived value that tracks whatever it reads.
     *
     * The body is not run until `.get()` is called, and afterwards the cached
     * value is reused until one of the fields it read actually changes.
     *
     *   const model = M.create(blueprint, {price: 10, qty: 3});
     *   const total = M.computed(() => model.get('price') * model.get('qty'));
     *   total.get();                 // 30 — evaluated now
     *   total.get();                 // 30 — cached, body not re-run
     *   model.set('qty', 4);
     *   total.get();                 // 40 — re-evaluated on demand
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
     * @param {Function|Object} fn          Derivation, or {read, write}.
     * @param {Object}   [options]
     * @param {string}   [options.label]    Debug label used in warnings.
     * @param {Function} [options.onChange] Called with the new value when it changes.
     * @returns {{value: *, get: Function, set: Function, peek: Function,
     *            dispose: Function}}
     */
    computed(fn, options = {}) {
        const comp = createComputed(fn, {
            label: options.label,
            onNotify: options.onChange || null
        });

        return {
            /**
             * Current value, recomputing only if a dependency changed.
             *
             * The same read as `get()`, spelled as a property, and the only one
             * a template expression can use — an expression cannot call a
             * method, so `{{total.get()}}` will not parse. It also stops
             * `M.observable` and `M.computed` disagreeing about how you read
             * them: an observable has always been `.value`.
             */
            get value() {
                return comp.get();
            },

            /**
             * Hand a value to the derivation's `write`, if it has one.
             *
             * The facade needs its own accessor pair: a getter alone makes the
             * property read-only in a way that fails SILENTLY outside strict
             * mode, so `total.value = 5` would look like it worked and do
             * nothing. Delegating means the package's own warning is what a
             * caller sees, naming the computed.
             */
            set value(next) {
                comp.write(next);
            },

            /** Current value, recomputing only if a dependency changed. */
            get: () => comp.get(),
            /** Imperative alias for assigning `.value`, matching observable().set. */
            set: (next) => comp.write(next),
            /** Current value without registering a dependency on the caller. */
            peek: () => runUntracked(() => comp.get()),
            /** Unlink from the dependency graph. */
            dispose: () => comp.dispose(),
            /** @internal escape hatch for framework code */
            _computation: comp
        };
    },

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
     * @param {Function} fn                Synchronous body.
     * @param {Object}   [options]
     * @param {string}   [options.label]   Debug label used in warnings.
     * @returns {Function} Call to stop the effect.
     */
    effect(fn, options = {}) {
        const comp = createEffect(fn, {label: options.label});
        return () => comp.dispose();
    },

    /**
     * Read values without registering them as dependencies of the enclosing
     * computed or effect.
     *
     * @param {Function} fn
     * @returns {*}
     */
    untracked(fn) {
        return runUntracked(fn);
    },

    /**
     * Settle all pending reactive work immediately rather than waiting for the
     * microtask flush. Mainly useful in tests and when code must observe a
     * derived value synchronously after a write.
     */
    flush() {
        flushReactive();
    },

    // ============================================
    // Type Validators
    // ============================================

    types: {
        string: (val) => typeof val === 'string',
        number: (val) => typeof val === 'number' && !Number.isNaN(val),
        boolean: (val) => typeof val === 'boolean',
        array: (val) => Array.isArray(val),
        object: (val) => val !== null && typeof val === 'object' && !Array.isArray(val),
        date: (val) => val instanceof Date && !isNaN(val.getTime()),
        any: () => true
    },

    // ============================================
    // DOM Binding
    // ============================================

    bind(model, field, selector, options = {}) {
        const elements = typeof selector === 'string'
            ? document.querySelectorAll(selector)
            : [selector];

        const bindings = [];

        for (const el of elements) {
            const binding = new Binding(model, field, el, options);
            model._addBinding(field, binding);
            bindings.push(binding);
        }

        // Return unbind function
        return () => {
            for (const binding of bindings) {
                binding.destroy();
            }
        };
    },

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
     * Pass a Model and every binding reads and writes through it — `data-model`
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
     * @param {Object}               data      A Model, or a plain object.
     * @param {string|Element|Object} root     Selector, element or collection.
     * @param {Object}   [options]
     * @param {Object}   [options.methods]     Handlers for `data-on-*`.
     * @param {Function} [options.render]      Template renderer for list items.
     *                                         Defaults to `utils.render`, so
     *                                         `{{ }}` inside a `data-each`
     *                                         behaves as it does everywhere
     *                                         else in Domma.
     * @returns {{bindings: Array, context: Function, update: Function, dispose: Function}}
     */
    applyBindings(data, root, options = {}) {
        const element = resolveRoot(root);

        if (!element) {
            throw new TypeError(
                `M.applyBindings: no element found for ${
                    typeof root === 'string' ? `selector "${root}"` : String(root)
                }`
            );
        }

        const {methods, ...rest} = options;

        return applyDomBindings(bindingSource(data, methods), element, {
            render: (tmpl, values) => utils.render(tmpl, values),
            ...rest
        });
    },

    /**
     * Add a binding kind, usable as `data-<name>` wherever bindings are.
     *
     * Not a side door: every built-in — text, attr, raw, if, event, bind,
     * model — is registered through this same function, so a custom binding can
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
     * @param {string} name    The binding kind, which becomes `binding.kind`.
     * @param {Object} handler `{attribute|attributePrefix, expression, tracks,
     *                         region, capturesBody, primes, update, attach,
     *                         detach}` — see docs/Bindings.md.
     */
    registerBinding(name, handler) {
        return addBindingKind(name, handler);
    },

    /**
     * Remove a binding kind added with registerBinding().
     *
     * @param {string} name
     */
    unregisterBinding(name) {
        return removeBindingKind(name);
    },

    /**
     * Add an extender, callable as `M.observable(x).extend({name: value})`.
     *
     * `rateLimit`, `throttle` and `notify` are registered through this same
     * function, so an extender you add is not a second-class citizen — the
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
     * guarantee that a write always lands immediately — even under a rate
     * limit, where only the notification waits.
     *
     * @param {string}   name
     * @param {Function} fn `(control, value) => void`
     */
    registerExtender(name, fn) {
        return addExtender(name, fn);
    },

    /**
     * Remove an extender added with registerExtender().
     * The built-ins are refused.
     *
     * @param {string} name
     * @returns {boolean} whether anything was removed
     */
    unregisterExtender(name) {
        return removeExtender(name);
    },

    /**
     * Add a function callable from a binding expression.
     *
     * Expressions cannot call methods on your data — `{{total.get()}}` will not
     * parse — because arbitrary calls are how an expression language turns into
     * an execution surface. A registered helper is the supported way to shape a
     * value in the markup:
     *
     *   M.registerHelper('upper', (s) => String(s).toUpperCase());
     *   // <p data-bind-text="upper(name)"></p>
     *
     * Helpers are shared by every binding and every component template.
     *
     * @param {string}   name
     * @param {Function} fn   Pure, synchronous.
     */
    registerHelper(name, fn) {
        return addExpressionHelper(name, fn);
    },

    /**
     * Remove a helper added with registerHelper().
     *
     * @param {string} name
     */
    unregisterHelper(name) {
        return removeExpressionHelper(name);
    },

    // ============================================
    // Store (Simple State Management)
    // ============================================

    _stores: new Map(),

    store(name, initialState = {}) {
        if (!this._stores.has(name)) {
            const store = {
                state: {...initialState},
                listeners: new Set(),

                getState() {
                    return {...this.state};
                },

                setState(updates) {
                    const oldState = {...this.state};
                    this.state = {...this.state, ...updates};
                    for (const listener of this.listeners) {
                        listener(this.state, oldState);
                    }
                },

                subscribe(listener) {
                    this.listeners.add(listener);
                    return () => this.listeners.delete(listener);
                },

                reset(newState) {
                    this.state = newState ? {...newState} : {...initialState};
                    for (const listener of this.listeners) {
                        listener(this.state, {});
                    }
                }
            };
            this._stores.set(name, store);
        }
        return this._stores.get(name);
    },

    getStore(name) {
        return this._stores.get(name);
    },

    removeStore(name) {
        this._stores.delete(name);
    }
};
