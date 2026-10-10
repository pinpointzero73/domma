/**
 * Live Demo - from public/showcase/elements/signature.
 */
export function mount(root) {
        // ── Section 1: Overview ──────────────────────────────────────────
    const overviewSig = E.signature(root.querySelector('#sig-overview'), {
          label: 'Signature Pad',
          placeholder: 'Draw your signature here',
        });
    $(root).find('#overview-export-btn').on('click', () => {
          if (overviewSig.isEmpty()) {
            E.toast('Pad is empty - draw something first.', { type: 'warning' });
            return;
          }
          const b64 = overviewSig.toBase64('png');
          $(root).find('#overview-output').html(`<img src="${b64}" style="max-height:80px;background:#fff;color:var(--dm-gray-900);border-radius:4px;padding:4px;">`);
        });
    $(root).find('#overview-isEmpty-btn').on('click', () => {
          const empty = overviewSig.isEmpty();
          $(root).find('#overview-output').text(`isEmpty() → ${empty}`);
        });
}
