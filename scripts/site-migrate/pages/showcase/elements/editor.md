---
title: Editor
description: "Flexible, mode-switchable editor supporting plain text, rich text (WYSIWYG), and code editing"
layout: with-sidebar
status: published
sortOrder: 50
---

[hero title="Editor" tagline="Flexible, mode-switchable editor supporting plain text, rich text (WYSIWYG), and code editing" align="center"][/hero]

## Overview

The Universal Editor is a flexible, mode-switchable editing component that adapts to your needs. Use it as a plain text editor, rich text (WYSIWYG) editor, or code editor - all from one component with seamless mode switching, Model integration, autosave, and localStorage persistence.

### Three Modes, One Component

- **Text Mode** - Enhanced textarea with auto-resize, character/word count
- **Rich Mode** - WYSIWYG editor with toolbar, formatting, images, code blocks, embeds
- **Code Mode** - Syntax highlighting, line numbers, tab indentation

### Key Features

- **Model Integration** - Two-way reactive data binding
- **Autosave** - Automatic saving with configurable intervals
- **localStorage** - Persistent storage with automatic save/load
- **Image Paste** - Paste images directly from clipboard (base64 or upload)
- **Code Blocks** - Syntax-highlighted code blocks in rich mode
- **Embeds** - YouTube, Twitter, CodePen auto-embedding
- **Undo/Redo** - Built-in history management
- **Customizable Toolbar** - Configure which buttons appear

### Basic Usage

```
// Text mode
Domma.elements.editor('#editor', {
    mode: 'text',
    characterCount: true,
    autosave: true,
    storage: 'my-notes'
});

// Rich text mode
Domma.elements.editor('#editor', {
    mode: 'rich',
    toolbar: [['bold', 'italic'], ['link', 'image']],
    imagePaste: true,
    autosave: true
});

// Code mode
Domma.elements.editor('#editor', {
    mode: 'code',
    language: 'javascript',
    lineNumbers: true,
    model: codeModel,
    modelKey: 'sourceCode'
});
```

## Getting Started

Add a content editor to your page in three simple steps

### Step 1: Add Container Element

Create a container div for the editor:

```
<div id="my-editor"></div>
```

### Step 2: Include Domma and Tools Bundle

Add Domma CSS/JS and the tools bundle (includes editor):

```
<!-- CSS -->
<link rel="stylesheet" href="dist/domma.css">
<link rel="stylesheet" href="dist/elements.css">
<link rel="stylesheet" href="dist/domma-tools.css">

<!-- JavaScript -->
<script src="dist/domma.min.js"></script>
<script src="dist/domma-tools.min.js"></script>
```

### Step 3: Initialize the Editor

Call `Domma.elements.editor()` to create the editor:

```
// Simple text editor
Domma.elements.editor('#my-editor', {
    mode: 'text',           // 'text', 'rich', or 'code'
    placeholder: 'Start typing...',
    autosave: true,         // Auto-save as you type
    storage: 'my-content'   // localStorage key
});

// Or rich text (WYSIWYG) editor
Domma.elements.editor('#my-editor', {
    mode: 'rich',
    toolbar: [
        ['bold', 'italic', 'underline'],
        ['link', 'image'],
        ['heading', 'quote']
    ]
});
```

> **Note:** The editor auto-generates the complete UI (no HTML required). It supports three modes: text (textarea), rich (WYSIWYG), and code (syntax highlighting). The editor requires the `domma-tools.min.js` bundle which includes the editor component.

## Text Mode

Enhanced textarea with auto-resize, character counting, and autosave.

[showcase-demo id="showcase/elements/editor/text-mode" title="Text Mode" /]

```
Domma.elements.editor('#editor', {
    mode: 'text',
    placeholder: 'Start typing...',
    characterCount: true,
    wordCount: true,
    autosave: true,
    autosaveInterval: 3000,
    storage: 'text-draft',
    onChange: (content) => console.log('Content changed')
});
```

## Rich Text Mode (WYSIWYG)

Full-featured WYSIWYG editor with formatting toolbar, images, links, code blocks, and embeds. Try pasting an image from your clipboard!

[showcase-demo id="showcase/elements/editor/rich-text-mode-wysiwyg" title="Rich Text Mode (WYSIWYG)" /]

```
Domma.elements.editor('#editor', {
    mode: 'rich',
    placeholder: 'Start writing...',
    toolbar: [
        ['bold', 'italic', 'underline', 'strikethrough'],
        ['h1', 'h2', 'h3'],
        ['ul', 'ol', 'blockquote'],
        ['link', 'image', 'code'],
        ['codeblock', 'embed'],
        ['undo', 'redo', 'clear']
    ],
    imagePaste: true,
    imageMode: 'base64',  // or provide custom imageUpload function
    autosave: true,
    storage: 'rich-draft'
});
```

## Code Mode

