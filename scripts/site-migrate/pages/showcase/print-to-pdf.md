---
title: Print-to-PDF Tool
description: "Minimal, zero-dependency print-to-PDF tool using browser native window.print() API"
layout: with-sidebar
status: published
sortOrder: 50
---

[hero title="Print-to-PDF Tool" tagline="Minimal, zero-dependency print-to-PDF tool using browser native window.print() API" align="center"][/hero]

## Overview

Minimal, zero-dependency print-to-PDF tool using browser native `window.print()` API.

### Key Features

- **Zero Dependencies** - Uses only browser APIs
- **Page Configuration** - Size, orientation, margins
- **Smart Page Breaks** - Avoid breaking tables, images, headings
- **Content Optimization** - Hide elements, optimize images
- **Callbacks** - Before/after print events

```
const printer = Domma.elements.printToPDF('#content', {
    pageSize: 'A4',
    orientation: 'portrait',
    margins: 'normal'
});
printer.print();
```

## Basic Print Example

**Note:** Configure print options when creating the instance, then call `print()` to trigger the browser's native print dialog.

[showcase-demo id="showcase/print-to-pdf/basic-print-example" title="Basic Print Example" /]

[showcase-demo id="showcase/print-to-pdf/sample-document" title="Sample Document" /]

## API Reference

[table striped="true"]
| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `pageSize` | String | `'A4'` | 'A4', 'Letter', 'Legal', or custom {width, height} |
| `orientation` | String | `'portrait'` | 'portrait' or 'landscape' |
| `margins` | String | `'normal'` | 'none', 'narrow', 'normal', 'wide', or custom |
| `title` | String | `null` | Document title for print |
| `removeBackgrounds` | Boolean | `false` | Strip background colors/images |
| `optimizeImages` | Boolean | `true` | Ensure images fit page width |
| `hideElements` | Array | `[]` | Selectors of elements to hide |
| `onBeforePrint` | Function | `null` | Called before print dialog |
| `onAfterPrint` | Function | `null` | Called after print/cancel |
[/table]

### Methods

[table striped="true"]
| Method | Description |
| --- | --- |
| `print()` | Trigger browser print dialog immediately |
| `setOptions(options)` | Update configuration options |
| `destroy()` | Cleanup and remove print styles |
[/table]

**Note:** The `preview()` method is not implemented. Configure all options when creating the instance.
