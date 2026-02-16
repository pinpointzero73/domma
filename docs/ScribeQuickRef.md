# Scribe Effect - Quick Reference

## Overview

The scribe effect creates text animations with configurable granularity (characters, words, or sentences) with support for action queues, entrance effects, and deletion.

**Location:** `Domma.effects.scribe()`

## Basic Usage

```javascript
// Simplest form
Domma.effects.scribe('.element', {
  actions: [
    { render: 'Hello, World!' }
  ]
});
```

## Full API

```javascript
const scribe = Domma.effects.scribe(selector, {
  // Rendering Mode
  mode: 'typewriter',     // 'typewriter' (char), 'word', 'sentence' - default: 'typewriter'

  // Timing
  speed: 50,              // ms per unit (typing) - default: 50
  deleteSpeed: 30,        // ms per unit (deletion) - default: 30

  // Cursor
  cursor: true,           // show cursor - default: true
  cursorChar: '|',        // cursor character - default: '|'
  cursorBlink: true,      // smooth fade in/out - default: true
  cursorType: 'caret',    // 'caret', 'block', 'underline' - default: 'caret'

  // Looping
  loop: false,            // false, true (infinite), or number - default: false
  loopDelay: 1000,        // ms between loops - default: 1000

  // Behavior
  pauseOnHover: false,           // pause when hovering - default: false
  autoStart: true,               // start immediately - default: true
  respectMotionPreference: true, // honor prefers-reduced-motion - default: true

  // Actions (see below)
  actions: [],

  // Callbacks
  onStart: () => {},
  onComplete: () => {},
  onCharacter: (unit, index) => {},
  onRender: (text) => {},
  onUndoRender: (deletedText) => {},
  onLoop: (loopCount) => {}
});
```

## Rendering Modes

The `mode` option controls rendering granularity:

### Character Mode (default)
```javascript
Domma.effects.scribe('.element', {
  mode: 'typewriter',  // Character-by-character
  actions: [{ render: 'Hello World!' }]
});
```
- Renders text one character at a time
- `undoRender: 5` deletes 5 characters
- Best for traditional typewriter effects

### Word Mode
```javascript
Domma.effects.scribe('.element', {
  mode: 'word',  // Word-by-word
  speed: 100,    // 100ms per word
  actions: [{ render: 'Welcome to Domma framework', effect: 'bounce' }]
});
```
- Renders text one word at a time
- `undoRender: 2` deletes 2 words
- Faster pacing for longer text

### Sentence Mode
```javascript
Domma.effects.scribe('.element', {
  mode: 'sentence',  // Sentence-by-sentence
  speed: 200,        // 200ms per sentence
  actions: [{ render: 'First. Second! Third?', effect: 'fade' }]
});
```
- Renders text one sentence at a time
- Splits on `.`, `!`, `?` punctuation
- `undoRender: 1` deletes 1 sentence
- Ideal for storytelling and narratives

## Action Types

### 1. Render (Type Text)

```javascript
{ render: 'Hello, World!' }                    // No effect (instant)
{ render: 'Hello, World!', effect: 'fade' }    // Fade in each unit
{ render: 'Hello, World!', effect: 'bounce' }  // Bounce in each unit
{ render: 'Hello, World!', effect: 'glow' }    // Glow effect per unit
```

**Available Effects:**
- `'none'` - Instant appearance (default)
- `'fade'` - Smooth fade-in
- `'bounce'` - Drop-in with bounce
- `'glow'` - Glow pulse on appearance

### 2. Wait (Pause)

```javascript
{ wait: '2s' }      // Wait 2 seconds
{ wait: '500ms' }   // Wait 500 milliseconds
{ wait: 1000 }      // Wait 1000ms (raw number)
```

### 3. UndoRender (Delete Text)

```javascript
{ undoRender: true }    // Delete all from last render action
{ undoRender: 5 }       // Delete last 5 units (chars/words/sentences based on mode)
{ undoRender: 'all' }   // Delete everything
```

