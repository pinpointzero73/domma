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
