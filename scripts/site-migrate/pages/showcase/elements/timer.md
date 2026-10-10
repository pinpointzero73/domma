---
title: Timer
description: "Flexible countdown component with visual and headless modes, event callbacks, and notification integration"
layout: with-sidebar
status: published
sortOrder: 50
---

[hero title="Timer" tagline="Flexible countdown component with visual and headless modes, event callbacks, and notification integration" align="center"][/hero]

## Overview

Timer is a flexible countdown component that works in both visual mode (with DOM display) and headless mode (pure logic). Perfect for Pomodoro timers, cooking timers, workout intervals, and any countdown scenario.

### Key Features

- Visual mode with customisable display and controls
- Headless mode for background timers without UI
- Multiple time formats (HH:MM:SS, MM:SS, SS)
- Start, pause, reset, and stop controls
- Dynamic time manipulation (add/subtract time)
- Desktop notification integration on completion
- Optional sound playback when timer finishes
- Event callbacks for all lifecycle events
- High-precision timing with configurable update intervals

### When to Use Timers

- **Productivity**: Pomodoro technique, work/break intervals, time blocking
- **Cooking & Recipes**: Step timing, cooking duration, multi-stage recipes
- **Fitness**: Workout intervals, rest periods, HIIT training
- **Education**: Quiz time limits, study sessions, presentation timing
- **Gaming**: Turn timers, challenge countdowns, cooldown periods
- **Meetings**: Speaking time, agenda items, total meeting duration

### Basic Usage

```javascript
// Visual timer with controls
const timer = Domma.elements.timer('#timer', {
    duration: 60000,  // 1 minute in milliseconds
    format: 'mm:ss',
    showControls: true,
    onComplete: () => {
        console.log('Timer finished!');
    }
});

// Headless timer (no UI)
const backgroundTimer = Domma.elements.timer(null, {
    duration: 300000,  // 5 minutes
    onTick: (remaining) => {
        console.log(`${remaining}ms remaining`);
    }
});

backgroundTimer.start();
```

## Quick Start

Create your first timer in seconds with automatic UI and controls.

### Simplest Visual Timer

```javascript
// HTML: Just an empty div
<div id="my-timer"></div>

// JavaScript: Timer with controls
const timer = Domma.elements.timer('#my-timer', {
    duration: 30000,  // 30 seconds
    showControls: true,
    autoStart: true   // Starts immediately
});
```

[showcase-demo id="showcase/elements/timer/simplest-visual-timer" title="Simplest Visual Timer" /]

### Simplest Headless Timer

```javascript
// No HTML needed - pure JavaScript
const timer = Domma.elements.timer(null, {
    duration: 10000,  // 10 seconds
    onComplete: () => Domma.elements.alert('Done!')
});

timer.start();  // Go!
```

[showcase-demo id="showcase/elements/timer/simplest-headless-timer" title="Simplest Headless Timer" /]

## Step-by-Step Tutorial

Build a Pomodoro timer with work/break intervals and notifications.

### Step 1: Create Work Timer

```javascript
const workTimer = Domma.elements.timer('#work-timer', {
    duration: 1500000,  // 25 minutes (Pomodoro work period)
    format: 'mm:ss',
    showControls: true,
    notification: true,  // Desktop notification on complete
    notificationOptions: {
        title: 'Work Session Complete!',
        body: 'Time for a 5-minute break',
        requireInteraction: true
    },
    onComplete: () => {
        console.log('Work session finished');
        // Start break timer automatically
        breakTimer.start();
    }
});
```

### Step 2: Create Break Timer

```javascript
const breakTimer = Domma.elements.timer('#break-timer', {
    duration: 300000,  // 5 minutes
    format: 'mm:ss',
    showControls: true,
    notification: true,
    notificationOptions: {
        title: 'Break Complete!',
        body: 'Ready to start another work session?'
    },
    onComplete: () => {
        console.log('Break finished');
        // Optionally auto-start work timer again
    }
});
```

### Step 3: Add Controls

```javascript
// Manual control buttons
$('#start-work').on('click', () => {
    workTimer.start();
});

// Add time during work session
$('#add-5min').on('click', () => {
    workTimer.add(300000);  // Add 5 minutes
});

// Pause for interruption
$('#pause').on('click', () => {
    workTimer.pause();
});
```

