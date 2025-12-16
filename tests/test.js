import Domma from '../src/index.js';

// Simple Test Runner
const tests = [];
function test(name, fn) {
    tests.push({ name, fn });
}

function assert(condition, message) {
    if (!condition) {
        throw new Error(message || "Assertion failed");
    }
}

// Define Tests
test('Domma selection', () => {
  resetTestEnvironment();
    const el = Domma('#test');
    assert(el.elements.length === 1, 'Should select one element');
});

test('Domma text()', () => {
  resetTestEnvironment();
    const el = Domma('#test');
    el.text('Hello');
    assert(document.getElementById('test').textContent === 'Hello', 'Should set text content');
    assert(el.text() === 'Hello', 'Should get text content');
});

test('Domma utils.merge()', () => {
  resetTestEnvironment();
    const a = {x: 1};
    const b = {y: 2};
    const c = Domma.utils.merge({}, a, b);
    assert(c.x === 1 && c.y === 2, 'Should merge objects');
});

// Domma DOM CSS/Class
test('dom.css()', () => {
  resetTestEnvironment();
    const el = Domma('#test');
    el.css('color', 'red');
    assert(document.getElementById('test').style.color === 'red', 'Should set CSS property');
});

test('dom.addClass()', () => {
  resetTestEnvironment();
    const el = Domma('#test');
    el.addClass('foo');
    assert(document.getElementById('test').classList.contains('foo'), 'Should add class');
});

test('dom.removeClass()', () => {
  resetTestEnvironment();
    const el = Domma('#test').addClass('foo').removeClass('foo');
    assert(el.hasClass('foo') === false, 'should remove a class');
});

test('dom.toggleClass()', () => {
  resetTestEnvironment();
    const el = Domma('#test').toggleClass('foo');
    assert(el.hasClass('foo') === true, 'should toggle a class on');
    el.toggleClass('foo');
    assert(el.hasClass('foo') === false, 'should toggle a class off');
});

test('dom.hasClass()', () => {
  resetTestEnvironment();
    const el = Domma('#test').addClass('foo');
    assert(el.hasClass('foo') === true, 'should return true for an existing class');
    assert(el.hasClass('bar') === false, 'should return false for a nonexistent class');
});

// Array Utilities
test('utils.chunk()', () => {
  resetTestEnvironment();
    const result = Domma.utils.chunk([1, 2, 3, 4, 5], 2);
    assert(result.length === 3, 'Should create 3 chunks');
    assert(result[0].length === 2, 'First chunk should have 2 items');
});

test('utils.compact()', () => {
  resetTestEnvironment();
    const result = Domma.utils.compact([0, 1, false, 2, '', 3, null]);
    assert(result.length === 3, 'Should remove falsy values');
});

test('utils.difference()', () => {
  resetTestEnvironment();
    const result = Domma.utils.difference([1, 2, 3], [2, 3, 4]);
    assert(result.length === 1 && result[0] === 1, 'Should return difference');
});

test('utils.differenceBy()', () => {
  resetTestEnvironment();
    const result = Domma.utils.differenceBy([2.1, 1.2], [2.3, 3.4], Math.floor);
    assert(result.length === 1 && result[0] === 1.2, 'should return difference by iteratee');
});

test('utils.differenceWith()', () => {
  resetTestEnvironment();
    const objects = [{'x': 1, 'y': 2}, {'x': 2, 'y': 1}];
    const result = Domma.utils.differenceWith(objects, [{'x': 1, 'y': 2}], (a, b) => Domma.utils.isEqual(a, b));
    assert(result.length === 1 && result[0].x === 2, 'should return difference with comparator');
});

test('utils.dropRightWhile()', () => {
  resetTestEnvironment();
    const users = [
        {'user': 'barney', 'active': true},
        {'user': 'fred', 'active': false},
        {'user': 'pebbles', 'active': false}
    ];
    const result = Domma.utils.dropRightWhile(users, o => !o.active);
    assert(result.length === 1 && result[0].user === 'barney', 'should drop elements from the right while predicate is truthy');
});

test('utils.dropWhile()', () => {
  resetTestEnvironment();
    const users = [
        {'user': 'barney', 'active': false},
        {'user': 'fred', 'active': false},
        {'user': 'pebbles', 'active': true}
    ];
    const result = Domma.utils.dropWhile(users, o => !o.active);
    assert(result.length === 1 && result[0].user === 'pebbles', 'should drop elements from the left while predicate is truthy');
});

test('utils.eq()', () => {
  resetTestEnvironment();
    const object = {'a': 1};
    assert(Domma.utils.eq(object, object) === true, 'should return true for same value');
    assert(Domma.utils.eq(object, {'a': 1}) === false, 'should return false for different objects with same values');
    assert(Domma.utils.eq(NaN, NaN) === true, 'should return true for NaN');
});

test('utils.flatten()', () => {
  resetTestEnvironment();
    const result = Domma.utils.flatten([1, [2, [3, [4]]]]);
    assert(result.length === 3, 'Should flatten one level');
});

test('utils.flattenDeep()', () => {
  resetTestEnvironment();
    const result = Domma.utils.flattenDeep([1, [2, [3, [4]]]]);
    assert(result.length === 4, 'Should flatten all levels');
});

test('utils.uniq()', () => {
  resetTestEnvironment();
    const result = Domma.utils.uniq([1, 2, 2, 3, 3, 3]);
    assert(result.length === 3, 'Should remove duplicates');
});

test('utils.intersection()', () => {
  resetTestEnvironment();
    const result = Domma.utils.intersection([1, 2, 3], [2, 3, 4]);
    assert(result.length === 2, 'Should return common elements');
});

test('utils.concat()', () => {
  resetTestEnvironment();
    const array = [1];
    const result = Domma.utils.concat(array, 2, [3], [[4]]);
    assert(result.length === 4, 'Should concatenate values and arrays');
    assert(result[0] === 1 && result[1] === 2 && result[2] === 3 && result[3][0] === 4, 'Should concatenate in the correct order');
});

test('utils.drop()', () => {
  resetTestEnvironment();
    const result = Domma.utils.drop([1, 2, 3]);
    assert(result.length === 2 && result[0] === 2 && result[1] === 3, 'Should drop the first element');
    const result2 = Domma.utils.drop([1, 2, 3], 2);
    assert(result2.length === 1 && result2[0] === 3, 'Should drop the first two elements');
});

test('utils.dropRight()', () => {
  resetTestEnvironment();
    const result = Domma.utils.dropRight([1, 2, 3]);
    assert(result.length === 2 && result[0] === 1 && result[1] === 2, 'Should drop the last element');
    const result2 = Domma.utils.dropRight([1, 2, 3], 2);
    assert(result2.length === 1 && result2[0] === 1, 'Should drop the last two elements');
});

test('utils.fill()', () => {
  resetTestEnvironment();
    const array = [1, 2, 3];
    Domma.utils.fill(array, 'a');
    assert(array[0] === 'a' && array[1] === 'a' && array[2] === 'a', 'Should fill the whole array');
    const array2 = [1, 2, 3];
    Domma.utils.fill(array2, '*', 1, 2);
    assert(array2[0] === 1 && array2[1] === '*' && array2[2] === 3, 'Should fill a slice of the array');
});

test('utils.findIndex()', () => {
  resetTestEnvironment();
    const users = [
        {'user': 'barney', 'active': false},
        {'user': 'fred', 'active': false},
        {'user': 'pebbles', 'active': true}
    ];
    const result = Domma.utils.findIndex(users, o => o.user === 'fred');
    assert(result === 1, 'Should find the index of the first element predicate returns truthy for');
});

test('utils.findLastIndex()', () => {
  resetTestEnvironment();
    const users = [
        {'user': 'barney', 'active': true},
        {'user': 'fred', 'active': false},
        {'user': 'pebbles', 'active': false}
    ];
    const result = Domma.utils.findLastIndex(users, o => o.user === 'barney');
    assert(result === 0, 'Should find the index of the last element predicate returns truthy for');
});

test('utils.first() and utils.head()', () => {
  resetTestEnvironment();
    const array = [1, 2, 3];
    assert(Domma.utils.first(array) === 1, 'first() should return the first element');
    assert(Domma.utils.head(array) === 1, 'head() should be an alias for first() and return the first element');
});

test('utils.flattenDepth()', () => {
  resetTestEnvironment();
    const array = [1, [2, [3, [4]], 5]];
    const result = Domma.utils.flattenDepth(array, 2);
    assert(result.length === 5, 'Should flatten to a depth of 2');
    assert(Array.isArray(result[3]) && result[3][0] === 4, 'Should have a nested array at index 3');
});

test('utils.fromPairs()', () => {
  resetTestEnvironment();
    const result = Domma.utils.fromPairs([['a', 1], ['b', 2]]);
    assert(result.a === 1 && result.b === 2, 'Should create an object from key-value pairs');
});

test('utils.indexOf()', () => {
  resetTestEnvironment();
    const array = [1, 2, 1, 2];
    assert(Domma.utils.indexOf(array, 2) === 1, 'Should return the first index of the value');
    assert(Domma.utils.indexOf(array, 2, 2) === 3, 'Should return the first index of the value at or after the fromIndex');
});

test('utils.initial()', () => {
  resetTestEnvironment();
    const result = Domma.utils.initial([1, 2, 3]);
    assert(result.length === 2 && result[0] === 1 && result[1] === 2, 'Should return all but the last element');
});

