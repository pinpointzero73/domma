---
title: Slideover
description: "Panel overlays that slide from screen edges, maintaining spatial context for filters, forms, and navigation"
layout: with-sidebar
status: published
sortOrder: 50
---

[hero title="Slideover" tagline="Panel overlays that slide from screen edges, maintaining spatial context for filters, forms, and navigation" align="center"][/hero]

## Overview

Slideovers are panel overlays that slide in from the edge of the screen, providing contextual information or actions without completely obscuring the main content. Unlike modals which appear in the center, slideovers maintain spatial context and are ideal for secondary tasks, filters, or navigation.

### Key Features

- Four directional positions: left, right, top, bottom
- Multiple size variants (sm, md, lg, xl, full) or custom sizes
- Semi-transparent backdrop with optional click-to-close
- Smooth slide animations from edges
- Keyboard navigation with Escape key
- Factory method for dynamic creation
- Form blueprint integration support
- Event callbacks for lifecycle management

### When to Use Slideovers

- **Filters & Settings**: Advanced filters, configuration panels, preferences
- **Detail Views**: User profiles, product details, metadata panels
- **Forms**: Quick edits, creation forms, data entry without leaving context
- **Navigation**: Mobile menus, navigation panels, table of contents
- **Shopping Carts**: Cart summary, checkout panels
- **Notifications**: Activity feeds, notification panels

### Basic Usage

```javascript
// Factory method (recommended)
const slideover = Domma.elements.slideover({
    title: 'My Slideover',
    content: '<p>Slideover content goes here.</p>',
    position: 'right',  // 'left', 'right', 'top', 'bottom'
    size: 'lg',         // 'sm', 'md', 'lg', 'xl', 'full', or custom (e.g., '400px')
    backdrop: true,
    backdropClose: true,
    keyboard: true
});

// Open the slideover
slideover.open();

// Control methods
slideover.close();
slideover.toggle();
slideover.isOpen();
slideover.setTitle('New Title');
slideover.setContent('<p>Updated content</p>');
slideover.setSize('xl');
slideover.setPosition('left');
```

### HTML Structure (Existing Element)

```html
<div id="my-slideover">
    <div class="dm-slideover-header">
        <h5 class="dm-slideover-title">Slideover Title</h5>
        <button class="dm-slideover-close" data-dismiss="slideover">×</button>
    </div>
    <div class="dm-slideover-body">
        Slideover content goes here.
    </div>
</div>

<script>
const slideover = Domma.elements.slideover('#my-slideover', {
    position: 'right',
    size: 'lg'
});

slideover.open();
</script>
```

## Position Variants

Slideovers can slide in from any edge of the screen. Choose the position that best fits your layout and user workflow.

[showcase-demo id="showcase/elements/slideover/position-variants" title="Position Variants" /]

```javascript
// Right (default)
const slideoverRight = Domma.elements.slideover({
    title: 'Right Slideover',
    content: '<p>Slides in from the right side.</p>',
    position: 'right'
});

// Left
const slideoverLeft = Domma.elements.slideover({
    title: 'Left Slideover',
    content: '<p>Slides in from the left side.</p>',
    position: 'left'
});

// Top
const slideoverTop = Domma.elements.slideover({
    title: 'Top Slideover',
    content: '<p>Slides down from the top.</p>',
    position: 'top'
});

// Bottom
const slideoverBottom = Domma.elements.slideover({
    title: 'Bottom Slideover',
    content: '<p>Slides up from the bottom.</p>',
    position: 'bottom'
});
```

## Size Variants

Control the width (for left/right) or height (for top/bottom) using predefined sizes or custom values.

[showcase-demo id="showcase/elements/slideover/size-variants" title="Size Variants" /]

```javascript
// Predefined sizes
const small = Domma.elements.slideover({
    title: 'Small Slideover',
    content: '<p>25% width</p>',
    size: 'sm'
});

const medium = Domma.elements.slideover({
    title: 'Medium Slideover',
    content: '<p>50% width</p>',
    size: 'md'
});

const large = Domma.elements.slideover({
    title: 'Large Slideover',
    content: '<p>75% width</p>',
    size: 'lg'
});

// Custom size
const custom = Domma.elements.slideover({
    title: 'Custom Slideover',
    content: '<p>400px width</p>',
    size: '400px'  // Can use px, rem, em, %
});
```

## Advanced Features

### Backdrop Options

Control backdrop appearance and click behavior.

[showcase-demo id="showcase/elements/slideover/backdrop-options" title="Backdrop Options" /]

```javascript
// No backdrop
const noBackdrop = Domma.elements.slideover({
    title: 'No Backdrop',
    content: '<p>No overlay behind the slideover.</p>',
    backdrop: false
});

// Backdrop but can't close by clicking it
const backdropNoClose = Domma.elements.slideover({
    title: 'Backdrop, No Close',
    content: '<p>Must use X button to close.</p>',
    backdrop: true,
    backdropClose: false
});
```

### Non-Closable Slideover

Remove the X button and require programmatic closing.

Non-Closable Slideover

```javascript
const nonClosable = Domma.elements.slideover({
    title: 'Non-Closable',
    content: `
        <p>This slideover has no X button.</p>
        <button onclick="currentSlideover.close()" class="btn">
            Close Programmatically
        </button>
    `,
    closable: false,
    backdropClose: false,
    keyboard: false  // Disable Escape key too
});
```

### Event Callbacks

