---
title: Alarm
description: "Scheduled time-based alert system with localStorage persistence and repeat patterns"
layout: with-sidebar
status: published
sortOrder: 50
---

[hero title="Alarm" tagline="Scheduled time-based alert system with localStorage persistence and repeat patterns" align="center"][/hero]

## Overview

Alarm is a scheduled time-based alert system with localStorage persistence. Set alarms for specific times with repeat patterns, and they'll trigger even after page refresh or browser restart.

### Key Features

- localStorage persistence - survives page reloads and browser restarts
- Singleton pattern - one instance manages all alarms globally
- Flexible repeat patterns: daily, weekdays, weekends, custom days, one-time
- Desktop notification integration when alarms trigger
- Optional sound playback on alarm trigger
- Snooze functionality with configurable duration
- Enable/disable individual alarms without deletion
- Automatic one-time alarm disabling after trigger
- Next alarm calculation and scheduling

### When to Use Alarms

- **Daily Routines**: Morning routine, meal times, medication reminders
- **Work Schedule**: Meeting reminders, break times, end of day alerts
- **Time Management**: Task deadlines, time blocking, focus periods
- **Fitness & Health**: Workout times, water intake, posture checks
- **Recurring Events**: Weekly team calls, monthly reports, quarterly reviews

### Basic Usage

```javascript
// Create alarm manager (singleton)
const alarms = Domma.elements.alarm({
    onTrigger: (alarm) => {
        console.log('Alarm triggered:', alarm);
    }
});

// Add an alarm
alarms.add({
    time: '09:00',              // 24-hour format
    label: 'Morning Standup',
    repeat: 'weekdays',         // Monday-Friday
    notification: true
});

// Alarms persist automatically to localStorage
// They'll trigger even after browser restart!
```

## Quick Start

Set your first alarm in seconds. Alarms persist automatically.

### Simplest One-Time Alarm

```javascript
// Create alarm manager
const alarms = Domma.elements.alarm();

// Add one-time alarm (1 minute from now)
const now = new Date();
now.setMinutes(now.getMinutes() + 1);
const time = `${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}`;

alarms.add({
    time: time,
    label: 'Quick Reminder',
    notification: true
});
```

[showcase-demo id="showcase/elements/alarm/simplest-one-time-alarm" title="Simplest One-Time Alarm" /]

### Simplest Daily Alarm

```javascript
// Daily morning alarm
alarms.add({
    time: '08:00',
    label: 'Morning Routine',
    repeat: 'daily',
    notification: true
});
```

[showcase-demo id="showcase/elements/alarm/simplest-daily-alarm" title="Simplest Daily Alarm" /]

## Step-by-Step Tutorial

Build a complete alarm system with multiple alarms, notifications, and management UI.

### Step 1: Initialize Alarm Manager

```javascript
const alarmManager = Domma.elements.alarm({
    storageKey: 'my-app-alarms',  // Custom storage key
    checkInterval: 30000,          // Check every 30 seconds
    onTrigger: (alarm) => {
        console.log('Alarm triggered:', alarm);
        // Show visual feedback
        showAlarmModal(alarm);
    },
    onAlarmAdd: (alarm) => {
        console.log('Alarm added:', alarm);
        updateAlarmList();
    },
    onAlarmRemove: (alarm) => {
        console.log('Alarm removed:', alarm);
        updateAlarmList();
    }
});
```

### Step 2: Add Multiple Alarms

```javascript
// Morning routine
alarmManager.add({
    time: '07:00',
    label: 'Wake Up',
    repeat: 'weekdays',
    notification: true,
    notificationOptions: {
        title: 'Good Morning!',
        body: 'Time to start your day',
        requireInteraction: true
    }
});

// Lunch break
alarmManager.add({
    time: '12:30',
    label: 'Lunch Break',
    repeat: 'weekdays',
    notification: true
});

// End of work
alarmManager.add({
    time: '17:00',
    label: 'End of Workday',
    repeat: 'weekdays',
    notification: true
});
```

### Step 3: Display and Manage Alarms

```javascript
function updateAlarmList() {
    const alarms = alarmManager.getAlarms();
    const listEl = $('#alarm-list')[0];

    listEl.innerHTML = alarms.map(alarm => `
        
            
                ${alarm.time}
                ${alarm.label}
                ${getRepeatText(alarm.repeat)}
            
            
                
                    ${alarm.enabled ? 'Disable' : 'Enable'}
                
                Delete
            
        
    `).join('');
}

function toggleAlarm(id) {
    alarmManager.toggle(id);
    updateAlarmList();
}

function deleteAlarm(id) {
    alarmManager.remove(id);
    updateAlarmList();
}
```

[showcase-demo id="showcase/elements/alarm/tutorial-demo-alarm-manager" title="Tutorial Demo: Alarm Manager" /]

## Real-World Examples

### 1. Workday Schedule

