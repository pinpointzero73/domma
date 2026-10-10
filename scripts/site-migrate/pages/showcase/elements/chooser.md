---
title: Chooser
description: "Visual option-picker - card or chip variants, single or multi-select, with icons, descriptions, badges, tooltips and recommendations."
layout: with-sidebar
status: published
sortOrder: 50
---

[hero title="Chooser" tagline="Visual option-picker - card or chip variants, single or multi-select, with icons, descriptions, badges, tooltips and recommendations." align="center"][/hero]

## Overview

The Chooser component renders a set of options as visually rich, click-to-select tiles. A single component covers four combinations driven by blueprint parameters: cards or chips, single or multi-select. Each option supports icons, descriptions, tooltips, badges, and "recommended" / "disabled" states.

### Key Features

- **Two visual variants** - cards (rich tiles) or chips (compact pills)
- **Single or multi-select** - radio or checkbox semantics from one option
- **Density control** - comfortable (with description) or compact (label only)
- **Per-option metadata** - icon, description, tooltip, badge, recommended, disabled
- **Theme-aware** - uses Domma CSS variables; retints automatically across all themes
- **Full keyboard support** - arrows for radio, tab+space for checkbox; disabled options skipped
- **Native form integration** - hidden inputs degrade gracefully when JS is unavailable
- **Blueprint-driven** - drop into `F.create()` with `type: 'chooser'`

### When to Use

- Pricing-plan pickers with descriptions and "POPULAR" badges
- Feature-toggle multi-select with icons
- Tag pickers (chip variant) for categorisation
- Theme/skin pickers with compact density
- Anywhere a native radio/checkbox feels visually weak for the choice at hand

### Basic Usage

```
// Standalone
Domma.elements.chooser('#host', {
    variant: 'card',
    options: [
        { value: 'a', label: 'Alpha', icon: 'rocket' },
        { value: 'b', label: 'Beta',  icon: 'zap' }
    ],
    onChange: (v) => console.log('Picked:', v)
});

// Inside a form blueprint
Domma.forms.create({
    plan: {
        type: 'chooser',
        variant: 'card',
        label: 'Choose your plan',
        options: […]
    }
}).renderTo('#my-form');
```

## The four matrix combinations

All four `variant × multiple` combinations share the same component and parameter surface. Click to select.

[showcase-demo id="showcase/elements/chooser/the-four-matrix-combinations" title="The four matrix combinations" /]

## Density

Comfortable shows the description; compact strips it for dense layouts.

[showcase-demo id="showcase/elements/chooser/density" title="Density" /]

```
{ variant: 'card', density: 'compact', columns: 4 }
```

## Columns

The card variant accepts `columns: 1-6`. Chips wrap freely.

### 1 column

[showcase-demo id="showcase/elements/chooser/1-column" title="1 column" /]

### 2 columns

[showcase-demo id="showcase/elements/chooser/2-columns" title="2 columns" /]

### 3 columns

[showcase-demo id="showcase/elements/chooser/3-columns" title="3 columns" /]

### 4 columns

[showcase-demo id="showcase/elements/chooser/4-columns" title="4 columns" /]

### 6 columns

[showcase-demo id="showcase/elements/chooser/6-columns" title="6 columns" /]

## Per-option flags

Each option supports rich metadata. Flags are independent - combine freely.

### icon

[showcase-demo id="showcase/elements/chooser/icon" title="icon" /]

```
{ value: 'a', label: 'Alpha', icon: 'rocket' }
```

### description

[showcase-demo id="showcase/elements/chooser/description" title="description" /]

```
{ value: 'a', label: 'Alpha', description: 'Sub-text under the label' }
```

### tooltip

Hover any option to see its tooltip.

[showcase-demo id="showcase/elements/chooser/tooltip" title="tooltip" /]

```
{ value: 'a', label: 'Alpha', tooltip: 'Helpful hover hint' }
```

### badge - five types

[showcase-demo id="showcase/elements/chooser/badge-five-types" title="badge - five types" /]

```
{ value: 'a', label: 'Alpha', badge: { text: 'NEW', type: 'success' } }
```

### recommended

[showcase-demo id="showcase/elements/chooser/recommended" title="recommended" /]

```
{ value: 'b', label: 'Beta', recommended: true }   // success-coloured ring
```

### disabled

[showcase-demo id="showcase/elements/chooser/disabled" title="disabled" /]

```
{ value: 'c', label: 'Gamma', disabled: true }     // muted, non-interactive
```

## Visual options - accent, accent-style, glow, shadow

Six new options polish the look of every chooser. All accept semantic colour names (`primary`, `success`, `info`, `warning`, `danger`) or any custom hex/rgb value.

### accent - selected/recommended highlight colour

Five semantic colours and a custom hex example.

### primary (default)

