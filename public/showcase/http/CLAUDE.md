# CLAUDE.md - HTTP Module Showcase

This file provides guidance for working with HTTP client showcase examples.

## HTTP Module Overview

Accessed via `Domma.http` - provides a fetch-based HTTP client that returns promises resolving to JSON.

## HTTP Methods

```javascript
// GET request
const data = await Domma.http.get('/api/users');
const user = await Domma.http.get('/api/users/123');

// POST request
const newUser = await Domma.http.post('/api/users', {
    name: 'Alice',
    email: 'alice@example.com'
});

// PUT request (update)
const updated = await Domma.http.put('/api/users/123', {
    name: 'Alice Smith'
});

// DELETE request
await Domma.http.delete('/api/users/123');
```

## Request Options

```javascript
// With custom headers
const data = await Domma.http.get('/api/data', {
    headers: {
        'Authorization': 'Bearer token123',
        'Content-Type': 'application/json'
    }
});

// With query parameters
const results = await Domma.http.get('/api/search', {
    params: {
        q: 'search term',
        limit: 10,
        offset: 0
    }
});

// With timeout
const data = await Domma.http.get('/api/slow', {
    timeout: 5000  // 5 seconds
});
```

## Error Handling

```javascript
try {
    const data = await Domma.http.get('/api/users');
    console.log('Success:', data);
} catch (error) {
    console.error('Error:', error.message);

    // Show error to user
    await Domma.elements.alert('Failed to load data: ' + error.message);
}
```

## Showcase Example Template

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>HTTP Showcase - Domma</title>
    <link rel="stylesheet" href="../../../dist/domma-theme.css">
</head>
<body>
    <div class="container">
        <h1>HTTP Module Showcase</h1>

        <div class="demo-section">
            <h2>API Integration</h2>
            <button id="fetch-btn" class="btn">Fetch Data</button>
            <div id="output"></div>
        </div>
    </div>

    <script src="../../../dist/domma.min.js"></script>
    <script>
        $('#fetch-btn').on('click', async () => {
            try {
                // Show loading
                const loader = Domma.elements.loader('#output', {
                    type: 'spinner',
                    text: 'Loading...'
                });
                loader.show();

                // Fetch data
                const users = await Domma.http.get('https://jsonplaceholder.typicode.com/users');

                // Hide loading
                loader.hide();

                // Display results
                const html = _.map(users, user => `
                    <div class="card">
                        <h3>${user.name}</h3>
                        <p>${user.email}</p>
                    </div>
                `).join('');

                $('#output').html(html);

            } catch (error) {
                await Domma.elements.alert('Error: ' + error.message);
            }
        });
    </script>
</body>
</html>
```

## Common Patterns

### CRUD Operations

```javascript
// Create
async function createUser(userData) {
    return await Domma.http.post('/api/users', userData);
}

// Read
async function getUser(id) {
    return await Domma.http.get(`/api/users/${id}`);
}

// Update
async function updateUser(id, userData) {
    return await Domma.http.put(`/api/users/${id}`, userData);
}

// Delete
async function deleteUser(id) {
    await Domma.http.delete(`/api/users/${id}`);
}
```

### Form Submission

```javascript
$('#form').on('submit', async function(e) {
    e.preventDefault();

    const formData = {
        name: $('#name').val(),
        email: $('#email').val()
    };

    try {
        const result = await Domma.http.post('/api/submit', formData);

        await Domma.elements.alert('Success!');

        // Clear form
        this.reset();

    } catch (error) {
        await Domma.elements.alert('Error: ' + error.message);
    }
});
```

### Pagination

```javascript
let currentPage = 1;
const pageSize = 10;

async function loadPage(page) {
    const data = await Domma.http.get('/api/items', {
        params: {
            page: page,
            limit: pageSize
        }
    });

    displayItems(data.items);
    updatePagination(data.totalPages);
}

$('#next-btn').on('click', () => {
    currentPage++;
    loadPage(currentPage);
});
```

### With Loading States

```javascript
async function fetchWithLoading(url) {
    const loader = Domma.elements.fullscreenLoader('Loading...');

    try {
        const data = await Domma.http.get(url);
        return data;
    } finally {
        loader.hide();
    }
}

const users = await fetchWithLoading('/api/users');
```

### Integration with Models

```javascript
const userModel = M.create({
    name: {type: M.types.string},
    email: {type: M.types.string}
}, {}, {persist: 'user'});

// Load from API
async function syncUser(id) {
    const data = await Domma.http.get(`/api/users/${id}`);
    userModel.set(data);
    userModel.save(); // Save to localStorage
}

// Save to API
async function saveUser() {
    const userData = userModel.toJSON();
    await Domma.http.put(`/api/users/${userData.id}`, userData);
}
```

### Retry Logic

```javascript
async function fetchWithRetry(url, retries = 3) {
    for (let i = 0; i < retries; i++) {
        try {
            return await Domma.http.get(url);
        } catch (error) {
            if (i === retries - 1) throw error;
            await _.delay(1000 * (i + 1)); // Exponential backoff
        }
    }
}
```

### Batch Requests

```javascript
async function fetchMultiple(ids) {
    const promises = ids.map(id =>
        Domma.http.get(`/api/users/${id}`)
    );

    return await Promise.all(promises);
}

const users = await fetchMultiple([1, 2, 3, 4, 5]);
```

### Search with Debounce

```javascript
const debouncedSearch = _.debounce(async (query) => {
    if (!query) return;

    const results = await Domma.http.get('/api/search', {
        params: {q: query}
    });

    displayResults(results);
}, 300);

$('#search-input').on('keyup', function() {
    debouncedSearch($(this).val());
});
```

## Related Documentation

- [Showcase Meta Guide](../CLAUDE.md)
- [Core Modules](../../../src/CLAUDE.md)
- [API Reference](../../../docs/API.md)
