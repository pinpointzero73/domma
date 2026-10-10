/**
 * Position Options - from public/showcase/elements/cookie-consent.
 */
export function mount(root) {
    let basicConsent, customConsent, positionConsent, apiConsent;
      // Position examples
    function showPosition(position, layout) {
        if (positionConsent) positionConsent.destroy();

        const theme = position === 'top' || position === 'bottom' ? 'dark' : 'light';

        positionConsent = E.cookieConsent({
          message: `This is a ${position} ${layout} consent.`,
          position: position,
          layout: layout,
          theme: theme,
          backdrop: layout === 'modal',
          privacyPolicyUrl: '#',
          storageKey: 'demo-position-consent',
          autoShow: false
        });

        positionConsent.show();
      }

    // Handlers the old page had inline (onclick=…), wired here.
    $(root).find('[data-action="1"]').on('click', function (event) {
        showPosition('bottom', 'bar');
    });
    $(root).find('[data-action="2"]').on('click', function (event) {
        showPosition('top', 'bar');
    });
    $(root).find('[data-action="3"]').on('click', function (event) {
        showPosition('bottom-left', 'box');
    });
    $(root).find('[data-action="4"]').on('click', function (event) {
        showPosition('bottom-right', 'box');
    });
    $(root).find('[data-action="5"]').on('click', function (event) {
        showPosition('center-modal', 'modal');
    });
}
