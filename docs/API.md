# Domma API Reference

## Aliases

Domma provides short aliases for convenience, similar to jQuery's `$` and Lodash's `_`.

### Available Aliases

| Full Name | Alias | Purpose |
|-----------|-------|---------|
| `Domma` | `$` | DOM selection and manipulation |
| `Domma.utils` | `_` | Utility functions |
| `Domma.models` | `M` | Reactive models & pub/sub |
| `Domma.dates()` | `D()` | Date manipulation |
| `Domma.storage` | `S` | localStorage wrapper |
| `Domma.auth` | `A` | Authentication module |
| `Domma.forms` | `F` | Form builder |
| `Domma.http` | `H` | HTTP client |
| `Domma.elements` | `E` | UI components |
| `Domma.icons` | `I` | SVG icon system |
| `Domma.tables` | `T` | DataTable functionality |

### Usage

**Browser (UMD bundle):**
```html
<script src="dist/domma.min.js"></script>
<script>
    // All aliases are available globally
    $('#app').addClass('active');              // $ = Domma (DOM)
    _.debounce(fn, 100);                        // _ = utils
    M.create(blueprint, data);                     // M = models
    D().format('YYYY-MM-DD');                   // D = dates
    S.set('key', 'value');                      // S = storage
    H.get('/api/data');                         // H = http
    E.modal('#myModal');                        // E = elements
    I.scan();                                   // I = icons
    T.create('#table', { columns, data });      // T = tables
</script>
```

**ES Modules:**
```javascript
// Default import
import Domma from 'domma';

// Named imports with aliases
import { $, _, M, D, S, A, F, H, E, I, T } from 'domma';

// Use short form
$('#app').addClass('active');
_.chunk([1, 2, 3, 4], 2);
E.modal('#modal');
I.scan();

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

#### Context Parameter Examples

The context parameter allows you to scope DOM searches to a specific element, improving performance and code clarity:

```javascript
// Basic scoped search - search only within sidebar element
const sidebar = document.getElementById('sidebar');
const sidebarLinks = Domma('a', sidebar);  // Only links within sidebar

// Performance optimisation - search within subset
const container = document.getElementById('search-results');
Domma('.item', container).addClass('found');  // Faster than global search

// Event delegation with scoped operations
Domma('.container').on('click', '.item', function() {
    // Search only within the clicked item's container
    const parent = this.parentElement;
    Domma('.child', parent).toggleClass('active');
});

// Dynamic content handling
function updateWidget(widgetElement) {
    // All operations scoped to this widget
    Domma('.title', widgetElement).text('Updated');
    Domma('.status', widgetElement).addClass('active');
    Domma('.content', widgetElement).fadeIn();
}

// Context vs. Chaining - These are equivalent:
const container = document.getElementById('main');
Domma('.item', container);      // Context parameter (one query)
Domma(container).find('.item'); // Chaining approach (two queries)

// But context can be more efficient for single operations
// Context: One querySelectorAll within subset
// Chaining: Two querySelectorAll calls (container + items)

// Multiple scoped searches within same context
const dashboard = document.getElementById('dashboard');
Domma('.widget', dashboard).each(function() {
    // Each callback receives the element
    Domma('.title', this).css('font-weight', 'bold');
    Domma('.value', this).fadeIn(300);
});
```

**Important Notes:**

- Context parameter must be an HTMLElement or Document, not a selector string
- For selector strings as context, use chaining: `Domma('#container').find('.item')`
- Context parameter is ignored for HTML strings (which create new elements)

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
Full resource replacement.
```javascript
await Domma.http.put('/api/users/1', {
    name: 'Updated',
    email: 'updated@example.com'
});
```

### `patch(url, data, config)`
Partial resource update (only specified fields).
```javascript
await Domma.http.patch('/api/users/1', { name: 'Updated' });
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

---

## Effects

CSS-powered visual effects for enhanced UI interactions. All effects are pure CSS implementations that work seamlessly
with Domma's theme system.

### Glow Effects

Text and box shadow effects that create a luminous appearance:

```html
<!-- Size variants -->
<h1 class="glow-sm">Small Glow</h1>
<h1 class="glow">Default Glow</h1>
<h1 class="glow-lg">Large Glow</h1>
<h1 class="glow-xl">Extra Large Glow</h1>

<!-- Color variants -->
<h1 class="glow-primary">Primary Color</h1>
<h1 class="glow-success">Success Color</h1>
<h1 class="glow-danger">Danger Color</h1>

<!-- Hover effects -->
<button class="glow-hover">Glow on Hover</button>
<a class="glow-primary-hover">Primary Glow on Hover</a>
```

### Fireworks

Animated particle effects for celebrations and special moments:

```html
<!-- Effect types -->
<div class="firework firework-burst"></div>
<div class="firework firework-sparkle"></div>
<div class="firework firework-trail"></div>

<!-- Sizes -->
<div class="firework firework-burst firework-sm"></div>
<div class="firework firework-burst firework-lg"></div>

<!-- Behaviors -->
<div class="firework firework-burst firework-continuous"></div>
<button class="firework-on-hover">Hover to Celebrate!</button>

<!-- Colors -->
<div class="firework firework-burst firework-primary"></div>
<div class="firework firework-burst firework-rainbow"></div>
```

### Opacity Scale

Full opacity scale in steps of 10, plus `.opacity-25` and `.opacity-75`:

```html
<div class="opacity-0">Invisible</div>
<div class="opacity-10">10%</div>
<div class="opacity-25">25%</div>
<div class="opacity-50">50%</div>
<div class="opacity-75">75%</div>
<div class="opacity-100">Fully visible</div>
```

### Translucent Utilities

Semantic transparency classes with built-in `transition: opacity` for smooth state changes:

```html
<!-- Named translucency levels -->
<nav class="translucent-light">Subtle (opacity 0.85)</nav>
<div class="translucent">Standard (opacity 0.70)</div>
<img class="translucent-heavy" src="watermark.png" alt="">

<!-- Frosted glass — semi-transparent background + backdrop blur -->
<div class="translucent-glass">Frosted glass panel</div>

<!-- Hover variants — translucency applied on :hover only -->
<button class="translucent-hover">Fades on hover</button>
<button class="translucent-light-hover">Subtle fade on hover</button>
<button class="translucent-heavy-hover">Strong fade on hover</button>
```

**CSS custom properties** (override per-theme):

```css
:root {
    --dm-translucent-light:         0.85;
    --dm-translucent:               0.7;
    --dm-translucent-heavy:         0.5;
    --dm-translucent-glass-blur:    8px;
    --dm-translucent-glass-opacity: 0.75;
}
```

### Shadows

Box shadow and elevation utilities for depth and visual hierarchy:

