import Domma from '../src/index.js';
import { JSDOM } from 'jsdom';

// Setup JSDOM environment
const dom = new JSDOM(`<!DOCTYPE html><body><div id="test"></div></body>`);
global.window = dom.window;
global.document = dom.window.document;
global.HTMLElement = dom.window.HTMLElement;
global.NodeList = dom.window.NodeList;

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
    const el = Domma('#test');
    assert(el.elements.length === 1, 'Should select one element');
});

test('Domma text()', () => {
    const el = Domma('#test');
    el.text('Hello');
    assert(document.getElementById('test').textContent === 'Hello', 'Should set text content');
    assert(el.text() === 'Hello', 'Should get text content');
});

test('Domma css()', () => {
    const el = Domma('#test');
    el.css('color', 'red');
    assert(document.getElementById('test').style.color === 'red', 'Should set CSS property');
});

test('Domma addClass()', () => {
    const el = Domma('#test');
    el.addClass('foo');
    assert(document.getElementById('test').classList.contains('foo'), 'Should add class');
});

test('Domma utils.merge()', () => {
    const a = { x: 1 };
    const b = { y: 2 };
    const c = Domma.utils.merge({}, a, b);
    assert(c.x === 1 && c.y === 2, 'Should merge objects');
});

// Array Utilities
test('utils.chunk()', () => {
    const result = Domma.utils.chunk([1, 2, 3, 4, 5], 2);
    assert(result.length === 3, 'Should create 3 chunks');
    assert(result[0].length === 2, 'First chunk should have 2 items');
});

test('utils.compact()', () => {
    const result = Domma.utils.compact([0, 1, false, 2, '', 3, null]);
    assert(result.length === 3, 'Should remove falsy values');
});

test('utils.difference()', () => {
    const result = Domma.utils.difference([1, 2, 3], [2, 3, 4]);
    assert(result.length === 1 && result[0] === 1, 'Should return difference');
});

test('utils.flatten()', () => {
    const result = Domma.utils.flatten([1, [2, [3, [4]]]]);
    assert(result.length === 3, 'Should flatten one level');
});

test('utils.flattenDeep()', () => {
    const result = Domma.utils.flattenDeep([1, [2, [3, [4]]]]);
    assert(result.length === 4, 'Should flatten all levels');
});

test('utils.uniq()', () => {
    const result = Domma.utils.uniq([1, 2, 2, 3, 3, 3]);
    assert(result.length === 3, 'Should remove duplicates');
});

test('utils.intersection()', () => {
    const result = Domma.utils.intersection([1, 2, 3], [2, 3, 4]);
    assert(result.length === 2, 'Should return common elements');
});

// Collection Utilities
test('utils.filter()', () => {
    const result = Domma.utils.filter([1, 2, 3, 4], n => n > 2);
    assert(result.length === 2, 'Should filter elements');
});

test('utils.find()', () => {
    const result = Domma.utils.find([1, 2, 3], n => n > 1);
    assert(result === 2, 'Should find first matching element');
});

test('utils.groupBy()', () => {
    const result = Domma.utils.groupBy([1.2, 2.1, 2.3], Math.floor);
    assert(result[1].length === 1 && result[2].length === 2, 'Should group by key');
});

test('utils.map()', () => {
    const result = Domma.utils.map([1, 2, 3], n => n * 2);
    assert(result[0] === 2 && result[2] === 6, 'Should map elements');
});

test('utils.reduce()', () => {
    const result = Domma.utils.reduce([1, 2, 3], (sum, n) => sum + n, 0);
    assert(result === 6, 'Should reduce to sum');
});

test('utils.sortBy()', () => {
    const result = Domma.utils.sortBy([{ n: 3 }, { n: 1 }, { n: 2 }], 'n');
    assert(result[0].n === 1, 'Should sort by property');
});

// Function Utilities
test('utils.debounce()', () => {
    let count = 0;
    const fn = Domma.utils.debounce(() => count++, 10);
    assert(typeof fn === 'function', 'Should return a function');
    assert(typeof fn.cancel === 'function', 'Should have cancel method');
});

test('utils.memoize()', () => {
    let calls = 0;
    const fn = Domma.utils.memoize(n => { calls++; return n * 2; });
    fn(5);
    fn(5);
    assert(calls === 1, 'Should cache results');
});

test('utils.once()', () => {
    let count = 0;
    const fn = Domma.utils.once(() => ++count);
    fn();
    fn();
    fn();
    assert(count === 1, 'Should only execute once');
});

// Object Utilities
test('utils.get()', () => {
    const obj = { a: { b: { c: 3 } } };
    assert(Domma.utils.get(obj, 'a.b.c') === 3, 'Should get nested value');
    assert(Domma.utils.get(obj, 'a.b.d', 'default') === 'default', 'Should return default');
});

test('utils.set()', () => {
    const obj = {};
    Domma.utils.set(obj, 'a.b.c', 1);
    assert(obj.a.b.c === 1, 'Should set nested value');
});

test('utils.has()', () => {
    const obj = { a: { b: 2 } };
    assert(Domma.utils.has(obj, 'a.b') === true, 'Should find existing path');
    assert(Domma.utils.has(obj, 'a.c') === false, 'Should not find missing path');
});

test('utils.pick()', () => {
    const result = Domma.utils.pick({ a: 1, b: 2, c: 3 }, 'a', 'c');
    assert(result.a === 1 && result.c === 3 && result.b === undefined, 'Should pick properties');
});

test('utils.omit()', () => {
    const result = Domma.utils.omit({ a: 1, b: 2, c: 3 }, 'b');
    assert(result.a === 1 && result.c === 3 && result.b === undefined, 'Should omit properties');
});

test('utils.cloneDeep()', () => {
    const obj = { a: { b: 2 } };
    const clone = Domma.utils.cloneDeep(obj);
    clone.a.b = 3;
    assert(obj.a.b === 2, 'Should create deep clone');
});

// Lang Utilities
test('utils.isArray()', () => {
    assert(Domma.utils.isArray([]) === true, 'Should detect array');
    assert(Domma.utils.isArray({}) === false, 'Should not detect object as array');
});

test('utils.isEmpty()', () => {
    assert(Domma.utils.isEmpty([]) === true, 'Empty array should be empty');
    assert(Domma.utils.isEmpty({}) === true, 'Empty object should be empty');
    assert(Domma.utils.isEmpty([1]) === false, 'Non-empty array should not be empty');
});

test('utils.isEqual()', () => {
    assert(Domma.utils.isEqual({ a: 1 }, { a: 1 }) === true, 'Should compare equal objects');
    assert(Domma.utils.isEqual([1, 2], [1, 2]) === true, 'Should compare equal arrays');
    assert(Domma.utils.isEqual({ a: 1 }, { a: 2 }) === false, 'Should detect differences');
});

// Math Utilities
test('utils.sum()', () => {
    assert(Domma.utils.sum([1, 2, 3, 4]) === 10, 'Should sum array');
});

test('utils.mean()', () => {
    assert(Domma.utils.mean([1, 2, 3, 4, 5]) === 3, 'Should compute mean');
});

test('utils.clamp()', () => {
    assert(Domma.utils.clamp(10, 0, 5) === 5, 'Should clamp to upper bound');
    assert(Domma.utils.clamp(-5, 0, 5) === 0, 'Should clamp to lower bound');
});

// String Utilities
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
