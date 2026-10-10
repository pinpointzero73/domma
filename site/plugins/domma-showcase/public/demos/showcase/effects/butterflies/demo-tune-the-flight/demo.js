/**
 * Demo: Tune the Flight - from public/showcase/effects/butterflies.
 */
export function mount(root) {
        // ── Demo 3: Customisation ────────────────────────────────────────────
    const sliders = ['density', 'speed', 'wander', 'rise', 'flap'];
    sliders.forEach(name => {
          $(`#opt-${name}`).on('input', (e) => {
            $(`#val-${name}`).text(e.target.value);
          });
        });
    let ctrl3 = null;
    function applyDemo3() {
          if (ctrl3) ctrl3.destroy();
          ctrl3 = Domma.effects.butterflies('#butterfly-container-3', {
            palette: 'meadow',
            density:   parseInt($(root).find('#opt-density').val(), 10),
            speed:     parseFloat($(root).find('#opt-speed').val()),
            wander:    parseFloat($(root).find('#opt-wander').val()),
            riseSpeed: parseFloat($(root).find('#opt-rise').val()),
            flapSpeed: parseFloat($(root).find('#opt-flap').val()),
            respectMotionPreference: false
          });
        }
    $(root).find('#apply-3').on('click', applyDemo3);
    $(root).find('#destroy-3').on('click', () => { if (ctrl3) { ctrl3.destroy(); ctrl3 = null; } });
    applyDemo3();
}