```html
<!-- Basic shadows -->
<div class="shadow-sm">Small Shadow</div>
<div class="shadow">Default Shadow</div>
<div class="shadow-lg">Large Shadow</div>
<div class="shadow-xl">Extra Large Shadow</div>

<!-- Inner shadows -->
<div class="shadow-inner">Inner Shadow</div>
<input class="form-control shadow-inner" />

<!-- Colored shadows -->
<div class="shadow-primary">Primary Shadow</div>
<div class="shadow-success">Success Shadow</div>

<!-- Material Design elevation -->
<div class="elevation-1">1dp Elevation</div>
<div class="elevation-3">3dp Elevation</div>
<div class="elevation-5">5dp Elevation</div>

<!-- Hover effects -->
<div class="shadow-hover">Shadow on Hover</div>
<div class="shadow-lift-hover">Lift with Shadow on Hover</div>
```

---

## JavaScript Effects (`Domma.effects`)

The `Domma.effects` module provides programmatic visual effects and animations for UI elements. All effects support accessibility features like `prefers-reduced-motion` and return control objects for pause/resume/destroy operations.

### `effects.breathe(selector, options)`

Creates a sinusoidal vertical floating animation. Elements gently float up and down in a smooth, continuous motion.

**Parameters:**
- `selector`: CSS selector string, HTMLElement, NodeList, or Array
- `options` (optional): Configuration object

**Options:**
- `amplitude` (number): Vertical movement distance in pixels. Default: `6`
- `duration` (number): Complete animation cycle time in milliseconds. Default: `3000`
- `easing` (string): CSS easing function. Default: `'ease-in-out'`
- `delay` (number): Initial delay before animation starts (ms). Default: `0`
- `stagger` (number): Delay between multiple elements (ms). Default: `0`
- `iterations` (number | 'infinite'): Number of animation cycles. Default: `'infinite'`
- `pauseOnHover` (boolean): Pause animation when hovering. Default: `false`
- `autoStart` (boolean): Start animation immediately. Default: `true`
- `respectMotionPreference` (boolean): Honor prefers-reduced-motion. Default: `true`
- `onStart` (function): Callback when animation starts. Default: `null`
- `onComplete` (function): Callback when animation completes (finite iterations only). Default: `null`

**Returns:** Control object with methods:
- `pause()`: Pause the animation
- `resume()`: Resume a paused animation
- `stop()`: Stop the animation completely
- `restart()`: Restart from the beginning
- `destroy()`: Stop and clean up all resources
- `isRunning()`: Check if animation is running
- `isPaused()`: Check if animation is paused

**Examples:**

```javascript
// Basic usage - stat cards with gentle float
Domma.effects.breathe('.stat-card');

// With configuration
const breathe = Domma.effects.breathe('.feature-card', {
  amplitude: 8,       // 8px vertical movement
  duration: 2500,     // 2.5 second cycle
  stagger: 150,       // 150ms delay between cards
  pauseOnHover: true  // Pause when hovering
});

// Control the animation
breathe.pause();
breathe.resume();
breathe.stop();
breathe.destroy();

// Finite iterations with callback
Domma.effects.breathe('.notification', {
  amplitude: 12,
  iterations: 3,
  onComplete: () => {
    console.log('Animation finished!');
  }
});

// Individual amplitude for each element
$('.card').each(function() {
  const amplitude = parseInt($(this).data('amplitude')) || 6;
  Domma.effects.breathe(this, { amplitude, duration: 3000 });
});
```

**Use Cases:**
- Dashboard stat cards
- Feature highlights
- Pricing tiers
- Call-to-action elements
- Hero section components

---

### `effects.pulse(selector, options)`

Creates a grow-and-shrink scale animation. Elements smoothly scale up and down to create a breathing or pulsing effect.

**Parameters:**
- `selector`: CSS selector string, HTMLElement, NodeList, or Array
- `options` (optional): Configuration object

**Options:**
- `scale` (number): Scale factor (e.g., 1.05 = 5% larger). Default: `1.05`
- `duration` (number): Complete animation cycle time in milliseconds. Default: `2000`
- `easing` (string): CSS easing function. Default: `'ease-in-out'`
- `delay` (number): Initial delay before animation starts (ms). Default: `0`
- `stagger` (number): Delay between multiple elements (ms). Default: `0`
- `iterations` (number | 'infinite'): Number of animation cycles. Default: `'infinite'`
- `pauseOnHover` (boolean): Pause animation when hovering. Default: `false`
- `autoStart` (boolean): Start animation immediately. Default: `true`
- `respectMotionPreference` (boolean): Honor prefers-reduced-motion. Default: `true`
- `onStart` (function): Callback when animation starts. Default: `null`
- `onComplete` (function): Callback when animation completes (finite iterations only). Default: `null`

**Returns:** Control object (same methods as `breathe()`)

**Examples:**

```javascript
// Basic usage - pulsing badges
Domma.effects.pulse('.badge-notification');

// With configuration
const pulse = Domma.effects.pulse('.status-indicator', {
  scale: 1.2,         // 20% larger at peak
  duration: 1500,     // 1.5 second cycle
  stagger: 100        // 100ms delay between indicators
});

// Notification dot with pause on hover
Domma.effects.pulse('.notification-dot', {
  scale: 1.3,
  duration: 1200,
  pauseOnHover: true
});

// Subtle button emphasis
Domma.effects.pulse('.btn-primary', {
  scale: 1.03,        // Very subtle 3% growth
  duration: 2500
});

// Different scale for each element
$('.badge').each(function() {
  const scale = parseFloat($(this).data('scale')) || 1.05;
  Domma.effects.pulse(this, { scale, duration: 2000 });
});

// Control methods
pulse.pause();
pulse.resume();
pulse.stop();
pulse.destroy();
```

**Use Cases:**
- Notification indicators
- Badge counters
- Loading states
- Interactive buttons
- Status icons

---

### Accessibility

Both `breathe()` and `pulse()` respect user motion preferences by default. If a user has enabled "Reduce motion" in their system settings (`prefers-reduced-motion: reduce`), effects will be automatically disabled.

```javascript
// Respects system preference (default)
Domma.effects.breathe('.element', {
  respectMotionPreference: true  // Default
});

// Override to force animation
Domma.effects.breathe('.element', {
  respectMotionPreference: false
});
```

**Best Practice:** Always respect user preferences unless there's a compelling reason not to. Animations can cause discomfort or motion sickness for some users.

---

### Real-World Examples

**Dashboard with Stat Cards:**
```javascript
// Stat cards with staggered breathing
Domma.effects.breathe('.stat-card', {
  amplitude: 6,
  duration: 3000,
  stagger: 200,
  pauseOnHover: true
});
```

