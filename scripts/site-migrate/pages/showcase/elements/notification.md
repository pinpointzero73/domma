---
title: Desktop Notification
description: "Browser native desktop notifications with permission handling and event callbacks"
layout: with-sidebar
status: published
sortOrder: 50
---

[hero title="Desktop Notification" tagline="Browser native desktop notifications with permission handling and event callbacks" align="center"][/hero]

## Overview

DesktopNotification provides a clean API wrapper around the browser's native Notification API, enabling desktop push notifications with proper permission handling, event callbacks, and instance management.

> **⚠️ Browser Requirements:** Desktop notifications require:  User permission (click "Request Permission" button below) Secure context (HTTPS or localhost) User interaction to trigger (cannot auto-show on page load) Browser support (not available in all browsers)  **Not seeing popups?** Notifications may be going to your system notification center (Windows Action Center, macOS Notification Center, etc.). Check your system tray or notification icon.

> **💡 Alternative:** If desktop notifications aren't working for you, consider using [Toast notifications](/showcase/elements/toast) instead - they appear directly in the page and don't require permissions.

### Key Features

- Browser native desktop notifications
- Automatic permission request handling
- Instance tracking with closeAll() capability
- Full event handler support (onClick, onClose, onError, onShow)
- Persistent notifications with requireInteraction
- Custom icons, badges, and tags
- Silent mode for no-sound notifications
- Graceful browser support detection

### When to Use Notifications

- **Timer/Alarm Completion**: Alert users when countdowns or scheduled events trigger
- **Real-time Updates**: New messages, comments, or activity notifications
- **Task Completion**: Background processes, file uploads, long-running operations
- **Reminders**: Meeting alerts, deadline warnings, scheduled tasks
- **System Events**: Connection status, errors, important system messages

### Basic Usage

```javascript
// Quick notification (static method)
Domma.elements.notify('Hello', {
    body: 'This is a notification!',
    icon: '/icon.png'
});

// Instance with full control
const notif = Domma.elements.notification({
    title: 'New Message',
    body: 'You have 3 unread messages',
    requireInteraction: true,
    onClick: (event, notificationInstance) => {
        console.log('Notification clicked!');
        window.focus();
    }
});

await notif.show();  // Returns promise
notif.close();       // Close manually
notif.isShown();     // Check state
```

## Quick Start

Show your first desktop notification in seconds. The API automatically handles permission requests.

### Simplest Notification

```javascript
// One-liner for quick notifications
Domma.elements.notify('Hello World!');

// With body text
Domma.elements.notify('Success', {
    body: 'Your changes have been saved'
});
```

[showcase-demo id="showcase/elements/notification/simplest-notification" title="Simplest Notification" /]

### Permission Handling

```javascript
// Check permission status
console.log(Domma.DesktopNotification.permission); // 'default', 'granted', 'denied'

// Request permission manually (optional - auto-requested on first show)
const permission = await Domma.DesktopNotification.requestPermission();

if (permission === 'granted') {
    Domma.elements.notify('Permission Granted!');
}
```

[showcase-demo id="showcase/elements/notification/permission-handling" title="Permission Handling" /]

## Step-by-Step Tutorial

Learn how to create notifications with full control over behaviour and appearance.

### Step 1: Create Notification Instance

```javascript
const notification = Domma.elements.notification({
    title: 'Meeting Reminder',
    body: 'Team standup in 5 minutes',
    icon: '/assets/calendar-icon.png',
    badge: '/assets/badge.png',
    tag: 'meeting-reminder',  // Reuse tag to replace existing
    requireInteraction: true  // Stays until user dismisses
});
```

### Step 2: Add Event Handlers

```javascript
const notification = Domma.elements.notification({
    title: 'New Message',
    body: 'Click to view',
    onClick: (event, notificationInstance) => {
        console.log('User clicked notification');
        window.focus();
        // Navigate to messages page
        window.location.href = '/messages';
    },
    onClose: (event, notificationInstance) => {
        console.log('Notification closed');
    },
    onShow: (event, notificationInstance) => {
        console.log('Notification shown');
    },
    onError: (error) => {
        console.error('Notification error:', error);
    }
});
```

### Step 3: Show and Control

```javascript
// Show the notification (async)
await notification.show();

// Check if shown
if (notification.isShown()) {
    console.log('Notification is visible');
}

// Close programmatically
setTimeout(() => {
    notification.close();
}, 5000);
```

[showcase-demo id="showcase/elements/notification/show-and-control" title="Step 3: Show and Control" /]

