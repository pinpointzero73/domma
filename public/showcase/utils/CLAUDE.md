# CLAUDE.md - Utils Module Showcase

This file provides guidance for working with Utils module showcase examples.

## Utils Module Overview

Accessed via `Domma.utils` or `_` - provides 120+ Lodash-compatible utilities for arrays, collections, functions,
objects, and more.

## Utility Categories

### Array (30+ utilities)

`chunk()`, `compact()`, `difference()`, `flatten()`, `flattenDeep()`, `uniq()`, `uniqBy()`, `zip()`,
`intersection()`, `union()`, `without()`, `pull()`, `remove()`, `take()`, `drop()`, `slice()`, `reverse()`,
`fill()`, `findIndex()`, `findLastIndex()`, `indexOf()`, `lastIndexOf()`, `initial()`, `tail()`, `head()`, `last()`,
`nth()`, `concat()`, `join()`, `sortedIndex()`, `sortedIndexBy()`

**Example patterns:**

```javascript
// Chunking arrays
_.chunk([1, 2, 3, 4, 5], 2); // [[1, 2], [3, 4], [5]]

// Removing falsy values
_.compact([0, 1, false, 2, '', 3]); // [1, 2, 3]

// Finding differences
_.difference([2, 1], [2, 3]); // [1]
_.intersection([2, 1], [2, 3]); // [2]
_.union([2], [1, 2]); // [2, 1]

// Flattening
_.flatten([1, [2, [3, [4]], 5]]); // [1, 2, [3, [4]], 5]
_.flattenDeep([1, [2, [3, [4]], 5]]); // [1, 2, 3, 4, 5]

// Unique values
_.uniq([2, 1, 2]); // [2, 1]
_.uniqBy([{x:1}, {x:2}, {x:1}], 'x'); // [{x:1}, {x:2}]
```

### Collection (20+ utilities)

`each()`, `filter()`, `find()`, `groupBy()`, `keyBy()`, `map()`, `orderBy()`, `sortBy()`,
`reduce()`, `partition()`, `some()`, `every()`, `includes()`, `sample()`, `shuffle()`, `size()`,
`countBy()`, `reject()`, `invokeMap()`, `pluck()`

**Example patterns:**

```javascript
// Iteration
_.each([1, 2, 3], (n) => console.log(n));
_.each({a: 1, b: 2}, (value, key) => console.log(key, value));

// Filtering
_.filter([1, 2, 3, 4], n => n % 2 === 0); // [2, 4]
_.reject([1, 2, 3, 4], n => n % 2 === 0); // [1, 3]

// Finding
_.find([1, 2, 3, 4], n => n > 2); // 3

// Grouping
_.groupBy([6.1, 4.2, 6.3], Math.floor); // {4: [4.2], 6: [6.1, 6.3]}
_.keyBy([{id: 1}, {id: 2}], 'id'); // {1: {id: 1}, 2: {id: 2}}

// Mapping
_.map([1, 2, 3], n => n * 2); // [2, 4, 6]

// Sorting
_.sortBy([3, 1, 2]); // [1, 2, 3]
_.orderBy([{age: 30}, {age: 20}], 'age', 'desc'); // [{age: 30}, {age: 20}]

// Reducing
_.reduce([1, 2, 3], (sum, n) => sum + n, 0); // 6

// Partitioning
_.partition([1, 2, 3, 4], n => n % 2); // [[1, 3], [2, 4]]
```

### Function (20 utilities)

`debounce()`, `throttle()`, `memoize()`, `once()`, `curry()`, `partial()`, `flow()`, `compose()`,
`chain()`, `delay()`, `defer()`, `wrap()`, `negate()`, `before()`, `after()`, `ary()`, `unary()`, `flip()`,
`spread()`, `rest()`

**Example patterns:**