test('utils.join()', () => {
  resetTestEnvironment();
    const result = Domma.utils.join(['a', 'b', 'c'], '~');
    assert(result === 'a~b~c', 'Should join the array elements with the separator');
});

test('utils.last()', () => {
  resetTestEnvironment();
    const result = Domma.utils.last([1, 2, 3]);
    assert(result === 3, 'Should return the last element of the array');
});

test('utils.lastIndexOf()', () => {
  resetTestEnvironment();
    const array = [1, 2, 1, 2];
    assert(Domma.utils.lastIndexOf(array, 1) === 2, 'Should return the last index of the value');
    assert(Domma.utils.lastIndexOf(array, 1, 1) === 0, 'Should return the last index of the value at or before the fromIndex');
});

test('utils.nth()', () => {
  resetTestEnvironment();
    const array = ['a', 'b', 'c', 'd'];
    assert(Domma.utils.nth(array, 1) === 'b', 'Should return the element at the specified index');
    assert(Domma.utils.nth(array, -2) === 'c', 'Should return the element at the specified negative index');
});

test('utils.pull()', () => {
  resetTestEnvironment();
    const array = ['a', 'b', 'c', 'a', 'b', 'c'];
    Domma.utils.pull(array, 'a', 'c');
    assert(array.length === 2 && array[0] === 'b' && array[1] === 'b', 'Should remove all given values from array');
});

test('utils.pullAt()', () => {
  resetTestEnvironment();
    const array = ['a', 'b', 'c', 'd'];
    const pulled = Domma.utils.pullAt(array, [1, 3]);
    assert(array.length === 2 && array[0] === 'a' && array[1] === 'c', 'Should remove elements at the specified indexes');
    assert(pulled.length === 2 && pulled[0] === 'b' && pulled[1] === 'd', 'Should return the removed elements');
});

test('utils.reverse()', () => {
  resetTestEnvironment();
    const array = [1, 2, 3];
    const reversed = Domma.utils.reverse(array);
    assert(reversed[0] === 3 && reversed[1] === 2 && reversed[2] === 1, 'Should reverse the array');
    assert(array === reversed, 'Should mutate the original array');
});

test('utils.slice()', () => {
  resetTestEnvironment();
    const array = [1, 2, 3, 4];
    const sliced = Domma.utils.slice(array, 1, 3);
    assert(sliced.length === 2 && sliced[0] === 2 && sliced[1] === 3, 'Should return a slice of the array');
});

test('utils.tail()', () => {
  resetTestEnvironment();
    const result = Domma.utils.tail([1, 2, 3]);
    assert(result.length === 2 && result[0] === 2 && result[1] === 3, 'Should return all but the first element');
});

test('utils.take()', () => {
  resetTestEnvironment();
    const result = Domma.utils.take([1, 2, 3], 2);
    assert(result.length === 2 && result[0] === 1 && result[1] === 2, 'Should take the first two elements');
});

test('utils.takeRight()', () => {
  resetTestEnvironment();
    const result = Domma.utils.takeRight([1, 2, 3], 2);
    assert(result.length === 2 && result[0] === 2 && result[1] === 3, 'Should take the last two elements');
});

test('utils.union()', () => {
  resetTestEnvironment();
    const result = Domma.utils.union([2], [1, 2]);
    assert(result.length === 2 && result[0] === 2 && result[1] === 1, 'Should create an array of unique values');
});

test('utils.uniqBy()', () => {
  resetTestEnvironment();
    const result = Domma.utils.uniqBy([2.1, 1.2, 2.3], Math.floor);
    assert(result.length === 2 && result[0] === 2.1 && result[1] === 1.2, 'Should create a duplicate-free version of an array using an iteratee');
});

test('utils.without()', () => {
  resetTestEnvironment();
    const result = Domma.utils.without([2, 1, 2, 3], 1, 2);
    assert(result.length === 1 && result[0] === 3, 'Should create an array excluding all given values');
});

test('utils.xor()', () => {
  resetTestEnvironment();
    const result = Domma.utils.xor([2, 1], [2, 3]);
    assert(result.length === 2 && result.includes(1) && result.includes(3), 'Should create an array of unique values that is the symmetric difference of the given arrays');
});

test('utils.zip()', () => {
  resetTestEnvironment();
    const result = Domma.utils.zip(['a', 'b'], [1, 2], [true, false]);
    assert(result.length === 2 && result[0][0] === 'a' && result[1][2] === false, 'Should create an array of grouped elements');
});

test('utils.zipObject()', () => {
  resetTestEnvironment();
    const result = Domma.utils.zipObject(['a', 'b'], [1, 2]);
    assert(result.a === 1 && result.b === 2, 'Should create an object from arrays of keys and values');
});

test('utils.times()', () => {
  resetTestEnvironment();
    const result = Domma.utils.times(3, String);
    assert(result.length === 3 && result[0] === '0' && result[1] === '1' && result[2] === '2', 'Should invoke the iteratee n times');
});

test('utils.range()', () => {
  resetTestEnvironment();
    const result = Domma.utils.range(4);
    assert(result.length === 4 && result[3] === 3, 'Should create an array of numbers');
    const result2 = Domma.utils.range(-4);
    assert(result2.length === 4 && result2[3] === -3, 'Should create an array of negative numbers');
});

test('utils.uniqueId()', () => {
  resetTestEnvironment();
    const id1 = Domma.utils.uniqueId();
    const id2 = Domma.utils.uniqueId();
    assert(id1 !== id2, 'Should generate unique IDs');
    const id3 = Domma.utils.uniqueId('contact_');
    assert(id3.startsWith('contact_'), 'Should generate unique IDs with a prefix');
});

// Collection Utilities
test('utils.countBy()', () => {
  resetTestEnvironment();
    const result = Domma.utils.countBy([6.1, 4.2, 6.3], Math.floor);
    assert(result[4] === 1 && result[6] === 2, 'Should count the occurrences of each element');
});

test('utils.each() and utils.forEach()', () => {
  resetTestEnvironment();
    let sum = 0;
    Domma.utils.each([1, 2, 3], n => sum += n);
    assert(sum === 6, 'each() should iterate over each element');

    sum = 0;
    Domma.utils.forEach([1, 2, 3], n => sum += n);
    assert(sum === 6, 'forEach() should be an alias for each()');
});

test('utils.eachRight() and utils.forEachRight()', () => {
  resetTestEnvironment();
    let result = '';
    Domma.utils.eachRight([1, 2, 3], n => result += n);
    assert(result === '321', 'eachRight() should iterate over each element in reverse');

    result = '';
    Domma.utils.forEachRight([1, 2, 3], n => result += n);
    assert(result === '321', 'forEachRight() should be an alias for eachRight()');
});

test('utils.every()', () => {
  resetTestEnvironment();
    assert(Domma.utils.every([true, 1, null, 'yes'], Boolean) === false, 'Should return false if not all elements pass the predicate');
    assert(Domma.utils.every([true, 1, 'yes'], Boolean) === true, 'Should return true if all elements pass the predicate');
});

test('utils.findLast()', () => {
  resetTestEnvironment();
    const users = [{
        user: 'barney',
        active: true
    }, {
        user: 'fred',
        active: false
    }, {
        user: 'pebbles',
        active: false
    }];
    const result = Domma.utils.findLast(users, o => o.active === false);
    assert(result.user === 'pebbles', 'Should return the last element predicate returns truthy for');
});

test('utils.flatMap()', () => {
  resetTestEnvironment();
    function duplicate(n) {
        return [n, n];
    }

    const result = Domma.utils.flatMap([1, 2], duplicate);
    assert(result.length === 4 && result[1] === 1 && result[2] === 2, 'Should create a flattened array of values by running each element through iteratee');
});

test('utils.flatMapDeep()', () => {
  resetTestEnvironment();
    function duplicate(n) {
        return [[[n, n]]];
    }

    const result = Domma.utils.flatMapDeep([1, 2], duplicate);
    assert(result.length === 4 && result[1] === 1 && result[2] === 2, 'Should recursively flatten the mapped results');
});

test('utils.includes()', () => {
  resetTestEnvironment();
    assert(Domma.utils.includes([1, 2, 3], 1) === true, 'Should return true if the value is in the collection');
    assert(Domma.utils.includes([1, 2, 3], 1, 2) === false, 'Should return false if the value is not in the collection at or after the fromIndex');
    assert(Domma.utils.includes({'a': 1, 'b': 2}, 1) === true, 'Should work with objects');
});

test('utils.keyBy()', () => {
  resetTestEnvironment();
    const array = [
        {'dir': 'left', 'code': 97},
        {'dir': 'right', 'code': 100}
    ];
    const result = Domma.utils.keyBy(array, o => String.fromCharCode(o.code));
    assert(result['a'].dir === 'left' && result['d'].dir === 'right', 'Should create an object with keys generated from the results of running each element through iteratee');
});

test('utils.orderBy()', () => {
  resetTestEnvironment();
    const users = [
        {'user': 'fred', 'age': 48},
        {'user': 'barney', 'age': 34},
        {'user': 'fred', 'age': 40},
        {'user': 'barney', 'age': 36}
    ];
    const result = Domma.utils.orderBy(users, ['user', 'age'], ['asc', 'desc']);
    assert(result[0].user === 'barney' && result[0].age === 36, 'Should sort the array of objects by user and age');
});

