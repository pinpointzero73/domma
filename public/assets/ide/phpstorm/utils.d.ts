/**
 * Domma Utils Module - TypeScript Declarations
 * 120+ Lodash-compatible utility functions
 */

export type Collection<T> = T[] | Record<string, T>;
export type Iteratee<T, R> = (value: T, index: number | string, collection: Collection<T>) => R;
export type Predicate<T> = (value: T, index: number | string, collection: Collection<T>) => boolean;
export type PropertyIteratee<T> = ((value: T) => any) | keyof T;

export interface DebounceOptions {
    leading?: boolean;
    trailing?: boolean;
    maxWait?: number;
}

export interface ThrottleOptions {
    leading?: boolean;
    trailing?: boolean;
}

export interface TruncateOptions {
    length?: number;
    omission?: string;
    separator?: string | RegExp;
}

export interface TemplateOptions {
    partials?: Record<string, string>;
    helpers?: Record<string, (...args: any[]) => any>;
}

export interface DebouncedFunction<T extends (...args: any[]) => any> {
    (...args: Parameters<T>): ReturnType<T>;

    cancel(): void;

    flush(): ReturnType<T>;
}

export interface MemoizedFunction<T extends (...args: any[]) => any> {
    (...args: Parameters<T>): ReturnType<T>;

    cache: Map<any, ReturnType<T>>;
}

export interface Utils {
    // ============================================
    // Array Utilities
    // ============================================

    /** Creates an array of elements split into groups of the specified size */
    chunk<T>(array: T[], size?: number): T[][];

    /** Creates an array with all falsy values removed */
    compact<T>(array: T[]): T[];

    /** Creates a new array concatenating array with additional arrays/values */
    concat<T>(array: T[], ...values: (T | T[])[]): T[];

    /** Creates an array of values not included in the other given arrays */
    difference<T>(array: T[], ...values: T[][]): T[];

    /** Creates a slice of array with n elements dropped from the beginning */
    drop<T>(array: T[], n?: number): T[];

    /** Creates a slice of array with n elements dropped from the end */
    dropRight<T>(array: T[], n?: number): T[];

    /** Fills elements of array with value from start up to end */
    fill<T>(array: T[], value: T, start?: number, end?: number): T[];

    /** Returns the index of the first element predicate returns truthy for */
    findIndex<T>(array: T[], predicate: Predicate<T>, fromIndex?: number): number;

    /** Returns the index of the last element predicate returns truthy for */
    findLastIndex<T>(array: T[], predicate: Predicate<T>, fromIndex?: number): number;

    /** Gets the first element of array */
    first<T>(array: T[]): T | undefined;

    /** Alias for first */
    head<T>(array: T[]): T | undefined;

    /** Flattens array a single level deep */
    flatten<T>(array: (T | T[])[]): T[];

    /** Recursively flattens array */
    flattenDeep<T>(array: any[]): T[];

    /** Flattens array up to depth times */
    flattenDepth<T>(array: any[], depth?: number): T[];

    /** Returns an object composed from key-value pairs */
    fromPairs<T>(pairs: [string, T][]): Record<string, T>;

    /** Gets the index at which the first occurrence of value is found */
    indexOf<T>(array: T[], value: T, fromIndex?: number): number;

    /** Gets all but the last element of array */
    initial<T>(array: T[]): T[];

    /** Creates an array of unique values that are included in all given arrays */
    intersection<T>(...arrays: T[][]): T[];

    /** Converts all elements in array into a string separated by separator */
    join<T>(array: T[], separator?: string): string;

    /** Gets the last element of array */
    last<T>(array: T[]): T | undefined;

    /** Gets the index at which the last occurrence of value is found */
    lastIndexOf<T>(array: T[], value: T, fromIndex?: number): number;

    /** Gets the element at index n of array (supports negative indices) */
    nth<T>(array: T[], n?: number): T | undefined;

    /** Removes all given values from array (mutates) */
    pull<T>(array: T[], ...values: T[]): T[];

    /** Removes elements from array corresponding to indexes (mutates) */
    pullAt<T>(array: T[], ...indexes: (number | number[])[]): T[];

