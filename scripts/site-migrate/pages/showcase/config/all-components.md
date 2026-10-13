---
title: All Config Engine Components
description: "Complete reference of the 16 components that support $.setup() configuration"
layout: with-sidebar
status: published
sortOrder: 50
---

[hero title="All Config Engine Components" tagline="Complete reference of the 16 components that support $.setup() configuration" align="center"][/hero]

## Quick Reference

**Supported Components (16):** Can be configured via `$.setup()`

[grid cols="2" gap="3" class="config-component-list"]
[col]
[box padding="compact" rounded="sm" hover="off" class="h-full"]
[badge variant="primary" pill]card[/badge]

Content containers with hover and click behaviour.
[/box]
[/col]
[col]
[box padding="compact" rounded="sm" hover="off" class="h-full"]
[badge variant="primary" pill]modal[/badge]

Overlays for focused tasks and dialogs.
[/box]
[/col]
[col]
[box padding="compact" rounded="sm" hover="off" class="h-full"]
[badge variant="primary" pill]tabs[/badge]

Switch between panels without leaving the page.
[/box]
[/col]
[col]
[box padding="compact" rounded="sm" hover="off" class="h-full"]
[badge variant="primary" pill]accordion[/badge]

Expand and collapse groups of content.
[/box]
[/col]
[col]
[box padding="compact" rounded="sm" hover="off" class="h-full"]
[badge variant="primary" pill]tooltip[/badge]

Small hints beside controls or links.
[/box]
[/col]
[col]
[box padding="compact" rounded="sm" hover="off" class="h-full"]
[badge variant="primary" pill]carousel[/badge]

Browse a sequence of slides or images.
[/box]
[/col]
[col]
[box padding="compact" rounded="sm" hover="off" class="h-full"]
[badge variant="primary" pill]dropdown[/badge]

Open menus and choose from a list.
[/box]
[/col]
[col]
[box padding="compact" rounded="sm" hover="off" class="h-full"]
[badge variant="primary" pill]badge[/badge]

Highlight a status, label or count.
[/box]
[/col]
[col]
[box padding="compact" rounded="sm" hover="off" class="h-full"]
[badge variant="primary" pill]backToTop[/badge]

Return to the top of a long page.
[/box]
[/col]
[col]
[box padding="compact" rounded="sm" hover="off" class="h-full"]
[badge variant="primary" pill]buttonGroup[/badge]

Keep related actions or toggles together.
[/box]
[/col]
[col]
[box padding="compact" rounded="sm" hover="off" class="h-full"]
[badge variant="primary" pill]loader[/badge]

Show progress while content is loading.
[/box]
[/col]
[col]
[box padding="compact" rounded="sm" hover="off" class="h-full"]
[badge variant="primary" pill]breadcrumbs[/badge]

Show the path to the current page.
[/box]
[/col]
[col]
[box padding="compact" rounded="sm" hover="off" class="h-full"]
[badge variant="primary" pill]navbar[/badge]

Build the main site navigation.
[/box]
[/col]
[col]
[box padding="compact" rounded="sm" hover="off" class="h-full"]
[badge variant="primary" pill]notification[/badge]

Show desktop notifications with permission.
[/box]
[/col]
[col]
[box padding="compact" rounded="sm" hover="off" class="h-full"]
[badge variant="primary" pill]timer[/badge]

Count down and act when time runs out.
[/box]
[/col]
[col]
[box padding="compact" rounded="sm" hover="off" class="h-full"]
[badge variant="primary" pill]alarm[/badge]

Schedule a notification for a set time.
[/box]
[/col]
[/grid]

**Not Supported (9):** Must use direct initialisation

[grid cols="2" gap="3" class="config-component-list"]
[col]
[box padding="compact" rounded="sm" hover="off" class="h-full"]
[badge variant="secondary" pill]autocomplete[/badge]

Suggest matching values while typing.
[/box]
[/col]
[col]
[box padding="compact" rounded="sm" hover="off" class="h-full"]
[badge variant="secondary" pill]pillbox[/badge]

Select and manage multiple tagged values.
[/box]
[/col]
[col]
[box padding="compact" rounded="sm" hover="off" class="h-full"]
[badge variant="secondary" pill]toast[/badge]

Show a brief success, warning or error message.
[/box]
[/col]
[col]
[box padding="compact" rounded="sm" hover="off" class="h-full"]
[badge variant="secondary" pill]dialog[/badge]

Ask for confirmation or a short response.
[/box]
[/col]
[col]
[box padding="compact" rounded="sm" hover="off" class="h-full"]
[badge variant="secondary" pill]treeView[/badge]

Browse nested items in a hierarchy.
[/box]
[/col]
[col]
[box padding="compact" rounded="sm" hover="off" class="h-full"]
[badge variant="secondary" pill]hero[/badge]

