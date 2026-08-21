# Domma Reactive Showcase Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make it discoverable that Domma's reactive core is also available as the standalone `domma-reactive` package, via a badged **Reactive** nav section, a showcase page, a tutorial, and the two primitives exposed on Domma's own namespace.

**Architecture:** Two prerequisites unlock the visible work. `Domma.elements.navbar()` gains `item.badge` support (it currently has none, so all eight existing badges in `nav-showcase.json` render nowhere). `models.js` re-exports `observable`/`observableArray` as `M.observable`/`M.observableArray`, so the showcase's live demos run on plain `domma.min.js` rather than needing a second script. Everything else is configuration, pages and release.

**Tech Stack:** Vanilla ES modules, Vitest + jsdom, Rollup, the Domma layout system.

**Spec:** `docs/superpowers/specs/2026-08-04-domma-reactive-showcase-design.md`

---

## Prerequisites

Branch off `main` at `ace4cf9` (v0.31.0), or off `fix/on-updated-without-bindings` if that has been merged first.

```bash
cd /home/darryl/src/js/domma && git status --short && npx vitest run 2>&1 | tail -3
```
Expected: a clean tree, and `Tests  446 passed | 3 skipped (449)` if the `onUpdated` fix is merged, or `436 passed | 3 skipped (439)` if not. **Record whichever you see** - it must not drop.

### Evidence standard - non-negotiable

For every behaviour a test claims to pin: apply a mutation that breaks it, run the suite, confirm the test fails, restore, and report the real failure output. This discipline has caught genuine defects repeatedly on this work, including tests that looked like coverage and were not. A test that does not kill its mutant is not coverage.

---

## File Structure

| File | Responsibility |
|------|----------------|
| `src/elements.js` | Navbar renders `item.badge` at all four render points |
| `src/css/elements.css` | `.navbar-item-badge` appearance, both navbar variants |
| `src/elements.test.js` | Navbar badge tests |
| `src/models.js` | Re-export `observable` / `observableArray` on the models namespace |
| `src/models.test.js` | Pin both exports |
| `public/layouts/config/nav-showcase.json` | The **Reactive** group; prune stale badges |
| `public/showcase/reactive/index.html` | The showcase page |
| `public/showcase/reactive/tutorial.html` | The tutorial |
| `public/showcase/models/reactivity.html` | Reciprocal banner only |
| `public/data/releases.json` | v0.31.0 and v0.32.0 entries, `latestVersion` |
| `public/sitemap.xml` | Both new pages |
| `docs/API.md`, `docs/Reactivity.md` | Navbar badge option; `M.observable` |
| `public/assets/ide/phpstorm/elements.d.ts`, `models.d.ts` | Typings |

---

## Task 1: Navbar badge - failing test

**Files:**
- Test: `src/elements.test.js`

- [ ] **Step 1: Write the failing tests**

Add to `src/elements.test.js`, inside the existing navbar `describe` block:

```javascript
  describe('Navbar badges', () => {
    const BADGED = [
      {text: 'Home', url: '#'},
      {text: 'Shiny', url: '#s', badge: 'New'},
      {
        text: 'Group',
        badge: 'New',
        items: [
          {text: 'Child', url: '#c', badge: 'Beta'},
          {text: 'Plain', url: '#p'}
        ]
      }
    ];

    it('renders a badge on a top-level link', () => {
      document.body.insertAdjacentHTML('beforeend', '<nav id="nav-b1"></nav>');
      const nav = Domma.elements.navbar('#nav-b1', {items: BADGED});
      const link = [...nav.element.querySelectorAll('.navbar-link')]
        .find(a => a.textContent.includes('Shiny'));
      expect(link.querySelector('.navbar-item-badge').textContent).toBe('New');
    });

    it('renders a badge on a depth-0 dropdown toggle', () => {
      document.body.insertAdjacentHTML('beforeend', '<nav id="nav-b2"></nav>');
      const nav = Domma.elements.navbar('#nav-b2', {items: BADGED});
      const toggle = nav.element.querySelector('.navbar-dropdown-toggle');
      expect(toggle.querySelector('.navbar-item-badge').textContent).toBe('New');
    });

    it('renders a badge on a dropdown item', () => {
      document.body.insertAdjacentHTML('beforeend', '<nav id="nav-b3"></nav>');
      const nav = Domma.elements.navbar('#nav-b3', {items: BADGED});
      const item = [...nav.element.querySelectorAll('.navbar-dropdown-item')]
        .find(a => a.textContent.includes('Child'));
      expect(item.querySelector('.navbar-item-badge').textContent).toBe('Beta');
    });

    it('emits no badge markup when the item has no badge', () => {
      document.body.insertAdjacentHTML('beforeend', '<nav id="nav-b4"></nav>');
      const nav = Domma.elements.navbar('#nav-b4', {items: BADGED});
      const plain = [...nav.element.querySelectorAll('.navbar-dropdown-item')]
        .find(a => a.textContent.includes('Plain'));
      expect(plain.querySelector('.navbar-item-badge')).toBeNull();
    });

    it('escapes badge text', () => {
      document.body.insertAdjacentHTML('beforeend', '<nav id="nav-b5"></nav>');
      const nav = Domma.elements.navbar('#nav-b5', {
        items: [{text: 'X', url: '#', badge: '<img src=x onerror=alert(1)>'}]
      });
      const badge = nav.element.querySelector('.navbar-item-badge');
      expect(badge.querySelector('img')).toBeNull();
      expect(badge.textContent).toBe('<img src=x onerror=alert(1)>');
    });
  });
```