```javascript
// Debouncing (wait for pause in calls)
const debouncedSearch = _.debounce(search, 300);
$('#input').on('keyup', debouncedSearch);

// Throttling (limit call frequency)
const throttledScroll = _.throttle(onScroll, 100);
$(window).on('scroll', throttledScroll);

// Memoization (cache results)
const fibonacci = _.memoize(n => {
    return n < 2 ? n : fibonacci(n - 1) + fibonacci(n - 2);
});

// Once (run function only once)
const initialize = _.once(() => {
    console.log('Initialized');
});

// Currying
const add = _.curry((a, b) => a + b);
const add5 = add(5);
add5(3); // 8

// Function composition
const calculate = _.flow(
    x => x * 2,
    x => x + 10,
    x => x / 3
);
calculate(5); // 6.67

// Compose (right to left)
const calculate2 = _.compose(
    x => x / 3,
    x => x + 10,
    x => x * 2
);
calculate2(5); // 6.67
```

### Object (30+ utilities)

`get()`, `set()`, `has()`, `pick()`, `omit()`, `merge()`, `cloneDeep()`, `mapKeys()`, `mapValues()`,
`keys()`, `values()`, `entries()`, `assign()`, `defaults()`, `defaultsDeep()`, `findKey()`, `forOwn()`,
`invert()`, `invertBy()`, `transform()`, `extend()`, `toPairs()`, `fromPairs()`, `functions()`, `create()`

**Example patterns:**

```javascript
// Safe property access
_.get({a: {b: 2}}, 'a.b'); // 2
_.get({a: {b: 2}}, 'a.c', 'default'); // 'default'

// Setting nested properties
const obj = {};
_.set(obj, 'a.b.c', 3); // {a: {b: {c: 3}}}

// Checking properties
_.has({a: {b: 2}}, 'a.b'); // true

// Picking/omitting properties
_.pick({a: 1, b: 2, c: 3}, ['a', 'c']); // {a: 1, c: 3}
_.omit({a: 1, b: 2, c: 3}, ['b']); // {a: 1, c: 3}

// Merging objects
_.merge({a: 1}, {b: 2}, {c: 3}); // {a: 1, b: 2, c: 3}

// Deep cloning
const clone = _.cloneDeep({a: {b: 1}});

// Mapping keys/values
_.mapKeys({a: 1, b: 2}, (v, k) => k + v); // {a1: 1, b2: 2}
_.mapValues({a: 1, b: 2}, v => v * 2); // {a: 2, b: 4}

// Object iteration
_.forOwn({a: 1, b: 2}, (value, key) => {
    console.log(key, value);
});
```

### Lang (18 utilities)

`isArray()`, `isObject()`, `isPlainObject()`, `isFunction()`, `isEmpty()`, `isEqual()`, `isNull()`, `isUndefined()`,
`isNumber()`, `isString()`, `isBoolean()`, `isDate()`, `isRegExp()`, `isError()`, `isNaN()`, `isFinite()`,
`isElement()`, `isSymbol()`

**Example patterns:**

```javascript
// Type checking
_.isArray([]); // true
_.isObject({}); // true
_.isPlainObject({}); // true
_.isFunction(() => {}); // true

// Value checking
_.isEmpty([]); // true
_.isEmpty({}); // true
_.isEmpty(''); // true

// Deep equality
_.isEqual({a: 1}, {a: 1}); // true
_.isEqual([1, 2], [1, 2]); // true

// Null/undefined
_.isNull(null); // true
_.isUndefined(undefined); // true

// Number validation
_.isNaN(NaN); // true
_.isFinite(1); // true
```

### Type Conversion (10 utilities)

`parseInt()`, `toNumber()`, `toInteger()`, `toFinite()`, `toSafeInteger()`, `toString()`,
`toArray()`, `castArray()`, `toLength()`, `toPlainObject()`

**Example patterns:**

