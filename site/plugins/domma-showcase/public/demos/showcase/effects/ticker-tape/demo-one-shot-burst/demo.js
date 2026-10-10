/**
 * Demo: One-Shot Burst - from public/showcase/effects/ticker-tape.
 */
export function mount(root) {
        // ── Demo 4: Burst ────────────────────────────────────────────────────
    $(root).find('#burst-4').on('click', () => {
          Domma.effects.tickerTape('#tape-container-4', {
            palette: 'gold',
            burst: true,
            burstCount: 220,
            speed: 1.4,
            respectMotionPreference: false
          });
        });
}