- [ ] **Step 2: Run to verify they fail**

Run: `cd /home/darryl/src/js/domma && npx vitest run src/elements.test.js -t "Navbar badges"`
Expected: FAIL - four tests error on reading `.textContent` of `null`; `emits no badge markup` passes vacuously (nothing renders a badge yet). That vacuous pass is expected and is why the other four exist.

---

## Task 2: Navbar badge - implementation

**Files:**
- Modify: `src/elements.js` (`_renderItems`, around lines 5845-5878)
- Modify: `src/css/elements.css`

- [ ] **Step 1: Add the escape helper at module scope**

`Domma.utils.escapeHtml` exists but reaches `elements.js` only through the global, and `_renderItems` is called during tests where resolution order is not guaranteed. Use a self-contained helper instead. Add it immediately above the `Navbar` class in `src/elements.js`:

```javascript
/**
 * Escape text destined for an HTML attribute or text node.
 * Local rather than via Domma.utils so the renderer has no global dependency.
 */
function _escapeText(value) {
    return String(value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}
```

- [ ] **Step 2: Build the badge fragment**

In `_renderItems`, immediately after the `iconHTML` assignment (currently `src/elements.js:5848`), add:

```javascript
            const badgeHTML = item.badge
                ? `<span class="navbar-item-badge">${_escapeText(item.badge)}</span>`
                : '';
```

- [ ] **Step 3: Insert it at all four render points**

Replace each of the four template literals. The badge goes **after the label and before the caret**.

Depth-0 dropdown toggle (currently `:5853`):

```javascript
                    html += `<button class="navbar-link navbar-dropdown-toggle" data-index="${i}" data-path="${path}">${iconHTML}${item.text}${badgeHTML}${caret}</button>`;
```

Nested submenu toggle (currently `:5859`):

```javascript
                    html += `<button class="navbar-dropdown-toggle navbar-submenu-toggle" data-path="${path}">${iconHTML}${item.text}${badgeHTML}${caret}</button>`;
```

Top-level link (currently `:5870`):

```javascript
                    html += `<li class="navbar-item"><a href="${url}" class="navbar-link${item.active ? ' active' : ''}" data-index="${i}" data-path="${path}"${target}>${iconHTML}${item.text}${badgeHTML}</a></li>`;
```

Dropdown item (currently `:5875`):

```javascript
                    html += `<li><a href="${url}" class="navbar-dropdown-item" data-path="${path}"${compat}${target}>${iconHTML}${item.text}${badgeHTML}</a></li>`;
```

- [ ] **Step 4: Run to verify the tests pass**

Run: `cd /home/darryl/src/js/domma && npx vitest run src/elements.test.js -t "Navbar badges"`
Expected: `Tests  5 passed`.

- [ ] **Step 5: Add the CSS**

In `src/css/elements.css`, immediately after the `.navbar-link` rule (currently line 2138), add:

