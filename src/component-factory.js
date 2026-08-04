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
import { computed as createComputed, effect as createEffect, untracked } from './reactive.js';

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

            // Dependency-tracked reactivity
            this._computeds          = new Map();  // name → Computation
            this._effects            = [];         // one per bound template field
            this._updateQueued       = false;
            this._teardown           = false;
        }

        // ── Web Component Lifecycle ───────────────────────────────────────────

        connectedCallback() {
            if (this._initialised) {
                // Re-connected after being moved in the DOM — re-fire onMount.
                // NOTE: reactive wiring is not rebuilt here. disconnectedCallback
                // disposes the effects and destroys the model, so a relocated
                // element is inert — pre-existing behaviour, see docs/Reactivity.md.
                this._teardown = false;
                onMount?.call(this._ctx());
                return;
            }

            this._initialised = true;
            this._initProps();
            this._initModel();
            this._initComputeds();

            // Inject theme variables + component styles into Shadow DOM
            this._injectStyles();

            // Create a content wrapper div (keeps styles safe during re-renders)
            this._contentRoot = document.createElement('div');
            this._contentRoot.className = 'dm-component-root';
            this.shadowRoot.appendChild(this._contentRoot);

            onBeforeMount?.call(this._ctx());

            this._renderComponent().then(() => {
                this._wireBindings();
                onMount?.call(this._ctx());
            });
        }

        disconnectedCallback() {
            this._teardown = true;
            onBeforeUnmount?.call(this._ctx());
            this._cleanup();
            for (const unsub of this._unsubs) unsub();
            this._unsubs = [];

            for (const eff of this._effects) eff.dispose();
            this._effects = [];
            for (const comp of this._computeds.values()) comp.dispose();
            this._computeds.clear();

            if (this._model) this._model.destroy();
            onUnmount?.call(this._ctx());
        }

        attributeChangedCallback(name, oldValue, newValue) {
            if (oldValue === newValue) return;

            const propName        = _toPropName(name);
            this._props[propName] = _coercePropValue(newValue, propDefs[propName]);

            onPropsChanged?.call(this._ctx(), propName, oldValue, newValue);

            // Props change always triggers a full re-render (props are structural).
            // Props are not dependency-tracked, so any computed that reads one
            // must be invalidated by hand before the re-render reads it back.
            if (this._initialised && this._bindings) {
                for (const comp of this._computeds.values()) comp.invalidate();
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

        /**
         * Wrap each declared computed in a tracked, memoised Computation.
         *
         * Evaluation is lazy: a computed's body does not run until something
         * reads it, and the cached value is reused until a field it actually
         * read changes. Because computeds are exposed on the context object,
         * a computed reading another computed links the two automatically.
         */
        _initComputeds() {
            for (const [name, fn] of Object.entries(computedDefs)) {
                this._computeds.set(
                    name,
                    createComputed(() => fn.call(this._ctx()), { label: name })
                );
            }
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

        /**
         * Full re-render into the content root then re-index bindings.
         * Only used for props changes — reactive data changes update surgically.
         */
        _rerenderFull() {
            if (!this._bindings) return;
            this._bindings.rerenderAll(this._mergeData());
            onUpdated?.call(this._ctx());
        }

        // ── Reactive Binding ──────────────────────────────────────────────────

        /**
         * Create one tracked effect per field the template actually binds.
         *
         * Each effect reads its own field — through the model's tracking proxy
         * or through a computed — and so re-runs only when that specific value
         * changes. A model field no template mentions costs nothing; a computed
         * that does not read the field that changed is never re-evaluated.
         *
         * This replaces the previous strategy of re-running every computed and
         * deep-comparing all of them on every single change.
         */
        _wireBindings() {
            if (!this._bindings) return;

            for (const binding of this._bindings.bindings) {
                // A binding whose dependencies are all props never re-runs —
                // an attribute change re-renders in full instead.
                const reactiveDeps = [...binding.deps].filter(dep =>
                    this._computeds.has(dep) ||
                    !Object.prototype.hasOwnProperty.call(this._props, dep)
                );
                if (reactiveDeps.length === 0) continue;

                let primed = false;

                const eff = createEffect(() => {
                    // Tracked reads — this is what subscribes the effect
                    for (const dep of reactiveDeps) this._readBound(dep);

                    // First run exists only to collect dependencies; the
                    // initial render has already painted this binding.
                    if (!primed) {
                        primed = true;
                        return;
                    }

                    // The DOM write itself must not register dependencies —
                    // _mergeData() reads every computed.
                    untracked(() => {
                        this._bindings.update(binding.id, this._mergeData());
                        this._scheduleUpdate();
                    });
                }, { label: `${this.tagName.toLowerCase()}:${binding.id}` });

                this._effects.push(eff);
            }
        }

        /**
         * Read a bound name from whichever source owns it, with tracking active.
         * Resolution order matches _mergeData(): computed → prop → model field.
         *
         * @param {string} name
         * @returns {*}
         */
        _readBound(name) {
            if (this._computeds.has(name)) {
                return this._computeds.get(name).get();
            }
            if (Object.prototype.hasOwnProperty.call(this._props, name)) {
                return this._props[name];
            }
            return this._model ? this._model.get(name) : undefined;
        }

        /**
         * Coalesce the onUpdated hook so it fires once per flush, however many
         * bindings updated. The DOM writes themselves are already surgical and
         * happen immediately in each effect — only the notification is batched.
         */
        _scheduleUpdate() {
            if (this._updateQueued) return;
            this._updateQueued = true;

            Promise.resolve().then(() => {
                this._updateQueued = false;
                // A queued pass can outlive the element: effects are disposed on
                // disconnect, but a microtask already in flight is not cancellable.
                if (this._teardown || !this._initialised || !this._bindings) return;
                onUpdated?.call(this._ctx());
            });
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
                /**
                 * Live, read-tracked view of reactive model data.
                 * Reads inside a computed or effect register a dependency;
                 * writes route through the model's validation path.
                 */
                get data()  { return self._model ? self._model.tracked() : {}; },
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

            // Attach computed properties as getters. These read through the
            // memoised Computation rather than re-invoking the body, so a
            // computed referenced by several others is evaluated once.
            for (const [name, fn] of Object.entries(computedDefs)) {
                Object.defineProperty(ctx, name, {
                    get() {
                        const comp = self._computeds.get(name);
                        return comp ? comp.get() : fn.call(self._ctx());
                    },
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
            // toJSON() is deliberately untracked — this is a render-time read,
            // not a dependency, and tracking it would link every field to
            // whatever computation happens to be running.
            const data     = this._model ? this._model.toJSON() : {};
            const computed = {};

            for (const [name, comp] of this._computeds.entries()) {
                computed[name] = comp.get();
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
