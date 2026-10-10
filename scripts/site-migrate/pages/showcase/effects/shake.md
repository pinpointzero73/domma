---
title: Shake Effect
description: "Quick attention/error shake animation. Perfect for form validation feedback and drawing attention to important elements."
layout: with-sidebar
status: published
sortOrder: 50
---

[hero title="Shake Effect" tagline="Quick attention/error shake animation. Perfect for form validation feedback and drawing attention to important elements." align="center"][/hero]

## Domma.effects.shake()

The `shake()` effect applies a quick shake animation to draw attention or signal an error. Supports horizontal, vertical, and both directions with configurable intensity and iterations.

```javascript
// Shake an invalid input
Domma.effects.shake('#email-input');

// Vertical shake with callback
Domma.effects.shake('.alert', {
  direction: 'vertical',
  intensity: 4,
  iterations: 2,
  onComplete: () => console.log('Shake done')
});

// Intense shake
Domma.effects.shake('.error-box', {
  intensity: 12,
  duration: 800,
  direction: 'both'
});
```

## Demo: Shake Directions

Three shake directions: horizontal, vertical, and both axes simultaneously.

[showcase-demo id="showcase/effects/shake/demo-shake-directions" title="Demo: Shake Directions" /]

```javascript
Domma.effects.shake('#el', { direction: 'horizontal' }); // Default
Domma.effects.shake('#el', { direction: 'vertical' });
Domma.effects.shake('#el', { direction: 'both' });
```

## Demo: Intensity Levels

Different shake intensities from subtle to extreme.

[showcase-demo id="showcase/effects/shake/demo-intensity-levels" title="Demo: Intensity Levels" /]

```javascript
Domma.effects.shake('#el', { intensity: 2 });   // Subtle
Domma.effects.shake('#el', { intensity: 6 });   // Normal (default)
Domma.effects.shake('#el', { intensity: 12 });  // Intense
```

## Demo: Form Validation

Shake invalid form inputs to draw attention. Try submitting with an empty or invalid email.

[showcase-demo id="showcase/effects/shake/demo-form-validation" title="Demo: Form Validation" /]

```javascript
$('#submit').on('click', () => {
  const email = $('#email').val();
  const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  if (!isValid) {
    $('#email').addClass('invalid');
    Domma.effects.shake('#email', {
      intensity: 4,
      duration: 400,
      onComplete: () => {
        // Remove invalid state after delay
        setTimeout(() => $('#email').removeClass('invalid'), 2000);
      }
    });
  }
});
```

## Demo: Multiple Iterations

Repeat the shake cycle multiple times for persistent emphasis.

[showcase-demo id="showcase/effects/shake/demo-multiple-iterations" title="Demo: Multiple Iterations" /]

```javascript
Domma.effects.shake('#el', { iterations: 1 }); // Default
Domma.effects.shake('#el', { iterations: 2 });
Domma.effects.shake('#el', { iterations: 3 });
```

## Demo: Staggered Shake

Shake multiple elements with a cascading delay.

[showcase-demo id="showcase/effects/shake/demo-staggered-shake" title="Demo: Staggered Shake" /]

```javascript
Domma.effects.shake('.item', {
  stagger: 100,
  intensity: 5,
  direction: 'horizontal'
});
```

## Options Reference

[table striped="true"]
| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `intensity` | number | 6 | Shake distance in pixels |
| `duration` | number | 500 | Total shake duration in ms |
| `direction` | string | 'horizontal' | 'horizontal', 'vertical', 'both' |
| `easing` | string | 'ease-in-out' | CSS easing function |
| `iterations` | number | 1 | Number of shake cycles |
| `stagger` | number | 0 | Delay between elements (ms) |
| `respectMotionPreference` | boolean | true | Honour prefers-reduced-motion |
| `onComplete` | function | null | Callback when shake completes |
[/table]
