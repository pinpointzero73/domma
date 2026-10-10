/**
 * Demo: Full-Page Overlay - from public/showcase/effects/twinkle.
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
        // ── Demo 2: Full-page overlay ─────────────────────────────────────────
    let ctrl2 = null;
    const badge2 = $(root).find('#status-2');
    $(root).find('#start-2').on('click', () => {
          if (ctrl2) ctrl2.destroy();
          ctrl2 = Domma.effects.twinkle(null, {
            count: 120,
            colour: 'rgba(255, 240, 200, 0.85)',
            zIndex: 0,
            respectMotionPreference: false
          });
          setStatus(badge2, 'running');
        });
    $(root).find('#pause-2').on('click', () => {
          if (ctrl2) { ctrl2.pause(); setStatus(badge2, 'paused'); }
        });
    $(root).find('#resume-2').on('click', () => {
          if (ctrl2) { ctrl2.resume(); setStatus(badge2, 'running'); }
        });
    $(root).find('#destroy-2').on('click', () => {
          if (ctrl2) { ctrl2.destroy(); ctrl2 = null; setStatus(badge2, 'stopped'); }
        });
}
