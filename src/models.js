/**
 * Domma Models Module
 * Pub/Sub events and reactive data binding
 */

import {utils} from './utils.js';
import {storage} from './storage.js';

/**
 * Reactive Model Class
 */
class Model {
    constructor(schema, data = {}, options = {}) {
        this._schema = schema;
        this._data = {};
        this._initialData = {};
        this._bindings = new Map();
        this._changeCallbacks = new Set();
        this._fieldCallbacks = new Map();

        // Persistence configuration
        this._persistKey = options.persist || null;
        this._autoSave = options.autoSave !== false; // Default true when persist is set

        // Initialise with defaults and provided data
        for (const field in schema) {
            const fieldDef = schema[field];
            const defaultVal = fieldDef.default !== undefined ? fieldDef.default : null;
            this._data[field] = data[field] !== undefined ? data[field] : defaultVal;
            this._initialData[field] = this._data[field];
        }

        // Load from storage if persist key provided (overrides initial data)
        if (this._persistKey) {
            this._loadFromStorage();
        }
    }

    get(field) {
        if (field) {
            return this._data[field];
        }
        return {...this._data};
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
        const oldValue = this._data[field];

        // Validate if schema exists for field
        if (this._schema[field]) {
            const validation = this._validateField(field, value);
            if (!validation.valid) {
                throw new Error(`Validation failed for ${field}: ${validation.error}`);
            }
        }

        this._data[field] = value;

        // Notify if changed
        if (!utils.isEqual(oldValue, value)) {
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

        for (const field in this._schema) {
            const validation = this._validateField(field, this._data[field]);
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
        return {...this._data};
    }

    onChange(callback) {
        this._changeCallbacks.add(callback);
        return () => this._changeCallbacks.delete(callback);
    }

    onFieldChange(field, callback) {
        if (!this._fieldCallbacks.has(field)) {
            this._fieldCallbacks.set(field, new Set());
        }
        this._fieldCallbacks.get(field).add(callback);
        return () => this._fieldCallbacks.get(field).delete(callback);
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
            return storage.set(`model:${this._persistKey}`, this._data);
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
                        this._data[field] = stored[field];
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
