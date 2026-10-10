/**
 * Type Fallback - from public/showcase/elements/signature.
 */
export function mount(root) {
        // ── Section 6: Type Fallback ─────────────────────────────────────
    E.signature(root.querySelector('#sig-type'), {
          label: 'Draw or Type',
          typeFallback: true,
          placeholder: 'Switch to Type mode to type your name',
        });
}
