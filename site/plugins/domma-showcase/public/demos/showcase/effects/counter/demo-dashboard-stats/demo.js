/**
 * Demo: Dashboard Stats - from public/showcase/effects/counter.
 */
export function mount(root) {
        // Store original values for restart
    const originals1 = [];
    $('.counter-demo-1').each((i, el) => originals1.push(el.textContent));
    let ctrl1;
        // Demo 1: Dashboard Stats
    $(root).find('#counter-start-1').on('click', () => {
          if (ctrl1) ctrl1.destroy();
          $('.counter-demo-1').each((i, el) => { el.textContent = originals1[i]; });
          ctrl1 = Domma.effects.counter('.counter-demo-1', {
            duration: 2000,
            stagger: 200,
            separator: ',',
            respectMotionPreference: false
          });
        });
    $(root).find('#counter-restart-1').on('click', () => {
          if (ctrl1) ctrl1.restart();
        });
}