    /** Reverses array (mutates) */
    reverse<T>(array: T[]): T[];

    /** Creates a slice of array from start up to end */
    slice<T>(array: T[], start?: number, end?: number): T[];

    /** Gets all but the first element of array */
    tail<T>(array: T[]): T[];

    /** Creates a slice of array with n elements taken from the beginning */
    take<T>(array: T[], n?: number): T[];

    /** Creates a slice of array with n elements taken from the end */
    takeRight<T>(array: T[], n?: number): T[];

    /** Creates an array of unique values, in order, from all given arrays */
    union<T>(...arrays: T[][]): T[];

    /** Creates a duplicate-free version of an array */
    uniq<T>(array: T[]): T[];

    /** Creates a duplicate-free version using iteratee */
    uniqBy<T>(array: T[], iteratee: (value: T) => any): T[];

    /** Creates an array excluding all given values */
    without<T>(array: T[], ...values: T[]): T[];

    /** Creates an array of unique values that is the symmetric difference */
    xor<T>(...arrays: T[][]): T[];

    /** Creates an array of grouped elements */
    zip<T>(...arrays: T[][]): T[][];

    /** Creates an object composed from arrays of keys and values */
    zipObject<T>(keys: string[], values?: T[]): Record<string, T>;

    /** Invokes the iteratee n times, returning an array of the results */
    times<T>(n: number, iteratee?: (index: number) => T): T[];

    /** Creates an array of numbers from start up to, but not including, end */
    range(end: number): number[];

    range(start: number, end: number, step?: number): number[];

    /** Generates a unique ID. If prefix is given, the ID is appended to it */
    uniqueId(prefix?: string): string;

    // ============================================
    // Collection Utilities
    // ============================================

    /** Creates an object composed of keys generated from running each element through iteratee */
    countBy<T>(collection: Collection<T>, iteratee: (value: T) => string | number): Record<string, number>;

    /** Iterates over elements invoking iteratee for each element */
    each<T>(collection: Collection<T>, iteratee: Iteratee<T, void>): Collection<T>;

    /** Alias for each */
    forEach<T>(collection: Collection<T>, iteratee: Iteratee<T, void>): Collection<T>;

    /** Iterates over elements in reverse invoking iteratee for each element */
    eachRight<T>(collection: Collection<T>, iteratee: Iteratee<T, void>): Collection<T>;

    /** Alias for eachRight */
    forEachRight<T>(collection: Collection<T>, iteratee: Iteratee<T, void>): Collection<T>;

    /** Checks if predicate returns truthy for all elements of collection */
    every<T>(collection: Collection<T>, predicate: Predicate<T>): boolean;

    /** Returns an array of all elements predicate returns truthy for */
    filter<T>(collection: Collection<T>, predicate: Predicate<T>): T[];

    /** Returns the first element predicate returns truthy for */
    find<T>(collection: Collection<T>, predicate: Predicate<T>): T | undefined;

    /** Returns the last element predicate returns truthy for */
    findLast<T>(collection: Collection<T>, predicate: Predicate<T>): T | undefined;

    /** Creates a flattened array of values by running each element through iteratee */
    flatMap<T, R>(collection: Collection<T>, iteratee: Iteratee<T, R | R[]>): R[];

    /** Recursively flattens the mapped results */
    flatMapDeep<T, R>(collection: Collection<T>, iteratee: Iteratee<T, any>): R[];

    /** Creates an object composed of keys generated from running each element through iteratee */
    groupBy<T>(collection: Collection<T>, iteratee: PropertyIteratee<T>): Record<string, T[]>;

    /** Checks if value is in collection */
    includes<T>(collection: Collection<T> | string, value: T | string, fromIndex?: number): boolean;

    /** Creates an object with keys generated from running each element through iteratee */
    keyBy<T>(collection: Collection<T>, iteratee: PropertyIteratee<T>): Record<string, T>;

    /** Creates an array of values by running each element through iteratee */
    map<T, R>(collection: Collection<T>, iteratee: Iteratee<T, R>): R[];

