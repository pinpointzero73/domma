/**
 * Export Formats - from public/showcase/elements/signature.
 */
export function mount(root) {
        // ── Section 4: Export Formats ────────────────────────────────────
    const exportSig = E.signature(root.querySelector('#sig-export'), {
          label: 'Export Demo',
        });
    function showExport(format) {
          if (exportSig.isEmpty()) {
            E.toast('Draw a signature first.', { type: 'warning' });
            return;
          }
          const data = exportSig.toBase64(format);
          $(root).find('#export-preview').attr('src', data).show();
          $(root).find('#export-label').text(`Format: ${format.toUpperCase()} | Length: ${data.length} chars`).show();
        }
    $(root).find('#export-png-btn').on('click', () => showExport('png'));
    $(root).find('#export-svg-btn').on('click', () => showExport('svg'));
}
