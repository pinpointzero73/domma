---
title: HTTP Client
description: "Fetch-based HTTP client for making API requests with Promises and async/await support."
layout: with-sidebar
status: published
sortOrder: 50
---

[hero title="HTTP Client" tagline="Fetch-based HTTP client for making API requests with Promises and async/await support." align="center"][/hero]

## Overview

`Domma.http` provides a simple, Promise-based HTTP client built on the Fetch API. All methods return Promises that resolve to parsed JSON responses.

> **Note:** All requests automatically set `Content-Type: application/json` and parse responses as JSON.

## API Reference

[table striped="true"]
| Method | Signature | Description |
| --- | --- | --- |
| GET | `http.get(url, config)` | Fetch data from a URL |
| POST | `http.post(url, data, config)` | Send data to create a resource |
| PUT | `http.put(url, data, config)` | Send data to fully replace a resource |
| PATCH | `http.patch(url, data, config)` | Send data to partially update a resource |
| DELETE | `http.delete(url, config)` | Delete a resource |
[/table]

### Config Options

The `config` parameter accepts any valid [fetch options](https://developer.mozilla.org/en-US/docs/Web/API/fetch#options):

```javascript
{
    headers: {
        'Authorization': 'Bearer token123',
        'X-Custom-Header': 'value'
    },
    mode: 'cors',
    credentials: 'include'
}
```

## GET Fetch Data

Fetch posts from JSONPlaceholder API:

[showcase-demo id="showcase/http/get-fetch-data" title="GET Fetch Data" /]

## POST Create Resource

Create a new post (simulated with JSONPlaceholder):

[showcase-demo id="showcase/http/post-create-resource" title="POST Create Resource" /]

## PUT Update Resource

Update an existing post:

[showcase-demo id="showcase/http/put-update-resource" title="PUT Update Resource" /]

## PATCH Partial Update

Update only specific fields without replacing the entire resource:

> **PUT vs PATCH:** `PUT` replaces the entire resource, while `PATCH` only updates the specified fields. Use PATCH for efficiency when updating single fields.

[showcase-demo id="showcase/http/patch-partial-update" title="PATCH Partial Update" /]

## DELETE Delete Resource

Delete a post:

[showcase-demo id="showcase/http/delete-delete-resource" title="DELETE Delete Resource" /]

## Error Handling

Handle errors with try/catch:

[showcase-demo id="showcase/http/error-handling" title="Error Handling" /]

## Custom Headers

Add custom headers to your requests:

```javascript
// Add authorization header
const data = await Domma.http.get('/api/protected', {
    headers: {
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIs...',
        'X-Request-ID': 'abc123'
    }
});

// Custom content type
const xml = await Domma.http.post('/api/xml', xmlData, {
    headers: {
        'Content-Type': 'application/xml'
    }
});
```

## Service Layer & Configuration Patterns

Organize API requests using service layer classes and centralized configuration for better maintainability and testability.

### API Service Class

```javascript
// Create a service class for your API
class UserService {
    constructor(baseURL = '/api') {
        this.baseURL = baseURL;
    }

    async getAll() {
        return Domma.http.get(`${this.baseURL}/users`);
    }

    async getById(id) {
        return Domma.http.get(`${this.baseURL}/users/${id}`);
    }

    async create(userData) {
        return Domma.http.post(`${this.baseURL}/users`, userData);
    }

    async update(id, userData) {
        return Domma.http.put(`${this.baseURL}/users/${id}`, userData);
    }

    async delete(id) {
        return Domma.http.delete(`${this.baseURL}/users/${id}`);
    }

    async search(query) {
        return Domma.http.get(`${this.baseURL}/users/search?q=${encodeURIComponent(query)}`);
    }
}

// Usage
const userService = new UserService();
const users = await userService.getAll();
const user = await userService.getById(123);
```

### Centralized API Configuration

```javascript
// Define all API endpoints in config
const apiConfig = {
    baseURL: 'https://api.example.com',
    endpoints: {
        users: {
            list: '/users',
            get: '/users/:id',
            create: '/users',
            update: '/users/:id',
            delete: '/users/:id'
        },
        posts: {
            list: '/posts',
            get: '/posts/:id',
            byUser: '/users/:userId/posts'
        }
    },
    headers: {
        'Authorization': 'Bearer token123',
        'X-App-Version': '1.0.0'
    }
};

// Generic API client
class APIClient {
    constructor(config) {
        this.config = config;
    }

    buildURL(endpoint, params = {}) {
        let url = this.config.baseURL + endpoint;
        // Replace :param placeholders
        Object.entries(params).forEach(([key, value]) => {
            url = url.replace(`:${key}`, value);
        });
        return url;
    }

    async request(method, endpoint, data = null, params = {}) {
        const url = this.buildURL(endpoint, params);
        const options = { headers: this.config.headers };

        if (method === 'GET') {
            return Domma.http.get(url, options);
        } else if (method === 'POST') {
            return Domma.http.post(url, data, options);
        } else if (method === 'PUT') {
            return Domma.http.put(url, data, options);
        } else if (method === 'DELETE') {
            return Domma.http.delete(url, options);
        }
    }
}

// Usage
const api = new APIClient(apiConfig);

// Get user by ID
const user = await api.request('GET', apiConfig.endpoints.users.get, null, { id: 123 });

// Create new user
const newUser = await api.request('POST', apiConfig.endpoints.users.create, {
    name: 'Alice',
    email: 'alice@example.com'
});
```

### Using $.setup() for API Interactions

```javascript
// Declaratively handle API-driven UI interactions
$.setup({
    '#user-list': {
        events: {
            ready: async (e, $el) => {
                // Load users when component ready
                const users = await userService.getAll();
                const html = users.map(u => `
                    
                        ${u.name}
                        ${u.email}
                        Edit
                        Delete
                    
                `).join('');
                $el.html(html);
            }
        }
    },

    '#user-form': {
        events: {
            submit: async (e, $el) => {
                e.preventDefault();

                const formData = {
                    name: $el.find('[name="name"]').val(),
                    email: $el.find('[name="email"]').val()
                };

                try {
                    const user = await userService.create(formData);
                    Domma.elements.toast.success('User created!');
                    $('#user-list').trigger('reload');
                } catch (err) {
                    Domma.elements.toast.error('Failed: ' + err.message);
                }
            }
        }
    },

    '#search-users': {
        events: {
            input: _.debounce(async (e, $el) => {
                const query = $el.val();
                if (query.length < 3) return;

                const results = await userService.search(query);
                $('#search-results').html(
                    results.map(u => `${u.name}`).join('')
                );
            }, 300)
        }
    }
});
```

### Request/Response Interceptor Pattern

```javascript
// Wrap Domma.http with interceptors
class HTTPClient {
    constructor() {
        this.requestInterceptors = [];
        this.responseInterceptors = [];
        this.errorInterceptors = [];
    }

    addRequestInterceptor(fn) {
        this.requestInterceptors.push(fn);
    }

    addResponseInterceptor(fn) {
        this.responseInterceptors.push(fn);
    }

    addErrorInterceptor(fn) {
        this.errorInterceptors.push(fn);
    }

    async request(method, url, data = null, config = {}) {
        // Run request interceptors
        for (const interceptor of this.requestInterceptors) {
            config = await interceptor(config);
        }

        try {
            // Make request
            let response;
            if (method === 'GET') {
                response = await Domma.http.get(url, config);
            } else if (method === 'POST') {
                response = await Domma.http.post(url, data, config);
            } else if (method === 'PUT') {
                response = await Domma.http.put(url, data, config);
            } else if (method === 'DELETE') {
                response = await Domma.http.delete(url, config);
            }

            // Run response interceptors
            for (const interceptor of this.responseInterceptors) {
                response = await interceptor(response);
            }

            return response;
        } catch (error) {
            // Run error interceptors
            for (const interceptor of this.errorInterceptors) {
                error = await interceptor(error);
            }
            throw error;
        }
    }
}

// Usage
const client = new HTTPClient();

// Add auth header to all requests
client.addRequestInterceptor(async (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
        config.headers = config.headers || {};
        config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
});

// Log all responses
client.addResponseInterceptor(async (response) => {
    console.log('API Response:', response);
    return response;
});

// Handle 401 errors globally
client.addErrorInterceptor(async (error) => {
    if (error.status === 401) {
        // Redirect to login
        window.location = '/login';
    }
    return error;
});
```

### Benefits of Service Layer Pattern

- **Centralization** - All API logic in dedicated service classes
- **Reusability** - Share endpoints across components
- **Testability** - Easy to mock services for unit tests
- **Type Safety** - Define interfaces for API responses
- **Maintainability** - Change endpoint URLs in one place
- **Consistency** - Uniform error handling and headers

### Scattered Requests vs Service Layer

Scattered (Hard to Maintain)

```javascript
// Component 1
const users = await Domma.http.get(
    'https://api.example.com/users'
);

// Component 2 - different file
const user = await Domma.http.get(
    'https://api.example.com/users/' + id
);

// Component 3 - another file
await Domma.http.post(
    'https://api.example.com/users',
    userData
);

// URL repeated 3 times
// Hard to change base URL
// No consistent error handling
```

Service Layer (Centralized)

```javascript
// services/user.js
class UserService {
    baseURL = 'https://api.example.com';

    getAll() {
        return Domma.http.get(`${this.baseURL}/users`);
    }

    getById(id) {
        return Domma.http.get(`${this.baseURL}/users/${id}`);
    }

    create(data) {
        return Domma.http.post(`${this.baseURL}/users`, data);
    }
}

// Usage anywhere
const userService = new UserService();
const users = await userService.getAll();
const user = await userService.getById(id);
await userService.create(userData);
```

## Quick Reference

### Basic Usage

```javascript
// GET
const users = await Domma.http.get('/api/users');

// POST
const user = await Domma.http.post('/api/users', {
    name: 'John',
    email: 'john@example.com'
});

// PUT
await Domma.http.put('/api/users/1', { name: 'Jane' });

// DELETE
await Domma.http.delete('/api/users/1');
```

### With async/await

```javascript
async function fetchData() {
    try {
        const data = await Domma.http.get('/api/data');
        console.log(data);
    } catch (err) {
        console.error(err.message);
    }
}

// Or with .then()
Domma.http.get('/api/data')
    .then(data => console.log(data))
    .catch(err => console.error(err));
```