```javascript
// Parsing integers
_.parseInt('08'); // 8
_.parseInt('10px'); // 10

// Number conversion
_.toNumber('3.2'); // 3.2
_.toInteger(3.9); // 3
_.toFinite(Infinity); // 1.7976931348623157e+308

// Array conversion
_.toArray({a: 1, b: 2}); // [1, 2]
_.castArray(1); // [1]
_.castArray([1]); // [1]

// String conversion
_.toString([1, 2, 3]); // '1,2,3'
_.toString(null); // ''
```

### Math (14 utilities)

`sum()`, `mean()`, `max()`, `min()`, `clamp()`, `random()`, `round()`, `ceil()`, `floor()`, `add()`,
`subtract()`, `multiply()`, `divide()`, `maxBy()`, `minBy()`, `sumBy()`, `meanBy()`

**Example patterns:**

```javascript
// Basic math
_.sum([1, 2, 3]); // 6
_.mean([1, 2, 3]); // 2
_.max([1, 2, 3]); // 3
_.min([1, 2, 3]); // 1

// Clamping
_.clamp(5, 1, 3); // 3
_.clamp(-5, 1, 3); // 1

// Random numbers
_.random(0, 5); // Random between 0-5
_.random(5); // Random between 0-5
_.random(1.2, 5.2); // Random float

// Rounding
_.round(4.006); // 4
_.round(4.006, 2); // 4.01
_.ceil(4.006); // 5
_.floor(4.006); // 4

// Operations with iteratees
_.sumBy([{n: 4}, {n: 2}], 'n'); // 6
_.maxBy([{n: 1}, {n: 2}], 'n'); // {n: 2}
```

### String (24 utilities)

`camelCase()`, `kebabCase()`, `snakeCase()`, `capitalize()`, `truncate()`, `upperCase()`, `lowerCase()`,
`startCase()`, `upperFirst()`, `lowerFirst()`, `trim()`, `trimStart()`, `trimEnd()`, `pad()`, `padStart()`,
`padEnd()`, `repeat()`, `replace()`, `split()`, `words()`, `escape()`, `unescape()`, `template()`, `deburr()`

**Example patterns:**

```javascript
// Case conversion
_.camelCase('Foo Bar'); // 'fooBar'
_.kebabCase('Foo Bar'); // 'foo-bar'
_.snakeCase('Foo Bar'); // 'foo_bar'
_.startCase('fooBar'); // 'Foo Bar'

// Capitalization
_.capitalize('foo'); // 'Foo'
_.upperFirst('foo'); // 'Foo'
_.lowerFirst('Foo'); // 'foo'

// Truncation
_.truncate('This is a long string', {length: 10}); // 'This is...'

// Padding
_.pad('abc', 8); // '  abc   '
_.padStart('abc', 6, '_'); // '___abc'
_.padEnd('abc', 6, '_'); // 'abc___'

// Trimming
_.trim('  abc  '); // 'abc'
_.trimStart('  abc'); // 'abc'
_.trimEnd('abc  '); // 'abc'

// String manipulation
_.repeat('*', 3); // '***'
_.replace('Hi Fred', 'Fred', 'Barney'); // 'Hi Barney'
```

### Template (2 utilities)

`template()`, `render()` - Mustache-style templating with `{{var}}`, `{{#if}}`, `{{#each}}`, `{{#with}}`,
`{{> partial}}`, `{{{raw}}}`

**Example patterns:**

```javascript
// Basic templating
const compiled = _.template('Hello {{name}}!');
compiled({name: 'Fred'}); // 'Hello Fred!'

// One-shot rendering
_.render('Hello {{name}}!', {name: 'Fred'}); // 'Hello Fred!'

// Conditionals
const tmpl = _.template('{{#if show}}Visible{{/if}}');
tmpl({show: true}); // 'Visible'

// Loops
const list = _.template('{{#each items}}<li>{{this}}</li>{{/each}}');
list({items: ['a', 'b', 'c']}); // '<li>a</li><li>b</li><li>c</li>'

// Nested context
const tmpl2 = _.template('{{#with person}}{{name}}{{/with}}');
tmpl2({person: {name: 'Fred'}}); // 'Fred'

// Raw HTML
const raw = _.template('{{{html}}}');
raw({html: '<strong>Bold</strong>'}); // '<strong>Bold</strong>'
```

