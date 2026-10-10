---
title: Domma Themes
description: "Beautiful, consistent theming with light & dark modes across 11 colour families. Zero configuration required."
layout: with-sidebar
status: published
sortOrder: 50
---

[hero title="Domma Themes" tagline="Beautiful, consistent theming with light & dark modes across 11 colour families. Zero configuration required." align="center"][/hero]

## Choose a Theme

Click any theme to preview it instantly. Changes apply to the entire page.

[showcase-demo id="showcase/themes/choose-a-theme" title="Choose a Theme" /]

## Admin Theme Builder

Pick a finish, then an accent. Nine looks, two clicks.

[showcase-demo id="showcase/themes/admin-theme-builder" title="Admin Theme Builder" /]

[showcase-demo id="showcase/themes/admin-theme-builder-2" title="Admin Theme Builder" /]

## 1. Branding & Surfaces

Brand colours (text on coloured background)

[showcase-demo id="showcase/themes/1-branding-and-surfaces" title="1. Branding & Surfaces" /]

Surface tokens (text on neutral backgrounds)

[showcase-demo id="showcase/themes/1-branding-and-surfaces-2" title="1. Branding & Surfaces" /]

Colour palette (every theme token)

[showcase-demo id="showcase/themes/1-branding-and-surfaces-3" title="1. Branding & Surfaces" /]

## 2. Typography

### H3 - Engineering team headcount

### H4 - Customer satisfaction up four points

### H5 - Migration completed last Tuesday

H6 - Last updated by Darryl on 22 April 2026

Standard paragraph text - the rain in Spain falls mainly on the plain. [This is a hyperlink](#) with an **inline strong**, an *inline emphasis*, and some `inline code`. Visited links should also have legible colour.

> "Design is not just what it looks like and feels like. Design is how it works." - Steve Jobs

Muted helper text - usually used for form hints or metadata.

Secondary text - slightly de-emphasised body copy.

```javascript
const order = { id: 'INV-2026-0042', customer: 'Acme Ltd', total: 4250.00 };
Domma.http.post('/api/invoices', order).then(res => {
  E.toast('Invoice saved', { type: 'success' });
});
```

## 3. Buttons

Solid variants

[showcase-demo id="showcase/themes/3-buttons" title="3. Buttons" /]

Outline & size variants

[showcase-demo id="showcase/themes/3-buttons-2" title="3. Buttons" /]

Buttons with icons

[showcase-demo id="showcase/themes/3-buttons-3" title="3. Buttons" /]

## 4. Forms

Bare HTML inputs (.form-input)

[showcase-demo id="showcase/themes/4-forms" title="4. Forms" /]

F.create() - blueprint-driven form

[showcase-demo id="showcase/themes/4-forms-2" title="4. Forms" /]

## 5. Cards - header / footer combinations

Four standard combinations

[showcase-demo id="showcase/themes/5-cards-header-footer-combinations" title="5. Cards - header / footer combinations" /]

Hover & primary variants

[showcase-demo id="showcase/themes/5-cards-header-footer-combinations-2" title="5. Cards - header / footer combinations" /]

Accent cards (left-border colour cue + label)

[showcase-demo id="showcase/themes/5-cards-header-footer-combinations-3" title="5. Cards - header / footer combinations" /]

## 6. Badges, Pills & Number Badges

Badges

Primary

Secondary

Success

Warning

Danger

Info

Pills

Primary pill

Secondary pill

Light pill

Outline pill

Outline primary

Small

Large

Number badges (notification counters)

[showcase-demo id="showcase/themes/6-badges-pills-and-number-badges" title="6. Badges, Pills & Number Badges" /]

## 7. Alerts

> **Primary alert.** System maintenance scheduled for 02:00-04:00 on Sunday.

> **Success.** All overnight CI jobs completed without errors.

> **Warning.** Disk usage on prod-db-01 is at 85% - consider archiving older logs.

> **Danger.** Webhook delivery to Stripe failed three consecutive times.

> **Info.** A new release of Domma is available - see the changelog.

## 8. Tabs & Accordion

[showcase-demo id="showcase/themes/8-tabs-and-accordion" title="8. Tabs & Accordion" /]

## 9. Tables

Bare HTML table (.table)

[table striped="true"]
| ID | Customer | Status | Total |
| --- | --- | --- | --- |
| INV-0001 | Acme Ltd | Paid | £4,250.00 |
| INV-0002 | Globex | Pending | £1,180.00 |
| INV-0003 | Initech | Overdue | £760.00 |
| INV-0004 | Soylent Corp | Paid | £12,500.00 |
[/table]

T.create() - sortable, searchable, paginated

[showcase-demo id="showcase/themes/9-tables" title="9. Tables" /]

## 10. Lists & List Groups

[showcase-demo id="showcase/themes/10-lists-and-list-groups" title="10. Lists & List Groups" /]

## 11. Navigation Components

Breadcrumbs

[showcase-demo id="showcase/themes/11-navigation-components" title="11. Navigation Components" /]

Pagination

‹ Prev

1

2

3

4

…

12

Next ›

Button group - single-select

[showcase-demo id="showcase/themes/11-navigation-components-2" title="11. Navigation Components" /]

Dropdown

[showcase-demo id="showcase/themes/11-navigation-components-3" title="11. Navigation Components" /]

## 12. Loaders & Progress

[showcase-demo id="showcase/themes/12-loaders-and-progress" title="12. Loaders & Progress" /]

Progress bars

[showcase-demo id="showcase/themes/12-loaders-and-progress-2" title="12. Loaders & Progress" /]

## 13. Tooltips

[showcase-demo id="showcase/themes/13-tooltips" title="13. Tooltips" /]

## 14. Modals, Dialogs & Toasts

Trigger buttons

[showcase-demo id="showcase/themes/14-modals-dialogs-and-toasts" title="14. Modals, Dialogs & Toasts" /]

Inline modal (forced visible for inspection)

[showcase-demo id="showcase/themes/14-modals-dialogs-and-toasts-2" title="14. Modals, Dialogs & Toasts" /]

## 15. Slideovers

[showcase-demo id="showcase/themes/15-slideovers" title="15. Slideovers" /]

## 16. Autocomplete & Pillbox

[showcase-demo id="showcase/themes/16-autocomplete-and-pillbox" title="16. Autocomplete & Pillbox" /]

## 17. Progression - Timeline & Roadmap

Timeline mode

[showcase-demo id="showcase/themes/17-progression-timeline-and-roadmap" title="17. Progression - Timeline & Roadmap" /]

Roadmap mode (status colours)

[showcase-demo id="showcase/themes/17-progression-timeline-and-roadmap-2" title="17. Progression - Timeline & Roadmap" /]

## 18. Carousel

[showcase-demo id="showcase/themes/18-carousel" title="18. Carousel" /]

## 19. Code & quotes

Inline code: `const x = Domma.theme.set('mint-light')` should remain readable.

```
function audit() {
  const issues = [];
  document.querySelectorAll('*').forEach(el => {
    if (failsContrast(el)) issues.push(el);
  });
  return issues;
}
```

## Usage

[showcase-demo id="showcase/themes/usage" title="Usage" /]
