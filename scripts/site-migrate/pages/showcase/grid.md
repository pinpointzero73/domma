---
title: Grid System
description: "12-column flexbox grid with mobile-first stacking. Columns stack below 576px, activate grid above."
layout: with-sidebar
status: published
sortOrder: 50
---

[hero title="Grid System" tagline="12-column flexbox grid with mobile-first stacking. Columns stack below 576px, activate grid above." align="center"][/hero]

## Basic Columns

Use `.col-*` classes to specify column widths (1-12)

.row > .col-4 + .col-4 + .col-4 (3 equal columns)

[showcase-demo id="showcase/grid/basic-columns" title="Basic Columns" /]

.row > .col-6 + .col-6 (2 equal columns)

[showcase-demo id="showcase/grid/basic-columns-2" title="Basic Columns" /]

.row > .col-3 + .col-9 (sidebar + content)

[showcase-demo id="showcase/grid/basic-columns-3" title="Basic Columns" /]

.row > .col-2 + .col-8 + .col-2

[showcase-demo id="showcase/grid/basic-columns-4" title="Basic Columns" /]

## Equal Width

Use `.col` for auto-sizing equal-width columns

.row > .col + .col + .col (3 equal, auto-sized)

[showcase-demo id="showcase/grid/equal-width" title="Equal Width" /]

.row > .col + .col + .col + .col + .col (5 equal)

[showcase-demo id="showcase/grid/equal-width-2" title="Equal Width" /]

## Auto Width

Use `.col-auto` for content-based width

.row > .col-auto + .col + .col-auto

[showcase-demo id="showcase/grid/auto-width" title="Auto Width" /]

## Offsets

Use `.offset-*` to push columns to the right

.row > .col-4.offset-4 (centred column)

[showcase-demo id="showcase/grid/offsets" title="Offsets" /]

.row > .col-3.offset-3 + .col-3.offset-3

[showcase-demo id="showcase/grid/offsets-2" title="Offsets" /]

.row > .col-6.offset-6 (right-aligned)

[showcase-demo id="showcase/grid/offsets-3" title="Offsets" /]

## Horizontal Alignment

Use `.row.justify-*` to align columns horizontally

.row.justify-start

[showcase-demo id="showcase/grid/horizontal-alignment" title="Horizontal Alignment" /]

.row.justify-center

[showcase-demo id="showcase/grid/horizontal-alignment-2" title="Horizontal Alignment" /]

.row.justify-end

[showcase-demo id="showcase/grid/horizontal-alignment-3" title="Horizontal Alignment" /]

.row.justify-between

[showcase-demo id="showcase/grid/horizontal-alignment-4" title="Horizontal Alignment" /]

.row.justify-around

[showcase-demo id="showcase/grid/horizontal-alignment-5" title="Horizontal Alignment" /]

.row.justify-evenly

[showcase-demo id="showcase/grid/horizontal-alignment-6" title="Horizontal Alignment" /]

## Vertical Alignment

Use `.row.align-*` to align columns vertically

.row.align-start

[showcase-demo id="showcase/grid/vertical-alignment" title="Vertical Alignment" /]

.row.align-center

[showcase-demo id="showcase/grid/vertical-alignment-2" title="Vertical Alignment" /]

.row.align-end

[showcase-demo id="showcase/grid/vertical-alignment-3" title="Vertical Alignment" /]

.row.align-stretch (default)

[showcase-demo id="showcase/grid/vertical-alignment-4" title="Vertical Alignment" /]

## Column Order

Use `.order-*` to reorder columns visually

Natural order: 1, 2, 3

[showcase-demo id="showcase/grid/column-order" title="Column Order" /]

.order-last on 1st, .order-first on 3rd

[showcase-demo id="showcase/grid/column-order-2" title="Column Order" /]

.order-3, .order-1, .order-2

[showcase-demo id="showcase/grid/column-order-3" title="Column Order" /]

## No Gutters

Use `.row.no-gutters` to remove column padding

.row (with gutters - default)

[showcase-demo id="showcase/grid/no-gutters" title="No Gutters" /]

.row.no-gutters

[showcase-demo id="showcase/grid/no-gutters-2" title="No Gutters" /]

## Gap Utilities

Use `.row.gap-*` for consistent spacing (uses CSS gap)

.row.gap-0

[showcase-demo id="showcase/grid/gap-utilities" title="Gap Utilities" /]

.row.gap-2

[showcase-demo id="showcase/grid/gap-utilities-2" title="Gap Utilities" /]

.row.gap-4

[showcase-demo id="showcase/grid/gap-utilities-3" title="Gap Utilities" /]

## Nested Grids

Place rows inside columns for complex layouts

Nested: .col-8 contains another .row

[showcase-demo id="showcase/grid/nested-grids" title="Nested Grids" /]

## Containers

Centred containers with max-width constraints

.container (max-width: 1200px)

.container

.container.container-xl (max-width: 1280px)

.container-xl

.container.container-lg (max-width: 1024px)

.container-lg

.container.container-md (max-width: 768px)

.container-md

.container.container-sm (max-width: 640px)

.container-sm

## CSS Grid

Tailwind-style CSS Grid with `.grid`, `.grid-cols-*`, `.col-span-*`

.grid.grid-cols-3.gap-4

[showcase-demo id="showcase/grid/css-grid" title="CSS Grid" /]

.grid.grid-cols-4 with .col-span-2

[showcase-demo id="showcase/grid/css-grid-2" title="CSS Grid" /]

.grid.grid-cols-12 with various spans

[showcase-demo id="showcase/grid/css-grid-3" title="CSS Grid" /]

## Responsive Behaviour

Columns stack below 576px viewport width (mobile-first)

[showcase-demo id="showcase/grid/responsive-behaviour" title="Responsive Behaviour" /]