Hook into slideover lifecycle events.

Test Callbacks

[showcase-demo id="showcase/elements/slideover/event-callbacks" title="Event Callbacks" /]

```javascript
const slideover = Domma.elements.slideover({
    title: 'Callbacks Demo',
    content: '<p>Watch the log for callback messages.</p>',
    onOpen: (instance) => {
        console.log('Slideover opened!', instance);
    },
    onClose: (instance) => {
        console.log('Slideover is closing...', instance);
    },
    onClosed: (instance) => {
        console.log('Slideover fully closed!', instance);
    }
});
```

## Form Integration

Slideovers are excellent for forms - they keep context while allowing focused data entry.

Contact Form

```javascript
const formSlideover = Domma.elements.slideover({
    title: 'Contact Form',
    content: `
        <form id="contact-form">
            <div class="mb-3">
                <label class="form-label">Name</label>
                <input type="text" name="name" class="form-control" required>
            </div>
            <div class="mb-3">
                <label class="form-label">Email</label>
                <input type="email" name="email" class="form-control" required>
            </div>
            <div class="mb-3">
                <label class="form-label">Message</label>
                <textarea name="message" rows="4" class="form-control"></textarea>
            </div>
            <button type="submit" class="btn btn-primary">Send</button>
            <button type="button" class="btn btn-secondary" onclick="currentSlideover.close()">Cancel</button>
        </form>
    `,
    size: 'md',
    onOpen: () => {
        $('#contact-form').on('submit', function(e) {
            e.preventDefault();
            alert('Form submitted!');
            formSlideover.close();
        });
    }
});
```

## Programmatic Control

Slideovers can be controlled and modified after creation.

Open Control Panel

```javascript
let slideover = Domma.elements.slideover({
    title: 'Control Panel',
    content: `
        <p>Use the buttons to modify this slideover:</p>
        <button onclick="currentSlideover.setTitle('Updated Title')">Change Title</button>
        <button onclick="currentSlideover.setContent('<p>New content!</p>')">Change Content</button>
        <button onclick="currentSlideover.setSize('sm')">Small</button>
        <button onclick="currentSlideover.setSize('xl')">Extra Large</button>
        <button onclick="currentSlideover.setPosition('left')">Move Left</button>
        <button onclick="currentSlideover.setPosition('right')">Move Right</button>
        <p>Is open: <span id="status">?</span></p>
    `,
    position: 'right'
});

// Check state
console.log(slideover.isOpen());  // false

// Open/close/toggle
slideover.open();
slideover.close();
slideover.toggle();

// Modify content
slideover.setTitle('New Title');
slideover.setContent('<p>Updated!</p>');

// Change size and position
slideover.setSize('md');
slideover.setPosition('left');

// Clean up
slideover.destroy();
```

## API Reference

### Factory Method

```javascript
Domma.elements.slideover(options)
```

### Constructor

```javascript
Domma.elements.slideover(selector, options)
```

### Options

[table striped="true"]
| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `position` | String | 'right' | Position: 'left', 'right', 'top', 'bottom' |
| `size` | String | 'lg' | Size: 'sm', 'md', 'lg', 'xl', 'full', or custom (e.g., '400px') |
| `backdrop` | Boolean | true | Show semi-transparent backdrop |
| `backdropClose` | Boolean | true | Close when clicking backdrop |
| `keyboard` | Boolean | true | Enable keyboard shortcuts |
| `closeOnEscape` | Boolean | true | Close on Escape key |
| `animation` | Boolean | true | Enable slide animation |
| `animationDuration` | Number | 300 | Animation duration in milliseconds |
| `title` | String | '' | Slideover title (factory method only) |
| `content` | String\|Element | '' | Slideover content (factory method only) |
| `closable` | Boolean | true | Show close button |
| `closeIcon` | String | 'x' | Icon name for close button |
| `customSizes` | Object | {} | Custom size definitions |
| `onOpen` | Function | null | Callback when slideover opens |
| `onClose` | Function | null | Callback when slideover starts closing |
| `onClosed` | Function | null | Callback when slideover fully closed |
[/table]

### Methods

[table striped="true"]
| Method | Returns | Description |
| --- | --- | --- |
| `open()` | this | Opens the slideover |
| `close()` | this | Closes the slideover |
| `toggle()` | this | Toggles slideover open/closed |
| `isOpen()` | Boolean | Returns true if slideover is open |
| `setTitle(title)` | this | Updates the slideover title |
| `setContent(content)` | this | Updates the slideover content (string or element) |
| `setSize(size)` | this | Changes the slideover size |
| `setPosition(position)` | this | Changes the slideover position |
| `destroy()` | void | Destroys the slideover and cleans up |
[/table]

## CSS Customisation

Override these CSS variables to customise Slideover appearance and match your design system.

[table striped="true"]
| Variable | Default | Controls |
| --- | --- | --- |
| `--dm-surface` | `var(--dm-white)` | Slideover background |
| `--dm-shadow-xl` | `0 20px 25px...` | Slideover shadow |
| `--dm-transition-normal` | `250ms ease` | Slide animation speed |
| `--dm-text` | `var(--dm-slate-800)` | Content text colour |
[/table]

### Example Override

```css
:root {
    /* Dark slideover */
    --dm-surface: #1e293b;
    --dm-text: #f1f5f9;
}
```

[Full CSS Customisation Cheat-Sheet →](/showcase/elements/css-customisation)
