/**
 * Build and register a Custom Element class from a component definition.
 *
 * @template {Record<string, any>} [TData=Record<string, any>]
 * @template {Record<string, any>} [TProps=Record<string, any>]
 * @param {string} tagName     Custom element tag (must contain a hyphen, or `domma-` is prefixed)
 * @param {ComponentDefinition<TData, TProps>} definition  Component definition object
 * @returns {typeof DommaElement|undefined} The element class, or undefined when the tag is already registered
 */
export function createComponent<TData extends Record<string, any> = Record<string, any>, TProps extends Record<string, any> = Record<string, any>>(tagName: string, definition: ComponentDefinition<TData, TProps>): typeof DommaElement | undefined;
export namespace components {
    /**
     * Define and register a new component.
     *
     * @template {Record<string, any>} [TData=Record<string, any>]
     * @template {Record<string, any>} [TProps=Record<string, any>]
     * @param {string} tagName     Custom element tag name
     * @param {ComponentDefinition<TData, TProps>} definition  Component definition
     * @returns {typeof DommaElement|undefined} The element class, or undefined when the tag is already registered
     */
    function define<TData extends Record<string, any> = Record<string, any>, TProps extends Record<string, any> = Record<string, any>>(tagName: string, definition: ComponentDefinition<TData, TProps>): typeof DommaElement | undefined;
    /**
     * Returns true if a component with this tag name has been registered.
     * @param {string} tagName
     * @returns {boolean}
     */
    function has(tagName: string): boolean;
    /**
     * Returns a copy of the component registry (for tooling / inspection).
     * @returns {Map<string, ComponentDefinition>}
     */
    function registry(): Map<string, ComponentDefinition>;
    const templateCache: Map<string, string>;
}
/**
 * Valid primitive type tokens for component props.
 */
export type PropType = "string" | "number" | "boolean" | "array" | "object" | "any";
/**
 * A declared prop: an HTML attribute coerced to a type. `number` -> Number (NaN -> null),
 * `boolean` -> '' / 'true' are true, 'false' false; `array` / `object` -> JSON.parse (the raw
 * string when it is not JSON); anything else stays a string.
 */
export type PropDefinition = {
    /**
     * - Expected type - a token or an `M.types.*` constant
     */
    type?: PropType | ((value: any) => boolean);
    /**
     * - Marks the prop as required (documentation only - not enforced)
     */
    required?: boolean;
    /**
     * - Value used when the attribute is absent; a function is called for it
     */
    default?: any;
};
/**
 * `this` inside a component's hooks, computed properties and methods. Computed properties are
 * also on it as getters (`this.fullName`) and methods as bound functions (`this.save()`).
 */
export type ComponentContext<TData extends Record<string, any> = Record<string, any>, TProps extends Record<string, any> = Record<string, any>> = {
    /**
     * - Live, read-tracked view of the reactive data; reads inside a computed register a dependency
     */
    data: TData;
    /**
     * - Resolved prop values after type coercion (a copy)
     */
    props: TProps;
    /**
     * - The Shadow DOM root of this component
     */
    root: ShadowRoot;
    /**
     * - The host Custom Element
     */
    el: HTMLElement;
    /**
     * - Batch-update reactive data fields; bound template text updates surgically, then `onUpdated` runs
     */
    set: (updates: Partial<TData>) => void;
};
/**
 * A component definition for `Domma.component(tagName, definition)`.
 */
export type ComponentDefinition<TData extends Record<string, any> = Record<string, any>, TProps extends Record<string, any> = Record<string, any>> = {
    /**
     * - Inline Mustache template string. Use `templateUrl` for non-trivial templates
     */
    template?: string;
    /**
     * - URL to an external HTML template file, fetched once and cached across all instances
     */
    templateUrl?: string;
    /**
     * - Declared HTML attributes (camelCase name, kebab-case attribute) with type coercion and defaults
     */
    props?: Record<string, PropDefinition>;
    /**
     * - Factory returning the component's initial reactive state; called once per instance. Declare every field here
     */
    data?: () => TData;
    /**
     * - Derived values, memoised and recalculated when a field they read changes; available in templates and as `this.name`
     */
    computed?: Record<string, (this: ComponentContext<TData, TProps>) => any>;
    /**
     * - Functions bound to the component context; callable as `this.name()` and from `data-on-*` bindings
     */
    methods?: Record<string, (this: ComponentContext<TData, TProps>, ...args: any[]) => any>;
    /**
     * - Scoped CSS injected into the component's Shadow DOM `<style>` block
     */
    style?: string;
    /**
     * - Called before the template is rendered. Data and props are available
     */
    onBeforeMount?: (this: ComponentContext<TData, TProps>) => void;
    /**
     * - Called after the template is rendered and bindings are established (again when the element is re-connected)
     */
    onMount?: (this: ComponentContext<TData, TProps>) => void;
    /**
     * - Called once per flush after any data change, and after a prop change re-renders
     */
    onUpdated?: (this: ComponentContext<TData, TProps>) => void;
    /**
     * - Called when the element is removed from the DOM, before clean-up
     */
    onBeforeUnmount?: (this: ComponentContext<TData, TProps>) => void;
    /**
     * - Called after the element is removed and cleaned up
     */
    onUnmount?: (this: ComponentContext<TData, TProps>) => void;
    /**
     * - Called when an observed attribute (prop) changes, with the camelCase prop name and the raw attribute values
     */
    onPropsChanged?: (this: ComponentContext<TData, TProps>, name: string, oldValue: string | null, newValue: string | null) => void;
};
/**
 * Binding controller returned by `TemplateCompiler.compile()` (domma-reactive): surgical updates
 * for bound fields, full re-renders for structural changes.
 */
export type TemplateBindings = import("../vendor/domma-reactive.js").BindingController;
/**
 * The `components` namespace (`Domma.components`).
 */
export type Components = typeof components;
import { DommaElement } from './web-components/base/domma-element.js';
