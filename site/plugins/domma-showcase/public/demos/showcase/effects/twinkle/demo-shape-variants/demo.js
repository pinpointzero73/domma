/**
 * Demo: Shape Variants - from public/showcase/effects/twinkle.
 */
export function mount(root) {
        // ── Demo 4: Shape variants ────────────────────────────────────────────
    let ctrlStar = null;
    let ctrlCircle = null;
    $(root).find('#start-shapes').on('click', () => {
          if (ctrlStar) ctrlStar.destroy();
          if (ctrlCircle) ctrlCircle.destroy();
          ctrlStar = Domma.effects.twinkle('#shape-star', {
            count: 60,
            shape: 'star',
            respectMotionPreference: false
          });
          ctrlCircle = Domma.effects.twinkle('#shape-circle', {
            count: 60,
            shape: 'circle',
            respectMotionPreference: false
          });
        });
    $(root).find('#destroy-shapes').on('click', () => {
          if (ctrlStar) { ctrlStar.destroy(); ctrlStar = null; }
          if (ctrlCircle) { ctrlCircle.destroy(); ctrlCircle = null; }
        });
}
