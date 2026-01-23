/**
 * Domma TypeScript Definitions
 * Dynamic Object Manipulation & Modeling API
 *
 * A lightweight, zero-dependency JavaScript framework combining
 * jQuery-style DOM manipulation, Lodash utilities, and modern UI components.
 *
 * NOTE: This is a consolidated type definition file for the Domma framework.
 * For complete type definitions, see: https://dommajs.org/assets/ide/phpstorm/
 */

// ============================================
// DOM Module - jQuery-compatible API
// ============================================

export interface DommaCollection {
    length: number;
    [index: number]: HTMLElement;

    // Traversal
    find(selector: string): DommaCollection;
    children(selector?: string): DommaCollection;
    parent(selector?: string): DommaCollection;
    parents(selector?: string): DommaCollection;
    closest(selector: string): DommaCollection;
    siblings(selector?: string): DommaCollection;
    next(selector?: string): DommaCollection;
    prev(selector?: string): DommaCollection;
    first(): DommaCollection;
    last(): DommaCollection;
    eq(index: number): DommaCollection;
    filter(selector: string | ((index: number, element: HTMLElement) => boolean)): DommaCollection;
    not(selector: string): DommaCollection;
    is(selector: string): boolean;
    has(selector: string): DommaCollection;

    // Content
    html(): string;
    html(content: string): DommaCollection;
    text(): string;
    text(content: string): DommaCollection;
    val(): string | string[] | number;
    val(value: string | string[] | number): DommaCollection;

    // Attributes
    attr(name: string): string | undefined;
    attr(name: string, value: string | number | boolean): DommaCollection;
    attr(attributes: Record<string, any>): DommaCollection;
    removeAttr(name: string): DommaCollection;
    prop(name: string): any;
    prop(name: string, value: any): DommaCollection;
    data(key: string): any;
    data(key: string, value: any): DommaCollection;

    // CSS & Classes
    css(property: string): string;
    css(property: string, value: string | number): DommaCollection;
    css(properties: Record<string, string | number>): DommaCollection;
    addClass(className: string): DommaCollection;
    removeClass(className: string): DommaCollection;
    toggleClass(className: string): DommaCollection;
    hasClass(className: string): boolean;

    // Manipulation
    append(content: string | HTMLElement | DommaCollection): DommaCollection;
    prepend(content: string | HTMLElement | DommaCollection): DommaCollection;
    after(content: string | HTMLElement | DommaCollection): DommaCollection;
    before(content: string | HTMLElement | DommaCollection): DommaCollection;
    remove(): DommaCollection;
    empty(): DommaCollection;
    clone(deep?: boolean): DommaCollection;

    // Events
    on(event: string, handler: (e: Event) => void): DommaCollection;
    on(event: string, selector: string, handler: (e: Event) => void): DommaCollection;
    off(event: string, handler?: (e: Event) => void): DommaCollection;
    one(event: string, handler: (e: Event) => void): DommaCollection;
    trigger(event: string, data?: any): DommaCollection;
    click(handler?: (e: MouseEvent) => void): DommaCollection;
    change(handler?: (e: Event) => void): DommaCollection;
    submit(handler?: (e: Event) => void): DommaCollection;

    // Effects
    show(duration?: number): DommaCollection;
    hide(duration?: number): DommaCollection;
    toggle(duration?: number): DommaCollection;
    fadeIn(duration?: number): DommaCollection;
    fadeOut(duration?: number): DommaCollection;
    slideUp(duration?: number): DommaCollection;
    slideDown(duration?: number): DommaCollection;

    // Dimensions
    width(): number;
    width(value: number | string): DommaCollection;
    height(): number;
    height(value: number | string): DommaCollection;
    offset(): { top: number; left: number };
    scrollTop(): number;
    scrollTop(value: number): DommaCollection;

    // Iteration
    each(callback: (index: number, element: HTMLElement) => void | boolean): DommaCollection;
}

export function dom(selector: string | HTMLElement | NodeList | DommaCollection, context?: HTMLElement | Document): DommaCollection;

// ============================================
// Utils Module - Lodash-compatible API
// ============================================

export interface Utils {
    // Array
    chunk<T>(array: T[], size: number): T[][];
    compact<T>(array: T[]): T[];
    difference<T>(array: T[], ...values: T[][]): T[];
    flatten<T>(array: any[]): T[];
    uniq<T>(array: T[]): T[];
    sortBy<T>(collection: T[], iteratee: string | ((item: T) => any)): T[];
    zip<T>(...arrays: T[][]): T[][];