```javascript
const workdayAlarms = [
    { time: '09:00', label: 'Morning Standup', repeat: 'weekdays' },
    { time: '10:30', label: 'Focus Time Starts', repeat: 'weekdays' },
    { time: '12:00', label: 'Lunch Break', repeat: 'weekdays' },
    { time: '15:00', label: 'Afternoon Check-in', repeat: 'weekdays' },
    { time: '17:00', label: 'End of Day', repeat: 'weekdays' }
];

const alarms = Domma.elements.alarm();
workdayAlarms.forEach(alarm => {
    alarms.add({
        ...alarm,
        notification: true,
        notificationOptions: {
            requireInteraction: true
        }
    });
});
```

[showcase-demo id="showcase/elements/alarm/1-workday-schedule" title="1. Workday Schedule" /]

### 2. Fitness Reminders

```javascript
// Custom workout schedule
alarms.add({
    time: '06:30',
    label: 'Morning Workout',
    repeat: ['mon', 'wed', 'fri'],  // Custom days
    notification: true,
    sound: true,
    soundUrl: '/sounds/workout-bell.mp3'
});

alarms.add({
    time: '12:00',
    label: 'Lunchtime Walk',
    repeat: 'weekdays',
    notification: true
});

alarms.add({
    time: '15:00',
    label: 'Posture Check',
    repeat: 'daily',
    notification: true
});
```

[showcase-demo id="showcase/elements/alarm/2-fitness-reminders" title="2. Fitness Reminders" /]

### 3. Medication Reminders

```javascript
const medications = [
    { time: '08:00', label: 'Morning Medication', repeat: 'daily' },
    { time: '20:00', label: 'Evening Medication', repeat: 'daily' }
];

medications.forEach(med => {
    alarms.add({
        ...med,
        notification: true,
        notificationOptions: {
            title: 'Medication Reminder',
            body: med.label,
            requireInteraction: true,  // Must be acknowledged
            icon: '/icons/medical.png'
        }
    });
});
```

[showcase-demo id="showcase/elements/alarm/3-medication-reminders" title="3. Medication Reminders" /]

### 4. Snooze Functionality

```javascript
const alarms = Domma.elements.alarm({
    onTrigger: async (alarm) => {
        // Show modal with snooze option
        const result = await Domma.elements.confirm(
            `Alarm: ${alarm.label}\nSnooze for 10 minutes?`,
            {
                title: 'Alarm Triggered',
                confirmText: 'Snooze',
                cancelText: 'Dismiss'
            }
        );

        if (result) {
            // Snooze for 10 minutes
            alarms.snooze(alarm.id, 600000);
            console.log('Alarm snoozed');
        } else {
            // User dismissed - alarm will re-trigger based on repeat
            console.log('Alarm dismissed');
        }
    }
});
```

[showcase-demo id="showcase/elements/alarm/4-snooze-functionality" title="4. Snooze Functionality" /]

## Best Practices

### ✅ Do's

- **Use 24-hour time format** - Alarms use HH:MM format (00:00 to 23:59)
- **Provide descriptive labels** - Help users identify alarms in the list
- **Use appropriate repeat patterns** - weekdays for work, daily for habits, custom for flexible schedules
- **Enable requireInteraction for important alarms** - Medication, meetings, critical tasks
- **Implement snooze for user convenience** - Give users option to delay alarms
- **Show next alarm prominently** - Use getNextAlarm() to display upcoming alert
- **Provide alarm management UI** - List, enable/disable, delete options
- **Test alarm timing** - Set test alarms 1-2 minutes ahead to verify functionality

### ❌ Don'ts

- **Don't set too many alarms** - Users will experience alarm fatigue
- **Don't use 12-hour time** - Always convert to 24-hour format (14:30 not 2:30 PM)
- **Don't forget to disable one-time alarms** - System auto-disables after trigger
- **Don't rely solely on alarms for critical timing** - Consider server-side scheduling
- **Don't use very short check intervals** - 30-60 seconds is sufficient, 5s wastes CPU
- **Don't override user's alarm preferences** - Let users manage their own alarms

### Persistence Pattern

```javascript
// Alarms automatically persist, but good to verify
function setupAlarms() {
    const alarms = Domma.elements.alarm();

    // Check if alarms already exist (from previous session)
    const existing = alarms.getAlarms();

    if (existing.length === 0) {
        // First time setup
        setupDefaultAlarms(alarms);
    } else {
        // Alarms loaded from localStorage
        console.log(`Loaded ${existing.length} alarms from storage`);
        displayAlarms(existing);
    }
}
```

### Next Alarm Display Pattern

