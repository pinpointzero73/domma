import {dom} from './dom.js';
import {elements} from './elements.js';

export const configEngine = {
    process(config) {
        if (!config || typeof config !== 'object') return;

        Object.keys(config).forEach(selector => {
            const rules = config[selector];
            const domElements = dom(selector);

            // Component initialization
            if (rules.component) {
                this.initComponent(selector, rules.component, rules.options || {});
            }

            if (rules.initial) {
                this.applyProperties(domElements, rules.initial);
            }

            if (rules.events) {
                this.bindEvents(domElements, rules.events);
            }
        });
    },

    initComponent(selector, componentType, options) {
        const componentMap = {
            card: elements.card,
            modal: elements.modal,
            tabs: elements.tabs,
            accordion: elements.accordion,
            tooltip: elements.tooltip
        };

        const factory = componentMap[componentType];
        if (factory) {
            return factory.call(elements, selector, options);
        } else {
            console.warn(`Unknown component type: ${componentType}`);
        }
    },

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
            }
        });
    },

    bindEvents(domElements, events) {
        Object.keys(events).forEach(event => {
            const actions = events[event];
            domElements.on(event, (e) => {
                this.executeActions(e, actions);
            });
        });
    },

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
    }
};
