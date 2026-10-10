/**
 * Demo: Theme-Aware Palette - from public/showcase/effects/ticker-tape.
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
        // ── Demo 1: Theme-aware container ────────────────────────────────────
    let ctrl1 = null;
    const badge1 = $(root).find('#status-1');
    $(root).find('#start-1').on('click', () => {
          if (ctrl1) ctrl1.destroy();
          ctrl1 = Domma.effects.tickerTape('#tape-container-1', {
            palette: 'theme',
            density: 50,
            respectMotionPreference: false
          });
          setStatus(badge1, 'running');
        });
    $(root).find('#pause-1').on('click', () => { if (ctrl1) { ctrl1.pause(); setStatus(badge1, 'paused'); } });
    $(root).find('#resume-1').on('click', () => { if (ctrl1) { ctrl1.resume(); setStatus(badge1, 'running'); } });
    $(root).find('#restart-1').on('click', () => { if (ctrl1) { ctrl1.restart(); setStatus(badge1, 'running'); } });
    $(root).find('#destroy-1').on('click', () => { if (ctrl1) { ctrl1.destroy(); ctrl1 = null; setStatus(badge1, 'stopped'); } });
}
