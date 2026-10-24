---
title: Progression
description: "Unified timeline and roadmap component with status tracking, progress visualization, and multiple layouts"
layout: with-sidebar
status: published
sortOrder: 50
---

[hero title="Progression" tagline="Unified timeline and roadmap component with status tracking, progress visualization, and multiple layouts" align="center"][/hero]

## Overview

The Progression component unifies Timeline and Roadmap functionality into a single, powerful component. Switch between **timeline mode** (chronological events) and **roadmap mode** (status-driven milestones) to visualize progress and plans.

### Key Features

- **Dual Modes** - Timeline (chronological) and Roadmap (status-driven)
- **Status Tracking** - Planned, in-progress, completed, blocked states
- **Progress Visualization** - Overall progress bar with percentage
- **Multiple Layouts** - Vertical, horizontal, centered
- **Priority Levels** - Low, medium, high, critical badges
- **Tags & Metadata** - Categorize with tags, assignees, dates
- **Themes** - Default, minimal, corporate, modern
- **Backwards Compatible** - Timeline component still works

### Basic Usage

```
// Timeline mode
const timeline = Domma.elements.progression('#timeline', {
    mode: 'timeline',
    items: [
        { year: '2024', title: 'Launch', description: 'Product launch' }
    ]
});

// Roadmap mode
const roadmap = Domma.elements.progression('#roadmap', {
    mode: 'roadmap',
    items: [
        {
            id: 'milestone-1',
            title: 'Feature X',
            status: 'in-progress',
            progress: 45,
            date: 'Q2 2026'
        }
    ],
    showProgress: true
});
```

## Timeline Mode

Timeline mode displays chronological events - perfect for history, milestones, and event sequences.

### Example Timeline

[showcase-demo id="showcase/elements/progression/example-timeline" title="Example Timeline" /]

```
Domma.elements.progression('#timeline-demo', {
    mode: 'timeline',
    items: [
        { year: '2020', title: 'Founded', description: 'Company established' },
        { year: '2021', title: 'Series A', description: 'Raised $5M funding' },
        { year: '2022', title: 'Product Launch', description: 'Released v1.0' },
        { year: '2023', title: 'Expansion', description: 'Opened 3 new offices' },
        { year: '2024', title: 'IPO', description: 'Went public on NASDAQ' }
    ],
    layout: 'vertical',
    theme: 'default'
});
```

## Roadmap Mode

Roadmap mode tracks project milestones with status indicators, progress tracking, and metadata.

### Example Roadmap

[showcase-demo id="showcase/elements/progression/example-roadmap" title="Example Roadmap" /]

```
Domma.elements.progression('#roadmap-demo', {
    mode: 'roadmap',
    items: [
        {
            id: 'research',
            title: 'Market Research',
            status: 'completed',
            date: 'Q1 2026',
            tags: ['research', 'planning']
        },
        {
            id: 'design',
            title: 'UI/UX Design',
            status: 'completed',
            date: 'Q1 2026',
            priority: 'high',
            assignee: 'Design Team'
        },
        {
            id: 'backend',
            title: 'Backend Development',
            status: 'in-progress',
            date: 'Q2 2026',
            progress: 65,
            priority: 'critical',
            tags: ['backend', 'api'],
            assignee: 'Engineering Team'
        },
        {
            id: 'frontend',
            title: 'Frontend Development',
            status: 'in-progress',
            date: 'Q2 2026',
            progress: 40,
            priority: 'high',
            tags: ['frontend', 'ui'],
            assignee: 'Frontend Team'
        },
        {
            id: 'testing',
            title: 'QA & Testing',
            status: 'planned',
            date: 'Q3 2026',
            priority: 'medium',
            tags: ['testing', 'qa']
        },
        {
            id: 'launch',
            title: 'Product Launch',
            status: 'planned',
            date: 'Q4 2026',
            priority: 'critical',
            tags: ['launch', 'marketing']
        }
    ],
    showProgress: true,
    progressPosition: 'top'
});
```

## Layouts

Progression supports three layouts: vertical (default), horizontal (scrollable), and centered (alternating).

### Centered Layout

[showcase-demo id="showcase/elements/progression/centered-layout" title="Centered Layout" /]

```
Domma.elements.progression('#layout-centered', {
    mode: 'timeline',
    layout: 'centered',
    items: [...]
});
```

## Interactive Roadmap

Enable `allowStatusChange: true` to allow users to cycle through statuses by clicking markers.

[showcase-demo id="showcase/elements/progression/interactive-roadmap" title="Interactive Roadmap" /]

```
Domma.elements.progression('#interactive-roadmap', {
    mode: 'roadmap',
    allowStatusChange: true,
    onStatusChange: (item, oldStatus, newStatus) => {
        console.log(`${item.title}: ${oldStatus} → ${newStatus}`);
    },
    items: [...]
});
```

## API Reference

### Options

[table striped="true"]
| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `mode` | String | `'timeline'` | 'timeline' or 'roadmap' |
| `items` | Array | `[]` | Array of item objects |
| `layout` | String | `'vertical'` | 'vertical', 'horizontal', 'centered' |
| `theme` | String | `'default'` | 'default', 'minimal', 'corporate', 'modern' |
| `showProgress` | Boolean | `true` | Show progress bar (roadmap mode) |
| `progressPosition` | String | `'top'` | 'top', 'bottom', 'none' |
| `allowStatusChange` | Boolean | `false` | Interactive status updates |
| `onStatusChange` | Function | `null` | Callback: (item, oldStatus, newStatus) |
[/table]

### Methods

[table striped="true"]
| Method | Description |
| --- | --- |
| `setItems(items)` | Replace all items |
| `addItem(item)` | Add single item |
| `updateItem(id, data)` | Update specific item |
| `removeItem(id)` | Remove item |
| `setStatus(id, status)` | Update item status (roadmap) |
| `getProgress()` | Get overall progress percentage |
| `markComplete(id)` | Mark item as completed |
| `markInProgress(id)` | Mark item as in-progress |
| `setCurrent(id)` | Highlight current item |
| `setMode(mode)` | Switch between timeline/roadmap |
[/table]

## Migration from Timeline

The `timeline()` component was removed in 0.58. Use `progression({ mode: 'timeline' })` instead - the options are the same.

### Old (removed in 0.58)

```
Domma.elements.timeline('#my-timeline', {
    items: [{ year: '2024', title: 'Event', description: '...' }]
});
```

### New (Recommended)

```
Domma.elements.progression('#my-timeline', {
    mode: 'timeline',
    items: [{ year: '2024', title: 'Event', description: '...' }]
});
```

> **Note:** The old `timeline()` method will show a deprecation warning in development mode. All CSS classes (`.dm-timeline-*`) remain supported for backwards compatibility.

## CSS Customisation

Override these CSS variables to customise Progression appearance and match your design system.

[table striped="true"]
| Variable | Default | Controls |
| --- | --- | --- |
| `--dm-success` | `var(--dm-green-600)` | Completed status colour |
| `--dm-info` | `var(--dm-sky-500)` | In-progress status colour |
| `--dm-warning` | `var(--dm-amber-500)` | Blocked status colour |
| `--dm-primary` | `var(--dm-blue-600)` | Planned status colour |
[/table]

### Example Override

```css
:root {
    /* Custom status colours */
    --dm-success: #10b981;
    --dm-info: #3b82f6;
}
```

[Full CSS Customisation Cheat-Sheet →](/showcase/elements/css-customisation)

## Related Elements

[showcase-demo id="showcase/elements/progression/related-elements" title="Related Elements" /]