**Notification System:**
```javascript
// Badge counter with pulse
Domma.effects.pulse('.badge-notification', {
  scale: 1.15,
  duration: 1500
});

// Notification dot indicator
Domma.effects.pulse('.notification-dot', {
  scale: 1.3,
  duration: 1200
});
```

**Feature Cards with Entrance:**
```javascript
// Staggered entrance animation
Domma.effects.breathe('.feature-card', {
  amplitude: 8,
  stagger: 150,
  iterations: 3,
  onComplete: () => {
    // Optionally transition to infinite subtle animation
    Domma.effects.breathe('.feature-card', {
      amplitude: 4,
      duration: 4000
    });
  }
});
```

**Combined Effects:**
```javascript
// Breathing cards
Domma.effects.breathe('.pricing-tier', {
  amplitude: 6,
  stagger: 100
});

// Pulsing "Popular" badge
Domma.effects.pulse('.badge-popular', {
  scale: 1.1,
  duration: 2000
});
```

---

### `effects.reveal(selector, options)`

Scroll-triggered entrance animations using IntersectionObserver. Elements animate into view when they enter the viewport.

**Parameters:**
- `selector`: CSS selector string, HTMLElement, NodeList, or Array
- `options` (optional): Configuration object

**Options:**
- `animation` (string): Animation type - `'fade'`, `'slide-up'`, `'slide-down'`, `'slide-left'`, `'slide-right'`, `'zoom'`, `'flip'`. Default: `'fade'`
- `duration` (number): Animation duration in ms. Default: `600`
- `easing` (string): CSS easing function. Default: `'ease-out'`
- `delay` (number): Delay before animation in ms. Default: `0`
- `stagger` (number): Delay between multiple elements in ms. Default: `0`
- `threshold` (number): IntersectionObserver threshold 0-1. Default: `0.1`
- `rootMargin` (string): Observer root margin. Default: `'0px'`
- `once` (boolean): Only animate once, or re-animate on re-entry. Default: `true`
- `respectMotionPreference` (boolean): Honour prefers-reduced-motion. Default: `true`
- `onReveal` (function): Callback per element when revealed. Default: `null`

**Returns:** Control object with `destroy()`, `restart()`, `stop()` methods

**Examples:**

```javascript
// Simple fade-in on scroll
Domma.effects.reveal('.card');

// Slide up with stagger
Domma.effects.reveal('.feature', {
  animation: 'slide-up',
  duration: 800,
  stagger: 100,
  threshold: 0.2
});

// Re-animate on re-entry
Domma.effects.reveal('.section', {
  animation: 'zoom',
  once: false
});

// Callback on reveal
Domma.effects.reveal('.stat', {
  animation: 'slide-up',
  onReveal: (el) => {
    // Start counter animation when stat enters view
    Domma.effects.counter(el.querySelector('.number'));
  }
});
```

**Use Cases:**
- Landing page feature sections
- Portfolio/gallery items
- Blog post cards
- Dashboard widgets on first load

---

### `effects.scramble(selector, options)`

Text cipher/decode animation. Characters cycle through random glyphs before settling on the correct character.

**Parameters:**
- `selector`: CSS selector string, HTMLElement, NodeList, or Array
- `options` (optional): Configuration object

**Options:**
- `speed` (number): Ms per character resolve. Default: `50`
- `scrambleSpeed` (number): Ms between scramble frame updates. Default: `30`
- `characters` (string): Character pool for scramble glyphs. Default: `'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%&*'`
- `revealOrder` (string): `'left-to-right'`, `'right-to-left'`, `'random'`, `'center-out'`. Default: `'left-to-right'`
- `scrambleDuration` (number): How long each character scrambles before resolving in ms. Default: `800`
- `stagger` (number): Delay between multiple elements in ms. Default: `0`
- `loop` (boolean|number): `false`, `true` (infinite), or number of loops. Default: `false`
- `loopDelay` (number): Ms between loops. Default: `2000`
- `respectMotionPreference` (boolean): Honour prefers-reduced-motion. Default: `true`
- `onComplete` (function): Callback when animation completes. Default: `null`
- `onCharacter` (function): Callback per character resolved (char, index). Default: `null`

**Returns:** Control object with `pause()`, `resume()`, `stop()`, `restart()`, `destroy()` methods

**Examples:**

```javascript
// Basic scramble decode
Domma.effects.scramble('.hero-title');

// Random reveal order with looping
Domma.effects.scramble('.tagline', {
  revealOrder: 'random',
  loop: true,
  loopDelay: 3000
});

// Binary-style decode
Domma.effects.scramble('.code-display', {
  characters: '01',
  scrambleDuration: 1500
});
```

**Use Cases:**
- Hero section headlines
- Terminal/hacker-style interfaces
- Secret/cipher reveals
- Loading state text

---

### `effects.counter(selector, options)`

Animated number counting effect. Smoothly counts from one number to another with easing, formatting, and optional scroll trigger.

**Parameters:**
- `selector`: CSS selector string, HTMLElement, NodeList, or Array
- `options` (optional): Configuration object

**Options:**
- `from` (number): Start value. Default: `0`
- `to` (number): End value (reads from element textContent if null). Default: `null`
- `duration` (number): Total count duration in ms. Default: `2000`
- `easing` (string): `'linear'`, `'ease-out'`, `'ease-in-out'`. Default: `'ease-out'`
- `decimals` (number): Decimal places. Default: `0`
- `separator` (string): Thousands separator. Default: `','`
- `prefix` (string): Text before number. Default: `''`
- `suffix` (string): Text after number. Default: `''`
- `stagger` (number): Delay between multiple elements in ms. Default: `0`
- `trigger` (string): `'immediate'` or `'scroll'`. Default: `'immediate'`
- `threshold` (number): Observer threshold when trigger is scroll. Default: `0.5`
- `respectMotionPreference` (boolean): Honour prefers-reduced-motion. Default: `true`
- `onUpdate` (function): Callback on each frame (currentValue). Default: `null`
- `onComplete` (function): Callback when counting completes. Default: `null`

**Returns:** Control object with `pause()`, `resume()`, `stop()`, `restart()`, `destroy()` methods

**Examples:**

```javascript
// Count from 0 to the number in the element
Domma.effects.counter('.stat-number');

// Formatted currency counter
Domma.effects.counter('.revenue', {
  to: 1250000,
  prefix: '$',
  separator: ',',
  duration: 3000
});

// Scroll-triggered stat counters
Domma.effects.counter('.stat', {
  trigger: 'scroll',
  stagger: 200
});

// Percentage with decimal
Domma.effects.counter('.uptime', {
  to: 99.97,
  suffix: '%',
  decimals: 2
});
```

