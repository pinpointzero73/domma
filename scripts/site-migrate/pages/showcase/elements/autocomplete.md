---
title: Autocomplete
description: "Enhance text inputs with intelligent suggestion dropdowns, real-time filtering, and keyboard navigation"
layout: with-sidebar
status: published
sortOrder: 50
---

[hero title="Autocomplete" tagline="Enhance text inputs with intelligent suggestion dropdowns, real-time filtering, and keyboard navigation" align="center"][/hero]

## Overview

The Autocomplete component enhances text inputs with intelligent suggestion dropdowns. It provides real-time filtering, keyboard navigation, and support for both static and async data sources. Perfect for search boxes, address inputs, tag selection, and any scenario where users need suggestions while typing.

### Key Features

- **Flexible Data Sources** - Static arrays or async functions (API calls)
- **Smart Filtering** - Client-side and server-side filtering with debouncing
- **Keyboard Navigation** - Full arrow key, Enter, Escape, Tab support
- **Match Highlighting** - Highlights matched text in suggestions
- **Position Detection** - Auto-adjusts dropdown position to viewport
- **Loading States** - Shows loading indicators for async operations
- **Accessibility** - ARIA compliant with screen reader support

### When to Use

- Search inputs with suggested queries
- Address or location lookups
- Product or category selection
- Username or email input with suggestions
- Any input that benefits from auto-suggestions

### Basic Usage

```
// Static data source
const autocomplete = Domma.elements.autocomplete('#search', {
    data: ['Apple', 'Banana', 'Cherry', 'Date', 'Elderberry'],
    minChars: 1,
    onSelect: (value) => console.log('Selected:', value)
});

// Async data source
Domma.elements.autocomplete('#city', {
    dataSource: async (query) => {
        const res = await fetch(`/api/cities?q=${query}`);
        return res.json();
    },
    debounce: 300
});
```

## Quick Start

### Simple Autocomplete

Type to see fruit suggestions:

[showcase-demo id="showcase/elements/autocomplete/simple-autocomplete" title="Simple Autocomplete" /]

```
<input type="text" id="fruit-search" placeholder="Type a fruit name...">

<script>
const fruits = [
    'Apple', 'Apricot', 'Avocado', 'Banana', 'Blackberry', 'Blueberry',
    'Cherry', 'Coconut', 'Date', 'Dragonfruit', 'Elderberry', 'Fig',
    'Grape', 'Grapefruit', 'Guava', 'Kiwi', 'Lemon', 'Lime', 'Mango',
    'Orange', 'Papaya', 'Peach', 'Pear', 'Pineapple', 'Plum', 'Raspberry',
    'Strawberry', 'Tangerine', 'Watermelon'
];

Domma.elements.autocomplete('#fruit-search', {
    data: fruits,
    minChars: 1,
    maxResults: 8,
    onSelect: (value) => {
        console.log('Selected fruit:', value);
    }
});
</script>
```

## Tutorial

Let's build a country selector with flag emojis and match highlighting.

### Step 1: Create the Input

```
<input type="text" id="country-search" placeholder="Search countries...">
```

### Step 2: Prepare Data with Labels and Values

```
const countries = [
    { value: 'us', label: '\ud83c\uddfa\ud83c\uddf8 United States' },
    { value: 'uk', label: '\ud83c\uddec\ud83c\udde7 United Kingdom' },
    { value: 'ca', label: '\ud83c\udde8\ud83c\udde6 Canada' },
    { value: 'au', label: '\ud83c\udde6\ud83c\uddfa Australia' },
    { value: 'de', label: '\ud83c\udde9\ud83c\uddea Germany' },
    { value: 'fr', label: '\ud83c\uddeb\ud83c\uddf7 France' },
    { value: 'jp', label: '\ud83c\uddef\ud83c\uddf5 Japan'},
    { value: 'cn', label: '\ud83c\udde8\ud83c\uddf3 China' }
    // ... more countries
];
```