test('utils.partition()', () => {
  resetTestEnvironment();
    const users = [
        {'user': 'barney', 'age': 36, 'active': false},
        {'user': 'fred', 'age': 40, 'active': true},
        {'user': 'pebbles', 'age': 1, 'active': false}
    ];
    const result = Domma.utils.partition(users, o => o.active);
    assert(result[0].length === 1 && result[0][0].user === 'fred', 'Should create an array of elements split into two groups');
    assert(result[1].length === 2 && result[1][0].user === 'barney', 'Should create an array of elements split into two groups');
});

test('utils.reduceRight()', () => {
  resetTestEnvironment();
    const array = [[0, 1], [2, 3], [4, 5]];
    const result = Domma.utils.reduceRight(array, (flattened, other) => flattened.concat(other), []);
    assert(result.length === 6 && result[0] === 4 && result[5] === 1, 'Should reduce a collection from right to left');
});

test('utils.reject()', () => {
  resetTestEnvironment();
    const users = [
        {'user': 'barney', 'age': 36, 'active': false},
        {'user': 'fred', 'age': 40, 'active': true}
    ];
    const result = Domma.utils.reject(users, o => !o.active);
    assert(result.length === 1 && result[0].user === 'fred', 'Should return the elements predicate does not return truthy for');
});

test('utils.sample()', () => {
  resetTestEnvironment();
    const array = [1, 2, 3, 4, 5];
    const result = Domma.utils.sample(array);
    assert(array.includes(result), 'Should return a random element from the collection');
});

test('utils.sampleSize()', () => {
  resetTestEnvironment();
    const array = [1, 2, 3, 4, 5];
    const result = Domma.utils.sampleSize(array, 3);
    assert(result.length === 3, 'Should return a random sample of n elements from the collection');
});

test('utils.shuffle()', () => {
  resetTestEnvironment();
    const array = [1, 2, 3, 4, 5];
    const result = Domma.utils.shuffle(array);
    assert(result.length === 5, 'Should return a shuffled array');
});

test('utils.size()', () => {
  resetTestEnvironment();
    assert(Domma.utils.size([1, 2, 3]) === 3, 'Should return the size of the collection');
    assert(Domma.utils.size({'a': 1, 'b': 2}) === 2, 'Should return the size of the object');
    assert(Domma.utils.size('pebbles') === 7, 'Should return the size of the string');
});

test('utils.some()', () => {
  resetTestEnvironment();
    assert(Domma.utils.some([null, 0, 'yes', false], Boolean) === true, 'Should return true if any element passes the predicate');
    assert(Domma.utils.some([null, 0, false], Boolean) === false, 'Should return false if no element passes the predicate');
});

test('utils.filter()', () => {
  resetTestEnvironment();
    const result = Domma.utils.filter([1, 2, 3, 4], n => n > 2);
    assert(result.length === 2, 'Should filter elements');
});

test('utils.find()', () => {
  resetTestEnvironment();
    const result = Domma.utils.find([1, 2, 3], n => n > 1);
    assert(result === 2, 'Should find first matching element');
});

test('utils.groupBy()', () => {
  resetTestEnvironment();
    const result = Domma.utils.groupBy([1.2, 2.1, 2.3], Math.floor);
    assert(result[1].length === 1 && result[2].length === 2, 'Should group by key');
});

test('utils.map()', () => {
  resetTestEnvironment();
    const result = Domma.utils.map([1, 2, 3], n => n * 2);
    assert(result[0] === 2 && result[2] === 6, 'Should map elements');
});

test('utils.reduce()', () => {
  resetTestEnvironment();
    const result = Domma.utils.reduce([1, 2, 3], (sum, n) => sum + n, 0);
    assert(result === 6, 'Should reduce to sum');
});

test('utils.sortBy()', () => {
  resetTestEnvironment();
    const result = Domma.utils.sortBy([{ n: 3 }, { n: 1 }, { n: 2 }], 'n');
    assert(result[0].n === 1, 'Should sort by property');
});

// Function Utilities
test('utils.after()', () => {
  resetTestEnvironment();
    const saves = ['profile', 'settings'];
    const done = Domma.utils.after(saves.length, () => {
        assert(true, 'should be called after all saves are done');
    });
    for (let i = 0; i < saves.length; i++) {
        done();
    }
});

test('utils.ary()', () => {
  resetTestEnvironment();
    const takesTwo = (a, b) => [a, b];
    const takesOne = Domma.utils.ary(takesTwo, 1);
    const result = takesOne(1, 2);
    assert(result.length === 2 && result[0] === 1 && result[1] === undefined, 'should invoke func with up to n arguments, the rest being undefined');
});

test('utils.before()', () => {
  resetTestEnvironment();
    let count = 0;
    const fn = Domma.utils.before(3, () => ++count);
    fn();
    fn();
    fn();
    assert(count === 2, 'should invoke func while it\'s called less than n times');
});

test('utils.bind()', () => {
  resetTestEnvironment();
    const greet = function (greeting, punctuation) {
        return greeting + ' ' + this.user + punctuation;
    };
    const object = {'user': 'fred'};
    const bound = Domma.utils.bind(greet, object, 'hi');
    assert(bound('!') === 'hi fred!', 'should create a function that invokes func with the this binding of thisArg and partials');
});

test('utils.curry()', () => {
  resetTestEnvironment();
    const abc = function (a, b, c) {
        return [a, b, c];
    };
    const curried = Domma.utils.curry(abc);
    const result = curried(1)(2)(3);
    assert(result.length === 3 && result[0] === 1 && result[1] === 2 && result[2] === 3, 'should create a curried function');
});

test('utils.curryRight()', () => {
  resetTestEnvironment();
    const abc = function (a, b, c) {
        return [a, b, c];
    };
    const curried = Domma.utils.curryRight(abc);
    const result = curried(3)(2)(1);
    assert(result.length === 3 && result[0] === 1 && result[1] === 2 && result[2] === 3, 'should create a right-curried function');
});

test('utils.defer()', () => {
  resetTestEnvironment();
    return new Promise(resolve => {
        let deferred = false;
        Domma.utils.defer((a) => {
            deferred = a;
            assert(deferred === true, 'should defer the execution of the function');
            resolve();
        }, true);
        assert(deferred === false, 'should not execute the function immediately');
    });
});

test('utils.delay()', () => {
  resetTestEnvironment();
    return new Promise(resolve => {
        let delayed = false;
        Domma.utils.delay((a) => {
            delayed = a;
            assert(delayed === true, 'should delay the execution of the function');
            resolve();
        }, 10, true);
        assert(delayed === false, 'should not execute the function immediately');
    });
});

test('utils.flip()', () => {
  resetTestEnvironment();
    const flipped = Domma.utils.flip(function () {
        return Domma.utils.toArray(arguments);
    });
    const result = flipped('a', 'b', 'c', 'd');
    assert(result.length === 4 && result[0] === 'd' && result[3] === 'a', 'should create a function that invokes func with arguments reversed');
});

test('utils.flow()', () => {
  resetTestEnvironment();
    const add = (a, b) => a + b;
    const square = n => n * n;
    const addAndSquare = Domma.utils.flow(add, square);
    const result = addAndSquare(1, 2);
    assert(result === 9, 'should create a function that returns the result of invoking the given functions from left to right');
});

test('utils.compose()', () => {
  resetTestEnvironment();
    const add5 = n => n + 5;
    const square = n => n * n;
    const squareAndAdd5 = Domma.utils.compose(add5, square);
    const result = squareAndAdd5(2);
    assert(result === 9, 'should create a function that returns the result of invoking the given functions from right to left');
});

test('utils.negate()', () => {
  resetTestEnvironment();
    const isEven = n => n % 2 == 0;
    const isOdd = Domma.utils.negate(isEven);
    assert(isOdd(1) === true, 'should create a function that negates the result of the predicate');
    assert(isOdd(2) === false, 'should create a function that negates the result of the predicate');
});

test('utils.partial()', () => {
  resetTestEnvironment();
    const greet = (greeting, name) => greeting + ' ' + name;
    const sayHelloTo = Domma.utils.partial(greet, 'hello');
    const result = sayHelloTo('fred');
    assert(result === 'hello fred', 'should create a function that invokes func with partials prepended');
});

test('utils.partialRight()', () => {
  resetTestEnvironment();
    const greet = (greeting, name) => greeting + ' ' + name;
    const greetFred = Domma.utils.partialRight(greet, 'fred');
    const result = greetFred('hi');
    assert(result === 'hi fred', 'should create a function that invokes func with partials appended');
});

test('utils.throttle()', () => {
  resetTestEnvironment();
    return new Promise(resolve => {
        let callCount = 0;
        const throttled = Domma.utils.throttle(() => {
            callCount++;
        }, 32);
        throttled();
        throttled();
        assert(callCount === 1, 'should immediately invoke the function');
        setTimeout(() => {
            assert(callCount === 1, 'should not invoke the function again before the timeout');
            resolve();
        }, 16);
    });
});

test('utils.unary()', () => {
  resetTestEnvironment();
    const takesTwo = (a, b) => [a, b];
    const takesOne = Domma.utils.unary(takesTwo);
    const result = takesOne(1, 2);
    assert(result.length === 2 && result[0] === 1 && result[1] === undefined, 'should create a function that accepts up to one argument');
});

test('utils.wrap()', () => {
  resetTestEnvironment();
    const p = Domma.utils.wrap(Domma.utils.escape, function (func, text) {
        return '<p>' + func(text) + '</p>';
    });
    const result = p('fred, barney, & pebbles');
    assert(result === '<p>fred, barney, &amp; pebbles</p>', 'should create a function that provides value to wrapper as its first argument');
});

