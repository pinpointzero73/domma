/**
 * The `<domma-*>` tags.
 *
 * Each tag is a thin shell over the E.* implementation in src/components/: when it is
 * connected it builds that component on itself from its attributes, so
 * `<domma-badge variant="success">New</domma-badge>` and `E.badge(el, {variant: 'success'})`
 * are the same code. The component's methods are on the tag too
 * (`document.querySelector('domma-badge').setVariant('danger')`), returning the tag so
 * calls chain, and a changed attribute is passed on as an option.
 *
 * Registration is lazy and happens once: on the first E.* call of one of these
 * components, or when the page (at load, or later markup) contains one of the tags.
 * Outside a browser there is no customElements and nothing is defined.
 */

import Badge, {NumberBadge} from '../components/badge.js';
import Tooltip from '../components/tooltip.js';
import Loader from '../components/loader.js';
import BackToTop from '../components/back-to-top.js';
import Card from '../components/card.js';
import Modal from '../components/modal.js';

const camel = (s) => s.replace(/-([a-z])/g, (_, c) => c.toUpperCase());

/**
 * One tag: the component class, the attributes it watches, which of them are numbers
 * (everything else stays a string or a boolean - `content="123"` is the text "123"),
 * and the methods copied onto the tag.
 */
const SHELLS = {
    'domma-badge': {
        make: (el, o) => new Badge(el, o),
        attrs: ['variant', 'size', 'pill', 'outline', 'removable', 'pulse'],
        methods: ['setVariant', 'setSize', 'setText']
    },
    'domma-number-badge': {
        make: (el, o) => new NumberBadge(el, o),
        attrs: ['count', 'max', 'variant', 'dot', 'pulse', 'border-color', 'label'],
        numbers: ['count', 'max'],
        methods: ['setCount', 'increment', 'decrement', 'getCount', 'setDot', 'setVariant', 'setPulse']
    },
    'domma-tooltip': {
        make: (el, o) => new Tooltip(el, o),
        attrs: ['content', 'position', 'placement', 'trigger', 'delay', 'hide-delay', 'animation', 'offset', 'html', 'visible', 'max-width'],
        numbers: ['delay', 'hideDelay', 'offset'],
        methods: ['show', 'hide', 'toggle', 'isVisible', 'setContent', 'setPosition']
    },
    'domma-loader': {
        make: (el, o) => new Loader(el, o),
        attrs: ['type', 'size', 'color', 'overlay', 'text', 'centered', 'visible'],
        methods: ['show', 'hide', 'toggle', 'isVisible', 'setText', 'setType', 'setSize', 'setColor'],
        visible: true
    },
    'domma-back-to-top': {
        make: (el, o) => new BackToTop(el, o),
        attrs: ['show-after', 'duration', 'position', 'offset', 'target', 'z-index', 'label'],
        numbers: ['showAfter', 'duration', 'offset', 'zIndex'],
        methods: ['scroll', 'show', 'hide', 'toggle', 'isVisible', 'getButton', 'setShowAfter', 'setPosition', 'setOffset']
    },
    'domma-card': {
        make: (el, o) => new Card(el, o),
        attrs: ['hoverable', 'shadow', 'rounded', 'animation', 'animation-duration', 'collapsible', 'collapsed', 'persist-key', 'title', 'icon'],
        numbers: ['animationDuration'],
        methods: ['collapse', 'expand', 'toggle', 'isCollapsed', 'setShadow', 'setHoverable', 'setContent', 'getBody', 'updateHeight']
    },
    'domma-modal': {
        make: (el, o) => new Modal(el, o),
        attrs: ['backdrop', 'backdrop-close', 'keyboard', 'animation', 'animation-duration', 'close-button', 'size',
            'centered', 'scrollable', 'title', 'footer', 'visible'],
        numbers: ['animationDuration'],
        methods: ['open', 'close', 'toggle', 'isOpen', 'setTitle', 'setContent', 'setButtons']
    }
};

export const TAGS = Object.keys(SHELLS);
const TAG_SELECTOR = TAGS.join(',');

/** An attribute value as an option: '' / 'true' / 'false' are booleans, listed keys numbers, the rest text. */
function parse(spec, key, value) {
    if (value === null) return undefined;
    if (value === '' || value === 'true') return true;
    if (value === 'false') return false;
    if ((spec.numbers || []).includes(key) && value.trim() !== '' && !isNaN(value)) return Number(value);
    return value;
}

function optionsFrom(el, spec) {
    const o = {};
    for (const attr of spec.attrs) {
        if (el.hasAttribute(attr)) o[camel(attr)] = parse(spec, camel(attr), el.getAttribute(attr));
    }
    return o;
}

function shellClass(spec) {
    const Base = typeof HTMLElement === 'undefined' ? class {} : HTMLElement;
    class Shell extends Base {
        static get observedAttributes() {
            return spec.attrs;
        }

        connectedCallback() {
            // Built once: moving the tag keeps the component and its listeners.
            if (!this.dommaInstance) this.dommaInstance = spec.make(this, optionsFrom(this, spec));
        }

        attributeChangedCallback(name, oldValue, newValue) {
            if (!this.dommaInstance || oldValue === newValue) return;
            const key = camel(name);
            this.dommaInstance.setOptions({[key]: parse(spec, key, newValue)});
        }

        /** The E.* instance this tag carries (also `E.get(tag)`). */
        get instance() {
            return this.dommaInstance;
        }

        setOptions(options) {
            this.dommaInstance?.setOptions(options);
            return this;
        }

        destroy() {
            this.dommaInstance?.destroy();
            this.dommaInstance = null;
        }
    }
    for (const name of spec.methods) {
        Shell.prototype[name] = function shellMethod(...args) {
            const inst = this.dommaInstance;
            if (!inst) return undefined;
            const result = inst[name](...args);
            return result === inst ? this : result;
        };
    }
    return Shell;
}

let defined = false;
let observer = null;

/** Define every `<domma-*>` tag. Safe to call more than once; does nothing outside a browser. */
export function registerComponents() {
    if (defined || typeof customElements === 'undefined' || typeof HTMLElement === 'undefined') return;
    defined = true;
    observer?.disconnect();
    observer = null;
    for (const [tag, spec] of Object.entries(SHELLS)) {
        if (!customElements.get(tag)) customElements.define(tag, shellClass(spec));
    }
}

/** Define the tags when `root` contains one. */
export function registerIfPresent(root = typeof document !== 'undefined' ? document : null) {
    if (defined || !root || typeof root.querySelector !== 'function') return;
    if (root.querySelector(TAG_SELECTOR)) registerComponents();
}

function watchForTags() {
    if (defined || typeof MutationObserver === 'undefined' || !document.documentElement) return;
    observer = new MutationObserver((records) => {
        for (const r of records) {
            for (const node of r.addedNodes) {
                if (node.nodeType !== 1) continue;
                if (TAGS.includes(node.localName) || node.querySelector?.(TAG_SELECTOR)) {
                    registerComponents();
                    return;
                }
            }
        }
    });
    observer.observe(document.documentElement, {childList: true, subtree: true});
}

if (typeof document !== 'undefined' && typeof customElements !== 'undefined') {
    const start = () => {
        registerIfPresent();
        watchForTags();
    };
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, {once: true});
    else start();
}

// Base class and theme helper for Domma.component() (src/component-factory.js).
export {DommaElement, getThemeVariables} from './base/domma-element.js';