### Browser (1 utility)

`copyToClipboard(text)` - Async clipboard copy with fallback for older browsers

**Example patterns:**

```javascript
// Copy to clipboard
await _.copyToClipboard('Text to copy');

// With error handling
try {
    await _.copyToClipboard('Text to copy');
    console.log('Copied successfully');
} catch (error) {
    console.error('Copy failed:', error);
}

// In button click handler
$('#copy-btn').on('click', async function() {
    const text = $('#text-input').val();
    await _.copyToClipboard(text);
    await Domma.elements.alert('Copied to clipboard!');
});
```

### Chaining (1 utility)

`chain(value)` - Lodash-style wrapper for explicit method chaining

**Example patterns:**

```javascript
// Chain array operations
_.chain([1, 2, 3, 4, 5])
    .map(x => x * 2)
    .filter(x => x > 4)
    .sum()
    .value(); // 30 (6 + 8 + 10)

// Chain object operations
_.chain({a: 1, b: 2, c: 3})
    .values()           // [1, 2, 3]
    .map(x => x * 2)    // [2, 4, 6]
    .sum()              // 12
    .value();           // 12

// Complex transformations
_.chain(users)
    .filter({active: true})
    .map('name')
    .sortBy()
    .value();
```

## Showcase Example Template

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Utils Showcase - Domma</title>
    <link rel="stylesheet" href="../../../dist/domma-theme.css">
</head>
<body>
    <div class="container">
        <h1>Utils Method Showcase</h1>

        <div class="demo-section">
            <h2>Category Name</h2>
            <button id="demo-btn" class="btn">Try it</button>
            <pre id="output"></pre>
        </div>
    </div>

    <script src="../../../dist/domma.min.js"></script>
    <script>
        // Always use _ alias for utilities
        $('#demo-btn').on('click', function() {
            const data = [1, 2, 3, 4, 5];
            const result = _.chunk(data, 2);

            $('#output').text(JSON.stringify(result, null, 2));
        });
    </script>
</body>
</html>
```

## Guidelines for Utils Showcases

1. **Always use `_` alias** - Never use native JavaScript equivalents
2. **Show input and output** - Display both the input data and result
3. **Multiple examples** - Show various use cases for each utility
4. **Real-world scenarios** - Demonstrate practical applications
5. **Performance notes** - Mention when utilities provide performance benefits
6. **Lodash compatibility** - Note where behaviour matches Lodash exactly

## Common Patterns

### Data Transformation Pipeline

```javascript
const users = [
    {name: 'Alice', age: 30, active: true},
    {name: 'Bob', age: 25, active: false},
    {name: 'Charlie', age: 35, active: true}
];

// Transform data using utility chain
const result = _.chain(users)
    .filter({active: true})
    .map(u => ({name: u.name, age: u.age}))
    .sortBy('age')
    .value();

// Display results
$('#output').html(_.template(`
    {{#each result}}
    <div>{{name}}: {{age}}</div>
    {{/each}}
`)({result}));
```

### Form Data Processing

```javascript
$('#form').on('submit', function(e) {
    e.preventDefault();

    const formData = $(this).serializeArray();
    const data = _.chain(formData)
        .keyBy('name')
        .mapValues('value')
        .value();

    console.log('Processed:', data);
});
```

## Related Documentation

- [Showcase Meta Guide](../CLAUDE.md) - General showcase guidelines
- [Core Modules](../../../src/CLAUDE.md) - Utils module source documentation
- [API Reference](../../../docs/API.md) - Complete Utils API reference

## Testing Utils Showcases

- Verify utility results are correct
- Test edge cases (empty arrays, null values, etc.)
- Show performance with large datasets
- Demonstrate Lodash compatibility
