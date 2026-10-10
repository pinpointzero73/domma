---
title: QuickStart
description: Get a Domma project running in about 30 seconds - single-page or multi-page, from npm or a CDN.
layout: default
status: published
sortOrder: 10
---

[hero title="Get started with Domma" tagline="Single-page for app-like experiences, multi-page for content sites. Up and running in about 30 seconds." size="lg" align="center"]
[badge variant="primary"]30-second setup[/badge] [badge variant="primary"]Zero dependencies[/badge] [badge variant="primary"]14 themes, light and dark[/badge]

[button href="/quickstart/spa" variant="primary"]QuickStart: SPA[/button] [button href="/quickstart/mpa" variant="secondary"]QuickStart: MPA[/button]
[/hero]

## How it works

[grid cols="3" gap="4"]
[col]
[card title="Create a project" layout="step-numbered" step="1"]
```bash
mkdir my-app
cd my-app
npm init -y
```
A new folder with a `package.json`.
[/card]
[/col]
[col]
[card title="Install Domma" layout="step-numbered" step="2"]
```bash
npm install domma-js
```
Downloads Domma from npm - about 175 KB gzipped.
[/card]
[/col]
[col]
[card title="Generate your site" layout="step-numbered" step="3"]
```bash
npx domma-js init
```
Asks whether you want a single-page (the default) or multi-page site, then writes it.
[/card]
[/col]
[/grid]

Skip the question with `npx domma-js init --spa` or `npx domma-js init --mpa`.

## Choose your architecture

Both include a navbar, footer, 14 themes with light and dark variants, icons, the grid, every component, and a mobile
layout.

[grid cols="2" gap="4"]
[col]
[card title="Single-page application" icon="zap" icon-layout="inline"]
App-like, with client-side routing.

```bash
npx domma-js init --spa
```

**Ideal for:**

- app-like experiences (dashboards, tools)
- instant view changes with no page reloads
- state shared between views
- dynamic, interactive interfaces

Uses the built-in router (`R`), with lifecycle hooks and middleware.

[button href="/quickstart/spa" variant="primary"]Get started with SPA[/button]
[/card]
[/col]
[col]
[card title="Multi-page application" icon="file-text" icon-layout="inline"]
A traditional site of separate HTML pages.

```bash
npx domma-js init --mpa
```

**Ideal for:**

- content sites (blogs, docs, marketing)
- when search engines matter most
- pages that work without JavaScript
- simple static hosting

Starts with home, about, contact, blog and docs pages, plus privacy, cookies and terms.

[button href="/quickstart/mpa" variant="secondary"]Get started with MPA[/button]
[/card]
[/col]
[/grid]

Not sure? Start with **SPA** - it's the modern approach. Choose **MPA** for content-heavy sites where search ranking
matters most.

## You're done

Your project is in `frontend/`. Open `frontend/pages/index.html`, or serve the folder (for example
`npx http-server`) and visit `/frontend/pages/`. Everything is ready: navbar, footer, theming, grid and components.
Customise it in `domma.config.json`, or dive into the code.

[button href="/showcase" variant="primary"]Explore the Showcase[/button] [button href="https://github.com/pinpointzero73/domma" variant="secondary"]View on GitHub[/button]

## Just want to try it?

Skip npm and use Domma from a CDN - one HTML file, no build tools:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <link rel="stylesheet" href="https://unpkg.com/domma-js/public/dist/domma.css">
  <link rel="stylesheet" href="https://unpkg.com/domma-js/public/dist/elements.css">
</head>
<body class="dm-theme-charcoal-dark">
  <nav id="nav"></nav>
  <main class="container py-6">
    <h1>Hello Domma!</h1>
    <button class="btn btn-primary" id="toast-btn">Click me</button>
  </main>

  <script src="https://unpkg.com/domma-js/public/dist/domma.min.js"></script>
  <script>
    $(() => {
      // Declarative setup with Domma's config engine
      $.setup({
        'body': {
          component: 'theme',
          options: { theme: 'charcoal-dark', persist: true }
        },
        '#nav': {
          component: 'navbar',
          options: {
            brand: { text: 'My App' },
            items: [{ text: 'Home', url: '/' }]
          }
        },
        '#toast-btn': {
          events: {
            click: () => {
              Domma.elements.toast.success('Hello! 🎉', {
                position: 'top-center',
                duration: 3000
              });
            }
          }
        }
      });
    });
  </script>
</body>
</html>
```

For production, use the npm workflow above.
