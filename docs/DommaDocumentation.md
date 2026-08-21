# Domma Documentation

Domma is a lightweight JavaScript toolkit combining DOM manipulation, HTTP requests, and utilities with a JSON-based configuration engine.

## Table of Contents

- [Installation](#installation)
- [Aliases](#aliases)
- [Core Concepts](#core-concepts)
- [DOM Methods Reference](#dom-methods-reference)
  - [Traversal](#traversal)
  - [Content](#content)
  - [Attributes](#attributes)
  - [CSS/Classes](#cssclasses)
  - [DOM Manipulation](#dom-manipulation)
  - [Events](#events)
  - [Effects](#effects)
  - [Dimensions](#dimensions)
- [HTTP Client](#http-client)
- [JSON Configuration](#json-configuration)
- [Reactivity](#reactivity)
- [Utilities Reference](#utilities-reference)
  - [Array Utilities](#array-utilities)
  - [Collection Utilities](#collection-utilities)
  - [Function Utilities](#function-utilities)
  - [Object Utilities](#object-utilities)
  - [Lang Utilities](#lang-utilities)
  - [Math Utilities](#math-utilities)
  - [Number Utilities](#number-utilities)
  - [String Utilities](#string-utilities)

## Installation

### Browser (UMD)

```html
<script src="dist/domma.min.js"></script>
<script>
    // Full name
    Domma('#myElement').text('Hello!');

    // Or use short aliases (like jQuery's $ and Lodash's _)
    $('#myElement').text('Hello!');
    _.debounce(myFunc, 100);
</script>
```

### ES Module

```javascript
// Default import
import Domma from './dist/domma.esm.js';

// Named imports with short aliases
import { $, _ } from './dist/domma.esm.js';
```

## Aliases

Domma provides short aliases for convenience, similar to jQuery (`$`) and Lodash (`_`).

| Full Name | Alias | Purpose |
|-----------|-------|---------|
| `Domma` | `$` | DOM selection and manipulation |
| `Domma.utils` | `_` | Utility functions |

### Examples

```javascript
// These are equivalent:
Domma('#app').addClass('active');
$('#app').addClass('active');

// These are equivalent:
Domma.utils.chunk([1, 2, 3, 4], 2);
_.chunk([1, 2, 3, 4], 2);

// Mix and match as needed
$('.items').each(function() {
    const data = _.pick(this.dataset, 'id', 'name');
    console.log(data);
});
```

### Conflict Avoidance

If using jQuery or Lodash alongside Domma, stick with the full names:

```javascript
// jQuery and Domma together
jQuery('#jqueryElement').hide();
Domma('#dommaElement').hide();

// Lodash and Domma together
lodash.chunk(arr, 2);
Domma.utils.chunk(arr, 2);
```

## Core Concepts

Domma provides three main modules accessible through the `Domma` object:

- **DOM Selection**: `Domma(selector)` - jQuery-like DOM manipulation
- **HTTP Client**: `Domma.http` - Fetch-based HTTP requests
- **Utilities**: `Domma.utils` - Lodash-like utility functions
- **Configuration**: `Domma.setup(config)` - Declarative DOM behaviour

## DOM Methods Reference

Domma provides a comprehensive jQuery-compatible API for DOM manipulation.

### Traversal

#### find(selector)
Get descendants matching selector.
```javascript
Domma('#container').find('.item');
// => DommaCollection of matching descendants
```

#### children(selector)
Get immediate children, optionally filtered by selector.
```javascript
Domma('#menu').children();           // All children
Domma('#menu').children('.active');  // Filtered children
```

#### parent(selector)
Get parent element, optionally filtered.
```javascript
Domma('.item').parent();             // Direct parent
Domma('.item').parent('.wrapper');   // Parent if matches
```

#### parents(selector)
Get all ancestors, optionally filtered.
```javascript
Domma('.deep').parents();            // All ancestors
Domma('.deep').parents('.section');  // Matching ancestors
```

#### closest(selector)
Get closest ancestor matching selector (including self).
```javascript
Domma('.button').closest('.card');
Domma('input').closest('form');
```

#### siblings(selector)
Get sibling elements, optionally filtered.
```javascript
Domma('.current').siblings();
Domma('.current').siblings('.item');
```

#### next(selector) / prev(selector)
Get next or previous sibling.
```javascript
Domma('.item').next();
Domma('.item').prev('.enabled');
```

#### nextAll(selector) / prevAll(selector)
Get all following or preceding siblings.
```javascript
Domma('.current').nextAll();
Domma('.current').prevAll('.item');
```

#### first() / last()
Get first or last element in collection.
```javascript
Domma('li').first();
Domma('li').last();
```

#### eq(index)
Get element at index (supports negative).
```javascript
Domma('li').eq(2);    // Third element
Domma('li').eq(-1);   // Last element
```

#### get(index)
Get raw DOM element(s).
```javascript
Domma('li').get(0);   // First HTMLElement
Domma('li').get();    // Array of all HTMLElements
```

#### filter(selector|function)
Filter collection by selector or function.
```javascript
Domma('li').filter('.active');
Domma('li').filter((i, el) => el.textContent.length > 10);
```

#### not(selector|function)
Exclude elements from collection.
```javascript
Domma('li').not('.disabled');
Domma('input').not('[type="hidden"]');
```

#### is(selector)
Check if any element matches selector.
```javascript
if (Domma('#item').is('.active')) {
    // At least one element matches
}
```

#### has(selector)
Filter elements that contain descendants matching selector.
```javascript
Domma('.card').has('.badge');
```

#### add(selector)
Add elements to the collection.
```javascript
Domma('.items').add('.more-items');
```

#### index(selector)
Get index of element.
```javascript
Domma('.active').index();         // Among siblings
Domma('li').index('.active');     // In collection
```

#### toArray()
Convert collection to array.
```javascript
const arr = Domma('li').toArray();
```

### Using Context Parameter

The context parameter allows you to scope your searches to a specific element or document fragment:

```javascript
// Basic usage
const menuElement = document.getElementById('main-menu');
Domma('li', menuElement);  // Only li elements within #main-menu

// Equivalent to chaining
Domma('#main-menu').find('li');

// Performance comparison
// Context parameter: O(n) search within subset
Domma('.item', document.getElementById('container'));

// vs. Global search: O(n) search across entire document
Domma('.item')  // Then filter/process

// Practical example: Update dashboard widgets
const dashboard = document.getElementById('dashboard');
Domma('.widget', dashboard).each(function() {
    // Each widget's internal elements
    Domma('.title', this).css('font-weight', 'bold');
    Domma('.value', this).fadeIn(300);
});
```

**When to use context parameter:**

- **Performance:** Searching within a known subset of the DOM
- **Clarity:** When scope is important to the operation's intent
- **Dynamic content:** Working with specific containers or components
- **Large DOMs:** Reducing search space for better performance

**Note:** Context parameter only applies to CSS selectors. HTML strings (like `'<div>New</div>'`) ignore the context
parameter since they create elements rather than selecting them.

### Content

#### html(content)
Get or set inner HTML.
```javascript
// Get
const content = Domma('#box').html();

// Set
Domma('#box').html('<p>New content</p>');
```

#### text(content)
Get or set text content.
```javascript
// Get
const text = Domma('#title').text();

// Set
Domma('#title').text('New Title');
```

#### val(value)
Get or set form element value.
```javascript
// Get
const value = Domma('#input').val();

// Set
Domma('#input').val('new value');

// Checkbox/Radio
Domma('[type="checkbox"]').val(['option1', 'option2']);

// Multi-select returns array
const selected = Domma('select[multiple]').val();
```

### Attributes

#### attr(name, value)
Get or set attribute.
```javascript
// Get
const href = Domma('a').attr('href');

// Set single
Domma('a').attr('href', '/new-url');

// Set multiple
Domma('img').attr({
    src: 'image.jpg',
    alt: 'Description'
});
```

#### removeAttr(name)
Remove attribute(s).
```javascript
Domma('input').removeAttr('disabled');
Domma('div').removeAttr('data-id data-type');  // Multiple
```

#### prop(name, value)
Get or set property.
```javascript
const checked = Domma('#checkbox').prop('checked');
Domma('#checkbox').prop('checked', true);
```

#### removeProp(name)
Remove property.
```javascript
Domma('#checkbox').removeProp('checked');
```

#### data(key, value)
Get or set data attributes.
```javascript
// Get single
const id = Domma('.item').data('id');

// Get all
const allData = Domma('.item').data();
// => { id: '123', type: 'product' }

// Set single
Domma('.item').data('id', 123);

// Set multiple
Domma('.item').data({ id: 123, type: 'product' });
```

#### removeData(key)
Remove data attribute.
```javascript
Domma('.item').removeData('id');
```

### CSS/Classes

#### css(property, value)
Get or set CSS styles.
```javascript
// Get computed style
const color = Domma('#box').css('color');

// Set single
Domma('#box').css('background-color', 'blue');

// Set multiple
Domma('#box').css({
    backgroundColor: 'blue',
    color: 'white',
    padding: '20px'
});
```

#### addClass(className)
Add class(es) to elements.
```javascript
Domma('#el').addClass('active');
Domma('#el').addClass('active visible');  // Multiple

// Function
Domma('.item').addClass((i, current) => `item-${i}`);
```

#### removeClass(className)
Remove class(es) from elements.
```javascript
Domma('#el').removeClass('active');
Domma('#el').removeClass('active visible');
Domma('#el').removeClass();  // Remove all
```

#### toggleClass(className, state)
Toggle class(es).
```javascript
Domma('#el').toggleClass('active');
Domma('#el').toggleClass('active', true);   // Force add
Domma('#el').toggleClass('active', false);  // Force remove
```

#### hasClass(className)
Check if any element has class.
```javascript
if (Domma('#el').hasClass('active')) {
    // ...
}
```

### DOM Manipulation

#### append(content) / prepend(content)
Insert content inside elements.
```javascript
Domma('#list').append('<li>Last</li>');
Domma('#list').prepend('<li>First</li>');
Domma('#list').append(Domma('<li>New</li>'));
```

#### after(content) / before(content)
Insert content outside elements.
```javascript
Domma('.item').after('<hr>');
Domma('.item').before('<span>•</span>');
```

#### appendTo(target) / prependTo(target)
Insert elements into target.
```javascript
Domma('<li>New</li>').appendTo('#list');
Domma('<li>First</li>').prependTo('#list');
```

#### insertAfter(target) / insertBefore(target)
Insert elements relative to target.
```javascript
Domma('<hr>').insertAfter('.item');
Domma('<span>•</span>').insertBefore('.item');
```

#### wrap(wrapper)
Wrap each element.
```javascript
Domma('.item').wrap('<div class="wrapper"></div>');
```

#### wrapAll(wrapper)
Wrap all elements together.
```javascript
Domma('.item').wrapAll('<div class="container"></div>');
```

#### wrapInner(wrapper)
Wrap contents of each element.
```javascript
Domma('.item').wrapInner('<span></span>');
```

#### unwrap(selector)
Remove parent wrapper.
```javascript
Domma('.item').unwrap();
Domma('.item').unwrap('.wrapper');  // Only if parent matches
```

#### remove(selector)
Remove elements from DOM.
```javascript
Domma('.item').remove();
Domma('.item').remove('.disabled');  // Remove matching
```

#### detach()
Remove elements (preserving data).
```javascript
const removed = Domma('.item').detach();
```

#### empty()
Remove all children.
```javascript
Domma('#container').empty();
```

#### clone(deep)
Clone elements.
```javascript
const copy = Domma('.item').clone();
const shallow = Domma('.item').clone(false);
```

#### replaceWith(content)
Replace elements.
```javascript
Domma('.old').replaceWith('<div class="new">New</div>');
```

#### replaceAll(target)
Replace target with elements.
```javascript
Domma('<div class="new">New</div>').replaceAll('.old');
```

### Events

#### on(event, selector, handler)
Attach event handler with optional delegation.
```javascript
// Direct binding
Domma('#btn').on('click', (e) => {
    console.log('Clicked');
});

// Event delegation
Domma('#list').on('click', 'li', (e) => {
    console.log('Item clicked:', e.target);
});

// Multiple events
Domma('#input').on('focus blur', (e) => {
    console.log(e.type);
});
```

#### off(event, selector, handler)
Remove event handler.
```javascript
Domma('#btn').off('click', handler);
Domma('#list').off('click', 'li', handler);
```

#### one(event, selector, handler)
Attach handler that fires once.
```javascript
Domma('#btn').one('click', () => {
    console.log('First click only');
});
```

#### trigger(event, data)
Trigger event on elements.
```javascript
Domma('#btn').trigger('click');
Domma('#el').trigger('custom', { key: 'value' });
```

#### Event Shortcuts
All shortcuts work as both handlers (with function) and triggers (without).
```javascript
// As handlers
Domma('#el').click(handler);
Domma('#el').dblclick(handler);
Domma('#el').mousedown(handler);
Domma('#el').mouseup(handler);
Domma('#el').mousemove(handler);
Domma('#el').mouseover(handler);
Domma('#el').mouseout(handler);
Domma('#el').mouseenter(handler);
Domma('#el').mouseleave(handler);
Domma('#el').keydown(handler);
Domma('#el').keyup(handler);
Domma('#el').keypress(handler);
Domma('#el').focus(handler);
Domma('#el').blur(handler);
Domma('#el').change(handler);
Domma('#el').select(handler);
Domma('#el').submit(handler);
Domma('#el').scroll(handler);
Domma('#el').resize(handler);

// As triggers
Domma('#el').click();
Domma('#form').submit();
```

#### hover(enterHandler, leaveHandler)
Handle mouseenter and mouseleave.
```javascript
Domma('.card').hover(
    function() { Domma(this).addClass('hovered'); },
    function() { Domma(this).removeClass('hovered'); }
);
```

### Effects

Duration can be a number (ms), `'fast'` (200ms), or `'slow'` (600ms).

#### show(duration, callback) / hide(duration, callback)
Show or hide elements.
```javascript
Domma('#el').show();
Domma('#el').hide();
Domma('#el').show(400);
Domma('#el').hide('fast', () => console.log('hidden'));
```

#### toggle(duration, callback)
Toggle visibility.
```javascript
Domma('#el').toggle();
Domma('#el').toggle(400);
```

#### fadeIn(duration, callback) / fadeOut(duration, callback)
Fade in or out.
```javascript
Domma('#el').fadeIn();
Domma('#el').fadeOut(400);
Domma('#el').fadeIn('slow', () => console.log('visible'));
```

#### fadeToggle(duration, callback)
Toggle fade.
```javascript
Domma('#el').fadeToggle();
```

#### fadeTo(duration, opacity, callback)
Fade to specific opacity.
```javascript
Domma('#el').fadeTo(400, 0.5);
```

#### slideDown(duration, callback) / slideUp(duration, callback)
Slide down (show) or up (hide).
```javascript
Domma('#panel').slideDown();
Domma('#panel').slideUp(400);
```

#### slideToggle(duration, callback)
Toggle slide.
```javascript
Domma('#panel').slideToggle();
```

#### animate(properties, duration, easing, callback)
Animate CSS properties.
```javascript
Domma('#box').animate({ left: 100, opacity: 0.5 }, 400);

Domma('#box').animate(
    { width: 200, height: 200 },
    'slow',
    'ease-in-out',
    () => console.log('done')
);
```

#### stop()
Stop current animation.
```javascript
Domma('#box').stop();
```

#### delay(duration)
Delay next operation (returns Promise).
```javascript
await Domma('#el').delay(1000);
```

### Dimensions

#### width(value) / height(value)
Get or set dimensions.
```javascript
const w = Domma('#box').width();
Domma('#box').width(200);
Domma('#box').width('50%');
```

#### innerWidth() / innerHeight()
Get dimensions including padding.
```javascript
const inner = Domma('#box').innerWidth();
```

#### outerWidth(includeMargin) / outerHeight(includeMargin)
Get dimensions including padding, border, and optionally margin.
```javascript
const outer = Domma('#box').outerWidth();
const withMargin = Domma('#box').outerWidth(true);
```

#### offset(coords)
Get or set position relative to document.
```javascript
const pos = Domma('#box').offset();
// => { top: 100, left: 50 }

Domma('#box').offset({ top: 200, left: 100 });
```

#### position()
Get position relative to offset parent.
```javascript
const pos = Domma('#box').position();
// => { top: 10, left: 20 }
```

#### scrollTop(value) / scrollLeft(value)
Get or set scroll position.
```javascript
const scroll = Domma('#container').scrollTop();
Domma('#container').scrollTop(0);
```

#### offsetParent()
Get offset parent element.
```javascript
const parent = Domma('#el').offsetParent();
```

### Iteration and Chaining

#### each(callback)
Iterate over elements.
```javascript
Domma('.item').each((index, element) => {
    console.log(index, element.textContent);
});
```

#### Method Chaining
All setter methods return the collection.
```javascript
Domma('#notification')
    .text('Success!')
    .addClass('visible success')
    .css({ backgroundColor: 'green' })
    .fadeIn(400)
    .click(() => Domma(this).fadeOut());
```

## HTTP Client

### GET Request

```javascript
const data = await Domma.http.get('https://api.example.com/users');
```

### POST Request

```javascript
const response = await Domma.http.post('https://api.example.com/users', {
    name: 'John',
    email: 'john@example.com'
});
```

### PUT Request

Full resource replacement:

```javascript
const response = await Domma.http.put('https://api.example.com/users/1', {
    name: 'John Updated',
    email: 'john.updated@example.com'
});
```

### PATCH Request

Partial update (only specified fields):

```javascript
const response = await Domma.http.patch('https://api.example.com/users/1', {
    name: 'John Updated'  // Only updates name, other fields unchanged
});
```

### DELETE Request

```javascript
await Domma.http.delete('https://api.example.com/users/1');
```

### Custom Headers

```javascript
const data = await Domma.http.get('https://api.example.com/data', {
    headers: {
        'Authorization': 'Bearer token123'
    }
});
```

## JSON Configuration

Define your application's behaviour declaratively:

```javascript
Domma.setup({
    '#header': {
        initial: {
            css: { color: 'blue', fontSize: '24px' },
            text: 'Welcome!',
            addClass: 'header-style'
        },
        events: {
            click: {
                addClass: 'clicked',
                css: { color: 'red' }
            },
            mouseover: [
                { addClass: 'hovered' },
                { target: '#tooltip', css: { display: 'block' } }
            ]
        }
    },
    'button.submit': {
        events: {
            click: {
                target: '#form',
                addClass: 'submitted'
            }
        }
    }
});
```

### Configuration Structure

- **selector**: CSS selector as the key
- **initial**: Properties applied on setup
  - `css`: Object of CSS properties
  - `text`: Text content
  - `html`: HTML content
  - `addClass`: Classes to add
  - `removeClass`: Classes to remove
- **events**: Event handlers
  - Each event can have actions or an array of actions
  - `target`: Optional selector for a different element

## Utilities Reference

All utilities are accessed via `Domma.utils`.

### Array Utilities

#### chunk(array, size)
Creates an array of elements split into groups of the specified size.

```javascript
Domma.utils.chunk([1, 2, 3, 4, 5], 2);
// => [[1, 2], [3, 4], [5]]
```

#### compact(array)
Creates an array with all falsy values removed.

```javascript
Domma.utils.compact([0, 1, false, 2, '', 3, null]);
// => [1, 2, 3]
```

#### concat(array, ...values)
Creates a new array concatenating array with additional arrays/values.

```javascript
Domma.utils.concat([1], 2, [3], [[4]]);
// => [1, 2, 3, [4]]
```

#### difference(array, ...values)
Creates an array of values not included in the other given arrays.

```javascript
Domma.utils.difference([1, 2, 3], [2, 3, 4]);
// => [1]
```

#### drop(array, n)
Creates a slice of array with n elements dropped from the beginning.

```javascript
Domma.utils.drop([1, 2, 3], 2);
// => [3]
```

#### dropRight(array, n)
Creates a slice of array with n elements dropped from the end.

```javascript
Domma.utils.dropRight([1, 2, 3], 2);
// => [1]
```

#### fill(array, value, start, end)
Fills elements of array with value from start up to end.

```javascript
Domma.utils.fill([1, 2, 3], 'a');
// => ['a', 'a', 'a']
```

#### findIndex(array, predicate, fromIndex)
Returns the index of the first element predicate returns truthy for.

```javascript
Domma.utils.findIndex([1, 2, 3, 4], n => n > 2);
// => 2
```

#### findLastIndex(array, predicate, fromIndex)
Returns the index of the last element predicate returns truthy for.

```javascript
Domma.utils.findLastIndex([1, 2, 3, 4], n => n > 2);
// => 3
```

#### first(array) / head(array)
Gets the first element of array.

```javascript
Domma.utils.first([1, 2, 3]);
// => 1
```

#### flatten(array)
Flattens array a single level deep.

```javascript
Domma.utils.flatten([1, [2, [3, [4]]]]);
// => [1, 2, [3, [4]]]
```

#### flattenDeep(array)
Recursively flattens array.

```javascript
Domma.utils.flattenDeep([1, [2, [3, [4]]]]);
// => [1, 2, 3, 4]
```

#### flattenDepth(array, depth)
Flattens array up to depth times.

```javascript
Domma.utils.flattenDepth([1, [2, [3, [4]]]], 2);
// => [1, 2, 3, [4]]
```

#### fromPairs(pairs)
Returns an object composed from key-value pairs.

```javascript
Domma.utils.fromPairs([['a', 1], ['b', 2]]);
// => { a: 1, b: 2 }
```

#### indexOf(array, value, fromIndex)
Gets the index at which the first occurrence of value is found.

```javascript
Domma.utils.indexOf([1, 2, 3, 2], 2);
// => 1
```

#### initial(array)
Gets all but the last element of array.

```javascript
Domma.utils.initial([1, 2, 3]);
// => [1, 2]
```

#### intersection(...arrays)
Creates an array of unique values that are included in all given arrays.

```javascript
Domma.utils.intersection([1, 2, 3], [2, 3, 4], [3, 4, 5]);
// => [3]
```

#### join(array, separator)
Converts all elements in array into a string separated by separator.

```javascript
Domma.utils.join(['a', 'b', 'c'], '-');
// => 'a-b-c'
```

#### last(array)
Gets the last element of array.

```javascript
Domma.utils.last([1, 2, 3]);
// => 3
```

#### lastIndexOf(array, value, fromIndex)
Gets the index at which the last occurrence of value is found.

```javascript
Domma.utils.lastIndexOf([1, 2, 3, 2], 2);
// => 3
```

#### nth(array, n)
Gets the element at index n of array.

```javascript
Domma.utils.nth([1, 2, 3], -1);
// => 3
```

#### pull(array, ...values)
Removes all given values from array (mutates array).

```javascript
const arr = [1, 2, 3, 2, 1];
Domma.utils.pull(arr, 2, 1);
// arr => [3]
```

#### pullAt(array, ...indexes)
Removes elements from array corresponding to indexes.

```javascript
const arr = ['a', 'b', 'c', 'd'];
Domma.utils.pullAt(arr, [1, 3]);
// => ['b', 'd']
// arr => ['a', 'c']
```

#### reverse(array)
Reverses array (mutates array).

```javascript
Domma.utils.reverse([1, 2, 3]);
// => [3, 2, 1]
```

#### slice(array, start, end)
Creates a slice of array from start up to end.

```javascript
Domma.utils.slice([1, 2, 3, 4], 1, 3);
// => [2, 3]
```

#### tail(array)
Gets all but the first element of array.

```javascript
Domma.utils.tail([1, 2, 3]);
// => [2, 3]
```

#### take(array, n)
Creates a slice of array with n elements taken from the beginning.

```javascript
Domma.utils.take([1, 2, 3], 2);
// => [1, 2]
```

#### takeRight(array, n)
Creates a slice of array with n elements taken from the end.

```javascript
Domma.utils.takeRight([1, 2, 3], 2);
// => [2, 3]
```

#### union(...arrays)
Creates an array of unique values, in order, from all given arrays.

```javascript
Domma.utils.union([1, 2], [2, 3], [3, 4]);
// => [1, 2, 3, 4]
```

#### uniq(array)
Creates a duplicate-free version of an array.

```javascript
Domma.utils.uniq([1, 2, 2, 3, 3, 3]);
// => [1, 2, 3]
```

#### uniqBy(array, iteratee)
Creates a duplicate-free version using iteratee.

```javascript
Domma.utils.uniqBy([{ x: 1 }, { x: 2 }, { x: 1 }], o => o.x);
// => [{ x: 1 }, { x: 2 }]
```

#### without(array, ...values)
Creates an array excluding all given values.

```javascript
Domma.utils.without([1, 2, 3, 2, 1], 1, 2);
// => [3]
```

#### xor(...arrays)
Creates an array of unique values that is the symmetric difference.

```javascript
Domma.utils.xor([1, 2], [2, 3]);
// => [1, 3]
```

#### zip(...arrays)
Creates an array of grouped elements.

```javascript
Domma.utils.zip(['a', 'b'], [1, 2], [true, false]);
// => [['a', 1, true], ['b', 2, false]]
```

#### zipObject(keys, values)
Creates an object composed from arrays of keys and values.

```javascript
Domma.utils.zipObject(['a', 'b'], [1, 2]);
// => { a: 1, b: 2 }
```

### Collection Utilities

#### countBy(collection, iteratee)
Creates an object composed of keys generated from the results of running each element through iteratee.

```javascript
Domma.utils.countBy([6.1, 4.2, 6.3], Math.floor);
// => { 4: 1, 6: 2 }
```

#### each(collection, iteratee) / forEach(collection, iteratee)
Iterates over elements invoking iteratee for each element.

```javascript
Domma.utils.each([1, 2, 3], n => console.log(n));
Domma.utils.each({ a: 1, b: 2 }, (value, key) => console.log(key, value));
```

#### eachRight(collection, iteratee) / forEachRight(collection, iteratee)
Iterates over elements in reverse invoking iteratee for each element.

```javascript
Domma.utils.eachRight([1, 2, 3], n => console.log(n));
// Logs: 3, 2, 1
```

#### every(collection, predicate)
Checks if predicate returns truthy for all elements of collection.

```javascript
Domma.utils.every([2, 4, 6], n => n % 2 === 0);
// => true
```

#### filter(collection, predicate)
Iterates over elements returning an array of all elements predicate returns truthy for.

```javascript
Domma.utils.filter([1, 2, 3, 4], n => n > 2);
// => [3, 4]
```

#### find(collection, predicate)
Iterates over elements returning the first element predicate returns truthy for.

```javascript
Domma.utils.find([1, 2, 3, 4], n => n > 2);
// => 3
```

#### findLast(collection, predicate)
Iterates over elements returning the last element predicate returns truthy for.

```javascript
Domma.utils.findLast([1, 2, 3, 4], n => n > 2);
// => 4
```

#### flatMap(collection, iteratee)
Creates a flattened array of values by running each element through iteratee.

```javascript
Domma.utils.flatMap([1, 2], n => [n, n]);
// => [1, 1, 2, 2]
```

#### flatMapDeep(collection, iteratee)
Recursively flattens the mapped results.

```javascript
Domma.utils.flatMapDeep([1, 2], n => [[n, n]]);
// => [1, 1, 2, 2]
```

#### groupBy(collection, iteratee)
Creates an object composed of keys generated from the results of running each element through iteratee.

```javascript
Domma.utils.groupBy([6.1, 4.2, 6.3], Math.floor);
// => { 4: [4.2], 6: [6.1, 6.3] }

Domma.utils.groupBy(['one', 'two', 'three'], 'length');
// => { 3: ['one', 'two'], 5: ['three'] }
```

#### includes(collection, value, fromIndex)
Checks if value is in collection.

```javascript
Domma.utils.includes([1, 2, 3], 2);
// => true

Domma.utils.includes('hello', 'ell');
// => true
```

#### keyBy(collection, iteratee)
Creates an object composed of keys generated from the results of running each element through iteratee.

```javascript
const users = [{ id: 'a1', name: 'John' }, { id: 'b2', name: 'Jane' }];
Domma.utils.keyBy(users, 'id');
// => { a1: { id: 'a1', name: 'John' }, b2: { id: 'b2', name: 'Jane' } }
```

#### map(collection, iteratee)
Creates an array of values by running each element through iteratee.

```javascript
Domma.utils.map([1, 2, 3], n => n * 2);
// => [2, 4, 6]

Domma.utils.map({ a: 1, b: 2 }, (value, key) => key + value);
// => ['a1', 'b2']
```

#### orderBy(collection, iteratees, orders)
Creates an array of elements sorted in ascending order by the results of running each element through each iteratee.

```javascript
const users = [
    { name: 'John', age: 30 },
    { name: 'Jane', age: 25 },
    { name: 'John', age: 25 }
];
Domma.utils.orderBy(users, ['name', 'age'], ['asc', 'desc']);
// => [{ name: 'Jane', age: 25 }, { name: 'John', age: 30 }, { name: 'John', age: 25 }]
```

#### partition(collection, predicate)
Creates an array of elements split into two groups.

```javascript
Domma.utils.partition([1, 2, 3, 4], n => n > 2);
// => [[3, 4], [1, 2]]
```

#### reduce(collection, iteratee, accumulator)
Reduces collection to a value which is the accumulated result of running each element through iteratee.

```javascript
Domma.utils.reduce([1, 2, 3], (sum, n) => sum + n, 0);
// => 6

Domma.utils.reduce({ a: 1, b: 2 }, (result, value, key) => {
    result[value] = key;
    return result;
}, {});
// => { 1: 'a', 2: 'b' }
```

#### reduceRight(collection, iteratee, accumulator)
Reduces collection from right to left.

```javascript
Domma.utils.reduceRight([[0, 1], [2, 3], [4, 5]], (arr, n) => arr.concat(n), []);
// => [4, 5, 2, 3, 0, 1]
```

#### reject(collection, predicate)
The opposite of filter; returns elements predicate does not return truthy for.

```javascript
Domma.utils.reject([1, 2, 3, 4], n => n > 2);
// => [1, 2]
```

#### sample(collection)
Gets a random element from collection.

```javascript
Domma.utils.sample([1, 2, 3, 4]);
// => 2 (random)
```

#### sampleSize(collection, n)
Gets n random elements from collection.

```javascript
Domma.utils.sampleSize([1, 2, 3, 4], 2);
// => [3, 1] (random)
```

#### shuffle(collection)
Creates a shuffled array using Fisher-Yates shuffle.

```javascript
Domma.utils.shuffle([1, 2, 3, 4]);
// => [3, 1, 4, 2] (random)
```

#### size(collection)
Gets the size of collection.

```javascript
Domma.utils.size([1, 2, 3]);
// => 3

Domma.utils.size({ a: 1, b: 2 });
// => 2

Domma.utils.size('hello');
// => 5
```

#### some(collection, predicate)
Checks if predicate returns truthy for any element of collection.

```javascript
Domma.utils.some([1, 2, 3], n => n > 2);
// => true
```

#### sortBy(collection, iteratee)
Creates an array of elements sorted in ascending order by the results of running each element through iteratee.

```javascript
Domma.utils.sortBy([{ n: 3 }, { n: 1 }, { n: 2 }], 'n');
// => [{ n: 1 }, { n: 2 }, { n: 3 }]

Domma.utils.sortBy([3, 1, 2], n => n);
// => [1, 2, 3]
```

### Function Utilities

#### after(n, func)
Creates a function that invokes func once it's called n or more times.

```javascript
const done = Domma.utils.after(3, () => console.log('Done!'));
done(); // No output
done(); // No output
done(); // 'Done!'
```

#### ary(func, n)
Creates a function that invokes func, with up to n arguments.

```javascript
const capped = Domma.utils.ary(Math.max, 2);
capped(1, 2, 3, 4);
// => 2
```

#### before(n, func)
Creates a function that invokes func while it's called less than n times.

```javascript
const limited = Domma.utils.before(3, () => console.log('Called'));
limited(); // 'Called'
limited(); // 'Called'
limited(); // No output
```

#### bind(func, thisArg, ...partials)
Creates a function that invokes func with the this binding of thisArg.

```javascript
const greet = function(greeting) {
    return greeting + ' ' + this.name;
};
const bound = Domma.utils.bind(greet, { name: 'John' }, 'Hello');
bound();
// => 'Hello John'
```

#### curry(func, arity)
Creates a function that accepts arguments of func and returns a function.

```javascript
const add = (a, b, c) => a + b + c;
const curried = Domma.utils.curry(add);
curried(1)(2)(3);
// => 6
curried(1, 2)(3);
// => 6
```

#### curryRight(func, arity)
Creates a function that accepts arguments of func and returns a function (right to left).

```javascript
const divide = (a, b, c) => a / b / c;
const curried = Domma.utils.curryRight(divide);
curried(2)(4)(8);
// => 1
```

#### debounce(func, wait, options)
Creates a debounced function that delays invoking func until after wait milliseconds.

```javascript
const search = Domma.utils.debounce((query) => {
    console.log('Searching:', query);
}, 300);

// Rapid calls only trigger one execution after 300ms
search('a');
search('ab');
search('abc'); // Only this executes after 300ms

// Options
const leadingSearch = Domma.utils.debounce(search, 300, { leading: true });
const maxWaitSearch = Domma.utils.debounce(search, 300, { maxWait: 1000 });

// Cancel pending execution
search.cancel();

// Immediately execute pending
search.flush();
```

#### defer(func, ...args)
Defers invoking the func until the current call stack has cleared.

```javascript
Domma.utils.defer(() => console.log('deferred'));
console.log('immediate');
// Logs: 'immediate', then 'deferred'
```

#### delay(func, wait, ...args)
Invokes func after wait milliseconds.

```javascript
Domma.utils.delay((text) => console.log(text), 1000, 'Hello');
// Logs 'Hello' after 1 second
```

#### flip(func)
Creates a function that invokes func with arguments reversed.

```javascript
const flipped = Domma.utils.flip((...args) => args);
flipped('a', 'b', 'c');
// => ['c', 'b', 'a']
```

#### memoize(func, resolver)
Creates a function that memoizes the result of func.

```javascript
const expensive = Domma.utils.memoize((n) => {
    console.log('Computing...');
    return n * 2;
});

expensive(5); // Logs 'Computing...', returns 10
expensive(5); // Returns 10 (cached)

// Custom resolver
const customMemo = Domma.utils.memoize(
    (obj) => obj.x + obj.y,
    (obj) => `${obj.x}-${obj.y}`
);
```

#### negate(predicate)
Creates a function that negates the result of the predicate func.

```javascript
const isEven = n => n % 2 === 0;
const isOdd = Domma.utils.negate(isEven);
isOdd(3);
// => true
```

#### once(func)
Creates a function that is restricted to invoking func once.

```javascript
const init = Domma.utils.once(() => {
    console.log('Initializing...');
    return { ready: true };
});

init(); // Logs 'Initializing...', returns { ready: true }
init(); // Returns { ready: true } (no log)
```

#### partial(func, ...partials)
Creates a function that invokes func with partials prepended.

```javascript
const greet = (greeting, name) => greeting + ' ' + name;
const sayHello = Domma.utils.partial(greet, 'Hello');
sayHello('John');
// => 'Hello John'
```

#### partialRight(func, ...partials)
Creates a function that invokes func with partials appended.

```javascript
const greet = (greeting, name) => greeting + ' ' + name;
const greetJohn = Domma.utils.partialRight(greet, 'John');
greetJohn('Hello');
// => 'Hello John'
```

#### throttle(func, wait, options)
Creates a throttled function that only invokes func at most once per every wait milliseconds.

```javascript
const scroll = Domma.utils.throttle(() => {
    console.log('Scrolled!');
}, 100);

window.addEventListener('scroll', scroll);

// Options
const noLeading = Domma.utils.throttle(fn, 100, { leading: false });
const noTrailing = Domma.utils.throttle(fn, 100, { trailing: false });
```

#### unary(func)
Creates a function that accepts up to one argument.

```javascript
const unaryParseInt = Domma.utils.unary(parseInt);
['1', '2', '3'].map(unaryParseInt);
// => [1, 2, 3] (not [1, NaN, NaN])
```

#### wrap(value, wrapper)
Creates a function that provides value to wrapper as its first argument.

```javascript
const p = Domma.utils.wrap('Hello', (value, name) => `<p>${value}, ${name}!</p>`);
p('John');
// => '<p>Hello, John!</p>'
```

### Object Utilities

#### assign(object, ...sources)
Assigns own enumerable string keyed properties of source objects to the destination object.

```javascript
Domma.utils.assign({ a: 1 }, { b: 2 }, { c: 3 });
// => { a: 1, b: 2, c: 3 }
```

#### assignIn(object, ...sources) / extend(object, ...sources)
Like assign but iterates over own and inherited source properties.

```javascript
function Foo() { this.a = 1; }
Foo.prototype.b = 2;
Domma.utils.assignIn({ c: 3 }, new Foo());
// => { c: 3, a: 1, b: 2 }
```

#### at(object, ...paths)
Creates an array of values corresponding to paths of object.

```javascript
const obj = { a: { b: { c: 3 } }, x: [1, 2, 3] };
Domma.utils.at(obj, 'a.b.c', 'x[1]');
// => [3, 2]
```

#### clone(value)
Creates a shallow clone of value.

```javascript
const obj = { a: 1, b: { c: 2 } };
const shallow = Domma.utils.clone(obj);
shallow.a = 10;
shallow.b.c = 20;
// obj.a => 1 (unchanged)
// obj.b.c => 20 (changed - shallow clone)
```

#### cloneDeep(value)
Creates a deep clone of value.

```javascript
const obj = { a: 1, b: { c: 2 } };
const deep = Domma.utils.cloneDeep(obj);
deep.b.c = 20;
// obj.b.c => 2 (unchanged)
```

#### defaults(object, ...sources)
Assigns own properties of source objects to the destination object for all destination properties that resolve to undefined.

```javascript
Domma.utils.defaults({ a: 1 }, { a: 2, b: 2 }, { c: 3 });
// => { a: 1, b: 2, c: 3 }
```

#### defaultsDeep(object, ...sources)
Like defaults but recursively assigns default properties.

```javascript
Domma.utils.defaultsDeep({ a: { b: 1 } }, { a: { b: 2, c: 3 } });
// => { a: { b: 1, c: 3 } }
```

#### entries(object) / toPairs(object)
Creates an array of own enumerable string keyed-value pairs.

```javascript
Domma.utils.entries({ a: 1, b: 2 });
// => [['a', 1], ['b', 2]]
```

#### findKey(object, predicate)
Returns the key of the first element predicate returns truthy for.

```javascript
const users = { barney: { age: 36 }, fred: { age: 40 } };
Domma.utils.findKey(users, o => o.age < 40);
// => 'barney'
```

#### findLastKey(object, predicate)
Returns the key of the last element predicate returns truthy for.

```javascript
const users = { barney: { age: 36 }, fred: { age: 40 }, pebbles: { age: 35 } };
Domma.utils.findLastKey(users, o => o.age < 40);
// => 'pebbles'
```

#### forIn(object, iteratee)
Iterates over own and inherited enumerable string keyed properties of an object.

```javascript
function Foo() { this.a = 1; }
Foo.prototype.b = 2;
Domma.utils.forIn(new Foo(), (value, key) => console.log(key));
// Logs: 'a', 'b'
```

#### forOwn(object, iteratee)
Iterates over own enumerable string keyed properties of an object.

```javascript
Domma.utils.forOwn({ a: 1, b: 2 }, (value, key) => console.log(key));
// Logs: 'a', 'b'
```

#### get(object, path, defaultValue)
Gets the value at path of object.

```javascript
const obj = { a: { b: { c: 3 } }, x: [1, 2, 3] };

Domma.utils.get(obj, 'a.b.c');
// => 3

Domma.utils.get(obj, 'x[1]');
// => 2

Domma.utils.get(obj, 'a.b.d', 'default');
// => 'default'

Domma.utils.get(obj, ['a', 'b', 'c']);
// => 3
```

#### has(object, path)
Checks if path is a direct property of object.

```javascript
const obj = { a: { b: 2 } };

Domma.utils.has(obj, 'a.b');
// => true

Domma.utils.has(obj, 'a.c');
// => false
```

#### invert(object)
Creates an object composed of the inverted keys and values of object.

```javascript
Domma.utils.invert({ a: 1, b: 2 });
// => { 1: 'a', 2: 'b' }
```

#### invertBy(object, iteratee)
Like invert but accepts iteratee which is invoked for each element.

```javascript
Domma.utils.invertBy({ a: 1, b: 2, c: 1 });
// => { 1: ['a', 'c'], 2: ['b'] }
```

#### keys(object)
Creates an array of the own enumerable property names of object.

```javascript
Domma.utils.keys({ a: 1, b: 2 });
// => ['a', 'b']
```

#### keysIn(object)
Creates an array of own and inherited enumerable property names.

```javascript
function Foo() { this.a = 1; }
Foo.prototype.b = 2;
Domma.utils.keysIn(new Foo());
// => ['a', 'b']
```

#### mapKeys(object, iteratee)
Creates an object with the same values as object and keys generated by running each own enumerable property through iteratee.

```javascript
Domma.utils.mapKeys({ a: 1, b: 2 }, (value, key) => key + value);
// => { a1: 1, b2: 2 }
```

#### mapValues(object, iteratee)
Creates an object with the same keys as object and values generated by running each own enumerable property through iteratee.

```javascript
Domma.utils.mapValues({ a: 1, b: 2 }, n => n * 2);
// => { a: 2, b: 4 }
```

#### merge(object, ...sources)
Recursively merges own and inherited enumerable properties of source objects into the destination object.

```javascript
Domma.utils.merge({ a: { b: 1 } }, { a: { c: 2 } });
// => { a: { b: 1, c: 2 } }
```

#### omit(object, ...paths)
Creates an object composed of the own enumerable properties of object that are not omitted.

```javascript
Domma.utils.omit({ a: 1, b: 2, c: 3 }, 'a', 'c');
// => { b: 2 }
```

#### omitBy(object, predicate)
Creates an object composed of the properties predicate doesn't return truthy for.

```javascript
Domma.utils.omitBy({ a: 1, b: '2', c: 3 }, Domma.utils.isNumber);
// => { b: '2' }
```

#### pick(object, ...paths)
Creates an object composed of the picked object properties.

```javascript
Domma.utils.pick({ a: 1, b: 2, c: 3 }, 'a', 'c');
// => { a: 1, c: 3 }
```

#### pickBy(object, predicate)
Creates an object composed of the properties predicate returns truthy for.

```javascript
Domma.utils.pickBy({ a: 1, b: '2', c: 3 }, Domma.utils.isNumber);
// => { a: 1, c: 3 }
```

#### set(object, path, value)
Sets the value at path of object.

```javascript
const obj = {};
Domma.utils.set(obj, 'a.b.c', 1);
// obj => { a: { b: { c: 1 } } }

Domma.utils.set(obj, 'x[0].y', 2);
// obj => { a: { b: { c: 1 } }, x: [{ y: 2 }] }
```

#### unset(object, path)
Removes the property at path of object.

```javascript
const obj = { a: { b: { c: 1 } } };
Domma.utils.unset(obj, 'a.b.c');
// obj => { a: { b: {} } }
```

#### values(object)
Creates an array of own enumerable string keyed property values of object.

```javascript
Domma.utils.values({ a: 1, b: 2 });
// => [1, 2]
```

#### valuesIn(object)
Creates an array of own and inherited enumerable property values.

```javascript
function Foo() { this.a = 1; }
Foo.prototype.b = 2;
Domma.utils.valuesIn(new Foo());
// => [1, 2]
```

### Lang Utilities

#### isArray(value)
Checks if value is an Array.

```javascript
Domma.utils.isArray([1, 2, 3]);
// => true
```

#### isBoolean(value)
Checks if value is a boolean primitive or object.

```javascript
Domma.utils.isBoolean(true);
// => true
```

#### isDate(value)
Checks if value is a Date object.

```javascript
Domma.utils.isDate(new Date());
// => true
```

#### isEmpty(value)
Checks if value is an empty object, collection, map, or set.

```javascript
Domma.utils.isEmpty([]);
// => true

Domma.utils.isEmpty({});
// => true

Domma.utils.isEmpty('');
// => true

Domma.utils.isEmpty([1]);
// => false
```

#### isEqual(value, other)
Performs a deep comparison between two values.

```javascript
Domma.utils.isEqual({ a: 1 }, { a: 1 });
// => true

Domma.utils.isEqual([1, 2, 3], [1, 2, 3]);
// => true
```

#### isFinite(value)
Checks if value is a finite number.

```javascript
Domma.utils.isFinite(3);
// => true

Domma.utils.isFinite(Infinity);
// => false
```

#### isFunction(value)
Checks if value is a Function object.

```javascript
Domma.utils.isFunction(() => {});
// => true
```

#### isInteger(value)
Checks if value is an integer.

```javascript
Domma.utils.isInteger(3);
// => true

Domma.utils.isInteger(3.5);
// => false
```

#### isNaN(value)
Checks if value is NaN.

```javascript
Domma.utils.isNaN(NaN);
// => true

Domma.utils.isNaN(undefined);
// => false
```

#### isNil(value)
Checks if value is null or undefined.

```javascript
Domma.utils.isNil(null);
// => true

Domma.utils.isNil(undefined);
// => true
```

#### isNull(value)
Checks if value is null.

```javascript
Domma.utils.isNull(null);
// => true
```

#### isNumber(value)
Checks if value is a number primitive or object.

```javascript
Domma.utils.isNumber(3);
// => true
```

#### isObject(value)
Checks if value is the language type of Object.

```javascript
Domma.utils.isObject({});
// => true

Domma.utils.isObject([]);
// => true

Domma.utils.isObject(null);
// => false
```

#### isPlainObject(value)
Checks if value is a plain object.

```javascript
Domma.utils.isPlainObject({ a: 1 });
// => true

Domma.utils.isPlainObject(new Date());
// => false
```

#### isRegExp(value)
Checks if value is a RegExp object.

```javascript
Domma.utils.isRegExp(/abc/);
// => true
```

#### isString(value)
Checks if value is a string primitive or object.

```javascript
Domma.utils.isString('hello');
// => true
```

#### isSymbol(value)
Checks if value is a Symbol primitive.

```javascript
Domma.utils.isSymbol(Symbol('x'));
// => true
```

#### isUndefined(value)
Checks if value is undefined.

```javascript
Domma.utils.isUndefined(undefined);
// => true
```

### Math Utilities

#### add(augend, addend)
Adds two numbers.

```javascript
Domma.utils.add(6, 4);
// => 10
```

#### ceil(number, precision)
Computes number rounded up to precision.

```javascript
Domma.utils.ceil(4.006);
// => 5

Domma.utils.ceil(4.006, 2);
// => 4.01
```

#### divide(dividend, divisor)
Divide two numbers.

```javascript
Domma.utils.divide(6, 4);
// => 1.5
```

#### floor(number, precision)
Computes number rounded down to precision.

```javascript
Domma.utils.floor(4.996);
// => 4

Domma.utils.floor(4.996, 2);
// => 4.99
```

#### max(array)
Computes the maximum value of array.

```javascript
Domma.utils.max([4, 2, 8, 6]);
// => 8
```

#### maxBy(array, iteratee)
Computes the maximum value of array with iteratee.

```javascript
const objects = [{ n: 1 }, { n: 2 }];
Domma.utils.maxBy(objects, o => o.n);
// => { n: 2 }
```

#### mean(array)
Computes the mean of the values in array.

```javascript
Domma.utils.mean([4, 2, 8, 6]);
// => 5
```

#### meanBy(array, iteratee)
Computes the mean using iteratee.

```javascript
const objects = [{ n: 4 }, { n: 2 }, { n: 8 }, { n: 6 }];
Domma.utils.meanBy(objects, o => o.n);
// => 5
```

#### min(array)
Computes the minimum value of array.

```javascript
Domma.utils.min([4, 2, 8, 6]);
// => 2
```

#### minBy(array, iteratee)
Computes the minimum value of array with iteratee.

```javascript
const objects = [{ n: 1 }, { n: 2 }];
Domma.utils.minBy(objects, o => o.n);
// => { n: 1 }
```

#### multiply(multiplier, multiplicand)
Multiply two numbers.

```javascript
Domma.utils.multiply(6, 4);
// => 24
```

#### round(number, precision)
Computes number rounded to precision.

```javascript
Domma.utils.round(4.006);
// => 4

Domma.utils.round(4.006, 2);
// => 4.01
```

#### subtract(minuend, subtrahend)
Subtract two numbers.

```javascript
Domma.utils.subtract(6, 4);
// => 2
```

#### sum(array)
Computes the sum of the values in array.

```javascript
Domma.utils.sum([4, 2, 8, 6]);
// => 20
```

#### sumBy(array, iteratee)
Computes the sum using iteratee.

```javascript
const objects = [{ n: 4 }, { n: 2 }, { n: 8 }];
Domma.utils.sumBy(objects, o => o.n);
// => 14
```

### Number Utilities

#### clamp(number, lower, upper)
Clamps number within the inclusive lower and upper bounds.

```javascript
Domma.utils.clamp(-10, -5, 5);
// => -5

Domma.utils.clamp(10, -5, 5);
// => 5
```

#### inRange(number, start, end)
Checks if n is between start and up to but not including end.

```javascript
Domma.utils.inRange(3, 2, 4);
// => true

Domma.utils.inRange(4, 8);
// => true (0 to 8)

Domma.utils.inRange(-3, -2, -6);
// => true
```

#### random(lower, upper, floating)
Produces a random number between the inclusive lower and upper bounds.

```javascript
Domma.utils.random(0, 5);
// => integer between 0 and 5

Domma.utils.random(5);
// => integer between 0 and 5

Domma.utils.random(1.2, 5.2);
// => floating-point number between 1.2 and 5.2

Domma.utils.random(0, 5, true);
// => floating-point number between 0 and 5
```

### String Utilities

#### camelCase(string)
Converts string to camel case.

```javascript
Domma.utils.camelCase('Foo Bar');
// => 'fooBar'

Domma.utils.camelCase('--foo-bar--');
// => 'fooBar'

Domma.utils.camelCase('__FOO_BAR__');
// => 'fooBar'
```

#### capitalize(string)
Converts the first character of string to upper case and the remaining to lower case.

```javascript
Domma.utils.capitalize('HELLO');
// => 'Hello'
```

#### endsWith(string, target, position)
Checks if string ends with the given target string.

```javascript
Domma.utils.endsWith('hello', 'lo');
// => true

Domma.utils.endsWith('hello', 'l', 4);
// => true
```

#### escape(string)
Converts the characters "&", "<", ">", '"', and "'" to HTML entities.

```javascript
Domma.utils.escape('<script>alert("xss")</script>');
// => '&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;'
```

#### kebabCase(string)
Converts string to kebab case.

```javascript
Domma.utils.kebabCase('Foo Bar');
// => 'foo-bar'

Domma.utils.kebabCase('fooBar');
// => 'foo-bar'
```

#### lowerCase(string)
Converts string, as space separated words, to lower case.

```javascript
Domma.utils.lowerCase('--Foo-Bar--');
// => 'foo bar'
```

#### lowerFirst(string)
Converts the first character of string to lower case.

```javascript
Domma.utils.lowerFirst('Hello');
// => 'hello'
```

#### pad(string, length, chars)
Pads string on the left and right sides if it's shorter than length.

```javascript
Domma.utils.pad('abc', 8);
// => '  abc   '

Domma.utils.pad('abc', 8, '_-');
// => '_-abc_-_'
```

#### padEnd(string, length, chars)
Pads string on the right side if it's shorter than length.

```javascript
Domma.utils.padEnd('abc', 6);
// => 'abc   '

Domma.utils.padEnd('abc', 6, '_-');
// => 'abc_-_'
```

#### padStart(string, length, chars)
Pads string on the left side if it's shorter than length.

```javascript
Domma.utils.padStart('abc', 6);
// => '   abc'

Domma.utils.padStart('abc', 6, '_-');
// => '_-_abc'
```

#### repeat(string, n)
Repeats the given string n times.

```javascript
Domma.utils.repeat('*', 3);
// => '***'
```

#### replace(string, pattern, replacement)
Replaces matches for pattern in string with replacement.

```javascript
Domma.utils.replace('Hi Fred', 'Fred', 'Barney');
// => 'Hi Barney'
```

#### snakeCase(string)
Converts string to snake case.

```javascript
Domma.utils.snakeCase('Foo Bar');
// => 'foo_bar'

Domma.utils.snakeCase('fooBar');
// => 'foo_bar'
```

#### split(string, separator, limit)
Splits string by separator.

```javascript
Domma.utils.split('a-b-c', '-', 2);
// => ['a', 'b']
```

#### startCase(string)
Converts string to start case.

```javascript
Domma.utils.startCase('--foo-bar--');
// => 'Foo Bar'

Domma.utils.startCase('fooBar');
// => 'Foo Bar'
```

#### startsWith(string, target, position)
Checks if string starts with the given target string.

```javascript
Domma.utils.startsWith('hello', 'he');
// => true

Domma.utils.startsWith('hello', 'el', 1);
// => true
```

#### toLower(string)
Converts string to lowercase.

```javascript
Domma.utils.toLower('HELLO');
// => 'hello'
```

#### toUpper(string)
Converts string to uppercase.

```javascript
Domma.utils.toUpper('hello');
// => 'HELLO'
```

#### trim(string, chars)
Removes leading and trailing whitespace or specified characters from string.

```javascript
Domma.utils.trim('  hello  ');
// => 'hello'

Domma.utils.trim('-_-hello-_-', '_-');
// => 'hello'
```

#### trimEnd(string, chars)
Removes trailing whitespace or specified characters from string.

```javascript
Domma.utils.trimEnd('  hello  ');
// => '  hello'

Domma.utils.trimEnd('-_-hello-_-', '_-');
// => '-_-hello'
```

#### trimStart(string, chars)
Removes leading whitespace or specified characters from string.

```javascript
Domma.utils.trimStart('  hello  ');
// => 'hello  '

Domma.utils.trimStart('-_-hello-_-', '_-');
// => 'hello-_-'
```

#### truncate(string, options)
Truncates string if it's longer than the given maximum string length.

```javascript
Domma.utils.truncate('hi-diddly-ho there, neighborino');
// => 'hi-diddly-ho there, neighbo...'

Domma.utils.truncate('hi-diddly-ho there, neighborino', {
    length: 24,
    separator: ' '
});
// => 'hi-diddly-ho there,...'

Domma.utils.truncate('hi-diddly-ho there, neighborino', {
    length: 24,
    omission: ' [...]'
});
// => 'hi-diddly-ho there [...]'
```

#### unescape(string)
The inverse of escape; converts HTML entities to their corresponding characters.

```javascript
Domma.utils.unescape('&lt;script&gt;');
// => '<script>'
```

#### upperCase(string)
Converts string, as space separated words, to upper case.

```javascript
Domma.utils.upperCase('--foo-bar');
// => 'FOO BAR'
```

#### upperFirst(string)
Converts the first character of string to upper case.

```javascript
Domma.utils.upperFirst('hello');
// => 'Hello'
```

#### words(string, pattern)
Splits string into an array of its words.

```javascript
Domma.utils.words('fred, barney, & pebbles');
// => ['fred', 'barney', 'pebbles']

Domma.utils.words('fred, barney, & pebbles', /[^, ]+/g);
// => ['fred', 'barney', '&', 'pebbles']
```

---

## NumberBadge

`NumberBadge` is a positioned notification counter that attaches to any element. It is distinct from the flat `Badge`
component - a NumberBadge is absolutely positioned over its parent and is designed for notification counts, unread
indicators, and attention-grabbing status dots.

### CSS-Only Usage

Wrap the target element and add a `badge-number` span:

```html
<!-- Numeric counter -->
<div class="badge-number-wrapper">
  <button class="btn btn-primary">Inbox</button>
  <span class="badge-number badge-number-primary">5</span>
</div>

<!-- Dot mode - no number, just an indicator -->
<div class="badge-number-wrapper">
  <button class="btn btn-secondary">Alerts</button>
  <span class="badge-number badge-number-danger badge-dot"></span>
</div>

<!-- With pulse animation -->
<div class="badge-number-wrapper">
  <button class="btn btn-info">Updates</button>
  <span class="badge-number badge-number-warning badge-counter-pulse">3</span>
</div>
```

Available colour modifier classes: `badge-number-primary`, `badge-number-danger`, `badge-number-success`,
`badge-number-warning`, `badge-number-info`.

### JavaScript API

Use `Domma.elements.numberBadge()` (alias `E.numberBadge()`) to create and manage a badge programmatically:

```javascript
// Attach a counter to a button
const nb = E.numberBadge('#inbox-btn', {
    count: 5,
    variant: 'danger',
    pulse: true
});

// Update count
nb.increment();       // 6
nb.increment(4);      // 10
nb.decrement();       // 9
nb.setCount(0);       // 0

// Read current value
console.log(nb.getCount()); // 0

// Switch to dot mode (useful when count is zero but you still want an indicator)
nb.setDot(true);

// Change colour variant
nb.setVariant('success');

// Toggle pulse animation
nb.setPulse(false);

// Remove from DOM when no longer needed
nb.destroy();
```

**Common options:**

| Option     | Default       | Description                                                           |
|------------|---------------|-----------------------------------------------------------------------|
| `count`    | `0`           | Initial count                                                         |
| `variant`  | `'primary'`   | Colour: `'primary'`, `'danger'`, `'success'`, `'warning'`, `'info'`  |
| `dot`      | `false`       | Show as a dot with no number                                          |
| `pulse`    | `false`       | Pulsing animation                                                     |
| `max`      | `99`          | Counts above this display as `99+` (or `{max}+`)                     |

See the [NumberBadge showcase](../public/showcase/elements/number-badge/) for interactive examples.

---

## Chooser

The Chooser is a visual option-picker - the form-friendly equivalent of native radio/checkbox controls when richer presentation is needed. A single component covers four combinations driven by parameters:

|                | `multiple: false` | `multiple: true` |
|----------------|-------------------|------------------|
| `variant: 'card'` | Single-select cards (radio-style) | Multi-select cards (checkbox-style) |
| `variant: 'chip'` | Single-select chips | Multi-select chips |

Each combination supports `density: 'comfortable' | 'compact'` and per-option metadata: `icon`, `description`, `tooltip`, `badge: { text, type }`, `recommended`, `disabled`.

```javascript
// Standalone
Domma.elements.chooser('#host', {
    variant: 'card',
    columns: 3,
    options: [
        { value: 'starter', label: 'Starter', icon: 'rocket',
          description: 'For solo builders.' },
        { value: 'pro',     label: 'Pro',     icon: 'zap',
          description: 'Teams up to 10.',
          recommended: true,
          badge: { text: 'POPULAR', type: 'success' } },
        { value: 'ent',     label: 'Enterprise', icon: 'briefcase',
          description: 'Custom limits + SSO.' }
    ],
    onChange: (value) => console.log('Picked:', value)
});

// Inside a form blueprint
Domma.forms.create({
    plan: {
        type: 'chooser',
        variant: 'card',
        label: 'Choose your plan',
        required: true,
        options: [/* … */]
    }
}).renderTo('#my-form');
```

### Visual options

Six top-level options polish the look of any chooser. All accept either a semantic colour name (`primary`, `success`, `info`, `warning`, `danger`) which maps to a Domma CSS variable, or any literal CSS colour string (`#hex`, `rgb()`, `hsl()`).

| Option | Type | Default | Description |
|---|---|---|---|
| `accent` | semantic name or CSS colour | `'primary'` | Selected/recommended highlight colour |
| `accentStyle` | `'border'` \| `'solid'` \| `'glow'` \| `'overlay'` \| `'underline'` | `'border'` | Visual treatment of the selected state |
| `glow` | `boolean` | `false` | Soft outer glow on the selected option |
| `glowColour` | semantic name or CSS colour, or `null` | `null` (uses `accent`) | Glow colour override |
| `shadow` | `'none'` \| `'sm'` \| `'md'` \| `'lg'` \| `'xl'` | `'none'` | Shadow weight applied to every option |
| `shadowColour` | CSS colour string | `null` | Optional shadow tint |

```javascript
Domma.elements.chooser('#host', {
    variant: 'card',
    accent: '#ec4899',          // any CSS colour
    accentStyle: 'glow',        // five styles available
    glow: true,
    glowColour: '#ec4899',
    shadow: 'lg',
    options: [/* … */]
});
```

**Accent style at a glance:**

- `border` - coloured border + subtle tinted background (default)
- `solid` - fully filled tile in the accent colour, white text
- `glow` - clean transparent border with a glowing accent ring
- `overlay` - heavier translucent fill over the card background
- `underline` - minimal: only a thick coloured bottom border

Semantic colours stay theme-aware automatically (they reference Domma CSS variables); arbitrary hex/rgb values are applied as inline CSS custom properties on the chooser root, so they retint nothing but remain consistent across the four matrix combinations.

### Theme awareness

The chooser uses Domma's CSS variables (`--dm-primary`, `--dm-card-bg`, `--dm-border`, `--dm-success`, `--dm-text-muted`), so it retints automatically across all themes (charcoal, ocean, forest, sunset, lemon, mint, dreamy, christmas) and both light/dark variants - no per-theme overrides required. Switch themes at runtime via `Domma.theme.set('ocean-dark')` and the chooser updates live.

### Accessibility

- `multiple: false` → `role="radiogroup"`; arrow keys move and select; Enter/Space confirm
- `multiple: true` → `role="group"`; Tab between options; Space toggles
- `aria-checked` reflects each option's selection state
- Disabled options skipped by keyboard navigation
- Hidden native `<input type="radio|checkbox">` elements emit when `name` is set, so the value is captured by `FormData` even with JS disabled
- Respects `prefers-reduced-motion`

See the [Chooser showcase](../public/showcase/elements/chooser/) for interactive examples covering all four matrix combinations, every per-option flag, theme switching, accessibility, and form integration. See [Blueprints.md](./Blueprints.md#chooser-fields) for the blueprint shape.

---

## Themes

### Admin family (standalone)

The **Admin** family is a mid-weight, corporate theme set built for dashboards. It has no
light/dark variant - it is its own family of six themes, a 2 × 3 matrix of **finish** × **accent**:

- **Finishes:** `smooth` (uniform mid-tone surfaces) · `sharp` (dark chrome + tinted-light workspace)
- **Accents:** `steel` (#3b76bc) · `indigo` (#5b63a8) · `teal` (#2a8178)

Full names: `admin-smooth-steel`, `admin-smooth-indigo`, `admin-smooth-teal`,
`admin-sharp-steel`, `admin-sharp-indigo`, `admin-sharp-teal`.

```javascript
Domma.theme.set('admin-sharp-steel');
Domma.theme.getBase(); // 'admin-sharp'
```

The six CSS files are generated by `scripts/generate-admin-themes.js` (run via
`npm run generate:themes`) - edit token values there, never the generated files.

---

## CSS Utilities - Opacity &amp; Translucency

### Opacity Scale

Full opacity scale in steps of 10, plus `.opacity-25` and `.opacity-75` for fine-grained control.
13 classes cover the full range from `opacity-0` (invisible) to `opacity-100` (fully visible).

```html
<div class="opacity-0">Invisible</div>
<div class="opacity-10">10% visible</div>
<div class="opacity-25">25%</div>
<div class="opacity-50">50%</div>
<div class="opacity-75">75%</div>
<div class="opacity-90">90%</div>
<div class="opacity-100">Fully visible</div>
```

**Full class list:** `.opacity-0`, `.opacity-10`, `.opacity-20`, `.opacity-25`, `.opacity-30`, `.opacity-40`,
`.opacity-50`, `.opacity-60`, `.opacity-70`, `.opacity-75`, `.opacity-80`, `.opacity-90`, `.opacity-100`

---

### Translucent Utilities

Semantic transparency classes with built-in `transition: opacity` so state changes animate without extra CSS.
All values are driven by CSS custom properties and can be overridden per-theme.

```html
<!-- Named translucency levels -->
<nav class="translucent-light">Subtle (0.85)</nav>
<div class="translucent">Standard (0.70)</div>
<img class="translucent-heavy" src="watermark.png" alt="watermark">
```

| Class               | Opacity | Use case                               |
|---------------------|---------|----------------------------------------|
| `.translucent-light`  | 0.85  | Subtle overlays, watermarks            |
| `.translucent`        | 0.70  | Standard modal or overlay transparency |
| `.translucent-heavy`  | 0.50  | Ghost elements, disabled-like states   |

---

### Frosted Glass

`.translucent-glass` combines a semi-transparent white background with `backdrop-filter: blur()` for a
frosted glass effect. Requires visible content behind the element.

```html
<!-- Position over a gradient or background image -->
<div style="background-image: url(bg.jpg)">
    <nav class="translucent-glass p-4">Frosted navbar</nav>
</div>
```

The glass panel uses `rgba(255, 255, 255, 0.75)` by default. Override the CSS variables to adapt to dark themes:

```css
[data-theme-variant="dark"] .translucent-glass {
    background-color: rgba(0, 0, 0, var(--dm-translucent-glass-opacity));
}
```

---

### Hover Variants

Apply translucency only on `:hover`, with a built-in smooth transition:

```html
<button class="translucent-light-hover">Subtle fade on hover (0.85)</button>
<button class="translucent-hover">Standard fade on hover (0.70)</button>
<button class="translucent-heavy-hover">Strong fade on hover (0.50)</button>
```

---

### CSS Custom Properties

All translucency values are CSS variables, making them easy to override per-theme:

```css
:root {
    --dm-translucent-light:         0.85;   /* .translucent-light */
    --dm-translucent:               0.7;    /* .translucent */
    --dm-translucent-heavy:         0.5;    /* .translucent-heavy */
    --dm-translucent-glass-blur:    8px;    /* .translucent-glass blur */
    --dm-translucent-glass-opacity: 0.75;   /* .translucent-glass alpha */
}
```

---

## Reactivity

Domma tracks which fields a derivation actually reads, so a write re-runs exactly the work that depends on it -
and nothing else. Updates are batched into a single microtask flush.

Full guide: **[Reactivity.md](./Reactivity.md)**. Live demos: **[Reactivity showcase](../public/showcase/models/reactivity.html)**.

### Derived values

`M.computed()` describes a value in terms of others. It is lazy - the body does not run until something reads it -
and the result is cached until a field it read actually changes.

```javascript
const cart = M.create({
    items:    { type: M.types.array,  default: [] },
    shipping: { type: M.types.number, default: 4.99 }
});

const subtotal = M.computed(() =>
    cart.get('items').reduce((sum, item) => sum + item.price, 0)
);

const total = M.computed(() => subtotal.get() + cart.get('shipping'));

total.get();   // evaluated now
total.get();   // cached - nothing re-runs
```

Computeds compose. `total` reading `subtotal` links the two automatically, and a computed shared by several
readers is evaluated once per flush rather than once per reader.

### Effects

`M.effect()` runs immediately to collect its dependencies, then again whenever any of them change. It returns a
stop function.

```javascript
const stop = M.effect(() => {
    $('#cart-total').text(`£${total.get().toFixed(2)}`);
});

cart.set('shipping', 0);   // DOM updates on the next microtask

stop();                    // unsubscribe
```

This replaces hand-wiring a subscription and comparing field names:

```javascript
// Manual - miss a field name and the total silently goes stale
cart.onChange(({ field }) => {
    if (field === 'items' || field === 'shipping') recalculate();
});

// Tracked - subscribes to exactly what it reads, every run
M.effect(() => recalculate(cart.get('items'), cart.get('shipping')));
```

### Batching

Writes never recompute anything synchronously. A burst of writes in the same tick collapses into one pass:

```javascript
cart.set('items', next);
cart.set('shipping', 0);
// → one effect run, one render

M.flush();   // force it to settle now (tests, or reading straight after a write)
```

### Tracked model views

`model.tracked()` returns a read-tracked, write-through proxy. Reads register dependencies; writes route through
`set()`, so validation, change notification and persistence all still run.

```javascript
const state = cart.tracked();

M.effect(() => console.log(state.shipping));
state.shipping = 2.99;   // validated, notified, persisted
```

### Components

`Domma.component()` uses tracking automatically - the definition syntax is unchanged. A computed re-evaluates only
when a field it read changes, and a burst of writes produces one render.

```javascript
Domma.component('order-summary', {
    template: '<p>{{label}}</p>',
    data() { return { items: 1, unitPrice: 25, note: '' }; },
    computed: {
        // Writing 'note' costs nothing - it is not read here
        label() { return `${this.data.items} × £${this.data.unitPrice}`; }
    }
});
```

### Rules

1. **Derivations must be synchronous.** Dependency collection stops at the first `await`. Fetch first, then write
   the result to the model.
2. **Return new values, don't mutate old ones.** Propagation is gated on `utils.isEqual`, so a computed that edits
   and returns the same object reads as unchanged.
3. **`model.get()` with no argument tracks every field.** Prefer `model.get('field')` inside derivations.
   `model.toJSON()` is deliberately untracked.
4. **Props are not tracked** in components; an attribute change triggers a full re-render instead.

### Compatibility

Tracking is additive. `onChange`, `onFieldChange`, `M.bind()`, validation and persistence all behave exactly as
before - only tracked computations are batched onto the microtask.

---

## DOM Bindings

Declarative bindings connect markup to data, so there is no render function to remember to call and no place for the
DOM and the data to drift apart. There are two ways in, depending on **who owns the markup**.

Full guide: **[Bindings.md](./Bindings.md)**. Live demos: **[Bindings showcase](../public/showcase/models/bindings.html)**.

### Markup that already exists

`M.applyBindings()` activates binding attributes on HTML the page already has - server-rendered, hand-written,
whatever - in place, with no build step.

```html
<div id="app">
    <h1 data-bind-text="title">Rendered by the server</h1>
    <input data-model="query">
    <p data-if="query">Searching…</p>
    <ul data-each="rows key=id"><li data-bind-text="name">row</li></ul>
    <button data-on-click="clear">Clear</button>
</div>
```

```javascript
const handle = M.applyBindings(model, '#app', {
    methods: { clear() { model.set('query', ''); } }
});

handle.dispose();   // on anything that outlives the markup
```

Pass a Model and every binding reads and writes through it: `data-model` lands in the model with validation and
change notification intact, and any other binding on that field updates.

### Markup a component owns

The same attributes work in a `Domma.component()` template, alongside `{{ }}`, `{{#if}}` and `{{#each}}`. Methods are
already in scope for `data-on-*`.

### The binding attributes

| Attribute | Does |
|---|---|
| `data-bind-text` / `data-bind-class` / `data-bind-<prop>` | Text, classes, a property or an attribute |
| `data-model` | Two-way, control ↔ data |
| `data-on-<event>` | Adds a listener |
| `data-if` | The element is in the document, or it is not |
| `data-each="rows key=id"` | A keyed list that preserves DOM nodes |

Every value is an **expression** - paths, literals, arithmetic, comparisons, `&&`/`||`/`!`, ternaries and calls to
registered helpers. Nothing uses `eval` or the `Function` constructor, so bindings work under a `script-src 'self'`
Content Security Policy.

### Extending the vocabulary

```javascript
M.registerHelper('upper', (s) => String(s).toUpperCase());
// <p data-bind-text="upper(name)"></p>

M.registerBinding('uppercase', { /* … */ });
// <p data-uppercase="name"></p>
```

Every built-in binding is registered through that same `registerBinding` function, so a custom binding can do
anything a built-in can.

### Two things that surprise people

- **`{{ }}` is not interpolated by `applyBindings`.** Either the server already rendered the value, or the page was
  broken until JavaScript ran. `data-bind-text` is the supported spelling - explicit, greppable, and renderable by the
  server alongside the text. The one exception is the contents of a `data-each`, which are a template.
- **There is no scope chain.** Inside a list a bare name is the *item*. Reach outward explicitly with `$parent` or
  `$root` - `$parent.remove($data)` is how a row reaches the list that owns it.
