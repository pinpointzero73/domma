export namespace utils {
    /**
     * Creates an array of elements split into groups of the specified size.
     * @template T
     * @param {T[]} array
     * @param {number} [size=1]
     * @returns {T[][]}
     */
    function chunk<T>(array: T[], size?: number): T[][];
    /**
     * Creates an array with all falsy values removed.
     * @template T
     * @param {T[]} array
     * @returns {Exclude<T, false | null | 0 | '' | undefined>[]}
     */
    function compact<T>(array: T[]): Exclude<T, false | null | 0 | "" | undefined>[];
    /**
     * Creates a new array concatenating array with additional arrays/values.
     * @template T
     * @param {T[]} array
     * @param {...(T | T[])} values
     * @returns {T[]}
     */
    function concat<T>(array: T[], ...values: (T | T[])[]): T[];
    /**
     * Creates an array of values not included in the other given arrays.
     * @template T
     * @param {T[]} array
     * @param {...T[]} values
     * @returns {T[]}
     */
    function difference<T>(array: T[], ...values: T[][]): T[];
    /**
     * Like `difference`, but accepts an iteratee which is invoked for each element of array and values to generate the criterion by which they're compared.
     * @template T
     * @param {T[]} array
     * @param {T[]} values
     * @param {(value: T) => any} iteratee
     * @returns {T[]}
     */
    function differenceBy<T>(array: T[], values: T[], iteratee: (value: T) => any): T[];
    /**
     * Like `difference`, but accepts a comparator which is invoked to compare elements of array to values.
     * @template T, U
     * @param {T[]} array
     * @param {U[]} values
     * @param {(a: T, b: U) => boolean} comparator
     * @returns {T[]}
     */
    function differenceWith<T, U>(array: T[], values: U[], comparator: (a: T, b: U) => boolean): T[];
    /**
     * Creates a slice of array with n elements dropped from the beginning.
     * @template T
     * @param {T[]} array
     * @param {number} [n=1]
     * @returns {T[]}
     */
    function drop<T>(array: T[], n?: number): T[];
    /**
     * Creates a slice of array with n elements dropped from the end.
     * @template T
     * @param {T[]} array
     * @param {number} [n=1]
     * @returns {T[]}
     */
    function dropRight<T>(array: T[], n?: number): T[];
    /**
     * Creates a slice of array excluding elements dropped from the end.
     * @template T
     * @param {T[]} array
     * @param {(value: T, index: number, array: T[]) => boolean} predicate
     * @returns {T[]}
     */
    function dropRightWhile<T>(array: T[], predicate: (value: T, index: number, array: T[]) => boolean): T[];
    /**
     * Creates a slice of array excluding elements dropped from the beginning.
     * @template T
     * @param {T[]} array
     * @param {(value: T, index: number, array: T[]) => boolean} predicate
     * @returns {T[]}
     */
    function dropWhile<T>(array: T[], predicate: (value: T, index: number, array: T[]) => boolean): T[];
    /**
     * Performs a Same-value-zero comparison between two values to determine if they are equivalent.
     * @param {any} value
     * @param {any} other
     * @returns {boolean}
     */
    function eq(value: any, other: any): boolean;
    /**
     * Fills elements of array with value from start up to end.
     * @template T
     * @param {T[]} array
     * @param {T} value
     * @param {number} [start=0]
     * @param {number} [end]
     * @returns {T[]}
     */
    function fill<T>(array: T[], value: T, start?: number, end?: number): T[];
    /**
     * Returns the index of the first element predicate returns truthy for.
     * @template T
     * @param {T[]} array
     * @param {(value: T, index: number, array: T[]) => boolean} predicate
     * @param {number} [fromIndex=0]
     * @returns {number}
     */
    function findIndex<T>(array: T[], predicate: (value: T, index: number, array: T[]) => boolean, fromIndex?: number): number;
    /**
     * Returns the index of the last element predicate returns truthy for.
     * @template T
     * @param {T[]} array
     * @param {(value: T, index: number, array: T[]) => boolean} predicate
     * @param {number} [fromIndex]
     * @returns {number}
     */
    function findLastIndex<T>(array: T[], predicate: (value: T, index: number, array: T[]) => boolean, fromIndex?: number): number;
    /**
     * Gets the first element of array.
     * @template T
     * @param {T[]} array
     * @returns {T | undefined}
     */
    function first<T>(array: T[]): T | undefined;
    /**
     * Alias for first.
     * @template T
     * @param {T[]} array
     * @returns {T | undefined}
     */
    function head<T>(array: T[]): T | undefined;
    /**
     * Flattens array a single level deep.
     * @template T
     * @param {(T | T[])[]} array
     * @returns {T[]}
     */
    function flatten<T>(array: (T | T[])[]): T[];
    /**
     * Recursively flattens array.
     * @template T
     * @param {any[]} array
     * @returns {T[]}
     */
    function flattenDeep<T>(array: any[]): T[];
    /**
     * Flattens array up to depth times.
     * @template T
     * @param {any[]} array
     * @param {number} [depth=1]
     * @returns {T[]}
     */
    function flattenDepth<T>(array: any[], depth?: number): T[];
    /**
     * Returns an object composed from key-value pairs.
     * @template T
     * @param {[PropertyKey, T][]} pairs
     * @returns {Record<string, T>}
     */
    function fromPairs<T>(pairs: [PropertyKey, T][]): Record<string, T>;
    /**
     * Gets the index at which the first occurrence of value is found.
     * @template T
     * @param {T[]} array
     * @param {T} value
     * @param {number} [fromIndex=0]
     * @returns {number}
     */
    function indexOf<T>(array: T[], value: T, fromIndex?: number): number;
    /**
     * Gets all but the last element of array.
     * @template T
     * @param {T[]} array
     * @returns {T[]}
     */
    function initial<T>(array: T[]): T[];
    /**
     * Creates an array of unique values that are included in all given arrays.
     * @template T
     * @param {...T[]} arrays
     * @returns {T[]}
     */
    function intersection<T>(...arrays: T[][]): T[];
    /**
     * Converts all elements in array into a string separated by separator.
     * @param {any[]} array
     * @param {string} [separator=',']
     * @returns {string}
     */
    function join(array: any[], separator?: string): string;
    /**
     * Gets the last element of array.
     * @template T
     * @param {T[]} array
     * @returns {T | undefined}
     */
    function last<T>(array: T[]): T | undefined;
    /**
     * Gets the index at which the last occurrence of value is found.
     * @template T
     * @param {T[]} array
     * @param {T} value
     * @param {number} [fromIndex]
     * @returns {number}
     */
    function lastIndexOf<T>(array: T[], value: T, fromIndex?: number): number;
    /**
     * Gets the element at index n of array.
     * @template T
     * @param {T[]} array
     * @param {number} [n=0]
     * @returns {T | undefined}
     */
    function nth<T>(array: T[], n?: number): T | undefined;
    /**
     * Removes all given values from array.
     * @template T
     * @param {T[]} array
     * @param {...T} values
     * @returns {T[]}
     */
    function pull<T>(array: T[], ...values: T[]): T[];
    /**
     * Removes elements from array corresponding to indexes.
     * @template T
     * @param {T[]} array
     * @param {...(number | number[])} indexes
     * @returns {T[]}
     */
    function pullAt<T>(array: T[], ...indexes: (number | number[])[]): T[];
    /**
     * Reverses array so that the first element becomes the last.
     * @template T
     * @param {T[]} array
     * @returns {T[]}
     */
    function reverse<T>(array: T[]): T[];
    /**
     * Creates a slice of array from start up to end.
     * @template T
     * @param {T[]} array
     * @param {number} [start=0]
     * @param {number} [end]
     * @returns {T[]}
     */
    function slice<T>(array: T[], start?: number, end?: number): T[];
    /**
     * Gets all but the first element of array.
     * @template T
     * @param {T[]} array
     * @returns {T[]}
     */
    function tail<T>(array: T[]): T[];
    /**
     * Creates a slice of array with n elements taken from the beginning.
     * @template T
     * @param {T[]} array
     * @param {number} [n=1]
     * @returns {T[]}
     */
    function take<T>(array: T[], n?: number): T[];
    /**
     * Creates a slice of array with n elements taken from the end.
     * @template T
     * @param {T[]} array
     * @param {number} [n=1]
     * @returns {T[]}
     */
    function takeRight<T>(array: T[], n?: number): T[];
    /**
     * Creates an array of unique values, in order, from all given arrays.
     * @template T
     * @param {...T[]} arrays
     * @returns {T[]}
     */
    function union<T>(...arrays: T[][]): T[];
    /**
     * Creates a duplicate-free version of an array.
     * @template T
     * @param {T[]} array
     * @returns {T[]}
     */
    function uniq<T>(array: T[]): T[];
    /**
     * Creates a duplicate-free version using iteratee.
     * @template T
     * @param {T[]} array
     * @param {(value: T) => any} iteratee
     * @returns {T[]}
     */
    function uniqBy<T>(array: T[], iteratee: (value: T) => any): T[];
    /**
     * Creates an array excluding all given values.
     * @template T
     * @param {T[]} array
     * @param {...T} values
     * @returns {T[]}
     */
    function without<T>(array: T[], ...values: T[]): T[];
    /**
     * Creates an array of unique values that is the symmetric difference.
     * @template T
     * @param {...T[]} arrays
     * @returns {T[]}
     */
    function xor<T>(...arrays: T[][]): T[];
    /**
     * Creates an array of grouped elements.
     * @template T
     * @param {...T[]} arrays
     * @returns {(T | undefined)[][]}
     */
    function zip<T>(...arrays: T[][]): (T | undefined)[][];
    /**
     * Creates an object composed from arrays of keys and values.
     * @template T
     * @param {PropertyKey[]} keys
     * @param {T[]} [values]
     * @returns {Record<string, T | undefined>}
     */
    function zipObject<T>(keys: PropertyKey[], values?: T[]): Record<string, T | undefined>;
    /**
     * Invoke `iteratee` n times (with the index).
     * @template T
     * @overload
     * @param {number} n
     * @param {(index: number) => T} iteratee
     * @returns {T[]}
     */
    function times<T>(n: number, iteratee: (index: number) => T): T[];
    /**
     * Without an iteratee: the indexes `0 .. n-1`.
     * @overload
     * @param {number} n
     * @returns {number[]}
     */
    function times(n: number): number[];
    /**
     * Numbers from 0 up to, but not including, `end` (counts down for a negative end).
     * @overload
     * @param {number} end
     * @returns {number[]}
     */
    function range(end: number): number[];
    /**
     * Numbers from `start` up to, but not including, `end`.
     * @overload
     * @param {number} start
     * @param {number} end
     * @param {number} [step]
     * @returns {number[]}
     */
    function range(start: number, end: number, step?: number): number[];
    function uniqueId(prefix?: string): string;
    /**
     * Creates an object composed of keys generated from the results of running each element through iteratee.
     * @template T
     * @param {Collection<T>} collection
     * @param {(value: T) => PropertyKey} iteratee
     * @returns {Record<string, number>}
     */
    function countBy<T>(collection: Collection<T>, iteratee: (value: T) => PropertyKey): Record<string, number>;
    /**
     * Iterates over elements invoking iteratee for each element.
     * @template {Collection<any>} C
     * @param {C} collection
     * @param {Iteratee<C extends Collection<infer T> ? T : never, unknown>} iteratee
     * @returns {C}
     */
    function each<C extends Collection<any>>(collection: C, iteratee: Iteratee<C extends Collection<infer T> ? T : never, unknown>): C;
    /**
     * Alias for each.
     * @template {Collection<any>} C
     * @param {C} collection
     * @param {Iteratee<C extends Collection<infer T> ? T : never, unknown>} iteratee
     * @returns {C}
     */
    function forEach<C extends Collection<any>>(collection: C, iteratee: Iteratee<C extends Collection<infer T> ? T : never, unknown>): C;
    /**
     * Iterates over elements in reverse invoking iteratee for each element.
     * @template {Collection<any>} C
     * @param {C} collection
     * @param {Iteratee<C extends Collection<infer T> ? T : never, unknown>} iteratee
     * @returns {C}
     */
    function eachRight<C extends Collection<any>>(collection: C, iteratee: Iteratee<C extends Collection<infer T> ? T : never, unknown>): C;
    /**
     * Alias for eachRight.
     * @template {Collection<any>} C
     * @param {C} collection
     * @param {Iteratee<C extends Collection<infer T> ? T : never, unknown>} iteratee
     * @returns {C}
     */
    function forEachRight<C extends Collection<any>>(collection: C, iteratee: Iteratee<C extends Collection<infer T> ? T : never, unknown>): C;
    /**
     * Checks if predicate returns truthy for all elements of collection.
     * @template T
     * @param {Collection<T>} collection
     * @param {Predicate<T>} predicate
     * @returns {boolean}
     */
    function every<T>(collection: Collection<T>, predicate: Predicate<T>): boolean;
    /**
     * Iterates over elements returning an array of all elements predicate returns truthy for.
     * @template T
     * @param {Collection<T>} collection
     * @param {Predicate<T>} predicate
     * @returns {T[]}
     */
    function filter<T>(collection: Collection<T>, predicate: Predicate<T>): T[];
    /**
     * Iterates over elements returning the first element predicate returns truthy for.
     * @template T
     * @param {Collection<T>} collection
     * @param {Predicate<T>} predicate
     * @returns {T | undefined}
     */
    function find<T>(collection: Collection<T>, predicate: Predicate<T>): T | undefined;
    /**
     * Iterates over elements returning the last element predicate returns truthy for.
     * @template T
     * @param {Collection<T>} collection
     * @param {Predicate<T>} predicate
     * @returns {T | undefined}
     */
    function findLast<T>(collection: Collection<T>, predicate: Predicate<T>): T | undefined;
    /**
     * Creates a flattened array of values by running each element through iteratee.
     * @template T, R
     * @param {Collection<T>} collection
     * @param {Iteratee<T, R | R[]>} iteratee
     * @returns {R[]}
     */
    function flatMap<T, R>(collection: Collection<T>, iteratee: Iteratee<T, R | R[]>): R[];
    /**
     * Recursively flattens the mapped results.
     * @template T, R
     * @param {Collection<T>} collection
     * @param {Iteratee<T, any>} iteratee
     * @returns {R[]}
     */
    function flatMapDeep<T, R>(collection: Collection<T>, iteratee: Iteratee<T, any>): R[];
    /**
     * Creates an object composed of keys generated from the results of running each element through iteratee.
     * @template T
     * @param {Collection<T>} collection
     * @param {PropertyIteratee<T>} iteratee
     * @returns {Record<string, T[]>}
     */
    function groupBy<T>(collection: Collection<T>, iteratee: PropertyIteratee<T>): Record<string, T[]>;
    /**
     * Checks if value is in collection.
     * @template T
     * @param {Collection<T> | string} collection
     * @param {T | string} value
     * @param {number} [fromIndex=0]
     * @returns {boolean}
     */
    function includes<T>(collection: Collection<T> | string, value: T | string, fromIndex?: number): boolean;
    /**
     * Creates an object composed of keys generated from the results of running each element through iteratee.
     * @template T
     * @param {Collection<T>} collection
     * @param {PropertyIteratee<T>} iteratee
     * @returns {Record<string, T>}
     */
    function keyBy<T>(collection: Collection<T>, iteratee: PropertyIteratee<T>): Record<string, T>;
    /**
     * Creates an array of values by running each element through iteratee.
     * @template T, R
     * @param {Collection<T>} collection
     * @param {Iteratee<T, R>} iteratee
     * @returns {R[]}
     */
    function map<T, R>(collection: Collection<T>, iteratee: Iteratee<T, R>): R[];
    /**
     * Creates an array of elements sorted in ascending order by the results of running each element through iteratee.
     * @template T
     * @param {Collection<T>} collection
     * @param {PropertyIteratee<T> | PropertyIteratee<T>[]} iteratees
     * @param {('asc' | 'desc') | ('asc' | 'desc')[]} [orders]
     * @returns {T[]}
     */
    function orderBy<T>(collection: Collection<T>, iteratees: PropertyIteratee<T> | PropertyIteratee<T>[], orders?: ("asc" | "desc") | ("asc" | "desc")[]): T[];
    /**
     * Creates an array of elements split into two groups.
     * @template T
     * @param {Collection<T>} collection
     * @param {Predicate<T>} predicate
     * @returns {[T[], T[]]}
     */
    function partition<T>(collection: Collection<T>, predicate: Predicate<T>): [T[], T[]];
    /**
     * Reduces collection to a value which is the accumulated result of running each element through iteratee.
     * @template T, R
     * @param {Collection<T>} collection
     * @param {(accumulator: R, value: T, index: number | string, collection: Collection<T>) => R} iteratee
     * @param {R} [accumulator]
     * @returns {R}
     */
    function reduce<T, R>(collection: Collection<T>, iteratee: (accumulator: R, value: T, index: number | string, collection: Collection<T>) => R, accumulator?: R): R;
    /**
     * Reduces collection from right to left.
     * @template T, R
     * @param {Collection<T>} collection
     * @param {(accumulator: R, value: T, index: number | string, collection: Collection<T>) => R} iteratee
     * @param {R} [accumulator]
     * @returns {R}
     */
    function reduceRight<T, R>(collection: Collection<T>, iteratee: (accumulator: R, value: T, index: number | string, collection: Collection<T>) => R, accumulator?: R): R;
    /**
     * The opposite of filter; returns elements predicate does not return truthy for.
     * @template T
     * @param {Collection<T>} collection
     * @param {Predicate<T>} predicate
     * @returns {T[]}
     */
    function reject<T>(collection: Collection<T>, predicate: Predicate<T>): T[];
    /**
     * Gets a random element from collection.
     * @template T
     * @param {Collection<T>} collection
     * @returns {T | undefined}
     */
    function sample<T>(collection: Collection<T>): T | undefined;
    /**
     * Gets n random elements from collection.
     * @template T
     * @param {Collection<T>} collection
     * @param {number} [n=1]
     * @returns {T[]}
     */
    function sampleSize<T>(collection: Collection<T>, n?: number): T[];
    /**
     * Creates a shuffled array using Fisher-Yates shuffle.
     * @template T
     * @param {Collection<T>} collection
     * @returns {T[]}
     */
    function shuffle<T>(collection: Collection<T>): T[];
    /**
     * Gets the size of collection.
     * @param {Collection<any> | string | null | undefined} collection
     * @returns {number}
     */
    function size(collection: Collection<any> | string | null | undefined): number;
    /**
     * Checks if predicate returns truthy for any element of collection.
     * @template T
     * @param {Collection<T>} collection
     * @param {Predicate<T>} predicate
     * @returns {boolean}
     */
    function some<T>(collection: Collection<T>, predicate: Predicate<T>): boolean;
    /**
     * Creates an array of elements sorted by iteratee.
     * @template T
     * @param {Collection<T>} collection
     * @param {PropertyIteratee<T>} iteratee
     * @returns {T[]}
     */
    function sortBy<T>(collection: Collection<T>, iteratee: PropertyIteratee<T>): T[];
    /**
     * Creates a function that invokes func once it's called n or more times.
     * @template {(...args: any[]) => any} T
     * @param {number} n
     * @param {T} func
     * @returns {(...args: Parameters<T>) => ReturnType<T> | undefined}
     */
    function after<T extends (...args: any[]) => any>(n: number, func: T): (...args: Parameters<T>) => ReturnType<T> | undefined;
    /**
     * Creates a function that invokes func, with up to n arguments.
     * @template {(...args: any[]) => any} T
     * @param {T} func
     * @param {number} [n=func.length]
     * @returns {(...args: any[]) => ReturnType<T>}
     */
    function ary<T extends (...args: any[]) => any>(func: T, n?: number): (...args: any[]) => ReturnType<T>;
    /**
     * Creates a function that invokes func while it's called less than n times.
     * @template {(...args: any[]) => any} T
     * @param {number} n
     * @param {T} func
     * @returns {(...args: Parameters<T>) => ReturnType<T> | undefined}
     */
    function before<T extends (...args: any[]) => any>(n: number, func: T): (...args: Parameters<T>) => ReturnType<T> | undefined;
    /**
     * Creates a function that invokes func with the this binding of thisArg.
     * @template {(...args: any[]) => any} T
     * @param {T} func
     * @param {any} thisArg
     * @param {...any} partials
     * @returns {(...args: any[]) => ReturnType<T>}
     */
    function bind<T extends (...args: any[]) => any>(func: T, thisArg: any, ...partials: any[]): (...args: any[]) => ReturnType<T>;
    /**
     * Creates a function that accepts arguments of func and returns a function.
     * @param {(...args: any[]) => any} func
     * @param {number} [arity=func.length]
     * @returns {(...args: any[]) => any}
     */
    function curry(func: (...args: any[]) => any, arity?: number): (...args: any[]) => any;
    /**
     * Creates a function that accepts arguments of func and returns a function (right to left).
     * @param {(...args: any[]) => any} func
     * @param {number} [arity=func.length]
     * @returns {(...args: any[]) => any}
     */
    function curryRight(func: (...args: any[]) => any, arity?: number): (...args: any[]) => any;
    /**
     * Creates a debounced function that delays invoking func until after wait ms.
     * @template {(...args: any[]) => any} T
     * @param {T} func
     * @param {number} [wait=0]
     * @param {DebounceOptions} [options]
     * @returns {DebouncedFunction<T>}
     */
    function debounce<T extends (...args: any[]) => any>(func: T, wait?: number, options?: DebounceOptions): DebouncedFunction<T>;
    /**
     * Defers invoking the func until the current call stack has cleared.
     * @template {(...args: any[]) => any} T
     * @param {T} func
     * @param {Parameters<T>} args
     * @returns {ReturnType<typeof setTimeout>}
     */
    function defer<T extends (...args: any[]) => any>(func: T, ...args: Parameters<T>): ReturnType<typeof setTimeout>;
    /**
     * Invokes func after wait milliseconds.
     * @template {(...args: any[]) => any} T
     * @param {T} func
     * @param {number} wait
     * @param {Parameters<T>} args
     * @returns {ReturnType<typeof setTimeout>}
     */
    function delay<T extends (...args: any[]) => any>(func: T, wait: number, ...args: Parameters<T>): ReturnType<typeof setTimeout>;
    /**
     * Creates a function that invokes func with arguments reversed.
     * @template {(...args: any[]) => any} T
     * @param {T} func
     * @returns {(...args: any[]) => ReturnType<T>}
     */
    function flip<T extends (...args: any[]) => any>(func: T): (...args: any[]) => ReturnType<T>;
    /**
     * Creates a function that performs a left-to-right function composition.
     * The result of each function is passed as the argument to the next.
     * @param {...((...args: any[]) => any)} funcs - Functions to compose
     * @returns {(...args: any[]) => any}
     * @example
     * const calculate = _.flow(
     *     x => x * 2,
     *     x => x + 10,
     *     x => x / 3
     * );
     * calculate(5); // ((5 * 2) + 10) / 3 = 6.67
     */
    function flow(...funcs: ((...args: any[]) => any)[]): (...args: any[]) => any;
    /**
     * Creates a function that performs a right-to-left function composition.
     * The result of each function is passed as the argument to the next (in reverse order).
     * @param {...((...args: any[]) => any)} funcs - Functions to compose
     * @returns {(...args: any[]) => any}
     * @example
     * const calculate = _.compose(
     *     x => x / 3,
     *     x => x + 10,
     *     x => x * 2
     * );
     * calculate(5); // ((5 * 2) + 10) / 3 = 6.67
     */
    function compose(...funcs: ((...args: any[]) => any)[]): (...args: any[]) => any;
    /**
     * Creates a function that memoizes the result of func.
     * @template {(...args: any[]) => any} T
     * @param {T} func
     * @param {(...args: Parameters<T>) => any} [resolver]
     * @returns {MemoizedFunction<T>}
     */
    function memoize<T extends (...args: any[]) => any>(func: T, resolver?: (...args: Parameters<T>) => any): MemoizedFunction<T>;
    /**
     * Creates a function that negates the result of the predicate func.
     * @template {(...args: any[]) => any} T
     * @param {T} predicate
     * @returns {(...args: Parameters<T>) => boolean}
     */
    function negate<T extends (...args: any[]) => any>(predicate: T): (...args: Parameters<T>) => boolean;
    /**
     * Creates a function that is restricted to invoking func once.
     * @template {(...args: any[]) => any} T
     * @param {T} func
     * @returns {(...args: Parameters<T>) => ReturnType<T>}
     */
    function once<T extends (...args: any[]) => any>(func: T): (...args: Parameters<T>) => ReturnType<T>;
    /**
     * Creates a function that invokes func with partials prepended.
     * @template {(...args: any[]) => any} T
     * @param {T} func
     * @param {...any} partials
     * @returns {(...args: any[]) => ReturnType<T>}
     */
    function partial<T extends (...args: any[]) => any>(func: T, ...partials: any[]): (...args: any[]) => ReturnType<T>;
    /**
     * Creates a function that invokes func with partials appended.
     * @template {(...args: any[]) => any} T
     * @param {T} func
     * @param {...any} partials
     * @returns {(...args: any[]) => ReturnType<T>}
     */
    function partialRight<T extends (...args: any[]) => any>(func: T, ...partials: any[]): (...args: any[]) => ReturnType<T>;
    /**
     * Creates a throttled function that only invokes func at most once per every wait ms.
     * @template {(...args: any[]) => any} T
     * @param {T} func
     * @param {number} [wait=0]
     * @param {ThrottleOptions} [options]
     * @returns {DebouncedFunction<T>}
     */
    function throttle<T extends (...args: any[]) => any>(func: T, wait?: number, options?: ThrottleOptions): DebouncedFunction<T>;
    /**
     * Creates a function that accepts up to one argument.
     * @template {(...args: any[]) => any} T
     * @param {T} func
     * @returns {(arg: Parameters<T>[0]) => ReturnType<T>}
     */
    function unary<T extends (...args: any[]) => any>(func: T): (arg: Parameters<T>[0]) => ReturnType<T>;
    /**
     * Creates a function that provides value to wrapper as its first argument.
     * @template T, R
     * @param {T} value
     * @param {(value: T, ...args: any[]) => R} wrapper
     * @returns {(...args: any[]) => R}
     */
    function wrap<T, R>(value: T, wrapper: (value: T, ...args: any[]) => R): (...args: any[]) => R;
    /**
     * Assigns own enumerable string keyed properties of source objects to the destination object.
     * @template {Record<PropertyKey, any>} T
     * @param {T} object
     * @param {...any} sources
     * @returns {T}
     */
    function assign<T extends Record<PropertyKey, any>>(object: T, ...sources: any[]): T;
    /**
     * Like assign but iterates over own and inherited source properties.
     * @template {Record<PropertyKey, any>} T
     * @param {T} object
     * @param {...any} sources
     * @returns {T}
     */
    function assignIn<T extends Record<PropertyKey, any>>(object: T, ...sources: any[]): T;
    /**
     * Alias for assignIn.
     * @template {Record<PropertyKey, any>} T
     * @param {T} object
     * @param {...any} sources
     * @returns {T}
     */
    function extend<T extends Record<PropertyKey, any>>(object: T, ...sources: any[]): T;
    /**
     * Creates an array of values corresponding to paths of object.
     * @template {Record<PropertyKey, any>} T
     * @param {T} object
     * @param {...(string | string[])} paths
     * @returns {any[]}
     */
    function at<T extends Record<PropertyKey, any>>(object: T, ...paths: (string | string[])[]): any[];
    /**
     * Creates a shallow clone of value.
     * @template T
     * @param {T} value
     * @returns {T}
     */
    function clone<T>(value: T): T;
    /**
     * Creates a deep clone of value.
     * @template T
     * @param {T} value
     * @returns {T}
     */
    function cloneDeep<T>(value: T): T;
    /**
     * Assigns own and inherited enumerable string keyed properties of source objects to the destination object for all destination properties that resolve to undefined.
     * @template {Record<PropertyKey, any>} T
     * @param {T} object
     * @param {...any} sources
     * @returns {T}
     */
    function defaults<T extends Record<PropertyKey, any>>(object: T, ...sources: any[]): T;
    /**
     * Like defaults but recursively assigns default properties.
     * @template {Record<PropertyKey, any>} T
     * @param {T} object
     * @param {...any} sources
     * @returns {T}
     */
    function defaultsDeep<T extends Record<PropertyKey, any>>(object: T, ...sources: any[]): T;
    /**
     * Creates an array of own enumerable string keyed-value pairs.
     * @template {Record<PropertyKey, any>} T
     * @param {T} object
     * @returns {[string, T[keyof T]][]}
     */
    function entries<T extends Record<PropertyKey, any>>(object: T): [string, T[keyof T]][];
    /**
     * Alias for entries.
     * @template {Record<PropertyKey, any>} T
     * @param {T} object
     * @returns {[string, T[keyof T]][]}
     */
    function toPairs<T extends Record<PropertyKey, any>>(object: T): [string, T[keyof T]][];
    /**
     * Returns the key of the first element predicate returns truthy for.
     * @template {Record<PropertyKey, any>} T
     * @param {T} object
     * @param {(value: T[keyof T], key: string, object: T) => boolean} predicate
     * @returns {string | undefined}
     */
    function findKey<T extends Record<PropertyKey, any>>(object: T, predicate: (value: T[keyof T], key: string, object: T) => boolean): string | undefined;
    /**
     * Returns the key of the last element predicate returns truthy for.
     * @template {Record<PropertyKey, any>} T
     * @param {T} object
     * @param {(value: T[keyof T], key: string, object: T) => boolean} predicate
     * @returns {string | undefined}
     */
    function findLastKey<T extends Record<PropertyKey, any>>(object: T, predicate: (value: T[keyof T], key: string, object: T) => boolean): string | undefined;
    /**
     * Iterates over own and inherited enumerable string keyed properties of an object.
     * @template {Record<PropertyKey, any>} T
     * @param {T} object
     * @param {(value: T[keyof T], key: string, object: T) => unknown} iteratee - Return `false` to stop
     * @returns {T}
     */
    function forIn<T extends Record<PropertyKey, any>>(object: T, iteratee: (value: T[keyof T], key: string, object: T) => unknown): T;
    /**
     * Iterates over own enumerable string keyed properties of an object.
     * @template {Record<PropertyKey, any>} T
     * @param {T} object
     * @param {(value: T[keyof T], key: string, object: T) => unknown} iteratee - Return `false` to stop
     * @returns {T}
     */
    function forOwn<T extends Record<PropertyKey, any>>(object: T, iteratee: (value: T[keyof T], key: string, object: T) => unknown): T;
    /**
     * Gets the value at path of object.
     * @template [T=any]
     * @param {any} object
     * @param {string | PropertyKey[]} path - Dot path (`'a.b[0].c'`) or array of keys
     * @param {T} [defaultValue]
     * @returns {T}
     */
    function get<T = any>(object: any, path: string | PropertyKey[], defaultValue?: T): T;
    /**
     * Checks if path is a direct property of object.
     * @param {any} object
     * @param {string | PropertyKey[]} path
     * @returns {boolean}
     */
    function has(object: any, path: string | PropertyKey[]): boolean;
    /**
     * Creates an object composed of the inverted keys and values of object.
     * @template {Record<PropertyKey, any>} T
     * @param {T} object
     * @returns {Record<string, string>}
     */
    function invert<T extends Record<PropertyKey, any>>(object: T): Record<string, string>;
    /**
     * Like invert but accepts iteratee which is invoked for each element.
     * @template {Record<PropertyKey, any>} T
     * @param {T} object
     * @param {(value: T[keyof T]) => PropertyKey} [iteratee]
     * @returns {Record<string, string[]>}
     */
    function invertBy<T extends Record<PropertyKey, any>>(object: T, iteratee?: (value: T[keyof T]) => PropertyKey): Record<string, string[]>;
    /**
     * Creates an array of the own enumerable property names of object.
     * @template {Record<PropertyKey, any>} T
     * @param {T} object
     * @returns {string[]}
     */
    function keys<T extends Record<PropertyKey, any>>(object: T): string[];
    /**
     * Creates an array of own and inherited enumerable property names.
     * @template {Record<PropertyKey, any>} T
     * @param {T} object
     * @returns {string[]}
     */
    function keysIn<T extends Record<PropertyKey, any>>(object: T): string[];
    /**
     * Creates an object with the same values as object and keys generated by running each own enumerable property through iteratee.
     * @template {Record<PropertyKey, any>} T
     * @param {T} object
     * @param {(value: T[keyof T], key: string, object: T) => PropertyKey} iteratee
     * @returns {Record<string, T[keyof T]>}
     */
    function mapKeys<T extends Record<PropertyKey, any>>(object: T, iteratee: (value: T[keyof T], key: string, object: T) => PropertyKey): Record<string, T[keyof T]>;
    /**
     * Creates an object with the same keys as object and values generated by running each own enumerable property through iteratee.
     * @template {Record<PropertyKey, any>} T, R
     * @param {T} object
     * @param {(value: T[keyof T], key: string, object: T) => R} iteratee
     * @returns {{[K in keyof T]: R}}
     */
    function mapValues<T extends Record<PropertyKey, any>, R>(object: T, iteratee: (value: T[keyof T], key: string, object: T) => R): { [K in keyof T]: R; };
    /**
     * Recursively merges own and inherited enumerable properties of source objects into the destination object.
     * @template {Record<PropertyKey, any>} T
     * @param {T} object
     * @param {...any} sources
     * @returns {T}
     */
    function merge<T extends Record<PropertyKey, any>>(object: T, ...sources: any[]): T;
    /**
     * Creates an object composed of the own enumerable properties of object that are not omitted.
     * @template {Record<PropertyKey, any>} T
     * @template {keyof T} K
     * @param {T} object
     * @param {...(K | K[])} paths
     * @returns {Omit<T, K>}
     */
    function omit<T extends Record<PropertyKey, any>, K extends keyof T>(object: T, ...paths: (K | K[])[]): Omit<T, K>;
    /**
     * Creates an object composed of the properties predicate doesn't return truthy for.
     * @template {Record<PropertyKey, any>} T
     * @param {T} object
     * @param {(value: T[keyof T], key: string) => boolean} predicate
     * @returns {Partial<T>}
     */
    function omitBy<T extends Record<PropertyKey, any>>(object: T, predicate: (value: T[keyof T], key: string) => boolean): Partial<T>;
    /**
     * Creates an object composed of the picked object properties.
     * @template {Record<PropertyKey, any>} T
     * @template {keyof T} K
     * @param {T} object
     * @param {...(K | K[])} paths
     * @returns {Pick<T, K>}
     */
    function pick<T extends Record<PropertyKey, any>, K extends keyof T>(object: T, ...paths: (K | K[])[]): Pick<T, K>;
    /**
     * Creates an object composed of the properties predicate returns truthy for.
     * @template {Record<PropertyKey, any>} T
     * @param {T} object
     * @param {(value: T[keyof T], key: string) => boolean} predicate
     * @returns {Partial<T>}
     */
    function pickBy<T extends Record<PropertyKey, any>>(object: T, predicate: (value: T[keyof T], key: string) => boolean): Partial<T>;
    /**
     * Sets the value at path of object.
     * @template {Record<PropertyKey, any>} T
     * @param {T} object
     * @param {string | PropertyKey[]} path
     * @param {any} value
     * @returns {T}
     */
    function set<T extends Record<PropertyKey, any>>(object: T, path: string | PropertyKey[], value: any): T;
    /**
     * Removes the property at path of object.
     * @param {any} object
     * @param {string | PropertyKey[]} path
     * @returns {boolean}
     */
    function unset(object: any, path: string | PropertyKey[]): boolean;
    /**
     * Sets the value at path of object if the resolved value is undefined.
     * @template {Record<PropertyKey, any>} T
     * @param {T} object
     * @param {string | PropertyKey[]} path
     * @param {any} value
     * @returns {T}
     */
    function setIfUndefined<T extends Record<PropertyKey, any>>(object: T, path: string | PropertyKey[], value: any): T;
    /**
     * Creates an array of own enumerable string keyed property values of object.
     * @template {Record<PropertyKey, any>} T
     * @param {T} object
     * @returns {T[keyof T][]}
     */
    function values<T extends Record<PropertyKey, any>>(object: T): T[keyof T][];
    /**
     * Creates an array of own and inherited enumerable property values.
     * @param {object} object
     * @returns {any[]}
     */
    function valuesIn(object: object): any[];
    /**
     * Checks if value is an Array.
     * @param {unknown} value
     * @returns {value is any[]}
     */
    function isArray(value: unknown): value is any[];
    /**
     * Checks if value is a boolean primitive or object.
     * @param {unknown} value
     * @returns {value is boolean | Boolean}
     */
    function isBoolean(value: unknown): value is boolean | boolean;
    /**
     * Checks if value is a Date object.
     * @param {unknown} value
     * @returns {value is Date}
     */
    function isDate(value: unknown): value is Date;
    /**
     * Checks if value is an empty object, collection, map, or set.
     * @param {unknown} value
     * @returns {boolean}
     */
    function isEmpty(value: unknown): boolean;
    /**
     * Performs a deep comparison between two values.
     * @param {any} value
     * @param {any} other
     * @returns {boolean}
     */
    function isEqual(value: any, other: any): boolean;
    /**
     * Performs a partial deep comparison to determine if object contains equivalent property values.
     * @param {any} object - The object to inspect
     * @param {any} source - The object of property values to match
     * @returns {boolean} Returns true if object is a match
     */
    function isMatch(object: any, source: any): boolean;
    /**
     * Checks if value is a finite number.
     * @param {unknown} value
     * @returns {value is number}
     */
    function isFinite(value: unknown): value is number;
    /**
     * Checks if value is a Function object.
     * @param {unknown} value
     * @returns {value is (...args: any[]) => any}
     */
    function isFunction(value: unknown): value is (...args: any[]) => any;
    /**
     * Checks if value is an integer.
     * @param {unknown} value
     * @returns {value is number}
     */
    function isInteger(value: unknown): value is number;
    /**
     * Checks if value is NaN.
     * @param {unknown} value
     * @returns {boolean}
     */
    function isNaN(value: unknown): boolean;
    /**
     * Checks if value is null or undefined.
     * @param {unknown} value
     * @returns {value is null | undefined}
     */
    function isNil(value: unknown): value is null | undefined;
    /**
     * Checks if value is null.
     * @param {unknown} value
     * @returns {value is null}
     */
    function isNull(value: unknown): value is null;
    /**
     * Checks if value is a number primitive or object.
     * @param {unknown} value
     * @returns {value is number | Number}
     */
    function isNumber(value: unknown): value is number | number;
    /**
     * Checks if value is the language type of Object.
     * @param {unknown} value
     * @returns {value is object}
     */
    function isObject(value: unknown): value is object;
    /**
     * Checks if value is a plain object.
     * @param {unknown} value
     * @returns {value is Record<string, any>}
     */
    function isPlainObject(value: unknown): value is Record<string, any>;
    /**
     * Checks if value is a RegExp object.
     * @param {unknown} value
     * @returns {value is RegExp}
     */
    function isRegExp(value: unknown): value is RegExp;
    /**
     * Checks if value is a string primitive or object.
     * @param {unknown} value
     * @returns {value is string | String}
     */
    function isString(value: unknown): value is string | string;
    /**
     * Checks if value is a Symbol primitive.
     * @param {unknown} value
     * @returns {value is symbol}
     */
    function isSymbol(value: unknown): value is symbol;
    /**
     * Checks if value is undefined.
     * @param {unknown} value
     * @returns {value is undefined}
     */
    function isUndefined(value: unknown): value is undefined;
    /**
     * Converts string to an integer of the specified radix.
     * @param {string | number | null | undefined} string - The string to convert
     * @param {number} [radix] - The radix to interpret the value
     * @returns {number} The converted integer
     */
    function parseInt(string: string | number | null | undefined, radix?: number): number;
    /**
     * Converts value to a number.
     * @param {any} value - The value to process
     * @returns {number} The number
     */
    function toNumber(value: any): number;
    /**
     * Converts value to an integer.
     * @param {any} value - The value to convert
     * @returns {number} The converted integer
     */
    function toInteger(value: any): number;
    /**
     * Converts value to a finite number.
     * @param {any} value - The value to convert
     * @returns {number} The converted number
     */
    function toFinite(value: any): number;
    /**
     * Converts value to a safe integer.
     * @param {any} value - The value to convert
     * @returns {number} The converted safe integer
     */
    function toSafeInteger(value: any): number;
    /**
     * Converts value to a string.
     * @param {any} value - The value to convert
     * @returns {string} The converted string
     */
    function toString(value: any): string;
    /**
     * A string becomes its characters.
     * @overload
     * @param {string} value
     * @returns {string[]}
     */
    function toArray(value: string): string[];
    /**
     * An array, iterable or object becomes an array of its values.
     * @template T
     * @overload
     * @param {T[] | Iterable<T> | Record<string, T> | null | undefined} value
     * @returns {T[]}
     */
    function toArray<T>(value: T[] | Iterable<T> | Record<string, T> | null | undefined): T[];
    /**
     * Casts value as an array if it's not one.
     * @template T
     * @param {...(T | T[])} args - Only the first is used
     * @returns {T[]} The cast array
     */
    function castArray<T>(...args: (T | T[])[]): T[];
    /**
     * Converts value to an integer suitable for use as the length of an array-like object.
     * @param {any} value - The value to convert
     * @returns {number} The converted integer
     */
    function toLength(value: any): number;
    /**
     * Converts value to a plain object flattening inherited enumerable string keyed properties.
     * @param {any} value - The value to convert
     * @returns {Record<string, any>} The converted plain object
     */
    function toPlainObject(value: any): Record<string, any>;
    /**
     * Adds two numbers.
     * @param {number} augend
     * @param {number} addend
     * @returns {number}
     */
    function add(augend: number, addend: number): number;
    /**
     * Computes number rounded up to precision.
     * @param {number} number
     * @param {number} [precision=0]
     * @returns {number}
     */
    function ceil(number: number, precision?: number): number;
    /**
     * Divide two numbers.
     * @param {number} dividend
     * @param {number} divisor
     * @returns {number}
     */
    function divide(dividend: number, divisor: number): number;
    /**
     * Computes number rounded down to precision.
     * @param {number} number
     * @param {number} [precision=0]
     * @returns {number}
     */
    function floor(number: number, precision?: number): number;
    /**
     * Computes the maximum value of array.
     * @param {number[]} array
     * @returns {number | undefined}
     */
    function max(array: number[]): number | undefined;
    /**
     * Computes the maximum value of array with iteratee.
     * @template T
     * @param {T[]} array
     * @param {PropertyIteratee<T>} iteratee
     * @returns {T | undefined}
     */
    function maxBy<T>(array: T[], iteratee: PropertyIteratee<T>): T | undefined;
    /**
     * Computes the mean of the values in array.
     * @param {number[]} array
     * @returns {number}
     */
    function mean(array: number[]): number;
    /**
     * Computes the mean using iteratee.
     * @template T
     * @param {T[]} array
     * @param {PropertyIteratee<T>} iteratee
     * @returns {number}
     */
    function meanBy<T>(array: T[], iteratee: PropertyIteratee<T>): number;
    /**
     * Computes the minimum value of array.
     * @param {number[]} array
     * @returns {number | undefined}
     */
    function min(array: number[]): number | undefined;
    /**
     * Computes the minimum value of array with iteratee.
     * @template T
     * @param {T[]} array
     * @param {PropertyIteratee<T>} iteratee
     * @returns {T | undefined}
     */
    function minBy<T>(array: T[], iteratee: PropertyIteratee<T>): T | undefined;
    /**
     * Multiply two numbers.
     * @param {number} multiplier
     * @param {number} multiplicand
     * @returns {number}
     */
    function multiply(multiplier: number, multiplicand: number): number;
    /**
     * Computes number rounded to precision.
     * @param {number} number
     * @param {number} [precision=0]
     * @returns {number}
     */
    function round(number: number, precision?: number): number;
    /**
     * Subtract two numbers.
     * @param {number} minuend
     * @param {number} subtrahend
     * @returns {number}
     */
    function subtract(minuend: number, subtrahend: number): number;
    /**
     * Computes the sum of the values in array.
     * @param {number[]} array
     * @returns {number}
     */
    function sum(array: number[]): number;
    /**
     * Computes the sum using iteratee.
     * @template T
     * @param {T[]} array
     * @param {PropertyIteratee<T>} iteratee
     * @returns {number}
     */
    function sumBy<T>(array: T[], iteratee: PropertyIteratee<T>): number;
    /**
     * Clamp to an upper bound only.
     * @overload
     * @param {number} number
     * @param {number} upper
     * @returns {number}
     */
    function clamp(number: number, upper: number): number;
    /**
     * Clamp to the inclusive lower and upper bounds.
     * @overload
     * @param {number} number
     * @param {number | undefined} lower
     * @param {number} upper
     * @returns {number}
     */
    function clamp(number: number, lower: number | undefined, upper: number): number;
    /**
     * Is the number in `[0, end)`?
     * @overload
     * @param {number} number
     * @param {number} end
     * @returns {boolean}
     */
    function inRange(number: number, end: number): boolean;
    /**
     * Is the number in `[start, end)` (the bounds are swapped when start > end)?
     * @overload
     * @param {number} number
     * @param {number} start
     * @param {number} end
     * @returns {boolean}
     */
    function inRange(number: number, start: number, end: number): boolean;
    /**
     * Between 0 and 1 (a float when `floating`).
     * @overload
     * @param {boolean} [floating]
     * @returns {number}
     */
    function random(floating?: boolean): number;
    /**
     * Between 0 and `upper` when `floating` is given; `random(n)` alone is between `n` and 1 (the bounds are swapped).
     * @overload
     * @param {number} upper
     * @param {boolean} floating
     * @returns {number}
     */
    function random(upper: number, floating: boolean): number;
    /**
     * Between the inclusive bounds; a float when `floating` or either bound is fractional.
     * @overload
     * @param {number} lower
     * @param {number} [upper]
     * @param {boolean} [floating]
     * @returns {number}
     */
    function random(lower: number, upper?: number, floating?: boolean): number;
    /**
     * Converts string to camel case.
     * @param {string} string
     * @returns {string}
     */
    function camelCase(string: string): string;
    /**
     * Converts the first character of string to upper case and the remaining to lower case.
     * @param {string} string
     * @returns {string}
     */
    function capitalize(string: string): string;
    /**
     * Checks if string ends with the given target string.
     * @param {string} string
     * @param {string} target
     * @param {number} [position]
     * @returns {boolean}
     */
    function endsWith(string: string, target: string, position?: number): boolean;
    /**
     * Converts the characters "&", "<", ">", '"', and "'" to HTML entities.
     * @param {string} string
     * @returns {string}
     */
    function escape(string: string): string;
    /**
     * Converts string to kebab case.
     * @param {string} string
     * @returns {string}
     */
    function kebabCase(string: string): string;
    /**
     * Converts string, as space separated words, to lower case.
     * @param {string} string
     * @returns {string}
     */
    function lowerCase(string: string): string;
    /**
     * Converts the first character of string to lower case.
     * @param {string} string
     * @returns {string}
     */
    function lowerFirst(string: string): string;
    /**
     * Pads string on the left and right sides if it's shorter than length.
     * @param {string} [string='']
     * @param {number} [length=0]
     * @param {string} [chars=' ']
     * @returns {string}
     */
    function pad(string?: string, length?: number, chars?: string): string;
    /**
     * Pads string on the right side if it's shorter than length.
     * @param {string} [string='']
     * @param {number} [length=0]
     * @param {string} [chars=' ']
     * @returns {string}
     */
    function padEnd(string?: string, length?: number, chars?: string): string;
    /**
     * Pads string on the left side if it's shorter than length.
     * @param {string} [string='']
     * @param {number} [length=0]
     * @param {string} [chars=' ']
     * @returns {string}
     */
    function padStart(string?: string, length?: number, chars?: string): string;
    /**
     * Repeats the given string n times.
     * @param {string} [string='']
     * @param {number} [n=1]
     * @returns {string}
     */
    function repeat(string?: string, n?: number): string;
    /**
     * Replaces matches for pattern in string with replacement.
     * @param {string} [string='']
     * @param {string | RegExp} [pattern]
     * @param {string | ((substring: string, ...args: any[]) => string)} [replacement]
     * @returns {string}
     */
    function replace(string?: string, pattern?: string | RegExp, replacement?: string | ((substring: string, ...args: any[]) => string)): string;
    /**
     * Converts string to snake case.
     * @param {string} string
     * @returns {string}
     */
    function snakeCase(string: string): string;
    /**
     * Splits string by separator.
     * @param {string} [string='']
     * @param {string | RegExp} [separator]
     * @param {number} [limit]
     * @returns {string[]}
     */
    function split(string?: string, separator?: string | RegExp, limit?: number): string[];
    /**
     * Converts string to start case.
     * @param {string} string
     * @returns {string}
     */
    function startCase(string: string): string;
    /**
     * Checks if string starts with the given target string.
     * @param {string} string
     * @param {string} target
     * @param {number} [position=0]
     * @returns {boolean}
     */
    function startsWith(string: string, target: string, position?: number): boolean;
    /**
     * Converts string to lowercase.
     * @param {string} string
     * @returns {string}
     */
    function toLower(string: string): string;
    /**
     * Converts string to uppercase.
     * @param {string} string
     * @returns {string}
     */
    function toUpper(string: string): string;
    /**
     * Removes leading and trailing whitespace or specified characters from string.
     * @param {string} [string='']
     * @param {string} [chars]
     * @returns {string}
     */
    function trim(string?: string, chars?: string): string;
    /**
     * Removes trailing whitespace or specified characters from string.
     * @param {string} [string='']
     * @param {string} [chars]
     * @returns {string}
     */
    function trimEnd(string?: string, chars?: string): string;
    /**
     * Removes leading whitespace or specified characters from string.
     * @param {string} [string='']
     * @param {string} [chars]
     * @returns {string}
     */
    function trimStart(string?: string, chars?: string): string;
    /**
     * Truncates string if it's longer than the given maximum string length.
     * @param {string} [string='']
     * @param {TruncateOptions} [options]
     * @returns {string}
     */
    function truncate(string?: string, options?: TruncateOptions): string;
    /**
     * The inverse of escape; converts HTML entities to their corresponding characters.
     * @param {string} string
     * @returns {string}
     */
    function unescape(string: string): string;
    /**
     * Converts string, as space separated words, to upper case.
     * @param {string} string
     * @returns {string}
     */
    function upperCase(string: string): string;
    /**
     * Converts the first character of string to upper case.
     * @param {string} string
     * @returns {string}
     */
    function upperFirst(string: string): string;
    /**
     * Splits string into an array of its words.
     * @param {string} [string='']
     * @param {string | RegExp} [pattern]
     * @returns {string[]}
     */
    function words(string?: string, pattern?: string | RegExp): string[];
    /**
     * Returns a formatted string using printf-style format specifiers.
     * Supports: %s (string), %d/%i (integer), %f (float), %o (object), %j (JSON), %% (literal %)
     * Also supports width, precision, and flags: %10s, %-10s, %010d, %.2f, %10.2f
     * @param {string} format - The format string
     * @param {...any} args - Values to substitute
     * @returns {string}
     */
    function sprintf(format: string, ...args: any[]): string;
    /**
     * Alias for sprintf - returns formatted string.
     * @param {string} format - The format string
     * @param {...any} args - Values to substitute
     * @returns {string}
     */
    function format(format: string, ...args: any[]): string;
    /**
     * Compiles a template string into a reusable function.
     * Supports Mustache-style syntax with extensions.
     *
     * Syntax:
     * - {{variable}} - Escaped output
     * - {{{variable}}} - Raw/unescaped output
     * - {{obj.prop}} - Dot notation access
     * - {{#if condition}}...{{/if}} - Conditionals
     * - {{#unless condition}}...{{/unless}} - Negative conditionals
     * - {{#each items}}...{{/each}} - Loops (use {{.}} for current item, {{@index}} for index)
     * - {{#with obj}}...{{/with}} - Context shifting
     * - {{> partialName}} - Partial inclusion (if registered)
     *
     * @param {string} template - The template string
     * @param {TemplateOptions} [options] - Compilation options
     * @returns {(data?: Record<string, any>) => string} Compiled template function that accepts data
     */
    function template(template: string, options?: TemplateOptions): (data?: Record<string, any>) => string;
    /**
     * Renders a template string with the given data (one-shot).
     * @param {string} template - The template string
     * @param {Record<string, any>} data - The data object
     * @param {TemplateOptions} [options] - Template options (partials, helpers)
     * @returns {string} Rendered output
     */
    function render(template: string, data: Record<string, any>, options?: TemplateOptions): string;
    /**
     * Copy text to clipboard.
     * Uses modern Clipboard API with fallback for older browsers.
     * @param {string} text - Text to copy
     * @returns {Promise<boolean>} True if copy succeeded
     */
    function copyToClipboard(text: string): Promise<boolean>;
    /**
     * Escape HTML special characters to prevent XSS attacks.
     * @param {any} str - String to escape
     * @returns {string} Escaped string
     */
    function escapeHtml(str: any): string;
    /**
     * Creates a lodash-style wrapper for explicit chaining.
     * Allows method chaining with .value() to extract the final result.
     * @param {any} value - The value to wrap
     * @returns {UtilsChain} Chainable wrapper object
     * @example
     * _.chain([1, 2, 3, 4])
     *     .map(x => x * 2)
     *     .filter(x => x > 4)
     *     .sum()
     *     .value(); // 14
     */
    function chain(value: any): UtilsChain;
}
export default utils;
/**
 * An array, or an object whose values are the items.
 */
