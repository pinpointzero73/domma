/**
 * Demo: Form Validation - from public/showcase/effects/shake.
 */
export function mount(root) {
        // Demo 3: Form Validation
    $(root).find('#shake-validate').on('click', () => {
          const email = $(root).find('#shake-email').val();
          const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

          if (!isValid) {
            $(root).find('#shake-email').addClass('invalid');
            $(root).find('#shake-error').show();
            Domma.effects.shake('#shake-email', {
              intensity: 4,
              duration: 400,
              respectMotionPreference: false,
              onComplete: () => {
                setTimeout(() => {
                  $(root).find('#shake-email').removeClass('invalid');
                  $(root).find('#shake-error').hide();
                }, 2000);
              }
            });
          } else {
            $(root).find('#shake-email').removeClass('invalid');
            $(root).find('#shake-error').hide();
            E.toast('Valid email!', { type: 'success' });
          }
        });
}