```css
.navbar-item-badge {
    display: inline-block;
    margin-left: 0.4rem;
    padding: 0.1rem 0.4rem;
    border-radius: 999px;
    background: var(--color-primary, #3b82f6);
    color: #fff;
    font-size: 0.65rem;
    font-weight: 600;
    line-height: 1.4;
    letter-spacing: 0.02em;
    text-transform: uppercase;
    vertical-align: middle;
}

.navbar-light .navbar-item-badge {
    background: var(--color-primary, #3b82f6);
    color: #fff;
}
```

- [ ] **Step 6: Mutation-test each render point**

For each of the four, delete `${badgeHTML}` from that one template literal, run `npx vitest run src/elements.test.js -t "Navbar badges"`, confirm exactly the corresponding test fails, restore.

Then delete `_escapeText`'s `.replace(/</g, '&lt;')` and confirm `escapes badge text` fails.

Record the actual failure output for all five.

- [ ] **Step 7: Run the full suite**

Run: `cd /home/darryl/src/js/domma && npx vitest run 2>&1 | tail -3`
Expected: the recorded baseline plus 5. Zero failures.

- [ ] **Step 8: Commit**

```bash
cd /home/darryl/src/js/domma
git add src/elements.js src/elements.test.js src/css/elements.css
git commit -m "feat(navbar): render item badges

navbar() had no badge support, so every \"badge\" entry in
nav-showcase.json rendered nowhere. Badges now render on top-level
links, dropdown items, and both dropdown toggles."
```

---

## Task 3: Navbar badge - docs, showcase, IDE, and pruning

**Files:**
- Modify: `docs/API.md`
- Modify: `public/showcase/elements/navbar/index.html`
- Modify: `public/assets/ide/phpstorm/elements.d.ts`
- Modify: `public/layouts/config/nav-showcase.json`

- [ ] **Step 1: Document the option in `docs/API.md`**

Find the navbar section's item-options table and add a row:

```markdown
| `badge` | `string` | - | Short label rendered beside the item text, e.g. `"New"`. Works on top-level links, dropdown items and dropdown toggles. |
```

- [ ] **Step 2: Add a showcase example**

In `public/showcase/elements/navbar/index.html`, add a demo whose `items` array includes a badged top-level item and a badged group, matching the file's existing demo structure. Follow the surrounding markup conventions exactly rather than inventing a new card shape.

- [ ] **Step 3: Update the IDE typings**

In `public/assets/ide/phpstorm/elements.d.ts`, add `badge?: string;` to the navbar item interface.

- [ ] **Step 4: Prune stale badges**

Making badges visible surfaces eight that have been dormant. Open `public/layouts/config/nav-showcase.json` and review every `"badge": "New"`:

- QuickStart → SPA, MPA
- Core → Router, Components, Integrations
- Data → Blueprints, Reactivity
- UI → Components, Flags

Remove the badge from anything no longer genuinely new. **This is a judgement call - list what you removed and why in your report rather than deciding silently.**

- [ ] **Step 5: Verify nothing broke**

Run: `cd /home/darryl/src/js/domma && npx vitest run 2>&1 | tail -3`
Expected: unchanged from Task 2 Step 7.

- [ ] **Step 6: Commit**

```bash
cd /home/darryl/src/js/domma
git add docs/API.md public/showcase/elements/navbar/index.html public/assets/ide/phpstorm/elements.d.ts public/layouts/config/nav-showcase.json
git commit -m "docs(navbar): document item badges and prune stale ones"
```

---

## Task 4: Expose `M.observable` and `M.observableArray`

**Files:**
- Modify: `src/models.js`
- Test: `src/models.test.js`

- [ ] **Step 1: Write the failing tests**

Add to `src/models.test.js`, matching the file's existing `it('Models - ...')` convention:

```javascript
  it('Models - M.observable holds a value and is tracked', () => {
    const count = Domma.models.observable(2);
    expect(count.value).toBe(2);

    const doubled = Domma.models.computed(() => count.value * 2);
    expect(doubled.get()).toBe(4);

    count.value = 5;
    expect(doubled.get()).toBe(10);
  });

  it('Models - M.observable peek() does not register a dependency', () => {
    const v = Domma.models.observable(1);
    const body = vi.fn(() => v.peek());
    Domma.models.effect(body);

    v.value = 2;
    Domma.models.flush();
    expect(body).toHaveBeenCalledTimes(1);
  });

  it('Models - M.observableArray notifies on push', () => {
    const items = Domma.models.observableArray([]);
    const body = vi.fn(() => items.value.length);
    Domma.models.effect(body);
    expect(body).toHaveBeenCalledTimes(1);

    items.push('a');
    Domma.models.flush();
    expect(body).toHaveBeenCalledTimes(2);
    expect(items.value).toEqual(['a']);
  });
```

