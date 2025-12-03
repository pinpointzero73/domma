# Domma API Reference

## Aliases

Domma provides short aliases for convenience, similar to jQuery's `$` and Lodash's `_`.

### Available Aliases

| Full Name | Alias | Purpose |
|-----------|-------|---------|
| `Domma` | `$` | DOM selection and manipulation |
| `Domma.utils` | `_` | Utility functions |

### Usage

**Browser (UMD bundle):**
```html
<script src="dist/domma.min.js"></script>
<script>
    // All three are available globally
    Domma('#app').addClass('active');
    $('#app').addClass('active');
    _.debounce(fn, 100);
</script>
```

**ES Modules:**
```javascript
// Default import
import Domma from 'domma';

// Named imports with aliases
import { $, _ } from 'domma';

// Use short form
$('#app').addClass('active');
_.chunk([1, 2, 3, 4], 2);

// Or full names
Domma('#app').addClass('active');
Domma.utils.chunk([1, 2, 3, 4], 2);
```

**Note:** If using jQuery or Lodash alongside Domma, use the full `Domma` and `Domma.utils` names to avoid conflicts.

---

## Core

### `Domma(selector, context)` / `$(selector, context)`

Selects elements from the DOM or creates elements from HTML string.

- **selector**: CSS selector string, HTML string, HTMLElement, NodeList, or Array.
- **context** (optional): Context element to search within.
- **Returns**: `DommaCollection`

```javascript
// Select by ID
const header = Domma('#header');

// Select by class
const buttons = Domma('.btn');

// Select with context
const menuItems = Domma('li', '#main-menu');

// Create elements from HTML
const newDiv = Domma('<div class="card"><h2>Title</h2></div>');

// From existing element
const el = Domma(document.getElementById('app'));

// From NodeList
const nodes = Domma(document.querySelectorAll('div'));
```

### `Domma.setup(config)`

Initialises the application with a JSON configuration.

```javascript
Domma.setup({
    '#header': {
        initial: {
            css: { backgroundColor: '#333', color: 'white' },
            text: 'Welcome'
        },
        events: {
            click: { addClass: 'clicked' },
            mouseover: { css: { backgroundColor: '#555' } }
        }
    },
    'button.submit': {
        events: {
            click: [
                { addClass: 'loading' },
                { target: '#form', addClass: 'submitted' }
            ]
        }
    }
});
```

---

## Traversal Methods

### `find(selector)`
Get descendants matching selector.
```javascript
Domma('#container').find('.item');
Domma('ul').find('li.active');
```

### `children(selector)`
Get immediate children, optionally filtered.
```javascript
Domma('#menu').children();
Domma('#menu').children('.active');
```

### `parent(selector)`
Get parent element, optionally filtered.
```javascript
Domma('.item').parent();
Domma('.item').parent('.container');
```

### `parents(selector)`
Get all ancestors, optionally filtered.
```javascript
Domma('.deep-element').parents();
Domma('.deep-element').parents('.wrapper');
```

### `closest(selector)`
Get closest ancestor matching selector.
```javascript
Domma('.button').closest('.card');
Domma('input').closest('form');
```

### `siblings(selector)`
Get siblings, optionally filtered.
```javascript
Domma('.active').siblings();
Domma('.active').siblings('.item');
```

### `next(selector)` / `prev(selector)`
Get next/previous sibling.
```javascript
Domma('.current').next();
Domma('.current').prev('.enabled');
```

### `nextAll(selector)` / `prevAll(selector)`
Get all following/preceding siblings.
```javascript
Domma('.current').nextAll();
Domma('.current').prevAll('.item');
```

### `first()` / `last()`
Get first/last element in collection.
```javascript
Domma('li').first();
Domma('li').last();
```

### `eq(index)`
Get element at index (supports negative).
```javascript
Domma('li').eq(2);   // Third item
Domma('li').eq(-1);  // Last item
```

### `get(index)`
Get raw DOM element at index.
```javascript
const el = Domma('li').get(0);  // HTMLElement
const all = Domma('li').get();  // Array of all elements
```

### `filter(selector|function)`
Filter elements by selector or function.
```javascript
Domma('li').filter('.active');
Domma('li').filter((i, el) => el.textContent.length > 10);
```