**Note:** In `word` mode, `undoRender: 3` deletes 3 words. In `sentence` mode, it deletes 3 sentences.

## Control Methods

```javascript
const scribe = Domma.effects.scribe('.element', options);

tw.pause();      // Pause animation
tw.resume();     // Resume animation
tw.stop();       // Stop animation (marks as complete)
tw.restart();    // Restart from beginning
tw.destroy();    // Clean up and remove effect
tw.isRunning();  // Check if running (boolean)
tw.isPaused();   // Check if paused (boolean)
```

## Real-World Examples

### Hero Banner with Looping Messages

```javascript
Domma.effects.scribe('.hero-headline', {
  speed: 60,
  loop: true,
  loopDelay: 2000,
  actions: [
    { render: 'Build Faster', effect: 'bounce' },
    { wait: '2.5s' },
    { undoRender: 'all' },
    { wait: '300ms' },
    { render: 'Code Smarter', effect: 'fade' },
    { wait: '2.5s' },
    { undoRender: 'all' },
    { wait: '300ms' },
    { render: 'Ship Better', effect: 'glow' },
    { wait: '2.5s' },
    { undoRender: 'all' },
    { wait: '300ms' }
  ]
});
```

### Terminal/CLI Style Output

```javascript
Domma.effects.scribe('.terminal-output', {
  speed: 20,
  cursor: true,
  cursorChar: '_',
  cursorBlink: true,
  actions: [
    { render: '$ npm install domma' },
    { wait: '1s' },
    { render: '\n✓ Installed successfully', effect: 'fade' },
    { wait: '500ms' },
    { render: '\n$ npm start', effect: 'none' }
  ]
});
```

### Interactive Storytelling

```javascript
Domma.effects.scribe('.story-text', {
  speed: 40,
  actions: [
    { render: 'Once upon a time...', effect: 'fade' },
    { wait: '2s' },
    { undoRender: 4 },  // Delete "time"
    { render: 'framework...', effect: 'glow' },
    { wait: '1s' },
    { render: ' there was Domma.', effect: 'bounce' }
  ],
  onComplete: () => {
    console.log('Story complete!');
  }
});
```

### Dynamic Landing Page Tagline

```javascript
Domma.effects.scribe('.tagline', {
  speed: 50,
  deleteSpeed: 30,
  loop: 3,  // Loop 3 times
  actions: [
    { render: 'For Web Developers', effect: 'fade' },
    { wait: '2s' },
    { undoRender: true },
    { render: 'For Startups', effect: 'bounce' },
    { wait: '2s' },
    { undoRender: true },
    { render: 'For Everyone', effect: 'glow' },
    { wait: '2s' },
    { undoRender: true }
  ]
});
```

### Chat Message Simulation

```javascript
Domma.effects.scribe('.chat-message', {
  speed: 30,
  cursor: false,  // No cursor for chat
  actions: [
    { render: 'Hey! 👋' },
    { wait: '1s' },
    { render: '\nHow can I help you today?' }
  ],
  onComplete: () => {
    // Show reply input
    $('#reply-input').show();
  }
});
```

### Partial Text Editing

```javascript
Domma.effects.scribe('.editable-text', {
  speed: 50,
  deleteSpeed: 40,
  actions: [
    { render: 'Welcome to our website!' },
    { wait: '2s' },
    { undoRender: 8 },  // Delete "website!"
    { render: 'Domma Framework!', effect: 'bounce' }
  ]
});
```

## Cursor Types

The `cursorType` option controls the visual style of the cursor:

### Caret (default)
```javascript
{ cursorType: 'caret', cursorChar: '|' }
```
Classic thin vertical line cursor (like terminal/IDE).

### Block
```javascript
{ cursorType: 'block', cursorChar: '█' }
```
Solid block cursor (like old terminals). Background fills behind the character.

### Underline
```javascript
{ cursorType: 'underline', cursorChar: '_' }
```
Underline cursor below the text baseline.

