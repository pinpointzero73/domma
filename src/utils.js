export const utils = {
    // ============================================
    // Array Utilities
    // ============================================

    /**
     * Creates an array of elements split into groups of the specified size.
     * @param {Array} array
     * @param {number} size
     * @returns {Array}
     */
    chunk(array, size = 1) {
        if (!array || size < 1) return [];
        const result = [];
        for (let i = 0; i < array.length; i += size) {
            result.push(array.slice(i, i + size));
        }
        return result;
    },

    /**
     * Creates an array with all falsy values removed.
     * @param {Array} array
     * @returns {Array}
     */
    compact(array) {
        return array ? array.filter(Boolean) : [];
    },

    /**
     * Creates a new array concatenating array with additional arrays/values.
     * @param {Array} array
     * @param {...*} values
     * @returns {Array}
     */
    concat(array, ...values) {
        return array ? array.concat(...values) : [];
    },

    /**
     * Creates an array of values not included in the other given arrays.
     * @param {Array} array
     * @param {...Array} values
     * @returns {Array}
     */
    difference(array, ...values) {
        if (!array) return [];
        const exclude = new Set(values.flat());
        return array.filter(item => !exclude.has(item));
    },

    /**
     * Creates a slice of array with n elements dropped from the beginning.
     * @param {Array} array
     * @param {number} n
     * @returns {Array}
     */
    drop(array, n = 1) {
        return array ? array.slice(n) : [];
    },

    /**
     * Creates a slice of array with n elements dropped from the end.
     * @param {Array} array
     * @param {number} n
     * @returns {Array}
     */
    dropRight(array, n = 1) {
        if (!array) return [];
        const length = array.length - n;
        return length > 0 ? array.slice(0, length) : [];
    },

    /**
     * Fills elements of array with value from start up to end.
     * @param {Array} array
     * @param {*} value
     * @param {number} start
     * @param {number} end
     * @returns {Array}
     */
    fill(array, value, start = 0, end) {
        if (!array) return [];
        return array.fill(value, start, end);
    },

    /**
     * Returns the index of the first element predicate returns truthy for.
     * @param {Array} array
     * @param {Function} predicate
     * @param {number} fromIndex
     * @returns {number}
     */
    findIndex(array, predicate, fromIndex = 0) {
        if (!array) return -1;
        for (let i = fromIndex; i < array.length; i++) {
            if (predicate(array[i], i, array)) return i;
        }
        return -1;
    },

    /**
     * Returns the index of the last element predicate returns truthy for.
     * @param {Array} array
     * @param {Function} predicate
     * @param {number} fromIndex
     * @returns {number}
     */
    findLastIndex(array, predicate, fromIndex) {
        if (!array) return -1;
        const start = fromIndex !== undefined ? fromIndex : array.length - 1;
        for (let i = start; i >= 0; i--) {
            if (predicate(array[i], i, array)) return i;
        }
        return -1;
    },

    /**
     * Gets the first element of array.
     * @param {Array} array
     * @returns {*}
     */
    first(array) {
        return array ? array[0] : undefined;
    },

    /**
     * Alias for first.
     * @param {Array} array
     * @returns {*}
     */
    head(array) {
        return this.first(array);
    },

    /**
     * Flattens array a single level deep.
     * @param {Array} array
     * @returns {Array}
     */
    flatten(array) {
        return array ? array.flat(1) : [];
    },

    /**
     * Recursively flattens array.
     * @param {Array} array
     * @returns {Array}
     */
    flattenDeep(array) {
        return array ? array.flat(Infinity) : [];
    },

    /**
     * Flattens array up to depth times.
     * @param {Array} array
     * @param {number} depth
     * @returns {Array}
     */
    flattenDepth(array, depth = 1) {
        return array ? array.flat(depth) : [];
    },

    /**
     * Returns an object composed from key-value pairs.
     * @param {Array} pairs
     * @returns {Object}
     */
    fromPairs(pairs) {
        return pairs ? Object.fromEntries(pairs) : {};
    },

    /**
     * Gets the index at which the first occurrence of value is found.
     * @param {Array} array
     * @param {*} value
     * @param {number} fromIndex
     * @returns {number}
     */
    indexOf(array, value, fromIndex = 0) {
        return array ? array.indexOf(value, fromIndex) : -1;
    },

    /**
     * Gets all but the last element of array.
     * @param {Array} array
     * @returns {Array}
     */
    initial(array) {
        return array ? array.slice(0, -1) : [];
    },

    /**
     * Creates an array of unique values that are included in all given arrays.
     * @param {...Array} arrays
     * @returns {Array}
     */
    intersection(...arrays) {
        if (!arrays.length) return [];
        const first = arrays[0];
        return first.filter(item =>
            arrays.every(arr => arr.includes(item))
        );
    },

    /**
     * Converts all elements in array into a string separated by separator.
     * @param {Array} array
     * @param {string} separator
     * @returns {string}
     */
    join(array, separator = ',') {
        return array ? array.join(separator) : '';
    },

    /**
     * Gets the last element of array.
     * @param {Array} array
     * @returns {*}
     */
    last(array) {
        return array ? array[array.length - 1] : undefined;
    },

    /**
     * Gets the index at which the last occurrence of value is found.
     * @param {Array} array
     * @param {*} value
     * @param {number} fromIndex
     * @returns {number}
     */
    lastIndexOf(array, value, fromIndex) {
        if (!array) return -1;
        return fromIndex !== undefined
            ? array.lastIndexOf(value, fromIndex)
            : array.lastIndexOf(value);
    },

    /**
     * Gets the element at index n of array.
     * @param {Array} array
     * @param {number} n
     * @returns {*}
     */
    nth(array, n = 0) {
        if (!array) return undefined;
        return n < 0 ? array[array.length + n] : array[n];
    },

    /**
     * Removes all given values from array.
     * @param {Array} array
     * @param {...*} values
     * @returns {Array}
     */
    pull(array, ...values) {
        if (!array) return [];
        const valSet = new Set(values);
        for (let i = array.length - 1; i >= 0; i--) {
            if (valSet.has(array[i])) array.splice(i, 1);
        }
        return array;
    },

    /**
     * Removes elements from array corresponding to indexes.
     * @param {Array} array
     * @param {...number} indexes
     * @returns {Array}
     */
    pullAt(array, ...indexes) {
        if (!array) return [];
        const flatIndexes = indexes.flat().sort((a, b) => b - a);
        const removed = [];
        flatIndexes.forEach(i => {
            if (i >= 0 && i < array.length) {
                removed.unshift(array.splice(i, 1)[0]);
            }
        });
        return removed;
    },

    /**
     * Reverses array so that the first element becomes the last.
     * @param {Array} array
     * @returns {Array}
     */
    reverse(array) {
        return array ? array.reverse() : [];
    },

    /**
     * Creates a slice of array from start up to end.
     * @param {Array} array
     * @param {number} start
     * @param {number} end
     * @returns {Array}
     */
    slice(array, start = 0, end) {
        if (!array) return [];
        return end !== undefined ? array.slice(start, end) : array.slice(start);
    },

    /**
     * Gets all but the first element of array.
     * @param {Array} array
     * @returns {Array}
     */
    tail(array) {
        return array ? array.slice(1) : [];
    },

    /**
     * Creates a slice of array with n elements taken from the beginning.
     * @param {Array} array
     * @param {number} n
     * @returns {Array}
     */
    take(array, n = 1) {
        return array ? array.slice(0, n) : [];
    },

    /**
     * Creates a slice of array with n elements taken from the end.
     * @param {Array} array
     * @param {number} n
     * @returns {Array}
     */
    takeRight(array, n = 1) {
        if (!array) return [];
        const start = Math.max(0, array.length - n);
        return array.slice(start);
    },

    /**
     * Creates an array of unique values, in order, from all given arrays.
     * @param {...Array} arrays
     * @returns {Array}
     */
    union(...arrays) {
        return [...new Set(arrays.flat())];
    },

    /**
     * Creates a duplicate-free version of an array.
     * @param {Array} array
     * @returns {Array}
     */
    uniq(array) {
        return array ? [...new Set(array)] : [];
    },

    /**
     * Creates a duplicate-free version using iteratee.
     * @param {Array} array
     * @param {Function} iteratee
     * @returns {Array}
     */
    uniqBy(array, iteratee) {
        if (!array) return [];
        const seen = new Set();
        return array.filter(item => {
            const key = iteratee(item);
            if (seen.has(key)) return false;
            seen.add(key);
            return true;
        });
    },

    /**
     * Creates an array excluding all given values.
     * @param {Array} array
     * @param {...*} values
     * @returns {Array}
     */
    without(array, ...values) {
        if (!array) return [];
        const exclude = new Set(values);
        return array.filter(item => !exclude.has(item));
    },

    /**
     * Creates an array of unique values that is the symmetric difference.
     * @param {...Array} arrays
     * @returns {Array}
     */
    xor(...arrays) {
        if (!arrays.length) return [];
        const counts = new Map();
        arrays.flat().forEach(item => {
            counts.set(item, (counts.get(item) || 0) + 1);
        });
        return [...counts.entries()]
            .filter(([, count]) => count === 1)
            .map(([item]) => item);
    },

    /**
     * Creates an array of grouped elements.
     * @param {...Array} arrays
     * @returns {Array}
     */
    zip(...arrays) {
        if (!arrays.length) return [];
        const maxLen = Math.max(...arrays.map(arr => arr.length));
        const result = [];
        for (let i = 0; i < maxLen; i++) {
            result.push(arrays.map(arr => arr[i]));
        }
        return result;
    },

    /**
     * Creates an object composed from arrays of keys and values.
     * @param {Array} keys
     * @param {Array} values
     * @returns {Object}
     */
    zipObject(keys, values) {
        if (!keys) return {};
        const result = {};
        keys.forEach((key, i) => {
            result[key] = values ? values[i] : undefined;
        });
        return result;
    },

    // ============================================
    // Collection Utilities
    // ============================================

    /**
     * Creates an object composed of keys generated from the results of running each element through iteratee.
     * @param {Array|Object} collection
     * @param {Function} iteratee
     * @returns {Object}
     */
    countBy(collection, iteratee) {
        const result = {};
        this.each(collection, item => {
            const key = iteratee(item);
            result[key] = (result[key] || 0) + 1;
        });
        return result;
    },

    /**
     * Iterates over elements invoking iteratee for each element.
     * @param {Array|Object} collection
     * @param {Function} iteratee
     * @returns {Array|Object}
     */
    each(collection, iteratee) {
        if (Array.isArray(collection)) {
            collection.forEach((item, index) => iteratee(item, index, collection));
        } else if (collection && typeof collection === 'object') {
            Object.keys(collection).forEach(key => iteratee(collection[key], key, collection));
        }
        return collection;
    },

    /**
     * Alias for each.
     * @param {Array|Object} collection
     * @param {Function} iteratee
     * @returns {Array|Object}
     */
    forEach(collection, iteratee) {
        return this.each(collection, iteratee);
    },

    /**
     * Iterates over elements in reverse invoking iteratee for each element.
     * @param {Array|Object} collection
     * @param {Function} iteratee
     * @returns {Array|Object}
     */
    eachRight(collection, iteratee) {
        if (Array.isArray(collection)) {
            for (let i = collection.length - 1; i >= 0; i--) {
                iteratee(collection[i], i, collection);
            }
        } else if (collection && typeof collection === 'object') {
            const keys = Object.keys(collection).reverse();
            keys.forEach(key => iteratee(collection[key], key, collection));
        }
        return collection;
    },

    /**
     * Alias for eachRight.
     * @param {Array|Object} collection
     * @param {Function} iteratee
     * @returns {Array|Object}
     */
    forEachRight(collection, iteratee) {
        return this.eachRight(collection, iteratee);
    },

    /**
     * Checks if predicate returns truthy for all elements of collection.
     * @param {Array|Object} collection
     * @param {Function} predicate
     * @returns {boolean}
     */
    every(collection, predicate) {
        if (Array.isArray(collection)) {
            return collection.every(predicate);
        }
        if (collection && typeof collection === 'object') {
            return Object.values(collection).every(predicate);
        }
        return true;
    },

    /**
     * Iterates over elements returning an array of all elements predicate returns truthy for.
     * @param {Array|Object} collection
     * @param {Function} predicate
     * @returns {Array}
     */
    filter(collection, predicate) {
        if (Array.isArray(collection)) {
            return collection.filter(predicate);
        }
        if (collection && typeof collection === 'object') {
            return Object.values(collection).filter(predicate);
        }
        return [];
    },

    /**
     * Iterates over elements returning the first element predicate returns truthy for.
     * @param {Array|Object} collection
     * @param {Function} predicate
     * @returns {*}
     */
    find(collection, predicate) {
        if (Array.isArray(collection)) {
            return collection.find(predicate);
        }
        if (collection && typeof collection === 'object') {
            return Object.values(collection).find(predicate);
        }
        return undefined;
    },

    /**
     * Iterates over elements returning the last element predicate returns truthy for.
     * @param {Array|Object} collection
     * @param {Function} predicate
     * @returns {*}
     */
    findLast(collection, predicate) {
        if (Array.isArray(collection)) {
            for (let i = collection.length - 1; i >= 0; i--) {
                if (predicate(collection[i], i, collection)) return collection[i];
            }
        } else if (collection && typeof collection === 'object') {
            const values = Object.values(collection).reverse();
            return values.find(predicate);
        }
        return undefined;
    },

    /**
     * Creates a flattened array of values by running each element through iteratee.
     * @param {Array|Object} collection
     * @param {Function} iteratee
     * @returns {Array}
     */
    flatMap(collection, iteratee) {
        return this.map(collection, iteratee).flat(1);
    },

    /**
     * Recursively flattens the mapped results.
     * @param {Array|Object} collection
     * @param {Function} iteratee
     * @returns {Array}
     */
    flatMapDeep(collection, iteratee) {
        return this.map(collection, iteratee).flat(Infinity);
    },

    /**
     * Creates an object composed of keys generated from the results of running each element through iteratee.
     * @param {Array|Object} collection
     * @param {Function} iteratee
     * @returns {Object}
     */
    groupBy(collection, iteratee) {
        const result = {};
        this.each(collection, item => {
            const key = typeof iteratee === 'function' ? iteratee(item) : item[iteratee];
            if (!result[key]) result[key] = [];
            result[key].push(item);
        });
        return result;
    },

    /**
     * Checks if value is in collection.
     * @param {Array|Object|string} collection
     * @param {*} value
     * @param {number} fromIndex
     * @returns {boolean}
     */
    includes(collection, value, fromIndex = 0) {
        if (typeof collection === 'string') {
            return collection.includes(value, fromIndex);
        }
        if (Array.isArray(collection)) {
            return collection.includes(value, fromIndex);
        }
        if (collection && typeof collection === 'object') {
            return Object.values(collection).includes(value);
        }
        return false;
    },

    /**
     * Creates an object composed of keys generated from the results of running each element through iteratee.
     * @param {Array|Object} collection
     * @param {Function} iteratee
     * @returns {Object}
     */
    keyBy(collection, iteratee) {
        const result = {};
        this.each(collection, item => {
            const key = typeof iteratee === 'function' ? iteratee(item) : item[iteratee];
            result[key] = item;
        });
        return result;
    },

    /**
     * Creates an array of values by running each element through iteratee.
     * @param {Array|Object} collection
     * @param {Function} iteratee
     * @returns {Array}
     */
    map(collection, iteratee) {
        if (Array.isArray(collection)) {
            return collection.map(iteratee);
        }
        if (collection && typeof collection === 'object') {
            return Object.entries(collection).map(([key, value]) => iteratee(value, key, collection));
        }
        return [];
    },

    /**
     * Creates an array of elements sorted in ascending order by the results of running each element through iteratee.
     * @param {Array|Object} collection
     * @param {Function|string} iteratee
     * @returns {Array}
     */
    orderBy(collection, iteratees, orders) {
        const items = Array.isArray(collection) ? [...collection] : Object.values(collection);
        const iters = Array.isArray(iteratees) ? iteratees : [iteratees];
        const dirs = Array.isArray(orders) ? orders : [orders || 'asc'];

        return items.sort((a, b) => {
            for (let i = 0; i < iters.length; i++) {
                const iter = iters[i];
                const dir = dirs[i] || 'asc';
                const aVal = typeof iter === 'function' ? iter(a) : a[iter];
                const bVal = typeof iter === 'function' ? iter(b) : b[iter];

                if (aVal < bVal) return dir === 'asc' ? -1 : 1;
                if (aVal > bVal) return dir === 'asc' ? 1 : -1;
            }
            return 0;
        });
    },

    /**
     * Creates an array of elements split into two groups.
     * @param {Array|Object} collection
     * @param {Function} predicate
     * @returns {Array}
     */
    partition(collection, predicate) {
        const truthy = [];
        const falsy = [];
        this.each(collection, (item, index) => {
            if (predicate(item, index, collection)) {
                truthy.push(item);
            } else {
                falsy.push(item);
            }
        });
        return [truthy, falsy];
    },

    /**
     * Reduces collection to a value which is the accumulated result of running each element through iteratee.
     * @param {Array|Object} collection
     * @param {Function} iteratee
     * @param {*} accumulator
     * @returns {*}
     */
    reduce(collection, iteratee, accumulator) {
        if (Array.isArray(collection)) {
            return accumulator !== undefined
                ? collection.reduce(iteratee, accumulator)
                : collection.reduce(iteratee);
        }
        if (collection && typeof collection === 'object') {
            const entries = Object.entries(collection);
            let acc = accumulator;
            let startIndex = 0;
            if (acc === undefined && entries.length > 0) {
                acc = entries[0][1];
                startIndex = 1;
            }
            for (let i = startIndex; i < entries.length; i++) {
                const [key, value] = entries[i];
                acc = iteratee(acc, value, key, collection);
            }
            return acc;
        }
        return accumulator;
    },

    /**
     * Reduces collection from right to left.
     * @param {Array|Object} collection
     * @param {Function} iteratee
     * @param {*} accumulator
     * @returns {*}
     */
    reduceRight(collection, iteratee, accumulator) {
        if (Array.isArray(collection)) {
            return accumulator !== undefined
                ? collection.reduceRight(iteratee, accumulator)
                : collection.reduceRight(iteratee);
        }
        if (collection && typeof collection === 'object') {
            const entries = Object.entries(collection).reverse();
            let acc = accumulator;
            let startIndex = 0;
            if (acc === undefined && entries.length > 0) {
                acc = entries[0][1];
                startIndex = 1;
            }
            for (let i = startIndex; i < entries.length; i++) {
                const [key, value] = entries[i];
                acc = iteratee(acc, value, key, collection);
            }
            return acc;
        }
        return accumulator;
    },

    /**
     * The opposite of filter; returns elements predicate does not return truthy for.
     * @param {Array|Object} collection
     * @param {Function} predicate
     * @returns {Array}
     */
    reject(collection, predicate) {
        return this.filter(collection, (item, index, col) => !predicate(item, index, col));
    },

    /**
     * Gets a random element from collection.
     * @param {Array|Object} collection
     * @returns {*}
     */
    sample(collection) {
        const arr = Array.isArray(collection) ? collection : Object.values(collection || {});
        return arr[Math.floor(Math.random() * arr.length)];
    },

    /**
     * Gets n random elements from collection.
     * @param {Array|Object} collection
     * @param {number} n
     * @returns {Array}
     */
    sampleSize(collection, n = 1) {
        const arr = this.shuffle(Array.isArray(collection) ? [...collection] : Object.values(collection || {}));
        return arr.slice(0, n);
    },

    /**
     * Creates a shuffled array using Fisher-Yates shuffle.
     * @param {Array|Object} collection
     * @returns {Array}
     */
    shuffle(collection) {
        const arr = Array.isArray(collection) ? [...collection] : Object.values(collection || {});
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr;
    },

    /**
     * Gets the size of collection.
     * @param {Array|Object|string} collection
     * @returns {number}
     */
    size(collection) {
        if (collection === null || collection === undefined) return 0;
        if (typeof collection === 'string' || Array.isArray(collection)) {
            return collection.length;
        }
        if (typeof collection === 'object') {
            return Object.keys(collection).length;
        }
        return 0;
    },

    /**
     * Checks if predicate returns truthy for any element of collection.
     * @param {Array|Object} collection
     * @param {Function} predicate
     * @returns {boolean}
     */
    some(collection, predicate) {
        if (Array.isArray(collection)) {
            return collection.some(predicate);
        }
        if (collection && typeof collection === 'object') {
            return Object.values(collection).some(predicate);
        }
        return false;
    },

    /**
     * Creates an array of elements sorted by iteratee.
     * @param {Array|Object} collection
     * @param {Function|string} iteratee
     * @returns {Array}
     */
    sortBy(collection, iteratee) {
        const items = Array.isArray(collection) ? [...collection] : Object.values(collection);
        return items.sort((a, b) => {
            const aVal = typeof iteratee === 'function' ? iteratee(a) : a[iteratee];
            const bVal = typeof iteratee === 'function' ? iteratee(b) : b[iteratee];
            if (aVal < bVal) return -1;
            if (aVal > bVal) return 1;
            return 0;
        });
    },

    // ============================================
    // Function Utilities
    // ============================================

    /**
     * Creates a function that invokes func once it's called n or more times.
     * @param {number} n
     * @param {Function} func
     * @returns {Function}
     */
    after(n, func) {
        let count = 0;
        return function(...args) {
            if (++count >= n) {
                return func.apply(this, args);
            }
        };
    },

    /**
     * Creates a function that invokes func, with up to n arguments.
     * @param {Function} func
     * @param {number} n
     * @returns {Function}
     */
    ary(func, n = func.length) {
        return function(...args) {
            return func.apply(this, args.slice(0, n));
        };
    },

    /**
     * Creates a function that invokes func while it's called less than n times.
     * @param {number} n
     * @param {Function} func
     * @returns {Function}
     */
    before(n, func) {
        let count = 0;
        let result;
        return function(...args) {
            if (++count < n) {
                result = func.apply(this, args);
            }
            return result;
        };
    },

    /**
     * Creates a function that invokes func with the this binding of thisArg.
     * @param {Function} func
     * @param {*} thisArg
     * @param {...*} partials
     * @returns {Function}
     */
    bind(func, thisArg, ...partials) {
        return function(...args) {
            return func.apply(thisArg, [...partials, ...args]);
        };
    },

    /**
     * Creates a function that accepts arguments of func and returns a function.
     * @param {Function} func
     * @param {number} arity
     * @returns {Function}
     */
    curry(func, arity = func.length) {
        return function curried(...args) {
            if (args.length >= arity) {
                return func.apply(this, args);
            }
            return function(...nextArgs) {
                return curried.apply(this, [...args, ...nextArgs]);
            };
        };
    },

    /**
     * Creates a function that accepts arguments of func and returns a function (right to left).
     * @param {Function} func
     * @param {number} arity
     * @returns {Function}
     */
    curryRight(func, arity = func.length) {
        return function curried(...args) {
            if (args.length >= arity) {
                return func.apply(this, args.reverse());
            }
            return function(...nextArgs) {
                return curried.apply(this, [...nextArgs, ...args]);
            };
        };
    },

    /**
     * Creates a debounced function that delays invoking func until after wait ms.
     * @param {Function} func
     * @param {number} wait
     * @param {Object} options
     * @returns {Function}
     */
    debounce(func, wait = 0, options = {}) {
        let timeoutId;
        let lastArgs;
        let lastThis;
        let result;
        let lastCallTime;
        let lastInvokeTime = 0;
        const leading = options.leading || false;
        const trailing = options.trailing !== false;
        const maxWait = options.maxWait;

        function invokeFunc(time) {
            const args = lastArgs;
            const thisArg = lastThis;
            lastArgs = lastThis = undefined;
            lastInvokeTime = time;
            result = func.apply(thisArg, args);
            return result;
        }

        function shouldInvoke(time) {
            const timeSinceLastCall = time - lastCallTime;
            const timeSinceLastInvoke = time - lastInvokeTime;
            return (lastCallTime === undefined) ||
                (timeSinceLastCall >= wait) ||
                (timeSinceLastCall < 0) ||
                (maxWait !== undefined && timeSinceLastInvoke >= maxWait);
        }

        function timerExpired() {
            const time = Date.now();
            if (shouldInvoke(time)) {
                return trailingEdge(time);
            }
            timeoutId = setTimeout(timerExpired, remainingWait(time));
        }

        function remainingWait(time) {
            const timeSinceLastCall = time - lastCallTime;
            const timeSinceLastInvoke = time - lastInvokeTime;
            const timeWaiting = wait - timeSinceLastCall;
            return maxWait !== undefined
                ? Math.min(timeWaiting, maxWait - timeSinceLastInvoke)
                : timeWaiting;
        }

        function leadingEdge(time) {
            lastInvokeTime = time;
            timeoutId = setTimeout(timerExpired, wait);
            return leading ? invokeFunc(time) : result;
        }

        function trailingEdge(time) {
            timeoutId = undefined;
            if (trailing && lastArgs) {
                return invokeFunc(time);
            }
            lastArgs = lastThis = undefined;
            return result;
        }

        function debounced(...args) {
            const time = Date.now();
            const isInvoking = shouldInvoke(time);
            lastArgs = args;
            lastThis = this;
            lastCallTime = time;

            if (isInvoking) {
                if (timeoutId === undefined) {
                    return leadingEdge(lastCallTime);
                }
                if (maxWait !== undefined) {
                    timeoutId = setTimeout(timerExpired, wait);
                    return invokeFunc(lastCallTime);
                }
            }
            if (timeoutId === undefined) {
                timeoutId = setTimeout(timerExpired, wait);
            }
            return result;
        }

        debounced.cancel = function() {
            if (timeoutId !== undefined) {
                clearTimeout(timeoutId);
            }
            lastInvokeTime = 0;
            lastArgs = lastCallTime = lastThis = timeoutId = undefined;
        };

        debounced.flush = function() {
            return timeoutId === undefined ? result : trailingEdge(Date.now());
        };

        return debounced;
    },

    /**
     * Defers invoking the func until the current call stack has cleared.
     * @param {Function} func
     * @param {...*} args
     * @returns {number}
     */
    defer(func, ...args) {
        return setTimeout(() => func.apply(this, args), 1);
    },

    /**
     * Invokes func after wait milliseconds.
     * @param {Function} func
     * @param {number} wait
     * @param {...*} args
     * @returns {number}
     */
    delay(func, wait, ...args) {
        return setTimeout(() => func.apply(this, args), wait);
    },

    /**
     * Creates a function that invokes func with arguments reversed.
     * @param {Function} func
     * @returns {Function}
     */
    flip(func) {
        return function(...args) {
            return func.apply(this, args.reverse());
        };
    },

    /**
     * Creates a function that memoizes the result of func.
     * @param {Function} func
     * @param {Function} resolver
     * @returns {Function}
     */
    memoize(func, resolver) {
        const cache = new Map();
        const memoized = function(...args) {
            const key = resolver ? resolver.apply(this, args) : args[0];
            if (cache.has(key)) {
                return cache.get(key);
            }
            const result = func.apply(this, args);
            cache.set(key, result);
            return result;
        };
        memoized.cache = cache;
        return memoized;
    },

    /**
     * Creates a function that negates the result of the predicate func.
     * @param {Function} predicate
     * @returns {Function}
     */
    negate(predicate) {
        return function(...args) {
            return !predicate.apply(this, args);
        };
    },

    /**
     * Creates a function that is restricted to invoking func once.
     * @param {Function} func
     * @returns {Function}
     */
    once(func) {
        return this.before(2, func);
    },

    /**
     * Creates a function that invokes func with partials prepended.
     * @param {Function} func
     * @param {...*} partials
     * @returns {Function}
     */
    partial(func, ...partials) {
        return function(...args) {
            return func.apply(this, [...partials, ...args]);
        };
    },

    /**
     * Creates a function that invokes func with partials appended.
     * @param {Function} func
     * @param {...*} partials
     * @returns {Function}
     */
    partialRight(func, ...partials) {
        return function(...args) {
            return func.apply(this, [...args, ...partials]);
        };
    },

    /**
     * Creates a throttled function that only invokes func at most once per every wait ms.
     * @param {Function} func
     * @param {number} wait
     * @param {Object} options
     * @returns {Function}
     */
    throttle(func, wait = 0, options = {}) {
        const leading = options.leading !== false;
        const trailing = options.trailing !== false;
        return this.debounce(func, wait, {
            leading,
            trailing,
            maxWait: wait
        });
    },

    /**
     * Creates a function that accepts up to one argument.
     * @param {Function} func
     * @returns {Function}
     */
    unary(func) {
        return this.ary(func, 1);
    },

    /**
     * Creates a function that provides value to wrapper as its first argument.
     * @param {*} value
     * @param {Function} wrapper
     * @returns {Function}
     */
    wrap(value, wrapper) {
        return function(...args) {
            return wrapper.apply(this, [value, ...args]);
        };
    },

    // ============================================
    // Object Utilities
    // ============================================

    /**
     * Assigns own enumerable string keyed properties of source objects to the destination object.
     * @param {Object} object
     * @param {...Object} sources
     * @returns {Object}
     */
    assign(object, ...sources) {
        return Object.assign(object || {}, ...sources);
    },

    /**
     * Like assign but iterates over own and inherited source properties.
     * @param {Object} object
     * @param {...Object} sources
     * @returns {Object}
     */
    assignIn(object, ...sources) {
        const target = object || {};
        sources.forEach(source => {
            if (source) {
                for (const key in source) {
                    target[key] = source[key];
                }
            }
        });
        return target;
    },

    /**
     * Alias for assignIn.
     * @param {Object} object
     * @param {...Object} sources
     * @returns {Object}
     */
    extend(object, ...sources) {
        return this.assignIn(object, ...sources);
    },

    /**
     * Creates an array of values corresponding to paths of object.
     * @param {Object} object
     * @param {...(string|string[])} paths
     * @returns {Array}
     */
    at(object, ...paths) {
        const flatPaths = paths.flat();
        return flatPaths.map(path => this.get(object, path));
    },

    /**
     * Creates a shallow clone of value.
     * @param {*} value
     * @returns {*}
     */
    clone(value) {
        if (value === null || typeof value !== 'object') {
            return value;
        }
        if (Array.isArray(value)) {
            return [...value];
        }
        return { ...value };
    },

    /**
     * Creates a deep clone of value.
     * @param {*} value
     * @returns {*}
     */
    cloneDeep(value) {
        if (value === null || typeof value !== 'object') {
            return value;
        }
        if (Array.isArray(value)) {
            return value.map(item => this.cloneDeep(item));
        }
        if (value instanceof Date) {
            return new Date(value);
        }
        if (value instanceof RegExp) {
            return new RegExp(value);
        }
        const cloned = {};
        for (const key in value) {
            if (Object.prototype.hasOwnProperty.call(value, key)) {
                cloned[key] = this.cloneDeep(value[key]);
            }
        }
        return cloned;
    },

    /**
     * Assigns own and inherited enumerable string keyed properties of source objects to the destination object for all destination properties that resolve to undefined.
     * @param {Object} object
     * @param {...Object} sources
     * @returns {Object}
     */
    defaults(object, ...sources) {
        const target = object || {};
        sources.forEach(source => {
            if (source) {
                Object.keys(source).forEach(key => {
                    if (target[key] === undefined) {
                        target[key] = source[key];
                    }
                });
            }
        });
        return target;
    },

    /**
     * Like defaults but recursively assigns default properties.
     * @param {Object} object
     * @param {...Object} sources
     * @returns {Object}
     */
    defaultsDeep(object, ...sources) {
        const target = object || {};
        sources.forEach(source => {
            if (source && typeof source === 'object') {
                Object.keys(source).forEach(key => {
                    const targetVal = target[key];
                    const sourceVal = source[key];
                    if (targetVal === undefined) {
                        target[key] = this.cloneDeep(sourceVal);
                    } else if (
                        targetVal && typeof targetVal === 'object' &&
                        sourceVal && typeof sourceVal === 'object' &&
                        !Array.isArray(targetVal) && !Array.isArray(sourceVal)
                    ) {
                        this.defaultsDeep(targetVal, sourceVal);
                    }
                });
            }
        });
        return target;
    },

    /**
     * Creates an array of own enumerable string keyed-value pairs.
     * @param {Object} object
     * @returns {Array}
     */
    entries(object) {
        return object ? Object.entries(object) : [];
    },

    /**
     * Alias for entries.
     * @param {Object} object
     * @returns {Array}
     */
    toPairs(object) {
        return this.entries(object);
    },

    /**
     * Returns the key of the first element predicate returns truthy for.
     * @param {Object} object
     * @param {Function} predicate
     * @returns {string|undefined}
     */
    findKey(object, predicate) {
        if (!object) return undefined;
        for (const key of Object.keys(object)) {
            if (predicate(object[key], key, object)) {
                return key;
            }
        }
        return undefined;
    },

    /**
     * Returns the key of the last element predicate returns truthy for.
     * @param {Object} object
     * @param {Function} predicate
     * @returns {string|undefined}
     */
    findLastKey(object, predicate) {
        if (!object) return undefined;
        const keys = Object.keys(object).reverse();
        for (const key of keys) {
            if (predicate(object[key], key, object)) {
                return key;
            }
        }
        return undefined;
    },

    /**
     * Iterates over own and inherited enumerable string keyed properties of an object.
     * @param {Object} object
     * @param {Function} iteratee
     * @returns {Object}
     */
    forIn(object, iteratee) {
        if (object) {
            for (const key in object) {
                if (iteratee(object[key], key, object) === false) break;
            }
        }
        return object;
    },

    /**
     * Iterates over own enumerable string keyed properties of an object.
     * @param {Object} object
     * @param {Function} iteratee
     * @returns {Object}
     */
    forOwn(object, iteratee) {
        if (object) {
            for (const key of Object.keys(object)) {
                if (iteratee(object[key], key, object) === false) break;
            }
        }
        return object;
    },

    /**
     * Gets the value at path of object.
     * @param {Object} object
     * @param {string|Array} path
     * @param {*} defaultValue
     * @returns {*}
     */
    get(object, path, defaultValue) {
        if (!object) return defaultValue;
        const keys = Array.isArray(path) ? path : path.replace(/\[(\d+)]/g, '.$1').split('.');
        let result = object;
        for (const key of keys) {
            if (result === null || result === undefined) {
                return defaultValue;
            }
            result = result[key];
        }
        return result === undefined ? defaultValue : result;
    },

    /**
     * Checks if path is a direct property of object.
     * @param {Object} object
     * @param {string|Array} path
     * @returns {boolean}
     */
    has(object, path) {
        if (!object) return false;
        const keys = Array.isArray(path) ? path : path.replace(/\[(\d+)]/g, '.$1').split('.');
        let current = object;
        for (const key of keys) {
            if (!Object.prototype.hasOwnProperty.call(current, key)) {
                return false;
            }
            current = current[key];
        }
        return true;
    },

    /**
     * Creates an object composed of the inverted keys and values of object.
     * @param {Object} object
     * @returns {Object}
     */
    invert(object) {
        const result = {};
        if (object) {
            Object.entries(object).forEach(([key, value]) => {
                result[value] = key;
            });
        }
        return result;
    },

    /**
     * Like invert but accepts iteratee which is invoked for each element.
     * @param {Object} object
     * @param {Function} iteratee
     * @returns {Object}
     */
    invertBy(object, iteratee = val => val) {
        const result = {};
        if (object) {
            Object.entries(object).forEach(([key, value]) => {
                const invertedKey = iteratee(value);
                if (!result[invertedKey]) result[invertedKey] = [];
                result[invertedKey].push(key);
            });
        }
        return result;
    },

    /**
     * Creates an array of the own enumerable property names of object.
     * @param {Object} object
     * @returns {Array}
     */
    keys(object) {
        return object ? Object.keys(object) : [];
    },

    /**
     * Creates an array of own and inherited enumerable property names.
     * @param {Object} object
     * @returns {Array}
     */
    keysIn(object) {
        const result = [];
        for (const key in object) {
            result.push(key);
        }
        return result;
    },

    /**
     * Creates an object with the same values as object and keys generated by running each own enumerable property through iteratee.
     * @param {Object} object
     * @param {Function} iteratee
     * @returns {Object}
     */
    mapKeys(object, iteratee) {
        const result = {};
        if (object) {
            Object.entries(object).forEach(([key, value]) => {
                result[iteratee(value, key, object)] = value;
            });
        }
        return result;
    },

    /**
     * Creates an object with the same keys as object and values generated by running each own enumerable property through iteratee.
     * @param {Object} object
     * @param {Function} iteratee
     * @returns {Object}
     */
    mapValues(object, iteratee) {
        const result = {};
        if (object) {
            Object.entries(object).forEach(([key, value]) => {
                result[key] = iteratee(value, key, object);
            });
        }
        return result;
    },

    /**
     * Recursively merges own and inherited enumerable properties of source objects into the destination object.
     * @param {Object} object
     * @param {...Object} sources
     * @returns {Object}
     */
    merge(object, ...sources) {
        const target = object || {};
        sources.forEach(source => {
            if (source && typeof source === 'object') {
                Object.keys(source).forEach(key => {
                    const targetVal = target[key];
                    const sourceVal = source[key];
                    if (
                        targetVal && typeof targetVal === 'object' &&
                        sourceVal && typeof sourceVal === 'object' &&
                        !Array.isArray(targetVal) && !Array.isArray(sourceVal)
                    ) {
                        this.merge(targetVal, sourceVal);
                    } else {
                        target[key] = sourceVal;
                    }
                });
            }
        });
        return target;
    },

    /**
     * Creates an object composed of the own enumerable properties of object that are not omitted.
     * @param {Object} object
     * @param {...(string|string[])} paths
     * @returns {Object}
     */
    omit(object, ...paths) {
        if (!object) return {};
        const omitKeys = new Set(paths.flat());
        const result = {};
        Object.keys(object).forEach(key => {
            if (!omitKeys.has(key)) {
                result[key] = object[key];
            }
        });
        return result;
    },

    /**
     * Creates an object composed of the properties predicate doesn't return truthy for.
     * @param {Object} object
     * @param {Function} predicate
     * @returns {Object}
     */
    omitBy(object, predicate) {
        if (!object) return {};
        const result = {};
        Object.entries(object).forEach(([key, value]) => {
            if (!predicate(value, key)) {
                result[key] = value;
            }
        });
        return result;
    },

    /**
     * Creates an object composed of the picked object properties.
     * @param {Object} object
     * @param {...(string|string[])} paths
     * @returns {Object}
     */
    pick(object, ...paths) {
        if (!object) return {};
        const pickKeys = new Set(paths.flat());
        const result = {};
        pickKeys.forEach(key => {
            if (key in object) {
                result[key] = object[key];
            }
        });
        return result;
    },

    /**
     * Creates an object composed of the properties predicate returns truthy for.
     * @param {Object} object
     * @param {Function} predicate
     * @returns {Object}
     */
    pickBy(object, predicate) {
        if (!object) return {};
        const result = {};
        Object.entries(object).forEach(([key, value]) => {
            if (predicate(value, key)) {
                result[key] = value;
            }
        });
        return result;
    },

    /**
     * Sets the value at path of object.
     * @param {Object} object
     * @param {string|Array} path
     * @param {*} value
     * @returns {Object}
     */
    set(object, path, value) {
        if (!object) return object;
        const keys = Array.isArray(path) ? path : path.replace(/\[(\d+)]/g, '.$1').split('.');
        let current = object;
        for (let i = 0; i < keys.length - 1; i++) {
            const key = keys[i];
            const nextKey = keys[i + 1];
            if (!(key in current) || current[key] === null || typeof current[key] !== 'object') {
                current[key] = /^\d+$/.test(nextKey) ? [] : {};
            }
            current = current[key];
        }
        current[keys[keys.length - 1]] = value;
        return object;
    },

    /**
     * Removes the property at path of object.
     * @param {Object} object
     * @param {string|Array} path
     * @returns {boolean}
     */
    unset(object, path) {
        if (!object) return true;
        const keys = Array.isArray(path) ? path : path.replace(/\[(\d+)]/g, '.$1').split('.');
        let current = object;
        for (let i = 0; i < keys.length - 1; i++) {
            const key = keys[i];
            if (!(key in current)) return true;
            current = current[key];
        }
        return delete current[keys[keys.length - 1]];
    },

    /**
     * Sets the value at path of object if the resolved value is undefined.
     * @param {Object} object
     * @param {string|Array} path
     * @param {*} value
     * @returns {Object}
     */
    setIfUndefined(object, path, value) {
        if (this.get(object, path) === undefined) {
            this.set(object, path, value);
        }
        return object;
    },

    /**
     * Creates an array of own enumerable string keyed property values of object.
     * @param {Object} object
     * @returns {Array}
     */
    values(object) {
        return object ? Object.values(object) : [];
    },

    /**
     * Creates an array of own and inherited enumerable property values.
     * @param {Object} object
     * @returns {Array}
     */
    valuesIn(object) {
        const result = [];
        for (const key in object) {
            result.push(object[key]);
        }
        return result;
    },

    // ============================================
    // Lang Utilities (Type Checking)
    // ============================================

    /**
     * Checks if value is an Array.
     * @param {*} value
     * @returns {boolean}
     */
    isArray(value) {
        return Array.isArray(value);
    },

    /**
     * Checks if value is a boolean primitive or object.
     * @param {*} value
     * @returns {boolean}
     */
    isBoolean(value) {
        return typeof value === 'boolean' || value instanceof Boolean;
    },

    /**
     * Checks if value is a Date object.
     * @param {*} value
     * @returns {boolean}
     */
    isDate(value) {
        return value instanceof Date;
    },

    /**
     * Checks if value is an empty object, collection, map, or set.
     * @param {*} value
     * @returns {boolean}
     */
    isEmpty(value) {
        if (value === null || value === undefined) return true;
        if (Array.isArray(value) || typeof value === 'string') return value.length === 0;
        if (value instanceof Map || value instanceof Set) return value.size === 0;
        if (typeof value === 'object') return Object.keys(value).length === 0;
        return true;
    },

    /**
     * Performs a deep comparison between two values.
     * @param {*} value
     * @param {*} other
     * @returns {boolean}
     */
    isEqual(value, other) {
        if (value === other) return true;
        if (value === null || other === null) return value === other;
        if (typeof value !== typeof other) return false;
        if (typeof value !== 'object') return false;

        if (Array.isArray(value) && Array.isArray(other)) {
            if (value.length !== other.length) return false;
            return value.every((item, i) => this.isEqual(item, other[i]));
        }

        if (Array.isArray(value) || Array.isArray(other)) return false;

        const valueKeys = Object.keys(value);
        const otherKeys = Object.keys(other);
        if (valueKeys.length !== otherKeys.length) return false;

        return valueKeys.every(key => this.isEqual(value[key], other[key]));
    },

    /**
     * Checks if value is a finite number.
     * @param {*} value
     * @returns {boolean}
     */
    isFinite(value) {
        return Number.isFinite(value);
    },

    /**
     * Checks if value is a Function object.
     * @param {*} value
     * @returns {boolean}
     */
    isFunction(value) {
        return typeof value === 'function';
    },

    /**
     * Checks if value is an integer.
     * @param {*} value
     * @returns {boolean}
     */
    isInteger(value) {
        return Number.isInteger(value);
    },

    /**
     * Checks if value is NaN.
     * @param {*} value
     * @returns {boolean}
     */
    isNaN(value) {
        return Number.isNaN(value);
    },

    /**
     * Checks if value is null or undefined.
     * @param {*} value
     * @returns {boolean}
     */
    isNil(value) {
        return value === null || value === undefined;
    },

    /**
     * Checks if value is null.
     * @param {*} value
     * @returns {boolean}
     */
    isNull(value) {
        return value === null;
    },

    /**
     * Checks if value is a number primitive or object.
     * @param {*} value
     * @returns {boolean}
     */
    isNumber(value) {
        return typeof value === 'number' || value instanceof Number;
    },

    /**
     * Checks if value is the language type of Object.
     * @param {*} value
     * @returns {boolean}
     */
    isObject(value) {
        return value !== null && typeof value === 'object';
    },

    /**
     * Checks if value is a plain object.
     * @param {*} value
     * @returns {boolean}
     */
    isPlainObject(value) {
        if (value === null || typeof value !== 'object') return false;
        const proto = Object.getPrototypeOf(value);
        return proto === null || proto === Object.prototype;
    },

    /**
     * Checks if value is a RegExp object.
     * @param {*} value
     * @returns {boolean}
     */
    isRegExp(value) {
        return value instanceof RegExp;
    },

    /**
     * Checks if value is a string primitive or object.
     * @param {*} value
     * @returns {boolean}
     */
    isString(value) {
        return typeof value === 'string' || value instanceof String;
    },

    /**
     * Checks if value is a Symbol primitive.
     * @param {*} value
     * @returns {boolean}
     */
    isSymbol(value) {
        return typeof value === 'symbol';
    },

    /**
     * Checks if value is undefined.
     * @param {*} value
     * @returns {boolean}
     */
    isUndefined(value) {
        return value === undefined;
    },

    // ============================================
    // Math Utilities
    // ============================================

    /**
     * Adds two numbers.
     * @param {number} augend
     * @param {number} addend
     * @returns {number}
     */
    add(augend, addend) {
        return augend + addend;
    },

    /**
     * Computes number rounded up to precision.
     * @param {number} number
     * @param {number} precision
     * @returns {number}
     */
    ceil(number, precision = 0) {
        const factor = Math.pow(10, precision);
        return Math.ceil(number * factor) / factor;
    },

    /**
     * Divide two numbers.
     * @param {number} dividend
     * @param {number} divisor
     * @returns {number}
     */
    divide(dividend, divisor) {
        return dividend / divisor;
    },

    /**
     * Computes number rounded down to precision.
     * @param {number} number
     * @param {number} precision
     * @returns {number}
     */
    floor(number, precision = 0) {
        const factor = Math.pow(10, precision);
        return Math.floor(number * factor) / factor;
    },

    /**
     * Computes the maximum value of array.
     * @param {Array} array
     * @returns {*}
     */
    max(array) {
        return array && array.length ? Math.max(...array) : undefined;
    },

    /**
     * Computes the maximum value of array with iteratee.
     * @param {Array} array
     * @param {Function} iteratee
     * @returns {*}
     */
    maxBy(array, iteratee) {
        if (!array || !array.length) return undefined;
        return array.reduce((max, item) => {
            const val = typeof iteratee === 'function' ? iteratee(item) : item[iteratee];
            const maxVal = typeof iteratee === 'function' ? iteratee(max) : max[iteratee];
            return val > maxVal ? item : max;
        });
    },

    /**
     * Computes the mean of the values in array.
     * @param {Array} array
     * @returns {number}
     */
    mean(array) {
        return array && array.length ? this.sum(array) / array.length : NaN;
    },

    /**
     * Computes the mean using iteratee.
     * @param {Array} array
     * @param {Function} iteratee
     * @returns {number}
     */
    meanBy(array, iteratee) {
        return array && array.length ? this.sumBy(array, iteratee) / array.length : NaN;
    },

    /**
     * Computes the minimum value of array.
     * @param {Array} array
     * @returns {*}
     */
    min(array) {
        return array && array.length ? Math.min(...array) : undefined;
    },

    /**
     * Computes the minimum value of array with iteratee.
     * @param {Array} array
     * @param {Function} iteratee
     * @returns {*}
     */
    minBy(array, iteratee) {
        if (!array || !array.length) return undefined;
        return array.reduce((min, item) => {
            const val = typeof iteratee === 'function' ? iteratee(item) : item[iteratee];
            const minVal = typeof iteratee === 'function' ? iteratee(min) : min[iteratee];
            return val < minVal ? item : min;
        });
    },

    /**
     * Multiply two numbers.
     * @param {number} multiplier
     * @param {number} multiplicand
     * @returns {number}
     */
    multiply(multiplier, multiplicand) {
        return multiplier * multiplicand;
    },

    /**
     * Computes number rounded to precision.
     * @param {number} number
     * @param {number} precision
     * @returns {number}
     */
    round(number, precision = 0) {
        const factor = Math.pow(10, precision);
        return Math.round(number * factor) / factor;
    },

    /**
     * Subtract two numbers.
     * @param {number} minuend
     * @param {number} subtrahend
     * @returns {number}
     */
    subtract(minuend, subtrahend) {
        return minuend - subtrahend;
    },

    /**
     * Computes the sum of the values in array.
     * @param {Array} array
     * @returns {number}
     */
    sum(array) {
        return array ? array.reduce((acc, val) => acc + val, 0) : 0;
    },

    /**
     * Computes the sum using iteratee.
     * @param {Array} array
     * @param {Function} iteratee
     * @returns {number}
     */
    sumBy(array, iteratee) {
        if (!array) return 0;
        return array.reduce((acc, item) => {
            const val = typeof iteratee === 'function' ? iteratee(item) : item[iteratee];
            return acc + val;
        }, 0);
    },

    // ============================================
    // Number Utilities
    // ============================================

    /**
     * Clamps number within the inclusive lower and upper bounds.
     * @param {number} number
     * @param {number} lower
     * @param {number} upper
     * @returns {number}
     */
    clamp(number, lower, upper) {
        if (upper === undefined) {
            upper = lower;
            lower = undefined;
        }
        if (lower !== undefined && number < lower) return lower;
        if (upper !== undefined && number > upper) return upper;
        return number;
    },

    /**
     * Checks if n is between start and up to but not including end.
     * @param {number} number
     * @param {number} start
     * @param {number} end
     * @returns {boolean}
     */
    inRange(number, start, end) {
        if (end === undefined) {
            end = start;
            start = 0;
        }
        if (start > end) {
            [start, end] = [end, start];
        }
        return number >= start && number < end;
    },

    /**
     * Produces a random number between the inclusive lower and upper bounds.
     * @param {number} lower
     * @param {number} upper
     * @param {boolean} floating
     * @returns {number}
     */
    random(lower = 0, upper = 1, floating) {
        if (typeof lower === 'boolean') {
            floating = lower;
            lower = 0;
            upper = 1;
        } else if (typeof upper === 'boolean') {
            floating = upper;
            upper = lower;
            lower = 0;
        }
        if (lower > upper) {
            [lower, upper] = [upper, lower];
        }
        if (floating || lower % 1 !== 0 || upper % 1 !== 0) {
            return lower + Math.random() * (upper - lower);
        }
        return lower + Math.floor(Math.random() * (upper - lower + 1));
    },

    // ============================================
    // String Utilities
    // ============================================

    /**
     * Converts string to camel case.
     * @param {string} string
     * @returns {string}
     */
    camelCase(string) {
        if (!string) return '';
        return string
            .replace(/[^a-zA-Z0-9]+(.)/g, (_, char) => char.toUpperCase())
            .replace(/^[A-Z]/, char => char.toLowerCase());
    },

    /**
     * Converts the first character of string to upper case and the remaining to lower case.
     * @param {string} string
     * @returns {string}
     */
    capitalize(string) {
        if (!string) return '';
        return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
    },

    /**
     * Checks if string ends with the given target string.
     * @param {string} string
     * @param {string} target
     * @param {number} position
     * @returns {boolean}
     */
    endsWith(string, target, position) {
        if (!string) return false;
        return position !== undefined
            ? string.slice(0, position).endsWith(target)
            : string.endsWith(target);
    },

    /**
     * Converts the characters "&", "<", ">", '"', and "'" to HTML entities.
     * @param {string} string
     * @returns {string}
     */
    escape(string) {
        if (!string) return '';
        const htmlEscapes = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#39;'
        };
        return string.replace(/[&<>"']/g, char => htmlEscapes[char]);
    },

    /**
     * Converts string to kebab case.
     * @param {string} string
     * @returns {string}
     */
    kebabCase(string) {
        if (!string) return '';
        return string
            .replace(/([a-z])([A-Z])/g, '$1-$2')
            .replace(/[\s_]+/g, '-')
            .toLowerCase();
    },

    /**
     * Converts string, as space separated words, to lower case.
     * @param {string} string
     * @returns {string}
     */
    lowerCase(string) {
        if (!string) return '';
        return string
            .replace(/([a-z])([A-Z])/g, '$1 $2')
            .replace(/[_-]+/g, ' ')
            .toLowerCase();
    },

    /**
     * Converts the first character of string to lower case.
     * @param {string} string
     * @returns {string}
     */
    lowerFirst(string) {
        if (!string) return '';
        return string.charAt(0).toLowerCase() + string.slice(1);
    },

    /**
     * Pads string on the left and right sides if it's shorter than length.
     * @param {string} string
     * @param {number} length
     * @param {string} chars
     * @returns {string}
     */
    pad(string = '', length = 0, chars = ' ') {
        const strLen = string.length;
        if (strLen >= length) return string;
        const padLen = length - strLen;
        const leftPad = Math.floor(padLen / 2);
        const rightPad = padLen - leftPad;
        return chars.repeat(Math.ceil(leftPad / chars.length)).slice(0, leftPad) +
            string +
            chars.repeat(Math.ceil(rightPad / chars.length)).slice(0, rightPad);
    },

    /**
     * Pads string on the right side if it's shorter than length.
     * @param {string} string
     * @param {number} length
     * @param {string} chars
     * @returns {string}
     */
    padEnd(string = '', length = 0, chars = ' ') {
        const strLen = string.length;
        if (strLen >= length) return string;
        const padLen = length - strLen;
        return string + chars.repeat(Math.ceil(padLen / chars.length)).slice(0, padLen);
    },

    /**
     * Pads string on the left side if it's shorter than length.
     * @param {string} string
     * @param {number} length
     * @param {string} chars
     * @returns {string}
     */
    padStart(string = '', length = 0, chars = ' ') {
        const strLen = string.length;
        if (strLen >= length) return string;
        const padLen = length - strLen;
        return chars.repeat(Math.ceil(padLen / chars.length)).slice(0, padLen) + string;
    },

    /**
     * Repeats the given string n times.
     * @param {string} string
     * @param {number} n
     * @returns {string}
     */
    repeat(string = '', n = 1) {
        return string.repeat(Math.max(0, Math.floor(n)));
    },

    /**
     * Replaces matches for pattern in string with replacement.
     * @param {string} string
     * @param {string|RegExp} pattern
     * @param {string} replacement
     * @returns {string}
     */
    replace(string = '', pattern, replacement) {
        return string.replace(pattern, replacement);
    },

    /**
     * Converts string to snake case.
     * @param {string} string
     * @returns {string}
     */
    snakeCase(string) {
        if (!string) return '';
        return string
            .replace(/([a-z])([A-Z])/g, '$1_$2')
            .replace(/[\s-]+/g, '_')
            .toLowerCase();
    },

    /**
     * Splits string by separator.
     * @param {string} string
     * @param {string|RegExp} separator
     * @param {number} limit
     * @returns {Array}
     */
    split(string = '', separator, limit) {
        return string.split(separator, limit);
    },

    /**
     * Converts string to start case.
     * @param {string} string
     * @returns {string}
     */
    startCase(string) {
        if (!string) return '';
        return string
            .replace(/([a-z])([A-Z])/g, '$1 $2')
            .replace(/[_-]+/g, ' ')
            .replace(/\b\w/g, char => char.toUpperCase());
    },

    /**
     * Checks if string starts with the given target string.
     * @param {string} string
     * @param {string} target
     * @param {number} position
     * @returns {boolean}
     */
    startsWith(string, target, position = 0) {
        if (!string) return false;
        return string.startsWith(target, position);
    },

    /**
     * Converts string to lowercase.
     * @param {string} string
     * @returns {string}
     */
    toLower(string) {
        return string ? string.toLowerCase() : '';
    },

    /**
     * Converts string to uppercase.
     * @param {string} string
     * @returns {string}
     */
    toUpper(string) {
        return string ? string.toUpperCase() : '';
    },

    /**
     * Removes leading and trailing whitespace or specified characters from string.
     * @param {string} string
     * @param {string} chars
     * @returns {string}
     */
    trim(string = '', chars) {
        if (!chars) return string.trim();
        const escaped = chars.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        return string.replace(new RegExp(`^[${escaped}]+|[${escaped}]+$`, 'g'), '');
    },

    /**
     * Removes trailing whitespace or specified characters from string.
     * @param {string} string
     * @param {string} chars
     * @returns {string}
     */
    trimEnd(string = '', chars) {
        if (!chars) return string.trimEnd();
        const escaped = chars.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        return string.replace(new RegExp(`[${escaped}]+$`, 'g'), '');
    },

    /**
     * Removes leading whitespace or specified characters from string.
     * @param {string} string
     * @param {string} chars
     * @returns {string}
     */
    trimStart(string = '', chars) {
        if (!chars) return string.trimStart();
        const escaped = chars.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        return string.replace(new RegExp(`^[${escaped}]+`, 'g'), '');
    },

    /**
     * Truncates string if it's longer than the given maximum string length.
     * @param {string} string
     * @param {Object} options
     * @returns {string}
     */
    truncate(string = '', options = {}) {
        const length = options.length || 30;
        const omission = options.omission || '...';
        const separator = options.separator;

        if (string.length <= length) return string;

        let end = length - omission.length;
        if (end < 1) return omission;

        let result = string.slice(0, end);

        if (separator) {
            const sepIndex = typeof separator === 'string'
                ? result.lastIndexOf(separator)
                : result.search(new RegExp(separator.source + '(?!.*' + separator.source + ')'));
            if (sepIndex > -1) {
                result = result.slice(0, sepIndex);
            }
        }

        return result + omission;
    },

    /**
     * The inverse of escape; converts HTML entities to their corresponding characters.
     * @param {string} string
     * @returns {string}
     */
    unescape(string) {
        if (!string) return '';
        const htmlUnescapes = {
            '&amp;': '&',
            '&lt;': '<',
            '&gt;': '>',
            '&quot;': '"',
            '&#39;': "'"
        };
        return string.replace(/&(?:amp|lt|gt|quot|#39);/g, entity => htmlUnescapes[entity]);
    },

    /**
     * Converts string, as space separated words, to upper case.
     * @param {string} string
     * @returns {string}
     */
    upperCase(string) {
        if (!string) return '';
        return string
            .replace(/([a-z])([A-Z])/g, '$1 $2')
            .replace(/[_-]+/g, ' ')
            .toUpperCase();
    },

    /**
     * Converts the first character of string to upper case.
     * @param {string} string
     * @returns {string}
     */
    upperFirst(string) {
        if (!string) return '';
        return string.charAt(0).toUpperCase() + string.slice(1);
    },

    /**
     * Splits string into an array of its words.
     * @param {string} string
     * @param {string|RegExp} pattern
     * @returns {Array}
     */
    words(string = '', pattern) {
        if (pattern) {
            return string.match(pattern) || [];
        }
        return string.match(/[a-zA-Z0-9]+/g) || [];
    },

    /**
     * Returns a formatted string using printf-style format specifiers.
     * Supports: %s (string), %d/%i (integer), %f (float), %o (object), %j (JSON), %% (literal %)
     * Also supports width, precision, and flags: %10s, %-10s, %010d, %.2f, %10.2f
     * @param {string} format - The format string
     * @param {...*} args - Values to substitute
     * @returns {string}
     */
    sprintf(format, ...args) {
        if (!format) return '';

        let argIndex = 0;

        return format.replace(
            /%(?:(\d+)\$)?([+-])?(\d+)?(?:\.(\d+))?([sdifojx%])/g,
            (match, position, flags, width, precision, specifier) => {
                // Handle %% escape
                if (specifier === '%') return '%';

                // Get the argument (positional or sequential)
                const index = position ? parseInt(position, 10) - 1 : argIndex++;
                const arg = args[index];

                // Handle undefined/null
                if (arg === undefined) return match;
                if (arg === null) return 'null';

                let result;

                switch (specifier) {
                    case 's': // String
                        result = String(arg);
                        break;
                    case 'd': // Integer (decimal)
                    case 'i': // Integer
                        result = String(parseInt(arg, 10));
                        break;
                    case 'f': // Float
                        const num = parseFloat(arg);
                        result = precision !== undefined
                            ? num.toFixed(parseInt(precision, 10))
                            : String(num);
                        break;
                    case 'o': // Object (simple representation)
                        result = Object.prototype.toString.call(arg);
                        break;
                    case 'j': // JSON
                        try {
                            result = JSON.stringify(arg);
                        } catch (e) {
                            result = '[Circular]';
                        }
                        break;
                    case 'x': // Hexadecimal
                        result = parseInt(arg, 10).toString(16);
                        break;
                    default:
                        result = String(arg);
                }

                // Apply width padding
                if (width) {
                    const w = parseInt(width, 10);
                    const padChar = flags === '0' ? '0' : ' ';
                    if (flags === '-') {
                        // Left-align
                        result = result.padEnd(w, ' ');
                    } else {
                        // Right-align (default)
                        result = result.padStart(w, padChar);
                    }
                }

                // Apply + flag for positive numbers
                if (flags === '+' && (specifier === 'd' || specifier === 'i' || specifier === 'f')) {
                    const numVal = parseFloat(result);
                    if (numVal >= 0 && !result.startsWith('+')) {
                        result = '+' + result;
                    }
                }

                return result;
            }
        );
    },

    /**
     * Alias for sprintf - returns formatted string.
     * @param {string} format - The format string
     * @param {...*} args - Values to substitute
     * @returns {string}
     */
    format(format, ...args) {
        return this.sprintf(format, ...args);
    }
};
