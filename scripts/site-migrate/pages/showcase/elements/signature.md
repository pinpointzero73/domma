---
title: Signature
description: "Capture handwritten signatures with mouse, touch, or stylus - with undo/redo, colour and width controls, SVG/PNG export, and type-your-name fallback"
layout: with-sidebar
status: published
sortOrder: 50
---

[hero title="Signature" tagline="Capture handwritten signatures with mouse, touch, or stylus - with undo/redo, colour and width controls, SVG/PNG export, and type-your-name fallback" align="center"][/hero]

## Overview

The Signature component provides a canvas-based pad for capturing handwritten signatures. It uses the Pointer Events API to support mouse, touch, and stylus input with optional pressure sensitivity. Strokes are stored as normalised co-ordinates so signatures scale correctly when the browser is resized.

### Key Features

- **Pointer Events** - mouse, touch, and stylus all work the same way; pressure-sensitive line width on stylus
- **Smooth curves** - midpoint quadratic Bézier algorithm prevents jagged strokes
- **Undo / Redo** - full stroke-level history; `clear()` is also undoable
- **Dual export** - PNG data URL or SVG (rebuilt from stored strokes)
- **Responsive** - `ResizeObserver` reflows strokes when the container changes width
- **Type fallback** - cursive-font text entry alternative for keyboard users
- **Form integration** - hidden input auto-populated; works with `F.create()` blueprints
- **Config Engine** - declarative init via `$.setup()`

### Live Demo

[showcase-demo id="showcase/elements/signature/live-demo" title="Live Demo" /]

## Getting Started

Create an empty container element and pass its selector to `E.signature()`.

### Step 1: HTML

```
<div id="my-signature"></div>
```

### Step 2: JavaScript

```
const sig = E.signature('#my-signature', {
    label: 'Your Signature',
    name: 'signature',           // Name attribute on the hidden input
    guideLine: true,             // Show a dashed baseline
    onChange: (base64) => {
        console.log('Updated:', base64.slice(0, 40) + '...');
    }
});
```

The component renders a toolbar, canvas, guide line, and footer inside the container. A hidden `<input type="hidden">` is automatically kept in sync so the base64 value is included in any surrounding `<form>` submission.

## Pen Options

Configure the default pen colour and width, and the swatches shown in the toolbar. Pen width values are also used for the dot indicators in the toolbar.

[showcase-demo id="showcase/elements/signature/pen-options" title="Pen Options" /]

```
// Custom colour swatches + default to blue
E.signature('#sig-colours', {
    penColour: '#1e40af',
    colours: ['#000000', '#1e40af', '#15803d', '#b91c1c', '#7c3aed', '#ea580c'],
    widths: [1, 2, 4],
});

// Single thin pen
E.signature('#sig-thin', {
    penColour: '#111',
    penWidth: 1,
    widths: [1],
    guideLine: false,
    placeholder: 'Sign with a fine nib',
});
```

## Export Formats

Call `sig.toBase64()` to export as a PNG data URL (default) or `sig.toBase64('svg')` to get an SVG data URL rebuilt from the stored strokes. The SVG export uses the same Bézier algorithm as the canvas renderer, so output is visually identical.

[showcase-demo id="showcase/elements/signature/export-formats" title="Export Formats" /]

```
const sig = E.signature('#my-pad', { format: 'png' });

// Get PNG data URL (respects instance format)
const png = sig.toBase64();

// Override per-call
const svg = sig.toBase64('svg');

// Use in an <img> tag
document.querySelector('#preview').src = png;
```

## Undo, Redo & Clear

Each completed stroke is pushed onto a history stack. The toolbar undo/redo buttons operate on individual strokes. `clear()` moves all strokes to the redo stack, so the entire pad can be restored.

[showcase-demo id="showcase/elements/signature/undo-redo-and-clear" title="Undo, Redo & Clear" /]

```
const sig = E.signature('#my-pad');

sig.undo();      // Remove last stroke (moves to redo stack)
sig.redo();      // Restore last undone stroke
sig.clear();     // Clear all strokes (undoable - undo restores them all)
sig.clear(true); // Silent clear - cannot be undone, no callbacks fired
```

## Type Fallback

