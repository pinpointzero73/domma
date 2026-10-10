---
title: Utilities
description: "Lodash-compatible utility functions with 120+ methods for arrays, objects, strings, and more."
layout: with-sidebar
status: published
sortOrder: 50
---

[hero title="Utilities" tagline="Lodash-compatible utility functions with 120+ methods for arrays, objects, strings, and more." align="center"][/hero]

## Array Methods

Manipulate and transform arrays with powerful utility functions.

chunk()

compact()

concat()

difference()

drop()

dropRight()

dropWhile()

fill()

flatten()

flattenDeep()

flattenDepth()

fromPairs()

head()

indexOf()

initial()

intersection()

join()

last()

lastIndexOf()

nth()

pull()

pullAll()

pullAt()

remove()

reverse()

slice()

sortedIndex()

sortedUniq()

tail()

take()

takeRight()

takeWhile()

union()

uniq()

uniqBy()

unzip()

without()

xor()

zip()

zipObject()

```javascript
// Chunk array into groups
_.chunk([1, 2, 3, 4, 5], 2)  // [[1, 2], [3, 4], [5]]

// Remove falsy values
_.compact([0, 1, false, 2, '', 3])  // [1, 2, 3]

// Array difference
_.difference([1, 2, 3], [2, 3])  // [1]

// Flatten nested arrays
_.flatten([[1, 2], [3, [4]]])  // [1, 2, 3, [4]]
_.flattenDeep([[1, [2, [3]]]])  // [1, 2, 3]

// Get unique values
_.uniq([1, 2, 2, 3, 3, 3])  // [1, 2, 3]
_.uniqBy([{x:1}, {x:1}, {x:2}], 'x')  // [{x:1}, {x:2}]

// Combine arrays
_.union([1, 2], [2, 3])  // [1, 2, 3]
_.intersection([1, 2], [2, 3])  // [2]

// Array to object
_.zipObject(['a', 'b'], [1, 2])  // {a: 1, b: 2}
_.fromPairs([['a', 1], ['b', 2]])  // {a: 1, b: 2}
```

[showcase-demo id="showcase/utils/try-it" title="Try It" /]

## Collection Methods

Iterate, search, and transform collections (arrays and objects).

countBy()

each()

every()

filter()

find()

findIndex()

findLast()

flatMap()

forEach()

groupBy()

includes()

invokeMap()

keyBy()

map()

orderBy()

partition()

reduce()

reduceRight()

reject()

sample()

sampleSize()

shuffle()

size()

some()

sortBy()

```javascript
const users = [
    { name: 'Alice', age: 25, dept: 'Engineering' },
    { name: 'Bob', age: 30, dept: 'Sales' },
    { name: 'Carol', age: 25, dept: 'Engineering' }
];

// Group by property
_.groupBy(users, 'dept')
// { Engineering: [...], Sales: [...] }

// Sort by property
_.sortBy(users, 'age')
_.orderBy(users, ['dept', 'name'], ['asc', 'desc'])

// Filter and find
_.filter(users, { dept: 'Engineering' })
_.find(users, { name: 'Bob' })

// Key by unique property
_.keyBy(users, 'name')
// { Alice: {...}, Bob: {...}, Carol: {...} }

// Partition by condition
_.partition(users, u => u.age > 25)
// [[Bob], [Alice, Carol]]

// Count by property
_.countBy(users, 'dept')
// { Engineering: 2, Sales: 1 }
```

[showcase-demo id="showcase/utils/try-it-2" title="Try It" /]

## Object Methods

Work with objects - access, transform, and manipulate properties.

assign()

at()

defaults()

defaultsDeep()

entries()

findKey()

forIn()

forOwn()

get()

has()

hasIn()

invert()

invoke()

keys()

mapKeys()

mapValues()

merge()

mergeWith()

omit()

omitBy()

pick()

pickBy()

result()

set()

toPairs()

transform()

unset()

update()

values()

