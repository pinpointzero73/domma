---
title: Focus Trap
description: "Keep Tab, Shift+Tab and stray focus inside a panel while it is open - and hand focus back when it closes"
layout: with-sidebar
status: published
sortOrder: 50
---

[hero title="Focus Trap" tagline="Keep Tab, Shift+Tab and stray focus inside a panel while it is open - and hand focus back when it closes" align="center"][/hero]

## Overview

`E.focusTrap()` is the piece every overlay needs and few get right: while a dialog, drawer or palette is open, a keyboard user must not Tab out into the page behind it. The trap wraps Tab from the last control to the first (and Shift+Tab back), pulls focus back in if a click or a script moves it out, and on deactivation returns focus to whatever had it before.

### Key Features

- **Live** - tabbable elements are found on every key press, so controls added later take part
- **Correct skipping** - disabled, hidden, `inert`, invisible and `tabindex="-1"` elements; one stop per radio group
- **Shadow roots** - open shadow trees are walked in render order, slotted children at their slot
- **Empty panels** - with nothing tabbable the container itself takes focus
- **Stacks** - a second trap pauses the first; closing it hands back to the first
- **Optional inert** - `inert: true` shuts the rest of the page off for pointers and screen readers too

### Basic Usage

```
const trap = E.focusTrap('#panel', {initialFocus: '#name'});
trap.activate();     // focus moves in, Tab wraps
trap.deactivate();   // focus goes back to the button that opened it
```

## Trap a panel

Activate the trap, then press Tab a few times: focus goes round the three controls and never reaches the rest of the page. **Done** deactivates it and focus returns to the Activate button. The **Add a button** control shows that new controls join the cycle.

[showcase-demo id="showcase/elements/focus-trap/trap-a-panel" title="Trap a panel" /]

```
const trap = E.focusTrap('#basic-panel', {
    initialFocus: '#basic-name',
    onActivate:   () => $('#basic-panel').addClass('is-trapping'),
    onDeactivate: () => $('#basic-panel').removeClass('is-trapping')
});
$('#basic-on').on('click', () => trap.activate());
$('#basic-done').on('click', () => trap.deactivate());
// later: trap.destroy();
```
## Stacked traps

Traps keep a stack. Activate the outer panel, then the inner one from inside it: the outer trap pauses. Closing the inner panel unpauses the outer one and puts focus back on the button that opened it - exactly what a confirm dialog over a form needs.

[showcase-demo id="showcase/elements/focus-trap/stacked-traps" title="Stacked traps" /]

```
const outer = E.focusTrap('#outer-panel');
const inner = E.focusTrap('#inner-panel');
outer.activate();
inner.activate();    // outer.isPaused() === true
inner.deactivate();  // outer listens again; focus back on "Activate inner"
```

## Escape, outside clicks and inert

By default the trap ignores Escape (the overlay that owns it decides what Escape means) and blocks clicks outside. This panel turns on `escapeDeactivates` and `clickOutsideDeactivates`, and `inert: true` - while it is active the rest of the page is `inert`, so a screen reader's virtual cursor cannot reach it either. It has nothing tabbable inside, so the panel itself takes focus.

[showcase-demo id="showcase/elements/focus-trap/escape-outside-clicks-and-inert" title="Escape, outside clicks and inert" /]

```
E.focusTrap('#opts-panel', {
    escapeDeactivates: true,
    clickOutsideDeactivates: true,
    inert: true
}).activate();
```

## Events

`activate`, `deactivate`, `pause` and `unpause` - as `onX` options, `.on('x')` and `dm:focus-trap:x` DOM events on the (first) container. The DOM events bubble, so this log hears both traps with one handler on the demo: open the confirm to see the form trap pause, and close it to see it unpause.

[showcase-demo id="showcase/elements/focus-trap/events" title="Events" /]

```
const events = 'dm:focus-trap:activate dm:focus-trap:deactivate dm:focus-trap:pause dm:focus-trap:unpause';
$('#demo').on(events, (e) => console.log(e.type, e.detail.instance.element.id));
```

## API

```
// containers: a selector, an element or an array; null when nothing matched
const trap = E.focusTrap(containers, {
    initialFocus,                   // selector | element | () => element | false
    fallbackFocus,                  // when nothing is tabbable (default: the container)
    returnFocus: true,              // true | false | selector | element
    escapeDeactivates: false,       // boolean | (event) => boolean
    clickOutsideDeactivates: false, // boolean | (event) => boolean
    allowOutsideClick: false,       // boolean | (event) => boolean - false blocks them
    allowOutsideFocus: false,       // true | 'layers' (toasts, popovers...) | (el, event) => boolean
    allowScriptFocus: false,        // a handler inside may move focus out on purpose
    inert: false,
    shadow: true,                   // walk open shadow roots
    preventScroll: true,
    register: true,                 // false keeps E.get(container) on its owner
    onActivate, onDeactivate, onPause, onUnpause
});

trap.activate({initialFocus}); trap.deactivate({returnFocus: false});
trap.pause(); trap.unpause({focus: false});
trap.updateContainers(['#dialog', '#toolbar']);
trap.containers(); trap.isActive(); trap.isPaused(); trap.tabbables(); trap.destroy();

E.focusTrap.tabbables(el);   // what Tab would reach, in order
E.focusTrap.top();           // the trap that currently listens
```