[showcase-demo id="showcase/elements/chooser/primary-default" title="primary (default)" /]

### success

[showcase-demo id="showcase/elements/chooser/success" title="success" /]

### info

[showcase-demo id="showcase/elements/chooser/info" title="info" /]

### warning

[showcase-demo id="showcase/elements/chooser/warning" title="warning" /]

### danger

[showcase-demo id="showcase/elements/chooser/danger" title="danger" /]

### custom hex (#9333ea)

[showcase-demo id="showcase/elements/chooser/custom-hex-9333ea" title="custom hex (#9333ea)" /]

```
{ accent: 'success' }     // semantic
{ accent: '#9333ea' }     // custom hex
```

### accentStyle - five visual treatments for the selected state

### border (default) - coloured border + tinted bg

[showcase-demo id="showcase/elements/chooser/border-default-coloured-border-tinted-bg" title="border (default) - coloured border + tinted bg" /]

### solid - fully filled tile

[showcase-demo id="showcase/elements/chooser/solid-fully-filled-tile" title="solid - fully filled tile" /]

### glow - transparent border + glowing ring

[showcase-demo id="showcase/elements/chooser/glow-transparent-border-glowing-ring" title="glow - transparent border + glowing ring" /]

### overlay - heavier translucent fill

[showcase-demo id="showcase/elements/chooser/overlay-heavier-translucent-fill" title="overlay - heavier translucent fill" /]

### underline - minimal: thick coloured bottom border

[showcase-demo id="showcase/elements/chooser/underline-minimal-thick-coloured-bottom-border" title="underline - minimal: thick coloured bottom border" /]

```
{ accentStyle: 'solid' }   // 'border' | 'solid' | 'glow' | 'overlay' | 'underline'
```

### glow - soft outer glow on the selected option

### glow only (uses accent colour)

[showcase-demo id="showcase/elements/chooser/glow-only-uses-accent-colour" title="glow only (uses accent colour)" /]

### glow with custom `glowColour: 'info'`

[showcase-demo id="showcase/elements/chooser/glow-with-custom-glowcolour-info" title="glow with custom glowColour: 'info'" /]

### glow with custom hex `glowColour: '#ff66cc'`

[showcase-demo id="showcase/elements/chooser/glow-with-custom-hex-glowcolour-ff66cc" title="glow with custom hex glowColour: '#ff66cc'" /]

```
{ glow: true }                       // glow uses accent colour
{ glow: true, glowColour: 'info' }   // override with semantic name
{ glow: true, glowColour: '#ff66cc' } // or any hex/rgb
```

### shadow - depth on every option

### sm

[showcase-demo id="showcase/elements/chooser/sm" title="sm" /]

### md

[showcase-demo id="showcase/elements/chooser/md" title="md" /]

### lg

[showcase-demo id="showcase/elements/chooser/lg" title="lg" /]

### xl

[showcase-demo id="showcase/elements/chooser/xl" title="xl" /]

### xl with custom shadow colour

[showcase-demo id="showcase/elements/chooser/xl-with-custom-shadow-colour" title="xl with custom shadow colour" /]

```
{ shadow: 'md' }
{ shadow: 'xl', shadowColour: 'rgba(99, 102, 241, 0.35)' }
```

### All together

Combine glow + shadow + custom accent + a non-default style for a full look.

[showcase-demo id="showcase/elements/chooser/all-together" title="All together" /]

```
{
    accent: '#ec4899',
    accentStyle: 'glow',
    glow: true,
    glowColour: '#ec4899',
    shadow: 'lg'
}
```

## Theme awareness

The chooser uses Domma's CSS variables. Switch theme + variant below - the chooser retints live with no JavaScript redraw.

[showcase-demo id="showcase/elements/chooser/theme-awareness" title="Theme awareness" /]

## Accessibility & keyboard

- **Single-select** uses `role="radiogroup"`; arrow keys move and select; Enter/Space confirm
- **Multi-select** uses `role="group"`; Tab between options; Space toggles
- **Disabled options are skipped** by arrow navigation and cannot be toggled by keyboard
- `aria-checked` reflects each option's selection state for screen readers
- Hidden native `<input type="radio|checkbox">` elements are emitted when `name` is set so the value is captured by `FormData` even with JS disabled

### Try it: focus the picker, then use ArrowRight / ArrowLeft

[showcase-demo id="showcase/elements/chooser/try-it-focus-the-picker-then-use-arrowright-arro" title="Try it: focus the picker, then use ArrowRight / ArrowLeft" /]

## Inside a form (F.create)

Use `type: 'chooser'` in your blueprint and the rest works automatically - validation, model binding, submission.

[showcase-demo id="showcase/elements/chooser/inside-a-form-f-create" title="Inside a form (F.create)" /]