```javascript
const obj = {
    user: { name: 'Alice', address: { city: 'NYC' } },
    settings: { theme: 'dark' }
};

// Safe property access
_.get(obj, 'user.name')  // 'Alice'
_.get(obj, 'user.phone', 'N/A')  // 'N/A' (default)
_.get(obj, 'user.address.city')  // 'NYC'

// Set nested property
_.set(obj, 'user.address.zip', '10001')

// Check if path exists
_.has(obj, 'user.name')  // true
_.has(obj, 'user.email')  // false

// Pick/omit properties
_.pick(obj.user, ['name'])  // { name: 'Alice' }
_.omit(obj.user, ['address'])  // { name: 'Alice' }

// Merge objects
_.merge({a: 1}, {b: 2}, {a: 3})  // {a: 3, b: 2}
_.defaults({a: 1}, {a: 2, b: 2})  // {a: 1, b: 2}

// Transform keys/values
_.mapKeys({a: 1, b: 2}, (v, k) => k.toUpperCase())  // {A: 1, B: 2}
_.mapValues({a: 1, b: 2}, v => v * 2)  // {a: 2, b: 4}

// Invert object
_.invert({a: 1, b: 2})  // {1: 'a', 2: 'b'}
```

[showcase-demo id="showcase/utils/try-it-3" title="Try It" /]

## Function Methods

Control function execution with debounce, throttle, memoize, and more.

after()

ary()

before()

bind()

curry()

curryRight()

debounce()

defer()

delay()

flip()

memoize()

negate()

once()

partial()

partialRight()

rearg()

rest()

spread()

throttle()

unary()

wrap()

```javascript
// Debounce - wait for pause in calls
const search = _.debounce((query) => {
    console.log('Searching:', query);
}, 300);

input.addEventListener('input', e => search(e.target.value));

// Throttle - limit call frequency
const scroll = _.throttle(() => {
    console.log('Scroll position:', window.scrollY);
}, 100);

window.addEventListener('scroll', scroll);

// Memoize - cache results
const expensive = _.memoize((n) => {
    console.log('Computing...');
    return n * n;
});
expensive(5);  // Computing... 25
expensive(5);  // 25 (cached)

// Once - only call once
const init = _.once(() => console.log('Initialized!'));
init();  // Initialized!
init();  // (nothing)

// Curry - partial application
const add = _.curry((a, b, c) => a + b + c);
add(1)(2)(3);  // 6
add(1, 2)(3);  // 6
add(1)(2, 3);  // 6
```

[showcase-demo id="showcase/utils/debounce" title="Debounce" /]

## String Methods

Transform and manipulate strings.

camelCase()

capitalize()

deburr()

endsWith()

escape()

escapeRegExp()

kebabCase()

lowerCase()

lowerFirst()

pad()

padEnd()

padStart()

parseInt()

repeat()

replace()

snakeCase()

split()

startCase()

startsWith()

template()

toLower()

toUpper()

trim()

trimEnd()

trimStart()

truncate()

unescape()

upperCase()

upperFirst()

words()

```javascript
// Case conversion
_.camelCase('hello world')    // 'helloWorld'
_.kebabCase('helloWorld')     // 'hello-world'
_.snakeCase('Hello World')    // 'hello_world'
_.startCase('helloWorld')     // 'Hello World'

// Capitalize
_.capitalize('hello')         // 'Hello'
_.upperFirst('hello')         // 'Hello'
_.lowerFirst('HELLO')         // 'hELLO'

// Padding
_.pad('abc', 8)               // '  abc   '
_.padStart('5', 3, '0')       // '005'
_.padEnd('5', 3, '0')         // '500'

// Truncate
_.truncate('Hello World', { length: 8 })  // 'Hello...'

// Template
const tpl = _.template('Hello, <%= name %>!');
tpl({ name: 'Alice' })        // 'Hello, Alice!'

// Escape HTML
_.escape('')            // '<div>'

// Words
_.words('fred, barney, & pebbles')  // ['fred', 'barney', 'pebbles']
```