**Example:**
```javascript
Domma.effects.scribe('.terminal', {
  cursorType: 'block',
  cursorChar: '█',
  cursorBlink: true,  // Smooth fade in/out
  actions: [{ render: '$ command' }]
});
```

## CSS Classes (Auto-Applied)

These classes are automatically applied by the scribe effect:

| Class | Purpose |
|-------|---------|
| `.dm-tw-cursor` | Base cursor span with smooth fade animation, baseline alignment, and optimized font smoothing |
| `.dm-tw-cursor-caret` | Thin vertical line cursor (default) |
| `.dm-tw-cursor-block` | Solid block cursor with minimal padding (0.04em) for refined appearance |
| `.dm-tw-cursor-underline` | Underline cursor style |
| `.dm-tw-cursor-no-blink` | Non-blinking cursor |
| `.dm-tw-char` | Character wrapper with GPU acceleration and baseline alignment |
| `.dm-tw-char-fade` | Fade entrance effect |
| `.dm-tw-char-bounce` | Bounce entrance effect |
| `.dm-tw-char-glow` | Glow entrance effect |

## Config Engine Usage

You can use typewriter with Domma's config engine:

```javascript
$.setup({
  '.hero-title': {
    component: 'typewriter',
    options: {
      speed: 50,
      actions: [
        { render: 'Welcome!', effect: 'bounce' }
      ]
    }
  }
});
```

## Tips & Best Practices

1. **Speed Settings**
   - Normal reading speed: 50-60ms
   - Fast/urgent: 30-40ms
   - Slow/dramatic: 80-100ms

2. **Character Effects**
   - Use `'none'` for terminal/code output
   - Use `'fade'` for elegant, professional feel
   - Use `'bounce'` for playful, energetic feel
   - Use `'glow'` for emphasis on key words

3. **Looping**
   - Set `loop: true` for hero banners
   - Set `loop: 3` (or specific number) for controlled repetition
   - Always use `loopDelay` to give readers time between loops

4. **Deletion**
   - `undoRender: true` - Best for message replacement
   - `undoRender: N` - Good for word correction/editing
   - `undoRender: 'all'` - Clean slate before new content

5. **Performance**
   - Lower speed = more frequent DOM updates
   - Use `respectMotionPreference: true` for accessibility
   - Call `destroy()` when effect is no longer needed
   - Animations use GPU-accelerated properties (transform, opacity)
   - Characters use `will-change` and `backface-visibility` for smoothness
   - Cursor uses smooth fade with `ease-in-out` timing

6. **Accessibility**
   - The effect respects `prefers-reduced-motion` by default
   - Screen readers will read the final text
   - Ensure final text is meaningful without animation

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- IE11+ (with polyfills)
- Mobile browsers (iOS Safari, Chrome Mobile)

## File Locations

- **Source:** `/src/effects.js`
- **CSS:** `/src/css/domma.css` (typewriter keyframes & classes)
- **Bundle:** Included in `/public/dist/domma.min.js`
- **Showcase:** `/public/showcase/effects/javascript.html`
- **Test Page:** `/public/showcase/effects/typewriter-test.html`

## Related Effects

- `Domma.effects.breathe()` - Floating animation
- `Domma.effects.pulse()` - Scale animation

## Troubleshooting

**Effect not starting:**
- Check if `autoStart: false` is set
- Call `.start()` or `.resume()` manually
- Verify element selector is correct

**Characters appearing instantly:**
- Check `speed` setting (should be > 0)
- Verify effect is not being destroyed prematurely

**Cursor not showing:**
- Set `cursor: true` in options
- Check if cursor element exists in DOM
- Verify CSS is loaded (`dm-tw-cursor` class)

**Loop not working:**
- Set `loop: true` or `loop: N` (number)
- Ensure all actions complete
- Check console for errors

## Version

Added in Domma v0.14.4 (February 2026)