### `not(selector|function)`
Remove elements matching selector.
```javascript
Domma('li').not('.disabled');
Domma('input').not('[type="hidden"]');
```

### `is(selector)`
Check if any element matches selector.
```javascript
if (Domma('#item').is('.active')) { ... }
if (Domma('input').is(':checked')) { ... }
```

### `has(selector)`
Filter elements that have descendants matching selector.
```javascript
Domma('.card').has('.badge');
```

### `add(selector)`
Add elements to collection.
```javascript
Domma('.items').add('.extra-items');
```

### `index(selector)`
Get index of element.
```javascript
Domma('.active').index();          // Index among siblings
Domma('li').index('.active');      // Index in collection
```

### `toArray()`
Convert collection to array.
```javascript
const arr = Domma('li').toArray();
```

---

## Content Methods

### `html(content)`
Get or set inner HTML.
```javascript
const content = Domma('#box').html();
Domma('#box').html('<p>New content</p>');
```

### `text(content)`
Get or set text content.
```javascript
const text = Domma('#title').text();
Domma('#title').text('New Title');
```

### `val(value)`
Get or set form element value.
```javascript
const value = Domma('#input').val();
Domma('#input').val('new value');

// Checkbox/Radio
Domma('[type="checkbox"]').val(['option1', 'option2']);

// Multi-select
const selected = Domma('select[multiple]').val(); // Array
```

---

## Attribute Methods

### `attr(name, value)`
Get or set attribute.
```javascript
const href = Domma('a').attr('href');
Domma('a').attr('href', '/new-url');
Domma('img').attr({ src: 'image.jpg', alt: 'Description' });
```

### `removeAttr(name)`
Remove attribute.
```javascript
Domma('input').removeAttr('disabled');
Domma('div').removeAttr('data-id data-type');
```

### `prop(name, value)`
Get or set property.
```javascript
const checked = Domma('#checkbox').prop('checked');
Domma('#checkbox').prop('checked', true);
```

### `removeProp(name)`
Remove property.
```javascript
Domma('#checkbox').removeProp('checked');
```

### `data(key, value)`
Get or set data attributes.
```javascript
const id = Domma('.item').data('id');
Domma('.item').data('id', 123);
Domma('.item').data({ id: 123, type: 'product' });

// Get all data
const allData = Domma('.item').data();
```

### `removeData(key)`
Remove data attribute.
```javascript
Domma('.item').removeData('id');
```

---

## CSS/Class Methods

### `css(property, value)`
Get or set CSS styles.
```javascript
const color = Domma('#box').css('color');
Domma('#box').css('background-color', 'blue');
Domma('#box').css({
    backgroundColor: 'blue',
    color: 'white',
    padding: '20px'
});
```

### `addClass(className)`
Add class(es).
```javascript
Domma('#el').addClass('active');
Domma('#el').addClass('active visible animated');
Domma('#el').addClass((i, current) => `item-${i}`);
```

### `removeClass(className)`
Remove class(es).
```javascript
Domma('#el').removeClass('active');
Domma('#el').removeClass('active visible');
Domma('#el').removeClass(); // Remove all classes
```

### `toggleClass(className, state)`
Toggle class(es).
```javascript
Domma('#el').toggleClass('active');
Domma('#el').toggleClass('active', true);  // Force add
Domma('#el').toggleClass('active', false); // Force remove
```

### `hasClass(className)`
Check if any element has class.
```javascript
if (Domma('#el').hasClass('active')) { ... }
```

---

## DOM Manipulation

### `append(content)` / `prepend(content)`
Insert content inside elements.
```javascript
Domma('#list').append('<li>New item</li>');
Domma('#list').prepend('<li>First item</li>');
Domma('#list').append(Domma('<li>From collection</li>'));
```

### `after(content)` / `before(content)`
Insert content outside elements.
```javascript
Domma('.item').after('<div class="separator"></div>');
Domma('.item').before('<div class="prefix"></div>');
```

### `appendTo(target)` / `prependTo(target)`
Insert elements into target.
```javascript
Domma('<li>New</li>').appendTo('#list');
Domma('<li>First</li>').prependTo('#list');
```

