/**
 * User-Initiated Preference Management - from public/showcase/elements/cookie-consent.
 */
export function mount(root) {
    let basicConsent, customConsent, positionConsent, apiConsent;
      // API example
    function initApiExample() {
        if (!apiConsent) {
          apiConsent = E.cookieConsent({
            message: 'API Example - Control this consent programmatically.',
            position: 'bottom-right',
            layout: 'box',
            privacyPolicyUrl: '#',
            storageKey: 'demo-api-consent',
            autoShow: false,
            reopenSelector: '[data-cookie-consent-open]'
          });
        }
      }
      // Initialize API example for reopen trigger
    initApiExample();
}