## Real-World Examples

### 1. Success/Error Notifications

```javascript
// Success notification
function notifySuccess(message) {
    Domma.elements.notify('Success', {
        body: message,
        icon: '/icons/success.png',
        tag: 'success'
    });
}

// Error notification
function notifyError(message) {
    Domma.elements.notify('Error', {
        body: message,
        icon: '/icons/error.png',
        tag: 'error',
        requireInteraction: true  // Don't auto-dismiss errors
    });
}

// Usage
notifySuccess('Profile updated successfully');
notifyError('Failed to upload file');
```

[showcase-demo id="showcase/elements/notification/1-success-error-notifications" title="1. Success/Error Notifications" /]

### 2. Integration with Timer

```javascript
// Notify when timer completes
const timer = Domma.elements.timer('#timer', {
    duration: 300000,  // 5 minutes
    onComplete: () => {
        Domma.elements.notify('Timer Complete!', {
            body: 'Your 5-minute timer has finished',
            requireInteraction: true,
            onClick: () => window.focus()
        });
    }
});
```

[showcase-demo id="showcase/elements/notification/2-integration-with-timer" title="2. Integration with Timer" /]

### 3. Multiple Notifications with Tracking

```javascript
// Create multiple notifications
const notifications = [];

for (let i = 0; i < 3; i++) {
    const notif = Domma.elements.notification({
        title: `Notification ${i + 1}`,
        body: `Message content ${i + 1}`,
        tag: `notification-${i}`  // Unique tag
    });

    notifications.push(notif);
    notif.show();
}

// Close all at once
Domma.DesktopNotification.closeAll();

// Or close specific one
notifications[0].close();
```

[showcase-demo id="showcase/elements/notification/3-multiple-notifications-with-tracking" title="3. Multiple Notifications with Tracking" /]

### 4. Silent Notifications

```javascript
// Silent notification (no sound)
Domma.elements.notify('Background Task Complete', {
    body: 'File has been processed',
    silent: true,  // No notification sound
    tag: 'background-task'
});
```

[showcase-demo id="showcase/elements/notification/4-silent-notifications" title="4. Silent Notifications" /]

### 5. Hybrid: Desktop with Toast Fallback (Recommended)

```javascript
// Smart notification that always shows something
async function smartNotify(title, options = {}) {
    // Try desktop notification first
    if (Domma.DesktopNotification.isSupported &&
        Domma.DesktopNotification.permission === 'granted') {

        Domma.elements.notify(title, {
            body: options.body,
            ...options.notificationOptions
        });
        return 'desktop';
    }

    // Fallback to toast (always visible in page)
    const message = options.body || title;
    const type = options.type || 'info';

    Domma.elements.toast[type](message, {
        duration: options.duration || 5000,
        position: 'top-right'
    });
    return 'toast';
}

// Usage - always shows something!
await smartNotify('Task Complete', {
    body: 'Your file has been uploaded',
    type: 'success'
});
```

[showcase-demo id="showcase/elements/notification/5-hybrid-desktop-with-toast-fallback-recommended" title="5. Hybrid: Desktop with Toast Fallback (Recommended)" /]

## Best Practices

### ✅ Do's

- **Use hybrid approach with Toast fallback** - Always provide visual feedback (see example above)
- **Request permission at appropriate time** - Ask when user performs related action, not on page load
- **Provide clear, concise messages** - Title should be 1-3 words, body should be one sentence
- **Use requireInteraction for important alerts** - Errors, critical warnings, time-sensitive actions
- **Add onClick handlers for actionable notifications** - Navigate user to relevant content
- **Use unique tags for related notifications** - Replace previous notification of same type
- **Check browser support** - Use DesktopNotification.isSupported before showing
- **Understand system behavior** - Notifications may go to system notification center, not always popup

### ❌ Don'ts

- **Don't spam notifications** - Batch updates, use debouncing for rapid events
- **Don't request permission on page load** - Users will likely deny without context
- **Don't rely solely on notifications** - They may be blocked or unavailable
- **Don't use for every action** - Reserve for important, time-sensitive events
- **Don't use long messages** - Keep title + body under 100 characters total
- **Don't forget to close** - Use tags to auto-replace or close programmatically

### Permission UX Pattern

```javascript
// Good: Explain before requesting
async function setupNotifications() {
    // Show in-app prompt first
    const userWantsNotifications = await showInAppPrompt(
        'Enable notifications to get alerts for timer completion?'
    );

    if (userWantsNotifications) {
        const permission = await Domma.DesktopNotification.requestPermission();

        if (permission === 'granted') {
            // Show confirmation
            Domma.elements.notify('Notifications Enabled!');
        } else {
            // Show fallback option
            Domma.elements.toast('Notifications blocked. You can enable them in settings.');
        }
    }
}
```

