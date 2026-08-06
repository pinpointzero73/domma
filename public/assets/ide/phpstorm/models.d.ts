/**
 * Domma Models Module - TypeScript Declarations
 * Pub/Sub events and reactive data binding
 */

import {DommaCollection} from './dom';

export type TypeValidator = (value: any) => boolean;

export interface FieldDefinition {
    type?: 'string' | 'number' | 'boolean' | 'array' | 'object' | 'date' | 'any';
    default?: any;
    required?: boolean;
    min?: number;
    max?: number;
    minLength?: number;
    maxLength?: number;
    pattern?: RegExp;
    validate?: (value: any) => boolean | string;
}

export interface Schema {
    [field: string]: FieldDefinition;
}

export interface ValidationResult {
    valid: boolean;
    errors: Array<{ field: string; error: string }>;
}

export interface ModelOptions {
    persist?: string;
    autoSave?: boolean;
}

export interface ChangeEvent {
    field: string;
    newValue: any;
    oldValue: any;
    model: Model;
}

export type ChangeCallback = (event: ChangeEvent) => void;
export type FieldChangeCallback = (newValue: any, oldValue: any, model: Model) => void;
export type UnsubscribeFn = () => void;

export interface BindingOptions {
    format?: (value: any) => any;
    parse?: (value: any) => any;
    twoWay?: boolean;
}

export interface ObservableOptions<T = any> {
    /** Change gate. Defaults to domma-reactive's deep equality. */
    equals?: (a: T, b: T) => boolean;
}

/**
 * A single reactive value — the primitive beneath Models.
 */
export interface Observable<T = any> {
    /** Read (tracked) and write. Assigning notifies only on a real change. */
    value: T;

    /** Read without registering a dependency. */
    peek(): T;

    /** Imperative alias for assigning `.value`. */
    set(next: T): void;
}

/**
 * A reactive array whose in-place mutators notify unconditionally.
 */
export interface ObservableArray<T = any> {
    /** The underlying array — tracked on read, gated on wholesale assignment. */
    value: T[];

    /** Tracked item count. */
    readonly length: number;

    /** The live array, without registering a dependency. */
    peek(): T[];

    /** Imperative alias for assigning `.value`. */
    set(next: T[]): void;

    push(...items: T[]): number;

    pop(): T | undefined;

    shift(): T | undefined;

    unshift(...items: T[]): number;

    splice(start: number, deleteCount?: number, ...items: T[]): T[];

    sort(compare?: (a: T, b: T) => number): T[];

    reverse(): T[];

    fill(value: T, start?: number, end?: number): T[];

    copyWithin(target: number, start: number, end?: number): T[];

    /**
     * Remove items in place — every occurrence of a value, or everything a test
     * function accepts. Notifies even when nothing matched.
     */
    remove(match: T | ((item: T, index: number) => boolean)): ObservableArray<T>;

    /** Empty the array, in place. */
    removeAll(): ObservableArray<T>;
}

/**
 * A lazily-evaluated, dependency-tracked derived value.
 */
export interface ComputedRef<T = any> {
    /**
     * The same read as get(), spelled as a property — and the only one a template
     * expression can use, since an expression cannot call a method.
     */
    readonly value: T;

    /** Current value, recomputing only if a dependency changed. */
    get(): T;

    /** Current value without registering a dependency on the caller. */
    peek(): T;

    /** Unlink from the dependency graph. */
    dispose(): void;
}

export interface ComputedOptions<T = any> {
    /** Debug label used in console warnings. */
    label?: string;

    /** Called with the new value whenever it changes. */
    onChange?: (value: T) => void;
}

export interface EffectOptions {
    /** Debug label used in console warnings. */
    label?: string;
}

/**
 * Reactive Model class
 */
export declare class Model {
    constructor(schema: Schema, data?: Record<string, any>, options?: ModelOptions);

    /**
     * Get field value or all data.
     * Reads inside a computed or effect are tracked as dependencies.
     */
    get(): Record<string, any>;
    get(field: string): any;

    /**
     * Read-tracked, write-through view of the model's data.
     * Property reads register a dependency; writes route through set(),
     * preserving validation, change notification and persistence.
     */
    tracked(): Record<string, any>;

