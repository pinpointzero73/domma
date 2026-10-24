export default Domma;
/**
 * `$.setup()` input: page-wide switches, then selectors, each with a {@link SelectorConfig}.
 */
export type DommaSetupConfig = DommaSetupOptions & {
    [selector: string]: import("./config.js").SelectorConfig | string | boolean | (() => void) | undefined;
};
/**
 * The page-wide switches `$.setup()` reads before the selectors.
 */
export type DommaSetupOptions = {
    /**
     * false: reveal the page now and stop cloaking it
     */
    cloak?: boolean;
    /**
     * true: switch Domma's theming off (bring your own styles)
     */
    noStyles?: boolean;
    /**
     * Theme to start, e.g. 'ocean-dark'
     */
    theme?: string;
    /**
     * Follow the system light/dark preference
     */
    autoDetectTheme?: boolean;
    /**
     * false: do not remember the theme (default true)
     */
    persistTheme?: boolean;
    /**
     * true: run `I.scan()` over the page
     */
    scanIcons?: boolean;
    /**
     * Runs once, before the selectors
     */
    $init?: () => void;
};
/**
 * The Domma function and everything on it. `$` is the same function.
 */
export type DommaStatic = typeof Domma & DommaExtras;
/**
 * Statics attached outside this file: `noConflict` by installGlobals() (globals.js), `flags` / `FL` by the
 * opt-in domma-flags bundle.
 */
export type DommaExtras = {
    /**
     * Give `$` and `_` back to whatever owned them before
     * Domma loaded (jQuery, Lodash). With `deep`, give back every short alias (`window.Domma` stays). Returns
     * Domma, so `const dm = Domma.noConflict()` keeps a handle.
     */
    noConflict: (deep?: boolean) => DommaStatic;
    /**
     * Nation flags - present when domma-flags is loaded
     */
    flags?: import("./flags.js").Flags;
    /**
     * Alias for `flags` (opt-in module)
     */
    FL?: import("./flags.js").Flags;
};
/**
 * Wrap elements in a {@link DommaCollection}: a CSS selector, an HTML string (`'<li>One</li>'`), an element,
 * a NodeList, an array of elements or another collection.
 * @overload
 * @param {import('./dom.js').DommaSelector} selector - CSS selector, HTML string, element(s) or a collection
 * @param {Document | Element | DocumentFragment} [context] - Where to look for a CSS selector (default: document)
 * @returns {import('./dom.js').DommaCollection}
 */
export function Domma(selector: import("./dom.js").DommaSelector, context?: Document | Element | DocumentFragment): import("./dom.js").DommaCollection;
/**
 * Run a function when the DOM is ready (straight away if it already is).
 * @overload
 * @param {() => void} callback
 * @returns {import('./dom.js').DommaCollection} An empty collection
 */
