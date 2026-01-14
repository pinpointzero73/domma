# MiniApps Shared Utilities

Shared modules used across all Domma miniapps.

## config.js - Environment Configuration

Environment-based configuration module with build-time variable replacement.

### Usage

```javascript
import config from '../shared/config.js';

const MyApp = {
    async init() {
        // Use environment-aware API URL
        Domma.auth.init({ apiUrl: config.apiUrl });

        // Check environment
        if (config.isDevelopment()) {
            console.log('Development mode');
        }
    }
};
```

### Build-Time Variables

The following placeholders are replaced during the build process:

- `%%API_URL%%` - Backend API endpoint
- `%%NODE_ENV%%` - development | production
- `%%APP_VERSION%%` - From package.json

### Environment URLs

- **Development**: `http://localhost:3000/api`
- **Production**: `https://dommajs.org/api`

### Configuration API

#### config.apiUrl

**Type**: `string`

The backend API base URL for the current environment.

#### config.environment

**Type**: `string`

Current environment: `'development'` or `'production'`.

#### config.version

**Type**: `string`

Application version from package.json.

#### config.isDevelopment()

**Returns**: `boolean`

Check if running in development environment.

#### config.isProduction()

**Returns**: `boolean`

Check if running in production environment.

### Building for Different Environments

```bash
# Development (default)
npm run build:miniapp:garage

# Production
NODE_ENV=production npm run build:miniapp:garage

# Custom API URL
API_URL=https://staging.example.com/api npm run build:miniapp:garage
```

### How It Works

1. Source files import the config module
2. During build, Rollup's `@rollup/plugin-replace` plugin replaces placeholder values
3. Output contains hardcoded URLs optimized for target environment
4. Zero runtime overhead - all configuration resolved at build time

### Example: Development Build

**Input** (src/app.js):

```javascript
import config from '../../shared/config.js';
console.log(config.apiUrl); // %%API_URL%%
```

**Output** (dist/app.min.js):

```javascript
const config = {apiUrl: "http://localhost:3000/api"...};
console.log(config.apiUrl); // http://localhost:3000/api
```

### Example: Production Build

**Input** (src/app.js):

```javascript
import config from '../../shared/config.js';
console.log(config.apiUrl); // %%API_URL%%
```

**Output** (dist/app.min.js):

```javascript
const config={apiUrl:"https://domma.dcbw-it.co.uk:3000/api"...};
console.log(config.apiUrl); // https://domma.dcbw-it.co.uk:3000/api
```

## Future Utilities

This directory can be extended with additional shared utilities:

- Authentication helpers
- Common UI components
- Data transformation utilities
- Validation functions
- etc.