```javascript
function showNextAlarm() {
    const alarms = Domma.elements.alarm();
    const next = alarms.getNextAlarm();

    if (next) {
        const triggerDate = new Date(next.nextTrigger);
        const timeUntil = triggerDate - new Date();
        const hours = Math.floor(timeUntil / 3600000);
        const minutes = Math.floor((timeUntil % 3600000) / 60000);

        $('#next-alarm')[0].innerHTML = `
            Next Alarm: ${next.label}
            In ${hours}h ${minutes}m (${next.time})
        `;
    } else {
        $('#next-alarm')[0].textContent = 'No alarms set';
    }
}

// Update every minute
setInterval(showNextAlarm, 60000);
showNextAlarm();
```

## Complete API Reference

### Factory Method

```javascript
// Singleton - always returns same instance
elements.alarm(options)
```

### Options

[table striped="true"]
| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `alarms` | array | [] | Initial alarms to add (if not in storage) |
| `timezone` | string | 'local' | Timezone for alarm calculations |
| `checkInterval` | number | 30000 | Check frequency in milliseconds |
| `storageKey` | string | 'domma-alarms' | localStorage key for persistence |
| `onTrigger` | function | null | Callback when alarm triggers (alarm) |
| `onSnooze` | function | null | Callback when alarm snoozed (alarm, duration) |
| `onAlarmAdd` | function | null | Callback when alarm added (alarm) |
| `onAlarmRemove` | function | null | Callback when alarm removed (alarm) |
[/table]

### Alarm Object Structure

```javascript
{
    id: 'alarm-1',              // Auto-generated
    time: '14:30',              // HH:MM format (24-hour)
    label: 'Meeting',           // Alarm description
    enabled: true,              // Active state
    repeat: 'weekdays',         // Repeat pattern (see below)
    notification: true,         // Show desktop notification
    notificationOptions: {},    // Notification API options
    sound: false,               // Play sound on trigger
    soundUrl: null,             // URL to sound file
    lastTriggered: 1234567890,  // Timestamp of last trigger
    snoozedUntil: null          // Snooze expiration timestamp
}
```

### Repeat Patterns

```javascript
// String patterns
'daily'           // Every day
'weekdays'        // Monday-Friday
'weekends'        // Saturday-Sunday

// Array of days (lowercase, 3-letter)
['mon', 'wed', 'fri']  // Custom days
['tue', 'thu']         // Tuesday and Thursday

// One-time alarm
null              // No repeat (auto-disables after trigger)
```

### Instance Methods

```javascript
// Add/Remove alarms
alarms.add(alarm)           // Returns alarm with id
alarms.remove(id)           // Returns boolean
alarms.update(id, changes)  // Returns updated alarm or null

// Enable/Disable
alarms.enable(id)           // Returns boolean
alarms.disable(id)          // Returns boolean
alarms.toggle(id)           // Returns new enabled state

// Snooze
alarms.snooze(id, duration) // Duration in ms, default 300000 (5 min)

// Query
alarms.getAlarms()          // Returns array of all alarms
alarms.getAlarm(id)         // Returns alarm or null
alarms.getNextAlarm()       // Returns next alarm with nextTrigger date

// Management
alarms.clearAll()           // Remove all alarms
alarms.destroy()            // Stop checking and cleanup
```

## Declarative Configuration

While alarms are typically managed programmatically, you can initialize the alarm system via config.

### Initialize with Default Alarms

```javascript
$.setup({
    body: {
        // No selector needed - alarm is singleton
    }
});

// Then use programmatically
const alarms = Domma.elements.alarm({
    alarms: [
        { time: '09:00', label: 'Daily Standup', repeat: 'weekdays' },
        { time: '17:00', label: 'End of Day', repeat: 'weekdays' }
    ],
    onTrigger: (alarm) => {
        Domma.elements.notify(alarm.label, {
            body: `Alarm at ${alarm.time}`,
            requireInteraction: true
        });
    }
});
```

## CSS Customisation

Override these CSS variables to customise Alarm appearance and match your design system.

[table striped="true"]
| Variable | Default | Controls |
| --- | --- | --- |
| `--dm-success` | `var(--dm-green-600)` | Active alarm colour |
| `--dm-warning` | `var(--dm-amber-500)` | Upcoming alarm colour |
| `--dm-secondary` | `var(--dm-slate-600)` | Disabled alarm colour |
| `--dm-surface` | `var(--dm-white)` | Alarm card background |
[/table]

### Example Override

```css
:root {
    /* Custom alarm colours */
    --dm-success: #10b981;
    --dm-warning: #f59e0b;
}
```

[Full CSS Customisation Cheat-Sheet →](/showcase/elements/css-customisation)

## Related Components

Alarm works seamlessly with other Domma components for complete scheduling solutions.

[showcase-demo id="showcase/elements/alarm/related-components" title="Related Components" /]

### When to Use Each

- **Alarm**: Scheduled events at specific times of day (09:00, 14:30, etc.)
- **Timer**: Countdown from current time (5 minutes from now, 1 hour, etc.)
- **Notification**: Immediate desktop alerts for any event