### Step 3: Initialize Autocomplete

```
const countryPicker = Domma.elements.autocomplete('#country-search', {
    data: countries,
    minChars: 1,
    highlightMatches: true,
    onSelect: (country) => {
        console.log('Selected:', country.label);
        console.log('Country code:', country.value);
    }
});
```

### Step 4: Try It Out

[showcase-demo id="showcase/elements/autocomplete/try-it-out" title="Step 4: Try It Out" /]

**Key Points:** The autocomplete filters on both values and labels, highlights matched text, and returns the full object when an item is selected.

## Examples

### Example 1: Async Data Source (Simulated API)

Search for programming languages with simulated async fetch:

[showcase-demo id="showcase/elements/autocomplete/async-data-source-simulated-api" title="Example 1: Async Data Source (Simulated API)" /]

```
Domma.elements.autocomplete('#language-search', {
    dataSource: async (query) => {
        // Simulate API call with delay
        await new Promise(resolve => setTimeout(resolve, 500));

        const languages = [
            'JavaScript', 'TypeScript', 'Python', 'Java', 'C++', 'C#',
            'Ruby', 'Go', 'Rust', 'PHP', 'Swift', 'Kotlin'
        ];

        return languages.filter(lang =>
            lang.toLowerCase().includes(query.toLowerCase())
        );
    },
    debounce: 300,
    minChars: 2,
    loadingMessage: 'Searching languages...'
});
```

### Example 2: Custom Rendering

Render suggestions with custom HTML structure:

[showcase-demo id="showcase/elements/autocomplete/custom-rendering" title="Example 2: Custom Rendering" /]

```
const users = [
    { name: 'Alice Johnson', email: 'alice@example.com', role: 'Admin' },
    { name: 'Bob Smith', email: 'bob@example.com', role: 'User' },
    { name: 'Carol White', email: 'carol@example.com', role: 'Editor' }
];

Domma.elements.autocomplete('#user-search', {
    data: users,
    renderItem: (user, query) => {
        return `
            <div style="display: flex; flex-direction: column;">
                <strong>${user.name}</strong>
                <span style="font-size: 0.875rem; color: var(--dm-text-secondary, #666);">${user.email}</span>
                <span style="font-size: 0.75rem; color: var(--dm-text-muted, #999);">Role: ${user.role}</span>
            </div>
        `;
    },
    onSelect: (user) => console.log('Selected user:', user.name)
});
```

### Example 3: Position Control

Control dropdown position (try scrolling):

[showcase-demo id="showcase/elements/autocomplete/position-control" title="Example 3: Position Control" /]

```
// Force above
Domma.elements.autocomplete('#input-above', {
    data: items,
    position: 'above'
});

// Auto-detect (default)
Domma.elements.autocomplete('#input-auto', {
    data: items,
    position: 'auto'  // Default - chooses best position
});
```

### Example 4: Clear on Select

Useful for multi-entry inputs (tags, emails, etc.):

[showcase-demo id="showcase/elements/autocomplete/clear-on-select" title="Example 4: Clear on Select" /]

```
const tags = ['React', 'Vue', 'Angular', 'Svelte', 'Next.js', 'Nuxt.js'];
const selectedTags = [];

Domma.elements.autocomplete('#tag-input', {
    data: tags,
    clearOnSelect: true,
    onSelect: (tag) => {
        if (!selectedTags.includes(tag)) {
            selectedTags.push(tag);
            renderTags();
        }
    }
});

function renderTags() {
    $('#tag-container')[0].innerHTML =
        selectedTags.map(tag =>
            `<span class="badge">${tag}</span>`
        ).join('');
}
```

## Best Practices

### Accessibility

- **ARIA Attributes:** Autocomplete includes proper ARIA roles and attributes automatically
- **Keyboard Navigation:** Always test with keyboard only (Tab, Arrow keys, Enter, Escape)
- **Screen Readers:** Results are announced as users navigate with arrow keys
- **Label Elements:** Always use `<label>` elements for inputs

