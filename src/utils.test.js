// src/utils.test.js
import {describe, expect, it, vi} from 'vitest';
import Domma from './index.js'; // Assuming index.js exports Domma object

describe('Domma.utils - General Utilities', () => {
  it('utils.merge() should merge objects', () => {
    const a = {x: 1};
    const b = {y: 2};
    const c = Domma.utils.merge({}, a, b);
    expect(c.x).toBe(1);
    expect(c.y).toBe(2);
  });
});

describe('Domma.utils - Array Utilities', () => {
  it('utils.chunk() should create chunks', () => {
    const result = Domma.utils.chunk([1, 2, 3, 4, 5], 2);
    expect(result.length).toBe(3);
    expect(result[0].length).toBe(2);
    expect(result).toEqual([[1, 2], [3, 4], [5]]);
  });

  it('utils.compact() should remove falsy values', () => {
    const result = Domma.utils.compact([0, 1, false, 2, '', 3, null, undefined]);
    expect(result.length).toBe(3);
    expect(result).toEqual([1, 2, 3]);
  });

  it('utils.difference() should return difference', () => {
    const result = Domma.utils.difference([1, 2, 3], [2, 3, 4]);
    expect(result.length).toBe(1);
    expect(result[0]).toBe(1);
    expect(result).toEqual([1]);
  });

  it('utils.differenceBy() should return difference by iteratee', () => {
    const result = Domma.utils.differenceBy([2.1, 1.2], [2.3, 3.4], Math.floor);
    expect(result.length).toBe(1);
    expect(result[0]).toBe(1.2);
  });

  it('utils.differenceWith() should return difference with comparator', () => {
    const objects = [{'x': 1, 'y': 2}, {'x': 2, 'y': 1}];
    const result = Domma.utils.differenceWith(objects, [{'x': 1, 'y': 2}], (a, b) => Domma.utils.isEqual(a, b));
    expect(result.length).toBe(1);
    expect(result[0].x).toBe(2);
  });

  it('utils.dropRightWhile() should drop elements from the right while predicate is truthy', () => {
    const users = [
      {'user': 'barney', 'active': true},
      {'user': 'fred', 'active': false},
      {'user': 'pebbles', 'active': false}
    ];
    const result = Domma.utils.dropRightWhile(users, o => !o.active);
    expect(result.length).toBe(1);
    expect(result[0].user).toBe('barney');
  });

  it('utils.dropWhile() should drop elements from the left while predicate is truthy', () => {
    const users = [
      {'user': 'barney', 'active': false},
      {'user': 'fred', 'active': false},
      {'user': 'pebbles', 'active': true}
    ];
    const result = Domma.utils.dropWhile(users, o => !o.active);
    expect(result.length).toBe(1);
    expect(result[0].user).toBe('pebbles');
  });

  it('utils.eq() should return true for same value', () => {
    const object = {'a': 1};
    expect(Domma.utils.eq(object, object)).toBe(true);
    expect(Domma.utils.eq(object, {'a': 1})).toBe(false);
    expect(Domma.utils.eq(NaN, NaN)).toBe(true);
  });

  it('utils.flatten() should flatten one level', () => {
    const result = Domma.utils.flatten([1, [2, [3, [4]]]]);
    expect(result.length).toBe(3);
    expect(result).toEqual([1, 2, [3, [4]]]);
  });

  it('utils.flattenDeep() should flatten all levels', () => {
    const result = Domma.utils.flattenDeep([1, [2, [3, [4]]]]);
    expect(result.length).toBe(4);
    expect(result).toEqual([1, 2, 3, 4]);
  });

  it('utils.uniq() should remove duplicates', () => {
    const result = Domma.utils.uniq([1, 2, 2, 3, 3, 3]);
    expect(result.length).toBe(3);
    expect(result).toEqual([1, 2, 3]);
  });

  it('utils.intersection() should return common elements', () => {
    const result = Domma.utils.intersection([1, 2, 3], [2, 3, 4]);
    expect(result.length).toBe(2);
    expect(result).toEqual([2, 3]);
  });

  it('utils.concat() should concatenate values and arrays', () => {
    const array = [1];
    const result = Domma.utils.concat(array, 2, [3], [[4]]);
    expect(result.length).toBe(4);
    expect(result).toEqual([1, 2, 3, [4]]);
  });

  it('utils.drop() should drop the first element(s)', () => {
    const result = Domma.utils.drop([1, 2, 3]);
    expect(result.length).toBe(2);
    expect(result).toEqual([2, 3]);
    const result2 = Domma.utils.drop([1, 2, 3], 2);
    expect(result2.length).toBe(1);
    expect(result2).toEqual([3]);
  });

  it('utils.dropRight() should drop the last element(s)', () => {
    const result = Domma.utils.dropRight([1, 2, 3]);
    expect(result.length).toBe(2);
    expect(result).toEqual([1, 2]);
    const result2 = Domma.utils.dropRight([1, 2, 3], 2);
    expect(result2.length).toBe(1);
    expect(result2).toEqual([1]);
  });

  it('utils.fill() should fill an array or slice', () => {
    const array = [1, 2, 3];
    Domma.utils.fill(array, 'a');
    expect(array).toEqual(['a', 'a', 'a']);
    const array2 = [1, 2, 3];
    Domma.utils.fill(array2, '*', 1, 2);
    expect(array2).toEqual([1, '*', 3]);
  });

  it('utils.findIndex() should find the index of the first element predicate returns truthy for', () => {
    const users = [
      {'user': 'barney', 'active': false},
      {'user': 'fred', 'active': false},
      {'user': 'pebbles', 'active': true}
    ];
    const result = Domma.utils.findIndex(users, o => o.user === 'fred');
    expect(result).toBe(1);
  });

  it('utils.findLastIndex() should find the index of the last element predicate returns truthy for', () => {
    const users = [
      {'user': 'barney', 'active': true},
      {'user': 'fred', 'active': false},
      {'user': 'pebbles', 'active': false}
    ];
    const result = Domma.utils.findLastIndex(users, o => o.user === 'barney');
    expect(result).toBe(0);
  });

  it('utils.first() and utils.head() should return the first element', () => {
    const array = [1, 2, 3];
    expect(Domma.utils.first(array)).toBe(1);
    expect(Domma.utils.head(array)).toBe(1); // Alias
  });

  it('utils.flattenDepth() should flatten to a specified depth', () => {
    const array = [1, [2, [3, [4]], 5]];
    const result = Domma.utils.flattenDepth(array, 2);
    expect(result.length).toBe(5);
    expect(result).toEqual([1, 2, 3, [4], 5]);
  });

  it('utils.fromPairs() should create an object from key-value pairs', () => {
    const result = Domma.utils.fromPairs([['a', 1], ['b', 2]]);
    expect(result).toEqual({a: 1, b: 2});
  });

  it('utils.indexOf() should return the index of the value', () => {
    const array = [1, 2, 1, 2];
    expect(Domma.utils.indexOf(array, 2)).toBe(1);
    expect(Domma.utils.indexOf(array, 2, 2)).toBe(3);
  });

  it('utils.initial() should return all but the last element', () => {
    const result = Domma.utils.initial([1, 2, 3]);
    expect(result.length).toBe(2);
    expect(result).toEqual([1, 2]);
  });

  it('utils.join() should join array elements with a separator', () => {
    const result = Domma.utils.join(['a', 'b', 'c'], '~');
    expect(result).toBe('a~b~c');
  });

  it('utils.last() should return the last element of the array', () => {
    const result = Domma.utils.last([1, 2, 3]);
    expect(result).toBe(3);
  });

  it('utils.lastIndexOf() should return the last index of the value', () => {
    const array = [1, 2, 1, 2];
    expect(Domma.utils.lastIndexOf(array, 1)).toBe(2);
    expect(Domma.utils.lastIndexOf(array, 1, 1)).toBe(0);
  });

  it('utils.nth() should return the element at the specified index', () => {
    const array = ['a', 'b', 'c', 'd'];
    expect(Domma.utils.nth(array, 1)).toBe('b');
    expect(Domma.utils.nth(array, -2)).toBe('c');
  });

  it('utils.pull() should remove all given values from array', () => {
    const array = ['a', 'b', 'c', 'a', 'b', 'c'];
    Domma.utils.pull(array, 'a', 'c');
    expect(array.length).toBe(2);
    expect(array).toEqual(['b', 'b']);
  });

  it('utils.pullAt() should remove elements at specified indexes', () => {
    const array = ['a', 'b', 'c', 'd'];
    const pulled = Domma.utils.pullAt(array, [1, 3]);
    expect(array.length).toBe(2);
    expect(array).toEqual(['a', 'c']);
    expect(pulled.length).toBe(2);
    expect(pulled).toEqual(['b', 'd']);
  });

  it('utils.reverse() should reverse the array in place', () => {
    const array = [1, 2, 3];
    const reversed = Domma.utils.reverse(array);
    expect(reversed).toEqual([3, 2, 1]);
    expect(array).toBe(reversed); // Should mutate original array
  });

  it('utils.slice() should return a slice of the array', () => {
    const array = [1, 2, 3, 4];
    const sliced = Domma.utils.slice(array, 1, 3);
    expect(sliced.length).toBe(2);
    expect(sliced).toEqual([2, 3]);
  });

  it('utils.tail() should return all but the first element', () => {
    const result = Domma.utils.tail([1, 2, 3]);
    expect(result.length).toBe(2);
    expect(result).toEqual([2, 3]);
  });

  it('utils.take() should take the first n elements', () => {
    const result = Domma.utils.take([1, 2, 3], 2);
    expect(result.length).toBe(2);
    expect(result).toEqual([1, 2]);
  });

  it('utils.takeRight() should take the last n elements', () => {
    const result = Domma.utils.takeRight([1, 2, 3], 2);
    expect(result.length).toBe(2);
    expect(result).toEqual([2, 3]);
  });

  it('utils.union() should create an array of unique values', () => {
    const result = Domma.utils.union([2], [1, 2]);
    expect(result.length).toBe(2);
    expect(result).toEqual([2, 1]); // Order might vary based on implementation, but values must be present
  });

  it('utils.uniqBy() should create a duplicate-free version of an array using an iteratee', () => {
    const result = Domma.utils.uniqBy([2.1, 1.2, 2.3], Math.floor);
    expect(result.length).toBe(2);
    expect(result).toEqual([2.1, 1.2]); // Keeping the first occurrence
  });

  it('utils.without() should create an array excluding all given values', () => {
    const result = Domma.utils.without([2, 1, 2, 3], 1, 2);
    expect(result.length).toBe(1);
    expect(result).toEqual([3]);
  });

  it('utils.xor() should create an array of unique values that is the symmetric difference', () => {
    const result = Domma.utils.xor([2, 1], [2, 3]);
    expect(result.length).toBe(2);
    expect(result).toContain(1);
    expect(result).toContain(3);
    expect(result).not.toContain(2);
  });

  it('utils.zip() should create an array of grouped elements', () => {
    const result = Domma.utils.zip(['a', 'b'], [1, 2], [true, false]);
    expect(result.length).toBe(2);
    expect(result).toEqual([['a', 1, true], ['b', 2, false]]);
  });

  it('utils.zipObject() should create an object from arrays of keys and values', () => {
    const result = Domma.utils.zipObject(['a', 'b'], [1, 2]);
    expect(result).toEqual({a: 1, b: 2});
  });

  it('utils.times() should invoke the iteratee n times', () => {
    const result = Domma.utils.times(3, String);
    expect(result.length).toBe(3);
    expect(result).toEqual(['0', '1', '2']);
  });

  it('utils.range() should create an array of numbers', () => {
    const result = Domma.utils.range(4);
    expect(result.length).toBe(4);
    expect(result).toEqual([0, 1, 2, 3]);
    const result2 = Domma.utils.range(-4);
    expect(result2.length).toBe(4);
    expect(result2).toEqual([0, -1, -2, -3]);
  });

  it('utils.uniqueId() should generate unique IDs', () => {
    const id1 = Domma.utils.uniqueId();
    const id2 = Domma.utils.uniqueId();
    expect(id1).not.toBe(id2);
    const id3 = Domma.utils.uniqueId('contact_');
    expect(id3.startsWith('contact_')).toBe(true);
  });
});

