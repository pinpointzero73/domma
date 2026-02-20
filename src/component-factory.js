/**
 * Domma Component Factory
 *
 * Creates Vue-style standalone Web Components from declarative definitions.
 * Each registered component becomes a Custom Element with Shadow DOM, reactive
 * data (powered by Domma Models), a props system, computed properties, and
 * a surgical template-binding engine.
 *
 * Usage:
 *
 *   Domma.component('counter-demo', {
 *     template: `<div><p>Count: {{count}}</p><p>Doubled: {{doubled}}</p></div>`,
 *
 *     data() { return { count: 0 }; },
 *
 *     computed: {
 *       doubled() { return this.data.count * 2; }
 *     },
 *
 *     methods: {
 *       increment() { this.set({ count: this.data.count + 1 }); }
 *     },
 *
 *     onMount()   { console.log('mounted'); },
 *     onUpdated() { console.log('updated'); },
 *     onUnmount() { console.log('unmounted'); },
 *
 *     style: `.counter { padding: 1rem; }`
 *   });
 *
 *   // In HTML: <counter-demo></counter-demo>
 */

import { DommaElement, getThemeVariables } from './web-components/base/domma-element.js';
import { TemplateCompiler } from './template-compiler.js';
import { models } from './models.js';
import { utils } from './utils.js';

// ── Template cache (shared across all instances) ──────────────────────────────
const _templateCache = new Map();

// ── Component registry (tagName → definition) ─────────────────────────────────
const _componentRegistry = new Map();

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** camelCase → kebab-case  (e.g. "userId" → "user-id") */
function _toAttrName(propName) {
    return propName.replace(/([A-Z])/g, '-$1').toLowerCase();
}

/** kebab-case → camelCase  (e.g. "user-id" → "userId") */
function _toPropName(attrName) {
    return attrName.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
}

/**
 * Coerce an HTML attribute string value to the declared prop type.
 * Falls back to the prop's default value when the attribute is absent.
 *
 * @param {string|null} value    Raw attribute string (null = absent)
 * @param {Object}      typeDef  Prop definition { type, default, required }
 * @returns {*}
 */
function _coercePropValue(value, typeDef = {}) {
    // Attribute absent — return declared default or null
    if (value === null || value === undefined) {
        if (typeDef.default !== undefined) {
            return typeof typeDef.default === 'function'
                ? typeDef.default()
                : typeDef.default;
        }
        return null;
    }

    const type = typeDef.type;

    if (type === models.types?.number || type === 'number') {
        const n = Number(value);
        return isNaN(n) ? null : n;
    }
    if (type === models.types?.boolean || type === 'boolean') {
        if (value === '' || value === 'true') return true;
        if (value === 'false') return false;
        return Boolean(value);
    }
    if (
        type === models.types?.array  || type === 'array'  ||
        type === models.types?.object || type === 'object'
    ) {
        try { return JSON.parse(value); } catch { return value; }
    }
    return value; // default: string
}

/**
 * Fetch (and cache) a template from a URL.
 *
 * @param {string} url
 * @returns {Promise<string>}
 */
async function _loadTemplate(url) {
    if (_templateCache.has(url)) return _templateCache.get(url);

    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(
            `[Domma Component] Failed to load template: ${url} (${response.status})`
        );
    }

    const text = await response.text();
    _templateCache.set(url, text);
    return text;
}

// ── Component Class Builder ────────────────────────────────────────────────────

/**
 * Build and register a Custom Element class from a component definition.
 *
 * @param {string} tagName     Custom element tag (must contain a hyphen, or one is added)
 * @param {Object} definition  Component definition object
 * @returns {typeof DommaElement}
 */
