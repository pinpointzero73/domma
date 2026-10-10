/**
 * Pen Options - from public/showcase/elements/signature.
 */
export function mount(root) {
        // ── Section 3: Pen Options ───────────────────────────────────────
    E.signature(root.querySelector('#sig-colours'), {
          penColour: '#1e40af',
          colours: ['#000000', '#1e40af', '#15803d', '#b91c1c', '#7c3aed', '#ea580c'],
          widths: [1, 2, 4],
        });
    E.signature(root.querySelector('#sig-thin'), {
          penColour: '#111',
          penWidth: 1,
          widths: [1],
          guideLine: false,
          placeholder: 'Sign with a fine nib',
        });
}