- [ ] **Step 2: Run to verify they fail**

Run: `cd /home/darryl/src/js/domma && npx vitest run src/models.test.js -t "M.observable"`
Expected: FAIL - `Domma.models.observable is not a function`.

- [ ] **Step 3: Extend the import**

In `src/models.js`, the import block currently brings in `observable`. Add `observableArray`:

```javascript
import {
    observable,
    observableArray,
    computed as createComputed,
    effect as createEffect,
    untracked as runUntracked,
    flushSync as flushReactive
} from 'domma-reactive';
```

- [ ] **Step 4: Re-export on the models namespace**

In the `export const models = {` object, immediately before `computed(fn, options = {})` (currently `src/models.js:747`), add:

```javascript
    /**
     * A single reactive value. The primitive beneath Models - use `create()`
     * when you want a schema, validation and persistence; use this when you
     * want one tracked value and nothing else.
     *
     *   const count = M.observable(0);
     *   const total = M.computed(() => count.value * 10);
     *   count.value = 3;   // total.get() → 30
     *
     * Also published standalone as `domma-reactive`, where the same function
     * is a bare `observable()` import.
     *
     * @param {*} initial
     * @param {Object}   [options]
     * @param {Function} [options.equals] Change gate. Defaults to deep equality.
     * @returns {{value: *, peek: Function, set: Function}}
     */
    observable,

    /**
     * A reactive array whose in-place mutators notify.
     *
     *   const items = M.observableArray([]);
     *   items.push('a');   // effects reading items.value re-run
     *
     * `push`, `pop`, `shift`, `unshift`, `splice`, `sort`, `reverse`, `fill`
     * and `copyWithin` notify unconditionally - an in-place mutation leaves the
     * array deep-equal to any copy of it, so the equality gate cannot see it.
     *
     * @param {Array}  [initial=[]]
     * @param {Object} [options] Same options as observable()
     * @returns {Object}
     */
    observableArray,
```

- [ ] **Step 5: Run to verify they pass**

Run: `cd /home/darryl/src/js/domma && npx vitest run src/models.test.js -t "M.observable"`
Expected: `Tests  3 passed`.

- [ ] **Step 6: Mutation-test**

Remove `observable,` from the namespace object, run the three tests, confirm two fail. Restore. Remove `observableArray,`, confirm the third fails. Restore. Record both outputs.

- [ ] **Step 7: Run the full suite**

Run: `cd /home/darryl/src/js/domma && npx vitest run 2>&1 | tail -3`
Expected: Task 3's figure plus 3.

- [ ] **Step 8: Commit**

```bash
cd /home/darryl/src/js/domma
git add src/models.js src/models.test.js
git commit -m "feat(models): expose observable() and observableArray()

The extraction introduced both primitives but left them unreachable from
Domma. Reactivity is innate to the suite, so its primitives should be too."
```

---

## Task 5: `M.observable` documentation

**Files:**
- Modify: `docs/API.md`
- Modify: `docs/Reactivity.md`
- Modify: `CLAUDE.md`
- Modify: `src/CLAUDE.md`
- Modify: `public/assets/ide/phpstorm/models.d.ts`

- [ ] **Step 1: `docs/Reactivity.md`**

Add a section before the existing `M.computed()` material:

```markdown
## Observables

`M.observable(initial)` is a single reactive value - the primitive beneath Models.
Use `M.create()` when you want a schema, validation and persistence; use an observable
when you want one tracked value and nothing else.

```javascript
const price = M.observable(10);
const qty   = M.observable(3);
const total = M.computed(() => price.value * qty.value);