    // Collection
    each<T>(collection: T[] | Record<string, T>, iteratee: (value: T, key: string | number) => void | boolean): T[] | Record<string, T>;
    filter<T>(collection: T[], predicate: (value: T) => boolean): T[];
    find<T>(collection: T[], predicate: (value: T) => boolean): T | undefined;
    groupBy<T>(collection: T[], iteratee: string | ((value: T) => any)): Record<string, T[]>;
    map<T, U>(collection: T[], iteratee: (value: T) => U): U[];
    reduce<T, U>(collection: T[], iteratee: (acc: U, value: T) => U, initial: U): U;

    // Function
    debounce<T extends (...args: any[]) => any>(func: T, wait: number): T;
    throttle<T extends (...args: any[]) => any>(func: T, wait: number): T;
    memoize<T extends (...args: any[]) => any>(func: T): T;
    once<T extends (...args: any[]) => any>(func: T): T;

    // Object
    get(object: any, path: string, defaultValue?: any): any;
    set(object: any, path: string, value: any): any;
    has(object: any, path: string): boolean;
    pick<T>(object: T, ...paths: string[]): Partial<T>;
    omit<T>(object: T, ...paths: string[]): Partial<T>;
    merge<T>(...objects: Partial<T>[]): T;
    cloneDeep<T>(value: T): T;

    // Lang
    isArray(value: any): value is any[];
    isObject(value: any): value is object;
    isFunction(value: any): value is Function;
    isEmpty(value: any): boolean;
    isEqual(value: any, other: any): boolean;

    // String
    camelCase(string: string): string;
    kebabCase(string: string): string;
    snakeCase(string: string): string;
    capitalize(string: string): string;
    truncate(string: string, length: number): string;

    // Math
    sum(array: number[]): number;
    mean(array: number[]): number;
    max(array: number[]): number;
    min(array: number[]): number;
    clamp(number: number, lower: number, upper: number): number;
    random(lower?: number, upper?: number): number;

    // Template
    template(templateString: string): (data: any) => string;
    render(templateString: string, data: any): string;

    // Browser
    copyToClipboard(text: string): Promise<void>;
}

export const utils: Utils;

// ============================================
// Dates Module - Moment.js-style API
// ============================================

export interface DommaDate {
    // Format
    format(format: string): string;
    toISOString(): string;
    unix(): number;

    // Manipulate
    add(value: number, unit: string): DommaDate;
    subtract(value: number, unit: string): DommaDate;
    startOf(unit: string): DommaDate;
    endOf(unit: string): DommaDate;
    set(unit: string, value: number): DommaDate;

    // Getters
    year(): number;
    month(): number;
    date(): number;
    day(): number;
    hour(): number;
    minute(): number;
    second(): number;

    // Compare
    isBefore(date: DommaDate | string | number): boolean;
    isAfter(date: DommaDate | string | number): boolean;
    isSame(date: DommaDate | string | number): boolean;
    isBetween(start: DommaDate | string | number, end: DommaDate | string | number): boolean;
    diff(date: DommaDate | string | number, unit?: string): number;

    // Relative
    fromNow(): string;
    from(date: DommaDate | string | number): string;
    toNow(): string;
    to(date: DommaDate | string | number): string;
}

export interface Dates {
    (date?: string | number | Date): DommaDate;
    now(): DommaDate;
    parse(dateString: string): DommaDate;
    isValid(date: any): boolean;
}

export const dates: Dates;

// ============================================
// Models Module - Reactive Models & Pub/Sub
// ============================================

export interface BlueprintField {
    type: 'string' | 'number' | 'boolean' | 'email' | 'password' | 'url' | 'date' | 'textarea' | 'select' | 'radio' | 'checkbox-group' | 'array' | 'object' | 'any';
    required?: boolean;
    minLength?: number;
    maxLength?: number;
    min?: number;
    max?: number;
    pattern?: RegExp;
    options?: Array<{ value: any; label: string }>;
    custom?: (value: any, allData?: any) => string | void;
    label?: string;
    rows?: number;
    schema?: Blueprint;
    formConfig?: {
        placeholder?: string;
        tooltip?: string;
        class?: string;
        prefix?: string;
        autocomplete?: string;
        readonly?: boolean;
        [key: string]: any;
    };
}

export interface Blueprint {
    [key: string]: BlueprintField;
}

