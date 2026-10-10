/**
 * Demo: Preset Picker - from public/showcase/effects/strobe.
 */
export function mount(root) {
        // ── Status badge helper ───────────────────────────────────────────────
    function setStatus($badge, state) {
          if (!$badge || !$badge.length) return;
          const labels = { running: 'Running', paused: 'Paused', stopped: 'Stopped' };
          $badge.attr('class', 'status-badge ' + state);
          $badge.find('.status-dot')
                .attr('class', 'status-dot' + (state === 'running' ? ' pulse-dot' : ''));
          $badge.find('.status-text').text(labels[state] || state);
        }
        // ── Preset swatch colours (for the picker dots only) ─────────────────
    const presetColours = {
          club:        ['#ff0066', '#00e5ff', '#ffee00', '#00ff88'],
          concert:     ['#ef4444', '#f97316', '#facc15', '#22c55e', '#0ea5e9', '#a855f7'],
          police:      ['#ff2222', '#2244ff'],
          searchlight: ['#ffffff', '#e5e7eb'],
          scanner:     ['#22d3ee', '#06b6d4'],
          mood:        ['#fbcfe8', '#bae6fd', '#bbf7d0', '#ddd6fe']
        };
    let activePreset = 'club';
    function renderPresetCard(name) {
          const dots = presetColours[name].map(c => `<span style="background:${c}"></span>`).join('');
          return `
            <div class="preset-card${name === activePreset ? ' active' : ''}" data-preset="${name}">
              <div class="preset-name">${name}</div>
              <div class="preset-dots">${dots}</div>
            </div>`;
        }
        // Note: pass {safe: false} because Domma's default html() sanitiser strips
        // both inline `style` attributes and `data-*` attributes - we'd lose the
        // swatch colours AND the data-preset hook the click handler reads.
    const pickerMarkup = Object.keys(presetColours).map(renderPresetCard).join('');
    $(root).find('#preset-picker').html(pickerMarkup, { safe: false });
    $(root).find('#preset-picker').on('click', (e) => {
          const card = e.target.closest('.preset-card');
          if (!card) return;
          $('#preset-picker .preset-card').removeClass('active');
          card.classList.add('active');
          activePreset = card.getAttribute('data-preset');
        });
        // ── Demo 1: Preset picker ────────────────────────────────────────────
    let ctrl1 = null;
    const badge1 = $(root).find('#status-1');
    $(root).find('#start-1').on('click', () => {
          if (ctrl1) ctrl1.destroy();
          ctrl1 = Domma.effects.strobe('#strobe-container-1', {
            preset: activePreset,
            respectMotionPreference: false
          });
          setStatus(badge1, 'running');
        });
    $(root).find('#pause-1').on('click', () => { if (ctrl1) { ctrl1.pause(); setStatus(badge1, 'paused'); } });
    $(root).find('#resume-1').on('click', () => { if (ctrl1) { ctrl1.resume(); setStatus(badge1, 'running'); } });
    $(root).find('#stop-1').on('click', () => { if (ctrl1) { ctrl1.stop(); ctrl1 = null; setStatus(badge1, 'stopped'); } });
}