```
const form = Domma.forms.create({
    plan: {
        type: 'chooser',
        variant: 'card',
        label: 'Choose your plan',
        required: true,
        options: [
            { value: 'starter', label: 'Starter', icon: 'rocket', description: 'For solo builders.' },
            { value: 'pro',     label: 'Pro',     icon: 'zap',     description: 'Teams up to 10.', recommended: true,
              badge: { text: 'POPULAR', type: 'success' } },
            { value: 'ent',     label: 'Enterprise', icon: 'briefcase', description: 'Custom limits + SSO.' }
        ]
    },
    addons: {
        type: 'chooser',
        variant: 'chip',
        multiple: true,
        label: 'Optional add-ons',
        options: [
            { value: 'sso',    label: 'SSO',    icon: 'lock' },
            { value: 'audit',  label: 'Audit log', icon: 'file-text' },
            { value: 'sla',    label: '24/7 SLA', icon: 'phone' }
        ]
    }
});
form.renderTo('#my-form');
```

## Standalone usage (E.chooser)

Outside of a form, instantiate the chooser directly. The control object exposes `getValue()`, `setValue()`, `disable()`, `enable()`, `destroy()`.

[showcase-demo id="showcase/elements/chooser/standalone-usage-e-chooser" title="Standalone usage (E.chooser)" /]

## Tutorial

### When to reach for a chooser

Use a chooser instead of a native `<input type="radio">` or `<input type="checkbox">` when the choice itself deserves visual weight - pricing plans, feature toggles, theme selection, tag pickers. Native controls are perfect for terse forms; the chooser is for surfaces where the option's identity (icon + label + description) is part of the experience.

### Blueprint shape

Inside a form blueprint:

```
fieldName: {
    type: 'chooser',                    // required - selects this control
    variant: 'card' | 'chip',           // visual style (default: 'card')
    multiple: false | true,             // single (radio) vs multi (checkbox); default false
    density: 'comfortable' | 'compact', // default 'comfortable'
    columns: 1..6,                      // grid columns for cards (chips wrap); default 3
    required: false | true,             // standard form flag
    label: 'Field label',               // standard form flag
    default: 'value' | ['v1', 'v2'],    // initial selection (string for single, array for multi)
    options: [
        {
            value: 'unique-id',         // required
            label: 'Visible label',     // required
            icon: 'icon-name',          // optional - Domma icon
            description: 'Sub-text',    // optional - card+comfortable only
            tooltip: 'Hover hint',      // optional
            badge: {                    // optional - corner badge
                text: 'POPULAR',
                type: 'success'         // primary | success | info | warning | danger
            },
            recommended: true,          // optional - success-coloured ring
            disabled: true              // optional - muted, non-interactive
        }
    ]
}
```

### Common patterns

### 1. Pricing-plan picker

```
plan: {
    type: 'chooser', variant: 'card', columns: 3, required: true,
    options: [
        { value: 'starter', label: 'Starter', icon: 'rocket',
          description: 'For solo builders.' },
        { value: 'pro',     label: 'Pro',     icon: 'zap',
          description: 'Teams up to 10.',
          recommended: true,
          badge: { text: 'POPULAR', type: 'success' } },
        { value: 'ent',     label: 'Enterprise', icon: 'briefcase',
          description: 'Custom limits + SSO.' }
    ]
}
```

### 2. Tag picker (multi-select chips)

```
tags: {
    type: 'chooser', variant: 'chip', multiple: true,
    options: [
        { value: 'js',   label: 'JavaScript', icon: 'code' },
        { value: 'css',  label: 'CSS',        icon: 'palette' },
        { value: 'a11y', label: 'A11y',       icon: 'eye' },
        { value: 'wasm', label: 'WASM',       icon: 'cpu', disabled: true }
    ]
}
```

### 3. Compact theme picker

```
theme: {
    type: 'chooser', variant: 'card', density: 'compact', columns: 4,
    options: [
        { value: 'charcoal', label: 'Charcoal', icon: 'moon' },
        { value: 'ocean',    label: 'Ocean',    icon: 'droplet' },
        { value: 'forest',   label: 'Forest',   icon: 'leaf' },
        { value: 'sunset',   label: 'Sunset',   icon: 'sun' }
    ]
}
```

### Gotchas

- **Description only renders** when `variant: 'card'` and `density: 'comfortable'`. Chips ignore it; compact strips it.
- **Columns is a card-only prop.** Chips wrap freely on a flex row.
- **Value type follows `multiple`.** Single-select stores a string; multi-select stores an array of strings. The form pipeline handles both.
- **Required for multi-select** means at least one option must be selected (empty array is invalid).
- **Disabled options are non-interactive end to end** - click ignored, keyboard skipped, hidden native input also disabled.
- **Tooltip uses `data-tooltip`**; combine with `E.tooltip()` if you want full Domma tooltip styling on hover.
