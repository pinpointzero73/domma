import {dom} from './dom.js';
import {elements} from './elements.js';
import {forms} from './forms.js';
import {utils} from './utils.js';
import effects from './effects.js';

export const configEngine = {
    // Storage for mutable configuration
    _configs: new Map(),        // selector -> config object
    _components: new Map(),     // selector -> component instance
    _eventHandlers: new Map(),  // selector -> Map(event -> handler)
    _initCallbacks: [],         // Array of init callbacks
    _domReady: false,           // Track if DOM is ready
    _autoWrap: true,            // Auto-wrap in DOMContentLoaded

    /**
     * Process initial configuration
     * @param {Object} config - Configuration object keyed by selector
     * @param {Object} [options] - Processing options
     * @param {boolean} [options.autoWrap=true] - Automatically wrap in DOMContentLoaded
     */
    process(config, options = {}) {
        if (!config || typeof config !== 'object') return;

        const autoWrap = options.autoWrap !== undefined ? options.autoWrap : this._autoWrap;

        // Check if we should wrap in DOMContentLoaded
        const shouldWait = autoWrap && !this._domReady && document.readyState === 'loading';

        if (shouldWait) {
            // Queue for when DOM is ready
            document.addEventListener('DOMContentLoaded', () => {
                this._domReady = true;
                this._processConfig(config);
            }, { once: true });
            return;
        }

        this._processConfig(config);
    },

    /**
     * Internal config processing (after DOM ready check)
     * @private
     */
    _processConfig(config) {
        // Process global init callback first
        if (config.$init && typeof config.$init === 'function') {
            this._initCallbacks.push(config.$init);
            config.$init();
            delete config.$init;
        }

        Object.keys(config).forEach(selector => {
            const rules = config[selector];

            // Store a deep copy of the config
            this._configs.set(selector, utils.cloneDeep(rules));

            // Handle init callback for this selector
            if (rules.init && typeof rules.init === 'function') {
                const domElements = dom(selector);
                rules.init.call(domElements, domElements);
            }

            const domElements = dom(selector);

            // Component initialisation
            if (rules.component) {
                const instance = this.initComponent(selector, rules.component, rules.options || {});
                if (instance) {
                    this._components.set(selector, instance);
                }
            }

            if (rules.initial) {
                this.applyProperties(domElements, rules.initial);
            }

            if (rules.events) {
                this.bindEvents(selector, rules.events, true);
            }
        });
    },

    /**
     * Update configuration for a selector
     * @param {string} selector - CSS selector
     * @param {Object} changes - Changes to merge into existing config
     * @returns {Object} The merged configuration
     */
    update(selector, changes) {
        const existing = this._configs.get(selector);

        if (!existing) {
            // No existing config - treat as new setup
            this.process({[selector]: changes});
            return this._configs.get(selector);
        }

        // Deep merge changes into existing config
        const merged = utils.merge({}, existing, changes);
        this._configs.set(selector, merged);

        const domElements = dom(selector);

        // Update component options if component exists
        if (changes.options && this._components.has(selector)) {
            const component = this._components.get(selector);
            if (component && typeof component.setOptions === 'function') {
                component.setOptions(changes.options);
            }
        }

        // Re-apply initial properties
        if (changes.initial) {
            this.applyProperties(domElements, changes.initial);
        }

        // Update events (add new, replace existing)
        if (changes.events) {
            this.updateEvents(selector, changes.events);
        }

        return merged;
    },

    /**
     * Retrieve configuration for a selector or all selectors
     * @param {string} [selector] - Optional selector to get config for
     * @returns {Object|null} Configuration object or null if not found
     */
    config(selector) {
        if (!selector) {
            // Return all configs as plain object
            const result = {};
            this._configs.forEach((value, key) => {
                result[key] = value;
            });
            return result;
        }
        return this._configs.get(selector) || null;
    },

    /**
     * Retrieve the live component instance created for a selector.
     *
     * $.setup() keeps instances internally, so page code has no other way to
     * reach them - calling a component's methods (modal.open(), tabs.show(),
     * timer.start()) requires this accessor.
     *
     * @param {string} [selector] - Selector the component was configured under
     * @returns {Object|Map|null} The instance, or a Map of all when no selector
     */
    getComponent(selector) {
        if (!selector) return new Map(this._components);
        return this._components.get(selector) || null;
    },

    /**
     * Reset/destroy configuration for a selector or all selectors
     * @param {string} [selector] - Optional selector to reset
     */
    reset(selector) {
        if (!selector) {
            // Reset all - iterate over a copy of keys to avoid mutation during iteration
            const selectors = Array.from(this._configs.keys());
            selectors.forEach(sel => this.reset(sel));
            return;
        }

        // Destroy component if it exists
        const component = this._components.get(selector);
        if (component && typeof component.destroy === 'function') {
            component.destroy();
        }
        this._components.delete(selector);

        // Remove event handlers
        this.unbindEvents(selector);

        // Clear config
        this._configs.delete(selector);
    },

    /**
     * Initialise a component
     * @param {string} selector - CSS selector
     * @param {string} componentType - Component type name
     * @param {Object} options - Component options
     * @returns {Object|undefined} Component instance
     */
    initComponent(selector, componentType, options) {
        const componentMap = {
            card: elements.card,
            modal: elements.modal,
            tabs: elements.tabs,
            accordion: elements.accordion,
            tooltip: elements.tooltip,
            carousel: elements.carousel,
            dropdown: elements.dropdown,
            badge: elements.badge,
            numberBadge: elements.numberBadge,
            listGroup: elements.listGroup,
            cookieConsent: elements.cookieConsent,
            backToTop: elements.backToTop,
            buttonGroup: elements.buttonGroup,
            loader: elements.loader,
            breadcrumbs: elements.breadcrumbs,
            navbar: elements.navbar,
            sidebar: elements.sidebar,
            footer: elements.footer,
            notification: elements.notification,
            timer: elements.timer,
            alarm: elements.alarm,
            autocomplete: elements.autocomplete,
            pillbox: elements.pillbox,
            signature: elements.signature,
            form: forms.create,
            // Effects
            breathe: effects.breathe,
            pulse: effects.pulse,
            scribe: effects.scribe
        };

        const factory = componentMap[componentType];
        if (factory) {
            // Special handling for forms which requires schema and data
            if (componentType === 'form') {
                if (!options.schema) {
                    console.error('Forms component requires a schema option');
                    return null;
                }
                const formInstance = factory(options.schema, options.data || {}, options);
                formInstance.renderTo(selector);
                return formInstance;
            }
            return factory.call(elements, selector, options);
        } else {
            console.warn(`Unknown component type: ${componentType}`);
        }
    },

    /**
     * Apply properties to DOM elements
     * @param {Object} domElements - Domma collection
     * @param {Object} properties - Properties to apply
     */
    applyProperties(domElements, properties) {
        Object.keys(properties).forEach(prop => {
            if (prop === 'css') {
                domElements.css(properties[prop]);
            } else if (prop === 'text') {
                domElements.text(properties[prop]);
            } else if (prop === 'html') {
                domElements.html(properties[prop]);
            } else if (prop === 'addClass') {
                domElements.addClass(properties[prop]);
            } else if (prop === 'removeClass') {
                domElements.removeClass(properties[prop]);
            } else if (prop === 'toggleClass') {
                domElements.toggleClass(properties[prop]);
            } else if (prop === 'attr') {
                Object.keys(properties[prop]).forEach(attrName => {
                    domElements.attr(attrName, properties[prop][attrName]);
                });
            }
        });
    },

    /**
     * Bind events to elements
     * @param {string} selector - CSS selector
     * @param {Object} events - Event handlers object
     * @param {boolean} [track=false] - Whether to track handlers for later removal
     */
    bindEvents(selector, events, track = false) {
        const domElements = dom(selector);

        if (track && !this._eventHandlers.has(selector)) {
            this._eventHandlers.set(selector, new Map());
        }

        Object.keys(events).forEach(event => {
            const actions = events[event];
            const handler = (e) => this.executeActions(e, actions);

            domElements.on(event, handler);

            if (track) {
                this._eventHandlers.get(selector).set(event, handler);
            }
        });
    },

    /**
     * Unbind all tracked events for a selector
     * @param {string} selector - CSS selector
     */
    unbindEvents(selector) {
        const handlers = this._eventHandlers.get(selector);
        if (!handlers) return;

        const domElements = dom(selector);
        handlers.forEach((handler, event) => {
            domElements.off(event, handler);
        });

        this._eventHandlers.delete(selector);
    },

    /**
     * Update events for a selector (replaces existing handlers for same events)
     * @param {string} selector - CSS selector
     * @param {Object} newEvents - New event handlers
     */
    updateEvents(selector, newEvents) {
        const existingHandlers = this._eventHandlers.get(selector);
        const domElements = dom(selector);

        // Remove old handlers for events being replaced
        if (existingHandlers) {
            Object.keys(newEvents).forEach(event => {
                if (existingHandlers.has(event)) {
                    domElements.off(event, existingHandlers.get(event));
                    existingHandlers.delete(event);
                }
            });
        }

        // Bind new events
        this.bindEvents(selector, newEvents, true);
    },

    /**
     * Execute actions for an event
     * @param {Event} event - DOM event
     * @param {Function|Array|Object} actions - Actions to execute
     */
    executeActions(event, actions) {
        // Actions can be a function, an array, or a single object
        if (typeof actions === 'function') {
            actions.call(event.target, event, dom(event.target));
            return;
        }

        const actionList = Array.isArray(actions) ? actions : [actions];
        const $target = dom(event.target);

        actionList.forEach(action => {
            // Support function in action array
            if (typeof action === 'function') {
                action.call(event.target, event, $target);
                return;
            }

            // If action has a target selector, use that, otherwise use the event target
            const $el = action.target ? dom(action.target) : $target;

            if (action.css) $el.css(action.css);
            if (action.text) $el.text(action.text);
            if (action.html) $el.html(action.html);
            if (action.addClass) $el.addClass(action.addClass);
            if (action.removeClass) $el.removeClass(action.removeClass);
            if (action.toggleClass) $el.toggleClass(action.toggleClass);
            if (action.log) console.log(action.log);
        });
    },

    /**
     * Register a callback to run when DOM is ready
     * @param {Function} callback - Function to execute when DOM is ready
     * @returns {void}
     */
    ready(callback) {
        if (typeof callback !== 'function') {
            console.warn('ready() requires a function');
            return;
        }

        // If DOM is already ready, execute immediately
        if (this._domReady || document.readyState === 'complete' || document.readyState === 'interactive') {
            callback();
            return;
        }

        // Otherwise, wait for DOMContentLoaded
        document.addEventListener('DOMContentLoaded', () => {
            this._domReady = true;
            callback();
        }, { once: true });
    }
};