test('utils.debounce()', () => {
  resetTestEnvironment();
    let count = 0;
    const fn = Domma.utils.debounce(() => count++, 10);
    assert(typeof fn === 'function', 'Should return a function');
    assert(typeof fn.cancel === 'function', 'Should have cancel method');
});

test('utils.memoize()', () => {
  resetTestEnvironment();
    let calls = 0;
    const fn = Domma.utils.memoize(n => { calls++; return n * 2; });
    fn(5);
    fn(5);
    assert(calls === 1, 'Should cache results');
});

test('utils.once()', () => {
  resetTestEnvironment();
    let count = 0;
    const fn = Domma.utils.once(() => ++count);
    fn();
    fn();
    fn();
    assert(count === 1, 'Should only execute once');
});

// Object Utilities
test('utils.assign()', () => {
  resetTestEnvironment();
    function Foo() {
        this.a = 1;
    }

    function Bar() {
        this.c = 3;
    }

    Foo.prototype.b = 2;
    Bar.prototype.d = 4;
    const result = Domma.utils.assign({'a': 0}, new Foo, new Bar);
    assert(result.a === 1 && result.c === 3 && result.b === undefined, 'should assign own enumerable string keyed properties of source objects to the destination object');
});

test('utils.assignIn() and utils.extend()', () => {
  resetTestEnvironment();
    function Foo() {
        this.a = 1;
    }

    function Bar() {
        this.c = 3;
    }

    Foo.prototype.b = 2;
    Bar.prototype.d = 4;
    const result = Domma.utils.assignIn({'a': 0}, new Foo, new Bar);
    assert(result.a === 1 && result.b === 2 && result.c === 3 && result.d === 4, 'should assign own and inherited enumerable string keyed properties of source objects to the destination object');
    const result2 = Domma.utils.extend({'a': 0}, new Foo, new Bar);
    assert(result2.a === 1 && result2.b === 2 && result2.c === 3 && result2.d === 4, 'extend() should be an alias for assignIn()');
});

test('utils.at()', () => {
  resetTestEnvironment();
    const object = {'a': [{'b': {'c': 3}}, 4]};
    const result = Domma.utils.at(object, ['a[0].b.c', 'a[1]']);
    assert(result.length === 2 && result[0] === 3 && result[1] === 4, 'should create an array of values corresponding to paths of object');
});

test('utils.clone()', () => {
  resetTestEnvironment();
    const objects = [{'a': 1}, {'b': 2}];
    const shallow = Domma.utils.clone(objects);
    assert(shallow !== objects && shallow[0] === objects[0], 'should create a shallow clone');
});

test('utils.defaults()', () => {
  resetTestEnvironment();
    const result = Domma.utils.defaults({'a': 1}, {'b': 2}, {'a': 3});
    assert(result.a === 1 && result.b === 2, 'should assign source properties if missing on the destination object');
});

test('utils.defaultsDeep()', () => {
  resetTestEnvironment();
    const result = Domma.utils.defaultsDeep({'a': {'b': 2}}, {'a': {'b': 1, 'c': 3}});
    assert(result.a.b === 2 && result.a.c === 3, 'should recursively assign default properties');
});

test('utils.entries() and utils.toPairs()', () => {
  resetTestEnvironment();
    function Foo() {
        this.a = 1;
        this.b = 2;
    }

    const result = Domma.utils.entries(new Foo());
    assert(result.length === 2 && result[0][0] === 'a' && result[0][1] === 1, 'should create an array of own enumerable string keyed-value pairs');
    const result2 = Domma.utils.toPairs(new Foo());
    assert(result2.length === 2 && result2[0][0] === 'a' && result2[0][1] === 1, 'toPairs() should be an alias for entries()');
});

test('utils.findKey()', () => {
  resetTestEnvironment();
    const users = {
        'barney': {'age': 36, 'active': true},
        'fred': {'age': 40, 'active': false},
        'pebbles': {'age': 1, 'active': true}
    };
    const result = Domma.utils.findKey(users, o => o.age < 40);
    assert(result === 'barney', 'should return the key of the first element predicate returns truthy for');
});

test('utils.findLastKey()', () => {
  resetTestEnvironment();
    const users = {
        'barney': {'age': 36, 'active': true},
        'fred': {'age': 40, 'active': false},
        'pebbles': {'age': 1, 'active': true}
    };
    const result = Domma.utils.findLastKey(users, o => o.age < 40);
    assert(result === 'pebbles', 'should return the key of the last element predicate returns truthy for');
});

test('utils.forIn()', () => {
  resetTestEnvironment();
    function Foo() {
        this.a = 1;
    }

    Foo.prototype.b = 2;
    const result = [];
    Domma.utils.forIn(new Foo, (value, key) => {
        result.push(key);
    });
    assert(result.length === 2 && result.includes('a') && result.includes('b'), 'should iterate over own and inherited enumerable string keyed properties of an object');
});

test('utils.forOwn()', () => {
  resetTestEnvironment();
    function Foo() {
        this.a = 1;
    }

    Foo.prototype.b = 2;
    const result = [];
    Domma.utils.forOwn(new Foo, (value, key) => {
        result.push(key);
    });
    assert(result.length === 1 && result[0] === 'a', 'should iterate over own enumerable string keyed properties of an object');
});

test('utils.invert()', () => {
  resetTestEnvironment();
    const object = {'a': 1, 'b': 2, 'c': 1};
    const result = Domma.utils.invert(object);
    assert(result[1] === 'c' && result[2] === 'b', 'should create an object composed of the inverted keys and values of object');
});

test('utils.invertBy()', () => {
  resetTestEnvironment();
    const object = {'a': 1, 'b': 2, 'c': 1};
    const result = Domma.utils.invertBy(object);
    assert(result[1].length === 2 && result[1].includes('a') && result[1].includes('c'), 'should create an object composed of the inverted keys and values of object');
});

test('utils.keys()', () => {
  resetTestEnvironment();
    function Foo() {
        this.a = 1;
        this.b = 2;
    }

    Foo.prototype.c = 3;
    const result = Domma.utils.keys(new Foo);
    assert(result.length === 2 && result.includes('a') && result.includes('b'), 'should create an array of the own enumerable property names of object');
});

test('utils.keysIn()', () => {
  resetTestEnvironment();
    function Foo() {
        this.a = 1;
        this.b = 2;
    }

    Foo.prototype.c = 3;
    const result = Domma.utils.keysIn(new Foo);
    assert(result.length === 3 && result.includes('a') && result.includes('b') && result.includes('c'), 'should create an array of own and inherited enumerable property names');
});

test('utils.mapKeys()', () => {
  resetTestEnvironment();
    const result = Domma.utils.mapKeys({'a': 1, 'b': 2}, (value, key) => key + value);
    assert(result.a1 === 1 && result.b2 === 2, 'should create an object with the same values as object and keys generated by running each own enumerable property through iteratee');
});

test('utils.mapValues()', () => {
  resetTestEnvironment();
    const users = {
        'fred': {'user': 'fred', 'age': 40},
        'pebbles': {'user': 'pebbles', 'age': 1}
    };
    const result = Domma.utils.mapValues(users, o => o.age);
    assert(result.fred === 40 && result.pebbles === 1, 'should create an object with the same keys as object and values generated by running each own enumerable property through iteratee');
});

test('utils.omitBy()', () => {
  resetTestEnvironment();
    const object = {'a': 1, 'b': '2', 'c': 3};
    const result = Domma.utils.omitBy(object, Domma.utils.isNumber);
    assert(Object.keys(result).length === 1 && result.b === '2', 'should create an object composed of the properties predicate does not return truthy for');
});

test('utils.pickBy()', () => {
  resetTestEnvironment();
    const object = {'a': 1, 'b': '2', 'c': 3};
    const result = Domma.utils.pickBy(object, Domma.utils.isNumber);
    assert(Object.keys(result).length === 2 && result.a === 1 && result.c === 3, 'should create an object composed of the properties predicate returns truthy for');
});

test('utils.unset()', () => {
  resetTestEnvironment();
    const object = {'a': [{'b': {'c': 7}}]};
    Domma.utils.unset(object, 'a[0].b.c');
    assert(object.a[0].b.c === undefined, 'should unset the value at path of object');
});

test('utils.setIfUndefined()', () => {
  resetTestEnvironment();
    const object = {'a': [{'b': {'c': 3}}]};
    Domma.utils.setIfUndefined(object, 'a[0].b.d', 4);
    assert(object.a[0].b.d === 4, 'should set the value at path of object if the resolved value is undefined');
    Domma.utils.setIfUndefined(object, 'a[0].b.c', 5);
    assert(object.a[0].b.c === 3, 'should not set the value at path of object if the resolved value is not undefined');
});

test('utils.values()', () => {
  resetTestEnvironment();
    function Foo() {
        this.a = 1;
        this.b = 2;
    }

    Foo.prototype.c = 3;
    const result = Domma.utils.values(new Foo());
    assert(result.length === 2 && result.includes(1) && result.includes(2), 'should create an array of own enumerable string keyed property values of object');
});

test('utils.valuesIn()', () => {
  resetTestEnvironment();
    function Foo() {
        this.a = 1;
        this.b = 2;
    }

    Foo.prototype.c = 3;
    const result = Domma.utils.valuesIn(new Foo());
    assert(result.length === 3 && result.includes(1) && result.includes(2) && result.includes(3), 'should create an array of own and inherited enumerable property values');
});

test('utils.get()', () => {
  resetTestEnvironment();
    const obj = { a: { b: { c: 3 } } };
    assert(Domma.utils.get(obj, 'a.b.c') === 3, 'Should get nested value');
    assert(Domma.utils.get(obj, 'a.b.d', 'default') === 'default', 'Should return default');
});

