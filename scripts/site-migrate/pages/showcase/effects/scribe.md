---
title: Scribe Effect
description: "Text rendering with configurable granularity (characters, words, or sentences) text animation with action queues and entrance effects."
layout: with-sidebar
status: published
sortOrder: 50
---

[hero title="Scribe Effect" tagline="Text rendering with configurable granularity (characters, words, or sentences) text animation with action queues and entrance effects." align="center"][/hero]

## Domma.effects.scribe()

Creates a character-by-character typing effect with support for action queues, character entrance effects, and text deletion. Perfect for hero sections, terminal interfaces, and storytelling.

```javascript
// Basic usage
Domma.effects.scribe('.hero-title', {
  actions: [
    { render: 'Hello, World!' }
  ]
});

// Complex sequence with effects
const tw = Domma.effects.scribe('.element', {
  speed: 50,              // ms per character (typing)
  deleteSpeed: 30,        // ms per character (deletion)
  cursor: true,           // show blinking cursor
  cursorChar: '|',        // cursor character
  loop: true,             // loop infinitely
  actions: [
    { render: 'Hello', effect: 'bounce' },
    { wait: '2s' },
    { undoRender: true },  // delete all from last render
    { render: 'Welcome to Domma', effect: 'fade' },
    { wait: '3s' },
    { undoRender: 5 },     // delete last 5 characters
    { render: 'ma!', effect: 'glow' }
  ]
});

// Control methods
tw.pause();
tw.resume();
tw.stop();
tw.restart();
tw.destroy();
```

### Action Types

- `{ render: 'text', effect: 'none|fade|bounce|glow' }` - Type text with optional entrance effect
- `{ wait: '2s' }` - Pause for duration (supports '2s', '500ms', or number)
- `{ undoRender: true }` - Delete all characters from last render
- `{ undoRender: N }` - Delete last N characters
- `{ undoRender: 'all' }` - Delete all characters

## Demo: Basic Scribe

Simple typing animation with control methods.

[showcase-demo id="showcase/effects/scribe/demo-basic-scribe" title="Demo: Basic Scribe" /]

```javascript
Domma.effects.scribe('#scribe-demo-1', {
  speed: 50,
  deleteSpeed: 30,
  actions: [
    { render: 'Hello, World!' },
    { wait: '2s' },
    { undoRender: 'all' },
    { wait: '500ms' },
    { render: 'Welcome to DommaJS', effect: 'fade' }
  ]
});
```

## Demo: Character Effects

Compare different character entrance effects.

[showcase-demo id="showcase/effects/scribe/demo-character-effects" title="Demo: Character Effects" /]

```javascript
// Demonstrate each effect type
Domma.effects.scribe('#demo', {
  speed: 40,
  actions: [
    { render: `Effect: ${effect}`, effect: effect }
  ]
});
```

## Demo: Action Sequence

Complex sequence with render, wait, and undo actions.

[showcase-demo id="showcase/effects/scribe/demo-action-sequence" title="Demo: Action Sequence" /]

```javascript
Domma.effects.scribe('#scribe-demo-3', {
  speed: 50,
  deleteSpeed: 30,
  actions: [
    { render: 'Hello', effect: 'bounce' },
    { wait: '1.5s' },
    { undoRender: true },
    { render: 'Welcome to Domma', effect: 'fade' },
    { wait: '2s' }
  ]
});
```

## Demo: Rendering Modes

Control rendering granularity with `mode`: character-by-character, word-by-word, or sentence-by-sentence.

### Character Mode (default)

[showcase-demo id="showcase/effects/scribe/character-mode-default" title="Character Mode (default)" /]

```javascript
Domma.effects.scribe('#demo', {
  mode: 'typewriter',  // Character-by-character
  actions: [{ render: 'Hello World!' }]
});
```

### Word Mode

[showcase-demo id="showcase/effects/scribe/word-mode" title="Word Mode" /]

```javascript
Domma.effects.scribe('#demo', {
  mode: 'word',  // Word-by-word
  speed: 100,    // Per word, not per character
  actions: [{ render: 'Welcome to the Domma framework!', effect: 'bounce' }]
});
```

### Sentence Mode

[showcase-demo id="showcase/effects/scribe/sentence-mode" title="Sentence Mode" /]

```javascript
Domma.effects.scribe('#demo', {
  mode: 'sentence',  // Sentence-by-sentence
  speed: 200,        // Per sentence
  actions: [{ render: 'First sentence. Second sentence! Third sentence?', effect: 'fade' }]
});
```

## Demo: Partial Undo

Demonstrate selective unit deletion. In word mode, `undoRender` deletes words. In sentence mode, it deletes sentences.

[showcase-demo id="showcase/effects/scribe/demo-partial-undo" title="Demo: Partial Undo" /]

```javascript
Domma.effects.scribe('#scribe-demo-4', {
  speed: 50,
  deleteSpeed: 30,
  actions: [
    { render: 'Domma Framework', effect: 'fade' },
    { wait: '1s' },
    { undoRender: 9 },  // Delete "Framework"
    { wait: '500ms' },
    { render: 'Effects!', effect: 'glow' },
    { wait: '2s' }
  ]
});
```

## Demo: Hero Banner Loop

Infinite looping scribe for hero sections.

[showcase-demo id="showcase/effects/scribe/demo-hero-banner-loop" title="Demo: Hero Banner Loop" /]

```javascript
Domma.effects.scribe('#scribe-demo-5', {
  speed: 60,
  deleteSpeed: 40,
  loop: true,
  loopDelay: 2000,
  actions: [
    { render: 'Build Faster', effect: 'bounce' },
    { wait: '2s' },
    { undoRender: 'all' },
    { wait: '500ms' },
    { render: 'Code Smarter', effect: 'fade' },
    { wait: '2s' },
    { undoRender: 'all' },
    { wait: '500ms' }
  ]
});
```

## Demo: Cursor Types

Different cursor styles with smooth fade animation.

[showcase-demo id="showcase/effects/scribe/demo-cursor-types" title="Demo: Cursor Types" /]

```javascript
// Different cursor styles
Domma.effects.scribe('#demo', {
  speed: 50,
  cursorType: 'caret',  // or 'block', 'underline'
  cursorChar: '|',       // or '█', '_'
  cursorBlink: true,     // or false
  actions: [
    { render: 'Cursor type: caret' }
  ]
});
```