[showcase-demo id="showcase/utils/try-it-4" title="Try It" /]

## Template Engine

Mustache-style templates with loops, conditionals, partials, and automatic HTML escaping.

template()

render()

### Basic Usage

```javascript
// Compile and reuse
const tmpl = _.template('Hello {{name}}!');
tmpl({ name: 'World' });  // 'Hello World!'

// One-shot render
_.render('Welcome, {{user.name}}!', { user: { name: 'Alice' } });
// 'Welcome, Alice!'

// HTML is escaped by default
_.render('{{content}}', { content: '' });
// '<script>'

// Use triple braces for raw output
_.render('{{{html}}}', { html: 'Bold' });
// 'Bold'
```

### Conditionals

```javascript
// {{#if}}...{{/if}}
_.render('{{#if active}}Online{{/if}}', { active: true });
// 'Online'

// {{#if}}...{{else}}...{{/if}}
_.render('{{#if premium}}Pro{{else}}Free{{/if}}', { premium: false });
// 'Free'

// {{#unless}}...{{/unless}}
_.render('{{#unless verified}}Please verify{{/unless}}', { verified: false });
// 'Please verify'
```

### Loops

```javascript
// {{#each}}...{{/each}}
_.render('{{#each items}}{{name}}{{/each}}', {
    items: [{ name: 'Apple' }, { name: 'Banana' }]
});
// 'AppleBanana'

// Primitive arrays use {{.}}
_.render('{{#each tags}}#{{.}} {{/each}}', { tags: ['js', 'css', 'html'] });
// '#js #css #html '

// Access loop metadata
_.render('{{#each items}}{{@index}}: {{name}}{{/each}}', { items: [...] });
// '0: Apple1: Banana'
```

### Context & Partials

```javascript
// {{#with}}...{{/with}} - shift context
_.render('{{#with user}}{{firstName}} {{lastName}}{{/with}}', {
    user: { firstName: 'John', lastName: 'Doe' }
});
// 'John Doe'

// {{> partial}} - include named partials
const opts = { partials: { header: '{{title}}' } };
_.render('{{> header}}', { title: 'Welcome' }, opts);
// 'Welcome'
```

[showcase-demo id="showcase/utils/try-it-5" title="Try It" /]

## Lang (Type) Methods

Type checking, comparison, and cloning utilities.

castArray()

clone()

cloneDeep()

conformsTo()

eq()

gt()

gte()

isArray()

isBoolean()

isDate()

isElement()

isEmpty()

isEqual()

isEqualWith()

isError()

isFinite()

isFunction()

isInteger()

isLength()

isMatch()

isNaN()

isNil()

isNull()

isNumber()

isObject()

isPlainObject()

isRegExp()

isString()

isSymbol()

isUndefined()

lt()

lte()

castArray()

parseInt()

toArray()

toFinite()

toInteger()

toLength()

toNumber()

toPlainObject()

toSafeInteger()

toString()

```javascript
// Type checking
_.isArray([1, 2])        // true
_.isObject({})           // true
_.isPlainObject({})      // true
_.isFunction(() => {})
_.isString('hello')      // true
_.isNumber(123)          // true
_.isNil(null)            // true
_.isEmpty([])            // true
_.isEmpty({})            // true

// Deep equality
_.isEqual({a: 1}, {a: 1})  // true
_.isEqual([1, 2], [1, 2])  // true

// Cloning
const obj = { a: { b: 1 } };
const shallow = _.clone(obj);      // Shallow copy
const deep = _.cloneDeep(obj);     // Deep copy

// Object matching
_.isMatch({a: 1, b: 2}, {a: 1})  // true

// Conversions
_.parseInt('42')         // 42
_.parseInt('08', 10)     // 8
_.toNumber('3.14')       // 3.14
_.toInteger('3.7')       // 3
_.toFinite(Infinity)     // 1.7976931348623157e+308
_.toSafeInteger(3.7)     // 3
_.toArray('abc')         // ['a', 'b', 'c']
_.toString([1, 2, 3])    // '1,2,3'
_.castArray(1)           // [1]
_.castArray([1])         // [1]
```

