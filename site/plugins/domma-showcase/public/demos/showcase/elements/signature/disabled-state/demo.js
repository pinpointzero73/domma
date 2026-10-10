/**
 * Disabled State - from public/showcase/elements/signature.
 */
export function mount(root) {
        // ── Section 7: Disabled ──────────────────────────────────────────
    const disabledSig = E.signature(root.querySelector('#sig-disabled'), {
          label: 'Locked Pad',
          disabled: true,
          placeholder: 'This pad is currently locked',
        });
    $(root).find('#enable-btn').on('click', () => disabledSig.enable());
    $(root).find('#disable-btn').on('click', () => disabledSig.disable());
}