### `insertAfter(target)` / `insertBefore(target)`
Insert elements relative to target.
```javascript
Domma('<p>After</p>').insertAfter('#header');
Domma('<p>Before</p>').insertBefore('#footer');
```

### `wrap(wrapper)` / `wrapAll(wrapper)` / `wrapInner(wrapper)`
Wrap elements.
```javascript
Domma('.item').wrap('<div class="wrapper"></div>');
Domma('.item').wrapAll('<div class="container"></div>');
Domma('.item').wrapInner('<span></span>');
```

### `unwrap(selector)`
Remove parent wrapper.
```javascript
Domma('.item').unwrap();
Domma('.item').unwrap('.wrapper');
```

### `remove(selector)` / `detach()`
Remove elements from DOM.
```javascript
Domma('.item').remove();
Domma('.item').remove('.disabled');
```

### `empty()`
Remove all children.
```javascript
Domma('#container').empty();
```

### `clone(deep)`
Clone elements.
```javascript
const copy = Domma('.item').clone();
const shallow = Domma('.item').clone(false);
```

### `replaceWith(content)`
Replace elements with content.
```javascript
Domma('.old').replaceWith('<div class="new">Replaced</div>');
```

### `replaceAll(target)`
Replace target with elements.
```javascript
Domma('<div class="new">New</div>').replaceAll('.old');
```

---

## Event Methods

### `on(event, selector, handler)`
Attach event handler with optional delegation.
```javascript
// Direct binding
Domma('#btn').on('click', (e) => console.log('clicked'));

// Event delegation
Domma('#list').on('click', 'li', (e) => {
    console.log('Item clicked:', e.target);
});

// Multiple events
Domma('#input').on('focus blur', (e) => console.log(e.type));
```

### `off(event, selector, handler)`
Remove event handler.
```javascript
Domma('#btn').off('click', handler);
Domma('#list').off('click', 'li', handler);
```

### `one(event, selector, handler)`
Attach handler that fires once.
```javascript
Domma('#btn').one('click', () => console.log('First click only'));
```

### `trigger(event, data)`
Trigger event on elements.
```javascript
Domma('#btn').trigger('click');
Domma('#form').trigger('submit');
Domma('#el').trigger('custom', { key: 'value' });
```

### Event Shortcuts
```javascript
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

// Trigger without handler
Domma('#el').click();
Domma('#el').focus();
Domma('#form').submit();
```

### `hover(enterHandler, leaveHandler)`
Handle mouseenter and mouseleave.
```javascript
Domma('.card').hover(
    () => Domma(this).addClass('hovered'),
    () => Domma(this).removeClass('hovered')
);
```

---

## Effects/Animation

### `show(duration, callback)` / `hide(duration, callback)`
Show or hide elements.
```javascript
Domma('#el').show();
Domma('#el').hide();
Domma('#el').show(400);
Domma('#el').hide('fast', () => console.log('hidden'));
```

### `toggle(duration, callback)`
Toggle visibility.
```javascript
Domma('#el').toggle();
Domma('#el').toggle(400);
```

### `fadeIn(duration, callback)` / `fadeOut(duration, callback)`
Fade elements in or out.
```javascript
Domma('#el').fadeIn();
Domma('#el').fadeOut(400);
Domma('#el').fadeIn('slow', () => console.log('visible'));
```

### `fadeToggle(duration, callback)`
Toggle fade.
```javascript
Domma('#el').fadeToggle();
```

### `fadeTo(duration, opacity, callback)`
Fade to specific opacity.
```javascript
Domma('#el').fadeTo(400, 0.5);
```

### `slideDown(duration, callback)` / `slideUp(duration, callback)`
Slide elements.
```javascript
Domma('#panel').slideDown();
Domma('#panel').slideUp(400);
```

### `slideToggle(duration, callback)`
Toggle slide.
```javascript
Domma('#panel').slideToggle();
```

### `animate(properties, duration, easing, callback)`
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

### `stop()`
Stop current animation.
```javascript
Domma('#box').stop();
```

### `delay(duration)`
Delay next operation (returns Promise).
```javascript
await Domma('#el').delay(1000);
```

