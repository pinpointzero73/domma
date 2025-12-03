# Domma API Reference

## Core

### `Domma(selector)`
Selects elements from the DOM.
- **selector**: CSS selector string, HTMLElement, or NodeList.
- **Returns**: `DommaCollection`

### `Domma.setup(config)`
Initializes the application with a JSON configuration.
- **config**: Object where keys are selectors and values are configuration objects.

## DommaCollection Methods

### `html(content)`
Get or set the inner HTML.
- **content** (optional): String of HTML.

### `text(content)`
Get or set the text content.
- **content** (optional): String of text.

### `css(property, value)`
Get or set CSS styles.
- **property**: CSS property name or object of key-value pairs.
- **value** (optional): CSS value.

### `addClass(className)`
Add one or more classes.
- **className**: Space-separated class names.

### `removeClass(className)`
Remove one or more classes.
- **className**: Space-separated class names.

### `on(event, handler)`
Add an event listener.
- **event**: Event name (e.g., 'click').
- **handler**: Callback function.

### `off(event, handler)`
Remove an event listener.

### `click(handler)`
Shortcut for `on('click', handler)`.

### `dblclick(handler)`
Shortcut for `on('dblclick', handler)`.

## HTTP Module (`Domma.http`)

### `get(url, config)`
Perform a GET request.

### `post(url, data, config)`
Perform a POST request.

### `put(url, data, config)`
Perform a PUT request.

### `delete(url, config)`
Perform a DELETE request.

## Utilities (`Domma.utils`)

### `merge(target, ...sources)`
Deep merge objects.

### `each(collection, iteratee)`
Iterate over arrays or objects.

### `clone(value)`
Deep clone an object.
