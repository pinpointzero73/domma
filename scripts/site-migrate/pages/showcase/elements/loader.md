---
title: Loader
description: "Visual feedback during asynchronous operations with four animated types and flexible sizing"
layout: with-sidebar
status: published
sortOrder: 50
---

[hero title="Loader" tagline="Visual feedback during asynchronous operations with four animated types and flexible sizing" align="center"][/hero]

## Overview

Loaders (also called spinners or throbbers) provide visual feedback during asynchronous operations. They indicate that content is loading, a process is running, or the application is waiting for a response. Domma provides four animated loader types with flexible sizing, colouring, and positioning options.

### Key Features

- **Four Animation Types** - Spinner, dots, pulse, and bars
- **Flexible Sizing** - Small, medium, large, or custom pixel size
- **Theme-Aware Colours** - Primary, secondary, success, danger, or custom hex
- **Overlay Mode** - Cover entire container with backdrop
- **Loading Text** - Optional text label below animation
- **Static Helpers** - Fullscreen loader and quick show/hide methods

### When to Use Loaders

- **API Calls** - Show whilst fetching data from a server
- **File Uploads** - Indicate progress during file transfers
- **Page Transitions** - Display whilst loading new content
- **Heavy Computations** - Provide feedback during intensive JavaScript operations

### Basic Usage

```
<!-- HTML Container -->
<div id="my-container" class="demo-area-min-h-120">
    <!-- Loader will be inserted here -->
</div>

<!-- JavaScript Initialisation -->
<script>
const loader = Domma.elements.loader('#my-container', {
    type: 'spinner',      // 'spinner', 'dots', 'pulse', 'bars'
    size: 'medium',       // 'small', 'medium', 'large', or number (px)
    color: 'primary'      // 'primary', 'secondary', 'white', or hex
});

// Show/hide
loader.show();
loader.hide();
loader.toggle();
</script>
```

## Web Components

Domma Loader is now available as a native Web Component! Use modern `<domma-loader>` tags or the traditional wrapper API - both work identically with zero breaking changes.

### Direct Web Component Usage - Animation Types

All four loader animations available as custom elements:

[showcase-demo id="showcase/elements/loader/direct-web-component-usage-animation-types" title="Direct Web Component Usage - Animation Types" /]

```
<!-- Container with loader -->
<div style="position: relative; width: 100px; height: 100px;">
    <domma-loader type="spinner" size="medium" color="primary"></domma-loader>
</div>

<domma-loader type="dots" size="medium" color="success"></domma-loader>
<domma-loader type="pulse" size="medium" color="info"></domma-loader>
<domma-loader type="bars" size="medium" color="warning"></domma-loader>
```

### Size Variants

Choose from predefined sizes or use custom pixel values:

[showcase-demo id="showcase/elements/loader/size-variants" title="Size Variants" /]

```
<domma-loader type="spinner" size="small" color="primary"></domma-loader>
<domma-loader type="spinner" size="medium" color="primary"></domma-loader>
<domma-loader type="spinner" size="large" color="primary"></domma-loader>

<!-- Custom size in pixels -->
<domma-loader type="spinner" size="80" color="primary"></domma-loader>
```

### With Loading Text

[showcase-demo id="showcase/elements/loader/with-loading-text" title="With Loading Text" /]

```
<domma-loader type="spinner" size="medium" color="primary" text="Loading..."></domma-loader>
<domma-loader type="dots" size="medium" color="success" text="Please wait"></domma-loader>
```

### Overlay Mode

Cover entire container with a dark backdrop:

[showcase-demo id="showcase/elements/loader/overlay-mode" title="Overlay Mode" /]

```
<div style="position: relative; width: 300px; height: 200px;">
    <p>Content behind overlay</p>
    <domma-loader type="spinner" size="large" color="white" text="Loading..." overlay></domma-loader>
</div>
```

### Programmatic API

Control loader visibility and appearance dynamically:

[showcase-demo id="showcase/elements/loader/programmatic-api" title="Programmatic API" /]

```
const loader = $('domma-loader')[0];

// Show/hide control
loader.show();
loader.hide();
loader.toggle();

// Check state
if (loader.isVisible()) {
    console.log('Loader is visible');
}

// Update properties
loader.setText('Processing...');
loader.setType('dots');
loader.setSize('large');
loader.setColor('success');
```

### Wrapper API (Backwards Compatible)

Existing code continues to work unchanged! The wrapper API uses Web Components internally:

[showcase-demo id="showcase/elements/loader/wrapper-api-backwards-compatible" title="Wrapper API (Backwards Compatible)" /]