**Use Cases:**
- Dashboard stat cards
- Landing page metrics
- Revenue/growth displays
- Progress percentages

---

### `effects.ripple(selector, options)`

Material Design click ripple effect. Adds a circular wave emanating from the click/touch point.

**Parameters:**
- `selector`: CSS selector string, HTMLElement, NodeList, or Array
- `options` (optional): Configuration object

**Options:**
- `colour` (string): Ripple colour. Default: `'rgba(255, 255, 255, 0.35)'`
- `duration` (number): Ripple animation duration in ms. Default: `600`
- `opacity` (number): Starting opacity. Default: `0.35`
- `unbounded` (boolean): Allow ripple to overflow element. Default: `false`
- `centered` (boolean): Always ripple from centre. Default: `false`
- `trigger` (string): `'click'`, `'mousedown'`, `'pointerdown'`. Default: `'pointerdown'`
- `respectMotionPreference` (boolean): Honour prefers-reduced-motion. Default: `true`

**Returns:** Control object with `destroy()` method

**Examples:**

```javascript
// Add ripple to all buttons
Domma.effects.ripple('.btn');

// Custom colour ripple on cards
Domma.effects.ripple('.card', {
  colour: 'rgba(59, 130, 246, 0.3)',
  duration: 800
});

// Centred ripple (ignores click position)
Domma.effects.ripple('.icon-btn', {
  centered: true
});
```

**Use Cases:**
- Button click feedback
- Interactive list items
- Card click feedback
- Navigation items

---

### `effects.shake(selector, options)`

Attention/error shake animation. Quick shake to signal errors or draw attention.

**Parameters:**
- `selector`: CSS selector string, HTMLElement, NodeList, or Array
- `options` (optional): Configuration object

**Options:**
- `intensity` (number): Shake distance in px. Default: `6`
- `duration` (number): Total shake duration in ms. Default: `500`
- `direction` (string): `'horizontal'`, `'vertical'`, `'both'`. Default: `'horizontal'`
- `easing` (string): CSS easing function. Default: `'ease-in-out'`
- `iterations` (number): Number of shake cycles. Default: `1`
- `stagger` (number): Delay between elements in ms. Default: `0`
- `respectMotionPreference` (boolean): Honour prefers-reduced-motion. Default: `true`
- `onComplete` (function): Callback when shake completes. Default: `null`

**Returns:** Control object with `pause()`, `resume()`, `stop()`, `restart()`, `destroy()` methods

**Examples:**

```javascript
// Shake an invalid input
Domma.effects.shake('#email-input');

// Vertical shake with callback
Domma.effects.shake('.alert', {
  direction: 'vertical',
  intensity: 4,
  iterations: 2,
  onComplete: () => console.log('Shake done')
});

// Staggered error shake on form fields
Domma.effects.shake('.invalid-field', {
  stagger: 50,
  intensity: 4
});
```

**Use Cases:**
- Form validation feedback
- Wrong password/PIN indication
- Attention-drawing alerts
- Error state notification

---

## Elements (`Domma.elements`)

UI component library providing 25+ interactive elements including modals, tabs, carousels, tooltips, and more.

### Modal

Create and control modal dialogs with three initialization modes: selector-based, factory mode, and promise mode.

**HTML Structure (Selector Mode):**

Domma modals use a **flat structure** - direct children of `.modal` container. Do NOT use Bootstrap's `.modal-dialog`
and `.modal-content` wrappers!

```html
<!-- ✅ CORRECT: Domma structure (flat) -->
<div id="my-modal" class="modal">
  <div class="modal-header">
    <h5 class="modal-title">Modal Title</h5>
    <button class="modal-close">&times;</button>
  </div>
  <div class="modal-body">
    <p>Modal content goes here.</p>
  </div>
  <div class="modal-footer">
    <button class="btn modal-close">Cancel</button>
    <button class="btn btn-primary">Save</button>
  </div>
</div>

<!-- ❌ WRONG: Bootstrap structure (nested wrappers) -->
<div class="modal">
  <div class="modal-dialog">        <!-- DON'T USE THIS -->
    <div class="modal-content">     <!-- DON'T USE THIS -->
      <div class="modal-header">...</div>
    </div>
  </div>
</div>
```

#### `elements.modal(selectorOrOptions, options)`

Creates a modal instance. Auto-detects mode based on first argument type.

**Selector Mode** (existing behavior - 100% backward compatible):

```javascript
// HTML-based modal
const modal = Domma.elements.modal('#my-modal', {
  backdrop: true,
  backdropClose: true,
  keyboard: true,
  onOpen: () => console.log('Opened'),
  onClose: () => console.log('Closed')
});

modal.open();
modal.close();
modal.toggle();
modal.isOpen(); // Returns boolean
```

**Factory Mode** (new - programmatic creation):

```javascript
// Create modal without HTML
const modal = Domma.elements.modal({
  title: 'Welcome',
  content: '<p>Modal content</p>',
  size: 'medium',
  buttons: [
    {id: 'close', text: 'Close', variant: 'primary'}
  ],
  onButtonClick: (buttonId, modal) => {
    console.log('Clicked:', buttonId);
  }
});

modal.open();
```

**Options** (all modes):

| Option              | Type     | Default  | Description                      |
|---------------------|----------|----------|----------------------------------|
| `backdrop`          | Boolean  | `true`   | Show semi-transparent backdrop   |
| `backdropClose`     | Boolean  | `true`   | Close when clicking backdrop     |
| `keyboard`          | Boolean  | `true`   | Close with Escape key            |
| `animation`         | String   | `'fade'` | Animation type                   |
| `animationDuration` | Number   | `300`    | Animation duration (ms)          |
| `closeButton`       | Boolean  | `true`   | Show close button (×)            |
| `onOpen`            | Function | `null`   | Called when modal opens          |
| `onOpened`          | Function | `null`   | Called after open animation      |
| `onClose`           | Function | `null`   | Called when modal starts closing |
| `onClosed`          | Function | `null`   | Called after close animation     |

**Factory Mode Additional Options**:

| Option          | Type     | Default    | Description                                           |
|-----------------|----------|------------|-------------------------------------------------------|
| `size`          | String   | `'medium'` | Modal size: `'small'`, `'medium'`, `'large'`, `'xl'`  |
| `title`         | String   | `''`       | Modal title                                           |
| `content`       | String   | `''`       | Modal body HTML content                               |
| `footer`        | String   | `''`       | Modal footer HTML                                     |
| `buttons`       | Array    | `[]`       | Button configurations (see below)                     |
| `centered`      | Boolean  | `true`     | Vertically center modal                               |
| `scrollable`    | Boolean  | `false`    | Enable body scrolling for long content                |
| `className`     | String   | `''`       | Custom CSS class for modal                            |
| `headerClass`   | String   | `''`       | Custom CSS class for header                           |
| `bodyClass`     | String   | `''`       | Custom CSS class for body                             |
| `footerClass`   | String   | `''`       | Custom CSS class for footer                           |
| `onButtonClick` | Function | `null`     | Called when button clicked: `(buttonId, modal) => {}` |

