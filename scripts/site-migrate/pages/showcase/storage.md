---
title: Storage
description: "Simple, prefixed localStorage with auto-serialisation and model persistence."
layout: with-sidebar
status: published
sortOrder: 50
---

[hero title="Storage" tagline="Simple, prefixed localStorage with auto-serialisation and model persistence." align="center"][/hero]

## Basic Operations

Store and retrieve data with automatic JSON serialisation. All keys are prefixed with `domma:` to avoid collisions.

get()

set()

remove()

has()

clear()

keys()

getAll()

setAll()

size()

totalSize()

isAvailable()

```javascript
// Set values (auto-stringify)
S.set('user', { name: 'Alice', role: 'admin' });
S.set('preferences', ['dark', 'compact']);
S.set('count', 42);

// Get values (auto-parse)
S.get('user');           // { name: 'Alice', role: 'admin' }
S.get('preferences');    // ['dark', 'compact']
S.get('missing', []);    // Default value if not found

// Check and manage
S.has('user');           // true
S.keys();                // ['user', 'preferences', 'count']
S.remove('count');
S.clear();               // Clear only Domma keys
```

[showcase-demo id="showcase/storage/try-it" title="Try It" /]

## Model Persistence

Models can automatically persist to localStorage. Data is saved on every change and restored when the model is created.

```javascript
// Create a persistent model
const settings = M.create({
    theme: { type: 'string', default: 'light' },
    fontSize: { type: 'number', default: 14 },
    notifications: { type: 'boolean', default: true }
}, {}, { persist: 'app-settings' });

// Changes auto-save to localStorage
settings.set('theme', 'dark');
settings.set('fontSize', 16);

// On page reload, data is automatically restored!

// Manual control
settings.save();           // Force save
settings.load();           // Force reload from storage
settings.clearStorage();   // Remove from localStorage
settings.reset(true);      // Reset and clear storage
```

[showcase-demo id="showcase/storage/persistent-settings" title="Persistent Settings" /]

## Storage Inspector

View all Domma storage keys in real-time.

[showcase-demo id="showcase/storage/storage-inspector" title="Storage Inspector" /]

## Method Reference

### Core Methods

[table striped="true"]
| get(key, default) | Retrieve and auto-parse a value. Returns default if not found. |
| --- | --- |
| set(key, value) | Store a value with auto-stringify. Returns true if successful. |
| remove(key) | Remove a key from storage. |
| has(key) | Check if a key exists. |
| clear() | Clear all Domma-prefixed keys. Returns count of cleared keys. |
| keys() | List all Domma keys (without prefix). |
[/table]

### Utility Methods

[table striped="true"]
| getAll() | Get all stored data as an object. |
| --- | --- |
| setAll(data) | Set multiple values at once from an object. |
| size(key) | Get size of a stored value in bytes. |
| totalSize() | Get total size of all Domma storage in bytes. |
| `isAvailable()` | `Check if localStorage is available.` |
[/table]

### Model Persistence Methods

[table striped="true"]
| model.save() | Manually save model to localStorage. |
| --- | --- |
| model.load() | Manually load model from localStorage. |
| model.clearStorage() | Remove model data from localStorage. |
| model.isPersisted() | Check if model has persistence enabled. |
| model.getPersistKey() | Get the persistence key. |
| model.reset(true) | Reset model and clear storage. |
[/table]