Code editor with line numbers, tab indentation, and syntax highlighting markers.

[showcase-demo id="showcase/elements/editor/code-mode" title="Code Mode" /]

```
Domma.elements.editor('#editor', {
    mode: 'code',
    language: 'javascript',
    lineNumbers: true,
    theme: 'light',
    autosave: true,
    storage: 'code-draft'
});
```

## Dynamic Mode Switching

Switch between modes dynamically while preserving content:

[showcase-demo id="showcase/elements/editor/dynamic-mode-switching" title="Dynamic Mode Switching" /]

```
const editor = Domma.elements.editor('#editor', {
    mode: 'text'
});

// Switch modes dynamically
editor.setMode('rich');  // Switch to rich text
editor.setMode('code');  // Switch to code
editor.setMode('text');  // Back to text

// Get current mode
console.log(editor.getMode());  // 'text', 'rich', or 'code'
```

## Model Integration

Two-way reactive binding with Domma's Model system:

[showcase-demo id="showcase/elements/editor/model-integration" title="Model Integration" /]

```
const contentModel = M.create({
    text: { type: 'string', default: '' }
});

Domma.elements.editor('#editor', {
    mode: 'text',
    model: contentModel,
    modelKey: 'text'
});

// Model changes update editor
contentModel.set('text', 'New content');

// Editor changes update model
// (happens automatically on input)
```

## Autosave & localStorage

Automatic saving to localStorage with configurable intervals:

[showcase-demo id="showcase/elements/editor/autosave-and-localstorage" title="Autosave & localStorage" /]

```
const editor = Domma.elements.editor('#editor', {
    mode: 'text',
    autosave: true,
    autosaveInterval: 2000,  // 2 seconds
    storage: 'my-document',
    onSave: (content) => {
        console.log('Saved!', content.length, 'characters');
    }
});

// Manual save
editor.save();

// Content auto-loads from storage on init
// if storage key exists
```

## API Reference

### Options

[table striped="true"]
| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `mode` | String | `'text'` | Editor mode: 'text', 'rich', or 'code' |
| `model` | Object | `null` | Domma Model instance for binding |
| `modelKey` | String | `null` | Model field to bind to |
| `autosave` | Boolean | `false` | Enable automatic saving |
| `autosaveInterval` | Number | `3000` | Autosave delay in milliseconds |
| `storage` | String | `null` | localStorage key for persistence |
| `toolbar` | Array | Default | Toolbar button groups (rich/code mode) |
| `showToolbar` | Boolean | `true` | Show/hide toolbar |
| `imagePaste` | Boolean | `true` | Enable image pasting (rich mode) |
| `imageMode` | String | `'base64'` | 'base64' or 'upload' |
| `imageUpload` | Function | `null` | Custom upload handler (file) => url |
| `language` | String | `'javascript'` | Code language (code mode) |
| `lineNumbers` | Boolean | `true` | Show line numbers (code mode) |
| `theme` | String | `'light'` | Editor theme |
| `placeholder` | String | `''` | Placeholder text |
| `minHeight` | Number | `200` | Minimum height in pixels |
| `maxHeight` | Number | `null` | Maximum height in pixels |
| `characterCount` | Boolean | `false` | Show character count |
| `wordCount` | Boolean | `false` | Show word count |
| `onChange` | Function | `null` | Callback on content change |
| `onSave` | Function | `null` | Callback on save |
| `onImagePaste` | Function | `null` | Callback on image paste |
[/table]

### Methods

[table striped="true"]
| Method | Returns | Description |
| --- | --- | --- |
| `getValue()` | String | Get editor content (HTML for rich mode) |
| `setValue(content)` | this | Set editor content |
| `getText()` | String | Get plain text (strips HTML in rich mode) |
| `clear()` | this | Clear all content |
| `focus()` | this | Focus the editor |
| `blur()` | this | Blur the editor |
| `undo()` | this | Undo last change |
| `redo()` | this | Redo last undo |
| `save()` | this | Manually save to storage |
| `setMode(mode)` | this | Switch editor mode |
| `getMode()` | String | Get current mode |
| `destroy()` | void | Remove editor and cleanup |
[/table]

## CSS Customisation

Override these CSS variables to customise Editor appearance and match your design system.

[table striped="true"]
| Variable | Default | Controls |
| --- | --- | --- |
| `--dm-surface` | `var(--dm-white)` | Editor background |
| `--dm-border` | `var(--dm-slate-300)` | Editor border |
| `--dm-radius-md` | `0.375rem` | Editor corner radius |
| `--dm-primary` | `var(--dm-blue-600)` | Toolbar button active colour |
[/table]

### Example Override

```css
:root {
    /* Dark editor theme */
    --dm-surface: #1e293b;
    --dm-text: #f1f5f9;
}
```

[Full CSS Customisation Cheat-Sheet →](/showcase/elements/css-customisation)
