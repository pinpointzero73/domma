# CLAUDE.md - Storage Module Showcase

This file provides guidance for working with Storage module showcase examples.

## Storage Module Overview

Accessed via `Domma.storage` or `S` - provides a localStorage wrapper with auto JSON serialization and `domma:` key
prefix.

## Core Operations

```javascript
// Set value (auto-stringify objects)
S.set('user', {name: 'Alice', role: 'admin'});
S.set('count', 42);
S.set('active', true);

// Get value (auto-parse)
const user = S.get('user');  // {name: 'Alice', role: 'admin'}
const count = S.get('count'); // 42
const active = S.get('active'); // true

// Get with default value
const theme = S.get('theme', 'light');

// Remove value
S.remove('user');

// Check existence
if (S.has('user')) {
    console.log('User exists');
}

// Clear all Domma keys
S.clear();

// Get all keys
const keys = S.keys(); // ['domma:user', 'domma:count', ...]
```

## Utility Methods

```javascript
// Get size of stored value (in characters)
const size = S.size('user');

// Get total size of all Domma storage
const total = S.totalSize();

// Get all stored data
const allData = S.getAll();
// {user: {...}, count: 42, active: true}

// Set multiple values at once
S.setAll({
    user: {name: 'Alice'},
    theme: 'dark',
    language: 'en'
});

// Check if localStorage is available
if (S.isAvailable()) {
    console.log('localStorage is supported');
}
```

## Auto JSON Serialization

```javascript
// Objects
S.set('user', {name: 'Alice', role: 'admin'});
const user = S.get('user'); // Automatically parsed

// Arrays
S.set('items', [1, 2, 3, 4, 5]);
const items = S.get('items'); // [1, 2, 3, 4, 5]

// Nested structures
S.set('config', {
    theme: 'dark',
    settings: {
        notifications: true,
        language: 'en'
    }
});
```

## Key Prefix

All Domma storage keys are automatically prefixed with `domma:`:

```javascript
S.set('user', {name: 'Alice'});
// Stored as: localStorage['domma:user']

// Only Domma keys are affected by S.clear()
localStorage.setItem('other-key', 'value');
S.clear(); // 'other-key' remains untouched
```

## Showcase Example Template

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Storage Showcase - Domma</title>
    <link rel="stylesheet" href="../../../dist/domma-theme.css">
</head>
<body>
    <div class="container">
        <h1>Storage Module Showcase</h1>

        <div class="demo-section">
            <h2>Key-Value Storage</h2>

            <input type="text" id="key" class="form-control" placeholder="Key">
            <input type="text" id="value" class="form-control" placeholder="Value">

            <button id="save-btn" class="btn">Save</button>
            <button id="load-btn" class="btn">Load</button>
            <button id="remove-btn" class="btn btn-danger">Remove</button>

            <div id="output"></div>
        </div>
    </div>

    <script src="../../../dist/domma.min.js"></script>
    <script>
        // Always use S alias for storage
        $('#save-btn').on('click', () => {
            const key = $('#key').val();
            const value = $('#value').val();

            S.set(key, value);
            $('#output').html(`Saved: ${key} = ${value}`);
        });

        $('#load-btn').on('click', () => {
            const key = $('#key').val();
            const value = S.get(key, 'Not found');

            $('#output').html(`Loaded: ${key} = ${value}`);
        });

        $('#remove-btn').on('click', () => {
            const key = $('#key').val();
            S.remove(key);
            $('#output').html(`Removed: ${key}`);
        });

        // Display all stored keys
        $('#output').append(`<p>Stored keys: ${S.keys().join(', ')}</p>`);
    </script>
</body>
</html>
```

## Common Patterns

### User Preferences

```javascript
// Save preferences
function savePreferences(prefs) {
    S.set('preferences', prefs);
}

// Load preferences
function loadPreferences() {
    return S.get('preferences', {
        theme: 'light',
        language: 'en',
        notifications: true
    });
}

// Update single preference
function updatePreference(key, value) {
    const prefs = loadPreferences();
    prefs[key] = value;
    savePreferences(prefs);
}
```

### Session Management

```javascript
// Save session
function saveSession(user) {
    S.set('session', {
        userId: user.id,
        token: user.token,
        expiresAt: Date.now() + 3600000 // 1 hour
    });
}

// Check session
function isSessionValid() {
    const session = S.get('session');

    if (!session) return false;

    if (Date.now() > session.expiresAt) {
        S.remove('session');
        return false;
    }

    return true;
}

// Clear session
function logout() {
    S.remove('session');
}
```

### Cache Management

```javascript
// Cache with expiration
function cacheData(key, data, ttl = 3600000) { // Default 1 hour
    S.set(key, {
        data: data,
        expiresAt: Date.now() + ttl
    });
}

// Get cached data
function getCachedData(key) {
    const cached = S.get(key);

    if (!cached) return null;

    if (Date.now() > cached.expiresAt) {
        S.remove(key);
        return null;
    }

    return cached.data;
}

// Fetch with cache
async function fetchWithCache(url, ttl = 3600000) {
    const cacheKey = `cache:${url}`;
    const cached = getCachedData(cacheKey);

    if (cached) {
        return cached;
    }

    const data = await Domma.http.get(url);
    cacheData(cacheKey, data, ttl);

    return data;
}
```

### Form Auto-Save

```javascript
const formKey = 'draft:contact-form';

// Auto-save on input
$('#contact-form input, #contact-form textarea').on('input', _.debounce(function() {
    const formData = {
        name: $('#name').val(),
        email: $('#email').val(),
        message: $('#message').val()
    };

    S.set(formKey, formData);
}, 500));

// Restore on page load
$(document).ready(() => {
    const draft = S.get(formKey);

    if (draft) {
        $('#name').val(draft.name);
        $('#email').val(draft.email);
        $('#message').val(draft.message);

        // Offer to restore
        Domma.elements.confirm('Restore draft?').then(restore => {
            if (!restore) {
                S.remove(formKey);
            }
        });
    }
});

// Clear draft on submit
$('#contact-form').on('submit', () => {
    S.remove(formKey);
});
```

### Integration with Models

```javascript
// Model with manual persistence
const settings = M.create(schema, {}, {persist: 'app-settings'});

// Or use storage directly
const user = M.create(userSchema);

user.onChange(() => {
    S.set('user', user.toJSON());
});

// Load on init
const savedUser = S.get('user');
if (savedUser) {
    user.set(savedUser);
}
```

### Storage Quota Management

```javascript
function getStorageInfo() {
    const total = S.totalSize();
    const keys = S.keys().length;
    const data = S.getAll();

    const byKey = _.mapValues(data, (val, key) => {
        return S.size(key);
    });

    return {
        total: total,
        keys: keys,
        breakdown: _.orderBy(
            _.toPairs(byKey),
            1,
            'desc'
        )
    };
}

// Display storage usage
const info = getStorageInfo();
console.log(`Total storage: ${info.total} characters`);
console.log(`Total keys: ${info.keys}`);
console.log('Top 5 largest:');
_.take(info.breakdown, 5).forEach(([key, size]) => {
    console.log(`  ${key}: ${size} characters`);
});
```

## Related Documentation

- [Showcase Meta Guide](../CLAUDE.md)
- [Core Modules](../../../src/CLAUDE.md)
- [API Reference](../../../docs/API.md)
- [Models Module](../models/CLAUDE.md)
