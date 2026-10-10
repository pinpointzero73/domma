/**
 * Built-in Palettes - from public/showcase/effects/butterflies.
 */
export function mount(root) {
        // ── Render palette swatches ──────────────────────────────────────────
    const palettes = {
          theme:   ['var(--dm-primary)', 'var(--dm-success)', 'var(--dm-warning)', 'var(--dm-danger)', 'var(--dm-info)'],
          meadow:  ['#84cc16', '#a3e635', '#bbf7d0', '#bae6fd', '#fef08a', '#ddd6fe'],
          pastel:  ['#fbcfe8', '#bae6fd', '#bbf7d0', '#fef3c7', '#ddd6fe', '#fed7aa'],
          rainbow: ['#ef4444', '#f97316', '#facc15', '#22c55e', '#0ea5e9', '#6366f1', '#a855f7', '#ec4899'],
          sunset:  ['#f43f5e', '#fb923c', '#facc15', '#f59e0b', '#ec4899']
        };
    function renderPaletteCard(name, isPicker) {
          const stripes = palettes[name].map(c => `<span style="background:${c}"></span>`).join('');
          return `
            <div class="palette-card${(isPicker && name === 'meadow') ? ' active' : ''}" data-palette="${name}">
              <div class="palette-name">${name}</div>
              <div class="palette-stripes">${stripes}</div>
            </div>`;
        }
        // Note: pass {safe: false} because Domma's default html() sanitiser strips
        // both inline `style` attributes and `data-*` attributes - we'd lose the
        // swatch colours AND the data-palette hook the click handler reads.
    const previewMarkup = Object.keys(palettes).map(n => renderPaletteCard(n, false)).join('');
    $(root).find('#palette-preview').html(previewMarkup, { safe: false });
}