[showcase-demo id="showcase/elements/timer/add-controls" title="Step 3: Add Controls" /]

## Real-World Examples

### 1. Cooking Timer

```javascript
const cookingTimer = Domma.elements.timer('#cooking-timer', {
    duration: 600000,  // 10 minutes
    format: 'mm:ss',
    showControls: true,
    sound: true,
    soundUrl: '/sounds/kitchen-bell.mp3',
    notification: true,
    notificationOptions: {
        title: 'Cooking Timer',
        body: 'Your food is ready!',
        requireInteraction: true
    }
});
```

[showcase-demo id="showcase/elements/timer/1-cooking-timer" title="1. Cooking Timer" /]

### 2. HIIT Workout Timer

```javascript
let currentRound = 1;
const totalRounds = 8;

const workoutTimer = Domma.elements.timer('#workout', {
    duration: 30000,  // 30 seconds work
    format: 'ss',
    onComplete: () => {
        if (currentRound < totalRounds) {
            // Start rest period
            restTimer.start();
        } else {
            Domma.elements.alert('Workout complete!', { title: 'HIIT Complete' });
        }
    }
});

const restTimer = Domma.elements.timer(null, {
    duration: 10000,  // 10 seconds rest
    onComplete: () => {
        currentRound++;
        workoutTimer.reset();
        workoutTimer.start();
    }
});
```

[showcase-demo id="showcase/elements/timer/2-hiit-workout-timer" title="2. HIIT Workout Timer" /]

### 3. Presentation Timer

```javascript
const presentationTimer = Domma.elements.timer('#presentation', {
    duration: 600000,  // 10 minutes
    format: 'mm:ss',
    showControls: true,
    onTick: (remaining) => {
        // Visual warnings at certain thresholds
        if (remaining === 120000) {  // 2 minutes
            Domma.elements.alert('2 minutes remaining!', { title: 'Time Warning' });
        } else if (remaining === 60000) {  // 1 minute
            Domma.elements.alert('1 minute remaining!', { title: 'Time Warning' });
        }
    }
});
```

[showcase-demo id="showcase/elements/timer/3-presentation-timer" title="3. Presentation Timer" /]

### 4. Multiple Timers

```javascript
// Manage multiple cooking tasks
const timers = {
    pasta: Domma.elements.timer('#pasta-timer', {
        duration: 480000,  // 8 minutes
        format: 'mm:ss',
        showControls: true
    }),
    sauce: Domma.elements.timer('#sauce-timer', {
        duration: 900000,  // 15 minutes
        format: 'mm:ss',
        showControls: true
    }),
    garlic: Domma.elements.timer('#garlic-timer', {
        duration: 120000,  // 2 minutes
        format: 'mm:ss',
        showControls: true
    })
};

// Start all at once
Object.values(timers).forEach(timer => timer.start());
```

[showcase-demo id="showcase/elements/timer/4-multiple-timers" title="4. Multiple Timers" /]

## Best Practices

### ✅ Do's

- **Use headless mode for background timers** - No DOM overhead when UI not needed
- **Set appropriate update intervals** - 100ms for smooth UI, 1000ms for efficiency
- **Add notifications for long timers** - Users may switch tabs or minimize window
- **Provide controls for user timers** - showControls: true for user-facing timers
- **Choose correct time format** - HH:MM:SS for hours, MM:SS for minutes, SS for seconds
- **Clean up with destroy()** - Stop timers and remove listeners when done
- **Use onTick for progress bars** - Update UI elements based on remaining time

### ❌ Don'ts

- **Don't use very short update intervals** - 10ms updates waste CPU, 100ms is sufficient
- **Don't forget to stop timers** - Running timers continue even if element removed from DOM
- **Don't rely solely on client-side timing** - For critical timings, validate server-side
- **Don't create excessive timer instances** - Reuse timers with reset() and setDuration()
- **Don't use timers for real-time clocks** - Use Date objects for wall-clock time

### Performance Pattern