```
// Traditional approach - still works!
const loader = Domma.elements.loader('#my-container', {
    type: 'dots',
    size: 'large',
    color: 'success',
    text: 'Loading data...',
    overlay: false
});

// Same API as before
loader.show();
loader.hide();
loader.setText('Updated text');
loader.destroy();
```

> **💡 Benefits of Web Components:**  **Encapsulation** - Loader styles isolated via Shadow DOM **Four Animation Types** - Spinner, dots, pulse, and bars **Flexible** - Works standalone or in overlay mode **Backwards Compatible** - Existing code works without changes

## Quick Start

Get started with Loaders in seconds. Here's the simplest implementation:

### Basic Spinner Loader

Create a container and initialise a loader:

[showcase-demo id="showcase/elements/loader/basic-spinner-loader" title="Basic Spinner Loader" /]

```
<div id="my-loader-container" class="demo-area-min-h-120">
    <!-- Loader appears here -->
</div>

<script>
const loader = Domma.elements.loader('#my-loader-container', {
    type: 'spinner',
    size: 'medium',
    color: 'primary'
});

loader.show();  // Display the loader
</script>
```

### Static Fullscreen Loader

Quick fullscreen loader with a single line:

[showcase-demo id="showcase/elements/loader/static-fullscreen-loader" title="Static Fullscreen Loader" /]

```
// Show fullscreen loader for 2 seconds
const fsLoader = Domma.elements.fullscreenLoader('Loading content...');
setTimeout(() => fsLoader.destroy(), 2000);
```

## Step-by-Step Tutorial

Let's build a data fetching interface that shows a loader whilst making an API call, then displays the results.

### Step 1: Create the HTML Structure

Create a container with a button to trigger loading:

```
<button id="load-data-btn" class="btn btn-primary">Load Data</button>

<div id="data-container" class="demo-area mt-4"
     class="demo-area-min-h-200">
    <p class="text-center text-muted" id="placeholder-text">
        Click "Load Data" to fetch content
    </p>
    <div id="data-result" class="hidden"></div>
</div>
```

### Step 2: Create the Loader Instance

Initialise a loader with overlay to block interaction:

```
const dataLoader = Domma.elements.loader('#data-container', {
    type: 'spinner',
    size: 'large',
    color: 'var(--dm-white)',
    overlay: true,           // Semi-transparent backdrop
    text: 'Loading data...'  // Text below spinner
});
```

### Step 3: Show Loader During Async Operation

Display the loader whilst fetching data:

```
async function loadData() {
    // Hide placeholder
    $('#placeholder-text')[0].classList.add('hidden');

    // Show loader
    dataLoader.show();

    try {
        // Simulate API call
        const response = await fetch('https://api.example.com/data');
        const data = await response.json();

        // Process data...
    } catch (error) {
        console.error('Failed to load data:', error);
    }
}
```

### Step 4: Hide Loader and Display Results

Hide the loader and show fetched data:

```
async function loadData() {
    $('#placeholder-text')[0].classList.add('hidden');
    dataLoader.show();

    try {
        const response = await fetch('https://api.example.com/data');
        const data = await response.json();

        // Hide loader
        dataLoader.hide();

        // Display results
        const resultEl = $('#data-result')[0];
        resultEl.innerHTML = `<h4>Data Loaded!</h4><pre>${JSON.stringify(data, null, 2)}</pre>`;
        resultEl.classList.remove('hidden');
    } catch (error) {
        dataLoader.hide();
        alert('Failed to load data');
    }
}
```

### Step 5: Update Loader Text Dynamically

Change the loading message based on progress:

```
async function loadMultipleResources() {
    dataLoader.setText('Loading users...');
    dataLoader.show();

    const users = await fetch('/api/users').then(r => r.json());

    dataLoader.setText('Loading posts...');
    const posts = await fetch('/api/posts').then(r => r.json());

    dataLoader.setText('Loading comments...');
    const comments = await fetch('/api/comments').then(r => r.json());

    dataLoader.hide();
    // Display all data...
}
```

### Step 6: Complete Working Demo

Try the complete data loading example:

[showcase-demo id="showcase/elements/loader/complete-working-demo" title="Step 6: Complete Working Demo" /]

## Examples & Variations

### Four Loader Types

Domma provides four different animation styles:

[showcase-demo id="showcase/elements/loader/four-loader-types" title="Four Loader Types" /]

```
// Spinner (default)
Domma.elements.loader('#spinner-container', { type: 'spinner' }).show();

// Animated dots
Domma.elements.loader('#dots-container', { type: 'dots' }).show();

// Pulsing circle
Domma.elements.loader('#pulse-container', { type: 'pulse' }).show();

// Vertical bars
Domma.elements.loader('#bars-container', { type: 'bars' }).show();
```