export type Collection<T> = T[] | Record<string, T>;
/**
 * Called with each item, its index (or key, for an object) and the collection.
 */
export type Iteratee<T, R> = (value: T, index: number | string, collection: Collection<T>) => R;
export type Predicate<T> = (value: T, index: number | string, collection: Collection<T>) => boolean;
/**
 * A function of the item, or the name of one of its properties.
 */
export type PropertyIteratee<T> = ((value: T) => any) | keyof T;
export type DebounceOptions = {
    /**
     * - Invoke on the leading edge of the timeout
     */
    leading?: boolean;
    /**
     * - Invoke on the trailing edge of the timeout
     */
    trailing?: boolean;
    /**
     * - Longest time func may be delayed before it is invoked
     */
    maxWait?: number;
};
export type ThrottleOptions = {
    /**
     * - Invoke on the leading edge of the timeout
     */
    leading?: boolean;
    /**
     * - Invoke on the trailing edge of the timeout
     */
    trailing?: boolean;
};
export type TruncateOptions = {
    /**
     * - Maximum string length, omission included
     */
    length?: number;
    /**
     * - Appended to a truncated string
     */
    omission?: string;
    /**
     * - Truncate back to the last match of this
     */
    separator?: string | RegExp;
};
export type TemplateOptions = {
    /**
     * - Named partial templates, for `{{> name}}`
     */
    partials?: Record<string, string>;
    /**
     * - Helper functions, for `{{helperName arg ...}}`
     */
    helpers?: Record<string, (...args: any[]) => any>;
};
/**
 * A debounced (or throttled) function. Until func has run once a call returns undefined;
 * after that it returns the result of the latest invocation.
 */
export type DebouncedFunction<T extends (...args: any[]) => any> = ((...args: Parameters<T>) => ReturnType<T> | undefined) & {
    cancel: () => void;
    flush: () => ReturnType<T> | undefined;
};
/**
 * A memoised function; `cache` is keyed by the first argument (or the resolver's result).
 */
export type MemoizedFunction<T extends (...args: any[]) => any> = ((...args: Parameters<T>) => ReturnType<T>) & {
    cache: Map<any, ReturnType<T>>;
};
/**
 * The wrapper `chain()` returns. Each chainable utility is a method that takes the remaining
 * arguments and returns the wrapper; `sum`, `mean`, `min`, `max`, `toArray` and `toString` return
 * their result; `value()` returns the wrapped value.
 */
export type UtilsChain = {
    value: () => any;
} & {
    [method: string]: (...args: any[]) => any;
};
/**
 * The utilities object (`Domma.utils`, `_`).
 */
export type Utils = typeof utils;
