import { dom } from './dom.js';

export const configEngine = {
    process(config) {
        if (!config || typeof config !== 'object') return;

        Object.keys(config).forEach(selector => {
            const rules = config[selector];
            const elements = dom(selector);

            if (rules.initial) {
                this.applyProperties(elements, rules.initial);
            }

            if (rules.events) {
                this.bindEvents(elements, rules.events);
            }
        });
    },

    applyProperties(elements, properties) {
        Object.keys(properties).forEach(prop => {
            if (prop === 'css') {
                elements.css(properties[prop]);
            } else if (prop === 'text') {
                elements.text(properties[prop]);
            } else if (prop === 'html') {
                elements.html(properties[prop]);
            } else if (prop === 'addClass') {
                elements.addClass(properties[prop]);
            } else if (prop === 'removeClass') {
                elements.removeClass(properties[prop]);
            }
        });
    },

    bindEvents(elements, events) {
        Object.keys(events).forEach(event => {
            const actions = events[event];
            elements.on(event, (e) => {
                this.executeActions(e.target, actions);
            });
        });
    },

    executeActions(target, actions) {
        // Actions can be an array or a single object
        const actionList = Array.isArray(actions) ? actions : [actions];
        const $target = dom(target);

        actionList.forEach(action => {
            // If action has a target selector, use that, otherwise use the event target
            const $el = action.target ? dom(action.target) : $target;

            if (action.css) $el.css(action.css);
            if (action.text) $el.text(action.text);
            if (action.html) $el.html(action.html);
            if (action.addClass) $el.addClass(action.addClass);
            if (action.removeClass) $el.removeClass(action.removeClass);
            if (action.log) console.log(action.log);
        });
    }
};