describe('Domma.utils - Collection Utilities', () => {
  it('utils.countBy() should count the occurrences of each element', () => {
    const result = Domma.utils.countBy([6.1, 4.2, 6.3], Math.floor);
    expect(result[4]).toBe(1);
    expect(result[6]).toBe(2);
  });

  it('utils.each() and utils.forEach() should iterate over each element', () => {
    let sum = 0;
    Domma.utils.each([1, 2, 3], n => sum += n);
    expect(sum).toBe(6);

    sum = 0;
    Domma.utils.forEach([1, 2, 3], n => sum += n);
    expect(sum).toBe(6);
  });

  it('utils.eachRight() and utils.forEachRight() should iterate over each element in reverse', () => {
    let result = '';
    Domma.utils.eachRight([1, 2, 3], n => result += n);
    expect(result).toBe('321');

    result = '';
    Domma.utils.forEachRight([1, 2, 3], n => result += n);
    expect(result).toBe('321');
  });

  it('utils.every() should check if all elements pass the predicate', () => {
    expect(Domma.utils.every([true, 1, null, 'yes'], Boolean)).toBe(false);
    expect(Domma.utils.every([true, 1, 'yes'], Boolean)).toBe(true);
  });

  it('utils.findLast() should return the last element predicate returns truthy for', () => {
    const users = [
      {user: 'barney', active: true},
      {user: 'fred', active: false},
      {user: 'pebbles', active: false}
    ];
    const result = Domma.utils.findLast(users, o => o.active === false);
    expect(result.user).toBe('pebbles');
  });

  it('utils.flatMap() should create a flattened array of values by running each element through iteratee', () => {
    function duplicate(n) {
      return [n, n];
    }

    const result = Domma.utils.flatMap([1, 2], duplicate);
    expect(result.length).toBe(4);
    expect(result).toEqual([1, 1, 2, 2]);
  });

  it('utils.flatMapDeep() should recursively flatten the mapped results', () => {
    function duplicate(n) {
      return [[[n, n]]];
    }

    const result = Domma.utils.flatMapDeep([1, 2], duplicate);
    expect(result.length).toBe(4);
    expect(result).toEqual([1, 1, 2, 2]);
  });

  it('utils.includes() should check if the value is in the collection', () => {
    expect(Domma.utils.includes([1, 2, 3], 1)).toBe(true);
    expect(Domma.utils.includes([1, 2, 3], 1, 2)).toBe(false);
    expect(Domma.utils.includes({'a': 1, 'b': 2}, 1)).toBe(true);
  });

  it('utils.keyBy() should create an object with keys generated from the iteratee', () => {
    const array = [
      {'dir': 'left', 'code': 97},
      {'dir': 'right', 'code': 100}
    ];
    const result = Domma.utils.keyBy(array, o => String.fromCharCode(o.code));
    expect(result.a.dir).toBe('left');
    expect(result.d.dir).toBe('right');
  });

  it('utils.orderBy() should sort the array of objects by specified criteria', () => {
    const users = [
      {'user': 'fred', 'age': 48},
      {'user': 'barney', 'age': 34},
      {'user': 'fred', 'age': 40},
      {'user': 'barney', 'age': 36}
    ];
    const result = Domma.utils.orderBy(users, ['user', 'age'], ['asc', 'desc']);
    expect(result[0].user).toBe('barney');
    expect(result[0].age).toBe(36);
    expect(result[1].user).toBe('barney');
    expect(result[1].age).toBe(34);
    expect(result[2].user).toBe('fred');
    expect(result[2].age).toBe(48);
    expect(result[3].user).toBe('fred');
    expect(result[3].age).toBe(40);
  });

  it('utils.partition() should create an array of elements split into two groups', () => {
    const users = [
      {'user': 'barney', 'age': 36, 'active': false},
      {'user': 'fred', 'age': 40, 'active': true},
      {'user': 'pebbles', 'age': 1, 'active': false}
    ];
    const result = Domma.utils.partition(users, o => o.active);
    expect(result[0].length).toBe(1);
    expect(result[0][0].user).toBe('fred');
    expect(result[1].length).toBe(2);
    expect(result[1][0].user).toBe('barney');
  });

  it('utils.reduceRight() should reduce a collection from right to left', () => {
    const array = [[0, 1], [2, 3], [4, 5]];
    const result = Domma.utils.reduceRight(array, (flattened, other) => flattened.concat(other), []);
    expect(result.length).toBe(6);
    expect(result).toEqual([4, 5, 2, 3, 0, 1]);
  });

  it('utils.reject() should return elements predicate does not return truthy for', () => {
    const users = [
      {'user': 'barney', 'age': 36, 'active': false},
      {'user': 'fred', 'age': 40, 'active': true}
    ];
    const result = Domma.utils.reject(users, o => !o.active);
    expect(result.length).toBe(1);
    expect(result[0].user).toBe('fred');
  });

  it('utils.sample() should return a random element from the collection', () => {
    const array = [1, 2, 3, 4, 5];
    const result = Domma.utils.sample(array);
    expect(array).toContain(result);
  });

  it('utils.sampleSize() should return a random sample of n elements from the collection', () => {
    const array = [1, 2, 3, 4, 5];
    const result = Domma.utils.sampleSize(array, 3);
    expect(result.length).toBe(3);
    expect(array).toContain(result[0]); // Check if elements are from original array
  });

  it('utils.shuffle() should return a shuffled array', () => {
    const array = [1, 2, 3, 4, 5];
    const result = Domma.utils.shuffle(array);
    expect(result.length).toBe(5);
    expect(result).not.toEqual(array); // Very high probability it's shuffled
    expect(result.sort()).toEqual(array.sort()); // But contains same elements
  });

  it('utils.size() should return the size of the collection', () => {
    expect(Domma.utils.size([1, 2, 3])).toBe(3);
    expect(Domma.utils.size({'a': 1, 'b': 2})).toBe(2);
    expect(Domma.utils.size('pebbles')).toBe(7);
  });

  it('utils.some() should check if any element passes the predicate', () => {
    expect(Domma.utils.some([null, 0, 'yes', false], Boolean)).toBe(true);
    expect(Domma.utils.some([null, 0, false], Boolean)).toBe(false);
  });

  it('utils.filter() should filter elements', () => {
    const result = Domma.utils.filter([1, 2, 3, 4], n => n > 2);
    expect(result.length).toBe(2);
    expect(result).toEqual([3, 4]);
  });

  it('utils.find() should find first matching element', () => {
    const result = Domma.utils.find([1, 2, 3], n => n > 1);
    expect(result).toBe(2);
  });

  it('utils.groupBy() should group by key', () => {
    const result = Domma.utils.groupBy([1.2, 2.1, 2.3], Math.floor);
    expect(result[1].length).toBe(1);
    expect(result[2].length).toBe(2);
  });

  it('utils.map() should map elements', () => {
    const result = Domma.utils.map([1, 2, 3], n => n * 2);
    expect(result).toEqual([2, 4, 6]);
  });

  it('utils.reduce() should reduce to sum', () => {
    const result = Domma.utils.reduce([1, 2, 3], (sum, n) => sum + n, 0);
    expect(result).toBe(6);
  });

  it('utils.sortBy() should sort by property', () => {
    const result = Domma.utils.sortBy([{n: 3}, {n: 1}, {n: 2}], 'n');
    expect(result[0].n).toBe(1);
    expect(result[2].n).toBe(3);
  });
});

