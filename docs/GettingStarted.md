# Getting Started with Domma

Welcome to Domma! This guide will help you get up and running in minutes.

## Two Ways to Get Started

Domma offers two installation paths:

1. **npm + CLI** - Full-featured development with project scaffolding (**Recommended**)
2. **CDN** - Quick prototyping without build tools

---

## Option 1: npm + CLI (Recommended)

Perfect for building production applications. Get a complete project structure with one command.

### Step 1: Create Your Project

```bash
mkdir my-app && cd my-app
npm init -y
npm install domma-js
```

### Step 2: Initialize with CLI

Run the interactive setup:

```bash
npx domma init
```

Or use quick mode with defaults:

```bash
npx domma init --quick
```

### What You Get

The CLI creates a complete project structure:

```
my-app/
├── domma.config.json     # Single source of truth
├── index.html            # Home page with hero & features
├── about/index.html      # About page with team section
├── contact/index.html    # Contact form page
├── blog/index.html       # Blog listing page
├── docs/index.html       # Documentation page
├── css/custom.css        # Your custom styles
├── js/app.js             # Config-driven initialization
└── assets/logo/          # Placeholder logo
```

### Step 3: Start Developing

Open `index.html` in your browser - that's it! The pages are fully functional with:

- ✅ Navbar (configured via JSON)
- ✅ Footer (configured via JSON)
- ✅ Theme system (16+ themes)
- ✅ Back-to-top button
- ✅ Icon scanning
- ✅ Responsive grid

---

## Option 2: CDN Quickstart

Perfect for quick prototypes, demos, or trying out Domma without npm.

### Single File Setup

Create `index.html`:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>My App</title>

  <!-- Domma CSS from CDN -->
  <link rel="stylesheet" href="https://unpkg.com/domma-js/public/dist/domma.css">
  <link rel="stylesheet" href="https://unpkg.com/domma-js/public/dist/grid.css">
  <link rel="stylesheet" href="https://unpkg.com/domma-js/public/dist/elements.css">
  <link rel="stylesheet" href="https://unpkg.com/domma-js/public/dist/themes/domma-themes.css">
</head>
<body class="dm-theme-charcoal-dark">
<nav id="main-nav"></nav>

<main class="container py-6">
  <h1>Hello Domma!</h1>
  <button class="btn btn-primary" onclick="showMessage()">
    Click Me
  </button>
</main>

<!-- Domma JavaScript from CDN -->
<script src="https://unpkg.com/domma-js/public/dist/domma.min.js"></script>

<script>
  // Initialize theme
  Domma.theme.init({theme: 'charcoal-dark'});

  // Initialize navbar
  Domma.elements.navbar('#main-nav', {
    brand: {text: 'My App'},
    items: [{text: 'Home', url: '/', active: true}]
  });

  // Scan for icons
  Domma.icons.scan();

  // Example function
  function showMessage() {
    Domma.elements.toast({
      message: 'Hello from Domma!',
      type: 'success'
    });
  }
</script>
</body>
</html>
```

Open `index.html` in your browser - you're done!

---

## Configuration

Domma uses a simple JSON config file for project-wide settings.

### domma.config.json

```json
{
  "project": {
    "name": "My App",
    "version": "1.0.0"
  },
  "theme": {
    "default": "charcoal-dark",
    "persist": true,
    "autoDetect": false
  },
  "navbar": {
    "brand": {
      "text": "My App",
      "logo": "assets/logo/logo.svg",
      "url": "/"
    },
    "items": [
      {
        "text": "Home",
        "url": "/"
      },
      {
        "text": "About",
        "url": "/about/"
      },
      {
        "text": "Contact",
        "url": "/contact/"
      }
    ],
    "variant": "dark"
  },
  "footer": {
    "copyright": "© 2024 My App",
    "links": [
      {
        "text": "Privacy",
        "url": "/privacy/"
      },
      {
        "text": "Terms",
        "url": "/terms/"
      }
    ]
  },
  "features": {
    "icons": true,
    "backToTop": true,
    "codeCopy": true
  }
}
```

The `js/app.js` file loads this config and initializes everything automatically.

---

## Basic Usage

### DOM Manipulation

```javascript
// jQuery-like syntax
$('#button').on('click', () => console.log('Clicked!'));
$('.cards').addClass('active');
```

### Utilities

```javascript
// Lodash-like utilities
_.chunk([1, 2, 3, 4], 2);  // [[1, 2], [3, 4]]
_.debounce(fn, 300);
```

### Theme Management

```javascript
// Initialize theme
Domma.theme.init({theme: 'ocean-dark'});

// Change theme
Domma.theme.set('forest-light');

// Get current theme
Domma.theme.get();  // 'forest-light'
```

### UI Components

```javascript
// Create a modal
Domma.elements.modal('#my-modal', {
  title: 'Welcome',
  content: 'Hello world!',
  onOpen: () => console.log('Modal opened')
});

// Show a toast
Domma.elements.toast({
  message: 'Operation successful!',
  type: 'success',
  duration: 3000
});
```

---

## Customization

### Override Theme Variables

Edit `css/custom.css`:

```css
:root {
    --dm-primary: #3b82f6;
    --dm-primary-hover: #2563eb;
}
```

### Add Custom Components

Just use regular HTML and Domma's CSS classes:

```html

<div class="card hover">
  <div class="card-body">
    <h3 class="h5">My Custom Card</h3>
    <p>Content goes here</p>
  </div>
</div>
```

---

## Next Steps

- **Explore Components**: Check out [showcase/elements](../public/showcase/elements/) for all 19 components
- **Learn the Grid**: See [showcase/grid](../public/showcase/grid/) for layout examples
- **Browse Themes**: Try different themes in [showcase/themes](../public/showcase/themes/)
- **API Reference**: Read [API.md](./API.md) for complete documentation
- **Examples**: Check [examples/](../public/examples/) for working applications

---

## Need Help?

- **Documentation**: [Full Documentation](./DommaDocumentation.md)
- **GitHub Issues**: [Report bugs or request features](https://github.com/dcbw-it/domma/issues)
- **Showcase**: Browse [live examples](../public/showcase/)

---

## Quick Reference

### CDN Links

**CSS:**

```html

<link rel="stylesheet" href="https://unpkg.com/domma-js/public/dist/domma.css">
<link rel="stylesheet" href="https://unpkg.com/domma-js/public/dist/grid.css">
<link rel="stylesheet" href="https://unpkg.com/domma-js/public/dist/elements.css">
<link rel="stylesheet" href="https://unpkg.com/domma-js/public/dist/themes/domma-themes.css">
```

**JavaScript:**

```html

<script src="https://unpkg.com/domma-js/public/dist/domma.min.js"></script>
```

### npm Commands

```bash
npm install domma-js       # Install Domma
npx domma init            # Initialize new project
npx domma init --quick    # Quick init with defaults
```

---

## Available Themes

Domma includes 16+ built-in themes:

- **ocean** (light/dark)
- **forest** (light/dark)
- **sunset** (light/dark)
- **royal** (light/dark)
- **lemon** (light/dark)
- **silver** (light/dark)
- **charcoal** (light/dark) - **default**
- **christmas** (light/dark)
- **grayve** (light/dark)

Change themes with:

```javascript
Domma.theme.set('ocean-dark');
```

---

Happy coding with Domma! 🚀
