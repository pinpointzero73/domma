/**
 * Domma Web Components
 * Main entry point for Web Components registration and exports
 */

import { DommaBadge } from './components/domma-badge.js';
import { DommaTooltip } from './components/domma-tooltip.js';
import { DommaLoader } from './components/domma-loader.js';
import { DommaBackToTop } from './components/domma-back-to-top.js';

// Component registry
const components = {
    'domma-badge': DommaBadge,
    'domma-tooltip': DommaTooltip,
    'domma-loader': DommaLoader,
    'domma-back-to-top': DommaBackToTop
};

/**
 * Register all Domma Web Components
 * Safe to call multiple times - skips already registered
 */
export function registerComponents() {
    for (const [name, constructor] of Object.entries(components)) {
        if (!customElements.get(name)) {
            customElements.define(name, constructor);
        }
    }
}

/**
 * Register individual component
 */
export function registerComponent(name) {
    if (components[name] && !customElements.get(name)) {
        customElements.define(name, components[name]);
    }
}

/**
 * Add component to registry
 * Used by individual component files
 */
export function registerComponentClass(name, constructor) {
    components[name] = constructor;
}

// Export base class and utilities
export { DommaElement, getThemeVariables } from './base/domma-element.js';
export * from './styles/shared-styles.js';

// Components
export { DommaBadge } from './components/domma-badge.js';
export { DommaTooltip } from './components/domma-tooltip.js';
export { DommaLoader } from './components/domma-loader.js';
export { DommaBackToTop } from './components/domma-back-to-top.js';
// export { DommaToast } from './components/domma-toast.js';
// export { DommaModal } from './components/domma-modal.js';
// export { DommaCard } from './components/domma-card.js';

// Wrappers
export * from './wrappers/legacy-wrappers.js';

// Auto-register components on import
registerComponents();
