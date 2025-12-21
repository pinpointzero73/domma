# Domma Editor Extensions

Optional enhancements for the Domma editor. Apps can opt into individual extensions or use them all.

## Philosophy

The core Domma editor stays **minimal and lightweight**. Extensions provide rich features for apps that need them
without bloating the base framework.

## Available Extensions

### `colorPicker`

Adds text color and highlight color buttons with palette icon and color indicator.

### `headings`

Dropdown menu for H1, H2, H3 formatting (hover to open).

### `lists`

Dropdown menu for bullet and numbered lists.

### `alignment`

Dropdown menu for text alignment (left, center, right, justify).

### `table`

Button to insert tables with configurable rows/columns.

### `divider`

Button to insert horizontal rules (HR elements).

### `contextMenu`

Right-click context menu with formatting options.

### `imageResize`

Click-to-resize functionality for pasted images.

## Usage

### Option 1: Load Extensions Separately

```html
<script src="dist/domma.min.js"></script>
<script src="dist/domma-editor-extensions.min.js"></script>
```

```javascript
// Create editor
const editor = Domma.elements.editor('#myEditor', {
    mode: 'rich',
    toolbar: [
        ['bold', 'italic', 'underline'],
        ['blockquote', 'code'],
        ['link', 'image'],
        ['undo', 'redo']
    ]
});

// Apply extensions
Domma.EditorExtensions.apply(editor, [
    'colorPicker',
    'headings',
    'lists',
    'alignment',
    'table',
    'divider',
    'contextMenu',
    'imageResize'
]);
```

### Option 2: Use Full Bundle

```html
<script src="dist/domma-editor-full.min.js"></script>
```

Pre-bundled with all extensions included.

## Selective Loading

Only load what you need:

```javascript
// Just color picker and tables
Domma.EditorExtensions.apply(editor, ['colorPicker', 'table']);

// Just headings and alignment
Domma.EditorExtensions.apply(editor, ['headings', 'alignment']);
```

## Creating Custom Extensions

```javascript
Domma.EditorExtensions.register('myExtension', {
    install(editor, toolbar) {
        // Add your toolbar buttons
        const group = document.createElement('div');
        group.className = 'dm-editor-toolbar-group';

        const btn = document.createElement('button');
        btn.className = 'dm-editor-toolbar-btn';
        btn.innerHTML = '<span data-icon="star" data-icon-size="16"></span>';
        btn.addEventListener('click', () => {
            // Your custom functionality
            editor._editorEl.focus();
        });

        group.appendChild(btn);
        toolbar.appendChild(btn);
    }
});

// Use it
Domma.EditorExtensions.apply(editor, ['myExtension']);
```

## Extension Dependencies

Extensions use Domma icons automatically if available. Make sure to load:

```html
<link rel="stylesheet" href="dist/domma.css">
<script src="dist/domma.min.js"></script>
```

## Bundle Sizes

- Core editor: ~8KB minified
- Extensions: ~6KB minified
- Full bundle: ~14KB minified

## Examples

See `/public/miniapps/docs/` for a complete example using all extensions.

## Browser Support

Same as core Domma:

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+

## Notes

- Extensions modify the editor toolbar dynamically
- All Domma icons are used (requires icon system)
- Extensions work with both `mode: 'rich'` and `mode: 'markdown'`
- Tooltips require `Domma.elements.tooltip()` to be available
