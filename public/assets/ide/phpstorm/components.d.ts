/**
 * Domma Components
 * Vue-style standalone Custom Elements with reactive data, computed properties,
 * lifecycle hooks, and surgical DOM binding - built on Web Components / Shadow DOM.
 */

// ============================================
// Prop Definition
// ============================================

/** Valid primitive type tokens for component props */
export type PropType = 'string' | 'number' | 'boolean' | 'array' | 'object' | 'any';

export interface PropDefinition {
    /** Expected type - use M.types.* constants */
    type?: PropType;
    /** Whether the prop is required (logs a warning if missing) */
    required?: boolean;
    /** Default value used when the attribute is absent */
    default?: any;
}

// ============================================
// Component Context - `this` inside hooks/methods
// ============================================

export interface ComponentContext<
    TData extends Record<string, any> = Record<string, any>,
    TProps extends Record<string, any> = Record<string, any>
> {
    /** Snapshot of the current reactive data */
    data: TData;
    /** Resolved prop values after type coercion */
    props: TProps;
    /** The Shadow DOM root of this component */
    root: ShadowRoot;
    /** The host Custom Element */
    el: HTMLElement;

    /**
     * Batch-update reactive data fields.
     * Merges the given partial object into current data, then triggers
     * surgical DOM binding updates and `onUpdated`.
     * @param updates - Partial data object to merge
     */
    set(updates: Partial<TData>): void;
}

// ============================================
// Component Definition
// ============================================

export interface ComponentDefinition<
    TData extends Record<string, any> = Record<string, any>,
    TProps extends Record<string, any> = Record<string, any>
> {
    /** Inline Mustache template string. Use `templateUrl` for non-trivial templates. */
    template?: string;

    /**
     * URL to an external HTML template file.
     * Fetched once and cached across all instances.
     */
    templateUrl?: string;

    /**
     * Declared HTML attributes with type coercion and default values.
     *
     * @example
     * props: {
     *   userId:     { type: M.types.number,  required: true },
     *   showAvatar: { type: M.types.boolean, default: true  }
     * }
     */
    props?: Record<string, PropDefinition>;

    /**
     * Factory function returning the component's initial reactive state.
     * Called once per instance.
     */
    data?(): TData;

    /**
     * Derived values recalculated after each reactive update.
     * Available in templates and via `this.computedName` inside methods.
     *
     * @example
     * computed: {
     *   initials() { return this.data.name.split(' ').map(n => n[0]).join(''); }
     * }
     */
    computed?: Record<string, (this: ComponentContext<TData, TProps>) => any>;

    /**
     * Functions bound to the component context.
     * Call via `this.methodName()` inside other methods or lifecycle hooks.
     */
    methods?: Record<string, (this: ComponentContext<TData, TProps>, ...args: any[]) => any>;

    /**
     * Scoped CSS injected into the component's Shadow DOM `<style>` block.
     * Selectors only match elements inside this component.
     */
    style?: string;

    // ── Lifecycle hooks ────────────────────────────────────────────────────

    /** Called before the template is rendered. Data and props are available. */
    onBeforeMount?(this: ComponentContext<TData, TProps>): void | Promise<void>;

    /** Called after the template is rendered and bindings are established. */
    onMount?(this: ComponentContext<TData, TProps>): void | Promise<void>;

    /**
     * Called after any `this.set()` call triggers a DOM update.
     * @param changedData - The partial data object that was passed to `set()`
     */
    onUpdated?(this: ComponentContext<TData, TProps>, changedData?: Partial<TData>): void;

    /** Called before the element is removed from the DOM. */
    onBeforeUnmount?(this: ComponentContext<TData, TProps>): void;

    /** Called after the element is removed and cleaned up. */
    onUnmount?(this: ComponentContext<TData, TProps>): void;

    /**
     * Called when an observed attribute (prop) changes.
     * @param name     - camelCase prop name
     * @param oldValue - previous value (type-coerced)
     * @param newValue - new value (type-coerced)
     */
    onPropsChanged?(
        this: ComponentContext<TData, TProps>,
        name: string,
        oldValue: any,
        newValue: any
    ): void;
}

// ============================================
// DommaElement - Base class for all Domma Web Components
// ============================================

/**
 * Base HTMLElement class that all registered Domma components extend.
 * Provides Shadow DOM initialisation, tracked event listeners, and programmatic control.
 */
export declare class DommaElement extends HTMLElement {
    /** The open Shadow DOM root attached to this element */
    readonly shadowRoot: ShadowRoot;

    /**
     * Update component options programmatically.
     * Merges `newOptions` into the existing options and, if the subclass
     * implements `_applyOptions()`, applies them immediately.
     * @param newOptions - Partial options to merge
     * @returns `this` for chaining
     */
    setOptions(newOptions: Record<string, any>): this;

    /**
     * Remove all tracked event listeners and detach the element from the DOM.
     */
    destroy(): void;
}

// ============================================
// Template Bindings - returned by TemplateCompiler.compile()
// ============================================

/**
 * Binding controller returned by `TemplateCompiler.compile()`.
 * Enables surgical textContent updates for text-only bindings, with full
 * re-renders reserved for structural changes (conditions, lists, attributes).
 */
export interface TemplateBindings {
    /** Root field names classified as structural (require a full re-render) */
    readonly structural: Set<string>;
    /** Root field names classified as text-only (surgically updatable) */
    readonly text: Set<string>;

    /**
     * Surgically update a text-only field without re-rendering the entire template.
     * Handles direct bindings (`"name"`) and nested-path bindings (`"name.first"`).
     * @param rootField - Root field name (the part before the first `.`)
     * @param newValue  - New value to display
     * @returns `true` if any DOM nodes were updated
     */
    update(rootField: string, newValue: any): boolean;

    /**
     * Full re-render: replace container content and rebuild the binding registry.
     * Required when a structural field changes (conditions, iteration, attribute values).
     * @param newData - Complete merged data context to render with
     */
    rerender(newData: Record<string, any>): void;

    /**
     * Returns `true` if the named field is classified as structural
     * (used in `{{#if}}`, `{{#each}}`, or attribute value expressions).
     */
    isStructural(field: string): boolean;
}

// ============================================
// Components Namespace
// ============================================

export interface Components {
    /**
     * Register a component and define its Custom Element.
     * Alias for `Domma.component()`.
     *
     * @param tagName    - Custom element tag name (must contain a hyphen)
     * @param definition - Component definition object
     */
    define(tagName: string, definition: ComponentDefinition): void;

    /**
     * Returns `true` if a component with the given tag name has been registered.
     */
    has(tagName: string): boolean;

    /**
     * Returns a Map of all registered components, keyed by tag name.
     */
    registry(): Map<string, ComponentDefinition>;

    /** Template cache shared across all component instances (URL → HTML string) */
    readonly templateCache: Map<string, string>;
}
