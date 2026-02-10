# CSS Customisation Sections - Implementation Status

## Completed (5/28)
- [x] card
- [x] modal
- [x] tabs
- [x] navbar
- [x] forms

## Remaining (23/28)

Each section follows this template structure (insert BEFORE the "Related" section):

```html
<!-- CSS Customisation Section -->
<section class="card mb-6" data-section="CSS Customisation">
    <div class="card-header">
        <h2 class="text-xl font-semibold m-0">CSS Customisation</h2>
    </div>
    <div class="card-body">
        <p class="mb-4">Override these CSS variables to customise [Component] appearance and match your design system.</p>
        <table class="option-table mb-6">
            <tr><th>Variable</th><th>Default</th><th>Controls</th></tr>
            <!-- Component-specific variables here -->
        </table>
        <h4 class="category-title">Example Override</h4>
        <pre class="code-block language-css">:root {
    /* Component-specific example */
}</pre>
        <p class="mt-4">
            <a href="../css-customisation/index.html">Full CSS Customisation Cheat-Sheet &rarr;</a>
        </p>
    </div>
</section>
```

---

### accordion (line 382)
```html
<tr><td><code>--dm-accordion-border</code></td><td><code>var(--dm-border)</code></td><td>Accordion border colour</td></tr>
<tr><td><code>--dm-accordion-header-hover</code></td><td><code>var(--dm-hover-bg)</code></td><td>Header hover background</td></tr>
<tr><td><code>--dm-radius-lg</code></td><td><code>0.5rem</code></td><td>Accordion corner radius</td></tr>
<tr><td><code>--dm-primary</code></td><td><code>var(--dm-blue-600)</code></td><td>Active item indicator colour</td></tr>
```
Example override:
```css
:root {
    /* Borderless accordion */
    --dm-accordion-border: transparent;
    --dm-accordion-header-hover: rgba(0,0,0,0.02);
}
```

---

### alarm (varies by file)
```html
<tr><td><code>--dm-success</code></td><td><code>var(--dm-green-600)</code></td><td>Active alarm colour</td></tr>
<tr><td><code>--dm-warning</code></td><td><code>var(--dm-amber-500)</code></td><td>Upcoming alarm colour</td></tr>
<tr><td><code>--dm-secondary</code></td><td><code>var(--dm-slate-600)</code></td><td>Disabled alarm colour</td></tr>
<tr><td><code>--dm-surface</code></td><td><code>var(--dm-white)</code></td><td>Alarm card background</td></tr>
```
Example override:
```css
:root {
    /* Custom alarm colours */
    --dm-success: #10b981;
    --dm-warning: #f59e0b;
}
```

---

### autocomplete (line varies)
```html
<tr><td><code>--dm-autocomplete-bg</code></td><td><code>var(--dm-surface)</code></td><td>Dropdown background</td></tr>
<tr><td><code>--dm-autocomplete-border</code></td><td><code>var(--dm-border)</code></td><td>Dropdown border colour</td></tr>
<tr><td><code>--dm-autocomplete-highlight</code></td><td><code>var(--dm-primary-light)</code></td><td>Match highlight colour</td></tr>
<tr><td><code>--dm-hover-bg</code></td><td><code>var(--dm-slate-100)</code></td><td>Item hover background</td></tr>
```
Example override:
```css
:root {
    /* Yellow match highlighting */
    --dm-autocomplete-highlight: #fef3c7;
}
```

---

### back-to-top (line varies)
```html
<tr><td><code>--dm-primary</code></td><td><code>var(--dm-blue-600)</code></td><td>Button background colour</td></tr>
<tr><td><code>--dm-primary-hover</code></td><td><code>var(--dm-blue-700)</code></td><td>Button hover colour</td></tr>
<tr><td><code>--dm-radius-full</code></td><td><code>9999px</code></td><td>Button shape (circular)</td></tr>
<tr><td><code>--dm-shadow-md</code></td><td><code>0 4px 6px...</code></td><td>Button shadow</td></tr>
```
Example override:
```css
:root {
    /* Square button */
    --dm-radius-full: 0.5rem;
}
```

---