    /** Creates an array of elements sorted by the specified iteratees */
    orderBy<T>(collection: Collection<T>, iteratees: PropertyIteratee<T> | PropertyIteratee<T>[], orders?: ('asc' | 'desc') | ('asc' | 'desc')[]): T[];

    /** Creates an array of elements split into two groups */
    partition<T>(collection: Collection<T>, predicate: Predicate<T>): [T[], T[]];

    /** Reduces collection to a value */
    reduce<T, R>(collection: Collection<T>, iteratee: (accumulator: R, value: T, index: number | string, collection: Collection<T>) => R, accumulator?: R): R;

    /** Reduces collection from right to left */
    reduceRight<T, R>(collection: Collection<T>, iteratee: (accumulator: R, value: T, index: number | string, collection: Collection<T>) => R, accumulator?: R): R;

    /** Returns elements predicate does not return truthy for */
    reject<T>(collection: Collection<T>, predicate: Predicate<T>): T[];

    /** Gets a random element from collection */
    sample<T>(collection: Collection<T>): T | undefined;

    /** Gets n random elements from collection */
    sampleSize<T>(collection: Collection<T>, n?: number): T[];

    /** Creates a shuffled array using Fisher-Yates shuffle */
    shuffle<T>(collection: Collection<T>): T[];

    /** Gets the size of collection */
    size(collection: Collection<any> | string | null | undefined): number;

    /** Checks if predicate returns truthy for any element of collection */
    some<T>(collection: Collection<T>, predicate: Predicate<T>): boolean;

    /** Creates an array of elements sorted by iteratee */
    sortBy<T>(collection: Collection<T>, iteratee: PropertyIteratee<T>): T[];

    // ============================================
    // Function Utilities
    // ============================================

    /** Creates a function that invokes func once it's called n or more times */
    after<T extends (...args: any[]) => any>(n: number, func: T): T;

    /** Creates a function that invokes func, with up to n arguments */
    ary<T extends (...args: any[]) => any>(func: T, n?: number): T;

    /** Creates a function that invokes func while it's called less than n times */
    before<T extends (...args: any[]) => any>(n: number, func: T): T;

    /** Creates a function that invokes func with the this binding of thisArg */
    bind<T extends (...args: any[]) => any>(func: T, thisArg: any, ...partials: any[]): T;

    /** Creates a function that accepts arguments and returns a curried function */
    curry<T extends (...args: any[]) => any>(func: T, arity?: number): (...args: any[]) => any;

    /** Like curry but arguments are processed right to left */
    curryRight<T extends (...args: any[]) => any>(func: T, arity?: number): (...args: any[]) => any;

    /** Creates a debounced function that delays invoking func until after wait ms */
    debounce<T extends (...args: any[]) => any>(func: T, wait?: number, options?: DebounceOptions): DebouncedFunction<T>;

    /** Defers invoking the func until the current call stack has cleared */
    defer<T extends (...args: any[]) => any>(func: T, ...args: Parameters<T>): number;

    /** Invokes func after wait milliseconds */
    delay<T extends (...args: any[]) => any>(func: T, wait: number, ...args: Parameters<T>): number;

    /** Creates a function that invokes func with arguments reversed */
    flip<T extends (...args: any[]) => any>(func: T): T;

    /** Creates a function that memoizes the result of func */
    memoize<T extends (...args: any[]) => any>(func: T, resolver?: (...args: Parameters<T>) => any): MemoizedFunction<T>;

    /** Creates a function that negates the result of the predicate func */
    negate<T extends (...args: any[]) => boolean>(predicate: T): T;

    /** Creates a function that is restricted to invoking func once */
    once<T extends (...args: any[]) => any>(func: T): T;

    /** Creates a function that invokes func with partials prepended */
    partial<T extends (...args: any[]) => any>(func: T, ...partials: any[]): (...args: any[]) => ReturnType<T>;

    /** Creates a function that invokes func with partials appended */
    partialRight<T extends (...args: any[]) => any>(func: T, ...partials: any[]): (...args: any[]) => ReturnType<T>;

    /** Creates a throttled function that only invokes func at most once per every wait ms */
    throttle<T extends (...args: any[]) => any>(func: T, wait?: number, options?: ThrottleOptions): DebouncedFunction<T>;