M.effect(() => console.log('total', total.get()));
qty.value = 4;   // effect re-runs on the next microtask
```

`M.observableArray()` is the array form. Its in-place mutators - `push`, `pop`, `shift`,
`unshift`, `splice`, `sort`, `reverse`, `fill`, `copyWithin` - notify unconditionally,
because an in-place mutation leaves the array deep-equal to any copy of it and the
equality gate cannot see it.

Both are also published standalone as [`domma-reactive`](https://www.npmjs.com/package/domma-reactive),
where they are bare `observable()` / `observableArray()` imports. Reactivity remains innate
to Domma - the package is an additional way in, not a relocation.
```

- [ ] **Step 2: `docs/API.md`**

Add `M.observable(initial, options)` and `M.observableArray(initial, options)` to the models
namespace reference, with the signatures from Task 4 Step 4.

- [ ] **Step 3: CLAUDE.md files**

In `CLAUDE.md`, the Models bullet list under "Domma Features Reference", add:

```markdown
- Observables: `M.observable(value)`, `M.observableArray([])` - single reactive values, the primitive
  beneath Models. Also published standalone as `domma-reactive`.
```

Make the equivalent addition to `src/CLAUDE.md` under its `models.js` section.

- [ ] **Step 4: IDE typings**

In `public/assets/ide/phpstorm/models.d.ts`, declare both:

```typescript
    observable<T>(initial: T, options?: {equals?: (a: T, b: T) => boolean}): {
        value: T;
        peek(): T;
        set(next: T): void;
    };

    observableArray<T>(initial?: T[], options?: {equals?: (a: T[], b: T[]) => boolean}): {
        value: T[];
        length: number;
        peek(): T[];
        set(next: T[]): void;
        push(...items: T[]): number;
        pop(): T | undefined;
        shift(): T | undefined;
        unshift(...items: T[]): number;
        splice(start: number, deleteCount?: number, ...items: T[]): T[];
        sort(compare?: (a: T, b: T) => number): T[];
        reverse(): T[];
        fill(value: T, start?: number, end?: number): T[];
        copyWithin(target: number, start: number, end?: number): T[];
        remove(item: T): object;
        removeAll(): object;
    };
```

- [ ] **Step 5: Commit**

```bash
cd /home/darryl/src/js/domma
git add docs/API.md docs/Reactivity.md CLAUDE.md src/CLAUDE.md public/assets/ide/phpstorm/models.d.ts
git commit -m "docs: document M.observable and M.observableArray"
```

---

## Task 6: The Reactive menu header

**Files:**
- Modify: `public/layouts/config/nav-showcase.json`

- [ ] **Step 1: Add the group**

Insert immediately after the `"Data"` group object in the `items` array:

```json
    {
      "text": "Reactive",
      "badge": "New",
      "items": [
        {
          "text": "Domma Reactive",
          "url": "showcase/reactive/index.html",
          "section": "reactive"
        },
        {
          "text": "Tutorial",
          "url": "showcase/reactive/tutorial.html",
          "section": "reactive-tutorial"
        }
      ]
    },
```

- [ ] **Step 2: Verify the JSON parses and the badge is present**

```bash
cd /home/darryl/src/js/domma
node -p "
const n=require('./public/layouts/config/nav-showcase.json');
const g=n.items.find(i=>i.text==='Reactive');
JSON.stringify({found: !!g, badge: g && g.badge, children: g && g.items.map(c=>c.url)}, null, 1)"
```
Expected: `found: true`, `badge: "New"`, both URLs listed.

- [ ] **Step 3: Commit**

```bash
cd /home/darryl/src/js/domma
git add public/layouts/config/nav-showcase.json
git commit -m "feat(nav): add the Reactive showcase section"
```

---

## Task 7: The showcase page

**Files:**
- Create: `public/showcase/reactive/index.html`

- [ ] **Step 1: Read two references before writing anything**

Read `public/showcase/models/reactivity.html` in full - it is the closest sibling and establishes the section markup, code-block conventions and live-demo pattern. Read `public/showcase/CLAUDE.md` for the showcase rules. **Follow those conventions rather than inventing a new page shape.**

- [ ] **Step 2: Create the page**

```html
<body class="dm-cloaked" data-layout="showcase" data-layout-variant="subpage">
```