test('utils.set()', () => {
  resetTestEnvironment();
    const obj = {};
    Domma.utils.set(obj, 'a.b.c', 1);
    assert(obj.a.b.c === 1, 'Should set nested value');
});

test('utils.has()', () => {
  resetTestEnvironment();
    const obj = { a: { b: 2 } };
    assert(Domma.utils.has(obj, 'a.b') === true, 'Should find existing path');
    assert(Domma.utils.has(obj, 'a.c') === false, 'Should not find missing path');
});

test('utils.pick()', () => {
  resetTestEnvironment();
    const result = Domma.utils.pick({ a: 1, b: 2, c: 3 }, 'a', 'c');
    assert(result.a === 1 && result.c === 3 && result.b === undefined, 'Should pick properties');
});

test('utils.omit()', () => {
  resetTestEnvironment();
    const result = Domma.utils.omit({ a: 1, b: 2, c: 3 }, 'b');
    assert(result.a === 1 && result.c === 3 && result.b === undefined, 'Should omit properties');
});

test('utils.cloneDeep()', () => {
  resetTestEnvironment();
    const obj = { a: { b: 2 } };
    const clone = Domma.utils.cloneDeep(obj);
    clone.a.b = 3;
    assert(obj.a.b === 2, 'Should create deep clone');
});

// Lang Utilities
test('utils.isBoolean()', () => {
  resetTestEnvironment();
    assert(Domma.utils.isBoolean(false) === true, 'should return true for a boolean primitive');
    assert(Domma.utils.isBoolean(null) === false, 'should return false for null');
});

test('utils.isDate()', () => {
  resetTestEnvironment();
    assert(Domma.utils.isDate(new Date()) === true, 'should return true for a date object');
    assert(Domma.utils.isDate('Mon April 23 2012') === false, 'should return false for a string');
});

test('utils.isMatch()', () => {
  resetTestEnvironment();
    const object = {'a': 1, 'b': 2};
    assert(Domma.utils.isMatch(object, {'b': 2}) === true, 'should perform a partial deep comparison between two objects');
    assert(Domma.utils.isMatch(object, {'b': 1}) === false, 'should return false if the objects do not match');
});

test('utils.isFinite()', () => {
  resetTestEnvironment();
    assert(Domma.utils.isFinite(3) === true, 'should return true for a finite number');
    assert(Domma.utils.isFinite(Number.MIN_VALUE) === true, 'should return true for a very small number');
    assert(Domma.utils.isFinite(Infinity) === false, 'should return false for infinity');
});

test('utils.isFunction()', () => {
  resetTestEnvironment();
    assert(Domma.utils.isFunction(Domma.utils.isFunction) === true, 'should return true for a function');
    assert(Domma.utils.isFunction(/abc/) === false, 'should return false for a regex');
});

test('utils.isInteger()', () => {
  resetTestEnvironment();
    assert(Domma.utils.isInteger(3) === true, 'should return true for an integer');
    assert(Domma.utils.isInteger(Number.MIN_VALUE) === false, 'should return false for a float');
});

test('utils.isNaN()', () => {
  resetTestEnvironment();
    assert(Domma.utils.isNaN(NaN) === true, 'should return true for NaN');
    assert(Domma.utils.isNaN(undefined) === false, 'should return false for undefined');
});

test('utils.isNil()', () => {
  resetTestEnvironment();
    assert(Domma.utils.isNil(null) === true, 'should return true for null');
    assert(Domma.utils.isNil(undefined) === true, 'should return true for undefined');
    assert(Domma.utils.isNil(NaN) === false, 'should return false for NaN');
});

test('utils.isNull()', () => {
  resetTestEnvironment();
    assert(Domma.utils.isNull(null) === true, 'should return true for null');
    assert(Domma.utils.isNull(undefined) === false, 'should return false for undefined');
});

test('utils.isNumber()', () => {
  resetTestEnvironment();
    assert(Domma.utils.isNumber(3) === true, 'should return true for a number primitive');
    assert(Domma.utils.isNumber(Number.MIN_VALUE) === true, 'should return true for a number object');
    assert(Domma.utils.isNumber('3') === false, 'should return false for a string');
});

test('utils.isObject()', () => {
  resetTestEnvironment();
    assert(Domma.utils.isObject({}) === true, 'should return true for an object');
    assert(Domma.utils.isObject([1, 2, 3]) === true, 'should return true for an array');
    assert(Domma.utils.isObject(null) === false, 'should return false for null');
});

test('utils.isPlainObject()', () => {
  resetTestEnvironment();
    function Foo() {
        this.a = 1;
    }

    assert(Domma.utils.isPlainObject({}) === true, 'should return true for a plain object');
    assert(Domma.utils.isPlainObject(new Foo) === false, 'should return false for a non-plain object');
});

test('utils.isRegExp()', () => {
  resetTestEnvironment();
    assert(Domma.utils.isRegExp(/abc/) === true, 'should return true for a regex');
    assert(Domma.utils.isRegExp('/abc/') === false, 'should return false for a string');
});

test('utils.isString()', () => {
  resetTestEnvironment();
    assert(Domma.utils.isString('abc') === true, 'should return true for a string primitive');
    assert(Domma.utils.isString(new String('abc')) === true, 'should return true for a string object');
    assert(Domma.utils.isString(1) === false, 'should return false for a number');
});

test('utils.isSymbol()', () => {
  resetTestEnvironment();
    assert(Domma.utils.isSymbol(Symbol.iterator) === true, 'should return true for a symbol');
    assert(Domma.utils.isSymbol('abc') === false, 'should return false for a string');
});

test('utils.isUndefined()', () => {
  resetTestEnvironment();
    assert(Domma.utils.isUndefined(undefined) === true, 'should return true for undefined');
    assert(Domma.utils.isUndefined(null) === false, 'should return false for null');
});

test('utils.isArray()', () => {
  resetTestEnvironment();
    assert(Domma.utils.isArray([]) === true, 'Should detect array');
    assert(Domma.utils.isArray({}) === false, 'Should not detect object as array');
});

test('utils.isEmpty()', () => {
  resetTestEnvironment();
    assert(Domma.utils.isEmpty([]) === true, 'Empty array should be empty');
    assert(Domma.utils.isEmpty({}) === true, 'Empty object should be empty');
    assert(Domma.utils.isEmpty([1]) === false, 'Non-empty array should not be empty');
});

test('utils.isEqual()', () => {
  resetTestEnvironment();
    assert(Domma.utils.isEqual({ a: 1 }, { a: 1 }) === true, 'Should compare equal objects');
    assert(Domma.utils.isEqual([1, 2], [1, 2]) === true, 'Should compare equal arrays');
    assert(Domma.utils.isEqual({ a: 1 }, { a: 2 }) === false, 'Should detect differences');
});

// Type Conversion Utilities
test('utils.parseInt()', () => {
  resetTestEnvironment();
    assert(Domma.utils.parseInt('08') === 8, 'should convert a string to an integer');
    assert(Domma.utils.parseInt('0x10') === 16, 'should convert a hex string to an integer');
});

test('utils.toNumber()', () => {
  resetTestEnvironment();
    assert(Domma.utils.toNumber('3.2') === 3.2, 'should convert a string to a number');
    assert(Domma.utils.toNumber(Number.MIN_VALUE) === 5e-324, 'should handle number objects');
    assert(Domma.utils.isNaN(Domma.utils.toNumber('invalid')) === true, 'should return NaN for invalid strings');
});

test('utils.toInteger()', () => {
  resetTestEnvironment();
    assert(Domma.utils.toInteger(3.2) === 3, 'should convert a float to an integer');
    assert(Domma.utils.toInteger(Number.MIN_VALUE) === 0, 'should convert a very small number to 0');
    assert(Domma.utils.toInteger(Infinity) === Infinity, 'should handle infinity');
});

test('utils.toFinite()', () => {
  resetTestEnvironment();
    assert(Domma.utils.toFinite(3.2) === 3.2, 'should return a finite number');
    assert(Domma.utils.toFinite(Number.MIN_VALUE) === 5e-324, 'should handle very small numbers');
    assert(Domma.utils.toFinite(Infinity) === 1.7976931348623157e+308, 'should handle infinity');
});

test('utils.toSafeInteger()', () => {
  resetTestEnvironment();
    assert(Domma.utils.toSafeInteger(3.2) === 3, 'should convert a float to a safe integer');
    assert(Domma.utils.toSafeInteger(Number.MAX_SAFE_INTEGER + 1) === Number.MAX_SAFE_INTEGER, 'should cap the number at MAX_SAFE_INTEGER');
});

test('utils.toString()', () => {
  resetTestEnvironment();
    assert(Domma.utils.toString(null) === '', 'should convert null to an empty string');
    assert(Domma.utils.toString(-0) === '-0', 'should preserve the sign of -0');
    assert(Domma.utils.toString([1, 2, 3]) === '1,2,3', 'should convert an array to a string');
});

test('utils.toArray()', () => {
  resetTestEnvironment();
    assert(Domma.utils.toArray({'a': 1, 'b': 2}).length === 2, 'should convert an object to an array');
    assert(Domma.utils.toArray('abc').length === 3, 'should convert a string to an array');
});

test('utils.castArray()', () => {
  resetTestEnvironment();
    assert(Domma.utils.castArray(1).length === 1, 'should wrap a non-array value in an array');
    assert(Domma.utils.castArray([1, 2, 3]).length === 3, 'should return the same array if the value is already an array');
});

