/**
 * Example 1: Simple Consent Bar - from public/showcase/elements/cookie-consent.
 */
export function mount(root) {
    let basicConsent, customConsent, positionConsent, apiConsent;
      // Basic consent example
    function showBasicConsent() {
        if (basicConsent) basicConsent.destroy();

        basicConsent = E.cookieConsent({
          message: 'We use cookies to improve your experience on our site.',
          privacyPolicyUrl: '#',
          storageKey: 'demo-basic-consent',
          autoShow: false,
          onAccept: (preferences) => {
            updateBasicStatus();
          },
          onReject: () => {
            updateBasicStatus();
          },
          onChange: () => {
            updateBasicStatus();
          }
        });

        basicConsent.show();
        updateBasicStatus();
      }
    function resetBasicConsent() {
        if (basicConsent) {
          basicConsent.reset();
          basicConsent.show();
          updateBasicStatus();
        }
      }
    function updateBasicStatus() {
        if (basicConsent) {
          $(root).find('#basic-state').text(basicConsent.getState());
          $(root).find('#basic-prefs').text(JSON.stringify(basicConsent.getPreferences(), null, 2));
        }
      }
      // Custom categories example
    function showCustomCategories() {
        if (customConsent) customConsent.destroy();

        customConsent = E.cookieConsent({
          message: 'We value your privacy. Choose which cookies you allow.',
          categories: {
            necessary: {
              label: 'Essential Cookies',
              description: 'These cookies are required for the website to function properly.',
              required: true
            },
            performance: {
              label: 'Performance Cookies',
              description: 'These cookies help us understand how you interact with our website.',
              required: false
            },
            marketing: {
              label: 'Marketing Cookies',
              description: 'These cookies are used to deliver personalized advertisements.',
              required: false
            }
          },
          privacyPolicyUrl: '#',
          storageKey: 'demo-custom-consent',
          autoShow: false,
          onAccept: (preferences) => {
            updateCustomStatus();
          },
          onChange: () => {
            updateCustomStatus();
          }
        });

        customConsent.show();
        updateCustomStatus();
      }
    function resetCustomCategories() {
        if (customConsent) {
          customConsent.reset();
          customConsent.show();
          updateCustomStatus();
        }
      }
    function updateCustomStatus() {
        if (customConsent) {
          $(root).find('#custom-state').text(customConsent.getState());
          $(root).find('#custom-prefs').text(JSON.stringify(customConsent.getPreferences(), null, 2));
        }
      }
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
        showBasicConsent();
    });
    $(root).find('[data-action="2"]').on('click', function (event) {
        resetBasicConsent();
    });
}
