# CLAUDE.md - Showcase Development

This file provides guidance for creating and maintaining Domma showcase examples.

## Showcase Structure

The showcase contains 40+ interactive demo files organised by module and component:

```
public/showcase/
├── index.html              # Showcase hub
├── dom/                    # DOM module examples
├── utils/                  # Utils module examples
├── dates/                  # Dates module examples
├── models/                 # Models module examples
├── tables/                 # Tables module examples
├── config/                 # Configuration examples
├── http/                   # HTTP client examples
├── icons/                  # Icon system examples
├── storage/                # Storage wrapper examples
├── theme-roller/           # Theme Roller tool
├── elements/               # UI components (25+ sub-folders)
│   ├── modal/
│   ├── tabs/
│   ├── accordion/
│   ├── carousel/
│   ├── editor/
│   └── ... (20+ more)
├── grid/                   # CSS Grid examples
├── css/                    # CSS utilities
├── themes/                 # Theme examples
├── examples/               # Complete examples
├── layouts/                # Layout templates
├── blog/                   # Blog example
└── kickstart/              # Quick start template
```

## Creating New Showcase Examples

### 1. File Structure

Each showcase example should follow this structure:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Module Name - Domma Showcase</title>
    <!-- CSS Load Order -->
    <link rel="stylesheet" href="../css/domma.css">      <!-- 1. Base + utilities -->
    <link rel="stylesheet" href="../css/grid.css">       <!-- 2. Grid system (optional) -->
    <link rel="stylesheet" href="../css/elements.css">   <!-- 3. UI components -->
    <link rel="stylesheet" href="../../dist/themes/domma-themes.css"> <!-- 4. Theming -->
    <style>
        /* Example-specific styles */
    </style>
</head>
<body>
    <div class="container">
        <h1>Module Name</h1>
        <p>Brief description of what this showcase demonstrates.</p>

        <!-- Demo content here -->
    </div>

    <script src="../../dist/domma.min.js"></script>
    <script>
        // Example code here
        // Always use Domma aliases ($, _, M, D, S) when applicable
    </script>
</body>
</html>
```

### 2. Naming Conventions

- **Folders**: lowercase, hyphenated (e.g., `theme-roller/`, `button-group/`)
- **HTML files**: `index.html` for main example, descriptive names for variations
- **CSS**: Inline `<style>` for small examples, separate file for complex ones
- **JavaScript**: Inline `<script>` for showcase examples

### 3. Using Domma in Showcase

**Always use Domma for:**

- DOM manipulation (`$` instead of `document.querySelector`)
- Utilities (`_` for array/object operations)
- Storage operations (`S` instead of `localStorage`)
- Date handling (`D` instead of native Date)
- Reactive models (`M` for data binding)

**Examples:**

```javascript
// ✅ Good - Uses Domma
$('#button').on('click', () => {
    const data = _.groupBy(items, 'category');
    S.set('results', data);
});