[showcase-demo id="showcase/utils/try-it-6" title="Try It" /]

## Maths Methods

Mathematical operations and aggregations.

add()

ceil()

divide()

floor()

max()

maxBy()

mean()

meanBy()

min()

minBy()

multiply()

round()

subtract()

sum()

sumBy()

clamp()

inRange()

random()

```javascript
// Basic maths
_.add(6, 4)              // 10
_.subtract(6, 4)         // 2
_.multiply(6, 4)         // 24
_.divide(6, 4)           // 1.5

// Rounding
_.round(4.567, 2)        // 4.57
_.floor(4.567)           // 4
_.ceil(4.123)            // 5

// Aggregations
_.sum([1, 2, 3, 4])      // 10
_.mean([1, 2, 3, 4])     // 2.5
_.max([1, 2, 3, 4])      // 4
_.min([1, 2, 3, 4])      // 1

// With iteratee
const items = [{n: 1}, {n: 2}, {n: 3}];
_.sumBy(items, 'n')      // 6
_.maxBy(items, 'n')      // {n: 3}
_.minBy(items, 'n')      // {n: 1}
_.meanBy(items, 'n')     // 2

// Number utilities
_.clamp(10, 0, 5)        // 5 (clamp to range)
_.inRange(3, 2, 4)       // true
_.random(0, 100)         // Random number 0-100
_.random(1.5, 5.5, true) // Random float
```

[showcase-demo id="showcase/utils/try-it-7" title="Try It" /]

## Real-World Patterns & Config Integration

Combine utility functions with Domma's config engine for cleaner, more maintainable code in real-world scenarios.

### Data Transformation Pipeline

```javascript
// Transform API data for display using utility pipeline
const transformUserData = _.flow([
    // 1. Filter active users only
    (users) => _.filter(users, { status: 'active' }),

    // 2. Sort by name
    (users) => _.sortBy(users, 'name'),

    // 3. Group by department
    (users) => _.groupBy(users, 'department'),

    // 4. Map to summary objects
    (grouped) => _.mapValues(grouped, (users, dept) => ({
        department: dept,
        count: users.length,
        users: _.map(users, u => _.pick(u, ['id', 'name', 'email']))
    }))
]);

// Usage with $.setup()
$.setup({
    '#user-dashboard': {
        events: {
            ready: async (e, $el) => {
                const rawUsers = await Domma.http.get('/api/users');
                const transformed = transformUserData(rawUsers);

                // Render grouped data
                _.forEach(transformed, (group, dept) => {
                    $el.append(`
                        
                            ${dept} (${group.count})
                            ${_.map(group.users, u => `${u.name}`).join('')}
                        
                    `);
                });
            }
        }
    }
});
```

### Form Validation & Data Processing

