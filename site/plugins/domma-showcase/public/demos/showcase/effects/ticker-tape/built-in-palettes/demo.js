/**
 * Built-in Palettes - from public/showcase/effects/ticker-tape.
 */
export function mount(root) {
        // ── Render palette swatches ──────────────────────────────────────────
    const palettes = {
          theme:   ['var(--dm-primary)', 'var(--dm-success)', 'var(--dm-warning)', 'var(--dm-danger)', 'var(--dm-info)'],
          rainbow: ['#ef4444', '#f97316', '#facc15', '#22c55e', '#0ea5e9', '#6366f1', '#a855f7', '#ec4899'],
          festive: ['#dc2626', '#16a34a', '#fbbf24', '#3b82f6', '#a855f7', '#ec4899'],
          gold:    ['#fbbf24', '#f59e0b', '#fde68a', '#fffbeb', '#d97706', '#fcd34d'],
          silver:  ['#e5e7eb', '#cbd5e1', '#94a3b8', '#f8fafc', '#9ca3af', '#d1d5db'],
          pastel:  ['#fbcfe8', '#bae6fd', '#bbf7d0', '#fef3c7', '#ddd6fe', '#fed7aa'],
          mono:    ['#1f2937', '#4b5563', '#9ca3af', '#d1d5db', '#f3f4f6'],
          sunset:  ['#f43f5e', '#fb923c', '#facc15', '#f59e0b', '#ec4899'],
          ocean:   ['#0ea5e9', '#22d3ee', '#06b6d4', '#3b82f6', '#6366f1'],
          forest:  ['#16a34a', '#65a30d', '#84cc16', '#22c55e', '#15803d'],
          bridal:  ['#ffffff', '#fef3c7', '#fce7f3', '#fbcfe8', '#f9a8d4']
        };
    function renderPaletteCard(name, isPicker) {
          const stripes = palettes[name].map(c => `<span style="background:${c}"></span>`).join('');
          return `
            <div class="palette-card${(isPicker && name === 'theme') ? ' active' : ''}" data-palette="${name}">
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
