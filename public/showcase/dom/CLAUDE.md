# CLAUDE.md - DOM Module Showcase

This file provides guidance for working with DOM module showcase examples.

## DOM Module Overview

The main `Domma(selector)` / `$(selector)` function returns a `DommaCollection` with 90+ chainable methods for
jQuery-compatible DOM manipulation.

## Method Categories

### Traversal (22 methods)

`find()`, `children()`, `parent()`, `parents()`, `closest()`, `siblings()`, `next()`, `prev()`,
`nextAll()`, `prevAll()`, `first()`, `last()`, `eq()`, `get()`, `filter()`, `not()`, `is()`, `has()`, `add()`,
`contents()`, `toArray()`, `index()`

**Example patterns:**

```javascript
// Traversing up the DOM
$('#child').parent().addClass('highlight');
$('.item').parents('.container').css('background', '#f0f0f0');

// Traversing down
$('.container').find('.item').show();
$('.parent').children('.child').fadeIn();

// Filtering
$('.items').filter('.active').addClass('selected');
$('.items').not('.disabled').on('click', handler);

// Positional
$('.items').first().addClass('first');
$('.items').eq(2).addClass('third');
```

### Content (3 methods)

`html()`, `text()`, `val()`

**Example patterns:**

```javascript
// Get content
const html = $('#element').html();
const text = $('#element').text();
const value = $('#input').val();

// Set content
$('#element').html('<strong>Bold text</strong>');
$('#element').text('Plain text');
$('#input').val('New value');

// Chaining
$('#output').html('<p>Result</p>').fadeIn();
```

### Attributes (6 methods)

`attr()`, `removeAttr()`, `prop()`, `removeProp()`, `data()`, `removeData()`

**Example patterns:**

```javascript
// Attributes
$('img').attr('src', 'image.jpg');
$('a').attr('href', '/page');
$('input').removeAttr('disabled');

// Properties
$('input[type="checkbox"]').prop('checked', true);
$('button').prop('disabled', false);

// Data attributes
$('#element').data('id', 123);
const id = $('#element').data('id');
$('#element').removeData('id');
```

### CSS/Classes (5 methods)

`css()`, `addClass()`, `removeClass()`, `toggleClass()`, `hasClass()`

**Example patterns:**

```javascript
// Classes
$('.item').addClass('active');
$('.item').removeClass('hidden');
$('.item').toggleClass('selected');

if ($('.item').hasClass('active')) {
    // Do something
}

// CSS
$('.box').css('background-color', '#ff0000');
$('.box').css({
    width: '200px',
    height: '100px',
    'border-radius': '5px'
});
```

### Manipulation (16 methods)

`append()`, `prepend()`, `after()`, `before()`, `appendTo()`, `prependTo()`, `insertAfter()`,
`insertBefore()`, `wrap()`, `wrapAll()`, `wrapInner()`, `unwrap()`, `remove()`, `detach()`, `empty()`, `clone()`,
`replaceWith()`, `replaceAll()`

**Example patterns:**

```javascript
// Adding content
$('.container').append('<div>New item</div>');
$('.container').prepend('<div>First item</div>');
$('#element').after('<p>After</p>');
$('#element').before('<p>Before</p>');

// Inserting
$('<div>New</div>').appendTo('.container');
$('<div>First</div>').prependTo('.container');

// Wrapping
$('.item').wrap('<div class="wrapper"></div>');
$('.items').wrapAll('<div class="container"></div>');
$('.item').wrapInner('<span></span>');
$('.item').unwrap();

// Removing
$('.item').remove();
$('.item').detach();
$('.container').empty();

// Cloning
const clone = $('.item').clone();
clone.appendTo('.target');
```

### Events (22+ methods)

`on()` (with delegation), `off()`, `one()`, `trigger()`, `hover()` + shortcuts

**Example patterns:**

```javascript
// Basic events
$('#button').on('click', function(e) {
    console.log('Clicked!', this);
});

// Event delegation
$('.container').on('click', '.item', function(e) {
    $(this).toggleClass('selected');
});

// Multiple events
$('#element').on('mouseenter mouseleave', function(e) {
    $(this).toggleClass('hover');
});

// One-time events
$('#button').one('click', function() {
    console.log('Clicked once');
});

// Event shortcuts
$('#button').click(handler);
$('#input').focus(handler);
$('.item').hover(enterHandler, leaveHandler);

// Trigger events
$('#button').trigger('click');

// Remove events
$('#button').off('click');
$('.container').off('click', '.item');
```

### Effects (12 methods)