### Size Variants

Small, medium, and large sizes, plus custom pixel values:

[showcase-demo id="showcase/elements/loader/size-variants-2" title="Size Variants" /]

```
// Small (24px)
Domma.elements.loader('#container', { size: 'small' }).show();

// Medium (40px - default)
Domma.elements.loader('#container', { size: 'medium' }).show();

// Large (64px)
Domma.elements.loader('#container', { size: 'large' }).show();

// Custom pixel size
Domma.elements.loader('#container', { size: 80 }).show();
```

### Colour Variants

Theme-aware colours or custom hex values:

[showcase-demo id="showcase/elements/loader/colour-variants" title="Colour Variants" /]

```
// Theme colours
Domma.elements.loader('#container', { color: 'primary' }).show();
Domma.elements.loader('#container', { color: 'success' }).show();
Domma.elements.loader('#container', { color: 'danger' }).show();
Domma.elements.loader('#container', { color: 'warning' }).show();

// Custom hex colour
Domma.elements.loader('#container', { color: 'var(--dm-primary)' }).show();
```

### Overlay Mode

Cover container with semi-transparent backdrop:

[showcase-demo id="showcase/elements/loader/overlay-mode-2" title="Overlay Mode" /]

```
const overlayLoader = Domma.elements.loader('#container', {
    type: 'spinner',
    size: 'large',
    color: 'var(--dm-white)',
    overlay: true,           // Enable backdrop overlay
    text: 'Loading content...'
});

// Show for 2 seconds
overlayLoader.show();
setTimeout(() => overlayLoader.hide(), 2000);
```

### With Loading Text

Add descriptive text below the loader animation:

[showcase-demo id="showcase/elements/loader/with-loading-text-2" title="With Loading Text" /]

```
const textLoader = Domma.elements.loader('#container', {
    type: 'dots',
    size: 'medium',
    color: 'primary',
    text: 'Loading your data...'
});

textLoader.show();

// Update text dynamically
setTimeout(() => textLoader.setText('Almost there...'), 1500);
```

### Static Helper Methods

Quick show/hide without creating instances:

[showcase-demo id="showcase/elements/loader/static-helper-methods" title="Static Helper Methods" /]

```
// Quick show (creates loader if needed)
Domma.elements.showLoader('#container');

// Quick hide
Domma.elements.hideLoader('#container');

// Fullscreen loader
const fs = Domma.elements.fullscreenLoader('Processing...');
setTimeout(() => fs.destroy(), 2000);
```

### Button Loading State

Show loader inside a button during submission:

[showcase-demo id="showcase/elements/loader/button-loading-state" title="Button Loading State" /]

```
const submitBtn = $('#submit-btn')[0];
let btnLoader = null;

submitBtn.addEventListener('click', async () => {
    // Disable button and show loader
    submitBtn.disabled = true;
    submitBtn.textContent = '';

    btnLoader = Domma.elements.loader(this, {
        type: 'spinner',
        size: 20,
        color: 'var(--dm-white)',
        centered: true
    });
    btnLoader.show();

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Re-enable button
    btnLoader.destroy();
    submitBtn.disabled = false;
    submitBtn.textContent = originalText;
});
```

### Real-World Example: Image Gallery Loader

Load and display images with a progress loader:

[showcase-demo id="showcase/elements/loader/real-world-example-image-gallery-loader" title="Real-World Example: Image Gallery Loader" /]

```
const galleryContainer = $('#gallery-container')[0];
const galleryLoader = Domma.elements.loader(galleryContainer, {
    type: 'pulse',
    size: 'large',
    color: 'primary',
    overlay: true,
    text: 'Loading gallery...'
});

async function loadGallery() {
    galleryContainer.innerHTML = '';
    galleryLoader.show();

    try {
        // Fetch image URLs
        const response = await fetch('/api/images');
        const images = await response.json();

        galleryLoader.setText(`Loading ${images.length} images...`);

        // Load images
        const imgPromises = images.map(url => {
            return new Promise((resolve) => {
                const img = new Image();
                img.onload = () => resolve(img);
                img.src = url;
            });
        });

        await Promise.all(imgPromises);

        // Hide loader and display images
        galleryLoader.hide();
        images.forEach(url => {
            const imgEl = document.createElement('img');
            imgEl.src = url;
            imgEl.className = 'w-full h-auto rounded';
            galleryContainer.appendChild(imgEl);
        });
    } catch (error) {
        galleryLoader.hide();
        alert('Failed to load gallery');
    }
}
```

## Best Practices

### Accessibility