    /** Set field value(s) */
    set(field: string, value: any): Model;
    set(data: Record<string, any>): Model;

    /** Validate all fields */
    validate(): ValidationResult;

    /** Get model data as JSON */
    toJSON(): Record<string, any>;

    /** Subscribe to any change; callback receives {field, newValue, oldValue, model} */
    onChange(callback: ChangeCallback): UnsubscribeFn;

    /** Subscribe to changes on a single field; callback receives the same change object */
    onChange(field: string, callback: ChangeCallback): UnsubscribeFn;

    /** Subscribe to specific field change */
    onFieldChange(field: string, callback: FieldChangeCallback): UnsubscribeFn;

    /** Reset model to initial data */
    reset(clearStorage?: boolean): Model;

    /** Destroy model and cleanup */
    destroy(clearStorage?: boolean): void;

    // Persistence Methods

    /** Manually save model to localStorage */
    save(): boolean;

    /** Manually load model from localStorage */
    load(): boolean;

    /** Clear persisted data from localStorage */
    clearStorage(): boolean;

    /** Get the persistence key */
    getPersistKey(): string | null;

    /** Check if model is persisted */
    isPersisted(): boolean;
}

// ============================================
// applyBindings
// ============================================

export interface ApplyBindingsOptions {
    /** Handlers for `data-on-*`. Looked up only when the data has no such key. */
    methods?: Record<string, (...args: any[]) => any>;
    /** Template renderer for `data-each` item bodies. Defaults to `_.render`. */
    render?: (template: string, values: Record<string, any>) => string;
    /** Label used in warnings. */
    template?: string;
}

/**
 * One activated binding. `deps` are the names its expression reads, which is
 * what decides when it re-runs.
 */
export interface ActiveBinding {
    id: string;
    kind: string;
    arg?: string;
    expression?: string;
    deps: Set<string>;
}

export interface BindingHandle {
    bindings: ActiveBinding[];
    /** The binding context expressions resolve against. */
    context(): Record<string, any>;
    /** Re-run every binding against new data. For plain, untracked objects. */
    update(data: Record<string, any>): boolean;
    /**
     * Drop every effect, listener, list instance and marker this call created,
     * restore a hidden `data-if` element, and leave the markup as found.
     */
    dispose(): void;
}

/**
 * A binding handler. Only `update` is required; the rest declare how the
 * binding is discovered and what the compiler prepares for it.
 */
export interface BindingHandler {
    /** An exact attribute name, e.g. `data-model`. */
    attribute?: string;
    /** A prefix, e.g. `data-on-`; the remainder becomes `binding.arg`. */
    attributePrefix?: string;
    /** Parse the attribute value, setting `binding.ast` and `binding.evaluate`. */
    expression?: boolean;
    /** Contribute the expression's dependencies to `binding.deps`. */
    tracks?: boolean;
    /** Own a region of DOM between comment anchors rather than an element. */
    region?: boolean;
    /** Fill `binding.body` with the annotated source of that region. */
    capturesBody?: boolean;
    /** Run `update()` once immediately after the initial paint. */
    primes?: boolean;
    /** Write to the DOM. Receives every node the binding owns at once. */
    update(args: {
        binding: ActiveBinding & { evaluate?: (context: any) => any; body?: string };
        nodes: HTMLElement[];
        context: Record<string, any>;
        render?: (template: string, values: Record<string, any>) => string;
        replaceRegion?: (...args: any[]) => any;
        reindex?: () => void;
        controller?: any;
    }): boolean;
    /** Called once per node, when it is indexed. */
    attach?(args: { binding: any; node: HTMLElement; controller: any }): void;
    /** Called on teardown. */
    detach?(args: { binding: any; node: HTMLElement; controller: any }): void;
}

export interface Store {
    /** Get current state */
    getState(): Record<string, any>;

    /** Update state with partial updates */
    setState(updates: Record<string, any>): void;

    /** Subscribe to state changes */
    subscribe(listener: (state: Record<string, any>, oldState: Record<string, any>) => void): UnsubscribeFn;

    /** Reset state to initial or new state */
    reset(newState?: Record<string, any>): void;
}

