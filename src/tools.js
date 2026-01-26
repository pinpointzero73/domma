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
import {SchemaBuilder} from './schema-builder.js';
import Editor from './editor.js';
import PrintToPDF from './print-to-pdf.js';

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

    schemaBuilder(selector, options = {}) {
        const instance = new SchemaBuilder(selector, options);
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
    },

    printToPDF(selector, options = {}) {
        const instance = new PrintToPDF(selector, options);
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
    Domma.elements.schemaBuilder = tools.schemaBuilder;
    Domma.elements.editor = tools.editor;
    Domma.elements.printToPDF = tools.printToPDF;
}

// Also expose as DommaTools for direct access
if (typeof window !== 'undefined') {
    window.DommaTools = tools;
}

export {tools, ThemeRoller, PageRoller, SchemaBuilder, Editor, PrintToPDF};
export default tools;
