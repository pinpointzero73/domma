/**
 * Demo: Build Your Own - from public/showcase/effects/strobe.
 */
export function mount(root) {
        // ── Demo 2: Build your own ───────────────────────────────────────────
    const readouts = ['arc', 'hz', 'speed', 'beam', 'intensity'];
    readouts.forEach(name => {
          $(`#opt-${name}`).on('input', (e) => { $(`#val-${name}`).text(e.target.value); });
        });
    let ctrl2 = null;
    $(root).find('#apply-2').on('click', () => {
          if (ctrl2) ctrl2.destroy();
          const origins = $('.opt-origin:checked').get().map(c => c.value);
          ctrl2 = Domma.effects.strobe('#strobe-container-2', {
            origins: origins.length ? origins : ['tl'],
            motion: $(root).find('#opt-motion').val(),
            flicker: $(root).find('#opt-flicker').prop('checked'),
            sweepArc: parseFloat($(root).find('#opt-arc').val()),
            hz: parseFloat($(root).find('#opt-hz').val()),
            speed: parseFloat($(root).find('#opt-speed').val()),
            beamWidth: parseFloat($(root).find('#opt-beam').val()),
            intensity: parseFloat($(root).find('#opt-intensity').val()),
            colours: [$(root).find('#colour-a').val(), $(root).find('#colour-b').val()],
            respectMotionPreference: false
          });
        });
    $(root).find('#stop-2').on('click', () => {
        ctrl2?.destroy();
        ctrl2 = null;
    });
    return () => ctrl2?.destroy();
}