`show()`, `hide()`, `toggle()`, `fadeIn()`, `fadeOut()`, `fadeToggle()`, `fadeTo()`, `slideUp()`,
`slideDown()`, `slideToggle()`, `animate()`, `stop()`, `delay()`

**Example patterns:**

```javascript
// Show/hide
$('.element').show();
$('.element').hide();
$('.element').toggle();

// Fade effects
$('.element').fadeIn(400);
$('.element').fadeOut(400);
$('.element').fadeToggle();
$('.element').fadeTo(400, 0.5); // Fade to 50% opacity

// Slide effects
$('.panel').slideDown(400);
$('.panel').slideUp(400);
$('.panel').slideToggle();

// Custom animations
$('.box').animate({
    left: '200px',
    opacity: 0.5
}, 1000);

// Animation control
$('.box').stop(); // Stop current animation
$('.box').delay(500).fadeIn(); // Delay before effect

// Chaining animations
$('.box')
    .fadeOut(300)
    .delay(200)
    .fadeIn(300);
```

### Dimensions (11 methods)

`width()`, `height()`, `innerWidth()`, `innerHeight()`, `outerWidth()`, `outerHeight()`,
`offset()`, `position()`, `scrollTop()`, `scrollLeft()`, `offsetParent()`

**Example patterns:**

```javascript
// Get dimensions
const width = $('.box').width();
const height = $('.box').height();
const innerWidth = $('.box').innerWidth(); // Including padding
const outerWidth = $('.box').outerWidth(); // Including padding and border
const outerWidthMargin = $('.box').outerWidth(true); // Including margin

// Set dimensions
$('.box').width(200);
$('.box').height(100);

// Position
const offset = $('.element').offset(); // {top: 100, left: 50}
const position = $('.element').position(); // Relative to offset parent

// Scrolling
const scrollTop = $(window).scrollTop();
$(window).scrollTop(0); // Scroll to top

const scrollLeft = $('.container').scrollLeft();
$('.container').scrollLeft(100);

// Offset parent
const parent = $('.element').offsetParent();
```

## Showcase Example Template

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>DOM Method - Domma Showcase</title>
    <link rel="stylesheet" href="../../../dist/domma-theme.css">
    <style>
        .demo-box {
            padding: 20px;
            margin: 10px;
            border: 2px solid #ddd;
            border-radius: 5px;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>DOM Method Showcase</h1>

        <div class="demo-section">
            <h2>Method Category</h2>
            <button id="demo-button" class="btn">Try it</button>
            <div id="demo-output" class="demo-box"></div>
        </div>
    </div>

    <script src="../../../dist/domma.min.js"></script>
    <script>
        // DOM manipulation examples using $
        $('#demo-button').on('click', function() {
            $('#demo-output')
                .html('<p>Result of DOM operation</p>')
                .fadeIn();
        });
    </script>
</body>
</html>
```

## Guidelines for DOM Showcases

1. **Always use `$` alias** - Never use `document.querySelector` or native methods
2. **Show method chaining** - Demonstrate Domma's chainable API
3. **Include multiple examples** - Show different use cases for each method
4. **Interactive demos** - Let users click buttons to see effects
5. **Visual feedback** - Use animations, classes, or styles to show changes
6. **Comment your code** - Explain what each DOM operation does
7. **Show before/after** - Display HTML structure before and after manipulation

## Common Patterns

### Dynamic Content Generation

```javascript
// Build HTML using Domma
const items = ['Apple', 'Banana', 'Orange'];
const $list = $('<ul class="fruit-list"></ul>');

_.each(items, item => {
    $list.append(`<li>${item}</li>`);
});

$('#container').append($list);
```

### Event Delegation

```javascript
// Efficient event handling for dynamic content
$('.todo-list').on('click', '.todo-item', function() {
    $(this).toggleClass('completed');
});

$('.todo-list').on('click', '.delete-btn', function() {
    $(this).closest('.todo-item').fadeOut(300, function() {
        $(this).remove();
    });
});
```

### Animation Sequences

```javascript
// Coordinated animations
$('.box')
    .fadeOut(200)
    .queue(function(next) {
        $(this).html('New content');
        next();
    })
    .fadeIn(200);
```

## Related Documentation

- [Showcase Meta Guide](../CLAUDE.md) - General showcase guidelines
- [Core Modules](../../../src/CLAUDE.md) - DOM module source documentation
- [API Reference](../../../docs/API.md) - Complete DOM API reference

## Testing DOM Showcases

- Test all DOM methods work as expected
- Verify method chaining works
- Check event handlers are properly attached
- Ensure animations are smooth
- Validate cross-browser compatibility
