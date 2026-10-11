---
title: Input Addons
description: "Icons and text joined to the start or end of a field - a magnifier, a currency sign, a unit - with formConfig.prefix and suffix or E.inputGroup()."
layout: with-sidebar
status: published
sortOrder: 50
---

[hero title="Input Addons" tagline="Icons and text joined to a field, sharing its border, focus ring and error colours" align="center"][/hero]

## Overview

An addon is an icon or a little text joined to the start or end of a field - a magnifier on a search box, "£" on a price, "kg" on a weight. The addon and the field share one border and one rounded outline, so they read as a single control: the focus ring goes round the whole group, and the addon takes the focus and error colours along with the field. Each addon is as wide as what it holds, so "£" and "https://" both fit.

In a Forma blueprint set `formConfig.prefix` and/or `formConfig.suffix`. It works on single-line inputs, selects and textareas. For an input that is already on the page, use `E.inputGroup()` - it writes exactly the same markup.

### What a slot can be

[table striped="true"]
| Value | Renders | Where |
| --- | --- | --- |
| `{icon: 'search'}` | A Domma icon (a plain icon name only) | Forma and `E.inputGroup` |
| `{text: '£'}` | Text, set as text - never parsed as HTML | Forma and `E.inputGroup` |
| `'kg'` | Shorthand for `{text: 'kg'}` | Forma and `E.inputGroup` |
| `{html: '<kbd>K</kbd>'}` | Raw HTML - you are responsible for what goes in | Forma only |
[/table]

Addons are decoration: clicks pass straight through to the field, and they are hidden from screen readers, so the field's label should still say what it is for.

### Interactive extras

Four extras are real controls joined to the field in the same style - buttons you can click and tab to, each with an accessible name. The keys are the same in a blueprint's `formConfig` and in `E.inputGroup()`'s options, and they sit happily inside a prefix or suffix.

[table striped="true"]
| Key | Adds | Applies to |
| --- | --- | --- |
| `reveal: true` | An eye button that shows and hides the password | Password inputs |
| `clear: true` | An × that appears once there is a value and empties the field | Text-like inputs and textareas |
| `stepper: true` | − and + buttons that honour `min`, `max` and `step` | Number inputs |
| `counter: true \| 200` | "12 / 200" under the field, updated as you type | Text-like inputs and textareas |
[/table]

## Icon prefix - search field

[showcase-demo id="showcase/forms/input-addons/icon-prefix-search-field" title="Icon prefix - search field" /]

```
search: {
    type: 'text',
    label: 'Search',
    formConfig: {prefix: {icon: 'search'}, placeholder: 'Type to search...'}
}
```

## Text prefix and suffix - price field

[showcase-demo id="showcase/forms/input-addons/text-prefix-and-suffix-price-field" title="Text prefix and suffix - price field" /]

```
price: {
    type: 'number',
    label: 'Price',
    formConfig: {
        prefix: {text: '£'},
        suffix: {text: '.00'}
    }
}
```

## Units and schemes

The addon grows to fit its text, so a unit or a URL scheme sits beside the value without covering it.

[showcase-demo id="showcase/forms/input-addons/units-and-schemes" title="Units and schemes" /]

```
weight: {
    type: 'number',
    label: 'Parcel weight',
    formConfig: {suffix: {text: 'kg'}}
},
website: {
    type: 'string',
    label: 'Website',
    formConfig: {prefix: {text: 'https://'}, placeholder: 'example.com'}
}
```

## String shorthand

A plain string is shorthand for `{text: ...}`.

[showcase-demo id="showcase/forms/input-addons/string-shorthand" title="String shorthand" /]

```
salary: {
    type: 'number',
    label: 'Salary',
    formConfig: {prefix: '£', suffix: 'a year'}
}
```

## A select with an icon prefix

[showcase-demo id="showcase/forms/input-addons/a-select-with-an-icon-prefix" title="A select with an icon prefix" /]

```
country: {
    type: 'select',
    label: 'Country',
    options: [
        {value: 'gb', label: 'United Kingdom'},
        {value: 'ie', label: 'Ireland'},
        {value: 'fr', label: 'France'}
    ],
    formConfig: {prefix: {icon: 'globe'}}
}
```