// ❌ Bad - Doesn't use Domma
document.getElementById('button').addEventListener('click', () => {
    // Not demonstrating Domma capabilities
});
```

### 4. Code Comments

Add explanatory comments for:

- What the example demonstrates
- Key Domma features being used
- Non-obvious configuration options
- Expected behaviour/output

### 5. Responsive Design

Ensure examples work on:

- Desktop (>768px)
- Tablet (576-768px)
- Mobile (<576px)

Use Domma's grid system or responsive utilities.

### 6. Accessibility

- Use semantic HTML
- Add ARIA labels where needed
- Ensure keyboard navigation works
- Test with screen readers when applicable

## Updating Existing Showcases

When updating features:

1. **Update relevant showcase examples** to demonstrate new capabilities
2. **Add new examples** if feature is significantly different
3. **Update documentation** in module-specific CLAUDE.md files
4. **Test all interactive elements** after changes
5. **Verify cross-browser compatibility**

## Module-Specific Guidelines

Each major module has its own CLAUDE.md with detailed guidance:

- [DOM Module](./dom/CLAUDE.md) - DOM manipulation examples
- [Utils Module](./utils/CLAUDE.md) - Utility function examples
- [Dates Module](./dates/CLAUDE.md) - Date handling examples
- [Models Module](./models/CLAUDE.md) - Reactive model examples
- [Tables Module](./tables/CLAUDE.md) - DataTable examples
- [Elements Module](./elements/CLAUDE.md) - UI component examples
- [Config Module](./config/CLAUDE.md) - Configuration examples
- [HTTP Module](./http/CLAUDE.md) - HTTP client examples
- [Storage Module](./storage/CLAUDE.md) - Storage wrapper examples
- [Theme Roller](./theme-roller/CLAUDE.md) - Developer tools

## Testing Showcases

Before committing showcase changes:

1. **Load in browser** - Ensure no console errors
2. **Test all interactions** - Click buttons, fill forms, etc.
3. **Check responsive behaviour** - Resize browser window
4. **Verify Domma usage** - Confirm using framework features
5. **Validate HTML** - Use W3C validator if complex
6. **Test theme switching** - Ensure works in light/dark themes

## Common Patterns

### Loading State

```javascript
const loader = Domma.elements.loader('#container', {
    type: 'spinner',
    text: 'Loading...'
});

loader.show();

// Async operation
await fetchData();

loader.hide();
```

### Error Handling

```javascript
try {
    const result = await Domma.http.get('/api/data');
    $('#output').html(_.template(template)(result));
} catch (error) {
    await Domma.elements.alert('Error: ' + error.message);
}
```

### Theme-Aware Examples

```javascript
// Listen for theme changes
$(document.body).on('themechange', (e) => {
    console.log('Theme changed to:', e.detail.theme);
    // Update example if needed
});
```

## Showcase Hub Integration

When adding a new showcase:

1. **Add link** in `index.html` (showcase hub)
2. **Use consistent categorisation** (modules, components, tools, examples)
3. **Include thumbnail** or icon if applicable
4. **Write brief description** (1-2 sentences)

## Development Guidelines

- **Update in-line**: When adding features, update showcase immediately
- **Use Domma everywhere**: Demonstrate framework capabilities
- **Keep it simple**: Focus on one feature per example
- **Make it interactive**: Let users play with the feature
- **Show code**: Display the code being demonstrated
- **Provide variations**: Show different configuration options

## File Paths

All showcase files should use relative paths in this order:

```html
<!-- CSS (Load in this specific order) -->
<link rel="stylesheet" href="../css/domma.css">           <!-- 1. Base -->
<link rel="stylesheet" href="../css/grid.css">            <!-- 2. Grid (optional) -->
<link rel="stylesheet" href="../css/elements.css">        <!-- 3. Components -->
<link rel="stylesheet" href="../../dist/themes/domma-themes.css"> <!-- 4. Theme -->

<!-- JavaScript -->
<script src="../../dist/domma.min.js"></script>
<script src="../../dist/domma-tools.min.js"></script> <!-- If needed -->
```

**Note:** Always load `elements.css` for UI components (buttons, cards, modals, etc.)

## PHPStorm Integration

When updating showcases, verify code intelligence works:

- Check `public/assets/ide/phpstorm/` type definitions
- Update `.d.ts` files if adding new APIs
- Test autocomplete in IDE

## Related Documentation

- [Main CLAUDE.md](../../CLAUDE.md) - Project overview
- [Core Modules](../../src/CLAUDE.md) - Module architecture
- [API Reference](../../docs/API.md) - Complete API documentation
- [User Documentation](../../docs/DommaDocumentation.md) - Comprehensive guide

## Quick Reference

**Server:** Do not run a server - one is already running

**Build:** `npm run build` from project root

**Showcase:** `npm run showcase` for live development

**Test:** Open showcase files directly in browser or use running server