    /** Creates a function that accepts up to one argument */
    unary<T extends (...args: any[]) => any>(func: T): (arg: Parameters<T>[0]) => ReturnType<T>;

    /** Creates a function that provides value to wrapper as its first argument */
    wrap<T, R>(value: T, wrapper: (value: T, ...args: any[]) => R): (...args: any[]) => R;

    // ============================================
    // Object Utilities
    // ============================================

    /** Assigns own enumerable properties of source objects to the destination object */
    assign<T extends object>(object: T, ...sources: object[]): T;

    /** Like assign but iterates over own and inherited source properties */
    assignIn<T extends object>(object: T, ...sources: object[]): T;

    /** Alias for assignIn */
    extend<T extends object>(object: T, ...sources: object[]): T;

    /** Creates an array of values corresponding to paths of object */
    at<T extends object>(object: T, ...paths: (string | string[])[]): any[];

    /** Creates a shallow clone of value */
    clone<T>(value: T): T;

    /** Creates a deep clone of value */
    cloneDeep<T>(value: T): T;

    /** Assigns properties of source objects for destination properties that resolve to undefined */
    defaults<T extends object>(object: T, ...sources: object[]): T;

    /** Like defaults but recursively assigns default properties */
    defaultsDeep<T extends object>(object: T, ...sources: object[]): T;

    /** Creates an array of own enumerable string keyed-value pairs */
    entries<T extends object>(object: T): [string, T[keyof T]][];

    /** Alias for entries */
    toPairs<T extends object>(object: T): [string, T[keyof T]][];

    /** Returns the key of the first element predicate returns truthy for */
    findKey<T extends object>(object: T, predicate: (value: T[keyof T], key: string, object: T) => boolean): string | undefined;

    /** Returns the key of the last element predicate returns truthy for */
    findLastKey<T extends object>(object: T, predicate: (value: T[keyof T], key: string, object: T) => boolean): string | undefined;

    /** Iterates over own and inherited enumerable properties of an object */
    forIn<T extends object>(object: T, iteratee: (value: T[keyof T], key: string, object: T) => void | false): T;

    /** Iterates over own enumerable properties of an object */
    forOwn<T extends object>(object: T, iteratee: (value: T[keyof T], key: string, object: T) => void | false): T;

    /** Gets the value at path of object */
    get<T>(object: any, path: string | string[], defaultValue?: T): T;

    /** Checks if path is a direct property of object */
    has(object: any, path: string | string[]): boolean;

    /** Creates an object composed of the inverted keys and values of object */
    invert<T extends object>(object: T): Record<string, string>;

    /** Like invert but accepts iteratee which is invoked for each element */
    invertBy<T extends object>(object: T, iteratee?: (value: T[keyof T]) => string): Record<string, string[]>;

    /** Creates an array of the own enumerable property names of object */
    keys<T extends object>(object: T): string[];

    /** Creates an array of own and inherited enumerable property names */
    keysIn<T extends object>(object: T): string[];

    /** Creates an object with the same values and keys generated by iteratee */
    mapKeys<T extends object>(object: T, iteratee: (value: T[keyof T], key: string, object: T) => string): Record<string, T[keyof T]>;

    /** Creates an object with the same keys and values generated by iteratee */
    mapValues<T extends object, R>(object: T, iteratee: (value: T[keyof T], key: string, object: T) => R): Record<string, R>;

    /** Recursively merges own and inherited enumerable properties of source objects */
    merge<T extends object>(object: T, ...sources: object[]): T;

    /** Creates an object composed of the own properties that are not omitted */
    omit<T extends object, K extends keyof T>(object: T, ...paths: (K | K[])[]): Omit<T, K>;

    /** Creates an object composed of the properties predicate doesn't return truthy for */
    omitBy<T extends object>(object: T, predicate: (value: T[keyof T], key: string) => boolean): Partial<T>;

    /** Creates an object composed of the picked object properties */
    pick<T extends object, K extends keyof T>(object: T, ...paths: (K | K[])[]): Pick<T, K>;

