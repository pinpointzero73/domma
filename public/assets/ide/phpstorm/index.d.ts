/**
 * Domma - Dynamic Object Manipulation & Modeling API
 * TypeScript Declaration File
 *
 * A lightweight, zero-dependency JavaScript framework combining
 * jQuery-style DOM manipulation, Lodash utilities, and modern UI components.
 */

// Re-export all module types
export * from './dom';
export * from './utils';
export * from './dates';
export * from './models';
export * from './config';
export * from './elements';
export * from './tables';
export * from './storage';
export * from './http';
export * from './theme';
export * from './icons';
export * from './flags';
export * from './effects';
export * from './components';

// Import types for the main Domma object
import {dom, DommaCollection} from './dom';
import {Utils, utils} from './utils';
import {Dates, dates, DommaDate} from './dates';
import {Model, models, Models} from './models';
import {configEngine, SelectorConfig, SetupConfig} from './config';
import {Elements, elements} from './elements';
import {Tables, tables} from './tables';
import {Storage, storage} from './storage';
import {Http, http} from './http';
import {Theme, theme} from './theme';
import {Icons, icons} from './icons';
import {Flags} from './flags';
import {Effects, effects} from './effects';
import {Components, ComponentDefinition, ComponentContext, DommaElement} from './components';

// ============================================
// Main Domma Interface
// ============================================

export interface DommaStatic {
    /**
     * Create a DommaCollection from a selector, element, or collection
     * @param selector - CSS selector, element, NodeList, or array of elements
     * @param context - Optional context element or document
     * @returns DommaCollection instance
     */
    (selector: string | HTMLElement | NodeList | HTMLCollection | HTMLElement[] | DommaCollection, context?: Document | HTMLElement): DommaCollection;

    /**
     * Execute callback when DOM is ready
     * @param callback - Function to execute when DOM is ready
     */
    (callback: () => void): void;

    /** DOM manipulation module */
    dom: typeof dom;

    /** Utility functions (Lodash-compatible) */
    utils: Utils;

    /** Date manipulation (Moment.js-style) */
    dates: Dates;

    /** Reactive models & pub/sub */
    models: Models;

    /** UI components */
    elements: Elements;

    /** DataTable functionality */
    tables: Tables;

    /** localStorage wrapper */
    storage: Storage;

    /** HTTP client */
    http: Http;

    /** Theme system */
    theme: Theme;

    /** Icon library */
    icons: Icons;

    /** Nation flags (opt-in module — present when domma-flags is loaded) */
    flags?: Flags;

    /** Alias for {@link DommaStatic.flags} (opt-in module) */
    FL?: Flags;

    /** Visual effects and animations */
    effects: Effects;

    /** Vue-style standalone Custom Elements */
    components: Components;

    /**
     * Define and register a standalone component as a Custom Element.
     *
     * @param tagName - Tag name (must contain a hyphen, or auto-prefixed with `domma-`)
     * @param definition - Component definition with template, data, computed, methods, lifecycle
     *
     * @example
     * Domma.component('user-card', {
     *   props: { userId: { type: M.types.number, required: true } },
     *   data() { return { name: '', loading: true }; },
     *   methods: {
     *     async fetchUser() {
     *       const user = await H.get('/api/users/' + this.props.userId);
     *       this.set({ name: user.name, loading: false });
     *     }
     *   },
     *   onMount() { this.fetchUser(); }
     * });
     */
    component(tagName: string, definition: ComponentDefinition): void;

    // ============================================
    // ConfigEngine Methods ($.setup, $.config, etc.)
    // ============================================

    /**
     * Process configuration for selectors
     * @param config - Configuration object keyed by selector
     */
    setup(config: SetupConfig): void;

    /**
     * Update configuration for a selector
     * @param selector - CSS selector
     * @param changes - Changes to merge into existing config
     * @returns The merged configuration
     */
    update(selector: string, changes: Partial<SelectorConfig>): SelectorConfig;

    /**
     * Retrieve configuration for a selector or all selectors
     * @param selector - Optional selector to get config for
     * @returns Configuration object or null if not found
     */
    config(): Record<string, SelectorConfig>;

    config(selector: string): SelectorConfig | null;

    /**
     * Reset/destroy configuration for a selector or all selectors
     * @param selector - Optional selector to reset
     */
    reset(selector?: string): void;

    // ============================================
    // Static Utilities
    // ============================================

    /** Check if value is a DommaCollection */
    isDomma(value: any): value is DommaCollection;

    /** Domma version string */
    version: string;

    /** No-conflict mode - restore previous $ */
    noConflict(): DommaStatic;
}

// ============================================
// Global Declarations
// ============================================

declare global {
    /**
     * Domma - Main entry point
     * jQuery-compatible DOM selection and manipulation
     */
    const Domma: DommaStatic;

    /**
     * $ - Alias for Domma
     * jQuery-compatible selector function
     */
    const $: DommaStatic;

    /**
     * _ - Alias for Domma.utils
     * Lodash-compatible utility functions
     */
    const _: Utils;

    /**
     * M - Alias for Domma.models
     * Reactive models and pub/sub events
     */
    const M: Models;

    /**
     * D - Alias for Domma.dates
     * Moment.js-style date manipulation
     */
    const D: Dates;

    /**
     * S - Alias for Domma.storage
     * localStorage wrapper
     */
    const S: Storage;
}

// ============================================
// Default Export
// ============================================

declare const Domma: DommaStatic;
export default Domma;

// Named exports for ES modules
export {
    Domma,
    dom,
    utils,
    dates,
    models,
    elements,
    tables,
    storage,
    http,
    theme,
    icons,
    configEngine,
    DommaCollection,
    DommaDate,
    Model,
    ComponentDefinition,
    ComponentContext,
    DommaElement
};
