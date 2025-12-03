# Domma 🚀

A lightweight JavaScript toolkit combining DOM manipulation, HTTP requests, and utilities with a unique JSON-based configuration engine.

## Features

- **jQuery-like DOM manipulation**: Select, modify, and interact with DOM elements
- **Axios-like HTTP client**: Simple async HTTP requests
- **Lodash-like utilities**: Common utility functions
- **JSON Configuration**: Define element behavior declaratively

## Installation

**Browser (UMD):**

```html

<script src="dist/domma.min.js"></script>
```

**ES Module:**

```javascript
import Domma from './dist/domma.esm.js';
```

## Quick Start

```javascript
import Domma from './dist/domma.esm.js';

// Select and modify elements
Domma('#myElement').text('Hello World!');

// Handle events
Domma('button').click(() => alert('Clicked!'));

// Make HTTP requests
const data = await Domma.http.get('https://api.example.com/data');

// Use utilities
const merged = Domma.utils.merge({}, obj1, obj2);
```

## JSON Configuration

Define your app's behavior with a simple JSON object:

```javascript
Domma.setup({
    '#header': {
        initial: {
            css: { color: 'blue' },
            text: 'Welcome!'
        },
        events: {
            click: {
                addClass: 'active'
            }
        }
    }
});
```

## Documentation

- [Getting Started](docs/GettingStarted.md)
- [API Reference](docs/API.md)

## Demo

Open `demo.html` in your browser to see Domma in action with:
- Interactive color switcher
- HTTP request examples
- Todo list application

## Testing

Open `tests/test.html` in your browser to run the test suite.

## License

ISC