describe('Domma.utils - Function Utilities', () => {
  it('utils.after() should be called after n invocations', async () => {
    const saves = ['profile', 'settings'];
    let callCount = 0;
    const done = Domma.utils.after(saves.length, () => {
      callCount++;
    });

    done();
    expect(callCount).toBe(0); // Not yet called twice

    done();
    expect(callCount).toBe(1); // Called after second invocation
  });

  it('utils.ary() should invoke func with up to n arguments', () => {
    const takesTwo = (a, b) => [a, b];
    const takesOne = Domma.utils.ary(takesTwo, 1);
    const result = takesOne(1, 2);
    expect(result).toEqual([1, undefined]);
  });

  it('utils.before() should invoke func while called less than n times', () => {
    let count = 0;
    const fn = Domma.utils.before(3, () => ++count);
    fn();
    fn();
    fn(); // This third call should not increment count
    expect(count).toBe(2);
  });

  it('utils.bind() should create a function with bound this and partials', () => {
    const greet = function (greeting, punctuation) {
      return greeting + ' ' + this.user + punctuation;
    };
    const object = {'user': 'fred'};
    const bound = Domma.utils.bind(greet, object, 'hi');
    expect(bound('!')).toBe('hi fred!');
  });

  it('utils.curry() should create a curried function', () => {
    const abc = function (a, b, c) {
      return [a, b, c];
    };
    const curried = Domma.utils.curry(abc);
    const result = curried(1)(2)(3);
    expect(result).toEqual([1, 2, 3]);
  });

  it('utils.curryRight() should create a right-curried function', () => {
    const abc = function (a, b, c) {
      return [a, b, c];
    };
    const curried = Domma.utils.curryRight(abc);
    const result = curried(3)(2)(1);
    expect(result).toEqual([1, 2, 3]);
  });

  it('utils.defer() should defer the execution of the function', async () => {
    vi.useFakeTimers();
    let deferred = false;
    Domma.utils.defer((a) => {
      deferred = a;
    }, true);
    expect(deferred).toBe(false); // Should not execute immediately
    await vi.runAllTimersAsync(); // Run all pending timers and microtasks
    expect(deferred).toBe(true);
    vi.useRealTimers();
  });

  it('utils.delay() should delay the execution of the function', async () => {
    vi.useFakeTimers();
    let delayed = false;
    Domma.utils.delay((a) => {
      delayed = a;
    }, 10, true);
    expect(delayed).toBe(false); // Should not execute immediately
    await vi.advanceTimersByTimeAsync(10);
    expect(delayed).toBe(true);
    vi.useRealTimers();
  });

  it('utils.flip() should create a function that invokes func with arguments reversed', () => {
    const flipped = Domma.utils.flip(function () {
      return Array.from(arguments);
    });
    const result = flipped('a', 'b', 'c', 'd');
    expect(result).toEqual(['d', 'c', 'b', 'a']);
  });

  it('utils.flow() should create a function that returns the result of invoking functions from left to right', () => {
    const add = (a, b) => a + b;
    const square = n => n * n;
    const addAndSquare = Domma.utils.flow(add, square);
    const result = addAndSquare(1, 2);
    expect(result).toBe(9);
  });

  it('utils.compose() should create a function that returns the result of invoking functions from right to left', () => {
    const add5 = n => n + 5;
    const square = n => n * n;
    const squareAndAdd5 = Domma.utils.compose(add5, square);
    const result = squareAndAdd5(2); // square(2) = 4, add5(4) = 9
    expect(result).toBe(9);
  });

  it('utils.negate() should create a function that negates the result of the predicate', () => {
    const isEven = n => n % 2 == 0;
    const isOdd = Domma.utils.negate(isEven);
    expect(isOdd(1)).toBe(true);
    expect(isOdd(2)).toBe(false);
  });

  it('utils.partial() should create a function that invokes func with partials prepended', () => {
    const greet = (greeting, name) => greeting + ' ' + name;
    const sayHelloTo = Domma.utils.partial(greet, 'hello');
    const result = sayHelloTo('fred');
    expect(result).toBe('hello fred');
  });

  it('utils.partialRight() should create a function that invokes func with partials appended', () => {
    const greet = (greeting, name) => greeting + ' ' + name;
    const greetFred = Domma.utils.partialRight(greet, 'fred');
    const result = greetFred('hi');
    expect(result).toBe('hi fred');
  });

  it('utils.throttle() should immediately invoke the function and then throttle calls', async () => {
    vi.useFakeTimers();
    let callCount = 0;
    const throttled = Domma.utils.throttle(() => {
      callCount++;
    }, 32);

    // First call: should execute immediately
    throttled();
    expect(callCount).toBe(1);

    // Second call: should be throttled
    throttled();
    expect(callCount).toBe(1);

    // Advance time just before throttle window ends
    await vi.advanceTimersByTimeAsync(31);
    expect(callCount).toBe(1); // Still should be 1, as 32ms hasn't passed

    // Advance time past throttle window. The throttled function should now execute.
    await vi.advanceTimersByTimeAsync(1); // Total 32ms passed
    expect(callCount).toBe(2); // Should execute the trailing call

    // Another call after the window should execute immediately
    throttled();
    expect(callCount).toBe(3);

    vi.useRealTimers();
  });

  it('utils.unary() should create a function that accepts up to one argument', () => {
    const takesTwo = (a, b) => [a, b];
    const takesOne = Domma.utils.unary(takesTwo);
    const result = takesOne(1, 2);
    expect(result).toEqual([1, undefined]);
  });

  it('utils.wrap() should create a function that provides value to wrapper as its first argument', () => {
    const p = Domma.utils.wrap(Domma.utils.escape, function (func, text) {
      return '<p>' + func(text) + '</p>';
    });
    const result = p('fred, barney, & pebbles');
    expect(result).toBe('<p>fred, barney, &amp; pebbles</p>');
  });

  it('utils.debounce() should return a function with cancel method', () => {
    let count = 0;
    const fn = Domma.utils.debounce(() => count++, 10);
    expect(typeof fn).toBe('function');
    expect(typeof fn.cancel).toBe('function');
  });

  it('utils.memoize() should cache results', () => {
    let calls = 0;
    const fn = Domma.utils.memoize(n => {
      calls++;
      return n * 2;
    });
    fn(5);
    fn(5);
    expect(calls).toBe(1);
    expect(fn(5)).toBe(10);
  });

  it('utils.once() should only execute once', () => {
    let count = 0;
    const fn = Domma.utils.once(() => ++count);
    fn();
    fn();
    fn();
    expect(count).toBe(1);
  });
});