### Error Handling Pattern

```javascript
async function safeNotify(title, options = {}) {
    // Check support
    if (!Domma.DesktopNotification.isSupported) {
        console.warn('Notifications not supported');
        // Fallback to toast or banner
        Domma.elements.toast(title);
        return null;
    }

    // Check permission
    if (Domma.DesktopNotification.permission !== 'granted') {
        console.warn('Notification permission not granted');
        Domma.elements.toast(title);
        return null;
    }

    // Show notification with error handler
    const notif = Domma.elements.notification({
        title,
        ...options,
        onError: (error) => {
            console.error('Notification failed:', error);
            Domma.elements.toast(title); // Fallback
        }
    });

    await notif.show();
    return notif;
}
```

## Complete API Reference

### Factory Methods

```javascript
// Create notification instance
elements.notification(options)

// Quick notification (static method)
elements.notify(title, options)
```

### Options

[table striped="true"]
| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `title` | string | 'Notification' | Notification title (bold text) |
| `body` | string | '' | Notification body text |
| `icon` | string | null | URL to icon image |
| `badge` | string | null | URL to badge image (Android) |
| `tag` | string | null | Unique ID - replaces existing with same tag |
| `requireInteraction` | boolean | false | Stays visible until user dismisses |
| `silent` | boolean | false | No notification sound |
| `data` | any | null | Custom data attached to notification |
| `onClick` | function | null | Callback when notification is clicked |
| `onClose` | function | null | Callback when notification is closed |
| `onError` | function | null | Callback on error |
| `onShow` | function | null | Callback when notification is shown |
[/table]

### Instance Methods

```javascript
// Show notification (returns Promise)
await notification.show()

// Close notification
notification.close()

// Check if shown
notification.isShown()  // Returns boolean
```

### Static Methods

```javascript
// Request permission (returns Promise)
await DesktopNotification.requestPermission()

// Quick notification
DesktopNotification.notify(title, options)

// Close all active notifications
DesktopNotification.closeAll()
```

### Static Properties

```javascript
// Current permission state
DesktopNotification.permission  // 'default', 'granted', 'denied'

// Browser support check
DesktopNotification.isSupported  // boolean
```

## Declarative Configuration

While notifications are typically shown programmatically, you can use the config engine to set up notification triggers.

### Trigger Notification on Click

```javascript
$.setup({
    '#notify-button': {
        events: {
            click: (e, $el) => {
                Domma.elements.notify('Button Clicked', {
                    body: 'You clicked the notification button'
                });
            }
        }
    }
});
```

[showcase-demo id="showcase/elements/notification/trigger-notification-on-click" title="Trigger Notification on Click" /]

### Form Submission Notification

```javascript
$.setup({
    '#contact-form': {
        events: {
            submit: async (e, $el) => {
                e.preventDefault();

                // Submit form
                const response = await fetch('/api/contact', {
                    method: 'POST',
                    body: new FormData(e.target)
                });

                if (response.ok) {
                    Domma.elements.notify('Message Sent!', {
                        body: 'We will get back to you soon',
                        icon: '/icons/success.png'
                    });
                } else {
                    Domma.elements.notify('Error', {
                        body: 'Failed to send message',
                        requireInteraction: true
                    });
                }
            }
        }
    }
});
```

## CSS Customisation

Desktop notifications are browser-managed and do not use Domma CSS variables.

[table striped="true"]
| Variable | Default | Controls |
| --- | --- | --- |
| `--dm-primary` | `var(--dm-blue-600)` | Icon colour (browser-managed) |
[/table]

### Example Override

```css
/* Desktop notifications are browser-managed */
/* Override via JavaScript options (icon, badge) */
```

[Full CSS Customisation Cheat-Sheet →](/showcase/elements/css-customisation)

## Related Components

DesktopNotification works well with other Domma components for complete user feedback systems.

[showcase-demo id="showcase/elements/notification/related-components" title="Related Components" /]

### When to Use Each

- **DesktopNotification**: System-level alerts, background task completion, urgent updates even when tab inactive
- **Toast**: Quick in-app feedback, success confirmations, non-critical info
- **Modal**: Requires immediate user decision or attention, blocks interaction
- **Alert Banner**: Persistent warnings, system status, non-blocking info
