---
title: Cookie Consent
description: "GDPR-compliant cookie consent management with multiple categories, persistence, and customizable styling"
layout: with-sidebar
status: published
sortOrder: 50
---

[hero title="Cookie Consent" tagline="GDPR-compliant cookie consent management with multiple categories, persistence, and customizable styling" align="center"][/hero]

## Overview

GDPR-compliant cookie consent management with full customization options. The Cookie Consent component provides a flexible, user-friendly interface for managing cookie preferences with support for multiple categories, persistence, and customizable styling.

### Key Features

- GDPR and CCPA compliant cookie management
- Customizable cookie categories (necessary, performance, marketing, etc.)
- Multiple position and layout options
- localStorage persistence with configurable expiry
- Light and dark theme support
- Config Engine compatible for declarative setup
- Promise-based API for programmatic control
- Reopen trigger support for preference management

### When to Use Cookie Consent

- **Legal Compliance**: Required for GDPR compliance in EU regions
- **User Privacy**: Giving users control over their data
- **Analytics Management**: Conditional loading of tracking scripts
- **Marketing Tools**: Managing third-party advertising cookies
- **Personalization**: Storing user preferences with consent

### Basic Usage

```javascript
// Initialize cookie consent
const consent = Domma.elements.cookieConsent({
    message: 'We use cookies to improve your experience.',
    privacyPolicyUrl: '/privacy',
    onAccept: (preferences) => {
        console.log('Cookies accepted:', preferences);
    }
});

// Show the consent bar
consent.show();
```

## Getting Started

Add GDPR-compliant cookie consent to your page in two simple steps

### Step 1: Include Domma

Add Domma CSS and JavaScript to your page:

```
<!-- CSS -->
<link rel="stylesheet" href="dist/domma.css">
<link rel="stylesheet" href="dist/elements.css">

<!-- JavaScript -->
<script src="dist/domma.min.js"></script>
```

### Step 2: Initialize Cookie Consent

Call `Domma.elements.cookieConsent()` to create and show the consent banner:

```
const consent = Domma.elements.cookieConsent({
    message: 'We use cookies to improve your experience.',
    privacyPolicyUrl: '/privacy-policy',
    autoShow: true,   // Automatically show on page load
    onAccept: (preferences) => {
        // User accepted cookies
        console.log('Accepted:', preferences);
    },
    onReject: () => {
        // User rejected cookies
        console.log('Cookies rejected');
    }
});
```

> **Note:** The cookie consent component auto-generates the consent UI (no HTML required). It handles storage of user preferences in localStorage, respects user choices, and provides callbacks for when cookies are accepted or rejected. Set `autoShow: true` to display automatically on page load.

## Basic Examples

### Example 1: Simple Consent Bar

Simple cookie consent bar at the bottom of the page with default settings.

[showcase-demo id="showcase/elements/cookie-consent/simple-consent-bar" title="Example 1: Simple Consent Bar" /]

```javascript
// Basic cookie consent
const consent = Domma.elements.cookieConsent({
    message: 'We use cookies to improve your experience.',
    privacyPolicyUrl: '/privacy',
    storageKey: 'demo-basic-consent',
    autoShow: false,
    onAccept: (preferences) => {
        console.log('Cookies accepted:', preferences);
    }
});

consent.show();
```

## Custom Categories

### Granular Cookie Control

Cookie consent with customizable categories for granular control.

[showcase-demo id="showcase/elements/cookie-consent/granular-cookie-control" title="Granular Cookie Control" /]

```javascript
// Custom categories
const consent = Domma.elements.cookieConsent({
    categories: {
        necessary: {
            label: 'Essential Cookies',
            description: 'Required for core functionality.',
            required: true
        },
        performance: {
            label: 'Performance Cookies',
            description: 'Help us improve site speed.',
            required: false
        },
        marketing: {
            label: 'Marketing Cookies',
            description: 'Used for targeted advertising.',
            required: false
        }
    },
    onAccept: (preferences) => {
        // Handle category-specific preferences
        if (preferences.performance) {
            // Enable performance tracking
        }
        if (preferences.marketing) {
            // Enable marketing cookies
        }
    }
});
```

## Position & Layout Variants

### Position Options

Different positions and layouts for the cookie consent UI.

[showcase-demo id="showcase/elements/cookie-consent/position-options" title="Position Options" /]

```javascript
// Position variants
Domma.elements.cookieConsent({
    position: 'bottom-right',  // or 'top', 'bottom-left', 'center-modal'
    layout: 'box',             // or 'bar', 'modal'
    theme: 'dark',             // or 'light', 'auto'
    animation: true,
    backdrop: true             // For modal layout
});
```

## Config Engine Integration

### Declarative Setup

Initialize cookie consent using Domma's declarative config engine.

[showcase-demo id="showcase/elements/cookie-consent/declarative-setup" title="Declarative Setup" /]

```javascript
// Using Config Engine
$.setup({
    'body': {
        component: 'cookieConsent',
        options: {
            message: 'This site uses cookies...',
            categories: {
                analytics: {
                    label: 'Analytics',
                    description: 'Help us understand usage',
                    required: false
                }
            },
            privacyPolicyUrl: '/privacy-policy',
            position: 'bottom',
            theme: 'dark',
            onAccept: (preferences) => {
                console.log('Configured consent accepted:', preferences);
            }
        }
    }
});
```

## API Methods

### Programmatic Control

Full programmatic control of the cookie consent component.

[showcase-demo id="showcase/elements/cookie-consent/programmatic-control" title="Programmatic Control" /]

```javascript
// API Methods
const consent = Domma.elements.cookieConsent(options);

consent.show();              // Show consent UI
consent.hide();              // Hide consent UI
consent.accept();            // Accept all cookies
consent.reject();            // Reject non-essential cookies
consent.showCustomize();     // Open preferences modal
consent.getState();          // Get current state
consent.getPreferences();    // Get cookie preferences
consent.isAccepted('analytics'); // Check specific category
consent.reset();             // Clear saved preferences
consent.destroy();           // Remove component
```

## Reopen Trigger

### User-Initiated Preference Management

Allow users to reopen cookie preferences after initial consent.

[showcase-demo id="showcase/elements/cookie-consent/user-initiated-preference-management" title="User-Initiated Preference Management" /]

```javascript
// Reopen trigger
Domma.elements.cookieConsent({
    reopenSelector: '[data-cookie-consent-open]',
    // ... other options
});

// In HTML:
<a href="#" data-cookie-consent-open>Cookie Settings</a>
```

## CSS Customisation

Override these CSS variables to customise Cookie Consent appearance and match your design system.

[table striped="true"]
| Variable | Default | Controls |
| --- | --- | --- |
| `--dm-primary` | `var(--dm-blue-600)` | Accept button colour |
| `--dm-surface` | `var(--dm-white)` | Banner background |
| `--dm-border` | `var(--dm-slate-300)` | Banner border |
| `--dm-shadow-lg` | `0 10px 15px...` | Banner shadow |
[/table]

### Example Override

```css
:root {
    /* Dark cookie banner */
    --dm-surface: #1e293b;
    --dm-text: #f1f5f9;
}
```

[Full CSS Customisation Cheat-Sheet →](/showcase/elements/css-customisation)