```javascript
// Centralized form validation with utils
const validators = {
    email: (value) => /^[^S@]+@[^S@]+\.[^S@]+$/.test(value),
    required: (value) => !_.isEmpty(_.trim(value)),
    minLength: (min) => (value) => _.trim(value).length >= min,
    alphanumeric: (value) => /^[a-zA-Z0-9]+$/.test(value)
};

$.setup({
    '#signup-form': {
        initial: {
            data: { errors: {} }
        },
        events: {
            submit: (e, $el) => {
                e.preventDefault();

                // Get form data
                const formData = {
                    username: $el.find('[name="username"]').val(),
                    email: $el.find('[name="email"]').val(),
                    password: $el.find('[name="password"]').val()
                };

                // Validate with utils
                const errors = {};

                if (!validators.required(formData.username)) {
                    errors.username = 'Username is required';
                } else if (!validators.alphanumeric(formData.username)) {
                    errors.username = 'Username must be alphanumeric';
                }

                if (!validators.required(formData.email)) {
                    errors.email = 'Email is required';
                } else if (!validators.email(formData.email)) {
                    errors.email = 'Invalid email address';
                }

                if (!validators.minLength(8)(formData.password)) {
                    errors.password = 'Password must be at least 8 characters';
                }

                // Store errors
                $el.data('errors', errors);

                if (_.isEmpty(errors)) {
                    // Clean data before submission
                    const cleanData = _.mapValues(formData, _.trim);
                    console.log('Valid:', cleanData);
                    Domma.elements.toast.success('Form submitted!');
                } else {
                    // Display errors
                    _.forEach(errors, (msg, field) => {
                        $el.find(`[name="${field}"]`)
                            .addClass('error')
                            .next('.error-msg').text(msg);
                    });
                    Domma.elements.toast.error(`${_.size(errors)} validation errors`);
                }
            },

            'blur input': _.debounce((e, $el) => {
                // Validate on blur (debounced)
                const field = $(e.target).attr('name');
                const value = $(e.target).val();

                // Field-specific validation
                let isValid = true;
                if (field === 'email') {
                    isValid = validators.email(value);
                } else if (field === 'username') {
                    isValid = validators.alphanumeric(value);
                }

                $(e.target).toggleClass('error', !isValid);
            }, 300)
        }
    }
});
```

### Smart Search with Debounce & Filtering

```javascript
// Search implementation with utils
$.setup({
    '#product-search': {
        initial: {
            data: {
                products: [],
                filteredProducts: [],
                filters: { category: null, minPrice: 0, maxPrice: Infinity }
            }
        },
        events: {
            ready: async (e, $el) => {
                // Load products
                const products = await Domma.http.get('/api/products');
                $el.data('products', products);
                $el.data('filteredProducts', products);
                renderProducts($el, products);
            },

            'input #search-box': _.debounce((e, $el) => {
                const query = $(e.target).val().toLowerCase();
                const products = $el.data('products');
                const filters = $el.data('filters');

                // Multi-criteria search with utils
                const filtered = _.flow([
                    // Text search
                    (items) => query ? _.filter(items, item =>
                        _.toLower(item.name).includes(query) ||
                        _.toLower(item.description).includes(query)
                    ) : items,

                    // Category filter
                    (items) => filters.category
                        ? _.filter(items, { category: filters.category })
                        : items,

                    // Price range
                    (items) => _.filter(items, item =>
                        item.price >= filters.minPrice &&
                        item.price <= filters.maxPrice
                    ),

                    // Sort by relevance (name match first)
                    (items) => _.sortBy(items, [
                        item => !_.toLower(item.name).includes(query),
                        'price'
                    ])
                ])(products);

                $el.data('filteredProducts', filtered);
                renderProducts($el, filtered);

                // Show count
                $('#result-count').text(`${filtered.length} results`);
            }, 300),

            'change [name="category"]': (e, $el) => {
                const category = $(e.target).val();
                const filters = $el.data('filters');
                filters.category = category || null;
                $el.find('#search-box').trigger('input');
            }
        }
    }
});

function renderProducts($container, products) {
    const html = _.map(products, product => `
        
            ${_.escape(product.name)}
            ${_.truncate(product.description, { length: 100 })}
            $${_.round(product.price, 2)}
        
    `).join('');

    $container.find('#results').html(html || 'No products found');
}
```

### Data Aggregation Dashboard