**Button Configuration**:

```javascript
{
  id: 'save',               // Button identifier (returned in callbacks/promises)
    text
:
  'Save Changes',     // Button text
    variant
:
  'primary',       // Button style: 'primary', 'secondary', 'danger', 'success', etc.
    close
:
  true               // Auto-close modal on click (default: true)
}
```

**Methods**:

- `open()` - Opens the modal
- `close()` - Closes the modal
- `toggle()` - Toggles modal state
- `isOpen()` - Returns `true` if modal is open
- `destroy()` - Removes event listeners
- `remove()` - Completely removes modal from DOM (factory modals)

---

#### `elements.createModal(options)`

Creates a modal programmatically without requiring existing HTML. Returns a Modal instance.

**Parameters**:

- `options` (Object) - Configuration object (see Factory Mode options above)

**Returns**: `Modal` instance with `.open()`, `.close()`, `.remove()` methods

**Example - Basic Usage**:

```javascript
const modal = Domma.elements.createModal({
  title: 'Notification',
  content: '<p>Your changes have been saved!</p>',
  size: 'small',
  buttons: [
    {id: 'ok', text: 'OK', variant: 'primary'}
  ]
});

modal.open();
```

**Example - Custom Buttons**:

```javascript
const modal = Domma.elements.createModal({
  title: 'Confirm Action',
  content: '<p>Are you sure you want to proceed?</p>',
  buttons: [
    {id: 'cancel', text: 'Cancel', variant: 'secondary'},
    {id: 'confirm', text: 'Confirm', variant: 'primary'}
  ],
  onButtonClick: (buttonId, modal) => {
    if (buttonId === 'confirm') {
      console.log('Action confirmed');
      performAction();
    }
  }
});

modal.open();
```

**Example - Dynamic Content**:

```javascript
async function showUserProfile(userId) {
  const modal = Domma.elements.createModal({
    title: 'User Profile',
    content: '<p>Loading...</p>',
    size: 'large'
  });

  modal.open();

  // Fetch user data
  const user = await Domma.http.get(`/api/users/${userId}`);

  // Update modal content
  const content = `
        <h4>${user.name}</h4>
        <p>Email: ${user.email}</p>
        <p>Role: ${user.role}</p>
    `;

  $(modal.element).find('.dm-dialog-body').html(content);
}
```

**Example - Size Variants**:

```javascript
// Small (400px max-width)
Domma.elements.createModal({
  title: 'Quick Message',
  content: '<p>Brief notification</p>',
  size: 'small'
}).open();

// Medium (600px) - default
Domma.elements.createModal({
  title: 'Standard Dialog',
  size: 'medium'
}).open();

// Large (800px)
Domma.elements.createModal({
  title: 'Contact Form',
  content: '<form>...</form>',
  size: 'large'
}).open();

// Extra Large (1000px)
Domma.elements.createModal({
  title: 'Data Table',
  content: '<table>...</table>',
  size: 'xl'
}).open();
```

**Example - Scrollable Content**:

```javascript
Domma.elements.createModal({
  title: 'Terms and Conditions',
  content: longHtmlContent,  // Very long content
  size: 'large',
  scrollable: true,          // Body scrolls independently
  buttons: [
    {id: 'decline', text: 'Decline', variant: 'secondary'},
    {id: 'accept', text: 'Accept', variant: 'primary'}
  ]
}).open();
```

---

#### `elements.showModal(options)`

Shows a modal and returns a Promise that resolves with the button ID that was clicked. Perfect for async/await
workflows.

**Parameters**:

- `options` (Object) - Same as `createModal()` options

**Returns**: `Promise<string>` - Resolves with the clicked button's `id`

**Example - Confirmation Dialog**:

```javascript
async function deleteItem() {
  const result = await Domma.elements.showModal({
    title: 'Confirm Deletion',
    content: '<p>Are you sure you want to delete this item?</p>',
    buttons: [
      {id: 'cancel', text: 'Cancel', variant: 'secondary'},
      {id: 'delete', text: 'Delete', variant: 'danger'}
    ]
  });

  if (result === 'delete') {
    await performDeletion();
    Domma.elements.toast('Item deleted', {type: 'success'});
  }
}
```

**Example - Multiple Choice**:

```javascript
async function selectSize() {
  const size = await Domma.elements.showModal({
    title: 'Select Size',
    content: '<p>Choose your preferred size:</p>',
    buttons: [
      {id: 'small', text: 'Small'},
      {id: 'medium', text: 'Medium'},
      {id: 'large', text: 'Large'},
      {id: 'xl', text: 'Extra Large'}
    ]
  });

  console.log('Selected:', size); // 'small', 'medium', 'large', or 'xl'
  return size;
}
```

**Example - Chained Confirmations**:

```javascript
async function dangerousOperation() {
  // First confirmation
  const firstConfirm = await Domma.elements.showModal({
    title: 'Warning',
    content: '<p>This will permanently delete all data.</p>',
    buttons: [
      {id: 'cancel', text: 'Cancel', variant: 'secondary'},
      {id: 'continue', text: 'Continue', variant: 'warning'}
    ]
  });

  if (firstConfirm !== 'continue') return;

  // Second confirmation
  const secondConfirm = await Domma.elements.showModal({
    title: 'Final Confirmation',
    content: '<p class="text-danger">Are you absolutely sure?</p>',
    buttons: [
      {id: 'no', text: 'No, Go Back', variant: 'secondary'},
      {id: 'yes', text: 'Yes, Delete Everything', variant: 'danger'}
    ]
  });

  if (secondConfirm === 'yes') {
    await performDeletion();
  }
}
```

**Example - Form Input with Promise**:

```javascript
async function getUserInput() {
  const modal = Domma.elements.createModal({
    title: 'Enter Details',
    content: `
            <div class="form-group">
                <label>Name</label>
                <input type="text" id="user-name" class="form-input">
            </div>
            <div class="form-group">
                <label>Email</label>
                <input type="email" id="user-email" class="form-input">
            </div>
        `,
    buttons: [
      {id: 'cancel', text: 'Cancel', variant: 'secondary'},
      {id: 'submit', text: 'Submit', variant: 'primary'}
    ]
  });

  return new Promise((resolve) => {
    modal.options.onButtonClick = (buttonId) => {
      if (buttonId === 'submit') {
        resolve({
          name: $('#user-name').val(),
          email: $('#user-email').val()
        });
      } else {
        resolve(null);
      }
    };
    modal.open();
  });
}

// Usage
const userData = await getUserInput();
if (userData) {
  console.log('User data:', userData);
}
```

