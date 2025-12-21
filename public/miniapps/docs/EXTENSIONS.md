# Domma Docs - Editor Extensions Guide

This guide explains the rich text editor extensions system used in Domma Docs and how to customize or extend it.

## Table of Contents

1. [Overview](#overview)
2. [Available Extensions](#available-extensions)
3. [Using Extensions](#using-extensions)
4. [Customizing Extensions](#customizing-extensions)
5. [Creating Custom Extensions](#creating-custom-extensions)
6. [Extension API Reference](#extension-api-reference)
7. [Troubleshooting](#troubleshooting)

---

## Overview

Domma Docs uses a modular extension system built on top of a rich text editor core. Each extension adds specific
functionality like text formatting, lists, tables, or images.

The extension system allows you to:

- Enable/disable specific features
- Customize toolbar buttons and menus
- Add custom formatting options
- Extend with your own functionality

---

## Available Extensions

Domma Docs includes 8 core extensions:

### 1. **Document Extension**

Base document structure and paragraph handling.

**Features:**

- Paragraph blocks
- Line breaks
- Text flow

**Usage:**
Automatically enabled - provides the foundation for all content.

### 2. **Text Formatting Extension**

Basic text styling options.

**Features:**

- Bold (`Ctrl+B`)
- Italic (`Ctrl+I`)
- Underline (`Ctrl+U`)
- Strike-through
- Code inline
- Subscript/Superscript

**Toolbar Buttons:**

- Bold, Italic, Underline buttons
- Strike, Code buttons in dropdown

### 3. **Heading Extension**

Structured headings for document hierarchy.

**Features:**

- Heading 1-6 levels
- Automatic TOC compatibility
- Semantic HTML output

**Usage:**

```javascript
// Programmatic usage
editor.chain().focus().setHeading({ level: 1 }).run();
```

### 4. **List Extension**

Ordered and unordered lists with nesting.

**Features:**

- Bullet lists
- Numbered lists
- Nested lists (up to 10 levels)
- Auto-indent on Tab

**Keyboard Shortcuts:**

- `Ctrl+Shift+8` - Bullet list
- `Ctrl+Shift+9` - Numbered list
- `Tab` - Increase indent
- `Shift+Tab` - Decrease indent

### 5. **Link Extension**

Hyperlink insertion and editing.

**Features:**

- Insert links with custom text
- Edit existing links
- Remove links
- Open links (Ctrl+Click)

**Usage:**

```javascript
editor.chain().focus().setLink({ href: 'https://example.com' }).run();
```

**Context Menu:**
Right-click on text → Insert Link

### 6. **Image Extension**

Image insertion with resize capability.

**Features:**

- Insert images via URL
- Upload local images (base64)
- Resize with drag handles
- Alt text support
- Alignment options

**Usage:**
Insert via toolbar or context menu → "Insert Image"

**Supported Formats:**

- PNG, JPG, GIF, WebP, SVG

### 7. **Table Extension**

Structured tables with cell manipulation.

**Features:**

- Create tables (rows × columns)
- Add/delete rows and columns
- Merge/split cells
- Header rows
- Cell alignment

**Usage:**
Toolbar → Table button → Select dimensions

**Cell Operations:**
Right-click inside table cell for options:

- Add row before/after
- Add column before/after
- Delete row/column
- Merge cells
- Split cell

### 8. **Horizontal Rule Extension**

Visual section dividers.

**Features:**

- Insert horizontal lines
- Keyboard shortcut: `---` + Enter

**Usage:**
Toolbar → Divider button or type `---` and press Enter

---

## Using Extensions

### Basic Usage

All extensions are enabled by default in Domma Docs. Access them through:

1. **Toolbar** - Click buttons for common actions
2. **Keyboard Shortcuts** - Use shortcuts listed above
3. **Context Menu** - Right-click for contextual options
4. **Dropdowns** - Click dropdown arrows for more options

### Toolbar Layout

```
[Bold] [Italic] [Underline] | [Headings ▼] [Lists ▼] [Align ▼] | [Color] [Highlight] | [Link] [Image] [Table] [Divider]
```

### Keyboard Shortcuts Reference

| Action        | Shortcut       |
|---------------|----------------|
| Bold          | `Ctrl+B`       |
| Italic        | `Ctrl+I`       |
| Underline     | `Ctrl+U`       |
| Link          | `Ctrl+K`       |
| Save          | `Ctrl+S`       |
| Undo          | `Ctrl+Z`       |
| Redo          | `Ctrl+Y`       |
| Find          | `Ctrl+F`       |
| Replace       | `Ctrl+H`       |
| Help          | `Ctrl+/`       |
| Bullet List   | `Ctrl+Shift+8` |
| Numbered List | `Ctrl+Shift+9` |

---

## Customizing Extensions

### Disabling Extensions

To disable specific extensions, modify the editor initialization in `app.js`:

```javascript
// Find the editor initialization
this.editor = new Editor({
    extensions: [
        Document,
        Paragraph,
        Text,
        Bold,
        Italic,
        // Comment out unwanted extensions
        // Underline,
        Heading,
        BulletList,
        OrderedList,
        ListItem,
        Link,
        Image.configure({
            inline: true,
            allowBase64: true,
        }),
        // Table, // Disable tables
        HorizontalRule,
    ],
    // ...
});
```

### Configuring Extensions

Many extensions accept configuration options:

#### Image Configuration

```javascript
Image.configure({
    inline: true,           // Allow inline images
    allowBase64: true,      // Support base64 encoding
    HTMLAttributes: {
        class: 'custom-image',
    },
})
```

#### Link Configuration

```javascript
Link.configure({
    openOnClick: false,     // Disable click-to-open
    HTMLAttributes: {
        target: '_blank',   // Open in new tab
        rel: 'noopener',
    },
})
```

#### Table Configuration

```javascript
Table.configure({
    resizable: true,        // Allow column resizing
    handleWidth: 5,         // Resize handle width
    cellMinWidth: 25,       // Minimum cell width
})
```

---

## Creating Custom Extensions

### Simple Extension Example

Create a custom "Highlight" extension:

```javascript
import { Mark } from '@tiptap/core';

const Highlight = Mark.create({
    name: 'highlight',

    // Define HTML output
    parseHTML() {
        return [
            {
                tag: 'mark',
                attrs: { class: 'highlight' },
            },
        ];
    },

    renderHTML({ HTMLAttributes }) {
        return ['mark', { class: 'highlight' }, 0];
    },

    // Add commands
    addCommands() {
        return {
            toggleHighlight: () => ({ commands }) => {
                return commands.toggleMark(this.name);
            },
        };
    },

    // Add keyboard shortcut
    addKeyboardShortcuts() {
        return {
            'Mod-Shift-h': () => this.editor.commands.toggleHighlight(),
        };
    },
});

// Use in editor
editor.chain().focus().toggleHighlight().run();
```

### Extension File Structure

```javascript
// src/extensions/my-extension.js

import { Extension } from '@tiptap/core';

export const MyExtension = Extension.create({
    name: 'myExtension',

    // Extension options
    addOptions() {
        return {
            myOption: true,
        };
    },

    // Add commands (actions)
    addCommands() {
        return {
            myCommand: () => ({ commands }) => {
                // Command logic
                return true;
            },
        };
    },

    // Add keyboard shortcuts
    addKeyboardShortcuts() {
        return {
            'Mod-Shift-x': () => this.editor.commands.myCommand(),
        };
    },

    // Add custom attributes
    addAttributes() {
        return {
            customAttr: {
                default: null,
            },
        };
    },
});
```

### Registering Custom Extensions

Add your extension to the editor initialization:

```javascript
import { MyExtension } from './extensions/my-extension.js';

this.editor = new Editor({
    extensions: [
        // ... existing extensions
        MyExtension.configure({
            myOption: true,
        }),
    ],
});
```

---

## Extension API Reference

### Core Extension Methods

#### `addOptions()`

Define configurable options for your extension.

```javascript
addOptions() {
    return {
        optionName: defaultValue,
    };
}
```

#### `addCommands()`

Add executable commands to the editor.

```javascript
addCommands() {
    return {
        commandName: (args) => ({ commands, state, chain }) => {
            // Return true if successful
            return true;
        },
    };
}
```

#### `addKeyboardShortcuts()`

Register keyboard shortcuts.

```javascript
addKeyboardShortcuts() {
    return {
        'Mod-Shift-x': () => this.editor.commands.myCommand(),
    };
}
```

Modifiers:

- `Mod` - Cmd on Mac, Ctrl on Windows/Linux
- `Shift`
- `Alt`
- `Ctrl`

#### `addAttributes()`

Define custom HTML attributes.

```javascript
addAttributes() {
    return {
        attributeName: {
            default: null,
            parseHTML: element => element.getAttribute('attr'),
            renderHTML: attributes => {
                return { attr: attributes.attributeName };
            },
        },
    };
}
```

### Node vs Mark vs Extension

**Node** - Block-level content (paragraphs, headings, tables)

```javascript
import { Node } from '@tiptap/core';
const MyNode = Node.create({ /* ... */ });
```

**Mark** - Inline formatting (bold, italic, links)

```javascript
import { Mark } from '@tiptap/core';
const MyMark = Mark.create({ /* ... */ });
```

**Extension** - Functionality without content (history, placeholder)

```javascript
import { Extension } from '@tiptap/core';
const MyExtension = Extension.create({ /* ... */ });
```

---

## Troubleshooting

### Extension Not Working

1. **Check Registration**
    - Ensure extension is added to `extensions` array
    - Verify import path is correct

2. **Check Console**
    - Open browser DevTools (F12)
    - Look for errors in Console tab

3. **Verify Dependencies**
    - Ensure all required extensions are loaded
    - Example: Lists require ListItem extension

### Commands Not Executing

```javascript
// Check if command is available
console.log(editor.can().myCommand());

// Check editor state
console.log(editor.state);

// Test command execution
const success = editor.commands.myCommand();
console.log('Command success:', success);
```

### Keyboard Shortcuts Conflicting

Shortcuts are checked in order. Later extensions override earlier ones.

```javascript
// To prevent conflicts, check before executing
addKeyboardShortcuts() {
    return {
        'Mod-b': ({ editor }) => {
            if (customCondition) {
                return editor.commands.myCommand();
            }
            return false; // Let next handler try
        },
    };
}
```

### Content Not Rendering

1. **Check parseHTML**
    - Ensure parseHTML matches your HTML structure
    - Test with simple HTML first

2. **Check renderHTML**
    - Verify output structure matches expected HTML
    - Check for proper nesting

3. **Inspect Output**

```javascript
console.log(editor.getHTML());
console.log(editor.getJSON());
```

### Performance Issues

1. **Lazy Load Extensions**
    - Load heavy extensions only when needed

2. **Optimize Event Handlers**
    - Debounce frequent updates
    - Use `onUpdate` carefully

3. **Limit Extension Features**
    - Disable unused functionality
    - Configure maximum limits (table size, image size)

---

## Additional Resources

- **Editor Documentation**: See internal editor docs for advanced features
- **Community Extensions**: Check the community for pre-built extensions
- **Examples**: Review `app.js` for real-world extension usage

---

## Support

For questions or issues with extensions:

1. Check this guide first
2. Review the console for errors
3. Test with a minimal extension setup
4. Contact support with error logs and reproduction steps

---

**Last Updated**: December 2025
**Version**: 1.0.0
