/**
 * Undo, Redo & Clear - from public/showcase/elements/signature.
 */
export function mount(root) {
        // ── Section 5: Undo / Redo ───────────────────────────────────────
    const undoSig = E.signature(root.querySelector('#sig-undo'), {
          label: 'Undo / Redo Demo',
        });
    $(root).find('#undo-btn').on('click', () => undoSig.undo());
    $(root).find('#redo-btn').on('click', () => undoSig.redo());
    $(root).find('#clear-btn').on('click', () => undoSig.clear());
}