Enable `typeFallback: true` to show a Draw / Type toggle in the toolbar. In Type mode, users type their name into a text input rendered in a cursive web-safe font. The text is rendered to the canvas so `toBase64()` still returns an image.

[showcase-demo id="showcase/elements/signature/type-fallback" title="Type Fallback" /]

```
E.signature('#my-pad', {
    typeFallback: true,   // Show Draw / Type toggle in toolbar
    placeholder: 'Sign here or switch to Type mode',
});
```

## Disabled State

Use `disabled: true` in options or call `sig.disable()` / `sig.enable()` at runtime to lock or unlock the pad.

[showcase-demo id="showcase/elements/signature/disabled-state" title="Disabled State" /]

```
const sig = E.signature('#my-pad', { disabled: true });

sig.enable();   // Allow drawing again
sig.disable();  // Lock the pad (canvas becomes non-interactive)
```

## Form Integration

Use `type: 'signature'` in a Domma blueprint to include a signature field in any `F.create()` form. The component syncs automatically with the form model, and the hidden input value is included when the form is submitted.

### Blueprint

```
const contractBlueprint = {
    name: {
        type: M.types.string,
        required: true,
        label: 'Full Name',
    },
    agreed: {
        type: M.types.boolean,
        label: 'I agree to the terms & conditions',
        required: true,
    },
    signature: {
        type: 'signature',
        label: 'Signature',
        required: true,
    }
};

F.create('#contract-form', {
    blueprint: contractBlueprint,
    onSubmit: (data) => {
        console.log('Name:', data.name);
        console.log('Agreed:', data.agreed);
        console.log('Signature (PNG):', data.signature.slice(0, 40));
    }
});
```

### Plain HTML Form

```
<!-- The hidden input is rendered inside the component -->
<form id="my-form">
    <input type="text" name="name" placeholder="Your name">
    <div id="my-pad"></div>
    <!-- #my-pad will contain: <input type="hidden" name="signature"> -->
    <button type="submit">Submit</button>
</form>

<script type="module">
    E.signature('#my-pad', { name: 'signature' });

    $('#my-form').on('submit', (e) => {
        e.preventDefault();
        const data = new FormData(e.target);
        console.log(data.get('signature')); // base64 PNG
    });
</script>
```

## Config Engine

Initialise signature pads declaratively using `$.setup()`. This is useful for MPA pages where you want to configure components in a central JavaScript file without importing the element constructor directly.

```
$.setup({
    '#contract-sig': {
        component: 'signature',
        options: {
            label: 'Client Signature',
            penColour: '#1a1a2e',
            guideLine: true,
            typeFallback: true,
            onChange: (base64) => {
                console.log('Signature updated');
            }
        }
    }
});
```

## Tutorial - Contract Signing Form

Build a contract signing widget: the user fills in their name, ticks a consent checkbox, signs the pad, and the complete form data (including the base64 signature) is displayed for submission.

### Step 1: HTML

```
<form id="contract-form">
    <div class="mb-4">
        <label class="form-label">Full Name</label>
        <input type="text" class="form-input" name="fullName" required>
    </div>
    <div class="mb-4">
        <label class="form-check-label">
            <input type="checkbox" name="agreed" required>
            I agree to the terms &amp; conditions
        </label>
    </div>
    <div class="mb-4">
        <label class="form-label">Signature</label>
        <div id="contract-sig"></div>
    </div>
    <button type="submit" class="btn btn-primary">Sign &amp; Submit</button>
</form>
```

### Step 2: JavaScript

```
const sig = E.signature('#contract-sig', {
    label: 'Your Signature',
    name: 'signature',
    typeFallback: true,
    onChange: () => {
        submitBtn.disabled = sig.isEmpty();
    }
});

const submitBtn = document.querySelector('[type="submit"]');
submitBtn.disabled = true; // require signature

$('#contract-form').on('submit', async (e) => {
    e.preventDefault();

    if (sig.isEmpty()) {
        E.toast('Please add your signature.', { type: 'warning' });
        return;
    }

    const formData = new FormData(e.target);
    const payload = {
        fullName:  formData.get('fullName'),
        agreed:    formData.get('agreed') === 'on',
        signature: sig.toBase64('png'),
    };

    await E.confirm('Submit this signed contract?');
    console.log('Submitted:', payload);
    E.toast('Contract signed successfully!', { type: 'success' });
});
```