### Performance

- **Debouncing:** Use appropriate debounce values (200-500ms) for async data sources
- **Result Limits:** Set `maxResults` to limit dropdown size (recommended: 8-12)
- **Large Datasets:** For 1000+ items, use async data source with server-side filtering
- **Caching:** Cache API responses when appropriate to reduce network requests

### UX Guidelines

- **Minimum Characters:** Set `minChars` to 2-3 to avoid showing too many results
- **Empty States:** Provide helpful empty messages ("No results found", "Type to search")
- **Loading Indicators:** Always show loading states for async operations
- **Match Highlighting:** Enable `highlightMatches` to help users see why items matched

### Common Pitfalls

- **Avoid:** Setting `minChars: 0` - this can show entire dataset on focus
- **Avoid:** Very short debounce times (<100ms) - causes excessive API calls
- **Avoid:** Very long debounce times (>800ms) - feels sluggish to users
- **Avoid:** Not handling errors in async data sources - always use try/catch

## API Reference

### Options

[table striped="true"]
| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `data` | Array | `[]` | Static data source (strings or objects with label/value) |
| `dataSource` | Function | `null` | Async function that returns Promise<Array> |
| `minChars` | Number | `1` | Minimum characters before showing suggestions |
| `maxResults` | Number | `10` | Maximum number of results to display |
| `debounce` | Number | `300` | Debounce delay in milliseconds |
| `filterFn` | Function | `null` | Custom filter function (item, query) => boolean |
| `renderItem` | Function | `null` | Custom item renderer (item, query) => HTML string or Element |
| `highlightMatches` | Boolean | `true` | Highlight matched text in results |
| `position` | String | `'auto'` | Dropdown position: 'auto', 'above', 'below' |
| `placeholder` | String | `''` | Input placeholder text |
| `emptyMessage` | String | `'No results found'` | Message shown when no results |
| `loadingMessage` | String | `'Loading...'` | Message shown while loading async data |
| `caseSensitive` | Boolean | `false` | Case-sensitive filtering |
| `selectOnEnter` | Boolean | `true` | Select active item on Enter key |
| `clearOnSelect` | Boolean | `false` | Clear input after selection |
| `onSelect` | Function | `null` | Callback when item selected: (value, event) => {} |
| `onChange` | Function | `null` | Callback on input change: (value, event) => {} |
| `onOpen` | Function | `null` | Callback when dropdown opens: () => {} |
| `onClose` | Function | `null` | Callback when dropdown closes: () => {} |
| `onFilter` | Function | `null` | Transform filtered results: (results, query) => results |
[/table]

### Methods

[table striped="true"]
| Method | Returns | Description |
| --- | --- | --- |
| `open()` | this | Open the dropdown |
| `close()` | this | Close the dropdown |
| `toggle()` | this | Toggle dropdown open/close |
| `isOpen()` | Boolean | Check if dropdown is open |
| `setValue(value)` | this | Set input value |
| `getValue()` | String | Get current input value |
| `setData(data)` | this | Update static data source |
| `refresh()` | this | Re-filter with current input value |
| `clearValue()` | this | Clear input and close dropdown |
| `focus()` | this | Focus the input element |
| `destroy()` | void | Remove component and clean up |
[/table]

### CSS Classes

[table striped="true"]
| Class | Description |
| --- | --- |
| `.dm-autocomplete` | Wrapper container |
| `.dm-autocomplete-input` | The input element |
| `.dm-autocomplete-dropdown` | Dropdown container |
| `.dm-autocomplete-list` | Results list (ul) |
| `.dm-autocomplete-item` | Individual result item (li) |
| `.dm-autocomplete-item.active` | Currently focused item |
| `.dm-autocomplete-match` | Highlighted match text |
| `.dm-autocomplete-loading` | Loading indicator |
| `.dm-autocomplete-empty` | Empty state message |
[/table]

