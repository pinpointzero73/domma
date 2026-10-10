/**
 * Demo: Full-Page Overlay - from public/showcase/effects/ticker-tape.
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
        // ── Demo 5: Full-page overlay ───────────────────────────────────────
    let ctrl5 = null;
    const badge5 = $(root).find('#status-5');
    $(root).find('#start-5').on('click', () => {
          if (ctrl5) ctrl5.destroy();
          ctrl5 = Domma.effects.tickerTape(null, {
            palette: 'rainbow',
            density: 80,
            zIndex: 9999,
            respectMotionPreference: false
          });
          setStatus(badge5, 'running');
        });
    $(root).find('#pause-5').on('click', () => { if (ctrl5) { ctrl5.pause(); setStatus(badge5, 'paused'); } });
    $(root).find('#resume-5').on('click', () => { if (ctrl5) { ctrl5.resume(); setStatus(badge5, 'running'); } });
    $(root).find('#destroy-5').on('click', () => { if (ctrl5) { ctrl5.destroy(); ctrl5 = null; setStatus(badge5, 'stopped'); } });
        // ── Cleanup full-page on navigation ─────────────────────────────────
    $(window).on('beforeunload', () => {
          if (ctrl5) ctrl5.destroy();
        });
}