### Step 3: Live Demo

[showcase-demo id="showcase/elements/signature/live-demo-2" title="Step 3: Live Demo" /]

## JavaScript API

### Initialisation

```
const sig = E.signature('#el', {
    // Layout
    height: 180,              // Canvas height in px (default: 180)
    label: 'Signature',       // Toolbar label (default: 'Signature')
    placeholder: 'Sign here', // Placeholder text (default: 'Sign here')
    guideLine: true,          // Show dashed guide line (default: true)
    toolbar: true,            // Show/hide toolbar (default: true)

    // Pen
    penColour: '#000000',     // Default pen colour (default: '#000000')
    penWidth: 2,              // Default pen width in px (default: 2)
    colours: ['#000', '#1e40af', '#15803d', '#b91c1c'],  // Colour swatches
    widths: [1, 2, 4],        // Width options

    // Output
    format: 'png',            // 'png' | 'svg' (default: 'png')
    name: 'signature',        // Hidden input name attribute (default: 'signature')

    // Behaviour
    disabled: false,          // Start disabled (default: false)
    typeFallback: false,      // Show Draw / Type toggle (default: false)
    minStrokeLength: 3,       // Min pointer points to register a stroke (default: 3)
    respectMotionPreference: true, // Honour prefers-reduced-motion (default: true)

    // Callbacks
    onChange: (base64) => {}, // Fired after every stroke or type input
    onClear:  ()       => {}, // Fired when clear() is called (non-silent)
    onBegin:  (stroke) => {}, // Fired on pointerdown (stroke in progress)
    onEnd:    (stroke) => {}, // Fired on pointerup (stroke committed)
});
```

### Instance Methods

```
sig.toBase64()          // Export as PNG data URL (uses instance format)
sig.toBase64('png')     // Export as PNG data URL
sig.toBase64('svg')     // Export as SVG data URL (rebuilt from stored strokes)

sig.isEmpty()           // → boolean - true if no strokes drawn
sig.clear()             // Clear all strokes (undoable)
sig.clear(true)         // Silent clear - no redo history, no callbacks
sig.undo()              // Remove last stroke → move to redo stack
sig.redo()              // Restore last undone stroke
sig.disable()           // Lock the pad
sig.enable()            // Unlock the pad
sig.destroy()           // Remove all events and disconnect ResizeObserver
```

### Options Reference

[table striped="true"]
| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `height` | number | 180 | Canvas height in px |
| `label` | string | 'Signature' | Toolbar label |
| `placeholder` | string | 'Sign here' | Canvas placeholder text |
| `guideLine` | boolean | true | Show dashed baseline |
| `toolbar` | boolean | true | Show/hide entire toolbar |
| `penColour` | string | '#000000' | Default pen colour (CSS colour value) |
| `penWidth` | number | 2 | Default pen width in px |
| `colours` | string[] | ['#000',…] | Colour swatches in toolbar |
| `widths` | number[] | [1,2,4] | Width options in toolbar |
| `format` | 'png'\|'svg' | 'png' | Default export format |
| `name` | string | 'signature' | Hidden input name attribute |
| `disabled` | boolean | false | Start in disabled state |
| `typeFallback` | boolean | false | Show Draw/Type mode toggle |
| `minStrokeLength` | number | 3 | Minimum pointer events to commit a stroke |
| `onChange` | function | null | Called with base64 after each change |
| `onClear` | function | null | Called after a non-silent clear |
| `onBegin` | function | null | Called on pointerdown with stroke object |
| `onEnd` | function | null | Called on pointerup with stroke object |
[/table]

## Accessibility

- `role="application"` on the container with an `aria-label`
- All toolbar buttons use `<button>` with `aria-label` and `aria-pressed`
- The status bar uses `aria-live="polite"` to announce state changes (Signing…, Signature captured, Signature cleared)
- `typeFallback: true` provides a keyboard-accessible alternative to drawing
- `tabindex="0"` on the canvas allows focus; use `:focus-visible` ring for visibility
- `respectMotionPreference: true` (default) disables transitions for users who prefer reduced motion

## Related Elements

[showcase-demo id="showcase/elements/signature/related-elements" title="Related Elements" /]