describe('Domma.utils - Object Utilities', () => {
  it('utils.assign() should assign own enumerable string keyed properties', () => {
    function Foo() {
      this.a = 1;
    }

    function Bar() {
      this.c = 3;
    }

    Foo.prototype.b = 2;
    Bar.prototype.d = 4;
    const result = Domma.utils.assign({'a': 0}, new Foo(), new Bar());
    expect(result.a).toBe(1);
    expect(result.c).toBe(3);
    expect(result.b).toBeUndefined(); // Should not assign prototype properties
  });

  it('utils.assignIn() and utils.extend() should assign own and inherited enumerable properties', () => {
    function Foo() {
      this.a = 1;
    }

    function Bar() {
      this.c = 3;
    }

    Foo.prototype.b = 2;
    Bar.prototype.d = 4;
    const result = Domma.utils.assignIn({'a': 0}, new Foo(), new Bar());
    expect(result.a).toBe(1);
    expect(result.b).toBe(2);
    expect(result.c).toBe(3);
    expect(result.d).toBe(4);
    const result2 = Domma.utils.extend({'a': 0}, new Foo(), new Bar()); // Alias
    expect(result2.a).toBe(1);
    expect(result2.b).toBe(2);
    expect(result2.c).toBe(3);
    expect(result2.d).toBe(4);
  });

  it('utils.at() should create an array of values corresponding to paths', () => {
    const object = {'a': [{'b': {'c': 3}}, 4]};
    const result = Domma.utils.at(object, ['a[0].b.c', 'a[1]']);
    expect(result.length).toBe(2);
    expect(result).toEqual([3, 4]);
  });

  it('utils.clone() should create a shallow clone', () => {
    const objects = [{'a': 1}, {'b': 2}];
    const shallow = Domma.utils.clone(objects);
    expect(shallow).not.toBe(objects); // Different array reference
    expect(shallow[0]).toBe(objects[0]); // Same object reference inside
  });

  it('utils.defaults() should assign source properties if missing on the destination object', () => {
    const result = Domma.utils.defaults({'a': 1}, {'b': 2}, {'a': 3});
    expect(result.a).toBe(1); // Original 'a' takes precedence
    expect(result.b).toBe(2); // 'b' is added
  });

  it('utils.defaultsDeep() should recursively assign default properties', () => {
    const result = Domma.utils.defaultsDeep({'a': {'b': 2}}, {'a': {'b': 1, 'c': 3}});
    expect(result.a.b).toBe(2); // Original 'b' takes precedence
    expect(result.a.c).toBe(3); // 'c' is added recursively
  });

  it('utils.entries() and utils.toPairs() should create an array of own enumerable string keyed-value pairs', () => {
    function Foo() {
      this.a = 1;
      this.b = 2;
    }

    const result = Domma.utils.entries(new Foo());
    expect(result.length).toBe(2);
    expect(result).toEqual([['a', 1], ['b', 2]]);
    const result2 = Domma.utils.toPairs(new Foo()); // Alias
    expect(result2.length).toBe(2);
    expect(result2).toEqual([['a', 1], ['b', 2]]);
  });

  it('utils.findKey() should return the key of the first element predicate returns truthy for', () => {
    const users = {
      'barney': {'age': 36, 'active': true},
      'fred': {'age': 40, 'active': false},
      'pebbles': {'age': 1, 'active': true}
    };
    const result = Domma.utils.findKey(users, o => o.age < 40);
    expect(result).toBe('barney');
  });

  it('utils.findLastKey() should return the key of the last element predicate returns truthy for', () => {
    const users = {
      'barney': {'age': 36, 'active': true},
      'fred': {'age': 40, 'active': false},
      'pebbles': {'age': 1, 'active': true}
    };
    const result = Domma.utils.findLastKey(users, o => o.age < 40);
    expect(result).toBe('pebbles');
  });

  it('utils.forIn() should iterate over own and inherited enumerable properties', () => {
    function Foo() {
      this.a = 1;
    }

    Foo.prototype.b = 2;
    const result = [];
    Domma.utils.forIn(new Foo(), (value, key) => {
      result.push(key);
    });
    expect(result.length).toBe(2);
    expect(result).toContain('a');
    expect(result).toContain('b');
  });

  it('utils.forOwn() should iterate over own enumerable properties', () => {
    function Foo() {
      this.a = 1;
    }

    Foo.prototype.b = 2;
    const result = [];
    Domma.utils.forOwn(new Foo(), (value, key) => {
      result.push(key);
    });
    expect(result.length).toBe(1);
    expect(result).toContain('a');
    expect(result).not.toContain('b');
  });

  it('utils.invert() should create an object composed of the inverted keys and values', () => {
    const object = {'a': 1, 'b': 2, 'c': 1};
    const result = Domma.utils.invert(object);
    expect(result[1]).toBe('c'); // 'c' overwrites 'a' if order is not guaranteed, but usually the last one wins.
    expect(result[2]).toBe('b');
  });

  it('utils.invertBy() should create an object composed of the inverted keys and values, grouped by value', () => {
    const object = {'a': 1, 'b': 2, 'c': 1};
    const result = Domma.utils.invertBy(object);
    expect(result[1].length).toBe(2);
    expect(result[1]).toContain('a');
    expect(result[1]).toContain('c');
    expect(result[2]).toEqual(['b']);
  });

  it('utils.keys() should create an array of the own enumerable property names', () => {
    function Foo() {
      this.a = 1;
      this.b = 2;
    }

    Foo.prototype.c = 3;
    const result = Domma.utils.keys(new Foo());
    expect(result.length).toBe(2);
    expect(result).toContain('a');
    expect(result).toContain('b');
    expect(result).not.toContain('c');
  });

  it('utils.keysIn() should create an array of own and inherited enumerable property names', () => {
    function Foo() {
      this.a = 1;
      this.b = 2;
    }

    Foo.prototype.c = 3;
    const result = Domma.utils.keysIn(new Foo());
    expect(result.length).toBe(3);
    expect(result).toContain('a');
    expect(result).toContain('b');
    expect(result).toContain('c');
  });

  it('utils.mapKeys() should create an object with keys generated by iteratee', () => {
    const result = Domma.utils.mapKeys({'a': 1, 'b': 2}, (value, key) => key + value);
    expect(result).toEqual({a1: 1, b2: 2});
  });

  it('utils.mapValues() should create an object with values generated by iteratee', () => {
    const users = {
      'fred': {'user': 'fred', 'age': 40},
      'pebbles': {'user': 'pebbles', 'age': 1}
    };
    const result = Domma.utils.mapValues(users, o => o.age);
    expect(result.fred).toBe(40);
    expect(result.pebbles).toBe(1);
  });

  it('utils.omitBy() should omit properties where predicate returns truthy', () => {
    const object = {'a': 1, 'b': '2', 'c': 3};
    const result = Domma.utils.omitBy(object, Domma.utils.isNumber);
    expect(Object.keys(result).length).toBe(1);
    expect(result.b).toBe('2');
    expect(result.a).toBeUndefined();
    expect(result.c).toBeUndefined();
  });

  it('utils.pickBy() should pick properties where predicate returns truthy', () => {
    const object = {'a': 1, 'b': '2', 'c': 3};
    const result = Domma.utils.pickBy(object, Domma.utils.isNumber);
    expect(Object.keys(result).length).toBe(2);
    expect(result.a).toBe(1);
    expect(result.c).toBe(3);
    expect(result.b).toBeUndefined();
  });

  it('utils.unset() should unset the value at path of object', () => {
    const object = {'a': [{'b': {'c': 7}}]};
    Domma.utils.unset(object, 'a[0].b.c');
    expect(object.a[0].b.c).toBeUndefined();
  });

  it('utils.setIfUndefined() should set the value at path of object if the resolved value is undefined', () => {
    const object = {'a': [{'b': {'c': 3}}]};
    Domma.utils.setIfUndefined(object, 'a[0].b.d', 4);
    expect(object.a[0].b.d).toBe(4);
    Domma.utils.setIfUndefined(object, 'a[0].b.c', 5); // Should not change existing value
    expect(object.a[0].b.c).toBe(3);
  });

  it('utils.values() should create an array of own enumerable string keyed property values', () => {
    function Foo() {
      this.a = 1;
      this.b = 2;
    }

    Foo.prototype.c = 3;
    const result = Domma.utils.values(new Foo());
    expect(result.length).toBe(2);
    expect(result).toContain(1);
    expect(result).toContain(2);
    expect(result).not.toContain(3);
  });

  it('utils.valuesIn() should create an array of own and inherited enumerable property values', () => {
    function Foo() {
      this.a = 1;
      this.b = 2;
    }

    Foo.prototype.c = 3;
    const result = Domma.utils.valuesIn(new Foo());
    expect(result.length).toBe(3);
    expect(result).toContain(1);
    expect(result).toContain(2);
    expect(result).toContain(3);
  });

  it('utils.get() should get nested value', () => {
    const obj = {a: {b: {c: 3}}};
    expect(Domma.utils.get(obj, 'a.b.c')).toBe(3);
    expect(Domma.utils.get(obj, 'a.b.d', 'default')).toBe('default');
  });

  it('utils.set() should set nested value', () => {
    const obj = {};
    Domma.utils.set(obj, 'a.b.c', 1);
    expect(obj.a.b.c).toBe(1);
  });

  it('utils.has() should find existing path', () => {
    const obj = {a: {b: 2}};
    expect(Domma.utils.has(obj, 'a.b')).toBe(true);
    expect(Domma.utils.has(obj, 'a.c')).toBe(false);
  });

  it('utils.pick() should pick properties', () => {
    const result = Domma.utils.pick({a: 1, b: 2, c: 3}, 'a', 'c');
    expect(result.a).toBe(1);
    expect(result.c).toBe(3);
    expect(result.b).toBeUndefined();
  });

  it('utils.omit() should omit properties', () => {
    const result = Domma.utils.omit({a: 1, b: 2, c: 3}, 'b');
    expect(result.a).toBe(1);
    expect(result.c).toBe(3);
    expect(result.b).toBeUndefined();
  });

  it('utils.cloneDeep() should create deep clone', () => {
    const obj = {a: {b: 2}};
    const clone = Domma.utils.cloneDeep(obj);
    clone.a.b = 3;
    expect(obj.a.b).toBe(2);
    expect(clone.a.b).toBe(3);
  });
});