- **ARIA Attributes** - Loaders automatically include `role="status"` and `aria-live="polite"` for screen readers
- **Loading Text** - Always provide descriptive text via the `text` option for screen reader users
- **Focus Management** - When showing overlay loaders, consider trapping focus or announcing the loading state
- **Colour Contrast** - Ensure loader colour has sufficient contrast (4.5:1) against background, especially with overlay mode
- **Timeout Handling** - Provide fallback error messages if loading takes too long or fails
- **Keyboard Users** - Don't rely solely on loaders - provide skip links or cancel buttons for long operations

### Performance

- **Destroy When Done** - Call `loader.destroy()` after use to remove DOM elements and prevent memory leaks
- **Reuse Instances** - Create loader once, then show/hide repeatedly instead of recreating: `loader.show() / loader.hide()`
- **CSS Animations** - Loaders use CSS animations (not JavaScript), which are GPU-accelerated and performant
- **Lazy Initialisation** - Don't create loaders on page load - initialise only when needed
- **Debounce Quick Operations** - For operations under 300ms, consider skipping the loader to avoid flashing

### Common Gotchas

- **Issue:** Loader not visible or positioned incorrectly  
 **Solution:** Ensure container has `position: relative` and `min-height`  
 **Example:** ````
- **Issue:** Loader stays visible after operation completes  
 **Solution:** Always call `loader.hide()` in both success and error handlers  
 **Example:** Use try/finally or .finally() to ensure hide() is called
- **Issue:** Multiple loaders stacking in same container  
 **Solution:** Destroy previous loader before creating new one, or reuse same instance  
 **Example:** `existingLoader?.destroy(); newLoader = Domma.elements.loader(...)`
- **Issue:** Fullscreen loader not covering modal/dropdown  
 **Solution:** Fullscreen loader has z-index: 9999. Ensure modals don't exceed this  
 **Example:** Adjust modal z-index or create loader inside modal
- **Issue:** setText() not working  
 **Solution:** Must initialise loader with `text` option first, or setText() creates new element  
 **Example:** `{ text: 'Initial text...' }` then `loader.setText('New
                text')`

### Tips & Tricks

- **Minimum Display Time** - Show loaders for at least 500ms to avoid jarring flashes on fast connections
- **White Overlay** - Use `color: 'white'` with `overlay: true` for dark backdrops
- **Debounce Search** - Combine with `_.debounce()` for live search: show loader only if typing pauses
- **Progress Updates** - Use `setText()` to show incremental progress: "Step 1 of 3..."
- **Container Sizing** - For inline loaders, set explicit container dimensions to prevent layout shift
- **Cleanup in SPA** - Always destroy loaders when unmounting components/pages in single-page apps

```
<!-- Accessible Loader with Proper Container -->
<div id="data-container"
     role="region"
     aria-label="Data content"
     style="position: relative; min-height: 200px;">
    <!-- Content -->
</div>

<script>
const loader = Domma.elements.loader('#data-container', {
    type: 'spinner',
    size: 'medium',
    color: 'primary',
    overlay: true,
    text: 'Loading data, please wait...'  // Screen reader accessible
});

async function fetchData() {
    loader.show();

    try {
        const data = await fetch('/api/data').then(r => r.json());

        // Ensure minimum display time
        await new Promise(resolve => setTimeout(resolve, 500));

        // Process data...
    } catch (error) {
        console.error('Failed:', error);
        alert('Failed to load data. Please try again.');
    } finally {
        // Always hide loader, even on error
        loader.hide();
    }
}
</script>
```

## API Reference

### Constructor Options

[table striped="true"]
| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `type` | String | `'spinner'` | Animation type: `'spinner'`, `'dots'`, `'pulse'`, or `'bars'` |
| `size` | String \| Number | `'medium'` | Size: `'small'` (24px), `'medium'` (40px), `'large'` (64px), or custom pixel number |
| `color` | String | `'primary'` | Colour: `'primary'`, `'secondary'`, `'success'`, `'danger'`, `'warning'`, `'info'`, `'white'`, `'dark'`, or custom hex |
| `overlay` | Boolean | `false` | Show with semi-transparent backdrop covering entire container |
| `text` | String | `''` | Optional loading text displayed below animation |
| `centered` | Boolean | `true` | Centre loader in container. If false, loader displays inline |
[/table]

### Instance Methods

[table striped="true"]
| Method | Parameters | Returns | Description |
| --- | --- | --- | --- |
| `show()` | - | this | Display the loader. Chainable |
| `hide()` | - | this | Hide the loader. Chainable |
| `toggle()` | - | this | Toggle visibility (show if hidden, hide if visible). Chainable |
[/table]