test('utils.toLength()', () => {
  resetTestEnvironment();
    assert(Domma.utils.toLength(3.2) === 3, 'should convert a float to a length');
    assert(Domma.utils.toLength(Number.MAX_VALUE) === 4294967295, 'should cap the length at MAX_ARRAY_LENGTH');
});

test('utils.toPlainObject()', () => {
  resetTestEnvironment();
    function Foo() {
        this.a = 1;
    }

    Foo.prototype.b = 2;
    const result = Domma.utils.toPlainObject(new Foo);
    assert(result.a === 1 && result.b === 2, 'should convert a value to a plain object');
});

// Math Utilities
test('utils.add()', () => {
  resetTestEnvironment();
    assert(Domma.utils.add(6, 4) === 10, 'should add two numbers');
});

test('utils.ceil()', () => {
  resetTestEnvironment();
    assert(Domma.utils.ceil(4.006) === 5, 'should compute number rounded up to precision');
    assert(Domma.utils.ceil(6.004, 2) === 6.01, 'should compute number rounded up to precision');
});

test('utils.divide()', () => {
  resetTestEnvironment();
    assert(Domma.utils.divide(6, 4) === 1.5, 'should divide two numbers');
});

test('utils.floor()', () => {
  resetTestEnvironment();
    assert(Domma.utils.floor(4.006) === 4, 'should compute number rounded down to precision');
    assert(Domma.utils.floor(0.046, 2) === 0.04, 'should compute number rounded down to precision');
});

test('utils.max()', () => {
  resetTestEnvironment();
    const array = [4, 2, 8, 6];
    assert(Domma.utils.max(array) === 8, 'should compute the maximum value of array');
});

test('utils.maxBy()', () => {
  resetTestEnvironment();
    const objects = [{'n': 1}, {'n': 2}];
    assert(Domma.utils.maxBy(objects, o => o.n).n === 2, 'should compute the maximum value of array with iteratee');
});

test('utils.meanBy()', () => {
  resetTestEnvironment();
    const objects = [{'n': 4}, {'n': 2}, {'n': 8}, {'n': 6}];
    assert(Domma.utils.meanBy(objects, o => o.n) === 5, 'should compute the mean using iteratee');
});

test('utils.min()', () => {
  resetTestEnvironment();
    const array = [4, 2, 8, 6];
    assert(Domma.utils.min(array) === 2, 'should compute the minimum value of array');
});

test('utils.minBy()', () => {
  resetTestEnvironment();
    const objects = [{'n': 1}, {'n': 2}];
    assert(Domma.utils.minBy(objects, o => o.n).n === 1, 'should compute the minimum value of array with iteratee');
});

test('utils.multiply()', () => {
  resetTestEnvironment();
    assert(Domma.utils.multiply(6, 4) === 24, 'should multiply two numbers');
});

test('utils.round()', () => {
  resetTestEnvironment();
    assert(Domma.utils.round(4.006) === 4, 'should compute number rounded to precision');
    assert(Domma.utils.round(4.006, 2) === 4.01, 'should compute number rounded to precision');
});

test('utils.subtract()', () => {
  resetTestEnvironment();
    assert(Domma.utils.subtract(6, 4) === 2, 'should subtract two numbers');
});

test('utils.sumBy()', () => {
  resetTestEnvironment();
    const objects = [{'n': 4}, {'n': 2}, {'n': 8}, {'n': 6}];
    assert(Domma.utils.sumBy(objects, o => o.n) === 20, 'should compute the sum using iteratee');
});

test('utils.sum()', () => {
  resetTestEnvironment();
    assert(Domma.utils.sum([1, 2, 3, 4]) === 10, 'Should sum array');
});

test('utils.mean()', () => {
  resetTestEnvironment();
    assert(Domma.utils.mean([1, 2, 3, 4, 5]) === 3, 'Should compute mean');
});

test('utils.clamp()', () => {
  resetTestEnvironment();
    assert(Domma.utils.clamp(10, 0, 5) === 5, 'Should clamp to upper bound');
    assert(Domma.utils.clamp(-5, 0, 5) === 0, 'Should clamp to lower bound');
});

// Number Utilities
test('utils.inRange()', () => {
  resetTestEnvironment();
    assert(Domma.utils.inRange(3, 2, 4) === true, 'should return true if the number is in range');
    assert(Domma.utils.inRange(4, 8) === true, 'should return true if the number is in range');
    assert(Domma.utils.inRange(4, 2) === false, 'should return false if the number is not in range');
    assert(Domma.utils.inRange(2, 2) === false, 'should return false if the number is not in range');
});

test('utils.random()', () => {
  resetTestEnvironment();
    const result = Domma.utils.random(5);
    assert(result >= 0 && result <= 5, 'should return a random number between 0 and 5');
    const result2 = Domma.utils.random(5, 10);
    assert(result2 >= 5 && result2 <= 10, 'should return a random number between 5 and 10');
    const result3 = Domma.utils.random(5, true);
    assert(result3 >= 0 && result3 <= 5 && result3 % 1 !== 0, 'should return a random floating-point number');
});

// String Utilities
test('utils.endsWith()', () => {
  resetTestEnvironment();
    assert(Domma.utils.endsWith('abc', 'c') === true, 'should return true if the string ends with the target');
    assert(Domma.utils.endsWith('abc', 'b') === false, 'should return false if the string does not end with the target');
    assert(Domma.utils.endsWith('abc', 'b', 2) === true, 'should return true if the string ends with the target at the given position');
});

test('utils.escape()', () => {
  resetTestEnvironment();
    assert(Domma.utils.escape('fred, barney, & pebbles') === 'fred, barney, &amp; pebbles', 'should convert characters to HTML entities');
});

test('utils.lowerCase()', () => {
  resetTestEnvironment();
    assert(Domma.utils.lowerCase('--Foo-Bar--') === 'foo bar', 'should convert a string to lower case');
    assert(Domma.utils.lowerCase('fooBar') === 'foo bar', 'should convert a string to lower case');
    assert(Domma.utils.lowerCase('__FOO_BAR__') === 'foo bar', 'should convert a string to lower case');
});

test('utils.lowerFirst()', () => {
  resetTestEnvironment();
    assert(Domma.utils.lowerFirst('Fred') === 'fred', 'should convert the first character of a string to lower case');
    assert(Domma.utils.lowerFirst('FRED') === 'fRED', 'should convert the first character of a string to lower case');
});

test('utils.pad()', () => {
  resetTestEnvironment();
    assert(Domma.utils.pad('abc', 8) === '  abc   ', 'should pad a string on the left and right sides if it is shorter than length');
    assert(Domma.utils.pad('abc', 8, '_-') === '_-abc_-_', 'should pad a string with the given characters');
});

test('utils.padEnd()', () => {
  resetTestEnvironment();
    assert(Domma.utils.padEnd('abc', 6) === 'abc   ', 'should pad a string on the right side if it is shorter than length');
    assert(Domma.utils.padEnd('abc', 6, '_-') === 'abc_-_', 'should pad a string with the given characters');
});

test('utils.padStart()', () => {
  resetTestEnvironment();
    assert(Domma.utils.padStart('abc', 6) === '   abc', 'should pad a string on the left side if it is shorter than length');
    assert(Domma.utils.padStart('abc', 6, '_-') === '_-_abc', 'should pad a string with the given characters');
});

test('utils.repeat()', () => {
  resetTestEnvironment();
    assert(Domma.utils.repeat('*', 3) === '***', 'should repeat the given string n times');
});

test('utils.replace()', () => {
  resetTestEnvironment();
    assert(Domma.utils.replace('Hi Fred', 'Fred', 'Barney') === 'Hi Barney', 'should replace matches for pattern in string with replacement');
});

test('utils.snakeCase()', () => {
  resetTestEnvironment();
    assert(Domma.utils.snakeCase('Foo Bar') === 'foo_bar', 'should convert a string to snake case');
    assert(Domma.utils.snakeCase('fooBar') === 'foo_bar', 'should convert a string to snake case');
    assert(Domma.utils.snakeCase('--FOO-BAR--') === 'foo_bar', 'should convert a string to snake case');
});

test('utils.split()', () => {
    const result = Domma.utils.split('a-b-c', '-', 2);
    assert(result.length === 2 && result[0] === 'a' && result[1] === 'b', 'should split a string by separator');
});

test('utils.startCase()', () => {
    assert(Domma.utils.startCase('--foo-bar--') === 'Foo Bar', 'should convert a string to start case');
    assert(Domma.utils.startCase('fooBar') === 'Foo Bar', 'should convert a string to start case');
    assert(Domma.utils.startCase('__FOO_BAR__') === 'Foo Bar', 'should convert a string to start case');
});

test('utils.startsWith()', () => {
    assert(Domma.utils.startsWith('abc', 'a') === true, 'should return true if the string starts with the target');
    assert(Domma.utils.startsWith('abc', 'b') === false, 'should return false if the string does not start with the target');
    assert(Domma.utils.startsWith('abc', 'b', 1) === true, 'should return true if the string starts with the target at the given position');
});

test('utils.toLower()', () => {
    assert(Domma.utils.toLower('--Foo-Bar--') === '--foo-bar--', 'should convert a string to lower case');
});

test('utils.toUpper()', () => {
    assert(Domma.utils.toUpper('--foo-bar--') === '--FOO-BAR--', 'should convert a string to upper case');
});

