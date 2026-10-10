/**
 * Demo: One-Shot Release - from public/showcase/effects/butterflies.
 */
export function mount(root) {
        // ── Demo 4: One-shot release ─────────────────────────────────────────
    $(root).find('#burst-4').on('click', () => {
          Domma.effects.butterflies('#butterfly-container-4', {
            palette: 'pastel',
            burst: true,
            burstCount: 30,
            speed: 1.2,
            respectMotionPreference: false
          });
        });
}