describe('Domma.utils - Lang Utilities', () => {
  it('utils.isBoolean() should return true for a boolean primitive', () => {
    expect(Domma.utils.isBoolean(false)).toBe(true);
    expect(Domma.utils.isBoolean(null)).toBe(false);
  });

  it('utils.isDate() should return true for a date object', () => {
    expect(Domma.utils.isDate(new Date())).toBe(true);
    expect(Domma.utils.isDate('Mon April 23 2012')).toBe(false);
  });

  it('utils.isMatch() should perform a partial deep comparison', () => {
    const object = {'a': 1, 'b': 2};
    expect(Domma.utils.isMatch(object, {'b': 2})).toBe(true);
    expect(Domma.utils.isMatch(object, {'b': 1})).toBe(false);
  });

  it('utils.isFinite() should return true for a finite number', () => {
    expect(Domma.utils.isFinite(3)).toBe(true);
    expect(Domma.utils.isFinite(Number.MIN_VALUE)).toBe(true);
    expect(Domma.utils.isFinite(Infinity)).toBe(false);
  });

  it('utils.isFunction() should return true for a function', () => {
    expect(Domma.utils.isFunction(Domma.utils.isFunction)).toBe(true);
    expect(Domma.utils.isFunction(/abc/)).toBe(false);
  });

  it('utils.isInteger() should return true for an integer', () => {
    expect(Domma.utils.isInteger(3)).toBe(true);
    expect(Domma.utils.isInteger(Number.MIN_VALUE)).toBe(false);
  });

  it('utils.isNaN() should return true for NaN', () => {
    expect(Domma.utils.isNaN(NaN)).toBe(true);
    expect(Domma.utils.isNaN(undefined)).toBe(false);
  });

  it('utils.isNil() should return true for null or undefined', () => {
    expect(Domma.utils.isNil(null)).toBe(true);
    expect(Domma.utils.isNil(undefined)).toBe(true);
    expect(Domma.utils.isNil(NaN)).toBe(false);
  });

  it('utils.isNull() should return true for null', () => {
    expect(Domma.utils.isNull(null)).toBe(true);
    expect(Domma.utils.isNull(undefined)).toBe(false);
  });

  it('utils.isNumber() should return true for a number primitive or object', () => {
    expect(Domma.utils.isNumber(3)).toBe(true);
    expect(Domma.utils.isNumber(Number.MIN_VALUE)).toBe(true);
    expect(Domma.utils.isNumber('3')).toBe(false);
  });

  it('utils.isObject() should return true for an object or array', () => {
    expect(Domma.utils.isObject({})).toBe(true);
    expect(Domma.utils.isObject([1, 2, 3])).toBe(true);
    expect(Domma.utils.isObject(null)).toBe(false);
  });

  it('utils.isPlainObject() should return true for a plain object', () => {
    function Foo() {
      this.a = 1;
    }

    expect(Domma.utils.isPlainObject({})).toBe(true);
    expect(Domma.utils.isPlainObject(new Foo())).toBe(false);
  });

  it('utils.isRegExp() should return true for a regex', () => {
    expect(Domma.utils.isRegExp(/abc/)).toBe(true);
    expect(Domma.utils.isRegExp('/abc/')).toBe(false);
  });

  it('utils.isString() should return true for a string primitive or object', () => {
    expect(Domma.utils.isString('abc')).toBe(true);
    expect(Domma.utils.isString(new String('abc'))).toBe(true);
    expect(Domma.utils.isString(1)).toBe(false);
  });

  it('utils.isSymbol() should return true for a symbol', () => {
    expect(Domma.utils.isSymbol(Symbol.iterator)).toBe(true);
    expect(Domma.utils.isSymbol('abc')).toBe(false);
  });

  it('utils.isUndefined() should return true for undefined', () => {
    expect(Domma.utils.isUndefined(undefined)).toBe(true);
    expect(Domma.utils.isUndefined(null)).toBe(false);
  });

  it('utils.isArray() should detect array', () => {
    expect(Domma.utils.isArray([])).toBe(true);
    expect(Domma.utils.isArray({})).toBe(false);
  });

  it('utils.isEmpty() should detect empty collections', () => {
    expect(Domma.utils.isEmpty([])).toBe(true);
    expect(Domma.utils.isEmpty({})).toBe(true);
    expect(Domma.utils.isEmpty([1])).toBe(false);
  });

  it('utils.isEqual() should compare equal objects and arrays', () => {
    expect(Domma.utils.isEqual({a: 1}, {a: 1})).toBe(true);
    expect(Domma.utils.isEqual([1, 2], [1, 2])).toBe(true);
    expect(Domma.utils.isEqual({a: 1}, {a: 2})).toBe(false);
  });
});