## A textarea with a suffix

[showcase-demo id="showcase/forms/input-addons/a-textarea-with-a-suffix" title="A textarea with a suffix" /]

```
message: {
    type: 'textarea',
    label: 'Message',
    formConfig: {rows: 4, suffix: {icon: 'message-square'}}
}
```

## HTML suffix - keyboard hint

[showcase-demo id="showcase/forms/input-addons/html-suffix-keyboard-hint" title="HTML suffix - keyboard hint" /]

```
query: {
    type: 'text',
    label: 'Quick search',
    formConfig: {
        prefix: {icon: 'search'},
        suffix: {html: '<kbd>Ctrl K</kbd>'}
    }
}
```

## Icon prefix and icon suffix

[showcase-demo id="showcase/forms/input-addons/icon-prefix-and-icon-suffix" title="Icon prefix and icon suffix" /]

```
email: {
    type: 'email',
    label: 'Email',
    formConfig: {
        prefix: {icon: 'mail'},
        suffix: {icon: 'check-circle'}
    }
}
```

## E.inputGroup - on an input already on the page

The field below is a plain `<input class="form-input">` in this page's HTML. `E.inputGroup()` wraps it and joins the addons. The buttons change them with `update()`, take them away with `destroy()`, and bind the input again.

[showcase-demo id="showcase/forms/input-addons/e-inputgroup-on-an-input-already-on-the-page" title="E.inputGroup - on an input already on the page" /]

Current markup:

```

```

```
let group = E.inputGroup('#ig-demo', {prefix: '£', suffix: '.00'});

$('#ig-icon').on('click', () => group.update({prefix: {icon: 'tag'}}));
$('#ig-kg').on('click', () => group.update({suffix: 'kg'}));
$('#ig-no-suffix').on('click', () => group.update({suffix: null}));
$('#ig-destroy').on('click', () => group.destroy());
```

## Show / hide password

`reveal: true` adds an eye button that switches the field between hidden and plain text. It is a toggle button (`aria-pressed`), so a screen reader hears "Show password, toggle button, pressed". Clicking it leaves the caret in the field.

[showcase-demo id="showcase/forms/input-addons/show-hide-password" title="Show / hide password" /]

```
password: {
    type: 'password',
    label: 'Password',
    formConfig: {prefix: {icon: 'lock'}, reveal: true}
}
```

## Clear button

`clear: true` adds an × that shows only while the field has a value. Clicking it empties the field, fires `input` and `change` - so the form's model and any listener of your own see the change - and puts the focus back in the field. Here it sits beside an icon prefix; the last value the model saw is shown underneath.

[showcase-demo id="showcase/forms/input-addons/clear-button" title="Clear button" /]

```
search: {
    type: 'string',
    label: 'Search',
    formConfig: {prefix: {icon: 'search'}, clear: true, placeholder: 'Type, then clear'}
}
```

## Number stepper

`stepper: true` puts − and + either side of a number field. They step by the field's `step`, stop at `min` and `max` (the button at a limit is disabled), and fire `input` and `change` on every step. Hold a button down to keep stepping. Addons still go outside, as with the "£" and "per night" here.

[showcase-demo id="showcase/forms/input-addons/number-stepper" title="Number stepper" /]

```
guests: {
    type: 'integer',
    label: 'Guests',
    min: 1,
    max: 8,
    formConfig: {stepper: true}
},
rate: {
    type: 'number',
    label: 'Nightly rate',
    min: 0,
    max: 500,
    step: 12.5,
    formConfig: {prefix: '£', suffix: 'per night', stepper: true}
}
```

## Character counter

`counter: true` shows "12 / 200" under the field, using the field's `maxLength`; a number (`counter: 60`) sets the limit itself. It updates as you type, is announced politely to screen readers and is linked to the field with `aria-describedby`. It turns amber from 90% of the limit, and red if an explicit limit is passed.

[showcase-demo id="showcase/forms/input-addons/character-counter" title="Character counter" /]

```
headline: {
    type: 'string',
    label: 'Headline',
    formConfig: {counter: 60, clear: true}
},
bio: {
    type: 'textarea',
    label: 'Short bio',
    maxLength: 200,
    formConfig: {rows: 3, counter: true}
}
```