export interface TypeValidators {
    string: TypeValidator;
    number: TypeValidator;
    boolean: TypeValidator;
    array: TypeValidator;
    object: TypeValidator;
    date: TypeValidator;
    any: TypeValidator;
}

export interface Models {
    // ============================================
    // Pub/Sub Event System
    // ============================================

    /** Subscribe to an event */
    subscribe(event: string, callback: (data: any) => void): UnsubscribeFn;

    /** Alias for subscribe */
    on(event: string, callback: (data: any) => void): UnsubscribeFn;

    /** Unsubscribe from an event */
    unsubscribe(event: string, callback: (data: any) => void): void;

    /** Alias for unsubscribe */
    off(event: string, callback: (data: any) => void): void;

    /** Publish an event */
    publish(event: string, data?: any): void;

    /** Alias for publish */
    emit(event: string, data?: any): void;

    /** Subscribe to an event once */
    once(event: string, callback: (data: any) => void): UnsubscribeFn;

    /** Clear event listeners */
    clear(event?: string): void;

    // ============================================
    // Model Creation
    // ============================================

    /** Create a new reactive model */
    create(schema: Schema, initialData?: Record<string, any>, options?: ModelOptions): Model;

    /** Extend a blueprint with additional fields */
    extend(...blueprints: Schema[]): Schema;

    /** Pick specific fields from a blueprint */
    pick(blueprint: Schema, fields: string[]): Schema;

    /** Omit specific fields from a blueprint */
    omit(blueprint: Schema, fields: string[]): Schema;

    // ============================================
    // Dependency-Tracked Reactivity
    // ============================================

    /**
     * A single reactive value — the primitive beneath Models. Use `create()`
     * for a schema, validation and persistence; use this for one tracked value.
     */
    observable<T = any>(initial: T, options?: ObservableOptions<T>): Observable<T>;

    /**
     * A reactive array whose in-place mutators notify unconditionally.
     */
    observableArray<T = any>(initial?: T[], options?: ObservableOptions<T[]>): ObservableArray<T>;

    /**
     * Create a lazily-evaluated derived value that tracks whatever it reads.
     * The body must be synchronous — tracking stops at the first `await`.
     */
    computed<T = any>(fn: () => T, options?: ComputedOptions<T>): ComputedRef<T>;

    /**
     * Run a function now, and again whenever any field it read changes.
     * Re-runs are batched into a single microtask flush.
     * Returns a function that stops the effect.
     */
    effect(fn: () => void, options?: EffectOptions): UnsubscribeFn;

    /** Read values without registering them as dependencies. */
    untracked<T = any>(fn: () => T): T;

    /** Settle pending reactive work immediately instead of on the microtask. */
    flush(): void;

    // ============================================
    // Type Validators
    // ============================================

    types: TypeValidators;

    // ============================================
    // DOM Binding
    // ============================================

    /** Bind a model field to DOM element(s) */
    bind(model: Model, field: string, selector: string | HTMLElement, options?: BindingOptions): UnsubscribeFn;

    /**
     * Activate every binding attribute under a root on markup that already
     * exists — `data-bind-*`, `data-model`, `data-on-*`, `data-if`, `data-each`.
     *
     * Pass a Model and bindings read and write through it. `{{ }}` is not
     * interpolated here; `data-bind-text` is the supported spelling.
     */
    applyBindings(
        data: Model | Record<string, any>,
        root: string | HTMLElement | DommaCollection,
        options?: ApplyBindingsOptions
    ): BindingHandle;

    /** Add a binding kind, usable as `data-<name>`. */
    registerBinding(name: string, handler: BindingHandler): BindingHandler;

    /** Remove a binding kind added with registerBinding(). */
    unregisterBinding(name: string): boolean;

    /** Add a function callable from a binding expression, e.g. `upper(name)`. */
    registerHelper(name: string, fn: (...args: any[]) => any): void;

    /** Remove a helper added with registerHelper(). */
    unregisterHelper(name: string): boolean;

    // ============================================
    // Store (Simple State Management)
    // ============================================

    /** Get or create a named store */
    store(name: string, initialState?: Record<string, any>): Store;

    /** Get an existing store */
    getStore(name: string): Store | undefined;

    /** Remove a store */
    removeStore(name: string): void;
}

export declare const models: Models;