export function createComponent(tagName, definition) {
    if (_componentRegistry.has(tagName)) {
        console.warn(`[Domma Component] "${tagName}" is already registered.`);
        return;
    }

    const {
        template: inlineTemplate,
        templateUrl,
        props:    propDefs      = {},
        data:     dataFn,
        computed: computedDefs  = {},
        methods                 = {},
        onBeforeMount,
        onMount,
        onUpdated,
        onBeforeUnmount,
        onUnmount,
        onPropsChanged,
        style: componentStyle   = ''
    } = definition;

    const propNames  = Object.keys(propDefs);
    const attrNames  = propNames.map(_toAttrName);

    // ── Custom Element Class ───────────────────────────────────────────────────
    class DommaComponent extends DommaElement {

        static get observedAttributes() { return attrNames; }

        constructor() {
            super();
            this._model        = null;
            this._props        = {};
            this._bindings     = null;
            this._template     = null;
            this._contentRoot  = null;
            this._context      = null;
            this._unsubs       = [];
        }

        // ── Web Component Lifecycle ───────────────────────────────────────────

        connectedCallback() {
            if (this._initialised) {
                // Re-connected after being moved in the DOM — re-fire onMount
                onMount?.call(this._ctx());
                return;
            }

            this._initialised = true;
            this._initProps();
            this._initModel();

            // Inject theme variables + component styles into Shadow DOM
            this._injectStyles();

            // Create a content wrapper div (keeps styles safe during re-renders)
            this._contentRoot = document.createElement('div');
            this._contentRoot.className = 'dm-component-root';
            this.shadowRoot.appendChild(this._contentRoot);

            onBeforeMount?.call(this._ctx());

            this._renderComponent().then(() => {
                this._subscribeToModel();
                onMount?.call(this._ctx());
            });
        }

        disconnectedCallback() {
            onBeforeUnmount?.call(this._ctx());
            this._cleanup();
            for (const unsub of this._unsubs) unsub();
            this._unsubs = [];
            if (this._model) this._model.destroy();
            onUnmount?.call(this._ctx());
        }

        attributeChangedCallback(name, oldValue, newValue) {
            if (oldValue === newValue) return;

            const propName        = _toPropName(name);
            this._props[propName] = _coercePropValue(newValue, propDefs[propName]);

            onPropsChanged?.call(this._ctx(), propName, oldValue, newValue);

            // Props change always triggers a full re-render (props are structural)
            if (this._initialised && this._bindings) {
                this._rerenderFull();
            }
        }

        // ── Initialisation ────────────────────────────────────────────────────

        /** Populate this._props from HTML attributes with type coercion. */
        _initProps() {
            for (const propName of propNames) {
                const attrName = _toAttrName(propName);
                const raw = this.hasAttribute(attrName)
                    ? this.getAttribute(attrName)
                    : null;
                this._props[propName] = _coercePropValue(raw, propDefs[propName]);
            }
        }

        /** Create the internal reactive Model from the data() function. */
        _initModel() {
            const initialData = dataFn ? dataFn() : {};

            // Build a minimal schema from the initial data keys
            const schema = {};
            for (const key of Object.keys(initialData)) {
                schema[key] = {};  // No type enforcement — component data is untyped
            }

            this._model = models.create(schema, initialData);
        }

        // ── Rendering ─────────────────────────────────────────────────────────

        /** Fetch template (if needed) then compile into the content root. */
        async _renderComponent() {
            let template = inlineTemplate;
            if (!template && templateUrl) {
                template = await _loadTemplate(templateUrl);
            }

            if (!template) {
                this._contentRoot.textContent = '';
                return;
            }

            this._template = template;
            this._bindings = TemplateCompiler.compile(
                template,
                this._mergeData(),
                this._contentRoot,
                (tmpl, data) => utils.render(tmpl, data)
            );
        }

        /** Full re-render into the content root then rebuild bindings. */
        _rerenderFull() {
            if (!this._bindings) return;
            this._bindings.rerender(this._mergeData());
            onUpdated?.call(this._ctx());
        }

        // ── Model Subscription ────────────────────────────────────────────────

        /** Subscribe to model changes and wire them to template updates. */
        _subscribeToModel() {
            if (!this._model || !this._bindings) return;

            // Seed the computed cache with initial values so we can detect
            // when a structural computed property actually changes.
            const computedNames = Object.keys(computedDefs);
            const computedCache = {};
            const mergedInit = this._mergeData();
            for (const name of computedNames) {
                computedCache[name] = mergedInit[name];
            }

            const unsub = this._model.onChange(({ field, newValue }) => {
                // ── Structural model field → always full re-render ────────────
                if (this._bindings.isStructural(field)) {
                    this._rerenderFull();
                    // Rebuild cache after re-render
                    const rd = this._mergeData();
                    for (const n of computedNames) computedCache[n] = rd[n];
                    return;
                }

                // ── Text-only model field → surgical update ───────────────────
                this._bindings.update(field, newValue);

                // Re-evaluate every computed property to detect changes.
                const merged = this._mergeData();
                let needsFullRerender = false;

                for (const name of computedNames) {
                    const newVal = merged[name];
                    if (utils.isEqual(newVal, computedCache[name])) continue;

                    computedCache[name] = newVal;

                    if (this._bindings.isStructural(name)) {
                        // Structural computed flipped (e.g. {{#if high}}) → re-render
                        needsFullRerender = true;
                    } else {
                        this._bindings.update(name, newVal);
                    }
                }

                if (needsFullRerender) {
                    this._rerenderFull();
                    const rd = this._mergeData();
                    for (const n of computedNames) computedCache[n] = rd[n];
                } else {
                    onUpdated?.call(this._ctx());
                }
            });

            this._unsubs.push(unsub);
        }

        // ── Styles ────────────────────────────────────────────────────────────

        _getStyles() {
            return getThemeVariables() + (componentStyle || '');
        }

        // ── Context ───────────────────────────────────────────────────────────

        /**
         * Build (once) the "this" context object exposed to lifecycle hooks,
         * computed properties, and methods.
         *
         * @returns {ComponentContext}
         */
        _ctx() {
            if (this._context) return this._context;

            const self = this;
            const ctx = {
                /** Live snapshot of reactive model data. */
                get data()  { return self._model ? self._model.toJSON() : {}; },
                /** Resolved props (after type coercion). */
                get props() { return { ...self._props }; },
                /** Shadow root reference. */
                get root()  { return self.shadowRoot; },
                /** The host element itself. */
                get el()    { return self; },

                /**
                 * Reactively set one or more data fields.
                 * Accepts an object: this.set({ name: 'Alice', loading: false })
                 *
                 * @param {Object} fields
                 */
                set(fields) {
                    if (!self._model) return;
                    self._model.set(fields);
                }
            };

            // Attach computed properties as getters
            for (const [name, fn] of Object.entries(computedDefs)) {
                Object.defineProperty(ctx, name, {
                    get()        { return fn.call(self._ctx()); },
                    enumerable:  true,
                    configurable: true
                });
            }

            // Attach methods bound to this context
            for (const [name, fn] of Object.entries(methods)) {
                ctx[name] = fn.bind(ctx);
            }

            this._context = ctx;
            return ctx;
        }

        // ── Data Merge ────────────────────────────────────────────────────────

        /**
         * Produce the full data context used for template rendering:
         * model data + props + evaluated computed properties.
         *
         * @returns {Object}
         */
        _mergeData() {
            const data     = this._model ? this._model.toJSON() : {};
            const computed = {};

            for (const [name, fn] of Object.entries(computedDefs)) {
                try {
                    computed[name] = fn.call(this._ctx());
                } catch {
                    computed[name] = null;
                }
            }

            return { ...data, ...this._props, ...computed };
        }
    }

    // Register the Custom Element (add prefix if no hyphen present)
    const registrationName = tagName.includes('-') ? tagName : `domma-${tagName}`;
    customElements.define(registrationName, DommaComponent);
    _componentRegistry.set(tagName, definition);

    return DommaComponent;
}

// ── Public API ────────────────────────────────────────────────────────────────

/**
 * The `components` namespace — exposed as `Domma.component` and `Domma.components`.
 */
export const components = {
    /**
     * Define and register a new component.
     *
     * @param {string} tagName     Custom element tag name
     * @param {Object} definition  Component definition
     * @returns {typeof DommaElement}
     */
    define(tagName, definition) {
        return createComponent(tagName, definition);
    },

    /** Returns true if a component with this tag name has been registered. */
    has(tagName) {
        return _componentRegistry.has(tagName);
    },

    /** Returns a copy of the component registry (for tooling / inspection). */
    registry() {
        return new Map(_componentRegistry);
    },

    /**
     * Expose the shared template cache so the router (and other consumers)
     * can prime or inspect it.
     */
    get templateCache() {
        return _templateCache;
    }
};