test('utils.trimEnd()', () => {
    assert(Domma.utils.trimEnd('  abc  ') === '  abc', 'should remove trailing whitespace');
    assert(Domma.utils.trimEnd('-_-abc-_-', '_-') === '-_-abc', 'should remove trailing characters');
});

test('utils.trimStart()', () => {
    assert(Domma.utils.trimStart('  abc  ') === 'abc  ', 'should remove leading whitespace');
    assert(Domma.utils.trimStart('-_-abc-_-', '_-') === 'abc-_-', 'should remove leading characters');
});

test('utils.unescape()', () => {
    assert(Domma.utils.unescape('fred, barney, &amp; pebbles') === 'fred, barney, & pebbles', 'should convert HTML entities to their corresponding characters');
});

test('utils.upperCase()', () => {
    assert(Domma.utils.upperCase('--foo-bar--') === 'FOO BAR', 'should convert a string to upper case');
    assert(Domma.utils.upperCase('fooBar') === 'FOO BAR', 'should convert a string to upper case');
    assert(Domma.utils.upperCase('__FOO_BAR__') === 'FOO BAR', 'should convert a string to upper case');
});

test('utils.upperFirst()', () => {
    assert(Domma.utils.upperFirst('fred') === 'Fred', 'should convert the first character of a string to upper case');
    assert(Domma.utils.upperFirst('FRED') === 'FRED', 'should convert the first character of a string to upper case');
});

test('utils.words()', () => {
    assert(Domma.utils.words('fred, barney, & pebbles').length === 3, 'should split a string into an array of its words');
});

test('utils.sprintf() and utils.format()', () => {
    const result = Domma.utils.sprintf('Hello %s, your score is %d', 'John', 95);
    assert(result === 'Hello John, your score is 95', 'sprintf should format a string');
    const result2 = Domma.utils.format('Hello %s, your score is %d', 'John', 95);
    assert(result2 === 'Hello John, your score is 95', 'format should be an alias for sprintf');
});

test('utils.camelCase()', () => {
    assert(Domma.utils.camelCase('foo-bar') === 'fooBar', 'Should convert to camelCase');
});

test('utils.kebabCase()', () => {
    assert(Domma.utils.kebabCase('fooBar') === 'foo-bar', 'Should convert to kebab-case');
});

test('utils.capitalize()', () => {
    assert(Domma.utils.capitalize('hello') === 'Hello', 'Should capitalize string');
});

test('utils.trim()', () => {
    assert(Domma.utils.trim('  hello  ') === 'hello', 'Should trim whitespace');
});

test('utils.truncate()', () => {
    const result = Domma.utils.truncate('hello world', { length: 8 });
    assert(result === 'hello...', 'Should truncate with ellipsis');
});

// Template Engine Utilities
test('utils.template() and utils.render()', () => {
    const compiled = Domma.utils.template('hello {{ user }}!');
    const result = compiled({'user': 'fred'});
    assert(result === 'hello fred!', 'should create a compiled template');

    const result2 = Domma.utils.render('hello {{ user }}!', {'user': 'barney'});
    assert(result2 === 'hello barney!', 'render() should render a template');
});

// Chaining Utilities
test('utils.chain()', () => {
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

    assert(result === 'pebbles is 1', 'should create a chainable wrapper');
});


// Domma DOM Traversal
test('Domma constructor', () => {
    assert(Domma('#test').length === 1, 'should select an element by ID');
    assert(Domma('.child').length === 3, 'should select elements by class');
    assert(Domma('<div>').length === 1, 'should create an element from an HTML string');
});

test('dom.find()', () => {
    const parent = Domma('#parent');
    const children = parent.find('.child');
    assert(children.length === 3, 'should find descendant elements');
    const grandchild = parent.find('#grandchild');
    assert(grandchild.length === 1, 'should find a nested descendant element');
});

test('dom.children()', () => {
    const parent = Domma('#parent');
    const children = parent.children();
    assert(children.length === 3, 'should get immediate children');
    const child2 = parent.children('#child2');
    assert(child2.length === 1, 'should get immediate children filtered by a selector');
});

test('dom.parent()', () => {
    const child1 = Domma('#child1');
    const parent = child1.parent();
    assert(parent.length === 1 && parent.get(0).id === 'parent', 'should get the parent of an element');
});

test('dom.parents()', () => {
    const grandchild = Domma('#grandchild');
    const parents = grandchild.parents();
    assert(parents.length === 5, 'should get all ancestors');
    const parent = grandchild.parents('#parent');
    assert(parent.length === 1 && parent.get(0).id === 'parent', 'should get all ancestors filtered by a selector');
});

test('dom.closest()', () => {
    const grandchild = Domma('#grandchild');
    const closest = grandchild.closest('.child');
    assert(closest.length === 1 && closest.get(0).id === 'child2', 'should get the closest ancestor matching a selector');
});

test('dom.siblings()', () => {
    const child2 = Domma('#child2');
    const siblings = child2.siblings();
    assert(siblings.length === 2, 'should get all siblings');
    const child1 = child2.siblings('#child1');
    assert(child1.length === 1, 'should get all siblings filtered by a selector');
});

test('dom.next()', () => {
    const child1 = Domma('#child1');
    const next = child1.next();
    assert(next.length === 1 && next.get(0).id === 'child2', 'should get the next sibling');
});

test('dom.nextAll()', () => {
    const child1 = Domma('#child1');
    const nextAll = child1.nextAll();
    assert(nextAll.length === 2, 'should get all following siblings');
});

test('dom.prev()', () => {
    const child2 = Domma('#child2');
    const prev = child2.prev();
    assert(prev.length === 1 && prev.get(0).id === 'child1', 'should get the previous sibling');
});

test('dom.prevAll()', () => {
    const child3 = Domma('#child3');
    const prevAll = child3.prevAll();
    assert(prevAll.length === 2, 'should get all preceding siblings');
});

test('dom.first()', () => {
    const children = Domma('.child');
    const first = children.first();
    assert(first.length === 1 && first.get(0).id === 'child1', 'should get the first element in the collection');
});

test('dom.last()', () => {
    const children = Domma('.child');
    const last = children.last();
    assert(last.length === 1 && last.get(0).id === 'child3', 'should get the last element in the collection');
});

test('dom.eq()', () => {
    const children = Domma('.child');
    const eq = children.eq(1);
    assert(eq.length === 1 && eq.get(0).id === 'child2', 'should get the element at the specified index');
});

test('dom.get()', () => {
    const children = Domma('.child');
    const el = children.get(1);
    assert(el.id === 'child2', 'should get the raw element at the specified index');
    const all = children.get();
    assert(all.length === 3, 'should get all raw elements');
});

test('dom.filter()', () => {
    const children = Domma('.child');
    const filtered = children.filter('#child2');
    assert(filtered.length === 1 && filtered.get(0).id === 'child2', 'should filter elements by a selector');
});

test('dom.not()', () => {
    const children = Domma('.child');
    const not = children.not('#child2');
    assert(not.length === 2 && not.get(0).id === 'child1' && not.get(1).id === 'child3', 'should remove elements matching a selector from the collection');
});

test('dom.is()', () => {
    const children = Domma('.child');
    assert(children.is('.child') === true, 'should check if any element matches a selector');
    assert(children.is('#child4') === false, 'should return false if no element matches a selector');
});

test('dom.has()', () => {
    const parent = Domma('#parent');
    const has = parent.has('span');
    assert(has.length === 1, 'should filter elements that have descendants matching a selector');
});

test('dom.add()', () => {
    const child1 = Domma('#child1');
    const added = child1.add('#child2');
    assert(added.length === 2, 'should add elements to the collection');
});

test('dom.contents()', () => {
    const child2 = Domma('#child2');
    const contents = child2.contents();
    assert(contents.length === 1, 'should get children including text nodes');
});

test('dom.toArray()', () => {
    const children = Domma('.child');
    const array = children.toArray();
    assert(Array.isArray(array) && array.length === 3, 'should convert the collection to an array');
});

test('dom.index()', () => {
    const child2 = Domma('#child2');
    assert(child2.index() === 1, 'should get the index of the element in its parent');
    assert(child2.index('#child2') === 0, 'should get the index of the element in a collection');
});

// Domma DOM Content
test('dom.each()', () => {
    let count = 0;
    Domma('.child').each(() => count++);
    assert(count === 3, 'should iterate over each element in the collection');
});

test('dom.html()', () => {
    const el = Domma('#test').html('<span>hello</span>');
    assert(el.get(0).innerHTML === '<span>hello</span>', 'should set the inner HTML of the element');
    assert(el.html() === '<span>hello</span>', 'should get the inner HTML of the first element');
});

test('dom.text()', () => {
    const el = Domma('#test').text('hello');
    assert(el.get(0).textContent === 'hello', 'should set the text content of the element');
    assert(el.text() === 'hello', 'should get the text content of the first element');
});

test('dom.val()', () => {
    const input = Domma('<input type="text" value="hello">').appendTo('body');
    assert(input.val() === 'hello', 'should get the value of a form element');
    input.val('world');
    assert(input.val() === 'world', 'should set the value of a form element');
    input.remove();
});

// Domma DOM Manipulation
test('dom.append()', () => {
    const el = Domma('#test').html('');
    el.append('<span>hello</span>');
    assert(el.get(0).children.length === 1, 'should append content to the element');
});

test('dom.prepend()', () => {
    const el = Domma('#test').html('<span>hello</span>');
    el.prepend('<span>world</span>');
    assert(el.get(0).children.length === 2 && el.get(0).firstChild.textContent === 'world', 'should prepend content to the element');
});

