# Domma Project Memory

Quick reference for Domma conventions - enforces best practices across sessions.

## Critical Convention: Template Files

- ✅ **ALWAYS**: Use `templateUrl: 'path/to/template.html'` for views
- ✅ **ALWAYS**: Store templates in `js/views/templates/` directories
- ❌ **NEVER**: Put large HTML strings (>5 lines) in JavaScript files
- **Reason**: Separates logic (JS) from markup (HTML)

## Core API Rules

1. **DOM**: `$('#el')` - NOT `document.querySelector()`
2. **Storage**: `S.set('key', value)` - NOT `localStorage.setItem()`
3. **HTTP**: `H.get('/api')` - NOT `fetch()`
4. **Dates**: `D().add(1, 'day')` - NOT manual Date arithmetic
5. **Models**: `M.create(blueprint)` - NOT manual state management
6. **Forms**: `F.create(selector, {blueprint})` - NOT manual `<form>` HTML
7. **Toast**: `E.toast('Message', {type})` - NOT manual divs
8. **Confirm**: `await E.confirm('Sure?')` - NOT `window.confirm()`
9. **Icons**: `<span data-icon="name">` + `I.scan()` - NOT manual SVG
10. **Tables**: `T.create(selector, {data})` - NOT manual `<table>` HTML
11. **Modals**: `E.modal(selector, options)` — NOT custom modal code
12. **Templates**: `templateUrl: 'path.html'` — NOT large inline strings
13. **Tabs**: `E.tabs()`, `E.accordion()` — NOT custom switching code
14. **Init**: Call `Domma.init()` and `I.scan()` after DOM ready
15. **Events**: `.on()`, `.off()`, `.one()` — NOT `.addEventListener()`

## Aliases Quick Reference

`$` = DOM | `_` = Utils | `M` = Models | `D` = Dates | `S` = Storage
`H` = HTTP | `F` = Forms | `E` = Elements | `I` = Icons | `T` = Tables
`A` = Auth | `R` = Router

## CSS Load Order (Critical)

1. `domma.css` (base + utilities)
2. `grid.css` (layout system)
3. `elements.css` (components)
4. `themes/domma-themes.css` (theming)
5. Custom CSS last

## When Unsure

**Before writing vanilla JavaScript, ASK:**
"Does Domma provide this for [HTTP/storage/DOM/forms/dates/components]?"

Check project CLAUDE.md convention table first.
