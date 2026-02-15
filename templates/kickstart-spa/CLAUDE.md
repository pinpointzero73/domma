# CLAUDE.md - Domma Project Conventions

This file enforces Domma framework conventions for augmented development (Claude Code, Cursor, etc.).

## What is Domma?

**D**ynamic **O**bject **M**anipulation & **M**odeling **A**PI - A lightweight, zero-dependency JavaScript framework combining jQuery-style DOM manipulation, Lodash utilities, and modern UI components.

## Convention Enforcement

**Before writing code, check this table to use Domma's built-in features:**

| When you need...                  | Use Domma's...                | NOT...                          |
|-----------------------------------|-------------------------------|---------------------------------|
| DOM selection/manipulation        | `$('#el').addClass('active')` | `document.querySelector()`      |
| Store data locally                | `S.set('key', data)`          | `localStorage.setItem()`        |
| Make HTTP requests                | `H.get('/api/users')`         | `fetch('/api/users')`           |
| Utility functions (map, filter)   | `_.map(array, fn)`            | Manual `array.map()`            |
| Date manipulation                 | `D().add(1, 'day')`           | Manual date arithmetic          |
| Reactive data models              | `M.create(blueprint)`         | Manual state management         |
| Form generation                   | `F.create(selector, blueprint)` | Manual `<form>` HTML          |
| UI components (modals, tabs)      | `E.modal(selector, options)`  | Manual HTML/CSS/JS              |
| Toast notifications               | `E.toast('Message', {type})`  | Manual notification divs        |
| Icons                             | `<span data-icon="name">`     | Manual SVG/icon fonts           |
| DataTables                        | `T.create(selector, {data})`  | Manual table generation         |
| Confirm dialogs                   | `await E.confirm('Sure?')`    | `window.confirm()`              |
| Templates                         | `templateUrl: 'path.html'`    | Large template strings in JS    |

## Template File Convention (CRITICAL)

**✅ DO:**
- Use `templateUrl: 'js/views/templates/home.html'` for view templates
- Store templates in `js/views/templates/` directories
- Use `partials: { name: 'path.html' }` for reusable template sections
- Keep JavaScript files focused on logic, HTML files focused on markup

**❌ DON'T:**
- Put large HTML template strings in JavaScript const variables
- Use inline `template:` strings longer than ~5 lines
- Mix presentation markup with business logic

## Alias Quick Reference

| Full Path        | Alias | Description                      |
|------------------|-------|----------------------------------|
| `Domma()`        | `$`   | DOM selection/manipulation       |
| `Domma.utils`    | `_`   | Utility functions                |
| `Domma.models`   | `M`   | Reactive models & pub/sub        |
| Blueprint        | `B`   | Blueprint composition            |
| `Domma.dates()`  | `D()` | Date manipulation                |
| `Domma.storage`  | `S`   | localStorage wrapper             |
| `Domma.forms`    | `F`   | Form builder                     |
| `Domma.http`     | `H`   | HTTP client                      |
| `Domma.elements` | `E`   | UI components                    |
| `Domma.icons`    | `I`   | SVG icon system                  |
| `Domma.tables`   | `T`   | DataTable functionality          |

## CSS Load Order (CRITICAL)

Always load CSS in this order:

```html
<link rel="stylesheet" href="dist/domma.css">                    <!-- 1. Base + utilities -->
<link rel="stylesheet" href="dist/grid.css">                     <!-- 2. Grid system -->
<link rel="stylesheet" href="dist/elements.css">                 <!-- 3. UI components -->
<link rel="stylesheet" href="dist/themes/domma-themes.css">      <!-- 4. Theming -->
<link rel="stylesheet" href="css/custom.css">                    <!-- 5. Custom CSS last -->
```

## Page Structure Pattern

**JavaScript initialization:**

```html
<script src="dist/domma.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/dompurify@3/dist/purify.min.js"></script> <!-- For dynamic content -->
<script>
    // Initialize Domma BEFORE loading app scripts
    Domma.init();
    Domma.icons.scan();
</script>
<script type="module" src="js/app.js"></script>
```

## Router Views Pattern

```javascript
// ✅ CORRECT - External template file
export const homeView = {
    templateUrl: 'js/views/templates/home.html',

    partials: {                                      // Optional
        'header': 'js/views/templates/partials/header.html'
    },

    onMount($container) {
        I.scan($container[0]);
    }
};

// ❌ WRONG - Inline HTML string
export const homeView = {
    template: `<div>...50 lines...</div>`
};
```

## Blueprint-Driven Forms Pattern

```javascript
// ✅ CORRECT - Define blueprint, generate form
const blueprint = {
    name: { type: M.types.string, required: true },
    email: { type: M.types.string, pattern: /^.+@.+\..+$/ }
};

F.create('#form-container', {
    blueprint,
    layout: 'grid',
    onSubmit: (data) => H.post('/api/submit', data)
});

// ❌ WRONG - Manual HTML form in template
```

## When Unsure

**Before writing vanilla JavaScript, ASK:**
"Does Domma provide this for [HTTP/storage/DOM/forms/dates/components]?"

Check the convention table above first.

## Project Structure

```
frontend/
├── index.html           # Entry point
├── js/
│   ├── app.js           # Router initialization
│   └── views/
│       ├── home.js      # View logic
│       ├── about.js
│       └── templates/   # Template files
│           ├── home.html
│           ├── about.html
│           └── partials/
│               ├── header.html
│               └── footer.html
├── css/
│   └── custom.css       # Custom styles
└── assets/
    └── logo/

blueprints/              # Reusable schemas
├── common/              # Shared blueprints
├── crud/                # CRUD blueprints
└── forms/               # Form blueprints

backend/                 # Backend API (if needed)
```

## Common Mistakes to Avoid

1. Large inline template strings → Use `templateUrl`
2. Manual `<form>` HTML → Use blueprints + `F.create()`
3. Using `fetch()` → Use `H.get()` / `H.post()`
4. Using `localStorage` → Use `S.set()` / `S.get()`
5. Forgetting `I.scan()` after dynamic icons
6. Wrong CSS load order (elements before grid)
7. Init Domma after module scripts (must be before)

## Additional Resources

- Check `.claude/snippets.md` for code patterns
- Check `blueprints/README.md` for schema examples
- Official docs: https://dommajs.org/docs/
