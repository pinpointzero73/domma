/**
 * Demo: Choose a Palette - from public/showcase/effects/butterflies.
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
    const pickerMarkup = Object.keys(palettes).map(n => renderPaletteCard(n, true)).join('');
    $(root).find('#palette-picker').html(pickerMarkup, { safe: false });
        // ── Demo 2: Palette picker ───────────────────────────────────────────
    let ctrl2 = Domma.effects.butterflies('#butterfly-container-2', {
          palette: 'meadow',
          density: 18,
          respectMotionPreference: false
        });
    $(root).find('#palette-picker').on('click', (e) => {
          const card = e.target.closest('.palette-card');
          if (!card) return;
          $('#palette-picker .palette-card').removeClass('active');
          card.classList.add('active');
          const name = card.getAttribute('data-palette');
          if (ctrl2) ctrl2.destroy();
          ctrl2 = Domma.effects.butterflies('#butterfly-container-2', {
            palette: name,
            density: 18,
            respectMotionPreference: false
          });
        });
}