    /** Creates an object composed of the properties predicate returns truthy for */
    pickBy<T extends object>(object: T, predicate: (value: T[keyof T], key: string) => boolean): Partial<T>;

    /** Sets the value at path of object */
    set<T extends object>(object: T, path: string | string[], value: any): T;

    /** Removes the property at path of object */
    unset(object: any, path: string | string[]): boolean;

    /** Sets the value at path of object if the resolved value is undefined */
    setIfUndefined<T extends object>(object: T, path: string | string[], value: any): T;

    /** Creates an array of own enumerable string keyed property values of object */
    values<T extends object>(object: T): T[keyof T][];

    /** Creates an array of own and inherited enumerable property values */
    valuesIn<T extends object>(object: T): any[];

    // ============================================
    // Lang Utilities (Type Checking)
    // ============================================

    /** Checks if value is an Array */
    isArray(value: any): value is any[];

    /** Checks if value is a boolean primitive or object */
    isBoolean(value: any): value is boolean;

    /** Checks if value is a Date object */
    isDate(value: any): value is Date;

    /** Checks if value is an empty object, collection, map, or set */
    isEmpty(value: any): boolean;

    /** Performs a deep comparison between two values */
    isEqual(value: any, other: any): boolean;

    /** Checks if object contains equivalent property values */
    isMatch(object: any, source: any): boolean;

    /** Checks if value is a finite number */
    isFinite(value: any): value is number;

    /** Checks if value is a Function object */
    isFunction(value: any): value is (...args: any[]) => any;

    /** Checks if value is an integer */
    isInteger(value: any): value is number;

    /** Checks if value is NaN */
    isNaN(value: any): boolean;

    /** Checks if value is null or undefined */
    isNil(value: any): value is null | undefined;

    /** Checks if value is null */
    isNull(value: any): value is null;

    /** Checks if value is a number primitive or object */
    isNumber(value: any): value is number;

    /** Checks if value is the language type of Object */
    isObject(value: any): value is object;

    /** Checks if value is a plain object */
    isPlainObject(value: any): value is Record<string, any>;

    /** Checks if value is a RegExp object */
    isRegExp(value: any): value is RegExp;

    /** Checks if value is a string primitive or object */
    isString(value: any): value is string;

    /** Checks if value is a Symbol primitive */
    isSymbol(value: any): value is symbol;

    /** Checks if value is undefined */
    isUndefined(value: any): value is undefined;

    // ============================================
    // Type Conversion Utilities
    // ============================================

    /** Converts string to an integer of the specified radix */
    parseInt(string: string | number, radix?: number): number;

    /** Converts value to a number */
    toNumber(value: any): number;

    /** Converts value to an integer */
    toInteger(value: any): number;

    /** Converts value to a finite number */
    toFinite(value: any): number;

    /** Converts value to a safe integer */
    toSafeInteger(value: any): number;

    /** Converts value to a string */
    toString(value: any): string;

    /** Converts value to an array */
    toArray<T>(value: T[] | Iterable<T> | Record<string, T> | string): T[] | string[];

    /** Casts value as an array if it's not one */
    castArray<T>(...args: T[]): T[];

    /** Converts value to an integer suitable for use as array length */
    toLength(value: any): number;

    /** Converts value to a plain object flattening inherited properties */
    toPlainObject(value: any): Record<string, any>;

    // ============================================
    // Math Utilities
    // ============================================

    /** Adds two numbers */
    add(augend: number, addend: number): number;

    /** Computes number rounded up to precision */
    ceil(number: number, precision?: number): number;

    /** Divide two numbers */
    divide(dividend: number, divisor: number): number;

    /** Computes number rounded down to precision */
    floor(number: number, precision?: number): number;

    /** Computes the maximum value of array */
    max(array: number[]): number | undefined;

    /** Computes the maximum value of array with iteratee */
    maxBy<T>(array: T[], iteratee: PropertyIteratee<T>): T | undefined;

    /** Computes the mean of the values in array */
    mean(array: number[]): number;

    /** Computes the mean using iteratee */
    meanBy<T>(array: T[], iteratee: PropertyIteratee<T>): number;

    /** Computes the minimum value of array */
    min(array: number[]): number | undefined;