### badge (line 521)
```html
<tr><td><code>--dm-primary</code></td><td><code>var(--dm-blue-600)</code></td><td>Primary badge colour</td></tr>
<tr><td><code>--dm-success</code></td><td><code>var(--dm-green-600)</code></td><td>Success badge colour</td></tr>
<tr><td><code>--dm-danger</code></td><td><code>var(--dm-red-600)</code></td><td>Danger badge colour</td></tr>
<tr><td><code>--dm-radius-full</code></td><td><code>9999px</code></td><td>Badge shape (pill)</td></tr>
```
Example override:
```css
:root {
    /* Square badges */
    --dm-radius-full: 0.25rem;
}
```

---

### breadcrumbs (line varies)
```html
<tr><td><code>--dm-primary</code></td><td><code>var(--dm-blue-600)</code></td><td>Active link colour</td></tr>
<tr><td><code>--dm-text-muted</code></td><td><code>var(--dm-slate-500)</code></td><td>Inactive item colour</td></tr>
<tr><td><code>--dm-text</code></td><td><code>var(--dm-slate-800)</code></td><td>Current page text</td></tr>
<tr><td><code>--dm-font-size-sm</code></td><td><code>0.875rem</code></td><td>Breadcrumb text size</td></tr>
```
Example override:
```css
:root {
    /* Larger breadcrumbs */
    --dm-font-size-sm: 1rem;
}
```

---

### button-group (line 1001)
```html
<tr><td><code>--dm-primary</code></td><td><code>var(--dm-blue-600)</code></td><td>Active button colour</td></tr>
<tr><td><code>--dm-primary-hover</code></td><td><code>var(--dm-blue-700)</code></td><td>Active button hover</td></tr>
<tr><td><code>--dm-border</code></td><td><code>var(--dm-slate-300)</code></td><td>Button border colour</td></tr>
<tr><td><code>--dm-radius-md</code></td><td><code>0.375rem</code></td><td>Button corner radius</td></tr>
```
Example override:
```css
:root {
    /* Flat button group */
    --dm-border: transparent;
}
```

---

### carousel (line varies)
```html
<tr><td><code>--dm-radius-lg</code></td><td><code>0.5rem</code></td><td>Carousel corner radius</td></tr>
<tr><td><code>--dm-primary</code></td><td><code>var(--dm-blue-600)</code></td><td>Control/indicator colour</td></tr>
<tr><td><code>--dm-shadow-md</code></td><td><code>0 4px 6px...</code></td><td>Carousel shadow</td></tr>
<tr><td><code>--dm-surface</code></td><td><code>var(--dm-white)</code></td><td>Carousel background</td></tr>
```
Example override:
```css
:root {
    /* Custom control colour */
    /* Target .carousel-controls button with CSS */
}
```

---

### cookie-consent (line varies)
```html
<tr><td><code>--dm-primary</code></td><td><code>var(--dm-blue-600)</code></td><td>Accept button colour</td></tr>
<tr><td><code>--dm-surface</code></td><td><code>var(--dm-white)</code></td><td>Banner background</td></tr>
<tr><td><code>--dm-border</code></td><td><code>var(--dm-slate-300)</code></td><td>Banner border</td></tr>
<tr><td><code>--dm-shadow-lg</code></td><td><code>0 10px 15px...</code></td><td>Banner shadow</td></tr>
```
Example override:
```css
:root {
    /* Dark cookie banner */
    --dm-surface: #1e293b;
    --dm-text: #f1f5f9;
}
```

---

### dialog (line varies)
```html
<tr><td><code>--dm-surface</code></td><td><code>var(--dm-white)</code></td><td>Dialog background</td></tr>
<tr><td><code>--dm-radius-lg</code></td><td><code>0.5rem</code></td><td>Dialog corner radius</td></tr>
<tr><td><code>--dm-border</code></td><td><code>var(--dm-slate-300)</code></td><td>Dialog border</td></tr>
<tr><td><code>--dm-primary</code></td><td><code>var(--dm-blue-600)</code></td><td>Confirm button colour</td></tr>
```
Example override:
```css
:root {
    /* Same as Modal overrides */
}
```

---

### dropdown (line 435)
```html
<tr><td><code>--dm-dropdown-bg</code></td><td><code>var(--dm-surface)</code></td><td>Dropdown background</td></tr>
<tr><td><code>--dm-dropdown-border</code></td><td><code>var(--dm-border)</code></td><td>Dropdown border</td></tr>
<tr><td><code>--dm-dropdown-item-hover</code></td><td><code>var(--dm-hover-bg)</code></td><td>Item hover background</td></tr>
<tr><td><code>--dm-shadow-md</code></td><td><code>0 4px 6px...</code></td><td>Dropdown shadow</td></tr>
```
Example override:
```css
:root {
    /* Highlight hover with primary */
    --dm-dropdown-item-hover: var(--dm-primary-light);
}
```