describe('Domma.utils - Type Conversion Utilities', () => {
  it('utils.parseInt() should convert a string to an integer', () => {
    expect(Domma.utils.parseInt('08')).toBe(8);
    expect(Domma.utils.parseInt('0x10')).toBe(16);
  });

  it('utils.toNumber() should convert a string to a number', () => {
    expect(Domma.utils.toNumber('3.2')).toBe(3.2);
    expect(Domma.utils.toNumber(Number.MIN_VALUE)).toBe(5e-324);
    expect(Domma.utils.isNaN(Domma.utils.toNumber('invalid'))).toBe(true);
  });

  it('utils.toInteger() should convert a value to an integer', () => {
    expect(Domma.utils.toInteger(3.2)).toBe(3);
    expect(Domma.utils.toInteger(Number.MIN_VALUE)).toBe(0);
    expect(Domma.utils.toInteger(Infinity)).toBe(Infinity);
  });

  it('utils.toFinite() should return a finite number', () => {
    expect(Domma.utils.toFinite(3.2)).toBe(3.2);
    expect(Domma.utils.toFinite(Number.MIN_VALUE)).toBe(5e-324);
    expect(Domma.utils.toFinite(Infinity)).toBe(1.7976931348623157e+308);
  });

  it('utils.toSafeInteger() should convert to a safe integer', () => {
    expect(Domma.utils.toSafeInteger(3.2)).toBe(3);
    expect(Domma.utils.toSafeInteger(Number.MAX_SAFE_INTEGER + 1)).toBe(Number.MAX_SAFE_INTEGER);
  });

  it('utils.toString() should convert various types to string', () => {
    expect(Domma.utils.toString(null)).toBe('');
    expect(Domma.utils.toString(-0)).toBe('-0');
    expect(Domma.utils.toString([1, 2, 3])).toBe('1,2,3');
  });

  it('utils.toArray() should convert an object or string to an array', () => {
    expect(Domma.utils.toArray({'a': 1, 'b': 2}).length).toBe(2);
    expect(Domma.utils.toArray('abc').length).toBe(3);
  });

  it('utils.castArray() should wrap non-array values in an array', () => {
    expect(Domma.utils.castArray(1).length).toBe(1);
    expect(Domma.utils.castArray([1, 2, 3]).length).toBe(3);
  });

  it('utils.toLength() should convert to a valid array-like length', () => {
    expect(Domma.utils.toLength(3.2)).toBe(3);
    expect(Domma.utils.toLength(Number.MAX_VALUE)).toBe(4294967295);
  });

  it('utils.toPlainObject() should convert a value to a plain object', () => {
    function Foo() {
      this.a = 1;
    }

    Foo.prototype.b = 2;
    const result = Domma.utils.toPlainObject(new Foo());
    expect(result.a).toBe(1);
    expect(result.b).toBe(2);
  });
});

