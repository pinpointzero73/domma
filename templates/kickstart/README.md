# {{projectName}}

A modern web project powered by Domma - the lightweight JavaScript framework with zero dependencies.

## Project Structure

```
{{projectName}}/
├── frontend/
│   ├── dist/                    # Domma distribution files
│   ├── pages/                   # All application pages
│   │   ├── index.html + index.js
│   │   ├── about/
│   │   ├── blog/
│   │   ├── contact/
│   │   └── docs/
│   ├── assets/                  # Images, logos, etc.
│   ├── css/custom.css           # Your custom styles
│   └── js/app.js                # Global initialization
├── backend/                     # Backend implementation (future)
├── domma.config.json            # Project configuration
└── README.md                    # This file
```

## Getting Started

### 1. View Your Project

Open `frontend/pages/index.html` in your browser, or use a development server:

```bash
# Using Python
python3 -m http.server 8000

# Using Node.js (http-server)
npx http-server
```

Then visit `http://localhost:8000/frontend/pages/`

### 2. Customize Your Project

Edit `domma.config.json` to configure:

- **Theme**: Choose from 16+ built-in themes
- **Navbar**: Brand, menu items, styling
- **Footer**: Copyright, links
- **Features**: Icons, back-to-top, code copy, smooth scroll

### 3. Add New Pages

Use the Domma CLI to generate new pages:

```bash
# Interactive mode (prompts for page name)
npx domma-js add page

# Quick mode (direct creation)
npx domma-js add page dashboard --quick
```

This creates:
- `frontend/pages/dashboard/index.html`
- `frontend/pages/dashboard/dashboard.js`

Don't forget to add the new page to your navbar in `domma.config.json`!

### 4. Add a Backend

When ready, follow the instructions in `backend/README.md` to set up a Fastify server with authentication and CORS support.

## Configuration

### Theme

Change your theme by editing `domma.config.json`:

```json
{
  "theme": {
    "default": "ocean-dark",
    "persist": true
  }
}
```

Available themes: charcoal-dark, ocean-dark, forest-dark, sunset-light, silver-light, ocean-light, forest-light, sunset-dark, royal-dark, lemon-light, and more.

### Navbar

Customize your navigation:

```json
{
  "navbar": {
    "brand": {
      "text": "My App",
      "logo": "frontend/assets/logo/placeholder.svg"
    },
    "items": [
      { "text": "Home", "url": "/frontend/pages/" },
      { "text": "About", "url": "/frontend/pages/about/" }
    ]
  }
}
```

## Page-Specific JavaScript

Each page has its own initialization file:

- `frontend/pages/index.js` - Home page logic
- `frontend/pages/about/about.js` - About page logic
- `frontend/pages/contact/contact.js` - Contact form handling
- `frontend/pages/docs/docs.js` - Documentation tabs/navigation

Example page initialization:

```javascript
$(() => {
  // Your page-specific code here
  console.log('Page initialized');
});
```

## Resources

- [Domma Documentation](https://github.com/dcbw-it/domma)
- [Domma API Reference](https://github.com/dcbw-it/domma/blob/main/docs/API.md)
- [Domma Showcase](https://dcbw-it.github.io/domma/showcase/)

## License

This project was generated with Domma CLI.
Domma is ISC licensed.

---

**Built with** [Domma](https://github.com/dcbw-it/domma) • The lightweight JavaScript framework
