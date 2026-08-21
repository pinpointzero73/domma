# Domma Kickstart SPA Template

A production-ready Single Page Application template powered by Domma.

## Structure

```
kickstart-spa/
├── frontend/              # Client-side application
│   ├── index.html        # Main HTML file
│   ├── domma.config.json # Configuration (routes, navbar, theme, etc.)
│   ├── css/
│   │   └── custom.css    # Custom styles
│   ├── js/
│   │   ├── app.js        # Application entry point
│   │   └── views/        # View modules (home, about, contact, 404)
│   ├── assets/
│   │   └── logo/         # Logo assets
│   └── types/            # TypeScript definitions (optional)
├── backend/              # Server-side code (placeholder)
└── blueprints/           # Shared data schemas
    ├── common/           # Reusable blueprints (user, contact, settings)
    ├── crud/             # CRUD blueprints (product, task)
    └── forms/            # Form blueprints (login, registration)
```

## How It Works

### 1. Configuration-Driven

The entire app is configured via `frontend/domma.config.json`:

- **Project metadata** - name, version, description
- **SPA settings** - routing, transitions, scroll behaviour
- **Theme** - default theme, persistence, auto-detection
- **Navbar** - brand, items, variant, responsive behaviour
- **Routes** - path-to-view mappings with titles
- **Footer** - copyright, links
- **Features** - icons, back-to-top, smooth scroll

### 2. View-Based Routing

Each route maps to a view module in `js/views/` with a companion template file:

```javascript
// ✅ RECOMMENDED: js/views/home.js
export const homeView = {
  templateUrl: 'js/views/templates/home.html',  // External template file

  async onEnter(params) {
    // Called before rendering - fetch data, validate auth, etc.
    const data = await H.get('/api/home');
    return data;
  },

  onMount($container) {
    // Called after rendering - initialize components, bind events
    I.scan($container[0]);  // Scan for icons
    E.tooltip($container.find('[data-tooltip]'));
  },

  onLeave() {
    // Cleanup when leaving view
  }
};
```

```html
<!-- js/views/templates/home.html -->
<div class="container">
  <h1>Welcome to {{projectName}}</h1>
  <p>This template was loaded from an external file!</p>
</div>
```

**Why use `templateUrl`?**
- Keeps HTML separate from JavaScript (easier to maintain)
- Templates support Mustache syntax (`{{variable}}`, `{{#if}}`, `{{#each}}`)
- Router caches templates automatically for performance
- Use inline `template:` only for very simple views (<5 lines)

Views are automatically loaded and mounted by the router.

### 3. Blueprint System

Blueprints define data schemas that work across Models, Forms, and CRUD:

```javascript
// Example: blueprints/common/user.js
export const userBlueprint = {
  name: {type: 'string', required: true},
  email: {type: 'email', required: true},
  role: {type: 'select', options: ['admin', 'user']}
};
```

Use blueprints with:
- `M.create(userBlueprint)` - Create reactive model
- `Domma.forms.create(userBlueprint)` - Generate form
- `Domma.forms.crud('#app', userBlueprint)` - Complete CRUD UI

## Testing the Template

### In This Repo

The template is pre-configured with working defaults for testing within the Domma repository:

1. **Start a server from Domma root:**
   ```bash
   cd /path/to/domma   # the repository root
   live-server . --port=3006
   ```

2. **Open the template:**
   ```
   http://localhost:3006/templates/kickstart-spa/frontend/
   ```

3. **The template uses relative paths:**
   - CSS: `../../../public/dist/domma.css`
   - JS: `../../../public/dist/domma.min.js`

### For End Users

When users run `npx domma init --spa`, the CLI:

1. Copies this template to their project
2. Replaces template placeholders (e.g., `{{projectName}}` → actual name)
3. Copies Domma files to `dist/domma/`
4. Updates paths to: `dist/domma/domma.min.js`

## Configuration Location

**IMPORTANT:** `domma.config.json` must be in the `frontend/` folder.

This is frontend-specific configuration (routing, navbar, theme) and should live with the client code. Backend configuration (if needed) would go in `backend/`.

## Current Defaults

The template includes working defaults:

- **Project name:** "My Domma App"
- **Theme:** "charcoal-dark"
- **Routes:** Home, About, Contact (+ 404)
- **Navbar:** Sticky dark navbar with 3 menu items
- **Footer:** Copyright + 2 footer links
- **Features:** Icons, back-to-top, smooth scroll (all enabled)

## Customisation

### Adding a New Route

1. **Create template file:**
   ```html
   <!-- js/views/templates/pricing.html -->
   <div class="container py-6">
     <h1>Pricing</h1>
     <p>Simple and transparent pricing for everyone.</p>
     <div class="grid grid-cols-3 gap-4">
       <!-- Pricing cards here -->
     </div>
   </div>
   ```

2. **Create view module:**
   ```javascript
   // js/views/pricing.js
   export const pricingView = {
     templateUrl: 'js/views/templates/pricing.html',

     async onEnter(params) {
       // Fetch pricing data if needed
       const plans = await H.get('/api/pricing');
       return plans;
     },

     onMount($container) {
       I.scan($container[0]);  // Scan for icons
     }
   };
   ```

3. **Export from views/index.js:**
   ```javascript
   export {pricingView as pricing} from './pricing.js';
   ```

4. **Add to domma.config.json:**
   ```json
   {
     "path": "/pricing",
     "view": "pricing",
     "title": "My Domma App - Pricing"
   }
   ```

5. **Add to navbar (optional):**
   ```json
   {
     "text": "Pricing",
     "url": "#/pricing"
   }
   ```

### Changing Theme

Edit `domma.config.json`:

```json
{
  "theme": {
    "default": "ocean-dark",  // or any Domma theme
    "selector": true,         // show theme selector
    "persist": true,          // remember user choice
    "autoDetect": false       // use system preference
  }
}
```

Available themes: charcoal, ocean, forest, sunset, crimson, amber, slate, purple, monochrome (all with -light/-dark variants).

## Next Steps

1. **Customise views** - Edit files in `js/views/`
2. **Update configuration** - Modify `domma.config.json`
3. **Add custom styles** - Edit `css/custom.css`
4. **Use blueprints** - Define schemas in `blueprints/`
5. **Add backend** - Implement API in `backend/` (optional)

## Notes

- Template uses ES modules (`type="module"`)
- DOMPurify is included for XSS protection
- Router uses hash-based navigation (`#/about`)
- All Domma features available: DOM, utils, dates, models, elements, forms, etc.

## Resources

- [Domma Documentation](https://github.com/dcbw-it/domma/tree/main/docs)
- [API Reference](https://github.com/dcbw-it/domma/blob/main/docs/API.md)
- [Showcase Examples](https://github.com/dcbw-it/domma/tree/main/public/showcase)