```javascript
// Good: Reuse timer for repeated countdowns
const reusableTimer = Domma.elements.timer('#timer', {
    duration: 60000,
    showControls: true,
    onComplete: () => {
        console.log('Cycle complete');
        // Reset and restart for next cycle
        setTimeout(() => {
            reusableTimer.reset();
            reusableTimer.start();
        }, 1000);
    }
});

// Bad: Creating new timer each time (memory leak)
function startNewTimer() {
    const timer = Domma.elements.timer('#timer', {
        duration: 60000,
        onComplete: () => startNewTimer()  // Creates infinite timers!
    });
    timer.start();
}
```

### Cleanup Pattern

```javascript
// Store reference for cleanup
let currentTimer = null;

function setupTimer() {
    // Clean up old timer
    if (currentTimer) {
        currentTimer.destroy();
    }

    // Create new timer
    currentTimer = Domma.elements.timer('#timer', {
        duration: 60000,
        showControls: true
    });
}

// Clean up when page unloads
window.addEventListener('beforeunload', () => {
    if (currentTimer) {
        currentTimer.destroy();
    }
});
```

## API Reference

### Factory Method

```javascript
// Visual mode (with DOM element)
elements.timer(selector, options)

// Headless mode (no DOM element)
elements.timer(null, options)
```

### Options

[table striped="true"]
| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `duration` | number | 60000 | Timer duration in milliseconds |
| `autoStart` | boolean | false | Start timer automatically on creation |
| `format` | string | 'mm:ss' | Display format: 'hh:mm:ss', 'mm:ss', 'ss' |
| `showControls` | boolean | false | Show start/pause/reset buttons |
| `updateInterval` | number | 100 | Update frequency in milliseconds |
| `notification` | boolean | false | Show desktop notification on complete |
| `notificationOptions` | object | {} | Options passed to notification |
| `sound` | boolean | false | Play sound on completion |
| `soundUrl` | string | null | URL to sound file |
| `onTick` | function | null | Callback on each update (remaining) |
| `onComplete` | function | null | Callback when timer reaches 0 |
| `onStart` | function | null | Callback when timer starts |
| `onPause` | function | null | Callback when timer pauses |
| `onReset` | function | null | Callback when timer resets |
[/table]

### Instance Methods

```javascript
// Control methods
timer.start()          // Start or resume timer
timer.pause()          // Pause timer
timer.reset()          // Reset to initial duration
timer.stop()           // Stop timer completely

// Time manipulation
timer.add(ms)          // Add milliseconds
timer.subtract(ms)     // Subtract milliseconds
timer.setDuration(ms)  // Change total duration

// State methods
timer.isRunning()      // Returns boolean
timer.getRemaining()   // Returns milliseconds remaining
timer.getElapsed()     // Returns milliseconds elapsed

// Cleanup
timer.destroy()        // Stop timer and clean up
```

## Declarative Configuration

Set up timers declaratively using the config engine.

### Basic Timer Setup

```javascript
$.setup({
    '#my-timer': {
        component: 'timer',
        options: {
            duration: 300000,  // 5 minutes
            format: 'mm:ss',
            showControls: true,
            notification: true
        }
    }
});
```

[showcase-demo id="showcase/elements/timer/basic-timer-setup" title="Basic Timer Setup" /]

### Multiple Timers

```javascript
$.setup({
    '#quick-timer': {
        component: 'timer',
        options: {
            duration: 60000,
            format: 'ss',
            showControls: true
        }
    },
    '#long-timer': {
        component: 'timer',
        options: {
            duration: 3600000,  // 1 hour
            format: 'hh:mm:ss',
            showControls: true
        }
    }
});
```

## CSS Customisation

Override these CSS variables to customise Timer appearance and match your design system.

[table striped="true"]
| Variable | Default | Controls |
| --- | --- | --- |
| `--dm-success` | `var(--dm-green-600)` | Timer colour (plenty of time) |
| `--dm-warning` | `var(--dm-amber-500)` | Timer colour (low time) |
| `--dm-danger` | `var(--dm-red-600)` | Timer colour (critical) |
| `--dm-font-size-3xl` | `1.875rem` | Timer display size |
[/table]

### Example Override

```css
/* Time colour thresholds set via JavaScript options */
```

[Full CSS Customisation Cheat-Sheet →](/showcase/elements/css-customisation)

## Related Components

Timer integrates seamlessly with other Domma components for complete timing solutions.

[showcase-demo id="showcase/elements/timer/related-components" title="Related Components" /]