---

### Sidebar

Create responsive navigation sidebars with unlimited depth nesting, mobile drawer functionality, and state persistence.

**HTML Structure:**

```html
<!-- Container for sidebar -->
<aside id="sidebar"></aside>
```

#### `elements.sidebar(selector, options)`

Creates a sidebar navigation instance. The sidebar supports unlimited depth nesting for menu items.

**Basic Example:**

```javascript
const sidebar = Domma.elements.sidebar('#sidebar', {
    position: 'left',
    fixed: true,
    width: '250px',
    header: {
        title: 'Navigation',
        toggle: true
    },
    items: [
        { text: 'Dashboard', url: '/', icon: 'layout', section: 'dashboard' },
        { text: 'Users', url: '/users', icon: 'users', section: 'users' },
        {
            text: 'Settings',
            icon: 'settings',
            items: [  // Nested submenu
                { text: 'General', url: '/settings/general' },
                { text: 'Security', url: '/settings/security' }
            ]
        }
    ],
    variant: 'dark',
    activeSection: 'dashboard'
});
```

**Options:**

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `position` | String | `'left'` | Sidebar position: `'left'` or `'right'` |
| `fixed` | Boolean | `true` | Fixed or static positioning |
| `width` | String | `'250px'` | Sidebar width |
| `top` | String | `'0'` | Top offset (e.g., `'60px'` for navbar) |
| `header` | Object | `null` | Header config: `{title, toggle, icon}` |
| `items` | Array | `[]` | Navigation items (see Item Structure) |
| `footer` | Object | `null` | Footer content: `{text, html}` |
| `variant` | String | `'dark'` | Theme: `'light'` or `'dark'` |
| `collapsible` | Boolean | `true` | Enable mobile toggle |
| `collapseAt` | Number | `768` | Mobile breakpoint (px) |
| `activeSection` | String | `null` | Active section identifier |
| `expandedSections` | Array | `[]` | Initially expanded sections |
| `persistExpanded` | Boolean | `false` | Persist expanded state |
| `persistKey` | String | `null` | localStorage key |
| `animationDuration` | Number | `200` | Animation duration (ms) |
| `onItemClick` | Function | `null` | Click handler: `(item, path, event) => {}` |
| `onToggle` | Function | `null` | Toggle handler: `(isOpen) => {}` |
| `onExpand` | Function | `null` | Expand handler: `(itemPath) => {}` |
| `onCollapse` | Function | `null` | Collapse handler: `(itemPath) => {}` |

**Item Structure:**

```javascript
// Regular link
{ text: 'Dashboard', url: '/', icon: 'layout', section: 'dashboard' }

// With badge
{ text: 'Inbox', url: '/inbox', icon: 'mail', badge: '12' }

// Divider
{ divider: true }

// Section heading
{ heading: 'ADMIN' }

// Nested menu (unlimited depth)
{
    text: 'Settings',
    icon: 'settings',
    items: [
        { text: 'General', url: '#' },
        {
            text: 'Advanced',
            items: [  // Level 3
                { text: 'API', url: '#' },
                {
                    text: 'Security',
                    items: [  // Level 4 (unlimited!)
                        { text: 'Policies', url: '#' }
                    ]
                }
            ]
        }
    ]
}
```

**Methods:**

- `open()` - Open sidebar (mobile)
- `close()` - Close sidebar (mobile)
- `toggle()` - Toggle sidebar state (mobile)
- `isOpen()` - Returns `true` if sidebar is open
- `setActive(section)` - Set active section
- `setItems(items)` - Replace navigation items
- `addItem(item, index)` - Add navigation item
- `removeItem(index)` - Remove navigation item
- `expandAll()` - Expand all nested menus
- `collapseAll()` - Collapse all nested menus
- `destroy()` - Remove event listeners and cleanup

**Example - Admin Panel:**

```javascript
const sidebar = Domma.elements.sidebar('#admin-sidebar', {
    position: 'left',
    fixed: true,
    width: '250px',
    top: '60px',  // Below navbar
    header: {
        title: 'Admin Panel',
        toggle: true
    },
    items: [
        { text: 'Overview', url: '/admin/', icon: 'layout', section: 'overview' },
        { text: 'Users', url: '/admin/users/', icon: 'users', section: 'users', badge: '42' },
        { text: 'Settings', url: '/admin/settings/', icon: 'settings', section: 'settings' }
    ],
    variant: 'dark',
    collapsible: true,
    activeSection: 'overview',
    persistExpanded: true,
    persistKey: 'admin-sidebar-state'
});
```

**Example - Dynamic Updates:**

```javascript
// Update active section
sidebar.setActive('users');

// Add new item
sidebar.addItem({ text: 'Reports', url: '/reports', icon: 'file-text' });

// Replace all items
sidebar.setItems([
    { text: 'New Dashboard', url: '/new' }
]);

// Mobile control
sidebar.open();   // Open drawer on mobile
sidebar.close();  // Close drawer
sidebar.toggle(); // Toggle state
```

---

### Footer

Create responsive page footers with multiple layout modes and theme variants.

**HTML Structure:**

```html
<!-- Container for footer -->
<footer id="footer"></footer>
```

#### `elements.footer(selector, options)`

Creates a footer instance. Supports three layout modes: simple, columns, and minimal.

**Simple Layout Example:**

```javascript
const footer = Domma.elements.footer('#footer', {
    layout: 'simple',
    variant: 'light',
    brand: {
        text: 'Domma',
        logo: '/assets/logo.svg',
        url: '/'
    },
    links: [
        { text: 'Features', url: '/features' },
        { text: 'Pricing', url: '/pricing' },
        { text: 'About', url: '/about' }
    ],
    social: [
        { icon: 'github', url: 'https://github.com', label: 'GitHub' },
        { icon: 'twitter', url: 'https://twitter.com', label: 'Twitter' }
    ],
    copyright: '© 2026 Domma. All rights reserved.'
});
```

**Options:**

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `variant` | String | `'light'` | Theme: `'light'`, `'dark'`, or `'transparent'` |
| `layout` | String | `'simple'` | Layout: `'simple'`, `'columns'`, or `'minimal'` |
| `brand` | Object | `null` | Brand config: `{text, logo, url}` |
| `columns` | Array | `[]` | Multi-column layout (see below) |
| `links` | Array | `[]` | Simple link list |
| `social` | Array | `[]` | Social media icons |
| `copyright` | String/Object | `null` | Copyright text or `{text, year}` |
| `className` | String | `''` | Additional CSS classes |
| `position` | String | `'static'` | Position: `'static'`, `'fixed'`, or `'sticky'` |

