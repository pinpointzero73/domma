---
title: Accessibility & Text Utilities
description: "Screen-reader-only text and skip links, line clamping, whole-card links and a divider with a word in it"
layout: with-sidebar
status: published
sortOrder: 50
---

[hero title="Accessibility & Text Utilities" tagline="Screen-reader-only text and skip links, line clamping, whole-card links and a divider with a word in it" align="center"][/hero]

## Naming

Tailwind's names, because the rest of Domma's utilities use them (`.hidden`, `.truncate`), with Bootstrap's spellings as aliases where they differ: `.visually-hidden` for `.sr-only`, `.visually-hidden-focusable` for `.sr-only-focusable`, and `.text-truncate` for `.truncate`. `.stretched-link` is Bootstrap's own; Tailwind has none.

## Screen Reader Only

`.sr-only` (or `.visually-hidden`) takes text off the screen but leaves it in the accessibility tree. Use it for the words an icon-only button needs, or context a sighted reader gets from the layout. Unlike `.hidden` or `display: none`, a screen reader still reads it.

[showcase-demo id="showcase/css-utilities/accessibility-text/screen-reader-only" title="Screen Reader Only" /]

Usage

```html
<button type="button" class="btn">
    <span data-icon="bell" aria-hidden="true"></span>
    <span class="sr-only">Notifications</span>
</button>

<h2>Orders <span class="sr-only">for March 2026</span></h2>
```

`.not-sr-only` undoes it - at a breakpoint, or from a script once the context is on screen.

## Skip Link

[showcase-demo id="showcase/css-utilities/accessibility-text/skip-link-skip-link-and-sr-only-focusable" title="Skip link: .skip-link and .sr-only-focusable" /]

Usage

```html
<body>
    <a href="#main" class="skip-link">Skip to main content</a>
    <nav>...</nav>
    <main id="main" tabindex="-1">...</main>
</body>
```

Want your own look? Use `.sr-only-focusable` and style the focused state yourself.

## Line Clamp

`.line-clamp-1` to `.line-clamp-5` cut a block of text after that many lines with an ellipsis - card summaries, list previews. `.line-clamp-none` lets it run again, for a "Read more" toggle. For one line inside something narrower, `.truncate` does the same for a single line and needs no block box.

[showcase-demo id="showcase/css-utilities/accessibility-text/line-clamp" title="Line Clamp" /]

quarterly-report-final-v3-actually-final-2026.pdf

Usage

```html
<p class="line-clamp-3">A long summary...</p>
<span class="truncate">a-very-long-file-name.pdf</span>   <!-- .text-truncate also works -->
```

Responsive `md:` variants are not provided; switch the class from a script.

## Stretched Link

Put `.stretched-link` on the card's main link and its `::after` covers the whole card, so a click anywhere follows it - while the markup keeps one link with one name, not a link wrapped round a paragraph. It covers its nearest positioned ancestor: a `.card` or `.list-group-item` holding one is positioned for you; anything else needs `.relative`. Anything else clickable inside must sit above it with `.relative .z-10`.

[showcase-demo id="showcase/css-utilities/accessibility-text/stretched-link" title="Stretched Link" /]

Usage

```html
<div class="card">
    <div class="card-body">
        <h3 class="card-title"><a href="/posts/spring" class="stretched-link">Planting for spring</a></h3>
        <p class="card-text">What to sow now...</p>
        <a href="/tags/containers" class="badge relative z-10">Containers</a>   <!-- stays clickable -->
    </div>
</div>
```

Keyboard focus draws the focus ring round the whole card, where the click would land.

## Divider Text

`.divider-text` draws a rule either side of a short word - "or" between two ways to sign in, a date between two days of messages. The rule is the theme's border colour and the word its secondary text colour, which stays AA on every theme (the muted colour does not on all of them). `.divider-text-start` and `-end` push the word to one side; empty, it is a plain rule.

[showcase-demo id="showcase/css-utilities/accessibility-text/divider-text" title="Divider Text" /]

Usage

```html
<div class="divider-text">or</div>
<div class="divider-text divider-text-start">Yesterday</div>
<div class="divider-text"></div>   <!-- a plain rule -->
```

## Reference

All of these live in `domma.css`. The full opacity and translucency set is on the [Opacity & Translucency](/showcase/css-utilities) page.

[table striped="true"]
| Class | Alias | Does |
| --- | --- | --- |
| `.sr-only` | `.visually-hidden` | Off screen, still read by screen readers |
| `.sr-only-focusable` | `.visually-hidden-focusable` | The same until it or something in it has focus |
| `.skip-link` |  | A styled skip link: hidden until focused, then pinned top left |
| `.not-sr-only` |  | Undo `.sr-only` |
| `.line-clamp-1` ... `-5` |  | Cut after N lines with an ellipsis |
| `.line-clamp-none` |  | Undo the clamp |
| `.truncate` | `.text-truncate` | One line with an ellipsis |
| `.stretched-link` |  | The link covers its nearest positioned ancestor |
| `.divider-text` |  | Rule, word, rule; `-start` / `-end` to one side |
[/table]
