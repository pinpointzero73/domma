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
export * from './smooth-caret';

// Import types for the main Domma object
import {DommaCollection} from './dom';
import {Utils, utils} from './utils';
import {Dates, dates, DommaDate} from './dates';
import {Model, models, Models} from './models';
import {SelectorConfig, SetupConfig} from './config';
import {Elements, elements} from './elements';
import {Tables, tables} from './tables';
import {Storage, storage} from './storage';
import {Http, http} from './http';
import {Theme, theme} from './theme';
import {Icons, icons} from './icons';
import {Flags} from './flags';
import {SmoothCaret} from './smooth-caret';

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

    /** Utility functions (Lodash-compatible) */
    utils: Utils;

    /** Date manipulation (Moment.js-style) */
    dates: Dates;

    /** Reactive models & pub/sub */
    models: Models;

    /** UI components */
    elements: Elements;

    /** Smooth caret enhancement for editable text controls. */
    smoothCaret: SmoothCaret;

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

    /** Nation flags (opt-in module - present when domma-flags is loaded) */
    flags?: Flags;

    /** Alias for {@link DommaStatic.flags} (opt-in module) */
    FL?: Flags;

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

    /**
     * Give `$` and `_` back to whatever owned them before Domma loaded (jQuery, Lodash).
     * With `deep`, give back every short alias and `window.Domma` too.
     * @returns Domma, so `const dm = Domma.noConflict()` keeps a handle
     */
    noConflict(deep?: boolean): DommaStatic;
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

// Named exports for ES modules - exactly what src/index.js exports
declare const $: DommaStatic;
declare const _: Utils;
declare const M: Models;
declare const D: Dates;
declare const S: Storage;
declare const H: Http;
declare const E: Elements;
declare const I: Icons;
declare const T: Tables;
declare const smoothCaret: SmoothCaret;
// Not typed yet: auth, forms, router, blueprint helpers, web-component registry
declare const A: any;
declare const F: any;
declare const R: any;
declare const B: any;
declare const components: any;

export {Domma, $, _, M, D, S, A, F, H, E, I, T, R, B, components, smoothCaret};
export type {DommaCollection, DommaDate, Model};

/** Options read from `window.DommaOptions` when Domma loads - set it before the script tag. */
export interface DommaLoadOptions {
    /** true (default): every alias; 'safe': only aliases nobody else owns; false: window.Domma only */
    globals?: boolean | 'safe';
    /** false: never add the `dm-cloaked` class */
    cloak?: boolean;
    /** false: don't initialise the theme engine automatically */
    theme?: boolean;
    /** false: no console warning when DOMPurify is missing */
    purifyWarning?: boolean;
    /** false: no deprecation warnings */
    deprecationWarnings?: boolean;
}

declare global {
    interface Window {
        DommaOptions?: DommaLoadOptions;
    }
}
