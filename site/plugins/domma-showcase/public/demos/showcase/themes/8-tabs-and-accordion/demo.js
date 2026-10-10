/**
 * 8. Tabs & Accordion - from public/showcase/themes.
 */
export function mount(root) {
      // ── Initialise every Domma component ─────────────────────────────────
    E.tabs(root.querySelector('#audit-tabs'));
    E.accordion(root.querySelector('#audit-accordion'));
}