test('dom.after()', () => {
    Domma('#test-container').html('<div id="test"></div>');
    const el = Domma('#test');
    el.after('<span>hello</span>');
    assert(el.get(0).nextSibling.textContent === 'hello', 'should insert content after the element');
});

test('dom.before()', () => {
    Domma('#test-container').html('<div id="test"></div>');
    const el = Domma('#test');
    el.before('<span>hello</span>');
    assert(el.get(0).previousSibling.textContent === 'hello', 'should insert content before the element');
});

test('dom.appendTo()', () => {
    Domma('#test').html('');
    const el = Domma('<span>hello</span>').appendTo('#test');
    assert(Domma('#test').get(0).children.length === 1, 'should append elements to the target');
});

test('dom.prependTo()', () => {
    Domma('#test').html('');
    const el = Domma('<span>hello</span>').prependTo('#test');
    assert(Domma('#test').get(0).children.length === 1, 'should prepend elements to the target');
});

test('dom.insertAfter()', () => {
    Domma('#test-container').html('<div id="test"></div>');
    const el = Domma('<span>hello</span>').insertAfter('#test');
    assert(Domma('#test').get(0).nextSibling.textContent === 'hello', 'should insert elements after the target');
});

test('dom.insertBefore()', () => {
    Domma('#test-container').html('<div id="test"></div>');
    const el = Domma('<span>hello</span>').insertBefore('#test');
    assert(Domma('#test').get(0).previousSibling.textContent === 'hello', 'should insert elements before the target');
    el.remove();
});

test('dom.wrap()', () => {
  Domma('#test').html(''); // Clean up
  Domma('#test').html('<p>hello</p>'); // Setup
    Domma('#test p').wrap('<div class="wrapper"></div>');
    assert(Domma('#test .wrapper').length === 1, 'should wrap each element with the given structure');
    assert(Domma('#test .wrapper p').length === 1, 'should have the original element inside the wrapper');
});

test('dom.wrapAll()', () => {
    Domma('#test').html('<p>hello</p><p>world</p>'); // Clean up and setup
    Domma('#test p').wrapAll('<div class="wrapper"></div>');
    assert(Domma('#test .wrapper').length === 1, 'should wrap all elements together with the given structure');
    assert(Domma('#test .wrapper p').length === 2, 'should have the original elements inside the wrapper');
});

test('dom.wrapInner()', () => {
    Domma('#test').html('<p>hello</p>'); // Clean up and setup
    Domma('#test p').wrapInner('<b></b>');
    assert(Domma('#test p b').length === 1, 'should wrap inner contents of each element');
    assert(Domma('#test p b').get(0).textContent === 'hello', 'should have the original content inside the wrapper');
});

test('dom.unwrap()', () => {
    Domma('#test').html('<div class="wrapper"><p>hello</p></div>'); // Clean up and setup
    Domma('#test p').unwrap();
    assert(Domma('#test .wrapper').length === 0, 'should remove the parent wrapper from each element');
    assert(Domma('#test p').length === 1, 'should keep the original element');
});

test('dom.remove()', () => {
    Domma('#test').html('<p>hello</p>');
    Domma('#test p').remove();
    assert(Domma('#test p').length === 0, 'should remove elements from the DOM');
});

test('dom.detach()', () => {
    Domma('#test').html('<p>hello</p>');
    Domma('#test p').detach();
    assert(Domma('#test p').length === 0, 'should remove elements from the DOM');
});

test('dom.empty()', () => {
    Domma('#test').html('<p>hello</p>');
    Domma('#test').empty();
    assert(Domma('#test').html() === '', 'should remove all children from elements');
});

test('dom.clone()', () => {
    const el = Domma('<p>hello</p>');
    const clone = el.clone();
    assert(clone.text() === 'hello', 'should clone the element');
    assert(clone.get(0) !== el.get(0), 'should be a new element');
});

test('dom.replaceWith()', () => {
    Domma('#test').html('<p>hello</p>'); // Clean up and setup
    Domma('#test p').replaceWith('<b>world</b>');
    assert(Domma('#test p').length === 0, 'should not have the old element');
    assert(Domma('#test b').length === 1, 'should have the new element');
});

test('dom.replaceAll()', () => {
    Domma('#test').html('<p>hello</p>'); // Clean up and setup
    Domma('<b>world</b>').replaceAll('#test p');
    assert(Domma('#test p').length === 0, 'should not have the old element');
    assert(Domma('#test b').length === 1, 'should have the new element');
});

// Domma DOM Attributes
test('dom.attr()', () => {
    const el = Domma('#test').attr('foo', 'bar');
    assert(el.attr('foo') === 'bar', 'should set and get an attribute');
});

// Domma HTTP Utilities
test('http.get()', async () => {
    const result = await Domma.http.get('/api/data');
    assert(result.message === 'Success', 'should make a GET request and return JSON data');
});

test('http.post()', async () => {
    const result = await Domma.http.post('/api/post', {test: 'data'});
    assert(result.received.test === 'data', 'should make a POST request and return JSON data');
});

test('http.request() error handling', async () => {
    let errorCaught = false;
    try {
        await Domma.http.request('GET', '/api/error');
    } catch (e) {
        errorCaught = true;
        assert(e.message === 'HTTP Error: 404', 'should catch HTTP errors');
    }
    assert(errorCaught === true, 'should throw an error for bad responses');
});

// Storage Utilities
test('storage.isAvailable()', () => {
    assert(Domma.storage.isAvailable() === true, 'should confirm that localStorage is available');
});

test('storage.set() and storage.get()', () => {
    Domma.storage.set('foo', 'bar');
    assert(Domma.storage.get('foo') === 'bar', 'should set and get a string value');
    Domma.storage.set('baz', {a: 1});
    assert(Domma.storage.get('baz').a === 1, 'should set and get an object value');
    assert(Domma.storage.get('nonexistent', 'default') === 'default', 'should return the default value for a nonexistent key');
});

test('storage.remove()', () => {
    Domma.storage.set('foo', 'bar');
    Domma.storage.remove('foo');
    assert(Domma.storage.get('foo') === null, 'should remove a value from storage');
});

test('storage.has()', () => {
    Domma.storage.set('foo', 'bar');
    assert(Domma.storage.has('foo') === true, 'should return true for an existing key');
    assert(Domma.storage.has('nonexistent') === false, 'should return false for a nonexistent key');
});

test('storage.clear()', () => {
    Domma.storage.set('foo', 'bar');
    Domma.storage.set('baz', 'qux');
    Domma.storage.clear();
    assert(Domma.storage.keys().length === 0, 'should clear all domma-prefixed keys');
});

test('storage.keys()', () => {
    Domma.storage.set('foo', 'bar');
    Domma.storage.set('baz', 'qux');
    const keys = Domma.storage.keys();
    assert(keys.length === 2 && keys.includes('foo') && keys.includes('baz'), 'should return an array of all domma-prefixed keys');
});

test('storage.size()', () => {
    Domma.storage.set('foo', 'bar');
    assert(Domma.storage.size('foo') > 0, 'should return the size of the stored data for a key');
});

test('storage.totalSize()', () => {
    Domma.storage.set('foo', 'bar');
    Domma.storage.set('baz', 'qux');
    assert(Domma.storage.totalSize() > 0, 'should return the total size of all domma storage');
});

test('storage.getAll()', () => {
    Domma.storage.set('foo', 'bar');
    Domma.storage.set('baz', 'qux');
    const all = Domma.storage.getAll();
    assert(all.foo === 'bar' && all.baz === 'qux', 'should return all stored data as an object');
});

test('storage.setAll()', () => {
    Domma.storage.setAll({'foo': 'bar', 'baz': 'qux'});
    assert(Domma.storage.get('foo') === 'bar' && Domma.storage.get('baz') === 'qux', 'should set multiple values at once');
});

// Domma DOM Events
test('dom.on() and dom.off()', () => {
    const el = Domma('#test');
    let count = 0;
    const handler = () => count++;
    el.on('click', handler);
    el.get(0).click();
    assert(count === 1, 'should attach an event handler');
    el.off('click', handler);
    el.get(0).click();
    assert(count === 1, 'should detach an event handler');
});

test('dom.one()', () => {
    const el = Domma('#test');
    let count = 0;
    el.one('click', () => count++);
    el.get(0).click();
    el.get(0).click();
    assert(count === 1, 'should attach an event handler that executes only once');
});

test('dom.trigger()', () => {
    const el = Domma('#test');
    let triggered = false;
    el.on('custom-event', () => triggered = true);
    el.trigger('custom-event');
    assert(triggered === true, 'should trigger a custom event');
});

test('dom.triggerNative()', () => {
    const el = Domma('#test');
    let triggered = false;
    el.on('click', () => triggered = true);
    el.triggerNative('click');
    assert(triggered === true, 'should trigger a native event');
});

test('dom.click()', () => {
    Domma('#test').html(''); // Clean up and setup
    const el = Domma('#test');
    let count = 0;
    el.on('click', () => count++);
    el.click();
    assert(count === 1, 'should trigger a click event');
});

// Run Tests
async function run() {
    console.log(`Running ${tests.length} tests...`);
    let passed = 0;
    for (const t of tests) {
        try {
            await t.fn();
            console.log(`✅ ${t.name}`);
            passed++;
        } catch (e) {
            console.error(`❌ ${t.name}: ${e.message}`);
        }
    }
    console.log(`\nPassed: ${passed}/${tests.length}`);
    if (passed !== tests.length) process.exit(1);
}

run();