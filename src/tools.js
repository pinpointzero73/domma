/**
 * Domma Tools Bundle
 * Developer tools for theme customisation, page building, and content editing
 *
 * Load after domma.min.js:
 * <script src="domma.min.js"></script>
 * <script src="domma-tools.min.js"></script>
 */

import {ThemeRoller} from './theme-roller.js';
import {PageRoller} from './page-roller.js';
import Editor from './editor.js';

// Factory functions
const tools = {
    themeRoller(selector, options = {}) {
        const instance = new ThemeRoller(selector, options);
        if (instance.element && typeof Domma !== 'undefined') {
            Domma.elements._instances.set(instance.element, instance);
        }
        return instance;
    },

    pageRoller(selector, options = {}) {
        const instance = new PageRoller(selector, options);
        if (instance.element && typeof Domma !== 'undefined') {
            Domma.elements._instances.set(instance.element, instance);
        }
        return instance;
    },

    editor(selector, options = {}) {
        const instance = new Editor(selector, options);
        if (instance.element && typeof Domma !== 'undefined') {
            Domma.elements._instances.set(instance.element, instance);
        }
        return instance;
    }
};

// Attach to Domma.elements when available
if (typeof Domma !== 'undefined' && Domma.elements) {
    Domma.elements.themeRoller = tools.themeRoller;
    Domma.elements.pageRoller = tools.pageRoller;
    Domma.elements.editor = tools.editor;
}

// Also expose as DommaTools for direct access
if (typeof window !== 'undefined') {
    window.DommaTools = tools;
}

export {tools, ThemeRoller, PageRoller, Editor};
export default tools;
