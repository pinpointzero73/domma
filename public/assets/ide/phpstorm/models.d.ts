/**
 * Domma Models Module - TypeScript Declarations
 * Pub/Sub events and reactive data binding
 */

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

    /** Remove every occurrence, in place. Notifies even when nothing matched. */
    remove(item: T): ObservableArray<T>;

    /** Empty the array, in place. */
    removeAll(): ObservableArray<T>;
}

/**
 * A lazily-evaluated, dependency-tracked derived value.
 */
export interface ComputedRef<T = any> {
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