export interface Model {
    get(key: string): any;
    set(key: string, value: any): void;
    set(data: Record<string, any>): void;
    toJSON(): Record<string, any>;
    validate(): Array<{ field: string; message: string }>;
    onChange(callback: (changes: Record<string, any>) => void): void;
    onChange(field: string, callback: (newValue: any, oldValue: any) => void): void;
    offChange(callback?: Function): void;
    reset(clearStorage?: boolean): void;
    save(): void;
    load(): void;
    clearStorage(): void;
    isPersisted(): boolean;
}

export interface Models {
    // Model creation
    create(blueprint: Blueprint, initialData?: any, options?: { persist?: string }): Model;

    // Blueprint composition
    extend(...blueprints: Blueprint[]): Blueprint;
    pick(blueprint: Blueprint, fields: string[]): Blueprint;
    omit(blueprint: Blueprint, fields: string[]): Blueprint;

    // Pub/Sub
    subscribe(event: string, callback: Function): void;
    publish(event: string, data?: any): void;
    unsubscribe(event: string, callback?: Function): void;
    once(event: string, callback: Function): void;

    // DOM Binding
    bind(model: Model, field: string, selector: string, options?: any): void;
    unbind(model: Model, field: string, selector: string): void;

    // Types
    types: {
        string: string;
        number: string;
        boolean: string;
        array: string;
        object: string;
        date: string;
        any: string;
    };
}

export const models: Models;

// ============================================
// Forms Module - Blueprint-driven Forms
// ============================================

export interface FormOptions {
    layout?: 'stacked' | 'grid' | 'inline';
    gridColumns?: number;
    submitText?: string;
    cancelText?: string;
    showCancel?: boolean;
    onSubmit?: (data: any, form: any) => void | boolean | Promise<void | boolean>;
    onCancel?: () => void;
}

export interface ModalFormOptions {
    title?: string;
    submitText?: string;
    cancelText?: string;
    initialData?: any;
    onSave?: (data: any) => void | Promise<void>;
    onError?: (error: Error) => void;
}

export interface CrudOptions {
    title?: string;
    apiEndpoint?: string;
    columns?: string[];
    pageSize?: number;
    sortable?: boolean;
    exportable?: boolean;
    onBeforeSave?: (data: any) => any;
    onAfterSave?: (data: any) => void;
    onAfterDelete?: (id: string | number) => void;
}

export interface Forms {
    render(selector: string, blueprint: Blueprint, initialData?: any, options?: FormOptions): any;
    modal(blueprint: Blueprint, options?: ModalFormOptions): void;
    wizard(selector: string, steps: Array<{ title: string; blueprint: Blueprint }>, options?: any): any;
    crud(selector: string, blueprint: Blueprint, options?: CrudOptions): any;
}

export const forms: Forms;

// ============================================
// Elements Module - UI Components
// ============================================

export interface Elements {
    // Modal
    modal(selector: string, options?: any): {
        open(): void;
        close(): void;
        toggle(): void;
        isOpen(): boolean;
    };

    // Toast
    toast(message: string, options?: { type?: 'success' | 'danger' | 'info' | 'warning'; duration?: number; position?: string }): void;

    // Dialog
    alert(message: string, options?: any): Promise<void>;
    confirm(message: string, options?: any): Promise<boolean>;
    prompt(message: string, options?: any): Promise<string | null>;

    // Tabs
    tabs(selector: string, options?: any): any;

    // Accordion
    accordion(selector: string, options?: any): any;

    // Tooltip
    tooltip(selector: string, options?: { content?: string; position?: string; trigger?: string }): any;

    // Carousel
    carousel(selector: string, options?: any): any;

    // Loader
    loader(selector: string, options?: { type?: 'spinner' | 'dots' | 'pulse' | 'bars'; size?: string | number; overlay?: boolean; text?: string }): {
        show(): void;
        hide(): void;
        toggle(): void;
    };

    // Card
    card(selector: string, options?: any): any;

    // Dropdown
    dropdown(selector: string, options?: any): any;

    // BackToTop
    backToTop(selector: string, options?: any): any;

    // Slideover
    slideover(selector: string, options?: any): {
        open(): void;
        close(): void;
        toggle(): void;
        isOpen(): boolean;
    };
}

export const elements: Elements;

// ============================================
// Tables Module - DataTable Functionality
// ============================================