---

### editor (line varies)
```html
<tr><td><code>--dm-surface</code></td><td><code>var(--dm-white)</code></td><td>Editor background</td></tr>
<tr><td><code>--dm-border</code></td><td><code>var(--dm-slate-300)</code></td><td>Editor border</td></tr>
<tr><td><code>--dm-radius-md</code></td><td><code>0.375rem</code></td><td>Editor corner radius</td></tr>
<tr><td><code>--dm-primary</code></td><td><code>var(--dm-blue-600)</code></td><td>Toolbar button active colour</td></tr>
```
Example override:
```css
:root {
    /* Dark editor theme */
    --dm-surface: #1e293b;
    --dm-text: #f1f5f9;
}
```

---

### hero (line varies)
```html
<tr><td><code>--dm-primary</code></td><td><code>var(--dm-blue-600)</code></td><td>Primary hero background/gradient</td></tr>
<tr><td><code>--dm-text-inverse</code></td><td><code>var(--dm-white)</code></td><td>Text on dark hero</td></tr>
<tr><td><code>--dm-font-size-4xl</code></td><td><code>2.25rem</code></td><td>Hero title size</td></tr>
<tr><td><code>--dm-font-size-xl</code></td><td><code>1.25rem</code></td><td>Hero subtitle size</td></tr>
```
Example override:
```css
/* Custom gradient - create new class */
.hero-custom {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}
```

---

### loader (line varies)
```html
<tr><td><code>--dm-primary</code></td><td><code>var(--dm-blue-600)</code></td><td>Spinner/animation colour</td></tr>
<tr><td><code>--dm-surface</code></td><td><code>var(--dm-white)</code></td><td>Overlay background (if used)</td></tr>
<tr><td><code>--dm-text</code></td><td><code>var(--dm-slate-800)</code></td><td>Loading text colour</td></tr>
```
Example override:
```css
:root {
    /* White spinner for dark backgrounds */
    /* Override via JavaScript color option */
}
```

---

### notification (line varies)
```html
<tr><td><code>--dm-primary</code></td><td><code>var(--dm-blue-600)</code></td><td>Icon colour (browser-managed)</td></tr>
```
Example override:
```css
/* Desktop notifications are browser-managed */
/* Override via JavaScript options (icon, badge) */
```

---

### pillbox (line varies)
```html
<tr><td><code>--dm-pillbox-bg</code></td><td><code>var(--dm-surface)</code></td><td>Pillbox background</td></tr>
<tr><td><code>--dm-pillbox-border</code></td><td><code>var(--dm-border)</code></td><td>Pillbox border</td></tr>
<tr><td><code>--dm-pill-bg</code></td><td><code>var(--dm-gray-200)</code></td><td>Individual pill background</td></tr>
<tr><td><code>--dm-pill-color</code></td><td><code>var(--dm-text)</code></td><td>Pill text colour</td></tr>
```
Example override:
```css
:root {
    /* Brand-coloured pills */
    --dm-pill-bg: var(--dm-primary-light);
    --dm-pill-color: var(--dm-primary);
}
```

---

### progression (line varies)
```html
<tr><td><code>--dm-success</code></td><td><code>var(--dm-green-600)</code></td><td>Completed status colour</td></tr>
<tr><td><code>--dm-info</code></td><td><code>var(--dm-sky-500)</code></td><td>In-progress status colour</td></tr>
<tr><td><code>--dm-warning</code></td><td><code>var(--dm-amber-500)</code></td><td>Blocked status colour</td></tr>
<tr><td><code>--dm-primary</code></td><td><code>var(--dm-blue-600)</code></td><td>Planned status colour</td></tr>
```
Example override:
```css
:root {
    /* Custom status colours */
    --dm-success: #10b981;
    --dm-info: #3b82f6;
}
```

---

