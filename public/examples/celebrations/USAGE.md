# Domma Celebrations - Usage Guide

**Domma Celebrations** is a year-round visual effects system that automatically displays culturally authentic celebration animations based on the current date.

---

## Table of Contents

- [Quick Start](#quick-start)
- [Features](#features)
- [Supported Celebrations](#supported-celebrations)
- [Basic Usage](#basic-usage)
- [Configuration](#configuration)
- [API Reference](#api-reference)
- [Customization](#customization)
- [Integration Examples](#integration-examples)
- [Best Practices](#best-practices)

---

## Quick Start

### 1. Include Domma

```html
<!-- Full Domma bundle (includes Celebrations) -->
<script src="../../dist/domma.min.js"></script>
```

### 2. Initialize with Layout System

The easiest way is to use Domma's layout system with a preset that includes celebrations:

```html
<body data-layout="splash">
  <!-- Your content -->
</body>

<script src="../../layouts/js/layout.js"></script>
```

The `splash` preset automatically enables celebrations with a toggle control.

### 3. Manual Initialization

For manual control without the layout system:

```html
<div id="celebrations-canvas"></div>

<script>
// Initialize celebrations
const celebrations = window.Domma.layouts.modules.celebrations.init({
  container: '#celebrations-canvas',
  intensity: 'medium',
  autoDetect: true
});
</script>
```

---

## Features

### 🎨 **8 Celebration Themes**

Each theme includes:
- **Culturally authentic particles** (snowflakes, hearts, shamrocks, etc.)
- **Static decorations** (Santa's sleigh, dragons, castles, moons)
- **Dynamic effects** (wind, gravity, rotation, glowing)
- **Automatic date detection** (5-day lead-up to celebration day)

### ⚙️ **Intensity Levels**

- **Light**: Subtle effects (40-50 particles)
- **Medium**: Balanced visuals (80-100 particles) - Default
- **Heavy**: Maximum impact (120-200 particles)

### 🎯 **User Control**

- **Toggle button** - Enable/disable celebrations
- **Intensity selector** - Choose effect strength
- **State persistence** - Remembers user preferences via localStorage

### 📱 **Responsive Design**

- Automatic particle reduction on mobile devices
- Canvas resizing on window resize
- Performance-optimized rendering

---

## Supported Celebrations

| Celebration | Dates | Particles | Decorations |
|-------------|-------|-----------|-------------|
| **Christmas** 🎄 | Dec 1 - Jan 1 | Snowflakes (6-pointed crystalline) | Santa's sleigh, reindeer, trees, wreaths, robins, trains, elves |
| **Valentine's Day** 💕 | Feb 9 - Feb 14 | Hearts, rose petals, kissing lips | Cupid, love letters, heart garlands, pink heart-shaped moon |
| **St David's Day** 🏴󠁧󠁢󠁷󠁬󠁳󠁿 | Feb 24 - Mar 1 | Daffodils, leeks | Welsh dragon (Y Ddraig Goch), harp, Welsh flag |
| **St Patrick's Day** ☘️ | Mar 12 - Mar 17 | Shamrocks (green/white/gold) | Leprechauns, pot of gold, rainbow, green moon |
| **St George's Day** 🏴󠁧󠁢󠁥󠁮󠁧󠁿 | Apr 18 - Apr 23 | Rose petals (red/white/blue) | Medieval castle, dragon, knight, St George's Cross flag |
| **Halloween** 🎃 | Oct 26 - Oct 31 | Bats, ghosts, pumpkins | Jack-o-lanterns, gravestones, haunted house |
| **Guy Fawkes** 🎆 | Nov 1 - Nov 5 | Firework sparks, embers | Bonfire, rockets, red moon |
| **St Andrew's Day** 🏴󠁧󠁢󠁳󠁣󠁴󠁿 | Nov 25 - Nov 30 | Thistles (white/blue), snowflakes | Bagpiper, tartan, Highland scene, saltire flag |

---

## Basic Usage

### Auto-Detection Mode

Let the system automatically detect and display the current celebration:

```javascript
const celebrations = Domma.layouts.modules.celebrations.init({
  autoDetect: true,
  intensity: 'medium'
});
```

### Manual Theme Selection

Force a specific celebration theme:

```javascript
const celebrations = Domma.layouts.modules.celebrations.init({
  theme: 'christmas',
  intensity: 'heavy',
  autoDetect: false
});
```

### With Layout System

The layout system provides automatic initialization via presets:

```json
// layouts/config/presets.json
{
  "splash": {
    "celebrations": {
      "toggle": true,
      "autoDetect": true,
      "intensity": "medium"
    }
  }
}
```

---

## Configuration

### Full Configuration Options

```javascript
const config = {
  // Container element (selector or HTMLElement)
  container: '#celebrations-canvas',

  // Auto-detect celebration based on current date
  autoDetect: true,

  // Force specific theme (overrides autoDetect)
  theme: null, // 'christmas' | 'valentines' | 'halloween' | etc.

  // Effect intensity
  intensity: 'medium', // 'light' | 'medium' | 'heavy'

  // Show toggle control
  showToggle: true,

  // Initial enabled state
  enabled: true,

  // LocalStorage key for state persistence
  storageKey: 'domma-celebrations-enabled',

  // Animation frame rate (milliseconds)
  frameRate: 60,

  // Canvas z-index
  zIndex: 9999,

  // Reduce particles on mobile
  mobileReduction: 0.5 // 50% fewer particles
};

const celebrations = Domma.layouts.modules.celebrations.init(config);
```

### Intensity Configurations

Each theme defines intensity levels:

```javascript
// Example: Christmas intensity configs
{
  light: {
    count: 80,           // Particle count
    speedRange: [0.5, 1.5],
    sizeRange: [2, 4],
    trees: 2,            // Static decorations
    sleighChance: 0.0003 // Special particle spawn chance
  },
  medium: {
    count: 150,
    speedRange: [0.8, 2.0],
    sizeRange: [2, 5],
    trees: 3,
    sleighChance: 0.0005
  },
  heavy: {
    count: 300,
    speedRange: [1.0, 2.5],
    sizeRange: [3, 6],
    trees: 5,
    sleighChance: 0.0008
  }
}
```

---

## API Reference

### Initialization

```javascript
// Initialize celebrations
const celebrations = Domma.layouts.modules.celebrations.init(config);
```

### Instance Methods

```javascript
// Enable celebrations
celebrations.enable();

// Disable celebrations
celebrations.disable();

// Toggle celebrations
celebrations.toggle();

// Change intensity
celebrations.setIntensity('heavy'); // 'light' | 'medium' | 'heavy'

// Change theme
celebrations.setTheme('valentines');

// Destroy instance (cleanup)
celebrations.destroy();

// Get current state
const state = celebrations.getState();
// Returns: { enabled: boolean, theme: string, intensity: string }
```

### Static Methods

```javascript
// Check if it's celebration season
const isSeason = Domma.layouts.modules.celebrations.isCelebrationSeason();
// Returns: boolean

// Get current celebration theme
const theme = Domma.layouts.modules.celebrations.getCurrentTheme();
// Returns: string | null

// Get all available themes
const themes = Domma.layouts.modules.celebrations.getThemes();
// Returns: Array<{ name, displayName, emoji, dates }>
```

---

## Customization

### Custom Container Styling

```css
#celebrations-canvas {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  pointer-events: none; /* Allow clicks through canvas */
  z-index: 9999;
}
```

### Custom Toggle Button Styling

```css
.celebrations-toggle {
  position: fixed;
  bottom: 20px;
  right: 20px;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  width: 60px;
  height: 60px;
  cursor: pointer;
  font-size: 24px;
  transition: all 0.3s ease;
}

.celebrations-toggle:hover {
  transform: scale(1.1);
  background: rgba(0, 0, 0, 0.9);
}
```

### Event Listeners

```javascript
// Listen for theme changes
celebrations.on('themeChange', (theme) => {
  console.log('Theme changed to:', theme);
});

// Listen for enable/disable
celebrations.on('stateChange', (enabled) => {
  console.log('Celebrations enabled:', enabled);
});

// Listen for intensity changes
celebrations.on('intensityChange', (intensity) => {
  console.log('Intensity changed to:', intensity);
});
```

---

## Integration Examples

### Example 1: Basic Integration

```html
<!DOCTYPE html>
<html>
<head>
  <title>My Website with Celebrations</title>
  <script src="../../dist/domma.min.js"></script>
</head>
<body data-layout="splash">
  <h1>Welcome to My Website</h1>
  <p>Celebrations will automatically appear during celebration seasons!</p>

  <script src="../../layouts/js/layout.js"></script>
</body>
</html>
```

### Example 2: Manual Control

```html
<!DOCTYPE html>
<html>
<head>
  <title>Manual Celebrations Control</title>
  <script src="../../dist/domma.min.js"></script>
  <style>
    #celebrations-canvas {
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      pointer-events: none;
      z-index: 9999;
    }
  </style>
</head>
<body>
  <div id="celebrations-canvas"></div>

  <h1>Celebration Controls</h1>

  <div>
    <button onclick="celebrations.setTheme('christmas')">Christmas</button>
    <button onclick="celebrations.setTheme('valentines')">Valentine's</button>
    <button onclick="celebrations.setTheme('halloween')">Halloween</button>
  </div>

  <div>
    <button onclick="celebrations.setIntensity('light')">Light</button>
    <button onclick="celebrations.setIntensity('medium')">Medium</button>
    <button onclick="celebrations.setIntensity('heavy')">Heavy</button>
  </div>

  <div>
    <button onclick="celebrations.toggle()">Toggle On/Off</button>
  </div>

  <script>
    const celebrations = Domma.layouts.modules.celebrations.init({
      container: '#celebrations-canvas',
      theme: 'christmas',
      intensity: 'medium',
      autoDetect: false,
      showToggle: false // We're using custom buttons
    });
  </script>
</body>
</html>
```

### Example 3: React Integration

```jsx
import { useEffect, useRef, useState } from 'react';

function CelebrationsComponent() {
  const containerRef = useRef(null);
  const celebrationsRef = useRef(null);
  const [enabled, setEnabled] = useState(true);
  const [intensity, setIntensity] = useState('medium');

  useEffect(() => {
    // Initialize on mount
    celebrationsRef.current = window.Domma.layouts.modules.celebrations.init({
      container: containerRef.current,
      autoDetect: true,
      intensity: intensity,
      enabled: enabled,
      showToggle: false
    });

    // Cleanup on unmount
    return () => {
      if (celebrationsRef.current) {
        celebrationsRef.current.destroy();
      }
    };
  }, []);

  // Update intensity when changed
  useEffect(() => {
    if (celebrationsRef.current) {
      celebrationsRef.current.setIntensity(intensity);
    }
  }, [intensity]);

  // Update enabled state
  useEffect(() => {
    if (celebrationsRef.current) {
      if (enabled) {
        celebrationsRef.current.enable();
      } else {
        celebrationsRef.current.disable();
      }
    }
  }, [enabled]);

  return (
    <div>
      <div
        ref={containerRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          pointerEvents: 'none',
          zIndex: 9999
        }}
      />

      <div className="controls">
        <button onClick={() => setEnabled(!enabled)}>
          {enabled ? 'Disable' : 'Enable'} Celebrations
        </button>

        <select value={intensity} onChange={(e) => setIntensity(e.target.value)}>
          <option value="light">Light</option>
          <option value="medium">Medium</option>
          <option value="heavy">Heavy</option>
        </select>
      </div>
    </div>
  );
}

export default CelebrationsComponent;
```

### Example 4: Vue Integration

```vue
<template>
  <div>
    <div ref="celebrationsContainer" class="celebrations-canvas"></div>

    <div class="controls">
      <button @click="toggleCelebrations">
        {{ enabled ? 'Disable' : 'Enable' }} Celebrations
      </button>

      <select v-model="intensity" @change="updateIntensity">
        <option value="light">Light</option>
        <option value="medium">Medium</option>
        <option value="heavy">Heavy</option>
      </select>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Celebrations',
  data() {
    return {
      celebrations: null,
      enabled: true,
      intensity: 'medium'
    };
  },
  mounted() {
    this.celebrations = window.Domma.layouts.modules.celebrations.init({
      container: this.$refs.celebrationsContainer,
      autoDetect: true,
      intensity: this.intensity,
      enabled: this.enabled,
      showToggle: false
    });
  },
  beforeUnmount() {
    if (this.celebrations) {
      this.celebrations.destroy();
    }
  },
  methods: {
    toggleCelebrations() {
      this.enabled = !this.enabled;
      if (this.celebrations) {
        this.celebrations.toggle();
      }
    },
    updateIntensity() {
      if (this.celebrations) {
        this.celebrations.setIntensity(this.intensity);
      }
    }
  }
};
</script>

<style scoped>
.celebrations-canvas {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  pointer-events: none;
  z-index: 9999;
}
</style>
```

---

## Best Practices

### Performance

1. **Use appropriate intensity:**
   - `light` for mobile or low-powered devices
   - `medium` for most desktop users
   - `heavy` for high-end displays or special events

2. **Enable auto-detection:**
   - Let the system handle celebration timing
   - Reduces unnecessary rendering outside celebration periods

3. **Cleanup on unmount:**
   - Always call `destroy()` when removing celebrations
   - Prevents memory leaks in SPAs

### Accessibility

1. **Provide user control:**
   - Always include a toggle button
   - Respect `prefers-reduced-motion` media query
   - Save user preferences to localStorage

2. **Keyboard navigation:**
   - Make toggle button keyboard-accessible
   - Use proper ARIA labels

```html
<button
  class="celebrations-toggle"
  aria-label="Toggle celebrations"
  aria-pressed="true"
  tabindex="0">
  ❄️
</button>
```

### UX Considerations

1. **Don't overwhelm users:**
   - Default to `medium` intensity
   - Provide clear visual feedback
   - Make controls easily discoverable

2. **Respect user preferences:**
   - Persist enabled state to localStorage
   - Check for `prefers-reduced-motion`
   - Allow easy disabling

3. **Cultural sensitivity:**
   - Celebrations are culturally specific
   - Consider your audience demographics
   - Provide opt-out mechanisms

### Mobile Optimization

```javascript
// Detect mobile and reduce particles
const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

const celebrations = Domma.layouts.modules.celebrations.init({
  intensity: isMobile ? 'light' : 'medium',
  mobileReduction: 0.5 // 50% fewer particles on mobile
});
```

### Reduced Motion Support

```javascript
// Check for reduced motion preference
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (!prefersReducedMotion) {
  const celebrations = Domma.layouts.modules.celebrations.init({
    autoDetect: true
  });
}
```

---

## Troubleshooting

### Celebrations not appearing?

1. **Check the date:** Celebrations only appear during their 5-day window
2. **Check localStorage:** User may have disabled celebrations
3. **Check console:** Look for initialization errors
4. **Verify container:** Ensure container element exists

### Performance issues?

1. **Lower intensity:** Switch from `heavy` to `medium` or `light`
2. **Check particle count:** Use browser DevTools to monitor canvas rendering
3. **Enable mobile reduction:** Ensure `mobileReduction` is set for mobile devices

### Canvas not visible?

1. **Check z-index:** Ensure canvas has appropriate z-index
2. **Check positioning:** Canvas should be `position: fixed` or `absolute`
3. **Check pointer-events:** Should be `none` to allow clicks through
4. **Check opacity:** Canvas should not have `opacity: 0`

---

## Browser Support

Celebrations require:
- **Canvas API** support
- **ES6+** JavaScript features
- **requestAnimationFrame** support

Supported browsers:
- ✅ Chrome/Edge 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Opera 76+

---

## License

Domma Celebrations is part of the Domma framework and is licensed under the MIT License.

---

## Credits

Created by Darryl Waterhouse & DCBW-IT

🎄 Happy Celebrating! 🎉
