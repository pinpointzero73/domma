/**
 * Declarative Setup - from public/showcase/elements/cookie-consent.
 */
export function mount(root) {
      // Config example
    function showConfigExample() {
        $.setup({
          'body': {
            component: 'cookieConsent',
            options: {
              message: 'This consent was created using the Config Engine.',
              position: 'bottom-left',
              layout: 'box',
              theme: 'dark',
              privacyPolicyUrl: '#',
              cookiePolicyUrl: '#',
              storageKey: 'demo-config-consent',
              autoShow: true
            }
          }
        });
      }

    // Handlers the old page had inline (onclick=…), wired here.
    $(root).find('[data-action="1"]').on('click', function (event) {
        showConfigExample();
    });
}
