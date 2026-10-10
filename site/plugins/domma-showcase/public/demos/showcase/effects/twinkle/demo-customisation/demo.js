/**
 * Demo: Customisation - from public/showcase/effects/twinkle.
 */
export function mount(root) {
        // ── Demo 3: Customisation ─────────────────────────────────────────────
    let ctrl3 = null;
    let selectedColour = 'rgba(255, 240, 200, 1)';
    _.each(['count', 'min-size', 'max-size', 'speed'], id => {
          const $el = $('#opt-' + id);
          const $val = $('#val-' + id);
          if ($el.length && $val.length) {
            $el.on('input', () => $val.text($el.val()));
          }
        });
    $('.colour-btn').on('click', function () {
          selectedColour = $(this).attr('data-colour');
          $('.colour-btn').removeClass('active');
          $(this).addClass('active');
        });
    $(root).find('#apply-3').on('click', () => {
          if (ctrl3) ctrl3.destroy();
          ctrl3 = Domma.effects.twinkle('#star-container-3', {
            count: parseInt($(root).find('#opt-count').val(), 10),
            minSize: parseFloat($(root).find('#opt-min-size').val()),
            maxSize: parseFloat($(root).find('#opt-max-size').val()),
            twinkleSpeed: parseFloat($(root).find('#opt-speed').val()),
            colour: selectedColour,
            respectMotionPreference: false
          });
        });
    $(root).find('#destroy-3').on('click', () => {
          if (ctrl3) { ctrl3.destroy(); ctrl3 = null; }
        });
}