## Extras on inputs already on the page

The same four keys work with `E.inputGroup()` on hand-written inputs. The fields below are plain HTML; one call each joins the extras.

[showcase-demo id="showcase/forms/input-addons/extras-on-inputs-already-on-the-page" title="Extras on inputs already on the page" /]

```
E.inputGroup('#x-pw', {reveal: true});
E.inputGroup('#x-q', {prefix: {icon: 'filter'}, clear: true});
E.inputGroup('#x-qty', {stepper: true, suffix: 'boxes'});
E.inputGroup('#x-note', {counter: true, clear: true});   // true reads maxlength="40"
```

## Tutorial - joining an addon to your own input

### Step 1 - Write the input as usual

No wrapper markup needed. Give the input the usual `form-input` (or `form-select`) class and a label.

```
<label class="form-label" for="weight">Parcel weight</label>
<input id="weight" class="form-input" type="number">
```

### Step 2 - Join the addons

`E.inputGroup(selector, {prefix, suffix})` wraps the input in a `.input-group-icon` group and adds the addons. Each slot takes the same values as `formConfig.prefix`: an icon, text, or a string.

```
const weight = E.inputGroup('#weight', {suffix: 'kg'});
```

### Step 3 - Change or remove them later

`update()` changes either slot and leaves the other alone; `null` removes one. `destroy()` removes the addons and, if `E.inputGroup` made the wrapper, the wrapper too, leaving the input where it was.

```
$('#units').on('change', (e) => {
    weight.update({suffix: e.target.value === 'metric' ? 'kg' : 'lb'});
});

weight.update({prefix: {icon: 'package'}});   // add a prefix, keep the suffix
weight.update({prefix: null});                // and take it off again
weight.destroy();                             // back to a plain input
```

Binding an input that Forma already rendered with addons reuses Forma's group, so `E.inputGroup()` is also the way to change a blueprint field's addons after it is on screen.

### Step 4 - Add the extras

Pass `reveal`, `clear`, `stepper` or `counter` alongside (or instead of) the addons. An extra the input cannot take is skipped - `reveal` needs a password, `stepper` a number - so a shared options object is safe.

```
const qty = E.inputGroup('#qty', {stepper: true, suffix: 'boxes'});
const note = E.inputGroup('#note', {counter: 120, clear: true});

qty.step(1);                       // step from code, as the + button does
note.update({clear: false});       // extras come and go through update() too
```

### Step 5 - Set values from code

The extras follow the field's `input` and `change` events and a form reset. If you set `value` from code without firing an event, call `refresh()` so the clear button, the stepper limits and the counter catch up.

```
$('#note').val('Leave with the neighbour at number 12');
note.refresh();
```

In a blueprint, Forma binds the extras after it renders and removes them again on a re-render or `form.destroy()`; a `formConfig.labels` object renames the buttons (for another language, say).

## Options and methods

[table striped="true"]
| Option / method | Description |
| --- | --- |
| `prefix` | Slot at the start: `{icon}`, `{text}` or a string. Default `null` |
| `suffix` | Slot at the end, same values. Default `null` |
| `reveal` | `true`: show / hide button on a password input. Default `false` |
| `clear` | `true`: clear button, shown while there is a value. Default `false` |
| `stepper` | `true`: − / + buttons on a number input. Default `false` |
| `counter` | `true` (limit from `maxLength`) or a number. Default `false` |
| `labels` | Button names: `{reveal: 'Show password', clear: 'Clear', decrease: 'Decrease', increase: 'Increase'}` |
| `update({...})` | Change any of the above; `null` removes an addon, `false` an extra, leaving a key out keeps it. Returns the instance |
| `refresh()` | Re-read the value after setting it from code: clear button, stepper limits, counter |
| `step(dir)` | Step a stepper field by one step, `1` up or `-1` down |
| `destroy()` | Remove the addons and extras (and their listeners), and the wrapper if this instance made it |
| `input` / `wrapper` / `extras` | The bound input, its `.input-group-icon` group, and the extras' elements (`reveal`, `clear`, `decrease`, `increase`, `counter`) |
[/table]