Introduce a page with a prominent heading.
[/box]
[/col]
[col]
[box padding="compact" rounded="sm" hover="off" class="h-full"]
[badge variant="secondary" pill]themeRoller[/badge]

Explore and customise theme colours.
[/box]
[/col]
[col]
[box padding="compact" rounded="sm" hover="off" class="h-full"]
[badge variant="secondary" pill]pageRoller[/badge]

Build a page from reusable sections.
[/box]
[/col]
[col]
[box padding="compact" rounded="sm" hover="off" class="h-full"]
[badge variant="secondary" pill]editor[/badge]

Write and format rich text content.
[/box]
[/col]
[/grid]

## Supported 1. card

**Purpose:** Interactive container elements with hover effects and click handling

```javascript
$.setup({
  '.demo-card': {
    component: 'card',
    options: {
      hoverable: true,
      shadow: 'medium',
      onClick: () => console.log('Card clicked!')
    }
  }
});
```

[showcase-demo id="showcase/config/all-components/supported-1-card" title="Supported 1. card" /]

## Supported 2. modal

**Purpose:** Dialog overlays with backdrop, keyboard support, and animations

```javascript
$.setup({
  '#demo-modal': {
    component: 'modal',
    options: {
      backdrop: true,
      backdropClose: true,
      keyboard: true,
      animation: 'fade'
    }
  }
});
```

[showcase-demo id="showcase/config/all-components/supported-2-modal" title="Supported 2. modal" /]

## Supported 3. tabs

**Purpose:** Tabbed content panels with animation support

```javascript
$.setup({
  '#demo-tabs': {
    component: 'tabs',
    options: {
      activeIndex: 0,
      animation: 'fade'
    }
  }
});
```

[showcase-demo id="showcase/config/all-components/supported-3-tabs" title="Supported 3. tabs" /]

## Supported 4. accordion

**Purpose:** Collapsible content sections with single or multi-expand modes

```javascript
$.setup({
  '#demo-accordion': {
    component: 'accordion',
    options: {
      multiExpand: false,
      animation: 'slide'
    }
  }
});
```

[showcase-demo id="showcase/config/all-components/supported-4-accordion" title="Supported 4. accordion" /]

## Supported 5. tooltip

**Purpose:** Contextual popups on hover or click with multiple positioning options

```javascript
$.setup({
  '[data-tooltip]': {
    component: 'tooltip',
    options: {
      position: 'top',
      trigger: 'hover',
      delay: 200
    }
  }
});
```

[showcase-demo id="showcase/config/all-components/supported-5-tooltip" title="Supported 5. tooltip" /]

## Supported 6. carousel

**Purpose:** Image/content slider with autoplay, indicators, and navigation arrows

```javascript
$.setup({
  '#demo-carousel': {
    component: 'carousel',
    options: {
      autoplay: true,
      interval: 3000,
      loop: true,
      showArrows: true,
      showIndicators: true
    }
  }
});
```

[showcase-demo id="showcase/config/all-components/supported-6-carousel" title="Supported 6. carousel" /]

## Supported 7. dropdown

**Purpose:** Dropdown menus with positioning and selection handling

```javascript
$.setup({
  '#demo-dropdown': {
    component: 'dropdown',
    options: {
      items: [
        { text: 'Edit', value: 'edit' },
        { text: 'Duplicate', value: 'duplicate' },
        { divider: true },
        { text: 'Delete', value: 'delete', class: 'text-danger' }
      ],
      placement: 'bottom',
      closeOnSelect: true
    }
  }
});
```

[showcase-demo id="showcase/config/all-components/supported-7-dropdown" title="Supported 7. dropdown" /]

## Supported 8. badge

**Purpose:** Status indicators and labels with variant styles

```javascript
$.setup({
  '.demo-badge': {
    component: 'badge',
    options: {
      variant: 'primary',
      rounded: true
    }
  }
});
```

[showcase-demo id="showcase/config/all-components/supported-8-badge" title="Supported 8. badge" /]

## Supported 9. backToTop

**Purpose:** Scroll-to-top button that appears after scrolling down

```javascript
$.setup({
  '#back-to-top': {
    component: 'backToTop',
    options: {
      showAfter: 300,
      duration: 500,
      position: 'bottom-right'
    }
  }
});
```

[showcase-demo id="showcase/config/all-components/supported-9-backtotop" title="Supported 9. backToTop" /]

## Supported 10. buttonGroup

**Purpose:** Radio/checkbox style button groups with single or multi-select

```javascript
$.setup({
  '#demo-btngroup': {
    component: 'buttonGroup',
    options: {
      mode: 'single',  // or 'multiple'
      activeClass: 'active'
    }
  }
});
```

[showcase-demo id="showcase/config/all-components/supported-10-buttongroup" title="Supported 10. buttonGroup" /]

## Supported 11. loader

**Purpose:** Loading indicators with multiple animation types