    /** Computes the minimum value of array with iteratee */
    minBy<T>(array: T[], iteratee: PropertyIteratee<T>): T | undefined;

    /** Multiply two numbers */
    multiply(multiplier: number, multiplicand: number): number;

    /** Computes number rounded to precision */
    round(number: number, precision?: number): number;

    /** Subtract two numbers */
    subtract(minuend: number, subtrahend: number): number;

    /** Computes the sum of the values in array */
    sum(array: number[]): number;

    /** Computes the sum using iteratee */
    sumBy<T>(array: T[], iteratee: PropertyIteratee<T>): number;

    // ============================================
    // Number Utilities
    // ============================================

    /** Clamps number within the inclusive lower and upper bounds */
    clamp(number: number, upper: number): number;

    clamp(number: number, lower: number, upper: number): number;

    /** Checks if n is between start and up to but not including end */
    inRange(number: number, end: number): boolean;

    inRange(number: number, start: number, end: number): boolean;

    /** Produces a random number between the inclusive lower and upper bounds */
    random(floating?: boolean): number;

    random(upper: number, floating?: boolean): number;

    random(lower: number, upper: number, floating?: boolean): number;

    // ============================================
    // String Utilities
    // ============================================

    /** Converts string to camel case */
    camelCase(string: string): string;

    /** Converts the first character to upper case and remaining to lower case */
    capitalize(string: string): string;

    /** Checks if string ends with the given target string */
    endsWith(string: string, target: string, position?: number): boolean;

    /** Converts HTML special characters to HTML entities */
    escape(string: string): string;

    /** Converts string to kebab case */
    kebabCase(string: string): string;

    /** Converts string, as space separated words, to lower case */
    lowerCase(string: string): string;

    /** Converts the first character of string to lower case */
    lowerFirst(string: string): string;

    /** Pads string on the left and right sides if it's shorter than length */
    pad(string?: string, length?: number, chars?: string): string;

    /** Pads string on the right side if it's shorter than length */
    padEnd(string?: string, length?: number, chars?: string): string;

    /** Pads string on the left side if it's shorter than length */
    padStart(string?: string, length?: number, chars?: string): string;

    /** Repeats the given string n times */
    repeat(string?: string, n?: number): string;

    /** Replaces matches for pattern in string with replacement */
    replace(string?: string, pattern?: string | RegExp, replacement?: string): string;

    /** Converts string to snake case */
    snakeCase(string: string): string;

    /** Splits string by separator */
    split(string?: string, separator?: string | RegExp, limit?: number): string[];

    /** Converts string to start case */
    startCase(string: string): string;

    /** Checks if string starts with the given target string */
    startsWith(string: string, target: string, position?: number): boolean;

    /** Converts string to lowercase */
    toLower(string: string): string;

    /** Converts string to uppercase */
    toUpper(string: string): string;

    /** Removes leading and trailing whitespace or specified characters */
    trim(string?: string, chars?: string): string;

    /** Removes trailing whitespace or specified characters */
    trimEnd(string?: string, chars?: string): string;

    /** Removes leading whitespace or specified characters */
    trimStart(string?: string, chars?: string): string;

    /** Truncates string if it's longer than the given maximum string length */
    truncate(string?: string, options?: TruncateOptions): string;

    /** Converts HTML entities to their corresponding characters */
    unescape(string: string): string;

    /** Converts string, as space separated words, to upper case */
    upperCase(string: string): string;

    /** Converts the first character of string to upper case */
    upperFirst(string: string): string;

    /** Splits string into an array of its words */
    words(string?: string, pattern?: string | RegExp): string[];

    /** Returns a formatted string using printf-style format specifiers */
    sprintf(format: string, ...args: any[]): string;

    /** Alias for sprintf */
    format(format: string, ...args: any[]): string;

    // ============================================
    // Template Engine
    // ============================================

    /** Compiles a template string into a reusable function */
    template(template: string, options?: TemplateOptions): (data?: Record<string, any>) => string;

    /** Renders a template string with the given data (one-shot) */
    render(template: string, data: Record<string, any>, options?: TemplateOptions): string;
}

export declare const utils: Utils;