**Columns Layout Example:**

```javascript
Domma.elements.footer('#footer', {
    layout: 'columns',
    variant: 'dark',
    brand: {
        text: 'Domma Framework',
        logo: '/assets/logo.svg'
    },
    columns: [
        {
            title: 'Product',
            links: [
                { text: 'Features', url: '/features' },
                { text: 'Pricing', url: '/pricing' },
                { text: 'Changelog', url: '/changelog' }
            ]
        },
        {
            title: 'Resources',
            links: [
                { text: 'Documentation', url: '/docs' },
                { text: 'API Reference', url: '/api' },
                { text: 'Examples', url: '/examples' }
            ]
        },
        {
            title: 'Company',
            links: [
                { text: 'About', url: '/about' },
                { text: 'Blog', url: '/blog' },
                { text: 'Contact', url: '/contact' }
            ]
        }
    ],
    social: [
        { icon: 'github', url: '#', label: 'GitHub' },
        { icon: 'twitter', url: '#', label: 'Twitter' }
    ],
    copyright: '© 2026 Domma. All rights reserved.'
});
```

**Minimal Layout Example:**

```javascript
Domma.elements.footer('#footer', {
    layout: 'minimal',
    variant: 'light',
    copyright: '© 2026 Domma',
    social: [
        { icon: 'github', url: '#', label: 'GitHub' },
        { icon: 'twitter', url: '#', label: 'Twitter' },
        { icon: 'linkedin', url: '#', label: 'LinkedIn' }
    ]
});
```

**Methods:**

- `setBrand(brand)` - Update brand information
- `setLinks(links)` - Update links array
- `setColumns(columns)` - Update columns array
- `setSocial(social)` - Update social links
- `setCopyright(copyright)` - Update copyright text
- `destroy()` - Remove event listeners and cleanup

**Example - Dynamic Copyright:**

```javascript
const footer = Domma.elements.footer('#footer', {
    layout: 'simple',
    copyright: {
        text: 'Domma Framework',
        year: true  // Automatically uses current year
    }
});

// Update later
footer.setCopyright('© 2026 New Company Name');
```

---

### Progression

Unified component combining Timeline (chronological events) and Roadmap (status-driven milestones) with dual-mode functionality. Supports both traditional timeline visualization and interactive project roadmap tracking.

**Timeline Mode** - Display chronological events:

```javascript
const timeline = Domma.elements.progression('#timeline', {
    mode: 'timeline',
    layout: 'vertical',
    theme: 'default',
    items: [
        { year: '2024', title: 'Company Founded', description: 'Started with a vision' },
        { year: '2025', title: 'First Product Launch', description: 'Released v1.0' },
        { year: '2026', title: 'Series A Funding', description: 'Raised $10M' }
    ]
});
```

**Roadmap Mode** - Track project milestones with statuses:

```javascript
const roadmap = Domma.elements.progression('#roadmap', {
    mode: 'roadmap',
    layout: 'vertical',
    theme: 'modern',
    showProgress: true,
    statusIcons: true,
    items: [
        {
            id: 'phase1',
            title: 'Research & Planning',
            status: 'completed',
            date: 'Q1 2026',
            description: 'Market research and requirements gathering',
            priority: 'high'
        },
        {
            id: 'phase2',
            title: 'Development',
            status: 'in-progress',
            date: 'Q2 2026',
            description: 'Core feature implementation',
            progress: 65,
            tags: ['backend', 'frontend'],
            assignee: 'Engineering Team'
        },
        {
            id: 'phase3',
            title: 'Testing & QA',
            status: 'planned',
            date: 'Q3 2026',
            priority: 'medium'
        }
    ]
});
```

#### `elements.progression(selector, options)`

Creates a Progression instance.

**Common Options:**

| Option      | Type     | Default      | Description                                    |
|-------------|----------|--------------|------------------------------------------------|
| `mode`      | String   | `'timeline'` | Component mode: `'timeline'` or `'roadmap'`    |
| `items`     | Array    | `[]`         | Items to display                               |
| `layout`    | String   | `'vertical'` | Layout: `'vertical'`, `'horizontal'`, `'centered'` |
| `theme`     | String   | `'default'`  | Theme: `'default'`, `'minimal'`, `'corporate'`, `'modern'` |
| `animation` | Boolean  | `true`       | Enable entrance animations                     |

**Roadmap-Specific Options:**

| Option               | Type     | Default       | Description                                |
|----------------------|----------|---------------|--------------------------------------------|
| `showProgress`       | Boolean  | `true`        | Show overall progress bar                  |
| `progressPosition`   | String   | `'top'`       | Progress bar position: `'top'` or `'bottom'` |
| `statusIcons`        | Boolean  | `true`        | Show status icons in markers               |
| `allowStatusChange`  | Boolean  | `false`       | Enable interactive status changes          |
| `currentItem`        | String   | `null`        | ID of currently active item                |
| `icons`              | Object   | Default set   | Custom icons for each status               |
| `onStatusChange`     | Function | `null`        | Callback when item status changes          |

**Timeline Item Structure:**

```javascript
{
    year: '2024',           // Display year/date
    title: 'Event Title',   // Event title
    description: 'Details', // Optional description
    icon: 'icon-name'       // Optional icon name
}
```

**Roadmap Item Structure:**

```javascript
{
    id: 'milestone-1',              // Unique identifier (required)
    title: 'Milestone Title',       // Milestone title
    status: 'in-progress',          // Status (required for roadmap)
    date: 'Q2 2026',                // Display date/timeframe
    description: 'Details',         // Optional description
    progress: 45,                   // Optional progress (0-100)
    priority: 'high',               // Optional: 'low', 'medium', 'high', 'critical'
    tags: ['backend', 'api'],       // Optional tags array
    assignee: 'Team Name'           // Optional assignee
}
```

**Status Types:**

- `'planned'` - Not started (gray marker)
- `'in-progress'` - Currently active (blue marker with pulse animation)
- `'completed'` - Finished (green marker with checkmark)
- `'blocked'` - Impeded (red marker with alert icon)
- `'cancelled'` - Abandoned (gray marker with X icon)

#### Methods

**Common Methods:**

```javascript
progression.setItems(items)         // Replace all items
progression.addItem(item)           // Add single item
progression.updateItem(id, changes) // Update specific item
progression.removeItem(id)          // Remove item by ID
progression.destroy()               // Cleanup and remove
```

**Roadmap-Specific Methods:**

