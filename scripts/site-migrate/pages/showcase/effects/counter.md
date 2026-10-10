---
title: Counter Effect
description: "Animated number counting with easing, formatting, and scroll-triggered activation. Perfect for stats and dashboards."
layout: with-sidebar
status: published
sortOrder: 50
---

[hero title="Counter Effect" tagline="Animated number counting with easing, formatting, and scroll-triggered activation. Perfect for stats and dashboards." align="center"][/hero]

## Domma.effects.counter()

The `counter()` effect smoothly counts from one number to another using requestAnimationFrame with configurable easing. Supports thousands separators, prefixes, suffixes, decimals, and scroll-triggered activation.

```javascript
// Count from 0 to the number in the element
Domma.effects.counter('.stat-number');

// With full formatting
Domma.effects.counter('.revenue', {
  from: 0,
  to: 1250000,
  duration: 3000,
  separator: ',',
  prefix: '$',
  decimals: 2,
  easing: 'ease-out'
});

// Scroll-triggered
Domma.effects.counter('.stat', {
  trigger: 'scroll',
  threshold: 0.5
});
```

## Demo: Dashboard Stats

Click to animate stat counters with staggered timing.

[showcase-demo id="showcase/effects/counter/demo-dashboard-stats" title="Demo: Dashboard Stats" /]

```javascript
Domma.effects.counter('.stat-number', {
  duration: 2000,
  stagger: 200,
  separator: ','
});
```

## Demo: Prefix & Suffix

Add currency symbols, percentage signs, and other formatting.

[showcase-demo id="showcase/effects/counter/demo-prefix-and-suffix" title="Demo: Prefix & Suffix" /]

```javascript
Domma.effects.counter('#revenue', {
  to: 84750, prefix: '$', separator: ','
});

Domma.effects.counter('#percent', {
  to: 98.7, suffix: '%', decimals: 1
});

Domma.effects.counter('#temp', {
  to: 23.5, suffix: '°C', decimals: 1
});
```

## Demo: Easing Comparison

Compare different easing functions counting to 1,000.

[showcase-demo id="showcase/effects/counter/demo-easing-comparison" title="Demo: Easing Comparison" /]

```javascript
Domma.effects.counter('#linear', { to: 1000, easing: 'linear', duration: 3000 });
Domma.effects.counter('#easeout', { to: 1000, easing: 'ease-out', duration: 3000 });
Domma.effects.counter('#easeinout', { to: 1000, easing: 'ease-in-out', duration: 3000 });
```

## Demo: Scroll Triggered

These counters start when they scroll into view. Scroll down if they haven't started yet.

[showcase-demo id="showcase/effects/counter/demo-scroll-triggered" title="Demo: Scroll Triggered" /]

```javascript
Domma.effects.counter('.counter-scroll', {
  trigger: 'scroll',
  threshold: 0.5,
  stagger: 150,
  separator: ','
});
```

## Demo: Decimal Precision

Count with decimal places for financial or scientific data.

[showcase-demo id="showcase/effects/counter/demo-decimal-precision" title="Demo: Decimal Precision" /]

```javascript
Domma.effects.counter('#counter-decimal', {
  to: 42867.53,
  prefix: '$',
  decimals: 2,
  separator: ',',
  duration: 2500
});
```

## Options Reference

[table striped="true"]
| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `from` | number | 0 | Start value |
| `to` | number | null | End value (reads from element if null) |
| `duration` | number | 2000 | Total count duration in ms |
| `easing` | string | 'ease-out' | 'linear', 'ease-out', 'ease-in-out' |
| `decimals` | number | 0 | Decimal places |
| `separator` | string | ',' | Thousands separator |
| `prefix` | string | '' | Text before number |
| `suffix` | string | '' | Text after number |
| `stagger` | number | 0 | Delay between elements (ms) |
| `trigger` | string | 'immediate' | 'immediate' or 'scroll' |
| `threshold` | number | 0.5 | Observer threshold when trigger is scroll |
| `respectMotionPreference` | boolean | true | Honour prefers-reduced-motion |
| `onUpdate` | function | null | Callback on each frame (currentValue) |
| `onComplete` | function | null | Callback when counting completes |
[/table]
