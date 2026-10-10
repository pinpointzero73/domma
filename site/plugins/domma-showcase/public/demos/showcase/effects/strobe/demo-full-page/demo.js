/**
 * Demo: Full-Page - from public/showcase/effects/strobe.
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
    let activePreset = 'club';
        // ── Demo 3: Full-page ────────────────────────────────────────────────
    let ctrl3 = null;
    const badge3 = $(root).find('#status-3');
    $(root).find('#start-3').on('click', () => {
          if (ctrl3) ctrl3.destroy();
          ctrl3 = Domma.effects.strobe(null, {
            preset: activePreset,
            respectMotionPreference: false
          });
          setStatus(badge3, 'running');
        });
    $(root).find('#stop-3').on('click', () => { if (ctrl3) { ctrl3.stop(); ctrl3 = null; setStatus(badge3, 'stopped'); } });
        // ── Cleanup full-page on navigation ─────────────────────────────────
    $(window).on('beforeunload', () => {
          if (ctrl3) ctrl3.destroy();
        });
}