export interface Tables {
    create(selector: string, options: {
        data: any[];
        columns: Array<{ field: string; title: string; sortable?: boolean }>;
        pagination?: boolean;
        pageSize?: number;
        selectable?: boolean;
        striped?: boolean;
        evenRowColor?: string;
        oddRowColor?: string;
        hoverColor?: string;
    }): {
        setData(data: any[]): void;
        addRow(row: any): void;
        removeRow(index: number): void;
        search(query: string): void;
        sort(field: string, direction?: 'asc' | 'desc'): void;
        getSelected(): any[];
        download(format: 'csv' | 'json', filename?: string): void;
    };
}

export const tables: Tables;

// ============================================
// Storage Module - localStorage Wrapper
// ============================================

export interface Storage {
    get(key: string, defaultValue?: any): any;
    set(key: string, value: any): void;
    remove(key: string): void;
    has(key: string): boolean;
    clear(): void;
    keys(): string[];
    size(key?: string): number;
    totalSize(): number;
    isAvailable(): boolean;
}

export const storage: Storage;

// ============================================
// HTTP Module - Fetch-based HTTP Client
// ============================================

export interface Http {
    get(url: string, params?: any): Promise<any>;
    post(url: string, data?: any): Promise<any>;
    put(url: string, data?: any): Promise<any>;
    delete(url: string): Promise<any>;
}

export const http: Http;

// ============================================
// Theme Module - Theme Management
// ============================================

export interface Theme {
    init(options?: { theme?: string; autoDetect?: boolean; persist?: boolean }): void;
    set(themeName: string): void;
    setVariant(variant: 'light' | 'dark'): void;
    toggle(): void;
    get(): string;
    getVariant(): string;
}

export const theme: Theme;

// ============================================
// Icons Module - SVG Icon System
// ============================================

export interface Icons {
    render(iconName: string, options?: { size?: number; color?: string; class?: string }): string;
    inject(selector: string, iconName: string, options?: any): void;
    scan(container?: HTMLElement | string): void;
}

export const icons: Icons;

// ============================================
// Config Engine
// ============================================

export interface SetupConfig {
    [selector: string]: {
        component?: string;
        options?: any;
        initial?: any;
        events?: Record<string, (e: Event, el: DommaCollection) => void>;
    };
}

// ============================================
// Blueprint Composition (B Alias)
// ============================================

export interface BlueprintComposition {
    extend(...blueprints: Blueprint[]): Blueprint;
    pick(blueprint: Blueprint, fields: string[]): Blueprint;
    omit(blueprint: Blueprint, fields: string[]): Blueprint;
}

// ============================================
// Main Domma Interface
// ============================================

export interface DommaStatic {
    // DOM selection
    (selector: string | HTMLElement | NodeList | DommaCollection, context?: HTMLElement | Document): DommaCollection;
    (callback: () => void): void;

    // Modules
    dom: typeof dom;
    utils: Utils;
    dates: Dates;
    models: Models;
    elements: Elements;
    tables: Tables;
    storage: Storage;
    http: Http;
    theme: Theme;
    icons: Icons;
    forms: Forms;

    // Config Engine
    setup(config: SetupConfig): void;
    update(selector: string, changes: any): any;
    config(selector?: string): any;
    reset(selector?: string): void;
    ready(callback: () => void): void;

    // Version
    version: string;

    // Aliases (exposed on Domma object)
    M: Models;
    D: Dates;
    S: Storage;
    A: any; // Auth module
    F: Forms;
    H: Http;
    E: Elements;
    I: Icons;
    T: Tables;
    B: BlueprintComposition;
}

// ============================================
// Global Declarations
// ============================================

declare global {
    const Domma: DommaStatic;
    const $: DommaStatic;
    const _: Utils;
    const M: Models;
    const B: BlueprintComposition;
    const D: Dates;
    const S: Storage;
    const A: any; // Auth module
    const F: Forms;
    const H: Http;
    const E: Elements;
    const I: Icons;
    const T: Tables;

    interface Window {
        Domma: DommaStatic;
        $: DommaStatic;
        _: Utils;
        M: Models;
        B: BlueprintComposition;
        D: Dates;
        S: Storage;
        A: any;
        F: Forms;
        H: Http;
        E: Elements;
        I: Icons;
        T: Tables;
    }
}

// ============================================
// Module Exports
// ============================================

declare const Domma: DommaStatic;
export default Domma;

export {
    Domma,
    dom,
    utils,
    dates,
    models,
    forms,
    elements,
    tables,
    storage,
    http,
    theme,
    icons
};
