---
title: MPA QuickStart
description: Build a traditional multi-page Domma site - separate HTML pages, friendly to search engines, any static host.
layout: default
status: published
sortOrder: 12
---

[hero title="MPA QuickStart" tagline="A traditional multi-page site, one HTML file per page. Ideal for content sites, blogs and documentation." align="center"]
[badge variant="primary"]Search-engine friendly[/badge] [badge variant="primary"]Works without JavaScript[/badge] [badge variant="primary"]Any static host[/badge]
[/hero]

## Set up your MPA in three steps

[grid cols="3" gap="4"]
[col]
[card title="Create the project" layout="step-numbered" step="1"]
```bash
mkdir my-site
cd my-site
npm init -y
```
[/card]
[/col]
[col]
[card title="Install Domma" layout="step-numbered" step="2"]
```bash
npm install domma-js
```
About 175 KB gzipped.
[/card]
[/col]
[col]
[card title="Generate the MPA" layout="step-numbered" step="3"]
```bash
npx domma-js init --mpa
```
A complete multi-page site, one HTML file per page.
[/card]
[/col]
[/grid]

### What you get

```text
domma.config.json           theme, navbar, footer
frontend/
├── dist/domma/             the Domma files
├── css/custom.css          your styles
├── js/app.js               shared start-up for every page
└── pages/
    ├── index.html + index.js
    ├── about/  contact/  blog/  docs/
    └── privacy/  cookies/  terms/
```

Open `frontend/pages/index.html`, or serve the project and visit `/frontend/pages/`:

```bash
npx http-server
```

Add a page any time with `npx domma-js add page`.

## What it looks like

Each page is its own HTML file sharing the navbar, footer and theme. The home page starts out like this:

[card padding="spacious"]
<div class="text-center py-4">

## Welcome to my site

A multi-page site built with Domma

</div>

[grid cols="3" gap="3"]
[col]
[card title="Fast" layout="icon-top" icon="zap" text-align="center"]
Built for speed and performance.
[/card]
[/col]
[col]
[card title="Secure" layout="icon-top" icon="shield" text-align="center"]
Built with security good practice.
[/card]
[/col]
[col]
[card title="Zero dependencies" layout="icon-top" icon="layers" text-align="center"]
Nothing else to install.
[/card]
[/col]
[/grid]
[/card]

## The code

### `domma.config.json`

```json
{
  "project": { "name": "My MPA Site", "version": "1.0.0" },
  "theme": { "default": "charcoal-dark", "persist": true },
  "navbar": {
    "brand": { "text": "My Site", "url": "/" },
    "items": [
      { "text": "Home", "url": "index.html" },
      { "text": "About", "url": "about/index.html" },
      { "text": "Contact", "url": "contact/index.html" }
    ]
  }
}
```

### `frontend/pages/index.html`

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <link rel="stylesheet" href="../dist/domma/domma.css">
  <link rel="stylesheet" href="../dist/domma/grid.css">
  <link rel="stylesheet" href="../dist/domma/elements.css">
  <link rel="stylesheet" href="../dist/domma/themes/domma-themes.css">
  <link rel="stylesheet" href="../css/custom.css">
</head>
<body class="dm-theme-charcoal-dark">
  <nav id="main-navbar"></nav>

  <main class="container py-6">
    <h1>Welcome to my site</h1>
    <p>This is a multi-page application.</p>
  </main>

  <footer class="page-footer"></footer>

  <script src="../dist/domma/domma.min.js"></script>
  <script src="../js/app.js"></script>
  <script src="index.js"></script>
</body>
</html>
```

## You're ready to build

Your MPA is set up. Start editing the pages in `frontend/pages/`.

[button href="/quickstart" variant="secondary"]Back to QuickStart[/button] [button href="/showcase" variant="primary"]Explore the Showcase[/button]
