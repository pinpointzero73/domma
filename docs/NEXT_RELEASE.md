<!--
The next release's notes. Write them here as the work lands.

"Cut a release" (Actions tab) moves them into docs/RELEASE_NOTES.md and
public/data/releases.json, stamped with the version and date, and resets this
file. It refuses to run while the title or either section is empty.

  - The line starting "# " is the release title, e.g. "# Readers That Hear Every Change".
  - Between the title and the website marker: the notes, in RELEASE_NOTES.md
    style - a bold lead paragraph, then emoji-headed groups of bullets.
  - After the website marker: the short HTML summary for releases.json -
    one or two <p> elements.

This comment is instructions only and is never copied.
-->

# Safer Bindings

**Accordions open again, and reactive bindings fail safe.** Accordions whose answer sits inside an
`.accordion-body > .accordion-content` pair showed an empty panel; they now open to the right
content. Domma Reactive 1.2 stops a binding from showing content when it is handed an observable
instead of its value, and expressions gain object and array literals.

🪗 **Accordion**

*   Each header now pairs with its outermost panel. Since 0.48.0 the panel selector matched both
    `.accordion-body` and the `.accordion-content` inside it, so every header after the first opened
    the wrong panel and an open item showed a zero-height inner panel. Domma CMS renders exactly that
    markup for `[accordion]` and collection accordions.

⚡ **Domma Reactive 1.2**

*   A binding whose expression resolves to a bare observable (`data-if="show"` rather than
    `show.value`) now warns once - `"show" is an observable, not its value - use "show.value"` - and
    reads as empty: `data-if` and `{{#if}}` hide, hidden/disabled/checked stay off, text and
    attributes render `''` instead of `[object Object]`. It used to show the content, because an
    observable object is truthy.

*   A virtual `<!-- dm if -->` nested in a virtual list body is left out of the rows instead of
    rendering in every one; the warning still points at `{{#if flag}}`.

*   Expressions accept object literals (`{a: x, 'b-c': y}`) and array literals (`[a, b]`). Computed
    keys, spread, methods and `__proto__`-style keys are refused with the position of the problem.
    Still no `eval` - the parser stays CSP-safe.

<!-- website -->

<p><strong>Accordions open again.</strong> Accordions whose answer sits inside a body and content pair - the markup Domma CMS renders - now open to the right panel instead of an empty one.</p>
<p><strong>Safer bindings.</strong> Domma Reactive 1.2 warns and hides content when a binding is handed an observable instead of its value, and expressions accept object and array literals.</p>
