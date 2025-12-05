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

/**
 * Reactive Model class
 */
export declare class Model {
    constructor(schema: Schema, data?: Record<string, any>, options?: ModelOptions);

    /** Get field value or all data */
    get(): Record<string, any>;
    get(field: string): any;

    /** Set field value(s) */
    set(field: string, value: any): Model;
    set(data: Record<string, any>): Model;

    /** Validate all fields */
    validate(): ValidationResult;

    /** Get model data as JSON */
    toJSON(): Record<string, any>;

    /** Subscribe to any change */
    onChange(callback: ChangeCallback): UnsubscribeFn;

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