```javascript
progression.setStatus(id, status)      // Change item status
progression.getProgress()              // Get overall completion %
progression.markComplete(id)           // Set status to 'completed'
progression.markInProgress(id)         // Set status to 'in-progress'
progression.markPlanned(id)            // Set status to 'planned'
progression.markBlocked(id)            // Set status to 'blocked'
progression.getItemsByStatus(status)   // Filter items by status
progression.setCurrent(id)             // Set current active item
```

#### Backwards Compatibility

The `timeline()` function is deprecated but remains fully functional as an alias:

```javascript
// Deprecated (still works)
const timeline = Domma.elements.timeline(selector, options);

// Recommended
const timeline = Domma.elements.progression(selector, { mode: 'timeline', ...options });
```

#### Interactive Roadmap Example

```javascript
const roadmap = Domma.elements.progression('#project-roadmap', {
    mode: 'roadmap',
    layout: 'vertical',
    theme: 'modern',
    showProgress: true,
    allowStatusChange: true,
    onStatusChange: (item, oldStatus, newStatus) => {
        console.log(`${item.title} changed from ${oldStatus} to ${newStatus}`);

        // Auto-advance when marking complete
        if (newStatus === 'completed') {
            const nextPlanned = roadmap.getItemsByStatus('planned')[0];
            if (nextPlanned) {
                roadmap.markInProgress(nextPlanned.id);
            }
        }
    },
    items: [
        { id: 'design', title: 'Design Phase', status: 'completed', date: 'Jan 2026' },
        { id: 'dev', title: 'Development', status: 'in-progress', date: 'Feb-Apr 2026', progress: 70 },
        { id: 'test', title: 'Testing', status: 'planned', date: 'May 2026' },
        { id: 'deploy', title: 'Deployment', status: 'planned', date: 'Jun 2026' }
    ]
});

// Programmatically update roadmap
roadmap.setStatus('dev', 'completed');
roadmap.markInProgress('test');

console.log(`Overall progress: ${roadmap.getProgress()}%`);
```

---

### NumberBadge

A positioned notification counter that attaches to any element. Supports numeric counts, dot mode (no number), pulse animation, multiple colour variants, and a configurable overflow display (e.g. `99+`).

**Basic usage:**

```javascript
// Attach a counter badge to a button
const nb = Domma.elements.numberBadge('#inbox-btn', { count: 5 });

// Increment / decrement
nb.increment();
nb.decrement();

// Switch to dot mode (no number)
nb.setDot(true);

// Update variant
nb.setVariant('success');
```

**CSS-only usage:**

```html
<!-- Wrap the target element -->
<div class="badge-number-wrapper">
  <button class="btn btn-primary">Inbox</button>
  <span class="badge-number badge-number-primary">12</span>
</div>

<!-- Dot mode -->
<div class="badge-number-wrapper">
  <button class="btn btn-secondary">Alerts</button>
  <span class="badge-number badge-number-danger badge-dot"></span>
</div>
```

#### `elements.numberBadge(selector, options)`

Creates a NumberBadge instance attached to the selected element.

**Options:**

| Option        | Type     | Default       | Description                                                    |
|---------------|----------|---------------|----------------------------------------------------------------|
| `count`       | Number   | `0`           | Initial numeric count to display                               |
| `variant`     | String   | `'primary'`   | Colour variant: `'primary'`, `'danger'`, `'success'`, `'warning'`, `'info'` |
| `dot`         | Boolean  | `false`       | Dot mode — renders a small indicator without a number          |
| `pulse`       | Boolean  | `false`       | Enable pulsing animation to draw attention                     |
| `max`         | Number   | `99`          | Maximum count before overflow label is shown (e.g. `99+`)      |
| `borderColor` | String   | `''`          | CSS colour value for the border around the badge               |
| `position`    | String   | `'top-right'` | Badge position: `'top-right'`, `'top-left'`, `'bottom-right'`, `'bottom-left'` |

**Methods:**

| Method                    | Returns        | Description                                           |
|---------------------------|----------------|-------------------------------------------------------|
| `setCount(n)`             | `NumberBadge`  | Set the count to `n`                                  |
| `increment(by = 1)`       | `NumberBadge`  | Increment the count                                   |
| `decrement(by = 1)`       | `NumberBadge`  | Decrement the count (minimum 0)                       |
| `getCount()`              | `Number`       | Return the current raw count                          |
| `setDot(enabled)`         | `NumberBadge`  | Toggle dot mode on or off                             |
| `setVariant(variant)`     | `NumberBadge`  | Change the colour variant                             |
| `setPulse(enabled)`       | `NumberBadge`  | Toggle the pulse animation                            |
| `remove()`                | `void`         | Remove the badge element from the DOM                 |
| `destroy()`               | `void`         | Alias for `remove()` — clean up the instance          |

---

### Other UI Components

The Elements namespace includes 27+ additional components. For complete documentation, see:

- **Interactive**: `tabs`, `accordion`, `carousel`, `dropdown`, `tooltip`
- **Forms**: `autocomplete`, `pillbox`, `buttonGroup`
- **Feedback**: `toast`, `dialog`, `loader`, `badge`, `numberBadge`, `notification`
- **Navigation**: `navbar`, `sidebar`, `footer`, `breadcrumbs`, `backToTop`
- **Utilities**: `timer`, `alarm`, `card`
- **Tools**: `editor`, `themeRoller`, `pageRoller` (in tools bundle)

See [DommaDocumentation.md](./DommaDocumentation.md#elements) for full component reference.

---

## Blueprints

Domma's unified schema system - define your data structure once and use it everywhere.

**See [Blueprints.md](./Blueprints.md) for comprehensive documentation including:**

- Blueprint anatomy and field types
- Validation options (built-in and custom)
- Blueprint composition (`M.extend()`, `M.pick()`, `M.omit()`)
- Integration with Models, Forms, and CRUD
- Step-by-step tutorial
- Real-world examples

**Quick Example:**

```javascript
// Define blueprint once
const userBlueprint = {
    name: { type: 'string', required: true, minLength: 2 },
    email: { type: 'email', required: true },
    age: { type: 'number', min: 0, max: 120 }
};

// Use in Models
const user = M.create(userBlueprint, { name: 'Alice', email: 'alice@example.com' });

// Use in Forms
const form = Domma.forms.create(userBlueprint, {
    container: '#form',
    onSubmit: (data) => console.log(data)
});

// Use in CRUD
Domma.forms.crud('#crud', userBlueprint, {
    apiUrl: '/api/users'
});
```

**See also:**
- [Models Showcase](../public/showcase/models/) - Reactive model examples
- [Forms Showcase](../public/showcase/forms/) - Form generation examples
- [Blueprints Showcase](../public/showcase/blueprints/) - Interactive blueprint demos