```javascript
// Analytics dashboard with util aggregations
$.setup({
    '#analytics-dashboard': {
        events: {
            ready: async (e, $el) => {
                const sales = await Domma.http.get('/api/sales');

                // Aggregate data with utils
                const stats = {
                    // Total revenue
                    totalRevenue: _.sumBy(sales, 'amount'),

                    // Average order value
                    avgOrderValue: _.meanBy(sales, 'amount'),

                    // Sales by product
                    byProduct: _.chain(sales)
                        .groupBy('product')
                        .mapValues(items => ({
                            count: items.length,
                            revenue: _.sumBy(items, 'amount')
                        }))
                        .value(),

                    // Top 5 products
                    topProducts: _.chain(sales)
                        .groupBy('product')
                        .map((items, product) => ({
                            product,
                            revenue: _.sumBy(items, 'amount')
                        }))
                        .orderBy(['revenue'], ['desc'])
                        .take(5)
                        .value(),

                    // Sales by date
                    dailySales: _.chain(sales)
                        .groupBy(sale => D(sale.date).format('YYYY-MM-DD'))
                        .mapValues(items => _.sumBy(items, 'amount'))
                        .toPairs()
                        .orderBy([0], ['desc'])
                        .value()
                };

                // Render stats
                $el.find('#total-revenue').text(`$${_.round(stats.totalRevenue, 2)}`);
                $el.find('#avg-order').text(`$${_.round(stats.avgOrderValue, 2)}`);

                // Render top products
                const productsHTML = _.map(stats.topProducts, (item, index) => `
                    #${index + 1}: ${item.product} - $${_.round(item.revenue, 2)}
                `).join('');
                $el.find('#top-products').html(productsHTML);
            }
        }
    }
});
```

### Benefits of Utils + Config Pattern

- **Declarative** - Clear intent with functional transformations
- **Composable** - Chain utilities for complex operations
- **Testable** - Pure functions easy to unit test
- **Performant** - Debounce, memoize, and optimize expensive operations
- **Maintainable** - Centralized logic with $.setup()

### Imperative vs Functional Utils Pattern

Imperative (Verbose)

```javascript
// Filter, sort, group manually
const active = [];
for (const user of users) {
    if (user.status === 'active') {
        active.push(user);
    }
}

active.sort((a, b) =>
    a.name.localeCompare(b.name)
);

const byDept = {};
for (const user of active) {
    if (!byDept[user.dept]) {
        byDept[user.dept] = [];
    }
    byDept[user.dept].push(user);
}

// Hard to read, error-prone
// Mutable operations
```

Functional with Utils (Clean)

```javascript
// Pipeline with utils
const byDept = _.flow([
    users => _.filter(users, {
        status: 'active'
    }),
    users => _.sortBy(users, 'name'),
    users => _.groupBy(users, 'dept')
])(users);

// Clear transformation steps
// Immutable operations
// Chainable and composable
// Easy to test each step
```

## Utility Methods

General utility functions.

attempt()

cond()

conforms()

constant()

defaultTo()

flow()

flowRight()

identity()

iteratee()

matches()

matchesProperty()

method()

methodOf()

noop()

nthArg()

over()

overEvery()

overSome()

property()

propertyOf()

range()

rangeRight()

stubArray()

stubFalse()

stubObject()

stubString()

stubTrue()

times()

toPath()

uniqueId()

```javascript
// Generate ranges
_.range(5)               // [0, 1, 2, 3, 4]
_.range(1, 5)            // [1, 2, 3, 4]
_.range(0, 10, 2)        // [0, 2, 4, 6, 8]

// Unique IDs
_.uniqueId()             // '1'
_.uniqueId('user_')      // 'user_2'

// Run function N times
_.times(3, i => i * 2)   // [0, 2, 4]

// Default values
_.defaultTo(null, 10)    // 10
_.defaultTo(1, 10)       // 1

// Function composition
const addOne = x => x + 1;
const double = x => x * 2;
const composed = _.flow([addOne, double]);
composed(5)              // 12 (5+1=6, 6*2=12)

// Property accessor
const getName = _.property('name');
getName({ name: 'Alice' })  // 'Alice'

// Identity
_.identity('hello')      // 'hello'

// Noop
_.noop()                 // undefined (do nothing)
```

[showcase-demo id="showcase/utils/try-it-8" title="Try It" /]