```javascript
$.setup({
  '#demo-loader-container': {
    component: 'loader',
    options: {
      type: 'spinner',
      size: 'medium',
      overlay: true,
      text: 'Loading...'
    }
  }
});
```

[showcase-demo id="showcase/config/all-components/supported-11-loader" title="Supported 11. loader" /]

## Supported 12. breadcrumbs

**Purpose:** Navigation trail showing current page location

```javascript
$.setup({
  '#demo-breadcrumbs': {
    component: 'breadcrumbs',
    options: {
      items: [
        {text: 'Home', url: '#'},
        {text: 'Showcase', url: '#'},
        {text: 'Config Engine', active: true}
      ],
      separator: '/'
    }
  }
});
```

[showcase-demo id="showcase/config/all-components/supported-12-breadcrumbs" title="Supported 12. breadcrumbs" /]

## Supported 13. navbar

**Purpose:** Responsive navigation bar with brand, menu items, and actions

```javascript
$.setup({
  '#demo-navbar': {
    component: 'navbar',
    options: {
      brand: {text: 'Domma', url: '#'},
      items: [
        {text: 'Home', url: '#', active: true},
        {text: 'Docs', url: '#'},
        {text: 'Examples', url: '#'}
      ],
      variant: 'light'
    }
  }
});
```

[showcase-demo id="showcase/config/all-components/supported-13-navbar" title="Supported 13. navbar" /]

## Supported 14. notification

**Purpose:** Desktop browser notifications (requires permission)

```javascript
$.setup({
  '#request-notification-btn': {
    events: {
      click: async () => {
        if ('Notification' in window) {
          const permission = await Notification.requestPermission();
          if (permission === 'granted') {
            Domma.elements.notify('Domma Notification', {
              body: 'Desktop notification configured via $.setup()!',
              icon: '../../assets/logo/domma-icon.svg'
            });
          }
        }
      }
    }
  }
});
```

[showcase-demo id="showcase/config/all-components/supported-14-notification" title="Supported 14. notification" /]

## Supported 15. timer

**Purpose:** Countdown timer with optional visual display and controls

```javascript
$.setup({
  '#demo-timer': {
    component: 'timer',
    options: {
      duration: 60000,  // 60 seconds
      format: 'mm:ss',
      showControls: true,
      autoStart: false
    }
  }
});
```

[showcase-demo id="showcase/config/all-components/supported-15-timer" title="Supported 15. timer" /]

## Supported 16. alarm

**Purpose:** Scheduled time-based alerts with localStorage persistence

```javascript
$.setup({
  '#demo-alarm': {
    component: 'alarm',
    options: {
      alarms: [
        {
          time: '09:00',
          label: 'Morning Meeting',
          repeat: 'weekdays',
          enabled: true
        }
      ],
      storageKey: 'demo-alarms'
    }
  }
});
```

[showcase-demo id="showcase/config/all-components/supported-16-alarm" title="Supported 16. alarm" /]

## Not Supported Components Requiring Direct Init

These components cannot be configured via `$.setup()` and must be initialized directly.

### autocomplete

**Why:** Complex data binding and async data sources

```javascript
// Use direct init
const ac = Domma.elements.autocomplete('#search', {
  data: ['Apple', 'Banana', 'Cherry'],
  onSelect: (val) => console.log(val)
});
```

### pillbox

**Why:** Advanced multi-select state management

```javascript
// Use direct init
const pb = Domma.elements.pillbox('#tags', {
  data: ['React', 'Vue', 'Angular'],
  creatable: true
});
```

### toast

**Why:** Ephemeral notifications (no persistent DOM element)

```javascript
// Use static method
Domma.elements.toast('Success!', {
  type: 'success',
  duration: 3000
});
```

### dialog (alert, confirm, prompt)

**Why:** Promise-based programmatic APIs

```javascript
// Use static methods
const ok = await Domma.elements.confirm('Delete?');
const name = await Domma.elements.prompt('Name:');
```

### treeView

**Why:** Hierarchical data requires direct data binding

```javascript
// Use direct init
const tree = Domma.elements.treeView('#tree', {
  items: [{label: 'Parent', children: [...]}]
});
```

### hero

**Why:** CSS-only component (no JavaScript)

```html
  Hero Section
```

### themeRoller / pageRoller / editor

**Why:** Developer tools (in tools bundle, not main bundle)

```javascript
// Load domma-tools.min.js first
const roller = Domma.elements.themeRoller('#container');
const editor = Domma.elements.editor('#editor');
```

## When to Use Config Engine vs. Direct Init

### ✓ Use $.setup() for:

- Static component initialisation
- Multiple similar components
- Simple setup scenarios
- Layout-based components
- Components with persistent DOM elements
- Declarative configuration approach

### ✓ Use Direct Init for:

- Dynamic data sources
- Complex interactions
- Conditional setup logic
- Ephemeral/temporary components
- Promise-based workflows
- Components requiring runtime data