That is the exact form all 26 existing showcase subpages use - **not** `data-layout="showcase:subpage"`, which is not a value the detector recognises. Layout system supplies header/footer/sidebar; call `I.scan()` after load (there is no `Domma.init()` - Domma self-initialises); use Domma throughout (`E.*`, `$`, `_`).

**Theme rule:** every colour must resolve through a CSS variable. `--dm-border`, `--dm-warning-bg` and friends are redefined for the dark variant in `public/dist/domma.css`, so `var(--dm-border)` adapts and a literal like `#cbd5e1` does not. This applies inside `Domma.component()` templates too - `_injectStyles()` injects the theme variables into each Shadow DOM, so `var(--dm-border)` resolves there.

Sections, each with a live runnable demo - not a static code block:

1. **Hero** - reactivity is innate to Domma, and available on its own.
2. **Why a separate package** - the extraction, what it buys, and the explicit statement that nothing moved out of Domma.
3. **Install** - three tabs or cards: `npm i domma-reactive` · CDN script tag · *already in Domma, nothing to install*.
4. **`observable()`** - a counter driving a computed.
5. **`observableArray()`** - a list with push/remove, and a note on why mutators notify unconditionally.
6. **`computed` / `effect`** - including a batching demo showing several writes collapsing into one re-run.
7. **`untracked` / `flushSync`**.
8. **Using it inside Domma** - how `M.observable` relates to `M.create()` and `model.tracked()`. State plainly that Models remain the primary idiom and observables are the primitive beneath, so nobody reads this as a deprecation.
9. **Method reference** - a table. Use `T.create()` if it suits the existing conventions; a plain table is fine if that is what the sibling page does.
10. **Banner** → `../models/reactivity.html`.

Every demo shows both forms:

```javascript
// Innate - this page runs this
const count = M.observable(0);

// Standalone - same function, imported directly
import {observable} from 'domma-reactive';
const count = observable(0);
```

- [ ] **Step 3: Verify it renders**

The page must load with zero console errors. Check in the browser, or extend the `src/examples.test.js` jsdom harness pattern.

**You cannot claim it works from a passing build alone** - the v0.30.0 modal regression passed every unit test. Either verify visually or write the assertion.

- [ ] **Step 4: Commit**

```bash
cd /home/darryl/src/js/domma
git add public/showcase/reactive/index.html
git commit -m "docs(showcase): add the Domma Reactive showcase page"
```

---

## Task 8: The tutorial

**Files:**
- Create: `public/showcase/reactive/tutorial.html`

- [ ] **Step 1: Build one thing end to end**

Same layout and conventions as Task 7. A single worked example, built in steps, each step a runnable demo:

1. Two observables - `price` and `qty`.
2. A computed total derived from them.
3. An effect that paints the total into the DOM.
4. Swap to `observableArray` for line items; show `push` and `remove` updating the total.
5. Batching - several writes in one tick producing one repaint.

Close with next steps: the showcase page, `docs/Reactivity.md`, and the npm package.

- [ ] **Step 2: Verify it renders**

Zero console errors, same standard as Task 7 Step 3.

- [ ] **Step 3: Commit**

```bash
cd /home/darryl/src/js/domma
git add public/showcase/reactive/tutorial.html
git commit -m "docs(showcase): add the Domma Reactive tutorial"
```

---

## Task 9: Reciprocal banner and sitemap

**Files:**
- Modify: `public/showcase/models/reactivity.html`
- Modify: `public/sitemap.xml`

- [ ] **Step 1: Add the banner**

Near the top of `public/showcase/models/reactivity.html`, using the same alert/card markup the showcase already uses elsewhere:

> **Want this without Domma?** The same dependency tracking is published standalone as `domma-reactive`. See [Domma Reactive](../reactive/index.html).

Change nothing else on this page.

- [ ] **Step 2: Add both pages to the sitemap**

In `public/sitemap.xml`, following the existing entry format exactly:

```xml
    <url>
        <loc>https://dommajs.org/showcase/reactive/index.html</loc>
        <changefreq>monthly</changefreq>
        <priority>0.8</priority>
    </url>
    <url>
        <loc>https://dommajs.org/showcase/reactive/tutorial.html</loc>
        <changefreq>monthly</changefreq>
        <priority>0.7</priority>
    </url>
```

**Check the existing entries first** - match their host, trailing-slash style and element set rather than assuming the above is right.

