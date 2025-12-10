# CLAUDE.md - Developer Tools Showcase

This file provides guidance for working with Domma's developer tools (Theme Roller, Page Roller, Editor).

These tools are part of the `domma-tools.min.js` bundle and require the core framework.

## Editor (Content Editor Tool)

**Editor** is a universal content editor with three modes (text, rich, code) and features like autosave, undo/redo,
model integration, and localStorage persistence.

### Basic Usage

```javascript
const editor = Domma.elements.editor('#editor', {
    mode: 'rich',               // 'text', 'rich', or 'code'
    placeholder: 'Start writing...',
    autosave: true,
    storage: 'my-document',
    onChange: (content) => console.log('Content changed', content),
    onSave: (content) => console.log('Saved', content)
});
```

### Editor Modes

- **Text Mode**: Enhanced textarea with character/word count
- **Rich Mode**: WYSIWYG editor with formatting toolbar
- **Code Mode**: Syntax highlighting, line numbers, tab indentation

### API Methods

```javascript
editor.getValue();              // Get editor content
editor.setValue(content);       // Set editor content
editor.getText();               // Get plain text (no HTML)
editor.clear();                 // Clear content
editor.undo();                  // Undo last change
editor.redo();                  // Redo last undone change
editor.save();                  // Manual save to localStorage
editor.setMode('rich');         // Switch mode
editor.focus();                 // Focus editor
editor.destroy();               // Remove editor, unbind events
```

### Model Integration

```javascript
const docModel = M.create({
    content: {type: 'string', default: ''}
});

const editor = Domma.elements.editor('#editor', {
    mode: 'rich',
    model: docModel,
    modelKey: 'content'
});

// Model changes update editor, editor changes update model
docModel.set('content', '<p>Hello World</p>');
```

## Page Roller (Page Builder Tool)

**Page Roller** is a visual page builder with drag-and-drop sections, Divi-style row/column system, and HTML export.

### Basic Usage

```javascript
const pageRoller = Domma.elements.pageRoller('#container', {
    onChange: (data) => console.log('Page changed', data),
    onSave: ({name, data}) => console.log('Page saved', name)
});
```

### Section Types (16 total)

**Layout:** Navbar, Hero, Card Grid, Content, Form, Footer, Row Layout

**Interactive:** Carousel, Accordion, Tabs, Modal, Toast, Breadcrumbs, Button Group, Tag Cloud, Dropdown

### Row/Column System

22+ layout presets including:

- Single column
- Equal 2/3/4/5/6 columns
- Thirds, quarters, fifths, sixths
- Asymmetric layouts (1/3 + 2/3, 1/4 + 3/4, etc.)
- Nested rows (max 3 levels)

### API Methods

```javascript
// Section management
pageRoller.addSection(type);
pageRoller.removeSection(index);
pageRoller.moveSection(fromIndex, toIndex);
pageRoller.getSections();

// Template management
pageRoller.saveTemplate(name);
pageRoller.loadTemplate(name);
pageRoller.newTemplate();

// Theme
pageRoller.setTheme(theme, variant);
pageRoller.setGridEnabled(enabled);

// Export
const html = pageRoller.exportHTML({
    minify: false,
    includeComments: true,
    standalone: true
});
pageRoller.copyToClipboard();
pageRoller.openPreviewWindow();
pageRoller.getPageConfig();
```

### Layout Presets

```javascript
const LAYOUT_PRESETS = {
    'single': [1.0],
    'equal-2': [0.5, 0.5],
    'third-twothirds': [0.333, 0.667],
    'equal-3': [0.333, 0.333, 0.333],
    'quarter-half-quarter': [0.25, 0.5, 0.25],
    'equal-4': [0.25, 0.25, 0.25, 0.25],
    'sidebar-main': [0.3, 0.7],
    // ... and 15 more
};
```

## Theme Roller (Theme Customization Tool)

**Theme Roller** allows visual theme customization with real-time preview and CSS export.

### Basic Usage

```javascript
const themeRoller = Domma.elements.themeRoller('#container', {
    onChange: (theme) => console.log('Theme changed', theme),
    onExport: (css) => console.log('CSS exported', css)
});
```

### Features