### Static Methods

[table striped="true"]
| Method | Parameters | Returns | Description |
| --- | --- | --- | --- |
| `Domma.elements.showLoader(selector, options)` | String \| Element, Object | Loader instance | Quick show loader in container. Creates instance if needed, reuses if exists |
| `Domma.elements.hideLoader(selector)` | String \| Element | void | Quick hide loader in container. No-op if loader doesn't exist |
| `Domma.elements.fullscreenLoader(text, options)` | String, Object | Loader instance | Show fullscreen loader covering entire viewport. Call `instance.destroy()` to remove |
[/table]

### CSS Classes

[table striped="true"]
| Class | Description |
| --- | --- |
| `.dm-loader` | Main wrapper element containing loader animation and optional text |
| `.dm-loader-spinner` | Circular spinning animation element |
| `.dm-loader-dots` | Three bouncing dots animation container |
| `.dm-loader-pulse` | Pulsing circle animation element |
| `.dm-loader-bars` | Four vertical bars animation container |
[/table]

```
// Complete API Example
const loader = Domma.elements.loader('#my-container', {
    type: 'spinner',
    size: 'large',
    color: 'primary',
    overlay: true,
    text: 'Loading...',
    centered: true
});

// Instance methods
loader.show();                        // Display loader
loader.hide();                        // Hide loader
loader.toggle();                      // Toggle visibility
const visible = loader.isVisible();   // Check visibility → true/false
loader.setText('Almost done...');     // Update text
loader.destroy();                     // Clean up

// Static methods
Domma.elements.showLoader('#container');  // Quick show
Domma.elements.hideLoader('#container');  // Quick hide

const fs = Domma.elements.fullscreenLoader('Processing...');
setTimeout(() => fs.destroy(), 2000);     // Remove after 2s
```

## Config Engine Integration

Use Domma's declarative `$.setup()` system to configure Loaders. Note: Loaders typically need imperative control (show/hide), but you can pre-configure them with the Config Engine.

### Pre-Configure Loader

```
// Pre-configure loader, then control manually
let dataLoader;

$.setup({
    '#data-container': {
        component: 'loader',
        options: {
            type: 'spinner',
            size: 'large',
            color: 'var(--dm-white)',
            overlay: true,
            text: 'Loading data...'
        },
        initial: {
            // Loader hidden by default
        }
    }
});

// Get instance and control manually
dataLoader = Domma.elements.get('#data-container');

async function fetchData() {
    dataLoader.show();
    const data = await fetch('/api/data').then(r => r.json());
    dataLoader.hide();
}
```

### Event-Triggered Loader

```
// Show loader on button click, hide after delay
$.setup({
    '#overlay-container': {
        component: 'loader',
        options: {
            type: 'pulse',
            size: 'large',
            color: 'var(--dm-white)',
            overlay: true,
            text: 'Loading content...'
        }
    },

    '#load-btn': {
        events: {
            click: (e, $el) => {
                const loader = Domma.elements.get('#overlay-container');
                loader.show();

                // Simulate async operation
                setTimeout(() => {
                    loader.setText('Almost done...');
                }, 1000);

                setTimeout(() => {
                    loader.hide();
                }, 2000);
            }
        }
    }
});
```

### Live Demo

Loader configured via Config Engine:

[showcase-demo id="showcase/elements/loader/live-demo" title="Live Demo" /]

```
// Configuration
$.setup({
    '#config-demo-container': {
        component: 'loader',
        options: {
            type: 'dots',
            size: 'medium',
            color: 'primary',
            overlay: true,
            text: 'Config Engine Loader'
        }
    },

    '#config-trigger-btn': {
        events: {
            click: () => {
                const loader = Domma.elements.get('#config-demo-container');
                loader.show();
                setTimeout(() => loader.hide(), 2000);
            }
        }
    }
});
```

## CSS Customisation

Override these CSS variables to customise Loader appearance and match your design system.

[table striped="true"]
| Variable | Default | Controls |
| --- | --- | --- |
| `--dm-primary` | `var(--dm-blue-600)` | Spinner/animation colour |
| `--dm-surface` | `var(--dm-white)` | Overlay background (if used) |
| `--dm-text` | `var(--dm-slate-800)` | Loading text colour |
[/table]

### Example Override

```css
/* White spinner for dark backgrounds */
/* Override via JavaScript color option:
elements.loader('#container', { color: '#ffffff' }) */
```

[Full CSS Customisation Cheat-Sheet →](/showcase/elements/css-customisation)

## Related Elements

[showcase-demo id="showcase/elements/loader/related-elements" title="Related Elements" /]