## Declarative Configuration

Use Domma's declarative configuration system to initialize autocomplete components from JSON config.

### Basic Configuration

```
$.setup({
    '#product-search': {
        component: 'autocomplete',
        options: {
            data: ['Laptop', 'Mouse', 'Keyboard', 'Monitor', 'Webcam'],
            minChars: 2,
            highlightMatches: true
        }
    }
});
```

### With Callbacks

```
$.setup({
    '#search-input': {
        component: 'autocomplete',
        options: {
            dataSource: async (query) => {
                const response = await fetch(`/api/search?q=${query}`);
                return response.json();
            },
            debounce: 400,
            onSelect: (item) => {
                console.log('User selected:', item);
            }
        }
    }
});
```

### Multiple Instances

```
$.setup({
    '#fruit-search': {
        component: 'autocomplete',
        options: {
            data: ['Apple', 'Banana', 'Cherry'],
            placeholder: 'Search fruits...'
        }
    },
    '#color-search': {
        component: 'autocomplete',
        options: {
            data: ['Red', 'Blue', 'Green', 'Yellow'],
            placeholder: 'Search colors...',
            clearOnSelect: true
        }
    }
});
```

## Model Integration

Autocomplete integrates seamlessly with Domma's reactive Model system (M) for two-way data binding. When bound to a model, the autocomplete automatically syncs with model changes and updates the model when user input changes.

### Basic Model Binding

[showcase-demo id="showcase/elements/autocomplete/basic-model-binding" title="Basic Model Binding" /]

```
// Create a model with a search field
const searchModel = M.create({
    query: { type: 'string', default: '' }
});

// Bind autocomplete to model
Domma.elements.autocomplete('#search', {
    data: ['Apple', 'Banana', 'Cherry', 'Date'],
    model: searchModel,
    modelKey: 'query'
});

// Model changes update the input
searchModel.set('query', 'App');  // Input shows "App"

// Typing updates the model automatically
// Display model value elsewhere using M.bind()
M.bind(searchModel, 'query', '#model-display');
```

### With Config Engine

```
const userModel = M.create({
    searchTerm: { type: 'string', default: '' }
});

$.setup({
    '#search': {
        component: 'autocomplete',
        options: {
            data: searchData,
            model: userModel,
            modelKey: 'searchTerm'
        }
    }
});
```

### Multiple Bindings

When multiple elements bind to the same model field, they all stay in sync automatically:

```
const model = M.create({
    query: { type: 'string', default: '' }
});

// Autocomplete bound to model
Domma.elements.autocomplete('#search-1', {
    data: items,
    model: model,
    modelKey: 'query'
});

// Display the value elsewhere
M.bind(model, 'query', '#search-display');

// Another input also bound to same field
M.bind(model, 'query', '#search-mirror', { twoWay: true });

// All three stay synchronized!
```

## CSS Customisation

Override these CSS variables to customise Autocomplete appearance and match your design system.

[table striped="true"]
| Variable | Default | Controls |
| --- | --- | --- |
| `--dm-autocomplete-bg` | `var(--dm-surface)` | Dropdown background |
| `--dm-autocomplete-border` | `var(--dm-border)` | Dropdown border colour |
| `--dm-autocomplete-highlight` | `var(--dm-primary-light)` | Match highlight colour |
| `--dm-hover-bg` | `var(--dm-slate-100)` | Item hover background |
[/table]

### Example Override

```css
:root {
    /* Yellow match highlighting */
    --dm-autocomplete-highlight: #fef3c7;
}
```

[Full CSS Customisation Cheat-Sheet →](/showcase/elements/css-customisation)

## Related Elements

Explore related Domma components:

[showcase-demo id="showcase/elements/autocomplete/related-elements" title="Related Elements" /]

**Coming Soon:** Pillbox component for multi-select tag inputs