describe('Domma.utils - Math Utilities', () => {
  it('utils.add() should add two numbers', () => {
    expect(Domma.utils.add(6, 4)).toBe(10);
  });

  it('utils.ceil() should compute number rounded up to precision', () => {
    expect(Domma.utils.ceil(4.006)).toBe(5);
    expect(Domma.utils.ceil(6.004, 2)).toBe(6.01);
  });

  it('utils.divide() should divide two numbers', () => {
    expect(Domma.utils.divide(6, 4)).toBe(1.5);
  });

  it('utils.floor() should compute number rounded down to precision', () => {
    expect(Domma.utils.floor(4.006)).toBe(4);
    expect(Domma.utils.floor(0.046, 2)).toBe(0.04);
  });

  it('utils.max() should compute the maximum value of array', () => {
    const array = [4, 2, 8, 6];
    expect(Domma.utils.max(array)).toBe(8);
  });

  it('utils.maxBy() should compute the maximum value of array with iteratee', () => {
    const objects = [{'n': 1}, {'n': 2}];
    expect(Domma.utils.maxBy(objects, o => o.n).n).toBe(2);
  });

  it('utils.meanBy() should compute the mean using iteratee', () => {
    const objects = [{'n': 4}, {'n': 2}, {'n': 8}, {'n': 6}];
    expect(Domma.utils.meanBy(objects, o => o.n)).toBe(5);
  });

  it('utils.min() should compute the minimum value of array', () => {
    const array = [4, 2, 8, 6];
    expect(Domma.utils.min(array)).toBe(2);
  });

  it('utils.minBy() should compute the minimum value of array with iteratee', () => {
    const objects = [{'n': 1}, {'n': 2}];
    expect(Domma.utils.minBy(objects, o => o.n).n).toBe(1);
  });

  it('utils.multiply() should multiply two numbers', () => {
    expect(Domma.utils.multiply(6, 4)).toBe(24);
  });

  it('utils.round() should compute number rounded to precision', () => {
    expect(Domma.utils.round(4.006)).toBe(4);
    expect(Domma.utils.round(4.006, 2)).toBe(4.01);
  });

  it('utils.subtract() should subtract two numbers', () => {
    expect(Domma.utils.subtract(6, 4)).toBe(2);
  });

  it('utils.sumBy() should compute the sum using iteratee', () => {
    const objects = [{'n': 4}, {'n': 2}, {'n': 8}, {'n': 6}];
    expect(Domma.utils.sumBy(objects, o => o.n)).toBe(20);
  });

  it('utils.sum() should sum array', () => {
    expect(Domma.utils.sum([1, 2, 3, 4])).toBe(10);
  });

  it('utils.mean() should compute mean', () => {
    expect(Domma.utils.mean([1, 2, 3, 4, 5])).toBe(3);
  });

  it('utils.clamp() should clamp value to bounds', () => {
    expect(Domma.utils.clamp(10, 0, 5)).toBe(5);
    expect(Domma.utils.clamp(-5, 0, 5)).toBe(0);
  });
});

describe('Domma.utils - Number Utilities', () => {
  it('utils.inRange() should return true if the number is in range', () => {
    expect(Domma.utils.inRange(3, 2, 4)).toBe(true);
    expect(Domma.utils.inRange(4, 8)).toBe(true); // default start is 0
    expect(Domma.utils.inRange(4, 2)).toBe(false); // implicit range 0-2
    expect(Domma.utils.inRange(2, 2)).toBe(false); // implicit range 0-2
  });

  it('utils.random() should return a random number within range', () => {
    const result = Domma.utils.random(5);
    expect(result).toBeGreaterThanOrEqual(0);
    expect(result).toBeLessThanOrEqual(5);
    const result2 = Domma.utils.random(5, 10);
    expect(result2).toBeGreaterThanOrEqual(5);
    expect(result2).toBeLessThanOrEqual(10);
    const result3 = Domma.utils.random(5, true); // floating point
    expect(result3).toBeGreaterThanOrEqual(0);
    expect(result3).toBeLessThanOrEqual(5);
    expect(result3 % 1).not.toBe(0); // Should be a float
  });
});

