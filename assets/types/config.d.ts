/**
 * Domma Config Module - TypeScript Declarations
 * Declarative configuration engine for component initialisation
 */

import {DommaCollection} from './dom';

export type ComponentType = 'card' | 'modal' | 'tabs' | 'accordion' | 'tooltip' | 'carousel' | 'dropdown';

export interface InitialProperties {
    css?: Record<string, string | number>;
    text?: string;
    html?: string;
    addClass?: string;
    removeClass?: string;
    toggleClass?: string;
    attr?: Record<string, string>;
}

export interface EventAction {
    target?: string;
    css?: Record<string, string | number>;
    text?: string;
    html?: string;
    addClass?: string;
    removeClass?: string;
    toggleClass?: string;
    log?: string;
}

export type EventHandler = (event: Event, $el: DommaCollection) => void;
export type EventActions = EventHandler | EventAction | (EventHandler | EventAction)[];

export interface SelectorConfig {
    /** Component type to initialise */
    component?: ComponentType;

    /** Component options */
    options?: Record<string, any>;

    /** Initial state properties to apply */
    initial?: InitialProperties;

    /** Event handlers */
    events?: Record<string, EventActions>;
}

export interface SetupConfig {
    [selector: string]: SelectorConfig;
}

export interface ConfigEngine {
    /**
     * Process initial configuration
     * @param config - Configuration object keyed by selector
     */
    process(config: SetupConfig): void;

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
    /**
     * Retrieve the live component instance created by setup() for a selector.
     * Instances are NOT stored on the element — $(sel).data('component') is
     * always undefined.
     * @param selector - Selector the component was configured under
     */
    getComponent(selector: string): any | null;
    getComponent(): Map<string, any>;

    reset(selector?: string): void;

    /**
     * Initialise a component
     * @param selector - CSS selector
     * @param componentType - Component type name
     * @param options - Component options
     * @returns Component instance
     */
    initComponent(selector: string, componentType: ComponentType, options?: Record<string, any>): any;

    /**
     * Apply properties to DOM elements
     * @param domElements - Domma collection
     * @param properties - Properties to apply
     */
    applyProperties(domElements: DommaCollection, properties: InitialProperties): void;

    /**
     * Bind events to elements
     * @param selector - CSS selector
     * @param events - Event handlers object
     * @param track - Whether to track handlers for later removal
     */
    bindEvents(selector: string, events: Record<string, EventActions>, track?: boolean): void;

    /**
     * Unbind all tracked events for a selector
     * @param selector - CSS selector
     */
    unbindEvents(selector: string): void;

    /**
     * Update events for a selector (replaces existing handlers for same events)
     * @param selector - CSS selector
     * @param newEvents - New event handlers
     */
    updateEvents(selector: string, newEvents: Record<string, EventActions>): void;

    /**
     * Execute actions for an event
     * @param event - DOM event
     * @param actions - Actions to execute
     */
    executeActions(event: Event, actions: EventActions): void;
}

export declare const configEngine: ConfigEngine;
