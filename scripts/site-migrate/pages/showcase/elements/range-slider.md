---
title: Range Slider
description: "One value or a range between two thumbs - with ticks, marks and a tooltip, full keyboard support, and real range inputs underneath for your forms"
layout: with-sidebar
status: published
sortOrder: 50
---

[hero title="Range Slider" tagline="One value or a range between two thumbs - with ticks, marks and a tooltip, full keyboard support, and real range inputs underneath for your forms" align="center"][/hero]

## Overview

`E.rangeSlider()` (or `E.slider()`) draws a slider over real `<input type="range">` elements. Point it at a range input and that input stays the element - its `min`, `max`, `step`, `value` and `name` are read from it - or point it at a container and the inputs are made for you.

The inputs are hidden but still carry the value, so forms submit it, `FormData` reads it, and anything listening for the inputs' native `input` and `change` events - including Domma's model bindings - hears every move.

### Key Features

- **One or two thumbs** - `range: true` gives `[low, high]`, kept apart by `minDistance`
- **Ticks, marks and a tooltip** - all labelled through one formatter
- **Keyboard** - arrows step, Page Up / Page Down move ten steps, Home / End go to the ends
- **Accessible** - ARIA sliders with `aria-valuenow`, `aria-valuetext` and per-thumb limits
- **Pointer and touch** - drag with pointer capture, a large hit area, press anywhere on the track
- **Vertical and right-to-left**

### Basic Usage

```
// <input id="volume" type="range" name="volume" min="0" max="100" value="40">
const volume = E.rangeSlider('#volume');
volume.on('change', (value) => save(value));
```

## A single value

Drag the thumb, press anywhere on the track, or tab to it and use the arrow keys. `onInput` runs while it moves, `onChange` when you let go.

[showcase-demo id="showcase/elements/range-slider/a-single-value" title="A single value" /]

```
E.rangeSlider('#demo-volume', {
    onInput: (value) => $('#demo-volume-value').text(value)
});
```

## Two thumbs

`range: true` makes a low and a high thumb. They never cross, and `minDistance` keeps them that far apart. `labels` formats the value everywhere it is shown - the tooltip, the ticks and the `aria-valuetext` a screen reader speaks.

[showcase-demo id="showcase/elements/range-slider/two-thumbs" title="Two thumbs" /]

```
const price = E.rangeSlider('#demo-price', {
    range: true,
    min: 0,
    max: 1000,
    step: 10,
    value: [100, 600],
    minDistance: 50,
    name: 'price',
    ariaLabel: 'Price',
    labels: (v) => '£' + v,
    tooltip: 'always'
});
price.getValue();               // [100, 600]
price.setValue([200, 400]);
```

## Ticks and marks

`ticks: true` draws one at every step, a number draws one every that many units, and an array draws them where you say (and labels them). `marks` are labelled points; pressing one jumps straight to it.

[showcase-demo id="showcase/elements/range-slider/ticks-and-marks" title="Ticks and marks" /]

```
E.rangeSlider('#demo-rating', {ticks: true, tickLabels: true, labels: (v) => v + '★'});

E.rangeSlider('#demo-temp', {
    ticks: 10,
    labels: (v) => v + '°C',
    marks: [
        {value: 30, label: 'Delicates'},
        {value: 40, label: 'Everyday'},
        {value: 60, label: 'Towels'},
        {value: 90, label: 'Boil'}
    ]
});
```

## Vertical and right-to-left

`orientation: 'vertical'` stands it up (minimum at the bottom). In a right-to-left page - or with `rtl: true` - the minimum is on the right and the arrow keys follow it, as a native range input does.

[showcase-demo id="showcase/elements/range-slider/vertical-and-right-to-left" title="Vertical and right-to-left" /]

```
E.rangeSlider('#demo-eq-1', {orientation: 'vertical', min: -12, max: 12, value: 3, ariaLabel: 'Bass'});
E.rangeSlider('#demo-rtl', {ticks: true});   // the page's direction is followed
```

## In a form

A two-thumb slider submits two inputs. They share the `name` by default, so the form sends `budget=200&budget=800` (`FormData.getAll('budget')` gives both); `names: ['budget_min', 'budget_max']` names them separately. Reset puts the slider back with the form.

[showcase-demo id="showcase/elements/range-slider/in-a-form" title="In a form" /]

```
E.rangeSlider('#demo-form-guests', {ticks: true});
E.rangeSlider('#demo-form-budget', {
    range: true, min: 0, max: 2000, step: 50, value: [200, 800],
    names: ['budget_min', 'budget_max'], ariaLabels: ['Budget from', 'Budget to'],
    labels: (v) => '£' + v
});
```

## In an F.create blueprint

`type: 'slider'` is the slider as a form field; `formConfig` takes its options. With `formConfig.range` the field's value is `[low, high]`. A plain `type: 'range'` stays a native input unless `formConfig.slider` is set.

[showcase-demo id="showcase/elements/range-slider/in-an-f-create-blueprint" title="In an F.create blueprint" /]

```
const form = F.create({
    brightness: {type: 'slider', label: 'Brightness', min: 0, max: 100, default: 70,
                 formConfig: {labels: (v) => v + '%'}},
    hours: {type: 'slider', label: 'Opening hours', min: 0, max: 24, default: [9, 17],
            formConfig: {range: true, minDistance: 1, ticks: 6, tickLabels: true,
                         labels: (v) => String(v).padStart(2, '0') + ':00'}}
}, {}, {onSubmit: (data) => console.log(data.hours)});   // [9, 17]
form.renderTo('#demo-blueprint');

form.destroy();     // removes the sliders with the form
```

## API

### Methods

- `getValue()` - a number, or `[low, high]`
- `setValue(value, {silent})` - fires beforechange, input and change unless silent
- `setRange(min, max)` - new bounds; the value is pulled inside them
- `enable()`, `disable()`, `isDisabled()`, `destroy()`

### Events

- `input(value)` - while dragging, and on each key press
- `change(value)` - when the value is committed
- `beforechange(next, current)` - return `false` to refuse a move

Each is an `onX` option, a `.on('x')` listener and a bubbling `dm:range-slider:x` DOM event. This one refuses to go above 80, and logs its change events from the DOM:

[showcase-demo id="showcase/elements/range-slider/events" title="Events" /]

```
const capped = E.rangeSlider('#demo-capped', {
    labels: (v) => v + ' / 100',
    onBeforeChange: (next) => next <= 80
});

// detail = {instance, args}
$('#demo-capped').on('dm:range-slider:change', (e) => log(e.detail.args[0]));
```