describe('Domma.utils - String Utilities', () => {
  it('utils.endsWith() should check if string ends with target', () => {
    expect(Domma.utils.endsWith('abc', 'c')).toBe(true);
    expect(Domma.utils.endsWith('abc', 'b')).toBe(false);
    expect(Domma.utils.endsWith('abc', 'b', 2)).toBe(true); // check position
  });

  it('utils.escape() should convert characters to HTML entities', () => {
    expect(Domma.utils.escape('fred, barney, & pebbles')).toBe('fred, barney, &amp; pebbles');
  });

  it('utils.lowerCase() should convert a string to lower case', () => {
    expect(Domma.utils.lowerCase('--Foo-Bar--')).toBe('foo bar');
    expect(Domma.utils.lowerCase('fooBar')).toBe('foo bar');
    expect(Domma.utils.lowerCase('__FOO_BAR__')).toBe('foo bar');
  });

  it('utils.lowerFirst() should convert the first character to lower case', () => {
    expect(Domma.utils.lowerFirst('Fred')).toBe('fred');
    expect(Domma.utils.lowerFirst('FRED')).toBe('fRED');
  });

  it('utils.pad() should pad a string on both sides', () => {
    expect(Domma.utils.pad('abc', 8)).toBe('  abc   ');
    expect(Domma.utils.pad('abc', 8, '_-')).toBe('_-abc_-_');
  });

  it('utils.padEnd() should pad a string on the right side', () => {
    expect(Domma.utils.padEnd('abc', 6)).toBe('abc   ');
    expect(Domma.utils.padEnd('abc', 6, '_-')).toBe('abc_-_');
  });

  it('utils.padStart() should pad a string on the left side', () => {
    expect(Domma.utils.padStart('abc', 6)).toBe('   abc');
    expect(Domma.utils.padStart('abc', 6, '_-')).toBe('_-_abc'); // Corrected expected padding
  });

  it('utils.repeat() should repeat the given string n times', () => {
    expect(Domma.utils.repeat('*', 3)).toBe('***');
  });

  it('utils.replace() should replace matches for pattern', () => {
    expect(Domma.utils.replace('Hi Fred', 'Fred', 'Barney')).toBe('Hi Barney');
  });

  it('utils.snakeCase() should convert a string to snake case', () => {
    expect(Domma.utils.snakeCase('Foo Bar')).toBe('foo_bar');
    expect(Domma.utils.snakeCase('fooBar')).toBe('foo_bar');
    expect(Domma.utils.snakeCase('--FOO-BAR--')).toBe('foo_bar');
  });

  it('utils.split() should split a string by separator', () => {
    const result = Domma.utils.split('a-b-c', '-', 2);
    expect(result.length).toBe(2);
    expect(result).toEqual(['a', 'b']);
  });

  it('utils.startCase() should convert a string to start case', () => {
    expect(Domma.utils.startCase('--foo-bar--')).toBe('Foo Bar');
    expect(Domma.utils.startCase('fooBar')).toBe('Foo Bar');
    expect(Domma.utils.startCase('__FOO_BAR__')).toBe('Foo Bar');
  });

  it('utils.startsWith() should check if string starts with target', () => {
    expect(Domma.utils.startsWith('abc', 'a')).toBe(true);
    expect(Domma.utils.startsWith('abc', 'b')).toBe(false);
    expect(Domma.utils.startsWith('abc', 'b', 1)).toBe(true); // check position
  });

  it('utils.toLower() should convert a string to lower case', () => {
    expect(Domma.utils.toLower('--Foo-Bar--')).toBe('--foo-bar--');
  });

  it('utils.toUpper() should convert a string to upper case', () => {
    expect(Domma.utils.toUpper('--foo-bar--')).toBe('--FOO-BAR--');
  });

  it('utils.trimEnd() should remove trailing whitespace or characters', () => {
    expect(Domma.utils.trimEnd('  abc  ')).toBe('  abc');
    expect(Domma.utils.trimEnd('-_-abc-_-', '_-')).toBe('-_-abc');
  });

  it('utils.trimStart() should remove leading whitespace or characters', () => {
    expect(Domma.utils.trimStart('  abc  ')).toBe('abc  ');
    expect(Domma.utils.trimStart('-_-abc-_-', '_-')).toBe('abc-_-');
  });

  it('utils.unescape() should convert HTML entities to characters', () => {
    expect(Domma.utils.unescape('fred, barney, &amp; pebbles')).toBe('fred, barney, & pebbles');
  });

  it('utils.upperCase() should convert a string to upper case', () => {
    expect(Domma.utils.upperCase('--foo-bar--')).toBe('FOO BAR');
    expect(Domma.utils.upperCase('fooBar')).toBe('FOO BAR');
    expect(Domma.utils.upperCase('__FOO_BAR__')).toBe('FOO BAR');
  });

  it('utils.upperFirst() should convert the first character to upper case', () => {
    expect(Domma.utils.upperFirst('fred')).toBe('Fred');
    expect(Domma.utils.upperFirst('FRED')).toBe('FRED');
  });

  it('utils.words() should split a string into an array of words', () => {
    expect(Domma.utils.words('fred, barney, & pebbles').length).toBe(3);
    expect(Domma.utils.words('fred, barney, & pebbles')).toEqual(['fred', 'barney', 'pebbles']);
  });

  it('utils.sprintf() and utils.format() should format a string', () => {
    const result = Domma.utils.sprintf('Hello %s, your score is %d', 'John', 95);
    expect(result).toBe('Hello John, your score is 95');
    const result2 = Domma.utils.format('Hello %s, your score is %d', 'John', 95); // Alias
    expect(result2).toBe('Hello John, your score is 95');
  });

  it('utils.camelCase() should convert to camelCase', () => {
    expect(Domma.utils.camelCase('foo-bar')).toBe('fooBar');
  });

  it('utils.kebabCase() should convert to kebab-case', () => {
    expect(Domma.utils.kebabCase('fooBar')).toBe('foo-bar');
  });

  it('utils.capitalize() should capitalize string', () => {
    expect(Domma.utils.capitalize('hello')).toBe('Hello');
  });

  it('utils.trim() should trim whitespace', () => {
    expect(Domma.utils.trim('  hello  ')).toBe('hello');
  });

  it('utils.truncate() should truncate with ellipsis', () => {
    const result = Domma.utils.truncate('hello world', {length: 8});
    expect(result).toBe('hello...');
  });
});

describe('Domma.utils - Template Engine Utilities', () => {
  it('utils.template() and utils.render() should compile and render templates', () => {
    const compiled = Domma.utils.template('hello {{ user }}!');
    const result = compiled({'user': 'fred'});
    expect(result).toBe('hello fred!');

    const result2 = Domma.utils.render('hello {{ user }}!', {'user': 'barney'}); // Alias
    expect(result2).toBe('hello barney!');
  });
});

describe('Domma.utils - Chaining Utilities', () => {
  it('utils.chain() should create a chainable wrapper', () => {
    const users = [
      {'user': 'barney', 'age': 36},
      {'user': 'fred', 'age': 40},
      {'user': 'pebbles', 'age': 1}
    ];
    const result = Domma.utils.chain(users)
      .sortBy('age')
      .map(o => o.user + ' is ' + o.age)
      .head()
      .value();

    expect(result).toBe('pebbles is 1');
  });
});
