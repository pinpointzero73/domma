---
title: Frequently Asked Questions
description: Answers to common questions about Domma - installing it, compatibility, the global aliases, events and reactive models.
layout: default
status: published
sortOrder: 30
---

[hero title="Frequently Asked Questions" tagline="Answers to common questions about Domma." size="lg" align="center"][/hero]

## Getting started

[accordion]
[item title="What is Domma?"]
Domma (Dynamic Object Manipulation & Modeling API) is a lightweight, zero-dependency JavaScript framework. It combines
jQuery-style DOM manipulation, Lodash-style utilities, Moment-style dates, reactive models and a full set of UI
components in one bundle - about 175 KB gzipped.
[/item]
[item title="How do I install Domma?"]
Include the script tag in your page:

```html
<script src="domma.min.js"></script>
```

That's it - no build step is needed. It is also on npm (`npm install domma-js`), and `npx domma-js init` scaffolds a
new project. See the [QuickStart](/quickstart).
[/item]
[item title="Does Domma need any dependencies?"]
No. Domma is self-contained with no external dependencies. Everything you need is in a single file.
[/item]
[/accordion]

## Features and compatibility

[accordion]
[item title="Can I use Domma with my existing CSS framework?"]
Yes. Domma's JavaScript works independently of its CSS. Switch Domma's theming off entirely with
`$.setup({ noStyles: true })` and use Bootstrap, Tailwind or your own styles.
[/item]
[item title="Is Domma compatible with jQuery?"]
Domma uses the same `$()` syntax as jQuery, so if you know jQuery you'll feel at home. It is not a drop-in replacement,
though - it's a separate library with its own implementation.
[/item]
[item title="Which browsers does Domma support?"]
All modern browsers, including Chrome, Firefox, Safari and Edge. It uses standard ES2015+ features and the Fetch API.
[/item]
[item title="Can I use ES modules?"]
Yes. Domma ships as both UMD and ESM bundles, so you can import just what you need:

```js
import { Domma, utils, dates } from './domma.esm.js';
```
[/item]
[/accordion]

## Usage and good practice

[accordion]
[item title="What are the global aliases?"]
Domma provides short aliases for the things you reach for most:

- `$` - DOM manipulation (like jQuery)
- `_` - utility functions (like Lodash)
- `D()` - dates (like Moment.js)
- `M` - reactive models
- `S` - storage
- `H` - HTTP
- `E` - UI elements

The full list is in the [reference](/showcase/reference).
[/item]
[item title="How do I handle events?"]
Domma uses a jQuery-style event system:

```js
$('.button').on('click', (e) => {
    console.log('Clicked!');
});

// Event delegation
$('.container').on('click', '.item', (e) => {
    console.log('Item clicked');
});
```
[/item]
[item title="How does the reactive model system work?"]
Domma's models are reactive data objects with validation and DOM binding:

```js
const user = M.create({
    name: { type: M.types.string, required: true },
    age: { type: M.types.number }
});

M.bind(user, 'name', '#name-input', { twoWay: true });
user.onChange('name', (val) => console.log(val));
```

For markup that already exists, `M.applyBindings()` wires `data-bind-*`, `data-model` and `data-on-*` attributes
straight to your data. See [Models](/showcase/models).
[/item]
[/accordion]

## Support

[accordion]
[item title="Where can I find the documentation?"]
The [Showcase](/showcase) has a live example of every feature with its code, and the [QuickStart](/quickstart) walks
you through your first project.
[/item]
[item title="How do I report a bug or ask for a feature?"]
Open an issue on [GitHub](https://github.com/pinpointzero73/domma/issues) with as much detail as you can: browser
version, a code sample, and what you expected against what happened.
[/item]
[/accordion]