### slideover (line varies)
```html
<tr><td><code>--dm-surface</code></td><td><code>var(--dm-white)</code></td><td>Slideover background</td></tr>
<tr><td><code>--dm-shadow-xl</code></td><td><code>0 20px 25px...</code></td><td>Slideover shadow</td></tr>
<tr><td><code>--dm-transition-normal</code></td><td><code>250ms ease</code></td><td>Slide animation speed</td></tr>
<tr><td><code>--dm-text</code></td><td><code>var(--dm-slate-800)</code></td><td>Content text colour</td></tr>
```
Example override:
```css
:root {
    /* Dark slideover */
    --dm-surface: #1e293b;
    --dm-text: #f1f5f9;
}
```

---

### timeline (line varies)
```html
<tr><td><code>--dm-primary</code></td><td><code>var(--dm-blue-600)</code></td><td>Timeline line/marker colour</td></tr>
<tr><td><code>--dm-surface</code></td><td><code>var(--dm-white)</code></td><td>Event card background</td></tr>
<tr><td><code>--dm-border</code></td><td><code>var(--dm-slate-300)</code></td><td>Event card border</td></tr>
```
Example override:
```css
:root {
    /* Custom timeline accent */
    --dm-primary: #8b5cf6;
}
```

---

### timer (line varies)
```html
<tr><td><code>--dm-success</code></td><td><code>var(--dm-green-600)</code></td><td>Timer colour (plenty of time)</td></tr>
<tr><td><code>--dm-warning</code></td><td><code>var(--dm-amber-500)</code></td><td>Timer colour (low time)</td></tr>
<tr><td><code>--dm-danger</code></td><td><code>var(--dm-red-600)</code></td><td>Timer colour (critical)</td></tr>
<tr><td><code>--dm-font-size-3xl</code></td><td><code>1.875rem</code></td><td>Timer display size</td></tr>
```
Example override:
```css
/* Time colour thresholds set via JavaScript options */
```

---

### toast (line varies)
```html
<tr><td><code>--dm-slate-800</code></td><td><code>#1e293b</code></td><td>Toast background (default)</td></tr>
<tr><td><code>--dm-success</code></td><td><code>var(--dm-green-600)</code></td><td>Success toast colour</td></tr>
<tr><td><code>--dm-danger</code></td><td><code>var(--dm-red-600)</code></td><td>Error toast colour</td></tr>
<tr><td><code>--dm-radius-md</code></td><td><code>0.375rem</code></td><td>Toast corner radius</td></tr>
```
Example override:
```css
/* Toast positioning/styling via JavaScript options */
```

---

### tooltip (line 476)
```html
<tr><td><code>--dm-slate-900</code></td><td><code>#0f172a</code></td><td>Tooltip background</td></tr>
<tr><td><code>--dm-radius-md</code></td><td><code>0.375rem</code></td><td>Tooltip corner radius</td></tr>
<tr><td><code>--dm-font-size-sm</code></td><td><code>0.875rem</code></td><td>Tooltip text size</td></tr>
<tr><td><code>--dm-text-inverse</code></td><td><code>var(--dm-white)</code></td><td>Tooltip text colour</td></tr>
```
Example override:
```css
/* Light tooltip - override inline or create custom class */
.tooltip-light {
    background: #f9fafb;
    color: #1f2937;
}
```

---

### treeview (line varies)
```html
<tr><td><code>--dm-primary</code></td><td><code>var(--dm-blue-600)</code></td><td>Selected node colour</td></tr>
<tr><td><code>--dm-hover-bg</code></td><td><code>var(--dm-slate-100)</code></td><td>Node hover background</td></tr>
<tr><td><code>--dm-border</code></td><td><code>var(--dm-slate-300)</code></td><td>Tree border colour</td></tr>
<tr><td><code>--dm-text</code></td><td><code>var(--dm-slate-800)</code></td><td>Node text colour</td></tr>
```
Example override:
```css
:root {
    /* Highlight selected nodes */
    --dm-primary: #059669;
}
```

---

## Implementation Notes

1. Each section should be inserted BEFORE the last "Related" section (usually SECTION 8)
2. Preserve existing indentation and formatting
3. Use `data-section="CSS Customisation"` for TOC integration
4. Link to `../css-customisation/index.html` at the end of each section
5. Keep examples practical and component-specific

## Automation Script (Optional)

Can be implemented as bash/python script to:
1. Find "Related" section line number
2. Insert CSS Customisation section HTML before it
3. Use component-specific variables from this document
