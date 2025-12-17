# Getting Started with Domma

## Installation

```bash
npm install domma
```

## Basic Usage

Import Domma in your JavaScript file:

```javascript
import Domma from 'domma';
```

### Selecting Elements

```javascript
Domma('#my-element').text('Hello World!');

// Select within a specific context for better performance
const sidebar = document.querySelector('.sidebar');
Domma('.nav-item', sidebar).addClass('active');

// Useful for dynamic content or large pages
Domma('button', document.getElementById('toolbar')).prop('disabled', true);
```

### Handling Events

```javascript
Domma('button').click(() => {
    alert('Button clicked!');
});
```

## JSON Configuration

Domma allows you to define your application's behaviour using a JSON object. This is great for separating logic from
configuration.

```javascript
const config = {
    '#header': {
        initial: {
            css: { color: 'blue' },
            text: 'Welcome to Domma'
        }
    },
    '#btn-save': {
        events: {
            click: {
                text: 'Saved!',
                addClass: 'disabled'
            }
        }
    }
};

Domma.setup(config);
```
