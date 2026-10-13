---
title: DOM Manipulation
description: "jQuery-compatible API with 90+ chainable methods for traversal, manipulation, events, and more."
layout: with-sidebar
status: published
sortOrder: 50
---

[hero title="DOM Manipulation" tagline="jQuery-compatible API with 90+ chainable methods for traversal, manipulation, events, and more." align="center"][/hero]

## Selectors

Select elements using CSS selectors, DOM elements, or HTML strings.

```javascript
// CSS selector
$('.class')
$('#id')
$('div.container > p')

// DOM element
$(document.body)
$(element)

// HTML string
$('<div class="new">Content</div>')

// Collection from NodeList
$($('p'))
```

### Try It

[showcase-demo id="showcase/dom/try-it" title="Try It" /]

## Context Parameter

Limit your search to a specific element for better performance and clarity.

```javascript
// Search within specific container
const container = $('#container')[0];
$('li', container).addClass('highlight');

// Equivalent to chaining
$('#container').find('li').addClass('highlight');

// Performance benefit: searches smaller subset
$('.item', containerEl).css('color', 'blue');
```

### Try It

[showcase-demo id="showcase/dom/try-it-3" title="Try It" /]

## Traversal

Navigate the DOM tree with chainable methods.

find()

children()

parent()

parents()

closest()

siblings()

next()

prev()

nextAll()

prevAll()

first()

last()

eq()

filter()

not()

has()

is()

add()

contents()

offsetParent()

```javascript
// Find descendants
$('#container').find('.item')

// Navigate up
$('.item').parent()
$('.item').closest('.container')
$('.item').parents('div')

// Siblings
$('.active').siblings()
$('.item').next()
$('.item').prev()

// Filtering
$('.items').filter('.active')
$('.items').not('.disabled')
$('.items').eq(2)  // Third element
$('.items').first()
$('.items').last()
```

### Try It

[showcase-demo id="showcase/dom/try-it-4" title="Try It" /]

## Content Manipulation

Get and set element content, attributes, and values.

html()

text()

val()

attr()

removeAttr()

prop()

removeProp()

data()

removeData()

```javascript
// Get/set HTML content
$('#box').html()              // Get
$('#box').html('New')  // Set

// Get/set text content
$('#box').text()
$('#box').text('Plain text')

// Get/set form values
$('input').val()
$('input').val('New value')

// Attributes
$('img').attr('src')
$('img').attr('src', 'new.jpg')
$('img').attr({ src: 'img.jpg', alt: 'Image' })

// Data attributes
$('#el').data('id')          // data-id
$('#el').data('id', '123')
```

### Try It

[showcase-demo id="showcase/dom/try-it-5" title="Try It" /]

## CSS & Classes

Manipulate styles and CSS classes.

css()

addClass()

removeClass()

toggleClass()

hasClass()

show()

hide()

toggle()

```javascript
// Get/set CSS
$('#box').css('color')
$('#box').css('color', 'red')
$('#box').css({ color: 'red', fontSize: '16px' })

// Classes
$('#box').addClass('active')
$('#box').removeClass('active')
$('#box').toggleClass('active')
$('#box').hasClass('active')  // Returns boolean

// Visibility
$('#box').show()
$('#box').hide()
$('#box').toggle()
```

### Try It

[showcase-demo id="showcase/dom/try-it-6" title="Try It" /]

## DOM Manipulation

Insert, replace, and remove elements.

append()

prepend()

after()

before()

appendTo()

prependTo()

insertAfter()

insertBefore()

wrap()

wrapAll()

wrapInner()

unwrap()

clone()

remove()

detach()

empty()

replaceWith()

replaceAll()

```javascript
// Inserting content
$('#list').append('New item')
$('#list').prepend('First item')
$('#item').after('After')
$('#item').before('Before')

// Moving elements
$('New').appendTo('#list')

// Wrapping
$('.item').wrap('')
$('.item').unwrap()

// Removing
$('#item').remove()
$('#list').empty()

// Cloning
$('#item').clone()
```

### Try It

[showcase-demo id="showcase/dom/try-it-7" title="Try It" /]

## Events

Attach, trigger, and manage events.

on()

off()

one()

trigger()

click()

dblclick()

mouseenter()

mouseleave()

mouseover()

mouseout()

mousemove()

mousedown()

mouseup()

hover()

focus()

blur()

change()

submit()

keydown()

keyup()

keypress()

scroll()

resize()

```javascript
// Basic event binding
$('#btn').on('click', function(e) {
    console.log('Clicked!', this);
});

// Event delegation
$('#list').on('click', '.item', handler);

// One-time event
$('#btn').one('click', handler);

// Remove events
$('#btn').off('click');
$('#btn').off('click', specificHandler);

// Trigger events
$('#btn').trigger('click');

// Shorthand methods
$('#btn').click(handler);
$('#input').focus(handler);
$('#form').submit(handler);

// Hover (mouseenter + mouseleave)
$('#box').hover(enterFn, leaveFn);
```

### Try It

[showcase-demo id="showcase/dom/try-it-8" title="Try It" /]

## Effects & Animation

Animate elements with built-in effects.

fadeIn()

fadeOut()

fadeToggle()

fadeTo()

slideDown()

slideUp()

slideToggle()

animate()

stop()

delay()

```javascript
// Fade effects
$('#box').fadeIn(400)
$('#box').fadeOut(400)
$('#box').fadeToggle()
$('#box').fadeTo(400, 0.5)  // Fade to 50% opacity

// Slide effects
$('#box').slideDown(400)
$('#box').slideUp(400)
$('#box').slideToggle()

// Custom animation
$('#box').animate({
    opacity: 0.5,
    marginLeft: '100px'
}, 500)

// Chained animations with delay
$('#box')
    .fadeOut(200)
    .delay(500)
    .fadeIn(200)
```

### Try It

[showcase-demo id="showcase/dom/try-it-9" title="Try It" /]

## Dimensions & Position

Get and set element dimensions and position.

width()

height()

innerWidth()

innerHeight()

outerWidth()

outerHeight()

offset()

position()

scrollTop()

scrollLeft()

```javascript
// Dimensions
$('#box').width()              // Content width
$('#box').width(200)           // Set width
$('#box').height()
$('#box').innerWidth()         // Including padding
$('#box').outerWidth()         // Including padding + border
$('#box').outerWidth(true)     // Including margin

// Position
$('#box').offset()             // { top, left } relative to document
$('#box').position()           // { top, left } relative to offset parent

// Scroll
$(window).scrollTop()
$(window).scrollTop(0)         // Scroll to top
$('#box').scrollLeft()
```

### Try It

[showcase-demo id="showcase/dom/try-it-10" title="Try It" /]

## Collection Utilities

Iterate and work with element collections.

each()

get()

index()

toArray()

length

```javascript
// Iterate
$('.items').each(function(index, element) {
    console.log(index, $(this).text());
});

// Map to values
const texts = $('.items').map(function() {
    return $(this).text();
}).toArray();

// Get raw elements
$('.items').get()     // All elements as array
$('.items').get(0)    // First element
$('.items')[0]        // Same as get(0)

// Index
$('.items').index($('.active'))  // Position of element

// Length
$('.items').length    // Number of elements
```

## Complete Method Reference

All 90+ methods available in the DOM namespace.

[showcase-demo id="showcase/dom/complete-method-reference" title="Complete Method Reference" /]