**Duration values:** Number (ms), `'fast'` (200ms), `'slow'` (600ms)

---

## Dimensions

### `width(value)` / `height(value)`
Get or set dimensions.
```javascript
const w = Domma('#box').width();
const h = Domma('#box').height();
Domma('#box').width(200);
Domma('#box').height('50%');
```

### `innerWidth()` / `innerHeight()`
Get dimensions including padding.
```javascript
const innerW = Domma('#box').innerWidth();
const innerH = Domma('#box').innerHeight();
```

### `outerWidth(includeMargin)` / `outerHeight(includeMargin)`
Get dimensions including padding, border, and optionally margin.
```javascript
const outerW = Domma('#box').outerWidth();
const outerWithMargin = Domma('#box').outerWidth(true);
```

### `offset(coords)`
Get or set position relative to document.
```javascript
const pos = Domma('#box').offset();
// => { top: 100, left: 50 }

Domma('#box').offset({ top: 200, left: 100 });
```

### `position()`
Get position relative to offset parent.
```javascript
const pos = Domma('#box').position();
// => { top: 10, left: 20 }
```

### `scrollTop(value)` / `scrollLeft(value)`
Get or set scroll position.
```javascript
const scrollY = Domma('#container').scrollTop();
Domma('#container').scrollTop(0);
Domma('#container').scrollLeft(100);
```

### `offsetParent()`
Get offset parent element.
```javascript
const parent = Domma('#el').offsetParent();
```

---

## Iteration

### `each(callback)`
Iterate over elements.
```javascript
Domma('.item').each((index, element) => {
    console.log(index, element.textContent);
});
```

### Method Chaining
All setter methods return the collection.
```javascript
Domma('#notification')
    .text('Success!')
    .addClass('visible success')
    .css({ backgroundColor: 'green' })
    .fadeIn(400)
    .click(() => Domma(this).fadeOut());
```

---

## HTTP Module (`Domma.http`)

### `get(url, config)`
```javascript
const data = await Domma.http.get('/api/users');
const user = await Domma.http.get('/api/users/1', {
    headers: { 'Authorization': 'Bearer token' }
});
```

### `post(url, data, config)`
```javascript
const result = await Domma.http.post('/api/users', {
    name: 'John',
    email: 'john@example.com'
});
```

### `put(url, data, config)`
```javascript
await Domma.http.put('/api/users/1', { name: 'Updated' });
```

### `delete(url, config)`
```javascript
await Domma.http.delete('/api/users/1');
```

---

## Utilities (`Domma.utils`)

For complete reference, see [DommaDocumentation.md](./DommaDocumentation.md#utilities-reference).

### Quick Reference

```javascript
// Array
Domma.utils.chunk([1,2,3,4], 2);     // [[1,2], [3,4]]
Domma.utils.uniq([1,1,2,2]);          // [1, 2]
Domma.utils.flatten([[1], [2]]);      // [1, 2]

// Collection
Domma.utils.filter(arr, fn);
Domma.utils.find(arr, fn);
Domma.utils.groupBy(arr, 'key');
Domma.utils.sortBy(arr, 'key');

// Function
Domma.utils.debounce(fn, 300);
Domma.utils.throttle(fn, 100);
Domma.utils.memoize(fn);
Domma.utils.once(fn);

// Object
Domma.utils.get(obj, 'a.b.c', default);
Domma.utils.set(obj, 'a.b.c', value);
Domma.utils.pick(obj, 'a', 'b');
Domma.utils.omit(obj, 'password');
Domma.utils.cloneDeep(obj);
Domma.utils.merge(target, source);

// Type Checking
Domma.utils.isArray(val);
Domma.utils.isObject(val);
Domma.utils.isEmpty(val);
Domma.utils.isEqual(a, b);

// String
Domma.utils.camelCase('foo-bar');
Domma.utils.kebabCase('fooBar');
Domma.utils.capitalize('hello');
Domma.utils.truncate(str, { length: 20 });

// Math
Domma.utils.sum([1,2,3]);
Domma.utils.mean([1,2,3,4,5]);
Domma.utils.clamp(val, min, max);
Domma.utils.random(1, 10);
```