- [ ] **Step 3: Verify the sitemap is well-formed**

```bash
cd /home/darryl/src/js/domma && node -e "
const fs=require('fs');
const s=fs.readFileSync('public/sitemap.xml','utf8');
const n=(s.match(/<url>/g)||[]).length, c=(s.match(/<\/url>/g)||[]).length;
console.log('open',n,'close',c, n===c?'BALANCED':'MISMATCH');
console.log('reactive entries:', (s.match(/showcase\/reactive/g)||[]).length);"
```
Expected: `BALANCED`, and `reactive entries: 2`.

- [ ] **Step 4: Commit**

```bash
cd /home/darryl/src/js/domma
git add public/showcase/models/reactivity.html public/sitemap.xml
git commit -m "docs(showcase): cross-link the two reactivity pages"
```

---

## Task 10: What's New - the v0.31.0 entry

**Files:**
- Modify: `public/data/releases.json`

- [ ] **Step 1: Inspect the existing entry shape**

```bash
cd /home/darryl/src/js/domma && node -p "
const r=require('./public/data/releases.json');
JSON.stringify({keys:Object.keys(r), latestVersion:r.latestVersion, entryKeys:Object.keys(r.releases[0])},null,1)"
```

Note that `year` holds the version string - that is the existing convention, however odd. Follow it.

- [ ] **Step 2: Prepend the v0.31.0 entry**

Add as the first element of the `releases` array:

```json
    {
      "year": "v0.31.0",
      "title": "Reactive Core Extracted",
      "description": "<p><strong>Internal restructuring. No API change.</strong> Every public method behaves exactly as it did in v0.30.1 - nothing to migrate.</p><p>Domma's dependency-tracking core is now also published standalone as <a href=\"https://www.npmjs.com/package/domma-reactive\"><strong>domma-reactive</strong></a>, providing <code>observable()</code>, <code>observableArray()</code>, <code>computed()</code>, <code>effect()</code>, <code>untracked()</code> and <code>flushSync()</code> with no dependency on Domma. Reactivity remains innate to the suite - the package is an additional way in, not a relocation.</p><p><strong>You do not need to install it.</strong> Domma takes it as an exact-pinned build-time dependency and Rollup inlines it, so <code>domma.min.js</code> remains a single self-contained file and the CDN story is unchanged.</p><p><strong>Internally:</strong> <code>Model</code> now backs each field with its own observable rather than a plain object plus a shared <code>DepMap</code>, with <code>utils.isEqual</code> passed explicitly so change detection stays byte-identical. <code>src/reactive.js</code> has been deleted.</p><p>See the new <a href=\"../showcase/reactive/index.html\">Domma Reactive showcase</a>.</p>",
      "date": "2026-08-04"
    },
```

**Do not change `latestVersion` yet** - Task 11 sets it to `v0.32.0` so the pill pulses for the release that actually contains this work.

- [ ] **Step 3: Verify it parses and renders**

```bash
cd /home/darryl/src/js/domma && node -p "
const r=require('./public/data/releases.json');
JSON.stringify({newest:r.releases[0].year, count:r.releases.length, latestVersion:r.latestVersion},null,1)"
```
Expected: `newest: "v0.31.0"`, count one higher than before, `latestVersion` still `v0.25.0`.

Then load `/changelog/` in the browser and confirm the entry renders with its links working.

- [ ] **Step 4: Commit**

```bash
cd /home/darryl/src/js/domma
git add public/data/releases.json
git commit -m "docs: add the v0.31.0 changelog entry"
```

---

## Task 11: Release v0.32.0

Follow the documented manual release process - **not** `npm run release:patch`, which is known to be broken in this repo.

- [ ] **Step 1: Fetch first**

```bash
cd /home/darryl/src/js/domma && git fetch origin && git rev-list --left-right --count HEAD...origin/main
```
Local main can be stale; building a release on a stale base has clobbered a real tag before.

- [ ] **Step 2: Confirm the `onUpdated` fix is in**

```bash
cd /home/darryl/src/js/domma && grep -c "_wireUpdateWatcher" src/component-factory.js
```
Expected: `2` or more. If `0`, the `fix/on-updated-without-bindings` branch has not been merged - merge it before releasing, or drop it from the release notes.

- [ ] **Step 3: Release notes**