export function Domma(callback: () => void): import("./dom.js").DommaCollection;
export namespace Domma {
    export let version: string;
    export namespace buildInfo {
        let version_1: string;
        export { version_1 as version };
        export let built: string;
        export let commit: string;
    }
    export { http };
    export { utils };
    /**
     * Set up components, initial state and events declaratively, keyed by selector.
     * @param {DommaSetupConfig} config
     * @returns {void}
     */
    export function setup(config: DommaSetupConfig): void;
    /**
     * Update the configuration for a selector (deep merged) and apply the changes.
     * @param {string} selector
     * @param {Partial<import('./config.js').SelectorConfig>} changes
     * @returns {import('./config.js').SelectorConfig} The merged configuration
     */
    export function update(selector: string, changes: Partial<import("./config.js").SelectorConfig>): import("./config.js").SelectorConfig;
    /**
     * Retrieve the configuration of every selector
     * @overload
     * @returns {Record<string, SelectorConfig>}
     */
    export function config(): Record<string, import("./config.js").SelectorConfig>;
    /**
     * Retrieve configuration for a selector
     * @overload
     * @param {string} selector - Selector to get config for
     * @returns {SelectorConfig | null} Configuration object or null if not found
     */
    export function config(selector: string): import("./config.js").SelectorConfig | null;
    /**
     * Retrieve the live component instance created for a selector.
     *
     * $.setup() keeps instances internally, so page code has no other way to
     * reach them - calling a component's methods (modal.open(), tabs.show(),
     * timer.start()) requires this accessor.
     *
     * @overload
     * @returns {Map<string, any>} Every instance, by selector
     */
    export function getComponent(): Map<string, any>;
    /**
     * @overload
     * @param {string} selector - Selector the component was configured under
     * @returns {any} The instance, or null
     */
    export function getComponent(selector: string): any;
    export function reset(selector?: string): void;
    export function ready(callback: () => void): void;
    export { models };
    export { elements };
    export { effects };
    export { dates };
    export { tables };
    export { forms };
    export { smoothCaret };
    export { theme };
    export { icons };
    export { storage };
    export { auth };
    export { router };
    export { sanitizeModule as sanitize };
    export { components };
    export { i18n };
    /**
     * Translate a key - shortcut for `Domma.i18n.t()`.
     * @param {string} key
     * @param {Record<string, any> | null} [params] - Values for `{name}` placeholders, `count` for plurals
     * @param {import('./i18n.js').I18nTranslateOptions} [options]
     * @returns {string}
     */
    export function t(key: string, params?: Record<string, any> | null, options?: import("./i18n.js").I18nTranslateOptions): string;
    /**
     * Shorthand for Domma.components.define() - register a standalone component.
     * Usage: Domma.component('tag-name', definition)
     *
     * @param {string} tagName
     * @param {import('./component-factory.js').ComponentDefinition} definition
     * @returns {ReturnType<typeof createComponent>}
     */
    export function component(tagName: string, definition: import("./component-factory.js").ComponentDefinition): ReturnType<typeof createComponent>;
    export { DesktopNotification };
    export { M };
    export { D };
    export { S };
    export { A };
    export { F };
    export { H };
    export { E };
    export { I };
    export { T };
    export { R };
    export { B };
    export { isDomma };
}
/**
 * The Domma function and everything on it. `$` is the same function.
 * @typedef {typeof Domma & DommaExtras} DommaStatic
 */
/**
 * Statics attached outside this file: `noConflict` by installGlobals() (globals.js), `flags` / `FL` by the
 * opt-in domma-flags bundle.
 * @typedef {object} DommaExtras
 * @property {(deep?: boolean) => DommaStatic} noConflict Give `$` and `_` back to whatever owned them before
 *   Domma loaded (jQuery, Lodash). With `deep`, give back every short alias (`window.Domma` stays). Returns
 *   Domma, so `const dm = Domma.noConflict()` keeps a handle.
 * @property {import('./flags.js').Flags} [flags] Nation flags - present when domma-flags is loaded
 * @property {import('./flags.js').Flags} [FL] Alias for `flags` (opt-in module)
 */
/** @type {DommaStatic} */
export const $: DommaStatic;
/** @type {typeof utils} */
export const _: typeof utils;
/** @type {typeof models} */
export const M: typeof models;
/** @type {typeof dates} */
export const D: typeof dates;
/** @type {typeof storage} */
export const S: typeof storage;
/** @type {typeof auth} */
export const A: typeof auth;
/** @type {typeof forms} */
export const F: typeof forms;
/** @type {typeof http} */
export const H: typeof http;
/** @type {typeof elements} */
export const E: typeof elements;
/** @type {typeof icons} */
export const I: typeof icons;
/** @type {typeof tables} */
export const T: typeof tables;
/** @type {typeof router} */
export const R: typeof router;
/**
 * Blueprint composition: `B.extend`, `B.pick`, `B.omit` (the same functions as `M.extend` / `M.pick` / `M.omit`).
 * @type {{extend: typeof models.extend, pick: typeof models.pick, omit: typeof models.omit}}
 */
export const B: {
    extend: typeof models.extend;
    pick: typeof models.pick;
    omit: typeof models.omit;
};
import { components } from './component-factory.js';
import { smoothCaret } from './smooth-caret.js';
import { i18n } from './i18n.js';
import { http } from './http.js';
import { utils } from './utils.js';
import { models } from './models.js';
import { elements } from './elements.js';
import effects from './effects.js';
import { dates } from './dates.js';
import { tables } from './tables.js';
import { forms } from './forms.js';
import { theme } from './theme.js';
import { icons } from './icons.js';
import { storage } from './storage.js';
import { auth } from './auth.js';
import { router } from './router.js';
import sanitizeModule from './sanitize.js';
import { createComponent } from './component-factory.js';
import { DesktopNotification } from './elements.js';
import { isDomma } from './dom.js';
export { components, smoothCaret, i18n };