- Real-time colour customization
- Typography controls
- Spacing configuration
- Border radius settings
- Light/dark theme variants
- CSS variable export
- Theme preset library

## Showcase Example Template

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Developer Tools - Domma Showcase</title>
    <link rel="stylesheet" href="../../../dist/domma-theme.css">
</head>
<body>
    <div class="container">
        <h1>Developer Tools Showcase</h1>

        <div class="demo-section">
            <h2>Editor</h2>
            <div id="editor"></div>
        </div>

        <div class="demo-section">
            <h2>Page Roller</h2>
            <div id="page-roller"></div>
        </div>
    </div>

    <script src="../../../dist/domma.min.js"></script>
    <script src="../../../dist/domma-tools.min.js"></script>
    <script>
        // Initialize Editor
        const editor = Domma.elements.editor('#editor', {
            mode: 'rich',
            placeholder: 'Start writing...',
            minHeight: 300
        });

        // Initialize Page Roller
        const pageRoller = Domma.elements.pageRoller('#page-roller', {
            onChange: (data) => {
                console.log('Page updated:', data);
            }
        });
    </script>
</body>
</html>
```

## Common Patterns

### Blog Post Editor

```javascript
const postModel = M.create({
    title: {type: M.types.string, default: ''},
    content: {type: M.types.string, default: ''},
    publishedAt: {type: M.types.date}
}, {}, {persist: 'blog-post-draft'});

const editor = Domma.elements.editor('#post-editor', {
    mode: 'rich',
    model: postModel,
    modelKey: 'content',
    autosave: true,
    autosaveInterval: 5000,
    placeholder: 'Write your post...'
});

M.bind(postModel, 'title', '#post-title', {twoWay: true});

$('#publish-btn').on('click', async () => {
    const post = postModel.toJSON();
    await Domma.http.post('/api/posts', post);
    postModel.clearStorage();
});
```

### Landing Page Builder

```javascript
const pageRoller = Domma.elements.pageRoller('#builder', {
    onChange: (data) => {
        // Auto-save page configuration
        S.set('page-draft', data);
    },
    onSave: async ({name, data}) => {
        // Save to server
        await Domma.http.post('/api/pages', {name, data});
    }
});

// Restore draft
const draft = S.get('page-draft');
if (draft) {
    pageRoller.loadTemplate(draft);
}

// Export final HTML
$('#export-btn').on('click', () => {
    const html = pageRoller.exportHTML({
        minify: true,
        standalone: true
    });

    // Download file
    const blob = new Blob([html], {type: 'text/html'});
    const url = URL.createObjectURL(blob);
    const a = $('<a>')
        .attr('href', url)
        .attr('download', 'page.html')[0];
    a.click();
});
```

### Custom Theme Builder

```javascript
const themeRoller = Domma.elements.themeRoller('#theme-builder', {
    onChange: (theme) => {
        // Apply theme in real-time
        applyTheme(theme);
    },
    onExport: (css) => {
        // Save custom theme
        S.set('custom-theme', css);

        // Or download
        downloadCSS(css, 'custom-theme.css');
    }
});

function applyTheme(theme) {
    Object.keys(theme.colors).forEach(key => {
        document.documentElement.style.setProperty(
            `--color-${key}`,
            theme.colors[key]
        );
    });
}

function downloadCSS(css, filename) {
    const blob = new Blob([css], {type: 'text/css'});
    const url = URL.createObjectURL(blob);
    const a = $('<a>')
        .attr('href', url)
        .attr('download', filename)[0];
    a.click();
}
```

## Related Documentation

- [Showcase Meta Guide](../CLAUDE.md)
- [Core Modules](../../../src/CLAUDE.md)
- [API Reference](../../../docs/API.md)
- [Editor Documentation](../../../CLAUDE.md#editor-developer-tool) (main file)
- [Page Roller Documentation](../../../CLAUDE.md#quick-roller-developer-tool) (main file)

## Development Notes

- Tools bundle (`domma-tools.min.js`) is required
- Core framework (`domma.min.js`) must be loaded first
- Tools attach to `Domma.elements` automatically
- Each tool can work standalone or integrated with other modules
- All tools support theme switching (light/dark)
