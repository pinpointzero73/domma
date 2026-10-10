/**
 * Granular Cookie Control - from public/showcase/elements/cookie-consent.
 */
export function mount(root) {
    let basicConsent, customConsent, positionConsent, apiConsent;
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

    // Handlers the old page had inline (onclick=…), wired here.
    $(root).find('[data-action="1"]').on('click', function (event) {
        showCustomCategories();
    });
    $(root).find('[data-action="2"]').on('click', function (event) {
        resetCustomCategories();
    });
}