Prepend a `### v0.32.0 - Reactive Discoverability (2026-08-04)` section to `docs/RELEASE_NOTES.md`, newest first, matching the existing format. Cover:

- `M.observable` / `M.observableArray` - new public API, which is why this is a minor.
- Navbar item badges.
- The `onUpdated` fix - components whose templates contain no `{{ }}` bindings now fire the hook. Note the convergence requirement: writes from `onUpdated` must settle to an equal value or the microtask chain runs to exhaustion.
- Known issue: `onUpdated` does not fire for fields absent from `data()`, nor for components with no `data()` at all.

Commit as `docs: add v0.32.0 release notes`.

- [ ] **Step 4: Set `latestVersion`**

In `public/data/releases.json`, add the v0.32.0 entry as the first element and set `"latestVersion": "v0.32.0"`. Commit as `docs: add the v0.32.0 changelog entry`.

- [ ] **Step 5: Bump, build, commit, tag**

```bash
cd /home/darryl/src/js/domma
npm version minor --no-git-tag-version
npm run build
git add package.json package-lock.json public/download/kickstart-manifest.json
git commit -m "Build v0.32.0"
git tag -a v0.32.0 -m "Release v0.32.0"
```

Minor, not patch: `M.observable` and `M.observableArray` are new public API.

- [ ] **Step 6: Verify the build before anything leaves the machine**

```bash
cd /home/darryl/src/js/domma
grep -c "domma-reactive" public/dist/domma.min.js
npx vitest run 2>&1 | tail -3
```
Expected: `0` (the bundle stays self-contained), and zero test failures.

- [ ] **Step 7: Confirm, then publish**

`git push`, `npm publish` and `gh release create` are outward-facing and effectively irreversible.
**Confirm with the repository owner before running them.**

Note: `git push origin main` must be run **from `main`**. Running it from a feature branch pushes local `main` instead, which has already happened once on this project and left a tag unreachable from `main`.

```bash
cd /home/darryl/src/js/domma
git checkout main && git merge --ff-only <branch>
git push origin main
git push origin v0.32.0
npm publish --access public
gh release create v0.32.0 --title "Domma v0.32.0" --notes "<notes>" \
  public/dist/domma.min.js public/dist/domma.esm.js \
  public/dist/domma.css public/dist/grid.css public/dist/elements.css
```

- [ ] **Step 8: Verify the release landed**

```bash
cd /home/darryl/src/js/domma
npm view domma-js version
git merge-base --is-ancestor v0.32.0 main && echo "tag reachable from main"
```
Expected: `0.32.0`, and the tag reachable.

---

## Self-Review

**Spec coverage:**

| Spec requirement | Task |
|---|---|
| Part 1 - navbar badge support | 1, 2, 3 |
| Part 1 - prune the eight dormant badges | 3 (Step 4) |
| Part 2 - `M.observable` / `M.observableArray` | 4, 5 |
| Part 3 - the Reactive menu header | 6 |
| Part 4 - showcase page | 7 |
| Part 4 - tutorial | 8 |
| Part 4 - reciprocal banner, sitemap | 9 |
| Part 5 - v0.31.0 changelog entry, `latestVersion` | 10, 11 (Step 4) |
| Part 6 - v0.32.0 release | 11 |

**Naming consistency:** `.navbar-item-badge` is used identically in Tasks 1, 2 and 3. `_escapeText` is defined in Task 2 Step 1 before its use in Step 2. `badgeHTML` is defined in Task 2 Step 2 before its use in Step 3. `M.observable` / `M.observableArray` are named identically in Tasks 4, 5, 7 and 8.

**Known gaps, stated rather than hidden:**
- Tasks 7 and 8 specify page *structure* and demo *content*, not literal markup - the pages must follow `public/showcase/models/reactivity.html`'s conventions, which are too long to reproduce here and would go stale if copied. Both tasks require reading that file first.
- Task 3 Step 4 is a judgement call about which badges are stale. The plan requires the decision to be reported, not made silently.
- Task 9's sitemap snippet assumes a host and element set; the step requires checking the existing entries first.
- The escaping asymmetry is deliberate: the badge is escaped, `item.text` is not. Fixing `item.text` is out of scope per the spec and would be a separate behaviour change.
