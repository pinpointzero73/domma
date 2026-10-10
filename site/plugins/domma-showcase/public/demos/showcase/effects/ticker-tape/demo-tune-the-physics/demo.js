/**
 * Demo: Tune the Physics - from public/showcase/effects/ticker-tape.
 */
export function mount(root) {
        // ── Demo 3: Customisation ────────────────────────────────────────────
    const sliders = ['density', 'speed', 'sway', 'rotation', 'fade'];
    sliders.forEach(name => {
          $(`#opt-${name}`).on('input', (e) => {
            $(`#val-${name}`).text(e.target.value);
          });
        });
    let ctrl3 = null;
    function applyDemo3() {
          if (ctrl3) ctrl3.destroy();
          ctrl3 = Domma.effects.tickerTape('#tape-container-3', {
            palette: 'rainbow',
            density: parseInt($(root).find('#opt-density').val(), 10),
            speed: parseFloat($(root).find('#opt-speed').val()),
            sway: parseInt($(root).find('#opt-sway').val(), 10),
            rotationSpeed: parseFloat($(root).find('#opt-rotation').val()),
            fadeStart: parseFloat($(root).find('#opt-fade').val()),
            respectMotionPreference: false
          });
        }
    $(root).find('#apply-3').on('click', applyDemo3);
    $(root).find('#destroy-3').on('click', () => { if (ctrl3) { ctrl3.destroy(); ctrl3 = null; } });
    applyDemo3();
}
